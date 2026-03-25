# ASHTH Pitch Suite — Session Notes
**Last updated:** March 25, 2026
**Session:** S19 (continuation of S18 from previous context)
**Repo:** https://github.com/benzenoe/eytan.com
**Live URL:** https://benzenoe.github.io/eytan.com/pitches/

---

## Files in This Directory

| File | Description | Size |
|------|-------------|------|
| `ashth-local-strategy.html` | Local market entry strategy — primary working doc | ~104KB |
| `ashth-europe-pitch.html` | Europe-wide pitch deck | ~144KB |
| `ashth-retainer-proposal.html` | Partnership/retainer proposal | ~79KB |
| `ASHTH-Local-Strategy.pdf` | PDF version of local strategy | 34KB |
| `ASHTH-Europe-Pitch.pdf` | PDF version of Europe pitch | 44KB |
| `ashth-logo.png` | Ashth brand logo (181×66px RGBA, dark on transparent) | 5KB |

---

## What Was Built This Session

### 1. Ashth Logo
- Downloaded from `https://ashth.com/images/Ashth%20Logo-01.png`
- Saved as `ashth-logo.png` in this directory
- The logo is **dark on transparent** (designed for white backgrounds)
- **Dark mode:** `filter: invert(1) brightness(1.2)` → shows white on navy
- **Light mode:** `filter: none` → shows original dark on white
- Added to: nav (all 3 files) + hero section (all 3 files)

### 2. Product Imagery — Sourced from Ashth CDN (no download needed)
All images referenced directly via CDN URLs:

**Category images (used in hero image strip):**
```
Rings:     https://controller.ashth.com/public/storage/assets/uploads/sliders/collection/2024-09-09-18-19-5710000.jpg
Earrings:  https://controller.ashth.com/public/storage/assets/uploads/sliders/collection/2024-09-09-18-20-099999.jpg
Bangles:   https://controller.ashth.com/public/storage/assets/uploads/sliders/collection/2024-09-09-18-20-1910000.jpg
Necklaces: https://controller.ashth.com/public/storage/assets/uploads/sliders/collection/2024-09-09-18-20-4110000.jpg
Pendants:  https://controller.ashth.com/public/storage/assets/uploads/sliders/collection/2024-09-09-18-20-279999.jpg
```

**Collection images (used in collection showcase section):**
```
Aarambh:  https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-19-06-4310000.jpg
Eclipse:  https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-15-02-5810000.jpg
Bandhan:  https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-15-02-3710000.jpg
Myra:     https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-15-02-289999.jpg
Maya:     https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-15-02-1610000.jpg
Aadya:    https://controller.ashth.com/public/storage/assets/uploads/parameter/2025-10-15-15-02-0110000.jpg
```

**Product images (white-background shots, used in products strip):**
```
Ring 1:    https://ashthmedia.s3.ap-south-1.amazonaws.com/images/RS20015-0250Y-1.jpg
Ring 2:    https://ashthmedia.s3.ap-south-1.amazonaws.com/images/RS20014-0280W-1.jpg
Earring 1: https://ashthmedia.s3.ap-south-1.amazonaws.com/images/EC12005-0800W-1.jpg
Earring 2: https://ashthmedia.s3.ap-south-1.amazonaws.com/images/EC12003-1175W-1.jpg
Necklace 1:https://ashthmedia.s3.ap-south-1.amazonaws.com/images/NE41009-3300W-1.jpg
Necklace 2:https://ashthmedia.s3.ap-south-1.amazonaws.com/images/NE41010-5465W-1.jpg
Pendant 1: https://ashthmedia.s3.ap-south-1.amazonaws.com/images/PN40001-0200W-1.jpg
Bangle 1:  https://ashthmedia.s3.ap-south-1.amazonaws.com/images/BG31012-1000Y-1.jpg
```

### 3. Dark / Light Mode Toggle
Added to all three HTML files.

**Button:** `<button class="theme-toggle" onclick="toggleTheme()">☀ Light / ☾ Dark</button>`
Placed in nav, immediately before the "Book a Call" CTA.

**JavaScript:** Toggles `data-theme="light"` on `<html>`, persists to `localStorage` key `ashth-theme`.

**Theme structure:**
- **Dark (default):** Navy backgrounds, white/teal text — unchanged from original design
- **Light mode:** White/light gray body, dark navy text, teal accents, **nav and hero stay dark navy**

**CSS variable remapping in `[data-theme="light"]`:**
```css
--white: #0d1620   /* CRITICAL — remaps all 135+ color:var(--white) to dark */
--gray:  #3a4e60   /* CRITICAL — remaps all color:var(--gray) to readable dark */
--bg:    #f0f4f7
--surface: #ffffff
--text:  #0d1620
--text2: #1e2e3e
--text3: #3a4e60
```

**Elements that keep white text in light mode** (on dark/teal backgrounds):
- `.btn-primary`, `.nav-cta` (on teal button)
- `.channel-badge`, `.ch-events .channel-badge` (on teal badge)
- `th`, `thead th` (on teal table header)

### 4. New Sections in ashth-local-strategy.html
Added during previous session (S18 end / S19 start):

- **Hero:** Ashth logo + 5-category image strip (Rings/Earrings/Bangles/Necklaces/Pendants)
- **Collection Showcase section:** 6 collection cards + 8-piece product strip + 75% buyback highlight
- **Channel 1 Event Playbook:** Venue tiers, 2.5hr programme, Ashth Cut® moment, 5-step outreach, event budget table
- **Channel 3 Interim Showroom:** Luxembourg/Brussels/Paris day offices with specific recommendations (Regus, Nyuko, Silversquare, Wojo), appointment day schedule, cost table
- **Channel 2 Appointment Detail:** Where to meet hierarchy, booking form, Calendly recommendation

### 5. PDF Redesign (ASHTH-Local-Strategy.pdf)
Completely rewritten from dark navy to **clean white professional design**:
- White background throughout
- Dark navy text (#0d1620)
- Teal (#2B6166) accents, section headers, table headers
- Light teal/gold/blue card background tints
- Ashth logo on cover page (original dark colors on white)
- Teal header stripe on inner pages
- Generator script: `/tmp/gen_ashth_pdf_v2.py`

---

## CSS Architecture

### Variable Hierarchy
```
:root              → dark mode defaults (--white: #fff, --navy: #0d1620, etc.)
[data-theme=light] → light mode overrides (--white: #0d1620, --gray: #3a4e60, etc.)
```

### Key CSS Sections (in order within each HTML file)
1. `:root` — base dark mode variables
2. Theme CSS block — `[data-theme="light"]` variables + `.theme-toggle` styles
3. Page-specific CSS (hero, nav, cards, sections, etc.)
4. Light mode overrides — all `[data-theme="light"] .element` rules
5. Extra CSS block — hero logo, image strip, collection grid, diagram overrides

### Light Mode: What Stays Dark
- `nav` → `background: rgba(13,22,32,0.98)` (hardcoded, not variable)
- `.hero` → `background: linear-gradient(180deg,#0d1620 0%,#1a2332 100%) !important` (hardcoded)
- `footer` → `background: #0d1620`

---

## Brand Reference

| Element | Value |
|---------|-------|
| Company | ConsciousCarats Private Limited |
| Brand | Ashth |
| Founder | Mukesh K Shah (patriarch, 40 years diamond expertise) |
| Co-founder/MD | Kaivan Shah |
| Luxembourg lead | Kuntal (Kuntal is married — do NOT use "Kuntal Shah") |
| Key contact | Tejas Mehta (right hand, family relative) |
| Tagline | "Mine. Not Mined." |
| Patent | Ashth Cut® — 97-facet patented octagon |
| Teal color | #2B6166 |
| Website | ashth.com / ashth.eu |
| India margin | ~40% |
| Luxembourg margin | ~20% |
| Buyback guarantee | 75% lifetime |

---

## Known Issues / Future Work

- [ ] **PDF for europe-pitch and retainer-proposal** not yet regenerated with new logo/light look — only local-strategy.pdf was updated
- [ ] **ashth-europe-pitch.html** and **ashth-retainer-proposal.html** have light mode toggle but less thorough diagram/inline-style coverage than local-strategy
- [ ] **Mobile nav** hides links at 768px — toggle button may be cramped on small screens
- [ ] **Collection showcase section** exists only in local-strategy.html — could be added to europe-pitch if desired
- [ ] **Image CDN dependency** — all product/collection images load from ashth.com CDN (controller.ashth.com and ashthmedia.s3). If CDN changes, images break. Consider downloading key images locally.

---

## Git Commits This Session (newest first)

```
c776842  Light mode: remap --white and --gray variables, no white text on light bg
d6226b2  PDF: clean white professional design with Ashth logo and all content
e4a82ae  Light mode: dark nav/hero, high-contrast text, stronger card definition
2389e36  ASHTH: logo in hero, product imagery, fixed dark/light toggle, diagram contrast
647bd44  Add dark/light mode toggle to all three ASHTH pitch pages
d93418a  Add Ashth logo from ashth.com to all three pitch pages
4a3a54d  ASHTH local strategy: full event playbook, interim showroom, appointment detail
```

---

## Useful Scripts (saved in /tmp — will not persist)

| Script | Purpose |
|--------|---------|
| `/tmp/gen_ashth_pdf_v2.py` | Generate ASHTH-Local-Strategy.pdf (white design) |
| `/tmp/gen_ashth_pdf.py` | Old dark PDF generator (deprecated) |
| `/tmp/full_ashth_update.py` | Added hero logo, image strip, collection section |
| `/tmp/fix_light_mode.py` | Rewrote light mode CSS |
| `/tmp/add_theme_toggle.py` | Initial toggle CSS injection |

> ⚠️ Scripts in /tmp do not persist across reboots. Re-create from this document if needed.
> The PDF generator (`gen_ashth_pdf_v2.py`) is the most important to preserve — full source is reconstructable from the commit history.

---

## Deploy Command

```bash
cd ~/eytan.com && git add . && git commit -m "msg" && git push
# GitHub Pages updates in ~1-2 minutes
# Always hard refresh: Cmd+Shift+R
```
