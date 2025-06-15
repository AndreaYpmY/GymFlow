package com.example.backend.model.dto.response;

public class UserProfile {
    private String email;
    private String password;
    private String name;
    private String surname;
    private String birthDate;
    private String fiscalCode;
    private String role;

    public UserProfile() {
    }

    public UserProfile(String email, String name, String password, String surname,String dateOfBirth, String fiscalCode, String role) {

        this.email = email;
        this.name = name;
        this.password = password;
        this.surname = surname;
        this.birthDate = dateOfBirth;
        this.fiscalCode = fiscalCode;
        this.role = role;
    }
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
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

    public String getDateOfBirth() {
        return birthDate;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.birthDate = dateOfBirth;
    }

    public String getFiscalCode() {
        return fiscalCode;
    }

    public void setFiscalCode(String fiscalCode) {
        this.fiscalCode = fiscalCode;
    }


    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }


}
