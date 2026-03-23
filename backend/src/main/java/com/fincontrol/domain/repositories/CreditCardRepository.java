package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.CreditCard;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface CreditCardRepository extends JpaRepository<CreditCard, UUID> {
    List<CreditCard> findByUser(User user);
}
