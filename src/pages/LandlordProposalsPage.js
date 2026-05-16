import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './LandlordProposalsPage.css';
import { MapPin, CalendarDays, Clock3, DollarSign, User } from 'lucide-react';
import { rentalApi } from '../services/rentalApi';
import ProfileMenu from '../components/ProfileMenu';
import NotificationMenu from '../components/NotificationMenu';

const LandlordProposalsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await rentalApi.getListingProposals(id);
        setProposals(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error('Failed to load proposals', err);
        setProposals([]);
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
      alert('Proposal rejected and proposer notified.');
    } catch (err) {
      console.error('Failed to reject proposal', err);
      alert(err.message || 'Unable to reject proposal');
    }
  };

  const handleApprove = async (proposalId) => {
    if (!window.confirm('Approve this proposal?')) return;
    try {
      await rentalApi.approveListingProposal(id, proposalId);
      setProposals((p) =>
        p.map((x) => (x.id === proposalId ? { ...x, status: 'Approved' } : x))
      );
      alert('Proposal approved and proposer notified.');
    } catch (err) {
      console.error('Failed to approve proposal', err);
      alert(err.message || 'Unable to approve proposal');
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
        <h1>Proposals for listing #{id}</h1>
        {loading ? <p>Loading…</p> : (
          proposals.length === 0 ? (
            <p>No proposals yet.</p>
          ) : (
            <section className="proposals-grid">
              {proposals.map((p) => (
                <article className="proposal-card" key={p.id}>
                  <h3>{p.listingTitle}</h3>
                  <p><MapPin size={14} /> {p.address}</p>
                  <div className="proposal-meta">
                    <span><DollarSign size={14} /> ₱ {p.proposedPrice ? Number(p.proposedPrice).toLocaleString() : '—'}</span>
                    <span><CalendarDays size={14} /> {p.viewingDate || 'Not set'}</span>
                    <span><Clock3 size={14} /> {p.viewingTime || 'Not set'}</span>
                  </div>
                  <div className="proposal-bottom">
                    <div className="proposer">
                      <User size={16} /> Status: <strong>{p.status}</strong>
                    </div>
                    <div>
                      {p.status === 'Pending Approval' && (
                        <>
                          <button className="solid-btn" style={{ marginRight: 8 }} onClick={() => handleApprove(p.id)}>Approve</button>
                          <button className="outline-btn danger-btn" onClick={() => handleReject(p.id)}>Reject</button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )
        )}
      </main>
    </div>
  );
};

export default LandlordProposalsPage;
