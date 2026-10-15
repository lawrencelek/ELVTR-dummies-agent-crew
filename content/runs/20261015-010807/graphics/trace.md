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
| `vehicles.sedan`: Parcel Courier | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `vehicles.sedan`: Parcel Courier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `vehicles.van`: Road Maintenance | `DESIGN#D5.1` | class model appearance sedan van identity marks silhouettes… | ### D5.1 Class, model and appearance (§6.1) |
| `vehicles.van`: Road Maintenance | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -5, "y": 0, "r": 6, "a": "joints", "b": "floor"}… | `DESIGN#D4.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. |
| `dummy`: {"markings": [{"shape": "quadrant", "x": -5, "y": 0, "r": 6, "a": "joints", "b": "floor"}… | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.straight[0]`: Lane divider between the two lanes of the logistics road. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.straight[0]`: Lane divider between the two lanes of the logistics road. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | ### D10.1 Visual register (§4.1) |
| `environment.straight[1]`: North tarmac edge line. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[1]`: North tarmac edge line. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.straight[2]`: South tarmac edge line. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[2]`: South tarmac edge line. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.straight[3]`: LOGISTICS · MAINTENANCE — Road identifier painted on the tarmac at entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[4]`: 物流 · 养护道路 — Chinese road identifier, paired with the English line. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[5]`: Depot gate board on the north verge. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[5]`: Depot gate board on the north verge. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[6]`: DEPOT 货运场 — Bilingual destination text for the depot the traffic serves. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[7]`: High-visibility hatching along the depot gate threshold. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. |
| `environment.straight[7]`: High-visibility hatching along the depot gate threshold. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[8]`: Service pull-in bay for maintenance vehicles. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[8]`: Service pull-in bay for maintenance vehicles. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. |
| `environment.straight[9]`: Calibration ticks along the south shoulder between the two south pillars, one every 40 un… | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.straight[9]`: Calibration ticks along the south shoulder between the two south pillars, one every 40 un… | `DESIGN#D10.2` | visual register instrumented city friendly corporate termin… | Render scaling must not change simulation units. |
| `environment.straight[10]`: Inspection hatch cover on the shoulder. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[0]`: Lane divider between the two lanes. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.barrier[0]`: Lane divider between the two lanes. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | ### D10.1 Visual register (§4.1) |
| `environment.barrier[1]`: North tarmac edge line. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.barrier[1]`: North tarmac edge line. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.barrier[2]`: South tarmac edge line. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.barrier[2]`: South tarmac edge line. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.barrier[3]`: LOGISTICS · MAINTENANCE — Road identifier repeated at entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[4]`: 物流 · 养护道路 — Chinese road identifier. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[5]`: Threshold hatching across the first barrier gap, an entrance to the service yard. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[5]`: Threshold hatching across the first barrier gap, an entrance to the service yard. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. |
| `environment.barrier[6]`: Threshold hatching across the second barrier gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[6]`: Threshold hatching across the second barrier gap. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | A nominal 40-unit barrier gap is a starting layout constraint, not proof of feasibility. |
| `environment.barrier[7]`: YARD — Destination label beyond the first gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[8]`: 货场 — Chinese destination label beyond the first gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[9]`: BAY — Destination label beyond the second gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[10]`: 装卸 — Chinese loading-bay label beyond the second gap. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Chinese wording and locally specific visual references require informed editorial review before final art. |
| `environment.barrier[11]`: High-visibility maintenance cordon hatching on the north verge. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. |
| `environment.barrier[11]`: High-visibility maintenance cordon hatching on the north verge. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[12]`: Calibration ticks along the south shoulder. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.barrier[12]`: Calibration ticks along the south shoulder. | `DESIGN#D10.2` | visual register instrumented city friendly corporate termin… | \| Grid \| `#D4DDE2` \| Calibration pattern, subordinate to cues \| |
| `environment.corner[0]`: Lane divider on the west approach to the bend. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[0]`: Lane divider on the west approach to the bend. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | ### D10.1 Visual register (§4.1) |
| `environment.corner[1]`: Lane divider following the right-angle bend. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[1]`: Lane divider following the right-angle bend. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | ### D10.1 Visual register (§4.1) |
| `environment.corner[2]`: Lane divider on the vertical leg. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[2]`: Lane divider on the vertical leg. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | ### D10.1 Visual register (§4.1) |
| `environment.corner[3]`: Outer tarmac edge line on the west approach. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[3]`: Outer tarmac edge line on the west approach. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[4]`: Outer tarmac edge line round the bend. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[4]`: Outer tarmac edge line round the bend. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[5]`: Outer tarmac edge line on the vertical leg. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[5]`: Outer tarmac edge line on the vertical leg. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[6]`: Inner tarmac edge line on the west approach. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[6]`: Inner tarmac edge line on the west approach. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[7]`: Inner tarmac edge line round the bend. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[7]`: Inner tarmac edge line round the bend. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[8]`: Inner tarmac edge line on the vertical leg. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[8]`: Inner tarmac edge line on the vertical leg. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[9]`: First approach bar painted across the lane. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[9]`: First approach bar painted across the lane. | `LOG#P1.5/pillars-and-blind-spots` | light and relief sun shadows heights pillars barriers crate… | ### Pillars and blind spots |
| `environment.corner[10]`: Second approach bar painted across the lane. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[10]`: Second approach bar painted across the lane. | `LOG#P1.5/pillars-and-blind-spots` | light and relief sun shadows heights pillars barriers crate… | ### Pillars and blind spots |
| `environment.corner[11]`: Third approach bar painted across the lane. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[11]`: Third approach bar painted across the lane. | `LOG#P1.5/pillars-and-blind-spots` | light and relief sun shadows heights pillars barriers crate… | ### Pillars and blind spots |
| `environment.corner[12]`: LOGISTICS · MAINTENANCE — Road identifier at the west entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[13]`: 物流 · 养护道路 — Chinese road identifier at the west entry. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[14]`: DEPOT — Destination painted on the vertical leg. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[15]`: 货运场 — Chinese destination painted on the vertical leg. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[16]`: Service pull-in bay on the outer shoulder. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[16]`: Service pull-in bay on the outer shoulder. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[17]`: Service pull-in bay on the inner shoulder. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[17]`: Service pull-in bay on the inner shoulder. | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The slice uses one complete, authored Road with two lanes, readable approaches, shoulders, a few useful cones, fixed cover and safe repositioning space. |
| `environment.corner[18]`: High-visibility guard hatching outside the bend. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | Reserved red warning cues and high-visibility hazard markings are explicit exceptions, not accidental violations. |
| `environment.corner[18]`: High-visibility guard hatching outside the bend. | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[19]`: Calibration ticks along the vertical leg's outer shoulder. | `DESIGN#D10.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The playfield uses near-white ground, calibration marks, crisp silhouettes, solid edges and matte surfaces. |
| `environment.corner[19]`: Calibration ticks along the vertical leg's outer shoulder. | `DESIGN#D10.2` | visual register instrumented city friendly corporate termin… | \| Grid \| `#D4DDE2` \| Calibration pattern, subordinate to cues \| |

## 3. Consistency loop

### Round 0

- Validator: 9 issue(s).
- Critic verdict: **revise**. The copy and dressing sound like DUMMIES: dry, bilingual, operational, with no cheer or gloss. Three things need correcting: ring shapes on the cars and the dummy that look like gameplay cues, and straight-road edge lines that contradict the 56-unit lane width the corner level uses.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/block | `dummy.markings[1]` | ENG#13.5: Markings stay inside the 13-unit body. | {"shape": "ring", "x": -5, "y": 0, "r": 8.5, "lineWidth": 1, "stroke": "primary"} | {"shape": "rect", "x": -10, "y": -8, "w": 10, "h": 16, "stroke": "primary", "lineWidth": 1} |
| V2 | rule/block | `dummy.markings[3]` | ENG#13.5: Markings stay inside the 13-unit body. | {"shape": "line", "points": [[-14, 0], [4, 0]], "stroke": "primary", "lineWidth": 1} | {"shape": "line", "points": [[-11, 0], [4, 0]], "stroke": "primary", "lineWidth": 1} |
| V3 | rule/fix | `environment.straight[9]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[0, 368], [800, 368]], "dash": [3, 37], "stroke": "structure", "lineWidth": 8, "… | {"shape": "line", "points": [[310, 368], [540, 368]], "dash": [3, 37], "stroke": "structure", "lineWidth": 8,… |
| V4 | data/fix | `environment.corner[0].surface` | pipeline:geometry: Declared tarmac but it sits on verge (220 units from the centreline). | tarmac | tarmac |
| V5 | rule/fix | `environment.corner[0]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[0, 440], [450, 440], [475.9, 436.6], [500, 426.6], [520.7, 410.7], [536.6, 390]… | {"shape": "line", "points": [[0, 440], [450, 440]], "dash": [16, 12], "stroke": "fleet", "lineWidth": 2, "sur… |
| V6 | data/fix | `environment.corner[1].surface` | pipeline:geometry: Declared tarmac but it sits on verge (192 units from the centreline). | tarmac | tarmac |
| V7 | rule/fix | `environment.corner[1]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[0, 496], [450, 496], [490.4, 490.7], [528, 475.1], [560.3, 450.3], [585.1, 418]… | {"shape": "line", "points": [[450, 440], [475.9, 436.6], [500, 426.6], [520.7, 410.7], [536.6, 390], [546.6, … |
| V8 | data/fix | `environment.corner[2].surface` | pipeline:geometry: Declared tarmac but it sits on verge (248 units from the centreline). | tarmac | tarmac |
| V9 | rule/fix | `environment.corner[2]` | DESIGN#D10.6: Cover must stay legible as cover. | {"shape": "line", "points": [[0, 384], [450, 384], [461.4, 382.5], [472, 378.1], [481.1, 371.1], [488.1, 362]… | {"shape": "line", "points": [[550, 340], [550, 0]], "dash": [16, 12], "stroke": "fleet", "lineWidth": 2, "sur… |
| C1 | rule/fix | `vehicles.sedan.roof[2]` | DESIGN#D10.3~1: A closed ring on a car is the closed-commitment cue (DB5). Roof decor… | {"shape": "ring", "x": -19, "y": 0, "r": 5, "lineWidth": 1, "stroke": "secondary"} | {"shape": "rect", "x": -24, "y": -5, "w": 10, "h": 10, "stroke": "secondary", "lineWidth": 1} |
| C2 | rule/fix | `vehicles.van.roof[10]` | DESIGN#D10.3~1: A closed ring on a car is the closed-commitment cue (DB5). Roof decor… | {"shape": "ring", "x": 22, "y": 0, "r": 5.5, "lineWidth": 1, "stroke": "secondary"} | {"shape": "rect", "x": 17, "y": -5.5, "w": 11, "h": 11, "stroke": "secondary", "lineWidth": 1} |
| C3 | rule/fix | `dummy.markings[1]` | DESIGN#D10.3~1: A ring around the dummy reads as the charge ring/segments cue. Body m… | {"shape": "ring", "x": -5, "y": 0, "r": 8.5, "lineWidth": 1, "stroke": "primary"} | {"shape": "rect", "x": -10, "y": -8, "w": 10, "h": 16, "stroke": "primary", "lineWidth": 1} |
| C4 | data/fix | `environment.straight[1].points and envi…` | DESIGN#D6.1: Tarmac half-width is world.laneWidth (56). The corner level uses 56, … | [[0,246],[800,246]] and [[0,354],[800,354]] | (removed or moved) |
| C5 | data/fix | `environment.barrier[1].points and envir…` | DESIGN#D6.1: Tarmac half-width is world.laneWidth (56), so the barrier level's edg… | [[0,246],[800,246]] and [[0,354],[800,354]] | (removed or moved) |

Leaf changes this round: 199.

### Round 1

- Validator: 1 issue(s).
- Critic verdict: **revise**. The dressing is dry and operational and sounds like DUMMIES. Bilingual identifiers are at readable size and the district anchors are covered. Three things break presentation rules: calibration ticks use the barrier colour, the painted chevrons copy the intent-chevron cue, and the DEPOT text sits on the lane divider.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | data/fix | `environment.corner[7].surface` | pipeline:geometry: Declared tarmac but it sits on shoulder (69 units from the centreline… | tarmac | shoulder |
| C1 | rule/fix | `environment.straight[9].stroke (also en…` | DESIGN#D10.2: Calibration patterns use the Grid role (#D4DDE2), subordinate to cues… | "stroke": "structure" | (removed or moved) |
| C2 | rule/fix | `environment.corner[9].points` | DESIGN#D10.3~1: Decoration must not look like a cue. Forward-pointing chevrons painte… | [[300, 420], [320, 440], [300, 460]] | [[320, 420], [320, 460]] |
| C3 | rule/fix | `environment.corner[14].x (and environme…` | DESIGN#D9.2: Essential language must be readable. Centred at x=550, the DEPOT and … | "x": 550 | (removed or moved) |

Leaf changes this round: 18.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The dressing sounds like DUMMIES: dry, operational and bilingual, with the district job carried by the signs. The vehicle roofs and dummy markings keep clear of the pip and the nose corridor. Three things need correcting: one mislabelled surface, one flat board that reads as a barrier, and floor hatching that borrows the sensor and planning-cue treatment.

Open issues (no repair round left):

- C1 [data/fix] `environment.corner[7].surface`: shoulder — Tarmac edge lines sit at world.laneWidth (56) from the centreline, so they are tarmac decals. This inner bend edge is 44 from the arc centre, as the other edge lines are placed.
- C2 [rule/fix] `environment.straight[5].fill`: structure — Structure colour is for barriers and fixed forms. A 170x40 flat board in that colour with a cue-colour outline reads as cover or a crate with no collision footprint (D7.2, D10.6).
- C3 [rule/fix] `environment.barrier[5].stroke (same for environment.barrier[6].stroke)`: secondary — Diagonal hatching in secondary cue colour (planning information) reads as a detection-zone patterned fill. Laid across the barrier gaps, it can also read as a blocked or different-surface gap (D7.2). Decoration must stay subordinate and cannot look like a cue.
- C4 [rule/fix] `environment.straight[8].stroke (same for environment.corner[15].stroke and environment.corner[16].stroke)`: secondary — Sensor information on the floor uses restrained flat patterns that must stay distinguishable from world geometry. Service-bay hatching in the secondary cue colour copies that treatment on the shoulders where the dummy stands. Decoration uses grid or fleet roles.

