package com.hoangdo.quanlichungcu.service.impl;

import com.hoangdo.quanlichungcu.dto.FeeObligationDTO;
import com.hoangdo.quanlichungcu.entity.FeeItem;
import com.hoangdo.quanlichungcu.entity.FeeObligation;
import com.hoangdo.quanlichungcu.entity.FeePeriod;
import com.hoangdo.quanlichungcu.entity.Household;
import com.hoangdo.quanlichungcu.exception.ResourceNotFoundException;
import com.hoangdo.quanlichungcu.repository.*;
import com.hoangdo.quanlichungcu.service.FeeObligationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FeeObligationServiceImpl implements FeeObligationService {

    private final FeeObligationRepository feeObligationRepository;
    private final HouseholdRepository householdRepository;
    private final FeeItemRepository feeItemRepository;
    private final FeePeriodRepository feePeriodRepository;

    @Override
    @Transactional(readOnly = true)
    public List<FeeObligationDTO> findAll() {
        return feeObligationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FeeObligationDTO findById(Long id) {
        FeeObligation obligation = feeObligationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeObligation", "id", id));
        return toDTO(obligation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeObligationDTO> findByHouseholdId(Long householdId) {
        return feeObligationRepository.findByHouseholdId(householdId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeObligationDTO> findByFeePeriodId(Long feePeriodId) {
        return feeObligationRepository.findByFeePeriodId(feePeriodId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FeeObligationDTO> findByStatus(String status) {
        return feeObligationRepository.findByStatus(status).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public FeeObligationDTO create(FeeObligationDTO dto) {
        Household household = householdRepository.findById(dto.getHouseholdId())
                .orElseThrow(() -> new ResourceNotFoundException("Household", "id", dto.getHouseholdId()));
        
        FeeItem feeItem = feeItemRepository.findById(dto.getFeeItemId())
                .orElseThrow(() -> new ResourceNotFoundException("FeeItem", "id", dto.getFeeItemId()));
        
        FeePeriod feePeriod = feePeriodRepository.findById(dto.getFeePeriodId())
                .orElseThrow(() -> new ResourceNotFoundException("FeePeriod", "id", dto.getFeePeriodId()));
        
        FeeObligation obligation = FeeObligation.builder()
                .household(household)
                .feeItem(feeItem)
                .feePeriod(feePeriod)
                .feeItemName(feeItem.getName())
                .periodYm(feePeriod.getName())
                .expectedAmount(dto.getExpectedAmount())
                .paidAmount(BigDecimal.ZERO)
                .dueDate(dto.getDueDate())
                .status("UNPAID")
                .build();
        
        obligation = feeObligationRepository.save(obligation);
        return toDTO(obligation);
    }

    @Override
    public FeeObligationDTO update(Long id, FeeObligationDTO dto) {
        FeeObligation obligation = feeObligationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeObligation", "id", id));
        
        obligation.setExpectedAmount(dto.getExpectedAmount());
        obligation.setDueDate(dto.getDueDate());
        obligation.setNote(dto.getNote());
        
        obligation = feeObligationRepository.save(obligation);
        return toDTO(obligation);
    }

    @Override
    public FeeObligationDTO pay(Long id, FeeObligationDTO paymentInfo) {
        FeeObligation obligation = feeObligationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FeeObligation", "id", id));
        
        // Cộng thêm số tiền mới vào số tiền đã thu trước đó
        BigDecimal currentPaid = obligation.getPaidAmount() != null ? obligation.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal newPayment = paymentInfo.getPaidAmount() != null ? paymentInfo.getPaidAmount() : BigDecimal.ZERO;
        BigDecimal totalPaid = currentPaid.add(newPayment);
        
        obligation.setPaidAmount(totalPaid);
        obligation.setPayerName(paymentInfo.getPayerName());
        obligation.setPaymentMethod(paymentInfo.getPaymentMethod());
        obligation.setPaidAt(LocalDateTime.now());
        obligation.setNote(paymentInfo.getNote());
        
        // Update status based on payment
        if (obligation.getPaidAmount().compareTo(obligation.getExpectedAmount()) >= 0) {
            obligation.setStatus("PAID");
        } else if (obligation.getPaidAmount().compareTo(BigDecimal.ZERO) > 0) {
            obligation.setStatus("PARTIAL");
        }
        
        obligation = feeObligationRepository.save(obligation);
        return toDTO(obligation);
    }

    @Override
    public void delete(Long id) {
        if (!feeObligationRepository.existsById(id)) {
            throw new ResourceNotFoundException("FeeObligation", "id", id);
        }
        feeObligationRepository.deleteById(id);
    }

    @Override
    public void generateObligationsForPeriod(Long feePeriodId) {
        FeePeriod feePeriod = feePeriodRepository.findById(feePeriodId)
                .orElseThrow(() -> new ResourceNotFoundException("FeePeriod", "id", feePeriodId));
        
        List<Household> households = householdRepository.findByStatus("ACTIVE");
        List<FeeItem> feeItems = feeItemRepository.findByStatus("ACTIVE");
        
        for (Household household : households) {
            for (FeeItem feeItem : feeItems) {
                // Calculate expected amount based on fee item type
                BigDecimal expectedAmount = calculateExpectedAmount(feeItem, household);
                
                FeeObligation obligation = FeeObligation.builder()
                        .household(household)
                        .feeItem(feeItem)
                        .feePeriod(feePeriod)
                        .feeItemName(feeItem.getName())
                        .periodYm(feePeriod.getName())
                        .expectedAmount(expectedAmount)
                        .paidAmount(BigDecimal.ZERO)
                        .status("UNPAID")
                        .build();
                
                feeObligationRepository.save(obligation);
            }
        }
        
        // Cập nhật trạng thái kỳ thu thành OPEN (Đang tiến hành)
        feePeriod.setStatus("OPEN");
        feePeriodRepository.save(feePeriod);
    }

    private BigDecimal calculateExpectedAmount(FeeItem feeItem, Household household) {
        switch (feeItem.getUnit()) {
            case "M2":
                BigDecimal area = household.getApartment().getArea();
                return area != null ? feeItem.getCost().multiply(area) : BigDecimal.ZERO;
            case "FIXED":
                return feeItem.getCost();
            default:
                return feeItem.getCost();
        }
    }

    private FeeObligationDTO toDTO(FeeObligation obligation) {
        return FeeObligationDTO.builder()
                .id(obligation.getId())
                .householdId(obligation.getHousehold().getId())
                .householdCode(obligation.getHousehold().getHouseholdId())
                .ownerName(obligation.getHousehold().getOwnerName())
                .feeItemId(obligation.getFeeItem().getId())
                .feeItemName(obligation.getFeeItemName())
                .feePeriodId(obligation.getFeePeriod().getId())
                .periodYm(obligation.getPeriodYm())
                .periodStatus(obligation.getFeePeriod().getStatus())
                .expectedAmount(obligation.getExpectedAmount())
                .paidAmount(obligation.getPaidAmount())
                .dueDate(obligation.getDueDate())
                .status(obligation.getStatus())
                .payerName(obligation.getPayerName())
                .paidAt(obligation.getPaidAt())
                .paymentMethod(obligation.getPaymentMethod())
                .note(obligation.getNote())
                .createdAt(obligation.getCreatedAt())
                .updatedAt(obligation.getUpdatedAt())
                .build();
    }
}
