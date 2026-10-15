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
| `backdrop`: {"stops": [{"at": 0, "role": "aqua", "alpha": 0.55}, {"at": 0.55, "role": "glass", "alpha… | `DESIGN#D10.1` | Frutiger Aero Windows Aero Wii system menu mid-2000s corpor… | The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. |
| `backdrop`: {"stops": [{"at": 0, "role": "aqua", "alpha": 0.55}, {"at": 0.55, "role": "glass", "alpha… | `EDIT26#4.1~1` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | - **The frame is FARSIGHT's brand.** Frutiger Aero: glossy bevels, translucent panels, soft drop shadows, aqua highlights, rounded corners. |
| `header`: SMART CITY — A city without accidents. | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `header`: SMART CITY — A city without accidents. | `DESIGN#D9.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `panels`: {"radius": "proto.term.panelRadius", "gloss": "proto.term.glossHeight", "border": "glass"… | `DESIGN#D10.1` | Frutiger Aero Windows Aero Wii system menu mid-2000s corpor… | The frame uses FARSIGHT's optimistic Frutiger Aero language: rounded panels, aqua accents, glass, bevels and soft shadows. |
| `panels`: {"radius": "proto.term.panelRadius", "gloss": "proto.term.glossHeight", "border": "glass"… | `EDIT26#4.1~1` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | No gloss, no gradient, no translucency. |
| `icons`: {"BODY": [{"shape": "circle", "x": 0, "y": -4.5, "r": 3, "fill": "dummy"}, {"shape": "rec… | `DESIGN#D10.5` | HUD modules BODY CHARGE FLEET CONTRACT SHIFT RECORD screens | ### D10.5 HUD and screens (§4.5) |
| `icons`: {"BODY": [{"shape": "circle", "x": 0, "y": -4.5, "r": 3, "fill": "dummy"}, {"shape": "rec… | `EDIT26#4.2~4` | shell screens main menu pause diagnostic panels high scores… | \| BODY \| Left, top \| Chassis bar, dent count, lean angle \| Per impact \| |
| `texture`: {"diagnostics": ["battery.capacity", "battery.secondsPerCharge", "damage.bodyHealth", "da… | `EDIT26#4.2~3` | texture micro-type range marks diagnostic runs FARSIGHT sig… | \| Battery glow, CHARGE module \| Proposed \| |
| `texture`: {"diagnostics": ["battery.capacity", "battery.secondsPerCharge", "damage.bodyHealth", "da… | `EDIT26#4.1~2` | frame FARSIGHT brand Frutiger Aero glossy bevels translucen… | \| Texture \| Frame \| Micro-type, range marks, diagnostic runs \| Hairline \| Below legibility by design \| |
| `signage`: {"lines": [{"text": "Thank you for choosing a city without accidents."}, {"text": "Every … | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | - FARSIGHT sells a city without accidents. |
| `signage`: {"lines": [{"text": "Thank you for choosing a city without accidents."}, {"text": "Every … | `DESIGN#D9.2` | bilingual district test identifiers essential language deco… | ### D9.2 A specific fictional district (§3.2) |
| `title`: VISITOR ORIENTATION | `EDIT26#3.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | ### 3.1 World and lore |
| `title`: VISITOR ORIENTATION | `DESIGN#D9.1` | FARSIGHT sells a city without accidents Shenzhen smart city… | ### D9.1 The subject and the contract (§3.1) |

## 3. Consistency loop

### Round 0

- Validator: 2 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: polite, procedural and dry, with signage that stays static and makes no claims about the run. Two title lines are wrong: line 0 muddles the premise and line 1 makes a false economy claim.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/fix | `icons.BODY[2]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[-3, 6], [-3, 8]], "stroke": "joints", "lineWidth": 1.5} | {"shape": "line", "points": [[-3, 6], [-3, 7]], "stroke": "joints", "lineWidth": 1.5} |
| V2 | rule/fix | `icons.BODY[3]` | pipeline:consumer: Icons fit their 16-unit box. | {"shape": "line", "points": [[3, 6], [3, 8]], "stroke": "joints", "lineWidth": 1.5} | {"shape": "line", "points": [[3, 6], [3, 7]], "stroke": "joints", "lineWidth": 1.5} |
| C1 | lore/block | `title.lines[1]` | LOG#P1.5/campaign: Credits total 1+2+2=5 across the campaign. The final L3 write-off end… | {roads} roads, each certified in turn. Write-offs required: {q1}, {q2}, {q3}. Every lost body buys one modifi… | {roads} roads, each certified in turn. Write-offs required: {q1}, {q2}, {q3}. Each lost body buys one modific… |
| C2 | lore/fix | `title.lines[0]` | EDIT26#3.1: FARSIGHT sells a city without accidents and the player's job is to ca… | Welcome, test subject. The fleet will avoid you. Kindly be struck, so FARSIGHT stays accident-free. | Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happ… |

Leaf changes this round: 3.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. This sounds like DUMMIES: polite, procedural and dry, with the brand never remarking on the contradiction. I found no canon, tone, rule, truth or data issues, and the settled fixes are intact.

