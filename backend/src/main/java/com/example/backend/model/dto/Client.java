package com.example.backend.model.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
public class Client extends User{
    private long id;
    private List<Reservation> reservations;
    private List<WorkoutPlan> workoutPlans;
    private LocalDate subscriptionStartDate;
    private LocalDate subscriptionEndDate;
}
