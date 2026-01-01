package com.hoangdo.quanlichungcu.service;

import com.hoangdo.quanlichungcu.dto.DashboardAnalyticsDTO;
import com.hoangdo.quanlichungcu.dto.ReportSummaryDTO;

public interface ReportService {
    ReportSummaryDTO getSummary(String periodYm);
    
    DashboardAnalyticsDTO getDashboardAnalytics();
}
