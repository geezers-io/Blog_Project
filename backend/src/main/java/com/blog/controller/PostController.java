package com.blog.controller;

import com.blog.dto.*;
import com.blog.entity.Comment;
import com.blog.entity.Post;
import com.blog.service.CommentService;
import com.blog.service.LikeService;
import com.blog.service.PostService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final LikeService likeService;

    public PostController(PostService postService, CommentService commentService, LikeService likeService) {
        this.postService = postService;
        this.commentService = commentService;
        this.likeService = likeService;
    }

    @GetMapping
    public ResponseEntity<PostListResponse> listPosts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "recent") String sort,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int limit) {

        Page<Post> postPage = postService.getPosts(category, sort, search, page - 1, limit);

        List<PostResponse> postResponses = postPage.getContent().stream()
                .map(post -> PostResponse.from(
                        post,
                        likeService.getLikeCount(post.getId()),
                        post.getComments().size()))
                .collect(Collectors.toList());

        PostListResponse response = new PostListResponse(
                postResponses,
                postPage.getTotalElements(),
                page,
                postPage.getTotalPages());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest request) {
        String userId = getAuthenticatedUserId();
        Post post = postService.createPost(
                userId, request.title(), request.content(),
                request.image(), request.categoryId(), request.tags());

        return ResponseEntity.ok(PostResponse.from(post, 0, 0));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPost(@PathVariable String id) {
        Post post = postService.getPost(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        long likeCount = likeService.getLikeCount(id);
        long commentCount = post.getComments().size();

        PostResponse response = PostResponse.from(post, likeCount, commentCount);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable String id,
            @RequestBody PostRequest request) {
        String userId = getAuthenticatedUserId();
        Post post = postService.updatePost(
                id, userId, request.title(), request.content(),
                request.image(), request.categoryId(), request.tags());

        long likeCount = likeService.getLikeCount(id);
        long commentCount = post.getComments().size();

        return ResponseEntity.ok(PostResponse.from(post, likeCount, commentCount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable String id) {
        String userId = getAuthenticatedUserId();
        postService.deletePost(id, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable String id) {
        List<Comment> comments = commentService.getComments(id);
        List<CommentResponse> responses = comments.stream()
                .map(CommentResponse::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable String id,
            @RequestBody CommentRequest request) {
        String userId = getAuthenticatedUserId();
        Comment comment = commentService.createComment(id, userId, request.content());
        return ResponseEntity.ok(CommentResponse.from(comment));
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<LikeResponse> getLikes(@PathVariable String id) {
        long count = likeService.getLikeCount(id);
        boolean liked = false;

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof String userId) {
            liked = likeService.isLiked(id, userId);
        }

        return ResponseEntity.ok(new LikeResponse(liked, count));
    }

    @PostMapping("/{id}/likes")
    public ResponseEntity<LikeResponse> toggleLike(@PathVariable String id) {
        String userId = getAuthenticatedUserId();
        Map<String, Boolean> result = likeService.toggleLike(id, userId);
        long count = likeService.getLikeCount(id);
        return ResponseEntity.ok(new LikeResponse(result.get("liked"), count));
    }

    private String getAuthenticatedUserId() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
