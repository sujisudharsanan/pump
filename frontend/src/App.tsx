import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import Protected from './protected';
import './App.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Enter an email or phone number');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data && (data.message || data.error)) || 'Login failed');
      } else {
        // store a fake token for demo
        localStorage.setItem('token', data.token || 'demo-token');
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row">
        {/* Left */}
        <div className="md:w-1/2 flex flex-col items-center justify-center p-10 border-b md:border-b-0 md:border-r border-gray-100">
          <div className="w-16 h-16 rounded-full bg-yellow-400 mb-6 shadow-inner"></div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Sign in</h2>
          <p className="text-sm text-gray-500">Use your account</p>
        </div>

        {/* Right (form) */}
        <div className="md:w-1/2 p-8 md:p-10 flex flex-col">
          <form className="flex-1 flex flex-col" onSubmit={handleSubmit} noValidate>
            <label className="sr-only" htmlFor="email">Email or phone</label>
            <input
              id="email"
              type="text"
              placeholder="Email or phone"
              className={`mb-2 px-4 py-3 rounded-md ${error ? 'border-2 border-red-500' : 'border border-gray-300'} focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50`}
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="username"
              autoFocus
            />

            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <label className="sr-only" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              className="mb-4 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-gray-50"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              autoComplete="current-password"
            />

            <div className="mb-4">
              <a href="#" className="text-blue-600 text-sm hover:underline">Forgot email?</a>
            </div>

            <div className="text-xs text-gray-500 mb-6">
              Not your computer? Use Private Browsing windows to sign in.{' '}
              <a href="#" className="text-blue-600 hover:underline">Learn more about using Guest mode</a>
            </div>

            <div className="flex items-center justify-between mt-auto">
              <a href="#" className="text-blue-600 text-sm hover:underline">Create account</a>
              <button
                type="submit"
                className="ml-4 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-yellow-400"
                disabled={loading}
              >
                {loading ? '...' : 'Next'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
    </Routes>
  );
}
