package com.example.backend.model.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;

public class BookingRequest {

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    public BookingRequest() {
    }
    public BookingRequest(LocalDate date, LocalTime startTime, LocalTime endTime) {
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
