import Image from "next/image";
import { CalendarCheck, HandSoap, MapPin, Tag } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const facts = [
  { icon: HandSoap, title: "Nur von Hand", text: "Keine Waschstrasse, keine Bürsten." },
  { icon: CalendarCheck, title: "Termin auf Anfrage", text: "Jeremia bestätigt persönlich." },
  { icon: Tag, title: "Richtpreise online", text: "Vorher wissen, was es kostet." },
  { icon: MapPin, title: "Frauenfeld TG", text: "Für Frauenfeld und Umgebung." },
];

export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-x-clip">
      <div className="relative flex min-h-[100dvh] items-end md:items-center">
        {/* Riesiger Schriftzug hinter dem Auto */}
        <p
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[12%] -z-[5] select-none bg-gradient-to-b from-white/[0.13] to-white/0 bg-clip-text text-center font-display text-[19vw] font-bold leading-none tracking-tighter text-transparent md:top-[8%]"
        >
          DETAILING
        </p>

        {/* Foto blendet per Maske weich in den Seitenhintergrund aus, keine harten Kanten */}
        <div className="hero-photo absolute inset-y-0 right-0 -z-20 w-full md:w-[74%]">
          <Image
            src="/images/hero.png"
            alt="Schwarzes Auto mit frisch poliertem Lack in einer dunklen Werkstatt"
            fill
            priority
            sizes="(min-width: 768px) 74vw, 100vw"
            className="object-cover object-[65%_center]"
          />
          {/* Mobil liegt der Text auf dem Foto, daher dort zusätzlich abdunkeln */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-transparent md:hidden" />
        </div>

        <div className="mx-auto w-full max-w-6xl px-5 pb-36 pt-32 md:pb-24 md:pt-24">
          <Reveal className="max-w-lg">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-muted backdrop-blur">
              <MapPin size={14} weight="fill" className="text-accent" />
              Frauenfeld, Thurgau
            </p>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl lg:text-6xl">
              Autoaufbereitung
              <br />
              <span className="text-muted">in Frauenfeld.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              Jeremia pflegt dein Auto von Hand. Wäsche, Politur und Keramik, mit Zeit für jedes Detail.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#anfrage"
                className="rounded-full bg-accent px-7 py-3.5 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98]"
              >
                Anfrage senden
              </a>
              <a
                href="#pakete"
                className="glass rounded-full px-7 py-3.5 font-medium text-fg transition hover:bg-white/10 active:scale-[0.98]"
              >
                Preise ansehen
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Fakten-Leiste, überlappt das Hero-Bild leicht */}
      <div className="relative mx-auto -mt-20 max-w-6xl px-5">
        <Reveal delay={0.15}>
          <ul className="glass grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] sm:grid-cols-2 md:grid-cols-4">
            {facts.map((f) => (
              <li key={f.title} className="flex items-start gap-3 p-5 md:p-6">
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                  <f.icon size={20} />
                </span>
                <div>
                  <p className="font-medium">{f.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
