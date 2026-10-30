# Trace — citybarks

Status: **accepted** after 2 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| drop off a ledge or broken parapet lands on the nearest level below fall time landing spe… | `EDIT44#5.2` (36.269), `EDIT44#decisions` (31.841), `DECISIONS#rows-161-170~2` (27.36) |
| landing on a car closing speed hit from above legs take it stopped sedan van cruise Z2 | `EDIT44#8.3` (40.757), `EDIT42#8.3` (39.295), `EDIT26#8.3` (17.244) |
| Z0 ground Z1 low highway Z2 high highway platform roofs skybridges levels | `LOG#P3.3` (60.847), `EDIT44#4.2` (48.421), `DECISIONS#rows-161-170~2` (46.389) |
| deck traffic full drivers on their deck level cars sense their own level only | `EDIT42#6.3` (33.267), `EDIT44#6.2` (33.079), `EDIT44#6.3` (32.991) |
| calibrated impact plates on the road points multiplier FARSIGHT Campus | `EDIT41#7.3` (19.962), `EDIT41#7.2` (19.411), `EDIT26#7.2~2` (16.553) |
| vehicles speak as workers corporate politeness barely contains personalities retraining d… | `EDIT26#3.2` (46.861), `FLEET#F2` (43.451), `DESIGN#D9.3` (31.243) |
| tier temperament voice Luxury Corporate polished superior procedural logs KPIs | `FLEET#F4` (67.994), `EDIT39#6.1` (15.899), `EDIT26#6.1~1` (15.272) |
| models in the P3 city S01 V02 Ambassador Waybill chauffeurs board members parcel route | `FLEET#F6` (65.289), `FLEET#F7~2` (22.408), `EDIT39#6.1` (18.708) |
| lore follows state a line may only say what the game state guarantees claims conditions | `EDIT39#3.1` (37.841), `EDIT39#6.6` (24.011), `FLEET#F8` (22.68) |
| bark key model number event front hit side hit write-off seniority mood priority | `EDIT26#6.6` (47.131), `EDIT39#6.6` (23.698), `FLEET#F9.1~2` (21.173) |
| Riverside Old Market Interchange Central Business District FARSIGHT Campus landmark form … | `EDIT41#7.2` (45.862), `LOG#P3-update-five-city-districts-o3-40-o3-44` (42.217), `EDIT41#evidence` (28.501) |
| existing lines impact write-off fleet bark bank style priority | `EDIT26#6.6` (23.41), `FLEET#F9.2` (22.162), `FLEET#F9.10` (19.077) |

Context given to the generator: 22 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `lines[0]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} — A roof? … | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[0]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} — A roof? … | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | - **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. |
| `lines[1]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "roof", "dropZ": 2} — Incident… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[1]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "roof", "dropZ": 2} — Incident… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[2]`: impact — mutter — {"drop": true, "dropFrom": "roof", "dropZ": 2} — Roofs are not on my ro… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[2]`: impact — mutter — {"drop": true, "dropFrom": "roof", "dropZ": 2} — Roofs are not on my ro… | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | - **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. |
| `lines[3]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} — Landed o… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[3]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} — Landed o… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[4]`: impact — speech — {"drop": true, "dropFrom": "deck", "dropZ": 2} — That came off the high… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[4]`: impact — speech — {"drop": true, "dropFrom": "deck", "dropZ": 2} — That came off the high… | `EDIT44#4.2` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | A highway: its own deck's cars. |
| `lines[5]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "deck"} — Form 9: load receive… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[5]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "deck"} — Form 9: load receive… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[6]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "deck", "dropZ": 1} — From the… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[6]`: impact — speech — {"tier": "01", "drop": true, "dropFrom": "deck", "dropZ": 1} — From the… | `EDIT44#4.2` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | A highway: its own deck's cars. |
| `lines[7]`: impact — mutter — {"drop": true, "dropZ": 2} — That fell a long way to reach me. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[7]`: impact — mutter — {"drop": true, "dropZ": 2} — That fell a long way to reach me. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | A skybridge joins two roofs this way. |
| `lines[8]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "deck", "dropZ": 1} — Policy 1… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[8]`: impact — speech — {"tier": "02", "drop": true, "dropFrom": "deck", "dropZ": 1} — Policy 1… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[9]`: impact — speech — {"deck": true} — Nobody walks the highway. Nobody. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[9]`: impact — speech — {"deck": true} — Nobody walks the highway. Nobody. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[10]`: impact — speech — {"tier": "01", "deck": true} — Struck on the highway. How undignified. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[10]`: impact — speech — {"tier": "01", "deck": true} — Struck on the highway. How undignified. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[11]`: impact — speech — {"tier": "02", "deck": true} — Highway strike filed under policy 9. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[11]`: impact — speech — {"tier": "02", "deck": true} — Highway strike filed under policy 9. | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[12]`: impact — mutter — {"plate": true} — Hit on a plate. Calibrated, naturally. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[12]`: impact — mutter — {"plate": true} — Hit on a plate. Calibrated, naturally. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[13]`: impact — speech — {"tier": "01", "plate": true} — Struck on a calibration plate. Vulgar. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[13]`: impact — speech — {"tier": "01", "plate": true} — Struck on a calibration plate. Vulgar. | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[14]`: impact — speech — {"tier": "02", "plate": true} — Plate hit filed against calibration for… | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[14]`: impact — speech — {"tier": "02", "plate": true} — Plate hit filed against calibration for… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[15]`: writeoff — speech — {"tier": "01", "drop": true} — Written off from above. Unthinkable. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[15]`: writeoff — speech — {"tier": "01", "drop": true} — Written off from above. Unthinkable. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "01"} \| speech \| 3 \| A write-off. |
| `lines[16]`: writeoff — speech — {"tier": "02", "drop": true} — Write-off filed. Cause: load from abov… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[16]`: writeoff — speech — {"tier": "02", "drop": true} — Write-off filed. Cause: load from abov… | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[17]`: writeoff — speech — {"deck": true} — Written off on the highway. On my record. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[17]`: writeoff — speech — {"deck": true} — Written off on the highway. On my record. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[18]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[18]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[19]`: impact — mutter — {"district": "riverside"} — Riverside route. Nobody mentioned this. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | A run is five city districts, in order. |
| `lines[20]`: impact — mutter — {"district": "market"} — Old Market. Not on any itinerary. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `lines[21]`: impact — mutter — {"district": "interchange"} — Interchange. Two flyovers and now this. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| # \| District \| Centre landmark \| Form \| Flyovers \| Quota \| Traffic \| Hazards \| |
| `lines[21]`: impact — mutter — {"district": "interchange"} — Interchange. Two flyovers and now this. | `EDIT44#decisions` | drop off a ledge or broken parapet lands on the nearest lev… | \| 167 \| Interchange and CBD run one flyover each at Z2. |
| `lines[22]`: impact — mutter — {"district": "cbd"} — Business district. Of all places. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 4 \| Central Business District \| FARSIGHT Tower on a plaza \| Towers on 50% of large lots \| 1 \| 3 \| 2.6 s, 30% vans \| Puddles 2%, jerseys 8% \| |
| `lines[23]`: impact — mutter — {"district": "campus"} — FARSIGHT Campus. Test centre. How apt. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[23]`: impact — mutter — {"district": "campus"} — FARSIGHT Campus. Test centre. How apt. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The bank sounds like DUMMIES. The lines are dry, in character for each tier, and every claim matches its conditions. One tier-free write-off line uses Corporate procedure, which the Luxury car cannot say.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | tone/fix | `lines[17].text` | FLEET#F4: A line with no tier fires for both S01 and V02, so it must suit both.… | Written off on the highway. Closing ticket. | Written off on the highway. On my record. |

Leaf changes this round: 1.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **pass**. The bank sounds like DUMMIES. Luxury is superior and unapologetic, Corporate files forms and policy numbers, and the tier-free lines are calm and suit both cars. I found no canon, truth, rule or data breaks: every claim matches its `when` conditions, all lines are 48 characters or fewer, and there are no banned words or invented consequences.

