package com.roomly.backend.entity;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "saved_homes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "listing_id"}))
public class SavedHome {
  
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private UUID userId;

  @Column(nullable = false)
  private Long listingId;

  public SavedHome() {}

  public SavedHome(UUID userId, Long listingId) {
    this.userId = userId;
    this.listingId = listingId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public Long getListingId() {
    return listingId;
  }

  public void setListingId(Long listingId) {
    this.listingId = listingId;
  }
}
