import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRentalData } from '../context/RentalDataContext';
import ProfileMenu from '../components/ProfileMenu';
import NotificationMenu from '../components/NotificationMenu';
import { resolveListingImageUrl } from '../lib/listingImageUrl';
import { ArrowLeft, CalendarDays, Clock3, Home, Heart, MapPin, HandCoins, BadgeDollarSign, Eye } from 'lucide-react';
import { rentalApi } from '../services/rentalApi';
import { usePopup } from '../context/PopupContext';
import './OpenContractPage.css';

const CONTRACT_STORAGE_KEY = 'roomly-open-contracts';

const getStoredContracts = () => {
  try {
    const raw = window.localStorage.getItem(CONTRACT_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.warn('Unable to read stored contracts:', error);
    return [];
  }
};

const saveStoredContracts = (contracts) => {
  try {
    window.localStorage.setItem(CONTRACT_STORAGE_KEY, JSON.stringify(contracts));
  } catch (error) {
    console.warn('Unable to save contract proposal:', error);
  }
};

const OpenContractPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { listings } = useRentalData();
  const listing = useMemo(() => listings.find((item) => item.id === Number(id)), [listings, id]);
  const [formState, setFormState] = useState(() => ({
    proposedPrice: listing ? listing.price : '',
    viewingDate: '',
    viewingTime: '',
    moveInTimeline: 'Within 30 days',
    message: '',
  }));
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState(null);
  const { showPopup } = usePopup();

  const updateField = (field, value) => {
    setFormState((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      showPopup('You must be logged in to open a contract.', 'Authentication Required');
      return;
    }

    if (!listing) {
      showPopup('Listing not found.', 'Error');
      return;
    }

    if (user.email && listing.landlordEmail && user.email.toLowerCase() === listing.landlordEmail.toLowerCase()) {
      showPopup('You cannot submit a proposal to your own listing.', 'Action Not Allowed');
      return;
    }

    const contractProposal = {
      id: `${listing.id}-${Date.now()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      address: `${listing.neighborhood}, ${listing.city}`,
      landlordName: listing.landlordName,
      landlordEmail: listing.landlordEmail,
      proposedPrice: formState.proposedPrice,
      viewingDate: formState.viewingDate,
      viewingTime: formState.viewingTime,
      moveInTimeline: formState.moveInTimeline,
      message: formState.message,
      status: 'Pending Approval',
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await rentalApi.submitContractProposal(listing.id, {
        proposedPrice: formState.proposedPrice,
        viewingDate: formState.viewingDate,
        viewingTime: formState.viewingTime,
        moveInTimeline: formState.moveInTimeline,
        message: formState.message,
      });

      const proposalId = res?.id;
      setSubmittedId(proposalId || contractProposal.id);
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to submit contract proposal:', error);
      showPopup(error.message || 'Unable to submit contract proposal.', 'Submission Failed');
    }
  };

  const handleCancel = async () => {
    if (!submittedId) return;
    const confirmed = window.confirm('Cancel your submitted contract proposal?');
    if (!confirmed) return;

    try {
      await rentalApi.deleteContractProposal(submittedId);
      setSubmitted(false);
      setSubmittedId(null);
      showPopup('Proposal cancelled.', 'Cancelled');
      navigate('/my-contracts');
    } catch (error) {
      console.error('Failed to cancel proposal:', error);
      showPopup(error.message || 'Unable to cancel proposal.', 'Cancellation Failed');
    }
  };

  if (!listing) {
    return (
      <div className="dashboard-page contract-page">
        <main className="dashboard-content contract-shell">
          <h2>Listing Not Found</h2>
          <button className="solid-btn" type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </main>
      </div>
    );
  }

  const isLandlord = user && user.email && listing.landlordEmail && user.email.toLowerCase() === listing.landlordEmail.toLowerCase();

  if (isLandlord) {
    return (
      <div className="dashboard-page contract-page">
        <main className="dashboard-content contract-shell">
          <h2>Action Not Allowed</h2>
          <p style={{marginBottom: '20px', color: '#666'}}>You cannot submit a proposal to your own listing.</p>
          <button className="solid-btn" type="button" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-page contract-page">
      <header className="contract-topbar">
        <button className="results-brand" type="button" onClick={() => navigate('/dashboard')}>
          <div className="results-logo-wrap">
            <Home size={16} />
          </div>
          <span>RentBuddy</span>
        </button>

        <div className="results-actions">
          <button className="icon-btn" type="button" onClick={() => navigate('/saved-homes')} aria-label="Saved homes">
            <Heart size={18} />
          </button>
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>

      <main className="contract-shell">
        <button className="back-btn" type="button" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to listing
        </button>

        <div className="contract-layout">
          <section className="contract-summary-card">
            <div className="contract-image-wrap">
              {listing.imageUrls && listing.imageUrls[0] ? (
                <img src={resolveListingImageUrl(listing.imageUrls[0])} alt={listing.title} />
              ) : (
                <div className="contract-image-empty">No image provided</div>
              )}
            </div>

            <div className="contract-summary-body">
              <span className="contract-badge">Open Contract</span>
              <h1>{listing.title}</h1>
              <p className="contract-address">
                <MapPin size={15} /> {listing.neighborhood}, {listing.city}
              </p>

              <div className="contract-summary-grid">
                <div>
                  <BadgeDollarSign size={18} />
                  <strong>₱ {Number(listing.price).toLocaleString()}</strong>
                  <span>Current asking price</span>
                </div>
                <div>
                  <HandCoins size={18} />
                  <strong>{listing.beds} Beds</strong>
                  <span>{listing.baths} Bath</span>
                </div>
                <div>
                  <Eye size={18} />
                  <strong>Schedule a visit</strong>
                  <span>Pick a day and time</span>
                </div>
              </div>
            </div>
          </section>

          <section className="contract-form-card">
            <div className="contract-form-header">
              <span className="contract-form-kicker">Negotiate and arrange viewing</span>
              <h2>Open Contract Request</h2>
              <p>
                Propose your rental price and send a viewing schedule so the landlord can review it.
              </p>
            </div>

            {submitted ? (
              <div className="contract-success-state">
                <h3>Contract request submitted</h3>
                <p>Your proposal has been saved locally and added to My Contracts.</p>
                <div className="contract-success-actions">
                  <button className="solid-btn" type="button" onClick={() => navigate('/my-contracts')}>
                    View My Contracts
                  </button>
                  <button className="outline-btn" type="button" onClick={() => navigate('/search-results')}>
                    Back to Listings
                  </button>
                  <button className="outline-btn danger-btn" type="button" onClick={handleCancel}>
                    Cancel Proposal
                  </button>
                </div>
              </div>
            ) : (
              <form className="contract-form" onSubmit={handleSubmit}>
                <label>
                  <span>Proposed monthly price</span>
                  <input
                    type="number"
                    min="0"
                    value={formState.proposedPrice}
                    onChange={(event) => updateField('proposedPrice', event.target.value)}
                    placeholder="Enter your offer"
                    required
                  />
                </label>

                <div className="contract-inline-grid">
                  <label>
                    <span>Viewing date</span>
                    <input
                      type="date"
                      value={formState.viewingDate}
                      onChange={(event) => updateField('viewingDate', event.target.value)}
                      required
                    />
                  </label>
                  <label>
                    <span>Viewing time</span>
                    <input
                      type="time"
                      value={formState.viewingTime}
                      onChange={(event) => updateField('viewingTime', event.target.value)}
                      required
                    />
                  </label>
                </div>

                <label>
                  <span>Move-in timeline</span>
                  <select
                    value={formState.moveInTimeline}
                    onChange={(event) => updateField('moveInTimeline', event.target.value)}
                  >
                    <option>Immediately</option>
                    <option>Within 30 days</option>
                    <option>Within 60 days</option>
                    <option>Flexible</option>
                  </select>
                </label>

                <label>
                  <span>Message to landlord</span>
                  <textarea
                    rows="5"
                    value={formState.message}
                    onChange={(event) => updateField('message', event.target.value)}
                    placeholder="Tell the landlord what you want to negotiate or ask about the viewing."
                  />
                </label>

                <div className="contract-actions">
                  <button className="solid-btn" type="submit">
                    Send Proposal
                  </button>
                  <button className="outline-btn" type="button" onClick={() => navigate(-1)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default OpenContractPage;