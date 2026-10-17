# Cubesquare Studio

<p align="center">
  <strong>A bespoke digital agency experience blending the calm precision of Apple with the refined restraint of Linear and Stripe.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Motion-v14-FF0055?style=for-the-badge&logo=framer" alt="Motion" />
  <img src="https://img.shields.io/badge/Accessibility-WCAG_AA_Pass-brightgreen?style=for-the-badge" alt="WCAG AA Pass" />
  <img src="https://img.shields.io/badge/Playwright-Verified-45ba4b?style=for-the-badge&logo=playwright" alt="Playwright Verified" />
</p>

---

## Overview

**Cubesquare Studio** is a high-performance, boutique agency web experience crafted with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Motion**. Designed around tactile skeuomorphism, dynamic 4D mathematics, and fluid physics, the site delivers a high-end interactive presentation while preserving strict accessibility (WCAG AA), zero layout shift, and cross-browser reliability across Chromium, Firefox, and WebKit.

---

## Key Highlights & Features

### 1. 4D Hypercube (Tesseract) Hero
- **Zero-Dependency 4D Math**: Rendered natively on HTML5 Canvas 2D (16 vertices, 32 edges, 24 square faces) without heavy 3D runtimes.
- **Continuous 4D Rotations**: Auto-rotates across $XW$, $ZW$, $XY$, and $YZ$ planes with frame-rate independent $dt$ smoothing.
- **Interactive Inertia**: Drag-to-spin physics with decaying momentum and hero pointer tilt easing.
- **Depth-Sorted Volume**: Depth-scaled stroke widths, luminous double-stroke glow (no costly filters), and translucent depth-sorted faces (High Tier).
- **Upright Satellite Chips**: Orbiting skill keycaps ("Web", "Brand", "Social", "SEO") tracking an elliptical trajectory while maintaining strict horizontal readability and &ge; 7:1 contrast.

### 2. Physical Skeuomorphic "Key" Buttons
- **Tactile Keycaps**: Engineered after mechanical switches with a chamfered metal bezel, recessed dark shadow well, colored foundation, and domed keycap.
- **Physical States**:
  - Rest: Elevation with soft ambient occlusion and top specular highlight.
  - Hover: Magnetic pull, micro-tilt toward cursor, and amplified glow.
  - Active / Press: 3D depression into the bezel recess (`translateY(2.5px)` with tight drop shadow).
- **Accessible Variants**: `accent` (electric blue), `light` (tactile glass), `graphite` (dark matte), and `warm` (amber glow).

### 3. Headless Adaptive Cursor System (`lib/cursor/engine.ts`)
- **Framework-Agnostic Engine**: Completely decoupled from React render cycles—runs in a single unified loop with zero re-render overhead.
- **Exponential Smoothing**: Frame-rate independent smoothing ($value += (target - value) \times (1 - e^{-k \cdot dt})$) calibrated for 60, 120, and 144 Hz displays.
- **Idle Sleep**: Suspends scheduling when idle (&gt;150ms resting without active springs or particles) to minimize CPU/battery consumption.
- **Morphing & Context**: Morphs to interactive targets (Keys, cards, inputs) and transitions between contextual states:
  - Work Cards: "View" pill.
  - Hero Tesseract: "Drag" indicator.
  - Form Fields: Blinking vertical caret bar.
- **Sparkle Canvas**: Lightweight 24-particle diamond sparkle emitter utilizing `performance.now()` timestamps (guaranteeing zero stuck particles across tab switches).
- **Adaptive Quality Downgrade**: Automatically monitors a 30-frame rolling average; degrades particle effects &rarr; morph &rarr; ring if frame times exceed 22ms.

### 4. Dynamic Hardware Quality Tiers (`useMotionTier`)
Dynamically gates effects across three tiers computed on client mount:
- **`high`** (&ge;8 CPU cores, mouse/pen): Full 4D faces, diamond sparkle canvas, magnetic tilt, and particle fields.
- **`mid`** (4–6 CPU cores / standard desktop): 4D tesseract wireframe, cursor morphing, smooth Key spring states.
- **`low` / `prefers-reduced-motion` / Touch**: Cursor layer is unmounted (native cursor untouched), Tesseract renders a single static 4D projection, and animations switch to instant transforms.

### 5. Accessibility & Contrast-First Typography
- **No Scroll-Scrubbed Text Opacity**: All body copy and headings remain at solid 100% resting opacity (hero lead in `#3A3A3C` with &ge; 7:1 contrast).
- **Automated Axe-Core Audited**: Zero color-contrast violations across all breakpoints.
- **Mobile First**: Minimum 48px touch targets and full keyboard navigation focus rings.

---

## Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.2.1](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19.2.3](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with Vanilla CSS Variables |
| **Animation** | [Motion](https://motion.dev/) (Strict `motion/react` v14), [GSAP](https://gsap.com/) |
| **Scrolling** | [Lenis Smooth Scroll](https://lenis.darkroom.engineering/) |
| **Email Service**| [Resend](https://resend.com/) (Transactional Contact API) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Playwright](https://playwright.dev/) + [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm) |

---

## Project Structure

```text
cubesquarestudios/
├── public/                 # Static assets, favicon, SVGs
├── scripts/
│   ├── layout-audit.mjs    # Responsive viewport audit (360px - 1920px)
│   ├── test-mission-verification.mjs # Cross-browser Playwright test suite
│   └── test-reduced-motion.mjs       # Reduced motion validation
├── src/
│   ├── app/
│   │   ├── api/contact/    # Contact form API route (Resend)
│   │   ├── globals.css     # Design tokens, keycap skeuomorphism, glass system
│   │   ├── layout.js       # Root layout, fonts, metadata & SEO
│   │   └── page.js         # Single-page agency composition
│   ├── components/
│   │   ├── hero/
│   │   │   └── Tesseract.tsx       # 4D Hypercube math engine & Canvas 2D
│   │   ├── motion/
│   │   │   ├── text/              # TypewriterLoop, SplitReveal, TextRoll
│   │   │   ├── BackToTop.jsx      # Scroll progress indicator
│   │   │   └── RippleEffect.jsx   # Micro-interactions
│   │   ├── ui/
│   │   │   ├── Key.jsx            # Skeuomorphic physical key button
│   │   │   └── GlassCard.jsx      # Liquid glass container
│   │   ├── Cursor.tsx             # Thin client cursor mount
│   │   ├── Hero.jsx               # Hero section & headline composition
│   │   ├── Services.jsx           # Bento-grid capabilities
│   │   ├── Work.jsx               # Featured case studies
│   │   ├── Process.jsx            # Dark-glass workflow timeline
│   │   └── Contact.jsx            # Interactive project inquiry form
│   └── lib/
│       ├── cursor/
│       │   └── engine.ts          # Headless cursor engine
│       ├── motion.js              # useMotionTier, spring configs, easings
│       └── sound.js               # Web Audio API tactile key click synthesizers
├── DESIGN.md               # Complete design system specification
└── package.json
```

---

## Getting Started

### Prerequisites
- **Node.js**: `v20.x` or `v22.x`+ recommended
- **npm**, **pnpm**, or **yarn**

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cubesquarestudios.git
   cd cubesquarestudios
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env.local` file in the root directory:
   ```env
   # Contact Form Delivery
   RESEND_API_KEY=re_your_api_key_here
   CONTACT_EMAIL=hello@cubesquarestudios.com
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Scripts & Verification

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js Turbopack development server |
| `npm run build` | Builds optimized production bundle |
| `npm run start` | Starts production server |
| `npm run lint` | Runs ESLint analysis across codebase |
| `node scripts/layout-audit.mjs` | Audits viewports (360/390/768/1024/1280/1440/1920px) for horizontal overflow, clipping, or uncentered containers |
| `node scripts/test-mission-verification.mjs` | Runs full Playwright suite: cross-browser (Chromium, Firefox, WebKit), idle sleep, capability gating, 4x CPU throttle downgrade, and Axe-core contrast checks |

---

## Design System Tokens

For full typographic scales, spacing matrices, and skeuomorphic specifications, consult [DESIGN.md](./DESIGN.md).

- **Background**: `#FBFBFD`
- **Surface**: `#FFFFFF`
- **Dark Surface**: `#0A0A0C`
- **Primary Accent**: `#0058CC` (Accessible Cobalt)
- **Primary Text**: `#1D1D1F` (16:1 contrast)
- **Lead Text**: `#3A3A3C` (&ge; 7:1 contrast)

---

## License

Created by **Cubesquare Studio**. All rights reserved.
