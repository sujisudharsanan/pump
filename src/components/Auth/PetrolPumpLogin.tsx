import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../hooks/useToast';
import { FormValidator } from '../../utils/validation';
import { ApiErrorHandler } from '../../utils/errorHandler';
import { ERROR_CODES } from '../../types/errors';

interface LoginFormData {
  email: string;
  password: string;
  [key: string]: string; // Index signature for Record compatibility
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const PetrolPumpLogin: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const validationRules = {
      email: FormValidator.getCommonRules().email,
      password: { required: true, minLength: 6 },
    };

    const result = FormValidator.validateForm(formData, validationRules);

    if (!result.isValid) {
      const newErrors: LoginFormErrors = {};
      result.errors.forEach(error => {
        newErrors[error.field as keyof LoginFormErrors] = error.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Validation Failed', 'Please correct the errors below.');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Mock API call - replace with actual API
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        showSuccess('Login Successful', `Welcome back, ${data.user.email}!`);
        navigate('/dashboard');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      const apiError = ApiErrorHandler.handleError(error);
      const userMessage = ApiErrorHandler.getUserFriendlyMessage(apiError);

      // Show specific error messages based on error code
      if (apiError.code === ERROR_CODES.AUTH_INVALID_CREDENTIALS) {
        setErrors({ general: 'Invalid email or password. Please try again.' });
      } else if (apiError.code === ERROR_CODES.AUTH_USER_NOT_FOUND) {
        setErrors({ email: 'No account found with this email address.' });
      } else {
        setErrors({ general: userMessage });
      }

      showError('Login Failed', userMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
                 bg-gradient-to-br from-blue-50 to-indigo-100"
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 
                       rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-white text-2xl font-bold">⛽</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Petrol Pump Manager
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                          focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                            errors.email
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-300'
                          }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 
                            focus:ring-blue-500 focus:border-blue-500 transition-colors pr-12 ${
                              errors.password
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300'
                            }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-gray-400 hover:text-gray-600">
                  {showPassword ? '🙈' : '👁️'}
                </span>
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : `bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 
                   hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div
                  className="animate-spin rounded-full h-5 w-5 border-b-2
                             border-white mr-2"
                ></div>
                Signing in...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
            Forgot your password?
          </a>
        </div>

        {/* System Info */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Petrol Pump Management System v1.0
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Secure • Reliable • Efficient
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetrolPumpLogin;
