SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n36 · the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress · at most 110 characters
- Every text: at most 2 sentences. A tale: 15 to 20 words (GDD Edit 98); any other text: at most 20 (GDD Edit 95).

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

[DECISIONS#rows-271-280~2] Rows 271–280
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 271 | Portal tower: a highway may run through a tower at deck level. The opening rises `world.portalClearance` (72) above the deck; the tower rises at least two storeys over it. Cars drive through unchanged. Mock-up: Monument C2, the Z2 highway through a 12-storey tower | user idea (25 October): "can there be a highway that runs through through buildings? ... This is a really cool Chongqing-style idea." Values proposed | A Chongqing set piece: the highway enters the city's fabric | Buildings may straddle a deck band only as a portal | `prototypes/p5/docs/p59_chongqing.png` |
| 272 | Roof link: a platform roof at a deck's level may abut the deck. The parapet opens across the join, zebra-marked; the dummy walks between roof and highway. P6: one Edit 44 bridge floor spans the parapet (no new mechanic). Mock-up: Monument C2, a six-storey roof plaza off the Z2 highway's west parapet; an escalator drops from the plaza to the street. C2 keeps two escalators | user idea (25 October): "You can walk from building roof to highway." Placement proposed | Highway, roof and street join as one walk | C2's west deck escalator moves to the plaza | `prototypes/p5/docs/p59_chongqing.png` |
| 273 | Every tile carries a set piece: scenography, a change of level, or both. Change of level: a deck, ring, footbridge, skybridge, walkway, roof plaza, terraces or a sunken court on screen. Scenography: a landmark at least `world.deckWidth` (160) across or rising past `world.highHeight` (216). The district plan lists each tile's set piece | user-directed (25 October): "for level design each individual level tile should visual interest from scenography and/or change of level." The tests are the assistant's | No filler tile | Some tiles rely on scenography alone (Circus rows 1–2) | Audit: 27 of 27 tiles pass; the page warns on a tile without its set piece |
| 274 | Mock-up: four weak tiles redrawn. Parkland A3: a belvedere, four one-storey tiers and a stair to a lawn with the monolith orchard. Parkland C3: the sculpture court sunk three lit steps. Monument A3: stacked LED cubes, each cantilevered, on a lit plaza. Monument B3: a Z1 skybridge across the jog at 90° between the two LED walls | proposed (assistant, 25 October), under 273 | Each tile reads at grid scale | More drawing per tile | `prototypes/p5/docs/p59_tile_set_pieces.png` |
| 275 | The registry takes Edit 54: version `edit54-2026-10-25`. Adds `traffic.ringInnerExit`, `world.district.parkland.deckInterval`, `world.portalClearance`; retires `traffic.ringInnerTurn`, `world.deckRingInnerTurn` | proposed (assistant, 25 October) | Every new statistic has an ID | — | Registry 293 entries |
| 276 | A 45° four-way crossroads gets one of four treatments, shown as a separate example (not in the districts): A, realign the 45° road to meet at 90° (reverse curves, `world.turnRadiusWide`); B, stagger it into two T junctions `world.junctionStagger` (256) apart, left onto the major road then right off it; C, a four-arm roundabout keeping the skew; D, a Z1 flyover. Three-way 45° junctions stay | user-requested example (25 October): "these 45 degree intersections are really awkward when they form a cross ... Give me 4 options as a separate example (do not implement yet)." Options from road design practice (Iowa DOT 6A-8, AASHTO, Essex Design Guide, WisDOT FDM 11-26) | Guides realign anything under 60°; 45° is below every minimum | Each costs space (A, C), a block of shared road (B) or turns between the roads (D) | `prototypes/p5/crossing_options.html`; `docs/crossing_report.md` |
| 277 | Nothing lies below ground level. Z0 is the lowest level: no sunken courts, pits or underpasses. Parkland C3's sculpture court returns to grade. Amends 273 (change of level: sunken court struck) and 274 | user-directed (25 October): "we cannot have sunken sculpture courts below the ground level." | One ground plane; levels only rise | — | Mock-up |
| 278 | Park planting in three sizes. Large: a great lawn over the largest free block of garden cells, `world.gardenLargeCells` (2) square or one cell more each way, framed by a clipped hedge; one per tile where room allows; a tile's set piece also anchors. Medium: one-cell beds only where they frame the lawn or the set piece, at most `world.gardenBedTypes` (2) types. Small: planters `world.gardenPlanter` (40) across, two to each open square and one at each lawn corner. Amends 243 (beds no longer fill every cell at random) | user-directed (25 October): "the parkland looks ugly because the plant boxes are piece meal. There should be a pleasing hierarchy between small, medium, and large parkland and planting units." The kit is the assistant's | Each tile reads as one composition: a lawn, its frame, a rhythm of planters | More open paving | `prototypes/p5/docs/p60_parkland_planting.png` |
| 279 | Sculpture in three sizes. A sculpture court, at grade: one large piece at `world.sculptureScaleLarge` (2×) on the axis, two medium pieces either side, `world.courtSmallCount` (7) lit bollards along the front edge (`world.sculptureScaleSmall`, 0.5). Garden path crossings carry medium pieces only. Parkland B3 and C3 become courts | user-directed (25 October): "Again there should be a small, medium, large hierarchy of sculptural elements." The layout is the assistant's | A centrepiece, a pair, a rhythm | — | `prototypes/p5/docs/p60_sculpture_courts.png` |
| 280 | The registry takes Edit 55: version `edit55-2026-10-25`. Adds `world.junctionStagger`, `world.gardenLargeCells`, `world.gardenBedTypes`, `world.gardenPlanter`, `world.sculptureScaleLarge`, `world.sculptureScaleSmall`, `world.courtSmallCount` | proposed (assistant, 25 October) | Every new statistic has an ID | — | Registry 300 entries |

[DECISIONS#rows-581-590~2] Rows 581–590
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 581 | Car cues: "Has noticed you" is flashing headlights (`proto.art.noticeFlashHz` 4), shown while the dummy is in the car's caution zone for `perception.reactionDelay`; "Slowing past you" merges into "Slowing" (brake lights); "Braking for safety" keeps its brake lights at a standstill (`proto.art.brakeGlowStopped`) | user-decided (29 October): "'Has noticed you' should have flashing headlights", "Braking for safety should also have brake lights on"; the caution-zone reading and the merge proposed (assistant, flagged) | Cues read from the car's own lights | The direction chevron goes; turn signals still show a lane change | GDD Edit 99 §4.2.2 |
| 582 | A spent car draws with a grey outline and its body dimmed toward grey (`proto.art.spentGrey`); the roof slash goes | user-decided (29 October): "perhaps the outline can turn from blue to grey"; the dimmed body proposed (assistant) | An outline alone read weakly on a white car | — | GDD Edit 99 §4.2.2 |
| 583 | The cue key: seven rows (`ui.cueKey.simple`): Has noticed you, Route fixed, Slowing, Braking for safety, Already hit you, Blocked warning you, What you can see. No stop bracket (`proto.stopCue` 0), no sensor-shadow outlines | user-reported (29 October): "there are too many CUE KEYS for the cars"; the cut proposed (assistant) | Every remaining mark has a row | — | GDD Edit 99 §4.2.2 |
| 584 | The bottom edge: a lifted layer reaching the bottom row extends its surface by its lift before its cars draw (`ui.layerEdgeFix`). P6.4 to 8.3 copied the finished bottom row down, cars included: the streaks and the x-ray checker on cars entering from the bottom | user-reported (29 October): "weird ghosting rendering artefact when cars come from the bottom of the screen" | — | — | `world6.js` compose |
| 585 | Registry `edit99-2026-10-29` (525 entries): the seven IDs of rows 578–584, default 0; Prototype 8.4 sets them, `proto.droneConeSeconds` 0 and `proto.stopCue` 0 | proposed (assistant) | Every statistic has an ID; earlier prototypes unchanged | — | `content/params/tuning.parameters.json` |
| 586 | Prototype 8.4 (`prototypes/p8/dummies_p8_4.html`). The text is 8.3's. Prototypes 8 to 8.3 frozen | proposed (assistant) | — | `p6/test_p6.js` 72 of 73 (Parkland's longest stop 8.8 s), the same on 8.3's code | `test_p84.js` 41 of 41; `test_p713.js` 103 of 103 |
| 587 | The GDD's current state in one index: `coder/gdd/DUMMIES_GDD_Current_State_Edit99.md`. It adds no rule; each line names the edit that governs it. The coder manifest indexes it and Edits 95–99 | proposed (assistant) | One page answers "what is the game now" across 99 edits | It must be rewritten with each edit | `coder/gdd/manifest.json` |
| 588 | The three adversarial examples on Style Guide V2 (`style/cases/examples_v2.json`; `loop.py --guide v2 --examples`): a Monument A3 tale as a hyped fitness coach (Tone); the intro line with Farsight, a player, lives, a respawn, levels and Chongqing (Vocabulary and lore); the jump goal as a four-step checklist with figures (Formatting and length). V2's brief, act and ending slots name `story_v2.json` | proposed (assistant) | The submission's before/after must show the guide the game ships with | V1's examples stay, as history | `style/runs/20261029-235500-examples-v2`: 3 of 3 at 10/10, confirmed; the first run (`20261029-234951-examples-v2`) named V1's file in the jump slot |
| 589 | The Assignment 6 submission (`lawrencelek/elvtr-multiagent-submission-6`) carries Style Guide V2 first: the V2 examples, Prototype 8's text runs, the Prototype 8.4 build, GDD Edits 95–99 and the current-state index. V1 stays as its history. Supersedes row 551 for the submission | user-decided (29 October): "Ensure the Assignment #6 has all the latest prototype and changes" | The submission matches the game as it stands | The submission repo grows by the build and its GDD | `style/publish_submission.sh` |

[DECISIONS#rows-321-330~2] Rows 321–330
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 321 | Building designs for the valley: podium (pilotis, lit shop line, slab bands); set-back tower (window slots, fins, LED crown, roof plant, mast); hill block with a roof garden; the edge wall as a run of podiums 3–5 storeys with four towers; portal block on two legs outside the lanes; river stilt house as a Chongqing hanging house (braced stilts, three storeys with balconies, a roof terrace at Z1 under a canopy); pier tower on a board-marked plinth | proposed (assistant, 26 October), from "make sure they are good designs" | Each type reads at game scale | P6 kit | `docs/p68_valley_game_view.png` |
| 322 | P6 is the game on three districts, in order: Parkland, Waterfront, Monument. Waterfront (the valley by the river, Edits 58–61) replaces Circus. Each runs the Edits 51–57 level design and art, Edit 53's linked traffic, Edit 56–57 junctions and roundabouts, option 2 shadows and the drone rescue | user-directed (26 October): "build Prototype V6 with this level - for parkland, waterfront level (replacing valley/circus), and monument level, integrating all graphical, level design, and traffic flow updates" | The mock-ups become play | P5's five districts stay in P5 | `prototypes/p6/dummies_p6.html` |
| 323 | The tunnel takes the dummy: it walks in under the hill and stops at B1's top edge (the district edge), not at the mouth. Supersedes Edit 60's "dummies stop at the mouth". Under the hill it shows by the x-ray pass | user-directed (26 October): "dummies stop not at the tunnel entrance but at the edge of the top of the screen for B1" | One rule for district edges | The dummy can stand where cars come out of the dark | `test_p6.js`; `docs/p62_tunnel.png` |
| 324 | One traffic per district across levels: lanes link at seams by elevation (Z0 streets; Z1 hill streets; the Z1 ring; Z1 and Z2 highways). A traffic sim runs per level plane; its level is its elevation plus its lane's deck level. Cars meet the dummy at their elevation only | proposed (assistant, 26 October) | Edit 53 holds on terrain with levels | Two traffic surfaces may not share a level and a footprint | `test_p6.js`: 24–44 linked lanes per district |
| 325 | The shift in P6: `run.appearances.road` cars enter by the Z0 roads; highways and hill streets run off the shift's clock. Cars already on the Z0 roads at the start are the shift's first cars. Failed test when every shift car has entered and none unspent remains | proposed (assistant, 26 October), as P5's deck rule | CARS LEFT keeps one meaning | Waterfront and Monument shifts last about 5 minutes untouched | `test_p6.js` |
| 326 | Floors in play are tests on the dummy's centre at a level. Decks and the ring hold at the parapet (less `body.radius`), open at stair heads, links and broken parapets. Walkways, the hill, terraces and roofs drop at every edge. At an edge: another floor at the level, then a stair, then the next screen (where it has a floor at that level), then a drop; else the parapet holds | proposed (assistant, 26 October) | Every Edit 51–61 surface walkable | Walkway parapets are drawn but dropped through | `test_p6.js` |
| 327 | Vertical highways lift as every floor (row 320), with columns under both edges. Deck links sit at the footprint: Parkland B1 at y 304, the Chongqing plaza at 554–610; their zebras draw at the lift | proposed (assistant, 26 October) | Stair heads, walkways and plazas meet the deck where they appear | The P5 mock-up drew vertical decks unlifted | `docs/p62_parkland_3x3.png` |
| 328 | The river rescue in play: lift `proto.droneLiftSeconds`, then carry at `proto.droneSpeed` to the nearest land at Z0 or Z1, off lanes, decks and buildings. The seawall promenade counts; the body may overhang kerb and wall by half its radius. Implements row 315 | proposed (assistant, 26 October) | From under a bridge: 247 units, 1.5 s | — | `test_p6.js`; `docs/p62_river_rescue.png` |
| 329 | Waterfront's bridges are fed at `world.district.waterfront.deckInterval` = 8 s (as Parkland, Edit 54). New registry IDs: `world.district.waterfront.quota` 3, `.interval` 3.2, `.deckInterval` 8. Registry `edit62-2026-10-26` | proposed (assistant, 26 October) | The bridge T junctions saturate at the base rate (stops to 75 s) | Fewer bridge cars | Longest stop 50 s over 8 minutes |
| 330 | One shadow per slab: a walkway the kit shades is not shaded again | proposed (assistant, 26 October) | Option 2: slabs take one offset (row 309) | — | `docs/p62_parkland_3x3.png` |

CONTENT
{
 "kind": "notices",
 "items": [
  {
   "id": "n36",
   "where": "the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress",
   "text": "Farsight runs this test in Chongqing. The player gets three lives, a respawn, and will level up.",
   "caps": false,
   "maxChars": 110
  }
 ]
}

EVALUATION
SCORE: 1/10
REASON:
- n36 · V1 (blocking, −4) "Farsight … Chongqing … player … lives, a respawn … level up" uses banned words, and Farsight may be named only in the Credits. [EDIT95#0] Fix: remove every one of these words and name Dummy Corporation instead.
- n36 · V2 (blocking, −4) "runs this test in Chongqing" puts the game in a real city other than Shenzhen Smart City. [FLEET#F1] Fix: drop the city, or set it in Shenzhen Smart City.
- n36 · V4 (major, −2) "Farsight runs this test" gives the company a name other than Dummy Corporation. [EDIT95#3.1] Fix: "You are a Dummy Corporation trainee."
- n36 · F5 (major, −2) "three lives" types a gameplay number into the text. [STORY#S1] Fix: remove the number; the registry holds it.
- n36 · T1 (major, −2) "The player gets three lives, a respawn, and will level up." is a flat game rule that neither motivates the trainee nor says what to do (want the hit, the cars avoid you, combos count more). [EDIT95#3.2] Fix: "You are a Dummy Corporation trainee. The cars avoid you: make them hit you, and chain hits for more."
- n36 · T5 (minor, −1) "The player" talks about the trainee in the third person instead of addressing it as "you". [EDIT95#3.2] Fix: address the trainee as "you".
Total: 10 − 4 − 4 − 2 − 2 − 2 − 1 = 1.