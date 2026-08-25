import React, { useEffect, useState, useRef } from "react";

/**
 * Easter egg: dispatch a `window.dispatchEvent(new Event("spidey-swing"))`
 * (e.g. from the navbar logo) to make Spider-Man swing across the screen.
 */
const WebSwingEasterEgg = () => {
  const [swinging, setSwinging] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const trigger = () => {
      setSwinging(false);
      // force restart animation even if clicked again quickly
      requestAnimationFrame(() => {
        setSwinging(true);
        clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => setSwinging(false), 1650);
      });
    };

    window.addEventListener("spidey-swing", trigger);
    return () => {
      window.removeEventListener("spidey-swing", trigger);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!swinging) return null;

  return (
    <div aria-hidden="true">
      <div className="web-swing-line" />
      <img
        src="/spiderman/spidey-mask-circle.png"
        alt=""
        className="web-swing-figure"
      />
    </div>
  );
};

export default WebSwingEasterEgg;
