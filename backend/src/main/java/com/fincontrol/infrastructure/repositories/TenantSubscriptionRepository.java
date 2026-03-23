package com.fincontrol.infrastructure.repositories;

import com.fincontrol.domain.models.TenantSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface TenantSubscriptionRepository extends JpaRepository<TenantSubscription, UUID> {
    Optional<TenantSubscription> findByTenantId(String tenantId);
    Optional<TenantSubscription> findByMpSubscriptionId(String mpSubscriptionId);
    Optional<TenantSubscription> findByMpPreapprovalId(String mpPreapprovalId);
}
