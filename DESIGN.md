# Cubesquare Studio — Design System Specification (`DESIGN.md`)

Design direction: **Calm precision of Apple with the refined restraint of Linear and Stripe**, rendered in tactile liquid glass.

---

## 1. Color Palette & Contrast Tokens

All tokens satisfy WCAG AA (≥ 4.5:1 for body/secondary text, ≥ 3.0:1 for large headings & UI borders).

### Light Surfaces (Default)
- **Background (`--color-bg`)**: `#FBFBFD`
- **Surface Card (`--color-surface`)**: `#FFFFFF`
- **Subtle Surface (`--color-subtle`)**: `#F5F5F7`
- **Primary Text (`--color-text`)**: `#1D1D1F` (Contrast ~16:1 against `#FBFBFD`)
- **Secondary Text (`--color-secondary`)**: `#5E5E63` (Contrast ≥ 4.8:1 against `#FFFFFF` / `#FBFBFD`)
- **Hairline / Border (`--color-hairline`)**: `rgba(0, 0, 0, 0.08)` / `#D2D2D7`
- **Primary Accent (`--color-accent`)**: `#0058CC` (Accessible vibrant blue, contrast ≥ 4.6:1 against white/glass)
- **Accent Hover (`--color-accent-hover`)**: `#0045A5`
- **Accent Light Tint**: `rgba(0, 88, 204, 0.08)`

### Dark Surfaces (Process Section / Dark Glass)
- **Background Dark (`--color-dark-bg`)**: `#0A0A0C`
- **Surface Dark (`--color-dark-surface`)**: `#141418`
- **Primary Text Dark (`--color-dark-text`)**: `#F5F5F7` (Contrast ~16:1 against dark bg)
- **Secondary Text Dark (`--color-dark-secondary`)**: `#B0B0B6` (Contrast ≥ 5.2:1 against dark bg)
- **Hairline Dark (`--color-dark-hairline`)**: `rgba(255, 255, 255, 0.12)`
- **Accent Dark (`--color-dark-accent`)**: `#3B82F6`

---

## 2. Spacing System (4px Base Unit)

Strict allowed spacing scale only:
`4px (1)`, `8px (2)`, `12px (3)`, `16px (4)`, `24px (6)`, `32px (8)`, `48px (12)`, `64px (16)`, `96px (24)`, `128px (32)`, `160px (40)`.

- **Global Container**:
  - `max-width: 1200px; margin-inline: auto; padding-inline: clamp(20px, 5vw, 48px);`
  - Used uniformly by Nav, Hero, Services, Work, Process, Contact, and Footer.
- **Section Vertical Padding**:
  - `clamp(80px, 11vw, 160px)`
- **Section Header Stack**:
  - Eyebrow to `h2`: `16px`
  - `h2` to Lead Paragraph: `20px–24px`
  - Header Block to Content: `56px–72px`
- **Card Padding & Gaps**:
  - Desktop: `32px` padding, `20px–24px` gap
  - Mobile: `24px` padding, `16px` gap
  - Icon to Title: `20px`
  - Title to Description: `8px–12px`
- **Buttons**:
  - Min height `48px`, padding-inline `28px`, adjacent button gap `12px–16px`
- **Forms**:
  - Label to Input: `8px`
  - Field to Field: `20px`
  - Form to Submit Button: `28px`

---

## 3. Typography Scale & Readability Rules

- **Font Family**: Inter (`--font-sans`), `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Font Sizes**:
  - **Hero Heading (`text-hero`)**: `clamp(2.75rem, 7.5vw, 6.25rem)`, line-height `1.04`, tracking `-0.04em`, `text-wrap: balance`
  - **Section Heading (`text-h2`)**: `clamp(2rem, 5vw, 3.75rem)`, line-height `1.08`, tracking `-0.03em`, `text-wrap: balance`
  - **Card Title (`text-h3`)**: `clamp(1.25rem, 2vw, 1.5rem)`, line-height `1.2`, tracking `-0.02em`
  - **Lead Paragraph (`text-lead`)**: `clamp(1.0625rem, 1.5vw, 1.25rem)`, line-height `1.55`, `text-wrap: pretty`, max-width `62ch`
  - **Body (`text-body`)**: `17px` (desktop) / `16px` (mobile), line-height `1.62`, `text-wrap: pretty`, max-width `65ch`
  - **Secondary Text**: Minimum `15px`, line-height `1.5`
  - **Captions / Meta**: Minimum `13px`, line-height `1.4`
  - **Eyebrow**: `12px`, weight `600`, tracking `0.12em`, uppercase. **Nothing below 12px anywhere.**

---

## 4. Radii Scale

- **Small (`rounded-sm`)**: `8px` (badges, tags, tooltips)
- **Medium (`rounded-md`)**: `12px` (inputs, keycaps)
- **Large (`rounded-lg`)**: `16px` (cards, dialogs)
- **Extra Large (`rounded-xl`)**: `24px` (outer section cards, bento tiles)
- **Pill (`rounded-full`)**: `9999px` (buttons, nav bar, status pills)

---

## 5. Liquid Glass System (Safe & Accessible)

All text must sit on high-contrast glass to ensure legibility across all viewport angles.

1. **`glass` (Light chrome/decorative only)**:
   - `background: rgba(255, 255, 255, 0.72);`
   - `backdrop-filter: blur(20px) saturate(180%);`
   - `border: 1px solid rgba(0, 0, 0, 0.08);`
   - `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9), 0 8px 32px rgba(0, 0, 0, 0.06);`

2. **`glass-strong` (All content cards & surfaces with text)**:
   - `background: rgba(255, 255, 255, 0.88);`
   - `backdrop-filter: blur(24px) saturate(190%);`
   - `border: 1px solid rgba(0, 0, 0, 0.09);`
   - `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 1), 0 12px 36px rgba(0, 0, 0, 0.08);`

3. **`glass-dark` (Process & Dark areas)**:
   - `background: rgba(20, 20, 24, 0.78);`
   - `backdrop-filter: blur(24px) saturate(160%);`
   - `border: 1px solid rgba(255, 255, 255, 0.12);`
   - `box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 16px 48px rgba(0, 0, 0, 0.4);`

- **Mobile optimization**: Reduce blur to `14px` on screen widths < 768px.
- **Accessibility**: `@media (prefers-reduced-transparency: reduce)` falls back to solid `#FFFFFF` or `#141418`.

---

## 7. Skeuomorphism System (One Light Source: Top-Left, Slightly Above)

Every element in the interface shares a single, physical light source situated top-left and slightly above. All highlights strike the top and left edges; shadows fall bottom-right with multi-layer depth.

### Physical Light Tokens (`globals.css`)
- `--hl-top`: `inset 0 1.5px 0 rgba(255, 255, 255, 0.75)` (crisp top lip specular reflection)
- `--hl-rim`: `inset 0 0 0 1px rgba(255, 255, 255, 0.45)` (beveled outer edge highlight)
- `--sh-inner-bottom`: `inset 0 -2px 4px rgba(0, 30, 100, 0.4)` (deep inner shadow on bottom wall)
- `--sh-contact`: `0 1px 1px rgba(0, 20, 60, 0.28)` (ultra-sharp surface contact shadow)
- `--sh-ambient`: `0 8px 24px -4px rgba(0, 70, 200, 0.38)` (soft mid-range ambient diffusion)
- `--sh-colored`: `0 18px 36px -10px rgba(0, 88, 204, 0.48)` (luminous colored under-glow)

### Skeuomorphic Component Library
1. **Primary Button (`.btn-primary` - Glossy "Jelly" Pill)**:
   - Glossy dome highlight overlay (`::before`) across the top half.
   - Specular diagonal sweep (`::after`) animated on hover.
   - Physical press travel (`translateY(2px) scale(0.985)`), collapsing shadows into an inset depression.
   - Magnetic cursor pull within 80px radius.
2. **Keycaps (`.keycap`)**:
   - 48–56px tactile rounded squares with top-lit gradient faces.
   - Chamfered rim with `inset 0 1.5px 0 #fff` highlight and `inset 0 -3px 0 rgba(0,0,0,0.12)` side wall.
   - Engraved icons with white bottom drop-shadow (`drop-shadow(0 1px 0 rgba(255,255,255,0.85))`).
   - Face depresses 2px on press with physical spring-back.
3. **Recessed Wells (`.field-well`, `.form-field-base`)**:
   - Inputs look pressed into the surface: `inset 0 2px 5px rgba(0,0,0,0.08)`, `inset 0 0 0 1px rgba(0,0,0,0.08)`, and bottom lip reflection `0 1px 0 rgba(255,255,255,0.9)`.
   - Focus: well "lights up" with accent inner glow and outer ring.
   - Skeuomorphic dropdown chevron keycap.
4. **Physical Glass Slabs (`.glass-slab`, `.glass-strong`)**:
   - Specular gradient borders, multi-layered contact/mid/ambient shadows.
   - Cursor-following 3D tilt up to 6 degrees with moving specular sheen.
5. **Rocker / Slider Switch (`SoundToggle`)**:
   - Recessed physical track with inner shadow.
   - Metallic/glass thumb with rim light, drop shadow, and spring travel with slight overshoot.
   - Glowing emerald LED dot (`#10B981`) for "on" state.
   - Optional UI audio click tick feedback (Web Audio API).

---

## 8. Quality Tiers (`useMotionTier()` in `src/lib/motion.js`)

Evaluated automatically on client mount:
- **`high` Tier** (fine pointer, hardwareConcurrency ≥ 8, no reduced-motion):
  - WebGL React Three Fiber glass cube (`MeshTransmissionMaterial` with chromatic aberration & refraction).
  - Continuous desktop cursor spotlight.
  - Full 3D card tilt with moving specular glares.
  - Multi-layer parallax and spring magnetic pull.
- **`mid` Tier** (Default):
  - Hardware-accelerated CSS 3D Glass Cube (`preserve-3d`, rim-lit faces, spring tilt).
  - Optimized shadows and backdrop blurs.
  - Magnetic pull and card hover lifts.
- **`low` Tier** (coarse touch devices, weak CPU ≤ 4 cores, `saveData`, or `prefers-reduced-motion: reduce`):
  - Static 3D fallback emblem.
  - Counters show final numbers instantly without ticking.
  - All continuous loops and tilt disabled.
  - Clean opacity reveals only.

### Tuning Motion Speed & Intensity
In `src/lib/motion.js`:
```js
export const MOTION_CONFIG = {
  MOTION_SPEED: 1.0,     // Adjust overall duration multiplier (e.g. 0.8 for snappier, 1.2 for cinematic)
  MOTION_INTENSITY: 1.0, // Adjust 3D tilt, magnetic pull, and parallax amplitude (0.0 to 1.0)
}
```
Changing these two values instantly adjusts every animation across the entire website.

