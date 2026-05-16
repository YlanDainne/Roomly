import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  DollarSign,
  CheckCircle2
} from 'lucide-react';
import ProfileMenu from '../components/ProfileMenu';
import { rentalApi } from '../services/rentalApi';

const CONTRACT_STORAGE_KEY = 'roomly-open-contracts';

const MyContractsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    const loadContracts = async () => {
      try {
        const res = await rentalApi.getMyContractProposals();
        setContracts(Array.isArray(res) ? res : []);
      } catch (error) {
        console.warn('Unable to load contract proposals:', error);
        setContracts([]);
      }
    };

    loadContracts();
  }, [searchParams]);

  const cancelProposal = async (proposalId) => {
    const confirmed = window.confirm('Cancel this contract proposal?');
    if (!confirmed) return;

    try {
      await rentalApi.deleteContractProposal(proposalId);
      setContracts((prev) => prev.filter((c) => c.id !== proposalId));
    } catch (error) {
      console.error('Failed to cancel proposal:', error);
      alert(error.message || 'Unable to cancel proposal.');
    }
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
            <ProfileMenu />
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
            {contracts.length > 0 ? contracts.map((item) => (
              <article className="contract-card" key={item.id}>
                <div className="contract-top">
                  <div>
                    <h3>{item.listingTitle}</h3>
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
                    <DollarSign size={14} /> Proposed price: ₱ {item.proposedPrice ? Number(item.proposedPrice).toLocaleString() : '—'}
                  </span>
                  <span>
                    <CalendarDays size={14} /> Viewing date: {item.viewingDate || 'Not set'}
                  </span>
                  <span>
                    <Clock3 size={14} /> Viewing time: {item.viewingTime || 'Not set'}
                  </span>
                  <span>
                    <CheckCircle2 size={14} /> {item.moveInTimeline || 'Timeline not set'}
                  </span>
                </div>

                <div className="contract-actions-row">
                  <button className="view-details-btn" type="button" onClick={() => navigate(`/contract/${item.listingId}`)}>
                    Open Contract
                  </button>
                  <button className="outline-btn danger-btn" type="button" onClick={() => cancelProposal(item.id)}>
                    Cancel Proposal
                  </button>
                </div>
              </article>
            )) : (
              <div className="dashboard-empty-state">
                No open contracts yet. Choose a listing and tap Open Contract to send a proposal.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyContractsPage;
