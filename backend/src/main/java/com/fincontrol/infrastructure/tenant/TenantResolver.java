package com.fincontrol.infrastructure.tenant;

import org.hibernate.context.spi.CurrentTenantIdentifierResolver;
import org.springframework.stereotype.Component;

@Component
public class TenantResolver implements CurrentTenantIdentifierResolver<String> {

    @Override
    public String resolveCurrentTenantIdentifier() {
        String tenantId = TenantContext.getCurrentTenant();
        if (tenantId != null) {
            return tenantId;
        }
        // Hibernate 6 @TenantId will handle null if the field is not optional.
        // Returning null effectively makes the operation fail if no tenant is set
        // on entities decorated with @TenantId.
        return null;
    }

    @Override
    public boolean validateExistingCurrentSessions() {
        return true;
    }
}
