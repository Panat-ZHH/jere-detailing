import { CarProfile, ChatCircleDots, PaperPlaneTilt, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const steps = [
  { icon: PaperPlaneTilt, title: "Anfrage senden", text: "Paket, Fahrzeug und Wunschtermin online angeben." },
  { icon: ChatCircleDots, title: "Bestätigung", text: "Jeremia meldet sich und bestätigt den Termin." },
  { icon: CarProfile, title: "Auto bringen", text: "Du bringst dein Auto zum vereinbarten Zeitpunkt." },
  { icon: Sparkle, title: "Glänzend abholen", text: "Übergabe mit Rundgang ums Auto." },
];

export function Process() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:py-28">
      <Reveal>
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">So läuft es ab.</h2>
      </Reveal>
      <div className="relative mt-14 grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
        {/* Verbindungslinie hinter den Icons */}
        <div className="absolute left-6 right-6 top-6 hidden h-px bg-gradient-to-r from-accent/70 via-white/15 to-white/5 md:block" />
        {steps.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="relative flex gap-4 md:block">
              <span className="relative grid size-12 shrink-0 place-items-center rounded-full border border-line bg-ink-2 text-fg">
                <s.icon size={22} />
              </span>
              <div className="md:mt-6">
                <h3 className="font-display text-xl font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 max-w-[28ch] text-[15px] leading-relaxed text-muted">{s.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
