SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences and 20 words (style.v2.text.*); aim for 15.
- Tile: Monument A3 · The stacked cubes (ACT I · INDUCTION; tile 7 of 9). Brief: COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy) Equipment issued here: none. Chunk: STORY#MA3.
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

[STORY#MA3] MA3 Monument A3 · The stacked cubes
### MA3 Monument A3 · The stacked cubes
- **Tile:** Monument A3, 7 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The stacked cubes.
- **Brief:** COMBO ×{n} ({n} = story.task.comboEasy). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboEasy)
- **Equipment issued here:** none.
- **Tale:** Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten.

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

[EDIT92#7] 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
## 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
```markdown
- **Rule:** cosmetic only. Pixels on sprites already placed; flat marks on the ground; props never solid.
  - No solid, floor, stair, spawn or cone home changes (checked on all 27 tiles).
- **Monument A1, the welcome wall:** the LED panel shows the dummy's face in the screen's cyan; WELCOME · NEW STAFF · FARSIGHT.
- **Monument A2, the neon shops:** two shopfronts per block, a lit sign over each (OPEN, SALE; 24H, NEW); neon glow on the pavement.
- **Monument A3, the stacked cubes:** each cube lit on its edges; the roof's front edge brightest.
- **Monument C3, the LED gateway:** two pylons with lit strips; a beam 21 art px deep with chevrons; THANK YOU · DRIVE SAFE along it; its shadow across the lanes.
- **Parkland C1, the lantern pavilion:** a white paper lantern, ribbed, on the pavilion's lawn.
- **Parkland B1, the cascade:** water spilling over each pool's lip; a grated runnel across the path to the next pool.
- **Waterfront A3, C3, the customs posts:** CUSTOMS, lit, on each pier tower's plinth.
- **Waterfront B3:** a container ship moored between the stilt houses: the ship of the finale.
- **Waterfront B2:** the DUMMY MONUMENT (Edit 91).
- **Not drawn:** Parkland's visitors, Chassis 0 (figures would read as targets or obstacles).
```

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

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "tale",
 "district": "monument",
 "tile": "A3",
 "title": "The stacked cubes",
 "tale": "Each cube rests on the one before. Chain your hits the same way; the last link writes you off."
}