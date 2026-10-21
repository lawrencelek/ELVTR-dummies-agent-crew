# Trace — citybarks

Status: **accepted** after 3 critic round(s).

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
| `lines[0]`: impact — speech — {"dropFrom": "roof", "tier": "01"} — A roof? I was not briefed on roofs. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[0]`: impact — speech — {"dropFrom": "roof", "tier": "01"} — A roof? I was not briefed on roofs. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[1]`: impact — speech — {"dropFrom": "roof", "tier": "02"} — Incident filed: load received from… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[1]`: impact — speech — {"dropFrom": "roof", "tier": "02"} — Incident filed: load received from… | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[2]`: impact — shout — {"dropFrom": "roof"} — Something landed on me from a rooftop! | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[2]`: impact — shout — {"dropFrom": "roof"} — Something landed on me from a rooftop! | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | ## P3.3 — Z levels: low highway, high highway, platform roofs, skybridges (O3.57) |
| `lines[3]`: impact — thought — {"dropFrom": "roof", "tier": "01"} — Falling from rooftops. How very c… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Raised floors:** decks, roofs and skybridges. |
| `lines[3]`: impact — thought — {"dropFrom": "roof", "tier": "01"} — Falling from rooftops. How very c… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[4]`: impact — speech — {"dropFrom": "deck", "tier": "01"} — Dropped from a flyover. Frightfull… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[4]`: impact — speech — {"dropFrom": "deck", "tier": "01"} — Dropped from a flyover. Frightfull… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[5]`: impact — speech — {"dropFrom": "deck", "tier": "02"} — Highway drop logged. Ticket opened. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - A link stair: entered from its deck's shoulder. |
| `lines[5]`: impact — speech — {"dropFrom": "deck", "tier": "02"} — Highway drop logged. Ticket opened. | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[6]`: impact — speech — {"dropZ": 2, "tier": "01"} — From that height? Preposterous. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[6]`: impact — speech — {"dropZ": 2, "tier": "01"} — From that height? Preposterous. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | ## 5.2 Movement (Edit 42 rules replaced) |
| `lines[7]`: impact — speech — {"dropZ": 2, "tier": "02"} — Fall height logged. Damage claim drafted. | `EDIT44#8.3` | landing on a car closing speed hit from above legs take it … | ## 8.3 Damage (Edit 42 rule changed) |
| `lines[7]`: impact — speech — {"dropZ": 2, "tier": "02"} — Fall height logged. Damage claim drafted. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - Fall time: `world.dropSeconds` × √(h / `world.deckHeight`). |
| `lines[8]`: impact — speech — {"deck": true, "tier": "01"} — On the highway? Do mind the paintwork. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[8]`: impact — speech — {"deck": true, "tier": "01"} — On the highway? Do mind the paintwork. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[9]`: impact — speech — {"deck": true, "tier": "02"} — Deck contact logged. Highway delay noted. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[9]`: impact — speech — {"deck": true, "tier": "02"} — Deck contact logged. Highway delay noted. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[10]`: impact — mutter — {"deck": true} — Nobody walks the highway. Nobody. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[10]`: impact — mutter — {"deck": true} — Nobody walks the highway. Nobody. | `EDIT42#6.3` | deck traffic full drivers on their deck level cars sense th… | - Ground cars never sense a dummy on a deck, a stair, in a passage or in the air. |
| `lines[11]`: impact — speech — {"plate": true, "tier": "01"} — A calibration plate. How very technical. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[11]`: impact — speech — {"plate": true, "tier": "01"} — A calibration plate. How very technical. | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[12]`: impact — speech — {"plate": true, "tier": "02"} — Plate strike logged. Calibration varian… | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[12]`: impact — speech — {"plate": true, "tier": "02"} — Plate strike logged. Calibration varian… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[13]`: impact — mutter — {"plate": true} — That plate was not on my route sheet. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[13]`: impact — mutter — {"plate": true} — That plate was not on my route sheet. | `EDIT26#3.2` | vehicles speak as workers corporate politeness barely conta… | ### 3.2 Voice and register |
| `lines[14]`: writeoff — speech — {"drop": true, "tier": "01"} — Written off from above. Unthinkable. | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[14]`: writeoff — speech — {"drop": true, "tier": "01"} — Written off from above. Unthinkable. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "01"} \| speech \| 3 \| A write-off. |
| `lines[15]`: writeoff — speech — {"drop": true, "tier": "02"} — Write-off {writeOffs} from above. Form… | `EDIT44#5.2` | drop off a ledge or broken parapet lands on the nearest lev… | - **Drop:** off a ledge or through a broken parapet. |
| `lines[15]`: writeoff — speech — {"drop": true, "tier": "02"} — Write-off {writeOffs} from above. Form… | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[16]`: writeoff — speech — {"deck": true} — Written off on the highway. Logged. | `EDIT44#6.2` | deck traffic full drivers on their deck level cars sense th… | - **Deck traffic:** full drivers on their deck's level (Z1 or Z2). |
| `lines[16]`: writeoff — speech — {"deck": true} — Written off on the highway. Logged. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[17]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. Noted. | `EDIT41#7.3` | calibrated impact plates on the road points multiplier FARS… | - **Plate** (`world.terrain.plate.*`): Campus road plates. |
| `lines[17]`: writeoff — speech — {"plate": true} — Written off on a calibration plate. Noted. | `FLEET#F9.2` | existing lines impact write-off fleet bark bank style prior… | \| {"tier": "02"} \| speech \| 3 \| Write-off {writeOffs} recorded. |
| `lines[18]`: impact — speech — {"district": "riverside", "tier": "01"} — Riverside. I expected better … | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | A run is five city districts, in order. |
| `lines[18]`: impact — speech — {"district": "riverside", "tier": "01"} — Riverside. I expected better … | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[19]`: impact — speech — {"district": "riverside", "tier": "02"} — Riverside variance logged. Ti… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | A run is five city districts, in order. |
| `lines[19]`: impact — speech — {"district": "riverside", "tier": "02"} — Riverside variance logged. Ti… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[20]`: impact — mutter — {"district": "market", "tier": "02", "model": "VAN-02-001"} — Old Marke… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 2 \| Old Market \| Fountain square \| Dense low-rise, blocks ≤ 96 \| 0 \| 2 \| 3.0 s, 45% vans \| Puddles 4%, jerseys 5% \| |
| `lines[20]`: impact — mutter — {"district": "market", "tier": "02", "model": "VAN-02-001"} — Old Marke… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |
| `lines[21]`: impact — mutter — {"district": "interchange"} — Interchange. Everything merges eventually. | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | A run is five city districts, in order. |
| `lines[21]`: impact — mutter — {"district": "interchange"} — Interchange. Everything merges eventually. | `LOG#P3.3` | Z0 ground Z1 low highway Z2 high highway platform roofs sky… | - **High highway:** Interchange and CBD run one flyover each at Z2. |
| `lines[22]`: impact — speech — {"district": "cbd", "tier": "01"} — The CBD. Board members will hear of… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | A run is five city districts, in order. |
| `lines[22]`: impact — speech — {"district": "cbd", "tier": "01"} — The CBD. Board members will hear of… | `FLEET#F6` | models in the P3 city S01 V02 Ambassador Waybill chauffeurs… | \| SED-01-001 \| S01 \| Meridian Imperial \| Ambassador \| 01 \| sedan \| Chauffeurs FARSIGHT board members \| confident \| |
| `lines[23]`: impact — speech — {"district": "campus", "tier": "02"} — Campus incident. FARSIGHT will w… | `EDIT41#7.2` | Riverside Old Market Interchange Central Business District … | \| 5 \| FARSIGHT Campus \| Calibrated impact plates on the road \| Campus halls \| 1 \| 4 \| 2.5 s, 40% vans \| Puddles 1%, jerseys 8% \| |
| `lines[23]`: impact — speech — {"district": "campus", "tier": "02"} — Campus incident. FARSIGHT will w… | `FLEET#F4` | tier temperament voice Luxury Corporate polished superior p… | ## F4 Tiers and temperament |

## 3. Consistency loop

### Round 0

- Validator: 12 issue(s).
- Critic verdict: **revise**. The bank mostly sounds like DUMMIES. Luxury is superior and never apologises, Corporate files tickets, and every line is within 48 characters and ends in punctuation. Two lines need to change: c017 puts a Luxury sniff in a line the Corporate van also speaks, and c021 claims congestion that the simulation never logged.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | truth/block | `lines[0]` | EDIT39#6.6.1: claims 'dropZ:2' but its conditions do not guarantee it — "A roof? I … | {"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority": … | {"id": "c001", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "speech", "priority": … |
| V2 | truth/block | `lines[1]` | EDIT39#6.6.1: claims 'dropZ:2' but its conditions do not guarantee it — "Incident f… | {"id": "c002", "event": "impact", "when": {"dropFrom": "roof", "tier": "02"}, "style": "speech", "priority": … | {"id": "c002", "event": "impact", "when": {"dropFrom": "roof", "tier": "02"}, "style": "speech", "priority": … |
| V3 | truth/block | `lines[2]` | EDIT39#6.6.1: claims 'dropZ:2' but its conditions do not guarantee it — "Something … | {"id": "c003", "event": "impact", "when": {"dropFrom": "roof"}, "style": "shout", "priority": 2, "text": "Som… | {"id": "c003", "event": "impact", "when": {"dropFrom": "roof"}, "style": "shout", "priority": 2, "text": "Som… |
| V4 | truth/block | `lines[3]` | EDIT39#6.6.1: claims 'dropZ:2' but its conditions do not guarantee it — "Falling fr… | {"id": "c004", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "thought", "priority":… | {"id": "c004", "event": "impact", "when": {"dropFrom": "roof", "tier": "01"}, "style": "thought", "priority":… |
| V5 | truth/block | `lines[8]` | EDIT39#6.6.1: unknown claim 'deck' | {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style": "speech", "priority": 2, "te… | {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style": "speech", "priority": 2, "te… |
| V6 | truth/block | `lines[8]` | EDIT39#6.6.1: claims 'deck' but its conditions do not guarantee it — "On the highwa… | {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style": "speech", "priority": 2, "te… | {"id": "c009", "event": "impact", "when": {"deck": true, "tier": "01"}, "style": "speech", "priority": 2, "te… |
| V7 | truth/block | `lines[9]` | EDIT39#6.6.1: unknown claim 'deck' | {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style": "speech", "priority": 2, "te… | {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style": "speech", "priority": 2, "te… |
| V8 | truth/block | `lines[9]` | EDIT39#6.6.1: claims 'deck' but its conditions do not guarantee it — "Deck contact … | {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style": "speech", "priority": 2, "te… | {"id": "c010", "event": "impact", "when": {"deck": true, "tier": "02"}, "style": "speech", "priority": 2, "te… |
| V9 | truth/block | `lines[10]` | EDIT39#6.6.1: unknown claim 'deck' | {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "priority": 2, "text": "Nobody w… | {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "priority": 2, "text": "Nobody w… |
| V10 | truth/block | `lines[10]` | EDIT39#6.6.1: claims 'deck' but its conditions do not guarantee it — "Nobody walks … | {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "priority": 2, "text": "Nobody w… | {"id": "c011", "event": "impact", "when": {"deck": true}, "style": "mutter", "priority": 2, "text": "Nobody w… |
| V11 | truth/block | `lines[16]` | EDIT39#6.6.1: unknown claim 'deck' | {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", "priority": 3, "text": "Writte… | {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", "priority": 3, "text": "Writte… |
| V12 | truth/block | `lines[16]` | EDIT39#6.6.1: claims 'deck' but its conditions do not guarantee it — "Written off o… | {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", "priority": 3, "text": "Writte… | {"id": "c017", "event": "writeoff", "when": {"deck": true}, "style": "speech", "priority": 3, "text": "Writte… |
| C1 | tone/fix | `lines[16].text` | FLEET#F4: A line with no tier condition also fires for the calm, procedural Cor… | Written off on the highway. Of all places. | Written off on the highway. Logged. |
| C2 | truth/block | `lines[20].text` | EDIT39#3.1: A line may only say what the game state guarantees. The district fiel… | Old Market congestion code 7. Now this too. | Old Market incident logged. Route 44 noted. |

Leaf changes this round: 10.

### Round 1

- Validator: 1 issue(s).
- Critic verdict: **pass**. The lines sound like DUMMIES. The Luxury car is superior and never apologises, the Corporate van files and logs, and nothing cheers, mocks the dummy or names the player. No line asserts an event the simulation did not log. Each situation line fits its district, and every line is within 48 characters.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | truth/block | `lines[20]` | EDIT39#6.6.1: text asserts 'model:VAN-02-001' without that claim — "Old Market inci… | {"id": "c021", "event": "impact", "when": {"district": "market", "tier": "02"}, "style": "mutter", "priority"… | {"id": "c021", "event": "impact", "when": {"district": "market", "tier": "02", "model": "VAN-02-001"}, "style… |

Leaf changes this round: 3.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The bank mostly sounds like DUMMIES: Luxury is superior, Corporate files tickets, and the claims match the fields each line tests. Two lines have no tier, so they fire for both models. One of them shouts, which neither temperament does. The other is a generic aphorism, not a worker's line.

Open issues (no repair round left):

- C1 [tone/fix] `lines[2].style`: shout — Only Budget (tier 04, angry) shouts. This line has no tier, so it fires for confident Luxury and calm Corporate cars. Use the plain speech style.
- C2 [tone/fix] `lines[2].text`: Something landed on me from a rooftop! — A line that fires for both Luxury and Corporate must stay calm. An exclamation is out of temperament for both.
- C3 [tone/fix] `lines[21].text`: Interchange. Everything merges eventually. — Cars speak as workers about deadlines, rank and retraining. A generic aphorism is not a worker's line.

