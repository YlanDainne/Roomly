import React, { useState, useEffect, useRef } from 'react';
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
  LogOut
} from 'lucide-react';

const properties = [
  {
    id: 1,
    name: "Near Mambaling Fly Over",
    location: "Mambaling, Cebu City",
    price: "₱ 8,500/mo",
    beds: 4,
    baths: 1,
    sqm: 30,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "N. Bacalso Ave. Cebu City",
    location: "Mambaling, Cebu City",
    price: "₱ 8,000/mo",
    beds: 3,
    baths: 1,
    sqm: 25,
    image: "https://images.unsplash.com/photo-1502672260266-1c1e5250a1df?q=80&w=800&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Velez Boarding House",
    location: "Capitol Site, Cebu City",
    price: "₱ 8,500/mo",
    beds: 1,
    baths: 1,
    sqm: 15,
    image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800&auto=format&fit=crop"
  }
];

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

const DashboardPage = () => {
  const navigate = useNavigate();
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [listingForm, setListingForm] = useState({
    propertyName: '',
    city: 'Cebu City',
    neighborhood: '',
    monthlyRent: '',
    bedrooms: '',
    bathrooms: '',
    floorArea: '',
    amenities: '',
    description: ''
  });

  // Handle clicking outside dropdowns to close them
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenPostModal = () => {
    setIsPostModalOpen(true);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const handleListingChange = (event) => {
    const { name, value } = event.target;
    setListingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleListingSubmit = (event) => {
    event.preventDefault();
    setIsPostModalOpen(false);
    setListingForm({
      propertyName: '',
      city: 'Cebu City',
      neighborhood: '',
      monthlyRent: '',
      bedrooms: '',
      bathrooms: '',
      floorArea: '',
      amenities: '',
      description: ''
    });
  };

  const handleLogoutClick = () => {
    setIsProfileDropdownOpen(false);
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    // Add your logout logic here (clear tokens, redirect to login, etc.)
    console.log('User logged out');
    // For now, just navigate to login page
    navigate('/login');
  };

  const handleCancelLogout = () => {
    setIsLogoutConfirmOpen(false);
  };

  const handleNotificationClick = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsProfileDropdownOpen(false); // Close profile dropdown if open
  };

  const handleMarkAsRead = (notificationId) => {
    // In a real app, this would update the notification status
    console.log('Marking notification as read:', notificationId);
  };

  return (
    <div className="dashboard-page">
      
      {/* Sidebar Navigation */}
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
            <LayoutDashboard size={18}/> 
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/search-results')}>
            <Search size={18}/>
            <span>Search Results</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/saved-homes')}>
            <Heart size={18}/>
            <span>Saved Homes</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-contracts')}>
            <FileText size={18}/>
            <span>My Contracts</span>
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="post-listing-btn" type="button" onClick={handleOpenPostModal}>
            <PlusCircle size={18}/> 
            <span>Post Listing</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-content">
        
        {/* Top Search & Actions */}
        <header className="dashboard-header">
          <div className="header-search">
            <Search size={16} className="search-icon" />
            <input type="text" placeholder="Find your perfect home.." />
          </div>
          
          <div className="header-actions">
            <button className="icon-btn"><Heart size={18}/></button>
            <div className="notification-container" ref={notificationRef}>
              <button className="icon-btn notification-btn" onClick={handleNotificationClick}>
                <Bell size={18}/>
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              {isNotificationDropdownOpen && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Notifications</h3>
                    <span className="notification-count">
                      {notifications.filter(n => !n.isRead).length} new
                    </span>
                  </div>
                  <div className="notification-list">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
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
                        {!notification.isRead && <div className="notification-dot"></div>}
                      </div>
                    ))}
                  </div>
                  <div className="notification-footer">
                    <button className="view-all-btn">View All Notifications</button>
                  </div>
                </div>
              )}
            </div>
            <div className="profile-container" ref={profileRef}>
              <button 
                className="profile-pic"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                type="button"
              >
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User Profile" />
              </button>
              {isProfileDropdownOpen && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-header">
                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User Profile" />
                    <div>
                      <p className="profile-name">John Doe</p>
                      <p className="profile-email">john.doe@example.com</p>
                    </div>
                  </div>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item">
                    <User size={16} />
                    <span>View Profile</span>
                  </button>
                  <button className="profile-dropdown-item">
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item logout-btn" onClick={handleLogoutClick}>
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="dashboard-scroll-area">
          {/* Title Area */}
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Student Homes in Cebu City</h1>
              <p className="dashboard-subtitle">Showing 148 verified listing near your selected campus.</p>
            </div>
            <div className="title-actions">
              <button className="outline-btn"><TrendingUp size={16}/> Trending</button>
              <button className="solid-btn">Map View</button>
            </div>
          </div>

          {/* Hero Banner Area */}
          <div className="hero-banner">
            <div className="hero-badge">Active in Cebu City</div>
            <h2 className="hero-title">Find your home near campus</h2>
            <p className="hero-subtitle">Search your verified student-friendly rentals near USC, UC, CDU, and Velez College.</p>
            
            <div className="hero-search-box">
              <MapPin size={18} className="hero-search-icon" />
              <input type="text" placeholder="USC Talamban Campus" defaultValue="USC Talamban Campus" />
              <button className="explore-btn">Explore</button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-cards">
            <div className="stat-card">
              <div className="stat-card-header">
                <span>Saved Homes</span>
                <Heart size={20} className="stat-icon"/>
              </div>
              <div className="stat-number">12</div>
              <div className="stat-desc">Properties you liked in Cebu</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-header">
                <span>Active Contracts</span>
                <FileText size={20} className="stat-icon"/>
              </div>
              <div className="stat-number">1</div>
              <div className="stat-desc">Pending approval for Talamban Suite</div>
            </div>
            <div className="stat-card add-listing-card">
              <div className="stat-card-header">
                <span>Post Listing</span>
                <PlusCircle size={20} className="stat-icon"/>
              </div>
              <div className="stat-number">Landlords</div>
              <div className="stat-desc">Click to list Cebu property</div>
            </div>
          </div>

          {/* Available Near You Listings Grid */}
          <div className="listings-section">
            <h3 className="section-title">Available Near You</h3>
            
            <div className="listings-grid">
              {properties.map((prop) => (
                <div className="listing-card" key={prop.id}>
                  <div className="listing-img" style={{backgroundImage: `url(${prop.image})`}}></div>
                  <div className="listing-info">
                    
                    <div className="listing-header-row">
                      <h4 className="listing-name">{prop.name}</h4>
                      <span className="listing-price">{prop.price}</span>
                    </div>
                    
                    <div className="listing-location">
                      <MapPin size={14}/> {prop.location}
                    </div>
                    
                    <div className="listing-specs">
                      <span><Bed size={14}/> {prop.beds} Beds</span>
                      <span><Bath size={14}/> {prop.baths} Bath</span>
                      <span><Maximize size={14}/> {prop.sqm} sqm.</span>
                    </div>
                    
                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </main>

      {isPostModalOpen && (
        <div className="post-modal-overlay" role="presentation" onClick={handleClosePostModal}>
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
                <p>Landlords can add rental details for review and publishing.</p>
              </div>

              <button className="post-modal-close" type="button" onClick={handleClosePostModal}>
                <X size={16} />
              </button>
            </div>

            <form className="post-listing-form" onSubmit={handleListingSubmit}>
              <div className="post-form-grid">
                <label className="post-field">
                  <span>Property Name</span>
                  <input
                    name="propertyName"
                    type="text"
                    placeholder="e.g. Velez Boarding House"
                    value={listingForm.propertyName}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>City</span>
                  <input
                    name="city"
                    type="text"
                    value={listingForm.city}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Neighborhood</span>
                  <input
                    name="neighborhood"
                    type="text"
                    placeholder="e.g. Lahug"
                    value={listingForm.neighborhood}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Monthly Rent (PHP)</span>
                  <input
                    name="monthlyRent"
                    type="number"
                    min="0"
                    placeholder="8500"
                    value={listingForm.monthlyRent}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Bedrooms</span>
                  <input
                    name="bedrooms"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={listingForm.bedrooms}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Bathrooms</span>
                  <input
                    name="bathrooms"
                    type="number"
                    min="0"
                    placeholder="1"
                    value={listingForm.bathrooms}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field">
                  <span>Floor Area (sqm)</span>
                  <input
                    name="floorArea"
                    type="number"
                    min="0"
                    placeholder="15"
                    value={listingForm.floorArea}
                    onChange={handleListingChange}
                    required
                  />
                </label>

                <label className="post-field post-field-wide">
                  <span>Amenities</span>
                  <input
                    name="amenities"
                    type="text"
                    placeholder="WiFi, Air Conditioning, 24/7 Security"
                    value={listingForm.amenities}
                    onChange={handleListingChange}
                  />
                </label>
              </div>

              <label className="post-field">
                <span>Description</span>
                <textarea
                  name="description"
                  rows="4"
                  placeholder="Tell students what makes this place a great fit."
                  value={listingForm.description}
                  onChange={handleListingChange}
                  required
                />
              </label>

              <div className="post-form-actions">
                <button type="button" className="outline-btn" onClick={handleClosePostModal}>
                  Cancel
                </button>
                <button type="submit" className="solid-btn">Submit Listing</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div className="logout-confirm-overlay" role="presentation" onClick={handleCancelLogout}>
          <div
            className="logout-confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="logout-confirm-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-confirm-header">
              <div>
                <h2 id="logout-confirm-title">Confirm Logout</h2>
                <p>Are you sure you want to log out of your account?</p>
              </div>
            </div>

            <div className="logout-confirm-actions">
              <button type="button" className="outline-btn" onClick={handleCancelLogout}>
                Cancel
              </button>
              <button type="button" className="logout-confirm-btn" onClick={handleConfirmLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
