package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.FeeObligationDTO;

import java.util.List;

public interface FeeObligationService {
    
    List<FeeObligationDTO> findAll();
    
    FeeObligationDTO findById(Long id);
    
    List<FeeObligationDTO> findByHouseholdId(Long householdId);
    
    List<FeeObligationDTO> findByFeePeriodId(Long feePeriodId);
    
    List<FeeObligationDTO> findByStatus(String status);
    
    FeeObligationDTO create(FeeObligationDTO dto);
    
    FeeObligationDTO update(Long id, FeeObligationDTO dto);
    
    FeeObligationDTO pay(Long id, FeeObligationDTO paymentInfo);
    
    void delete(Long id);
    
    void generateObligationsForPeriod(Long feePeriodId);
}
