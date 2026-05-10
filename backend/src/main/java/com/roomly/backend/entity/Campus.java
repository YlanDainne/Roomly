package com.roomly.backend.entity;

public record Campus(
    String name,
    String city,
    String neighborhood,
    double latitude,
    double longitude,
    String hotspotLabel) {}