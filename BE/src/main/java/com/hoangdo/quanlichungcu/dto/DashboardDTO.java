package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardDTO {
    private long totalHouseholds;
    private long totalResidents;
    private long totalVehicles;
    private long totalApartments;
    private long occupiedApartments;
    private long emptyApartments;
    private BigDecimal totalReceivable;
    private BigDecimal totalCollected;
    private BigDecimal collectionRate;
}
