# DUMMIES — Game Design

**V29 split · Design · Lawrence Lek · 13 October 2026**

- **Scope:** What the game is, why it is fun, and the upgrade tree it is built around.
- **Companions:** [Engineering Spec](DUMMIES_V29_Engineering_Spec.md) holds exact semantics and the parameter registry. [Evaluation & Governance](DUMMIES_V29_Evaluation_Governance.md) holds evidence, gates and delivery.
- **Precedence:** Design states intent and rules. Engineering governs exact semantics and values.
- **Source:** Derived from `GDD_Edit_V29.md` by `split_gdd_v29.py`. The GDD stays the generated source of record until `reconcile_v29.py` emits this split.
- **References:** `§x.y` = GDD_Edit_V29 numbering, resolved by the section map. This file uses D-numbers.
- **Labels:** **Design** = selected rule. **Trial** = starting value needing evaluation. **Expansion-gated** = retained, unavailable in `slice-10`.
- **Parameters:** Backticked IDs resolve in Engineering §13.5.

## Contents

- [D1 The Game](#d1-the-game)
- [D2 Design Pillars](#d2-design-pillars)
- [D3 The Upgrade Tree](#d3-the-upgrade-tree)
- [D4 The Dummy](#d4-the-dummy)
- [D5 The Fleet](#d5-the-fleet)
- [D6 The Road](#d6-the-road)
- [D7 Impact and Scoring](#d7-impact-and-scoring)
- [D8 The Run](#d8-the-run)
- [D9 Setting and Fiction](#d9-setting-and-fiction)
- [D10 Presentation](#d10-presentation)
- [D11 Scope and Decisions](#d11-scope-and-decisions)
- [Appendix: section map](#appendix-section-map)

## D1 The Game

**A crash-test dummy earns human abilities by spending replaceable bodies on self-driving cars.**

- **Core fantasy:** Become human one body part at a time. The upgrade tree (D3) is the spine of the game.
- **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Conflict:** The city is a crash lab that still works as a city. Cars want to qualify. You want to leave.
- **Promise:** FARSIGHT promises release when the testing contract is complete.
- **Player:** A first-time exhibition visitor, e.g. a fifteen-year-old at a cabinet with a friend watching.
  - A brief control prompt and readable consequences teach play. No mandatory tutorial course.
  - The watching friend follows decisions and recognises each upgrade's effect.

### D1.1 Loop

1. Observe a car. Read its intent and commitment.
2. Bait it, shape its route or intercept it.
3. Lunge into the opening.
4. A qualifying impact damages the body and scores. It can extend that model's future detection range.
5. A destroyed body completes one test. Each nonterminal write-off grants one body credit.
6. Spend the credit on a body part. The replacement chassis carries it.
7. Use the new freedom against returning, adapted traffic.

### D1.2 `slice-10` profile

- **Profile:** `slice-10`, configuration `v29-crew-brief-trial-1`. It decides content, prices, schedule and visible completion conditions.
- **Content:** One authored Road. Sedan and Van. Standard mood. Two tree branches, four nodes. One player-hit learning rule.
- **Flow:** Complete start → ending → replay.
- **Contract (Trial):** Complete `run.quota.road` (5) write-offs. The displayed target is the real success condition. No hidden extra body.
- **Budget:** The fifth write-off earns its points and bonus, then ends the run. No shop opens. Five bodies, four spendable credits.
- **First choice:** The first credit buys Hips or Carry, or banks. No forced purchase.
- **Session:** About ten minutes for a newcomer, including reports, purchases and pauses. A pacing target, not a countdown. Experts may finish faster.
- **Five-minute checkpoint:** The player has deliberately fooled a car, earned a credit, chosen a body part and used it.
- **Quality bar:** The small scope must already be beautiful and worth replaying.
- Unavailable expansion nodes never appear as purchasable promises.

### D1.3 Longer horizons — Expansion-gated

- **Thirty minutes:** More of the tree. Combinations and trade-offs. Situations that test the chosen build. A final examination of learned skills.
- **About three hours:** Sustained discovery and mastery across varied runs and builds. Working direction only.
- A continuous three-hour campaign or permanent power progression needs a separate decision.
- Longer profiles deepen the first choice. They never postpone agency to a later mode.

## D2 Design Pillars

Each pillar's evidence plan lives in Evaluation §2 and T01–T11.

### D2.1 Reading and fooling a car is the rewarding strategy

- The player creates an opportunity through observation and action, then reproduces it deliberately.
- Blindly repeating the easiest lunge must not beat reading traffic over a whole run.
- **Fails if:**
  - Blind repetition reliably dominates deliberate baiting.
  - The taught routes cannot sustain the contract.
  - The player credits success to unexplained luck, not a repeatable action.

### D2.2 Recurring cars visibly adapt

- Models have stable identities.
- A qualifying player hit changes that model's later detection range. Other models are unaffected.
- The player meets the return soon enough to notice the new response and adjust.
- "The fleet learns" means accumulated learning per recurring model. No cross-model sharing. No hidden global difficulty.
- **Fails if:**
  - Changed behaviour is indistinguishable from mood or random variation.
  - Models return too late.
  - Reports name an answer the car's behaviour never demonstrated.
  - A closed commitment cue routinely becomes false after the player acts.

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

### D2.4 A beautiful, readable encounter leads to closure and replay

- City, corporate interface, physical dummy and sound form one coherent experience.
- Presentation preserves tactical information.
- Each reached horizon pays off clearly.

| Horizon | Intended experience | Observable closure |
|---|---|---|
| First minute | Deliberately create and land an impact | Readable contact and damage; a repeatable action |
| First upgrade, by the five-minute checkpoint | Choose a direction for the build and use it | Report, purchase and a visibly changed approach |
| Ten-minute slice | Develop the opening, meet a changed rival and resolve the contract | Licensed, deliberate Non-compliant or Failed test; quick replay |
| Thirty-minute expansion | Combine abilities across escalating authored situations | Complete the required stages and final challenge |
| Three-hour expansion | Discover other builds and deepen mastery over repeated runs | Varied self-chosen challenges and voluntary return |

- **Fails if:**
  - Presentation hides readable mechanics.
  - The visit produces no meaningful payoff.
  - An ending is incomprehensible.
  - Repetition exposes only more of the same quotas.
  - Visitors say they would replay but don't when offered.

## D3 The Upgrade Tree

### D3.1 Becoming human

- The dummy starts limited. Each node returns one human freedom.
- Five body branches organise the tree: Head, Torso, Legs, Arms, Battery.
- The five parts are a metaphor, not a literal count of degrees of freedom.
- Each branch has one foundation and two follow-on options.
- Bought nodes persist across chassis for the run. Subject identity persists too.
- No node adds health, armour or automatic repair.
- Every offered node needs a useful encounter. Measure its advantage against the unupgraded dummy.
- The active profile decides which nodes exist and their prices. Unavailable nodes never appear purchasable.

### D3.2 The fifteen nodes

| Branch | Freedom | Foundation | Follow-on 1 | Follow-on 2 | `slice-10` |
|---|---|---|---|---|---|
| Head | Information | Wider view | Memory | Ears | Expansion-gated |
| Torso | Facing and aim | **Hips** | **Spine** | Neck | Hips, Spine active |
| Legs | Traversal | Spring start | Jump | Grip | Expansion-gated |
| Arms | Objects and contact | **Carry** | Hold on | **Throw** | Carry, Throw active |
| Battery | Action resources | Big battery | Kinetic charge | Fast charge | Expansion-gated |

- Active prerequisites: Spine needs Hips. Throw needs Carry.

### D3.3 Node effects

| Node | Freedom returned | Parameters (Trial) |
|---|---|---|
| Hips | Faster deliberate reorientation | `upgrades.hipsTurnRate` 360°/s; base `movement.turnRate` 180°/s |
| Spine | Steer during the original lunge window | `upgrades.spineLimit` 45°; `upgrades.spineRate` 540°/s |
| Neck | Independent aim through an accessible second directional input. No auto lock. No automatic movement penalty. | Expansion-gated |
| Carry | Pick up a cone and place it deliberately | `upgrades.carrySpeed` 0.85 ground-speed factor; `props.cone.pickupEdgeRange` 12 |
| Throw | Ranged cone release inheriting actual velocity. Held B keeps close drop. | `upgrades.throwDistance` 120; `props.cone.throwSeconds` 0.2; `input.dropHoldSeconds` 0.25 |
| Hold on | Grab an unspent car by a valid side contact. Ride it. Launch off along facing with normal lunge charge. | Expansion-gated |
| Wider view | Wider resolved sensor information | Expansion-gated; base `sensing.coneWidth` 90° |
| Memory | Timestamped last-seen snapshot. Visibly stale, never live. | Expansion-gated |
| Ears | Forecast of a planned entry. A waiting marker replaces a false countdown when admission is blocked. | Expansion-gated |
| Spring start | No run buildup | Expansion-gated; base `movement.rampSeconds` 1 s |
| Jump | A second distinct A press in the jump window hops a flagged floor gap. Costs a second charge. Extends the remaining path; never restarts the lunge. Clears gaps only. | Expansion-gated |
| Grip | No low-grip slide or extended coast. Ordinary stopping distance remains. | Expansion-gated |
| Big battery | Higher charge capacity | Expansion-gated; base `battery.capacity` 3 |
| Fast charge | Faster refill | Expansion-gated; base `battery.secondsPerCharge` 0.8 |
| Kinetic charge | Eligible pre-bonus impact damage refills charge. Cannot refill a written-off body. | Expansion-gated |

- Expansion node values are legacy candidates. No price or value is approved.
- Exact node rules: Engineering §5.6–5.7.

### D3.4 The baseline each branch improves

| Branch | Unupgraded dummy | Improved by |
|---|---|---|
| Head | View cone `sensing.coneWidth` 90°, `sensing.coneReach` 900. Cars and cues stay visible outside it. | Wider view, Memory, Ears |
| Torso | Turns at `movement.turnRate` 180°/s. Lunge locked to launch facing. | Hips, Spine, Neck |
| Legs | Run buildup over `movement.rampSeconds`. Walks around gaps. Slides on low-grip terrain. | Spring start, Jump, Grip |
| Arms | Punts cones on contact: `props.cone.puntDistance` 24 over `props.cone.puntSeconds` 0.2. | Carry, Throw, Hold on |
| Battery | `battery.capacity` 3; `battery.secondsPerCharge` 0.8; `battery.refillDelaySeconds` 0.3. | Big battery, Kinetic charge, Fast charge |

- Every dummy can punt cones. Carry and Throw must beat that in real placements.
- The baseline must feel characterful, not broken.
- Never make the baseline tedious to justify an upgrade.

### D3.5 Admission conditions for gated nodes

- **Head:** Information must improve observable decisions, not expose decoration. An omniscient bot cannot validate it.
- **Neck:** Needs direct, accessible aim control and no involuntary movement penalty.
  - No profile sells Neck without an accessible mapping on that device.
  - Validate picking the farther relevant car while moving, then returning to normal facing.
- **Legs:** Authored routes must give the node an advantage over walking around.
- **Jump:** Every combination case needs fixtures first. Combined Spine steering ends with the original lunge window.
- **Hold on:** Attachment and physical cone handling must be complete.
- **Battery:** Measured action pressure and viable purchase sequences must justify them.
- **All:** Cones never train cars. Only player hits train.

### D3.6 `slice-10`: two branches

- **Active branches:** Torso (Hips → Spine) and Arms (Carry → Throw).
- **Opening:** Hips improves reorientation. Carry enables deliberate cone placement.
- **Opportunity cost:** Buying one postpones the other. It steers the build toward a specialisation.
- **Price IDs:** `economy.price.torso.hips`, `economy.price.arms.carry`, `economy.price.torso.spine`, `economy.price.arms.throw`.

### D3.7 Two currencies and one body budget (§9.1)

Points record performance. Credits buy persistent abilities for the current run. Points cannot buy upgrades, damage alone earns no credit, and spending does not reduce score. A nonterminal completed body grants one credit. The fifth, objective-completing body ends the slice and grants no spendable credit: **five bodies, four credits**.

Saving is a legitimate choice. Every first shop offers both Hips and Carry for the first earned credit. Show what each enables immediately and what spending postpones. Do not auto-purchase a tutorial node or present an unaffordable alternative as meaningful choice.

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

### D3.9 Shop

- Shows only profile-enabled nodes.
- Each node shows cost, prerequisite, owned state and credit balance.
- Each node shows a short action description and a looping preview of the changed control or movement.
- A locked follow-on names its prerequisite. An unaffordable node shows the exact shortfall.
- Show what each purchase enables now and what it postpones.
- Teach the two B gestures in the shop and device prompt: tap to throw, hold to drop.
- No decorative expansion node appears purchasable.
- Purchase transaction: Engineering §9.3.

### D3.10 Combinations — Expansion-gated

- Longer profiles deepen the first choice through combinations, trade-offs and fleet responses.
- Each longer profile needs its own body and credit budget, prices and legal sequences.
- Each also needs first-choice alternatives and declared unmet opportunities.
- The legacy fifteen-node total of 38 credits is historical, not an approved economy.

## D4 The Dummy

### D4.1 Identity and states (§5.1)

The subject is earnest, stiff and clanky. Its personality is expressed through movement and repeated bodily expenditure. The same subject record and bought abilities continue through fresh chassis.

The reference body footprint is 26 units across. The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. Carry loosens the arms visibly; Hips changes the rhythm of reorientation. Wear changes outline and lean without hiding facing.

Active states are idle, moving, counter-braking/coasting, lunging, recovering, carrying and written off. Falling, jumping and attachment states are retained for gated expansion. Animation expresses the authoritative state; it cannot quietly change collisions, action duration or input acceptance.

### D4.2 Controls and movement (Trial)

- **Inputs:** Direction moves and faces. A (legs) lunges. B (arms) handles cones.
- **Walk to run:** `movement.walkSpeed` 81 → `movement.runSpeed` 162 over `movement.rampSeconds` 1 s.
- **Buildup reset:** Stop, counter-brake or lunge resets run buildup.
- **Turning:** `movement.turnRate` 180°/s. Misalignment beyond `movement.alignThreshold` 30° slows translation to `movement.turningSpeedFraction` 0.6.
- **Release:** Velocity coasts to zero over `movement.stopSeconds` 0.25 s.
- **Counter-press:** Input beyond `movement.counterPressAngle` 135° from velocity brakes first, scaled by `movement.counterPressStop` 0.4.
- **Carrying:** Ground speed × `upgrades.carrySpeed`. Lunge speed is unaffected.
- Exact rules and arbitration: Engineering §5.2.

### D4.3 Lunge (Trial)

- Costs `battery.lungeCost` 1 charge. Denied actions cost nothing.
- **Reach:** `movement.lungeDistance` 164, scaled by remaining health, floored at `movement.wearFloor` 0.45.
  - Fresh 164. Half health 82. Floor 73.8.
- **Shape:** `movement.lungeFastDistanceFraction` 70% of reach in the first `movement.lungeFastTimeFraction` third of `movement.lungeDuration` 0.3 s.
- **Recovery:** `movement.lungeRecovery` 0.35 s. Facing allowed. No new lunge.
- **Blocked lunge:** Translation stops. The action timer still runs. No early extra lunge.
- **Reach mark:** Predicts straight-lunge reach against static geometry. It never promises a car hit.
- Exact motion and contact response: Engineering §5.3.

### D4.4 Battery (Trial)

- Capacity `battery.capacity` 3.
- Refills one charge per `battery.secondsPerCharge` 0.8 s after `battery.refillDelaySeconds` 0.3 s.
- Capacity three is not "three attempts". Recovery and repositioning allow recharge.
- Pauses, reports, purchases and hit-stop freeze refill.
- Exact rules: Engineering §5.4.

### D4.5 Sensing and feedback (§5.5)

The view cone follows body facing in the slice. It resolves cars' sensor zones and occlusion information in that direction. Cars, identity, route/commitment, brake and spent cues remain available outside the cone. There is no active fog-of-war experiment that hides traffic.

Actor markers remain readable when sprites overlap; occlusion concerns the sensor information and actual sensor rays. Van-class cover can block sensing according to World flags, but must not erase all warning that another vehicle exists.

The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. A 0.06-second hit-stop and 1.1-second destruction presentation are trial values. Cues take priority over particles, shake and decorative information.

## D5 The Fleet

### D5.1 Class, model and appearance (§6.1)

A **class** supplies physical dimensions, mass and baseline behaviour. A **model** is a recurring identity with its own learning record. An **appearance** is one admitted instance of that model, with a unique ID, an immutable starting behaviour snapshot and one damage allowance. Replacement of the dummy does not replace an appearance or replenish its allowance. A later appearance of the same model has a new allowance and reads the updated learning record.

The slice uses two persistent model identities: one Sedan and one Van. Their readable labels, silhouettes and identity marks remain stable between appearances. Both use Standard mood. Class, seniority, mood and random variation must not compete as explanations for the first learned response.

| Slice class | Relative mass | Length × width × height, world units | Baseline speed, units/s | Encounter role |
|---|---:|---:|---:|---|
| Sedan | 1.0 | 56 × 28 × 22 | 138 | Clear reference for approach, commitment, bait and return |
| Van | 1.5 | 68 × 32 × 34 | 120 | Heavier, slower encounter and mobile visual obstruction |

Dimensions, mass and speeds are **Trial** values. Collider geometry, sprite placement and sensor origin share the same transform. A visual pivot does not excuse a tail extending outside the tested swept footprint. Height is metadata for explicit visibility rules; it is not a second physics engine.

The expansion catalogue retains Sports, Hatchback, Sedan, Wagon, Van, Bus, SUV and Police. The earlier proposal for 32 models and four moods is **Expansion-gated**. No slice claim depends on meeting that catalogue count. An expansion profile must allocate every advertised class to a finite schedule; SUV and Police cannot remain advertised roster entries with zero opportunities. A Hatchback's possible second commitment requires a new, clearly announced window after the old promise has ended, with its own tests.

### D5.2 Reading a car

- **Forward sensor:** Rectangle from the nose. Length `perception.forwardLength` 320.
- **Side sensors:** `perception.sideRadius` 100 at `perception.sideHalfAngle` 80°. Side detection slows the car. It never swerves it.
- **Reaction:** `perception.reactionDelay` 0.15 s.

| State | Behaviour and visible promise |
|---|---|
| Sensing | The dummy or prop is detected; no fixed route is promised |
| Intention | A candidate manoeuvre is readable but may still change |
| Committed | Traffic has approved a swept corridor and planned speed trajectory for at least 0.75 s; the fixed-route cue appears |
| Interrupted | An unforeseen obstruction forces safety braking; the commitment cue visibly breaks and an interruption cue replaces it |
| Released | The promised window has finished; a new intention/commitment may begin |

- Commitment lasts at least `traffic.commitHorizon` 0.75 s. Base lunge plus recovery is 0.65 s.
- It promises corridor and speed to recorded expiry. Never contact or lethality.
- No silent reroute or slowing after commitment. Safety braking shows the interruption cue.
- An expiring commitment shows a distinct opening cue.
- Routine scenes never depend on repeated interruptions.
- Exact rules: Engineering §6.2–6.3.

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

### D5.4 Recurrence

- **Schedule:** Sedan–Van–Sedan–Sedan–Van × 8 = `run.appearances.road` 40. 24 Sedan, 16 Van.
- **Pacing:** Nominal admission interval `run.admissionInterval` 12 s. No burst after a blockage.
- **Early end:** Success cancels the remainder. No quota needs all 40.
- **Return:** After learning, the next Sedan slot comes 12–24 s later. The next Van slot comes 24–36 s later.
- **Target:** A changed return before minute five.
- **Moods:** Standard only. Extra moods are expansion content with explicit cues and allocation.
- **Voice:** Barks never assert facts the simulation did not establish (D9.3).
- Exact schedule rules: Engineering §6.5.

## D6 The Road

### D6.1 One authored Road (§7.1)

The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. The logical world reference is 800 × 600 units, independent of the surrounding UI layout. A different display scales the view without silently changing reach or car travel time. Changing logical world dimensions requires new pacing and collision witnesses.

The initial lane width is 56 units. Openings must accommodate the complete 26-unit dummy footprint with usable margin, including the worn-reach case. A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. The authored level asset must supply actual positions, collider footprints, spawn transforms, legal exits, cover flags and prop recovery positions. Its geometry is tested as a single versioned asset. This document does not invent validated coordinates.

The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. There must be room to use Hips and Spine and meaningful placements to use Carry and Throw. Each advertised advantage is compared with what the unupgraded dummy can already do. Simply including a cone does not prove Carry has value; simply including a corner does not prove Hips has value.

The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. Essential geometry stays legible behind the authored art. Clear shoulders and escape positions are part of the layout, not emergency developer cheats.

### D6.2 Environment

- **Surfaces:** Tarmac and pavement only. Shoulders are pavement. Kerbs and stripes add no mechanics.
- **Structures and props:** Barriers, fixed crates, cones.
- **Sensor blocking:** Van, barrier and crate block car and player-diagnostic rays. Sedan and cone don't.
- No mask hides an actor, commitment or spent cue.
- No holes, low-grip traps, multiplier plates or elevated routes in the slice.
- Moving a cone can never seal every recovery route.
- Exact contracts: Engineering §7.2.

### D6.3 Expansion environments and the tree — Expansion-gated

- Road, Junction and Roundabout are the intended progression of traffic situations.
- Each stage needs a tactical purpose, a quota, a finite opportunity budget and a tested upgrade-coverage matrix.
- Each surface declares its own movement, lunge, car speed, braking, sensing and score effects.

| Candidate feature | Node it gives a job |
|---|---|
| Flagged floor gaps | Jump |
| Gravel, puddles and other low-grip surfaces | Grip |
| Sensor-blocking cover | Wider view, Memory |
| Planned and delayed entries | Ears |

- Exact contracts: Engineering §7.4.

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

### D8.1 Payoff and replay (§10.3)

By minute one, the newcomer should deliberately hit a car. By minute five, they should have fooled a car deliberately, completed a body, chosen a credible first upgrade and used it to change play. They should also encounter a recognisably changed return. These are measured gates, not guaranteed events forced by a script or explanatory report.

The rest of the ten-minute experience develops the opening through later purchases, opportunity cost and fleet response. The ending gives closure and makes an alternative opening imaginable. Replay creates a fresh body, empty ownership/credit state, reset model learning and the chosen profile's initial schedule. No hidden learning leaks from the previous visitor. Persistent records remain separate from run state.

Thirty-minute profiles deepen combinations and introduce distinct traffic situations, with coherent stage quotas and exposure budgets. Every required stage and a named final challenge must be completed. Extra write-offs in an earlier stage never waive a later requirement. Three-hour scope initially means discovery and mastery across varied runs; a continuous campaign would need a separate content and pacing decision. Menus and data support these profiles without requiring them for the first release.

## D9 Setting and Fiction

### D9.1 The subject and the contract (§3.1)

- FARSIGHT sells a city without accidents. Your work is to find the conditions that still produce them.
- Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. The city is the testing apparatus.
- The subject's identity, acquired abilities and record persist across replaceable chassis. Approved modifications are installed on the replacement body.
- One destroyed chassis completes one paid test. FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act.
- Damage and assessed impact value are recorded separately. Only a completed nonterminal test pays a spendable credit.
- Certification releases the subject from its current testing contract. It is not an extra currency and does not imply permission to drive.

Destruction is bodily expenditure under coercive employment. It may read as comic, disturbing or routine payment collection. The design does not assume that dents alone produce a sense of sacrifice, and it adds no permanent-death penalty to force that emotion.

### D9.2 A specific fictional district (§3.2)

The slice needs three perceptible anchors:

1. A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic.
2. Readable bilingual district/test identifiers at entry and in the report. Essential language cannot be relegated to decorative micro-type.
3. Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary.

These are authored features of the fictional Shenzhen zone. They are not claims of documentary accuracy. Chinese wording and locally specific visual references require informed editorial review before final art. The review must preserve the game's dry register and the legibility of operational information.

### D9.3 Voice and reports (§3.3)

Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.

Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.

For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.

A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

### D9.4 Sound (§3.4)

Factory hum, engines, restrained synthetic music and clinical announcements make the city sound operational even when the body fails. The dummy creaks, clanks, squashes and recovers with physical weight.

Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. Gameplay cues take priority over ambience and have visual equivalents. Voices are optional; text-first barks must work at exhibition volume.

Reports and purchases can use presentation-time sound while simulation is frozen. No sound callback can award damage, currency or learning. There is no automatic repair warning in the slice because automatic repair is disabled.

## D10 Presentation

### D10.1 Visual register (§4.1)

**An instrumented city inside a friendly corporate terminal.**

The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. Gloss, decorative translucency and bloom stay in the frame. Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry.

The dummy is the only persistently saturated **actor**. Its safety-yellow body and black joints contrast with the restrained fleet. Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. Frame aqua is another separate role.

The dummy has material weight: dents, lean, squash, stretch and a recoverable stagger. Cars glide according to their physical state. Vehicle movement, tyre/route cues and braking must not be disguised by a perfectly smooth decorative animation.

References guide different properties: corporate optimism from mid-2000s interfaces; measurement language from crash-test facilities; modular frames from desktop skins; fast silhouette reading from top-down action games; diegetic institutional presentation from bureaucratic games. Their visual grammar is a reference, not a requirement to copy their surface details.

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

Readable world features include barrier openings, cover, traversable shoulders, cone recovery space and future terrain/gap boundaries. HUD facts include health, charge, body credits, objective progress and remaining scheduled/admitted traffic. They receive appropriate size and contrast even though they are not actor-attached cues.

Decorative diagnostic text never carries a decision. It is first to be removed when density competes with play.

### D10.4 Reach and legibility (§4.4)

The starting reach treatment is a restrained nonnumeric mark visible during ordinary movement. It predicts current straight-lunge reach and static blocking geometry. It does not promise a collision with a moving car. During the action the trace shows its snapshotted path; Spine may steer away from the initial projection.

Compare this treatment with wear animation alone. Keep the least intrusive version that passes fresh/worn prediction tests. There is no categorical prohibition on a predictive mark.

Reference type uses 24-unit cap height for model IDs/readouts, 16 for secondary labels and 9 for deliberate texture. These are trial values, not assurances of legibility at a distance. Name the actual display and input hardware before release testing. Evaluate the planned 1.5–2.5 m range, motion, cue overlap and high-contrast mode. Allow essential marks to displace texture or decorative frame content.

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

### D10.6 Representative finished assets (§4.6)

The ten-minute candidate includes a finished dummy treatment, two recognisable vehicle identities, one coherent environment, readable sensors/commitment/spent cues, report/shop/ending screens and an intentional sound mix. A greybox can establish feel but cannot pass the beauty gate.

Higher structures use visible mass and shadows; sensor-blocking cover must look like cover. Palette/material rules yield when necessary for reserved cue readability. Height bands are descriptive art metadata; collision flags are authoritative (§7).

## D11 Scope and Decisions

### D11.1 Coherent fallback and expansion protection (§12.5)

The slice is already the small version: one level, two models and two meaningful branches. Cut decorative scenery, optional voice lines and extra vehicle variety before cutting the first choice, its follow-on development, observable adaptation, readable feedback, access needs or closure. If the active profile must change, publish a new complete profile with revised objectives, credits, schedule and tests. A two-level fallback cannot inherit an unrelated fifteen-body quota by accident.

Keep expansion cheap through versioned profiles, content IDs, explicit surface/sensor flags, owned-upgrade derivation, a phase-aware menu flow and tested checkpoints. Do not build all future environments, menus or features merely to demonstrate modularity. The immediate architectural proof is that a small second-stage fixture and an alternative profile can be added without duplicating core rules.

### D11.2 Selected rules versus trials (§13.2)

Selected semantics include positive-damage-only allowance consumption, separate assessed impact and health loss, once-only consequences, learning from unique positive-health-loss player hits, no silent commitment reroute, meaningful alternatives at the first shop, no terminal spendable credit, explicit ending priority, and one checkpoint phase. A change to one of these requires a recorded decision and propagation to its consumers.

The initial five-body objective, 800 health, four-node prices, 40-appearance schedule, 12-second interval, movement/traffic values, learning increments, display layout, cues and evaluation thresholds are **Trial** selections. They are concrete enough to build and evaluate, but not validated balance. An alternative trial needs its own configuration identity and evidence; changing a number in one paragraph is insufficient.

Expansion-gated features include the remaining eleven upgrade nodes, additional classes/models/moods, terrain and traversal complications, multi-stage finished content and longer experience profiles. Gating preserves their intended role without pretending their timing, economy, input scheme or value has been solved. §5 states the retained upgrade directions; §§7, 10 and 11 provide the extension contracts.

### D11.3 Open design questions

- **E01:** Do actual-velocity movement, wear, recovery, contact and B gestures feel good?
- **E02:** Are both openings, close drop, velocity throws and follow-ons useful?
- **E03:** Is player-hit range learning recognisable and interesting before explanation?
- **E04:** Is the opportunity budget feasible with velocity damage, wear and misses?
- **E05:** Does the five-minute payoff land without forced delay?
- **E06:** Do score incentives, fast finishers and tiny-hit completions behave well?
- **E07:** Are commitment, expiry and interruption fair?
- **E08:** Are beauty, moving cues and audio right on the actual display?
- **E09:** Is the fiction understood? Do players replay to try another build?
- **E10:** Do longer profiles add meaning at acceptable extension cost?
- Evidence plans: Evaluation §13.4.

## Appendix: section map

**full** = complete GDD text. **summary** = condensed restatement; the full text governs. **evidence** = evidence paragraphs only. Pillar statements are condensed in Design D2. §1 is rewritten in Design D1. Full GDD: `GDD_Edit_V29.md`.

| GDD § | Title | Design | Engineering | Evaluation |
|---|---|---|---|---|
| §1 | The Game | summary | — | — |
| §2.1 | Reading and fooling a car is the rewarding strategy | summary | — | evidence |
| §2.2 | Recurring cars visibly adapt | summary | — | evidence |
| §2.3 | The first upgrade changes how you play | summary | — | evidence |
| §2.4 | A beautiful, readable encounter leads to closure and replay | summary | — | evidence |
| §3.1 | The subject and the contract | full | — | — |
| §3.2 | A specific fictional district | full | — | — |
| §3.3 | Voice and reports | full | — | — |
| §3.4 | Sound | full | — | — |
| §4.1 | Visual register | full | — | — |
| §4.2 | Reference layout and palette — Trial | full | — | — |
| §4.3 | Information taxonomy | full | — | — |
| §4.4 | Reach and legibility | full | — | — |
| §4.5 | HUD and screens | full | — | — |
| §4.6 | Representative finished assets | full | — | — |
| §5.1 | Identity and states | full | — | — |
| §5.2 | Inputs, velocity and locomotion | summary | full | — |
| §5.3 | Lunge, actual velocity and solid response | summary | full | — |
| §5.4 | Battery | summary | full | — |
| §5.5 | Sensing and feedback | full | — | — |
| §5.6 | The two branches and velocity-based throws | summary | full | — |
| §5.7 | Fifteen-node expansion design — Expansion-gated | summary | full | — |
| §5.8 | Initial effective movement and sensing values — Trial | — | full | — |
| §5.9 | Tuning method | — | full | — |
| §6.1 | Class, model and appearance | full | — | — |
| §6.2 | Sensing, intention and commitment | summary | full | — |
| §6.3 | Traffic and recoverability | — | full | — |
| §6.4 | Cars learn only from player hits | summary | full | — |
| §6.5 | Recurrence, moods and voice | summary | full | — |
| §7.1 | One authored Road | full | — | — |
| §7.2 | Environment contracts | summary | full | — |
| §7.3 | Coverage and feasibility | — | — | full |
| §7.4 | Expansion environments | summary | full | — |
| §8.1 | Contact episodes and the one-use allowance | summary | full | — |
| §8.2 | Damage uses actual relative closing velocity | summary | full | — |
| §8.3 | Score and finishing incentives | summary | full | — |
| §8.4 | Whole-tick outcome transaction | — | full | — |
| §8.5 | Write-off, cone conservation and replacement | summary | full | — |
| §9.1 | Two currencies and one body budget | full | — | — |
| §9.2 | Active prices and sequences | full | — | — |
| §9.3 | Shop and purchase transaction | summary | full | — |
| §9.4 | Records and eligibility | — | full | — |
| §10.1 | Phases and clocks | summary | full | — |
| §10.2 | Objective, finite opportunities and ending priority | summary | full | — |
| §10.3 | Payoff and replay | full | — | — |
| §10.4 | Stage closing and checkpoint continuation | — | full | — |
| §11.1 | Versioned definitions and effective values | — | full | — |
| §11.2 | Ownership and dependencies | — | full | — |
| §11.3 | Required run and event data | — | full | — |
| §11.4 | Checkpoint schema | — | full | — |
| §11.5 | Concrete adapter semantics, units and identity | — | full | — |
| §12.1 | Deliverable and scope | — | — | full |
| §12.2 | Build and integration order | — | — | full |
| §12.3 | Three-agent crew and integrated delivery | — | — | full |
| §12.4 | Evaluation protocol and release gates | — | — | full |
| §12.5 | Coherent fallback and expansion protection | full | — | — |
| §13.1 | Resolution traceability | — | — | full |
| §13.2 | Selected rules versus trials | full | — | — |
| §13.3 | V29 amendment status | — | — | full |
| §13.4 | Remaining experiments and implementation obligations | — | — | full |
| §13.5 | Generated effective parameter appendix | — | full | — |
