# DUMMIES — P6 prototype: three districts, one traffic across levels

**P6 · 26 October 2026 · Lawrence Lek** · Spec: GDD Edit 62 (proposed), built on Edits 51–61. P3, P4 and P5 are unchanged.

P6 is the game on the three districts of the mock-ups. District 2, Waterfront, replaces Circus.

- **`dummies_p6.html`:** the game. Parkland → Waterfront → Monument.
- **`world6.js`:** the world. Art, traffic, play data and the player sim (`Sim6`) per district.
- **`circus_valley.js`:** the Waterfront plan (Edits 58–61). One source for its layout.
- **`test_p6.js`:** headless checks. `node test_p6.js [minutes]`.

## Districts

| # | District | Quota | Start | Levels |
|---|---|---|---|---|
| 1 | Parkland | `world.district.parkland.quota` 2 | A1, top | Z0 streets; Z1 highways meet at the B2 ring; Z1 walkways |
| 2 | Waterfront | `world.district.waterfront.quota` 3 | A2, west | Z1 hill and ridge road; Z0 valley, tunnel, beach, drive; Z1 bridges; the river |
| 3 | Monument | `world.district.monument.quota` 4 | A1, west | Z0 snake road; Z1 and Z2 highways; Z1 walkway ring and skybridges; Z2 roof plaza |

## How it plays

- **Floors:** a test on the dummy's centre at its level.
  - Deck and ring: inside the parapets, less `body.radius`. Open at stair heads, links and gaps.
  - Walkway, hill, terrace, roof: the shape itself. Every edge drops.
- **Edges:** another floor at the level, then a stair, then the next screen, then a drop. Else the parapet holds.
- **Screens:** walk off an edge onto open ground. On a floor, only where the next screen has a floor at that level.
- **Tunnel (Waterfront B1):** the dummy walks in. It stops at the top edge of B1, not the mouth.
- **River:** a fall starts a drone rescue (D37).
  - Lift `proto.droneLiftSeconds` (0.5), then the distance at `proto.droneSpeed` (240).
  - Sets down on the nearest land at Z0 or Z1. Never a lane, deck or building.
  - The promenade counts: the body may overhang kerb and seawall by half its radius.
- **Hits:** cars meet the dummy at their elevation only.

## Traffic

- **One traffic per district.** Lanes link at seams by elevation: Z0 streets, Z1 hill streets, the Z1 ring, highways.
- **Seams:** cars within seam sight show next door. Drivers follow them; the dummy meets them.
- **Warm start:** `traffic.warmSeconds` (30) before play. Every lane already runs.
- **The shift:** `run.appearances.road` (100) cars enter by the Z0 roads.
  - Highways and hill streets run off the shift's clock.
  - CARS LEFT counts shift cars not yet gone. Failed test when none unspent remains.
- **Admission:** each Z0 entry, one car per 2 × `world.district.<id>.interval`.
- **Bridges:** fed at `world.district.waterfront.deckInterval` (8). They give way at the ridge road.

## Drawing

- **One projection** (decision 320): height z draws at y − z × `proto.art.extrusion`.
  - Vertical highways now lift too, with columns. Links and zebras sit at the footprint.
- **Layers:** decks, the ring, walkways and the hill each draw surface, props and actors, then lift as one.
- **X-ray:** cars and the dummy under the hill, a deck or a portal show as a checker.
- **Shadows:** option 2 (decision 309). One shadow per slab.

## Evidence

- `node test_p6.js 5` → 28/28. Five minutes of traffic per district; longest stop 50 s (Waterfront bridges).
- `node test_sim.js` → 104/104 (this copy and P5).
- Browser: no page errors over scripted play in all three districts.
- Build per district: 1.4–2.7 s (a loading panel shows).

![Parkland](docs/p62_parkland_3x3.png)

![Waterfront](docs/p62_waterfront_3x3.png)

![Monument](docs/p62_monument_3x3.png)

## Known gaps

- Waterfront bridge T junctions saturate: bridge cars wait up to about 50 s (D39).
- Parkland A3's belvedere stair and Monument B3's skybridge are scenery. No way up.
- Copy for the new toasts is literal in `game.js`. Not yet in the content pipeline.

## Build

`python3 build.py` → `dummies_p6.html`. `node tools/p6_shots.js docs && python3 tools/p6_shots.py docs` → the 3 × 3 images.
