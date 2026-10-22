# DUMMIES — GDD Edit 43: square crossings, raised decks, turn styles, buildings by storey, car lights

**21 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.1, 4.2, 6.2, 7.1.1, 7.3, 7.4, 7.7 and 7.9, after Edit 42.

- **Build:** P3.2, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 77/77.
- **Layouts:** 15 rebaked (`content/districts/districts.json`, 318 KB).
- **Registry:** `tuning.parameters.json` `edit43-2026-10-21` (225 entries).
- **Decision log:** rows 152–161.

## Decisions

| # | Decision | Status |
|---|---|---|
| 152 | Flyovers pass square over every road beneath. Decks run horizontally only. Interchange decks keep off the roundabout row | user-directed |
| 153 | Decks draw raised by their height on column pairs. The south row shows under the girder. `world.deckHeight` 60 → 120 | user-directed (columns must show); method is the assistant's |
| 154 | Three turn styles for ground roads: tight, circular, stepped. Each screen picks one | user-suggested; radii are the assistant's |
| 155 | Cars slow for bends (`traffic.cornerAccel`) | proposed |
| 156 | The three levels read apart: pale concrete decks, asphalt streets, a tiled underground cutaway | user-directed; treatment is the assistant's |
| 157 | Buildings are single-storey, double-storey or towers, by storey count | user-directed |
| 158 | Buildings face each road at one setback, in rows with alleys between | user-directed; setback and row rules are the assistant's |
| 159 | Headlight beams reach ahead along the route, with shadows. Braking washes the ground red behind | user-directed; "shadows" reading is the assistant's |
| 160 | Up-stairs stand south of the deck where they fit | proposed |
| 161 | Registry takes Edit 43 | proposed |

## 4.1 Art grid (rule added)

```markdown
- **Raised decks:** a deck and all on it draw lifted by `world.deckHeight` × `proto.art.extrusion` (18 art px).
  - Sim positions stay on the footprint. Only the drawing lifts.
  - A stair draws from its foot on the ground to its head at deck height.
  - A drop draws as a fall from deck height to the ground.
```

## 4.2 Interface (rows added)

```markdown
- **Levels read apart.**
  - Deck: pale concrete (`field.deck`), expansion joints, solid edge lines, long dashes, columns, shadow.
  - Street: asphalt, kerbs, pavements (unchanged).
  - Underground: a cutaway of the passage. Tiled floor, lit walls, ceiling lamps. Traffic above shows as checkers.
- **Headlights:** beams follow the route ahead for `proto.art.beamLength` (200). Three falloff bands of `proto.art.beamAlpha` (0.22).
  - A beam reaches the screen before its car: about 1.4 s at cruise.
  - The dummy and other cars in a beam cast its shadow.
- **Brake wash:** a braking car washes the ground behind red for `proto.art.brakeLength` (48), at `proto.art.brakeAlpha` (0.35).
  - Always a soft wash. Solid red stays the warning's alone.
- **Day palette:** beams and washes at × 0.45.
```

## 6.2 Locomotion and traffic (rule added)

```markdown
- **Corners:** a car takes a bend no faster than √(`traffic.cornerAccel` × radius). It brakes for it at `traffic.comfortBraking`.
  - Tight corner: about 47 in the inner lane, 74 in the outer. Circular: about 108 and 123. Cruise is 138.
```

## 7.1.1 Districts (rules added)

```markdown
- **Planning order:** flyovers first, then road ends, then each screen's road.
  - Road ends on a deck row's side edges keep clear of the deck band.
  - Every flyover crosses at least one road on its row: its drop point.
- **Turn styles** (one per screen, at random):
  - Tight: corners at `world.turnRadiusTight` (64).
  - Circular: corners at `world.turnRadiusWide` (224) where the straights allow.
  - Stepped: a dog-leg. Two tight corners per turn, with a jog between.
- **Road ends:** five offsets per edge, a quarter to three quarters along.
```

## 7.3 Terrain (row added)

```markdown
- **Forecourt:** open ground `world.buildingSetback` (48) deep between the pavement and the building fronts. Spawns and cones stand in it.
```

## 7.4 Static structures (flyover rules replaced; building rules added)

```markdown
- **Flyovers pass square.** Within the band and one road half-width either side, a road beneath runs within `world.deckCrossAngle` (5°) of square.
  - Decks run horizontally only, so their columns show.
  - A curve cannot pass square. The roundabout ring never meets a deck.
- **Columns:** a pair under the two deck edges every `world.deckPillarSpacing` (160). `world.deckColumn` (24) square. Solid.
  - The south row shows below the girder face. The north row stands hidden beneath the deck.
- **Up-stairs** stand south of the deck where they fit. There the whole flight shows.
- **Buildings:**
  - Single storey: `world.storeyHeight` (36). Ribbed roof, lit shopfront.
  - Double storey: two storeys. A window row over the shopfront. Share: `world.district.<id>.doubleShare`.
  - Tower: `world.towerHeightMin`–`Max` in whole storeys, on lots ≥ 96 × 80. Share: `towerShare`.
  - Shadows show height in every palette.
- **Frontage rows:** along every straight run, building fronts stand at lane + shoulder + `world.buildingSetback` from the centre line.
  - Lots 64–160 wide, 64 to `world.district.<id>.blockMax` deep. `world.pedestrianGap` alleys between them.
  - Rows behind rows, a service lane between, until the district's block share is met.
  - A lot that would leave less than an alley to a wall runs flush to it.
- **Back lots** fill the rest, never nearer the road than the frontage line plus an alley.
```

## 7.7 Levels (rules added)

```markdown
- **Drawn heights:** ground 0; deck 18 art px; stair 0 to 18 along its flight; drop 18 to 0 over `world.dropSeconds`.
- **Underground:** the passage draws as a cutaway while the dummy is in it.
```

## 7.9 Level contract (clauses changed and added)

```markdown
6. **Block share** counts buildable ground: inside walls and river, outside flyover bands and the road setback.
   - At least `blockShare` − 0.15 where buildable ground is ≥ 20% of the screen. Never above `world.occludedFractionMax` of the screen.
17. **Crossings:** every road under a flyover passes it square (7.4). The ring never meets a deck.
21. **Buildings:** none nearer a road than the frontage line. Heights in whole storeys.
```

## Registry changes (`edit43-2026-10-21`)

| ID | Change | Value | Status |
|---|---|---|---|
| `world.deckHeight` | Changed | 60 → 120 units | proposed |
| `world.deckCrossAngle` | Added; replaces `world.deckParallelAngle` | 5° | author-decided |
| `world.deckColumn` | Added | 24 units | proposed |
| `world.turnRadiusTight`, `world.turnRadiusWide` | Added | 64, 224 units | proposed |
| `world.buildingSetback`, `world.storeyHeight` | Added | 48, 36 units | proposed |
| `traffic.cornerAccel` | Added | 60 units/s² | proposed |
| `proto.art.beamLength`, `proto.art.beamAlpha` | Added | 200 units, 0.22 | proposed |
| `proto.art.brakeLength`, `proto.art.brakeAlpha` | Added | 48 units, 0.35 | proposed |
| `tables.districts.blockShare` | Now a share of buildable ground | 0.38, 0.42, 0.36, 0.42, 0.36 | proposed |
| `tables.districts.lowHeight` | Replaced by `doubleShare` | 0.3, 0.7, 0.6, 0.8, 0.9 | proposed |
| `world.deckPillarSpacing` | Description: column pairs | 160 units | unchanged |
| Palette roles | Added: `field.deck`, `deck2`, `deckJoint`, `column`, `columnD`, `tile`, `tile2`, `beam`, `brakeGlow`; `structure.bldgRoof1` | cyber and day | proposed |

## Evidence

- **Tests (77/77).** New: square crossings (diagonal and ring cases); three turn styles across the layouts; tight corners at radius 64; whole storeys; no building inside the setback; frontage on one line; corner speed. Interchange decks off the roundabout row.
- **Bake:** 15 kept of 33 candidates. Interchange needed 14: deck rows leave little buildable ground.

| District | Turn styles (27 screens) | Buildings: single / double / tower | Up-stairs, drop points, underpasses (per layout) |
|---|---|---|---|
| Riverside | 11 tight, 9 circular, 7 stepped | 243 / 101 / 0 | 0, 0, 2–3 |
| Old Market | 7 / 9 / 11 | 131 / 280 / 0 | 0, 0, 1–4 |
| Interchange | 6 / 11 / 7 (+3 roundabout) | 64 / 109 / 22 | 6, 4–7, 0–1 |
| CBD | 15 / 7 / 5 | 38 / 153 / 64 | 3, 2–6, 1–3 |
| Campus | 6 / 9 / 12 | 22 / 216 / 13 | 3, 1–6, 2 |

- **Start-screen bot** (Standard 800, 150 s; automated, not human evidence):

| District | Layout 1 | Layout 2 | Layout 3 |
|---|---|---|---|
| Riverside (quota 1) | 54.1 s first, 1 write-off | 53.2 s, 1 | 36.5 s, 1 |
| Old Market (2) | 50.3 s, 2 | 51.0 s, 1 | 25.6 s, 2 |
| Interchange (2) | 46.7 s, 2 | 29.9 s, 1 | 34.3 s, 1 |
| CBD (3) | 25.4 s, 3 | 39.5 s, 3 | 25.6 s, 3 |
| Campus (4) | 40.1 s, 2 | 33.4 s, 1 | 24.6 s, 4 |

- **Browser:** five districts; deck, stairs, drop, underpass and checkpoint driven by key input. No page errors.

## Open items

- **First write-offs are slower** (24–54 s, was 20–47 s). Corner slowing and forecourt spawns both shift timing. Playtest quotas.
- **Turn-style weights** are equal thirds. Should districts lean (Old Market tight, Interchange circular)?
- **Circular turns** clamp to the straights available. Some read as medium corners.
- **Brake red** is a light, not a cue. Check it never reads as a warning.
- **Interchange** keeps few layouts per bake. Deck rows and roads compete for ground.
