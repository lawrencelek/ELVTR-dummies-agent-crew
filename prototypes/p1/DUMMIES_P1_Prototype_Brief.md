# DUMMIES — P1 Prototype: Finding the Fun

**P1 · Vertical slice brief · Lawrence Lek · 14 October 2026**

- **Parent:** [Design](DUMMIES_V29_Design.md). Values use registry IDs from Engineering §13.5.
- **Status:** Frozen at P1.9 · 15 October 2026. Greybox. Designer playtests only; no external players. Freeze record: Prototype Log, P1 freeze.
- **Build:** `dummies_p1.html`. Open in a browser. No install.

## P1.1 Questions

| ID | Question | Watch for |
|---|---|---|
| Q1 | Does dummy locomotion feel good? | Players steer, turn and lunge without fighting controls |
| Q2 | Is fooling a car fun? | Deliberate bait: get detected, read the swerve, lunge into it |
| Q3 | Does each branch change play? | Hips users turn-and-strike; Carry users lay cone traps |
| Q4 | Does cone-limited prediction create play? | Players turn to look before committing to an approach |
| Q5 | Is velocity damage readable and satisfying? | Players chase front hits and fast lunges deliberately |

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

## P1.3 Visibility rule — prediction ahead only

- **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp.
- **Inside the view cone only:** Forward sensor rectangle, side sensor arcs, predicted path.
- **View cone:** `sensing.coneWidth` 90°, reach `sensing.coneReach` 900. Follows facing.
- **State pip:** Chevron = intention. Closed ring = committed. Opening ring = expiring. Red broken ring = interrupted.
- **A/B toggle:** `proto.zonesEverywhere` shows all zones. Compare both conditions.

## P1.4 Dummy

| Input | Keyboard | Gamepad |
|---|---|---|
| Move / face | WASD or arrows | Left stick or d-pad |
| A — lunge (legs) | Space or J | A |
| B — cone (arms) | K or Shift | B |
| Pause | Esc | Start |
| Tuning panel | T | — |

- **Movement:** `movement.walkSpeed` → `movement.runSpeed` over `movement.rampSeconds`. Turns at `movement.turnRate`.
- **Lunge:** Along facing. Reach `movement.lungeDistance` × wear, floor `movement.wearFloor`.
- **Lunge shape:** `movement.lungeFastDistanceFraction` of reach in `movement.lungeFastTimeFraction` of `movement.lungeDuration`.
- **Recovery:** `movement.lungeRecovery`. No new lunge.
- **Battery:** `battery.capacity`; refill `battery.secondsPerCharge` after `battery.refillDelaySeconds`.
- **Baseline cones:** Moving into a cone punts it `props.cone.puntDistance`.

## P1.5 Branches

| Node | Price ID | Needs | Effect |
|---|---|---|---|
| Hips | `economy.price.torso.hips` | — | Turn at `upgrades.hipsTurnRate` |
| Spine | `economy.price.torso.spine` | Hips | Steer lunge ≤ `upgrades.spineLimit` at `upgrades.spineRate` |
| Carry | `economy.price.arms.carry` | — | B picks up / drops a cone. Ground speed × `upgrades.carrySpeed` |
| Throw | `economy.price.arms.throw` | Carry | Tap B throws `upgrades.throwDistance` + inherited velocity. Hold B ≥ `input.dropHoldSeconds` drops |

- One credit per nonterminal write-off. Five bodies, four credits. Catalogue costs six.
- First shop always offers Hips or Carry. Banking is legal.

## P1.6 Cars

- **Classes:** Sedan and Van. `vehicles.*` length, width, mass, cruise speed.
- **Forward sensor:** Nose rectangle, length `perception.forwardLength`, width car + body diameter.
- **Side sensors:** `perception.sideRadius` at `perception.sideHalfAngle`. Slow the car to `proto.sideSlowFraction`.
- **Reaction:** `perception.reactionDelay`. Intention shows during this window.
- **Manoeuvre:** Swerve one `world.laneWidth` away from the target over `proto.swerveSeconds`. Brake if no lane is free.
- **Commitment:** Lasts ≥ `traffic.commitHorizon`. No re-plan inside it.
- **Interruption:** A car or cone ahead inside stopping distance. Red cue, hard braking.
- **Allowance:** First positive-damage contact spends the appearance. Spent cars stay solid.
- **Schedule:** S–V–S–S–V × 8 = `run.appearances.road`. Interval `run.admissionInterval`. Lanes alternate.

## P1.7 Impact

- `assessed = min(damage.baseImpact × zone × mass × closing / damage.referenceSpeed, damage.bodyHealth)`.
- Zones `damage.zone.*`. Closing speed is relative normal velocity before response.
- Write-off bonus `rewards.writeOff`. Contract `run.quota.road`.

## P1.8 Levels

| Level | Layout | Tests |
|---|---|---|
| L1 Straight | Two-way road, shoulders, open ground | Raw locomotion, bait and lunge timing |
| L2 Barrier | South barrier with two `world.pedestrianGap` gaps; crates | Cover blocks sensing. Ambush through gaps |
| L3 Corner | Right-angle bend; crates inside the turn | Turning, facing and reading curved paths |

## P1.9 Prototype-only parameters

Not in the registry. Proposed for P1 tuning only.

| ID | Value | Unit | Use |
|---|---:|---|---|
| `proto.swerveSeconds` | 0.6 | s | Lateral swerve duration |
| `proto.swerveOuter` | 30 | world units | Max swerve toward the shoulder |
| `proto.shoulderWidth` | 24 | world units | Shoulder band beside the road |
| `proto.sideSlowFraction` | 0.6 | ratio | Side-sensor speed target |
| `proto.substeps` | 4 | per tick | Collision substeps instead of swept TOI |
| `proto.learningEnabled` | 0 | flag | Player-hit learning (`learning.*`) |
| `proto.zonesEverywhere` | 0 | flag | Show zones outside the view cone |

## P1.10 Simplifications vs Engineering spec

- Substep collision, not swept time of impact.
- Cars are kinematic. No car-car physics; following and corridor checks only.
- A car that overlaps a free cone shoves it aside.
- A held cone at write-off drops at the death point, else the nearest valid cone home.
- Replacement uses the first spawn point clear of cars.
- No checkpoint, records, release identity or exhibition watchdog.

## P1.11 Observation

- **Who:** You, then 3–5 people new to the game. One level each, then free choice.
- **Brief them with:** The control prompt only. No strategy hints.
- **Auto-logged:** First hit, first bait hit, first cone-assisted hit, first write-off, first purchase, first use of each node, ending.
- **Bait hit:** An impact while the car is committed, expiring or interrupted.
- **Watch:** Laughs, "one more", repeated deliberate tricks, frustration with turning, ignored nodes.
- **Ask after play:** What did the cars do? What did your upgrade change? What would you buy next time?
- **Compare:** Zones in cone vs everywhere. Default vs shorter `run.admissionInterval`.
- **Export:** Ending or pause screen → Export trace (JSON).

## P1.12 Decisions P1 feeds

- Keep, change or cut the facing-locked lunge.
- Whether the one-hit full write-off (fast lunge into a stopped car) breaks the loop.
- Whether Hips vs Carry is a real choice.
- Whether cone-limited prediction is fun or just hidden information.
- Admission interval and traffic density for P2.
- Whether P2 adds learning, a third branch, or the breadth tree.

## P1.13 Automated pre-checks — not human evidence

- **Tests:** `node test_sim.js` → 19/19 pass. Impact examples, lunge reach/speed, battery, throw, gesture, shop, determinism, 10-minute smoke on all levels.
- **Policies:** `node policy_check.js`, L1 Straight, 300 s, scripted bots.

| Policy | Write-offs | Impacts | Bait hits | Ending |
|---|---:|---:|---:|---|
| Stand in lane | 0 | 0 | 0 | — |
| Blind lunge every 1 s | 1 | 8 | 3 | — |
| Roadside lunge at passing cars | 5 | 18 | 0 | Licensed at 208 s |

- **Risk to D2.1:** Lunging from the shoulder at passing cars completes the contract without baiting.
- **Cause:** Side sensors only slow cars (`proto.sideSlowFraction`). The forward sensor misses a dummy on the shoulder.
- **P1 playtest must confirm or refute this with humans before any fix.**
