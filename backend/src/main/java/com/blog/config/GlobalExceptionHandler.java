package com.blog.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, String>> handleRuntime(RuntimeException ex) {
        String msg = ex.getMessage();
        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (msg != null) {
            if (msg.contains("not found") || msg.contains("Not found")) {
                status = HttpStatus.NOT_FOUND;
            } else if (msg.contains("권한") || msg.contains("Forbidden") || msg.contains("permission")) {
                status = HttpStatus.FORBIDDEN;
            } else if (msg.contains("이미 사용") || msg.contains("already") || msg.contains("Duplicate")) {
                status = HttpStatus.BAD_REQUEST;
            }
        }

        return ResponseEntity.status(status).body(Map.of("message", msg != null ? msg : "서버 오류"));
    }
}
