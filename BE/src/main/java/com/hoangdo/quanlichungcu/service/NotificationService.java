package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.NotificationDTO;

import java.util.List;

public interface NotificationService {
    
    List<NotificationDTO> findAll();
    
    NotificationDTO findById(Long id);
    
    List<NotificationDTO> findByStatus(String status);
    
    NotificationDTO create(NotificationDTO dto);
    
    NotificationDTO update(Long id, NotificationDTO dto);
    
    NotificationDTO publish(Long id);
    
    void delete(Long id);
}
