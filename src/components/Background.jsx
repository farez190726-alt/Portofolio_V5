import React, { useEffect, useRef } from "react";

const AnimatedBackground = () => {
  const blobRefs = useRef([]);

  useEffect(() => {
    let requestId;
    let currentScroll = 0;

    const handleScroll = () => {
      currentScroll = window.pageYOffset;

      blobRefs.current.forEach((blob, index) => {
        if (!blob) return;
        const xOffset = Math.sin(currentScroll / 200 + index * 0.8) * 120;
        const yOffset = Math.cos(currentScroll / 200 + index * 0.8) * 60;
        blob.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
        blob.style.transition = "transform 1.6s cubic-bezier(0.16, 1, 0.3, 1)";
      });

      requestId = requestAnimationFrame(handleScroll);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(requestId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Ambient Gradient Blobs (Soft Glassmorphism Mesh) */}
      <div className="absolute inset-0">
        
        {/* Blob 1: Cyan / Sky Blue (Top Left) */}
        <div
          ref={(el) => (blobRefs.current[0] = el)}
          className="absolute -top-24 -left-20 w-[420px] h-[420px] md:w-[600px] md:h-[600px] rounded-full bg-gradient-to-br from-cyan-400/25 via-sky-300/20 to-blue-400/10 dark:from-cyan-500/15 dark:via-sky-500/10 dark:to-transparent filter blur-[100px] md:blur-[140px] opacity-75 dark:opacity-40 animate-blob-float"
        />

        {/* Blob 2: Purple / Indigo (Top Right) */}
        <div
          ref={(el) => (blobRefs.current[1] = el)}
          className="absolute -top-20 -right-20 w-[400px] h-[400px] md:w-[580px] md:h-[580px] rounded-full bg-gradient-to-bl from-purple-400/20 via-indigo-300/15 to-violet-400/10 dark:from-purple-600/15 dark:via-indigo-500/10 dark:to-transparent filter blur-[100px] md:blur-[140px] opacity-70 dark:opacity-40 animate-blob-float"
          style={{ animationDelay: "3s" }}
        />

        {/* Blob 3: Emerald / Teal (Middle Left) */}
        <div
          ref={(el) => (blobRefs.current[2] = el)}
          className="absolute top-[45%] -left-32 w-[380px] h-[380px] md:w-[520px] md:h-[520px] rounded-full bg-gradient-to-tr from-teal-400/20 via-emerald-300/15 to-cyan-300/10 dark:from-teal-500/10 dark:via-emerald-500/10 dark:to-transparent filter blur-[100px] md:blur-[130px] opacity-60 dark:opacity-30 animate-blob-float"
          style={{ animationDelay: "6s" }}
        />

        {/* Blob 4: Lavender / Rose-Purple (Bottom Right) */}
        <div
          ref={(el) => (blobRefs.current[3] = el)}
          className="absolute -bottom-28 right-0 w-[450px] h-[450px] md:w-[640px] md:h-[640px] rounded-full bg-gradient-to-tl from-indigo-400/20 via-purple-300/15 to-pink-300/10 dark:from-indigo-600/15 dark:via-purple-600/10 dark:to-transparent filter blur-[110px] md:blur-[150px] opacity-70 dark:opacity-35 animate-blob-float"
          style={{ animationDelay: "9s" }}
        />
      </div>

      {/* Subtle Dot Grid pattern */}
      <div className="absolute inset-0 mesh-overlay" />
    </div>
  );
};

export default AnimatedBackground;
