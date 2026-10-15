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
     "when": {} for the base layer, or {field: literal} / {numericField: {"min": n, "max": n}} for an accent,
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
  "joints",
  "primary",
  "secondary"
 ],
 "line_roles": [
  "grid",
  "structure",
  "fleet",
  "joints",
  "primary",
  "secondary"
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
 "min_impact_accents": 2
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

# YOUR PREVIOUS OUTPUT

{
 "params": [
  {
   "id": "proto.hits.reducedMotion",
   "value": 0.25,
   "unit": "ratio",
   "purpose": "Scale applied to shake, zoom, crumple and stumble under reduced-motion settings.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.shakeAmpMin",
   "value": 2,
   "unit": "canvas units",
   "purpose": "Base impact shake at the lightest hit.",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.shakeAmpMax",
   "value": 10,
   "unit": "canvas units",
   "purpose": "Base impact shake at a hit assessed at full body health.",
   "sources": [
    "JUICE#J3",
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.shakeSecMin",
   "value": 0.12,
   "unit": "s",
   "purpose": "Shake duration for the lightest hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.shakeSecMax",
   "value": 0.3,
   "unit": "s",
   "purpose": "Shake duration for the heaviest base hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.zoomMin",
   "value": 0.01,
   "unit": "ratio",
   "purpose": "Punch-in toward the contact on a light hit.",
   "sources": [
    "JUICE#J2",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.zoomMax",
   "value": 0.035,
   "unit": "ratio",
   "purpose": "Punch-in toward the contact on a full hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.zoomSeconds",
   "value": 0.18,
   "unit": "s",
   "purpose": "Time for the punch-in to ease back.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.flashSeconds",
   "value": 0.05,
   "unit": "s",
   "purpose": "White field flash on a scored hit.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.crumpleMin",
   "value": 0.08,
   "unit": "ratio",
   "purpose": "Dummy squash along the hit normal, light hit.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D10.1"
   ]
  },
  {
   "id": "proto.hits.impact.crumpleMax",
   "value": 0.28,
   "unit": "ratio",
   "purpose": "Dummy squash along the hit normal, full hit.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D10.1"
   ]
  },
  {
   "id": "proto.hits.impact.ringRadiusMin",
   "value": 16,
   "unit": "canvas units",
   "purpose": "Shock ring radius, light hit.",
   "sources": [
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.ringRadiusMax",
   "value": 40,
   "unit": "canvas units",
   "purpose": "Shock ring radius, full hit. Stays under 2 x body width.",
   "sources": [
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.ringSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Shock ring lifetime.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.ringWidth",
   "value": 2,
   "unit": "px",
   "purpose": "Shock ring line width.",
   "sources": [
    "EDIT26#4.1~2"
   ]
  },
  {
   "id": "proto.hits.impact.raysCount",
   "value": 8,
   "unit": "count",
   "purpose": "Radial lines in the impact burst.",
   "sources": [
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.hits.impact.raysLenMin",
   "value": 18,
   "unit": "canvas units",
   "purpose": "Ray length, light hit.",
   "sources": [
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.hits.impact.raysLenMax",
   "value": 46,
   "unit": "canvas units",
   "purpose": "Ray length, full hit.",
   "sources": [
    "DESIGN#D10.3~1",
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.raysSeconds",
   "value": 0.2,
   "unit": "s",
   "purpose": "Ray lifetime.",
   "sources": [
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.hits.impact.popupSizeMin",
   "value": 16,
   "unit": "px",
   "purpose": "Assessed-value popup size, light hit.",
   "sources": [
    "LOG#P1.2/juice",
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.popupSizeMax",
   "value": 30,
   "unit": "px",
   "purpose": "Assessed-value popup size, full hit.",
   "sources": [
    "LOG#P1.2/juice",
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.popupRise",
   "value": 26,
   "unit": "px",
   "purpose": "How far the popup floats up.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.popupSeconds",
   "value": 0.7,
   "unit": "s",
   "purpose": "Popup lifetime.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.popupPop",
   "value": 0.35,
   "unit": "ratio",
   "purpose": "Overshoot scale as the popup appears.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.sparkCountMin",
   "value": 4,
   "unit": "count",
   "purpose": "Sparks on a light hit.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.sparkCountMax",
   "value": 12,
   "unit": "count",
   "purpose": "Sparks on a full hit.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.sparkSpeed",
   "value": 160,
   "unit": "world units/s",
   "purpose": "Spark launch speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.sparkLife",
   "value": 0.3,
   "unit": "s",
   "purpose": "Spark lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.sparkSize",
   "value": 2,
   "unit": "px",
   "purpose": "Spark size.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.dustCount",
   "value": 3,
   "unit": "count",
   "purpose": "Dust puff at the dummy on a scored hit.",
   "sources": [
    "JUICE#J1",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.dustSpeed",
   "value": 50,
   "unit": "world units/s",
   "purpose": "Dust drift speed.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.impact.dustLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Dust lifetime.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.impact.dustSize",
   "value": 5,
   "unit": "px",
   "purpose": "Dust particle size.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.impact.crunchFrom",
   "value": 3200,
   "unit": "Hz",
   "purpose": "Crunch filter start.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.crunchTo",
   "value": 380,
   "unit": "Hz",
   "purpose": "Crunch filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.crunchSeconds",
   "value": 0.16,
   "unit": "s",
   "purpose": "Crunch length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.crunchGain",
   "value": 0.3,
   "unit": "gain",
   "purpose": "Crunch loudness.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.shakeAmpMin",
   "value": 4,
   "unit": "canvas units",
   "purpose": "Head-on shake, light hit.",
   "sources": [
    "ENG#8.2~1",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.shakeAmpMax",
   "value": 14,
   "unit": "canvas units",
   "purpose": "Head-on shake, full hit.",
   "sources": [
    "ENG#8.2~1",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.crumpleMin",
   "value": 0.15,
   "unit": "ratio",
   "purpose": "Head-on squash, light hit.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.crumpleMax",
   "value": 0.4,
   "unit": "ratio",
   "purpose": "Head-on squash, full hit.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.ringRadius",
   "value": 56,
   "unit": "canvas units",
   "purpose": "Second, wider ring on a front contact.",
   "sources": [
    "ENG#8.2~1",
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.raysLenMin",
   "value": 30,
   "unit": "canvas units",
   "purpose": "Head-on ray length, light hit.",
   "sources": [
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.raysLenMax",
   "value": 64,
   "unit": "canvas units",
   "purpose": "Head-on ray length, full hit.",
   "sources": [
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.hornFrom",
   "value": 320,
   "unit": "Hz",
   "purpose": "Car horn start pitch.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.hornTo",
   "value": 280,
   "unit": "Hz",
   "purpose": "Car horn end pitch.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.hornSeconds",
   "value": 0.22,
   "unit": "s",
   "purpose": "Horn length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.headOn.hornGain",
   "value": 0.12,
   "unit": "gain",
   "purpose": "Horn loudness, under the crunch.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.bait.popupSizeMin",
   "value": 22,
   "unit": "px",
   "purpose": "Bait popup size, light hit.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.bait.popupSizeMax",
   "value": 38,
   "unit": "px",
   "purpose": "Bait popup size, full hit.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.bait.popupPop",
   "value": 0.6,
   "unit": "ratio",
   "purpose": "Bigger overshoot to reward a bait hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.bait.debrisCount",
   "value": 5,
   "unit": "count",
   "purpose": "Debris flecks on a bait hit.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.bait.debrisSpeed",
   "value": 130,
   "unit": "world units/s",
   "purpose": "Debris launch speed.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.bait.debrisLife",
   "value": 0.6,
   "unit": "s",
   "purpose": "Debris lifetime.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.bait.debrisSize",
   "value": 3,
   "unit": "px",
   "purpose": "Debris size.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.bait.tickFrom",
   "value": 880,
   "unit": "Hz",
   "purpose": "Score tick start pitch.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.bait.tickTo",
   "value": 1320,
   "unit": "Hz",
   "purpose": "Score tick end pitch.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.bait.tickSeconds",
   "value": 0.12,
   "unit": "s",
   "purpose": "Score tick length.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.bait.tickGain",
   "value": 0.1,
   "unit": "gain",
   "purpose": "Score tick loudness.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.zoomMin",
   "value": 0.025,
   "unit": "ratio",
   "purpose": "Punch-in on a lunge hit, light.",
   "sources": [
    "JUICE#J2",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.zoomMax",
   "value": 0.06,
   "unit": "ratio",
   "purpose": "Punch-in on a lunge hit, full.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.flashSeconds",
   "value": 0.08,
   "unit": "s",
   "purpose": "Longer flash when the dummy was lunging.",
   "sources": [
    "JUICE#J2",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.shakeAmpMin",
   "value": 3,
   "unit": "canvas units",
   "purpose": "Lunge-hit shake, light.",
   "sources": [
    "JUICE#J2",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.shakeAmpMax",
   "value": 13,
   "unit": "canvas units",
   "purpose": "Lunge-hit shake, full.",
   "sources": [
    "JUICE#J2",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.slamFrom",
   "value": 900,
   "unit": "Hz",
   "purpose": "Body slam filter start.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.slamTo",
   "value": 120,
   "unit": "Hz",
   "purpose": "Body slam filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.slamSeconds",
   "value": 0.2,
   "unit": "s",
   "purpose": "Body slam length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.lunging.slamGain",
   "value": 0.25,
   "unit": "gain",
   "purpose": "Body slam loudness.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.crumpleMin",
   "value": 0.12,
   "unit": "ratio",
   "purpose": "Squash against a stopped car, light.",
   "sources": [
    "DESIGN#D10.1",
    "ENG#8.2~1"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.crumpleMax",
   "value": 0.36,
   "unit": "ratio",
   "purpose": "Squash against a stopped car, full.",
   "sources": [
    "DESIGN#D10.1",
    "ENG#8.2~1"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.smokeCount",
   "value": 4,
   "unit": "count",
   "purpose": "Smoke puffs from a stopped car's body.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.smokeSpeed",
   "value": 25,
   "unit": "world units/s",
   "purpose": "Smoke drift speed.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.smokeLife",
   "value": 0.8,
   "unit": "s",
   "purpose": "Smoke lifetime.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.smokeSize",
   "value": 8,
   "unit": "px",
   "purpose": "Smoke puff size.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.thudFrom",
   "value": 400,
   "unit": "Hz",
   "purpose": "Heavy thud filter start.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.thudTo",
   "value": 90,
   "unit": "Hz",
   "purpose": "Heavy thud filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.thudSeconds",
   "value": 0.14,
   "unit": "s",
   "purpose": "Heavy thud length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.stopped.thudGain",
   "value": 0.25,
   "unit": "gain",
   "purpose": "Heavy thud loudness.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.big.shakeAmp",
   "value": 16,
   "unit": "canvas units",
   "purpose": "Shake on a big-damage hit.",
   "sources": [
    "ENG#8.2~1",
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.impact.big.shakeSeconds",
   "value": 0.45,
   "unit": "s",
   "purpose": "Shake length on a big-damage hit.",
   "sources": [
    "ENG#8.2~1",
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.flashSeconds",
   "value": 0.09,
   "unit": "s",
   "purpose": "Flash on a big-damage hit.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.impact.big.ringRadius",
   "value": 70,
   "unit": "canvas units",
   "purpose": "Big ring on a big-damage hit.",
   "sources": [
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.impact.big.ringSeconds",
   "value": 0.35,
   "unit": "s",
   "purpose": "Big ring lifetime.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.ringWidth",
   "value": 3,
   "unit": "px",
   "purpose": "Big ring line width.",
   "sources": [
    "EDIT26#4.1~2"
   ]
  },
  {
   "id": "proto.hits.impact.big.debrisCount",
   "value": 8,
   "unit": "count",
   "purpose": "Debris on a big-damage hit.",
   "sources": [
    "JUICE#J3",
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.debrisSpeed",
   "value": 200,
   "unit": "world units/s",
   "purpose": "Big-hit debris speed.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.debrisLife",
   "value": 0.8,
   "unit": "s",
   "purpose": "Big-hit debris lifetime.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.debrisSize",
   "value": 3,
   "unit": "px",
   "purpose": "Big-hit debris size.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.impact.big.smokeCount",
   "value": 4,
   "unit": "count",
   "purpose": "Smoke on a big-damage hit.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.big.smokeSpeed",
   "value": 25,
   "unit": "world units/s",
   "purpose": "Big-hit smoke drift speed.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.big.smokeLife",
   "value": 0.9,
   "unit": "s",
   "purpose": "Big-hit smoke lifetime.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.impact.big.smokeSize",
   "value": 9,
   "unit": "px",
   "purpose": "Big-hit smoke size.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.knock.speedFull",
   "value": 100,
   "unit": "world units/s",
   "purpose": "Knock speed that gives a full dust puff. Matches proto.dummyStrikeSpeed.",
   "sources": [
    "JUICE#J3",
    "ENG#8.2~1"
   ]
  },
  {
   "id": "proto.hits.knock.dustMin",
   "value": 2,
   "unit": "count",
   "purpose": "Dust puffs on a soft knock.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.knock.dustMax",
   "value": 5,
   "unit": "count",
   "purpose": "Dust puffs on a hard knock.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.knock.dustSpeed",
   "value": 40,
   "unit": "world units/s",
   "purpose": "Knock dust drift speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.knock.dustLife",
   "value": 0.4,
   "unit": "s",
   "purpose": "Knock dust lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.knock.dustSize",
   "value": 4,
   "unit": "px",
   "purpose": "Knock dust size.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.touchSpent.shakeAmp",
   "value": 1.5,
   "unit": "canvas units",
   "purpose": "Small kick on a spent car.",
   "sources": [
    "LOG#P1.2/juice",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.touchSpent.shakeSeconds",
   "value": 0.1,
   "unit": "s",
   "purpose": "Length of the small kick.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.touchSpent.thudFrom",
   "value": 420,
   "unit": "Hz",
   "purpose": "Dull thud filter start.",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.touchSpent.thudTo",
   "value": 110,
   "unit": "Hz",
   "purpose": "Dull thud filter end.",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.touchSpent.thudSeconds",
   "value": 0.14,
   "unit": "s",
   "purpose": "Dull thud length.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.touchSpent.thudGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Dull thud loudness. Quieter than a scored crunch.",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.touchSpent.dustCount",
   "value": 2,
   "unit": "count",
   "purpose": "Dust flecks on a spent touch. No sparks.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.touchSpent.dustSpeed",
   "value": 30,
   "unit": "world units/s",
   "purpose": "Spent-touch dust speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.touchSpent.dustLife",
   "value": 0.4,
   "unit": "s",
   "purpose": "Spent-touch dust lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.touchSpent.dustSize",
   "value": 4,
   "unit": "px",
   "purpose": "Spent-touch dust size.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.shakeAmp",
   "value": 16,
   "unit": "canvas units",
   "purpose": "Heavy write-off shake.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.shakeSeconds",
   "value": 0.6,
   "unit": "s",
   "purpose": "Write-off shake length.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.zoomAmount",
   "value": 0.05,
   "unit": "ratio",
   "purpose": "Punch-in on the wreck.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.writeoff.zoomSeconds",
   "value": 0.4,
   "unit": "s",
   "purpose": "Write-off punch-in recovery.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.writeoff.flashSeconds",
   "value": 0.12,
   "unit": "s",
   "purpose": "Field flash on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.crumpleAmount",
   "value": 0.5,
   "unit": "ratio",
   "purpose": "Final squash as the body collapses.",
   "sources": [
    "EDIT26#5.5",
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.writeoff.ringRadius",
   "value": 90,
   "unit": "canvas units",
   "purpose": "Write-off shock ring.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.ringSeconds",
   "value": 0.5,
   "unit": "s",
   "purpose": "Write-off ring lifetime.",
   "sources": [
    "JUICE#J2"
   ]
  },
  {
   "id": "proto.hits.writeoff.ringWidth",
   "value": 3,
   "unit": "px",
   "purpose": "Write-off ring width.",
   "sources": [
    "EDIT26#4.1~2"
   ]
  },
  {
   "id": "proto.hits.writeoff.debrisCount",
   "value": 14,
   "unit": "count",
   "purpose": "Debris on write-off.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.debrisSpeed",
   "value": 220,
   "unit": "world units/s",
   "purpose": "Debris launch speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.debrisLife",
   "value": 1,
   "unit": "s",
   "purpose": "Debris lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.debrisSize",
   "value": 3,
   "unit": "px",
   "purpose": "Debris size.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.writeoff.smokeCount",
   "value": 8,
   "unit": "count",
   "purpose": "Smoke puffs on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.smokeSpeed",
   "value": 30,
   "unit": "world units/s",
   "purpose": "Smoke drift speed.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.smokeSize",
   "value": 10,
   "unit": "px",
   "purpose": "Smoke puff size.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.sparkCount",
   "value": 12,
   "unit": "count",
   "purpose": "Sparks on write-off.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.sparkSpeed",
   "value": 240,
   "unit": "world units/s",
   "purpose": "Write-off spark speed.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.sparkLife",
   "value": 0.4,
   "unit": "s",
   "purpose": "Write-off spark lifetime.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.sparkSize",
   "value": 2,
   "unit": "px",
   "purpose": "Write-off spark size.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.writeoff.crashFrom",
   "value": 2800,
   "unit": "Hz",
   "purpose": "Crash filter start.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.crashTo",
   "value": 90,
   "unit": "Hz",
   "purpose": "Crash filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.crashSeconds",
   "value": 0.6,
   "unit": "s",
   "purpose": "Crash length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.crashGain",
   "value": 0.45,
   "unit": "gain",
   "purpose": "Crash loudness.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.writeoff.boomFrom",
   "value": 140,
   "unit": "Hz",
   "purpose": "Low boom start pitch.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.boomTo",
   "value": 40,
   "unit": "Hz",
   "purpose": "Low boom end pitch.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.boomSeconds",
   "value": 0.5,
   "unit": "s",
   "purpose": "Low boom length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.writeoff.boomGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Low boom loudness.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.lunge.shakeAmp",
   "value": 1.5,
   "unit": "canvas units",
   "purpose": "Small camera kick on a lunge.",
   "sources": [
    "LOG#P1.2/juice",
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.lunge.shakeSeconds",
   "value": 0.1,
   "unit": "s",
   "purpose": "Camera kick length.",
   "sources": [
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.lunge.streakCountMin",
   "value": 2,
   "unit": "count",
   "purpose": "Speed lines on a short lunge.",
   "sources": [
    "JUICE#J3",
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.lunge.streakCountMax",
   "value": 5,
   "unit": "count",
   "purpose": "Speed lines on a full-reach lunge.",
   "sources": [
    "JUICE#J3",
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.lunge.streakLenMin",
   "value": 40,
   "unit": "canvas units",
   "purpose": "Speed line length on a short lunge.",
   "sources": [
    "EDIT26#4.2~2"
   ]
  },
  {
   "id": "proto.hits.lunge.dustCount",
   "value": 5,
   "unit": "count",
   "purpose": "Dust kicked behind the body.",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice"
   ]
  },
  {
   "id": "proto.hits.lunge.dustSpeed",
   "value": 70,
   "unit": "world units/s",
   "purpose": "Lunge dust speed.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.lunge.dustLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Lunge dust lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.lunge.dustSize",
   "value": 5,
   "unit": "px",
   "purpose": "Lunge dust size.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.lunge.whooshFromMin",
   "value": 500,
   "unit": "Hz",
   "purpose": "Whoosh filter start, short lunge.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.lunge.whooshFromMax",
   "value": 800,
   "unit": "Hz",
   "purpose": "Whoosh filter start, full reach.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.lunge.whooshTo",
   "value": 1800,
   "unit": "Hz",
   "purpose": "Whoosh filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.lunge.whooshSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Whoosh length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.lunge.whooshGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Whoosh loudness.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.streakCountMin",
   "value": 2,
   "unit": "count",
   "purpose": "Speed lines beside a slow near miss.",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.streakCountMax",
   "value": 4,
   "unit": "count",
   "purpose": "Speed lines beside a fast near miss.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.streakLenMin",
   "value": 30,
   "unit": "canvas units",
   "purpose": "Streak length, slow car.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.streakLenMax",
   "value": 70,
   "unit": "canvas units",
   "purpose": "Streak length, fast car.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.streakSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Streak lifetime.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.whooshFrom",
   "value": 1600,
   "unit": "Hz",
   "purpose": "Pass-by filter start.",
   "sources": [
    "DESIGN#D9.4",
    "EDIT26#3.3"
   ]
  },
  {
   "id": "proto.hits.nearMiss.whooshTo",
   "value": 500,
   "unit": "Hz",
   "purpose": "Pass-by filter end.",
   "sources": [
    "DESIGN#D9.4",
    "EDIT26#3.3"
   ]
  },
  {
   "id": "proto.hits.nearMiss.whooshSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Pass-by length.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.gainMin",
   "value": 0.08,
   "unit": "gain",
   "purpose": "Pass-by loudness, slow car.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.gainMax",
   "value": 0.22,
   "unit": "gain",
   "purpose": "Pass-by loudness, fast car.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.dustCount",
   "value": 2,
   "unit": "count",
   "purpose": "Dust in the car's wake.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.nearMiss.dustSpeed",
   "value": 40,
   "unit": "world units/s",
   "purpose": "Wake dust speed.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.nearMiss.dustLife",
   "value": 0.5,
   "unit": "s",
   "purpose": "Wake dust lifetime.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.nearMiss.dustSize",
   "value": 4,
   "unit": "px",
   "purpose": "Wake dust size.",
   "sources": [
    "JUICE#J1"
   ]
  },
  {
   "id": "proto.hits.nearMiss.tightStreakLen",
   "value": 90,
   "unit": "canvas units",
   "purpose": "Longer streaks on a very tight pass.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.tightShakeAmp",
   "value": 1.2,
   "unit": "canvas units",
   "purpose": "Tiny shiver on a very tight pass.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.tightShakeSeconds",
   "value": 0.12,
   "unit": "s",
   "purpose": "Shiver length.",
   "sources": [
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.nearMiss.pingFrom",
   "value": 1200,
   "unit": "Hz",
   "purpose": "Near-miss ping start pitch. Distinct from the hit tick.",
   "sources": [
    "DESIGN#D9.4",
    "EDIT26#3.3"
   ]
  },
  {
   "id": "proto.hits.nearMiss.pingTo",
   "value": 900,
   "unit": "Hz",
   "purpose": "Near-miss ping end pitch.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.pingSeconds",
   "value": 0.1,
   "unit": "s",
   "purpose": "Ping length.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.nearMiss.pingGain",
   "value": 0.08,
   "unit": "gain",
   "purpose": "Ping loudness.",
   "sources": [
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.hits.miss.stumbleAmp",
   "value": 0.35,
   "unit": "ratio",
   "purpose": "Stumble wobble amplitude in radians.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.hits.miss.stumbleSeconds",
   "value": 0.5,
   "unit": "s",
   "purpose": "Stumble length. Fits inside movement.lungeRecovery plus slack.",
   "sources": [
    "EDIT26#5.5",
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.miss.streakCount",
   "value": 3,
   "unit": "count",
   "purpose": "Fading speed lines behind the stumbling dummy.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.miss.streakLen",
   "value": 50,
   "unit": "canvas units",
   "purpose": "Miss streak length.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.miss.streakSeconds",
   "value": 0.25,
   "unit": "s",
   "purpose": "Miss streak lifetime.",
   "sources": [
    "JUICE#J3"
   ]
  },
  {
   "id": "proto.hits.miss.dustCount",
   "value": 4,
   "unit": "count",
   "purpose": "Scuff dust at the feet.",
   "sources": [
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.miss.dustSpeed",
   "value": 40,
   "unit": "world units/s",
   "purpose": "Scuff dust speed.",
   "sources": [
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.miss.dustLife",
   "value": 0.6,
   "unit": "s",
   "purpose": "Scuff dust lifetime.",
   "sources": [
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.miss.dustSize",
   "value": 5,
   "unit": "px",
   "purpose": "Scuff dust size.",
   "sources": [
    "EDIT26#5.1"
   ]
  },
  {
   "id": "proto.hits.miss.clatterFrom",
   "value": 2600,
   "unit": "Hz",
   "purpose": "Clatter filter start.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.miss.clatterTo",
   "value": 700,
   "unit": "Hz",
   "purpose": "Clatter filter end.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.miss.clatterSeconds",
   "value": 0.3,
   "unit": "s",
   "purpose": "Clatter length.",
   "sources": [
    "EDIT26#5.5"
   ]
  },
  {
   "id": "proto.hits.miss.clatterGain",
   "value": 0.2,
   "unit": "gain",
   "purpose": "Clatter loudness.",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D9.4"
   ]
  }
 ],
 "hitStop": "feedback.hitStop",
 "reducedMotion": "proto.hits.reducedMotion",
 "layers": [
  {
   "event": "impact",
   "when": {},
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": {
    "amp": [
     "proto.hits.impact.shakeAmpMin",
     "proto.hits.impact.shakeAmpMax"
    ],
    "seconds": [
     "proto.hits.impact.shakeSecMin",
     "proto.hits.impact.shakeSecMax"
    ]
   },
   "zoom": {
    "amount": [
     "proto.hits.impact.zoomMin",
     "proto.hits.impact.zoomMax"
    ],
    "seconds": "proto.hits.impact.zoomSeconds"
   },
   "flash": "proto.hits.impact.flashSeconds",
   "crumple": {
    "amount": [
     "proto.hits.impact.crumpleMin",
     "proto.hits.impact.crumpleMax"
    ],
    "seconds": "proto.recoilSeconds"
   },
   "stumble": null,
   "ring": {
    "radius": [
     "proto.hits.impact.ringRadiusMin",
     "proto.hits.impact.ringRadiusMax"
    ],
    "seconds": "proto.hits.impact.ringSeconds",
    "width": "proto.hits.impact.ringWidth",
    "role": "primary"
   },
   "rays": {
    "count": "proto.hits.impact.raysCount",
    "length": [
     "proto.hits.impact.raysLenMin",
     "proto.hits.impact.raysLenMax"
    ],
    "seconds": "proto.hits.impact.raysSeconds"
   },
   "popup": {
    "size": [
     "proto.hits.impact.popupSizeMin",
     "proto.hits.impact.popupSizeMax"
    ],
    "rise": "proto.hits.impact.popupRise",
    "seconds": "proto.hits.impact.popupSeconds",
    "pop": "proto.hits.impact.popupPop"
   },
   "streaks": null,
   "particles": [
    {
     "type": "spark",
     "count": [
      "proto.hits.impact.sparkCountMin",
      "proto.hits.impact.sparkCountMax"
     ],
     "speed": "proto.hits.impact.sparkSpeed",
     "life": "proto.hits.impact.sparkLife",
     "size": "proto.hits.impact.sparkSize",
     "role": "primary",
     "dir": "away",
     "at": "contact"
    },
    {
     "type": "dust",
     "count": "proto.hits.impact.dustCount",
     "speed": "proto.hits.impact.dustSpeed",
     "life": "proto.hits.impact.dustLife",
     "size": "proto.hits.impact.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.impact.crunchFrom",
    "to": "proto.hits.impact.crunchTo",
    "seconds": "proto.hits.impact.crunchSeconds",
    "gain": "proto.hits.impact.crunchGain"
   },
   "reference": "Hit pause plus shake scaled to damage, contact flash, sparks",
   "sources": [
    "JUICE#J2",
    "JUICE#J3",
    "LOG#P1.2/juice",
    "EDIT26#5.5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "front"
   },
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": {
    "amp": [
     "proto.hits.impact.headOn.shakeAmpMin",
     "proto.hits.impact.headOn.shakeAmpMax"
    ],
    "seconds": [
     "proto.hits.impact.shakeSecMin",
     "proto.hits.impact.shakeSecMax"
    ]
   },
   "zoom": null,
   "flash": null,
   "crumple": {
    "amount": [
     "proto.hits.impact.headOn.crumpleMin",
     "proto.hits.impact.headOn.crumpleMax"
    ],
    "seconds": "proto.recoilSeconds"
   },
   "stumble": null,
   "ring": {
    "radius": "proto.hits.impact.headOn.ringRadius",
    "seconds": "proto.hits.impact.ringSeconds",
    "width": "proto.hits.impact.ringWidth",
    "role": "secondary"
   },
   "rays": {
    "count": "proto.hits.impact.raysCount",
    "length": [
     "proto.hits.impact.headOn.raysLenMin",
     "proto.hits.impact.headOn.raysLenMax"
    ],
    "seconds": "proto.hits.impact.raysSeconds"
   },
   "popup": null,
   "streaks": null,
   "particles": [],
   "sound": {
    "type": "tone",
    "from": "proto.hits.impact.headOn.hornFrom",
    "to": "proto.hits.impact.headOn.hornTo",
    "seconds": "proto.hits.impact.headOn.hornSeconds",
    "gain": "proto.hits.impact.headOn.hornGain",
    "wave": "sawtooth"
   },
   "reference": "Heavier shake and double shock ring on the full-damage zone; crunch and horn",
   "sources": [
    "ENG#8.2~1",
    "EDIT26#5.5",
    "JUICE#J2",
    "JUICE#J3"
   ]
  },
  {
   "event": "impact",
   "when": {
    "bait": true
   },
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": {
    "size": [
     "proto.hits.impact.bait.popupSizeMin",
     "proto.hits.impact.bait.popupSizeMax"
    ],
    "rise": "proto.hits.impact.popupRise",
    "seconds": "proto.hits.impact.popupSeconds",
    "pop": "proto.hits.impact.bait.popupPop"
   },
   "streaks": null,
   "particles": [
    {
     "type": "debris",
     "count": "proto.hits.impact.bait.debrisCount",
     "speed": "proto.hits.impact.bait.debrisSpeed",
     "life": "proto.hits.impact.bait.debrisLife",
     "size": "proto.hits.impact.bait.debrisSize",
     "role": "structure",
     "dir": "away",
     "at": "contact"
    }
   ],
   "sound": {
    "type": "tone",
    "from": "proto.hits.impact.bait.tickFrom",
    "to": "proto.hits.impact.bait.tickTo",
    "seconds": "proto.hits.impact.bait.tickSeconds",
    "gain": "proto.hits.impact.bait.tickGain",
    "wave": "sine"
   },
   "reference": "Exaggerated score popup with a rising tick, sound on every action",
   "sources": [
    "JUICE#J2",
    "LOG#P1.2/juice",
    "DESIGN#D9.4"
   ]
  },
  {
   "event": "impact",
   "when": {
    "lunging": true
   },
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": {
    "amp": [
     "proto.hits.impact.lunging.shakeAmpMin",
     "proto.hits.impact.lunging.shakeAmpMax"
    ],
    "seconds": [
     "proto.hits.impact.shakeSecMin",
     "proto.hits.impact.shakeSecMax"
    ]
   },
   "zoom": {
    "amount": [
     "proto.hits.impact.lunging.zoomMin",
     "proto.hits.impact.lunging.zoomMax"
    ],
    "seconds": "proto.hits.impact.zoomSeconds"
   },
   "flash": "proto.hits.impact.lunging.flashSeconds",
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "dust",
     "count": "proto.hits.impact.dustCount",
     "speed": "proto.hits.impact.dustSpeed",
     "life": "proto.hits.impact.dustLife",
     "size": "proto.hits.impact.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.impact.lunging.slamFrom",
    "to": "proto.hits.impact.lunging.slamTo",
    "seconds": "proto.hits.impact.lunging.slamSeconds",
    "gain": "proto.hits.impact.lunging.slamGain"
   },
   "reference": "Camera punch-in and body slam when the dummy drives into the car",
   "sources": [
    "JUICE#J2",
    "LOG#P1.2/juice",
    "EDIT26#5.5"
   ]
  },
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": {
    "amount": [
     "proto.hits.impact.stopped.crumpleMin",
     "proto.hits.impact.stopped.crumpleMax"
    ],
    "seconds": "proto.recoilSeconds"
   },
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "smoke",
     "count": "proto.hits.impact.stopped.smokeCount",
     "speed": "proto.hits.impact.stopped.smokeSpeed",
     "life": "proto.hits.impact.stopped.smokeLife",
     "size": "proto.hits.impact.stopped.smokeSize",
     "role": "fleet",
     "dir": "random",
     "at": "contact"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.impact.stopped.thudFrom",
    "to": "proto.hits.impact.stopped.thudTo",
    "seconds": "proto.hits.impact.stopped.thudSeconds",
    "gain": "proto.hits.impact.stopped.thudGain"
   },
   "reference": "Squash and stretch on a heavy dull thud, smoke off the stopped body",
   "sources": [
    "JUICE#J2",
    "DESIGN#D10.1",
    "ENG#8.2~1"
   ]
  },
  {
   "event": "impact",
   "when": {
    "assessed": {
     "min": 400
    }
   },
   "scale": {
    "by": "assessed",
    "full": "damage.bodyHealth"
   },
   "shake": {
    "amp": "proto.hits.impact.big.shakeAmp",
    "seconds": "proto.hits.impact.big.shakeSeconds"
   },
   "zoom": null,
   "flash": "proto.hits.impact.big.flashSeconds",
   "crumple": null,
   "stumble": null,
   "ring": {
    "radius": "proto.hits.impact.big.ringRadius",
    "seconds": "proto.hits.impact.big.ringSeconds",
    "width": "proto.hits.impact.big.ringWidth",
    "role": "primary"
   },
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "debris",
     "count": "proto.hits.impact.big.debrisCount",
     "speed": "proto.hits.impact.big.debrisSpeed",
     "life": "proto.hits.impact.big.debrisLife",
     "size": "proto.hits.impact.big.debrisSize",
     "role": "structure",
     "dir": "away",
     "at": "contact"
    },
    {
     "type": "smoke",
     "count": "proto.hits.impact.big.smokeCount",
     "speed": "proto.hits.impact.big.smokeSpeed",
     "life": "proto.hits.impact.big.smokeLife",
     "size": "proto.hits.impact.big.smokeSize",
     "role": "fleet",
     "dir": "random",
     "at": "contact"
    }
   ],
   "sound": null,
   "reference": "Longer shake, big ring and debris on big damage (Art of Screenshake)",
   "sources": [
    "ENG#8.2~1",
    "JUICE#J2",
    "EDIT26#5.5"
   ]
  },
  {
   "event": "knock",
   "when": {},
   "scale": {
    "by": "speed",
    "full": "proto.hits.knock.speedFull"
   },
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "dust",
     "count": [
      "proto.hits.knock.dustMin",
      "proto.hits.knock.dustMax"
     ],
     "speed": "proto.hits.knock.dustSpeed",
     "life": "proto.hits.knock.dustLife",
     "size": "proto.hits.knock.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "dummy"
    }
   ],
   "sound": null,
   "reference": "Small dust puff, knockback with no reward",
   "sources": [
    "JUICE#J3",
    "JUICE#J2"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "scale": null,
   "shake": {
    "amp": "proto.hits.touchSpent.shakeAmp",
    "seconds": "proto.hits.touchSpent.shakeSeconds"
   },
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "dust",
     "count": "proto.hits.touchSpent.dustCount",
     "speed": "proto.hits.touchSpent.dustSpeed",
     "life": "proto.hits.touchSpent.dustLife",
     "size": "proto.hits.touchSpent.dustSize",
     "role": "fleet",
     "dir": "random",
     "at": "contact"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.touchSpent.thudFrom",
    "to": "proto.hits.touchSpent.thudTo",
    "seconds": "proto.hits.touchSpent.thudSeconds",
    "gain": "proto.hits.touchSpent.thudGain"
   },
   "reference": "Dull bump with no burst, flash or number",
   "sources": [
    "JUICE#J3",
    "DESIGN#D4.5",
    "LOG#P1.2/juice",
    "ENG#8.1"
   ]
  },
  {
   "event": "writeoff",
   "when": {},
   "scale": null,
   "shake": {
    "amp": "proto.hits.writeoff.shakeAmp",
    "seconds": "proto.hits.writeoff.shakeSeconds"
   },
   "zoom": {
    "amount": "proto.hits.writeoff.zoomAmount",
    "seconds": "proto.hits.writeoff.zoomSeconds"
   },
   "flash": "proto.hits.writeoff.flashSeconds",
   "crumple": {
    "amount": "proto.hits.writeoff.crumpleAmount",
    "seconds": "feedback.writeOffSeconds"
   },
   "stumble": null,
   "ring": {
    "radius": "proto.hits.writeoff.ringRadius",
    "seconds": "proto.hits.writeoff.ringSeconds",
    "width": "proto.hits.writeoff.ringWidth",
    "role": "primary"
   },
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [
    {
     "type": "debris",
     "count": "proto.hits.writeoff.debrisCount",
     "speed": "proto.hits.writeoff.debrisSpeed",
     "life": "proto.hits.writeoff.debrisLife",
     "size": "proto.hits.writeoff.debrisSize",
     "role": "structure",
     "dir": "away",
     "at": "contact"
    },
    {
     "type": "smoke",
     "count": "proto.hits.writeoff.smokeCount",
     "speed": "proto.hits.writeoff.smokeSpeed",
     "life": "feedback.writeOffSeconds",
     "size": "proto.hits.writeoff.smokeSize",
     "role": "fleet",
     "dir": "random",
     "at": "dummy"
    },
    {
     "type": "spark",
     "count": "proto.hits.writeoff.sparkCount",
     "speed": "proto.hits.writeoff.sparkSpeed",
     "life": "proto.hits.writeoff.sparkLife",
     "size": "proto.hits.writeoff.sparkSize",
     "role": "primary",
     "dir": "random",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.writeoff.crashFrom",
    "to": "proto.hits.writeoff.crashTo",
    "seconds": "proto.hits.writeoff.crashSeconds",
    "gain": "proto.hits.writeoff.crashGain"
   },
   "reference": "Heavy shake, debris and wreck permanence over the write-off animation",
   "sources": [
    "JUICE#J3",
    "JUICE#J1",
    "LOG#P1.2/juice",
    "EDIT26#5.5",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "writeoff",
   "when": {},
   "scale": null,
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": null,
   "particles": [],
   "sound": {
    "type": "tone",
    "from": "proto.hits.writeoff.boomFrom",
    "to": "proto.hits.writeoff.boomTo",
    "seconds": "proto.hits.writeoff.boomSeconds",
    "gain": "proto.hits.writeoff.boomGain",
    "wave": "sine"
   },
   "reference": "Low boom under the crash so the write-off sounds heaviest",
   "sources": [
    "EDIT26#5.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "event": "lunge",
   "when": {},
   "scale": {
    "by": "R",
    "full": "movement.lungeDistance"
   },
   "shake": {
    "amp": "proto.hits.lunge.shakeAmp",
    "seconds": "proto.hits.lunge.shakeSeconds"
   },
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": {
    "count": [
     "proto.hits.lunge.streakCountMin",
     "proto.hits.lunge.streakCountMax"
    ],
    "length": [
     "proto.hits.lunge.streakLenMin",
     "movement.lungeDistance"
    ],
    "seconds": "movement.lungeDuration",
    "role": "secondary"
   },
   "particles": [
    {
     "type": "dust",
     "count": "proto.hits.lunge.dustCount",
     "speed": "proto.hits.lunge.dustSpeed",
     "life": "proto.hits.lunge.dustLife",
     "size": "proto.hits.lunge.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "noise",
    "from": [
     "proto.hits.lunge.whooshFromMin",
     "proto.hits.lunge.whooshFromMax"
    ],
    "to": "proto.hits.lunge.whooshTo",
    "seconds": "proto.hits.lunge.whooshSeconds",
    "gain": "proto.hits.lunge.whooshGain"
   },
   "reference": "Speed lines, dust kicked backwards, small camera kick",
   "sources": [
    "JUICE#J3",
    "LOG#P1.2/juice",
    "EDIT26#5.5",
    "EDIT26#5.1",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "near-miss",
   "when": {},
   "scale": {
    "by": "speed",
    "full": "vehicles.sedan.cruiseSpeed"
   },
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": {
    "count": [
     "proto.hits.nearMiss.streakCountMin",
     "proto.hits.nearMiss.streakCountMax"
    ],
    "length": [
     "proto.hits.nearMiss.streakLenMin",
     "proto.hits.nearMiss.streakLenMax"
    ],
    "seconds": "proto.hits.nearMiss.streakSeconds",
    "role": "fleet"
   },
   "particles": [
    {
     "type": "dust",
     "count": "proto.hits.nearMiss.dustCount",
     "speed": "proto.hits.nearMiss.dustSpeed",
     "life": "proto.hits.nearMiss.dustLife",
     "size": "proto.hits.nearMiss.dustSize",
     "role": "structure",
     "dir": "backward",
     "at": "car"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.nearMiss.whooshFrom",
    "to": "proto.hits.nearMiss.whooshTo",
    "seconds": "proto.hits.nearMiss.whooshSeconds",
    "gain": [
     "proto.hits.nearMiss.gainMin",
     "proto.hits.nearMiss.gainMax"
    ]
   },
   "reference": "Pass-by whoosh and speed lines along the car's travel; art of rally dust",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4",
    "EDIT26#3.3",
    "JUICE#J1"
   ]
  },
  {
   "event": "near-miss",
   "when": {
    "gap": {
     "max": 0.5
    }
   },
   "scale": {
    "by": "speed",
    "full": "vehicles.sedan.cruiseSpeed"
   },
   "shake": {
    "amp": "proto.hits.nearMiss.tightShakeAmp",
    "seconds": "proto.hits.nearMiss.tightShakeSeconds"
   },
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": null,
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": {
    "count": [
     "proto.hits.nearMiss.streakCountMin",
     "proto.hits.nearMiss.streakCountMax"
    ],
    "length": [
     "proto.hits.nearMiss.streakLenMax",
     "proto.hits.nearMiss.tightStreakLen"
    ],
    "seconds": "proto.hits.nearMiss.streakSeconds",
    "role": "fleet"
   },
   "particles": [],
   "sound": {
    "type": "tone",
    "from": "proto.hits.nearMiss.pingFrom",
    "to": "proto.hits.nearMiss.pingTo",
    "seconds": "proto.hits.nearMiss.pingSeconds",
    "gain": "proto.hits.nearMiss.pingGain",
    "wave": "triangle"
   },
   "reference": "Tighter pass earns longer streaks, a tiny shiver and a ping (no reward)",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4",
    "EDIT26#3.3"
   ]
  },
  {
   "event": "miss",
   "when": {},
   "scale": null,
   "shake": null,
   "zoom": null,
   "flash": null,
   "crumple": null,
   "stumble": {
    "amp": "proto.hits.miss.stumbleAmp",
    "seconds": "proto.hits.miss.stumbleSeconds"
   },
   "ring": null,
   "rays": null,
   "popup": null,
   "streaks": {
    "count": "proto.hits.miss.streakCount",
    "length": "proto.hits.miss.streakLen",
    "seconds": "proto.hits.miss.streakSeconds",
    "role": "secondary"
   },
   "particles": [
    {
     "type": "dust",
     "count": "proto.hits.miss.dustCount",
     "speed": "proto.hits.miss.dustSpeed",
     "life": "proto.hits.miss.dustLife",
     "size": "proto.hits.miss.dustSize",
     "role": "structure",
     "dir": "random",
     "at": "dummy"
    }
   ],
   "sound": {
    "type": "noise",
    "from": "proto.hits.miss.clatterFrom",
    "to": "proto.hits.miss.clatterTo",
    "seconds": "proto.hits.miss.clatterSeconds",
    "gain": "proto.hits.miss.clatterGain"
   },
   "reference": "Stumble with arms flailing and a clatter; Juice It or Lose It body weight",
   "sources": [
    "EDIT26#5.5",
    "EDIT26#5.1",
    "DESIGN#D4.5",
    "DESIGN#D10.1",
    "JUICE#J2"
   ]
  }
 ]
}

# ISSUES TO FIX

## Validator (automatic checks)
- none

## Critic
- C1 [data/fix] layers[5].when.assessed.min: found "400" — Every value needs a registry parameter ID. 400 is a bare threshold with no ID, and it is half of damage.bodyHealth only by coincidence. (ENG#8.2~1). Fix: "\"proto.hits.impact.big.assessedMin\" (add a param: value 400, unit \"assessed impact\", purpose \"Assessed impact at which the big-hit layer applies.\", sources [\"ENG#8.2~1\"])"
- C2 [data/fix] layers[14].when.gap.max: found "0.5" — Every value needs a registry parameter ID. The tight-pass gap of 0.5 m is a bare number with no ID. (ENG#8.2~1). Fix: "\"proto.hits.nearMiss.tightGap\" (add a param: value 0.5, unit \"m\", purpose \"Closest gap at which a near miss counts as a very tight pass.\", sources [\"DESIGN#D4.5\"])"
- C3 [rule/fix] params[proto.hits.impact.headOn.ringRadius].value: found "56" — The impact burst cue is capped at 2 × body width (52 units). The registry purpose for ringRadiusMax already says to stay under that. (EDIT26#4.2~2). Fix: "52"
- C4 [rule/fix] params[proto.hits.impact.headOn.raysLenMax].value: found "64" — The impact burst cue is capped at 2 × body width (52 units). The head-on rays exceed it. (EDIT26#4.2~2). Fix: "52"
- C5 [rule/fix] params[proto.hits.impact.big.ringRadius].value: found "70" — The impact burst (ring and rays) is capped at 2 × body width (52 units). A big-hit ring of 70 overruns the cap and can cover neighbouring cues (D4.5, J4). (EDIT26#4.2~2). Fix: "52"
- C6 [lore/fix] layers[1].reference: found "Heavier shake and double shock ring on the full-damage zone; crunch and horn" — In the P1 damage model the zone factors are unused and angle replaces them, so the front zone is not a 'full-damage zone'. It is only the logged contact zone. (LOG#P1.3/rules). Fix: "Heavier shake and a second, wider shock ring on a front contact; crunch and horn"
- C7 [rule/fix] layers[0].ring.role: found "primary" — Cue treatments are reserved. A decorative ring in cue.primary or cue.secondary reads as the battery glow ring or the commit ring. This applies to the rings in layers[0], [1], [5] and [8], whose roles are primary, secondary, primary and primary. (EDIT26#4.2~2). Fix: "structure"
- C8 [rule/fix] layers[4].sound.from: found "proto.hits.impact.stopped.thudFrom" — A scored hit and a physical touch on a spent car must not use indistinguishable feedback. The stopped-car scored thud (400→90 Hz, 0.14 s) is nearly the same as the spent-touch thud (420→110 Hz, 0.14 s). (DESIGN#D4.5). Fix: "Give the stopped scored hit a different sound, for example a lower, longer thud with the crunch. Set thudFrom to 300, thudTo to 60 and thudSeconds to 0.22, so the dull spent-touch thud is not repeated."
- C9 [data/fix] params[proto.hits.miss.stumbleAmp].unit: found "ratio" — The stumble amplitude is an angle (the purpose says radians). Its unit must match its value. (EDIT26#5.5). Fix: "rad"

Apply every fix. Change nothing else. Output the complete corrected JSON object.