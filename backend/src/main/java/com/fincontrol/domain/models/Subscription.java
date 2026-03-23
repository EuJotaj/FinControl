package com.fincontrol.domain.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;
import java.time.LocalDate;

import org.hibernate.annotations.TenantId;

@Entity
@Table(name = "subscriptions")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

    @TenantId
    @Column(name = "tenant_id", nullable = false)
    private String tenantId;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Next billing date is required")
    private LocalDate nextBillingDate;

    @NotBlank(message = "Frequency is required")
    private String frequency; // e.g., MONTHLY, YEARLY

    private String icon;

    @NotNull(message = "Status is required")
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.ACTIVE;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public enum SubscriptionStatus {
        ACTIVE, CANCELED, PAUSED, PAID
    }
}
