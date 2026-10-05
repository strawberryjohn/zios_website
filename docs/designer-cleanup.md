# Designer cleanup: audit and plan

Audit date: 2026-10-05, read from the live Webflow site and from every branch in this repo.
Goal: anyone who opens the Designer, with or without Claude, sees roughly what the published site shows and can tell where everything else lives.

## What's wrong today

### 1. Home styling mostly lives in page custom code, and the Designer never runs it
Webflow does not run page or site **head/footer custom code** in the Designer canvas. It only runs on the published site. On Home that code is now about 40 KB:

| Where | What | Size |
|---|---|---|
| Home head | Partners colour, Über Zios, Leistungsbereiche marquee/hover, Expertise v3, **old Expertise (section is hidden)**, Reviews, News | 11 KB |
| Home footer | Swiper setups, Expertise v3 JS, ASCII mountain (Über Zios + footer), hero ASCII, hero parallax | 30 KB |
| Home registered scripts (branch `project-thread-8svn2n`) | Tablet/mobile CSS **injected by JS** (`HomeMobileCss1–3`), mobile hero, sliders, news, reviews | 8 scripts |
| External bundle `zios-webflow.netlify.app/app.js` + `app.css` | Animations, sliders, section styles (repo `ndrewfrolov/zios`, which we can't reach) | unknown |

So a section can look finished on the live site and broken or unstyled in the Designer. The mobile CSS is the worst case: it is minified, wrapped in JavaScript and lives in registered scripts. The only way to find it is to know it's there.

### 2. Hidden and legacy content on the live page
- `indastries_sec`: hidden (old Industries section, replaced by `services_sec`).
- Old `expertise_sec`: hidden (replaced by `expert_sec`). Its 3 KB of CSS still loads on every visit.
- `chat_widget_main` and `cookie_ban_component.hide` are hidden on purpose because JS opens them. They look the same as the dead sections in the Navigator.
- Old hero visuals are hidden inside `hero_wrap`.
- Head code still has commented-out loaders for a Cloudflare tunnel, a `lhr.life` tunnel and jsDelivr. These are dev leftovers.

### 3. The repo is no longer one source of truth
- There is **no `main` branch**. Seven `claude/*` branches each hold part of the work and were never merged. Examples: `home-ascii-mountain.js`, `home-mobile.css`, `home-reviews` CSS and the News arrows are each live in Webflow but exist on only one branch.
- The branches also disagree on rules: one moves the type scale to an **8px grid** (2026-10-01), the others still say 4px.
- The tracker's Home row is one paragraph of more than 2,000 characters, so nobody can scan it.

### 4. No shared spacing, radius, icon or motion rules
Measured on existing header wrappers, the gap from headline to section body is 2, 2.5, 3.125, 4.375 or 8 rem, depending on who built the section. Radius is hard-coded (0.375rem) in places even though `radius/*` variables exist. There are three different arrow implementations (CSS data-URI in Expertise, JS-built SVG in the mobile sliders, Webflow SVG in News) and four easing/duration combinations. `section-space/small` and `section-space/main` are 0.
`docs/rules.md` fixes this going forward.

## The plan

Work top to bottom. Every step is reversible, and nothing is deleted or published without your OK.

### Step 1: one source of truth (repo)
- [ ] Merge all `claude/*` branches into a new `main`, resolving the custom-code files against what is actually live in Webflow (Webflow wins on conflicts).
- [ ] From then on, every session branches from `main` and gets merged back at the end of the session. No more long-lived side branches.
- [x] Type grid decided: 4px (2026-10-05). The 8px change on `claude/intelligent-meitner-ujy0cr` must not be merged in.
- [ ] Shorten the tracker: one line per page, with section details moved to `docs/code-registry.md`.

### Step 2: move styling into the Designer
Rule: **anything that is "how it looks" belongs in Webflow classes**. That covers layout, size, colour, spacing and every breakpoint override. See the decision table in `rules.md`.
- [ ] Rebuild the tablet/mobile CSS (`home-mobile.css`) as breakpoint styles on the real classes. Remove the 3 `HomeMobileCss*` registered scripts.
- [ ] Move the plain properties in the Home head CSS onto their classes (e.g. `expert_*` widths and paddings, Über Zios grid placement, partners colour).
- [ ] CSS that Webflow's style panel can't express (`clip-path` with `calc`, `background-clip: text`, `@keyframes`, `color-mix`, `:has`) goes into **one embed per section, inside that section**, labelled `CSS · <section>`. Unlike head code, an embed's `<style>` **does render in the Designer**, and it moves, duplicates and gets deleted together with its section.
- [ ] Bind each section's gaps to the new spacing variables (`rules.md` §3) and move gradient elements onto the `u-gradient-*` classes. Remove the gradient from the section class in the same step. The Home head code still has `#012462` in the partners CSS; it goes away with that block.
- [ ] JS stays in custom code, but every JS-driven section must still look right with JS off. For example, the hero shows its static ASCII image and the first frame of the parallax, and a slider shows slide 1. That way the Designer state is a true "frame 0".

### Step 3: make the Navigator self-explanatory
- [ ] Give every top-level section a Navigator display name in the form `<Section> · <what code touches it>`, e.g. `Hero · JS: parallax, ASCII canvas`, `Expertise · JS: slider`, `Über Zios · JS: ASCII, count-up`. A display name is metadata only and doesn't change the markup.
- [ ] Have scripts find their elements by `data-js="hero-parallax"` (a custom attribute visible in the settings panel) instead of class names. Renaming a class can then no longer silently break a script, and anyone selecting the element sees that code drives it.
- [ ] Elements hidden on purpose (opened by JS) get `· hidden until JS` in their display name.

### Step 4: clear out dead content (needs your OK per item)
- [ ] Move `indastries_sec`, old `expertise_sec` and the old hero visuals to the **Archive** page (draft, already exists). Then remove them from Home, together with the old Expertise CSS and the disabled loader comments.
- [ ] Rule from then on: **no hidden sections on live pages**. If something might come back, it lives on Archive.

### Step 5: keep it that way
- [ ] `docs/code-registry.md` lists every piece of custom code: where it's injected, which section it affects, and what the Designer shows without it. Update it in the same commit as the code.
- [ ] Before each publish, run the checklist at the end of `rules.md`.
- [x] External bundle frozen (2026-10-05). Rebuilt sections move their behaviour into our own code.

## Effort
- Step 1: one session (merge plus conflict check against live code).
- Step 2: the biggest step, about one session per 2–3 sections. Do it section by section and check Designer against published at 1440 / 991 / 767 / 479 each time. It needs the Designer open (see CLAUDE.md).
- Steps 3–4: one short session.
