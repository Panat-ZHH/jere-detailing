// Geteilte Buchungslogik für Client und Server.

export type ServiceId = "aussen" | "innen" | "komplett" | "keramik";
export type VehicleSize = "klein" | "mittel" | "gross";

export type Service = {
  id: ServiceId;
  name: string;
  short: string;
  priceFrom: number;
  duration: string;
  includes: string[];
};

export const services: Service[] = [
  {
    id: "aussen",
    name: "Aussenpflege",
    short: "Handwäsche mit Vorwäsche, Felgen und Versiegelung.",
    priceFrom: 89,
    duration: "ca. 2 Std.",
    includes: [
      "Snow-Foam Vorwäsche",
      "Zwei-Eimer-Handwäsche",
      "Felgen und Reifen",
      "Scheiben aussen",
      "Sprühversiegelung",
    ],
  },
  {
    id: "innen",
    name: "Innenraumpflege",
    short: "Gründlich gesaugt, gereinigt und gepflegt.",
    priceFrom: 119,
    duration: "ca. 3 Std.",
    includes: [
      "Saugen inkl. Kofferraum",
      "Kunststoffe und Zierteile",
      "Lederreinigung und Pflege",
      "Scheiben innen",
      "Fussmatten",
    ],
  },
  {
    id: "komplett",
    name: "Komplettaufbereitung",
    short: "Innen und aussen, mit Lackreinigung per Knete.",
    priceFrom: 249,
    duration: "ca. 1 Tag",
    includes: [
      "Alles aus Aussen- und Innenpflege",
      "Flugrost- und Teerentfernung",
      "Lackreinigung mit Knete",
      "Hartwachs-Versiegelung",
      "Motorraum auf Wunsch",
    ],
  },
  {
    id: "keramik",
    name: "Politur & Keramik",
    short: "Kratzer raus, Glanz rein, Schutz für Jahre.",
    priceFrom: 690,
    duration: "2 Tage",
    includes: [
      "Komplette Aussenaufbereitung",
      "Lackmessung",
      "Ein- oder Zweistufen-Politur",
      "Keramikversiegelung",
      "Felgen versiegelt",
    ],
  },
];

export const vehicleSizes: { id: VehicleSize; label: string; hint: string; factor: number }[] = [
  { id: "klein", label: "Klein", hint: "z.B. Golf, Polo, Mini", factor: 1 },
  { id: "mittel", label: "Mittel", hint: "z.B. A4, 3er, Tesla Model 3", factor: 1.15 },
  { id: "gross", label: "Gross", hint: "SUV, Van, Pickup", factor: 1.3 },
];

export function estimatePrice(service: ServiceId, size: VehicleSize) {
  const s = services.find((x) => x.id === service);
  const v = vehicleSizes.find((x) => x.id === size);
  if (!s || !v) return null;
  return Math.round((s.priceFrom * v.factor) / 5) * 5;
}

// Startzeiten pro Wochentag (0 = Sonntag). Sonntag geschlossen.
const weekdaySlots = ["08:00", "10:30", "13:30", "16:00"];
const saturdaySlots = ["09:00", "11:30"];

export function slotsForDate(date: string): string[] {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  if (day === 0) return [];
  if (day === 6) return saturdaySlots;
  return weekdaySlots;
}

export const BOOKING_WINDOW_DAYS = 28;

// Heute im Format YYYY-MM-DD in Schweizer Zeit.
export function todayZurich(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(new Date());
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

// Buchbar ab morgen bis BOOKING_WINDOW_DAYS in die Zukunft.
export function bookableDates(): string[] {
  const today = todayZurich();
  const dates: string[] = [];
  for (let i = 1; i <= BOOKING_WINDOW_DAYS; i++) {
    const d = addDays(today, i);
    if (slotsForDate(d).length > 0) dates.push(d);
  }
  return dates;
}

export function isBookable(date: string, time: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  return bookableDates().includes(date) && slotsForDate(date).includes(time);
}

export type BookingInput = {
  service: ServiceId;
  vehicleSize: VehicleSize;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  car: string;
  notes?: string;
};

export type FieldErrors = Partial<Record<keyof BookingInput, string>>;

export function validateBooking(raw: unknown): { data?: BookingInput; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const r = (raw ?? {}) as Record<string, unknown>;
  const str = (k: string) => (typeof r[k] === "string" ? (r[k] as string).trim() : "");

  const service = str("service") as ServiceId;
  const vehicleSize = str("vehicleSize") as VehicleSize;
  const date = str("date");
  const time = str("time");
  const name = str("name");
  const email = str("email");
  const phone = str("phone");
  const car = str("car");
  const notes = str("notes");

  if (!services.some((s) => s.id === service)) errors.service = "Bitte wähle ein Paket.";
  if (!vehicleSizes.some((v) => v.id === vehicleSize)) errors.vehicleSize = "Bitte wähle die Fahrzeuggrösse.";
  if (!date) errors.date = "Bitte wähle einen Tag.";
  if (!time) errors.time = "Bitte wähle eine Uhrzeit.";
  else if (date && !isBookable(date, time)) errors.time = "Dieser Termin ist nicht buchbar.";
  if (name.length < 2) errors.name = "Bitte gib deinen Namen an.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Bitte gib eine gültige E-Mail an.";
  if (phone.replace(/[^\d]/g, "").length < 9) errors.phone = "Bitte gib eine Telefonnummer an.";
  if (car.length < 2) errors.car = "Welches Auto bringst du?";
  if (notes.length > 1000) errors.notes = "Maximal 1000 Zeichen.";

  if (Object.keys(errors).length > 0) return { errors };
  return {
    errors,
    data: { service, vehicleSize, date, time, name, email, phone, car, notes: notes || undefined },
  };
}
