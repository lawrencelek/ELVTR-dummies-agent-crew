# BRIEF — Terminal: the FARSIGHT smart-city interface skin
Content type: terminal. Parameter prefix for new IDs: proto.term.

## The gap (what P1 is thin on)
- My game is thin on graphics: the user interface should feel more like FARSIGHT SMART CITY (designer's gap statement).
- Designer decision for P2.1: stay inside DESIGN D10.1, the friendly corporate terminal. No neon, no dark field, no cyberpunk surface layer.
- The P2.0 frame is one flat aqua gradient, a white glow and the word FARSIGHT. Nothing names the smart city product or shows it at work.
- HUD modules are plain text eyebrows: no icons, no header bands, no bevel. Every panel uses the same hard-coded gloss.
- Tier-4 texture (micro-type, range marks, diagnostic runs, FARSIGHT signage) is absent, so the terminal reads as a debug overlay.
- The title screen still uses developer English: 'Cars avoid you. Fool them into hitting you.'

## Deliverable
- A frame backdrop: a vertical gradient and soft glows, drawn in the frame only.
- A header lockup: FARSIGHT wordmark plus the smart-city product name in English and Chinese, a tagline and up to three static badges.
- A panel skin for every glass panel (HUD, report, shop, pause, ending, title): radius, gloss, border, shadow, and an optional aqua header band behind module titles.
- An icon for each HUD module, drawn from vector shapes.
- Texture: a run of real registry IDs and values as micro-type, and range marks on the field bezel.
- A signage band: short static FARSIGHT notices that rotate in the bottom strip.
- Title-screen copy in FARSIGHT's voice.

## JSON schema
```
{
  "params": [ {"id": "proto.term.<name>", "value": number, "unit": "canvas units|s|alpha|ratio", "purpose": "one line", "sources": [chunk ids]} ],
  "backdrop": {
     "stops": [ {"at": 0..1, "role": allowed.frame_roles, "alpha": 0..1} ],          (2 to 4 stops, top to bottom)
     "glows": [ {"x": canvas x, "y": canvas y, "r": radius, "role": allowed.frame_roles, "alpha": 0..1} ],
     "sources": [...]
  },
  "header": {"product": "EN product name", "productZh": "Chinese", "review": "pending", "tagline": "short line", "badges": ["static label"], "sources": [...]},
  "panels": {"radius": ID, "gloss": ID, "border": role, "borderAlpha": ID, "shadow": ID, "band": true|false, "bandRole": role, "sources": [...]},
  "icons": {"BODY": [shapes], "CHARGE": [...], "FLEET": [...], "CONTRACT": [...], "SHIFT": [...], "RECORD": [...], "BUILD": [...], "sources": [...]},
  "texture": {"diagnostics": [registry IDs], "rangeMarks": ID, "sources": [...]},
  "signage": {"lines": [ {"text": "EN notice", "zh": "Chinese or omit", "review": "pending if zh"} ], "seconds": ID, "sources": [...]},
  "title": {"eyebrow": "...", "lines": ["line 1", "line 2"], "start": "...", "difficulty": {"Fragile": "...", "Standard": "...", "Reinforced": "..."}, "sources": [...]}
}
Shapes (icons): {"shape": rect|circle|ring|line|quadrant, "x", "y", "w", "h", "r", "points": [[x,y],...], "fill": role, "stroke": role, "lineWidth", "a": role, "b": role}. Icon units: a 16-unit box centred on 0,0.
Geometry and alpha are plain numbers. Timing, radius, gloss, border alpha, shadow and range spacing are parameter IDs.
```

## Consumer contract (what the renderer can draw)
- Canvas 1280 x 720. The play field is 800 x 600 at (240, 60). Side columns hold the HUD glass panels. Top and bottom strips are 60 units.
- backdrop is drawn first over the whole canvas. The play field is drawn on top and is opaque, so anything behind it is never seen.
- Top strip: FARSIGHT wordmark at the left, then the product lockup ('product · productZh'), then the tagline in small type. The district identifier line from interface copy prints under the lockup. Badges are small glass pills at the right.
- panels: every glass panel uses radius, gloss highlight height, border role and alpha, and drop-shadow blur. With band on, each HUD module title sits on a bandRole gloss band with white text; its icon sits at the band's left.
- icons: drawn at 16 units beside each module title. Roles render as the palette colour; aqua, aquaDeep and glass are frame colours.
- texture.diagnostics: micro-type runs in the bottom strip under each HUD column, 8 px, at texture contrast: 'id value unit'. Values are read live from the registry, so they are always true. rangeMarks: calibration ticks on the field bezel every rangeMarks units.
- signage: one notice at a time in a glass band in the bottom strip, under the field, cross-fading every signage.seconds. Static texture: it never reacts to play. The control prompt stays below it.
- title: eyebrow above the DUMMIES logo; two lines under it; start prompt at the bottom; difficulty note beside the difficulty selector. Placeholders: {roads} road count, {q1} {q2} {q3} write-offs per road, {health} that difficulty's body health.
- Frame text never enters the play field. The play field keeps its matte floor and cues; this skin does not touch it.

## Allowed values
```json
{
 "frame_roles": [
  "aqua",
  "aquaDeep",
  "glass",
  "floor",
  "grid",
  "structure",
  "fleet",
  "secondary",
  "primary",
  "joints",
  "dummy"
 ],
 "forbidden_roles": {
  "warning": "Red is reserved for warning cues (DESIGN D10.2)."
 },
 "dummy_role_only_in": [
  "icons.BODY"
 ],
 "icon_modules": [
  "BODY",
  "CHARGE",
  "FLEET",
  "CONTRACT",
  "SHIFT",
  "RECORD",
  "BUILD"
 ],
 "shapes": [
  "rect",
  "circle",
  "ring",
  "line",
  "quadrant"
 ],
 "icon_half_size": 8,
 "field_rect": [
  240,
  60,
  1040,
  660
 ],
 "canvas": [
  1280,
  720
 ],
 "product_max_chars": 16,
 "tagline_max_chars": 44,
 "badge_max_chars": 20,
 "max_badges": 3,
 "sign_max_chars": 72,
 "sign_lines": [
  4,
  10
 ],
 "diagnostic_ids": [
  6,
  16
 ],
 "title_placeholders": {
  "eyebrow": [],
  "lines": [
   "roads",
   "q1",
   "q2",
   "q3"
  ],
  "start": [],
  "difficulty": [
   "health"
  ]
 },
 "required_params": [
  "proto.term.panelRadius",
  "proto.term.glossHeight",
  "proto.term.borderAlpha",
  "proto.term.shadowBlur",
  "proto.term.signSeconds",
  "proto.term.rangeStep"
 ]
}
```

## Voices (who says what)
- FARSIGHT (all copy here): The corporate terminal: polite, procedural, optimistic on the surface, dry underneath (D9.2, D10.1). The brand kills you politely and never comments on the contradiction (EDIT26 4.1.1). Signage reads like public notices of a smart city that sells safety.

## Copy slots (where each string appears)
- header.product: The smart-city product name FARSIGHT sells, as a lockup beside the wordmark.
- header.tagline: FARSIGHT's promise in a few words.
- header.badges: Static brand labels, like certification seals on corporate software. Texture: they never change.
- signage.lines: Public notices on the city's screens. Texture: not instructions to the player, no numbers, no claims about this run.
- title.eyebrow: Small caps label above the game logo.
- title.lines[0]: Who the visitor is and what the cars do.
- title.lines[1]: The campaign: how many roads, the write-offs each needs, and what a lost body buys.
- title.start: Prompt to press A or Space to start.
- title.difficulty.<name>: A few words beside the difficulty selector: what the setting means for the body.

## Game data
Registry IDs you may reference (value, unit):
- battery.capacity = 3 charge units
- battery.lungeCost = 1 charge units
- battery.refillDelaySeconds = 0.3 s
- battery.secondsPerCharge = 0.8 s/charge unit
- body.radius = 13 world units
- damage.baseImpact = 100 damage units
- damage.bodyHealth = 800 health
- damage.referenceSpeed = 138 world units/s
- damage.zone.front = 1 ratio
- damage.zone.frontDiagonal = 0.6 ratio
- damage.zone.rear = 0.05 ratio
- damage.zone.rearDiagonal = 0.15 ratio
- damage.zone.side = 0.3 ratio
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- movement.alignThreshold = 30 °
- movement.counterPressAngle = 135 degrees
- movement.counterPressStop = 0.4 ratio
- movement.lungeDistance = 164 world units
- movement.lungeDuration = 0.3 s
- movement.lungeFastDistanceFraction = 0.7 ratio
- movement.lungeFastTimeFraction = 0.333333 ratio
- movement.lungeRecovery = 0.35 s
- movement.rampSeconds = 1 s
- movement.runSpeed = 162 world units/s
- movement.stopSeconds = 0.25 s
- movement.turnRate = 180 degrees/s
- movement.turnStartup = 0 s
- movement.turningSpeedFraction = 0.6 ratio
- movement.walkSpeed = 81 world units/s
- movement.wearFloor = 0.45 ratio
- perception.forwardLength = 560 world units
- perception.reactionDelay = 0.67 s
- perception.sideHalfAngle = 80 degrees
- perception.sideRadius = 100 world units
- proto.health.fragile = 200
- proto.health.reinforced = 600
- proto.health.standard = 300
- proto.quota.barrier = 2
- proto.quota.corner = 3
- proto.quota.straight = 1
- sensing.coneReach = 900 world units
- sensing.coneWidth = 90 degrees
- sensing.zoneFadeIn = 0.15 s
- traffic.acceleration = 43 world units/s²
- traffic.backOffLengths = 1 ratio
- traffic.comfortBraking = 37 world units/s²
- traffic.commitHorizon = 0.75 s
- traffic.deadlockTimeout = 3 s
- traffic.entryRoomLengths = 1 ratio
- traffic.hardBraking = 79 world units/s²
- traffic.lookAheadBase = 20 world units
- traffic.lookAheadSeconds = 0.45 s
- traffic.minimumGap = 8 world units
- traffic.pivotOffset = 0.3 ratio
- traffic.timeGap = 2 s
- ui.cueContrastTier1 = 4.5 multiplier
- ui.cueContrastTier2 = 3 multiplier
- ui.horizontalStrip = 60 reference-canvas units
- ui.sideColumn = 240 reference-canvas units
- ui.typeLoadBearing = 24 reference-canvas units
- ui.typeSecondary = 16 reference-canvas units
- ui.typeTexture = 9 reference-canvas units
- vehicles.sedan.cruiseSpeed = 138 world units/s
- vehicles.sedan.height = 22 world units
- vehicles.sedan.length = 56 world units
- vehicles.sedan.mass = 1 ratio
- vehicles.sedan.width = 28 world units
- vehicles.van.cruiseSpeed = 120 world units/s
- vehicles.van.height = 34 world units
- vehicles.van.length = 68 world units
- vehicles.van.mass = 1.5 ratio
- vehicles.van.width = 32 world units
- world.height = 600 world units
- world.laneWidth = 56 world units
- world.pedestrianGap = 40 world units
- world.spawnLeadIn = 200 world units
- world.width = 800 world units

Palette roles (DESIGN#D10.2; road and shoulder are P1 field fills):
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

P1 game data: models ['SEDAN-01', 'VAN-02']; levels straight = L1 Straight (Flyover pillars line the road. Hide from side sensors, then step out.); barrier = L2 Barrier (Hide behind the barrier. Ambush through the gaps.); corner = L3 Corner (A right-angle bend. Read curved approaches.); upgrade nodes hips (Hips, Torso), spine (Spine, Torso), carry (Carry, Arms), throw (Throw, Arms); difficulties Fragile, Standard, Reinforced.

Published interface content: district line 'SHENZHEN NEW ECONOMIC ZONE · LOGISTICS ROAD TEST' / '深圳新经济区 · 物流道路测试' prints under the lockup. HUD module titles: BODY (机体), CHARGE (充能), FLEET (车队), CONTRACT (合约), SHIFT (班次), RECORD (记录).

# CONTEXT

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