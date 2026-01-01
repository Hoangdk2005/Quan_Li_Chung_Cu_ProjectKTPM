package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.LoginRequestDTO;
import com.hoangdo.quanlichungcu.dto.LoginResponseDTO;
import com.hoangdo.quanlichungcu.dto.RegisterRequestDTO;
import com.hoangdo.quanlichungcu.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {
        return ResponseEntity.ok(authService.login(request));
    }

    // Endpoint tạm để lấy hash cho password - sau khi fix xong có thể xóa
    @GetMapping("/generate-hash")
    public ResponseEntity<?> generateHash(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return ResponseEntity.ok(Map.of("password", password, "hash", hash));
    }
}
