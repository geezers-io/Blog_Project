package com.blog.dto;

import com.blog.entity.Category;
import com.blog.entity.Post;
import com.blog.entity.User;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.LocalDateTime;
import java.util.List;

public class PostResponse {

    private String id;
    private String title;
    private String content;
    private String image;
    private String tags;
    private boolean published;
    private LocalDateTime createdAt;
    private String categoryId;
    private CategoryResponse category;
    private AuthorResponse author;
    private List<CommentResponse> comments;

    @JsonProperty("_count")
    private CountResponse count;

    public PostResponse() {
    }

    public static PostResponse from(Post post, long likeCount, long commentCount) {
        PostResponse r = new PostResponse();
        r.id = post.getId();
        r.title = post.getTitle();
        r.content = post.getContent();
        r.image = post.getImage();
        r.tags = post.getTags();
        r.published = post.isPublished();
        r.createdAt = post.getCreatedAt();

        Category cat = post.getCategory();
        if (cat != null) {
            r.categoryId = cat.getId();
            r.category = new CategoryResponse(cat.getId(), cat.getName());
        }

        User author = post.getAuthor();
        if (author != null) {
            r.author = new AuthorResponse(
                    author.getId(),
                    author.getName(),
                    author.getUsername(),
                    author.getImage());
        }

        r.count = CountResponse.ofPost(likeCount, commentCount);
        return r;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public CategoryResponse getCategory() { return category; }
    public void setCategory(CategoryResponse category) { this.category = category; }

    public AuthorResponse getAuthor() { return author; }
    public void setAuthor(AuthorResponse author) { this.author = author; }

    public CountResponse getCount() { return count; }
    public void setCount(CountResponse count) { this.count = count; }

    public List<CommentResponse> getComments() { return comments; }
    public void setComments(List<CommentResponse> comments) { this.comments = comments; }
}
