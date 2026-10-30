SLOT
- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.
- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item's "text".
- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage.
- n24 · Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does · at most 110 characters
- n25 · Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does · at most 110 characters
- n26 · Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does · at most 110 characters
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

LINT (style/lint.py)
- items[1] · F5 (major, −2) "45°": typed figure; numbers live in the registry. [STORY#S1]
- items[1] · F6 (blocking, −4) "Calm, water, concrete and planting. Two Z1 highways meet at …": 21 words > 20 (style.v2.text.maxWords). [EDIT95#3.2]
- items[1] · F10 (major, −2) "Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.": 123 characters > 110: the slot's width. [EDIT95#4.2]
- items[2] · F6 (blocking, −4) "A hill walled by towers; a river below. The valley avenue me…": 30 words > 20 (style.v2.text.maxWords). [EDIT95#3.2]
- items[2] · F10 (major, −2) "A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river.": 158 characters > 110: the slot's width. [EDIT95#4.2]

CONTENT
{
 "kind": "notices",
 "items": [
  {
   "id": "n24",
   "where": "Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n25",
   "where": "Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n26",
   "where": "Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river.",
   "caps": false,
   "maxChars": 110
  }
 ]
}