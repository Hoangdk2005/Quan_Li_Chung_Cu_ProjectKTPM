package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.ApartmentDTO;
import com.hoangdo.quanlichungcu.entity.Apartment;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.ApartmentRepository;
import com.hoangdo.quanlichungcu.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<ApartmentDTO> findAll() {
        return apartmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApartmentDTO findById(Long id) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", id));
        return toDTO(apartment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApartmentDTO> findByStatus(String status) {
        return apartmentRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ApartmentDTO create(ApartmentDTO dto) {
        Apartment apartment = Apartment.builder()
                .block(dto.getBlock())
                .floor(dto.getFloor())
                .unit(dto.getUnit())
                .area(dto.getArea())
                .status(dto.getStatus() != null ? dto.getStatus() : "EMPTY")
                .build();
        
        apartment = apartmentRepository.save(apartment);
        return toDTO(apartment);
    }

    @Override
    public ApartmentDTO update(Long id, ApartmentDTO dto) {
        Apartment apartment = apartmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", id));
        
        apartment.setBlock(dto.getBlock());
        apartment.setFloor(dto.getFloor());
        apartment.setUnit(dto.getUnit());
        apartment.setArea(dto.getArea());
        apartment.setStatus(dto.getStatus());
        
        apartment = apartmentRepository.save(apartment);
        return toDTO(apartment);
    }

    @Override
    public void delete(Long id) {
        if (!apartmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Apartment", "id", id);
        }
        apartmentRepository.deleteById(id);
    }

    private ApartmentDTO toDTO(Apartment apartment) {
        return ApartmentDTO.builder()
                .id(apartment.getId())
                .block(apartment.getBlock())
                .floor(apartment.getFloor())
                .unit(apartment.getUnit())
                .area(apartment.getArea())
                .status(apartment.getStatus())
                .createdAt(apartment.getCreatedAt())
                .updatedAt(apartment.getUpdatedAt())
                .build();
    }
}
