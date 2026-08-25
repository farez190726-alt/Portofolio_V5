import React, { useCallback, useEffect, useRef, useState } from "react";

const VILLAIN_LIFETIME = 4200; // ms before a villain flees uncaught
const SPAWN_INTERVAL = 2600; // ms between spawn attempts
const MAX_VILLAINS = 2;
const MARGIN_X = 90;
const MARGIN_TOP = 130;
const MARGIN_BOTTOM = 140;

let uid = 0;

const VillainSVG = () => (
  <svg viewBox="0 0 60 60" width="100%" height="100%" aria-hidden="true">
    <circle cx="30" cy="24" r="14" fill="#3f3f46" />
    <rect x="13" y="17" width="34" height="11" rx="4" fill="#0b0b0b" />
    <circle cx="23" cy="23" r="2.2" fill="#fff" />
    <circle cx="37" cy="23" r="2.2" fill="#fff" />
    <path d="M16 46 Q30 34 44 46 L44 58 L16 58 Z" fill="#52525b" />
    <rect x="6" y="38" width="11" height="20" rx="5" fill="#18181b" transform="rotate(-24 11 48)" />
    <rect x="43" y="38" width="11" height="20" rx="5" fill="#18181b" transform="rotate(24 49 48)" />
  </svg>
);

const VillainCatchGame = () => {
  const [villains, setVillains] = useState([]);
  const [score, setScore] = useState(0);
  const [pop, setPop] = useState(null);
  const spawnRef = useRef(null);

  const handleEscape = useCallback((id) => {
    setVillains((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const spawnVillain = useCallback(() => {
    setVillains((prev) => {
      if (prev.length >= MAX_VILLAINS) return prev;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const x = MARGIN_X + Math.random() * Math.max(0, vw - MARGIN_X * 2);
      const y = MARGIN_TOP + Math.random() * Math.max(0, vh - MARGIN_TOP - MARGIN_BOTTOM);
      const id = ++uid;
      const timeoutId = window.setTimeout(() => handleEscape(id), VILLAIN_LIFETIME);
      return [...prev, { id, x, y, caught: false, timeoutId }];
    });
  }, [handleEscape]);

  useEffect(() => {
    spawnVillain();
    spawnRef.current = window.setInterval(spawnVillain, SPAWN_INTERVAL);
    return () => {
      clearInterval(spawnRef.current);
      setVillains((prev) => {
        prev.forEach((v) => clearTimeout(v.timeoutId));
        return prev;
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCatch = (v) => {
    clearTimeout(v.timeoutId);
    setVillains((prev) =>
      prev.map((item) => (item.id === v.id ? { ...item, caught: true } : item))
    );
    setScore((s) => s + 1);
    setPop({ id: v.id, x: v.x, y: v.y });
    window.setTimeout(() => {
      setVillains((prev) => prev.filter((item) => item.id !== v.id));
    }, 420);
    window.setTimeout(() => setPop(null), 700);
  };

  return (
    <>
      {score > 0 && (
        <div className="villain-score" aria-live="polite">
          🕸️ Tertangkap: {score}
        </div>
      )}

      {villains.map((v) => (
        <button
          key={v.id}
          type="button"
          className={`villain ${v.caught ? "villain-caught" : ""}`}
          style={{ left: v.x, top: v.y, "--life": `${VILLAIN_LIFETIME}ms` }}
          onClick={() => !v.caught && handleCatch(v)}
          aria-label="Tangkap penjahat"
        >
          <VillainSVG />
          {!v.caught && (
            <span className="villain-timer">
              <span className="villain-timer-fill" />
            </span>
          )}
        </button>
      ))}

      {pop && (
        <div className="villain-pop" style={{ left: pop.x, top: pop.y }}>
          Tertangkap! +1
        </div>
      )}
    </>
  );
};

export default VillainCatchGame;
