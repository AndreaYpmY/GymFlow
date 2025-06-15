package com.example.backend.model.dto.response;

import com.example.backend.enums.Role;

public class VerifyCodeResponse {
    private String email;
    private Role role;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public VerifyCodeResponse(){}

    public VerifyCodeResponse(String email, Role role) {
        this.email = email;
        this.role = role;
    }
}
