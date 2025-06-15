package com.example.backend.model.dto.request;

public class FinishRegistrationRequest {
    private String password;
    private String name;
    private String surname;
    private String dateOfBirth;

    public FinishRegistrationRequest(){}

    public FinishRegistrationRequest(String password, String name, String surname, String birthDate) {
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.dateOfBirth = birthDate;
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

    public String getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(String birthDate) {
        this.dateOfBirth = birthDate;
    }

    @Override
    public String toString() {
        return "FinishRegistrationRequest{" +
                "password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", dateOfBirth='" + dateOfBirth + '\'' +
                '}';
    }
}
