# jj.detailing01 Website

Next.js 16 (App Router) + Tailwind CSS 4 + Supabase für Online-Terminbuchungen.

## Starten

```bash
npm install
npm run dev
```

Hinweis: Wenn der Firmen-Proxy (`aproxy.corproot.net`) gesetzt ist, aber nicht erreichbar, schlagen `npm install` und das Laden der Google Fonts fehl. Dann so starten:

```bash
env -u http_proxy -u https_proxy -u HTTP_PROXY -u HTTPS_PROXY npm run dev
```

## Supabase verbinden

1. Auf [supabase.com](https://supabase.com) ein Projekt anlegen (Region z.B. Zürich/Frankfurt).
2. Im **SQL Editor** den Inhalt von `supabase/migrations/20261020000000_bookings.sql` ausführen.
3. `.env.example` nach `.env.local` kopieren und unter **Project Settings > API** eintragen:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (Secret Key, nur serverseitig)
4. Dev-Server neu starten. Buchungen erscheinen dann in der Tabelle `bookings`.

Ohne Keys funktioniert die Seite trotzdem, das Formular zeigt dann einen Hinweis auf Instagram.

## Aufbau

- `src/lib/booking.ts`: Pakete, Preise, Zeitslots, Validierung (hier Preise und Öffnungszeiten anpassen)
- `src/lib/site.ts`: Kontaktdaten (Telefon, E-Mail, Adresse)
- `src/app/api/slots`: liefert belegte Termine (nur Datum und Uhrzeit)
- `src/app/api/bookings`: speichert eine Buchung, verhindert Doppelbuchungen per Unique-Index
- `public/images`: mit ChatGPT generierte Bilder

## Buchungen verwalten

Status in Supabase direkt in der Tabelle ändern: `angefragt`, `bestaetigt`, `erledigt`, `storniert`. Stornierte Termine werden wieder frei.
