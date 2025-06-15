package com.example.backend.model.dto.response;

import com.example.backend.enums.Role;

public class UserForAdmin {
    private long id;
    private String email;
    private String fiscalCode;
    private Role role;
    private String name;
    private String surname;
    private String dateOfBirth;
    private String createdAt;
    private boolean isActive;
    private boolean isVerified;

    private String registrationCode;

    public UserForAdmin() {
    }

    public UserForAdmin(long id, String email, String fiscalCode, Role role, String name, String surname, String dateOfBirth, String createdAt, boolean isActive, boolean isVerified, String registrationCode) {
        this.id = id;
        this.email = email;
        this.fiscalCode = fiscalCode;
        this.role = role;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = dateOfBirth;
        this.createdAt = createdAt;
        this.isActive = isActive;
        this.isVerified = isVerified;
        this.registrationCode = registrationCode;
    }

    public String getRegistrationCode() {
        return registrationCode;
    }

    public void setRegistrationCode(String registrationCode) {
        this.registrationCode = registrationCode;
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

    public String getFiscalCode() {
        return fiscalCode;
    }

    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
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

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public boolean isVerified() {
        return isVerified;
    }

    public void setVerified(boolean verified) {
        isVerified = verified;
    }
}
