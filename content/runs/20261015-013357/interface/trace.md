# Trace — interface

Status: **accepted** after 2 critic round(s).

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
| node effects Hips faster deliberate reorientation turn rate Spine steer lunge Carry place… | `DESIGN#D3.8` (36.849), `BRIEF#P1.5` (28.998), `DESIGN#D3.6` (28.646) |
| blind spots sensor shadows pillars barriers vans BLIND wedges hide from side sensors | `LOG#P1.5/pillars-and-blind-spots` (46.825), `LOG#P1.9` (20.691), `LOG#P1.4-observations` (19.952) |

Context given to the generator: 20 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `hud.left[0]`: BODY — Subject / chassis / Setting / health / Chassis health / Lunge reach | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| BODY \| Remaining chassis health, wear and subject/chassis identity \| Impact/write-off \| |
| `hud.left[0]`: BODY — Subject / chassis / Setting / health / Chassis health / Lunge reach | `DESIGN#D10.4` | type cap height model IDs readouts legibility contrast tier… | It predicts current straight-lunge reach and static blocking geometry. |
| `hud.left[1]`: CHARGE — Lunge charge | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CHARGE \| Current charge and action availability \| Simulation tick \| |
| `hud.left[1]`: CHARGE — Lunge charge | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Charge ring/segments \| Whether another lunge is available \| Segment/arc geometry and luminance \| |
| `hud.left[2]`: FLEET — Model / stop distance / Red: stop line learned | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| FLEET \| Recurring identities, current appearance state and learned model record \| Appearance/learning \| |
| `hud.left[2]`: FLEET — Model / stop distance / Red: stop line learned | `DRIVER#DB4a` | learned stop line FLEET shows stop distance toast names the… | - **Cue:** HUD FLEET shows each model's stop distance in metres. |
| `hud.right[0]`: CONTRACT — Road / Write-offs | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| CONTRACT \| Bodies completed against the visible target \| Write-off \| |
| `hud.right[0]`: CONTRACT — Road / Write-offs | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | ### D9.1 The subject and the contract (§3.1) |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| SHIFT \| District/profile context and traffic remaining \| Admission/exit \| |
| `hud.right[1]`: SHIFT — Admitted / On road / Next admission / Active time | `DESIGN#D8` | endings Licensed Non-compliant Failed test refusal second c… | - **Phases:** Attract/start → active play → hit feedback → write-off report → shop → active play → ending. |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens… | \| RECORD \| Points and spendable body credits \| Committed outcome/purchase \| |
| `hud.right[2]`: RECORD — Points / Body credits | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | - The subject's identity, acquired abilities and record persist across replaceable chassis. |
| `cueKey[0]`: intention — Chevron — The car has noticed you. Its plan is not fixed. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **State pip:** Chevron = intention. |
| `cueKey[0]`: intention — Chevron — The car has noticed you. Its plan is not fixed. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Intention \| Reacting; plan not yet fixed \| Chevron. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its route and will hold it unless interrupted. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Closed ring = committed. |
| `cueKey[1]`: committed — Closed ring — The car has fixed its route and will hold it unless interrupted. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Committed: stop \| Braking to the stop line \| Closed ring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. Less than one action window remains. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Opening ring = expiring. |
| `cueKey[2]`: expiring — Opening ring — The commitment is ending. Less than one action window remains. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Expiring \| Commitment ending \| Opening ring \| |
| `cueKey[3]`: interrupted — Red broken ring — The car's route was interrupted. It is braking for safety. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | Red broken ring = interrupted. |
| `cueKey[3]`: interrupted — Red broken ring — The car's route was interrupted. It is braking for safety. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Interrupted \| Safety braking on its route \| Red broken ring \| |
| `cueKey[4]`: caution — Grey triangle — The car is cautious and slowing past you. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `cueKey[4]`: caution — Grey triangle — The car is cautious and slowing past you. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | - **New cue:** A grey warning triangle on the roof marks a cautious car. |
| `cueKey[5]`: braking — Brake marks — The car is slowing. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Brake marks \| The car is slowing \| Rear position and visible state change \| |
| `cueKey[5]`: braking — Brake marks — The car is slowing. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[6]`: spent — Spent slash — This appearance cannot award another impact. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Spent-appearance mark \| This appearance cannot award another damaging/scoring impact \| Persistent stamped/slashed shape and tag placement \| |
| `cueKey[6]`: spent — Spent slash — This appearance cannot award another impact. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Always visible:** Car bodies, model tags, state pip, brake marks, spent stamp. |
| `cueKey[7]`: honk — HONK bubble — The car has been blocked for some time and is warning you. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `cueKey[7]`: honk — HONK bubble — The car has been blocked for some time and is warning you. | `LOG#P1.7` | caution grey warning triangle roof cautious car horn honk f… | - **New cue:** A grey warning triangle on the roof marks a cautious car. |
| `cueKey[8]`: blind — BLIND wedge — Sensor shadow. Cars cannot sense you here. | `LOG#P1.5/pillars-and-blind-spots` | blind spots sensor shadows pillars barriers vans BLIND wedg… | - **Blind spots:** Pillars, barriers and vans cast sensor shadows from each car's nose. |
| `cueKey[9]`: view — View cone — Where you resolve sensor information. | `BRIEF#P1.3` | state pip chevron intention closed ring committed opening r… | - **Inside the view cone only:** Forward sensor rectangle, side sensor arcs, predicted path. |
| `cueKey[9]`: view — View cone — Where you resolve sensor information. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| View cone \| Where the dummy resolves sensor information \| Wedge boundary and orientation \| |
| `copy`: {"intro": ["Road {road} of {roads}: {roadName}. Write-offs required: {quota}.", "{difficu… | `DESIGN#D9.1` | subject contract FARSIGHT promises release certification te… | - The subject's identity, acquired abilities and record persist across replaceable chassis. |
| `copy`: {"intro": ["Road {road} of {roads}: {roadName}. Write-offs required: {quota}.", "{difficu… | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `barks[0]`: impact — I stopped. I was compliant. Log that. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[0]`: impact — I stopped. I was compliant. Log that. | `DRIVER#DB4a` | learned stop line FLEET shows stop distance toast names the… | - **Exposure:** The stopped car sits inside lunge reach (177 u). |
| `barks[1]`: impact — {model} hit. {lost} health lost. That goes on my record. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `barks[2]`: touch-spent — I'm already on the form. Hands off. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[2]`: touch-spent — I'm already on the form. Hands off. | `DESIGN#D10.3~1` | information taxonomy dynamic cue intent chevron closed comm… | \| Lunge trace \| Actual snapshotted action in progress \| Directional form and motion \| |
| `barks[3]`: honk — Move it! I have a delivery window. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[3]`: honk — Move it! I have a delivery window. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `barks[4]`: commit — Pulling out. Rank does not wait for obstacles. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `barks[4]`: commit — Pulling out. Rank does not wait for obstacles. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | ## DB5 States and cues |
| `barks[5]`: commit — Stopping. Slowly. Politely. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[5]`: commit — Stopping. Slowly. Politely. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | ## DB5 States and cues |
| `barks[6]`: interrupt — Plan cancelled. My supervisor will hear of this. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[6]`: interrupt — Plan cancelled. My supervisor will hear of this. | `DRIVER#DB5` | caution grey warning triangle roof cautious car horn honk f… | \| Intention \| Reacting; plan not yet fixed \| Chevron. |
| `barks[7]`: unstick — Reversing. I am not paid to back up. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[7]`: unstick — Reversing. I am not paid to back up. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | - **Learned stop line:** A hit on a stopped car pushes that model back 2.9 m (`proto.learn.standoffStep` 35). |
| `barks[8]`: unstick — Replanning. On my own time. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[8]`: unstick — Replanning. On my own time. | `LOG#P1.8` | learned stop line FLEET shows stop distance toast names the… | ## P1.8 — Close stop, learned stop line, unsticking |
| `barks[9]`: admit — Crates due this shift. Entering the zone. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[9]`: admit — Crates due this shift. Entering the zone. | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | These are authored features of the fictional Shenzhen zone. |
| `barks[10]`: admit — Courier run. Entering the zone. | `DESIGN#D9.3` | voice and reports vehicles speak as workers deadlines rank … | ### D9.3 Voice and reports (§3.3) |
| `barks[10]`: admit — Courier run. Entering the zone. | `DESIGN#D9.2` | bilingual district test identifiers editorial review Chines… | These are authored features of the fictional Shenzhen zone. |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: dry FARSIGHT register, workers' resentment in the barks, and no slogans. It has some truth problems, because several lines assert things the sim did not log (a late shift, 'Again', 'on time', a 'noon' deadline, a charge refusal that may really be recovery). It also has a truncated shop button and some engineering jargon leaking into player-facing text.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/block | `copy.denied.lunge` | ENG#5.2~1: A is denied for no charge or for recovery, and copy may only assert t… | Lunge declined. Charge not ready. | Lunge declined. Charge or recovery incomplete. |
| C2 | data/fix | `copy.shop.bank` | DESIGN#D3.9: The bank button must say plainly that credits are kept and the next c… | Keep {credits} credits. Deploy | Keep {credits} in credit. Deploy next chassis |
| C3 | tone/fix | `copy.shop.nodes.spine` | DESIGN#D3.9: The node text states what the visitor can now do in plain terms; 'dec… | Steer during the lunge window. Within declared limits. | Steer your lunge while it is in progress. Only slightly. |
| C4 | tone/fix | `cueKey[7].meaning` | DRIVER#DB5: The key must explain the HONK bubble in visitor terms. 'Honk limit' i… | The car has been blocked for more than the honk limit. | The car has been blocked for some time and is warning you. |
| C5 | lore/fix | `cueKey[1].meaning` | ENG#6.2~2: Commitment promises the corridor until expiry unless a safety interru… | The car has fixed its plan and will follow it. | The car has fixed its route and will hold it unless interrupted. |
| C6 | truth/block | `barks[1].text` | DESIGN#D9.3: Barks react to recorded events and cannot assert facts the sim did no… | {model} hit. Down {lost} health. My shift is late. | {model} hit. {lost} health lost. That goes on my record. |
| C7 | truth/block | `barks[8].text` | DESIGN#D5.4: Barks never assert facts the simulation did not establish; 'Again' cl… | Replanning. Again. On my own time. | Replanning. On my own time. |
| C8 | truth/block | `barks[10].text` | DESIGN#D9.3: The admit event logs no punctuality, so 'on time' is an unlogged clai… | Courier run. Entering the zone, on time. | Courier run. Entering the zone. |
| C9 | truth/fix | `barks[9].text` | DESIGN#D9.3: The game has no clock time and the admit event logs no deadline. A va… | Crates due by noon. Entering the zone. | Crates due this shift. Entering the zone. |

Leaf changes this round: 9.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. The content sounds like DUMMIES. FARSIGHT copy is dry and procedural, and the vehicle barks are workers talking about their own jobs, rank and supervisors, with no slogans or slang. I found no canon, rule, truth or data breaks beyond the SETTLED fixes, which are applied and not reversed.

