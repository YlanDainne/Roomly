import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const RegisterPage = () => {
  return (
    <div className="login-page">
      <div className="login-panel">
        <h1 className="login-title">Register.</h1>

        <div className="input-group">
          <label className="input-label">Name</label>
          <input type="text" className="login-input" placeholder="student name" />
        </div>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input type="text" className="login-input" placeholder="Username" />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" className="login-input" placeholder="••••••••" />
        </div>

        <div className="input-group" style={{ marginBottom: "50px" }}>
          <label className="input-label">Confirm Password</label>
          <input type="password" className="login-input" placeholder="••••••••" />
        </div>

        <button className="login-btn">
          REGISTER
        </button>

        <Link to="/login" className="signup-link">
          Already have an account? <span>Sign In.</span>
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;
