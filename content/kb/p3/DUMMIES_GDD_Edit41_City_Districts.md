# DUMMIES — GDD Edit 41: five city districts, flyovers, landmarks, tile grid

**20 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.1, 7.1.1, 7.2, 7.3, 7.4, 7.7, 7.9, 10.3 and 11.3, after Edit 40.1.

- **Build:** P3, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 69/69 (after Edit 41.1).
- **Layouts:** `content/districts/districts.json` (15 baked: 3 per district) · `node tools/district_bake.js`.
- **Registry:** `tuning.parameters.json` `edit41-2026-10-20` (203 entries; new `districts` table).
- **Decision log:** rows 133–138. Opens D29, D30.

## Decisions

| # | Decision | Status |
|---|---|---|
| 133 | Art tiles are 16 × 16 px (`world.tileSize` 32 units). Field stays 400 × 300 | proposed |
| 134 | A run is five city districts in a fixed order, each harder | user-confirmed |
| 135 | Layouts are made in advance: three per district, baked and checked; a run picks one at random | proposed (answers Lawrence's question) |
| 136 | Districts differ by city form, centre landmark, flyovers, traffic, hazards and quota | proposed |
| 137 | Flyovers carry their own traffic. The dummy stays on the ground | proposed |
| 138 | Registry takes Edit 41 | proposed |

## 4.1 Art grid (rule added)

```markdown
- **Tiles are 16 × 16 art px** (`world.tileSize` 32 units). SNES scale.
  - A sedan is 1.75 × 0.9 tiles; the dummy 0.8; a road with both pavements 5.
  - The 400 × 300 field is 25 × 18.75 tiles. The bottom row is part-height.
- **RPG Maker packs (48 px) do not fit.** Vehicles there are side views; P3 cars rotate freely.
```

## 7.2 Level types and order (table replaced)

```markdown
A run is five city districts, in order. Each is a 3 × 3 district (7.1.1). Rows: `tables.districts`.

| # | District | Centre landmark | Form | Flyovers | Quota | Traffic | Hazards |
|---|---|---|---|---|---|---|---|
| 1 | Riverside | Lantern monument on a plaza | Low-rise, blocks ≤ 112 | 0 | 1 | 3.0 s, 20% vans | Puddles 2%, jerseys 6% |
| 2 | Old Market | Fountain square | Dense low-rise, blocks ≤ 96 | 0 | 2 | 3.0 s, 45% vans | Puddles 4%, jerseys 5% |
| 3 | Interchange | Roundabout; crash-matting island | Mid-rise, 15% towers | 2, stacked | 2 | 2.8 s, 30% vans | Puddles 2%, jerseys 10% |
| 4 | Central Business District | FARSIGHT Tower on a plaza | Towers on 50% of large lots | 1 | 3 | 2.6 s, 30% vans | Puddles 2%, jerseys 8% |
| 5 | FARSIGHT Campus | Calibrated impact plates on the road | Campus halls | 1 | 4 | 2.5 s, 40% vans | Puddles 1%, jerseys 8% |

- Values: `world.district.<id>.quota`, `.interval`, `.vanShare`, `.blockShare`, `.blockMax`, `.lowHeight`, `.towerShare`, `.puddleShare`, `.jerseyShare`, `.decks`.
- **Every start screen yields a write-off with no upgrades** (clause 16 bot).
- The P2.2 roads (L1–L3) remain as test fixtures, not in the run.
```

## 7.1.1 Districts (rules added)

```markdown
- **All nine screens are generated.** The dummy starts on B1, on the river.
- **The centre screen (B2) holds the landmark.** Roads meet it square at edge midpoints.
- **Flyovers** cross a whole row or column. Interchange stacks a column deck over a row deck (7.4).
```

## 7.3 Terrain (rows used)

```markdown
- **Matting** (`world.terrain.matting.*`): the roundabout island. Dash × 1.15 from it.
- **Plate** (`world.terrain.plate.*`): Campus road plates. A hit taken on one scores `damage.plateMultiplier` (1.5) points. Health loss is unchanged.
- **Plaza:** paving around a landmark. No multipliers.
```

## 7.4 Static structures (row added)

```markdown
| `deck` | Flyover deck | 4 | passes under | deck traffic only |

- **Height:** `world.deckHeight`; a crossing deck adds `world.deckStack`. Width `world.deckWidth`.
- **Piers:** one per `world.deckPillarSpacing`, under the centre line, never on the road or its pavement. Piers are ground statics: solid, sensor shadow.
- **Deck traffic** runs both ways every `world.deckInterval`. It never meets the dummy or ground cars.
- **No buildings under a deck.** Its band stays open ground.
- **Drawing:** depth-sorted by the deck's south edge, lifted by height × `proto.art.extrusion`. Lit lip and girder face; shadow down-left.
  Ground actors under a deck show as see-through checkers (4.2.4 tier 1).
```

## 7.7 Height bands (row added)

```markdown
- **Decks** are a second floor over band 0. Only deck traffic uses it in this version.
- **Later (D29):** stairs and skybridges let the dummy up. Cars below cannot sense it. One-way drops to the road.
```

## 7.9 Level contract (clauses added)

```markdown
14. **Landmark.** The centre screen holds its district's landmark.
15. **Flyovers.** Every deck screen has at least one pier. No building stands in a deck band.
16. **Playable start.** On the start screen, the read-and-lunge bot scores a write-off within 150 s at Standard health.
```

## 10.3 Run (rules added)

```markdown
- **Order is fixed:** Riverside → Old Market → Interchange → CBD → Campus. Clearing Campus licenses the dummy.
- **Layouts:** three baked per district. Each run picks one per district at random. `proto.layout` fixes one for playtests.
- **Baking:** `tools/district_bake.js` tries seeds and keeps the first three that pass clauses 1–16 with different roads.
  Replace a layout only after a playtest.
```

## 11.3 Rules for the data (added)

```markdown
- **Baked layout:** seed, road path, start, decks, and per screen: road ends, gates, centre line, statics, cones, spawns, patches, decks, landmark.
- A baked layout plays the same after the generator changes. The generator is a design tool.
```

## Registry changes (`edit41-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `tables.districts` | Added: 5 rows × 15 columns | see 7.2 | Proposed; order and quota rise user-confirmed |
| `world.deckHeight`, `world.deckStack`, `world.deckWidth` | Added | 60, 60, 128 units | Proposed |
| `world.deckPillarSpacing`, `world.deckInterval` | Added | 160 units, 2.4 s | Proposed |
| `world.towerHeightMin`, `world.towerHeightMax` | Added | 220, 380 units | Proposed |
| `world.roundaboutRadius` | Added | 140 units | Proposed |
| `proto.layout` | Added (prototype group) | 0 | Proposed |
| `damage.plateMultiplier` | Now used by the build | 1.5 | unchanged |
| `world.terrain.matting.lunge` | Now used by the build | 1.15 | unchanged |

## Evidence

- **Tests (67/67).** New: five districts in order with rising quotas; all 15 layouts pass the contract; landmarks; flyovers span three screens and stack at Interchange; determinism; next district follows; deck traffic never hits the dummy; matting dash × 1.15; plate scoring; five smoke runs.
- **Bake:** 15 kept from 17 candidates. Two CBD rejects: block share 0.127; a deck screen without piers.
- **Start-screen bot** (Standard 800, 150 s; automated, not human evidence):

| District | Layout 1 | Layout 2 | Layout 3 |
|---|---|---|---|
| Riverside (quota 1) | 26.0 s first, 1 write-off | 29.8 s, 1 | 46.7 s, 1 |
| Old Market (2) | 33.5 s, 2 | 39.5 s, 2 | 42.8 s, 1 |
| Interchange (2) | 17.5 s, 2 | 28.2 s, 2 | 41.2 s, 1 |
| CBD (3) | 42.7 s, 2 | 24.5 s, 3 | 12.4 s, 3 |
| Campus (4) | 25.5 s, 3 | 24.9 s, 4 | 26.9 s, 4 |

- **Browser:** all nine screens of each district walked. No page errors.

## Open items

- **D29 two-layer play.** Stairs, skybridges, drop attacks.
- **D30 GDD 7.2's old level types** (Road, Cross junction, Parking lot, Suburb, Crash test centre). Their traffic rules (junction priority, parking) are not in the districts. Keep, merge or drop?
- **Interchange readability.** Stacked decks hide much of the roundabout. Ground cars show as checkers only.
- **Quotas vs CARS LEFT** at 800 health need human timing, district by district.
- D27 viewable area and D28 exploration reward stay open.

## Edit 41.1 — flyovers cross roads; field-size test (20 October, 21:24)

Playtest report: "a higher-level road needs to CROSS against a lower one by a maximum of one tile. At the moment some run parallel."

### 7.4 Static structures (rule added)

```markdown
- **Flyovers cross roads, never run along them.**
  - Under the deck band, a road's centre line runs at most `world.tileSize` along the deck.
  - Within one `world.laneWidth` of the deck's edge, a road within `world.deckParallelAngle` (30°) of the deck's direction runs at most `world.tileSize`.
- **Placement:** each deck takes an offset on its row or column where every road on that line passes the rule.
- **Roundabout:** the whole ring is road. Traffic uses the part on its route. Decks cross the ring at right angles or miss it.
```

### 7.9 Level contract (clause added)

```markdown
17. **Crossings.** Every flyover passes 7.4's crossing rule against every road under it, ring included.
```

### D27 viewable area — test build (open)

`?field=large` or the **Field** button in the bar. Standard stays the default.

| | Standard | Large test |
|---|---|---|
| Field (art px) | 400 × 300: 25 × 18.75 tiles | 640 × 480: 40 × 30 tiles |
| Screen (art px) | 640 × 360 | 960 × 540 |
| World (units) | 800 × 600 | 1280 × 960 |
| 1080p full screen | × 3 | × 2 |
| Dummy / sedan on screen (device px) | 39 / 84 × 42 | 26 / 56 × 28 |
| Sedan crossing, across / down | 5.8 / 4.3 s | 9.3 / 7.0 s |
| Blocks per screen (baked) | 6–14 | 12–33 |
| Baked layouts | 15 (3 per district) | 10 (2 per district) |
| Bot, first write-off on the start screen | 14.5–56.7 s | 20.9–46.2 s |

- **HUD:** same physical size. Side columns narrow from 208 to 181 reference units.
- **Same rules:** `world.width`, `world.height`, `ui.playWidth`, `ui.playHeight` follow the field. Road crossings scale with the screen.
- **Trade:** more city and road per screen; sprites a third smaller on screen; approach time up 60%.
- **Not changed:** sensor reach (`perception.forwardLength` 560), view cone reach (`sensing.coneReach` 900), quotas, traffic intervals.

### Registry changes (`edit41.1-2026-10-20`)

| ID | Change | Value | Status |
|---|---|---|---|
| `world.deckParallelAngle` | Added | 30° | Proposed |

### Evidence

- **Tests (69/69).** New: crossing rule cases; all 10 large layouts pass the contract.
- **Rebake:** 15 standard layouts kept; rejects were low block share, a walled-off pocket and duplicate roads.
