# DUMMIES — GDD Edit 35: Generated Hits

**Generated · 2026-10-15 · run `20261015-085446` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p2/content/hits.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.hits.reducedMotion` | 0.25 | ratio | Scale on shake, zoom, crumple and stumble under reduced-motion settings. |
| `proto.hits.impact.shakeAmpMin` | 1.5 | canvas units | Base shake for the lightest scored hit. |
| `proto.hits.impact.shakeAmpMax` | 7 | canvas units | Base shake for a full-damage hit. |
| `proto.hits.impact.shakeSeconds` | 0.22 | s | Base shake duration. |
| `proto.hits.impact.flashSeconds` | 0.05 | s | White contact flash on a scored hit. |
| `proto.hits.impact.crumpleMin` | 0.08 | ratio | Dummy squash on a light hit. |
| `proto.hits.impact.crumpleMax` | 0.28 | ratio | Dummy squash on a full-damage hit. |
| `proto.hits.impact.ringRadiusMin` | 14 | world units | Contact ring radius on a light hit; inside the 2 x body width burst cap. |
| `proto.hits.impact.ringRadiusMax` | 26 | world units | Contact ring radius cap, 2 x body.radius. |
| `proto.hits.impact.ringSeconds` | 0.25 | s | Contact ring expansion time. |
| `proto.hits.impact.ringWidth` | 2 | px | Contact ring line weight. |
| `proto.hits.impact.raysCount` | 8 | count | Impact burst ray count. |
| `proto.hits.impact.raysLenMin` | 12 | world units | Ray length on a light hit. |
| `proto.hits.impact.raysLenMax` | 26 | world units | Ray length cap within 2 x body width. |
| `proto.hits.impact.raysSeconds` | 0.2 | s | Ray burst lifetime. |
| `proto.hits.impact.popupSizeMin` | 14 | px | Assessed-number size on a light hit. |
| `proto.hits.impact.popupSizeMax` | 22 | px | Assessed-number size on a full hit. |
| `proto.hits.impact.popupRise` | 18 | px | Distance the number rises. |
| `proto.hits.impact.popupSeconds` | 0.7 | s | Number lifetime. |
| `proto.hits.impact.popupPop` | 1.4 | ratio | Overshoot scale as the number pops in. |
| `proto.hits.impact.sparkCountMin` | 6 | count | Sparks on a light hit. |
| `proto.hits.impact.sparkCountMax` | 14 | count | Sparks on a full hit. |
| `proto.hits.impact.sparkSpeedMin` | 120 | world units/s | Slowest spark speed. |
| `proto.hits.impact.sparkSpeedMax` | 260 | world units/s | Fastest spark speed. |
| `proto.hits.impact.sparkLife` | 0.3 | s | Spark lifetime. |
| `proto.hits.impact.sparkSize` | 2 | px | Spark size. |
| `proto.hits.impact.crunchFrom` | 2400 | Hz | Crunch filter start. |
| `proto.hits.impact.crunchTo` | 300 | Hz | Crunch filter end. |
| `proto.hits.impact.crunchSeconds` | 0.18 | s | Crunch length. |
| `proto.hits.impact.crunchGain` | 0.18 | gain | Crunch loudness, under the 0.25 clamp. |
| `proto.hits.headOn.shakeAmpMin` | 2.5 | canvas units | Head-on shake, light. |
| `proto.hits.headOn.shakeAmpMax` | 9 | canvas units | Head-on shake, full. |
| `proto.hits.headOn.zoomMin` | 0.02 | ratio | Punch-in on a light head-on hit. |
| `proto.hits.headOn.zoomMax` | 0.05 | ratio | Punch-in on a full head-on hit. |
| `proto.hits.headOn.zoomSeconds` | 0.14 | s | Punch-in ease-back time. |
| `proto.hits.headOn.crumpleMin` | 0.14 | ratio | Deeper squash, light head-on. |
| `proto.hits.headOn.crumpleMax` | 0.36 | ratio | Deeper squash, full head-on. |
| `proto.hits.headOn.thumpFrom` | 900 | Hz | Low thump filter start. |
| `proto.hits.headOn.thumpTo` | 120 | Hz | Low thump filter end. |
| `proto.hits.headOn.thumpSeconds` | 0.22 | s | Low thump length. |
| `proto.hits.headOn.thumpGain` | 0.2 | gain | Low thump loudness. |
| `proto.hits.bait.raysCount` | 12 | count | Denser ray burst on a bait hit. |
| `proto.hits.bait.ringRadius` | 20 | world units | Second ring on a bait hit. |
| `proto.hits.bait.hornFrom` | 440 | Hz | Horn start pitch. |
| `proto.hits.bait.hornTo` | 400 | Hz | Horn end pitch. |
| `proto.hits.bait.hornSeconds` | 0.25 | s | Horn length. |
| `proto.hits.bait.hornGain` | 0.1 | gain | Horn loudness. |
| `proto.hits.lunging.shakeAmpMin` | 3 | canvas units | Shake when the dummy hits mid-lunge, light. |
| `proto.hits.lunging.shakeAmpMax` | 10 | canvas units | Shake when the dummy hits mid-lunge, full. |
| `proto.hits.lunging.zoomMin` | 0.03 | ratio | Lunge-hit punch-in, light. |
| `proto.hits.lunging.zoomMax` | 0.07 | ratio | Lunge-hit punch-in, full. |
| `proto.hits.lunging.debrisCountMin` | 3 | count | Dummy chips on a light lunge hit. |
| `proto.hits.lunging.debrisCountMax` | 8 | count | Dummy chips on a full lunge hit. |
| `proto.hits.lunging.debrisLife` | 0.5 | s | Chip lifetime. |
| `proto.hits.lunging.debrisSize` | 3 | px | Chip size. |
| `proto.hits.stopped.dustCount` | 5 | count | Dust puff when the car is stationary. |
| `proto.hits.stopped.dustSpeed` | 50 | world units/s | Dust drift speed. |
| `proto.hits.stopped.dustLife` | 0.5 | s | Dust lifetime. |
| `proto.hits.stopped.dustSize` | 4 | px | Dust size. |
| `proto.hits.stopped.thumpFrom` | 900 | Hz | Dull thump filter start. |
| `proto.hits.stopped.thumpTo` | 160 | Hz | Dull thump filter end. |
| `proto.hits.stopped.thumpSeconds` | 0.2 | s | Dull thump length. |
| `proto.hits.stopped.thumpGain` | 0.18 | gain | Dull thump loudness. |
| `proto.hits.big.assessedMin` | 200 | count | Assessed health points at which a hit counts as big damage. |
| `proto.hits.big.shakeAmpMin` | 5 | canvas units | Big-damage shake floor. |
| `proto.hits.big.shakeAmpMax` | 12 | canvas units | Big-damage shake ceiling. |
| `proto.hits.big.flashSeconds` | 0.1 | s | Longer white flash on big damage. |
| `proto.hits.big.zoom` | 0.06 | ratio | Big-damage punch-in. |
| `proto.hits.big.zoomSeconds` | 0.2 | s | Big-damage punch-in ease-back. |
| `proto.hits.big.smokeCount` | 5 | count | Smoke puffs on big damage. |
| `proto.hits.big.smokeSpeed` | 40 | world units/s | Smoke drift speed. |
| `proto.hits.big.smokeLife` | 0.7 | s | Smoke lifetime. |
| `proto.hits.big.smokeSize` | 5 | px | Smoke puff size. |
| `proto.hits.big.boomFrom` | 600 | Hz | Heavy crunch filter start. |
| `proto.hits.big.boomTo` | 60 | Hz | Heavy crunch filter end. |
| `proto.hits.big.boomSeconds` | 0.3 | s | Heavy crunch length. |
| `proto.hits.big.boomGain` | 0.22 | gain | Heavy crunch loudness. |
| `proto.hits.writeoff.shakeAmp` | 10 | canvas units | Heavy write-off shake. |
| `proto.hits.writeoff.shakeSeconds` | 0.5 | s | Write-off shake duration. |
| `proto.hits.writeoff.flashSeconds` | 0.12 | s | Field flash on write-off. |
| `proto.hits.writeoff.zoom` | 0.06 | ratio | Write-off punch-in. |
| `proto.hits.writeoff.zoomSeconds` | 0.3 | s | Write-off punch-in ease-back. |
| `proto.hits.writeoff.crumple` | 0.4 | ratio | Final squash of the body. |
| `proto.hits.writeoff.ringRadius` | 26 | world units | Write-off ring, 2 x body.radius. |
| `proto.hits.writeoff.ringSeconds` | 0.4 | s | Write-off ring time. |
| `proto.hits.writeoff.debrisCount` | 12 | count | Wreck debris pieces. |
| `proto.hits.writeoff.debrisSpeed` | 200 | world units/s | Debris speed. |
| `proto.hits.writeoff.debrisLife` | 0.9 | s | Debris lifetime. |
| `proto.hits.writeoff.debrisSize` | 3 | px | Debris size. |
| `proto.hits.writeoff.smokeCount` | 8 | count | Smoke puffs from the wreck. |
| `proto.hits.writeoff.smokeLife` | 1 | s | Smoke lifetime. |
| `proto.hits.writeoff.smokeSize` | 6 | px | Smoke puff size. |
| `proto.hits.writeoff.sparkCount` | 10 | count | Sparks on write-off. |
| `proto.hits.writeoff.crashFrom` | 2000 | Hz | Crash filter start. |
| `proto.hits.writeoff.crashTo` | 70 | Hz | Crash filter end. |
| `proto.hits.writeoff.crashSeconds` | 0.6 | s | Crash length. |
| `proto.hits.writeoff.crashGain` | 0.24 | gain | Crash loudness, under the 0.25 clamp. |
| `proto.hits.touchSpent.shakeAmp` | 1.2 | canvas units | Small kick on a spent car. |
| `proto.hits.touchSpent.shakeSeconds` | 0.1 | s | Kick duration. |
| `proto.hits.touchSpent.dustCount` | 3 | count | Dull dust puff, no burst. |
| `proto.hits.touchSpent.dustSpeed` | 40 | world units/s | Dust drift speed. |
| `proto.hits.touchSpent.dustLife` | 0.3 | s | Dust lifetime. |
| `proto.hits.touchSpent.dustSize` | 3 | px | Dust size. |
| `proto.hits.touchSpent.thudFrom` | 500 | Hz | Dull thud filter start. |
| `proto.hits.touchSpent.thudTo` | 140 | Hz | Dull thud filter end. |
| `proto.hits.touchSpent.thudSeconds` | 0.12 | s | Thud length. |
| `proto.hits.touchSpent.thudGain` | 0.12 | gain | Thud loudness. |
| `proto.hits.nearMiss.streakCountMin` | 2 | count | Speed lines on a slow pass. |
| `proto.hits.nearMiss.streakCountMax` | 5 | count | Speed lines on a fast pass. |
| `proto.hits.nearMiss.streakLenMin` | 14 | world units | Short speed line. |
| `proto.hits.nearMiss.streakLenMax` | 40 | world units | Long speed line. |
| `proto.hits.nearMiss.streakSeconds` | 0.25 | s | Speed line lifetime. |
| `proto.hits.nearMiss.whooshFrom` | 500 | Hz | Pass-by whoosh filter start. |
| `proto.hits.nearMiss.whooshTo` | 2200 | Hz | Pass-by whoosh filter end. |
| `proto.hits.nearMiss.whooshSeconds` | 0.25 | s | Whoosh length. |
| `proto.hits.nearMiss.whooshGain` | 0.1 | gain | Whoosh loudness. |
| `proto.hits.miss.stumbleAmp` | 0.4 | rad | Stumble wobble amplitude in radians. |
| `proto.hits.miss.streakCount` | 3 | count | Trailing speed lines on a miss. |
| `proto.hits.miss.streakLen` | 24 | world units | Speed line length. |
| `proto.hits.miss.streakSeconds` | 0.3 | s | Speed line lifetime. |
| `proto.hits.miss.dustCount` | 4 | count | Dust kicked up by the stumble. |
| `proto.hits.miss.dustSpeed` | 60 | world units/s | Dust speed. |
| `proto.hits.miss.dustLife` | 0.4 | s | Dust lifetime. |
| `proto.hits.miss.dustSize` | 3 | px | Dust size. |
| `proto.hits.miss.clatterFrom` | 3200 | Hz | Clatter filter start. |
| `proto.hits.miss.clatterTo` | 700 | Hz | Clatter filter end. |
| `proto.hits.miss.clatterSeconds` | 0.3 | s | Clatter length. |
| `proto.hits.miss.clatterGain` | 0.14 | gain | Clatter loudness. |
| `proto.hits.lunge.streakCountMin` | 2 | count | Speed lines on a worn short lunge. |
| `proto.hits.lunge.streakCountMax` | 6 | count | Speed lines on a full-reach lunge. |
| `proto.hits.lunge.streakLenMin` | 20 | world units | Short lunge streak. |
| `proto.hits.lunge.streakLenMax` | 60 | world units | Full-reach lunge streak. |
| `proto.hits.lunge.dustCountMin` | 2 | count | Dust puff behind a short lunge. |
| `proto.hits.lunge.dustCountMax` | 6 | count | Dust puff behind a full lunge. |
| `proto.hits.lunge.dustSpeed` | 90 | world units/s | Dust kicked backwards. |
| `proto.hits.lunge.dustLife` | 0.4 | s | Dust lifetime. |
| `proto.hits.lunge.dustSize` | 3 | px | Dust size. |
| `proto.hits.lunge.kickMin` | 0.6 | canvas units | Camera kick on a short lunge. |
| `proto.hits.lunge.kickMax` | 2 | canvas units | Camera kick on a full lunge. |
| `proto.hits.lunge.kickSeconds` | 0.1 | s | Camera kick duration. |
| `proto.hits.lunge.whooshFrom` | 300 | Hz | Lunge whoosh filter start. |
| `proto.hits.lunge.whooshTo` | 1800 | Hz | Lunge whoosh filter end. |
| `proto.hits.lunge.whooshGain` | 0.12 | gain | Lunge whoosh loudness. |
| `proto.hits.knock.dustCountMin` | 2 | count | Dust puff on a soft knock. |
| `proto.hits.knock.dustCountMax` | 4 | count | Dust puff on a hard knock. |
| `proto.hits.knock.dustSpeed` | 40 | world units/s | Dust speed. |
| `proto.hits.knock.dustLife` | 0.3 | s | Dust lifetime. |
| `proto.hits.knock.dustSize` | 3 | px | Dust size. |
| `proto.hits.knock.puffFrom` | 700 | Hz | Soft knock filter start. |
| `proto.hits.knock.puffTo` | 250 | Hz | Soft knock filter end. |
| `proto.hits.knock.puffSeconds` | 0.1 | s | Soft knock length. |
| `proto.hits.knock.puffGain` | 0.08 | gain | Soft knock loudness. |

- **Hit pause:** `feedback.hitStop` (simulation, unchanged). **Reduced motion:** `proto.hits.reducedMotion`.

## Layers

| Event | When | Response | Reference | Sources |
|---|---|---|---|---|
| `impact` | {} | shake, flash, crumple, ring, rays, popup, spark ×`proto.hits.impact.sparkCountMin/proto.hits.impact.sparkCountMax` at contact, noise sound | Art of Screenshake: shake scaled by damage, contact flash, sparks, cr… | EDIT26#5.5, JUICE#J2, JUICE#J3, LOG#P1.2/juice, DESIGN#D10.3~1 |
| `impact` | {"zone": "front"} | shake, zoom, crumple, noise sound | Art of Screenshake camera kick; Juice It or Lose It squash, deeper on… | JUICE#J2, ENG#8.2~1, EDIT26#4.1~1 |
| `impact` | {"bait": true} | ring, rays, tone sound | Impact effects: denser burst and a horn when the bait lands | EDIT26#5.5, JUICE#J2, DESIGN#D10.3~1 |
| `impact` | {"lunging": true} | shake, zoom, debris ×`proto.hits.lunging.debrisCountMin/proto.hits.lunging.debrisCountMax` at contact | Art of Screenshake knockback and impact effects: the lunge's momentum… | JUICE#J2, ENG#8.2~1, EDIT26#4.1~2 |
| `impact` | {"stopped": true} | dust ×`proto.hits.stopped.dustCount` at contact, noise sound | art of rally dust plumes: a dull thump and dust when the dummy hits a… | JUICE#J1, DESIGN#D9.4, ENG#8.2~1 |
| `impact` | {"assessed": {"min": "proto.hits.big.assessedMin"… | shake, zoom, flash, ring, smoke ×`proto.hits.big.smokeCount` at contact, noise sound | Art of Screenshake: bigger hits get longer flash, harder shake, smoke | EDIT26#5.5, JUICE#J2, LOG#P1.2/juice, ENG#8.2~1 |
| `knock` | {} | dust ×`proto.hits.knock.dustCountMin/proto.hits.knock.dustCountMax` at dummy, noise sound | Small dust puff; no reward feedback | JUICE#J3 |
| `writeoff` | {} | shake, zoom, flash, crumple, ring, debris ×`proto.hits.writeoff.debrisCount` at contact, smoke ×`proto.hits.writeoff.smokeCount` at dummy, spark ×`proto.hits.w… | Super Sprint hard-crash destruction; heavy shake, debris, field flash | JUICE#J1, JUICE#J3, EDIT26#5.5, LOG#P1.2/juice |
| `touch-spent` | {} | shake, dust ×`proto.hits.touchSpent.dustCount` at contact, noise sound | Dull bump, no burst; no flash, sparks or number | JUICE#J3, LOG#P1.2/juice, DESIGN#D4.5 |
| `near-miss` | {} | streaks, noise sound | Speed lines along the car's travel and a pass-by whoosh; no reward cue | DESIGN#D4.5, DESIGN#D9.4, JUICE#J1 |
| `miss` | {} | stumble, streaks, dust ×`proto.hits.miss.dustCount` at dummy, noise sound | Stumble with arms flailing and a clatter; the body announces the miss | EDIT26#5.5, DESIGN#D4.5, EDIT26#5.1 |
| `lunge` | {} | shake, streaks, dust ×`proto.hits.lunge.dustCountMin/proto.hits.lunge.dustCountMax` at dummy, noise sound | Speed lines, dust kicked backwards, small camera kick; shorter when w… | JUICE#J3, EDIT26#5.5, LOG#P1.2/juice, DESIGN#D4.5 |
