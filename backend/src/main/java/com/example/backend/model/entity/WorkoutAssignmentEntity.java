package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
public class WorkoutAssignmentEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private WorkoutPlanEntity workoutPlan;

    @ManyToOne
    private ClientEntity client;

    private LocalDate startDate;

    private LocalDate endDate;

    private boolean isActive; // Indica se l'assegnazione è attiva o meno
}
