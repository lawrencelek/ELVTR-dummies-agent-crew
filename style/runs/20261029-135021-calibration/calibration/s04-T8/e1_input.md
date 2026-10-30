SLOT
- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.
- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}
- Bubble: at most 48 characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1.
- Line s04: event `writeoff` (logs: writeOffs, chassis, zone, drop, dropZ, dropFrom, deck, plate); no tier: fires for all four tiers; other conditions: none; claims: [].

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

[DECISIONS#rows-21-30~2] Rows 21–30
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 21 | Fix three Testpad problems in the port: speed tied to screen refresh rate, unseeded randomness, lunges chaining while Space is held | proposed (assistant; implemented) | GDD requires seeded runtime; the other two change how the game plays on different machines | The port can no longer be compared frame for frame with the Testpad | Checks `walk_frame_rate_independent`, `car_speed_real_time`, `deterministic_and_seeded`, `held_lunge_does_not_chain` pass |
| 22 | Win by cumulative write-offs reaching a certification target (11) above the sum of level quotas (2 + 3 + 5) | proposed (follows the GDD; numbers chosen by the Designer agent) | GDD section 5 | Replaces the Testpad's "all twelve files closed" licence; untuned | Check `ending_licensed` passes; the automated player reached 9 of 11 |
| 23 | Level 2 roads carry traffic in both directions | superseded by 30 (the Designer agent's choice) | Not specified in the brief | Oncoming traffic caused a deadlock in build 1 | Fixed in build 2 by the repair loop |
| 24 | Car-to-car collisions are enforced by a check on level 2 only; on level 3 overlaps are reported, not required | superseded by 27 | Lawrence asked for no collisions at the junction and called level 3 a free-for-all | Cars can overlap on level 3 when the dummy is involved | Seen in one browser screenshot |
| 25 | Stop a crew run to correct the check harness, and say so in the run log | tested | A harness bug would have sent the Builder a false repair request | The submitted run reuses the specification and first build from an earlier run | `runs/20261006-214051`, `runs/20261006-215043`, `runs/20261006-215228` |
| 26 | Add an automated player and a "levels always end" check after the player found a deadlock | tested | The original checks kept the dummy out of traffic, so they could not see it | Longer check run | Build 1 fails the new check, build 2 passes |
| 27 | Cars have a collision box on every side: the dummy cannot pass through a car, and cars cannot overlap each other on any level | user-confirmed (CR-001: "the cars should have collision box all around them") | Lawrence's playtest of the three-level build | The dummy is pushed by cars; each car still pays for one impact only | Checks `dummy_cannot_walk_through_a_car`, `solid_cars_and_barriers_under_active_play` pass |
| 28 | Damage = closing speed x vehicle mass x face factor, with a mass per class | superseded by 32 (closing speed let the dummy's own lunge speed dominate); user-confirmed in kind (CR-001); **direction is the assistant's reading**: Lawrence wrote "inversely proportional", it is built as directly proportional | Matches the GDD ("impact value depends on class, speed and angle") | Replaces the Testpad's severity curve; if Lawrence meant inverse, the formula must flip | Check `damage_follows_momentum` passes: sedan 374 and van 475 for the same contact |
| 29 | Roads have lanes, a hard shoulder cars may swerve onto, and a barrier cars can never cross; cars avoid each other sideways too | user-confirmed (CR-001) for the road; applied to both road levels and not to the dummy by the assistant | Lawrence: cars "must also NOT go off the road" | A car that cannot swerve clear slows instead | Checks pass with the dummy standing at each road edge and wandering |
| 30 | Level 2 roads are one-way (left to right, top to bottom) | proposed (assistant, under the deadline); superseded by row 84 (10 October): two-way traffic on the right | Two-way roads plus solid cars froze the level head-on, twice | Less like a real junction; Lawrence did not ask for it | Check `levels_always_end_with_dummy_in_traffic` passes |

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

[DECISIONS#rows-91-100~2] Rows 91–100
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 91 | Drivers react in 0.3 s; each moving car shows a stop bracket | user-confirmed (P2.2): "show it. also shorter reaction time of 0.3 seconds" | Fairness at exhibition distance | Highway Code realism (0.67 s) traded away | P2.2; GDD Edit 37 registry table |
| 92 | Screen 640 × 360 art px; field 400 × 300 at (120, 30); `ui.artScale` 2 (was 3) | user-confirmed (20 October): "640 x 360 screen, 400 x 300 field" | Whole-number scaling to 720p, 1080p, 1440p and 4K | Finer grid than Edit 37's 267 × 200; every sprite redrawn | P3: at 1080p, 120,000 of 120,000 art pixels are clean 3 × 3 blocks |
| 93 | Essentials-only HUD. Type at registry sizes (`ui.typeLoadBearing`, `ui.typeSecondary`) | user-confirmed (20 October): "only show the essentials, and the fonts need to be scaled realistically" | Legibility at exhibition distance | Cuts slogan, notice band, FLEET panel, micro-type and barks | P3 README |
| 94 | Night and cyber palettes (Chongqing neon over dark ground) as load-time options | user-requested (20 October); built as options. Row 88 still stands | — | Cues invert to light on dark; the black outline vanishes (row 101) | Night contrast on road: `cue.primary` 14.9:1, `cue.warning` 4.5:1 |
| 95 | Cyber field: city blocks and jersey barriers replace lawns and trees | user-requested (20 October): "a cyberpunk landscape with buildings and barriers instead of trees" | — | Decorative at first: looked solid but was not (row 96) | Canvas board "Cyber" |
| 96 | Fix A: city blocks and jersey barriers are solid level statics in every palette (`proto.city` 1) | user-confirmed (20 October): "Fix A: make them real obstacles in the simulation." | Anything that looks solid must be solid | Adds cover and sensor shadows; quotas not rebalanced. Cover is 5.5–8.0% of the play area, below GDD 7.9's 0.10 floor | 8 city checks; flood-fill access; 10 min per road with no car overlap |
| 97 | The lunge is called DASH on screen. Registry IDs keep `movement.lunge*` | user-confirmed (20 October): "let's rename this as 'DASH'"; keeping the IDs is the assistant's proposal | — | Docs use both names until the registry renames | P3 HUD and controls |
| 98 | HUD v3. Top bar: road, WRITE-OFFS, POINTS, CARS LEFT. Left: BODY health first, DASH. Right: chassis doll | user-confirmed in outline (20 October): "Most important: Body Health… Top Bar: Level, Points, Cars left, or timer?" CARS LEFT as the clock and WRITE-OFFS in the bar are the assistant's choices | — | Credits leave the play HUD (report and shop only) | Canvas board "BodyHUD" |
| 99 | Locational damage. Each impact names a part from the hit's size and side; the doll shows dented, cracked and broken per part | user-confirmed in kind (20 October): "Maybe the Chassis should also show the damage based on where they are hit? Can be specific body part?" The height and side mapping is proposed | — | Health stays one pool | 2 part checks |
| 100 | Damaged parts cut abilities. Legs: ground speed. Torso: turn rate. Head: view cone. Arms: throw distance. Both arms broken: no pickup | user-confirmed (20 October): "location of where the dummy is hurt should also affect the mobility… reduce dummy performance with damage part. Let's implement this." Mapping and values are the assistant's proposal | Wear you can feel, not only see (O1.4) | A hurt dummy is harder to steer into its own write-off | 3 effect checks; legs lose 75 of 300 → speed 75% |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "barks",
 "lines": [
  {
   "id": "s04",
   "event": "writeoff",
   "when": {},
   "style": "speech",
   "priority": 3,
   "text": "Write-off confirmed. Closing ticket.",
   "claims": []
  }
 ]
}