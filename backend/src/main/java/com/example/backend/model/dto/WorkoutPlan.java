package com.example.backend.model.dto;

import lombok.Data;

@Data
public class WorkoutPlan {
    private long id;
    private Trainer trainer;
    private String title;
    private String description;
    private boolean isPublic= false;

}
