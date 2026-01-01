package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.FeePeriodDTO;
import com.hoangdo.quanlichungcu.entity.FeePeriod;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.FeePeriodRepository;
import com.hoangdo.quanlichungcu.service.FeePeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeePeriodServiceImpl implements FeePeriodService {

    private final FeePeriodRepository feePeriodRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FeePeriodDTO> findAll() {
        return feePeriodRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FeePeriodDTO findById(Long id) {
        FeePeriod feePeriod = feePeriodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeePeriod", "id", id));
        return toDTO(feePeriod);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeePeriodDTO> findByStatus(String status) {
        return feePeriodRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FeePeriodDTO create(FeePeriodDTO dto) {
        FeePeriod feePeriod = FeePeriod.builder()
                .name(dto.getName())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .status(dto.getStatus() != null ? dto.getStatus() : "DRAFT")
                .build();
        
        feePeriod = feePeriodRepository.save(feePeriod);
        return toDTO(feePeriod);
    }

    @Override
    public FeePeriodDTO update(Long id, FeePeriodDTO dto) {
        FeePeriod feePeriod = feePeriodRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeePeriod", "id", id));
        
        feePeriod.setName(dto.getName());
        feePeriod.setStartDate(dto.getStartDate());
        feePeriod.setEndDate(dto.getEndDate());
        feePeriod.setStatus(dto.getStatus());
        
        feePeriod = feePeriodRepository.save(feePeriod);
        return toDTO(feePeriod);
    }

    @Override
    public void delete(Long id) {
        if (!feePeriodRepository.existsById(id)) {
            throw new ResourceNotFoundException("FeePeriod", "id", id);
        }
        feePeriodRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public FeePeriodDTO findCurrentPeriod() {
        // Tìm kỳ thu đang tiến hành (OPEN), nếu không có thì lấy kỳ mới nhất
        List<FeePeriod> openPeriods = feePeriodRepository.findByStatusOrderByStartDateDesc("OPEN");
        if (!openPeriods.isEmpty()) {
            return toDTO(openPeriods.get(0));
        }
        
        // Nếu không có kỳ OPEN, lấy kỳ DRAFT mới nhất
        List<FeePeriod> draftPeriods = feePeriodRepository.findByStatusOrderByStartDateDesc("DRAFT");
        if (!draftPeriods.isEmpty()) {
            return toDTO(draftPeriods.get(0));
        }
        
        // Nếu không có, lấy kỳ CLOSED mới nhất
        List<FeePeriod> closedPeriods = feePeriodRepository.findByStatusOrderByStartDateDesc("CLOSED");
        if (!closedPeriods.isEmpty()) {
            return toDTO(closedPeriods.get(0));
        }
        
        return null;
    }

    private FeePeriodDTO toDTO(FeePeriod feePeriod) {
        return FeePeriodDTO.builder()
                .id(feePeriod.getId())
                .name(feePeriod.getName())
                .startDate(feePeriod.getStartDate())
                .endDate(feePeriod.getEndDate())
                .status(feePeriod.getStatus())
                .createdAt(feePeriod.getCreatedAt())
                .updatedAt(feePeriod.getUpdatedAt())
                .build();
    }
}
