import { Booking } from "./Booking";
import { Reveal } from "./Reveal";
import { site } from "@/lib/site";

const steps = [
  { title: "Paket und Zeit wählen", text: "Freie Termine siehst du direkt im Kalender." },
  { title: "Bestätigung erhalten", text: "Wir melden uns kurz, um alles zu bestätigen." },
  { title: "Auto bringen, glänzend abholen", text: "Bei der Übergabe gehen wir das Ergebnis zusammen durch." },
];

export function BookingSection() {
  return (
    <section id="termin" className="relative overflow-x-clip py-24 md:py-32">
      <div className="pointer-events-none absolute right-[5%] top-24 -z-10 size-[480px] rounded-full bg-accent/10 blur-[140px]" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-4">
          <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Termin buchen.
          </h2>
          <ol className="mt-10 grid gap-8">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[36px_1fr] gap-4">
                <span className="grid size-9 place-items-center rounded-full border border-line font-display text-sm text-muted">
                  {i + 1}
                </span>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-12 border-t border-line pt-8">
            <p className="text-sm font-medium">Öffnungszeiten</p>
            <dl className="mt-3 grid gap-1.5 text-[15px] text-muted">
              {site.hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-6">
                  <dt>{h.days}</dt>
                  <dd className="tabular-nums">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-8" delay={0.1}>
          <Booking />
        </Reveal>
      </div>
    </section>
  );
}
