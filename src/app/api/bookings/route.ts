import { NextResponse } from "next/server";
import { estimatePrice, validateRequest } from "@/lib/booking";
import { getServices, getSettings } from "@/lib/data";
import { getSupabaseAdmin } from "@/lib/supabase-server";

// Kunden senden nur eine Anfrage. Jeremia bestätigt sie im Admin.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Online-Anfragen sind gerade nicht verbunden. Bitte melde dich per Instagram." },
      { status: 503 },
    );
  }

  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const { data, errors } = validateRequest(body, { services, settings });
  if (!data) {
    return NextResponse.json({ error: "Bitte prüfe deine Angaben.", fields: errors }, { status: 422 });
  }

  const service = services.find((s) => s.id === data.service);
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
    price_estimate: estimatePrice(service, data.vehicleSize, settings),
  });

  if (error) {
    console.error("request insert failed", error);
    return NextResponse.json({ error: "Anfrage fehlgeschlagen. Bitte versuche es nochmals." }, { status: 500 });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
