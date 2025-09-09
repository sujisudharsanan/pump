import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { useToast } from '../hooks/useToast';
import { FormValidator } from '../utils/FormValidator';
import { ApiErrorHandler } from '../utils/ApiErrorHandler';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'email':
        if (!FormValidator.isValidEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
      case 'password':
        if (!FormValidator.isValidPassword(value)) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    validateField('email', formData.email);
    validateField('password', formData.password);

    if (Object.keys(errors).length > 0) {
      showError('Please fix the validation errors');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = ApiErrorHandler.handleError(errorData);
        showError(errorMessage);
        return;
      }

      const data = await response.json();

      // Store auth token and user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('userRole', data.user.role);

      showSuccess('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = ApiErrorHandler.handleError(error as string);
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col justify-center 
                    py-12 sm:px-6 lg:px-8"
    >
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Access your petrol pump management dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <AuthCard title="Welcome Back" subtitle="Sign in to your account">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`appearance-none block w-full px-3 py-2 border 
                           rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-yellow-500 
                           focus:border-yellow-500 sm:text-sm ${
                             errors.email
                               ? 'border-red-300 text-red-900'
                               : 'border-gray-300'
                           }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`appearance-none block w-full px-3 py-2 border 
                           rounded-md shadow-sm placeholder-gray-400 
                           focus:outline-none focus:ring-yellow-500 
                           focus:border-yellow-500 sm:text-sm ${
                             errors.password
                               ? 'border-red-300 text-red-900'
                               : 'border-gray-300'
                           }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-2 
                         px-4 border border-transparent text-sm font-medium 
                         rounded-md text-white focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 
                         focus:ring-yellow-500 ${
                           isLoading
                             ? 'bg-gray-400 cursor-not-allowed'
                             : 'bg-yellow-400 hover:bg-yellow-500'
                         }`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="font-medium text-yellow-600 hover:text-yellow-500"
                >
                  Register here
                </button>
              </p>
            </div>
          </form>
        </AuthCard>
      </div>
    </div>
  );
};

export default Login;
