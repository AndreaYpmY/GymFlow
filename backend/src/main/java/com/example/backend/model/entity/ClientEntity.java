package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @OneToMany(mappedBy = "client")
    private List<ReservationEntity> reservations; // lista di prenotazioni

    @ManyToMany(mappedBy = "clients")
    private List<WorkoutPlanEntity> workoutPlans; // lista di piani di allenamento

    // Subscription fields
    private LocalDate subscriptionEndDate;

    // Non funziona lombok quindi:

    public ClientEntity() {
        // Default constructor
    }



    public ClientEntity(UserEntity user,  LocalDate subscriptionEndDate) {
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

    public List<ReservationEntity> getReservations() {
        return reservations;
    }

    public void setReservations(List<ReservationEntity> reservations) {
        this.reservations = reservations;
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
