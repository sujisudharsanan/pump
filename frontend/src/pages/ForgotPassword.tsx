import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useToast } from '../hooks/useToast';

const ForgotPassword: React.FC = () => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { showError, showSuccess: showSuccessToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim()) {
      showError('Please enter your username');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        'http://localhost:5000/api/forgot-password',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        showSuccessToast('Password reset instructions sent to your email');
      } else {
        showError(data.message || 'Failed to reset password');
      }
    } catch {
      showError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Reset Password" subtitle="Enter your username to reset">
      {showSuccess ? (
        <div className="text-center space-y-6">
          <div className="text-green-600 text-lg font-medium">
            Reset instructions sent!
          </div>
          <div className="text-gray-600 text-sm">
            Check your email for password reset instructions.
          </div>
          <Link
            to="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-full 
                     min-w-fit font-medium hover:bg-blue-700 
                     transition-colors inline-block"
          >
            Back to Login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full h-12 px-3 border border-gray-300 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-600 
                       focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#FBC02D] text-black px-6 py-3 rounded-full 
                     font-medium hover:bg-yellow-500 transition-colors 
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Reset Password'}
          </button>

          <div className="text-center">
            <Link to="/" className="text-blue-600 text-sm hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
