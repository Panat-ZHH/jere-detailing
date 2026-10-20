import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="mx-auto max-w-2xl px-5 py-24">
      <Link href="/" className="text-sm text-muted hover:text-fg">
        Zurück zur Startseite
      </Link>
      <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">{title}</h1>
      <div className="mt-8 grid gap-4 leading-relaxed text-muted [&_h2]:mt-6 [&_h2]:font-medium [&_h2]:text-fg">
        {children}
      </div>
    </main>
  );
}
