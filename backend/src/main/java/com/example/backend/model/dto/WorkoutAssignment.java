package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkoutAssignment {
    private long id;
    private WorkoutPlan workoutPlan;
    private Client client;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean isActive = true;
}
