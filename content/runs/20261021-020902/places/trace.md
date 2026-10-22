# Trace — places

Status: **accepted** after 3 critic round(s).

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
| `districts.riverside`: {"intro": "A lantern monument stands at the centre. Traffic is light.", "screens": {"A1":… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| # \| District \| Centre landmark \| Form \| Flyovers \| Quota \| Traffic \| Hazards \| |
| `districts.riverside`: {"intro": "A lantern monument stands at the centre. Traffic is light.", "screens": {"A1":… | `EDIT41#7.1.1` | the dummy starts on B1 on the river centre screen B2 holds … | - **The centre screen (B2) holds the landmark.** Roads meet it square at edge midpoints. |
| `districts.market`: {"intro": "A fountain square stands at the centre. Puddles slow the dummy, and vans are c… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `districts.market`: {"intro": "A fountain square stands at the centre. Puddles slow the dummy, and vans are c… | `EDIT40#7.3` | puddles water no dash cars brake late surfaces terrain | - **Puddles.** `world.puddleShare` of each screen's tiles (`world.tileSize`) carry water. |
| `districts.interchange`: {"intro": "A roundabout stands at the centre, its island crash matting. Flyovers cross ab… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| 3 \| Interchange \| Roundabout; crash-matting island \| Mid-rise, 15% towers \| 2, stacked \| 2 \| 2.8 s, 30% vans \| Puddles 2%, jerseys 10% \| |
| `districts.interchange`: {"intro": "A roundabout stands at the centre, its island crash matting. Flyovers cross ab… | `EDIT41#7.3` | lantern monument fountain square roundabout crash matting i… | - **Matting** (`world.terrain.matting.*`): the roundabout island. |
| `districts.cbd`: {"intro": "FARSIGHT Tower stands at the centre. Barriers and flyovers divide the roads.",… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| # \| District \| Centre landmark \| Form \| Flyovers \| Quota \| Traffic \| Hazards \| |
| `districts.cbd`: {"intro": "FARSIGHT Tower stands at the centre. Barriers and flyovers divide the roads.",… | `EDIT44#decisions` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | \| 166 \| Roof edges facing the road are ledges. |
| `districts.campus`: {"intro": "A calibration plate marks the centre. A hit taken on a plate scores more.", "s… | `EDIT41#7.2` | five city districts Riverside Old Market Interchange Centra… | \| # \| District \| Centre landmark \| Form \| Flyovers \| Quota \| Traffic \| Hazards \| |
| `districts.campus`: {"intro": "A calibration plate marks the centre. A hit taken on a plate scores more.", "s… | `EDIT41#7.3` | lantern monument fountain square roundabout crash matting i… | A hit taken on one scores `damage.plateMultiplier` (1.5) points. |
| `levels`: {"z1": "Low highway. Its own traffic drives here. A broken parapet drops you to the road.… | `EDIT44#4.2` | roof ledge drops onto the street striped kerb no traffic on… | - Z1 low highway: pale concrete, one LED line on each parapet. |
| `levels`: {"z1": "Low highway. Its own traffic drives here. A broken parapet drops you to the road.… | `EDIT44#decisions` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | \| 162 \| Three levels by height: Z0 ground, Z1 low highway, Z2 high. |

## 3. Consistency loop

### Round 0

- Validator: 3 issue(s).
- Critic verdict: **revise**. The content sounds like DUMMIES. The voices are plain and corporate, the screen names are concrete nouns, and every promise (toll, flyover, viaduct, platform, plaza) matches an 'all' flag. One fix is needed: the Riverside intro claims traffic is slow, which nothing in the Game data supports.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/fix | `districts.market.intro` | pipeline:consumer: One or two sentences. | A fountain square stands at the centre. Puddles slow the dummy. Vans are common. | A fountain square stands at the centre. Puddles slow the dummy, and vans are common. |
| V2 | rule/fix | `districts.interchange.intro` | pipeline:consumer: One or two sentences. | A roundabout stands at the centre. Its island is crash matting. Flyovers cross above. | A roundabout stands at the centre, its island crash matting. Flyovers cross above. |
| V3 | truth/block | `districts.campus.intro` | EDIT41#7.1.1: The intro names the centre landmark (plate). | Calibrated plates lie on the centre road. A hit taken on one scores more. | A calibration plate marks the centre. A hit taken on a plate scores more. |
| C1 | data/fix | `districts.riverside.intro` | EDIT41#7.2: Riverside's traffic is set by a 3.0 s interval and 20% vans. No regis… | A lantern monument stands at the centre. Traffic is light and slow. | A lantern monument stands at the centre. Traffic is light. |

Leaf changes this round: 5.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The content sounds like DUMMIES. The intros and level toasts are plain, instructive FARSIGHT interface text, and the screen names read as calm street signage. One screen name promises a feature that only some layouts have.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/block | `districts.market.screens.C1` | BRIEF: Game data: A screen name may promise only features that all three layouts have, … | Canal Steps | Canal Quay |

Leaf changes this round: 1.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. The content sounds like DUMMIES. The intros and level toasts are plain, short and instructive, and the screen names are calm place names. I found nothing to change: every screen name promises only what all three layouts of that district have, and the level toasts match the drop rules.

