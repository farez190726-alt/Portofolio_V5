import React, { useEffect, useState, useCallback } from "react";

/**
 * "Web-Sling Scroll Rail" — a Spider-Man themed scroll progress indicator.
 * A thread runs down the right edge of the screen; a mask icon crawls
 * down it as the user scrolls. Clicking the mask "thwips" back to top.
 */
const ScrollWebSwing = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100)) : 0;
    setProgress(pct);
    setVisible(scrollTop > 200);
  }, []);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    handleScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.dispatchEvent(new Event("spidey-swing"));
  };

  return (
    <div
      className={`web-scroll-rail hidden sm:flex ${visible ? "web-scroll-rail-visible" : ""}`}
      aria-hidden={!visible}
    >
      <div className="web-scroll-track">
        <div className="web-scroll-fill" style={{ height: `${progress}%` }} />
        <button
          type="button"
          onClick={scrollToTop}
          className="web-scroll-thwip spidey-sense"
          style={{ top: `${progress}%` }}
          title="Thwip! Kembali ke atas"
          aria-label="Kembali ke atas"
        >
          <img src="/spiderman/spidey-mask-circle.png" alt="" />
        </button>
      </div>
      <span className="web-scroll-pct">{Math.round(progress)}%</span>
    </div>
  );
};

export default ScrollWebSwing;
