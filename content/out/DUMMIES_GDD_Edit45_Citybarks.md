# DUMMIES — GDD Edit 45: Generated Citybarks

**Generated · 2026-10-21 · run `20261021-024324` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `content/db/fleet.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## City lines (merged into content/db/fleet.json)

| Id | Event | When | Style | Priority | Line | Claims | Sources |
|---|---|---|---|---:|---|---|---|
| c001 | `impact` | {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} | speech | 2 | A roof? I was not briefed on roofs. | drop, dropFrom:roof, dropZ:2 | EDIT44#5.2, LOG#P3.3, FLEET#F4 |
| c002 | `impact` | {"tier": "02", "drop": true, "dropFrom": "roof", "dropZ": 2} | speech | 2 | Incident filed: load received from a roof. | drop, dropFrom:roof, dropZ:2 | EDIT44#5.2, FLEET#F4 |
| c003 | `impact` | {"drop": true, "dropFrom": "roof", "dropZ": 2} | mutter | 2 | Roofs are not on my route. | drop, dropFrom:roof, dropZ:2 | EDIT44#5.2, LOG#P3.3, EDIT26#3.2 |
| c004 | `impact` | {"tier": "01", "drop": true, "dropFrom": "roof", "dropZ": 2} | speech | 2 | Landed on from a roof. My paintwork objects. | drop, dropFrom:roof, dropZ:2 | EDIT44#5.2, FLEET#F4 |
| c005 | `impact` | {"drop": true, "dropFrom": "deck", "dropZ": 2} | speech | 2 | That came off the high highway. | drop, dropFrom:deck, dropZ:2, highway | EDIT44#5.2, EDIT44#4.2, LOG#P3.3 |
| c006 | `impact` | {"tier": "02", "drop": true, "dropFrom": "deck"} | speech | 2 | Form 9: load received from a parapet. | drop, dropFrom:deck, highway | EDIT44#5.2, FLEET#F4 |
| c007 | `impact` | {"tier": "01", "drop": true, "dropFrom": "deck", "dropZ": 1} | speech | 2 | From the low highway? Quite unseemly. | drop, dropFrom:deck, dropZ:1, highway | EDIT44#5.2, EDIT44#4.2, FLEET#F4 |
| c008 | `impact` | {"drop": true, "dropZ": 2} | mutter | 2 | That fell a long way to reach me. | drop, dropZ:2 | EDIT44#8.3, EDIT44#5.2 |
| c009 | `impact` | {"tier": "02", "drop": true, "dropFrom": "deck", "dropZ": 1} | speech | 2 | Policy 12 excludes loads from parapets. | drop, dropFrom:deck, dropZ:1, highway | EDIT44#5.2, FLEET#F4 |
| c010 | `impact` | {"deck": true} | speech | 2 | Nobody walks the highway. Nobody. | deck, highway | EDIT42#6.3, EDIT44#6.2 |
| c011 | `impact` | {"tier": "01", "deck": true} | speech | 2 | Struck on the highway. How undignified. | deck, highway | EDIT42#6.3, EDIT44#6.2, FLEET#F4 |
| c012 | `impact` | {"tier": "02", "deck": true} | speech | 2 | Highway strike filed under policy 9. | deck, highway | EDIT44#6.2, FLEET#F4 |
| c013 | `impact` | {"plate": true} | mutter | 2 | Hit on a plate. Calibrated, naturally. | plate | EDIT41#7.3, EDIT41#7.2 |
| c014 | `impact` | {"tier": "01", "plate": true} | speech | 2 | Struck on a calibration plate. Vulgar. | plate | EDIT41#7.3, FLEET#F4 |
| c015 | `impact` | {"tier": "02", "plate": true} | speech | 2 | Plate hit filed against calibration form 3. | plate | EDIT41#7.3, FLEET#F4 |
| c016 | `writeoff` | {"tier": "01", "drop": true} | speech | 3 | Written off from above. Unthinkable. | drop | EDIT44#5.2, FLEET#F9.2 |
| c017 | `writeoff` | {"tier": "02", "drop": true} | speech | 3 | Write-off filed. Cause: load from above. | drop | EDIT44#5.2, FLEET#F9.2 |
| c018 | `writeoff` | {"deck": true} | speech | 3 | Written off on the highway. On my record. | deck, highway | EDIT44#6.2, FLEET#F9.2 |
| c019 | `writeoff` | {"plate": true} | speech | 3 | Written off on a calibration plate. | plate | EDIT41#7.3, FLEET#F9.2 |
| c020 | `impact` | {"district": "riverside"} | mutter | 2 | Riverside route. Nobody mentioned this. | district:riverside | EDIT41#7.2 |
| c021 | `impact` | {"district": "market"} | mutter | 2 | Old Market. Not on any itinerary. | district:market | EDIT41#7.2 |
| c022 | `impact` | {"district": "interchange"} | mutter | 2 | Interchange. Two flyovers and now this. | district:interchange | EDIT41#7.2, EDIT44#decisions |
| c023 | `impact` | {"district": "cbd"} | mutter | 2 | Business district. Of all places. | district:cbd | EDIT41#7.2 |
| c024 | `impact` | {"district": "campus"} | mutter | 2 | FARSIGHT Campus. Test centre. How apt. | district:campus | EDIT41#7.2, EDIT41#7.3 |
