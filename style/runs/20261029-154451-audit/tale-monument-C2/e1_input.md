SLOT
- Kind: tale, `content/story/story.json` `districts[].tiles.<tile>.tale`. Speaker: Farsight. Shown on the tile card.
- Schema: {"kind": "tale", "district", "tile", "title", "tale"}
- Card: at most 223 characters (style.tale.maxChars); sentences of at most 19 words.
- Tile: Monument C2 · The portal tower (ACT I · INDUCTION; tile 4 of 9). Brief: ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above. Equipment issued here: none. Chunk: STORY#MC2.

CANON

[EDIT92#3] 3 Story: Narrative A, Certified (replaces the proposal)
## 3 Story: Narrative A, Certified (replaces the proposal)
```markdown
- **Logline:** a dummy sits the longest job interview in the world. Passing means being shipped.
- **Tone:** dry corporate comedy. Farsight narrates. You are the product under test.
- **Voice:** polite, procedural, dry. No exclamation marks. Cars are colleagues; briefs are duties; parts are equipment.
- **Act I · Monument · INDUCTION:** off the factory floor; Farsight greets you as new staff.
  - Turn (C3): the gateway thanks a car for driving safely, seconds after it wrote you off. ROLE: DESTRUCTIVE TESTING.
- **Act II · Parkland · OPENING DAY:** the Expo opens when the park passes. Nine tiles, nine days. Visitors are booked.
  - Turn (B2): the board applauds the cars. "The public prefers the product to the test."
- **Act III · Waterfront · CUSTOMS:** the river is a border; ships wait beyond it.
  - The customs log (A3): ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION.
  - The circus (B2): the monument, cast from every chassis you lost. ZERO ACCIDENTS (EXCLUDING TESTS).
- **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
```

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

[EDIT39#4.1.1] 4.1.1 The register (replaces Edit 37)
## 4.1.1 The register (replaces Edit 37)
```markdown
#### 4.1.1 The register
**A Sinofuturist cyber city inside a friendly corporate terminal.** Two layers, never mixed.
- **The play area is the city at night.** 16-bit pixel art: dark deck plates, LED city blocks, neon spill, jersey barriers, a white fleet.
- **The frame is FARSIGHT's brand.** Dark glass, cyan LED edges, rounded panels. High resolution.
- **The contrast is the tone.** The city glows. The test writes off bodies in it. The brand never comments.
- **Dark ground rules every edge** (4.1.2). No sprite edge is black.
- **Reserved hues hold.** Yellow is the dummy. Red is the warning. Neon is material, never a cue.
- **Options:** day (Edit 37 eco-city) and night (parkland) remain as build palettes. Play never changes.
```

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

[EDIT93#3.1/tales-rewritten~2] Tales rewritten
- **Voice kept:** no exclamation marks; the longest 223 characters. C3 keeps ROLE: DESTRUCTIVE TESTING.

[EDIT92#measured] Measured
## Measured
| Check | Result |
|---|---|
| Solids, floors, stairs, spawns, cone homes, with and without the art | identical on all 27 tiles |
| Tiles the art draws on | 9: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3 |
| Longest tale | 217 characters: four lines on the card |
| Tile card, Monument A1 | ACT I · INDUCTION · MONUMENT · TILE A1 · 1 OF 27; The welcome wall; the act line; the tale |
| Story map | I · MONUMENT, II · PARKLAND, III · WATERFRONT |

[DECISIONS#rows-531-540~2] Rows 531–540
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 531 | Tales rewritten where a brief or part moved: Monument B1, C1, B3, C3; Parkland C1, C3, A2, B1, B2; Waterfront A1, B2. Voice kept: no exclamation marks; C3 keeps ROLE: DESTRUCTIVE TESTING, Waterfront B2 ZERO ACCIDENTS (EXCLUDING TESTS) | proposed (assistant) under row 520 | Each tale names the equipment the tile issues | — | ≤ 223 characters |
| 532 | Registry `edit93-2026-10-29`: no IDs added; the 27 `story.writeOffs.*` and `story.traffic.*` descriptions carry the new briefs (505 entries) | proposed (assistant) | Every statistic has an ID | — | `content/params/tuning.parameters.json` |
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |
| 534 | Assignment #5: a goal-oriented coding agent (`coder/`) reads the GDD, scans the code, detects gaps with executable probes, scores them, writes the code for the top one and re-scans after each write. An open D-item blocks a requirement; the loop stops when every requirement is met or blocked | proposed (assistant) | The agent builds only what the GDD specifies and a decision has settled | A blocked requirement waits for Lawrence | `coder/coder.py` |
| 535 | The finale as built (Edit 94, P7.13): the circus's monument shrouded in Story until Waterfront B2 clears (`world.monumentShroud`); the last write-off plays under the cloth; a drone lifts the cloth (`ui.finale.unveilSeconds`) and the plaque reads THE DUMMY MONUMENT · UNVEILED, ZERO ACCIDENTS (EXCLUDING TESTS), chassis spent, points, best combo, time; A or a tap: a drone carries the dummy from B2 over the edge to the container ship at B3, every crate with its face; then CERTIFIED. Arcade has no finale | user-decided (row 533); requirements and code by the coding agent (coder/, run 20261029-105801); reviewed (assistant) | The reward for clearing is seen | Credits and Second Market wait (D77) | `test_p713.js`; closes the finale part of D76 |
| 536 | The agent's writes accepted with manual changes: the write-off plays before the unveiling (the agent cut it); a drone lifts the cloth over 1.2 s, the gift screen's hold (the agent swapped it at once); the plaque in the game's own panel and type, inside the field, with the device's prompt and a tap target (the agent drew its own text below the field, keys only); the voyage reads FARSIGHT DRONE and · DRONE; the shroud's registry entry filed under World | proposed (assistant, manual review) | The agent's probes test state; the screen needed a person | — | Separate commit after the agent's; all 11 requirements' probes still pass |
| 537 | R-BARK-TILE rejected: the agent's write replaced the district's name with the tile code in Story barks ("B2. I did not sign up for this."). It met its one probe, not the voice. Reverted; the requirement set to spec none | proposed (assistant, manual review) | Barks are written lines in each tier's voice, with the lore check | Barks still name the district | Raises D78 |
| 538 | Registry `edit94-2026-10-29`: `world.monumentShroud` (0; P7SIM 1; written by the agent), `ui.finale.unveilSeconds` (1.2 s; added in review). 507 entries | proposed (assistant) | Every statistic has an ID | — | `content/params/tuning.parameters.json` |
| 539 | "Farsight" in title case in every sentence-case string: barks, tales, briefs, act lines, the ending. A label set wholly in capitals keeps its caps (FARSIGHT DRONE). Supersedes the fleet canon's capitals (Edit 39; `check_lore.py`) | user-decided (29 October): "Farsight everywhere" | Edit 92's tales, Edits 93–94 and rows 533, 535 write Farsight | `check_lore.py`, `checks.py` and bark c024 still say FARSIGHT (D79) | `style/STYLE_GUIDE.md` V4 |
| 540 | The fleet canon's banned terms apply to diegetic text only: barks, tales, briefs, act lines, the ending, plaques. Menu chrome is exempt (NEW GAME, Edit 88; LEVEL UP, Edit 89) | user-decided (29 October): "Diegetic text only" | Menus are interface, not voice | `checks.py` still applies the ban to every string shown | `style/STYLE_GUIDE.md` V1 |

[DECISIONS#rows-541-550] Rows 541–550
## Rows 541–550
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 541 | "!" by speaker: Farsight never; cars in a shout-style bark or any Budget (04) bark | user-decided (29 October): "Shouts and Budget only" | 16 of 17 shipped "!" lines fit (12 shouts; 13 Budget) | b111 "It recharges when it hits us?!" (speech, tier-free) is a minor break | `style/STYLE_GUIDE.md` T2, T10 |
| 542 | Lines the style loop accepts stay in `style/runs/` as a demonstration. D78 stays open; the Monument tile barks are its proposal. No change to `fleet.json`, `story.json`, builds or tests | user-decided (29 October): "Runs only" | Merging needs a tile condition in `fleet.json`, `check_lore.py` and `game.js`, and a 7.13 rebuild | D78 not closed | `style/runs/` |

[STORY#MC2] MC2 Monument C2 · The portal tower
### MC2 Monument C2 · The portal tower
- **Tile:** Monument C2, 4 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The portal tower.
- **Brief:** ON A RAISED ROAD. Coverage gap: raised roads. The final hit must land at Z1 or above.
- **Equipment issued here:** none.
- **Tale:** The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job.

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

[STORY#MA1] MA1 Monument A1 · The welcome wall
### MA1 Monument A1 · The welcome wall
- **Tile:** Monument A1, 1 of 9 in the act's order. Act: ACT I · INDUCTION.
- **Title (its landmark):** The welcome wall.
- **Brief:** ANY WRITE-OFF. General coverage. Any write-off in this tile counts.
- **Equipment issued here:** none.
- **Tale:** A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you.

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

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "tale",
 "district": "monument",
 "tile": "C2",
 "title": "The portal tower",
 "tale": "The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job."
}