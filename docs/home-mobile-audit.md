# Home page: tablet and mobile audit

Date: 2026-10-03. Breakpoints: Tablet ≤991, Mobile L ≤767, Mobile ≤479.

**How this was checked:** I read every home section's Webflow styles at all four breakpoints (base, medium, small, tiny), plus the CSS in the page head and the animation scripts. I could not take visual snapshots: the Designer snapshot timed out because the Designer tab wasn't in the foreground, and this container can't open webflow.io. Items marked **(confirmed)** are certain from the style data alone. The others should be checked visually before fixing.

Hidden sections (old Expertise slider, Industries) are skipped.

## Priority 1: clearly broken

### Leistungsbereiche board (services) breaks below 991 **(confirmed)**
- On desktop each card is placed on a 16-column grid (e.g. `.services_card.is-04` spans columns 14 to 17).
- At Tablet the board switches to 2 columns, and at Mobile to 1 column. The card combos only reset `grid-row-start` at Tablet; their **column start and end stay at the desktop values**.
- Result: the browser invents up to 16 extra implicit columns. The cards land in squeezed or overflowing columns instead of the clean 2-up and 1-up stack. `overflow: hidden` on the board then clips them.
- The repo copy (`home-leistungsbereiche.css`) had `grid-area: auto` at ≤991, but that rule never made it into Webflow.
- **Fix:** on `services_card` combos `is-01` … `is-08` at Tablet, set `grid-column-start/end` and `grid-row-end` to `auto`. This is 8 style edits and has no effect on desktop.

### Lösungen product cards stay 2 columns on phones (likely)
- `.products_item_inner.u-grid-custom` is `repeat(2, 1fr)` at every breakpoint. Only the padding changes at ≤479.
- On a 360px phone that leaves about 150px per column for the heading, description, button and visual.
- **Fix:** at Mobile L (≤767), switch to 1 column (`minmax(0,1fr)`) and give the visual a fixed height. The existing `products_item_visual_wr` 21.63rem at tiny already suggests this was intended.

## Priority 2: works, but rough

### Hero
- **CTA width.** `.button-wr` is a fixed 22.5rem (360px), and 19.25rem (308px) at ≤479. With the side gutters this overflows on 320–360px phones.
  - **Fix:** `width: 100%; max-width: 22.5rem`.
- **Pinned scroll length.** The hero pins for 2 screen-heights of scroll (`home-hero-parallax.js`, `end: '+=200%'`). On a phone that is a lot of thumb-scrolling before any content appears.
  - **Fix:** use `+=120%` below 768px.
  - **Fix:** add `ScrollTrigger.config({ ignoreMobileResize: true })` so the iOS address bar collapsing doesn't make the pin jump.
- **Text overlap on short or landscape phones.** The heading and the bottom text group (`hero_bottom`, absolutely positioned at the bottom right) can collide. This needs a visual check at 375×667 and in landscape.
- **ASCII canvas cost.** The ASCII mountain canvas is fine: it is capped at 2× DPR and pauses offscreen. Optional: fewer twinkles under 768px to save battery.

### Expertise slider (expert_sec)
- At ≤767 the slide is `min-height: 34rem`, with the title block pinned to the top and the text block pinned to the bottom, both absolutely positioned.
- With the longer German copy on a 360px phone, the two blocks can run into each other, because the slide can't grow with its content.
- **Fix:** at ≤479, put the head and body back in normal flow (slide = flex column, space-between, padding 1.5rem) so the card grows instead of overlapping.

### Über Zios
- **Stat row spacing.** At Tablet the stats go 2-up, but `row-gap` is 0, so the second row of numbers sits right under the first.
  - **Fix:** use a row gap of 2.5rem at ≤991.
- **Divider lines.** Every stat has a right border line. In 2-up and 1-up layouts that line sits at the screen edge or next to nothing.
  - **Fix:** below 991, switch to a top border (a divider between rows) and drop the right border.
- **No change needed:** 24/7 (15 → 10 → 7.5rem), the header stacking and the odometer all have mobile values or adapt.

## Priority 3: polish

### Reviews
- The grid goes from 3 columns to 1 at ≤991, so tablets get three very tall, full-width cards.
- **Fix:** keep 3 → 2 at Tablet, then 1 at ≤767. Alternatively, make it a horizontal swipe row (scroll-snap) at ≤767, which saves a lot of page height.
- Hover is already limited to mouse users, and focus still shows the effect.

### Partners marquee
- **Fine.** It has its own Tablet and Mobile padding and logo heights.
- The hover slowdown script already skips touch devices.

### Type
- All sections use the Lumos text-style variables, so sizes scale fluidly.
- I didn't find one-off pixel font sizes in the home sections.
- **Remaining check:** confirm each fluid size's mobile minimum lands on the 4px grid. That's a variables check, not a per-section one.

## What I need
1. ~~P1 services fix~~: applied 2026-10-03 (Tablet combos `is-01`…`is-08`: grid column/row start+end = auto), unpublished.
2. Pick which P2/P3 items to do.
3. For visual verification: open the Designer link from CLAUDE.md and keep it in the foreground. Then I can snapshot each section at 991, 767 and 479.
