package com.fincontrol.api.controllers;

import com.fincontrol.domain.models.Subscription;
import com.fincontrol.application.services.SubscriptionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @GetMapping
    public List<Subscription> getAll() {
        return subscriptionService.getAllSubscriptions();
    }

    @PostMapping
    public Subscription create(@RequestBody Subscription subscription) {
        return subscriptionService.createSubscription(subscription);
    }

    @PutMapping("/{id}")
    public Subscription update(@PathVariable java.util.UUID id, @RequestBody Subscription subscription) {
        return subscriptionService.updateSubscription(id, subscription);
    }

    @PostMapping("/{id}/renew")
    public Subscription renew(@PathVariable java.util.UUID id) {
        return subscriptionService.renewSubscription(id);
    }

    @PostMapping("/{id}/pay")
    public Subscription pay(@PathVariable java.util.UUID id) {
        return subscriptionService.paySubscription(id);
    }

    @PostMapping("/{id}/cancel")
    public Subscription cancel(@PathVariable java.util.UUID id) {
        return subscriptionService.cancelSubscription(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable java.util.UUID id) {
        subscriptionService.deleteSubscription(id);
    }
}
