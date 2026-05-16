package com.roomly.backend.controller;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.roomly.backend.entity.Campus;
import com.roomly.backend.entity.ContractProposalRequest;
import com.roomly.backend.entity.HotspotResponse;
import com.roomly.backend.entity.ListingRequest;
import com.roomly.backend.entity.ListingResponse;
import com.roomly.backend.service.ListingService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class ListingController {

  private final ListingService listingService;

  public ListingController(ListingService listingService) {
    this.listingService = listingService;
  }

  @GetMapping("/listings")
  public List<ListingResponse> getListings() {
    return listingService.findAll(getCurrentUserId());
  }

  @GetMapping("/listings/{id}")
  public ResponseEntity<ListingResponse> getListing(@PathVariable long id) {
    return ResponseEntity.ok(listingService.findById(getCurrentUserId(), id));
  }

  @PostMapping(value = "/listings", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ListingResponse> createListing(
      @RequestParam String title,
      @RequestParam String city,
      @RequestParam String neighborhood,
      @RequestParam String university,
      @RequestParam Integer price,
      @RequestParam Integer beds,
      @RequestParam Integer baths,
      @RequestParam Double sizeSqm,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) Double latitude,
      @RequestParam(required = false) Double longitude,
      @RequestParam(required = false) MultipartFile[] images) throws IOException {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    ListingRequest request = buildRequest(title, city, neighborhood, university, price, beds, baths, sizeSqm, description, latitude, longitude);
    return ResponseEntity.ok(listingService.create(userId, request, images));
  }

  @PutMapping(value = "/listings/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public ResponseEntity<ListingResponse> updateListing(
      @PathVariable long id,
      @RequestParam String title,
      @RequestParam String city,
      @RequestParam String neighborhood,
      @RequestParam String university,
      @RequestParam Integer price,
      @RequestParam Integer beds,
      @RequestParam Integer baths,
      @RequestParam Double sizeSqm,
      @RequestParam(required = false) String description,
      @RequestParam(required = false) Double latitude,
      @RequestParam(required = false) Double longitude,
      @RequestParam(required = false) MultipartFile[] images) throws IOException {
    ListingRequest request = buildRequest(title, city, neighborhood, university, price, beds, baths, sizeSqm, description, latitude, longitude);
    return ResponseEntity.ok(listingService.update(id, request, images));
  }

  @DeleteMapping("/listings/{id}")
  public ResponseEntity<Void> deleteListing(@PathVariable long id) {
    listingService.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/saved-homes")
  public List<ListingResponse> getSavedHomes() {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    return listingService.findSavedHomes(userId);
  }

  @PostMapping("/saved-homes/{id}")
  public ResponseEntity<Void> saveListing(@PathVariable long id) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.saveListing(userId, id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/listings/{id}/contact")
  public ResponseEntity<Void> contactLandlord(@PathVariable long id) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.contactLandlord(userId, id);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/listings/{id}/contract-request")
  public ResponseEntity<Map<String, String>> submitContractProposal(
      @PathVariable long id,
      @RequestBody ContractProposalRequest request) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }

    String proposalId = listingService.submitContractProposal(userId, id, request);
    return ResponseEntity.ok(java.util.Map.of("id", proposalId != null ? proposalId : ""));
  }

  @GetMapping("/contract-proposals")
  public List<com.roomly.backend.entity.ContractProposal> getMyContractProposals() {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    return listingService.findProposalsForUser(userId);
  }

  @DeleteMapping("/contract-proposals/{proposalId}")
  public ResponseEntity<Void> deleteContractProposal(@PathVariable String proposalId) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.cancelContractProposalById(userId, proposalId);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/listings/{id}/proposals")
  public ResponseEntity<?> getProposalsForListing(@PathVariable long id) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      return ResponseEntity.status(401).body("User not authenticated");
    }
    try {
      List<com.roomly.backend.entity.ContractProposal> proposals = listingService.findProposalsForListing(userId, id);
      return ResponseEntity.ok(proposals);
    } catch (IllegalArgumentException ex) {
      String msg = ex.getMessage();
      if (msg != null && msg.contains("Not authorized")) {
        return ResponseEntity.status(403).body(msg);
      }
      if (msg != null && msg.contains("Listing not found")) {
        return ResponseEntity.status(404).body(msg);
      }
      return ResponseEntity.status(400).body(msg);
    } catch (Exception ex) {
      return ResponseEntity.status(500).body("Internal server error");
    }
  }

  @DeleteMapping("/listings/{id}/proposals/{proposalId}")
  public ResponseEntity<Void> deleteProposalAsLandlord(@PathVariable long id, @PathVariable String proposalId) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.rejectContractProposal(userId, id, proposalId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/listings/{id}/proposals/{proposalId}/approve")
  public ResponseEntity<Void> approveProposal(@PathVariable long id, @PathVariable String proposalId) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.approveContractProposal(userId, id, proposalId);
    return ResponseEntity.noContent().build();
  }

  @PostMapping("/listings/{id}/contract-request/{proposalId}/cancel")
  public ResponseEntity<Void> cancelContractProposal(
      @PathVariable long id,
      @PathVariable String proposalId) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }

    listingService.cancelContractProposal(userId, id, proposalId);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/saved-homes/{id}")
  public ResponseEntity<Void> unsaveListing(@PathVariable long id) {
    UUID userId = getCurrentUserId();
    if (userId == null) {
      throw new IllegalArgumentException("User not authenticated");
    }
    listingService.unsaveListing(userId, id);
    return ResponseEntity.noContent().build();
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

  @GetMapping("/campuses")
  public List<Campus> getCampuses() {
    return listingService.campuses();
  }

  @GetMapping("/hotspots")
  public List<HotspotResponse> getHotspots() {
    return listingService.hotspots();
  }

  private ListingRequest buildRequest(
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
      Double longitude) {
    ListingRequest request = new ListingRequest();
    request.setTitle(title);
    request.setCity(city);
    request.setNeighborhood(neighborhood);
    request.setUniversity(university);
    request.setPrice(price);
    request.setBeds(beds);
    request.setBaths(baths);
    request.setSizeSqm(sizeSqm);
    request.setDescription(description);
    request.setLatitude(latitude);
    request.setLongitude(longitude);
    return request;
  }
}