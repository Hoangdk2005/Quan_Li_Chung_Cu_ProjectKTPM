package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApartmentDTO {
    private Long id;
    private String block;
    private String floor;
    private String unit;
    private BigDecimal area;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
