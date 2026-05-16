package com.roomly.backend.controller;

import java.util.List;
import java.util.UUID;
import com.roomly.backend.entity.Notification;
import com.roomly.backend.repository.NotificationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class NotificationController {

  private final NotificationRepository notificationRepository;

  public NotificationController(NotificationRepository notificationRepository) {
    this.notificationRepository = notificationRepository;
  }

  @GetMapping("/notifications")
  public ResponseEntity<List<Notification>> getNotifications() {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    return ResponseEntity.ok(notifications);
  }

  @PutMapping("/notifications/{id}/read")
  public ResponseEntity<Void> markAsRead(@PathVariable long id) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      return ResponseEntity.status(401).build();
    }
    
    notificationRepository.findById(id).ifPresent(notification -> {
      if (notification.getUserId().equals(userId)) {
        notification.setRead(true);
        notificationRepository.save(notification);
      }
    });
    
    return ResponseEntity.ok().build();
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
