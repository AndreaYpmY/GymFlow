package com.example.backend.service;

import com.example.backend.model.dto.request.NewNoticeRequest;
import com.example.backend.model.dto.response.NoticeResponse;
import com.example.backend.model.entity.LikeEntity;
import com.example.backend.model.entity.NoticeEntity;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.LikeRepository;
import com.example.backend.repository.NoticeRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import jakarta.persistence.Cacheable;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NoticeService {
    private final NoticeRepository noticeRepository;

    private final LikeRepository likeRepository;
    private final JwtService jwtService;

    private final UserRepository userRepository;

    public NoticeService(NoticeRepository noticeRepository, LikeRepository likeRepository, JwtService jwtService, UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.likeRepository = likeRepository;

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    private UserEntity getUserEntityFromToken(String token) {
        String email = jwtService.extractUsername(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional
    public ResponseEntity<Void> deleteNotice(Long noticeId) {
        NoticeEntity notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Notice not found"));
        notice.setActive(false);
        noticeRepository.save(notice);
        return ResponseEntity.noContent().build();
    }

    public ResponseEntity<List<NoticeResponse>> getAllActiveNotices(String token) {
        UserEntity currentUser = getUserEntityFromToken(token);
        List<NoticeEntity> notices = noticeRepository.findAllActiveNotices();
        List<NoticeResponse> response = notices.stream()
                .map(notice -> {
                    boolean liked = likeRepository.existsByUserIdAndNoticeId(currentUser.getId(), notice.getId());
                    return new NoticeResponse(
                            notice.getId(),
                            notice.getTitle(),
                            notice.getDescription(),
                            notice.getDate(),
                            notice.isImportant(),
                            notice.getLikes(),
                            liked
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }


    public ResponseEntity<List<NoticeResponse>> getAllImportantNotices() {
        List<NoticeEntity> notices = noticeRepository.findAllImportantNotices();
        List<NoticeResponse> response = notices.stream()
                .map(notice -> new NoticeResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getDescription(),
                        notice.getDate(),
                        notice.isImportant(),
                        notice.getLikes()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @Transactional
    public ResponseEntity<Void> likeNotice(Long noticeId, String token) {
        try {
            UserEntity user = getUserEntityFromToken(token);
            NoticeEntity notice = noticeRepository.findById(noticeId)
                    .orElseThrow(() -> new IllegalArgumentException("Notice not found"));

            // Verifica se il like esiste già
            if (likeRepository.existsByUserIdAndNoticeId(user.getId(), noticeId)) {
                throw new IllegalArgumentException("You have already liked this notice");
            }

            // Crea e salva il like
            LikeEntity like = new LikeEntity(user, notice);
            likeRepository.save(like);

            // Aggiorna il contatore dei like
            notice.setLikes(notice.getLikes() + 1);
            noticeRepository.save(notice);

            return ResponseEntity.noContent().build();
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("You have already liked this notice");
        }
    }

    @Transactional
    public ResponseEntity<Void> unlikeNotice(Long noticeId, String token) {
        UserEntity user = getUserEntityFromToken(token);
        NoticeEntity notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new IllegalArgumentException("Notice not found"));

        LikeEntity like = likeRepository.findByUserIdAndNoticeId(user.getId(), noticeId)
                .orElseThrow(() -> new IllegalArgumentException("You have not liked this notice"));

        notice.setLikes(notice.getLikes() - 1);
        noticeRepository.save(notice);

        likeRepository.delete(like);

        return ResponseEntity.ok().build();

    }


    @Transactional
    public ResponseEntity<Void> createNotice(NewNoticeRequest newNoticeRequest, String token) {
        try {
            if (newNoticeRequest.getTitle() == null || newNoticeRequest.getTitle().isEmpty()) {
                throw new IllegalArgumentException("Title cannot be empty");
            }
            UserEntity author = getUserEntityFromToken(token);
            NoticeEntity notice = new NoticeEntity(
                    newNoticeRequest.getTitle(),
                    newNoticeRequest.getDescription(),
                    author,
                    newNoticeRequest.getImportant()
            );
            noticeRepository.save(notice);
            return ResponseEntity.ok().build();
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("Failed to create notice due to database constraints");
        }
    }


    //@Cacheable("Top3ImportantNotices")
    public ResponseEntity<List<NoticeResponse>> getTop3ImportantNotices() {
        List<NoticeEntity> notices = noticeRepository.findTop3ImportantNotices();
        List<NoticeResponse> response = notices.stream()
                .map(notice -> new NoticeResponse(
                        notice.getId(),
                        notice.getTitle(),
                        notice.getDescription(),
                        notice.getDate(),
                        notice.isImportant(),
                        notice.getLikes()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }



}
