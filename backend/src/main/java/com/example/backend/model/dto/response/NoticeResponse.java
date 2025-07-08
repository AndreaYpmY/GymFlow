package com.example.backend.model.dto.response;

import java.time.LocalDate;

public class NoticeResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate createdAt;
    private boolean important;
    private Integer likes;

    private Boolean likedByCurrentUser;

    public NoticeResponse(Long id, String title, String description, LocalDate createdAt, boolean important, Integer likes) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.important = important;
        this.likes = likes;
    }

    public NoticeResponse(Long id, String title, String description, LocalDate createdAt, boolean important, Integer likes, Boolean likedByCurrentUser) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.important = important;
        this.likes = likes;
        this.likedByCurrentUser = likedByCurrentUser;
    }

    public NoticeResponse() {
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

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isImportant() {
        return important;
    }

    public void setImportant(boolean important) {
        this.important = important;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Boolean getLikedByCurrentUser() {
        return likedByCurrentUser;
    }

    public void setLikedByCurrentUser(Boolean likedByCurrentUser) {
        this.likedByCurrentUser = likedByCurrentUser;
    }
}
