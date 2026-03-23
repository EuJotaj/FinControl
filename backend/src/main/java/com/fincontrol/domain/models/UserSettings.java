package com.fincontrol.domain.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

import org.hibernate.annotations.TenantId;

@Entity
@Table(name = "user_settings", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "tenant_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSettings {

    @TenantId
    @Column(name = "tenant_id")
    private String tenantId;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String language = "pt-BR";

    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "BRL";

    @Column(nullable = false)
    @Builder.Default
    private Boolean pushNotifications = true;

    @Column(nullable = false)
    @Builder.Default
    private Boolean emailSummary = false;

    @Column(nullable = false)
    @Builder.Default
    private Boolean twoFactorAuth = false;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
