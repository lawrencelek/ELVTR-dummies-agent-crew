# Trace — interface

Status: **accepted** after 3 critic round(s).

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
| `hud.left[0]`: BODY — Chassis / Difficulty / Health / Lunge reach | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| BODY \| Remaining chassis health, wear and subject/chassis identity \| Impact/write-off \| |
| `hud.left[0]`: BODY — Chassis / Difficulty / Health / Lunge reach | `DESIGN#D10.4` | type cap height model IDs readouts legibility contrast tier… | It predicts current straight-lunge reach and static blocking geometry. |
| `hud.left[1]`: CHARGE — Charge | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CHARGE \| Current charge and action availability \| Simulation tick \| |
| `hud.left[1]`: CHARGE — Charge | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Charge ring/segments \| Whether another lunge is available \| Segment/arc geometry and luminance \| |
| `hud.left[2]`: FLEET — Stop distance / Red: learned stop | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| FLEET \| Recurring identities, current appearance state and learned model record \| Appearance/learning \| |
| `hud.left[2]`: FLEET — Stop distance / Red: learned stop | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **HUD:** FLEET shows each model's stop distance. |
| `hud.right[0]`: CONTRACT — Road / Write-offs | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CONTRACT \| Bodies completed against the visible target \| Write-off \| |
| `hud.right[0]`: CONTRACT — Road / Write-offs | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | ### D9.1 The subject and the contract (§3.1) |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| SHIFT \| District/profile context and traffic remaining \| Admission/exit \| |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `DESIGN#D8` | endings Licensed Non-compliant Failed test refusal second c… | - **Phases:** Attract/start → active play → hit feedback → write-off report → shop → active play → ending. |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| RECORD \| Points and spendable body credits \| Committed outcome/purchase \| |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | - The subject's identity, acquired abilities and record persist across replaceable chassis. |
| `cueKey[0]`: intention — Chevron — The car has reacted. Its plan is not yet fixed. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **State pip:** Chevron = intention. |
| `cueKey[0]`: intention — Chevron — The car has reacted. Its plan is not yet fixed. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Intention \| Reacting; plan not yet fixed \| Chevron. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its plan. Only safety braking interrupts it. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Closed ring = committed. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its plan. Only safety braking interrupts it. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Committed: stop \| Braking to the stop line \| Closed ring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Opening ring = expiring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Expiring commitment \| Less than a full action window remains in the reservation \| Opening/broken-ring form and visible countdown motion; distinct from int… |
| `cueKey[3]`: interrupted — Red broken ring — The car has braked for safety on its route. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Red broken ring = interrupted. |
| `cueKey[3]`: interrupted — Red broken ring — The car has braked for safety on its route. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Interrupted/blocked cue \| Commitment prediction has been interrupted for safety \| Broken/distinct shape plus braking/block indication \| |
| `cueKey[4]`: caution — Caution triangle — The car is slowing past a nearby dummy. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `cueKey[4]`: caution — Caution triangle — The car is slowing past a nearby dummy. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | - **New cue:** A grey warning triangle on the roof marks a cautious car. |
| `cueKey[5]`: braking — Brake marks — The car is slowing. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Brake marks \| The car is slowing \| Rear position and visible state change \| |
| `cueKey[5]`: braking — Brake marks — The car is slowing. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[6]`: spent — Spent slash — This car cannot award another impact. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Spent-appearance mark \| This appearance cannot award another damaging/scoring impact \| Persistent stamped/slashed shape and tag placement \| |
| `cueKey[6]`: spent — Spent slash — This car cannot award another impact. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[7]`: honk — HONK bubble — The car has been blocked too long. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `cueKey[7]`: honk — HONK bubble — The car has been blocked too long. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | - **Too close to stop:** Brakes hard in a straight line. |
| `cueKey[8]`: view — View cone — Where the dummy resolves sensor information. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Inside the view cone only:** Forward sensor rectangle, side sensor arcs, predicted path. |
| `cueKey[8]`: view — View cone — Where the dummy resolves sensor information. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| View cone \| Where the dummy resolves sensor information \| Wedge boundary and orientation \| |
| `copy`: {"intro": ["Road {road} of {roads}: {roadName}. {quota} write-offs clear it.", "{difficul… | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | Approved modifications are installed on the replacement body. |
| `copy`: {"intro": ["Road {road} of {roads}: {roadName}. {quota} write-offs clear it.", "{difficul… | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `barks[0]`: impact — I was stopped. Put that in my review. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[0]`: impact — I was stopped. Put that in my review. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Learned stop line:** A hit on a stopped car pushes that model back 2.9 m (`proto.learn.standoffStep` 35). |
| `barks[1]`: impact — Noted. I did not ask for this. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[1]`: impact — Noted. I did not ask for this. | `DRIVER#DB4a` | learned stop line FLEET shows stop distance toast names the… | ### DB4a Stop distance and learning |
| `barks[2]`: impact — Impact recorded. I have a delivery to make. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Barks react to recorded events. |
| `barks[3]`: touch-spent — I have already been assessed. Please move along. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[3]`: touch-spent — I have already been assessed. Please move along. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Interrupted/blocked cue \| Commitment prediction has been interrupted for safety \| Broken/distinct shape plus braking/block indication \| |
| `barks[4]`: honk — Dummy ahead. I have been held up. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `barks[4]`: honk — Dummy ahead. I have been held up. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | - **Real driving numbers:** 0.67 s reaction, 3 m/s² comfortable braking, 6.5 m/s² emergency braking, 3.5 m/s² acceleration, two-second gap, 46 m look-ahead (DB… |
| `barks[5]`: honk — I have been waiting a while. Deadlines exist. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Holding \| Stopped and waiting \| Ring. |
| `barks[5]`: honk — I have been waiting a while. Deadlines exist. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `barks[6]`: commit — Moving over. Mind my lane, please. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | Indicator if a lane change is planned. |
| `barks[6]`: commit — Moving over. Mind my lane, please. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | After 8 s, passes at 10 mph with 2 m clearance, if the oncoming lane is clear. |
| `barks[7]`: commit — Stopping. Please remain at a distance. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | ## DB5 States and cues |
| `barks[7]`: commit — Stopping. Please remain at a distance. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **HUD:** FLEET shows each model's stop distance. |
| `barks[8]`: interrupt — Safety stop. I am not paid enough for this. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Committed: stop \| Braking to the stop line \| Closed ring. |
| `barks[8]`: interrupt — Safety stop. I am not paid enough for this. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[9]`: unstick — Reversing. Wrong side, apparently. Me. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Wrong side gives way:** After 3 s head-on (`traffic.deadlockTimeout`), the car in the oncoming lane reverses to 11.5 m of room, then returns. |
| `barks[9]`: unstick — Reversing. Wrong side, apparently. Me. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[10]`: unstick — Plan dropped. Driving on. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Watchdog:** A car stopped 3 s with a plan but no reason to wait drops the plan and drives on. |
| `barks[11]`: admit — {model} entering lane {lane}. Route in progress. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `barks[11]`: admit — {model} entering lane {lane}. Route in progress. | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | ### D9.2 A specific fictional district (§3.2) |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. Mostly it sounds like DUMMIES. FARSIGHT copy is dry and procedural, and the barks are worker voice with real personality. The problems are a few barks and toasts that state things the sim did not log, one cue-key entry with no glyph, and two cue meanings that overpromise or hard-code a value.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/block | `barks[2].text` | DESIGN#D9.3: Barks must match the logged event, and a catch-all impact bark must n… | No accident detected. Please improve. | Impact recorded. I have a delivery to make. |
| C2 | truth/block | `barks[11].text` | DESIGN#D5.4: Barks never assert facts the simulation did not establish. The admit … | {model} entering lane {lane}. Deadline is tight. | {model} entering lane {lane}. Route in progress. |
| C3 | truth/fix | `copy.toast.drone-dispatch` | DRIVER#DB4: The toast fires when the drone flies in. It must not claim the cone i… | FARSIGHT drone dispatched. Obstruction relocated. | FARSIGHT drone dispatched. Cone is blocking a car. |
| C4 | rule/fix | `cueKey[8]` | BRIEF#P1.3: The cue key lists the grammar the field actually draws, each line bes… | {"cue": "blind", "label": "Cannot see you", "meaning": "The car has no sight of the dummy and keeps its speed… | {"cue": "view", "label": "View cone", "meaning": "Where the dummy resolves sensor information.", "sources": [… |
| C5 | lore/fix | `cueKey[1].meaning` | DRIVER#DB4: A committed manoeuvre is never re-planned, but safety braking can int… | The car has fixed its plan and will follow it. | The car has fixed its plan. Only safety braking interrupts it. |
| C6 | data/fix | `cueKey[7].meaning` | DRIVER#DB4: The threshold is the registry value proto.honkSeconds. The copy must … | The car has been blocked for more than 5 s. | The car has been blocked too long. |

Leaf changes this round: 10.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: FARSIGHT strings are dry and procedural, and the vehicle barks sound like workers. Two barks assert more than the sim logged: one names the learned counter, and one claims a closing slot.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/fix | `barks[1].text` | DESIGN#D9.3: Barks cannot explain a learned counter beyond what the evidence suppo… | Noted. {model} will stop further back. | Noted. I did not ask for this. |
| C2 | truth/fix | `barks[4].text` | DESIGN#D5.4: Barks never assert facts the simulation did not establish. A honk log… | Dummy in my lane. My slot is closing. | Dummy ahead. I have been held up. |

Leaf changes this round: 2.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. The content sounds like DUMMIES. FARSIGHT copy is dry and procedural, and the vehicle barks sound like workers talking about their own job and the event just logged. I found no new canon, truth, rule or data problems. The learn-standoff toast naming the change follows decision P1.8, and the earlier SETTLED fixes are intact.

