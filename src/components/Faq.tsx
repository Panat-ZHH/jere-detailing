import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "./Reveal";
import { EdgeTool } from "./motion/EdgeTool";
import type { Faq as FaqItem } from "@/lib/faq";

export function Faq({ faqs }: { faqs: FaqItem[] }) {
  return (
    <section id="faq" className="relative overflow-x-clip">
      <EdgeTool src="/images/tools/mitt.webp" side="right" top="20%" width={300} rotate={-10} speed={0.9} />
      <div className="mx-auto max-w-3xl px-5 py-24 md:py-32">
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
      </div>
    </section>
  );
}
