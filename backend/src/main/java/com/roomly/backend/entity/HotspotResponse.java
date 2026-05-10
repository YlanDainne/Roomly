package com.roomly.backend.entity;

public record HotspotResponse(
    String name,
    String type,
    int count,
    Double latitude,
    Double longitude) {}