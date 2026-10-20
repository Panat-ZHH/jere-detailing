import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";

const faqs = [
  {
    q: "Wie lange brauche ich ohne Auto?",
    a: "Aussen- und Innenpflege dauern ein paar Stunden. Die Komplettaufbereitung braucht einen Tag, Politur mit Keramik zwei Tage, weil die Versiegelung aushärten muss.",
  },
  {
    q: "Was ist der Unterschied zwischen Wachs und Keramik?",
    a: "Wachs gibt schönen Glanz und hält einige Wochen bis Monate. Eine Keramikversiegelung bildet eine harte Schutzschicht, die deutlich länger hält und die Pflege danach viel einfacher macht.",
  },
  {
    q: "Kann jeder Kratzer wegpoliert werden?",
    a: "Feine Kratzer und Waschstrassen-Swirls ja. Tiefe Kratzer, bei denen man den Fingernagel spürt, gehen meist bis in die Grundierung. Das schauen wir uns vor Ort an und sagen dir ehrlich, was möglich ist.",
  },
  {
    q: "Muss ich das Auto vorher ausräumen?",
    a: "Am besten ja, vor allem für die Innenraumpflege. Persönliche Sachen legen wir sonst in eine Box und geben sie dir bei der Abholung zurück.",
  },
  {
    q: "Kann ich einen Termin verschieben?",
    a: "Klar. Melde dich bis 24 Stunden vorher, dann finden wir einen neuen Termin.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24 md:py-32">
      <Reveal>
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          Häufige Fragen
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-3">
        {faqs.map((f) => (
          <details
            key={f.q}
            className="group rounded-[var(--radius-card)] border border-line bg-ink-2/60 px-6 open:bg-white/[0.03]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <Plus size={18} className="shrink-0 text-muted transition-transform duration-300 group-open:rotate-45" />
            </summary>
            <p className="max-w-[62ch] pb-6 leading-relaxed text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
