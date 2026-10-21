# DUMMIES — GDD Edit 38: P3 grid, HUD, solid city, part damage

**20 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.1, 4.5, 5.7 and 7.4, after Edit 37. Values Proposed unless marked.

- **Build:** P3, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 47/47 · notes in `DUMMIES_P3_Prototype.md`.
- **Mockups:** DUMMIES 16-bit Aero canvas — https://claude.ai/artifact/CaKB5nrST982KXuZzSzS1g (rows Draft, Night, Cyber, HUD v3).
- **Decision log:** rows 92–111, open D18–D23.

## Decisions

| # | Decision | Status |
|---|---|---|
| 92 | Screen 640 × 360 art px. Field 400 × 300. `ui.artScale` 2 | user-confirmed |
| 93 | Essentials-only HUD; type at registry sizes | user-confirmed |
| 94 | Night and cyber palettes as load-time options | user-requested; option, not canon |
| 95 | Cyber field: city blocks and jersey barriers replace lawns and trees | user-requested |
| 96 | Fix A: blocks and barriers are solid statics in every palette | user-confirmed |
| 97 | The lunge is DASH on screen; IDs keep `movement.lunge*` | user-confirmed; IDs proposed |
| 98 | HUD v3: top bar, health left, chassis doll right | user-confirmed in outline |
| 99 | Each hit lands on one body part; the doll shows it | user-confirmed in kind; mapping proposed |
| 100 | Damaged parts cut that part's ability | user-confirmed; values proposed |
| 101 | Dark-ground rim outline for the dummy | proposed |
| 102 | Barks off in the P3 field | proposed |
| 103 | X-ray pass for occluded actors | proposed |
| 104 | Level generation parked; three static roads stay | user-confirmed |
| 105 | The HUD chassis is drawn at native art resolution, never upscaled | user-confirmed |
| 106 | A cute, appealing dummy after the real one: eyes, brows, ears | user-confirmed; face design proposed |
| 107 | Each of the 15 nodes has a visible component on the chassis | user-confirmed; designs proposed |
| 108 | The shop tries the selected node on the chassis | proposed |
| 109 | Cyberpunk scheme is the build default; day and night are options | user-directed; canon open (D22) |
| 110 | No black sprite edge on dark ground; rims in a value hierarchy | user-directed; values proposed |
| 111 | Chassis Legs follows V29: Spring start → Jump, Grip | proposed (corrects 107's draft) |

## 4.1.2 The dummy is the exception (replaces the "Always outlined" bullet)

```markdown
- **Always outlined.** Day: the 1-art-px `dummy.joint` outline carries it (9.5:1).
- **Dark ground (cyber, night):** no sprite edge is black. The background owns the darkest values.
  - Every sprite's outer silhouette pixels take a rim.
  - Edges facing the sun (up, right) take the light rim. Others take the dark rim.
  - Inner lines keep their inks. Joints stay `dummy.joint`.
  - Rim value follows importance: dummy > cars > cones > jersey barriers > pods > blocks.
- **The doll obeys the same rule** (4.5.1). A broken part's outline takes `cue.warning`.
```

## 4.1.3 Material rules (replaces the "Pixel grid" bullet)

```markdown
- **Pixel grid:** one art pixel = `ui.artScale` screen units. Field art is `ui.playWidth` ÷ `ui.artScale` by `ui.playHeight` ÷ `ui.artScale` (400 × 300).
- **Screen:** 640 × 360 art px. Side columns `ui.sideColumn` ÷ `ui.artScale` (120). Strips `ui.horizontalStrip` ÷ `ui.artScale` (30).
- **Device scale:** whole multiples of 640 × 360 only. 720p ×2, 1080p ×3, 1440p ×4, 4K ×6.
- **Sprite height:** drawn as a screen-up offset of height × `proto.art.extrusion` ÷ `ui.artScale`.
```

## 4.1.4 Palette (rows added)

```markdown
| `dummy.rimLight`, `dummy.rimDark` | `#E6F4FF`, `#5E7080` | Play | Dummy rim. Dark palettes only. 14.2:1 on road |
| `fleet.rim`, `fleet.rimD` | `#8FDFFF`, `#3A4A66` | Play | Car rim. 10.7:1 |
| `prop.coneRim`, `prop.coneRimD` | `#F2A65A`, `#7A4420` | Play | Cone rim. 7.9:1 |
| `structure.jerseyRim`, `structure.jerseyRimD` | `#8494B8`, `#2C3550` | Play | Jersey barrier rim. 5.2:1 |
| `structure.podRim`, `structure.podRimD` | `#5B6E9C`, `#262F48` | Play | Pod rim. 3.1:1 |
| `structure.bldgRim`, `structure.bldgRimD` | `#46557D`, `#1E263B` | Play | City block rim. 2.2:1 |
```

Contrast is the light rim against `field.road` night `#1E222C`. Every rim is lighter than road, deck and pavement.

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

## 4.1.4 Palette (frame rows added)

```markdown
| `chassis.chrome`, `chassis.chromeL`, `chassis.chromeD` | `#B9C3CA`, `#F4F7F9`, `#6E7C87` | Frame | Doll joints |
| `chassis.mod`, `chassis.modL`, `chassis.modD` | `#4FC3E8`, `#BDEBFA`, `#1E8FB8` | Frame | Module components. Dark: `#3FD0FF`, `#B6F0FF`, `#1A6FA0` |
| `chassis.modGlow` | `#E8FAFF` | Frame | Module LEDs. Dark: `#FF5FD2` |

Dark chrome: `#7D8AA3`, `#D6F6FF`, `#353D52` (gunmetal).
```

## Field sprite (4.1.2, added)

```markdown
- **The field dummy has a face.** Two eye pixels and ear nubs facing south. One eye in profile.
```

## 4.5 HUD layout (replaces module placement; V29 D10.5 module list kept)

```markdown
| Place | Module | Shows |
|---|---|---|
| Top strip | CONTRACT · RECORD · SHIFT | Road · WRITE-OFFS n / quota · POINTS · CARS LEFT |
| Left column | BODY · CHARGE | Health at 48 px with bar · DASH blocks |
| Right column | BODY (parts) | Chassis doll (4.5.1) · LAST HIT part and loss · cut abilities |
| Bottom strip | Controls | Actions available now |

- **Health first.** BODY is the largest readout.
- **CARS LEFT is the shift clock.** No separate timer.
- **Credits leave the play HUD.** Report and shop show the balance.
- **FLEET leaves the HUD.** Field tags carry identity (4.2.2).
- **Barks off in the field.** A `ui.typeSecondary` bubble covers play. Events still log (D9.3).
- **On-screen name: DASH.** `movement.lunge*` and `battery.lungeCost` keep their IDs.
- **Doll states:** dented on any loss; cracked at `proto.parts.crackedShare`; broken at `proto.parts.brokenShare`. The hit part flashes.
- **Modules** show as components on the doll (4.5.1).
```

## 4.5.1 Chassis doll (new)

```markdown
#### 4.5.1 Chassis doll

- **Native resolution.** 64 × 108 art px at `ui.artScale`, on the field's grid. Never upscaled.
- **After the real dummy, made appealing.** Glossy `dummy.body`. Dot eyes with a glint. Arched brows. A small smile.
- **Ears show,** each with a quartered decal. Chrome collar, elbows, wrists, knees, ankles. Black neck and lumbar joint.
- **Construction.** Shaded rounded boxes, one body part each. Sun top right: three tones plus one glint.
- **Edges.** Seams fall on the shape beneath. Outer edge: `dummy.joint`, or the rim on dark ground (4.1.2).
- **Damage (5.7).** Worn tint and dents on any loss. Cracks at `proto.parts.crackedShare`. Warning outline at `proto.parts.brokenShare`.
- **Modules.** Every node has one component on its branch's part, in the `mod` ramp. Owned nodes show.
- **Shop try-on.** The selected node blinks on before purchase.

| Branch | Tier 1 | Tier 2 | Tier 2 |
|---|---|---|---|
| Head | Wider view: goggles | Memory: crown cartridge | Ears: dish ears, antennae |
| Torso | Hips: swivel bearing | Spine: ribbed bellows | Neck: gimbal collar |
| Legs | Spring start: ankle coils | Jump: thigh pistons | Grip: tread soles, cleats |
| Arms | Carry: grip gloves | Throw: shoulder pistons | Hold on: forearm clamps |
| Battery | Big battery: five-cell chest pack | Kinetic charge: flank plates | Fast charge: belt port, plugged cable |
```

## 5.7 The body as data (replaces the *Built* line)

```markdown
*Built (P3).* A fresh body has `damage.bodyHealth`. Total wear shortens the dash to `movement.wearFloor`. Each hit also lands on one part. Damaged parts cut that part's statistic.

**Hit location** (Proposed)

- **Height from size.** Assessed damage below `proto.parts.torsoFrom` hits a leg. Below `proto.parts.headFrom` it hits the torso, or an arm when side-on. Above, the head.
- **Side from contact.** The contact point against facing picks left or right.
- **Ledger.** `body.parts` sums health lost per part. Health stays one pool.

**Part damage cuts abilities** (Proposed; toggle `proto.parts.effects`)

Share = part health lost ÷ `damage.bodyHealth`. Multiplier = max(floor, 1 − loss × share).

| Part | Statistic cut | Loss | Floor |
|---|---|---|---|
| Legs (L + R) | Ground speed: `movement.walkSpeed`, `movement.runSpeed`, `upgrades.carrySpeed` | `proto.parts.legSpeedLoss` | `proto.parts.legSpeedFloor` |
| Torso | Turn rate: `movement.turnRate`, `upgrades.hipsTurnRate` | `proto.parts.torsoTurnLoss` | `proto.parts.torsoTurnFloor` |
| Head | View cone: `sensing.coneWidth` | `proto.parts.headConeLoss` | `proto.parts.headConeFloor` |
| Arms (L + R) | Throw: `upgrades.throwDistance` | `proto.parts.armThrowLoss` | `proto.parts.armThrowFloor` |

- **Both arms broken:** no cone pickup. One working arm still carries.
- **Battery has no part.** Charge never falls with damage.
- **Upgrades scale, never repair.** A damaged Hips still out-turns a damaged stock torso. No node restores a part (decision 53).
- **A new chassis resets every part.**
- **The chassis panel lists each cut ability** in `cue.warning`: SPEED %, TURN %, VIEW °, THROW %, CONE NO GRIP.
- **Example (health 300):** 75 lost to the legs → speed 75%. 40 lost to the head → cone 72°.
```

## 7.4 Static structures (rows and rules added)

```markdown
| `block` | City block | 4 | blocked | blocked |
| `jersey` | Jersey barrier | 2 | blocked | blocked |

- **Gate:** `proto.city`. 0 restores the P2.2 roads.
- **Blocks:** off the road band (pavement + 30 units). ≥ 44 units apart. Flush to an edge or ≥ 44 clear of it.
- **Height draws only.** 60–140 units per block. Collision is the footprint.
- **Jersey barriers:** 44 × 8 units, 4 units off the pavement, straight stretches only, ≥ 60 apart.
- **Occluders.** Both cast sensor shadows. Cars never swerve into them.
- **Clause 4 checked.** Flood fill: every open spot reaches a spawn; the road is reachable.
- **X-ray pass.** An occluded car or dummy shows as a checker of its own pixels.
```

## Registry changes

| ID | Change | Value | Status |
|---|---|---|---|
| `ui.artScale` | 3 → 2 | screen units per art pixel | user-confirmed (640 × 360) |
| `palette.dummy.rimLight`, `palette.dummy.rimDark` | Added | `#E6F4FF`, `#5E7080` | Proposed |
| `palette.chassis.chrome*`, `palette.chassis.mod*`, `palette.chassis.modGlow` | Added | 4.1.4 frame rows | Proposed |
| `palette.fleet.rim*`, `palette.prop.coneRim*`, `palette.structure.*Rim*` | Added | 4.1.4 play rows | Proposed |
| `proto.art.extrusion` | Added | 0.3 ratio | Proposed |
| `proto.city` | Added | 1 flag | Proposed (Fix A user-confirmed) |
| `proto.parts.torsoFrom`, `proto.parts.headFrom` | Added | 100, 250 damage | Proposed |
| `proto.parts.crackedShare`, `proto.parts.brokenShare` | Added | 0.2, 0.4 ratio | Proposed |
| `proto.parts.effects` | Added | 1 flag | Proposed |
| `proto.parts.legSpeedLoss`, `proto.parts.legSpeedFloor` | Added | 1, 0.5 ratio | Proposed |
| `proto.parts.torsoTurnLoss`, `proto.parts.torsoTurnFloor` | Added | 1.5, 0.5 ratio | Proposed |
| `proto.parts.headConeLoss`, `proto.parts.headConeFloor` | Added | 1.5, 0.5 ratio | Proposed |
| `proto.parts.armThrowLoss`, `proto.parts.armThrowFloor` | Added | 1, 0.5 ratio | Proposed |

`proto.*` IDs stay prototype-only until promoted.

## Open items

- **Cover below clause 6.** Solids cover 8.0% (L1), 7.3% (L2), 5.5% (L3). 7.9 asks for ≥ 0.10. Add cover or declare the exemption.
- **Registry file lags.** `tuning.parameters.json` is still `edit26-2026-10-13`. Edit 37 and 38 rows are not merged.
- **Part thresholds are absolute.** `proto.parts.headFrom` 250 exceeds Fragile health (200). Consider shares of `damage.bodyHealth`.
- **Dash and parts.** Dash reach follows total wear, not the legs. Decide whether legs own it (D19).
- **Not playtested.** Rim, part effects and HUD v3 are designer-checked only.
- **Open decisions:** D18 surfaces, D19 dash limits, D20 dummy states, D21 modules knocked off, D22 cyber canon, D23 lore consistency.
