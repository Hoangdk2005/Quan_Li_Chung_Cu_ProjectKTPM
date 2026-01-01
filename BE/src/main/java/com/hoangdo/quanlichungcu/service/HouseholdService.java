package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.HouseholdDTO;

import java.util.List;

public interface HouseholdService {
    
    List<HouseholdDTO> findAll();
    
    HouseholdDTO findById(Long id);
    
    HouseholdDTO findByHouseholdId(String householdId);
    
    HouseholdDTO findByIdWithDetails(Long id);
    
    List<HouseholdDTO> findByStatus(String status);
    
    HouseholdDTO create(HouseholdDTO dto);
    
    HouseholdDTO update(Long id, HouseholdDTO dto);
    
    void delete(Long id);
}
