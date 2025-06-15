package com.example.backend.service;

import com.example.backend.enums.Role;
import com.example.backend.model.dto.request.CreateUserRequest;
import com.example.backend.model.dto.response.RegistrationForAdmin;
import com.example.backend.model.dto.response.UserForAdmin;
import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.TrainerEntity;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.TrainerRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.UserSpecification;
import com.example.backend.security.JwtService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class AdminService {

    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    public AdminService(UserRepository userRepository, JwtService jwtService, ClientRepository clientRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }


    @Transactional
    public ResponseEntity<RegistrationForAdmin> registerUserByAdmin(CreateUserRequest request){

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByFiscalCode(request.getFiscalCode())) {
            throw new IllegalArgumentException("Fiscal code already exists");
        }

        if(!request.getRole().equals(Role.TRAINER)&&!request.getRole().equals(Role.CLIENT)){
            throw new IllegalArgumentException("Error registration");
        }
        String code=generateRegistrationCode();

        UserEntity user = new UserEntity();
        user.setEmail(request.getEmail());
        user.setFiscalCode(request.getFiscalCode());
        user.setRole(request.getRole());

        // Generazione codice di registrazione
        user.setRegistrationCode(code);

        user.setVerified(false);
        user.setActive(true);
        user.setPassword(passwordEncoder.encode(generateTemporaryPassword()));
        user.setCreatedAt(LocalDateTime.now());

        // Salvataggio dell'utente
        UserEntity savedUser = userRepository.save(user);
        // Associazione entità specifica
        switch (savedUser.getRole()) {
            case TRAINER -> {
                TrainerEntity trainer = new TrainerEntity(savedUser,request.getWeeklyHours());
                trainerRepository.save(trainer);
            }
            case CLIENT -> {
                ClientEntity client = new ClientEntity(savedUser, request.getSubscriptionEndDate());
                clientRepository.save(client);
            }
        }
        RegistrationForAdmin codeForRegistration=new RegistrationForAdmin(code);

        return ResponseEntity.ok(
                codeForRegistration);

    }




    public Page<UserForAdmin> getUsersPageable(String search, String role, Boolean isActive, Boolean isVerified, int page, int limit) {
        Pageable pageable = PageRequest.of(page, limit);
        Specification<UserEntity> spec = UserSpecification.filterUsers(search, role, isActive, isVerified);
        return userRepository.findAll(spec, pageable).map(
                user -> new UserForAdmin(
                        user.getId(),
                        user.getEmail(),
                        user.getFiscalCode(),
                        user.getRole(),
                        user.getName(),
                        user.getSurname(),
                        user.getDateOfBirth() != null ? user.getDateOfBirth().toString() : null,
                        user.getCreatedAt() != null ? user.getCreatedAt().toString() : null,
                        user.isActive(),
                        user.isVerified(),
                        user.getRegistrationCode()
                )
        );
    }








    // UTILS
    private String generateRegistrationCode() {
        return UUID.randomUUID().toString().substring(0, 6).toUpperCase();

    }

    private String generateTemporaryPassword() {
        int length = 10;
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        return new Random().ints(length, 0, characters.length())
                .mapToObj(i -> String.valueOf(characters.charAt(i)))
                .collect(Collectors.joining());
    }
}
