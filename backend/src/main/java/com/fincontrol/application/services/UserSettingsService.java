package com.fincontrol.application.services;

import com.fincontrol.application.dtos.SettingsDTO;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.models.UserSettings;
import com.fincontrol.domain.repositories.UserRepository;
import com.fincontrol.domain.repositories.UserSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserSettingsService {

    private final UserSettingsRepository userSettingsRepository;
    private final UserRepository userRepository;

    /** Returns current user's settings, creating defaults if none exist. */
    @Transactional
    public SettingsDTO getSettings() {
        User user = currentUser();
        UserSettings settings = userSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaults(user));
        return toDTO(settings);
    }

    /** Updates all settings fields (full replace). */
    @Transactional
    public SettingsDTO updateSettings(SettingsDTO dto) {
        User user = currentUser();
        UserSettings settings = userSettingsRepository.findByUser(user)
                .orElseGet(() -> createDefaults(user));

        if (dto.getLanguage() != null)          settings.setLanguage(dto.getLanguage());
        if (dto.getCurrency() != null)          settings.setCurrency(dto.getCurrency());
        if (dto.getPushNotifications() != null) settings.setPushNotifications(dto.getPushNotifications());
        if (dto.getEmailSummary() != null)      settings.setEmailSummary(dto.getEmailSummary());
        if (dto.getTwoFactorAuth() != null)     settings.setTwoFactorAuth(dto.getTwoFactorAuth());

        return toDTO(userSettingsRepository.save(settings));
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private UserSettings createDefaults(User user) {
        return userSettingsRepository.save(
            UserSettings.builder()
                .user(user)
                .tenantId(com.fincontrol.infrastructure.tenant.TenantContext.getCurrentTenant())
                .build()
        );
    }

    private User currentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    private SettingsDTO toDTO(UserSettings s) {
        return SettingsDTO.builder()
                .language(s.getLanguage())
                .currency(s.getCurrency())
                .pushNotifications(s.getPushNotifications())
                .emailSummary(s.getEmailSummary())
                .twoFactorAuth(s.getTwoFactorAuth())
                .build();
    }
}
