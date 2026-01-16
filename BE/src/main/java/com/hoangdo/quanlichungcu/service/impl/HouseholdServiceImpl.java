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

import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
        // Lấy danh sách apartmentIds - hỗ trợ cả apartmentId đơn và apartmentIds
        List<Long> apartmentIds = dto.getApartmentIds();
        if (apartmentIds == null || apartmentIds.isEmpty()) {
            if (dto.getApartmentId() != null) {
                apartmentIds = List.of(dto.getApartmentId());
            } else {
                throw new IllegalArgumentException("Phải chọn ít nhất một căn hộ");
            }
        }
        
        // Lấy danh sách căn hộ
        Set<Apartment> apartments = new HashSet<>();
        for (Long apartmentId : apartmentIds) {
            Apartment apartment = apartmentRepository.findById(apartmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", apartmentId));
            apartments.add(apartment);
            // Cập nhật trạng thái căn hộ
            apartment.setStatus("OCCUPIED");
            apartmentRepository.save(apartment);
        }
        
        Household household = Household.builder()
                .householdId(dto.getHouseholdId())
                .apartments(apartments)
                .ownerName(dto.getOwnerName())
                .phone(dto.getPhone())
                .address(dto.getAddress())
                .moveInDate(dto.getMoveInDate())
                .status(dto.getStatus() != null ? dto.getStatus() : "ACTIVE")
                .build();
        
        household = householdRepository.save(household);
        return toDTO(household);
    }

    @Override
    public HouseholdDTO update(Long id, HouseholdDTO dto) {
        Household household = householdRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", id));
        
        // Lấy danh sách apartmentIds mới
        List<Long> newApartmentIds = dto.getApartmentIds();
        if (newApartmentIds == null || newApartmentIds.isEmpty()) {
            if (dto.getApartmentId() != null) {
                newApartmentIds = List.of(dto.getApartmentId());
            } else {
                throw new IllegalArgumentException("Phải chọn ít nhất một căn hộ");
            }
        }
        
        // Lấy danh sách căn hộ cũ
        Set<Long> oldApartmentIds = household.getApartments().stream()
                .map(Apartment::getId)
                .collect(Collectors.toSet());
        
        Set<Long> newIds = new HashSet<>(newApartmentIds);
        
        // Cập nhật trạng thái các căn hộ bị loại bỏ
        for (Apartment oldApartment : household.getApartments()) {
            if (!newIds.contains(oldApartment.getId())) {
                oldApartment.setStatus("EMPTY");
                apartmentRepository.save(oldApartment);
            }
        }
        
        // Thêm các căn hộ mới
        Set<Apartment> apartments = new HashSet<>();
        for (Long apartmentId : newApartmentIds) {
            Apartment apartment = apartmentRepository.findById(apartmentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Apartment", "id", apartmentId));
            apartments.add(apartment);
            // Cập nhật trạng thái căn hộ mới
            if (!oldApartmentIds.contains(apartmentId)) {
                apartment.setStatus("OCCUPIED");
                apartmentRepository.save(apartment);
            }
        }
        
        household.setApartments(apartments);
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
        
        // Cập nhật trạng thái tất cả các căn hộ về EMPTY
        for (Apartment apartment : household.getApartments()) {
            apartment.setStatus("EMPTY");
            apartmentRepository.save(apartment);
        }
        
        householdRepository.deleteById(id);
    }

    private HouseholdDTO toDTO(Household household) {
        Set<Apartment> apts = household.getApartments();
        
        // Tạo thông tin căn hộ và danh sách ID
        String apartmentInfo = apts.stream()
                .map(apt -> apt.getBlock() + "-" + apt.getFloor() + "-" + apt.getUnit())
                .collect(Collectors.joining(", "));
        
        List<Long> apartmentIds = apts.stream()
                .map(Apartment::getId)
                .collect(Collectors.toList());
        
        // Lấy ID căn hộ đầu tiên cho tương thích ngược
        Long firstApartmentId = apartmentIds.isEmpty() ? null : apartmentIds.get(0);
        
        return HouseholdDTO.builder()
                .id(household.getId())
                .householdId(household.getHouseholdId())
                .apartmentId(firstApartmentId)
                .apartmentIds(apartmentIds)
                .apartmentInfo(apartmentInfo)
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
