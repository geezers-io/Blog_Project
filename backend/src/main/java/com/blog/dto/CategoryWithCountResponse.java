package com.blog.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record CategoryWithCountResponse(
        String id,
        String name,
        @JsonProperty("_count") CountResponse count) {
}
