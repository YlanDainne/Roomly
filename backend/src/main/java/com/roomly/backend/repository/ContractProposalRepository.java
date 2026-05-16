package com.roomly.backend.repository;

import java.util.List;
import java.util.UUID;
import com.roomly.backend.entity.ContractProposal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ContractProposalRepository extends JpaRepository<ContractProposal, String> {
  List<ContractProposal> findByUserIdOrderByCreatedAtDesc(UUID userId);
  List<ContractProposal> findByListingIdOrderByCreatedAtDesc(long listingId);
}
