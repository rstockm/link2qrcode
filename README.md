# Link to QR Code

A [Discourse](https://www.discourse.org/) theme component that adds a post-menu button for generating QR codes from links contained in a post. QR codes are created entirely in the visitor's browser; no URLs are sent to external services.

**Repository:** https://github.com/rstockm/link2qrcode  
**License:** [MIT](LICENSE)  
**Minimum Discourse version:** 3.4.0 (requires the Glimmer post menu and `post-menu-buttons` value transformer)

---

## For administrators and site owners

### What it does

When a post contains at least one eligible link, a QR code icon appears in the post action menu (next to the copy-link button). Clicking it opens a modal listing each unique link with its label, URL, and a scannable QR code rendered as a real `<img>` element. Each QR code can be copied via the browser context menu (right-click), via dedicated action buttons, or saved as a PNG file.

Typical use cases:

- Sharing forum links on mobile devices without retyping URLs
- Presenting external references from a post in a workshop or classroom setting
- Giving users a quick offline-friendly way to open linked resources

### Privacy and data handling

- QR codes are generated **client-side** using an embedded JavaScript library (`qrcode-generator`).
- **No network requests** are made to third-party QR APIs.
- QR images exist only in the browser session; nothing is stored on the server.
- The component reads link URLs already present in the post (from Discourse's link metadata or rendered HTML).

### Installation

1. Go to **Admin → Customize → Themes**.
2. Click **Install → From a git repository**.
3. Enter: `https://github.com/rstockm/link2qrcode`
4. Click **Install**.
5. Open your active theme, scroll to **Theme components**, click **Add component**, and select **Link to QR Code**.

Alternatively, install from a ZIP export of this repository via **Install → Upload**.

### Updates

1. **Admin → Customize → Themes**
2. Select **Link to QR Code**
3. Click **Check for updates**, then **Update** if a new version is available

After updating, perform a hard refresh in the browser (Ctrl/Cmd + Shift + R).

### Configuration

Settings are available under **Admin → Customize → Themes → Link to QR Code → Settings**:

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| `qr_code_show_external_only` | boolean | `false` | When enabled, only links pointing outside the forum hostname are included. |
| `qr_code_size` | integer (100–400) | `200` | Display size of each QR code in pixels. |
| `qr_code_button_text` | string | `Links als QR-Codes anzeigen` | Tooltip and accessibility label prefix; the link count is appended automatically. |
| `qr_code_error_correction` | enum (`L` / `M` / `Q` / `H`) | `M` | QR error correction level (higher = more resilient, denser code). |

### Supported links

The component includes links that are:

- `http:` or `https:` URLs
- Present in the post via inline links, oneboxes, or Discourse `link_counts` metadata
- Internal or external (unless **external only** is enabled)

It ignores:

- `@mentions` and `#hashtag` links
- Fragment-only links (`#anchor`)
- Non-HTTP(S) schemes
- Reflection links (incoming link metadata, not authored content)

Up to **50 links** per post and **2048 characters** per URL are processed.

### User experience

- **Button location:** Post action menu, immediately to the right of the copy-link icon.
- **Button appearance:** QR icon only; full text appears as tooltip / `aria-label` (e.g. `Links als QR-Codes anzeigen (2)`).
- **Modal:** Lists deduplicated links; closes via the X button, clicking the overlay, or pressing Escape.
- **QR display:** Each code is shown as an `<img>` (GIF data URL from the embedded library), so **right-click → Copy image** and **Save image as…** work in all common browsers without HTTPS or Clipboard API support.
- **Per QR code:** Two optional action buttons below each code:
  - **Copy to clipboard** — saves the QR code as a PNG image to the system clipboard (requires a secure context / HTTPS).
  - **Save as PNG** — downloads the QR code as `qr-code-{hostname}.png`.
- **Responsive:** Modal layout adapts on narrow screens; styling uses Discourse CSS variables for theme compatibility.

### Troubleshooting

| Symptom | Likely cause | Action |
|---------|--------------|--------|
| Button never appears | Component not added to the active theme, or post has no eligible links | Confirm component assignment; test with a post containing a plain `https://` link |
| Button missing on onebox-only posts | Theme not updated after a fix | Update component and hard-refresh |
| Icon shows as empty circle | Custom icon sprite not loaded | Re-install/update theme; verify `assets/icons-sprite.svg` is present |
| Modal opens but no QR codes | JavaScript library failed to load | Check browser console; verify `assets/qrcode-generator.js` in theme assets |
| Copy to clipboard fails | Browser lacks Clipboard API support, or forum not served over HTTPS | Right-click the QR image and choose **Copy image**, or use **Save as PNG** |
| Button in wrong position | Custom `post_menu` site setting order | Component pins placement relative to `copyLink` and `edit`; report conflicts if another plugin overrides the same menu slot |

For bugs and feature requests, open an issue on GitHub.

---

## For developers and code reviewers

This section documents the implementation for external reviewers, contributors, and maintainers.

### Architecture overview

```
┌─────────────────────────────────────────────────────────────┐
│  apiInitializer (link-qr-code.js)                           │
│  registerValueTransformer("post-menu-buttons")              │
│    → adds LinkQRCodeButton when hasLinksForPost(post)       │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  LinkQRCodeButton (Glimmer .gjs)                            │
│    DButton + custom icon → openQRCodeModal(links)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│  link-qr-code.js (lib)                                      │
│    getLinksForPost() → dedupe → loadScript(qrcode lib)      │
│    → render modal DOM → <img> per URL → PNG export actions  │
└─────────────────────────────────────────────────────────────┘
```

The component deliberately avoids deprecated APIs (`decorateCooked`, `addPostMenuButton`) and integrates with Discourse's current Glimmer post menu via the [`post-menu-buttons` value transformer](https://meta.discourse.org/t/upcoming-post-menu-changes-how-to-prepare-themes-and-plugins/341014).

### Repository layout

```
link2qrcode/
├── about.json                              # Component metadata and asset registry
├── settings.yml                            # Admin-configurable theme settings
├── assets/
│   ├── icons-sprite.svg                    # Custom SVG icon (link2qrcode-qrcode)
│   └── qrcode-generator.js               # Vendored QR library (lazy-loaded)
├── common/
│   └── common.scss                         # Modal and QR item styles
└── javascripts/discourse/
    ├── initializers/link-qr-code.js        # Transformer registration
    ├── components/link-qr-code-button.gjs  # Post menu button component
    └── lib/link-qr-code.js                 # Link extraction, modal, QR rendering
```

### Key implementation details

#### Post menu integration

File: `javascripts/discourse/initializers/link-qr-code.js`

- Uses `apiInitializer` (no legacy `withPluginApi` version pin).
- Registers on `"post-menu-buttons"` and adds a Glimmer component to the menu DAG.
- Placement: `{ after: copyLink, before: edit }` so the icon sits beside the copy-link control.
- Guard conditions: post exists, not deleted, and `hasLinksForPost(post)` is true.

#### Link discovery

File: `javascripts/discourse/lib/link-qr-code.js`

Links are collected from three sources, merged, deduplicated by URL, and capped:

1. **`post.link_counts`** — server-provided link metadata (preferred; works for oneboxes).
2. **`post.cooked`** — parsed HTML including `a[href]` and `[data-onebox-src]`.
3. **Live DOM** — fallback query on the rendered post element (`#post_{id} .cooked`).

Normalization rejects non-HTTP(S) URLs, fragments, overlong URLs, and optionally internal hostnames when `qr_code_show_external_only` is enabled.

#### QR generation

- Library loaded on demand via `loadScript(settings.theme_uploads.qrcode_generator)`.
- Promise cached in module scope to avoid duplicate fetches.
- Each QR code is rendered as an `<img>` using `qrcode.createDataURL(cellSize, margin)`. The `cellSize` is derived from the admin `qr_code_size` setting and the QR module count so the image is generated at full resolution (not upscaled in HTML).
- User-visible link text and URLs are inserted with `textContent` (not HTML interpolation).

#### PNG export (copy and download)

Each successfully rendered QR code exposes two action buttons (in addition to native right-click copy/save on the image):

1. **Copy to clipboard** — draws the displayed image onto an off-screen `<canvas>`, converts to PNG, then writes it with `navigator.clipboard.write()` and `ClipboardItem` (blob wrapped in `Promise.resolve()` for Safari compatibility). Requires HTTPS and a browser that supports image clipboard operations.
2. **Save as PNG** — uses the same PNG blob and triggers a client-side download via a temporary `<a download>` element. Filename pattern: `qr-code-{hostname}.png`.

Buttons show inline feedback (`Copied!`, `Saved!`, or an error state) for two seconds. Export actions are omitted when QR generation fails for a given link.

#### Custom icon

Discourse's default icon subset does not include `qrcode`. The component ships `assets/icons-sprite.svg` registered as `icons-sprite` in `about.json`, exposing symbol id `link2qrcode-qrcode`.

Reference: [Discourse custom icons in themes](https://meta.discourse.org/t/introducing-font-awesome-5-and-svg-icons/101643).

### Security considerations (review focus)

| Area | Approach | Residual risk |
|------|----------|---------------|
| XSS in modal | Link labels/URLs set via `textContent`; QR shown as `<img src="data:...">` | Low — no user-controlled HTML in modal |
| Open redirect / malicious URLs | QR encodes whatever URL Discourse already rendered in the post | Inherits forum trust model; users scan at own risk |
| DoS via many/long links | Hard limits: 50 links, 2048 chars/URL | Large posts could still cause brief client CPU use on modal open |
| Third-party dependencies | Single vendored file in theme assets; no CDN | Supply-chain risk limited to bundled `qrcode-generator` |
| CSP | Assets served from theme; lazy load via Discourse `loadScript` | Should comply with standard Discourse CSP |
| Clipboard export | PNG written only to local clipboard via browser API; no server upload | Requires secure context; right-click copy on `<img>` works without Clipboard API |

Reviewers should verify the vendored `assets/qrcode-generator.js` matches a known release of [kazuhikoarase/qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) and has not been tampered with.

### Accessibility

- Post menu button exposes `title` and `aria-label` including link count.
- Modal uses `role="dialog"`, `aria-modal="true"`, and `aria-labelledby`.
- Close control has an explicit `aria-label`; Escape key dismisses the modal.
- Focus moves to the close button when the modal opens.

### Suggested code review checklist

- [ ] Post menu transformer follows current Discourse API (no deprecated widget/post-menu methods).
- [ ] Button placement remains correct with default and customized `post_menu` site settings.
- [ ] Link detection covers inline links, oneboxes, and edge cases (internal-only filter, deleted posts).
- [ ] Limits (`MAX_QR_LINKS`, `MAX_URL_LENGTH`) are appropriate for production load.
- [ ] No secrets, tracking pixels, or external network calls introduced.
- [ ] Theme settings read from global `settings` object (theme component convention).
- [ ] Custom icon sprite registered and referenced consistently.
- [ ] Modal DOM is removed on close; no duplicate listeners or leaked `keydown` handlers.
- [ ] QR codes render as `<img>` elements; right-click copy/save works without Clipboard API.
- [ ] PNG export (canvas conversion, clipboard, download) works on target browsers over HTTPS.
- [ ] SCSS uses Discourse CSS variables and does not break dark/light themes.
- [ ] `minimum_discourse_version` in `about.json` matches APIs actually used (≥ 3.4.0).

### Local development

1. Clone the repository.
2. Install as a theme component in a local Discourse instance (git URL or symlink into the theme path).
3. Run Discourse in development mode; JavaScript and SCSS changes hot-reload.
4. Test on a topic with: plain links, oneboxes, many links, internal-only setting, mobile viewport, right-click image copy, and PNG copy/download buttons.

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution workflow and commit conventions.

### Dependencies

| Dependency | Source | Loading |
|------------|--------|---------|
| Discourse core | Host application | `apiInitializer`, `DButton`, `loadScript`, post model |
| [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) | `assets/qrcode-generator.js` | Lazy via `loadScript` on first modal open |

No npm packages or build step are required for this theme component.

### Versioning

Theme version is declared in `about.json` (`theme_version`). Tag releases in GitHub when distributing stable snapshots to production forums.

---

## Credits

- QR code generation: [qrcode-generator](https://github.com/kazuhikoarase/qrcode-generator) by Kazuhiko Arase (MIT)
- Built for the [Discourse](https://www.discourse.org/) theme component system

## Support

Open an issue at https://github.com/rstockm/link2qrcode/issues for bugs, questions, or review feedback.
