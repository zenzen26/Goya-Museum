# Goya — Interactive Museum Experience

A cinematic, scroll-driven single-page museum experience dedicated to Francisco Goya. Built with React + Vite + TypeScript + TailwindCSS v4 + GSAP ScrollTrigger.

---

## Setup

```bash
npm install
npm run dev
```

---

## Required Assets

Place the following image files in the `/public` directory:

| File | Section |
|------|---------|
| `artist.jpg` | Section 1 — The Artist (left column portrait) |
| `the-parasol.jpg` | Section 2 — The Parasol (full background) |
| `don-luis.jpg` | Section 3 — Rise to Court (background layer 1) |
| `charles.jpg` | Section 3 — Rise to Court (background layer 2) |
| `third-may.jpg` | Section 4 — Peninsular War (top half) |
| `second-may.jpg` | Section 4 — Peninsular War (bottom half) |
| `other-work-1.jpg` | Section 5 — Other Works (card 1) |
| `other-work-2.jpg` | Section 5 — Other Works (card 2) |
| `other-work-3.jpg` | Section 5 — Other Works (card 3) |
| `other-work-4.jpg` | Section 5 — Other Works (card 4) |
| `saturn.png` | Section 6 — Saturn Devouring His Son |
| `witches.jpg` | Section 7 — Witches' Sabbath |
| `pilgrimage.jpg` | Section 8 — Pilgrimage of San Isidro |
| `soup.jpg` | Section 9 — Two Old Men Eating Soup |

---

## Architecture

```
src/
├── components/
│   ├── CustomCursor.tsx       # GSAP-driven custom cursor
│   ├── Hero.tsx               # Opening hero section
│   ├── SectionArtist.tsx      # Two-column biographical section
│   ├── FullImageSection.tsx   # Reusable full-bg image section (Parasol)
│   ├── SectionRiseToCourt.tsx # Crossfade dual-image section
│   ├── SectionPeninsularWar.tsx # Split-screen slide-in section
│   ├── SectionOtherWorks.tsx  # Horizontal scroll carousel
│   ├── BlackPainting.tsx      # Black Paintings with canvas burn effect
│   └── ClosingAndFooter.tsx   # Closing quote + footer
├── App.tsx                    # Main orchestration
├── main.tsx
└── index.css                  # TailwindCSS v4 @theme + global styles
```

---

## Key Techniques

- **GSAP ScrollTrigger** with `scrub: true` for all scroll-linked animations
- **Canvas burn effect** — ragged sinusoidal edge with ember glow, growing from bottom-right to top-left between Black Painting sections
- **Backdrop-filter blur** driven manually via `onUpdate` callbacks (browser compatibility)
- **Image crossfade** in Section 3 driven by scroll progress
- **Horizontal carousel** via GSAP `x` translation pinned section
- **Paper grain** — SVG noise pattern at 4% opacity fixed to viewport
- **Custom cursor** — 12px circle expanding to 28px on interactive elements
- **Mousemove parallax** on full-image sections (±14px x, ±10px y)
- **TailwindCSS v4** — no config file, CSS custom properties via `@theme` directive

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Near-black | `#1e1e20` | Dominant background |
| Aged gold | `#a99767` | Headings, accents, burn edge |
| Olive-grey | `#828d6d` | Body copy, descriptions |
| Stone-grey | `#787874` | Labels, captions, metadata |
| Ember | `#c46a1f` | Canvas burn edge glow |

**Fonts:** Playfair Display (display) · Cormorant Garamond (body) · Inter (labels)
