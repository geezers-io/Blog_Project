package com.blog.dto;

import com.blog.entity.User;

import java.time.LocalDateTime;

public record UserResponse(
        String id,
        String name,
        String email,
        String image,
        String username,
        String bio,
        String blogTitle,
        String themeColor,
        String bgmUrl,
        int todayVisits,
        int totalVisits,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getImage(),
                user.getUsername(),
                user.getBio(),
                user.getBlogTitle(),
                user.getThemeColor(),
                user.getBgmUrl(),
                user.getTodayVisits(),
                user.getTotalVisits(),
                user.getCreatedAt(),
                user.getUpdatedAt());
    }
}
