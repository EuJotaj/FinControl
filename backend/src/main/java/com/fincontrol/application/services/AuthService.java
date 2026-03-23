package com.fincontrol.application.services;

import com.fincontrol.infrastructure.config.JwtTokenProvider;
import com.fincontrol.application.dtos.AuthDTOs.*;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.fincontrol.domain.repositories.TenantRepository;
import com.fincontrol.domain.models.Tenant;
import com.fincontrol.infrastructure.tenant.TenantContext;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final TenantRepository tenantRepository;
    private final com.fincontrol.domain.repositories.TeamMemberRepository teamMemberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final NotificationService notificationService;

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Senha inválida");
        }

        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        String activeTenantId = teamMemberRepository.findByUser(user)
                .stream()
                .findFirst()
                .map(m -> m.getTenant().getId().toString())
                .orElse(null);

        return AuthResponse.builder()
                .token(token)
                .user(mapToDTO(user))
                .activeTenantId(activeTenantId)
                .build();
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("E-mail já está em uso");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(User.Role.USER)
                .avatarUrl("https://ui-avatars.com/api/?name=" + request.getName().replace(" ", "+") + "&background=6366f1&color=fff")
                .build();

        userRepository.save(user);

        // Criar o Workspace (Tenant) Pessoal do usuário recém-criado
        Tenant personalTenant = Tenant.builder()
                .name("Default")
                .build();
        tenantRepository.save(personalTenant);
        
        // Associar o usuário como OWNER do novo Workspace
        com.fincontrol.domain.models.TeamMember member = com.fincontrol.domain.models.TeamMember.builder()
                .user(user)
                .tenant(personalTenant)
                .role(com.fincontrol.domain.models.TeamRole.OWNER)
                .build();
        teamMemberRepository.save(member);
        
        // Ativar o Tenant para que as configurações e notificações sejam vinculadas a este Workspace default
        TenantContext.setCurrentTenant(personalTenant.getId().toString());

        // Notificação de boas-vindas
        notificationService.createNotification(
            user,
            "Bem-vindo ao FinControl! 🎉",
            "Sua conta foi criada com sucesso. Comece adicionando suas transações e metas financeiras.",
            com.fincontrol.domain.models.Notification.NotificationType.SUCCESS
        );

        TenantContext.clear();

        String token = jwtTokenProvider.generateToken(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(mapToDTO(user))
                .activeTenantId(personalTenant.getId().toString())
                .build();
    }

    private UserDTO mapToDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
