package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.VehicleDTO;
import com.hoangdo.quanlichungcu.entity.Household;
import com.hoangdo.quanlichungcu.entity.Vehicle;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.HouseholdRepository;
import com.hoangdo.quanlichungcu.repository.VehicleRepository;
import com.hoangdo.quanlichungcu.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final HouseholdRepository householdRepository;

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDTO> findAll() {
        return vehicleRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleDTO findById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        return toDTO(vehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleDTO> findByHouseholdId(Long householdId) {
        return vehicleRepository.findByHouseholdId(householdId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VehicleDTO create(VehicleDTO dto) {
        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", dto.getHouseholdId()));
        
        Vehicle vehicle = Vehicle.builder()
                .household(household)
                .type(dto.getType())
                .plate(dto.getPlate())
                .brand(dto.getBrand())
                .color(dto.getColor())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
        
        vehicle = vehicleRepository.save(vehicle);
        return toDTO(vehicle);
    }

    @Override
    public VehicleDTO update(Long id, VehicleDTO dto) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", "id", id));
        
        if (!vehicle.getHousehold().getId().equals(dto.getHouseholdId())) {
            Household newHousehold = householdRepository.findById(dto.getHouseholdId())
                    .orElseThrow(() -> new ResourceNotFoundException("Household", "id", dto.getHouseholdId()));
            vehicle.setHousehold(newHousehold);
        }
        
        vehicle.setType(dto.getType());
        vehicle.setPlate(dto.getPlate());
        vehicle.setBrand(dto.getBrand());
        vehicle.setColor(dto.getColor());
        vehicle.setStatus(dto.getStatus());
        
        vehicle = vehicleRepository.save(vehicle);
        return toDTO(vehicle);
    }

    @Override
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new ResourceNotFoundException("Vehicle", "id", id);
        }
        vehicleRepository.deleteById(id);
    }

    private VehicleDTO toDTO(Vehicle vehicle) {
        return VehicleDTO.builder()
                .id(vehicle.getId())
                .householdId(vehicle.getHousehold().getId())
                .householdCode(vehicle.getHousehold().getHouseholdId())
                .type(vehicle.getType())
                .plate(vehicle.getPlate())
                .brand(vehicle.getBrand())
                .color(vehicle.getColor())
                .status(vehicle.getStatus())
                .createdAt(vehicle.getCreatedAt())
                .updatedAt(vehicle.getUpdatedAt())
                .build();
    }
}
