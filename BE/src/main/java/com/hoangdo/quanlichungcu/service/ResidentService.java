package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.ResidentDTO;

import java.util.List;

public interface ResidentService {
    
    List<ResidentDTO> findAll();
    
    ResidentDTO findById(Long id);
    
    List<ResidentDTO> findByHouseholdId(Long householdId);
    
    ResidentDTO create(ResidentDTO dto);
    
    ResidentDTO update(Long id, ResidentDTO dto);
    
    void delete(Long id);
    
    /**
     * Xóa cư dân là chủ hộ và chuyển quyền chủ hộ cho người khác
     * @param id ID của cư dân cần xóa (chủ hộ)
     * @param newHeadId ID của cư dân sẽ trở thành chủ hộ mới
     */
    void deleteHeadAndTransfer(Long id, Long newHeadId);
    
    /**
     * Kiểm tra cư dân có phải là chủ hộ không
     * @param id ID của cư dân
     * @return true nếu là chủ hộ
     */
    boolean isHeadOfHousehold(Long id);
}
