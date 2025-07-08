package com.example.backend.model.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
//@Getter @Setter

@Entity
@Table(name = "clients")
public class ClientEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    @OneToMany(mappedBy = "client", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingEntity> bookings; // lista di prenotazioni

    @ManyToMany(mappedBy = "clients")
    private List<WorkoutPlanEntity> workoutPlans; // lista di piani di allenamento

    // Subscription fields
    private LocalDate subscriptionEndDate;

    // Non funziona lombok quindi:

    public ClientEntity() {
        // Default constructor
    }

    public ClientEntity(Long id, UserEntity user, List<BookingEntity> bookings, List<WorkoutPlanEntity> workoutPlans, LocalDate subscriptionEndDate) {
        this.id = id;
        this.user = user;
        this.bookings = bookings;
        this.workoutPlans = workoutPlans;
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public ClientEntity(UserEntity user, LocalDate subscriptionEndDate) {
        this.user = user;
        this.subscriptionEndDate = subscriptionEndDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserEntity getUser() {
        return user;
    }

    public void setUser(UserEntity user) {
        this.user = user;
    }

    public List<BookingEntity> getBookings() {
        return bookings;
    }

    public void setBookings(List<BookingEntity> bookings) {
        this.bookings = bookings;
    }

    public List<WorkoutPlanEntity> getWorkoutPlans() {
        return workoutPlans;
    }

    public void setWorkoutPlans(List<WorkoutPlanEntity> workoutPlans) {
        this.workoutPlans = workoutPlans;
    }

    public LocalDate getSubscriptionEndDate() {
        return subscriptionEndDate;
    }

    public void setSubscriptionEndDate(LocalDate subscriptionEndDate) {
        this.subscriptionEndDate = subscriptionEndDate;
    }
}
