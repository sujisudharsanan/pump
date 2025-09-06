import React, { useState } from 'react';

const LoginTailwind = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('Enter an email or phone number');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Enter an email or phone number');
    } else {
      setError('');
      // Handle login logic here
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
      <div className="w-[750px] h-[400px] bg-white rounded-[20px] shadow-xl flex overflow-hidden">
        <div className="w-[250px] bg-[#FBC02D] flex flex-col items-center pt-12">
          <div className="w-[60px] h-[60px] bg-white rounded-full mb-6"></div>
          <h1 className="text-[20px] font-bold text-black mb-2">Sign in</h1>
          <p className="text-[14px] text-gray-700">Use your account</p>
        </div>

        <div className="w-[500px] p-10">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email or phone"
              className="w-full h-[45px] px-3 border border-[#E0E0E0] rounded-[6px] focus:outline-none focus:border-[#FBC02D] focus:ring-1 focus:ring-[#FBC02D]"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            {error && (
              <p className="text-[13px] text-[#E53935] mt-[6px]">{error}</p>
            )}

            <a
              href="#"
              className="block text-[13px] text-[#1E88E5] hover:underline mt-1"
            >
              Forgot email?
            </a>

            <p className="text-[13px] text-[#555] mt-5">
              Not your computer?{' '}
              <a href="#" className="text-[#1E88E5] hover:underline">
                Use Private Browsing
              </a>{' '}
              windows to sign in.
            </p>

            <div className="flex justify-between items-center mt-20">
              <a
                href="#"
                className="text-[14px] text-[#1E88E5] hover:underline"
              >
                Create account
              </a>
              <button
                type="submit"
                className="w-[100px] h-[40px] bg-[#FBC02D] rounded-full font-bold text-black shadow hover:bg-[#FDD35C] transition-colors"
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginTailwind;
