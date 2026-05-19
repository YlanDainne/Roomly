package com.roomly.backend.controller;

import com.roomly.backend.entity.ListingResponse;
import com.roomly.backend.entity.User;
import com.roomly.backend.service.ListingService;
import com.roomly.backend.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Admin Controller - Handles listing approval, rejection, and deletion.
 * All endpoints require ROLE_ADMIN authority enforced by SecurityConfig.
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    private final ListingService listingService;
    private final UserService userService;

    public AdminController(ListingService listingService, UserService userService) {
        this.listingService = listingService;
        this.userService = userService;
    }

    /**
     * Get all pending listings awaiting admin approval.
     * Only accessible to users with ROLE_ADMIN.
     */
    @GetMapping("/listings/pending")
    public ResponseEntity<List<ListingResponse>> getPendingListings() {
        try {
            UUID userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("getPendingListings: User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Verify user is admin
            User user = userService.getUserById(userId);
            if (user == null || !"admin".equalsIgnoreCase(user.getRole())) {
                logger.warn("getPendingListings: User {} attempted access without admin role", userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            List<ListingResponse> pendingListings = listingService.findPendingListings(userId);
            logger.info("Admin {} retrieved {} pending listings", userId, pendingListings.size());
            return ResponseEntity.ok(pendingListings);
        } catch (Exception e) {
            logger.error("Error retrieving pending listings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Update listing status to 'approved' or 'rejected'.
     * Only accessible to users with ROLE_ADMIN.
     */
    @PatchMapping("/listings/{id}/status")
    public ResponseEntity<Map<String, String>> updateListingStatus(
            @PathVariable long id,
            @RequestBody Map<String, String> payload) {
        try {
            UUID userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("updateListingStatus: User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Verify user is admin
            User user = userService.getUserById(userId);
            if (user == null || !"admin".equalsIgnoreCase(user.getRole())) {
                logger.warn("updateListingStatus: User {} attempted access without admin role", userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            String status = payload.get("status");
            if (status == null || 
                (!status.equalsIgnoreCase("approved") && !status.equalsIgnoreCase("rejected"))) {
                logger.warn("updateListingStatus: Invalid status value: {}", status);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status must be 'approved' or 'rejected'"));
            }

            listingService.updateListingStatus(id, status);
            logger.info("Admin {} updated listing {} status to {}", userId, id, status);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            logger.warn("updateListingStatus: Listing not found - {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Listing not found"));
        } catch (Exception e) {
            logger.error("Error updating listing status", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to update listing status"));
        }
    }

    /**
     * Permanently delete a listing.
     * Only accessible to users with ROLE_ADMIN.
     */
    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Map<String, String>> deleteListing(@PathVariable long id) {
        try {
            UUID userId = getCurrentUserId();
            if (userId == null) {
                logger.warn("deleteListing: User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Verify user is admin
            User user = userService.getUserById(userId);
            if (user == null || !"admin".equalsIgnoreCase(user.getRole())) {
                logger.warn("deleteListing: User {} attempted access without admin role", userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            listingService.delete(id);
            logger.info("Admin {} deleted listing {}", userId, id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting listing", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to delete listing"));
        }
    }

    /**
     * Extract the current user's ID from the security context.
     */
    private UUID getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated()) {
            String userIdStr = (String) auth.getPrincipal();
            try {
                return UUID.fromString(userIdStr);
            } catch (IllegalArgumentException e) {
                logger.warn("Invalid UUID in authentication principal: {}", userIdStr);
                return null;
            }
        }
        return null;
    }
}
