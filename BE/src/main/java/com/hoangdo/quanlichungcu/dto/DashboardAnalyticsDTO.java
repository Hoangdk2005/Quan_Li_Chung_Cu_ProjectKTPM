package com.hoangdo.quanlichungcu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardAnalyticsDTO {
    private List<PeriodStatDTO> last5PeriodStats;
    private HouseholdPaymentStatDTO bestPayingHousehold;
    private HouseholdPaymentStatDTO worstPayingHousehold;
    private String previousPeriodName;
}
