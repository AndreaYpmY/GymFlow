package com.example.backend.model.entity;

import com.example.backend.enums.NoticeTarget;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
//@Getter @Setter

@Entity
@Table(name = "notices")
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


    // Non funziona lombok

    public NoticeEntity() {
    }

    public NoticeEntity(String title, String description, UserEntity author, NoticeTarget target) {
        this.title = title;
        this.description = description;
        this.author = author;
        this.target = target;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public UserEntity getAuthor() {
        return author;
    }

    public void setAuthor(UserEntity author) {
        this.author = author;
    }

    public NoticeTarget getTarget() {
        return target;
    }

    public void setTarget(NoticeTarget target) {
        this.target = target;
    }





}
