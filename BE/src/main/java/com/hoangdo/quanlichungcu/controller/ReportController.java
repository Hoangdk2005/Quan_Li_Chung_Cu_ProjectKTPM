package com.hoangdo.quanlichungcu.controller;

import com.hoangdo.quanlichungcu.dto.DashboardAnalyticsDTO;
import com.hoangdo.quanlichungcu.dto.ReportSummaryDTO;
import com.hoangdo.quanlichungcu.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDTO> getSummary(
            @RequestParam(required = false) String periodYm) {
        return ResponseEntity.ok(reportService.getSummary(periodYm));
    }
    
    @GetMapping("/analytics")
    public ResponseEntity<DashboardAnalyticsDTO> getAnalytics() {
        return ResponseEntity.ok(reportService.getDashboardAnalytics());
    }
}
