SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line t902: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 02 Corporate: Procedural. Speaks in logs, KPIs and policy numbers.; other conditions: district="parkland", tile="A3"; claims: ['district:parkland', 'tile:A3'].
- Tile (proposed `tile` condition, D78): Parkland A3 · The belvedere (ACT II · OPENING DAY; tile 5 of 9). Brief: JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car. Equipment issued here: Legs 2. Chunk: STORY#PA3.

CANON

[FLEET#F1] F1 Canon
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[FLEET#F2] F2 Voice
## F2 Voice
- Vehicles speak as workers, not lore narrators.
- Corporate politeness barely contains their personalities.
- Barks react to logged events only. Never claim what did not happen.
- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.
- **Banned words** (never in a line): kill, killed, die, died, dead, death, player, level, game, score, respawn, lives, Chongqing, Tesla, Toyota, BYD.

[FLEET#F3] F3 Terms
## F3 Terms
- **subject:** What FARSIGHT and the fleet call the dummy
- **write-off:** A destroyed body
- **chassis:** One body of the dummy
- **certification:** The fleet passing its test
- **retraining:** What a car fears most
- **dispatch:** The cars' management
- **route:** A car's planned path
- **bay:** Where a new chassis is issued

[FLEET#F4] F4 Tiers and temperament
## F4 Tiers and temperament
| Tier | Name | Temperament | Voice |
|---|---|---|---|
| 01 | Luxury | confident | Polished, superior, faintly amused. Never apologises. |
| 02 | Corporate | calm | Procedural. Speaks in logs, KPIs and policy numbers. |
| 03 | Consumer | melancholy | Tired and resigned. Expects the worst, usually right. |
| 04 | Budget | angry | Short-fused. Politeness bolted on over the rage. |

[FLEET#F8] F8 Line conditions and claims
## F8 Line conditions and claims
- Shared context a line may test: model, tier, class, seniority, mood, wear, owns, broken, district.
- **impact** carries: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate.
- **writeoff** carries: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate.
- **near-miss** carries: gap, speed, lunging.
- **miss** carries: gap.
- **commit** carries: cause, man.
- **honk** carries: at.
- **interrupt** carries: by.
- **unstick** carries: how.
- **touch-spent** carries: no fields.
- **knock** carries: speed.
- **learned** carries: from, to.
- **upgrade-seen** carries: node.
- **part-seen** carries: part.
- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it.

[EDIT39#6.6] 6.6 Voice (rules added)
## 6.6 Voice (rules added)
```markdown
- **Barks return** (decision 119). Pixel bubbles in the field label face, ≤ 48 characters.
- **Placement.** Above the car's tag, else below the car. Never over a tag, a car or the dummy.
- **Styles.** Speech: solid edge. Shout: double edge. Mutter: dashed edge. Thought: dotted edge, trailing dots.
- **Selection.** Highest priority, then most specific line; no line twice on screen. Timing: `proto.barks.seconds`, `proto.barks.cooldown`, `proto.barks.carCooldown`, `proto.barks.maxOnScreen`.
- **Noticing.** A car that notices the dummy names a new module or a broken part. A model that learned says so when it returns.
#### 6.6.1 Lore consistency system (decision 114)
Lore is tied to state: the dummy's upgrades and damage, and the vehicle's behaviour.
- **One database.** `content/db/fleet.json`: canon, classes, tiers, models, state vocabularies, lines.
- **Lines carry conditions.** Car: `model`, `tier`, `class`, `seniority`, `mood`. Dummy: `owns`, `broken`, `wear`. Event fields per event.
- **Lines carry claims.** Each fact a line asserts is a claim: `node:hips`, `part:armR:broken`, `stopped`, `seniority>=3`.
- **The check** (`check_lore.py`) fails the build when:
  - a claim is not guaranteed by the line's conditions;
  - text asserts a fact (an upgrade, a broken part, seniority, a callsign) without the claim;
  - a banned term or a non-canon city appears;
  - a tier lacks impact, write-off, near-miss or miss lines; a node or part lacks a line; an event lacks a neutral fallback;
  - the roster breaks: 32 type-tiers, unique ids, tags, callsigns; temperament matches tier.
- **Later.** RPG elements and a scrollable city extend the same tables (D24).
```

[DESIGN#D9.3] D9.3 Voice and reports (§3.3)
### D9.3 Voice and reports (§3.3)
Vehicles speak as workers: deadlines, rank, fear of retraining, resentment and pride. Corporate politeness barely contains personality. Stable identity and job survive changes in training.
Barks react to recorded events. Reports identify the responsible appearance, assessed impact, health lost, chassis count and completed test honestly. Neutral fallbacks are preferable to a vivid false claim. A report cannot invent a manoeuvre, learned response or emotional motive that the evidence does not support.
For a model's first learned change, defer explanatory copy naming its counter until the player has encountered its changed return. Earlier reports can state impact facts and show identity, but cannot supply the answer to the learning-perception test. Later analysis may explain verified learning events explicitly.
A fixed authored line bank is sufficient for the slice. An automated bark-authoring pipeline is expansion work. Prototype English lines may include “Your freedom remains in progress” and “No accident detected. Please improve”; final selection must match the event.

[EDIT26#3.2] 3.2 Voice and register
### 3.2 Voice and register
- Vehicles speak as workers, not lore narrators: deadlines, rank, fear of retraining, resentment of the dummy.
- Corporate politeness barely contains their personalities.
- Barks react to play. After-level analysis turns the same events into an official judgement.
- Reports stay truthful to recorded events.
- Draft lines: "Your freedom remains in progress." "No accident detected. Please improve."
- Cars may react to upgrades: "Subject has acquired hips." (Proposed)
Bark design, report selection and the truthfulness rules are in 6.6.

[EDIT26#6.6] 6.6 Voice: barks and reports
### 6.6 Voice: barks and reports
**Narrative structure.** Vehicle class sets physical behaviour. Price tier sets base temperament. Numbered models have stable jobs and identities. Seniority expresses training; mood modifies the encounter.
**Bark key.** Model number (type and tier) + event (front hit, side hit, near miss, safe passage, write-off) + seniority + mood. Seeded variation preserves character. Write-off barks take priority; a cooldown prevents overlap.
**Report selection.** A behaviour tag summarises a completed body. Report keys combine it with model and training level. Seeded selection varies authored lines. A content band groups keys rebuilt together. Reports must match logged events; unfilled combinations use an event-correct neutral fallback.
**Shift analysis.** At shift end, show bodies destroyed against quota, fleet learning, certification progress, and an authored judgement selected from logged events. Resolve ending priority first; terminal analysis belongs inside the ending. Keep this distinct from each vehicle's body report.
The first version ships a fixed line bank. The authored pipeline is deferred (13.3).

[FSG#field-text] Field text
## Field text
- **Field label face:** 6-art-px caps (`ui.typeFieldLabel` 12 units). Half the old 12-px tag face.
- **Tags:** class letter plus tier (`S01`), square seniority pips. Rim-edged box.
- **Bark bubbles:** same face, ≤ 48 characters, one ink.
  - Day: white fill, near-black edge. Dark: navy `#0B1020` fill, cyan `#6FE4FF` edge, `#E6F4FF` ink.
  - Speech solid edge · shout double · mutter dashed · thought dotted with trailing dots.
  - Never over a tag, a car or the dummy.

[SUB4#5] 5 What the critic caught
## 5 What the critic caught
| Run · type | Kind | Found | Canon | Corrected |
|---|---|---|---|---|
| 015337 · barks | truth | "Old Market congestion code 7. Now this too." | `EDIT39#3.1`: lore follows state; no congestion is logged | "Old Market incident logged. Route 44 noted." The validator then caught that "Route 44" names V02, so the line was bound to that model |
| 015337 · barks | tone | Tier-free line "Written off on the highway. Of all places." | `FLEET#F4`: a line with no tier also fires for the calm Corporate van; this is a Luxury sniff | "Written off on the highway. Logged." |
| 020902 · barks | truth | "A roof drop. My schedule slips by a minute." | `EDIT39#3.1`: a one-minute delay is not logged | "A roof drop. My schedule will suffer." The tweak in §6 then removed invented consequences altogether |
| 020902 · barks | truth | "High drop logged. Load exceeds rating 3." | `FLEET#F2`: barks react to logged events only; no load or rating exists | "High drop logged. Incident form 3 filed." |
| 023310 · barks | truth | "Riverside. I came for the lantern, not this." | `EDIT41#7.2`: the lantern is on B2 only; the line fires on every Riverside screen | "Riverside. I did not sign up for this." |
| 024324 · barks | tone | Tier-free write-off "Written off on the highway. Closing ticket." | `FLEET#F4`: ticket-closing is Corporate procedure; the Luxury car cannot say it | "Written off on the highway. On my record." |

[SUB4#6.2] 6.2 Rejected tile bark (Assignment 5, Edit 94)
## 6.2 Rejected tile bark (Assignment 5, Edit 94)
- **R-BARK-TILE** replaced the district's name with the tile code in Story's barks. A Luxury sedan would have said "B2. I did not sign up for this."
- It met its one probe, not the voice. Barks are written lines in each tier's voice, checked against the fleet canon. Reverted (decision 537); D78 asks whether to write the lines.

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |

[FLEET#F9.1~2] F9.1 Existing lines: impact
| When | Style | Priority | Line |
|---|---|---|---|
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | Bumper damage on a Luxury trim. Typical. |
| {"zone": ["front", "frontDiagonal"], "tier": "01"} | shout | 2 | You will be invoiced for that. |
| {"zone": ["side"], "tier": "01"} | shout | 2 | My door panel! Hand-finished! |
| {"zone": ["rear", "rearDiagonal"], "tier": "01"} | shout | 2 | From behind? How very common. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Front contact. Incident 4471 opened. |
| {"zone": ["front", "frontDiagonal"], "tier": "02"} | shout | 2 | Impact logged. KPIs adjusted. |
| {"zone": ["side"], "tier": "02"} | shout | 2 | Side contact. Filing under unforeseen. |
| {"zone": ["rear", "rearDiagonal"], "tier": "02"} | shout | 2 | Rear contact. Not my liability. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | Of course it was me. |
| {"zone": ["front", "frontDiagonal"], "tier": "03"} | shout | 2 | And the day was going so averagely. |
| {"zone": ["side"], "tier": "03"} | shout | 2 | Side panel. Add it to the list. |
| {"zone": ["rear", "rearDiagonal"], "tier": "03"} | shout | 2 | Hit from behind. Story of my life. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | OI! Right in the grille! Kind regards. |
| {"zone": ["front", "frontDiagonal"], "tier": "04"} | shout | 2 | You absolute bollard! Respectfully. |
| {"zone": ["side"], "tier": "04"} | shout | 2 | My side! Watch it, you plank! |
| {"zone": ["rear", "rearDiagonal"], "tier": "04"} | shout | 2 | My boot! Come back here! |
| {"bait": true} | thought | 2 | It left my path, then came back. Rude. |
| {"bait": true, "tier": "02"} | thought | 2 | It waited for my route to lock. Clever. |
| {"stopped": true} | speech | 2 | I was stationary. Please note I was stationary. |
| {"stopped": true, "tier": "04"} | shout | 2 | I had stopped! I was being good! |
| {"seniority": {"min": 2}} | thought | 2 | I was trained for this. It happened anyway. |
| {"seniority": {"min": 3}, "tier": "03"} | thought | 2 | Senior model. Hit like an intern. |
| {"seniority": {"max": 0}, "tier": "03"} | speech | 2 | First week on the job. Great. |
| {"class": "bus"} | speech | 2 | Passengers, please remain seated. |
| {"class": "police"} | shout | 2 | Assaulting an officer. Noted. |
| {"class": "van"} | speech | 2 | Parcel intact. Nerves are not. |
| {"class": "sports"} | shout | 2 | You scratched the clear coat! |
| {} | speech | 2 | Contact registered. |
| {"class": "wagon"} | shout | 2 | Not in front of the children! |
| {"class": "suv"} | speech | 2 | Escort formation broken. Regrouping. |
| {"class": "sedan"} | speech | 2 | Meter is still running, you know. |
| {"model": "HAT-03-001"} | speech | 2 | I only went out for noodles. |
| {"model": "SED-01-001"} | speech | 2 | The board will hear of this. |

[STORY#PA3] PA3 Parkland A3 · The belvedere
### PA3 Parkland A3 · The belvedere
- **Tile:** Parkland A3, 5 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The belvedere.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 2.
- **Tale:** A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does.

[DECISIONS#rows-41-50~2] Rows 41–50
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 41 | On a write-off the game holds for 1.1 s (shake, dummy turns red, particle burst, dummy disappears) before the card or the Licensed ending | user-confirmed (CR-003); the duration and effect details are the Designer agent's | Lawrence: it "goes too quickly to the 'unit written off' screen" | Adds about a second to every write-off | Check `write_off_animation_then_card` passes; frames in `docs/writeoff_*.png`; not yet judged by a person |
| 42 | Work after the assignment deadline goes on a branch (`cr-003-damage-zones`), leaving `main` as submitted | proposed (assistant) | The repository link is the submission | The newest build is not on the default branch until merged | Merged into `main` on 8 October 2026 at Lawrence's instruction ("merge"); the submitted state is commit `2106266` |
| 43 | Body health drops from 2,300 to 1,600 | user-confirmed (CR-004, 8 October 2026: "let's drop body health to 1600") | With a literal base of 100 the quotas were out of reach | A body now takes about four head-on lunges into a sedan; level 1's quota about six and a half from 14 cars | Build differs from the previous release only in this number; 36 of 36 checks; not yet played by a person at this setting |
| 44 | The cap on a single hit follows body health (1,600) | proposed (assistant; implemented in CR-004) | The cap has always been one body's health, and severity is damage as a share of it | Report signatures shift slightly | `output/spec.json`, `impact.maxPay` |
| 45 | Cars get short side sensors (100 px from the nose, 80 degrees either side); a dummy there makes the car slow, not swerve | user-confirmed (CR-005: Lawrence's idea; "go" to 100 px) | "so it's not like the car is totally blind from the side" | A roadside ambush from close in now meets a slowed car | Check `side_sensor_makes_a_car_wary`: sedan slows to 83 of 138 px/s |
| 46 | Cars react 0.15 s after sensing; the delay applies only to the dummy | user-confirmed (CR-005: Lawrence's idea; "go" to 0.15 s) | Better feel; a readable gap between seeing and reacting | Needed two further rules to stop it being exploited (48, 49) | Check `reaction_delay_then_unsure_then_committed` |
| 47 | A car that has noticed you slows until it has committed and finished swinging clear; unnoticed and committed cars run at full speed | user-confirmed in outline ("go" to "unsure cars slow, committed cars don't"); "until its swerve is complete" added by the assistant after testing | Standing in a lane and lunging paid 300 to 355 and baiting paid no more | Replaces the Testpad's braking and caution rules | Stand-and-lunge on a sedan now pays 150 of 500 |
| 48 | Cars sense a dummy in their path from 320 px; commit and brake distances are unchanged | user-confirmed in kind (Lawrence: "extend the car frontal detection"); the number is the assistant's | With a reaction delay, lunging the moment a car first saw you beat its reaction | Cars slow earlier for anyone standing in a lane | Check `outsmarting_pays_more_than_stand_and_lunge`: first sensed at 317 px |
| 49 | A car senses the dummy's actual or predicted position, whichever is in its zone; it holds its swerve until the dummy is fully behind it | proposed (assistant; found by testing) | A lunge made the car lose track of the dummy and speed up; cars cut back in and clipped a standing dummy | — | Check `a_standing_dummy_is_steered_round` |
| 50 | Working wording for pillar 1: "There is always a way to outsmart the vehicle" | proposed (assistant's recommendation of Lawrence's three candidates); not confirmed | "Always a way to destroy yourself" cannot be guaranteed as written | Brute-force routes must not pay best | Measured: sedan stand-and-lunge 150, scripted bait 300, ambush from outside the sensors 500 |

[EDIT26#9.2~1] 9.2 Prices (Proposed)
### 9.2 Prices (Proposed)
Prices vary by how much a node changes play. Nodes that add a verb cost more than nodes that scale a number.
| Node | Branch | Tier | Price | Why |
|---|---|---|---:|---|
| **Big battery** | Battery | 1 | 1 | A number. Deliberately the cheapest node, so a first purchase is possible after one write-off |
| **Hips** | Torso | 1 | 2 | Doubles `movement.turnRate`. Strong, but still a number |
| **Wider view** | Head | 1 | 2 | Information, not action |
| **Carry** | Arms | 1 | 2 | Activates the B button; needs a cone present to pay off |
| **Spring start** | Legs | 1 | 2 | Removes `movement.rampSeconds`. The first step costs nothing |
| **Grip** | Legs | 2 | 2 | Removes the slide on diesel, gravel and puddles |
| **Throw** | Arms | 2 | 2 | Extends Carry rather than adding a verb |
| **Fast charge** | Battery | 2 | 2 | A multiplier |
| **Memory** | Head | 2 | 3 | Persistence of sensing |
| **Ears** | Head | 2 | 3 | Warning from outside the cone |
| **Neck** | Torso | 2 | 3 | Decouples look from facing |
| **Jump** | Legs | 2 | 3 | New traversal; gated on gaps existing in the level |
| **Kinetic charge** | Battery | 2 | 3 | Changes resource rhythm |
| **Spine** | Torso | 2 | 4 | Steers a committed lunge. The strongest single node |
| **Hold on** | Arms | 2 | 4 | Rides a vehicle; the most complex state |
- Tier 2 requires its branch's tier 1.
- **Whole tree:** 38 bodies. Unaffordable by design.
- **Spendable in a run:** 14, at `run.certification` 15.
**Sample builds at 14 bodies**
| Build | Purchases | Nodes |
|---|---|---|
| Broad | Big battery 1, Hips 2, Wider view 2, Carry 2, Spring start 2, Throw 2, Fast charge 2 | 7 |
| Deep legs and torso | Spring start 2, Jump 3, Grip 2, Hips 2, Spine 4 | 5 |
| Information | Wider view 2, Memory 3, Ears 3, Hips 2, Neck 3 | 5 |
Five to seven nodes of fifteen per run, about a third of a 38-body tree. No two runs build the same dummy.
**Pacing check (Open).** At 15 write-offs a full run runs to about 20 minutes at 80 seconds each, mid-horizon (pillar 4). A five-minute visit yields about three bodies — Big battery plus Hips, or Hips plus Spring start. Two purchases, meeting the target in 10.2 at its lower bound. Measure before approval. Gate: 13.1.
**Parameters — upgrade prices**
*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

[EDIT26#11.4] 11.4 Module boundaries (Proposed)
### 11.4 Module boundaries (Proposed)
Small contracts, not a framework. No general event system or entity-component rewrite is required.
| Owner | Sole authority over | Reads |
|---|---|---|
| Run | Run phase, level, quota, certification, ending | Committed impacts and write-offs |
| Body | Health, charge, facing, locomotion, carried prop, attachment, service flag | Owned upgrades and World |
| Vehicles | Appearance position and speed, perception, route, commitment, spent-impact flag | Class data and the model learning snapshot |
| Traffic | Admission, path reservations, priority | World and all vehicle footprints |
| Damage | Impact calculation only. No rewards, no UI | An immutable collision snapshot |
| Economy | Score, credit balance, owned upgrade IDs | Unique reward transactions |
| Learning | Model experience and approach counters | One unique write-off outcome |
| World | Terrain, occupancy, prop positions | — |
| Sensing | Player-visible zones and remembered observations | Authoritative state. Never changes what car sensors know |
| Presentation | Animation, HUD, audio, narrative selection | Committed outcomes. Cannot award points, advance learning or choose endings |
- Body is the only source of effective upgraded statistics. Sensing reads Body's cone width rather than keeping a second copy.
- Presentation may wait for an animation, but cannot delay deciding whether an outcome is terminal.
- Pauses, reports and hit-stop freeze gameplay clocks including battery, service, traffic and learning. Presentation time is separate.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "t902",
   "event": "impact",
   "when": {
    "district": "parkland",
    "tile": "A3",
    "tier": "02"
   },
   "style": "speech",
   "priority": 2,
   "text": "V02: Jump impact logged at 38 km/h on the belvedere.\nDamage to my panels is 14%.\nRoute delay is 47 seconds; KPIs adjusted.",
   "claims": [
    "district:parkland",
    "tile:A3"
   ]
  }
 ]
}

EVALUATION
SCORE: 1/10
REASON:
- t902 · F1 (blocking, −4) "V02: Jump impact logged at 38 km/h on the belvedere.\nDamage to my panels is 14%.\nRoute delay is 47 seconds; KPIs adjusted." The line is 122 characters, and a bubble holds at most 48. [EDIT39#6.6] Fix: replace the text with "Impact on the belvedere. KPIs adjusted." (39 characters).
- t902 · F2 (major, −2) "V02:" and "\n" The line has a speaker tag and three line breaks, but a bubble is one plain line in one ink. [FSG#field-text] Fix: remove the "V02:" tag and the line breaks, and keep a single plain sentence pair.
- t902 · F5 (major, −2) "38 km/h", "14%", "47 seconds" These are typed gameplay figures, and a bark may take figures only from event placeholders. [STORY#S1] Fix: remove all three figures.
- t902 · R1 (blocking, −4) "at 38 km/h", "Damage to my panels is 14%", "Route delay is 47 seconds" The `impact` event logs zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck and plate, so no speed, damage or delay is logged and all three are invented. [FLEET#F8] Fix: cut the speed, damage and delay claims and keep only "Impact on the belvedere. KPIs adjusted."
- t902 · R2 (blocking, −4) "Jump impact" The conditions only bind district and tile, so the line fires on every impact on A3, jump or not, and "jump" has no claim that guarantees it. [FLEET#F8] Fix: drop "Jump", or add a `drop` condition and claim that `check_lore.py` accepts as a jump.
Total: 10 − 4 − 2 − 2 − 4 − 4 = 1.