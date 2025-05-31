package com.example.backend.service;

import com.example.backend.enums.Role;
import com.example.backend.model.dto.Client;
import com.example.backend.model.entity.ClientEntity;
import com.example.backend.model.entity.TrainerEntity;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.TrainerRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, ClientRepository clientRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
    }
    @Transactional
    public UserEntity registerUser(UserEntity user) {

        if (userRepository.existsByFiscalCode(user.getFiscalCode())) {
            throw new IllegalArgumentException("Fiscal code already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }



        // Cripta la password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(true);
        user.setVerified(false);



        // Salva l'utente
        UserEntity savedUser = userRepository.save(user);

        // Crea entità associata in base al ruolo
        switch (user.getRole()) {
            case CLIENT:
                ClientEntity client = new ClientEntity();
                client.setUser(savedUser);
                clientRepository.save(client);
                break;
            case TRAINER:
                TrainerEntity trainer = new TrainerEntity();
                trainer.setUser(savedUser);
                trainerRepository.save(trainer);
                break;
            default:
                throw new IllegalArgumentException("Invalid role");
        }
        return savedUser;
    }
    @Transactional(readOnly = true)
    public UserEntity loginUser(String email, String password) {
        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }
        return user;
    }

    @Transactional
    public UserEntity updateUser(Long userId, String newFiscalCode, String name, String surname, LocalDate dateOfBirth, String newPassword) {

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));

        // Verifico il nuovo fiscalCode
        if (newFiscalCode != null && !newFiscalCode.equals(user.getFiscalCode())) {

            if (userRepository.existsByFiscalCode(newFiscalCode)) {
                throw new IllegalArgumentException("Fiscal code already exists: " + newFiscalCode);
            }
            // Validazione formato fiscalCode
            //if (!newFiscalCode.matches("^[A-Z]{6}\\d{2}[A-Z]\\d{2}[A-Z]\\d{3}[A-Z]$")) {
            //    throw new IllegalArgumentException("Invalid fiscal code format");
            //}
            user.setFiscalCode(newFiscalCode);
        }

        // Aggiorna gli altri campi se forniti
        if (name != null) {
            user.setName(name);
        }
        if (surname != null) {
            user.setSurname(surname);
        }
        if (dateOfBirth != null) {
            user.setDateOfBirth(dateOfBirth);
        }

        // Aggiorna la password
        if (newPassword != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
        }


        // Salva l'utente aggiornato
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public UserEntity getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    @Transactional(readOnly = true)
    public ClientEntity getClientByEmail(String email) {
        return clientRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));
    }

    @Transactional(readOnly = true)
    public TrainerEntity getTrainerByEmail(String email) {
        return trainerRepository.findByUserEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Trainer not found"));
    }

    @Transactional(readOnly = true)
    public UserEntity getUserByFiscalCode(String fiscalCode) {
        return userRepository.findByFiscalCode(fiscalCode)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }
}
