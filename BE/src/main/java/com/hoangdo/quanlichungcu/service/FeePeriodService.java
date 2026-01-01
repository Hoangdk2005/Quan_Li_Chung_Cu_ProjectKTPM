package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.FeePeriodDTO;

import java.util.List;

public interface FeePeriodService {
    
    List<FeePeriodDTO> findAll();
    
    FeePeriodDTO findById(Long id);
    
    List<FeePeriodDTO> findByStatus(String status);
    
    FeePeriodDTO findCurrentPeriod();
    
    FeePeriodDTO create(FeePeriodDTO dto);
    
    FeePeriodDTO update(Long id, FeePeriodDTO dto);
    
    void delete(Long id);
}
