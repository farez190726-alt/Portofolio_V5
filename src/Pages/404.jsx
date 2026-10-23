import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="relative min-h-screen bg-[#050303] flex items-center justify-center px-4 overflow-hidden">
      {/* Ambient glow background, matching site theme */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-700/10 via-transparent to-blue-700/10 blur-3xl" />
      <img
        src="/spiderman/web-corner.png"
        alt=""
        className="absolute -top-6 -left-6 w-64 sm:w-80 opacity-20 pointer-events-none select-none"
      />
      <img
        src="/spiderman/web-corner.png"
        alt=""
        className="absolute -bottom-6 -right-6 w-64 sm:w-80 opacity-20 rotate-180 pointer-events-none select-none"
      />

      <div className="relative text-center max-w-lg">
        {/* Spider-Man reaction */}
        <div className="mb-4 flex justify-center">
          <img
            src="/spiderman/spidey-flip.png"
            alt="Spider-Man tidak terkesan dengan halaman yang hilang ini"
            className="w-36 sm:w-44 h-auto drop-shadow-[0_0_20px_rgba(220,38,38,0.45)]"
          />
        </div>

        {/* 404 Number */}
        <div className="mb-6">
          <h1 className="text-8xl sm:text-9xl font-bold bg-gradient-to-r from-[#dc2626] to-[#2563eb] bg-clip-text text-transparent mb-4 animate-bounce">
            404
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#dc2626] to-[#2563eb] mx-auto rounded-full" />
        </div>

        {/* Message */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold text-white mb-4">
            Oops! Bahkan Spider-Sense-ku Tak Mendeteksi Halaman Ini
          </h2>
          <p className="text-base sm:text-lg text-gray-400 max-w-md mx-auto leading-relaxed">
            Halaman yang kamu cari mungkin sudah dipindahkan, dihapus, atau tidak pernah ada.
            Ayo kembali ke jaring yang benar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={handleGoBack}
            className="spidey-sense flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <button
            onClick={handleGoHome}
            className="spidey-sense flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#dc2626] to-[#2563eb] text-white rounded-lg hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-red-900/30"
          >
            <Home size={20} />
            Beranda
          </button>
        </div>
      </div>
    </div>
  );
}
