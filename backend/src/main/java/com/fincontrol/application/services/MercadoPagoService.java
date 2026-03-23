package com.fincontrol.application.services;

import com.fincontrol.domain.models.TenantSubscription;
import com.fincontrol.infrastructure.repositories.TenantSubscriptionRepository;
import com.fincontrol.infrastructure.tenant.TenantContext;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.mercadopago.MercadoPagoConfig;
import com.mercadopago.client.preference.*;
import com.mercadopago.resources.preference.Preference;
import jakarta.annotation.PostConstruct;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class MercadoPagoService {

    @Value("${mercadopago.access.token:TEST-dummy-token}")
    private String accessToken;

    private final TenantSubscriptionRepository subscriptionRepository;

    public MercadoPagoService(TenantSubscriptionRepository subscriptionRepository) {
        this.subscriptionRepository = subscriptionRepository;
    }

    @PostConstruct
    public void init() {
        MercadoPagoConfig.setAccessToken(accessToken);
    }

    public String createSubscriptionCheckout(String tenantId, String planType, Double price) {
        try {
            // If we are doing a standard recurring plan, MP has Preapproval.
            // For simplicity and immediate checkout, we generate a Preference. 
            // In a real SaaS, this would be a Preapproval (Subscription) or Wallet routing.
            PreferenceClient client = new PreferenceClient();
            
            PreferenceItemRequest item = PreferenceItemRequest.builder()
                    .title("Plano " + planType + " - FinControl")
                    .quantity(1)
                    .unitPrice(new BigDecimal(price.toString()))
                    .currencyId("BRL")
                    .build();

            PreferenceRequest request = PreferenceRequest.builder()
                    .items(Collections.singletonList(item))
                    .build();

            Preference preference = client.create(request);
            
            // Register an initial PENDING subscription
            TenantSubscription sub = subscriptionRepository.findByTenantId(tenantId).orElse(new TenantSubscription());
            sub.setTenantId(tenantId);
            sub.setPlanType(planType);
            sub.setStatus(TenantSubscription.SubscriptionStatus.PENDING);
            // using preference id as a tracking id
            sub.setMpPreapprovalId(preference.getId()); 
            subscriptionRepository.save(sub);

            return preference.getInitPoint();
        } catch (Exception e) {
            e.printStackTrace();
            return "https://www.mercadopago.com.br/checkout/v1/redirect"; // Mock url on failure if token is dummy
        }
    }

    public void processWebhook(String topic, String id) {
        // Mock webhook processing logic. In real world, we fetch the payment/subscription from MP by ID
        // and update our database.
        
        // Let's assume the ID passed matches our mpPreapprovalId, or it's a payment ID that translates to it.
        Optional<TenantSubscription> subOpt = subscriptionRepository.findByMpPreapprovalId(id);
        
        if (subOpt.isPresent()) {
            TenantSubscription sub = subOpt.get();
            sub.setStatus(TenantSubscription.SubscriptionStatus.ACTIVE);
            sub.setCurrentPeriodEnd(LocalDateTime.now().plusMonths(1));
            subscriptionRepository.save(sub);
        }
    }
}
