package com.example.backend.model.dto.response;
import java.util.Map;
public class TrainerScheduleResponse {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private Map<String, Float> schedules; // esempio: "lunedi" -> 8




    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public String getTrainerName() {
        return name;
    }

    public void setTrainerName(String trainerName) {
        this.name = trainerName;
    }

    public String getTrainerSurname() {
        return surname;
    }

    public void setTrainerSurname(String trainerSurname) {
        this.surname = trainerSurname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Map<String, Float> getSchedules() {
        return schedules;
    }

    public void setSchedules(Map<String, Float> schedules) {
        this.schedules = schedules;
    }

    public TrainerScheduleResponse() {}

    public TrainerScheduleResponse(Long id, String name, String surname, String email,
                                   Float monday, Float tuesday, Float wednesday,
                                   Float thursday, Float friday, Float saturday) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.schedules = Map.of(
            "monday", monday,
            "tuesday", tuesday,
            "wednesday", wednesday,
            "thursday", thursday,
            "friday", friday,
            "saturday", saturday
        );
    }
}
