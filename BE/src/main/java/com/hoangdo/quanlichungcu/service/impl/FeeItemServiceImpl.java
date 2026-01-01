package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.FeeItemDTO;
import com.hoangdo.quanlichungcu.entity.FeeItem;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.FeeItemRepository;
import com.hoangdo.quanlichungcu.service.FeeItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeeItemServiceImpl implements FeeItemService {

    private final FeeItemRepository feeItemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FeeItemDTO> findAll() {
        return feeItemRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FeeItemDTO findById(Long id) {
        FeeItem feeItem = feeItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeItem", "id", id));
        return toDTO(feeItem);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeItemDTO> findByStatus(String status) {
        return feeItemRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeItemDTO> findByType(String type) {
        return feeItemRepository.findByType(type).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FeeItemDTO create(FeeItemDTO dto) {
        FeeItem feeItem = FeeItem.builder()
                .name(dto.getName())
                .type(dto.getType())
                .unit(dto.getUnit())
                .cost(dto.getCost())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .description(dto.getDescription())
                .build();
        
        feeItem = feeItemRepository.save(feeItem);
        return toDTO(feeItem);
    }

    @Override
    public FeeItemDTO update(Long id, FeeItemDTO dto) {
        FeeItem feeItem = feeItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeItem", "id", id));
        
        feeItem.setName(dto.getName());
        feeItem.setType(dto.getType());
        feeItem.setUnit(dto.getUnit());
        feeItem.setCost(dto.getCost());
        feeItem.setStatus(dto.getStatus());
        feeItem.setDescription(dto.getDescription());
        
        feeItem = feeItemRepository.save(feeItem);
        return toDTO(feeItem);
    }

    @Override
    public void delete(Long id) {
        if (!feeItemRepository.existsById(id)) {
            throw new ResourceNotFoundException("FeeItem", "id", id);
        }
        feeItemRepository.deleteById(id);
    }

    private FeeItemDTO toDTO(FeeItem feeItem) {
        return FeeItemDTO.builder()
                .id(feeItem.getId())
                .name(feeItem.getName())
                .type(feeItem.getType())
                .unit(feeItem.getUnit())
                .cost(feeItem.getCost())
                .status(feeItem.getStatus())
                .description(feeItem.getDescription())
                .createdAt(feeItem.getCreatedAt())
                .updatedAt(feeItem.getUpdatedAt())
                .build();
    }
}
