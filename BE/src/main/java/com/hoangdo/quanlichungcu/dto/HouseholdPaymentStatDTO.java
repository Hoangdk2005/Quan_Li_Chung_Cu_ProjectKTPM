package com.hoangdo.quanlichungcu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HouseholdPaymentStatDTO {
    private Long householdId;
    private String householdCode;
    private String ownerName;
    private String apartmentInfo;
    private BigDecimal totalReceivable;
    private BigDecimal totalPaid;
    private Double paymentRate;
}
