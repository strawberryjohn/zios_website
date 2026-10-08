# Webflow inventory: Zios

Snapshot taken 2026-09-27 via Webflow MCP. Re-pull when in doubt; the site is the source of truth.

## Pages

Static pages (P = published, D = draft):

| Page | Slug | ID | Status |
|---|---|---|---|
| Home | `/` | `694123a0cdbcf3917d15a080` | P |
| What we do | `what-we-do` | `69aed262702891b6c33f36a8` | P |
| About us | `about-us` | `69ca45b3349d87dbe29f8f74` | P |
| Approach and mission | `approach-and-mission` | `69ce8152e5b958f6d63d838b` | P |
| Our team | `our-team` | `69d388eeee3b3d6e7c6d2547` | P |
| Cases | `cases` | `69c52f015c00b1f066a8fc3a` | P |
| Careers | `careers` | `69cf83040634e520426f02d9` | P |
| Blog | `blog` | `69d3b2eb4db186176bc0ed53` | P |
| FAQ | `faq` | `69d50390b3e7e7c85635a2e1` | P |
| Contacts | `contacts` | `69cfb6ea9c5550c894a2dd8c` | P |
| Privacy&Policy | `privacy-policy` | `69f0c61afbbfefb259c3ca5d` | P |
| Search Results | `search` | `694123a0cdbcf3917d15a086` | P |
| 404 | `404` | `694123a0cdbcf3917d15a083` | P |
| Password | `401` | `694123a0cdbcf3917d15a082` | P |
| Industry (Template) | `industry` | `69c11b7c0e030cd21a26a9a5` | D |
| Capabilities (Template) | `capibility-service` | `69bc155fa7556de240825b39` | D |
| Components | `components` | `6a60cdd4497931d305696514` | D |
| Example Components | `example-components` | `694123a0cdbcf3917d15a084` | D |
| Styleguide | `styleguide` | `694123a0cdbcf3917d15a081` | D |
| Archive | `archive` | `69bab7d0ee20254876577b4f` | D |

Most static pages still have placeholder SEO ("Website Name" / "Place website meta description here").

## CMS collections (and template pages)

| Collection | Slug | Collection ID | Template page ID |
|---|---|---|---|
| News | `blog` | `698db4a1aa9a2b8975b8d2bc` | `698db4a1aa9a2b8975b8d2c2` |
| Reviews | `reviews` | `69a1672c15df2d84b479f0d8` | `69a1672d15df2d84b479f109` |
| FAQs | `faq` | `69a1a0bd92587067663e6624` | `69a1a0bd92587067663e662b` |
| FAQ filters | `faq-filters` | `69d5053c09f3a50f2fd296e4` | `69d5053c09f3a50f2fd296f7` |
| Partners logos | `partners-logos` | `69a1b03bfed29aa72a94b93b` | `69a1b03bfed29aa72a94b94b` |
| Cases | `cases` | `69c5341f2ca975f0f3278244` | `69c5341f2ca975f0f327824c` |
| Cases → Filters | `cases-filters` | `69c5399f2dd06caa461defe4` | `69c5399f2dd06caa461defea` |
| Key outcomes | `cases-key-outcomes` | `69ca23e6c20aedbb8d593bda` | `69ca23e6c20aedbb8d593bf5` |
| Leistungsbereiche (capabilities) | `capabilities` | `69e9ddee2088dcee56f1661f` | `69e9ddef2088dcee56f16626` |
| Capabilities → What can you do | `what-can-you-do` | `69bc15fa33da6c3aadfabb76` | `69bc15fa33da6c3aadfabbca` |
| Capabilities → What you will achieve | `capabilities-what-you-will-achieve` | `69e9dd87d99a6c4579c77edd` | `69e9dd87d99a6c4579c77ef5` |
| Unsere Leistungsbereiche → Tags | `core-industries-tags` | `69ca3c65a428c9f5907d57c5` | `69ca3c66a428c9f5907d57d2` |
| Branchen (industries) | `industries` | `69ea24bb0bd206a41968f3e9` | `69ea24bb0bd206a41968f3f0` |
| How we help items | `how-we-help-items` | `69ea28cf244295a618c8148c` | `69ea28cf244295a618c81492` |
| Produkte & Plattformen | `produkte-plattformen` | `6a8457d1860d0fc1fba37fb3` | `6a8457d1860d0fc1fba37ff3` |
| Key links | `key-links` | `69ca3e727a87bef29b75c838` | `69ca3e727a87bef29b75c83e` |
| Pages | `pages` | `69ca3eafce8020ee13a81102` | `69ca3eb0ce8020ee13a81108` |
| Careers | `careers` | `69cf847769fc63d748f2187c` | `69cf847769fc63d748f21882` |
| Team | `team` | `69cfc49f17dd72c9727c2910` | `69cfc49f17dd72c9727c2916` |
| 🔵 Reference collections | `reference-collections` | `69ef0f9f1eb473c5dfc2c06b` | `69ef0f9f1eb473c5dfc2c073` |

Leistungsbereiche fields added 2026-10-08 for the Why section stats: `3rd-section-number-2`, `3rd-section-text-2`, `3rd-section-number-3`, `3rd-section-text-3` (PlainText, optional). The existing `3rd-section-number` / `3rd-section-text` are stat 1.

## Fonts

**Allianceno** (Alliance No.2), custom-uploaded: 300 Light (otf), 400 Regular (otf), 500 Medium (woff2), 600 SemiBold (woff2).
The Typography collection also defines a 700 Bold weight variable, but no 700 file is uploaded.

## Variable collections

| Collection | Modes | Holds |
|---|---|---|
| default | Base, Mobile L | swatches, site grid (12 cols, margin/gutter clamps, 375–1370px fluid range), radius, border, focus, max-widths |
| Theme | Base, Dark, Brand | `background`, `background-2`, `text`, `heading-accent`, `border`, button-primary/secondary, text-link, nav |
| Button Style | Base, Secondary | |
| Typography | Base | font family, weights, letter-spacing (0 to -8%), line-heights, font sizes (text-small/main/large, h1–h8, display) |
| Text Style | Base, Text Small, Text Large, H6–H1, Display | per-style type settings |
| Spacing | Base, tablet | `space/1–10` (1–10rem), section-space (large 8.75rem / 6.25rem tablet, page-top 5rem) |
| Column Count | Base, 2–12 | |
| Gap | Base, 0–8 | |
| Trigger, State | Base, Active | interaction state |
| Responsive | Base, Medium, Small, xSmall | |

### Color swatches

| Token | Hex |
|---|---|
| `swatch/blue-100` (brand) | `#238cff` |
| `swatch/blue-80` | `#4fa3ff` |
| `swatch/blue-60` | `#7bbaff` |
| `swatch/blue-30` | `#bdddff` |
| `swatch/blue-10` | `#e9f3ff` |
| `swatch/blue-130` | `#1962b2` |
| `swatch/blue-160` | `#0e3866` |
| `swatch/blue-180` | `#071c33` |
| `blue-160-2.0` | `#0f2a48` |
| `background-2.0` | `#e8f2ff` |
| `swatch/black-100` | `#030303` |
| `swatch/black-90` | `#151515` |
| `swatch/black-70` | `#4f4f4f` |
| `swatch/black-50` | `#818181` |
| `swatch/black-20` | `#cdcdcd` |
| `swatch/black-10` | `#e5e5e5` |
| `swatch/black-5` | `#f4f4f4` |
| `swatch/light-200` | `#ebebeb` |
| `swatch/white-100` | `#fcfcfc` |

### Type scale (desktop max → mobile min, rem)

Display 6 · H1 5.125→3 · H2 4.25→3 · H3 2.5→1.5 · H4 1.875→1 · H5 1.375→1 · H6 1.125→1 · H7 1→0.8125 · H8 0.875→0.75 · Text large 1.2 · Text main 1→0.85 · Text small 0.875

## Components (by group)

- **Global**: Navbar, Footer, Global Styles, Global Guides, Key link, Key link / tag, Key links / Section
- **• Section**: Hero section / Global pages, Hero section / On blue, CTA section / Global pages, Notifications look / Section, Industries / Styles, • Section Services, • Section Custom (duplicate this)
- **Other sections**: FAQ / Section, News / Section, Achieve section / Item, Fluid pages / styles
- **Wrapper**: Section, Layout, Grid, Block, Content Wrapper, Button Wrapper
- **Typography**: Typography Heading, Typography Paragraph, Typography Eyebrow, Typography Tag, Typography Plain
- **Button**: Button Main, Button Primary, Button Secondary, Primary Button / Icon, Button / Text Link, Button Text, Button Text 2.0, Button Play, Button Close, Button / Show more, Swiper button
- **Card**: Card Primary
- **Interactive**: Accordion List, Accordion Item, Tab, Tab Link, Modal, Slider, Swiper
- **Tabs**: Global Tabs / Styles, Tabs filter list / Tabs
- **Form**: Contact Form, Form Input, Form Textarea, Form Select, Form Select Option, Form Checkbox, Form Radio, Form Fieldset, Form Range, Form Label Text
- **Visual**: Visual Image, Visual Video, Media Overlay, iFrame
- **SVG**: Logo, Icon Arrow, Icon Arrow Full, Icon X, Icon Search, Stroke Path
- **Utility**: Clickable, Spacer, Starter CSS, Starter JS
- **Page-specific**: Capabilities / All page styles, Industries / Custom styles, How we help / Item, Key Outcome / Case page, Partneres-logos / Animation, Menu, Menu / Submenu link, Footer Group, Footer Link
