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
public class ReportSummaryDTO {
    private Long totalHouseholds;
    private Long totalPersons;
    private Long activeResidents;        // Nhân khẩu đang ở
    private Long temporaryAbsentResidents; // Nhân khẩu tạm vắng
    private Long totalFees;
    private BigDecimal totalReceivable;
    private BigDecimal totalCollected;
    private Double collectionRate;
}
