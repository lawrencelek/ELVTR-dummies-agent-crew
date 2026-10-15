# BRIEF — Hits: layered juice for every hit, miss and near miss
Content type: hits. Parameter prefix for new IDs: proto.hits.

## The gap (what P1 is thin on)
- My game is thin on juice: every hit should feel more juiced (designer's gap statement).
- P2.0 gives every scored hit one response: a shake, a white flash, a car pulse and sparks at the dummy's centre. A glancing tap and a head-on bait hit feel alike apart from size.
- Nothing happens at the contact point except the hard-coded burst. There is no hit sound beyond two tones, no punch-in, no crumple, no ring.
- The body does not announce a miss (DESIGN D4.5 requires it). A near miss is silent and invisible.
- Designer decision for P2.1: the hit-stop stays the registry's feedback.hitStop and the simulation stays byte-identical to P1.9. All new juice is presentation.

## Deliverable
- A layer table the renderer reads: for each event, a base layer plus accent layers that add on when 'when' conditions match (head-on, bait, lunging, stopped, big damage).
- At least two impact accents, so different hits feel different.
- Entries for write-off, touch on a spent car, near miss, miss and lunge. Knock is optional.
- Every numeric value is a parameter ID: declare proto.hits.* IDs with value, unit, purpose and sources; reuse registry IDs where one fits.
- Each layer names the reference technique it adapts.

## JSON schema
```
{
  "params": [ {"id": "proto.hits.<event>.<name>", "value": number, "unit": "canvas units|s|count|ratio|world units|world units/s|Hz|gain|px", "purpose": "one line", "sources": [chunk ids]} ],
  "hitStop": "feedback.hitStop",
  "reducedMotion": "<param id: ratio applied to shake, zoom, crumple and stumble>",
  "layers": [ {
     "event": one of allowed.events,
     "when": {} for the base layer, or {field: literal} / {numericField: {"min": ID, "max": ID}} for an accent (bounds are parameter IDs),
     "scale": {"by": "<numeric field of the event>", "full": "<param id: value that gives full intensity>"} | null,
     "shake": {"amp": V, "seconds": V} | null,
     "zoom": {"amount": V, "seconds": V} | null,         (field punches in toward the contact; ratio, e.g. 0.04 = 4%)
     "flash": V | null,                                  (white field flash, seconds)
     "crumple": {"amount": V, "seconds": V} | null,      (dummy squashes along the hit direction, springs back; ratio)
     "stumble": {"amp": V, "seconds": V} | null,         (miss: dummy wobbles with arms flailing; amp in radians)
     "ring": {"radius": V, "seconds": V, "width": V, "role": allowed.line_roles} | null,
     "rays": {"count": V, "length": V, "seconds": V} | null,
     "popup": {"size": V, "rise": V, "seconds": V, "pop": V} | null,
     "streaks": {"count": V, "length": V, "seconds": V, "role": allowed.line_roles} | null,
     "particles": [ {"type": allowed.particle_types, "count": V, "speed": V, "life": V, "size": V, "role": allowed.particle_roles, "dir": allowed.particle_dirs, "at": allowed.particle_at} ],
     "sound": {"type": "tone"|"noise", "from": V, "to": V, "seconds": V, "gain": V, "wave": allowed.waves (tone only)} | null,
     "reference": "which reference technique this adapts, in a few words",
     "sources": [chunk ids]
  } ]
}
V is a parameter ID string, or a two-item array [minId, maxId] interpolated by the layer's scale (0 to 1). Never a bare number.
```

## Consumer contract (what the renderer can draw)
- Event fields (all logged; derived cases are logged by the renderer into the trace under 'presentation'):
- - impact: zone, angle, closing, strike, dv, assessed, lost, health, carState, cause, bait, lunging, stopped, cls, seniority
- - knock: speed (the dummy is pushed back by a car; fires with most scored hits)
- - touch-spent: cls (a touch on a car already spent: no damage, no points)
- - writeoff: chassis, writeOffs, plus zone and cls of the impact that caused it
- - lunge: R (reach, world units), charge (charge left)
- - near-miss (derived): gap (metres at closest), speed (car speed, world units/s), lunging, cls. A fast car passes close without contact.
- - miss (derived): gap (metres to the nearest car, or none). A lunge ends with no contact.
- For each event the renderer applies every layer whose 'when' matches, in order. A later layer replaces shake, zoom, flash, crumple, stumble, rays and popup. Particles, rings, streaks and sounds add up.
- Contact point: where the sim resolved the contact (impact, write-off), else between the dummy and the car. 'at': dummy, contact or car. 'away' points from the car toward the dummy and beyond.
- Shake and zoom move the play field only; HUD and frame never move. Shake amplitude is in canvas units and decays quadratically. Zoom eases back over its seconds.
- rays and popup restyle the impact burst cue (DESIGN D10.3): radial lines and the assessed value at the contact. They exist only on positive hits.
- crumple scales the dummy sprite along the hit normal. stumble rotates it and draws flailing arms. Neither moves the simulated body.
- streaks are straight speed lines: behind the dummy for lunge and miss, along the car's travel beside the dummy for near-miss.
- Sound: when a layer has sound, it replaces the P2.0 tone for that event. 'noise' is a filtered noise burst (crunch, whoosh, clatter); from/to are filter frequencies in Hz. 'tone' is an oscillator sweep.
- Cars are drawn where the simulation puts them. The renderer cannot move, bend or dent a car.
- The hit-stop is the simulation's feedback.hitStop (0.06 s). It is not a presentation parameter and must not be redeclared.
- Reserved inks: primary and secondary cue colours belong to cues (EDIT26 4.2.2). Effects use structure, fleet, grid, joints, floor, or dummy for the dummy's own chips.
- The impact burst (rays, contact ring) stays within 2 × body width (EDIT26 4.2.2). Sound gain is clamped to 0.25.

## Allowed values
```json
{
 "events": [
  "impact",
  "knock",
  "touch-spent",
  "writeoff",
  "lunge",
  "near-miss",
  "miss"
 ],
 "event_fields": {
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
   "learnedStandoff",
   "seniority"
  ],
  "knock": [
   "car",
   "speed",
   "model",
   "cls",
   "seniority"
  ],
  "touch-spent": [
   "car",
   "model",
   "cls",
   "seniority"
  ],
  "writeoff": [
   "chassis",
   "writeOffs",
   "car",
   "zone",
   "model",
   "cls",
   "seniority"
  ],
  "lunge": [
   "R",
   "charge"
  ],
  "near-miss": [
   "car",
   "model",
   "cls",
   "seniority",
   "gap",
   "speed",
   "lunging"
  ],
  "miss": [
   "car",
   "model",
   "cls",
   "seniority",
   "gap"
  ]
 },
 "values": {
  "zone": [
   "front",
   "frontDiagonal",
   "side",
   "rearDiagonal",
   "rear"
  ],
  "carState": [
   "cruise",
   "intention",
   "committed",
   "expiring",
   "interrupted",
   "caution"
  ],
  "cause": [
   "body",
   "pass",
   "cone",
   "yield",
   "return",
   "unstick"
  ],
  "cls": [
   "sedan",
   "van"
  ],
  "bait": [
   true,
   false
  ],
  "lunging": [
   true,
   false
  ],
  "stopped": [
   true,
   false
  ]
 },
 "numeric_fields": [
  "assessed",
  "lost",
  "closing",
  "strike",
  "dv",
  "angle",
  "health",
  "speed",
  "R",
  "charge",
  "gap",
  "seniority"
 ],
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
  "facing",
  "away"
 ],
 "particle_at": [
  "dummy",
  "contact",
  "car"
 ],
 "particle_roles": [
  "floor",
  "grid",
  "structure",
  "fleet",
  "dummy",
  "joints"
 ],
 "line_roles": [
  "grid",
  "structure",
  "fleet",
  "joints"
 ],
 "sound_types": [
  "tone",
  "noise"
 ],
 "waves": [
  "square",
  "sawtooth",
  "triangle",
  "sine"
 ],
 "only_on": {
  "popup": [
   "impact"
  ],
  "rays": [
   "impact"
  ],
  "stumble": [
   "miss"
  ],
  "crumple": [
   "impact",
   "knock",
   "writeoff"
  ],
  "streaks": [
   "lunge",
   "near-miss",
   "miss"
  ]
 },
 "no_reward_events": [
  "touch-spent",
  "near-miss",
  "miss"
 ],
 "reward_blocks": [
  "flash",
  "popup",
  "rays",
  "zoom",
  "crumple"
 ],
 "required_events": [
  "impact",
  "writeoff",
  "touch-spent",
  "near-miss",
  "miss",
  "lunge"
 ],
 "min_impact_accents": 2,
 "range_ids": true,
 "max_gain": 0.25
}
```

## Game data
Registry IDs you may reference (value, unit):
- battery.capacity = 3 charge units
- body.radius = 13 world units
- damage.bodyHealth = 800 health
- damage.referenceSpeed = 138 world units/s
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- movement.lungeDistance = 164 world units
- movement.lungeDuration = 0.3 s
- movement.lungeFastDistanceFraction = 0.7 ratio
- movement.lungeFastTimeFraction = 0.333333 ratio
- movement.lungeRecovery = 0.35 s
- proto.art.barrierHeight = 14
- proto.art.coneHeight = 14
- proto.art.crateHeight = 30
- proto.art.droneHeight = 70
- proto.art.dummyHeight = 18
- proto.art.pillarHeight = 60
- proto.art.shadowScale = 0.3
- proto.dummyStrikeSpeed = 100
- proto.recoilScale = 0.6
- proto.recoilSeconds = 0.35
- proto.restitution = 0.3
- proto.scale.unitsPerMetre = 12.2
- vehicles.sedan.cruiseSpeed = 138 world units/s
- vehicles.van.cruiseSpeed = 120 world units/s

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


# CONTEXT

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

[DESIGN#D4.5] (D4.5 Sensing and feedback (§5.5))
### D4.5 Sensing and feedback (§5.5)
The view cone follows body facing in the slice. It resolves cars' sensor zones and occlusion information in that direction. Cars, identity, route/commitment, brake and spent cues remain available outside the cone. There is no active fog-of-war experiment that hides traffic.
Actor markers remain readable when sprites overlap; occlusion concerns the sensor information and actual sensor rays. Van-class cover can block sensing according to World flags, but must not erase all warning that another vehicle exists.
The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. A 0.06-second hit-stop and 1.1-second destruction presentation are trial values. Cues take priority over particles, shake and decorative information.

[JUICE#J1] (J1 Reference games — top-down arcade driving)
## J1 Reference games — top-down arcade driving
| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

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

[DESIGN#D9.4] (D9.4 Sound (§3.4))
### D9.4 Sound (§3.4)
Factory hum, engines, restrained synthetic music and clinical announcements make the city sound operational even when the body fails. The dummy creaks, clanks, squashes and recovers with physical weight.
Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. Gameplay cues take priority over ambience and have visual equivalents. Voices are optional; text-first barks must work at exhibition volume.
Reports and purchases can use presentation-time sound while simulation is frozen. No sound callback can award damage, currency or learning. There is no automatic repair warning in the slice because automatic repair is disabled.

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

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

[JUICE#J2] (J2 Reference talks — general juice)
## J2 Reference talks — general juice
| Source | Technique | DUMMIES reading |
|---|---|---|
| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) | Hit pause. Screen shake. Camera kick. Knockback. Impact effects. Permanence: debris stays. | Hit pause is `feedback.hitStop`. Knockback is P1.3 recoil. Permanence suits tyre marks and dents. |
| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) | Tweening. Squash and stretch. Particles. Sound on every action. | The dummy squashes on lunge and recovery (P1.2). Sound keeps a visual equivalent (D9.4). |

[EDIT26#3.3] (3.3 Sound)
### 3.3 Sound
- Factory hum, engines, synthetic music, clinical announcements.
- Distinct cues for misses, near misses, impacts, service and reports.
- The city sounds operational even when your body fails.
- Gameplay cues override ambience and always have visible equivalents.
- Text-first barks; recorded voices optional.
- The stiff body creaks and clanks. Each upgrade has its own sound. The battery has a low-charge cue and a refill tick. (Proposed)

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

[ENG#8.2~1] (8.2 Damage uses actual relative closing velocity)
### 8.2 Damage uses actual relative closing velocity
**User decision:** actual motion replaces the fixed 5× lunge multiplier. A stationary car can be damaged against by a moving dummy; a fast co-moving or separating pair does not receive damage merely because one speed is large.
Let `n` be the unit contact normal pointing from the dummy into the vehicle. Sample world-space velocities immediately before physical response at swept contact time:
```text
closingSpeed = max(0, dot(dummyVelocity - carVelocity, n))
rawImpact = damage.baseImpact * zoneFactor * relativeMass
            * closingSpeed / damage.referenceSpeed
assessedImpact = min(rawImpact, damage.bodyHealth)
healthLost = min(remainingHealth, assessedImpact)
impactPoints = assessedImpact * scoreSurfaceFactor
remainingHealth = max(0, remainingHealth - healthLost)
writeOff = remainingHealth == 0
```
There is **no separate finishing-hit points threshold**. A hit assessed at 5 destroys a body with 5 or less health; it does not destroy a healthy body merely because it scored. Even a smaller positive assessment can finish correspondingly low health. Display rounding and score-only modifiers do not determine death. A minimum positive contact tolerance, if the actual solver needs one for numerical noise, must not silently become a gameplay finishing threshold.
The fresh-body health remains 800 and reference speed 138 as **unbalanced trial values**, not a preservation of V27 hit counts. Base impact remains 100. On a front contact, a stationary dummy versus a Sedan moving toward it at 138 assesses 100. A dummy moving into a stationary Sedan at 69 assesses 50. Early fresh lunge at 1,148 toward a Sedan approaching at 138 gives raw approximately 931.884, capped at 800: one impact can now complete a fresh body. Late-lunge 246 against that Sedan gives approximately 278.261. Those changes deliberately reopen balance and timing; the old two-front/six-flank progression estimates are retired.
| Contact zone | Factor |
|---|---:|
| Front | 1.00 |
| Front diagonal | 0.60 |
| Side | 0.30 |
| Rear diagonal | 0.15 |
| Rear | 0.05 |
Zone classification retains normalised car-local contact position and inclusive angular bounds 30/60/120/150/180 degrees from the nose. First containing bound wins. Degenerate centre contacts fall back to the opposite resolved contact normal; if still degenerate, classify side and flag invalid overlap. This geometric zone is separate from the physical contact normal used for closing speed.

[ENG#8.1] (8.1 Contact episodes and the one-use allowance)
### 8.1 Contact episodes and the one-use allowance
A contact episode starts when the swept dummy and vehicle footprints first meet. It ends only after they have been fully separated for at least one simulation tick. Assess the impact at episode entry. Holding contact while a stopped car accelerates does not manufacture a new impact every frame. A new, separated encounter may be assessed if the appearance is still unspent.
The first **positive-damage** episode consumes that appearance's damage allowance. Zero-relative-closing-speed/zero-damage contact does not consume it. The vehicle stays physically solid after spending its allowance, displays a persistent non-colour spent cue, and cannot damage or reward another body during that appearance. It may still obstruct movement. A later appearance of the model has a fresh allowance.
All relevant contacts use swept checks. A fast lunge cannot tunnel through a vehicle. Resolve contacts by time of impact, then stable appearance ID for an exact tie. Sample zone, speed and action eligibility at that resolved contact. A lethal event makes the body unavailable for further reward-bearing contacts; later contacts in the same tick cannot create another write-off.

[EDIT26#10.1] (10.1 Gameplay loop)
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