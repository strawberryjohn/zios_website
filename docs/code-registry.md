# Custom code registry

Every piece of code that affects the site and isn't a Webflow class or interaction. Read from live Webflow on 2026-10-05.
**Update this file in the same commit as the code.** "Designer shows" describes how the canvas looks without the code, which is what the next editor sees.

Legend for Where: SH/SF = site head/footer code · PH/PF = page head/footer code · REG = registered script · EMB = HTML embed on the canvas · EXT = external bundle (`zios-webflow.netlify.app`, repo `ndrewfrolov/zios`, no access).

## Site-wide

| Code | Where | Affects | Designer shows |
|---|---|---|---|
| Finsweet Attributes (scroll disable) | SH | menu open state | n/a |
| Deep Chat bundle | SH | chat widget | widget shell only |
| Swiper 12 CSS + JS | SH / SF | all sliders | slides stacked/overflowing |
| Page loader, accordion, `.char`, news slide margins CSS | SH | loader, FAQ, split text | — |
| Dropdown click fix, News swiper, FAQ accordion JS | SF | navbar, News, FAQ | closed accordions |
| `app.css` / `app.js` | EXT (Home PH/PF) | animations, sliders, several section styles | **frozen**: no edits, nothing new may depend on it |

## Home (`694123a0cdbcf3917d15a080`)

| Section | Code | Where | Repo file | Designer shows |
|---|---|---|---|---|
| Hero | 5-layer parallax + pinned scroll sequence | PF | `home-hero-parallax.js` | static layers, text in start position |
| Hero | ASCII mountain canvas (layer 3) | PF | `home-hero-ascii.js` | static image fallback |
| Hero (mobile) | two-screen mobile hero | REG `HomeMobileHero` | `registered/min-HomeMobileHero.js`¹ | desktop hero |
| Partners | dark blue bg + edge fade (hex `#012462`; class itself now uses `swatch/blue-170`) | PH | `home-partners.css` | Webflow bg colour; fades differ |
| Partners | marquee slows on hover | REG `HomePartnersHoverSlow` | `home-partners-hover.js`¹ | — |
| Expertise (`expert_sec`) | slide sizing, nav, light slide, mobile | PH | `home-expertise-v3.css` | **unsized slides** |
| Expertise | loop, autoplay 6s, tab timer | PF | `home-expertise-v3.js` | slide 1, no timer |
| Expertise old (`expertise_sec`, hidden) | CSS still loaded | PH | `page-home-head-additions.html` | hidden; **remove** |
| Leistungsbereiche (`services_sec`) | strip marquee + card hover lift | PH | `home-leistungsbereiche-hover.css` | static |
| Über Zios (`aboutUs_sec`) | 24/7 gradient text, grid placement, loader ring | PH | `home-about.css` | **24/7 in flat colour, layout differs** |
| Über Zios + Footer | ASCII mountain canvas | PF | `home-ascii-mountain.js`¹ | empty panel |
| Über Zios | numbers roll like a counter | REG `HomeAboutCountUp` | `home-about-countup.js`¹ | final numbers |
| Reviews | cut corner, gradient, hover, quote marks | PH | `home-reviews.css`¹ | square cards, no quotes |
| Reviews | GSAP stagger reveal | REG `HomeReviewsReveal` | ¹ | visible |
| News | arrow cursor + focus ring | PH | `home-news.css`¹ | — |
| Tablet/mobile (all sections) | CSS **injected by JS** | REG `HomeMobileCss1–3` (head) | `home-mobile.css`¹ | **desktop layout at every breakpoint**; move to breakpoint styles |
| Tablet/mobile | section order, slider kit, reviews/news sliders | REG `HomeMobileSections`, `HomeMobileSliderKit`, `HomeMobileReviews`, `HomeMobileNews` | `home-mobile.js`¹ | grids instead of sliders |
| — | commented-out tunnel / jsDelivr loaders, commented-out old swipers | PH / PF | — | **remove** |

¹ Exists only on a side branch (`claude/project-thread-8svn2n`, `claude/gallant-dirac-tdtwxy` or `claude/peaceful-heisenberg-crtgxk`) until all branches are merged into `main`.

## Other pages
Not audited yet. Add a section per page as it is built.
