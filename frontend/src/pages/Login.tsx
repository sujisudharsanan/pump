import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useToast } from '../hooks/useToast';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      // Handle login logic here
      navigate('/dashboard');
    }
  };

  const handleCreateAccount = () => {
    navigate('/register');
  };

  return (
    <AuthCard title="Sign in" subtitle="Use your account">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Input */}
        <div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email or phone"
            className="w-full h-12 border border-gray-300 rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:ring-blue-600 
                     focus:border-transparent"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              Enter an email or phone number
            </p>
          )}
        </div>

        {/* Password Input */}
        <div>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full h-12 border border-gray-300 rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:ring-blue-600 
                     focus:border-transparent"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">Enter your password</p>
          )}
        </div>

        {/* Forgot Email Link */}
        <div>
          <a href="#" className="text-black text-sm hover:underline">
            Forgot email?
          </a>
        </div>

        {/* Bottom Row */}
        <div className="flex justify-between items-center pt-8">
          <button
            type="button"
            onClick={handleCreateAccount}
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm 
                     hover:bg-blue-700 transition-colors font-medium min-w-fit"
          >
            Create account
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-full text-sm 
                     hover:bg-blue-700 transition-colors font-medium min-w-fit 
                     shadow-md hover:shadow-lg"
          >
            Next
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
