package com.hoangdo.quanlichungcu.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private String type;
    private String status;
    private String targetType;
    private LocalDateTime createdDate;
    private LocalDateTime publishedAt;
    private Long createdById;
    private String createdByName;
}
