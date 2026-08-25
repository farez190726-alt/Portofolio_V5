import React, { useEffect, useRef } from "react";

const POINTS = 14;
const EASE = 0.35;

/**
 * Renders a spider-web thread that trails behind the mouse cursor,
 * built from a chain of spring-eased points drawn on a full-screen canvas.
 */
const WebTrailCanvas = () => {
  const canvasRef = useRef(null);
  const mouse = useRef({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 0,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 0,
  });
  const trail = useRef(
    Array.from({ length: POINTS }, () => ({ x: mouse.current.x, y: mouse.current.y }))
  );
  const rafRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const handleMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMove);

    const handleTouch = (e) => {
      if (e.touches && e.touches[0]) {
        mouse.current.x = e.touches[0].clientX;
        mouse.current.y = e.touches[0].clientY;
      }
    };
    window.addEventListener("touchmove", handleTouch, { passive: true });

    const animate = () => {
      const pts = trail.current;
      pts[0].x += (mouse.current.x - pts[0].x) * EASE;
      pts[0].y += (mouse.current.y - pts[0].y) * EASE;
      for (let i = 1; i < pts.length; i++) {
        pts[i].x += (pts[i - 1].x - pts[i].x) * EASE;
        pts[i].y += (pts[i - 1].y - pts[i].y) * EASE;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      for (let i = 1; i < pts.length; i++) {
        const t = i / pts.length;
        ctx.strokeStyle = `rgba(220, 38, 38, ${(1 - t) * 0.5})`;
        ctx.lineWidth = Math.max(0.6, 2.6 * (1 - t));
        ctx.beginPath();
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y);
        ctx.lineTo(pts[i].x, pts[i].y);
        ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.beginPath();
      ctx.arc(pts[0].x, pts[0].y, 2.5, 0, Math.PI * 2);
      ctx.fill();

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} className="web-trail-canvas" aria-hidden="true" />;
};

export default WebTrailCanvas;
