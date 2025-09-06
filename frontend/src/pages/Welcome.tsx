import React from 'react';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F6F7] flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-[#FBC02D] drop-shadow-lg">
          Now You are logged in
        </h1>
        
        <div className="space-y-4">
          <p className="text-xl text-gray-700">
            Welcome to Petrol Pump Management System
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-3 rounded-full 
                       font-medium hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
            
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-3 rounded-full 
                       font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
