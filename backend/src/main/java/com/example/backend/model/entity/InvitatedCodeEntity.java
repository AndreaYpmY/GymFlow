package com.example.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Entity
@Getter
@Setter
public class InvitatedCodeEntity {
    @Id
    private Long id= 1L;
    @Column(nullable = false, unique = true)
    private String code;
}
