package com.blog.service;

import com.blog.entity.User;
import com.blog.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User syncUser(String email, String name, String image) {
        Optional<User> existingUser = userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            User user = existingUser.get();
            user.setName(name);
            user.setImage(image);
            return userRepository.save(user);
        }

        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setImage(image);
        return userRepository.save(user);
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsernameOrName(String slug) {
        Optional<User> byUsername = userRepository.findByUsername(slug);
        if (byUsername.isPresent()) {
            return byUsername;
        }
        return userRepository.findByName(slug);
    }

    @Transactional
    public User updateUser(String userId, String username, String name, String bio,
                           String blogTitle, String themeColor, String bgmUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (username != null && !username.equals(user.getUsername())) {
            Optional<User> existingWithUsername = userRepository.findByUsername(username);
            if (existingWithUsername.isPresent()) {
                throw new RuntimeException("Username already taken");
            }
            user.setUsername(username);
        }

        if (name != null) user.setName(name);
        if (bio != null) user.setBio(bio);
        if (blogTitle != null) user.setBlogTitle(blogTitle);
        if (themeColor != null) user.setThemeColor(themeColor);
        if (bgmUrl != null) user.setBgmUrl(bgmUrl);

        return userRepository.save(user);
    }

    @Transactional
    public void incrementVisits(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setTodayVisits(user.getTodayVisits() + 1);
        user.setTotalVisits(user.getTotalVisits() + 1);
        userRepository.save(user);
    }
}
