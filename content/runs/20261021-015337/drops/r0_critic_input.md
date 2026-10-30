# BRIEF — Drop juice: the fall, the landing and the hit from above
- My game is thin on juice for the new levels (designer's gap statement). P3.3 lets the dummy drop from a Z1 highway (0.35 s) or a Z2 roof or high highway (0.47 s, a harder hit: stopped sedan 136 against 76).
- The renderer stubs both: stepping off plays one tone; landing plays a thud, eight dust puffs and a small shake. A Z2 fall feels the same as a Z1 fall.
- Landing on a car uses the ground-hit juice unchanged, so a hit from above reads like a side swipe.
- Designer decision: the drop timing and damage stay simulation values (world.dropSeconds, damage.dropSpeed). All new juice is presentation.

## Consumer contract
- These layers stack on the published hit layers (prototypes/p3/content/hits.json). For an impact the base hit layer always applies first: crunch, shake, flash, rays, popup, sparks. Add to it; do not repeat it.
- deck-drop: the dummy steps off a ledge or a broken parapet. Fields: from (level), to (level it will land on), h (fall height, world units: 120 from Z1, 216 from Z2 to the ground), fromKind ('deck' or 'roof'). Juice at the dummy.
- land: the dummy lands. Fields: car (null on open ground; a car id when it lands on one, which also fires an impact), level, fromZ, h, fromKind. Use when {"car": null} for the open-ground landing so a hit from above is not juiced twice.
- impact accents: drop (true when the dummy landed on the car), dropZ (1 or 2), dropFrom ('deck' or 'roof'), plus the usual zone, assessed, closing.
- writeoff: the same situation fields as the impact that caused it.
- Streaks run along the dummy's facing reversed: use them for the fall (deck-drop). A ring is centred on the contact (the dummy on open ground).
- Shake, zoom, flash, crumple and stumble: a later layer replaces an earlier one's value. Rings, streaks, particles and sounds add.
- Gain is clamped to 0.25. Reduced motion already scales every shake, zoom and crumple by proto.juice.reducedMotion.

## Game data
Registry IDs you may reference (value, unit):
- body.radius = 13
- damage.bodyHealth = 800 health units
- damage.dropSpeed = 120 world units/s
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- movement.lungeRecovery = 0.35 s
- proto.art.extrusion = 0.3 ratio
- proto.hits.bait.hornFrom = 440 Hz
- proto.hits.bait.hornGain = 0.1 gain
- proto.hits.bait.hornSeconds = 0.25 s
- proto.hits.bait.hornTo = 400 Hz
- proto.hits.bait.raysCount = 12 count
- proto.hits.bait.ringRadius = 20 world units
- proto.hits.big.assessedMin = 200 count
- proto.hits.big.boomFrom = 600 Hz
- proto.hits.big.boomGain = 0.22 gain
- proto.hits.big.boomSeconds = 0.3 s
- proto.hits.big.boomTo = 60 Hz
- proto.hits.big.flashSeconds = 0.1 s
- proto.hits.big.shakeAmpMax = 12 canvas units
- proto.hits.big.shakeAmpMin = 5 canvas units
- proto.hits.big.smokeCount = 5 count
- proto.hits.big.smokeLife = 0.7 s
- proto.hits.big.smokeSize = 5 px
- proto.hits.big.smokeSpeed = 40 world units/s
- proto.hits.big.zoom = 0.06 ratio
- proto.hits.big.zoomSeconds = 0.2 s
- proto.hits.headOn.crumpleMax = 0.36 ratio
- proto.hits.headOn.crumpleMin = 0.14 ratio
- proto.hits.headOn.shakeAmpMax = 9 canvas units
- proto.hits.headOn.shakeAmpMin = 2.5 canvas units
- proto.hits.headOn.thumpFrom = 900 Hz
- proto.hits.headOn.thumpGain = 0.2 gain
- proto.hits.headOn.thumpSeconds = 0.22 s
- proto.hits.headOn.thumpTo = 120 Hz
- proto.hits.headOn.zoomMax = 0.05 ratio
- proto.hits.headOn.zoomMin = 0.02 ratio
- proto.hits.headOn.zoomSeconds = 0.14 s
- proto.hits.impact.crumpleMax = 0.28 ratio
- proto.hits.impact.crumpleMin = 0.08 ratio
- proto.hits.impact.crunchFrom = 2400 Hz
- proto.hits.impact.crunchGain = 0.18 gain
- proto.hits.impact.crunchSeconds = 0.18 s
- proto.hits.impact.crunchTo = 300 Hz
- proto.hits.impact.flashSeconds = 0.05 s
- proto.hits.impact.popupPop = 1.4 ratio
- proto.hits.impact.popupRise = 18 px
- proto.hits.impact.popupSeconds = 0.7 s
- proto.hits.impact.popupSizeMax = 22 px
- proto.hits.impact.popupSizeMin = 14 px
- proto.hits.impact.raysCount = 8 count
- proto.hits.impact.raysLenMax = 26 world units
- proto.hits.impact.raysLenMin = 12 world units
- proto.hits.impact.raysSeconds = 0.2 s
- proto.hits.impact.ringRadiusMax = 26 world units
- proto.hits.impact.ringRadiusMin = 14 world units
- proto.hits.impact.ringSeconds = 0.25 s
- proto.hits.impact.ringWidth = 2 px
- proto.hits.impact.shakeAmpMax = 7 canvas units
- proto.hits.impact.shakeAmpMin = 1.5 canvas units
- proto.hits.impact.shakeSeconds = 0.22 s
- proto.hits.impact.sparkCountMax = 14 count
- proto.hits.impact.sparkCountMin = 6 count
- proto.hits.impact.sparkLife = 0.3 s
- proto.hits.impact.sparkSize = 2 px
- proto.hits.impact.sparkSpeedMax = 260 world units/s
- proto.hits.impact.sparkSpeedMin = 120 world units/s
- proto.hits.knock.dustCountMax = 4 count
- proto.hits.knock.dustCountMin = 2 count
- proto.hits.knock.dustLife = 0.3 s
- proto.hits.knock.dustSize = 3 px
- proto.hits.knock.dustSpeed = 40 world units/s
- proto.hits.knock.puffFrom = 700 Hz
- proto.hits.knock.puffGain = 0.08 gain
- proto.hits.knock.puffSeconds = 0.1 s
- proto.hits.knock.puffTo = 250 Hz
- proto.hits.lunge.dustCountMax = 6 count
- proto.hits.lunge.dustCountMin = 2 count
- proto.hits.lunge.dustLife = 0.4 s
- proto.hits.lunge.dustSize = 3 px
- proto.hits.lunge.dustSpeed = 90 world units/s
- proto.hits.lunge.kickMax = 2 canvas units
- proto.hits.lunge.kickMin = 0.6 canvas units
- proto.hits.lunge.kickSeconds = 0.1 s
- proto.hits.lunge.streakCountMax = 6 count
- proto.hits.lunge.streakCountMin = 2 count
- proto.hits.lunge.streakLenMax = 60 world units
- proto.hits.lunge.streakLenMin = 20 world units
- proto.hits.lunge.whooshFrom = 300 Hz
- proto.hits.lunge.whooshGain = 0.12 gain
- proto.hits.lunge.whooshTo = 1800 Hz
- proto.hits.lunging.debrisCountMax = 8 count
- proto.hits.lunging.debrisCountMin = 3 count
- proto.hits.lunging.debrisLife = 0.5 s
- proto.hits.lunging.debrisSize = 3 px
- proto.hits.lunging.shakeAmpMax = 10 canvas units
- proto.hits.lunging.shakeAmpMin = 3 canvas units
- proto.hits.lunging.zoomMax = 0.07 ratio
- proto.hits.lunging.zoomMin = 0.03 ratio
- proto.hits.miss.clatterFrom = 3200 Hz
- proto.hits.miss.clatterGain = 0.14 gain
- proto.hits.miss.clatterSeconds = 0.3 s
- proto.hits.miss.clatterTo = 700 Hz
- proto.hits.miss.dustCount = 4 count
- proto.hits.miss.dustLife = 0.4 s
- proto.hits.miss.dustSize = 3 px
- proto.hits.miss.dustSpeed = 60 world units/s
- proto.hits.miss.streakCount = 3 count
- proto.hits.miss.streakLen = 24 world units
- proto.hits.miss.streakSeconds = 0.3 s
- proto.hits.miss.stumbleAmp = 0.4 rad
- proto.hits.nearMiss.streakCountMax = 5 count
- proto.hits.nearMiss.streakCountMin = 2 count
- proto.hits.nearMiss.streakLenMax = 40 world units
- proto.hits.nearMiss.streakLenMin = 14 world units
- proto.hits.nearMiss.streakSeconds = 0.25 s
- proto.hits.nearMiss.whooshFrom = 500 Hz
- proto.hits.nearMiss.whooshGain = 0.1 gain
- proto.hits.nearMiss.whooshSeconds = 0.25 s
- proto.hits.nearMiss.whooshTo = 2200 Hz
- proto.hits.reducedMotion = 0.25 ratio
- proto.hits.stopped.dustCount = 5 count
- proto.hits.stopped.dustLife = 0.5 s
- proto.hits.stopped.dustSize = 4 px
- proto.hits.stopped.dustSpeed = 50 world units/s
- proto.hits.stopped.thumpFrom = 900 Hz
- proto.hits.stopped.thumpGain = 0.18 gain
- proto.hits.stopped.thumpSeconds = 0.2 s
- proto.hits.stopped.thumpTo = 160 Hz
- proto.hits.touchSpent.dustCount = 3 count
- proto.hits.touchSpent.dustLife = 0.3 s
- proto.hits.touchSpent.dustSize = 3 px
- proto.hits.touchSpent.dustSpeed = 40 world units/s
- proto.hits.touchSpent.shakeAmp = 1.2 canvas units
- proto.hits.touchSpent.shakeSeconds = 0.1 s
- proto.hits.touchSpent.thudFrom = 500 Hz
- proto.hits.touchSpent.thudGain = 0.12 gain
- proto.hits.touchSpent.thudSeconds = 0.12 s
- proto.hits.touchSpent.thudTo = 140 Hz
- proto.hits.writeoff.crashFrom = 2000 Hz
- proto.hits.writeoff.crashGain = 0.24 gain
- proto.hits.writeoff.crashSeconds = 0.6 s
- proto.hits.writeoff.crashTo = 70 Hz
- proto.hits.writeoff.crumple = 0.4 ratio
- proto.hits.writeoff.debrisCount = 12 count
- proto.hits.writeoff.debrisLife = 0.9 s
- proto.hits.writeoff.debrisSize = 3 px
- proto.hits.writeoff.debrisSpeed = 200 world units/s
- proto.hits.writeoff.flashSeconds = 0.12 s
- proto.hits.writeoff.ringRadius = 26 world units
- proto.hits.writeoff.ringSeconds = 0.4 s
- proto.hits.writeoff.shakeAmp = 10 canvas units
- proto.hits.writeoff.shakeSeconds = 0.5 s
- proto.hits.writeoff.smokeCount = 8 count
- proto.hits.writeoff.smokeLife = 1 s
- proto.hits.writeoff.smokeSize = 6 px
- proto.hits.writeoff.sparkCount = 10 count
- proto.hits.writeoff.zoom = 0.06 ratio
- proto.hits.writeoff.zoomSeconds = 0.3 s
- proto.juice.brakeMarks.alpha = 0.3 alpha
- proto.juice.brakeMarks.fadeSeconds = 12 s
- proto.juice.brakeMarks.max = 400 count
- proto.juice.brakeMarks.minSpeed = 40 world units/s
- proto.juice.brakeMarks.width = 2.5 canvas units
- proto.juice.chassis.dropSeconds = 0.9 s
- proto.juice.chassis.dustCount = 10 count
- proto.juice.chassis.dustLife = 0.6 s
- proto.juice.chassis.dustSize = 4 canvas units
- proto.juice.chassis.dustSpeed = 80 canvas units/s
- proto.juice.denied.shakeAmp = 1.2 canvas units
- proto.juice.denied.shakeSeconds = 0.1 s
- proto.juice.drop.dustCount = 2 count
- proto.juice.impact.flash = 0.08 s
- proto.juice.impact.ringCount = 1 count
- proto.juice.impact.ringLife = 0.2 s
- proto.juice.impact.ringSize = 14 canvas units
- proto.juice.impact.ringSpeed = 140 canvas units/s
- proto.juice.impact.shakeAmpMax = 12 canvas units
- proto.juice.impact.shakeAmpMin = 3 canvas units
- proto.juice.impact.shakeSecondsMax = 0.45 s
- proto.juice.impact.shakeSecondsMin = 0.25 s
- proto.juice.impact.sparkCountMax = 18 count
- proto.juice.impact.sparkCountMin = 8 count
- proto.juice.impact.sparkLife = 0.35 s
- proto.juice.impact.sparkSize = 2.5 canvas units
- proto.juice.impact.sparkSpeed = 180 canvas units/s
- proto.juice.knock.dustCountMax = 5 count
- proto.juice.knock.dustCountMin = 2 count
- proto.juice.knock.dustLife = 0.35 s
- proto.juice.knock.dustSize = 2.5 canvas units
- proto.juice.knock.dustSpeed = 50 canvas units/s
- proto.juice.lowHealth.smokeFrom = 0.45 ratio
- proto.juice.lowHealth.sparkFrom = 0.7 ratio
- proto.juice.lowHealth.vignetteFrom = 0.7 ratio
- proto.juice.lunge.dustCount = 6 count
- proto.juice.lunge.dustLife = 0.4 s
- proto.juice.lunge.dustSize = 3 canvas units
- proto.juice.lunge.dustSpeed = 70 canvas units/s
- proto.juice.lunge.shakeAmpMax = 2.5 canvas units
- proto.juice.lunge.shakeAmpMin = 1 canvas units
- proto.juice.lunge.shakeSeconds = 0.15 s
- proto.juice.punt.dustCount = 4 count
- proto.juice.reducedMotion = 0.25 ratio
- proto.juice.throw.dustCount = 3 count
- proto.juice.throw.dustLife = 0.3 s
- proto.juice.throw.dustSize = 2.5 canvas units
- proto.juice.throw.dustSpeed = 40 canvas units/s
- proto.juice.touchSpent.dustCount = 3 count
- proto.juice.touchSpent.dustLife = 0.5 s
- proto.juice.touchSpent.dustSize = 3.5 canvas units
- proto.juice.touchSpent.dustSpeed = 30 canvas units/s
- proto.juice.touchSpent.shakeAmp = 1.5 canvas units
- proto.juice.touchSpent.shakeSeconds = 0.12 s
- proto.juice.writeoff.debrisCount = 10 count
- proto.juice.writeoff.debrisSize = 5 canvas units
- proto.juice.writeoff.debrisSpeed = 160 canvas units/s
- proto.juice.writeoff.flash = 0.15 s
- proto.juice.writeoff.jointDebrisCount = 4 count
- proto.juice.writeoff.shakeAmp = 16 canvas units
- proto.juice.writeoff.shakeSeconds = 0.7 s
- proto.juice.writeoff.smokeCount = 14 count
- proto.juice.writeoff.smokeSize = 8 canvas units
- proto.juice.writeoff.smokeSpeed = 40 canvas units/s
- proto.juice.writeoff.sparkCount = 24 count
- proto.juice.writeoff.sparkLife = 0.5 s
- proto.juice.writeoff.sparkSize = 3 canvas units
- proto.juice.writeoff.sparkSpeed = 240 canvas units/s
- proto.recoilScale = 0.6
- proto.recoilSeconds = 0.35
- world.deckHeight = 120 world units
- world.dropSeconds = 0.35 s
- world.highHeight = 216 world units

Districts in run order (sim.js, tables.districts):
- riverside: Riverside — focal monument; quota 1; highways 0 (Z2: 0); current placeholder blurb: "Low-rise riverfront. A lantern monument marks the centre."
- market: Old Market — focal fountain; quota 2; highways 0 (Z2: 0); current placeholder blurb: "Dense low-rise streets around a fountain square. Wet, and busy with vans."
- interchange: Interchange — focal roundabout; quota 2; highways 2 (Z2: 1); current placeholder blurb: "Two flyovers either side of a roundabout. Its island is crash matting."
- cbd: Central Business District — focal tower; quota 3; highways 2 (Z2: 1); current placeholder blurb: "Towers and barriers. FARSIGHT Tower stands at the centre."
- campus: FARSIGHT Campus — focal plate; quota 4; highways 1 (Z2: 0); current placeholder blurb: "The test centre the city was modelled on. Calibrated plates score more."

Published hit layers these stack on (prototypes/p3/content/hits.json): impact {}: shake, flash, crumple, ring, rays, popup, sound; impact {"zone": "front"}: shake, zoom, crumple, sound; impact {"bait": true}: ring, rays, sound; impact {"lunging": true}: shake, zoom; impact {"stopped": true}: sound; impact {"assessed": {"min": "proto.hits.big.assessedMin", "max": "damage.bodyHealth"}}: shake, zoom, flash, ring, sound; knock {}: sound; writeoff {}: shake, zoom, flash, crumple, ring, sound; touch-spent {}: shake, sound; near-miss {}: streaks, sound; miss {}: stumble, streaks, sound; lunge {}: shake, streaks, sound.

Palette roles (DESIGN#D10.2):
- floor: #EDF1F3 — Matte laboratory street ground
- grid: #D4DDE2 — Calibration pattern, subordinate to cues
- structure: #B8C4CB — Barriers and fixed forms
- fleet: #7E8C96 — Vehicle mass and ordinary lane geometry
- dummy: #F5C542 — Persistent actor accent
- joints: #1A1D1F — Facing/body articulation
- primary: #101417 — Reflex information and outlines
- secondary: #4A5A66 — Planning information
- warning: #E4442E — Reserved warning marks with independent shape/position
- aqua: #4FC3E8 — Frame and menu accents
- road: #DCE3E7 — P1 tarmac fill
- shoulder: #E5EAED — P1 pavement shoulder fill
- glass: #FFFFFF — P1 frame glass
- aquaDeep: #1E8FB8 — P1 frame accent and frame text

# CANON

[EDIT44#5.2] (5.2 Movement (Edit 42 rules replaced))
## 5.2 Movement (Edit 42 rules replaced)
```markdown
- **Stairs:** walked at × `world.stairSpeed` (0.7). No dash on a stair.
  - Run per `world.deckHeight` of rise: `world.stairLength` (64). Z0–Z1 64, Z0–Z2 112, Z1–Z2 48.
  - A ground stair: entered at its foot. Its sides and head are solid on the ground.
  - A link stair: entered from its deck's shoulder. Solid below.
  - Leaving either end steps the dummy fully onto the floor.
- **Raised floors:** decks, roofs and skybridges. Parapets hold the dummy.
  - Walking off a floor onto another floor at its level crosses over. A skybridge joins two roofs this way.
- **Drop:** off a ledge or through a broken parapet.
  - Fall time: `world.dropSeconds` × √(h / `world.deckHeight`). Z1 0.35 s; Z2 to the ground 0.47 s.
  - Lands on the nearest level below the landing point: a deck beneath, else the ground.
  - No control and no contact until the landing.
- **Cones stay on the ground.**
```

[EDIT44#8.3] (8.3 Damage (Edit 42 rule changed))
## 8.3 Damage (Edit 42 rule changed)
```markdown
- **Landing on a car:** downward speed is `damage.dropSpeed` × √(h / `world.deckHeight`).
  - From Z1 (120): stopped sedan 76, sedan at cruise 176, stopped van 78, van at cruise 157.
  - From Z2 (about 161): stopped sedan 136, sedan at cruise 236, stopped van 141, van at cruise 219.
  - Same impulse model and recoil. The legs take it.
```

[EDIT44#4.1] (4.1 Art grid (Edit 43 rule replaced))
## 4.1 Art grid (Edit 43 rule replaced)
```markdown
- **Raised levels:** a level and all on it draw lifted by its height × `proto.art.extrusion`.
  - Z1: `world.deckHeight` (120) → 18 art px. Z2: `world.highHeight` (216) → 32 art px.
  - Sim positions stay on the footprint. Only the drawing lifts.
  - A stair draws from its foot's lift to its head's lift.
  - A drop draws from the lift it left to the lift it lands on.
```

[EDIT26#5.5] (5.5 Feedback (Proposed))
### 5.5 Feedback (Proposed)
| Moment | What you see | What you hear |
|---|---|---|
| Start running | A dust puff and a forward lean | Clanking steps |
| Turning | The shoulders creak round in steps | A creak |
| Lunge | Squash, then stretch, with speed lines | A whoosh |
| Hit | A 0.06 s hit-stop; the dummy crumples and dents; a shake that grows with the damage | A crunch and a horn |
| Miss | A stumble, with arms flailing | A clatter |
| Jump | The shadow separates; a squash on landing | A spring, then a clank |
| Fall into a hole | A drop, then a pop-up at safe ground | A slide whistle |
| Battery empty | The glow dims | A low-charge beep |
| Write-off | Shake, particles, the body turns red and disappears (Built) | A crash |
Feedback never hides a car's cues. Where feedback and a cue conflict, the cue wins.
**Parameters — sensing and cues**
*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*
- `sensing.coneWidth` = 90 ° (Narrower than human vision; the dummy must turn its whole body to scan)
- `sensing.coneReach` = 900 units (Covers most of the level width, so the limit is direction rather than distance)
- `sensing.zoneFadeIn` = 0.15 s (Zones resolve as the cone sweeps, so looking reads as scanning rather than switching)
- `sensing.zoneOpacity` = ×0.25 (Visible without competing with tier-1 cues)
- `sensing.fogRadius` = 265 units (About a third of the play area; reserved for the fog-of-war experiment, a later feature)
- `upgrades.memorySeconds` = 2 s (Long enough to turn away and act on what was seen; short enough to stay a memory)
- `upgrades.earsForecast` = 1.5 s (Warns before a car enters the cone, so the player can turn toward it in time)
**Parameters — feedback**
- `feedback.hitStop` = 0.06 s (Short enough not to break flow, long enough to register the hit)
- `feedback.writeOffSeconds` = 1.1 s (The destruction animation; gameplay is frozen throughout)

[EDIT26#4.2~2] (4.2 UI)
| Cue | Carries | Form | Size | Channels |
|---|---|---|---|---|
| Nose vector | Dummy facing | Hard line from body centre | 1.5 × body width | Shape, rotation |
| Body silhouette | Dummy position, wear | Filled, dented, leaning | 26 units | Shape, position |
| Battery glow | Charge remaining | Ring around the body | 1.4 × body width | Brightness, arc length |
| Lunge streak | Lunge in progress | Motion trail along facing | `movement.lungeDistance` | Motion |
| Chevron | Car's intended route | Arrow ahead of the car | 1 car length | Shape, position |
| Commit ring | Route locked | Closed ring on the car | 1.2 × car width | Shape, closure |
| Brake light | Slowing | Two marks at the rear | 0.2 × car width | Position, brightness |
| Detection zone | Where a car can sense | Filled rectangle on the lab floor | Per 6.3 | Fill, edge |
| Side sensor | Short-range sensing | Two arcs at the nose | `perception.sideRadius` | Fill |
| View cone | What the player can resolve | Wedge on the lab floor | `sensing.coneReach` | Fill, edge |
| Model ID tag | Which car this is | Three characters above the car | `ui.typeLoadBearing` | Text, position |
| Seniority mark | How trained it is | One to four notches beside the tag | 24 × 6 units | Count, position |
| Prop state | Carried cone | Cone held forward of the body | Prop size | Shape, position |
| Hazard edge | Gap, water, oil | Hazard stripes, lip and shadow at the boundary | 4-unit lip | Shape, pattern, value |
| Impact burst | A hit landed | Radial particles at contact | 2 × body width | Motion, brightness |
**Rules.**
1. **Reserved treatment.** Texture, noise and panel detail never touch a cue in this table.
2. **Two channels minimum.** Every tier-1 cue carries its fact on at least two of colour, shape, position and motion. Colour alone is forbidden.
3. **Cue beats register.** Where the two conflict, the register gives way.
#### 4.2.3 Legibility budget
Exhibition viewing distance is 1.5 to 2.5 m. One logical unit is about 0.47 mm on a 27-inch display at 1280 units wide.
| Class | Parameter | Cap height | Legible at 2 m | Use |
|---|---|---|---|---|
| Load-bearing | `ui.typeLoadBearing` | 24 units | Yes | Model IDs, panel readouts, counts |
| Secondary | `ui.typeSecondary` | 16 units | At 1.5 m | Labels, level name |
| Texture | `ui.typeTexture` | 9 units | No, by design | Diagnostic runs, range marks, signage |

[DESIGN#D4.5] (D4.5 Sensing and feedback (§5.5))
### D4.5 Sensing and feedback (§5.5)
The view cone follows body facing in the slice. It resolves cars' sensor zones and occlusion information in that direction. Cars, identity, route/commitment, brake and spent cues remain available outside the cone. There is no active fog-of-war experiment that hides traffic.
Actor markers remain readable when sprites overlap; occlusion concerns the sensor information and actual sensor rays. Van-class cover can block sensing according to World flags, but must not erase all warning that another vehicle exists.
The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. A 0.06-second hit-stop and 1.1-second destruction presentation are trial values. Cues take priority over particles, shake and decorative information.

[JUICE#J2] (J2 Reference talks — general juice)
## J2 Reference talks — general juice
| Source | Technique | DUMMIES reading |
|---|---|---|
| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) | Hit pause. Screen shake. Camera kick. Knockback. Impact effects. Permanence: debris stays. | Hit pause is `feedback.hitStop`. Knockback is P1.3 recoil. Permanence suits tyre marks and dents. |
| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) | Tweening. Squash and stretch. Particles. Sound on every action. | The dummy squashes on lunge and recovery (P1.2). Sound keeps a visual equivalent (D9.4). |

[JUICE#J4] (J4 Intensity rules (Proposed))
## J4 Intensity rules (Proposed)
- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.

[EDIT39#4.1.1] (4.1.1 The register (replaces Edit 37))
## 4.1.1 The register (replaces Edit 37)
```markdown
#### 4.1.1 The register
**A Sinofuturist cyber city inside a friendly corporate terminal.** Two layers, never mixed.
- **The play area is the city at night.** 16-bit pixel art: dark deck plates, LED city blocks, neon spill, jersey barriers, a white fleet.
- **The frame is FARSIGHT's brand.** Dark glass, cyan LED edges, rounded panels. High resolution.
- **The contrast is the tone.** The city glows. The test writes off bodies in it. The brand never comments.
- **Dark ground rules every edge** (4.1.2). No sprite edge is black.
- **Reserved hues hold.** Yellow is the dummy. Red is the warning. Neon is material, never a cue.
- **Options:** day (Edit 37 eco-city) and night (parkland) remain as build palettes. Play never changes.
```

[DECISIONS#rows-161-170~2] (Rows 161–170)
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 161 | The registry takes Edit 43: version `edit43-2026-10-21` | proposed (assistant, 21 October) | Every new statistic has an ID | 11 new entries, 1 retired, 2 table columns changed, 20 palette rows | `content/params/tuning.parameters.json` |
| 162 | Three levels by height: Z0 ground, Z1 low highway (`world.deckHeight` 120), Z2 high: the high highway, platform roofs and skybridges (`world.highHeight` 216). The underground is removed; `world.underpassChance` retired. Supersedes row 145's numbering, row 146's underpasses and row 156's cutaway | user-directed (21 October): "It is too difficult to see underground. Therefore let's have three levels, but make Ground (Z= 0), Low Highway (Z= 1), and High Platforms / Roofs / High Highway (Z=2). Redraw all the graphics and navigation accordingly." | Every level shows from above | No hidden passage | Contract clause 20; tests renumbered in `test_sim.js` |
| 163 | Z2 is reached two ways: a tall stair from the ground (run 112) and a link stair from a low highway's shoulder (run 48). Stair run is `world.stairLength` per `world.deckHeight` of rise | user-chosen (21 October): "Both routes"; the run rule is the assistant's | Roofs reach from the street and from the highway | Tall stairs take frontage | 2 checks in `test_sim.js` |
| 164 | Platform blocks: a frontage lot becomes a building to `world.highHeight` with a walkable roof, at `platformShare` (0.10–0.15). Its stair climbs along the road-facing edge; a single-storey annex fills the strip behind | user-chosen (21 October): "Platform blocks"; stair placement and annex are the assistant's | A roof a street away from traffic | Platform lots are 176–208 wide | Contract clause 22; `prototypes/p3/docs/p33_tallstair.png` |
| 165 | Skybridges join platform roofs across an alley or lane: `world.stairWidth` wide, up to `world.skybridgeMax` 96. The next lot after a platform joins it at `world.skybridgeChance` 0.75, up to `world.platformChain` 3 roofs; at most `world.skybridgeCount` 4 per screen. Parapets hold; no drop off a bridge. Closes D29 | user-chosen (21 October): "Platform blocks … joined by skybridges"; spans and counts are the assistant's | A roof walk above the street | Few bridges where decks take the ground | 1 check in `test_sim.js`; `prototypes/p3/docs/p33_bridge.png` |
| 166 | Roof edges facing the road, with open ground below, are ledges: a white-and-black striped kerb. Other roof edges have parapets | proposed (assistant, 21 October) | Drops land in the forecourt, near traffic | North-facing ledges drop behind the building | Contract clause 22; 1 check in `test_sim.js` |
| 167 | Interchange and CBD each run one flyover at Z2 (`highDecks` 1). CBD decks 1 → 2. Other districts keep one Z1 flyover or none | user-chosen (21 October): "Interchange + CBD" | The high highway stays a landmark | CBD keeps less buildable ground | 1 check in `test_sim.js` |
| 168 | A drop lands on the nearest level below the landing point: a deck beneath, else the ground. Fall time and landing speed × √(h / `world.deckHeight`): Z2 to the ground 0.47 s, about 161 units/s | user-chosen (21 October): "Nearest level below"; the √ scaling is the assistant's (free fall) | A higher fall hits a car harder: stopped sedan 76 → 136 | Longer fall, more time for a car to pass | 2 checks in `test_sim.js` |
| 169 | Every level draws lifted by its height × `proto.art.extrusion`: Z1 18 art px, Z2 32. Columns rise to their deck. Platforms draw to Z2 with a tiled roof, LED parapet, ledge kerb and openings. Stairs draw from foot lift to head lift; x-axis flights show a stringer. Z2 decks add an inner LED line; the map draws them heavier. Tags: Z1 HIGHWAY, Z2 HIGHWAY, Z2 ROOF, Z2 BRIDGE, STAIRS, FALLING | user-directed (21 October): "Redraw all the graphics and navigation accordingly"; the treatment is the assistant's | One glance tells the level | No new palette roles | `prototypes/p3/docs/p33_*.png` |
| 170 | Cues and tags show for cars that can meet the dummy: ground cars on Z0, its own deck's cars on a highway, none on roofs and bridges. Supersedes row 150 in part | proposed (assistant, 21 October) | Only threats get cues | No traffic cues while planning a roof drop | Open item in Edit 44 |

[EDIT44#decisions] (Decisions)
## Decisions
| # | Decision | Status |
|---|---|---|
| 162 | Three levels by height: Z0 ground, Z1 low highway, Z2 high. The underground is removed | user-directed |
| 163 | Z2 is reached two ways: a tall stair from the ground, a link stair from a low highway | user-chosen |
| 164 | Platform blocks: frontage buildings built to Z2 with walkable roofs | user-chosen; stair, annex and chain rules are the assistant's |
| 165 | Skybridges join platform roofs across alleys and lanes | user-chosen; spans and counts are the assistant's |
| 166 | Roof edges facing the road are ledges. Other roof edges have parapets | proposed |
| 167 | Interchange and CBD run one flyover each at Z2. CBD gains a second flyover | user-chosen |
| 168 | A drop lands on the nearest level below. Fall time and landing speed grow with √height | user-chosen; √ scaling is the assistant's |
| 169 | Every level draws lifted by its height. Roofs, bridges and stairs redrawn | user-directed; treatment is the assistant's |
| 170 | Cues show for cars that can meet the dummy. None on roofs or bridges | proposed |
| 171 | Towers start at eight storeys, above every Z2 roof | proposed |
| 172 | Bake keeps start screens whose first bot write-off comes by 90 s | proposed |
| 173 | Registry takes Edit 44 | proposed |

[EDIT42#8.3] (8.3 Damage (rule added))
## 8.3 Damage (rule added)
```markdown
- **Landing on a car:** closing speed is the hypotenuse of `damage.dropSpeed` (120) and the car's speed across.
  - Same impulse model as a strike, without the sprint cap. The legs take it.
  - Stopped sedan 76. Sedan at cruise 176. Stopped van 78. Van at cruise 157.
  - Scores points. The plate multiplier applies on the ground only.
  - The dummy is thrown off the car's side (`proto.recoilScale`).
```

[EDIT44#4.2] (4.2 Interface (Edit 42 and 43 rows replaced))
## 4.2 Interface (Edit 42 and 43 rows replaced)
```markdown
- **Level tag:** the top bar adds `Z1 HIGHWAY`, `Z2 HIGHWAY`, `Z2 ROOF`, `Z2 BRIDGE`, `STAIRS` or `FALLING`. Nothing on the ground.
- **Cues follow who can meet the dummy.**
  - Ground: ground cars. A highway: its own deck's cars. A roof or bridge: none.
  - On a stair: the end it is nearer. Falling: the level it lands on.
- **Levels read apart.**
  - Z0 street: asphalt, kerbs, pavements (unchanged).
  - Z1 low highway: pale concrete, one LED line on each parapet.
  - Z2 high highway: a second LED line inside each parapet, in another LED colour.
  - Z2 roof: rooftop tiles, an LED parapet, openings where stairs and bridges join.
  - Roof ledge: a white-and-black striped kerb. Never red.
  - Skybridge: glazed rails with LED dots, joints, a slim girder face, a shadow.
- **Falling:** the dummy's shadow marks the landing spot on the ground.
- **District map:** a Z1 flyover is a dashed line. A Z2 flyover is heavier.
- **Toasts:** the first time up on a low highway, a high highway or a roof.
- **Removed:** the underground cutaway and the `UNDERPASS` tag.
```

[JUICE#J3] (J3 Event map)
## J3 Event map
| DUMMIES event | Reference technique | Constraint |
|---|---|---|
| Lunge (`lunge`) | Squash, stretch, dust kicked backwards | Announce the lunge (D4.5). Never hide the nose vector. |
| Scored impact (`impact`) | Hit pause, shake scaled by assessed impact, sparks, contact flash | Cues outrank particles and shake (D4.5). |
| Touch on a spent car (`touch-spent`) | Dull bump, no burst | Must not look like a scored hit (D4.5). |
| Knock without damage (`knock`) | Small dust puff | No reward feedback. |
| Car braking | Tyre marks that persist on the floor | The live brake cue stays separate (D10.3). Old marks must not read as braking now. |
| Write-off (`writeoff`) | Heavy shake, debris, stamp, wreck permanence | Wreck is visual only (Engineering §8.5). Duration is `feedback.writeOffSeconds`. |
| Replacement (`chassis`) | Super Sprint helicopter drop | Delivery animation only. No collider until placement is legal. |
| Denied action (`denied`) | Short stutter | Costs nothing (D4.2). Distinct from a miss. |
| Low health | Smoke and sparks (P1.2) | Facing stays crisp at every wear level. |
| Cone throw (`throw`) | Arc and stretched shadow (P1.2) | Cones never train cars (D5.3). |

[JUICE#J1] (J1 Reference games — top-down arcade driving)
## J1 Reference games — top-down arcade driving
| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

[LOG#P1.2/juice] (Juice)
### Juice
Presentation constants in `game.js`. Scaled to 25% under reduced-motion settings.
| Event | Response |
|---|---|
| Lunge | Dust puff behind the body. Small camera kick. |
| Impact | Camera shake scales with assessed impact. Body flinches and flashes white. Car pulses and flashes. Sparks. White contact flash. Impact number pops. |
| Touching a spent car | Small kick and a dull thud. |
| Write-off | Heavy shake. Field flash. Sparks and smoke. A WRITTEN OFF stamp slams onto the wreck. |
| Cone in flight | Lifts in an arc; its shadow stretches. |

[EDIT38#4.1.6] (4.1.6 Dark-ground palettes (new, Option))
## 4.1.6 Dark-ground palettes (new, Option)
```markdown
#### 4.1.6 Dark-ground palettes (Option)
Chosen at load: `?palette=cyber|day|night`. Default cyber (decision 109). Play never changes.
| Palette | Field | Frame | Cues |
|---|---|---|---|
| Day | Eco-city (4.1.1) | Light glass | Dark on light |
| Night | Chongqing night: dark lawns, lime-lit trees, LED towers, river light | Dark glass, cyan edges | Light on dark |
| Cyber | Night inks. Deck plates and LED city blocks replace lawns and trees | As night | As night |
- **Reserved hues hold.** Yellow is the dummy only. Red is the warning only.
- **Red and gold décor stay in the frame.**
- **No actor edge is pure black on dark ground** (4.1.2).
- **Night contrast on `field.road`:** `cue.primary` 14.9:1 · `cue.secondary` 6.2:1 · `cue.warning` 4.5:1, halo 9.2:1 · `dummy.body` 9.8:1.
- **Night inks:** `cue.primary` `#F4F8FA` · `cue.secondary` `#7FA8BC` · `cue.warning` `#FF3D3D`.
```

[EDIT44#7.7] (7.7 Levels (Edit 42 table replaced))
## 7.7 Levels (Edit 42 table replaced)
```markdown
| Z | Name | Floors | Reached by | Cars | Bounds |
|---|---|---|---|---|---|
| 0 | Ground (default) | Streets, forecourts | Spawn, stair foot, landing | Ground traffic | Statics, walls, checkpoints |
| 1 | Low highway | Z1 decks | Stair from the ground | Its deck's traffic | Parapets, deck checkpoint |
| 2 | High | Z2 decks, platform roofs, skybridges | Tall stair, link stair, stair to a Z2 deck | A Z2 deck's own traffic | Parapets; ledges drop |
- Heights: `world.deckHeight` (120) for Z1; `world.highHeight` (216) for Z2.
- A stair belongs to no level. Nothing meets the dummy on it.
```

[ENG#6.2~1] (6.2 Sensing, intention and commitment)
### 6.2 Sensing, intention and commitment
Vehicles sense using a forward rectangle starting at the nose, with length given by the learned snapshot and width equal to vehicle width plus the 26-unit dummy diameter. Side sensors originate at the nose, reach 100 units and use an 80-degree half-angle about each lateral axis; their detection requests slowing, not an independent swerve. Reaction delay is 0.15 s. These are trial geometry/response definitions. Occlusion is tested along the nose-to-target sensing ray against explicit masks. The player's sensing wedge is a separate system. World data explicitly states which objects block each sensor and which obstruct the player's optional diagnostic view. Being outside the player's wedge must never hide an actor, an essential threat cue, a fixed/expiring/interrupted route or a spent appearance.
The fleet may detect the dummy, plan a manoeuvre and then commit. These are different states with different cues:
| State | Behaviour and visible promise |
|---|---|
| Sensing | The dummy or prop is detected; no fixed route is promised |
| Intention | A candidate manoeuvre is readable but may still change |
| Committed | Traffic has approved a swept corridor and planned speed trajectory for at least 0.75 s; the fixed-route cue appears |
| Interrupted | An unforeseen obstruction forces safety braking; the commitment cue visibly breaks and an interruption cue replaces it |
| Released | The promised window has finished; a new intention/commitment may begin |

[ENG#8.4] (8.4 Whole-tick outcome transaction)
### 8.4 Whole-tick outcome transaction
Removing a finishing threshold does not remove the accounting-order requirement. One coordinator stages all consequences before presenting any credit, report or ending:
1. Advance deadlines/refill to the tick timestamp, arbitrate input, and compute swept motion. Capture pre-response velocities and contact geometry at time of impact. Resolve physical contacts safely, including contacts that will award no reward.
2. Order candidates by time of impact, then stable appearance ID. Evaluate each against the **current staged accounting state**, not repeatedly against tick-start health. Keep physical snapshots immutable; refresh health/allowance/learning eligibility after each staged event.
3. Ignore already committed event IDs, zero-assessment reward attempts and spent appearances. On each qualifying contact, stage allowance, health, assessed points and player-hit learning. If health reaches zero, latch this body dead, stage one write-off and bonus, and ignore subsequent damage/rewards for this body while preserving physical safety.
4. After all current-tick contacts and appearance eligibility are settled, decide success, confirmed withdrawal or exhaustion in that order. Exhaustion means all scheduled slots admitted and every appearance spent or exited. A last tiny hit can win; a last lethal hit below quota ends as Failed test.
5. Only a nonterminal write-off grants a spendable credit. Publish the complete validated tick result atomically, through component owners, then send an immutable view to presentation. Terminal outcomes never briefly open a shop or expose a credit that is later retracted.
Duplicate delivery has no effects. If validation fails, publish no partial state. Required fixtures include two individually nonlethal hits jointly destroying one body, a 5-health/5-assessment finisher, last-hit success, last-hit failure, duplicate terminal delivery and an earlier zero-damage episode followed by valid separated contact. `v28_reference.resolve_tick` demonstrates accounting over supplied physical snapshots; a real swept solver is still required.

[EDIT26#11.4] (11.4 Module boundaries (Proposed))
### 11.4 Module boundaries (Proposed)
Small contracts, not a framework. No general event system or entity-component rewrite is required.
| Owner | Sole authority over | Reads |
|---|---|---|
| Run | Run phase, level, quota, certification, ending | Committed impacts and write-offs |
| Body | Health, charge, facing, locomotion, carried prop, attachment, service flag | Owned upgrades and World |
| Vehicles | Appearance position and speed, perception, route, commitment, spent-impact flag | Class data and the model learning snapshot |
| Traffic | Admission, path reservations, priority | World and all vehicle footprints |
| Damage | Impact calculation only. No rewards, no UI | An immutable collision snapshot |
| Economy | Score, credit balance, owned upgrade IDs | Unique reward transactions |
| Learning | Model experience and approach counters | One unique write-off outcome |
| World | Terrain, occupancy, prop positions | — |
| Sensing | Player-visible zones and remembered observations | Authoritative state. Never changes what car sensors know |
| Presentation | Animation, HUD, audio, narrative selection | Committed outcomes. Cannot award points, advance learning or choose endings |
- Body is the only source of effective upgraded statistics. Sensing reads Body's cone width rather than keeping a second copy.
- Presentation may wait for an animation, but cannot delay deciding whether an outcome is terminal.
- Pauses, reports and hit-stop freeze gameplay clocks including battery, service, traffic and learning. Presentation time is separate.

[ENG#5.3~2] (5.3 Lunge, actual velocity and solid response)
Recovery begins at the snapshotted lunge deadline and lasts its declared duration, including after early obstruction. Pause/hit-stop freeze these simulation deadlines. T01/T08 must exercise early walls, glancing contacts, stationary vehicles, pushing and two-contact constraints.

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[EDIT44#registry-changes-edit44-2026-10-21] (Registry changes (`edit44-2026-10-21`))
## Registry changes (`edit44-2026-10-21`)
| ID | Change | Value | Status |
|---|---|---|---|
| `world.highHeight` | Added | 216 units | proposed |
| `world.skybridgeMax` | Added | 96 units | proposed |
| `world.skybridgeChance` | Added | 0.75 | proposed |
| `world.platformChain` | Added | 3 roofs | proposed |
| `world.skybridgeCount` | Added | 4 per screen | proposed |
| `tables.districts.highDecks` | Added column | 0, 0, 1, 1, 0 | user-chosen |
| `tables.districts.platformShare` | Added column | 0.10, 0.12, 0.15, 0.15, 0.12 | proposed |
| `tables.districts.decks` | CBD changed | 1 → 2 | user-chosen |
| `world.towerHeightMin` | Changed | 220 → 288 units | proposed |
| `world.underpassChance` | Retired | — | user-directed |
| `world.stairLength`, `world.stairWidth`, `world.dropSeconds`, `damage.dropSpeed`, `world.deckHeight` | Descriptions: per-height runs and √ scaling | unchanged values | proposed |
| Palette roles `field.tile`, `field.tile2` | Retired with the cutaway | cyber and day | proposed |

[EDIT26#5.1] (5.1 Persona and appearance)
### 5.1 Persona and appearance
- **What it is.** A FARSIGHT crash-test dummy. One test unit at a time, replaced after each write-off. Earnest, stiff and clanky. Its personality comes through movement, not words (pillar 3).
- **Seen from above** (Built greybox). A round body 26 units across.
- **Seen from above** (Proposed art). A head disc on a shoulder bar, a nose line showing facing, FARSIGHT stencils on its back. Arms and legs loosen as upgrades are bought: arms swing once Carry is owned. Damage shows as dents and a growing lean.
**States** (Proposed cues; * needs an upgrade or a world feature)
| State | What you see from above |
|---|---|
| Idle | A small sway; the view cone sweeps slowly with the facing |
| Walking, running | Stiff, clanking steps; a dust puff when the run starts |
| Turning | The shoulder bar rotates in steps, with a creak |
| Lunging | Squash, then stretch along the lunge, with speed lines |
| Recovering | A stagger; the body straightens as speed returns |
| Jumping* | The shadow separates from the body; a squash on landing |
| Carrying* | A cone held out in front |
| Holding on* | Clamped to a car's side, dragged along |
| Falling* | Drops into the hole, then pops up at safe ground |
| Written off | Shake, particles, turns red, disappears over `feedback.writeOffSeconds` (Built) |

[LOG#P3/automated-evidence] (Automated evidence)
### Automated evidence
- `node test_sim.js` → 47/47. New: 8 city, 2 hit-location, 3 part-effect checks.
- `node policy_check.js`, L1 Standard 300:
| Policy | City off, effects off | City on, effects off | City on, effects on |
|---|---|---|---|
| Stand in lane | 0 impacts | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Cleared at 45.9 s | 0 impacts in 300 s | 0 impacts in 300 s |
| Read & lunge | Cleared at 15.1 s | Cleared at 17.9 s | Cleared at 18.4 s |
- **Read:** the city stops the blind bot on L1. Cause not inspected.
- **Read:** part effects barely touch L1; one write-off clears it.

[LOG#P1.1-observations] (P1.1 observations)
## P1.1 observations
**Build seen:** `dummies_p1.html` v2 · 14 Oct 2026 · *Designer play*
| ID | Observation | Response | Status |
|---|---|---|---|
| O1.6 | Light graphics amendments wanted. | P1.2 lighting, relief and cone pass | Addressed (awaiting replay) |
| O1.7 | The dummy should visibly degrade as it absorbs damage. | Staged damage states | Addressed (awaiting replay) |
| O1.8 | Add juice: camera shake, player shake, small animations that raise the stakes. | Juice pass | Addressed (awaiting replay) |
| O1.9 | Cones should be 20% larger. They don't read as cones. | Radius override and new top-down cone | Addressed (awaiting replay) |
| O1.10 | Cones should not start in the road. | All cone homes moved off the road | Addressed |
| O1.11 | Drop shadows on everything, sun at 1:30, to throw items into relief. | Height-based shadows to 7:30 | Addressed (awaiting replay) |
| O1.12 | A car blocked by cones for 5 s honks (sound, flashing lights). Then drones move the cones. | Honk and drone recovery | Addressed (awaiting replay) |

[EDIT40#D27] (D27 — Viewable area (open))
## D27 — Viewable area (open)
Each option keeps the 640 × 360 screen. Sedan at 138 units/s.
| Option | Field (art px) | Play area (units) | Area | Dummy / sedan (art px) | Side columns | Crossing H / V | Recalculate |
|---|---|---|---|---|---|---|---|
| A Keep | 400 × 300 | 800 × 600 | 1.00 | 13 / 28 × 14 | 120 px | 5.8 / 4.3 s | Nothing |
| B Wider field | 480 × 300 | 960 × 600 | 1.20 | 13 / 28 × 14 | 80 px | 7.0 / 4.3 s | `ui.playWidth`, 4.2.1 layout, 7.1 table, pacing, quotas |
| C Zoom out | 400 × 300 | 1000 × 750 | 1.56 | 10 / 22 × 11 | 120 px | 7.2 / 5.4 s | `ui.artScale` 2.5, sprites, 4.2.3 budget, all of B |
| D Full width | 560 × 300 | 1120 × 600 | 1.40 | 13 / 28 × 14 | HUD over field | 8.1 / 4.3 s | HUD redesign, all of B |
- **Recommended: A.** The district gives nine times the area. Each screen keeps pillar 2.
- **If more room is needed: B.** Same pixels. Costs approach symmetry and the side-column layout.
- **More roads per screen** come from junction pieces, not a bigger screen.

[LOG#P3.3] (P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57))
## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57)
**Build:** `prototypes/p3/dummies_p3.html` (P3.3) · 21 Oct 2026 · Spec: GDD Edit 44 · Decisions 162–173.
- **Levels:** Z0 ground, Z1 low highway (18 art px up), Z2 high (32 art px up). No underground.
- **High highway:** Interchange and CBD run one flyover each at Z2.
- **Platforms:** frontage buildings built to Z2 with walkable roofs. A tall stair from the street; a link stair from a low highway.
- **Skybridges:** join roofs across alleys and lanes.
- **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. Z2 falls last 0.47 s and hit harder.

[EDIT26#6.5] (6.5 Moods)
### 6.5 Moods
Assigned per appearance with seeded generation. Mood varies the encounter without changing what the car is allowed to do.
| Mood | Effect | Share |
|---|---|---|
| **Standard** | Baseline | 55% |
| **Rush** | Desired speed ×1.15, time gap ×0.8 | 20% |
| **Cautious** | Desired speed ×0.8, braking begins 50% earlier | 15% |
| **Unreliable** | Desired speed varies ±10%, pre-commit hesitation of 0 to 0.3 s | 10% |
**Mood may never** add route revisions beyond the hatchback's signalled exception, hide a cue, or remove a lethal opportunity. Learning is unaffected: a Cautious car that writes off a body trains its model exactly as a Standard one would. The safety cancellation in 6.2 is controlled by traffic arbitration, never by mood.

[ENG#8.2~2] (8.2 Damage uses actual relative closing velocity)
Use binary64 internal arithmetic, stable evaluation order and unrounded totals. Display nonnegative values using nearest integer, half-up. Death uses unrounded health clamped to zero. Pure tangential motion has zero normal closing speed; spent contacts remain physical but reward-free. Final score still includes finishing excess once, capped by fresh-body health, plus the once-only write-off bonus. Human balance tests must assess speed-based impacts, stationary-car tactics and deliberate score detours.

[ENG#8.3] (8.3 Score and finishing incentives)
### 8.3 Score and finishing incentives
Award impact points once per consumed positive-damage episode and a 2,500-point write-off bonus once per completed body. Impact points are based on assessed impact, not only remaining health. This intentionally rewards a strong finishing hit; it also creates a potential incentive to delay a finish, which T04 must investigate.
For example, with 100 health remaining and a 500 raw impact on normal ground, the body loses 100 health, earns 500 impact points and one 2,500-point write-off bonus. The 400 finishing excess is recorded for analysis, not added a second time. If this is the objective-completing body, it earns no spendable credit. The 800 assessment cap prevents arbitrarily large per-hit awards from future heavy vehicles or multiplicative effects.
Scoring only health removed would make a five-body win's ordinary damage-plus-bonus subtotal constant. V29 retains assessed-impact scoring while exposing its trade-offs. Compare score, actual health lost, completion and elapsed time together. Investigate sequences that farm score while avoiding the objective. No score multiplier changes learning credit, body count or purchasing currency unless an explicit future rule is approved and propagated.

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- none

# CONTENT

{
 "params": [
  {
   "id": "proto.drops.step.streakCountMin",
   "value": 2,
   "unit": "count",
   "purpose": "Fall streaks from a Z1 step-off.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.streakCountMax",
   "value": 5,
   "unit": "count",
   "purpose": "Fall streaks from a full-height Z2 step-off.",
   "sources": [
    "EDIT44#5.2",
    "EDIT44#4.1"
   ]
  },
  {
   "id": "proto.drops.step.streakLenMin",
   "value": 24,
   "unit": "world units",
   "purpose": "Streak length for the shortest fall.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.streakLenMax",
   "value": 70,
   "unit": "world units",
   "purpose": "Streak length at full height.",
   "sources": [
    "EDIT44#4.1"
   ]
  },
  {
   "id": "proto.drops.step.streakSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Streak life during the fall.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.zoomMin",
   "value": 0.01,
   "unit": "ratio",
   "purpose": "Slight pull-in on a Z1 step-off.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.step.zoomMax",
   "value": 0.03,
   "unit": "ratio",
   "purpose": "Pull-in on a Z2 step-off.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.step.fallSecondsMax",
   "value": 0.47,
   "unit": "s",
   "purpose": "Z2 fall time. Matches world.dropSeconds × √(216/120) rounded.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.dustCountMin",
   "value": 2,
   "unit": "count",
   "purpose": "Ledge dust, short fall.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.dustCountMax",
   "value": 4,
   "unit": "count",
   "purpose": "Ledge dust, full height.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.step.whistleFromMin",
   "value": 500,
   "unit": "Hz",
   "purpose": "Fall tone start, Z1.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.drops.step.whistleFromMax",
   "value": 900,
   "unit": "Hz",
   "purpose": "Fall tone start, Z2.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.drops.step.whistleToMin",
   "value": 300,
   "unit": "Hz",
   "purpose": "Fall tone end, Z1.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.drops.step.whistleToMax",
   "value": 120,
   "unit": "Hz",
   "purpose": "Fall tone end, Z2. A longer fall sinks lower.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.drops.step.whistleGain",
   "value": 0.08,
   "unit": "gain",
   "purpose": "Quiet fall tone. Cues stay readable.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.drops.land.shakeAmpMin",
   "value": 2,
   "unit": "canvas units",
   "purpose": "Open-ground landing shake, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.shakeAmpMax",
   "value": 8,
   "unit": "canvas units",
   "purpose": "Open-ground landing shake, Z2.",
   "sources": [
    "JUICE#J2",
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.land.shakeSecondsMin",
   "value": 0.15,
   "unit": "s",
   "purpose": "Landing shake length, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.shakeSecondsMax",
   "value": 0.3,
   "unit": "s",
   "purpose": "Landing shake length, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.zoomMin",
   "value": 0.01,
   "unit": "ratio",
   "purpose": "Landing kick, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.zoomMax",
   "value": 0.04,
   "unit": "ratio",
   "purpose": "Landing kick, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.zoomSeconds",
   "value": 0.15,
   "unit": "s",
   "purpose": "Landing kick length.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.crumpleMin",
   "value": 0.05,
   "unit": "ratio",
   "purpose": "Landing squash, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.crumpleMax",
   "value": 0.2,
   "unit": "ratio",
   "purpose": "Landing squash, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.crumpleSeconds",
   "value": 0.2,
   "unit": "s",
   "purpose": "Landing squash length.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.stumbleMin",
   "value": 0.15,
   "unit": "ratio",
   "purpose": "Stumble after a Z1 landing.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.land.stumbleMax",
   "value": 0.4,
   "unit": "ratio",
   "purpose": "Stumble after a Z2 landing.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.land.ringRadiusMin",
   "value": 16,
   "unit": "world units",
   "purpose": "Floor shockwave radius, Z1.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.land.ringRadiusMax",
   "value": 44,
   "unit": "world units",
   "purpose": "Floor shockwave radius, Z2.",
   "sources": [
    "EDIT44#5.2"
   ]
  },
  {
   "id": "proto.drops.land.ringSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Shockwave life.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.dustCountMin",
   "value": 4,
   "unit": "count",
   "purpose": "Landing dust, Z1.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.dustCountMax",
   "value": 14,
   "unit": "count",
   "purpose": "Landing dust, Z2.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.dustSpeedMin",
   "value": 50,
   "unit": "world units/s",
   "purpose": "Dust speed, Z1.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.dustSpeedMax",
   "value": 140,
   "unit": "world units/s",
   "purpose": "Dust speed, Z2.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.dustLifeMin",
   "value": 0.4,
   "unit": "s",
   "purpose": "Dust life, Z1.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.dustLifeMax",
   "value": 0.7,
   "unit": "s",
   "purpose": "Dust life, Z2.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.land.thudFromSmall",
   "value": 260,
   "unit": "Hz",
   "purpose": "Landing thud start, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudFromFull",
   "value": 160,
   "unit": "Hz",
   "purpose": "Landing thud start, Z2. Deeper for more height.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudToSmall",
   "value": 80,
   "unit": "Hz",
   "purpose": "Landing thud end, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudToFull",
   "value": 45,
   "unit": "Hz",
   "purpose": "Landing thud end, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudSecondsSmall",
   "value": 0.18,
   "unit": "s",
   "purpose": "Thud length, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudSecondsFull",
   "value": 0.3,
   "unit": "s",
   "purpose": "Thud length, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudGainSmall",
   "value": 0.1,
   "unit": "gain",
   "purpose": "Thud gain, Z1.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.land.thudGainFull",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Thud gain, Z2.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.shakeAmp",
   "value": 8,
   "unit": "canvas units",
   "purpose": "Hit-from-above shake. Heavier than a side hit.",
   "sources": [
    "EDIT44#8.3",
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.shakeSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Hit-from-above shake length.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.zoom",
   "value": 0.05,
   "unit": "ratio",
   "purpose": "Downward press on a car hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.zoomSeconds",
   "value": 0.18,
   "unit": "s",
   "purpose": "Press length.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.crumple",
   "value": 0.3,
   "unit": "ratio",
   "purpose": "Legs take it: deeper squash than a strike.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.hit.crumpleSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Squash length.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.hit.dustCount",
   "value": 8,
   "unit": "count",
   "purpose": "Dust thrown off the car roof.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.hit.dustSpeed",
   "value": 110,
   "unit": "world units/s",
   "purpose": "Roof dust speed.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.hit.dustLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Roof dust life.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.drops.hit.boomFrom",
   "value": 320,
   "unit": "Hz",
   "purpose": "Roof boom start.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.boomTo",
   "value": 50,
   "unit": "Hz",
   "purpose": "Roof boom end.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.boomSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Roof boom length.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.hit.boomGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Roof boom gain.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.drops.z2.shakeAmp",
   "value": 11,
   "unit": "canvas units",
   "purpose": "Z2 hit shake. Stopped sedan 136 against 76.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.shakeSeconds",
   "value": 0.4,
   "unit": "s",
   "purpose": "Z2 shake length.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.zoom",
   "value": 0.07,
   "unit": "ratio",
   "purpose": "Z2 press.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.zoomSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Z2 press length.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.crumple",
   "value": 0.34,
   "unit": "ratio",
   "purpose": "Z2 squash, under the head-on cap.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.crumpleSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Z2 squash length.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.ringRadius",
   "value": 40,
   "unit": "world units",
   "purpose": "Z2 contact ring.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.ringSeconds",
   "value": 0.35,
   "unit": "s",
   "purpose": "Z2 ring life.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.ringWidth",
   "value": 3,
   "unit": "px",
   "purpose": "Z2 ring line width.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.debrisCount",
   "value": 8,
   "unit": "count",
   "purpose": "Debris from a Z2 hit.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.debrisSpeed",
   "value": 180,
   "unit": "world units/s",
   "purpose": "Z2 debris speed.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.debrisLife",
   "value": 0.6,
   "unit": "s",
   "purpose": "Z2 debris life.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.boomFrom",
   "value": 200,
   "unit": "Hz",
   "purpose": "Z2 low boom start.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.boomTo",
   "value": 40,
   "unit": "Hz",
   "purpose": "Z2 low boom end.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.boomSeconds",
   "value": 0.35,
   "unit": "s",
   "purpose": "Z2 boom length.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.z2.boomGain",
   "value": 0.24,
   "unit": "gain",
   "purpose": "Z2 boom gain, under the clamp.",
   "sources": [
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.writeoff.shakeAmp",
   "value": 13,
   "unit": "canvas units",
   "purpose": "Write-off from a drop shakes harder.",
   "sources": [
    "JUICE#J3",
    "EDIT44#8.3"
   ]
  },
  {
   "id": "proto.drops.writeoff.shakeSeconds",
   "value": 0.6,
   "unit": "s",
   "purpose": "Write-off shake length.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.smokeCount",
   "value": 6,
   "unit": "count",
   "purpose": "Smoke from the crushed roof.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.smokeSpeed",
   "value": 30,
   "unit": "world units/s",
   "purpose": "Smoke drift speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.debrisCount",
   "value": 6,
   "unit": "count",
   "purpose": "Roof panels thrown clear.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.debrisSpeed",
   "value": 120,
   "unit": "world units/s",
   "purpose": "Panel speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.crushFrom",
   "value": 180,
   "unit": "Hz",
   "purpose": "Crush tone start.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.crushTo",
   "value": 40,
   "unit": "Hz",
   "purpose": "Crush tone end.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.crushSeconds",
   "value": 0.5,
   "unit": "s",
   "purpose": "Crush tone length.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.drops.writeoff.crushGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Crush tone gain.",
   "sources": [
    "JUICE#J3"
   ]
  }
 ],
 "layers": [
  {
   "event": "deck-drop",
   "when": {},
   "scale": {
    "by": "h",
    "full": "world.highHeight"
   },
   "shake": null,
   "zoom": {
    "amount": [
     "proto.drops.step.zoomMin",
     "proto.drops.step.zoomMax"
    ],
    "seconds": [
     "world.dropSeconds",
     "proto.drops.step.fallSecondsMax"
    ]
   },
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": {
    "count": [
     "proto.drops.step.streakCountMin",
     "proto.drops.step.streakCountMax"
    ],
    "length": [
     "proto.drops.step.streakLenMin",
     "proto.drops.step.streakLenMax"
    ],
    "seconds": "proto.drops.step.streakSeconds",
    "role": "structure"
   },
   "particles": [
    {
     "type": "dust",
     "count": [
      "proto.drops.step.dustCountMin",
      "proto.drops.step.dustCountMax"
     ],
     "speed": "proto.hits.knock.dustSpeed",
     "life": "proto.hits.knock.dustLife",
     "size": "proto.hits.knock.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "tone",
    "from": [
     "proto.drops.step.whistleFromMin",
     "proto.drops.step.whistleFromMax"
    ],
    "to": [
     "proto.drops.step.whistleToMin",
     "proto.drops.step.whistleToMax"
    ],
    "seconds": [
     "world.dropSeconds",
     "proto.drops.step.fallSecondsMax"
    ],
    "gain": "proto.drops.step.whistleGain",
    "wave": "sine"
   },
   "reference": "Juice It or Lose It: sound on every action, speed lines",
   "sources": [
    "EDIT44#5.2",
    "EDIT44#4.1",
    "JUICE#J2",
    "EDIT26#5.5"
   ]
  },
  {
   "event": "land",
   "when": {
    "car": null
   },
   "scale": {
    "by": "h",
    "full": "world.highHeight"
   },
   "shake": {
    "amp": [
     "proto.drops.land.shakeAmpMin",
     "proto.drops.land.shakeAmpMax"
    ],
    "seconds": [
     "proto.drops.land.shakeSecondsMin",
     "proto.drops.land.shakeSecondsMax"
    ]
   },
   "zoom": {
    "amount": [
     "proto.drops.land.zoomMin",
     "proto.drops.land.zoomMax"
    ],
    "seconds": "proto.drops.land.zoomSeconds"
   },
   "flash": null,
   "crumple": {
    "amount": [
     "proto.drops.land.crumpleMin",
     "proto.drops.land.crumpleMax"
    ],
    "seconds": "proto.drops.land.crumpleSeconds"
   },
   "stumble": {
    "amp": [
     "proto.drops.land.stumbleMin",
     "proto.drops.land.stumbleMax"
    ],
    "seconds": "movement.lungeRecovery"
   },
   "ring": {
    "radius": [
     "proto.drops.land.ringRadiusMin",
     "proto.drops.land.ringRadiusMax"
    ],
    "seconds": "proto.drops.land.ringSeconds",
    "width": "proto.hits.impact.ringWidth",
    "role": "grid"
   },
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "dust",
     "count": [
      "proto.drops.land.dustCountMin",
      "proto.drops.land.dustCountMax"
     ],
     "speed": [
      "proto.drops.land.dustSpeedMin",
      "proto.drops.land.dustSpeedMax"
     ],
     "life": [
      "proto.drops.land.dustLifeMin",
      "proto.drops.land.dustLifeMax"
     ],
     "size": [
      "proto.hits.knock.dustSize",
      "proto.hits.stopped.dustSize"
     ],
     "role": "structure",
     "dir": "random",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "tone",
    "from": [
     "proto.drops.land.thudFromSmall",
     "proto.drops.land.thudFromFull"
    ],
    "to": [
     "proto.drops.land.thudToSmall",
     "proto.drops.land.thudToFull"
    ],
    "seconds": [
     "proto.drops.land.thudSecondsSmall",
     "proto.drops.land.thudSecondsFull"
    ],
    "gain": [
     "proto.drops.land.thudGainSmall",
     "proto.drops.land.thudGainFull"
    ],
    "wave": "sine"
   },
   "reference": "Art of Screenshake: shake scaled to impact, plus dust plumes",
   "sources": [
    "EDIT44#5.2",
    "EDIT44#4.1",
    "JUICE#J2",
    "JUICE#J1"
   ]
  },
  {
   "event": "impact",
   "when": {
    "drop": true
   },
   "scale": null,
   "shake": {
    "amp": "proto.drops.hit.shakeAmp",
    "seconds": "proto.drops.hit.shakeSeconds"
   },
   "zoom": {
    "amount": "proto.drops.hit.zoom",
    "seconds": "proto.drops.hit.zoomSeconds"
   },
   "flash": null,
   "crumple": {
    "amount": "proto.drops.hit.crumple",
    "seconds": "proto.drops.hit.crumpleSeconds"
   },
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "dust",
     "count": "proto.drops.hit.dustCount",
     "speed": "proto.drops.hit.dustSpeed",
     "life": "proto.drops.hit.dustLife",
     "size": "proto.hits.stopped.dustSize",
     "role": "structure",
     "dir": "away",
     "at": "car"
    }
   ],
   "sound": {
    "type": "tone",
    "from": "proto.drops.hit.boomFrom",
    "to": "proto.drops.hit.boomTo",
    "seconds": "proto.drops.hit.boomSeconds",
    "gain": "proto.drops.hit.boomGain",
    "wave": "sine"
   },
   "reference": "Art of Screenshake: camera kick and impact effects, downward",
   "sources": [
    "EDIT44#8.3",
    "EDIT42#8.3",
    "JUICE#J2"
   ]
  },
  {
   "event": "impact",
   "when": {
    "dropZ": 2
   },
   "scale": null,
   "shake": {
    "amp": "proto.drops.z2.shakeAmp",
    "seconds": "proto.drops.z2.shakeSeconds"
   },
   "zoom": {
    "amount": "proto.drops.z2.zoom",
    "seconds": "proto.drops.z2.zoomSeconds"
   },
   "flash": "proto.hits.big.flashSeconds",
   "crumple": {
    "amount": "proto.drops.z2.crumple",
    "seconds": "proto.drops.z2.crumpleSeconds"
   },
   "stumble": null,
   "ring": {
    "radius": "proto.drops.z2.ringRadius",
    "seconds": "proto.drops.z2.ringSeconds",
    "width": "proto.drops.z2.ringWidth",
    "role": "structure"
   },
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "debris",
     "count": "proto.drops.z2.debrisCount",
     "speed": "proto.drops.z2.debrisSpeed",
     "life": "proto.drops.z2.debrisLife",
     "size": "proto.hits.lunging.debrisSize",
     "role": "structure",
     "dir": "random",
     "at": "contact"
    }
   ],
   "sound": {
    "type": "tone",
    "from": "proto.drops.z2.boomFrom",
    "to": "proto.drops.z2.boomTo",
    "seconds": "proto.drops.z2.boomSeconds",
    "gain": "proto.drops.z2.boomGain",
    "wave": "triangle"
   },
   "reference": "Art of Screenshake: bigger hit, bigger shake, debris",
   "sources": [
    "EDIT44#8.3",
    "EDIT44#5.2",
    "JUICE#J2"
   ]
  },
  {
   "event": "writeoff",
   "when": {
    "drop": true
   },
   "scale": null,
   "shake": {
    "amp": "proto.drops.writeoff.shakeAmp",
    "seconds": "proto.drops.writeoff.shakeSeconds"
   },
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "smoke",
     "count": "proto.drops.writeoff.smokeCount",
     "speed": "proto.drops.writeoff.smokeSpeed",
     "life": "proto.hits.writeoff.smokeLife",
     "size": "proto.hits.writeoff.smokeSize",
     "role": "fleet",
     "dir": "random",
     "at": "car"
    },
    {
     "type": "debris",
     "count": "proto.drops.writeoff.debrisCount",
     "speed": "proto.drops.writeoff.debrisSpeed",
     "life": "proto.hits.writeoff.debrisLife",
     "size": "proto.hits.writeoff.debrisSize",
     "role": "structure",
     "dir": "away",
     "at": "car"
    }
   ],
   "sound": {
    "type": "tone",
    "from": "proto.drops.writeoff.crushFrom",
    "to": "proto.drops.writeoff.crushTo",
    "seconds": "proto.drops.writeoff.crushSeconds",
    "gain": "proto.drops.writeoff.crushGain",
    "wave": "sawtooth"
   },
   "reference": "Wreck permanence and heavy shake: a crushed roof",
   "sources": [
    "JUICE#J3",
    "EDIT44#8.3",
    "JUICE#J1"
   ]
  }
 ]
}