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

### CSS conventions
- Design tokens live in `:root` custom properties at the top of `style.css` (`--primary`, `--teal`, `--accent`, `--radius`, etc.). Change colours/spacing there first.
- Layout uses CSS Grid with `repeat(auto-fit, minmax(...))` patterns. Breakpoints: 580px, 640px, 768px, 1024px.
- Fade-in entrance animation: add `.fade-in` to any element; `script.js` attaches an `IntersectionObserver` that adds `.visible` to trigger `@keyframes fadeInUp`. Sibling stagger is handled by `nth-child` delays in CSS.

### JavaScript modules (all in `script.js`)
1. **Sticky nav** — `scroll` event toggles `.scrolled` on `.navbar`.
2. **Hamburger** — click toggles `.open` on `#nav-menu`; outside-click and link-click both close it.
3. **Fade-in observer** — single `IntersectionObserver` instance watching all `.fade-in` elements.
4. **Form** — `#enquiry-form` submit handler validates name, email (regex), and phone (≥7 digits), shows field-level `.error-msg` spans on failure, or hides the form and shows `#success-banner` on success. The API call stub is clearly marked with a `TODO` comment.

### Sections (in DOM order)
`<nav>` → Hero (`#home`) → About (`#about`) → Services (`#services`) → Testimonials (`#testimonials`) → Contact form (`#contact`) → Footer

### External assets
- **Google Fonts** — Inter (400/600/700), loaded via `<link>` in `<head>`.
- **Service card & clinic photos** — Unsplash CDN URLs (`images.unsplash.com`). Swap with real photos by replacing the `src` attributes on `.service-img-wrap img` and `.about-image img`.
- **Testimonial avatars** — `i.pravatar.cc` placeholder faces. Replace `src` on each `.avatar` `<img>` when real patient photos are available.
- **Hero background** — Unsplash photo in CSS: `.hero { background: linear-gradient(...), url('...') }` in `style.css`.
