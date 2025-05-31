package com.example.backend.repository;

import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.UserEntity;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClientRepository extends JpaRepository<ClientEntity, Long> {
    Optional<ClientEntity> findByEmail(String email);
    Optional<ClientEntity> findByFiscalCode(String fiscalCode);
    boolean existsByEmail(String email);
}
