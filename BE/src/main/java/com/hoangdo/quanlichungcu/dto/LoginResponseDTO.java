package com.hoangdo.quanlichungcu.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private Long householdId;
    private String householdCode;
    private List<String> roles;
    private String token;
    private String message;
}
