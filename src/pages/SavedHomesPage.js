import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SavedHomesPage.css';
import {
  Home,
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  Bell,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ArrowUpRight
} from 'lucide-react';
import { useRentalData } from '../context/RentalDataContext';
import { resolveListingImageUrl } from '../lib/listingImageUrl';
import ProfileMenu from '../components/ProfileMenu';

const SavedHomesPage = () => {
  const navigate = useNavigate();
  const { savedHomes, toggleSaved } = useRentalData();

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <button className="sidebar-brand" type="button" onClick={() => navigate('/dashboard')}>
          <div className="brand-logo">
            <div className="logo-icon">
              <Home size={16} />
            </div>
          </div>
          <span className="brand-name">RentBuddy</span>
        </button>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/dashboard')} type="button">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/search-results')} type="button">
            <Search size={18} />
            <span>Search Results</span>
          </button>
          <button className="nav-item active" type="button">
            <Heart size={18} />
            <span>Saved Homes</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-contracts')} type="button">
            <FileText size={18} />
            <span>My Contracts</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Find your perfect home.." />
          </div>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Saved homes" type="button">
              <Heart size={18} />
            </button>
            <button className="icon-btn" aria-label="Notifications" type="button">
              <Bell size={18} />
            </button>
            <ProfileMenu />
          </div>
        </header>

        <div className="dashboard-scroll-area">
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Saved Homes</h1>
              <p className="dashboard-subtitle">Your saved Cebu rentals will appear here.</p>
            </div>
          </div>

          <div className="listings-section">
            <div className="section-header-row">
              <h3 className="section-title">Favorites Collection</h3>
              <button className="view-details-btn" type="button" onClick={() => navigate('/search-results')}>
                Browse more <ArrowUpRight size={14} />
              </button>
            </div>

            {savedHomes.length > 0 ? (
              <div className="listings-grid">
                {savedHomes.map((listing) => (
                  <div className="listing-card" key={listing.id}>
                    <div className="listing-img-wrap">
                      {listing.imageUrls && listing.imageUrls[0] ? (
                        <img className="listing-img" src={resolveListingImageUrl(listing.imageUrls[0])} alt={listing.title} />
                      ) : (
                        <div className="listing-img listing-img-empty">No image yet</div>
                      )}
                      <button className="listing-save-btn saved" type="button" onClick={() => toggleSaved(listing)}>
                        <Heart size={14} fill="currentColor" />
                      </button>
                    </div>

                    <div className="listing-info">
                      <div className="listing-header-row">
                        <h4 className="listing-name">{listing.title}</h4>
                        <span className="listing-price">₱ {Number(listing.price).toLocaleString()}</span>
                      </div>

                      <div className="listing-location">
                        <MapPin size={14} /> {listing.neighborhood}, {listing.city}
                      </div>

                      <div className="listing-specs">
                        <span>
                          <Bed size={14} /> {listing.beds} Beds
                        </span>
                        <span>
                          <Bath size={14} /> {listing.baths} Bath
                        </span>
                        <span>
                          <Maximize size={14} /> {listing.sizeSqm} sqm.
                        </span>
                      </div>

                      <button className="view-details-btn" type="button" onClick={() => navigate(`/listing/${listing.id}`)}>
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                No saved homes yet. Tap the heart on any listing to keep it here.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedHomesPage;