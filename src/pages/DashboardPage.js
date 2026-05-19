import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import {
  AlertCircle,
  Home,
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  PlusCircle,
  Bell,
  TrendingUp,
  MapPin,
  Bed,
  Bath,
  Maximize,
  X,
  User,
  Settings,
  LogOut,
  Map,
  ArrowRight
} from 'lucide-react';
import { useRentalData } from '../context/RentalDataContext';
import { useAuth } from '../context/AuthContext';
import { rentalApi } from '../services/rentalApi';
import { campusOptions, getCampusByName, campusCatalog } from '../data/cebuCampuses';
import ProfileMenu from '../components/ProfileMenu';
import NotificationMenu from '../components/NotificationMenu';
import LocationPickerMap from '../components/LocationPickerMap';
import { usePopup } from '../context/PopupContext';



const createInitialForm = () => ({
  title: '',
  city: 'Cebu City',
  neighborhood: '',
  university: '',
  price: '',
  beds: '',
  baths: '',
  sizeSqm: '',
  description: '',
  latitude: '',
  longitude: '',
  images: []
});

const DashboardPage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { listings, hotspots, createListing, loading, error, toggleSaved } = useRentalData();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchPlace, setSearchPlace] = useState('');
  const [listingForm, setListingForm] = useState(createInitialForm);
  const [listingSubmitError, setListingSubmitError] = useState('');
  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { showPopup } = usePopup();
  const submitLockRef = useRef(false);

  const topHotspots = useMemo(() => hotspots.slice(0, 4), [hotspots]);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userProfile = await rentalApi.getMe();
        setIsAdmin(userProfile?.role === 'admin');
      } catch (err) {
        setIsAdmin(false);
      }
    };
    checkAdminStatus();
  }, []);

  const handleListingChange = (event) => {
    const { name, value, files } = event.target;

    if (name === 'images') {
      setListingForm((previous) => ({
        ...previous,
        images: Array.from(files || [])
      }));
      return;
    }

    if (name === 'university') {
      const campus = getCampusByName(value);
      setListingForm((previous) => ({
        ...previous,
        university: value,
        city: campus?.city || previous.city,
        neighborhood: campus?.neighborhood || previous.neighborhood
      }));
      return;
    }

    setListingForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleListingSubmit = async (event) => {
    event.preventDefault();
    if (submitLockRef.current || isSubmitting) {
      setShowLoadingPopup(true);
      return;
    }

    submitLockRef.current = true;
    setIsSubmitting(true);
    setListingSubmitError('');
    setShowLoadingPopup(false);

    const formData = new FormData();
    formData.append('title', listingForm.title);
    formData.append('city', listingForm.city);
    formData.append('neighborhood', listingForm.neighborhood);
    formData.append('university', listingForm.university);
    formData.append('price', listingForm.price);
    formData.append('beds', listingForm.beds);
    formData.append('baths', listingForm.baths);
    formData.append('sizeSqm', listingForm.sizeSqm);
    formData.append('description', listingForm.description);
    if (listingForm.latitude !== '' && listingForm.longitude !== '') {
      formData.append('latitude', String(listingForm.latitude));
      formData.append('longitude', String(listingForm.longitude));
    }

    listingForm.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await createListing(formData);
      setIsPostModalOpen(false);
      setListingForm(createInitialForm());
      showPopup('Listing successfully posted!', 'Success');
    } catch (submitError) {
      setListingSubmitError(submitError.message || 'Unable to publish listing. Please try again.');
    } finally {
      submitLockRef.current = false;
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = ({ latitude, longitude }) => {
    // Calculate distance using Haversine formula
    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    let nearestCampus = null;
    let minDistance = Infinity;

    campusCatalog.forEach(campus => {
      const dist = getDistance(latitude, longitude, campus.latitude, campus.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestCampus = campus;
      }
    });

    setListingForm((prev) => {
      const updates = { latitude, longitude };
      
      // Auto-fill blanks if the nearest school is within 5 kilometers
      if (nearestCampus && minDistance <= 5) {
        updates.university = nearestCampus.name;
        updates.city = nearestCampus.city;
        updates.neighborhood = nearestCampus.neighborhood;
      }
      
      return { ...prev, ...updates };
    });
  };

  const handleExplore = () => {
    const query = searchPlace.trim();
    navigate(query ? `/search-results?query=${encodeURIComponent(query)}&view=map` : '/search-results?view=map');
  };



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
          <button className="nav-item active">
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/search-results')}>
            <Search size={18} />
            <span>Search Results</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/saved-homes')}>
            <Heart size={18} />
            <span>Saved Homes</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-contracts')}>
            <FileText size={18} />
            <span>My Contracts</span>
          </button>
          {isAdmin && (
            <button className="nav-item admin-nav-item" onClick={() => navigate('/admin/dashboard')}>
              <AlertCircle size={18} />
              <span>Admin Dashboard</span>
            </button>
          )}
        </nav>
      </aside>

      <main className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-search">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search a campus or barangay"
              value={searchPlace}
              onChange={(event) => setSearchPlace(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleExplore();
                }
              }}
            />
          </div>

          <div className="header-actions">
            <button className="icon-btn" type="button" onClick={() => navigate('/saved-homes')} aria-label="Saved homes">
              <Heart size={18} />
            </button>
            <NotificationMenu />
            <ProfileMenu />
          </div>
        </header>

        <div className="dashboard-scroll-area">
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Student Homes in Cebu</h1>
              <p className="dashboard-subtitle">
                Add a listing, browse hotspots, and open the Cebu map for any campus or area.
              </p>
            </div>
            <div className="title-actions">
              <button className="outline-btn" type="button" onClick={() => navigate('/search-results?view=map')}>
                <Map size={16} /> Map View
              </button>
              <button className="solid-btn" type="button" onClick={() => setIsPostModalOpen(true)}>
                <PlusCircle size={16} /> Post Listing
              </button>
            </div>
          </div>

          <section className="hero-banner">
            <div className="hero-badge">Search & discover</div>
            <h2 className="hero-title">Search a place and open map view</h2>
            <p className="hero-subtitle">
              Browse rentals around Cebu, then open Search Results map view when you are ready to explore locations.
            </p>

            <div className="hero-search-box">
              <MapPin size={18} className="hero-search-icon" />
              <input
                type="text"
                placeholder="USC Talamban Campus, Banilad, Colon, or Mambaling"
                value={searchPlace}
                onChange={(event) => setSearchPlace(event.target.value)}
              />
              <button className="explore-btn" type="button" onClick={handleExplore}>
                Explore
              </button>
            </div>
          </section>

          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-header">
                <span>Saved Homes</span>
                <Heart size={20} className="stat-icon" />
              </div>
              <div className="stat-number">{listings.filter((listing) => listing.saved).length}</div>
              <div className="stat-desc">Homes you have already saved</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span>Hotspots</span>
                <TrendingUp size={20} className="stat-icon" />
              </div>
              <div className="stat-number">{hotspots.length}</div>
              <div className="stat-desc">Busy rental areas around Cebu</div>
            </div>

        </div>
        </div>
      </main>

      {isPostModalOpen && (
        <div className="post-modal-overlay" role="presentation" onClick={() => setIsPostModalOpen(false)}>
          <div
            className="post-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="post-listing-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="post-modal-header">
              <div>
                <h2 id="post-listing-title">Post a New Listing</h2>
                <p>Landlords can add rental details and upload photos for publishing.</p>
              </div>

              <button className="post-modal-close" type="button" onClick={() => setIsPostModalOpen(false)}>
                <X size={16} />
              </button>
            </div>

            <form className="post-listing-form" onSubmit={handleListingSubmit} style={{ position: 'relative' }}>
              {isSubmitting && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.85)', zIndex: 100,
                  display: 'flex', justifyContent: 'center', alignItems: 'center',
                  flexDirection: 'column', borderRadius: '8px'
                }}>
                  <div style={{
                    width: '40px', height: '40px', border: '4px solid #f3f3f3', 
                    borderTop: '4px solid #e63946', borderRadius: '50%', 
                    animation: 'spin 1s linear infinite'
                  }}></div>
                  <h3 style={{ marginTop: '16px', color: '#1a1a1a' }}>Posting your listing...</h3>
                </div>
              )}
              <div className="post-form-grid">
                <label className="post-field">
                  <span>Property Name</span>
                  <input
                    name="title"
                    type="text"
                    placeholder="e.g. USC Talamban Suites"
                    value={listingForm.title}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>University / Campus</span>
                  <select name="university" value={listingForm.university} onChange={handleListingChange} required>
                    <option value="">Select a campus</option>
                    {campusOptions
                      .filter((option) => option !== 'All Universities')
                      .map((campus) => (
                        <option key={campus} value={campus}>
                          {campus}
                        </option>
                      ))}
                  </select>
                </label>

                <label className="post-field">
                  <span>City</span>
                  <input name="city" type="text" value={listingForm.city} onChange={handleListingChange} required />
                </label>

                <label className="post-field">
                  <span>Neighborhood</span>
                  <input
                    name="neighborhood"
                    type="text"
                    placeholder="e.g. Talamban"
                    value={listingForm.neighborhood}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Monthly Rent (PHP)</span>
                  <input
                    name="price"
                    type="number"
                    min="0"
                    placeholder="8500"
                    value={listingForm.price}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Bedrooms</span>
                  <input
                    name="beds"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={listingForm.beds}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Bathrooms</span>
                  <input
                    name="baths"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={listingForm.baths}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Floor Area (sqm)</span>
                  <input
                    name="sizeSqm"
                    type="number"
                    min="0"
                    placeholder="15"
                    value={listingForm.sizeSqm}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field post-field-wide">
                  <span>Images</span>
                  <input name="images" type="file" accept="image/*" multiple onChange={handleListingChange} />
                  <small>You can upload more than one photo.</small>
                </label>

                <label className="post-field post-field-wide">
                  <span>Description</span>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Describe the room, rules, and amenities."
                    value={listingForm.description}
                    onChange={handleListingChange}
                  />
                </label>

                <label className="post-field post-field-wide">
                  <span>Pin Location on Map</span>
                  <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '8px' }}>
                    Click on the map to set the exact location of the property.
                  </p>
                  <LocationPickerMap 
                    latitude={listingForm.latitude} 
                    longitude={listingForm.longitude} 
                    onLocationSelect={handleLocationSelect} 
                  />
                </label>
              </div>

              {listingSubmitError && <p className="dashboard-empty-state error-state">{listingSubmitError}</p>}

              <div className="post-modal-actions">
                <button className="outline-btn" type="button" onClick={() => setIsPostModalOpen(false)}>
                  Cancel
                </button>
                <button className="solid-btn" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing...' : 'Publish Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLoadingPopup && (
        <div className="dashboard-popup-overlay" role="presentation" onClick={() => setShowLoadingPopup(false)}>
          <div
            className="dashboard-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="listing-loading-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="dashboard-popup-close"
              aria-label="Close loading notice"
              onClick={() => setShowLoadingPopup(false)}
            >
              <X size={16} />
            </button>

            <div className="dashboard-popup-header">
              <div className="dashboard-popup-icon">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 id="listing-loading-title">Posting listing</h2>
                <p>Your listing is still uploading. Please wait for the current submission to finish.</p>
              </div>
            </div>

            <div className="dashboard-popup-body">
              <h3>Why this appears</h3>
              <p>Clicking Publish again before the upload finishes can create duplicate listings.</p>
            </div>

            <div className="dashboard-popup-actions">
              <button type="button" className="dashboard-popup-button" onClick={() => setShowLoadingPopup(false)}>
                Got it
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
};

export default DashboardPage;