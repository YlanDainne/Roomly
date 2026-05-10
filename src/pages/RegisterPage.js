import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { signUp, signOut, loading, supabaseConfigured } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordRules = [
    'At least 8 characters',
    'At least 1 uppercase letter',
    'At least 1 number',
    'At least 1 symbol'
  ];

  const passwordPattern = '^(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$';

  const isPasswordValid = () => new RegExp(passwordPattern).test(password);

  const buildErrorDetails = (message) => {
    const loweredMessage = String(message || '').toLowerCase();

    if (loweredMessage.includes('already registered') || loweredMessage.includes('user already')) {
      return 'This email is already connected to a Roomly account. Try signing in instead, or use a different email address.';
    }

    if (loweredMessage.includes('email rate limit')) {
      return 'Supabase is temporarily limiting signup emails. Wait a few minutes and try again.';
    }

    if (loweredMessage.includes('password') && loweredMessage.includes('weak')) {
      return 'The password is still too weak for Supabase. Use at least 8 characters with 1 uppercase letter, 1 number, and 1 symbol.';
    }

    if (loweredMessage.includes('supabase auth is not configured')) {
      return 'The frontend Supabase environment variables are missing. Check REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in .env.local, then restart the app.';
    }

    if (loweredMessage.includes('fetch') || loweredMessage.includes('network')) {
      return 'The browser could not reach Supabase. Check your internet connection and confirm that the project is active.';
    }

    return 'If the details above look correct, check whether Supabase email confirmation is enabled or whether the password rules in Roomly do not match the backend settings.';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setErrorDetails('');
    setShowErrorPopup(false);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      setErrorDetails('Make sure both password fields are identical before submitting the form.');
      setShowErrorPopup(true);
      return;
    }

    if (!isPasswordValid()) {
      setErrorMessage('Password does not meet the rules below.');
      setErrorDetails('Use at least 8 characters, with 1 uppercase letter, 1 number, and 1 symbol.');
      setShowErrorPopup(true);
      return;
    }

    if (!supabaseConfigured) {
      setErrorMessage('Supabase auth is not configured.');
      setErrorDetails('Set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in the frontend .env file, then restart the app.');
      setShowErrorPopup(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { session } = await signUp({ email, password, name });

      const confirmationMessage = session
        ? 'Registration complete. You can sign in now.'
        : 'Registration complete. Check your email to confirm your account before signing in.';

      if (session) {
        await signOut();
      }

      navigate('/login', {
        replace: true,
        state: {
          message: confirmationMessage
        }
      });
    } catch (authError) {
      const message = authError.message || 'Unable to register.';
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
        <h1 className="login-title">Register.</h1>

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

        <div className="input-group">
          <label className="input-label">Name</label>
          <input
            type="text"
            className="login-input"
            placeholder="student name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            autoComplete="name"
          />
        </div>

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
          <div className="input-label-row">
            <label className="input-label">Password</label>
            <span className="password-help" tabIndex="0" aria-label="Password rules help">
              <Info size={14} />
              <span className="password-help-tooltip">
                {passwordRules.map((rule) => (
                  <span key={rule}>{rule}</span>
                ))}
              </span>
            </span>
          </div>
          <input
            type="password"
            className="login-input"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            pattern={passwordPattern}
            title="Password must be at least 8 characters and include 1 uppercase letter, 1 number, and 1 symbol."
            autoComplete="new-password"
          />
        </div>

        <div className="input-group" style={{ marginBottom: "50px" }}>
          <label className="input-label">Confirm Password</label>
          <input
            type="password"
            className="login-input"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
            autoComplete="new-password"
          />
        </div>

        <button className="login-btn" type="submit" disabled={loading || isSubmitting}>
          {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
        </button>

        <Link to="/login" className="signup-link">
          Already have an account? <span>Sign In.</span>
        </Link>
      </form>

      {showErrorPopup && (
        <div className="auth-popup-overlay" role="presentation" onClick={() => setShowErrorPopup(false)}>
          <div className="auth-popup" role="dialog" aria-modal="true" aria-labelledby="register-error-title" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="auth-popup-close"
              aria-label="Close registration error dialog"
              onClick={() => setShowErrorPopup(false)}
            >
              <X size={16} />
            </button>

            <div className="auth-popup-header">
              <div className="auth-popup-icon">
                <AlertCircle size={18} />
              </div>
              <div>
                <h2 id="register-error-title">Registration failed</h2>
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
              <Link to="/login" className="auth-popup-link" onClick={() => setShowErrorPopup(false)}>
                Go to sign in
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
