package com.example.backend.model.dto.request;

import com.example.backend.enums.Role;

import java.time.LocalDate;
import java.util.Map;

public class CreateUserRequest {
    private String email;
    private String fiscalCode;

    private Role role;

    private LocalDate subscriptionEndDate; // Per CLIENT
    private Map<String, Integer> weeklyHours; // Per TRAINER

    public CreateUserRequest() {
    }

    public CreateUserRequest(String email, String fiscalCode, Role role, LocalDate subscriptionEndDate, Map<String, Integer> weeklyHours) {
        this.email = email;
        this.fiscalCode = fiscalCode;
        this.role = role;
        this.subscriptionEndDate = subscriptionEndDate;
        this.weeklyHours = weeklyHours;
    }

    // Getters e setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFiscalCode() { return fiscalCode; }
    public void setFiscalCode(String fiscalCode) { this.fiscalCode = fiscalCode; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public LocalDate getSubscriptionEndDate() { return subscriptionEndDate; }
    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) { this.subscriptionEndDate = subscriptionEndDate; }
    public Map<String, Integer> getWeeklyHours() { return weeklyHours; }
    public void setWeeklyHours(Map<String, Integer> weeklyHours) { this.weeklyHours = weeklyHours; }
}
