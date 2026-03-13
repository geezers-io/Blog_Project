package com.blog.dto;

public record AuthResponse(String token, UserResponse user) {
}
