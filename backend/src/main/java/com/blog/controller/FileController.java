package com.blog.controller;

import com.blog.dto.PostListResponse;
import com.blog.dto.PostResponse;
import com.blog.entity.Post;
import com.blog.service.LikeService;
import com.blog.service.PostService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class FileController {

    private final PostService postService;
    private final LikeService likeService;

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public FileController(PostService postService, LikeService likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }

        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath);

        String url = "/uploads/" + filename;
        return ResponseEntity.ok(Map.of("url", url));
    }

    @GetMapping("/search")
    public ResponseEntity<PostListResponse> searchPosts(@RequestParam String q) {
        Page<Post> postPage = postService.getPosts(null, "recent", q, 0, 20);

        List<PostResponse> postResponses = postPage.getContent().stream()
                .map(post -> PostResponse.from(
                        post,
                        likeService.getLikeCount(post.getId()),
                        post.getComments().size()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(new PostListResponse(
                postResponses,
                postPage.getTotalElements(),
                1,
                postPage.getTotalPages()));
    }
}
