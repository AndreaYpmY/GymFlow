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

    private Integer monday;
    private Integer tuesday;
    private Integer wednesday;
    private Integer thursday;
    private Integer friday;
    private Integer saturday;

    // Non funziona lombok

    public TrainerEntity() {
    }

    public TrainerEntity(Long id, UserEntity user, Integer monday, Integer tuesday, Integer wednesday, Integer thursday, Integer friday, Integer saturday) {
        this.id = id;
        this.user = user;
        this.monday = monday;
        this.tuesday = tuesday;
        this.wednesday = wednesday;
        this.thursday = thursday;
        this.friday = friday;
        this.saturday = saturday;
    }

    public TrainerEntity(UserEntity user, Map<String,Integer> map) {
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

    public Integer getMonday() {
        return monday;
    }

    public void setMonday(Integer monday) {
        this.monday = monday;
    }

    public Integer getTuesday() {
        return tuesday;
    }

    public void setTuesday(Integer tuesday) {
        this.tuesday = tuesday;
    }

    public Integer getWednesday() {
        return wednesday;
    }

    public void setWednesday(Integer wednesday) {
        this.wednesday = wednesday;
    }

    public Integer getThursday() {
        return thursday;
    }

    public void setThursday(Integer thursday) {
        this.thursday = thursday;
    }

    public Integer getFriday() {
        return friday;
    }

    public void setFriday(Integer friday) {
        this.friday = friday;
    }

    public Integer getSaturday() {
        return saturday;
    }

    public void setSaturday(Integer saturday) {
        this.saturday = saturday;
    }

    public void populateFromMap(Map<String, Integer> weeklyHours) {
        for (Map.Entry<String, Integer> entry : weeklyHours.entrySet()) {
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
