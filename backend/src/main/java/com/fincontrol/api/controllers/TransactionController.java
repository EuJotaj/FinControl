package com.fincontrol.api.controllers;

import com.fincontrol.domain.models.Transaction;
import com.fincontrol.application.services.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public List<Transaction> getAll() {
        return transactionService.getAllTransactions();
    }

    @PostMapping
    public Transaction create(@RequestBody com.fincontrol.application.dtos.TransactionDTO dto) {
        return transactionService.createTransaction(dto);
    }
}
