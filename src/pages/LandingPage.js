import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Search, MapPin } from 'lucide-react';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const isAnimatingRef = useRef(false);
  const totalSections = 3;

  const moveToSection = (targetIndex) => {
    if (isAnimatingRef.current) {
      return;
    }

    const clampedIndex = Math.max(0, Math.min(targetIndex, totalSections - 1));
    if (clampedIndex === currentSectionIndex) {
      return;
    }

    isAnimatingRef.current = true;
    setCurrentSectionIndex(clampedIndex);

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 700);
  };

  const handleWheel = (event) => {
    event.preventDefault();

    if (event.deltaY > 0) {
      moveToSection(currentSectionIndex + 1);
      return;
    }

    if (event.deltaY < 0) {
      moveToSection(currentSectionIndex - 1);
    }
  };

  return (
    <div
      className="landing-page"
      onWheel={handleWheel}
      style={{ '--section-index': currentSectionIndex }}
    >
      <div className="parallax-stage" aria-hidden="true">
        <div className="parallax-layer parallax-layer-far" />
        <div className="parallax-layer parallax-layer-mid" />
        <div className="parallax-layer parallax-layer-near" />
      </div>

      <header className="floating-header">
        <button className="nav-link" onClick={() => navigate('/login')}>Sign In</button>
      </header>

      <div
        className="landing-sections"
        style={{ transform: `translate3d(0, -${currentSectionIndex * 100}vh, 0)` }}
      >
        <section className="hero-section">
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
        </section>

        <section className="info-section">
          <div className="info-content">
            <p className="section-tag">About Us</p>
            <h3>Built for students who need confident housing decisions.</h3>
            <p>
              RentBuddy helps university renters compare verified long-term options without the noise.
              We focus on trust signals, clear contract details, and neighborhood context that students
              and parents actually care about.
            </p>
          </div>
        </section>

        <section className="info-section">
          <div className="info-content">
            <p className="section-tag">Contact Us</p>
            <h3>Talk to the team behind your housing search.</h3>
            <p>
              Questions, listing issues, or partnership inquiries? Reach out and we will respond as
              soon as possible.
            </p>
            <div className="contact-grid">
              <a className="contact-card" href="mailto:support@rentbuddy.com">customersupportroomly@gmail.com</a>
              <a className="contact-card" href="tel:+639171234567">+63 932 331 3003</a>
            </div>
          </div>
        </section>

        
      </div>
    </div>
  );
};

export default LandingPage;
