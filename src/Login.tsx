import React, { useState } from 'react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter an email or phone number');
    } else {
      setError('');
      // Handle login logic here
    }
  };

  return (
    <div className="login-container">
      <form className="login-card" onSubmit={handleNext}>
        <div className="login-header-section">
          <div className="login-logo" />
          <div>
            <h2 className="login-header">Sign in</h2>
            <p className="login-subheader">Use your account</p>
          </div>
        </div>
        <div className="login-input-section">
          <label htmlFor="email" className="login-label">
            Email or phone
          </label>
          <input
            id="email"
            type="text"
            className={`login-input${error ? ' login-input-error' : ''}`}
            placeholder="Enter an email or phone number"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="username"
          />
          {error && <div className="login-error">{error}</div>}
          <div className="login-links-row">
            <a href="#" className="login-link">
              Forgot email?
            </a>
          </div>
        </div>
        <div className="login-disclaimer-section">
          <span className="login-disclaimer">
            Not your computer? Use Private Browsing windows to sign in.
          </span>
          <a href="#" className="login-link">
            Learn more about using Guest mode
          </a>
        </div>
        <div className="login-footer-row">
          <a href="#" className="login-link">
            Create account
          </a>
          <button type="submit" className="login-next-btn">
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
