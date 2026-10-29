SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences and 20 words (style.v2.text.*); aim for 15.
- Tile: Parkland C3 · The arch and the roundabout (ACT II · OPENING DAY; tile 3 of 9). Brief: COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy) Equipment issued here: none. Chunk: STORY#PC3.
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

[STORY#PC3] PC3 Parkland C3 · The arch and the roundabout
### PC3 Parkland C3 · The arch and the roundabout
- **Tile:** Parkland C3, 3 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The arch and the roundabout.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Two hits, the second before the first is forgotten.

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

[EDIT26#12.3] 12.3 Schedule
### 12.3 Schedule
**Blocking: the start date.** Four weeks from a date not yet fixed against the exhibition. Confirm before week 1.
| Week | Build | Ends with |
|---|---|---|
| **1** | Thin shell. The control greybox: turn, move, lunge, nothing else | **Control gate (5.2).** First-time players, five minutes. If the dummy reads as broken, tune `movement.turnRate` and `movement.turningSpeedFraction` before week 2 |
| **2** | The baseline on level 1: traffic, dimensions and pivot, detection and commitment cues, battery, damage, write-off, report card | One complete loop — bait, lunge, damage, write-off, report. **Extent gate:** traffic re-tuned and a witness at 800 × 600. **Cue contrast gate:** measured against the real palette, ahead of any art |
| **3** | Economy and all fifteen nodes. Purchase, replacement, transition. Cross junction to two-way. The roundabout built from scratch. All three endings | A full certification run across three levels. **First outside playtest** — pacing and the finite-traffic witness |
| **4** | Learning on two approaches, moods, the high-score table, boundary autosave and CONTINUE, clause 10 witnesses, art pass, audio, high-contrast mode, playtest fixes | The exhibition build |
**Two levels exist, one does not.** Road carries forward. Cross junction needs two-way traffic. The roundabout is new; its circulating-priority and exit-signal rules are a variant of the give-way logic built for Cross junction, which is the only reason it fits in the same week. If week 2 overruns, the roundabout is the first thing to lose — ship two levels rather than three unfinished ones.
**The shell grows with the build.** Week 1 ships the router, clock, pause, registry and recorder. Each later module joins the registry as it arrives.
**Gates, mapped.** Control feel — week 1. Extent and cue contrast — week 2. Pacing and the finite-traffic witness — week 3. These three points may change the plan; everything else is work that slips or is cut. Week 4 has no gate because there is no week 5 to respond to one.
**The playtest is in week 3.** It tests the loop without learning present. The loop is what most needs outside eyes, and week 4 has to be able to act on what it finds.

[EDIT26#10.3] 10.3 Run structure
### 10.3 Run structure
- At most `run.appearanceCeiling` vehicle appearances per run. A ceiling that bounds a pathological run, never a pacing target.
- Each shift schedules traffic and a quota of bodies to destroy.
- Every generated vehicle counts toward the budget, including those ignored.
- A level ends when its last vehicle and the collisions it causes have resolved.
- Endings may stop the sequence early.
**Three levels, in this order:** Road, Cross junction, Roundabout (7.2).
**Quotas and traffic** (Proposed; re-cut from the five-level plan). Quotas are 3, 5 and 6, summing to 14, with certification at 15 — one above the sum, so minimum performance never certifies. The run stays at fifteen write-offs and about twenty minutes.
| Level | Appearances | Sports | Hatchback | Sedan | Wagon | Van | Bus | Why |
|---|---:|---:|---:|---:|---:|---:|---:|---|
| 1 Road | 24 | 20% | 15% | 30% | 15% | 10% | 10% | Fast and sparse. The bus is the beginner's target |
| 2 Cross junction | 36 | 15% | 20% | 30% | 15% | 15% | 5% | Mixed streams; the hatchback's recommitment is the lesson |
| 3 Roundabout | 44 | 20% | 15% | 25% | 15% | 15% | 10% | Every class in continuous circulation. The exam |
104 appearances across a full run, at about seven per body — the ratio the vertical slice measured.
**Spawn schedule.** Appearances are released at a per-level interval tuned so traffic is continuous without queueing at entry (6.2, `traffic.entryRoomLengths`). Each appearance draws its class from the pool, its tier and model from the fleet roster (6.1), and its mood from the shares in 6.5 — all seeded, so a run replays identically.
**Parameters — run**
*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*
- `run.quota.road` = 3 bodies (The tutorial level in all but name; three bodies teaches the loop and funds a first purchase)
- `run.quota.junction` = 5 bodies (Committed routes are harder to read, but mixed streams give more openings)
- `run.quota.roundabout` = 6 bodies (Continuous traffic, so bodies come faster even though the level is hardest)
- `run.certification` = 15 bodies (One above the quota sum of 14, so minimum performance never certifies)
- `run.appearanceCeiling` = 1000 vehicles (A ceiling that bounds the run, never a pacing target)

CONTENT
{
 "kind": "tale",
 "district": "parkland",
 "tile": "C3",
 "title": "The arch and the roundabout",
 "tale": "The arch is the Expo's gate. Circle the roundabout faster than visitors, and chain each hit to the last."
}

EVALUATION
SCORE: 8/10
REASON:
- tale · T1 (major, −2) "Circle the roundabout faster than visitors, and chain each hit to the last." The tone is flat, as T1 requires, but the tale only gives orders: nothing ties the chain to Certification, to clients or to the Expo opening, so it does not motivate the trainee. [EDIT95#3.2, EDIT95#3.1, EDIT95#3.3] Fix: "The arch is the Expo's gate. Clients enter when the park passes; chain each hit to the last." (17 words, two sentences, duty unchanged, no equipment named).
Total: 10 − 2 = 8.