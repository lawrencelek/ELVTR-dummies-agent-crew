# DUMMIES — P5 prototype: five models, bus roads, faster highways

**P5.0 · 21 October 2026 · Lawrence Lek** · Spec: GDD Edit 50 (proposed). P3 (P3.4) and P4 (P4.3) are unchanged.

P5 is the game with P4's road and traffic learnings, plus the fleet and highway rules of Edit 50. One build: **`dummies_p5.html`**.

## Why

- **O3.65:** buses only on roads with centre radius 160, and on the elevated highways.
- **O3.65:** highway traffic faster, with fewer vehicles, and better to go there.
- **O3.65:** 45° roads and highways in; all new learnings into P5. Five car models: hatchback, sedan, police, van, small bus.

## From P4

| Learning | Parameter | Value |
|---|---|---|
| Cars judge other cars along their own lane | `traffic.followRoad` | 1 |
| No new cars while traffic is jammed | `traffic.gridlockSeconds` | 6 s |
| A jammed car backs up to clear the jam | `traffic.jamReverse` | 1 |
| Least bend on any road (centre line) | `world.turnRadiusTight` | 64 |
| Roundabout entry fillet | `world.roundaboutEntryRadius` | 96 |
| Screens with 45° roads | `world.diagonalShare` | 0.25 |
| Give way at ring entries and junctions; a car at its line is not jammed | `traffic.giveWayGap` | 2.5 s |

- **Junction pieces** (Edit 49.3) are in the driver, not the planner. Districts still run one road per screen.

## New in P5 (Edit 50)

| Rule | Parameter | Value |
|---|---|---|
| Five models: vans by district, then hatchback, police, bus; sedans the rest | `traffic.share.hatchback` / `.police` / `.bus` | 0.22 / 0.08 / 0.10 |
| A bus runs a ground road only if every bend keeps this radius (no ring) | `vehicles.bus.minRadius` | 160 |
| Highways (straight) always carry buses | — | — |
| A bus only brakes; it never swerves | `vehicles.bus.swerve` | 0 |
| Highway cars cruise faster | `traffic.deckSpeedScale` | 1.4× |
| Highway cars come further apart | `traffic.deckGapScale` | 1.5× `world.deckInterval` |
| A highway hit scores more points (damage unchanged) | `damage.deckMultiplier` | 1.5× |

- **Bus slot on an unfit road:** runs as a sedan.
- **Bend measure:** arc length over turn, across four vertices; 10% polyline tolerance (as contract clause 25).
- **Sight:** a bus hides the dummy from cars like a van, and casts a sensor shadow.
- **Popup:** a highway hit shows `HIGHWAY X1.5` under its points.
- **Out:** sports, wagon and SUV. Their sizes stay in the registry.

![Interchange C1 in P5: the highway carries fewer, faster cars; the ground road may carry a bus](docs/p5_highway_screen.png)

![A dash into a highway hatchback: 286 damage, +429 points (×1.5)](docs/p5_highway_hit.png)

![Riverside C2 in P5: a bus on a 45° road with wide bends (buses staged for the shot)](docs/p5_diagonal_bus.png)

## Evidence

- `node test_sim.js` → 93/93: P3.4 and P4 checks, plus P5 fleet, buses and highways.
- **Bake:** 15 layouts kept of 30 candidates (`content/districts/districts_p5.json`, `p5-edit50-2026-10-21`). Contract clauses 25–26 hold with the P5 fleet.
  - 11 of 15 match P4's layouts. Interchange 1–3 and CBD 3 differ.
- **Report:** `node tools/p5_report.js 120` → `docs/p5_report.md`.

| Measure | P5 | P4 highway settings |
|---|---|---|
| Highway cars per lane on screen | 1.81 | 4.31 |
| Mean highway speed | 182 | 113 |
| Buses among highway cars | 11% | 10% |

- **Bus roads:** 54 of 135 screens (40%) may carry a bus on the ground. Every highway carries buses.
  - Per district, layouts 1–3: Riverside 4, 7, 4 · Old Market 4, 3, 4 · Interchange 4, 2, 4 · CBD 1, 3, 3 · Campus 6, 4, 1 (of 9).
- **Ground buses:** 27 of 693 ground cars on the 15 highway screens of layout 1 (120 s each).
- **Bot, start screen:** first write-off 23–53 s on every layout.

## Run

```
python3 build.py                 # dummies_p5.html
node test_sim.js                 # P3.4, P4 and P5 checks (93)
node tools/district_bake.js 60   # P5 layouts → content/districts/districts_p5.json
node tools/p5_report.js 120      # bus roads, highway traffic
```

## Files

| File | Role |
|---|---|
| `sim.js` | P4.3 sim plus Edit 50: `fleetClass`, `minBend`, `busRoad`, deck speed and spacing, highway points, bus without swerve |
| `game.js`, `pixel.js`, `shell.html` | P4.3 renderer. Highway popup; bus sensor shadow; P5 tuning rows |
| `lab.js` | Test helper only (road pieces for `test_sim.js`). The Turn Lab stays in P4 |
| `tools/district_bake.js`, `tools/district_check.js` | Bake and contract, as P4 |
| `tools/p5_report.js` | Bus roads and highway traffic on the baked layouts |

## Open

- **Highway reward:** points ×1.5. Or credits, or a quota bonus?
- **Bus routes:** 40% of screens fit a bus. Should the planner make wide-bend bus routes?
- **Junctions:** the 45° junction choice (decision 204) and branching roads in the planner.
- **Police:** canon says it tracks your approach, then commits. P5 drives it like a sedan.
- **Hatchback:** canon says one signalled recommitment. Not built.
