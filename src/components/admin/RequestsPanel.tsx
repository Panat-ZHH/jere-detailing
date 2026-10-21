"use client";

import { useMemo, useState, useTransition } from "react";
import { EnvelopeSimple, MagnifyingGlass, Phone, Tray } from "@phosphor-icons/react";
import type { Service } from "@/lib/booking";
import { saveRequestNote, setRequestStatus } from "@/app/admin/actions";
import type { RequestRow } from "./Dashboard";
import { adminInput } from "./styles";

const statusMeta: Record<RequestRow["status"], { label: string; className: string }> = {
  angefragt: { label: "Neu", className: "bg-accent/15 text-accent border-accent/40" },
  bestaetigt: { label: "Bestätigt", className: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30" },
  erledigt: { label: "Erledigt", className: "bg-white/5 text-muted border-line" },
  storniert: { label: "Storniert", className: "bg-white/5 text-zinc-500 border-line line-through" },
};

const filters = [
  { id: "offen", label: "Offen" },
  { id: "angefragt", label: "Neu" },
  { id: "bestaetigt", label: "Bestätigt" },
  { id: "erledigt", label: "Erledigt" },
  { id: "storniert", label: "Storniert" },
  { id: "alle", label: "Alle" },
] as const;
type Filter = (typeof filters)[number]["id"];

const dateFmt = new Intl.DateTimeFormat("de-CH", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const sizeLabel: Record<string, string> = { klein: "Klein", mittel: "Mittel", gross: "Gross" };

export function RequestsPanel({ requests, services }: { requests: RequestRow[]; services: Service[] }) {
  const [filter, setFilter] = useState<Filter>("offen");
  const [query, setQuery] = useState("");

  const count = (f: Filter) =>
    requests.filter((r) =>
      f === "alle" ? true : f === "offen" ? r.status === "angefragt" || r.status === "bestaetigt" : r.status === f,
    ).length;

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return requests.filter((r) => {
      const byStatus =
        filter === "alle" ? true : filter === "offen" ? r.status === "angefragt" || r.status === "bestaetigt" : r.status === filter;
      const byQuery = !q || [r.name, r.car, r.email, r.phone].some((v) => v.toLowerCase().includes(q));
      return byStatus && byQuery;
    });
  }, [requests, filter, query]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                filter === f.id ? "border-white/30 bg-white/10 text-fg" : "border-line text-muted hover:text-fg"
              }`}
            >
              {f.label} <span className="text-zinc-500">{count(f.id)}</span>
            </button>
          ))}
        </div>
        <label className="relative md:w-72">
          <span className="sr-only">Suchen</span>
          <MagnifyingGlass size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, Auto, Telefon ..."
            className={`${adminInput} pl-10`}
          />
        </label>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 grid place-items-center rounded-[var(--radius-card)] border border-dashed border-line py-16 text-center text-muted">
          <Tray size={36} weight="thin" />
          <p className="mt-3">Keine Anfragen in dieser Ansicht.</p>
          <p className="text-sm text-zinc-500">Neue Anfragen von der Website erscheinen hier automatisch.</p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-3">
          {list.map((r) => (
            <RequestCard key={r.id} r={r} serviceName={services.find((s) => s.id === r.service)?.name ?? r.service} />
          ))}
        </ul>
      )}
    </div>
  );
}

function RequestCard({ r, serviceName }: { r: RequestRow; serviceName: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  const [note, setNote] = useState(r.admin_note ?? "");
  const [noteMsg, setNoteMsg] = useState("");
  const meta = statusMeta[r.status];

  const change = (status: RequestRow["status"]) =>
    start(async () => {
      setError("");
      const res = await setRequestStatus(r.id, status);
      if (res.error) setError(res.error);
    });

  const mailSubject = encodeURIComponent(`Deine Anfrage bei jj.detailing01 (${dateFmt.format(new Date(`${r.date}T12:00:00Z`))}, ${r.time})`);

  return (
    <li className={`grid gap-5 rounded-[var(--radius-card)] border border-line bg-ink-2 p-5 md:grid-cols-[120px_1fr_auto] ${pending ? "opacity-60" : ""}`}>
      <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-1">
        <p className="font-display text-lg font-semibold">{dateFmt.format(new Date(`${r.date}T12:00:00Z`))}</p>
        <p className="text-sm text-muted">{r.time} Uhr</p>
        <span className={`mt-1 inline-block rounded-full border px-2.5 py-0.5 text-xs ${meta.className}`}>{meta.label}</span>
      </div>

      <div className="min-w-0">
        <p className="font-medium">
          {r.name} <span className="font-normal text-muted">· {r.car}</span>
        </p>
        <p className="mt-1 text-sm text-muted">
          {serviceName}, {sizeLabel[r.vehicle_size] ?? r.vehicle_size}
          {r.price_estimate ? `, Richtpreis CHF ${r.price_estimate}` : ""}
        </p>
        {r.notes && <p className="mt-3 rounded-xl bg-white/[0.03] px-3 py-2 text-sm text-fg/90">„{r.notes}“</p>}
        <div className="mt-3 flex flex-wrap gap-2 text-sm">
          <a href={`tel:${r.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:bg-white/5">
            <Phone size={14} /> {r.phone}
          </a>
          <a href={`mailto:${r.email}?subject=${mailSubject}`} className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 hover:bg-white/5">
            <EnvelopeSimple size={14} /> {r.email}
          </a>
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            start(async () => {
              const res = await saveRequestNote(r.id, note);
              setNoteMsg(res.error ?? res.message ?? "");
            });
          }}
        >
          <input
            value={note}
            onChange={(e) => {
              setNote(e.target.value);
              setNoteMsg("");
            }}
            placeholder="Interne Notiz"
            aria-label="Interne Notiz"
            className={`${adminInput} py-2 text-sm`}
          />
          <button className="shrink-0 rounded-full border border-line px-4 text-sm hover:bg-white/5">Speichern</button>
        </form>
        {noteMsg && <p className="mt-1 text-xs text-muted">{noteMsg}</p>}
        {error && <p className="mt-2 text-sm text-red-300" role="alert">{error}</p>}
      </div>

      <div className="flex flex-wrap content-start gap-2 md:w-40 md:flex-col">
        {r.status === "angefragt" && (
          <>
            <ActionButton primary onClick={() => change("bestaetigt")}>Bestätigen</ActionButton>
            <ActionButton onClick={() => change("storniert")}>Absagen</ActionButton>
          </>
        )}
        {r.status === "bestaetigt" && (
          <>
            <ActionButton primary onClick={() => change("erledigt")}>Erledigt</ActionButton>
            <ActionButton onClick={() => change("storniert")}>Stornieren</ActionButton>
          </>
        )}
        {(r.status === "erledigt" || r.status === "storniert") && (
          <ActionButton onClick={() => change("angefragt")}>Wieder öffnen</ActionButton>
        )}
      </div>
    </li>
  );
}

function ActionButton({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-[0.98] ${
        primary ? "bg-accent text-white hover:bg-accent-strong" : "border border-line text-fg hover:bg-white/5"
      }`}
    >
      {children}
    </button>
  );
}
