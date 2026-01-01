package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.Resident;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResidentRepository extends JpaRepository<Resident, Long> {
    
    List<Resident> findByHouseholdId(Long householdId);
    
    Optional<Resident> findByIdNumber(String idNumber);
    
    List<Resident> findByStatus(String status);
    
    Optional<Resident> findByHouseholdIdAndIsHeadTrue(Long householdId);
    
    long countByHouseholdId(Long householdId);
    
    boolean existsByIdNumber(String idNumber);
    
    // Đếm số nhân khẩu theo trạng thái
    long countByStatus(String status);
}
