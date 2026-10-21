import "server-only";
import type { Service, Settings } from "./booking";
import { getSupabaseAdmin } from "./supabase-server";

// Fallback, falls die DB (noch) nicht erreichbar ist. Die echten Werte pflegt Jeremia im Admin.
export const defaultSettings: Settings = {
  phone: null,
  email: null,
  address: "Frauenfeld, Thurgau",
  instagram: "https://www.instagram.com/jj.detailing01/",
  weekdaySlots: ["08:00", "10:30", "13:30", "16:00"],
  saturdaySlots: ["09:00", "11:30"],
  hoursWeekday: "08:00 - 18:00",
  hoursSaturday: "09:00 - 14:00",
  sizeFactors: { klein: 1, mittel: 1.15, gross: 1.3 },
};

type ServiceRow = {
  id: string;
  name: string;
  short: string;
  price_from: number;
  duration: string;
  category: Service["category"];
  includes: string[];
  image: string;
  featured: boolean;
  active: boolean;
  sort: number;
};

export function mapService(r: ServiceRow): Service {
  return {
    id: r.id,
    name: r.name,
    short: r.short,
    priceFrom: r.price_from,
    duration: r.duration,
    category: r.category,
    includes: r.includes ?? [],
    image: r.image,
    featured: r.featured,
    active: r.active,
    sort: r.sort,
  };
}

export async function getServices({ includeInactive = false } = {}): Promise<Service[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  let q = supabase.from("services").select("*").order("sort").order("name");
  if (!includeInactive) q = q.eq("active", true);
  const { data, error } = await q;
  if (error) {
    console.error("services query failed", error);
    return [];
  }
  return (data as ServiceRow[]).map(mapService);
}

export async function getSettings(): Promise<Settings> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return defaultSettings;
  const { data, error } = await supabase.from("settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    if (error) console.error("settings query failed", error);
    return defaultSettings;
  }
  return {
    phone: data.phone,
    email: data.email,
    address: data.address,
    instagram: data.instagram,
    weekdaySlots: data.weekday_slots,
    saturdaySlots: data.saturday_slots,
    hoursWeekday: data.hours_weekday,
    hoursSaturday: data.hours_saturday,
    sizeFactors: { klein: 1, mittel: Number(data.size_factor_mittel), gross: Number(data.size_factor_gross) },
  };
}
