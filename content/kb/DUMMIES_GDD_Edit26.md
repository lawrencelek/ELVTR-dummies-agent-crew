# DUMMIES Game Design Document

**GDD_Edit_V26** · Lawrence Lek

Game design, systems, balance and build plan in one reference. For design discussion, playtesting and implementation.

**Structure.** One section per entity. The player (5), the fleet (6) and the world (7) each answer the same four questions in order: who it is, how it moves, what it senses, how it changes. Contact between player and fleet is section 8.

**Two markers only.** Unmarked text is the design. **(Proposed)** means not approved — do not implement. **(Built)** means already in the vertical slice; changing it costs rework. Every R- and D- reference resolves in section 13.

## Contents

1. [The Game](#1-the-game)
2. [Design Pillars](#2-design-pillars)
3. [Setting and Fiction](#3-setting-and-fiction)
4. [Presentation](#4-presentation)
5. [The Player Character](#5-the-player-character)
6. [The Fleet](#6-the-fleet)
7. [Levels and Environment](#7-levels-and-environment)
8. [Impact and Scoring](#8-impact-and-scoring)
9. [Economy and Upgrades](#9-economy-and-upgrades)
10. [The Run](#10-the-run)
11. [Game Data](#11-game-data)
12. [Production and Delivery](#12-production-and-delivery)
13. [Decisions](#13-decisions)

## 1 The Game

**DUMMIES is a single-player, top-down 2D game about a crash-test dummy that earns upgrades to move like a human, at the cost of destroying itself.**

- **The player.** Fifteen, at an exhibition, standing, friend shouting over their shoulder. Five minutes, no tutorial. Every decision here is tested under those conditions.
- **The premise.** You are a FARSIGHT crash-test dummy in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX. You buy your freedom by destroying your body.
- **The loop.** Observe self-driving cars. Bait and outsmart them. Lunge into their path. Damage earns points. Every destroyed body earns one credit. Credits buy upgrades that return the human body one part at a time — joints to move with, senses to read the road with.
- **The goal.** Destroyed bodies fill quotas and advance certification toward release.
- **The session.** 5 to 20 minutes. A brief control prompt, no tutorial, no network play.

## 2 Design Pillars

Each pillar carries a *fails if* clause. A pillar that cannot be failed is a slogan.

**1. There is always a way to outsmart the car.**

Every write-off is earned by reading and fooling a car, never by standing in front of one. A trick that stops working sends the player looking for a new one.

- *Fails if:* standing in a lane pays as well as baiting; a player cannot describe their best hit as a trick.
- *Measured by:* standing pays at most 150 against a sedan, baiting 300, ambush 500. A build fails if standing earns more than 45% of a full head-on lunge, or if baiting earns less than 1.5× standing. (Built.)
- *Not this pillar:* the no-upgrade completion guarantee, which is a validation requirement (7.9), not a design goal.

**2. The cars visibly learn, as individuals and as a fleet.**

Later vehicles respond to earlier collisions. Detection, route, commitment and braking each have a distinct cue, so a player can say why a car did what it did. Group behaviour emerges: giving way, queuing, swerves that set up the next car.

- *Fails if:* a player cannot explain a miss; a model's change in behaviour is indistinguishable from class, mood or seed.
- *Measured by:* a first-time player names a car that has beaten them twice, and describes what it started doing differently.

**3. You start by moving like a machine and end by moving like a human.**

*You are not buying freedom; you are buying degrees of freedom.* Each upgrade returns one human ability and one new way into a car's path. Every upgrade reads from above — position, facing, outline, movement, or markings on the ground. No upgrade adds health, armour or repair. You get better at reading the cars; they get better at reading you.

- *Fails if:* an upgrade is a statistic the player cannot name the use of; an upgrade is owned but invisible in play; the baseline is a chore rather than a character.
- *Measured by:* players name what each upgrade enabled; a watching friend can tell which freedoms the player has bought; they still spend bodies rather than protect them.

**4. Four satisfying time horizons.**

The game pays off at four scales, and every scale ends in a verdict the player can read.

| Horizon | Player time | What they get | Closure |
|---|---|---|---|
| **The attempt** | Under a minute | One lunge. A hit, or a miss that is funny | Immediate, in the body |
| **The body** | Five minutes | One or two write-offs and a first purchase | The report card, then a freedom bought |
| **The run** | 20–30 minutes | Three levels, a fleet that has learned you, a certification attempt | Licensed, Non-compliant or Decommissioned |
| **The pull** | Three hours and beyond | Different builds, the fleet known by name, the high score | They look the game up afterwards |

- *Fails if:* a horizon has no decision the player can name; a horizon ends without a verdict; a five-minute visit ends mid-body with nothing resolved.
- *Measured by:* a first-time player describes a choice at each horizon they reached; a five-minute visitor says how their run went unprompted; exit question — would you play this again somewhere else?
- *Not this pillar:* "easy to learn, hard to master", which is true of every game and decides nothing.

## 3 Setting and Fiction

### 3.1 World and lore

- A Sinofuturist universe where AI workers perform ridiculous jobs, comic and tragic at once.
- FARSIGHT sells a city without accidents. Your job is to cause them.
- The city is the crash lab. Shenzhen Smart City is filled with surveillance instruments and test markings.
- The cars want to qualify. You want to leave.
- FARSIGHT issues one modification credit per destroyed body, and approves modifications to widen test coverage: the fleet must be certified against more kinds of human behaviour.
- Damage is measured and recorded, but only a completed test is paid. The dummy uses each modification to leave sooner.
- Freedom is the promise behind certification, not a separate currency.

### 3.2 Voice and register

- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)

Bark design, report selection and the truthfulness rules are in 6.6.

### 3.3 Sound

- Factory hum, engines, synthetic music, clinical announcements.
- Distinct cues for misses, near misses, impacts, service and reports.
- The city sounds operational even when your body fails.
- Gameplay cues override ambience and always have visible equivalents.
- Text-first barks; recorded voices optional.
- The stiff body creaks and clanks. Each upgrade has its own sound. The battery has a low-charge cue and a refill tick. (Proposed)

## 4 Presentation

### 4.1 Style guide

#### 4.1.1 The register

**An urban crash lab, framed by a corporate interface.** Two layers, never mixed.

- **The play area is the city, instrumented.** Safety-white ground, calibration grid, numbered impact zones, high-vis markings, hazard stripes over ordinary streets. Flat silhouettes, hard edges. No gloss, no gradient, no translucency.
- **The frame is FARSIGHT's brand.** Frutiger Aero: glossy bevels, translucent panels, soft drop shadows, aqua highlights, rounded corners. Clean, friendly, optimistic.

**The cityscape is the crash lab.** Not a facility that imitates a city — a city built as an instrument. The calibration grid is painted on real roads. The surveillance is measurement. Every level is a testing ground and a place at the same time, and nothing marks the difference.

**The grid is not decoration.** The ground is numbered so the damage can be measured. Everything is scaled so the report card can state exactly where you were hit.

**The brand kills you politely.** The report card announcing your body's destruction uses the same aqua, rounded corners and friendly type as the main menu. The contradiction is never commented on.

One register throughout. Play, reports, menus and developer tools are the same terminal, differently framed.

#### 4.1.2 The dummy is the exception

- A real crash-test dummy: safety yellow body, black joint markers, calibration dots.
- The only saturated object on screen. Everything else is white, grey or glass.
- The only object with weight: dents, squash and stretch, a growing lean as it wears.
- The cars glide; the dummy flops. A sprite with mass against a flat diagram.

#### 4.1.3 Material rules

| Class | Layer | Drawn as | Edge | Fill |
|---|---|---|---|---|
| Lab floor | Play | Near-white field, calibration grid | None | Flat, ~94% value |
| Lane geometry | Play | Crisp markings, measurement scales | 1-unit hairline | None |
| Structure | Play | Extruded silhouette with a soft height shadow | 2-unit hard edge | Flat, banded by height |
| Vehicle | Play | Flat silhouette, tag above | 2-unit hard edge | Flat, mid-grey |
| The dummy | Play | Safety yellow, black joints, dents, lean | Soft, irregular | Shaded. The only saturated object |
| Hazard | Play | Yellow and black stripes, 4-unit lip | Lip highlight | Stripe pattern |
| Cue | Play | Reserved treatment (4.2.2) | Fixed weight | Fixed value |
| Chrome panel | Frame | Glossy bevel, translucent fill, soft shadow | 2-unit bevel | Vertical gradient |
| Chrome accent | Frame | Aqua highlight, specular sheen | — | Gradient |
| Texture | Frame | Micro-type, range marks, diagnostic runs | Hairline | Below legibility by design |

**Gloss never enters the play area.** No gradient, bevel, bloom or translucency is drawn inside `ui.playWidth` × `ui.playHeight`. The lab is matte.

#### 4.1.4 Palette

Placeholder values. Roles are fixed; hex is authored once and registered as data.

| Role | Placeholder | Layer | Use |
|---|---|---|---|
| `lab.floor` | `#EDF1F3` | Play | The calibration floor |
| `lab.grid` | `#D4DDE2` | Play | Measurement markings, scales |
| `structure` | `#B8C4CB` | Play | Barriers, walls, kerbs |
| `fleet` | `#7E8C96` | Play | Vehicles, lane geometry |
| `dummy.body` | `#F5C542` | Play | Safety yellow. The only saturated fill |
| `dummy.joint` | `#1A1D1F` | Play | Joint markers, calibration dots |
| `cue.primary` | `#101417` | Play | Tier-1 cues, dark on light |
| `cue.secondary` | `#4A5A66` | Play | Tier-2 cues |
| `cue.warning` | `#E4442E` | Play | Brake lights, commit ring, impact |
| `brand.aqua` | `#4FC3E8` | Frame | FARSIGHT's accent. Chrome and menus only |
| `brand.glass` | `#FFFFFF` at 18% | Frame | Translucent panel fill |
| `texture` | `#C3CDD3` | Frame | Tier-4 marks |

Cue contrast is dark-on-light. Tier-1 cues hold at least `ui.cueContrastTier1` against `lab.floor`; tier 2 holds `ui.cueContrastTier2`. Measured, not judged.

#### 4.1.5 References

| Reference | Take | Leave |
|---|---|---|
| Frutiger Aero — Windows Aero, Wii system menu, mid-2000s corporate tech marketing | Glossy bevels, translucency, aqua accent, rounded optimism. The brand's voice | Its wallpapers, bubbles and nature photography |
| Real crash-test facilities — Euro NCAP, IIHS footage | Calibration grids, high-vis markings, numbered impact zones, the dummy's yellow livery | Their documentary realism |
| Blackbox and Litestep desktop skins, 2001–2006 | Corner-anchored module stacks, bezel housings, micro-type as texture | Their darkness, which this register inverts |
| Hotline Miami | Top-down readability at speed; silhouette over detail | Its colour saturation and dark palette |
| Papers, Please | A diegetic terminal that is the whole interface, menus included | Its document-handling grammar |
| Mirror's Edge | Clean white world, saturated accent carrying meaning | Its first-person traversal |

Cyberpunk is tonal, not surface: Chinese signage, surveillance, grime at panel joints. System Shock, Beneath a Steel Sky, Blade Runner and Syndicate are mood ancestors only.

### 4.2 UI

#### 4.2.1 Screen layout

Canvas 1280 × 720 (16:9, exhibition hardware). Play area 800 × 600 (4:3), centred. The remainder is chrome, not letterbox.

```text
┌─────────────────────────────────────────────────────┐
│ TOP STRIP   1280 × 60    shift · traffic remaining  │
├───────────┬─────────────────────────────┬───────────┤
│ LEFT      │                             │ RIGHT     │
│ COLUMN    │        PLAY AREA            │ COLUMN    │
│ 240 × 600 │        800 × 600            │ 240 × 600 │
│           │                             │           │
│ BODY      │       the lab floor         │ FLEET     │
│ CHARGE    │                             │ CONTRACT  │
│ SERVICE   │                             │           │
├───────────┴─────────────────────────────┴───────────┤
│ BOTTOM STRIP 1280 × 60   points · credits · level   │
└─────────────────────────────────────────────────────┘
```

| Region | Size | Holds | Tier |
|---|---|---|---|
| Play area | 800 × 600 | The lab. Nothing else is drawn over it. No gloss enters it | 1, 2 |
| Left column | 240 × 600 | BODY, CHARGE, SERVICE | 1 |
| Right column | 240 × 600 | FLEET, CONTRACT | 2, 3 |
| Top strip | 1280 × 60 | FARSIGHT header, shift, traffic remaining | 3 |
| Bottom strip | 1280 × 60 | Points, credits in bodies, level name | 3 |

**Anchoring.** Every module anchors to its outer corner. Modules never float or recentre. The play area never resizes.

#### 4.2.2 The reserved cue set

Fifteen marks. Nothing else in the play area is load-bearing. Authored once, registered as data, never re-specified per level or screen.

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

**Texture type sits deliberately below the legibility threshold.** That is the authentic property of the reference desktops and it is also the test: a mark that must be read is load-bearing size; a mark that is atmosphere is texture size. There is no middle class.

#### 4.2.4 Information tiers

> **Every mark is either load-bearing or texture.** Load-bearing marks answer a question the player acts on and appear in 4.2.2. Texture never changes in response to gameplay state. A mark that changes meaningfully is load-bearing by definition, and must be promoted or removed.

**Tier 1 — Reflex.** Under half a second. Highest contrast, never occluded.

| The player asks | Cue | Status |
|---|---|---|
| Which way am I facing? | Nose vector. The lunge goes along the facing, never the pressed direction (5.2), so this is the most important mark on screen | Proposed |
| Can I lunge? | Battery glow, CHARGE module | Proposed |
| How close am I to a write-off? | Body silhouette: dents, lean. BODY module | Proposed |
| Has that car committed, and where? | Chevron, commit ring | Built / Proposed |
| Is it slowing? | Brake lights | Built |

**Tier 2 — Tactical.** Seconds, while planning an approach.

| The player asks | Cue | Status |
|---|---|---|
| Where are its blind spots? | Detection zone, side sensors, inside the view cone | Style Proposed |
| What can I resolve? | View cone aperture | — |
| Which car is this? | Model ID tag, seniority mark | — |
| What will stop or slip me? | Hazard edges, terrain fills (7.3) | Proposed |
| Where can I hide? | Crates, hedges, parked cars (7.6) | Proposed |
| Where are the ways through? | Barrier gaps, splitter islands (7.2) | Proposed |
| Am I carrying a cone? | Prop state | Proposed |

**Tier 3 — Between bodies.** Simulation frozen; density is allowed.

- Quota, certification progress, credits, points, traffic remaining, service used.
- The approach that caused this write-off, and what the responsible model learned (6.4). The one place fleet learning is stated outright rather than shown.
- Upgrade tree state: owned, affordable, locked (9.3).

**Tier 4 — Texture.** Range marks, grid rules, panel greebling, scrolling diagnostics, FARSIGHT signage. First to be cut if readability fails.

#### 4.2.5 Module inventory

| Module | Region | Contents | Updates |
|---|---|---|---|
| BODY | Left, top | Chassis bar, dent count, lean angle | Per impact |
| CHARGE | Left, middle | Battery segments, refill tick | Per tick |
| SERVICE | Left, bottom | Service used or available | Per body |
| FLEET | Right, top | Up to six recurring model IDs with seniority notches | Per appearance |
| CONTRACT | Right, bottom | Quota met against target, certification progress | Per write-off |
| SHIFT | Top strip | Level name, shift number, traffic remaining | Per spawn |
| RECORD | Bottom strip | Points, credits in bodies | Per impact, per write-off |

#### 4.2.6 Interface references

Read for interface grammar; visual references are in 4.1.5.

| Reference | Take | Leave |
|---|---|---|
| Metal Gear Solid detection cones and alert marker | One decisive mark the moment a car commits; state read from a single glyph | Its alert-phase escalation |
| Monaco, Door Kickers | Line-of-sight wedges drawn on the floor, not in the air | Their multi-agent selection UI |
| Frogger, Crossy Road | Lane-by-lane reading of approaching traffic at a glance | Their grid-step movement |
| Radial skill trees — 4X and roguelite tech wheels | Owned lit, affordable highlighted, locked dimmed | Their civ-game framing |

#### 4.2.7 Screens

| Screen | Treatment |
|---|---|
| HUD | The seven modules above, present throughout play |
| Report card | The same lab floor, paused and annotated: FARSIGHT replaying the collision that destroyed this body, in the brand's voice (8.6) |
| Upgrade screen | A radial tree, five branches, each forking once (9.3), as a FARSIGHT modification schematic. Prices in bodies |
| Shift analysis | CONTRACT module expanded to the full play area |
| Shell screens | MAIN MENU, PAUSE, SETTINGS, DEBUG, LIVE TUNING (12.4) as diagnostic panels. Developer tools are in-world, in the same register |
| High scores | The table as a FARSIGHT personnel record. Ten entries, three initials. Also the idle screen between visitors (9.5) |
| High-contrast mode | The same cue set with texture and chrome gloss suppressed, and cue contrast raised. An accessibility mode, not a second art style |
| Control prompt | A brief prompt, not a tutorial. Must make turning legible in one glance; 5.2 sets the gate |

#### 4.2.8 Decided and open

- **Current reach is never shown.** Damage shortens the lunge to `movement.wearFloor` (5.2), and cars learn clearance from the dummy's actual reach (5.6), but the player gets no readout of either. Wear reads through the body — dents, lean, a visibly shorter lunge. No arc, no range ring, no numeric readout. The screen is FARSIGHT's view of the world, not a service readout of the dummy's condition. If first-time players read a shortened lunge as input failure rather than wear, the fix is a clearer wear animation, not a gauge.
- **Vehicles are labelled.** Each appearance carries its model ID tag and a seniority mark (New, Practised, Experienced, Senior — 6.4) at tier 2, `ui.typeLoadBearing` cap height, never degraded by texture or noise. This promotes the register's own texture to load-bearing. Test: can a first-time player name a car that has beaten them twice?
- **Open.** The contrast ratios in 4.1.4 are targets, not measurements. Measure against the real palette before the art pass. Cues are dark-on-light; dark-ground figures do not carry over. Gate: 13.1.

**Parameters — interface**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `ui.playWidth` = 800 units (4:3 play area; equalises vertical and horizontal approach warning)
- `ui.playHeight` = 600 units (4:3 play area; equalises vertical and horizontal approach warning)
- `ui.sideColumn` = 240 units (Instrument column each side; wide enough to hold a module stack)
- `ui.horizontalStrip` = 60 units (Top and bottom strips; one row of load-bearing type plus bezel)
- `ui.typeLoadBearing` = 24 units (Cap height legible at 2 m, the exhibition viewing distance)
- `ui.typeSecondary` = 16 units (Legible at 1.5 m; labels only, never a tier-1 fact)
- `ui.typeTexture` = 9 units (Deliberately below the legibility threshold; atmosphere only)
- `ui.cueContrastTier1` = ×4.5 (Minimum contrast of a tier-1 cue against `lab.floor` at full texture density)
- `ui.cueContrastTier2` = ×3 (Minimum contrast of a tier-2 cue against `lab.floor` at full texture density)

### 4.3 In-game assets

Every asset is drawn in the register of 4.1 and read at the scale set by 7.1. Load-bearing marks are specified in 4.2.2; everything else is texture. This is the index; authority lives in each named section.

| Asset group | What it covers | Defined in |
|---|---|---|
| The dummy | Body, facing, states, damage, upgrade reads | 5.1, 5.2, 5.5 |
| Vehicles | Eight classes, four price tiers, model identity, liveries, dents | 6.1, 6.4 |
| Vehicle cues | Detection zone, chevron, commit ring, brake lights, model ID tag, seniority mark | 4.2.2, 6.3 |
| Dummy cues | Nose vector, view cone, battery glow, lunge streak, prop state | 4.2.2, 5.3, 5.4 |
| Terrain | Tarmac, pavement, kerb, grass, hedge, gravel, mud, puddle, oil, water, matting, impact plate, bumps | 7.3 |
| Structures | Crash barriers and their gaps, garden walls, walls, fences | 7.3, 7.7 |
| Props | Traffic cones (movable), crates (fixed) | 7.6 |
| Holes and gaps | Roadwork holes, open manholes, ditches, ponds | 7.3, 7.7 |
| Level dressing | FARSIGHT signage, surveillance, lane markings, splitter islands | 7.2 |
| Chrome | Instrument housings, readouts, panel frames | 4.2.1, 4.2.5 |

**Rules for assets** (Proposed). Every asset declares a height band (7.7) for art and a separate set of collision, hazard and occlusion flags (11.3) — the band never decides behaviour on its own. Higher bands cast longer shadows and carry heavier outlines; pits are dark with a visible lip. Anything that blocks a car's sensors must look like it does.
## 5 The Player Character

The dummy: who it is, how it moves, what it senses, what it spends, how it changes.

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

### 5.2 Controls and locomotion

The single home for how the player controls the dummy. No control mapping is stated anywhere else.

#### Steer-to-direction

Press a direction and the body turns toward it at `movement.turnRate`, then moves. Turning takes real time and is visibly animated: 45° costs one unit of time, 90° two, 180° four. While still coming into line the dummy moves at `movement.turningSpeedFraction` of normal speed. Full speed returns once facing is within `movement.alignThreshold`.

Input is immediate and means what it says. The cost is rotational inertia, not a learned grammar.

**Baseline controls**

| Input | Does | Notes |
|---|---|---|
| **Direction** | Turn toward the pressed direction and move | `movement.turnRate` sets the rotation. Inside `movement.alignThreshold` the dummy runs at full speed; beyond it, `movement.turningSpeedFraction` |
| **Direction, held** | Walk, building to a run | `movement.walkSpeed` → `movement.runSpeed` over `movement.rampSeconds` |
| **A (legs)** | Lunge straight ahead, along the current facing | Never along the pressed direction. With Jump, press again inside `upgrades.jumpWindow`. While holding on to a car, press to lunge off |
| **B (arms)** | Nothing until an Arms upgrade is owned | With Carry, pick up or drop a cone. With Throw, B while carrying throws it ahead. With Hold on, grab a car's side. Priority: held cone, then nearby cone, then car |

Two buttons. Print a leg icon and a hand icon rather than letters (Proposed), because A sits in different places on Xbox and Nintendo pads.

**What the baseline cannot do.** Turn instantly. Move at full speed while turning. Look one way while moving another. Start at speed. Change a lunge once committed. Hold footing on low grip. Each is returned by a named upgrade.

#### Why turning costs time

- **The lunge is the reason.** A lunge travels along the body's facing. Press toward a car and lunge immediately, and you lunge at where you *were* facing. Turning first is the skill.
- **The nose vector is tier 1** (4.2.2), so the cost is always visible.
- **Looking costs time.** The view cone points where the body faces (5.3). Rotational inertia makes that cost real rather than nominal.
- **It reads in ten seconds.** Directional input is the intended player's reflex. The stiffness is felt without being fought.

Three properties keep stiffness from reading as breakage: reduced speed while misaligned rather than arcing to an unintended place; the nose vector as a tier-1 cue; and proportional, visibly animated rotation.

#### Gate before the tree is built on it (Proposed, blocking)

Greybox the baseline alone, before any upgrade exists, and test with first-time players:

- Can they turn to face a chosen car and lunge at it within thirty seconds?
- Do they describe the dummy as stiff, or as broken?
- Does a failed lunge make them want another attempt?
- Can they read why a miss happened (pillar 2)?
- Is the greybox worth five minutes on the strength of the lunge alone?

If the dummy reads as broken, raise `movement.turnRate` and `movement.turningSpeedFraction` before changing the scheme.

#### How the dummy becomes human

Each upgrade returns one freedom. The ladder reads as a sentence: *turn faster, start instantly, look where you like, bend in flight, keep your footing.*

| Freedom returned | Upgrade | Branch | Effect |
|---|---|---|---|
| Turn at a human rate | **Hips** | Torso, tier 1 | `movement.turnRate` → `upgrades.hipsTurnRate` |
| Start without winding up | **Spring start** | Legs, tier 1 | `movement.rampSeconds` to zero |
| Look away from where you move | **Neck** | Torso, tier 2 | The view cone decouples from the facing |
| Change direction in flight | **Spine** | Torso, tier 2 | Bend a lunge within `upgrades.spineLimit` at `upgrades.spineRate` |
| Keep footing on slippery ground | **Grip** | Legs, tier 2 | No slide and no extended coast on puddles, diesel or gravel; deep water remains a gap |

With Hips, Spring start and Neck owned, the dummy moves and looks roughly the way a modern character does. That end state is the point: the player earns ordinary competence rather than starting with it.

**Targeting for Neck** (Proposed). Lock the nearest visible car when the cone decouples. Break distance ties by appearance ID. Retain the last facing if that car exits. Retarget on return to neutral, then new movement. No extra button. Playtest whether the automatic target is understandable before approving it.

#### Walking and running

| Rule | Parameter | Status |
|---|---|---|
| Walk, and run after a build-up | `movement.walkSpeed`, `movement.runSpeed`, `movement.rampSeconds` | Built |
| The build-up eases in, so the first steps feel heavy | — | Proposed |
| Speed is reduced while the body is still turning into line | `movement.turningSpeedFraction`, `movement.alignThreshold` | Proposed |
| Stopping coasts, and further on low grip (below) | `movement.stopSeconds`, `movement.lowGripStopMultiplier` | Proposed |
| Equal speed in all directions once aligned; no diagonal advantage | — | — |
| Terrain multiplies speed (7.3) | — | Proposed |

#### Stopping and drift

The dummy has mass. Releasing the direction does not stop it.

| Rule | Parameter |
|---|---|
| Release the input and the body coasts to rest, decaying from its current speed | `movement.stopSeconds` |
| Coast distance is about half the current speed across that time — at a full run, about three-quarters of a body width | `movement.runSpeed`, `movement.stopSeconds` |
| Low grip multiplies the coast. On the diesel spill at a run the dummy slides close to two body widths | `movement.lowGripStopMultiplier` |
| **Grip** (Legs, tier 2) removes the multiplier. The coast stays; only the slide goes | — |
| Terrain speed multipliers apply to the coast as they do to the run (7.3) | — |
| Coasting applies to ground movement only. A lunge ends in `movement.lungeRecovery`, not a coast | — |
| Pressing back shortens the coast. A press more than `movement.counterPressAngle` from the heading digs in instead of steering away | `movement.counterPressStop` |

**Pressing back is the brake.** There is no brake button — both are spoken for — so stopping is a direction, not a key. A press more than `movement.counterPressAngle` away from the current heading reads as digging in rather than steering: the coast shortens to `movement.counterPressStop`, and the body begins its turn at the same time.

That makes stopping and turning around the same input, and the turn is what it costs. A player who wants to stop dead must accept that they are now facing the other way — the same trade the lunge already asks for.

Low grip still applies. Digging in on the diesel spill shortens a longer coast, so **Grip** keeps its value.

**Turning while coasting is the interesting case.** Press a new direction mid-coast and the body begins turning at `movement.turnRate` while the coast continues along the old heading. A direction change therefore arcs. That arc is the cost of changing your mind, and it is the second place after the lunge where the body's stiffness is felt rather than described.

Watch in playtest: if players overshoot into traffic they had not chosen, the coast is too long and pillar 1 starts reading as drift rather than a read. Lower `movement.stopSeconds` before touching grip.

#### Turning

| Rule | Parameter | Status |
|---|---|---|
| The body turns toward the pressed direction at a fixed rate; Hips overrides it | `movement.turnRate`, `upgrades.hipsTurnRate` | Proposed |
| Rotation time is proportional: 45° one unit, 90° two, 180° four | `movement.turnRate` | — |
| Rotation reaches full rate after a short start-up | `movement.turnStartup` | Proposed |
| Inside the alignment threshold the dummy runs at full speed; beyond it, reduced | `movement.alignThreshold`, `movement.turningSpeedFraction` | Proposed |
| No turning during a lunge, until Spine | `upgrades.spineLimit` | — |
| Rotation is visibly animated. The cost must read as the body being stiff | — | — |

#### Lunge

| Rule | Parameter | Status |
|---|---|---|
| Fixed distance, shrinking with damage to a floor | `movement.lungeDistance`, `movement.wearFloor` | Built |
| Fixed duration, too short to abort | `movement.lungeDuration` | Built |
| Ease-out: fast start, soft finish, 70% of the distance in the first 0.1 s | — | Built |
| Travels along the current facing, never the pressed direction | — | — |
| No wind-up in play; a two-frame sprite squash only, so there is no input lag | — | Proposed |
| Recovery follows every lunge; speed eases back up from standstill | `movement.lungeRecovery` | Built |
| Impact pauses briefly | `feedback.hitStop` | Proposed |
| Costs battery | `battery.lungeCost` | Proposed |
| No steering, until Spine | `upgrades.spineLimit`, `upgrades.spineRate` | Rate Proposed |

#### Jump (numbers Proposed)

- **Rule.** Jump works like Zelda's Roc's Feather: the world is a flat grid. The jump clears floor gaps, water holes and specific scripted tiles. It cannot clear, or land on, solid objects such as walls, crates, barriers, cones or cars.
- **Trigger.** Press A again early in a lunge, inside `upgrades.jumpWindow`.

| Rule | Parameter |
|---|---|
| Airborne for a fixed interval | `upgrades.jumpAirtime` |
| The lunge carries on, plus an extension that shrinks with wear | `upgrades.jumpDistance`, `movement.wearFloor` |
| Height is shown only: the shadow separates and the sprite grows to 1.15× | — |
| Landing recovery adds to the lunge recovery deadline | `upgrades.jumpRecovery` |
| A solid object bumps the dummy off, and it drops | — |
| Landing in a hole or water falls, then resets to safe ground | `world.safeGroundDwell`, `world.fallRecovery` |
| Costs a second charge | `battery.jumpCost` |

Cars hit an airborne dummy as usual, and the hit pays the lunge rate.

#### Action timing contract (Proposed)

**Charge.**

- Refill is continuous at the inverse of `battery.secondsPerCharge`, after `battery.refillDelaySeconds` without a successful spend.
- Fast charge multiplies that rate by `upgrades.fastChargeMultiplier`. Charge clamps to capacity.
- A denied action does not restart the refill delay.

**Input.**

- A lunge needs at least 1 charge and spends 1 immediately.
- A distinct A press during a lunge triggers one jump if Jump is owned, elapsed lunge time is at most 0.2 s, and at least 1 charge remains. It spends a second unit.
- Holding A is not a second press.
- Ineligible actions are rejected without spending charge and without queuing a retry.
- A takes precedence if A and B arrive on the same tick.
- B is ignored during falling, recovery, lunging and jumping. Carrying persists but cannot be toggled.

**Jump and recovery.**

- Jump keeps the remaining lunge path and adds its damage-scaled extension. It does not restart the lunge distance.
- Recovery ends after both the lunge recovery deadline and the jump landing recovery deadline have passed.
- Write-off and falling override either action.

**Rotation.** Accepted while idle, moving and recovering. Rejected during a lunge, a jump and a fall. Spends no charge, and is never queued.

These combination rules need a controls playtest.

#### Other movement

Carrying a cone at `upgrades.carrySpeed`. Hold on rides for `upgrades.holdSeconds` (5.6).

#### What the player faces in the world

- **Barriers and holes.** Barriers stop the dummy; their gaps are the way through. A fall resets to safe ground. Jump crosses holes and water only (7.5, 7.7).
- **Cones.** Running into a cone punts it, for every dummy.
- **Terrain.** Surfaces change speed, lunge distance and grip (7.3).

**Parameters — dummy movement**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `movement.walkSpeed` = 81 units/s (Baseline approach speed; slow enough to read a car's chevron before committing)
- `movement.runSpeed` = 162 units/s (Twice walk, so crossing a lane costs about one second)
- `movement.rampSeconds` = 1 s (The cost of starting; removed by Spring start, which is what makes that node felt)
- `movement.turnRate` = 180 °/s (A 90° turn costs half a second, so looking costs time)
- `movement.turnStartup` = 0.1 s (Short enough that rotation feels responsive, long enough to read as mechanical)
- `movement.stopSeconds` = 0.25 s (The coast after the input is released; the dummy has mass and does not stop dead)
- `movement.lowGripStopMultiplier` = ×2.5 (How much further the dummy coasts on low grip; removed by Grip)
- `movement.counterPressAngle` = 135 ° (How far from the heading a press must be to brake rather than steer)
- `movement.counterPressStop` = ×0.4 (How much of the coast remains when the player presses back)
- `movement.lungeDistance` = 164 units (Reaches a lane from the hard shoulder on a fresh body)
- `movement.lungeDuration` = 0.3 s (Too short to abort, which is what makes the commitment matter)
- `movement.lungeRecovery` = 0.35 s (Longer than the lunge itself; a missed lunge is punished by exposure)
- `movement.wearFloor` = ×0.45 (A fully worn body still reaches a passing car's flank, so pillar 1 holds at any damage)
- `movement.alignThreshold` = 30 ° (Within this angle of the pressed direction the dummy runs at full speed)
- `movement.turningSpeedFraction` = ×0.6 (Ground speed while still turning into line; the visible cost of changing direction)

### 5.3 Sensing

The dummy has to look to see. Its stiff body must turn to scan the road, so looking costs time. Rotational inertia (5.2) makes that cost real: the cone follows the body, a 180° sweep takes four turn units, and it cannot be done while lunging.

**The senses follow the same arc as the movement** (Proposed, serves pillar 3). The dummy starts with a single forward sensor and ends close to human perception, bought one sense at a time.

| Sense returned | Upgrade | What changes |
|---|---|---|
| A field of view rather than a beam | **Wider view** | `sensing.coneWidth` opens to `upgrades.widerView` |
| Short-term memory | **Memory** | What was seen persists for `upgrades.memorySeconds` after the cone leaves it, fading and marked stale |
| Hearing | **Ears** | A planned entry is announced `upgrades.earsForecast` ahead, from outside the cone |
| Eyes that move independently | **Neck** (Torso, 5.2) | The cone decouples from the facing |

At the baseline the player resolves a narrow wedge and remembers none of it. By the end of a full run they have width, persistence, warning and an independent gaze.

| Rule | Parameter | Status |
|---|---|---|
| A narrow cone; Wider view opens it | `sensing.coneWidth`, `upgrades.widerView` | Width Proposed |
| Reaches across the level, clamped to the extent (7.1) | `sensing.coneReach` | Proposed |
| Points where the body faces; only the body turns it. Neck decouples it | `upgrades.neckSpeed` | — |
| Inside the cone, each car's detection zones are drawn faintly | `sensing.zoneOpacity` | Proposed |
| Zones fade in as the cone sweeps, so looking reads as scanning | `sensing.zoneFadeIn` | Proposed |
| Outside the cone, only cars, chevrons and brake lights show | — | Proposed |
| A soft tick when a car first enters the cone | — | Proposed |
| Memory holds last-seen snapshots, fading and marked stale | `upgrades.memorySeconds` | Proposed |
| Ears warns of a planned entry; a waiting marker if admission is delayed | `upgrades.earsForecast` | Proposed |
| A fog-of-war sight circle, if the experiment is ever revived | `sensing.fogRadius` | Later (13.3) |

The cone is drawn on the ground like a torch beam. When a car's zone appears, the player sees where its blind spots are.

**Baseline rule.** The dummy sees the cars' detection zones only in the direction it faces. Cars, chevrons and brake lights show everywhere, so the timing cues of pillar 2 hold. Turning (Torso) decides where the cone points; Head upgrades decide what it shows. Today's build draws every car's zones for everyone (Built).

### 5.4 Battery

A global stamina bar that refills by itself. Running low delays actions; with finite traffic, that delay can cost an opportunity.

| Rule | Parameter | Status |
|---|---|---|
| Fixed capacity; Big battery overrides it | `battery.capacity`, `upgrades.bigCapacity` | Proposed |
| Refills continuously after a delay; Fast charge multiplies the rate | `battery.secondsPerCharge`, `battery.refillDelaySeconds`, `upgrades.fastChargeMultiplier` | Proposed |
| Lunges and jumps spend charge; walking and running are free | `battery.lungeCost`, `battery.jumpCost` | Proposed |
| Empty means no lunge until it refills; the glow dims and a low-charge cue plays | — | Proposed |
| Shown as a bar on the HUD and a glow on the dummy | — | Proposed |

Battery depletion has no terminal state and always recovers. Waiting still consumes finite traffic opportunities, so feasibility and pacing include charge costs and refill timing.

**Parameters — battery**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `battery.capacity` = 3 charge (Three attempts before waiting; enough for one bait sequence)
- `battery.secondsPerCharge` = 0.8 s per charge (A full refill takes about as long as a car takes to cross the level)
- `battery.refillDelaySeconds` = 0.3 s (Stops a spent charge refilling mid-lunge)
- `battery.lungeCost` = 1 charge (One attempt, one charge; the unit the player counts in)
- `battery.jumpCost` = 1 charge (A jump costs a second attempt, so traversal competes with attacking)

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

### 5.6 Progression: the skill tree

#### The idea

*You are not buying freedom. You are buying degrees of freedom.*

A crash-test dummy has fewer degrees of freedom than a person. Each part of the body starts as a limitation, and upgrades give human abilities back one part at a time — joints, and senses.

#### Principles

1. **One job per part, no overlap.** Head is what you sense. Torso is where you point. Legs is where you go. Arms is what you change. Battery is how much you can do.
2. **Start small.** Simple, powerful core upgrades first.
3. **Every upgrade reads from above** — position, facing, outline, movement, or markings on the ground and on cars.
4. **Upgrades are verbs; terrain and props are nouns** (Proposed). Terrain and props belong to level design and are never bought.
5. **Rules for every upgrade.** Anything that extends reach shrinks with damage, like the lunge. The clearance cars learn follows the dummy's actual reach. The cars learn each new approach.

#### The tree

A radial tree, five branches, each forking once. The dummy sits in the centre with five tier-1 upgrades around it, and each unlocks two at tier 2, making fifteen. The dummy starts with none.

```
DUMMY: slow to turn, a narrow view, rigid arms, a slow start and a small battery
│
├── HEAD    what you see         Wider view ───┬── Memory
│                                              └── Ears
│
├── TORSO   where you point      Hips ─────────┬── Spine
│                                              └── Neck
│
├── LEGS    where you go (A)     Spring start ─┬── Jump
│                                              └── Grip
│
├── ARMS    what you change (B)  Carry ────────┬── Hold on
│                                              └── Throw
│
└── BATTERY how much you can do  Big battery ──┬── Kinetic charge
                                               └── Fast charge
                                 tier 1            tier 2
```

| Part | Starts as | Tier 1 | Tier 2 | Tier 2 |
|---|---|---|---|---|
| **Head**: what you see | A single forward sensor: narrow cone, no memory, no warning | **Wider view**: the cone opens from `sensing.coneWidth` to `upgrades.widerView` | **Memory**: a timestamped last-seen zone outline remains for `upgrades.memorySeconds` after you look away (Proposed) | **Ears**: a pulse forecasts a planned entry `upgrades.earsForecast` ahead; blocked entry becomes a waiting marker (Proposed) |
| **Torso**: where you point | Slow to turn; the body must rotate before it can move or look anywhere new | **Hips**: overrides `movement.turnRate` with `upgrades.hipsTurnRate` | **Spine**: bend a lunge mid-flight, up to `upgrades.spineLimit` | **Neck**: the view cone decouples from the facing (5.2, 5.3) |
| **Legs**: where you go (A) | A one-second build-up; holes and deep water stop you; low grip slides you | **Spring start**: full speed from the first step | **Jump**: press A mid-lunge to hop over holes and deep water, never over solid objects | **Grip**: firm footing on slippery ground; deep water remains a gap |
| **Arms**: what you change (B) | Rigid; B does nothing | **Carry**: B picks up and drops a cone | **Hold on**: B grabs a car's side; ride it, then press A to lunge off | **Throw**: B while carrying throws the cone ahead instead of dropping it |
| **Battery**: how much you can do | A small battery | **Big battery**: more charge | **Kinetic charge**: an impact of at least `upgrades.kineticThreshold` pre-bonus damage refills `upgrades.kineticFraction` | **Fast charge**: the battery refills twice as fast |

**The tier-1 set** is Wider view, Hips, Spring start, Carry and Big battery. These are the first to build and the first a player can buy.

**Moved out of the tree on purpose**

- **Kicking cones** is not an upgrade. As a Legs upgrade it would duplicate the Arms job of moving things, so every dummy punts a cone by running into it.
- **Running faster** became Spring start, because speed is the Legs job.
- **Dents on cars** that have learned from you show for everyone, as pillar 2 requires.
- **A second lunge** became Big battery. A press of A therefore only ever means lunge, or jump mid-lunge.
- **Strafe** was withdrawn. Steer-to-direction makes sidestepping the default, so it has nothing to sell.

**Notes on single upgrades** (Proposed)

- **Hold on.** The grab counts as that car's one impact, and lunging off keeps none of the car's speed. Grab only an unspent appearance in range with a clear attachment point; assess the grab as an ordinary non-lunge side impact; attach only if the body survives. While attached, A spends normal lunge charge and launches along the dummy's facing; no charge leaves it attached until timeout. Timeout, host exit, loss of attachment space or level transition detaches to the nearest validated free position with no damage or points. Write-off terminates attachment immediately. Detachment cannot restore the host's impact allowance. Validate safe-detachment space before allowing the grab; if none exists later, hold a safe stop and report the failure. Never teleport through a solid object.
- **Carry and Throw.** The cars must learn about cones, or a cone is free bait forever.
- **Wider view and Memory.** If the fog-of-war experiment is revived (13.3), Wider view also widens the visible area and Memory slows the fade.
- **Grip.** Low grip is a permanent property of the surface (7.3), so Grip is the only node that removes a hazard rather than adding a verb. It earns its slot because oil and diesel are placed deliberately as bait, and removing the slide changes which bait is safe to take.
- **Neck.** The cone it decouples is the player's information, never the cars'. Looking at a car with Neck does not change what that car knows.

#### Damage and the tree

The tree adds new dummy states — jumping, carrying, holding on — and with them new damage cases. All stay in one damage function: vehicle × zone × dummy state (Proposed). A hit during a jump pays the lunge rate, because the jump starts from a lunge.

**Parameters — upgrade effects**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `upgrades.widerView` = 160 ° (Roughly human binocular plus near peripheral; the first sense returned)
- `upgrades.hipsTurnRate` = 360 °/s (Halves the cost of looking without removing it)
- `upgrades.spineLimit` = 45 ° (Enough to correct a misread, not enough to home in)
- `upgrades.spineRate` = 540 °/s (The full 45° bend fits inside the lunge duration)
- `upgrades.neckSpeed` = ×0.8 (Moving while looking elsewhere costs speed)
- `upgrades.jumpWindow` = 0.2 s (Early in the lunge only; jumping is a decision, not a correction)
- `upgrades.jumpDistance` = 60 units (Clears a standard roadwork hole on a fresh body; shrinks with wear)
- `upgrades.jumpAirtime` = 0.35 s (Long enough to read as airborne against the ground shadow)
- `upgrades.jumpRecovery` = 0.1 s (Added to lunge recovery, so jumping is the most exposed action)
- `upgrades.carrySpeed` = ×0.85 (Carrying a cone is a visible, minor handicap)
- `upgrades.holdSeconds` = 1.5 s (About one block of travel; a repositioning tool, not a free ride)
- `upgrades.throwDistance` = 120 units (Places a cone across one lane from the hard shoulder)
- `upgrades.bigCapacity` = 5 charge (Five attempts covers a full bait-and-retry sequence without waiting)
- `upgrades.kineticThreshold` = 300 damage (Only a committed hit refills; glancing contact does not)
- `upgrades.kineticFraction` = ×0.5 (Half a battery back, so a good hit buys the next attempt)
- `upgrades.fastChargeMultiplier` = ×2 (Halves the wait, which is the only thing waiting ever costs)

### 5.7 The body as data (Proposed)

The dummy is five parts, one per branch, each with statistics and abilities held as data (11). An upgrade is an edit to that data, so the UI can count upgrades owned, up to 15. "Degrees of freedom" is the fiction's metaphor, not a literal count of movement axes.

| Part | Job | Statistics | Abilities the tree unlocks |
|---|---|---|---|
| Head | What you see | View-cone width, memory time | Ears |
| Torso | Where you point | Turn rate | Spine, Neck |
| Legs | Where you go | Walk-to-run build-up, grip | Jump |
| Arms | What you change | — | Carry, Hold on, Throw |
| Battery | How much you can do | Capacity, refill rate | Kinetic charge |

*Built.* A fresh body has `damage.bodyHealth`. Damage shortens the lunge to `movement.wearFloor`. It does not slow the dummy.

### 5.8 Tuning method

Every parameter is held as data and listed in its owning section as `parameter` = value (purpose). The registry `tuning.parameters.json` is canonical.

1. **Feel each upgrade.** Use LIVE TUNING (12.4) to inspect baseline, active and derived values. Save a preset per trial. Granting upgrades for a scenario is a separate recorded debug action; it must not rewrite prices or purchase history.
2. **Measure each upgrade.** Compare matched-seed runs with and without it. Points per minute and time per write-off are screening measures; 40% and 5% differences are investigation thresholds, not verdicts. Information upgrades also need first-time player tests of cue comprehension, missed threats and decision confidence. An omniscient bot cannot measure their value.
3. **Change one parameter at a time,** then play again.
4. **Log each change** through the session recorder, which links it to the configuration revision actually played.
## 6 The Fleet

The other actor. Same four questions as section 5 — who they are, how they move, what they sense, how they change — plus how they speak.

### 6.1 Classes and identity

Vehicles are the city's workers. Price tiers set temperament: 01 Luxury/confident, 02 Corporate/calm, 03 Consumer/melancholy, 04 Budget/angry. Training and mood vary the expression. SED-01 is a type-tier; SED-01-001 is a model within it. The Narrative Agent names each numbered model. All 32 type-tier combinations ship. A tier is a livery, a name and a temperament, not new behaviour, so the cost is art and writing rather than code.

| Vehicle class and behaviour | Player response | 01 Luxury | 02 Corporate | 03 Consumer | 04 Budget |
|---|---|---|---|---|---|
| Sports. Late commitment; tight clearance | Low-reach finisher; brief warning | SPT-01 | SPT-02 | SPT-03 | SPT-04 |
| Wagon (estate). Wide clearance; long prediction | Use a fresh body's long lunge | WGN-01 | WGN-02 | WGN-03 | WGN-04 |
| SUV. Brakes before a wide turn | Hit its broad flank before braking | SUV-01 | SUV-02 | SUV-03 | SUV-04 |
| Hatchback. One signalled recommitment | Wait for the second decision; no third | HAT-01 | HAT-02 | HAT-03 | HAT-04 |
| Sedan. Swerves with moderate clearance | Intercept its locked route | SED-01 | SED-02 | SED-03 | SED-04 |
| Police car. Tracks your approach, then commits | Bait tracking; intercept its locked route | POL-01 | POL-02 | POL-03 | POL-04 |
| Van. Brakes, then swerves late | Reachable head-on; braking weakens impact | VAN-01 | VAN-02 | VAN-03 | VAN-04 |
| Bus. Only brakes; cannot swerve | Easy to reach; slow hits may not kill | BUS-01 | BUS-02 | BUS-03 | BUS-04 |

**Class physics.** Mass is relative to a sedan, the reference vehicle for the damage formula (8.3). These values reproduce the Built payoffs: a head-on lunge at cruise pays about 500 against a sedan, 650 against a van and 1,170 against a bus.

Dimensions are automotive L × W × H. **Length** runs bumper to bumper along the direction of travel. **Width** runs door to door. **Height** is ground to roof. Length and width set the collision footprint; height sets occlusion and, later, which zone a hit lands in (7.7).

Every cell is addressable as `vehicles.<class>.<field>`. The table is the registry's `classes` rows, not prose.

| Class | `mass` | `length` | `width` | `height` | Occludes | Head-on lunge at cruise | Behaviour |
|---|---:|---:|---:|---:|:---:|---:|---|
| Sports | ×0.85 | 52 | 26 | 20 | — | ~590 | Late commitment, tight clearance |
| Hatchback | ×0.9 | 46 | 26 | 23 | — | ~510 | One signalled recommitment |
| Sedan | ×1.0 | 56 | 28 | 22 | — | 500 | The reference. Moderate clearance |
| Wagon | ×1.15 | 62 | 28 | 24 | — | ~600 | Wide clearance, long prediction |
| Van | ×1.5 | 68 | 32 | 34 | yes | ~650 | Brakes, then swerves late |
| Bus | ×3.0 | 96 | 34 | 48 | yes | ~1,170 | Only brakes; cannot swerve |
| SUV | ×1.8 | 64 | 32 | 27 | — | ~800 | Brakes before a wide turn |
| Police | ×1.1 | 58 | 28 | 23 | — | ~560 | Tracks the approach, then commits |

**Height does three things.**

- **Occlusion.** A class at or above `vehicles.occlusionHeight` blocks the cars' side sensors and the player's read of what is behind it. Van and bus are the only mobile cover in the first version.
- **Grab point.** Hold on reads height to place the dummy on the vehicle.
- **Zone mapping, later.** Height bands (7.7) will decide which part of a car an airborne dummy strikes.

Transient occluders do not count toward the static occlusion cap in 7.9 clause 6.

*Built.* The vertical slice has six classes and twelve numbered models. SUV and police are a class row, two behaviour flags and art each, so they ship with the eight-class set.

**Parameters — vehicle identity**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `vehicles.occlusionHeight` = 30 units (At or above this a vehicle blocks side sensors and the player's read; below it does not)

### 6.2 Locomotion and traffic

**Three rules the rest follows from.**

- Each car navigates with its own behaviour and never hits another car.
- Cars give way by traffic logic, mapped to US driving, on the right-hand side of the road.
- Jams are fixed by smarter navigation, never by removing cars.

**Built today.** These keep cars apart but are not traffic logic, so they will be replaced.

- Cars are solid and avoid each other.
- A car gives way to any older car in its path. It looks ahead 20 units plus 0.45 s of travel and holds an 8-unit gap.
- Cars accelerate at `traffic.acceleration` and brake at up to `traffic.hardBraking`.
- CROSS JUNCTION's roads are one-way.
- The open-hall level uses a jam breaker that removes cars after 6 s of stall.

**How cars drive** (Proposed)

1. **Lanes, keeping right.** Every road is a set of lanes, each a path with a direction. On a two-way road each car drives right of the centre line. From above, a car heading right uses the lower lane; one heading left uses the upper. The hard shoulder is right of the right-hand lane.
2. **Following.** Each car keeps a time gap to the car ahead and changes speed smoothly.
3. **Lane changes and swerves.** A car moves sideways only into space it has checked is clear: its own lane first, then the hard shoulder or an empty lane. It crosses the centre line only when the oncoming lane is clear for the whole swerve. Swerving round the dummy obeys the same rules, and give-way always comes first.
4. **Vehicles turn on the rear axle.** The turn centre sits `traffic.pivotOffset` of the vehicle's length behind its midpoint. The nose swings outward through a corner; the tail tracks inside the curve.
   - The tail never sweeps outside the footprint the player can see the vehicle occupying. Centre-pivot rotation breaks that, and breaks pillar 2.
   - Traffic arbitration reserves the **swept** footprint through a turn, not the destination footprint. A long class claims more of a junction than a short one at the same speed.
   - Per-class steering angles and turn radii are out of scope (13.3). The class swerve flags already carry the difference.
5. **Right of way**, simplified from US conventions:
   - **Uncontrolled junction.** First to arrive goes first. Arrivals within `traffic.arrivalTie` are simultaneous; the car on the right goes first.
   - **Left turns** yield to oncoming traffic going straight or turning right.
   - **Roundabout.** Circulating traffic has priority. Entering traffic yields at the line. A car signals the arm it will leave by.
   - **Stop signs.** Stop fully, then go in order of arrival; ties go to the right.
   - **Zebra crossings.** Cars always stop for anything on them (7.3).
   - **Never block the box.** A car enters a junction only if it can clear the far side.
6. **Junction reservations.** A car enters a junction only when it holds a reservation for its path across. Reservations are granted in right-of-way order. Two cars may hold them at once only if their paths do not cross. This is what keeps junctions from locking.
7. **The deadlock rule** (Proposed, replaces the jam breaker). After a wait cycle lasts `traffic.deadlockTimeout`, choose the lowest-priority car deterministically — latest arrival, then appearance ID. Reserve a verified clear escape trajectory before backing off or rerouting; check the swept space behind as well as ahead. Never reverse into the dummy, another car or a barrier. Release stale reservations. If no safe recovery exists, hold a safe stop and flag a layout validation failure. A car is never despawned to resolve congestion; normal departure through its scheduled exit remains allowed, which keeps the vehicle budget honest. New cars appear only when their entry lane has room.
8. **Personality within the rules.** Class and mood change how a car drives, not which rules it follows. Rush cars keep smaller gaps. Cautious cars keep larger ones. Unreliable cars hesitate at junctions. Learning changes how cars treat the dummy, never how they treat each other.

**Checks** (Proposed). The traffic audit requires that:

- no two cars ever touch;
- no car leaves the road or crosses a barrier;
- cars keep right on every two-way road;
- in scripted junction tests, cars go in the right-of-way order above;
- in valid layouts, every admitted car eventually reaches a normal exit once temporary obstructions clear; a wait over 10 s records a diagnostic with its cause;
- occupied crossings and blocked exits permit safe waiting beyond 10 s; no progress rule may override collision safety;
- no car is forcibly despawned to break a jam;
- admission checks use braking distance, terrain, reaction time and the full vehicle footprint; legal spawn space exceeds the static minimum gap;
- traffic arbitration may reduce speed after commitment. If that invalidates a committed route, visibly cancel the commitment and acquire a newly signalled route (Proposed; needs review against the locked-steering rule).

**Parameters — vehicles and traffic**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `perception.reactionDelay` = 0.15 s (The window a bait must fit inside; the player's whole timing game)
- `perception.sideRadius` = 100 units (Short enough that passing close is safe; long enough to make a car hesitate)
- `traffic.timeGap` = 1.2 s (Standard following distance; sets how often a usable gap appears)
- `traffic.busTimeGap` = 1.8 s (Buses leave larger gaps, making them the easiest class to reach)
- `traffic.minimumGap` = 8 units (Queued cars stay separable, so the dummy can enter a stopped line)
- `traffic.acceleration` = 360 units/s² (A stopped car takes about half a second to become dangerous again)
- `traffic.comfortBraking` = 400 units/s² (Normal slowing; the deceleration an incident is measured against)
- `traffic.hardBraking` = 600 units/s² (Emergency stop; the cue that the player forced a reaction)
- `traffic.arrivalTie` = 0.5 s (Arrivals this close count as simultaneous at a junction)
- `traffic.stopPause` = 0.5 s (A full stop long enough to be a reliable target)
- `traffic.deadlockTimeout` = 3 s (How long a wait cycle runs before safe recovery is planned)
- `traffic.pivotOffset` = 0.30 ratio (How far behind the midpoint the turn centre sits, as a fraction of length)
- `traffic.lookAheadBase` = 20 units (The fixed part of how far a car checks ahead)
- `traffic.lookAheadSeconds` = 0.45 s (The speed-scaled part, so fast classes look further)
- `traffic.backOffLengths` = ×1.0 (How far a car reverses during deadlock recovery, in its own lengths, only into verified clear space)
- `traffic.entryRoomLengths` = ×1.0 (Car lengths of space required before a new car is admitted, on top of `traffic.minimumGap`)
- `vehicles.sports.cruiseSpeed` = 192 units/s (Fastest class; highest damage, smallest window)
- `vehicles.hatchback.cruiseSpeed` = 156 units/s (Fast and recommits once, so timing is readable but tight)
- `vehicles.wagon.cruiseSpeed` = 144 units/s (Wide clearance at moderate speed; rewards a fresh body's full reach)
- `vehicles.sedan.cruiseSpeed` = 138 units/s (The reference vehicle; all damage figures normalise to a sedan at cruise)
- `vehicles.van.cruiseSpeed` = 120 units/s (Slow but heavy; brakes then swerves late)
- `vehicles.bus.cruiseSpeed` = 108 units/s (Slowest and heaviest; cannot swerve, so it is the beginner's target)

**Design bounds**

| Parameter | Min | Max | Why |
|---|---:|---:|---|
| `traffic.pivotOffset` | 0.15 | 0.45 | Below 0.15 the pivot is effectively central and the tail sweeps outward again. Above 0.45 the turn centre passes behind the rear bumper and the vehicle crabs sideways. |

### 6.3 Perception

- A light wedge shows a car's field of view. Other vehicles block it.
- A chevron appears on detection and shows the intended route.
- The route updates until the commit ring, where it visibly locks and steering stops changing. Exceptions: the hatchback's single recommitment, and the safety cancellation in 6.2.
- Brake lights show slowing. Commitment does not lock speed.

*Built.* Each car has a forward zone along its heading, at least 320 units long, growing to 400–430 as the car learns, or 540 once its model is "closed". It checks where the dummy is and where it is heading. Side sensors reach `perception.sideRadius` from the nose, within 80° either side; a dummy there makes the car slow, not swerve. Cars react after `perception.reactionDelay`. A car that has noticed the dummy slows until it has committed and swung clear; unnoticed and committed cars run at full speed. A standing dummy is steered round, though a bus or sports car can still touch it.

**Three differences from the specification above, in the current build:** the chevron appears on commitment rather than detection; the detection zone is a rectangle, not a wedge; and vehicles do not yet block each other's sensing, so hiding behind another vehicle does not work.

### 6.4 Learning and seniority

**The policy.** Experience is stored per numbered model and inherited by later appearances. Every impact is logged, but learning changes only once per write-off, from the responsible impact's approach evidence. A car already on screen keeps its learned values until it departs; later spawns read the updated snapshot. Cross-model sharing is off for the first version. Fleet learning is the visible accumulation across recurring models, not a global difficulty bonus.

**The approach registry** (steps and caps Proposed). Each write-off is tagged with exactly one primary approach, selected deterministically. Secondary tags are logged but do not train. Ambiguous or unsupported evidence uses a neutral tag and trains nothing. Approach is never inferred from damage zone alone.

| Approach | Evidence predicate | What the model learns | Step | Cap |
|---|---|---|---|---|
| **Direct interception** | The dummy entered the forward zone and lunged, with no occluder and no prior detection break | Forward zone length | +8% | +40% |
| **Post-commit bait** | The dummy left the path before the commit ring, then re-entered after it locked | Commitment is delayed; the ring locks later | +0.05 s | +0.25 s |
| **Occluded ambush** | The dummy was behind a sensor occluder within 1 s of the impact | Side-sensor reach | +10% | +50% |
| **Gap jump** | The impact landed while the dummy was airborne | Clearance held around gaps and holes | +10 units | +40 units |
| **Cone diversion** | A cone was placed or thrown into the car's lane within 3 s of the impact | Cones are treated as obstacles earlier | +10% look-ahead | +40% |
| **Hold-release transfer** | The dummy was attached to a vehicle within 1.5 s of the impact | Braking while a dummy is attached | +10% | +40% |

The first version implements **direct interception** and **post-commit bait**. The remaining four are deferred (13.3).

**Every cap must leave a lethal opening.** A model at full training on every approach must still be beatable by an unupgraded dummy at minimum reach. That is pillar 1, and a build-acceptance check (12.5), not a hope.

**Seniority** summarises training in four levels, shown as notches beside the model ID tag (4.2.2). The threshold is write-offs caused.

| Level | Write-offs caused | Notches |
|---|---|---|
| New | 0 | — |
| Practised | 1 | 1 |
| Experienced | 3 | 2 |
| Senior | 6 | 3 |

*Built.* A model learns only on a write-off, and all its learned values rise together: detection, clearance, prediction and braking. Per-approach learning replaces that.

### 6.5 Moods

Assigned per appearance with seeded generation. Mood varies the encounter without changing what the car is allowed to do.

| Mood | Effect | Share |
|---|---|---|
| **Standard** | Baseline | 55% |
| **Rush** | Desired speed ×1.15, time gap ×0.8 | 20% |
| **Cautious** | Desired speed ×0.8, braking begins 50% earlier | 15% |
| **Unreliable** | Desired speed varies ±10%, pre-commit hesitation of 0 to 0.3 s | 10% |

**Mood may never** add route revisions beyond the hatchback's signalled exception, hide a cue, or remove a lethal opportunity. Learning is unaffected: a Cautious car that writes off a body trains its model exactly as a Standard one would. The safety cancellation in 6.2 is controlled by traffic arbitration, never by mood.

### 6.6 Voice: barks and reports

**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.

**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.

**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.

**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.

The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

## 7 Levels and Environment

### 7.1 Canvas and playing area

**Target display: 16:9**, exhibition hardware. The canvas is `canvas.width` × `canvas.height` at reference scale, where one world unit equals one pixel. All gameplay distances are world units; pixels are a rendering concern and appear in no gameplay rule.

**The play area is 4:3.** `ui.playWidth` × `ui.playHeight`, centred, with `ui.sideColumn` of chrome each side and `ui.horizontalStrip` top and bottom (4.2.1). Not letterbox: the columns carry the instrument modules.

The reason is approach symmetry. A car entering from the top once had half the travel to the centre of one entering from the side, and so half the warning time. A squarer play area equalises it.

**Fixed scale across all levels.** The dummy, the vehicles and the cues are the same apparent size everywhere. A level is never zoomed out to fit more world on screen.

| | Width | Height | Aspect |
|---|---|---|---|
| Canvas (fixed) | 1280 | 720 | 16:9 |
| Play area (fixed) | 800 | 600 | 4:3 |
| Side chrome, each | 240 | 600 | — |
| Top and bottom strips | 1280 | 60 | — |

**All levels use the same extent.** The frame does not change between levels; character comes from layout, traffic and terrain.

**No scrolling camera.** The whole level is visible at once. Reading the fleet is pillar 2, and a camera that hides approaching cars removes the information the player is meant to be reading. A level needing more space is two levels.

**Non-16:9 displays** (the browser build). The whole canvas scales to fit, preserving aspect, and letterboxes. Every player sees identical world content at identical relative size; only the border differs.

**No gameplay value is derived from the display.** No gameplay module may read display dimensions, device pixel ratio or window size. Presentation alone knows them.

**Traversal time at the declared extent.** A car crossing the full 800 units:

| Class | `cruiseSpeed` | Crossing |
|---|---|---|
| Sports | 192 | 4.2 s |
| Hatchback | 156 | 5.1 s |
| Wagon | 144 | 5.6 s |
| Sedan | 138 | 5.8 s |
| Van | 120 | 6.7 s |
| Bus | 108 | 7.4 s |

These are the pacing spine. Every quota and certification target in 10.3 is judged against them.

**Extent gate** (Open, blocking; 13.1). The traffic allocation, quotas and certification target were set before the extent was fixed at 800 × 600 and have not been re-proved against it.

**Extent is a registered tuning parameter** with a `checkpoint` application boundary. It cannot be changed live mid-run.

**Parameters — canvas and extent**

- `canvas.width` = 1280 units (16:9 exhibition canvas at reference scale)
- `canvas.height` = 720 units (16:9 exhibition canvas at reference scale)

Play-area and chrome dimensions are listed under *Parameters — interface* in 4.2.8.

### 7.2 Level types and order

The city is the crash lab (4.1). Each level is a different instrument within it: the road measures speed, the crossroads measures competing routes, the roundabout measures continuous flow. FARSIGHT signage and surveillance connect them.

Each level adds its own traffic rules, ground, props and heights, and rewards a different part of the skill tree (5.6). Layouts are not specified here. Any layout satisfying 7.9 is legal.

| Level | Traffic (US rules, keep right) | Ground, props and heights | Way in with no upgrades | Rewards |
|---|---|---|---|---|
| **1 Road** | Two-way road, one lane each way; free-flow target, no junction stops. Safety braking may stop a car | Tarmac, hard shoulder, gravel verge, puddles, roadwork holes; crash barriers with pedestrian gaps; retrievable cones | The barrier gaps | Legs (Spring start, Jump over roadwork holes), Arms (Hold on), Torso (Hips) |
| **2 Cross junction** | Two-way crossroads, no lights. First to arrive goes first, ties go to the right, left turns yield | Tarmac, pavement, kerbs, zebra crossings, puddles; open manholes on pavements; cones | Corners and kerbs | Head (Wider view, Ears at corners), Arms (Carry, Throw), Legs (Jump over manholes) |
| **3 Roundabout** | Four arms, two circulating lanes. Circulating traffic has priority; entering traffic yields at the line. A car signals the arm it will leave by. Nothing ever comes to a full stop | Tarmac, calibrated impact plates on the circulating lane, a diesel spill, kerbed splitter islands; a central island with rubber crash matting and planting; cones | The splitter islands, then the central island | The whole tree. This is the exam |

**The roundabout is the final level.** It is the densest instrument in the city and the one FARSIGHT puts in its brochure. Traffic never stops. The only still ground is the central island, surrounded on every side by moving vehicles — the safest place in the level is the hardest to leave.

**Why the roundabout is the exam.**

- **Yield on entry is a bait point.** A car at the give-way line is hesitating by rule, not by chance. The most predictable vehicle in the game and the most exposed.
- **The exit signal is a commitment cue.** A car that has signalled its arm has declared its route. Reading signals is pillar 2 made geometric.
- **Circulating traffic never rests.** Battery management and service timing matter here in a way they do not on a road with gaps.
- **Rubber matting on the island** gives a ×1.15 launch into circulating traffic. The island is refuge and springboard at once.
- **Calibrated impact plates on the circulating lane** pay `damage.plateMultiplier`. FARSIGHT instruments the surface its cars hit most.
- **The diesel spill** is the only low-grip surface in the run, so Grip depends on it.

**Every level can be completed with no upgrades.** Upgrades open routes that pay more or are harder for the cars to predict. Enforcement is in 7.9.

**The vertical slice** (Built). Three levels: ROAD (quota 2, 14 vehicles), CROSS JUNCTION (quota 3, 20), CRASH TEST CENTRE (quota 5, 28), certification target 11. Road and Cross junction carry forward. Cross junction's one-way roads become two-way right-hand traffic. The open-hall level is replaced by the roundabout: a room more laboratory than the city contradicts the setting, since the city is the crash lab (4.1). Its instrumentation — impact plates, crash matting, the calibration grid — moves to the roundabout.

### 7.3 Terrain surfaces

Terrain affects movement. You move fast on tarmac and less fast on grass.

- Multipliers apply to the dummy's base values. The values below are Proposed.
- Grip governs turning and stopping: on low grip the dummy slides, overshoots its turns and coasts `movement.lowGripStopMultiplier` further before stopping (5.2). **Grip** (Legs, tier 2) removes all three. It is the only node that removes a hazard rather than adding a verb (5.6).
- Car effects apply only where cars can drive.
- The band column is the height band from 7.7.
- Every cell is addressable as `world.terrain.<id>.<field>`. The table is the registry's `terrain` rows, not prose.

| ID | Terrain | Band | Dummy speed | Lunge | Grip | Cars | Notes |
|---|---|---|---|---|---|---|---|
| `tarmac` | Tarmac | 0 | 1.0 | 1.0 | normal | normal | The reference surface |
| `pavement` | Pavement / concrete | 0 | 1.0 | 1.0 | normal | normal | |
| `kerb` | Kerb | 1 | 0.85 crossing | 1.0 | normal | cannot mount | A thin strip that slows a step |
| `zebra` | Zebra crossing | 0 | 1.0 | 1.0 | normal | always stop for anything on it | A safe zone: useless to you, funny on purpose |
| `grass` | Grass | 0 | 0.75 | 0.85 | slightly low | cannot drive | Island planting |
| `hedge` | Tall grass / hedge | 0 | 0.6 | 0.7 | normal | cannot drive | Blocks the cars' side sensors: natural cover |
| `gravel` | Gravel | 0 | 0.8 | 0.9 | low | speed ×0.7, braking ×0.7 | Cars skid |
| `mud` | Mud | 0 | 0.5 | 0.6 | low | speed ×0.5 | Not placed in the first version |
| `puddle` | Puddle | 0 | 0.9 | 1.0 | low | braking ×0.5 | Cars brake late, so they are easier to hit |
| `oil` | Oil / diesel spill | 0 | 1.0 | 1.0 | very low | braking ×0.3, swerving ×0.5 | The best surface to lure a car onto |
| `matting` | Rubber crash matting | 0 | 1.0 | 1.15 | high | normal | The roundabout's central island; a springboard |
| `plate` | Calibrated impact plate | 0 | 1.0 | 1.0 | normal | normal | The circulating lane. Hits on it pay `damage.plateMultiplier` |
| `bump` | Speed bump | 1 | 1.0 | 1.0 | normal | ×0.5 crossing | |

**Parameters — world**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `world.safeGroundDwell` = 0.5 s (How long the dummy must stand clear before that spot becomes its fall-recovery point)
- `world.pedestrianGap` = 40 units (Wide enough for the body footprint with margin; narrow enough for cars to learn)
- `world.laneWidth` = 56 units (One traffic lane; two lanes plus verge is what lunge reach is tuned against)
- `world.fallRecovery` = 1.2 s (What a fall costs: no damage, no write-off, only this)
- `world.occludedFractionMax` = 0.25 ratio (Ceiling on the share of the play area that blocks the player's read of the fleet)
- `world.barrierGapsMin` = 3 count (Minimum pedestrian openings per side of a barrier run)
- `world.spawnLeadIn` = 200 units (Distance outside the play edge where a car is placed, so it enters at cruise speed and correctly spaced)
- `damage.plateMultiplier` = ×1.5 (What a hit on a calibrated plate scores; the roundabout's scoring geometry)

**Design bounds**

| Parameter | Min | Max | Why |
|---|---:|---:|---|
| `world.laneWidth` | 44 | 80 | Below 44 the widest class clips its lane on a swerve. At 80 a two-lane road is 160 units and `movement.lungeDistance` of 164 barely reaches the far lane; beyond that the far lane stops being a target from the verge. |
| `world.occludedFractionMax` | 0.10 | 0.40 | Below 0.10 the Head branch and the occluded-ambush approach have nothing to work with. Above 0.40 the player cannot read the fleet and pillar 2 voids. |
| `world.fallRecovery` | 0.6 | 2.5 | Below 0.6 a fall is free and holes stop being hazards. Above 2.5 a fall costs more than a body on a dense level. |
| `world.barrierGapsMin` | 2 | 6 | Below 2 the fleet learns the single gap inside one level and no learning cap can leave a lethal opening. Above 6 the barrier stops being a barrier. |
| `damage.plateMultiplier` | 1.0 | 2.0 | At 1.0 the plate is decoration and the roundabout has no scoring geometry. Above 2.0 the plate beats zone choice and the damage table in 8.3 stops mattering. |

### 7.4 Static structures

Solid, fixed, never jumpable. The gaps in them are the way through.

| ID | Terrain | Band | Dummy | Cars |
|---|---|---|---|---|
| `barrier` | Crash barrier | 2 | blocked | blocked |
| `gardenWall` | Garden wall | 3 | blocked | blocked |
| `wall` | Wall | 4 | blocked | blocked |

### 7.5 Ground hazards

Band −1. The dummy falls in and recovers at safe ground after `world.fallRecovery`; Jump clears them (5.2).

| ID | Terrain | Band | Dummy | Cars |
|---|---|---|---|---|
| `water` | Deep water (pond, ditch, canal) | −1 | falls in | cannot drive |
| `hole` | Hole / open manhole | −1 | falls in | never on roads (first version) |

### 7.6 Dynamic props (Proposed)

| ID | Prop | Band | Who can move it | What it is for |
|---|---|---|---|---|
| `cone` | Traffic cone | 1 | Every dummy punts it by running into it; Carry picks it up; Throw throws it | Put it in a lane and cars commit around it: baiting without standing in the road. Not jumpable: a solid object |
| `crate` | Crate | 3 | No one (fixed) | Blocks the cars' sensors: ambush cover |

No upgrade moves barrier sections. That removes the lane-closing exploit found in the first skill-tree review.

### 7.7 Height bands

The game is top-down, but every object has a **height band**, a whole number. One set of rules then decides walking, jumping and, later, where a car is hit.

| Band | Name | Examples | On foot | With Jump (Legs, tier 2) |
|---|---|---|---|---|
| −1 | Gap | Hole, open manhole, ditch, deep water | Falls in; back to safe ground | Crosses a gap up to `upgrades.jumpDistance` |
| 0 | Ground | Every surface | Walks | — |
| 1 | Ankle | Kerb, speed bump, cone | Crosses kerbs and bumps; punts cones | No: cones are solid objects |
| 2 | Waist | Crash barrier, fence | Blocked | No |
| 3 | Chest | Crate, garden wall | Blocked | No |
| 4 | Overhead | Wall, building | Blocked | No |

Rules:

- **Barriers always stop the dummy.** Jump does not clear them; the gaps are the way through.
- **The jump is a 2D hop, like Zelda's Roc's Feather.** It clears floor gaps, water holes and specific scripted tiles. It cannot clear or land on solid objects, and never a car.
- **Scripted jump tiles** (Proposed). Marked tiles that only a jump crosses.
- **Falling resets the dummy to safe ground.** Safe ground is the last spot where it stood on band 0, off any hazard, for `world.safeGroundDwell`. No damage, no write-off; the cost is `world.fallRecovery`.
- **Cars stay solid at every band.** A jump never clears one. A car meeting an airborne dummy uses the same solid collision and zone rules, while the airborne action retains the lunge damage multiplier. The airborne case needs its own test.
- **Readable height** (Proposed). Higher bands cast longer shadows and heavier outlines; pits are dark with a visible lip.

### 7.8 Weather

Not in the first version (13.3). If built, it is a modifier layer over terrain grip and speed (7.3), car braking (6.2) and visibility (5.3) — never a new system, and no gameplay module reads a weather state directly. Two constraints bind it in advance: no condition may degrade a reserved cue below its tier contrast (4.2), and each condition needs its own feasibility witness on each level or it does not ship for that level.

### 7.9 The level contract (Proposed)

**Levels are hand-authored in the first version.** Three fixed layouts, not generated profiles. The contract validates each authored layout once. Generation is a later feature (13.3); the clauses are written so the same checks run against generated profiles when it arrives.

Any layout is legal that satisfies every clause. Each is a build-acceptance check in 12.5. No coordinates appear in this document.

1. **Lanes.** Every traffic lane is `world.laneWidth` wide. A road is a whole number of lanes plus a verge or shoulder the dummy can stand on.
2. **Barrier gaps.** Every barrier run has at least `world.barrierGapsMin` pedestrian openings per side, each `world.pedestrianGap` wide, spaced far enough apart that the fleet can learn them individually.
3. **Approach cues.** Every spawn edge has a matching approach cue in the chrome (4.2.2). Cars are placed `world.spawnLeadIn` outside the play edge so they enter at cruise speed.
4. **Start position.** The dummy starts on band 0, off any hazard, with a sightline to at least one lane, and can reach every lane on foot with no upgrades.
5. **No-upgrade route.** At least one way in that needs no upgrade exists on each side of every road. A hazard line may never be the only route to a lane.
6. **Occlusion.** Sensor-blocking terrain and props cover no more than `world.occludedFractionMax` of the play area, and at least 0.10 of it unless the level declares the exemption and names the tree branches it does not exercise.
7. **Purchase coverage.** Every tier-1 node offered before this level has an immediate use in it — a retrievable cone with clear recovery space for Carry, a crossable gap for Jump, a low-grip surface for Grip.
8. **Pacing.** Crossing times for the level's traffic mix fall inside the 10.2 pacing band at the declared extent.
9. **Hazards off roads.** Holes are never on roads in the first version.
10. **Witness.** Each level has a replayable whole-run witness meeting its quota and certification against finite admitted traffic, with full damage and accounting rules, service, battery, minimum damaged reach, learning at cap and every mood. It is proved against the declared extent. Test single-model traffic as well as the scheduled mix. A walkability check alone proves nothing about lethality.

Clauses 1–9 are geometric and cheap to check. Clause 10 is the expensive one and the only one that proves the level is playable. With authored levels there are three witnesses, not a seed space.

Terrain, structures, hazards and props are held as `tables.terrain` and `tables.props` rows in the registry, addressable as `world.terrain.<id>.<field>`.
## 8 Impact and Scoring

Contact between the player and the fleet belongs to neither, so it is specified here. Detection and commitment are the fleet's (6.3); the lunge is the player's (5.2); what happens when they meet is this section.

### 8.1 How a hit is earned

**Baiting.** Walk parallel to a car, then walk away from its path. When its chevron locks, lunge back into that path.

**Ambush.** Emerge from behind another vehicle or a sensor occluder. A car that never detected you has not slowed for you and displays no detection chevron.

The approach vocabulary the fleet learns from is defined in 6.4.

### 8.2 Collision resolution

- **Rear contact** pays 5%. It still counts as contact for the Non-compliant ending.
- **One impact per car** (Built). One damaging or scoring impact for the lifetime of a spawned appearance, across replacement bodies. A later appearance of the same model has a new allowance. The first physical contact consumes the allowance even if damage is zero (Proposed; must pass slow-traffic feasibility before approval). Contacts still resolve physically and count for contact-based endings after the allowance is spent. Hold on consumes the same allowance.
- **Glancing hits** can destroy a body.
- **Solid cars** (Built). Every car has a collision box on every side. The dummy cannot pass through a car, and cars never overlap. Cars avoid each other and give way. On roads they stay between the barriers, swerving onto the hard shoulder if they need to.

### 8.3 The damage table

Health is the dummy's chassis, sized by `damage.bodyHealth`. Damage per hit is:

> `damage.baseImpact` × the zone share × `damage.lungeMultiplier` when lunging × the car's speed and mass, relative to a sedan at cruise

Shares are head-on 100%, diagonal front 60%, side 30%, diagonal rear 15%, rear 5%. At cruise a head-on lunge pays 500 against a sedan, about 650 against a van and about 1,170 against a bus. A single hit is capped at `damage.bodyHealth`, and a write-off adds `rewards.writeOff`.

Every point counts toward the run's score. Damage does not earn credits; credits come from write-offs alone (9.1). At the current `damage.bodyHealth`, a fresh body takes about four head-on lunges from a sedan, three from a van or two from a bus.

**Parameters — damage and rewards**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `damage.bodyHealth` = 1600 health (About four head-on sedan lunges, so a body is spent deliberately rather than lost)
- `damage.baseImpact` = 100 damage (The reference unit; every other damage figure is a multiple of it)
- `damage.lungeMultiplier` = ×5 (Lunging pays five times standing, which is the anti-standing rule in arithmetic)
- `damage.zone.front` = ×1 (Head-on pays full; the hardest approach pays the most)
- `damage.zone.frontDiagonal` = ×0.6 (Rewards intercepting a committed route rather than meeting it square)
- `damage.zone.side` = ×0.3 (A flank hit on a braking car; reachable but cheap)
- `damage.zone.rearDiagonal` = ×0.15 (Near-worthless, to stop players chasing departing cars)
- `damage.zone.rear` = ×0.05 (Counts as contact for Non-compliant, pays almost nothing)
- `rewards.writeOff` = 2500 points (Larger than any single impact, so finishing a body always beats farming one)

### 8.4 Accounting (Proposed)

- Compute impact from zone, the car's speed and mass normalised to the sedan-at-cruise reference, and the eligible dummy action. Cap at `damage.bodyHealth` per impact.
- `healthLost = min(remainingHealth, impactDamage)`.
- Award the full assessed `impactDamage` as points, including the portion beyond remaining health. Track that excess separately for analysis.
- Award `rewards.writeOff` exactly once when an impact reduces health to zero.
- Rewards never damage or heal the body. There is no overkill bonus.
- Any score-only surface modifier, such as `damage.plateMultiplier`, affects points — never health loss or write-off count.
- A committed impact records event ID, run ID, body ID, appearance ID, model ID, zone, action, approach evidence, damage, health lost, points and write-off bonus. Duplicate event IDs are rejected.
- Kinetic charge reads pre-bonus damage, never rewards. A lethal impact's refill is discarded with the old body.

### 8.5 Service

FARSIGHT repairs an idle dummy. It reads as corporate care and functions as the anti-idle rule: standing around undoes the damage you have accumulated, so the fastest route to a write-off is to keep working.

- **Trigger.** `service.idleSeconds` of no impact received and no lunge spent, during active play only. Walking, turning and looking do not reset the timer; baiting without connecting does not count as working.
- **Warning.** A cue fires `service.warningSeconds` before the repair, so the restoration is never a surprise.
- **Effect.** Health restored to `damage.bodyHealth` × `service.restoreFraction`. No points and no credit, because no write-off occurs (9.1).
- **Limit.** Once per body. The flag resets only on a new body — not on a fall, a report, a purchase or a level transition. The body and its service flag carry across levels.
- **Clocks.** The timer advances only during active play. Reports, the shop and pauses freeze it.

Restore-and-redamage farming can inflate the high score but cannot buy an upgrade (9.1), so it is a score concern rather than a progression exploit. Measure score per minute against purposeful write-offs.

**Parameters — service**

- `service.idleSeconds` = 20 s (Long enough that cautious play is never punished; short enough that standing still is)
- `service.warningSeconds` = 5 s (Lead time on the repair cue, so the player can act before losing their damage)
- `service.restoreFraction` = ×1 (Full restoration. A partial repair would be a gentler punishment and a worse joke)

### 8.6 Destruction and reports

- At zero health, record one write-off.
- Unless an ending triggers — Licensed first, then shift-end priority if traffic is exhausted — pause simulation and traffic generation for the responsible car's report.
- The player dismisses it, receives a fresh body and resumes. Shift analysis uses the same pause and dismissal.
- Escaped cars leave. The dummy is not recalled.
- **Body carry-over between shifts** (Proposed). Preserve health, charge and service use. Move the dummy to a safe level entry and clear transient actions and attachments.

*Built.* A write-off plays a destruction animation of `feedback.writeOffSeconds`, then shows the responsible car's report card. The upgrade screen opens from that card (Proposed; 9.3).

## 9 Economy and Upgrades

Upgrades are earned through play, with points and credits kept separate. Credits are not derived from points. One destroyed body is one credit. Prices are stated in bodies.

### 9.1 Points and credits

| | Points | Credits |
|---|---|---|
| Earned from | Every point of damage, plus the write-off bonus | One per write-off. Nothing else |
| Measures | How well you played | How much you spent of yourself |
| Spent on | Nothing. Points only go up | Upgrades |
| Shown | Score on the HUD; the run's high score | Credits on the HUD and the upgrade screen, labelled as bodies |

- **Damage never buys progression.** Zone shares, the lunge multiplier, `damage.plateMultiplier` and final-hit excess affect points only.
- **Service cannot be farmed** (8.5). Restoring health and re-damaging earns points, never credits. This closes the farming risk without restricting service.
- **One act, one unit.** Write-offs already drive quotas (10.3), certification (10.6) and fleet learning (6.4). They now drive progression.
- **The final write-off pays nothing spendable.** It triggers Licensed (10.7) and ends the run before a shop opens.

### 9.2 Prices (Proposed)

Prices vary by how much a node changes play. Nodes that add a verb cost more than nodes that scale a number.

| Node | Branch | Tier | Price | Why |
|---|---|---|---:|---|
| **Big battery** | Battery | 1 | 1 | A number. Deliberately the cheapest node, so a first purchase is possible after one write-off |
| **Hips** | Torso | 1 | 2 | Doubles `movement.turnRate`. Strong, but still a number |
| **Wider view** | Head | 1 | 2 | Information, not action |
| **Carry** | Arms | 1 | 2 | Activates the B button; needs a cone present to pay off |
| **Spring start** | Legs | 1 | 2 | Removes `movement.rampSeconds`. The first step costs nothing |
| **Grip** | Legs | 2 | 2 | Removes the slide on diesel, gravel and puddles |
| **Throw** | Arms | 2 | 2 | Extends Carry rather than adding a verb |
| **Fast charge** | Battery | 2 | 2 | A multiplier |
| **Memory** | Head | 2 | 3 | Persistence of sensing |
| **Ears** | Head | 2 | 3 | Warning from outside the cone |
| **Neck** | Torso | 2 | 3 | Decouples look from facing |
| **Jump** | Legs | 2 | 3 | New traversal; gated on gaps existing in the level |
| **Kinetic charge** | Battery | 2 | 3 | Changes resource rhythm |
| **Spine** | Torso | 2 | 4 | Steers a committed lunge. The strongest single node |
| **Hold on** | Arms | 2 | 4 | Rides a vehicle; the most complex state |

- Tier 2 requires its branch's tier 1.
- **Whole tree:** 38 bodies. Unaffordable by design.
- **Spendable in a run:** 14, at `run.certification` 15.

**Sample builds at 14 bodies**

| Build | Purchases | Nodes |
|---|---|---|
| Broad | Big battery 1, Hips 2, Wider view 2, Carry 2, Spring start 2, Throw 2, Fast charge 2 | 7 |
| Deep legs and torso | Spring start 2, Jump 3, Grip 2, Hips 2, Spine 4 | 5 |
| Information | Wider view 2, Memory 3, Ears 3, Hips 2, Neck 3 | 5 |

Five to seven nodes of fifteen per run, about a third of a 38-body tree. No two runs build the same dummy.

**Pacing check (Open).** At 15 write-offs a full run runs to about 20 minutes at 80 seconds each, mid-horizon (pillar 4). A five-minute visit yields about three bodies — Big battery plus Hips, or Hips plus Spring start. Two purchases, meeting the target in 10.2 at its lower bound. Measure before approval. Gate: 13.1.

**Parameters — upgrade prices**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `economy.price.battery` = 1 body (The cheapest node, so a first purchase is possible after one write-off)
- `economy.price.torso` = 2 bodies (Tier 1. Doubles turn rate)
- `economy.price.head` = 2 bodies (Tier 1. Opens the view cone)
- `economy.price.arms` = 2 bodies (Tier 1. Activates the B button)
- `economy.price.legs` = 2 bodies (Tier 1. Spring start: the first step costs nothing)
- `economy.price.legs.grip` = 2 bodies (Tier 2. Removes a hazard rather than adding a verb, so the cheapest tier-2 node)
- `economy.price.arms.throw` = 2 bodies (Tier 2. Extends Carry rather than adding a verb)
- `economy.price.battery.fastCharge` = 2 bodies (Tier 2. A multiplier)
- `economy.price.head.memory` = 3 bodies (Tier 2. Persistence of sensing)
- `economy.price.head.ears` = 3 bodies (Tier 2. Warning from outside the cone)
- `economy.price.torso.neck` = 3 bodies (Tier 2. Decouples look from facing)
- `economy.price.legs.jump` = 3 bodies (Tier 2. New traversal, gated on gaps existing in the level)
- `economy.price.battery.kineticCharge` = 3 bodies (Tier 2. Changes resource rhythm)
- `economy.price.torso.spine` = 4 bodies (Tier 2. Steers a committed lunge; the strongest single node)
- `economy.price.arms.holdOn` = 4 bodies (Tier 2. Rides a vehicle; the most complex state)

### 9.3 The upgrade screen (Proposed)

- **When it opens.** On nonterminal write-off cards and between continuing levels. Combined into one purchase phase when they coincide. Ending priority resolves first.
- **Layout.** A radial tree, five branches, each forking once. The dummy centred, owned nodes lit, affordable highlighted, locked dimmed.
- **Each node shows** its price in bodies, a line of eight words or fewer, and a three-second looping preview, because players do not read.
- **Unaffordable nodes show the shortfall** as "2 bodies away". Coarse pricing has no partial progress, so the distance must be visible.

### 9.4 Persistence (Proposed)

Upgrades last for the rest of the run, across bodies. A new run starts unmodified. A loaded run restores the upgrades it owned (12.4).

### 9.5 High score

Points set the high score. Score measures skill alone: a bus write-off and a sedan write-off buy the same upgrade, but not the same score.

**The table ships.** Ten entries, three initials each, entered with the direction input and A. An exhibition cabinet runs on the table: it is what the friend watching over the shoulder is playing for, and it is the attract screen between visitors.

- Shown on RESULTS after every run, with the new entry highlighted.
- Shown as the idle screen when no one is playing.
- Persists locally, with its own schema. NEW GAME never clears it (12.4).

### 9.6 The economy system

| Part | What it does |
|---|---|
| `economy` data | Per-node prices in bodies |
| `upgrades` data | The fifteen tree nodes, each an edit to `body` (11) |
| Economy module | Adds points on each hit and write-off; adds one credit per write-off; spends credits; checks prices and prerequisites |
| Body module | Derives statistics and abilities from immutable base data plus owned upgrade IDs |
| Upgrade screen | The radial tree on the write-off card |

**Purchase contract** (Proposed). Credits are whole bodies; no fractional balance exists. Validate ID, price, prerequisite, ownership and balance together, then deduct once and add the ID once. Recompute derived statistics from the immutable baseline plus owned IDs in stable order, so a node can never be applied twice. A capacity increase does not refill the current body; the next body starts full. Shop re-entry or double input cannot duplicate a purchase.

**Checks** (Proposed):

- points never fall;
- credits never go below zero, and never increase except on a write-off;
- credits earned across a run never exceed write-offs recorded;
- the terminal write-off grants no spendable credit and opens no shop;
- a tier-2 node is never owned without its tier-1;
- no upgrade touches health or damage taken;
- every level is completable with no upgrades.

## 10 The Run

### 10.1 Gameplay loop

```
[Look: turn the view cone] -> [Bait / cover] -> [Read route] -> [Lunge: spends battery]
Miss -> [Recovery; battery refills over time] -> [Look again]
Scoring hit -> [Damage -> points; log evidence]
|-- Body survives -> [Look again]
+-- Body destroyed -> [Write-off: +1 credit + quota + certification + one model learning update]
    |-- Below target, no shift-end ending -> [Report -> upgrade screen] -> [Fresh body; upgrades kept] -> repeat
    |-- Traffic exhausted + shift-end ending -> [Ending; no shop]
    +-- Final required write-off -> [LICENSED ending scene]
[Rear contact: pays 5%; counts as contact]
[Traffic exhausted] -> [Shift-end checks in 10.7]
```

### 10.2 Progression across four horizons

| Horizon | Player time | The decision | What grows | Closure |
|---|---|---|---|---|
| **The attempt** | Under a minute | Commit this lunge, or turn and wait | Reading and timing | A hit, or a miss that is funny |
| **The body** | Five minutes | Which cars to spend this body on | The dummy, from machine to human | The report card, then a freedom bought |
| **The run** | 20–30 minutes | Which freedoms to buy, in what order | Certification progress; the fleet's training | Licensed, Non-compliant or Decommissioned |
| **The pull** | Three hours and beyond | Which dummy to build this time | The high score; knowledge of the fleet and the tree | They look the game up afterwards |

The attempt and the body are different decisions on different clocks. A five-minute visitor completes both.

The fleet progresses alongside the dummy, and the two push against each other (pillar 3):

```
THE DUMMY (you)                         THE FLEET (the cars)
[Write-offs -> credits]                 [Write-offs -> model experience]
        |                                         |
[Upgrades: machine -> human]            [New -> Practised -> Experienced -> Senior]
        |                                         |
[New ways into a car's path] ---------> [Cars learn each new approach]
        ^                                         |
        +--------- [A trick stops working] <------+
```

**Pacing targets** (Proposed)

- A hit lands inside the first minute, or the attempt horizon has failed.
- The first purchase after the first or second write-off. The shop never opens mid-body.
- Two or three upgrades in a five-minute visit.
- A five-minute visit never ends mid-body with nothing resolved.
- At 15 write-offs, a 20-minute session permits at most 80 seconds per write-off including reports, purchases and transitions. A five-minute visit with three write-offs permits 100 seconds each.
- Measure active play and pauses separately. If the target fails, revisit tuning or the quotas in 10.3 rather than silently extending session length.
- Upgrade counts in 9.2 are conditional examples, not measured targets.

### 10.3 Run structure

- At most `run.appearanceCeiling` vehicle appearances per run. A ceiling that bounds a pathological run, never a pacing target.
- Each shift schedules traffic and a quota of bodies to destroy.
- Every generated vehicle counts toward the budget, including those ignored.
- A level ends when its last vehicle and the collisions it causes have resolved.
- Endings may stop the sequence early.

**Three levels, in this order:** Road, Cross junction, Roundabout (7.2).

**Quotas and traffic** (Proposed; re-cut from the five-level plan). Quotas are 3, 5 and 6, summing to 14, with certification at 15 — one above the sum, so minimum performance never certifies. The run stays at fifteen write-offs and about twenty minutes.

| Level | Appearances | Sports | Hatchback | Sedan | Wagon | Van | Bus | Why |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 Road | 24 | 20% | 15% | 30% | 15% | 10% | 10% | Fast and sparse. The bus is the beginner's target |
| 2 Cross junction | 36 | 15% | 20% | 30% | 15% | 15% | 5% | Mixed streams; the hatchback's recommitment is the lesson |
| 3 Roundabout | 44 | 20% | 15% | 25% | 15% | 15% | 10% | Every class in continuous circulation. The exam |

104 appearances across a full run, at about seven per body — the ratio the vertical slice measured.

**Spawn schedule.** Appearances are released at a per-level interval tuned so traffic is continuous without queueing at entry (6.2, `traffic.entryRoomLengths`). Each appearance draws its class from the pool, its tier and model from the fleet roster (6.1), and its mood from the shares in 6.5 — all seeded, so a run replays identically.

**Parameters — run**

*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

- `run.quota.road` = 3 bodies (The tutorial level in all but name; three bodies teaches the loop and funds a first purchase)
- `run.quota.junction` = 5 bodies (Committed routes are harder to read, but mixed streams give more openings)
- `run.quota.roundabout` = 6 bodies (Continuous traffic, so bodies come faster even though the level is hardest)
- `run.certification` = 15 bodies (One above the quota sum of 14, so minimum performance never certifies)
- `run.appearanceCeiling` = 1000 vehicles (A ceiling that bounds the run, never a pacing target)

### 10.4 Generation

Generation must preserve lethal routes until the winning hit, including minimum mobility and single-model traffic. Validate the whole quota and certification route against remaining traffic, body health, service state, learning and moods. This includes a dummy with no upgrades (pillar 1).

Feasible generation does not rescue every missed opportunity; player mistakes may make the quota fail. That is not the same as an impossible run.

### 10.5 Difficulty and escalation

```
[Write-off + recorded approach] -> [Responsible model experience; sharing off]
|
[New] -> [Practised] -> [Experienced] -> [Senior]
broad openings            earlier detection / more avoidance
|
[Player adapts: baiting, cover, target selection and upgrades]
|
[Traffic exhausted + quota met + no ending] -> [Next level]
|
[Final certification write-off] -> [Scripted fleet avoidance]
```

- Training progressively narrows easy openings, so later encounters demand better timing and use of cover.
- Level layouts vary the problem; they do not automatically promote models.
- Mood adds encounter variation at any level.
- Tune seniority thresholds and traffic mixes together, preserving pillar 1 throughout. Complete avoidance belongs only to the ending scene.
- Upgrades widen the player's options as training narrows them, so tune the two together (Proposed).

### 10.6 Certification

Certification is total write-offs across the run. The target exceeds the sum of shift quotas, so minimum performance is insufficient. It must remain attainable within the traffic budget while meeting each completed shift's quota. Score measures impact value; it does not replace write-offs.

*Built.* The slice's target is 11, one more than the sum of its three quotas. The target for the three-level run is `run.certification`.

### 10.7 Endings

**Licensed.** The final required write-off wins immediately; no later quota check runs. Certification releases the dummy from its testing contract, not a driving prohibition. A replacement dummy enters the bay; a car detects it and stops, with traffic queuing behind. FARSIGHT issues the licence: "Fleet certified. Operator licence issued. Subject is not cleared to operate a vehicle."

**Non-compliant.** After meeting quota in an earlier shift, complete a whole shift with no lunge and no contact. An authored bus-narrator message files this ending; it does not require a bus in current traffic.

**Decommissioned.** Miss a shift quota, or finish the contract without certification.

**Priority.** At shift end, resolve Licensed, then Non-compliant, then dismissal, then continuation. A terminal outcome opens no shop and admits no replacement body. Certification on the last car wins before any dismissal check. Meeting all three quotas without the extra certification write-off still produces Decommissioned at contract end.

*Built.* The slice has all three ending cards.

### 10.8 Working decisions

- Three-level order: set.
- **Settled:** service timing (8.5), learning triggers and caps (6.4), mood ranges (6.5), per-level traffic allocation (10.3).
- **Open:** quotas and the certification threshold (10.3). Gated on pacing measurement and the finite-traffic witness (13.1).
- **Proposed:** body carry-over (8.6), per-node prices in bodies (9.2).
- The damage table and the no-health-upgrade constraint are anchors. Accounting semantics may change; damage values may not.
- Still to tune: battery capacity and refill, turn rate, view-cone width.
## 11 Game Data

### 11.1 How data works now (Built)

Everything tunable is data, and code implements each behaviour once:

1. The specification holds the numbers.
2. The build copies them into the game as `PARAMS`.
3. The executable checks read the same `PARAMS`. A check fails the build if the game's numbers differ from the specification.

A check therefore cannot test different numbers from the ones the game plays.

| Group | Holds |
|---|---|
| `dummy` | Walk and run speed, lunge distance, duration and recharge, health, wear floor, write-off bonus |
| `impact` | The damage table: base points, five zone shares, the lunge multiplier, reference speed and mass |
| `perception` | Reaction delay, side-sensor radius and angle, speed factors, front range |
| `classes` | Six vehicle classes: size, speed, mass, behaviour flags, learning start, step and cap |
| `fleet` | Twelve numbered models |
| `levels` | Kind, name, quota, vehicle allocation, traffic pool, spawn interval, road geometry |
| Others | `writeOff`, `caution`, `service`, `carToCar`, `certificationTarget` |

Two modules do the work: `Damage` works out which part of the car was hit and assesses the damage; `Vehicles` handles driving, cruising speed and senses.

The port from the Testpad fixed three problems: speed no longer depends on refresh rate, randomness is seeded so runs replay, and holding the lunge button no longer chains lunges.

### 11.2 What to add (Proposed)

Five new modules — `Body`, `World`, `Economy`, `Sensing`, `Traffic` — and these data groups:

| Data | Holds | Read through | Module |
|---|---|---|---|
| `body` | Each part's statistics and ability flags | `Body.stat(part, name)`, `Body.can(ability)` | Body |
| `upgrades` | The fifteen tree nodes; each is an edit to `body` | The upgrade screen | Body |
| `battery` | Capacity, refill rate, cost per lunge and jump | `Body` | Body |
| `economy` | Per-node prices in bodies | `Economy.earn()`, `Economy.buy()` | Economy |
| `sensing` | View-cone width; fog-of-war test values | `Sensing.canSeeZones(car)` | Sensing |
| `terrain` | One row per surface or structure (7.3) | `World.surfaceAt(x, y)` | World |
| `props` | One row per prop type (7.6) | `World.propsNear(x, y)` | World |
| `levels` (extended) | Ground, terrain rectangles, barriers with gaps, props, holes, start position | `World` | World |
| `traffic` | Lanes and directions, right-of-way rules, junction reservations, navigation tuning (6.2) | `Traffic.mayEnter(car, junction)` | Traffic |
| `classes` (extended) | Mass, length, width, height per class (6.1) | `Vehicles` | Vehicles |

**Terrain** never moves: ground, kerbs, barriers, walls. **Props** are objects placed on it: cones, which move, and crates, which are fixed.

### 11.3 Rules for the data (Proposed)

- **Layers.** A level has one default ground, and rectangles are painted over it in order. The surface query returns the top one.
- **Surface and occupancy.** Height band is descriptive metadata, not the collision rule. `World.surfaceAt` returns ground, hazard and movement modifiers. `World.queryOccupancy` returns solid footprints, movable props and sensor occluders separately. Explicit fields decide `walkable`, `blocksJump`, `gap`, `pushable` and which sensors are blocked. Kerbs and cones share band 1 and behave differently. A prop over a hole must not erase the hole. Swept collision uses the whole footprint, never the centre point. Gap jumps clear only flagged gaps and scripted tiles; solids remain blocking.
- **Stable IDs.** IDs are fixed strings, so reports, barks and learning can refer to them.
- **Reject before the run starts:** unknown IDs, cyclic prerequisites, illegal upgrade targets, missing route exits, invalid units and out-of-range values.
- **Replay** needs the configuration hash, the seed, the fixed timestep, input edges and any live parameter changes. A seed alone does not reproduce a changed configuration.

**Checks** that read the same data:

- every terrain and prop row is complete;
- every level has a footprint-safe walkable route from the dummy's start to every lane with no upgrades;
- separately, a replayable whole-run witness meets each quota and certification using finite admitted traffic, full damage and accounting rules, service, battery, minimum damaged reach, learning and moods. A flood fill cannot prove lethal feasibility;
- holes are never on roads;
- every upgrade changes at least one ability or statistic, and none touches health or damage taken;
- the economy checks in 9.6;
- the traffic checks in 6.2.

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

## 12 Production and Delivery

### 12.1 Scope

Three levels, the full tree, four weeks.

**In**

- Three levels: Road, Cross junction, Roundabout. Hand-authored.
- The full tree: fifteen nodes, five branches, each forking once.
- Two learning approaches — direct interception and post-commit bait — with caps that leave a lethal opening.
- Eight vehicle classes across four price tiers, one model each. Four moods.
- All three endings. A fixed bark bank.
- NEW GAME, PAUSE, CONTINUE, SETTINGS, DEBUG, live tuning and recording.
- Autosave at level boundaries, and the high-score table.

**Out** (13.3)

- Level generation. Any level beyond the three.
- The remaining four learning approaches.
- The authored bark pipeline. Weather. Mid-play saves.

### 12.2 Build order

0. **Thin shell.** Input router, focus stack, clock, pause, the tuning registry, the session recorder. Against a placeholder scene.
1. **The baseline, alone.** The lunge and steer-to-direction. Greybox turning, movement and the lunge with nothing else — no upgrades, no fleet learning, no economy. Run the first-time-player gate (5.2) before anything is built on it. Two things must pass: turning reads as characterful rather than broken, and the greybox is worth five minutes on the strength of the lunge alone. The fallback — instant eight-direction movement with the ladder re-expressed as statistics — is cheap now and expensive later.
2. **One complete loop.** Two-way right-hand traffic with junction rules and the deadlock rule. Class dimensions and the rear-axle pivot. Detection and commitment cues. The view cone. The battery. The damage loop, write-off and report card. Prove one whole-run no-upgrade witness before expanding content.
3. **Economy and the tree.** Points, body-credits, the upgrade screen, body replacement, level transition. Build Hips first: it is the clearest test of whether the machine-to-human ladder reads to a player.
4. **Levels 2 and 3.** Cross junction to two-way. The roundabout from scratch: circulating lanes, yield-on-entry, exit signalling, central island. Barriers with gaps, holes, cones.
5. **Learning, moods, endings.** Two approaches. The three ending cards and shift analysis.
6. **Art, audio, high-contrast mode.** Against 4.1, after cue contrast has been measured.

### 12.3 Schedule

**Blocking: the start date.** Four weeks from a date not yet fixed against the exhibition. Confirm before week 1.

| Week | Build | Ends with |
|---|---|---|
| **1** | Thin shell. The control greybox: turn, move, lunge, nothing else | **Control gate (5.2).** First-time players, five minutes. If the dummy reads as broken, tune `movement.turnRate` and `movement.turningSpeedFraction` before week 2 |
| **2** | The baseline on level 1: traffic, dimensions and pivot, detection and commitment cues, battery, damage, write-off, report card | One complete loop — bait, lunge, damage, write-off, report. **Extent gate:** traffic re-tuned and a witness at 800 × 600. **Cue contrast gate:** measured against the real palette, ahead of any art |
| **3** | Economy and all fifteen nodes. Purchase, replacement, transition. Cross junction to two-way. The roundabout built from scratch. All three endings | A full certification run across three levels. **First outside playtest** — pacing and the finite-traffic witness |
| **4** | Learning on two approaches, moods, the high-score table, boundary autosave and CONTINUE, clause 10 witnesses, art pass, audio, high-contrast mode, playtest fixes | The exhibition build |

**Two levels exist, one does not.** Road carries forward. Cross junction needs two-way traffic. The roundabout is new; its circulating-priority and exit-signal rules are a variant of the give-way logic built for Cross junction, which is the only reason it fits in the same week. If week 2 overruns, the roundabout is the first thing to lose — ship two levels rather than three unfinished ones.

**The shell grows with the build.** Week 1 ships the router, clock, pause, registry and recorder. Each later module joins the registry as it arrives.

**Gates, mapped.** Control feel — week 1. Extent and cue contrast — week 2. Pacing and the finite-traffic witness — week 3. These three points may change the plan; everything else is work that slips or is cut. Week 4 has no gate because there is no week 5 to respond to one.

**The playtest is in week 3.** It tests the loop without learning present. The loop is what most needs outside eyes, and week 4 has to be able to act on what it finds.

### 12.4 Developer tools

Balance is found by playing, so the tools ship with the first milestone rather than after it.

**One registry, two views.** `tuning.parameters.json` is canonical and versioned. The code reference and the tuning controls are generated from it. Each entry has a stable ID, group, label, description, unit, type, default, status, owner, editability, validation, application boundary and design bounds.

**Four words, used consistently.** **Default** is the baseline. **Active** is what the run is reading. **Staged** is queued and not yet applied. **Derived** is the upgrade-modified value. Hips modifies the effective turn rate; that derived rate appears beside the baseline and never overwrites it.

**DEBUG → LIVE TUNING.** Search by name or ID, a Changed-only filter, and each row showing default, active, staged and derived. Apply live at a declared boundary: next tick, next action, or next spawn. Movement shapes apply to the next action and never deform an action in flight. Changing capacity clamps charge without refilling. Prices affect future purchases only. Damage changes affect later impacts, never recorded ones. Reject non-finite numbers, negative durations, out-of-range fractions and unknown IDs without partial mutation.

**Balance settings are visible, saved and exportable.** A named preset persists across sessions, separate from any game state. Export as UTF-8 plain text, readable without the game: format version, preset name, build version, config revision, baseline identity, timestamp, and every parameter as `stable.id = value [unit]`, grouped by module. Staged and derived values are listed separately and never confused with inputs.

**Recording.** Every accepted edit stores its event ID, session and run ID, wall-clock time, simulation tick, parameter, old and new values, effective boundary and resulting config revision. Rejected edits record separately with the reason. Feedback notes link to the exact revision and gameplay window, so "too slow" refers to the settings actually played. An intentionally unbalanced experiment may run, labelled unverified; it is never described as balanced or certified.

**Shell.** One input router maps devices to named commands. A focus stack routes each input edge to exactly one context, so editing a numeric field cannot move the dummy. Losing application focus pauses play; returning requires explicit Resume. PAUSE freezes every gameplay clock. Reports and endings keep their phase and cannot be escaped by closing a panel.

| Screen | Offers |
|---|---|
| **MAIN MENU** | NEW GAME · CONTINUE · HIGH SCORES · SETTINGS · DEBUG. CONTINUE is disabled with an explanation when no save exists |
| **PAUSE** | Resume · Save and quit · Settings · Debug · Main menu. Leaving unsaved play asks Save and quit / Discard and quit / Cancel |
| **RESULTS** | The outcome, the high-score table with the new entry highlighted, New game, Main menu |

#### Saving a run

Saves happen at level boundaries, never mid-play. That is the whole reason this is cheap.

- **Autosave** after every shift analysis, before the next level loads. One slot, overwritten.
- **Save and quit** from PAUSE writes the same snapshot at the next boundary the run reaches, or immediately if the run is already between levels.
- **CONTINUE** restores it and enters paused review; the player presses Resume.
- A completed run clears the slot. Endings are not resumable.

The snapshot holds schema and build version, run and seed state, current level, quotas met, certification count, score, credits, owned upgrade IDs, the body's health, charge and service flag, and the model learning snapshots. Nothing else is needed, because no vehicle is on screen at a level boundary.

**Deliberately not saved.** Live appearances and their spent-impact flags, traffic reservations and junction queues, a lunge or jump in flight, a carried cone, an attachment. Snapshotting those is the expensive version of this feature and it buys nothing a boundary save does not.

Validate and stage a loaded snapshot before replacing anything. An invalid or incompatible save leaves the last valid one intact and says why. Named tuning presets, settings and the high-score table have their own schemas and lifecycles; NEW GAME clears none of them.

### 12.5 Build acceptance

Every check reads the same data the game plays (11.1). A check that reads its own copy of a number proves nothing. Check IDs are stable and prefixed `BA-`; QA reports cite them. **None have been run.**

**A — Feasibility and completion**

- **BA-A1.** Every approved run profile has whole-run no-upgrade feasibility evidence, not lane access alone.
- **BA-A2.** Each level's witness is proved against that level's declared extent (7.1).
- **BA-A3.** The witness uses finite admitted traffic, full damage and accounting, service, battery, minimum damaged reach, learning at cap and every mood.
- **BA-A4.** Single-model traffic passes as well as the scheduled mix.
- **BA-A5.** The extra write-off above the 14-quota minimum is demonstrated.
- **BA-A6.** Clauses 1–9 of the level contract (7.9) pass on every level.
- **BA-A7.** Static occlusion stays within `world.occludedFractionMax` and above its floor, or the level declares the exemption and names the branches it skips.
- **BA-A8.** Holes are never on roads.

**B — Movement and controls**

- **BA-B1.** The steer-to-direction baseline passes the first-time-player gate in 5.2 before any upgrade is built on it. Gate: 13.1.
- **BA-B2.** A direction press is accepted while idle, moving and recovering. It is rejected during a lunge, a jump and a fall.
- **BA-B3.** A rejected action spends no charge.
- **BA-B4.** Each button press does the one thing specified, even when presses come close together.
- **BA-B5.** Every reach extension shrinks with damage to `movement.wearFloor`.
- **BA-B6.** Every movement freedom named in 5.2 is absent at the baseline and present once its upgrade is owned.
- **BA-B7.** A player can say what each owned freedom let them do.
- **BA-B8.** A fall costs `world.fallRecovery` and nothing else. No damage, no write-off, no fresh-body allowance.
- **BA-B9.** Releasing the input coasts for `movement.stopSeconds`, further by `movement.lowGripStopMultiplier` on low grip, and shorter by `movement.counterPressStop` when the player presses back.

**C — Vehicles and traffic**

- **BA-C1.** Every class declares `mass`, `length`, `width` and `height`. No check substitutes a default for a missing dimension.
- **BA-C2.** The swept footprint uses `length` and `width`, not a centre point.
- **BA-C3.** A turning vehicle pivots at `traffic.pivotOffset`. Its tail never sweeps outside the footprint it is seen to occupy.
- **BA-C4.** Traffic reserves the swept area through a turn, not the destination footprint.
- **BA-C5.** Classes at or above `vehicles.occlusionHeight` block side sensors and the player's read. Classes below block neither.
- **BA-C6.** The traffic checks in 6.2 pass on every level.
- **BA-C7.** Detection and commitment fire at the declared ranges for each class.
- **BA-C8.** The hatchback's single signalled recommitment happens once. There is no third decision.
- **BA-C9.** Circulating traffic holds priority on the roundabout, and a signalled exit arm is honoured.
- **BA-C10.** Class weights and the appearance cap hold across a run.

**D — Damage and accounting**

- **BA-D1.** Standing in a lane and lunging pays 150 or less against a sedan, including a fully trained car and a car with no room to swerve.
- **BA-D2.** A collision commits damage, points and credits exactly once. Duplicate event IDs are rejected.
- **BA-D3.** A lethal impact latches one write-off and stops further impacts on that body.
- **BA-D4.** `damage.plateMultiplier` applies on calibrated plates only, and to points only.
- **BA-D5.** An airborne dummy struck by a car uses the same solid collision and zone rules, and keeps the lunge multiplier.
- **BA-D6.** Service restores the body once, after `service.idleSeconds`, warned `service.warningSeconds` ahead.
- **BA-D7.** Service-led score farming does not dominate a run.

**E — Economy and upgrades**

- **BA-E1.** The economy checks in 9.6 pass.
- **BA-E2.** Every upgrade changes an ability or a statistic. None touches health or damage taken.
- **BA-E3.** A purchase validates ID, price, prerequisite, ownership and balance together, then deducts once.
- **BA-E4.** Shop re-entry or double input cannot duplicate a purchase.
- **BA-E5.** Derived body statistics recompute from the immutable baseline plus owned IDs in stable order.

**F — Learning and endings**

- **BA-F1.** A model at full training on every implemented approach is still beatable by an unupgraded dummy at minimum reach (6.4).
- **BA-F2.** Every learning cap leaves a lethal opening.
- **BA-F3.** Recognisable models repeat often enough for learning to be visible.
- **BA-F4.** A first-time player can name a car that has beaten them twice.
- **BA-F5.** Mood proportions hold over a run (6.5).
- **BA-F6.** Ending priority resolves Licensed, then Non-compliant, then Decommissioned, then continuation.
- **BA-F7.** A terminal outcome opens no shop and admits no replacement body.

**G — Presentation and cues**

- **BA-G1.** Every tier-1 and tier-2 cue is readable at exhibition distance at full texture density. Gate: 13.1.
- **BA-G2.** The same cues are readable again in high-contrast mode.
- **BA-G3.** No tier-1 fact is carried by colour alone.
- **BA-G4.** Texture, noise and panel detail never alter a reserved cue.
- **BA-G5.** A recurring model's ID tag and seniority mark are legible at exhibition distance.
- **BA-G6.** No gameplay module reads display dimensions, device pixel ratio or window size.

**H — Tools**

- **BA-H1.** Every gameplay module registers inspectable state, tunable parameters and measurements.
- **BA-H2.** A live edit reaches its consumer at the declared boundary and records the effective tick.
- **BA-H3.** The displayed active value equals the value the module actually reads.
- **BA-H4.** PAUSE freezes every gameplay clock, and no UI input leaks into gameplay.
- **BA-H8.** Autosave at a level boundary, then CONTINUE, restores level, quotas, certification, score, credits, upgrades, body state and model learning. An invalid save leaves the last valid one intact.
- **BA-H9.** NEW GAME clears the run slot and nothing else. Settings, tuning presets and the high-score table survive.
- **BA-H5.** No parameter sits outside its `designMin`/`designMax` in a shipped preset.
- **BA-H6.** LIVE TUNING warns when an edit crosses a design bound.
- **BA-H7.** Export and reload reproduce parameter values. Matching build, config, seed and inputs reproduce the same outcomes.

**Measured, not pass or fail**

A full run takes 5 to 20 minutes including reports and shift analysis. Record time per write-off, time to first purchase, active time, pause time and traffic waits. Ask first-time players whether warnings, misses and near misses felt fair. These numbers set quotas and prices (9.2, 10.3); they do not block the build.

## 13 Decisions

What is still undecided, what needs a build to decide, and what is deliberately out. Settled decisions are not listed here; each one is stated in the section it governs.

### 13.1 Gates, not decisions

These cannot be settled by choosing. They need a build.

| Gate | Needs | Blocks | Week |
|---|---|---|---|
| Control feel | Greybox the baseline alone with first-time players (5.2) | The upgrade tree | 1 |
| Extent consequences | Traffic re-tune and a feasibility witness at 800 × 600 (7.1) | Per-level traffic mixes | 2 |
| Cue contrast | Measurement against the real palette, dark-on-light (4.1.4) | The art pass | 2 |
| Pacing | Time per write-off, time to first purchase, a five-minute visit | Prices (9.2), quotas (10.3) | 3 |
| Finite traffic | Whole-run and low-speed witnesses | Final approval of the quotas (10.3) | 3 |

### 13.2 Still unspecified

Nothing in the first version depends on these.

- Model names and bark content. The roster is structural; the writing is 6.6's job.
- Per-level layout geometry: lane positions, island diameter, cone placement.
- The exhibition cabinet, its display and its input device.

### 13.3 Later features

Out of the first version. Recorded so they are not re-proposed, and so the first version is built in a way that admits them.

**Deferred scope — cut for the four-week build, wanted after it**

- **Level generation, and the levels it would produce** — the parking lot, the suburb, anything else. Authored layouts ship first. The level contract (7.9) and the data rules (11.3) are written so the same checks run against generated profiles.
- **Skill tree expansion** — a third tier, or a sixth branch. The radial shape takes both without changing the purchase or pricing model (5.6, 9.2).
- **The remaining four learning approaches** — occluded ambush, gap jump, cone diversion, hold-release transfer (6.4).
- **Mid-play saves** — snapshotting live appearances, traffic reservations and an action in flight. Boundary saves ship (12.4).
- **The bark pipeline** — the first version ships a fixed line bank (6.6).

**Systems not yet designed**

- **Weather** as a global modifier layer over terrain, braking and visibility (7.8).
- **Fog of war** and a limited-memory sight circle.
- **Pseudo-3D heights** — dummy state heights, and vehicle height read for more than occlusion. `vehicles.<class>.height` ships and is read only for occlusion (6.1).
- **Damage by body region** — a leg-height bumper hit weakening the legs.
- **Per-class turn radii and steering angles.** The rear-axle pivot ships; followable-curve navigation does not (6.2).
- **Varied level extents** — the machinery stays in the data (7.1).
- **Sure-footed**, a candidate node that shortens the coast further and makes pressing back near-instant. Parked, not designed: the tree is fifteen nodes in five branches and a third tier is not on the table (5.6). Revisit only alongside the tree expansion above, because a sixth node in a branch changes the 38-body total and the 14 spendable.

**Ruled out**

- **Multi-deck environments** — ramps, flyovers, anything at two heights over the same ground. Not in this game and not in a later version. The flat grid is load-bearing: height bands are metadata (7.7), Jump reads the world as flat, occupancy returns one surface per point (11.3), and the camera shows the whole level at once. A deck also hides traffic, which breaks pillar 2. Anything wanting this is a different game.
