package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.FeeObligationDTO;
import com.hoangdo.quanlichungcu.dto.HouseholdDTO;
import com.hoangdo.quanlichungcu.dto.ResidentDTO;
import com.hoangdo.quanlichungcu.dto.VehicleDTO;
import com.hoangdo.quanlichungcu.service.FeeObligationService;
import com.hoangdo.quanlichungcu.service.HouseholdService;
import com.hoangdo.quanlichungcu.service.ResidentService;
import com.hoangdo.quanlichungcu.service.VehicleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/households")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class HouseholdController {

    private final HouseholdService householdService;
    private final FeeObligationService feeObligationService;
    private final ResidentService residentService;
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<List<HouseholdDTO>> getAll() {
        return ResponseEntity.ok(householdService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<HouseholdDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(householdService.findById(id));
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<HouseholdDTO> getByIdWithDetails(@PathVariable Long id) {
        return ResponseEntity.ok(householdService.findByIdWithDetails(id));
    }

    @GetMapping("/code/{householdId}")
    public ResponseEntity<HouseholdDTO> getByHouseholdId(@PathVariable String householdId) {
        return ResponseEntity.ok(householdService.findByHouseholdId(householdId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<HouseholdDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(householdService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<HouseholdDTO> create(@RequestBody HouseholdDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(householdService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HouseholdDTO> update(@PathVariable Long id, @RequestBody HouseholdDTO dto) {
        return ResponseEntity.ok(householdService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        householdService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/fee-obligations")
    public ResponseEntity<List<FeeObligationDTO>> getFeeObligations(@PathVariable Long id) {
        return ResponseEntity.ok(feeObligationService.findByHouseholdId(id));
    }

    @GetMapping("/{id}/residents")
    public ResponseEntity<List<ResidentDTO>> getResidents(@PathVariable Long id) {
        return ResponseEntity.ok(residentService.findByHouseholdId(id));
    }

    @PostMapping("/{id}/residents")
    public ResponseEntity<ResidentDTO> createResident(@PathVariable Long id, @RequestBody ResidentDTO dto) {
        dto.setHouseholdId(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(residentService.create(dto));
    }

    @GetMapping("/{id}/vehicles")
    public ResponseEntity<List<VehicleDTO>> getVehicles(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.findByHouseholdId(id));
    }

    @PostMapping("/{id}/vehicles")
    public ResponseEntity<VehicleDTO> createVehicle(@PathVariable Long id, @RequestBody VehicleDTO dto) {
        dto.setHouseholdId(id);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(dto));
    }

    @PatchMapping("/{id}/move-out")
    public ResponseEntity<HouseholdDTO> moveOut(@PathVariable Long id) {
        HouseholdDTO dto = householdService.findById(id);
        dto.setStatus("MOVED_OUT");
        return ResponseEntity.ok(householdService.update(id, dto));
    }
}
