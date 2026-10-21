# DUMMIES — GDD Edit 48: screen edges, flyover clearance

**21 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.2, 7.1.1, 7.4, 7.9 and 11.3, after Edit 44. Edits 45–47 are the generated content edits.

- **Build:** P3.4, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 83/83.
- **Layouts:** 15 rebaked (`content/districts/districts.json`, `edit48-2026-10-21`, 365 KB).
- **Registry:** `tuning.parameters.json` `edit48-2026-10-21` (232 entries).
- **Decision log:** rows 178–185.

## Decisions

| # | Decision | Status |
|---|---|---|
| 178 | A flyover draws at least four tiles below the top edge. Every district, not only Interchange | user-directed; all districts is the assistant's |
| 179 | A flyover leaves a building row of ground above the bottom edge | proposed |
| 180 | A building at a shared edge straddles it: at least one tile into each screen, same building on both | user-directed; reach and art match are the assistant's |
| 181 | No room across: the lot keeps an alley off the edge. Platforms never cross | proposed |
| 182 | Edge marks: district edges and non-building blockers only | follows from 180 |
| 183 | Screens build one at a time, the landmark screen first | proposed |
| 184 | Content pipeline revises published content after a game change | proposed |
| 185 | Registry takes Edit 48 | proposed |

## 4.2 Interface (Edit 40.1 bullet replaced)

```markdown
- **Edge marks:** a dotted line where an open-looking edge stops the dummy.
  - District edges, and any non-building blocker just across.
  - Buildings never cause one. A building at a shared edge shows on both screens (7.4).
- Unmarked edges are open.
```

## 7.1.1 Districts (planning rule added)

```markdown
- **Flyover clearance (all districts).**
  - Drawn deck top: at least `world.deckTopClear` (128) below the top edge. Four 16 px tiles.
  - Drawn deck top: band top minus its lift. Z1 lifts 36; Z2 lifts 64.
  - So a Z1 band starts at y ≥ 164, a Z2 band at y ≥ 192.
  - Band bottom: at least `world.deckBottomClear` (128) above the bottom edge. A building row fits below.
  - Offsets: 260–280 with the row's road below; 360–420 with it above.
- **Superseded:** the river-row rule (band top ≥ 60 on row 1).
```

## 7.4 Static structures (rule added)

```markdown
- **Shared screen edges.** A building never ends at a shared edge.
  - A lot touching one carries across it: 64 into the neighbour where it has room, else 48, else 32.
  - Least reach: `world.edgeOverlap` (32), one 16 px tile, into each screen.
  - Same footprint, height, storeys and art on both screens.
  - No room across: the lot keeps `world.pedestrianGap` (40) off the edge.
  - One shared edge per building. Platforms, annexes and landmarks never cross.
- **Room across** a built neighbour: its statics, stairs, bridges, flyover bands, checkpoints, gates, spawns, cones, road setback and reachability.
- **Room across** a neighbour still to build: its road setback, flyover bands, gates, perimeter, checkpoints and incoming buildings.
- **Build order:** the landmark screen first, then reading order. A neighbour's piece arrives before the screen's own lots.
  - Barriers and flyover pillars keep an alley from incoming pieces.
  - Deck stair feet keep clear of blockers.
  - A lot fails only if it cuts off ground reachable before the lots.
```

## 7.9 Level contract (clauses changed and added)

```markdown
6. **Block share** counts the on-screen part of a straddling building only.
23. **Shared edges.** A building touching a shared edge reaches `world.edgeOverlap` into each screen.
    Its twin on the neighbour has the same footprint. No shared edge carries an edge mark.
24. **Flyover clearance.** Every drawn deck top stands `world.deckTopClear` below the top edge.
    Every band bottom stands `world.deckBottomClear` above the bottom edge.
```

## 11.3 Rules for the data (rule added)

```markdown
- **Baked statics** may extend past the screen. A straddling building carries `stitch: true` and `art` (shared sprite seed).
- A layout of another version is rebaked, not read.
```

## Registry changes (`edit48-2026-10-21`)

| ID | Change | Value | Status |
|---|---|---|---|
| `world.deckTopClear` | Added | 128 units (four tiles) | user-directed |
| `world.deckBottomClear` | Added | 128 units | proposed |
| `world.edgeOverlap` | Added | 32 units (one tile) | user-directed |

## Evidence

- **Tests (83/83).** New: shared-edge straddle with twins and no shared-edge marks; flyover clearance on all baked layouts and fresh plans. Edge test now asserts no hidden building across an open edge.
- **Before (P3.3 layouts):** 12 of 15 flyover rows drew within four tiles of the top. Interchange layout 1, row 3: Z2 deck drawn from 32 units above the screen.
- **Before:** 565 marked stretches on shared edges, 1,221 tiles long. **After:** none.
- **Bake:** 15 kept of 62 candidates. Interchange needed 35: dry or slow start screens.

| District | Flyovers (drawn top, tiles below the edge) | Straddling buildings, layouts 1–3 | Roofs (ledges) | Skybridges | Tall stairs | Link stairs | First bot write-off, layouts 1–3 |
|---|---|---|---|---|---|---|---|
| Riverside | none | 22, 23, 26 | 0–6 (0–4) | 0–3 | 0–4 | 0 | 24.9, 60.1, 28.2 s |
| Old Market | none | 30, 27, 37 | 1–8 (1–3) | 0–2 | 1–8 | 0 | 41.2, 29.5, 23.7 s |
| Interchange | Z1 4.3–9.3; Z2 7.1–8.4 | 19, 24, 25 | 1–2 (0) | 0 | 0 | 1–2 | 37.7, 72.4, 46.8 s |
| CBD | Z1 4.3–9.3; Z2 4.0–8.4 | 20, 25, 21 | 2–3 (0) | 0 | 0 | 2–3 | 49.0, 41.4, 41.9 s |
| Campus | Z1 4.3–8.0 | 27, 19, 24 | 2–6 (1–3) | 0–1 | 0–3 | 2–3 | 39.8, 46.7, 31.9 s |

- **Content:** 7 screen names and the CBD intro became untrue on the new layouts. `pipeline.py --revise` fixed 8 lines. A fresh run would have renamed 41 of 45.
- **Browser:** Interchange A3 entered from above; Campus A1 to B1 across straddling buildings. No page errors.

![Interchange layout 1, A3, entered from above. Before: the Z2 deck covers the top. After: seven tiles of street first](https://github.com/lawrencelek/ELVTR-dummies-agent-crew/blob/assignment4/content-pipeline/prototypes/p3/docs/p34_a3_compare.png)

![Campus A1 and B1. Before: buildings end at the edge behind a dotted line. After: they carry across and show on both screens](https://github.com/lawrencelek/ELVTR-dummies-agent-crew/blob/assignment4/content-pipeline/prototypes/p3/docs/p34_pair_compare.png)

![Layout 1 of each district: straddling buildings outlined green; yellow line, drawn deck top](https://github.com/lawrencelek/ELVTR-dummies-agent-crew/blob/assignment4/content-pipeline/prototypes/p3/docs/p34_plans.png)

## Open items

- **Tall stairs** dropped to 0 in Interchange and CBD. Mid-screen flyovers leave few platform-size frontage lots. Link stairs still reach Z2.
- **Platform reach:** a platform lot at a run's end could stop an alley short of the edge. Tried in a 10-seed smoke: Interchange tall stairs 7 → 9. Not baked.
- **Interchange bake** starves further: 35 candidates for 3 layouts.
- **Straddling art:** a straddling building draws its facade strip on both screens. Playtest whether it reads as one building.
