package com.example.backend.repository;

import com.example.backend.model.entity.InvitatedCodeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface InvitatedCodeRepository extends JpaRepository<InvitatedCodeEntity, Long> {

}