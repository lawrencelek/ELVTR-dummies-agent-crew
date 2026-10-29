SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences and 20 words (style.v2.text.*); aim for 15.
- Tile: Waterfront A1 · The west portal (ACT III · CUSTOMS; tile 1 of 9). Brief: A BUS. Coverage gap: the bus fleet. The final hit must come from a bus. Equipment issued here: none. Chunk: STORY#WA1.
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

[STORY#WA1] WA1 Waterfront A1 · The west portal
### WA1 Waterfront A1 · The west portal
- **Tile:** Waterfront A1, 1 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west portal.
- **Brief:** A BUS. Coverage gap: the bus fleet. The final hit must come from a bus.
- **Equipment issued here:** none.
- **Tale:** The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.

[EDIT93#3.1/tales-rewritten~1] Tales rewritten
### Tales rewritten
| Tile | Tale |
|---|---|
| Monument B1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; staff now use it to watch the road. Today you join the road. Dash into a colleague. Farsight will time you. |
| Monument C1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy. |
| Monument B3 | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens. |
| Monument C3 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next. |
| Parkland C1 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next. |
| Parkland C3 | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten. |
| Parkland A2 | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| Parkland B1 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest. |
| Parkland B2 | Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three. |
| Waterfront A1 | The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss. |
| Waterfront B2 | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you. |

[EDIT26#10.7] 10.7 Endings
### 10.7 Endings
**Licensed.** The final required write-off wins immediately; no later quota check runs. Certification releases the dummy from its testing contract, not a driving prohibition. A replacement dummy enters the bay; a car detects it and stops, with traffic queuing behind. FARSIGHT issues the licence: "Fleet certified. Operator licence issued. Subject is not cleared to operate a vehicle."
**Non-compliant.** After meeting quota in an earlier shift, complete a whole shift with no lunge and no contact. An authored bus-narrator message files this ending; it does not require a bus in current traffic.
**Decommissioned.** Miss a shift quota, or finish the contract without certification.
**Priority.** At shift end, resolve Licensed, then Non-compliant, then dismissal, then continuation. A terminal outcome opens no shop and admits no replacement body. Certification on the last car wins before any dismissal check. Meeting all three quotas without the extra certification write-off still produces Decommissioned at contract end.
*Built.* The slice has all three ending cards.

[DECISIONS#rows-201-210~2] Rows 201–210
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 201 | P4: the Turn Lab draws in game art by default (the game's ground and sprites). A road mock-up page shows 90° corners at radius 32–224 and five 45° junction ideas | user-directed (21 October): "keep the 96 bus, mockup the turn lab, the 90 degree radii, and 45 degree road junction idea." | Judge pieces as the player will see them | Junctions are mock-ups: the planner cannot place them yet | `prototypes/p4/turn_lab.html`, `road_mockup.html` |
| 202 | P4 junction give-way by rank: 0 major road, 1 left turn off it, 2 minor road. Yield line `traffic.minimumGap` before the first shared span; one per minor arm. Wait for `traffic.giveWayGap`, or for the clear time from a standstill plus `perception.reactionDelay`. Priority cars let in a car past its line | proposed (assistant, 21 October) | Junctions without collisions or jams | The minor road waits up to 43 s in heavy traffic | `junction_run.js`: 66 runs, no jam, no overlap |
| 203 | P4 junction turns: centre-line radius `world.junctionTurnRadius` 96 | proposed (assistant, 21 October) | The 96 bus stays within 3 of its lane (9 at radius 64) | Wider corners: inner kerb 40 instead of 8 | `prototypes/p4/docs/junction_results.md` |
| 204 | A 45° road joins another as a roundabout arm where a ring fits; else as a fork (no hairpin turns); a squared-off T (`world.junctionApproach` 192) where the screen wants a T. Not the 45° Y with 135° hairpins | proposed (assistant, 21 October), open for the user | Roundabouts cap waits near 10 s with every movement; the fork flows best (28–31 cars/min) | A ring needs the screen's centre; the fork drops two movements | `junction_run.js`; `road_mockup.html` |
| 205 | Jam test: a car at its yield line is giving way, not jammed; a car stopped to let one in follows that car's wait. Corrects Edit 49.1 (four arms, fillet 64: no jam) and 49.2 (bus 144 on the four-arm ring: fillet 128 swings 12, 160 flows) | proposed (assistant, 21 October): correction | The test flagged a car leaving its line after a long wait | — | Reruns: Turn Lab 1 of 330 verdicts changed; fleet 2 of 48 cells |
| 206 | The registry takes Edit 49.3: version `edit49.3-2026-10-21`. Adds `world.junctionTurnRadius`, `world.junctionApproach`, `world.roundaboutArmGap`; extends `traffic.giveWayGap` to junctions and fixes its validation (max 1 → 5) | proposed (assistant, 21 October) | Every new statistic has an ID | 3 entries marked `prototype-p4` | `content/params/tuning.parameters.json` (242 entries) |
| 207 | P5 prototype (`prototypes/p5`) takes P4's learnings: driver along the lane, spawn hold, jam reverse, give-way, least bend 64, roundabout fillets 96, 45° roads at `world.diagonalShare` 0.25. P3 and P4 stay as they are | user-directed (21 October): "The 45 degree roads and highways are great idea actually, let's implement all of these (put all the new learnings into p5 prototype)" | One build with every road and traffic finding | A third prototype to keep in step | `prototypes/p5/dummies_p5.html`; `node test_sim.js` 93/93 |
| 208 | P5 fleet: five models. Hatchback, sedan, police, van, bus (96 midi). Vans by district; then `traffic.share.hatchback` 0.22, `.police` 0.08, `.bus` 0.10; sedans the rest. Sports, wagon and SUV stay out | user-directed (21 October): "Do not put so many new vehicless in, maybe 5 car models (hatchback, sedan, police, van, bus (small)". The shares are the assistant's | Few enough models to learn | Police and hatchback canon traits not built | Fleet test: shares within 0.05 in every district |
| 209 | A bus runs a ground road only if every on-screen bend of its centre line keeps `vehicles.bus.minRadius` 160 (arc length over turn across four vertices, 10% tolerance), never round a ring; a bus slot elsewhere runs as a sedan. Highways always carry buses | user-directed (21 October): "Maybe we make it a rule that the buses only go with centre radius 160 roads, and on the elevated highways?". The measure and the substitution are the assistant's | The 96 bus stays in its lane (0 outside at 160; 10 at 64) | Buses on 54 of 135 screens; ground buses about 4% of ground cars | `prototypes/p5/docs/p5_report.md` |
| 210 | A bus only brakes; it never swerves (`vehicles.bus.swerve` 0). It hides the dummy from cars like a van | proposed (assistant, 21 October), from canon: "Only brakes; cannot swerve" | Reads as a bus: a slow wall that stops | A bus behind a standing dummy waits | Test: bus 0 lateral; sedan 56 |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "tale",
 "district": "waterfront",
 "tile": "A1",
 "title": "The west portal",
 "tale": "We need the bus fleet's data before Certified dummies ship across the river. Meet the bus; it will not miss."
}