"use client";

import Image from "next/image";
import { useRef } from "react";
import { MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

// Freigestelltes Werkzeug am Seitenrand, ragt halb aus dem Bild und schwebt beim Scrollen mit
// leichter Drehung (Parallax). Nur ab Desktop-Breite, damit es auf dem Handy nichts verdeckt.
export function EdgeTool({
  src,
  side,
  top,
  width,
  rotate = 0,
  speed = 1,
}: {
  src: string;
  side: "left" | "right";
  top: string;
  width: number;
  rotate?: number;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { yPercent: 35 * speed, rotate: rotate - 10 * speed },
          {
            yPercent: -35 * speed,
            rotate: rotate + 10 * speed,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute z-0 hidden select-none xl:block"
      style={{
        top,
        width,
        // Eltern-Sektion ist vollbreit und schneidet seitlich ab (overflow-x-clip)
        [side]: -width * 0.38,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={width}
        sizes={`${width}px`}
        className="h-auto w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.65)]"
      />
    </div>
  );
}
