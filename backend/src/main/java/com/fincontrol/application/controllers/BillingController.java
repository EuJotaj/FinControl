package com.fincontrol.application.controllers;

import com.fincontrol.application.services.MercadoPagoService;
import com.fincontrol.infrastructure.tenant.TenantContext;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    private final MercadoPagoService mercadoPagoService;

    public BillingController(MercadoPagoService mercadoPagoService) {
        this.mercadoPagoService = mercadoPagoService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckout(@RequestBody CheckoutRequest request) {
        String tenantId = TenantContext.getCurrentTenant();
        
        Double price = "PRO".equalsIgnoreCase(request.getPlanType()) ? 49.90 : 0.0;
        
        String checkoutUrl = mercadoPagoService.createSubscriptionCheckout(tenantId, request.getPlanType(), price);
        
        return ResponseEntity.ok(new CheckoutResponse(checkoutUrl));
    }

    @PostMapping("/webhook/mercadopago")
    public ResponseEntity<Void> receiveWebhook(
            @RequestParam(name = "topic", required = false) String topic,
            @RequestParam(name = "id", required = false) String id,
            @RequestBody(required = false) Map<String, Object> payload) {
        
        String eventType = topic;
        String eventId = id;

        if (payload != null && payload.containsKey("type") && payload.containsKey("data")) {
            eventType = (String) payload.get("type");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data != null && data.containsKey("id")) {
                eventId = String.valueOf(data.get("id"));
            }
        }

        if (eventType != null && eventId != null) {
            mercadoPagoService.processWebhook(eventType, eventId);
        }

        return ResponseEntity.ok().build();
    }

    @Data
    @NoArgsConstructor
    public static class CheckoutRequest {
        private String planType;
    }

    @Data
    public static class CheckoutResponse {
        private String initPoint;
        public CheckoutResponse(String initPoint) { this.initPoint = initPoint; }
    }
}
