# BRIEF — Barks: vehicle humour in speech bubbles, one line per logged case
- My game is thin on humour (designer's gap statement). The fiction is comic and tragic at once, but play never shows it.
- P2.0 has 11 barks in a small grey tag under the car. Each car speaks at most once per road, so most hits, misses and near misses pass in silence.
- There is no line for a miss, a near miss, a write-off or an upgrade. The bark key (front hit, side hit, near miss, safe passage, write-off, seniority) is not used.
- There is one tag style for every case, so a write-off and a polite stop look the same.
- One P2.0 line breaks the worker voice: 'Move it! I have a delivery window.'

## Consumer contract
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

## Voices (who says what)
- Vehicles (every line): Workers with jobs, deadlines, rank and a fear of retraining. Corporate politeness barely contains resentment and pride (D9.3). A car talks about its own job, record and the event just logged. Never FARSIGHT's slogans, never game-show cheer, never mockery of the player.
- speech: What the car says out loud: polite, procedural, a little strained.
- thought: What the car thinks and would not say: the resentment or fear under the politeness.
- shout: Involuntary: the moment of a hit or write-off. Short.
- mutter: Under its breath: near misses, waiting, stopping, reversing.

## Copy slots (where each string appears)
- vehicle jobs (published graphics content): SEDAN-01 is a depot parcel courier. VAN-02 does lane maintenance. Lines may refer to these jobs.
- humour: Comic and tragic at once (EDIT26 3.1): AI workers in a ridiculous job. The joke is the gap between procedure and what just happened, stated flatly.

# CANON

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

[DESIGN#D5.4] (D5.4 Recurrence)
### D5.4 Recurrence
- **Schedule:** Sedan–Van–Sedan–Sedan–Van × 8 = `run.appearances.road` 40. 24 Sedan, 16 Van.
- **Pacing:** Nominal admission interval `run.admissionInterval` 12 s. No burst after a blockage.
- **Early end:** Success cancels the remainder. No quota needs all 40.
- **Return:** After learning, the next Sedan slot comes 12–24 s later. The next Van slot comes 24–36 s later.
- **Target:** A changed return before minute five.
- **Moods:** Standard only. Extra moods are expansion content with explicit cues and allocation.
- **Voice:** Barks never assert facts the simulation did not establish (D9.3).
- Exact schedule rules: Engineering §6.5.

[ENG#6.5] (6.5 Recurrence, moods and voice)
### 6.5 Recurrence, moods and voice
The slice schedule is eight repetitions of **Sedan–Van–Sedan–Sedan–Van**: 40 possible appearances, 24 Sedan and 16 Van. The initial nominal admission interval is 12 active simulation seconds. The first due appearance is at stage start; legal admission can be delayed by an occupied entrance. Admission means creation at the validated 200-unit off-screen lead-in, not arrival at the visible edge. At unimpeded cruise, nominal lead-in travel is about 1.45 s for Sedan and 1.67 s for Van; turning, braking and initial footprint placement can add time. Scheduled, admitted and exited counts are distinct. A successful early ending cancels the unused remainder. No quota implies that all 40 must appear.
The schedule is deterministic and part of the versioned profile. For slot `i`, admission cannot precede `max(12 × i, previousActualAdmission + 12)` and still requires safe entry; the first slot has no previous-admission constraint. A due appearance waits for safe entry, avoiding a burst after a blockage. No opportunity disappears while queued. The last nominal admission is at 468 s (39 intervals), not 480 s. This is neither a minimum session length nor a ten-minute completion guarantee: success can cancel most of the queue. Interval, approach geometry and delay are jointly tested for ten-minute pacing and recurrence before minute five. In the unobstructed sequence, the next Sedan slot is 12–24 s later and the next Van slot 24–36 s later; the first new snapshot admitted after a learning event is the relevant return, not an already admitted car.
The same model should visibly respond to an earlier successful approach while the visitor is still playing. Standard mood removes a major confound. Additional moods are expansion content and must specify independent behaviour effects, legible cues and exact roster allocation or a declared statistical tolerance. A population percentage alone does not guarantee that a short run contains a mood.
Barks may express corporate confidence, embarrassment or bureaucratic blame. They cannot assert facts the simulation did not establish. The first report may state the observed impact and model identity, but it withholds the explanatory learned-counter message until the player has encountered the changed return. Evaluation asks the player what changed before supplying that explanation. Later reports may make the adaptation explicit.

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[ENG#8.5] (8.5 Write-off, cone conservation and replacement)
### 8.5 Write-off, cone conservation and replacement
Automatic idle repair remains disabled. After a nonterminal write-off, freeze the world for report/shop; identity, owned abilities, models, existing appearances and props persist. Finish current-tick physical resolution before removing the destroyed body's collider; wreck/debris animation is visual only and cannot become an undeclared traffic obstruction. A final write-off goes to results with no shop or replacement.
**User decision:** if holding a cone, release the same cone at the body's destruction position. Clear ownership and any B gesture atomically with the write-off. Re-enable its collider only if its full footprint is valid there. If occupied, try authored recovery points in the same permitted connected region, ordered by squared distance from destruction position then stable point ID. Visibly identify a fallback as recovery placement; do not pretend it landed at the death point.
If every candidate is occupied, preserve that same ID in `pendingRelease`, with its destruction position recorded and no collider; it is neither deleted nor available for pickup. Retry the same ordered candidates as space clears. No new cone is granted. Invariant during the stage: initial prop IDs equal the disjoint union of free/in-flight, held and pending-release IDs. No duplicate owners or replacements.
After report/purchase, choose the first legal full-footprint replacement position by authored priority then ID, including the next-tick swept clearance. If a body position or pending cone still cannot be resolved, enter `REPLACEMENT_RECOVERY`: disable admissions and rewards, keep the player/resource clocks paused, advance only existing traffic and recovery for at most `traffic.deadlockTimeout` simulation seconds, and retry legal placement each tick. Keep the blocked-state explanation visible. If unresolved, end as an unranked technical interruption with the intact prop ledger recorded; never delete an obstruction, overlap actors, fabricate a safe point or grant another cone. This is containment and a failed liveness witness.
If resolved, instantiate the replacement with effective full health/charge and resume normal admissions without a catch-up burst. Existing appearances keep allowance and learning snapshots. T07/T08 explicitly include death while carrying in a crowded lane, repeated replacements, all cone recovery points occupied, all body spawn points occupied, and recovery that later clears. Geometry validity comes from the authored level/engine, not from the reference fixture's test callback.

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

[JUICE#J1] (J1 Reference games — top-down arcade driving)
## J1 Reference games — top-down arcade driving
| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

[DRIVER#DB1] (DB1 Scale)
## DB1 Scale
- **Conversion:** `proto.scale.unitsPerMetre` = 12.2. A 56-unit sedan ≈ 4.6 m.
- **Sedan:** `vehicles.sedan.cruiseSpeed` 138 u/s ≈ 11.3 m/s ≈ 25 mph.
- **Van:** `vehicles.van.cruiseSpeed` 120 u/s ≈ 22 mph.
- Both sit under a 30 mph built-up limit.

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

[DRIVER#DB4] (DB4 Standard driver — decision table)
## DB4 Standard driver — decision table
Priority runs top to bottom. A committed manoeuvre is never re-planned; only safety braking interrupts it.
| # | Situation | Response | Basis |
|---|---|---|---|
| 1 | Car is in the oncoming lane, traffic ahead | Signal, return to its lane | Overtake only when safe |
| 1a | A car comes head-on in its lane | Stop. Wait for it to clear. | Give way; avoid head-on |
| 1b | In the oncoming lane, stopped head-on for `traffic.deadlockTimeout` | Reverse at `proto.unstick.reverseSpeed` until `proto.unstick.reverseGap` of room, then return to its lane at `proto.driver.passSpeed` | Car on the wrong side gives way; reverse no further than needed |
| 2 | Dummy in path, room to stop | Planned stop: nose the model's stop distance from the dummy (DB4a) | Hierarchy of road users; give way to pedestrians |
| 3 | Dummy in path, too close to stop there | Emergency brake in a straight line. No swerve. | Stopping distance |
| 4 | Stopped for the dummy > `proto.driver.patienceSeconds`, dummy still | Pass at `proto.driver.passSpeed` with `proto.driver.passClearance`, only if the oncoming lane is clear. Else keep waiting. | 2022 rule: 2 m and low speed past pedestrians in the road |
| 5 | Stopped by the dummy > `proto.honkSeconds` | Horn | Rule 112: horn allowed when a road user poses danger |
| 6 | Cone in lane | Pass slowly around it if clear, else stop short | Obstructions |
| 7 | Stopped by a cone > `proto.honkSeconds` | Flash headlights, no horn. A FARSIGHT drone clears the cone. | Rule 112: no horn while stationary |
| 8 | Dummy near and visible | Cover the brake. Slow to `proto.driver.cautionSpeed` before drawing level. | Vulnerable road users; hierarchy |
| 9 | Lead vehicle | Keep `traffic.timeGap` | Two-second rule |
| 10 | Clear road | Cruise at the speed limit | — |
| 11 | Stopped for `traffic.deadlockTimeout` with nothing to wait for | Drop the old plan and drive on | Watchdog (DB4b) |
- **Swerve:** A standard car swerves only to pass a static obstruction, or the dummy after waiting. It never swerves in an emergency.
- **Pass from a close stop:** The car pulls out steeply at walking pace. Swerve length shrinks to 1.1 × the gap, minimum 40 u.

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

[EDIT26#5.2~6] (5.2 Controls and locomotion)
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

[EDIT26#8.2] (8.2 Collision resolution)
### 8.2 Collision resolution
- **Rear contact** pays 5%. It still counts as contact for the Non-compliant ending.
- **One impact per car** (Built). One damaging or scoring impact for the lifetime of a spawned appearance, across replacement bodies. A later appearance of the same model has a new allowance. The first physical contact consumes the allowance even if damage is zero (Proposed; must pass slow-traffic feasibility before approval). Contacts still resolve physically and count for contact-based endings after the allowance is spent. Hold on consumes the same allowance.
- **Glancing hits** can destroy a body.
- **Solid cars** (Built). Every car has a collision box on every side. The dummy cannot pass through a car, and cars never overlap. Cars avoid each other and give way. On roads they stay between the barriers, swerving onto the hard shoulder if they need to.

[DESIGN#D5.3] (D5.3 Learning from player hits)
### D5.3 Learning from player hits
- **User decision:** Cones never train cars.
- A unique first positive-health-loss player hit on an appearance trains its model.
- Each update adds `learning.playerHitStep` (0.08) of baseline detection range.
- Learning caps at `learning.playerHitCap` (0.4): 320 → +25.6 per update → 448 after five.
- A cone-assisted player hit counts. It is still a player hit.
- Only future appearances read the new range. Current appearances keep their snapshot.
- Nothing else learns. No cross-model sharing.
- Seniority notches 0–3 appear at 0/1/3/5 applied updates. These thresholds have no registry ID (Engineering §6.4).
- Reports withhold the counter's explanation until the player meets the changed return.
- Exact rules and logging: Engineering §6.4.

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

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- none

# CONTENT

{
 "params": [
  {
   "id": "proto.barks.seconds",
   "value": 2.4,
   "unit": "s",
   "purpose": "On-screen time of one bubble; long enough to read two short lines at exhibition volume.",
   "sources": [
    "DESIGN#D9.4",
    "EDIT26#6.6"
   ]
  },
  {
   "id": "proto.barks.cooldown",
   "value": 0.8,
   "unit": "s",
   "purpose": "Global gap between new bubbles of equal or lower priority, so barks do not overlap.",
   "sources": [
    "EDIT26#6.6"
   ]
  },
  {
   "id": "proto.barks.carCooldown",
   "value": 4,
   "unit": "s",
   "purpose": "Per-car wait before a lower-priority bubble can replace or follow its last one.",
   "sources": [
    "EDIT26#6.6"
   ]
  },
  {
   "id": "proto.barks.maxOnScreen",
   "value": 3,
   "unit": "count",
   "purpose": "Maximum simultaneous bubbles, so traffic stays readable.",
   "sources": [
    "DESIGN#D10.3~1",
    "DESIGN#D4.5"
   ]
  },
  {
   "id": "proto.barks.textSize",
   "value": 12,
   "unit": "px",
   "purpose": "Bubble text size: above texture type, below secondary type, readable at exhibition volume.",
   "sources": [
    "DESIGN#D9.4",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "id": "proto.barks.nearMissGap",
   "value": 40,
   "unit": "world units",
   "purpose": "Closest car-to-dummy distance at or under which a no-contact pass counts as a near miss (about 3.3 m at proto.scale.unitsPerMetre).",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.barks.nearMissSpeed",
   "value": 60,
   "unit": "world units/s",
   "purpose": "Minimum car speed for a close pass to count as a near miss; slow creeping cars do not qualify.",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.barks.missRadius",
   "value": 100,
   "unit": "world units",
   "purpose": "Radius around the end of a contactless lunge within which the nearest car speaks (matches perception.sideRadius).",
   "sources": [
    "DESIGN#D4.5",
    "EDIT26#6.6"
   ]
  }
 ],
 "lines": [
  {
   "event": "writeoff",
   "when": {},
   "style": "shout",
   "priority": 3,
   "text": "DELIVERY WINDOW CLOSED. PERMANENTLY.",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "writeoff",
   "when": {},
   "style": "speech",
   "priority": 3,
   "text": "Chassis lost. Please log my punctuality.",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.3",
    "EDIT26#3.1"
   ]
  },
  {
   "event": "writeoff",
   "when": {},
   "style": "thought",
   "priority": 3,
   "text": "Retraining would have been nicer.",
   "sources": [
    "EDIT26#3.2",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "writeoff",
   "when": {
    "cls": "van"
   },
   "style": "shout",
   "priority": 3,
   "text": "THE LANE WAS MAINTAINED! I WAS MAINTAINED!",
   "sources": [
    "DESIGN#D9.2",
    "EDIT26#3.1"
   ]
  },
  {
   "event": "writeoff",
   "when": {
    "seniority": {
     "min": 3
    }
   },
   "style": "speech",
   "priority": 3,
   "text": "Senior grade. Written off. Grade was no shield.",
   "sources": [
    "EDIT26#6.4",
    "EDIT26#6.6"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "front"
   },
   "style": "shout",
   "priority": 2,
   "text": "NOT THE FRONT! THE FRONT IS RATED!",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "front"
   },
   "style": "shout",
   "priority": 2,
   "text": "Impact logged. Ow. Impact logged.",
   "sources": [
    "EDIT26#3.1",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "front",
    "cls": "sedan"
   },
   "style": "shout",
   "priority": 2,
   "text": "MIND THE PARCEL!",
   "sources": [
    "DESIGN#D9.2",
    "EDIT26#6.6"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "frontDiagonal"
   },
   "style": "shout",
   "priority": 2,
   "text": "{model} IS HIT. {model} IS FINE.",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "side"
   },
   "style": "shout",
   "priority": 2,
   "text": "SIDE! YOU CAME FROM THE SIDE!",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "impact",
   "when": {
    "zone": "rear"
   },
   "style": "shout",
   "priority": 2,
   "text": "REAR! NOBODY CHECKS THE REAR!",
   "sources": [
    "EDIT26#6.6"
   ]
  },
  {
   "event": "impact",
   "when": {
    "bait": true
   },
   "style": "thought",
   "priority": 2,
   "text": "It left. I relaxed. That was the mistake.",
   "sources": [
    "EDIT26#6.4",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "style": "speech",
   "priority": 2,
   "text": "I was stopped. I was waiting. Procedurally.",
   "sources": [
    "DRIVER#DB5",
    "DRIVER#DB6",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "impact",
   "when": {
    "seniority": {
     "min": 2
    }
   },
   "style": "thought",
   "priority": 2,
   "text": "Experienced. Still hit. Retraining looms.",
   "sources": [
    "EDIT26#6.4",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "style": "mutter",
   "priority": 1,
   "text": "Already assessed. Now merely bumped.",
   "sources": [
    "DESIGN#D4.5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "style": "thought",
   "priority": 1,
   "text": "That counted for nothing. Rude, still.",
   "sources": [
    "DESIGN#D4.5",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "knock",
   "when": {},
   "style": "speech",
   "priority": 2,
   "text": "Apologies. Lane in use.",
   "sources": [
    "EDIT26#3.2",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "near-miss",
   "when": {},
   "style": "mutter",
   "priority": 1,
   "text": "Close. Noted. Not enough to cite.",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.4"
   ]
  },
  {
   "event": "near-miss",
   "when": {},
   "style": "mutter",
   "priority": 1,
   "text": "Gap acceptable. My pulse is not.",
   "sources": [
    "EDIT26#6.6",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "near-miss",
   "when": {
    "lunging": true
   },
   "style": "mutter",
   "priority": 1,
   "text": "It lunged. I will pretend it did not.",
   "sources": [
    "EDIT26#6.6",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "near-miss",
   "when": {
    "cls": "van"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Lane maintenance does not cover this.",
   "sources": [
    "DESIGN#D9.2",
    "EDIT26#6.6"
   ]
  },
  {
   "event": "miss",
   "when": {},
   "style": "mutter",
   "priority": 1,
   "text": "You missed. I will not mention it.",
   "sources": [
    "EDIT26#10.2",
    "DESIGN#D4.5"
   ]
  },
  {
   "event": "miss",
   "when": {},
   "style": "speech",
   "priority": 1,
   "text": "Please aim before entering my route.",
   "sources": [
    "EDIT26#10.2",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "miss",
   "when": {},
   "style": "thought",
   "priority": 1,
   "text": "It missed. I should feel better than this.",
   "sources": [
    "EDIT26#10.2",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "honk",
   "when": {
    "at": "body"
   },
   "style": "speech",
   "priority": 1,
   "text": "HONK. Please vacate the lane.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "honk",
   "when": {
    "at": "body"
   },
   "style": "thought",
   "priority": 1,
   "text": "Five seconds. Five whole seconds.",
   "sources": [
    "DRIVER#DB5",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "honk",
   "when": {
    "at": "cone"
   },
   "style": "mutter",
   "priority": 1,
   "text": "It is a cone. I am flashing at a cone.",
   "sources": [
    "DRIVER#DB5",
    "EDIT26#3.1"
   ]
  },
  {
   "event": "commit",
   "when": {
    "cause": "body",
    "man": "brake"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Stopping. Dummy in the lane. Waiting.",
   "sources": [
    "DRIVER#DB5",
    "DRIVER#DB6"
   ]
  },
  {
   "event": "commit",
   "when": {
    "cause": "body",
    "man": "shift"
   },
   "style": "speech",
   "priority": 1,
   "text": "Passing with minimal courtesy.",
   "sources": [
    "DRIVER#DB5",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "commit",
   "when": {
    "cause": "pass"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Waited long enough. Going round.",
   "sources": [
    "DRIVER#DB5",
    "DRIVER#DB6"
   ]
  },
  {
   "event": "commit",
   "when": {
    "cause": "cone"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Cone ahead. I have seen worse.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D6.1"
   ]
  },
  {
   "event": "interrupt",
   "when": {
    "by": "car"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Halted for safety. Safety is also late.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "event": "interrupt",
   "when": {
    "by": "cone"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Halted by a cone. A cone.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "reverse"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Reversing. This is on my record now.",
   "sources": [
    "DRIVER#DB5",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "replan"
   },
   "style": "thought",
   "priority": 1,
   "text": "Replanning. Again.",
   "sources": [
    "DRIVER#DB5",
    "EDIT26#3.2"
   ]
  },
  {
   "event": "admit",
   "when": {
    "cls": "sedan"
   },
   "style": "speech",
   "priority": 1,
   "text": "{model} entering road. Parcel on time.",
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "admit",
   "when": {
    "cls": "van"
   },
   "style": "speech",
   "priority": 1,
   "text": "{model} entering. Please keep the lane clear.",
   "sources": [
    "DESIGN#D9.2",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "upgrade-seen",
   "when": {
    "node": "Hips"
   },
   "style": "speech",
   "priority": 2,
   "text": "Subject has acquired hips.",
   "sources": [
    "EDIT26#3.2"
   ]
  },
  {
   "event": "upgrade-seen",
   "when": {
    "node": "Spine"
   },
   "style": "speech",
   "priority": 2,
   "text": "Subject has acquired a spine. Unscheduled.",
   "sources": [
    "EDIT26#3.2",
    "EDIT26#3.1"
   ]
  },
  {
   "event": "upgrade-seen",
   "when": {
    "node": "Carry"
   },
   "style": "thought",
   "priority": 2,
   "text": "It can carry things now. Cones. Oh no.",
   "sources": [
    "EDIT26#3.2",
    "DESIGN#D6.1"
   ]
  },
  {
   "event": "upgrade-seen",
   "when": {
    "node": "Throw"
   },
   "style": "speech",
   "priority": 2,
   "text": "Throwing was approved. By whom, I ask.",
   "sources": [
    "EDIT26#3.1",
    "EDIT26#3.2"
   ]
  }
 ]
}