package com.example.backend.model.entity;

import com.example.backend.enums.NoticeTarget;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class NoticeEntity {
    @Id @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime date = LocalDateTime.now();

    @Column(nullable = false)
    private boolean isActive = true;

    @ManyToOne
    private UserEntity author;

    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private NoticeTarget target;





}
