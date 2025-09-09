import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F6F7]">
      <div
        className="w-[750px] min-h-[400px] bg-white rounded-xl shadow-lg 
                   flex overflow-hidden"
      >
        {/* Left Panel */}
        <div
          className="w-[250px] bg-[#FBC02D] flex flex-col 
                      items-center justify-center"
        >
          {/* White Circle Placeholder - Increased size for image */}
          <div
            className="w-[100px] h-[100px] bg-white rounded-full mb-6 
                         flex items-center justify-center"
          >
            {/* You can add an image here */}
          </div>

          {/* Title */}
          <h2 className="text-black font-bold text-xl mb-2">{title}</h2>

          {/* Subtitle */}
          <p className="text-black text-sm text-center px-4">{subtitle}</p>
        </div>

        {/* Right Panel */}
        <div className="w-[500px] bg-white p-10 flex flex-col justify-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthCard;
