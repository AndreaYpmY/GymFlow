package com.example.backend.model.dto.request;

import com.example.backend.enums.Role;
import lombok.Data;

//@Data
public class RegistrationRequestByAdmin {
    private String email;
    private String fiscalCode;
    private Role role;

    // Non funziona lombok

    public RegistrationRequestByAdmin() {
    }

    public RegistrationRequestByAdmin(String email, String fiscalCode, Role role) {
        this.email = email;
        this.fiscalCode = fiscalCode;
        this.role = role;
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

}
