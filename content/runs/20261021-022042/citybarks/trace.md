# Trace — citybarks

Status: **accepted** after 4 critic round(s).

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
| `lines[0]`: impact — speech — {"dropFrom": "roof", "tier": "01"} — From a roof. My paintwork was not … | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[0]`: impact — speech — {"dropFrom": "roof", "tier": "01"} — From a roof. My paintwork was not … | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[1]`: impact — speech — {"dropFrom": "roof", "tier": "02"} — Roof landing logged. Form 44-R ope… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[1]`: impact — speech — {"dropFrom": "roof", "tier": "02"} — Roof landing logged. Form 44-R ope… | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | - **Landing on a car:** downward speed is `damage.dropSpeed` × √(h / `world.deckHeight`). |
| `lines[2]`: impact — speech — {"dropFrom": "roof"} — Dropped on from a roof. Noted. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[2]`: impact — speech — {"dropFrom": "roof"} — Dropped on from a roof. Noted. | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | ## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57) |
| `lines[3]`: impact — mutter — {"dropFrom": "roof"} — A roof drop. Logging it. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[3]`: impact — mutter — {"dropFrom": "roof"} — A roof drop. Logging it. | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | - **Drops:** off a roof ledge or a broken parapet, onto the nearest level below. |
| `lines[4]`: impact — speech — {"dropFrom": "deck", "tier": "01"} — The highway parapet. Not on my iti… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[4]`: impact — speech — {"dropFrom": "deck", "tier": "01"} — The highway parapet. Not on my iti… | `EDIT44#4.2` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | A highway: its own deck's cars. |
| `lines[5]`: impact — speech — {"dropFrom": "deck", "tier": "02"} — Highway parapet drop logged. Form … | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[5]`: impact — speech — {"dropFrom": "deck", "tier": "02"} — Highway parapet drop logged. Form … | `EDIT44#4.2` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | A highway: its own deck's cars. |
| `lines[6]`: impact — speech — {"dropFrom": "deck"} — Dropped from the highway. Noted. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[6]`: impact — speech — {"dropFrom": "deck"} — Dropped from the highway. Noted. | `EDIT44#4.2` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | A highway: its own deck's cars. |
| `lines[7]`: impact — thought — {"dropZ": 2, "tier": "01"} — A long way down, to land on me... | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[7]`: impact — thought — {"dropZ": 2, "tier": "01"} — A long way down, to land on me... | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | A skybridge joins two roofs this way. |
| `lines[8]`: impact — speech — {"dropZ": 2, "tier": "02"} — Fall from height logged. Form 2-H. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[8]`: impact — speech — {"dropZ": 2, "tier": "02"} — Fall from height logged. Form 2-H. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - Fall time: `world.dropSeconds` × √(h / `world.deckHeight`). |
| `lines[9]`: impact — speech — {"dropZ": 2} — Landed on from a great height. Noted. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[9]`: impact — speech — {"dropZ": 2} — Landed on from a great height. Noted. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | ## 5.2 Movement (Edit 42 rules replaced) |
| `lines[10]`: impact — speech — {"dropZ": 1, "dropFrom": "deck"} — Dropped from the low highway. Noted. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[10]`: impact — speech — {"dropZ": 1, "dropFrom": "deck"} — Dropped from the low highway. Noted. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[11]`: impact — speech — {"deck": true, "tier": "01"} — Struck on the highway. Even here. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[11]`: impact — speech — {"deck": true, "tier": "01"} — Struck on the highway. Even here. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[12]`: impact — speech — {"deck": true, "tier": "02"} — Highway deck incident logged. Form 12-D. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[12]`: impact — speech — {"deck": true, "tier": "02"} — Highway deck incident logged. Form 12-D. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[13]`: impact — speech — {"deck": true} — Hit on the highway deck. Noted. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[13]`: impact — speech — {"deck": true} — Hit on the highway deck. Noted. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[14]`: impact — thought — {"deck": true, "tier": "01"} — Even the flyover has no peace... | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[14]`: impact — thought — {"deck": true, "tier": "01"} — Even the flyover has no peace... | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[15]`: impact — speech — {"plate": true} — Hit on a calibration plate. Recorded. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[15]`: impact — speech — {"plate": true} — Hit on a calibration plate. Recorded. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[16]`: impact — speech — {"plate": true, "tier": "01"} — Struck on a plate. They call this testi… | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[16]`: impact — speech — {"plate": true, "tier": "01"} — Struck on a plate. They call this testi… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[17]`: impact — speech — {"plate": true, "tier": "02"} — Calibration plate strike logged. Form P… | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[17]`: impact — speech — {"plate": true, "tier": "02"} — Calibration plate strike logged. Form P… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[18]`: impact — mutter — {"district": "riverside"} — Riverside. Low-rise streets. Hit logged. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 1 \| Riverside \| Lantern monument on a plaza \| Low-rise, blocks ≤ 112 \| 0 \| 1 \| 3.0 s, 20% vans \| Puddles 2%, jerseys 6% \| |
| `lines[18]`: impact — mutter — {"district": "riverside"} — Riverside. Low-rise streets. Hit logged. | `LOG#P3-update-five-city-districts-o3-40-o3-44` | Riverside Old Market Interchange Central Business District … | ## P3 update — five city districts (O3.40–O3.44) |
| `lines[19]`: impact — mutter — {"district": "market"} — Old Market. Tight streets. Hit logged. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `lines[19]`: impact — mutter — {"district": "market"} — Old Market. Tight streets. Hit logged. | `LOG#P3-update-five-city-districts-o3-40-o3-44` | Riverside Old Market Interchange Central Business District … | - **Run:** Riverside → Old Market → Interchange → CBD → FARSIGHT Campus. |
| `lines[20]`: impact — mutter — {"district": "interchange"} — Interchange. Roundabout district. Hit log… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 3 \| Interchange \| Roundabout; crash-matting island \| Mid-rise, 15% towers \| 2, stacked \| 2 \| 2.8 s, 30% vans \| Puddles 2%, jerseys 10% \| |
| `lines[20]`: impact — mutter — {"district": "interchange"} — Interchange. Roundabout district. Hit log… | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Matting** (`world.terrain.matting.*`): the roundabout island. |
| `lines[21]`: impact — mutter — {"district": "cbd"} — Central Business District. Hit logged. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 4 \| Central Business District \| FARSIGHT Tower on a plaza \| Towers on 50% of large lots \| 1 \| 3 \| 2.6 s, 30% vans \| Puddles 2%, jerseys 8% \| |
| `lines[21]`: impact — mutter — {"district": "cbd"} — Central Business District. Hit logged. | `EDIT44#decisions` | drop off a ledge or broken parapet lands on the nearest lev… | \| 167 \| Interchange and CBD run one flyover each at Z2. |
| `lines[22]`: impact — mutter — {"district": "campus"} — FARSIGHT Campus. Test centre. Hit logged. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[22]`: impact — mutter — {"district": "campus"} — FARSIGHT Campus. Test centre. Hit logged. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[23]`: impact — thought — {"district": "campus", "tier": "01"} — The Campus. Everything here is … | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[23]`: impact — thought — {"district": "campus", "tier": "01"} — The Campus. Everything here is … | `FLEET#F6` | models in the P3 city S01 V02 Ambassador Waybill chauffeurs… | A line bound to any other model, tier or class never fires. |
| `lines[24]`: impact — speech — {"district": "market", "tier": "02", "model": "VAN-02-001"} — Old Marke… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `lines[24]`: impact — speech — {"district": "market", "tier": "02", "model": "VAN-02-001"} — Old Marke… | `FLEET#F6` | models in the P3 city S01 V02 Ambassador Waybill chauffeurs… | \| VAN-02-001 \| V02 \| Porter Office \| Waybill \| 02 \| van \| Parcel route 44, two hundred drops a day \| calm \| |
| `lines[25]`: writeoff — speech — {"drop": true, "tier": "01"} — Written off from above. Unthinkable. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[25]`: writeoff — speech — {"drop": true, "tier": "01"} — Written off from above. Unthinkable. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "01"} \| speech \| 3 \| A write-off. |
| `lines[26]`: writeoff — speech — {"drop": true, "tier": "02"} — Drop write-off recorded. Closing ticke… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[26]`: writeoff — speech — {"drop": true, "tier": "02"} — Drop write-off recorded. Closing ticke… | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[27]`: writeoff — speech — {"drop": true} — Written off by a drop. Logged. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[27]`: writeoff — speech — {"drop": true} — Written off by a drop. Logged. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[28]`: writeoff — speech — {"dropFrom": "roof"} — Written off by a roof drop. Logged. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[28]`: writeoff — speech — {"dropFrom": "roof"} — Written off by a roof drop. Logged. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[29]`: writeoff — speech — {"deck": true} — Written off on the highway deck. Logged. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[29]`: writeoff — speech — {"deck": true} — Written off on the highway deck. Logged. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[30]`: writeoff — shout — {"deck": true, "tier": "01"} — Written off up here. Preposterous! | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[30]`: writeoff — shout — {"deck": true, "tier": "01"} — Written off up here. Preposterous! | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "01"} \| speech \| 3 \| A write-off. |
| `lines[31]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. Logged. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[31]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. Logged. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[32]`: writeoff — speech — {"plate": true, "tier": "01"} — Written off on a plate. Tell no one. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[32]`: writeoff — speech — {"plate": true, "tier": "01"} — Written off on a plate. Tell no one. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "01"} \| speech \| 3 \| A write-off. |

## 3. Consistency loop

### Round 0

- Validator: 4 issue(s).
- Critic verdict: **revise**. The set mostly sounds like DUMMIES: Luxury lines are polished and dry, and Corporate lines file forms. Two Riverside and Old Market lines assert a hit count the simulation did not log, and one Luxury line insults the dummy.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | data/fix | `lines` | EDIT39#6.6: Style 'shout' is unused. | [{"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority":… | [{"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority":… |
| V2 | truth/block | `lines[10]` | EDIT39#6.6.1: claims 'highway' but its conditions do not guarantee it — "Dropped fr… | {"id": "c011", "event": "impact", "when": {"dropZ": 1}, "style": "speech", "priority": 2, "text": "Dropped fr… | {"id": "c011", "event": "impact", "when": {"dropZ": 1, "dropFrom": "deck"}, "style": "speech", "priority": 2,… |
| V3 | truth/block | `lines[23]` | EDIT39#6.6.1: text asserts 'class:bus' without that claim — "The Campus. My passeng… | {"id": "c024", "event": "impact", "when": {"district": "campus", "tier": "01"}, "style": "thought", "priority… | {"id": "c024", "event": "impact", "when": {"district": "campus", "tier": "01"}, "style": "thought", "priority… |
| V4 | truth/block | `lines[24]` | EDIT39#6.6.1: text asserts 'model:VAN-02-001' without that claim — "Old Market, rou… | {"id": "c025", "event": "impact", "when": {"district": "market", "tier": "02"}, "style": "speech", "priority"… | {"id": "c025", "event": "impact", "when": {"district": "market", "tier": "02", "model": "VAN-02-001"}, "style… |
| C1 | truth/block | `lines[18].text` | EDIT39#3.1: A line may only say what game state guarantees. Nothing logs that thi… | Riverside. Low-rise streets. One hit logged. | Riverside. Low-rise streets. Hit logged. |
| C2 | truth/block | `lines[19].text` | EDIT39#3.1: A line may only say what game state guarantees. Nothing logs that thi… | Old Market. Tight streets. One hit logged. | Old Market. Tight streets. Hit logged. |
| C3 | tone/fix | `lines[4].text` | BRIEF: Game data: Any car never mocks the dummy. Luxury complains about the indignity, … | The highway parapet. Bold, if vulgar. | The highway parapet. Not on my itinerary. |

Leaf changes this round: 9.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The bank sounds like DUMMIES. The lines are dry, they come from a worker's log and paintwork, and the situation lines only claim what the simulation logs. One line breaks tier temperament: a Luxury car shouts.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | tone/fix | `lines[30].style` | FLEET#F4: Luxury is confident and polished and never raises its voice. Shout is… | shout | speech |

Leaf changes this round: 1.

### Round 2

- Validator: 1 issue(s).
- Critic verdict: **revise**. The bank sounds like DUMMIES. The Luxury lines are polished and superior, the Corporate lines speak in forms and logs, and the tier-free lines are calm, with no shouts, no player mentions and no invented consequences. One district line promises features that a screen in its district doesn't always have.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | data/fix | `lines` | EDIT39#6.6: Style 'shout' is unused. | [{"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority":… | [{"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority":… |
| C1 | truth/block | `lines[21].text` | EDIT39#3.1: Lore follows state: a line may only say what the state guarantees. Ge… | Business district. Towers, barriers, a hit. | Central Business District. Hit logged. |

Leaf changes this round: 3.

### Round 3

- Validator: 0 issue(s).
- Critic verdict: **revise**. The bank sounds like DUMMIES: Luxury lines are dry and superior, Corporate lines are forms and logs, and the tier-free lines are calm. Each line is true to its conditions and fits the 48-character limit. One issue is left: a SETTLED fix was not applied to c031, which still has the shout style.

Open issues (no repair round left):

- C1 [tone/fix] `lines[30].style`: shout — Luxury (tier 01) is polished and faintly amused, so it speaks, it does not shout. Shout style is for the angry Budget tier. An earlier round settled this fix (lines[30].style: shout -> speech), but the content still has shout.

