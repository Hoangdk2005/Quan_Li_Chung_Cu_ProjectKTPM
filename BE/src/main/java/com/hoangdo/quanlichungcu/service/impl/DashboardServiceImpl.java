package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.DashboardDTO;
import com.hoangdo.quanlichungcu.repository.*;
import com.hoangdo.quanlichungcu.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final HouseholdRepository householdRepository;
    private final ResidentRepository residentRepository;
    private final VehicleRepository vehicleRepository;
    private final ApartmentRepository apartmentRepository;
    private final FeeObligationRepository feeObligationRepository;

    @Override
    public DashboardDTO getDashboardData() {
        long totalHouseholds = householdRepository.count();
        long totalResidents = residentRepository.count();
        long totalVehicles = vehicleRepository.count();
        long totalApartments = apartmentRepository.count();
        long occupiedApartments = apartmentRepository.findByStatus("OCCUPIED").size();
        long emptyApartments = apartmentRepository.findByStatus("EMPTY").size();
        
        // Calculate fee totals from all obligations
        BigDecimal totalReceivable = BigDecimal.ZERO;
        BigDecimal totalCollected = BigDecimal.ZERO;
        
        var allObligations = feeObligationRepository.findAll();
        for (var obligation : allObligations) {
            totalReceivable = totalReceivable.add(obligation.getExpectedAmount());
            totalCollected = totalCollected.add(obligation.getPaidAmount());
        }
        
        BigDecimal collectionRate = BigDecimal.ZERO;
        if (totalReceivable.compareTo(BigDecimal.ZERO) > 0) {
            collectionRate = totalCollected
                    .divide(totalReceivable, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
        }
        
        return DashboardDTO.builder()
                .totalHouseholds(totalHouseholds)
                .totalResidents(totalResidents)
                .totalVehicles(totalVehicles)
                .totalApartments(totalApartments)
                .occupiedApartments(occupiedApartments)
                .emptyApartments(emptyApartments)
                .totalReceivable(totalReceivable)
                .totalCollected(totalCollected)
                .collectionRate(collectionRate)
                .build();
    }
}
