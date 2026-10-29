SLOT
- Kind: credits, Prototype 8's Credits card (title menu; after the CERTIFIED ending). Extra-diegetic: Farsight, the publisher, is named here and only here.
- Schema: {"kind": "credits", "lines": ["…"]}
- Every text: at most 2 sentences and 20 words (GDD Edit 95).

CANON

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

[EDIT26#1] 1 The Game
## 1 The Game
**DUMMIES is a single-player, top-down 2D game about a crash-test dummy that earns upgrades to move like a human, at the cost of destroying itself.**
- **The player.** Fifteen, at an exhibition, standing, friend shouting over their shoulder. Five minutes, no tutorial. Every decision here is tested under those conditions.
- **The premise.** You are a FARSIGHT crash-test dummy in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX. You buy your freedom by destroying your body.
- **The loop.** Observe self-driving cars. Bait and outsmart them. Lunge into their path. Damage earns points. Every destroyed body earns one credit. Credits buy upgrades that return the human body one part at a time — joints to move with, senses to read the road with.
- **The goal.** Destroyed bodies fill quotas and advance certification toward release.
- **The session.** 5 to 20 minutes. A brief control prompt, no tutorial, no network play.

[DECISIONS#rows-11-20~2] Rows 11–20
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 11 | Simplified greybox damage: base + speed term, times a lunge multiplier | proposed | Enough to make hits, score and destruction work | GDD damage depends on class, speed and angle (head-on, diagonal, glancing), with overkill and write-off bonuses; none of that is here | Labelled as a simplification in the generated spec |
| 12 | Work in actions of three minutes or less, one at a time | user-confirmed | Long task lists and setup detours derail the work | Slower hand-offs for multi-step setup | — |
| 13 | Submit a GitHub repository link through Google Classroom; teacher needs access | user-confirmed | Course requirement | Private repository needs the teacher's GitHub username | Repository made public by Lawrence so the teacher needs no invitation; pushed to `main` |
| 14 | Use a Claude Project and Claude Code for this assignment | user-confirmed | Keeps the GDD, decisions and code together | — | This repository was built in a Claude Code session |
| 15 | Defer Pixel Agents, the style-guide website, finished art and audio | user-confirmed | Protect the deadline | Submission is visually plain | — |
| 16 | Rebuild as a full vertical slice on top of the Testpad, since the Testpad already has level progression | user-confirmed | The Testpad is far ahead of the from-scratch greybox in systems and feel | The crew now ports and patches an existing prototype instead of generating a game; the first version is archived | `baseline/dummies-testpad.html`; first version kept in `archive/` |
| 17 | Three levels, in this order: left-to-right road without stopping; cross junction with no traffic lights where cars do not collide; free-for-all crash test centre | user-confirmed; the third level (crash test centre) is replaced by the four-level plan of row 83 (10 October) | Builds the problem up in steps | Three of the GDD's five environments; the GDD lists the crash lab first | Checks `level1_road_flows_left_to_right`, `level2_cross_no_collisions`, `level3_free_for_all` pass |
| 18 | Use the Testpad's scale for hall, roads, vehicles and dummy | user-confirmed | "This is a better scale" | Supersedes the greybox's larger road and car | All sizes copied from the Testpad config |
| 19 | Diagonal movement problem: fixed in the Testpad; only present in the first greybox pass | user-confirmed (Lawrence's observation) | — | — | Measured equal distance straight and diagonal in the Testpad, the greybox and the new build; closed as MR-02 |
| 20 | Lunge eases out; after it, a 0.35 s recovery in which movement speed eases back from zero, with no freeze | proposed (the assistant's reading of MR-01; implemented) | Lawrence: the pause is "not a bad idea, but movement should be tweened" | Not yet confirmed by Lawrence at the keyboard | Checks `lunge_eases_out` and `recovery_is_tweened` pass |

[DECISIONS#rows-51-60~2] Rows 51–60
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 51 | Work continues directly on `main` | proposed (assistant) | Lawrence merged the last branch and asked for it deleted; this session cannot delete branches on GitHub | No separate branch to review before it lands | — |
| 52 | The dummy starts off running, but turns slowly; a lunge goes where it faces | user-confirmed (design, 8 October 2026; not built). Running start superseded by row 67 (9 October); slow turning stands | A crash-test dummy has fewer degrees of freedom than a person; turning early to aim is itself a read | A stiffer first minute at an exhibition | `DUMMIES_DEGREES_OF_FREEDOM.md` in the project |
| 53 | Upgrades restore degrees of freedom by body part; none ever adds health, armour or repair | user-confirmed (design; not built): "You are not buying freedom. You are buying degrees of freedom."; the jump part is superseded by row 86 (10 October): Jump does not clear barriers, so barriers always stop the dummy and the gaps are the way through | Gives the player a progression of their own against the cars' learning | A large feature; to be built in stages | Same note |
| 54 | Barriers stop the dummy until it can jump or climb | user-confirmed (design; not built) | Gives jump and climb a purpose from the first road level | Road levels need pedestrian gaps in the barriers | Same note |
| 55 | Jump is a flat, Zelda-style hop: over holes and low obstacles, never over a car | user-confirmed (design; not built) | Keeps every guarantee about cars intact; pseudo-3D heights later | Less spectacular for now | Same note |
| 56 | Falling into a hole resets the dummy to safe ground | user-confirmed (design; not built) | — | Costs only time | Same note |
| 57 | Terrain changes movement (fast on tarmac, slower on grass, and so on) | user-confirmed in principle (design; not built); the starting list and numbers are proposed | Gives levels texture and gives Feet a purpose | A terrain layer is needed in every level | Same note: 16 terrain types |
| 58 | Upgrade tree in the style of Polytopia's tech tree: five core parts, each unlocking two upgrades, 15 in all | user-confirmed (design, 8–9 October 2026; not built) | One screen shows everything you can't have yet; 15 is small enough to balance | Fewer upgrades than the 25-node draft | Polytopia screenshot from Lawrence; `DUMMIES_SKILL_TREE_REVIEW.md` recommended 12–15 |
| 59 | Upgrades must read from above: position, facing, outline, movement, or markings on the ground and on cars | user-confirmed (8 October): "Remember this is a top down game!" | Faces and height cannot be seen in a top-down view | Rules out face-based ideas (painted face, phone, nod) | `DUMMIES_UPGRADE_IDEAS.md` |
| 60 | Branch 1, Sensors: the core upgrade reveals the cars' detection zones, which are hidden by default. It unlocks Eyes (see dents on cars that have marked you) and Ears (a pulse at the screen edge where a vehicle will appear). Cone head is cut. | user-confirmed (9 October; not built); superseded by row 76 (9 October) | Reading the cars becomes something you earn | Players without it cannot see the detection zones that pillar 4 and GDD section 4 rely on. Proposed: everyone still sees the commit chevron and brake lights. | The build draws the zones by default (`showPerception = true` in `index.html`), and the commit chevron is drawn inside the same overlay |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "credits",
 "lines": [
  "DUMMIES",
  "A game by Lawrence Lek",
  "Published by Farsight"
 ]
}