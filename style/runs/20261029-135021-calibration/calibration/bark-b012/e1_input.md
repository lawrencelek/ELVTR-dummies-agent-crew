SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line b012: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 03 Consumer: Tired and resigned. Expects the worst, usually right.; other conditions: zone=["rear", "rearDiagonal"]; claims: ['zone:rear'].

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
| 543 | Assignment #6: the Style Guide Agent (`style/`). A style guide from the GDD (tone, vocabulary and lore, formatting and length, truth; every rule cites its chunk); a deterministic lint as evidence; a loop of three fresh agents, generator → evaluator → refiner → evaluator, until 10/10 or three refinements. The evaluator returns SCORE and REASON. Its statistics live in `style/style.params.json` until the registry moves past edit94 (the P7.13 suite gates the version) | proposed (assistant) | The brief: a capstone-anchored guide; no binary grading; no human in the loop | Style IDs sit outside `tuning.parameters.json` for now | `style/README.md` |

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

[DECISIONS#rows-451-460~2] Rows 451–460
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 451 | A tile wants `story.tileWriteOffs` (3) counted write-offs. Farsight's brief tests the fatal hit; a miss scores but does not count | user-decided: "destroy three bodies with specific requirements from Farsight"; fatal-hit test proposed (assistant) | Every body still pays points; only data Farsight asked for counts | 81 bodies to certify (D65); fatal hit only (D66) | Dash write-off counted in A1; missed in B1 (drop brief) |
| 452 | Fences: the tile in test is fenced on every side, held against walks, dashes, jumps, pushes and throws. A clear drops them and opens the next tile; entering it closes the fences behind. Cleared tiles stay open; write-offs there score only | user-decided: "fence barriers you can't jump until it is cleared"; "You can go back to tiles you have cleared"; closing behind proposed (assistant) | A tile is an arena; the cleared city is yours to roam | — | Held at x 787; B1 fenced E, S, W on entry |
| 453 | Power-ups: a clear pays `story.clearPowerUps` (1); every `story.pointsPerPowerUp` (15,000) points pays one more. A power-up is one shop credit; levels cost 1, 2, 3. No per-body credit in the story; the shop shows only with power-ups to spend | user-decided: "Three bodies = one powerup"; "you can improve with score"; credit reading and values proposed (assistant) | Score buys strength; a clear always pays | A whole level per clear would max the tracks by tile 11 (D63) | 47,510 points, 1 paid → +2 |
| 454 | Gifts on arrival: Legs 1 at Monument C1, Hands 1 at B2, Arms 1 at A2, Battery 1 at B3; `story.giftPowerUps` (1) at Parkland C1 and Waterfront A1. Each brief's ability is gifted by its tile | user-directed: "Farsight gives you a specific task and/or power up"; placement proposed (assistant) | Monument teaches one verb a tile | Four free levels | C1 installs Legs 1 |
| 455 | 27 tales, one per tile, in `content/story/story.json` with the briefs and gifts. Shown on the tile card and the story map | user-directed: "Generate a simple tale about how this part of the Test City appeared"; text proposed (assistant) | Content stays out of code; numbers are registry IDs | — | 911 words |
| 456 | The map reveals cleared tiles and the tile in test; the rest read "?". The HUD's district map draws fences as yellow dashes and the brief beneath | user-decided: "gradually the whole map is revealed" | Linear, legible progress | — | Story map at start: A1 only |
| 457 | No clock in the story: a district runs `story.shiftCars` (5,000) cars; no Failed test | proposed (assistant) | Progress, not pressure | — | — |
| 458 | Story progress saved in the browser (one slot), after every count, clear, gift and purchase. NEW STORY erases on a second press | proposed (assistant) | 81 bodies span sessions | One device, one slot | Reload resumes A1 at 1 of 3 |
| 459 | Prototype 6.10 frozen; the shared code in `prototypes/p6` builds P7 from `prototypes/p7/build.py`. `p6/build.py` refuses | proposed (assistant) | One source; old builds byte-identical | — | test_p610 47/47 on the shared code |
| 460 | Credits: `economy.creditsPerWriteOff` (1) for every body written off, in Arcade and Story, counted or not. Story clears and score pay nothing. Retires `story.clearPowerUps`, `story.pointsPerPowerUp` (P7 keeps them). Closes D63 | user-decided (28 October): "One credit per body destroyed" | One rule in both modes; every body pays | Replaying cleared tiles buys levels | Missed write-off: +1; a million points: +1 |

[DECISIONS#rows-461-470~2] Rows 461–470
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 461 | Story prices: `story.price.ability.level1` 3, `level2` 4, `level3` 5; they stand in for `economy.price.ability.level1`–`level3` in a story run. Arcade keeps 1, 2, 3. Credit gifts: `story.giftCredits` 3 (Parkland C1, Waterfront A1) | user-decided: "V1 powerups cost 3 credits, V2 powerups cost 4 credits, V3 powerups cost 5 credits"; Arcade unchanged and the gift value proposed (assistant) | A level-1 power-up is three bodies | A track costs 12; all 43 | Battery 1 at 3 |
| 462 | Arcade plays one district a run. Closes D64 | user-decided: "yes one district per arcade run" | — | — | Parkland: 2 write-offs → Licensed |
| 463 | Write-offs per tile: `story.writeOffs.<district>.<tile>`, 27 IDs, 1–3 each (Monument 17, Parkland 22, Waterfront 23; 62 in all). Retires `story.tileWriteOffs`. Closes D65 | user-decided: "let's tune the write-offs per level tile"; values proposed (assistant) | 1 for a rare brief, 2 to learn a verb, 3 later | — | A1 cleared at 2 |
| 464 | Only the last hit counts against a brief. Closes D66. Prototype 7.1 is the final P7; Prototype 7 frozen | user-decided: "yes only the last hit counts"; "This is the final P7.1" | — | — | test_p71 43/43 |
| 465 | Defaults in both modes: two dashes (`battery.capacity`), standard recharge (`battery.secondsPerCharge`), standard recoil, no ability level. Story gifts only the verbs a brief needs: Legs 1 (Monument C1), Hands 1 (B2), Arms 1 (A2). Battery 1 and the credit gifts go; `story.giftCredits` retired | user-decided (28 October): "By default you ONLY have two dashes, standard recharge, standard recoil, and no other abilities" | Every upgrade is earned | — | Defaults checked in Arcade and Story |
| 466 | Story tile counts retuned so the upgrade tracks fill only at the end of Waterfront: 35 bodies (Monument 10, Parkland 12, Waterfront 13). Bought as soon as affordable, the last level lands on Waterfront B2's first body | user-decided: "Upgrade tracks fill up only at the end of Waterfront"; counts proposed (assistant), given prices 3, 4, 5 and a credit a body | The economy paces the story | A shorter story (7.1: 62 bodies) (D67) | Fill at body 34 of 35 |
| 467 | The ricochet: the knock keeps `proto.recoilScale` 0.7 of its Newtonian velocity (the rest is damage) and slides at most `proto.bounce.maxThrow` 40. Arcade and Story (P7SIM). Pushes stay uncapped | user-directed: "the dummy gets hurt which means it doesn't get all the momentum … a sensible adjustment"; values proposed (assistant) | A hit throws about a lane, not a screen | Pushes uncapped (D68) | Head-on 98 u/s, 26 units (was 193, 127) |
| 468 | The ferry: a clear calls a Farsight drone; it carries the new chassis over the edge into the next tile and sets it down off the road, within `story.ferryDepth` 160 of the crossed edge, nearest the crossing. Then the tile card. Not between districts | user-decided: "the drone appears and takes the body to the next tile … close to the entrance point but not on the road"; depth proposed (assistant) | Progress moves the dummy, as a test rig would | — | A1 → B1 in 4.7 s, 40 in from the edge |
| 469 | Fences only toward tiles not yet open (open: cleared tiles and the tile in test), drawn as a yellow glow at the screen's edge, as in Zelda. Nothing across a road. Supersedes row 452's "closes behind" | user-decided: "IT can just be like in Zelda … a graphic indication at the edge of the bounded screen"; open set proposed (assistant): with the ferry, "closes behind" would lock the dummy in | Cleared tiles stay reachable | — | B1 fenced E and S; A1 open |
| 470 | Maps: uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength (district map and story map) | user-decided | — | — | Story map: A1 cleared, B1 ringed |

[DECISIONS#rows-511-520~2] Rows 511–520
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 511 | Arcade: every part for credits (`economy.price.ability.level1`–`3`); the chassis ships with Battery 1; no drone gifts (`arcade.giftEvery` retired) | user-decided: "In arcade mode, you get the items by getting credits" | A score run with its own shop | Short quotas buy few parts | Closes D72; D69 superseded |
| 512 | Miss floor: in the tile in test, a hit that would write the chassis off but misses the brief leaves `story.missFloor` (1). The hit scores; no write-off; toast "Not the brief: chassis held at 1". Cleared tiles keep the ordinary rule | user: "if the FINAL hit does NOT kill the player, then they can move around at 1 health?"; reading: a fatal hit off the brief (assistant) | No restart for a near miss | At 1 health only a hit to the brief ends the chassis | Fatal dash in B1 (drop): held at 1, lost 29 of 30 |
| 513 | On foot, the chassis holds `damage.bodyHealthOnFoot` (500) until Battery 1; a fit mid-chassis adds the difference (500 → 800) | user: "in Screen 1, the Dummy's health is only 500 (since they cannot dash)"; read as an instruction | Struck hits are softer; A1 stays short | — | A1: 500; after the B1 drone: 800 |
| 514 | POINTS small, top right on the strip above the boxes (Arcade: POINTS and CARS LEFT, two lines). The stats box retires; BODY, the field and the chassis share one top edge | user: "the Points should be in the top right corner, and with font smaller" | Long numbers fit; the side column frees | — | 12,345 points at A1 |
| 515 | Chassis (P7): each part reddens with its damage (its share of the chassis, full at `proto.parts.brokenShare`); its damage beside it: head and torso on the part, arms and legs in the margins. The effect rows (SPEED, DASH, RECHARGE, VIEW, CONE) retire in P7 | user: "damaged parts should get more 'red' … numbers next to them, instead of adding additional rows of figures … it 'eats up' touch interface space" | One panel, 306 tall | Effects read from the colour, not a percentage | Six parts damaged: six numbers |
| 516 | Story's report goes to the next chassis; the gift screen names the next part and its tile; save cards and the map read PARTS n / 11; a 7.9 save receives its cleared tiles' parts. The workshop is Arcade's alone | proposed (assistant), following row 509 | No dead screen in Story | — | `test_p710.js` |
| 517 | The DUMMY MONUMENT on the circus's island (Waterfront B2): the dummy three times life in white stone, black joints, the calibration mark; stepped tiers, a pedestal, a lit plaque; paving and an LED ring; solid (`world.dummyMonument` 1 in P7) | user-decided: "In the centre of the circus there must be a kind of DUMMY MONUMENT" | The finale's set piece stands from the start | Its unveiling waits for D74 | `p710_monument.png` |
| 518 | Story narratives: three proposals in three acts (A CERTIFIED, B STAND-IN, C BILL OF LADING); a tile audit (8 of 27 off: Monument A1, A2, A3, C3; Parkland C1, B1, A2; Waterfront B2) | proposed (assistant) on the user's spine: Monument (off the factory floor; a test city), Parkland (protect humans), Waterfront (an import), a drone to a ship | — | — | `DUMMIES_Story_Three_Acts_Narratives.md`; D74, D75 |
| 519 | Registry `edit91-2026-10-28`: `proto.batteryModel`, `abilities.battery.dashCharges`, `damage.bodyHealthOnFoot`, `story.missFloor`, `world.dummyMonument`; `story.level.*` and `arcade.giftEvery` retired (504 entries) | proposed (assistant) | Every new statistic has an ID | — | `content/params/tuning.parameters.json` |
| 520 | The story is Narrative A, Certified: Act I Monument, INDUCTION (off the factory floor, new staff; the turn at C3, ROLE: DESTRUCTIVE TESTING); Act II Parkland, OPENING DAY (the Expo opens when the park passes; the board applauds the cars at B2); Act III Waterfront, CUSTOMS (the customs log at A3; the monument cast from every chassis lost; a ship to a market far away) | user-decided: "I choose Narrative A - Certified" | One voice, Farsight's, for the whole city | B and C set aside | Closes D74 |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "b012",
   "event": "impact",
   "when": {
    "zone": [
     "rear",
     "rearDiagonal"
    ],
    "tier": "03"
   },
   "style": "shout",
   "priority": 2,
   "text": "Hit from behind. Story of my life.",
   "claims": [
    "zone:rear"
   ]
  }
 ]
}