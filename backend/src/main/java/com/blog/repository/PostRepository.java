package com.blog.repository;

import com.blog.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, String> {

    Page<Post> findByPublishedTrue(Pageable pageable);

    Page<Post> findByPublishedTrueAndCategory_Name(String categoryName, Pageable pageable);

    Page<Post> findByPublishedTrueAndTitleContainingOrContentContaining(String title, String content, Pageable pageable);

    List<Post> findByAuthorIdAndPublishedTrueOrderByCreatedAtDesc(String authorId);

    long countByPublishedTrue();
}
