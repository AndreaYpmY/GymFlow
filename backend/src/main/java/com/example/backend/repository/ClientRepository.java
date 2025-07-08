package com.example.backend.repository;

import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.TrainerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    @Query("SELECT c FROM ClientEntity c WHERE c.user.email = :email")
    Optional<ClientEntity> findByEmail(@Param("email") String email);

    @Query("SELECT c FROM ClientEntity c WHERE c.user.isActive = true")
    List<ClientEntity> findAllActiveClients();
}
