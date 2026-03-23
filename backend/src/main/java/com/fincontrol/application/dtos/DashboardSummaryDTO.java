package com.fincontrol.application.dtos;

import com.fincontrol.domain.models.Invoice;
import com.fincontrol.domain.models.Transaction;
import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardSummaryDTO {
    private double totalIncome;
    private double totalExpense;
    private double balance;
    private List<Transaction> recentTransactions;
    private List<Invoice> recentInvoices;
    private long activeSubscriptionsCount;
    private Map<String, Double> expensesByCategory;
    private Map<String, Double> monthlyTrends; 
    private double totalCreditLimit;
    private double totalCreditUsed;
}
