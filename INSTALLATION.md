# Installationsanleitung - Link to QR Code Theme Component

## Installation über Git Repository

### Methode 1: Direkt von GitHub (empfohlen)

1. Melde dich als Administrator in deinem Discourse-Forum an
2. Gehe zu **Admin** → **Customize** → **Themes**
3. Klicke auf **Install** (oder **Installieren**)
4. Wähle **From a git repository** (oder **Aus einem Git-Repository**)
5. Gib die Repository-URL ein:
   ```
   https://github.com/rstockm/link2qrcode
   ```
6. Klicke auf **Install** (oder **Installieren**)
7. Warte, bis die Installation abgeschlossen ist

### Methode 2: Als ZIP hochladen

1. Lade das Repository als ZIP herunter
2. Gehe zu **Admin** → **Customize** → **Themes**
3. Klicke auf **Install** → **Upload**
4. Wähle die ZIP-Datei aus
5. Klicke auf **Install**

## Theme Component aktivieren

Nach der Installation musst du die Component einem Theme zuweisen:

1. Gehe zu **Admin** → **Customize** → **Themes**
2. Klicke auf das Theme, das du verwenden möchtest (z.B. "Default")
3. Scrolle nach unten zu **Theme Components**
4. Klicke auf **Add component** (oder **Komponente hinzufügen**)
5. Wähle **Link to QR Code** aus der Liste
6. Speichere die Änderungen

## Konfiguration (Optional)

Die Theme Component bietet verschiedene Einstellungsmöglichkeiten:

1. Gehe zu **Admin** → **Customize** → **Themes**
2. Klicke auf **Link to QR Code**
3. Gehe zum Tab **Settings** (oder **Einstellungen**)

### Verfügbare Einstellungen:

#### `qr_code_show_external_only`
- **Typ**: Boolean (true/false)
- **Standard**: false
- **Beschreibung**: Wenn aktiviert, werden nur QR-Codes für externe Links angezeigt (Links, die auf externe Websites verweisen)

#### `qr_code_size`
- **Typ**: Ganzzahl
- **Standard**: 200
- **Bereich**: 100 - 400
- **Beschreibung**: Größe der QR-Codes in Pixeln

#### `qr_code_button_text`
- **Typ**: Text
- **Standard**: "Links als QR-Codes anzeigen"
- **Beschreibung**: Text für den Button, der die QR-Codes anzeigt

#### `qr_code_error_correction`
- **Typ**: Auswahl (L, M, Q, H)
- **Standard**: M
- **Beschreibung**: Fehlerkorrektur-Level für QR-Codes
  - **L** = Low (7% Fehlertoleranz)
  - **M** = Medium (15% Fehlertoleranz) - empfohlen
  - **Q** = Quartile (25% Fehlertoleranz)
  - **H** = High (30% Fehlertoleranz)

## Verwendung

Nach der Installation und Aktivierung:

1. Erstelle einen neuen Post oder öffne einen existierenden Post mit Links
2. Am Ende des Posts erscheint automatisch ein Button "Links als QR-Codes anzeigen (X)"
   - X = Anzahl der gefundenen Links
3. Klicke auf den Button, um ein Modal mit allen QR-Codes zu öffnen
4. Jeder QR-Code wird mit dem zugehörigen Link-Text und der URL angezeigt

## Fehlerbehebung

### Button erscheint nicht

**Problem**: Der Button wird am Ende eines Posts nicht angezeigt

**Lösungen**:
- Prüfe, ob der Post tatsächlich Links enthält
- Wenn "Nur externe Links" aktiviert ist: Prüfe, ob externe Links vorhanden sind
- Lösche den Browser-Cache und lade die Seite neu
- Prüfe in den Browser-Entwicklertools (F12) die Konsole auf Fehlermeldungen

### QR-Codes werden nicht generiert

**Problem**: Das Modal öffnet sich, aber QR-Codes werden nicht angezeigt

**Lösungen**:
- Prüfe die Browser-Konsole auf JavaScript-Fehler
- Stelle sicher, dass die qrcode-generator.js Library korrekt geladen wurde
- Prüfe, ob die Links valide URLs sind

### Styling-Probleme

**Problem**: Das Design passt nicht zum Theme

**Lösungen**:
- Die Component nutzt CSS-Variablen von Discourse, sollte also automatisch passen
- Du kannst custom CSS in deinem Theme hinzufügen, um das Styling anzupassen

## Updates

Die Theme Component wird automatisch aktualisiert, wenn du die "Check for Updates" Funktion in Discourse verwendest:

1. Gehe zu **Admin** → **Customize** → **Themes**
2. Klicke auf **Check for updates** (oder **Nach Updates suchen**)
3. Wenn Updates verfügbar sind, klicke auf **Update**

## Deinstallation

Um die Component zu entfernen:

1. Gehe zu **Admin** → **Customize** → **Themes**
2. Klicke auf das Theme, das die Component verwendet
3. Scrolle zu **Theme Components**
4. Klicke auf das X neben **Link to QR Code**
5. Optional: Lösche die Component komplett über die Theme-Liste

## Support

Bei Problemen oder Fragen:
- Erstelle ein Issue im GitHub Repository
- Schreibe einen Post im Discourse Meta Forum
- Kontaktiere den Entwickler

## Systemanforderungen

- Discourse Version: 3.0.0 oder höher
- Moderne Browser mit JavaScript-Unterstützung
- Keine zusätzlichen Server-Anforderungen (alles läuft client-seitig)
