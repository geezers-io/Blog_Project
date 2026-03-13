package com.blog.dto;

public record BlogSettingsRequest(
        String username,
        String name,
        String bio,
        String blogTitle,
        String themeColor,
        String bgmUrl) {
}
