package com.example.backend.repository;
import com.example.backend.model.entity.TrainerEntity;
import com.example.backend.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TrainerRepository extends JpaRepository<TrainerEntity, Long> {

    @Query("SELECT t FROM TrainerEntity t WHERE t.user.email = :email")
    Optional<TrainerEntity> findByEmail(@Param("email") String email);


    @Query("SELECT t FROM TrainerEntity t WHERE t.user.isActive = true")
    List<TrainerEntity> findAllActiveTrainers();

}
