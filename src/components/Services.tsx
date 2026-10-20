import Image from "next/image";
import { Reveal } from "./Reveal";

type Tile = {
  title: string;
  text: string;
  image: string;
  alt: string;
  className: string;
};

// Bento: grosse Kachel links, rechts gestapelt, unten zwei breite Kacheln.
const tiles: Tile[] = [
  {
    title: "Handwäsche",
    text: "Snow-Foam, zwei Eimer, weiche Handschuhe. Kein Waschstrassen-Kratzer.",
    image: "/images/schaum.png",
    alt: "Schaum läuft an einer Autotür herunter, Hand mit Waschhandschuh",
    className: "md:col-span-5 md:row-span-2 min-h-[420px] md:min-h-[560px]",
  },
  {
    title: "Politur",
    text: "Swirls und Kratzer werden auspoliert, nicht überdeckt.",
    image: "/images/politur.png",
    alt: "Poliermaschine mit rotem Pad auf schwarzem Lack",
    className: "md:col-span-7 min-h-[300px]",
  },
  {
    title: "Innenraum",
    text: "Leder, Kunststoffe, Teppiche. Bis in die Ritzen.",
    image: "/images/innenraum.png",
    alt: "Sauberer Innenraum mit schwarzen Ledersitzen",
    className: "md:col-span-7 min-h-[300px]",
  },
  {
    title: "Keramikversiegelung",
    text: "Wasser perlt ab, Schmutz haftet schlechter. Schutz, der lange hält.",
    image: "/images/keramik.png",
    alt: "Wassertropfen perlen auf schwarzem, versiegeltem Lack ab",
    className: "md:col-span-6 min-h-[340px]",
  },
  {
    title: "Felgen",
    text: "Flugrost und Bremsstaub runter, Felgen auf Wunsch versiegelt.",
    image: "/images/felgen.png",
    alt: "Felgenbürste reinigt eine dunkle Leichtmetallfelge",
    className: "md:col-span-6 min-h-[340px]",
  },
];

export function Services() {
  return (
    <section id="leistungen" className="mx-auto max-w-6xl px-5 py-24 md:py-32">
      <Reveal>
        <h2 className="max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Alles von Hand. Nichts aus der Waschstrasse.
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12">
        {tiles.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.05} className={t.className}>
            <article className="group relative isolate flex h-full min-h-[inherit] items-end overflow-hidden rounded-[var(--radius-card)] border border-line">
              <Image
                src={t.image}
                alt={t.alt}
                fill
                sizes="(min-width: 768px) 60vw, 100vw"
                className="-z-20 object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
              <div className="p-6 md:p-7">
                <h3 className="font-display text-2xl font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-2 max-w-sm text-[15px] leading-relaxed text-muted">{t.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
