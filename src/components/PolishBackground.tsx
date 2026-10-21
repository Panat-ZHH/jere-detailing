"use client";

import { useEffect, useRef } from "react";

// Seitenhintergrund als dunkler Autolack mit feinen Waschkratzern (Swirls).
// Um den Cursor wirken sie wie unter einer Inspektionslampe heller, und wo die
// "Poliermaschine" (Cursor) entlangfährt, verschwinden sie und kommen langsam zurück.
// Läuft nur, solange sich etwas bewegt. Ohne Maus (Touch) bleibt der Lack statisch.

const LAMP_RADIUS = 300;
const PAD_RADIUS = 72;
const REGROW = 0.012; // wie schnell die Swirls zurückkommen (pro Frame)

// Pseudo-Zufall mit festem Seed, damit das Muster bei jedem Laden gleich aussieht
function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}

function paintSwirls(c: HTMLCanvasElement, w: number, h: number) {
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, w, h);
  const rand = rng(42);
  const clusters = Math.round((w * h) / 26000);

  // Swirls: Gruppen aus konzentrischen Bogen-Stücken, wie Hologramme im Lack
  for (let k = 0; k < clusters; k++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const rings = 14 + Math.floor(rand() * 26);
    for (let i = 0; i < rings; i++) {
      const r = 12 + rand() * 230;
      const start = rand() * Math.PI * 2;
      const len = 0.15 + rand() * 0.9;
      g.beginPath();
      g.arc(cx, cy, r, start, start + len);
      g.strokeStyle = `rgba(255,255,255,${0.035 + rand() * 0.07})`;
      g.lineWidth = 0.5 + rand() * 0.6;
      g.stroke();
    }
  }
  // Ein paar lange, gerade Kratzer und eingetrocknete Wasserflecken
  for (let i = 0; i < clusters * 0.6; i++) {
    const x = rand() * w;
    const y = rand() * h;
    const a = rand() * Math.PI;
    const l = 30 + rand() * 140;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l);
    g.strokeStyle = `rgba(255,255,255,${0.025 + rand() * 0.04})`;
    g.lineWidth = 0.5;
    g.stroke();
  }
  for (let i = 0; i < clusters * 3; i++) {
    g.beginPath();
    g.arc(rand() * w, rand() * h, 1.5 + rand() * 4, 0, Math.PI * 2);
    g.strokeStyle = `rgba(255,255,255,${0.02 + rand() * 0.035})`;
    g.lineWidth = 0.6;
    g.stroke();
  }
}

export function PolishBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const swirls = document.createElement("canvas");
    const lamp = document.createElement("canvas");
    const mask = document.createElement("canvas");
    const lctx = lamp.getContext("2d")!;
    const mctx = mask.getContext("2d")!;
    const fine = window.matchMedia("(pointer: fine)").matches;

    let w = 0;
    let h = 0;
    let x = -9999;
    let y = -9999;
    let lastX = -9999;
    let lastY = -9999;
    let raf = 0;
    let running = false;
    let idleFrames = 0;
    let polished = false;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      for (const c of [canvas, swirls, lamp, mask]) {
        c.width = w;
        c.height = h;
      }
      paintSwirls(swirls, w, h);
      draw();
    };

    const draw = () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.globalAlpha = 0.62;
      ctx.drawImage(swirls, 0, 0);
      ctx.globalAlpha = 1;

      if (fine && x > -999) {
        // Inspektionslampe: Swirls im Lichtkegel heller
        lctx.globalCompositeOperation = "source-over";
        lctx.clearRect(0, 0, w, h);
        const grad = lctx.createRadialGradient(x, y, 0, x, y, LAMP_RADIUS);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        lctx.fillStyle = grad;
        lctx.fillRect(0, 0, w, h);
        lctx.globalCompositeOperation = "source-in";
        lctx.drawImage(swirls, 0, 0);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 1.6;
        ctx.drawImage(lamp, 0, 0);
        ctx.globalAlpha = 1;
        // warmer Schein der Lampe
        ctx.globalCompositeOperation = "source-over";
        const glow = ctx.createRadialGradient(x, y, 0, x, y, LAMP_RADIUS * 1.4);
        glow.addColorStop(0, "rgba(255,240,230,0.035)");
        glow.addColorStop(1, "rgba(255,240,230,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
      }

      if (polished) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.drawImage(mask, 0, 0);
        ctx.globalCompositeOperation = "source-over";
      }
    };

    // Polierte Spur in die Maske zeichnen (zwischen letzter und aktueller Position)
    const polish = (fx: number, fy: number, tx: number, ty: number) => {
      const dist = Math.hypot(tx - fx, ty - fy);
      const steps = Math.max(1, Math.ceil(dist / 8));
      mctx.globalCompositeOperation = "source-over";
      for (let i = 0; i <= steps; i++) {
        const px = fx + ((tx - fx) * i) / steps;
        const py = fy + ((ty - fy) * i) / steps;
        const g = mctx.createRadialGradient(px, py, 0, px, py, PAD_RADIUS);
        g.addColorStop(0, "rgba(0,0,0,0.95)");
        g.addColorStop(0.65, "rgba(0,0,0,0.55)");
        g.addColorStop(1, "rgba(0,0,0,0)");
        mctx.fillStyle = g;
        mctx.beginPath();
        mctx.arc(px, py, PAD_RADIUS, 0, Math.PI * 2);
        mctx.fill();
      }
      polished = true;
    };

    const loop = () => {
      // Maske langsam abbauen: die Swirls kommen zurück
      if (polished) {
        mctx.globalCompositeOperation = "destination-out";
        mctx.fillStyle = `rgba(0,0,0,${REGROW})`;
        mctx.fillRect(0, 0, w, h);
      }
      draw();
      idleFrames++;
      // nach ca. 6 Sekunden ohne Bewegung ist alles nachgewachsen: anhalten
      if (idleFrames > 360) {
        mctx.clearRect(0, 0, w, h);
        polished = false;
        draw();
        running = false;
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      idleFrames = 0;
      if (!running && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (lastX > -999) polish(lastX, lastY, x, y);
      lastX = x;
      lastY = y;
      start();
    };
    const onLeave = () => {
      x = y = lastX = lastY = -9999;
      start();
    };
    // Beim Scrollen bewegt sich der Lack nicht mit (fixiert), die Spur bleibt also am Bildschirm
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        running = false;
      }
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 150);
    };

    resize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    if (fine) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {/* leichter Lackverlauf, damit die Fläche nicht flach wirkt */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_0%,#16161a_0%,#0b0b0d_55%,#08080a_100%)]" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
