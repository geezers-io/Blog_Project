package com.blog.controller;

import com.blog.dto.AuthResponse;
import com.blog.dto.AuthSyncRequest;
import com.blog.dto.UserResponse;
import com.blog.entity.User;
import com.blog.security.JwtTokenProvider;
import com.blog.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthController(UserService userService, JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/sync")
    public ResponseEntity<AuthResponse> sync(@RequestBody AuthSyncRequest request) {
        User user = userService.syncUser(request.email(), request.name(), request.image());
        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, UserResponse.from(user)));
    }
}
