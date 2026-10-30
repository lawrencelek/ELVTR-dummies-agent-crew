SLOT
- Kind: act line, `content/story/story.json` `districts[].intro`. Speaker: Farsight. On the district's first card.
- Schema: {"kind": "act", "district", "intro"}
- District: Parkland, ACT II · OPENING DAY.

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

[DECISIONS#rows-351-360~2] Rows 351–360
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 351 | Parkland: cyber turf in every garden cell (mown stripes, a grid of cyan and magenta LED studs); paths stay paved with their light lines; four lit sculptures a screen (was two). Green share of the district 9.5% → 30.8% | user-directed (27 October): "the parkland should have more green … cyber-park vibe, filled with lights and public sculpture"; form proposed | Green reads first; lights and sculpture throughout | — | `docs/p66_before_after.png` |
| 352 | Parkland B2: the ring planted on its own shoulders; its island a garden at Z1 with a sculpture of light; the two pools become lawns with lit edges and a large sculpture each. Green share of B2 0.1% → 31.8% | user-directed: "especially in the central tile somehow"; design proposed | The centre is green | The pools go | `docs/p66_before_after.png` |
| 353 | Monument B2: square paving, as the district's ground; no 45° lattice; the island's studs square | user-directed: "the paving slabs should be horizontally aligned and not too busy against the rest of the area" | The monument reads | — | `docs/p66_before_after.png` |
| 354 | Wayfinding: every flight's apron drawn as a mat (lit corner brackets, two chevrons into the flight), all districts. Monument B2: lit guide strips from the screen's edges to the ring escalators | user-directed: "this paving should also help guide the player as a navigational aid"; form proposed | Flights are found | — | `docs/p66_parkland_monument.png` |
| 355 | Raised layers are drawn past the bottom edge by their lift, so a walkway reaches the screen's edge as drawn. A screen's edge never ends a walkway (no end parapet). Chevrons sit at the edge as drawn | user-directed: "Square B1 in monument has the end of the vertical walkway that doesn't lead to the edge of the screen … should it pass to the next row?" | Continuity reads | — | `test_p6.js` |
| 356 | At a level, a north–south screen crossing happens at the edge as drawn (the floor's lift), where next door has a floor there | proposed (assistant, 27 October), with row 355 | The dummy never leaves the view | — | B1 → B2 at Z1: crosses at y 639 → 1 |
| 357 | Walkway openings: the snapped rail ends in the rail's contrast (cyan on the magenta rail); the opening slides along its spine (up to a lane's half) until its ends, as drawn, stand clear of the road's markings below | user-directed: "instead of having it white, have it as a contrasting colour … also position it at a slightly offset position from the road marking" | The opening reads apart from the road | — | 13+ units clear |
| 358 | Parkland is an Expo site: paved, with deliberate pieces. Replaces row 351's turf in every cell | user-directed (27 October): "it should read like a deliberate landscape - like a World Expo site … like a past olympic games, or World Expo site with pavilions" | Reads as designed | Less green than P6.4 | `docs/p67_parkland_expo.png` |
| 359 | Every open garden cell takes a programme in a fixed rotation of eight: pavilion, parterre, fountain, court, parterre, pavilion, fountain, parterre. At least one pavilion a screen. Pavilions: a dome, an LED box or a canopy, solid to their plans. Courts as B3 and C3: a lit kerb, a sculpture, planters, corner bollards | proposed (assistant, 27 October), from "A3 and B3 and C3 with their decorative elements … is the right mood" | Eight pavilions in the district | — | `tools/p6_audit.js` 200/200 |
| 360 | Water features: fountains (an octagonal basin, three jets) in the rotation; a small round fountain in every other cell the roads, decks and flights leave part free; each great lawn split by a paved cross-walk with a reflecting rill and jets on its long axis | user-directed: "some water features scattered around"; forms proposed | Water throughout | — | `docs/p67_parkland_expo.png` |

[STORY#PC1] PC1 Parkland C1 · The lantern pavilion
### PC1 Parkland C1 · The lantern pavilion
- **Tile:** Parkland C1, 1 of 9 in the act's order. Act: ACT II · OPENING DAY.
- **Title (its landmark):** The lantern pavilion.
- **Brief:** PUSH OFF A CAR. Coverage gap: ricochets. Push off one car; the final hit must be the next car.
- **Equipment issued here:** Arms 1.
- **Tale:** The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Arms 1 is fitted; Farsight calls it safety equipment. Under the footbridge, push off one car into the next.

LINT (style/lint.py)
- No findings.

CONTENT
{
 "kind": "act",
 "district": "parkland",
 "intro": "The Expo opens to the public when this park passes. Nine tiles, nine days. Visitors are booked."
}