package com.example.backend.repository;
import com.example.backend.model.entity.TrainerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerRepository extends JpaRepository<TrainerEntity, Long>{
    Optional<TrainerEntity> findByUserFiscalCode(String fiscalCode);
    Optional<TrainerEntity> findByUserEmail(String email);
    boolean existsByEmail(String email);
}
