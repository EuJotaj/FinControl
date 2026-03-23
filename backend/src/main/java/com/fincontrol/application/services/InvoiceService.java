package com.fincontrol.application.services;

import com.fincontrol.domain.models.Invoice;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.InvoiceRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import com.fincontrol.infrastructure.tenant.TenantContext;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final UserRepository userRepository;
    private final com.fincontrol.domain.repositories.CreditCardRepository creditCardRepository;

    public List<Invoice> getAllInvoices() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        return invoiceRepository.findByUserOrderByDueDateDesc(user);
    }

    public Invoice createInvoice(Invoice invoice) {
        log.info("Creating invoice: {}", invoice.getDescription());
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        invoice.setUser(user);
        
        return invoiceRepository.save(invoice);
    }

    public Invoice payInvoice(UUID id) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setStatus(Invoice.InvoiceStatus.PAID);
        
        // If it's a credit card invoice, clear the used amount
        if (invoice.getCreditCard() != null) {
            com.fincontrol.domain.models.CreditCard card = invoice.getCreditCard();
            card.setUsed(Math.max(0, card.getUsed() - invoice.getAmount()));
            creditCardRepository.save(card);
        }
        
        return invoiceRepository.save(invoice);
    }

    public Invoice updateInvoice(UUID id, Invoice invoiceData) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setDescription(invoiceData.getDescription());
        invoice.setAmount(invoiceData.getAmount());
        invoice.setDueDate(invoiceData.getDueDate());
        invoice.setStatus(invoiceData.getStatus());
        invoice.setCategory(invoiceData.getCategory());
        return invoiceRepository.save(invoice);
    }

    public void deleteInvoice(UUID id) {
        invoiceRepository.deleteById(id);
    }

    public Invoice getOrCreateCurrentInvoice(com.fincontrol.domain.models.CreditCard card, User user) {
        java.time.LocalDate now = java.time.LocalDate.now();
        java.time.LocalDate start = now.withDayOfMonth(1);
        java.time.LocalDate end = now.withDayOfMonth(now.lengthOfMonth());
        
        return invoiceRepository.findByCreditCardAndDueDateBetween(card, start, end)
            .orElseGet(() -> {
                Invoice invoice = Invoice.builder()
                    .description("Fatura " + card.getBank() + " - " + now.getMonthValue() + "/" + now.getYear())
                    .amount(0.0)
                    .dueDate(now.withDayOfMonth(15)) // Default or logic based on card
                    .category("Cartão de Crédito")
                    .status(Invoice.InvoiceStatus.UNPAID)
                    .creditCard(card)
                    .user(user)
                    .tenantId(TenantContext.getCurrentTenant())
                    .build();
                return invoiceRepository.save(invoice);
            });
    }
}
