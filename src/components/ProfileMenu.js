import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './ProfileMenu.css';

const ProfileMenu = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');

  const handleLogout = async () => {
    setLogoutError('');
    setIsLoggingOut(true);

    const { error: signOutError } = await signOut();

    setIsLoggingOut(false);
    setIsLogoutConfirmOpen(false);
    setIsOpen(false);

    if (signOutError) {
      setLogoutError(signOutError.message || 'Logout had an issue.');
    }

    navigate('/login', {
      replace: true,
      state: { message: 'You have been logged out.' }
    });
  };

  return (
    <div className="profile-container">
      <button
        className="profile-pic"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        {user?.user_metadata?.avatar_url ? (
          <img src={user.user_metadata.avatar_url} alt="User Profile" />
        ) : (
          <User size={20} className="profile-placeholder-icon" />
        )}
      </button>
      {isOpen && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="User Profile" />
            ) : (
              <div className="profile-dropdown-placeholder-icon">
                <User size={24} />
              </div>
            )}
            <div>
              <p className="profile-name">{user?.user_metadata?.name || 'User'}</p>
              <p className="profile-email">{user?.email || 'No email provided'}</p>
            </div>
          </div>
          <div className="profile-dropdown-divider" />
          <button className="profile-dropdown-item" type="button">
            <User size={16} />
            <span>View Profile</span>
          </button>
          <button className="profile-dropdown-item" type="button">
            <Settings size={16} />
            <span>Settings</span>
          </button>
          <div className="profile-dropdown-divider" />
          <button className="profile-dropdown-item logout-btn" onClick={() => setIsLogoutConfirmOpen(true)} type="button">
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}

      {isLogoutConfirmOpen && (
        <div className="post-modal-overlay logout-confirm-overlay" role="presentation" onClick={() => setIsLogoutConfirmOpen(false)}>
          <div className="post-modal logout-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="logout-confirm-header">
              <h2>Logout</h2>
              <p>Do you want to leave your current session?</p>
            </div>
            {logoutError && <p className="dashboard-empty-state error-state">{logoutError}</p>}
            <div className="logout-confirm-actions">
              <button className="outline-btn" type="button" onClick={() => setIsLogoutConfirmOpen(false)}>
                Cancel
              </button>
              <button className="logout-confirm-btn" type="button" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
