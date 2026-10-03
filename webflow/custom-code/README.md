# Custom code

Source of truth for any code added to Webflow: HTML embeds, site/page head and footer code, and registered scripts.
Name each file after where it lives, e.g. `site-head.html`, `page-home-footer.html`, `embed-hero-video.html`.

## Registered page scripts (Home)
`registered/` holds the exact minified sources registered as inline page scripts (≤2000 chars each).
Readable sources: `home-mobile.css` (injected by HomeMobileCss1/2/3 in the header) and `home-mobile.js` (one block per footer script).
To change one: register the same display name with a new version, then `add_page_script` with that version.
