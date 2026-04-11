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
  Maximize
} from 'lucide-react';

const savedProperties = [
  {
    id: 1,
    name: 'Velez Boarding House',
    location: 'Capitol Site, Cebu City',
    price: '₱ 8,500/mo',
    beds: 1,
    baths: 1,
    sqm: 15,
    image: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Mabolo Student Flat',
    location: 'Mabolo, Cebu City',
    price: '₱ 9,200/mo',
    beds: 2,
    baths: 1,
    sqm: 22,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=900&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Talamban Garden Room',
    location: 'Talamban, Cebu City',
    price: '₱ 7,800/mo',
    beds: 1,
    baths: 1,
    sqm: 18,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1e5250a1df?q=80&w=900&auto=format&fit=crop'
  }
];

const SavedHomesPage = () => {
  const navigate = useNavigate();

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
          <button className="nav-item" onClick={() => navigate('/dashboard')}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/search-results')}>
            <Search size={18} />
            <span>Search Results</span>
          </button>
          <button className="nav-item active">
            <Heart size={18} />
            <span>Saved Homes</span>
          </button>
          <button className="nav-item" onClick={() => navigate('/my-contracts')}>
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

        <div className="dashboard-scroll-area">
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Saved Homes</h1>
              <p className="dashboard-subtitle">Your shortlisted student rentals in Cebu City.</p>
            </div>
          </div>

          <div className="listings-section">
            <h3 className="section-title">Favorites Collection</h3>

            <div className="listings-grid">
              {savedProperties.map((prop) => (
                <div className="listing-card" key={prop.id}>
                  <div className="listing-img" style={{ backgroundImage: `url(${prop.image})` }} />
                  <div className="listing-info">
                    <div className="listing-header-row">
                      <h4 className="listing-name">{prop.name}</h4>
                      <span className="listing-price">{prop.price}</span>
                    </div>

                    <div className="listing-location">
                      <MapPin size={14} /> {prop.location}
                    </div>

                    <div className="listing-specs">
                      <span>
                        <Bed size={14} /> {prop.beds} Beds
                      </span>
                      <span>
                        <Bath size={14} /> {prop.baths} Bath
                      </span>
                      <span>
                        <Maximize size={14} /> {prop.sqm} sqm.
                      </span>
                    </div>

                    <button className="view-details-btn">View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SavedHomesPage;
