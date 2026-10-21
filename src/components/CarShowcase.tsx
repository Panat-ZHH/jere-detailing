"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { ArrowsHorizontal, CubeFocus } from "@phosphor-icons/react";
import type { Finish, Hotspot } from "./three/CarScene";

const CarScene = dynamic(() => import("./three/CarScene"), { ssr: false });

type Spot = Hotspot & { title: string; text: string; image: string; detail: string };

// Punkte am Auto, an denen gearbeitet wird. Positionen kommen aus den Mesh-Namen des Modells.
const spots: Spot[] = [
  {
    id: "lack",
    label: "Lack",
    mesh: "BodyHood",
    offset: [0, 0.12, 0],
    title: "Lack und Politur",
    text: "Waschkratzer, Hologramme und matte Stellen werden auspoliert. Danach schützt eine Keramik- oder Wachsschicht.",
    image: "/images/lackmessung.png",
    detail: "Lackmessung vor jeder Politur",
  },
  {
    id: "felgen",
    label: "Felgen",
    mesh: "WheelFrontLBrakeDisc",
    offset: [0.12, 0, 0],
    title: "Felgen und Reifen",
    text: "Bremsstaub und Flugrost lösen, Reifen reinigen und pflegen. Auf Wunsch werden die Felgen versiegelt.",
    image: "/images/felgen.png",
    detail: "Mit pH-neutralem Reiniger",
  },
  {
    id: "licht",
    label: "Scheinwerfer",
    mesh: "BodyHeadlights",
    title: "Scheinwerfer",
    text: "Vergilbte, matte Scheinwerfer werden geschliffen und poliert. Mehr Licht und eine frischere Front.",
    image: "/images/scheinwerfer.png",
    detail: "Als Zusatz zu jedem Paket",
  },
  {
    id: "innen",
    label: "Innenraum",
    mesh: "InteriorSeatsColor1",
    offset: [0, 0.25, 0],
    title: "Innenraum",
    text: "Saugen, Dampf für Lüftung und Ritzen, Leder reinigen und pflegen. Gerüche und Flecken werden angegangen.",
    image: "/images/dampf.png",
    detail: "Dampf statt Chemie, wo es geht",
  },
  {
    id: "scheiben",
    label: "Scheiben",
    mesh: "BodyWindshield",
    title: "Scheiben",
    text: "Streifenfrei innen und aussen. Mit Versiegelung perlt Regen auf der Frontscheibe schneller ab.",
    image: "/images/keramik.png",
    detail: "Versiegelung optional",
  },
];

export function CarShowcase() {
  const reduce = useReducedMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState<string | null>("lack");
  const [interacted, setInteracted] = useState(false);
  const [finish, setFinish] = useState<Finish>("nachher");

  // Erst laden, wenn die Sektion in die Nähe kommt, und nur rendern, solange sie sichtbar ist
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setInView(e.isIntersecting);
        if (e.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const spot = spots.find((s) => s.id === active) ?? spots[0];

  return (
    <section id="showroom" className="relative overflow-x-clip py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Wo wir ansetzen.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
          Dreh das Auto, tipp auf einen Punkt oder schalte zwischen Vorher und Nachher um.
        </p>

      </div>

      {/* Bühne über die volle Breite, Info-Panel schwebt auf Desktop darüber */}
      <div className="relative mx-3 mt-10 md:mx-6">
          <div
            ref={wrap}
            className="relative h-[460px] overflow-hidden rounded-[28px] border border-line bg-[#0a0a0c] md:h-[78vh] md:min-h-[560px]"
            onPointerDown={() => setInteracted(true)}
          >
            {visible ? (
              <CarScene
                hotspots={spots}
                active={active}
                onSelect={setActive}
                autoRotate={!reduce && !interacted}
                finish={finish}
                running={inView}
                reduceMotion={!!reduce}
              />
            ) : (
              <div className="grid h-full place-items-center text-muted">
                <CubeFocus size={40} weight="thin" />
              </div>
            )}

            {/* Lackzustand umschalten: zeigt, was Politur und Versiegelung bewirken */}
            <div className="glass absolute left-4 top-4 grid grid-cols-2 gap-1 rounded-full p-1" role="radiogroup" aria-label="Lackzustand">
              {(["vorher", "nachher"] as const).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={finish === f}
                  onClick={() => setFinish(f)}
                  className={`min-h-10 rounded-full px-4 py-2 text-xs font-medium capitalize transition ${
                    finish === f ? "bg-accent text-white" : "text-muted hover:text-fg"
                  }`}
                >
                  {f === "vorher" ? "Vorher" : "Nachher"}
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-5 flex justify-center">
              <span className="glass flex items-center gap-2 rounded-full px-4 py-2 text-xs text-muted">
                <ArrowsHorizontal size={16} />
                Ziehen zum Drehen
              </span>
            </div>
          </div>

          <aside className="glass mt-4 flex flex-col overflow-hidden rounded-[var(--radius-card)] xl:absolute xl:bottom-6 xl:right-6 xl:top-6 xl:mt-0 xl:w-[360px]">
            <div className="relative aspect-[16/10] w-full shrink-0">
              <Image key={spot.image} src={spot.image} alt="" fill sizes="(min-width: 1024px) 380px, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Bereiche am Auto">
                {spots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    role="tab"
                    aria-selected={s.id === spot.id}
                    onClick={() => setActive(s.id)}
                    className={`min-h-10 rounded-full border px-3.5 py-2 text-xs transition ${
                      s.id === spot.id ? "border-accent bg-accent/15 text-fg" : "border-line text-muted hover:text-fg"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{spot.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{spot.text}</p>
              <p className="mt-auto pt-6 text-sm text-fg">{spot.detail}</p>
            </div>
          </aside>
      </div>
    </section>
  );
}
