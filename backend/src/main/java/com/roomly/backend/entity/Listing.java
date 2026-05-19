package com.roomly.backend.entity;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "listings")
public class Listing {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "landlord_id", nullable = false)
  private UUID landlordId;

  @Column(nullable = false)
  private String status = "pending";

  @Column(nullable = false)
  private String title;

  @Column(nullable = false)
  private String city;

  @Column(nullable = false)
  private String neighborhood;

  @Column(nullable = false)
  private String university;

  @Column(nullable = false)
  private Integer price;

  @Column(nullable = false)
  private Integer beds;

  @Column(nullable = false)
  private Integer baths;

  @Column(nullable = false)
  private Double sizeSqm;

  @Column(length = 2000)
  private String description;

  private Double latitude;

  private Double longitude;

  @ElementCollection(fetch = FetchType.EAGER)
  @CollectionTable(name = "listing_image_urls", joinColumns = @JoinColumn(name = "listing_id"))
  @Column(name = "image_url", length = 1000)
  private final List<String> imageUrls = new ArrayList<>();

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public UUID getLandlordId() {
    return landlordId;
  }

  public void setLandlordId(UUID landlordId) {
    this.landlordId = landlordId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getCity() {
    return city;
  }

  public void setCity(String city) {
    this.city = city;
  }

  public String getNeighborhood() {
    return neighborhood;
  }

  public void setNeighborhood(String neighborhood) {
    this.neighborhood = neighborhood;
  }

  public String getUniversity() {
    return university;
  }

  public void setUniversity(String university) {
    this.university = university;
  }

  public Integer getPrice() {
    return price;
  }

  public void setPrice(Integer price) {
    this.price = price;
  }

  public Integer getBeds() {
    return beds;
  }

  public void setBeds(Integer beds) {
    this.beds = beds;
  }

  public Integer getBaths() {
    return baths;
  }

  public void setBaths(Integer baths) {
    this.baths = baths;
  }

  public Double getSizeSqm() {
    return sizeSqm;
  }

  public void setSizeSqm(Double sizeSqm) {
    this.sizeSqm = sizeSqm;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public Double getLatitude() {
    return latitude;
  }

  public void setLatitude(Double latitude) {
    this.latitude = latitude;
  }

  public Double getLongitude() {
    return longitude;
  }

  public void setLongitude(Double longitude) {
    this.longitude = longitude;
  }


  public List<String> getImageUrls() {
    return imageUrls;
  }
}