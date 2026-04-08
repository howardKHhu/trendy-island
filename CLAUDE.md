# CLAUDE.md — Trendy Island

## Project Overview

**Trendy Island** is a multilingual (Chinese/English/Japanese) static landing page for a fashion/culture podcast brand. It explores the intersection of fashion, identity, and society, aiming to discover "human warmth within trends in a cold tech era."

- **Live site**: https://trendyisland.pages.dev
- **Hosting**: Cloudflare Pages (primary) + GitHub Pages (via Actions)
- **Stack**: Pure HTML5 + CSS3 + Vanilla JavaScript — no frameworks, no build tools, no package manager

---

## Repository Structure

```
trendy-island/
├── index.html          # Single-page app entry point
├── style.css           # All styles (323 lines)
├── script.js           # i18n + interactivity (101 lines)
├── sitemap.xml         # Multilingual sitemap for SEO
├── images/
│   └── favicon.png     # Site favicon (530x531px PNG)
├── .github/
│   └── workflows/
│       └── static.yml  # GitHub Actions deploy to GitHub Pages
└── README.md           # Minimal placeholder
```

---

## Architecture

### Single-Page Static Site

Everything lives in `index.html`. There is no routing, no bundler, and no server-side logic.

### Multilingual System (`script.js`)

Content is stored in a plain JS object `i18n` with keys `zh`, `en`, `ja`. Each key maps to an object of content strings keyed by element ID.

**Language detection priority** (evaluated on `DOMContentLoaded`):
1. URL query param: `?lang=en`
2. `localStorage.getItem('preferredLang')`
3. `navigator.language` prefix match
4. Default: `'en'`

**To add new translatable text:**
1. Add the element to `index.html` with a unique `id`
2. Add the key to all three language objects in `script.js`
3. Add `document.getElementById('your-id').innerText = t.your_key;` inside `updateContent()`

**To add a new language:**
1. Add a new key to the `i18n` object in `script.js`
2. Add a `<span>` with `onclick="changeLang('xx')"` to the `.lang-switcher` in `index.html`
3. Add `<link rel="alternate" hreflang="xx">` tags to the `<head>`
4. Add the language to the supported list check in `script.js`
5. Add entries to `sitemap.xml`

---

## CSS Conventions

### CSS Variables (defined in `:root`)

| Variable | Value | Usage |
|---|---|---|
| `--bg-color` | `#0a0a0b` | Page background |
| `--text-main` | `#ffffff` | Primary text |
| `--accent-warm` | `linear-gradient(135deg, #ff8a00, #e52e71)` | Brand gradient (orange → pink) |
| `--glass` | `rgba(255,255,255,0.03)` | Glass card background |
| `--glass-border` | `rgba(255,255,255,0.08)` | Glass card border |
| `--transition` | `0.3s cubic-bezier(0.4,0,0.2,1)` | All hover/state transitions |

Always use these variables rather than hardcoding color or transition values.

### Key CSS Patterns

- **Gradient text**: `background: var(--accent-warm); -webkit-background-clip: text; -webkit-text-fill-color: transparent;`
- **Glass card**: `.glass-card` — uses `backdrop-filter: blur(20px)`, `background: var(--glass)`, `border-radius: 24px`
- **Responsive typography**: Use `clamp()` for font sizes (e.g. `clamp(2rem, 5vw, 4rem)`)
- **Hover platform colors**: Spotify uses `#1DB954`, Apple Podcasts uses `#a05aff`

### Responsive Breakpoint

Single breakpoint at `768px` — mobile-first flex direction changes.

---

## HTML Conventions

- Semantic sectioning: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`
- Each section has an `id` for in-page anchor and JS targeting
- Language-switched text elements are identified by `id` (e.g. `id="hero-title"`)
- Podcast platform buttons use `.podcast-link` + `.icon-wrapper` structure
- The Spotify iframe must keep `width="100%"` and `height="152"` for the compact player

### `<head>` Tag Checklist

When modifying `index.html`, ensure these are kept up to date:
- `<title>` and `<meta name="description">` — update for content changes
- `og:title`, `og:description`, `og:image` — Open Graph for social sharing
- `hreflang` alternate links — must list all three language variants
- JSON-LD `@type: Organization` block — update `name`, `url`, `description` if branding changes

---

## SEO and Metadata

- `sitemap.xml` lists three URLs (one per language) with `hreflang` annotations
- **Known issue**: `sitemap.xml` contains placeholder domain `https://你的專案.pages.dev/` — replace with the real domain `https://trendyisland.pages.dev/` if updating
- Priority: `zh` = 1.0, `en` = 0.8, `ja` = 0.8

---

## Deployment

### Cloudflare Pages (primary)

Auto-deploys from the repository. No build command needed — the output directory is the repo root.

### GitHub Pages (secondary)

`.github/workflows/static.yml` triggers on push to `main` and deploys the repo root as a static artifact using the standard `actions/upload-pages-artifact` + `actions/deploy-pages` workflow.

**No build step** — the workflow uploads the raw files directly.

---

## Development Workflow

### Making Changes

Since there is no build system, development is direct file editing:

1. Edit `index.html`, `style.css`, or `script.js` directly
2. Open `index.html` in a browser to preview (or use a local HTTP server for accurate behavior)
3. Test all three languages by appending `?lang=zh`, `?lang=en`, `?lang=ja` to the URL

### Testing Checklist

Before committing:
- [ ] All three language variants render correctly
- [ ] Back-to-top button appears on scroll and works
- [ ] Spotify embed loads in the `#latest-episode` section
- [ ] Podcast platform links are present and styled correctly
- [ ] No JS console errors
- [ ] Page looks correct at both desktop (>768px) and mobile (<768px)
- [ ] Open Graph meta tags are accurate

### Git Conventions

- Commit messages are plain English, imperative mood (e.g. `Add Japanese translations for about section`)
- Work is done directly on feature branches, then merged to `main` for deployment

---

## Common Tasks

### Update Podcast Episode

In `index.html`, locate the Spotify iframe and update the `src` attribute with the new episode embed URL:
```html
<iframe src="https://open.spotify.com/embed/episode/NEW_EPISODE_ID" ...>
```

### Add/Update Translations

Edit the `i18n` object in `script.js`. Each language block contains the same set of keys.

### Change Brand Colors

Update `--accent-warm` in the `:root` block of `style.css`. All gradient uses will update automatically.

### Add a New Section

1. Add the `<section id="new-section">` block inside `<main class="container">` in `index.html`
2. Use the `.glass-card` class for consistent styling
3. If the section has translatable text, add the element IDs to all three language objects in `script.js`

---

## Constraints and Guidelines for AI Assistants

- **No frameworks**: Do not introduce React, Vue, or any JS framework. The project intentionally uses vanilla HTML/CSS/JS.
- **No build tools**: Do not add npm, webpack, vite, or any bundler. There is no `package.json`.
- **Preserve CSS variables**: Always use the defined CSS variables; never hardcode hex values.
- **Keep i18n complete**: Any new user-facing text must be translated into all three languages (`zh`, `en`, `ja`).
- **Maintain dark theme**: The site is dark-mode only. Do not add light mode unless explicitly requested.
- **Minimal additions**: This is a purposefully minimal site. Avoid adding complexity beyond what is requested.
- **Test multilingual**: Any change to content-related code must be verified against all three language variants.
- **Google AdSense**: The AdSense script in `<head>` should not be removed or modified.
