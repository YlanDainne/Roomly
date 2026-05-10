package com.roomly.backend.entity;

import java.util.List;

public record ListingResponse(
    Long id,
    String title,
    String city,
    String neighborhood,
    String university,
    Integer price,
    Integer beds,
    Integer baths,
    Double sizeSqm,
    String description,
    Double latitude,
    Double longitude,
    List<String> imageUrls,
    boolean saved,
    String hotspotLabel,
    String landlordName,
    String landlordEmail) {}