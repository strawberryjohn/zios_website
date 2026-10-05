# Zios website

Marketing site for Zios, designed in Figma and built in Webflow via the Webflow MCP.
There is no local code build: this repo holds the build docs, the page tracker, and any custom code (embeds, scripts) that ends up in Webflow.

## Targets

| What | Value |
|---|---|
| Webflow site | **Zios** (`zios-test`) |
| Site ID | `6941239fcdbcf3917d159fd2` |
| Workspace ID | `68cd292c6961feb9ad07ea98` |
| Home page ID | `694123a0cdbcf3917d15a080` |
| Primary locale | English (`en`), no secondary locales |
| Custom domain | none yet (publishes to the webflow.io subdomain) |
| Figma account | ryabovdigital@gmail.com, team "Main Team" (pro) |
| Figma file | [ZiOS (Kopie)](https://www.figma.com/design/1An9pIi2CL2DHoEV8EUmee/ZiOS--Kopie-), file key `1An9pIi2CL2DHoEV8EUmee` |

## Designer connection

Element, style, and component edits need the Webflow Designer open with the MCP app running.
Launch it from: https://zios-test.design.webflow.com?app=dc8209c65e3ec02254d15275ca056539c89f6d15741893a0adf29ad6f381eb99
Keep that tab in the foreground while the agent works; background tabs time out.

## Framework

The site is built on the **Lumos** framework (Timothy Ricks). Follow its conventions instead of inventing new ones:

- Wrap sections in the `Section` + `Layout` / `Grid` components; use `Spacer` rather than ad-hoc margins.
- Text goes through `Typography Heading` / `Typography Paragraph` / `Typography Eyebrow`, sized by the **Text Style** variable modes (Display, H1–H6, Text Large/Small), not by one-off font sizes.
- Color comes from the **Theme** collection (`--_theme---*`) with modes Base / Dark / Brand. Set a section's theme mode; never hard-code a hex value.
- Buttons: `Button Main`, `Button Primary`, `Button Secondary`, `Primary Button / Icon`, `Button / Text Link`.
- Make a card clickable with the `Clickable` utility component.
- Build new page sections as components in the `• Section` group (duplicate `• Section Custom (duplicate this)`).
- **Section width rule.** Every section's background spans 100% of the viewport. Content sits in `u-container`: max `--max-width--main` (now = `max-width/section`, 120rem = 1920px), centred, with the `site/margin` gutter (35px at desktop) when the screen is narrower.
  - `u-section-regular` (default): all content inside `u-container`.
  - `u-section-full`: content may break out of the container, e.g. the partners marquee (edge to edge) and sliders (active card = container width, neighbours visible left/right).
  - Absolutely/fixed-positioned content that belongs to the container (hero bottom group, chat widget) is offset with `max(2.1875rem, calc(50% - 57.8125rem))` so it lines up with the container edge. Note: the style API mangles `var()` inside `calc()`, so use literal rem values there.

See `docs/webflow-inventory.md` for the full list of components, variables, and CMS collections.

## Rulebook (read before building anything)

- `docs/rules.md`: spacing, type, colour, shape, icons/arrows, motion, responsive, and **Designer vs custom code**. It wins over Figma. Rules marked *Proposed* need the user's sign-off before they are applied site-wide.
- `docs/code-registry.md`: every piece of custom code, where it is injected and what the Designer shows without it. Update it in the same commit as the code.
- `docs/designer-cleanup.md`: the audit and the step-by-step plan to make the Designer match the published site.

Core rule: **the Designer must show what the published site shows.** Layout, size, spacing, colour and all breakpoint overrides go on Webflow classes with variables. CSS the style panel can't express goes in an embed inside its section (labelled `CSS · <section>`). JS goes in footer code and hooks onto `data-js` attributes. Never inject CSS with JS, never add `@media` CSS in custom code, never leave hidden sections on a live page (move them to the Archive page).

## Branches

Start every session from the latest `main` and merge back into it at the end of the session. Live Webflow code that exists only on a side branch is how the repo stopped being the source of truth.

## Figma → Webflow workflow

1. Get the Figma frame URL (`figma.com/design/<fileKey>/...?node-id=X-Y`) and mark the page "In progress" in `docs/build-tracker.md`.
2. Read the frame with Figma MCP (`get_design_context`, `get_screenshot`, `get_variable_defs`).
3. Map Figma tokens to existing Webflow variables. If a value has no match, flag it; don't create a variable without asking.
4. Reuse existing components and classes first. Only create new classes for section-specific layout, named `<section>_<element>` in Lumos style.
5. Build in the Designer (`data_whtml_builder` / `data_element_builder` / `data_component_builder`), then check the result with `element_snapshot_tool` against the Figma screenshot at desktop, tablet (991), and mobile (767/479).
6. Update the tracker.

## Type and token rules

Figma is the visual target, not the source of truth for sizes. Sanity-check every value as you translate it.

- **Base text is 16px (1rem at the 1440px design width).** Body copy, descriptions, links and anything that should read as body text uses the base size, even where Figma drifted (e.g. 14px or 15px body copy gets bumped to 16px).
- **Every text size is a multiple of 4px** (4, 8, 12, 16, 20, 24, 28, 32 …), both the desktop value and the mobile minimum of fluid sizes. A Figma size off that grid gets rounded to the nearest multiple. On an exact tie (e.g. 22, 30), round up, unless that would merge two different steps of the scale; then round down.
- Every other size derives from the scale (px at 1440, used as rem; see the tracker for the approved scale). An off-scale value gets snapped to the step that matches its role, and the fix is noted in the tracker.
- Elements with the same role get the same style everywhere: all card titles one step, all tag chips one step, and so on. Don't copy a one-off from a single Figma frame.
- Only colours from the swatch/theme variables. A new variable or text style needs sign-off; prefer extending an existing collection over one-off classes.
- One-off decorative sizes (e.g. the 240px "24/7") belong on a section-specific class, not in the global scale.

## External code bundle

Most of the site's JS and a lot of its CSS do not live in Webflow: every page loads `https://zios-webflow.netlify.app/app.js` and `app.css`, built from a separate GitHub repo (`ndrewfrolov/zios`), which this project can't reach. Slider logic (tabs, autoplay), animations and some section styles live there. Before changing behaviour or a style that doesn't take effect, check whether the bundle owns it.

## Rules

- **Never publish** the site (`publish_site`) or CMS items without explicit confirmation from the user.
- Never delete pages, components, styles, variables, fonts, assets, or CMS items without confirmation.
- Some content and CMS names are German (Leistungsbereiche, Branchen, Produkte & Plattformen); keep the copy exactly as it appears in Figma.
- Custom code (embeds, site/page scripts) is kept in `webflow/custom-code/` so it's versioned.
