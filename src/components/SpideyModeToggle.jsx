import React, { useEffect, useState } from "react";
import WebTrailCanvas from "./WebTrailCanvas";
import CrawlingSpider from "./CrawlingSpider";

const STORAGE_KEY = "spidey-mode-enabled";

const SpideyModeToggle = () => {
  const [active, setActive] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "1") setActive(true);
    } catch (e) {
      /* localStorage unavailable, ignore */
    }

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("spidey-mode-active", active);
    try {
      window.localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
    } catch (e) {
      /* localStorage unavailable, ignore */
    }
  }, [active]);

  return (
    <>
      <button
        type="button"
        onClick={() => setActive((v) => !v)}
        className={`spidey-mode-btn spidey-sense ${active ? "spidey-mode-btn-active" : ""}`}
        title={active ? "Matikan Spidey Mode" : "Aktifkan Spidey Mode"}
        aria-pressed={active}
      >
        <img src="/spiderman/spidey-mask-circle.png" alt="" />
        <span>{active ? "Spidey Mode: ON" : "Spidey Mode"}</span>
      </button>

      {active && !reduceMotion && (
        <>
          <div className="spidey-vignette" aria-hidden="true" />
          <WebTrailCanvas />
          <CrawlingSpider />
        </>
      )}
    </>
  );
};

export default SpideyModeToggle;
