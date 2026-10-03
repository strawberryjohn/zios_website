# Custom code

Source of truth for any code added to Webflow: HTML embeds, site/page head and footer code, and registered scripts.
Name each file after where it lives, e.g. `site-head.html`, `page-home-footer.html`, `embed-hero-video.html`.

## Snapshots of the deployed blocks

These four files are verbatim copies of what is live in Webflow (last synced 2026-10-03).
Webflow strips the comments we write, so the readable, commented source for each Home block is in the per-section files below.
When you change a block, edit the section file, paste it into Webflow, then refresh the snapshot.

| File | Webflow block |
|---|---|
| `site-head.html` | Site settings › Custom code › Head |
| `site-footer.html` | Site settings › Custom code › Footer |
| `page-home-head.html` | Home page settings › Head |
| `page-home-footer.html` | Home page settings › Footer |

## Home page sections

| File | Where it lives |
|---|---|
| `home-partners.css` | Home head |
| `home-about.css` | Home head |
| `home-leistungsbereiche-hover.css` | Home head |
| `home-expertise-v3.css` | Home head |
| `home-expertise-slider.css` | Home head (old slider, section hidden) |
| `home-reviews.css` | Home head |
| `home-news.css` | Home head |
| `home-expertise-v3.js` | Home footer |
| `home-ascii-mountain.js` | Home footer (Über Zios + footer blue panel) |
| `home-hero-ascii.js` | Home footer, before the parallax script (live symbol swap lands via the hero PR) |
| `home-hero-parallax.js` | Home footer |
| `home-reviews-reveal.js` | Registered script `HomeReviewsReveal` v1.0.0, applied to the Home footer |
| `home-expertise-slider.js` | Not live (old slider, removed from the footer) |
| `home-leistungsbereiche.html` / `.css` | Built as Webflow elements and classes, not custom code |
| `home-expertise-v3.html` | Built as Webflow elements, not custom code |
