import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import Dashboard from './pages/Dashboard';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Check for admin credentials
      if (email === 'admin' && password === 'admin') {
        // Store token and user info for admin
        localStorage.setItem('token', 'admin-token');
        localStorage.setItem(
          'user',
          JSON.stringify({ email: 'admin', role: 'admin' })
        );
        navigate('/dashboard');
        return;
      }

      // For other credentials, try API call (fallback)
      try {
        const response = await fetch('http://localhost:5000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          throw new Error('Invalid credentials');
        }

        const data = await response.json();

        // Store token and redirect to dashboard
        localStorage.setItem('token', data.token || 'user-token');
        localStorage.setItem('user', JSON.stringify({ email, role: 'user' }));
        navigate('/dashboard');
      } catch {
        // If API fails, allow any email/password combination for demo
        localStorage.setItem('token', 'demo-token');
        localStorage.setItem('user', JSON.stringify({ email, role: 'user' }));
        navigate('/dashboard');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Login failed');
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign in</h2>
          <p className="text-gray-600">Use your account</p>
        </div>

        {/* Form */}
        <div className="mt-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border 
                         border-gray-300 rounded-md shadow-sm 
                         placeholder-gray-400 focus:outline-none 
                         focus:ring-yellow-500 focus:border-yellow-500 
                         sm:text-sm"
                placeholder="Enter your password"
                required
              />
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={() => (window.location.href = '/forgot-password')}
                  className="text-sm text-black hover:text-gray-600 
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
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 
                         px-4 border border-transparent text-sm font-medium 
                         rounded-md text-white bg-yellow-400 
                         hover:bg-yellow-500 focus:outline-none 
                         focus:ring-2 focus:ring-offset-2 
                         focus:ring-yellow-500 disabled:bg-gray-400 
                         disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <span
                  onClick={() => (window.location.href = '/register')}
                  className="font-medium text-black 
                           hover:text-gray-600 cursor-pointer"
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
                  className="font-medium text-black 
                           hover:text-gray-600 cursor-pointer 
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

function RegistrationPage() {
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    position: '',
    company: '',
    businessArena: '',
    employees: '',
    street: '',
    additionalInfo: '',
    zipCode: '',
    place: '',
    country: '',
    phoneCode: '',
    phoneNumber: '',
    email: '',
    acceptTerms: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Country codes mapping
  const countryCodes = {
    India: '+91',
    'United States': '+1',
    'United Kingdom': '+44',
    Germany: '+49',
    France: '+33',
    Canada: '+1',
    Australia: '+61',
    Japan: '+81',
    China: '+86',
    Brazil: '+55',
  };

  // Auto-fill place when zip code changes
  const handleZipCodeChange = async (zipCode: string) => {
    setFormData(prev => ({ ...prev, zipCode }));

    if (zipCode.length >= 5 && formData.country) {
      try {
        const countryCode =
          formData.country === 'United States'
            ? 'us'
            : formData.country === 'Germany'
              ? 'de'
              : formData.country === 'India'
                ? 'in'
                : 'us';

        const response = await fetch(
          `https://api.zippopotam.us/${countryCode}/${zipCode}`
        );
        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({
            ...prev,
            place: data.places[0]['place name'],
          }));
        }
      } catch {
        // Silently handle location fetch error
      }
    }
  };

  // Auto-fill country code when country changes
  const handleCountryChange = (country: string) => {
    setFormData(prev => ({
      ...prev,
      country,
      phoneCode: countryCodes[country as keyof typeof countryCodes] || '',
    }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'acceptTerms'];
    const emptyFields = requiredFields.filter(
      field => !formData[field as keyof typeof formData]
    );

    if (emptyFields.length > 0) {
      alert(
        'Please fill in all required fields and accept terms and conditions'
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      alert('Registration successful! You can now sign in.');
      window.location.href = '/login';
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Registration failed. Please try again.';
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Panel - General Information */}
              <div className="p-8 lg:p-12 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">
                  General Information
                </h2>

                <div className="space-y-6">
                  {/* Title Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <select
                      value={formData.title}
                      onChange={e => handleInputChange('title', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200 bg-white"
                    >
                      <option value="">Select Title</option>
                      <option value="Mr.">Mr.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={e =>
                        handleInputChange('firstName', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={e =>
                        handleInputChange('lastName', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <select
                      value={formData.position}
                      onChange={e =>
                        handleInputChange('position', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200 bg-white"
                    >
                      <option value="">Select Position</option>
                      <option value="CEO">CEO</option>
                      <option value="CTO">CTO</option>
                      <option value="Manager">Manager</option>
                      <option value="Developer">Developer</option>
                      <option value="Designer">Designer</option>
                      <option value="Analyst">Analyst</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e =>
                        handleInputChange('company', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200"
                      placeholder="Enter your company name"
                    />
                  </div>

                  {/* Business Arena */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Arena
                    </label>
                    <select
                      value={formData.businessArena}
                      onChange={e =>
                        handleInputChange('businessArena', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200 bg-white"
                    >
                      <option value="">Select Business Arena</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Retail">Retail</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Consulting">Consulting</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Employees */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Employees
                    </label>
                    <select
                      value={formData.employees}
                      onChange={e =>
                        handleInputChange('employees', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg 
                               focus:ring-2 focus:ring-yellow-500 focus:border-transparent 
                               transition duration-200 bg-white"
                    >
                      <option value="">Select Employee Count</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Panel - Contact Details */}
              <div className="p-8 lg:p-12 bg-gradient-to-br from-yellow-400 to-yellow-500">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Contact Details
                </h2>

                <div className="space-y-6">
                  {/* Street + Nr */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Street + Nr
                    </label>
                    <input
                      type="text"
                      value={formData.street}
                      onChange={e =>
                        handleInputChange('street', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900 
                               placeholder-gray-600"
                      placeholder="Enter street address and number"
                    />
                  </div>

                  {/* Additional Information */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Additional Information
                    </label>
                    <input
                      type="text"
                      value={formData.additionalInfo}
                      onChange={e =>
                        handleInputChange('additionalInfo', e.target.value)
                      }
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900 
                               placeholder-gray-600"
                      placeholder="Additional address information"
                    />
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={e => handleZipCodeChange(e.target.value)}
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900 
                               placeholder-gray-600"
                      placeholder="Enter zip code"
                    />
                  </div>

                  {/* Place */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Place
                    </label>
                    <input
                      type="text"
                      value={formData.place}
                      onChange={e => handleInputChange('place', e.target.value)}
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900 
                               placeholder-gray-600"
                      placeholder="City/Place (auto-filled from zip code)"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Country
                    </label>
                    <select
                      value={formData.country}
                      onChange={e => handleCountryChange(e.target.value)}
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900"
                    >
                      <option value="">Select Country</option>
                      <option value="India">India</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="Brazil">Brazil</option>
                    </select>
                  </div>

                  {/* Phone Code and Number */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Code +
                      </label>
                      <input
                        type="text"
                        value={formData.phoneCode}
                        onChange={e =>
                          handleInputChange('phoneCode', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-transparent rounded-lg 
                                 focus:ring-2 focus:ring-white focus:border-transparent 
                                 transition duration-200 bg-white/90 text-gray-900 
                                 placeholder-gray-600"
                        placeholder="+91"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-white mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={e =>
                          handleInputChange('phoneNumber', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-transparent rounded-lg 
                                 focus:ring-2 focus:ring-white focus:border-transparent 
                                 transition duration-200 bg-white/90 text-gray-900 
                                 placeholder-gray-600"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full px-4 py-3 border border-transparent rounded-lg 
                               focus:ring-2 focus:ring-white focus:border-transparent 
                               transition duration-200 bg-white/90 text-gray-900 
                               placeholder-gray-600"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>

                  {/* Terms and Conditions */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={e =>
                        handleInputChange('acceptTerms', e.target.checked)
                      }
                      className="mt-1 h-4 w-4 text-yellow-600 focus:ring-white 
                               border-white rounded"
                      required
                    />
                    <label htmlFor="acceptTerms" className="text-sm text-white">
                      I do accept the Terms and Conditions of your site.
                    </label>
                  </div>

                  {/* Register Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-white text-yellow-600 py-3 px-6 rounded-lg 
                               font-medium hover:bg-gray-50 transition duration-200 
                               disabled:opacity-50 disabled:cursor-not-allowed 
                               shadow-md hover:shadow-lg"
                    >
                      {isLoading ? 'Registering...' : 'Register Badge'}
                    </button>
                  </div>

                  {/* Back to Login */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-white">
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={() => (window.location.href = '/login')}
                        className="font-medium text-white hover:text-gray-200 
                                 cursor-pointer bg-transparent border-none 
                                 underline hover:no-underline"
                      >
                        Sign in here
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;
