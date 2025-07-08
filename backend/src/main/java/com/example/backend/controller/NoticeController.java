package com.example.backend.controller;

import com.example.backend.model.dto.request.NewNoticeRequest;
import com.example.backend.model.dto.response.NoticeResponse;
import com.example.backend.model.dto.response.UserProfile;
import com.example.backend.service.NoticeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {
    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping("/active")
    public ResponseEntity<List<NoticeResponse>> getAllActiveNotices(@CookieValue(name = "token", required = false) String token) {
        return noticeService.getAllActiveNotices(token);
    }

    @GetMapping("/important")
    public ResponseEntity<List<NoticeResponse>> getImportantNotices() {
        return noticeService.getAllImportantNotices();
    }

    @PostMapping("/{noticeId}/like")
    public ResponseEntity<Void> likeNotice(@PathVariable Long noticeId, @CookieValue(name = "token", required = false) String token) {
        return noticeService.likeNotice(noticeId, token);
    }

    @PostMapping("/{noticeId}/unlike")
    public ResponseEntity<Void> unlikeNotice(@PathVariable Long noticeId, @CookieValue(name = "token", required = false) String token) {
        return noticeService.unlikeNotice(noticeId, token);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/new")
    public ResponseEntity<Void> createNotice(@RequestBody NewNoticeRequest notice, @CookieValue(name = "token", required = false) String token) {
        return noticeService.createNotice(notice, token);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/delete")
    public ResponseEntity<Void> deleteNotice(@RequestParam Long noticeId) {
        return noticeService.deleteNotice(noticeId);
    }

    @GetMapping("/important/top")
    public ResponseEntity<List<NoticeResponse>> getTopImportantNotices() {
        return noticeService.getTop3ImportantNotices();
    }
}
