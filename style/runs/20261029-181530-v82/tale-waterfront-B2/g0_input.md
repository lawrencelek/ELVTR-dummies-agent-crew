SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences; 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords). The tile's content sets the length: short for one image, longer for a place with a history.
- Tile: Waterfront B2 · The circus (ACT III · CUSTOMS; tile 9 of 9). Brief: COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard) Equipment issued here: Battery 3. Chunk: STORY#WB2.
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

[STORY#WB2] WB2 Waterfront B2 · The circus
### WB2 Waterfront B2 · The circus
- **Tile:** Waterfront B2, 9 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The circus.
- **Brief:** COMBO ×{n} ({n} = story.task.comboHard). Coverage gap: chains. The final hit must be link {n} or later of a combo. ({n} = story.task.comboHard)
- **Equipment issued here:** Battery 3.
- **Tale:** Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

[DECISIONS#rows-301-310~2] Rows 301–310
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 301 | The registry takes Edit 57: version `edit57-2026-10-26`. Changes `world.markYieldBase`, `world.markYieldHeight`, `world.markYieldGap` | proposed (assistant, 26 October) | Every statistic has an ID | — | Registry 306 entries |
| 302 | Circus options A, B and C (decision 300) are set aside: none works as a transport network. Closes D32 | user-directed (26 October): "the problem with A, B, and C is that they literally don't make sense as transport networks." | — | — | — |
| 303 | Terrain sets the levels. Hills are Z1 ground (`world.deckHeight`); a valley floor is Z0. Roads keep their level: a Z1 road is a street on a hill and stands on columns only where the ground falls away under it | user-directed (26 October): "what if A2-B2-C2 is in a valley (ground level) and A1-B1-C1 are more +1 level because of topography so the highways look like roads in A1-B1-C1 but get columns in A2-B2-C2?" | A reason for every level change, as Zelda's mountains | Terrain floors, cliff faces and climbing roads are new to the kit | `prototypes/p5/docs/p65_valley_sections.png` |
| 304 | Network logic for district plans: every road goes somewhere (edge to edge, or to a junction); roads follow the terrain (arterial in the valley, ridge roads on hilltops, bridges hill to hill); levels meet where the terrain allows (a cove whose floor ramps up; public escalators; buildings with doors on two levels); the circus sits where the valley road meets the climbs | proposed (assistant, 26 October), from the user's "There must have some kind of city planning logic around the circus." | Each road and junction has a reason the player can read | — | `circus_valley.html` checks the plan against these |
| 305 | Circus · Valley plan: hills in rows 1 and 3 at Z1; the valley floor through row 2 (y 760–1160) at Z0; coves in B1 and B3 whose floor ramps 440 (27%); Valley Avenue (Z0) west–east through the circus; ridge roads at Z1 (y 240, 1680); west and east bridges (x 400, 2000) linking them, on columns over the valley only (span 396); climbs from the circus to T junctions in B1 and B3; T junctions where the bridges meet the ridge roads (A1, C1, A3, C3); public escalators on both valley walls in A2 and C2 | proposed (assistant, 26 October) | All rules hold (page checks) | Climbs need cars that change level (D35) | `prototypes/p5/circus_valley.html`; `docs/p65_valley_plan.png` |
| 306 | Street zebras removed (Circus B2's arms; decision 227). Parapet zebras stay (decisions 272, 289): they mark where the dummy steps onto a highway. Closes D33 | user-directed (26 October): "Decision - remove zebras". Keeping parapet zebras is the assistant's reading of D33 | No mark that promises a rule the game lacks | — | `prototypes/p5/docs/p66_circus_b2_no_zebras.png` |
| 307 | Circus · Valley, south side: a riverbank. Row 2 runs cliff, Valley Avenue, beach. Row 3: a coastal drive at Z0 on the seawall, horizontal, 45°, horizontal (inland under the bridges, out to the water in front of the circus); the river below. The two Z1 roads run straight south over the drive and the river, with no horizontal Z1 link south of the hill. The circus's south arm becomes the beach road, meeting the drive at a T in B3. Closes D34 | user-directed (26 October): "the south side is a riverbank with bridges carrying on over the river ... the +0 road branches into a 'riverside coastal drive' which winds in horizontal-45 degree-horizontal way ... with the two vertical +1 highways passing over the coastal drive, with a drop to the river below." Drive geometry, seawall line and the beach road are the assistant's | Every road still goes somewhere; the bridges carry the hill's traffic to the far bank | — | `circus_valley.html`; `docs/p66_valley_river_plan.png` |
| 308 | The river surface lies below the seawall (half a level). Water, not a floor: the one thing below Z0. Beach sand drawn as pale stone, never yellow (Edit 37) | proposed (assistant, 26 October), from "with a drop to the river below" | The drop reads | Falling in needs a rule (D37) | — |
| 309 | Shadows: option 2. One mask per receiving level (hill Z1, land Z0, river). Each caster stamps onto every lower level, offset by height difference × `proto.art.shadowScale`, clipped to that level. Solids sweep base to top; decks and walkways are slabs; terrain casts (hill onto valley, land onto river). Moving objects take a noon blob. Closes D36 | user-directed (26 October): "D36 - option 2 (recommended)" | Correct on every flat level at today's cost | Not yet in P5 game art; the valley plan draws it | `prototypes/p5/docs/p67_valley_tunnel_plan.png` |
| 310 | Circus: no ramps. The North Climb becomes the North Tunnel (Z0): up the level cove, into the hill at the cove head (B1, y 360), under the ridge road and the edge wall to the north edge. B1's T junction removed. Stairs up both cove walls (`world.stairLength`, `world.stairWidth`). Closes D35 | user-directed (26 October): "B1 - +0 road disappears into a tunnel ... B1 has staircase going up the cliff on both sides ... D35 - no it's not a ramp" | Roads keep one level; the circus keeps four arms | Tunnel art (row 311) | `circus_valley.html` |

[EDIT94#registry-edit94] Registry (edit94)
## Registry (edit94)
| ID | Default | Unit | Use |
|---|---|---|---|
| `world.monumentShroud` | 0 (P7: 1) | flag | The circus's monument shrouded in Story until Waterfront B2 clears |
| `ui.finale.unveilSeconds` | 1.2 | s | The drone lifts the cloth; then the plaque; A goes on. The gift screen's hold (`ui.gift.holdSeconds`) |

[DECISIONS#rows-291-300~2] Rows 291–300
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 291 | Every four-way junction takes a roundabout: a street roundabout on the ground, a highway roundabout on a deck. Its arms come in at least 90° apart; the ring sits wholly inside its tile, its centre in the central `world.junctionZone`. Supersedes 281 (realign four-ways), 282 (rings in B2 only) and 276 for four-ways | user-directed (26 October): "new rule: four-way junctions have roundabouts." | One answer for every crossing; nothing crosses, everything merges | Rings take room; some layouts move | Mock-up warns on a four-way without a ring, arms under 90°, a ring over its tile edge |
| 292 | Ring sizes: street roundabouts `world.roundaboutRadiusStreet` (112; outer lane 140, inner 84); highway roundabouts `world.deckRingRadius` (160). The P5 game keeps `world.roundaboutRadius` (160) until P6 | user-directed (26 October): "Smaller radii for ground-level roads, larger radii (like current B2) for highway roundabouts." The 112 is the assistant's: the largest that fits Parkland C3 | Street rings read as streets; highway rings as highways | Circus B2's island shrinks | Mock-up |
| 293 | Three-way junctions meet at 90°: a 45° road reaches the junction through a transition bend, as in Parkland A1. Confirms 286 | user-directed (26 October): "Three-way roads are like A1 type (always roads meet at 90 degrees, so 45-degree roads have a transition point." | — | — | Mock-up warns on an arm off 90° |
| 294 | Junction markings follow the US MUTCD: a yield line (a row of white isosceles triangles, 1 : 1.5, pointing at the approaching car) across the approach lane at every give-way point and roundabout entry (3B.16, 3C.04); centre lines stop at the junction (3B.08); a dashed lane line in a two-lane ring, never a continuous one (3C.02); no crosswalk to a central island (3C.05). Teeth `world.markYieldBase` 12, `world.markYieldHeight` 18, `world.markYieldGap` 6: about 1.6 times MUTCD size so they read in pixels. All white: yellow is the dummy's alone (Edit 37) | user-directed (26 October): "at the moment there's a weird arrow marking on the roads joining at 45 degrees. look at the correct kind of junction marking for intersections as per USA highway and street regularions." Sizes and the colour exception are the assistant's | The give-way point reads at a glance, at any angle | US centre lines are yellow; here they stay white | Mock-up, every junction and ring |
| 295 | Layouts for 291. Parkland C3: a street roundabout at (206, 286), arms NW and SE (the boulevard) and NE and SW (the street), 90° apart; the street's SW arm turns west outside the ring on a 96 fillet; row 3's road at district y 1736. Circus: street roundabouts at A2 and C2; the east road runs on to the district edge (the exit moves from south to east); the south road ends at the octagon, so B3 becomes a T; B2's ring at 112 | proposed (assistant, 26 October), from the user's "for C3, the layout will have to be rearranged to accommodate the roundabout" | Every four-way in the three districts is a ring | C3's ring sits left of centre: B3's south-end escalator caps the row-3 road at local 456 | `prototypes/p5/docs/p63_*.png` |
| 296 | The registry takes Edit 56: version `edit56-2026-10-26`. Adds `world.roundaboutRadiusStreet`, `world.markYieldBase`, `world.markYieldHeight`, `world.markYieldGap`, `traffic.ringOrbitMax` | proposed (assistant, 26 October) | Every new statistic has an ID | — | Registry 306 entries |
| 297 | Ring entry: a car whose exit is blocked waits at the yield line once `traffic.ringOrbitMax` (2) cars already orbit that ring. 0 restores Edit 52 (every car enters and orbits) | proposed (assistant, 26 October) | With three rings on one street loop, Circus locked at 13 min: orbiters filled the rings | A blocked exit now holds its own entry too: in the orbit report, cars out by the other arms 21–31 → 16–22 per 120 s (Circus ring, 2.5 s) | Mock-up 40 min, Circus longest stop 22 s; `docs/orbit_report.md` |
| 298 | Yield-line teeth: identical, at equal steps, all parallel. The row stands square to the approach lane's last straight (its heading snapped to 45°); each tooth points back up it. The line sits at the end of that straight, and a ring entry's stop line moves back to it | user-directed (26 October): "the three arrows must be perpendicular to the last straight section of the road they were aligned with ... they must be equidistant, equally spaced from each other, all parallel, and pointed in the direction parallel to the last section of straight road the incoming car lane is from." Tooth stamping and the moved stop line are the assistant's | One mark reads the same on every approach | Ring stop lines move back 8–9 | `prototypes/p5/docs/p64_yield_lines.png` |
| 299 | Tooth size `world.markYieldBase` 14, `world.markYieldHeight` 21 (1.5 × base), `world.markYieldGap` 4: 7 × 10.5 art px, three teeth across a lane. Was 12, 18, 6 | proposed (assistant, 26 October) | An odd base gives a one-pixel apex; 45° teeth get clean 1 : 2 edges | — | — |
| 300 | Circus: three layouts round the central roundabout, as checked plans. A Diamond (Z1 and Z2 chevrons crossing at A2 and C2; streets jog 45° under them); B Crown (a Z1 crown with 45° shoulders, a Z2 bar across row 3); C Twin rings (Z1 roundabouts at A1 and C3, a loop with 45° corners). Today's layout stays in the mock-up until one is chosen | proposed (assistant, 26 October), from the user's "devise three alternate layouts that are more exciting and keep the central roundabout" | Layers every screen; the bottom highway crosses streets | Diagonal escalators (A, B) are new art | `prototypes/p5/circus_options.html`; `docs/p64_circus_options.png` |

SLOT SKELETON (fill it)
{
 "kind": "tale",
 "district": "waterfront",
 "tile": "B2",
 "title": "The circus",
 "tale": ""
}

REQUEST
Redraft the tale for Waterfront B2 (The circus). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
- Prototype 7.13 (Farsight's voice; Farsight must not appear): Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.
- Prototype 8.1 (Dummy Corporation): Battery 3 is fitted: complete the chain your brief sets, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS).
Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.