package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.FeeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeItemRepository extends JpaRepository<FeeItem, Long> {
    
    Optional<FeeItem> findByName(String name);
    
    List<FeeItem> findByStatus(String status);
    
    List<FeeItem> findByType(String type);
    
    boolean existsByName(String name);
}
