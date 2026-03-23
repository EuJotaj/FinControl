package com.fincontrol.application.services;

import com.fincontrol.domain.models.Subscription;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.SubscriptionRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;

    public List<Subscription> getAllSubscriptions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return subscriptionRepository.findByUser(user);
    }

    public Subscription createSubscription(Subscription subscription) {
        log.info("Creating subscription: {}", subscription.getName());
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        subscription.setUser(user);
        
        if (subscription.getStatus() == null) {
            subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        }
        
        return subscriptionRepository.save(subscription);
    }

    public Subscription updateSubscription(java.util.UUID id, Subscription subscription) {
        Subscription existing = subscriptionRepository.findById(id).orElseThrow();
        existing.setName(subscription.getName());
        existing.setAmount(subscription.getAmount());
        existing.setNextBillingDate(subscription.getNextBillingDate());
        existing.setFrequency(subscription.getFrequency());
        existing.setIcon(subscription.getIcon());
        existing.setStatus(subscription.getStatus());
        return subscriptionRepository.save(existing);
    }

    public Subscription paySubscription(java.util.UUID id) {
        Subscription subscription = subscriptionRepository.findById(id).orElseThrow();
        subscription.setStatus(Subscription.SubscriptionStatus.PAID);
        
        // Logic to create a transaction could go here or be handled in a separate service
        // For simplicity, we just change status for now, or we could call TransactionService
        
        return subscriptionRepository.save(subscription);
    }

    public Subscription cancelSubscription(java.util.UUID id) {
        Subscription subscription = subscriptionRepository.findById(id).orElseThrow();
        subscription.setStatus(Subscription.SubscriptionStatus.CANCELED);
        return subscriptionRepository.save(subscription);
    }

    public Subscription renewSubscription(java.util.UUID id) {
        Subscription subscription = subscriptionRepository.findById(id).orElseThrow();
        
        java.time.LocalDate nextDate = subscription.getNextBillingDate();
        if ("MONTHLY".equalsIgnoreCase(subscription.getFrequency())) {
            nextDate = nextDate.plusMonths(1);
        } else if ("YEARLY".equalsIgnoreCase(subscription.getFrequency())) {
            nextDate = nextDate.plusYears(1);
        } else {
            nextDate = nextDate.plusMonths(1); // Default to monthly
        }
        
        subscription.setNextBillingDate(nextDate);
        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        
        return subscriptionRepository.save(subscription);
    }

    public void deleteSubscription(java.util.UUID id) {
        subscriptionRepository.deleteById(id);
    }
}
