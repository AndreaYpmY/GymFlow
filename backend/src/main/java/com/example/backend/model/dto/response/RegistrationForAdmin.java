package com.example.backend.model.dto.response;

public class RegistrationForAdmin {
    private String registrationCode;

    public RegistrationForAdmin(String registrationCode) {
        this.registrationCode = registrationCode;
    }

    public String getRegistrationCode() {
        return registrationCode;
    }
    public void setRegistrationCode(String registrationCode) {
        this.registrationCode = registrationCode;
    }
}
