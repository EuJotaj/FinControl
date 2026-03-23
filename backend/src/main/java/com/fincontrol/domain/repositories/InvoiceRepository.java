package com.fincontrol.domain.repositories;

import com.fincontrol.domain.models.Invoice;
import com.fincontrol.domain.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface InvoiceRepository extends JpaRepository<Invoice, UUID> {
    List<Invoice> findByUserOrderByDueDateAsc(User user);
    List<Invoice> findByUserOrderByDueDateDesc(User user);
    java.util.Optional<Invoice> findByCreditCardAndDueDateBetween(com.fincontrol.domain.models.CreditCard creditCard, java.time.LocalDate start, java.time.LocalDate end);
}
