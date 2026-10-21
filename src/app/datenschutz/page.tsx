import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von jj.detailing01 für Terminanfragen.",
  alternates: { canonical: "/datenschutz" },
};

// TODO: Vor dem Livegang vollständige Datenschutzerklärung (revDSG) ergänzen.
export default function Datenschutz() {
  return (
    <LegalPage title="Datenschutz">
      <h2>Terminanfragen</h2>
      <p>
        Wenn du online eine Anfrage sendest, speichern wir Name, E-Mail, Telefonnummer, Fahrzeug, gewähltes Paket,
        Termin und deine Bemerkungen. Wir nutzen diese Angaben nur, um den Termin zu bestätigen und durchzuführen.
      </p>
      <h2>Speicherort</h2>
      <p>
        Die Buchungsdaten werden bei unserem Datenbank-Anbieter Supabase gespeichert. Eine Weitergabe an Dritte zu
        Werbezwecken findet nicht statt.
      </p>
      <h2>Auskunft und Löschung</h2>
      <p>Du kannst jederzeit Auskunft über deine Daten oder deren Löschung verlangen.</p>
    </LegalPage>
  );
}
