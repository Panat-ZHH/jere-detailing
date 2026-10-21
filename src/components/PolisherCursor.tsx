"use client";

import { useEffect, useRef } from "react";

// Cursor als Poliermaschine. Der Hotspot liegt in der Mitte des Polierpads.
// Nur mit Maus; auf Touch-Geräten und in Textfeldern bleibt der normale Cursor.
const SIZE = 84;
const HOT_X = 0.28; // Padmitte relativ zum Bild
const HOT_Y = 0.83;

const INTERACTIVE = "a, button, [role=button], [role=tab], [role=radio], label, summary, input[type=range]";
const TEXT_INPUT = "input:not([type=range]):not([type=checkbox]):not([type=radio]), textarea, select";

export function PolisherCursor() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.documentElement.classList.add("polisher-cursor");

    let tx = -200;
    let ty = -200;
    let x = tx;
    let y = ty;
    let tilt = 0;
    let raf = 0;
    let running = false;
    let visible = false;

    const render = () => {
      const k = reduce ? 1 : 0.35;
      const dx = tx - x;
      x += dx * k;
      y += (ty - y) * k;
      // leichte Neigung je nach Bewegungsrichtung
      tilt += (Math.max(-14, Math.min(14, dx * 0.4)) - tilt) * 0.2;
      node.style.transform = `translate3d(${x - SIZE * HOT_X}px, ${y - SIZE * HOT_Y}px, 0) rotate(${tilt}deg)`;
      if (Math.abs(tx - x) < 0.2 && Math.abs(ty - y) < 0.2 && Math.abs(tilt) < 0.1) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(render);
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX;
      ty = e.clientY;
      if (!visible) {
        x = tx;
        y = ty;
        visible = true;
        node.dataset.visible = "true";
      }
      const target = e.target as Element | null;
      node.dataset.hover = target?.closest(INTERACTIVE) ? "true" : "false";
      node.dataset.hidden = target?.closest(TEXT_INPUT) ? "true" : "false";
      kick();
    };
    const onDown = () => (node.dataset.active = "true");
    const onUp = () => (node.dataset.active = "false");
    const onLeave = () => {
      visible = false;
      node.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("polisher-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      data-visible="false"
      className="polisher pointer-events-none fixed left-0 top-0 z-[80] hidden [@media(pointer:fine)]:block"
      style={{ width: SIZE, height: SIZE, transformOrigin: `${HOT_X * 100}% ${HOT_Y * 100}%` }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- kleines Cursor-Bild, kein Layout */}
      <img src="/images/tools/polisher-cursor.webp" alt="" width={SIZE} height={SIZE} className="polisher-img h-full w-full select-none" draggable={false} />
    </div>
  );
}
