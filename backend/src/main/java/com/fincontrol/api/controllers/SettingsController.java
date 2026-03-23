package com.fincontrol.api.controllers;

import com.fincontrol.application.dtos.SettingsDTO;
import com.fincontrol.application.services.UserSettingsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final UserSettingsService userSettingsService;

    /** GET /api/settings — returns current user's settings */
    @GetMapping
    public ResponseEntity<SettingsDTO> getSettings() {
        return ResponseEntity.ok(userSettingsService.getSettings());
    }

    /** PUT /api/settings — full update of user settings */
    @PutMapping
    public ResponseEntity<SettingsDTO> updateSettings(@RequestBody SettingsDTO dto) {
        return ResponseEntity.ok(userSettingsService.updateSettings(dto));
    }
}
