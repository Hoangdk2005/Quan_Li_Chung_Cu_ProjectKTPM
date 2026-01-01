package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.ResidentDTO;
import com.hoangdo.quanlichungcu.service.ResidentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/residents")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResidentController {

    private final ResidentService residentService;

    @GetMapping
    public ResponseEntity<List<ResidentDTO>> getAll() {
        return ResponseEntity.ok(residentService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResidentDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(residentService.findById(id));
    }

    @GetMapping("/household/{householdId}")
    public ResponseEntity<List<ResidentDTO>> getByHouseholdId(@PathVariable Long householdId) {
        return ResponseEntity.ok(residentService.findByHouseholdId(householdId));
    }

    @PostMapping
    public ResponseEntity<ResidentDTO> create(@RequestBody ResidentDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(residentService.create(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResidentDTO> update(@PathVariable Long id, @RequestBody ResidentDTO dto) {
        return ResponseEntity.ok(residentService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        residentService.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Xóa cư dân là chủ hộ và chuyển quyền chủ hộ cho người khác
     * @param id ID của cư dân cần xóa (chủ hộ)
     * @param newHeadId ID của cư dân sẽ trở thành chủ hộ mới
     */
    @DeleteMapping("/{id}/transfer-head/{newHeadId}")
    public ResponseEntity<Void> deleteHeadAndTransfer(
            @PathVariable Long id, 
            @PathVariable Long newHeadId) {
        residentService.deleteHeadAndTransfer(id, newHeadId);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Kiểm tra cư dân có phải là chủ hộ không
     */
    @GetMapping("/{id}/is-head")
    public ResponseEntity<Boolean> isHeadOfHousehold(@PathVariable Long id) {
        return ResponseEntity.ok(residentService.isHeadOfHousehold(id));
    }
}
