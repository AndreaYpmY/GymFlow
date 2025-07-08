package com.example.backend.model.dto.response;

import java.util.List;

public class ScheduleResponse {
    private List<BookingsResponse> bookings;
    private List<TimeSlotDisabledResponse> disabledTimeSlots;

    public ScheduleResponse(List<BookingsResponse> bookings, List<TimeSlotDisabledResponse> disabledTimeSlots) {
        this.bookings = bookings;
        this.disabledTimeSlots = disabledTimeSlots;
    }

    public List<BookingsResponse> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingsResponse> bookings) {
        this.bookings = bookings;
    }

    public List<TimeSlotDisabledResponse> getDisabledTimeSlots() {
        return disabledTimeSlots;
    }

    public void setDisabledTimeSlots(List<TimeSlotDisabledResponse> disabledTimeSlots) {
        this.disabledTimeSlots = disabledTimeSlots;
    }

}
