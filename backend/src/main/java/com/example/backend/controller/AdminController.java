package com.example.backend.controller;

import com.example.backend.model.dto.request.CreateUserRequest;
import com.example.backend.model.dto.response.RegistrationForAdmin;
import com.example.backend.model.dto.response.UserForAdmin;
import com.example.backend.model.entity.UserEntity;
import com.example.backend.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    private final AdminService adminService;

    public AdminController(AdminService adminService){this.adminService=adminService;}

    @PostMapping("/register")
    public ResponseEntity<RegistrationForAdmin> registerByAdmin(@RequestBody CreateUserRequest request) {
        return adminService.registerUserByAdmin(request);
    }

    @GetMapping("/users")
    public ResponseEntity<Page<UserForAdmin>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isVerified)
    {
        Page<UserForAdmin> users= adminService.getUsersPageable(search, role, isActive, isVerified, page, limit);
        //System.out.println("number of users: " + users.getTotalElements());
        return ResponseEntity.ok(users);
    }






    private UserForAdmin toUserForAdmin(UserEntity user) {
        return new UserForAdmin(
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
                user.getRegistrationCode() != null ? user.getRegistrationCode() : "N/A"
        );
    }
}
