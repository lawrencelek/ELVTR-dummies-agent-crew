# DUMMIES — Prototype 7.9: Arcade and Story

**Prototype 7.9 · 28 October 2026 · Lawrence Lek** · Spec: GDD Edits 81–90 (proposed), on Prototype 6.10 (Edit 80). Prototypes 7 to 7.8 stay frozen as `dummies_p7.html` to `dummies_p7_8.html`; 6.4–6.10 in `../p6/`.

Prototype 7.9 (Edit 90): fixes from play.
- **Dash, then jump:** the jump out of a dash is free (`battery.dashJumpCost` 0). It used to need a second charge, so it failed on one charge.
- **Cones:** X picks a cone up; X with no cone in reach puts one down (`abilities.hands.tapDrop` 1). The hold still works.
- **Button labels:** in menus A reads OK and B BACK, X and Y blank. In play a button names its verb only once fitted; X reads GRAB or DROP.
  - Pause › Controls shows ??? for a part not yet issued. A locked button pressed says "Not fitted yet".
- **Progression:** unchanged from 7.8. The proposal (Zelda-like: every part by drone on a fixed tile, DASH after A1) is charted in the Test City Playthrough page.

Prototype 7.8 (Edit 89): touch everywhere; levels, not credits; the workshop.
- **Touch on every menu:** tap a mode, a district, ◀ ▶, START, a save slot and its action, a key, a tile, DEPLOY, the card, the report, the gift screen, a pause row, a workshop part, FIT, DONE.
  - A mouse click does the same on desktop. The face buttons still work: A selects, B goes back.
- **Touch turns on** at the first touch on any screen. Phones with a stylus (S Pen) report a fine, hovering pointer; the old test missed them.
- **Story levels from points** (`story.level.*`): level 2 at 6,500 points; each level needs 2,000 more than the last; top level 9.
  - Each level-up grants `story.level.upgrades` (1) upgrade. 8 upgrades fit the 8 levels the drones do not bring.
  - LEVEL UP across the field when the points cross: a fanfare, rays, a burst from the stats box. Play goes on.
  - Story has no credits. The stats box reads POINTS and LEVEL, with a bar to the next level and a +n badge for unspent upgrades.
- **The workshop:** the next chassis, large, in the middle. Battery, Legs, Hands, Arms around it, each wired to its seat.
  - A card: the part, its button, level pips, what it does now, the next level and its cost. A part not yet issued: dark, "???".
  - It opens after the report when an upgrade fits an open part. A fits; B, or DONE, deploys. A fit flashes on its seat.
  - Arcade uses the same workshop, with credits.
- **Hook:** level 2 within two bodies (Battery 1); Legs 1 by drone at C1; each later level adds a level to a part the drones opened.
  - At 3,500 points a body, the last upgrade fits at Waterfront A3; with no combos (3,300), all 8 by the end; at 5,000, by Parkland B2.

Prototype 7.7 (Edit 88): save games.
- **STORY opens the save screen:** NEW GAME, then three slots (`story.saveSlots`).
- **A slot:** its name, its time stamp (the last save, local time), and the story's progress.
  - Where it stands: district, tile in test, tile number; write-offs on the tile.
  - Tiles cleared, points, level, chassis (7.8: level, not credits).
- **Actions:** CONTINUE · RENAME · ERASE (A twice). An empty slot: NEW GAME.
- **NEW GAME:** the first empty slot. All in use: pick one to overwrite (A twice).
- **Names:** up to `story.saveNameMax` (12) characters: A–Z, 0–9, space, - . '. Default TEST DUMMY 1–3.
  - Keyboard: type; Enter OK; Backspace deletes; Esc cancels.
  - Stick or pad: a letter grid; A types; B deletes; START OK. Touch: tap the keys, or tap the name for the phone's keyboard.
- **Saving:** automatic, into the slot in play, after every count, clear, gift and purchase. A rename keeps the time stamp.
- **7.6's story** moves into slot 1 once. 7.1–7.6 keep theirs.

Prototype 7.6 (Edit 87): one top edge; touch controls the player places.
- **One top edge:** BODY, the field and a new POINTS · CREDITS box start level. The box is BODY's size; the chassis sits under it.
  - Arcade's box: POINTS · CARS LEFT (kept: the shift's clock).
- **Top strip:** the objective, from the field's left edge. Toasts take it in turn. No top bar in play.
- **District panel:** titled [MAP] · [TILE], e.g. MONUMENT · A1. The level follows off the ground: · Z1, · STAIRS, · DRONE.
- **Touch chips:** ❚❚ PAUSE and ⤢ FULL, small, top left, over BODY.
- **Touch layout** (Pause › Controls › Adjust layout): drag the stick or the Y X B A diamond anywhere; − SIZE and + SIZE; RESET; DONE.
  - Sizes `ui.touch.scaleMin` (0.6) to `ui.touch.scaleMax` (1.6) of the default, in steps of `ui.touch.scaleStep` (0.1).
  - Saved in this browser. Reset layout restores the defaults.
- **Defaults:** everything inside the 16:9 frame. On a wider phone (S25 Ultra, 19.5:9) the side margins are free for the player's own placement.

Prototype 7.5 (Edit 86): a clean screen.
- **No row under the screen.** The stage fills the window. Options and controls live in the pause menu (ESC, START, ❚❚).
- **Pause:** Resume · Story map (or Restart, Refuse) · Options · Controls · Show trace · Quit to title.
  - Options: Sound · Palette · Full screen · Tuning panel · Gamepad setup. Touch leaves out the last two.
  - Controls: the device in hand: keyboard, gamepad or touch. Locked verbs dimmed, with the module that unlocks them.
- **BODY as tall as DASH:** the district map rises; the touch stick gets the room. No FARSIGHT wordmark in play.
- **CARS LEFT:** Arcade only, its clock. Story has no clock.

Prototype 7.4 (Edit 85):
- **Story traffic per tile:** `story.traffic.<district>.<tile>` scales the density of the tile in test and its neighbours. Arcade keeps one per district.
  - Busier openings: Monument A1 and B1 have about 40–70% more cars in view. Parkland's thin tiles run 1.5–2×.
  - A neighbour with a roundabout stays at the district rate, so no ring fills out of sight.
- **Every highway a flight and a drop gap:** a lit break in the parapet over each road beneath. Waterfront's bridges gain a flight from the beach.
- **Cones in view:** never on a road, never under a highway, never behind a building.

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

- **`dummies_p7_9.html`:** the game. Open in a browser; no server.
- **Live (GitHub Pages):** https://lawrencelek.github.io/ELVTR-Multiagent-Submission-5/ (game), `/jump/`, `/controls/`, `/p7-8/` (Prototype 7.8), `/p7-7/` (Prototype 7.7), `/p7-6/` (Prototype 7.6), `/p7-5/` (Prototype 7.5), `/p7-4/` (Prototype 7.4), `/p7-3/` (Prototype 7.3), `/p7-2/` (Prototype 7.2), `/p7-1/` (Prototype 7.1), `/p7/` (Prototype 7), `/p6-10/` (Prototype 6.10).
- **`p7_9_page.html`:** the same page for Claude's hosted preview (touch and keys; no gamepads).
- **`dummies_p7_8.html`:** Prototype 7.8 (Edit 89). Frozen.
- **`dummies_p7_7.html`:** Prototype 7.7 (Edit 88). Frozen.
- **`dummies_p7_6.html`:** Prototype 7.6 (Edit 87). Frozen.
- **`dummies_p7_5.html`:** Prototype 7.5 (Edit 86). Frozen.
- **`dummies_p7_4.html`:** Prototype 7.4 (Edit 85). Frozen.
- **`dummies_p7_3.html`:** Prototype 7.3 (Edit 84). Frozen.
- **`dummies_p7_2.html`:** Prototype 7.2 (Edit 83). Frozen.
- **`dummies_p7_1.html`:** Prototype 7.1 (Edit 82). Frozen.
- **`dummies_p7.html`:** Prototype 7 (Edit 81). Frozen.
- **`story.js`:** Story mode. `StorySim` extends the P6 player sim (`../p6/world6.js`): start tile, fences, the brief, clears, levels and upgrades (Edit 89), the drone ferry, verb delivery. `ArcadeSim`: one district a run, the verbs by drone. `P7SIM`, the P7.2 physics for both modes. Runs headless in Node.
- **`../../content/story/story.json`:** the story's content: the order of tiles, 27 tales, Farsight's briefs and gifts. Numbers are registry IDs.
- **`../p6/game.js`, `../p6/world6.js`, `../p6/sim.js`:** the shared game code: the title, the story map, the tile card, fences, the gift screen, the story's HUD.
- **`build.py`:** `python3 build.py` → both pages. `../p6/build.py` refuses: 6.10 is frozen.
- **`test_p79.js`:** `node test_p79.js [screenshot folder]` → the checks; screenshots into the folder.

## Title

| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a mode | arrows | stick or d-pad | stick |
| Select | SPACE | A | A |
| Back | SHIFT | B | B |

- **ARCADE** → the district list and difficulty. A cleared district ends the run: Licensed.
- **STORY** → the save screen (Edit 88). Its card names the latest save.

## Save games (Edit 88)

| | Keys | Gamepad | Touch |
|---|---|---|---|
| Choose a row | arrows | stick or d-pad | stick, or tap |
| Choose an action | left, right | stick or d-pad | tap |
| Select | SPACE | A | A, or tap |
| Back | SHIFT or ESC | B | B |

- **Rows:** NEW GAME; slots 1–3 (`story.saveSlots`). The cursor starts on the latest save.
- **A slot card:** number, name, time stamp (DD MON YYYY · HH:MM, local); IN PLAY on the slot in play.
  - "MONUMENT · C2 · TILE 4 OF 27". "3 / 27 TILES · 2,450 POINTS · LEVEL 1 · CHASSIS 04".
- **CONTINUE:** the story map of that slot. **RENAME:** the name entry; the time stamp stays. **ERASE:** A twice.
- **NEW GAME:** the first empty slot, then its name. None empty: choose a slot; OVERWRITE asks twice.
- **Name entry:** `story.saveNameMax` (12) characters, upper case: A–Z, 0–9, space, - . '. The default (TEST DUMMY n) is selected: typing replaces it.
  - Keys: type it; Enter OK; Backspace deletes; Esc cancels. Pad and stick: the grid; A types; B deletes (empty: cancels); START OK.
  - Touch: tap the grid's keys; tap the name for the phone's own keyboard.
- **Stored** in this browser: `dummies.p7.save1`–`3`. 7.6's `dummies.p7.story` moves into slot 1 once and stays for 7.1–7.6.

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
  - A verb is never fitted with an upgrade. Its workshop card stays dark until the drone.
- **Levels** (Edit 89): points raise the dummy's level. `story.level.firstPoints` (6,500) to level 2; each next level `story.level.stepPoints` (2,000) more; to `story.level.max` (9).
  - Levels 2–9 at 6,500, 15,000, 25,500, 38,000, 52,500, 69,000, 87,500, 108,000 points.
  - A level-up grants `story.level.upgrades` (1) upgrade. An upgrade fits the next level of an open part: Battery from the start; Legs, Hands, Arms once their verb arrives.
  - No upgrade, or nothing it fits: the report goes straight to the next chassis. Unspent upgrades wait.
  - No credits in Story. Arcade keeps `economy.creditsPerWriteOff` and `economy.price.ability.level1`–`level3` (1, 2, 3).
- **No clock:** a district's traffic runs `story.shiftCars` (5,000) cars. No Failed test.
- **Traffic per tile** (Edit 85): `story.traffic.<district>.<tile>` × the district's density, on the tile in test and its four neighbours; the rest of the district at 1.
  - A neighbour with a roundabout stays at 1 (Parkland B2, C3; Waterfront B2).
  - Cars still enter the view only across its edges. Out of view, a car stopped `traffic.offscreenCullSeconds` (12 s) is removed.
  - Scales above 1: Monument A1 1.5, B1 1.75; Parkland C1 1.75, C2 1.75, B3 1.25, A3 2, A2 1.5, B1 2, B2 1.25; Waterfront B1 1.5, C2 1.5, A2 1.5.
- **The map:** uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength. The cursor reads any revealed tile's tale.
- **Saved** into the slot in play after every count, clear, gift and purchase. A reload: STORY, CONTINUE resumes the tile in test.
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

## Highways and cones (Edit 85, both modes)

- **Every highway has a flight** (`world.deckFlightsMin` 1). Waterfront's bridges: one each, from the beach (A2 west, C2 east).
- **Every highway breaks its parapet over each Z0 road beneath** (`world.deckDropGaps`): one `world.tileSize` module on the road's centre line, south or east (the other side where a flight stands). Drawn lit: white snapped ends, a cyan edge. Walk off it and drop onto the road.
  - Parkland B1's highway crosses no road: no gap (D70).
- **Cones:** on the pavement beside a road, never on it; never under a highway, ring or walkway, never behind a building (`props.cone.minVisible` 0.9).

## Arcade

- **One district a run.** Its quota of write-offs: Licensed. Traffic: one density per district (`world.district.<id>.interval`).
- **Verbs** (Edit 84): the story's, in its order. One per `arcade.giftEvery` (1) write-offs.
  - It comes after the workshop, by drone, to the next chassis; the same gift screen. Never sold: its card stays dark.
  - Monument (4 write-offs) sees all three; Waterfront (3) Legs 1 and Hands 1; Parkland (2) Legs 1 (D69).
- **Bottom line:** the quota and the next verb, e.g. "Write off 3 bodies (0 of 3). Legs 1 comes with the next write-off."

## The gift screen (Edit 84)

- **In the field:** the drone flies high with an aqua case under it, pulsing. A chime as it comes in. It hovers and lowers the case onto the dummy.
- **The screen:** the world holds. The chassis at four times art scale, dimmed; brackets pulse on the module's seat.
  - A drone brings the module down over the head and lets go. It falls onto its part over `ui.gift.fallSeconds` (0.7 s), glowing, trailing.
  - It lands: the chassis lights up; the module flashes white; a ring, sparks and turning rays; a shake; one white flash.
  - Sound (original): a whoosh as it falls, a thud, a rising D-major arpeggio, a held chord over the root, a sparkle.
  - Then NEW VERB INSTALLED: the name pops in; the button and its verb; what it does; NOW IN THE WORKSHOP: the next level (Story: 1 upgrade; Arcade: its price).
- **A** after `ui.gift.holdSeconds` (1.2 s): "A ON TO C1" in a ferry, "A CONTINUE" otherwise. Mashed presses before that do nothing.
- **Reduced motion:** no fall, shake or turning rays. The module fades in.

## HUD (story)

- **One top edge** (Edit 87): BODY, the field's bezel and the stats box start level. No top bar in play; no CARS LEFT (no clock).
- **Left column** (Edit 86–87): BODY (as tall as DASH: the number on its label's row, the bar beneath), DASH, the district map. No FARSIGHT wordmark in play.
- **Right column** (Edit 87, 89): POINTS · LEVEL (BODY's size; a bar to the next level; +n for unspent upgrades); the chassis and LAST HIT on one row. Desktop: the key panel at the foot.
- **LEVEL UP** (Edit 89): across the field as the points cross a level. A fanfare; rays; a burst from the stats box. Play goes on.
- **District map:** titled [MAP] · [TILE] and the level off the ground. Uncleared tiles greyed out; the live tile ringed in yellow; cleared tiles at full strength.
- **Top strip** (Edit 87): the objective, e.g. "OBJECTIVE · B1 · Write off a body. Last hit: drop onto a car (0 of 1)." A toast takes it while it lives. With a drone: "Bringing Legs 1, then on to C1." Arcade: the quota and the next verb.
- **Touch** (Edit 87): ❚❚ PAUSE and ⤢ FULL small, top left. The stick under the map; the Y X B A diamond under the chassis.
  - Pause › Controls › Adjust layout: drag either anywhere, the side margins of a wide phone included; − SIZE / + SIZE (0.6–1.6×); RESET; DONE. Saved in this browser.
- **Speech bubbles:** car barks sit on the cars again, legible in the frame layer. Speech solid, shout doubled, mutter dashed, thought dotted.
- **Tile card** on arrival: the tile's number of 27, its title, its tale, the brief and its count, the verb it brought. A begins.
- **Report:** counted or not, and why; the level (LEVEL UP: 1 → 2), points to the next, a bar; the upgrades and whether the workshop is next.
- **Workshop** (Edit 89): the next chassis, large; Battery, Legs, Hands, Arms around it, wired to their seats. Pips, now, next, cost. Parts not yet issued: "???". FIT, DONE.
- **Pause** (ESC, START, ❚❚): Resume · Story map · Options · Controls · Show trace · Quit to title. The tile's count is kept; the body in play is lost.
  - Options: Sound · Palette (reloads; the story saves first) · Full screen · Tuning panel · Gamepad setup · Back.
  - Controls: the device in hand. Keyboard: WASD/arrows, Space/K, L/Shift, J/E, I/Q, Esc/P, T, G. Gamepad: stick, A, B, X, Y, Start, hold Start. Touch: stick, A, B, X, Y, ❚❚, ⤢; Adjust layout · Reset layout · Back. A verb not yet fitted reads ??? (Edit 90).
- **Touch buttons** (Edit 90): menus: A OK, B BACK. Play: the verb once fitted (A DASH, B JUMP, X GRAB or DROP, Y PUSH); unfitted: the letter alone, dimmed.
- **Tuning (T):** `proto.recoilScale`, `proto.bounce.maxThrow`, `story.ferryDepth`, `economy.creditsPerWriteOff`, `story.level.firstPoints`, `story.level.stepPoints`, `story.level.max`, `story.level.upgrades`, `arcade.giftEvery`, `ui.gift.fallSeconds`, `ui.gift.holdSeconds`, `story.task.comboEasy`, `story.task.comboHard`, the 27 `story.writeOffs.<district>.<tile>`, the 27 `story.traffic.<district>.<tile>`. From the next deploy.

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

![P7.4: Waterfront A2: a flight up from the beach to the bridge](docs/p74_bridge_flight.png)

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

- `node test_p79.js docs` → 89/89.
  - Edit 90: one charge left, dash then B: a dash jump in Story and Arcade, denied under 6.10's rules; Hands 1: a tap picks up, a tap away from cones puts down (6.10 keeps the hold); in play at A1 the buttons read A DASH, B X Y blank; paused, A OK, B BACK; Controls: MOVE, DASH, ???, ???, ???.
  - Levels (Edit 89): levels 2–9 at 6,500 to 108,000; the fill at 3,500 a body lands at Waterfront A3, with no combos all 8, at 5,000 by Parkland B2. Headless: no credits in Story; the report reads the level; level 1, no workshop; three bodies, level 2 and its event; the workshop fits Battery 1 only (Legs shut); "level up first"; a million points, level 9, 7 upgrades, Legs 2 and Battery 2 open. In the page: LEVEL UP in play; the workshop opens on Battery; A fits; locked parts dark.
  - Touch (Edit 89): a stylus phone turns touch on at the first touch; then by taps alone: ARCADE, a district, ▶, B, STORY, NEW GAME, OK, a tile, DEPLOY, the card, ❚❚, Options, Back, Resume, the report, FIT, DONE.
  - Save games (Edit 88): STORY opens the save screen, three empty slots; NEW GAME names slot 1 (TEST DUMMY 1 offered; typed CRASH-TESTER, 12 of 12); the slot saves points and credits after a write-off; a reload offers the latest slot first, its time stamp and lines; CONTINUE resumes. 7.6's story moves into slot 1. The grid types a name; all three in use: OVERWRITE asks twice; RENAME keeps the time stamp; ERASE asks twice; ESC cancels. Each slot keeps its own story. Touch: tap NEW GAME, keys, the name (the phone's keyboard), OK; tap RENAME.
  - Content: the orders; neighbours; 27 tales, tasks, verbs; registry IDs (edit90), 27 tile counts (35 bodies), 27 tile traffic scales, 5 earlier IDs retired; the fill lands on Waterfront B2 (body 34 of 35); the verbs at Monument C1, A2, C3; every brief possible where set.
  - Headless: defaults; the ricochet; fences; the ferry; the shop refuses verbs; the gift phase; resume with a verb owed; Monument → Parkland; Waterfront B2 certifies. Arcade's verbs. Edit 85: 15 highways, each with a flight; 14 with drop gaps; 49 cone homes, none on a road, none hidden. Tile density. 6.4–6.10 and 7–7.8 byte-identical.
  - Browser: the title (P7.9); one top edge at y 34 (BODY 208 × 86, the field, POINTS · LEVEL 208 × 86; the chassis at 130); the objective on the top strip; the map titled MONUMENT · A1; Arcade's box POINTS · CARS LEFT; the touch zone from 430; Pause › Options and Controls; Arcade and its first verb; the story through B1's gift into C1; a reload.
  - Phones: 16:9 (640 × 360): the stick under the map, the diamond under the chassis, chips 76 × 26 above BODY. S25 Ultra (892 × 412): 139 units of margin a side, everything inside the 16:9 frame; the ❚❚ chip pauses; Controls offers Adjust layout · Reset layout · Back; the stick dragged into the left margin, the diamond into the right; + SIZE twice ×1.20; size held to 0.6–1.6; DONE saves; the moved stick walks the dummy; a reload keeps the layout; Reset restores it. No page errors.
- `../p6/test_p610.js` → 47/47 (6.10's rules on the shared code). `../p6/test_sim.js` → 104/104. `../p6/test_p6.js` → 72/73 (Parkland's street-emptiness limit, as on 6.4).
- `../jump/test_jump.js` → 28/28. `../controls/test_controls.js` → 34/34.

## Known gaps

- Tales and briefs are proposals (status Proposed in `story.json`). The tile counts are proposals too (D65).
- Points come from every body, so replaying a cleared tile levels sooner. Missed briefs do too.
- Level pacing assumes about 3,500 points a body; a combo player levels faster and fills the parts by Parkland's end.
- Three slots, in this browser only: no cloud save, no export. A 7.7 save's credits are ignored; its points give its level.
- A slot's time stamp is the browser's local time.
- Barks still name the district, not the tile.
- Short Arcade districts end before every verb arrives: Parkland Legs 1 only; Waterfront Legs 1 and Hands 1 (D69).
- Parkland B1: no road under its highway, a street empty 67% of the time, a cone brief (D70).
- Tile scales raise culls out of view: 27 in 54 min of soak (9 at 1). The player never sees them.
- The fanfare is synthesised in the page (Web Audio): placeholder sound until a composed sting.
- Touch layout: one saved layout a browser, as fractions of the screen; a phone turned between screen shapes keeps the fractions. A placed control can cover a panel (the player's choice).
- The diamond moves and sizes as one; its four buttons do not separate.

## Build

`python3 build.py` → `dummies_p7_9.html` and `p7_9_page.html`.
