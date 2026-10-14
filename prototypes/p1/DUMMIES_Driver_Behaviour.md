# DUMMIES — Driver Behaviour

**Design spec · Lawrence Lek · 14 October 2026**

- **Scope:** How cars decide to keep driving, slow down, stop or swerve. How vehicle types differ.
- **Status:** Standard driver built in P1.7. Close stop, learned stop line and unsticking added in P1.8. Straight sensors in P1.9. Other profiles proposed, not built.
- **Basis:** UK Highway Code numbers, mirrored for right-hand traffic (DB1a). US differences noted.
- **Values:** All values are Trial starting points. Tune them in play (TUNING, T).
- **Parameters:** Registry IDs (Engineering §13.5). `proto.*` = prototype-only. Overrides of registry values marked.

## DB1 Scale

- **Conversion:** `proto.scale.unitsPerMetre` = 12.2. A 56-unit sedan ≈ 4.6 m.
- **Sedan:** `vehicles.sedan.cruiseSpeed` 138 u/s ≈ 11.3 m/s ≈ 25 mph.
- **Van:** `vehicles.van.cruiseSpeed` 120 u/s ≈ 22 mph.
- Both sit under a 30 mph built-up limit.

## DB1a Right-hand traffic

Lanes keep right (Design D6). UK rules apply mirrored. Distances and timings do not change.

| UK rule (keep left) | DUMMIES rule (keep right) | In the sim |
|---|---|---|
| Keep left | Keep right | Lane 0 eastbound, lane 1 westbound |
| Overtake on the right | Pass on the left, through the oncoming lane | Lateral offset `d` < 0 crosses the centre line |
| Kerb on the left | Kerb and shoulder on the right | `d` > 0 up to `proto.swerveOuter` |
| Obstruction on your side: give way to oncoming traffic | Same | A car crosses only if the oncoming corridor is clear |
| Pull left for an emergency vehicle | Pull right | Proposed (DB6, Emergency) |
| Short turn is left; right turn crosses traffic | Short turn is right; left turn crosses traffic | L3: lane 0 turns left on the outer lane; lane 1 turns right on the inner lane. No crossing turns yet. |

- **US:** These keep-right rules are native. Only the numbers differ (DB2).
- **Shoulder pass:** A game allowance. A real driver uses a paved verge only. Cars prefer it because it avoids the oncoming lane.

## DB2 Highway Code numbers → game values

Highway Code stopping distances:

| Speed | Thinking | Braking | Total |
|---|---:|---:|---:|
| 20 mph | 6 m | 6 m | 12 m |
| 30 mph | 9 m | 14 m | 23 m |

- **Implied reaction:** ≈ 0.67 s. Thinking distance ÷ speed.
- **Implied braking:** ≈ 6.4–6.7 m/s². Speed² ÷ (2 × braking distance).

| Driver value | ID | Game value | Real value |
|---|---|---:|---|
| Reaction | `perception.reactionDelay` (override 0.15 →) | 0.67 s | Highway Code thinking time |
| Reaction, foot covering brake | `proto.driver.coveredReaction` | 0.4 s | Alert driver |
| Comfortable braking | `traffic.comfortBraking` (override 400 →) | 37 u/s² | 3 m/s² |
| Emergency braking | `traffic.hardBraking` (override 600 →) | 79 u/s² | 6.5 m/s² |
| Acceleration | `traffic.acceleration` (override 360 →) | 43 u/s² | 3.5 m/s² |
| Following gap | `traffic.timeGap` (override 1.2 →) | 2.0 s | Two-second rule |
| Look-ahead | `perception.forwardLength` (override 320 →) | 560 u | ≈ 46 m |

- **Sedan stopping distance at cruise:** 92 u thinking + 120 u braking ≈ 212 u ≈ 17 m. Matches the Highway Code curve at 25 mph.
- **US:** Same physics. Common guidance is a three-second gap; set `traffic.timeGap` 3.0.

## DB3 Hazards

Each tick the driver classifies what it can see. Pillars, barriers and vans block its view.

### DB3a Sensors (P1.9)

Sensors point along the car's heading. They do not bend with the road. The route is known from the map.

| Sensor | Shape | Size |
|---|---|---|
| Forward beam | Rectangle from the nose | `perception.forwardLength` long; car width + `body.radius` each side |
| Driver's field | Rectangle from the rear bumper | Same length; car width + `body.radius` + `proto.driver.cautionZone` each side |

- **Seen:** Inside a sensor and not occluded.
- **On route:** Then measured along the car's route, not the beam.
- **Toggle:** `proto.sensorStraight` 1. Set 0 for the P1.1–P1.8 sensors that follow the road.
- **Matches the GDD:** Design D5.2 already specifies a rectangle from the nose.

### DB3b Hazard table

| Hazard | Test | Meaning |
|---|---|---|
| Dummy in path | In the forward beam and inside the swept width of the route | A pedestrian in the road |
| Dummy near | In the driver's field, within `proto.driver.cautionZone` of the route. Includes a dummy on the route outside the beam. | A pedestrian who could step out |
| Obstruction | A cone in the forward beam, on the route corridor | A road obstruction |
| Lead vehicle | Same lane ahead, by route | Following traffic. Not sensor-limited (V2V). |

- **Hidden dummy:** Behind a pillar it is not seen, so it is neither near nor in path. The car keeps full speed.
- **Blind bend:** Approaching a bend, the beam points past it. A dummy around the bend is only near. The car slows to `proto.driver.cautionSpeed` but cannot stop for it. The beam finds it as the car turns, usually too late.
- **Verge ahead:** On a bend, a dummy straight ahead off the road is in the beam but not on the route. Caution only.
- **Measured on L3, lane 0, dummy 40 u past the bend exit:** Road-following sensors stop the car 50 u short. Straight sensors see the dummy in path at 62 u; the car hits it at caution speed for 41 damage.

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

### DB4b Getting unstuck

Two rules. Both use registry `traffic.deadlockTimeout` 3 s.

1. **Wrong side gives way.** A car in the oncoming lane, stopped head-on, reverses to make room. Then it signals and returns to its own lane slowly. The oncoming car holds still. White reversing lights and a reversing beep cue it.
2. **Watchdog.** A car stopped 3 s with a plan but no reason to wait drops the plan and drives on. Reasons to wait: dummy in path, cone ahead, a car close ahead or a stopped queue.

- **Reverse stops early:** Car, cone or dummy behind it, or after `proto.unstick.reverseSeconds`.
- **Cause found (O1.28):** A van passed a cone through the oncoming lane. An oncoming car met it nose to nose. The van waited for the road ahead to clear. The oncoming car crept forward behind it. Neither moved again.

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

## DB6 Vehicle profiles — proposal

A profile sets the driver values above. Class, schedule or state can assign it.

| Profile | Assigned to | Reaction | Near the dummy | Dummy in path | Pass / swerve | Horn | Role |
|---|---|---|---|---|---|---|---|
| **Standard** (built) | All cars in P1.7 | 0.67 s | Slow to 15 mph | Stop beyond lunge range, wait | Slow pass after 8 s, 2 m | At danger only | Readable baseline |
| **Courier** | Vans, behind schedule | 0.8 s | Covers brake, keeps speed | Stops closer; waits 3 s | Passes sooner with 1.5 m; swerves around cones at speed | Early | More hittable; rewards reading time pressure |
| **Learner** | Rare sedans, L-plates | 1.0 s | Slow to 10 mph; wider zone | Stops early | Never passes | Never | Hard to hit; creates queues to exploit |
| **Emergency** | Rare, blue lights | 0.5 s | Ignores | Brakes and swerves to avoid | Overtakes freely | Siren | High-speed, high-damage event. Others pull over and stop. |
| **Rattled** | A model after it is hit | 0.5 s | Wider zone, +50% | Longer standoff | Patient | — | The fleet visibly adapts (ties to learning, D5.3) |
| **Bus** | Expansion | 0.67 s | Slow | Stop | Never swerves | Rare | Huge, fixed lane, stops at stops |

- **Emergency vehicles:** Other drivers must let them through. In P1 that means pulling to the kerb and stopping. Stopped cars give only weak hits, so the emergency vehicle itself is the prize.

## DB7 Parameters added in P1.7 and P1.8

| ID | Value | Unit |
|---|---:|---|
| `proto.scale.unitsPerMetre` | 12.2 | world units per metre |
| `proto.driver.coveredReaction` | 0.4 | s |
| `proto.driver.cautionZone` | 180 | world units beyond the car's swept edge |
| `proto.driver.cautionSpeed` | 82 | world units/s (≈ 15 mph) |
| `proto.driver.passClearance` | 24 | world units (≈ 2 m) |
| `proto.driver.passSpeed` | 55 | world units/s (≈ 10 mph) |
| `proto.driver.patienceSeconds` | 8 | s |
| `proto.sideSlowFraction` | removed | superseded by caution |
| `proto.standoffDistance` (P1.8) | 190 → 50 | world units (≈ 4.1 m) |
| `proto.learn.standoffEnabled` | 1 | toggle |
| `proto.learn.standoffStep` | 35 | world units per hit on a stopped car |
| `proto.learn.standoffMax` | 190 | world units |
| `proto.unstick.reverseSpeed` | 30 | world units/s (≈ 2.5 m/s) |
| `proto.unstick.reverseGap` | 140 | world units of room before returning |
| `proto.unstick.reverseSeconds` | 5 | s |
| `traffic.deadlockTimeout` | 3 | s (registry, now used) |
| `proto.sensorStraight` (P1.9) | 1 | toggle: 1 straight, 0 follows the road |

## DB8 Open questions

- Does a 4 m stop with a learned retreat feel fair, or too easy early on?
- Should cars slow for bends? They take L3's 8 m-radius bend at 25 mph, about 1.2 g sideways.
- Should learning also widen the caution zone, as in the Rattled profile?
- Should a car that sees you approach while stopped reverse away?
- Which profile next: Courier vans, or a rare Emergency vehicle?

## Sources

- [Stopping distances explained — Carbuyer](https://www.carbuyer.co.uk/tips-and-advice/147841/stopping-distances-explained)
- [Highway Code Rule 112 — theorytest.org.uk](https://theorytest.org.uk/hwc/highway-code/rule-112.html)
- [2022 Highway Code changes — Which?](https://www.which.co.uk/news/article/new-2022-highway-code-changes-are-you-aware-of-the-new-rules-aeSG87A0eup3)
