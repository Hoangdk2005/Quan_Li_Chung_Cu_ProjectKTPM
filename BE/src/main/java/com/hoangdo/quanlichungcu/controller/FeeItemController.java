package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.FeeItemDTO;
import com.hoangdo.quanlichungcu.service.FeeItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fee-items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeeItemController {

    private final FeeItemService feeItemService;

    @GetMapping
    public ResponseEntity<List<FeeItemDTO>> getAll() {
        return ResponseEntity.ok(feeItemService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FeeItemDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(feeItemService.findById(id));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<FeeItemDTO>> getByStatus(@PathVariable String status) {
        return ResponseEntity.ok(feeItemService.findByStatus(status));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<FeeItemDTO>> getByType(@PathVariable String type) {
        return ResponseEntity.ok(feeItemService.findByType(type));
    }

    @PostMapping
    public ResponseEntity<FeeItemDTO> create(@RequestBody FeeItemDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(feeItemService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FeeItemDTO> update(@PathVariable Long id, @RequestBody FeeItemDTO dto) {
        return ResponseEntity.ok(feeItemService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        feeItemService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
