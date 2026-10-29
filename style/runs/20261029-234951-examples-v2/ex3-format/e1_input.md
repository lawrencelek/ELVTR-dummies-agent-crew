SLOT
- Kind: brief, `content/story/story.json` `tasks.<kind>`. Speaker: Dummy Corporation. Label on the tile card and the objective strip.
- Schema: {"kind": "brief", "task", "label", "brief"}
- Task kind: jump.
- Every text: at most 2 sentences. A tale: 15 to 20 words (GDD Edit 97); any other text: at most 20 (GDD Edit 95).

CANON

[EDIT98#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):** "Story mode - there is too much superfluous text in general."
  - A new introduction screen: DUMMIES, full screen, and Start. An animation: the dummy steps into the road in front of a car, front-on, in the upgrade screen's style. One line on what to do, quirky but obvious.
  - Mode select: STORY first. "Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation." ARCADE: "Get hit in fun, creative, and destructive ways before the Vehicles run out!"
  - Starting a level, in either mode: a screen that says very simply what the goal is.
  - "You are dropped off from the left side of a screen by a DRONE. (Same as for ARCADE mode when you start a new map)"
  - The level card: "ACT I: MONUMENT. Tile A1. Level 1 of 27. / Story text. 15-20 words. / Then goal text."
  - Monument A1: "Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud!" Goal, in bold: ">>> Walk into the path of the incoming vehicles. Time your approach, and choose your angle carefully. Bonus points for combinations and lethal hits!"
  - Starting Story: an animation like the upgrade screen, the dummy's parts flying.
- **Rulings (user, 29 October):**
  - Voice stays deadpan: no "!" (Edit 95). The user's lines are used without it.
  - The drone drops the dummy at each level start: a Story tile deployed from the map; an Arcade district.
- **Readings flagged:**
  - Tales: 15 to 20 words, two sentences. Edit 97's 35 is withdrawn.
  - The user's lines are canon as written: A1's tale, A1's goal, the STORY and ARCADE card lines. A1's goal runs 23 words in three sentences, past the 20-word cap.
  - "Vehicles" in the ARCADE line is set in lower case, as in A1's goal.
  - The user's sample intro line is a brief, not the text. n36 is written for humour and run through the loop.
  - Goals replace briefs on the card: imperative, what to do. The caps label stays for the map and the objective strip.
  - Act lines leave the level card. They stay on the story map.
  - The Story animation plays when a story starts: NEW GAME or CONTINUE, before the map.

[EDIT98#3.2] 3.2 Voice (amends Edit 97 §3.2)
## 3.2 Voice (amends Edit 97 §3.2)
```markdown
- **Tales:** 15 to 20 words (style.v2.tale.minWords, style.v2.tale.maxWords). At most two sentences.
- **Goals:** what to do, in the imperative, first. One or two short sentences. Placeholders kept.
- **User lines:** canon as written. The style loop never rewrites them.
- **No "!":** unchanged (Edit 95).
```

[EDIT97#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "Redraft the tales. They can be longer or shorter based on what is better. 15 to 35 words."
  - "Is there working high score system and leaderboard? High score button below the ARCADE or STORY mode."
  - "Lets look at the game loop for ARCADE. Does it make more sense to finish level with write offs? Or after X write offs, things get harder somehow?"
- **Rulings (user, 29 October):** high scores kept in this browser. The Arcade loop: §7.
- **Readings flagged:**
  - Tales: 15 to 35 words, at most two sentences. The tile's content sets the length.
  - Arcade: "after X write-offs" read as the district's quota (world.district.<id>.quota). No new X.
  - "Denser or faster": denser built; faster left open (D81).

[EDIT97#3.2] 3.2 Voice (amends Edit 96 §3.2)
## 3.2 Voice (amends Edit 96 §3.2)
```markdown
- **Tales:** 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords). At most two sentences.
  - Length follows content. One image: short. A place with a history: longer.
  - No padding. No restated brief. No restated act line.
- **Other company texts:** unchanged. At most 20 words (style.v2.text.maxWords).
```

[EDIT96#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "The tales can be slightly longer up to 35 words if needed."
  - "Rewrite unused CBD and campus districts too."
- **Readings flagged:**
  - Tales only. Act lines, briefs, the ending and notices keep 20 words.
  - A tale keeps the cap of two sentences (Edit 95 §3.2).
  - "If needed": the extra words go to the place. A tale may stay short.
  - CBD and Campus: their names, blurbs, intros, landmark and screen names. The rest of D80 (terminal signage, a fleet job, the glossary) stays open.

[EDIT96#3.2] 3.2 Voice (amends Edit 95 §3.2)
## 3.2 Voice (amends Edit 95 §3.2)
```markdown
- **Length:** every in-game text at most two sentences.
  - Tales: at most 35 words (style.v2.tale.maxWords). The extra words name the place.
  - Act lines, briefs, the ending, notices: at most 20 words (style.v2.text.maxWords). Aim for 15.
```

[EDIT95#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "The game itself is published by Farsight. (Extra-diegetic). Farsight is NOT mentioned inside the game. Only in Credits."
  - "Within the game, the company is only known as Dummy Corporation. Manufacturers of custom dummies for high net-worth individuals."
  - "The tone is deadpan and inspirational, concise sentences, fewer adjectives. All text reports and in-game texts should be concise, and even the longest explanations should have maximum two sentences, or 15-20 words max."
  - "The environmental storytelling is there to inspire the Dummy to do their job, and fulfil their training, so that they can in future join the ranks of Certified dummies and to be sacrificed in service to the high net-worth individuals."
  - Tone reference: *Play Station* (Lawrence Lek, 2017), `style/kb/DUMMIES_Play_Station_Script_2017.md`.
- **Rulings (user, 29 October):** the publisher credit sits on a Credits card, on the title menu and after the CERTIFIED ending. Prototype 8 lives in the working repository only.
- **Readings flagged:**
  - "15-20 words max" is read as a cap of 20 words, with 15 as the aim. "Maximum two sentences" holds as well.
  - "Deadpan" keeps Edit 92's rule: no exclamation marks in the company's voice. The 2017 script's "!" is not adopted.
  - The cars keep their tier voices (Edit 39 §6.6). Their barks fall under the same caps: at most two sentences.
  - Gameplay, briefs' tasks, parts, write-offs and traffic are unchanged. Only text changes.

[EDIT95#3.1] 3.1 World and lore (replaces Edit 39 §3.1 and the fleet canon's company)
## 3.1 World and lore (replaces Edit 39 §3.1 and the fleet canon's company)
```markdown
- **Publisher:** Farsight. Extra-diegetic. Named only in the Credits.
- **The company in the game:** Dummy Corporation. It manufactures custom dummies for high net-worth individuals.
- **The setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE (§1). The city's traffic is the training ground.
- **The dummy:** a trainee. It does its job and completes its training, to join the Certified dummies.
- **Certified dummies:** they serve high net-worth individuals, and are sacrificed in their service.
- **Environmental storytelling:** everything the city shows the dummy inspires it to do its job.
- **Lore follows state** (6.6.1), unchanged.
```

[EDIT95#3.2] 3.2 Voice (replaces Edit 92 §3, Voice)
## 3.2 Voice (replaces Edit 92 §3, Voice)
```markdown
- **Narrator:** Dummy Corporation. Tales, briefs, act lines, notices, the ending.
- **Tone:** deadpan and inspirational. Concise sentences. Few adjectives. No exclamation marks.
- **Length:** every in-game text at most two sentences and at most 20 words. Aim for 15.
- **Reference:** Play Station (2017): slogans, programme names, perks, fine print.
- **Cars:** workers in their tier's voice (Edit 39 §6.6). At most two sentences.
```

[EDIT95#3.3] 3.3 Story (Narrative A, Certified, kept; frames restated)
## 3.3 Story (Narrative A, Certified, kept; frames restated)
```markdown
- **Act I · Monument · INDUCTION:** the trainee arrives. The cars are colleagues.
- **Act II · Parkland · OPENING DAY:** the Expo opens to clients when the park passes.
- **Act III · Waterfront · CUSTOMS:** Certified dummies ship to their clients across the river.
- **Ending:** CERTIFIED. The model is manufactured for clients.
- **Credits:** DUMMIES · a game by Lawrence Lek · published by Farsight.
```

[EDIT95#4.2] 4.2 UI (amends)
## 4.2 UI (amends)
| Was (P7.13) | Prototype 8 |
|---|---|
| FARSIGHT (frame wordmark) | DUMMY CORPORATION |
| FARSIGHT BRIEF | TRAINING BRIEF |
| FARSIGHT DRONE | CORPORATION DRONE |
| FARSIGHT GIFT | CORPORATION GIFT |
| NEXT FROM FARSIGHT | NEXT FROM THE CORPORATION |
| A Farsight drone brings this part. | A Corporation drone brings this part. |
| Monument A1 sign: WELCOME · NEW STAFF · FARSIGHT | WELCOME · NEW STAFF · DUMMY CORP |
| No credits | CREDITS: on the title menu, and after the CERTIFIED ending |
| Tile card: the brief, then "One counted write-off clears the tile." (three sentences) | The brief (two sentences), then a label: TO CLEAR · 1 COUNTED WRITE-OFF |
| Arcade banner: "District 2 of 3: Waterfront. [the district's design note] Write-offs required: 3." (30 words) | A label, DISTRICT 2 OF 3 · WATERFRONT · 3 WRITE-OFFS, then the district's line (n24–n26) |
| Title: "You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you." | "You are a Dummy Corporation trainee. Every write-off brings Certification closer." |
| Arcade ending Licensed: "Contract complete. FARSIGHT thanks you for your cooperation." | "Training complete. The Corporation thanks you for your service." |
- **Credits card:** CREDITS, then DUMMIES · A game by Lawrence Lek · Published by Farsight. A, Space, a tap or Back closes it.
- **Notices:** 26, by ID (n01–n26), in `prototypes/p8/lore.js`. Each keeps its placeholders, capitals and width.

[PLAY#PS0] PS0 How DUMMIES uses it
## PS0 How DUMMIES uses it
- **Tone reference only.** Corporate slogans, programme names, mission statements, perks, then fine print and a sponsor line.
- **Not adopted:** its exclamation marks and its cheer. DUMMIES is deadpan (Edit 95).
- **Not adopted:** its company. The 2017 piece names Farsight Corporation. In DUMMIES, Farsight is the publisher, named only in the Credits; the company in the game is Dummy Corporation (Edit 95).

[PLAY#PS2] PS2 Mission (lines 4–8)
## PS2 Mission (lines 4–8)
4. Help us build Earth's most customer-centric company.
5. We're a company of pioneers.
6. It's our job to make bold bets, and we get our energy from inventing on behalf of customers.
7. Success is measured against the possible, not the probable.
8. For today's pioneers, that's exactly why there's no place on Earth they'd rather build than Farsight.

[PLAY#PS5] PS5 Fine print and sign-off (lines 21–26)
## PS5 Fine print and sign-off (lines 21–26)
21. Play Station™. Funemployment, Forever.
22. Minimum Wage Terms and Conditions apply.
23. Not suitable for the antisocial, easily disoriented, or the recently bereaved.
24. Players, Workers, PlayWorkers™!
25. Welcome to Play Station™. A new life awaits.
26. Sponsored by Farsight - Aligning advanced AI with human interests.

[STORY#S1] S1 Story rules
## S1 Story rules
- Numbers live in the registry: tasks and gifts name parameter IDs, never values.
- A task tests the hit that writes the chassis off (the fatal hit).
- Tile names are column-row, as in the game: A1 is the top-left tile.
- Each tile's write-offs are story.writeOffs.<district>.<tile> in the registry (Edit 82).
- Edit 93: introduce, then test. A part arrives on the tile whose brief first needs it; no brief needs a part not yet issued. Monument: Battery 1 B1 (dash), Hands 1 A2 (cone), Legs 1 B3 (jump). Parkland: Arms 1 C1 (push), Legs 2 A3 (jump), Hands 2 A2 (cone), Arms 2 A1 (push), Battery 2 B2 (combo). Waterfront: Legs 3 B1 (jump), Arms 3 B3 (push), Battery 3 B2 (combo).
- Edit 92: Narrative A, Certified. Act I Monument (Induction), Act II Parkland (Opening Day), Act III Waterfront (Customs). Farsight narrates: polite, procedural, dry; no exclamation marks. The cars are colleagues; the briefs are duties; the parts are equipment.
- A gift rides in on the drone that carries the dummy into its tile (Edit 84). Arcade sells every part for credits; its chassis ships with Battery 1 (Edit 91).
- Each tile's traffic is story.traffic.<district>.<tile> in the registry, on the tile and its neighbours (Edit 85).

[STORY#S2] S2 Acts
## S2 Acts
| District | Act | Act line (intro) | Order |
|---|---|---|---|
| Monument | ACT I · INDUCTION | Off the factory floor. Farsight greets you as new staff; the cars are your colleagues. | A1 → B1 → C1 → C2 → B2 → A2 → A3 → B3 → C3 |
| Parkland | ACT II · OPENING DAY | The Expo opens to the public when this park passes. Nine tiles, nine days. Visitors are booked. | C1 → C2 → C3 → B3 → A3 → A2 → A1 → B1 → B2 |
| Waterfront | ACT III · CUSTOMS | The river is a border; ships wait beyond it. Your papers are being prepared. | A1 → B1 → C1 → C2 → C3 → B3 → A3 → A2 → B2 |

[STORY#S3] S3 Briefs
## S3 Briefs
A brief is a caps label, then "Coverage gap: …. The final hit must ….". Figures are placeholders bound to registry IDs ({n}).
| Kind | Label | Brief |
|---|---|---|
| any | ANY WRITE-OFF | General coverage. Any write-off in this tile counts. |
| dash | DASH INTO A CAR | Coverage gap: dashes. The final hit must be a dash into a car. |
| drop | DROP ONTO A CAR | Coverage gap: falls. The final hit must be a drop onto a car from above. |
| jump | JUMP INTO A CAR | Coverage gap: jumps. The final hit must be a jump into a car. |
| level | ON A RAISED ROAD | Coverage gap: raised roads. The final hit must land at Z1 or above. |
| cone | CONE-BAITED CAR | Coverage gap: cones. The final hit must come from a car reacting to a cone. |
| push | PUSH OFF A CAR | Coverage gap: ricochets. Push off one car; the final hit must be the next car. |
| bounce | THROWN INTO A CAR | Coverage gap: rebounds. The final hit must come while a hit is still throwing you. |
| struck | STRUCK, NOT DASHING | Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand. |
| combo | COMBO ×{n} | Coverage gap: chains. The final hit must be link {n} or later of a combo. |
| cls | A {cls} | Coverage gap: the {clsLong}. The final hit must come from a {cls}. |

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

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |
| 548 | The lore refinement. Inside the game the company is Dummy Corporation: it manufactures custom dummies for high net-worth individuals. Farsight publishes the game (extra-diegetic) and is named only in the Credits. The dummy is a trainee; it trains to join the Certified dummies, sacrificed in service to the clients. The city's environmental storytelling inspires it to do its job | user-decided (29 October): "Farsight is NOT mentioned inside the game. Only in Credits. Within the game, the company is only known as Dummy Corporation." | The publisher stays outside the fiction | Prototypes 7 to 7.13 keep Farsight (frozen). Rows 539 and 541 hold for them only | GDD Edit 95 §3.1 |
| 549 | The company's voice: deadpan and inspirational, concise sentences, few adjectives, no "!". Every in-game text at most two sentences and 20 words (`style.v2.text.maxSentences` 2, `style.v2.text.maxWords` 20; aim `style.v2.text.targetWords` 15). The cars keep their tier voices, at most two sentences. Tone reference: *Play Station* (2017) | user-decided (29 October): "deadpan and inspirational … maximum two sentences, or 15-20 words max"; read as a cap of 20 with 15 the aim (assistant, flagged); the 2017 script's "!" not adopted (Edit 92's rule kept) | One length for every text | Tales lose detail: 7.13's longest ran 223 characters | GDD Edit 95 §0, §3.2; `style/style.params.json` |
| 550 | The Credits card: CREDITS on the title menu, and first on the CERTIFIED ending's menu. DUMMIES · A game by Lawrence Lek · Published by Farsight | user-decided (29 October): "Credits card" | The one place Farsight is named | Not over the voyage (D77 stays open) | GDD Edit 95 §3.3, §4.2 |

[DECISIONS#rows-61-70~2] Rows 61–70
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 61 | Branch 2, Torso: Waist (turn faster) unlocks Spine (change direction mid-lunge) and Core strength (a missed lunge becomes a roll, so you recover at once) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | Turning is the dummy's first freedom | Spine breaks the GDD's "no steering mid-lunge" rule and can follow a car's swerve. Proposed: limit the steer. | — |
| 62 | Branch 3, Battery or Heart (name open): Extra cell (a short second lunge straight after the first) unlocks Kinetic chain (a hit worth more than 100 points recharges the battery) and Nitro (recharges twice as fast, but you jitter and can't stand still) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Kinetic chain and Nitro only matter if the base recharge is made slower: today the lunge is ready again 0.25 s after it lands | Recharge 0.55 s from lunge start, lunge 0.3 s (`output/spec.json`) |
| 63 | Branch 4, Arms: swinging your arms makes you run faster; it unlocks Hold on (move onto a car's side, hold on and ride it, then lunge off onto the next car) and a second upgrade not yet chosen | user-confirmed except the second upgrade (9 October; not built); superseded by row 76 (9 October) | — | Hold on needs a rule for "one impact per car" | — |
| 64 | Branch 4, Arms (completes row 63): the core upgrade is Shoulder socket (swing your arms and run faster); the second upgrade is Carry (carry light obstacles and drop them) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Cars must learn about dropped obstacles, or a dropped cone is free bait forever (skill-tree review) | — |
| 65 | Branch 5, Legs: Spring start (full speed from the first step) unlocks Jump (during a lunge, press again to jump over low barriers and obstacles) and Kick (kick objects into a car's path) | user-confirmed (9 October; not built); superseded by row 76 (9 October) | — | Spring start conflicts with row 52 ("starts off running"): if the dummy already runs from the start, Spring start does nothing. Open: keep today's walk-to-run ramp as the limitation, or redefine Spring start. Jump is now the only way over barriers, because no upgrade climbs. | Build: walk 81 px/s ramps to run 162 px/s over 1.0 s (`rampTime` in `output/spec.json`) |
| 66 | Two buttons, like Nintendo A and B | user-confirmed (9 October; not built) | Extra cell (press again for a second lunge) and Jump (press during a lunge) need separate inputs | Replaces GDD section 1's single button; the exhibition setup needs two buttons. Proposed mapping: A = lunge (press again for Extra cell; lunge off a car you are holding on to). B = jump during a lunge, kick when running into a light object, pick up or drop when standing next to one. | GDD Edit 10, section 11.5 |
| 67 | Keep today's one-second walk-to-run build-up; the Spring start upgrade removes it | user-confirmed (9 October) | Gives Spring start a purpose | Replaces row 52's running start; slow turning still stands | Built: `rampTime` 1.0 s in `output/spec.json` |
| 68 | Everyone sees the commit chevron and brake lights; the Sensors upgrade adds the cars' detection zones | user-confirmed (9 October: "Sensors, ok"); what else Sensors shows is open | Keeps pillar 4 for players without the upgrade | Players without Sensors cannot see a car's zone before it notices them | — |
| 69 | Spine: a lunge can change direction by up to 45° | user-confirmed (9 October; not built) | Limits chasing a car's swerve | — | — |
| 70 | A is always the legs (lunge, then lunge and jump); B is always action, the arms | user-confirmed (9 October); the detailed mapping is proposed (GDD Edit 10, section 11.5) | A body logic a player can learn: legs on one button, arms on the other | Jump and Extra cell both use A again. Proposed split by timing: during the lunge is a jump, just after landing is the second lunge. Replaces row 66's proposed mapping. | — |

[DECISIONS#rows-421-430~2] Rows 421–430
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 421 | Dash jump and flight: B during a dash takes off at the dash's speed, capped (162 covered) and holds its line; a normal jump steers toward the stick at `upgrades.jumpAirAccel` (324 u/s²); landing keeps the speed; no dash or jump for `upgrades.jumpRecovery` (0.1 s) | proposed (assistant), after the Pegasus Boots long jump | A long jump for vans and deep planters; momentum carries combos | — | Run jump bends 28; dash jump 0; lands at 162 |
| 422 | Stair heads re-enter their flight only on a move back down the flight. Fixes the freeze when a dash ran past a head onto a narrow walkway (Monument B2; since 6.3) | user report (S25 Ultra): "I got stuck on walkway when dashing"; diagnosis and fix (assistant) | — | — | Monument B2, Parkland A1 and C1 stair-head checks |
| 423 | Jump test (`prototypes/jump`): a Phaser yard with moving traffic, parked cars broadside and end-on, barriers 8–64 deep, a ruler, and a side view of every flight. Shares `jump.js` with P6.6, `core.js` and `pads.js` with the control test | user-directed: "on a smaller test prototype how jump will work with number of scenarios e.g. moving vehicles, distance, how far it will clear" | Tune the jump apart from the game | — | `test_jump.js` 20/20 |
| 424 | Run to clear (`proto.jump.runToClear`): a standing or walking jump hops and clears nothing (cars, barriers, rails, cones meet it as on the ground); only a running jump or a dash jump clears | user-decided (27 October): "you can walk and jump but you don't clear anything. to clear something you must run and jump" | Speed is the skill | A hop at a walkway rail holds | Rail 1 deep: hop held, rule off clears; Parkland C1: hop holds, run drops |
| 425 | Diagonal jumps: a crossing off square is longer, (depth + 2r) ÷ cos θ over a long rail, the shorter of that and (length + 2r) ÷ sin θ over a short thing. A running jump clears a handrail to 55°, a sedan broadside to 32°; a dash jump clears a van and a 48 planter at 45°. Over moving cars the relative speed decides: into the car's path clears sooner, with the traffic is struck | user question: "what about diagonal jump?"; analysis and yard (assistant) | Angles become a skill: jump square, or into traffic | — | `test_jump.js`: 7/7 firm cases at 45°; moving sedan into ✓, with ✗ |
| 426 | Ability tracks (`proto.abilities`): four, one per button. Battery (A): dash recharge × `abilities.battery.rechargeStep` (0.8) per level. Legs (B): level 1 jumps. Arms (X): level 1 grabs. Throw (Y): level 1 throws, needs Arms 1. `abilities.maxLevel` 3; prices `economy.price.ability.level1`–`level3` 1, 2, 3; levels in order | user-decided: "simplify the skill tree to abilities … Battery - faster lunge recharge; Legs - jump ability; Arms - pickup; Throw - throw cones"; levels, prices, button map proposed (assistant) | One track per verb and button | Pace by price (D52) | Shop bought by keys; prices and order checked |
| 427 | Wear shields: each level cuts its body part's wear on its ability by `abilities.wearCut` (0.25; level 3 −75%). Battery shields the torso (recharge, turn); Legs the legs (run, dash, jump); Arms the grip; Throw the throw. Head (view) unshielded | user-decided: "the more you upgrade, the less the abilities degrade when you get damaged"; mapping proposed (assistant) | Upgrades keep a worn body useful | — | Dash at 40% leg damage 45% → 85%; grip held from Arms 1; throw 55% → 85% |
| 428 | Torso damage slows the battery's recharge: rate × (1 − `proto.parts.torsoRechargeLoss` 1.5 × torso share × shield), floor `proto.parts.torsoRechargeFloor` 0.5. Closes D46 | proposed (assistant): the torso had no cost under DIRECT; the battery sits in it | Every part's damage costs something | — | 30% torso: 1.47 s a charge; Battery 3: 0.47 s |
| 429 | Hips, Spine, Big battery and Ricochet leave the shop from P6.7 (P6.5–6.6 keep them). Closes D48 and D49. Combo stays | user-directed (simplify to four abilities) | Ten fewer registry IDs in play | Long bounces for combos go (D49) | Old nodes not sold; owning `ricochet` changes nothing |
| 430 | Four levels per ability track (`abilities.maxLevel` 4), each one linear step. Legs: airtime `abilities.legs.airtimeBase` 0.3 + `abilities.legs.airtimeStep` 0.1 per level (0.3–0.6 s), height fixed at `upgrades.jumpHeight`. Arms: `abilities.arms.conesPerLevel` 1 per level (1–4 cones). Throw: `upgrades.throwDistance` + `abilities.throw.distanceStep` 40 per level (120–240) | user-decided: "0.3 to 0.4 to 0.5 to 0.6 seconds"; "carry 1, 2, 3 or 4 cones"; "throw adds distance … linearly"; fixed height and the throw step proposed (assistant) | Every level does something you can see | Legs 4 adds no new clear (D55) | Legs 1–4: 49, 65, 81, 97; Arms 1, 2, 4 hold 1, 2, 4; Throw 140 → 260 |

[STORY#MB3] MB3 Monument B3 · The LED canyon
### MB3 Monument B3 · The LED canyon
- **Tile:** Monument B3, 8 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED canyon.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 1.
- **Tale:** Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens.

LINT (style/lint.py)
- brief · F5 (major, −2) "1. 2. 3 3. 2.5 4. 30": typed figure; numbers live in the registry. [STORY#S1]
- brief · F6 (blocking, −4) "1. Walk to the edge of the road and wait for a car.
2. Jump …": 50 words > 20 (style.v2.text.maxWords); 4 sentences > 2 (style.v2.text.maxSentences). [EDIT95#3.2]
- label · F8 (major, −2) "How to complete the jump test": label must be caps, ≤ 19 characters (style.brief.labelMaxChars); 29. [STORY#S3]

CONTENT
{
 "kind": "brief",
 "task": "jump",
 "label": "How to complete the jump test",
 "brief": "1. Walk to the edge of the road and wait for a car.\n2. Jump into the car's path 3 times; the final hit must be a jump.\n3. Keep your speed at 2.5 m/s each time you jump.\n4. Finish all of it within 30 seconds, then await Certification."
}