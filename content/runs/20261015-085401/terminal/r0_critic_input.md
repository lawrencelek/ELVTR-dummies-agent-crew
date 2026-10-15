# BRIEF — Terminal: the FARSIGHT smart-city interface skin
- My game is thin on graphics: the user interface should feel more like FARSIGHT SMART CITY (designer's gap statement).
- Designer decision for P2.1: stay inside DESIGN D10.1, the friendly corporate terminal. No neon, no dark field, no cyberpunk surface layer.
- The P2.0 frame is one flat aqua gradient, a white glow and the word FARSIGHT. Nothing names the smart city product or shows it at work.
- HUD modules are plain text eyebrows: no icons, no header bands, no bevel. Every panel uses the same hard-coded gloss.
- Tier-4 texture (micro-type, range marks, diagnostic runs, FARSIGHT signage) is absent, so the terminal reads as a debug overlay.
- The title screen still uses developer English: 'Cars avoid you. Fool them into hitting you.'

## Consumer contract
- Canvas 1280 x 720. The play field is 800 x 600 at (240, 60). Side columns hold the HUD glass panels. Top and bottom strips are 60 units.
- backdrop is drawn first over the whole canvas. The play field is drawn on top and is opaque, so anything behind it is never seen.
- Top strip: FARSIGHT wordmark at the left, then the product lockup ('product · productZh'), then the tagline in small type. The district identifier line from interface copy prints under the lockup. Badges are small glass pills at the right.
- panels: every glass panel uses radius, gloss highlight height, border role and alpha, and drop-shadow blur. With band on, each HUD module title sits on a bandRole gloss band with white text; its icon sits at the band's left.
- icons: drawn at 16 units beside each module title. Roles render as the palette colour; aqua, aquaDeep and glass are frame colours.
- texture.diagnostics: micro-type runs in the bottom strip under each HUD column, 8 px, at texture contrast: 'id value unit'. Values are read live from the registry, so they are always true. rangeMarks: calibration ticks on the field bezel every rangeMarks units.
- signage: one notice at a time in a glass band in the bottom strip, under the field, cross-fading every signage.seconds. Static texture: it never reacts to play. The control prompt stays below it.
- title: eyebrow above the DUMMIES logo; two lines under it; start prompt at the bottom; difficulty note beside the difficulty selector. Placeholders: {roads} road count, {q1} {q2} {q3} write-offs per road, {health} that difficulty's body health.
- Frame text never enters the play field. The play field keeps its matte floor and cues; this skin does not touch it.

## Voices (who says what)
- FARSIGHT (all copy here): The corporate terminal: polite, procedural, optimistic on the surface, dry underneath (D9.2, D10.1). The brand kills you politely and never comments on the contradiction (EDIT26 4.1.1). Signage reads like public notices of a smart city that sells safety.

## Copy slots (where each string appears)
- header.product: The smart-city product name FARSIGHT sells, as a lockup beside the wordmark.
- header.tagline: FARSIGHT's promise in a few words.
- header.badges: Static brand labels, like certification seals on corporate software. Texture: they never change.
- signage.lines: Public notices on the city's screens. Texture: not instructions to the player, no numbers, no claims about this run.
- title.eyebrow: Small caps label above the game logo.
- title.lines[0]: Who the visitor is, what the cars do (avoid it), and its job: cause the accidents FARSIGHT says cannot happen by getting hit.
- title.lines[1]: The campaign: how many roads, the write-offs each needs, and what a lost body buys.
- title.start: Prompt to press A or Space to start.
- title.difficulty.<name>: A few words beside the difficulty selector: what the setting means for the body.

# CANON

[EDIT26#4.1~1] (4.1 Style guide)
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

[EDIT26#4.2~3] (4.2 UI)
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

[DESIGN#D10.3~2] (D10.3 Information taxonomy (§4.3))
Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.
Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

[EDIT26#4.1~3] (4.1 Style guide)
| Reference | Take | Leave |
|---|---|---|
| Frutiger Aero — Windows Aero, Wii system menu, mid-2000s corporate tech marketing | Glossy bevels, translucency, aqua accent, rounded optimism. The brand's voice | Its wallpapers, bubbles and nature photography |
| Real crash-test facilities — Euro NCAP, IIHS footage | Calibration grids, high-vis markings, numbered impact zones, the dummy's yellow livery | Their documentary realism |
| Blackbox and Litestep desktop skins, 2001–2006 | Corner-anchored module stacks, bezel housings, micro-type as texture | Their darkness, which this register inverts |
| Hotline Miami | Top-down readability at speed; silhouette over detail | Its colour saturation and dark palette |
| Papers, Please | A diegetic terminal that is the whole interface, menus included | Its document-handling grammar |
| Mirror's Edge | Clean white world, saturated accent carrying meaning | Its first-person traversal |
Cyberpunk is tonal, not surface: Chinese signage, surveillance, grime at panel joints. System Shock, Beneath a Steel Sky, Blade Runner and Syndicate are mood ancestors only.

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

[EDIT26#3.1] (3.1 World and lore)
### 3.1 World and lore
- A Sinofuturist universe where AI workers perform ridiculous jobs, comic and tragic at once.
- FARSIGHT sells a city without accidents. Your job is to cause them.
- The city is the crash lab. Shenzhen Smart City is filled with surveillance instruments and test markings.
- The cars want to qualify. You want to leave.
- FARSIGHT issues one modification credit per destroyed body, and approves modifications to widen test coverage: the fleet must be certified against more kinds of human behaviour.
- Damage is measured and recorded, but only a completed test is paid. The dummy uses each modification to leave sooner.
- Freedom is the promise behind certification, not a separate currency.

[DESIGN#D10.2] (D10.2 Reference layout and palette — Trial (§4.2))
### D10.2 Reference layout and palette — Trial (§4.2)
Reference canvas: 1280×720. Reference play viewport: 800×600, centred. Side columns: 240×600 each. Top and bottom strips: 1280×60 each. The playfield occupies approximately 52% of the canvas.
The layout is a trial composition. Test a reduced frame at the same world extent before changing the simulation's dimensions. A 4:3 field reduces directional warning asymmetry compared with a wider field; it does not make all approach distances equal. Render scaling must not change simulation units.
| Role | Initial colour | Use |
|---|---|---|
| Floor | `#EDF1F3` | Matte laboratory street ground |
| Grid | `#D4DDE2` | Calibration pattern, subordinate to cues |
| Structure | `#B8C4CB` | Barriers and fixed forms |
| Fleet | `#7E8C96` | Vehicle mass and ordinary lane geometry |
| Dummy body | `#F5C542` | Persistent actor accent |
| Dummy joints | `#1A1D1F` | Facing/body articulation |
| Primary cue | `#101417` | Reflex information and outlines |
| Secondary cue | `#4A5A66` | Planning information |
| Warning | `#E4442E` | Reserved warning marks with independent shape/position |
| Brand aqua | `#4FC3E8` | Frame and menu accents |
These values are starting colours, not measured contrast results. Tier-1 contrast starts with a 4.5:1 target and tier 2 with 3:1, evaluated against actual overlapping backgrounds. A coloured warning can require a contrasting outline to meet its role. The colour itself is never the only carrier.

[DESIGN#D10.5] (D10.5 HUD and screens (§4.5))
### D10.5 HUD and screens (§4.5)
| Module | Content | Update |
|---|---|---|
| BODY | Remaining chassis health, wear and subject/chassis identity | Impact/write-off |
| CHARGE | Current charge and action availability | Simulation tick |
| FLEET | Recurring identities, current appearance state and learned model record | Appearance/learning |
| CONTRACT | Bodies completed against the visible target | Write-off |
| SHIFT | District/profile context and traffic remaining | Admission/exit |
| RECORD | Points and spendable body credits | Committed outcome/purchase |
There is no automatic-repair SERVICE meter in the slice. If useful, corporate service language appears on replacement/report screens without implying that inactivity restores health.
The report pauses simulation and presents the actual body outcome. The purchase screen shows only the profile's offered upgrades: the two slice branches, prices, prerequisites, current credit balance and the shortfall for unaffordable choices. A selected node shows a concise benefit and a short looping preview. The player can buy an affordable option or save. Do not fill the screen with unavailable expansion nodes.
An ending combines the contract verdict, final body facts where relevant, the appropriate score category and immediate replay. Initials use the available direction/action controls. High scores also serve the attract screen. Settings and operational debug tools are separate contexts; visitor menus do not expose accidental tuning actions.
High-contrast mode suppresses texture and gloss while strengthening the same cues. It is a tested presentation mode, not a different ruleset. Input denial, blocked states and reset prompts remain understandable without sound.

[EDIT26#4.2~4] (4.2 UI)
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

[LOG#P1.5/campaign] (Campaign)
### Campaign
- **Roads:** L1 → L2 → L3. Each needs its own write-off count.
- **Clearing a road:** Report, then the shop, then the next road. Owned nodes, credits, points, chassis count and time carry over.
- **Final write-off:** Clearing L3 ends with Licensed. No credit.
- **Credits:** 1 + 2 + 2 = 5 across the campaign. The catalogue costs 6, so trade-offs remain.
- **First shop:** After L1. Hips or Carry is the first choice.
- **Failure:** Running out of traffic fails the campaign. Retry restarts that road with its carried state.
- **Refusal:** Opens after one write-off in total.
| ID | Value | Unit |
|---|---:|---|
| `proto.quota.straight` | 1 | write-offs |
| `proto.quota.barrier` | 2 | write-offs |
| `proto.quota.corner` | 3 | write-offs |
| `proto.health.standard` | 400 → 300 | health (default) |
| `proto.health.fragile` | 300 → 200 | health |
| `proto.health.reinforced` | 800 → 600 | health |

[EDIT26#4.1~2] (4.1 Style guide)
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

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[EDIT26#4.3] (4.3 In-game assets)
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

[DESIGN#D1] (D1 The Game)
## D1 The Game
**A crash-test dummy earns human abilities by spending replaceable bodies on self-driving cars.**
- **Core fantasy:** Become human one body part at a time. The upgrade tree (D3) is the spine of the game.
- **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Conflict:** The city is a crash lab that still works as a city. Cars want to qualify. You want to leave.
- **Promise:** FARSIGHT promises release when the testing contract is complete.
- **Player:** A first-time exhibition visitor, e.g. a fifteen-year-old at a cabinet with a friend watching.
  - A brief control prompt and readable consequences teach play. No mandatory tutorial course.
  - The watching friend follows decisions and recognises each upgrade's effect.

[EDIT26#4.2~1] (4.2 UI)
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

[EDIT26#12.4~2] (12.4 Developer tools)
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

[LOG#P1.4] (P1.4 — Constant health, difficulty setting)
## P1.4 — Constant health, difficulty setting
**Build:** `dummies_p1.html` v5 · 14 Oct 2026 · Implements O1.16.
- **Constant health:** Body health no longer varies by road. Roads differ only in layout.
- **Inverted difficulty:** More health makes the contract harder. You are trying to be destroyed.
- **Selection:** Title screen, ◀▶. Default Standard. The HUD shows the setting.
- **Removed:** `proto.chassis.straight.bodyHealth`, `proto.chassis.barrier.bodyHealth`, `proto.chassis.corner.bodyHealth`.
- **Parked:** Chassis progression (O1.3), as a meta-layer after the core loop proves fun.
| ID | Value | Label |
|---|---:|---|
| `proto.difficulty` | 1 | 0 Fragile · 1 Standard · 2 Reinforced |
| `proto.health.fragile` | 300 | Easy: you break quickly |
| `proto.health.standard` | 400 | Default |
| `proto.health.reinforced` | 800 | Hard: you take a beating |
The selected value replaces `damage.bodyHealth`, including the assessment cap.
**Hits to write off one body (P1.3 damage model):**
| Setting | Head-on bait (297) | Standing hit (100) | Lunge into a parked car (53) |
|---|---:|---:|---:|
| Fragile 300 | 2 | 3 | 6 |
| Standard 400 | 2 | 4 | 8 |
| Reinforced 800 | 3 | 8 | 16 |
- **Read:** On Standard, one head-on bait leaves about 25% health. The full damage sequence shows before the second hit.

[BRIEF#P1.12] (P1.12 Decisions P1 feeds)
## P1.12 Decisions P1 feeds
- Keep, change or cut the facing-locked lunge.
- Whether the one-hit full write-off (fast lunge into a stopped car) breaks the loop.
- Whether Hips vs Carry is a real choice.
- Whether cone-limited prediction is fun or just hidden information.
- Admission interval and traffic density for P2.
- Whether P2 adds learning, a third branch, or the breadth tree.

[DESIGN#D10.4] (D10.4 Reach and legibility (§4.4))
### D10.4 Reach and legibility (§4.4)
The starting reach treatment is a restrained nonnumeric mark visible during ordinary movement. It predicts current straight-lunge reach and static blocking geometry. It does not promise a collision with a moving car. During the action the trace shows its snapshotted path; Spine may steer away from the initial projection.
Compare this treatment with wear animation alone. Keep the least intrusive version that passes fresh/worn prediction tests. There is no categorical prohibition on a predictive mark.
Reference type uses 24-unit cap height for model IDs/readouts, 16 for secondary labels and 9 for deliberate texture. These are trial values, not assurances of legibility at a distance. Name the actual display and input hardware before release testing. Evaluate the planned 1.5–2.5 m range, motion, cue overlap and high-contrast mode. Allow essential marks to displace texture or decorative frame content.

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

[EDIT26#3.2] (3.2 Voice and register)
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#4.2~5] (4.2 UI)
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

[JUICE#J4] (J4 Intensity rules (Proposed))
## J4 Intensity rules (Proposed)
- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.

[EDIT26#12.3] (12.3 Schedule)
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

[EDIT26#6.2~3] (6.2 Locomotion and traffic)
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

[BRIEF#P1.11] (P1.11 Observation)
## P1.11 Observation
- **Who:** You, then 3–5 people new to the game. One level each, then free choice.
- **Brief them with:** The control prompt only. No strategy hints.
- **Auto-logged:** First hit, first bait hit, first cone-assisted hit, first write-off, first purchase, first use of each node, ending.
- **Bait hit:** An impact while the car is committed, expiring or interrupted.
- **Watch:** Laughs, "one more", repeated deliberate tricks, frustration with turning, ignored nodes.
- **Ask after play:** What did the cars do? What did your upgrade change? What would you buy next time?
- **Compare:** Zones in cone vs everywhere. Default vs shorter `run.admissionInterval`.
- **Export:** Ending or pause screen → Export trace (JSON).

[BRIEF#P1.1] (P1.1 Questions)
## P1.1 Questions
| ID | Question | Watch for |
|---|---|---|
| Q1 | Does dummy locomotion feel good? | Players steer, turn and lunge without fighting controls |
| Q2 | Is fooling a car fun? | Deliberate bait: get detected, read the swerve, lunge into it |
| Q3 | Does each branch change play? | Hips users turn-and-strike; Carry users lay cone traps |
| Q4 | Does cone-limited prediction create play? | Players turn to look before committing to an approach |
| Q5 | Is velocity damage readable and satisfying? | Players chase front hits and fast lunges deliberately |

[DESIGN#D2.2] (D2.2 Recurring cars visibly adapt)
### D2.2 Recurring cars visibly adapt
- Models have stable identities.
- A qualifying player hit changes that model's later detection range. Other models are unaffected.
- The player meets the return soon enough to notice the new response and adjust.
- "The fleet learns" means accumulated learning per recurring model. No cross-model sharing. No hidden global difficulty.
- **Fails if:**
  - Changed behaviour is indistinguishable from mood or random variation.
  - Models return too late.
  - Reports name an answer the car's behaviour never demonstrated.
  - A closed commitment cue routinely becomes false after the player acts.

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

[DRIVER#DB8] (DB8 Open questions)
## DB8 Open questions
- Does a 4 m stop with a learned retreat feel fair, or too easy early on?
- Should cars slow for bends? They take L3's 8 m-radius bend at 25 mph, about 1.2 g sideways.
- Should learning also widen the caution zone, as in the Rattled profile?
- Should a car that sees you approach while stopped reverse away?
- Which profile next: Courier vans, or a rare Emergency vehicle?

[DESIGN#D10.3~1] (D10.3 Information taxonomy (§4.3))
### D10.3 Information taxonomy (§4.3)
There are four distinct inventories: dynamic gameplay cues, readable world features, HUD facts and decorative texture. All may have authored style rules; they do not have to fit one fixed fifteen-item list.
| Dynamic cue | Meaning | Required independent treatment |
|---|---|---|
| Nose vector | Current body facing and unsteered launch direction | Line shape and rotation |
| Body silhouette | Position, wear and recovery | Shape change and motion/position |
| Charge ring/segments | Whether another lunge is available | Segment/arc geometry and luminance |
| Reach endpoint/short mark | Current wear-adjusted straight-lunge reach against static geometry | Endpoint position and distinct mark shape |
| Lunge trace | Actual snapshotted action in progress | Directional form and motion |
| Intent chevron | A detected car's provisional route | Arrow shape and position |
| Closed commitment cue | Fixed evasive corridor with a bounded planned trajectory | Closed shape and placement on the car |
| Interrupted/blocked cue | Commitment prediction has been interrupted for safety | Broken/distinct shape plus braking/block indication |
| Expiring commitment | Less than a full action window remains in the reservation | Opening/broken-ring form and visible countdown motion; distinct from interruption |
| Brake marks | The car is slowing | Rear position and visible state change |
| Detection zone and side sensors | Where this appearance can sense | Explicit boundary shape and patterned fill |
| View cone | Where the dummy resolves sensor information | Wedge boundary and orientation |
| Model tag | Which recurring model this is | Legible text and anchored position |
| Seniority notches | Effective applied learning in this appearance's snapshot | Zero-to-three count and fixed tag position |
| Spent-appearance mark | This appearance cannot award another damaging/scoring impact | Persistent stamped/slashed shape and tag placement |
| Carried cone | Prop ownership and placement direction | Visible prop silhouette and position |
| Impact burst | A positive qualifying hit | Contact position and radial motion |
Use different forms for sensor rectangles and the dummy's wedge. Keep actor identity, intent/commitment, braking and spent state readable outside the view cone. Looking determines resolution of sensor information; it must not erase the approaching vehicles the player needs to navigate.

[DESIGN#D9.3] (D9.3 Voice and reports (§3.3))
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

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

[EDIT26#7.1~1] (7.1 Canvas and playing area)
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

# VALIDATOR
- V1 icons.BODY[2]: [-3.8, 5.2, -2.2, 8.8] — Icons fit their 16-unit box.
- V2 icons.BODY[3]: [2.2, 5.2, 3.8, 8.8] — Icons fit their 16-unit box.

# SETTLED (fixes applied in earlier rounds; do not reverse)
- none

# CONTENT

{
 "params": [
  {
   "id": "proto.term.panelRadius",
   "value": 12,
   "unit": "canvas units",
   "purpose": "Corner radius for every glass panel in the frame.",
   "sources": [
    "DESIGN#D10.1",
    "EDIT26#4.1~1"
   ]
  },
  {
   "id": "proto.term.glossHeight",
   "value": 16,
   "unit": "canvas units",
   "purpose": "Height of the top gloss highlight on each glass panel.",
   "sources": [
    "EDIT26#4.1~2",
    "DESIGN#D10.1"
   ]
  },
  {
   "id": "proto.term.borderAlpha",
   "value": 0.7,
   "unit": "alpha",
   "purpose": "Opacity of the panel bevel border.",
   "sources": [
    "EDIT26#4.1~2"
   ]
  },
  {
   "id": "proto.term.shadowBlur",
   "value": 10,
   "unit": "canvas units",
   "purpose": "Blur radius of the soft panel drop shadow.",
   "sources": [
    "EDIT26#4.1~1",
    "EDIT26#4.1~2"
   ]
  },
  {
   "id": "proto.term.signSeconds",
   "value": 6,
   "unit": "s",
   "purpose": "Time each FARSIGHT notice stays up before it cross-fades to the next.",
   "sources": [
    "EDIT26#4.2~4",
    "EDIT26#4.2~3"
   ]
  },
  {
   "id": "proto.term.rangeStep",
   "value": 20,
   "unit": "canvas units",
   "purpose": "Spacing of calibration ticks on the field bezel.",
   "sources": [
    "EDIT26#4.1~2",
    "EDIT26#4.2~4"
   ]
  }
 ],
 "backdrop": {
  "stops": [
   {
    "at": 0,
    "role": "aqua",
    "alpha": 0.55
   },
   {
    "at": 0.55,
    "role": "glass",
    "alpha": 0.85
   },
   {
    "at": 1,
    "role": "aqua",
    "alpha": 0.3
   }
  ],
  "glows": [
   {
    "x": 120,
    "y": 110,
    "r": 240,
    "role": "glass",
    "alpha": 0.6
   },
   {
    "x": 1170,
    "y": 620,
    "r": 280,
    "role": "aqua",
    "alpha": 0.35
   },
   {
    "x": 1160,
    "y": 90,
    "r": 180,
    "role": "aquaDeep",
    "alpha": 0.12
   }
  ],
  "sources": [
   "DESIGN#D10.1",
   "EDIT26#4.1~1"
  ]
 },
 "header": {
  "product": "SMART CITY",
  "productZh": "智慧城市",
  "review": "pending",
  "tagline": "A city without accidents.",
  "badges": [
   "ZERO ACCIDENTS",
   "CITY-READY",
   "FRIENDLY BY DESIGN"
  ],
  "sources": [
   "EDIT26#3.1",
   "DESIGN#D9.1",
   "DESIGN#D9.2",
   "EDIT26#4.2~1"
  ]
 },
 "panels": {
  "radius": "proto.term.panelRadius",
  "gloss": "proto.term.glossHeight",
  "border": "glass",
  "borderAlpha": "proto.term.borderAlpha",
  "shadow": "proto.term.shadowBlur",
  "band": true,
  "bandRole": "aqua",
  "sources": [
   "DESIGN#D10.1",
   "EDIT26#4.1~1",
   "EDIT26#4.1~2"
  ]
 },
 "icons": {
  "BODY": [
   {
    "shape": "circle",
    "x": 0,
    "y": -4.5,
    "r": 3,
    "fill": "dummy"
   },
   {
    "shape": "rect",
    "x": -3,
    "y": -1,
    "w": 6,
    "h": 7,
    "fill": "dummy"
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      6
     ],
     [
      -3,
      8
     ]
    ],
    "stroke": "joints",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      3,
      6
     ],
     [
      3,
      8
     ]
    ],
    "stroke": "joints",
    "lineWidth": 1.5
   }
  ],
  "CHARGE": [
   {
    "shape": "rect",
    "x": -7,
    "y": -4,
    "w": 12,
    "h": 8,
    "stroke": "glass",
    "lineWidth": 1.5
   },
   {
    "shape": "rect",
    "x": 5,
    "y": -2,
    "w": 2,
    "h": 4,
    "fill": "glass"
   },
   {
    "shape": "rect",
    "x": -5,
    "y": -2,
    "w": 3,
    "h": 4,
    "fill": "glass"
   },
   {
    "shape": "rect",
    "x": -1,
    "y": -2,
    "w": 3,
    "h": 4,
    "fill": "glass"
   }
  ],
  "FLEET": [
   {
    "shape": "rect",
    "x": -7,
    "y": -5,
    "w": 14,
    "h": 6,
    "fill": "glass"
   },
   {
    "shape": "rect",
    "x": -7,
    "y": 2,
    "w": 14,
    "h": 5,
    "fill": "aquaDeep"
   },
   {
    "shape": "circle",
    "x": -4,
    "y": 1,
    "r": 1.5,
    "fill": "aquaDeep"
   },
   {
    "shape": "circle",
    "x": 4,
    "y": 1,
    "r": 1.5,
    "fill": "aquaDeep"
   }
  ],
  "CONTRACT": [
   {
    "shape": "rect",
    "x": -5,
    "y": -7,
    "w": 10,
    "h": 14,
    "stroke": "glass",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      -3
     ],
     [
      3,
      -3
     ]
    ],
    "stroke": "glass",
    "lineWidth": 1
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      0
     ],
     [
      3,
      0
     ]
    ],
    "stroke": "glass",
    "lineWidth": 1
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      3
     ],
     [
      1,
      3
     ]
    ],
    "stroke": "glass",
    "lineWidth": 1
   }
  ],
  "SHIFT": [
   {
    "shape": "ring",
    "x": 0,
    "y": 0,
    "r": 6.5,
    "stroke": "glass",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      0
     ],
     [
      0,
      -4
     ]
    ],
    "stroke": "glass",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      0
     ],
     [
      3,
      2
     ]
    ],
    "stroke": "glass",
    "lineWidth": 1.5
   }
  ],
  "RECORD": [
   {
    "shape": "rect",
    "x": -7,
    "y": 1,
    "w": 3,
    "h": 6,
    "fill": "glass"
   },
   {
    "shape": "rect",
    "x": -2,
    "y": -3,
    "w": 3,
    "h": 10,
    "fill": "glass"
   },
   {
    "shape": "rect",
    "x": 3,
    "y": -7,
    "w": 3,
    "h": 14,
    "fill": "glass"
   }
  ],
  "BUILD": [
   {
    "shape": "ring",
    "x": -2,
    "y": -2,
    "r": 4,
    "stroke": "glass",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      1,
      1
     ],
     [
      7,
      7
     ]
    ],
    "stroke": "glass",
    "lineWidth": 2.5
   },
   {
    "shape": "circle",
    "x": -2,
    "y": -2,
    "r": 1.2,
    "fill": "aquaDeep"
   }
  ],
  "sources": [
   "DESIGN#D10.5",
   "EDIT26#4.2~4",
   "EDIT26#4.1~2"
  ]
 },
 "texture": {
  "diagnostics": [
   "battery.capacity",
   "battery.secondsPerCharge",
   "damage.bodyHealth",
   "damage.baseImpact",
   "movement.lungeDistance",
   "movement.runSpeed",
   "perception.reactionDelay",
   "traffic.timeGap"
  ],
  "rangeMarks": "proto.term.rangeStep",
  "sources": [
   "EDIT26#4.2~3",
   "EDIT26#4.1~2",
   "DESIGN#D10.3~2"
  ]
 },
 "signage": {
  "lines": [
   {
    "text": "Thank you for choosing a city without accidents."
   },
   {
    "text": "Every journey in this district is a certified journey.",
    "zh": "本区每一次出行均已认证。",
    "review": "pending"
   },
   {
    "text": "Calibration marks are provided for your safety and ours."
   },
   {
    "text": "This district is monitored for your convenience.",
    "zh": "本区域受到监测,为您提供便利。",
    "review": "pending"
   },
   {
    "text": "Pedestrians are valued participants in the smart city."
   },
   {
    "text": "Your feedback helps the fleet serve you better."
   },
   {
    "text": "Safety is a shared responsibility. FARSIGHT shares it gladly."
   },
   {
    "text": "Logistics roads are open for the benefit of the whole zone.",
    "zh": "物流道路向全区开放。",
    "review": "pending"
   }
  ],
  "seconds": "proto.term.signSeconds",
  "sources": [
   "EDIT26#3.1",
   "DESIGN#D9.2",
   "DESIGN#D10.1",
   "EDIT26#4.1~1",
   "EDIT26#4.2~3"
  ]
 },
 "title": {
  "eyebrow": "VISITOR ORIENTATION",
  "lines": [
   "Welcome, test subject. The fleet will avoid you. Kindly be struck, so FARSIGHT stays accident-free.",
   "{roads} roads, each certified in turn. Write-offs required: {q1}, {q2}, {q3}. Every lost body buys one modification."
  ],
  "start": "Press A or Space to begin your test.",
  "difficulty": {
   "Fragile": "Body health {health}. A short, tidy test.",
   "Standard": "Body health {health}. The recommended chassis.",
   "Reinforced": "Body health {health}. Built to last, regrettably."
  },
  "sources": [
   "EDIT26#3.1",
   "DESIGN#D9.1",
   "DESIGN#D1",
   "LOG#P1.5/campaign",
   "LOG#P1.4",
   "EDIT26#4.1~1"
  ]
 }
}