# DUMMIES — GDD Edit 37: Art direction, 16-bit Aero

**16 October 2026 · Lawrence Lek** · Replaces EDIT26 §§4.1.1–4.1.5 and the register line of V29 D10.1. Direction user-confirmed; values Proposed.

- **Mockups:** DUMMIES 16-bit Aero canvas — https://claude.ai/artifact/CaKB5nrST982KXuZzSzS1g (title, play, write-off, report, shop, ending).
- **Style guide:** FARSIGHT 16-bit Aero design system — https://claude.ai/artifact/FJ5mVkcrzP4KS32vgUaK5h

## Decisions

| # | Decision | Status | Trade-off |
|---|---|---|---|
| 88 | Field: 16-bit top-down pixel art of a bucolic eco-city. Frame: the HD Frutiger Aero glass terminal. | user-confirmed: "c's world with a's frame. I think the dystopian tone against the bucolic landscape is actually effective" | The dummy is no longer the only saturated object. Cue contrast needs outlines (4.1.4). |
| 89 | Drop the analyst-suite grammar (object views, link graphs, lineage screens). | user-confirmed: "Let's lose the Palantir vibe, it's not interesting" | Reports stay truthful (D9.3) without the operator screens. |
| 90 | Borrow the SNES era's art grammar only. No characters, HUD, items, fonts or logos from any existing game. | proposed (assistant) | The look is generic 16-bit until the dummy and the city carry it. |
| 91 | Drivers react in 0.3 s; each moving car shows a stop bracket. | user-confirmed: "show it. also shorter reaction time of 0.3 seconds" (P2.2) | Highway Code realism (0.67 s) traded for fairness at exhibition distance. |

## 4.1 Style guide (replacement)

```markdown
#### 4.1.1 The register

**A bucolic 16-bit eco-city inside a friendly corporate terminal.** Two layers, never mixed.

- **The play area is the city.** 16-bit pixel art in top-down three-quarter view. Lawns, canals, hedges, white glass pods, a white fleet.
- **The frame is FARSIGHT's brand.** Frutiger Aero: glossy bevels, translucent panels, soft drop shadows, aqua highlights, rounded corners. High resolution.
- **The contrast is the tone.** The city is idyllic. The test writes off bodies in it. The brand never comments.
- **Projection is drawing only.** The simulation stays pure top-down (decision 1). Sprites show a south face; colliders do not change.
- **Measurement moves to the frame.** No calibration grid on the ground. Reports carry the figures (D9.3).

One register throughout. Play, reports, menus and developer tools are the same terminal, differently framed.

#### 4.1.2 The dummy is the exception

- A real crash-test dummy: safety yellow body, black joints, quartered head decal.
- **The only yellow object on screen.** Flowers, signage and decoration never use yellow.
- **Always outlined.** `dummy.body` is 1.1:1 against `field.grass` and `field.road` by luminance. The 1-art-pixel `dummy.joint` outline carries it (9.5:1).
- The only object with weight: dents, squash and stretch, a growing lean as it wears. Knocked flat on write-off.

#### 4.1.3 Material rules

| Class | Layer | Drawn as | Edge | Fill |
|---|---|---|---|---|
| Grass | Play | 16 × 16 tiles, speckled | None | Three tones |
| Paving | Play | Slabs, joints every 6 art px | None | Two tones |
| Road | Play | Speckled tarmac, white centre dashes | Kerb line and face | Two tones |
| Water | Play | Canal tiles, ripples, bubbles | White kerb | Two tones |
| Pod (static) | Play | White tower, aqua crown, south face | 1 art px `outline` | Three tones |
| Planting | Play | Trees, hedges, flowers | 1 art px foliage outline | Three tones |
| Vehicle | Play | White roof, blue glass, south face, tag above | 1 art px `outline` | Three tones |
| The dummy | Play | Yellow, black joints, dents, lean | 1 art px `dummy.joint` | Three tones |
| Prop | Play | Orange cone | 1 art px | Two tones |
| Cue | Play | Reserved treatment (4.2.2) | Fixed weight | Fixed value |
| Chrome panel | Frame | Glossy bevel, translucent fill, soft shadow | 2-unit bevel | Vertical gradient |
| Chrome accent | Frame | Aqua highlight, specular sheen | — | Gradient |
| Texture | Frame | Micro-type, range marks, diagnostic runs | Hairline | Below legibility by design |

- **Pixel grid:** one art pixel = `ui.artScale` screen units. Native art is `ui.playWidth` ÷ `ui.artScale` by `ui.playHeight` ÷ `ui.artScale` (267 × 200).
- **No anti-aliasing.** Integer scaling only. No mixed pixel sizes in the play area.
- **Light:** sun top right. Hard drop shadows down-left. Ramps of three tones at most.
- **Gloss never enters the play area.** No gradient, bevel, bloom or translucency inside `ui.playWidth` × `ui.playHeight`.
- **Field overlays are pixel:** tags, bubbles, cue words, popups and the stamp use pixel faces and 9-slice pixel borders.
- **Veils are frame:** reports, shop and endings sit on a flat 55% veil over the field.

#### 4.1.4 Palette

Placeholder values. Roles are fixed; hex is authored once and registered as data.

| Role | Placeholder | Layer | Use |
|---|---|---|---|
| `field.grass` | `#8ED45A` | Play | Lawns. World material, never a cue |
| `field.grassShade` | `#6DBE48` | Play | Grass speckle |
| `field.foliage` | `#5DBB46` | Play | Trees, hedges |
| `field.water` | `#4FC3E8` | Play | Canals, pod glass. Aqua as material, never a cue |
| `field.paving` | `#F2EEE2` | Play | Pavements, plazas |
| `field.road` | `#B9C6CF` | Play | Tarmac. The cue ground |
| `field.kerb` | `#FFFFFF` | Play | Kerb line, lane dashes |
| `field.pod` | `#FFFFFF` | Play | Pods (the old pillars) |
| `field.flower` | `#F7A8C8` | Play | Flowers. Never yellow or red |
| `fleet.body` | `#F4F8FA` | Play | Vehicle roof and bonnet |
| `fleet.glass` | `#1A7FA7` | Play | Windscreens |
| `prop.cone` | `#F28C28` | Play | Cones. Orange, never red |
| `structure` | `#B8C4CB` | Play | Juice effect lines on light ground |
| `fleet` | `#7E8C96` | Play | Juice rings and rays on road and grass |
| `dummy.body` | `#F5C542` | Play | Safety yellow. The only yellow |
| `dummy.joint` | `#1A1D1F` | Play | Joints, the dummy's outline, warning outlines |
| `cue.primary` | `#101417` | Play | Tier-1 cues, dark on light |
| `cue.secondary` | `#4A5A66` | Play | Tier-2 cues |
| `cue.warning` | `#E4442E` | Play | Brake lights, interrupted ring, STOP line, stamp |
| `brand.aqua` | `#4FC3E8` | Frame | FARSIGHT's accent. Chrome and menus |
| `brand.glass` | `#FFFFFF` at 18% | Frame | Translucent panel fill |
| `texture` | `#C3CDD3` | Frame | Tier-4 marks |

Retired: `lab.floor`, `lab.grid`.

Cue contrast is measured against `field.road` and `field.grass`, not the old floor.

| Ink | On `field.road` | On `field.grass` | Gate | Treatment |
|---|---:|---:|---|---|
| `cue.primary` | 10.6:1 | 10.3:1 | `ui.cueContrastTier1` | Passes alone |
| `cue.secondary` | 4.1:1 | 4.0:1 | `ui.cueContrastTier2` | Passes alone |
| `cue.warning` | 2.3:1 | 2.3:1 | `ui.cueContrastTier1` | Fails alone. 1-art-px `dummy.joint` outline: 10.6:1 to ground, 4.2:1 to fill |
| `dummy.body` | 1.1:1 | 1.1:1 | — | Fails alone. Always outlined (4.1.2) |

#### 4.1.5 References

| Reference | Take | Leave |
|---|---|---|
| SNES-era top-down action-adventure games | Three-quarter view, 16-px tile grammar, 1-px outlines, three-tone ramps, hard drop shadows | Every character, item, HUD layout, font and logo |
| Frutiger Aero — Windows Aero, Wii system menu, mid-2000s corporate tech marketing | Frame: glossy bevels, translucency, aqua, rounded optimism. Field: its nature motifs — lawns, water, bubbles, white towers — redrawn in pixels | Its photography and gradients inside the field |
| Real crash-test facilities — Euro NCAP, IIHS footage | The dummy's yellow livery, black joints, quartered decals | Calibration grids on the ground (figures move to reports) |
| Papers, Please | A diegetic terminal that is the whole interface, menus included | Its document-handling grammar |
| Hotline Miami | Top-down readability at speed; silhouette over detail | Its dark palette |

Analyst software (object views, link graphs) is no longer a reference (decision 89).
```

## Registry changes

| ID | Change | Value | Status |
|---|---|---|---|
| `ui.artScale` | Added | 3 screen units per art pixel | Proposed |
| `palette.field.*`, `palette.fleet.body`, `palette.fleet.glass`, `palette.prop.cone` | Added | 4.1.4 | Proposed |
| `palette.lab.floor`, `palette.lab.grid` | Retired | — | — |
| `palette.structure`, `palette.fleet` | Repurposed | Juice effect lines | Proposed |
| `perception.reactionDelay` | Prototype override 0.67 → 0.3 | s | user-confirmed (P2.2) |
| `proto.driver.coveredReaction` | 0.4 → 0.18 | s | Proposed |
| `proto.stopCue` | Added (display toggle) | 1 | Proposed |

## Open items

- **BLIND wedge:** was aqua on the lab floor. Aqua is now water. Needs a pixel treatment in cue inks.
- **Thought bubbles:** not yet drawn in pixels.
- **Chinese in the field:** no pixel CJK face chosen. Field text is English only; the frame stays bilingual.
- **L2 Barrier:** no eco scene drawn yet. Barriers need a pixel material.
- **Level blurbs** still say "flyover pillars"; the pillars are now pods.
- **Animation:** sprites are single frames. Walk, lunge, squash and wreck frames are not drawn.
- **Figures:** L1 at 0:06 is the P2.2 build; L3 and the ending come from one scripted P1.9 campaign (0.67 s drivers). Write-off positions are staged.
