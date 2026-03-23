package com.fincontrol.domain.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.TenantId;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tenant_subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantSubscription {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Column(name = "mp_subscription_id")
    private String mpSubscriptionId;

    @Column(name = "mp_preapproval_id")
    private String mpPreapprovalId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status;

    @Column(name = "current_period_end")
    private LocalDateTime currentPeriodEnd;

    @Column(name = "plan_type")
    private String planType;

    public enum SubscriptionStatus {
        ACTIVE, PAST_DUE, CANCELLED, PENDING
    }
}
