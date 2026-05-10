import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import './SearchResultsPage.css';
import {
  Home,
  Search,
  Heart,
  Bell,
  Funnel,
  Bed,
  Bath,
  Maximize,
  Eye,
  Map,
  SlidersHorizontal,
  ArrowUp,
  MapPin
} from 'lucide-react';
import { useRentalData } from '../context/RentalDataContext';
import CebuMap from '../components/CebuMap';
import { campusOptions } from '../data/cebuCampuses';
import { resolveListingImageUrl } from '../lib/listingImageUrl';
import ProfileMenu from '../components/ProfileMenu';

const createDefaultFilters = () => ({
  query: '',
  university: 'All Universities',
  maxDistance: 30,
  maxBudget: 25000,
  minBeds: 0,
  minBaths: 0
});

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { listings, hotspots, toggleSaved, loading, error } = useRentalData();
  const [draftFilters, setDraftFilters] = useState(createDefaultFilters);
  const [appliedFilters, setAppliedFilters] = useState(createDefaultFilters);
  const [viewMode, setViewMode] = useState(searchParams.get('view') === 'map' ? 'map' : 'list');

  useEffect(() => {
    const query = searchParams.get('query') || '';
    const nextViewMode = searchParams.get('view') === 'map' ? 'map' : 'list';

    setDraftFilters((previous) => ({
      ...previous,
      query
    }));
    setAppliedFilters((previous) => ({
      ...previous,
      query
    }));
    setViewMode(nextViewMode);
  }, [location.search, searchParams]);

  const filteredListings = useMemo(() => {
    const query = appliedFilters.query.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesQuery =
        query.length === 0 ||
        [listing.title, listing.city, listing.neighborhood, listing.university, listing.description]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesUniversity =
        appliedFilters.university === 'All Universities' || listing.university === appliedFilters.university;
      const matchesBudget = Number(listing.price || 0) <= appliedFilters.maxBudget;
      const matchesBeds = Number(listing.beds || 0) >= appliedFilters.minBeds;
      const matchesBaths = Number(listing.baths || 0) >= appliedFilters.minBaths;

      return matchesQuery && matchesUniversity && matchesBudget && matchesBeds && matchesBaths;
    });
  }, [appliedFilters, listings]);

  const updateDraftFilters = (field, value) => {
    setDraftFilters((previous) => ({
      ...previous,
      [field]: value
    }));
  };



  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    const resetFilters = createDefaultFilters();
    setDraftFilters(resetFilters);
    setAppliedFilters(resetFilters);
  };

  return (
    <div className="search-results-page">
      <header className="results-topbar">
        <button className="results-brand" type="button" onClick={() => navigate('/dashboard')} aria-label="Go to dashboard">
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
          <button className="icon-btn" type="button" aria-label="Saved homes" onClick={() => navigate('/saved-homes')}>
            <Heart size={18} />
          </button>
          <button className="icon-btn" type="button" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <ProfileMenu />
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
            <h3>Academic Proximity</h3>
            <label className="filter-label">Preferred University</label>
            <select
              className="select-field"
              aria-label="Preferred University"
              value={draftFilters.university}
              onChange={(event) => updateDraftFilters('university', event.target.value)}
            >
              <option value="All Universities">All Universities</option>
              {campusOptions
                .filter((campus) => campus !== 'All Universities')
                .map((campus) => (
                  <option key={campus} value={campus}>
                    {campus}
                  </option>
                ))}
            </select>

            <div className="range-header">
              <span>Max Distance</span>
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
            <h3>Rooms</h3>
            
            <label className="filter-label" style={{ marginTop: '10px', display: 'block' }}>Minimum Bedrooms</label>
            <select
              className="select-field"
              value={draftFilters.minBeds}
              onChange={(event) => updateDraftFilters('minBeds', Number(event.target.value))}
            >
              <option value="0">Any</option>
              <option value="1">1+ Beds</option>
              <option value="2">2+ Beds</option>
              <option value="3">3+ Beds</option>
              <option value="4">4+ Beds</option>
            </select>

            <label className="filter-label" style={{ marginTop: '20px', display: 'block' }}>Minimum Bathrooms</label>
            <select
              className="select-field"
              value={draftFilters.minBaths}
              onChange={(event) => updateDraftFilters('minBaths', Number(event.target.value))}
            >
              <option value="0">Any</option>
              <option value="1">1+ Baths</option>
              <option value="2">2+ Baths</option>
              <option value="3">3+ Baths</option>
            </select>
          </section>

          <button type="button" className="apply-filters-btn" onClick={handleApplyFilters}>
            Apply Filters
          </button>
        </aside>

        <main className="results-main">
          <div className="results-headline-row">
            <div>
              <h1>Student Homes Near Cebu Campuses</h1>
              <p>
                Showing {filteredListings.length} verified listing{filteredListings.length === 1 ? '' : 's'} near your selected campus
              </p>
            </div>

            <div className="view-switcher">
              <button className={`view-btn ${viewMode === 'list' ? 'active' : ''}`} type="button" onClick={() => setViewMode('list')}>
                <SlidersHorizontal size={14} /> List View
              </button>
              <button className={`view-btn ${viewMode === 'map' ? 'active' : ''}`} type="button" onClick={() => setViewMode('map')}>
                <Map size={14} /> Map View
              </button>
            </div>
          </div>

          {viewMode === 'map' ? (
            <>
              <section className="map-card results-map-card" aria-label="Map of Cebu rental locations">
                <CebuMap listings={filteredListings} hotspots={hotspots} />
              </section>

              <section className="results-listing-section">
                <div className="section-header-row">
                  <h2>{filteredListings.length > 0 ? 'Listings in this area' : 'No Results Found'}</h2>
                  <span className="results-hint">Use the markers to inspect each Cebu location.</span>
                </div>

                {filteredListings.length > 0 ? (
                  <div className="results-listing-grid">
                    {filteredListings.map((listing) => (
                      <article key={listing.id} className="results-listing-card results-listing-card--compact">
                        <div className="listing-card-image-shell">
                          {listing.imageUrls && listing.imageUrls[0] ? (
                            <img src={resolveListingImageUrl(listing.imageUrls[0])} alt={listing.title} />
                          ) : (
                            <div className="listing-card-fallback">No image yet</div>
                          )}
                          <button
                            className={`listing-save-btn ${listing.saved ? 'saved' : ''}`}
                            type="button"
                            onClick={() => toggleSaved(listing)}
                            aria-label={listing.saved ? 'Remove from saved homes' : 'Save listing'}
                          >
                            <Heart size={14} fill={listing.saved ? 'currentColor' : 'none'} />
                          </button>
                        </div>

                        <div className="results-listing-content">
                          <div className="listing-top-row">
                            <div>
                              <span className="location-badge">
                                {listing.neighborhood}, {listing.city}
                              </span>
                              <h3>{listing.title}</h3>
                              <div className="mini-specs">
                                <span>
                                  <Bed size={13} /> {listing.beds} Bed
                                </span>
                                <span>
                                  <Bath size={13} /> {listing.baths} Bath
                                </span>
                                <span>
                                  <Maximize size={13} /> {listing.sizeSqm} sqm.
                                </span>
                              </div>
                            </div>

                            <div className="listing-price-right">
                              <strong>₱ {Number(listing.price).toLocaleString()}</strong>
                              <small>/month</small>
                            </div>
                          </div>

                          <div className="listing-bottom-row">
                            <span className="distance-text">
                              <MapPin size={13} /> {listing.university}
                            </span>

                            <button className="details-link-btn" type="button" onClick={() => navigate(`/listing/${listing.id}`)}>
                              <Eye size={14} /> View Details <ArrowUp size={12} className="arrow-tilt" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="empty-results">
                    <p>No homes match the selected filters.</p>
                    <button type="button" className="details-link-btn" onClick={handleClearFilters}>
                      Reset Filters
                    </button>
                  </div>
                )}
              </section>
            </>
          ) : (
            <section className="results-listing-section" id="results-listings">
              <div className="section-header-row">
                <h2>{filteredListings.length > 0 ? 'Top Recommendations' : 'No Results Found'}</h2>
                <span className="results-hint">
                  {hotspots.length > 0 ? `${hotspots.length} Cebu hotspots are active on the map.` : 'No hotspots yet.'}
                </span>
              </div>

              {loading ? (
                <div className="empty-results">
                  <p>Loading live listings from the backend.</p>
                </div>
              ) : error ? (
                <div className="empty-results">
                  <p>{error}</p>
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="results-listing-grid">
                  {filteredListings.map((listing) => (
                    <article key={listing.id} className="results-listing-card">
                      <div className="listing-card-image-shell">
                        {listing.imageUrls && listing.imageUrls[0] ? (
                          <img src={resolveListingImageUrl(listing.imageUrls[0])} alt={listing.title} />
                        ) : (
                          <div className="listing-card-fallback">No image yet</div>
                        )}
                        <button
                          className={`listing-save-btn ${listing.saved ? 'saved' : ''}`}
                          type="button"
                          onClick={() => toggleSaved(listing)}
                          aria-label={listing.saved ? 'Remove from saved homes' : 'Save listing'}
                        >
                          <Heart size={14} fill={listing.saved ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      <div className="results-listing-content">
                        <div className="listing-top-row">
                          <div>
                            <span className="location-badge">
                              {listing.neighborhood}, {listing.city}
                            </span>
                            <h3>{listing.title}</h3>
                            <div className="mini-specs">
                              <span>
                                <Bed size={13} /> {listing.beds} Bed
                              </span>
                              <span>
                                <Bath size={13} /> {listing.baths} Bath
                              </span>
                              <span>
                                <Maximize size={13} /> {listing.sizeSqm} sqm.
                              </span>
                            </div>
                          </div>

                          <div className="listing-price-right">
                            <strong>₱ {Number(listing.price).toLocaleString()}</strong>
                            <small>/month</small>
                          </div>
                        </div>

                        <div className="listing-bottom-row">
                          <span className="distance-text">
                            <MapPin size={13} /> {listing.university}
                          </span>

                          <button className="details-link-btn" type="button" onClick={() => navigate(`/listing/${listing.id}`)}>
                            <Eye size={14} /> View Details <ArrowUp size={12} className="arrow-tilt" />
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="empty-results">
                  <p>No homes match the selected filters.</p>
                  <button type="button" className="details-link-btn" onClick={handleClearFilters}>
                    Reset Filters
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;