package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.FeeItemDTO;

import java.util.List;

public interface FeeItemService {
    
    List<FeeItemDTO> findAll();
    
    FeeItemDTO findById(Long id);
    
    List<FeeItemDTO> findByStatus(String status);
    
    List<FeeItemDTO> findByType(String type);
    
    FeeItemDTO create(FeeItemDTO dto);
    
    FeeItemDTO update(Long id, FeeItemDTO dto);
    
    void delete(Long id);
}
