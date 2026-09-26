---
name: Jullien Nazreen
description: The dispatch room of the network Jullien builds, every shipped system a unit in service on a split-flap board.
colors:
  enamel-panel: "oklch(0.885 0.011 135)"
  enamel-raised: "oklch(0.925 0.009 135)"
  enamel-sunk: "oklch(0.848 0.012 135)"
  graphite-ink: "oklch(0.235 0.008 150)"
  graphite-ink-2: "oklch(0.365 0.01 150)"
  graphite-ink-3: "oklch(0.455 0.011 150)"
  hairline: "oklch(0.235 0.008 150 / 0.14)"
  hairline-strong: "oklch(0.235 0.008 150 / 0.3)"
  lamp-amber: "oklch(0.79 0.155 68)"
  lamp-amber-deep: "oklch(0.63 0.14 60)"
  housing-graphite: "oklch(0.255 0.006 150)"
  housing-graphite-2: "oklch(0.31 0.007 150)"
  housing-ink: "oklch(0.8 0.008 130)"
  board-well: "oklch(0.14 0.004 150)"
  flap-black: "oklch(0.2 0.003 150)"
  flap-ink: "oklch(0.935 0.01 100)"
  plate: "oklch(0.2 0.005 150)"
  plate-ink: "oklch(0.93 0.008 110)"
  night-panel: "oklch(0.205 0.008 150)"
  night-raised: "oklch(0.24 0.009 150)"
  night-sunk: "oklch(0.175 0.008 150)"
  night-ink: "oklch(0.93 0.008 125)"
  night-ink-2: "oklch(0.8 0.01 130)"
  night-ink-3: "oklch(0.68 0.012 130)"
  night-housing: "oklch(0.155 0.005 150)"
  night-housing-2: "oklch(0.2 0.006 150)"
  night-well: "oklch(0.1 0.003 150)"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6.4vw, 5.6rem)"
    fontWeight: 720
    lineHeight: 0.92
    letterSpacing: "-0.012em"
    fontVariation: "\"wdth\" 74"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.55rem, 2.7vw, 2.35rem)"
    fontWeight: 500
    lineHeight: 1.3
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 500
    lineHeight: 1.35
  body:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  body-small:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  caption:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 620
    lineHeight: 1.2
    letterSpacing: "0.085em"
    fontVariation: "\"wdth\" 122"
  flap:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "calc(var(--fh) * 0.66)"
    fontWeight: 640
    lineHeight: 1
    fontVariation: "\"wdth\" 70"
rounded:
  plate: "3px"
  navkey: "5px"
  keycap: "6px"
  callbtn: "7px"
  row: "calc(var(--cell) * 0.18)"
  well: "calc(var(--cell) * 0.22)"
  enamel: "calc(var(--cell) * 0.3)"
  housing: "calc(var(--cell) * 0.45)"
  pill: "999px"
spacing:
  cell: "clamp(20px, 2.15vw, 31px)"
  cell-quarter: "calc(var(--cell) * 0.25)"
  cell-half: "calc(var(--cell) * 0.5)"
  cell-1: "var(--cell)"
  cell-1-4: "calc(var(--cell) * 1.4)"
  cell-3: "calc(var(--cell) * 3)"
  cell-4-5: "calc(var(--cell) * 4.5)"
  section-top: "calc(var(--cell) * 4.2)"
  section-bottom: "calc(var(--cell) * 3.2)"
  page-max: "1320px"
components:
  button-call:
    backgroundColor: "{colors.lamp-amber}"
    textColor: "oklch(0.2 0.02 60)"
    typography: "{typography.caption}"
    rounded: "{rounded.callbtn}"
    padding: "0.95em 1.45em 0.92em"
  button-keycap:
    backgroundColor: "{colors.enamel-raised}"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.keycap}"
    padding: "0.78em 1.15em 0.74em"
  button-keycap-dark:
    backgroundColor: "{colors.housing-graphite-2}"
    textColor: "{colors.housing-ink}"
    rounded: "{rounded.keycap}"
    padding: "0.78em 1.15em 0.74em"
  nav-key:
    backgroundColor: "{colors.housing-graphite-2}"
    textColor: "{colors.housing-ink}"
    rounded: "{rounded.navkey}"
    padding: "0.5rem 0.8rem 0.46rem"
  nav-key-current:
    textColor: "{colors.flap-ink}"
  tag-plate:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.plate-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0.42em 0.7em 0.38em"
  tag-outline:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink-2}"
    typography: "{typography.label}"
    rounded: "{rounded.plate}"
    padding: "0.42em 0.7em 0.38em"
  board-housing:
    backgroundColor: "{colors.housing-graphite}"
    rounded: "{rounded.housing}"
    padding: "calc(var(--cell) * 0.35)"
  board-well:
    backgroundColor: "{colors.board-well}"
    rounded: "{rounded.well}"
  enamel-panel:
    backgroundColor: "{colors.enamel-raised}"
    rounded: "{rounded.enamel}"
  flap-cell:
    backgroundColor: "{colors.flap-black}"
    textColor: "{colors.flap-ink}"
    typography: "{typography.flap}"
    width: "calc(var(--cell) * 0.86)"
    height: "calc(var(--cell) * 1.32)"
---

# Design System: Jullien Nazreen

## Overview

**Creative North Star: "The Dispatch Room"**

The portfolio is the control room of the network Jullien builds. Every shipped system is a unit in service on a black split-flap board, each row a way into its console bay, where the unit's interface is mounted as a live recreation in a recessed well. Surfaces are stoved-enamel grey-green panels with pressed-steel bevels, graphite housings and trim, and engraved lamacoid plates. The only warm colour in the room is the amber of a lit lamp.

Density is that of an instrument panel: calm large fields of enamel, then tight, exact hardware where information lives (the board, the nav keys, the plates). Everything is measured in one module, the split-flap cell pitch, so gutters, radii and padding scale together with the viewport. Motion is mechanical: flaps fall and land, lamps warm up, bays open with a shutter, and keys depress on press. Two shifts share the same room: day shift on light enamel, night shift on deep graphite-green, while the board, housings and flaps stay black in both.

The recreated app screens mounted in the bays carry their own products' palettes and fonts by design; they are exhibits, not part of this system. Only the MockScreen scaling contract and the device frames around them belong to the house.

**Key Characteristics:**
- One module (the flap cell, 20px to 31px) rules gutters, section padding, radii and flap sizes.
- Amber appears only where something is lit: lamps, the call button, live status flaps, sockets and the mimic pipe.
- Depth is physical: bevels, insets and key travel, never glass or blur.
- Archivo is the only house face; its width axis does the typographic work (condensed display and flaps, expanded engraving).
- Day and night shifts swap the enamel and ink; the hardware stays black.

## Colors

A cool grey-green enamel field, graphite hardware, off-white flap glyphs, and a single rationed amber.

### Primary
- **Lamp Amber** (lamp-amber): the lit state. Lamp cores, the amber call button face, live status flaps on the board, patched jack sockets, the flowing mimic pipe, the focus ring on board rows, and text selection.
- **Deep Amber** (lamp-amber-deep): the shadowed side of a lit element. Lamp gradients, the start of the mimic fill, energized mimic drops, and the caret.

### Neutral
- **Enamel Panel** (enamel-panel): the page ground, set on `<html>` so the enamel grain sits between it and the content. Also the lower stop of keycap gradients.
- **Raised Enamel** (enamel-raised): badge and panel faces, mimic nodes, mimic tile grounds, and the upper stop of keycaps.
- **Sunk Enamel** (enamel-sunk): recessed screen wells that hold the recreations, portrait backing, scrollbar track, and hover fill on quiet lists.
- **Graphite Ink** (graphite-ink): headings, body text on enamel, and the default focus ring.
- **Graphite Ink 2** (graphite-ink-2): supporting paragraphs, handover notes, outline tags.
- **Graphite Ink 3** (graphite-ink-3): captions, periods, metadata, and bullet squares. Holds AA on enamel; never go lighter for text.
- **Hairline / Hairline Strong** (hairline, hairline-strong): tile seams and dividers; strong for outline tags, keycap rims and mimic drops at rest.
- **Housing Graphite** (housing-graphite, housing-graphite-2): the board housing, console strip, console menu, dark keycaps, nav keys, pipe and bus rails.
- **Housing Ink** (housing-ink): text and labels on graphite.
- **Board Well** (board-well): the black recess the flaps sit in, toggle track, flap axle notches.
- **Flap Black / Flap Ink** (flap-black, flap-ink): flap leaves and their off-white glyphs; flap ink doubles as the focus ring and current-key colour on graphite.
- **Plate / Plate Ink** (plate, plate-ink): engraved lamacoid tags.

### Night shift
Under `[data-theme="night"]` the enamel turns deep graphite-green (night-panel, night-raised, night-sunk), ink inverts to pale grey-green (night-ink, night-ink-2, night-ink-3), hairlines become white at 9% and 20%, bevels invert to a faint highlight over a heavy black low, and housings and well go darker (night-housing, night-housing-2, night-well). Amber, flap and plate values do not change between shifts. The shift follows the system colour scheme until the visitor flips the toggle, then persists.

### Named Rules
**The Lit State Rule.** Amber means "on". It is used only for an element that is lit, live, patched or the primary call; never as a decorative accent, a heading colour, a link colour or a background wash.

**The Black Hardware Rule.** The board, housings, wells, flaps and plates are the same dark hardware in both shifts. Only enamel and ink change with the shift.

## Typography

**Display Font:** Archivo, variable width axis (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Archivo (same family)
**Label Font:** Archivo expanded (same family)

**Character:** One grotesque stretched three ways. Condensed and heavy for headings and flaps reads like signage and transit boards; expanded, tracked capitals read like engraved plates; the normal width carries plain, specific prose.

### Hierarchy
- **Display** (720, width 74%, clamp(2.75rem, 6.4vw, 5.6rem), line-height 0.92, tracking -0.012em): section headings, revealed word by word. Also the operator name on the badge at 2.1rem.
- **Headline** (500, clamp(1.55rem, 2.7vw, 2.35rem), line-height 1.3, max 30ch): the read-along lead under a section heading.
- **Title** (500, 1.3125rem, line-height 1.35, max 34ch to 46ch): unit summaries and interlude statements. The hero thesis uses the same voice at clamp(1.2rem, 1.9vw, 1.55rem), max 46ch. Record entries use 600 at 1.25rem.
- **Body** (400, 1.0625rem, line-height 1.6, max 58ch to 62ch): paragraphs and handover notes. Section supporting lines sit at 1.125rem in ink 2, max 56ch.
- **Body Small** (400, 0.9375rem): built lists, record details, flow captions.
- **Caption** (400, 0.8125rem): figure captions, credits, recreation notices, in ink 3.
- **Label** (620, width 122%, 0.6875rem, tracking 0.085em, uppercase): engraved labels on panels and plates, board column heads, definition terms.
- **Flap** (640 to 680, width 70%, 66% of the cell height): split-flap glyphs only, set from a fixed character drum (space, A to Z, 0 to 9, & . - / : ').

### Named Rules
**The One Face Rule.** Archivo is the only house typeface; hierarchy comes from its width axis and weight, not from a second family. Inter, Fraunces, JetBrains Mono and Space Grotesk are loaded without preload solely to dress the recreated screens and must not appear in house UI.

**The Engraving Is A Plate Rule.** Expanded uppercase labels name a part of the hardware (a badge field, a board column, a switch). They are never placed as an eyebrow above a heading; headings carry themselves.

**The Clean Copy Rule.** Visible copy contains no em or en dashes. Use commas, full stops, colons or "to" for ranges.

## Layout

The page is a single column of console sections inside `.frame`: the width is min(100% minus two cells, 1320px), centred. Every gap is a multiple of the cell module (`--cell`, clamp(20px, 2.15vw, 31px)): sections pad 4.2 cells above and 3.2 below, bays are separated by 4.5 cells, internal bay gaps run 0.7 to 1.4 cells. A fixed 56px console strip sits over the page; section anchors offset for it.

The hero is a full-width board housing: name on the largest flaps, role beneath, then seven unit rows on a column grid computed from the cell pitch (14, 7, 7, 5, 5 characters). Columns drop out by breakpoint (stack below 768px, platform and logged below 1024px) rather than wrapping. Under the board, the thesis sits left and the two actions right.

Bays alternate three layouts on desktop: screen left with copy right (1.85 to 1), copy left with screen right, and wide (screen full width, copy in two columns beneath). Mobile units use a 1.1 to 1 split. Below 1024px everything stacks, with copy first on right-screen bays. Below 768px desktop-sized screens sit in a horizontally pannable 760px viewport instead of shrinking to illegibility.

The flow section is a sticky mimic panel at 1024px and up with at least 700px of height, scrubbed over 250vh; otherwise it is static with a vertical caption rail. Breakpoints: 768px, 1024px, 1280px (Tailwind md, lg, xl).

## Elevation & Depth

Depth is pressed metal and enamel, not floating cards. Panels carry a one-pixel highlight on top and a one-pixel shade on the bottom; wells are inset with a soft inner shadow; housings add a lift shadow; keys have a hard bottom lip that collapses on press. Device frames around the recreations get the only large, soft drop shadow. A fine fractal-noise grain (16% opacity by day, 12% by night) covers the whole document behind the content, and pressed seams (a dark line over a light line) separate sections.

### Shadow Vocabulary
- **Panel bevel** (`box-shadow: 0 1px 0 var(--bevel-hi) inset, 0 -1px 0 var(--bevel-lo) inset`): enamel panels and badges.
- **Lift** (`box-shadow: 0 1px 1px oklch(0.235 0.008 150 / 0.08), 0 8px 24px -8px oklch(0.235 0.008 150 / 0.22)`): board housings, deepened in night shift.
- **Device** (`box-shadow: 0 2px 4px oklch(0.2 0.01 150 / 0.12), 0 24px 60px -18px oklch(0.2 0.01 150 / 0.45)`): phone, browser and app window frames only.
- **Sunk well** (`box-shadow: inset 0 2px 5px oklch(0.2 0.01 150 / 0.16), inset 0 -1px 0 var(--bevel-hi)`): recessed screen bays.
- **Board well** (`box-shadow: inset 0 2px 8px oklch(0 0 0 / 0.7), 0 1px 0 oklch(1 0 0 / 0.06)`): the black recess behind flaps.
- **Key lip** (`0 2px 0` on keycaps, `0 3px 0` on the call button, `0 1.5px 0` on nav keys): the travel of a physical key; it goes to 0 on `:active` while the key translates down by the same amount.

### Named Rules
**The Physical Depth Rule.** Every shadow must correspond to a physical cause: a bevel, a recess, a key's travel, or an object resting on the panel. No glass, no backdrop blur, no coloured glows.

## Shapes

Corners are small and machined. Radii derive from the cell for panels (enamel 0.3 cells, housing 0.45, well 0.22, board row 0.18) and are fixed small pixels for hardware (plates 3px, nav keys 5px, keycaps 6px, call button 7px). Round forms are reserved for things that are round in a control room: lamps, jack sockets, mimic nodes, the toggle and its knob. Flap cells are tall rectangles (about 0.65 aspect) split by a dark hinge line with axle notches at both edges. Bullets are 6px squares with a 1px radius, not dots.

## Components

### Buttons
Tactile keys with real travel.
- **Shape:** keycaps gently squared (6px), the call button slightly rounder (7px).
- **Call button (primary):** amber face with a pale top glow and a deep amber lip, dark amber-brown text, 700 weight, width 112%. Reserved for the one primary call per context ("Email me").
- **Keycap (secondary):** enamel gradient, graphite text, strong hairline rim and a 2px lip. Used for "View the work", outbound links, socials and the CV download. A dark variant sits on graphite.
- **Hover / Focus:** call button brightens slightly; keycap fills to raised enamel (fine pointers only). Focus is a 2px ink ring at 3px offset, flap ink on graphite.
- **Active:** translate down by the lip height, lip collapses, scale 0.985, 140ms.

### Tags (engraved plates)
- **Plate:** dark lamacoid, off-white expanded caps, 3px radius, a faint top highlight. Used for platform labels, focus areas, rack names and active flow stages.
- **Outline:** transparent with a strong hairline ring and ink 2 text, for tech stacks and inactive stages.

### Cards / Containers
- **Enamel panel:** raised enamel, panel bevel, 0.3-cell radius. The operator badge is the reference instance.
- **Sunk well:** sunk enamel with inset shadow; holds each recreated screen with 0.9 to 1.4 cells of padding.
- **Housing and well:** graphite housing (0.45-cell radius, lift shadow) holding a black well; the frame for any flap display and for the contact channel.

### Navigation
The console strip is a fixed 56px graphite bar. Sections are nav keys (graphite keys with a small lamp that lights for the section in view, current key text in flap ink). A seven-character flap display labelled "Now" flips to the current section. Below 1024px the keys collapse into a two-column drop-down menu, opened by the "Now" display. The night-shift toggle is a recessed track with a metal knob.

### Split-flap display (signature)
Rows of flap cells driven by a Web Animations engine: distant characters spin by as text swaps, and the final flips fall (cubic-bezier(0.5, 0, 0.9, 0.5)) and land (cubic-bezier(0.1, 0.6, 0.35, 1)). Used for the hero name, role and unit rows, as each bay's header, as the "Off shift" interlude and as the nav "Now" display. Sizes are fixed multiples of the cell (xs, sm, default, lg, xl, plus board-specific name, role, unit and bay sizes). Live status flaps take amber glyphs. Flaps are decorative; a screen-reader text twin always carries the content.

### Lamps
Smoked-glass domes that light amber. Board row lamps warm up one by one after the flap cascade. Lamps mark live status, the section in view, and the on-shift badge.

### Mimic panel and patch bay
The flow section draws the supply chain as a pipe with nodes, an amber fill that scrubs with scroll and oil highlights that run only while in view, plus drop lines that energize to amber. The toolkit is a patch bay of jacks whose sockets light amber when patched.

### Mock screens and device frames
Each recreation is written at its native design size and scaled by container query: one design pixel is `--mu`, and Tailwind spacing, text sizes, radii and containers are re-pointed to it inside `.mock`, so the screen stays proportional at any width with no JavaScript. Frames are a dark titanium phone with an island, a quiet light browser window with traffic lights and an address pill, and a frameless app window. Every FatHopes recreation carries a caption stating it uses made-up data.

## Do's and Don'ts

### Do:
- **Do** size every gutter, padding and panel radius as a multiple of `--cell`.
- **Do** keep amber for lit, live or patched state and the single primary call.
- **Do** mount work as a live recreation in a sunk well, in a device frame, with a recreation caption where the data is synthetic.
- **Do** use flap displays for board-like headers and status, with a screen-reader text twin.
- **Do** give every key a lip that collapses on press, and every panel a bevel.
- **Do** collapse all motion to a settled, readable state under reduced motion; content is visible without JavaScript.

### Don't:
- **Don't** use amber as decoration, a heading colour, a gradient wash or a glow.
- **Don't** put an eyebrow or kicker label above a heading.
- **Don't** introduce glass, backdrop blur, gradient-mesh heroes or floating project cards.
- **Don't** set house UI in Inter, Fraunces, JetBrains Mono or Space Grotesk; they belong to the recreated screens.
- **Don't** use em or en dashes in visible copy.
- **Don't** let text go lighter than ink 3 on enamel or housing ink on graphite.
