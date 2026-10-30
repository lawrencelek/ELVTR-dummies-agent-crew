# Trace — graphics

Status: **accepted** after 3 critic round(s).

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
| `vehicles.sedan`: Depot inspection run | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `vehicles.sedan`: Depot inspection run | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `vehicles.van`: Parts delivery | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `vehicles.van`: Parts delivery | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -3, "y": 0, "r": 5, "a": "joints", "b": "floor"}… | `DESIGN#D4.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -3, "y": 0, "r": 5, "a": "joints", "b": "floor"}… | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.straight[0]`: TEST ROAD 01 · 测试路 01 — Bilingual test-road identifier painted at the district entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.straight[0]`: TEST ROAD 01 · 测试路 01 — Bilingual test-road identifier painted at the district entry. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[1]`: ZONE A-1 — Numbered measuring zone on the north lane. | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.straight[1]`: ZONE A-1 — Numbered measuring zone on the north lane. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.straight[2]`: Outline of a maintenance service bay on the pavement. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[2]`: Outline of a maintenance service bay on the pavement. | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Surfaces:** Tarmac and pavement only. |
| `environment.straight[3]`: MAINT BAY · 维修位 — Service marking naming the bay. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[4]`: Depot forecourt outline north of the road. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[4]`: Depot forecourt outline north of the road. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[5]`: DEPOT 仓区 A — Destination sign that justifies the traffic. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[6]`: Access path from depot to shoulder. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[7]`: High-visibility hazard edge on the depot gate. | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. |
| `environment.straight[7]`: High-visibility hazard edge on the depot gate. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[8]`: SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区 — Bilingual district identifier at entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.straight[8]`: SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区 — Bilingual district identifier at entry. | `DESIGN#D1` | Shenzhen smart city new economic zone city is the testing a… | - **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX. |
| `environment.barrier[0]`: TEST ROAD 02 · 测试路 02 — Bilingual test-road identifier at entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.barrier[0]`: TEST ROAD 02 · 测试路 02 — Bilingual test-road identifier at entry. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.barrier[1]`: ZONE B-2 — Numbered measuring zone on the north lane. | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.barrier[2]`: SERVICE LANE · 维修道 — Service marking on the south pavement. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[3]`: Centre mark through the first barrier gap. | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Structures and props:** Barriers, fixed crates, cones. |
| `environment.barrier[3]`: Centre mark through the first barrier gap. | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| L2 Barrier \| South barrier with two `world.pedestrianGap` gaps; crates \| Cover blocks sensing. |
| `environment.barrier[4]`: Centre mark through the second barrier gap. | `DESIGN#D6.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | - **Structures and props:** Barriers, fixed crates, cones. |
| `environment.barrier[4]`: Centre mark through the second barrier gap. | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| L2 Barrier \| South barrier with two `world.pedestrianGap` gaps; crates \| Cover blocks sensing. |
| `environment.barrier[5]`: GAP A · 通道 — Label for the first gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[5]`: GAP A · 通道 — Label for the first gap. | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| Level \| Layout \| Tests \| |
| `environment.barrier[6]`: GAP B · 通道 — Label for the second gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[6]`: GAP B · 通道 — Label for the second gap. | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| Level \| Layout \| Tests \| |
| `environment.barrier[7]`: CROSS-DOCK 转运 B — Destination sign for the northern yard. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[8]`: Staging yard outline south of the barrier. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[8]`: Staging yard outline south of the barrier. | `BRIEF#P1.8` | level layouts L1 Straight L2 Barrier L3 Corner flyover pill… | \| L2 Barrier \| South barrier with two `world.pedestrianGap` gaps; crates \| Cover blocks sensing. |
| `environment.barrier[9]`: STAGING 暂存区 — Staging yard label. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[0]`: TEST ROAD 03 · 测试路 03 — Bilingual test-road identifier at entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[0]`: TEST ROAD 03 · 测试路 03 — Bilingual test-road identifier at entry. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[1]`: ZONE C-3 — Numbered measuring zone on the vertical leg. | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.corner[2]`: Maintenance yard outline north-west of the road. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[3]`: MAINT YARD 维修场 — Maintenance yard sign. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[4]`: Logistics gate forecourt outside the bend. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[5]`: COLD CHAIN 冷链 C — Destination sign for the logistics gate. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[6]`: SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区 — Bilingual district identifier along the south edge. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[6]`: SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区 — Bilingual district identifier along the south edge. | `DESIGN#D1` | Shenzhen smart city new economic zone city is the testing a… | - **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX. |

## 3. Consistency loop

### Round 0

- Validator: 9 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry district signage, no cheer or slang, and Chinese labels are marked for review. The problems are in the drawn shapes. Roof rings and dashed lines imitate cues, and the 45° yellow hazard hatching looks like barrier hatching and suggests a danger zone the simulation does not have.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | grounding/block | `environment.barrier[3].sources` | pipeline: Cited chunk was not in the retrieved context. | ["DESIGN#D6.2", "LOG#P1.8"] | ["DESIGN#D6.2", "BRIEF#P1.8"] |
| V2 | grounding/block | `environment.barrier[4].sources` | pipeline: Cited chunk was not in the retrieved context. | ["DESIGN#D6.2", "LOG#P1.8"] | ["DESIGN#D6.2", "BRIEF#P1.8"] |
| V3 | grounding/block | `environment.barrier[7].sources` | pipeline: Cited chunk was not in the retrieved context. | ["DESIGN#D9.2", "LOG#P1.8"] | ["DESIGN#D9.2"] |
| V4 | grounding/block | `environment.barrier[8].sources` | pipeline: Cited chunk was not in the retrieved context. | ["DESIGN#D9.2", "LOG#P1.8"] | ["DESIGN#D9.2", "BRIEF#P1.8"] |
| V5 | grounding/block | `environment.barrier[10].sources` | pipeline: Cited chunk was not in the retrieved context. | ["DESIGN#D9.2", "LOG#P1.8"] | (removed or moved) |
| V6 | rule/fix | `environment.straight[5]` | DESIGN#D10.4: Text is about 111 units wide but its board is 100; it spills over the… | {"shape": "text", "x": 610, "y": 178, "text": "DEPOT 仓区 A", "size": 16, "font": "ui", "align": "center", "fil… | {"shape": "text", "x": 610, "y": 178, "text": "DEPOT 仓区 A", "size": 12, "font": "ui", "align": "center", "fil… |
| V7 | rule/fix | `environment.barrier[3]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[250, 394], [290, 394]], "stroke": "secondary", "lineWidth": 1.5, "dash": [5, 4]… | {"shape": "line", "points": [[256, 394], [284, 394]], "stroke": "secondary", "lineWidth": 1.5, "surface": "ve… |
| V8 | rule/fix | `environment.barrier[4]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[510, 394], [550, 394]], "stroke": "secondary", "lineWidth": 1.5, "dash": [5, 4]… | {"shape": "line", "points": [[516, 394], [544, 394]], "stroke": "secondary", "lineWidth": 1.5, "surface": "ve… |
| V9 | rule/fix | `environment.corner[6]` | DESIGN#D10.4: Text is about 141 units wide but its board is 120; it spills over the… | {"shape": "text", "x": 710, "y": 314, "text": "COLD CHAIN 冷链 C", "size": 14, "font": "ui", "align": "center",… | {"shape": "text", "x": 14, "y": 580, "text": "SHENZHEN NEW ECONOMIC ZONE · 深圳新经济区", "size": 12, "font": "ui",… |
| C1 | rule/fix | `vehicles.sedan.roof[3]` | DESIGN#D10.3~1: Decoration must not imitate closed or opening commitment rings. A pri… | {"shape": "ring", "x": 17, "y": 0, "r": 5.5, "lineWidth": 1.5, "stroke": "primary"} | {"shape": "circle", "x": 17, "y": 0, "r": 5.5, "fill": "secondary"} |
| C2 | rule/fix | `vehicles.van.roof[5]` | DESIGN#D10.3~1: Decoration must not imitate closed or opening commitment rings. A pri… | {"shape": "ring", "x": 24, "y": 0, "r": 6, "lineWidth": 1.5, "stroke": "primary"} | {"shape": "circle", "x": 24, "y": 0, "r": 6, "fill": "secondary"} |
| C3 | rule/fix | `environment.straight[6].dash` | DESIGN#D5.1: Dashed lines in cue colour imitate the dashed path of a car's commitm… | [6, 4] | (removed or moved) |
| C4 | rule/fix | `environment.barrier[3].dash` | DESIGN#D10.3~1: A dashed secondary line through a gap imitates a planned route or pre… | [5, 4] | (removed or moved) |
| C5 | rule/fix | `environment.barrier[4].dash` | DESIGN#D10.3~1: A dashed secondary line through a gap imitates a planned route or pre… | [5, 4] | (removed or moved) |
| C6 | rule/fix | `environment.barrier[5]` | DESIGN#D6.2: Decoration must not imply mechanics. Yellow 45° hazard hatching besid… | {"shape": "stripes", "x": 250, "y": 404, "w": 40, "h": 6, "angle": 45, "gap": 5, "stroke": "dummy", "lineWidt… | {"shape": "text", "x": 270, "y": 424, "text": "GAP A · 通道", "size": 10, "font": "mono", "align": "center", "f… |
| C7 | rule/fix | `environment.barrier[6]` | DESIGN#D6.2: Decoration must not imply mechanics. Yellow 45° hazard hatching besid… | {"shape": "stripes", "x": 510, "y": 404, "w": 40, "h": 6, "angle": 45, "gap": 5, "stroke": "dummy", "lineWidt… | {"shape": "text", "x": 530, "y": 424, "text": "GAP B · 通道", "size": 10, "font": "mono", "align": "center", "f… |
| C8 | rule/fix | `environment.corner[2]` | DESIGN#D6.2: Shoulders are plain pavement with no mechanics. A 90×20 hatched yello… | {"shape": "stripes", "x": 300, "y": 360, "w": 90, "h": 20, "angle": 45, "gap": 6, "stroke": "dummy", "lineWid… | {"shape": "rect", "x": 40, "y": 290, "w": 140, "h": 60, "stroke": "secondary", "lineWidth": 1.5, "surface": "… |

Leaf changes this round: 145.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES. It is dry and operational, with district signage, bilingual test identifiers and numbered zones, and it avoids cheer and generic sci-fi. One roof mark is drawn in the reserved cue colour, so it needs to change.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | rule/fix | `vehicles.van.roof[4].fill` | DESIGN#D10.2: Primary cue colour is reserved for reflex information and outlines. A… | primary | secondary |

Leaf changes this round: 1.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. It mostly sounds like DUMMIES: dry, operational district copy with bilingual identifiers and numbered zones, and no cheer or slang. Two rule problems remain. The depot gate hazard hatching reads as a solid barrier, and the vehicle roof dots still use the reserved primary cue colour.

Open issues (no repair round left):

- C1 [rule/fix] `environment.straight[7]`: {"shape": "stripes", "x": 560, "y": 196, "w": 100, "h": 8, "angle": 45, "gap": 6, "stroke": "dummy", "lineWid… — Decoration has no collider, and hatched forms read as barriers. The barrier-level stripes were already replaced for this reason, and yellow hatching also competes with the dummy as the only saturated actor.
- C2 [rule/fix] `vehicles.sedan.roof[4].fill`: primary — Primary cue colour is reserved for reflex information. Settled fixes already moved decorative roof fills off it, and a dark dot on a vehicle can read as a state pip or cue.
- C3 [rule/fix] `vehicles.van.roof[6].fill`: primary — Primary cue colour is reserved for reflex information. Decorative roof hardware must not use it, because it can read as a state pip or cue.

