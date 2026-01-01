package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.FeePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeePeriodRepository extends JpaRepository<FeePeriod, Long> {
    
    Optional<FeePeriod> findByName(String name);
    
    List<FeePeriod> findByStatus(String status);
    
    List<FeePeriod> findByStatusOrderByStartDateDesc(String status);
    
    boolean existsByName(String name);
}
