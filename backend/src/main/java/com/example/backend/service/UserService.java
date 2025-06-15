package com.example.backend.service;

import com.example.backend.model.dto.request.FinishRegistrationRequest;
import com.example.backend.model.dto.response.UserProfile;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.ClientRepository;
import com.example.backend.repository.TrainerRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final ClientRepository clientRepository;
    private final TrainerRepository trainerRepository;
    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;


    public UserService(UserRepository userRepository, JwtService jwtService, ClientRepository clientRepository, TrainerRepository trainerRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.clientRepository = clientRepository;
        this.trainerRepository = trainerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public ResponseEntity<UserProfile> updateUserProfile(UserProfile userProfile, String token) {
        String email = jwtService.extractUsername(token);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));


        // Aggiorno i campi dell'utente
        user.setName(userProfile.getName());
        user.setSurname(userProfile.getSurname());
        user.setDateOfBirth(LocalDate.parse(userProfile.getDateOfBirth()));
        user.setPassword(passwordEncoder.encode(userProfile.getPassword()));
        user.setFiscalCode(userProfile.getFiscalCode());

        // Salvo l'utente aggiornato
        UserEntity updatedUser = userRepository.save(user);

        UserProfile updatedUserProfile = new UserProfile(
                updatedUser.getEmail(),
                updatedUser.getName(),
                "", // Non restituisco la password per motivi di sicurezza
                updatedUser.getSurname(),
                updatedUser.getDateOfBirth().toString(),
                updatedUser.getFiscalCode(),
                updatedUser.getRole().name()
        );

        return ResponseEntity.ok(updatedUserProfile);
    }






    @Transactional(readOnly = true)
    public ResponseEntity<UserProfile> getUser(String token){
        String email = jwtService.extractUsername(token);

        UserEntity user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserProfile userProfile = new UserProfile(
                user.getEmail(),
                user.getName(),
                "", // Non restituisco la password per motivi di sicurezza
                user.getSurname(),
                user.getDateOfBirth().toString(),
                user.getFiscalCode(),
                user.getRole().name()
        );

        return ResponseEntity.ok(userProfile);
    }


    //Inserito qui poichè avrà già il token di autenticazione perchè viene dato se conosce quel codice segreto
    @Transactional
    public ResponseEntity<Void> finishRegistration(FinishRegistrationRequest fields, String token){
        try{
            String email = jwtService.extractUsername(token);
            UserEntity user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid registration code"));

            //System.out.println(fields);

            // Aggiorno i campi dell'utente
            user.setName(fields.getName());
            user.setSurname(fields.getSurname());
            user.setDateOfBirth(LocalDate.parse(fields.getDateOfBirth()));
            user.setPassword(passwordEncoder.encode(fields.getPassword()));

            user.setRegistrationCode(null);

            // Salvo l'utente aggiornato
            UserEntity updatedUser = userRepository.save(user);

            return ResponseEntity.noContent().build();

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }



}
