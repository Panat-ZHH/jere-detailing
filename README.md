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
2. Im **SQL Editor** nacheinander ausführen:
   - `supabase/migrations/20261020000000_bookings.sql`
   - `supabase/migrations/20261021000000_admin_services.sql` (Pakete/Preise, Einstellungen, Admin-Login)
3. `.env.example` nach `.env.local` kopieren und unter **Project Settings > API** eintragen:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (Secret Key, nur serverseitig)
4. Dev-Server neu starten. Buchungen erscheinen dann in der Tabelle `bookings`.

Ohne Keys funktioniert die Seite trotzdem, das Formular zeigt dann einen Hinweis auf Instagram.

## Admin (`/admin`)

Ein einziger Login: Benutzer `jere_admin`. Das Passwort liegt nur als bcrypt-Hash in der Tabelle `admin_users`, Sessions in `admin_sessions` (httpOnly-Cookie, 12 Std.). Nach 5 Fehlversuchen ist der Login 15 Minuten gesperrt.

Im Dashboard:
- **Anfragen** bestätigen, absagen, als erledigt markieren, interne Notizen. Bestätigte Termine sind auf der Website belegt.
- **Preise & Pakete** bearbeiten oder neue anlegen. Die Website aktualisiert sich beim Speichern.
- **Einstellungen**: Kontakt, Öffnungszeiten, Startzeiten, Preisfaktoren nach Fahrzeuggrösse, Passwort ändern.

Passwort per Terminal neu setzen (z.B. falls vergessen):

```bash
ADMIN_PASSWORD='neues-langes-passwort' node --env-file=.env.local scripts/set-admin-password.mjs jere_admin
```

## Aufbau

- `src/lib/booking.ts`: Typen, Preisberechnung, Wunschtermine, Validierung
- `src/lib/data.ts`: lädt Pakete und Einstellungen aus Supabase
- `src/lib/auth.ts`: Admin-Login und Sessions
- `src/app/api/slots`: liefert bestätigte Termine (nur Datum und Uhrzeit)
- `src/app/api/bookings`: speichert eine Anfrage (Status `angefragt`)
- `src/components/three/CarScene.tsx`: 3D-Ansicht mit three.js
- `public/models/car.glb`: 3D-Modell „Car Concept“ (Khronos, CC BY 4.0), komprimiert
- `public/images`: mit ChatGPT generierte Bilder

