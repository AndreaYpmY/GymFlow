package com.example.backend.repository;

import com.example.backend.model.entity.TimeSlotEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface TimeSlotRepository extends JpaRepository<TimeSlotEntity, Long> {
    Optional<TimeSlotEntity> findByDateAndStartTimeAndEndTime(LocalDate date, LocalTime startTime, LocalTime endTime);

    List<TimeSlotEntity> findAllByDate(LocalDate date);

    // Trovo tutti i vari timeslot che sono disabilitati in un certo intervallo di date
    @Query("SELECT t FROM TimeSlotEntity t WHERE t.date BETWEEN :startDate AND :endDate AND t.disabled = true")
    List<TimeSlotEntity> findDisabledTimeSlotsBetweenDates(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Se tutti i timeslot di una certa data sono disabilitati, ritorno true, altrimenti false
    // COUNT(t): numero totale di timeslot per quella data
    // SUM: conta quanti timeslot sono disabilitati
    @Query("SELECT CASE WHEN COUNT(t) = SUM(CASE WHEN t.disabled = true THEN 1 ELSE 0 END) " +
            "THEN true ELSE false END " +
            "FROM TimeSlotEntity t WHERE t.date = :date")
    boolean isDateFullyDisabled(@Param("date") LocalDate date);

}
