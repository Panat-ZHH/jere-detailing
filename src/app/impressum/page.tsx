import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { getSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von jj.detailing01, Autoaufbereitung in Frauenfeld.",
  alternates: { canonical: "/impressum" },
};
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
        3D-Modell in der 3D-Ansicht:{" "}
        <a
          href="https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept"
          target="_blank"
          rel="noreferrer"
          className="text-fg underline underline-offset-2"
        >
          „Car Concept“
        </a>{" "}
        der Khronos Group, basierend auf einem Public-Domain-Modell von Unity Fan. Lizenz:{" "}
        <a
          href="https://creativecommons.org/licenses/by/4.0/deed.de"
          target="_blank"
          rel="noreferrer"
          className="text-fg underline underline-offset-2"
        >
          CC BY 4.0
        </a>
        . Änderungen: Lackfarbe und Materialien angepasst, Kennzeichen und Emblem ausgeblendet, Datei komprimiert.
      </p>
      <p>Die übrigen Fotos auf dieser Website sind Symbolbilder.</p>
    </LegalPage>
  );
}
