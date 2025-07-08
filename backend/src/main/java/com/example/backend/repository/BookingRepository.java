package com.example.backend.repository;

import com.example.backend.model.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    List<BookingEntity> findAllByTimeSlotDateBetween(LocalDate startDate, LocalDate endDate);
    List<BookingEntity> findAllByClientIdAndTimeSlotDateBetween(Long userId, LocalDate startDate, LocalDate endDate);

}
