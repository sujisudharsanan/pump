import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
} from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ToastProvider>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Sign in
          </h2>
          <p className="text-gray-600">
            Use your account
          </p>
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
                <span className="font-medium text-yellow-600 
                               hover:text-yellow-500 cursor-pointer">
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

export default App;
