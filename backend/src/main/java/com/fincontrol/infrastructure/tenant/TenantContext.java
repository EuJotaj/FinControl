package com.fincontrol.infrastructure.tenant;

public class TenantContext {

    private static final ThreadLocal<String> currentTenant = new ThreadLocal<>();
    private static final ThreadLocal<Boolean> readOnly = new ThreadLocal<>();

    public static void setCurrentTenant(String tenantId) {
        currentTenant.set(tenantId);
    }

    public static String getCurrentTenant() {
        return currentTenant.get();
    }

    public static void setReadOnly(boolean isReadOnly) {
        readOnly.set(isReadOnly);
    }

    public static boolean isReadOnly() {
        return readOnly.get() != null && readOnly.get();
    }

    public static void clear() {
        currentTenant.remove();
        readOnly.remove();
    }
}
