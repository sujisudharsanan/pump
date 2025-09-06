import React, { useState } from 'react';

const LoginWindow: React.FC = () => {
  const [email, setEmail] = useState('');
  const [showError, setShowError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (showError && e.target.value.trim()) {
      setShowError(false);
    }
  };

  const handleNextClick = () => {
    if (!email.trim()) {
      setShowError(true);
    } else {
      // Handle next action - redirect or API call
      setShowError(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
      <div
        className="w-[750px] h-[400px] bg-white rounded-[20px] shadow-xl 
                   flex overflow-hidden"
      >
        {/* Left Column */}
        <div
          className="w-[250px] bg-[#FBC02D] flex flex-col 
                      items-center pt-16"
        >
          {/* White Circle */}
          <div className="w-[60px] h-[60px] bg-white rounded-full mb-6"></div>

          {/* Sign in Text */}
          <h2 className="text-black font-bold text-[20px] mb-2">Sign in</h2>

          {/* Use your account Text */}
          <p className="text-gray-600 text-[14px]">Use your account</p>
        </div>

        {/* Right Column */}
        <div className="w-[500px] bg-white p-10 flex flex-col justify-between">
          {/* Top Section with Input */}
          <div>
            {/* Email Input */}
            <input
              type="text"
              value={email}
              onChange={handleInputChange}
              placeholder="Email or phone"
              className="w-full h-[45px] border border-[#E0E0E0] 
                         rounded-[6px] pl-3 text-[14px] 
                         focus:outline-none focus:border-[#FBC02D] 
                         transition-colors"
            />

            {/* Error Message */}
            {showError && (
              <p className="text-[#E53935] text-[13px] mt-[6px]">
                Enter an email or phone number
              </p>
            )}

            {/* Forgot Email Link */}
            <a
              href="#"
              className="text-[#1E88E5] text-[13px] inline-block mt-1 
                         hover:underline"
            >
              Forgot email?
            </a>

            {/* Private Browsing Text */}
            <p className="text-[#555] text-[13px] mt-5">
              Not your computer? Use{' '}
              <a href="#" className="text-[#1E88E5] hover:underline">
                Private Browsing
              </a>{' '}
              windows to sign in.
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex justify-between items-center">
            {/* Create Account Link */}
            <a href="#" className="text-[#1E88E5] text-[14px] hover:underline">
              Create account
            </a>

            {/* Next Button */}
            <button
              onClick={handleNextClick}
              className="w-[100px] h-[40px] bg-[#FBC02D] rounded-full 
                         font-bold text-black text-[14px] shadow-md 
                         hover:shadow-lg transition-shadow"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginWindow;
