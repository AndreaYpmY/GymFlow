package com.example.backend.model.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "workout_plans")
public class WorkoutPlanEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id", referencedColumnName = "id")
    private TrainerEntity trainer;

    // Cliente proprietario (per schede private)
    @ManyToOne
    @JoinColumn(name = "owner_client_id")
    private ClientEntity ownerClient;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private boolean isPublic;

    // Relazione ManyToMany con i clienti che usano questa scheda
    @ManyToMany
    @JoinTable(
            name = "client_workout_plan",
            joinColumns = @JoinColumn(name = "workout_plan_id"),
            inverseJoinColumns = @JoinColumn(name = "client_id")
    )
    private List<ClientEntity> clients;


    // Non funziona lombok quindi:

    public WorkoutPlanEntity() {
        // Default constructor
    }

    public WorkoutPlanEntity(TrainerEntity trainer, String title, String description, boolean isPublic) {
        this.trainer = trainer;
        this.title = title;
        this.description = description;
        this.isPublic = isPublic;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TrainerEntity getTrainer() {
        return trainer;
    }

    public void setTrainer(TrainerEntity trainer) {
        this.trainer = trainer;
    }

    public ClientEntity getOwnerClient() {
        return ownerClient;
    }

    public void setOwnerClient(ClientEntity ownerClient) {
        this.ownerClient = ownerClient;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }

    public List<ClientEntity> getClients() {
        return clients;
    }

    public void setClients(List<ClientEntity> clients) {
        this.clients = clients;
    }



}


/*
public class WorkoutPlanEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "trainer_id", referencedColumnName = "id")
    private TrainerEntity trainer;

    // Workout plan fields

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private boolean isPublic;



}*/
