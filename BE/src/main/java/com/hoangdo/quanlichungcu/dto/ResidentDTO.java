package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResidentDTO {
    private Long id;
    private Long householdId;
    private String householdCode;
    private String fullName;
    private LocalDate dob;
    private String gender;
    private String idNumber;
    private String relationshipToHead;
    private String phone;
    private Boolean isHead;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
