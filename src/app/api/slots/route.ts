import { NextResponse } from "next/server";
import { REQUEST_WINDOW_DAYS, addDays, todayZurich } from "@/lib/booking";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

// Liefert nur bereits bestätigte Termine (Datum + Uhrzeit), keine Personendaten.
export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ configured: false, booked: [] });
  }

  const from = addDays(todayZurich(), 1);
  const to = addDays(todayZurich(), REQUEST_WINDOW_DAYS);

  const { data, error } = await supabase
    .from("bookings")
    .select("date, time")
    .gte("date", from)
    .lte("date", to)
    .eq("status", "bestaetigt");

  if (error) {
    console.error("slots query failed", error);
    return NextResponse.json({ error: "Verfügbarkeit konnte nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ configured: true, booked: data ?? [] });
}
