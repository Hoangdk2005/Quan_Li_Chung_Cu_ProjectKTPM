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
public class PeriodStatDTO {
    private Long periodId;
    private String periodName;
    private String status;
    private BigDecimal totalReceivable;
    private BigDecimal totalCollected;
    private Double collectionRate;
}
