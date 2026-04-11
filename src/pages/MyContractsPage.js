import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyContractsPage.css';
import {
  Home,
  LayoutDashboard,
  Search,
  Heart,
  FileText,
  Bell,
  MapPin,
  CalendarDays,
  Clock3,
  CheckCircle2
} from 'lucide-react';

const contracts = [
  {
    id: 1,
    title: 'Talamban Studio Lease',
    address: 'Talamban, Cebu City',
    startDate: 'Apr 20, 2026',
    endDate: 'Apr 19, 2027',
    status: 'Pending Approval'
  },
  {
    id: 2,
    title: 'Capitol Site Boarding',
    address: 'Capitol Site, Cebu City',
    startDate: 'Jan 10, 2026',
    endDate: 'Jan 09, 2027',
    status: 'Active'
  }
];

const MyContractsPage = () => {
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
          <button className="nav-item" onClick={() => navigate('/saved-homes')}>
            <Heart size={18} />
            <span>Saved Homes</span>
          </button>
          <button className="nav-item active">
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
              <h1 className="dashboard-title">My Contracts</h1>
              <p className="dashboard-subtitle">Track your rental agreements and their current status.</p>
            </div>
          </div>

          <section className="contracts-grid">
            {contracts.map((item) => (
              <article className="contract-card" key={item.id}>
                <div className="contract-top">
                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      <MapPin size={14} /> {item.address}
                    </p>
                  </div>
                  <span className={`contract-badge ${item.status === 'Active' ? 'active' : 'pending'}`}>
                    {item.status}
                  </span>
                </div>

                <div className="contract-meta">
                  <span>
                    <CalendarDays size={14} /> Start: {item.startDate}
                  </span>
                  <span>
                    <Clock3 size={14} /> End: {item.endDate}
                  </span>
                  <span>
                    <CheckCircle2 size={14} /> Digital contract ready
                  </span>
                </div>

                <button className="view-details-btn">Open Contract</button>
              </article>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyContractsPage;
