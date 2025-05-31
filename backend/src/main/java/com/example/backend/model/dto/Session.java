package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Session {
    private long id;
    private int maxClients;
    private int occupiedSlots = 0;
    private LocalDate date;
    private String startTime;
    private String endTime;
    private boolean checkDate() {
        return occupiedSlots < maxClients;
    }
}
