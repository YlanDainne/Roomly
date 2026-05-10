import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
import {
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
import { campusOptions, getCampusByName } from '../data/cebuCampuses';
import { resolveListingImageUrl } from '../lib/listingImageUrl';
import ProfileMenu from '../components/ProfileMenu';

const notifications = [
  {
    id: 1,
    type: 'contract',
    title: 'Contract Approved',
    message: 'Your contract for Talamban Suite has been approved!',
    time: '2 hours ago',
    isRead: false
  },
  {
    id: 2,
    type: 'property',
    title: 'New Property Available',
    message: 'A new boarding house near USC is now available.',
    time: '1 day ago',
    isRead: false
  },
  {
    id: 3,
    type: 'reminder',
    title: 'Payment Reminder',
    message: 'Your monthly rent payment is due in 3 days.',
    time: '2 days ago',
    isRead: true
  },
  {
    id: 4,
    type: 'system',
    title: 'Welcome to RentBuddy',
    message: 'Thanks for joining! Start exploring properties near your campus.',
    time: '1 week ago',
    isRead: true
  }
];

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
  images: []
});

const DashboardPage = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { listings, hotspots, createListing, loading, error, toggleSaved } = useRentalData();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [searchPlace, setSearchPlace] = useState('');
  const [listingForm, setListingForm] = useState(createInitialForm);
  const [listingSubmitError, setListingSubmitError] = useState('');

  const topHotspots = useMemo(() => hotspots.slice(0, 4), [hotspots]);

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
    setListingSubmitError('');

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

    listingForm.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      await createListing(formData);
      setIsPostModalOpen(false);
      setListingForm(createInitialForm());
    } catch (submitError) {
      setListingSubmitError(submitError.message || 'Unable to publish listing. Please try again.');
    }
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
        </nav>

        <div className="sidebar-bottom">
          <button className="post-listing-btn" type="button" onClick={() => setIsPostModalOpen(true)}>
            <PlusCircle size={18} />
            <span>Post Listing</span>
          </button>
        </div>
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
            <div className="notification-container">
              <button className="icon-btn notification-btn" onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)} type="button">
                <Bell size={18} />
                {notifications.filter((notification) => !notification.isRead).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter((notification) => !notification.isRead).length}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <span className="notification-count">
                      {notifications.filter((notification) => !notification.isRead).length} new
                    </span>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div key={notification.id} className={`notification-item ${!notification.isRead ? 'unread' : ''}`}>
                        <div className="notification-icon">
                          {notification.type === 'contract' && <FileText size={16} />}
                          {notification.type === 'property' && <Home size={16} />}
                          {notification.type === 'reminder' && <Bell size={16} />}
                          {notification.type === 'system' && <Settings size={16} />}
                        </div>
                        <div className="notification-content">
                          <div className="notification-title">{notification.title}</div>
                          <div className="notification-message">{notification.message}</div>
                          <div className="notification-time">{notification.time}</div>
                        </div>
                        {!notification.isRead && <div className="notification-dot" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
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
            <div className="stat-card add-listing-card">
              <div className="stat-card-header">
                <span>Post Listing</span>
                <PlusCircle size={20} className="stat-icon" />
              </div>
              <div className="stat-number">Landlords</div>
              <div className="stat-desc">Add your own Cebu rental and photos</div>
            </div>
          </div>

          <section className="listings-section">
            <div className="section-header-row">
              <h3 className="section-title">Trending hotspots</h3>
              <button className="view-details-btn" type="button" onClick={() => navigate('/search-results?view=map')}>
                View on map <ArrowRight size={14} />
              </button>
            </div>

            {loading ? (
              <div className="dashboard-empty-state">Loading live listings from the backend...</div>
            ) : topHotspots.length > 0 ? (
              <div className="hotspot-grid">
                {topHotspots.map((hotspot) => (
                  <article key={hotspot.name} className="hotspot-card">
                    <span className="hotspot-label">{hotspot.type}</span>
                    <h4>{hotspot.name}</h4>
                    <p>{hotspot.count} active listing{hotspot.count === 1 ? '' : 's'}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="dashboard-empty-state">
                No hotspots yet. Add a rental listing to start building the Cebu map.
              </div>
            )}
          </section>

          <section className="listings-section">
            <div className="section-header-row">
              <h3 className="section-title">Available Near You</h3>
              <button className="view-details-btn" type="button" onClick={() => navigate('/search-results')}>
                Open search results <ArrowRight size={14} />
              </button>
            </div>

            {error && <div className="dashboard-empty-state error-state">{error}</div>}

            {listings.length > 0 ? (
              <div className="listings-grid">
                {listings.map((listing) => (
                  <div className="listing-card" key={listing.id}>
                    <div className="listing-img-wrap">
                      {listing.imageUrls && listing.imageUrls[0] ? (
                        <img className="listing-img" src={resolveListingImageUrl(listing.imageUrls[0])} alt={listing.title} />
                      ) : (
                        <div className="listing-img listing-img-empty">No image yet</div>
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
                No listings yet. Use Post Listing to add your first rental place.
              </div>
            )}
          </section>
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

            <form className="post-listing-form" onSubmit={handleListingSubmit}>
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
              </div>

              {listingSubmitError && <p className="dashboard-empty-state error-state">{listingSubmitError}</p>}

              <div className="post-modal-actions">
                <button className="outline-btn" type="button" onClick={() => setIsPostModalOpen(false)}>
                  Cancel
                </button>
                <button className="solid-btn" type="submit">
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


    </div>
  );
};

export default DashboardPage;