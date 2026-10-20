"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import {
  bookableDates,
  estimatePrice,
  services,
  slotsForDate,
  todayZurich,
  vehicleSizes,
  type FieldErrors,
  type ServiceId,
  type VehicleSize,
} from "@/lib/booking";
import { site } from "@/lib/site";
import { SELECT_SERVICE_EVENT } from "./SelectServiceLink";

type Booked = { date: string; time: string };
type Status = "idle" | "sending" | "done";

const weekday = new Intl.DateTimeFormat("de-CH", { weekday: "short", timeZone: "UTC" });
const dayMonth = new Intl.DateTimeFormat("de-CH", { day: "numeric", month: "short", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("de-CH", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const asDate = (d: string) => new Date(`${d}T12:00:00Z`);

const chip =
  "rounded-full border px-4 py-2.5 text-sm transition active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const chipOn = "border-accent bg-accent/15 text-fg";
const chipOff = "border-line text-muted hover:border-white/25 hover:text-fg";
const input =
  "w-full rounded-[var(--radius-input)] border border-white/12 bg-white/[0.04] px-4 py-3 text-fg placeholder:text-zinc-500 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/30";

export function Booking() {
  const [service, setService] = useState<ServiceId>("komplett");
  const [size, setSize] = useState<VehicleSize>("mittel");
  const dates = useBookableDates();
  const [pickedDate, setDate] = useState<string>("");
  const date = pickedDate || dates[0] || "";
  const [time, setTime] = useState<string>("");
  const [booked, setBooked] = useState<Booked[] | null>(null);
  const [slotsError, setSlotsError] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string>("");

  useEffect(() => {
    const onSelect = (e: Event) => setService((e as CustomEvent<ServiceId>).detail);
    window.addEventListener(SELECT_SERVICE_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_SERVICE_EVENT, onSelect);
  }, []);

  const fetchSlots = useCallback(() => {
    fetch("/api/slots", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j: { booked: Booked[] }) => setBooked(j.booked))
      .catch(() => {
        setSlotsError(true);
        setBooked([]);
      });
  }, []);
  useEffect(fetchSlots, [fetchSlots]);

  const loadSlots = () => {
    setSlotsError(false);
    setBooked(null);
    fetchSlots();
  };

  const slots = useMemo(() => {
    if (!date) return [];
    return slotsForDate(date).map((t) => ({
      time: t,
      taken: booked?.some((b) => b.date === date && b.time === t) ?? false,
    }));
  }, [date, booked]);

  const price = estimatePrice(service, size);
  const selected = services.find((s) => s.id === service)!;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const payload = {
      service,
      vehicleSize: size,
      date,
      time,
      name: fd.get("name"),
      email: fd.get("email"),
      phone: fd.get("phone"),
      car: fd.get("car"),
      notes: fd.get("notes"),
    };

    setStatus("sending");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("done");
        return;
      }
      setErrors(json.fields ?? {});
      setFormError(json.error ?? "Buchung fehlgeschlagen. Bitte versuche es nochmals.");
      if (res.status === 409) {
        setTime("");
        loadSlots();
      }
    } catch {
      setFormError("Keine Verbindung. Bitte prüfe dein Internet und versuche es nochmals.");
    }
    setStatus("idle");
  }

  if (status === "done") {
    return (
      <div className="glass flex flex-col items-start rounded-[var(--radius-card)] p-8 md:p-10" role="status">
        <CheckCircle size={44} weight="duotone" className="text-accent" />
        <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight">Anfrage ist da.</h3>
        <p className="mt-3 max-w-md leading-relaxed text-muted">
          {selected.name} am {longDate.format(asDate(date))} um {time} Uhr. Du bekommst eine Bestätigung per
          E-Mail oder Telefon, sobald der Termin fix ist.
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setTime("");
            loadSlots();
          }}
          className="mt-8 rounded-full border border-line px-5 py-2.5 text-sm text-fg transition hover:bg-white/5"
        >
          Weiteren Termin buchen
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="glass rounded-[var(--radius-card)] p-6 md:p-9">
      <fieldset>
        <legend className="text-sm font-medium text-fg">Paket</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {services.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={service === s.id}
              onClick={() => setService(s.id)}
              className={`${chip} ${service === s.id ? chipOn : chipOff}`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-fg">Fahrzeuggrösse</legend>
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {vehicleSizes.map((v) => (
            <button
              key={v.id}
              type="button"
              aria-pressed={size === v.id}
              onClick={() => setSize(v.id)}
              className={`rounded-[var(--radius-input)] border px-4 py-3 text-left transition active:scale-[0.98] ${
                size === v.id ? chipOn : chipOff
              }`}
            >
              <span className="block text-sm font-medium">{v.label}</span>
              <span className="block text-xs text-muted">{v.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="mt-7">
        <legend className="text-sm font-medium text-fg">Tag</legend>
        <div className="-mx-1 mt-3 flex snap-x gap-2 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
          {dates.length === 0
            ? Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-[68px] w-[64px] shrink-0 animate-pulse rounded-2xl bg-white/[0.05]" />
              ))
            : dates.map((d) => {
                const on = d === date;
                return (
                  <button
                    key={d}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      setDate(d);
                      setTime("");
                    }}
                    className={`flex w-[64px] shrink-0 snap-start flex-col items-center rounded-2xl border py-2.5 transition active:scale-[0.98] ${
                      on ? chipOn : chipOff
                    }`}
                  >
                    <span className="text-xs">{weekday.format(asDate(d))}</span>
                    <span className="mt-0.5 text-sm font-medium">{dayMonth.format(asDate(d))}</span>
                  </button>
                );
              })}
        </div>
        {errors.date && <p className="mt-2 text-sm text-red-400">{errors.date}</p>}
      </fieldset>

      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-fg">Uhrzeit</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {booked === null
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[42px] w-[84px] animate-pulse rounded-full bg-white/[0.05]" />
              ))
            : slots.map((s) => (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.taken}
                  aria-pressed={time === s.time}
                  onClick={() => setTime(s.time)}
                  className={`${chip} ${
                    s.taken
                      ? "cursor-not-allowed border-line text-zinc-600 line-through"
                      : time === s.time
                        ? chipOn
                        : chipOff
                  }`}
                >
                  {s.time}
                </button>
              ))}
        </div>
        {slotsError && (
          <p className="mt-2 text-sm text-muted">
            Belegte Zeiten konnten nicht geladen werden.{" "}
            <button type="button" onClick={loadSlots} className="underline underline-offset-2 hover:text-fg">
              Nochmals laden
            </button>
          </p>
        )}
        {errors.time && <p className="mt-2 text-sm text-red-400">{errors.time}</p>}
      </fieldset>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Name" name="name" autoComplete="name" error={errors.name} />
        <Field label="Telefon" name="phone" type="tel" autoComplete="tel" error={errors.phone} />
        <Field label="E-Mail" name="email" type="email" autoComplete="email" error={errors.email} />
        <Field label="Auto (Marke und Modell)" name="car" placeholder="z.B. VW Golf 8" error={errors.car} />
        <div className="flex flex-col gap-2 sm:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Bemerkungen <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            maxLength={1000}
            placeholder="Hundehaare, Kratzer an der Tür, Abholung gewünscht ..."
            className={`${input} resize-none`}
          />
        </div>
      </div>

      {formError && (
        <p className="mt-6 flex items-start gap-2 rounded-[var(--radius-input)] border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert">
          <WarningCircle size={18} className="mt-0.5 shrink-0" />
          <span>
            {formError}
            {formError.includes("Instagram") && (
              <>
                {" "}
                <a href={site.instagram} className="underline underline-offset-2" target="_blank" rel="noreferrer">
                  {site.instagramHandle}
                </a>
              </>
            )}
          </span>
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          Richtpreis <span className="font-display text-xl font-semibold text-fg">CHF {price}</span>
          <span className="block">Endpreis je nach Zustand des Fahrzeugs.</span>
        </p>
        <button
          type="submit"
          disabled={status === "sending" || !time}
          className="rounded-full bg-accent px-8 py-3.5 font-medium text-white transition hover:bg-accent-strong active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet ..." : "Termin buchen"}
        </button>
      </div>
    </form>
  );
}

// Die Datumsliste hängt vom heutigen Tag ab. Auf dem Server (statisch gerendert) ist sie leer,
// im Browser wird sie berechnet. So gibt es keinen Hydration-Mismatch.
const EMPTY: string[] = [];
let cachedDates: { key: string; value: string[] } | null = null;
function getDatesSnapshot() {
  const key = todayZurich();
  if (cachedDates?.key !== key) cachedDates = { key, value: bookableDates() };
  return cachedDates.value;
}
const noopSubscribe = () => () => {};
function useBookableDates() {
  return useSyncExternalStore(noopSubscribe, getDatesSnapshot, () => EMPTY);
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        className={`${input} ${error ? "border-red-500/60" : ""}`}
      />
      {error && (
        <p id={`${name}-error`} className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
