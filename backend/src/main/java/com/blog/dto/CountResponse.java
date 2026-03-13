package com.blog.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CountResponse {

    private Long likes;
    private Long comments;
    private Long posts;

    public CountResponse() {
    }

    /**
     * Constructor for post-related counts (likes and comments).
     */
    public static CountResponse ofPost(long likes, long comments) {
        CountResponse r = new CountResponse();
        r.likes = likes;
        r.comments = comments;
        return r;
    }

    /**
     * Constructor for category-related counts (posts).
     */
    public static CountResponse ofCategory(long posts) {
        CountResponse r = new CountResponse();
        r.posts = posts;
        return r;
    }

    public Long getLikes() { return likes; }
    public void setLikes(Long likes) { this.likes = likes; }

    public Long getComments() { return comments; }
    public void setComments(Long comments) { this.comments = comments; }

    public Long getPosts() { return posts; }
    public void setPosts(Long posts) { this.posts = posts; }
}
