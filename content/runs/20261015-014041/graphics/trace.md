# Trace — graphics

Status: **accepted** after 4 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| dummy overhead silhouette head disc shoulder bar nose vector black joint markers FARSIGHT… | `DESIGN#D4.1` (48.93), `DESIGN#D10.1` (19.098), `LOG#P1.2/dummy-damage-states` (17.593) |
| visual register instrumented city friendly corporate terminal near-white ground calibrati… | `DESIGN#D10.1` (50.715), `JUICE#J1` (14.218), `DESIGN#D10.2` (11.19) |
| palette roles floor grid structure fleet dummy joints primary secondary warning brand aqua | `DESIGN#D10.2` (46.864), `DESIGN#D10.1` (19.436), `DESIGN#D10.6` (10.647) |
| class model appearance sedan van identity marks silhouettes readable labels | `DESIGN#D5.1` (31.584), `DESIGN#D10.3~1` (15.816), `ENG#6.5` (12.947) |
| fictional district logistics maintenance road entrances destinations service markings rec… | `DESIGN#D9.2` (56.94), `DESIGN#D6.1` (12.291), `DESIGN#D10.5` (10.653) |
| representative finished assets two recognisable vehicle identities coherent environment c… | `DESIGN#D10.6` (57.277), `DESIGN#D6.3` (12.008), `DESIGN#D11.1` (11.571) |
| light and relief sun shadows heights pillars barriers crates lit edges | `LOG#P1.2/light-and-relief` (44.304), `LOG#P1.5/pillars-and-blind-spots` (25.155), `LOG#P1.1-observations` (20.311) |
| Shenzhen smart city new economic zone city is the testing apparatus grids numbered zones … | `DESIGN#D9.1` (42.233), `DESIGN#D1` (37.827), `DESIGN#D9.2` (9.67) |
| level layouts L1 Straight L2 Barrier L3 Corner flyover pillars barrier gaps bend | `BRIEF#P1.8` (43.126), `LOG#P1.5/pillars-and-blind-spots` (38.237), `LOG#P1.1/chassis-grades` (25.216) |
| surfaces tarmac pavement shoulders kerbs stripes add no mechanics | `DESIGN#D6.2` (37.001), `ENG#7.2` (25.486), `ENG#7.4` (9.374) |
| dummy damage states dents shoulder bar bends facing arrow never changes | `LOG#P1.2/dummy-damage-states` (36.797), `DESIGN#D4.1` (14.67), `LOG#P1.9/automated-evidence` (11.073) |

Context given to the generator: 18 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `vehicles.sedan`: Depot parcel courier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `vehicles.sedan`: Depot parcel courier | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `vehicles.van`: Lane maintenance | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `vehicles.van`: Lane maintenance | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -4, "y": -6.5, "r": 3.5, "a": "joints", "b": "fl… | `DESIGN#D4.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -4, "y": -6.5, "r": 3.5, "a": "joints", "b": "fl… | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.straight[0]`: L1 SERVICE ROAD — Road identifier in the north lane | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[0]`: L1 SERVICE ROAD — Road identifier in the north lane | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.straight[1]`: 服务道路 L1 — Chinese road identifier in the south lane | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[2]`: Survey ticks on the 40-unit grid pitch | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.straight[2]`: Survey ticks on the 40-unit grid pitch | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | ### D10.1 Visual register (§4.1) |
| `environment.straight[3]`: Survey ticks on the south edge | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | ### D9.1 The subject and the contract (§3.1) |
| `environment.straight[3]`: Survey ticks on the south edge | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.straight[4]`: Service edge line for maintenance vehicles | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[4]`: Service edge line for maintenance vehicles | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Surfaces:** Tarmac and pavement only. |
| `environment.straight[5]`: SERVICE SHOULDER — Service marking on the pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[6]`: DEPOT GATE A — Destination sign for the depot entrance | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[6]`: DEPOT GATE A — Destination sign for the depot entrance | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[7]`: 仓区入口 A — Chinese destination sign | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[8]`: Painted loading bay outline, no collider | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[8]`: Painted loading bay outline, no collider | `DESIGN#D10.3~1` | class model appearance sedan van identity marks silhouettes… | ### D10.3 Information taxonomy (§4.3) |
| `environment.straight[9]`: BAY 3 — Loading bay label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[0]`: L2 SERVICE ROAD — Road identifier in the north lane | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[0]`: L2 SERVICE ROAD — Road identifier in the north lane | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.barrier[1]`: 服务道路 L2 — Chinese road identifier in the south lane | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[2]`: Survey ticks on the grid pitch | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.barrier[2]`: Survey ticks on the grid pitch | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | ### D10.1 Visual register (§4.1) |
| `environment.barrier[3]`: Service edge line along the south pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[3]`: Service edge line along the south pavement | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Surfaces:** Tarmac and pavement only. |
| `environment.barrier[4]`: STAFF GAP — Label for the west yard entrance in the barrier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[4]`: STAFF GAP — Label for the west yard entrance in the barrier | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| L2 Barrier \| South barrier with two `world.pedestrianGap` gaps; crates \| Cover blocks sensing. |
| `environment.barrier[5]`: STAFF GAP — Label for the east yard entrance in the barrier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[5]`: STAFF GAP — Label for the east yard entrance in the barrier | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| L2 Barrier \| South barrier with two `world.pedestrianGap` gaps; crates \| Cover blocks sensing. |
| `environment.barrier[6]`: Yard bay line behind the barrier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[6]`: Yard bay line behind the barrier | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Structures and props:** Barriers, fixed crates, cones. |
| `environment.barrier[7]`: DEPOT GATE B — Destination sign for the depot entrance | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[8]`: 仓区入口 B — Chinese destination sign | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[0]`: L3 SERVICE ROAD — Road identifier on the approach leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[0]`: L3 SERVICE ROAD — Road identifier on the approach leg | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[1]`: 服务道路 L3 — Chinese road identifier on the approach leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[2]`: DEPOT EXIT 3 — Destination marking on the vertical leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[3]`: 仓区出口 3 — Chinese destination marking | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[4]`: Survey ticks along the approach leg | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | ### D9.1 The subject and the contract (§3.1) |
| `environment.corner[4]`: Survey ticks along the approach leg | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | ### D10.1 Visual register (§4.1) |
| `environment.corner[5]`: Survey ticks along the vertical leg | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | ### D9.1 The subject and the contract (§3.1) |
| `environment.corner[5]`: Survey ticks along the vertical leg | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | ### D10.1 Visual register (§4.1) |
| `environment.corner[6]`: Service edge line on the south pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[6]`: Service edge line on the south pavement | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Surfaces:** Tarmac and pavement only. |
| `environment.corner[7]`: Painted maintenance bay outline inside the bend, no collider | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[7]`: Painted maintenance bay outline inside the bend, no collider | `DESIGN#D10.3~1` | class model appearance sedan van identity marks silhouettes… | ### D10.3 Information taxonomy (§4.3) |
| `environment.corner[8]`: MAINT BAY 3 — Maintenance bay label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[9]`: 养护区 3 — Chinese maintenance bay label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[10]`: Painted depot gate outline outside the bend, no collider | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[10]`: Painted depot gate outline outside the bend, no collider | `DESIGN#D10.3~1` | class model appearance sedan van identity marks silhouettes… | Keep actor identity, intent/commitment, braking and spent state readable outside the view cone. |
| `environment.corner[11]`: DEPOT GATE C — Destination sign for the depot entrance | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[12]`: 仓区入口 C — Chinese destination sign | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |

## 3. Consistency loop

### Round 0

- Validator: 8 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry, operational, bilingual and free of marketing gloss. The faults are presentation rules: a roof mark that imitates the state pip, structure colour used on car roofs, road identifiers too faint to pass the 3:1 tier-2 contrast target, and one label that implies a mechanic.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/block | `vehicles.sedan.roof[2]` | DESIGN#D10.3~1: Keep the state pip clear; cues outrank decoration. | {"shape": "line", "points": [[-12, -6], [-8, -6], [-8, 6], [-12, 6], [-12, -6]], "stroke": "primary", "lineWi… | {"shape": "line", "points": [[-15, -6], [-11, -6], [-11, 6], [-15, 6], [-15, -6]], "stroke": "primary", "line… |
| V2 | rule/block | `vehicles.van.roof[6]` | DESIGN#D10.3~1: Keep the state pip clear; cues outrank decoration. | {"shape": "ring", "x": -14, "y": 0, "r": 6, "lineWidth": 1, "stroke": "secondary"} | {"shape": "ring", "x": -17, "y": 0, "r": 6, "lineWidth": 1, "stroke": "secondary"} |
| V3 | rule/fix | `environment.straight[2]` | DESIGN#D9.2: Decal must sit fully inside the field; cut-off text is unreadable. | {"shape": "line", "points": [[0, 252], [800, 252]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… | {"shape": "line", "points": [[3, 252], [797, 252]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… |
| V4 | rule/fix | `environment.straight[3]` | DESIGN#D9.2: Decal must sit fully inside the field; cut-off text is unreadable. | {"shape": "line", "points": [[0, 348], [800, 348]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… | {"shape": "line", "points": [[3, 348], [797, 348]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… |
| V5 | rule/fix | `environment.straight[4]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[120, 368], [330, 368]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "a… | {"shape": "line", "points": [[120, 378], [330, 378]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "a… |
| V6 | rule/fix | `environment.barrier[2]` | DESIGN#D9.2: Decal must sit fully inside the field; cut-off text is unreadable. | {"shape": "line", "points": [[0, 252], [800, 252]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… | {"shape": "line", "points": [[3, 252], [797, 252]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… |
| V7 | rule/fix | `environment.corner[3]` | DESIGN#D9.2: Decal must sit fully inside the field; cut-off text is unreadable. | {"shape": "line", "points": [[0, 392], [440, 392]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… | {"shape": "line", "points": [[3, 392], [440, 392]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… |
| V8 | rule/fix | `environment.corner[4]` | DESIGN#D9.2: Decal must sit fully inside the field; cut-off text is unreadable. | {"shape": "line", "points": [[502, 0], [502, 330]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… | {"shape": "line", "points": [[502, 3], [502, 330]], "dash": [2, 38], "stroke": "secondary", "lineWidth": 6, "… |
| C1 | rule/fix | `vehicles.sedan.roof[5]` | DESIGN#D10.3~1: Decoration must not imitate cue shapes. A small ring with a centre do… | {"shape": "ring", "x": 17, "y": 0, "r": 6, "lineWidth": 1, "stroke": "secondary"} | {"shape": "rect", "x": 14, "y": -4, "w": 6, "h": 8, "stroke": "secondary", "lineWidth": 1} |
| C2 | rule/fix | `vehicles.van.roof[9].fill` | DESIGN#D10.2: Structure colour is reserved for barriers and fixed forms, so it must… | structure | secondary |
| C3 | rule/fix | `vehicles.van.roof[10].fill` | DESIGN#D10.2: Structure colour is reserved for barriers and fixed forms, so it must… | structure | secondary |
| C4 | rule/fix | `environment.straight[0].alpha` | DESIGN#D10.2: Essential road identifiers need a 3:1 tier-2 contrast target. Seconda… | 0.5 | 0.7 |
| C5 | rule/fix | `environment.straight[1].alpha` | DESIGN#D9.2: Essential bilingual identifiers must stay readable and not become fai… | 0.5 | 0.7 |
| C6 | rule/fix | `environment.barrier[0].alpha` | DESIGN#D10.2: The tier-2 contrast target is 3:1, and 50% secondary ink falls short … | 0.5 | 0.7 |
| C7 | rule/fix | `environment.barrier[1].alpha` | DESIGN#D9.2: Essential bilingual identifiers must stay readable. | 0.5 | 0.7 |
| C8 | rule/fix | `environment.corner[0].alpha` | DESIGN#D10.2: The tier-2 contrast target is 3:1, and 50% secondary ink falls short … | 0.5 | 0.7 |
| C9 | rule/fix | `environment.corner[1].alpha` | DESIGN#D9.2: Essential bilingual identifiers must stay readable. | 0.5 | 0.7 |
| C10 | rule/fix | `environment.corner[2].alpha` | DESIGN#D9.2: A destination marking is essential operational text and needs the 3:1… | 0.5 | 0.7 |
| C11 | rule/fix | `environment.straight[5].text` | DESIGN#D6.2: Stripes and kerbs add no mechanics, and the slice has no pull-in or p… | SERVICE PULL-IN | SERVICE SHOULDER |

Leaf changes this round: 37.

### Round 1

- Validator: 1 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry depot and service-road wording, with no cheer or generic sci-fi. Two problems remain: two destination markings have no Chinese pair, which breaks the bilingual-entry anchor, and one van roof ring reads as a commitment cue.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/fix | `environment.straight[4]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[120, 378], [330, 378]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "a… | {"shape": "line", "points": [[120, 378], [262, 378]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "a… |
| C1 | lore/fix | `environment.corner[10].text` | DESIGN#D9.2: Entry and destination identifiers must be bilingual. Gates A and B ca… | DEPOT GATE C | (removed or moved) |
| C2 | lore/fix | `environment.corner[2].text` | DESIGN#D9.2: Entry and destination identifiers must be bilingual. Essential langua… | DEPOT EXIT 3 | DEPOT EXIT 3 |
| C3 | rule/fix | `vehicles.van.roof[6]` | DESIGN#D10.3~1: Decoration must not imitate cue shapes. A closed ring on the car read… | {"shape": "ring", "x": -17, "y": 0, "r": 6, "lineWidth": 1, "stroke": "secondary"} | {"shape": "rect", "x": -20, "y": -3, "w": 6, "h": 6, "stroke": "secondary", "lineWidth": 1} |

Leaf changes this round: 100.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry, operational, bilingual, with no cheer or slang. Two service edge lines were not given the same fix as the SETTLED straight[4] line. They still sit too close to the edge strip and run the full length of the level like a dashed path.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | rule/fix | `environment.barrier[3]` | DESIGN#D10.6: The same dashed service edge line was already moved to y 378 and shor… | {"shape": "line", "points": [[0, 368], [800, 368]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "alp… | {"shape": "line", "points": [[120, 378], [262, 378]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "a… |
| C2 | rule/fix | `environment.corner[6]` | DESIGN#D10.6: The same settled correction applies here. At y 508 the line is 6 unit… | {"shape": "line", "points": [[0, 508], [450, 508]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "alp… | {"shape": "line", "points": [[20, 524], [162, 524]], "dash": [8, 6], "stroke": "fleet", "lineWidth": 1.5, "al… |

Leaf changes this round: 4.

### Round 3

- Validator: 1 issue(s).
- Critic verdict: **revise**. It sounds like DUMMIES: dry depot and service wording, bilingual identifiers at readable sizes, and no cheerful or generic sci-fi copy. One problem remains: a long dashed structure-colour line behind the L2 barrier can be read as barrier geometry.

Open issues (no repair round left):

- V1 [data/fix] `environment.corner[6].surface`: shoulder — Declared shoulder but it sits on verge (84 units from the centreline).
- C1 [rule/fix] `environment.barrier[6]`: {"shape":"line","points":[[0,450],[800,450]],"dash":[30,10],"stroke":"structure","lineWidth":1,"alpha":0.8,"s… — Structure colour is reserved for barriers and fixed forms, and decoration must not read as a solid barrier or as a gap (BRIEF consumer contract; ENG#7.2). This is a full-width dashed structure-colour line directly behind the L2 barrier, so its dashes can read as a barrier continuation with 10-unit gaps.

