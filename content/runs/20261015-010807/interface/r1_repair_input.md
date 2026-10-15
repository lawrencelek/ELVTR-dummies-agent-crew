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

# YOUR PREVIOUS OUTPUT

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
      "label": "Red: learned stop"
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
   "learn-standoff": "{model} stop line moved to {metres} m.",
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

# ISSUES TO FIX

## Validator (automatic checks)
- none

## Critic
- C1 [truth/fix] copy.toast.learn-standoff: found "{model} stop line moved to {metres} m." — Copy cannot explain a model's first learned change, or name its counter, before the player has met the changed return. Earlier text may state impact facts and identity only. (DESIGN#D9.3). Fix: "{model} record updated."
- C2 [rule/fix] hud.left[2].rows[1].label: found "Red: learned stop" — Red is reserved for warning marks with independent shape or position. A learned-record state is not a warning, and colour must not be the only carrier. (DESIGN#D10.2). Fix: "Marked: learned stop"

Apply every fix. Change nothing else. Output the complete corrected JSON object.