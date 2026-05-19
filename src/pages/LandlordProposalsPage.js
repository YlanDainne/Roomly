import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LandlordProposalsPage.css';
import { MapPin, CalendarDays, Clock3, DollarSign, User } from 'lucide-react';
import { rentalApi } from '../services/rentalApi';
import ProfileMenu from '../components/ProfileMenu';
import NotificationMenu from '../components/NotificationMenu';
import { usePopup } from '../context/PopupContext';

const LandlordProposalsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showPopup } = usePopup();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await rentalApi.getListingProposals(id);
        console.debug('getListingProposals response for listing', id, res);
        setProposals(Array.isArray(res) ? res : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load proposals', err);
        setProposals([]);
        setError(err.message || 'Failed to load proposals');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleReject = async (proposalId) => {
    if (!window.confirm('Reject this proposal?')) return;
    try {
      await rentalApi.deleteListingProposal(id, proposalId);
      setProposals((p) => p.filter((x) => x.id !== proposalId));
      showPopup('Proposal rejected and proposer notified.', 'Proposal Rejected');
    } catch (err) {
      console.error('Failed to reject proposal', err);
      showPopup(err.message || 'Unable to reject proposal', 'Action Failed');
    }
  };

  const handleApprove = async (proposalId) => {
    if (!window.confirm('Approve this proposal?')) return;
    try {
      await rentalApi.approveListingProposal(id, proposalId);
      setProposals((p) =>
        p.map((x) => (x.id === proposalId ? { ...x, status: 'Approved' } : x))
      );
      showPopup('Proposal approved and proposer notified.', 'Proposal Approved');
    } catch (err) {
      console.error('Failed to approve proposal', err);
      showPopup(err.message || 'Unable to approve proposal', 'Action Failed');
    }
  };

  return (
    <div className="dashboard-page">
      <header className="results-topbar">
        <button className="results-brand" type="button" onClick={() => navigate('/dashboard')}>
          <span>RentBuddy</span>
        </button>
        <div className="results-actions">
          <NotificationMenu />
          <ProfileMenu />
        </div>
      </header>

      <main className="dashboard-content">
        <div className="dashboard-scroll-area">
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Proposals for Listing #{id}</h1>
              <p className="dashboard-subtitle">Review and manage contract proposals submitted by interested students.</p>
            </div>
          </div>

        {loading ? <p>Loading…</p> : (
          error ? (
            <p className="error">Error: {error}</p>
          ) : proposals.length === 0 ? (
            <div className="dashboard-empty-state">No proposals yet. When a student submits a proposal, it will appear here.</div>
          ) : (
            <section className="proposals-grid">
              {proposals.map((p) => (
                <article className="proposal-card" key={p.id}>
                  <div className="proposal-top">
                    <div>
                      <h3>{p.listingTitle}</h3>
                      <p><MapPin size={14} /> {p.address}</p>
                    </div>
                    <span className={`proposal-badge ${p.status === 'Pending Approval' ? 'pending' : 'approved'}`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="proposal-meta">
                    <span><DollarSign size={14} /> ₱ {p.proposedPrice ? Number(p.proposedPrice).toLocaleString() : '—'}</span>
                    <span><CalendarDays size={14} /> {p.viewingDate || 'Not set'}</span>
                    <span><Clock3 size={14} /> {p.viewingTime || 'Not set'}</span>
                  </div>
                  <div className="proposal-bottom">
                    <div className="proposer-info">
                      <div className="proposer-name">
                        <User size={16} /> <strong>{p.proposerName || 'Student'}</strong>
                      </div>
                      {p.proposerEmail && (
                        <div className="proposer-email">
                          <a href={`mailto:${p.proposerEmail}`}>
                            {p.proposerEmail}
                          </a>
                        </div>
                      )}
                    </div>
                    {p.status === 'Pending Approval' && (
                      <div className="proposal-actions">
                        <button className="solid-btn" onClick={() => handleApprove(p.id)}>Approve</button>
                        <button className="outline-btn danger-btn" onClick={() => handleReject(p.id)}>Reject</button>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          )
        )}
        </div>
      </main>
    </div>
  );
};

export default LandlordProposalsPage;
