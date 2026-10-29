SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n34 · the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters · at most 90 characters
- n35 · Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser · at most 46 characters · keep {G}
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

[EDIT26#10.6] 10.6 Certification
### 10.6 Certification
Certification is total write-offs across the run. The target exceeds the sum of shift quotas, so minimum performance is insufficient. It must remain attainable within the traffic budget while meeting each completed shift's quota. Score measures impact value; it does not replace write-offs.
*Built.* The slice's target is 11, one more than the sum of its three quotas. The target for the three-level run is `run.certification`.

[DECISIONS#rows-331-340~2] Rows 331–340
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 331 | Every district starts in its centre tile, B2: off the lanes, off a roundabout's island, below the intro banner | user-directed (26 October): "we should start in the central tile in all of the instances" | The district opens out from its set piece | Parkland and Monument no longer start at an edge | `test_p6.js` |
| 332 | Managed traffic (P6.1), GTA's method kept out of view. Each lane's inlet on a screen holds one car per spacing (2 × `world.district.<id>.interval` at `vehicles.sedan.cruiseSpeed`; highways and the Parkland ring at their feed). Spawns only out of view: an inlet beyond the district edge meters at the headway; any other fills only a missing car (1.5 headways); never into a queue; never on an inlet fed from the screen in view; at most the screen's target plus one. Off-screen, a car stopped `traffic.offscreenCullSeconds` is removed. In view nothing appears or vanishes; a followed car keeps its speed (O3.72). Replaces row 324's district-edge admission | proposed (assistant, 26 October), from "cars spawned in one tile go to the adjacent tile but then disappear?" and the GTA1 reading | Street tiles never empty for long; no jam survives out of sight | Cars are made and removed out of view | Headway CV 87/104/36% → 42/42/36%; longest stop 69.5 → 11.9 s |
| 333 | The shift's clock counts Z0 cars as each first appears on the screen in view (`run.appearances.road`). CARS LEFT shows cars still to appear. Once the shift is spent, its unseen cars go; Failed test when no unspent shift car remains. Replaces row 325 | proposed (assistant, 26 October) | Roads never drain mid-shift (Waterfront's shift had gone in 2 minutes) | The clock runs faster where traffic is busier | `test_p6.js`: a 4-car shift ends |
| 334 | Equal flow: `world.district.parkland.interval` 4.5 → 3.2, as Waterfront; Monument stays 2.4 | proposed (assistant, 26 October), from "the most important thing to fix is traffic regulation and equal flow" | At 4.5 Parkland held one car a screen: empty a quarter of the time | Parkland is less calm | Emptiest Parkland street tile 26% → 16% |
| 335 | Walkway parapets break over each Z0 lane below: one `world.tileSize` module per lane, both sides, white snapped ends. Drop through onto the cars; elsewhere the parapet holds. Replaces row 326 for walkways | user-directed (26 October): "the walkways need broken parts every so often that let the player jump down to the cars on the level below" | Drops read and land on cars | No drop over a garden or the river | `docs/p63_walkway_gap.png` |
| 336 | Car cues show only for cars on the dummy's level: headlight beams, scanners, paths, stop brackets, marks and tags | user-directed (26 October): "the player should only see car lookahead on the level that they are on" | Multi-level screens read | Cars on other levels show no intent | `docs/p63_level_cues.png` |
| 337 | River rescue in sequence: the dummy sinks `proto.rescueSinkSeconds` (2 s; ripples, then bubbles); a drone flies in from the nearest screen edge at `proto.droneSpeed`; lifts it out (`proto.droneLiftSeconds`); carries it to the nearest land; sets it down (`proto.droneLiftSeconds`); leaves. A held cone goes home. Replaces row 328's timing | user-directed (26 October): "they need an animation where they sink (for 2 seconds), and then the drone flies to them from the edge of the screen, picks, them out, and carries them to a safe location" | The fall reads; the rescue costs time | — | 4.6 s for a 70-unit carry |
| 338 | No invisible walls. Where the dummy can reach an edge but not cross it, a barrier shows on this side: a low planter between screens (`world.wallThickness`; on a shoulder, never in a lane); the perimeter wall at the district's edge (Edit 42: `world.wallThickness`, `proto.art.wallHeight`), a booth and boom where a road leaves, a boom across a highway or hill street that leaves, a parapet along the hill. In the tunnel the screen's edge holds (row 323). A crossing arrives if its centre point is clear; the push-out slides the body along | user-directed (26 October): "it MUST be either that buildings overlap tile edges where they prevent egress, or that there is a clar barrier (e.g. traffic barrier, low planter) on the current tile"; barrier types proposed | Every hold is visible | More planters at Monument's tile edges | Edge audit in `test_p6.js` |
| 339 | Chevrons mark a walkway that runs on into the next screen | proposed (assistant, 26 October), from "it is unclear how to get from one tile to another" | Continuation reads at the edge | — | `docs/p63_walkway_gap.png` |
| 340 | Registry `edit63-2026-10-26`: `world.district.parkland.interval` 3.2; new `traffic.offscreenCullSeconds` 12, `proto.rescueSinkSeconds` 2. D39 closed by row 332 | proposed (assistant, 26 October) | — | — | `content/params/tuning.parameters.json` |

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
   "id": "n34",
   "where": "the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters",
   "text": "One district, until the shift's cars run out. Every few write-offs, the grade rises.",
   "caps": false,
   "maxChars": 90
  },
  {
   "id": "n35",
   "where": "Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser",
   "text": "GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC",
   "caps": true,
   "placeholders": [
    "{G}"
   ],
   "maxChars": 46
  }
 ]
}