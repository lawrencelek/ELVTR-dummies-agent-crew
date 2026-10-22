# DUMMIES — GDD Edit 39: cyber canon, lore system, fleet voice, city density, dash

**20 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§3.1, 4.1.1, 4.2.3, 5.2, 5.4, 6.1, 6.6, 7.1, 7.9, 11.3, 12 and 13.2, after Edits 37–38.

- **Build:** P3, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 48/48 · `python3 content/db/check_lore.py` 0 errors.
- **Database:** `content/db/fleet.json` (32 models, 123 lines). **Registry:** `tuning.parameters.json` `edit39-2026-10-20`.
- **Decision log:** rows 112–123; open D18, D24–D26.

## Decisions

| # | Decision | Status |
|---|---|---|
| 112 | Two dash charges; battery limit kept; leg damage shortens the dash | user-confirmed; loss rate proposed |
| 113 | Sinofuturist cyber is canon; day and night stay as options | user-confirmed |
| 114 | Lore consistency system tied to upgrade state and vehicle behaviour | user-confirmed; system proposed |
| 115 | Wear and body-part damage carry the dummy's state | user-confirmed |
| 116 | Upgrades remain; hits never remove them | user-confirmed |
| 117 | Model names and barks in a new database | user-confirmed; content proposed |
| 118 | Buildings ~25% of each level; barriers ~5–10% of the road edge | user-confirmed; reading proposed |
| 119 | Barks return as pixel bubbles | user-confirmed; form proposed |
| 120 | Vehicle tags at 50% size | user-confirmed |
| 121 | Exhibition hardware: Windows 11 gaming laptop, for now | user-confirmed |
| 122 | Registry takes Edits 37–39 | user-confirmed |
| 123 | Tags: class letter plus tier | proposed |

## 3.1 World and lore (rule added)

```markdown
- **Lore follows state.** A line may only say what the game state guarantees at that moment (6.6.1).
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE (§1). The cyber look is a visual register, not a second city (D25).
```

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

## 4.2.3 Legibility budget (rows changed)

```markdown
Exhibition hardware: a Windows 11 gaming laptop (decision 121). Viewing distance about 0.6 m. 1920 × 1080 draws the 640 × 360 screen at ×3.

| Class | Parameter | Cap height | Use |
|---|---|---|---|
| Load-bearing | `ui.typeLoadBearing` | 24 units | HUD readouts |
| Field label | `ui.typeFieldLabel` | 12 units | Model tags, bark text: a 6-art-px pixel face |
| Secondary | `ui.typeSecondary` | 16 units | Frame labels |
```

## 5.2 Lunge (row replaced)

```markdown
| Fixed distance, shrinking with leg damage to a floor. With part effects off, total wear shortens it | `movement.lungeDistance`, `proto.parts.legDashLoss`, `movement.wearFloor` | Built (P3) |
```

## 5.4 Battery (value changed)

```markdown
- `battery.capacity` = 2 charge (Two dashes before waiting, D19)
```

## 6.1 Classes and identity (roster added)

```markdown
**Tags.** Class letter plus tier: Sedan S, Sports R, SUV U, Hatchback H, Wagon W, Police P, Van V, Bus B. `S01` is SED-01.

**Lines.** Product family plus tier suffix (Imperial, Office, Everyday, Basic).

| Class | Family | 01 Luxury | 02 Corporate | 03 Consumer | 04 Budget |
|---|---|---|---|---|---|
| Sports | Comet | Aurum | Deadline | Sprinter | Rattle |
| Wagon | Harbour | Heirloom | Carepath | Schoolrun | Boot Sale |
| SUV | Bastion | Envoy | Surveyor | Weekend | Bouncer |
| Hatchback | Pebble | Petite | Hotdesk | Noodle | Scrapper |
| Sedan | Meridian | Ambassador | Commuter | Fare | Hustle |
| Police | Warden | Marshal | Citation | Night Beat | Clamp |
| Van | Porter | Concierge | Waybill | Laundry | Bodge |
| Bus | Commons | Gala | Line 7 | Last Orders | Rust Bucket |

Callsigns name model 001 of each type-tier. Jobs and temperaments live in `content/db/fleet.json`. P3 runs SED-01-001 and VAN-02-001.
```

## 6.6 Voice (rules added)

```markdown
- **Barks return** (decision 119). Pixel bubbles in the field label face, ≤ 48 characters.
- **Placement.** Above the car's tag, else below the car. Never over a tag, a car or the dummy.
- **Styles.** Speech: solid edge. Shout: double edge. Mutter: dashed edge. Thought: dotted edge, trailing dots.
- **Selection.** Highest priority, then most specific line; no line twice on screen. Timing: `proto.barks.seconds`, `proto.barks.cooldown`, `proto.barks.carCooldown`, `proto.barks.maxOnScreen`.
- **Noticing.** A car that notices the dummy names a new module or a broken part. A model that learned says so when it returns.

#### 6.6.1 Lore consistency system (decision 114)

Lore is tied to state: the dummy's upgrades and damage, and the vehicle's behaviour.

- **One database.** `content/db/fleet.json`: canon, classes, tiers, models, state vocabularies, lines.
- **Lines carry conditions.** Car: `model`, `tier`, `class`, `seniority`, `mood`. Dummy: `owns`, `broken`, `wear`. Event fields per event.
- **Lines carry claims.** Each fact a line asserts is a claim: `node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`.
- **The check** (`check_lore.py`) fails the build when:
  - a claim is not guaranteed by the line's conditions;
  - text asserts a fact (an upgrade, a broken part, seniority, a callsign) without the claim;
  - a banned term or a non-canon city appears;
  - a tier lacks impact, write-off, near-miss or miss lines; a node or part lacks a line; an event lacks a neutral fallback;
  - the roster breaks: 32 type-tiers, unique ids, tags, callsigns; temperament matches tier.
- **Later.** RPG elements and a scrollable city extend the same tables (D24).
```

## 7.1 Canvas (open question added)

```markdown
**Map structure (Open, D24).** Today every level is one static screen. Candidates:

| Option | Keeps "whole level visible" | Exploration | Cost |
|---|---|---|---|
| Static (today) | Yes | None | — |
| Zelda-style screens, 3 × 3 per level | Yes, per screen | High: districts linked at the edges | Cross-screen traffic, edge cues, one sim per district |
| Continuous scroll (GTA 1) | No: cars arrive from off-screen | High | Camera rules, off-screen threat cues; voids 7.1's reason |

Recommended: Zelda-style. Each screen stays a full 800 × 600 play area.
```

## 7.9 Level contract (clause 6 replaced)

```markdown
6. **Occlusion.** City blocks cover about 25% of the play area; static solids stay within `world.occludedFractionMax` (0.30).
   Jersey barriers line 5–10% of the road edge. Blocks stand off the road band, with alleys of at least `world.pedestrianGap`.
```

## 11.3 Rules for the data (surfaces answered, D18)

```markdown
- **Surfaces are layered.** Each tile has one ground (tarmac, deck, pavement). Patches paint over it in order: oil, water, puddle, gravel.
- `World.surfaceAt` returns the top layer. A spill is a patch, not a tile type, so it can be placed, moved or cleaned.
```

## 12 Hardware

```markdown
- **Exhibition build:** Windows 11 gaming laptop (decision 121). Browser, full screen, keyboard or gamepad.
- **Offline:** embed B612 and Nunito; no network at the stand.
```

## 13.2 Still unspecified (rows closed)

```markdown
- ~~Model names and bark content~~ → `content/db/fleet.json` (decision 117).
- ~~The exhibition cabinet~~ → Windows 11 gaming laptop, for now (decision 121).
- Per-level layout geometry: city v2 is generated (`prototypes/p3/tools/city_gen.js`); level design needs a focused pass.
```

## Registry changes (`edit39-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `battery.capacity` | 3 → 2 | charge | author-decided |
| `perception.reactionDelay` | 0.15 → 0.3 | s | author-decided (P2.2) |
| `world.occludedFractionMax` | 0.25 → 0.30 | ratio | Proposed |
| `ui.artScale` | Added | 2 | author-decided |
| `ui.typeFieldLabel` | Added | 12 units | author-decided |
| `proto.parts.legDashLoss` | Added | 1.5 | author-decided (D19); value Proposed |
| `proto.city`, `proto.art.extrusion`, `proto.stopCue`, `proto.driver.coveredReaction` | Added (prototype group) | 1, 0.3, 1, 0.18 | per Edits 37–38 |
| `proto.parts.*` (13 more) | Added (prototype group) | Edit 38 §5.7 | Proposed |
| `proto.barks.seconds`, `.cooldown`, `.carCooldown`, `.maxOnScreen` | Added (prototype group) | 2.4, 0.8, 4, 3 | Proposed |
| `tables.palette` | Cyber canonical, day option; lab roles retired | 67 rows | Proposed |
| `tables.terrain` | `block` (band 4), `jersey` (band 2) | structure | Proposed |

## Open items

- **D18 build timing.** Layered surfaces recommended; oil and water not built.
- **D24 map structure.** Zelda-style 3 × 3 recommended; a large change to traffic and levels.
- **D25 setting city.** Shenzhen per §1; Chongqing as visual reference only?
- **D26 Big battery.** `upgrades.bigCapacity` 5 against a base of 2.
- **Level design.** City v2 is generated. Roads need authored landmarks, sightlines and ambush routes.
- **Moods.** Lines exist; the P3 sim does not assign moods yet.
- **Not playtested.** Barks, tags at 50% and two dashes are designer-checked only.
