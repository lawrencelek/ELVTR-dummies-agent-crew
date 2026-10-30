# BRIEF — Juice: feedback for every logged event
Content type: juice. Parameter prefix for new IDs: proto.juice.

## The gap (what P1 is thin on)
- P1 has juice, but it is hard-coded in game.js as unlabelled literals: kick(3 + 9 * k, 0.25 + 0.2 * k), 8 + 10k sparks, a 1.3 s stamp.
- No juice value maps to a parameter ID, so none can be tuned, logged or compared (project rule: every statistic maps to a registry ID).
- D4.5 asks for distinct feedback the build lacks: a denied action only shows a toast; a touch on a spent car is a small kick close to a scored hit; braking leaves no trace on the floor; a replacement chassis simply appears.
- The pass was never checked against the genre it borrows from: top-down arcade driving.

## Deliverable
- A data table the P1 renderer reads: one entry per sim event, built only from the renderer's primitives.
- Three persistent states: tyre marks left by braking cars, low-health effects, the replacement-chassis drop.
- Every numeric value is a parameter ID: reuse registry IDs (feedback.hitStop, feedback.writeOffSeconds) and declare new proto.juice.* IDs with value, unit and purpose.
- Each entry names the top-down driving reference it adapts.

## JSON schema
```
{
  "params": [ {"id": "proto.juice.<event>.<name>", "value": number, "unit": "canvas units|s|count|ratio|world units|canvas units/s|alpha", "purpose": "one line", "sources": [chunk ids]} ],
  "hitStop": "feedback.hitStop",
  "writeOff": "feedback.writeOffSeconds",
  "reducedMotion": "<param id, ratio applied to shake, flinch and tremble>",
  "events": [ {
     "event": one of allowed.events,
     "scale": {"by": "<numeric field of the event>", "full": "<param id: field value that gives full intensity>"} | null,
     "shake": {"amp": V, "seconds": V} | null,
     "flash": V | null,            (white field flash, seconds)
     "flinch": true|false,         (body flinch)
     "carPulse": true|false,       (pulse the event's car; car events only)
     "stamp": true|false,          (WRITTEN OFF stamp; writeoff only)
     "particles": [ {"type": allowed.particle_types, "count": V, "speed": V, "life": V, "size": V, "role": allowed.particle_roles, "dir": allowed.particle_dirs} ],
     "reference": "which reference technique this adapts, in a few words",
     "sources": [chunk ids]
  } ],
  "states": {
     "brakeMarks": {"width": V, "alpha": V, "fadeSeconds": V, "max": V, "minSpeed": V, "role": allowed.mark_roles, "reference": "...", "sources": [...]},
     "lowHealth": {"smokeFrom": V, "sparkFrom": V, "vignetteFrom": V, "sources": [...]},
     "replacementDrop": {"seconds": V, "height": V, "reference": "...", "sources": [...]}
  }
}
V is a parameter ID string, or a two-item array [minId, maxId] interpolated by the event's scale (0 to 1). Never a bare number.
```

## Consumer contract (what the renderer can draw)
- game.js processEvents() reads this table for each new sim event. Missing events fall back to the P1.2 constants.
- Shake moves the play field only; HUD and frame never shake. Amplitude is in reference-canvas units and decays quadratically.
- Flash fills the field white at up to 55% opacity for the given seconds. Flinch jitters the body 0.3 s.
- Particles spawn at the dummy (for 'chassis', at the new body). Events that happen elsewhere (honk, purchase, drone-dispatch) cannot have particles. 'backward' is opposite the facing; 'facing' is along it. 'ring' is an expanding outline. 'debris' is a tumbling rectangle.
- Brake marks: while a car brakes above minSpeed, its two rear wheels draw matte lines on the floor, under cars and cues. Each fades over fadeSeconds; at most max segments.
- lowHealth thresholds are wear fractions (1 - health / damage.bodyHealth).
- replacementDrop animates the new chassis from height to the floor over seconds, with its shadow closing in. It runs on the 'chassis' event and is presentation only.
- Sound is out of scope here; the existing P1 tones stay.

## Allowed values
```json
{
 "events": [
  "lunge",
  "impact",
  "knock",
  "touch-spent",
  "writeoff",
  "denied",
  "chassis",
  "throw",
  "drop",
  "pickup",
  "punt",
  "honk",
  "purchase",
  "drone-dispatch"
 ],
 "event_fields": {
  "lunge": [
   "R",
   "charge"
  ],
  "impact": [
   "car",
   "model",
   "cls",
   "zone",
   "closing",
   "angle",
   "dv",
   "strike",
   "raw",
   "assessed",
   "lost",
   "health",
   "carState",
   "cause",
   "bait",
   "lunging",
   "learned",
   "stopped",
   "learnedStandoff"
  ],
  "knock": [
   "car",
   "speed"
  ],
  "touch-spent": [
   "car"
  ],
  "writeoff": [
   "chassis",
   "writeOffs"
  ],
  "denied": [
   "action"
  ],
  "chassis": [
   "chassis",
   "x",
   "y"
  ],
  "throw": [
   "cone",
   "vx",
   "vy"
  ],
  "drop": [
   "cone",
   "x",
   "y"
  ],
  "pickup": [
   "cone"
  ],
  "punt": [
   "cone"
  ],
  "honk": [
   "car",
   "at"
  ],
  "purchase": [
   "node",
   "price",
   "credits"
  ],
  "drone-dispatch": [
   "cone"
  ]
 },
 "particle_types": [
  "dust",
  "smoke",
  "spark",
  "debris",
  "ring"
 ],
 "particle_dirs": [
  "random",
  "backward",
  "facing"
 ],
 "particle_roles": [
  "floor",
  "grid",
  "structure",
  "fleet",
  "dummy",
  "joints",
  "primary",
  "secondary"
 ],
 "mark_roles": [
  "primary",
  "secondary",
  "joints",
  "fleet"
 ]
}
```

## Game data
Registry IDs you may reference (value, unit):
- battery.capacity = 3 charge units
- body.radius = 13 world units
- damage.bodyHealth = 800 health
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- movement.lungeDuration = 0.3 s
- movement.lungeRecovery = 0.35 s
- props.cone.radius = 7.2 world units
- proto.art.barrierHeight = 14
- proto.art.coneHeight = 14
- proto.art.crateHeight = 30
- proto.art.droneHeight = 70
- proto.art.dummyHeight = 18
- proto.art.pillarHeight = 60
- proto.art.shadowScale = 0.3
- proto.droneLiftSeconds = 0.5
- proto.honkSeconds = 5
- proto.recoilScale = 0.6
- proto.recoilSeconds = 0.35
- vehicles.sedan.height = 22 world units
- vehicles.van.height = 34 world units

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

# CONTEXT

[JUICE#J1] (J1 Reference games — top-down arcade driving)
## J1 Reference games — top-down arcade driving
| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

[DESIGN#D4.5] (D4.5 Sensing and feedback (§5.5))
### D4.5 Sensing and feedback (§5.5)
The view cone follows body facing in the slice. It resolves cars' sensor zones and occlusion information in that direction. Cars, identity, route/commitment, brake and spent cues remain available outside the cone. There is no active fog-of-war experiment that hides traffic.
Actor markers remain readable when sprites overlap; occlusion concerns the sensor information and actual sensor rays. Van-class cover can block sensing according to World flags, but must not erase all warning that another vehicle exists.
The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. A 0.06-second hit-stop and 1.1-second destruction presentation are trial values. Cues take priority over particles, shake and decorative information.

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

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[DESIGN#D9.4] (D9.4 Sound (§3.4))
### D9.4 Sound (§3.4)
Factory hum, engines, restrained synthetic music and clinical announcements make the city sound operational even when the body fails. The dummy creaks, clanks, squashes and recovers with physical weight.
Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. Gameplay cues take priority over ambience and have visual equivalents. Voices are optional; text-first barks must work at exhibition volume.
Reports and purchases can use presentation-time sound while simulation is frozen. No sound callback can award damage, currency or learning. There is no automatic repair warning in the slice because automatic repair is disabled.

[LOG#P1.3/rules] (Rules)
### Rules
- **Damage:** `damage.baseImpact × (Δv / Δv_ref)^proto.damageExponent`. `Δv_ref` = standing dummy, sedan head-on at `damage.referenceSpeed`.
- **Exponent 2:** Tracks absorbed energy. Glancing hits fall with `cos² θ`.
- **Strike cap:** The dummy's own approach counts at most `proto.dummyStrikeSpeed`. The lunge keeps its full visual speed. This is the one non-Newtonian rule.
- **Mass:** `proto.dummyMass` relative to `vehicles.sedan.mass`. Car mass changes damage by under 2%; speed dominates.
- **Zones:** `damage.zone.*` unused in this model. Angle replaces them.
- **Recoil:** Physical post-impact velocity × `proto.recoilScale`. Always clears an approaching car.
- **Stagger:** No control for `proto.recoilSeconds`. The lunge ends. Spent cars still bounce you, without damage.
- **Cap:** Assessment still capped at `damage.bodyHealth`.
| ID | Value | Unit |
|---|---:|---|
| `proto.damageModel` | 1 | flag (0 = V29 formula) |
| `proto.damageExponent` | 2 | power |
| `proto.dummyMass` | 0.056 | × sedan mass (≈ 78 kg vs 1,400 kg) |
| `proto.restitution` | 0.3 | ratio |
| `proto.dummyStrikeSpeed` | 100 | world units/s |
| `proto.contactFriction` | 0.3 | ratio |
| `proto.recoilScale` | 0.6 | ratio |
| `proto.recoilSeconds` | 0.35 | s |

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

[DESIGN#D10.6] (D10.6 Representative finished assets (§4.6))
### D10.6 Representative finished assets (§4.6)
The ten-minute candidate includes a finished dummy treatment, two recognisable vehicle identities, one coherent environment, readable sensors/commitment/spent cues, report/shop/ending screens and an intentional sound mix. A greybox can establish feel but cannot pass the beauty gate.
Higher structures use visible mass and shadows; sensor-blocking cover must look like cover. Palette/material rules yield when necessary for reserved cue readability. Height bands are descriptive art metadata; collision flags are authoritative (§7).

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

[ENG#11.2] (11.2 Ownership and dependencies)
### 11.2 Ownership and dependencies
| Owner | Writes | Reads/contracts |
|---|---|---|
| Run coordinator | Phase, event sequence, coordinated outcome commit, ending priority, eligibility | Commands and validated outcomes from other owners |
| Input/action controller | Normalised input and action requests | §5 arbitration, current phase and effective abilities |
| Body | Health, charge, motion/action state and derived player values | Immutable configuration and owned IDs |
| Fleet | Model learning, appearance snapshots, traffic reservations and spent state | World geometry, schedule and committed outcomes |
| World | Level instances, geometry, props and declared surface/sensor effects | Versioned level asset; legal placement commands |
| Damage evaluator | No mutable gameplay state | Contact snapshots; returns assessment and proposed consequences |
| Economy | Credits and owned upgrade IDs | Valid purchase/write-off outcomes |
| Objective/schedule logic | Contract progress and admission cursor under coordinator control | Committed bodies and legal admission/exit events |
| Presentation | Visual/audio/UI state only | Frozen/read-only views; submits user commands |
| Persistence/records | Validated serialised snapshots and comparable records | Coordinator's eligible boundary/results view |
Dependencies are real: an offered upgrade changes controls, body derivation, layout coverage, learning opportunities, shop preview and tests. Fleet timing changes cue guarantees, collision opportunities and pacing. Agents working on those areas must share the same contracts. Presentation cannot mutate health to match an animation; Economy cannot independently count write-offs from sound events.

# YOUR PREVIOUS OUTPUT

{
 "params": [
  {
   "id": "proto.juice.reducedMotion",
   "value": 0.25,
   "unit": "ratio",
   "purpose": "Scale on shake, flinch and tremble under reduced-motion settings.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J4"
   ]
  },
  {
   "id": "proto.juice.lunge.shakeAmpMin",
   "value": 1,
   "unit": "canvas units",
   "purpose": "Lunge camera kick at the lowest charge.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lunge.shakeAmpMax",
   "value": 2.5,
   "unit": "canvas units",
   "purpose": "Lunge camera kick at full charge. Kept small so the nose vector stays readable.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lunge.shakeSeconds",
   "value": 0.15,
   "unit": "s",
   "purpose": "Duration of the lunge camera kick.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.lunge.dustCount",
   "value": 6,
   "unit": "count",
   "purpose": "Dust puffs kicked behind the body on a lunge.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lunge.dustSpeed",
   "value": 70,
   "unit": "canvas units/s",
   "purpose": "Launch speed of lunge dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lunge.dustLife",
   "value": 0.4,
   "unit": "s",
   "purpose": "Lifetime of lunge dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lunge.dustSize",
   "value": 3,
   "unit": "canvas units",
   "purpose": "Size of lunge dust puffs.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.shakeAmpMin",
   "value": 3,
   "unit": "canvas units",
   "purpose": "Shake amplitude for the lightest scored hit. Matches the P1 literal 3.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.shakeAmpMax",
   "value": 12,
   "unit": "canvas units",
   "purpose": "Shake amplitude at full assessed impact. Matches the P1 literal 3 + 9.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.shakeSecondsMin",
   "value": 0.25,
   "unit": "s",
   "purpose": "Shake duration for the lightest scored hit. Matches the P1 literal.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.impact.shakeSecondsMax",
   "value": 0.45,
   "unit": "s",
   "purpose": "Shake duration at full assessed impact. Matches the P1 literal 0.25 + 0.2.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.impact.flash",
   "value": 0.08,
   "unit": "s",
   "purpose": "White contact flash on a scored hit.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.sparkCountMin",
   "value": 8,
   "unit": "count",
   "purpose": "Sparks on the lightest scored hit. Matches the P1 literal 8.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.impact.sparkCountMax",
   "value": 18,
   "unit": "count",
   "purpose": "Sparks at full assessed impact. Matches the P1 literal 8 + 10.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.impact.sparkSpeed",
   "value": 180,
   "unit": "canvas units/s",
   "purpose": "Launch speed of impact sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.sparkLife",
   "value": 0.35,
   "unit": "s",
   "purpose": "Lifetime of impact sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.sparkSize",
   "value": 2.5,
   "unit": "canvas units",
   "purpose": "Size of impact sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.ringSpeed",
   "value": 140,
   "unit": "canvas units/s",
   "purpose": "Expansion speed of the contact ring.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.ringLife",
   "value": 0.2,
   "unit": "s",
   "purpose": "Lifetime of the contact ring.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.impact.ringSize",
   "value": 14,
   "unit": "canvas units",
   "purpose": "Starting radius of the contact ring.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.knock.dustCountMin",
   "value": 2,
   "unit": "count",
   "purpose": "Dust for the slowest damage-free knock.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.knock.dustCountMax",
   "value": 5,
   "unit": "count",
   "purpose": "Dust for a fast damage-free knock.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.knock.dustSpeed",
   "value": 50,
   "unit": "canvas units/s",
   "purpose": "Launch speed of knock dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.knock.dustLife",
   "value": 0.35,
   "unit": "s",
   "purpose": "Lifetime of knock dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.knock.dustSize",
   "value": 2.5,
   "unit": "canvas units",
   "purpose": "Size of knock dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.touchSpent.shakeAmp",
   "value": 1.5,
   "unit": "canvas units",
   "purpose": "Dull bump on a touch of a spent car. Below the lightest scored hit.",
   "sources": [
    "JUICE#J3",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.juice.touchSpent.shakeSeconds",
   "value": 0.12,
   "unit": "s",
   "purpose": "Duration of the spent-car bump. Shorter than any scored hit.",
   "sources": [
    "JUICE#J3",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.juice.touchSpent.dustCount",
   "value": 3,
   "unit": "count",
   "purpose": "Low dust puff on a spent-car touch. No sparks, no flash.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.touchSpent.dustSpeed",
   "value": 30,
   "unit": "canvas units/s",
   "purpose": "Slow launch speed for the dull bump.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.touchSpent.dustLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Lifetime of spent-car dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.touchSpent.dustSize",
   "value": 3.5,
   "unit": "canvas units",
   "purpose": "Size of spent-car dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.shakeAmp",
   "value": 16,
   "unit": "canvas units",
   "purpose": "Heavy shake on write-off. Above the strongest scored hit.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.shakeSeconds",
   "value": 0.7,
   "unit": "s",
   "purpose": "Duration of the write-off shake. Inside the destruction presentation.",
   "sources": [
    "LOG#P1.2/juice",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.juice.writeoff.flash",
   "value": 0.15,
   "unit": "s",
   "purpose": "Field flash on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.writeoff.sparkCount",
   "value": 24,
   "unit": "count",
   "purpose": "Sparks on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.writeoff.sparkSpeed",
   "value": 240,
   "unit": "canvas units/s",
   "purpose": "Launch speed of write-off sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.sparkLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Lifetime of write-off sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.sparkSize",
   "value": 3,
   "unit": "canvas units",
   "purpose": "Size of write-off sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.smokeCount",
   "value": 14,
   "unit": "count",
   "purpose": "Smoke puffs on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.juice.writeoff.smokeSpeed",
   "value": 40,
   "unit": "canvas units/s",
   "purpose": "Launch speed of write-off smoke.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.smokeSize",
   "value": 8,
   "unit": "canvas units",
   "purpose": "Size of write-off smoke puffs.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.debrisCount",
   "value": 10,
   "unit": "count",
   "purpose": "Body-coloured debris pieces on write-off.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.jointDebrisCount",
   "value": 4,
   "unit": "count",
   "purpose": "Black joint debris pieces on write-off.",
   "sources": [
    "JUICE#J3",
    "DESIGN#D10.1"
   ]
  },
  {
   "id": "proto.juice.writeoff.debrisSpeed",
   "value": 160,
   "unit": "canvas units/s",
   "purpose": "Launch speed of debris.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.writeoff.debrisSize",
   "value": 5,
   "unit": "canvas units",
   "purpose": "Size of debris rectangles.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.denied.shakeAmp",
   "value": 1.2,
   "unit": "canvas units",
   "purpose": "Short stutter on a denied action. Costs nothing.",
   "sources": [
    "JUICE#J3",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.juice.denied.shakeSeconds",
   "value": 0.1,
   "unit": "s",
   "purpose": "Duration of the denial stutter.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.chassis.dustCount",
   "value": 10,
   "unit": "count",
   "purpose": "Rotor-wash dust around the arriving chassis.",
   "sources": [
    "JUICE#J1",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.chassis.dustSpeed",
   "value": 80,
   "unit": "canvas units/s",
   "purpose": "Outward speed of rotor-wash dust.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.juice.chassis.dustLife",
   "value": 0.6,
   "unit": "s",
   "purpose": "Lifetime of rotor-wash dust.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.juice.chassis.dustSize",
   "value": 4,
   "unit": "canvas units",
   "purpose": "Size of rotor-wash dust.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.juice.chassis.dropSeconds",
   "value": 0.9,
   "unit": "s",
   "purpose": "Replacement chassis fall time from drone height to the floor.",
   "sources": [
    "JUICE#J1",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.throw.dustCount",
   "value": 3,
   "unit": "count",
   "purpose": "Small dust at the dummy on a cone throw.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.throw.dustSpeed",
   "value": 40,
   "unit": "canvas units/s",
   "purpose": "Launch speed of prop-handling dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.throw.dustLife",
   "value": 0.3,
   "unit": "s",
   "purpose": "Lifetime of prop-handling dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.throw.dustSize",
   "value": 2.5,
   "unit": "canvas units",
   "purpose": "Size of prop-handling dust.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.drop.dustCount",
   "value": 2,
   "unit": "count",
   "purpose": "Dust where the dummy sets a cone down.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.punt.dustCount",
   "value": 4,
   "unit": "count",
   "purpose": "Dust kicked ahead when the dummy punts a cone.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.brakeMarks.width",
   "value": 2.5,
   "unit": "canvas units",
   "purpose": "Width of each rear-wheel tyre mark.",
   "sources": [
    "JUICE#J1",
    "JUICE#J4"
   ]
  },
  {
   "id": "proto.juice.brakeMarks.alpha",
   "value": 0.3,
   "unit": "alpha",
   "purpose": "Starting opacity of a tyre mark. Low contrast, under every cue.",
   "sources": [
    "JUICE#J4",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.brakeMarks.fadeSeconds",
   "value": 12,
   "unit": "s",
   "purpose": "Time for a mark to fade out, so old marks do not read as braking now.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.brakeMarks.max",
   "value": 400,
   "unit": "count",
   "purpose": "Cap on live mark segments.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.brakeMarks.minSpeed",
   "value": 40,
   "unit": "canvas units/s",
   "purpose": "Slowest braking speed that still leaves a mark.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.juice.lowHealth.smokeFrom",
   "value": 0.45,
   "unit": "ratio",
   "purpose": "Wear fraction where body smoke starts.",
   "sources": [
    "LOG#P1.2/dummy-damage-states"
   ]
  },
  {
   "id": "proto.juice.lowHealth.sparkFrom",
   "value": 0.7,
   "unit": "ratio",
   "purpose": "Wear fraction where body sparks start.",
   "sources": [
    "LOG#P1.2/dummy-damage-states"
   ]
  },
  {
   "id": "proto.juice.lowHealth.vignetteFrom",
   "value": 0.7,
   "unit": "ratio",
   "purpose": "Wear fraction where the red edge vignette starts pulsing.",
   "sources": [
    "LOG#P1.2/dummy-damage-states"
   ]
  }
 ],
 "hitStop": "feedback.hitStop",
 "writeOff": "feedback.writeOffSeconds",
 "reducedMotion": "proto.juice.reducedMotion",
 "events": [
  {
   "event": "lunge",
   "scale": {
    "by": "charge",
    "full": "battery.capacity"
   },
   "shake": {
    "amp": [
     "proto.juice.lunge.shakeAmpMin",
     "proto.juice.lunge.shakeAmpMax"
    ],
    "seconds": "proto.juice.lunge.shakeSeconds"
   },
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.lunge.dustCount",
     "speed": "proto.juice.lunge.dustSpeed",
     "life": "proto.juice.lunge.dustLife",
     "size": "proto.juice.lunge.dustSize",
     "role": "structure",
     "dir": "backward"
    }
   ],
   "reference": "Dust kicked backwards (Micro Machines, art of rally)",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3",
    "JUICE#J1",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "impact",
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": {
    "amp": [
     "proto.juice.impact.shakeAmpMin",
     "proto.juice.impact.shakeAmpMax"
    ],
    "seconds": [
     "proto.juice.impact.shakeSecondsMin",
     "proto.juice.impact.shakeSecondsMax"
    ]
   },
   "flash": "proto.juice.impact.flash",
   "flinch": true,
   "carPulse": true,
   "stamp": false,
   "particles": [
    {
     "type": "spark",
     "count": [
      "proto.juice.impact.sparkCountMin",
      "proto.juice.impact.sparkCountMax"
     ],
     "speed": "proto.juice.impact.sparkSpeed",
     "life": "proto.juice.impact.sparkLife",
     "size": "proto.juice.impact.sparkSize",
     "role": "primary",
     "dir": "random"
    },
    {
     "type": "ring",
     "count": "proto.juice.knock.dustCountMin",
     "speed": "proto.juice.impact.ringSpeed",
     "life": "proto.juice.impact.ringLife",
     "size": "proto.juice.impact.ringSize",
     "role": "primary",
     "dir": "random"
    }
   ],
   "reference": "Hit pause, scaled shake, sparks, contact flash (Art of Screenshake)",
   "sources": [
    "JUICE#J3",
    "JUICE#J2",
    "LOG#P1.2/juice",
    "DESIGN#D4.5",
    "JUICE#J4"
   ]
  },
  {
   "event": "knock",
   "scale": {
    "by": "speed",
    "full": "proto.dummyStrikeSpeed"
   },
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": [
      "proto.juice.knock.dustCountMin",
      "proto.juice.knock.dustCountMax"
     ],
     "speed": "proto.juice.knock.dustSpeed",
     "life": "proto.juice.knock.dustLife",
     "size": "proto.juice.knock.dustSize",
     "role": "structure",
     "dir": "random"
    }
   ],
   "reference": "Small dust puff, no reward feedback (art of rally)",
   "sources": [
    "JUICE#J3",
    "JUICE#J1",
    "LOG#P1.3/rules"
   ]
  },
  {
   "event": "touch-spent",
   "scale": null,
   "shake": {
    "amp": "proto.juice.touchSpent.shakeAmp",
    "seconds": "proto.juice.touchSpent.shakeSeconds"
   },
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.touchSpent.dustCount",
     "speed": "proto.juice.touchSpent.dustSpeed",
     "life": "proto.juice.touchSpent.dustLife",
     "size": "proto.juice.touchSpent.dustSize",
     "role": "fleet",
     "dir": "random"
    }
   ],
   "reference": "Dull bump with springy recoil, no burst (Micro Machines)",
   "sources": [
    "JUICE#J3",
    "JUICE#J1",
    "DESIGN#D4.5",
    "LOG#P1.2/juice"
   ]
  },
  {
   "event": "writeoff",
   "scale": null,
   "shake": {
    "amp": "proto.juice.writeoff.shakeAmp",
    "seconds": "proto.juice.writeoff.shakeSeconds"
   },
   "flash": "proto.juice.writeoff.flash",
   "flinch": true,
   "carPulse": false,
   "stamp": true,
   "particles": [
    {
     "type": "spark",
     "count": "proto.juice.writeoff.sparkCount",
     "speed": "proto.juice.writeoff.sparkSpeed",
     "life": "proto.juice.writeoff.sparkLife",
     "size": "proto.juice.writeoff.sparkSize",
     "role": "primary",
     "dir": "random"
    },
    {
     "type": "smoke",
     "count": "proto.juice.writeoff.smokeCount",
     "speed": "proto.juice.writeoff.smokeSpeed",
     "life": "feedback.writeOffSeconds",
     "size": "proto.juice.writeoff.smokeSize",
     "role": "secondary",
     "dir": "random"
    },
    {
     "type": "debris",
     "count": "proto.juice.writeoff.debrisCount",
     "speed": "proto.juice.writeoff.debrisSpeed",
     "life": "feedback.writeOffSeconds",
     "size": "proto.juice.writeoff.debrisSize",
     "role": "dummy",
     "dir": "random"
    },
    {
     "type": "debris",
     "count": "proto.juice.writeoff.jointDebrisCount",
     "speed": "proto.juice.writeoff.debrisSpeed",
     "life": "feedback.writeOffSeconds",
     "size": "proto.juice.writeoff.debrisSize",
     "role": "joints",
     "dir": "random"
    }
   ],
   "reference": "Car destroyed, debris stays; wreck permanence (Super Sprint, GTA)",
   "sources": [
    "JUICE#J3",
    "JUICE#J1",
    "LOG#P1.2/juice",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "denied",
   "scale": null,
   "shake": {
    "amp": "proto.juice.denied.shakeAmp",
    "seconds": "proto.juice.denied.shakeSeconds"
   },
   "flash": null,
   "flinch": true,
   "carPulse": false,
   "stamp": false,
   "particles": [],
   "reference": "Brief loss-of-control stutter (Super Sprint oil slick)",
   "sources": [
    "JUICE#J3",
    "JUICE#J1",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "chassis",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.chassis.dustCount",
     "speed": "proto.juice.chassis.dustSpeed",
     "life": "proto.juice.chassis.dustLife",
     "size": "proto.juice.chassis.dustSize",
     "role": "structure",
     "dir": "random"
    }
   ],
   "reference": "Helicopter lowers the replacement, rotor wash (Super Sprint)",
   "sources": [
    "JUICE#J1",
    "JUICE#J3"
   ]
  },
  {
   "event": "throw",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.throw.dustCount",
     "speed": "proto.juice.throw.dustSpeed",
     "life": "proto.juice.throw.dustLife",
     "size": "proto.juice.throw.dustSize",
     "role": "structure",
     "dir": "facing"
    }
   ],
   "reference": "Arc with stretched shadow stays as P1.2; light dust only (Juice It or Lose It)",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice",
    "JUICE#J2"
   ]
  },
  {
   "event": "drop",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.drop.dustCount",
     "speed": "proto.juice.throw.dustSpeed",
     "life": "proto.juice.throw.dustLife",
     "size": "proto.juice.throw.dustSize",
     "role": "structure",
     "dir": "random"
    }
   ],
   "reference": "Small settle dust on the mundane desk-scale prop (Micro Machines)",
   "sources": [
    "JUICE#J1",
    "JUICE#J3"
   ]
  },
  {
   "event": "pickup",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [],
   "reference": "Quiet action; sound already covers it (Juice It or Lose It)",
   "sources": [
    "JUICE#J2",
    "DESIGN#D9.4"
   ]
  },
  {
   "event": "punt",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [
    {
     "type": "dust",
     "count": "proto.juice.punt.dustCount",
     "speed": "proto.juice.throw.dustSpeed",
     "life": "proto.juice.throw.dustLife",
     "size": "proto.juice.throw.dustSize",
     "role": "structure",
     "dir": "facing"
    }
   ],
   "reference": "Knockback dust along the kick (Art of Screenshake)",
   "sources": [
    "JUICE#J2",
    "JUICE#J3"
   ]
  },
  {
   "event": "honk",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": true,
   "stamp": false,
   "particles": [],
   "reference": "Car pulse stands in for flashing lights; sound carries the horn (Micro Machines)",
   "sources": [
    "LOG#P1.1-observations",
    "JUICE#J1",
    "DESIGN#D9.4"
   ]
  },
  {
   "event": "purchase",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [],
   "reference": "Frame-level confirmation only; field stays still",
   "sources": [
    "DESIGN#D10.5",
    "JUICE#J4"
   ]
  },
  {
   "event": "drone-dispatch",
   "scale": null,
   "shake": null,
   "flash": null,
   "flinch": false,
   "carPulse": false,
   "stamp": false,
   "particles": [],
   "reference": "Drone lift animation already in P1 (helicopter delivery)",
   "sources": [
    "LOG#P1.1-observations",
    "JUICE#J1"
   ]
  }
 ],
 "states": {
  "brakeMarks": {
   "width": "proto.juice.brakeMarks.width",
   "alpha": "proto.juice.brakeMarks.alpha",
   "fadeSeconds": "proto.juice.brakeMarks.fadeSeconds",
   "max": "proto.juice.brakeMarks.max",
   "minSpeed": "proto.juice.brakeMarks.minSpeed",
   "role": "fleet",
   "reference": "Tyre marks as ink strokes on a pale floor (Absolute Drift, art of rally)",
   "sources": [
    "JUICE#J1",
    "JUICE#J3",
    "JUICE#J4",
    "DESIGN#D10.1"
   ]
  },
  "lowHealth": {
   "smokeFrom": "proto.juice.lowHealth.smokeFrom",
   "sparkFrom": "proto.juice.lowHealth.sparkFrom",
   "vignetteFrom": "proto.juice.lowHealth.vignetteFrom",
   "sources": [
    "LOG#P1.2/dummy-damage-states",
    "JUICE#J3",
    "JUICE#J4"
   ]
  },
  "replacementDrop": {
   "seconds": "proto.juice.chassis.dropSeconds",
   "height": "proto.art.droneHeight",
   "reference": "Helicopter lowers the replacement car (Super Sprint)",
   "sources": [
    "JUICE#J1",
    "JUICE#J3",
    "ENG#11.2"
   ]
  }
 }
}

# ISSUES TO FIX

## Validator (automatic checks)
- none

## Critic
- C1 [data/block] events[1].particles[1].count: found "proto.juice.knock.dustCountMin" — Every statistic maps to its own registry ID. The impact ring's count borrows the knock dust minimum, so tuning knock dust would silently change the scored-hit burst. (LOG#P1.2/juice). Fix: "proto.juice.impact.ringCount (add to params: value 1, unit count, purpose \"Contact rings per scored hit.\", sources [\"JUICE#J3\"])"
- C2 [rule/fix] events[5].flinch: found "true" — A denied action costs nothing and must stay distinct from a hit or a miss. Body flinch is impact feedback, and a 0.3 s jitter reads as stagger or damage. (DESIGN#D4.5). Fix: "false"
- C3 [truth/fix] events[5].reference: found "Brief loss-of-control stutter (Super Sprint oil slick)" — Denied is a short stutter that costs nothing. The copy must not imply a loss of control, which would suggest a stagger mechanic. (JUICE#J3). Fix: "Short stutter, costs nothing; distinct from a miss (Super Sprint)"
- C4 [rule/fix] events[11].carPulse: found "true" — The car pulse and flash is impact feedback on a scored hit. On a honking car it reads as a hit, and it stands in for hazard lights and headlight flashes that P1 already draws as the honk cue (also DESIGN#D4.5). (LOG#P1.2/juice). Fix: "false"
- C5 [rule/fix] events[4].particles[1].role: found "secondary" — The secondary colour #4A5A66 is the planning-cue role. Decorative write-off smoke in that colour can read as a planning cue. (DESIGN#D10.2). Fix: "structure"

Apply every fix. Change nothing else. Output the complete corrected JSON object.