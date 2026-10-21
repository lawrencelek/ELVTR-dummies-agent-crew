# DUMMIES — GDD Edit 40: districts, puddles, Big battery

**20 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.2, 5.4, 7.1, 7.3, 7.9, 10.3, 11.3 and 13.2, after Edit 39.

- **Build:** P3, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 56/56 · `python3 content/db/check_lore.py` 0 errors.
- **Registry:** `tuning.parameters.json` `edit40.1-2026-10-20` (194 entries).
- **Decision log:** rows 124–132. Closes D18, D24, D25, D26. Opens D27, D28.
- **Edit 40.1 (20:13):** open screen edges; body health 600/800/1000. See the last section.

## Decisions

| # | Decision | Status |
|---|---|---|
| 124 | Puddles on 2% of tiles, as patches over the ground. No dash from water | user-confirmed; no-dash from O3.11 |
| 125 | Zelda-style districts: 3 × 3 screens per level. Continuous scroll later | user-confirmed |
| 126 | District rules (§7.1.1) | proposed |
| 127 | Every screen the same size; each generated street and city; seed fixed per road | proposed |
| 128 | Shenzhen is the setting. Chongqing is a visual reference only | user-confirmed |
| 129 | Big battery: 3 charges, base 2 | user-confirmed |
| 130 | Registry takes Edit 40 | proposed |
| 131 | Screen edges open wherever the ground is open on both sides | proposed, from a playtest report |
| 132 | Body health: base 800; easy 600; difficult 1000 | user-confirmed |

## 4.2 Interface (rows added)

```markdown
- **Top bar:** road name, then the screen: `ROAD 1 · STRAIGHT · B2`. Columns A–C, rows 1–3 from the river.
- **District map:** left column, under DASH. Nine cells; the road through all of them.
  - Current screen in the selection fill. Visited screens lit. Unvisited roads dim.
  - The dummy is a yellow dot on its screen.
- **Gate marks:** ticks at each opening's ends; chevrons point out of pedestrian gates. `field.gate`, the cue.secondary value.
- **First visit:** a toast names the screen and its feature (Flyover pillars, Barrier run, Open street).
- **DASH:** one block per charge: 2, or 3 with Big battery.
```

## 5.4 Battery (value changed)

```markdown
- `upgrades.bigCapacity` = 3 charge (Big battery: one dash more than base, D26)
- `economy.price.battery` = 1 write-off (the cheapest node; P3 sells it)
```

## 7.1 Canvas (paragraph replaced)

```markdown
**No scrolling camera.** Each screen is visible whole. A level is a district of screens (7.1.1).
The camera flips between screens at gates. It never scrolls inside one.
Every car that can reach the dummy is on its screen. Pillar 2 holds.
```

### 7.1.1 Districts (new)

```markdown
- **Shape.** A level is `world.districtColumns` × `world.districtRows` screens (3 × 3). Each screen is the full play area.
- **One road.** A single road passes through every screen once. Both ends leave the district.
- **Start screen.** Top row, on the river. It holds the level's handcrafted road. Corner roads start in a corner screen.
- **Crossings match.** A road leaves one screen where it enters the next.
- **Gates.** Screen edges are solid, except at gates:
  - the road crossing, kerb to kerb;
  - one pedestrian gate, `world.gateWidth` wide, on every shared edge.
- **District edges** have no gates. The road continues off the map; the dummy cannot.
- **Flip.** The dummy's centre crosses a gate. The screen slides over `world.flipSeconds`. Play pauses.
- **Carry-over.** Health, parts, charge, momentum and a held cone cross with the dummy.
- **Only the active screen runs.** Its cars, drones and effects end at the flip.
- **Traffic** enters the new screen from its own road ends, 0.5 s after arrival.
- **Cones stay put.** Each screen keeps its cones where they were left.
- **Fleet memory** spans the district. Learned stop lines carry across screens and roads.
- **Write-off.** The next chassis lands on the current screen.
- **Quota** counts write-offs anywhere in the district. CARS LEFT is district-wide.
- **Generation.** Eight screens come from the road seed. `proto.district.seed` rerolls them.
  - Road pieces: straight, S-bend, right-angle bend.
  - Features: flyover pillars, a barrier run with `world.barrierGapsMin` gaps, or open street.
  - Jersey barriers on `world.jerseyShare` of the road edge. Blocks to `world.blockShare` of the screen.
  - Spawns and cones on the verges. Every open spot and gate stays reachable.
- **Later.** Continuous scroll (GTA 1) replaces the flip when off-screen threat cues exist.
```

## 7.3 Terrain (row and rule changed)

```markdown
| `puddle` | Puddle | 0 | 0.9 | 0 (no dash from water) | low | braking ×0.5 | Cars brake late, so they are easier to hit |

- **Puddles.** `world.puddleShare` of each screen's tiles (`world.tileSize`) carry water.
  - Spots of 1 to `world.puddleSpotMax` tiles. Alternate road and walkable ground.
  - Never under a static, a spawn or a cone.
- **On water** the dummy:
  - moves at `world.terrain.puddle.dummySpeed`;
  - coasts `movement.lowGripStopMultiplier` longer. Grip removes the slide;
  - cannot dash. The press is denied with a splash.
- **Cars on water** brake at `world.terrain.puddle.carBraking` of `traffic.hardBraking`. A skid throws spray.
```

## 7.9 Level contract (clauses added)

```markdown
11. **District.** One road through every screen. Every shared edge has at least one gate.
12. **Gates.** Each gate approach is clear on both sides and reachable from the screen's spawns.
13. **Per screen.** Clauses 1–9 hold on every screen, not only the start screen.
```

## 10.3 Run (rule added)

```markdown
- **Quota is per district.** Write-offs on any screen count. Exploration is optional.
```

## 11.3 Rules for the data (added)

```markdown
- **District plan:** road path, each screen's two road ends, gate spans per edge, feature, seed.
- **Screens build on first entry** and are kept. P3 builds all nine when the road starts.
- **Patches:** `{ x, y, w, h, kind }` on whole tiles. `World.surfaceAt` returns the top one.
```

## 13.2 Still unspecified (rows changed)

```markdown
- ~~D18 surfaces~~ → layered patches; puddles built (decision 124). Oil not built.
- ~~D24 map structure~~ → Zelda-style districts (decisions 125–127).
- D27 viewable area (below).
- D28 what rewards exploration.
- Junction pieces (T, cross) for generated screens. They need right-of-way rules (7.2 level 2).
```

## D27 — Viewable area (open)

Each option keeps the 640 × 360 screen. Sedan at 138 units/s.

| Option | Field (art px) | Play area (units) | Area | Dummy / sedan (art px) | Side columns | Crossing H / V | Recalculate |
|---|---|---|---|---|---|---|---|
| A Keep | 400 × 300 | 800 × 600 | 1.00 | 13 / 28 × 14 | 120 px | 5.8 / 4.3 s | Nothing |
| B Wider field | 480 × 300 | 960 × 600 | 1.20 | 13 / 28 × 14 | 80 px | 7.0 / 4.3 s | `ui.playWidth`, 4.2.1 layout, 7.1 table, pacing, quotas |
| C Zoom out | 400 × 300 | 1000 × 750 | 1.56 | 10 / 22 × 11 | 120 px | 7.2 / 5.4 s | `ui.artScale` 2.5, sprites, 4.2.3 budget, all of B |
| D Full width | 560 × 300 | 1120 × 600 | 1.40 | 13 / 28 × 14 | HUD over field | 8.1 / 4.3 s | HUD redesign, all of B |

- **Recommended: A.** The district gives nine times the area. Each screen keeps pillar 2.
- **If more room is needed: B.** Same pixels. Costs approach symmetry and the side-column layout.
- **More roads per screen** come from junction pieces, not a bigger screen.

## D28 — What rewards exploration (open)

| Option | Effect |
|---|---|
| Features only (today) | Better ambush geometry on some screens |
| Quota spread | Write-offs must come from N different screens |
| Model roster per screen | Each screen runs its own models from `fleet.json` |
| Pickups | Cones, credits or parts on far screens |

## Registry changes (`edit40-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `upgrades.bigCapacity` | 5 → 3 | charge | author-decided (D26) |
| `world.terrain.puddle.lunge` | 1.0 → 0 | ratio | author-decided (D18) |
| `world.tileSize` | Added | 32 units | author-decided |
| `world.puddleShare` | Added | 0.02 | author-decided |
| `world.puddleSpotMax` | Added | 2 tiles | Proposed |
| `world.districtColumns`, `world.districtRows` | Added | 3, 3 | author-decided |
| `world.gateWidth` | Added | 48 units | Proposed |
| `world.flipSeconds` | Added | 0.4 s | Proposed |
| `world.blockShare`, `world.jerseyShare` | Added | 0.25, 0.08 | author-decided (decision 118) |
| `proto.district`, `proto.district.seed` | Added (prototype group) | 1, 0 | author-decided; Proposed |
| `tables.palette` | `field.puddle`, `.puddleRim`, `.puddleLip`, `.puddleHi`, `.gate` | 10 rows (cyber, day) | Proposed |

## Evidence

- **Tests (55/55).** New: one road through nine screens; crossings match; city contract and open gates on every screen (two seeds); gate flip and solid edge; cones per screen; puddle share; no dash, longer slide, half braking; Big battery.
- **Browser tour.** All nine screens of each road visited. No page errors.
- **Policy check** (`policy_check.js`, L1 start screen, Standard 300, city on, part effects on):

| Policy | Puddles off | Puddles on |
|---|---|---|
| Stand in lane | 0 impacts | 0 impacts |
| Blind lunge every 1 s | Not cleared in 300 s | Cleared at 46.0 s |
| Read & lunge | Cleared at 11.0 s | Cleared at 11.0 s |

- **Read:** wet tarmac lets blind lunging clear L1. Reading still clears it four times faster. Watch in playtest.

## Open items

- D27 viewable area. D28 exploration reward.
- Oil patches (very low grip, braking ×0.3). Grip node not in the P3 shop.
- Only the active screen runs. Off-screen traffic for continuous scroll needs a design.
- Not playtested: flip feel, gate reading, puddle reading at laptop distance.

## Edit 40.1 — open edges, body health (20 October, 20:13)

Playtest report: "I can't actually move when I'm at the edge of the screen." Edges outside the gates were solid.

### 7.1.1 Districts (bullets replaced)

```markdown
- **Edges are open** wherever the ground is open on both sides, as in Zelda.
  - A building or barrier just across the edge stops the dummy.
  - The district's outer edges are solid. The road continues off the map; the dummy cannot.
- **Gates** remain a generator guarantee: the road crossing, plus one `world.gateWidth` opening per shared edge.
```

### 4.2 Interface (bullet replaced)

```markdown
- **Edge marks:** a dotted line where an open-looking edge stops the dummy. District edges, and buildings just across. `field.gate`.
- Unmarked edges are open.
```

### 8.3 Damage (values changed)

```markdown
- `damage.bodyHealth` = 800 health units (base body; supersedes CR-004's 1600)
- `proto.health.fragile` = 600 (Fragile: easy)
- `proto.health.standard` = 800 (Standard: base)
- `proto.health.reinforced` = 1000 (Reinforced: difficult)
```

### Registry changes (`edit40.1-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `damage.bodyHealth` | 1600 → 800; design minimum 800 → 600 | health units | author-decided |
| `proto.health.fragile`, `.standard`, `.reinforced` | Added (prototype group); were 200, 300, 600 in P3 | 600, 800, 1000 | author-decided |

### Evidence

- **Tests (56/56).** New: marked edge stretches match exactly where an open-looking edge stops the dummy. Edge test now crosses off the road, holds at a building and at the river.
- **Browser:** walked down an alley from B1 to B2 and back. Blocked alleys show the dotted line. All 27 screens toured.
- **Policy check** (L1 start screen, city on, part effects on, puddles on):

| Policy | Fragile 600 | Standard 800 | Reinforced 1000 |
|---|---|---|---|
| Blind lunge every 1 s | Cleared at 79.6 s | Not cleared (traffic ran out at 308 s) | Not cleared |
| Read & lunge | Cleared at 30.1 s (9 hits) | Cleared at 31.6 s (9 hits) | Cleared at 50.7 s (15 hits) |

- **Read:** at 800, reading beats blind play again. L1 takes about three times longer than at 300.
- **Open:** L2 (quota 2) and L3 (quota 3) need a timed check against CARS LEFT at 800. Scripted random play now fails both.
