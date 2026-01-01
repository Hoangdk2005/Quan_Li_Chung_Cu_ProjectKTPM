package com.hoangdo.quanlichungcu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "residents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resident {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "household_id", nullable = false)
    private Household household;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column
    private LocalDate dob;

    @Column(length = 10)
    private String gender;

    @Column(name = "id_number", unique = true, length = 30)
    private String idNumber;

    @Column(name = "relationship_to_head", length = 50)
    private String relationshipToHead;

    @Column(length = 20)
    private String phone;

    @Column(name = "is_head", nullable = false)
    private Boolean isHead = false;

    @Column(nullable = false, length = 20)
    private String status = "ACTIVE";

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
