# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Single-page static healthcare website for **Shimmering Meadow Health Clinic**. No build step, no framework, no package manager — open `index.html` directly in a browser.

## Running the site

```
start index.html          # Windows — opens in default browser
open index.html           # macOS
xdg-open index.html       # Linux
```

There is no dev server, bundler, or test suite.

## File structure

| File | Role |
|---|---|
| `index.html` | All markup. One file, no partials or templates. |
| `style.css` | All styles, linked from `<head>`. Mobile-first with CSS custom properties in `:root`. |
| `script.js` | All JS, loaded with `<script defer>` at end of `<head>`. |

## Architecture

### Design system
Colors and typography follow a deliberate "meadow" identity (warm botanical green + amber, not
generic medical teal) — see `design-system/shimmering-meadow-health-clinic/MASTER.md` for the
full rationale and token table before changing colors or fonts.

### CSS conventions
- Design tokens live in `:root` custom properties at the top of `style.css` (`--meadow-900/800/600/400`, `--amber-800/700/600/400`, `--coral-500`, `--bg`, `--text`, `--radius`, etc.). Change colours/spacing there first.
- Headings use **Fraunces** (serif), body text uses **Karla** (sans) — loaded via Google Fonts `<link>` in `<head>`.
- Layout uses CSS Grid with `repeat(auto-fit, minmax(...))` patterns. Breakpoints: 580px, 640px, 768px, 1024px.
- Fade-in entrance animation: add `.fade-in` to any element; `script.js` attaches an `IntersectionObserver` that adds `.visible` to trigger `@keyframes fadeInUp`. Sibling stagger is handled by `nth-child` delays in CSS.
- Focus rings default to a dark outline (`--meadow-900`) for the light surfaces used through most of the page; `.footer`, `.stats-section`, `.cta-band`, and `.trust-strip` override to a white ring since their backgrounds are dark.
- The grass/wildflower illustration (`.hero-botanical`, `.footer-botanical`) is the page's one signature visual element — don't add other decorative shapes alongside it.

### JavaScript modules (all in `script.js`)
1. **Sticky nav** — `scroll` event toggles `.scrolled` on `.navbar`.
2. **Hamburger** — click toggles `.open` on `#nav-menu`; outside-click and link-click both close it.
3. **Fade-in observer** — single `IntersectionObserver` instance watching all `.fade-in` elements.
4. **WhatsApp widget** — `#whatsapp-fab` toggles the `#whatsapp-panel` chat popover; quick-reply links build `wa.me` deep links from `data-query` attributes and the widget's `data-whatsapp-number`.
5. **Form** — `#enquiry-form` submit handler validates name, email (regex), and phone (≥7 digits), shows field-level `.error-msg` spans on failure, and posts to a FormSubmit.co endpoint (see `FORMSUBMIT_ENDPOINT` in `script.js`) — hides the form and shows `#success-banner` on success, or shows `#form-error` on a failed request.

### Sections (in DOM order)
`<nav>` → Hero (`#home`) → Stats band → About (`#about`) → Services (`#services`) → Testimonials (`#testimonials`) → Lead magnet (free checklist opt-in) → CTA band → Contact form (`#contact`) → Footer → WhatsApp chat widget (fixed, page-level)

### External assets
- **Google Fonts** — Fraunces (headings) + Karla (body), loaded via `<link>` in `<head>`.
- **Service card & clinic photos** — Unsplash CDN URLs (`images.unsplash.com`). Swap with real photos by replacing the `src` attributes on `.service-img-wrap img` and `.about-image img`.
- **Testimonial avatars** — `i.pravatar.cc` placeholder faces. Replace `src` on each `.avatar` `<img>` when real patient photos are available.
- **Hero background** — pure CSS gradient (no stock photo) plus the inline grass-signature SVG; edit `.hero` and `.hero-botanical` in `style.css`/`index.html` to change it.
- **WhatsApp number** — placeholder E.164 number in `data-whatsapp-number` on `#whatsapp-widget`; replace with the clinic's real number before launch.
