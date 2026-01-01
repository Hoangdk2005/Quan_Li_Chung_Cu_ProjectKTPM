package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.FeeObligationDTO;
import com.hoangdo.quanlichungcu.service.FeeObligationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-obligations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeeObligationController {

    private final FeeObligationService feeObligationService;

    @GetMapping
    public ResponseEntity<List<FeeObligationDTO>> getAll() {
        return ResponseEntity.ok(feeObligationService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeObligationDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feeObligationService.findById(id));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<FeeObligationDTO>> getByHouseholdId(@PathVariable Long householdId) {
        return ResponseEntity.ok(feeObligationService.findByHouseholdId(householdId));
    }

    @GetMapping("/period/{periodId}")
    public ResponseEntity<List<FeeObligationDTO>> getByPeriodId(@PathVariable Long periodId) {
        return ResponseEntity.ok(feeObligationService.findByFeePeriodId(periodId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeeObligationDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(feeObligationService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<FeeObligationDTO> create(@RequestBody FeeObligationDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feeObligationService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeObligationDTO> update(@PathVariable Long id, @RequestBody FeeObligationDTO dto) {
        return ResponseEntity.ok(feeObligationService.update(id, dto));
    }

    @PatchMapping("/{id}/pay")
    public ResponseEntity<FeeObligationDTO> pay(@PathVariable Long id, @RequestBody FeeObligationDTO paymentInfo) {
        return ResponseEntity.ok(feeObligationService.pay(id, paymentInfo));
    }

    @PostMapping("/generate/{periodId}")
    public ResponseEntity<Void> generateForPeriod(@PathVariable Long periodId) {
        feeObligationService.generateObligationsForPeriod(periodId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feeObligationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
