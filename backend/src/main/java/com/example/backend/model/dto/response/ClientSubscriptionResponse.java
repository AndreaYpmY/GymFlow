package com.example.backend.model.dto.response;

import java.time.LocalDate;

public class ClientSubscriptionResponse {
    private long id;
    private String email;
    private String name;
    private String surname;
    private LocalDate endOfSubscription;

    public ClientSubscriptionResponse(long id, String email, String name, String surname, LocalDate endOfSubscription) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.surname = surname;
        this.endOfSubscription = endOfSubscription;
    }

    public ClientSubscriptionResponse() {
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public LocalDate getEndOfSubscription() {
        return endOfSubscription;
    }

    public void setEndOfSubscription(LocalDate endOfSubscription) {
        this.endOfSubscription = endOfSubscription;
    }
}


