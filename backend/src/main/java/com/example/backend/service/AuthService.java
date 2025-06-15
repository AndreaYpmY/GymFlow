package com.example.backend.service;

import com.example.backend.model.dto.LoginRequest;
import com.example.backend.model.dto.UserDetailsImpl;
import com.example.backend.model.dto.response.*;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.JwtService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;


@Service
//@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }




    private Map<String,Object> additionalClaim(Map<String, Object> claims, String key, Object value) {
        if(claims == null) {
            claims = Map.of();
        }
        claims.put(key, value);
        return claims;
    }

    @Transactional(readOnly = true)
    public ResponseEntity<Void> login(LoginRequest request) {
        try {
            System.out.println("Password: " + request.getPassword() + ", password encoded: " + passwordEncoder.encode(request.getPassword()));
            UserEntity user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetailsImpl userDetails = new UserDetailsImpl(user);

            String token = jwtService.generateToken(userDetails);

            ResponseCookie authCookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Strict")
                    .maxAge(86400)// 1 giorno
                    .path("/")
                    .build();
            ResponseCookie roleCookie = ResponseCookie.from("role", user.getRole().name())
                    .httpOnly(false)
                    .secure(false)
                    .sameSite("Strict")
                    .maxAge(86400)
                    .path("/")
                    .build();

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, authCookie.toString());
            headers.add(HttpHeaders.SET_COOKIE, roleCookie.toString());

            return ResponseEntity.ok()
                    .headers(headers)
                    .build();
        } catch (AuthenticationException e) {
            System.out.println("Errore di autenticazione: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (ClassCastException e) {
            System.out.println("Class cast error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    public ResponseEntity<Void> logout() {
        // Creo cookie con data di scadenza nel passato per invalidarli
        ResponseCookie authCookie = ResponseCookie.from("token", "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Strict")
                .maxAge(0) // Invalida il cookie
                .path("/")
                .build();

        ResponseCookie roleCookie = ResponseCookie.from("role", "")
                .httpOnly(false)
                .secure(false)
                .sameSite("Strict")
                .maxAge(0) // Invalida il cookie
                .path("/")
                .build();

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.SET_COOKIE, authCookie.toString());
        headers.add(HttpHeaders.SET_COOKIE, roleCookie.toString());

        return ResponseEntity.noContent()
                .headers(headers)
                .build();
    }


    public ResponseEntity<VerifyCodeResponse> verifyCode(String code){
        try{
            UserEntity user = userRepository.findByRegistrationCode(code)
                    .orElseThrow(() -> new IllegalArgumentException("Invalid registration code"));

            user.setVerified(true);
            userRepository.save(user);

            // Gli do cookie di autenticazione
            String token = jwtService.generateToken(new UserDetailsImpl(user));
            ResponseCookie authCookie = ResponseCookie.from("token", token)
                    .httpOnly(true)
                    .secure(false)
                    .sameSite("Strict")
                    .maxAge(86400) // 1 giorno
                    .path("/")
                    .build();
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.SET_COOKIE, authCookie.toString());

            VerifyCodeResponse verifyCodeResponse = new VerifyCodeResponse(user.getEmail(), user.getRole());
            return ResponseEntity.ok().headers(headers).body(verifyCodeResponse);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }


    }






}
