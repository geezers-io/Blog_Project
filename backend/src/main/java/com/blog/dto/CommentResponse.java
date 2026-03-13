package com.blog.dto;

import com.blog.entity.Comment;
import com.blog.entity.User;

import java.time.LocalDateTime;

public record CommentResponse(
        String id,
        String content,
        LocalDateTime createdAt,
        AuthorResponse author) {

    public static CommentResponse from(Comment comment) {
        User author = comment.getAuthor();
        return new CommentResponse(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                new AuthorResponse(
                        author.getId(),
                        author.getName(),
                        author.getUsername(),
                        author.getImage()));
    }
}
