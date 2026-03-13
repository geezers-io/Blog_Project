package com.blog.service;

import com.blog.entity.Category;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.blog.repository.CategoryRepository;
import com.blog.repository.PostRepository;
import com.blog.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public PostService(PostRepository postRepository, CategoryRepository categoryRepository,
                       UserRepository userRepository) {
        this.postRepository = postRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    public Page<Post> getPosts(String category, String sort, String search, int page, int size) {
        Sort sorting;
        if ("oldest".equalsIgnoreCase(sort)) {
            sorting = Sort.by(Sort.Direction.ASC, "createdAt");
        } else {
            sorting = Sort.by(Sort.Direction.DESC, "createdAt");
        }

        Pageable pageable = PageRequest.of(page, size, sorting);

        if (search != null && !search.isBlank()) {
            return postRepository.findByPublishedTrueAndTitleContainingOrContentContaining(search, search, pageable);
        }

        if (category != null && !category.isBlank()) {
            return postRepository.findByPublishedTrueAndCategory_Name(category, pageable);
        }

        return postRepository.findAll(pageable);
    }

    public Optional<Post> getPost(String id) {
        return postRepository.findById(id);
    }

    @Transactional
    public Post createPost(String authorId, String title, String content,
                           String image, String categoryId, String tags) {
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = new Post();
        post.setAuthor(author);
        post.setTitle(title);
        post.setContent(content);
        post.setImage(image);
        post.setTags(tags);

        if (categoryId != null && !categoryId.isBlank()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            post.setCategory(category);
        }

        return postRepository.save(post);
    }

    @Transactional
    public Post updatePost(String postId, String userId, String title, String content,
                           String image, String categoryId, String tags) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to update this post");
        }

        if (title != null) post.setTitle(title);
        if (content != null) post.setContent(content);
        if (image != null) post.setImage(image);
        if (tags != null) post.setTags(tags);

        if (categoryId != null && !categoryId.isBlank()) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            post.setCategory(category);
        }

        return postRepository.save(post);
    }

    @Transactional
    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthor().getId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        postRepository.delete(post);
    }

    public List<Post> getPostsByAuthor(String authorId) {
        return postRepository.findByAuthorIdAndPublishedTrueOrderByCreatedAtDesc(authorId);
    }
}
