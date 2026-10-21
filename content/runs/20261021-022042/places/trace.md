# Trace — places

Status: **accepted** after 2 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| five city districts Riverside Old Market Interchange Central Business District FARSIGHT C… | `EDIT41#7.2` (61.489), `LOG#P3-update-five-city-districts-o3-40-o3-44` (61.019), `EDIT41#evidence` (41.097) |
| lantern monument fountain square roundabout crash matting island FARSIGHT Tower plaza cal… | `EDIT41#7.2` (56.285), `EDIT26#7.2~2` (31.579), `EDIT41#7.3` (29.759) |
| bounded districts row 1 outer edge is the river wall checkpoint booth boom | `EDIT42#7.1.1` (49.032), `EDIT42#decisions` (30.213), `EDIT42#7.9` (26.83) |
| the dummy starts on B1 on the river centre screen B2 holds the landmark | `EDIT41#7.1.1` (36.221), `EDIT40#edit-40-1-open-edges-body-health-20-october-20-1/evidence` (20.719), `EDIT41#7.9` (19.005) |
| Z0 ground Z1 low highway Z2 high highway platform roofs skybridges reached by | `LOG#P3.3` (58.098), `EDIT44#decisions` (46.467), `EDIT44#4.2` (46.203) |
| roof ledge drops onto the street striped kerb no traffic on roofs cues none | `EDIT44#4.2` (31.419), `DECISIONS#rows-161-170~2` (29.842), `LOG#P3.3` (25.317) |
| high highway Interchange CBD second LED line long drop falls 0.47 s | `LOG#P3.3` (31.842), `DECISIONS#rows-161-170~2` (27.03), `EDIT44#evidence` (24.835) |
| setting Shenzhen smart city new economic zone FARSIGHT sells a city without accidents | `FLEET#F1` (42.727), `EDIT39#3.1` (35.112), `EDIT26#3.1` (32.142) |
| Sinofuturist cyber city inside a friendly corporate terminal the brand never comments | `EDIT39#4.1.1` (40.977), `EDIT26#4.1~1` (21.15), `EDIT37#4.1~1` (20.644) |
| interface copy voice plain instructive toast first visit names the screen | `EDIT40#4.2` (25.984), `EDIT44#4.2` (12.097), `DESIGN#D9.3` (12.076) |
| puddles water no dash cars brake late surfaces terrain | `EDIT40#7.3` (32.289), `EDIT26#7.3~1` (18.818), `LOG#P3-update-districts-puddles-big-battery-o3-33-o3-37` (14.131) |
| buildings single double tower frontage forecourt alleys street wall | `EDIT43#7.4` (25.306), `LOG#P3.2` (21.303), `EDIT43#decisions` (19.251) |

Context given to the generator: 22 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `districts.riverside`: {"intro": "Low-rise blocks run to the river. A lantern monument marks the centre; traffic… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 1 \| Riverside \| Lantern monument on a plaza \| Low-rise, blocks ≤ 112 \| 0 \| 1 \| 3.0 s, 20% vans \| Puddles 2%, jerseys 6% \| |
| `districts.riverside`: {"intro": "Low-rise blocks run to the river. A lantern monument marks the centre; traffic… | `EDIT41#7.1.1` | the dummy starts on B1 on the river centre screen B2 holds … | - **All nine screens are generated.** The dummy starts on B1, on the river. |
| `districts.market`: {"intro": "Dense streets surround a fountain square. Puddles slow the dummy, and vans are… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `districts.market`: {"intro": "Dense streets surround a fountain square. Puddles slow the dummy, and vans are… | `EDIT40#7.3` | puddles water no dash cars brake late surfaces terrain | - **Puddles.** `world.puddleShare` of each screen's tiles (`world.tileSize`) carry water. |
| `districts.interchange`: {"intro": "Flyovers run the north and south rows. A roundabout, with a matting island, ma… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 3 \| Interchange \| Roundabout; crash-matting island \| Mid-rise, 15% towers \| 2, stacked \| 2 \| 2.8 s, 30% vans \| Puddles 2%, jerseys 10% \| |
| `districts.interchange`: {"intro": "Flyovers run the north and south rows. A roundabout, with a matting island, ma… | `EDIT41#7.1.1` | the dummy starts on B1 on the river centre screen B2 holds … | - **The centre screen (B2) holds the landmark.** Roads meet it square at edge midpoints. |
| `districts.cbd`: {"intro": "A flyover crosses the middle row. FARSIGHT Tower stands at the centre, and tow… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| # \| District \| Centre landmark \| Form \| Flyovers \| Quota \| Traffic \| Hazards \| |
| `districts.cbd`: {"intro": "A flyover crosses the middle row. FARSIGHT Tower stands at the centre, and tow… | `EDIT41#7.1.1` | the dummy starts on B1 on the river centre screen B2 holds … | - **Flyovers** cross a whole row or column. |
| `districts.campus`: {"intro": "Impact plates mark the road at the centre. A hit taken on a plate pays more.",… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `districts.campus`: {"intro": "Impact plates mark the road at the centre. A hit taken on a plate pays more.",… | `EDIT41#7.3` | lantern monument fountain square roundabout crash matting i… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `levels`: {"z1": "Low highway: only its own cars drive here. A broken parapet drops you to the stre… | `EDIT44#4.2` | roof ledge drops onto the street striped kerb no traffic on… | - Z1 low highway: pale concrete, one LED line on each parapet. |
| `levels`: {"z1": "Low highway: only its own cars drive here. A broken parapet drops you to the stre… | `EDIT44#decisions` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | \| 162 \| Three levels by height: Z0 ground, Z1 low highway, Z2 high. |

## 3. Consistency loop

### Round 0

- Validator: 1 issue(s).
- Critic verdict: **revise**. The copy mostly sounds like DUMMIES: plain, instructive FARSIGHT intros, concrete signage names, and level toasts that match the placeholders. Four items break the Game data: the CBD intro says flyovers (plural) cross one row, two screen names promise features that don't exist (ramps, a skyway), and one name implies water on a row that is not on the river.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | lore/block | `districts.campus.intro` | FLEET#F2: Banned term 'score' (fleet canon). | Impact plates mark the road at the centre. A hit taken on a plate scores more. | Impact plates mark the road at the centre. A hit taken on a plate pays more. |
| C1 | truth/block | `districts.cbd.intro` | BRIEF: Game data: Z1 and Z2 highways always run on different rows, so only one flyover … | FARSIGHT Tower stands at the centre. Flyovers cross the middle row, and towers shade the street. | A flyover crosses the middle row. FARSIGHT Tower stands at the centre, and towers shade the street. |
| C2 | truth/block | `districts.interchange.screens.B3` | BRIEF: Game data: A name may promise only features all three layouts have. The game has… | Ramp Street | Flyover Street |
| C3 | truth/block | `districts.interchange.screens.C3` | BRIEF: Game data: A skyway implies a skybridge, and Interchange C3 has none. Platform r… | Skyway Heights | Platform Row |
| C4 | truth/fix | `districts.riverside.screens.A3` | BRIEF: Game data: Only row 1 meets the river. A ferry name promises water on a row-3 sc… | Ferry Street | Station Street |

Leaf changes this round: 5.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. It sounds like DUMMIES: the intros and level toasts are plain and instructive, and the screen names read like street signage. I found no canon, truth, rule or data breaks. Every name promises only features that all three layouts have, and the toasts and intros fit the length limits and the Game data.

