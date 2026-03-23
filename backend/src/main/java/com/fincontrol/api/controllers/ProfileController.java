package com.fincontrol.api.controllers;

import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<User> getProfile() {
        return ResponseEntity.ok(getCurrentUser());
    }

    @PutMapping
    public ResponseEntity<User> updateProfile(@RequestBody ProfileUpdateRequest request) {
        User user = getCurrentUser();
        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }
        if (request.phone() != null) {
            user.setPhone(request.phone());
        }
        return ResponseEntity.ok(userRepository.save(user));
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow();
    }

    public record ProfileUpdateRequest(String name, String phone) {}
}
