# Medisch Rekenen App

Mobile-first, privacyvriendelijke oefenapp voor medisch rekenen op HBO-verpleegkunde niveau.

## Kenmerken

- Statische Vite + React + TypeScript app
- Tailwind CSS met lokaal kleurpalet
- Geen accounts, database, tracking, analytics of externe scripts
- Voortgang alleen lokaal in browser `localStorage`
- Dynamische parametrische vragen per categorie
- Uitlegmodus, toetsmodus en herhaalmodus
- Reset, export en import van voortgang
- Dockerized op poort `8912:8912`
- Tests voor rekenlogica en opslaghelpers
- GitHub Actions met test, build, npm audit en Trivy scan

## Lokale ontwikkeling

```bash
npm install
npm run dev
```

Open: `http://localhost:8912`

## Productiebuild

```bash
npm run test
npm run build
```

De statische output staat in `dist/`.

## Docker

De Dockerfile voert bewust geen `npm ci` meer uit. De container serveert alleen de reeds gebouwde `dist/` map.

Als je broncode wijzigt, bouw dan eerst lokaal opnieuw:

```bash
npm ci
npm run test
npm run build
```

Daarna:

```bash
docker compose up -d --build
```

Open lokaal:

```text
http://localhost:8912
```

Open via lokaal netwerk:

```text
http://<ip-van-docker-host>:8912
```

Docker Compose publiceert bewust alle interfaces met:

```yaml
ports:
  - "8912:8912"
```

## Security

De container gebruikt:

- non-root user
- read-only filesystem
- dropped Linux capabilities
- `no-new-privileges`
- `tmpfs` voor `/tmp`
- resource limits
- healthcheck
- kleine statische runtime zonder Next.js-server

Let op: HTTP security headers zoals CSP, X-Frame-Options en Permissions-Policy horen in productie bij voorkeur in je reverse proxy of webserver. Omdat je Nginx los regelt, staat in `docs/security-headers.example.conf` een voorbeeldconfiguratie.

## Disclaimer

Deze app is alleen bedoeld als oefentool. Niet gebruiken voor echte patiëntenzorg. Volg altijd lokale protocollen, medicatieveiligheidsafspraken en bevoegd/bekwaam handelen volgens de Wet BIG.

## Footer

Made by Martijn Vasterd, ChatGPT and Patience
