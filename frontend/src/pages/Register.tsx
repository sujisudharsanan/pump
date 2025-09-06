import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useToast } from '../hooks/useToast';
import { FormValidator } from '../utils/FormValidator';
import { ApiErrorHandler } from '../utils/ApiErrorHandler';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'manager'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const validateForm = () => {
    const validationErrors: Record<string, string> = {};
    
    if (!FormValidator.isValidEmail(formData.email)) {
      validationErrors.email = 'Please enter a valid email address';
    }
    
    if (!FormValidator.isValidPassword(formData.password)) {
      validationErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      validationErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!FormValidator.isValidName(formData.fullName)) {
      validationErrors.fullName = 'Please enter your full name';
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showError('Please fix the errors below');
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Account Created!', 'Please login with your credentials');
        navigate('/login');
      } else {
        const errorMessage = ApiErrorHandler.handleError(data.error);
        showError('Registration Failed', errorMessage);
      }
    } catch {
      showError('Network Error', 'Unable to connect to server');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard title="Create Account" subtitle="Join the pump management system">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="Full Name"
            className={`w-full h-12 border rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     ${errors.fullName ? 'border-red-500 focus:ring-red-500' : 
                       'border-gray-300 focus:ring-blue-600'}`}
            disabled={isLoading}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className={`w-full h-12 border rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     ${errors.email ? 'border-red-500 focus:ring-red-500' : 
                       'border-gray-300 focus:ring-blue-600'}`}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="w-full h-12 border border-gray-300 rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:ring-blue-600 
                     focus:border-transparent"
            disabled={isLoading}
          >
            <option value="manager">Manager</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className={`w-full h-12 border rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     ${errors.password ? 'border-red-500 focus:ring-red-500' : 
                       'border-gray-300 focus:ring-blue-600'}`}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            className={`w-full h-12 border rounded-md px-3 
                     focus:outline-none focus:ring-2 focus:border-transparent
                     ${errors.confirmPassword ? 
                       'border-red-500 focus:ring-red-500' : 
                       'border-gray-300 focus:ring-blue-600'}`}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <Link
            to="/login"
            className="bg-gray-500 text-white px-6 py-3 rounded-full text-sm 
                     hover:bg-gray-600 transition-colors font-medium min-w-fit"
          >
            Back to Login
          </Link>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-yellow-400 text-black px-6 py-3 rounded-full text-sm 
                     hover:bg-yellow-500 transition-colors font-medium min-w-fit
                     disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </div>
      </form>
    </AuthCard>
  );
};

export default Register;
