package com.example.backend.controller;

import com.example.backend.model.dto.request.FinishRegistrationRequest;
import com.example.backend.model.dto.response.UserProfile;
import com.example.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/user")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfile> getProfile(@CookieValue(name = "token", required = false) String token) {
        return userService.getUser(token);
    }

    @PatchMapping("/update")
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile userProfile, @CookieValue(name = "token", required = false) String token) {
        return userService.updateUserProfile(userProfile, token);
    }

    @PostMapping("/finish-register")
    public ResponseEntity<Void> registerByUser(@RequestBody FinishRegistrationRequest request, @CookieValue(name = "token", required = false) String token) {
        return userService.finishRegistration(request,token);
    }



}
