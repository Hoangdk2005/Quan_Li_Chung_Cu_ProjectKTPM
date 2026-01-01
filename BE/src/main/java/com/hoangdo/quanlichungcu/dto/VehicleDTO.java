package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VehicleDTO {
    private Long id;
    private Long householdId;
    private String householdCode;
    private String type;
    private String plate;
    private String brand;
    private String color;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
