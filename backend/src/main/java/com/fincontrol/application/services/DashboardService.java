package com.fincontrol.application.services;

import com.fincontrol.application.dtos.DashboardSummaryDTO;
import com.fincontrol.domain.models.Invoice;
import com.fincontrol.domain.models.Subscription;
import com.fincontrol.domain.models.Transaction;
import com.fincontrol.domain.models.User;
import com.fincontrol.domain.repositories.InvoiceRepository;
import com.fincontrol.domain.repositories.SubscriptionRepository;
import com.fincontrol.domain.repositories.TransactionRepository;
import com.fincontrol.domain.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.time.LocalDateTime;
import java.util.TreeMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final InvoiceRepository invoiceRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final com.fincontrol.domain.repositories.CreditCardRepository creditCardRepository;

    public DashboardSummaryDTO getSummary() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email).orElseThrow();
        
        List<Transaction> transactions = transactionRepository.findByUserOrderByDateDesc(user);
        List<Invoice> invoices = invoiceRepository.findByUserOrderByDueDateDesc(user);
        long activeSubscriptions = subscriptionRepository.findByUser(user).stream()
                .filter(s -> s.getStatus() == Subscription.SubscriptionStatus.ACTIVE)
                .count();

        double totalIncome = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.INCOME)
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpense = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .mapToDouble(Transaction::getAmount)
                .sum();

        java.util.Map<String, Double> expensesByCategory = transactions.stream()
                .filter(t -> t.getType() == Transaction.TransactionType.EXPENSE)
                .collect(java.util.stream.Collectors.groupingBy(
                        t -> t.getCategory() != null ? t.getCategory().getName() : "Outros",
                        java.util.stream.Collectors.summingDouble(Transaction::getAmount)
                ));

        // Credit info
        List<com.fincontrol.domain.models.CreditCard> cards = creditCardRepository.findByUser(user);
        double totalCreditLimit = cards.stream().mapToDouble(c -> c.getCardLimit()).sum();
        double totalCreditUsed = cards.stream().mapToDouble(c -> c.getUsed()).sum();

        // Monthly trends (Last 6 months)
        Map<String, Double> monthlyTrends = new TreeMap<>();
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6).withDayOfMonth(1).withHour(0).withMinute(0);
        
        transactions.stream()
            .filter(t -> t.getDate().isAfter(sixMonthsAgo))
            .forEach(t -> {
                String label = t.getDate().getYear() + "-" + String.format("%02d", t.getDate().getMonthValue());
                double amt = t.getType() == Transaction.TransactionType.EXPENSE ? -t.getAmount() : t.getAmount();
                monthlyTrends.merge(label, amt, Double::sum);
            });

        return DashboardSummaryDTO.builder()
                .totalIncome(totalIncome)
                .totalExpense(totalExpense)
                .balance(totalIncome - totalExpense)
                .recentTransactions(transactions.stream().limit(5).toList())
                .recentInvoices(invoices.stream().limit(5).toList())
                .activeSubscriptionsCount(activeSubscriptions)
                .expensesByCategory(expensesByCategory)
                .monthlyTrends(monthlyTrends)
                .totalCreditLimit(totalCreditLimit)
                .totalCreditUsed(totalCreditUsed)
                .build();
    }
}
