package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HouseholdDTO {
    private Long id;
    private String householdId;
    private Long apartmentId; // Deprecated - giữ lại cho tương thích ngược
    private List<Long> apartmentIds; // Danh sách ID căn hộ
    private String apartmentInfo; // Block-Floor-Unit (nhiều căn hộ sẽ cách nhau bởi dấu phẩy)
    private String ownerName;
    private String phone;
    private String address;
    private LocalDate moveInDate;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Nested data
    private List<ResidentDTO> residents;
    private List<VehicleDTO> vehicles;
    private int residentCount;
    private int vehicleCount;
}
