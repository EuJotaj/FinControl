package com.fincontrol.application.services;

import com.fincontrol.domain.models.Transaction;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.models.Invoice;
import com.fincontrol.domain.models.CreditCard;
import com.fincontrol.domain.models.Category;
import com.fincontrol.domain.repositories.TransactionRepository;
import com.fincontrol.domain.repositories.UserRepository;
import com.fincontrol.domain.repositories.CategoryRepository;
import com.fincontrol.domain.repositories.CreditCardRepository;
import com.fincontrol.domain.repositories.InvoiceRepository;
import com.fincontrol.application.dtos.TransactionDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CreditCardRepository creditCardRepository;
    private final InvoiceService invoiceService;
    private final InvoiceRepository invoiceRepository;

    public List<Transaction> getAllTransactions() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return transactionRepository.findByUserOrderByDateDesc(user);
    }

    public Transaction createTransaction(com.fincontrol.application.dtos.TransactionDTO dto) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        Category category = null;
        if (dto.getCategoryId() != null && !dto.getCategoryId().isEmpty()) {
            try {
                UUID categoryId = UUID.fromString(dto.getCategoryId());
                category = categoryRepository.findById(categoryId).orElse(null);
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUID for now, or could throw error
            }
        }
        
        LocalDateTime date;
        if (dto.getDate() != null && !dto.getDate().isEmpty()) {
            try {
                if (dto.getDate().length() == 10) {
                    date = LocalDateTime.parse(dto.getDate() + "T00:00:00");
                } else {
                    date = LocalDateTime.parse(dto.getDate().substring(0, 19)); // Handle optional offset/millis
                }
            } catch (Exception e) {
                date = LocalDateTime.now();
            }
        } else {
            date = LocalDateTime.now();
        }
        
        CreditCard card = null;
        if (dto.getCardId() != null && !dto.getCardId().isEmpty()) {
            try {
                UUID cardId = UUID.fromString(dto.getCardId());
                card = creditCardRepository.findById(cardId).orElse(null);
                if (card != null && dto.getType() == Transaction.TransactionType.EXPENSE) {
                    card.setUsed(card.getUsed() + dto.getAmount());
                    creditCardRepository.save(card);
                    
                    // Automate Invoice linking
                    Invoice invoice = invoiceService.getOrCreateCurrentInvoice(card, user);
                    invoice.setAmount(invoice.getAmount() + dto.getAmount());
                    invoiceRepository.save(invoice);
                } else if (card != null && dto.getType() == Transaction.TransactionType.INCOME) {
                    card.setUsed(card.getUsed() - dto.getAmount());
                    creditCardRepository.save(card);
                    
                    // Reduce from invoice if applicable (optional, but requested logic implies CC usage goes to invoice)
                    Invoice invoice = invoiceService.getOrCreateCurrentInvoice(card, user);
                    invoice.setAmount(Math.max(0, invoice.getAmount() - dto.getAmount()));
                    invoiceRepository.save(invoice);
                }
            } catch (IllegalArgumentException e) {
                // Ignore invalid UUID
            }
        }

        Transaction transaction = Transaction.builder()
            .description(dto.getDescription())
            .amount(dto.getAmount())
            .type(dto.getType())
            .date(date)
            .category(category)
            .creditCard(card)
            .user(user)
            .build();
            
        return transactionRepository.save(transaction);
    }
}
