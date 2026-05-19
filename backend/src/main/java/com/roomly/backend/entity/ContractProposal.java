package com.roomly.backend.entity;

import java.time.OffsetDateTime;
import java.util.UUID;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "contract_proposals")
public class ContractProposal {

  @Id
  private String id;

  @Column(nullable = false)
  private long listingId;

  @Column(nullable = false)
  private UUID userId;

  private String proposerName;
  private String proposerEmail;

  private String listingTitle;
  private String address;
  private Integer proposedPrice;
  private String viewingDate;
  private String viewingTime;
  private String moveInTimeline;
  private String message;
  private String status;
  private OffsetDateTime createdAt;

  public ContractProposal() {}

  public ContractProposal(String id, long listingId, UUID userId, String proposerName, String proposerEmail, String listingTitle, String address, Integer proposedPrice, String viewingDate, String viewingTime, String moveInTimeline, String message, String status, OffsetDateTime createdAt) {
    this.id = id;
    this.listingId = listingId;
    this.userId = userId;
    this.proposerName = proposerName;
    this.proposerEmail = proposerEmail;
    this.listingTitle = listingTitle;
    this.address = address;
    this.proposedPrice = proposedPrice;
    this.viewingDate = viewingDate;
    this.viewingTime = viewingTime;
    this.moveInTimeline = moveInTimeline;
    this.message = message;
    this.status = status;
    this.createdAt = createdAt;
  }

  // Getters and setters
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public long getListingId() { return listingId; }
  public void setListingId(long listingId) { this.listingId = listingId; }
  public UUID getUserId() { return userId; }
  public void setUserId(UUID userId) { this.userId = userId; }
  public String getProposerName() { return proposerName; }
  public void setProposerName(String proposerName) { this.proposerName = proposerName; }
  public String getProposerEmail() { return proposerEmail; }
  public void setProposerEmail(String proposerEmail) { this.proposerEmail = proposerEmail; }
  public String getListingTitle() { return listingTitle; }
  public void setListingTitle(String listingTitle) { this.listingTitle = listingTitle; }
  public String getAddress() { return address; }
  public void setAddress(String address) { this.address = address; }
  public Integer getProposedPrice() { return proposedPrice; }
  public void setProposedPrice(Integer proposedPrice) { this.proposedPrice = proposedPrice; }
  public String getViewingDate() { return viewingDate; }
  public void setViewingDate(String viewingDate) { this.viewingDate = viewingDate; }
  public String getViewingTime() { return viewingTime; }
  public void setViewingTime(String viewingTime) { this.viewingTime = viewingTime; }
  public String getMoveInTimeline() { return moveInTimeline; }
  public void setMoveInTimeline(String moveInTimeline) { this.moveInTimeline = moveInTimeline; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }
  public OffsetDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
