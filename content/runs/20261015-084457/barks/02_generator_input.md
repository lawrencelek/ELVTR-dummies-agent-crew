# BRIEF — Barks: vehicle humour in speech bubbles, one line per logged case
Content type: barks. Parameter prefix for new IDs: proto.barks.

## The gap (what P1 is thin on)
- My game is thin on humour (designer's gap statement). The fiction is comic and tragic at once, but play never shows it.
- P2.0 has 11 barks in a small grey tag under the car. Each car speaks at most once per road, so most hits, misses and near misses pass in silence.
- There is no line for a miss, a near miss, a write-off or an upgrade. The bark key (front hit, side hit, near miss, safe passage, write-off, seniority) is not used.
- There is one tag style for every case, so a write-off and a polite stop look the same.
- One P2.0 line breaks the worker voice: 'Move it! I have a delivery window.'

## Deliverable
- A bark bank: short lines vehicles say, each bound to one case (a logged event plus 'when' conditions) and using only that event's fields.
- A bubble style per line, chosen from the four the renderer draws, so each case has a recognisable look above the car.
- Priorities: write-off lines outrank all others; hits outrank chatter.
- Seeded variation: two or more lines for frequent cases (front hit, write-off, near miss, miss), so repeats do not read as a loop.
- Timing and detection parameters as proto.barks.* IDs: on-screen seconds, global and per-car cooldowns, maximum bubbles, text size, and the near-miss and miss thresholds the renderer uses to derive those cases.

## JSON schema
```
{
  "params": [ {"id": "proto.barks.<name>", "value": number, "unit": "s|count|world units|world units/s|px", "purpose": "one line", "sources": [chunk ids]} ],
  "lines": [ {
     "event": one of allowed.events,
     "when": {field: literal from allowed.values} or {numericField: {"min": n, "max": n}} or {},
     "style": one of allowed.styles,
     "priority": 1|2|3,
     "text": "the line, with {field} placeholders",
     "sources": [chunk ids]
  } ]
}
A line fires only when every 'when' condition matches. Placeholders and 'when' keys use only that event's fields (table below).
```

## Consumer contract (what the renderer can draw)
- Event fields the renderer passes to a bark (all logged; derived cases are logged by the renderer into the trace under 'presentation'):
- - impact: model, cls, seniority, zone, angle, closing, assessed, lost, health, carState, cause, bait, lunging, stopped
- - writeoff: chassis, writeOffs, plus the car of the impact that caused it in the same step: model, cls, seniority, zone
- - touch-spent: model, cls, seniority (a touch on a car already spent: no damage, no points)
- - knock: model, cls, seniority, speed (the dummy is pushed back by a car)
- - honk: model, cls, seniority, at ('body' = horn at the dummy; 'cone' = light flash at a cone)
- - commit: model, cls, seniority, man ('shift' swerve, 'brake' stop, 'reverse'), cause ('body' = avoiding the dummy, 'pass' = passing it after waiting, 'cone', 'yield', 'return', 'unstick')
- - interrupt: model, cls, seniority, by ('car' or 'cone'): a committed swerve is halted for safety
- - unstick: model, cls, seniority, how ('reverse' or 'replan')
- - admit: model, cls, seniority (the car enters the road)
- - near-miss (derived): model, cls, seniority, gap (metres between car and dummy at closest), speed, lunging. A car above proto.barks.nearMissSpeed passes within proto.barks.nearMissGap of the dummy without contact.
- - miss (derived): model, cls, seniority, gap. A lunge ends with no contact; the nearest car within proto.barks.missRadius of the lunge end speaks.
- - upgrade-seen (derived): model, cls, seniority, node (Hips, Spine, Carry or Throw). The first car to avoid or honk at a chassis carrying a node bought since the last deploy.
- seniority is the notch count beside the model tag: 0 New, 1 Practised, 2 Experienced, 3 Senior. It rises as the model learns from the player's hits.
- Bubbles sit above the car's model tag with a tail to the car; near the top edge they flip below. Width wraps at about 180 units, two lines at most. Text is proto.barks.textSize px.
- speech: rounded white bubble, secondary-ink outline. thought: cloud outline with a trail of small circles. shout: jagged burst outline in primary ink, pops in. mutter: small dashed outline, lighter text.
- A bubble shows for proto.barks.seconds. A higher-priority line replaces a lower one on the same car. Lower lines wait out proto.barks.cooldown (global) and proto.barks.carCooldown (per car). At most proto.barks.maxOnScreen bubbles.
- Bubbles use white fill and primary or secondary ink only. They never cover the state pip, the spent mark or the seniority notches.

## Allowed values
```json
{
 "events": [
  "impact",
  "writeoff",
  "touch-spent",
  "knock",
  "honk",
  "commit",
  "interrupt",
  "unstick",
  "admit",
  "near-miss",
  "miss",
  "upgrade-seen"
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
  "writeoff": [
   "chassis",
   "writeOffs",
   "car",
   "zone",
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
  "knock": [
   "car",
   "speed",
   "model",
   "cls",
   "seniority"
  ],
  "honk": [
   "car",
   "at",
   "model",
   "cls",
   "seniority"
  ],
  "commit": [
   "car",
   "man",
   "cause",
   "model",
   "cls",
   "seniority"
  ],
  "interrupt": [
   "car",
   "by",
   "model",
   "cls",
   "seniority"
  ],
  "unstick": [
   "car",
   "how",
   "model",
   "cls",
   "seniority"
  ],
  "admit": [
   "car",
   "cls",
   "model",
   "lane",
   "seniority"
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
  ],
  "upgrade-seen": [
   "car",
   "model",
   "cls",
   "seniority",
   "node"
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
  "man": [
   "shift",
   "brake",
   "reverse"
  ],
  "how": [
   "reverse",
   "replan"
  ],
  "at": [
   "body",
   "cone"
  ],
  "by": [
   "car",
   "cone"
  ],
  "cls": [
   "sedan",
   "van"
  ],
  "model": [
   "SEDAN-01",
   "VAN-02"
  ],
  "node": [
   "Hips",
   "Spine",
   "Carry",
   "Throw"
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
  ],
  "seniority": [
   0,
   1,
   2,
   3
  ]
 },
 "numeric_fields": [
  "seniority",
  "gap",
  "speed",
  "lost",
  "assessed",
  "angle",
  "closing",
  "chassis",
  "writeOffs",
  "health"
 ],
 "styles": [
  "speech",
  "shout",
  "thought",
  "mutter"
 ],
 "priorities": [
  1,
  2,
  3
 ],
 "max_chars": 56,
 "required_cases": [
  {
   "event": "impact",
   "when": {
    "zone": "front"
   },
   "min_lines": 2
  },
  {
   "event": "impact",
   "when": {
    "zone": "side"
   },
   "min_lines": 1
  },
  {
   "event": "impact",
   "when": {
    "bait": true
   },
   "min_lines": 1
  },
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "min_lines": 1
  },
  {
   "event": "writeoff",
   "when": {},
   "min_lines": 2
  },
  {
   "event": "near-miss",
   "when": {},
   "min_lines": 2
  },
  {
   "event": "miss",
   "when": {},
   "min_lines": 2
  },
  {
   "event": "commit",
   "when": {
    "cause": "body"
   },
   "min_lines": 1
  },
  {
   "event": "touch-spent",
   "when": {},
   "min_lines": 1
  },
  {
   "event": "honk",
   "when": {
    "at": "body"
   },
   "min_lines": 1
  },
  {
   "event": "upgrade-seen",
   "when": {},
   "min_lines": 1
  }
 ],
 "required_params": [
  "proto.barks.seconds",
  "proto.barks.cooldown",
  "proto.barks.carCooldown",
  "proto.barks.maxOnScreen",
  "proto.barks.textSize",
  "proto.barks.nearMissGap",
  "proto.barks.nearMissSpeed",
  "proto.barks.missRadius"
 ]
}
```

## Voices (who says what)
- Vehicles (every line): Workers with jobs, deadlines, rank and a fear of retraining. Corporate politeness barely contains resentment and pride (D9.3). A car talks about its own job, record and the event just logged. Never FARSIGHT's slogans, never game-show cheer, never mockery of the player.
- speech: What the car says out loud: polite, procedural, a little strained.
- thought: What the car thinks and would not say: the resentment or fear under the politeness.
- shout: Involuntary: the moment of a hit or write-off. Short.
- mutter: Under its breath: near misses, waiting, stopping, reversing.

## Copy slots (where each string appears)
- vehicle jobs (published graphics content): SEDAN-01 is a depot parcel courier. VAN-02 does lane maintenance. Lines may refer to these jobs.
- humour: Comic and tragic at once (EDIT26 3.1): AI workers in a ridiculous job. The joke is the gap between procedure and what just happened, stated flatly.

## Game data
Registry IDs you may reference (value, unit):
- body.radius = 13 world units
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- movement.lungeDistance = 164 world units
- movement.lungeDuration = 0.3 s
- movement.lungeFastDistanceFraction = 0.7 ratio
- movement.lungeFastTimeFraction = 0.333333 ratio
- movement.lungeRecovery = 0.35 s
- perception.sideRadius = 100 world units
- proto.driver.patienceSeconds = 8
- proto.honkSeconds = 5
- proto.scale.unitsPerMetre = 12.2
- proto.standoffDistance = 50
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

Published graphics content: vehicle jobs sedan: Depot parcel courier; van: Lane maintenance.

# CONTEXT

[EDIT26#6.6] (6.6 Voice: barks and reports)
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[EDIT26#3.2] (3.2 Voice and register)
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#3.1] (3.1 World and lore)
### 3.1 World and lore
- A Sinofuturist universe where AI workers perform ridiculous jobs, comic and tragic at once.
- FARSIGHT sells a city without accidents. Your job is to cause them.
- The city is the crash lab. Shenzhen Smart City is filled with surveillance instruments and test markings.
- The cars want to qualify. You want to leave.
- FARSIGHT issues one modification credit per destroyed body, and approves modifications to widen test coverage: the fleet must be certified against more kinds of human behaviour.
- Damage is measured and recorded, but only a completed test is paid. The dummy uses each modification to leave sooner.
- Freedom is the promise behind certification, not a separate currency.

[DESIGN#D9.3] (D9.3 Voice and reports (§3.3))
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[DESIGN#D9.4] (D9.4 Sound (§3.4))
### D9.4 Sound (§3.4)
Factory hum, engines, restrained synthetic music and clinical announcements make the city sound operational even when the body fails. The dummy creaks, clanks, squashes and recovers with physical weight.
Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. Gameplay cues take priority over ambience and have visual equivalents. Voices are optional; text-first barks must work at exhibition volume.
Reports and purchases can use presentation-time sound while simulation is frozen. No sound callback can award damage, currency or learning. There is no automatic repair warning in the slice because automatic repair is disabled.

[EDIT26#6.4] (6.4 Learning and seniority)
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

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

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

[ENG#11.3] (11.3 Required run and event data)
### 11.3 Required run and event data
A run records profile/version, build/schema compatibility, full effective configuration/hash, schedule/seed, level asset identity, phase, active and interaction times, body identity, owned IDs, credits, points, objective progress, model learning, appearance state, and eligibility history. Log gameplay-affecting developer actions even if reverted.
Impact records include event ID, body ID, appearance/model ID, contact episode ID, simulation time, zone, speed, action eligibility, raw/assessed impact, health lost, finishing excess, score modifier/points, allowance transition, contact evidence, player-hit eligibility, actual applied increment, write-off ID and terminal/nonterminal disposition. Reports and tests consume this same record.
Record scheduled, admitted, spent and exited opportunities separately. Model learning updates record effective before/after values, so a capped attempted update is not mistaken for seniority. Purchases record balance and owned IDs before/after. These logs support analysis; the visitor interface shows only the facts needed to decide and understand.

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

[DESIGN#D4.5] (D4.5 Sensing and feedback (§5.5))
### D4.5 Sensing and feedback (§5.5)
The view cone follows body facing in the slice. It resolves cars' sensor zones and occlusion information in that direction. Cars, identity, route/commitment, brake and spent cues remain available outside the cone. There is no active fog-of-war experiment that hides traffic.
Actor markers remain readable when sprites overlap; occlusion concerns the sensor information and actual sensor rays. Van-class cover can block sensing according to World flags, but must not erase all warning that another vehicle exists.
The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. A 0.06-second hit-stop and 1.1-second destruction presentation are trial values. Cues take priority over particles, shake and decorative information.

[EDIT26#10.5] (10.5 Difficulty and escalation)
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

[DESIGN#D6.1] (D6.1 One authored Road (§7.1))
### D6.1 One authored Road (§7.1)
The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. The logical world reference is 800 × 600 units, independent of the surrounding UI layout. A different display scales the view without silently changing reach or car travel time. Changing logical world dimensions requires new pacing and collision witnesses.
The initial lane width is 56 units. Openings must accommodate the complete 26-unit dummy footprint with usable margin, including the worn-reach case. A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. The authored level asset must supply actual positions, collider footprints, spawn transforms, legal exits, cover flags and prop recovery positions. Its geometry is tested as a single versioned asset. This document does not invent validated coordinates.
The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. There must be room to use Hips and Spine and meaningful placements to use Carry and Throw. Each advertised advantage is compared with what the unupgraded dummy can already do. Simply including a cone does not prove Carry has value; simply including a corner does not prove Hips has value.
The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. Essential geometry stays legible behind the authored art. Clear shoulders and escape positions are part of the layout, not emergency developer cheats.

[DRIVER#DB6] (DB6 Vehicle profiles — proposal)
## DB6 Vehicle profiles — proposal
A profile sets the driver values above. Class, schedule or state can assign it.
| Profile | Assigned to | Reaction | Near the dummy | Dummy in path | Pass / swerve | Horn | Role |
|---|---|---|---|---|---|---|---|
| **Standard** (built) | All cars in P1.7 | 0.67 s | Slow to 15 mph | Stop beyond lunge range, wait | Slow pass after 8 s, 2 m | At danger only | Readable baseline |
| **Courier** | Vans, behind schedule | 0.8 s | Covers brake, keeps speed | Stops closer; waits 3 s | Passes sooner with 1.5 m; swerves around cones at speed | Early | More hittable; rewards reading time pressure |
| **Learner** | Rare sedans, L-plates | 1.0 s | Slow to 10 mph; wider zone | Stops early | Never passes | Never | Hard to hit; creates queues to exploit |
| **Emergency** | Rare, blue lights | 0.5 s | Ignores | Brakes and swerves to avoid | Overtakes freely | Siren | High-speed, high-damage event. Others pull over and stop. |
| **Rattled** | A model after it is hit | 0.5 s | Wider zone, +50% | Longer standoff | Patient | — | The fleet visibly adapts (ties to learning, D5.3) |
| **Bus** | Expansion | 0.67 s | Slow | Stop | Never swerves | Rare | Huge, fixed lane, stops at stops |
- **Emergency vehicles:** Other drivers must let them through. In P1 that means pulling to the kerb and stopping. Stopped cars give only weak hits, so the emergency vehicle itself is the prize.

[EDIT26#11.1] (11.1 How data works now (Built))
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

[ENG#5.3~2] (5.3 Lunge, actual velocity and solid response)
Recovery begins at the snapshotted lunge deadline and lasts its declared duration, including after early obstruction. Pause/hit-stop freeze these simulation deadlines. T01/T08 must exercise early walls, glancing contacts, stationary vehicles, pushing and two-contact constraints.

[EDIT26#10.2] (10.2 Progression across four horizons)
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