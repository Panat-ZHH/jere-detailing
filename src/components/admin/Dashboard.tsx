"use client";

import Image from "next/image";
import { useState } from "react";
import { CalendarCheck, Gear, SignOut, Tag, Tray } from "@phosphor-icons/react";
import type { Service, Settings } from "@/lib/booking";
import { logout } from "@/app/admin/actions";
import { RequestsPanel } from "./RequestsPanel";
import { ServicesPanel } from "./ServicesPanel";
import { SettingsPanel } from "./SettingsPanel";

export type RequestRow = {
  id: string;
  created_at: string;
  service: string;
  vehicle_size: string;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  notes: string | null;
  status: "angefragt" | "bestaetigt" | "erledigt" | "storniert";
  admin_note: string | null;
  price_estimate: number | null;
};

const tabs = [
  { id: "anfragen", label: "Anfragen", icon: Tray },
  { id: "preise", label: "Preise & Pakete", icon: Tag },
  { id: "einstellungen", label: "Einstellungen", icon: Gear },
] as const;
type TabId = (typeof tabs)[number]["id"];

export function Dashboard({
  username,
  requests,
  services,
  settings,
}: {
  username: string;
  requests: RequestRow[];
  services: Service[];
  settings: Settings;
}) {
  const [tab, setTab] = useState<TabId>("anfragen");

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(new Date());
  const month = today.slice(0, 7);
  const open = requests.filter((r) => r.status === "angefragt").length;
  const upcoming = requests.filter((r) => r.status === "bestaetigt" && r.date >= today).length;
  const doneMonth = requests.filter((r) => r.status === "erledigt" && r.date.startsWith(month));
  const revenue = doneMonth.reduce((sum, r) => sum + (r.price_estimate ?? 0), 0);

  const stats = [
    { label: "Neue Anfragen", value: String(open), accent: open > 0 },
    { label: "Bestätigte Termine", value: String(upcoming) },
    { label: "Erledigt diesen Monat", value: String(doneMonth.length) },
    { label: "Richtumsatz Monat", value: `CHF ${revenue}` },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <header className="glass flex h-16 items-center justify-between rounded-full pl-2 pr-2">
        <div className="flex items-center gap-3">
          <Image src="/logo.webp" alt="" width={44} height={44} className="size-11 rounded-full" />
          <div className="leading-tight">
            <p className="font-display font-semibold">Verwaltung</p>
            <p className="text-xs text-muted">Angemeldet als {username}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href="/" target="_blank" className="hidden rounded-full px-4 py-2 text-sm text-muted hover:text-fg sm:block">
            Website ansehen
          </a>
          <form action={logout}>
            <button className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm transition hover:bg-white/5">
              <SignOut size={16} />
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-[var(--radius-card)] border border-line bg-ink-2 p-5">
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`mt-2 font-display text-3xl font-semibold ${s.accent ? "text-accent" : ""}`}>{s.value}</p>
          </div>
        ))}
      </section>

      <nav className="mt-8 flex flex-wrap gap-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
              tab === t.id ? "bg-accent text-white" : "border border-line text-muted hover:text-fg"
            }`}
          >
            <t.icon size={16} />
            {t.label}
            {t.id === "anfragen" && open > 0 && (
              <span className={`rounded-full px-1.5 text-xs ${tab === t.id ? "bg-white/25" : "bg-accent text-white"}`}>
                {open}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="mt-6">
        {tab === "anfragen" && <RequestsPanel requests={requests} services={services} />}
        {tab === "preise" && <ServicesPanel services={services} />}
        {tab === "einstellungen" && <SettingsPanel settings={settings} />}
      </div>

      <p className="mt-12 flex items-center gap-2 text-xs text-zinc-500">
        <CalendarCheck size={14} />
        Bestätigte Termine erscheinen auf der Website als belegt.
      </p>
    </div>
  );
}
