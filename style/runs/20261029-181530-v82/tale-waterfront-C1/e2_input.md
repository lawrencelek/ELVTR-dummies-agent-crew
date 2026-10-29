SLOT
- Kind: tale, `content/story/story_v2.json` `districts[].tiles.<tile>.tale`. Speaker: Dummy Corporation. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Length: at most 2 sentences; 15 to 35 words (style.v2.tale.minWords, style.v2.tale.maxWords). The tile's content sets the length: short for one image, longer for a place with a history.
- Tile: Waterfront C1 · The east portal (ACT III · CUSTOMS; tile 3 of 9). Brief: A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car. Equipment issued here: none. Chunk: STORY#WC1.
- Every text: at most 2 sentences. A tale: 15 to 35 words (GDD Edit 97); any other text: at most 20 (GDD Edit 95).

CANON

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

[STORY#WC1] WC1 Waterfront C1 · The east portal
### WC1 Waterfront C1 · The east portal
- **Tile:** Waterfront C1, 3 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The east portal.
- **Brief:** A POLICE CAR. Coverage gap: the police fleet. The final hit must come from a police car.
- **Equipment issued here:** none.
- **Tale:** The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared.

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

[STORY#WA1] WA1 Waterfront A1 · The west portal
### WA1 Waterfront A1 · The west portal
- **Tile:** Waterfront A1, 1 of 9 in the act's order. Act: ACT III · CUSTOMS.
- **Title (its landmark):** The west portal.
- **Brief:** A BUS. Coverage gap: the bus fleet. The final hit must come from a bus.
- **Equipment issued here:** none.
- **Tale:** The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.

[DECISIONS#rows-311-320~2] Rows 311–320
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 311 | Tunnel portal asset: concrete frame in the cove head wall (road width plus 8 art px pillars); cyan LED soffit; two lamps; a mouth of three dark steps; lane dashes fade inside; cars clip at the mouth line and the hill draws over the lanes; the portal block above as a belvedere. Dummies stop at the mouth, as at a screen edge | proposed (assistant, 26 October), from "need a tunnel-looking asset" | Reads as a tunnel at 18 art px of wall | P6 kit | `prototypes/p5/docs/p67_tunnel_portal.png` |
| 312 | The seawall runs parallel to the coastal drive, bends included: kerb to wall `world.walkwayWidth` (a promenade) | user-directed (26 October): "the dropoff from coastal drive does not follow the lane well"; offset the assistant's | The drop follows the lane | — | Plan check: ±1.4 on the bends |
| 313 | Hill mass: hill blocks between the roads (5–7 storeys); portal blocks spanning the west bridge, the east bridge and the ridge road (one storey clear); the edge wall along the top edge, a 4-storey podium edge to edge with four towers of 9–10 storeys (inside `world.towerHeightMin`–`world.towerHeightMax`). Impassable; the tunnel passes under it | user-directed (26 October): "The A1/B1/C1 Zones can show building mass with the highways passing between them and underneath them. The top edge should read like an impassible mass of buildings, or another high cliff." Buildings chosen over a cliff (assistant) | The top edge holds; highways thread the mass | — | `circus_valley.html` |
| 314 | Shore buildings: cliff house (A2, C2; doors at Z0 and Z1), beach pavilion (A2, C2, B3 ×2; on pilotis), river stilt house (B3 ×2; roof at Z1), pier tower (A3, C3; in the river). Six Z1 walkways (`world.walkwayWidth`, columns `world.walkwayColumn`): cliff house to pavilion over the avenue (A2, C2), pavilion to stilt house over the drive (B3 ×2), bridge deck to pier tower (A3, C3). Four are drops onto cars | user-directed (26 October): "There should also be a few overhead walkways and new building types for this"; types and routes the assistant's | Eight drops onto cars in the district (four new) | Four new building sprites | `docs/p67_valley_sections.png` (C–C) |
| 315 | The river: a drone lifts a fallen dummy to the nearest land at Z0 or Z1, never a lane, a deck or a building. Time: distance ÷ `proto.droneSpeed` + `proto.droneLiftSeconds`. Circus: 204 to the seawall promenade, 1.4 s. Closes D37 | user-directed (26 October): "dummies falling into the river get picked up by a drone and placed onto the closest land point (not onto a highway)". Excluding lanes is the assistant's reading | No body lost; no free hit | Drone carry art exists | Plan check |
| 316 | Ramps, as a future mechanic: a ramp lane carries z foot to head; car z and art lift interpolate; a hit needs the z gap between car and dummy under `vehicles.*.height`; drop height is dummy z − car z; the ramp links a Z0 lane to a Z1 lane by endpoint; option 2 shadows quantise it. Raises D38 | proposed (assistant, 26 October), answering "How would the transition of height and hitting happen? It would however give us new options for verticality." | On-ramps, car-park spirals, cove climbs | Per-car z, z-band hits, sloped deck art | GDD Edit 60 |
| 317 | Nothing over the tunnel. The ridge road runs at Z1 on the hilltop, over the tunnel, unbroken; B1's portal block over it is removed. Plans draw nothing underground (the tunnel shows only as its portal); sections may cut through it | user-directed (26 October): "B1 - this 'underground block' is not visible because the highway in A1+B1+C1 is actually at +1 level" | The hilltop reads as one level | — | `prototypes/p5/docs/p68_valley_plan.png` |
| 318 | No connector buildings. Walkways run at Z1 from the hill, a bridge deck or a beach landing. The A2 and C2 cliff houses are removed; their walkways leave the cliff top, cross the avenue and land on beach terraces | user-directed (26 October): "there can be a walkway from +1 level on A2 to beach level on A2 but there is no connector '5' because this is at +1 level" | A walkway is a Z1 route, not a building's | — | Section C–C |
| 319 | Beach park pieces replace the beach pavilions: beach terraces (A2, C2; a Z1 deck on pilotis, a stair to the sand, a canopy, a planter); beach landings (B3 ×2; a Z1 deck on pilotis, a stair up from the sand); raised-lawn planters (`world.gardenPlanter`); an obelisk and an arch; rows of lit bollards (`world.sculptureScaleSmall`). No trees (Edit 51.3) | user-directed (26 October): "there can be some beach structures, like park like structures"; the pieces are the assistant's | The beach becomes a park with routes up | Deck, canopy and planter sprites | `docs/p68_shore_pieces.png` |
| 320 | One projection for all valley art: a point at height z draws at y − z × `proto.art.extrusion`; floors at their lift as plan shapes; only south faces show; no vanishing points; painter's order north to south, then low to high. The tunnel portal is redrawn to it: frame 8 proud and flush with the hilltop, the lane running on into the dark at the same width with its centre line on axis, a cyan LED line on the lintel, cars clipped at the lintel line. Replaces row 311's drawing | user-directed (26 October): "it shows perspectival view down tunnel and the street lines in centre don't align. make sure the graphics are consistent for the tunnel properly with the correct 2D perspective with some front elevation revealed" | Every piece reads in the game's own view | — | `circus_valley_view.js`; `docs/p68_tunnel_portal.png` |

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "tale",
 "district": "waterfront",
 "tile": "C1",
 "title": "The east portal",
 "tale": "The east bridge was built a year after the west, to correct its mistakes; its portal block faces the other way. The police here check papers, and your Certification needs their fleet on record."
}