# Figma → Webflow build tracker

Status values: `Design in progress` · `Ready to build` · `In progress` · `Built` · `QA'd` · `Published`

Paste the Figma frame link (with `node-id`) for each page once its design is final.

| Page | Figma frame | Webflow page ID | Status | Notes |
|---|---|---|---|---|
| Home | [10028:23778](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10028-23778) | `694123a0cdbcf3917d15a080` | In progress | Type scale applied site-wide. Built (awaiting visual QA): Über Zios restyle (classes), new static Leistungsbereiche mosaic `services_sec` (old `indastries_sec` hidden, not deleted), expertise slider restyle + own loop/tab JS in page custom code. Pending: slider background images + ASCII overlay (need Designer for asset upload). Redesigned: Expertise slider ([10119:14288](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-?node-id=10119-14288)), Unsere Leistungsbereiche (10028:29331), Über Zios (10028:29626) |
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

| Section | Type |
|---|---|
| Hero (`hero_wrap`) | full |
| Partners + Expertise (`gradient_wrap`, `partners_sec`, `expertise_sec`) | full |
| Unsere Leistungsbereiche (`services_sec`) | regular |
| Produkte & Plattformen (`solutions_sec`) | regular |
| Über Zios header (`aboutUs_header_wr`, in container) | regular |
| Über Zios stats panel (`aboutUs_main_wr`) | full |
| Greetings / Notifications (component `greetings_sec`) | regular |
| Reviews (`reviews_sec`) | regular |
| FAQ (component `FAQ_sec`) | regular |
| News (component `news_sec`) | regular |
| Footer (component `footer_wrap`) | full |

Component sections (Greetings, FAQ, News, Footer) carry the class in their definition, so every page using them already follows the rule.
