# DUMMIES — Prototype 6.1: three districts, managed traffic, tested walking

**Prototype 6.1 · 27 October 2026 · Lawrence Lek** · Spec: GDD Edits 62–69 (proposed), built on Edits 51–61. P3, P4 and P5 are unchanged.

Prototype 6.1 is the release of P6. It holds Edits 63–68 (steps P6.1–P6.6) and the fixes from the release tests (Edit 69).

- **`dummies_p6_1.html`:** the game. Parkland → Waterfront → Monument. Open in a browser; no server.
- **`dummies_p6.html`:** P6 as released (Edit 62). Frozen.
- **`world6.js`:** the world. Art, edges, traffic, play data and the player sim (`Sim6`) per district.
- **`circus_valley.js`:** the Waterfront plan (Edits 58–61). One source for its layout.
- **`test_p6.js`:** headless checks, the release tests included. `node test_p6.js [minutes]`.
- **`tools/p6_traffic.js`:** the traffic soak. `node tools/p6_traffic.js [seconds per screen] [district]`.
- **`tools/p6_walk.js`:** the walking test. `node tools/p6_walk.js [district]`.
- **`tools/p6_audit.js`:** the playtest audit on all 27 screens. `node tools/p6_audit.js [district]`.

## Districts

| # | District | Quota | Interval | Levels |
|---|---|---|---|---|
| 1 | Parkland | `world.district.parkland.quota` 2 | `world.district.parkland.interval` 3.2 | Z0 streets; Z1 highways meet at the B2 ring; Z1 walkways |
| 2 | Waterfront | `world.district.waterfront.quota` 3 | `world.district.waterfront.interval` 3.2 | Z1 hill and ridge road; Z0 valley, tunnel, beach, drive; Z1 bridges; the river |
| 3 | Monument | `world.district.monument.quota` 4 | `world.district.monument.interval` 2.4 | Z0 snake road; Z1 and Z2 highways; Z1 walkway ring and skybridges; Z2 roof plaza |

- **Start:** every district in B2. Off the lanes, below the intro banner.

## How it plays

- **Floors:** a test on the dummy's centre at its level.
  - Deck and ring: inside the parapets, less `body.radius`. Open at stair heads, links and broken parapets.
  - Walkway: holds, except one opening per road below.
    - One `world.tileSize` module, on one side of the road's centre line. Ends cyan on the magenta rail.
    - A straight drop lands on the centre line. Steer a little to land in a lane.
  - Hill, terrace, roof: every edge drops. The Parkland A3 belvedere's lawn holds.
- **Edges:** another floor at the level, then a stair, then the next screen, then a drop. Else the parapet holds.
- **Screen edges:** no invisible walls. Where an edge holds, a barrier shows on this side.
  - Between screens: a low planter (`world.wallThickness`). Never in a lane.
  - The district's edge: the perimeter wall; a booth and boom on a road; a boom on a highway or hill street; a parapet on the hill.
  - A walkway running into the next screen: chevrons.
  - **6.1:** a crossing needs standing room on arrival: within `body.radius` along the edge, or `world.edgeArrivalDepth` in.
  - **6.1:** an edge that holds holds all along. No sliver narrower than the body stays open.
- **Ground (6.1):** none out of reach. Unreachable ground is planted: a low planter, a hedge top.
- **Flights:**
  - A clear apron beyond every foot: `world.stairApron` (40), the flight's width plus 8 each side.
  - A flight as drawn, and its apron, stay `world.stairEdgeMargin` (16) inside the screen.
  - No building stands in an apron or draws over a flight. Every drawn flight walks.
- **Buildings:** every plan is solid at its level, to 4 units. Terraces and landings too.
- **Walkway joints:** the slab stops at the floor it joins. Square at 90°; mitred at 45°.
- **Raised layers at the screen's edge:** drawn to the edge, past the lift. At a level, a north–south crossing happens at the edge as drawn.
- **Wayfinding:** every apron a lit mat, chevrons into its flight. Monument B2: square paving; guide strips to the ring escalators.
- **Parkland: an Expo site.** Paved; every open garden cell takes a programme in a fixed rotation.
  - Pavilions: dome, shell hall, LED box, canopy, observation tower. Sizes S, M, L. Solid to plan, on a framed lawn.
  - Parterres, fountains, sculpture courts. Grass verges frame every path. Every screen at least 8% green.
  - Great lawns: a paved cross-walk (the hedge opens at it, 6.1), a reflecting rill with jets.
  - A1 reservoir: stepped up to the back. B2: the two pools; the ring's island a fountain at Z1.
- **Tunnel (Waterfront B1):** the dummy walks in. It stops at the top edge of B1, not the mouth.
- **River:** sink `proto.rescueSinkSeconds` (2 s). A drone flies in at `proto.droneSpeed`, lifts the dummy (`proto.droneLiftSeconds`) and sets it on the nearest land.
- **Cues:** only for cars on the dummy's level.

## Traffic (managed)

- **One traffic per district.** Lanes link at seams by elevation. Cars in seam sight show next door.
- **Spacing:** one car per lane every 2 × `world.district.<id>.interval` at `vehicles.sedan.cruiseSpeed`. Highways at their feed.
- **Out of view only:** spawns at inlets with room; a car stopped `traffic.offscreenCullSeconds` (12) is removed.
- **In view:** nothing appears or vanishes. A followed car keeps its speed.
- **Rings (6.1):**
  - A car checks circulating traffic from `traffic.giveWayWindow` out, across a seam too.
  - A fast car starts slowing a stopping distance out, plus `traffic.giveWayLookahead`.
  - Cars on different laps of one route follow each other.
- **The shift:** `run.appearances.road` (100) Z0 cars, counted as each first appears in view.

## Release tests (Edit 69)

| 13.5 min per district, view touring all nine screens | Parkland | Waterfront | Monument |
|---|---|---|---|
| Pop-ins in view | 0 | 0 | 0 |
| Overlaps (P6.6 build → 6.1) | 4 → 0 | 8 → 0 | 0 → 0 |
| Longest stop | 14.2 s | 12.4 s | 0 s |
| Emptiest street tile | 12% | 3% | 0% |

| Walking | Parkland | Waterfront | Monument |
|---|---|---|---|
| Reach from the B2 spawn | 19/19 | 30/30 | 26/26 |
| Tour: screen-levels; crossings; flights | 9; 16; 13 | 15; 27; 16 | 9; 16; 18 |
| Building faces hold | 23/23 | 10/10 | 139/139 |
| Wander, 22 × 5 min: traps | 0 | 0 | 0 |

## Drawing

- **One projection** (decision 320): height z draws at y − z × `proto.art.extrusion`.
- **Layers:** decks, the ring, walkways and the hill draw surface, props and actors, then lift as one.
- **X-ray:** cars and the dummy under the hill, a deck or a portal show as a checker.
- **Shadows:** option 2 (decision 309). One shadow per slab.

## Evidence

- `node test_p6.js 3` → 59/59. The audit, walking and soak run in it.
- `node tools/p6_audit.js` → 200/200: 47 flights, 130 building plans, 23 walkway ends.
- `node test_sim.js` → 104/104 (this copy and P5).
- Browser: no page errors over scripted play in all three districts.

![Parkland](docs/p62_parkland_3x3.png)

![Waterfront](docs/p62_waterfront_3x3.png)

![Monument](docs/p62_monument_3x3.png)

![6.1: edges that hold, before and after](docs/p69_edges_before_after.png)

![P6.2: one walkway opening](docs/p64_walkway_opening.png)

![P6.3: playtest routes](docs/p65_playtest_routes.png)

![P6.4: Parkland B2 and Monument B2, before and after](docs/p66_before_after.png)

![P6.5: Parkland as an Expo site](docs/p67_parkland_expo.png)

![P6.6: the pavilions; the A1 reservoir](docs/p68_pavilions.png)

## Known gaps

- Cues still crowd at a busy junction on the dummy's level (D40).
- Tile names: column-row in the game, row-column in playtest notes (D41).
- Parkland gutters split by a seam are narrow. Some seam paths now end at a planter.
- Copy for the new toasts is literal in `game.js`. Not yet in the content pipeline.

## Build

`python3 build.py` → `dummies_p6_1.html`. `node tools/p6_shots.js docs && python3 tools/p6_shots.py docs` → the 3 × 3 images.
