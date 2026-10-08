# Figma → Webflow build tracker

Status values: `Design in progress` · `Ready to build` · `In progress` · `Built` · `QA'd` · `Published`

Paste the Figma frame link (with `node-id`) for each page once its design is final.

| Page | Figma frame | Webflow page ID | Status | Notes |
|---|---|---|---|---|
| Home | [10028:23778](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23778) | `694123a0cdbcf3917d15a080` | In progress | Type scale applied site-wide. Built (awaiting visual QA): Über Zios restyle per Figma 10028:29626 (intro 16px black-50 700px, title Medium, 24/7 240px -4% tracking + gradient fill `home-about.css`, Monitoring 48px Medium blue-60, ASCII mountain background (`home-about-ascii.js`): outline traced from the Figma artwork 'ascii-art 1' (one big peak at ~78% width, long ridge down to the lower left, gentle right shoulder; one symbol per traced cell), drawn in the hero's animated binary style (`1`/`:`/`0`/`.` by depth, bright snow band along the ridge, fainter dotted body, per-symbol opacity, swaps + snow-like twinkle). Ends and the bottom-right corner (behind the "Über Zios" link) fade. Canvas inside `.aboutUs_ascii`: full panel width up to 1920px, bottom-aligned, at most 60% of the panel height (then only row spacing tightens); still frame for reduced motion. The image file `about-ascii-mountain.webp` (asset `6abeadf2bfbc47cc45ccadc0`) is no longer used; 24/7 un-hidden (removed `#scramble-text` id); Monitoring stacked under 24/7 with a spinning ring loader `.aboutUs_loader`; intro text 50% width), new static Leistungsbereiche mosaic `services_sec` (content wrapper restored to `services_contain u-container` for the standard side gutter; it had been left on an auto class "Div Block 5") (old `indastries_sec` hidden, not deleted), expertise slider restyle + own loop/tab JS in page custom code. Hero: 5 parallax layers from Figma 8013:12007 (`hero_layers`, old hero visuals hidden, not deleted) + sky layer is a CSS gradient div (`.hero_layer.is-5`, colours sampled from the export); dark blue `.hero_layer.is-ground` block hangs under layer 2 and rises with it so no sky shows below the mountains; layer 3 (ASCII mountain) is redrawn live on a canvas by `home-hero-ascii.js` after the approved hero reference: airy symbol grid where the symbol follows depth below the ridge (`1` along ridges, dotted `:` mid-slope, `0` low foreground, `.`/`:` on faint edges), per-symbol opacity for depth, slow swaps + snow-like twinkle; static image stays as no-JS fallback); scroll sequence in page footer (`home-hero-parallax.js`: hero pinned for 200vh, mountains move up and out with parallax (front fastest, sky slowest and fading), heading + CTA ride up with them, bottom group stays and travels to centre while text grows 16→24px); visible only on the published site. Pending: slider background images + ASCII overlay (need Designer for asset upload). Expertise slider rebuilt from scratch as `expert_sec` (Figma 10119:14288): own classes `expert_*`, slide visuals exported from Figma (1x for now, 2x pending Designer connection), head CSS `home-expertise-v3.css`, footer JS `home-expertise-v3.js` (loop, autoplay 6s, tab fill synced to autoplay timer); old `expertise_sec` hidden, its script removed from the footer (file kept). Partners marquee: `partners_sec` bg #012462 + head CSS override for it and the edge-fade overlay (`home-partners.css`), so it matches the hero dark blue. Redesigned: Expertise slider ([10119:14288](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10119-14288)), Unsere Leistungsbereiche (10028:29331), Über Zios (10028:29626) |
| What we do | | `69aed262702891b6c33f36a8` | | |
| About us | | `69ca45b3349d87dbe29f8f74` | | |
| Approach and mission | | `69ce8152e5b958f6d63d838b` | | |
| Our team | | `69d388eeee3b3d6e7c6d2547` | | |
| Cases | | `69c52f015c00b1f066a8fc3a` | | |
| Case detail (CMS) | | `69c5341f2ca975f0f327824c` | | |
| Leistungsbereiche detail (CMS) | [10225:15038](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10225-15038) (Cybersecurity & Backup) | `69e9ddef2088dcee56f16626` | In progress | Built from the Cybersecurity & Backup frame; the template serves all 6 Leistungsbereiche items. **Why section** (Figma 10052:14429) rebuilt in `why_sec`: header `why_header` (3-column thirds grid since round 3, see the Capabilities row; one column from 991): left `why_main` = title (H3, CMS 2nd section Title) + dot chart `why_chart_img` (Figma export `capability-why-chart.svg`, asset `6ac7c1e0436c7dca53300d9b`, max 55rem); right `why_aside` = eyebrow "The solution" (`why_eyebrow`, H6 blue-60, static) + body (H8 16px, CMS 2nd section Text); divider `why_divider` (1px blue-80); 3 stats `why_stats` (3 cols, 1 col from 767): `why_stat_number` 48px/40px mobile, -4% tracking, section-specific like Home's 48px Monitoring; caption H8. Stats bound to CMS: 3rd section Number/Text + new fields 3rd section Number 2/Text 2/Number 3/Text 3 (empty stat columns hide via head CSS). Cybersecurity & Backup item filled with the Figma copy (staged, not published). Section gradient in page head (`capability-why.css`): blue-170 to blue-130. **Flag:** Figma ends at #0465cf, which has no swatch; blue-130 (#1962b2) used until a swatch is signed off. Section padding 12.5rem/9.375rem (7.5/6.25 tablet, 5/5 mobile). Old floating stat card `why_stat_wr` hidden, not deleted. Font-size fixes: eyebrow 18px to H6 20px; Why body was H7 (medium), now H8 (regular). **Hero**: not restyled yet. Created variant "Capability" on `Hero section / Global pages` (not applied); needs the Designer open for visual QA before styling. Logo strip between hero and Why (`partners_sec is-capability`) unchanged. Pending: visual QA at 1440/991/767/479. |
| Branchen detail (CMS) | | `69ea24bb0bd206a41968f3f0` | | |
| Produkte & Plattformen detail (CMS) | | `6a8457d1860d0fc1fba37ff3` | | |
| Capabilities (Template), static draft page `capibility-service` | [10051:12997](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10051-12997) (Cybersecurity & Backup) | `69bc155fa7556de240825b39` | In progress | Static page (not CMS), per the user. Sections 1-2 built; the rest of the page is untouched. **Hero** (Figma 10051:14295): new section reusing the What we do hero classes (`wwdHero_sec/contain/content/head/heading/text`, same Figma measurements: 910px content, 40/64px gaps, 356px text, 196px top padding), eyebrow "Cybersecurity & Backup" (`why_eyebrow`, H6 blue-60), H1 heading, Button Primary (What we do variant, "Get Started" to /contacts). Background = Figma exports of the two image layers: `capability-hero-cybersecurity` (asset `6ac7c74f0ba2310eb9d2f334`, padlock with blue dodge + gradient) under `capability-hero-cybersecurity-texture` (`6ac7c7661bee59dcbec6c5f7`) at 20% (`wwdHero_bg.is-texture`). Old `Hero section / Global pages` instance parked in a hidden wrapper (`capability_old_hidden`), not deleted. **Why section**: same build as the Leistungsbereiche row below (shared `why_*` classes), static copy. Cleared legacy combos that broke the layout: `why_contain.u-container` (59rem max width, row), `why_sec.u-section` (14.5rem bottom padding), `why_title.u-text-style-h3` (bottom margin). Page head CSS = `capability-why.css`. Round 2: hero GSAP reveal (`capability-hero-reveal.js`, What we do pattern + eyebrow; guard class `cap-reveal-pending`); hero background centred and capped at 1920px with bottom/side blend gradients (`capability-hero.css`, page-scoped so What we do is untouched); partners marquee rewritten as one JS-driven track (`capability-partners-marquee.js/.css`): loop length measured between groups (no reset jump), hover eases the whole track to 25% speed (old CSS paused only the hovered group, so groups split). Old per-group CSS lives in the shared `Partneres-logos / Animation` embed (6 instances), switched off on this page only. Page code: `page-capability-template-head.html` / `-footer.html`. Round 3 (Why, thirds): `why_header` is now a 3-column grid (`repeat(3, minmax(0,1fr))`, column gap 2.75rem, same as `why_stats`) so the columns line up with the 3 stats; `why_main` (title + chart) spans columns 1-2, chart max-width removed so it fills 2/3; `why_aside` sits in column 3 above "88% of organizations…", stretched to the row height with `justify-content: space-between` (eyebrow top, text bottom); `why_text` max-width removed. From 991 down: one column, aside back to flex-start. Shared classes, so the Leistungsbereiche CMS template follows. Pending: visual QA at 1440/991/767/479 on the published page. |
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
