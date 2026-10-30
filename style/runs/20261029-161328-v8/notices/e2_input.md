SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n01 · title screen, under DUMMIES · at most 110 characters
- n02 · Arcade's district screen, under DUMMIES · at most 120 characters
- n03 · the title's STORY card · at most 100 characters
- n04 · the tile card's header · at most 18 characters
- n05 · the story map's side panel · at most 40 characters · keep {LABEL}
- n06 · the objective strip's label while a drone flies · at most 18 characters
- n07 · a toast · at most 44 characters · keep {PART}
- n08 · a toast · at most 54 characters · keep {PART}, {TILE}
- n09 · a toast · at most 46 characters · keep {TILE}
- n10 · the gift screen, before the part lands · at most 28 characters
- n11 · a toast · at most 32 characters · keep {N}
- n12 · the gift screen, the next part · at most 26 characters
- n13 · the workshop, a part not yet issued · at most 44 characters
- n14 · the workshop's note, a part not yet issued · at most 56 characters
- n15 · a toast, a part not yet issued · at most 44 characters
- n16 · the Controls list, a verb not yet issued · at most 34 characters
- n17 · a toast, the chassis in the river · at most 56 characters
- n18 · a toast, a cone in the way · at most 64 characters
- n19 · a toast, the chassis recovered · at most 56 characters
- n20 · Arcade's ending, LICENSED · at most 80 characters
- n21 · Arcade's ending, FAILED TEST · at most 70 characters
- n22 · the frame's wordmark, title and menus · at most 20 characters
- n23 · Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage) · at most 10 characters
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

[EDIT93#measured] Measured
## Measured
| Check | Result |
|---|---|
| A1 cleared on foot | the report: 0 / 11 parts; next Battery 1 at Monument B1 |
| The A1 → B1 drone | brings Battery 1; health 500 → 800; B1's card: DASH INTO A CAR |
| Struck standing in B1, 30 health | held at 1; lost 29; no write-off |
| A dash into a parked sedan in B1 | B1 cleared; next Hands 1 at Monument A2 |
| The B1 → C1 drone | no part; C1's card: DROP ONTO A CAR |
| Resumed at Monument C3, 8 cleared | Legs 1 and Hands 1 on the body; no Arms; THROWN INTO A CAR |
| Parkland C1 | the drone brings Arms 1; PUSH OFF A CAR |
| Waterfront B2 | the drone brings Battery 3; certified with 11 parts |
| A reload after B1 | 2 / 27 TILES · 1 / 11 PARTS |
| Every brief where set | possible: its class, raised traffic, a raised floor over traffic, cones |

[PLAY#PS1] PS1 Opening (lines 1–3)
## PS1 Opening (lines 1–3)
1. Play Station™ (Chinese title omitted). Funemployment, Forever.
2. Farsight Corporation welcomes you to Play Station™, our new range of automated workplaces!
3. Enjoy the 9 to 5 life of leisure as never before.

[DECISIONS#rows-471-480~2] Rows 471–480
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 471 | Car barks are speech bubbles on the cars again (frame layer, legible). The bottom line carries the objective (story: tile, count, last hit wanted; Arcade: the quota); a toast takes it while it lives. The brief leaves the district panel | user-decided: "speech bubbles on the cars themselves"; "The current story or mission objective should be on the bottom line" | Funnier; the goal always in view | Supersedes Edit 70's strip for barks | Objective: "Write off a body (0 of 1)" |
| 472 | Option B: verbs are issued, levels are bought. Legs 1, Hands 1, Arms 1 are the only gifts, in both modes; the shop never sells them ("GIFT AT A2"; Arcade "DRONE GIFT"). Supersedes row 465's placements | user-decided (28 October): "I agree with B" | Zelda's pacing: a verb opens the next briefs; credits buy depth | A player cannot rush a verb with credits | The fill unchanged: Waterfront B2, body 34 of 35 |
| 473 | Monument issues a verb every three tiles: Legs 1 at C1, Hands 1 at A2, Arms 1 at C3. Briefs reordered: B2 struck, A2 cone, B3 jump, C3 push, so each verb is used on the tile that issues it | user-decided: "Legs 1 at C1, then at least 2 or 3 more tiles (so A2)"; Arms 1 at C3 and the reorder proposed (assistant) | Link's Awakening: one key item a dungeon, each opening the next area | Parkland and Waterfront issue nothing | Every brief's verb issued at or before its tile |
| 474 | Arcade issues the same verbs, in the same order, one per `arcade.giftEvery` (1) write-offs, by drone to the next chassis after the shop, with the same gift screen. The bottom line names the next verb | user-decided: "ARCADE and STORY need the same kind of mechanic"; interval proposed (assistant) | One progression rule in both modes | Short quotas end before every verb (D69) | Monument Arcade: Legs 1, Hands 1, Arms 1 after write-offs 1–3 |
| 475 | The gift ceremony: the drone carries the module in view and lowers it onto the dummy; the world holds on the gift screen: the chassis large, a drone brings the module over the head, it falls onto its part (`ui.gift.fallSeconds` 0.7), lands with a flash, ring, sparks, rays, shake and an original fanfare; then the verb, its button, what it does and the next level in the shop. A after `ui.gift.holdSeconds` 1.2; then the drone carries the dummy across | user-decided: "you SEE the item the drone carries … a large screen pops up showing the image of the dummy's body with an animation of the new item arriving … a satisfying SOUND and ANIMATION"; timings, layout and fanfare proposed (assistant) | Juice on the beats that matter: three in a story | 1.2 s held per verb | B1 → C1: screen at 2.5 s; A at 0.1 s ignored |
| 476 | Story traffic per tile: `story.traffic.<district>.<tile>` scales density on the tile in test and its four neighbours; the rest at 1. Cars still enter the view only across its edges. Arcade keeps one density per district | user-directed (28 October): "have traffic spawning per tile … we can keep the arcade mode different (per-map rather than per tile)"; neighbours and the in-view rule proposed (assistant) | Each tile tuned for its roads and brief; the first tiles busier | 27 more values to tune | Monument A1 2.7 → 3.9 street cars in view; B1 2.2 → 3.8 |
| 477 | A neighbour with a roundabout runs at the district rate under a tile scale (Parkland B2, C3; Waterfront B2). Out of view, a car stopped `traffic.offscreenCullSeconds` is removed (Edit 63) | proposed (assistant), answering "what if cars get trapped in the roundabout from tiles that can't be seen?" | No ring fills out of sight; no jam survives there | Parkland B1 gains little: its cars come through B2 (D70) | 27 tiles × 2 min: longest stop in view 11 s; 27 culls in 54 min (9 unscaled) |
| 478 | Every highway has a flight (`world.deckFlightsMin` 1; Waterfront's bridges one each, from the beach) and a parapet gap over each Z0 road beneath (`world.deckDropGaps`): one `world.tileSize` module on the road's centre line, south or east (the other side at a flight), drawn lit. Both modes; 6.x unchanged | user-decided: "if there is a highway in a tile, there should be at least one staircase and one gap in the railing to drop to cars"; placement and drawing proposed (assistant) | Every highway is a route and a drop | Parkland B1 has no road beneath (D70) | 15 of 15 with a flight; 14 of 15 with a gap; 17 drops land on a road |
| 479 | Cone homes: on the pavement beside a road, never on it; at least `props.cone.minVisible` (0.9) of the cone in view: never under a highway, ring or walkway as drawn, never behind a building's face. Both modes | user-decided: "cones must not spawn on roads, or under highways (where they cannot be seen)"; the visibility test proposed (assistant) | A cone the player cannot see is no bait | — | 49 homes; none on a road; 7 hidden before, none now |
| 480 | Registry `edit85-2026-10-28`: 27 `story.traffic.*`, `world.deckDropGaps`, `world.deckFlightsMin`, `props.cone.minVisible` (488 entries) | proposed (assistant) | Every new statistic has an ID | — | `content/params/tuning.parameters.json` |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "notices",
 "items": [
  {
   "id": "n01",
   "where": "title screen, under DUMMIES",
   "text": "You are a Dummy Corporation trainee. Every write-off brings Certification closer.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n02",
   "where": "Arcade's district screen, under DUMMIES",
   "text": "Welcome, trainee. Every write-off brings Certification closer.",
   "caps": false,
   "maxChars": 120
  },
  {
   "id": "n03",
   "where": "the title's STORY card",
   "text": "Shenzhen Smart City, tile by tile. Each tile trains you to its brief.",
   "caps": false,
   "maxChars": 100
  },
  {
   "id": "n04",
   "where": "the tile card's header",
   "text": "TRAINING BRIEF",
   "caps": true,
   "maxChars": 18
  },
  {
   "id": "n05",
   "where": "the story map's side panel",
   "text": "TRAINING BRIEF · {LABEL}",
   "caps": true,
   "placeholders": [
    "{LABEL}"
   ],
   "maxChars": 40
  },
  {
   "id": "n06",
   "where": "the objective strip's label while a drone flies",
   "text": "CORPORATION DRONE",
   "caps": true,
   "maxChars": 18
  },
  {
   "id": "n07",
   "where": "a toast",
   "text": "CORPORATION DRONE · DELIVERING {PART}",
   "caps": true,
   "placeholders": [
    "{PART}"
   ],
   "maxChars": 44
  },
  {
   "id": "n08",
   "where": "a toast",
   "text": "CORPORATION DRONE · {PART} ON BOARD · THEN {TILE}",
   "caps": true,
   "placeholders": [
    "{PART}",
    "{TILE}"
   ],
   "maxChars": 54
  },
  {
   "id": "n09",
   "where": "a toast",
   "text": "CORPORATION DRONE · CARRYING YOU TO {TILE}",
   "caps": true,
   "placeholders": [
    "{TILE}"
   ],
   "maxChars": 46
  },
  {
   "id": "n10",
   "where": "the gift screen, before the part lands",
   "text": "CORPORATION DRONE · INCOMING",
   "caps": true,
   "maxChars": 28
  },
  {
   "id": "n11",
   "where": "a toast",
   "text": "CORPORATION GIFT · +{N} CREDITS",
   "caps": true,
   "placeholders": [
    "{N}"
   ],
   "maxChars": 32
  },
  {
   "id": "n12",
   "where": "the gift screen, the next part",
   "text": "NEXT FROM THE CORPORATION",
   "caps": true,
   "maxChars": 26
  },
  {
   "id": "n13",
   "where": "the workshop, a part not yet issued",
   "text": "A Corporation drone brings this part.",
   "caps": false,
   "maxChars": 44
  },
  {
   "id": "n14",
   "where": "the workshop's note, a part not yet issued",
   "text": "A Corporation drone brings this part. Keep training.",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n15",
   "where": "a toast, a part not yet issued",
   "text": "A Corporation drone brings that part",
   "caps": false,
   "maxChars": 44
  },
  {
   "id": "n16",
   "where": "the Controls list, a verb not yet issued",
   "text": "A Corporation drone brings it",
   "caps": false,
   "maxChars": 34
  },
  {
   "id": "n17",
   "where": "a toast, the chassis in the river",
   "text": "Corporation drone dispatched: chassis in the river",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n18",
   "where": "a toast, a cone in the way",
   "text": "Corporation drone dispatched. Obstruction will be relocated.",
   "caps": false,
   "maxChars": 64
  },
  {
   "id": "n19",
   "where": "a toast, the chassis recovered",
   "text": "Corporation drone: chassis recovered from the river",
   "caps": false,
   "maxChars": 56
  },
  {
   "id": "n20",
   "where": "Arcade's ending, LICENSED",
   "text": "Training complete. The Corporation thanks you for your service.",
   "caps": false,
   "maxChars": 80
  },
  {
   "id": "n21",
   "where": "Arcade's ending, FAILED TEST",
   "text": "Traffic exhausted. Training incomplete; report to the bay.",
   "caps": false,
   "maxChars": 70
  },
  {
   "id": "n22",
   "where": "the frame's wordmark, title and menus",
   "text": "DUMMY CORPORATION",
   "caps": true,
   "maxChars": 20
  },
  {
   "id": "n23",
   "where": "Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage)",
   "text": "DUMMY CORP",
   "caps": true,
   "sign": true,
   "maxChars": 10
  }
 ]
}