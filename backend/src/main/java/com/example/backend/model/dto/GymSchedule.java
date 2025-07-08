package com.example.backend.model.dto;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.EnumMap;
import java.util.Optional;
import java.util.Timer;

public class GymSchedule {
    private static GymSchedule instance;

    private final EnumMap<DayOfWeek, Schedule> weeklySchedule;

    private final Integer maxBookingsPerDay = 20; // Numero massimo di prenotazioni per giorno

    private final Integer hoursSlotDuration = 60; // Durata di ogni slot orario in minuti

    private GymSchedule() {
        weeklySchedule = new EnumMap<>(DayOfWeek.class);
        initializeSchedule();
    }

    public static GymSchedule getInstance() {
        if (instance == null) {
            instance = new GymSchedule();
        }
        return instance;
    }

    private void initializeSchedule() {
        // Lunedì - Venerdì: 06:00 - 22:00
        for (DayOfWeek day : DayOfWeek.values()) {
            switch (day) {
                case MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY ->
                        weeklySchedule.put(day, new Schedule(LocalTime.of(6, 0), LocalTime.of(22, 0)));
                case SATURDAY ->
                        weeklySchedule.put(day, new Schedule(LocalTime.of(8, 0), LocalTime.of(20, 0)));
                case SUNDAY ->
                        weeklySchedule.put(day, null); // Chiuso
            }
        }
    }

    public Optional<LocalTime> getOpeningHour(DayOfWeek day) {
        Schedule schedule = weeklySchedule.get(day);
        return schedule != null ? Optional.of(schedule.openingTime()) : Optional.empty();
    }

    public Optional<LocalTime> getClosingHour(DayOfWeek day) {
        Schedule schedule = weeklySchedule.get(day);
        return schedule != null ? Optional.of(schedule.closingTime()) : Optional.empty();
    }

    public boolean isOpen(DayOfWeek day, LocalTime time) {
        Schedule schedule = weeklySchedule.get(day);
        return schedule != null && !time.isBefore(schedule.openingTime()) && !time.isAfter(schedule.closingTime());
    }

    // Record per rappresentare apertura/chiusura
    private record Schedule(LocalTime openingTime, LocalTime closingTime) {
    }

    public Integer getMaxBookingsPerDay() {
        return maxBookingsPerDay;
    }

    public Integer getHoursSlotDuration() {
        return hoursSlotDuration;
    }

}
