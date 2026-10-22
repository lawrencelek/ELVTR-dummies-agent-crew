# BRIEF — Interface: HUD modules, cue key, on-screen copy and vehicle barks
Content type: interface. Parameter prefix for new IDs: proto.ui.

## The gap (what P1 is thin on)
- P1's HUD is a developer panel. It shows 'VIEW · Scanners in view cone', 'Drivers: Highway Code', 'Sensors: straight ahead'.
- It does not use the six HUD modules the GDD names (D10.5: BODY, CHARGE, FLEET, CONTRACT, SHIFT, RECORD).
- The cue grammar (state pip: chevron, closed ring, opening ring, red broken ring; caution triangle; spent slash) is explained nowhere in the game.
- On-screen copy is placeholder English: 'Cars dodge you: get hit head-on for the big payoff.' It is not FARSIGHT's voice.
- Vehicles never speak, although D9.3 says they speak as workers. There are no bilingual district identifiers (D9.2 anchor 2).

## Deliverable
- HUD layout: the D10.5 modules split into a left and right column, each row bound to a sim fact the renderer can draw.
- Module titles in English with a Chinese title marked for editorial review.
- A cue key for the pause screen: one line per cue the field draws.
- A copy deck: intro banner, denial lines, toasts, report, shop, endings, frame identifier.
- A bark bank: short lines vehicles say, each bound to a logged sim event and only its fields.

## JSON schema
```
{
  "params": [ {"id": "proto.ui.<name>", "value": number, "unit": "s|count|...", "purpose": "...", "sources": [...]} ],
  "hud": {
    "left":  [ {"module": allowed.modules, "title": "EN title", "zh": "Chinese title", "review": "pending", "rows": [ {"fact": allowed.facts key, "label": "short label"} ], "sources": [...]} ],
    "right": [ same ]
  },
  "cueKey": [ {"cue": allowed.cues, "label": "2-3 words", "meaning": "one short sentence", "sources": [...]} ],
  "copy": {
    "intro": ["line 1", "line 2"],
    "denied": {"lunge": "...", "pickup": "...", "drop": "...", "throw": "..."},
    "toast": {"touch-spent": "...", "drone-dispatch": "...", "purchase": "...{node}...", "learn-standoff": "...{model}...{metres}...", "refusal-locked": "..."},
    "report": {"eyebrow": "...", "title": "...{chassis}...", "line": "...", "cleared": "...", "credit": "...", "continue": "..."},
    "shop": {"eyebrow": "...", "title": "...", "deploy": "...", "bank": "...", "nodes": {"hips": "...", "spine": "...", "carry": "...", "throw": "..."}},
    "endings": {"Licensed": "...", "Failed test": "...", "Non-compliant": "..."},
    "frame": {"district": "EN district/test identifier line", "districtZh": "Chinese line", "review": "pending"},
    "sources": [...]
  },
  "barks": [ {"event": allowed.bark_events, "when": {field: literal value} or {}, "text": "line with {placeholders}", "sources": [...]} ]
}
Placeholders in copy use only the names listed in allowed.copy_placeholders for that key. Bark placeholders and 'when' keys use only that event's fields plus model and cls.
```

## Consumer contract (what the renderer can draw)
- drawHUD() draws hud.left in the left column and hud.right in the right column, in order. Each module prints its title and Chinese title as an eyebrow, then its rows.
- Each fact has a fixed widget and height (allowed.facts). A column must fit its budget: sum of rows + header and gap per module.
- Labels print in 10-12 px type inside a 216-unit column. Keep them short.
- cueKey prints on the pause screen beside the menu, each line next to the real glyph the field uses.
- Copy strings replace the P1 literals with the same role. {placeholders} are filled by the renderer.
- Barks show for proto.ui.barkSeconds as a tag beside the car named by the event. At most one bark per car, and none within proto.ui.barkCooldown of the last.
- Sim event fields: impact {model, cls, zone, closing, angle, assessed, lost, carState, bait, lunging, stopped, learnedStandoff}; touch-spent {car}; honk {car, at: 'body' or a cone id}; commit {car, man: 'shift' or 'brake', cause}; interrupt {car, by}; unstick {car, how: 'reverse' or 'replan'}; admit {car, cls, model, lane}.

## Allowed values
```json
{
 "modules": [
  "BODY",
  "CHARGE",
  "FLEET",
  "CONTRACT",
  "SHIFT",
  "RECORD",
  "BUILD"
 ],
 "required_modules": [
  "BODY",
  "CHARGE",
  "FLEET",
  "CONTRACT",
  "SHIFT",
  "RECORD"
 ],
 "facts": {
  "subject.chassis": {
   "h": 24,
   "shows": "chassis number of the current body"
  },
  "body.difficulty": {
   "h": 22,
   "shows": "difficulty setting name and body health"
  },
  "body.health": {
   "h": 50,
   "shows": "health bar with numbers; flashes red below 30%"
  },
  "body.reach": {
   "h": 22,
   "shows": "current wear-adjusted lunge reach"
  },
  "body.charge": {
   "h": 44,
   "shows": "charge segments"
  },
  "contract.writeOffs": {
   "h": 70,
   "shows": "write-off boxes for this road and the count"
  },
  "contract.road": {
   "h": 22,
   "shows": "road n of 3 and its name"
  },
  "build.nodes": {
   "h": 128,
   "shows": "Torso and Arms nodes, owned state"
  },
  "record.points": {
   "h": 58,
   "shows": "points"
  },
  "record.credits": {
   "h": 52,
   "shows": "spendable body credits"
  },
  "fleet.models": {
   "h": 60,
   "shows": "each model ID and its current stop distance in metres; red once learned"
  },
  "fleet.note": {
   "h": 22,
   "shows": "one-line note under the fleet list (label text only)"
  },
  "shift.admitted": {
   "h": 26,
   "shows": "cars admitted of scheduled"
  },
  "shift.onRoad": {
   "h": 20,
   "shows": "cars on the road now"
  },
  "shift.next": {
   "h": 20,
   "shows": "class and seconds until the next admission"
  },
  "clock.active": {
   "h": 40,
   "shows": "active simulation time"
  }
 },
 "module_header_h": 24,
 "module_gap_h": 14,
 "column_budget_h": 580,
 "label_max_chars": 22,
 "cues": [
  "intention",
  "committed",
  "expiring",
  "interrupted",
  "caution",
  "braking",
  "spent",
  "honk",
  "blind",
  "view"
 ],
 "copy_placeholders": {
  "intro": [
   "road",
   "roads",
   "roadName",
   "quota",
   "difficulty",
   "health"
  ],
  "denied": [],
  "toast.touch-spent": [],
  "toast.drone-dispatch": [],
  "toast.purchase": [
   "node"
  ],
  "toast.learn-standoff": [
   "model",
   "metres"
  ],
  "toast.refusal-locked": [],
  "report.eyebrow": [],
  "report.title": [
   "chassis"
  ],
  "report.line": [
   "n",
   "quota",
   "points"
  ],
  "report.cleared": [
   "roadName",
   "nextRoad",
   "nextQuota",
   "points"
  ],
  "report.credit": [
   "credits"
  ],
  "report.continue": [],
  "shop.eyebrow": [],
  "shop.title": [],
  "shop.deploy": [],
  "shop.bank": [
   "credits"
  ],
  "shop.nodes": [],
  "endings": [],
  "frame.district": [],
  "frame.districtZh": []
 },
 "bark_events": [
  "impact",
  "touch-spent",
  "honk",
  "commit",
  "interrupt",
  "unstick",
  "admit"
 ],
 "bark_derived_fields": [
  "model",
  "cls"
 ],
 "bark_max_chars": 64
}
```

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

## Game data
Registry IDs you may reference (value, unit):
- feedback.hitStop = 0.06 s
- feedback.writeOffSeconds = 1.1 s
- proto.driver.patienceSeconds = 8
- proto.health.fragile = 200
- proto.health.reinforced = 600
- proto.health.standard = 300
- proto.honkSeconds = 5
- proto.learn.standoffEnabled = 1
- proto.learn.standoffMax = 190
- proto.learn.standoffStep = 35
- proto.quota.barrier = 2
- proto.quota.corner = 3
- proto.quota.straight = 1
- proto.scale.unitsPerMetre = 12.2
- proto.standoffDistance = 50
- ui.typeLoadBearing = 24 reference-canvas units
- ui.typeSecondary = 16 reference-canvas units
- ui.typeTexture = 9 reference-canvas units

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

# YOUR PREVIOUS OUTPUT

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
   "meaning": "The car has fixed its plan. Only safety braking interrupts it.",
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
   "meaning": "The car has been blocked too long.",
   "sources": [
    "DRIVER#DB5",
    "LOG#P1.7"
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
   "drone-dispatch": "FARSIGHT drone dispatched. Cone is blocking a car.",
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
   "text": "Impact recorded. I have a delivery to make.",
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
   "text": "{model} entering lane {lane}. Route in progress.",
   "sources": [
    "DESIGN#D9.3",
    "DESIGN#D9.2"
   ]
  }
 ]
}

# ISSUES TO FIX

## Validator (automatic checks)
- none

## Critic
- C1 [truth/fix] barks[1].text: found "Noted. {model} will stop further back." — Barks cannot explain a learned counter beyond what the evidence supports. P1.8 lets only the toast name the change, and a car speaks about its own job and the logged event. (DESIGN#D9.3). Fix: "Noted. I did not ask for this."
- C2 [truth/fix] barks[4].text: found "Dummy in my lane. My slot is closing." — Barks never assert facts the simulation did not establish. A honk logs only that the car was blocked more than 5 s. It does not log lane occupancy or a closing slot. (DESIGN#D5.4). Fix: "Dummy ahead. I have been held up."

Apply every fix. Change nothing else. Output the complete corrected JSON object.