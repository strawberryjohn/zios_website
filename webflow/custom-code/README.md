# Custom code

Source of truth for any code added to Webflow: HTML embeds, site/page head and footer code, and registered scripts.
Name each file after where it lives, e.g. `site-head.html`, `page-home-footer.html`, `embed-hero-video.html`.

`assets/` holds source files for assets uploaded to Webflow (e.g. the Figma-exported achieve card icons), so they can be re-uploaded if needed.

`capability-features.css` / `capability-features.js`: the "What can I do" section, pasted into the head/footer of both Capabilities (Template) and the Leistungsbereiche CMS template (the `page-*-template-*.html` files are the full blocks as they are in Webflow).

`capability-cando.css` / `capability-cando.js`: the static (non-CMS) "What can I do" section `cando_sec` on Capabilities (Template); the CMS version above stays on the Leistungsbereiche template.
