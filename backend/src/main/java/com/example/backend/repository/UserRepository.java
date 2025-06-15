package com.example.backend.repository;

import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, JpaSpecificationExecutor<UserEntity> {

    // Per tutti gli utenti
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByFiscalCode(String fiscalCode);

    Optional<UserEntity> findByRegistrationCode(String registrationCode);

    boolean existsByEmail(String email);
    boolean existsByFiscalCode(String fiscalCode);




}
