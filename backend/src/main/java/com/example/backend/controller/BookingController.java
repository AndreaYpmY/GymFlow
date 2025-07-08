package com.example.backend.controller;

import com.example.backend.model.dto.request.BookingRequest;
import com.example.backend.model.dto.request.TimeSlotRequest;
import com.example.backend.model.dto.response.BookingsResponse;
import com.example.backend.model.dto.response.ScheduleResponse;
import com.example.backend.model.dto.response.UserResponse;
import com.example.backend.service.BookingService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserResponse> getCurrentUserBookings(@CookieValue(name = "token", required = false) String token) {
        return bookingService.currentUser(token);
    }

    @GetMapping("/schedule")
    public ResponseEntity<ScheduleResponse> getBookings(@CookieValue(name = "token", required = false) String token,
                                                        @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
                                                        @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        //System.out.println("Fetching bookings from " + startDate + " to " + endDate + " for token: " + token);
        return bookingService.getBookings(token, startDate, endDate);

    }

    @PostMapping("/done")
    public ResponseEntity<Integer> createBooking(@CookieValue(name = "token", required = false) String token,
                                              @RequestBody BookingRequest bookingRequest) {
        return bookingService.createBooking(token, bookingRequest);
    }


    @DeleteMapping("/delete/{bookingId}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long bookingId,
                                          @CookieValue(name = "token", required = false) String token) {
        return bookingService.deleteBooking(token, bookingId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/schedules/{date}/toggle/{bool}")
    public ResponseEntity<Void> toggleTimeSlot(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date, 
                                               @PathVariable boolean bool) {
        if(!bool) {
            return bookingService.enableAllTimeSlotsForDate(date);
        }
        return bookingService.disableAllTimeSlotsForDate(date);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/schedules/{date}/slots/disable")
    public ResponseEntity<Void> disableTimeSlots(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                 @RequestBody TimeSlotRequest timeSlotsRequest) {
        return bookingService.disableTimeSlots(date, timeSlotsRequest);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/schedules/{date}/slots/enable")
    public ResponseEntity<Void> enableTimeSlots(@PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
                                                 @RequestBody TimeSlotRequest timeSlotsRequest) {
        return bookingService.enableTimeSlots(date, timeSlotsRequest);
    }
}
