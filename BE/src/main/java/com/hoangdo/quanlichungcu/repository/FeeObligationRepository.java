package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.FeeObligation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface FeeObligationRepository extends JpaRepository<FeeObligation, Long> {
    
    List<FeeObligation> findByHouseholdId(Long householdId);
    
    List<FeeObligation> findByFeePeriodId(Long feePeriodId);
    
    List<FeeObligation> findByStatus(String status);
    
    List<FeeObligation> findByHouseholdIdAndFeePeriodId(Long householdId, Long feePeriodId);
    
    List<FeeObligation> findByHouseholdIdAndStatus(Long householdId, String status);
    
    @Query("SELECT SUM(f.expectedAmount) FROM FeeObligation f WHERE f.feePeriod.id = :periodId")
    BigDecimal sumExpectedAmountByPeriodId(Long periodId);
    
    @Query("SELECT SUM(f.paidAmount) FROM FeeObligation f WHERE f.feePeriod.id = :periodId")
    BigDecimal sumPaidAmountByPeriodId(Long periodId);
    
    @Query("SELECT SUM(f.expectedAmount) FROM FeeObligation f WHERE f.household.id = :householdId AND f.status = 'UNPAID'")
    BigDecimal sumUnpaidAmountByHouseholdId(Long householdId);

    @Query("SELECT SUM(f.expectedAmount) FROM FeeObligation f WHERE f.periodYm = :periodYm")
    BigDecimal sumExpectedByPeriod(String periodYm);

    @Query("SELECT SUM(f.paidAmount) FROM FeeObligation f WHERE f.periodYm = :periodYm")
    BigDecimal sumPaidByPeriod(String periodYm);

    @Query("SELECT SUM(f.expectedAmount) FROM FeeObligation f")
    BigDecimal sumAllExpected();

    @Query("SELECT SUM(f.paidAmount) FROM FeeObligation f")
    BigDecimal sumAllPaid();
    
    @Query("SELECT SUM(f.expectedAmount) FROM FeeObligation f WHERE f.feePeriod.id = :periodId AND f.household.id = :householdId")
    BigDecimal sumExpectedByPeriodAndHousehold(Long periodId, Long householdId);
    
    @Query("SELECT SUM(f.paidAmount) FROM FeeObligation f WHERE f.feePeriod.id = :periodId AND f.household.id = :householdId")
    BigDecimal sumPaidByPeriodAndHousehold(Long periodId, Long householdId);
    
    @Query("SELECT DISTINCT f.household.id FROM FeeObligation f WHERE f.feePeriod.id = :periodId")
    List<Long> findDistinctHouseholdIdsByPeriodId(Long periodId);
}
