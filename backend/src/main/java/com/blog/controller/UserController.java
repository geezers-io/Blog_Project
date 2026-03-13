package com.blog.controller;

import com.blog.dto.BlogSettingsRequest;
import com.blog.dto.UserResponse;
import com.blog.entity.User;
import com.blog.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser() {
        String userId = getAuthenticatedUserId();
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateCurrentUser(@RequestBody BlogSettingsRequest request) {
        String userId = getAuthenticatedUserId();
        User user = userService.updateUser(
                userId,
                request.username(),
                request.name(),
                request.bio(),
                request.blogTitle(),
                request.themeColor(),
                request.bgmUrl());
        return ResponseEntity.ok(UserResponse.from(user));
    }

    private String getAuthenticatedUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
