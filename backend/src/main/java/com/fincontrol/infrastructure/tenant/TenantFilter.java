package com.fincontrol.infrastructure.tenant;

import com.fincontrol.domain.models.TenantSubscription;
import com.fincontrol.infrastructure.repositories.TenantSubscriptionRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Slf4j
@Component
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_HEADER = "X-Tenant-ID";
    
    @Autowired
    private TenantSubscriptionRepository subscriptionRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String tenantId = request.getHeader(TENANT_HEADER);
        String path = request.getRequestURI();

        // 1. Identificar se o path exige tenant
        boolean requiresTenant = path.startsWith("/api/") && 
                                !path.startsWith("/api/auth/") && 
                                !path.equals("/api/workspaces") && 
                                !path.equals("/api/workspaces/");

        if (tenantId != null && !tenantId.trim().isEmpty()) {
            TenantContext.setCurrentTenant(tenantId);
            
            try {
                Optional<TenantSubscription> subOpt = subscriptionRepository.findByTenantId(tenantId);
                if (subOpt.isPresent()) {
                    TenantSubscription.SubscriptionStatus status = subOpt.get().getStatus();
                    if (status == TenantSubscription.SubscriptionStatus.PAST_DUE || 
                        status == TenantSubscription.SubscriptionStatus.CANCELLED) {
                        
                        TenantContext.setReadOnly(true);
                        
                        String method = request.getMethod();
                        
                        if (("POST".equalsIgnoreCase(method) || "PUT".equalsIgnoreCase(method) || "DELETE".equalsIgnoreCase(method))
                            && !path.startsWith("/api/billing")) {
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("Workspace is in read-only mode due to expired subscription.");
                            return;
                        }
                    }
                }
            } catch (Exception e) {
                log.error("Error checking tenant subscription for tenantId {}: {}", tenantId, e.getMessage());
            }
        } else if (requiresTenant) {
            // Se o path exige tenant mas o ID está ausente
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Missing required X-Tenant-ID header for this request.\"}");
            return;
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            TenantContext.clear();
        }
    }
}
