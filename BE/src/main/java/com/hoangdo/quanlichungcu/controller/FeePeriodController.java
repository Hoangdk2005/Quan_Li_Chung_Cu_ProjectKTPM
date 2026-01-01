package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.FeePeriodDTO;
import com.hoangdo.quanlichungcu.service.FeeObligationService;
import com.hoangdo.quanlichungcu.service.FeePeriodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-periods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeePeriodController {

    private final FeePeriodService feePeriodService;
    private final FeeObligationService feeObligationService;

    @GetMapping
    public ResponseEntity<List<FeePeriodDTO>> getAll() {
        return ResponseEntity.ok(feePeriodService.findAll());
    }

    @GetMapping("/current")
    public ResponseEntity<FeePeriodDTO> getCurrentPeriod() {
        return ResponseEntity.ok(feePeriodService.findCurrentPeriod());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeePeriodDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feePeriodService.findById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeePeriodDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(feePeriodService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<FeePeriodDTO> create(@RequestBody FeePeriodDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feePeriodService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeePeriodDTO> update(@PathVariable Long id, @RequestBody FeePeriodDTO dto) {
        return ResponseEntity.ok(feePeriodService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feePeriodService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/generate")
    public ResponseEntity<Void> generateObligations(@PathVariable Long id) {
        feeObligationService.generateObligationsForPeriod(id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<FeePeriodDTO> closePeriod(@PathVariable Long id) {
        FeePeriodDTO dto = feePeriodService.findById(id);
        dto.setStatus("CLOSED");
        return ResponseEntity.ok(feePeriodService.update(id, dto));
    }
}
