package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.VehicleDTO;

import java.util.List;

public interface VehicleService {
    
    List<VehicleDTO> findAll();
    
    VehicleDTO findById(Long id);
    
    List<VehicleDTO> findByHouseholdId(Long householdId);
    
    VehicleDTO create(VehicleDTO dto);
    
    VehicleDTO update(Long id, VehicleDTO dto);
    
    void delete(Long id);
}
