package com.blog.dto;

import java.util.List;

public record BlogResponse(
        UserResponse user,
        List<PostResponse> posts,
        List<String> tags) {
}
