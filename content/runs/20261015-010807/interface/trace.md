# Trace — interface

Status: **not accepted** after 3 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens report purchase ending | `DESIGN#D10.5` (35.55), `ENG#11.2` (15.117), `ENG#10.1` (12.426) |
| information taxonomy dynamic cue intent chevron closed commitment cue interrupted expirin… | `DESIGN#D10.3~1` (44.855), `DRIVER#DB5` (24.47), `BRIEF#P1.3` (21.043) |
| state pip chevron intention closed ring committed opening ring expiring red broken ring i… | `BRIEF#P1.3` (76.334), `DRIVER#DB5` (63.391), `DESIGN#D10.3~1` (33.895) |
| voice and reports vehicles speak as workers deadlines rank fear of retraining barks | `DESIGN#D9.3` (42.542), `DESIGN#D9.4` (10.099), `ENG#6.5` (9.313) |
| bilingual district test identifiers editorial review Chinese wording legibility | `DESIGN#D9.2` (47.186), `DESIGN#D10.4` (9.625), `BRIEF#P1.2` (5.811) |
| learned stop line FLEET shows stop distance toast names the change | `LOG#P1.8` (31.43), `DRIVER#DB4a` (21.663), `LOG#P1.7-observations` (14.222) |
| type cap height model IDs readouts legibility contrast tier high-contrast | `DESIGN#D10.4` (41.442), `DESIGN#D10.2` (14.171), `DESIGN#D10.5` (14.079) |
| subject contract FARSIGHT promises release certification testing contract paid test | `DESIGN#D9.1` (37.091), `DESIGN#D1` (25.497), `DESIGN#D8` (9.881) |
| caution grey warning triangle roof cautious car horn honk flash lights | `DRIVER#DB5` (35.207), `LOG#P1.7` (28.184), `LOG#P1.2/honking-and-drones` (12.63) |
| shop shows cost prerequisite owned credit balance shortfall postpones | `DESIGN#D3.9` (34.916), `ENG#9.3` (29.123), `DESIGN#D10.5` (12.457) |
| endings Licensed Non-compliant Failed test refusal second confirmation | `DESIGN#D8` (30.544), `ENG#10.2` (27.853), `BRIEF#P1.2` (19.054) |

Context given to the generator: 18 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `hud.left[0]`: BODY — Chassis / Rating / Integrity / Lunge reach | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| BODY \| Remaining chassis health, wear and subject/chassis identity \| Impact/write-off \| |
| `hud.left[0]`: BODY — Chassis / Rating / Integrity / Lunge reach | `DESIGN#D10.4` | bilingual district test identifiers editorial review Chines… | It predicts current straight-lunge reach and static blocking geometry. |
| `hud.left[1]`: CHARGE — Lunge charge | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CHARGE \| Current charge and action availability \| Simulation tick \| |
| `hud.left[1]`: CHARGE — Lunge charge | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Charge ring/segments \| Whether another lunge is available \| Segment/arc geometry and luminance \| |
| `hud.left[2]`: FLEET — Stop distance / Marked: learned stop | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| FLEET \| Recurring identities, current appearance state and learned model record \| Appearance/learning \| |
| `hud.left[2]`: FLEET — Stop distance / Marked: learned stop | `DRIVER#DB4a` | learned stop line FLEET shows stop distance toast names the… | - **Cue:** HUD FLEET shows each model's stop distance in metres. |
| `hud.right[0]`: CONTRACT — Test road / Write-offs | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CONTRACT \| Bodies completed against the visible target \| Write-off \| |
| `hud.right[0]`: CONTRACT — Test road / Write-offs | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | ### D9.1 The subject and the contract (§3.1) |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| SHIFT \| District/profile context and traffic remaining \| Admission/exit \| |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `ENG#6.5` | voice and reports vehicles speak as workers deadlines rank … | The initial nominal admission interval is 12 active simulation seconds. |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| RECORD \| Points and spendable body credits \| Committed outcome/purchase \| |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | - The subject's identity, acquired abilities and record persist across replaceable chassis. |
| `cueKey[0]`: intention — Chevron — The car is reacting. Its plan is not fixed yet. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | - **State pip:** Chevron = intention. |
| `cueKey[0]`: intention — Chevron — The car is reacting. Its plan is not fixed yet. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Intention \| Reacting; plan not yet fixed \| Chevron. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its route for a short, bounded plan. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | Closed ring = committed. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its route for a short, bounded plan. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Committed: stop \| Braking to the stop line \| Closed ring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. Less than a full action window remain… | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | Opening ring = expiring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. Less than a full action window remain… | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Expiring \| Commitment ending \| Opening ring \| |
| `cueKey[3]`: interrupted — Red broken ring — The car has braked for safety. Its route is no longer rel… | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | Red broken ring = interrupted. |
| `cueKey[3]`: interrupted — Red broken ring — The car has braked for safety. Its route is no longer rel… | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Interrupted \| Safety braking on its route \| Red broken ring \| |
| `cueKey[4]`: caution — Caution triangle — The car is slowing past a nearby dummy. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `cueKey[5]`: braking — Brake marks — The car is slowing down. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Brake marks \| The car is slowing \| Rear position and visible state change \| |
| `cueKey[5]`: braking — Brake marks — The car is slowing down. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[6]`: spent — Spent slash — This appearance cannot award another scoring impact. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Spent-appearance mark \| This appearance cannot award another damaging/scoring impact \| Persistent stamped/slashed shape and tag placement \| |
| `cueKey[6]`: spent — Spent slash — This appearance cannot award another scoring impact. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[7]`: honk — HONK bubble — The car has been blocked too long and complains. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `cueKey[8]`: blind — Sensor zone — Marks where this car can sense. Outside it, it cannot. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Detection zone and side sensors \| Where this appearance can sense \| Explicit boundary shape and patterned fill \| |
| `cueKey[8]`: blind — Sensor zone — Marks where this car can sense. Outside it, it cannot. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[9]`: view — View cone — The wedge where the dummy resolves sensor information. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| View cone \| Where the dummy resolves sensor information \| Wedge boundary and orientation \| |
| `cueKey[9]`: view — View cone — The wedge where the dummy resolves sensor information. | `BRIEF#P1.3` | information taxonomy dynamic cue intent chevron closed comm… | - **Inside the view cone only:** Forward sensor rectangle, side sensor arcs, predicted path. |
| `copy`: {"intro": ["FARSIGHT TEST ROAD {road} OF {roads}: {roadName}.", "Contract: {quota} bodies… | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | FARSIGHT funds broader test coverage; the subject uses that permission to acquire more ways to move and act. |
| `copy`: {"intro": ["FARSIGHT TEST ROAD {road} OF {roads}: {roadName}.", "Contract: {quota} bodies… | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `barks[0]`: admit — {model} on shift. Deadline: yesterday. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `barks[0]`: admit — {model} on shift. Deadline: yesterday. | `ENG#6.5` | voice and reports vehicles speak as workers deadlines rank … | The same model should visibly respond to an earlier successful approach while the visitor is still playing. |
| `barks[1]`: impact — {model} was stationary. Please log that. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[1]`: impact — {model} was stationary. Please log that. | `DRIVER#DB4a` | learned stop line FLEET shows stop distance toast names the… | - **Learning:** Each hit on a stopped or stopping car moves that model's stop line back by `proto.learn.standoffStep` 35 u ≈ 2.9 m. |
| `barks[2]`: impact — That one goes on my record. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[2]`: impact — That one goes on my record. | `ENG#6.5` | voice and reports vehicles speak as workers deadlines rank … | The first report may state the observed impact and model identity, but it withholds the explanatory learned-counter message until the player has encountered th… |
| `barks[3]`: touch-spent — No accident detected. Please improve. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Prototype English lines may include “Your freedom remains in progress” and “No accident detected. |
| `barks[3]`: touch-spent — No accident detected. Please improve. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Intent chevron \| A detected car's provisional route \| Arrow shape and position \| |
| `barks[4]`: honk — Your freedom remains in progress. Kindly move. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Prototype English lines may include “Your freedom remains in progress” and “No accident detected. |
| `barks[4]`: honk — Your freedom remains in progress. Kindly move. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `barks[5]`: honk — {model} is on schedule. Please clear the lane. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `barks[5]`: honk — {model} is on schedule. Please clear the lane. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | Indicator if a lane change is planned. |
| `barks[6]`: commit — {model} yielding. Brake logged. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `barks[6]`: commit — {model} yielding. Brake logged. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | ## DB5 States and cues |
| `barks[7]`: commit — {model} changing lane. Policy permitting. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `barks[7]`: commit — {model} changing lane. Policy permitting. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | Indicator if a lane change is planned. |
| `barks[8]`: interrupt — {model} braking. Someone has a deadline. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `barks[8]`: interrupt — {model} braking. Someone has a deadline. | `DRIVER#DB5` | information taxonomy dynamic cue intent chevron closed comm… | \| Committed: stop \| Braking to the stop line \| Closed ring. |
| `barks[9]`: unstick — {model} reversing. Making room, not conceding. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `barks[9]`: unstick — {model} reversing. Making room, not conceding. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Learned stop line:** A hit on a stopped car pushes that model back 2.9 m (`proto.learn.standoffStep` 35). |
| `barks[10]`: unstick — {model} replanning. Please do not report the delay. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[10]`: unstick — {model} replanning. Please do not report the delay. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Learned stop line:** A hit on a stopped car pushes that model back 2.9 m (`proto.learn.standoffStep` 35). |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: dry, bureaucratic, workers whose deadlines and fear of retraining show through, and it uses the D9.3 sample lines properly. Two items need to change: the learning toast names the counter at the moment of the hit, and the FLEET note ties the reserved warning red to a non-warning state.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/fix | `copy.toast.learn-standoff` | DESIGN#D9.3: Copy cannot explain a model's first learned change, or name its count… | {model} stop line moved to {metres} m. | {model} record updated. |
| C2 | rule/fix | `hud.left[2].rows[1].label` | DESIGN#D10.2: Red is reserved for warning marks with independent shape or position.… | Red: learned stop | Marked: learned stop |

Leaf changes this round: 3.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: dry, bureaucratic, workers' fear of blame, and the endings carry the certification line correctly. Two lines overreach. The committed-ring key text promises more than the cue means, and the cleared-road report line uses 'certified' for an intermediate road.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/fix | `cueKey[1].meaning` | DESIGN#D10.3~1: The closed ring marks a fixed corridor with a bounded planned traject… | The car has fixed its route and will follow it. | The car has fixed its route for a short, bounded plan. |
| C2 | lore/fix | `copy.report.cleared` | DESIGN#D9.1: Certification releases the subject from its testing contract. It is t… | {roadName} certified. Next: {nextRoad}, target {nextQuota}. Points: {points}. | {roadName} test complete. Next: {nextRoad}, target {nextQuota}. Points: {points}. |

Leaf changes this round: 2.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: dry, bureaucratic and worker-voiced, with the canonical D9.3 lines used as intended. Two lines break truth rules: a honk bark claims the car is on schedule when the sim only logged that it was blocked, and a FLEET label names the learned counter before the player has met the changed return.

Open issues (no repair round left):

- C1 [truth/block] `barks[5].text`: {model} is on schedule. Please clear the lane. — Barks may not assert facts the simulation did not log. A honk event only establishes that the car has been blocked for more than 5 s, so claiming it is on schedule is a vivid false claim.
- C2 [truth/fix] `hud.left[2].rows[1].label`: Marked: learned stop — Explanatory copy naming a model's learned counter is deferred until the player has met the changed return. The HUD may mark a changed record but must not name the counter.

