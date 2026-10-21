# DUMMIES — Prototype Observation Log

**Running log · Lawrence Lek · from 14 October 2026**

- **Purpose:** One section per build. Observations, responses, evidence, open questions.
- **IDs:** `O<build>.<n>` for observations. Responses cite the build that addresses them.
- **Status:** Open · Addressed (awaiting replay) · Confirmed · Parked · Design question.
- **Evidence labels:** *Designer play* = Lawrence's own sessions. *Automated* = scripted bots. Neither is newcomer evidence.
- **Parameters:** Registry IDs from Engineering §13.5. `proto.*` IDs are prototype-only.

## P1.0 — Finding the fun

**Build:** `dummies_p1.html` v1 · brief `DUMMIES_P1_Prototype_Brief.md` · 14 Oct 2026 · *Designer play*

| ID | Observation | Read | Response | Status |
|---|---|---|---|---|
| O1.1 | Cars drive erratically. They avoid cones ahead but sometimes turn for no reason. | Car AI defects plus unreadable intent | P1.1 predictability pass | Addressed (awaiting replay) |
| O1.2 | Seeing car scanners could be an unlock. Keep for now. Cars must be super predictable. | Scanner view is a Head-branch candidate | Scanners stay in the view cone. Committed paths now always shown. | Parked (unlock) · partly addressed |
| O1.3 | Losing bodies changes manoeuvrability; this matters. Later roads could issue better-built dummies with more health. The player gets the boss's health bar. | New progression axis: chassis grade | Per-road chassis grades in P1.1. Replaced by a difficulty setting in P1.4. | Parked (progression) |
| O1.4 | The first road or two should teach: you break easily, and you handle worse as you wear. | Onboarding through fragility | L1 Mk I chassis at 300 health (P1.1). Visible damage states (P1.2). | Partly addressed — handling loss is still reach only |
| O1.5 | Road surfaces would be fun. The corner matters: hard at first, but the controls make sense. | Terrain → later build. Keep the corner. | No change | Open |

**Automated (P1.0):** Roadside lunging at passing cars won without baiting (brief §P1.13).

## P1.1 — Predictable cars, chassis grades

**Build:** `dummies_p1.html` v2 · 14 Oct 2026 · Addresses O1.1, O1.3; partly O1.2, O1.4.

### Car rules

- **Scanner shape:** The forward scanner follows the lane, bending with the road. It no longer points straight off a bend.
- **Scanner width:** Car width plus the target's size. Shoulder cones no longer trigger dodges.
- **Swerves fixed in space:** Cosine-eased over `proto.swerveLength`. The drawn path is the route.
- **Smallest dodge:** The least lateral move that clears the target and every free cone on the new route.
- **Lane discipline:** Stay in lane and shoulder first. Cross the centre line only into an empty oncoming lane.
- **Indicators:** Amber lights blink on the swerve side during intention and swerve.
- **Return to lane:** Only after passing the dodged object by `proto.returnClearance`. Signals for `proto.returnSignalSeconds` first.
- **Yield:** A car in the oncoming lane facing traffic returns first. No head-on standoffs.
- **Interruption:** The car brakes along its committed route. It never re-steers.
- **Cones:** Cars shove an overlapped cone sideways, never ahead of themselves.
- **Heading:** Turn rate capped at `proto.carYawRate`. No visual snaps.

### Chassis grades

FARSIGHT issues sturdier test bodies as the subject qualifies.

| Road | Grade | Health ID | Health |
|---|---|---|---:|
| L1 Straight | Mk I | `proto.chassis.straight.bodyHealth` | 300 |
| L2 Barrier | Mk II | `proto.chassis.barrier.bodyHealth` | 500 |
| L3 Corner | Mk III | `proto.chassis.corner.bodyHealth` | 800 |

- The grade value replaces `damage.bodyHealth` for that road, including the assessment cap.
- Licensed ending offers the next road on its new chassis.

### Parameter changes (prototype-only)

| ID | Change | Value |
|---|---|---:|
| `proto.swerveSeconds` | Removed | — |
| `proto.swerveLength` | Added | 120 world units |
| `proto.swerveOuter` | 30 → 34 | world units |
| `proto.returnSignalSeconds` | Added | 0.5 s |
| `proto.returnClearance` | Added | 30 world units |
| `proto.carYawRate` | Added | 240 degrees/s |
| `proto.pathsEverywhere` | Added | 1 (on) |
| `proto.chassis.*.bodyHealth` | Added | see grades |

### Automated evidence

`node car_metrics.js` · same scripted dummy wandering across the road, punting cones · 300 s · `run.admissionInterval` 6 · health 800 · quota off.

| Metric | Straight P1.0 → P1.1 | Barrier P1.0 → P1.1 | Corner P1.0 → P1.1 |
|---|---|---|---|
| Cars admitted (of 40) | 21 → 40 | 21 → 40 | 40 → 40 |
| Lane changes per car | 4.81 → 2.20 | 19.0 → 1.80 | 2.15 → 1.02 |
| Safety interruptions | 73 → 12 | 368 → 4 | 7 → 0 |
| Heading snaps > 360°/s | 67 → 0 | 98 → 0 | n/a (bend) |
| Peak yaw rate °/s | 3,615 → 148 | 4,376 → 143 | n/a (bend) |

`node policy_check.js` · L1 Mk I chassis:

| Policy | Write-offs | Impacts | Ending |
|---|---:|---:|---|
| Stand in lane | 0 | 0 | — |
| Blind lunge every 1 s | 1 | 6 | — |
| Roadside lunge at passing cars | 5 | 5 | Licensed at 52 s |

- **Read:** Mk I dies in one roadside hit. Wear rarely shows before death on L1.
- **Risk to O1.4:** Fragility is taught; gradual loss of handling is not.

### Questions for the P1.1 session

- Do cars now read as predictable? Note any turn that still looks unexplained.
- Does Mk I feel fragile and funny, or trivial?
- Do you see reach shrink before a write-off?
- With paths always shown, do scanners still matter? (O1.2)
- Does the roadside lunge still dominate for a human?

### Candidates for P1.2

- Wear also lowers turn rate or run speed, not just reach (O1.4).
- Mk I at ~400 so one ordinary hit wounds rather than kills.
- Scanner view as a purchasable Head node (O1.2).
- One low-grip surface on the corner (O1.5).
- Side sensors that also dodge, to curb roadside lunging.

## P1.1 observations

**Build seen:** `dummies_p1.html` v2 · 14 Oct 2026 · *Designer play*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.6 | Light graphics amendments wanted. | P1.2 lighting, relief and cone pass | Addressed (awaiting replay) |
| O1.7 | The dummy should visibly degrade as it absorbs damage. | Staged damage states | Addressed (awaiting replay) |
| O1.8 | Add juice: camera shake, player shake, small animations that raise the stakes. | Juice pass | Addressed (awaiting replay) |
| O1.9 | Cones should be 20% larger. They don't read as cones. | Radius override and new top-down cone | Addressed (awaiting replay) |
| O1.10 | Cones should not start in the road. | All cone homes moved off the road | Addressed |
| O1.11 | Drop shadows on everything, sun at 1:30, to throw items into relief. | Height-based shadows to 7:30 | Addressed (awaiting replay) |
| O1.12 | A car blocked by cones for 5 s honks (sound, flashing lights). Then drones move the cones. | Honk and drone recovery | Addressed (awaiting replay) |

## P1.2 — Damage you can see, juice, drones

**Build:** `dummies_p1.html` v3 · 14 Oct 2026 · Addresses O1.6–O1.12.

### Dummy damage states

Wear = 1 − health / `damage.bodyHealth`. The facing arrow never changes.

| Wear from | Visible change |
|---:|---|
| 0% | Five dents appear one by one and deepen. Each chassis dents in its own places. |
| 0% | Yellow fades toward grey-brown. |
| 20% | Scorch marks spread across the body. |
| 35% | The shoulder bar bends. |
| 40% | The body sways. |
| 45% | Smoke trails from the body. |
| 55% | The right arm joint is gone. Exposed wires show. |
| 60% | The body trembles constantly. |
| 70% | The head cracks and sits off-centre. Sparks fly. A red vignette pulses at the screen edge. |
| HUD | The health bar flashes red below 30% health. |

### Juice

Presentation constants in `game.js`. Scaled to 25% under reduced-motion settings.

| Event | Response |
|---|---|
| Lunge | Dust puff behind the body. Small camera kick. |
| Impact | Camera shake scales with assessed impact. Body flinches and flashes white. Car pulses and flashes. Sparks. White contact flash. Impact number pops. |
| Touching a spent car | Small kick and a dull thud. |
| Write-off | Heavy shake. Field flash. Sparks and smoke. A WRITTEN OFF stamp slams onto the wreck. |
| Cone in flight | Lifts in an arc; its shadow stretches. |

### Light and relief

- **Sun:** At 1:30. Shadows fall toward 7:30.
- **Shadow length:** Object height × `proto.art.shadowScale`.
- **Heights:** Cars use `vehicles.sedan.height` and `vehicles.van.height` from the registry. Others below.
- **Lit edges:** Crates and barriers catch light on their top and right edges. Car roofs and cones shade from the top right.

| ID | Value | Unit |
|---|---:|---|
| `proto.art.shadowScale` | 0.3 | ratio |
| `proto.art.crateHeight` | 30 | world units |
| `proto.art.barrierHeight` | 14 | world units |
| `proto.art.coneHeight` | 14 | world units |
| `proto.art.dummyHeight` | 18 | world units (+8 while lunging) |
| `proto.art.droneHeight` | 70 | world units |

### Cones

- **Size:** `props.cone.radius` overridden 6 → 7.2 for P1.2. Collision, placement and drawing all use it.
- **Design:** Square base, shaded cone, white reflective band, tip.
- **Placement:** Every cone starts off the road and shoulders.

| Road | Cone homes |
|---|---|
| L1 Straight | (110,196) (310,190) (500,414) (690,420) |
| L2 Barrier | (90,202) (260,198) (540,202) (150,428) (700,428) |
| L3 Corner | (200,330) (320,552) (660,220) (420,120) |

### Honking and drones

- **Blocked:** Car below 2 units/s with a free cone on its route within 70 units.
- **Honk:** After `proto.honkSeconds` blocked. Horn, hazard lights, flashing headlights and a HONK bubble. Repeats every 1.4 s.
- **Drone:** Dispatched from off-field top right at `proto.droneSpeed`.
- **Pickup and drop:** Each takes `proto.droneLiftSeconds`.
- **Return:** The cone goes to its own home, else the nearest free home.
- **Abort:** If the player takes the cone first, the drone leaves.
- **Conservation:** No cone is created or deleted.
- **Braking:** Cars now stop just short of an obstacle, not at first sight. Blocked cars sit visibly at the cone.

| ID | Value | Unit |
|---|---:|---|
| `proto.honkSeconds` | 5 | s |
| `proto.droneSpeed` | 240 | world units/s |
| `proto.droneLiftSeconds` | 0.5 | s |

### Automated evidence

- `node test_sim.js` → 23/23. New: honk after ≥ 5 s, drone drop and traffic resuming; all cones start off the road.
- `node car_metrics.js` (same setup as P1.1):

| Metric | Straight | Barrier | Corner |
|---|---:|---:|---:|
| Cars admitted (of 40) | 40 | 40 | 40 |
| Lane changes per car | 1.7 | 1.4 | 0.6 |
| Safety interruptions | 0 | 0 | 0 |
| Heading snaps > 360°/s | 0 | 0 | n/a |

### Questions for the P1.2 session

- Do you read the dummy's state at a glance before checking the health bar?
- Does the juice raise the stakes or add noise?
- Do the cones now read as cones?
- Are the drones funny and in-world? Do they slow play down?
- Do shadows help you read height and position?

### Candidates for P1.3

- Wear also lowers turn rate or run speed (O1.4).
- Mk I at about 400 health so ordinary hits wound before they kill.
- Scanner view as a purchasable Head node (O1.2).
- One low-grip surface on the corner (O1.5).
- Side sensors that also dodge, to curb roadside lunging.
- Expose juice constants in the tuning panel.

## P1.2 observations

**Build seen:** `dummies_p1.html` v3 · 14 Oct 2026 · *Designer play*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.13 | Damage should reflect speed and momentum. A lunge into a slow car scores like a car hit, but it is a sprint into a parked car. | Newtonian impulse damage | Addressed (awaiting replay) |
| O1.14 | Add mild recoil. It matters for feel. | Physical recoil, scaled | Addressed (awaiting replay) |
| O1.15 | The angle of the hit matters a great deal. | Damage uses the normal component only | Addressed (awaiting replay) |

## P1.3 — Newtonian impact and recoil

**Build:** `dummies_p1.html` v4 · 14 Oct 2026 · Addresses O1.13–O1.15. Toggle `proto.damageModel` restores the V29 formula for comparison.

### Physics basis

- **Contact normal `n`:** Points from the dummy into the car at the contact point.
- **Closing speed:** `u = (v_dummy − v_car) · n`. Only the normal component counts. Frame-independent.
- **Angle:** `θ` between relative velocity and `n`. Normal speed falls as `cos θ`.
- **Reduced mass:** `μ = m_d·m_c / (m_d + m_c)`.
- **Impulse:** `J = (1 + e)·μ·u`. Equal and opposite on both bodies.
- **Dummy Δv:** `J / m_d = (1 + e)·m_c/(m_d + m_c)·u`. A light body takes almost all the Δv.
- **Energy absorbed:** `½·μ·(1 − e²)·u²`. Grows with the square of closing speed.
- **Friction:** Tangential impulse ≤ `μ_f·J`. Drags the dummy along a glancing car.

### Rules

- **Damage:** `damage.baseImpact × (Δv / Δv_ref)^proto.damageExponent`. `Δv_ref` = standing dummy, sedan head-on at `damage.referenceSpeed`.
- **Exponent 2:** Tracks absorbed energy. Glancing hits fall with `cos² θ`.
- **Strike cap:** The dummy's own approach counts at most `proto.dummyStrikeSpeed`. The lunge keeps its full visual speed. This is the one non-Newtonian rule.
- **Mass:** `proto.dummyMass` relative to `vehicles.sedan.mass`. Car mass changes damage by under 2%; speed dominates.
- **Zones:** `damage.zone.*` unused in this model. Angle replaces them.
- **Recoil:** Physical post-impact velocity × `proto.recoilScale`. Always clears an approaching car.
- **Stagger:** No control for `proto.recoilSeconds`. The lunge ends. Spent cars still bounce you, without damage.
- **Cap:** Assessment still capped at `damage.bodyHealth`.

| ID | Value | Unit |
|---|---:|---|
| `proto.damageModel` | 1 | flag (0 = V29 formula) |
| `proto.damageExponent` | 2 | power |
| `proto.dummyMass` | 0.056 | × sedan mass (≈ 78 kg vs 1,400 kg) |
| `proto.restitution` | 0.3 | ratio |
| `proto.dummyStrikeSpeed` | 100 | world units/s |
| `proto.contactFriction` | 0.3 | ratio |
| `proto.recoilScale` | 0.6 | ratio |
| `proto.recoilSeconds` | 0.35 | s |

### Scenario table

Assessed damage at `damage.bodyHealth` 800. `node test_sim.js` checks the bold cases against hand-computed values.

| Scenario | V29 | P1.3 | Angle | Recoil u/s |
|---|---:|---:|---:|---:|
| **Sedan 138 hits a standing dummy head-on** | 100 | **100** | 0° | 143 |
| **Van 120 hits a standing dummy head-on** | 130 | **78** | 0° | 125 |
| Dummy walks 81 into a parked sedan | 18 | 34 | 0° | 11 |
| **Early lunge into a parked sedan** | 250 | **53** | 0° | 14 |
| Early lunge into a slow sedan (30) head-on | 800 | 89 | 0° | 36 |
| **Early lunge into a cruising sedan head-on** | 800 | **297** | 0° | 143 |
| Early lunge into the side of a passing sedan | 250 | 53 | 7° | 26 |
| **Sedan 138 clips the dummy at 60°** | 30 | **25** | 60° | 76 |
| Sedan 138 grazes the dummy at 80° | 10 | 3 | 80° | 29 |

- **Read:** The car now delivers the damage. A head-on bait pays about six times a lunge into a parked car.
- **Read:** The van hurts less than the sedan because it is slower. Mass barely matters to a light body.

### Automated evidence

- `node test_sim.js` → 24/24.
- `node policy_check.js`, L1 Mk I:

| Policy | P1.2 | P1.3 |
|---|---|---|
| Roadside lunge at passing cars | Licensed at 52 s, 5 impacts | Licensed at 268 s, 23 impacts |
| Blind lunge every 1 s | 2 write-offs | 1 write-off |
| Stand in lane | 0 impacts | 0 impacts |

- **Read:** Roadside lunging still completes the contract, at five times the time. The P1.0 dominance risk is reduced, not removed.

### Questions for the P1.3 session

- Does a head-on bait now feel like the big payoff?
- Is the recoil mild enough to keep control, and strong enough to feel?
- Does the impact label (head-on, angled, glancing) teach angle?
- Should vans hurt more for their height and front shape? That needs a non-mass factor.

## P1.3 observations

**Build seen:** `dummies_p1.html` v4 · 14 Oct 2026 · *Designer discussion*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.16 | Keep health constant while prototyping. Park chassis upgrades, or treat them as difficulty. | Constant health; difficulty setting | Decided |

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

### Automated evidence

- `node test_sim.js` → 24/24. Difficulty test replaces the chassis-grade test.
- `node policy_check.js`, L1 Standard: roadside lunging reaches 4 write-offs in 300 s, 25 impacts, no ending. Stand in lane: 0 impacts.

### Questions for the P1.4 session

- Is Standard the right default for a first visit?
- Does one bait-then-finish per body feel like a satisfying rhythm?

## P1.4 observations

**Build seen:** `dummies_p1.html` v5 · 14 Oct 2026 · *Designer play*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.17 | Progress by road: L1 needs 1 write-off, L2 needs 2, then L3. | Three-road campaign | Addressed (awaiting replay) |
| O1.18 | Health should be 300, not 400. | Standard = 300 | Addressed |
| O1.19 | Too few cars; too linear even for L1. | Denser, irregular traffic | Addressed (awaiting replay) |
| O1.20 | There should be blind spots to show. | Sensor shadows drawn | Addressed (awaiting replay) |
| O1.21 | The pillars sit too far from the road to matter. | Pillars at the road edge | Addressed (awaiting replay) |

## P1.5 — Three-road campaign, traffic, blind spots

**Build:** `dummies_p1.html` v6 · 14 Oct 2026 · Addresses O1.17–O1.21.

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

### Traffic

- **Density:** Admission roughly every 3 s instead of 12 s. Three to four cars on screen.
- **Irregular:** Spacing varies ±`proto.traffic.jitter`. Lane order is uneven. Both follow a fixed golden-ratio sequence, so runs stay reproducible.
- **Supply:** `run.appearances.road` overridden 40 → 100 per road.

| ID | Value | Unit |
|---|---:|---|
| `proto.traffic.straight.interval` | 3 | s |
| `proto.traffic.barrier.interval` | 3 | s |
| `proto.traffic.corner.interval` | 3.5 | s |
| `proto.traffic.jitter` | 0.4 | ± fraction of interval |
| `run.appearances.road` | 100 | appearances (override of 40) |

### Pillars and blind spots

- **Pillars:** Flyover columns now stand at the road edge, replacing distant crates. Shadow height `proto.art.pillarHeight` 60.
- **L1:** Three north, two south, staggered.
- **L2:** Three north. The south barrier with gaps remains.
- **L3:** One in the inside of the bend, one beside the vertical leg, one at the west straight, one outside the bend.
- **Blind spots:** Pillars, barriers and vans cast sensor shadows from each car's nose. Shown inside the scanners as pale aqua wedges labelled BLIND.
- **Tactic:** Stand in a pillar's shadow and side sensors miss you. The car keeps full speed. Step out for a head-on hit.

### Car fixes found in testing

- **Swerves avoid structures:** Routes are checked against pillars and barriers.
- **Swerves clear the target the whole way:** A car stopped close to you no longer clips you while pulling out. It waits.
- **Honking at you:** A car blocked by the dummy for `proto.honkSeconds` honks. No drone comes.

### Automated evidence

- `node test_sim.js` → 26/26. New: campaign carry-over and quotas; swerve routes clear pillars.
- `node policy_check.js` (L1, Standard 300):

| Policy | Result |
|---|---|
| Stand in lane | 0 impacts in 300 s. Cars stop and honk. |
| Blind lunge every 1 s | Road cleared at 18 s |
| Roadside lunge at passing cars | Road cleared at 9 s, 3 impacts |

- **Read:** With dense traffic and 300 health, a skilled player clears L1 within seconds. That suits an intro road; check whether humans find it too quick.

### Questions for the P1.5 session

- Does the 1 → 2 → 3 rhythm feel like rising stakes?
- Do blind spots read, and do you use pillars to ambush?
- Is three to four cars on screen busy enough, or still linear?
- Is clearing L1 in under a minute satisfying or anticlimactic?

## P1.5 observations

**Build seen:** `dummies_p1.html` v6 · 14 Oct 2026 · *Designer play*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.22 | Cars keep driving when the dummy is right in front of them. They should stop slightly beyond the default lunge length. Otherwise you just face a car and lunge at it. | Standoff stop | Addressed (awaiting replay) |

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

### Automated evidence

- `node test_sim.js` → 27/27. New: the car stops beyond lunge contact, never hits a standing dummy, and honks. The swerve-smoothness test now uses a cone.
- `node policy_check.js` (L1, Standard 300):

| Policy | Result |
|---|---|
| Stand in lane | 0 impacts in 300 s |
| Blind lunge every 1 s | Road cleared at 108 s (was 18 s) |
| Lunge from the roadside at cars within 150 | Road cleared at 9 s, 3 impacts |

- **Finding:** The roadside bot still wins fast. It waits on the shoulder, outside the lane corridor. As a car passes, it lunges diagonally into the car's front at 23–37° and lands 160–175 damage. The standoff only covers a dummy *in* the lane.
- **Option (not built):** Cars also hold back from a visible dummy within lunge range of their path ahead. Blind spots would then become the main way in.

### Questions for the P1.6 session

- Does the standoff read as cautious, or as cars freezing?
- Is the roadside diagonal lunge a fun skill or an exploit?
- Should stopped cars reverse away when you walk toward them?

## P1.6 observations

**Build seen:** `dummies_p1.html` v7 · 14 Oct 2026 · *Designer discussion*

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.23 | Cars need clear logic for stopping, swerving and driving on. | Decision table, DB4 | Addressed (awaiting replay) |
| O1.24 | Vehicle types could behave differently by role and state, e.g. emergency. | Profile proposal, DB6 | Proposed |
| O1.25 | The standard car should drive like an ordinary, aware driver under the UK or US Highway Code: slowing, with real braking distances. | Standard driver | Addressed (awaiting replay) |

## P1.7 — Highway Code driver

**Build:** `dummies_p1.html` v8 · 14 Oct 2026 · Spec: `DUMMIES_Driver_Behaviour.md`.

- **Real driving numbers:** 0.67 s reaction, 3 m/s² comfortable braking, 6.5 m/s² emergency braking, 3.5 m/s² acceleration, two-second gap, 46 m look-ahead (DB2).
- **Near a visible dummy:** Covers the brake and slows to 15 mph.
- **Dummy in the road:** Stops beyond lunge range and waits. After 8 s, passes at 10 mph with 2 m clearance, if the oncoming lane is clear.
- **Too close to stop:** Brakes hard in a straight line. No emergency swerve.
- **Horn:** Only at the dummy, as a danger. At cones the car flashes its lights instead.
- **Hidden dummy:** A dummy behind a pillar is not seen. The car keeps full speed.
- **New cue:** A grey warning triangle on the roof marks a cautious car.

### Automated evidence

- `node test_sim.js` → 30/30. New tests: patient slow pass with 2 m clearance; caution speed past a dummy at the kerb; no caution for a dummy hidden downstream of a pillar.
- `node policy_check.js`, L1 Standard:

| Policy | P1.6 | P1.7 |
|---|---|---|
| Stand in lane | 0 impacts | 0 impacts. Cars stop, honk at 5 s, pass slowly at 8 s. |
| Blind lunge every 1 s | Cleared at 108 s | Cleared at 18 s |
| Roadside lunge at cars within 150 | Cleared at 9 s, 3 impacts | Cleared at 12 s, 3 impacts |

- **Read:** Roadside lunging still works. A determined lunge into a car slowing at 15 mph still hurts, because the dummy's own strike (`proto.dummyStrikeSpeed` 100) outweighs the slower car.
- **Read:** Blind lunging got easier. Cars now pass slowly within lunge range after waiting, which a real driver would do. Change `proto.driver.patienceSeconds` or the standoff to tune it.
- **Read:** Traffic flows less when the dummy blocks the road. On the barrier road, 21 of 40 cars were admitted in 5 minutes with a wandering dummy.

### Questions for the P1.7 session

- Do cars now read as ordinary, careful drivers?
- Is the patient slow pass a fair opportunity or a loophole?
- Which profile next: Courier vans or a rare Emergency vehicle?

## P1.7 observations

**Build seen:** `dummies_p1.html` v8 · 14 Oct 2026

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.26 | The Highway Code must reflect right-side driving. Values are a starting point. | Keep-right mapping, Driver DB1a. All values marked Trial. | Addressed |
| O1.27 | Move the stop toward a real 2–5 m. Accept lunges at stopped cars, but cars then learn to keep more distance. | 4.1 m stop; per-model learned stop line | Addressed (awaiting replay) |
| O1.28 | A cone stopped a car; a van swerved around it. A drone cleared the cone. The car drove on; the van stayed stuck. | Head-on deadlock found. Reverse-and-return plus watchdog. | Addressed (awaiting replay) |

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

### O1.28 diagnosis

- **Reproduced:** Van in the oncoming lane, halted mid-pass. Oncoming sedan nose to nose, 14 u apart.
- **Van:** Waited for the road ahead to clear. It never would.
- **Sedan:** An oncoming car does not count as a stopped obstacle. It crept forward until the gap closed.
- **No recovery rule existed** for an interrupted car.

### Automated evidence

- `node test_sim.js` → 33/33. New: stop at 50 ± 6; learned stop line for the next car, van unaffected, kept across roads; head-on deadlock clears and both cars exit; stale halted plan clears.
- `node policy_check.js`, L1 Standard:

| Policy | P1.7 | P1.8 |
|---|---|---|
| Stand in lane | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Cleared at 18 s | Cleared at 18 s, 3 impacts |
| Roadside lunge at cars within 150 | Cleared at 12 s, 3 impacts | Cleared at 7 s, 2 impacts |

- **Scripted 4-minute runs:** No unstick events on any road. Longest stop 0.3 s. Every admitted car exited.
- **Read:** The deadlock needs a cone-pass into the oncoming lane at the wrong moment. Rare, but it froze the road.

### Questions for the P1.8 session

- Does a 4 m stop make cars feel real, or too easy to hit?
- Is the learned retreat visible enough in play?
- Does the reversing van read as giving way?

## P1.8 observations

**Build seen:** `dummies_p1.html` v9 · 14 Oct 2026

| ID | Observation | Response | Status |
|---|---|---|---|
| O1.29 | On L3 Corner, the cars' forward detection curves with the road. Sensors should point straight; only the road curves. | Straight sensors, Driver DB3a | Addressed (awaiting replay) |

## P1.9 — Straight sensors

**Build:** `dummies_p1.html` v10 · 14 Oct 2026 · Spec: `DUMMIES_Driver_Behaviour.md` DB3.

- **Forward beam:** A rectangle from the nose along the heading. It no longer bends with the road.
- **Driver's field:** A wider straight rectangle for noticing the dummy near the road.
- **Route:** Anything seen is then judged against the car's route.
- **Blind bend:** Around a bend the dummy is only near. The car slows to 15 mph and finds the dummy late.
- **Cue:** The hatched beam now points straight past the bend. Pillars past the bend cast BLIND wedges into it.
- **Toggle:** `proto.sensorStraight` (TUNING). 0 restores the road-following sensors.
- **Unchanged:** Car following stays route-based.

### Automated evidence

- `node test_sim.js` → 34/34. New: on L3 the road-following sensor sees a dummy past the bend at 559 u. The straight beam sees it at < 100 u. The driver still notices it at > 500 u. A dummy on the verge straight ahead never counts as in path.
- **L3 scenarios, lane 0 sedan:**

| Dummy | Road-following | Straight |
|---|---|---|
| 40 u past the bend exit | Stops 50 u short | In path at 62 u; hit, 41 damage |
| Mid-bend, 45° | Stops 47 u short | In path at 55 u; hit, 47 damage |
| Before the bend | Stops; passes after 8 s | Same |
| Verge straight ahead, off route | Caution only | Caution only |

- `node car_metrics.js`: L1 and L2 identical with the toggle on or off. L3: 28 → 13 stops for the dummy.
- **Scripted 4-minute L3 run:** 7 → 3 impacts, 331 → 501 total damage. Every car exited; no unstick events.
- **Smoke L3:** Cleared at 160 s. Before, it failed at 359 s.

### Questions for the P1.9 session

- Does the bend now read as a blind corner worth ambushing?
- Is L3 now too easy?
- Should cars slow for bends? They take the 8 m-radius bend at 25 mph.

## P1 freeze

**Frozen:** 15 Oct 2026 at P1.9 · Artifact version 10 · `node test_sim.js` 34/34.

### Final files

| File | Role |
|---|---|
| `dummies_p1.html` | Playable build. Single file, opens in a browser. |
| `sim.js` | Deterministic simulation. No DOM. |
| `game.js` | Renderer, input, UI, audio, tuning panel. |
| `shell.html`, `build.py` | Page wrapper; bundles `sim.js` + `game.js` into the HTML. |
| `test_sim.js` | Headless tests, 34. |
| `policy_check.js`, `car_metrics.js` | Bot policies; car predictability metrics. |
| `DUMMIES_P1_Prototype_Brief.md` | Slice brief. |
| `DUMMIES_Prototype_Log.md` | This log, O1.1–O1.29. |
| `DUMMIES_Driver_Behaviour.md` | Driver spec, DB1–DB8. |
| `history/sim_p1.0–1.9.js`, `history/game_p1.1–1.9.js` | Snapshots per build. |

### State at freeze

- **Awaiting replay:** 20 observations addressed in code, not yet replayed by a player.
- **Carried to P2:**
  - O1.2 Scanner view as an unlock (Head branch).
  - O1.3 Chassis progression. Health is a difficulty setting for now.
  - O1.4 Handling loss with wear. Only reach shrinks today.
  - O1.5 Road surfaces.
  - O1.24 Vehicle profiles: Courier, Learner, Emergency, Rattled, Bus (DB6).
- **Open design questions:** Bend speed for cars. L3 balance with straight sensors. Patient-pass loophole. Roadside diagonal lunge.
- **Prototype-only parameters:** All `proto.*` IDs in `sim.js` PROTO and the registry overrides in OVERRIDES. None promoted to the registry.

## P2 — see `DUMMIES_P2_Prototype.md`

P2.0–P2.2 are logged in their own prototype doc.

## P3 observations

**Builds seen:** `dummies_p3.html` (P3 drafts) · 20 Oct 2026 · *Designer discussion*

| ID | Observation | Response | Status |
|---|---|---|---|
| O3.1 | Show only the essentials. Scale fonts realistically for information. | Essentials HUD at registry type sizes | Addressed (awaiting replay) |
| O3.2 | Rebuild as v3: new pixel principles, 640 × 360 screen, 400 × 300 field. | P3 grid, `ui.artScale` 2 | Addressed |
| O3.3 | Try a Chongqing Sinofuturist night palette: neon red, blue, yellow on dark. | `?palette=night` option | Addressed (option) |
| O3.4 | Try a cyberpunk landscape: buildings and barriers instead of trees. | `?palette=cyber` option | Addressed (option) |
| O3.5 | Buildings and barriers must be real obstacles (Fix A). | Solid city statics, `proto.city` | Addressed |
| O3.6 | Rename lunge to DASH. | Display rename; IDs kept | Addressed |
| O3.7 | Too much info on the side bars. Health matters most. Top bar: level, points, cars left or timer. Dummy body on the right. | HUD v3 | Addressed (awaiting replay) |
| O3.8 | The chassis should show damage by body part. | Locational damage and doll | Addressed (awaiting replay) |
| O3.9 | On dark ground the dummy's black outline is invisible. | Rim outline, night and cyber | Addressed (awaiting replay) |
| O3.10 | Where the dummy is hurt should cut its performance. | Part effects, `proto.parts.effects` | Addressed (awaiting replay) |
| O3.11 | Surfaces: water or oil where the dummy slides and cannot dash. | D18: layered patches (O3.21) | Answered; not built |
| O3.12 | Should the dash stay unlimited, or be a power-up? | D19 → decision 112 (O3.22) | Decided |
| O3.13 | Should the dummy have states, like Super Mario World? | D20 → decision 115 | Decided |
| O3.14 | Lore and narrative consistency needs a system. | D23 → decision 114 (O3.26) | Addressed |
| O3.15 | Level generation: park for later. Three static worlds stay. | Decision 104 | Parked |
| O3.16 | The UI dummy is scaled up and super blocky. It should match the screen's resolution. | Native-resolution chassis doll | Addressed (awaiting replay) |
| O3.17 | The dummy should be cute and appealing, like the real one. Eyes and ears visible. | New face; field sprite eyes and ears | Addressed (awaiting replay) |
| O3.18 | Design every upgrade component, visible on the enlarged model. | 15 module components; shop try-on | Addressed (awaiting replay) |
| O3.19 | Do the cyberpunk colour scheme. | Cyber is the build default; cyber chassis ramps | Addressed (awaiting replay) |
| O3.20 | Change the outline colours on dark ground. | Rim on every sprite, value hierarchy | Addressed (awaiting replay) |
| O3.21 | Surfaces: floor tile type, or a layer on top? | Layered: one ground per tile, patches on top (GDD 11.3) | Answered; not built (D18) |
| O3.22 | Two dashes, not three. Keep the battery limit. Leg damage shortens the dash. | `battery.capacity` 2; `proto.parts.legDashLoss` 1.5 | Addressed (awaiting replay) |
| O3.23 | Wear and body-part damage carry the dummy's state. | Decision 115; no Mario power states | Decided |
| O3.24 | Upgrades remain. | Decision 116; hits never strip modules | Decided |
| O3.25 | Sinofuturist cyber is canon. | Decision 113; day and night stay options | Decided |
| O3.26 | Lore and story need a system, tied to upgrades and vehicle behaviour. RPG and scrollable city later. | `fleet.json` conditions and claims; `check_lore.py` | Addressed |
| O3.27 | Barriers 5–10% of the road. Buildings ~25% of the level. Level design needs focus. | City v2: blocks 25–27%, jerseys 7–8% of road edge | Addressed (awaiting replay); level design open |
| O3.28 | Bring barks back. Vehicle names at 50% size, still readable. | Pixel bubbles; tags in a 6-px face (`ui.typeFieldLabel` 12) | Addressed (awaiting replay) |
| O3.29 | Add the new values to the parameter file. | Registry `edit39-2026-10-20` | Addressed |
| O3.30 | Exhibition hardware: Windows 11 gaming laptop, for now. | Decision 121 | Decided |
| O3.31 | Generate model names and bark text in a separate database. | `content/db/fleet.json`: 32 models, 123 lines | Addressed |
| O3.32 | Map: Zelda screens, continuous scroll (GTA 1), or static? Maybe 9 tiles per level. | D24 → decisions 125–127 (O3.34) | Decided |
| O3.33 | D18: a few random spots of water on the road and surfaces, 2% of tiles. | Puddle patches; no dash from water; cars brake late | Addressed (awaiting replay) |
| O3.34 | D24: Zelda-style. Continuous scroll later. Rebuild the rules required. Try it out. | 3 × 3 districts, gates, flip, district map | Addressed (awaiting replay) |
| O3.35 | D25: Chongqing is just a visual reference. | Decision 128 | Decided |
| O3.36 | D26: Big battery raises capacity from 2 to 3. | `upgrades.bigCapacity` 3; in the P3 shop | Addressed |
| O3.37 | Level design: same screen size with a new generated street and cityscape? Or a larger viewable area for more roads and assets? | Generated screens built; viewable area D27 | Partly addressed; D27 open |
| O3.38 | "I can't actually move when I'm at the edge of the screen." | Edges open wherever the ground is open on both sides; dotted line where a building across stops you (decision 131) | Addressed (awaiting replay) |
| O3.39 | Base health 800; easy 600; difficult 1000. | `proto.health.*` 600/800/1000; `damage.bodyHealth` 800 (decision 132) | Addressed |
| O3.40 | One flat level is monotonous. Shenzhen and Chongqing have overpasses. How to do verticality top-down? | Flyover decks with traffic (decision 137); two-layer play is D29 | Partly addressed |
| O3.41 | Is 16 × 16 right? | Yes: `world.tileSize` 32 units (decision 133) | Answered |
| O3.42 | New 3 × 3 city maps: flyovers, skyscrapers, low-rise, barriers, a centre focal point. Five, cycled. | Five districts, 15 baked layouts (decisions 134–136) | Addressed (awaiting replay) |
| O3.43 | Progression zone by zone: clear five areas with clear distinctions. | Fixed order, quotas 1–4 (decision 134) | Addressed (awaiting replay) |
| O3.44 | Pixel packs on itch.io are mostly RPG Maker. | Reference only: 48-px oblique tiles, AI-assisted, side-view cars | Answered |
| O3.45 | Flyovers overlap roads: a higher road must cross a lower one by at most one tile. | Crossing rule (decision 139); full roundabout ring (140); all layouts rebaked | Addressed (awaiting replay) |
| O3.46 | Field 400 px is only 25 tiles. Try 640 × 480 (40 × 30 tiles). Test quickly. | `?field=large` test build, 10 baked layouts (decision 141) | Superseded by O3.47 |
| O3.47 | 400 × 320 (25 × 20 tiles), 5:4. Make it canonical. | Field 400 × 320; layouts rebaked; large test removed (decision 142) | Addressed |
| O3.48 | Bound the city. Roads off the edge get a checkpoint with an arm. Walls, or landscape you cannot cross. | River on row 1, walls elsewhere; checkpoints with booms on roads and decks (decisions 143–144) | Addressed (awaiting replay) |
| O3.49 | Three levels: underground 0, ground 1, overground. A sample scene had two overground levels. | One overground level; decks never cross (decision 145) | Addressed (awaiting replay) |
| O3.50 | Overpass barrier tile with a street light, maybe broken. Jump down, Zelda-style. Hitting a car below costs damage. | Parapet lamps; broken parapets over roads; drop and landing hit (decision 147) | Addressed (awaiting replay) |
| O3.51 | Staircases down below the street in places. A staircase module up to the highway. | Underpasses and up-stairs (decision 146); deck cars are full drivers (148) | Addressed (awaiting replay) |
| O3.52 | Flyovers always pass perpendicular to the road beneath. On columns, so horizontal only, or the columns can't be seen. | Square-crossing rule; raised decks on column pairs (decisions 152–153) | Addressed (awaiting replay) |
| O3.53 | What if roads had a tight turn, a more circular turn and a stepped turn? | Three turn styles, one per screen; cars slow for bends (154–155) | Addressed (awaiting replay) |
| O3.54 | No differentiation between ground roads, raised highways and the lower level. | Pale concrete decks, asphalt streets, tiled underground cutaway (156) | Addressed (awaiting replay) |
| O3.55 | Single-storey, double-storey and skyscrapers. Buildings need logic: alleys between them, equal distance from the sidewalk. | Storey tiers; frontage rows at one setback with alleys (157–158) | Addressed (awaiting replay) |
| O3.56 | Brake lights cast red behind, front lights ahead. Cheap "shadows" for cars to pass ahead? | Brake wash; headlight beams along the route, with shadows (159) | Addressed (awaiting replay); "shadows" reading to confirm |
| O3.57 | Too hard to see underground. Three levels: Ground Z0, Low Highway Z1, High Platforms / Roofs / High Highway Z2. Redraw graphics and navigation. | Underground removed; Z2 high highway in Interchange and CBD; platform roofs, tall and link stairs, skybridges, ledges; drops scale with height (decisions 162–173) | Addressed (awaiting replay) |
| O3.58 | Interchange: the elevated road sits at the top of the screen; coming from above, the dummy is already hidden. Keep it at least four 16 px tiles from the top. | Drawn deck top ≥ `world.deckTopClear` (128) in every district; a building row below each deck (decisions 178–179) | Addressed (awaiting replay) |
| O3.59 | Buildings at the edge of two consecutive screens are marked with a dotted line. Not clear. Overlap by at least one 16 px tile. | Buildings straddle shared edges by ≥ `world.edgeOverlap` (32), drawn on both screens; no building-made edge marks (180–183) | Addressed (awaiting replay) |

## P3 — 16-bit Aero, solid city, part damage

**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 37, Edit 38 · Notes: `DUMMIES_P3_Prototype.md`. Addresses O3.1–O3.10; O1.4.

### Presentation

- **Grid:** screen 640 × 360 art px; field 400 × 300 at (120, 30). `ui.artScale` 2.
- **Device:** whole multiples only. At 1080p, 120,000 of 120,000 art pixels are clean 3 × 3 blocks.
- **Pixel rules:** no anti-aliasing; every sprite generated in `pixel.js`; cars extruded by `proto.art.extrusion`.
- **Palettes:** day (Edit 37 eco-city), night, cyber. Chosen at load. Play never changes.
- **Rim outline:** on night and cyber, the dummy's outer edge takes `dummy.rimLight` (up, right) or `dummy.rimDark`. Inner joints stay black.
- **X-ray:** an occluded car or dummy shows as a checker of its own pixels.

### HUD v3

| Place | Shows |
|---|---|
| Top | Road · WRITE-OFFS · POINTS · CARS LEFT |
| Left | BODY health at 48 px · DASH blocks |
| Right | Chassis doll ×9 · LAST HIT · cut abilities |

- **Barks off.** Credits on report and shop only.

### Simulation changes

- **City statics:** blocks and jersey barriers collide and cast sensor shadows. `proto.city` 1.

| Road | Blocks | Jerseys | Solid cover |
|---|---:|---:|---:|
| L1 Straight | 8 | 5 | 8.0% |
| L2 Barrier | 7 | 2 | 7.3% |
| L3 Corner | 7 | 3 | 5.5% |

- **Hit location:** size picks height (`proto.parts.torsoFrom` 100, `proto.parts.headFrom` 250). Contact side picks left or right.
- **Part effects:** share = part loss ÷ `damage.bodyHealth`; multiplier = max(floor, 1 − loss × share).

| Part | Cuts | Loss | Floor |
|---|---|---:|---:|
| Legs | Ground speed | `proto.parts.legSpeedLoss` 1 | `proto.parts.legSpeedFloor` 0.5 |
| Torso | Turn rate | `proto.parts.torsoTurnLoss` 1.5 | `proto.parts.torsoTurnFloor` 0.5 |
| Head | View cone | `proto.parts.headConeLoss` 1.5 | `proto.parts.headConeFloor` 0.5 |
| Arms | Throw distance | `proto.parts.armThrowLoss` 1 | `proto.parts.armThrowFloor` 0.5 |

- **Both arms broken** (`proto.parts.brokenShare` 0.4 each): no cone pickup.
- **O1.4 closed in code.** Wear now costs handling, not only dash reach.

### Automated evidence

- `node test_sim.js` → 47/47. New: 8 city, 2 hit-location, 3 part-effect checks.
- `node policy_check.js`, L1 Standard 300:

| Policy | City off, effects off | City on, effects off | City on, effects on |
|---|---|---|---|
| Stand in lane | 0 impacts | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Cleared at 45.9 s | 0 impacts in 300 s | 0 impacts in 300 s |
| Read & lunge | Cleared at 15.1 s | Cleared at 17.9 s | Cleared at 18.4 s |

- **Read:** the city stops the blind bot on L1. Cause not inspected.
- **Read:** part effects barely touch L1; one write-off clears it.

### Questions for the P3 session

- Does health read first at exhibition distance?
- Do you notice a slower or stiffer dummy before reading the panel?
- Does the rim read as the dummy's edge, or as a glow?
- Do night and cyber keep every cue legible?
- Does the solid city add ambush play, or only clutter?

### Chassis doll (O3.16–O3.18)

- **64 × 108 art px** on the field's grid. Shaded rounded boxes per body part.
- **Face:** dot eyes, glints, brows, smile, ears with decals. Chrome joints.
- **Modules:** one component per node. Owned nodes show. The shop blinks the selected node on.
- **Preview:** tuning panel shows all 15 (display only).

### Cyberpunk scheme (O3.19–O3.20)

- **Default:** cyber. `?palette=day` and `?palette=night` stay.
- **Outlines:** every sprite edge on dark ground is a rim, lit top-right. Black edges measured 1.1–1.4:1; rims 2.2–14.2:1.
- **Hierarchy:** dummy > cars > cones > jersey barriers > pods > blocks.
- **Chassis:** gunmetal chrome, magenta module LEDs. Legs per V29: Spring start → Jump, Grip.

## P3 update — canon, voice, city v2, two dashes (O3.21–O3.32)

**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 39 · Decisions 112–123.

- **Dash:** two charges (`battery.capacity` 2). Reach × max(`movement.wearFloor`, 1 − `proto.parts.legDashLoss` × leg share).
- **City v2:** generated by `tools/city_gen.js`. Alleys ≥ `world.pedestrianGap`. Cap `world.occludedFractionMax` 0.30.

| Road | Blocks | Share of level | Jerseys | Share of road edge |
|---|---:|---:|---:|---:|
| L1 Straight | 8 | 26.8% | 3 | 8.2% |
| L2 Barrier | 8 | 25.6% | 3 | 8.2% |
| L3 Corner | 10 | 25.3% | 3 | 7.0% |

- **Voice:** barks back as pixel bubbles. Cars name new modules and broken parts. Learned models say so on return.
- **Tags:** half size, class letter plus tier (`S01`).
- **Database:** `content/db/fleet.json`. Lore check: 0 errors, 0 warnings.
- **Canon:** cyber is the default and canon palette.

### Automated evidence

- `node test_sim.js` → 48/48. New: two-charge dash; leg-only dash loss.
- `node policy_check.js`, L1 Standard 300, city v2, two charges:

| Policy | City off, effects off | City on, effects off | City on, effects on |
|---|---|---|---|
| Stand in lane | 0 impacts | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Cleared at 45.9 s | Cleared at 57.6 s | 5 impacts, not cleared in 300 s |
| Read & lunge | Cleared at 16.4 s | Cleared at 14.9 s | Cleared at 11.0 s |

- **Read:** with part effects on, leg damage now stops the blind bot. Reading still clears L1.

### Questions for the next session

- Do two charges feel tight or fair?
- Do you notice a shorter dash after leg hits?
- Are half-size tags readable at laptop distance?
- Do barks read without stopping play?
- Does the denser city add ambush play, or only clutter?

## P3 update — districts, puddles, Big battery (O3.33–O3.37)

**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 40 · Decisions 124–130.

- **Districts:** 3 × 3 screens per road. One road through all nine. Start screen on the river.
- **Gates:** road crossing plus one 48-unit pedestrian gate per shared edge. Other edges solid.
- **Flip:** 0.4 s slide; play pauses. Only the active screen runs.
- **Generated screens:** straight, S-bend or bend; flyover, barrier run or open street; city at ~25%.
- **Puddles:** 10 of 475 tiles per screen. No dash; slide × 2.5; cars brake at half.
- **Big battery:** three charges, 1 credit.
- **HUD:** screen in the top bar; district map under DASH; gate marks on the field.

### Automated evidence

- `node test_sim.js` → 55/55. New: district road, city contract and gates on 54 screens, flip, cones per screen, puddles, Big battery.
- **Browser tour:** all 27 screens walked through road gates. No page errors.
- `node policy_check.js`, L1 start screen, Standard 300, city on, part effects on:

| Policy | Puddles off | Puddles on |
|---|---|---|
| Stand in lane | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Not cleared in 300 s | Cleared at 46.0 s |
| Read & lunge | Cleared at 11.0 s | Cleared at 11.0 s |

- **Read:** wet tarmac makes blind lunging pay. Reading is still four times faster.

### Edit 40.1 (O3.38–O3.39)

- **Edges:** open ground crosses any shared edge. Blocked stretches show a dotted line.
- **Health:** Fragile 600, Standard 800, Reinforced 1000.
- **Policy check, L1, read & lunge:** 30.1 s (600), 31.6 s (800), 50.7 s (1000). Blind lunging clears only at 600 (79.6 s).
- `node test_sim.js` → 56/56.

## P3 update — five city districts (O3.40–O3.44)

**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 41 · Decisions 133–138.

- **Run:** Riverside → Old Market → Interchange → CBD → FARSIGHT Campus. Quotas 1, 2, 2, 3, 4.
- **Each district:** 3 × 3 generated screens; landmark on B2; own form, flyovers, traffic and hazards.
- **Layouts:** 15 baked (3 per district); one per district at random each run.
- **Flyovers:** decks on piers with two-way deck traffic; Interchange stacks two.

### Automated evidence

- `node test_sim.js` → 67/67.
- **Start-screen bot**, Standard 800, 150 s: first write-off between 12.4 s and 46.7 s on all 15 layouts.
- **Browser:** all nine screens of each district walked. No page errors.

### Edit 41.1 (O3.45–O3.46)

- **Crossings:** decks cross roads at right angles or miss them. Contract clause 17.
- **Large field test:** 960 × 540 screen, 640 × 480 field, 1280 × 960 world. HUD unchanged in size.
- **Bot, first write-off on the start screen:** standard 14.5–56.7 s; large 20.9–46.2 s.
- `node test_sim.js` → 69/69.

### Questions for the next session

- Standard or large field, full screen on the laptop: which reads better? Is the dummy big enough at ×2?
- Does each district feel different at a glance?
- Do flyovers read as height? Does the Interchange stay readable?
- Which of the three layouts per district play best? Swap any that don't.
- Are the quotas fair at 800 health?
- Do the dotted edge lines read as "no way through"?
- Does the flip keep momentum, or break it?
- Do you explore, or stay on the start screen?
- Do puddles read as water? Is the no-dash rule fair?
- Does the district map help?

### Candidates for P3.1

- Part thresholds as shares of `damage.bodyHealth`, so Fragile can lose a head.
- One slick surface on L3 (D18).
- Walk, dash and wreck frames.
- Assign moods in the sim, so mood lines can fire.
- Level design pass on city v2: landmarks, sightlines, ambush routes.
- If D24 picks screens: one 3 × 3 district with cross-screen traffic.
- D28: give exploration a reason (quota spread, model roster per screen, or pickups).
- Junction pieces (T, cross) with right-of-way rules.
- Time L2 and L3 at 800 health against CARS LEFT; retune quotas or traffic if needed.
- D29: skybridges between towers (stairs, decks and drops are in P3.1).
- Per-district traffic classes from `fleet.json` (needs class dimensions in the registry).

## P3.1 — 400 × 320 field, bounded districts, three levels (O3.47–O3.51)

**Build:** `prototypes/p3/dummies_p3.html` (P3.1) · 20 Oct 2026 · Spec: GDD Edit 42 · Decisions 142–151.

- **Field:** 400 × 320 art px, 25 × 20 tiles, 5:4. World 800 × 640.
- **Bounds:** river on row 1, walls elsewhere. Roads and decks leave through checkpoints. Booms lift for cars; the dummy cannot pass.
- **Levels:** underground (underpasses), ground, overground (decks). Stairs join them.
- **Decks:** hard shoulders, lamps, broken parapets over roads. Deck cars are full drivers that see only the deck.
- **Drop:** off a broken parapet. Landing on a car scores a hit to the legs.
- **HUD:** level tag in the top bar; cues and tags for the dummy's level only.

### Automated evidence

- `node test_sim.js` → 74/74.
- **Bake:** 15 kept of 16 candidates. Interchange: 6 up-stairs, 9–14 drop points per layout.
- **Start-screen bot**, Standard 800, 150 s: first write-off between 19.9 s and 47.3 s on all 15 layouts.
- **Browser:** climbs, drops and underpasses by key input in all five districts. No page errors.

### Questions for the P3.1 session

- Do the decks read as height without a lift? Is the girder face enough?
- Are the stairs easy to find? Do the downed lamps read as drop points?
- Is the drop worth it (76–176 damage), or is it a getaway?
- Does the underpass feel safe, or pointless?
- Do the booms and walls read as "closed"?
- Six tagged deck cars at once: too many?

## P3.2 — square crossings, raised decks, turn styles, buildings by storey, car lights (O3.52–O3.56)

**Build:** `prototypes/p3/dummies_p3.html` (P3.2) · 21 Oct 2026 · Spec: GDD Edit 43 · Decisions 152–161.

- **Flyovers:** horizontal, raised 18 art px on column pairs, square over every road beneath. Interchange decks clear the roundabout.
- **Roads:** tight, circular or stepped turns per screen. Cars slow for bends.
- **Levels:** pale concrete decks; asphalt streets; a tiled cutaway underground.
- **Buildings:** single, double, tower. Rows face the road at one setback with alleys between.
- **Lights:** headlight beams ahead along the route, with shadows; red brake wash behind.

### Automated evidence

- `node test_sim.js` → 77/77.
- **Bake:** 15 kept of 33 candidates.
- **Start-screen bot**, Standard 800, 150 s: first write-off between 24.6 s and 54.1 s on all 15 layouts.
- **Browser:** deck, stairs, drop, underpass and checkpoint by key input in all five districts. No page errors.

### Questions for the P3.2 session

- Do the raised decks read as height? Are the columns clear enough?
- Do the three turn styles feel different to play? Do the corner slowdowns help or hurt?
- Can you tell single, double and tower apart at a glance?
- Do the headlight beams warn you before a car appears? Do the shadows help?
- Is the red brake wash ever mistaken for a warning?

## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57)

**Build:** `prototypes/p3/dummies_p3.html` (P3.3) · 21 Oct 2026 · Spec: GDD Edit 44 · Decisions 162–173.

- **Levels:** Z0 ground, Z1 low highway (18 art px up), Z2 high (32 art px up). No underground.
- **High highway:** Interchange and CBD run one flyover each at Z2.
- **Platforms:** frontage buildings built to Z2 with walkable roofs. A tall stair from the street; a link stair from a low highway.
- **Skybridges:** join roofs across alleys and lanes.
- **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. Z2 falls last 0.47 s and hit harder.

### Automated evidence

- `node test_sim.js` → 81/81.
- **Bake:** 15 kept of 39 candidates. First bot write-off by 90 s required.
- **Start-screen bot**, Standard 800, 150 s: first write-off between 19.2 s and 68.7 s on all 15 layouts.
- **Browser:** tall stair, roof ledge drop, skybridge, link stair and Z2 stair by key input. Random play in all five districts. No page errors.

### Questions for the P3.3 session

- Do Z1 and Z2 read apart at a glance? Is the inner LED line enough on the high highway?
- Are roofs worth climbing? Does a roof drop onto a car feel like a payoff?
- Should ground cues show while you stand on a roof?
- Do the link stairs read, or do they look like the deck runs into the roof?
- Do skybridges invite a route across the block?

## P3.4 — screen edges and flyover clearance (O3.58–O3.59)

**Build:** `prototypes/p3/dummies_p3.html` (P3.4) · 21 Oct 2026 · Spec: GDD Edit 48 · Decisions 178–185.

- **Flyovers** draw at least four tiles below the top edge, in every district. A building row fits below.
- **Shared edges:** a building touching one carries across, one to two tiles, and shows on both screens.
- **Edge marks** now come only from district edges and non-building blockers.
- **Screen names:** 7 names and the CBD intro became untrue on the new layouts. `pipeline.py --revise` fixed them.

### Automated evidence

- `node test_sim.js` → 83/83.
- **Bake:** 15 kept of 62 candidates. Interchange needed 35.
- **Shared edges:** 19–37 straddling buildings per layout. Marked shared-edge stretches: 565 → 0.
- **Flyovers:** drawn tops 4.0–9.3 tiles below the edge. P3.3 had 12 of 15 rows nearer than four.
- **Browser:** Interchange A3 from above; Campus A1 to B1. No page errors.

### Questions for the P3.4 session

- Does a building cut by the screen edge read as one building on both sides?
- Is four tiles of street above a flyover enough to see the dummy arrive?
- Interchange and CBD lost their tall stairs. Are link stairs enough to reach Z2 there?
