package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.HouseholdDTO;
import com.hoangdo.quanlichungcu.dto.ResidentDTO;
import com.hoangdo.quanlichungcu.dto.VehicleDTO;
import com.hoangdo.quanlichungcu.entity.Apartment;
import com.hoangdo.quanlichungcu.entity.Household;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.ApartmentRepository;
import com.hoangdo.quanlichungcu.repository.HouseholdRepository;
import com.hoangdo.quanlichungcu.service.HouseholdService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class HouseholdServiceImpl implements HouseholdService {

    private final HouseholdRepository householdRepository;
    private final ApartmentRepository apartmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<HouseholdDTO> findAll() {
        return householdRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public HouseholdDTO findById(Long id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", id));
        return toDTO(household);
    }

    @Override
    @Transactional(readOnly = true)
    public HouseholdDTO findByHouseholdId(String householdId) {
        Household household = householdRepository.findByHouseholdId(householdId)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "householdId", householdId));
        return toDTO(household);
    }

    @Override
    @Transactional(readOnly = true)
    public HouseholdDTO findByIdWithDetails(Long id) {
        Household household = householdRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", id));
        return toDTOWithDetails(household);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HouseholdDTO> findByStatus(String status) {
        return householdRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public HouseholdDTO create(HouseholdDTO dto) {
        Apartment apartment = apartmentRepository.findById(dto.getApartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", dto.getApartmentId()));
        
        Household household = Household.builder()
                .householdId(dto.getHouseholdId())
                .apartment(apartment)
                .ownerName(dto.getOwnerName())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .moveInDate(dto.getMoveInDate())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
        
        // Update apartment status
        apartment.setStatus("OCCUPIED");
        apartmentRepository.save(apartment);
        
        household = householdRepository.save(household);
        return toDTO(household);
    }

    @Override
    public HouseholdDTO update(Long id, HouseholdDTO dto) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", id));
        
        if (!household.getApartment().getId().equals(dto.getApartmentId())) {
            Apartment newApartment = apartmentRepository.findById(dto.getApartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", dto.getApartmentId()));
            
            // Update old apartment status
            household.getApartment().setStatus("EMPTY");
            apartmentRepository.save(household.getApartment());
            
            // Update new apartment
            newApartment.setStatus("OCCUPIED");
            apartmentRepository.save(newApartment);
            
            household.setApartment(newApartment);
        }
        
        household.setHouseholdId(dto.getHouseholdId());
        household.setOwnerName(dto.getOwnerName());
        household.setPhone(dto.getPhone());
        household.setAddress(dto.getAddress());
        household.setMoveInDate(dto.getMoveInDate());
        household.setStatus(dto.getStatus());
        
        household = householdRepository.save(household);
        return toDTO(household);
    }

    @Override
    public void delete(Long id) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", id));
        
        // Update apartment status
        household.getApartment().setStatus("EMPTY");
        apartmentRepository.save(household.getApartment());
        
        householdRepository.deleteById(id);
    }

    private HouseholdDTO toDTO(Household household) {
        Apartment apt = household.getApartment();
        return HouseholdDTO.builder()
                .id(household.getId())
                .householdId(household.getHouseholdId())
                .apartmentId(apt.getId())
                .apartmentInfo(apt.getBlock() + "-" + apt.getFloor() + "-" + apt.getUnit())
                .ownerName(household.getOwnerName())
                .phone(household.getPhone())
                .address(household.getAddress())
                .moveInDate(household.getMoveInDate())
                .status(household.getStatus())
                .createdAt(household.getCreatedAt())
                .updatedAt(household.getUpdatedAt())
                .residentCount(household.getResidents() != null ? household.getResidents().size() : 0)
                .vehicleCount(household.getVehicles() != null ? household.getVehicles().size() : 0)
                .build();
    }

    private HouseholdDTO toDTOWithDetails(Household household) {
        HouseholdDTO dto = toDTO(household);
        
        if (household.getResidents() != null) {
            dto.setResidents(household.getResidents().stream()
                    .map(r -> ResidentDTO.builder()
                            .id(r.getId())
                            .householdId(r.getHousehold().getId())
                            .fullName(r.getFullName())
                            .dob(r.getDob())
                            .gender(r.getGender())
                            .idNumber(r.getIdNumber())
                            .relationshipToHead(r.getRelationshipToHead())
                            .phone(r.getPhone())
                            .isHead(r.getIsHead())
                            .status(r.getStatus())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        if (household.getVehicles() != null) {
            dto.setVehicles(household.getVehicles().stream()
                    .map(v -> VehicleDTO.builder()
                            .id(v.getId())
                            .householdId(v.getHousehold().getId())
                            .type(v.getType())
                            .plate(v.getPlate())
                            .brand(v.getBrand())
                            .color(v.getColor())
                            .status(v.getStatus())
                            .build())
                    .collect(Collectors.toList()));
        }
        
        return dto;
    }
}
