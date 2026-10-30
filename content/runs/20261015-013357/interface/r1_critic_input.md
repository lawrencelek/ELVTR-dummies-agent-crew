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

[DESIGN#D3.8] (D3.8 Active prices and sequences (§9.2))
### D3.8 Active prices and sequences (§9.2)
| Upgrade | Cost | Prerequisite | Immediate effect |
|---|---:|---|---|
| Hips | 1 | None | Faster deliberate facing changes; baseline turn rate rises from 180°/s to 360°/s |
| Carry | 1 | None | B can pick up and deliberately place a cone; movement while carrying uses the declared 0.85 factor |
| Spine | 2 | Hips | Steer during the original lunge window within its declared angle/rate limits |
| Throw | 2 | Carry | Add a velocity-inheriting throw; retain close drop through the held-B gesture |
The four-node tree costs six credits in total; four are available. The player cannot complete both branches in one slice run.
| Earned credits across the run | Legal example and opportunity cost |
|---:|---|
| 1 | Buy Hips or Carry, or bank; buying one postpones the other until another body |
| 2 | Own both base nodes, or retain one base and bank one towards its follow-on |
| 3 | Own Hips + Spine, or Carry + Throw, or both bases with one banked credit |
| 4 | Complete one branch and own the other base; alternatively bank or leave abilities unpurchased |
Hips → save → Spine → Carry and Carry → save → Throw → Hips are both affordable completed sequences. Hips → Carry → save → Spine is an affordable mixed sequence. The equivalent Carry → Hips → save → Throw is also legal. These examples are computed against the active prices; they are not promises that each sequence is balanced.
The full fifteen-node catalogue in §5 is retained as expansion design. Its legacy total of 38 is historical, not a V29 expansion economy approval. Each longer profile must provide its own body/credit budget, price table, legal sequences, first-choice alternatives and unmet opportunities. A longer tree does not excuse postponing meaningful choice beyond the first purchase.

[LOG#P1.5/pillars-and-blind-spots] (Pillars and blind spots)
### Pillars and blind spots
- **Pillars:** Flyover columns now stand at the road edge, replacing distant crates. Shadow height `proto.art.pillarHeight` 60.
- **L1:** Three north, two south, staggered.
- **L2:** Three north. The south barrier with gaps remains.
- **L3:** One in the inside of the bend, one beside the vertical leg, one at the west straight, one outside the bend.
- **Blind spots:** Pillars, barriers and vans cast sensor shadows from each car's nose. Shown inside the scanners as pale aqua wedges labelled BLIND.
- **Tactic:** Stand in a pillar's shadow and side sensors miss you. The car keeps full speed. Step out for a head-on hit.

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

[DESIGN#D4.2] (D4.2 Controls and movement (Trial))
### D4.2 Controls and movement (Trial)
- **Inputs:** Direction moves and faces. A (legs) lunges. B (arms) handles cones.
- **Walk to run:** `movement.walkSpeed` 81 → `movement.runSpeed` 162 over `movement.rampSeconds` 1 s.
- **Buildup reset:** Stop, counter-brake or lunge resets run buildup.
- **Turning:** `movement.turnRate` 180°/s. Misalignment beyond `movement.alignThreshold` 30° slows translation to `movement.turningSpeedFraction` 0.6.
- **Release:** Velocity coasts to zero over `movement.stopSeconds` 0.25 s.
- **Counter-press:** Input beyond `movement.counterPressAngle` 135° from velocity brakes first, scaled by `movement.counterPressStop` 0.4.
- **Carrying:** Ground speed × `upgrades.carrySpeed`. Lunge speed is unaffected.
- Exact rules and arbitration: Engineering §5.2.

[ENG#6.2~1] (6.2 Sensing, intention and commitment)
### 6.2 Sensing, intention and commitment
Vehicles sense using a forward rectangle starting at the nose, with length given by the learned snapshot and width equal to vehicle width plus the 26-unit dummy diameter. Side sensors originate at the nose, reach 100 units and use an 80-degree half-angle about each lateral axis; their detection requests slowing, not an independent swerve. Reaction delay is 0.15 s. These are trial geometry/response definitions. Occlusion is tested along the nose-to-target sensing ray against explicit masks. The player's sensing wedge is a separate system. World data explicitly states which objects block each sensor and which obstruct the player's optional diagnostic view. Being outside the player's wedge must never hide an actor, an essential threat cue, a fixed/expiring/interrupted route or a spent appearance.
The fleet may detect the dummy, plan a manoeuvre and then commit. These are different states with different cues:
| State | Behaviour and visible promise |
|---|---|
| Sensing | The dummy or prop is detected; no fixed route is promised |
| Intention | A candidate manoeuvre is readable but may still change |
| Committed | Traffic has approved a swept corridor and planned speed trajectory for at least 0.75 s; the fixed-route cue appears |
| Interrupted | An unforeseen obstruction forces safety braking; the commitment cue visibly breaks and an interruption cue replaces it |
| Released | The promised window has finished; a new intention/commitment may begin |

[LOG#P1.4] (P1.4 — Constant health, difficulty setting)
## P1.4 — Constant health, difficulty setting
**Build:** `dummies_p1.html` v5 · 14 Oct 2026 · Implements O1.16.
- **Constant health:** Body health no longer varies by road. Roads differ only in layout.
- **Inverted difficulty:** More health makes the contract harder. You are trying to be destroyed.
- **Selection:** Title screen, ◀▶. Default Standard. The HUD shows the setting.
- **Removed:** `proto.chassis.straight.bodyHealth`, `proto.chassis.barrier.bodyHealth`, `proto.chassis.corner.bodyHealth`.
- **Parked:** Chassis progression (O1.3), as a meta-layer after the core loop proves fun.
| ID | Value | Label |
|---|---:|---|
| `proto.difficulty` | 1 | 0 Fragile · 1 Standard · 2 Reinforced |
| `proto.health.fragile` | 300 | Easy: you break quickly |
| `proto.health.standard` | 400 | Default |
| `proto.health.reinforced` | 800 | Hard: you take a beating |
The selected value replaces `damage.bodyHealth`, including the assessment cap.
**Hits to write off one body (P1.3 damage model):**
| Setting | Head-on bait (297) | Standing hit (100) | Lunge into a parked car (53) |
|---|---:|---:|---:|
| Fragile 300 | 2 | 3 | 6 |
| Standard 400 | 2 | 4 | 8 |
| Reinforced 800 | 3 | 8 | 16 |
- **Read:** On Standard, one head-on bait leaves about 25% health. The full damage sequence shows before the second hit.

[ENG#6.2~2] (6.2 Sensing, intention and commitment)
Commitment never promises a lethal hit, a minimum assessment or even contact. It promises the advertised corridor and speed trajectory until its recorded expiry, unless a safety interruption is visibly announced. Maintain the trial 0.75 s reservation on a rolling basis where traffic permits. If it cannot be extended and less than the current lunge-plus-recovery duration remains, show a distinct expiring cue rather than a fresh closed cue. Input remains permitted, but the presentation no longer implies a full action window. The 0.75 s minimum exceeds the base lunge plus recovery window of 0.65 s. It is a **Trial** minimum, not a promise that any position is hittable. During commitment the car cannot invent a new evasive route because the dummy moved. Traffic reservations include the footprint along the entire planned corridor and its speed trajectory. Ordinary post-commit player detection/side-sensor requests cannot silently change the reserved speed. A physical safety obstruction may trigger braking only with the interruption cue. Intended player interception remains an assessed collision if it occurs; detection alone must not automatically cancel every bait. A braking exception must be visible, logged and counted in the commitment test. Silent rerouting is invalid.
The 0.75 s minimum is a prediction horizon, not automatic permission to release the corridor at 0.75 s if the vehicle has not completed the manoeuvre. Keep the corridor and cue binding until the reserved manoeuvre clears, or explicitly interrupt it. A late cone may make a reservation unsafe. The car brakes and declares interruption; it does not drive through the cone or secretly steer around it. After the old cue ends, traffic may approve a new manoeuvre. Routine scenes must not depend on repeated interruptions to remain safe, since that would destroy the player's reason to trust the cue.

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

# VALIDATOR
- none

# SETTLED (fixes applied in earlier rounds; do not reverse)
- copy.denied.lunge: Lunge declined. Charge not ready. -> Lunge declined. Charge or recovery incomplete. (ENG#5.2~1)
- copy.shop.bank: Keep {credits} credits. Deploy -> Keep {credits} in credit. Deploy next chassis (DESIGN#D3.9)
- copy.shop.nodes.spine: Steer during the lunge window. Within declared limits. -> Steer your lunge while it is in progress. Only slightly. (DESIGN#D3.9)
- cueKey[7].meaning: The car has been blocked for more than the honk limit. -> The car has been blocked for some time and is warning you. (DRIVER#DB5)
- cueKey[1].meaning: The car has fixed its plan and will follow it. -> The car has fixed its route and will hold it unless interrupted. (ENG#6.2~2)
- barks[1].text: {model} hit. Down {lost} health. My shift is late. -> {model} hit. {lost} health lost. That goes on my record. (DESIGN#D9.3)
- barks[8].text: Replanning. Again. On my own time. -> Replanning. On my own time. (DESIGN#D5.4)
- barks[10].text: Courier run. Entering the zone, on time. -> Courier run. Entering the zone. (DESIGN#D9.3)
- barks[9].text: Crates due by noon. Entering the zone. -> Crates due this shift. Entering the zone. (DESIGN#D9.3)

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
   "purpose": "Minimum gap after a bark before any car may bark again.",
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
    "zh": "机体",
    "review": "pending",
    "rows": [
     {
      "fact": "subject.chassis",
      "label": "Subject / chassis"
     },
     {
      "fact": "body.difficulty",
      "label": "Setting / health"
     },
     {
      "fact": "body.health",
      "label": "Chassis health"
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
      "label": "Model / stop distance"
     },
     {
      "fact": "fleet.note",
      "label": "Red: stop line learned"
     }
    ],
    "sources": [
     "DESIGN#D10.5",
     "DRIVER#DB4a",
     "LOG#P1.8"
    ]
   }
  ],
  "right": [
   {
    "module": "CONTRACT",
    "title": "CONTRACT",
    "zh": "合约",
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
   "meaning": "The car has noticed you. Its plan is not fixed.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5"
   ]
  },
  {
   "cue": "committed",
   "label": "Closed ring",
   "meaning": "The car has fixed its route and will hold it unless interrupted.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "expiring",
   "label": "Opening ring",
   "meaning": "The commitment is ending. Less than one action window remains.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "interrupted",
   "label": "Red broken ring",
   "meaning": "The car's route was interrupted. It is braking for safety.",
   "sources": [
    "BRIEF#P1.3",
    "DRIVER#DB5",
    "DESIGN#D10.3~1"
   ]
  },
  {
   "cue": "caution",
   "label": "Grey triangle",
   "meaning": "The car is cautious and slowing past you.",
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
   "meaning": "This appearance cannot award another impact.",
   "sources": [
    "DESIGN#D10.3~1",
    "BRIEF#P1.3"
   ]
  },
  {
   "cue": "honk",
   "label": "HONK bubble",
   "meaning": "The car has been blocked for some time and is warning you.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "cue": "blind",
   "label": "BLIND wedge",
   "meaning": "Sensor shadow. Cars cannot sense you here.",
   "sources": [
    "LOG#P1.5/pillars-and-blind-spots"
   ]
  },
  {
   "cue": "view",
   "label": "View cone",
   "meaning": "Where you resolve sensor information.",
   "sources": [
    "BRIEF#P1.3",
    "DESIGN#D10.3~1"
   ]
  }
 ],
 "copy": {
  "intro": [
   "Road {road} of {roads}: {roadName}. Write-offs required: {quota}.",
   "{difficulty} chassis, health {health}. Please produce an impact."
  ],
  "denied": {
   "lunge": "Lunge declined. Charge or recovery incomplete.",
   "pickup": "Nothing within reach to carry.",
   "drop": "No legal room ahead. Cone retained.",
   "throw": "No legal room to throw. Cone retained."
  },
  "toast": {
   "touch-spent": "Appearance already assessed. No damage. No points.",
   "drone-dispatch": "FARSIGHT drone dispatched. Obstruction will be relocated.",
   "purchase": "{node} will be installed on the next chassis.",
   "learn-standoff": "{model} revised its stop line to {metres} m.",
   "refusal-locked": "Refusal is unavailable until one body is completed."
  },
  "report": {
   "eyebrow": "WRITE-OFF REPORT",
   "title": "Chassis {chassis} written off.",
   "line": "Write-off {n} of {quota}. Points this body: {points}.",
   "cleared": "{roadName} cleared. Points this body: {points}. Next: {nextRoad}, write-offs required: {nextQuota}.",
   "credit": "One body credit granted. Balance: {credits}.",
   "continue": "Press A to proceed to the shop."
  },
  "shop": {
   "eyebrow": "MODIFICATION SERVICES",
   "title": "Modifications install on the next chassis.",
   "deploy": "Deploy next chassis",
   "bank": "Keep {credits} in credit. Deploy next chassis",
   "nodes": {
    "hips": "Face new directions faster. Deliberate turns take less time.",
    "spine": "Steer your lunge while it is in progress. Only slightly.",
    "carry": "Press B to pick up and place a cone. Movement slows while carrying.",
    "throw": "Tap B to throw a held cone. Hold B to drop."
   }
  },
  "endings": {
   "Licensed": "Contract complete. FARSIGHT thanks you for your cooperation.",
   "Failed test": "Traffic exhausted. Contract incomplete. Please retry.",
   "Non-compliant": "Testing declined. Your refusal has been recorded."
  },
  "frame": {
   "district": "SHENZHEN NEW ECONOMIC ZONE · LOGISTICS ROAD TEST",
   "districtZh": "深圳新经济区 · 物流道路测试",
   "review": "pending"
  },
  "sources": [
   "DESIGN#D9.1",
   "DESIGN#D9.2",
   "DESIGN#D10.5",
   "DESIGN#D3.8",
   "DESIGN#D3.9",
   "DESIGN#D8",
   "DESIGN#D1",
   "LOG#P1.8",
   "ENG#9.3"
  ]
 },
 "barks": [
  {
   "event": "impact",
   "when": {
    "stopped": true
   },
   "text": "I stopped. I was compliant. Log that.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB4a"
   ]
  },
  {
   "event": "impact",
   "when": {
    "stopped": false
   },
   "text": "{model} hit. {lost} health lost. That goes on my record.",
   "sources": [
    "DESIGN#D9.3"
   ]
  },
  {
   "event": "touch-spent",
   "when": {},
   "text": "I'm already on the form. Hands off.",
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
   "text": "Move it! I have a delivery window.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5",
    "LOG#P1.7"
   ]
  },
  {
   "event": "commit",
   "when": {
    "man": "shift"
   },
   "text": "Pulling out. Rank does not wait for obstacles.",
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
   "text": "Stopping. Slowly. Politely.",
   "sources": [
    "DESIGN#D9.3",
    "DRIVER#DB5"
   ]
  },
  {
   "event": "interrupt",
   "when": {},
   "text": "Plan cancelled. My supervisor will hear of this.",
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
   "text": "Reversing. I am not paid to back up.",
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
   "text": "Replanning. On my own time.",
   "sources": [
    "DESIGN#D9.3",
    "LOG#P1.8"
   ]
  },
  {
   "event": "admit",
   "when": {
    "model": "VAN-02"
   },
   "text": "Crates due this shift. Entering the zone.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.2"
   ]
  },
  {
   "event": "admit",
   "when": {
    "model": "SEDAN-01"
   },
   "text": "Courier run. Entering the zone.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.2"
   ]
  }
 ]
}