package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.ResidentDTO;
import com.hoangdo.quanlichungcu.entity.Household;
import com.hoangdo.quanlichungcu.entity.Resident;
import com.hoangdo.quanlichungcu.exception.BadRequestException;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.HouseholdRepository;
import com.hoangdo.quanlichungcu.repository.ResidentRepository;
import com.hoangdo.quanlichungcu.service.ResidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResidentServiceImpl implements ResidentService {

    private final ResidentRepository residentRepository;
    private final HouseholdRepository householdRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ResidentDTO> findAll() {
        return residentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ResidentDTO findById(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", id));
        return toDTO(resident);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ResidentDTO> findByHouseholdId(Long householdId) {
        return residentRepository.findByHouseholdId(householdId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ResidentDTO create(ResidentDTO dto) {
        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", dto.getHouseholdId()));
        
        Resident resident = Resident.builder()
                .household(household)
                .fullName(dto.getFullName())
                .dob(dto.getDob())
                .gender(dto.getGender())
                .idNumber(dto.getIdNumber())
                .relationshipToHead(dto.getRelationshipToHead())
                .phone(dto.getPhone())
                .isHead(dto.getIsHead() != null ? dto.getIsHead() : false)
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
        
        resident = residentRepository.save(resident);
        return toDTO(resident);
    }

    @Override
    public ResidentDTO update(Long id, ResidentDTO dto) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", id));
        
        // Only update household if householdId is provided and different
        if (dto.getHouseholdId() != null && !resident.getHousehold().getId().equals(dto.getHouseholdId())) {
            Household newHousehold = householdRepository.findById(dto.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household", "id", dto.getHouseholdId()));
            resident.setHousehold(newHousehold);
        }
        
        Household household = resident.getHousehold();
        
        // Xử lý chuyển đổi chủ hộ
        boolean wasHead = Boolean.TRUE.equals(resident.getIsHead());
        boolean willBeHead = Boolean.TRUE.equals(dto.getIsHead());
        
        if (willBeHead && !wasHead) {
            // Đặt cư dân này làm chủ hộ mới
            // Tìm và bỏ chủ hộ cũ
            residentRepository.findByHouseholdIdAndIsHeadTrue(household.getId())
                    .ifPresent(oldHead -> {
                        oldHead.setIsHead(false);
                        // Cập nhật quan hệ của chủ hộ cũ (không còn là "Chủ hộ" nữa)
                        if ("Chủ hộ".equals(oldHead.getRelationshipToHead())) {
                            oldHead.setRelationshipToHead("Thành viên");
                        }
                        residentRepository.save(oldHead);
                    });
            
            // Cập nhật thông tin chủ hộ trong household
            household.setOwnerName(dto.getFullName());
            household.setPhone(dto.getPhone());
            householdRepository.save(household);
            
            // Cập nhật quan hệ thành "Chủ hộ"
            dto.setRelationshipToHead("Chủ hộ");
        }
        
        resident.setFullName(dto.getFullName());
        resident.setDob(dto.getDob());
        resident.setGender(dto.getGender());
        resident.setIdNumber(dto.getIdNumber());
        resident.setRelationshipToHead(dto.getRelationshipToHead());
        resident.setPhone(dto.getPhone());
        resident.setIsHead(dto.getIsHead());
        resident.setStatus(dto.getStatus());
        
        resident = residentRepository.save(resident);
        return toDTO(resident);
    }

    @Override
    public void delete(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", id));
        
        // Kiểm tra nếu là chủ hộ thì không cho xóa
        if (Boolean.TRUE.equals(resident.getIsHead())) {
            throw new BadRequestException("Không thể xóa chủ hộ. Vui lòng chuyển quyền chủ hộ cho người khác trước khi xóa.");
        }
        
        residentRepository.deleteById(id);
    }
    
    @Override
    public void deleteHeadAndTransfer(Long id, Long newHeadId) {
        Resident currentHead = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", id));
        
        // Kiểm tra xem cư dân này có phải là chủ hộ không
        if (!Boolean.TRUE.equals(currentHead.getIsHead())) {
            throw new BadRequestException("Cư dân này không phải là chủ hộ.");
        }
        
        Resident newHead = residentRepository.findById(newHeadId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", newHeadId));
        
        // Kiểm tra xem cư dân mới có cùng hộ gia đình không
        if (!newHead.getHousehold().getId().equals(currentHead.getHousehold().getId())) {
            throw new BadRequestException("Cư dân được chọn làm chủ hộ mới phải thuộc cùng hộ gia đình.");
        }
        
        // Chuyển quyền chủ hộ
        newHead.setIsHead(true);
        newHead.setRelationshipToHead("Chủ hộ");
        residentRepository.save(newHead);
        
        // Cập nhật tên chủ hộ trong household
        Household household = currentHead.getHousehold();
        household.setOwnerName(newHead.getFullName());
        household.setPhone(newHead.getPhone());
        householdRepository.save(household);
        
        // Xóa chủ hộ cũ
        residentRepository.deleteById(id);
    }
    
    @Override
    @Transactional(readOnly = true)
    public boolean isHeadOfHousehold(Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resident", "id", id));
        return Boolean.TRUE.equals(resident.getIsHead());
    }

    private ResidentDTO toDTO(Resident resident) {
        return ResidentDTO.builder()
                .id(resident.getId())
                .householdId(resident.getHousehold().getId())
                .householdCode(resident.getHousehold().getHouseholdId())
                .fullName(resident.getFullName())
                .dob(resident.getDob())
                .gender(resident.getGender())
                .idNumber(resident.getIdNumber())
                .relationshipToHead(resident.getRelationshipToHead())
                .phone(resident.getPhone())
                .isHead(resident.getIsHead())
                .status(resident.getStatus())
                .createdAt(resident.getCreatedAt())
                .updatedAt(resident.getUpdatedAt())
                .build();
    }
}
