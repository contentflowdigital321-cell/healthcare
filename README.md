# Shimmering Meadow Health Clinic

A fully responsive, single-page healthcare website built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step.

**Live site:** https://contentflowdigital321-cell.github.io/healthcare/

![Shimmering Meadow Health Clinic — homepage screenshot](screenshot.png)

---

## Features

- **Sticky navigation** with smooth scroll and mobile hamburger menu
- **Hero section** with full-bleed photo background and trust strip
- **About section** with two-column layout and clinic photo
- **Services grid** — six cards with photo thumbnails and hover zoom
- **Testimonials** — four patient reviews with real avatar photos
- **Enquiry form** with client-side validation (name, email, phone) and inline field-level error messages
- **Fade-in on scroll** via `IntersectionObserver`
- Fully accessible — semantic HTML5, ARIA labels, keyboard-navigable

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styles | CSS3 (custom properties, CSS Grid, `@keyframes`) |
| Scripting | Vanilla JavaScript (ES6+) |
| Fonts | Google Fonts — Inter 400/600/700 |
| Photos | Unsplash CDN (scene photos), pravatar.cc (avatars) |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions |

## File structure

```
healthcare/
├── index.html          # All markup
├── style.css           # All styles (mobile-first)
├── script.js           # All JavaScript
├── screenshot.png      # Homepage screenshot (auto-generated)
├── scripts/
│   └── screenshot.js   # Playwright screenshot utility
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions deploy workflow
```

## Running locally

No server or install needed — open the file directly:

```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

## Regenerating the screenshot

```bash
node scripts/screenshot.js
```

Requires Node.js — Playwright and Chromium are fetched automatically via `npx`.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

To set it up in a fork:

1. Go to **Settings → Pages** in your repository
2. Set **Source** to **GitHub Actions**
3. Push to `main` — the workflow handles the rest

## Customisation

### Colours
All design tokens are CSS custom properties in the `:root` block at the top of `style.css`:

```css
:root {
  --primary: #0b6e8c;
  --teal:    #14b8a6;
  --accent:  #f97316;
}
```

### Photos
- **Hero background** — update the `url(...)` inside `.hero` in `style.css`
- **Service card photos** — replace the `src` on each `.service-img-wrap img` in `index.html`
- **About photo** — replace the `src` on `.about-image img` in `index.html`
- **Testimonial avatars** — replace the `src` on each `.avatar` in `index.html`

### Form submission
The form logs data to the console by default. Replace the `console.log` block in `script.js` with a real API call:

```js
fetch('/api/enquiry', {
  method:  'POST',
  headers: { 'Content-Type': 'application/json' },
  body:    JSON.stringify(data),
});
```
