package com.roomly.backend.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import com.roomly.backend.entity.Campus;
import com.roomly.backend.entity.HotspotResponse;
import com.roomly.backend.entity.Listing;
import com.roomly.backend.entity.ListingRequest;
import com.roomly.backend.entity.ListingResponse;
import com.roomly.backend.entity.ContractProposalRequest;
import com.roomly.backend.entity.SavedHome;
import com.roomly.backend.repository.CampusCatalog;
import com.roomly.backend.repository.ContractProposalRepository;
import com.roomly.backend.entity.ContractProposal;
import com.roomly.backend.repository.ListingRepository;
import com.roomly.backend.repository.UserRepository;
import com.roomly.backend.repository.SavedHomesRepository;
import com.roomly.backend.repository.NotificationRepository;
import com.roomly.backend.entity.Notification;
import com.roomly.backend.entity.User;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class ListingService {

  private final ListingRepository listingRepository;
  private final SavedHomesRepository savedHomesRepository;
  private final SupabaseStorageService supabaseStorageService;
  private final UserRepository userRepository;
  private final NotificationRepository notificationRepository;
  private final ContractProposalRepository contractProposalRepository;

  public ListingService(ListingRepository listingRepository, SavedHomesRepository savedHomesRepository, SupabaseStorageService supabaseStorageService, UserRepository userRepository, NotificationRepository notificationRepository, ContractProposalRepository contractProposalRepository) {
    this.listingRepository = listingRepository;
    this.savedHomesRepository = savedHomesRepository;
    this.supabaseStorageService = supabaseStorageService;
    this.userRepository = userRepository;
    this.notificationRepository = notificationRepository;
    this.contractProposalRepository = contractProposalRepository;
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> findAll(UUID userId) {
    List<Long> savedListingIds = loadSavedListingIds(userId);
    return listingRepository.findAll().stream()
        .filter(listing -> "approved".equalsIgnoreCase(listing.getStatus()))
        .map(listing -> toResponse(listing, savedListingIds.contains(listing.getId())))
        .toList();
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> findPendingListings(UUID userId) {
    List<Long> savedListingIds = loadSavedListingIds(userId);
    return listingRepository.findAll().stream()
        .filter(listing -> "pending".equalsIgnoreCase(listing.getStatus()))
        .map(listing -> toResponse(listing, savedListingIds.contains(listing.getId())))
        .toList();
  }

  public void updateListingStatus(long id, String status) {
    Listing listing = requireListing(id);
    listing.setStatus(status);
    listingRepository.save(listing);

    if ("approved".equalsIgnoreCase(status)) {
        notificationRepository.save(new Notification(listing.getLandlordId(), 
            "Your listing '" + listing.getTitle() + "' has been approved and is now live!", "listing", id));
    } else if ("rejected".equalsIgnoreCase(status)) {
        notificationRepository.save(new Notification(listing.getLandlordId(), 
            "Your listing '" + listing.getTitle() + "' was rejected. Please edit it and resubmit for approval.", "listing", id));
    }
  }

  @Transactional(readOnly = true)
  public ListingResponse findById(UUID userId, long id) {
    Listing listing = requireListing(id);
    boolean isSaved = userId != null && savedHomesRepository.findByUserIdAndListingId(userId, id).isPresent();
    return toResponse(listing, isSaved);
  }

  public ListingResponse create(UUID landlordId, ListingRequest request, MultipartFile[] images) throws IOException {
    Listing listing = new Listing();
    listing.setLandlordId(landlordId);
    applyRequest(listing, request);
    saveImages(listing, images);
    return toResponse(listingRepository.save(listing), false);
  }

  public ListingResponse update(long id, ListingRequest request, MultipartFile[] images) throws IOException {
    Listing listing = requireListing(id);
    applyRequest(listing, request);
    if (images != null && images.length > 0) {
      listing.getImageUrls().clear();
      saveImages(listing, images);
    }
    return toResponse(listingRepository.save(listing), false);
  }

  public void delete(long id) {
    listingRepository.deleteById(id);
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> findSavedHomes(UUID userId) {
    return savedHomesRepository.findByUserId(userId).stream()
        .map(sh -> listingRepository.findById(sh.getListingId())
        .map(listing -> toResponse(listing, true))
            .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + sh.getListingId())))
        .toList();
  }

  public void saveListing(UUID userId, long listingId) {
    Listing listing = requireListing(listingId);
    System.out.println("[DEBUG] saveListing - userId: " + userId + ", listingId: " + listingId);
    if (savedHomesRepository.findByUserIdAndListingId(userId, listingId).isEmpty()) {
      savedHomesRepository.save(new SavedHome(userId, listingId));
      System.out.println("[DEBUG] SavedHome saved successfully");
      
      if (!userId.equals(listing.getLandlordId())) {
        User user = userRepository.findById(userId).orElse(null);
        String userName = user != null && user.getFullName() != null ? user.getFullName() : "A user";
        String message = userName + " saved your listing: " + listing.getTitle();
        notificationRepository.save(new Notification(listing.getLandlordId(), message));
        System.out.println("[DEBUG] Notification saved for landlord: " + listing.getLandlordId());
      }
    }
  }

  public void contactLandlord(UUID userId, long listingId) {
    Listing listing = requireListing(listingId);
    if (!userId.equals(listing.getLandlordId())) {
      User user = userRepository.findById(userId).orElse(null);
      String userName = user != null && user.getFullName() != null ? user.getFullName() : "A user";
      String userEmail = user != null ? user.getEmail() : "unknown email";
      String message = userName + " (" + userEmail + ") wants to contact you regarding your listing: " + listing.getTitle();
      notificationRepository.save(new Notification(listing.getLandlordId(), message));
    }
  }

  public String submitContractProposal(UUID userId, long listingId, ContractProposalRequest request) {
    Listing listing = requireListing(listingId);
    if (userId.equals(listing.getLandlordId())) {
      throw new IllegalArgumentException("You cannot submit a proposal to your own listing.");
    }

    User user = userRepository.findById(userId).orElse(null);
    String userName = user != null && user.getFullName() != null ? user.getFullName() : "A user";
    String userEmail = user != null ? user.getEmail() : "unknown email";

    StringBuilder message = new StringBuilder();
    message.append(userName)
        .append(" (")
        .append(userEmail)
        .append(") submitted an open contract request for your listing: ")
        .append(listing.getTitle());

    if (request != null) {
      if (request.proposedPrice() != null && !request.proposedPrice().isBlank()) {
        message.append(" | Proposed price: ₱ ").append(request.proposedPrice());
      }
      if (request.viewingDate() != null && !request.viewingDate().isBlank()) {
        message.append(" | Viewing date: ").append(request.viewingDate());
      }
      if (request.viewingTime() != null && !request.viewingTime().isBlank()) {
        message.append(" | Viewing time: ").append(request.viewingTime());
      }
      if (request.moveInTimeline() != null && !request.moveInTimeline().isBlank()) {
        message.append(" | Move-in: ").append(request.moveInTimeline());
      }
      if (request.message() != null && !request.message().isBlank()) {
        message.append(" | Message: ").append(request.message());
      }
    }

    // persist proposal
    String proposalId = listingId + "-" + System.currentTimeMillis();
    ContractProposal proposal = new ContractProposal(
      proposalId,
      listingId,
      userId,
      userName,
      userEmail,
      listing.getTitle(),
      listing.getNeighborhood() + ", " + listing.getCity(),
      request != null && request.proposedPrice() != null && !request.proposedPrice().isBlank() ? Integer.valueOf(request.proposedPrice()) : null,
      request != null ? request.viewingDate() : null,
      request != null ? request.viewingTime() : null,
      request != null ? request.moveInTimeline() : null,
      request != null ? request.message() : null,
      "Pending Approval",
      java.time.OffsetDateTime.now()
    );

    contractProposalRepository.save(proposal);

    notificationRepository.save(new Notification(listing.getLandlordId(), message.toString(), "proposal", Long.valueOf(listingId)));
    return proposalId;
  }

  @Transactional(readOnly = true)
  public List<com.roomly.backend.entity.ContractProposal> findProposalsForUser(UUID userId) {
    if (userId == null) return List.of();
    return contractProposalRepository.findByUserIdOrderByCreatedAtDesc(userId);
  }

  @Transactional(readOnly = true)
  public List<com.roomly.backend.entity.ContractProposal> findProposalsForListing(UUID userId, long listingId) {
    Listing listing = requireListing(listingId);
    System.out.println("[DEBUG] findProposalsForListing - userId: " + userId + ", listingId: " + listingId + ", listing.landlordId: " + listing.getLandlordId());
    if (!listing.getLandlordId().equals(userId)) {
      System.out.println("[DEBUG] Unauthorized access attempt by user " + userId + " for listing " + listingId + " owned by " + listing.getLandlordId());
      throw new IllegalArgumentException("Not authorized to view proposals for this listing");
    }
    List<com.roomly.backend.entity.ContractProposal> proposals = contractProposalRepository.findByListingIdOrderByCreatedAtDesc(listingId);
    System.out.println("[DEBUG] Proposals found for listing " + listingId + ": " + (proposals == null ? 0 : proposals.size()));
    return proposals;
  }

  public void approveContractProposal(UUID userId, long listingId, String proposalId) {
    Listing listing = requireListing(listingId);
    if (!listing.getLandlordId().equals(userId)) {
      throw new IllegalArgumentException("Not authorized to approve proposals for this listing");
    }
    contractProposalRepository.findById(proposalId).ifPresent(p -> {
      if (p.getListingId() == listingId) {
        p.setStatus("Approved");
        contractProposalRepository.save(p);
        User proposer = userRepository.findById(p.getUserId()).orElse(null);
        String proposerName = proposer != null && proposer.getFullName() != null ? proposer.getFullName() : "Landlord";

        String message = proposerName + " approved your contract proposal for listing: " + listing.getTitle();
        notificationRepository.save(new Notification(p.getUserId(), message, "proposal", Long.valueOf(listingId)));
      }
    });
  }

  public void rejectContractProposal(UUID userId, long listingId, String proposalId) {
    Listing listing = requireListing(listingId);
    if (!listing.getLandlordId().equals(userId)) {
      throw new IllegalArgumentException("Not authorized to reject proposals for this listing");
    }
    contractProposalRepository.findById(proposalId).ifPresent(p -> {
      if (p.getListingId() == listingId) {
        contractProposalRepository.deleteById(proposalId);
        User proposer = userRepository.findById(p.getUserId()).orElse(null);
        String proposerName = proposer != null && proposer.getFullName() != null ? proposer.getFullName() : "Landlord";

        String message = proposerName + " rejected your contract proposal for listing: " + listing.getTitle();
        notificationRepository.save(new Notification(p.getUserId(), message, "proposal", Long.valueOf(listingId)));
      }
    });
  }

  public void cancelContractProposalById(UUID userId, String proposalId) {
    contractProposalRepository.findById(proposalId).ifPresent(p -> {
      if (p.getUserId().equals(userId)) {
        Listing listing = requireListing(p.getListingId());
        contractProposalRepository.deleteById(proposalId);
        User user = userRepository.findById(userId).orElse(null);
        String userName = user != null && user.getFullName() != null ? user.getFullName() : "A user";

        StringBuilder message = new StringBuilder();
        message.append(userName)
            .append(" canceled their contract proposal for your listing: ")
            .append(listing.getTitle())
            .append(" (proposal id: ")
            .append(proposalId)
            .append(")");

        notificationRepository.save(new Notification(listing.getLandlordId(), message.toString()));
      }
    });
  }

  public void cancelContractProposal(UUID userId, long listingId, String proposalId) {
    Listing listing = requireListing(listingId);
    if (userId.equals(listing.getLandlordId())) {
      return;
    }
    // only allow owner of the proposal to cancel
    contractProposalRepository.findById(proposalId).ifPresent(p -> {
      if (p.getUserId().equals(userId)) {
        contractProposalRepository.deleteById(proposalId);
        User user = userRepository.findById(userId).orElse(null);
        String userName = user != null && user.getFullName() != null ? user.getFullName() : "A user";

        StringBuilder message = new StringBuilder();
        message.append(userName)
            .append(" canceled their contract proposal for your listing: ")
            .append(listing.getTitle())
            .append(" (proposal id: ")
            .append(proposalId)
            .append(")");

        notificationRepository.save(new Notification(listing.getLandlordId(), message.toString()));
        System.out.println("[DEBUG] cancelContractProposal - user: " + userId + " listing: " + listingId + " proposalId: " + proposalId);
      }
    });
  }

  public void unsaveListing(UUID userId, long listingId) {
    savedHomesRepository.deleteByUserIdAndListingId(userId, listingId);
  }

  @Transactional(readOnly = true)
  public List<Campus> campuses() {
    return CampusCatalog.campuses();
  }

  @Transactional(readOnly = true)
  public List<HotspotResponse> hotspots() {
    Map<String, List<Listing>> groupedListings = listingRepository.findAll().stream()
        .collect(Collectors.groupingBy(listing -> {
          Campus campus = CampusCatalog.resolve(toRequest(listing));
          return campus.hotspotLabel();
        }, java.util.LinkedHashMap::new, Collectors.toList()));

    return groupedListings.entrySet().stream()
        .map(entry -> {
          Listing sample = entry.getValue().get(0);
          Campus campus = CampusCatalog.resolve(toRequest(sample));
          return new HotspotResponse(
              entry.getKey(),
              sample.getUniversity(),
              entry.getValue().size(),
              campus.latitude(),
              campus.longitude());
        })
        .sorted(Comparator.comparingInt(HotspotResponse::count).reversed())
        .limit(6)
        .toList();
  }

  private Listing requireListing(long id) {
    return listingRepository.findById(id)
        .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + id));
  }

  private void applyRequest(Listing listing, ListingRequest request) {
    listing.setTitle(request.getTitle());
    listing.setCity(request.getCity());
    listing.setNeighborhood(request.getNeighborhood());
    listing.setUniversity(request.getUniversity());
    listing.setPrice(request.getPrice());
    listing.setBeds(request.getBeds());
    listing.setBaths(request.getBaths());
    listing.setSizeSqm(request.getSizeSqm());
    listing.setDescription(request.getDescription());

    if (request.getLatitude() != null && request.getLongitude() != null) {
      listing.setLatitude(request.getLatitude());
      listing.setLongitude(request.getLongitude());
    } else {
      Campus campus = CampusCatalog.resolve(request);
      listing.setLatitude(campus.latitude());
      listing.setLongitude(campus.longitude());
    }
  }

  private void saveImages(Listing listing, MultipartFile[] images) throws IOException {
    if (images == null) {
      return;
    }
    for (MultipartFile image : images) {
      try {
        String url = supabaseStorageService.uploadFile(image);
        if (url != null) {
          listing.getImageUrls().add(url);
        }
      } catch (IOException uploadError) {
        System.err.println("Skipping image upload because Supabase Storage rejected the file: " + uploadError.getMessage());
      }
    }
  }

  private ListingResponse toResponse(Listing listing, boolean saved) {
    User landlord = userRepository.findById(listing.getLandlordId()).orElse(null);
    String landlordName = "Unknown Landlord";
    String landlordEmail = "No email provided";

    if (landlord != null) {
      landlordEmail = landlord.getEmail();
      if (landlord.getFullName() != null && !landlord.getFullName().trim().isEmpty()) {
        landlordName = landlord.getFullName();
      } else {
        String baseName = landlord.getEmail().split("@")[0].replaceAll("[._-]", " ").replaceAll("\\d+", "").trim();
        if (baseName.isEmpty()) {
          baseName = "Landlord";
        }
        StringBuilder capitalizedName = new StringBuilder();
        for (String word : baseName.split(" ")) {
          if (!word.isEmpty()) {
            capitalizedName.append(Character.toUpperCase(word.charAt(0)))
                           .append(word.substring(1).toLowerCase())
                           .append(" ");
          }
        }
        landlordName = capitalizedName.toString().trim();
      }
    }

    return new ListingResponse(
        listing.getId(),
        listing.getTitle(),
        listing.getCity(),
        listing.getNeighborhood(),
        listing.getUniversity(),
        listing.getPrice(),
        listing.getBeds(),
        listing.getBaths(),
        listing.getSizeSqm(),
        listing.getDescription(),
        listing.getLatitude(),
        listing.getLongitude(),
        new ArrayList<>(listing.getImageUrls()),
        saved,
        CampusCatalog.resolve(toRequest(listing)).hotspotLabel(),
        landlordName,
        landlordEmail,
        listing.getStatus());
  }

        private List<Long> loadSavedListingIds(UUID userId) {
          if (userId == null) {
        return List.of();
          }

          return savedHomesRepository.findByUserId(userId).stream()
          .map(SavedHome::getListingId)
          .toList();
        }

  private ListingRequest toRequest(Listing listing) {
    ListingRequest request = new ListingRequest();
    request.setTitle(listing.getTitle());
    request.setCity(listing.getCity());
    request.setNeighborhood(listing.getNeighborhood());
    request.setUniversity(listing.getUniversity());
    request.setPrice(listing.getPrice());
    request.setBeds(listing.getBeds());
    request.setBaths(listing.getBaths());
    request.setSizeSqm(listing.getSizeSqm());
    request.setDescription(listing.getDescription());
    request.setLatitude(listing.getLatitude());
    request.setLongitude(listing.getLongitude());
    return request;
  }
}