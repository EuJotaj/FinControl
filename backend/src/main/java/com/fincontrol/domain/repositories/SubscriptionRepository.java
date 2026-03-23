package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.Subscription;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {
    List<Subscription> findByUser(User user);
}
