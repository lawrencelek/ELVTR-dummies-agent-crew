# DUMMIES — GDD Edit 44: Z levels, high highway, platform roofs, skybridges

**21 October 2026 · Lawrence Lek** · Localized edits to EDIT26 §§4.1, 4.2, 5.2, 6.2, 6.3, 7.1.1, 7.4, 7.7, 7.9, 8.3 and 11.3, after Edit 43.

- **Build:** P3.3, `prototypes/p3/dummies_p3.html` · `node test_sim.js` 81/81.
- **Layouts:** 15 rebaked (`content/districts/districts.json`, `edit44-2026-10-21`, 348 KB).
- **Registry:** `tuning.parameters.json` `edit44-2026-10-21` (229 entries).
- **Decision log:** rows 162–173. Closes D29.

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

## 4.1 Art grid (Edit 43 rule replaced)

```markdown
- **Raised levels:** a level and all on it draw lifted by its height × `proto.art.extrusion`.
  - Z1: `world.deckHeight` (120) → 18 art px. Z2: `world.highHeight` (216) → 32 art px.
  - Sim positions stay on the footprint. Only the drawing lifts.
  - A stair draws from its foot's lift to its head's lift.
  - A drop draws from the lift it left to the lift it lands on.
```

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

## 5.2 Movement (Edit 42 rules replaced)

```markdown
- **Stairs:** walked at × `world.stairSpeed` (0.7). No dash on a stair.
  - Run per `world.deckHeight` of rise: `world.stairLength` (64). Z0–Z1 64, Z0–Z2 112, Z1–Z2 48.
  - A ground stair: entered at its foot. Its sides and head are solid on the ground.
  - A link stair: entered from its deck's shoulder. Solid below.
  - Leaving either end steps the dummy fully onto the floor.
- **Raised floors:** decks, roofs and skybridges. Parapets hold the dummy.
  - Walking off a floor onto another floor at its level crosses over. A skybridge joins two roofs this way.
- **Drop:** off a ledge or through a broken parapet.
  - Fall time: `world.dropSeconds` × √(h / `world.deckHeight`). Z1 0.35 s; Z2 to the ground 0.47 s.
  - Lands on the nearest level below the landing point: a deck beneath, else the ground.
  - No control and no contact until the landing.
- **Cones stay on the ground.**
```

## 6.2 Locomotion and traffic (Edit 42 rule changed)

```markdown
- **Deck traffic:** full drivers on their deck's level (Z1 or Z2). Rules unchanged otherwise.
- **Checkpoint booms** lift for a car on their own level and deck.
```

## 6.3 Detection (Edit 42 rule replaced)

```markdown
- **Cars sense their own level only.**
  - Ground cars never sense a dummy off Z0, on a stair or in the air.
  - Deck cars sense only a dummy on their own deck.
  - Nothing senses a dummy on a roof or skybridge.
```

## 7.1.1 Districts (rules added)

```markdown
- **High highway:** `world.district.<id>.highDecks` of the flyovers run at Z2. The rest run at Z1.
  - Interchange: one Z1, one Z2. CBD: one Z1, one Z2 (`decks` 1 → 2). Others: one Z1 or none.
  - Flyovers stay on different rows, so Z1 and Z2 never cross.
- **Platforms:** a frontage lot becomes a platform at `world.district.<id>.platformShare` (0.10–0.15).
  - Each low highway screen tries one link platform beside its deck.
```

## 7.4 Static structures (underpass removed; rows added)

```markdown
- **Platform block:** a building to `world.highHeight` (216) with a walkable roof at Z2.
  - Frontage platform: a lot one stair run longer than a roof (176–208 wide).
  - Its tall stair climbs along the road-facing edge, foot in the alley.
  - A single-storey annex fills the strip behind the stair.
- **Link platform:** beside a low highway, one link stair (48) from the shoulder to its roof.
- **Skybridge:** `world.stairWidth` (32) wide, across a gap up to `world.skybridgeMax` (96).
  - The next lot in a row joins a platform at `world.skybridgeChance` (0.75).
  - Up to `world.platformChain` (3) roofs in a row. At most `world.skybridgeCount` (4) per screen.
  - Parapets on both sides. No drop off a skybridge.
- **Roof ledge:** a roof edge facing the road, with open ground below. Other edges have parapets.
- **Towers:** `world.towerHeightMin` 220 → 288. Every tower stands above Z2.
- **Removed:** underpasses, their stairs and passages.
```

## 7.7 Levels (Edit 42 table replaced)

```markdown
| Z | Name | Floors | Reached by | Cars | Bounds |
|---|---|---|---|---|---|
| 0 | Ground (default) | Streets, forecourts | Spawn, stair foot, landing | Ground traffic | Statics, walls, checkpoints |
| 1 | Low highway | Z1 decks | Stair from the ground | Its deck's traffic | Parapets, deck checkpoint |
| 2 | High | Z2 decks, platform roofs, skybridges | Tall stair, link stair, stair to a Z2 deck | A Z2 deck's own traffic | Parapets; ledges drop |

- Heights: `world.deckHeight` (120) for Z1; `world.highHeight` (216) for Z2.
- A stair belongs to no level. Nothing meets the dummy on it.
```

## 7.9 Level contract (clauses replaced and added)

```markdown
19. **Stairs.** Every ground stair foot is reachable from a spawn. A link stair stands on its deck.
    Every flyover has a stair up from the ground and a drop point on its row.
20. **Levels.** `highDecks` flyovers run at Z2, the rest at Z1. Every parapet gap is wider than the dummy.
22. **Platforms.** Every roof is reached by a stair or a skybridge chain. Each skybridge joins two roofs.
    Every ledge drops onto open ground.
```

## 8.3 Damage (Edit 42 rule changed)

```markdown
- **Landing on a car:** downward speed is `damage.dropSpeed` × √(h / `world.deckHeight`).
  - From Z1 (120): stopped sedan 76, sedan at cruise 176, stopped van 78, van at cruise 157.
  - From Z2 (about 161): stopped sedan 136, sedan at cruise 236, stopped van 141, van at cruise 219.
  - Same impulse model and recoil. The legs take it.
```

## 11.3 Rules for the data (Edit 42 rule replaced)

```markdown
- **Baked layout adds:** floors (`kind` deck, roof or bridge; `z`; ledges; roof block; bridge ends), stairs (`from`, `to`, `foot`, `head`, `deck`), deck `z` and `openings`.
- Passages are gone. A layout of another version is rebaked, not read.
```

## Registry changes (`edit44-2026-10-21`)

| ID | Change | Value | Status |
|---|---|---|---|
| `world.highHeight` | Added | 216 units | proposed |
| `world.skybridgeMax` | Added | 96 units | proposed |
| `world.skybridgeChance` | Added | 0.75 | proposed |
| `world.platformChain` | Added | 3 roofs | proposed |
| `world.skybridgeCount` | Added | 4 per screen | proposed |
| `tables.districts.highDecks` | Added column | 0, 0, 1, 1, 0 | user-chosen |
| `tables.districts.platformShare` | Added column | 0.10, 0.12, 0.15, 0.15, 0.12 | proposed |
| `tables.districts.decks` | CBD changed | 1 → 2 | user-chosen |
| `world.towerHeightMin` | Changed | 220 → 288 units | proposed |
| `world.underpassChance` | Retired | — | user-directed |
| `world.stairLength`, `world.stairWidth`, `world.dropSeconds`, `damage.dropSpeed`, `world.deckHeight` | Descriptions: per-height runs and √ scaling | unchanged values | proposed |
| Palette roles `field.tile`, `field.tile2` | Retired with the cutaway | cyber and day | proposed |

## Evidence

- **Tests (81/81).** New: Z heights and stair runs; Z2 lands harder; one high highway in Interchange and CBD; tall stair to a roof and a ledge drop to the forecourt; skybridge crossing and its parapet; link stair up and back; high-highway cars meet only a dummy on their deck. Stairs, deck, drop and bounded tests renumbered.
- **Bake:** 15 kept of 39 candidates. Interchange needed 20: slow or dry start screens.

| District | Highways | Roofs (with ledges) | Skybridges | Tall stairs | Link stairs | First bot write-off, layouts 1–3 |
|---|---|---|---|---|---|---|
| Riverside | none | 1–6 (1–4) | 0–1 | 1–6 | 0 | 25.2, 68.7, 38.5 s |
| Old Market | none | 6–8 (2–5) | 1–2 | 5–6 | 0 | 41.3, 45.9, 47.6 s |
| Interchange | Z1 + Z2 | 2–5 (1–3) | 0 | 1–3 | 1–3 | 19.2, 30.9, 60.3 s |
| CBD | Z1 + Z2 | 2–7 (0–4) | 0 | 0–5 | 2–3 | 21.4, 29.7, 33.4 s |
| Campus | Z1 | 7–10 (4–6) | 2–3 | 4–5 | 3 | 39.2, 22.1, 33.9 s |

- **Start-screen bot:** Standard 800, 150 s, stays on the ground. Automated, not human evidence.
- **Browser:** five districts. Tall stair, roof ledge drop, skybridge, link stair up and down, Z2 stair, by key input. No page errors.

## Open items

- **Roof play:** no cues on a roof. Should ground cars' paths show from Z2, to time a drop?
- **Link stairs** read short from a north deck: 10 px of climb. Playtest whether they read.
- **Skybridges** cluster in Old Market and Campus. Interchange and CBD rarely get adjacent roofs.
- **Ledges facing north** drop the dummy behind its building. The x-ray checker shows it.
- **Interchange bake** starves: 20 candidates for 3 layouts.
