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
| `vehicles.sedan`: Depot parcel courier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `vehicles.sedan`: Depot parcel courier | `DESIGN#D10.6` | representative finished assets two recognisable vehicle ide… | ### D10.6 Representative finished assets (§4.6) |
| `vehicles.van`: Maintenance supply run | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `vehicles.van`: Maintenance supply run | `DESIGN#D10.6` | representative finished assets two recognisable vehicle ide… | ### D10.6 Representative finished assets (§4.6) |
| `dummy`: {"markings": [{"shape": "rect", "x": -12, "y": -4.5, "w": 11, "h": 9, "fill": "floor", "s… | `DESIGN#D4.1` | dummy overhead silhouette head disc shoulder bar nose vecto… | The finished overhead silhouette uses a head disc, shoulder bar, nose vector, black joint markers and FARSIGHT markings. |
| `dummy`: {"markings": [{"shape": "rect", "x": -12, "y": -4.5, "w": 11, "h": 9, "fill": "floor", "s… | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.straight[0]`: 物流路 LOGISTICS RD — Bilingual road name stencilled on the tarmac of the logistics road | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[0]`: 物流路 LOGISTICS RD — Bilingual road name stencilled on the tarmac of the logistics road | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.straight[1]`: Utility access cover; no mechanics | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[1]`: Utility access cover; no mechanics | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.straight[2]`: Painted service kerb line on the north pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[2]`: Painted service kerb line on the north pavement | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.straight[3]`: Painted service kerb line on the south pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[3]`: Painted service kerb line on the south pavement | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.straight[4]`: Flat apron in front of the depot gate | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.straight[4]`: Flat apron in front of the depot gate | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.straight[5]`: Depot gate: the entrance that justifies the traffic | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[5]`: Depot gate: the entrance that justifies the traffic | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. |
| `environment.straight[6]`: A1 仓区入口 DEPOT — Bilingual depot entrance label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.straight[7]`: 测试区01 TEST ZONE 01 — Bilingual district/test identifier board | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.straight[7]`: 测试区01 TEST ZONE 01 — Bilingual district/test identifier board | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |
| `environment.barrier[0]`: 维保路 SERVICE RD — Bilingual maintenance road name stencilled on the tarmac | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[0]`: 维保路 SERVICE RD — Bilingual maintenance road name stencilled on the tarmac | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.barrier[1]`: Utility access cover; no mechanics | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.barrier[1]`: Utility access cover; no mechanics | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.barrier[2]`: Painted service kerb line on the south pavement, behind the barrier | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[2]`: Painted service kerb line on the south pavement, behind the barrier | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.barrier[3]`: Maintenance yard gate on the north side | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[3]`: Maintenance yard gate on the north side | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. |
| `environment.barrier[4]`: B1 检修场 YARD — Bilingual yard label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.barrier[5]`: Service door beyond the west barrier gap; destination for the gap | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[5]`: Service door beyond the west barrier gap; destination for the gap | `LOG#P1.5/pillars-and-blind-spots` | light and relief sun shadows heights pillars barriers crate… | The south barrier with gaps remains. |
| `environment.barrier[6]`: Service door beyond the east barrier gap | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[6]`: Service door beyond the east barrier gap | `LOG#P1.5/pillars-and-blind-spots` | light and relief sun shadows heights pillars barriers crate… | The south barrier with gaps remains. |
| `environment.barrier[7]`: 检修口 SERVICE DOOR — Bilingual service-door label (west) | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.barrier[8]`: 检修口 SERVICE DOOR — Bilingual service-door label (east) | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[0]`: 物流路 LOGISTICS RD — Bilingual road name on the approach leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[0]`: 物流路 LOGISTICS RD — Bilingual road name on the approach leg | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[1]`: Utility access cover; no mechanics | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[1]`: Utility access cover; no mechanics | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.corner[2]`: Painted service kerb line on the south pavement | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[2]`: Painted service kerb line on the south pavement | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.corner[3]`: Painted service kerb line on the east pavement of the vertical leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | A logistics/maintenance road that visibly serves a working district, with entrances, destinations and service markings that justify the traffic. |
| `environment.corner[3]`: Painted service kerb line on the east pavement of the vertical leg | `ENG#7.2` | surfaces tarmac pavement shoulders kerbs stripes add no mec… | Shoulders are pavement; kerbs and painted stripes add no implicit mechanics. |
| `environment.corner[4]`: Yard gate inside the bend | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[4]`: Yard gate inside the bend | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | ### D6.1 One authored Road (§7.1) |
| `environment.corner[5]`: C1 站场 YARD — Bilingual yard gate label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[6]`: Flat apron in front of the yard gate | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | ### D9.2 A specific fictional district (§3.2) |
| `environment.corner[6]`: Flat apron in front of the yard gate | `DESIGN#D10.1` | visual register instrumented city friendly corporate termin… | Sensor information on the floor uses restrained flat patterns and edges that remain distinguishable from world geometry. |
| `environment.corner[7]`: Fleet bay serving the district vehicles | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Recurring vehicle jobs and certification language tied to this district, rather than interchangeable science-fiction commentary. |
| `environment.corner[7]`: Fleet bay serving the district vehicles | `DESIGN#D6.1` | fictional district logistics maintenance road entrances des… | The scene's signage, maintenance fixtures and traffic task establish the fictional district described in §3. |
| `environment.corner[8]`: 车位 FLEET BAY — Bilingual fleet bay label | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[9]`: 测试区03 TEST ZONE 03 — Bilingual district/test identifier board beside the vertical leg | `DESIGN#D9.2` | fictional district logistics maintenance road entrances des… | Readable bilingual district/test identifiers at entry and in the report. |
| `environment.corner[9]`: 测试区03 TEST ZONE 03 — Bilingual district/test identifier board beside the vertical leg | `DESIGN#D9.1` | Shenzhen smart city new economic zone city is the testing a… | - Streets, delivery routes and maintenance spaces carry grids, numbered zones and measuring instruments. |

## 3. Consistency loop

### Round 0

- Validator: 1 issue(s).
- Critic verdict: **revise**. The district dressing mostly sounds like DUMMIES: dry, operational and specific to the logistics and maintenance zone. It breaks the presentation rules in places, though. It uses decorative translucency, cue-like rings, dashes and hatching, a label that implies a mechanic, and "bilingual" labels that are Chinese-only.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/block | `dummy.markings[1]` | ENG#13.5: Markings stay inside the 13-unit body. | {"shape": "text", "x": -6.5, "y": 0, "text": "FS", "size": 9, "font": "mono", "align": "center", "fill": "pri… | {"shape": "text", "x": -5, "y": 2.5, "text": "FS", "size": 9, "font": "mono", "align": "center", "fill": "pri… |
| C1 | rule/fix | `vehicles.sedan.roof[0].alpha` | ENG#5.8: No decorative translucency in the matte field; translucency stays in … | 0.6 | 1 |
| C2 | rule/fix | `environment.straight[0].alpha / environ…` | ENG#5.8: The matte field has no decorative translucency. Essential district la… | "fill": "fleet", "alpha": 0.55 | (removed or moved) |
| C3 | lore/fix | `environment.straight[6].text` | DESIGN#D9.2: District identifiers are bilingual and essential language must be rea… | A1 仓区入口 | A1 仓区入口 DEPOT |
| C4 | lore/fix | `environment.barrier[4].text` | DESIGN#D9.2: Bilingual labels must carry both languages. | B1 检修场 | B1 检修场 YARD |
| C5 | lore/fix | `environment.barrier[7].text, environmen…` | DESIGN#D9.2: The service-door labels are noted as bilingual but are Chinese only. | 检修口 | (removed or moved) |
| C6 | lore/fix | `environment.corner[5].text` | DESIGN#D9.2: Bilingual labels must carry both languages. | C1 站场 | C1 站场 YARD |
| C7 | rule/fix | `environment.corner[8].text` | DESIGN#D10.3~1: CHARGE is the name of the lunge-charge cue and battery mechanic. Deco… | 充电位 CHARGE | 车位 FLEET BAY |
| C8 | rule/fix | `environment.straight[1].stroke, environ…` | DESIGN#D10.3~1: A secondary-ink ring on the tarmac imitates the closed or opening com… | "stroke": "secondary", "lineWidth": 1.5 | (removed or moved) |
| C9 | rule/fix | `environment.straight[2], environment.st…` | DESIGN#D10.3~1: Dashed secondary-ink lines imitate the planning cues (dashed predicte… | "dash": [10, 6], "stroke": "secondary", "lineWidth": 1.5 | (removed or moved) |
| C10 | rule/fix | `environment.straight[4], environment.co…` | DESIGN#D6.2: Hatching in structure colour imitates the renderer's barrier hatching… | "shape": "stripes", ... "angle": 45, "gap": 6, "stroke": "structure" | (removed or moved) |
| C11 | rule/fix | `environment.barrier[5], environment.bar…` | ENG#7.2: A structure-fill, outlined solid placed just beyond each barrier gap … | "fill": "structure", "stroke": "primary" | (removed or moved) |

Leaf changes this round: 54.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry, operational, bilingual, with no cheer or generic sci-fi. The one problem is the three tarmac road names, which are set in the secondary-cue colour. That is a planning-cue role, and it probably fails the contrast target on fleet-grey tarmac.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | rule/fix | `environment.straight[0].fill` | DESIGN#D10.2: Essential text needs a 4.5:1 target against its actual background. #4… | secondary | primary |
| C2 | rule/fix | `environment.barrier[0].fill` | DESIGN#D10.2: Essential text needs a 4.5:1 target against its actual background. Se… | secondary | primary |
| C3 | rule/fix | `environment.corner[0].fill` | DESIGN#D10.2: Essential text needs a 4.5:1 target against its actual background. Se… | secondary | primary |

Leaf changes this round: 3.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. The content sounds like DUMMIES. The copy is dry and bilingual, and it uses district job language (depot, yard, service door, test zone) instead of generic sci-fi. I found no canon breaks beyond the fixes already settled: the markings stay out of the nose corridor, fills use palette roles, nothing imitates a cue, and no decal implies a mechanic.

