package com.fincontrol.application.services;

import com.fincontrol.domain.models.CreditCard;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.CreditCardRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CreditCardService {

    private final CreditCardRepository creditCardRepository;
    private final UserRepository userRepository;

    public List<CreditCard> getAllCards() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return creditCardRepository.findByUser(user);
    }

    public CreditCard createCard(CreditCard card) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        card.setUser(user);
        return creditCardRepository.save(card);
    }
}
