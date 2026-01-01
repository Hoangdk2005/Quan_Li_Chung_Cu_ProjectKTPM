package com.hoangdo.quanlichungcu.repository;

import com.hoangdo.quanlichungcu.entity.Household;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HouseholdRepository extends JpaRepository<Household, Long> {
    
    Optional<Household> findByHouseholdId(String householdId);
    
    List<Household> findByStatus(String status);
    
    List<Household> findByApartmentId(Long apartmentId);
    
    @Query("SELECT h FROM Household h LEFT JOIN FETCH h.residents LEFT JOIN FETCH h.vehicles WHERE h.id = :id")
    Optional<Household> findByIdWithDetails(Long id);
    
    boolean existsByHouseholdId(String householdId);
}
