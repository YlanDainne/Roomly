import React from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-panel">
        <h1 className="login-title">Sign In.</h1>

        <div className="input-group">
          <label className="input-label">Username</label>
          <input type="text" className="login-input" placeholder="username" />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input type="password" className="login-input" placeholder="••••••••" />
        </div>

        <Link to="#" className="forgot-link">Forgot password?</Link>

        <button className="login-btn">
          Sign In
        </button>

        <Link to="/register" className="signup-link">
          Don't have an account? <span>Create one.</span>
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
