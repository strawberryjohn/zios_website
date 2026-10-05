# Zios build rules

The rulebook for every page and section. If a Figma frame disagrees with this file, this file wins, and the deviation goes in the tracker.
Status per rule: **Approved** (use it) · **Proposed** (my recommendation, needs your sign-off before it is applied site-wide).

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

Before touching a style that "doesn't take effect": check `app.css` / `app.js` from the external bundle (see CLAUDE.md).

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

Today the gap from a section header to its body varies between 2 and 8 rem across sections. Proposed fixed roles (px at 1440; the value goes in as rem):

| Role | Desktop | Tablet | Mobile | Status |
|---|---|---|---|---|
| Section padding top/bottom (`section-space/large`) | 140 | 100 | 64 | Approved desktop/tablet; mobile Proposed |
| Header block → section body | 64 | 48 | 40 | Proposed |
| Eyebrow → headline | 16 | 16 | 12 | Proposed |
| Headline → intro text | 24 | 24 | 16 | Proposed |
| Text → button / link | 32 | 32 | 24 | Proposed |
| Paragraph → paragraph | 16 | 16 | 16 | Proposed |
| Grid gap between cards | 24 | 24 | 16 | Proposed |
| Card inner padding | 48 | 32 | 24 | Proposed (Figma Expertise 50 → 48) |
| Title → text inside a card | 20 | 20 | 16 | Proposed |
| Page top under fixed navbar (`section-space/page-top`) | 80 | 80 | 80 | Approved |

Every spacing value is a multiple of 4px. Off-grid Figma values get snapped to the nearest role above, with the change noted in the tracker.

**Needed to apply (sign-off):** the `Spacing` collection has only whole-rem steps (`space/1`–`10`), and `section-space/small` and `section-space/main` are 0. Proposal: add named role variables (`space/head-to-body`, `space/heading-to-text`, `space/card-padding`, `space/grid-gap`, …) with Tablet/Mobile modes, so every section binds to the role and one change updates the whole site.

---

## 4. Typography

**Approved** scale (from the tracker):

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
- **Needs a swatch (sign-off):** the hero/partners dark blue `#012462` is hard-coded in 3+ places. Proposal: a swatch `blue-200` and a Theme mode "Night" that uses it.
- Gradients: only the two existing ones, white→blue-100 (text, e.g. 24/7) and blue-100→white (progress bars). A new gradient needs sign-off.

---

## 6. Shape: radius, borders, corners

- **Proposed:** Zios is **square-cornered**. Radius 0 on buttons, cards, tabs, inputs and images. The current Home build already looks like this (square tabs, square nav buttons).
- **Proposed:** the signature card shape is the **cut corner** (top-right, 57px at desktop, as on the Reviews cards). Use it on featured cards only, not everywhere. It should become a reusable class `u-cut-corner`.
- Circles only for avatars, the loader ring and status dots (`radius/round`).
- **Sign-off needed:** `radius/small` (5px) and `radius/main` (16px) are still Lumos defaults and are used by older components. Either set both to 0, or keep them only for legacy pages.
- Borders: `border-width/main` (≈1px) in `border` theme colour. No other widths.

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

1. **Type grid: 4px or 8px?** A side branch (2026-10-01) moved it to 8px. That puts H2 68, H5/H6 20 and text-small 12 off-grid. This file and CLAUDE.md on this branch still say 4px.
2. **Spacing role variables:** OK to add them to the `Spacing` collection (section 3)?
3. **Radius:** square everywhere, and set `radius/small` + `radius/main` to 0?
4. **Dark blue `#012462`:** add as swatch `blue-200` + Theme mode "Night"?
5. **External bundle** (`app.js`/`app.css`): take over or freeze?
