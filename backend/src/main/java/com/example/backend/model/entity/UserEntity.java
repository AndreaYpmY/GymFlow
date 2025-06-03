package com.example.backend.model.entity;

import com.example.backend.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(unique = true,nullable = false)
    private String email;

    @Column(unique = true,nullable = false, length = 16, columnDefinition = "CHAR(16)")
    private String fiscalCode;

    @Column( nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean isActive = true;

    @Column(nullable = false)
    private boolean isVerified = false;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    private String name;

    private String surname;

    private LocalDate dateOfBirth;

    // Codice per la verifica
    private String verificationCode;




}
