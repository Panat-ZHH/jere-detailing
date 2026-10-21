"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

// Weiches Scrollen (Lenis), gekoppelt an den GSAP-Ticker, damit ScrollTrigger synchron bleibt.
// Bei "Bewegung reduzieren" bleibt das native Scrollen aktiv.
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: { offset: -88 },
      // Scroll-Bereiche wie die Datumsleiste im Formular nicht abfangen
      prevent: (node) => node.closest?.("[data-lenis-prevent]") !== null,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
