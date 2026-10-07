# What we do: build plan

Figma: [10028:23404](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23404) (1440 × 8789, desktop only)
Webflow page: `69aed262702891b6c33f36a8` (`/what-we-do`)

Existing content on the page isn't worth keeping. Rebuild each section from Figma. Old sections get hidden, not deleted, until the user okays cleanup (same as Home).

## Sections (top to bottom)

| # | Section | Figma node | Type | Reuse from Home / site | Status |
|---|---|---|---|---|---|
| 0 | Prep: audit the current page, hide old sections, add page code slots | | | | Done |
| 1 | Hero: "Rethink what your business can become." + lead + CTA, background image | `10028:32219` | full | Navbar (global), hero positioning offset rule, `Button Primary` | Built, visual QA pending |
| 2 | Partner logos strip | `10028:32091` | full | `partners_sec` marquee + `home-partners.css` (check the bg colour: here it sits on the hero gradient) | Done |
| 3 | What We Do: intro, 5 rows (number + title / 3D icon / text + "Get Started"), closing CTA "See how organizations build resilience with ZiOS" + "View Cases" | `10028:32223` | regular | Leistungsbereiche CMS (5 items match: Cybersecurity, KI & Automatisierung, Compliance & Governance, Managed IT & Server, Cloud & Backup), `Button / Text Link`, `Clickable` | Built (static), Designer QA pending |
| 4 | Core Industries We Serve: 2-col list of 6, tag chips, arrow icon | `10028:23438` | regular | Branchen CMS + tags, same tag-chip style as Home | |
| 5 | ZiOS Shop: eyebrow, title, CTA, rule, text, laptop image bleeding right | `10028:23419` | regular (image may bleed) | build once as a shared product block | |
| 6 | ZiOS Hosting: same layout, server image | `10028:23428` | regular | second instance of the block from #5 | |
| 7 | Reinvention. Real results.: blue panel + ASCII mountain, text, "View Case Study" | `10029:33051` | full bg, regular content | `ascii-art 1` is the same artwork as Home Über Zios: reuse `home-about-ascii.js` (make it a shared script with a config) | |
| 8 | FAQ | `10028:23408` (instance) | regular | `FAQ / Section` component | |
| 9 | News and insights | `10028:23407` (instance) | regular | `News / Section` component | |
| 10 | Pre-footer "Mit ZiOS starten" + footer | `10029:33124` | full | Footer component; check the pre-footer matches Home's | |

Order: 0 → 1 → 2 → 3 → 4 → 5/6 → 7 → 8/9/10. 8–10 should be mostly drop-in, so they go last as one step.

## Per-section loop

Each section is one unit of work and ends with the user's sign-off before the next starts.

1. **Read**: `get_design_context` + `get_screenshot` on that section's node only (never the whole page). Pull exact copy, sizes, spacing and colours.
2. **Map** into a short table under "Section notes" below before building: each text → type-scale step, each colour → swatch/theme variable, each spacing → `space/*` / section-space. Snap every off-scale value and note the fix. Anything with no match gets flagged, not invented.
3. **Reuse check**: component or class already on the site (inventory + Home)? Use it. New classes only for section layout, named `wwd<Section>_<element>` (e.g. `wwdHero_wrap`, `wwdServices_row`) so they never collide with Home's classes.
4. **Build** in the Designer: `Section` + `u-container` (width rule), theme mode on the section instead of hex colours, Typography components with Text Style modes. Code that can't live in Webflow styles goes in `webflow/custom-code/page-what-we-do-*.{css,js}` and the page head/footer.
5. **Assets**: export from Figma at 2x and have Webflow fetch them by URL (the container can't download from figma.com). WebP, sensible names, alt text.
6. **QA**: `element_snapshot_tool` at 1440, 991, 767, 479 against the Figma screenshot. Figma has desktop only, so tablet/mobile follow Home's patterns. List every judgement call for the user.
7. **Check the external bundle**: if a style or behaviour won't take, check whether `zios-webflow.netlify.app` app.js/app.css owns it before fighting it.
8. **Record**: section notes + tracker row, one commit per section.

## Token mapping (whole frame)

Colours: every Figma colour has a swatch (blue 10/60/80/100/130/160, Blue 160 New = `blue-160-2.0`, Grey Blue 10 = `background-2.0`, black 20/50/70/100, white 100). No new colour variables expected.

Figma type variables vs the approved scale:

| Figma | Value | Use |
|---|---|---|
| h1 | 82 | H1 (80) |
| h2 | 68 | H2 (68) |
| h3 | 40 | H3 (40) |
| h4 | 30 | H4 (32) |
| h5 | 22 | H5 (24) |
| h6 | 18 | H6 (20) |
| h7 | 16 | text-main (16) |
| h8 | 14 | body → text-main (16) |
| h9 | 12 | text-small / labels (12) |

## Decisions (open until answered)

- CMS binding for #3 (Leistungsbereiche) and #4 (Branchen): recommended, so rows link to the detail pages. Figma's row descriptions are placeholders (all the same text), so the copy would come from CMS.
- Old content: hide during the build, then delete with the user's okay.
- No publishing until the user says so.

## Section notes

### 0. Prep

Current page (2026-10-05), inside `page_main`:
- `dark-bg-wrapper` (bg `--_theme---background-2`) holds the old `hero_sec is-whatWeDo` (now **hidden**), `partners_sec is-whatWeDo`, and `whatWeDo_sec` (old tabs version).
- Then `indastries_sec`, `products_sec`, `CTA section / Global pages` ("Reinvention. Real results."), `FAQ / Section` (filtered to this page), `News / Section`, Footer.
- Each old section gets hidden when its replacement is built, so the page stays usable in between. Nothing deleted.

Tooling notes:
- The data API (elements, styles, variables, components, whtml builder) works **without** the Designer open. Only `asset_tool`, `element_snapshot_tool` and `designer_tool` need the Designer.
- Figma images: the container can't download from figma.com, but `get_screenshot` with `enableBase64Response` saves the PNG locally. Process it there (Pillow), then upload with `data_assets_tool > create_asset` plus a direct S3 POST (curl), which works.
- whtml builder: an `<img src>` pointing at the CDN isn't linked to the asset; follow with `set_image_asset`. A class with no CSS passed and no existing style is dropped, so create styles first (`data_style_tool`, with `variable_as_value` for tokens) and reference them by name.
- The old hero had `data-gsap-trigger="menu-animation"` (navbar animation in the external bundle); the new hero keeps it.

### 1. Hero (`10028:32219`)

Built as `wwdHero_sec` (first child of `dark-bg-wrapper`).

| Figma | Value | Webflow |
|---|---|---|
| Section bg | `#002361` | `swatch/blue-170` (#012462, same blue as Home's hero end and partners strip) |
| Theme | | Theme collection: **Dark mode** on `wwdHero_sec`; text colour `--_theme---text` |
| Background image | photo at 28% over black, screen tint, fades to the bg colour from 50% to 70% of its height, flipped | flattened Figma render (1440×876, alpha kept) composited onto #012462 → `wwd-hero-bg.webp` (12 KB, asset `6ac42c7fb46bd61fa63dcc77`, copy in `webflow/custom-code/`). `object-fit: cover`, anchored bottom (65% x on mobile to keep the hand). Exported at 1x only: it's a 28% overlay, so the upscale on wide screens is barely visible |
| Heading | Light 82 / 1.1 / -4%, capitalize, 910 wide | `u-text-style-h1` (80, approved H1; weight 300 + letter-spacing var) + `wwdHero_heading` (capitalize, no margins). 82 → 80 |
| Lead | Regular 16 / 1.3, 356 wide | `u-text-style-h8` (16/1.3 regular) + `wwdHero_text` max 22.25rem |
| Gaps | heading→lead 40, text→CTA 64 | `wwdHero_head` row-gap 2.5rem, `wwdHero_content` row-gap 4rem (mobile 1.5 / 2.5rem) |
| Content top | 196 | `wwdHero_contain u-container` padding-top 12.25rem (tablet 10, mobile 8), bottom 5rem |
| Section height | 876 | min-height 54.75rem (mobile 100svh) |
| CTA "Get Started" | light pill, blue-10 bg, 18px medium text, arrow, hover blob | `Button Primary` (Light variant), the same as Home's hero CTA; links to `/contacts`. Its text size comes from the component (Figma 18 is off-grid → H6 20 by the scale) |

Figma's `ss01`/`ss04` font features aren't used anywhere on the site (Home included), so they're left out to keep the same role styled the same everywhere.

Follow-ups after review (2026-10-05):
- **CTA width**: Home's CTA isn't styled wider; it only looks longer because its label ("Kostenlose Erstberatung") is longer. Figma's CTA is a fixed 220px pill with the label left and the arrow right, so page head CSS sets `.wwdhero_content .button_primary_wrap { width: 13.75rem }` and makes the inner element `width: 100%; justify-content: space-between`. Page code doesn't run in the Designer, so the canvas still shows the narrow button.
- **Reveal animation** (`wwd-hero-reveal.js`, page footer; guard + CSS in `wwd-hero.css`, page head): GSAP 3.13 + SplitText (loaded from jsdelivr if the page doesn't already have them). Heading lines slide up out of masks (yPercent 110 → 0, 1s, stagger 0.12, power3.out), then the lead text and CTA rise 24px and fade in (0.8s, stagger 0.12, overlapping the end of the heading). The background fades in and scales 1.06 → 1 over 1.8s. The split is reverted at the end so the heading re-wraps on resize. `html.wwd-reveal-pending` hides the three elements until the timeline sets its start state; a 3s timeout un-hides them if GSAP never loads. Reduced motion: no animation. Tested in headless Chromium against a mock of the hero: 2 lines split, CTA 220px, no errors, split reverted at the end.
- Full page head/footer blocks: `page-what-we-do-head.html` / `page-what-we-do-footer.html` (they keep the pre-existing reviews-swiper code).
- Snapshot check (desktop): layout matches Figma. The snapshot tool doesn't load custom fonts, and it drew the hero background blank even though CMS images render fine. The asset and element binding check out and a real browser shows it, but it still needs a look on the canvas.

### 2. Partner logos (`10028:32091`)

Kept the existing CMS marquee (`partners_sec is-whatWeDo`, Partners logos collection). It already matches Figma: 8 logos (the same as Figma), PNGs in `blue-130`, `partners_item` 3.5rem high (Figma 55px), about 70px gaps, section bg `swatch/blue-170`.
- Changed: the `is-whatWeDo` combo padding was 2rem top / 18.75rem bottom (mobile 6 / 11rem), left over from the old overlapping layout. Now 0 / 0 at every breakpoint, so the strip sits flush under the hero like Figma, and section 3 brings its own top spacing.
- The CMS list runs NVIDIA → Microsoft (Figma shows Microsoft first). It's a continuous marquee, so the order only changes which logo leads; left as is.


### 3. What We Do services (`10028:32223`)

Built as `wwdServices_sec` after `partners_sec`; old `whatWeDo_sec` (tabs) **hidden**.

**Static, not CMS**: the Leistungsbereiche collection has 6 items whose names don't match Figma's 5 rows (CMS: Managed IT & Support, Cybersecurity & Backup, Cloud,Hosting & M365, Netzwerk & Infrastruktur, KI & Automatisierung, Websites & digitale Lösungen) and has no icon or short-description fields. Binding would mean changing CMS data or showing copy that differs from Figma.

| Figma | Value | Webflow |
|---|---|---|
| Section bg | gradient `#002361` → `#0465cf` (top → bottom) | `wwdServices_sec`: bg colour `swatch/blue-170` + `linear-gradient(180deg, #012462, #0465cf)`. `#0465cf` has no swatch; it's written literally like Home's gradient stops (`u-gradient-*`, `expert_stage`). **Flagged** |
| Theme | | Dark mode on `wwdServices_sec`; text `--_theme---text` |
| Padding | 160 top, 100 bottom | 10rem / 6.25rem (tablet 7.5 / 5, mobile 5 / 4) |
| Heading | "What We Do", Medium 40 / 1.1, capitalize | `u-text-style-h3` (40, 500, capitalize) + `wwdServices_title`; h2 |
| Intro | 16 / 1.3, 424 wide | `u-text-style-h8` + `wwdServices_intro` max 26.5rem |
| Gaps | head 24, sections 64 | 1.5rem / 4rem (mobile 3rem) |
| Rows | 3 columns 1fr / 350 / 1fr, 260 high, 1px `#4fa3ff` grid | `wwdServices_row` grid `minmax(0,1fr) 21.875rem minmax(0,1fr)`, min-height 16.25rem, borders `swatch/blue-80`; list has the top border. Tablet middle column 15rem; mobile one column (title cell, icon panel 15rem high with top/bottom borders, text cell) |
| Cells | padding 36, space-between | `wwdServices_cell` 2.25rem (tablet/mobile 1.5rem) |
| Number `[ 01 ]` / description | 16 regular, 75% opacity | `u-text-style-h8` + `wwdServices_meta` (opacity 0.75) |
| Service name | Medium 40 | `u-text-style-h3` + `wwdServices_name`; h3 |
| Icon panel | blue-100 at 25% + dot pattern (white 4px ellipse at 0.45 scale, spacing 3, 20% opacity) | `wwdServices_visual`: `rgba(35,140,255,.25)` (= blue-100 at 25%) + `radial-gradient(circle, rgba(252,252,252,.2) .9px, transparent 1.1px)` at 0.45rem tiles; side borders blue-80 |
| Icons | 5 isometric vectors, 200×200 | exported from Figma as **SVG** (crisp at any density), assets: cybersecurity `6ac4428f206891e7b24507f6`, ki `6ac4428f061109e0326e673b`, compliance `6ac4428fd24133a07f3aa490`, managed-it `6ac4428f8d2975a4d04fa986`, cloud-backup `6ac4428fd24133a07f3aa47e`; copies in `webflow/assets/what-we-do/`. `wwdServices_icon` 12.5rem (tablet 10rem) |
| "Get Started" | 16 regular, arrow, gap 16 | `Button / Text Link`, variant **Light / Small**. That variant had a 14px (0.88rem) label and 0.88rem gap, both off-grid, so it's now **16px / 1rem gap**. This also applies to Home's "Leistungen Entdecken" link (same role, same style) |
| Closing logo | Zios logo 65×24, `#4C97EB` | SVG asset `6ac4428f206891e7b2450811`, colour snapped to `swatch/blue-80` (#4FA3FF); `wwdServices_logo` 4.0625 × 1.5rem |
| Closing title | Medium 40, 552 wide, centred | `u-text-style-h3` + `wwdServices_cta_title` max 34.5rem; h2 |
| "View Cases" | 220px light pill | `Button Primary`, variant **Light / Wide**, → `/cases` |

Links (Figma has no targets; closest existing detail pages):
- Cybersecurity → `/capabilities/cybersecurity-2`
- KI & Automatisierung → `/capabilities/ki-automatisierung`
- Compliance & Governance → `/contacts` (no matching page)
- Managed IT & Server → `/capabilities/managed-it-support`
- Cloud & Backup → `/capabilities/cloud-hosting-m365`

Copy: all five descriptions are Figma's placeholder ("Managed IT Services – IT-Betreuung & Outsourcing für Unternehmen"), kept verbatim per the copy rule. Real copy is needed.

Designer = published: everything visible is in Webflow styles/components; no custom code in this section.

QA: Chromium mock with the same values at 1440 matches the Figma frame (2038px tall vs Figma's 2001px; the difference is Figma's text-box trim). The 390px mobile stack checked. Designer snapshot pending (Designer disconnected).

Tooling note: when the Designer isn't connected, SVGs can still be exported with `use_figma` → `exportAsync({format:'SVG_STRING'})` (results cap at 20 KB, so round coordinates for big icons), then uploaded with `create_asset` + S3 POST.

### Follow-ups (2026-10-06)

- **Row hover**: `wwdServices_row` hover → `rgba(123,186,255,0.1)` (swatch/blue-60 at 10%, light blue; was white 10% at first), 400ms ease transition (Webflow style, so the Designer shows it too).
- **Row height (2026-10-07)**: `min-height` replaced by `grid-auto-rows: minmax(16.25rem, auto)` + `align-items: stretch` on the row (mobile: `auto`), and `align-self: stretch` on `wwdServices_cell` / `wwdServices_visual`, so the dotted visual panel and the text cells always fill the full row height.
- **Row descriptions** replaced Figma's placeholders (≤ ~100 chars, 2 lines at desktop):
  - Cybersecurity: "Proactive protection for your systems, data and people, from threat detection to incident response."
  - KI & Automatisierung: "AI and automation for everyday processes, so your team spends less time on routine work."
  - Compliance & Governance: "Meet GDPR and NIS2 requirements with clear policies, audit-ready documentation and controls."
  - Managed IT & Server: "Reliable day-to-day IT and server management, monitored around the clock by our team."
  - Cloud & Backup: "Secure cloud infrastructure and automated backups that keep your business running."
- **Home hero reveal**: same stagger as this page's hero, added as registered page scripts `homeherorevealguard` (head) and `homeheroreveal` (footer); sources `home-hero-reveal-guard.js` / `home-hero-reveal.js`. Built-in line splitter (works with gsap 3.12). Only animates the children of the elements the parallax moves.
- 3D rotating icons: tried a three.js rebuild of the Cybersecurity shield; dropped at the user's call.

### Follow-ups (2026-10-07)

- **Directional row hover** (ref: aspensearch.com Clients list). Each `wwdServices_row` holds a `wwdServices_overlay` div (`aria-hidden`), styled in Webflow: absolute inset 0, solid `swatch/blue-180` (#071c33, dark blue; was blue-60 @ 10% at first), `pointer-events: none`, parked at `translate3d(0,-101%,0)`, `transform` transition 500ms `cubic-bezier(0.65,0,0.35,1)`. The row is `position: relative; overflow: hidden`; cells and the visual are `position: relative; z-index: 1` above it. The old `:hover` background and row transition are removed.
- `wwd-services-hover.js` (page footer): on mouse enter, snaps the overlay to the edge the cursor crossed (top/bottom half), then slides it to 0; on leave it slides out through the exit edge. Mouse only; touch and reduced motion skip it. The canvas shows the resting state (overlay hidden), same as the published page before hover.
