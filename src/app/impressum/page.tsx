import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Impressum | jj.detailing01" };

// TODO: Inhaber, Adresse und ggf. UID-Nummer eintragen.
export default function Impressum() {
  return (
    <LegalPage title="Impressum">
      <h2>Verantwortlich</h2>
      <p>jj.detailing01</p>
      {site.address && <p>{site.address}</p>}
      <h2>Kontakt</h2>
      {site.email && <p>{site.email}</p>}
      {site.phone && <p>{site.phone}</p>}
      <p>Instagram: {site.instagramHandle}</p>
    </LegalPage>
  );
}
