# DUMMIES — GDD Edit 47: Generated Drops

**Generated · 2026-10-21 · run `20261021-015337` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p3/content/drops.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.drops.step.streakCountMin` | 2 | count | Fall streaks from a Z1 step-off. |
| `proto.drops.step.streakCountMax` | 5 | count | Fall streaks from a full-height Z2 step-off. |
| `proto.drops.step.streakLenMin` | 24 | world units | Streak length for the shortest fall. |
| `proto.drops.step.streakLenMax` | 70 | world units | Streak length at full height. |
| `proto.drops.step.streakSeconds` | 0.3 | s | Streak life during the fall. |
| `proto.drops.step.fallSecondsFull` | 0.47 | s | Fall time from Z2 to the ground. Step-off juice lasts the whole fall. |
| `proto.drops.step.zoomMin` | 0.01 | ratio | Slight pull-in on a Z1 step-off. |
| `proto.drops.step.zoomMax` | 0.03 | ratio | Pull-in on a Z2 step-off. |
| `proto.drops.step.dustCountMin` | 2 | count | Ledge dust, short fall. |
| `proto.drops.step.dustCountMax` | 4 | count | Ledge dust, full height. |
| `proto.drops.step.whistleFromMin` | 500 | Hz | Fall tone start, Z1. |
| `proto.drops.step.whistleFromMax` | 900 | Hz | Fall tone start, Z2. |
| `proto.drops.step.whistleToMin` | 300 | Hz | Fall tone end, Z1. |
| `proto.drops.step.whistleToMax` | 120 | Hz | Fall tone end, Z2. A longer fall sinks lower. |
| `proto.drops.step.whistleGain` | 0.08 | gain | Quiet fall tone. Cues stay readable. |
| `proto.drops.land.shakeAmpMin` | 2 | canvas units | Open-ground landing shake, Z1. |
| `proto.drops.land.shakeAmpMax` | 8 | canvas units | Open-ground landing shake, Z2. |
| `proto.drops.land.shakeSecondsMin` | 0.15 | s | Landing shake length, Z1. |
| `proto.drops.land.shakeSecondsMax` | 0.3 | s | Landing shake length, Z2. |
| `proto.drops.land.zoomMin` | 0.01 | ratio | Landing kick, Z1. |
| `proto.drops.land.zoomMax` | 0.04 | ratio | Landing kick, Z2. |
| `proto.drops.land.zoomSeconds` | 0.15 | s | Landing kick length. |
| `proto.drops.land.crumpleMin` | 0.05 | ratio | Landing squash, Z1. |
| `proto.drops.land.crumpleMax` | 0.2 | ratio | Landing squash, Z2. |
| `proto.drops.land.crumpleSeconds` | 0.2 | s | Landing squash length. |
| `proto.drops.land.stumbleMin` | 0.15 | rad | Stumble after a Z1 landing. |
| `proto.drops.land.stumbleMax` | 0.4 | rad | Stumble after a Z2 landing. |
| `proto.drops.land.ringRadiusMin` | 16 | world units | Floor shockwave radius, Z1. |
| `proto.drops.land.ringRadiusMax` | 44 | world units | Floor shockwave radius, Z2. |
| `proto.drops.land.ringSeconds` | 0.3 | s | Shockwave life. |
| `proto.drops.land.dustCountMin` | 4 | count | Landing dust, Z1. |
| `proto.drops.land.dustCountMax` | 14 | count | Landing dust, Z2. |
| `proto.drops.land.dustSpeedMin` | 50 | world units/s | Dust speed, Z1. |
| `proto.drops.land.dustSpeedMax` | 140 | world units/s | Dust speed, Z2. |
| `proto.drops.land.dustLifeMin` | 0.4 | s | Dust life, Z1. |
| `proto.drops.land.dustLifeMax` | 0.7 | s | Dust life, Z2. |
| `proto.drops.land.thudFromSmall` | 260 | Hz | Landing thud start, Z1. |
| `proto.drops.land.thudFromFull` | 160 | Hz | Landing thud start, Z2. Deeper for more height. |
| `proto.drops.land.thudToSmall` | 80 | Hz | Landing thud end, Z1. |
| `proto.drops.land.thudToFull` | 45 | Hz | Landing thud end, Z2. |
| `proto.drops.land.thudSecondsSmall` | 0.18 | s | Thud length, Z1. |
| `proto.drops.land.thudSecondsFull` | 0.3 | s | Thud length, Z2. |
| `proto.drops.land.thudGainSmall` | 0.1 | gain | Thud gain, Z1. |
| `proto.drops.land.thudGainFull` | 0.2 | gain | Thud gain, Z2. |
| `proto.drops.hit.shakeAmp` | 8 | canvas units | Hit-from-above shake. Heavier than a side hit. |
| `proto.drops.hit.shakeSeconds` | 0.3 | s | Hit-from-above shake length. |
| `proto.drops.hit.zoom` | 0.05 | ratio | Downward press on a car hit. |
| `proto.drops.hit.zoomSeconds` | 0.18 | s | Press length. |
| `proto.drops.hit.crumple` | 0.3 | ratio | Legs take it: deeper squash than a strike. |
| `proto.drops.hit.crumpleSeconds` | 0.25 | s | Squash length. |
| `proto.drops.hit.dustCount` | 8 | count | Dust thrown off the car roof. |
| `proto.drops.hit.dustSpeed` | 110 | world units/s | Roof dust speed. |
| `proto.drops.hit.dustLife` | 0.5 | s | Roof dust life. |
| `proto.drops.hit.boomFrom` | 320 | Hz | Roof boom start. |
| `proto.drops.hit.boomTo` | 50 | Hz | Roof boom end. |
| `proto.drops.hit.boomSeconds` | 0.25 | s | Roof boom length. |
| `proto.drops.hit.boomGain` | 0.2 | gain | Roof boom gain. |
| `proto.drops.z2.shakeAmp` | 11 | canvas units | Z2 hit shake. Stopped sedan 136 against 76. |
| `proto.drops.z2.shakeSeconds` | 0.4 | s | Z2 shake length. |
| `proto.drops.z2.zoom` | 0.07 | ratio | Z2 press. |
| `proto.drops.z2.zoomSeconds` | 0.25 | s | Z2 press length. |
| `proto.drops.z2.crumple` | 0.34 | ratio | Z2 squash, under the head-on cap. |
| `proto.drops.z2.crumpleSeconds` | 0.3 | s | Z2 squash length. |
| `proto.drops.z2.ringRadius` | 40 | world units | Z2 contact ring. |
| `proto.drops.z2.ringSeconds` | 0.35 | s | Z2 ring life. |
| `proto.drops.z2.ringWidth` | 3 | px | Z2 ring line width. |
| `proto.drops.z2.debrisCount` | 8 | count | Debris from a Z2 hit. |
| `proto.drops.z2.debrisSpeed` | 180 | world units/s | Z2 debris speed. |
| `proto.drops.z2.debrisLife` | 0.6 | s | Z2 debris life. |
| `proto.drops.z2.boomFrom` | 200 | Hz | Z2 low boom start. |
| `proto.drops.z2.boomTo` | 40 | Hz | Z2 low boom end. |
| `proto.drops.z2.boomSeconds` | 0.35 | s | Z2 boom length. |
| `proto.drops.z2.boomGain` | 0.24 | gain | Z2 boom gain, under the clamp. |
| `proto.drops.writeoff.shakeAmp` | 13 | canvas units | Write-off from a drop shakes harder. |
| `proto.drops.writeoff.shakeSeconds` | 0.6 | s | Write-off shake length. |
| `proto.drops.writeoff.smokeCount` | 6 | count | Smoke from the crushed roof. |
| `proto.drops.writeoff.smokeSpeed` | 30 | world units/s | Smoke drift speed. |
| `proto.drops.writeoff.debrisCount` | 6 | count | Roof panels thrown clear. |
| `proto.drops.writeoff.debrisSpeed` | 120 | world units/s | Panel speed. |
| `proto.drops.writeoff.crushFrom` | 180 | Hz | Crush tone start. |
| `proto.drops.writeoff.crushTo` | 40 | Hz | Crush tone end. |
| `proto.drops.writeoff.crushSeconds` | 0.5 | s | Crush tone length. |
| `proto.drops.writeoff.crushGain` | 0.2 | gain | Crush tone gain. |

## Layers (stacked on hits.json)

| Event | When | Response | Reference | Sources |
|---|---|---|---|---|
| `deck-drop` | {} | zoom, streaks, dust at dummy, tone sound, scaled by h / `world.highHeight` | Juice It or Lose It: sound on every action, speed lines | EDIT44#5.2, EDIT44#4.1, JUICE#J2, EDIT26#5.5 |
| `land` | {"car": null} | shake, zoom, crumple, stumble, ring, dust at dummy, tone sound, scaled by h / `world.highHeight` | Art of Screenshake: shake scaled to impact, plus dust plumes | EDIT44#5.2, EDIT44#4.1, JUICE#J2, JUICE#J1 |
| `impact` | {"drop": true} | shake, zoom, crumple, dust at car, tone sound | Art of Screenshake: camera kick and impact effects, downward | EDIT44#8.3, EDIT42#8.3, JUICE#J2 |
| `impact` | {"dropZ": 2} | shake, zoom, flash, crumple, ring, debris at contact, tone sound | Art of Screenshake: bigger hit, bigger shake, debris | EDIT44#8.3, EDIT44#5.2, JUICE#J2 |
| `writeoff` | {"drop": true} | shake, smoke at car, debris at car, tone sound | Wreck permanence and heavy shake: a crushed roof | JUICE#J3, EDIT44#8.3, JUICE#J1 |
