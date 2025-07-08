package com.example.backend.model.dto.request;

import java.time.LocalDate;

public class SetNewSubscription {
    private String email;
    private LocalDate endDate;

    public SetNewSubscription() {
    }

    public SetNewSubscription(String email, LocalDate endDate) {
        this.email = email;
        this.endDate = endDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
