package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    
    List<Vehicle> findByHouseholdId(Long householdId);
    
    Optional<Vehicle> findByPlate(String plate);
    
    List<Vehicle> findByType(String type);
    
    List<Vehicle> findByStatus(String status);
    
    boolean existsByPlate(String plate);
    
    long countByHouseholdId(Long householdId);
}
