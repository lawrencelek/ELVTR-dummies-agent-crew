# BRIEF — Graphics: vehicle identities, dummy markings, district dressing
Content type: graphics. Parameter prefix for new IDs: proto.art.

## The gap (what P1 is thin on)
- Vehicles are identical grey rounded rectangles with a windscreen. Only the floating tag tells SEDAN-01 from VAN-02.
- No vehicle shows a district job (D9.2 anchor 3) or self-driving hardware. D10.6 asks for two recognisable vehicle identities.
- The dummy has a head disc, shoulder bar, joints and nose vector, but none of the FARSIGHT markings D4.1 requires.
- The road is a calibration grid and nothing else: no logistics or maintenance district, entrances, destinations, service markings or bilingual test identifiers (D9.2 anchors 1 and 2).
- D10.6: a greybox can establish feel but cannot pass the beauty gate.

## Deliverable
- Roof art for the Sedan and the Van: a district job, identity marks and sensor hardware, as vector shapes in car-local units.
- FARSIGHT markings for the dummy, as vector shapes inside the body footprint.
- Ground dressing and signage for each P1 road (straight, barrier, corner), as vector shapes in world units.
- Palette role names only. Geometry stays inside the registry footprints.

## JSON schema
```
{
  "params": [] (art geometry is asset data bounded by registry IDs; declare proto.art.* only for a tunable value),
  "vehicles": {
    "sedan": {"job": "district job in 2-4 words", "jobZh": "Chinese job", "review": "pending", "roof": [shape], "sources": [...]},
    "van":   {same}
  },
  "dummy": {"markings": [shape], "sources": [...]},
  "environment": {
    "straight": [decal], "barrier": [decal], "corner": [decal]
  }
}
shape: {"shape": allowed.shapes, ...geometry..., "fill": role?, "stroke": role?, "lineWidth": n?, "alpha": 0-1?}
  rect {x, y, w, h, rotate?}   circle {x, y, r}   ring {x, y, r, lineWidth}   quadrant {x, y, r, a: role, b: role} (crash-test target: alternating quarters)
  line {points: [[x,y],...], dash?: [on, off]}   text {x, y, text, size, font, align: left|center|right, rotate?}   stripes {x, y, w, h, angle, gap} (hatching)
decal: a shape plus "surface": "tarmac"|"shoulder"|"verge", "hazard": true|false, "note": "what it is in the district", "sources": [...]
Any text containing Chinese characters also carries "review": "pending".
```

## Consumer contract (what the renderer can draw)
- Vehicle roof shapes draw in car-local units after the body fill and before windscreen, lights and the state pip. Origin is the car centre; +x points to the nose; +y is the car's right side. The body is vehicles.<cls>.length by vehicles.<cls>.width.
- The state pip draws at the car centre, radius 8. Keep a clear circle of pip_clear_radius around the origin.
- Dummy markings draw in body-local units after the body fill, under the shoulder bar, head and nose vector. Origin is the body centre; +x is facing. Footprint radius is body.radius. The nose vector runs along +x from x = 6.5; keep the nose corridor clear.
- Dummy markings fade with wear like the body's yellow.
- Environment decals draw in world units (world.width by world.height) after the road and before shadows, statics, cones, cars and cues.
- The road for each level is a centreline polyline; tarmac half-width is world.laneWidth; shoulders add proto.shoulderWidth each side. 'tarmac' decals sit within world.laneWidth of the centreline, 'shoulder' within the shoulder band, 'verge' beyond it.
- Text uses the P1 fonts: mono = B612 Mono, ui = B612, brand = Nunito.

## Allowed values
```json
{
 "shapes": [
  "rect",
  "circle",
  "ring",
  "quadrant",
  "line",
  "text",
  "stripes"
 ],
 "roles": "palette roles from DESIGN#D10.2 plus P1 field roles road and shoulder",
 "forbidden_roles": {
  "vehicle": [
   "dummy",
   "warning",
   "aqua"
  ],
  "dummy": [
   "warning",
   "aqua"
  ],
  "environment": [
   "aqua"
  ]
 },
 "environment_saturated_roles": [
  "warning",
  "dummy"
 ],
 "environment_saturated_requires": "hazard: true",
 "fonts": [
  "mono",
  "ui",
  "brand"
 ],
 "pip_clear_radius": 9,
 "nose_corridor": {
  "x_from": 6,
  "half_width": 2.5
 },
 "levels": [
  "straight",
  "barrier",
  "corner"
 ],
 "min_text_size_param": "ui.typeTexture"
}
```

## Already drawn by the renderer (do not redraw or imitate)
- Field: floor fill, 40-unit calibration grid, small crosshair marks every 200 units.
- Road: tarmac band, pavement shoulders, edge strips, the dashed centre line.
- Statics: pillars labelled P0, P1..., barriers with hatching, crates, and their shadows toward 7:30.
- Cars: body fill, roof light gradient, windscreen, headlights, brake lights, amber indicators, the state pip at the centre, the model tag above.
- Dummy: yellow dented body, shoulder bar, black joints, head disc, nose vector, charge ring around it.
- Cue shapes that decoration must not imitate: chevrons and arrows (intent), closed or opening rings (commitment, charge), red dashed ring (interrupted), dashed car outlines (predicted pose), the red STOP line, the aqua BLIND wedge, the grey caution triangle. Filled boxes in structure colour read as crates or barriers, which are solid; decoration has no collider.

## Game data
Registry IDs you may reference (value, unit):
- body.radius = 13 world units
- props.cone.radius = 7.2 world units
- proto.art.barrierHeight = 14
- proto.art.coneHeight = 14
- proto.art.crateHeight = 30
- proto.art.droneHeight = 70
- proto.art.dummyHeight = 18
- proto.art.pillarHeight = 60
- proto.art.shadowScale = 0.3
- proto.shoulderWidth = 24
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

P1 game data: models ['SEDAN-01', 'VAN-02']; levels straight = L1 Straight (Flyover pillars line the road. Hide from side sensors, then step out.); barrier = L2 Barrier (Hide behind the barrier. Ambush through the gaps.); corner = L3 Corner (A right-angle bend. Read curved approaches.); upgrade nodes hips (Hips, Torso), spine (Spine, Torso), carry (Carry, Arms), throw (Throw, Arms); difficulties Fragile, Standard, Reinforced.

Level geometry (world units; road = centreline polyline):
- straight: centreline [[-200, 300], [1000, 300]]; statics [{"x": 136, "y": 214, "w": 28, "h": 28, "kind": "pillar"}, {"x": 416, "y": 214, "w": 28, "h": 28, "kind": "pillar"}, {"x": 676, "y": 214, "w": 28, "h": 28, "kind": "pillar"}, {"x": 276, "y": 358, "w": 28, "h": 28, "kind": "pillar"}, {"x": 546, "y": 358, "w": 28, "h": 28, "kind": "pillar"}]; cone homes [[110, 196], [310, 190], [500, 414], [690, 420]]; dummy spawns [[400, 480], [160, 480], [640, 480], [400, 120]]
- barrier: centreline [[-200, 300], [1000, 300]]; statics [{"x": 0, "y": 388, "w": 250, "h": 12, "kind": "barrier"}, {"x": 290, "y": 388, "w": 220, "h": 12, "kind": "barrier"}, {"x": 550, "y": 388, "w": 250, "h": 12, "kind": "barrier"}, {"x": 186, "y": 214, "w": 28, "h": 28, "kind": "pillar"}, {"x": 466, "y": 214, "w": 28, "h": 28, "kind": "pillar"}, {"x": 686, "y": 214, "w": 28, "h": 28, "kind": "pillar"}]; cone homes [[90, 202], [260, 198], [540, 202], [150, 428], [700, 428]]; dummy spawns [[400, 500], [140, 500], [660, 500], [300, 110]]
- corner: centreline [[-200, 440], [450, 440], ["... arc of", 23, "points ..."], [550, 340], [550, -200]]; statics [{"x": 382, "y": 312, "w": 36, "h": 36, "kind": "pillar"}, {"x": 404, "y": 232, "w": 32, "h": 32, "kind": "pillar"}, {"x": 236, "y": 336, "w": 28, "h": 28, "kind": "pillar"}, {"x": 626, "y": 456, "w": 32, "h": 32, "kind": "pillar"}]; cone homes [[200, 330], [320, 552], [660, 220], [420, 120]]; dummy spawns [[300, 560], [700, 400], [200, 160], [720, 140]]

# CONTEXT

[DESIGN#D4.1] (D4.1 Identity and states (§5.1))
### D4.1 Identity and states (§5.1)
The subject is earnest, stiff and clanky. Its personality is expressed through movement and repeated bodily expenditure. The same subject record and bought abilities continue through fresh chassis.
The reference body footprint is 26 units across. The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. Carry loosens the arms visibly; Hips changes the rhythm of reorientation. Wear changes outline and lean without hiding facing.
Active states are idle, moving, counter-braking/coasting, lunging, recovering, carrying and written off. Falling, jumping and attachment states are retained for gated expansion. Animation expresses the authoritative state; it cannot quietly change collisions, action duration or input acceptance.

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

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

[DESIGN#D5.1] (D5.1 Class, model and appearance (§6.1))
### D5.1 Class, model and appearance (§6.1)
A **class** supplies physical dimensions, mass and baseline behaviour. A **model** is a recurring identity with its own learning record. An **appearance** is one admitted instance of that model, with a unique ID, an immutable starting behaviour snapshot and one damage allowance. Replacement of the dummy does not replace an appearance or replenish its allowance. A later appearance of the same model has a new allowance and reads the updated learning record.
The slice uses two persistent model identities: one Sedan and one Van. Their readable labels, silhouettes and identity marks remain stable between appearances. Both use Standard mood. Class, seniority, mood and random variation must not compete as explanations for the first learned response.
| Slice class | Relative mass | Length × width × height, world units | Baseline speed, units/s | Encounter role |
|---|---:|---:|---:|---|
| Sedan | 1.0 | 56 × 28 × 22 | 138 | Clear reference for approach, commitment, bait and return |
| Van | 1.5 | 68 × 32 × 34 | 120 | Heavier, slower encounter and mobile visual obstruction |
Dimensions, mass and speeds are **Trial** values. Collider geometry, sprite placement and sensor origin share the same transform. A visual pivot does not excuse a tail extending outside the tested swept footprint. Height is metadata for explicit visibility rules; it is not a second physics engine.
The expansion catalogue retains Sports, Hatchback, Sedan, Wagon, Van, Bus, SUV and Police. The earlier proposal for 32 models and four moods is **Expansion-gated**. No slice claim depends on meeting that catalogue count. An expansion profile must allocate every advertised class to a finite schedule; SUV and Police cannot remain advertised roster entries with zero opportunities. A Hatchback's possible second commitment requires a new, clearly announced window after the old promise has ended, with its own tests.

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

[DESIGN#D10.6] (D10.6 Representative finished assets (§4.6))
### D10.6 Representative finished assets (§4.6)
The ten-minute candidate includes a finished dummy treatment, two recognisable vehicle identities, one coherent environment, readable sensors/commitment/spent cues, report/shop/ending screens and an intentional sound mix. A greybox can establish feel but cannot pass the beauty gate.
Higher structures use visible mass and shadows; sensor-blocking cover must look like cover. Palette/material rules yield when necessary for reserved cue readability. Height bands are descriptive art metadata; collision flags are authoritative (§7).

[LOG#P1.2/light-and-relief] (Light and relief)
### Light and relief
- **Sun:** At 1:30. Shadows fall toward 7:30.
- **Shadow length:** Object height × `proto.art.shadowScale`.
- **Heights:** Cars use `vehicles.sedan.height` and `vehicles.van.height` from the registry. Others below.
- **Lit edges:** Crates and barriers catch light on their top and right edges. Car roofs and cones shade from the top right.
| ID | Value | Unit |
|---|---:|---|
| `proto.art.shadowScale` | 0.3 | ratio |
| `proto.art.crateHeight` | 30 | world units |
| `proto.art.barrierHeight` | 14 | world units |
| `proto.art.coneHeight` | 14 | world units |
| `proto.art.dummyHeight` | 18 | world units (+8 while lunging) |
| `proto.art.droneHeight` | 70 | world units |

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

[BRIEF#P1.8] (P1.8 Levels)
## P1.8 Levels
| Level | Layout | Tests |
|---|---|---|
| L1 Straight | Two-way road, shoulders, open ground | Raw locomotion, bait and lunge timing |
| L2 Barrier | South barrier with two `world.pedestrianGap` gaps; crates | Cover blocks sensing. Ambush through gaps |
| L3 Corner | Right-angle bend; crates inside the turn | Turning, facing and reading curved paths |

[DESIGN#D6.2] (D6.2 Environment)
### D6.2 Environment
- **Surfaces:** Tarmac and pavement only. Shoulders are pavement. Kerbs and stripes add no mechanics.
- **Structures and props:** Barriers, fixed crates, cones.
- **Sensor blocking:** Van, barrier and crate block car and player-diagnostic rays. Sedan and cone don't.
- No mask hides an actor, commitment or spent cue.
- No holes, low-grip traps, multiplier plates or elevated routes in the slice.
- Moving a cone can never seal every recovery route.
- Exact contracts: Engineering §7.2.

[LOG#P1.2/dummy-damage-states] (Dummy damage states)
### Dummy damage states
Wear = 1 − health / `damage.bodyHealth`. The facing arrow never changes.
| Wear from | Visible change |
|---:|---|
| 0% | Five dents appear one by one and deepen. Each chassis dents in its own places. |
| 0% | Yellow fades toward grey-brown. |
| 20% | Scorch marks spread across the body. |
| 35% | The shoulder bar bends. |
| 40% | The body sways. |
| 45% | Smoke trails from the body. |
| 55% | The right arm joint is gone. Exposed wires show. |
| 60% | The body trembles constantly. |
| 70% | The head cracks and sits off-centre. Sparks fly. A red vignette pulses at the screen edge. |
| HUD | The health bar flashes red below 30% health. |

[JUICE#J1] (J1 Reference games — top-down arcade driving)
## J1 Reference games — top-down arcade driving
| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

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

[DESIGN#D6.1] (D6.1 One authored Road (§7.1))
### D6.1 One authored Road (§7.1)
The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. The logical world reference is 800 × 600 units, independent of the surrounding UI layout. A different display scales the view without silently changing reach or car travel time. Changing logical world dimensions requires new pacing and collision witnesses.
The initial lane width is 56 units. Openings must accommodate the complete 26-unit dummy footprint with usable margin, including the worn-reach case. A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. The authored level asset must supply actual positions, collider footprints, spawn transforms, legal exits, cover flags and prop recovery positions. Its geometry is tested as a single versioned asset. This document does not invent validated coordinates.
The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. There must be room to use Hips and Spine and meaningful placements to use Carry and Throw. Each advertised advantage is compared with what the unupgraded dummy can already do. Simply including a cone does not prove Carry has value; simply including a corner does not prove Hips has value.
The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. Essential geometry stays legible behind the authored art. Clear shoulders and escape positions are part of the layout, not emergency developer cheats.

[DESIGN#D6.3] (D6.3 Expansion environments and the tree — Expansion-gated)
### D6.3 Expansion environments and the tree — Expansion-gated
- Road, Junction and Roundabout are the intended progression of traffic situations.
- Each stage needs a tactical purpose, a quota, a finite opportunity budget and a tested upgrade-coverage matrix.
- Each surface declares its own movement, lunge, car speed, braking, sensing and score effects.
| Candidate feature | Node it gives a job |
|---|---|
| Flagged floor gaps | Jump |
| Gravel, puddles and other low-grip surfaces | Grip |
| Sensor-blocking cover | Wider view, Memory |
| Planned and delayed entries | Ears |
- Exact contracts: Engineering §7.4.

[LOG#P1.5/pillars-and-blind-spots] (Pillars and blind spots)
### Pillars and blind spots
- **Pillars:** Flyover columns now stand at the road edge, replacing distant crates. Shadow height `proto.art.pillarHeight` 60.
- **L1:** Three north, two south, staggered.
- **L2:** Three north. The south barrier with gaps remains.
- **L3:** One in the inside of the bend, one beside the vertical leg, one at the west straight, one outside the bend.
- **Blind spots:** Pillars, barriers and vans cast sensor shadows from each car's nose. Shown inside the scanners as pale aqua wedges labelled BLIND.
- **Tactic:** Stand in a pillar's shadow and side sensors miss you. The car keeps full speed. Step out for a head-on hit.

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

[ENG#7.2] (7.2 Environment contracts)
### 7.2 Environment contracts
World objects declare collision, sensing and rendering separately. The active surface whitelist is tarmac and pavement, both with player/lunge/car speed and braking factors 1. Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. The active structures/props are barriers, fixed crates and cones. Van, barrier and crate block car-forward, car-side and player-diagnostic rays; Sedan and cone do not. No mask suppresses essential actor/commitment/spent cues. These explicit trial masks replace the legacy height-threshold and shared occluder boolean. A solid barrier, a visual occluder and a gap are not interchangeable. A prop's visible footprint must agree with the collision footprint used for placement and traffic clearance. Cover blocks only its declared sensor channels; that must be observable in diagnostics and in the required encounter fixture.
The Van's height supports mobile occlusion, but its presence does not remove its own identity, spent-state or threat cues. Physics continues outside the optional diagnostic cone. The normal camera must show the full active Road; a UI redesign must not crop an approach without providing and testing an equivalent warning.
The slice contains no required holes, low-grip trap, multiplier plate or elevated route. Core manoeuvres must work on normal road before terrain modifiers are introduced. Moving a cone cannot seal every legal recovery route or permanently block the finite traffic schedule. Placement is rejected when the full footprint is invalid, with feedback that leaves the prop in the dummy's possession.

# YOUR PREVIOUS OUTPUT

{
 "params": [],
 "vehicles": {
  "sedan": {
   "job": "Depot inspection run",
   "jobZh": "仓区巡检",
   "review": "pending",
   "roof": [
    {
     "shape": "rect",
     "x": -24,
     "y": -11,
     "w": 40,
     "h": 22,
     "stroke": "secondary",
     "lineWidth": 1,
     "alpha": 0.5
    },
    {
     "shape": "rect",
     "x": -27,
     "y": -9,
     "w": 3,
     "h": 18,
     "fill": "secondary"
    },
    {
     "shape": "text",
     "x": -16,
     "y": 4,
     "text": "01",
     "size": 10,
     "font": "mono",
     "align": "center",
     "fill": "primary"
    },
    {
     "shape": "ring",
     "x": 17,
     "y": 0,
     "r": 5.5,
     "lineWidth": 1.5,
     "stroke": "primary"
    },
    {
     "shape": "circle",
     "x": 17,
     "y": 0,
     "r": 3,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": 4,
     "y": -14,
     "w": 6,
     "h": 2.5,
     "fill": "secondary"
    },
    {
     "shape": "rect",
     "x": 4,
     "y": 11.5,
     "w": 6,
     "h": 2.5,
     "fill": "secondary"
    },
    {
     "shape": "line",
     "points": [
      [
       -24,
       -6
      ],
      [
       -10,
       -6
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1,
     "alpha": 0.6
    }
   ],
   "sources": [
    "DESIGN#D5.1",
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D10.3~1",
    "DESIGN#D10.2",
    "LOG#P1.2/light-and-relief"
   ]
  },
  "van": {
   "job": "Parts delivery",
   "jobZh": "零件配送",
   "review": "pending",
   "roof": [
    {
     "shape": "rect",
     "x": -30,
     "y": -13,
     "w": 60,
     "h": 26,
     "stroke": "secondary",
     "lineWidth": 1,
     "alpha": 0.5
    },
    {
     "shape": "line",
     "points": [
      [
       -28,
       -13
      ],
      [
       -28,
       13
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1,
     "alpha": 0.7
    },
    {
     "shape": "line",
     "points": [
      [
       13,
       -13
      ],
      [
       13,
       13
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1,
     "alpha": 0.7
    },
    {
     "shape": "text",
     "x": -19,
     "y": 4,
     "text": "02",
     "size": 10,
     "font": "mono",
     "align": "center",
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": -33,
     "y": -8,
     "w": 3,
     "h": 16,
     "fill": "primary"
    },
    {
     "shape": "ring",
     "x": 24,
     "y": 0,
     "r": 6,
     "lineWidth": 1.5,
     "stroke": "primary"
    },
    {
     "shape": "circle",
     "x": 24,
     "y": 0,
     "r": 3.5,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": 10,
     "y": -16,
     "w": 8,
     "h": 2.5,
     "fill": "secondary"
    },
    {
     "shape": "rect",
     "x": 10,
     "y": 13.5,
     "w": 8,
     "h": 2.5,
     "fill": "secondary"
    }
   ],
   "sources": [
    "DESIGN#D5.1",
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D10.3~1",
    "DESIGN#D10.2",
    "LOG#P1.2/light-and-relief"
   ]
  }
 },
 "dummy": {
  "markings": [
   {
    "shape": "quadrant",
    "x": -3,
    "y": 0,
    "r": 5,
    "a": "joints",
    "b": "floor"
   },
   {
    "shape": "ring",
    "x": -3,
    "y": 0,
    "r": 7,
    "lineWidth": 1,
    "stroke": "joints"
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      8
     ],
     [
      -3,
      12
     ]
    ],
    "stroke": "joints",
    "lineWidth": 1.5
   },
   {
    "shape": "line",
    "points": [
     [
      -3,
      -12
     ],
     [
      -3,
      -8
     ]
    ],
    "stroke": "joints",
    "lineWidth": 1.5
   },
   {
    "shape": "stripes",
    "x": -11,
    "y": -6,
    "w": 4,
    "h": 12,
    "angle": 45,
    "gap": 3,
    "stroke": "joints",
    "lineWidth": 1
   }
  ],
  "sources": [
   "DESIGN#D4.1",
   "DESIGN#D10.1",
   "DESIGN#D10.3~1",
   "LOG#P1.2/dummy-damage-states"
  ]
 },
 "environment": {
  "straight": [
   {
    "shape": "text",
    "x": 60,
    "y": 332,
    "text": "TEST ROAD 01 · 测试路 01",
    "size": 16,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual test-road identifier painted at the district entry.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 620,
    "y": 272,
    "text": "ZONE A-1",
    "size": 12,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Numbered measuring zone on the north lane.",
    "sources": [
     "DESIGN#D9.1",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "rect",
    "x": 330,
    "y": 360,
    "w": 120,
    "h": 16,
    "stroke": "fleet",
    "lineWidth": 1.5,
    "surface": "shoulder",
    "hazard": false,
    "note": "Outline of a maintenance service bay on the pavement.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.2"
    ]
   },
   {
    "shape": "text",
    "x": 390,
    "y": 372,
    "text": "MAINT BAY · 维修位",
    "size": 10,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "shoulder",
    "hazard": false,
    "note": "Service marking naming the bay.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 560,
    "y": 150,
    "w": 100,
    "h": 46,
    "stroke": "secondary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Depot forecourt outline north of the road.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 610,
    "y": 178,
    "text": "DEPOT 仓区 A",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Destination sign that justifies the traffic.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      610,
      200
     ],
     [
      610,
      218
     ]
    ],
    "stroke": "secondary",
    "lineWidth": 1.5,
    "dash": [
     6,
     4
    ],
    "surface": "verge",
    "hazard": false,
    "note": "Access path from depot to shoulder.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 560,
    "y": 196,
    "w": 100,
    "h": 8,
    "angle": 45,
    "gap": 6,
    "stroke": "dummy",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": true,
    "note": "High-visibility hazard edge on the depot gate.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 14,
    "y": 420,
    "text": "SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区",
    "size": 12,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual district identifier at entry.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D1"
    ]
   }
  ],
  "barrier": [
   {
    "shape": "text",
    "x": 120,
    "y": 332,
    "text": "TEST ROAD 02 · 测试路 02",
    "size": 16,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual test-road identifier at entry.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 600,
    "y": 272,
    "text": "ZONE B-2",
    "size": 12,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Numbered measuring zone on the north lane.",
    "sources": [
     "DESIGN#D9.1"
    ]
   },
   {
    "shape": "text",
    "x": 60,
    "y": 372,
    "text": "SERVICE LANE · 维修道",
    "size": 10,
    "font": "mono",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "shoulder",
    "hazard": false,
    "note": "Service marking on the south pavement.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      250,
      394
     ],
     [
      290,
      394
     ]
    ],
    "stroke": "secondary",
    "lineWidth": 1.5,
    "dash": [
     5,
     4
    ],
    "surface": "verge",
    "hazard": false,
    "note": "Centre mark through the first barrier gap.",
    "sources": [
     "DESIGN#D6.2",
     "LOG#P1.8"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      510,
      394
     ],
     [
      550,
      394
     ]
    ],
    "stroke": "secondary",
    "lineWidth": 1.5,
    "dash": [
     5,
     4
    ],
    "surface": "verge",
    "hazard": false,
    "note": "Centre mark through the second barrier gap.",
    "sources": [
     "DESIGN#D6.2",
     "LOG#P1.8"
    ]
   },
   {
    "shape": "stripes",
    "x": 250,
    "y": 404,
    "w": 40,
    "h": 6,
    "angle": 45,
    "gap": 5,
    "stroke": "dummy",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": true,
    "note": "Hazard edge marking the first gap.",
    "sources": [
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "stripes",
    "x": 510,
    "y": 404,
    "w": 40,
    "h": 6,
    "angle": 45,
    "gap": 5,
    "stroke": "dummy",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": true,
    "note": "Hazard edge marking the second gap.",
    "sources": [
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "text",
    "x": 270,
    "y": 424,
    "text": "GAP A · 通道",
    "size": 10,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Label for the first gap.",
    "sources": [
     "DESIGN#D9.2",
     "LOG#P1.8"
    ]
   },
   {
    "shape": "text",
    "x": 530,
    "y": 424,
    "text": "GAP B · 通道",
    "size": 10,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Label for the second gap.",
    "sources": [
     "DESIGN#D9.2",
     "LOG#P1.8"
    ]
   },
   {
    "shape": "text",
    "x": 340,
    "y": 150,
    "text": "CROSS-DOCK 转运 B",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Destination sign for the northern yard.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 60,
    "y": 460,
    "w": 200,
    "h": 90,
    "stroke": "fleet",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Staging yard outline south of the barrier.",
    "sources": [
     "DESIGN#D9.2",
     "LOG#P1.8"
    ]
   },
   {
    "shape": "text",
    "x": 160,
    "y": 508,
    "text": "STAGING 暂存区",
    "size": 14,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Staging yard label.",
    "sources": [
     "DESIGN#D9.2"
    ]
   }
  ],
  "corner": [
   {
    "shape": "text",
    "x": 60,
    "y": 472,
    "text": "TEST ROAD 03 · 测试路 03",
    "size": 16,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual test-road identifier at entry.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 550,
    "y": 120,
    "text": "ZONE C-3",
    "size": 12,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Numbered measuring zone on the vertical leg.",
    "sources": [
     "DESIGN#D9.1"
    ]
   },
   {
    "shape": "stripes",
    "x": 300,
    "y": 360,
    "w": 90,
    "h": 20,
    "angle": 45,
    "gap": 6,
    "stroke": "dummy",
    "lineWidth": 1.5,
    "surface": "shoulder",
    "hazard": true,
    "note": "Hazard hatching on the inside shoulder before the bend.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D6.2"
    ]
   },
   {
    "shape": "rect",
    "x": 40,
    "y": 290,
    "w": 140,
    "h": 60,
    "stroke": "secondary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Maintenance yard outline north-west of the road.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 110,
    "y": 324,
    "text": "MAINT YARD 维修场",
    "size": 12,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Maintenance yard sign.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 650,
    "y": 280,
    "w": 120,
    "h": 60,
    "stroke": "secondary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Logistics gate forecourt outside the bend.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 710,
    "y": 314,
    "text": "COLD CHAIN 冷链 C",
    "size": 14,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Destination sign for the logistics gate.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 14,
    "y": 580,
    "text": "SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区",
    "size": 12,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual district identifier along the south edge.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D1"
    ]
   }
  ]
 }
}

# ISSUES TO FIX

## Validator (automatic checks)
- V1 [grounding/block] environment.barrier[3].sources: LOG#P1.8 — Cited chunk was not in the retrieved context. (pipeline)
- V2 [grounding/block] environment.barrier[4].sources: LOG#P1.8 — Cited chunk was not in the retrieved context. (pipeline)
- V3 [grounding/block] environment.barrier[7].sources: LOG#P1.8 — Cited chunk was not in the retrieved context. (pipeline)
- V4 [grounding/block] environment.barrier[8].sources: LOG#P1.8 — Cited chunk was not in the retrieved context. (pipeline)
- V5 [grounding/block] environment.barrier[10].sources: LOG#P1.8 — Cited chunk was not in the retrieved context. (pipeline)
- V6 [rule/fix] environment.straight[5]: DEPOT 仓区 A — Text is about 111 units wide but its board is 100; it spills over the edge. (DESIGN#D10.4)
- V7 [rule/fix] environment.barrier[3]: overlaps barrier at (0,388) — Cover must stay legible as cover. (DESIGN#D10.6)
- V8 [rule/fix] environment.barrier[4]: overlaps barrier at (290,388) — Cover must stay legible as cover. (DESIGN#D10.6)
- V9 [rule/fix] environment.corner[6]: COLD CHAIN 冷链 C — Text is about 141 units wide but its board is 120; it spills over the edge. (DESIGN#D10.4)

## Critic
- C1 [rule/fix] vehicles.sedan.roof[3]: found "{\"shape\":\"ring\",\"x\":17,\"y\":0,\"r\":5.5,\"lineWidth\":1.5,\"stroke\":\"primary\"}" — Decoration must not imitate closed or opening commitment rings. A primary-colour ring on the car roof reads as a commitment cue. (DESIGN#D10.3~1). Fix: "{\"shape\":\"circle\",\"x\":17,\"y\":0,\"r\":5.5,\"fill\":\"secondary\"}"
- C2 [rule/fix] vehicles.van.roof[5]: found "{\"shape\":\"ring\",\"x\":24,\"y\":0,\"r\":6,\"lineWidth\":1.5,\"stroke\":\"primary\"}" — Decoration must not imitate closed or opening commitment rings. A primary-colour ring on the car roof reads as a commitment cue. (DESIGN#D10.3~1). Fix: "{\"shape\":\"circle\",\"x\":24,\"y\":0,\"r\":6,\"fill\":\"secondary\"}"
- C3 [rule/fix] environment.straight[6].dash: found "\"dash\":[6,4]" — Dashed lines in cue colour imitate the dashed path of a car's commitment. Decoration must not look like a cue. (DESIGN#D5.1). Fix: "Remove \"dash\". Draw the access path as a solid secondary line."
- C4 [rule/fix] environment.barrier[3].dash: found "\"dash\":[5,4]" — A dashed secondary line through a gap imitates a planned route or predicted path cue. Kerbs and stripes add no mechanics. (DESIGN#D10.3~1). Fix: "Remove \"dash\". Draw the gap centre mark as a solid secondary line, or drop it."
- C5 [rule/fix] environment.barrier[4].dash: found "\"dash\":[5,4]" — A dashed secondary line through a gap imitates a planned route or predicted path cue. Kerbs and stripes add no mechanics. (DESIGN#D10.3~1). Fix: "Remove \"dash\". Draw the gap centre mark as a solid secondary line, or drop it."
- C6 [rule/fix] environment.barrier[5]: found "\"hazard\":true,\"note\":\"Hazard edge marking the first gap.\"" — Decoration must not imply mechanics. Yellow 45° hazard hatching beside a gap looks like barrier hatching or a danger zone, but the gap is an ordinary passable opening. (DESIGN#D6.2). Fix: "Remove this stripes item. If a gap marker is kept, use a flat secondary-colour kerb line with \"hazard\":false."
- C7 [rule/fix] environment.barrier[6]: found "\"hazard\":true,\"note\":\"Hazard edge marking the second gap.\"" — Decoration must not imply mechanics. Yellow 45° hazard hatching beside a gap looks like barrier hatching or a danger zone, but the gap is an ordinary passable opening. (DESIGN#D6.2). Fix: "Remove this stripes item. If a gap marker is kept, use a flat secondary-colour kerb line with \"hazard\":false."
- C8 [rule/fix] environment.corner[2]: found "\"hazard\":true,\"note\":\"Hazard hatching on the inside shoulder before the bend.\"" — Shoulders are plain pavement with no mechanics. A 90×20 hatched yellow patch reads as a solid barrier or a hazard zone and implies a mechanic. Yellow is also the dummy's accent. (DESIGN#D6.2). Fix: "Remove this item. If kept, make it a thin flat kerb line in secondary with \"hazard\":false and no 45° hatching."

Apply every fix. Change nothing else. Output the complete corrected JSON object.