package com.example.backend.repository;

import com.example.backend.model.entity.ClientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    @Query("SELECT u FROM UserEntity u JOIN ClientEntity c ON u.id = c.user.id WHERE u.email = :email")
    Optional<ClientEntity> findByEmail(@Param("email")String email);
}
