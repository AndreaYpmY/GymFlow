package com.example.backend.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name = "invitation_codes")
public class InvitatedCodeEntity {
    @Id
    private Long id= 1L;
    @Column(nullable = false, unique = true)
    private String code;

    // lombok non funziona:

    public InvitatedCodeEntity() {
        // Default constructor
    }
    public InvitatedCodeEntity(String code) {
        this.code = code;
    }
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

}
