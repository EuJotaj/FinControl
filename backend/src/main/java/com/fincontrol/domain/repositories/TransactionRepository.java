package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.Transaction;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface TransactionRepository extends JpaRepository<Transaction, UUID> {
    List<Transaction> findByUserOrderByDateDesc(User user);
}
