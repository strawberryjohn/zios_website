# What we do: build plan

Figma: [10028:23404](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23404) (1440 × 8789, desktop only)
Webflow page: `69aed262702891b6c33f36a8` (`/what-we-do`)

Existing content on the page isn't worth keeping. Rebuild each section from Figma. Old sections get hidden, not deleted, until the user okays cleanup (same as Home).

## Sections (top to bottom)

| # | Section | Figma node | Type | Reuse from Home / site | Status |
|---|---|---|---|---|---|
| 0 | Prep: audit the current page, hide old sections, add page code slots | | | | |
| 1 | Hero: "Rethink what your business can become." + lead + CTA, background image | `10028:32219` | full | Navbar (global), hero positioning offset rule, `Button Primary` | |
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

_Filled in per section as it's built._
