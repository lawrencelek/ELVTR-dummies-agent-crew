SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences; 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords). The tile's content sets the length: short for one image, longer for a place with a history.
- Tile: Parkland C2 · The amphitheatre (ACT II · OPENING DAY; tile 2 of 9). Brief: A VAN. Coverage gap: the van fleet. The final hit must come from a van. Equipment issued here: none. Chunk: STORY#PC2.
- Every text: at most 2 sentences. A tale: 15 to 35 words (GDD Edit 97); any other text: at most 20 (GDD Edit 95).

CONTEXT

[EDIT97#0] 0 Request and rulings
## 0 Request and rulings
- **Request (user, 29 October):**
  - "Redraft the tales. They can be longer or shorter based on what is better. 15 to 35 words."
  - "Is there working high score system and leaderboard? High score button below the ARCADE or STORY mode."
  - "Lets look at the game loop for ARCADE. Does it make more sense to finish level with write offs? Or after X write offs, things get harder somehow?"
- **Readings flagged:**
  - Tales: 15 to 35 words, at most two sentences. The tile's content sets the length.

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

[STORY#PC2] PC2 Parkland C2 · The amphitheatre
### PC2 Parkland C2 · The amphitheatre
- **Tile:** Parkland C2, 2 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The amphitheatre.
- **Brief:** A VAN. Coverage gap: the van fleet. The final hit must come from a van.
- **Equipment issued here:** none.
- **Tale:** Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you.

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

[DECISIONS#rows-371-380~2] Rows 371–380
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 371 | No ground out of reach: open ground the dummy cannot reach from the B2 spawn is planted (a low planter, a hedge top). The great lawn's hedge opens where its cross-walk meets it | proposed (assistant, 27 October), from the reach test | Nothing in view is out of reach | Five Parkland patches and one Monument patch planted | Reach 19/19, 30/30, 26/26 |
| 372 | Prototype 6.2: the playtest of 27 October on top of 6.1. Built as `prototypes/p6/dummies_p6_2.html`; 6.1 and P6 frozen | user-directed (27 October, five points and two screenshots) | Each build stays playable | — | Title and HUD read P6.2 |
| 373 | Parkland B2: no island. The ring's hole stands open over the boulevard. The inner parapet opens one `world.tileSize` module where the inner edge passes over a Z0 road's centre line (two); the dummy steps off and lands on the road. Elsewhere the inner parapet holds. Supersedes row 361's island fountain | user-directed: "can't have fountain in the middle because it's a road underneath. should be able to leap from above into path of traffic below" | A drop onto traffic from the ring | The island's jets and sculpture go | Both openings drop onto the boulevard; the parapet holds elsewhere |
| 374 | Deck lamps only where the parapet is the deck's own edge; never where flares meet over the carriageway. The ring's flares lit too | user-directed: "some of the street lamps are placed incorrectly" | No lamp on a carriageway | — | `docs/p70_before_after.png` |
| 375 | Parkland on one garden grid. A seam path runs whole inside each screen, inside the wall at the district's bound. Every piece sits in cells; nothing in one cell stands on a path. Set pieces snapped to cells: A1 reservoir, B1 cascade (one pool a cell), C1 lantern pavilion, A2 canal, C2 amphitheatre, A3 belvedere, B3 and C3 courts, B2 pools. Pavilions S, M, L inside one cell (supersedes row 363's L across two cells). Sculptures on grass squares, never on a crossing. Closes D42 | user-directed: "cannot walk between these pools, which aren't placed relative to the other grid"; "inconsistent placement of elements, i.e. larger pavilion blocks the entry points"; "inconsistency between pond and tiles below and diagonal assets" | Every path that reads as a path walks | Fewer, smaller halls | Parkland: 0 dead space (was 18); 0 edge planters (was 12) |
| 376 | Along a 45° road: the shoulder, a grass verge (`world.gardenVerge`, now registered), a footpath (`world.gardenPath`), then the grid | user-directed: "the diagonal street is not well placed against the bottom left corner" | Diagonals meet the grid at one setback | Cells by the boulevard become part-free | `docs/p62_parkland_3x3.png` |
| 377 | Parkland flights: the axis on a garden path at the flight's own end of the deck. A flight a road leaves no path line in reach keeps its place (five). Every district: a forecourt `world.stairForecourt` (44) beyond the apron, as wide as it, where nothing stands | proposed (assistant, 27 October), from "larger pavilion blocks the entry points" | Every flight opens onto a path or open ground | — | Forecourts clear in all 27 screens |
| 378 | Parkland deck and ring columns stand between paths: at row centres under a vertical deck, set in under the deck; none in a flight's apron or forecourt (all districts) | proposed (assistant, 27 October) | Paths under deck edges walk | — | `node tools/p6_nav.js` |
| 379 | No dead space: open ground the body cannot touch (centre clear by `body.radius` − 2, body covering `body.radius`) is planted, a low planter with a hedge top, in every district | user-directed: "thoroughly fix the navigation route logic" | No gap that reads as walkable and is not | Hedges in slivers by Monument's blocks | Monument: 25 patches planted |
| 380 | Navigation checks (`tools/p6_nav.js`, in `test_p6.js`): dead space; Parkland's paths node to node; flight forecourts and apron axes; Parkland's ground one piece a screen. Route tests: walk round the B2 ring at ground; drop through the hole | user-directed: "in the central B2 roundabout I cannot walk around the bottom left corner"; "thoroughly fix the navigation route logic" | Navigation proved, not eyeballed | About 20 s more test time | `node test_p6.js 3` → 64/64 |

[DECISIONS#rows-281-290~2] Rows 281–290
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 281 | A 45° four-way crossing is realigned to 90° (option A): the minor road bends 45° and crosses square, every turn at the junction 90°. Resolves D31. Parkland C3: the loop bends 45° at B3's east edge, crosses the boulevard at 90° in C3 and turns 90° in C2 to rejoin its 45° run; C3's sculpture court moves east of the crossing, C2's amphitheatre to its north-east. Three-way 45° junctions stay | user-directed (25 October): "A and C are acceptable." The Parkland geometry is the assistant's | Every four-way crossing meets square | The loop's R160 bend in C3 goes; the crossing sits in C3's north-west | Mock-up warns on a four-way crossing off 90° |
| 282 | A roundabout that keeps a 45° skew (option C) sits only in a district's centre tile (B2) | user-directed (25 October): "Only C when it is in the central of 3x3 tiles." | The centre stays the district's one big junction | — | Mock-up warns on a skewed ring outside B2 |
| 283 | A 45° flyover over a road (option D) only where a level design names it; never a default fix | user-directed (25 October): "The 45 degree flyover is fine but only for certain level designs." The 'named in the plan' reading is the assistant's | A flyover stays a set piece | — | Mock-up warns on an unnamed flyover |
| 284 | Staggered T junctions (option B) are not used. `world.junctionStagger` retires (example only) | user-directed (25 October): only A and C were accepted, D for named designs | — | — | Example page marks B rejected |
| 285 | The registry takes Edit 55.1: version `edit55.1-2026-10-25`. Retires `world.junctionStagger` | proposed (assistant, 25 October) | — | — | Registry 300 entries |
| 286 | Every junction's arms meet at 90°, three-way included: a road arriving at 45° curves in (`vehicles.bus.minRadius` fillets). Parkland A1: the avenue curves north-east to join the boulevard square. Amends 281 ("three-way 45° junctions stay") and Edit 49.3 | user-directed (25 October): "for A1, the road joining at 45 degrees must curve round to have a 90 degree join." Applying it to every three-way join is the assistant's reading | Every junction reads the same way | — | Mock-up warns on any junction arm off 90° |
| 287 | Every junction sits in its tile's central `world.junctionZone` (75%) each way (x 100–700, y 80–560). Parkland: the loop's long road moves to district y 1728 (row 3, local 448); C3's crossing moves to (241, 321); B3's and C3's sculpture courts move; A2's canal drops below its escalator | user-directed (25 October): "New rule for level design: all junctions must happen in the central 75% area of the specific tile." | No junction cut by a screen edge | Roads re-planned across rows | Mock-up warns on a junction outside the zone; none fire |
| 288 | Parkland's B2 ring draws centred and smaller: row 2's highway moves to district y 996 (B2 local 356; the Z1 lift draws it at 320); `world.deckRingRadius` 200 → 160. Each arm shows a straight run to the edge: about 83 north and south, 163 west and east. Supersedes 242 (ring in the upper half); amends 265 | user-directed (25 October): "it must be centred on the screen and slightly smaller if possible so that the straight sections of the four roads facing to other grid tiles are clearly visible." Values are the assistant's | The ring reads as the centre; every arm reads as a road to the next tile | About 5% less ring capacity (Edit 53.1: 37 cars/min at 200, 35 at 168); Parkland offers 30 | Mock-up, 20 min: see the log |
| 289 | The upper row's Z1 walkway joins the highway: C1's footbridge runs west across B1 and meets the B1 Z1 highway at both parapets (openings, zebras), then continues into A1 and lands by escalator. C1's west escalator goes | user-directed (25 October): "I like the high walkway but it should connect to the highway." The route and the A1 landing are the assistant's | Street, walkway and highway join into one walk across the row | The dummy can walk out onto highway lanes | Mock-up |
| 290 | The registry takes Edit 55.2: version `edit55.2-2026-10-25`. Adds `world.junctionZone`; `world.deckRingRadius` 200 → 160 | proposed (assistant, 25 October) | Every new statistic has an ID | — | Registry 301 entries |

SLOT SKELETON (fill it)
{
 "kind": "tale",
 "district": "parkland",
 "tile": "C2",
 "title": "The amphitheatre",
 "tale": ""
}

REQUEST
Redraft the tale for Parkland C2 (The amphitheatre). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
- Prototype 7.13 (Farsight's voice; Farsight must not appear): Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you.
- Prototype 8.1 (Dummy Corporation): Our board will watch from these terraces on opening day, and every crossing of the avenue is a performance. A van delivers the catering; arrange for it to deliver you.
Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.