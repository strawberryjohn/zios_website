# Figma → Webflow build tracker

Status values: `Design in progress` · `Ready to build` · `In progress` · `Built` · `QA'd` · `Published`

Paste the Figma frame link (with `node-id`) for each page once its design is final.

| Page | Figma frame | Webflow page ID | Status | Notes |
|---|---|---|---|---|
| Home | [10028:23778](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23778) | `694123a0cdbcf3917d15a080` | In progress | Type scale applied site-wide. Built (awaiting visual QA): Über Zios restyle per Figma 10028:29626 (intro 16px black-50 700px, title Medium, 24/7 240px -4% tracking + gradient fill `home-about.css`, Monitoring 48px Medium blue-60, ASCII mountain background (`home-about-ascii.js`): outline traced from the Figma artwork 'ascii-art 1' (one big peak at ~78% width, long ridge down to the lower left, gentle right shoulder; one symbol per traced cell), drawn in the hero's animated binary style (`1`/`:`/`0`/`.` by depth, bright snow band along the ridge, fainter dotted body, per-symbol opacity, swaps + snow-like twinkle). Ends and the bottom-right corner (behind the "Über Zios" link) fade. Canvas inside `.aboutUs_ascii`: full panel width up to 1920px, bottom-aligned, at most 60% of the panel height (then only row spacing tightens); still frame for reduced motion. The image file `about-ascii-mountain.webp` (asset `6abeadf2bfbc47cc45ccadc0`) is no longer used; 24/7 un-hidden (removed `#scramble-text` id); Monitoring stacked under 24/7 with a spinning ring loader `.aboutUs_loader`; intro text 50% width), new static Leistungsbereiche mosaic `services_sec` (content wrapper restored to `services_contain u-container` for the standard side gutter; it had been left on an auto class "Div Block 5") (old `indastries_sec` hidden, not deleted), expertise slider restyle + own loop/tab JS in page custom code. Hero: 5 parallax layers from Figma 8013:12007 (`hero_layers`, old hero visuals hidden, not deleted) + sky layer is a CSS gradient div (`.hero_layer.is-5`, colours sampled from the export); dark blue `.hero_layer.is-ground` block hangs under layer 2 and rises with it so no sky shows below the mountains; layer 3 (ASCII mountain) is redrawn live on a canvas by `home-hero-ascii.js` after the approved hero reference: airy symbol grid where the symbol follows depth below the ridge (`1` along ridges, dotted `:` mid-slope, `0` low foreground, `.`/`:` on faint edges), per-symbol opacity for depth, slow swaps + snow-like twinkle; static image stays as no-JS fallback); scroll sequence in page footer (`home-hero-parallax.js`: hero pinned for 200vh, mountains move up and out with parallax (front fastest, sky slowest and fading), heading + CTA ride up with them, bottom group stays and travels to centre while text grows 16→24px); visible only on the published site. Pending: slider background images + ASCII overlay (need Designer for asset upload). Expertise slider rebuilt from scratch as `expert_sec` (Figma 10119:14288): own classes `expert_*`, slide visuals exported from Figma (1x for now, 2x pending Designer connection), head CSS `home-expertise-v3.css`, footer JS `home-expertise-v3.js` (loop, autoplay 6s, tab fill synced to autoplay timer); old `expertise_sec` hidden, its script removed from the footer (file kept). Notifications look / Section (`greetings_sec`, component used 3x): map fixed. Its Rive element had no file (assetId null; the MCP cannot attach one) and `map.riv` is only a plain world map with hover dots, no Austria, no label. Replaced by `greetings_map` (absolute, full-bleed, clipped, aria-hidden) > `greetings_map_inner` (106:59; desktop: right edge on the section edge, width 65% (user edit), Austria row at 22.5rem; tablet 62% / 18rem / 220% centred on Austria, mobile 55% / 14rem / 300%) > SVG embed `embed-greetings-map.html` (concept A, `docs/concepts/map-beacon.html`: dot grid traced from map.webp, fitted to Mercator against Natural Earth; Austria at true scale = 3 dots blue-100 + blue-130 shadow (the old blob was ~6-8x too big and sat over Poland/Belarus); soft blue-60 glow around it; pulsing beacon on Lower Austria (CSS in the embed, off for reduced motion) with a leader line to the chip) + `greetings_map_label` chip "Austria" (white, blue-30 border, blue-100 text-main). Old `greetings_img_wr` (empty Rive + hidden image) hidden, not deleted; `greetings_contain` raised above the map (relative, z 1). Card titles now `u-text-style-h7` and card texts `u-text-style-main` (16px; were H5/H6), chip on `u-text-style-main`. Awaiting visual QA at 991/767/479. Partners marquee: `partners_sec` bg #012462 + head CSS override for it and the edge-fade overlay (`home-partners.css`), so it matches the hero dark blue. Redesigned: Expertise slider ([10119:14288](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10119-14288)), Unsere Leistungsbereiche (10028:29331), Über Zios (10028:29626) |
| What we do | | `69aed262702891b6c33f36a8` | | |
| About us | | `69ca45b3349d87dbe29f8f74` | | |
| Approach and mission | | `69ce8152e5b958f6d63d838b` | | |
| Our team | | `69d388eeee3b3d6e7c6d2547` | | |
| Cases | | `69c52f015c00b1f066a8fc3a` | | |
| Case detail (CMS) | | `69c5341f2ca975f0f327824c` | | |
| Leistungsbereiche detail (CMS) | | `69e9ddef2088dcee56f16626` | | |
| Branchen detail (CMS) | | `69ea24bb0bd206a41968f3f0` | | |
| Produkte & Plattformen detail (CMS) | | `6a8457d1860d0fc1fba37ff3` | | |
| Careers | | `69cf83040634e520426f02d9` | | |
| Career detail (CMS) | | `69cf847769fc63d748f21882` | | |
| Blog | | `69d3b2eb4db186176bc0ed53` | | |
| News detail (CMS) | | `698db4a1aa9a2b8975b8d2c2` | | |
| FAQ | | `69d50390b3e7e7c85635a2e1` | | |
| Contacts | | `69cfb6ea9c5550c894a2dd8c` | | |
| Privacy&Policy | | `69f0c61afbbfefb259c3ca5d` | | |
| 404 | | `694123a0cdbcf3917d15a083` | | |

## Type scale (approved on a 4px grid; moving to an 8px grid)

px at 1440 (desktop) / tablet / 375 (mobile), set as rem in the Typography collection with Tablet (medium) and Mobile (small) modes.

| Style | Desktop | Tablet | Mobile |
|---|---|---|---|
| Display | 96 | 96 | 96 |
| H1 | 80 | 64 | 48 |
| H2 | 68 | 48 | 40 |
| H3 | 40 | 40 | 32 |
| H4 | 32 | 32 | 24 |
| H5 | 24 | 24 | 20 |
| H6 | 20 | 20 | 16 |
| H7 (medium) / H8 (regular) / text-main | 16 | 16 | 16 |
| H9 / text-small (labels) | 12 | 12 | 12 |
| text-large (lead) | 24 | 24 | 20 |

Open: the scale moves to an 8px grid (user direction 2026-10-01). Steps still off it, need a new value signed off: H2 68 (desktop), H5 mobile 20, H6 20 (all breakpoints), text-large mobile 20, H9 / text-small 12. Primary buttons (`button_primary_element`) were 18px (1.13rem), now bound to text-main 16px site-wide.

Open: ~80 section-level combo classes on other pages still override font-size with off-grid values (e.g. 0.88rem, 1.13rem, 5.69vw); fix page by page.

## Section widths (Home)

All backgrounds full-bleed; content capped at 1920px (`u-container`, 35px gutters).

| Section | Type | Content |
|---|---|---|
| Hero | full | bg full; nav, heading, CTA, bottom group, chat widget aligned to container |
| Partners | full | marquee edge to edge |
| Expertise | full | active card = container width (≤ viewport height), neighbours visible |
| Unsere Leistungsbereiche | regular | mosaic in container |
| Produkte & Plattformen | regular | 4-col grid fills container |
| Über Zios | regular header + full-bleed stats panel | both contents in container |
| Greetings, Reviews, FAQ, News | regular | in container (Reviews slider track bleeds) |
| Footer | full | content in container |
