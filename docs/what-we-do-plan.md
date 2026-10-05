# What we do: build plan

Figma: [10028:23404](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23404) (1440 × 8789, desktop only)
Webflow page: `69aed262702891b6c33f36a8` (`/what-we-do`)

Existing content on the page isn't worth keeping. Rebuild each section from Figma. Old sections get hidden, not deleted, until the user okays cleanup (same as Home).

## Sections (top to bottom)

| # | Section | Figma node | Type | Reuse from Home / site | Status |
|---|---|---|---|---|---|
| 0 | Prep: audit the current page, hide old sections, add page code slots | | | | Done |
| 1 | Hero: "Rethink what your business can become." + lead + CTA, background image | `10028:32219` | full | Navbar (global), hero positioning offset rule, `Button Primary` | Built, visual QA pending |
| 2 | Partner logos strip | `10028:32091` | full | `partners_sec` marquee + `home-partners.css` (check the bg colour: here it sits on the hero gradient) | |
| 3 | What We Do: intro, 5 rows (number + title / 3D icon / text + "Get Started"), closing CTA "See how organizations build resilience with ZiOS" + "View Cases" | `10028:32223` | regular | Leistungsbereiche CMS (5 items match: Cybersecurity, KI & Automatisierung, Compliance & Governance, Managed IT & Server, Cloud & Backup), `Button / Text Link`, `Clickable` | |
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

Open: visual QA at 1440 / 991 / 767 / 479 needs the Designer (`element_snapshot_tool`).

