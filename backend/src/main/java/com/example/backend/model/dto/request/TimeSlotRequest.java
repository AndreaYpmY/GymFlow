package com.example.backend.model.dto.request;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class TimeSlotRequest {
    private List<String> timeSlots;

    // Getter e Setter
    public List<String> getTimeSlots() { return timeSlots; }
    public void setTimeSlots(List<String> timeSlots) { this.timeSlots = timeSlots; }

    //Ogni elemento formato:
    // 19:00-20:00 , etc.

    public TimeSlotRequest() {
    }

    public LocalTime getStartTimeIndex(int index) {
        String timeSlot = timeSlots.get(index);
        String[] parts = timeSlot.split("-");
        return LocalTime.parse(parts[0]);
    }

    public LocalTime getEndTimeIndex(int index) {
        String timeSlot = timeSlots.get(index);
        String[] parts = timeSlot.split("-");
        return LocalTime.parse(parts[1]);
    }

    public LocalDate getStartDate(String timeslot){
        String[] parts = timeslot.split("-");
        return LocalDate.parse(parts[0]);
    }

    public LocalDate getEndDate(String timeslot){
        String[] parts = timeslot.split("-");
        return LocalDate.parse(parts[1]);
    }
}
