package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    
    Optional<Apartment> findByBlockAndFloorAndUnit(String block, String floor, String unit);
    
    List<Apartment> findByStatus(String status);
    
    List<Apartment> findByBlock(String block);
}
