import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, loading, supabaseConfigured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/dashboard';
  const statusMessage = location.state?.message || '';

  const buildErrorDetails = (message) => {
    const loweredMessage = String(message || '').toLowerCase();

    if (loweredMessage.includes('email not confirmed')) {
      return 'Your account exists, but the email confirmation link has not been completed yet. Check your inbox and spam folder, then try again.';
    }

    if (loweredMessage.includes('invalid login credentials')) {
      return 'The email or password is incorrect, or the account has not been registered yet. Make sure you are using the same email you signed up with.';
    }

    if (loweredMessage.includes('supabase auth is not configured')) {
      return 'The frontend Supabase environment variables are missing. Check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local, then restart the app.';
    }

    if (loweredMessage.includes('fetch') || loweredMessage.includes('network')) {
      return 'The browser could not reach Supabase. Check your internet connection and confirm that the Supabase project is active.';
    }

    return 'If the email and password are correct, check whether your Supabase project requires email confirmation or if the account was created under a different email address.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      await signIn({ email, password });
      navigate(redirectTo, { replace: true });
    } catch (authError) {
      const message = authError.message || 'Unable to sign in.';
      setErrorMessage(message);
      setErrorDetails(buildErrorDetails(message));
      setShowErrorPopup(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <h1 className="login-title">Sign In.</h1>

        {!supabaseConfigured && (
          <p className="login-error" style={{ marginBottom: '18px' }}>
            Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in the frontend .env file.
          </p>
        )}

        {errorMessage && (
          <p className="login-error" style={{ marginBottom: '18px' }}>
            {errorMessage}
          </p>
        )}

        {statusMessage && (
          <p className="login-success" style={{ marginBottom: '18px' }}>
            {statusMessage}
          </p>
        )}

        <div className="input-group">
          <label className="input-label">Email</label>
          <input
            type="email"
            className="login-input"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <Link to="#" className="forgot-link">Forgot password?</Link>

        <button className="login-btn" type="submit" disabled={loading || isSubmitting}>
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </button>

        <Link to="/register" className="signup-link">
          Don't have an account? <span>Create one.</span>
        </Link>
      </form>

      {showErrorPopup && (
        <div className="auth-popup-overlay" role="presentation" onClick={() => setShowErrorPopup(false)}>
          <div className="auth-popup" role="dialog" aria-modal="true" aria-labelledby="login-error-title" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="auth-popup-close"
              aria-label="Close login error dialog"
              onClick={() => setShowErrorPopup(false)}
            >
              <X size={16} />
            </button>

            <div className="auth-popup-header">
              <div className="auth-popup-icon">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 id="login-error-title">Login failed</h2>
                <p>{errorMessage}</p>
              </div>
            </div>

            <div className="auth-popup-body">
              <h3>What to check</h3>
              <p>{errorDetails}</p>
            </div>

            <div className="auth-popup-actions">
              <button type="button" className="auth-popup-button" onClick={() => setShowErrorPopup(false)}>
                Try again
              </button>
              <Link to="/register" className="auth-popup-link" onClick={() => setShowErrorPopup(false)}>
                Create account
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
