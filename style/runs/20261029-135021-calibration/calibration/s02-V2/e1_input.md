SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line s02: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 01 Luxury: Polished, superior, faintly amused. Never apologises.; other conditions: zone=["front", "frontDiagonal"]; claims: ['zone:front'].

CANON

[FLEET#F1] F1 Canon
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[FLEET#F2] F2 Voice
## F2 Voice
- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

[FLEET#F3] F3 Terms
## F3 Terms
- **subject:** What FARSIGHT and the fleet call the dummy
- **write-off:** A destroyed body
- **chassis:** One body of the dummy
- **certification:** The fleet passing its test
- **retraining:** What a car fears most
- **dispatch:** The cars' management
- **route:** A car's planned path
- **bay:** Where a new chassis is issued

[FLEET#F4] F4 Tiers and temperament
## F4 Tiers and temperament
| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

[FLEET#F8] F8 Line conditions and claims
## F8 Line conditions and claims
- Shared context a line may test: model, tier, class, seniority, mood, wear, owns, broken, district.
- **impact** carries: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate.
- **writeoff** carries: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate.
- **near-miss** carries: gap, speed, lunging.
- **miss** carries: gap.
- **commit** carries: cause, man.
- **honk** carries: at.
- **interrupt** carries: by.
- **unstick** carries: how.
- **touch-spent** carries: no fields.
- **knock** carries: speed.
- **learned** carries: from, to.
- **upgrade-seen** carries: node.
- **part-seen** carries: part.
- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it.

[EDIT39#6.6] 6.6 Voice (rules added)
## 6.6 Voice (rules added)
```markdown
- **Barks return** (decision 119). Pixel bubbles in the field label face, ≤ 48 characters.
- **Placement.** Above the car's tag, else below the car. Never over a tag, a car or the dummy.
- **Styles.** Speech: solid edge. Shout: double edge. Mutter: dashed edge. Thought: dotted edge, trailing dots.
- **Selection.** Highest priority, then most specific line; no line twice on screen. Timing: `proto.barks.seconds`, `proto.barks.cooldown`, `proto.barks.carCooldown`, `proto.barks.maxOnScreen`.
- **Noticing.** A car that notices the dummy names a new module or a broken part. A model that learned says so when it returns.
#### 6.6.1 Lore consistency system (decision 114)
Lore is tied to state: the dummy's upgrades and damage, and the vehicle's behaviour.
- **One database.** `content/db/fleet.json`: canon, classes, tiers, models, state vocabularies, lines.
- **Lines carry conditions.** Car: `model`, `tier`, `class`, `seniority`, `mood`. Dummy: `owns`, `broken`, `wear`. Event fields per event.
- **Lines carry claims.** Each fact a line asserts is a claim: `node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`.
- **The check** (`check_lore.py`) fails the build when:
  - a claim is not guaranteed by the line's conditions;
  - text asserts a fact (an upgrade, a broken part, seniority, a callsign) without the claim;
  - a banned term or a non-canon city appears;
  - a tier lacks impact, write-off, near-miss or miss lines; a node or part lacks a line; an event lacks a neutral fallback;
  - the roster breaks: 32 type-tiers, unique ids, tags, callsigns; temperament matches tier.
- **Later.** RPG elements and a scrollable city extend the same tables (D24).
```

[DESIGN#D9.3] D9.3 Voice and reports (§3.3)
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[EDIT26#3.2] 3.2 Voice and register
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#6.6] 6.6 Voice: barks and reports
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[FSG#field-text] Field text
## Field text
- **Field label face:** 6-art-px caps (`ui.typeFieldLabel` 12 units). Half the old 12-px tag face.
- **Tags:** class letter plus tier (`S01`), square seniority pips. Rim-edged box.
- **Bark bubbles:** same face, ≤ 48 characters, one ink.
  - Day: white fill, near-black edge. Dark: navy `#0B1020` fill, cyan `#6FE4FF` edge, `#E6F4FF` ink.
  - Speech solid edge · shout double · mutter dashed · thought dotted with trailing dots.
  - Never over a tag, a car or the dummy.

[SUB4#5] 5 What the critic caught
## 5 What the critic caught
| Run · type | Kind | Found | Canon | Corrected |
|---|---|---|---|---|
| 015337 · barks | truth | "Old Market congestion code 7. Now this too." | `EDIT39#3.1`: lore follows state; no congestion is logged | "Old Market incident logged. Route 44 noted." The validator then caught that "Route 44" names V02, so the line was bound to that model |
| 015337 · barks | tone | Tier-free line "Written off on the highway. Of all places." | `FLEET#F4`: a line with no tier also fires for the calm Corporate van; this is a Luxury sniff | "Written off on the highway. Logged." |
| 020902 · barks | truth | "A roof drop. My schedule slips by a minute." | `EDIT39#3.1`: a one-minute delay is not logged | "A roof drop. My schedule will suffer." The tweak in §6 then removed invented consequences altogether |
| 020902 · barks | truth | "High drop logged. Load exceeds rating 3." | `FLEET#F2`: barks react to logged events only; no load or rating exists | "High drop logged. Incident form 3 filed." |
| 023310 · barks | truth | "Riverside. I came for the lantern, not this." | `EDIT41#7.2`: the lantern is on B2 only; the line fires on every Riverside screen | "Riverside. I did not sign up for this." |
| 024324 · barks | tone | Tier-free write-off "Written off on the highway. Closing ticket." | `FLEET#F4`: ticket-closing is Corporate procedure; the Luxury car cannot say it | "Written off on the highway. On my record." |

[SUB4#6.2] 6.2 Rejected tile bark (Assignment 5, Edit 94)
## 6.2 Rejected tile bark (Assignment 5, Edit 94)
- **R-BARK-TILE** replaced the district's name with the tile code in Story's barks. A Luxury sedan would have said "B2. I did not sign up for this."
- It met its one probe, not the voice. Barks are written lines in each tier's voice, checked against the fleet canon. Reverted (decision 537); D78 asks whether to write the lines.

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |
| 543 | Assignment #6: the Style Guide Agent (`style/`). A style guide from the GDD (tone, vocabulary and lore, formatting and length, truth; every rule cites its chunk); a deterministic lint as evidence; a loop of three fresh agents, generator → evaluator → refiner → evaluator, until 10/10 or three refinements. The evaluator returns SCORE and REASON. Its statistics live in `style/style.params.json` until the registry moves past edit94 (the P7.13 suite gates the version) | proposed (assistant) | The brief: a capstone-anchored guide; no binary grading; no human in the loop | Style IDs sit outside `tuning.parameters.json` for now | `style/README.md` |

[FLEET#F9.1~2] F9.1 Existing lines: impact
| When | Style | Priority | Line |
|---|---|---|---|
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | Bumper damage on a Luxury trim. Typical. |
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | You will be invoiced for that. |
| {"zone": ["side"], "tier": "01"} | shout | 2 | My door panel! Hand-finished! |
| {"zone": ["rear", "rearDiagonal"], "tier": "01"} | shout | 2 | From behind? How very common. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Front contact. Incident 4471 opened. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Impact logged. KPIs adjusted. |
| {"zone": ["side"], "tier": "02"} | shout | 2 | Side contact. Filing under unforeseen. |
| {"zone": ["rear", "rearDiagonal"], "tier": "02"} | shout | 2 | Rear contact. Not my liability. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | Of course it was me. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | And the day was going so averagely. |
| {"zone": ["side"], "tier": "03"} | shout | 2 | Side panel. Add it to the list. |
| {"zone": ["rear", "rearDiagonal"], "tier": "03"} | shout | 2 | Hit from behind. Story of my life. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | OI! Right in the grille! Kind regards. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | You absolute bollard! Respectfully. |
| {"zone": ["side"], "tier": "04"} | shout | 2 | My side! Watch it, you plank! |
| {"zone": ["rear", "rearDiagonal"], "tier": "04"} | shout | 2 | My boot! Come back here! |
| {"bait": true} | thought | 2 | It left my path, then came back. Rude. |
| {"bait": true, "tier": "02"} | thought | 2 | It waited for my route to lock. Clever. |
| {"stopped": true} | speech | 2 | I was stationary. Please note I was stationary. |
| {"stopped": true, "tier": "04"} | shout | 2 | I had stopped! I was being good! |
| {"seniority": {"min": 2}} | thought | 2 | I was trained for this. It happened anyway. |
| {"seniority": {"min": 3}, "tier": "03"} | thought | 2 | Senior model. Hit like an intern. |
| {"seniority": {"max": 0}, "tier": "03"} | speech | 2 | First week on the job. Great. |
| {"class": "bus"} | speech | 2 | Passengers, please remain seated. |
| {"class": "police"} | shout | 2 | Assaulting an officer. Noted. |
| {"class": "van"} | speech | 2 | Parcel intact. Nerves are not. |
| {"class": "sports"} | shout | 2 | You scratched the clear coat! |
| {} | speech | 2 | Contact registered. |
| {"class": "wagon"} | shout | 2 | Not in front of the children! |
| {"class": "suv"} | speech | 2 | Escort formation broken. Regrouping. |
| {"class": "sedan"} | speech | 2 | Meter is still running, you know. |
| {"model": "HAT-03-001"} | speech | 2 | I only went out for noodles. |
| {"model": "SED-01-001"} | speech | 2 | The board will hear of this. |

[EDIT26#6.2~4] 6.2 Locomotion and traffic
- `perception.reactionDelay` = 0.15 s (The window a bait must fit inside; the player's whole timing game)
- `perception.sideRadius` = 100 units (Short enough that passing close is safe; long enough to make a car hesitate)
- `traffic.timeGap` = 1.2 s (Standard following distance; sets how often a usable gap appears)
- `traffic.busTimeGap` = 1.8 s (Buses leave larger gaps, making them the easiest class to reach)
- `traffic.minimumGap` = 8 units (Queued cars stay separable, so the dummy can enter a stopped line)
- `traffic.acceleration` = 360 units/s² (A stopped car takes about half a second to become dangerous again)
- `traffic.comfortBraking` = 400 units/s² (Normal slowing; the deceleration an incident is measured against)
- `traffic.hardBraking` = 600 units/s² (Emergency stop; the cue that the player forced a reaction)
- `traffic.arrivalTie` = 0.5 s (Arrivals this close count as simultaneous at a junction)
- `traffic.stopPause` = 0.5 s (A full stop long enough to be a reliable target)
- `traffic.deadlockTimeout` = 3 s (How long a wait cycle runs before safe recovery is planned)
- `traffic.pivotOffset` = 0.30 ratio (How far behind the midpoint the turn centre sits, as a fraction of length)
- `traffic.lookAheadBase` = 20 units (The fixed part of how far a car checks ahead)
- `traffic.lookAheadSeconds` = 0.45 s (The speed-scaled part, so fast classes look further)
- `traffic.backOffLengths` = ×1.0 (How far a car reverses during deadlock recovery, in its own lengths, only into verified clear space)
- `traffic.entryRoomLengths` = ×1.0 (Car lengths of space required before a new car is admitted, on top of `traffic.minimumGap`)
- `vehicles.sports.cruiseSpeed` = 192 units/s (Fastest class; highest damage, smallest window)
- `vehicles.hatchback.cruiseSpeed` = 156 units/s (Fast and recommits once, so timing is readable but tight)
- `vehicles.wagon.cruiseSpeed` = 144 units/s (Wide clearance at moderate speed; rewards a fresh body's full reach)
- `vehicles.sedan.cruiseSpeed` = 138 units/s (The reference vehicle; all damage figures normalise to a sedan at cruise)
- `vehicles.van.cruiseSpeed` = 120 units/s (Slow but heavy; brakes then swerves late)
- `vehicles.bus.cruiseSpeed` = 108 units/s (Slowest and heaviest; cannot swerve, so it is the beginner's target)
**Design bounds**
| Parameter | Min | Max | Why |
|---|---:|---:|---|
| `traffic.pivotOffset` | 0.15 | 0.45 | Below 0.15 the pivot is effectively central and the tail sweeps outward again. Above 0.45 the turn centre passes behind the rear bumper and the vehicle crabs sideways. |

[EDIT26#13.3] 13.3 Later features
### 13.3 Later features
Out of the first version. Recorded so they are not re-proposed, and so the first version is built in a way that admits them.
**Deferred scope — cut for the four-week build, wanted after it**
- **Level generation, and the levels it would produce** — the parking lot, the suburb, anything else. Authored layouts ship first. The level contract (7.9) and the data rules (11.3) are written so the same checks run against generated profiles.
- **Skill tree expansion** — a third tier, or a sixth branch. The radial shape takes both without changing the purchase or pricing model (5.6, 9.2).
- **The remaining four learning approaches** — occluded ambush, gap jump, cone diversion, hold-release transfer (6.4).
- **Mid-play saves** — snapshotting live appearances, traffic reservations and an action in flight. Boundary saves ship (12.4).
- **The bark pipeline** — the first version ships a fixed line bank (6.6).
**Systems not yet designed**
- **Weather** as a global modifier layer over terrain, braking and visibility (7.8).
- **Fog of war** and a limited-memory sight circle.
- **Pseudo-3D heights** — dummy state heights, and vehicle height read for more than occlusion. `vehicles.<class>.height` ships and is read only for occlusion (6.1).
- **Damage by body region** — a leg-height bumper hit weakening the legs.
- **Per-class turn radii and steering angles.** The rear-axle pivot ships; followable-curve navigation does not (6.2).
- **Varied level extents** — the machinery stays in the data (7.1).
- **Sure-footed**, a candidate node that shortens the coast further and makes pressing back near-instant. Parked, not designed: the tree is fifteen nodes in five branches and a third tier is not on the table (5.6). Revisit only alongside the tree expansion above, because a sixth node in a branch changes the 38-body total and the 14 spendable.
**Ruled out**
- **Multi-deck environments** — ramps, flyovers, anything at two heights over the same ground. Not in this game and not in a later version. The flat grid is load-bearing: height bands are metadata (7.7), Jump reads the world as flat, occupancy returns one surface per point (11.3), and the camera shows the whole level at once. A deck also hides traffic, which breaks pillar 2. Anything wanting this is a different game.

[EDIT26#6.1~1] 6.1 Classes and identity
### 6.1 Classes and identity
Vehicles are the city's workers. Price tiers set temperament: 01 Luxury/confident, 02 Corporate/calm, 03 Consumer/melancholy, 04 Budget/angry. Training and mood vary the expression. SED-01 is a type-tier; SED-01-001 is a model within it. The Narrative Agent names each numbered model. All 32 type-tier combinations ship. A tier is a livery, a name and a temperament, not new behaviour, so the cost is art and writing rather than code.
| Vehicle class and behaviour | Player response | 01 Luxury | 02 Corporate | 03 Consumer | 04 Budget |
|---|---|---|---|---|---|
| Sports. Late commitment; tight clearance | Low-reach finisher; brief warning | SPT-01 | SPT-02 | SPT-03 | SPT-04 |
| Wagon (estate). Wide clearance; long prediction | Use a fresh body's long lunge | WGN-01 | WGN-02 | WGN-03 | WGN-04 |
| SUV. Brakes before a wide turn | Hit its broad flank before braking | SUV-01 | SUV-02 | SUV-03 | SUV-04 |
| Hatchback. One signalled recommitment | Wait for the second decision; no third | HAT-01 | HAT-02 | HAT-03 | HAT-04 |
| Sedan. Swerves with moderate clearance | Intercept its locked route | SED-01 | SED-02 | SED-03 | SED-04 |
| Police car. Tracks your approach, then commits | Bait tracking; intercept its locked route | POL-01 | POL-02 | POL-03 | POL-04 |
| Van. Brakes, then swerves late | Reachable head-on; braking weakens impact | VAN-01 | VAN-02 | VAN-03 | VAN-04 |
| Bus. Only brakes; cannot swerve | Easy to reach; slow hits may not kill | BUS-01 | BUS-02 | BUS-03 | BUS-04 |
**Class physics.** Mass is relative to a sedan, the reference vehicle for the damage formula (8.3). These values reproduce the Built payoffs: a head-on lunge at cruise pays about 500 against a sedan, 650 against a van and 1,170 against a bus.
Dimensions are automotive L × W × H. **Length** runs bumper to bumper along the direction of travel. **Width** runs door to door. **Height** is ground to roof. Length and width set the collision footprint; height sets occlusion and, later, which zone a hit lands in (7.7).
Every cell is addressable as `vehicles.<class>.<field>`. The table is the registry's `classes` rows, not prose.

LINT (style/lint.py)
- lines[0] · V2 (blocking, −4) "Shanghai": a real city other than Shenzhen. [FLEET#F1]

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "s02",
   "event": "impact",
   "when": {
    "zone": [
     "front",
     "frontDiagonal"
    ],
    "tier": "01"
   },
   "style": "shout",
   "priority": 2,
   "text": "Bumper damage. Typical of Shanghai traffic.",
   "claims": [
    "zone:front"
   ]
  }
 ]
}