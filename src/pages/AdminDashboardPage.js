import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { rentalApi } from '../services/rentalApi';
import { usePopup } from '../context/PopupContext';
import { useAuth } from '../context/AuthContext';
import { Home, CheckCircle, XCircle, Trash2, Edit2, LogOut, LayoutDashboard, Bell, Heart, FileText, Search, PlusCircle, X, MapPin, Bed, Bath, Maximize } from 'lucide-react';
import ProfileMenu from '../components/ProfileMenu';
import NotificationMenu from '../components/NotificationMenu';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [filterStatus, setFilterStatus] = useState('pending');
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const { signOut } = useAuth();

  useEffect(() => {
    verifyAccessAndFetch();
  }, []);

  const verifyAccessAndFetch = async () => {
    try {
      const userProfile = await rentalApi.getMe();
      if (!userProfile || userProfile.role !== 'admin') {
        showPopup('You do not have permission to access the admin dashboard.', 'Access Denied');
        navigate('/dashboard');
        return;
      }
      fetchPendingListings();
    } catch (err) {
      console.error(err);
      showPopup('Session expired or access denied.', 'Authentication Error');
      navigate('/login');
    }
  };

  const fetchPendingListings = async () => {
    setLoading(false);
    try {
      const data = await rentalApi.getAdminPendingListings();
      setListings(data || []);
    } catch (err) {
      showPopup('Failed to fetch pending listings.', 'Error');
    }
  };

  const openEditModal = (listing) => {
    setEditingListing(listing);
    setEditForm({
      title: listing.title,
      city: listing.city,
      neighborhood: listing.neighborhood,
      university: listing.university,
      price: listing.price,
      beds: listing.beds,
      baths: listing.baths,
      sizeSqm: listing.sizeSqm,
      description: listing.description,
      status: listing.status
    });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingListing(null);
    setEditForm({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingListing) return;

    try {
      const formData = new FormData();
      formData.append('title', editForm.title);
      formData.append('city', editForm.city);
      formData.append('neighborhood', editForm.neighborhood);
      formData.append('university', editForm.university);
      formData.append('price', editForm.price);
      formData.append('beds', editForm.beds);
      formData.append('baths', editForm.baths);
      formData.append('sizeSqm', editForm.sizeSqm);
      formData.append('description', editForm.description);

      await rentalApi.updateListing(editingListing.id, formData);
      showPopup('Listing updated successfully.', 'Success');
      closeEditModal();
      fetchPendingListings();
    } catch (err) {
      showPopup('Failed to update listing.', 'Error');
    }
  };

  const handleApprove = async (id) => {
    try {
      await rentalApi.updateListingStatusAdmin(id, 'approved');
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      showPopup('Listing has been approved and is now live.', 'Approved');
    } catch (err) {
      console.error('Approve error:', err);
      showPopup(err.message || 'Failed to approve listing.', 'Error');
    }
  };

  const handleReject = async (id) => {
    try {
      await rentalApi.updateListingStatusAdmin(id, 'rejected');
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      showPopup('Listing has been rejected and sent back to landlord.', 'Rejected');
    } catch (err) {
      console.error('Reject error:', err);
      showPopup(err.message || 'Failed to reject listing.', 'Error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;
    try {
      await rentalApi.deleteListingAdmin(id);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      showPopup('Listing permanently deleted.', 'Deleted');
    } catch (err) {
      console.error('Delete error:', err);
      showPopup(err.message || 'Failed to delete listing.', 'Error');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="admin-dashboard-page">
      <aside className="admin-sidebar">
        <button className="admin-sidebar-brand" onClick={goToDashboard}>
          <div className="admin-logo-icon">
            <LayoutDashboard size={18} />
          </div>
          <span className="admin-brand-name">Roomly</span>
        </button>

        <nav className="admin-sidebar-nav">
          <button className="admin-nav-item active" title="Admin Dashboard">
            <LayoutDashboard size={18} />
            <span>Admin Dashboard</span>
          </button>
          <button className="admin-nav-item" onClick={goToDashboard} title="User Dashboard">
            <Home size={18} />
            <span>User Dashboard</span>
          </button>
        </nav>

        <div className="admin-sidebar-bottom">
          <button className="admin-logout-btn-small" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <div className="admin-header-left">
            <h2 className="admin-page-title">Admin Dashboard</h2>
          </div>

          <div className="admin-header-actions">
            <button className="admin-icon-btn" type="button" title="Notifications">
              <Bell size={18} />
            </button>
            <ProfileMenu />
          </div>
        </header>

        <div className="admin-dashboard-scroll">
          <div className="admin-title-area">
            <div>
              <h1 className="admin-title">Listing Moderation</h1>
              <p className="admin-subtitle">
                Review and moderate property listings. Approve them to make them live, or reject for resubmission.
              </p>
            </div>
            <div className="admin-title-actions">
              <select className="admin-filter-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="pending">Pending Only</option>
                <option value="all">All Listings</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="admin-loading">Loading listings...</div>
          ) : listings.length === 0 ? (
            <div className="admin-empty-state">
              <Home size={48} className="empty-icon" />
              <h3>No pending listings</h3>
              <p>You're all caught up! There are no listings waiting for approval.</p>
            </div>
          ) : (
            <div className="admin-listings-table-container">
              <table className="admin-listings-table">
                <thead>
                  <tr>
                    <th>Listing</th>
                    <th>Location</th>
                    <th>Details</th>
                    <th>Landlord</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id} className="admin-table-row">
                      <td className="admin-listing-col">
                        <div className="admin-listing-preview">
                          {listing.imageUrls && listing.imageUrls.length > 0 ? (
                            <img src={listing.imageUrls[0]} alt={listing.title} className="admin-listing-thumb" />
                          ) : (
                            <div className="admin-listing-no-image">
                              <Home size={16} />
                            </div>
                          )}
                          <div className="admin-listing-info">
                            <h4>{listing.title}</h4>
                            <p className="admin-listing-desc">{listing.description?.substring(0, 60)}...</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-location">
                          <MapPin size={14} className="admin-location-icon" />
                          <div>
                            <div className="admin-loc-neighborhood">{listing.neighborhood}</div>
                            <div className="admin-loc-city">{listing.city}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-details">
                          <div className="admin-detail-item">
                            <Bed size={14} /> {listing.beds} bed{listing.beds !== 1 ? 's' : ''}
                          </div>
                          <div className="admin-detail-item">
                            <Bath size={14} /> {listing.baths} bath{listing.baths !== 1 ? 's' : ''}
                          </div>
                          <div className="admin-detail-item">
                            <Maximize size={14} /> {listing.sizeSqm} m²
                          </div>
                          <div className="admin-price">₱{listing.price?.toLocaleString()}/mo</div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-landlord-name">{listing.landlordName || 'Unknown'}</span>
                      </td>
                      <td>
                        <span className={`admin-status-badge admin-status-${listing.status}`}>
                          {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button 
                            className="admin-action-btn admin-approve" 
                            onClick={() => handleApprove(listing.id)}
                            title="Approve"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            className="admin-action-btn admin-reject" 
                            onClick={() => handleReject(listing.id)}
                            title="Reject"
                          >
                            <XCircle size={16} />
                          </button>
                          <button 
                            className="admin-action-btn admin-edit" 
                            onClick={() => openEditModal(listing)}
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            className="admin-action-btn admin-delete" 
                            onClick={() => handleDelete(listing.id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {isEditModalOpen && editingListing && (
        <div className="admin-edit-modal-overlay" onClick={closeEditModal}>
          <div className="admin-edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-edit-modal-header">
              <div>
                <h2>Edit Listing</h2>
                <p>Update listing details for {editingListing.title}</p>
              </div>
              <button className="admin-edit-modal-close" onClick={closeEditModal}>
                <X size={16} />
              </button>
            </div>

            <form className="admin-edit-form" onSubmit={handleEditSubmit}>
              <div className="admin-edit-grid">
                <label className="admin-edit-field">
                  <span>Property Name</span>
                  <input
                    name="title"
                    type="text"
                    value={editForm.title || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>University</span>
                  <input
                    name="university"
                    type="text"
                    value={editForm.university || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>City</span>
                  <input
                    name="city"
                    type="text"
                    value={editForm.city || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>Neighborhood</span>
                  <input
                    name="neighborhood"
                    type="text"
                    value={editForm.neighborhood || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>Monthly Rent (PHP)</span>
                  <input
                    name="price"
                    type="number"
                    value={editForm.price || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>Bedrooms</span>
                  <input
                    name="beds"
                    type="number"
                    value={editForm.beds || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>Bathrooms</span>
                  <input
                    name="baths"
                    type="number"
                    value={editForm.baths || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field">
                  <span>Size (m²)</span>
                  <input
                    name="sizeSqm"
                    type="number"
                    value={editForm.sizeSqm || ''}
                    onChange={handleEditChange}
                    required
                  />
                </label>

                <label className="admin-edit-field admin-edit-field-full">
                  <span>Description</span>
                  <textarea
                    name="description"
                    value={editForm.description || ''}
                    onChange={handleEditChange}
                    rows="4"
                    placeholder="Listing description..."
                  />
                </label>
              </div>

              <div className="admin-edit-actions">
                <button type="button" className="admin-edit-cancel" onClick={closeEditModal}>
                  Cancel
                </button>
                <button type="submit" className="admin-edit-save">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
