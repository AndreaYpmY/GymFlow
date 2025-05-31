package com.example.backend.model.dto;

import com.example.backend.enums.NoticeTarget;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Notice {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime date;
    private boolean isActive;
    private User author;
    private NoticeTarget target;
}
