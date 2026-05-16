package com.roomly.backend.entity;

public record ContractProposalRequest(
    String proposedPrice,
    String viewingDate,
    String viewingTime,
    String moveInTimeline,
    String message) {}