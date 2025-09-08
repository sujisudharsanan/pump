import React, { useState } from 'react';
import './LoginModern.css';

const LoginModern = () => {
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
    <div className="login-modern-container">
      <div className="login-modern-card">
        {/* Left Section */}
        <div className="login-modern-left">
          <h2 className="login-modern-header">Sign in</h2>
          <p className="login-modern-subheader">Use your account</p>
        </div>

        {/* Right Section */}
        <div className="login-modern-right">
          <form onSubmit={handleNext}>
            <div className="login-modern-form-group">
              <label htmlFor="email" className="login-modern-label">
                Email or phone
              </label>
              <input
                id="email"
                type="text"
                className={`login-modern-input${error ? ' error' : ''}`}
                placeholder="Enter an email or phone number"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="username"
              />
              {error && <div className="login-modern-error">{error}</div>}
            </div>

            <button type="submit" className="login-modern-next-btn">
              Next
            </button>

            <div>
              <a href="#" className="login-modern-link">
                Forgot email?
              </a>
            </div>

            <div className="login-modern-disclaimer">
              Not your computer? Use Private Browsing windows to sign in.{' '}
              <a href="#" className="login-modern-link">
                Learn more about using Guest mode
              </a>
            </div>

            <div className="login-modern-footer">
              <a href="#" className="login-modern-link">
                Create account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginModern;
