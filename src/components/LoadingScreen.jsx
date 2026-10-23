import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-[#050303] flex items-center justify-center">
      <div className="relative">
        <div className="absolute -inset-4 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded-full opacity-20 blur-2xl animate-pulse"></div>
        <div className="relative flex flex-col items-center gap-4 p-8">
          <img
            src="/spiderman/spidey-logo-horizontal.png"
            alt="Spider-Man"
            className="w-36 sm:w-44 h-auto animate-spidey-pulse drop-shadow-[0_0_18px_rgba(220,38,38,0.55)]"
          />
          <div className="w-12 h-12 rounded-full border-4 border-t-transparent border-[#2563eb] animate-spin"></div>
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2563eb] to-[#dc2626] rounded blur opacity-20"></div>
            <span className="relative text-gray-200 text-sm">Web-slinging in...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;