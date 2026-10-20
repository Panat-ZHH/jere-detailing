// Kontaktdaten zentral pflegen. Felder mit `null` werden auf der Website nicht angezeigt.
export const site = {
  name: "jj.detailing01",
  tagline: "Professional Auto Care",
  instagram: "https://www.instagram.com/jj.detailing01/",
  instagramHandle: "@jj.detailing01",
  email: null as string | null, // z.B. "termine@jj-detailing.ch"
  phone: null as string | null, // z.B. "+41 79 000 00 00"
  address: null as string | null, // z.B. "Musterstrasse 12, 8000 Zürich"
  hours: [
    { days: "Montag bis Freitag", time: "08:00 - 18:00" },
    { days: "Samstag", time: "09:00 - 14:00" },
  ],
};
