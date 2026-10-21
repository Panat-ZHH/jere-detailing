"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CarProfile, ChatCircleDots, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react";
import { DESKTOP, MOTION_OK, gsap, useGSAP } from "@/lib/gsap";

const steps = [
  {
    icon: PaperPlaneTilt,
    title: "Anfrage senden",
    text: "Paket, Fahrzeug und Wunschtermin online angeben. Dauert zwei Minuten.",
    image: "/images/studio.png",
  },
  {
    icon: ChatCircleDots,
    title: "Bestätigung",
    text: "Jeremia schaut sich deine Anfrage an und meldet sich persönlich bei dir.",
    image: "/images/werkzeug.png",
  },
  {
    icon: CarProfile,
    title: "Auto bringen",
    text: "Du bringst dein Auto zum vereinbarten Zeitpunkt nach Frauenfeld.",
    image: "/images/schaum-front.png",
  },
  {
    icon: Sparkle,
    title: "Glänzend abholen",
    text: "Übergabe mit Rundgang ums Auto. Danach gehört die Strasse dir.",
    image: "/images/thurgau.png",
  },
];

const ROW = 104; // Zeilenhöhe der Titel-Liste in px (Desktop)

// Desktop: Sektion wird fixiert, ein einziger Bildrahmen wechselt das Foto per Wischblende,
// rechts rollt die Schritt-Liste weiter. Mobil und bei reduzierter Bewegung: ruhige Liste.
export function ProcessSteps() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(`${MOTION_OK} and ${DESKTOP}`, () => {
        const n = steps.length;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: ".ps-stage",
            start: "top top",
            end: () => `+=${window.innerHeight * (n - 1) * 0.9}`,
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, ease: "power2.inOut" },
            onUpdate: (self) => setActive(Math.round(self.progress * (n - 1))),
          },
        });
        tl.fromTo(".ps-ring", { drawSVG: "0%" }, { drawSVG: "100%", duration: n - 1 }, 0);
        for (let i = 1; i < n; i++) {
          tl.fromTo(`.ps-img-${i}`, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, i - 1);
          tl.fromTo(`.ps-img-${i} img`, { scale: 1.18 }, { scale: 1, duration: 1 }, i - 1);
          tl.to(`.ps-img-${i - 1} img`, { scale: 1.08, duration: 1 }, i - 1);
        }
      });
    },
    { scope: root },
  );

  const ActiveIcon = steps[active].icon;

  return (
    <section ref={root} aria-label="So läuft es ab" className="relative">
      {/* Desktop mit Bewegung */}
      <div className="ps-stage hidden h-[100dvh] items-center lg:motion-safe:flex">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-12 items-center gap-10 px-5">
          {/* Ein Bildrahmen, gleiche Form für alle Schritte */}
          <div className="col-span-5">
            <h2 className="mb-8 font-display text-5xl font-semibold tracking-tight">
              So läuft es ab.
            </h2>
            <div className="relative aspect-[4/5] max-h-[62vh] w-full overflow-hidden rounded-[28px] border border-line">
              {steps.map((s, i) => (
                <div
                  key={s.image}
                  className={`ps-img-${i} absolute inset-0 overflow-hidden`}
                  style={i > 0 ? { clipPath: "inset(100% 0% 0% 0%)" } : undefined}
                >
                  <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
                </div>
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          </div>

          {/* Fortschrittsring mit Icon des aktuellen Schritts */}
          <div className="col-span-2 flex justify-center">
            <div className="relative size-24">
              <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden>
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgb(255 255 255 / 0.1)" strokeWidth="2" />
                <circle className="ps-ring" cx="50" cy="50" r="46" fill="none" stroke="#e0353b" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span key={active} className="absolute inset-0 grid place-items-center text-fg [animation:ps-pop_0.5s_ease-out]">
                <ActiveIcon size={30} />
              </span>
            </div>
          </div>

          {/* Rollende Schritt-Liste, darunter die Beschreibung des aktiven Schritts */}
          <div className="col-span-5">
            <div className="relative h-[330px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_25%,#000_75%,transparent)]">
              <ol
                className="absolute inset-x-0 top-1/2 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: `translateY(${-ROW / 2 - active * ROW}px)` }}
              >
                {steps.map((s, i) => (
                  <li key={s.title} className="flex flex-col justify-center" style={{ height: ROW }}>
                    <p
                      className={`font-display text-5xl font-semibold tracking-tight transition-[opacity,color] duration-500 ${
                        i === active ? "text-fg opacity-100" : "text-muted opacity-25"
                      }`}
                    >
                      {s.title}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <p
              key={`t-${active}`}
              aria-live="polite"
              className="mt-4 min-h-[3.5rem] max-w-sm text-lg leading-relaxed text-muted [animation:ps-fade_0.6s_ease-out]"
            >
              {steps[active].text}
            </p>
          </div>
        </div>
      </div>

      {/* Mobil und reduzierte Bewegung: ruhige Liste, gleiche Bildform */}
      <div className="mx-auto max-w-6xl px-5 py-24 lg:motion-safe:hidden">
        <h2 className="font-display text-4xl font-semibold tracking-tight md:text-5xl lg:motion-safe:hidden">
          So läuft es ab.
        </h2>
        <ol className="relative mt-12 grid gap-12 border-l border-line pl-8">
          {steps.map((s) => (
            <li key={s.title} className="relative">
              <span className="absolute -left-[45px] top-0 grid size-9 place-items-center rounded-full border border-line bg-ink text-accent">
                <s.icon size={18} />
              </span>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 max-w-md text-muted">{s.text}</p>
              <div className="relative mt-5 aspect-[16/10] overflow-hidden rounded-[22px] border border-line">
                <Image src={s.image} alt="" fill sizes="100vw" className="object-cover" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
