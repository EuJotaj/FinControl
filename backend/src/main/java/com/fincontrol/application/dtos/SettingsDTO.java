package com.fincontrol.application.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SettingsDTO {
    private String language;
    private String currency;
    private Boolean pushNotifications;
    private Boolean emailSummary;
    private Boolean twoFactorAuth;
}
