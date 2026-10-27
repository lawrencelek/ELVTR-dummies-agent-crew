# DUMMIES — P6 prototype: three districts, managed traffic across levels

**P6.3 · 27 October 2026 · Lawrence Lek** · Spec: GDD Edits 62–65 (proposed), built on Edits 51–61. P3, P4 and P5 are unchanged.

P6 is the game on the three districts of the mock-ups. District 2, Waterfront, replaces Circus.

- **`dummies_p6.html`:** the game. Parkland → Waterfront → Monument.
- **`world6.js`:** the world. Art, edges, traffic, play data and the player sim (`Sim6`) per district.
- **`circus_valley.js`:** the Waterfront plan (Edits 58–61). One source for its layout.
- **`test_p6.js`:** headless checks. `node test_p6.js [minutes]`.
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
  - Walkway: holds, except one opening per road below (P6.2).
    - One `world.tileSize` module, centred on the road's centre line. One side: south on an east–west walkway, east on a north–south one.
    - A straight drop lands on the centre line. Steer a little to land in a lane.
  - Hill, terrace, roof: every edge drops. The Parkland A3 belvedere's lawn holds.
- **Edges:** another floor at the level, then a stair, then the next screen, then a drop. Else the parapet holds.
- **Screen edges:** no invisible walls. Where an edge holds, a barrier shows on this side.
  - Between screens: a low planter (`world.wallThickness`). Never in a lane.
  - The district's edge: the perimeter wall; a booth and boom on a road; a boom on a highway or hill street; a parapet on the hill.
  - A walkway running into the next screen: chevrons.
- **Flights (P6.3):**
  - A clear apron beyond every foot: `world.stairApron` (40), the flight's width plus 8 each side.
  - A flight as drawn, and its apron, stay `world.stairEdgeMargin` (16) inside the screen.
  - No building stands in an apron or draws over a flight.
  - A vertical highway's flight takes the other side where its side is short (Monument C column).
  - Every drawn flight walks: Monument B1 and B3 podiums, the Parkland A3 belvedere.
- **Buildings (P6.3):** every plan is solid at its level, to 4 units. Terraces and landings too.
- **Walkway joints (P6.3):** the slab stops at the floor it joins. Square at 90°; mitred at 45°.
- **Tunnel (Waterfront B1):** the dummy walks in. It stops at the top edge of B1, not the mouth.
- **River:** sink `proto.rescueSinkSeconds` (2 s). A drone flies in from the nearest edge at `proto.droneSpeed`.
  - It lifts the dummy out (`proto.droneLiftSeconds`), carries it to the nearest land and sets it down.
  - Land: Z0 or Z1, never a lane, deck or building. The promenade counts.
- **Cues:** only for cars on the dummy's level (beams, scanners, paths, stop brackets, tags).

## Traffic (managed, P6.1)

- **One traffic per district.** Lanes link at seams by elevation. Cars in seam sight show next door.
- **Spacing:** one car per lane every 2 × `world.district.<id>.interval` at `vehicles.sedan.cruiseSpeed`. Highways at their feed.
- **Out of view only:**
  - Beyond the district edge, an inlet meters a car per headway.
  - Any other inlet fills only a missing car (1.5 headways). Never into a queue.
  - A car stopped `traffic.offscreenCullSeconds` (12) is removed.
- **In view:** nothing appears or vanishes. A followed car keeps its speed.
- **The shift:** `run.appearances.road` (100) Z0 cars, counted as each first appears in view.

| 6 min, player in B2 | Headway CV | Emptiest street tile | Longest stop |
|---|---|---|---|
| Parkland | 42% (was 87%) | 16% (was 40%) | 11.6 s |
| Waterfront | 42% (was 104%) | 4% (was 79%) | 11.9 s (was 69.5) |
| Monument | 36% (was 36%) | 1% (was 37%) | 0 s |

## Drawing

- **One projection** (decision 320): height z draws at y − z × `proto.art.extrusion`.
- **Layers:** decks, the ring, walkways and the hill draw surface, props and actors, then lift as one.
- **X-ray:** cars and the dummy under the hill, a deck or a portal show as a checker.
- **Shadows:** option 2 (decision 309). One shadow per slab.

## Evidence

- `node test_p6.js 3` → 42/42: starts, edge audit, managed traffic, climbs, walkway openings, drops, tunnel, rescue, hits, the shift.
- Playtest audit (in `test_p6.js`): 47 flights walked up and down; 122 building plans solid; 23 walkway ends clean.
- `node test_sim.js` → 104/104 (this copy and P5).
- Browser: no page errors over scripted play in all three districts.

![Parkland](docs/p62_parkland_3x3.png)

![Waterfront](docs/p62_waterfront_3x3.png)

![Monument](docs/p62_monument_3x3.png)

![Waterfront A2: four lane gaps (P6.1) → one opening (P6.2)](docs/p64_walkway_opening.png)

![P6.3 playtest routes](docs/p65_playtest_routes.png)

## Known gaps

- Cues still crowd at a busy junction on the dummy's level (D40).
- Copy for the new toasts is literal in `game.js`. Not yet in the content pipeline.

## Build

`python3 build.py` → `dummies_p6.html`. `node tools/p6_shots.js docs && python3 tools/p6_shots.py docs` → the 3 × 3 images.
