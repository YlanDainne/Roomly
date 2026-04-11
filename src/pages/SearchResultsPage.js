import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchResultsPage.css';
import {
  Home,
  Search,
  Heart,
  Bell,
  Funnel,
  MapPin,
  ChevronDown,
  Bed,
  Bath,
  Maximize,
  Eye,
  Map,
  SlidersHorizontal,
  ArrowUp
} from 'lucide-react';

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const neighborhoods = ['Mabolo', 'Lahug', 'Talamban', 'Banilad'];
  const amenities = ['High-speed WiFi', 'Air Conditioning', '24/7 Security'];

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
          <input type="text" placeholder="Find your perfect home.." />
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
            <button className="filters-clear-btn">Clear All</button>
          </div>

          <section className="filter-block">
            <h3>Location</h3>
            <label className="filter-label">City</label>
            <div className="chip-input">
              <MapPin size={14} /> Cebu City
            </div>

            <label className="filter-label">Neighborhoods</label>
            <div className="check-list">
              {neighborhoods.map((name) => (
                <label key={name} className="check-item">
                  <input type="checkbox" defaultChecked={name !== 'Banilad'} />
                  <span>{name}</span>
                </label>
              ))}
            </div>
            <button className="show-more-btn">+ Show 8 more</button>
          </section>

          <section className="filter-block">
            <h3>Academic Proximity</h3>
            <label className="filter-label">Preferred University</label>
            <button className="select-field">
              <span>Velez College</span>
              <ChevronDown size={14} />
            </button>

            <div className="range-header">
              <span>Max Distance (walk)</span>
              <span className="range-value">15 mins</span>
            </div>
            <input type="range" min="5" max="30" defaultValue="15" />
          </section>

          <section className="filter-block">
            <h3>Budget (PHP)</h3>
            <div className="budget-grid">
              <div className="budget-box">₱ 5,000</div>
              <div className="budget-box">₱ 25,000</div>
            </div>
            <input type="range" min="5000" max="25000" defaultValue="8500" step="500" />
          </section>

          <section className="filter-block">
            <h3>Amenities</h3>
            <label className="filter-label">Essential Features</label>
            <div className="check-list">
              {amenities.map((name) => (
                <label key={name} className="check-item">
                  <input type="checkbox" defaultChecked />
                  <span>{name}</span>
                </label>
              ))}
            </div>
          </section>

          <button className="apply-filters-btn">Apply Filters</button>
        </aside>

        <main className="results-main">
          <div className="results-headline-row">
            <div>
              <h1>Student Homes in Cebu City</h1>
              <p>Showing 148 verified listing near your selected campus</p>
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

          <section className="results-listing-section">
            <h2>Top Recommendations</h2>

            <article className="results-listing-card">
              <img
                src="https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=900&auto=format&fit=crop"
                alt="Velez boarding house"
              />

              <div className="results-listing-content">
                <div className="listing-top-row">
                  <div>
                    <span className="location-badge">Capitol Site, Cebu City</span>
                    <h3>Velez Boarding House</h3>
                    <div className="mini-specs">
                      <span><Bed size={13} /> 1 Bed</span>
                      <span><Bath size={13} /> 1 Bath</span>
                      <span><Maximize size={13} /> 15 sqm.</span>
                    </div>
                  </div>

                  <div className="listing-price-right">
                    <strong>₱ 8,500</strong>
                    <small>/month</small>
                  </div>
                </div>

                <div className="listing-bottom-row">
                  <span className="distance-text">
                    <MapPin size={13} /> 500 m to Velez College
                  </span>

                  <button className="details-link-btn">
                    <Eye size={14} /> View Details <ArrowUp size={12} className="arrow-tilt" />
                  </button>
                </div>
              </div>
            </article>
          </section>
        </main>
      </div>
    </div>
  );
};

export default SearchResultsPage;
