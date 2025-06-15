package com.example.backend.model.dto;

import com.example.backend.enums.Role;
import lombok.Data;

@Data
public class User {
    private long id;
    private String email;
    private String fiscalCode;
    private String password;
    private Role role;
    private String name;
    private String surname;
    private String dateOfBirth;
    private String createdAt;
    private boolean isActive;
    private boolean isVerified;
}
