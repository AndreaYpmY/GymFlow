package com.example.backend.repository;

import com.example.backend.model.entity.NoticeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NoticeRepository extends JpaRepository<NoticeEntity, Long> {
    @Query("SELECT n FROM NoticeEntity n WHERE n.isActive = true")
    List<NoticeEntity> findAllActiveNotices();

    @Query("SELECT n FROM NoticeEntity n WHERE n.important = true")
    List<NoticeEntity> findAllImportantNotices();

    @Query("SELECT n FROM NoticeEntity n WHERE n.important = true ORDER BY n.date DESC")
    List<NoticeEntity> findTop3ImportantNotices();

}
