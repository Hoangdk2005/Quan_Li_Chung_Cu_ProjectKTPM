package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.LoginRequestDTO;
import com.hoangdo.quanlichungcu.dto.LoginResponseDTO;
import com.hoangdo.quanlichungcu.dto.RegisterRequestDTO;

import java.util.Map;

public interface AuthService {
    Map<String, Object> register(RegisterRequestDTO request);
    LoginResponseDTO login(LoginRequestDTO request);
}
