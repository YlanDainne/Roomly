package com.roomly.backend.repository;

import com.roomly.backend.entity.SavedHome;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SavedHomesRepository extends JpaRepository<SavedHome, Long> {
  List<SavedHome> findByUserId(UUID userId);
  Optional<SavedHome> findByUserIdAndListingId(UUID userId, Long listingId);
  void deleteByUserIdAndListingId(UUID userId, Long listingId);
}
