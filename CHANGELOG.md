# Changelog

Alle relevante wijzigingen volgen Semantic Versioning.

## 0.2.2 - 2026-05-12

### Opgelost
- Docker build gebruikt geen `npm ci` meer. De productiecontainer kopieert de vooraf gebouwde statische `dist/` bestanden, waardoor de npm `Exit handler never called` buildfout wordt omzeild.
- Docker blijft volledig statisch, non-root en luistert op `8912:8912`.

### Behouden
- Klein, onopvallend versienummer op de frontpage/footer.

## 0.2.0 - 2026-05-12

### Gewijzigd
- Omgebouwd van Next.js runtime naar een lichtere statische Vite/React/TypeScript build.
- Mobile-first oefenscherm: één vraag centraal, grotere knoppen, inklapbare rekenmachine op mobiel.
- Productiecontainer serveert alleen statische bestanden via BusyBox httpd op poort 8912.
- Docker Compose gebruikt expliciet `8912:8912` en geen vaste `container_name`.

### Behouden
- Dynamische parametrische vraagengine.
- Lokale voortgang, reset, export en import.
- Tailwind CSS, tests, Docker hardening en CI security checks.

## 0.1.3
- Docker intern/extern op poort 8912.

## 0.1.2
- `public/` build-fout opgelost.

## 0.1.1
- Reset/export/import voor lokale voortgang toegevoegd.

## 0.1.0
- Dynamische vragenengine en Docker hardening toegevoegd.
