package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeObligationDTO {
    private Long id;
    private Long householdId;
    private String householdCode;
    private String ownerName;
    private Long feeItemId;
    private String feeItemName;
    private Long feePeriodId;
    private String periodYm;
    private String periodStatus; // Trạng thái kỳ thu: OPEN, CLOSED
    private BigDecimal expectedAmount;
    private BigDecimal paidAmount;
    private LocalDate dueDate;
    private String status;
    private String payerName;
    private LocalDateTime paidAt;
    private String paymentMethod;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
