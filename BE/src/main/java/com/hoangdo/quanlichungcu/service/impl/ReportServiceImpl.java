package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.DashboardAnalyticsDTO;
import com.hoangdo.quanlichungcu.dto.HouseholdPaymentStatDTO;
import com.hoangdo.quanlichungcu.dto.PeriodStatDTO;
import com.hoangdo.quanlichungcu.dto.ReportSummaryDTO;
import com.hoangdo.quanlichungcu.entity.FeePeriod;
import com.hoangdo.quanlichungcu.entity.Household;
import com.hoangdo.quanlichungcu.repository.*;
import com.hoangdo.quanlichungcu.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {

    private final HouseholdRepository householdRepository;
    private final ResidentRepository residentRepository;
    private final FeeItemRepository feeItemRepository;
    private final FeeObligationRepository feeObligationRepository;
    private final FeePeriodRepository feePeriodRepository;

    @Override
    public ReportSummaryDTO getSummary(String periodYm) {
        Long totalHouseholds = householdRepository.count();
        Long totalPersons = residentRepository.count();
        Long activeResidents = residentRepository.countByStatus("ACTIVE");
        Long temporaryAbsentResidents = residentRepository.countByStatus("TAM_VANG");
        Long totalFees = feeItemRepository.count();

        BigDecimal totalReceivable;
        BigDecimal totalCollected;

        if (periodYm != null && !periodYm.isEmpty()) {
            // Hỗ trợ cả 2 format: "2025-12" hoặc "T12/2025"
            String formattedPeriod = periodYm.startsWith("T") ? periodYm : convertPeriodFormat(periodYm);
            totalReceivable = feeObligationRepository.sumExpectedByPeriod(formattedPeriod);
            totalCollected = feeObligationRepository.sumPaidByPeriod(formattedPeriod);
        } else {
            totalReceivable = feeObligationRepository.sumAllExpected();
            totalCollected = feeObligationRepository.sumAllPaid();
        }

        if (totalReceivable == null) totalReceivable = BigDecimal.ZERO;
        if (totalCollected == null) totalCollected = BigDecimal.ZERO;

        Double collectionRate = 0.0;
        if (totalReceivable.compareTo(BigDecimal.ZERO) > 0) {
            collectionRate = totalCollected
                    .divide(totalReceivable, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .doubleValue();
        }

        return ReportSummaryDTO.builder()
                .totalHouseholds(totalHouseholds)
                .totalPersons(totalPersons)
                .activeResidents(activeResidents)
                .temporaryAbsentResidents(temporaryAbsentResidents)
                .totalFees(totalFees)
                .totalReceivable(totalReceivable)
                .totalCollected(totalCollected)
                .collectionRate(Math.round(collectionRate * 10.0) / 10.0)
                .build();
    }

    private String convertPeriodFormat(String periodYm) {
        // "2025-12" -> "T12/2025"
        if (periodYm == null || !periodYm.contains("-")) {
            return periodYm;
        }
        String[] parts = periodYm.split("-");
        if (parts.length == 2) {
            return "T" + parts[1] + "/" + parts[0];
        }
        return periodYm;
    }
    
    @Override
    public DashboardAnalyticsDTO getDashboardAnalytics() {
        // Lấy 5 kỳ thu gần nhất (sắp xếp theo startDate giảm dần)
        List<FeePeriod> allPeriods = feePeriodRepository.findAll()
                .stream()
                .sorted(Comparator.comparing(FeePeriod::getStartDate).reversed())
                .limit(5)
                .collect(Collectors.toList());
        
        // Đảo ngược để hiển thị từ cũ đến mới
        List<FeePeriod> last5Periods = new ArrayList<>(allPeriods);
        java.util.Collections.reverse(last5Periods);
        
        List<PeriodStatDTO> periodStats = new ArrayList<>();
        for (FeePeriod period : last5Periods) {
            BigDecimal totalReceivable = feeObligationRepository.sumExpectedAmountByPeriodId(period.getId());
            BigDecimal totalCollected = feeObligationRepository.sumPaidAmountByPeriodId(period.getId());
            
            if (totalReceivable == null) totalReceivable = BigDecimal.ZERO;
            if (totalCollected == null) totalCollected = BigDecimal.ZERO;
            
            Double rate = 0.0;
            if (totalReceivable.compareTo(BigDecimal.ZERO) > 0) {
                rate = totalCollected.divide(totalReceivable, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue();
            }
            
            periodStats.add(PeriodStatDTO.builder()
                    .periodId(period.getId())
                    .periodName(period.getName())
                    .status(period.getStatus())
                    .totalReceivable(totalReceivable)
                    .totalCollected(totalCollected)
                    .collectionRate(Math.round(rate * 10.0) / 10.0)
                    .build());
        }
        
        // Tìm kỳ trước đó (kỳ đã đóng gần nhất hoặc kỳ thứ 2 trong danh sách)
        FeePeriod previousPeriod = null;
        List<FeePeriod> closedPeriods = feePeriodRepository.findByStatusOrderByStartDateDesc("CLOSED");
        if (!closedPeriods.isEmpty()) {
            previousPeriod = closedPeriods.get(0);
        } else if (allPeriods.size() > 1) {
            previousPeriod = allPeriods.get(1);
        }
        
        HouseholdPaymentStatDTO bestHousehold = null;
        HouseholdPaymentStatDTO worstHousehold = null;
        String previousPeriodName = null;
        
        if (previousPeriod != null) {
            previousPeriodName = previousPeriod.getName();
            List<HouseholdPaymentStatDTO> householdStats = getHouseholdPaymentStats(previousPeriod.getId());
            
            if (!householdStats.isEmpty()) {
                // Sắp xếp theo tỷ lệ thanh toán
                householdStats.sort(Comparator.comparing(HouseholdPaymentStatDTO::getPaymentRate).reversed());
                bestHousehold = householdStats.get(0);
                worstHousehold = householdStats.get(householdStats.size() - 1);
            }
        }
        
        return DashboardAnalyticsDTO.builder()
                .last5PeriodStats(periodStats)
                .bestPayingHousehold(bestHousehold)
                .worstPayingHousehold(worstHousehold)
                .previousPeriodName(previousPeriodName)
                .build();
    }
    
    private List<HouseholdPaymentStatDTO> getHouseholdPaymentStats(Long periodId) {
        List<Long> householdIds = feeObligationRepository.findDistinctHouseholdIdsByPeriodId(periodId);
        List<HouseholdPaymentStatDTO> stats = new ArrayList<>();
        
        for (Long householdId : householdIds) {
            Household household = householdRepository.findById(householdId).orElse(null);
            if (household == null) continue;
            
            BigDecimal totalReceivable = feeObligationRepository.sumExpectedByPeriodAndHousehold(periodId, householdId);
            BigDecimal totalPaid = feeObligationRepository.sumPaidByPeriodAndHousehold(periodId, householdId);
            
            if (totalReceivable == null) totalReceivable = BigDecimal.ZERO;
            if (totalPaid == null) totalPaid = BigDecimal.ZERO;
            
            Double rate = 0.0;
            if (totalReceivable.compareTo(BigDecimal.ZERO) > 0) {
                rate = totalPaid.divide(totalReceivable, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100)).doubleValue();
            }
            
            String apartmentInfo = household.getApartment() != null 
                    ? household.getApartment().getBlock() + "-" + household.getApartment().getFloor() + "-" + household.getApartment().getUnit()
                    : "";
            
            stats.add(HouseholdPaymentStatDTO.builder()
                    .householdId(householdId)
                    .householdCode(household.getHouseholdId())
                    .ownerName(household.getOwnerName())
                    .apartmentInfo(apartmentInfo)
                    .totalReceivable(totalReceivable)
                    .totalPaid(totalPaid)
                    .paymentRate(Math.round(rate * 10.0) / 10.0)
                    .build());
        }
        
        return stats;
    }
}
