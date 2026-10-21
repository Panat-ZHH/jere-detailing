import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = { title: "Impressum | jj.detailing01" };
export const revalidate = 3600;

// TODO: Nachname, vollständige Adresse und ggf. UID-Nummer ergänzen (im Admin unter Einstellungen).
export default async function Impressum() {
  const s = await getSettings();
  return (
    <LegalPage title="Impressum">
      <h2>Verantwortlich</h2>
      <p>
        jj.detailing01
        <br />
        Jeremia
        <br />
        {s.address}
      </p>
      <h2>Kontakt</h2>
      {s.email && <p>{s.email}</p>}
      {s.phone && <p>{s.phone}</p>}
      <p>Instagram: {s.instagram}</p>
      <h2>Bildnachweis</h2>
      <p>
        3D-Modell „Car Concept“ der Khronos Group, basierend auf einem Public-Domain-Modell von Unity Fan, lizenziert
        unter CC BY 4.0. Die Lackfarbe wurde angepasst.
      </p>
    </LegalPage>
  );
}
