# DUMMIES — Prototype 7.3: Arcade and Story

**Prototype 7.3 · 28 October 2026 · Lawrence Lek** · Spec: GDD Edits 81–84 (proposed), on Prototype 6.10 (Edit 80). Prototypes 7, 7.1 and 7.2 stay frozen as `dummies_p7.html`, `dummies_p7_1.html` and `dummies_p7_2.html`; 6.4–6.10 in `../p6/`.

Prototype 7.3 (Edit 84), option B: verbs are issued, levels are bought.
- **Verbs:** Legs 1, Hands 1, Arms 1. Never sold. Monument issues one every three tiles: C1, A2, C3.
- **Briefs follow:** B2 struck, A2 cone, B3 jump, C3 push. Each verb is used on the tile that issues it.
- **The drone brings it, in view:** an aqua case under the ferry drone. It hovers over the dummy and lowers the case onto it.
- **The gift screen:** the world holds. The chassis, large. A drone brings the module over the head and lets go; it falls onto its part.
  - It lands with a flash, a ring, sparks, rays, a shake and a fanfare. Then the verb: name, button, what it does, the next level in the shop.
  - A continues after `ui.gift.holdSeconds` (1.2 s). Then the drone carries the dummy across.
- **Arcade:** the same verbs, in the same order, one per write-off (`arcade.giftEvery`), by drone to the next chassis. Same screen.

Prototype 7.2 (Edit 83):
- **Defaults:** two dashes, standard recharge, standard recoil, no other ability. Arcade and Story.
- **Story economy:** the upgrade tracks fill only at the end of Waterfront. 35 bodies; the verbs are the only gifts.
- **The ricochet tamed:** a knock keeps `proto.recoilScale` (0.7) of its momentum and slides at most `proto.bounce.maxThrow` (40). Head-on: 98 u/s, 26 units (was 193, 127).
- **The drone ferry:** a clear calls a Farsight drone. It carries the dummy across the edge into the next tile, off the road near the crossing.
- **Fences:** only toward tiles not yet open; drawn as a yellow glow at the screen's edge, as in Zelda. Nothing across the road.
- **Map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength.
- **Speech bubbles** on the cars again. **The objective** on the bottom line.

Prototype 7.1 settled Prototype 7's open questions (D63–D66).
- **Credits:** one credit a body destroyed, in both modes (`economy.creditsPerWriteOff`).
- **Story prices:** level 1 costs 3, level 2 costs 4, level 3 costs 5. Arcade keeps 1, 2, 3.
- **Write-offs per tile:** each tile has its own count, 1 to 3: 62 bodies in all (P7: 81).
- **Arcade:** one district a run. **Briefs:** only the last hit counts.

The title has two modes.
- **ARCADE:** the 6.10 game. Pick Parkland, Waterfront or Monument; each district is a whole run.
- **STORY:** the Test City, tile by tile. Monument, then Parkland, then Waterfront: 27 tiles.
  - Each tile has a short tale of how it came to be, and a brief from Farsight.
  - A tile is fenced until it is cleared. Cleared tiles stay open. The map opens as you go.

## Files

- **`dummies_p7_3.html`:** the game. Open in a browser; no server.
- **Live (GitHub Pages):** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-5/ (game), `/jump/`, `/controls/`, `/p7-2/` (Prototype 7.2), `/p7-1/` (Prototype 7.1), `/p7/` (Prototype 7), `/p6-10/` (Prototype 6.10).
- **`p7_3_page.html`:** the same page for Claude's hosted preview (touch and keys; no gamepads).
- **`dummies_p7_2.html`:** Prototype 7.2 (Edit 83). Frozen.
- **`dummies_p7_1.html`:** Prototype 7.1 (Edit 82). Frozen.
- **`dummies_p7.html`:** Prototype 7 (Edit 81). Frozen.
- **`story.js`:** Story mode. `StorySim` extends the P6 player sim (`../p6/world6.js`): start tile, fences, the brief, clears, credits, prices, the drone ferry, verb delivery. `ArcadeSim`: one district a run, the verbs by drone. `P7SIM`, the P7.2 physics for both modes. Runs headless in Node.
- **`../../content/story/story.json`:** the story's content: the order of tiles, 27 tales, Farsight's briefs and gifts. Numbers are registry IDs.
- **`../p6/game.js`, `../p6/world6.js`, `../p6/sim.js`:** the shared game code: the title, the story map, the tile card, fences, the gift screen, the story's HUD.
- **`build.py`:** `python3 build.py` → both pages. `../p6/build.py` refuses: 6.10 is frozen.
- **`test_p73.js`:** `node test_p73.js [screenshot folder]` → the checks; screenshots into the folder.

## Title

| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a mode | arrows | stick or d-pad | stick |
| Select | SPACE | A | A |
| Back | SHIFT | B | B |

- **ARCADE** → the district list and difficulty. A cleared district ends the run: Licensed.
- **STORY** → the story map. **NEW STORY** appears once a story has begun; press it twice to erase.

## Story

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
- **Verbs** (Edit 84): Legs 1 at Monument C1, Hands 1 at A2, Arms 1 at C3. One every three tiles; nothing else is given.
  - The ferry drone into a verb's tile carries the module under it. It hovers, lowers it on a cable, and the gift screen opens.
  - A continues; the drone lifts the dummy and carries it across. B1 to C1 with Legs 1: 2.5 s to the screen, 3.4 s after A.
  - A save resumed with a verb owed: a drone delivers it, leaves, then the tile card.
  - The shop never sells a verb. Its card reads "GIFT AT A2".
- **Credits:** `economy.creditsPerWriteOff` (1) for every body written off, counted or not. A clear pays nothing extra.
  - Prices: `story.price.ability.level1` 3, `level2` 4, `level3` 5. A level-1 power-up is three bodies.
  - A track costs 12; Hands (two levels) 7. Arcade keeps `economy.price.ability.level1`–`level3` (1, 2, 3).
  - The rest costs 34. At one credit a body, bought as soon as affordable, the last level lands on Waterfront B2's first body. Monument buys 2 levels; Parkland 3 more.
  - Nothing affordable: the report goes straight to the next chassis.
- **No clock:** a district's traffic runs `story.shiftCars` (5,000) cars. No Failed test.
- **The map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength. The cursor reads any revealed tile's tale.
- **Saved** in this browser after every count, clear, gift and purchase. A reload resumes the tile in test.
- **The end:** clearing Waterfront B2 certifies the Test City.

### The 27 tiles

| # | District | Tile | Title | Brief: the last hit | Write-offs | Verb by drone |
|---|---|---|---|---|---|---|
| 1 | Monument | A1 | The LED wall | ANY WRITE-OFF | 1 | — |
| 2 | Monument | B1 | The podium bridge | DROP ONTO A CAR | 1 | — |
| 3 | Monument | C1 | The LED drum | JUMP INTO A CAR | 1 | Legs 1 (jump) |
| 4 | Monument | C2 | The portal tower | ON A RAISED ROAD | 1 | — |
| 5 | Monument | B2 | The monument | STRUCK, NOT DASHING | 1 | — |
| 6 | Monument | A2 | The neon arcade | CONE-BAITED CAR | 1 | Hands 1 (cones) |
| 7 | Monument | A3 | The stacked cubes | COMBO ×2 | 1 | — |
| 8 | Monument | B3 | The LED canyon | JUMP INTO A CAR | 1 | — |
| 9 | Monument | C3 | The LED gateway | PUSH OFF A CAR | 2 | Arms 1 (push) |
| 10 | Parkland | C1 | The lantern pavilion | DROP ONTO A CAR | 1 | — |
| 11 | Parkland | C2 | The amphitheatre | A VAN | 2 | — |
| 12 | Parkland | C3 | The arch and the roundabout | THROWN INTO A CAR | 1 | — |
| 13 | Parkland | B3 | The obelisk court | A POLICE CAR | 1 | — |
| 14 | Parkland | A3 | The belvedere | JUMP INTO A CAR | 1 | — |
| 15 | Parkland | A2 | The canal | ON A RAISED ROAD | 2 | — |
| 16 | Parkland | A1 | The reservoir terraces | PUSH OFF A CAR | 1 | — |
| 17 | Parkland | B1 | The cascade | CONE-BAITED CAR | 1 | — |
| 18 | Parkland | B2 | The ring over the pools | COMBO ×3 | 2 | — |
| 19 | Waterfront | A1 | The west portal | A BUS | 1 | — |
| 20 | Waterfront | B1 | The tunnel portal | JUMP INTO A CAR | 2 | — |
| 21 | Waterfront | C1 | The east portal | A POLICE CAR | 1 | — |
| 22 | Waterfront | C2 | The east beach terrace | DROP ONTO A CAR | 2 | — |
| 23 | Waterfront | C3 | The east pier tower | THROWN INTO A CAR | 1 | — |
| 24 | Waterfront | B3 | The stilt houses | PUSH OFF A CAR | 1 | — |
| 25 | Waterfront | A3 | The west pier tower | ON A RAISED ROAD | 2 | — |
| 26 | Waterfront | A2 | The west beach terrace | CONE-BAITED CAR | 1 | — |
| 27 | Waterfront | B2 | The circus | COMBO ×3 | 2 | — |
- **Write-offs** (Edit 83): tuned so the tracks fill at the end. Monument 10, Parkland 12, Waterfront 13: 35 bodies (7.1: 62).
- **Every brief is possible where it is set.** Checked from 90 s of traffic per district: the class runs there; raised traffic for "on a raised road"; a raised floor over traffic for a drop; cones for a cone brief.
- **Every brief's verb arrives with its tile:** Legs 1 at Monument C1, Hands 1 at A2, Arms 1 at C3 (Edit 84: a verb every three tiles).

## Arcade

- **One district a run.** Its quota of write-offs: Licensed.
- **Verbs** (Edit 84): the story's, in its order. One per `arcade.giftEvery` (1) write-offs.
  - It comes after the shop, by drone, to the next chassis; the same gift screen. Never sold: "DRONE GIFT".
  - Monument (4 write-offs) sees all three; Waterfront (3) Legs 1 and Hands 1; Parkland (2) Legs 1 (D69).
- **Bottom line:** the quota and the next verb, e.g. "Write off 3 bodies (0 of 3). Legs 1 comes with the next write-off."

## The gift screen (Edit 84)

- **In the field:** the drone flies high with an aqua case under it, pulsing. A chime as it comes in. It hovers and lowers the case onto the dummy.
- **The screen:** the world holds. The chassis at four times art scale, dimmed; brackets pulse on the module's seat.
  - A drone brings the module down over the head and lets go. It falls onto its part over `ui.gift.fallSeconds` (0.7 s), glowing, trailing.
  - It lands: the chassis lights up; the module flashes white; a ring, sparks and turning rays; a shake; one white flash.
  - Sound (original): a whoosh as it falls, a thud, a rising D-major arpeggio, a held chord over the root, a sparkle.
  - Then NEW VERB INSTALLED: the name pops in; the button and its verb; what it does; NOW IN THE SHOP: the next level, its price.
- **A** after `ui.gift.holdSeconds` (1.2 s): "A ON TO C1" in a ferry, "A CONTINUE" otherwise. Mashed presses before that do nothing.
- **Reduced motion:** no fall, shake or turning rays. The module fades in.

## HUD (story)

- **Top bar:** district · tile · level (DRONE in a ferry); TILE n / its count; POINTS; CREDITS.
- **District map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength.
- **Bottom line:** the objective, e.g. "OBJECTIVE · B1 · Write off a body. Last hit: drop onto a car (0 of 1)." A toast takes it while it lives. With a drone: "Bringing Legs 1, then on to C1." Arcade: the quota and the next verb.
- **Speech bubbles:** car barks sit on the cars again, legible in the frame layer. Speech solid, shout doubled, mutter dashed, thought dotted.
- **Tile card** on arrival: the tile's number of 27, its title, its tale, the brief and its count, the verb it brought. A begins.
- **Report:** counted or not, and why; the body's credit; the cheapest next level and its price.
- **Pause:** Resume · Story map · Show trace · Quit to title. The tile's count is kept; the body in play is lost.
- **Tuning (T):** `proto.recoilScale`, `proto.bounce.maxThrow`, `story.ferryDepth`, `economy.creditsPerWriteOff`, `story.price.ability.level1`–`level3`, `arcade.giftEvery`, `ui.gift.fallSeconds`, `ui.gift.holdSeconds`, `story.task.comboEasy`, `story.task.comboHard`, the 27 `story.writeOffs.<district>.<tile>`. From the next deploy.

![P7.3: the ferry drone comes for the chassis in B1 with Legs 1 under it](docs/p73_drone_item.png)

![P7.3: it lowers the module onto the dummy](docs/p73_give.png)

![P7.3: the gift screen: a drone brings the module over the head](docs/p73_gift_drone.png)

![P7.3: the module falls onto the shins](docs/p73_gift_fall.png)

![P7.3: the landing: flash, ring, sparks, rays](docs/p73_gift_land.png)

![P7.3: Legs 1 installed; Legs 2 now in the shop](docs/p73_gift.png)

![P7.3: Arcade, Waterfront: Legs 1 after the first write-off](docs/p73_arcade_gift.png)

![P7.3: C1's card after the flight](docs/p73_brief_c1.png)

![P7.2: the story map, A1 cleared, B1 live](docs/p72_map_progress.png)

![P7.2: the drone carries the chassis from A1 to B1](docs/p72_ferry.png)

![P7.2: set down in B1 by the west edge, off the road; the objective on the bottom line](docs/p72_b1.png)

![P7.2: the fence: a yellow glow on A1's east and south edges](docs/p72_fence.png)

![P7.2: the tile card, Monument A1](docs/p72_brief.png)

![P7.2: phone, sideways](docs/p72_phone.png)

## Evidence

- `node test_p73.js docs` → 55/55.
  - Content: the orders; neighbours; 27 tales, tasks, verbs; registry IDs (edit84), 27 tile counts (35 bodies), 5 earlier IDs retired; the fill lands on Waterfront B2 (body 34 of 35); the verbs only Legs 1, Hands 1, Arms 1, at Monument C1 (#3), A2 (#6), C3 (#9); Monument's briefs reordered; every brief possible where set.
  - Headless: defaults in both modes; the ricochet; A1's fences; a real dash write-off clears A1; the ferry to B1; B1's fences; a missed write-off pays; back into cleared A1; Battery 1 at 3; the shop refuses Legs 1 ("gift at C1"); B1 cleared, the ferry drone brings Legs 1 (inbound › give › lift), the gift phase holds the world 2 s, A continues to C1; resume on C3 with Arms 1 owed (delivery, gift screen, the drone leaves, C3's card); Monument → Parkland C1; Waterfront B2 certifies. Arcade: Legs 1, Hands 1, Arms 1 after write-offs 1–3, none sold; `arcade.giftEvery` 2 waits; one district a run; prices 1, 2, 3. 6.4–6.10, 7, 7.1 and 7.2 byte-identical.
  - Browser: the title (P7.3); Arcade's pick, its objective line, its first verb by drone with the gift screen; the map; the tile card; the fence; the objective line; a report; the shop at 3; the ferry to B1 and its card; B1 cleared, the drone with Legs 1, the cable, the gift screen at four moments, A ignored before the hold, then C1's card; a reload resumes; a phone sideways; no page errors.
- `../p6/test_p610.js` → 47/47 (6.10's rules on the shared code). `../p6/test_sim.js` → 104/104. `../p6/test_p6.js` → 72/73 (Parkland's street-emptiness limit, as on 6.4).
- `../jump/test_jump.js` → 28/28. `../controls/test_controls.js` → 34/34.

## Known gaps

- Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- Credits come from every body, so replaying a cleared tile buys levels sooner. Missed briefs do too.
- One save slot, in this browser only. A P7 save loads into 7.1 with its credits.
- Barks still name the district, not the tile.
- Short Arcade districts end before every verb arrives: Parkland Legs 1 only; Waterfront Legs 1 and Hands 1 (D69).
- The fanfare is synthesised in the page (Web Audio): placeholder sound until a composed sting.

## Build

`python3 build.py` → `dummies_p7_3.html` and `p7_3_page.html`.
