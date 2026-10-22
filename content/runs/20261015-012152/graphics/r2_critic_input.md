# BRIEF — Graphics: vehicle identities, dummy markings, district dressing
- Vehicles are identical grey rounded rectangles with a windscreen. Only the floating tag tells SEDAN-01 from VAN-02.
- No vehicle shows a district job (D9.2 anchor 3) or self-driving hardware. D10.6 asks for two recognisable vehicle identities.
- The dummy has a head disc, shoulder bar, joints and nose vector, but none of the FARSIGHT markings D4.1 requires.
- The road is a calibration grid and nothing else: no logistics or maintenance district, entrances, destinations, service markings or bilingual test identifiers (D9.2 anchors 1 and 2).
- D10.6: a greybox can establish feel but cannot pass the beauty gate.

## Consumer contract
- Vehicle roof shapes draw in car-local units after the body fill and before windscreen, lights and the state pip. Origin is the car centre; +x points to the nose; +y is the car's right side. The body is vehicles.<cls>.length by vehicles.<cls>.width.
- The state pip draws at the car centre, radius 8. Keep a clear circle of pip_clear_radius around the origin.
- Dummy markings draw in body-local units after the body fill, under the shoulder bar, head and nose vector. Origin is the body centre; +x is facing. Footprint radius is body.radius. The nose vector runs along +x from x = 6.5; keep the nose corridor clear.
- Dummy markings fade with wear like the body's yellow.
- Environment decals draw in world units (world.width by world.height) after the road and before shadows, statics, cones, cars and cues.
- The road for each level is a centreline polyline; tarmac half-width is world.laneWidth; shoulders add proto.shoulderWidth each side. 'tarmac' decals sit within world.laneWidth of the centreline, 'shoulder' within the shoulder band, 'verge' beyond it.
- Text uses the P1 fonts: mono = B612 Mono, ui = B612, brand = Nunito.

## Already drawn by the renderer (do not redraw or imitate)
- Field: floor fill, 40-unit calibration grid, small crosshair marks every 200 units.
- Road: tarmac band, pavement shoulders, edge strips, the dashed centre line.
- Statics: pillars labelled P0, P1..., barriers with hatching, crates, and their shadows toward 7:30.
- Cars: body fill, roof light gradient, windscreen, headlights, brake lights, amber indicators, the state pip at the centre, the model tag above.
- Dummy: yellow dented body, shoulder bar, black joints, head disc, nose vector, charge ring around it.
- Cue shapes that decoration must not imitate: chevrons and arrows (intent), closed or opening rings (commitment, charge), red dashed ring (interrupted), dashed car outlines (predicted pose), the red STOP line, the aqua BLIND wedge, the grey caution triangle.

# CANON

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

[JUICE#J4] (J4 Intensity rules (Proposed))
## J4 Intensity rules (Proposed)
- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.

[JUICE#J2] (J2 Reference talks — general juice)
## J2 Reference talks — general juice
| Source | Technique | DUMMIES reading |
|---|---|---|
| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) | Hit pause. Screen shake. Camera kick. Knockback. Impact effects. Permanence: debris stays. | Hit pause is `feedback.hitStop`. Knockback is P1.3 recoil. Permanence suits tyre marks and dents. |
| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) | Tweening. Squash and stretch. Particles. Sound on every action. | The dummy squashes on lunge and recovery (P1.2). Sound keeps a visual equivalent (D9.4). |

[ENG#7.4] (7.4 Expansion environments)
### 7.4 Expansion environments
Road, Junction and Roundabout remain the intended progression of traffic situations. The slice does not require all three. Each expansion stage needs a distinct tactical purpose, a stage quota, a finite opportunity budget and a tested upgrade-coverage matrix. Junction right-of-way and roundabout entry are explicit authored traffic rules; new intersections do not inherit a claim of safety from straight-road tests.
Terrain expansion retains pavement/kerbs, grass/hedges, gravel, puddles, oil, mud, launch mats, impact plates and speed bumps as candidate content. Each surface declares separate player movement, lunge, car speed, braking, sensing and score effects. A visual material cannot acquire implicit physics. Only profile-enabled surfaces affect a run. The legacy surface values require reconciliation and testing before promotion; they are not active slice settings.
An impact plate's proposed 1.5 multiplier applies to score only, never health loss or credits. A launch mat modifies the declared reach calculation and must use the same prediction renderer. Slippery terrain requires braking/commitment witnesses. Gap traversal requires Jump's full-footprint landing rules; Jump cannot bypass an ordinary solid wall by treating it as a gap. Falling must specify its recovery position, elapsed simulation cost, body consequences and finite-traffic consequences before being offered.
Height bands and sensor masks remain data fields so cover and future traversal do not require a rewrite. Multi-deck navigation, scrolling worlds, weather and fog are expansion-gated. They must preserve critical cues and give an actual tactical return for their production and testing cost.

[DESIGN#D1.1] (D1.1 Loop)
### D1.1 Loop
1. Observe a car. Read its intent and commitment.
2. Bait it, shape its route or intercept it.
3. Lunge into the opening.
4. A qualifying impact damages the body and scores. It can extend that model's future detection range.
5. A destroyed body completes one test. Each nonterminal write-off grants one body credit.
6. Spend the credit on a body part. The replacement chassis carries it.
7. Use the new freedom against returning, adapted traffic.

[ENG#9.4] (9.4 Records and eligibility)
### 9.4 Records and eligibility
A score category identifies profile/version, effective gameplay configuration, applicable build compatibility, ending class and continuation status. Licensed completions, explicit Non-compliant withdrawals and failed tests are separate categories; an incomplete farming run must not displace a completed run. Within a comparable category, sort points descending, then active simulation time ascending. Retain total interaction time separately for experience analysis.
Fresh uninterrupted approved runs are ranked separately from continued runs. Practice and debug runs are unranked. Applying a tuning change or debug grant permanently invalidates that run's ranked eligibility, even if the value is reverted. Developer controls stay out of the visitor flow. Accessibility settings that do not change gameplay can remain in the same category; settings that change timing or physics require an explicit category rule.
Store configuration identity with each record. A changed profile archives or separates earlier scores; it does not relabel them as comparable. This is local score integrity, not a claim of cheat-proof security. Initials entry is optional and must not obstruct replay or the visitor reset.

[DESIGN#D3.10] (D3.10 Combinations — Expansion-gated)
### D3.10 Combinations — Expansion-gated
- Longer profiles deepen the first choice through combinations, trade-offs and fleet responses.
- Each longer profile needs its own body and credit budget, prices and legal sequences.
- Each also needs first-choice alternatives and declared unmet opportunities.
- The legacy fifteen-node total of 38 credits is historical, not an approved economy.

[DESIGN#D10.3~2] (D10.3 Information taxonomy (§4.3))
Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.
Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

[DRIVER#DB1a] (DB1a Right-hand traffic)
## DB1a Right-hand traffic
Lanes keep right (Design D6). UK rules apply mirrored. Distances and timings do not change.
| UK rule (keep left) | DUMMIES rule (keep right) | In the sim |
|---|---|---|
| Keep left | Keep right | Lane 0 eastbound, lane 1 westbound |
| Overtake on the right | Pass on the left, through the oncoming lane | Lateral offset `d` < 0 crosses the centre line |
| Kerb on the left | Kerb and shoulder on the right | `d` > 0 up to `proto.swerveOuter` |
| Obstruction on your side: give way to oncoming traffic | Same | A car crosses only if the oncoming corridor is clear |
| Pull left for an emergency vehicle | Pull right | Proposed (DB6, Emergency) |
| Short turn is left; right turn crosses traffic | Short turn is right; left turn crosses traffic | L3: lane 0 turns left on the outer lane; lane 1 turns right on the inner lane. No crossing turns yet. |
- **US:** These keep-right rules are native. Only the numbers differ (DB2).
- **Shoulder pass:** A game allowance. A real driver uses a paved verge only. Cars prefer it because it avoids the oncoming lane.

[LOG#P1.5] (P1.5 — Three-road campaign, traffic, blind spots)
## P1.5 — Three-road campaign, traffic, blind spots
**Build:** `dummies_p1.html` v6 · 14 Oct 2026 · Addresses O1.17–O1.21.

[DRIVER#DB5] (DB5 States and cues)
## DB5 States and cues
| State | Behaviour | Cue |
|---|---|---|
| Cruise | At limit | — |
| Caution | Slowing past a nearby dummy | Grey warning triangle on the roof. Brake lights. |
| Intention | Reacting; plan not yet fixed | Chevron. Indicator if a lane change is planned. |
| Committed: stop | Braking to the stop line | Closed ring. Red STOP line. |
| Committed: pass / return | Slow lateral pass or return to lane | Closed ring. Indicators. Dashed path. |
| Expiring | Commitment ending | Opening ring |
| Interrupted | Safety braking on its route | Red broken ring |
| Holding | Stopped and waiting | Ring. Brake lights. |
| Honking / flashing | Blocked > 5 s | HONK or FLASH bubble. Hazard lights. Headlight flash. |

[LOG#P1.3/physics-basis] (Physics basis)
### Physics basis
- **Contact normal `n`:** Points from the dummy into the car at the contact point.
- **Closing speed:** `u = (v_dummy − v_car) · n`. Only the normal component counts. Frame-independent.
- **Angle:** `θ` between relative velocity and `n`. Normal speed falls as `cos θ`.
- **Reduced mass:** `μ = m_d·m_c / (m_d + m_c)`.
- **Impulse:** `J = (1 + e)·μ·u`. Equal and opposite on both bodies.
- **Dummy Δv:** `J / m_d = (1 + e)·m_c/(m_d + m_c)·u`. A light body takes almost all the Δv.
- **Energy absorbed:** `½·μ·(1 − e²)·u²`. Grows with the square of closing speed.
- **Friction:** Tangential impulse ≤ `μ_f·J`. Drags the dummy along a glancing car.

[DESIGN#D10.4] (D10.4 Reach and legibility (§4.4))
### D10.4 Reach and legibility (§4.4)
The starting reach treatment is a restrained nonnumeric mark visible during ordinary movement. It predicts current straight-lunge reach and static blocking geometry. It does not promise a collision with a moving car. During the action the trace shows its snapshotted path; Spine may steer away from the initial projection.
Compare this treatment with wear animation alone. Keep the least intrusive version that passes fresh/worn prediction tests. There is no categorical prohibition on a predictive mark.
Reference type uses 24-unit cap height for model IDs/readouts, 16 for secondary labels and 9 for deliberate texture. These are trial values, not assurances of legibility at a distance. Name the actual display and input hardware before release testing. Evaluate the planned 1.5–2.5 m range, motion, cue overlap and high-contrast mode. Allow essential marks to displace texture or decorative frame content.

[ENG#5.8] (5.8 Initial effective movement and sensing values — Trial)
### 5.8 Initial effective movement and sensing values — Trial
| Parameter | Slice value | Meaning |
|---|---:|---|
| `movement.walkSpeed` | 81 units/s | Starting ordinary movement speed |
| `movement.runSpeed` | 162 units/s | Full run speed |
| `movement.rampSeconds` | 1 s | Run buildup; resets as specified in §5.2 |
| `movement.turnRate` | 180 degrees/s | Baseline angular rate |
| `movement.turnStartup` | 0 s | No mechanical startup delay |
| `upgrades.hipsTurnRate` | 360 degrees/s | Owned Hips angular rate |
| `movement.alignThreshold` | 30 degrees | Full translation-speed alignment boundary |
| `movement.turningSpeedFraction` | 0.6 | Translation factor while misaligned |
| `movement.stopSeconds` | 0.25 s | Linear release coast duration |
| `movement.counterPressAngle` | 135 degrees | Opposition threshold measured from velocity |
| `movement.counterPressStop` | 0.4 | Multiplier on counter-braking duration |
| `movement.lungeDistance` | 164 units | Fresh unmodified reach before terrain |
| `movement.wearFloor` | 0.45 | Lower bound on worn reach factor |
| `movement.lungeDuration` | 0.3 s | Original lunge action interval; damage uses actual velocity |
| `movement.lungeRecovery` | 0.35 s | Recovery after the lunge |
| `upgrades.spineLimit` | 45 degrees | Maximum steering away from initial launch direction |
| `upgrades.spineRate` | 540 degrees/s | Steering-rate limit during the original action |
| `upgrades.carrySpeed` | 0.85 | Ground-speed factor while carrying |
| `upgrades.throwDistance` | 120 units | Unobstructed throw-range candidate |
| `battery.capacity` | 3 charge | Maximum baseline charge |
| `battery.lungeCost` | 1 charge | Accepted lunge cost |
| `battery.secondsPerCharge` | 0.8 s/charge | Refill period after the delay |
| `battery.refillDelaySeconds` | 0.3 s | Delay after successful spending |
| `sensing.coneWidth` | 90 degrees | Baseline resolved sensor-information wedge |
| `sensing.coneReach` | 900 units, clipped to world | Informational reach, not a display-dependent physics value |
| `sensing.zoneFadeIn` | 0.15 s | Visual scan transition; cannot postpone an essential reflex cue |
| `feedback.hitStop` | 0.06 s | Gameplay pause on a qualifying hit |
| `feedback.writeOffSeconds` | 1.1 s | Destruction presentation with simulation frozen |
No visual-opacity setting may silently reintroduce decorative translucency into the matte field or make an essential cue unreadable. Resolve the sensor-zone material through §4's contrast/shape tests.

[DRIVER#DB3a] (DB3a Sensors (P1.9))
### DB3a Sensors (P1.9)
Sensors point along the car's heading. They do not bend with the road. The route is known from the map.
| Sensor | Shape | Size |
|---|---|---|
| Forward beam | Rectangle from the nose | `perception.forwardLength` long; car width + `body.radius` each side |
| Driver's field | Rectangle from the rear bumper | Same length; car width + `body.radius` + `proto.driver.cautionZone` each side |
- **Seen:** Inside a sensor and not occluded.
- **On route:** Then measured along the car's route, not the beam.
- **Toggle:** `proto.sensorStraight` 1. Set 0 for the P1.1–P1.8 sensors that follow the road.
- **Matches the GDD:** Design D5.2 already specifies a rectangle from the nose.

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- dummy.markings[1]: {"shape": "text", "x": -6.5, "y": 0, "text": "FS", "size": 9, "font": "mono", "… -> {"shape": "text", "x": -5, "y": 2.5, "text": "FS", "size": 9, "font": "mono", "… (ENG#13.5)
- vehicles.sedan.roof[0].alpha: 0.6 -> 1 (ENG#5.8)
- environment.straight[6].text: A1 仓区入口 -> A1 仓区入口 DEPOT (DESIGN#D9.2)
- environment.barrier[4].text: B1 检修场 -> B1 检修场 YARD (DESIGN#D9.2)
- environment.corner[5].text: C1 站场 -> C1 站场 YARD (DESIGN#D9.2)
- environment.corner[8].text: 充电位 CHARGE -> 车位 FLEET BAY (DESIGN#D10.3~1)
- environment.straight[0].fill: secondary -> primary (DESIGN#D10.2)
- environment.barrier[0].fill: secondary -> primary (DESIGN#D10.2)
- environment.corner[0].fill: secondary -> primary (DESIGN#D10.2)

# CONTENT

{
 "params": [
  {
   "id": "proto.art.signSize",
   "value": 14,
   "unit": "world units",
   "purpose": "Essential bilingual district signage text size on the road and verges",
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D6.1"
   ]
  },
  {
   "id": "proto.art.markSize",
   "value": 10,
   "unit": "world units",
   "purpose": "Secondary service-marking text size, above the ui.typeTexture floor",
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D10.3~1"
   ]
  }
 ],
 "vehicles": {
  "sedan": {
   "job": "Depot parcel courier",
   "jobZh": "仓区快递",
   "review": "pending",
   "roof": [
    {
     "shape": "rect",
     "x": -26,
     "y": -11,
     "w": 5,
     "h": 22,
     "fill": "secondary",
     "alpha": 1
    },
    {
     "shape": "line",
     "points": [
      [
       -18,
       -10
      ],
      [
       6,
       -10
      ]
     ],
     "stroke": "primary",
     "lineWidth": 1.5
    },
    {
     "shape": "line",
     "points": [
      [
       -18,
       10
      ],
      [
       6,
       10
      ]
     ],
     "stroke": "primary",
     "lineWidth": 1.5
    },
    {
     "shape": "circle",
     "x": -14,
     "y": 0,
     "r": 3.5,
     "fill": "primary"
    },
    {
     "shape": "circle",
     "x": -14,
     "y": 0,
     "r": 1.5,
     "fill": "structure"
    },
    {
     "shape": "circle",
     "x": -8,
     "y": 11,
     "r": 2,
     "fill": "secondary"
    }
   ],
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D5.1",
    "LOG#P1.2/light-and-relief"
   ]
  },
  "van": {
   "job": "Maintenance supply run",
   "jobZh": "维保物资配送",
   "review": "pending",
   "roof": [
    {
     "shape": "stripes",
     "x": -30,
     "y": -14,
     "w": 40,
     "h": 4,
     "angle": 45,
     "gap": 4,
     "stroke": "primary"
    },
    {
     "shape": "stripes",
     "x": -30,
     "y": 10,
     "w": 40,
     "h": 4,
     "angle": 45,
     "gap": 4,
     "stroke": "primary"
    },
    {
     "shape": "line",
     "points": [
      [
       -31,
       -13
      ],
      [
       -31,
       13
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1.5
    },
    {
     "shape": "line",
     "points": [
      [
       -14,
       -12
      ],
      [
       -14,
       12
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1.5
    },
    {
     "shape": "circle",
     "x": -23,
     "y": 0,
     "r": 4.5,
     "fill": "secondary",
     "stroke": "primary",
     "lineWidth": 1
    },
    {
     "shape": "circle",
     "x": -23,
     "y": 0,
     "r": 1.8,
     "fill": "structure"
    },
    {
     "shape": "line",
     "points": [
      [
       10,
       -12
      ],
      [
       10,
       12
      ]
     ],
     "stroke": "primary",
     "lineWidth": 2
    }
   ],
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D5.1",
    "DESIGN#D6.2"
   ]
  }
 },
 "dummy": {
  "markings": [
   {
    "shape": "rect",
    "x": -12,
    "y": -4.5,
    "w": 11,
    "h": 9,
    "fill": "floor",
    "stroke": "primary",
    "lineWidth": 0.8
   },
   {
    "shape": "text",
    "x": -5,
    "y": 2.5,
    "text": "FS",
    "size": 9,
    "font": "mono",
    "align": "center",
    "fill": "primary"
   },
   {
    "shape": "quadrant",
    "x": -2,
    "y": -8,
    "r": 3.5,
    "a": "primary",
    "b": "floor"
   },
   {
    "shape": "quadrant",
    "x": -2,
    "y": 8,
    "r": 3.5,
    "a": "primary",
    "b": "floor"
   },
   {
    "shape": "line",
    "points": [
     [
      4,
      -11
     ],
     [
      4,
      -6.5
     ]
    ],
    "stroke": "primary",
    "lineWidth": 1
   },
   {
    "shape": "line",
    "points": [
     [
      4,
      6.5
     ],
     [
      4,
      11
     ]
    ],
    "stroke": "primary",
    "lineWidth": 1
   }
  ],
  "sources": [
   "DESIGN#D4.1",
   "DESIGN#D10.1",
   "DESIGN#D10.2",
   "LOG#P1.2/dummy-damage-states"
  ]
 },
 "environment": {
  "straight": [
   {
    "shape": "text",
    "x": 40,
    "y": 268,
    "text": "物流路 LOGISTICS RD",
    "size": 14,
    "font": "ui",
    "align": "left",
    "fill": "primary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual road name stencilled on the tarmac of the logistics road",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "circle",
    "x": 200,
    "y": 330,
    "r": 6,
    "fill": "shoulder",
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "tarmac",
    "hazard": false,
    "note": "Utility access cover; no mechanics",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      170,
      232
     ],
     [
      410,
      232
     ]
    ],
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Painted service kerb line on the north pavement",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      20,
      368
     ],
     [
      270,
      368
     ]
    ],
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Painted service kerb line on the south pavement",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "rect",
    "x": 190,
    "y": 182,
    "w": 90,
    "h": 24,
    "fill": "grid",
    "surface": "verge",
    "hazard": false,
    "note": "Flat apron in front of the depot gate",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "rect",
    "x": 190,
    "y": 140,
    "w": 90,
    "h": 40,
    "fill": "structure",
    "stroke": "primary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Depot gate: the entrance that justifies the traffic",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 235,
    "y": 160,
    "text": "A1 仓区入口 DEPOT",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "primary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual depot entrance label",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 400,
    "y": 436,
    "text": "测试区01 TEST ZONE 01",
    "size": 14,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual district/test identifier board",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D9.1"
    ]
   }
  ],
  "barrier": [
   {
    "shape": "text",
    "x": 40,
    "y": 268,
    "text": "维保路 SERVICE RD",
    "size": 14,
    "font": "ui",
    "align": "left",
    "fill": "primary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual maintenance road name stencilled on the tarmac",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "circle",
    "x": 600,
    "y": 330,
    "r": 6,
    "fill": "shoulder",
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "tarmac",
    "hazard": false,
    "note": "Utility access cover; no mechanics",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      368
     ],
     [
      800,
      368
     ]
    ],
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Painted service kerb line on the south pavement, behind the barrier",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "rect",
    "x": 300,
    "y": 130,
    "w": 100,
    "h": 40,
    "fill": "structure",
    "stroke": "primary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Maintenance yard gate on the north side",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 350,
    "y": 150,
    "text": "B1 检修场 YARD",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "primary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual yard label",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 252,
    "y": 410,
    "w": 36,
    "h": 14,
    "fill": "floor",
    "stroke": "structure",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Service door beyond the west barrier gap; destination for the gap",
    "sources": [
     "DESIGN#D9.2",
     "LOG#P1.5/pillars-and-blind-spots"
    ]
   },
   {
    "shape": "rect",
    "x": 512,
    "y": 410,
    "w": 36,
    "h": 14,
    "fill": "floor",
    "stroke": "structure",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Service door beyond the east barrier gap",
    "sources": [
     "DESIGN#D9.2",
     "LOG#P1.5/pillars-and-blind-spots"
    ]
   },
   {
    "shape": "text",
    "x": 270,
    "y": 440,
    "text": "检修口 SERVICE DOOR",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual service-door label (west)",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 530,
    "y": 440,
    "text": "检修口 SERVICE DOOR",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual service-door label (east)",
    "sources": [
     "DESIGN#D9.2"
    ]
   }
  ],
  "corner": [
   {
    "shape": "text",
    "x": 40,
    "y": 462,
    "text": "物流路 LOGISTICS RD",
    "size": 14,
    "font": "ui",
    "align": "left",
    "fill": "primary",
    "review": "pending",
    "surface": "tarmac",
    "hazard": false,
    "note": "Bilingual road name on the approach leg",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "circle",
    "x": 120,
    "y": 415,
    "r": 6,
    "fill": "shoulder",
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "tarmac",
    "hazard": false,
    "note": "Utility access cover; no mechanics",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      508
     ],
     [
      440,
      508
     ]
    ],
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Painted service kerb line on the south pavement",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      618,
      0
     ],
     [
      618,
      330
     ]
    ],
    "stroke": "structure",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Painted service kerb line on the east pavement of the vertical leg",
    "sources": [
     "DESIGN#D9.2",
     "ENG#7.2"
    ]
   },
   {
    "shape": "rect",
    "x": 300,
    "y": 260,
    "w": 80,
    "h": 36,
    "fill": "structure",
    "stroke": "primary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Yard gate inside the bend",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 340,
    "y": 278,
    "text": "C1 站场 YARD",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "primary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual yard gate label",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 300,
    "y": 298,
    "w": 80,
    "h": 8,
    "fill": "grid",
    "surface": "verge",
    "hazard": false,
    "note": "Flat apron in front of the yard gate",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "rect",
    "x": 80,
    "y": 535,
    "w": 120,
    "h": 40,
    "fill": "structure",
    "stroke": "primary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Fleet bay serving the district vehicles",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 140,
    "y": 555,
    "text": "车位 FLEET BAY",
    "size": 10,
    "font": "ui",
    "align": "center",
    "fill": "primary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual fleet bay label",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 640,
    "y": 300,
    "text": "测试区03 TEST ZONE 03",
    "size": 14,
    "font": "ui",
    "align": "left",
    "fill": "secondary",
    "review": "pending",
    "surface": "verge",
    "hazard": false,
    "note": "Bilingual district/test identifier board beside the vertical leg",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D9.1"
    ]
   }
  ]
 }
}