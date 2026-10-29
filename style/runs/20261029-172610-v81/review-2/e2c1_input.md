SLOT
- Kind: a batch of the company's texts: the story's (Prototype 8's `content/story/story_v2.json`) and, where listed, notices (`prototypes/p8/lore.js`). Speaker: Dummy Corporation. Each item is one text: a tale, an act line, the ending or a notice.
- Schema: {"kind": "batch", "items": [{"id", "kind", "district", "tile", "text"}]}. Change only each item's "text"; change only the items the REASON names.
- The batch is judged as a whole as well: T14 (no slogan in more than two texts) and V10 (the purpose stated plainly at least once).
- n01: notice. Where: title screen, under DUMMIES. At most 110 characters.
- n02: notice. Where: Arcade's district screen, under DUMMIES. At most 120 characters.
- n03: notice. Where: the title's STORY card. At most 100 characters.
- n24: notice. Where: Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does. At most 110 characters.
- n25: notice. Where: Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does. At most 110 characters.
- n26: notice. Where: Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does. At most 110 characters.
- act-monument: act line, Monument, ACT I · INDUCTION.
- MA1: tale. Monument A1 · The welcome wall (ACT I · INDUCTION; tile 1 of 9). Brief: ANY WRITE-OFF. General coverage. Any write-off in this tile counts. Equipment issued here: none. Chunk: STORY#MA1.
- MB1: tale. Monument B1 · The podium bridge (ACT I · INDUCTION; tile 2 of 9). Brief: DASH INTO A CAR. Coverage gap: dashes. The final hit must be a dash into a car. Equipment issued here: Battery 1. Chunk: STORY#MB1.
- MC1: tale. Monument C1 · The LED drum (ACT I · INDUCTION; tile 3 of 9). Brief: DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above. Equipment issued here: none. Chunk: STORY#MC1.
- MC2: tale. Monument C2 · The portal tower (ACT I · INDUCTION; tile 4 of 9). Brief: ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above. Equipment issued here: none. Chunk: STORY#MC2.
- MB2: tale. Monument B2 · The monument (ACT I · INDUCTION; tile 5 of 9). Brief: STRUCK, NOT DASHING. Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand. Equipment issued here: none. Chunk: STORY#MB2.
- MA2: tale. Monument A2 · The neon shops (ACT I · INDUCTION; tile 6 of 9). Brief: CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone. Equipment issued here: Hands 1. Chunk: STORY#MA2.
- MA3: tale. Monument A3 · The stacked cubes (ACT I · INDUCTION; tile 7 of 9). Brief: COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy) Equipment issued here: none. Chunk: STORY#MA3.
- MB3: tale. Monument B3 · The LED canyon (ACT I · INDUCTION; tile 8 of 9). Brief: JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car. Equipment issued here: Legs 1. Chunk: STORY#MB3.
- MC3: tale. Monument C3 · The LED gateway (ACT I · INDUCTION; tile 9 of 9). Brief: THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you. Equipment issued here: none. Chunk: STORY#MC3.
- act-parkland: act line, Parkland, ACT II · OPENING DAY.
- PC1: tale. Parkland C1 · The lantern pavilion (ACT II · OPENING DAY; tile 1 of 9). Brief: PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car. Equipment issued here: Arms 1. Chunk: STORY#PC1.
- PC2: tale. Parkland C2 · The amphitheatre (ACT II · OPENING DAY; tile 2 of 9). Brief: A VAN. Coverage gap: the van fleet. The final hit must come from a van. Equipment issued here: none. Chunk: STORY#PC2.
- PC3: tale. Parkland C3 · The arch and the roundabout (ACT II · OPENING DAY; tile 3 of 9). Brief: COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy) Equipment issued here: none. Chunk: STORY#PC3.
- PB3: tale. Parkland B3 · The obelisk court (ACT II · OPENING DAY; tile 4 of 9). Brief: A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car. Equipment issued here: none. Chunk: STORY#PB3.
- PA3: tale. Parkland A3 · The belvedere (ACT II · OPENING DAY; tile 5 of 9). Brief: JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car. Equipment issued here: Legs 2. Chunk: STORY#PA3.
- PA2: tale. Parkland A2 · The dome by the canal (ACT II · OPENING DAY; tile 6 of 9). Brief: CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone. Equipment issued here: Hands 2. Chunk: STORY#PA2.
- PA1: tale. Parkland A1 · The reservoir terraces (ACT II · OPENING DAY; tile 7 of 9). Brief: PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car. Equipment issued here: Arms 2. Chunk: STORY#PA1.
- PB1: tale. Parkland B1 · The cascade (ACT II · OPENING DAY; tile 8 of 9). Brief: ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above. Equipment issued here: none. Chunk: STORY#PB1.
- PB2: tale. Parkland B2 · The ring over the pools (ACT II · OPENING DAY; tile 9 of 9). Brief: COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard) Equipment issued here: Battery 2. Chunk: STORY#PB2.
- act-waterfront: act line, Waterfront, ACT III · CUSTOMS.
- WA1: tale. Waterfront A1 · The west portal (ACT III · CUSTOMS; tile 1 of 9). Brief: A BUS. Coverage gap: the bus fleet. The final hit must come from a bus. Equipment issued here: none. Chunk: STORY#WA1.
- WB1: tale. Waterfront B1 · The tunnel portal (ACT III · CUSTOMS; tile 2 of 9). Brief: JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car. Equipment issued here: Legs 3. Chunk: STORY#WB1.
- WC1: tale. Waterfront C1 · The east portal (ACT III · CUSTOMS; tile 3 of 9). Brief: A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car. Equipment issued here: none. Chunk: STORY#WC1.
- WC2: tale. Waterfront C2 · The east beach terrace (ACT III · CUSTOMS; tile 4 of 9). Brief: DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above. Equipment issued here: none. Chunk: STORY#WC2.
- WC3: tale. Waterfront C3 · The east customs post (ACT III · CUSTOMS; tile 5 of 9). Brief: THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you. Equipment issued here: none. Chunk: STORY#WC3.
- WB3: tale. Waterfront B3 · The stilt houses (ACT III · CUSTOMS; tile 6 of 9). Brief: PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car. Equipment issued here: Arms 3. Chunk: STORY#WB3.
- WA3: tale. Waterfront A3 · The west customs post (ACT III · CUSTOMS; tile 7 of 9). Brief: ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above. Equipment issued here: none. Chunk: STORY#WA3.
- WA2: tale. Waterfront A2 · The west beach terrace (ACT III · CUSTOMS; tile 8 of 9). Brief: CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone. Equipment issued here: none. Chunk: STORY#WA2.
- WB2: tale. Waterfront B2 · The circus (ACT III · CUSTOMS; tile 9 of 9). Brief: COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard) Equipment issued here: Battery 3. Chunk: STORY#WB2.
- ending: the ending, the CERTIFIED screen.
- Every text: at most 2 sentences. A tale: at most 35 words (GDD Edit 96); any other text: at most 20 (GDD Edit 95).

CANON

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

[STORY#MA1] MA1 Monument A1 · The welcome wall
### MA1 Monument A1 · The welcome wall
- **Tile:** Monument A1, 1 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The welcome wall.
- **Brief:** ANY WRITE-OFF. General coverage. Any write-off in this tile counts.
- **Equipment issued here:** none.
- **Tale:** A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you.

[STORY#MB1] MB1 Monument B1 · The podium bridge
### MB1 Monument B1 · The podium bridge
- **Tile:** Monument B1, 2 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The podium bridge.
- **Brief:** DASH INTO A CAR. Coverage gap: dashes. The final hit must be a dash into a car.
- **Equipment issued here:** Battery 1.
- **Tale:** Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; staff now use it to watch the road. Today you join the road. Dash into a colleague. Farsight will time you.

[STORY#MC1] MC1 Monument C1 · The LED drum
### MC1 Monument C1 · The LED drum
- **Tile:** Monument C1, 3 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED drum.
- **Brief:** DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above.
- **Equipment issued here:** none.
- **Tale:** The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today one will be. The high road breaks its rail over the street below. Step off it onto a car. Gravity is company policy.

[STORY#MC2] MC2 Monument C2 · The portal tower
### MC2 Monument C2 · The portal tower
- **Tile:** Monument C2, 4 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The portal tower.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job.

[STORY#MB2] MB2 Monument B2 · The monument
### MB2 Monument B2 · The monument
- **Tile:** Monument B2, 5 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The monument.
- **Brief:** STRUCK, NOT DASHING. Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand.
- **Equipment issued here:** none.
- **Tale:** The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data.

[STORY#MA2] MA2 Monument A2 · The neon shops
### MA2 Monument A2 · The neon shops
- **Tile:** Monument A2, 6 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The neon shops.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** Hands 1.
- **Tale:** The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this.

[STORY#MA3] MA3 Monument A3 · The stacked cubes
### MA3 Monument A3 · The stacked cubes
- **Tile:** Monument A3, 7 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The stacked cubes.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten.

[STORY#MB3] MB3 Monument B3 · The LED canyon
### MB3 Monument B3 · The LED canyon
- **Tile:** Monument B3, 8 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED canyon.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 1.
- **Tale:** Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Legs 1 is fitted. Jump into a car between the screens.

[STORY#MC3] MC3 Monument C3 · The LED gateway
### MC3 Monument C3 · The LED gateway
- **Tile:** Monument C3, 9 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The LED gateway.
- **Brief:** THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you.
- **Equipment issued here:** none.
- **Tale:** The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Let one colleague throw you into the next.

[STORY#PC1] PC1 Parkland C1 · The lantern pavilion
### PC1 Parkland C1 · The lantern pavilion
- **Tile:** Parkland C1, 1 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The lantern pavilion.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 1.
- **Tale:** The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next.

[STORY#PC2] PC2 Parkland C2 · The amphitheatre
### PC2 Parkland C2 · The amphitheatre
- **Tile:** Parkland C2, 2 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The amphitheatre.
- **Brief:** A VAN. Coverage gap: the van fleet. The final hit must come from a van.
- **Equipment issued here:** none.
- **Tale:** Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you.

[STORY#PC3] PC3 Parkland C3 · The arch and the roundabout
### PC3 Parkland C3 · The arch and the roundabout
- **Tile:** Parkland C3, 3 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The arch and the roundabout.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten.

[STORY#PB3] PB3 Parkland B3 · The obelisk court
### PB3 Parkland B3 · The obelisk court
- **Tile:** Parkland B3, 4 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The obelisk court.
- **Brief:** A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car.
- **Equipment issued here:** none.
- **Tale:** The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first.

[STORY#PA3] PA3 Parkland A3 · The belvedere
### PA3 Parkland A3 · The belvedere
- **Tile:** Parkland A3, 5 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The belvedere.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 2.
- **Tale:** A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does.

[STORY#PA2] PA2 Parkland A2 · The dome by the canal
### PA2 Parkland A2 · The dome by the canal
- **Tile:** Parkland A2, 6 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The dome by the canal.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** Hands 2.
- **Tale:** The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops.

[STORY#PA1] PA1 Parkland A1 · The reservoir terraces
### PA1 Parkland A1 · The reservoir terraces
- **Tile:** Parkland A1, 7 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The reservoir terraces.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 2.
- **Tale:** The gardener keeps the three pools level by hand. She has asked that the cars learn to stop before the water. Arms 2 is fitted: a stronger push. Teach them by hitting one car into the next.

[STORY#PB1] PB1 Parkland B1 · The cascade
### PB1 Parkland B1 · The cascade
- **Tile:** Parkland B1, 8 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The cascade.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. The traffic got louder. Go up to the highway and test it where it is loudest.

[STORY#PB2] PB2 Parkland B2 · The ring over the pools
### PB2 Parkland B2 · The ring over the pools
- **Tile:** Parkland B2, 9 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The ring over the pools.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 2.
- **Tale:** Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.

[STORY#WA1] WA1 Waterfront A1 · The west portal
### WA1 Waterfront A1 · The west portal
- **Tile:** Waterfront A1, 1 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west portal.
- **Brief:** A BUS. Coverage gap: the bus fleet. The final hit must come from a bus.
- **Equipment issued here:** none.
- **Tale:** The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.

[STORY#WB1] WB1 Waterfront B1 · The tunnel portal
### WB1 Waterfront B1 · The tunnel portal
- **Tile:** Waterfront B1, 2 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The tunnel portal.
- **Brief:** JUMP INTO A CAR. Coverage gap: jumps. The final hit must be a jump into a car.
- **Equipment issued here:** Legs 3.
- **Tale:** The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs 3 is fitted: the longest flight. Where your data goes after the tunnel is not within your role.

[STORY#WC1] WC1 Waterfront C1 · The east portal
### WC1 Waterfront C1 · The east portal
- **Tile:** Waterfront C1, 3 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east portal.
- **Brief:** A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car.
- **Equipment issued here:** none.
- **Tale:** The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared.

[STORY#WC2] WC2 Waterfront C2 · The east beach terrace
### WC2 Waterfront C2 · The east beach terrace
- **Tile:** Waterfront C2, 4 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east beach terrace.
- **Brief:** DROP ONTO A CAR. Coverage gap: falls. The final hit must be a drop onto a car from above.
- **Equipment issued here:** none.
- **Tale:** The terrace was built for tourists, then joggers, then sensors. From its rail you can see the ships in the estuary and the cranes that load them. Drop onto a car below. The ships will wait.

[STORY#WC3] WC3 Waterfront C3 · The east customs post
### WC3 Waterfront C3 · The east customs post
- **Tile:** Waterfront C3, 5 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east customs post.
- **Brief:** THROWN INTO A CAR. Coverage gap: rebounds. The final hit must come while a hit is still throwing you.
- **Equipment issued here:** none.
- **Tale:** The pier tower is a customs post. It logs everything that floats on the river: containers, ducks and, so far, one dummy, inbound. Be thrown into a car. Customs is watching.

[STORY#WB3] WB3 Waterfront B3 · The stilt houses
### WB3 Waterfront B3 · The stilt houses
- **Tile:** Waterfront B3, 6 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The stilt houses.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 3.
- **Tale:** The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come.

[STORY#WA3] WA3 Waterfront A3 · The west customs post
### WA3 Waterfront A3 · The west customs post
- **Tile:** Waterfront A3, 7 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west customs post.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road.

[STORY#WA2] WA2 Waterfront A2 · The west beach terrace
### WA2 Waterfront A2 · The west beach terrace
- **Tile:** Waterfront A2, 8 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west beach terrace.
- **Brief:** CONE-BAITED CAR. Coverage gap: cones. The final hit must come from a car reacting to a cone.
- **Equipment issued here:** none.
- **Tale:** The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. The ceremony is being prepared in the circus. Place a cone. Farsight would like one more clean reading before the speeches.

[STORY#WB2] WB2 Waterfront B2 · The circus
### WB2 Waterfront B2 · The circus
- **Tile:** Waterfront B2, 9 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The circus.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 3.
- **Tale:** Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

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

[EDIT93#3.1] 3.1 The 27 tiles (amends Edit 92 §3.1)
## 3.1 The 27 tiles (amends Edit 92 §3.1)
| # | Tile | Title | Brief 7.11 → 7.12 | Part 7.11 → 7.12 | Write-offs |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | 1 |
| 2 | Monument B1 | The podium bridge | Drop → **Dash** | Battery 1 | 1 |
| 3 | Monument C1 | The LED drum | Jump → **Drop** | Legs 1 → **—** | 1 |
| 4 | Monument C2 | The portal tower | Raised road | — | 1 |
| 5 | Monument B2 | The monument | Struck | — | 1 |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | 1 |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | 1 |
| 8 | Monument B3 | The LED canyon | Jump | — → **Legs 1** | 1 |
| 9 | Monument C3 | The LED gateway | Push → **Thrown** | Arms 1 → **—** | 2 → **1** |
| 10 | Parkland C1 | The lantern pavilion | Drop → **Push** | Battery 2 → **Arms 1** | 1 |
| 11 | Parkland C2 | The amphitheatre | Van | — | 2 |
| 12 | Parkland C3 | The arch and the roundabout | Thrown → **Combo ×2** | — | 1 |
| 13 | Parkland B3 | The obelisk court | Police | — | 1 |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | 1 |
| 15 | Parkland A2 | The dome by the canal | Raised road → **Cone** | — → **Hands 2** | 2 |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | 1 |
| 17 | Parkland B1 | The cascade | Cone → **Raised road** | Hands 2 → **—** | 1 |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — → **Battery 2** | 2 |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 → **—** | 1 |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | 2 |
| 21 | Waterfront C1 | The east portal | Police | — | 1 |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | 2 |
| 23 | Waterfront C3 | The east customs post | Thrown | — | 1 |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | 1 |
| 25 | Waterfront A3 | The west customs post | Raised road | — | 2 |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | 1 |
| 27 | Waterfront B2 | The circus | Combo ×3 | — → **Battery 3** | 2 |
- **Write-offs** (`story.writeOffs.<district>.<tile>`): Monument 9, Parkland 12, Waterfront 13. 34 bodies (7.11: 35).
- **Act I's other briefs** test what the body already does: drop, raised road, struck, combo ×2, thrown.
- **Parkland B1** (D70): its street is empty 67% of the time. A raised road replaces the cone. The highway always carries cars.

[EDIT92#3] 3 Story: Narrative A, Certified (replaces the proposal)
## 3 Story: Narrative A, Certified (replaces the proposal)
```markdown
- **Logline:** a dummy sits the longest job interview in the world. Passing means being shipped.
- **Tone:** dry corporate comedy. Farsight narrates. You are the product under test.
- **Voice:** polite, procedural, dry. No exclamation marks. Cars are colleagues; briefs are duties; parts are equipment.
- **Act I · Monument · INDUCTION:** off the factory floor; Farsight greets you as new staff.
  - Turn (C3): the gateway thanks a car for driving safely, seconds after it wrote you off. ROLE: DESTRUCTIVE TESTING.
- **Act II · Parkland · OPENING DAY:** the Expo opens when the park passes. Nine tiles, nine days. Visitors are booked.
  - Turn (B2): the board applauds the cars. "The public prefers the product to the test."
- **Act III · Waterfront · CUSTOMS:** the river is a border; ships wait beyond it.
  - The customs log (A3): ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION.
  - The circus (B2): the monument, cast from every chassis you lost. ZERO ACCIDENTS (EXCLUDING TESTS).
- **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
```

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "batch",
 "items": [
  {
   "id": "n01",
   "kind": "notice",
   "where": "title screen, under DUMMIES",
   "maxChars": 110,
   "text": "You are a Dummy Corporation trainee. Every write-off brings Certification closer."
  },
  {
   "id": "n02",
   "kind": "notice",
   "where": "Arcade's district screen, under DUMMIES",
   "maxChars": 120,
   "text": "Welcome, trainee. Every write-off brings Certification closer."
  },
  {
   "id": "n03",
   "kind": "notice",
   "where": "the title's STORY card",
   "maxChars": 100,
   "text": "Shenzhen Smart City, tile by tile. Each tile trains you to its brief."
  },
  {
   "id": "n24",
   "kind": "notice",
   "where": "Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "maxChars": 110,
   "text": "Neon shops, LED walls; one road splits round the monument under the walkway ring. Your training begins here."
  },
  {
   "id": "n25",
   "kind": "notice",
   "where": "Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "maxChars": 110,
   "text": "Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients."
  },
  {
   "id": "n26",
   "kind": "notice",
   "where": "Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "maxChars": 110,
   "text": "A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients."
  },
  {
   "id": "act-monument",
   "kind": "act",
   "district": "monument",
   "text": "Dummy Corporation welcomes you off the factory floor. The cars are your colleagues; Certification is your goal."
  },
  {
   "id": "MA1",
   "kind": "tale",
   "district": "monument",
   "tile": "A1",
   "text": "A conveyor sets you down at the welcome wall, where a screen shows your face and the word WELCOME. Your first duty toward Certification: stand in the road until a colleague notices you."
  },
  {
   "id": "MB1",
   "kind": "tale",
   "district": "monument",
   "tile": "B1",
   "text": "Battery 1 is fitted, for the dash. Shoppers never came to the podium bridge; staff now watch from it as you dash into a colleague, toward Certification."
  },
  {
   "id": "MC1",
   "kind": "tale",
   "district": "monument",
   "tile": "C1",
   "text": "The LED drum lights each bend so no colleague is surprised. Where the high road breaks its rail over the street, step off onto a car below: gravity is company policy."
  },
  {
   "id": "MC2",
   "kind": "tale",
   "district": "monument",
   "tile": "C2",
   "text": "The raised road passes through the portal tower, above its tenants. Your write-off belongs on that road, at height; Certification does not include the view."
  },
  {
   "id": "MB2",
   "kind": "tale",
   "district": "monument",
   "tile": "B2",
   "text": "The monument's plaque reads ZERO ACCIDENTS, a target rather than a record. Stand or walk beside it and let a colleague find you; dashing would spoil the data."
  },
  {
   "id": "MA2",
   "kind": "tale",
   "district": "monument",
   "tile": "A2",
   "text": "The neon shops under the highway sell nothing, yet the traffic reads every sign. Hands 1 is fitted: place a cone, and let a colleague who reads it write you off."
  },
  {
   "id": "MA3",
   "kind": "tale",
   "district": "monument",
   "tile": "A3",
   "text": "Each stacked cube was added as the budget arrived, one on the last; we call this growth. Your duty grows the same way: one hit, then another before the first is forgotten."
  },
  {
   "id": "MB3",
   "kind": "tale",
   "district": "monument",
   "tile": "B3",
   "text": "Legs 1 is fitted. In the LED canyon, two screens advertise across the road all night; jump into a car between them, for our clients."
  },
  {
   "id": "MC3",
   "kind": "tale",
   "district": "monument",
   "tile": "C3",
   "text": "The LED gateway thanks every car for driving safely, even the one that wrote you off. Your file reads ROLE: DESTRUCTIVE TESTING; let one colleague throw you into the next."
  },
  {
   "id": "act-parkland",
   "kind": "act",
   "district": "parkland",
   "text": "The Expo opens to clients when this park passes. Your training keeps them safe."
  },
  {
   "id": "PC1",
   "kind": "tale",
   "district": "parkland",
   "tile": "C1",
   "text": "The paper lantern, the Expo's first exhibit, is lit again for our clients. Arms 1 is fitted: under the footbridge, push off one car into the next, and the Expo opens safer."
  },
  {
   "id": "PC2",
   "kind": "tale",
   "district": "parkland",
   "tile": "C2",
   "text": "Our board will watch from these terraces on opening day, and every crossing of the avenue is a performance. A van delivers the catering; arrange for it to deliver you."
  },
  {
   "id": "PC3",
   "kind": "tale",
   "district": "parkland",
   "tile": "C3",
   "text": "The arch is the Expo's gate; visitors will circle the roundabout once before they enter. Go round faster, and chain your hits before the first is forgotten."
  },
  {
   "id": "PB3",
   "kind": "tale",
   "district": "parkland",
   "tile": "B3",
   "text": "The obelisk marks the surveyors' first stake; on opening day the police fleet escorts a school party here. Your final hit must come from a police car: the escort is tested on you first."
  },
  {
   "id": "PA3",
   "kind": "tale",
   "district": "parkland",
   "tile": "A3",
   "text": "A wedding is booked on the belvedere for opening day, facing the traffic. Legs 2 is fitted: jump into a car here, so that no guest ever does."
  },
  {
   "id": "PA2",
   "kind": "tale",
   "district": "parkland",
   "tile": "A2",
   "text": "The dome by the canal is the Expo's showroom, readied for our clients. Hands 2 is fitted: lay a cone, and let the car that answers it write you off."
  },
  {
   "id": "PA1",
   "kind": "tale",
   "district": "parkland",
   "tile": "A1",
   "text": "At the reservoir terraces, the gardener tends three pools by hand; she asks that cars stop before the water. Arms 2 is fitted; teach them with a ricochet, one car to the next."
  },
  {
   "id": "PB1",
   "kind": "tale",
   "district": "parkland",
   "tile": "B1",
   "text": "The cascade steps the reservoir's water down beside the highway, pool by pool, to drown out the traffic. Go up to the highway and take your write-off where the traffic is loudest."
  },
  {
   "id": "PB2",
   "kind": "tale",
   "district": "parkland",
   "tile": "B2",
   "text": "Battery 2 is fitted: a second charge. The board watches the ring over the pools; carry the chain your brief asks for, and the Expo opens to clients."
  },
  {
   "id": "act-waterfront",
   "kind": "act",
   "district": "waterfront",
   "text": "Certified dummies ship across the river, to be sacrificed in service to our clients. Your papers are being prepared."
  },
  {
   "id": "WA1",
   "kind": "tale",
   "district": "waterfront",
   "tile": "A1",
   "text": "Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; stand in its path."
  },
  {
   "id": "WB1",
   "kind": "tale",
   "district": "waterfront",
   "tile": "B1",
   "text": "Legs 3 is fitted for the longest flight. At the tunnel portal, cars go in under the hill and data comes back; jump into one, and your data serves our clients."
  },
  {
   "id": "WC1",
   "kind": "tale",
   "district": "waterfront",
   "tile": "C1",
   "text": "The east bridge was built to correct the west; its portal block faces the other way. The police here check papers, and a police car's final hit moves yours forward."
  },
  {
   "id": "WC2",
   "kind": "tale",
   "district": "waterfront",
   "tile": "C2",
   "text": "From the rail of the east beach terrace, you can see the ships that carry Certified dummies to clients. Drop onto a car below; the ships will wait."
  },
  {
   "id": "WC3",
   "kind": "tale",
   "district": "waterfront",
   "tile": "C3",
   "text": "The east pier tower is a customs post; it logs every Certified dummy that crosses the river to our clients. Be thrown into a car while a hit still throws you, and earn your entry."
  },
  {
   "id": "WB3",
   "kind": "tale",
   "district": "waterfront",
   "tile": "B3",
   "text": "Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come."
  },
  {
   "id": "WA3",
   "kind": "tale",
   "district": "waterfront",
   "tile": "A3",
   "text": "At the west customs post, the log lists every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road."
  },
  {
   "id": "WA2",
   "kind": "tale",
   "district": "waterfront",
   "tile": "A2",
   "text": "The west beach terrace was laid with sand from three provinces, for clients you will one day serve. Place a cone and meet the car that reacts to it; every write-off here serves them."
  },
  {
   "id": "WB2",
   "kind": "tale",
   "district": "waterfront",
   "tile": "B2",
   "text": "Battery 3 is fitted: complete the chain your brief sets, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS)."
  },
  {
   "id": "ending",
   "kind": "ending",
   "text": "Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship."
  }
 ]
}