package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    List<Notification> findByStatus(String status);
    
    List<Notification> findByType(String type);
    
    List<Notification> findByStatusOrderByCreatedDateDesc(String status);
    
    List<Notification> findAllByOrderByCreatedDateDesc();
}
