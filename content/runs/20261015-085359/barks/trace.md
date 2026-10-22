# Trace — barks

Status: **accepted** after 2 critic round(s).

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
| `lines[0]`: impact — shout — {"zone": "front"} — Bumper! That was the bumper! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[0]`: impact — shout — {"zone": "front"} — Bumper! That was the bumper! | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[1]`: impact — shout — {"zone": "front"} — Ah! I was proceeding correctly! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[1]`: impact — shout — {"zone": "front"} — Ah! I was proceeding correctly! | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[2]`: impact — thought — {"zone": "front", "seniority": {"min": 2, "max": 3}} — I was trained f… | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | ### 6.4 Learning and seniority |
| `lines[2]`: impact — thought — {"zone": "front", "seniority": {"min": 2, "max": 3}} — I was trained f… | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[3]`: impact — shout — {"zone": "side"} — Side panel! I had right of way! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[3]`: impact — shout — {"zone": "side"} — Side panel! I had right of way! | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[4]`: impact — thought — {"bait": true} — It left my path, then came back. Rude. | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | \| **Post-commit bait** \| The dummy left the path before the commit ring, then re-entered after it locked \| Commitment is delayed; the ring locks later \| +0… |
| `lines[4]`: impact — thought — {"bait": true} — It left my path, then came back. Rude. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[5]`: impact — mutter — {"stopped": true} — I was stationary. Please note I was stationary. | `DRIVER#DB6` | standoff stop line honk horn flash lights patient pass bloc… | Stopped cars give only weak hits, so the emergency vehicle itself is the prize. |
| `lines[5]`: impact — mutter — {"stopped": true} — I was stationary. Please note I was stationary. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. |
| `lines[6]`: writeoff — shout — Write-off! Tell dispatch I tried! | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[6]`: writeoff — shout — Write-off! Tell dispatch I tried! | `DESIGN#D9.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### D9.1 The subject and the contract (§3.1) |
| `lines[7]`: writeoff — thought — Please not retraining. Anything but retraining. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[7]`: writeoff — thought — Please not retraining. Anything but retraining. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `lines[8]`: writeoff — speech — Write-off number {writeOffs}. Please advise. | `ENG#11.3` | bark key model number event front hit side hit near miss sa… | Impact records include event ID, body ID, appearance/model ID, contact episode ID, simulation time, zone, speed, action eligibility, raw/assessed impact, healt… |
| `lines[8]`: writeoff — speech — Write-off number {writeOffs}. Please advise. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Please improve”; final selection must match the event. |
| `lines[9]`: writeoff — thought — {"seniority": {"min": 3, "max": 3}} — Senior model. Apparently not s… | `EDIT26#6.4` | seniority notches beside model ID tag practised experienced… | **Seniority** summarises training in four levels, shown as notches beside the model ID tag (4.2.2). |
| `lines[10]`: near-miss — mutter — Within tolerance. Barely. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[10]`: near-miss — mutter — Within tolerance. Barely. | `DESIGN#D9.4` | miss stumble near miss distinct cues input denial positive … | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `lines[11]`: near-miss — mutter — Was that a collision? Logging it as not. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[11]`: near-miss — mutter — Was that a collision? Logging it as not. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[12]`: near-miss — mutter — {"model": "SEDAN-01"} — Parcel intact. Nerves are not. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[12]`: near-miss — mutter — {"model": "SEDAN-01"} — Parcel intact. Nerves are not. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | ### D9.2 A specific fictional district (§3.2) |
| `lines[13]`: near-miss — mutter — {"model": "VAN-02"} — Lane maintenance does not cover this. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[13]`: near-miss — mutter — {"model": "VAN-02"} — Lane maintenance does not cover this. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `lines[14]`: miss — mutter — It lunged. Nothing happened. Logging that. | `EDIT26#10.2` | seniority notches beside model ID tag practised experienced… | \| **The attempt** \| Under a minute \| Commit this lunge, or turn and wait \| Reading and timing \| A hit, or a miss that is funny \| |
| `lines[14]`: miss — mutter — It lunged. Nothing happened. Logging that. | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. |
| `lines[15]`: miss — speech — Missed. Noted for my record. | `EDIT26#6.6` | bark key model number event front hit side hit near miss sa… | **Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. |
| `lines[15]`: miss — speech — Missed. Noted for my record. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[16]`: miss — thought — If it lunges again, I will be late. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[16]`: miss — thought — If it lunges again, I will be late. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[17]`: commit — mutter — {"cause": "body", "man": "brake"} — Stopping for the dummy. Window clos… | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Caution \| Slowing past a nearby dummy \| Grey warning triangle on the roof. |
| `lines[17]`: commit — mutter — {"cause": "body", "man": "brake"} — Stopping for the dummy. Window clos… | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[18]`: commit — mutter — {"cause": "pass"} — Passing, after waiting. Patience documented. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Committed: pass / return \| Slow lateral pass or return to lane \| Closed ring. |
| `lines[18]`: commit — mutter — {"cause": "pass"} — Passing, after waiting. Patience documented. | `DRIVER#DB6` | standoff stop line honk horn flash lights patient pass bloc… | \| Profile \| Assigned to \| Reaction \| Near the dummy \| Dummy in path \| Pass / swerve \| Horn \| Role \| |
| `lines[19]`: touch-spent — speech — Already assessed. Please move along. | `DESIGN#D4.5` | miss stumble near miss distinct cues input denial positive … | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `lines[19]`: touch-spent — speech — Already assessed. Please move along. | `DESIGN#D10.3~1` | model tag seniority notches spent appearance mark readable … | \| Spent-appearance mark \| This appearance cannot award another damaging/scoring impact \| Persistent stamped/slashed shape and tag placement \| |
| `lines[20]`: knock — mutter — Contact logged. Please stand clear of the vehicle. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[20]`: knock — mutter — Contact logged. Please stand clear of the vehicle. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. |
| `lines[21]`: honk — speech — {"at": "body"} — Excuse me. Kindly vacate the carriageway. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Honking / flashing \| Blocked > 5 s \| HONK or FLASH bubble. |
| `lines[21]`: honk — speech — {"at": "body"} — Excuse me. Kindly vacate the carriageway. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[22]`: honk — mutter — {"at": "cone"} — Cone in lane. Raising with maintenance. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | Indicator if a lane change is planned. |
| `lines[22]`: honk — mutter — {"at": "cone"} — Cone in lane. Raising with maintenance. | `DESIGN#D9.2` | recurring vehicle jobs certification language district logi… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `lines[23]`: interrupt — mutter — {"by": "car"} — Another vehicle. Braking for safety. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | \| Interrupted \| Safety braking on its route \| Red broken ring \| |
| `lines[24]`: interrupt — mutter — {"by": "cone"} — Swerve halted by a cone. Procedure holds. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[25]`: unstick — mutter — {"how": "reverse"} — Reversing. This is within procedure. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[25]`: unstick — mutter — {"how": "reverse"} — Reversing. This is within procedure. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | ### 3.2 Voice and register |
| `lines[26]`: unstick — mutter — {"how": "replan"} — Replanning. Rank unaffected. | `DRIVER#DB5` | standoff stop line honk horn flash lights patient pass bloc… | ## DB5 States and cues |
| `lines[26]`: unstick — mutter — {"how": "replan"} — Replanning. Rank unaffected. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy. |
| `lines[27]`: upgrade-seen — speech — {"node": "Hips"} — Subject has acquired hips. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |
| `lines[28]`: upgrade-seen — thought — {"node": "Spine"} — That spine was not on the last report. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Reports stay truthful to recorded events. |
| `lines[28]`: upgrade-seen — thought — {"node": "Spine"} — That spine was not on the last report. | `DESIGN#D9.3` | barks react to recorded events neutral fallback vivid false… | ### D9.3 Voice and reports (§3.3) |
| `lines[29]`: upgrade-seen — speech — {"node": "Carry"} — The subject is carrying something. Is that ap… | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |
| `lines[29]`: upgrade-seen — speech — {"node": "Carry"} — The subject is carrying something. Is that ap… | `EDIT26#3.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### 3.1 World and lore |
| `lines[30]`: upgrade-seen — thought — {"node": "Throw"} — It can throw now. Nobody told us. | `EDIT26#3.2` | vehicles speak as workers deadlines rank fear of retraining… | - Cars may react to upgrades: "Subject has acquired hips." (Proposed) |
| `lines[30]`: upgrade-seen — thought — {"node": "Throw"} — It can throw now. Nobody told us. | `DESIGN#D9.1` | Sinofuturist AI workers ridiculous jobs comic and tragic at… | ### D9.1 The subject and the contract (§3.1) |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. Mostly it sounds like DUMMIES: flat, procedural worker lines with resentment underneath, and no FARSIGHT slogans. Five lines need changes: two assign a job to every car of a class, one claims a stop for any avoidance, one claims the dummy leaned on a car, and one mocks the player.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | lore/fix | `lines[12].when` | BRIEF#Copy slots: Only SEDAN-01 is published as a depot parcel courier, so a parcel lin… | {"cls": "sedan"} | {"model": "SEDAN-01"} |
| C2 | lore/fix | `lines[13].when` | BRIEF#Copy slots: Only VAN-02 is published as doing lane maintenance, so a maintenance … | {"cls": "van"} | {"model": "VAN-02"} |
| C3 | truth/block | `lines[17].when` | DESIGN#D9.3: A bark cannot invent a manoeuvre the evidence does not support. cause… | {"cause": "body"} | {"cause": "body", "man": "brake"} |
| C4 | truth/block | `lines[20].text` | DESIGN#D9.3: The knock event logs only that a car pushed the dummy back (model, sp… | Please do not lean on the vehicle. | Contact logged. Please stand clear of the vehicle. |
| C5 | tone/fix | `lines[16].text` | BRIEF#Voices (who says what): Vehicle lines never mock the player. A thought should carry the car's… | Is that all it does? | If it lunges again, I will be late. |

Leaf changes this round: 7.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. The copy sounds like DUMMIES. Cars speak as polite, strained workers who state the gap between procedure and the event flatly, with no FARSIGHT slogans, game-show cheer or mockery of the player. I found no lore, tone, rule, truth or data breaks, and the settled fixes are intact. The claims of right of way and correct proceeding are car-side bureaucratic blame, which ENG#6.5 allows. The bait and trained lines state only logged fields (bait, seniority) and name no counter.

