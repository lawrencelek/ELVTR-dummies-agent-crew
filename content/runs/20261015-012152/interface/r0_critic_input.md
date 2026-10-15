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

## Voices (who says what)
- FARSIGHT (all UI copy: banner, denials, toasts, report, shop, endings, frame): The corporate terminal. Polite, procedural, optimistic on the surface; dry register (D9.2, D10.1). It states facts the run logged.
- Vehicles (barks only): Workers: deadlines, rank, fear of retraining, resentment, pride. Corporate politeness barely contains personality (D9.3). A vehicle talks about its own job and the event just logged, never in FARSIGHT's slogans.

## Copy slots (where each string appears)
- intro[0]: Banner line 1 over the field for 4 s at the start of each road: which road, and how many write-offs clear it.
- intro[1]: Banner line 2: difficulty and body health, plus the one thing to do. Not a strategy hint.
- denied.lunge: Toast when A is refused: no charge, or still recovering. Refusals cost nothing.
- denied.pickup: Toast when B is pressed with Carry owned but no cone within reach.
- denied.drop: Toast when a held cone cannot be placed: no legal room ahead.
- denied.throw: Toast when a held cone cannot be thrown: no legal room ahead.
- toast.touch-spent: Toast when the dummy touches a car whose allowance is already spent: solid, no damage, no points.
- toast.drone-dispatch: Toast when a FARSIGHT drone flies in to move a cone that has blocked a car for 5 s.
- toast.purchase: Toast after a node is bought in the shop.
- toast.learn-standoff: Toast when a hit on a stopped car makes that model stop further back from now on. P1.8 decided this toast names the change.
- toast.refusal-locked: Toast when the visitor chooses 'Refuse testing' in the pause menu before completing one body.
- report.eyebrow: Small caps label above the write-off report.
- report.title: Headline of the report for a non-final write-off.
- report.line: Summary line: write-off n of the road's quota, and points this body.
- report.cleared: Summary line instead, when this write-off clears the road and the next road follows.
- report.credit: Line confirming one body credit was granted, with the new balance.
- report.continue: Prompt to press A to go on to the shop.
- shop.eyebrow: Small caps label above the shop.
- shop.title: Shop headline: modifications install on the next chassis.
- shop.deploy: Button when no credits remain: leave the shop and deploy the next chassis.
- shop.bank: Button when credits remain unspent: keep them for later and deploy the next chassis.
- shop.nodes.<node>: The node's action description under its name: what the visitor can now do (D3.9). Max two short sentences.
- endings.<kind>: Subtitle under the ending title (LICENSED, FAILED TEST, NON-COMPLIANT).
- frame.district: Header strip beside the FARSIGHT logo, always visible: district and test identifier.
- frame.districtZh: The same identifier in Chinese, shown after it.

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

[DESIGN#D9.2] (D9.2 A specific fictional district (§3.2))
### D9.2 A specific fictional district (§3.2)
The slice needs three perceptible anchors:
1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.
These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

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

[DESIGN#D3.9] (D3.9 Shop)
### D3.9 Shop
- Shows only profile-enabled nodes.
- Each node shows cost, prerequisite, owned state and credit balance.
- Each node shows a short action description and a looping preview of the changed control or movement.
- A locked follow-on names its prerequisite. An unaffordable node shows the exact shortfall.
- Show what each purchase enables now and what it postpones.
- Teach the two B gestures in the shop and device prompt: tap to throw, hold to drop.
- No decorative expansion node appears purchasable.
- Purchase transaction: Engineering §9.3.

[DESIGN#D8] (D8 The Run)
## D8 The Run
- **Phases:** Attract/start → active play → hit feedback → write-off report → shop → active play → ending.
- Menus freeze the simulation. They still count toward interaction time.
- **Terminal priority:** Success, then confirmed withdrawal, then exhausted opportunities.
| Outcome | Meaning | Next step |
|---|---|---|
| Licensed | Displayed contract completed | Closure, score and invitation to try another opening |
| Non-compliant | Player explicitly refuses continued testing | Authored refusal ending and separate record category |
| Failed test | Finite useful traffic is exhausted before completion | Clear result, explanation and quick retry |
| Abandoned | Visitor leaves or chooses to end without an authored refusal | Reset without leaderboard submission |
| Technical interruption | The system cannot continue safely/correctly | Explain briefly, log cause, reset unranked |
- **Refusal:** Available after one completed body. Needs a second confirmation. A choice, not a punishment.
- **Failed test:** All 40 slots admitted; every appearance spent or exited; contract incomplete.
- A lethal last hit below quota fails. No credit, shop or replacement.
- **Exhibition:** Focus loss pauses. `kiosk.idleSeconds` 60 idle → `kiosk.warningSeconds` 15 warning → unranked reset.
- Attendants can extend or disable the watchdog for access needs.
- The one-stage slice has no mid-run save.
- Exact phases, clocks and checkpoints: Engineering §10.

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

[DESIGN#D9.4] (D9.4 Sound (§3.4))
### D9.4 Sound (§3.4)
Factory hum, engines, restrained synthetic music and clinical announcements make the city sound operational even when the body fails. The dummy creaks, clanks, squashes and recovers with physical weight.
Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. Gameplay cues take priority over ambience and have visual equivalents. Voices are optional; text-first barks must work at exhibition volume.
Reports and purchases can use presentation-time sound while simulation is frozen. No sound callback can award damage, currency or learning. There is no automatic repair warning in the slice because automatic repair is disabled.

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

[LOG#P1.7] (P1.7 — Highway Code driver)
## P1.7 — Highway Code driver
**Build:** `dummies_p1.html` v8 · 14 Oct 2026 · Spec: `DUMMIES_Driver_Behaviour.md`.
- **Real driving numbers:** 0.67 s reaction, 3 m/s² comfortable braking, 6.5 m/s² emergency braking, 3.5 m/s² acceleration, two-second gap, 46 m look-ahead (DB2).
- **Near a visible dummy:** Covers the brake and slows to 15 mph.
- **Dummy in the road:** Stops beyond lunge range and waits. After 8 s, passes at 10 mph with 2 m clearance, if the oncoming lane is clear.
- **Too close to stop:** Brakes hard in a straight line. No emergency swerve.
- **Horn:** Only at the dummy, as a danger. At cones the car flashes its lights instead.
- **Hidden dummy:** A dummy behind a pillar is not seen. The car keeps full speed.
- **New cue:** A grey warning triangle on the roof marks a cautious car.

[ENG#9.3] (9.3 Shop and purchase transaction)
### 9.3 Shop and purchase transaction
The shop presents only profile-enabled nodes. Show cost, prerequisite, owned state, credit balance, a short action description and a preview of the changed control or movement. A locked follow-on names its prerequisite; an unaffordable node shows the exact shortfall. No decorative expansion node appears purchasable.
Purchases validate the current phase, node availability, prerequisites, ownership and balance, then atomically subtract credits and add the owned ID. Repeated activation cannot spend twice. Derive effective body values from immutable base data and the complete owned set; never stack an effect by replaying purchase messages. Commit the resulting values before returning to play.
Replacing a written-off body restores its health and charge to the effective new-body limits. Buying a future capacity upgrade between stages with a surviving body changes the limit and clamps existing charge; it does not grant a free refill unless the profile explicitly says so. Health and charge are not implicitly reset at every menu.

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

[DESIGN#D10.3~2] (D10.3 Information taxonomy (§4.3))
Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.
Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

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

[DESIGN#D10.1] (D10.1 Visual register (§4.1))
### D10.1 Visual register (§4.1)
**An instrumented city inside a friendly corporate terminal.**
The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.
The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.
The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.
References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

[ENG#7.4] (7.4 Expansion environments)
### 7.4 Expansion environments
Road, Junction and Roundabout remain the intended progression of traffic situations. The slice does not require all three. Each expansion stage needs a distinct tactical purpose, a stage quota, a finite opportunity budget and a tested upgrade-coverage matrix. Junction right-of-way and roundabout entry are explicit authored traffic rules; new intersections do not inherit a claim of safety from straight-road tests.
Terrain expansion retains pavement/kerbs, grass/hedges, gravel, puddles, oil, mud, launch mats, impact plates and speed bumps as candidate content. Each surface declares separate player movement, lunge, car speed, braking, sensing and score effects. A visual material cannot acquire implicit physics. Only profile-enabled surfaces affect a run. The legacy surface values require reconciliation and testing before promotion; they are not active slice settings.
An impact plate's proposed 1.5 multiplier applies to score only, never health loss or credits. A launch mat modifies the declared reach calculation and must use the same prediction renderer. Slippery terrain requires braking/commitment witnesses. Gap traversal requires Jump's full-footprint landing rules; Jump cannot bypass an ordinary solid wall by treating it as a gap. Falling must specify its recovery position, elapsed simulation cost, body consequences and finite-traffic consequences before being offered.
Height bands and sensor masks remain data fields so cover and future traversal do not require a rewrite. Multi-deck navigation, scrolling worlds, weather and fog are expansion-gated. They must preserve critical cues and give an actual tactical return for their production and testing cost.

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

[DESIGN#D7] (D7 Impact and Scoring)
## D7 Impact and Scoring
- **User decision:** Actual motion replaces the fixed 5× lunge multiplier.
- Damage uses relative closing speed along the contact normal, sampled before response.
- A moving dummy can damage against a stationary car.
- Co-moving, tangential or separating motion does no damage.
```text
assessedImpact = min(damage.baseImpact × zoneFactor × relativeMass
                     × closingSpeed / damage.referenceSpeed, damage.bodyHealth)
```
- `relativeMass` comes from `vehicles.sedan.mass` / `vehicles.van.mass`.
| Zone | Factor ID | Value |
|---|---|---:|
| Front | `damage.zone.front` | 1.00 |
| Front diagonal | `damage.zone.frontDiagonal` | 0.60 |
| Side | `damage.zone.side` | 0.30 |
| Rear diagonal | `damage.zone.rearDiagonal` | 0.15 |
| Rear | `damage.zone.rear` | 0.05 |
| Front contact with a Sedan (Trial values) | Assessed |
|---|---:|
| Stationary dummy; Sedan approaching at 138 | 100 |
| Dummy at 69 into a stationary Sedan | 50 |
| Early fresh lunge (1,148) into a Sedan at 138 | 931.884 → capped 800 |
| Late lunge (246) into a Sedan at 138 | 278.261 |
- One early fresh lunge can write off a full body. Balance is open.
- Any positive hit that exhausts remaining health kills. No finishing threshold.
- **Allowance:** The first positive-damage contact spends that appearance. Zero-damage touches don't.
- **Spent cars:** Stay solid. Show a stamped/slashed mark. Give no damage or reward.
- **Score:** Impact points equal assessed impact on slice surfaces. `rewards.writeOff` 2,500 per completed body.
- **Finishing excess:** Counts once. 100 health left, 500 impact: lose 100, score 500 + 2,500.
- Health loss and assessed impact are recorded separately.
- Points never become credits. Score-farming and delayed finishes are under investigation (Evaluation T04).
- **Held cone at write-off:** Drops at the destruction point if valid. Otherwise an authored recovery point. Never deleted or duplicated.
- Exact accounting: Engineering §8.

[ENG#10.2] (10.2 Objective, finite opportunities and ending priority)
### 10.2 Objective, finite opportunities and ending priority
At the start, show the contract: complete five bodies in this test. Keep body progress and the finite traffic budget readable during play. There is no secret sixth body and no forced ten-minute countdown. All 40 scheduled appearances are potential opportunities; the run ends early on success. Exhaustion is evaluated after all contacts in the current tick have been resolved: every scheduled slot has been admitted and every admitted appearance is either spent or has exited. If the objective is still incomplete, end as Failed test immediately; a spent car need not drive off-screen before a result can appear. Unspent zero-damage touches remain possible opportunities. Do not silently cancel queued slots or count spent appearances as exited in telemetry. A lethal last opportunity that does not complete the contract is therefore a terminal failed write-off: bonus and impact points are awarded, but no spendable credit, shop or replacement body is created. A temporarily blocked queue is not exhaustion.
For a terminal tick, resolve in this order:
1. Success earned by the last valid collision.
2. Explicitly confirmed withdrawal.
3. Exhausted opportunities without success.
Technical interruption and abandonment are separate unranked outcomes. Neither is authored as evidence that the player deliberately refused the institution. Refusal becomes available after at least one completed body and requires a second confirmation. Its ending is an intentional choice, not a punishment for standing still.
| Outcome | Meaning | Next step |
|---|---|---|
| Licensed | Displayed contract completed | Closure, score and invitation to try another opening |
| Non-compliant | Player explicitly refuses continued testing | Authored refusal ending and separate record category |
| Failed test | Finite useful traffic is exhausted before completion | Clear result, explanation and quick retry |
| Abandoned | Visitor leaves or chooses to end without an authored refusal | Reset without leaderboard submission |
| Technical interruption | The system cannot continue safely/correctly | Explain briefly, log cause, reset unranked |

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

[ENG#6.5] (6.5 Recurrence, moods and voice)
### 6.5 Recurrence, moods and voice
The slice schedule is eight repetitions of **Sedan–Van–Sedan–Sedan–Van**: 40 possible appearances, 24 Sedan and 16 Van. The initial nominal admission interval is 12 active simulation seconds. The first due appearance is at stage start; legal admission can be delayed by an occupied entrance. Admission means creation at the validated 200-unit off-screen lead-in, not arrival at the visible edge. At unimpeded cruise, nominal lead-in travel is about 1.45 s for Sedan and 1.67 s for Van; turning, braking and initial footprint placement can add time. Scheduled, admitted and exited counts are distinct. A successful early ending cancels the unused remainder. No quota implies that all 40 must appear.
The schedule is deterministic and part of the versioned profile. For slot `i`, admission cannot precede `max(12 × i, previousActualAdmission + 12)` and still requires safe entry; the first slot has no previous-admission constraint. A due appearance waits for safe entry, avoiding a burst after a blockage. No opportunity disappears while queued. The last nominal admission is at 468 s (39 intervals), not 480 s. This is neither a minimum session length nor a ten-minute completion guarantee: success can cancel most of the queue. Interval, approach geometry and delay are jointly tested for ten-minute pacing and recurrence before minute five. In the unobstructed sequence, the next Sedan slot is 12–24 s later and the next Van slot 24–36 s later; the first new snapshot admitted after a learning event is the relevant return, not an already admitted car.
The same model should visibly respond to an earlier successful approach while the visitor is still playing. Standard mood removes a major confound. Additional moods are expansion content and must specify independent behaviour effects, legible cues and exact roster allocation or a declared statistical tolerance. A population percentage alone does not guarantee that a short run contains a mood.
Barks may express corporate confidence, embarrassment or bureaucratic blame. They cannot assert facts the simulation did not establish. The first report may state the observed impact and model identity, but it withholds the explanatory learned-counter message until the player has encountered the changed return. Evaluation asks the player what changed before supplying that explanation. Later reports may make the adaptation explicit.

[DESIGN#D6.2] (D6.2 Environment)
### D6.2 Environment
- **Surfaces:** Tarmac and pavement only. Shoulders are pavement. Kerbs and stripes add no mechanics.
- **Structures and props:** Barriers, fixed crates, cones.
- **Sensor blocking:** Van, barrier and crate block car and player-diagnostic rays. Sedan and cone don't.
- No mask hides an actor, commitment or spent cue.
- No holes, low-grip traps, multiplier plates or elevated routes in the slice.
- Moving a cone can never seal every recovery route.
- Exact contracts: Engineering §7.2.

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

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- none

# CONTENT

{
 "params": [
  {
   "id": "proto.ui.barkSeconds",
   "value": 2.5,
   "unit": "s",
   "purpose": "How long a vehicle bark tag stays beside its car.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.4"
   ]
  },
  {
   "id": "proto.ui.barkCooldown",
   "value": 4,
   "unit": "s",
   "purpose": "Minimum gap after any bark before the next one shows.",
   "sources": [
    "DESIGN#D9.3"
   ]
  },
  {
   "id": "proto.ui.introSeconds",
   "value": 4,
   "unit": "s",
   "purpose": "How long the road intro banner stays over the field.",
   "sources": [
    "DESIGN#D10.5",
    "DESIGN#D8"
   ]
  }
 ],
 "hud": {
  "left": [
   {
    "module": "BODY",
    "title": "BODY",
    "zh": "机体",
    "review": "pending",
    "rows": [
     {
      "fact": "subject.chassis",
      "label": "Chassis"
     },
     {
      "fact": "body.difficulty",
      "label": "Difficulty"
     },
     {
      "fact": "body.health",
      "label": "Health"
     },
     {
      "fact": "body.reach",
      "label": "Lunge reach"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DESIGN#D10.4"
    ]
   },
   {
    "module": "CHARGE",
    "title": "CHARGE",
    "zh": "充能",
    "review": "pending",
    "rows": [
     {
      "fact": "body.charge",
      "label": "Charge"
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
      "label": "Red: learned stop"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "LOG#P1.8",
     "DRIVER#DB4a"
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
      "label": "Road"
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
     "DESIGN#D8"
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
   "meaning": "The car has reacted. Its plan is not yet fixed.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "committed",
   "label": "Closed ring",
   "meaning": "The car has fixed its plan and will follow it.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "expiring",
   "label": "Opening ring",
   "meaning": "The commitment is ending.",
   "sources": [
    "BRIEF#P1.3",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "interrupted",
   "label": "Red broken ring",
   "meaning": "The car has braked for safety on its route.",
   "sources": [
    "BRIEF#P1.3",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "caution",
   "label": "Caution triangle",
   "meaning": "The car is slowing past a nearby dummy.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "cue": "braking",
   "label": "Brake marks",
   "meaning": "The car is slowing.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "spent",
   "label": "Spent slash",
   "meaning": "This car cannot award another impact.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "honk",
   "label": "HONK bubble",
   "meaning": "The car has been blocked for more than 5 s.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "cue": "blind",
   "label": "Cannot see you",
   "meaning": "The car has no sight of the dummy and keeps its speed.",
   "sources": [
    "LOG#P1.7",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "view",
   "label": "View cone",
   "meaning": "Where the dummy resolves sensor information.",
   "sources": [
    "BRIEF#P1.3",
    "DESIGN#D10.3~1"
   ]
  }
 ],
 "copy": {
  "intro": [
   "Road {road} of {roads}: {roadName}. {quota} write-offs clear it.",
   "{difficulty} body, {health} health. Press A to lunge."
  ],
  "denied": {
   "lunge": "Lunge declined: no charge, or still recovering.",
   "pickup": "Pickup declined: no cone within reach.",
   "drop": "Drop declined: no legal room ahead.",
   "throw": "Throw declined: no legal room ahead."
  },
  "toast": {
   "touch-spent": "Appearance already assessed. No damage or points recorded.",
   "drone-dispatch": "FARSIGHT drone dispatched. Obstruction relocated.",
   "purchase": "{node} installed on the next chassis.",
   "learn-standoff": "{model} now stops further back: {metres} m.",
   "refusal-locked": "Refusal becomes available after one completed body."
  },
  "report": {
   "eyebrow": "WRITE-OFF REPORT",
   "title": "Chassis {chassis} written off.",
   "line": "Write-off {n} of {quota}. {points} points this body.",
   "cleared": "{roadName} cleared. Next: {nextRoad}, {nextQuota} write-offs. {points} points this body.",
   "credit": "1 body credit granted. Balance: {credits}.",
   "continue": "Press A to continue to the shop."
  },
  "shop": {
   "eyebrow": "MODIFICATION SHOP",
   "title": "Modifications install on the next chassis.",
   "deploy": "Deploy next chassis",
   "bank": "Save {credits} and deploy",
   "nodes": {
    "hips": "Adds a hip joint. The torso can now turn.",
    "spine": "Steer a lunge away from its initial projection.",
    "carry": "Press B near a cone to pick it up. Hold B to place it.",
    "throw": "Tap B to throw a held cone. Hold B to drop it."
   }
  },
  "endings": {
   "Licensed": "Contract complete. The subject is released from testing.",
   "Failed test": "Traffic exhausted. Contract incomplete. Retry available.",
   "Non-compliant": "Continued testing refused. Refusal recorded."
  },
  "frame": {
   "district": "SHENZHEN SMART CITY · NEW ECONOMIC ZONE · TEST P1",
   "districtZh": "深圳智慧城市 · 新经济区 · 测试 P1",
   "review": "pending"
  },
  "sources": [
   "DESIGN#D9.1",
   "DESIGN#D9.2",
   "DESIGN#D10.5",
   "DESIGN#D3.9",
   "ENG#9.3",
   "DESIGN#D8",
   "LOG#P1.8",
   "DRIVER#DB4a",
   "DESIGN#D1"
  ]
 },
 "barks": [
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "text": "I was stopped. Put that in my review.",
   "sources": [
    "DESIGN#D9.3",
    "LOG#P1.8"
   ]
  },
  {
   "event": "impact",
   "when": {
    "learnedStandoff": true
   },
   "text": "Noted. {model} will stop further back.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB4a"
   ]
  },
  {
   "event": "impact",
   "when": {},
   "text": "No accident detected. Please improve.",
   "sources": [
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "text": "I have already been assessed. Please move along.",
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
   "text": "Dummy in my lane. My slot is closing.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "event": "honk",
   "when": {},
   "text": "I have been waiting a while. Deadlines exist.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "commit",
   "when": {
    "man": "shift"
   },
   "text": "Moving over. Mind my lane, please.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "event": "commit",
   "when": {
    "man": "brake"
   },
   "text": "Stopping. Please remain at a distance.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.8"
   ]
  },
  {
   "event": "interrupt",
   "when": {},
   "text": "Safety stop. I am not paid enough for this.",
   "sources": [
    "DRIVER#DB5",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "reverse"
   },
   "text": "Reversing. Wrong side, apparently. Me.",
   "sources": [
    "LOG#P1.8",
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "unstick",
   "when": {
    "how": "replan"
   },
   "text": "Plan dropped. Driving on.",
   "sources": [
    "LOG#P1.8"
   ]
  },
  {
   "event": "admit",
   "when": {},
   "text": "{model} entering lane {lane}. Deadline is tight.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.2"
   ]
  }
 ]
}