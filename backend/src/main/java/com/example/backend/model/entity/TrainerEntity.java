package com.example.backend.model.entity;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.net.Inet4Address;
import java.util.Map;

@Entity
@Table(name = "trainers")
public class TrainerEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    private Float monday;
    private Float tuesday;
    private Float wednesday;
    private Float thursday;
    private Float friday;
    private Float saturday;

    // Non funziona lombok

    public TrainerEntity() {
    }

    public TrainerEntity(Long id, UserEntity user, Float monday, Float tuesday, Float wednesday, Float thursday, Float friday, Float saturday) {
        this.id = id;
        this.user = user;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
    }

    public TrainerEntity(UserEntity user, Map<String,Float> map) {
        this.user = user;
        populateFromMap(map);
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

    public Float getMonday() {
        return monday;
    }

    public void setMonday(Float monday) {
        this.monday = monday;
    }

    public Float getTuesday() {
        return tuesday;
    }

    public void setTuesday(Float tuesday) {
        this.tuesday = tuesday;
    }

    public Float getWednesday() {
        return wednesday;
    }

    public void setWednesday(Float wednesday) {
        this.wednesday = wednesday;
    }

    public Float getThursday() {
        return thursday;
    }

    public void setThursday(Float thursday) {
        this.thursday = thursday;
    }

    public Float getFriday() {
        return friday;
    }

    public void setFriday(Float friday) {
        this.friday = friday;
    }

    public Float getSaturday() {
        return saturday;
    }

    public void setSaturday(Float saturday) {
        this.saturday = saturday;
    }

    public void populateFromMap(Map<String, Float> weeklyHours) {
        for (Map.Entry<String, Float> entry : weeklyHours.entrySet()) {
            switch (entry.getKey().toLowerCase()) {
                case "monday" -> monday = entry.getValue();
                case "tuesday" -> tuesday = entry.getValue();
                case "wednesday" -> wednesday = entry.getValue();
                case "thursday" -> thursday = entry.getValue();
                case "friday" -> friday = entry.getValue();
                case "saturday" -> saturday = entry.getValue();
            }
        }
    }
}
