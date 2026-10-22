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

[DESIGN#D10.6] (D10.6 Representative finished assets (§4.6))
### D10.6 Representative finished assets (§4.6)
The ten-minute candidate includes a finished dummy treatment, two recognisable vehicle identities, one coherent environment, readable sensors/commitment/spent cues, report/shop/ending screens and an intentional sound mix. A greybox can establish feel but cannot pass the beauty gate.
Higher structures use visible mass and shadows; sensor-blocking cover must look like cover. Palette/material rules yield when necessary for reserved cue readability. Height bands are descriptive art metadata; collision flags are authoritative (§7).

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

[ENG#6.5] (6.5 Recurrence, moods and voice)
### 6.5 Recurrence, moods and voice
The slice schedule is eight repetitions of **Sedan–Van–Sedan–Sedan–Van**: 40 possible appearances, 24 Sedan and 16 Van. The initial nominal admission interval is 12 active simulation seconds. The first due appearance is at stage start; legal admission can be delayed by an occupied entrance. Admission means creation at the validated 200-unit off-screen lead-in, not arrival at the visible edge. At unimpeded cruise, nominal lead-in travel is about 1.45 s for Sedan and 1.67 s for Van; turning, braking and initial footprint placement can add time. Scheduled, admitted and exited counts are distinct. A successful early ending cancels the unused remainder. No quota implies that all 40 must appear.
The schedule is deterministic and part of the versioned profile. For slot `i`, admission cannot precede `max(12 × i, previousActualAdmission + 12)` and still requires safe entry; the first slot has no previous-admission constraint. A due appearance waits for safe entry, avoiding a burst after a blockage. No opportunity disappears while queued. The last nominal admission is at 468 s (39 intervals), not 480 s. This is neither a minimum session length nor a ten-minute completion guarantee: success can cancel most of the queue. Interval, approach geometry and delay are jointly tested for ten-minute pacing and recurrence before minute five. In the unobstructed sequence, the next Sedan slot is 12–24 s later and the next Van slot 24–36 s later; the first new snapshot admitted after a learning event is the relevant return, not an already admitted car.
The same model should visibly respond to an earlier successful approach while the visitor is still playing. Standard mood removes a major confound. Additional moods are expansion content and must specify independent behaviour effects, legible cues and exact roster allocation or a declared statistical tolerance. A population percentage alone does not guarantee that a short run contains a mood.
Barks may express corporate confidence, embarrassment or bureaucratic blame. They cannot assert facts the simulation did not establish. The first report may state the observed impact and model identity, but it withholds the explanatory learned-counter message until the player has encountered the changed return. Evaluation asks the player what changed before supplying that explanation. Later reports may make the adaptation explicit.

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

[DESIGN#D6.1] (D6.1 One authored Road (§7.1))
### D6.1 One authored Road (§7.1)
The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. The logical world reference is 800 × 600 units, independent of the surrounding UI layout. A different display scales the view without silently changing reach or car travel time. Changing logical world dimensions requires new pacing and collision witnesses.
The initial lane width is 56 units. Openings must accommodate the complete 26-unit dummy footprint with usable margin, including the worn-reach case. A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. The authored level asset must supply actual positions, collider footprints, spawn transforms, legal exits, cover flags and prop recovery positions. Its geometry is tested as a single versioned asset. This document does not invent validated coordinates.
The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. There must be room to use Hips and Spine and meaningful placements to use Carry and Throw. Each advertised advantage is compared with what the unupgraded dummy can already do. Simply including a cone does not prove Carry has value; simply including a corner does not prove Hips has value.
The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. Essential geometry stays legible behind the authored art. Clear shoulders and escape positions are part of the layout, not emergency developer cheats.

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

[DESIGN#D11.1] (D11.1 Coherent fallback and expansion protection (§12.5))
### D11.1 Coherent fallback and expansion protection (§12.5)
The slice is already the small version: one level, two models and two meaningful branches. Cut decorative scenery, optional voice lines and extra vehicle variety before cutting the first choice, its follow-on development, observable adaptation, readable feedback, access needs or closure. If the active profile must change, publish a new complete profile with revised objectives, credits, schedule and tests. A two-level fallback cannot inherit an unrelated fifteen-body quota by accident.
Keep expansion cheap through versioned profiles, content IDs, explicit surface/sensor flags, owned-upgrade derivation, a phase-aware menu flow and tested checkpoints. Do not build all future environments, menus or features merely to demonstrate modularity. The immediate architectural proof is that a small second-stage fixture and an alternative profile can be added without duplicating core rules.

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

[LOG#P1.5/pillars-and-blind-spots] (Pillars and blind spots)
### Pillars and blind spots
- **Pillars:** Flyover columns now stand at the road edge, replacing distant crates. Shadow height `proto.art.pillarHeight` 60.
- **L1:** Three north, two south, staggered.
- **L2:** Three north. The south barrier with gaps remains.
- **L3:** One in the inside of the bend, one beside the vertical leg, one at the west straight, one outside the bend.
- **Blind spots:** Pillars, barriers and vans cast sensor shadows from each car's nose. Shown inside the scanners as pale aqua wedges labelled BLIND.
- **Tactic:** Stand in a pillar's shadow and side sensors miss you. The car keeps full speed. Step out for a head-on hit.

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

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

[JUICE#J4] (J4 Intensity rules (Proposed))
## J4 Intensity rules (Proposed)
- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.

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

[JUICE#J2] (J2 Reference talks — general juice)
## J2 Reference talks — general juice
| Source | Technique | DUMMIES reading |
|---|---|---|
| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) | Hit pause. Screen shake. Camera kick. Knockback. Impact effects. Permanence: debris stays. | Hit pause is `feedback.hitStop`. Knockback is P1.3 recoil. Permanence suits tyre marks and dents. |
| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) | Tweening. Squash and stretch. Particles. Sound on every action. | The dummy squashes on lunge and recovery (P1.2). Sound keeps a visual equivalent (D9.4). |

[DESIGN#D10.4] (D10.4 Reach and legibility (§4.4))
### D10.4 Reach and legibility (§4.4)
The starting reach treatment is a restrained nonnumeric mark visible during ordinary movement. It predicts current straight-lunge reach and static blocking geometry. It does not promise a collision with a moving car. During the action the trace shows its snapshotted path; Spine may steer away from the initial projection.
Compare this treatment with wear animation alone. Keep the least intrusive version that passes fresh/worn prediction tests. There is no categorical prohibition on a predictive mark.
Reference type uses 24-unit cap height for model IDs/readouts, 16 for secondary labels and 9 for deliberate texture. These are trial values, not assurances of legibility at a distance. Name the actual display and input hardware before release testing. Evaluate the planned 1.5–2.5 m range, motion, cue overlap and high-contrast mode. Allow essential marks to displace texture or decorative frame content.

[ENG#7.2] (7.2 Environment contracts)
### 7.2 Environment contracts
World objects declare collision, sensing and rendering separately. The active surface whitelist is tarmac and pavement, both with player/lunge/car speed and braking factors 1. Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. The active structures/props are barriers, fixed crates and cones. Van, barrier and crate block car-forward, car-side and player-diagnostic rays; Sedan and cone do not. No mask suppresses essential actor/commitment/spent cues. These explicit trial masks replace the legacy height-threshold and shared occluder boolean. A solid barrier, a visual occluder and a gap are not interchangeable. A prop's visible footprint must agree with the collision footprint used for placement and traffic clearance. Cover blocks only its declared sensor channels; that must be observable in diagnostics and in the required encounter fixture.
The Van's height supports mobile occlusion, but its presence does not remove its own identity, spent-state or threat cues. Physics continues outside the optional diagnostic cone. The normal camera must show the full active Road; a UI redesign must not crop an approach without providing and testing an equivalent warning.
The slice contains no required holes, low-grip trap, multiplier plate or elevated route. Core manoeuvres must work on normal road before terrain modifiers are introduced. Moving a cone cannot seal every legal recovery route or permanently block the finite traffic schedule. Placement is rejected when the full footprint is invalid, with feedback that leaves the prop in the dummy's possession.

[DESIGN#D6.2] (D6.2 Environment)
### D6.2 Environment
- **Surfaces:** Tarmac and pavement only. Shoulders are pavement. Kerbs and stripes add no mechanics.
- **Structures and props:** Barriers, fixed crates, cones.
- **Sensor blocking:** Van, barrier and crate block car and player-diagnostic rays. Sedan and cone don't.
- No mask hides an actor, commitment or spent cue.
- No holes, low-grip traps, multiplier plates or elevated routes in the slice.
- Moving a cone can never seal every recovery route.
- Exact contracts: Engineering §7.2.

[DESIGN#D1.1] (D1.1 Loop)
### D1.1 Loop
1. Observe a car. Read its intent and commitment.
2. Bait it, shape its route or intercept it.
3. Lunge into the opening.
4. A qualifying impact damages the body and scores. It can extend that model's future detection range.
5. A destroyed body completes one test. Each nonterminal write-off grants one body credit.
6. Spend the credit on a body part. The replacement chassis carries it.
7. Use the new freedom against returning, adapted traffic.

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

[ENG#9.4] (9.4 Records and eligibility)
### 9.4 Records and eligibility
A score category identifies profile/version, effective gameplay configuration, applicable build compatibility, ending class and continuation status. Licensed completions, explicit Non-compliant withdrawals and failed tests are separate categories; an incomplete farming run must not displace a completed run. Within a comparable category, sort points descending, then active simulation time ascending. Retain total interaction time separately for experience analysis.
Fresh uninterrupted approved runs are ranked separately from continued runs. Practice and debug runs are unranked. Applying a tuning change or debug grant permanently invalidates that run's ranked eligibility, even if the value is reverted. Developer controls stay out of the visitor flow. Accessibility settings that do not change gameplay can remain in the same category; settings that change timing or physics require an explicit category rule.
Store configuration identity with each record. A changed profile archives or separates earlier scores; it does not relabel them as comparable. This is local score integrity, not a claim of cheat-proof security. Initials entry is optional and must not obstruct replay or the visitor reset.

[DESIGN#D9.3] (D9.3 Voice and reports (§3.3))
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[DESIGN#D3.10] (D3.10 Combinations — Expansion-gated)
### D3.10 Combinations — Expansion-gated
- Longer profiles deepen the first choice through combinations, trade-offs and fleet responses.
- Each longer profile needs its own body and credit budget, prices and legal sequences.
- Each also needs first-choice alternatives and declared unmet opportunities.
- The legacy fifteen-node total of 38 credits is historical, not an approved economy.

[DESIGN#D3.3] (D3.3 Node effects)
### D3.3 Node effects
| Node | Freedom returned | Parameters (Trial) |
|---|---|---|
| Hips | Faster deliberate reorientation | `upgrades.hipsTurnRate` 360°/s; base `movement.turnRate` 180°/s |
| Spine | Steer during the original lunge window | `upgrades.spineLimit` 45°; `upgrades.spineRate` 540°/s |
| Neck | Independent aim through an accessible second directional input. No auto lock. No automatic movement penalty. | Expansion-gated |
| Carry | Pick up a cone and place it deliberately | `upgrades.carrySpeed` 0.85 ground-speed factor; `props.cone.pickupEdgeRange` 12 |
| Throw | Ranged cone release inheriting actual velocity. Held B keeps close drop. | `upgrades.throwDistance` 120; `props.cone.throwSeconds` 0.2; `input.dropHoldSeconds` 0.25 |
| Hold on | Grab an unspent car by a valid side contact. Ride it. Launch off along facing with normal lunge charge. | Expansion-gated |
| Wider view | Wider resolved sensor information | Expansion-gated; base `sensing.coneWidth` 90° |
| Memory | Timestamped last-seen snapshot. Visibly stale, never live. | Expansion-gated |
| Ears | Forecast of a planned entry. A waiting marker replaces a false countdown when admission is blocked. | Expansion-gated |
| Spring start | No run buildup | Expansion-gated; base `movement.rampSeconds` 1 s |
| Jump | A second distinct A press in the jump window hops a flagged floor gap. Costs a second charge. Extends the remaining path; never restarts the lunge. Clears gaps only. | Expansion-gated |
| Grip | No low-grip slide or extended coast. Ordinary stopping distance remains. | Expansion-gated |
| Big battery | Higher charge capacity | Expansion-gated; base `battery.capacity` 3 |
| Fast charge | Faster refill | Expansion-gated; base `battery.secondsPerCharge` 0.8 |
| Kinetic charge | Eligible pre-bonus impact damage refills charge. Cannot refill a written-off body. | Expansion-gated |
- Expansion node values are legacy candidates. No price or value is approved.
- Exact node rules: Engineering §5.6–5.7.

[DESIGN#D10.3~2] (D10.3 Information taxonomy (§4.3))
Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.
Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

# VALIDATOR
- V1 environment.corner[7].surface: tarmac — Declared tarmac but it sits on shoulder (69 units from the centreline).

# CONTENT

{
 "params": [
  {
   "id": "proto.art.markWidth",
   "value": 2,
   "unit": "world units",
   "purpose": "Stroke width of painted lane lines and edge lines on every P1 road.",
   "sources": [
    "DESIGN#D10.1",
    "DESIGN#D6.1"
   ]
  },
  {
   "id": "proto.art.signTextSize",
   "value": 16,
   "unit": "world units",
   "purpose": "Text size for bilingual district and destination identifiers, so essential language is not micro-type. Matches ui.typeSecondary.",
   "sources": [
    "DESIGN#D9.2"
   ]
  }
 ],
 "vehicles": {
  "sedan": {
   "job": "Parcel Courier",
   "jobZh": "园区包裹速递",
   "review": "pending",
   "roof": [
    {
     "shape": "rect",
     "x": -25,
     "y": -9,
     "w": 12,
     "h": 18,
     "fill": "structure",
     "stroke": "primary",
     "lineWidth": 1
    },
    {
     "shape": "circle",
     "x": -19,
     "y": 0,
     "r": 3.5,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": -24,
     "y": -5,
     "w": 10,
     "h": 10,
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "rect",
     "x": -10,
     "y": -13,
     "w": 20,
     "h": 2,
     "fill": "secondary"
    },
    {
     "shape": "rect",
     "x": -10,
     "y": 11,
     "w": 20,
     "h": 2,
     "fill": "secondary"
    },
    {
     "shape": "rect",
     "x": 22,
     "y": -13,
     "w": 4,
     "h": 3,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": 22,
     "y": 10,
     "w": 4,
     "h": 3,
     "fill": "primary"
    }
   ],
   "sources": [
    "DESIGN#D5.1",
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D10.1"
   ]
  },
  "van": {
   "job": "Road Maintenance",
   "jobZh": "道路养护",
   "review": "pending",
   "roof": [
    {
     "shape": "line",
     "points": [
      [
       -31,
       -10
      ],
      [
       31,
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
       -31,
       10
      ],
      [
       31,
       10
      ]
     ],
     "stroke": "primary",
     "lineWidth": 1.5
    },
    {
     "shape": "line",
     "points": [
      [
       -28,
       -10
      ],
      [
       -28,
       10
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "line",
     "points": [
      [
       -24,
       -10
      ],
      [
       -24,
       10
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "line",
     "points": [
      [
       -20,
       -10
      ],
      [
       -20,
       10
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "line",
     "points": [
      [
       -16,
       -10
      ],
      [
       -16,
       10
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "line",
     "points": [
      [
       -12,
       -10
      ],
      [
       -12,
       10
      ]
     ],
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "stripes",
     "x": -8,
     "y": -15,
     "w": 16,
     "h": 4,
     "angle": 45,
     "gap": 3,
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "stripes",
     "x": -8,
     "y": 11,
     "w": 16,
     "h": 4,
     "angle": 45,
     "gap": 3,
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "circle",
     "x": 22,
     "y": 0,
     "r": 3.5,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": 17,
     "y": -5.5,
     "w": 11,
     "h": 11,
     "stroke": "secondary",
     "lineWidth": 1
    },
    {
     "shape": "rect",
     "x": -33,
     "y": -13,
     "w": 3,
     "h": 26,
     "fill": "secondary"
    },
    {
     "shape": "rect",
     "x": 26,
     "y": -15,
     "w": 4,
     "h": 3,
     "fill": "primary"
    },
    {
     "shape": "rect",
     "x": 26,
     "y": 12,
     "w": 4,
     "h": 3,
     "fill": "primary"
    }
   ],
   "sources": [
    "DESIGN#D5.1",
    "DESIGN#D9.2",
    "DESIGN#D10.6",
    "DESIGN#D10.1"
   ]
  }
 },
 "dummy": {
  "markings": [
   {
    "shape": "quadrant",
    "x": -5,
    "y": 0,
    "r": 6,
    "a": "joints",
    "b": "floor"
   },
   {
    "shape": "rect",
    "x": -10,
    "y": -8,
    "w": 10,
    "h": 16,
    "stroke": "primary",
    "lineWidth": 1
   },
   {
    "shape": "line",
    "points": [
     [
      -5,
      -10
     ],
     [
      -5,
      10
     ]
    ],
    "stroke": "primary",
    "lineWidth": 1
   },
   {
    "shape": "line",
    "points": [
     [
      -11,
      0
     ],
     [
      4,
      0
     ]
    ],
    "stroke": "primary",
    "lineWidth": 1
   },
   {
    "shape": "rect",
    "x": -12,
    "y": -5,
    "w": 2,
    "h": 10,
    "fill": "joints"
   },
   {
    "shape": "rect",
    "x": -4,
    "y": -11,
    "w": 3,
    "h": 3,
    "fill": "primary"
   },
   {
    "shape": "rect",
    "x": -4,
    "y": 8,
    "w": 3,
    "h": 3,
    "fill": "primary"
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
    "shape": "line",
    "points": [
     [
      0,
      300
     ],
     [
      800,
      300
     ]
    ],
    "dash": [
     16,
     12
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Lane divider between the two lanes of the logistics road.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      244
     ],
     [
      800,
      244
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "North tarmac edge line.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      356
     ],
     [
      800,
      356
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "South tarmac edge line.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "text",
    "x": 170,
    "y": 336,
    "text": "LOGISTICS · MAINTENANCE",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Road identifier painted on the tarmac at entry.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 170,
    "y": 282,
    "text": "物流 · 养护道路",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "review": "pending",
    "note": "Chinese road identifier, paired with the English line.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "rect",
    "x": 530,
    "y": 128,
    "w": 170,
    "h": 40,
    "fill": "structure",
    "stroke": "primary",
    "lineWidth": 1.5,
    "surface": "verge",
    "hazard": false,
    "note": "Depot gate board on the north verge.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 615,
    "y": 153,
    "text": "DEPOT 货运场",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "primary",
    "surface": "verge",
    "hazard": false,
    "review": "pending",
    "note": "Bilingual destination text for the depot the traffic serves.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 530,
    "y": 172,
    "w": 170,
    "h": 8,
    "angle": 45,
    "gap": 5,
    "stroke": "warning",
    "lineWidth": 2,
    "surface": "verge",
    "hazard": true,
    "note": "High-visibility hatching along the depot gate threshold.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 330,
    "y": 222,
    "w": 80,
    "h": 20,
    "angle": 45,
    "gap": 6,
    "stroke": "secondary",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Service pull-in bay for maintenance vehicles.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      310,
      368
     ],
     [
      540,
      368
     ]
    ],
    "dash": [
     3,
     37
    ],
    "stroke": "structure",
    "lineWidth": 8,
    "surface": "shoulder",
    "hazard": false,
    "note": "Calibration ticks along the south shoulder between the two south pillars, one every 40 units.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D10.2"
    ]
   },
   {
    "shape": "ring",
    "x": 110,
    "y": 368,
    "r": 6,
    "lineWidth": 1.5,
    "stroke": "secondary",
    "surface": "shoulder",
    "hazard": false,
    "note": "Inspection hatch cover on the shoulder.",
    "sources": [
     "DESIGN#D9.2"
    ]
   }
  ],
  "barrier": [
   {
    "shape": "line",
    "points": [
     [
      0,
      300
     ],
     [
      800,
      300
     ]
    ],
    "dash": [
     16,
     12
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Lane divider between the two lanes.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      244
     ],
     [
      800,
      244
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "North tarmac edge line.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      356
     ],
     [
      800,
      356
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "South tarmac edge line.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "text",
    "x": 170,
    "y": 336,
    "text": "LOGISTICS · MAINTENANCE",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Road identifier repeated at entry.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 170,
    "y": 282,
    "text": "物流 · 养护道路",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "review": "pending",
    "note": "Chinese road identifier.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 250,
    "y": 388,
    "w": 40,
    "h": 12,
    "angle": 45,
    "gap": 5,
    "stroke": "secondary",
    "lineWidth": 1,
    "alpha": 0.6,
    "surface": "verge",
    "hazard": false,
    "note": "Threshold hatching across the first barrier gap, an entrance to the service yard.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "stripes",
    "x": 510,
    "y": 388,
    "w": 40,
    "h": 12,
    "angle": 45,
    "gap": 5,
    "stroke": "secondary",
    "lineWidth": 1,
    "alpha": 0.6,
    "surface": "verge",
    "hazard": false,
    "note": "Threshold hatching across the second barrier gap.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "text",
    "x": 270,
    "y": 424,
    "text": "YARD",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "verge",
    "hazard": false,
    "note": "Destination label beyond the first gap.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 270,
    "y": 444,
    "text": "货场",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "verge",
    "hazard": false,
    "review": "pending",
    "note": "Chinese destination label beyond the first gap.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 530,
    "y": 424,
    "text": "BAY",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "verge",
    "hazard": false,
    "note": "Destination label beyond the second gap.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 530,
    "y": 444,
    "text": "装卸",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "verge",
    "hazard": false,
    "review": "pending",
    "note": "Chinese loading-bay label beyond the second gap.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 60,
    "y": 150,
    "w": 120,
    "h": 8,
    "angle": 45,
    "gap": 5,
    "stroke": "warning",
    "lineWidth": 2,
    "surface": "verge",
    "hazard": true,
    "note": "High-visibility maintenance cordon hatching on the north verge.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D9.2"
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
    "dash": [
     3,
     37
    ],
    "stroke": "structure",
    "lineWidth": 8,
    "surface": "shoulder",
    "hazard": false,
    "note": "Calibration ticks along the south shoulder.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D10.2"
    ]
   }
  ],
  "corner": [
   {
    "shape": "line",
    "points": [
     [
      0,
      440
     ],
     [
      450,
      440
     ]
    ],
    "dash": [
     16,
     12
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Lane divider on the west approach to the bend.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      450,
      440
     ],
     [
      475.9,
      436.6
     ],
     [
      500,
      426.6
     ],
     [
      520.7,
      410.7
     ],
     [
      536.6,
      390
     ],
     [
      546.6,
      364.1
     ],
     [
      550,
      340
     ]
    ],
    "dash": [
     16,
     12
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Lane divider following the right-angle bend.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      550,
      340
     ],
     [
      550,
      0
     ]
    ],
    "dash": [
     16,
     12
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Lane divider on the vertical leg.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      496
     ],
     [
      450,
      496
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Outer tarmac edge line on the west approach.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      450,
      496
     ],
     [
      490.4,
      490.7
     ],
     [
      528,
      475.1
     ],
     [
      560.3,
      450.3
     ],
     [
      585.1,
      418
     ],
     [
      600.7,
      380.7
     ],
     [
      606,
      340
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Outer tarmac edge line round the bend.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      606,
      340
     ],
     [
      606,
      0
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Outer tarmac edge line on the vertical leg.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      0,
      384
     ],
     [
      450,
      384
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Inner tarmac edge line on the west approach.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      450,
      384
     ],
     [
      461.4,
      382.5
     ],
     [
      472,
      378.1
     ],
     [
      481.1,
      371.1
     ],
     [
      488.1,
      362
     ],
     [
      492.5,
      351.4
     ],
     [
      494,
      340
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Inner tarmac edge line round the bend.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      494,
      340
     ],
     [
      494,
      0
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Inner tarmac edge line on the vertical leg.",
    "sources": [
     "DESIGN#D6.1",
     "DESIGN#D10.1"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      300,
      420
     ],
     [
      320,
      440
     ],
     [
      300,
      460
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "First turn chevron painted on the approach.",
    "sources": [
     "DESIGN#D6.1",
     "LOG#P1.5/pillars-and-blind-spots"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      340,
      420
     ],
     [
      360,
      440
     ],
     [
      340,
      460
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Second turn chevron painted on the approach.",
    "sources": [
     "DESIGN#D6.1",
     "LOG#P1.5/pillars-and-blind-spots"
    ]
   },
   {
    "shape": "line",
    "points": [
     [
      380,
      420
     ],
     [
      400,
      440
     ],
     [
      380,
      460
     ]
    ],
    "stroke": "fleet",
    "lineWidth": 2,
    "surface": "tarmac",
    "hazard": false,
    "note": "Third turn chevron painted on the approach.",
    "sources": [
     "DESIGN#D6.1",
     "LOG#P1.5/pillars-and-blind-spots"
    ]
   },
   {
    "shape": "text",
    "x": 150,
    "y": 474,
    "text": "LOGISTICS · MAINTENANCE",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Road identifier at the west entry.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 150,
    "y": 416,
    "text": "物流 · 养护道路",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "review": "pending",
    "note": "Chinese road identifier at the west entry.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 550,
    "y": 120,
    "text": "DEPOT",
    "size": 16,
    "font": "mono",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "note": "Destination painted on the vertical leg.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "text",
    "x": 550,
    "y": 90,
    "text": "货运场",
    "size": 16,
    "font": "ui",
    "align": "center",
    "fill": "secondary",
    "surface": "tarmac",
    "hazard": false,
    "review": "pending",
    "note": "Chinese destination painted on the vertical leg.",
    "sources": [
     "DESIGN#D9.2"
    ]
   },
   {
    "shape": "stripes",
    "x": 60,
    "y": 498,
    "w": 100,
    "h": 20,
    "angle": 45,
    "gap": 6,
    "stroke": "secondary",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Service pull-in bay on the outer shoulder.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "stripes",
    "x": 90,
    "y": 362,
    "w": 90,
    "h": 20,
    "angle": 45,
    "gap": 6,
    "stroke": "secondary",
    "lineWidth": 1,
    "surface": "shoulder",
    "hazard": false,
    "note": "Service pull-in bay on the inner shoulder.",
    "sources": [
     "DESIGN#D9.2",
     "DESIGN#D6.1"
    ]
   },
   {
    "shape": "stripes",
    "x": 636,
    "y": 340,
    "w": 10,
    "h": 60,
    "angle": 45,
    "gap": 5,
    "stroke": "warning",
    "lineWidth": 2,
    "surface": "verge",
    "hazard": true,
    "note": "High-visibility guard hatching outside the bend.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D9.2"
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
      300
     ]
    ],
    "dash": [
     3,
     37
    ],
    "stroke": "structure",
    "lineWidth": 8,
    "surface": "shoulder",
    "hazard": false,
    "note": "Calibration ticks along the vertical leg's outer shoulder.",
    "sources": [
     "DESIGN#D10.1",
     "DESIGN#D10.2"
    ]
   }
  ]
 }
}