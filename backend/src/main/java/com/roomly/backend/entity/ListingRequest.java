package com.roomly.backend.entity;

public class ListingRequest {
  private String title;
  private String city;
  private String neighborhood;
  private String university;
  private Integer price;
  private Integer beds;
  private Integer baths;
  private Double sizeSqm;
  private String description;
  private Double latitude;
  private Double longitude;

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
}