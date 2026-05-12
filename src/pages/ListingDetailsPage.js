import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRentalData } from '../context/RentalDataContext';
import { useAuth } from '../context/AuthContext';
import ProfileMenu from '../components/ProfileMenu';
import LocationPickerMap from '../components/LocationPickerMap';
import { Home, Search, Heart, Bell, MapPin, Bed, Bath, Maximize, ArrowLeft, Mail, User } from 'lucide-react';
import { resolveListingImageUrl } from '../lib/listingImageUrl';
import './ListingDetailsPage.css';

const ListingDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { listings, toggleSaved, deleteListing } = useRentalData();
  const { user } = useAuth();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await deleteListing(listing.id);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete listing', err);
        alert('Failed to delete listing. Please try again.');
      }
    }
  };

  const listing = useMemo(() => {
    return listings.find(l => l.id === Number(id));
  }, [listings, id]);

  if (!listing) {
    return (
      <div className="dashboard-page">
        <main className="dashboard-content" style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Listing Not Found</h2>
          <button className="solid-btn" onClick={() => navigate(-1)}>Go Back</button>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page listing-details-page">
      <header className="results-topbar">
        <button className="results-brand" type="button" onClick={() => navigate('/dashboard')}>
          <div className="results-logo-wrap">
            <Home size={16} />
          </div>
          <span>RentBuddy</span>
        </button>

        <div className="results-actions">
          <button className="icon-btn" type="button" onClick={() => navigate('/saved-homes')}>
            <Heart size={18} />
          </button>
          <button className="icon-btn" type="button">
            <Bell size={18} />
          </button>
          <ProfileMenu />
        </div>
      </header>

      <main className="details-main-content">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to results
        </button>

        <div className="details-hero">
          {listing.imageUrls && listing.imageUrls.length > 0 ? (
            <img 
              className="details-main-image" 
              src={resolveListingImageUrl(listing.imageUrls[0])} 
              alt={listing.title} 
            />
          ) : (
            <div className="details-image-fallback">No image provided</div>
          )}
          <button
            className={`details-save-btn ${listing.saved ? 'saved' : ''}`}
            type="button"
            onClick={() => toggleSaved(listing)}
          >
            <Heart size={20} fill={listing.saved ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="details-info-container">
          <div className="details-header-row">
            <div>
              <span className="details-badge">{listing.hotspotLabel || 'Listing'}</span>
              <h1 className="details-title">{listing.title}</h1>
              <div className="details-location">
                <MapPin size={16} /> {listing.neighborhood}, {listing.city}
              </div>
            </div>
            <div className="details-price-box">
              <div className="price-amount">₱ {Number(listing.price).toLocaleString()}</div>
              <div className="price-period">/ month</div>
            </div>
          </div>

          <div className="details-specs-row">
            <div className="spec-item">
              <Bed size={20} />
              <div className="spec-text">
                <strong>{listing.beds}</strong>
                <span>Bedrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <Bath size={20} />
              <div className="spec-text">
                <strong>{listing.baths}</strong>
                <span>Bathrooms</span>
              </div>
            </div>
            <div className="spec-item">
              <Maximize size={20} />
              <div className="spec-text">
                <strong>{listing.sizeSqm}</strong>
                <span>Square Meters</span>
              </div>
            </div>
          </div>

          <div className="details-description">
            <h3>About this place</h3>
            <p>{listing.description || 'No description provided.'}</p>
            
            <div className="details-university">
              <strong>Preferred University:</strong> {listing.university}
            </div>

            {listing.latitude && listing.longitude && (
              <div className="details-map-section" style={{ marginTop: '24px' }}>
                <h3 style={{ marginBottom: '12px' }}>Exact Location</h3>
                <LocationPickerMap 
                  latitude={listing.latitude} 
                  longitude={listing.longitude} 
                  readOnly={true} 
                />
              </div>
            )}
          </div>

          <div className="landlord-section">
            <h3>Landlord Information</h3>
            <div className="landlord-card">
              <div className="landlord-avatar">
                <User size={24} />
              </div>
              <div className="landlord-info">
                <div className="landlord-name">{listing.landlordName || 'Unknown Landlord'}</div>
                <div className="landlord-email">
                  <Mail size={14} /> {listing.landlordEmail || 'No email provided'}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button className="solid-btn contact-btn" style={{ flex: 1 }}>Contact Landlord</button>
                {user && user.email && listing.landlordEmail && user.email.toLowerCase() === listing.landlordEmail.toLowerCase() && (
                  <button className="outline-btn" style={{ borderColor: '#e63946', color: '#e63946' }} onClick={handleDelete}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetailsPage;
