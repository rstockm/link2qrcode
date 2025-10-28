# Beitragen zur Link to QR Code Theme Component

Vielen Dank für dein Interesse, zu diesem Projekt beizutragen!

## Entwicklungsumgebung einrichten

### Voraussetzungen

- Git
- Eine lokale Discourse-Installation (für Tests)
- Grundkenntnisse in JavaScript, HTML/CSS

### Lokale Entwicklung

1. **Repository klonen:**
   ```bash
   git clone https://github.com/rstockm/link2qrcode.git
   cd link2qrcode
   ```

2. **In lokaler Discourse-Installation testen:**
   
   Option A - Symlink (empfohlen für Entwicklung):
   ```bash
   cd /path/to/discourse
   ln -s /path/to/link2qrcode app/assets/javascripts/discourse/theme-components/link-qr-code
   ```

   Option B - Über Git-URL in Discourse Admin installieren:
   - Gehe zu Admin → Customize → Themes
   - Install → From a git repository
   - Gib deine lokale Git-URL ein

3. **Änderungen testen:**
   - Starte Discourse im Development-Modus
   - Änderungen an JavaScript/CSS werden automatisch neu geladen
   - Browser-Cache leeren falls nötig

## Projektstruktur

```
link2qrcode/
├── about.json                          # Theme Component Metadaten
├── settings.yml                        # Konfigurierbare Einstellungen
├── common/
│   └── common.scss                     # Styling
├── javascripts/
│   ├── discourse/
│   │   └── initializers/
│   │       └── link-qr-code.js         # Hauptlogik
│   └── lib/
│       └── qrcode-generator.js         # QR-Code Library
├── LICENSE                             # MIT Lizenz
├── README.md                           # Projekt-Dokumentation
├── INSTALLATION.md                     # Installations-Anleitung
└── CONTRIBUTING.md                     # Diese Datei
```

## Code-Stil

### JavaScript

- Verwende ES6+ Syntax
- 2 Spaces für Einrückung
- Semikolons verwenden
- Aussagekräftige Variablennamen
- Kommentare für komplexe Logik

### CSS/SCSS

- 2 Spaces für Einrückung
- Nutze Discourse CSS-Variablen (z.B. `var(--primary)`)
- Mobile-First Ansatz
- BEM-ähnliche Namenskonvention für Klassen

### Kommentare

- Deutsche Kommentare im Code (da die Zielgruppe deutsch ist)
- Englische Commit-Messages

## Pull Request Prozess

1. **Fork** das Repository

2. **Erstelle einen Feature-Branch:**
   ```bash
   git checkout -b feature/meine-neue-funktion
   ```

3. **Mache deine Änderungen:**
   - Halte Commits atomar und fokussiert
   - Schreibe aussagekräftige Commit-Messages
   - Teste deine Änderungen gründlich

4. **Commit-Messages:**
   ```bash
   git commit -m "Add: Neue Funktion XYZ"
   git commit -m "Fix: Bug in QR-Code Generierung"
   git commit -m "Update: Styling für Mobile"
   ```

   Präfixe:
   - `Add:` - Neue Features
   - `Fix:` - Bugfixes
   - `Update:` - Änderungen an bestehendem Code
   - `Refactor:` - Code-Verbesserungen ohne Funktionsänderung
   - `Docs:` - Dokumentations-Änderungen

5. **Push zum Fork:**
   ```bash
   git push origin feature/meine-neue-funktion
   ```

6. **Erstelle einen Pull Request:**
   - Beschreibe die Änderungen ausführlich
   - Verlinke relevante Issues
   - Füge Screenshots hinzu (bei UI-Änderungen)

## Testing

### Manuelle Tests

Teste folgende Szenarien:

1. **Link-Erkennung:**
   - Post mit mehreren Links
   - Post ohne Links
   - Post mit Mentions und Hashtags
   - Post mit externen und internen Links

2. **QR-Code Generierung:**
   - Kurze URLs
   - Lange URLs
   - URLs mit Sonderzeichen
   - Verschiedene Error Correction Levels

3. **UI/UX:**
   - Desktop (verschiedene Bildschirmgrößen)
   - Mobile (Portrait und Landscape)
   - Dark Mode und Light Mode
   - Verschiedene Discourse Themes

4. **Settings:**
   - Alle Einstellungen testen
   - Edge Cases (min/max Werte)

### Browser-Kompatibilität

Teste in:
- Chrome/Edge (Chromium)
- Firefox
- Safari (Desktop und iOS)
- Mobile Browser

## Feature-Requests und Bugs

### Bug Report

Bitte inkludiere:
- Discourse Version
- Browser und Version
- Schritte zur Reproduktion
- Erwartetes vs. tatsächliches Verhalten
- Screenshots/Logs falls möglich
- Console-Fehler (F12 → Console)

### Feature Request

Beschreibe:
- Das Problem/den Use Case
- Deine vorgeschlagene Lösung
- Alternative Lösungsansätze
- Zusätzliche Informationen

## Fragen?

Bei Fragen kannst du:
- Ein Issue eröffnen
- Eine Diskussion im Repository starten
- Mich direkt kontaktieren

## Code of Conduct

- Sei respektvoll und konstruktiv
- Hilf anderen bei Fragen
- Fokussiere dich auf das Problem, nicht die Person
- Akzeptiere konstruktive Kritik

## Lizenz

Durch Beiträge stimmst du zu, dass deine Änderungen unter der MIT-Lizenz lizenziert werden.
