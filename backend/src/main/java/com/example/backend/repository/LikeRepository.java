package com.example.backend.repository;

import com.example.backend.model.entity.LikeEntity;
import com.example.backend.model.entity.NoticeEntity;
import com.example.backend.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<LikeEntity, Long> {
    @Query("SELECT COUNT(l) > 0 FROM LikeEntity l WHERE l.user.id = :userId AND l.notice.id = :noticeId")
    boolean existsByUserIdAndNoticeId(@Param("userId") Long userId, @Param("noticeId") Long noticeId);
    long countByNotice(NoticeEntity notice);
    @Query("SELECT l FROM LikeEntity l WHERE l.user.id = :userId AND l.notice.id = :noticeId")
    Optional<LikeEntity> findByUserIdAndNoticeId(@Param("userId") Long userId, @Param("noticeId") Long noticeId);

    boolean existsByUserAndNotice(UserEntity user, NoticeEntity notice);
    //Optional<LikeEntity> findByUserAndNotice(UserEntity user, NoticeEntity notice);
}