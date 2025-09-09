import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Yellow Circle */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full"></div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-600">Use your account</p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your password"
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/forgot-password')}
                  className="text-sm text-blue-600 hover:text-blue-500 
                           bg-transparent border-none cursor-pointer 
                           underline hover:no-underline"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 
                         px-4 border border-transparent text-sm font-medium 
                         rounded-md text-white bg-yellow-400 
                         hover:bg-yellow-500 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 
                         focus:ring-yellow-500"
              >
                Sign in
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <span
                  className="font-medium text-yellow-600 
                               hover:text-yellow-500 cursor-pointer"
                >
                  Register here
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !emailOrPhone) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, emailOrPhone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reset password');
      }

      alert('Password reset link sent successfully');
      // Redirect to login
      window.location.href = '/login';
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to send reset link';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full space-y-8 p-8">
        {/* Yellow Circle */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full"></div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-gray-600">
            Enter your username and email ID or phone number
          </p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email ID or Phone Number
              </label>
              <input
                type="text"
                value={emailOrPhone}
                onChange={e => setEmailOrPhone(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your email ID or phone number"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 
                         px-4 border border-transparent text-sm font-medium 
                         rounded-md text-white bg-yellow-400 
                         hover:bg-yellow-500 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 
                         focus:ring-yellow-500 disabled:bg-gray-400 
                         disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Remember your password?{' '}
                <button
                  type="button"
                  onClick={() => (window.location.href = '/login')}
                  className="font-medium text-blue-600 
                           hover:text-blue-500 cursor-pointer 
                           bg-transparent border-none 
                           underline hover:no-underline"
                >
                  Back to Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
