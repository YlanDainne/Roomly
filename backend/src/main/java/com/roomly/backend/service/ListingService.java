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
import com.roomly.backend.entity.SavedHome;
import com.roomly.backend.repository.CampusCatalog;
import com.roomly.backend.repository.ListingRepository;
import com.roomly.backend.repository.SavedHomesRepository;
import com.roomly.backend.repository.UserRepository;
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

  public ListingService(ListingRepository listingRepository, SavedHomesRepository savedHomesRepository, SupabaseStorageService supabaseStorageService, UserRepository userRepository) {
    this.listingRepository = listingRepository;
    this.savedHomesRepository = savedHomesRepository;
    this.supabaseStorageService = supabaseStorageService;
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> findAll() {
    return listingRepository.findAll().stream().map(this::toResponse).toList();
  }

  @Transactional(readOnly = true)
  public ListingResponse findById(long id) {
    return toResponse(requireListing(id));
  }

  public ListingResponse create(UUID landlordId, ListingRequest request, MultipartFile[] images) throws IOException {
    Listing listing = new Listing();
    listing.setLandlordId(landlordId);
    applyRequest(listing, request);
    saveImages(listing, images);
    return toResponse(listingRepository.save(listing));
  }

  public ListingResponse update(long id, ListingRequest request, MultipartFile[] images) throws IOException {
    Listing listing = requireListing(id);
    applyRequest(listing, request);
    if (images != null && images.length > 0) {
      listing.getImageUrls().clear();
      saveImages(listing, images);
    }
    return toResponse(listingRepository.save(listing));
  }

  public void delete(long id) {
    listingRepository.deleteById(id);
  }

  @Transactional(readOnly = true)
  public List<ListingResponse> findSavedHomes(UUID userId) {
    return savedHomesRepository.findByUserId(userId).stream()
        .map(sh -> listingRepository.findById(sh.getListingId())
            .map(this::toResponse)
            .orElseThrow(() -> new IllegalArgumentException("Listing not found: " + sh.getListingId())))
        .toList();
  }

  public void saveListing(UUID userId, long listingId) {
    Listing listing = requireListing(listingId);
    if (savedHomesRepository.findByUserIdAndListingId(userId, listingId).isEmpty()) {
      savedHomesRepository.save(new SavedHome(userId, listingId));
    }
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

  private ListingResponse toResponse(Listing listing) {
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
        false,
        CampusCatalog.resolve(toRequest(listing)).hotspotLabel(),
        landlordName,
        landlordEmail);
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