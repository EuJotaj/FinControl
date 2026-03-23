package com.fincontrol.domain.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.UUID;

import org.hibernate.annotations.TenantId;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "credit_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreditCard {

    @TenantId
    @Column(name = "tenant_id")
    private String tenantId;
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "Bank name is required")
    private String bank;

    @NotBlank(message = "Last digits are required")
    private String lastDigits;

    @JsonProperty("limit")
    @NotNull(message = "Limit is required")
    @PositiveOrZero(message = "Limit must be zero or positive")
    private Double cardLimit;

    @NotNull(message = "Used amount is required")
    @PositiveOrZero(message = "Used amount must be zero or positive")
    private Double used;

    private String color;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
