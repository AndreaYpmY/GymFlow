package com.example.backend.controller;

import com.example.backend.model.entity.UserEntity;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.model.dto.User;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Registrazione dell'utente
    //@PostMapping("/register")
    //public ResponseEntity<User> registerUser(@RequestBody User user) {
    //    return ResponseEntity.ok();
    //}

}
