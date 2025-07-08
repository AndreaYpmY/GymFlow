package com.example.backend.model.dto.request;

import java.time.LocalDate;

public class NewNoticeRequest {
    private String title;
    private String description;
    private LocalDate createdAt;
    private boolean isImportant;
    public NewNoticeRequest(String title, String description, boolean isImportant, Integer likes) {
        this.title = title;
        this.description = description;
        this.createdAt = LocalDate.now();
        this.isImportant = isImportant;
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

    public boolean getImportant() {
        return isImportant;
    }

    public void setImportant(boolean important) {
        isImportant = important;
    }


}
