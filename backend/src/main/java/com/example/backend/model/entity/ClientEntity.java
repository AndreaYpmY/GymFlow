package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Entity
@Getter
@Setter
public class ClientEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    @OneToMany(mappedBy = "client")
    private List<ReservationEntity> reservations; // lista di prenotazioni

    @OneToMany(mappedBy = "client")
    private List<WorkoutPlanEntity> workoutPlans; // lista di piani di allenamento

    // Subscription fields
    private LocalDate subscriptionStartDate;

    private LocalDate subscriptionEndDate;
}
