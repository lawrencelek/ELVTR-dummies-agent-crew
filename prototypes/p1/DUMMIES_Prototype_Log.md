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
