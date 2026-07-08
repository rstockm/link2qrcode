# Projekt-Zusammenfassung: Link to QR Code Theme Component

## Übersicht

Diese Discourse Theme Component fügt dem Post-Aktionsmenü ein QR-Code-Icon hinzu. Enthält ein Post gültige Links, öffnet ein Klick ein Modal mit QR-Codes für alle eindeutigen URLs. Die Generierung erfolgt vollständig client-seitig; keine URLs werden an externe Dienste gesendet.

## Technische Details

### Architektur

**Client-seitige Lösung**
- QR-Codes werden im Browser zur Laufzeit generiert
- Keine Server-Last, keine Speicherung auf dem Server
- Datenschutzfreundlich (keine externen QR-APIs)

**Verwendete Technologien**
- Discourse `apiInitializer` + `registerValueTransformer("post-menu-buttons")`
- Glimmer-Komponente (`link-qr-code-button.gjs`)
- qrcode-generator (vendored, lazy-loaded)
- SCSS mit Discourse CSS-Variablen
- ES6+ JavaScript

### Kernfunktionalität

1. **Link-Erkennung** — aus `post.link_counts`, `post.cooked` (Oneboxes, Inline-Links) und DOM-Fallback
2. **Post-Menü-Button** — QR-Icon direkt rechts neben „Link kopieren“
3. **QR-Code-Modal** — pro Link: Bild, Titel, URL; ESC / Overlay / X zum Schließen
4. **Export** — Rechtsklick auf `<img>` (kopieren/speichern), optional Buttons für Clipboard (PNG) und Download (PNG)
5. **Konfiguration** — Größe, Fehlerkorrektur, nur externe Links, Button-Text

## Dateistruktur

```
link2qrcode/
├── about.json
├── settings.yml
├── assets/
│   ├── icons-sprite.svg
│   └── qrcode-generator.js
├── common/common.scss
└── javascripts/discourse/
    ├── initializers/link-qr-code.js
    ├── components/link-qr-code-button.gjs
    └── lib/link-qr-code.js
```

## Features (Stand 1.3.0)

- [x] Post-Menü-Integration (Discourse ≥ 3.4.0)
- [x] Link-Erkennung inkl. Oneboxes
- [x] QR-Codes als `<img>` (Rechtsklick-Kopieren)
- [x] PNG in Zwischenablage kopieren (HTTPS)
- [x] PNG herunterladen
- [x] Responsive Modal, Dark Mode
- [x] Limits: 50 Links, 2048 Zeichen/URL

## Systemanforderungen

- Discourse 3.4.0+
- Moderne Browser (Chrome, Firefox, Safari, Edge)

## Lizenz

MIT License

---

**Version:** 1.3.0  
**Autor:** Ralf Stockmann  
**Repository:** https://github.com/rstockm/link2qrcode
