package com.blog.dto;

import java.util.List;

public record PostListResponse(
        List<PostResponse> posts,
        long total,
        int page,
        int totalPages) {
}
