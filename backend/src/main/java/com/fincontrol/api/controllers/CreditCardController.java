package com.fincontrol.api.controllers;

import com.fincontrol.domain.models.CreditCard;
import com.fincontrol.application.services.CreditCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cards")
@RequiredArgsConstructor
public class CreditCardController {

    private final CreditCardService creditCardService;

    @GetMapping
    public List<CreditCard> getAll() {
        return creditCardService.getAllCards();
    }

    @PostMapping
    public CreditCard create(@RequestBody CreditCard card) {
        return creditCardService.createCard(card);
    }
}
