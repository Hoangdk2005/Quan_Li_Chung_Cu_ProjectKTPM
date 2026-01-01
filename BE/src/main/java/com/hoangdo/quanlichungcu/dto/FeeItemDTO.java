package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeeItemDTO {
    private Long id;
    private String name;
    private String type;
    private String unit;
    private BigDecimal cost;
    private String status;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
