package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.TeamMember;
import com.fincontrol.domain.models.Tenant;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamMemberRepository extends JpaRepository<TeamMember, UUID> {
    List<TeamMember> findByUser(User user);
    List<TeamMember> findByTenant(Tenant tenant);
    Optional<TeamMember> findByUserAndTenant(User user, Tenant tenant);
}
