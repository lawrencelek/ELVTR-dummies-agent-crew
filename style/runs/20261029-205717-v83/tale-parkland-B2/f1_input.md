SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences; 15 to 20 words (style.v2.tale.minWords, style.v2.tale.maxWords). The tile's content sets the length: short for one image, longer for a place with a history.
- Tile: Parkland B2 · The ring over the pools (ACT II · OPENING DAY; tile 9 of 9). Brief: COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard) Equipment issued here: Battery 2. Chunk: STORY#PB2.
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

[STORY#PB2] PB2 Parkland B2 · The ring over the pools
### PB2 Parkland B2 · The ring over the pools
- **Tile:** Parkland B2, 9 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The ring over the pools.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 2.
- **Tale:** Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.

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

[DECISIONS#rows-221-230~2] Rows 221–230
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 221 | Highway lamps in pairs, one per parapet, every `world.deckLampSpacing` 88 (about nine a side per screen width); pale pole, bright head, light pool. P3 and P4 keep 128 staggered | user-directed (22 October): "They should also have periodic highway lights, like about 8-10 per width of screen." Pairing and the art are the assistant's | The old lamps drew in near-black on the night deck | Busier parapets | `prototypes/p5/docs/p52_cbd_highway.png` |
| 222 | Highway columns drawn round in section: a lit cylinder on an elliptical base with a pier cap. Footprint unchanged (`world.deckColumn` 24) | user-directed (22 October): "Columns for the highways look too blocky, they should appear more circular in section." | Reads as a concrete pier | Collision stays square | `PIX.column` |
| 223 | A highway with no walkway (128: lanes and parapets) mocked up, not adopted | user question (22 October): "Or what if elevated highways don't have sidewalk?" Open | The dummy on a highway would always stand in a lane | — | `prototypes/p5/highway_mockup.html` |
| 224 | (Superseded by 247) Highways run square only (decision 152 stands). 45° angles stay on ground roads. The diagonal highway mock-up is retired | user-directed (22 October): "Fine don't really work at all we should only have different angles on the ground level roads." Closes 218 | One rule for highways | — | — |
| 225 | Five districts become three, each with its own core and mood: 1 Parkland, 2 Circus, 3 Monument (working names). Quotas `world.district.parkland/circus/monument.quota` 2, 3, 4 | user-directed (22 October): "let's go to three different cityscapes rather than five. But each has a different mood or core." Names and quotas are the assistant's | A shorter run with stronger places | Five district themes retire; a planner rebuild | `prototypes/p5/cityscape_mockup.html` |
| 226 | Parkland core (second ring superseded by 230): the Z1 highway (row 2) turns round a ring over a lake (B2, `world.deckRingRadius` 132); the Z2 highway (row 3) round a ring over lawns and a fountain plaza (B3, `world.deckRingRadiusHigh` 120). One way, anticlockwise; fillets 96 | user-directed core (22 October): "the centrepiece is a parkland with elevated highway height 1 and elevated highway height 2 as circular roundabouts passing over lakes and grass." Two screens is the assistant's: two rings cannot nest in 800 × 640 under `world.deckTopClear` | Both rings read, each over its own ground | Curved decks: new floors, stairs, drops | Mock-up: ring cars at 98–102 |
| 227 | Circus core: the four-arm roundabout of Edit 49.1 (give way at entry), a petal garden island with a fountain, zebra crossings, corner towers. The road network is a cross through the centre | user-directed core (22 October): "In the other, the centrepiece is a four-way roundabout." Details are the assistant's | Uses tested P4.1 rules | Branching roads in the planner | Edit 49.1 matrix: no jam at fillet 96 |
| 228 | Monument core (superseded by 233): five pedestrian streets meet at a plaza (`world.plazaRadius` 168, `world.plazaStreetWidth` 56); a clock-tower monument stands inside a Z1 walkway ring (`world.walkwayRingRadius` 112, `world.walkwayWidth` 28), bridged to the malls' upper floors. The road skirts the plaza | user-directed core (22 October): "In the third, the centerpiece is an interconnected monument (like the Liberation Monument in Chonqing)". The walkway ring as "interconnected" is the assistant's reading, open | Gives the plaza a Z1 route for the dummy | Walkway and bridge systems | Mock-up |
| 229 | Mock-up first: the three cores in game art; the P5 game keeps five districts until the cores are approved; P6 rebuilds the planner. Registry takes Edit 51 (`edit51-2026-10-22`, 9 IDs, `mock-up-p5`) and Edit 50.2 (`world.deckWidth`, `world.deckLampSpacing`, `world.deckColumn`) | proposed (assistant, 22 October) | Cheap to change before the planner work | A delay before the three districts play | Registry 260 entries |
| 230 | Parkland keeps one ring: the Z1 highway (row 2) turns round a ring over the lake at B2 (`world.deckRingRadius` 132). The Z2 ring retires (`world.deckRingRadiusHigh` retired). Park screens form a plus: B1, A2, B2, C2, B3 | user-directed (22 October): "Parkland - B2 - z1 roundabout over the lake." Closes 226's second ring | One curved deck to build, not two | No Z2 highway in Parkland | `prototypes/p5/docs/p53_districts.png` |

[DECISIONS#rows-231-240~2] Rows 231–240
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 231 | Circus core stands as decision 227. Its Z1 highway moves to row 3, clear of the roundabout and the cross | user-confirmed (22 October): "Circus - four-way roundabout - great." Highway row is the assistant's | — | — | Mock-up: give way at all four entries |
| 232 | Public sculptures replace trees in every district: LED obelisk, ring, cube stack, arch, light fins. Trees stay out of the cyber city | user-directed (22 October): "The trees don't look good in cyberpunk city, it can be architectural monument like elements (like public sculptures, etc)." The five forms are the assistant's | Reads as built city, lit in the style guide's cyan and magenta | Five new sprites | `PIX` sprites in `cityscape_view.js` |
| 233 | Monument core (ring size, link span and plaza revised by 238–239): only 90° and 45° angles. A square walkway ring at Z1 round the monument (`world.walkwayRingHalf` 150, sides 90°, corners cut 45° by `world.walkwayRingChamfer` 60, width `world.walkwayWidth` 28). Four 45° walkways (`world.walkwayLinkLength` 150) run from the cuts to corner podium roofs at Z1 (`world.deckHeight`). Each ends flush inside its roof. Towers stand on the podiums. Plaza lattice `world.plazaHalf` 190. The five radial streets retire | user-directed (22 October): "it should only have 90 degree and 45 degree angles. But I like the idea of building rooftops leading to the walkway level. The walkways terminate in weird semicircles currently." Layout from the user's sketch: square ring, four diagonals to the corners. Values are the assistant's | Closes 228's open reading: interconnected = roofs joined to the ring at one level | Podium roofs as walkable floors (Edit 44 platforms) | `prototypes/p5/docs/p53_monument_b2.png` |
| 234 | Each district mocked up as 3 × 3 screens with roads planned across the district, so every edge lines up. Ground roads turn at 90° or 45° on fillets of `world.roundaboutEntryRadius` 96. Highways run square along a row (decision 224) | user-directed (22 October): "Just mockup the three levels, with 3x3 tile layouts shown." Road plans are the assistant's | The three districts read whole before the planner work | Mock-up only: the P5 game keeps five districts | `prototypes/p5/cityscape_mockup.html`: no page errors, 60 fps, fits phone width |
| 235 | The registry takes Edit 51.1: version `edit51.1-2026-10-22`. Adds `world.walkwayRingHalf`, `world.walkwayRingChamfer`, `world.walkwayLinkLength`, `world.plazaHalf`. Retires `world.deckRingRadiusHigh`, `world.walkwayRingRadius`, `world.plazaRadius`, `world.plazaStreetWidth` | proposed (assistant, 22 October) | Every new statistic has an ID | — | Registry 264 entries |
| 236 | Parkland B2 (ring raised by 242): the ground road runs north–south (column B, top to bottom), under the Z1 ring and through its hole. The lake becomes two reflecting pools either side. The district's other roads run north–south too (columns A and C, each with one 45° jog) | user-directed (22 October): "Parkland - the horizontal road (at ground level) should go top-to-bottom." The rest of the plan and the pools are the assistant's | The road reads under the ring; three parallel avenues under one highway | No road along Parkland's rows | `prototypes/p5/docs/p54_parkland_b2.png` |
| 237 | Rule: every highway screen has `world.deckEscalators` (2) escalators, one on each side, at opposite ends: north at the west end, south at the east end, `world.deckEscalatorInset` (64) from the screen edge. Run `world.stairLength` per Z (64 to Z1, 112 to Z2). The parapet opens at each head. Blocks keep clear of the foot | user-directed (22 October): "There should be two escalator exits off the highway on each screen (on opposite sides, at different ends of the elevated highway)." Which end gets which side is the assistant's | Up and down from either side on every screen | The P5 planner places one stair per highway screen; it changes at the P6 rebuild | Mock-up: 24 escalators on 12 highway screens (the ring included); no foot in a lane |
| 238 | Monument B2: a road through the middle. It splits round the monument's island: one lane each way, `world.splitLaneOffset` (104) from the road centre, leaving and rejoining at 45° on fillets of 96, hatched gores. No buses (bends under 160). The district road joins at row 2 | user-directed (22 October): "For Monument - There needs to be a road somewhere in the middle." The split is the assistant's | Traffic passes under the walkway, so the walkway reads as raised | A one-way pair in the planner | `prototypes/p5/docs/p54_monument_b2.png` |
| 239 | Monument walkways read as raised: the square ring (`world.walkwayRingHalf` 168) bridges both carriageways; round columns (`world.walkwayColumn` 16) on pavements and the island, never in a lane; hard shadow; fascia with an LED strip. 45° walkways span `world.walkwayLinkLength` (100) to podium roofs at Z1. Escalators: two out to the plazas (opposite ends), two down to the island. Plazas north and south of the road; `world.plazaHalf` retired | user-directed (22 October): "The issue is that actually the paths are at street level, so cannot connect to rooftops. Make it more architecturally interesting." The reading (make the Z1 level legible) and the details are the assistant's | Street level and roof level are distinct; the roofs connect only at Z1 | Walkway columns and escalators in the planner | Mock-up |
| 240 | No flower beds anywhere (park planting extended by 243). Brutalist pieces instead: chamfered concrete planters with board marks, a lawn top and an LED strip under the coping; stepped tiers; concrete monoliths with a lit slot. Circus island: a stepped octagonal plinth, a lawn tier, a slab with a lit slot and a halo. Ponds become reflecting pools: 90° sides, 45° corners, concrete coping | user-directed (22 October): "The 'flower' trees are too decorative, how do we show that they are also brutalist cyberpunk monuments rather than 'nature'?" The forms are the assistant's | Green appears only as clipped lawn held in concrete | — | Mock-up |

CONTENT
{
 "kind": "tale",
 "district": "parkland",
 "tile": "B2",
 "title": "The ring over the pools",
 "tale": "The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring."
}

EVALUATION
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The board watches the ring over the pools, where the cars come round clean. Battery 2 is fitted, a second charge; chain your hits round the ring." The tale runs 27 words, which is over the 20-word cap for a tale (lint measurement). [EDIT98#3.2] Fix: cut the extra words: drop "the" before "cars", the gloss "a second charge" and the repeated "round the ring". The tale becomes "The board watches the ring over the pools, where cars come round clean. Battery 2 is fitted; chain your hits." (20 words).
Total: 10 − 4 = 6.