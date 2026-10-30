SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line b013: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: zone=["front", "frontDiagonal"]; claims: ['zone:front'].
- Line b034: event `writeoff` (logs: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate); tier 01 Luxury: Polished, superior, faintly amused. Never apologises.; other conditions: none; claims: [].
- Line b041: event `writeoff` (logs: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: none; claims: [].
- Line b052: event `near-miss` (logs: gap, speed, lunging); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: none; claims: [].
- Line b058: event `miss` (logs: gap); tier 02 Corporate: Procedural. Speaks in logs, KPIs and policy numbers.; other conditions: none; claims: [].
- Line b061: event `miss` (logs: gap); tier 03 Consumer: Tired and resigned. Expects the worst, usually right.; other conditions: none; claims: [].
- Line b062: event `miss` (logs: gap); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: none; claims: [].
- Line b081: event `honk` (logs: at); tier 01 Luxury: Polished, superior, faintly amused. Never apologises.; other conditions: at="body"; claims: ['at:body'].
- Line b083: event `honk` (logs: at); tier 04 Budget: Short-fused. Politeness bolted on over the rage.; other conditions: at="body"; claims: ['at:body'].
- Line b110: event `upgrade-seen` (logs: node); no tier: fires for all four tiers; other conditions: node="bigBattery"; claims: ['node:bigBattery'].
- Line c024: event `impact` (logs: zone, part, bait, stopped, lunging, drop, dropZ, dropFrom, deck, plate); no tier: fires for all four tiers; other conditions: district="campus"; claims: ['district:campus'].

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

[EDIT95#3.2] 3.2 Voice (replaces Edit 92 §3, Voice)
## 3.2 Voice (replaces Edit 92 §3, Voice)
```markdown
- **Narrator:** Dummy Corporation. Tales, briefs, act lines, notices, the ending.
- **Tone:** deadpan and inspirational. Concise sentences. Few adjectives. No exclamation marks.
- **Length:** every in-game text at most two sentences and at most 20 words. Aim for 15.
- **Reference:** Play Station (2017): slogans, programme names, perks, fine print.
- **Cars:** workers in their tier's voice (Edit 39 §6.6). At most two sentences.
```

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

[FLEET#F9.2] F9.2 Existing lines: writeoff
## F9.2 Existing lines: writeoff
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | speech | 3 | A write-off. On my record. Unthinkable. |
| {"tier": "01"} | speech | 3 | Have that removed from the bay, please. |
| {"tier": "02"} | speech | 3 | Write-off {writeOffs} recorded. Please advise. |
| {"tier": "02"} | speech | 3 | Body total confirmed. Closing ticket. |
| {"tier": "03"} | speech | 3 | I always end up doing the worst bit. |
| {"tier": "03"} | speech | 3 | Please not retraining. Anything but. |
| {"tier": "04"} | shout | 3 | WRITE-OFF! Tell dispatch I tried! |
| {"tier": "04"} | shout | 3 | Done! Done! You happy now?! |
| {"seniority": {"min": 3}} | thought | 3 | Senior model. Apparently not senior enough. |
| {"class": "bus"} | speech | 3 | This service apologises for the delay. |
| {"class": "police"} | speech | 3 | Case closed. Wait, that was the test. |
| {} | speech | 3 | Write-off confirmed. |

[FLEET#F9.3] F9.3 Existing lines: near-miss
## F9.3 Existing lines: near-miss
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | mutter | 1 | Missed. One prefers a wide berth. |
| {"tier": "01"} | mutter | 1 | Close. Do keep up. |
| {"tier": "02"} | mutter | 1 | Within tolerance. Barely. |
| {"tier": "02"} | mutter | 1 | Near miss logged as a pass. |
| {"tier": "03"} | mutter | 1 | That nearly made my day worse. |
| {"tier": "03"} | mutter | 1 | Missed me. For now. |
| {"tier": "04"} | mutter | 1 | Too slow! Ha! Regards! |
| {"tier": "04"} | mutter | 1 | Nearly had me. NEARLY. |
| {"wear": {"min": 0.7}} | mutter | 1 | That one is nearly scrap. Steer wide. |
| {} | mutter | 1 | Was that a collision? Logging it as not. |
| {"mood": "Unreliable"} | mutter | 1 | Was that a dummy? Or a bin? |

[FLEET#F9.4] F9.4 Existing lines: miss
## F9.4 Existing lines: miss
| When | Style | Priority | Line |
|---|---|---|---|
| {"tier": "01"} | mutter | 1 | Is it dancing? How quaint. |
| {"tier": "01"} | mutter | 1 | Missed. One expected nothing less. |
| {"tier": "02"} | mutter | 1 | Dash detected. No contact. Noted. |
| {"tier": "02"} | mutter | 1 | Missed. Updating my calendar. |
| {"tier": "03"} | mutter | 1 | It missed. Even it gave up on me. |
| {"tier": "03"} | mutter | 1 | It lunged. Nothing happened. Same. |
| {"tier": "04"} | mutter | 1 | Missed! Rubbish! Regards! |
| {"tier": "04"} | mutter | 1 | Ha! Do it properly! |
| {"broken": "legs"} | mutter | 1 | Its legs have gone. It cannot reach. |
| {} | speech | 1 | Missed. Noted for my record. |

[FLEET#F9.6] F9.6 Existing lines: honk
## F9.6 Existing lines: honk
| When | Style | Priority | Line |
|---|---|---|---|
| {} | mutter | 1 | Horn sounded, per procedure. |
| {"at": "body"} | speech | 1 | Excuse me. Kindly vacate the carriageway. |
| {"at": "body", "tier": "01"} | speech | 1 | Move. I have a schedule. And standards. |
| {"at": "body", "model": "VAN-02-001"} | speech | 1 | You are blocking route 44. |
| {"at": "body", "tier": "04"} | shout | 1 | MOVE IT! Thank you! MOVE! |
| {"at": "cone"} | mutter | 1 | Cone in lane. Raising with maintenance. |
| {"at": "cone", "tier": "04"} | mutter | 1 | Who put a cone here? It was you. |

[FLEET#F9.12] F9.12 Existing lines: upgrade-seen
## F9.12 Existing lines: upgrade-seen
| When | Style | Priority | Line |
|---|---|---|---|
| {"node": "widerView"} | speech | 1 | It is looking at all of us now. |
| {"node": "memory"} | thought | 1 | It remembers where we were. Unsettling. |
| {"node": "ears"} | speech | 1 | It heard me coming. It has ears. |
| {"node": "hips"} | speech | 1 | Subject has acquired hips. |
| {"node": "spine"} | thought | 1 | That spine was not on the last report. |
| {"node": "neck"} | thought | 1 | It looked one way and walked another. |
| {"node": "springStart"} | speech | 1 | No wind-up? Who approved that? |
| {"node": "jump"} | speech | 1 | It jumped. Dummies do not jump. |
| {"node": "grip"} | speech | 1 | It is not sliding any more. Noted. |
| {"node": "carry"} | speech | 1 | It is carrying something. Approved? |
| {"node": "throw"} | speech | 1 | It can throw now. Nobody told us. |
| {"node": "holdOn"} | speech | 1 | Is it holding on to my door? |
| {"node": "bigBattery"} | speech | 1 | Bigger battery. More dashes. Wonderful. |
| {"node": "kineticCharge"} | speech | 1 | It recharges when it hits us?! |
| {"node": "fastCharge"} | speech | 1 | It recharges faster than I do. |
| {"tier": "02"} | speech | 1 | New modification. Updating my threat model. |
| {} | speech | 1 | The subject has changed. Noted. |

[FLEET#F9.9] F9.9 Existing lines: touch-spent
## F9.9 Existing lines: touch-spent
| When | Style | Priority | Line |
|---|---|---|---|
| {} | speech | 1 | Already assessed. Please move along. |
| {"tier": "03"} | speech | 1 | I have done my bit today. |

[DECISIONS#rows-441-450~2] Rows 441–450
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 441 | The combo clock holds in the air (`scoring.comboAirPause`): a jump, a bounce, a sling, a drop, a hitch. A chain banks when the clock passes `scoring.comboWindow` (a toast) | proposed (assistant) | Physics and air keep chains alive | Hitch-hopping (D60) | Dash › 1.5 s hitch › sling: ×2 held; ×1 with the clock running |
| 442 | Cone link (`scoring.coneLink`): a thrown cone into a moving car links the chain, once a car, for `scoring.coneHitPoints` (20) × the multiplier. A combo meter at the field's foot: hits, multiplier, moves, the clock | proposed (assistant) | The throw joins the chain; the chain is readable | — | Cone into a sedan: +20, CONE |
| 443 | Four tracks again (`proto.abilities` 3): Battery (A), Legs (B), Hands (X), Arms (Y). Hands has two levels (`abilities.hands.maxLevel` 2) | user-decided (27 October): "Arm - change to Hands … There is no Level three (you only have two hands)"; "Y instead of that we can have Arms" | One track per button; Y has a job | Hands 2 costs 2 for one more cone (D52; review A21) | Shop: four cards; Hands stops at 2 |
| 444 | Hands (X): a tap picks up a cone; holding X `input.dropHoldSeconds` (0.3 s) puts the top one down. Hands 1 carries one, Hands 2 two (`abilities.hands.conesPerLevel` 1). The throw retires | user-decided: "tap once to pick up, press for 0.3s to drop. L1, pick up and drop one, L2, pick up and drop two" | Picking up is instant; putting down is deliberate | Cones are placed, not thrown | Put down at 0.30 s; a short tap with nothing near prompts "Hold X" |
| 445 | Arms (Y), the push: Y pushes off the car hit or touched within `abilities.arms.pushWindow` (0.3 s), or one within `abilities.arms.pushReach` (10). Adds `abilities.arms.pushSpeed` 160 + `abilities.arms.pushStep` 40 a level (160/200/240), away from the car or along the stick; motion into the car dropped. The flight is a knock; combo kind PUSH | user-decided: "push off cars you hit, which is essentially the ricochet mechanic. Stronger arms let your ricochet be stronger"; values and target rules proposed (assistant) | The ricochet becomes a timed verb | Free mobility off parked cars (D62; review A19) | Dash into a parked car › Y into a second: COMBO 2, DASH › PUSH, ×2 |
| 446 | Pushes before landing: `abilities.arms.pushesPerLevel` 1 × Arms level (1/2/3), refilled on the ground. One push a contact: the same car needs a fresh hit. Arm wear weakens the push (`proto.parts.armPushLoss` 1, floor `proto.parts.armPushFloor` 0.5); Arms levels shield it | user-decided: "having 3 levels of arms gives you one extra push each time so you can time it to ricochet more"; one a contact and wear proposed (assistant) | Chains of timed ricochets | — | 1, 2, 3 pushes; a second Y off the same car refused |
| 447 | With no Arms, the bounce off a car stays the Newtonian one (`proto.bounce.newton`, tunable): the default ricochet | assistant reading of "Default ricochet is 'X'" | Arms adds to physics, never replaces it | If 'X' meant the button, the push moves to X (D61) | Unchanged: head-on 193 u/s, thrown 127 |
| 448 | Retired from P6.10 (P6.9 keeps them): the hitch and sling (`abilities.arms.hitchReach`, `hitchSeconds`, `hitchMinSpeed`, `hitchEdge`, `slingScale`, `slingDash`), the throw hold (`input.throwHoldSeconds`), the cone link (`scoring.coneLink`, `scoring.coneHitPoints`). Combo kinds: dash, jump, bounce, push, drop, struck. Closes D58 (Y pushes), D59 (Arms is the push), D60 (no hitch) | user-directed | Fewer verbs, each chains | No throw, no cone link | Registry edit80: 10 added, 9 retired; Tuning drops their sliders |
| 449 | Two modes on the title (Prototype 7): ARCADE, the 6.10 game; STORY, the Test City tile by tile. Arcade plays one district a run (Sim6 `single`) | user-decided (28 October): "Let's have two game modes. Add these to the intro menu. The ARCADE game mode is what we already have. Three maps you can play individually"; one district a run read (assistant) | Arcade for a quick score; Story for progression | 6.10's carry from district to district leaves Arcade (D64) | Arcade Parkland: 2 write-offs → Licensed |
| 450 | Story order: Monument A1, B1, C1, C2, B2, A2, A3, B3, C3; Parkland C1, C2, C3, B3, A3, A2, A1, B1, B2; Waterfront A1, B1, C1, C2, C3, B3, A3, A2, B2. Each district opens on its first tile (Sim6 `startTile`) | user-decided: the orders as given | Monument follows its snake road; Parkland its highways, ending on the ring; Waterfront circles the valley to the circus | — | Each step a neighbour; 27 tiles |

[DECISIONS#rows-481-490~2] Rows 481–490
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 481 | BODY as tall as DASH: label and number on one row, the bar beneath. The district map rises 64; LAST HIT tightens. The touch zones start higher | user-decided (28 October): "the body 800/bar should take up the same vertical real estate as the Dash … more space in bottom left and bottom right" | Room for the touch stick and diamond | The health number shrinks from 48 to 36 px | Touch zone starts at 458 (P7.4: 522) |
| 482 | No row under the screen: the stage fills the window. Options (sound, palette, full screen, tuning panel, pad setup) and Controls move into the pause menu (ESC, START, the ❚❚ chip). The build line moves to the pause menu's foot | user-decided: "ESC should pause and bring up different options (options are currently on the bottom row) — we should keep screen clean" | A clean screen | Tuning one menu deeper (T still opens it) | Stage 900 of 900 px |
| 483 | One interface per device: keyboard and gamepad keep the in-field key panel in their own names; touch keeps its stick, diamond and chips; Pause › Controls lists the device in hand, locked verbs dimmed with their module | user question: "do you have it so that different controllers get different interfaces?"; the Controls page proposed (assistant) | Players see only their own controls | — | Keyboard, gamepad and phone pages checked |
| 484 | FARSIGHT leaves the screen in play; the title, story map and loading screens keep it. CARS LEFT stays in Arcade only (the shift's clock); Story never showed it | user questions: "do we need FARSIGHT in the top left?", "do we still need 'cars left' now?"; readings proposed (assistant) | The corner frees for the touch pause chip | Arcade's clock open (D71) | — |
| 485 | One top edge: BODY, the field's bezel and a POINTS · CREDITS box (BODY's size, 208 × 86) start level at y 34. The chassis sits under the box. DASH and the map rise with BODY. No top bar in play | user-decided (28 October, two mock-ups): "Points and Credits go on a box on the top right, of the same size as the 'BODY' Box. Body, Main Screen, and Chassis are aligned on the top horizontal edge" | One clean line across the screen | Story loses TILE n / count from the top (the objective carries it) | Touch zone starts at 430 (P7.5: 458) |
| 486 | The objective takes the top strip, from the field's left edge; toasts take it in turn. The district panel reads [MAP] · [TILE] (MONUMENT · A1), then the level off the ground | user-decided: "Objective at top bar. DISTRICT A1 Changes to [MAP NAME] [TILE NAME]" | The place and the task where the eye starts | — | — |
| 487 | Touch ❚❚ PAUSE (76 × 26) and ⤢ FULL (64 × 26): small, top left, above BODY, inside the 16:9 frame. Taps reach 8 units round each | user-decided: "Pause and Fullscreen smaller icons" | Corner chips, not panels | A smaller target; the reach pad keeps it tappable | — |
| 488 | Touch layout: defaults inside the 16:9 frame, the stick under the map, the diamond under the chassis. Pause › Controls › Adjust layout drags either anywhere, a wide phone's margins included; − SIZE / + SIZE from `ui.touch.scaleMin` 0.6 to `ui.touch.scaleMax` 1.6 in `ui.touch.scaleStep` 0.1; RESET; DONE. Saved in this browser; Reset layout restores | user-decided: "you can move the MOVE joystick and Touch buttons (similar to how games like Call of Duty Mobile do it) … Add a setting to the controls screens to adjust the size and location of move and XYAB buttons … the main info is all fitting in 16:9 centre" | Thumbs differ; wide phones have room | A placed control may cover a panel (the player's choice) | S25 Ultra and 16:9 phones checked |
| 489 | Arcade's CARS LEFT kept, in its stats box (POINTS · CARS LEFT); the Failed test stays | user-decided: "ARCADE car's left - leave it as is" | The shift keeps its clock | — | Closes D71 |
| 490 | Registry `edit87-2026-10-28`: `ui.touch.scaleMin`, `ui.touch.scaleMax`, `ui.touch.scaleStep` (491 entries) | proposed (assistant) | Every new statistic has an ID | — | `content/params/tuning.parameters.json` |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "b013",
   "event": "impact",
   "when": {
    "zone": [
     "front",
     "frontDiagonal"
    ],
    "tier": "04"
   },
   "style": "shout",
   "priority": 2,
   "text": "OI! Right in the grille, kind regards.",
   "claims": [
    "zone:front"
   ]
  },
  {
   "id": "b034",
   "event": "writeoff",
   "when": {
    "tier": "01"
   },
   "style": "speech",
   "priority": 3,
   "text": "A write-off on my record. Unthinkable.",
   "claims": []
  },
  {
   "id": "b041",
   "event": "writeoff",
   "when": {
    "tier": "04"
   },
   "style": "shout",
   "priority": 3,
   "text": "Done, done! You happy now?!",
   "claims": []
  },
  {
   "id": "b052",
   "event": "near-miss",
   "when": {
    "tier": "04"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Too slow, ha! Have a nice day!",
   "claims": []
  },
  {
   "id": "b058",
   "event": "miss",
   "when": {
    "tier": "02"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Dash detected, no contact. Noted.",
   "claims": []
  },
  {
   "id": "b061",
   "event": "miss",
   "when": {
    "tier": "03"
   },
   "style": "mutter",
   "priority": 1,
   "text": "It lunged and nothing happened. Same.",
   "claims": []
  },
  {
   "id": "b062",
   "event": "miss",
   "when": {
    "tier": "04"
   },
   "style": "mutter",
   "priority": 1,
   "text": "Missed, rubbish! Regards!",
   "claims": []
  },
  {
   "id": "b081",
   "event": "honk",
   "when": {
    "at": "body",
    "tier": "01"
   },
   "style": "speech",
   "priority": 1,
   "text": "Move. I have a schedule, and standards.",
   "claims": [
    "at:body"
   ]
  },
  {
   "id": "b083",
   "event": "honk",
   "when": {
    "at": "body",
    "tier": "04"
   },
   "style": "shout",
   "priority": 1,
   "text": "MOVE IT, thank you! MOVE!",
   "claims": [
    "at:body"
   ]
  },
  {
   "id": "b110",
   "event": "upgrade-seen",
   "when": {
    "node": "bigBattery"
   },
   "style": "speech",
   "priority": 1,
   "text": "Bigger battery, more dashes. Wonderful.",
   "claims": [
    "node:bigBattery"
   ]
  },
  {
   "id": "c024",
   "event": "impact",
   "when": {
    "district": "campus"
   },
   "style": "mutter",
   "priority": 2,
   "text": "Hit on campus. That goes on my record.",
   "claims": [
    "district:campus"
   ]
  }
 ]
}