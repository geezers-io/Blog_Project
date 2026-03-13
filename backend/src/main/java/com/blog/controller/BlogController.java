package com.blog.controller;

import com.blog.dto.*;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.service.LikeService;
import com.blog.service.PostService;
import com.blog.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/blog")
public class BlogController {

    private final UserService userService;
    private final PostService postService;
    private final LikeService likeService;

    public BlogController(UserService userService, PostService postService, LikeService likeService) {
        this.userService = userService;
        this.postService = postService;
        this.likeService = likeService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<BlogResponse> getBlog(@PathVariable String username) {
        User user = userService.getUserByUsernameOrName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userService.incrementVisits(user.getId());

        List<Post> posts = postService.getPostsByAuthor(user.getId());

        List<PostResponse> postResponses = posts.stream()
                .map(post -> PostResponse.from(
                        post,
                        likeService.getLikeCount(post.getId()),
                        post.getComments().size()))
                .collect(Collectors.toList());

        List<String> tags = posts.stream()
                .map(Post::getTags)
                .filter(t -> t != null && !t.isBlank())
                .flatMap(t -> Arrays.stream(t.split(",")))
                .map(String::trim)
                .filter(t -> !t.isEmpty())
                .distinct()
                .collect(Collectors.toList());

        return ResponseEntity.ok(new BlogResponse(
                UserResponse.from(user),
                postResponses,
                tags));
    }

    @GetMapping("/settings")
    public ResponseEntity<UserResponse> getBlogSettings() {
        String userId = getAuthenticatedUserId();
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(UserResponse.from(user));
    }

    @PutMapping("/settings")
    public ResponseEntity<UserResponse> updateBlogSettings(@RequestBody BlogSettingsRequest request) {
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
