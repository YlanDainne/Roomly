import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';
import {
  Home,
  Search,
  Heart,
  Bell,
  Funnel,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Eye,
  Map,
  SlidersHorizontal,
  ArrowUp
} from 'lucide-react';

const cityOptions = ['Cebu City', 'Mandaue City', 'Lapu-Lapu City'];
const universityOptions = [
  'Velez College',
  'University of San Carlos',
  'University of Cebu',
  'Cebu Normal University'
];
const neighborhoodOptions = [
  'Mabolo',
  'Lahug',
  'Talamban',
  'Capitol Site',
  'Banilad',
  'Banawa',
  'Guadalupe',
  'Apas',
  'Punta Princesa',
  'Tisa',
  'Mambaling',
  'Camputhaw'
];
const amenityOptions = ['High-speed WiFi', 'Air Conditioning', '24/7 Security'];

const listings = [
  {
    id: 1,
    title: 'Velez Boarding House',
    city: 'Cebu City',
    neighborhood: 'Lahug',
    location: 'Capitol Site, Cebu City',
    university: 'Velez College',
    price: 8500,
    maxDistance: 5,
    walkLabel: '500 m to Velez College',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '15 sqm.',
    amenities: ['High-speed WiFi', 'Air Conditioning', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'Capitol Student Pad',
    city: 'Cebu City',
    neighborhood: 'Capitol Site',
    location: 'Capitol Site, Cebu City',
    university: 'Velez College',
    price: 11500,
    maxDistance: 9,
    walkLabel: '750 m to Velez College',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '21 sqm.',
    amenities: ['High-speed WiFi', 'Air Conditioning', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'Mabolo Nest Dorm',
    city: 'Cebu City',
    neighborhood: 'Mabolo',
    location: 'Mabolo, Cebu City',
    university: 'University of San Carlos',
    price: 9800,
    maxDistance: 13,
    walkLabel: '1.2 km to USC Main',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '18 sqm.',
    amenities: ['High-speed WiFi', 'Air Conditioning'],
    image:
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'Talamban Study Loft',
    city: 'Cebu City',
    neighborhood: 'Talamban',
    location: 'Talamban, Cebu City',
    university: 'University of San Carlos',
    price: 7600,
    maxDistance: 18,
    walkLabel: '1.8 km to USC Talamban',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '20 sqm.',
    amenities: ['High-speed WiFi', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 5,
    title: 'Banilad Haven',
    city: 'Cebu City',
    neighborhood: 'Banilad',
    location: 'Banilad, Cebu City',
    university: 'Velez College',
    price: 14000,
    maxDistance: 8,
    walkLabel: '650 m to Velez College',
    beds: '2 Beds',
    baths: '1 Bath',
    size: '26 sqm.',
    amenities: ['High-speed WiFi', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 6,
    title: 'Banawa Garden Rooms',
    city: 'Cebu City',
    neighborhood: 'Banawa',
    location: 'Banawa, Cebu City',
    university: 'University of Cebu',
    price: 7000,
    maxDistance: 25,
    walkLabel: '2.9 km to UC Main',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '17 sqm.',
    amenities: ['Air Conditioning', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 7,
    title: 'Mandaue Transit Home',
    city: 'Mandaue City',
    neighborhood: 'Subangdaku',
    location: 'Subangdaku, Mandaue City',
    university: 'University of Cebu',
    price: 6900,
    maxDistance: 22,
    walkLabel: '4.8 km to UC Main',
    beds: '1 Bed',
    baths: '1 Bath',
    size: '14 sqm.',
    amenities: ['High-speed WiFi', 'Air Conditioning', '24/7 Security'],
    image:
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=900&auto=format&fit=crop'
  }
];

const createDefaultFilters = () => ({
  query: '',
  city: 'Cebu City',
  neighborhoods: ['Mabolo', 'Lahug', 'Talamban', 'Capitol Site'],
  university: 'Velez College',
  maxDistance: 15,
  maxBudget: 12000,
  amenities: [...amenityOptions]
});

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [draftFilters, setDraftFilters] = useState(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(createDefaultFilters);
  const [showMoreNeighborhoods, setShowMoreNeighborhoods] = useState(false);

  const visibleNeighborhoods = showMoreNeighborhoods
    ? neighborhoodOptions
    : neighborhoodOptions.slice(0, 4);

  const filteredListings = useMemo(() => {
    const query = appliedFilters.query.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesQuery =
        query.length === 0 ||
        [
          listing.title,
          listing.city,
          listing.neighborhood,
          listing.location,
          listing.university,
          ...listing.amenities
        ]
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesCity = appliedFilters.city === 'All Cities' || listing.city === appliedFilters.city;
      const matchesNeighborhoods =
        appliedFilters.neighborhoods.length === 0 ||
        appliedFilters.neighborhoods.includes(listing.neighborhood);
      const matchesUniversity =
        appliedFilters.university === 'All Universities' ||
        listing.university === appliedFilters.university;
      const matchesDistance = listing.maxDistance <= appliedFilters.maxDistance;
      const matchesBudget = listing.price <= appliedFilters.maxBudget;
      const matchesAmenities = appliedFilters.amenities.every((amenity) =>
        listing.amenities.includes(amenity)
      );

      return (
        matchesQuery &&
        matchesCity &&
        matchesNeighborhoods &&
        matchesUniversity &&
        matchesDistance &&
        matchesBudget &&
        matchesAmenities
      );
    });
  }, [appliedFilters]);

  const updateDraftFilters = (field, value) => {
    setDraftFilters((previous) => ({
      ...previous,
      [field]: value
    }));
  };

  const toggleDraftNeighborhood = (neighborhood) => {
    setDraftFilters((previous) => ({
      ...previous,
      neighborhoods: previous.neighborhoods.includes(neighborhood)
        ? previous.neighborhoods.filter((value) => value !== neighborhood)
        : [...previous.neighborhoods, neighborhood]
    }));
  };

  const toggleDraftAmenity = (amenity) => {
    setDraftFilters((previous) => ({
      ...previous,
      amenities: previous.amenities.includes(amenity)
        ? previous.amenities.filter((value) => value !== amenity)
        : [...previous.amenities, amenity]
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = createDefaultFilters();
    setDraftFilters(resetFilters);
    setAppliedFilters(resetFilters);
    setShowMoreNeighborhoods(false);
  };

  return (
    <div className="search-results-page">
      <header className="results-topbar">
        <button
          className="results-brand"
          type="button"
          onClick={() => navigate('/dashboard')}
          aria-label="Go to dashboard"
        >
          <div className="results-logo-wrap">
            <Home size={16} />
          </div>
          <span>RentBuddy</span>
        </button>

        <div className="results-searchbar">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Find your perfect home.."
            value={draftFilters.query}
            onChange={(event) => updateDraftFilters('query', event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                handleApplyFilters();
              }
            }}
          />
        </div>

        <div className="results-actions">
          <button className="icon-btn" aria-label="Saved homes">
            <Heart size={18} />
          </button>
          <button className="icon-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="profile-pic">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop"
              alt="User profile"
            />
          </div>
        </div>
      </header>

      <div className="results-body">
        <aside className="filters-panel">
          <div className="filters-header">
            <h2>
              <Funnel size={16} /> Filters
            </h2>
            <button type="button" className="filters-clear-btn" onClick={handleClearFilters}>
              Clear All
            </button>
          </div>

          <section className="filter-block">
            <h3>Location</h3>
            <label className="filter-label">City</label>
            <div className="chip-input">
              <MapPin size={14} />
              <select
                className="filter-select"
                aria-label="City"
                value={draftFilters.city}
                onChange={(event) => updateDraftFilters('city', event.target.value)}
              >
                <option value="All Cities">All Cities</option>
                {cityOptions.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <label className="filter-label">Neighborhoods</label>
            <div className="check-list">
              {visibleNeighborhoods.map((name) => (
                <label key={name} className="check-item">
                  <input
                    type="checkbox"
                    checked={draftFilters.neighborhoods.includes(name)}
                    onChange={() => toggleDraftNeighborhood(name)}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
            <button
              type="button"
              className="show-more-btn"
              onClick={() => setShowMoreNeighborhoods((previous) => !previous)}
            >
              {showMoreNeighborhoods ? '- Show less' : '+ Show 8 more'}
            </button>
          </section>

          <section className="filter-block">
            <h3>Academic Proximity</h3>
            <label className="filter-label">Preferred University</label>
            <select
              className="select-field"
              aria-label="Preferred University"
              value={draftFilters.university}
              onChange={(event) => updateDraftFilters('university', event.target.value)}
            >
              <option value="All Universities">All Universities</option>
              {universityOptions.map((university) => (
                <option key={university} value={university}>
                  {university}
                </option>
              ))}
            </select>

            <div className="range-header">
              <span>Max Distance (walk)</span>
              <span className="range-value">{draftFilters.maxDistance} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={draftFilters.maxDistance}
              aria-label="Maximum walking distance"
              onChange={(event) => updateDraftFilters('maxDistance', Number(event.target.value))}
            />
          </section>

          <section className="filter-block">
            <h3>Budget (PHP)</h3>
            <div className="budget-grid">
              <div className="budget-box">₱ 5,000</div>
              <div className="budget-box">₱ {draftFilters.maxBudget.toLocaleString()}</div>
            </div>
            <input
              type="range"
              min="5000"
              max="25000"
              step="500"
              value={draftFilters.maxBudget}
              aria-label="Maximum budget"
              onChange={(event) => updateDraftFilters('maxBudget', Number(event.target.value))}
            />
          </section>

          <section className="filter-block">
            <h3>Amenities</h3>
            <label className="filter-label">Essential Features</label>
            <div className="check-list">
              {amenityOptions.map((name) => (
                <label key={name} className="check-item">
                  <input
                    type="checkbox"
                    checked={draftFilters.amenities.includes(name)}
                    onChange={() => toggleDraftAmenity(name)}
                  />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </section>

          <button type="button" className="apply-filters-btn" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </aside>

        <main className="results-main">
          <div className="results-headline-row">
            <div>
              <h1>Student Homes in Cebu City</h1>
              <p>
                Showing {filteredListings.length} verified listing
                {filteredListings.length === 1 ? '' : 's'} near your selected campus
              </p>
            </div>

            <div className="view-switcher">
              <button className="view-btn active">
                <SlidersHorizontal size={14} /> List View
              </button>
              <button className="view-btn">
                <Map size={14} /> Map View
              </button>
            </div>
          </div>

          <section className="map-card" aria-label="Map placeholder" />

          <section className="results-listing-section" id="results-listings">
            <h2>{filteredListings.length > 0 ? 'Top Recommendations' : 'No Results Found'}</h2>

            {filteredListings.length > 0 ? (
              filteredListings.map((listing) => (
                <article key={listing.id} className="results-listing-card">
                  <img src={listing.image} alt={listing.title} />

                  <div className="results-listing-content">
                    <div className="listing-top-row">
                      <div>
                        <span className="location-badge">{listing.location}</span>
                        <h3>{listing.title}</h3>
                        <div className="mini-specs">
                          <span>
                            <Bed size={13} /> {listing.beds}
                          </span>
                          <span>
                            <Bath size={13} /> {listing.baths}
                          </span>
                          <span>
                            <Maximize size={13} /> {listing.size}
                          </span>
                        </div>
                      </div>

                      <div className="listing-price-right">
                        <strong>₱ {listing.price.toLocaleString()}</strong>
                        <small>/month</small>
                      </div>
                    </div>

                    <div className="listing-bottom-row">
                      <span className="distance-text">
                        <MapPin size={13} /> {listing.walkLabel}
                      </span>

                      <button className="details-link-btn" type="button">
                        <Eye size={14} /> View Details <ArrowUp size={12} className="arrow-tilt" />
                      </button>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-results">
                <p>No homes match the selected filters.</p>
                <button type="button" className="details-link-btn" onClick={handleClearFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
