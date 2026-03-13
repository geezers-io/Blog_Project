package com.blog.dto;

public record PostRequest(String title, String content, String image, String categoryId, String tags) {
}
