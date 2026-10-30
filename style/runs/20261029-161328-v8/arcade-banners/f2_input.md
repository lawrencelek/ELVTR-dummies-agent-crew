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
 "kind": "notices",
 "items": [
  {
   "id": "n24",
   "where": "Arcade: Monument's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · MONUMENT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "Neon commerce, LED walls; one road splits round the monument under the highways. Your training begins here.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n25",
   "where": "Arcade: Parkland's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · PARKLAND · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "Water and concrete; a boulevard passes under the raised ring. Your write-offs open the Expo to clients.",
   "caps": false,
   "maxChars": 110
  },
  {
   "id": "n26",
   "where": "Arcade: Waterfront's opening banner, four seconds at the start of a run, under the label 'DISTRICT n OF 3 · WATERFRONT · q WRITE-OFFS'. The text describes the district's streets, as the original does",
   "text": "A hill walled by towers; bridges cross the drive and the river. Certified dummies ship across it to clients.",
   "caps": false,
   "maxChars": 110
  }
 ]
}

EVALUATION
SCORE: 6/10
REASON:
- n24 · R4 (blocking, −4) "one road splits round the monument under the highways" The canon puts the split road under the raised walkway ring, not under highways, so the banner names a structure the monument's streets do not have there. [DECISIONS#rows-231-240~2] (rows 238, 239) Fix: "Neon commerce, LED walls; one road splits round the monument under the walkway ring. Your training begins here."
Total: 10 − 4 = 6.