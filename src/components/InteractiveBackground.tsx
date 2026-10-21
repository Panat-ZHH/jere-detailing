"use client";

import { useEffect, useRef } from "react";

// Fixierter Seitenhintergrund: Punktraster, das um den Mauszeiger aufleuchtet,
// ein weicher roter Lichtschein und langsam treibende Lichtflächen.
// Positionen laufen über CSS-Variablen, nicht über React-State (kein Re-Render pro Frame).
export function InteractiveBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let tx = window.innerWidth * 0.7;
    let ty = window.innerHeight * 0.3;
    let x = tx;
    let y = ty;
    let raf = 0;
    const t0 = performance.now();

    const set = () => {
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };
    set();

    if (reduce) {
      el.style.setProperty("--spot", "0");
      return;
    }

    let running = false;
    const start = () => {
      if (running || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      start();
    };

    const loop = (now: number) => {
      if (!finePointer) {
        // Auf Touch-Geräten wandert das Licht langsam selbst
        const t = (now - t0) / 1000;
        tx = window.innerWidth * (0.5 + 0.35 * Math.sin(t * 0.21));
        ty = window.innerHeight * (0.45 + 0.3 * Math.sin(t * 0.13 + 1.2));
      }
      // weich nachziehen
      x += (tx - x) * 0.09;
      y += (ty - y) * 0.09;
      set();
      // Mit Maus: anhalten, sobald das Licht den Zeiger eingeholt hat
      if (finePointer && Math.abs(tx - x) < 0.5 && Math.abs(ty - y) < 0.5) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const onVisibility = () => {
      cancelAnimationFrame(raf);
      running = false;
      if (!document.hidden && !finePointer) start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    start();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div ref={ref} aria-hidden className="interactive-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Lichtflächen verschieben sich per CSS scroll-timeline leicht beim Scrollen */}
      <div className="bg-blobs">
        <div className="bg-blob bg-blob-a" />
        <div className="bg-blob bg-blob-b" />
        <div className="bg-blob bg-blob-c" />
      </div>
      <div className="bg-dots" />
      <div className="bg-dots bg-dots-lit" />
      <div className="bg-spot" />
    </div>
  );
}
