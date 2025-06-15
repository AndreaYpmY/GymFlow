package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity

@Table(name = "workout_assignments")
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


    public WorkoutAssignmentEntity() {
    }

    public WorkoutAssignmentEntity(WorkoutPlanEntity workoutPlan, ClientEntity client, LocalDate startDate, LocalDate endDate, boolean isActive) {
        this.workoutPlan = workoutPlan;
        this.client = client;
        this.startDate = startDate;
        this.endDate = endDate;
        this.isActive = isActive;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WorkoutPlanEntity getWorkoutPlan() {
        return workoutPlan;
    }

    public void setWorkoutPlan(WorkoutPlanEntity workoutPlan) {
        this.workoutPlan = workoutPlan;
    }

    public ClientEntity getClient() {
        return client;
    }

    public void setClient(ClientEntity client) {
        this.client = client;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

}
