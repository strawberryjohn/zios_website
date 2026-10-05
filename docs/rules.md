# Zios build rules

The rulebook for every page and section. If a Figma frame disagrees with this file, this file wins, and the deviation goes in the tracker.
Status per rule: **Approved** (use it) · **Proposed** (needs sign-off before it is applied site-wide).
Decisions of 2026-10-05: 4px type grid, spacing variable system, square containers / rounded controls, dark blue + gradients as tokens, external bundle frozen.

Design width 1440px, so 1rem = 16px. Breakpoints: Desktop (base) · Tablet ≤991 · Mobile L ≤767 · Mobile ≤479.

---

## 1. Designer vs custom code

The single most important rule: **the Designer must show what the published site shows.** A future editor should be able to change any text, colour, spacing or size in the Designer without opening code.

| What | Where it lives | Why |
|---|---|---|
| Layout, size, spacing, colour, typography, borders, radius | Webflow class, using variables | Visible and editable in the Designer |
| Tablet / mobile changes | Webflow breakpoint styles on the same class | Ditto. **Never** in a `@media` block in custom code |
| Hover / focus states that Webflow supports | Webflow class states (Hover, Focus-visible) | |
| Simple scroll reveals, hover moves | Webflow Interactions, using the motion tokens below | Editable without code |
| CSS the style panel can't express (`clip-path` with `calc`, `background-clip: text`, `@keyframes`, `color-mix`, `:has`, `::before` content) | **One HTML embed inside the section**, labelled `CSS · <section>`, scoped to that section's classes | Embedded `<style>` renders in the Designer and travels with the section |
| CSS needed on every page | The embed in the `Global Styles` component | Lumos convention; renders in the Designer |
| Behaviour (sliders, canvas, GSAP sequences, counters) | JS in page footer code, or site footer code if it's used on several pages; source in `webflow/custom-code/` | Webflow can't do it natively |
| Never | CSS injected by JS, CSS in page head (except temporary hotfixes, which must be moved within a week), `!important`, hard-coded hex, IDs as style hooks | Invisible in the Designer, hard to find |

JS rules:
- Find elements by `data-js="<name>"` attributes, not by class names.
- Every script has a no-JS / reduced-motion state that matches the design (slide 1 visible, static image, final numbers shown).
- Every script file starts with a comment saying which section it drives and which `data-js` hooks it needs.
- Log every script in `docs/code-registry.md` when you add it.

**External bundle is frozen** (`zios-webflow.netlify.app/app.js` + `app.css`, repo `ndrewfrolov/zios`). Nobody changes it, and nothing new may depend on it. When a section is rebuilt, its behaviour moves into our own code (`webflow/custom-code/`, logged in the registry), and the section's styles move onto Webflow classes. If a style "doesn't take effect", check whether `app.css` overrides it, then beat it with a more specific Webflow class, never by editing the bundle.

---

## 2. Page and section anatomy

```
section  [<name>_sec  u-section-regular | u-section-full]   theme mode set here
  └ u-container                       (max 1920px, 35px gutter)
      ├ <name>_head                  section header block
      │   ├ Typography Eyebrow       (optional)
      │   ├ Typography Heading       (H2 for section titles)
      │   └ Typography Paragraph     (optional intro, text-large or text-main)
      ├ <name>_body                  cards / grid / slider
      └ <name>_foot                  (optional) CTA / "alle anzeigen" link
```
- **Approved:** full-bleed backgrounds, content in `u-container` (see CLAUDE.md, section width rule).
- **Approved:** class naming `<section>_<element>` (Lumos), combo modifiers `is-<variant>`.
- **Approved:** new sections are built as components in the `• Section` group, so the next page can reuse them.
- Spacing goes on the parent as `gap` (flex/grid), not as margins on children. Use the `Spacer` component only where a gap isn't possible.

---

## 3. Spacing

**Approved.** Every gap is a role from the `Spacing` collection. Bind the variable, never type a value. The collection has three modes: Base (desktop), `tablet` (≤991) and `mobile` (≤767). Body switches the mode at each breakpoint, so a bound value adapts on its own.

| Role | Variable | Desktop | Tablet | Mobile |
|---|---|---|---|---|
| Section padding top/bottom | `section-space/large` | 140 | 100 | 64 |
| Page top under fixed navbar | `section-space/page-top` | 80 | 80 | 80 |
| Header block → section body | `space/head-to-body` | 64 | 48 | 40 |
| Eyebrow → headline | `space/eyebrow-to-heading` | 16 | 16 | 12 |
| Headline → intro text | `space/heading-to-text` | 24 | 24 | 16 |
| Text → button / link | `space/text-to-action` | 32 | 32 | 24 |
| Paragraph → paragraph | `space/paragraph` | 16 | 16 | 16 |
| Grid gap between cards | `space/grid-gap` | 24 | 24 | 16 |
| Card inner padding | `space/card-padding` | 48 | 32 | 24 |
| Title → text inside a card | `space/card-title-to-text` | 20 | 20 | 16 |

- Apply the gaps as `gap` on the parent (flex/grid), not as margins on children.
- `space/1`–`space/10` (1–10 rem) stay for one-off layout sizes. They are not for the roles above.
- `section-space/small` and `section-space/main` are 0 and unused; don't use them.
- Every spacing value is a multiple of 4px. Off-grid Figma values snap to the nearest role, and the change is noted in the tracker.
- Existing Home sections still use their old hard-coded gaps. They move onto these variables section by section during the cleanup (`designer-cleanup.md`, step 2).

---

## 4. Typography

**Approved** scale, on a **4px grid** (confirmed 2026-10-05):

| Style | Desktop | Tablet | Mobile | Use |
|---|---|---|---|---|
| Display | 96 | 96 | 96 | Hero only |
| H1 | 80 | 64 | 48 | Page title (one per page) |
| H2 | 68 | 48 | 40 | Section titles |
| H3 | 40 | 40 | 32 | Big feature titles |
| H4 | 32 | 32 | 24 | Card titles (large cards, slides) |
| H5 | 24 | 24 | 20 | Card titles (grid cards) |
| H6 | 20 | 20 | 16 | Tabs, small titles |
| text-large | 24 | 24 | 20 | Lead / intro paragraph |
| text-main | 16 | 16 | 16 | Body, links, buttons |
| text-small | 12 | 12 | 12 | Labels, tags, eyebrows |

- Body copy is always 16px, even where Figma says 14 or 15.
- Same role, same style, everywhere. All section titles are H2, all grid card titles are H5, and so on.
- Sizes come from the Text Style variable modes, never from a font-size on a section class.
- One-off decorative sizes (the 240px "24/7") live on a section class.
- Font: Allianceno 300/400/500/600. No 700 file is uploaded, so don't use Bold.

---

## 5. Colour

- **Approved:** only `swatch/*` and Theme (`--_theme---*`) variables. Set the theme mode (Base / Dark / Brand) on the section, so children inherit it.
- Text on dark sections: `white-100` for headings, `blue-30` for secondary text, `blue-60` for accents. On light sections: `blue-160-2.0` for headings, `blue-130` for body, `black-50` for muted text.
- **Approved:** `swatch/blue-170` = `#012462`, the "night" blue of the hero, partners and Expertise. It is bound on `hero_gsap_trigger_wr`, `hero_layer.is-ground` and `partners_sec`.

### Gradients
Webflow can't store a gradient in a variable, and its style API drops `var()` inside gradients. So **each gradient is one utility class**, and that class is the only place its hex stops may appear. Add the class to the element; never copy the gradient into a section class.

| Class | Gradient | Used for |
|---|---|---|
| `u-gradient-sky` | radial glow over night → `#1150a8` | hero sky layer |
| `u-gradient-night-to-light` | night → blue-100 → blue-60 → white, top to bottom | Expertise stage (dark into light section) |
| `u-gradient-night-split` | night top half, white bottom half | section that straddles dark and light |
| `u-gradient-text` | white → blue-100 at 87°, clipped to text | big numbers (24/7) |

A new gradient needs sign-off and gets its own `u-gradient-*` class. Section classes still carry their old copies until the cleanup moves those elements onto these classes.

---

## 6. Shape: radius, borders, corners

**Approved:**
- **Square (radius 0):** sections, subsections, panels, cards, images, sliders, banners. Bind `radius/main`, which is now 0. Don't type 0, so the whole site can be changed in one place.
- **Rounded:** small controls only: buttons, tags/chips, inputs, icon wrappers, tab pills. Use `radius/small`.
- **Circle:** avatars, bullets, loader ring, status dots. Use `radius/round`.
- **Cut corner** (top-right, 57px at desktop, as on the Reviews cards) is the signature card shape. Use it on featured cards only.

Done 2026-10-05: `radius/main` set to 0, and these classes were moved from hard-coded rounding onto it: `news_slide_image_wr`, `achieve_item`, `whatWeDo_tabs_component`, `case_quote_item`, `reviews_card_bg`, `reviews_card_fill`, `reviews_overlay.u-cover-absolute`, `solutions_card`, `cta_contain`, `why_stat_wr`, `products_item_visual_wr`, `leaderslide_image_wr`, `about_visual_wr`, `cases_layout.u-grid-custom`, `roadmap_contain.u-container`, `review_slide_wr`, `cases_sidebar`, `expertise_card_wr`, `cookie_ban_component`, `swiper-slide.products`, `swiper-slide.howWeHelp`, `g-values_keys_list_item_wr…`.

**Open:** controls currently use at least 8 different radii (5, 6, 8, 12, 20, 26, 36, 46, 66px, pills). They need one value for `radius/small`, see Open decisions. The navbar dropdown panels were left alone; they get their own pass.

Borders: `border-width/main` (≈1px) in `border` theme colour. No other widths.

---

## 7. Icons and arrows

- **Proposed:** one arrow everywhere. It's the line arrow from the Expertise slider: 34×34 viewBox, 1.5 stroke, square caps, `currentColor`. Build it as the `Icon Arrow` component with a `direction` prop (right / left / up-right).
- Arrow buttons (slider prev/next): 44px square hit area (40px on mobile), 1px border in `currentColor`, no radius, icon 24px. Hover: background fills with the text colour and the icon inverts.
- Text link with arrow (`Button / Text Link`): arrow on the right, moves 4px right on hover.
- No icon fonts, no data-URI icons in CSS, no SVGs built in JS. All SVGs are Webflow elements or components.

---

## 8. Motion

| Token | Value | Use |
|---|---|---|
| fast | 200ms | colour / opacity on hover and focus |
| base | 400ms | element moves (card lift, arrow nudge) |
| slow | 700ms | slide changes, section reveals |
| ease-out | `cubic-bezier(0.22, 1, 0.36, 1)` | everything that moves in or reacts |
| linear | linear | marquees, progress bars, loaders |
| autoplay | 6s per slide, progress bar shows the timer | every auto-advancing slider |

- **Reveal on scroll (Proposed):** fade + 24px rise, `slow` + `ease-out`, cards stagger 80ms, once only.
- **Hover:** cards lift 8px (Leistungsbereiche: 28px is the approved exception), arrows nudge 4px, gradients fade in.
- **Signature effect:** the animated ASCII mountain (`- = * #` symbols) is reserved for hero, Über Zios and footer. Don't add it to new sections without sign-off.
- Every animation has a `prefers-reduced-motion` fallback: no movement, final state shown.
- Every slider uses the same pattern: loop, autoplay 6s, timer bar, arrow buttons from section 7, swipe on touch.

---

## 9. Responsive

- Check every section at 1440, 991, 767 and 479 before calling it done.
- Grids step down 4 → 2 → 1 (or 3 → 2 → 1). Never leave desktop `grid-column` positions active on smaller breakpoints. Reset them to `auto`.
- Absolutely positioned text goes back into normal flow below 767, so cards grow instead of overlapping.
- Fixed widths become `width: 100%` with a `max-width`.

---

## 10. Before you publish

- [ ] Designer and published site match at 1440 / 991 / 767 / 479 (except JS motion).
- [ ] No new code in page head; new CSS is in a section embed or on classes.
- [ ] No hidden sections added to a live page.
- [ ] New code is in `webflow/custom-code/` and listed in `docs/code-registry.md`.
- [ ] Tracker updated (one line per page).
- [ ] You confirmed the publish (Claude never publishes on its own).

---

## Open decisions (need your answer)

1. **Control radius:** one value for buttons, tags, inputs and icon wrappers (`radius/small`, now 5px). Recommendation: **4px** (on the grid, quiet next to the square cards). Pills (fully round buttons) yes or no?

## Decided

| Date | Decision |
|---|---|
| 2026-10-05 | Type grid stays **4px**. |
| 2026-10-05 | Spacing is a variable system (section 3), with a new `mobile` mode in `Spacing`. |
| 2026-10-05 | Containers, cards and images are square; small controls keep rounding (section 6). |
| 2026-10-05 | `#012462` becomes `swatch/blue-170`; gradients become `u-gradient-*` classes (section 5). |
| 2026-10-05 | External bundle (`app.js`/`app.css`) is **frozen** (section 1). |
