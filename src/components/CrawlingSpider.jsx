import React from "react";

const SpiderSVG = () => (
  <svg viewBox="0 0 60 40" width="34" height="24">
    <g fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round">
      <line x1="22" y1="16" x2="6" y2="6" />
      <line x1="24" y1="20" x2="4" y2="18" />
      <line x1="26" y1="26" x2="8" y2="34" />
      <line x1="38" y1="16" x2="54" y2="6" />
      <line x1="36" y1="20" x2="56" y2="18" />
      <line x1="34" y1="26" x2="52" y2="34" />
    </g>
    <ellipse cx="30" cy="22" rx="9" ry="7" fill="#0a0a0a" />
    <circle cx="30" cy="12" r="5" fill="#0a0a0a" />
    <circle cx="28" cy="11" r="1" fill="#dc2626" />
    <circle cx="32" cy="11" r="1" fill="#dc2626" />
  </svg>
);

/**
 * Purely decorative: a small spider that crawls back and forth
 * along the top edge of the viewport on a slow loop.
 */
const CrawlingSpider = () => (
  <div className="crawling-spider" aria-hidden="true">
    <SpiderSVG />
  </div>
);

export default CrawlingSpider;
