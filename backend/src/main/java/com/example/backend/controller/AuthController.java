package com.example.backend.controller;

/*import com.gymflow.dto.LoginRequest;
import com.gymflow.dto.LoginResponse;
import com.gymflow.dto.RegisterRequest;
import com.gymflow.dto.RegisterResponse;
import com.gymflow.service.JwtService;
import com.gymflow.service.UserService;*/
import com.example.backend.model.dto.request.LoginRequest;
import com.example.backend.model.dto.response.VerifyCodeResponse;
import com.example.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
//@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<Void> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        return authService.logout();
    }

    @GetMapping("/verify-code")
    public ResponseEntity<VerifyCodeResponse> verifyCode(@RequestParam String code) {
        return authService.verifyCode(code);
    }


}