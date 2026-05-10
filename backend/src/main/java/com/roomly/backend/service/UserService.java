package com.roomly.backend.service;

import com.roomly.backend.entity.User;
import com.roomly.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Ensure a user exists in the database. Creates one if not found by ID.
     * This is used when JWT validation succeeds to ensure the user record exists
     * for foreign key constraints.
     * 
     * @param userId The UUID from Supabase Auth
     * @param email The user's email from Supabase Auth
     * @return The User object (existing or newly created)
     */
    public User ensureUserExists(UUID userId, String email) {
        return userRepository.findById(userId).orElseGet(() -> createNewUser(userId, email));
    }

    private User createNewUser(UUID userId, String email) {
        // Generate username from email (first part before @)
        String username = email.substring(0, email.indexOf('@')) + "_" + userId.toString().substring(0, 8);
        
        User user = new User();
        user.setId(userId);
        user.setEmail(email);
        user.setUsername(username);
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        user.setVerified(false);
        user.setIsLandlord(false);
        
        return userRepository.save(user);
    }

    public User getUserById(UUID userId) {
        return userRepository.findById(userId).orElse(null);
    }
}
