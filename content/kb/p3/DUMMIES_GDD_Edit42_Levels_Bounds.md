# DUMMIES — GDD Edit 42: 400 × 320 field, bounded districts, three levels

**20 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.1, 4.2, 5.2, 6.2, 6.3, 7.1.1, 7.4, 7.7, 7.9, 8.3 and 11.3, after Edit 41.1.

- **Build:** P3.1, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 74/74.
- **Layouts:** 15 rebaked at 800 × 640 (`content/districts/districts.json`, 279 KB). The large-field test is removed.
- **Registry:** `tuning.parameters.json` `edit42-2026-10-20` (215 entries).
- **Decision log:** rows 142–151. Closes D27. Closes D29 in part.

## Decisions

| # | Decision | Status |
|---|---|---|
| 142 | Field 400 × 320 art px: 25 × 20 tiles, 5:4. World 800 × 640 | user-confirmed (closes D27) |
| 143 | Districts are bounded: the river on row 1, a wall on every other outer edge | user-directed; river on row 1 is the assistant's |
| 144 | A road leaving the district passes a checkpoint. Its boom lifts for cars. The dummy cannot pass | user-directed; "booms lift, cars never stop" is the assistant's |
| 145 | Three levels: 0 underground, 1 ground (default), 2 overground. One overground level; decks never cross | user-directed; "one overground level" is the assistant's reading |
| 146 | Stairs join the levels: an up-stair beside each deck; underpass stairs on both pavements | user-directed |
| 147 | A broken parapet over a road is a drop point. Landing on a car is a hit: the legs take it, and it scores | user-directed ("this has a damage cost"); scoring and legs are the assistant's reading |
| 148 | Decks have hard shoulders. Deck cars are full drivers on level 2 and sense only level 2 | proposed |
| 149 | Deck traffic is off the shift's schedule: not in CARS LEFT, not in the Failed test check. Hits on it count | proposed |
| 150 | Cues and tags show for cars on the dummy's level | proposed |
| 151 | Registry takes Edit 42 | proposed |

## 4.1 Art grid (rule replaced)

```markdown
- **Field: 400 × 320 art px, 5:4** (`ui.playWidth` 800, `ui.playHeight` 640 units).
  - 25 × 20 tiles of `world.tileSize` (32). No part-height row.
  - Screen 640 × 360 art px; field at (120, 20). ×3 at 1080p.
```

## 4.2 Interface (rows added)

```markdown
- **Level tag:** the top bar adds `DECK`, `UNDERPASS` or `STAIRS` after the screen name.
- **Cues follow the dummy's level.** Zones, paths, stop cues, roof pips and tags show for its level's cars only.
  - On a stair: the level it is nearer.
- **Deck:** drawn on its true footprint. The girder face and shadow show `world.deckHeight`.
- **Ground actors under a deck:** x-ray checkers (4.2.4 tier 1, unchanged).
- **Underground:** the passage shows as a dark band with a dotted edge. The dummy shows as a checker.
- **CARS LEFT** counts scheduled ground traffic only.
```

## 5.2 Movement (rules added)

```markdown
- **Stairs:** walked at × `world.stairSpeed` (0.7). No dash on a stair.
  - Entered at the foot from the ground; at the head from a deck or a passage.
  - Their sides are solid on the ground.
- **Drop:** walking, dashing or being shoved through a broken parapet.
  - Lasts `world.dropSeconds` (0.35 s). No control and no contact until the landing.
  - Carries the dummy clear of the deck edge. Speed capped at `movement.runSpeed`.
  - Open ground: the dummy recovers (`movement.lungeRecovery`).
  - On a car: a hit from above (8.3).
- **Cones stay on the ground.** No pickup, drop or throw off level 1.
```

## 6.2 Locomotion and traffic (rules added)

```markdown
- **Deck traffic:** full drivers on level 2, same models as the ground.
  - Two lanes per deck, one each way. One car per lane every `world.deckInterval` (2.4 s).
  - A screen is entered with its decks already running.
  - Swerves keep the car's outer side inside the parapet.
  - Off the schedule: not admitted, not in CARS LEFT, gone at the screen edge.
- **Checkpoint booms** lift for a car on their level within `world.boomRange` (140), over `world.boomSeconds` (0.5 s).
```

## 6.3 Detection (rule added)

```markdown
- **Cars sense their own level only.**
  - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air.
  - Deck cars sense only a dummy on their deck. They stop for it as for a pedestrian.
  - Ground statics hide the dummy from ground cars only.
```

## 7.1.1 Districts (rules added)

```markdown
- **Bounded.** Row 1's outer edge is the river. Every other outer edge is a wall (`world.wallThickness` 16).
- **Checkpoints.** A road leaving the district passes a booth and a boom across both lanes.
  - The dummy cannot cross the boom line, up or down.
  - A flyover leaving the district has its own boom across the deck.
- **The level carries across a flip.** A deck continues on the next screen of its row.
```

## 7.4 Static structures (rows added; Edit 41's flyover rows replaced)

```markdown
| Kind | Structure | Blocks the dummy | Notes |
|---|---|---|---|
| `wall` | Perimeter wall | yes | `proto.art.wallHeight` 40. Under a deck it is its own module |
| `booth` | Checkpoint booth | yes | Amber beacon; window band |
| `river` | Row 1's outer edge | yes | Drawn by the canal |

- **Flyover deck:**
  - Width `world.deckWidth` (176): two lanes, a hard shoulder each side, parapets of `world.parapetWidth` (8).
  - One height, `world.deckHeight` (60). `world.deckStack` retired.
  - A street light on the parapet every `world.deckLampSpacing` (128).
  - **Broken parapet** over each road it crosses: one tile per side, open road below. Lamps beside a gap are down.
  - **Up-stair:** one per deck screen where it fits. `world.stairLength` 64 × `world.stairWidth` 32, off the road.
- **Underpass:** on `world.underpassChance` (0.5) of generated screens, under a straight run.
  - A stair down on each pavement. A passage under the road, `world.stairWidth` wide.
```

## 7.7 Levels (replaces Edit 41's height-band rule)

```markdown
| Level | Name | Reached by | Cars | Bounds |
|---|---|---|---|---|
| 0 | Underground | Underpass stairs | None | The passage |
| 1 | Ground (default) | Spawn, stair foot, landing | Ground traffic | Statics, walls, checkpoints |
| 2 | Overground | Up-stair | Deck traffic | Parapets, deck checkpoint |

- One overground level. Decks never cross.
- A stair belongs to no level. Nothing meets the dummy on it.
```

## 7.9 Level contract (clause changed; clauses added)

```markdown
6. **Block share** counts the ground outside flyover bands.
18. **Bounded.** Every outer edge is wall or river, except at checkpoints. One checkpoint per road exit; one per flyover exit.
19. **Stairs.** Every stair foot is reachable from a spawn. Every flyover has an up-stair and a drop point on its row.
20. **Underpasses.** Down-stairs come in pairs with their passage. Every parapet gap is wider than the dummy.
```

## 8.3 Damage (rule added)

```markdown
- **Landing on a car:** closing speed is the hypotenuse of `damage.dropSpeed` (120) and the car's speed across.
  - Same impulse model as a strike, without the sprint cap. The legs take it.
  - Stopped sedan 76. Sedan at cruise 176. Stopped van 78. Van at cruise 157.
  - Scores points. The plate multiplier applies on the ground only.
  - The dummy is thrown off the car's side (`proto.recoilScale`).
```

## 11.3 Rules for the data (added)

```markdown
- **Baked layout adds:** stairs (`from`, `to`, foot, head), passages, checkpoints (`deck` flag), parapet gaps, deck stair.
- `districts.json` carries `size` [800, 640]. A layout of another size is ignored.
```

## Registry changes (`edit42-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `ui.playHeight` | Changed | 600 → 640 units | author-decided |
| `ui.playWidth` | Description: 5:4, 25 × 20 tiles | 800 units | author-decided |
| `world.deckWidth` | Changed: shoulders added | 128 → 176 units | proposed |
| `world.roundaboutRadius` | Changed: ring clear of the wider deck | 140 → 160 units | proposed |
| `world.deckStack` | Retired | — | — |
| `world.parapetWidth`, `world.deckLampSpacing` | Added | 8, 128 units | proposed |
| `world.stairLength`, `world.stairWidth` | Added | 64, 32 units | proposed |
| `world.stairSpeed` | Added | 0.7 | proposed |
| `world.dropSeconds`, `damage.dropSpeed` | Added | 0.35 s, 120 units/s | proposed |
| `world.underpassChance` | Added | 0.5 | proposed |
| `world.wallThickness`, `proto.art.wallHeight` | Added | 16, 40 units | proposed |
| `world.boomRange`, `world.boomSeconds` | Added | 140 units, 0.5 s | proposed |
| `tables.districts.blockShare` | Note: outside flyover bands | — | proposed |

## Evidence

- **Tests (74/74).** New: field size; deck drivers both ways, blind to the ground; stairs up at stair speed, dash on the deck, back down; deck car slows for the dummy and takes a dash; ground car never senses it; drop through a gap, landing hit to the legs; underpass across, unsensed; walls, ground boom and deck boom hold; booms lift and fall.
- **Bake:** 15 kept of 16 candidates. Reject: a Campus flyover without a drop point.

| District | Up-stairs | Parapet gaps | Underpasses | Checkpoints (road + deck) |
|---|---|---|---|---|
| Riverside | 0 | 0 | 3–4 | 2 + 0 |
| Old Market | 0 | 0 | 1–5 | 2 + 0 |
| Interchange | 6 | 9–14 | 2–3 | 2 + 4 |
| CBD | 3 | 1–2 | 1–4 | 2 + 2 |
| Campus | 2–3 | 2–6 | 2–3 | 2 + 2 |

- **Start-screen bot** (Standard 800, 150 s; automated, not human evidence):

| District | Layout 1 | Layout 2 | Layout 3 |
|---|---|---|---|
| Riverside (quota 1) | 32.9 s first, 1 write-off | 40.9 s, 1 | 30.3 s, 1 |
| Old Market (2) | 33.6 s, 2 | 36.2 s, 2 | 44.2 s, 2 |
| Interchange (2) | 27.1 s, 2 | 31.2 s, 2 | 31.9 s, 2 |
| CBD (3) | 37.3 s, 3 | 29.2 s, 3 | 20.3 s, 3 |
| Campus (4) | 47.3 s, 3 | 19.9 s, 4 | 31.5 s, 3 |

- **Browser:** five districts; climbs, drops and underpasses driven by key input. No page errors.

## Open items

- **D29 rest:** skybridges between towers. No second overground level.
- **Riverside and Old Market have no decks.** Their only level change is the underpass.
- **Drop damage** is modest (76–176). Is the drop a hit or a getaway? Playtest.
- **Deck traffic** carries no quota weight beyond its hits. Should the deck be a richer hunting ground?
- **Readability:** tags on six deck cars at once. Cut to the nearest few?
- D28 exploration reward and D30 old level types stay open.
