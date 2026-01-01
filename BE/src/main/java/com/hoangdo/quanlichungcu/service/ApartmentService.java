package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.ApartmentDTO;

import java.util.List;

public interface ApartmentService {
    
    List<ApartmentDTO> findAll();
    
    ApartmentDTO findById(Long id);
    
    List<ApartmentDTO> findByStatus(String status);
    
    ApartmentDTO create(ApartmentDTO dto);
    
    ApartmentDTO update(Long id, ApartmentDTO dto);
    
    void delete(Long id);
}
