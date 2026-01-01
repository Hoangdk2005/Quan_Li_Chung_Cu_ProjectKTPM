package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.NotificationDTO;
import com.hoangdo.quanlichungcu.entity.Notification;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.NotificationRepository;
import com.hoangdo.quanlichungcu.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> findAll() {
        return notificationRepository.findAllByOrderByCreatedDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDTO findById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        return toDTO(notification);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> findByStatus(String status) {
        return notificationRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NotificationDTO create(NotificationDTO dto) {
        Notification notification = Notification.builder()
                .title(dto.getTitle())
                .content(dto.getContent())
                .type(dto.getType() != null ? dto.getType() : "INFO")
                .status("DRAFT")
                .targetType(dto.getTargetType() != null ? dto.getTargetType() : "ALL")
                .build();
        
        notification = notificationRepository.save(notification);
        return toDTO(notification);
    }

    @Override
    public NotificationDTO update(Long id, NotificationDTO dto) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        
        notification.setTitle(dto.getTitle());
        notification.setContent(dto.getContent());
        notification.setType(dto.getType());
        notification.setTargetType(dto.getTargetType());
        
        notification = notificationRepository.save(notification);
        return toDTO(notification);
    }

    @Override
    public NotificationDTO publish(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", id));
        
        notification.setStatus("PUBLISHED");
        notification.setPublishedAt(LocalDateTime.now());
        
        notification = notificationRepository.save(notification);
        return toDTO(notification);
    }

    @Override
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResourceNotFoundException("Notification", "id", id);
        }
        notificationRepository.deleteById(id);
    }

    private NotificationDTO toDTO(Notification notification) {
        return NotificationDTO.builder()
                .id(notification.getId())
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType())
                .status(notification.getStatus())
                .targetType(notification.getTargetType())
                .createdDate(notification.getCreatedDate())
                .publishedAt(notification.getPublishedAt())
                .createdById(notification.getCreatedBy() != null ? notification.getCreatedBy().getId() : null)
                .createdByName(notification.getCreatedBy() != null ? notification.getCreatedBy().getFullName() : null)
                .build();
    }
}
