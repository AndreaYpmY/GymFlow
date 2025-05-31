package com.example.backend.model.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Reservation {
    private long id;
    private Client client;
    private Session session;
    private LocalDateTime date = LocalDateTime.now();
}
