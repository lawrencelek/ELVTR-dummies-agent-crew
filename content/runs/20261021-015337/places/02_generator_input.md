# BRIEF — Places: district intros, screen names and level toasts
Content type: places. Parameter prefix for new IDs: proto.places.

## The gap (what the game is thin on)
- My game is thin on place (designer's gap statement). Five districts share one hand-written sentence each in sim.js, so the city reads as five test grids, not Shenzhen Smart City.
- Every screen toasts a generic theme on first visit: 'B2 · Open street', 'A1 · Pillars'. Nine screens per district, forty-five in all, have no names.
- The new Z-level toasts (low highway, high highway, roof) are placeholder strings typed into game.js.
- Names must stay true to the baked layouts: a screen name may only promise what all three layouts of that district have on that screen.

## Deliverable
- Per district: an intro of one or two short sentences, shown after 'District N of 5: <Name>.' and before 'Write-offs required: N.' It names the centre landmark and one thing that changes play there.
- Per district: nine screen names, A1 to C3, shown as '<cell> · <name>' on first visit. Place names a Shenzhen smart-city planner would put on a street sign.
- Three level toasts shown the first time the dummy reaches each: z1 (a low highway deck), z2Highway (the high highway), roof (a platform roof). Each says what the level does: who drives there and how to get down.
- Every item cites the chunks it draws on.

## JSON schema
```
{
  "districts": {
    "<district id>": {
      "intro": "one or two sentences, each under 15 words",
      "screens": {"A1": "name", "B1": "name", "C1": "name", "A2": "name", "B2": "name", "C2": "name", "A3": "name", "B3": "name", "C3": "name"},
      "sources": [chunk ids]
    }, … all five …
  },
  "levels": {"z1": "toast", "z2Highway": "toast", "roof": "toast", "sources": [chunk ids]},
  "params": []
}
```

## Consumer contract (what the renderer can draw)
- Intro toast (frame layer, ui.typeSecondary, first four seconds of a district): 'District {n} of 5: {Name}. ' + intro + ' Write-offs required: {quota}.' The renderer adds the name and the quota; the intro must not repeat them.
- Screen toast (first visit to a screen): '{cell} · {name}'. Name at most 22 characters, Title Case, no full stop.
- Level toasts (first time on each): z1 when the dummy steps onto a low highway deck; z2Highway onto the high highway; roof onto a platform roof. At most 96 characters.
- Cell names: column A, B, C from west to east; row 1, 2, 3 from north to south. Row 1's north edge is the river in every district.
- The 'Game data' table says, per screen, what all three baked layouts have ('all'), what only some have ('some') and what none have. A name may promise only 'all' features. 'some' is not enough.

## Allowed values
```json
{
 "districts": [
  "riverside",
  "market",
  "interchange",
  "cbd",
  "campus"
 ],
 "cells": [
  "A1",
  "B1",
  "C1",
  "A2",
  "B2",
  "C2",
  "A3",
  "B3",
  "C3"
 ],
 "levels": [
  "z1",
  "z2Highway",
  "roof"
 ],
 "max_chars": {
  "intro": 120,
  "screen": 22,
  "level": 96
 },
 "landmark_words": {
  "monument": [
   "lantern",
   "monument",
   "obelisk"
  ],
  "fountain": [
   "fountain"
  ],
  "roundabout": [
   "roundabout",
   "ring",
   "island",
   "circus"
  ],
  "tower": [
   "farsight tower",
   "tower"
  ],
  "plate": [
   "plate",
   "calibration",
   "test"
  ]
 },
 "feature_words": {
  "river": [
   "river",
   "riverside",
   "quay",
   "embankment",
   "bank",
   "canal",
   "wharf",
   "pier",
   "waterfront"
  ],
  "highway": [
   "highway",
   "flyover",
   "overpass",
   "viaduct",
   "skyway",
   "deck",
   "ramp",
   "expressway",
   "elevated"
  ],
  "checkpoint": [
   "checkpoint",
   "gate",
   "boom",
   "toll",
   "customs",
   "barrier"
  ],
  "roofs": [
   "roof",
   "rooftop",
   "terrace",
   "platform",
   "heights"
  ],
  "skybridge": [
   "skybridge",
   "sky bridge",
   "walkway",
   "bridge"
  ],
  "roundabout": [
   "roundabout",
   "ring",
   "circus"
  ]
 }
}
```

## Voices (who says what)
- intro and level toasts: FARSIGHT's interface: plain, short, instructive, politely corporate. It tells the subject what the place does. It never jokes, never cheers, never mocks.
- screen names: Street signage in Shenzhen Smart City: a place name with a FARSIGHT planner's calm. Concrete nouns, not adjectives. No puns.

## Game data
Registry IDs you may reference (value, unit):
- world.deckHeight = 120 world units
- world.district.campus.blockMax = 160
- world.district.campus.blockShare = 0.36
- world.district.campus.decks = 1
- world.district.campus.doubleShare = 0.9
- world.district.campus.highDecks = 0
- world.district.campus.interval = 2.5
- world.district.campus.jerseyShare = 0.08
- world.district.campus.platformShare = 0.12
- world.district.campus.puddleShare = 0.01
- world.district.campus.quota = 4
- world.district.campus.towerShare = 0.1
- world.district.campus.vanShare = 0.4
- world.district.cbd.blockMax = 160
- world.district.cbd.blockShare = 0.42
- world.district.cbd.decks = 2
- world.district.cbd.doubleShare = 0.8
- world.district.cbd.highDecks = 1
- world.district.cbd.interval = 2.6
- world.district.cbd.jerseyShare = 0.08
- world.district.cbd.platformShare = 0.15
- world.district.cbd.puddleShare = 0.02
- world.district.cbd.quota = 3
- world.district.cbd.towerShare = 0.5
- world.district.cbd.vanShare = 0.3
- world.district.interchange.blockMax = 160
- world.district.interchange.blockShare = 0.36
- world.district.interchange.decks = 2
- world.district.interchange.doubleShare = 0.6
- world.district.interchange.highDecks = 1
- world.district.interchange.interval = 2.8
- world.district.interchange.jerseyShare = 0.1
- world.district.interchange.platformShare = 0.15
- world.district.interchange.puddleShare = 0.02
- world.district.interchange.quota = 2
- world.district.interchange.towerShare = 0.15
- world.district.interchange.vanShare = 0.3
- world.district.market.blockMax = 96
- world.district.market.blockShare = 0.42
- world.district.market.decks = 0
- world.district.market.doubleShare = 0.7
- world.district.market.highDecks = 0
- world.district.market.interval = 3
- world.district.market.jerseyShare = 0.05
- world.district.market.platformShare = 0.12
- world.district.market.puddleShare = 0.04
- world.district.market.quota = 2
- world.district.market.towerShare = 0
- world.district.market.vanShare = 0.45
- world.district.riverside.blockMax = 112
- world.district.riverside.blockShare = 0.38
- world.district.riverside.decks = 0
- world.district.riverside.doubleShare = 0.3
- world.district.riverside.highDecks = 0
- world.district.riverside.interval = 3
- world.district.riverside.jerseyShare = 0.06
- world.district.riverside.platformShare = 0.1
- world.district.riverside.puddleShare = 0.02
- world.district.riverside.quota = 1
- world.district.riverside.towerShare = 0
- world.district.riverside.vanShare = 0.2
- world.dropSeconds = 0.35 s
- world.highHeight = 216 world units

Districts in run order (sim.js, tables.districts):
- riverside: Riverside — focal monument; quota 1; highways 0 (Z2: 0); current placeholder blurb: "Low-rise riverfront. A lantern monument marks the centre."
- market: Old Market — focal fountain; quota 2; highways 0 (Z2: 0); current placeholder blurb: "Dense low-rise streets around a fountain square. Wet, and busy with vans."
- interchange: Interchange — focal roundabout; quota 2; highways 2 (Z2: 1); current placeholder blurb: "Two flyovers either side of a roundabout. Its island is crash matting."
- cbd: Central Business District — focal tower; quota 3; highways 2 (Z2: 1); current placeholder blurb: "Towers and barriers. FARSIGHT Tower stands at the centre."
- campus: FARSIGHT Campus — focal plate; quota 4; highways 1 (Z2: 0); current placeholder blurb: "The test centre the city was modelled on. Calibrated plates score more."

Per screen, what the three baked layouts have: 'all' (every layout), 'some', 'none'. A name may promise only 'all'.
| District | Cell | River edge | Landmark | Any highway | Low highway (Z1) | High highway (Z2) | Checkpoint | Platform roofs | Skybridge | Start |
|---|---|---|---|---|---|---|---|---|---|---|
| riverside | A1 | yes | - | none | none | none | some | none | none |  |
| riverside | B1 | yes | - | none | none | none | none | some | none | yes |
| riverside | C1 | yes | - | none | none | none | some | some | none |  |
| riverside | A2 | no | - | none | none | none | none | some | some |  |
| riverside | B2 | no | monument | none | none | none | none | all | none |  |
| riverside | C2 | no | - | none | none | none | none | some | none |  |
| riverside | A3 | no | - | none | none | none | some | some | none |  |
| riverside | B3 | no | - | none | none | none | none | none | none |  |
| riverside | C3 | no | - | none | none | none | some | none | none |  |
| market | A1 | yes | - | none | none | none | some | some | none |  |
| market | B1 | yes | - | none | none | none | none | some | none | yes |
| market | C1 | yes | - | none | none | none | some | some | some |  |
| market | A2 | no | - | none | none | none | none | some | none |  |
| market | B2 | no | fountain | none | none | none | none | all | some |  |
| market | C2 | no | - | none | none | none | none | some | none |  |
| market | A3 | no | - | none | none | none | some | some | some |  |
| market | B3 | no | - | none | none | none | none | some | none |  |
| market | C3 | no | - | none | none | none | some | some | some |  |
| interchange | A1 | yes | - | all | some | some | all | some | none |  |
| interchange | B1 | yes | - | all | some | some | none | some | none | yes |
| interchange | C1 | yes | - | all | some | some | all | some | none |  |
| interchange | A2 | no | - | none | none | none | none | some | none |  |
| interchange | B2 | no | roundabout | none | none | none | none | none | none |  |
| interchange | C2 | no | - | none | none | none | none | some | none |  |
| interchange | A3 | no | - | all | some | some | none | none | none |  |
| interchange | B3 | no | - | all | some | some | none | some | none |  |
| interchange | C3 | no | - | all | some | some | none | all | none |  |
| cbd | A1 | yes | - | some | some | none | some | none | none |  |
| cbd | B1 | yes | - | some | some | none | none | some | none | yes |
| cbd | C1 | yes | - | some | some | none | some | all | none |  |
| cbd | A2 | no | - | all | some | some | none | some | none |  |
| cbd | B2 | no | tower | all | some | some | none | some | none |  |
| cbd | C2 | no | - | all | some | some | none | some | none |  |
| cbd | A3 | no | - | some | some | some | some | some | none |  |
| cbd | B3 | no | - | some | some | some | none | some | none |  |
| cbd | C3 | no | - | some | some | some | some | some | none |  |
| campus | A1 | yes | - | some | some | none | some | some | none |  |
| campus | B1 | yes | - | some | some | none | none | some | some | yes |
| campus | C1 | yes | - | some | some | none | some | all | some |  |
| campus | A2 | no | - | some | some | none | none | all | some |  |
| campus | B2 | no | plate | some | some | none | none | all | some |  |
| campus | C2 | no | - | some | some | none | none | some | none |  |
| campus | A3 | no | - | none | none | none | some | some | some |  |
| campus | B3 | no | - | none | none | none | none | none | none |  |
| campus | C3 | no | - | none | none | none | some | none | none |  |

Placeholders being replaced (game.js): screen toast '<cell> · ' + one of Start screen, Pillars, Barrier run, Open street, Lantern monument, Fountain square, Roundabout, FARSIGHT Tower, Test plates. Level toasts: 'Low highway: traffic up here. A broken parapet drops you to the road.' / 'High highway: fast traffic. A broken parapet is a long drop to the street.' / 'Roof: no traffic up here. Step off a ledge to drop on a car below.'


# CONTEXT

[EDIT41#7.2] (7.2 Level types and order (table replaced))
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

[EDIT42#7.1.1] (7.1.1 Districts (rules added))
## 7.1.1 Districts (rules added)
```markdown
- **Bounded.** Row 1's outer edge is the river. Every other outer edge is a wall (`world.wallThickness` 16).
- **Checkpoints.** A road leaving the district passes a booth and a boom across both lanes.
  - The dummy cannot cross the boom line, up or down.
  - A flyover leaving the district has its own boom across the deck.
- **The level carries across a flip.** A deck continues on the next screen of its row.
```

[EDIT41#7.1.1] (7.1.1 Districts (rules added))
## 7.1.1 Districts (rules added)
```markdown
- **All nine screens are generated.** The dummy starts on B1, on the river.
- **The centre screen (B2) holds the landmark.** Roads meet it square at edge midpoints.
- **Flyovers** cross a whole row or column. Interchange stacks a column deck over a row deck (7.4).
```

[LOG#P3.3] (P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57))
## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57)
**Build:** `prototypes/p3/dummies_p3.html` (P3.3) · 21 Oct 2026 · Spec: GDD Edit 44 · Decisions 162–173.
- **Levels:** Z0 ground, Z1 low highway (18 art px up), Z2 high (32 art px up). No underground.
- **High highway:** Interchange and CBD run one flyover each at Z2.
- **Platforms:** frontage buildings built to Z2 with walkable roofs. A tall stair from the street; a link stair from a low highway.
- **Skybridges:** join roofs across alleys and lanes.
- **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. Z2 falls last 0.47 s and hit harder.

[EDIT44#4.2] (4.2 Interface (Edit 42 and 43 rows replaced))
## 4.2 Interface (Edit 42 and 43 rows replaced)
```markdown
- **Level tag:** the top bar adds `Z1 HIGHWAY`, `Z2 HIGHWAY`, `Z2 ROOF`, `Z2 BRIDGE`, `STAIRS` or `FALLING`. Nothing on the ground.
- **Cues follow who can meet the dummy.**
  - Ground: ground cars. A highway: its own deck's cars. A roof or bridge: none.
  - On a stair: the end it is nearer. Falling: the level it lands on.
- **Levels read apart.**
  - Z0 street: asphalt, kerbs, pavements (unchanged).
  - Z1 low highway: pale concrete, one LED line on each parapet.
  - Z2 high highway: a second LED line inside each parapet, in another LED colour.
  - Z2 roof: rooftop tiles, an LED parapet, openings where stairs and bridges join.
  - Roof ledge: a white-and-black striped kerb. Never red.
  - Skybridge: glazed rails with LED dots, joints, a slim girder face, a shadow.
- **Falling:** the dummy's shadow marks the landing spot on the ground.
- **District map:** a Z1 flyover is a dashed line. A Z2 flyover is heavier.
- **Toasts:** the first time up on a low highway, a high highway or a roof.
- **Removed:** the underground cutaway and the `UNDERPASS` tag.
```

[FLEET#F1] (F1 Canon)
## F1 Canon
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX.
- **Company:** FARSIGHT.
- **Look:** Sinofuturist cyber city (decision 113).
- **Premise:** Vehicles are the city's workers. They want to qualify. The dummy wants to leave.
- **City names allowed:** Shenzhen.

[EDIT39#4.1.1] (4.1.1 The register (replaces Edit 37))
## 4.1.1 The register (replaces Edit 37)
```markdown
#### 4.1.1 The register
**A Sinofuturist cyber city inside a friendly corporate terminal.** Two layers, never mixed.
- **The play area is the city at night.** 16-bit pixel art: dark deck plates, LED city blocks, neon spill, jersey barriers, a white fleet.
- **The frame is FARSIGHT's brand.** Dark glass, cyan LED edges, rounded panels. High resolution.
- **The contrast is the tone.** The city glows. The test writes off bodies in it. The brand never comments.
- **Dark ground rules every edge** (4.1.2). No sprite edge is black.
- **Reserved hues hold.** Yellow is the dummy. Red is the warning. Neon is material, never a cue.
- **Options:** day (Edit 37 eco-city) and night (parkland) remain as build palettes. Play never changes.
```

[EDIT40#4.2] (4.2 Interface (rows added))
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

[EDIT40#7.3] (7.3 Terrain (row and rule changed))
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

[EDIT43#7.4] (7.4 Static structures (flyover rules replaced; building rules added))
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

[LOG#P3-update-five-city-districts-o3-40-o3-44] (P3 update — five city districts (O3.40–O3.44))
## P3 update — five city districts (O3.40–O3.44)
**Build:** `prototypes/p3/dummies_p3.html` · 20 Oct 2026 · Spec: GDD Edit 41 · Decisions 133–138.
- **Run:** Riverside → Old Market → Interchange → CBD → FARSIGHT Campus. Quotas 1, 2, 2, 3, 4.
- **Each district:** 3 × 3 generated screens; landmark on B2; own form, flyovers, traffic and hazards.
- **Layouts:** 15 baked (3 per district); one per district at random each run.
- **Flyovers:** decks on piers with two-way deck traffic; Interchange stacks two.

[EDIT26#7.2~2] (7.2 Level types and order)
- **Yield on entry is a bait point.** A car at the give-way line is hesitating by rule, not by chance. The most predictable vehicle in the game and the most exposed.
- **The exit signal is a commitment cue.** A car that has signalled its arm has declared its route. Reading signals is pillar 2 made geometric.
- **Circulating traffic never rests.** Battery management and service timing matter here in a way they do not on a road with gaps.
- **Rubber matting on the island** gives a ×1.15 launch into circulating traffic. The island is refuge and springboard at once.
- **Calibrated impact plates on the circulating lane** pay `damage.plateMultiplier`. FARSIGHT instruments the surface its cars hit most.
- **The diesel spill** is the only low-grip surface in the run, so Grip depends on it.
**Every level can be completed with no upgrades.** Upgrades open routes that pay more or are harder for the cars to predict. Enforcement is in 7.9.
**The vertical slice** (Built). Three levels: ROAD (quota 2, 14 vehicles), CROSS JUNCTION (quota 3, 20), CRASH TEST CENTRE (quota 5, 28), certification target 11. Road and Cross junction carry forward. Cross junction's one-way roads become two-way right-hand traffic. The open-hall level is replaced by the roundabout: a room more laboratory than the city contradicts the setting, since the city is the crash lab (4.1). Its instrumentation — impact plates, crash matting, the calibration grid — moves to the roundabout.

[EDIT42#decisions] (Decisions)
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

[EDIT40#edit-40-1-open-edges-body-health-20-october-20-1/evidence] (Evidence)
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

[EDIT44#decisions] (Decisions)
## Decisions
| # | Decision | Status |
|---|---|---|
| 162 | Three levels by height: Z0 ground, Z1 low highway, Z2 high. The underground is removed | user-directed |
| 163 | Z2 is reached two ways: a tall stair from the ground, a link stair from a low highway | user-chosen |
| 164 | Platform blocks: frontage buildings built to Z2 with walkable roofs | user-chosen; stair, annex and chain rules are the assistant's |
| 165 | Skybridges join platform roofs across alleys and lanes | user-chosen; spans and counts are the assistant's |
| 166 | Roof edges facing the road are ledges. Other roof edges have parapets | proposed |
| 167 | Interchange and CBD run one flyover each at Z2. CBD gains a second flyover | user-chosen |
| 168 | A drop lands on the nearest level below. Fall time and landing speed grow with √height | user-chosen; √ scaling is the assistant's |
| 169 | Every level draws lifted by its height. Roofs, bridges and stairs redrawn | user-directed; treatment is the assistant's |
| 170 | Cues show for cars that can meet the dummy. None on roofs or bridges | proposed |
| 171 | Towers start at eight storeys, above every Z2 roof | proposed |
| 172 | Bake keeps start screens whose first bot write-off comes by 90 s | proposed |
| 173 | Registry takes Edit 44 | proposed |

[DECISIONS#rows-161-170~2] (Rows 161–170)
| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|---|---|---|---|---|
| 161 | The registry takes Edit 43: version `edit43-2026-10-21` | proposed (assistant, 21 October) | Every new statistic has an ID | 11 new entries, 1 retired, 2 table columns changed, 20 palette rows | `content/params/tuning.parameters.json` |
| 162 | Three levels by height: Z0 ground, Z1 low highway (`world.deckHeight` 120), Z2 high: the high highway, platform roofs and skybridges (`world.highHeight` 216). The underground is removed; `world.underpassChance` retired. Supersedes row 145's numbering, row 146's underpasses and row 156's cutaway | user-directed (21 October): "It is too difficult to see underground. Therefore let's have three levels, but make Ground (Z= 0), Low Highway (Z= 1), and High Platforms / Roofs / High Highway (Z=2). Redraw all the graphics and navigation accordingly." | Every level shows from above | No hidden passage | Contract clause 20; tests renumbered in `test_sim.js` |
| 163 | Z2 is reached two ways: a tall stair from the ground (run 112) and a link stair from a low highway's shoulder (run 48). Stair run is `world.stairLength` per `world.deckHeight` of rise | user-chosen (21 October): "Both routes"; the run rule is the assistant's | Roofs reach from the street and from the highway | Tall stairs take frontage | 2 checks in `test_sim.js` |
| 164 | Platform blocks: a frontage lot becomes a building to `world.highHeight` with a walkable roof, at `platformShare` (0.10–0.15). Its stair climbs along the road-facing edge; a single-storey annex fills the strip behind | user-chosen (21 October): "Platform blocks"; stair placement and annex are the assistant's | A roof a street away from traffic | Platform lots are 176–208 wide | Contract clause 22; `prototypes/p3/docs/p33_tallstair.png` |
| 165 | Skybridges join platform roofs across an alley or lane: `world.stairWidth` wide, up to `world.skybridgeMax` 96. The next lot after a platform joins it at `world.skybridgeChance` 0.75, up to `world.platformChain` 3 roofs; at most `world.skybridgeCount` 4 per screen. Parapets hold; no drop off a bridge. Closes D29 | user-chosen (21 October): "Platform blocks … joined by skybridges"; spans and counts are the assistant's | A roof walk above the street | Few bridges where decks take the ground | 1 check in `test_sim.js`; `prototypes/p3/docs/p33_bridge.png` |
| 166 | Roof edges facing the road, with open ground below, are ledges: a white-and-black striped kerb. Other roof edges have parapets | proposed (assistant, 21 October) | Drops land in the forecourt, near traffic | North-facing ledges drop behind the building | Contract clause 22; 1 check in `test_sim.js` |
| 167 | Interchange and CBD each run one flyover at Z2 (`highDecks` 1). CBD decks 1 → 2. Other districts keep one Z1 flyover or none | user-chosen (21 October): "Interchange + CBD" | The high highway stays a landmark | CBD keeps less buildable ground | 1 check in `test_sim.js` |
| 168 | A drop lands on the nearest level below the landing point: a deck beneath, else the ground. Fall time and landing speed × √(h / `world.deckHeight`): Z2 to the ground 0.47 s, about 161 units/s | user-chosen (21 October): "Nearest level below"; the √ scaling is the assistant's (free fall) | A higher fall hits a car harder: stopped sedan 76 → 136 | Longer fall, more time for a car to pass | 2 checks in `test_sim.js` |
| 169 | Every level draws lifted by its height × `proto.art.extrusion`: Z1 18 art px, Z2 32. Columns rise to their deck. Platforms draw to Z2 with a tiled roof, LED parapet, ledge kerb and openings. Stairs draw from foot lift to head lift; x-axis flights show a stringer. Z2 decks add an inner LED line; the map draws them heavier. Tags: Z1 HIGHWAY, Z2 HIGHWAY, Z2 ROOF, Z2 BRIDGE, STAIRS, FALLING | user-directed (21 October): "Redraw all the graphics and navigation accordingly"; the treatment is the assistant's | One glance tells the level | No new palette roles | `prototypes/p3/docs/p33_*.png` |
| 170 | Cues and tags show for cars that can meet the dummy: ground cars on Z0, its own deck's cars on a highway, none on roofs and bridges. Supersedes row 150 in part | proposed (assistant, 21 October) | Only threats get cues | No traffic cues while planning a roof drop | Open item in Edit 44 |

[EDIT39#3.1] (3.1 World and lore (rule added))
## 3.1 World and lore (rule added)
```markdown
- **Lore follows state.** A line may only say what the game state guarantees at that moment (6.6.1).
- **Setting:** SHENZHEN SMART CITY, NEW ECONOMIC ZONE (§1). The cyber look is a visual register, not a second city (D25).
```

[EDIT26#4.1~1] (4.1 Style guide)
### 4.1 Style guide
#### 4.1.1 The register
**An urban crash lab, framed by a corporate interface.** Two layers, never mixed.
- **The play area is the city, instrumented.** Safety-white ground, calibration grid, numbered impact zones, high-vis markings, hazard stripes over ordinary streets. Flat silhouettes, hard edges. No gloss, no gradient, no translucency.
- **The frame is FARSIGHT's brand.** Frutiger Aero: glossy bevels, translucent panels, soft drop shadows, aqua highlights, rounded corners. Clean, friendly, optimistic.
**The cityscape is the crash lab.** Not a facility that imitates a city — a city built as an instrument. The calibration grid is painted on real roads. The surveillance is measurement. Every level is a testing ground and a place at the same time, and nothing marks the difference.
**The grid is not decoration.** The ground is numbered so the damage can be measured. Everything is scaled so the report card can state exactly where you were hit.
**The brand kills you politely.** The report card announcing your body's destruction uses the same aqua, rounded corners and friendly type as the main menu. The contradiction is never commented on.
One register throughout. Play, reports, menus and developer tools are the same terminal, differently framed.
#### 4.1.2 The dummy is the exception
- A real crash-test dummy: safety yellow body, black joint markers, calibration dots.
- The only saturated object on screen. Everything else is white, grey or glass.
- The only object with weight: dents, squash and stretch, a growing lean as it wears.
- The cars glide; the dummy flops. A sprite with mass against a flat diagram.
#### 4.1.3 Material rules

[EDIT26#7.3~1] (7.3 Terrain surfaces)
### 7.3 Terrain surfaces
Terrain affects movement. You move fast on tarmac and less fast on grass.
- Multipliers apply to the dummy's base values. The values below are Proposed.
- Grip governs turning and stopping: on low grip the dummy slides, overshoots its turns and coasts `movement.lowGripStopMultiplier` further before stopping (5.2). **Grip** (Legs, tier 2) removes all three. It is the only node that removes a hazard rather than adding a verb (5.6).
- Car effects apply only where cars can drive.
- The band column is the height band from 7.7.
- Every cell is addressable as `world.terrain.<id>.<field>`. The table is the registry's `terrain` rows, not prose.
| ID | Terrain | Band | Dummy speed | Lunge | Grip | Cars | Notes |
|---|---|---|---|---|---|---|---|
| `tarmac` | Tarmac | 0 | 1.0 | 1.0 | normal | normal | The reference surface |
| `pavement` | Pavement / concrete | 0 | 1.0 | 1.0 | normal | normal | |
| `kerb` | Kerb | 1 | 0.85 crossing | 1.0 | normal | cannot mount | A thin strip that slows a step |
| `zebra` | Zebra crossing | 0 | 1.0 | 1.0 | normal | always stop for anything on it | A safe zone: useless to you, funny on purpose |
| `grass` | Grass | 0 | 0.75 | 0.85 | slightly low | cannot drive | Island planting |
| `hedge` | Tall grass / hedge | 0 | 0.6 | 0.7 | normal | cannot drive | Blocks the cars' side sensors: natural cover |
| `gravel` | Gravel | 0 | 0.8 | 0.9 | low | speed ×0.7, braking ×0.7 | Cars skid |
| `mud` | Mud | 0 | 0.5 | 0.6 | low | speed ×0.5 | Not placed in the first version |
| `puddle` | Puddle | 0 | 0.9 | 1.0 | low | braking ×0.5 | Cars brake late, so they are easier to hit |
| `oil` | Oil / diesel spill | 0 | 1.0 | 1.0 | very low | braking ×0.3, swerving ×0.5 | The best surface to lure a car onto |
| `matting` | Rubber crash matting | 0 | 1.0 | 1.15 | high | normal | The roundabout's central island; a springboard |
| `plate` | Calibrated impact plate | 0 | 1.0 | 1.0 | normal | normal | The circulating lane. Hits on it pay `damage.plateMultiplier` |
| `bump` | Speed bump | 1 | 1.0 | 1.0 | normal | ×0.5 crossing | |
**Parameters — world**
*Generated from `tuning.parameters.json`. The registry is canonical; regenerate this block rather than editing it. Format: `parameter` = value (purpose).*

[LOG#P3.2] (P3.2 — square crossings, raised decks, turn styles, buildings by storey, car lights (O3.52–O3.56))
## P3.2 — square crossings, raised decks, turn styles, buildings by storey, car lights (O3.52–O3.56)
**Build:** `prototypes/p3/dummies_p3.html` (P3.2) · 21 Oct 2026 · Spec: GDD Edit 43 · Decisions 152–161.
- **Flyovers:** horizontal, raised 18 art px on column pairs, square over every road beneath. Interchange decks clear the roundabout.
- **Roads:** tight, circular or stepped turns per screen. Cars slow for bends.
- **Levels:** pale concrete decks; asphalt streets; a tiled cutaway underground.
- **Buildings:** single, double, tower. Rows face the road at one setback with alleys between.
- **Lights:** headlight beams ahead along the route, with shadows; red brake wash behind.

[EDIT41#evidence] (Evidence)
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

[EDIT41#7.3] (7.3 Terrain (rows used))
## 7.3 Terrain (rows used)
```markdown
- **Matting** (`world.terrain.matting.*`): the roundabout island. Dash × 1.15 from it.
- **Plate** (`world.terrain.plate.*`): Campus road plates. A hit taken on one scores `damage.plateMultiplier` (1.5) points. Health loss is unchanged.
- **Plaza:** paving around a landmark. No multipliers.
```