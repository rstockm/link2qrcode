# Link to QR Code - Discourse Theme Component

Eine Discourse Theme Component, die es ermöglicht, alle Links in einem Post als QR-Codes anzuzeigen.

## Features

- 🔗 **Automatische Link-Erkennung**: Findet alle Links in einem Post
- 📱 **QR-Code Generierung**: Generiert QR-Codes zur Laufzeit (client-seitig)
- 🔒 **Datenschutzfreundlich**: Keine URLs werden an externe Services gesendet
- 💾 **Keine Speicherung**: QR-Codes werden nur temporär im Browser generiert
- 🎨 **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten
- 🌙 **Dark Mode Support**: Passt sich automatisch an das Theme an

## Installation

1. Gehe in deinem Discourse-Forum zu **Admin** → **Customize** → **Themes**
2. Klicke auf **Install** → **From a git repository**
3. Gib die Repository-URL ein: `https://github.com/rstockm/link2qrcode`
4. Klicke auf **Install**
5. Aktiviere die Component für dein gewünschtes Theme

## Verwendung

Nach der Installation erscheint automatisch am Ende jedes Posts, der Links enthält, ein Button "**Links als QR-Codes anzeigen (X)**" (wobei X die Anzahl der Links ist).

Beim Klick auf den Button öffnet sich ein Modal mit allen QR-Codes:
- Jeder Link wird mit seinem Text und der URL angezeigt
- Der zugehörige QR-Code wird direkt daneben dargestellt
- Das Modal kann durch Klick außerhalb oder auf das X geschlossen werden

## Technische Details

### Client-seitige Generierung

Die QR-Codes werden vollständig im Browser des Benutzers generiert mittels der `qrcode-generator` Library. Es werden keine Daten an externe Services gesendet.

### Unterstützte Links

Die Component erkennt:
- ✅ Externe Links
- ✅ Interne Links
- ✅ HTTP/HTTPS Links
- ❌ Mentions (@username) werden ignoriert
- ❌ Hashtags (#topic) werden ignoriert
- ❌ JavaScript-Links werden ignoriert

### Anforderungen

- Discourse Version: 3.0.0 oder höher
- Moderne Browser mit JavaScript-Unterstützung

## Anpassung

Die Component kann über CSS-Variablen an dein Theme angepasst werden. Die wichtigsten Klassen:

- `.qr-code-trigger-button` - Der Button am Ende des Posts
- `.qr-code-modal` - Das Modal-Overlay
- `.qr-code-modal-content` - Der Modal-Inhalt
- `.qr-code-item` - Ein einzelner QR-Code mit Link-Info

## Entwicklung

### Struktur

```
link2qrcode/
├── about.json                          # Theme Component Metadaten
├── common/
│   └── common.scss                     # Styling
├── javascripts/
│   ├── discourse/
│   │   └── initializers/
│   │       └── link-qr-code.js         # Hauptlogik
│   └── lib/
│       └── qrcode-generator.js         # QR-Code Library
└── README.md
```

### Lokale Entwicklung

1. Klone das Repository
2. Erstelle ein Symlink in deinem lokalen Discourse Theme-Verzeichnis
3. Starte Discourse im Development-Modus
4. Die Änderungen werden automatisch geladen

## Lizenz

MIT License - siehe LICENSE Datei

## Credits

- QR-Code Generierung: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) von Kazuhiko Arase
- Entwickelt für [Discourse](https://www.discourse.org/)

## Support

Bei Fragen oder Problemen erstelle bitte ein Issue im GitHub Repository.
