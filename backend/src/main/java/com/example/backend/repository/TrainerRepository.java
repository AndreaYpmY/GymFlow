package com.example.backend.repository;
import com.example.backend.model.entity.TrainerEntity;
import com.example.backend.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<TrainerEntity, Long>{
    @Query("SELECT u FROM UserEntity u JOIN TrainerEntity t ON u.id = t.user.id WHERE u.email = :email")
    Optional<TrainerEntity> findByEmail(@Param("email") String email);
}
