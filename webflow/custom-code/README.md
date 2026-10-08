# Custom code

Source of truth for any code added to Webflow: HTML embeds, site/page head and footer code, and registered scripts.
Name each file after where it lives, e.g. `site-head.html`, `page-home-footer.html`, `embed-hero-video.html`.

`assets/` holds source files for assets uploaded to Webflow (e.g. the Figma-exported achieve card icons), so they can be re-uploaded if needed.

`capability-features.css` / `capability-features.js`: the "What can I do" section, pasted into the head/footer of both Capabilities (Template) and the Leistungsbereiche CMS template (the `page-*-template-*.html` files are the full blocks as they are in Webflow).

`capability-cando.css` / `capability-cando.js`: the static (non-CMS) "What can I do" section `cando_sec` on Capabilities (Template); the CMS version above stays on the Leistungsbereiche template.

`capability-achieve-rain.js` / `.css`: hover for the "What you'll achieve" cards (digital rain + lighter gradient). Webflow runs the minified copies (`capability-achieve-rain.min.js`, `capability-achieve-rain-style.min.js`) as registered inline scripts `achieverain` and `achieverainstyle` (v1.0.0) on Capabilities (Template) and the Leistungsbereiche template. To change them: edit the source, re-minify under 2,000 characters (terser), register a new version and update the page scripts.
