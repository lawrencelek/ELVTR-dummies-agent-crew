# DUMMIES — FARSIGHT 16-bit Aero style guide (v3), text sections

Snapshot of the Claude Project doc `claude/DUMMIES_FARSIGHT_Style_Guide.md` (16–21 October 2026), taken 29 October 2026 for the Style Guide Agent. Only the sections that govern text and reserved inks are kept. The project doc is the source.

## Canon rules

- **Frame vs field:** gloss, gradients and translucency in the frame only. The field is pixel art at `ui.artScale` 2 (P3), no anti-aliasing.
- **Whole-number scaling only.** The screen is 640 × 360 art px at any device multiple.
- **Aqua:** frame accent; in the field only as water and pod glass, never a cue.
- **Reserved inks:** `dummy` is the only yellow. `warning` is the only red. True in every palette.
- **Outlines carry contrast on light ground:** the dummy and every warning mark take a 1-art-px `joints` outline (yellow 1.1:1, red 2.3:1 alone).
- **Juice:** effect lines in `fleet`/`structure` greys; debris from the body may be `dummy` and `joints` (EDIT26 4.2.2).
- **IP:** SNES-era grammar only. No characters, HUD, items, fonts or logos from any existing game.
- **Truth:** every figure maps to a logged trace field (D9.3).

## Field text

- **Field label face:** 6-art-px caps (`ui.typeFieldLabel` 12 units). Half the old 12-px tag face.
- **Tags:** class letter plus tier (`S01`), square seniority pips. Rim-edged box.
- **Bark bubbles:** same face, ≤ 48 characters, one ink.
  - Day: white fill, near-black edge. Dark: navy `#0B1020` fill, cyan `#6FE4FF` edge, `#E6F4FF` ink.
  - Speech solid edge · shout double · mutter dashed · thought dotted with trailing dots.
  - Never over a tag, a car or the dummy.

## Districts and landmarks (P3 city, Edits 41–44)

- **Landmarks:** lantern obelisk; round fountain; crash-matting island (dark rubber, dotted); FARSIGHT Tower on a plaza; calibration plates (white grid, rings, cross) on the road.
- These belong to the P3 city's five districts (Riverside, Old Market, Interchange, CBD, Campus). The Story's three districts (Monument, Parkland, Waterfront) have their own landmarks, one per tile, in `content/story/story.json`.
