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
| Figma file | _TBD: add the file URL here once shared_ |

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

See `docs/webflow-inventory.md` for the full list of components, variables, and CMS collections.

## Figma → Webflow workflow

1. Get the Figma frame URL (`figma.com/design/<fileKey>/...?node-id=X-Y`) and mark the page "In progress" in `docs/build-tracker.md`.
2. Read the frame with Figma MCP (`get_design_context`, `get_screenshot`, `get_variable_defs`).
3. Map Figma tokens to existing Webflow variables. If a value has no match, flag it; don't create a variable without asking.
4. Reuse existing components and classes first. Only create new classes for section-specific layout, named `<section>_<element>` in Lumos style.
5. Build in the Designer (`data_whtml_builder` / `data_element_builder` / `data_component_builder`), then check the result with `element_snapshot_tool` against the Figma screenshot at desktop, tablet (991), and mobile (767/479).
6. Update the tracker.

## Rules

- **Never publish** the site (`publish_site`) or CMS items without explicit confirmation from the user.
- Never delete pages, components, styles, variables, fonts, assets, or CMS items without confirmation.
- Some content and CMS names are German (Leistungsbereiche, Branchen, Produkte & Plattformen); keep the copy exactly as it appears in Figma.
- Custom code (embeds, site/page scripts) is kept in `webflow/custom-code/` so it's versioned.
