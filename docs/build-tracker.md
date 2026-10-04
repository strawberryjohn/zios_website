# Figma → Webflow build tracker

Status values: `Design in progress` · `Ready to build` · `In progress` · `Built` · `QA'd` · `Published`

Paste the Figma frame link (with `node-id`) for each page once its design is final.

| Page | Figma frame | Webflow page ID | Status | Notes |
|---|---|---|---|---|
| Home | [10028:23778](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23778) | `694123a0cdbcf3917d15a080` Mobile round 2 (11 items from Eugene, 2026-10-03, unpublished): registered scripts HomeMobileCss1/2 (header) + HomeMobileHero/Sections/SliderKit/Reviews/News (footer), source webflow/custom-code/home-mobile.css/.js. Mobile round 3 (9 items, 2026-10-03, unpublished): Css1/2/Hero/News 1.1.0 + new Css3 1.0.0; hero pin 75% on mobile, Über Zios stats stacked, reviews/FAQ tighter, news uses the reviews nav. Mobile hero two screens (2026-10-04, unpublished): Css2/Hero 1.2.0, no pin on ≤767, layers lag behind (parallax), text+link centred on a dark blue screen that ends with the partners marquee; text kept ≥450px above the marquee and a 2px overlap hides the hairline at the seam (Css2 1.4.0). |
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

## Type scale (approved, 4px grid)

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
