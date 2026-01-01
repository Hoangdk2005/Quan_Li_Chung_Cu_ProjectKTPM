package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.ApartmentDTO;
import com.hoangdo.quanlichungcu.service.ApartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apartments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ApartmentController {

    private final ApartmentService apartmentService;

    @GetMapping
    public ResponseEntity<List<ApartmentDTO>> getAll() {
        return ResponseEntity.ok(apartmentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApartmentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(apartmentService.findById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<ApartmentDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(apartmentService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<ApartmentDTO> create(@RequestBody ApartmentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(apartmentService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApartmentDTO> update(@PathVariable Long id, @RequestBody ApartmentDTO dto) {
        return ResponseEntity.ok(apartmentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        apartmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
