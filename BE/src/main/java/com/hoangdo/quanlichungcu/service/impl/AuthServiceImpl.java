package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.LoginRequestDTO;
import com.hoangdo.quanlichungcu.dto.LoginResponseDTO;
import com.hoangdo.quanlichungcu.dto.RegisterRequestDTO;
import com.hoangdo.quanlichungcu.entity.Role;
import com.hoangdo.quanlichungcu.entity.User;
import com.hoangdo.quanlichungcu.exception.BadRequestException;
import com.hoangdo.quanlichungcu.repository.HouseholdRepository;
import com.hoangdo.quanlichungcu.repository.RoleRepository;
import com.hoangdo.quanlichungcu.repository.UserRepository;
import com.hoangdo.quanlichungcu.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final HouseholdRepository householdRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public Map<String, Object> register(RegisterRequestDTO request) {
        // Kiểm tra username đã tồn tại
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new BadRequestException("Ten tai khoan da ton tai!");
        }

        // Kiểm tra email đã tồn tại
        if (request.getEmail() != null && userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new BadRequestException("Email da duoc su dung!");
        }

        // Lấy role RESIDENT (cư dân) - mặc định cho người đăng ký
        Role residentRole = roleRepository.findByCode("RESIDENT")
                .orElseThrow(() -> new BadRequestException("Khong tim thay role RESIDENT"));

        // Tạo user mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setStatus("ACTIVE");

        // Gán role RESIDENT
        Set<Role> roles = new HashSet<>();
        roles.add(residentRole);
        user.setRoles(roles);

        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Dang ky thanh cong!");
        response.put("userId", user.getId());
        response.put("username", user.getUsername());
        response.put("role", "RESIDENT");

        return response;
    }

    @Override
    public LoginResponseDTO login(LoginRequestDTO request) {
        // Tìm user theo username
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BadRequestException("Sai ten dang nhap hoac mat khau!"));

        // Kiểm tra password
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Sai ten dang nhap hoac mat khau!");
        }

        // Kiểm tra trạng thái tài khoản
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new BadRequestException("Tai khoan da bi khoa!");
        }

        // Lấy danh sách role codes
        var roleCodes = user.getRoles().stream()
                .map(Role::getCode)
                .collect(Collectors.toList());

        // Tạo token đơn giản (có thể thay bằng JWT thực sự sau)
        String simpleToken = "token_" + user.getId() + "_" + System.currentTimeMillis();

        // Lấy household code nếu user là cư dân
        String householdCode = null;
        if (user.getHouseholdId() != null) {
            householdCode = householdRepository.findById(user.getHouseholdId())
                    .map(h -> h.getHouseholdId())
                    .orElse(null);
        }

        return LoginResponseDTO.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .householdId(user.getHouseholdId())
                .householdCode(householdCode)
                .roles(roleCodes)
                .token(simpleToken)
                .message("Dang nhap thanh cong!")
                .build();
    }
}
