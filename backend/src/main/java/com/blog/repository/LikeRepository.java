package com.blog.repository;

import com.blog.entity.Like;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LikeRepository extends JpaRepository<Like, String> {

    Optional<Like> findByPostIdAndUserId(String postId, String userId);

    long countByPostId(String postId);

    boolean existsByPostIdAndUserId(String postId, String userId);
}
