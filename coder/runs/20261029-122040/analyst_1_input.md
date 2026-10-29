# Task
Write the requirements for these GDD candidates, with acceptance probes, as your system prompt says. Output one JSON object.

# Candidates
- `EDIT94#3.2:5` [built, rank 94] **Then the ending screen** (built): CERTIFIED, on B3.
- `EDIT94#open:0` [open, rank 94] **D77:** credits over the voyage; Second Market.
- `EDIT94#open:1` [open, rank 94] **D78:** barks that name the tile.
- `EDIT94#open:2` [open, rank 94] **D70, D67, D68** stand.
- `P7#known-gaps:0` [gap, rank 94] Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- `P7#known-gaps:1` [gap, rank 94] Points are a score only; nothing yet ranks or grades a tile (Edit 90's grade is open).
- `P7#known-gaps:2` [gap, rank 94] At 1 health after a miss, any hit to the brief ends the chassis; the floor makes a tile in test a long life.
- `P7#known-gaps:3` [gap, rank 94] Three slots, in this browser only: no cloud save, no export. A 7.7 save's credits are ignored; a 7.8–7.9 save keeps the upgrades it bought.
- `P7#known-gaps:4` [gap, rank 94] A slot's time stamp is the browser's local time.
- `P7#known-gaps:5` [gap, rank 94] Barks still name the district, not the tile. Naming it needs written lines in the fleet database (D78); the agent's word swap was rejected (Edit 94).
- `P7#known-gaps:6` [gap, rank 94] Short Arcade districts buy few parts: Parkland's 2 write-offs, 2 credits.
- `P7#known-gaps:7` [gap, rank 94] No credits over the voyage, no Second Market (D77).
- `P7#known-gaps:8` [gap, rank 94] Parkland's visitors and Chassis 0 live in the tales, not on screen.
- `P7#known-gaps:9` [gap, rank 94] Parkland B1: no road under its highway, a street empty 67% of the time (D70). Its brief is now a raised road (Edit 93).
- `P7#known-gaps:10` [gap, rank 94] Battery 3 fits on the last tile: the faster recharge serves one tile, the circus.
- `P7#known-gaps:11` [gap, rank 94] Tile scales raise culls out of view: 27 in 54 min of soak (9 at 1). The player never sees them.
- `P7#known-gaps:12` [gap, rank 94] Touch layout: one saved layout a browser, as fractions of the screen; a phone turned between screen shapes keeps the fractions. A placed control can cover a panel (the player's choice).
- `P7#known-gaps:13` [gap, rank 94] The diamond moves and sizes as one; its four buttons do not separate.
- `EDIT93#open:0` [open, rank 93] **D76:** the finale and Second Market.
- `EDIT93#open:1` [open, rank 93] **D70:** eased. Parkland B1's missing drop gap stands.
- `EDIT93#open:2` [open, rank 93] **D67, D68** stand.
- `EDIT92#3:6` [built, rank 92] **Delivery (built):** the act line on each district's first card and at the head of every card; the map's act numerals (I, II, III); 27 tales; the ending.
- `EDIT92#3.2:0` [built, rank 92] **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- `EDIT92#3.2:1` [proposed, rank 92] **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- `EDIT92#3.2:2` [built, rank 92] **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
- `EDIT92#open:0` [open, rank 92] **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- `EDIT92#open:1` [open, rank 92] **D67, D68, D70** stand.

# Decisions
- D65 (CLOSED): Story length: 27 tiles × 3 = 81 bodies · options: Keep; `story.tileWriteOffs` 2; 3 only on each district's last tile · notes: **Closed 28 October:** a count per tile, 62 in all (row 463)
- D67 (OPEN): Story length: 35 bodies certify the city once the tracks pace it · options: Keep; raise story prices; pay credits for counted bodies only · notes: Raised 28 October (row 466)
- D68 (OPEN): Pushes (Arms) are not capped by `proto.bounce.maxThrow` · options: Keep (the deliberate ricochet); cap them too · notes: Raised 28 October (row 467)
- D70 (OPEN): Parkland B1: no Z0 road under its highway (no drop gap possible); its street, a corner of the boulevard, is empty 67% of the time even at `story.traffic.parkland.B1` 2; its brief needs a cone-baited car · options: A row-1 street A1 → B1 → C1 under the highway; move the cone brief to a busier tile; keep · notes: Raised 28 October (rows 477–478); **eased 29 October:** B1's brief is a raised road, so no cone is needed (row 529). The missing drop gap stands
- D76 (CLOSED): The finale and the reward for clearing: the monument shrouded until B2, its unveiling, the plaque with the run's numbers, the drone to the ship at B3, credits over the voyage; Second Market (the city again, the cars' learning kept) · options: Build all; the unveiling and the ship only; keep the ending screen · notes: Raised 28 October (GDD Edit 92 §3.2); **closed 29 October:** the unveiling and the ship (row 533). Credits and Second Market move to D77
- D77 (OPEN): The rest of the finale: credits over the voyage; Second Market (New Game+: the city again, the cars' learning kept) · options: Build both; credits only; neither · notes: Raised 29 October (row 533)
- D78 (OPEN): Barks that name the tile: new lines in the fleet database, written through the content pipeline (Assignment 4) in each tier's voice; or keep the district · options: Write the lines; keep · notes: Raised 29 October (row 537)

Rows cited by the notes:
| 463 | Write-offs per tile: `story.writeOffs.<district>.<tile>`, 27 IDs, 1–3 each (Monument 17, Parkland 22, Waterfront 23; 62 in all). Retires `story.tileWriteOffs`. Closes D65 | user-decided: "let's tune the write-offs per level tile"; values proposed (assistant) | 1 for a rare brief, 2 to learn a verb, 3 later | — | A1 cleared at 2 |
| 466 | Story tile counts retuned so the upgrade tracks fill only at the end of Waterfront: 35 bodies (Monument 10, Parkland 12, Waterfront 13). Bought as soon as affordable, the last level lands on Waterfront B2's first body | user-decided: "Upgrade tracks fill up only at the end of Waterfront"; counts proposed (assistant), given prices 3, 4, 5 and a credit a body | The economy paces the story | A shorter story (7.1: 62 bodies) (D67) | Fill at body 34 of 35 |
| 467 | The ricochet: the knock keeps `proto.recoilScale` 0.7 of its Newtonian velocity (the rest is damage) and slides at most `proto.bounce.maxThrow` 40. Arcade and Story (P7SIM). Pushes stay uncapped | user-directed: "the dummy gets hurt which means it doesn't get all the momentum … a sensible adjustment"; values proposed (assistant) | A hit throws about a lane, not a screen | Pushes uncapped (D68) | Head-on 98 u/s, 26 units (was 193, 127) |
| 477 | A neighbour with a roundabout runs at the district rate under a tile scale (Parkland B2, C3; Waterfront B2). Out of view, a car stopped `traffic.offscreenCullSeconds` is removed (Edit 63) | proposed (assistant), answering "what if cars get trapped in the roundabout from tiles that can't be seen?" | No ring fills out of sight; no jam survives there | Parkland B1 gains little: its cars come through B2 (D70) | 27 tiles × 2 min: longest stop in view 11 s; 27 culls in 54 min (9 unscaled) |
| 529 | Parkland B1 drops its cone brief for a raised road. Its street stays empty 67% of the time | proposed (assistant) under row 528 | A cone needs a car on the street; the highway always has one | — | Eases D70 |
| 533 | The finale is the unveiling and the ship: the circus's monument shrouded until Waterfront B2 clears; its unveiling, with the plaque showing the run (chassis spent, points, best combo, time); a Farsight drone lifts the dummy over the river to the container ship at Waterfront B3, every crate carrying its face. The ending screen follows | user-decided: "Unveiling and ship" (29 October) | The reward for clearing is seen, not only read | Credits over the voyage and Second Market wait (D77) | Closes D76; GDD Edit 92 §3.2 |
| 537 | R-BARK-TILE rejected: the agent's write replaced the district's name with the tile code in Story barks ("B2. I did not sign up for this."). It met its one probe, not the voice. Reverted; the requirement set to spec none | proposed (assistant, manual review) | Barks are written lines in each tier's voice, with the lore check | Barks still name the district | Raises D78 |

# GDD chunks
### EDIT94#3.2 (rank 94, coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md)
## 3.2 Ending and finale (amends Edit 92 §3.2)
```markdown
- **Shroud:** the circus's monument is shrouded in Story until Waterfront B2 clears (`world.monumentShroud`).
  - A cloth on the statue's own outline. Cosmetic. Arcade's monument stands uncovered.
- **The last write-off:** plays under the cloth (`feedback.writeOffSeconds`). The save is stamped CERTIFIED.
- **The unveiling:** the world holds. A Farsight drone lifts the cloth away (`ui.finale.unveilSeconds`).
- **The plaque:** THE DUMMY MONUMENT · UNVEILED. ZERO ACCIDENTS (EXCLUDING TESTS).
  - Chassis spent, points, best combo, time. From the save: `chassis`, `points`, `bestCombo`, `t`.
  - Best combo: the largest combo of any hit in the story. Older saves load without it.
  - A, or a tap, once the cloth is off: ON TO THE SHIP.
- **The voyage:** a drone lifts the dummy from B2 over the south edge into B3. It sets it down on the container ship.
  - Every crate on the ship carries the dummy's face (`world.storyArt`).
  - Top strip: FARSIGHT DRONE · Carrying the certified model to the ship at B3.
- **Then the ending screen** (built): CERTIFIED, on B3.
- **Reduced motion:** no lift. The plaque shows at once.
- **Open (D77):** credits over the voyage; Second Market.
```

### EDIT92#3.2 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## 3.2 Ending and finale
```markdown
- **Ending screen (built):** CERTIFIED. "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage."
- **Finale (proposed, D76):**
  - The unveiling: the circus's monument, shrouded until B2 clears; the plaque shows the run (chassis spent, points, best combo, time).
  - The drone lifts the dummy over the river to the ship at Waterfront B3; every crate carries its face.
  - Credits over the voyage.
- **What clearing everything gives:** the ending (built); the CERTIFIED save stamp (built, since Edit 81); the unveiling and the plaque; Second Market, the city again with the cars' learning kept (D76).
```

### EDIT94#who-built-what-assignment-5 (rank 94, coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md)
## Who built what (Assignment #5)
| Requirement (the analyst agent) | Coding agent (run 20261029-105801) | Manual review |
|---|---|---|
| R-SHROUD: shrouded until B2 clears | `StorySim.monumentShrouded()`, the cloth sprite, `world.monumentShroud` | Registry entry filed under World |
| R-UNVEIL: the unveiling and the plaque | phase `unveil`, the plaque from the save, `bestCombo`, A continues | The write-off first; the drone lifts the cloth; the plaque in the game's panel, in the field; the device's prompt; a tap |
| R-VOYAGE: the drone to the ship at B3 | phase `voyage`; B2 → B3; then `end('Certified')` | FARSIGHT DRONE on the top strip; · DRONE on the map |
| R-CRATE-FACES: every crate's face | faces on the 24 crates; the ship on the scene (`sc.ship`), which the voyage lands on | — |
| R-BARK-TILE: barks name the tile | the district's name swapped for the tile code | Rejected and reverted (row 537, D78) |

### P7#the-finale-edit-94 (rank 94, prototypes/p7/README.md)
## The finale (Edit 94)
- **Shroud:** Story only, from Waterfront's first tile until B2 clears: a cloth over the statue's own outline, pleated, a darker hem, an aqua cord. Cosmetic.
- **The last write-off** plays as any other (`feedback.writeOffSeconds`), under the cloth. The story is saved complete: the slot reads CERTIFIED.
- **The unveiling** (phase `unveil`): the world holds. A drone lifts the cloth up and away over `ui.finale.unveilSeconds` (1.2 s); a rising chime.
- **The plaque** fades in over the field's foot: THE DUMMY MONUMENT · UNVEILED; ZERO ACCIDENTS (EXCLUDING TESTS); CHASSIS SPENT, POINTS, BEST COMBO, TIME.
  - Its numbers come from the save: `chassis`, `points`, `bestCombo` (every hit's combo, the largest kept), `t`.
- **A** (SPACE, A, or a tap on the plaque) once the cloth is off: ON TO THE SHIP. Presses before that do nothing.
- **The voyage** (phase `voyage`): a drone flies in, lifts the dummy and carries it over B2's south edge into B3. It sets it down on the container ship (`sc.ship`).
  - The ship's 24 crates each carry the dummy's face: two eyes and a smile (`world.storyArt`).
- **Then the ending screen,** CERTIFIED, on B3. **Reduced motion:** no lift; the plaque shows at once.
- **Arcade:** no shroud, no finale. 6.10's rules: no monument, no ship.
![P7.13: the circus's monument, shrouded until B2 clears](docs/p713_shroud.png)
![P7.13: the cloth lifts](docs/p713_unveil_lift.png)
![P7.13: the plaque](docs/p713_unveil.png)
![P7.13: the drone carries the certified model to the ship](docs/p713_voyage.png)
![P7.13: set down on the ship, every crate with its face](docs/p713_ship.png)

### EDIT92#3 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
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

### EDIT94#open (rank 94, coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md)
## Open
- **D77:** credits over the voyage; Second Market.
- **D78:** barks that name the tile.
- **D70, D67, D68** stand.

### P7#known-gaps (rank 94, prototypes/p7/README.md)
## Known gaps
- Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- Points are a score only; nothing yet ranks or grades a tile (Edit 90's grade is open).
- At 1 health after a miss, any hit to the brief ends the chassis; the floor makes a tile in test a long life.
- Three slots, in this browser only: no cloud save, no export. A 7.7 save's credits are ignored; a 7.8–7.9 save keeps the upgrades it bought.
- A slot's time stamp is the browser's local time.
- Barks still name the district, not the tile. Naming it needs written lines in the fleet database (D78); the agent's word swap was rejected (Edit 94).
- Short Arcade districts buy few parts: Parkland's 2 write-offs, 2 credits.
- No credits over the voyage, no Second Market (D77).
- Parkland's visitors and Chassis 0 live in the tales, not on screen.
- Parkland B1: no road under its highway, a street empty 67% of the time (D70). Its brief is now a raised road (Edit 93).
- Battery 3 fits on the last tile: the faster recharge serves one tile, the circus.
- Tile scales raise culls out of view: 27 in 54 min of soak (9 at 1). The player never sees them.
- Touch layout: one saved layout a browser, as fractions of the screen; a phone turned between screen shapes keeps the fractions. A placed control can cover a panel (the player's choice).
- The diamond moves and sizes as one; its four buttons do not separate.

### EDIT92#open (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## Open
- **D76:** the finale (unveiling, plaque, drone to the ship, credits) and Second Market.
- **D67, D68, D70** stand.

### P7#evidence~2 (rank 94, prototypes/p7/README.md)
- `node test_p713.js docs` → 103/103.
  - Edit 94, content: `world.monumentShroud` (registry 0, P7SIM 1); `ui.finale.unveilSeconds` 1.2 s, the gift screen's hold. Registry `edit94` (507 entries).
  - Edit 94, headless: Waterfront A1 and B2 in test shrouded; Arcade uncovered; 6.10 no monument. The B2 clear: `writeoff` › `unveil`, the save complete, one `unveil` event; the plaque from the save (chassis 34, points, ×5 beating a saved ×4, time). The unveiling holds the world. A: the voyage, inbound › lift › carry › in › drop, set down on the ship at (400, 574) in 6.3 s; then Certified on B3. 24 crates, each with the face; 6.10 no ship. Arcade: no unveiling, no voyage.
  - Edit 94, page: B2 in test, shrouded; the last write-off plays; the cloth lifts (SPACE too early does nothing); the plaque; the save CERTIFIED; SPACE: FARSIGHT DRONE · Carrying the certified model to the ship at B3; the ship; CERTIFIED. Phone: a tap on the plaque goes on to the ship.
  - The coding agent's own probes (`coder/state/requirements.json`): 11 requirements; 6 met, 5 blocked (D77 twice, D70, no spec twice: the tile grade, and R-BARK-TILE, rejected in review, D78).
- Prototype 7.12's checks, carried over:
  - Edit 93, content: all 11 parts by drone, each once, a track in order: Battery 1 Monument B1 #2, Hands 1 A2 #6, Legs 1 B3 #8, Arms 1 Parkland C1 #10, Legs 2 A3 #14, Hands 2 A2 #15, Arms 2 A1 #16, Battery 2 B2 #18, Legs 3 Waterfront B1 #20, Arms 3 B3 #24, Battery 3 B2 #27. No brief needs a part not yet issued; each verb's first brief is its drone's tile. 34 bodies.
  - Edit 93, headless: struck in B1 (it wants a dash) holds at 1, losing 29 of 30; a dash into a parked sedan clears B1; the drone to C1 brings nothing; C1 asks for a drop. Monument C3 resumes with Legs 1 and Hands 1, no push: THROWN INTO A CAR. Parkland C1 brings Arms 1 and asks for a push. Waterfront B2 brings Battery 3 and certifies with all 11.
  - Edit 93, page: the drone to B1 brings Battery 1 (the gift screen, A held); B1's card: DASH INTO A CAR; a dash clears B1; C1's card: DROP ONTO A CAR, no part; a reload: 1 / 11 PARTS.
- Prototype 7.11's checks, carried over:
  - Edit 92: Narrative A in the content (three acts, 27 titles and tales with no exclamation marks, the longest 217 characters, the ending); the story's tile art changes no solid, floor, stair, spawn or cone home on any tile, and draws on nine: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3. In the page: the title (P7.11); the ship and a customs post in Arcade's Waterfront.
- Prototype 7.10's checks, carried over:
  - Edit 91, content: registry `edit91` (5 IDs added; `story.level.*`, `arcade.giftEvery` retired).
  - Edit 91, headless: Story starts on foot (A denied, 1 charge, 500 health); Arcade ships with Battery 1. Battery 2 two charges; Battery 3 0.6 s. Struck on foot clears A1; the report: 0 / 11 parts, next Battery 1 at B1; no shop; the drone brings Battery 1 (500 → 800). Nothing for sale in Story; a million points fit nothing. A 7.9 save receives its cleared tiles' parts. The DUMMY MONUMENT stands in Waterfront B2 (none in 6.x worlds). Arcade: a credit buys Legs 1, then Hands 1; no drone.
  - Edit 91, page: POINTS small, top right; BODY, the field and the chassis on one top edge; in A1 on foot: Controls MOVE · ??? · ???; the chassis reddened by part, six numbers, 306 tall; the report straight to the Battery 1 drone; the monument in Waterfront B2, solid; Arcade's workshop opens on Legs (1 credit). On the S25 the buttons read nothing in A1; the touch flow taps the report and the gift.
  - Edit 90: one charge left, dash then B: a dash jump in Story and Arcade, denied under 6.10's rules; Hands 1: a tap picks up, a tap away from cones puts down (6.10 keeps the hold).
  - Touch (Edit 89): a stylus phone turns touch on at the first touch; then by taps alone: ARCADE, a district, ▶, B, STORY, NEW GAME, OK, a tile, DEPLOY, the card, ❚❚, Options, Back, Resume, the report, the gift.
  - Save games (Edit 88): STORY opens the save screen, three empty slots; NEW GAME names slot 1; a reload offers the latest slot first ("2 / 27 TILES · … · 2 / 11 PARTS"); CONTINUE resumes. 7.6's story moves into slot 1. The grid types a name; OVERWRITE, RENAME, ERASE ask twice; ESC cancels. Touch: NEW GAME, keys, the phone's keyboard, OK; RENAME.
  - Earlier checks kept: orders, neighbours, tales, briefs possible where set; the ricochet; fences; the ferry; the gift phase; resume with a part owed; Monument → Parkland; Edit 85's 15 highways, drop gaps and cone homes; tile density; 6.4–6.10 and 7–7.11 byte-identical.
  - Phones: 16:9 (640 × 360) and the S25 Ultra (892 × 412): everything inside the 16:9 frame by default; the ❚❚ chip pauses; Adjust layout drags the stick and the diamond into the margins (the diamond, larger now that the chassis panel ends higher, stops at the canvas edge); + SIZE ×1.20; DONE saves; a reload keeps it; Reset restores it. No page errors.
- `../p6/test_p610.js` → 47/47 (6.10's rules on the shared code). `../p6/test_sim.js` → 104/104. `../p6/test_p6.js` → 72/73 (Parkland's street-emptiness limit, as on 6.4).
- `../jump/test_jump.js` → 28/28. `../controls/test_controls.js` → 34/34.

### P7#save-games-edit-88 (rank 94, prototypes/p7/README.md)
## Save games (Edit 88)
| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a row | arrows | stick or d-pad | stick, or tap |
| Choose an action | left, right | stick or d-pad | tap |
| Select | SPACE | A | A, or tap |
| Back | SHIFT or ESC | B | B |
- **Rows:** NEW GAME; slots 1–3 (`story.saveSlots`). The cursor starts on the latest save.
- **A slot card:** number, name, time stamp (DD MON YYYY · HH:MM, local); IN PLAY on the slot in play.
  - "MONUMENT · C2 · TILE 4 OF 27". "3 / 27 TILES · 2,450 POINTS · 3 / 11 PARTS · CHASSIS 04".
- **CONTINUE:** the story map of that slot. **RENAME:** the name entry; the time stamp stays. **ERASE:** A twice.
- **NEW GAME:** the first empty slot, then its name. None empty: choose a slot; OVERWRITE asks twice.
- **Name entry:** `story.saveNameMax` (12) characters, upper case: A–Z, 0–9, space, - . '. The default (TEST DUMMY n) is selected: typing replaces it.
  - Keys: type it; Enter OK; Backspace deletes; Esc cancels. Pad and stick: the grid; A types; B deletes (empty: cancels); START OK.
  - Touch: tap the grid's keys; tap the name for the phone's own keyboard.
- **Stored** in this browser: `dummies.p7.save1`–`3`. 7.6's `dummies.p7.story` moves into slot 1 once and stays for 7.1–7.6.

### EDIT93#open (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## Open
- **D76:** the finale and Second Market.
- **D70:** eased. Parkland B1's missing drop gap stands.
- **D67, D68** stand.

### P7#highways-and-cones-edit-85-both-modes (rank 94, prototypes/p7/README.md)
## Highways and cones (Edit 85, both modes)
- **Every highway has a flight** (`world.deckFlightsMin` 1). Waterfront's bridges: one each, from the beach (A2 west, C2 east).
- **Every highway breaks its parapet over each Z0 road beneath** (`world.deckDropGaps`): one `world.tileSize` module on the road's centre line, south or east (the other side where a flight stands). Drawn lit: white snapped ends, a cyan edge. Walk off it and drop onto the road.
  - Parkland B1's highway crosses no road: no gap (D70).
- **Cones:** on the pavement beside a road, never on it; never under a highway, ring or walkway, never behind a building (`props.cone.minVisible` 0.9).

### EDIT92#3.1~2 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
| # | Tile | Title | Brief | Part | Tale |
|---|---|---|---|---|---|
| 1 | Monument A1 | The welcome wall | Any | — | A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME. Farsight is pleased to have you. Your first duty is simple: stand in the road until a colleague notices you. |
| 2 | Monument B1 | The podium bridge | Drop | Battery 1 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for shoppers who never came; it now serves as an observation deck for staff. Observe a car from above, then join it. |
| 3 | Monument C1 | The LED drum | Jump | Legs 1 | The drum lights each bend before a car reaches it, so no colleague is ever surprised. Today you will surprise one. Legs 1 is fitted for the purpose. Your enthusiasm will be noted in your file. |
| 4 | Monument C2 | The portal tower | Raised road | — | The high road runs through this tower at the sixth floor. The tenants say the traffic is good company. Today your duty is on the road itself, at height. The view is not part of the job. |
| 5 | Monument B2 | The monument | Struck | — | The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data. |
| 6 | Monument A2 | The neon shops | Cone | Hands 1 | The shops under the highway sell nothing. Their signs flash prices at the traffic, which reads every word. Hands 1 is fitted, so you can place a cone. Colleagues are trained to respect cones. Use this. |
| 7 | Monument A3 | The stacked cubes | Combo ×2 | — | Each cube was added as the budget arrived, one quarter at a time, each leaning further than the last. Farsight calls this growth. Today's duty is the same: one hit, then another before the first is forgotten. |
| 8 | Monument B3 | The LED canyon | Jump | — | Two screens face each other across the road and advertise to each other all night. The skybridge was added so that someone would watch. You are now someone. Jump into a car between the screens. |
| 9 | Monument C3 | The LED gateway | Push | Arms 1 | The gateway thanks every car for driving safely. It thanked the last one seconds after that car wrote you off. Your file is updated: ROLE: DESTRUCTIVE TESTING. Arms 1 is fitted. Push off one colleague into the next. |
| 10 | Parkland C1 | The lantern pavilion | Drop | Battery 2 | The paper lantern was the Expo's first exhibit, and it is lit again for the visitors. Battery 2 is fitted: a second charge. Farsight calls it safety equipment. Drop onto a car from the footbridge. |
| 11 | Parkland C2 | The amphitheatre | Van | — | Farsight's board will watch from these terraces on opening day. The seats face the avenue, so every crossing is a performance. A van delivers the catering. Arrange for it to deliver you. |
| 12 | Parkland C3 | The arch and the roundabout | Thrown | — | The arch is the Expo's gate. Visitors will circle the roundabout once before they enter, which gives the cars time to learn them. You go round faster. Be thrown into a car while the last one still throws you. |
| 13 | Parkland B3 | The obelisk court | Police | — | The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first. |
| 14 | Parkland A3 | The belvedere | Jump | Legs 2 | A wedding is booked on the belvedere for opening day. The couple asked for a view of the traffic. Legs 2 is fitted: longer in the air. Land on a car here, so that no guest ever does. |
| 15 | Parkland A2 | The dome by the canal | Raised road | — | The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. On opening day the visitors will look up at the highway. Be on it. |
| 16 | Parkland A1 | The reservoir terraces | Push | Arms 2 | The gardener keeps the three pools level by hand. She has asked that the cars learn to stop before the water. Arms 2 is fitted: a stronger push. Teach them by hitting one car into the next. |
| 17 | Parkland B1 | The cascade | Cone | Hands 2 | The cascade steps the reservoir's water down beside the highway, pool by pool. It was built to drown out the traffic. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops. |
| 18 | Parkland B2 | The ring over the pools | Combo ×3 | — | Inspection day. The board watches the ring. When the cars come round clean, the board applauds the cars. Farsight notes that the public prefers the product to the test. Give the board a chain of three. |
| 19 | Waterfront A1 | The west portal | Bus | Battery 3 | The upper town houses the engineers, and the bus carries them to the bridge. Battery 3 is fitted: a faster recharge. Farsight requires the bus fleet's data before anyone crosses the river. |
| 20 | Waterfront B1 | The tunnel portal | Jump | Legs 3 | The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs 3 is fitted: the longest flight. Where your data goes after the tunnel is not within your role. |
| 21 | Waterfront C1 | The east portal | Police | — | The east bridge was built a year after the west, to correct its mistakes. Its portal block faces the other way and pretends not to know its twin. The police here check papers. Yours are being prepared. |
| 22 | Waterfront C2 | The east beach terrace | Drop | — | The terrace was built for tourists, then joggers, then sensors. From its rail you can see the ships in the estuary and the cranes that load them. Drop onto a car below. The ships will wait. |
| 23 | Waterfront C3 | The east customs post | Thrown | — | The pier tower is a customs post. It logs everything that floats on the river: containers, ducks and, so far, one dummy, inbound. Be thrown into a car. Customs is watching. |
| 24 | Waterfront B3 | The stilt houses | Push | Arms 3 | The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come. |
| 25 | Waterfront A3 | The west customs post | Raised road | — | The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road. |
| 26 | Waterfront A2 | The west beach terrace | Cone | — | The valley began here: a cliff, an avenue, and a beach of sand brought from three provinces. The ceremony is being prepared in the circus. Place a cone. Farsight would like one more clean reading before the speeches. |
| 27 | Waterfront B2 | The circus | Combo ×3 | — | Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). One last chain of three certifies the city. And you. |

### P7#files~2 (rank 94, prototypes/p7/README.md)
- **`dummies_p7_13.html`:** the game. Open in a browser; no server.
- **Live (GitHub Pages):** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-5/ (game), `/jump/`, `/controls/`, `/p7-12/` (Prototype 7.12), `/p7-11/` (Prototype 7.11), `/p7-10/` (Prototype 7.10), `/p7-9/` (Prototype 7.9), `/p7-8/` (Prototype 7.8), `/p7-7/` (Prototype 7.7), `/p7-6/` (Prototype 7.6), `/p7-5/` (Prototype 7.5), `/p7-4/` (Prototype 7.4), `/p7-3/` (Prototype 7.3), `/p7-2/` (Prototype 7.2), `/p7-1/` (Prototype 7.1), `/p7/` (Prototype 7), `/p6-10/` (Prototype 6.10).
- **`p7_13_page.html`:** the same page for Claude's hosted preview (touch and keys; no gamepads).
- **`dummies_p7_12.html`:** Prototype 7.12 (Edit 93). Frozen.
- **`dummies_p7_11.html`:** Prototype 7.11 (Edit 92). Frozen.
- **`dummies_p7_10.html`:** Prototype 7.10 (Edit 91). Frozen.
- **`dummies_p7_9.html`:** Prototype 7.9 (Edit 90). Frozen.
- **`dummies_p7_8.html`:** Prototype 7.8 (Edit 89). Frozen.
- **`dummies_p7_7.html`:** Prototype 7.7 (Edit 88). Frozen.
- **`dummies_p7_6.html`:** Prototype 7.6 (Edit 87). Frozen.
- **`dummies_p7_5.html`:** Prototype 7.5 (Edit 86). Frozen.
- **`dummies_p7_4.html`:** Prototype 7.4 (Edit 85). Frozen.
- **`dummies_p7_3.html`:** Prototype 7.3 (Edit 84). Frozen.
- **`dummies_p7_2.html`:** Prototype 7.2 (Edit 83). Frozen.
- **`dummies_p7_1.html`:** Prototype 7.1 (Edit 82). Frozen.
- **`dummies_p7.html`:** Prototype 7 (Edit 81). Frozen.
- **`story.js`:** Story mode. `StorySim` extends the P6 player sim (`../p6/world6.js`): start tile, fences, the brief and its miss floor, clears, the drone ferry, the eleven parts by drone (Edit 91), each on the tile that first tests it (Edit 93). `ArcadeSim`: one district a run, Battery 1 fitted, parts for credits. `P7SIM`, the P7.2 physics for both modes. Runs headless in Node.
- **`../../content/story/story.json`:** the story's content (Narrative A, Edit 92): the acts, the order of tiles, 27 titles and tales, Farsight's briefs and gifts (paced by Edit 93), the ending. Numbers are registry IDs.
- **`../../content/story/narratives_proposal.md`:** the three proposals and the tile audit (Edit 91); A chosen.
- **`../p6/game.js`, `../p6/world6.js`, `../p6/sim.js`:** the shared game code: the title, the story map, the tile card, fences, the gift screen, the story's HUD.
- **`build.py`:** `python3 build.py` → both pages. `../p6/build.py` refuses: 6.10 is frozen.
- **`test_p713.js`:** `node test_p713.js [screenshot folder]` → the checks; screenshots into the folder.
- **`../../coder/`:** the coding agent that built Edit 94's finale (Assignment #5): `python3 coder/coder.py --plan` from the repository root.

### P7#story~2 (rank 94, prototypes/p7/README.md)
- **Order** (user-decided). Tile names are column-row: A1 is top left.
  - Monument: A1, B1, C1, C2, B2, A2, A3, B3, C3. The snake road.
  - Parkland: C1, C2, C3, B3, A3, A2, A1, B1, B2. With the highways, ending on the ring.
  - Waterfront: A1, B1, C1, C2, C3, B3, A3, A2, B2. Round the valley, ending at the circus.
- **A tile:** `story.writeOffs.<district>.<tile>` counted write-offs clear it (table below).
  - A write-off counts when its last hit meets the brief. Otherwise it scores and counts for nothing.
- **Open tiles:** the cleared ones and the tile in test. Edges between open tiles are open.
- **Fences:** every edge toward a tile not yet open. They hold walking, dashes, jumps and throws.
  - Drawn as a yellow glow along the screen's edge, as in Zelda. Nothing stands across a road.
  - Cleared tiles stay open. Walk back through them; write-offs there score only.
- **The ferry:** after a clear, a Farsight drone flies in for the new chassis. It carries it over the edge into the next tile.
  - It sets it down off the road, within `story.ferryDepth` (160) of the edge it crossed, nearest the crossing.
  - Then the next tile's card. A1 to B1: about 5 s. Not between districts.
- **Parts** (Edit 91): all eleven by drone, each on a fixed tile (the table's last column). Nothing is sold; there are no levels.
  - Introduce, then test (Edit 93): each part lands on the tile whose brief first needs it. Act I issues 3, Act II 5, Act III 3.
  - The ferry drone into a part's tile carries the module under it. It hovers, lowers it on a cable, and the gift screen opens.
  - A continues; the drone lifts the dummy and carries it across. A1 to B1 with Battery 1: about 5 s in all.
  - A save resumed with a part owed: a drone delivers it, leaves, then the tile card. A 7.9 save gets its cleared tiles' parts.
  - The report goes straight to the next chassis: PARTS n / 11, and the next part with its tile.
- **On foot** (Edit 91): A1 is played without the dash (Battery 0), at `damage.bodyHealthOnFoot` (500). Battery 1 arrives with the drone to B1, whose brief is the dash (Edit 93).
- **A miss holds at 1** (Edit 91): in the tile in test, a hit that would write the chassis off but misses the brief leaves `story.missFloor` (1). The hit scores; play goes on. Only a hit to the brief writes it off.
- **Points** are the score. No credits in Story. Arcade keeps `economy.creditsPerWriteOff` and `economy.price.ability.level1`–`level3` (1, 2, 3).
- **No clock:** a district's traffic runs `story.shiftCars` (5,000) cars. No Failed test.
- **Traffic per tile** (Edit 85): `story.traffic.<district>.<tile>` × the district's density, on the tile in test and its four neighbours; the rest of the district at 1.
  - A neighbour with a roundabout stays at 1 (Parkland B2, C3; Waterfront B2).
  - Cars still enter the view only across its edges. Out of view, a car stopped `traffic.offscreenCullSeconds` (12 s) is removed.
  - Scales above 1: Monument A1 1.5, B1 1.75, C3 1.5 (Edit 93); Parkland C1 1.75, C2 1.75, B3 1.25, A3 2, A2 1.5, B1 2, B2 1.25; Waterfront B1 1.5, C2 1.5, A2 1.5.
- **The map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength. The cursor reads any revealed tile's tale.
- **Saved** into the slot in play after every count, clear, gift and purchase. A reload: STORY, CONTINUE resumes the tile in test.
- **The acts** (Edit 92): Monument ACT I · INDUCTION, Parkland ACT II · OPENING DAY, Waterfront ACT III · CUSTOMS. The act line opens each district's first card.
- **The end:** clearing Waterfront B2, the circus, certifies the Test City. The finale (Edit 94): the write-off, the cloth lifted off the DUMMY MONUMENT, its plaque, the drone to the ship at B3, then the ending (Edit 92): the model passes, to be manufactured; a market far away.

### P7#hud-story~2 (rank 94, prototypes/p7/README.md)
- **One top edge** (Edit 87, 91): BODY, the field's bezel and the chassis start level. POINTS small in the top-right corner, on the strip with the objective. No CARS LEFT (no clock).
- **Left column** (Edit 86–87): BODY (as tall as DASH: the number on its label's row, the bar beneath), DASH, the district map. No FARSIGHT wordmark in play.
- **Right column** (Edit 91): the chassis, each part reddened by its damage, its number beside it (head and torso on the part, arms and legs in the margins); LAST HIT on one row. No rows of effects. Desktop: the key panel at the foot; DASH there once Battery 1 is fitted.
- **DASH box:** NOT FITTED until Battery 1. **Toast** on a miss of the brief: "Not the brief: chassis held at 1".
- **District map:** titled [MAP] · [TILE] and the level off the ground. Uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength.
- **Top strip** (Edit 87): the objective, e.g. "OBJECTIVE · C1 · Write off a body. Last hit: drop onto a car (0 of 1)." A toast takes it while it lives. With a drone: "Bringing Battery 1, then on to B1." The voyage: "Carrying the certified model to the ship at B3." Arcade: the quota and the next verb.
- **Touch** (Edit 87): ❚❚ PAUSE and ⤢ FULL small, top left. The stick under the map; the Y X B A diamond under the chassis.
  - Pause › Controls › Adjust layout: drag either anywhere, the side margins of a wide phone included; − SIZE / + SIZE (0.6–1.6×); RESET; DONE. Saved in this browser.
- **Speech bubbles:** car barks sit on the cars again, legible in the frame layer. Speech solid, shout doubled, mutter dashed, thought dotted.
- **Tile card** on arrival: the tile's number of 27, its title, its tale, the brief and its count, the verb it brought. A begins.
- **Report:** counted or not, and why; PARTS n / 11 and the next part's tile (Edit 91). Then the next chassis.
- **Workshop** (Edit 89): Arcade only since Edit 91. The next chassis, large; Battery, Legs, Hands, Arms around it, wired to their seats. Pips, now, next, cost. FIT, DONE.
- **Pause** (ESC, START, ❚❚): Resume · Story map · Options · Controls · Show trace · Quit to title. The tile's count is kept; the body in play is lost.
  - Options: Sound · Palette (reloads; the story saves first) · Full screen · Tuning panel · Gamepad setup · Back.
  - Controls: the device in hand. Keyboard: WASD/arrows, Space/K, L/Shift, J/E, I/Q, Esc/P, T, G. Gamepad: stick, A, B, X, Y, Start, hold Start. Touch: stick, A, B, X, Y, ❚❚, ⤢; Adjust layout · Reset layout · Back. A verb not yet fitted reads ??? (Edit 90), the dash included (Edit 91).
- **Touch buttons** (Edit 90): menus: A OK, B BACK. Play: the verb once fitted (A DASH, B JUMP, X GRAB or DROP, Y PUSH); unfitted: the letter alone, dimmed.
- **Tuning (T):** `proto.recoilScale`, `proto.bounce.maxThrow`, `story.ferryDepth`, `economy.creditsPerWriteOff`, `story.missFloor`, `damage.bodyHealthOnFoot`, `abilities.battery.dashCharges`, `ui.gift.fallSeconds`, `ui.gift.holdSeconds`, `ui.finale.unveilSeconds`, `story.task.comboEasy`, `story.task.comboHard`, the 27 `story.writeOffs.<district>.<tile>`, the 27 `story.traffic.<district>.<tile>`. From the next deploy.

### EDIT93#9 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## 9 Progression (amends Edit 91 §9)
```markdown
- **Rule — introduce, then test:** a part arrives on the tile whose brief first needs it.
  - No brief needs a part not yet issued.
  - Battery 1 → a dash. Legs → a jump. Hands → a cone. Arms → a push. Battery 2, 3 → a combo ×3 (`story.task.comboHard`).
- **Act I · Monument:** Battery 1 B1 · Hands 1 A2 · Legs 1 B3. Three verbs: dash, cone, jump.
- **Act II · Parkland:** Arms 1 C1 · Legs 2 A3 · Hands 2 A2 · Arms 2 A1 · Battery 2 B2. The push, then a level on every verb.
- **Act III · Waterfront:** Legs 3 B1 · Arms 3 B3 · Battery 3 B2. The last part on the last tile.
- **Pace:** 3 · 5 · 3 parts by act. All 11 at tile 27 (7.11: tile 24).
- **Every jump and push tile brings a level.** Cone tiles: Monument A2 and Parkland A2 bring one; Waterfront A2 uses Hands 2.
- **Unchanged:** every part by drone, with the gift screen; no levels; points are the score; A1 on foot (`damage.bodyHealthOnFoot`).
```
| Part | 7.11 | 7.12 | First brief that needs it |
|---|---|---|---|
| Battery 1 | Monument B1 #2 | Monument B1 #2 | B1 dash |
| Hands 1 | Monument A2 #6 | Monument A2 #6 | A2 cone |
| Legs 1 | Monument C1 #3 | Monument B3 #8 | B3 jump |
| Arms 1 | Monument C3 #9 | Parkland C1 #10 | C1 push |
| Legs 2 | Parkland A3 #14 | Parkland A3 #14 | A3 jump |
| Hands 2 | Parkland B1 #17 | Parkland A2 #15 | A2 cone |
| Arms 2 | Parkland A1 #16 | Parkland A1 #16 | A1 push |
| Battery 2 | Parkland C1 #10 | Parkland B2 #18 | B2 combo ×3 |
| Legs 3 | Waterfront B1 #20 | Waterfront B1 #20 | B1 jump |
| Arms 3 | Waterfront B3 #24 | Waterfront B3 #24 | B3 push |
| Battery 3 | Waterfront A1 #19 | Waterfront B2 #27 | B2 combo ×3 |

### EDIT93#3.3 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
## 3.3 Briefs (amends Edits 81–82)
```markdown
- **DASH INTO A CAR** (new, `dash`): "Coverage gap: dashes. The final hit must be a dash into a car."
  - Met when the fatal hit lands while the body is dashing. A dash jump counts as a jump.
  - Set once: Monument B1, the tile that issues Battery 1.
- **Miss floor:** unchanged (`story.missFloor`). Struck standing in B1 holds at 1.
```

### ENG#10.4~1 (rank 29, content/kb/DUMMIES_V29_Engineering_Spec.md)
### 10.4 Stage closing and checkpoint continuation
The one-stage slice has no mid-run save. Pause offers Quit to last checkpoint with exact loss disclosed, or End run/Cancel if none exists. Save and quit is immediate only at `READY_FOR_NEXT_STAGE`; Continue is hidden without a valid compatible checkpoint. Terminal results create no continuation checkpoint.
For a nonterminal stage quota/final-condition event, first complete its entire collision tick under §8.4. Then enter `STAGE_CLOSING`:
1. Cut new admissions. Mark the remaining outgoing-stage slots explicitly `cancelled-stage-complete`, not admitted, exited or failed opportunities. This cancellation is permitted only after that stage's displayed contract is complete.
2. Freeze dummy controls, health, charge and refill-delay state. End transient action/gesture state. Resolve any held cone by §8.5. After the completed collision tick, visibly withdraw the test subject into the noninteractive report phase and remove its traffic collider; this is an explicit completed-stage transition, not an invisible escape during active play. Wreck/debris is visual only. If a new body is due, defer instantiation until the later replacement step.
3. Existing traffic drains under normal collision-safe traffic rules. Traffic and a closing timer advance; body/resource clocks remain paused. No damage, score, learning, credits or additional write-offs can be earned during closing. No new vehicle appears. Preserve physical safety and prop conservation. Existing cars must leave legally, not disappear to manufacture throughput.
4. Attempt bounded safe traffic recovery when blocked. If traffic/reservations/pending releases remain after `run.stageClosingTimeout` (trial 30 s), end as a technical interruption, without creating a checkpoint. This is a test failure, not a permitted routine shortcut.
5. Once clear, complete the single combined report/purchase flow, replace a written-off body if due, and normalise outgoing props into the outgoing-stage ledger before unloading that completed world. No props transfer or duplicate into the next stage; its own authored prop IDs are stage-qualified. Preserve surviving health/charge/refill delay; clear velocity, action, attachment and carried-prop state identically in uninterrupted/restored paths.
6. Enter `READY_FOR_NEXT_STAGE` before any incoming vehicle is admitted. Save a complete validated snapshot atomically. Restore into paused review; only explicit Resume begins the next stage. Mark continued runs separately for records.

### ENG#9.4 (rank 29, content/kb/DUMMIES_V29_Engineering_Spec.md)
### 9.4 Records and eligibility
A score category identifies profile/version, effective gameplay configuration, applicable build compatibility, ending class and continuation status. Licensed completions, explicit Non-compliant withdrawals and failed tests are separate categories; an incomplete farming run must not displace a completed run. Within a comparable category, sort points descending, then active simulation time ascending. Retain total interaction time separately for experience analysis.
Fresh uninterrupted approved runs are ranked separately from continued runs. Practice and debug runs are unranked. Applying a tuning change or debug grant permanently invalidates that run's ranked eligibility, even if the value is reverted. Developer controls stay out of the visitor flow. Accessibility settings that do not change gameplay can remain in the same category; settings that change timing or physics require an explicit category rule.
Store configuration identity with each record. A changed profile archives or separates earlier scores; it does not relabel them as comparable. This is local score integrity, not a claim of cheat-proof security. Initials entry is optional and must not obstruct replay or the visitor reset.

### ENG#6.5 (rank 29, content/kb/DUMMIES_V29_Engineering_Spec.md)
### 6.5 Recurrence, moods and voice
The slice schedule is eight repetitions of **Sedan–Van–Sedan–Sedan–Van**: 40 possible appearances, 24 Sedan and 16 Van. The initial nominal admission interval is 12 active simulation seconds. The first due appearance is at stage start; legal admission can be delayed by an occupied entrance. Admission means creation at the validated 200-unit off-screen lead-in, not arrival at the visible edge. At unimpeded cruise, nominal lead-in travel is about 1.45 s for Sedan and 1.67 s for Van; turning, braking and initial footprint placement can add time. Scheduled, admitted and exited counts are distinct. A successful early ending cancels the unused remainder. No quota implies that all 40 must appear.
The schedule is deterministic and part of the versioned profile. For slot `i`, admission cannot precede `max(12 × i, previousActualAdmission + 12)` and still requires safe entry; the first slot has no previous-admission constraint. A due appearance waits for safe entry, avoiding a burst after a blockage. No opportunity disappears while queued. The last nominal admission is at 468 s (39 intervals), not 480 s. This is neither a minimum session length nor a ten-minute completion guarantee: success can cancel most of the queue. Interval, approach geometry and delay are jointly tested for ten-minute pacing and recurrence before minute five. In the unobstructed sequence, the next Sedan slot is 12–24 s later and the next Van slot 24–36 s later; the first new snapshot admitted after a learning event is the relevant return, not an already admitted car.
The same model should visibly respond to an earlier successful approach while the visitor is still playing. Standard mood removes a major confound. Additional moods are expansion content and must specify independent behaviour effects, legible cues and exact roster allocation or a declared statistical tolerance. A population percentage alone does not guarantee that a short run contains a mood.
Barks may express corporate confidence, embarrassment or bureaucratic blame. They cannot assert facts the simulation did not establish. The first report may state the observed impact and model identity, but it withholds the explanatory learned-counter message until the player has encountered the changed return. Evaluation asks the player what changed before supplying that explanation. Later reports may make the adaptation explicit.

### P7#arcade (rank 94, prototypes/p7/README.md)
## Arcade
- **One district a run.** Its quota of write-offs: Licensed. Traffic: one density per district (`world.district.<id>.interval`).
- **Parts for credits** (Edit 91): a credit a body (`economy.creditsPerWriteOff`); level 1 of any part 1 credit, level 2 2, level 3 3. Nothing comes by drone.
  - The chassis ships with Battery 1 (the dash). The workshop opens after the report, on the first part the credits buy.
- **Top strip:** the quota, e.g. "Write off 3 bodies (0 of 3)."

### EDIT92#3.1~3 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
- **Renamed (D75):** Monument A1 The LED wall → The welcome wall; A2 The neon arcade → The neon shops; Parkland A2 The canal → The dome by the canal; Waterfront C3, A3 The east, west pier tower → The east, west customs post.
- **Briefs, parts, write-offs, order:** unchanged (Edits 82–91).

### P7#story/the-27-tiles~2 (rank 94, prototypes/p7/README.md)
| # | District | Tile | Title | Brief: the last hit | Write-offs | Part by drone |
|---|---|---|---|---|---|---|
| 1 | Monument | A1 | The welcome wall | ANY WRITE-OFF | 1 | — |
| 2 | Monument | B1 | The podium bridge | DASH INTO A CAR | 1 | Battery 1 (the dash) |
| 3 | Monument | C1 | The LED drum | DROP ONTO A CAR | 1 | — |
| 4 | Monument | C2 | The portal tower | ON A RAISED ROAD | 1 | — |
| 5 | Monument | B2 | The monument | STRUCK, NOT DASHING | 1 | — |
| 6 | Monument | A2 | The neon shops | CONE-BAITED CAR | 1 | Hands 1 (cones) |
| 7 | Monument | A3 | The stacked cubes | COMBO ×2 | 1 | — |
| 8 | Monument | B3 | The LED canyon | JUMP INTO A CAR | 1 | Legs 1 (jump) |
| 9 | Monument | C3 | The LED gateway | THROWN INTO A CAR | 1 | — |
| 10 | Parkland | C1 | The lantern pavilion | PUSH OFF A CAR | 1 | Arms 1 (push) |
| 11 | Parkland | C2 | The amphitheatre | A VAN | 2 | — |
| 12 | Parkland | C3 | The arch and the roundabout | COMBO ×2 | 1 | — |
| 13 | Parkland | B3 | The obelisk court | A POLICE CAR | 1 | — |
| 14 | Parkland | A3 | The belvedere | JUMP INTO A CAR | 1 | Legs 2 |
| 15 | Parkland | A2 | The dome by the canal | CONE-BAITED CAR | 2 | Hands 2 |
| 16 | Parkland | A1 | The reservoir terraces | PUSH OFF A CAR | 1 | Arms 2 |
| 17 | Parkland | B1 | The cascade | ON A RAISED ROAD | 1 | — |
| 18 | Parkland | B2 | The ring over the pools | COMBO ×3 | 2 | Battery 2 (a second charge) |
| 19 | Waterfront | A1 | The west portal | A BUS | 1 | — |
| 20 | Waterfront | B1 | The tunnel portal | JUMP INTO A CAR | 2 | Legs 3 |
| 21 | Waterfront | C1 | The east portal | A POLICE CAR | 1 | — |
| 22 | Waterfront | C2 | The east beach terrace | DROP ONTO A CAR | 2 | — |
| 23 | Waterfront | C3 | The east customs post | THROWN INTO A CAR | 1 | — |
| 24 | Waterfront | B3 | The stilt houses | PUSH OFF A CAR | 1 | Arms 3 |
| 25 | Waterfront | A3 | The west customs post | ON A RAISED ROAD | 2 | — |
| 26 | Waterfront | A2 | The west beach terrace | CONE-BAITED CAR | 1 | — |
| 27 | Waterfront | B2 | The circus | COMBO ×3 | 2 | Battery 3 (a faster recharge) |
- **Write-offs** (Edit 83, 93): Monument 9, Parkland 12, Waterfront 13: 34 bodies (7.11: 35; 7.1: 62).
- **Every brief is possible where it is set.** Checked from 90 s of traffic per district: the class runs there; raised traffic for "on a raised road"; a raised floor over traffic for a drop; cones for a cone brief.
- **Introduce, then test** (Edit 93): each part on the tile whose brief first needs it. Battery 1 on the dash tile; each Legs level on a jump tile, each Arms level on a push tile, each Hands level on a cone tile; Battery 2 and 3 on the combo ×3 tiles. No brief needs a part not yet issued.

### EDIT93#3.1/tales-rewritten~1 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
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

### EDIT92#7 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## 7 Tile art (amends Edit 91 §3; `world.storyArt` 1 in P7)
```markdown
- **Rule:** cosmetic only. Pixels on sprites already placed; flat marks on the ground; props never solid.
  - No solid, floor, stair, spawn or cone home changes (checked on all 27 tiles).
- **Monument A1, the welcome wall:** the LED panel shows the dummy's face in the screen's cyan; WELCOME · NEW STAFF · FARSIGHT.
- **Monument A2, the neon shops:** two shopfronts per block, a lit sign over each (OPEN, SALE; 24H, NEW); neon glow on the pavement.
- **Monument A3, the stacked cubes:** each cube lit on its edges; the roof's front edge brightest.
- **Monument C3, the LED gateway:** two pylons with lit strips; a beam 21 art px deep with chevrons; THANK YOU · DRIVE SAFE along it; its shadow across the lanes.
- **Parkland C1, the lantern pavilion:** a white paper lantern, ribbed, on the pavilion's lawn.
- **Parkland B1, the cascade:** water spilling over each pool's lip; a grated runnel across the path to the next pool.
- **Waterfront A3, C3, the customs posts:** CUSTOMS, lit, on each pier tower's plinth.
- **Waterfront B3:** a container ship moored between the stilt houses: the ship of the finale.
- **Waterfront B2:** the DUMMY MONUMENT (Edit 91).
- **Not drawn:** Parkland's visitors, Chassis 0 (figures would read as targets or obstacles).
```

### EDIT93#3.1 (rank 93, coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md)
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

### P7#story/the-27-tiles~1 (rank 94, prototypes/p7/README.md)
### The 27 tiles

### EDIT92#3.1~1 (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## 3.1 The 27 tiles

### P7#hud-story~3 (rank 94, prototypes/p7/README.md)
![P7.12: B1's card: DASH INTO A CAR, the part just fitted](docs/p712_brief_b1.png)
![P7.12: the drone to B1 brings Battery 1](docs/p712_gift_battery.png)
![P7.12: C1's card: DROP ONTO A CAR, from the high road's gap](docs/p712_brief_c1.png)
![P7.11: the welcome wall greets the new chassis](docs/p711_a1_gap.png)
![P7.11: the tile card: ACT I · INDUCTION](docs/p711_brief.png)
![P7.11: Waterfront B3: the ship that takes the certified model to market](docs/p711_ship.png)
![P7.11: Waterfront A3: the west customs post](docs/p711_customs.png)
![P7.10: Monument A1 on foot: POINTS top right; the chassis reddened by part, its numbers beside it](docs/p710_chassis_red.png)
![P7.10: the drone to B1 brings Battery 1, the dash](docs/p710_gift_battery.png)
![P7.10: the DUMMY MONUMENT on the circus's island](docs/p710_monument.png)
![P7.10: Arcade's workshop: every part for credits; Battery 1 shipped fitted](docs/p710_arcade_workshop.png)
![P7.8: LEVEL UP across the field; the stats box reads POINTS and LEVEL](docs/p78_levelup.png)
![P7.8: the workshop: the chassis, its parts around it; Battery fits](docs/p78_workshop.png)
![P7.8: Battery 1 fitted](docs/p78_workshop_fit.png)
![P7.8: phone: the workshop by taps](docs/p78_touch_workshop.png)
![P7.8: phone: the story map by taps](docs/p78_touch_map.png)
![P7.7: the save screen, all three slots in use](docs/p77_saves_full.png)
![P7.7: NEW GAME: the name, typed](docs/p77_name_typed.png)
![P7.7: OVERWRITE asks twice](docs/p77_overwrite.png)
![P7.7: phone: the name entry by taps](docs/p77_phone_name.png)
![P7.7: the story map, headed with the slot](docs/p77_map.png)
![P7.6: one top edge: BODY, the field, POINTS · CREDITS; the objective on the top strip](docs/p76_a1_gap.png)
![P7.6: S25 Ultra (19.5:9): the 16:9 frame centred, the controls in it by default](docs/p76_s25.png)
![P7.6: Adjust layout: the stick and the diamond dragged into the margins](docs/p76_s25_edit.png)
![P7.6: the buttons at 120%](docs/p76_s25_edit_size.png)
![P7.6: in play with the player's layout](docs/p76_s25_custom.png)
![P7.6: a 16:9 phone: the small chips top left](docs/p76_phone169.png)
![P7.5: a clean screen: BODY as tall as DASH, no row under the stage](docs/p75_a1_gap.png)
![P7.5: Pause › Options](docs/p75_options.png)
![P7.5: Pause › Controls, keyboard](docs/p75_controls_keys.png)
![P7.5: Pause › Controls, gamepad](docs/p75_controls_pad.png)
![P7.5: phone, Pause › Controls](docs/p75_phone_controls.png)
![P7.4: Monument A1: the highway's parapet open over the road, lit](docs/p74_a1_gap.png)

### DESIGN#D10.2 (rank 29, content/kb/DUMMIES_V29_Design.md)
### D10.2 Reference layout and palette — Trial (§4.2)
Reference canvas: 1280×720. Reference play viewport: 800×600, centred. Side columns: 240×600 each. Top and bottom strips: 1280×60 each. The playfield occupies approximately 52% of the canvas.
The layout is a trial composition. Test a reduced frame at the same world extent before changing the simulation's dimensions. A 4:3 field reduces directional warning asymmetry compared with a wider field; it does not make all approach distances equal. Render scaling must not change simulation units.
| Role | Initial colour | Use |
|---|---|---|
| Floor | `#EDF1F3` | Matte laboratory street ground |
| Grid | `#D4DDE2` | Calibration pattern, subordinate to cues |
| Structure | `#B8C4CB` | Barriers and fixed forms |
| Fleet | `#7E8C96` | Vehicle mass and ordinary lane geometry |
| Dummy body | `#F5C542` | Persistent actor accent |
| Dummy joints | `#1A1D1F` | Facing/body articulation |
| Primary cue | `#101417` | Reflex information and outlines |
| Secondary cue | `#4A5A66` | Planning information |
| Warning | `#E4442E` | Reserved warning marks with independent shape/position |
| Brand aqua | `#4FC3E8` | Frame and menu accents |
These values are starting colours, not measured contrast results. Tier-1 contrast starts with a 4.5:1 target and tier 2 with 3:1, evaluated against actual overlapping backgrounds. A coloured warning can require a contrasting outline to meet its role. The colour itself is never the only carrier.

### P7#the-gift-screen-edit-84 (rank 94, prototypes/p7/README.md)
## The gift screen (Edit 84)
- **In the field:** the drone flies high with an aqua case under it, pulsing. A chime as it comes in. It hovers and lowers the case onto the dummy.
- **The screen:** the world holds. The chassis at four times art scale, dimmed; brackets pulse on the module's seat.
  - A drone brings the module down over the head and lets go. It falls onto its part over `ui.gift.fallSeconds` (0.7 s), glowing, trailing.
  - It lands: the chassis lights up; the module flashes white; a ring, sparks and turning rays; a shake; one white flash.
  - Sound (original): a whoosh as it falls, a thud, a rising D-major arpeggio, a held chord over the root, a sparkle.
  - Then NEW PART FITTED: the name pops in; the button and its verb; what it does; NEXT FROM FARSIGHT: the next part, its district and tile (Edit 91).
- **A** after `ui.gift.holdSeconds` (1.2 s): "A ON TO B1" in a ferry, "A CONTINUE" otherwise. Mashed presses before that do nothing.
- **Reduced motion:** no fall, shake or turning rays. The module fades in.

### EDIT92#measured (rank 92, coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md)
## Measured
| Check | Result |
|---|---|
| Solids, floors, stairs, spawns, cone homes, with and without the art | identical on all 27 tiles |
| Tiles the art draws on | 9: Monument A1, A2, A3, C3; Parkland C1, B1; Waterfront A3, C3, B3 |
| Longest tale | 217 characters: four lines on the card |
| Tile card, Monument A1 | ACT I · INDUCTION · MONUMENT · TILE A1 · 1 OF 27; The welcome wall; the act line; the tale |
| Story map | I · MONUMENT, II · PARKLAND, III · WATERFRONT |

### EDIT94#measured (rank 94, coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md)
## Measured
| Check | Result |
|---|---|
| Waterfront A1 and B2 in test | shrouded; Arcade uncovered; 6.10 no monument |
| The B2 clear | `writeoff` → `unveil`; the save complete; one `unveil` event |
| The plaque, saved 33 chassis, 412,350 points, ×4, 5,420 s | chassis 34, points 414,850, ×5 (the last hit), time from the save |
| The unveiling | holds the world; SPACE before the lift ends does nothing |
| The voyage | inbound › lift › carry › in › drop; set down on the ship at (400, 574) in 6.3 s |
| The ship | 24 crates, each with the face |
| Phone | a tap on the plaque goes on to the ship |

# Probe APIs
```
The coding agent's probe harness: runs "sim" probes headless in Node against the game's own modules.
Usage: node coder/harness.js probes.json [--check]
  probes.json: [{ id, expr }]. expr is the body of an async function of H; it returns true/false or { ok, detail }.
  --check: compile each expr only.
Prints one JSON line per probe: { id, ok, detail, error, ms }. A thrown error is a probe defect, never a pass or a fail.

H, the harness API (this block is what the analyst and the coder are shown):
  H.STORY, H.W6, H.X          the game modules: prototypes/p7/story.js, prototypes/p6/world6.js, prototypes/p6/sim.js
  H.REG                       every default the Story runs with (sim.js REG, PROTO, OVERRIDES, world6 P6SIM, story P7SIM)
  H.reg(id)                   the registry entry for id from content/params/tuning.parameters.json, or null
  H.progress(d, t, o)         a saved story with every tile before district d's tile t cleared; t in test.
                              o.tileWO: write-offs already counted on t. Any other key of o is copied onto the progress
  H.story(d, pr)              a StorySim for district d and progress pr; its traffic removed (only H.car cars appear)
  H.arcade(d)                 an ArcadeSim (Arcade, one district). H.sim6(d): a 6.10 Sim6 (the frozen rules)
  H.car(s, cls, x, y, h, v)   a test car (class cls, heading h radians, speed v) that joins s's view
  H.settle(s)                 steps s through hitstop, scroll and writeoff phases
  H.ready(s)                  brings s to phase 'play': delivers an owed part (the gift screen continued), continues the card
  H.kill(s, hit)              writes the chassis off by a crafted last hit (default { kind: 'dash', cls: 'sedan', combo: 1 }),
                              then checkTerminal and settle. Returns s
  H.next(s)                   the report, then the next chassis (continueReport, leaveShop)
  H.step(s, n, cmd)           n frames of input cmd (default {}), settling after each
  H.runTo(s, pred, n)         steps s until pred(s) or n frames (default 2400); returns pred(s)
  H.ev(s, type)               s's events of that type
  H.scene(s, tile)            the scene of tile ('B2') in s's district: props, dummyMonument, game (floors, statics)
  H.certify(o)                Waterfront B2 in test with the other 26 tiles cleared and one write-off left; its part
                              delivered, its card continued, then the last write-off (combo 5). Returns the sim at once.
                              o: as H.progress (e.g. { points: 123456, chassis: 40, t: 3600 })
  H.src(path)                 a repository file's text (path from the repository root)

Sim facts (the shapes probes read):
  s.phase                     'brief' · 'play' · 'gift' · 'hitstop' · 'scroll' · 'writeoff' · 'report' · 'shop' · 'next' · 'ending'
  s.run.ending                null, or an object: { kind: 'Certified' | 'Licensed' | 'Failed test' | 'Non-compliant', t, writeOffs, points }
  s.story                     Story's progress object: district, done, tileWO, owned, points, chassis, writeOffs, t, gifts, complete
  s.events                    [{ t, type, ...data }] in order; s.emit(type, data) adds one. H.ev(s, type) filters them
  s.screenName()              the tile on screen ('B2'); s.sc its scene; s.levelId the district; s.storyMode true in Story
  s.body                      { x, y, mode ('idle', 'lunge', 'jump', 'rescue', …), alive, health, hits: [{ kind, cls, combo, … }] }
  s.rescue                    a drone at work, or null: { phase, ferry, gift, tile, drone: { x, y, alt, state } }
  s.report.story              after a Story write-off: { counted, cleared, next, districtDone, storyDone, parts, nextGift }

The coding agent's page harness: runs "page" probes in the built game (Playwright Chromium, 1300 × 900).
Usage: node coder/page.js probes.json build.html [shots folder]
  probes.json: [{ id, expr }]. expr is the body of an async function of G; it returns true/false or { ok, detail }.
Prints one JSON line per probe: { id, ok, detail, error, ms, errors }. A thrown error is a probe defect.
Every probe also fails if the page threw an error while it ran.

G, the page API (each probe gets a fresh page):
  G.open()                    loads the build; resolves on the title screen
  G.openStory(pr)             seeds save slot 1 with progress pr, then STORY › CONTINUE › DEPLOY; delivers an owed part
                              and continues the tile card; resolves at phase 'play'
  G.certifyProgress(o)        the progress H.certify uses: Waterfront B2 in test, 26 tiles cleared, one write-off left
  G.lastWriteOff(hit)         in the page: the chassis written off by a crafted last hit (default a dash, combo 5)
  G.eval(fn, arg)             page.evaluate(fn, arg). window.__dummies is the app (screen, sim, story, slot);
                              window.__dummiesUI the test hooks (hud(), objective(sim), saves(), gift())
  G.waitFor(fn, ms, arg)      polls fn in the page until it returns truthy; resolves true, or false after ms
  G.press(key), G.wait(ms)    a key press (Space is A, Shift is B, Escape pauses); a pause
  G.shot(name)                a screenshot into the run's shots folder
  G.errors                    page errors so far
  G.page                      the Playwright page
```

# The code
## Files
- `prototypes/p7/story.js`: 398 lines
- `prototypes/p6/game.js`: 3314 lines
- `prototypes/p6/world6.js`: 2425 lines
- `prototypes/p6/sim.js`: 3670 lines
- `prototypes/p6/pixel.js`: 1149 lines
- `prototypes/p6/lab.js`: 354 lines
- `prototypes/p6/circus_valley.js`: 372 lines
- `prototypes/p6/content.js`: 3 lines
- `prototypes/jump/jump.js`: 53 lines
- `prototypes/controls/pads.js`: 98 lines
- `prototypes/p7/build.py`: 31 lines
- `prototypes/p7/shell.html`: 121 lines
- `content/story/story.json`: 115 lines
- `content/params/tuning.parameters.json`: 12477 lines

## Registry
507 IDs (edit94-2026-10-29); 431 read by the game's sources.

## P7SIM flags (story.js): the P7-only values both modes run
{"proto.recoilScale": 0.7, "proto.bounce.maxThrow": 40.0, "world.deckDropGaps": 1.0, "world.deckFlightsMin": 1.0, "props.cone.minVisible": 0.9, "battery.dashJumpCost": 0.0, "abilities.hands.tapDrop": 1.0, "proto.batteryModel": 1.0, "world.dummyMonument": 1.0, "world.storyArt": 1.0, "world.monumentShroud": 1.0}

## Sim phases the code compares against
away, brief, carry, drop, ending, gift, give, hitstop, in, inbound, lift, next, play, report, scroll, shop, sink, unveil, voyage, writeoff

## Events the code emits
admit, chassis, combo, combo-end, commit, cone-hit, cone-release, cone-rest, cone-stop, cone-struck, contact-ignored, credit, debug-credit, debug-module, deck-drop, delivered, denied, drone-dispatch, drone-drop, drone-pickup, drop, ending, exit, gift, gridlock, gridlock-clear, held, hitch, honk, impact, interrupt, jump, jump-land, knock, land, learn-standoff, level, lunge, milestone, pickup, punt, purchase, purchase-denied, push, rail-jump, release, rescued, resume, ring, road-cleared, screen, shop-open, shop-skip, skid, sling, slip, splash, stair, story-clear, story-deliver, story-enter, story-fence, story-ferried, story-ferry, story-gift, throw, touch, touch-spent, unstick, unveil, voyage, voyage-end, writeoff

## content/story/story.json
Top-level keys: meta, ending, tasks, classes, districts; a district: id, name, act, intro, order, tiles; a tile: title, task, gift, tale
ending: 'Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.'

## Outlines (line ranges, kind, name)
prototypes/p6/game.js (3314 lines)
      9-9     arrow    INFO
     34-34    const    TOUCH
     35-42    function resize
     57-57    const    HITS
     58-58    function hitbox
     59-59    function uiTap
     65-65    arrow    okProgress
     66-66    arrow    slotCount
     67-67    arrow    nameMax
     68-68    arrow    defaultName
     69-69    function readSlot
     71-71    function writeSlot
     72-72    function eraseSlot
     73-73    function allSlots
     74-74    function saveStory
     75-75    function loadSlot
     77-79    function moveOldStory
     80-80    const    MON
     81-81    function stamp
     82-82    const    FIELD
     84-88    function preview
     90-90    arrow    clamp
    100-100   const    CPARAM
    103-109   function pv
    110-113   function jv
    114-114   function fillIn
    115-115   function place
    116-119   function copy
    130-130   function kick
    131-136   function shakeOffset
    137-142   function puff
    143-147   function mix
    144-144   arrow    h
    150-153   function startLevel
    154-179   function startLevelNow
    181-181   function startStory
    182-182   function toStoryMap
    183-183   function titleItems
    186-189   function toSaves
    190-190   arrow    slotActs
    192-192   const    NAME_ROWS
    193-193   arrow    nameKeyOf
    199-199   arrow    cleanName
    202-202   function nameStart
    203-203   function nameCancel
    204-204   function nameFocus
    206-206   function nameType
    207-207   function nameDel
    208-213   function nameDone
    214-214   function nameOk
    215-223   function nameMenu
    224-241   function savesMenu
    275-275   function clearEdges
    276-276   function inUI
    306-306   arrow    radial
    312-312   const    PAD_NAME
    313-338   function pollPad
    339-345   function moveVec
    346-351   function buildCmd
    357-357   const    FACE
    358-358   const    FACE_NODE
    359-365   function touchDevice
    362-362   arrow    mm
    366-374   function touchOn
    375-378   function fullscreen
    376-376   arrow    lock
    384-384   function saveTouchCfg
    385-403   function touchLayout
    404-407   function touchLayoutCss
    408-408   arrow    inChip
    409-435   function touchEvent
    437-440   function editBar
    441-460   function touchEditEvent
    443-443   arrow    put
    461-466   function touchEditSize
    467-467   function touchEditStart
    468-468   function touchEditEnd
    469-479   function drawTouchEdit
    471-471   arrow    ring
    480-487   function stickAt
    488-492   function touchDirs
    495-503   function faceWord
    504-542   function drawTouch
    510-510   arrow    glow
    511-511   arrow    disc
    568-568   const    THEME_NAME
    570-570   const    LEVEL6
    572-572   arrow    maxHP
    573-573   const    DENY_TEXT
    577-596   function juice
    598-598   const    SENIORITY
    599-599   function seniorityOf
    600-602   function trackCars
    603-603   function upm
    604-616   function whenOk
    618-631   function enrich
    633-639   function present
    640-644   function carGap
    645-671   function deriveCases
    672-677   function noteContact
    680-689   function contactOf
    683-683   arrow    eff
    690-735   function hitJuice
    736-741   function brokenPart
    744-773   function barkLine
    752-752   const    SIT
    754-754   arrow    spec
    775-780   function wrapSmall
    783-822   function drawBarks
    794-794   arrow    hits
    811-814   arrow    ring
    823-950   function processEvents
    953-953   function giftChime
    954-962   function giftFanfare
    964-964   function horn
    965-965   function dashify
    966-966   function toast
    970-970   const    PAUSE_STORY
    971-971   arrow    pauseItems
    972-972   const    END_ITEMS
    976-976   arrow    nextLevel
    977-977   arrow    NODE
    978-978   arrow    nodeDesc
    979-1088  function handleMenus
   1093-1093  const    TY
   1110-1113  function rr
   1114-1116  function txt
   1117-1118  arrow    h
   1117-1117  function rgba
   1118-1118  function roleC
   1119-1133  function panel
   1134-1138  function glassKey
   1139-1139  function fmtT
   1140-1140  function num
   1141-1146  function wrapLines
   1147-1151  function wrapText
   1152-1161  function drawKeys
   1170-1170  arrow    ALL
   1171-1171  arrow    toA
   1172-1172  arrow    EXT
   1174-1212  function levelArt
   1179-1179  arrow    zL
   1180-1187  arrow    roofSpec
   1188-1202  arrow    sprite
   1203-1203  arrow    deckAt
   1204-1204  arrow    blockOf
   1213-1213  function flush
   1214-1214  function carSpr
   1215-1215  function shortId
   1216-1216  function coneLift
   1217-1225  function coneFn
   1226-1226  function rotRect
   1227-1227  function arcPoly
   1228-1228  function mixOnce
   1230-1245  function corridorPts
   1246-1267  function blindSpots
   1248-1257  arrow    add
   1255-1255  arrow    far
   1269-1288  function drawZones
   1275-1275  arrow    open
   1286-1286  arrow    inSensor
   1289-1307  function drawPath
   1309-1321  function drawStopCue
   1322-1326  function drawViewEdges
   1328-1338  function markCar
   1339-1345  function drawMarks
   1347-1347  arrow    carsOf
   1348-1348  arrow    lay
   1349-1349  arrow    zLift
   1350-1350  function bodyFloor
   1351-1351  function onFloor
   1352-1352  function onDeck
   1353-1353  function onGroundDraw
   1354-1354  function stairDeck
   1355-1360  function cueLevel
   1361-1368  function cueDeck
   1369-1375  function bodyLift
   1376-1376  function deckOf
   1377-1377  function carShadow
   1378-1392  function dynShadows
   1380-1380  arrow    off
   1393-1398  function dropK
   1399-1408  function reachEnd
   1410-1430  function drawBodyGround
   1431-1453  function drawBodySprite
   1456-1465  function drawNose
   1460-1460  arrow    add
   1466-1478  function drawCarSprite
   1472-1472  arrow    roof
   1480-1494  function pip
   1495-1504  function drawCarMarks
   1507-1511  function tagRect
   1512-1527  function drawTag
   1528-1534  function drawDrone
   1538-1562  function drawDeck
   1566-1593  function drawLights
   1595-1602  function drawBoom
   1603-1631  function drawSprites
   1614-1614  arrow    L
   1632-1634  function relight
   1635-1638  function ghost
   1639-1677  function drawEffects
   1678-1693  function drawRingsStreaks
   1694-1694  const    ROLE_K
   1695-1695  function roleK
   1696-1696  function lowHealth
   1697-1716  function drawParts
   1717-1717  function mixRect
   1718-1726  function drawStamp
   1727-1764  function drawLive
   1734-1738  arrow    cues
   1768-1779  function composeScroll
   1784-1784  arrow    elevOf
   1785-1794  function where6
   1795-1801  function shadows6
   1802-1865  function drawLive6
   1806-1810  arrow    cues
   1812-1812  arrow    into
   1813-1813  arrow    meItem
   1868-1868  const    GIFT_BOX
   1869-1874  function drawGiftBox
   1875-1875  function rescueLift
   1876-1884  function drawRescue6
   1885-1891  function drawLoading
   1892-1899  function drawField
   1900-1906  function drawField6
   1907-1915  function blitField
   1917-1933  function drawFieldHD
   1936-1936  arrow    kMin
   1937-1946  function liveBark
   1949-1976  function drawBubblesHD
   1952-1952  arrow    toC
   1954-1954  arrow    hit
   1979-2000  function objective
   2001-2049  function drawMessages
   2008-2008  arrow    fit
   2021-2021  arrow    widthOf
   2022-2022  arrow    lineW
   2025-2025  arrow    fits
   2029-2029  arrow    clip
   2030-2043  arrow    drawItem
   2051-2051  function roadLabel
   2052-2072  function drawFrame
   2075-2095  function playKeys
   2096-2109  function drawKeysPanel
   2110-2110  const    WHERE6
   2112-2115  function whereOf
   2116-2116  function fitTextR
   2117-2117  function fitNumR
   2118-2118  function fitText
   2119-2128  function drawScore
   2129-2141  function drawTopBar
   2143-2171  function drawHUD
   2177-2177  const    MAP_Z
   2180-2183  function mapGeom
   2184-2205  function mapRoads
   2186-2186  arrow    off
   2206-2221  function mapCanvas
   2222-2259  function drawDistrict
   2261-2261  const    PART_NAME
   2263-2267  function partLevels
   2272-2284  function dollMods
   2282-2282  arrow    own
   2285-2293  function dollCanvas
   2294-2306  function partEffects
   2310-2310  const    PART_TAG
   2311-2311  function partReds
   2312-2312  function redText
   2313-2341  function drawBodyPanel
   2344-2344  function veil
   2345-2354  function menuList
   2355-2355  function difficultyHealth
   2356-2361  function endItems
   2362-2362  function quotaOf
   2363-2388  function drawTitle
   2391-2391  arrow    plural
   2392-2396  function storyCursor
   2397-2402  function giftText
   2403-2425  function drawModeTitle
   2428-2432  function slotLines
   2433-2477  function drawSaves
   2478-2483  function nameKeyRects
   2484-2505  function drawNameEntry
   2506-2561  function drawStoryMap
   2521-2521  arrow    at
   2562-2580  function drawBrief
   2585-2590  function sprCanvas
   2591-2604  function giftArtOf
   2597-2597  arrow    mk
   2605-2605  function giftReady
   2606-2673  function drawGiftPopup
   2609-2609  arrow    clamp01
   2674-2681  function drawBriefFoot
   2682-2697  function drawMapFences
   2684-2684  arrow    open
   2685-2685  arrow    seen
   2698-2698  arrow    c32
   2699-2699  const    FENCE
   2700-2709  function drawStoryFence
   2703-2703  arrow    at
   2710-2737  function drawReport
   2738-2777  function drawShop
   2780-2780  const    BADGE
   2782-2799  function abilityStats
   2800-2851  function drawAbilityShop
   2852-2852  const    PART_WORD
   2856-2856  const    WS_POS
   2858-2863  function seatOf
   2864-2864  arrow    wsLocked
   2865-2865  arrow    wsCost
   2866-2872  function wsMove
   2873-2936  function drawWorkshop
   2887-2887  arrow    seatAt
   2938-2963  const    CUE_KEY
   2944-2963  function cueCanvas
   2948-2948  arrow    car
   2949-2949  arrow    loc
   2964-2973  function drawCueKey
   2977-2977  arrow    deviceOf
   2978-2983  function optionItems
   2984-2991  function optionDo
   2992-2992  arrow    controlItems
   2993-3008  function controlRows
   2995-2995  arrow    nm
   3009-3023  function drawControls
   3024-3042  function drawPause
   3043-3058  function drawEnding
   3060-3067  function render
   3071-3071  function unveilK
   3072-3072  function unveilReady
   3073-3079  function shroudLift
   3080-3094  function drawUnveil
   3095-3115  function renderScreen
   3118-3118  const    MOVE_NAME
   3119-3130  function drawComboMeter
   3131-3138  function drawPadSetup
   3141-3183  const    TUNE
   3191-3195  function current
   3196-3200  function setParam
   3201-3246  function buildTune
   3247-3255  function syncTune
   3256-3256  function toggleTune
   3267-3271  function showTrace
   3275-3275  arrow    done
   3281-3281  function appStatus
   3284-3305  function frame

prototypes/p6/world6.js (2425 lines)
     19-19    const    P6SIM
     29-29    arrow    EXT
     32-32    const    CON
     37-37    arrow    apronOf
     42-54    function capture
     55-55    arrow    captureRect
     57-57    function each
     58-58    function walk
     59-74    function clipRun
     72-72    arrow    onScreen
     75-75    arrow    shift
     76-76    arrow    chamf
     77-77    function lawn
     78-81    function pathLine
     82-84    function tiles
     85-94    function pool
     96-96    const    HG
     98-98    arrow    hsh
     99-99    arrow    hedgeC
    100-100   arrow    lawnC
    101-101   const    TURF
    102-102   arrow    turfC
    103-103   arrow    mossC
    104-133   function mass
    134-134   function block
    137-137   arrow    paveC
    138-138   arrow    slabC
    139-139   arrow    diagC
    144-144   arrow    onPath
    146-146   arrow    pathMX
    147-147   arrow    pathMY
    148-162   function gardenPave
    158-158   arrow    on1
    163-171   function drawBed
    177-177   const    MED
    178-178   const    GREAT
    179-182   function smallPlanter
    186-186   const    PROG
    187-187   const    PAV
    188-192   function jet
    193-203   function shellSprite
    195-195   arrow    put
    204-212   function towerSprite
    206-206   arrow    put
    213-219   function domeSprite
    215-215   arrow    put
    220-223   function lawnPanel
    224-228   function parterre
    229-233   function fountainCell
    234-240   function plazaCell
    241-245   function fountainSmall
    246-262   function pavilion
    263-265   function cellRect
    266-325   function gardenPlan
    268-268   arrow    okR
    283-283   arrow    gapW
    292-292   arrow    touch
    326-329   function gardenSculptures
    333-404   function brutal
    336-336   arrow    put
    337-337   arrow    half
    351-351   arrow    inV
    352-352   arrow    darker
    353-362   arrow    face
    363-379   arrow    drawVol
    380-384   arrow    shadeRoof
    405-416   function brutalShadow
    407-407   arrow    fp
    417-421   function monolith
    422-426   function planter
    429-438   function sculpture
    431-431   arrow    R
    439-439   function bollard
    442-449   function sculptureCourt
    450-450   const    SCULPT
    452-456   function escalators
    457-457   arrow    stairProp
    459-462   function ringRoutes
    463-502   function ringLayer
    467-467   arrow    inArc
    503-513   function straightDeck
    517-529   function deckDropGaps
    519-519   arrow    opened
    520-520   arrow    crossings
    531-534   function deckFlight
    536-541   function apronMat
    548-572   function walkGaps
    554-554   arrow    clear
    576-610   function walkwayLayer
    580-580   arrow    gapAt
    586-586   arrow    out
    587-587   arrow    edgeOf
    612-621   function drawMonument
    623-628   function splitRoad
    629-642   function paintSplit
    647-647   arrow    fil
    648-648   arrow    loop2
    649-667   const    DISTRICTS
    685-685   arrow    TILE
    691-700   function polyMask
    702-706   const    HILL_SOLID
    707-707   arrow    WROAD
    708-708   const    BRIDGE_GAPS
    709-709   const    WATER
    719-722   function flight
    723-731   const    WSTAIRS
    732-732   arrow    lvl0
    733-733   const    SAND
    735-745   function terraceSprite
    737-737   arrow    put
    747-760   function stiltSprite
    749-749   arrow    put
    762-773   function portalSprite
    764-764   arrow    put
    775-848   function waterPre
    818-818   arrow    box
    850-887   function waterTile
    890-913   function dummyStatue
    892-892   arrow    at
    893-893   arrow    tone
    896-896   arrow    put
    897-900   arrow    box
    914-921   function dummyMonument
    924-937   function shroudSprite
    940-940   arrow    ART
    941-941   arrow    onSpr
    942-942   arrow    lumOf
    943-952   function welcomeWall
    953-961   function shopSigns
    962-966   function cubeRim
    963-963   arrow    at
    967-983   function gatewayLayer
    979-979   arrow    vtext
    984-992   function lanternSprite
    993-997   function falls
    998-1000  function runnel
   1001-1006  function customsSign
   1008-1023  function containerShip
   1026-1036  function sceneSim
   1038-1043  function labSim
   1045-1055  function junctionArms
   1057-1081  function vDeck
   1083-1089  function gridLines
   1092-1106  function alignFlights
   1108-1118  function holeOpenings
   1119-1123  function vEscalators
   1121-1121  arrow    at
   1125-1129  function waterBlock
   1131-1140  function cubeStack
   1141-1149  function poolFP
   1150-1154  function ledPanel
   1155-1161  function drum
   1157-1157  arrow    put
   1162-1167  function billboard
   1169-1307  function buildScreen
   1176-1176  const    RBS
   1178-1178  const    ANG
   1191-1191  arrow    lvl
   1231-1231  arrow    rd
   1232-1232  arrow    roadOk
   1274-1274  arrow    blocked
   1275-1275  arrow    underDeck
   1276-1276  arrow    inRects
   1277-1277  arrow    free
   1309-1317  function diagRoads
   1318-1384  function parkTile
   1323-1323  arrow    free
   1324-1324  arrow    okP
   1328-1328  arrow    piece
   1329-1338  const    SP
   1348-1348  arrow    cas
   1374-1374  arrow    tb
   1386-1441  function monumentTile
   1387-1387  arrow    u
   1444-1464  function chongqing
   1465-1501  function monumentCentre
   1467-1467  arrow    sq
   1471-1472  arrow    diag
   1481-1481  arrow    laneD
   1485-1485  arrow    okP
   1506-1506  arrow    inR
   1507-1515  function polyDist
   1516-1524  function mergeRects
   1525-1525  arrow    rectFloor
   1526-1531  function deckFloor
   1532-1538  function ringFloor
   1534-1534  arrow    inArc
   1541-1550  function coneShows
   1551-1604  function gameData
   1583-1583  arrow    offPoly
   1584-1584  arrow    ground
   1585-1585  arrow    pick
   1589-1589  arrow    score
   1609-1609  arrow    horizE
   1610-1610  arrow    edgePt
   1611-1611  arrow    edgeRect
   1612-1612  function groundFree
   1615-1615  const    INW
   1616-1621  function arrives
   1622-1622  arrow    cpZone
   1623-1623  function runsOf
   1624-1704  function edgePass
   1627-1627  arrow    pre
   1631-1640  arrow    plantFlags
   1711-1711  arrow    hashId
   1712-1712  arrow    NOOP
   1713-1717  function quiet
   1718-1765  function linkWorld
   1725-1725  arrow    add
   1735-1735  arrow    outside
   1741-1741  const    SD
   1766-1771  function recOf
   1772-1776  arrow    routeOf
   1777-1782  function ghostOf
   1783-1792  function seamGhosts
   1794-1801  function trafficTick
   1805-1818  function seamGiveWay
   1819-1857  function stepWorld
   1863-1868  function seen
   1869-1869  function groupCars
   1870-1870  arrow    sameRec
   1871-1875  function roomAt
   1876-1880  function queued
   1881-1890  function spawn
   1891-1914  function manage
   1915-1918  function goLive
   1926-1956  function fillDead
   1930-1930  arrow    mark
   1952-1952  arrow    fp
   1957-1990  function fillPockets
   1959-1959  arrow    link
   1960-1960  arrow    stand
   1967-1967  arrow    gAt
   1968-1968  arrow    fAt
   1986-1986  arrow    fp
   1991-2015  function buildWorld
   2017-2022  function viewCars
   2025-2025  arrow    carKey
   2026-2026  arrow    carSpr
   2028-2062  function compose
   2039-2053  arrow    drawLayer
   2064-2069  function layerOf
   2073-2073  arrow    INFO
   2074-2074  arrow    nameOf
   2075-2410  class    Sim6
   2076-2085  method   Sim6.constructor
   2086-2104  method   Sim6.reset
   2105-2105  method   Sim6.enter
   2106-2106  method   Sim6.screenName
   2107-2107  method   Sim6.buildView
   2108-2108  method   Sim6.carsLeft
   2109-2109  method   Sim6.allCars
   2110-2110  method   Sim6.bodyLayer
   2111-2111  method   Sim6.meets
   2112-2112  method   Sim6.bodyDeck
   2113-2113  method   Sim6.floorOf
   2114-2114  method   Sim6.onGround
   2115-2120  method   Sim6.spawnBody
   2121-2125  method   Sim6.pickSpawn
   2127-2161  method   Sim6.step
   2162-2162  method   Sim6.moveBody
   2163-2163  method   Sim6.bodyControl
   2165-2174  method   Sim6.floorStep
   2175-2186  method   Sim6.stairStep
   2189-2211  method   Sim6.floorMove
   2193-2193  arrow    block
   2212-2220  method   Sim6.neighbourFloor
   2223-2237  method   Sim6.startDrop6
   2227-2227  arrow    plan
   2238-2242  method   Sim6.land
   2245-2257  method   Sim6.startRescue
   2258-2268  method   Sim6.landPoints
   2269-2290  method   Sim6.stepRescue
   2276-2276  arrow    next
   2292-2352  method   Sim6.collideBody
   2296-2296  arrow    block
   2297-2297  arrow    push
   2298-2298  arrow    rect
   2353-2358  method   Sim6.edgeOpen
   2359-2359  method   Sim6.moveCones
   2360-2360  method   Sim6.coneSpotValid
   2361-2361  method   Sim6.dropHeld
   2362-2362  method   Sim6.throwHeld
   2364-2379  method   Sim6.checkFlip
   2380-2380  method   Sim6.canCross
   2381-2381  method   Sim6.edgeLift
   2382-2398  method   Sim6.flip
   2399-2402  method   Sim6.checkTerminal
   2403-2403  method   Sim6.drawDrones
   2404-2409  method   Sim6.trace
   2412-2421  function circleRect

## prototypes/p7/story.js (Story mode), in full
```js
/* DUMMIES P7.3 (GDD Edits 81–84): Story mode, and Arcade's verbs. The Test City, tile by tile: Monument, then Parkland, then Waterfront.
   - A district opens on its first tile (content/story/story.json, `order`). The dummy spawns there.
   - A tile wants story.writeOffs.<district>.<tile> write-offs that meet Farsight's brief: a test on the hit that writes the
     chassis off (Edit 82: a count per tile; only the last hit counts, D66).
   - Edit 83: fences hold every edge toward a tile not yet open; they cannot be jumped. Open tiles: the cleared ones and the
     tile in test. Cleared tiles stay open: walk back through them. Write-offs there score, but count for nothing.
   - Edit 82: every body written off pays economy.creditsPerWriteOff, counted or not. Levels cost story.price.ability.level1–3
     (3, 4, 5): a level-1 power-up is three bodies.
   - Some tiles carry a gift: a verb (an ability's level 1), installed on arrival. Verbs are issued, never sold (Edit 84).
   - Edit 83: a clear calls a Farsight drone. It lifts the dummy, carries it across the edge into the next tile, and sets it
     down off the road near where it crossed (story.ferryDepth). Then the next tile's card.
   - Edit 84: gifts ride in on the drone. The drone that ferries the dummy into a gift tile carries the module in view, lowers
     it onto the dummy (proto.droneLiftSeconds), and the sim pauses in phase 'gift' for the gift screen (continueGift). Then it
     carries the dummy across. Monument: Legs 1 at C1, Hands 1 at A2, Arms 1 at C3.
   - Edit 84: ArcadeSim. One district a run. Edit 91: every part for credits; the chassis ships with Battery 1 (arcade.giftEvery
     retired).
   - Edit 83: P7SIM, the P7.2 values for both modes: the knock keeps proto.recoilScale of the Newtonian velocity and slides at
     most proto.bounce.maxThrow.
   - Edit 89: Story has no credits. Edit 91 (P7.10): no levels either. Every part comes by drone on a fixed tile (story.json
     gifts, eleven in all): Battery 1 (the dash) at Monument B1 ... Arms 3 at Waterfront B3. Points are the score. The dummy starts
     on foot (proto.batteryModel 1: no dash before Battery 1; damage.bodyHealthOnFoot). In the tile in test, a hit that would
     write the chassis off but misses the brief holds it at story.missFloor (hitFloor). Arcade: every part for credits; its
     chassis ships with Battery 1; no drone gifts.
   - The map reveals cleared tiles and the one in test. Progress is one plain object (`progress`), saved by the page.
   Headless in Node: require('./story.js'). In the page: window.STORY. */
(function (root) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  const X = NODE ? require('../p6/sim.js') : root.DUMMIES;
  const W6 = NODE ? require('../p6/world6.js') : root.WORLD6;
  const DATA = NODE ? JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', '..', 'content', 'story', 'story.json'), 'utf8')) : root.DUMMIES_STORY;
  const SIDES = { N: [0, -1], E: [1, 0], S: [0, 1], W: [-1, 0] };
  const nameOf = (c, r) => 'ABC'[c] + (r + 1);
  const cellOf = (t) => ['ABC'.indexOf(t[0]), +t[1] - 1];
  const DIST = DATA.districts, TOTAL = DIST.reduce((a, d) => a + d.order.length, 0);
  const P7SIM = { 'proto.recoilScale': 0.7, 'proto.bounce.maxThrow': 40, // Edit 83: the ricochet the dummy survives; Arcade and Story
    'world.deckDropGaps': 1, 'world.deckFlightsMin': 1, 'props.cone.minVisible': 0.9, // Edit 85: every highway a flight and a drop gap; cones in view
    'battery.dashJumpCost': 0, 'abilities.hands.tapDrop': 1, // Edit 90: a dash's jump is free; X taps a cone down when none is in reach
    'proto.batteryModel': 1, 'world.dummyMonument': 1, // Edit 91: Battery 1 the dash, 2 a second charge, 3 a faster recharge; the circus's monument
    'world.storyArt': 1, // Edit 92: the story's tile art (Narrative A, Certified), cosmetic only
    'world.monumentShroud': 1 }; // Edit 94 (P7.13): the circus's monument shrouded in Story until Waterfront B2 clears (D76)
  const CIRCUS = { district: 'waterfront', tile: 'B2' }; // Edit 94 (P7.13): the monument's tile, the story's last
  const VOYAGE = { district: 'waterfront', tile: 'B3' }; // Edit 94 (P7.13): the stilt houses, where the container ship is moored
  const BASE = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES, W6.P6SIM, P7SIM);

  // ---------- progress: one plain object, JSON-safe
  function newProgress() {
    return { v: 1, district: DIST[0].id, done: {}, tileWO: 0, owned: {}, credits: 0, points: 0, chassis: 0, writeOffs: 0, t: 0,
      gifts: {}, tilePoints: {}, complete: false, bestCombo: 0 }; // Edit 94 (P7.13): bestCombo, optional (old saves load without it)
  }
  const districtOf = (id) => DIST.find((d) => d.id === id) || null;
  const doneIn = (pr, id) => (pr.done && pr.done[id]) || [];
  function activeTile(pr, id) { const d = districtOf(id), dn = doneIn(pr, id); return d ? d.order.find((t) => !dn.includes(t)) || null : null; }
  function clearedCount(pr) { return DIST.reduce((a, d) => a + doneIn(pr, d.id).length, 0); }
  function tileNumber(id, t) { let n = 0; for (const d of DIST) { if (d.id === id) return n + d.order.indexOf(t) + 1; n += d.order.length; } return 0; } // 1–27
  function nextDistrict(id) { const i = DIST.findIndex((d) => d.id === id); return i >= 0 && i + 1 < DIST.length ? DIST[i + 1].id : null; }
  // 'cleared' · 'active' (the tile in test, or open to enter) · 'hidden'
  function tileState(pr, id, t) {
    if (doneIn(pr, id).includes(t)) return 'cleared';
    if (!pr.complete && pr.district === id && activeTile(pr, id) === t) return 'active';
    return 'hidden';
  }
  const tileOf = (id, t) => { const d = districtOf(id); return d ? d.tiles[t] : null; };
  const needOf = (id, t, P) => (P || BASE)['story.writeOffs.' + id + '.' + t]; // Edit 82: write-offs that clear this tile
  // Edit 85: Story's traffic, tile by tile. The tile in test and its four neighbours (its cars come from them) run at
  // story.traffic.<district>.<tile> times the district's density; the rest of the district at 1. A neighbour with a roundabout
  // (a street ring, Parkland's deck ring) stays at 1: a ring at capacity out of sight would only fill and be culled. Cars still
  // enter the view only across its edges, from out of sight
  const trafficOf = (id, t, P) => (P || BASE)['story.traffic.' + id + '.' + t] || 1;
  const hasRing = (sc) => !!(sc.islands || sc.ringSim);
  function storyDensity(pr, id, P) {
    return (sc) => { const t = !pr.complete && pr.district === id ? activeTile(pr, id) : null; if (!t) return 1; const [c, r] = cellOf(t), dd = Math.abs(sc.col - c) + Math.abs(sc.row - r); return dd === 0 || (dd === 1 && !hasRing(sc)) ? trafficOf(id, t, P) : 1; };
  }

  // ---------- the brief: text and test
  function taskText(task, P) {
    P = P || BASE;
    const T = DATA.tasks[task.kind] || DATA.tasks.any, cl = DATA.classes[task.cls] || [String(task.cls || '').toUpperCase(), String(task.cls || '') + ' fleet'];
    const n = task.param ? P[task.param] : null;
    const fill = (s) => String(s).replace('{n}', n).replace('{cls}', task.kind === 'cls' ? cl[0] : '').replace('{clsLong}', cl[1]);
    return { label: fill(T.label), brief: fill(T.brief).replace('a ' + cl[0], (/^[AEIOU]/.test(cl[0]) ? 'an ' : 'a ') + cl[0].toLowerCase()) };
  }
  // hit: the impact event that wrote the chassis off. level: the body's level at that moment.
  function meets(task, hit, level, P) {
    P = P || BASE;
    if (!task || task.kind === 'any') return true;
    if (!hit) return false;
    switch (task.kind) {
      case 'drop': case 'jump': case 'push': case 'bounce': case 'struck': case 'dash': return hit.kind === task.kind;
      case 'level': return (level || 0) >= 1;
      case 'cone': return hit.cause === 'cone';
      case 'combo': return (hit.combo || 1) >= P[task.param];
      case 'cls': return hit.cls === task.cls;
      default: return false;
    }
  }

  // ---------- Edit 84: the parts Farsight issues, in the story's order, and the drone that brings them. Edit 91: all eleven
  const VERBS = (() => { const out = []; for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !out.includes(g.node)) out.push(g.node); } return out; })();
  const VERB_AT = {}; for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !VERB_AT[g.node]) VERB_AT[g.node] = d.name + ' ' + t; } // Edit 91: 'Monument C1'
  // Edit 91: the gifts of tiles already cleared (a save from before Edit 91 catches up), and the next gift on the schedule
  function giftsCleared(pr) { const out = []; for (const d of DIST) for (const t of doneIn(pr, d.id)) { const g = d.tiles[t].gift; if (g && g.node) out.push(g.node); } return out; }
  function nextGift(pr) { for (const d of DIST) for (const t of d.order) { const g = d.tiles[t].gift; if (g && g.node && !(pr.owned && pr.owned[g.node])) return { node: g.node, district: d.id, tile: t, n: tileNumber(d.id, t) }; } return null; }
  const partsOwned = (owned) => VERBS.filter((n) => owned && owned[n]).length;
  // a drone flies in from (hx, hy) to the body; with a gift it lowers the module, installs it and pauses the sim for the gift screen
  function droneTo(sim, hx, hy, opts) {
    const b = sim.body, P = sim.P;
    b.mode = 'rescue'; Object.assign(b, { lunge: null, stair: null, jump: null, z: 0, vx: 0, vy: 0, _spr: null });
    return Object.assign({ t: 0, phase: 'inbound', k: 0, under: 0, up: 0, item: 0, lift: P['proto.droneLiftSeconds'], v: P['proto.droneSpeed'], to: null,
      drone: { x: hx, y: hy, alt: 1, state: 'inbound', rescue: true, hx, hy } }, opts);
  }
  // inbound → give (the module lowers onto the dummy; then phase 'gift') → the ferry's lift, or away
  function stepDelivery(sim, dt) {
    const rs = sim.rescue, b = sim.body, d = rs.drone;
    rs.t += dt; rs.k += dt;
    const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
    const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
    if (rs.phase === 'inbound') { if (fly(b.x, b.y)) next(rs.gift ? 'give' : rs.ferry ? 'lift' : 'away'); return true; }
    if (rs.phase === 'give') {
      rs.item = Math.min(1, rs.k / rs.lift);
      if (rs.item >= 1) { sim.installGift(rs.gift); rs.given = rs.gift; rs.gift = null; next(rs.ferry ? 'lift' : 'away'); sim.phase = 'gift'; } // the gift screen
      return true;
    }
    if (rs.phase === 'away') { // a delivery only: the drone leaves, the dummy is free
      Object.assign(b, { mode: 'idle', vx: 0, vy: 0 }); d.state = 'outbound'; d.alt = 9; (sim.leaving = sim.leaving || []).push(d); sim.rescue = null; // alt 9: the gift drone's hover
      sim.emit('delivered', { node: rs.given || null }); return true;
    }
    return false;
  }

  // ---------- the story's player sim: a Sim6 that starts on the district's tile in test, fences it, and counts the brief
  class StorySim extends W6.Sim6 {
    // progress: newProgress() or a saved one, its district = this district. opts: Sim6's (world, warm)
    constructor(id, overrides, progress, opts) {
      const pr = progress, ov = Object.assign({}, P7SIM, overrides || {}), P0 = Object.assign({}, BASE, ov);
      for (const n of giftsCleared(pr)) pr.owned[n] = true; // Edit 91: a cleared tile's part is on the body
      ov['run.appearances.road'] = P0['story.shiftCars']; // the story has no shift clock: a district's traffic runs for story.shiftCars cars
      for (const L of [1, 2, 3]) ov['economy.price.ability.level' + L] = P0['story.price.ability.level' + L]; // Edit 82: the story's prices, 3, 4, 5
      const carry = { owned: Object.assign({}, pr.owned), credits: pr.credits, points: pr.points, chassis: pr.chassis, writeOffs: pr.writeOffs, t: pr.t, purchases: [], milestones: pr.milestones || {} };
      super(id, ov, carry, Object.assign({}, opts || {}, { startTile: activeTile(pr, id) || districtOf(id).order[0], story: pr, density: storyDensity(pr, id, P0) }));
    }
    reset() {
      super.reset();
      if (!this.W6 || !this.opts || !this.opts.story) return; // the base constructor's first reset, before the world exists
      this.story = this.opts.story; this.storyMode = true;
      this.fenceHit = null; this.storyLast = null;
      const t = this.screenName();
      this.entered = t === activeTile(this.story, this.levelId);
      if (this.entered) this.arrive(t);
      if (this.rescue) { this.pendingBrief = true; this.phase = 'play'; } // a gift still owed: the drone brings it first (Edit 84)
      else this.phase = 'brief'; // the tile card: its tale and Farsight's brief (continueBrief)
    }
    giftOf(t) { const tile = tileOf(this.levelId, t), g = tile && tile.gift; return g && g.node && !this.story.gifts[this.levelId + ':' + t] ? g.node : null; }
    arrive(t) { // the dummy is in the tile in test. A verb not yet delivered comes by drone (Edit 84)
      const pr = this.story, P = this.P, key = this.levelId + ':' + t, tile = tileOf(this.levelId, t), g = tile && tile.gift;
      this.entered = true; this.tilePts0 = this.run.points; this.tileT0 = this.t;
      if (g && g.credits && !pr.gifts[key]) { pr.gifts[key] = true; this.run.credits += P[g.credits]; this.emit('story-gift', { tile: t, credits: P[g.credits] }); }
      const owed = this.giftOf(t);
      if (owed && !this.rescue) { const b = this.body; this.rescue = droneTo(this, b.x, -40, { gift: owed, tile: t }); this.emit('story-deliver', { tile: t, node: owed }); }
      this.syncProgress();
      this.emit('story-enter', { tile: t, n: tileNumber(this.levelId, t), task: tile ? tile.task : null });
    }
    installGift(node) { // Edit 84: the module is on the body. Edit 91: a heavier chassis with the dash keeps its damage
      const t = (this.rescue && this.rescue.tile) || this.screenName(), m0 = this.maxHealth(), b = this.body;
      this.run.owned[node] = true; if (b && b.alive) b.health = Math.min(this.maxHealth(), b.health + this.maxHealth() - m0); this.story.gifts[this.levelId + ':' + t] = true; this.syncProgress();
      this.emit('gift', { node, tile: t }); this.emit('story-gift', { tile: t, node });
    }
    continueBrief() { if (this.phase === 'brief') this.phase = 'play'; }
    continueGift() { if (this.phase === 'gift') this.phase = 'play'; } // Edit 84: after the gift screen
    continueUnveil() { if (this.phase !== 'unveil') return; if (this.unveil) this.unveil.done = true; this.startVoyage(); } // Edit 94 (P7.13): the plaque read, the voyage, then the ending
    // Edit 94 (P7.13): the voyage. A Farsight drone lifts the dummy over the river to the container ship at Waterfront B3 (D76)
    startVoyage() {
      const b = this.body, from = this.screenName(), [c, r] = this.district.cur, [tc, tr] = cellOf(VOYAGE.tile);
      const side = tc > c ? 'E' : tc < c ? 'W' : tr > r ? 'S' : 'N';
      Object.assign(b, { alive: true, health: this.maxHealth(), level: 0, floor: null, held: null, carried: [], gesture: null });
      this.rescue = droneTo(this, b.x, -40, { voyage: true, side, cell: [tc, tr], tile: VOYAGE.tile });
      this.phase = 'voyage';
      this.emit('voyage', { from, to: VOYAGE.tile, side });
    }
    shipPoint() { const P = this.P, sp = this.sc && this.sc.ship; return sp ? { x: sp.x, y: sp.y } : { x: P['world.width'] / 2, y: P['world.height'] / 2 }; } // Edit 94 (P7.13): the ship, or the tile's middle
    stepVoyage(dt) { // Edit 94 (P7.13): inbound → lift → carry over the edge → in to the ship → set down → the ending
      const rs = this.rescue; this.rescue = null; W6.Sim6.prototype.stepRescue.call(this, dt); this.rescue = rs; // the drones already leaving fly on
      rs.t += dt; rs.k += dt;
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], d = rs.drone;
      const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
      const hold = () => { b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; };
      if (rs.phase === 'inbound') { if (fly(b.x, b.y)) next('lift'); }
      else if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.alt = 1; } }
      else if (rs.phase === 'carry') { // over the river, to the edge and across it
        const [sx, sy] = SIDES[rs.side], tx = sx ? (sx > 0 ? W + 2 : -2) : Math.max(40, Math.min(W - 40, b.x)), ty = sy ? (sy > 0 ? H + 2 : -2) : Math.max(40, Math.min(H - 40, b.y));
        fly(tx, ty); hold();
        if ((sx > 0 && d.x > W) || (sx < 0 && d.x < 0) || (sy > 0 && d.y > H) || (sy < 0 && d.y < 0)) {
          d.x -= sx * W; d.y -= sy * H; d.hx -= sx * W; d.hy -= sy * H;
          this.flip(rs.side, rs.cell, null); // the screen moves on to the ship's tile
          rs.to = this.shipPoint(); next('in');
        }
      } else if (rs.phase === 'in') { const arrived = fly(rs.to.x, rs.to.y); hold(); if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, mode: 'idle', vx: 0, vy: 0 });
          d.hx = d.x; d.hy = -40; d.state = 'outbound'; (this.leaving = this.leaving || []).push(d);
          this.rescue = null;
          this.emit('voyage-end', { tile: this.screenName(), seconds: +rs.t.toFixed(2) });
          this.end('Certified');
        }
      }
    }
    // Edit 94 (P7.13): progress.bestCombo, the largest combo of any hit in the story
    noteCombo(c) { const pr = this.story; if (this.storyMode && pr && (c || 0) > (pr.bestCombo || 0)) pr.bestCombo = c; }
    emit(type, data) { const out = super.emit(type, data); if (type === 'impact' && data && data.combo) this.noteCombo(data.combo); return out; }
    step(cmd) {
      if (this.phase === 'brief' || this.phase === 'gift' || this.phase === 'unveil') return; // Edit 94 (P7.13): the unveiling holds the sim
      const voy = !!(this.rescue && this.rescue.voyage); // Edit 94 (P7.13): the voyage runs as the ferry does, the world live, no input
      if (voy && this.phase === 'voyage') this.phase = 'play';
      super.step(voy ? {} : cmd);
      if (voy && this.phase === 'play' && this.rescue && this.rescue.voyage) this.phase = 'voyage';
      if (this.phase === 'play' && this.pendingBrief && !this.rescue) { this.pendingBrief = false; this.phase = 'brief'; } // after a ferry lands
    }
    // ----- Edit 83: the ferry. After a clear, a drone carries the new chassis from the cleared tile into the next one
    leaveShop() {
      const st = this.report && this.report.story;
      super.leaveShop();
      if (this.storyMode && st && st.cleared && st.next && !st.districtDone && this.phase === 'play') this.startFerry(st.tile, st.next);
    }
    startFerry(from, to) {
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], [fc, fr] = cellOf(from), [tc, tr] = cellOf(to);
      const side = tc > fc ? 'E' : tc < fc ? 'W' : tr > fr ? 'S' : 'N', [sx, sy] = SIDES[side];
      const hx = sx ? (sx > 0 ? W + 40 : -40) : b.x, hy = sy ? (sy > 0 ? H + 40 : -40) : b.y; // the drone comes in from the next tile's side
      const gift = this.giftOf(to); // Edit 84: the drone brings the next tile's verb with it
      this.rescue = droneTo(this, hx, hy, { ferry: true, side, cell: [tc, tr], tile: to, gift });
      Object.assign(b, { level: 0, floor: null });
      this.emit('story-ferry', { from, to, side, gift });
    }
    arrivalPoint(side) { // off the road (landPoints: free ground or the hilltop), within story.ferryDepth of the entry edge, nearest the crossing
      const P = this.P, b = this.body, W = P['world.width'], H = P['world.height'], dep = P['story.ferryDepth'], r = P['body.radius'];
      const depth = (q) => (side === 'E' ? q.x : side === 'W' ? W - q.x : side === 'S' ? q.y : H - q.y); // in from the edge it entered by
      const ex = side === 'E' ? 0 : side === 'W' ? W : b.x, ey = side === 'S' ? 0 : side === 'N' ? H : b.y;
      const pts = this.landPoints().filter((q) => depth(q) >= r + 24); // clear of the edge by a body and more
      const near = pts.filter((q) => depth(q) <= dep), pool = near.length ? near : pts;
      let best = null; for (const q of pool) { const d = Math.hypot(q.x - ex, q.y - ey); if (!best || d < best.d) best = Object.assign({ d }, q); }
      return best || Object.assign({ d: 0 }, this.level.spawns[0]);
    }
    stepRescue(dt) {
      const rs = this.rescue;
      if (rs && rs.voyage) return this.stepVoyage(dt); // Edit 94 (P7.13): the flight to the ship
      if (!rs || !(rs.ferry || rs.gift || rs.given !== undefined)) return super.stepRescue(dt);
      if (stepDelivery(this, dt) || !this.rescue) return;
      const b = this.body, P = this.P, W = P['world.width'], H = P['world.height'], d = rs.drone;
      const fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = Math.hypot(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; d.state = ph; };
      if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.alt = 1; } }
      else if (rs.phase === 'carry') { // to the edge and over it
        const [sx, sy] = SIDES[rs.side], tx = sx ? (sx > 0 ? W + 2 : -2) : Math.max(40, Math.min(W - 40, b.x)), ty = sy ? (sy > 0 ? H + 2 : -2) : Math.max(40, Math.min(H - 40, b.y));
        fly(tx, ty); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y;
        if ((sx > 0 && d.x > W) || (sx < 0 && d.x < 0) || (sy > 0 && d.y > H) || (sy < 0 && d.y < 0)) {
          d.x -= sx * W; d.y -= sy * H; d.hx -= sx * W; d.hy -= sy * H;
          this.flip(rs.side, rs.cell, null); // the screen scrolls; the next tile's fences close behind (arrive)
          rs.to = this.arrivalPoint(rs.side); next('in');
        }
      } else if (rs.phase === 'in') { const arrived = fly(rs.to.x, rs.to.y); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, level: rs.to.level || 0, floor: rs.to.floor != null ? rs.to.floor : null, mode: 'idle', vx: 0, vy: 0 });
          const [sx, sy] = SIDES[rs.side]; d.hx = sx ? (sx > 0 ? W + 40 : -40) : d.x; d.hy = sy ? (sy > 0 ? H + 40 : -40) : d.y; d.state = 'outbound'; (this.leaving = this.leaving || []).push(d); // on, the way it was going
          this.rescue = null;
          this.emit('story-ferried', { tile: this.screenName(), x: +b.x.toFixed(1), y: +b.y.toFixed(1), seconds: +rs.t.toFixed(2) });
        }
      }
    }
    // Edit 83: the open tiles are the cleared ones and the tile in test. An edge between two open tiles is open; every other edge
    // of an open tile is fenced. Cleared tiles stay reachable from the tile in test (P7–7.1 closed it behind the dummy)
    canCross(to) {
      if (!this.storyMode) return true;
      const pr = this.story, dn = doneIn(pr, this.levelId), act = activeTile(pr, this.levelId), open = (t) => dn.includes(t) || t === act;
      return open(this.screenName()) && open(nameOf(to[0], to[1]));
    }
    fenceSides() { // the current screen's sides that a fence holds
      if (!this.storyMode) return [];
      const [c, r] = this.district.cur, out = [];
      for (const sd of ['N', 'E', 'S', 'W']) { const to = [c + SIDES[sd][0], r + SIDES[sd][1]]; if (this.W6.at(to[0], to[1]) && !this.canCross(to)) out.push(sd); }
      return out;
    }
    flip(sd, to, fl) {
      super.flip(sd, to, fl);
      if (!this.storyMode) return;
      const t = this.screenName();
      if (!this.entered && t === activeTile(this.story, this.levelId)) { this.arrive(t); this.pendingBrief = true; }
    }
    moveBody(h) { super.moveBody(h); if (this.storyMode) this.fenceClamp(); }
    fenceClamp() { // a fence holds at the screen's edge as drawn; it cannot be jumped, dashed, pushed or thrown through
      const b = this.body;
      if (!b || !b.alive || b.mode === 'rescue' || b.stair) return;
      const sides = this.fenceSides(); if (!sides.length) { this.fenceHit = null; return; }
      const P = this.P, W = P['world.width'], H = P['world.height'], r = P['body.radius'], lw = this.edgeLift();
      const stop = (ax) => {
        b['v' + ax] = 0; if (b.mode === 'knock') b['knockV' + ax] = 0;
        if (b.jump) b.jump['v' + ax] = 0; if (b.drop) b.drop['v' + ax] = 0;
        if (b.mode === 'lunge' && b.lunge) b.lunge.blocked = true;
      };
      let hit = null; const e = 0.5; // touching counts: the notice fires once a contact, not every substep
      for (const sd of sides) {
        if (sd === 'E' && b.x >= W - r - e) { if (b.x > W - r) { b.x = W - r; stop('x'); } hit = sd; }
        else if (sd === 'W' && b.x <= r + e) { if (b.x < r) { b.x = r; stop('x'); } hit = sd; }
        else if (sd === 'N' && b.y <= lw + r + e) { if (b.y < lw + r) { b.y = lw + r; stop('y'); } hit = sd; }
        else if (sd === 'S' && b.y >= H + lw - r - e) { if (b.y > H + lw - r) { b.y = H + lw - r; stop('y'); } hit = sd; }
      }
      if (hit && hit !== this.fenceHit) {
        const [c, rr] = this.district.cur, to = nameOf(c + SIDES[hit][0], rr + SIDES[hit][1]);
        this.emit('story-fence', { side: hit, to, tile: this.screenName(), entered: this.entered, cleared: doneIn(this.story, this.levelId).includes(this.screenName()) });
      }
      this.fenceHit = hit;
    }
    spawnBody() { super.spawnBody(); if (this.body) this.body.born = this.t; }
    // Edit 91: in the tile in test, a hit that would write the chassis off but misses the brief leaves story.missFloor
    hitFloor(h) {
      if (!this.storyMode || !this.entered || !this.story) return 0;
      const t = this.screenName(); if (t !== activeTile(this.story, this.levelId)) return 0;
      const tile = tileOf(this.levelId, t);
      return !tile || meets(tile.task, h, h.level, this.P) ? 0 : this.P['story.missFloor'] || 0;
    }
    writeOff() {
      const b = this.body, hit = b.hits[b.hits.length - 1] || null, level = b.level || 0;
      super.writeOff();
      if (!this.storyMode) return;
      for (const h of b.hits) this.noteCombo(h.combo || 0); // Edit 94 (P7.13): the run's best combo
      const pr = this.story, P = this.P, t = this.screenName(), act = activeTile(pr, this.levelId), tile = tileOf(this.levelId, t);
      const res = { tile: t, active: act, counted: false, why: null, n: pr.tileWO, need: needOf(this.levelId, act || t, P), kind: hit ? hit.kind : null, cls: hit ? hit.cls : null, combo: hit ? hit.combo : 0, level };
      if (t !== act || !this.entered) res.why = doneIn(pr, this.levelId).includes(t) ? 'cleared' : 'elsewhere';
      else if (!meets(tile.task, hit, level, P)) res.why = 'task';
      else { pr.tileWO++; res.counted = true; res.n = pr.tileWO; }
      this.storyLast = res;
      this.emit(res.counted ? 'story-count' : 'story-miss', res);
    }
    checkTerminal() {
      if (!this.storyMode) return super.checkTerminal();
      this.slot = this.W6.admitted;
      const r = this.run, P = this.P, b = this.body;
      if (r.ending || b.alive || b.reported) return; // the story has no Failed test: its shift runs story.shiftCars cars
      b.reported = true;
      const pr = this.story, id = this.levelId, res = this.storyLast || { counted: false };
      let cleared = false, districtDone = false, storyDone = false, next = null;
      if (res.counted && pr.tileWO >= res.need) {
        cleared = true;
        pr.done[id] = doneIn(pr, id).concat([res.tile]); pr.tileWO = 0;
        pr.tilePoints[id + ':' + res.tile] = Math.round(r.points - (this.tilePts0 || 0));
        this.entered = false;
        next = activeTile(pr, id);
        districtDone = !next; storyDone = districtDone && !nextDistrict(id);
        if (districtDone && !storyDone) pr.district = nextDistrict(id);
        this.emit('story-clear', { tile: res.tile, next, district: id, districtDone, storyDone, points: pr.tilePoints[id + ':' + res.tile] });
      }
      this.syncProgress();
      this.report = { chassis: b.chassis, hits: b.hits.slice(), points: Math.round(r.points - b.points0), credits: r.credits,
        roadCleared: districtDone && !storyDone, nextRoad: districtDone ? pr.district : null,
        story: Object.assign({}, res, { cleared, next, districtDone, storyDone, parts: partsOwned(r.owned), nextGift: nextGift(pr) }) }; // Edit 91: parts, not levels
      if (storyDone) { // Edit 94 (P7.13): the circus clears; the monument is unveiled with the run's plaque, then the ending (D76)
        pr.complete = true; this.syncProgress();
        const plaque = { chassis: pr.chassis, points: pr.points, bestCombo: pr.bestCombo || 0, t: pr.t };
        this.unveil = { plaque, done: false };
        this.emit('unveil', plaque);
        this.phase = 'writeoff'; this.phaseT = P['feedback.writeOffSeconds']; this.pendingPhase = 'unveil'; return; // Edit 94 (manual review): the write-off plays first, then the unveiling
      }
      this.phase = 'writeoff'; this.phaseT = P['feedback.writeOffSeconds']; this.pendingPhase = 'report';
    }
    // ----- Edit 91: Story has no shop. Every part arrives by drone; the report goes straight to the next chassis
    canBuy(n) { return this.storyMode ? { ok: false, why: VERB_AT[n] ? 'gift at ' + VERB_AT[n] : 'not issued' } : super.canBuy(n); }
    buy(n) { if (!this.storyMode) return super.buy(n); const chk = this.canBuy(n); this.emit('purchase-denied', { node: n, why: chk.why }); return chk; }
    continueReport() {
      if (this.storyMode && this.phase === 'report' && !(this.report && this.report.roadCleared)) { this.phase = 'shop'; this.leaveShop(); this.emit('shop-skip', {}); return; }
      super.continueReport();
    }
    syncProgress() {
      const pr = this.story, r = this.run;
      pr.owned = Object.assign({}, r.owned); pr.credits = r.credits; pr.points = r.points; pr.chassis = r.chassis;
      pr.writeOffs = this.totalWriteOffs(); pr.t = +(this.tOffset + this.t).toFixed(2); pr.milestones = Object.assign({}, this.milestones);
    }
    task() { const tile = tileOf(this.levelId, activeTile(this.story, this.levelId) || ''); return tile ? tile.task : null; }
    // Edit 94 (P7.13): the DUMMY MONUMENT stays shrouded until the circus, Waterfront B2, clears (D76)
    monumentShrouded() { const P = this.P; return !!(this.storyMode && this.story && P['world.monumentShroud'] && P['world.dummyMonument'] && !doneIn(this.story, CIRCUS.district).includes(CIRCUS.tile)); }
    trace() { const tr = super.trace(); tr.story = JSON.parse(JSON.stringify(this.story)); return tr; }
  }

  // ---------- Edit 84: Arcade. One district a run (Sim6 single); P7SIM's ricochet. Edit 91: every part for credits, no drone
  // gifts; the chassis ships with Battery 1 (the dash)
  class ArcadeSim extends W6.Sim6 {
    constructor(id, overrides, carry, opts) {
      const cy = Object.assign({}, carry || {}); cy.owned = Object.assign({ battery1: true }, cy.owned);
      super(id, Object.assign({}, P7SIM, overrides || {}), cy, Object.assign({ single: true }, opts || {}));
    }
  }

  const api = { P7SIM, VERBS, giftsCleared, nextGift, partsOwned, VERB_AT, ArcadeSim, trafficOf, storyDensity, hasRing, DATA, DIST, TOTAL, newProgress, districtOf, doneIn, activeTile, clearedCount, tileNumber, nextDistrict, tileState, tileOf, needOf, taskText, meets, nameOf, cellOf, StorySim };
  if (NODE) module.exports = api; else root.STORY = api;
})(typeof window !== 'undefined' ? window : globalThis);

```

# Code the candidates retrieve
### prototypes/p6/game.js · drawEnding (lines 3043–3058) · for EDIT94#3.2:5
```js
  function drawEnding(s) {
    veil();
    const e = s.run.ending, x = FX + 22, y = FY + 18, w = FW - 44, h = FH - 36;
    panel(x, y, w, h, { tint: e.kind === 'Licensed' || e.kind === 'Certified' ? 'rgba(232,248,238,0.95)' : 'rgba(236,247,252,0.95)' });
    txt('CONTRACT RESULT', x + 28, y + 44, fLab, FT.accent);
    const title = { Licensed: 'LICENSED', 'Failed test': 'FAILED TEST', 'Non-compliant': 'NON-COMPLIANT', Certified: 'CERTIFIED' }[e.kind] || e.kind; // Edit 81: the story's end
    txt(title, x + 26, y + 104, '900 54px ' + F_BRAND, e.kind === 'Licensed' ? FT.text : e.kind === 'Failed test' ? C.warning : FT.dim);
    wrapText(e.kind === 'Certified' ? (STORY.DATA.ending || 'All ' + STORY.TOTAL + ' tiles of the Test City are tested and certified complete.') : copy('endings.' + e.kind, ''), x + 28, y + 146, w - 56, 28, fTxt, FT.dim, e.kind === 'Certified' ? 3 : 2); // Edit 92: Narrative A's ending
    const imp = s.events.filter((v) => v.type === 'impact');
    const stats = [['TIME', fmtT(e.t)], ['WRITE-OFFS', String(e.writeOffs)], ['POINTS', num(e.points)], ['BEST HIT', imp.length ? num(Math.max(...imp.map((v) => v.assessed))) : '—']];
    const cw = (w - 56) / stats.length;
    const sy = e.kind === 'Certified' ? 30 : 0; // Edit 92: the ending's third line
    stats.forEach(([k, v], i) => { txt(k, x + 28 + i * cw, y + 222 + sy, fLab, FT.dim); txt(v, x + 28 + i * cw, y + 262 + sy, fNum, FT.text); });
    const items = endItems(s);
    menuList(items, app.endSel, x + 28, y + h - 20 - items.length * 54, 460, null, 0, (i) => { app.endSel = i; });
  }
```

### prototypes/p6/game.js · preview (lines 84–88) · for EDIT94#3.2:5
```js
  function preview(i) { // P6: the district's start screen, art only, built on first sight
    if (!W6) return previews[i];
    if (!previews[i]) { const D = W6.DISTRICTS[i], t = D.start[0]; previews[i] = { preview6: true, sc: W6.buildScreen(D, 'ABC'.indexOf(t[0]), +t[1] - 1) }; }
    return previews[i];
  }
```

### prototypes/p6/world6.js · onScreen (lines 72–72) · for EDIT94#3.2:5
```js
    const onScreen = (r) => { let s = 0; for (let i = 1; i < r.length; i++) for (let k = 0; k < 16; k++) { const f = (k + 0.5) / 16, mx = r[i - 1][0] + (r[i][0] - r[i - 1][0]) * f, my = r[i - 1][1] + (r[i][1] - r[i - 1][1]) * f; if (mx >= 0 && mx <= W && my >= 0 && my <= H) s += hyp(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]) / 16; } return s; }; // Edit 56: sampled, so a short run ending inside the screen counts
```

### prototypes/p6/sim.js · DISTRICT_LIST (lines 1011–1011) · for EDIT94#open:0
```js
  const DISTRICT_LIST = ['riverside', 'market', 'interchange', 'cbd', 'campus'];
```

### prototypes/p6/world6.js · buildScreen (lines 1169–1307) · for EDIT94#open:1
```js
  function buildScreen(D, col, row) {
    const name = TILE(col, row), ox = col * W, oy = row * H, rng = PIX.rng(1000 + col * 37 + row * 101 + D.id.length * 7), plan = D.tiles[name];
    const sc = { D, name, col, row, ox, oy, props: [], layers: [], tops: [], note: plan[0] + '. Landmark: ' + plan[1] + '.', stairs: [], reserve: [], solids: [], solidsZ: [], roofs: [], floorsX: [], waterPolys: [], polys0: [], cones: [], drones: [] };
    CAP = sc.solids; // P6: every mass drawn from here is a solid of this screen
    SCN = sc; // Edit 94 (P7.13): the screen being built, for the story's tile art that reports itself (the container ship)
    PARKGRID = D.id === 'parkland' ? gridLines(sc) : null; // 6.2 (Edit 70)
    for (const rb of [D.roundabout, D.ring]) if (rb && rb.arms.length < P['world.roundaboutMinArms']) console.warn('a roundabout with too few arms', D.id); // Edit 52
    const RBS = (D.roundabouts || []).concat(D.roundabout ? [D.roundabout] : []), rbHere = RBS.find((q) => q.tile === name); // Edit 56: street roundabouts
    if (D.kit !== 'example') { // Edit 56 (user, 26 October): every four-way takes a roundabout, its arms 90° apart, inside its tile; a flyover only where the plan names it
      const ANG = { W: 180, N: 270, E: 0, S: 90, NW: 225, NE: 315, SE: 45, SW: 135 }, zq = (1 - P['world.junctionZone']) / 2, rS = P['world.roundaboutRadiusStreet'] + OUTER;
      for (const rb of RBS.concat(D.ring ? [D.ring] : [])) if (rb.tile === name) {
        const a = rb.arms.map((k) => ANG[k]).sort((p, q) => p - q); if (a.some((v, i) => ((a[(i + 1) % a.length] - v + 360) % 360 || 360) < 90)) console.warn('a roundabout with arms under 90° apart', D.id, name);
        const c = rb.at || [W / 2, H / 2]; if (rb !== D.ring && (c[0] - rS < 0 || c[0] + rS > W || c[1] - rS < 0 || c[1] + rS > H)) console.warn('a roundabout crossing its tile edge', D.id, name);
        if (c[0] < W * zq || c[0] > W * (1 - zq) || c[1] < H * zq || c[1] > H * (1 - zq)) console.warn('a roundabout outside the central zone', D.id, name);
      }
      if (D.flyover && !D.flyoverNamed) console.warn('a 45° flyover the plan does not name', D.id);
    }
    const runs = [];
    for (const r of D.roads) { const run = clipRun(shift(r.pts, -ox, -oy), -200, -200, W + 200, H + 200); if (run) runs.push({ id: r.id, pts: run }); }
    const decks = D.decks.filter((d) => !d.rows || d.rows.includes(row)).map((d) => ({ hz: d.hz, z: d.z, off: d.hz ? d.at - oy : d.at - ox, from: d.from != null ? d.from - (d.hz ? ox : oy) : null, noEsc: d.noEsc, escY: d.escY && d.escY[name], esc1: d.esc1 && d.esc1[name], gaps: (d.gaps || []).map(([a, b]) => [a - (d.hz ? ox : oy), b - (d.hz ? ox : oy)]) })).filter((d) => d.off > -HALF && d.off < (d.hz ? H : W) + HALF);
    const hDecks = decks.filter((d) => d.hz), vDecks = decks.filter((d) => !d.hz);
    const groundDecks = D.ring && D.ring.tile === name ? [] : hDecks;
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: groundDecks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, extra || {});
    const J = (D.junctions || []).find((j) => j.tile === name);
    let ground, roadD, sims = [], center = runs.length ? runs[0].pts : [[-900, -900], [-850, -900]], lanes = null, busOK = runs.every((r) => X.minBend(r.pts, W, H) >= RB), patches = [];
    if (D.id === 'circus' && name === 'C1') patches = [[480, 520], [512, 552], [448, 584], [544, 496], [480, 608]].map(([x, y]) => ({ x, y, w: 32, h: 32, kind: 'puddle' })); // a flooded corner
    // ground roads and their traffic
    if (rbHere) { // a ground roundabout: every route, give way at entry, the inner lane for the third exit (Edit 52, 54). Edit 56: street radius, any centre, bent arms
      const ov = D.kit === 'example' ? {} : { 'world.roundaboutRadius': P['world.roundaboutRadiusStreet'] }, geo = L.multiRoundabout(X, Object.assign({}, P, ov), rbHere.arms, R96, rbHere.at, rbHere.bends), s = labSim(geo, 'nobus', ov);
      sims.push(s); sc.lab = s; const ca = rbHere.at || [W / 2, H / 2]; sc.islands = [{ x: ca[0], y: ca[1], r: P['world.roundaboutRadiusStreet'] + OUTER + 24 }]; // P6.1: no spawn on a roundabout's island
      ground = PIX.ground(lvl(geo.center, { ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops, decks: [] }), P, 23);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.geo) { // Edit 55 (example): a lab geometry built whole (realigned, staggered)
      const geo = D.geo(), s = labSim(geo, 'nobus', {});
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops }), P, 29);
      const rf = PIX.roadField(geo.roads.ma
/* … excerpt cut … */
```

### prototypes/p6/world6.js · RBS (lines 1176–1176) · for EDIT94#open:1
```js
    const RBS = (D.roundabouts || []).concat(D.roundabout ? [D.roundabout] : []), rbHere = RBS.find((q) => q.tile === name); // Edit 56: street roundabouts
```

### prototypes/p6/world6.js · stand (lines 1960–1960) · for EDIT94#open:2
```js
    const stand = (sc, x, y) => { const g = sc.game; return x >= R0 && y >= R0 && x <= W - R0 && y <= H - R0 && !g.statics.some((q) => inR(q, x, y, R0 - 2)) && !g.stairs.some((q) => inR(q, x, y, R0 - 2)) && g.polys0.every((p) => !PIX.inPoly(p, x, y)) && g.water.every((p) => !PIX.inPoly(p, x, y)) && !(g.checkpoints || []).some((cp) => !cp.deck && !cp.z && inR(cpZone(cp), x, y, R0 - 1)); };
```

### prototypes/jump/jump.js · speeds (lines 47–49) · for EDIT94#open:2
```js
  function speeds(P) { // the four take-offs: standing, walking, running, a dash jump at the cap
    return { stand: 0, walk: P['movement.walkSpeed'], run: P['movement.runSpeed'], dash: P['upgrades.jumpMaxSpeed'] };
  }
```

### prototypes/p6/world6.js · groundFree (lines 1612–1612) · for EDIT94#open:2
```js
  function groundFree(sc, x, y, m) { const g = sc.game; m = m == null ? R0 - 2 : m; return !g.statics.some((q) => inR(q, x, y, m)) && g.polys0.every((q) => !PIX.inPoly(q, x, y)) && !g.stairs.some((q) => inR(q, x, y, m)); } // m: the margin (where the dummy can stand: R0 − 2; where it can arrive across an edge: 0, the push-out slides it along)
```

### prototypes/p6/game.js · drawBriefFoot (lines 2674–2681) · for P7#known-gaps:0
```js
  function drawBriefFoot(s, X, y, W) { // under the district map: the brief and the tile's count
    const pr = s.story, t = STORY.activeTile(pr, s.levelId), tile = t ? STORY.districtOf(s.levelId).tiles[t] : null, need = t ? STORY.needOf(s.levelId, t, s.P) : 0;
    if (!tile) return;
    const tx = STORY.taskText(tile.task, s.P), here = s.screenName() === t;
    txt('BRIEF · ' + t, 30, y + 18, '700 15px ' + F_UI, here ? FT.accent : FT.dim);
    for (let i = 0; i < need; i++) { ctx.beginPath(); ctx.arc(X + W - 20 - (need - 1 - i) * 16, y + 13, 5, 0, TAU); ctx.fillStyle = i < pr.tileWO ? C.dummy : FT.track; ctx.fill(); ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.stroke(); }
    wrapText(tx.label, 30, y + 44, W - 28, 20, '700 17px ' + F_UI, FT.text, 1);
  }
```

### prototypes/p6/game.js · drawBrief (lines 2562–2580) · for P7#known-gaps:0
```js
  function drawBrief(s) { // the tile card: where you are, how it came to be, what Farsight wants
    veil();
    const pr = s.story, t = s.screenName(), d = STORY.districtOf(s.levelId), tile = d.tiles[t], P = s.P, tx = STORY.taskText(tile.task, P), need = STORY.needOf(d.id, t, P);
    const x = FX + 36, y = FY + 26, w = FW - 72, h = FH - 52;
    panel(x, y, w, h); hitbox(x, y, w, h, 'brief', () => menuQ.push('ok')); // Edit 89: a tap begins
    fitText((d.act ? d.act + ' · ' : '') + d.name.toUpperCase() + ' · TILE ' + t + ' · ' + STORY.tileNumber(d.id, t) + ' OF ' + STORY.TOTAL, x + 30, y + 44, w - 60, TY.sec, 13, FT.accent); // Edit 92: the act
    txt(tile.title, x + 30, y + 96, '900 40px ' + F_BRAND, FT.text);
    let yy = y + 138;
    if (d.order[0] === t && !STORY.doneIn(pr, d.id).length) { yy += 28 * wrapText(d.intro, x + 32, yy, w - 64, 28, '700 19px ' + F_UI, FT.dim, 2) + 8; }
    yy += 30 * wrapText(tile.tale, x + 32, yy, w - 64, 30, fTxt, FT.text, 5) + 12;
    ctx.strokeStyle = FT.itemEdge; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x + 30, yy); ctx.lineTo(x + w - 30, yy); ctx.stroke();
    yy += 38;
    txt('FARSIGHT BRIEF', x + 30, yy, fLab, FT.accent); txt(tx.label, x + w - 30, yy, fLab, FT.text, 'right');
    yy += 32; yy += 28 * wrapText(tx.brief + ' ' + (need === 1 ? 'One counted write-off clears the tile.' : need + ' counted write-offs clear the tile' + (pr.tileWO ? ' (' + pr.tileWO + ' so far).' : '.')), x + 32, yy, w - 64, 28, '400 19px ' + F_UI, FT.text, 3);
    const gt = tile.gift && pr.gifts[d.id + ':' + t] ? giftText(tile.gift) : null;
    if (gt) { yy += 12; rr(x + 28, yy, w - 56, 48, 12); ctx.fillStyle = FT.credit; ctx.fill(); ctx.strokeStyle = C.dummy; ctx.lineWidth = 1.5; ctx.stroke(); wrapText('GIFT · ' + gt, x + 46, yy + 31, w - 92, 24, '700 18px ' + F_UI, FT.text, 1); }
    txt(TOUCH.on ? 'TAP TO BEGIN THE TEST' : app.device === 'pad' ? 'A  BEGIN THE TEST' : 'SPACE  BEGIN THE TEST', x + w - 30, y + h - 24, fLab, FT.accent, 'right');
    txt('Fenced until cleared. Cleared tiles stay open.', x + 30, y + h - 24, '400 17px ' + F_UI, FT.dim);
  }
```

### prototypes/p6/game.js · nm (lines 2995–2995) · for P7#known-gaps:1
```js
    const nm = (n, w) => (STORY && !s.has(n) ? '???' : w); // Edit 90: a verb not yet fitted is not named
```

### prototypes/p6/world6.js · DISTRICTS (lines 649–667) · for P7#known-gaps:1
```js
  const DISTRICTS = [
    { id: 'parkland', name: 'Parkland', quota: P['world.district.parkland.quota'], storeys: [2, 5], start: ['B2', 'center'], // P6.1: every district starts in its centre tile
      mood: 'Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.',
      roads: [{ id: 'boulevard', pts: [[40, -200], [2360, 2120]] }, { id: 'loop', pts: fil([[527, 287], [400, 414], [400, 1736], [1636, 1736], [1806, 1566], [2206, 1166], [1760, 720], [1760, -200]], [0, RB, RB, 96, RB, RB, RB, 0]) }], // Edit 56: joins the boulevard at 90° in A1; meets it at a roundabout in C3
      junctions: [{ tile: 'A1', at: [527, 287], major: 'boulevard' }],
      roundabouts: [{ tile: 'C3', at: [206, 286], arms: ['NW', 'NE', 'SE', 'SW'], bends: { SW: { dir: [-1, 0], at: 240.3, Rb: 96 } } }], // Edit 56: the four-way takes a street roundabout; the street's SW arm turns west outside it
      ring: { tile: 'B2', z: 1, arms: ['W', 'N', 'E', 'S'] },
      decks: [{ hz: true, at: 996, z: 1 }, { hz: false, at: 1200, z: 1 }], park: true, // Edit 55.2: row 2 at 996 so the lifted B2 ring draws at the screen's centre
      deckLinks: { B1: [{ y: 304, h: 32, side: -1 }, { y: 304, h: 32, side: 1 }] }, // Edit 55.2: the Z1 walkway joins the B1 highway at both parapets (P6: at the walkway's footprint; the deck lifts as every floor)
      tiles: {
        A1: ['Start, top edge. The 45° boulevard; the avenue curves to join it at 90° and gives way. The Z1 walkway from B1 lands by escalator', 'Reservoir terraces: three stepped pools', 'both'],
        B1: ['The Z1 highway runs north–south; escalators west (north end) and east (south end). A Z1 walkway crosses the garden and joins the highway at both parapets. The boulevard cuts the corner', 'Cascade: water steps beside the highway', 'both'],
        C1: ['The avenue under a Z1 footbridge that runs west to the B1 highway; escalator at its east end; drop onto cars', 'Lantern pavilion', 'both'],
        A2: ['The avenue passes under the Z1 highway at 90°; escalators north (west end) and south (east end)', 'Canal along the highway', 'both'],
        B2: ['Four-arm Z1 roundabout (W, N, E, S). Give way to the ring; the inner lane is the orbit lane. The boulevard passes beneath, through the hole', 'Reflecting pools under the ring', 'both'],
        C2: ['The avenue comes up from the C3 roundabout at 45°, turns 90° and passes under the Z1 highway at 45°', 'Amphitheatre terraces', 'both'],
        A3: ['A wide R160 bend (buses may use it)', 'Belvedere: four tiers and a stair up to a lawn, the monolith orchard on top', 'both'],
        B3: ['The garden street passes under the Z1 highway at 90°; escalators', 'Sculpture court: a large obelisk, two rings, a row of lit bollards', 'both'],
        C3: ['Street roundabout where the street meets the boulevard: four arms at 90°, the street turning west outside it', 'Sculpture court at grade: a large arch, two medium pieces, a row of lit bollards', 'scenery'] } },
```

### prototypes/p6/sim.js · Sim.account (lines 3225–3277) · for P7#known-gaps:2
```js
    account(contacts) {
      const P = this.P;
      contacts.sort((a, b) => a.k - b.k || (a.car.id < b.car.id ? -1 : a.car.id > b.car.id ? 1 : 0));
      let positive = false;
      for (const ct of contacts) {
        const b = this.body, c = ct.car;
        if (!b.alive) { this.emit('contact-ignored', { car: c.id }); continue; }
        if (c.spent) { this.emit('touch-spent', { car: c.id }); this.effects.push({ type: 'touch', x: ct.px, y: ct.py, t: this.t }); continue; }
        const { raw, assessed } = P['proto.damageModel'] ? ct.ph : assess(P, ct.closing, ct.zone, c.cls);
        if (raw <= 1e-9) { this.emit('touch', { car: c.id, closing: 0 }); continue; }
        c.spent = true;
        const plate = b.level === 0 && this.surfaceAt(b.x, b.y) === 'plate' ? P['damage.plateMultiplier'] : 1; // a calibrated plate scores more (7.3)
        const hw = c.deck ? P['damage.deckMultiplier'] : 1; // P5 (Edit 50): a highway hit scores more
        // Edit 75: a hit within scoring.comboWindow of the last chains a combo; each link adds scoring.comboStep, to scoring.comboMax.
        // Edit 79: each new kind of move in the chain adds scoring.comboVariety; the clock stops in the air (comboClock)
        const kind = ct.drop ? 'drop' : ct.kind || (ct.jump ? 'jump' : ct.lunging ? 'dash' : 'struck');
        const cl = this.comboLink(kind, assessed * plate * hw), combo = cl.n, mult = cl.mult;
        let lost = Math.min(b.health, assessed); // Edit 91: a hit that would write the chassis off can be held at a floor (Story: a miss of the brief)
        const floor = lost >= b.health - 1e-9 && this.hitFloor ? this.hitFloor({ kind, cause: ct.cause, cls: c.cls, combo, level: b.level }) : 0;
        const held = floor > 0 && b.health - lost < floor;
        if (held) lost = Math.max(0, b.health - floor);
        b.health = Math.max(0, b.health - lost);
        this.run.points += assessed * plate * hw * mult;
        if (combo > 1) { this.emit('combo', { n: combo, mult, kinds: cl.kinds.slice(), bonus: Math.round(assessed * plate * hw * (mult - 1)), car: c.id }); this.mile('firstCombo', { n: combo }); }
        const bait = ct.carState === 'committed' || ct.carState === 'expiring' || ct.carState === 'interrupted';
        let learned = null;
        if (P['proto.learningEnabled'] && lost > 0) {
          const m = this.models[c.cls], cap = Math.round(P['learning.playerHitCap'] / P['learning.playerHitStep']);
          if (m.applied < cap) { m.applied++; learned = m.applied; }
        }
        let learnedStandoff = null;
        if (P['proto.learn.standoffEnabled'] && lost > 0 && ct.stopped) {
          const m = this.models[c.cls], before = this.modelStandoff(m);
          if (before < P['proto.learn.standoffMax']) { m.standoffApplied++; learnedStandoff = this.modelStandoff(m); this.emit('learn-standoff', { model: m.id, from: before, to: learnedStandoff }); }
        }
        const part = this.partOf(ct.px, ct.py, assessed, ct.drop); // a landing takes the legs (Edit 42)
        b.parts[part] += lost;
        const ev = { car: c.id, model: c.model, cls: c.cls, zone: ct.zone, part, closing: +ct.closing.toFixed(3),
          angle: +ct.ph.angle.toFixed(1), dv: +ct.ph.dvd.toFixed(2), strike: +ct.ph.un.toFixed(2),
          raw: +raw.toFixed(3), assessed: +assessed.toFixed(3), lost: +lost.toFixed(3), health: +b.health.toFixed(3),
          carState: ct.carState, cause: ct.cause, bait, lunging: ct.lunging, learned, stopped: ct.stopped, learnedStandoff, plate: plate > 1, highway: hw > 1, drop: !!ct.drop, deck: !!c.deck, dropZ: ct.drop ? ct.dropZ : 0, dropFrom: ct.drop ? ct.dropFrom : null,
          combo, mult, kind, jump: !!ct.jump, ricochet: !!ct.ricochet, held };
        this.emit('impact', ev); b.hits.push(ev);
        if (held) this.emit('held', { health: b.health, kind, car: c.id });
        this.effects.push({ type: 'burst', x: ct.px, y: ct.py, v: assessed * plate * hw * mult, mult: hw, combo, cmult: mult, t: this.t, zone: ct.zone, angle: ct.ph.angle, layer: lay(c) });
        this.mile('firstHit');
        if (bait) this.mile('firstBaitHit');
        if (ct.cause === 'cone' && bait) this.mile('firstConeAssistHit');
        positive = true;
        if (b.health <= 0) this.writeOff();
      }
      return positive;
    }
```

### prototypes/p6/game.js · toSaves (lines 186–189) · for P7#known-gaps:3
```js
  function toSaves() {
    app.mode = 'story'; app.screen = 'saves'; app.sim = null; app.paused = false; app.saveMode = null; app.saveConfirm = null; app.slotAct = 0; app.nameEntry = null; clearEdges();
    const S = allSlots(); let best = 0, t = -1; S.forEach((v, i) => { if (v && v.saved > t) { t = v.saved; best = i + 1; } }); app.saveSel = app.slot && S[app.slot - 1] ? app.slot : best;
  }
```

### prototypes/p6/game.js · panel (lines 1119–1133) · for P7#known-gaps:3
```js
  function panel(x, y, w, h, opts) { // FARSIGHT glass (frame layer only)
    const R = 12;
    ctx.save();
    ctx.shadowColor = 'rgba(16,40,56,0.16)'; ctx.shadowBlur = 16; ctx.shadowOffsetY = 5;
    rr(x, y, w, h, R);
    const g = ctx.createLinearGradient(0, y, 0, y + h);
    g.addColorStop(0, FT.panelTop); g.addColorStop(1, (opts && opts.tint && !FT.neon && opts.tint) || FT.panelBot);
    ctx.fillStyle = g; ctx.fill(); ctx.restore();
    if (FT.neon) { ctx.save(); ctx.shadowColor = FT.edge; ctx.shadowBlur = 10; }
    rr(x + 0.75, y + 0.75, w - 1.5, h - 1.5, R); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
    if (FT.neon) ctx.restore();
    ctx.save(); rr(x + 2, y + 2, w - 4, Math.min(22, h / 3), R - 2); ctx.clip();
    const hg = ctx.createLinearGradient(0, y, 0, y + 22); hg.addColorStop(0, FT.gloss); hg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = hg; ctx.fillRect(x, y, w, 24); ctx.restore();
  }
```

### prototypes/p6/game.js · stamp (lines 81–81) · for P7#known-gaps:4
```js
  function stamp(ms) { const d = new Date(ms), p2 = (x) => String(x).padStart(2, '0'); return p2(d.getDate()) + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear() + ' · ' + p2(d.getHours()) + ':' + p2(d.getMinutes()); } // the browser's local time
```

### prototypes/p6/game.js · nameDone (lines 208–213) · for P7#known-gaps:4
```js
  function nameDone() {
    const ne = app.nameEntry; if (!ne) return; const name = cleanName(ne.text).trim() || defaultName(ne.slot); app.nameEntry = null; nameInput.blur();
    if (ne.kind === 'rename') { const cur = readSlot(ne.slot); if (cur) { cur.name = name; writeSlot(ne.slot, cur); } toast('Renamed: ' + name); return; } // a rename keeps the time stamp
    app.slot = ne.slot; app.story = STORY.newProgress(); app.mode = 'story';
    writeSlot(ne.slot, { v: 1, name, saved: Date.now(), progress: app.story }); toStoryMap();
  }
```

### prototypes/p6/pixel.js · stamp (lines 179–182) · for P7#known-gaps:4
```js
  function stamp(B, pts, c, oc) {
    if (oc != null) for (const [x, y] of pts) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) B.put(x + i, y + j, oc);
    for (const [x, y] of pts) B.put(x, y, c);
  }
```

### prototypes/p6/game.js · objective (lines 1979–2000) · for P7#known-gaps:5
```js
  function objective(s) {
    if (!s) return null;
    if (s.storyMode) {
      const pr = s.story, id = s.levelId, act = STORY.activeTile(pr, id), here = s.screenName();
      const rs = s.rescue, gn = rs && (rs.gift || rs.given);
      if (rs && gn && !rs.ferry) return ['FARSIGHT DRONE', 'Delivering ' + NODE(gn).name + '.']; // Edit 84
      if (rs && rs.gift) return ['FARSIGHT DRONE', 'Bringing ' + NODE(rs.gift).name + ', then on to ' + rs.tile + '.'];
      if (rs && rs.ferry) return ['FARSIGHT DRONE', 'Carrying the chassis to ' + rs.tile + '.'];
      if (rs && rs.voyage) return ['FARSIGHT DRONE', 'Carrying the certified model to the ship at ' + rs.tile + '.']; // Edit 94 (manual review): the voyage
      if (!act) return ['STORY', INFO(id).name + ' is cleared.'];
      const task = STORY.tileOf(id, act).task, need = STORY.needOf(id, act, s.P), lab = STORY.taskText(task, s.P).label.toLowerCase(), cnt = ' (' + pr.tileWO + ' of ' + need + ')';
      const what = (need === 1 ? 'Write off a body' : 'Write off ' + need + ' bodies') + (task.kind === 'any' ? '' : '. Last hit: ' + lab);
      if (here === act) return ['OBJECTIVE · ' + act, what + cnt + '.'];
      return ['OBJECTIVE · ' + act, 'Back to ' + act + ': ' + what.charAt(0).toLowerCase() + what.slice(1) + cnt + '.'];
    }
    if (s.isCity && s.quota) {
      const rs = s.rescue; if (rs && (rs.gift || rs.given)) return ['FARSIGHT DRONE', 'Delivering ' + NODE(rs.gift || rs.given).name + '.']; // Edit 84
      let line = 'Write off ' + s.quota + ' bodies (' + s.run.writeOffs + ' of ' + s.quota + ').';
      return ['OBJECTIVE · ' + INFO(s.levelId).name.toUpperCase(), line];
    }
    return null;
  }
```

### prototypes/p6/game.js · slotLines (lines 2428–2432) · for P7#known-gaps:6
```js
  function slotLines(v) {
    const pr = v.progress, cl = STORY.clearedCount(pr), t = pr.complete ? null : STORY.activeTile(pr, pr.district);
    return [pr.complete ? 'CERTIFIED · ALL ' + STORY.TOTAL + ' TILES' : INFO(pr.district).name.toUpperCase() + ' · ' + t + ' · TILE ' + STORY.tileNumber(pr.district, t) + ' OF ' + STORY.TOTAL + (pr.tileWO ? ' · ' + pr.tileWO + ' OF ' + STORY.needOf(pr.district, t) + ' WRITE-OFFS' : ''),
      cl + ' / ' + STORY.TOTAL + ' TILES · ' + num(pr.points || 0) + ' POINTS · ' + STORY.partsOwned(pr.owned) + ' / ' + STORY.VERBS.length + ' PARTS · CHASSIS ' + String(pr.chassis || 0).padStart(2, '0')]; // Edit 91: parts, not levels
  }
```

### prototypes/p6/game.js · drawFieldHD (lines 1917–1933) · for P7#known-gaps:6
```js
  function drawFieldHD(s) {
    const P = s.P;
    drawBubblesHD(s); // Edit 83: barks are speech bubbles on the cars again
    const since = s.t - (s.tStart || 0);
    if (since < 4 && s.phase === 'play' && !s.storyMode) { // Edit 81: the story's tile card replaces the banner
      const iv = { road: s.roadIndex + 1, roads: s.list.length, roadName: INFO(s.levelId).name, quota: s.quota, difficulty: s.difficulty, health: P['damage.bodyHealth'] };
      const intro = CI && CI.copy && CI.copy.intro;
      const msg = s.isCity ? 'District ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. ' + (place('districts.' + s.levelId + '.intro') || INFO(s.levelId).blurb) + ' Write-offs required: ' + iv.quota + '.'
        : (intro ? fillIn(intro[0], iv) : 'Road ' + iv.road + ' of ' + iv.roads + ': ' + iv.roadName + '. Write-offs required: ' + iv.quota + '.') +
        (s.district ? ' ' + s.district.cols * s.district.rows + ' screens: walk off a marked edge to explore.' : '');
      const lines = wrapLines(msg, FW - 88, fLab), h = 22 + lines.length * 30;
      ctx.globalAlpha = Math.min(1, (4 - since) / 0.6);
      rr(FX + 20, FY + 16, FW - 40, h, 12); ctx.fillStyle = FT.banner; ctx.fill(); ctx.strokeStyle = FT.edge; ctx.lineWidth = 1.5; ctx.stroke();
      lines.forEach((l, i) => txt(l, FX + FW / 2, FY + 16 + 38 + i * 30, fLab, FT.text, 'center'));
      ctx.globalAlpha = 1;
    }
  }
```

### prototypes/p6/game.js · abilityStats (lines 2782–2799) · for P7#known-gaps:7
```js
  function abilityStats(s, t, L) {
    const P = s.P, cut = Math.round(P['abilities.wearCut'] * L * 100), wear = L ? 'WEAR −' + cut + '%' : 'FULL WEAR';
    if (ABIL4) { // Edit 80
      if (t === 'battery' && BM1) { const n = L >= 2 ? P['battery.capacity'] : P['abilities.battery.dashCharges'], sec = (L >= 3 ? P['abilities.battery.level3Seconds'] : P['battery.secondsPerCharge']).toFixed(1); return [L ? 'DASH · ' + n + ' CHARGE' + (n === 1 ? '' : 'S') + ' · ' + sec + ' s' : 'NO DASH', L ? wear : '']; } // Edit 91
      if (t === 'battery') return ['CHARGE ' + (L ? P['abilities.battery.level' + L + 'Seconds'] : P['battery.secondsPerCharge']).toFixed(1) + ' s', wear];
      if (t === 'hands') return [L ? P['abilities.hands.conesPerLevel'] * L + ' CONE' + (P['abilities.hands.conesPerLevel'] * L === 1 ? '' : 'S') : 'NO GRAB', L ? wear : ''];
      if (t === 'arms') return [L ? 'PUSH +' + (P['abilities.arms.pushSpeed'] + P['abilities.arms.pushStep'] * (L - 1)) + ' ×' + P['abilities.arms.pushesPerLevel'] * L : 'BOUNCE ONLY', L ? wear : ''];
    }
    if (ABIL3) { // Edit 79
      if (t === 'battery') return ['CHARGE ' + (L ? P['abilities.battery.level' + L + 'Seconds'] : P['battery.secondsPerCharge']).toFixed(1) + ' s', wear];
      if (t === 'arms') return [['NO GRAB', 'CARRY A CONE', 'HOLD X: THROW', 'HITCH A CAR'][L], L ? wear : ''];
    }
    if (t === 'battery') return ['CHARGE ' + Math.max(0.05, P['battery.secondsPerCharge'] - P['abilities.battery.rechargeCut'] * L).toFixed(2) + ' s', wear];
    if (!L) return [{ legs: 'NO JUMP', arms: 'NO GRAB', throw: 'NO THROW' }[t], ''];
    if (t === 'legs') return ['AIR ' + (P['abilities.legs.airtimeBase'] + P['abilities.legs.airtimeStep'] * (L - 1)).toFixed(1) + ' s', wear];
    if (t === 'arms') return [P['abilities.arms.conesPerLevel'] * L + ' CONE' + (P['abilities.arms.conesPerLevel'] * L === 1 ? '' : 'S'), wear];
    return ['RANGE ' + Math.round(P['upgrades.throwDistance'] + P['abilities.throw.distanceStep'] * (L - 1)), wear];
  }
```

### prototypes/p6/game.js · DENY_TEXT (lines 573–573) · for P7#known-gaps:7
```js
  const DENY_TEXT = { lunge: 'No lunge — charge empty or recovering', pickup: 'No cone within reach', drop: 'No room to place the cone', throw: 'No room to release the cone',
```

### prototypes/p6/game.js · faceWord (lines 495–503) · for P7#known-gaps:8
```js
  function faceWord(f, s) {
    const inPlay = app.screen === 'game' && s && !app.paused && !app.touchEdit && ['play', 'hitstop', 'writeoff', 'scroll'].includes(s.phase);
    const node = FACE_NODE[f.id], unlocked = f.id === 'a' && STORY ? !(s && s.dashFitted) || s.dashFitted() : !node || !!(s && s.has(node)); // Edit 91: A names DASH once Battery 1 is fitted
    if (!STORY) return { word: unlocked ? f.w : 'LOCKED', live: unlocked };
    if (!inPlay) return { word: { a: 'OK', b: 'BACK' }[f.id] || '', live: f.id === 'a' || f.id === 'b' };
    if (!unlocked) return { word: '', live: false };
    if (f.id === 'x') { const b = s.body, room = s.carriedCones().length < s.coneCapacity(), near = b && room && s.nearestCone ? s.nearestCone() : null; return { word: b && b.held && !near ? 'DROP' : 'GRAB', live: true }; }
    return { word: f.w, live: true };
  }
```

### prototypes/p6/world6.js · goLive (lines 1915–1918) · for P7#known-gaps:8
```js
  function goLive(Wd) { // the shift starts: it counts Z0 cars as they appear on the screen in view (P6.1)
    Wd.live = true; Wd.admitted = 0; Wd.events.length = 0;
    for (const s of Wd.sims) for (const c of s.cars) if (!(c.elev || 0) && c.deck !== true) c.shift = true;
  }
```

### prototypes/p6/game.js · liveBark (lines 1937–1946) · for P7#known-gaps:8
```js
  function liveBark(s) {
    const dur = pv('proto.barks.seconds') || 2.4, now = app.realT;
    let best = null;
    for (const [id, bk] of fx.bubbles) {
      const age = now - bk.t0; if (age > dur) continue;
      const live = carsOf(s).find((c) => c.id === id), info = live || fx.cars.get(id); if (!info) continue;
      if (!best || bk.priority > best.bk.priority || (bk.priority === best.bk.priority && bk.t0 > best.bk.t0)) best = { bk, tag: shortId(info.model), spent: !!(live && live.spent), a: Math.min(1, 3 * (dur - age)) };
    }
    return best;
  }
```

### prototypes/p6/circus_valley.js · raised (lines 108–108) · for P7#known-gaps:9
```js
  function raised(road) { const runs = []; let cur = null; for (const p of dense(road.pts, 4)) { const up = road.z - ground(p[0], p[1]) > 0.25; if (up) { if (!cur) runs.push(cur = []); cur.push(p); } else cur = null; } return runs.filter((r) => r.length > 1); }
```

### prototypes/p6/game.js · frame (lines 3284–3305) · for P7#known-gaps:9
```js
  function frame(now) {
    const dt = clamp((now - last) / 1000, 0, 0.1); last = now; app.realT += dt; // rAF can stamp the first frame before load time
    pollPad(dt);
    handleMenus();
    if (app.screen === 'loading' && app.loading && app.loading.frames++ >= 2) { const ld = app.loading; app.loading = null; const rs = (app.roads || []).slice(); startLevelNow(ld.i, ld.carry); if (ld.carry) app.roads = rs; }
    const s = app.sim;
    if (app.screen === 'game' && s && !app.paused && traceEl.hidden) {
      acc += dt;
      while (acc >= 1 / 60) { s.step(s.phase === 'play' ? buildCmd() : {}); acc -= 1 / 60; }
      if (s.phase === 'next' && app.mode === 'story') { saveStory(); startLevel(LEVEL_LIST.indexOf(app.story.district)); } // Edit 81: the next district of the story
      else if (s.phase === 'next') { const rs = (app.roads || []).concat([s.trace()]); startLevel(app.level + 1, s.carryOut()); app.roads = rs; }
      if (app.screen === 'loading') { acc = 0; }
    } else acc = 0;
    processEvents();
    render();
    const pi = pad.info, padTxt = pad.blocked ? 'gamepads blocked on this page: open the downloaded file' : pi && pi.id ? 'pad: ' + pi.id.slice(0, 40) + (pi.mapping === 'standard' ? '' : ' (no standard mapping: hold START or G to set up)') : 'pad: none seen — press any button on it';
    const st = BUILD + ' · ' + SW + ' × ' + SH + ' ×' + kpx.toFixed(2) + ' · ' + (app.tuned ? 'TUNED RUN · UNRANKED' : 'registry values') + ' · ' + padTxt; app.statusLine = st;
    if (statusEl && statusEl.textContent !== st) statusEl.textContent = st;
    const mon = document.getElementById('padmon'), mt = pi && pi.monitor ? pi.monitor : '';
    if (mon && mon.textContent !== mt) mon.textContent = mt;
    requestAnimationFrame(frame);
  }
```

### prototypes/p6/sim.js · TRACKS (lines 211–213) · for P7#known-gaps:10
```js
  const TRACKS = {
    battery: { name: 'Battery', button: 'A', verb: 'DASH', part: 'torso',
      desc: ['Dash recharges faster. Torso damage slows it less.', 'Faster again. Torso damage slows it less.', 'Faster again. Torso damage slows it less.', 'Fastest recharge. Torso damage slows it least.'] },
```

### prototypes/p6/sim.js · Sim.secondsPerCharge (lines 1599–1605) · for P7#known-gaps:10
```js
    secondsPerCharge() { // Edit 77: Battery levels speed the recharge; torso damage slows it
      const P = this.P; if (!P['proto.abilities']) return P['battery.secondsPerCharge'];
      const L = this.tier('battery');
      if (P['proto.batteryModel'] === 1) return (L >= 3 ? P['abilities.battery.level3Seconds'] : P['battery.secondsPerCharge']) / this.partEffect('recharge'); // Edit 91: Battery 3 the faster recharge
      if (P['proto.abilities'] >= 2) return (L ? P['abilities.battery.level' + L + 'Seconds'] : P['battery.secondsPerCharge']) / this.partEffect('recharge'); // Edit 79: a value per level
      return Math.max(0.05, P['battery.secondsPerCharge'] - P['abilities.battery.rechargeCut'] * L) / this.partEffect('recharge'); // Edit 78: linear
    }
```

### prototypes/p6/world6.js · manage (lines 1891–1914) · for P7#known-gaps:11
```js
  function manage(Wd, act) {
    const exhausted = Wd.live && Wd.admitted >= Wd.budget, cull = P['traffic.offscreenCullSeconds'], Lb = P['vehicles.bus.length'], cruise = P['vehicles.sedan.cruiseSpeed'];
    for (const sc of Wd.scs) for (const F of sc.flow.values()) {
      let n = 0; for (const s of sc.sims) for (const c of s.cars) { const r = recOf(s, c); if (r && r.cls === F.cls) n++; }
      F.n = n;
      const kd = Wd.densityOf ? Wd.densityOf(sc) : 1, S = F.S / kd, target = F.target * kd; // Edit 85: Story scales a tile's density (1: the district's)
      if (n >= target + 1 || (exhausted && F.cls === 'street0')) continue; // a cap; the shift's streets stop filling once it is spent
      const cands = F.list.filter((g) => sc !== act || g.boundary);
      const hw = S / (cruise * (F.cls.startsWith('street') ? 1 : P['traffic.deckSpeedScale'])); // the target headway at an inlet
      for (let k = 0; k < cands.length; k++) { // an inlet from beyond the district meters at the headway; any other fills only a missing car (1.5 headways)
        const g = cands[(F.rr + k) % cands.length], r = g.recs[(Wd.spawnSeq + k) % g.recs.length], jit = 0.85 + 0.3 * ((Wd.spawnSeq * 0.6180339887) % 1);
        if (Wd.t - (g.lastIn != null ? g.lastIn : -1e9) < hw * (g.boundary ? jit : 1.5)) continue;
        const s0 = g.boundary ? Lb / 2 + 2 : r.ends.in.s + 2, ahead = Math.max(Lb * (1 + P['traffic.entryRoomLengths']) + P['traffic.minimumGap'], S * 0.5);
        if (sc === act && seen(act, sc, X.pathAt(r.path, s0), 40)) continue; // the screen in view: only from beyond the district edge, out of sight
        if (!roomAt(Wd, g, r, s0, ahead, S * 0.5) || queued(g)) continue;
        spawn(Wd, r, s0); g.lastIn = Wd.t; if (++n >= target + 1) break;
      }
      F.rr = (F.rr + 1) % Math.max(1, cands.length);
    }
    for (const s of Wd.sims) { // off-screen: no jam survives out of sight; a finished shift's unseen cars go
      if (!s.cars.length) continue;
      s.cars = s.cars.filter((c) => { if (seen(act, s.sc, c)) return true; if ((c.stopT || 0) > cull) { Wd.culled++; return false; } if (exhausted && c.shift) return false; return true; });
    }
  }
```

### prototypes/p6/game.js · render (lines 3060–3067) · for P7#known-gaps:11
```js
  function render() {
    if (!app.nameEntry && document.activeElement === nameInput) nameInput.blur(); // Edit 88: the hidden name field never keeps the keys
    ctx.setTransform(scale, 0, 0, scale, ox, oy);
    ctx.imageSmoothingEnabled = false;
    { const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, FT.bg[0]); g.addColorStop(0.5, FT.bg[1]); g.addColorStop(1, FT.bg[2]); ctx.fillStyle = g; ctx.fillRect(-ox / scale - 1, -oy / scale - 1, cv.width / scale + 2, cv.height / scale + 2); } // Edit 76: the margins
    renderScreen();
    if (TOUCH.on) { ctx.setTransform(scale, 0, 0, scale, 0, 0); drawTouch(); }
  }
```

### prototypes/p6/game.js · partEffects (lines 2294–2306) · for P7#known-gaps:11
```js
  function partEffects(s) { // the abilities the damage has cut, as shown on the chassis panel
    const out = [], pc = (v) => Math.round(v * 100) + '%';
    const sp = s.partEffect('speed'), tu = s.partEffect('turn'), vw = s.partEffect('view'), th = s.partEffect('throw');
    const da = s.partEffect('dash'), rc = ABIL ? s.partEffect('recharge') : 1;
    if (sp < 0.995) out.push(['SPEED', pc(sp)]);
    if (da < 0.995) out.push(['DASH', pc(da)]);
    if (rc < 0.995) out.push(['RECHARGE', pc(rc)]); // Edit 77: torso damage slows the battery
    if (tu < 0.995 && !ABIL) out.push(['TURN', pc(tu)]);
    if (vw < 0.995) out.push(['VIEW', Math.round(s.coneWidth()) + '°']);
    if (s.armsBroken() && (s.has('carry') || s.has('throw'))) out.push(['CONE', 'NO GRIP']);
    else if (th < 0.995 && s.has('throw')) out.push(['THROW', pc(th)]);
    return out;
  }
```

### prototypes/p6/game.js · controlItems (lines 2992–2992) · for P7#known-gaps:12
```js
  const controlItems = () => (TOUCH.on ? ['Adjust layout', 'Reset layout', 'Back'] : ['Back']); // Edit 87
```

### prototypes/p6/game.js · controlRows (lines 2993–3008) · for P7#known-gaps:12
```js
  function controlRows(s) { // the device in hand: keys, a gamepad, or touch; a locked verb names what unlocks it
    const d = deviceOf(), lock = (n, label) => (s.has(n) ? '' : STORY ? 'A Farsight drone brings it' : 'Locked: ' + label + ', by drone'), K3 = { keys: 0, pad: 1, touch: 2 }[d];
    const nm = (n, w) => (STORY && !s.has(n) ? '???' : w); // Edit 90: a verb not yet fitted is not named
    const rows = [
      ['MOVE', ['WASD / arrows', 'Stick / d-pad', 'Stick, left'][K3], ''],
      [STORY && s.dashFitted && !s.dashFitted() ? '???' : 'DASH', ['Space / K', 'A', 'A'][K3], STORY && s.dashFitted && !s.dashFitted() ? 'A Farsight drone brings it' : '', STORY ? 'Out of a dash, the jump is free' : ''], // Edit 91: Battery 1 is the dash
      [nm('jump', 'JUMP'), ['L / Shift', 'B', 'B'][K3], lock('jump', 'Legs 1')],
      [nm('carry', 'GRAB'), ['J / E', 'X', 'X'][K3], lock('carry', 'Hands 1'), s.P['abilities.hands.tapDrop'] ? 'Tap: pick up a cone. Tap with none in reach: put one down' : 'Hold to put a cone down'],
      [nm('push', 'PUSH OFF A CAR'), ['I / Q', 'Y', 'Y'][K3], lock('push', 'Arms 1')],
      ['PAUSE', ['Esc / P', 'Start', '❚❚'][K3], ''],
    ];
    if (d === 'keys') rows.push(['TUNING', 'T', ''], ['GAMEPAD SETUP', 'G', '']);
    if (d === 'pad') rows.push(['GAMEPAD SETUP', 'Hold Start', '']);
    if (d === 'touch') rows.push(['FULL SCREEN', '⤢', '', app.touchCfg ? 'Your layout: Adjust layout to change' : 'Adjust layout: move and size the stick and buttons']);
    return { d, rows };
  }
```

### prototypes/p6/game.js · touchOn (lines 366–374) · for P7#known-gaps:12
```js
  function touchOn() {
    if (TOUCH.on) return;
    TOUCH.on = true; document.body.classList.add('touch');
    const rot = document.createElement('div'); rot.id = 'rotate'; rot.hidden = true;
    rot.innerHTML = '<div><b>Turn your phone sideways</b><br>DUMMIES plays in landscape.<br><small>Tap for full screen, where the phone allows.</small></div>';
    document.body.appendChild(rot); TOUCH.rot = rot; rot.addEventListener('pointerdown', fullscreen);
    for (const t of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel']) cv.addEventListener(t, touchEvent, { passive: false });
    resize();
  }
```

### prototypes/p6/game.js · pollPad (lines 313–338) · for P7#known-gaps:13
```js
  function pollPad(dt) {
    pad.mx = pad.my = 0; pad.bHeld = false; pad.xHeld = false;
    if (!pad.st) return;
    let list = null;
    try { list = navigator.getGamepads ? navigator.getGamepads() : null; pad.blocked = false; }
    catch (e) { pad.blocked = true; } // a hosting page can forbid the gamepad feature; keys and touch still work
    if (app.padCmd === 'setup') { window.PADS.startSetup(pad.st, PADCFG); toast('Pad setup: press the button for ' + PAD_NAME[PADCFG.actions[0]]); }
    else if (app.padCmd === 'cancel') pad.st.setup = null;
    app.padCmd = null;
    const was = pad.st.setup, o = window.PADS.read(pad.st, list, PADCFG, dt || 1 / 60); pad.info = o;
    if (o.setup && o.setup !== was) toast('Pad setup: press the button for ' + PAD_NAME[o.setup]);
    if (was && !o.setup) toast('Pad buttons saved for this browser');
    if (!o.id || o.setup) { pad.dirs = {}; pad.prevB = false; return; }
    if (o.move) { pad.mx = o.move.x; pad.my = o.move.y; app.device = 'pad'; }
    pad.bHeld = !!o.held.b; pad.xHeld = !!o.held.x;
    if (o.a) { q.a++; menuQ.push('ok'); Snd.init(); app.device = 'pad'; }
    if (o.b) { q.b++; menuQ.push('back'); app.device = 'pad'; }
    if (!pad.bHeld && pad.prevB) q.bUp++;
    pad.prevB = pad.bHeld;
    if (FOUR && o.x) { q.x++; app.device = 'pad'; }
    if (FOUR && o.y) { q.y++; app.device = 'pad'; }
    if (o.start) menuQ.push('pause'); // a short press; holding START opens setup
    const now = { up: pad.my < -0.6, down: pad.my > 0.6, left: pad.mx < -0.6, right: pad.mx > 0.6 };
    for (const d of ['up', 'down', 'left', 'right']) if (now[d] && !pad.dirs[d]) menuQ.push(d);
    pad.dirs = now;
  }
```

### prototypes/p6/game.js · drawTouchEdit (lines 469–479) · for P7#known-gaps:13
```js
  function drawTouchEdit(L) { // over the paused game: a veil, the two controls ringed, the toolbar
    const ed = app.touchEdit; if (!ed) return;
    const ring = (x, y, r, on) => { ctx.save(); ctx.setLineDash([8, 6]); ctx.lineWidth = on ? 4 : 2; ctx.strokeStyle = on ? C.dummy : FT.edge; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke(); ctx.restore(); };
    ring(L.home.x, L.home.y, L.sr + 10, ed.sel === 'stick'); ring(L.c.x, L.c.y, L.sp + L.fr + 10, ed.sel === 'face');
    const bar = editBar(L), cfg = app.touchCfg || {}, k = (cfg[ed.sel] && cfg[ed.sel].k) || 1;
    panel(bar.x, bar.y, bar.w, bar.h);
    txt('TOUCH LAYOUT', bar.x + 20, bar.y + 34, fLab, FT.accent);
    txt('Drag the stick or the buttons anywhere. Tap one to size it.', bar.x + 20, bar.y + 62, '400 17px ' + F_UI, FT.text);
    txt((ed.sel === 'stick' ? 'MOVE STICK' : 'Y X B A BUTTONS') + ' · ' + Math.round(k * 100) + '%', bar.x + bar.w - 20, bar.y + 34, '700 16px ' + F_UI, C.dummy, 'right');
    for (const [key, label] of [['minus', '−  SIZE'], ['plus', '+  SIZE'], ['reset', 'RESET'], ['done', 'DONE']]) { const c = bar[key]; glassKey(c.x, c.y, c.w, c.h); txt(label, c.x + c.w / 2, c.y + c.h / 2 + 6, '700 16px ' + F_UI, key === 'done' ? C.dummy : FT.text, 'center'); }
  }
```