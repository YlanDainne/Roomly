import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Search, MapPin } from 'lucide-react';
import '../App.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="title-wrapper">
        <h1 className="title">RENTBUDDY</h1>
      </div>
      
      <h2 className="subtitle">
        Find your perfect university home with verified long term contracts.
      </h2>
      
      <button className="start-btn" onClick={() => navigate('/login')}>
        Start Searching
      </button>

      <div className="features-bar">
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <UserCheck size={20} strokeWidth={1} />
          </div>
          <span>Verified Landlords</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <ShieldCheck size={20} strokeWidth={1} />
          </div>
          <span>Secure Contracts</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <Search size={20} strokeWidth={1} />
          </div>
          <span>Student Filter</span>
        </div>
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <MapPin size={20} strokeWidth={1} />
          </div>
          <span>Campus Proximity</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
