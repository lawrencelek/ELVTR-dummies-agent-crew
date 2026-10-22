# Trace — terminal

Status: **accepted** after 2 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| frame FARSIGHT brand Frutiger Aero glossy bevels translucent panels aqua highlights round… | `EDIT26#4.1~1` (57.111), `EDIT26#4.1~2` (44.803), `DESIGN#D10.1` (37.302) |
| brand kills you politely report card same aqua rounded corners friendly type one register… | `EDIT26#4.1~1` (57.731), `EDIT26#4.1~3` (23.672), `DESIGN#D10.1` (21.438) |
| texture micro-type range marks diagnostic runs FARSIGHT signage tier 4 first to be cut | `EDIT26#4.2~3` (28.864), `EDIT26#4.1~2` (24.601), `EDIT26#4.1~3` (19.63) |
| decorative diagnostic text never carries a decision first to be removed when density comp… | `DESIGN#D10.3~2` (38.603), `EDIT26#4.2~3` (10.647), `BRIEF#P1.12` (9.524) |
| Frutiger Aero Windows Aero Wii system menu mid-2000s corporate tech marketing take leave … | `EDIT26#4.1~3` (84.924), `DESIGN#D10.1` (27.442), `EDIT26#4.1~1` (18.15) |
| cyberpunk is tonal not surface Chinese signage surveillance grime at panel joints | `EDIT26#4.1~3` (36.906), `EDIT26#4.3` (9.012), `DESIGN#D10.1` (8.932) |
| bilingual district test identifiers essential language decorative micro-type editorial re… | `DESIGN#D9.2` (74.457), `EDIT26#4.1~3` (17.602), `DESIGN#D10.4` (12.115) |
| FARSIGHT sells a city without accidents Shenzhen smart city surveillance instruments test… | `EDIT26#3.1` (51.318), `DESIGN#D1` (27.336), `DESIGN#D9.1` (27.085) |
| reference layout 1280 720 play viewport 800 600 side columns top and bottom strips palett… | `DESIGN#D10.2` (57.428), `EDIT26#4.2~1` (50.906), `EDIT26#7.1~1` (35.045) |
| HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens | `DESIGN#D10.5` (25.983), `EDIT26#4.2~4` (22.812), `EDIT26#4.2~1` (21.584) |
| shell screens main menu pause diagnostic panels high scores personnel record control prom… | `EDIT26#4.2~4` (33.667), `EDIT26#12.4~2` (23.899), `DESIGN#D10.5` (22.774) |
| campaign three roads quota write-offs body credit upgrade difficulty fragile standard rei… | `LOG#P1.5/campaign` (42.271), `LOG#P1.4` (33.607), `EDIT26#10.2` (17.572) |

Context given to the generator: 20 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `backdrop`: {"stops": [{"at": 0, "role": "aqua", "alpha": 0.95}, {"at": 0.5, "role": "glass", "alpha"… | `DESIGN#D10.1` | Frutiger Aero Windows Aero Wii system menu mid-2000s corpor… | The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. |
| `backdrop`: {"stops": [{"at": 0, "role": "aqua", "alpha": 0.95}, {"at": 0.5, "role": "glass", "alpha"… | `EDIT26#4.1~1` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | - **The frame is FARSIGHT's brand.** Frutiger Aero: glossy bevels, translucent panels, soft drop shadows, aqua highlights, rounded corners. |
| `header`: SMART CITY — A city without accidents. | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `header`: SMART CITY — A city without accidents. | `DESIGN#D9.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `panels`: {"radius": "proto.term.panelRadius", "gloss": "proto.term.glossHeight", "border": "glass"… | `DESIGN#D10.1` | Frutiger Aero Windows Aero Wii system menu mid-2000s corpor… | The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. |
| `panels`: {"radius": "proto.term.panelRadius", "gloss": "proto.term.glossHeight", "border": "glass"… | `EDIT26#4.1~2` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | **Gloss never enters the play area.** No gradient, bevel, bloom or translucency is drawn inside `ui.playWidth` × `ui.playHeight`. |
| `icons`: {"BODY": [{"shape": "circle", "x": 0, "y": -4.5, "r": 3, "fill": "dummy"}, {"shape": "rec… | `EDIT26#4.2~4` | shell screens main menu pause diagnostic panels high scores… | \| BODY \| Left, top \| Chassis bar, dent count, lean angle \| Per impact \| |
| `icons`: {"BODY": [{"shape": "circle", "x": 0, "y": -4.5, "r": 3, "fill": "dummy"}, {"shape": "rec… | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens | ### D10.5 HUD and screens (§4.5) |
| `texture`: {"diagnostics": ["damage.bodyHealth", "battery.capacity", "battery.secondsPerCharge", "mo… | `EDIT26#4.2~3` | texture micro-type range marks diagnostic runs FARSIGHT sig… | \| Battery glow, CHARGE module \| Proposed \| |
| `texture`: {"diagnostics": ["damage.bodyHealth", "battery.capacity", "battery.secondsPerCharge", "mo… | `DESIGN#D10.3~2` | decorative diagnostic text never carries a decision first t… | Decorative diagnostic text never carries a decision. |
| `signage`: {"lines": [{"text": "Welcome to the New Economic Zone. Your safety is being measured.", "… | `EDIT26#4.1~1` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | - **The play area is the city, instrumented.** Safety-white ground, calibration grid, numbered impact zones, high-vis markings, hazard stripes over ordinary st… |
| `signage`: {"lines": [{"text": "Welcome to the New Economic Zone. Your safety is being measured.", "… | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | Your job is to cause them. |
| `title`: FARSIGHT SMART CITY · VISITOR TERMINAL | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `title`: FARSIGHT SMART CITY · VISITOR TERMINAL | `DESIGN#D1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - **Role:** FARSIGHT test subject in SHENZHEN SMART CITY, NEW ECONOMIC ZONE, CHINA, 20XX. |

## 3. Consistency loop

### Round 0

- Validator: 4 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: polite, procedural and dry, with no neon, no game-show cheer and no claims about a run. One lore error needs fixing. The title tells the visitor every lost body earns a credit, but the final write-off on the last road pays none.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/fix | `icons.BODY[3]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[-2, 6], [-2, 8]], "stroke": "joints", "lineWidth": 1.5} | {"shape": "line", "points": [[-2, 6], [-2, 7]], "stroke": "joints", "lineWidth": 1.5} |
| V2 | rule/fix | `icons.BODY[4]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[2, 6], [2, 8]], "stroke": "joints", "lineWidth": 1.5} | {"shape": "line", "points": [[2, 6], [2, 7]], "stroke": "joints", "lineWidth": 1.5} |
| V3 | rule/fix | `icons.BUILD[1]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[0, -8], [0, 8]], "stroke": "glass", "lineWidth": 1.5} | {"shape": "line", "points": [[0, -7], [0, 7]], "stroke": "glass", "lineWidth": 1.5} |
| V4 | rule/fix | `icons.BUILD[2]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[-8, 0], [8, 0]], "stroke": "glass", "lineWidth": 1.5} | {"shape": "line", "points": [[-7, 0], [7, 0]], "stroke": "glass", "lineWidth": 1.5} |
| C1 | lore/block | `title.lines[1]` | LOG#P1.5/campaign: Credits total 1 + 2 + 2 = 5 across the campaign, because clearing L3 … | {roads} roads, needing {q1}, {q2} and {q3} write-offs. Each body lost earns a modification credit. | {roads} roads, needing {q1}, {q2} and {q3} write-offs. Each body lost earns a modification credit, except the… |

Leaf changes this round: 7.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. The copy sounds like DUMMIES. It is the polite, procedural FARSIGHT terminal voice, dry underneath, and it never comments on the contradiction of selling a city without accidents. I found no lore, tone, rule, truth or data breaks that CANON supports, and I left the settled fixes alone.

