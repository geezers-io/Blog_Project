package com.blog.controller;

import com.blog.dto.CategoryWithCountResponse;
import com.blog.dto.CountResponse;
import com.blog.entity.Category;
import com.blog.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<CategoryWithCountResponse>> listCategories() {
        List<Category> categories = categoryService.getAllCategories();

        List<CategoryWithCountResponse> responses = categories.stream()
                .map(cat -> new CategoryWithCountResponse(
                        cat.getId(),
                        cat.getName(),
                        CountResponse.ofCategory(cat.getPosts().size())))
                .collect(Collectors.toList());

        return ResponseEntity.ok(responses);
    }
}
