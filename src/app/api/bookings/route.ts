import { NextResponse } from "next/server";
import { validateBooking } from "@/lib/booking";
import { getSupabaseAdmin } from "@/lib/supabase-server";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { data, errors } = validateBooking(body);
  if (!data) {
    return NextResponse.json({ error: "Bitte prüfe deine Angaben.", fields: errors }, { status: 422 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Die Online-Buchung ist noch nicht verbunden. Bitte melde dich per Instagram." },
      { status: 503 },
    );
  }

  const { error } = await supabase.from("bookings").insert({
    service: data.service,
    vehicle_size: data.vehicleSize,
    date: data.date,
    time: data.time,
    name: data.name,
    email: data.email,
    phone: data.phone,
    car: data.car,
    notes: data.notes ?? null,
  });

  if (error) {
    // 23505 = unique_violation: Slot wurde inzwischen von jemand anderem gebucht.
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "Dieser Termin wurde gerade vergeben. Bitte wähle eine andere Zeit.", fields: { time: "Bereits vergeben." } },
        { status: 409 },
      );
    }
    console.error("booking insert failed", error);
    return NextResponse.json({ error: "Buchung fehlgeschlagen. Bitte versuche es nochmals." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
