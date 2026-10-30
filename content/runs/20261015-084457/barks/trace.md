# Trace — barks

Status: **accepted** after 3 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| bark key model number event front hit side hit near miss safe passage write-off seniority… | `EDIT26#6.6` (60.308), `ENG#11.3` (16.397), `EDIT26#11.1` (16.134) |
| vehicles speak as workers deadlines rank fear of retraining resentment pride corporate po… | `EDIT26#3.2` (51.64), `DESIGN#D9.3` (45.761), `ENG#5.3~2` (8.32) |
| Sinofuturist AI workers ridiculous jobs comic and tragic at once FARSIGHT sells a city wi… | `EDIT26#3.1` (63.191), `DESIGN#D9.1` (21.343), `EDIT26#3.2` (10.403) |
| barks react to recorded events neutral fallback vivid false claim reports truthful | `DESIGN#D9.3` (40.995), `EDIT26#3.2` (29.83), `EDIT26#6.6` (22.335) |
| cars may react to upgrades subject has acquired hips draft lines your freedom remains in … | `EDIT26#3.2` (47.554), `DESIGN#D9.3` (18.501), `DESIGN#D9.1` (15.21) |
| miss stumble near miss distinct cues input denial positive impact write-off | `DESIGN#D9.4` (34.886), `DESIGN#D4.5` (18.484), `EDIT26#6.6` (16.8) |
| seniority notches beside model ID tag practised experienced senior write-offs caused | `EDIT26#6.4` (39.434), `EDIT26#10.5` (23.483), `EDIT26#10.2` (19.458) |
| recurring vehicle jobs certification language district logistics maintenance road | `DESIGN#D9.2` (42.539), `DESIGN#D6.1` (10.362), `DESIGN#D10.5` (10.327) |
| model tag seniority notches spent appearance mark readable cues feedback never hides a ca… | `DESIGN#D10.3~1` (26.546), `DESIGN#D4.5` (22.475), `JUICE#J3` (20.014) |
| standoff stop line honk horn flash lights patient pass blocked dummy | `DRIVER#DB5` (30.335), `DRIVER#DB6` (20.397), `LOG#P1.2/honking-and-drones` (19.357) |

Context given to the generator: 18 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `lines[0]`: writeoff — shout — SCHEDULE CLOSED. PERMANENTLY. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | ### 6.6 Voice: barks and reports |
| `lines[0]`: writeoff — shout — SCHEDULE CLOSED. PERMANENTLY. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[1]`: writeoff — speech — Chassis lost. Please log my punctuality. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | ### 6.6 Voice: barks and reports |
| `lines[1]`: writeoff — speech — Chassis lost. Please log my punctuality. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[2]`: writeoff — thought — Retraining was the worst case. I was wrong. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[2]`: writeoff — thought — Retraining was the worst case. I was wrong. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `lines[3]`: writeoff — shout — {"model": "VAN-02"} — THE LANE WAS MAINTAINED! I WAS MAINTAINED! | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | ### D9.2 A specific fictional district (§3.2) |
| `lines[3]`: writeoff — shout — {"model": "VAN-02"} — THE LANE WAS MAINTAINED! I WAS MAINTAINED! | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[4]`: writeoff — speech — {"seniority": {"min": 3}} — Senior grade. Written off. Grade was no s… | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | ### 6.4 Learning and seniority |
| `lines[4]`: writeoff — speech — {"seniority": {"min": 3}} — Senior grade. Written off. Grade was no s… | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[5]`: impact — shout — {"zone": "front"} — NOT THE FRONT! THE FRONT IS RATED! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[5]`: impact — shout — {"zone": "front"} — NOT THE FRONT! THE FRONT IS RATED! | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[6]`: impact — shout — {"zone": "front"} — Impact logged. Ow. Impact logged. | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[6]`: impact — shout — {"zone": "front"} — Impact logged. Ow. Impact logged. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[7]`: impact — shout — {"zone": "front", "model": "SEDAN-01"} — MIND THE PARCEL! | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | These are authored features of the fictional Shenzhen zone. |
| `lines[7]`: impact — shout — {"zone": "front", "model": "SEDAN-01"} — MIND THE PARCEL! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[8]`: impact — shout — {"zone": "frontDiagonal"} — {model} IS HIT. {model} IS FINE. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[8]`: impact — shout — {"zone": "frontDiagonal"} — {model} IS HIT. {model} IS FINE. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[9]`: impact — shout — {"zone": "side"} — SIDE! YOU CAME FROM THE SIDE! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[9]`: impact — shout — {"zone": "side"} — SIDE! YOU CAME FROM THE SIDE! | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | It resolves cars' sensor zones and occlusion information in that direction. |
| `lines[10]`: impact — shout — {"zone": "rear"} — REAR! NOBODY CHECKS THE REAR! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | ### 6.6 Voice: barks and reports |
| `lines[11]`: impact — thought — {"bait": true} — Hit. Logged. This was not on my schedule. | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | Every impact is logged, but learning changes only once per write-off, from the responsible impact's approach evidence. |
| `lines[11]`: impact — thought — {"bait": true} — Hit. Logged. This was not on my schedule. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[12]`: impact — speech — {"stopped": true} — I was stopped. I was waiting. Procedurally. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Holding \| Stopped and waiting \| Ring. |
| `lines[12]`: impact — speech — {"stopped": true} — I was stopped. I was waiting. Procedurally. | `DRIVER#DB6` | standoff stop line honk horn flash lights patient pass bloc… | Stopped cars give only weak hits, so the emergency vehicle itself is the prize. |
| `lines[13]`: impact — thought — {"seniority": {"min": 2}} — Experienced. Still hit. Retraining looms. | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | ### 6.4 Learning and seniority |
| `lines[13]`: impact — thought — {"seniority": {"min": 2}} — Experienced. Still hit. Retraining looms. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[14]`: touch-spent — mutter — Already assessed. Now merely bumped. | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `lines[14]`: touch-spent — mutter — Already assessed. Now merely bumped. | `DESIGN#D10.3~1` | model tag seniority notches spent appearance mark readable … | \| Spent-appearance mark \| This appearance cannot award another damaging/scoring impact \| Persistent stamped/slashed shape and tag placement \| |
| `lines[15]`: touch-spent — thought — That counted for nothing. Rude, still. | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `lines[15]`: touch-spent — thought — That counted for nothing. Rude, still. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[16]`: knock — speech — Apologies. Lane in use. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[16]`: knock — speech — Apologies. Lane in use. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[17]`: near-miss — mutter — Close. Noted. Not enough to cite. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[17]`: near-miss — mutter — Close. Noted. Not enough to cite. | `DESIGN#D9.4` | miss stumble near miss distinct cues input denial positive … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `lines[18]`: near-miss — mutter — Gap acceptable. My pulse is not. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[18]`: near-miss — mutter — Gap acceptable. My pulse is not. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[19]`: near-miss — mutter — {"lunging": true} — It lunged. I will pretend it did not. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[19]`: near-miss — mutter — {"lunging": true} — It lunged. I will pretend it did not. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[20]`: near-miss — mutter — {"model": "VAN-02"} — Lane maintenance does not cover this. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `lines[20]`: near-miss — mutter — {"model": "VAN-02"} — Lane maintenance does not cover this. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[21]`: miss — mutter — No contact. Nothing to report. Noted anyway. | `EDIT26#10.2` | seniority notches beside model ID tag practised experienced… | \| **The attempt** \| Under a minute \| Commit this lunge, or turn and wait \| Reading and timing \| A hit, or a miss that is funny \| |
| `lines[21]`: miss — mutter — No contact. Nothing to report. Noted anyway. | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | There is no active fog-of-war experiment that hides traffic. |
| `lines[22]`: miss — speech — Lunge ended without contact. I remain on schedule. | `EDIT26#10.2` | seniority notches beside model ID tag practised experienced… | \| **The attempt** \| Under a minute \| Commit this lunge, or turn and wait \| Reading and timing \| A hit, or a miss that is funny \| |
| `lines[22]`: miss — speech — Lunge ended without contact. I remain on schedule. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Draft lines: "Your freedom remains in progress." "No accident detected. |
| `lines[23]`: miss — thought — It missed. I should feel better than this. | `EDIT26#10.2` | seniority notches beside model ID tag practised experienced… | \| **The attempt** \| Under a minute \| Commit this lunge, or turn and wait \| Reading and timing \| A hit, or a miss that is funny \| |
| `lines[23]`: miss — thought — It missed. I should feel better than this. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[24]`: honk — speech — {"at": "body"} — HONK. Please vacate the lane. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | Indicator if a lane change is planned. |
| `lines[24]`: honk — speech — {"at": "body"} — HONK. Please vacate the lane. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Please improve”; final selection must match the event. |
| `lines[25]`: honk — thought — {"at": "body"} — Waiting. Still waiting. The window is closing. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Holding \| Stopped and waiting \| Ring. |
| `lines[25]`: honk — thought — {"at": "body"} — Waiting. Still waiting. The window is closing. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[26]`: honk — mutter — {"at": "cone"} — It is a cone. I am flashing at a cone. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `lines[26]`: honk — mutter — {"at": "cone"} — It is a cone. I am flashing at a cone. | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[27]`: commit — mutter — {"cause": "body", "man": "brake"} — Stopping. Dummy in the lane. Waitin… | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `lines[27]`: commit — mutter — {"cause": "body", "man": "brake"} — Stopping. Dummy in the lane. Waitin… | `DRIVER#DB6` | standoff stop line honk horn flash lights patient pass bloc… | \| Profile \| Assigned to \| Reaction \| Near the dummy \| Dummy in path \| Pass / swerve \| Horn \| Role \| |
| `lines[28]`: commit — speech — {"cause": "body", "man": "shift"} — Passing with minimal courtesy. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[28]`: commit — speech — {"cause": "body", "man": "shift"} — Passing with minimal courtesy. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[29]`: commit — mutter — {"cause": "pass"} — Waited long enough. Going round. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Committed: pass / return \| Slow lateral pass or return to lane \| Closed ring. |
| `lines[29]`: commit — mutter — {"cause": "pass"} — Waited long enough. Going round. | `DRIVER#DB6` | standoff stop line honk horn flash lights patient pass bloc… | \| Profile \| Assigned to \| Reaction \| Near the dummy \| Dummy in path \| Pass / swerve \| Horn \| Role \| |
| `lines[30]`: commit — mutter — {"cause": "cone"} — Cone ahead. I have seen worse. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[30]`: commit — mutter — {"cause": "cone"} — Cone ahead. I have seen worse. | `DESIGN#D6.1` | recurring vehicle jobs certification language district logi… | The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. |
| `lines[31]`: interrupt — mutter — {"by": "car"} — Halted for safety. Safety is also late. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Interrupted \| Safety braking on its route \| Red broken ring \| |
| `lines[31]`: interrupt — mutter — {"by": "car"} — Halted for safety. Safety is also late. | `DESIGN#D10.3~1` | model tag seniority notches spent appearance mark readable … | \| Intent chevron \| A detected car's provisional route \| Arrow shape and position \| |
| `lines[32]`: interrupt — mutter — {"by": "cone"} — Halted by a cone. A cone. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[32]`: interrupt — mutter — {"by": "cone"} — Halted by a cone. A cone. | `DESIGN#D10.3~1` | model tag seniority notches spent appearance mark readable … | \| View cone \| Where the dummy resolves sensor information \| Wedge boundary and orientation \| |
| `lines[33]`: unstick — mutter — {"how": "reverse"} — Reversing. This is on my record now. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[33]`: unstick — mutter — {"how": "reverse"} — Reversing. This is on my record now. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[34]`: unstick — thought — {"how": "replan"} — Replanning. Again. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[34]`: unstick — thought — {"how": "replan"} — Replanning. Again. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[35]`: admit — speech — {"cls": "sedan"} — {model} entering road. Schedule noted. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `lines[35]`: admit — speech — {"cls": "sedan"} — {model} entering road. Schedule noted. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `lines[36]`: admit — speech — {"cls": "van"} — {model} entering. Please keep the lane clear. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | ### D9.2 A specific fictional district (§3.2) |
| `lines[36]`: admit — speech — {"cls": "van"} — {model} entering. Please keep the lane clear. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. |
| `lines[37]`: upgrade-seen — speech — {"node": "Hips"} — Subject has acquired hips. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |
| `lines[38]`: upgrade-seen — speech — {"node": "Spine"} — Subject has acquired a spine. Unscheduled. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |
| `lines[38]`: upgrade-seen — speech — {"node": "Spine"} — Subject has acquired a spine. Unscheduled. | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[39]`: upgrade-seen — thought — {"node": "Carry"} — It can carry things now. Cones. Oh no. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Draft lines: "Your freedom remains in progress." "No accident detected. |
| `lines[39]`: upgrade-seen — thought — {"node": "Carry"} — It can carry things now. Cones. Oh no. | `DESIGN#D6.1` | recurring vehicle jobs certification language district logi… | The road must support direct interception, deliberate post-commit bait, baseline cone punts and deliberate Carry placement. |
| `lines[40]`: upgrade-seen — speech — {"node": "Throw"} — Throwing was approved. By whom, I ask. | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[40]`: upgrade-seen — speech — {"node": "Throw"} — Throwing was approved. By whom, I ask. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. Mostly it sounds like DUMMIES: flat procedural worker voice with resentment under it. Five lines slip: two miss lines mock the player, one impact line reveals the bait counter, one line prints a number the registry owns, and two lines claim facts the simulation never logged or that don't fit the car's class.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | tone/fix | `lines[22].text` | DESIGN#D9.3: Vehicle voice is worker politeness and resentment about its own job a… | Please aim before entering my route. | Lunge ended without contact. I remain on schedule. |
| C2 | tone/fix | `lines[23].text` | DESIGN#D9.3: A car speaks about its own job and record, not coaching or scolding t… | It missed. I should feel better than this. | It missed. I should feel better than this. |
| C3 | truth/fix | `lines[11].text` | DESIGN#D9.3: Copy must not assert an emotional motive the evidence does not suppor… | It left. I relaxed. That was the mistake. | Hit. Logged. This was not on my schedule. |
| C4 | data/fix | `lines[25].text` | DRIVER#DB4: The honk threshold is the parameter proto.honkSeconds. A hard-coded n… | Five seconds. Five whole seconds. | Waiting. Still waiting. The window is closing. |
| C5 | truth/block | `lines[39].text` | DESIGN#D9.3: Barks never assert facts the simulation did not log. On-time status i… | It can carry things now. Cones. Oh no. | It can carry things now. Cones. Oh no. |
| C6 | lore/fix | `lines[0].text` | DESIGN#D9.2: Vehicle jobs are specific. Only SEDAN-01 is a courier and VAN-02 does… | DELIVERY WINDOW CLOSED. PERMANENTLY. | SCHEDULE CLOSED. PERMANENTLY. |

Leaf changes this round: 6.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The set mostly sounds like DUMMIES: flat procedural speech with resentment underneath, and no FARSIGHT slogans or game-show cheer. One line inverts the cars' fear of retraining, and three lines give a published job to every car of a class instead of the model that has it.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | lore/block | `lines[2].text` | DESIGN#D9.3: Vehicles are workers with a fear of retraining. This line treats retr… | Retraining would have been nicer. | Retraining was the worst case. I was wrong. |
| C2 | lore/fix | `lines[7].when` | DESIGN#D9.2: Only SEDAN-01 has a published job (depot parcel courier). 'MIND THE P… | {"zone": "front", "cls": "sedan"} | {"zone": "front", "model": "SEDAN-01"} |
| C3 | lore/fix | `lines[3].when` | DESIGN#D9.2: Only VAN-02 has a published lane-maintenance job. A line about being … | {"cls": "van"} | {"model": "VAN-02"} |
| C4 | lore/fix | `lines[20].when` | DESIGN#D9.2: 'Lane maintenance does not cover this.' states VAN-02's job, so it is… | {"cls": "van"} | {"model": "VAN-02"} |

Leaf changes this round: 7.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. The bank sounds like DUMMIES. The lines are flat, procedural worker copy where the comedy comes from the gap between procedure and the logged event, and none of it uses FARSIGHT slogans, game-show cheer or mockery. I found no lore, truth, rule or data breaks against CANON, the lines match their logged events, and the earlier SETTLED fixes are intact.

