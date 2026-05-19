import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';
import { rentalApi } from '../services/rentalApi';
import { User, Lock, Moon, Camera, Home, ArrowLeft } from 'lucide-react';
import ProfileMenu from '../components/ProfileMenu';
import './AccountPage.css';

const AccountPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const { showPopup } = usePopup();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  
  // Profile State
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Security State
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Preferences State
  const [isDarkMode, setIsDarkMode] = useState(
    document.body.classList.contains('dark-mode')
  );

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'security', 'preferences'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    // Save preference to localStorage and apply
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('roomly-dark-mode', 'true');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('roomly-dark-mode', 'false');
    }
  }, [isDarkMode]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    
    const { error } = await supabase.auth.updateUser({
      data: { name }
    });

    setIsUpdatingProfile(false);

    if (error) {
      showPopup(error.message, 'Update Failed');
    } else {
      showPopup('Your profile has been updated successfully.', 'Profile Updated');
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showPopup('Please upload a valid image file.', 'Invalid File');
      return;
    }

    setIsUploadingAvatar(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await rentalApi.uploadAvatar(formData);
      
      if (response && response.url) {
        const { error: updateError } = await supabase.auth.updateUser({
          data: { avatar_url: response.url }
        });

        if (updateError) {
          showPopup(updateError.message, 'Profile Update Failed');
        } else {
          showPopup('Profile picture updated successfully.', 'Success');
        }
      }
    } catch (err) {
      showPopup(err.message || 'An error occurred during upload', 'Upload Failed');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      showPopup('Passwords do not match.', 'Error');
      return;
    }

    if (password.length < 6) {
      showPopup('Password must be at least 6 characters long.', 'Error');
      return;
    }

    setIsUpdatingPassword(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsUpdatingPassword(false);

    if (error) {
      showPopup(error.message, 'Update Failed');
    } else {
      showPopup('Your password has been updated successfully.', 'Security Updated');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="dashboard-page">
      <header className="results-topbar">
        <button className="results-brand" type="button" onClick={() => navigate('/dashboard')}>
          <div className="results-logo-wrap">
            <Home size={16} />
          </div>
          <span>RentBuddy</span>
        </button>
        <div className="results-actions">
          <ProfileMenu />
        </div>
      </header>

      <main className="dashboard-content" style={{ overflowY: 'auto' }}>
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          <button className="back-btn" onClick={() => navigate('/dashboard')} style={{ marginBottom: '24px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#666' }}>
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          
          <div className="dashboard-title-area">
            <div>
              <h1 className="dashboard-title">Account Settings</h1>
              <p className="dashboard-subtitle">Manage your profile, security preferences, and application settings.</p>
            </div>
          </div>

          <div className="account-layout">
            <aside className="account-sidebar">
              <button 
                className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => handleTabChange('profile')}
              >
                <User size={18} /> Profile
              </button>
              <button 
                className={`account-tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => handleTabChange('security')}
              >
                <Lock size={18} /> Security
              </button>
              <button 
                className={`account-tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
                onClick={() => handleTabChange('preferences')}
              >
                <Moon size={18} /> Preferences
              </button>
            </aside>

            <section className="account-content">
              {activeTab === 'profile' && (
                <div>
                  <h2>Public Profile</h2>
                  <p>This information will be displayed publicly so landlords or students can identify you.</p>
                  
                  <div className="profile-upload-section">
                    {user?.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="profile-avatar-preview" />
                    ) : (
                      <div className="profile-avatar-placeholder">
                        <User size={40} />
                      </div>
                    )}
                    
                    <div>
                      <div className="upload-btn-wrapper">
                        <button className="outline-btn" style={{ marginBottom: '8px' }}>
                          <Camera size={16} style={{ marginRight: '8px' }} />
                          {isUploadingAvatar ? 'Uploading...' : 'Change Picture'}
                        </button>
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} disabled={isUploadingAvatar} />
                      </div>
                      <p style={{ fontSize: '0.8rem', margin: 0 }}>JPG, GIF or PNG. Max size of 2MB.</p>
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile}>
                    <div className="account-form-group">
                      <label>Email Address</label>
                      <input type="email" value={user?.email || ''} disabled />
                    </div>
                    <div className="account-form-group">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <button type="submit" className="solid-btn" disabled={isUpdatingProfile} style={{ marginTop: '16px' }}>
                      {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'security' && (
                <div>
                  <h2>Password & Security</h2>
                  <p>Update your password to keep your account secure.</p>
                  
                  <form onSubmit={handleUpdatePassword}>
                    <div className="account-form-group">
                      <label>New Password</label>
                      <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Enter new password"
                        required
                      />
                    </div>
                    <div className="account-form-group">
                      <label>Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        placeholder="Confirm new password"
                        required
                      />
                    </div>
                    <button type="submit" className="solid-btn" disabled={isUpdatingPassword} style={{ marginTop: '16px' }}>
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              )}

              {activeTab === 'preferences' && (
                <div>
                  <h2>Preferences</h2>
                  <p>Customize your Roomly experience.</p>
                  
                  <div className="theme-toggle-row">
                    <div className="theme-toggle-info">
                      <h3>Dark Mode</h3>
                      <p>Switch between light and dark themes.</p>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={isDarkMode} 
                        onChange={() => setIsDarkMode(!isDarkMode)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;
