package com.example.backend.repository;

import com.example.backend.enums.Role;
import com.example.backend.model.entity.UserEntity;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;

import java.util.ArrayList;
import java.util.List;

public class UserSpecification {
    public static Specification<UserEntity> filterUsers(String search, String role, Boolean isActive, Boolean isVerified) {
        return (Root<UserEntity> root, CriteriaQuery<?> query, CriteriaBuilder cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Filtro per ricerca (nome, cognome, email)
            if (search != null && !search.isEmpty()) {
                String searchLower = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("name")), searchLower),
                        cb.like(cb.lower(root.get("surname")), searchLower),
                        cb.like(cb.lower(root.get("email")), searchLower),
                        cb.like(cb.lower(root.get("fiscalCode")), searchLower)
                ));
            }

            // Filtro per ruolo
            if (role != null && !role.isEmpty()) {
                try {
                    Role userRole = Role.valueOf(role.toUpperCase());
                    predicates.add(cb.equal(root.get("role"), userRole));
                } catch (IllegalArgumentException e) {
                    // Se il ruolo non è valido, non applico il filtro
                }
            }

            // Filtro per stato attivo
            if (isActive != null) {
                predicates.add(cb.equal(root.get("isActive"), isActive));
            }

            // Filtro per stato verificato
            if (isVerified != null) {
                predicates.add(cb.equal(root.get("isVerified"), isVerified));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
