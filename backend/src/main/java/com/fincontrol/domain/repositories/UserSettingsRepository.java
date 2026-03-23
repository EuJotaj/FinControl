package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.User;
import com.fincontrol.domain.models.UserSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser(User user);
}
