package com.example.backend.model.dto.request;

import lombok.Data;

import java.time.DateTimeException;
import java.time.LocalDate;

//@Data
public class RegistrationRequestByUser {
    private String email;
    private String password;
    private String name;
    private String surname;
    private LocalDate dateOfBirth;

    // Non funziona lombok

    public RegistrationRequestByUser() {
    }

    public RegistrationRequestByUser(String email, String password, String name, String surname, LocalDate dateOfBirth) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.surname = surname;
        setDateOfBirth(dateOfBirth);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        if (dateOfBirth == null || dateOfBirth.isAfter(LocalDate.now())) {
            throw new DateTimeException("Invalid date of birth");
        }
        this.dateOfBirth = dateOfBirth;
    }

}
