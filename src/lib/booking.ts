// Geteilte Anfrage-Logik für Client und Server. Preise und Zeiten kommen aus der DB.

export type Category = "pflege" | "innen" | "schutz";
export type VehicleSize = "klein" | "mittel" | "gross";

export type Service = {
  id: string;
  name: string;
  short: string;
  priceFrom: number;
  duration: string;
  category: Category;
  includes: string[];
  image: string;
  featured: boolean;
  active: boolean;
  sort: number;
};

export type Settings = {
  phone: string | null;
  email: string | null;
  address: string;
  instagram: string;
  weekdaySlots: string[];
  saturdaySlots: string[];
  hoursWeekday: string;
  hoursSaturday: string;
  sizeFactors: Record<VehicleSize, number>;
};

export const categoryLabels: Record<Category, string> = {
  pflege: "Pflege",
  innen: "Innenraum",
  schutz: "Schutz",
};

export const vehicleSizes: { id: VehicleSize; label: string; hint: string }[] = [
  { id: "klein", label: "Klein", hint: "z.B. Golf, Polo, Mini" },
  { id: "mittel", label: "Mittel", hint: "z.B. A4, 3er, Model 3" },
  { id: "gross", label: "Gross", hint: "SUV, Van, Pickup" },
];

export function estimatePrice(service: Service | undefined, size: VehicleSize, settings: Settings) {
  if (!service) return null;
  const factor = settings.sizeFactors[size] ?? 1;
  return Math.round((service.priceFrom * factor) / 5) * 5;
}

export function slotsForDate(date: string, settings: Settings): string[] {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (day === 0) return [];
  if (day === 6) return settings.saturdaySlots;
  return settings.weekdaySlots;
}

export const REQUEST_WINDOW_DAYS = 28;

// Heute im Format YYYY-MM-DD in Schweizer Zeit.
export function todayZurich(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(new Date());
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Wunschtermine ab morgen bis REQUEST_WINDOW_DAYS in die Zukunft.
export function requestableDates(settings: Settings): string[] {
  const today = todayZurich();
  const dates: string[] = [];
  for (let i = 1; i <= REQUEST_WINDOW_DAYS; i++) {
    const d = addDays(today, i);
    if (slotsForDate(d, settings).length > 0) dates.push(d);
  }
  return dates;
}

export type RequestInput = {
  service: string;
  vehicleSize: VehicleSize;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  notes?: string;
};

export type FieldErrors = Partial<Record<keyof RequestInput, string>>;

export function validateRequest(
  raw: unknown,
  ctx: { services: Service[]; settings: Settings },
): { data?: RequestInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");

  const service = str("service");
  const vehicleSize = str("vehicleSize") as VehicleSize;
  const date = str("date");
  const time = str("time");
  const name = str("name");
  const email = str("email");
  const phone = str("phone");
  const car = str("car");
  const notes = str("notes");

  if (!ctx.services.some((s) => s.id === service && s.active)) errors.service = "Bitte wähle ein Paket.";
  if (!vehicleSizes.some((v) => v.id === vehicleSize)) errors.vehicleSize = "Bitte wähle die Fahrzeuggrösse.";
  if (!date) errors.date = "Bitte wähle einen Tag.";
  if (!time) errors.time = "Bitte wähle eine Uhrzeit.";
  else if (
    date &&
    !(requestableDates(ctx.settings).includes(date) && slotsForDate(date, ctx.settings).includes(time))
  )
    errors.time = "Dieser Wunschtermin ist nicht möglich.";
  if (name.length < 2 || name.length > 120) errors.name = "Bitte gib deinen Namen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) errors.email = "Bitte gib eine gültige E-Mail an.";
  if (phone.replace(/[^\d]/g, "").length < 9 || phone.length > 40) errors.phone = "Bitte gib eine Telefonnummer an.";
  if (car.length < 2 || car.length > 120) errors.car = "Welches Auto bringst du?";
  if (notes.length > 1000) errors.notes = "Maximal 1000 Zeichen.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    data: { service, vehicleSize, date, time, name, email, phone, car, notes: notes || undefined },
  };
}
