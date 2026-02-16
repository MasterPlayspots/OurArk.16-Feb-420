# OA Design System — Complete Reference

> Universal design system for all OurArk AI Workspace Next.js projects.
> Copy this file into any project root as `DESIGN_SYSTEM.md` for AI-assisted development.

---

## Brand Identity

| Property | Value |
|----------|-------|
| Name | **OA** (OurArk) |
| Logo | Hexagon/Cube SVG → `logo/oa-logo.svg` |
| Logo + Wordmark | `logo/oa-logo-wordmark.svg` |
| Favicon | `logo/favicon.svg` |
| Brand Color | `#eab308` (Amber Gold) |
| Brand Light | `#facc15` (Yellow) |
| Gradient | `linear-gradient(135deg, #eab308, #facc15)` |

---

## Design Philosophy

Apple-inspired dark-mode SaaS. Cinematic depth with z-axis surface layers. No harsh borders — use opacity and blur. Generous whitespace. Physics-based micro-animations. Every pixel earns its place.

---

## 5-Layer Surface System

```
Layer 0 (Void):     #08080d  — Page background
Layer 1 (Ground):   #0a0a0f  — Sidebar backgrounds
Layer 2 (Surface):  #12121a  — Cards, inputs, elevated sections
Layer 3 (Elevated): #1a1a24  — Dropdowns, popovers, modals
Layer 4 (Floating): #22222e  — Tooltips, toasts
```

**Rule:** Every background MUST use one of these 5 layers. Never use arbitrary grays.

---

## Borders & Dividers

```
Default:  rgba(255, 255, 255, 0.06)  — card/input borders
Subtle:   rgba(255, 255, 255, 0.03)  — table rows, subtle dividers
Accent:   rgba(234, 179, 8, 0.15)    — key dividers, hover states
Focus:    rgba(234, 179, 8, 0.4)     — input focus rings
```

**NEVER** use solid white or gray borders. Always use rgba with low opacity.

---

## Typography

Font: **Inter** (body) / **JetBrains Mono** (code)

```
Hero:     32px / 700 / -0.02em / #e2e8f0
Title:    20px / 600 / -0.01em / #e2e8f0
Subtitle: 16px / 500 / normal  / #e2e8f0
Body:     14px / 400 / normal  / #94a3b8
Caption:  12px / 500 / 0.02em  / #64748b
Overline: 11px / 600 / 0.05em  / #64748b (uppercase)
Mono:     13px / 400 / JetBrains Mono
```

**Text color hierarchy:** `#e2e8f0` (primary) → `#94a3b8` (secondary) → `#64748b` (tertiary)

---

## Spacing (8px base)

```
xs: 4px    sm: 8px    md: 12px
lg: 16px   xl: 24px   2xl: 32px   3xl: 48px
```

---

## Border Radius

```
xs: 4px    sm: 6px    md: 8px
lg: 12px   xl: 16px   full: 9999px
```

---

## Semantic Colors

```
Success:  #22c55e  bg: rgba(34, 197, 94, 0.1)
Warning:  #eab308  bg: rgba(234, 179, 8, 0.1)
Danger:   #ef4444  bg: rgba(239, 68, 68, 0.1)
Info:     #06b6d4  bg: rgba(6, 182, 212, 0.1)
Brand:    #eab308  bg: rgba(234, 179, 8, 0.1)
```

---

## Component Specs

### Card
- Background: `#12121a` (surface)
- Border: `1px solid rgba(255,255,255,0.06)`
- Radius: `12px`
- Padding: `20px` (p-5)
- Hover: `border-color → brand/15`, `translateY(-1px)`

### Button Primary
- Background: `linear-gradient(135deg, #eab308, #facc15)`
- Text: `#08080d` (void), 14px/500
- Padding: `px-4 py-2`
- Radius: `8px`
- Hover: `brightness(1.1)`

### Button Ghost
- Background: `transparent`
- Text: `#94a3b8`
- Hover: `bg brand/8`, text primary
- Radius: `8px`

### Input
- Background: `#12121a`
- Border: `rgba(255,255,255,0.06)`
- Radius: `8px`
- Text: `#e2e8f0`
- Focus: border `brand/40` + ring `brand/10`
- Placeholder: `#64748b`

### Table
- Header: `11px/600 uppercase #64748b`
- Row border: `rgba(255,255,255,0.03)`
- Row hover: `rgba(255,255,255,0.02)`
- Cell padding: `px-4 py-3`

### Status Badge
- Active: `green/10 + #22c55e`
- Warning: `yellow/10 + #eab308`
- Error: `red/10 + #ef4444`
- Info: `cyan/10 + #06b6d4`

### Sidebar Item
- Default: `transparent`, text `#94a3b8`
- Hover: `bg white/3`, text `#e2e8f0`
- Active: `bg brand/10` + `border-left 2px #eab308`

---

## Animations

```css
/* Fade + slide entry */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* Pulsing glow for focus elements */
@keyframes orbGlow {
  0%, 100% { box-shadow: 0 0 15px rgba(234,179,8,0.4); }
  50%      { box-shadow: 0 0 25px rgba(234,179,8,0.6); }
}

/* Loading dots */
@keyframes typingDot {
  0%, 100% { opacity: 0.3; }
  50%      { opacity: 1; transform: translateY(-3px); }
}

/* Skeleton loading */
@keyframes shimmer {
  from { background-position: -200% 0; }
  to   { background-position: 200% 0; }
}
```

**Easing:** Always use `cubic-bezier(0.4, 0, 0.2, 1)` — never linear.

---

## Layout

```
Left Sidebar:  260px (→ 60px collapsed)
Center:        flex-1
Right Panel:   288px (→ 0 collapsed)
Tab Bar:       40px height
URL Bar:       40px height
```

---

## Glass Morphism

```css
.glass {
  background: rgba(10, 10, 15, 0.8);
  backdrop-filter: blur(12px);
}
```

Use on: overlays, modals, floating panels, command palettes.

---

## Scrollbar

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: rgba(234, 179, 8, 0.3);
  border-radius: 9999px;
}
```

---

## Icons

**lucide-react exclusively.** Import like:

```tsx
import { Home, Settings, ChevronRight } from 'lucide-react'
```

Default size: `16px` in UI, `20px` in nav, `24px` hero contexts.

---

## Next.js Project Setup Checklist

### 1. Install dependencies

```bash
npm install lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Copy these files into your project

```
tokens/tailwind.config.js  →  tailwind.config.js
tokens/globals.css          →  app/globals.css
tokens/tokens.ts            →  lib/tokens.ts
tokens/oa-tokens.css        →  styles/oa-tokens.css
components/oa-ui.tsx        →  components/ui/oa.tsx
logo/oa-logo.svg            →  public/logo.svg
logo/favicon.svg            →  public/favicon.svg
```

### 3. Add fonts to layout.tsx

```tsx
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### 4. Use components

```tsx
import { Card, Button, Input, Badge, SidebarItem } from '@/components/ui/oa'
import { Search, Plus } from 'lucide-react'

<Card>
  <Input icon={<Search size={16} />} placeholder="Suchen..." />
  <Button>Erstellen</Button>
  <Badge variant="success">Aktiv</Badge>
</Card>
```

---

## Quality Checklist

- ✅ All backgrounds use 5-layer system
- ✅ No solid white/gray borders
- ✅ Text hierarchy: `#e2e8f0` → `#94a3b8` → `#64748b`
- ✅ All interactions have hover + active + focus states
- ✅ Animations use `cubic-bezier(0.4, 0, 0.2, 1)`
- ✅ Brand gold accents only on active/selected states
- ✅ Glass morphism on overlays
- ✅ 4px scrollbar with gold thumb
- ✅ lucide-react icons exclusively
- ✅ Inter font with proper weights
- ✅ JetBrains Mono for code blocks

---

## Prompt for AI Development

When working with AI tools (Claude, v0, Cursor), paste this at the start:

```
You are building for OA (OurArk AI Workspace).
- Dark mode only. Background: #08080d (void). Surfaces: #12121a.
- Brand: #eab308 gold gradient to #facc15.
- Borders: rgba(255,255,255,0.06), NEVER solid white/gray.
- Text: #e2e8f0 primary, #94a3b8 secondary, #64748b tertiary.
- Font: Inter. Code: JetBrains Mono.
- Icons: lucide-react only.
- Radius: 8px buttons/inputs, 12px cards.
- Animations: cubic-bezier(0.4,0,0.2,1), fadeSlideIn for entries.
- Glass overlays: rgba(10,10,15,0.8) + blur(12px).
- Scrollbar: 4px width, gold/30 thumb.
```

---

*OA Design System v1.0 — Last updated: February 2026*
