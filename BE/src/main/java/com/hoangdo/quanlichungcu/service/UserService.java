package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.UserDTO;

import java.util.List;

public interface UserService {
    
    List<UserDTO> findAll();
    
    UserDTO findById(Long id);
    
    UserDTO findByUsername(String username);
    
    UserDTO create(UserDTO dto, String password);
    
    UserDTO update(Long id, UserDTO dto);
    
    void delete(Long id);
    
    void changePassword(Long id, String oldPassword, String newPassword);
}
