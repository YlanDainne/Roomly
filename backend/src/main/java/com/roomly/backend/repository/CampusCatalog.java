package com.roomly.backend.repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import com.roomly.backend.entity.Campus;
import com.roomly.backend.entity.ListingRequest;

public final class CampusCatalog {

  private static final List<Campus> CAMPUSES = List.of(
      new Campus("CIT University", "Cebu City", "Mambaling", 10.2900, 123.8730, "Mambaling / CIT"),
      new Campus("University of San Jose-Recoletos Basak Campus", "Cebu City", "Basak Pardo", 10.2798, 123.8469, "Basak Pardo / USJ-R"),
      new Campus("University of San Jose-Recoletos Main Campus", "Cebu City", "Magallanes", 10.2956, 123.8982, "Colon / USJ-R Main"),
      new Campus("University of Cebu Pardo-Talisay Campus", "Cebu City", "Pardo", 10.2658, 123.8378, "Pardo / UC Pardo-Talisay"),
      new Campus("University of Cebu Main Campus", "Cebu City", "Colon", 10.2969, 123.8978, "Colon / UC Main"),
      new Campus("University of Cebu METC", "Mandaue City", "Subangdaku", 10.3274, 123.9324, "Subangdaku / UC METC"),
      new Campus("University of Cebu Banilad Campus", "Cebu City", "Banilad", 10.3377, 123.9060, "Banilad / UC Banilad"),
      new Campus("Cebu Doctors' University", "Mandaue City", "Mandaue", 10.3303, 123.9390, "Mandaue / CDU"),
      new Campus("Velez College", "Cebu City", "Capitol Site", 10.3045, 123.8907, "Capitol Site / Velez"),
      new Campus("Southwestern University PHINMA", "Cebu City", "Urgello", 10.3018, 123.8894, "Urgello / SWU"),
      new Campus("Cebu Technological University Main Campus", "Cebu City", "Mabolo", 10.3029, 123.9025, "Mabolo / CTU Main"),
      new Campus("Cebu Normal University", "Cebu City", "Osmena Boulevard", 10.2958, 123.8937, "Osmena Boulevard / CNU"),
      new Campus("University of San Carlos South Campus", "Cebu City", "Sambag I", 10.3013, 123.8926, "Sambag I / USC South"),
      new Campus("University of San Carlos Main Campus", "Cebu City", "Magallanes", 10.2983, 123.8975, "Magallanes / USC Main"),
      new Campus("University of San Carlos Talamban Campus", "Cebu City", "Talamban", 10.3768, 123.9146, "Talamban / USC Talamban"));

  private static final Map<String, Campus> BY_NAME = CAMPUSES.stream()
      .collect(Collectors.toMap(campus -> normalize(campus.name()), campus -> campus));

  private CampusCatalog() {}

  public static List<Campus> campuses() {
    return new ArrayList<>(CAMPUSES);
  }

  public static Optional<Campus> findByName(String campusName) {
    if (campusName == null) {
      return Optional.empty();
    }
    return Optional.ofNullable(BY_NAME.get(normalize(campusName)));
  }

  public static Campus resolve(ListingRequest request) {
    Optional<Campus> matchedCampus = findByName(request.getUniversity());
    if (matchedCampus.isPresent()) {
      return matchedCampus.get();
    }

    String normalizedNeighborhood = normalize(request.getNeighborhood());
    return CAMPUSES.stream()
        .filter(campus -> normalize(campus.neighborhood()).equals(normalizedNeighborhood))
        .findFirst()
        .orElse(new Campus(
            Optional.ofNullable(request.getUniversity()).filter(value -> !value.isBlank()).orElse("Cebu City"),
            Optional.ofNullable(request.getCity()).filter(value -> !value.isBlank()).orElse("Cebu City"),
            Optional.ofNullable(request.getNeighborhood()).filter(value -> !value.isBlank()).orElse("Cebu City"),
            10.3157,
            123.8854,
            "Cebu City"));
  }

  public static String hotspotLabelFor(ListingRequest request) {
    return resolve(request).hotspotLabel();
  }

  private static String normalize(String value) {
    return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
  }
}