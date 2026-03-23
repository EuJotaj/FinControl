package com.fincontrol.application.services;

import com.fincontrol.application.dtos.WorkspaceDTOs.CreateWorkspaceRequest;
import com.fincontrol.application.dtos.WorkspaceDTOs.WorkspaceResponse;
import com.fincontrol.domain.models.TeamMember;
import com.fincontrol.domain.models.TeamRole;
import com.fincontrol.domain.models.Tenant;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.TeamMemberRepository;
import com.fincontrol.domain.repositories.TenantRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;

    @Transactional
    public List<WorkspaceResponse> getUserWorkspaces() {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<TeamMember> teamMemberships = teamMemberRepository.findByUser(user);

        // Se o usuário não estiver em nenhum workspace, cria um automaticamente
        if (teamMemberships.isEmpty()) {
            WorkspaceResponse defaultWs = createWorkspace(CreateWorkspaceRequest.builder().name("Default").build());
            return List.of(defaultWs);
        }

        return teamMemberships.stream()
                .map(membership -> WorkspaceResponse.builder()
                        .id(membership.getTenant().getId())
                        .name(membership.getTenant().getName())
                        .planName(membership.getTenant().getPlan() != null ? membership.getTenant().getPlan().getName() : "Free")
                        .userRole(membership.getRole())
                        .joinedAt(membership.getJoinedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkspaceResponse createWorkspace(CreateWorkspaceRequest request) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Tenant tenant = Tenant.builder()
                .name(request.getName())
                .createdAt(LocalDateTime.now())
                .build();
        
        tenant = tenantRepository.save(tenant);

        TeamMember membership = TeamMember.builder()
                .user(user)
                .tenant(tenant)
                .role(TeamRole.OWNER)
                .joinedAt(LocalDateTime.now())
                .build();
        
        teamMemberRepository.save(membership);

        return WorkspaceResponse.builder()
                .id(tenant.getId())
                .name(tenant.getName())
                .planName("Free")
                .userRole(TeamRole.OWNER)
                .joinedAt(membership.getJoinedAt())
                .build();
    }

    @Transactional
    public void deleteWorkspace(String workspaceId) {
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        List<TeamMember> memberships = teamMemberRepository.findByUser(user);
        
        // Impedir ficar sem nenhum workspace
        if (memberships.size() <= 1) {
            throw new RuntimeException("Você deve possuir pelo menos um workspace.");
        }

        TeamMember membershipToDelete = memberships.stream()
                .filter(m -> m.getTenant().getId().toString().equals(workspaceId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Workspace não encontrado ou você não tem acesso."));

        // Proteção para o workspace Default
        if ("Default".equalsIgnoreCase(membershipToDelete.getTenant().getName())) {
            throw new RuntimeException("O workspace Default não pode ser excluído.");
        }

        if (membershipToDelete.getRole() != TeamRole.OWNER) {
            throw new RuntimeException("Apenas o proprietário pode excluir o workspace.");
        }

        // Deletar o vínculo
        teamMemberRepository.delete(membershipToDelete);
        
        // Se ninguém mais estiver nesse tenant, deletar o tenant
        // (Isso é opcional, mas ajuda na limpeza)
        Tenant tenant = membershipToDelete.getTenant();
        if (teamMemberRepository.findByTenant(tenant).isEmpty()) {
            tenantRepository.delete(tenant);
        }
    }
}
