package com.roomly.backend.controller;

import com.roomly.backend.service.SupabaseStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.roomly.backend.entity.User;
import com.roomly.backend.service.UserService;
import java.io.IOException;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final SupabaseStorageService storageService;
    private final UserService userService;

    public UserController(SupabaseStorageService storageService, UserService userService) {
        this.storageService = storageService;
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> getMe() {
        UUID userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.status(404).build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAvatar(@RequestParam("file") MultipartFile file) {
        UUID userId = getCurrentUserId();
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }

        try {
            // Upload to the 'avatars' folder using the backend's Service Role Key to bypass RLS
            String publicUrl = storageService.uploadFile(file, "avatars");
            return ResponseEntity.ok(Map.of("url", publicUrl));
        } catch (IOException e) {
            return ResponseEntity.status(500).body(Map.of("error", "Failed to upload image: " + e.getMessage()));
        }
    }

    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String userIdStr = (String) auth.getPrincipal();
            try {
                return UUID.fromString(userIdStr);
            } catch (IllegalArgumentException e) {
                return null;
            }
        }
        return null;
    }
}
