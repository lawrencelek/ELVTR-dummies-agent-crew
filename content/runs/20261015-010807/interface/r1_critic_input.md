# BRIEF — Interface: HUD modules, cue key, on-screen copy and vehicle barks
- P1's HUD is a developer panel. It shows 'VIEW · Scanners in view cone', 'Drivers: Highway Code', 'Sensors: straight ahead'.
- It does not use the six HUD modules the GDD names (D10.5: BODY, CHARGE, FLEET, CONTRACT, SHIFT, RECORD).
- The cue grammar (state pip: chevron, closed ring, opening ring, red broken ring; caution triangle; spent slash) is explained nowhere in the game.
- On-screen copy is placeholder English: 'Cars dodge you: get hit head-on for the big payoff.' It is not FARSIGHT's voice.
- Vehicles never speak, although D9.3 says they speak as workers. There are no bilingual district identifiers (D9.2 anchor 2).

## Consumer contract
- drawHUD() draws hud.left in the left column and hud.right in the right column, in order. Each module prints its title and Chinese title as an eyebrow, then its rows.
- Each fact has a fixed widget and height (allowed.facts). A column must fit its budget: sum of rows + header and gap per module.
- Labels print in 10-12 px type inside a 216-unit column. Keep them short.
- cueKey prints on the pause screen beside the menu, each line next to the real glyph the field uses.
- Copy strings replace the P1 literals with the same role. {placeholders} are filled by the renderer.
- Barks show for proto.ui.barkSeconds as a tag beside the car named by the event. At most one bark per car, and none within proto.ui.barkCooldown of the last.
- Sim event fields: impact {model, cls, zone, closing, angle, assessed, lost, carState, bait, lunging, stopped, learnedStandoff}; touch-spent {car}; honk {car, at: 'body' or a cone id}; commit {car, man: 'shift' or 'brake', cause}; interrupt {car, by}; unstick {car, how: 'reverse' or 'replan'}; admit {car, cls, model, lane}.

# CANON

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

[ENG#10.1] (10.1 Phases and clocks)
### 10.1 Phases and clocks
| Phase | Simulation | Available interaction and transition |
|---|---|---|
| Attract/start | No active run | Read short controls and contract; start fresh, or Continue only if a valid checkpoint exists |
| Active play | Advances | Move, face, lunge and use owned abilities; admission, learning and objective evaluation run |
| Pause/focus loss | Frozen | Resume explicitly; settings; truthful checkpoint/ending commands |
| Hit feedback | Frozen for declared hit-stop | Present an already committed outcome; do not commit it again |
| Write-off/report | Frozen | Show body result; continue to shop only if nonterminal |
| Shop | Frozen | Purchase or save; confirm return; replace body if due |
| Stage closing | Traffic/recovery only; Body frozen | Cut admissions, drain safely, then report/purchase/normalise into checkpoint phase |
| Ending/results | No advancing run | Show outcome, eligible record and replay/reset |
Gameplay clocks use simulation time during active play; stage closing/replacement recovery advance only traffic/recovery while Body/resource clocks pause (§§8.5/10.4). UI animation and the unattended-session watchdog use a separate real-time clock. Reports and shops contribute to measured total interaction time even though the world is frozen. Do not tune to ten minutes by omitting time spent in menus.
On focus loss, pause the simulation and require explicit Resume. In exhibition mode, 60 seconds without meaningful input triggers a 15-second visible resume warning, then an unranked abandonment reset. The watchdog covers pause, shop and results as well as active play. Filter controller drift so it does not hold a session open. Attendants can extend or disable the watchdog for access needs. It never awards Non-compliant status or submits an abandoned score.

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

[BRIEF#P1.3] (P1.3 Visibility rule — prediction ahead only)
## P1.3 Visibility rule — prediction ahead only
- **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp.
- **Inside the view cone only:** Forward sensor rectangle, side sensor arcs, predicted path.
- **View cone:** `sensing.coneWidth` 90°, reach `sensing.coneReach` 900. Follows facing.
- **State pip:** Chevron = intention. Closed ring = committed. Opening ring = expiring. Red broken ring = interrupted.
- **A/B toggle:** `proto.zonesEverywhere` shows all zones. Compare both conditions.

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

[DESIGN#D10.4] (D10.4 Reach and legibility (§4.4))
### D10.4 Reach and legibility (§4.4)
The starting reach treatment is a restrained nonnumeric mark visible during ordinary movement. It predicts current straight-lunge reach and static blocking geometry. It does not promise a collision with a moving car. During the action the trace shows its snapshotted path; Spine may steer away from the initial projection.
Compare this treatment with wear animation alone. Keep the least intrusive version that passes fresh/worn prediction tests. There is no categorical prohibition on a predictive mark.
Reference type uses 24-unit cap height for model IDs/readouts, 16 for secondary labels and 9 for deliberate texture. These are trial values, not assurances of legibility at a distance. Name the actual display and input hardware before release testing. Evaluate the planned 1.5–2.5 m range, motion, cue overlap and high-contrast mode. Allow essential marks to displace texture or decorative frame content.

[BRIEF#P1.2] (P1.2 Scope)
## P1.2 Scope
| In | Out |
|---|---|
| Full baseline locomotion, lunge, wear, battery | Checkpoints, stage closing, records, initials |
| Torso branch: Hips → Spine | Head, Legs, Battery branches; Neck; Hold on |
| Arms branch: Carry → Throw | Release identity, byte hashes, eligibility |
| Sedan and Van, one model each | Moods, extra classes, cross-model anything |
| Three simple levels: Straight, Barrier, Corner | Final art, voice, bilingual copy |
| Velocity damage, zones, one-use allowance | Pending-cone ledger, replacement recovery phase |
| Write-off → report → shop → new chassis | Kiosk watchdog, technical-interruption states |
| Licensed, Failed test, Non-compliant endings | Swept time-of-impact solver (substeps instead) |
| Live tuning panel, milestone log, trace export | Learning (toggle only; default off — P2 candidate) |

[LOG#P1.8] (P1.8 — Close stop, learned stop line, unsticking)
## P1.8 — Close stop, learned stop line, unsticking
**Build:** `dummies_p1.html` v9 · 14 Oct 2026 · Spec: `DUMMIES_Driver_Behaviour.md` DB1a, DB4a, DB4b.
- **Close stop:** Cars stop 4.1 m from the dummy (`proto.standoffDistance` 50). Inside lunge reach.
- **Learned stop line:** A hit on a stopped car pushes that model back 2.9 m (`proto.learn.standoffStep` 35). Cap 15.6 m (`proto.learn.standoffMax` 190). Memory lasts the campaign.
- **HUD:** FLEET shows each model's stop distance. Red once learned. A toast names the change.
- **Slow pass from close:** The patient pass pulls out steeply at walking pace.
- **Head-on rule:** A car never drives toward a car coming head-on in its lane. It stops and waits.
- **Wrong side gives way:** After 3 s head-on (`traffic.deadlockTimeout`), the car in the oncoming lane reverses to 11.5 m of room, then returns. White reversing lights.
- **Watchdog:** A car stopped 3 s with a plan but no reason to wait drops the plan and drives on.
- **Right-hand traffic:** Spec only. The sim already kept right.

[DRIVER#DB4a] (DB4a Stop distance and learning)
### DB4a Stop distance and learning
- **Base:** `proto.standoffDistance` 50 u ≈ 4.1 m, nose to dummy centre. A real 2–5 m stop.
- **Exposure:** The stopped car sits inside lunge reach (177 u). Lunging at it is allowed.
- **Strike:** Weak. The dummy's own speed caps at `proto.dummyStrikeSpeed` 100, so a hit lands ≈ 53.
- **Learning:** Each hit on a stopped or stopping car moves that model's stop line back by `proto.learn.standoffStep` 35 u ≈ 2.9 m.
- **Cap:** `proto.learn.standoffMax` 190 u ≈ 15.6 m. Four hits put a model beyond lunge reach.
- **Scope:** Per model: SEDAN-01 and VAN-02 learn apart. Each car keeps the value it had on entry.
- **Memory:** Carries across all three roads of a campaign.
- **Cue:** HUD FLEET shows each model's stop distance in metres. Red once it has learned.
- **Toggle:** `proto.learn.standoffEnabled` 1.

[LOG#P1.7-observations] (P1.7 observations)
## P1.7 observations
**Build seen:** `dummies_p1.html` v8 · 14 Oct 2026
| ID | Observation | Response | Status |
|---|---|---|---|
| O1.26 | The Highway Code must reflect right-side driving. Values are a starting point. | Keep-right mapping, Driver DB1a. All values marked Trial. | Addressed |
| O1.27 | Move the stop toward a real 2–5 m. Accept lunges at stopped cars, but cars then learn to keep more distance. | 4.1 m stop; per-model learned stop line | Addressed (awaiting replay) |
| O1.28 | A cone stopped a car; a van swerved around it. A drone cleared the cone. The car drove on; the van stayed stuck. | Head-on deadlock found. Reverse-and-return plus watchdog. | Addressed (awaiting replay) |

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

[DESIGN#D9.1] (D9.1 The subject and the contract (§3.1))
### D9.1 The subject and the contract (§3.1)
- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.
Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

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

[DESIGN#D11.1] (D11.1 Coherent fallback and expansion protection (§12.5))
### D11.1 Coherent fallback and expansion protection (§12.5)
The slice is already the small version: one level, two models and two meaningful branches. Cut decorative scenery, optional voice lines and extra vehicle variety before cutting the first choice, its follow-on development, observable adaptation, readable feedback, access needs or closure. If the active profile must change, publish a new complete profile with revised objectives, credits, schedule and tests. A two-level fallback cannot inherit an unrelated fifteen-body quota by accident.
Keep expansion cheap through versioned profiles, content IDs, explicit surface/sensor flags, owned-upgrade derivation, a phase-aware menu flow and tested checkpoints. Do not build all future environments, menus or features merely to demonstrate modularity. The immediate architectural proof is that a small second-stage fixture and an alternative profile can be added without duplicating core rules.

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

[ENG#6.4] (6.4 Cars learn only from player hits)
### 6.4 Cars learn only from player hits
**User decision:** cones do not train cars. A cone may divert or stop a vehicle, but that interaction never creates a learning update. A later positive-health-loss collision between that car and the dummy may train it solely because it was a player hit. No cone/direct/bait attribution or causal-encounter classifier is needed in V29.
Each unique first positive-health-loss player contact for an appearance increments its model's player-detection range by `learning.playerHitStep` of baseline, capped at `learning.playerHitCap`. At current values: base 320, +25.6 per applied update, maximum 448 after five updates. No minimum hit size applies. Zero-health-loss contact, repeated event, spent appearance, environmental/cone contact and an attempted update at cap do not train.
Only future appearances read the new model value; existing appearances keep their admission snapshot. Other parameters, including cone look-ahead, braking, speed and commitment timing, do not secretly learn. Cross-model sharing is off. This simple rule intentionally replaces V27's multi-approach adaptation; whether it produces a recognisable interesting response is an open human-playtest question.
With five possible effective updates, notches use applied-count thresholds 0/1/3/5 for 0/1/2/3 notches. Appearance tags display the admission snapshot; a report may show the separately labelled model record. The final threshold changes from six to five because six increments are no longer reachable in this single capped channel.
Log unique hit ID, appearance/model ID, health lost, old/new applied count and old/new range. A report must not claim the car learned from a cone or inferred strategy. The first explanatory adaptation debrief is withheld until the test observer has recorded a response or non-response during a changed appearance's detection/commitment encounter. The engine records `changedEncounterObserved`; the natural-visit test records the player's behaviour before explanation. Admission alone does not unlock the explanatory copy. Persist the disclosure flag for checkpoints.

[DESIGN#D10.3~2] (D10.3 Information taxonomy (§4.3))
Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.
Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

[DESIGN#D6.2] (D6.2 Environment)
### D6.2 Environment
- **Surfaces:** Tarmac and pavement only. Shoulders are pavement. Kerbs and stripes add no mechanics.
- **Structures and props:** Barriers, fixed crates, cones.
- **Sensor blocking:** Van, barrier and crate block car and player-diagnostic rays. Sedan and cone don't.
- No mask hides an actor, commitment or spent cue.
- No holes, low-grip traps, multiplier plates or elevated routes in the slice.
- Moving a cone can never seal every recovery route.
- Exact contracts: Engineering §7.2.

[DESIGN#D3.1] (D3.1 Becoming human)
### D3.1 Becoming human
- The dummy starts limited. Each node returns one human freedom.
- Five body branches organise the tree: Head, Torso, Legs, Arms, Battery.
- The five parts are a metaphor, not a literal count of degrees of freedom.
- Each branch has one foundation and two follow-on options.
- Bought nodes persist across chassis for the run. Subject identity persists too.
- No node adds health, armour or automatic repair.
- Every offered node needs a useful encounter. Measure its advantage against the unupgraded dummy.
- The active profile decides which nodes exist and their prices. Unavailable nodes never appear purchasable.

[DESIGN#D2.3] (D2.3 The first upgrade changes how you play)
### D2.3 The first upgrade changes how you play
- The dummy starts with limited movement and few ways to affect traffic.
- Every purchase returns a useful freedom.
- Choice starts at the first shop: several affordable alternatives, distinct immediate uses, clear opportunity cost.
- The slice shows a meaningful part of becoming human. It does not restore every sense and movement.
- No offered upgrade adds health, armour or automatic repair.
- **Fails if:**
  - Only one opening is credible.
  - Buying an upgrade causes an involuntary downgrade.
  - Both openings produce effectively the same behaviour.
  - An owned ability has no useful encounter.
  - The baseline feels broken rather than characterful.

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[DESIGN#D4.1] (D4.1 Identity and states (§5.1))
### D4.1 Identity and states (§5.1)
The subject is earnest, stiff and clanky. Its personality is expressed through movement and repeated bodily expenditure. The same subject record and bought abilities continue through fresh chassis.
The reference body footprint is 26 units across. The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. Carry loosens the arms visibly; Hips changes the rhythm of reorientation. Wear changes outline and lean without hiding facing.
Active states are idle, moving, counter-braking/coasting, lunging, recovering, carrying and written off. Falling, jumping and attachment states are retained for gated expansion. Animation expresses the authoritative state; it cannot quietly change collisions, action duration or input acceptance.

[ENG#7.4] (7.4 Expansion environments)
### 7.4 Expansion environments
Road, Junction and Roundabout remain the intended progression of traffic situations. The slice does not require all three. Each expansion stage needs a distinct tactical purpose, a stage quota, a finite opportunity budget and a tested upgrade-coverage matrix. Junction right-of-way and roundabout entry are explicit authored traffic rules; new intersections do not inherit a claim of safety from straight-road tests.
Terrain expansion retains pavement/kerbs, grass/hedges, gravel, puddles, oil, mud, launch mats, impact plates and speed bumps as candidate content. Each surface declares separate player movement, lunge, car speed, braking, sensing and score effects. A visual material cannot acquire implicit physics. Only profile-enabled surfaces affect a run. The legacy surface values require reconciliation and testing before promotion; they are not active slice settings.
An impact plate's proposed 1.5 multiplier applies to score only, never health loss or credits. A launch mat modifies the declared reach calculation and must use the same prediction renderer. Slippery terrain requires braking/commitment witnesses. Gap traversal requires Jump's full-footprint landing rules; Jump cannot bypass an ordinary solid wall by treating it as a gap. Falling must specify its recovery position, elapsed simulation cost, body consequences and finite-traffic consequences before being offered.
Height bands and sensor masks remain data fields so cover and future traversal do not require a rewrite. Multi-deck navigation, scrolling worlds, weather and fog are expansion-gated. They must preserve critical cues and give an actual tactical return for their production and testing cost.

[ENG#10.4~1] (10.4 Stage closing and checkpoint continuation)
### 10.4 Stage closing and checkpoint continuation
The one-stage slice has no mid-run save. Pause offers Quit to last checkpoint with exact loss disclosed, or End run/Cancel if none exists. Save and quit is immediate only at `READY_FOR_NEXT_STAGE`; Continue is hidden without a valid compatible checkpoint. Terminal results create no continuation checkpoint.
For a nonterminal stage quota/final-condition event, first complete its entire collision tick under §8.4. Then enter `STAGE_CLOSING`:
1. Cut new admissions. Mark the remaining outgoing-stage slots explicitly `cancelled-stage-complete`, not admitted, exited or failed opportunities. This cancellation is permitted only after that stage's displayed contract is complete.
2. Freeze dummy controls, health, charge and refill-delay state. End transient action/gesture state. Resolve any held cone by §8.5. After the completed collision tick, visibly withdraw the test subject into the noninteractive report phase and remove its traffic collider; this is an explicit completed-stage transition, not an invisible escape during active play. Wreck/debris is visual only. If a new body is due, defer instantiation until the later replacement step.
3. Existing traffic drains under normal collision-safe traffic rules. Traffic and a closing timer advance; body/resource clocks remain paused. No damage, score, learning, credits or additional write-offs can be earned during closing. No new vehicle appears. Preserve physical safety and prop conservation. Existing cars must leave legally, not disappear to manufacture throughput.
4. Attempt bounded safe traffic recovery when blocked. If traffic/reservations/pending releases remain after `run.stageClosingTimeout` (trial 30 s), end as a technical interruption, without creating a checkpoint. This is a test failure, not a permitted routine shortcut.
5. Once clear, complete the single combined report/purchase flow, replace a written-off body if due, and normalise outgoing props into the outgoing-stage ledger before unloading that completed world. No props transfer or duplicate into the next stage; its own authored prop IDs are stage-qualified. Preserve surviving health/charge/refill delay; clear velocity, action, attachment and carried-prop state identically in uninterrupted/restored paths.
6. Enter `READY_FOR_NEXT_STAGE` before any incoming vehicle is admitted. Save a complete validated snapshot atomically. Restore into paused review; only explicit Resume begins the next stage. Mark continued runs separately for records.

[JUICE#J4] (J4 Intensity rules (Proposed))
## J4 Intensity rules (Proposed)
- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.

[LOG#P1.6] (P1.6 — Standoff stop)
## P1.6 — Standoff stop
**Build:** `dummies_p1.html` v7 · 14 Oct 2026 · Addresses O1.22.
- **Rule:** A car never swerves past the dummy in its lane. It stops with its nose `proto.standoffDistance` from the dummy, then waits.
- **Why 190:** Lunge contact needs `movement.lungeDistance` + `body.radius` = 177. The standoff leaves 13 units spare.
- **Braking:** As late as comfort allows; hard braking if needed. If the dummy appears inside the standoff, the car brakes as hard as it can.
- **Holding:** A stopped car stays put while the dummy remains in its lane, even if the dummy walks closer.
- **Cue:** A red STOP line marks where the car will halt.
- **Honk:** After `proto.honkSeconds` held by the dummy.
- **Cones:** Unchanged. Cars still swerve around or stop at cones.
- **Swerves:** Now happen only for cones.
| ID | Value | Unit |
|---|---:|---|
| `proto.standoffDistance` | 190 | world units, car nose to dummy centre |
- **Ways to land a hit now:**
  - Enter a car's lane inside its standoff, e.g. from a pillar's blind spot.
  - Lunge into a car from beside the road.
  - Lunge at a stopped car (weak: about 53).

# VALIDATOR
- none

# CONTENT

{
 "params": [
  {
   "id": "proto.ui.barkSeconds",
   "value": 2.5,
   "unit": "s",
   "purpose": "How long a vehicle bark tag stays beside its car, readable at exhibition volume.",
   "sources": [
    "DESIGN#D9.4",
    "DESIGN#D9.3"
   ]
  },
  {
   "id": "proto.ui.barkCooldown",
   "value": 4,
   "unit": "s",
   "purpose": "Minimum gap after the last bark before another may show, so lines do not stack.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.4"
   ]
  }
 ],
 "hud": {
  "left": [
   {
    "module": "BODY",
    "title": "BODY",
    "zh": "车体",
    "review": "pending",
    "rows": [
     {
      "fact": "subject.chassis",
      "label": "Chassis"
     },
     {
      "fact": "body.difficulty",
      "label": "Rating"
     },
     {
      "fact": "body.health",
      "label": "Integrity"
     },
     {
      "fact": "body.reach",
      "label": "Lunge reach"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DESIGN#D10.4",
     "DESIGN#D9.1"
    ]
   },
   {
    "module": "CHARGE",
    "title": "CHARGE",
    "zh": "电量",
    "review": "pending",
    "rows": [
     {
      "fact": "body.charge",
      "label": "Lunge charge"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DESIGN#D10.3~1"
    ]
   },
   {
    "module": "FLEET",
    "title": "FLEET",
    "zh": "车队",
    "review": "pending",
    "rows": [
     {
      "fact": "fleet.models",
      "label": "Stop distance"
     },
     {
      "fact": "fleet.note",
      "label": "Marked: learned stop"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DRIVER#DB4a",
     "LOG#P1.8",
     "DESIGN#D10.2"
    ]
   }
  ],
  "right": [
   {
    "module": "CONTRACT",
    "title": "CONTRACT",
    "zh": "合同",
    "review": "pending",
    "rows": [
     {
      "fact": "contract.road",
      "label": "Test road"
     },
     {
      "fact": "contract.writeOffs",
      "label": "Write-offs"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DESIGN#D9.1"
    ]
   },
   {
    "module": "SHIFT",
    "title": "SHIFT",
    "zh": "班次",
    "review": "pending",
    "rows": [
     {
      "fact": "shift.admitted",
      "label": "Admitted"
     },
     {
      "fact": "shift.onRoad",
      "label": "On road"
     },
     {
      "fact": "shift.next",
      "label": "Next admission"
     },
     {
      "fact": "clock.active",
      "label": "Active time"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "ENG#6.5",
     "ENG#10.1"
    ]
   },
   {
    "module": "RECORD",
    "title": "RECORD",
    "zh": "记录",
    "review": "pending",
    "rows": [
     {
      "fact": "record.points",
      "label": "Points"
     },
     {
      "fact": "record.credits",
      "label": "Body credits"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DESIGN#D9.1"
    ]
   }
  ]
 },
 "cueKey": [
  {
   "cue": "intention",
   "label": "Chevron",
   "meaning": "The car is reacting. Its plan is not fixed yet.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "committed",
   "label": "Closed ring",
   "meaning": "The car has fixed its route and will follow it.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "expiring",
   "label": "Opening ring",
   "meaning": "The commitment is ending. Less than a full action window remains.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "interrupted",
   "label": "Red broken ring",
   "meaning": "The car has braked for safety. Its route is no longer reliable.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "caution",
   "label": "Caution triangle",
   "meaning": "The car is slowing past a nearby dummy.",
   "sources": [
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "braking",
   "label": "Brake marks",
   "meaning": "The car is slowing down.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "spent",
   "label": "Spent slash",
   "meaning": "This appearance cannot award another scoring impact.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "honk",
   "label": "HONK bubble",
   "meaning": "The car has been blocked too long and complains.",
   "sources": [
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "blind",
   "label": "Sensor zone",
   "meaning": "Marks where this car can sense. Outside it, it cannot.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "view",
   "label": "View cone",
   "meaning": "The wedge where the dummy resolves sensor information.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  }
 ],
 "copy": {
  "intro": [
   "FARSIGHT TEST ROAD {road} OF {roads}: {roadName}.",
   "Contract: {quota} bodies. {difficulty} chassis, rated {health}."
  ],
  "denied": {
   "lunge": "Lunge declined. Charge below requirement.",
   "pickup": "Pickup declined. No cone in reach, or Carry not installed.",
   "drop": "Drop declined. No cone carried.",
   "throw": "Throw declined. Not installed, or no cone carried."
  },
  "toast": {
   "touch-spent": "Appearance already spent. No score recorded.",
   "drone-dispatch": "Maintenance drone dispatched. Obstruction cleared.",
   "purchase": "{node} installed. Approved by FARSIGHT.",
   "learn-standoff": "{model} record updated.",
   "refusal-locked": "Modification locked. Prerequisite not installed."
  },
  "report": {
   "eyebrow": "FARSIGHT · TEST COMPLETION REPORT",
   "title": "Chassis {chassis} written off",
   "line": "Test {n} of {quota}. Assessed value: {points}.",
   "cleared": "{roadName} certified. Next: {nextRoad}, target {nextQuota}. Points: {points}.",
   "credit": "Body credit issued: {credits}.",
   "continue": "Continue to body services"
  },
  "shop": {
   "eyebrow": "FARSIGHT · BODY MODIFICATION",
   "title": "Approved modifications",
   "deploy": "Deploy replacement body",
   "bank": "Balance: {credits} credits",
   "nodes": {
    "hips": "Hips · Torso. Opens Spine.",
    "spine": "Spine · Torso. Steer the lunge.",
    "carry": "Carry · Arms. Hold a cone.",
    "throw": "Throw · Arms. Throw the cone."
   }
  },
  "endings": {
   "Licensed": "Licensed. Contract complete. Certification does not imply permission to drive.",
   "Failed test": "Failed test. Contract unmet. Replay approved.",
   "Non-compliant": "Non-compliant. Record filed for review. Replay available."
  },
  "frame": {
   "district": "SHENZHEN SMART CITY · NEW ECONOMIC ZONE · TEST ROAD",
   "districtZh": "深圳智慧城市 · 新经济区 · 测试道路",
   "review": "pending"
  },
  "sources": [
   "DESIGN#D9.1",
   "DESIGN#D9.2",
   "DESIGN#D9.3",
   "DESIGN#D10.5",
   "DESIGN#D1",
   "LOG#P1.8",
   "BRIEF#P1.2"
  ]
 },
 "barks": [
  {
   "event": "admit",
   "when": {},
   "text": "{model} on shift. Deadline: yesterday.",
   "sources": [
    "DESIGN#D9.3",
    "ENG#6.5"
   ]
  },
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "text": "{model} was stationary. Please log that.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB4a"
   ]
  },
  {
   "event": "impact",
   "when": {
    "learnedStandoff": true
   },
   "text": "That one goes on my record.",
   "sources": [
    "DESIGN#D9.3",
    "ENG#6.5"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "text": "No accident detected. Please improve.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "event": "honk",
   "when": {
    "at": "body"
   },
   "text": "Your freedom remains in progress. Kindly move.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "honk",
   "when": {},
   "text": "{model} is on schedule. Please clear the lane.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "commit",
   "when": {
    "man": "brake"
   },
   "text": "{model} yielding. Brake logged.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "commit",
   "when": {
    "man": "shift"
   },
   "text": "{model} changing lane. Policy permitting.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "interrupt",
   "when": {},
   "text": "{model} braking. Someone has a deadline.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "reverse"
   },
   "text": "{model} reversing. Making room, not conceding.",
   "sources": [
    "DESIGN#D9.3",
    "LOG#P1.8"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "replan"
   },
   "text": "{model} replanning. Please do not report the delay.",
   "sources": [
    "DESIGN#D9.3",
    "LOG#P1.8"
   ]
  }
 ]
}