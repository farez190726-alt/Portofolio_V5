import React, { useEffect, useState, useRef } from "react";

/**
 * Spider-Man "web-shooter" click effect.
 * Every click anywhere on the site spawns a small web-splat
 * at the cursor position, mimicking a web-shooter firing.
 */
const WebIcon = () => (
  <svg viewBox="0 0 100 100" fill="none" stroke="#dc2626" strokeWidth="2.5">
    <circle cx="50" cy="50" r="46" opacity="0.45" />
    <circle cx="50" cy="50" r="30" opacity="0.35" />
    <circle cx="50" cy="50" r="14" opacity="0.3" />
    {[...Array(8)].map((_, i) => {
      const angle = (i * Math.PI) / 4;
      return (
        <line
          key={i}
          x1={50 + 14 * Math.cos(angle)}
          y1={50 + 14 * Math.sin(angle)}
          x2={50 + 46 * Math.cos(angle)}
          y2={50 + 46 * Math.sin(angle)}
          opacity="0.45"
        />
      );
    })}
  </svg>
);

const WebShooterCursor = () => {
  const [shots, setShots] = useState([]);
  const idRef = useRef(0);

  useEffect(() => {
    const handleClick = (e) => {
      const id = ++idRef.current;
      const { clientX: x, clientY: y } = e;
      setShots((prev) => [...prev, { id, x, y }]);
      window.setTimeout(() => {
        setShots((prev) => prev.filter((s) => s.id !== id));
      }, 650);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <>
      {shots.map((s) => (
        <div
          key={s.id}
          className="web-shot"
          style={{ left: s.x, top: s.y }}
          aria-hidden="true"
        >
          <WebIcon />
        </div>
      ))}
    </>
  );
};

export default WebShooterCursor;
