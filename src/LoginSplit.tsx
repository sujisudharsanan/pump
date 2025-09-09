import React, { useState } from 'react';
import './LoginSplit.css';

const LoginSplit = () => {
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
    <div className="login-split-container">
      <div className="login-split-card">
        {/* Left Side */}
        <div className="login-split-left">
          <h2 className="login-split-header">Sign in</h2>
          <p className="login-split-subheader">Use your account</p>
        </div>
        {/* Separator */}
        <div className="login-split-separator" style={{ height: 'auto' }} />
        {/* Right Side */}
        <div className="login-split-right">
          <form onSubmit={handleNext}>
            <label htmlFor="email" className="login-split-label">
              Email or phone
            </label>
            <input
              id="email"
              type="text"
              className="login-split-input"
              placeholder="Enter an email or phone number"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="username"
            />
            {error && <div className="login-split-error">{error}</div>}
            <button type="submit" className="login-split-next-btn">
              Next
            </button>
            <div style={{ marginBottom: '1rem' }}>
              <a href="#" className="login-split-link">
                Forgot email?
              </a>
            </div>
            <div className="login-split-disclaimer">
              Not your computer? Use Private Browsing windows to sign in.{' '}
              <a href="#" className="login-split-link">
                Learn more about using Guest mode
              </a>
            </div>
            <div className="login-split-footer-row">
              <a href="#" className="login-split-link">
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginSplit;
