import { categoryLabels } from "@/lib/booking";
import { getServices, getSettings } from "@/lib/data";
import { buildFaqs } from "@/lib/faq";
import { BUSINESS, SITE_URL } from "@/lib/seo";

// llms.txt: kompakte, faktische Zusammenfassung für KI-Suchmaschinen (GEO).
// Wird aus den aktuellen Admin-Daten erzeugt, damit Preise nie veralten.
export const revalidate = 3600;

export async function GET() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);
  const faqs = buildFaqs(services, settings);

  const lines = [
    `# ${BUSINESS.name}`,
    "",
    `> ${BUSINESS.description}`,
    "",
    "## Fakten",
    `- Inhaber: ${BUSINESS.owner}`,
    `- Ort: ${settings.address} (${BUSINESS.postalCode} ${BUSINESS.city}, Kanton ${BUSINESS.region}, Schweiz)`,
    `- Einzugsgebiet: ${BUSINESS.city} und Umgebung`,
    `- Öffnungszeiten: Montag bis Freitag ${settings.hoursWeekday}${settings.saturdaySlots.length ? `, Samstag ${settings.hoursSaturday}` : ""}, Sonntag geschlossen`,
    "- Arbeitsweise: alles von Hand, keine Waschstrasse; Termine nur auf Anfrage, persönlich bestätigt",
    `- Instagram: ${settings.instagram}`,
    ...(settings.phone ? [`- Telefon: ${settings.phone}`] : []),
    ...(settings.email ? [`- E-Mail: ${settings.email}`] : []),
    `- Termin anfragen: ${SITE_URL}/#anfrage`,
    "",
    "## Pakete und Richtpreise (Kleinwagen, CHF)",
    ...services.map(
      (s) =>
        `- ${s.name} (${categoryLabels[s.category]}): ab CHF ${s.priceFrom}, ${s.duration.replace(/\.$/, "")}. ${s.short} Enthält: ${s.includes.join(", ")}.`,
    ),
    `- Preisfaktor nach Fahrzeuggrösse: mittel x${settings.sizeFactors.mittel}, gross x${settings.sizeFactors.gross}. Endpreis nach Zustand.`,
    "",
    "## Häufige Fragen",
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, ""]),
    "## Seiten",
    `- [Startseite](${SITE_URL}/): Leistungen, 3D-Ansicht, Vorher/Nachher, Pakete, Ablauf, Anfrageformular`,
    `- [Impressum](${SITE_URL}/impressum)`,
    `- [Datenschutz](${SITE_URL}/datenschutz)`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" },
  });
}
