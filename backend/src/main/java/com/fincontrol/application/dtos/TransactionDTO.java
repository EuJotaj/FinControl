package com.fincontrol.application.dtos;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;
import com.fincontrol.domain.models.Transaction.TransactionType;

@Data
public class TransactionDTO {
    private String description;
    private Double amount;
    private String date;
    private TransactionType type;
    private String categoryId;
    private String cardId;
    private String status;
}
