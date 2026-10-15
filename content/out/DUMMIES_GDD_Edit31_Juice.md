# DUMMIES — GDD Edit 31: Generated Juice

**Generated · 2026-10-15 · run `20261015-013357` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p1/content/juice.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.juice.reducedMotion` | 0.25 | ratio | Scale on shake, flinch and tremble under reduced-motion settings. |
| `proto.juice.lunge.shakeAmpMin` | 1 | canvas units | Lunge camera kick at the lowest charge. |
| `proto.juice.lunge.shakeAmpMax` | 2.5 | canvas units | Lunge camera kick at full charge. Kept small so the nose vector stays readable. |
| `proto.juice.lunge.shakeSeconds` | 0.15 | s | Duration of the lunge camera kick. |
| `proto.juice.lunge.dustCount` | 6 | count | Dust puffs kicked behind the body on a lunge. |
| `proto.juice.lunge.dustSpeed` | 70 | canvas units/s | Launch speed of lunge dust. |
| `proto.juice.lunge.dustLife` | 0.4 | s | Lifetime of lunge dust. |
| `proto.juice.lunge.dustSize` | 3 | canvas units | Size of lunge dust puffs. |
| `proto.juice.impact.shakeAmpMin` | 3 | canvas units | Shake amplitude for the lightest scored hit. Matches the P1 literal 3. |
| `proto.juice.impact.shakeAmpMax` | 12 | canvas units | Shake amplitude at full assessed impact. Matches the P1 literal 3 + 9. |
| `proto.juice.impact.shakeSecondsMin` | 0.25 | s | Shake duration for the lightest scored hit. Matches the P1 literal. |
| `proto.juice.impact.shakeSecondsMax` | 0.45 | s | Shake duration at full assessed impact. Matches the P1 literal 0.25 + 0.2. |
| `proto.juice.impact.flash` | 0.08 | s | White contact flash on a scored hit. |
| `proto.juice.impact.sparkCountMin` | 8 | count | Sparks on the lightest scored hit. Matches the P1 literal 8. |
| `proto.juice.impact.sparkCountMax` | 18 | count | Sparks at full assessed impact. Matches the P1 literal 8 + 10. |
| `proto.juice.impact.sparkSpeed` | 180 | canvas units/s | Launch speed of impact sparks. |
| `proto.juice.impact.sparkLife` | 0.35 | s | Lifetime of impact sparks. |
| `proto.juice.impact.sparkSize` | 2.5 | canvas units | Size of impact sparks. |
| `proto.juice.impact.ringCount` | 1 | count | Contact rings per scored hit. |
| `proto.juice.impact.ringSpeed` | 140 | canvas units/s | Expansion speed of the contact ring. |
| `proto.juice.impact.ringLife` | 0.2 | s | Lifetime of the contact ring. |
| `proto.juice.impact.ringSize` | 14 | canvas units | Starting radius of the contact ring. |
| `proto.juice.knock.dustCountMin` | 2 | count | Dust for the slowest damage-free knock. |
| `proto.juice.knock.dustCountMax` | 5 | count | Dust for a fast damage-free knock. |
| `proto.juice.knock.dustSpeed` | 50 | canvas units/s | Launch speed of knock dust. |
| `proto.juice.knock.dustLife` | 0.35 | s | Lifetime of knock dust. |
| `proto.juice.knock.dustSize` | 2.5 | canvas units | Size of knock dust. |
| `proto.juice.touchSpent.shakeAmp` | 1.5 | canvas units | Dull bump on a touch of a spent car. Below the lightest scored hit. |
| `proto.juice.touchSpent.shakeSeconds` | 0.12 | s | Duration of the spent-car bump. Shorter than any scored hit. |
| `proto.juice.touchSpent.dustCount` | 3 | count | Low dust puff on a spent-car touch. No sparks, no flash. |
| `proto.juice.touchSpent.dustSpeed` | 30 | canvas units/s | Slow launch speed for the dull bump. |
| `proto.juice.touchSpent.dustLife` | 0.5 | s | Lifetime of spent-car dust. |
| `proto.juice.touchSpent.dustSize` | 3.5 | canvas units | Size of spent-car dust. |
| `proto.juice.writeoff.shakeAmp` | 16 | canvas units | Heavy shake on write-off. Above the strongest scored hit. |
| `proto.juice.writeoff.shakeSeconds` | 0.7 | s | Duration of the write-off shake. Inside the destruction presentation. |
| `proto.juice.writeoff.flash` | 0.15 | s | Field flash on write-off. |
| `proto.juice.writeoff.sparkCount` | 24 | count | Sparks on write-off. |
| `proto.juice.writeoff.sparkSpeed` | 240 | canvas units/s | Launch speed of write-off sparks. |
| `proto.juice.writeoff.sparkLife` | 0.5 | s | Lifetime of write-off sparks. |
| `proto.juice.writeoff.sparkSize` | 3 | canvas units | Size of write-off sparks. |
| `proto.juice.writeoff.smokeCount` | 14 | count | Smoke puffs on write-off. |
| `proto.juice.writeoff.smokeSpeed` | 40 | canvas units/s | Launch speed of write-off smoke. |
| `proto.juice.writeoff.smokeSize` | 8 | canvas units | Size of write-off smoke puffs. |
| `proto.juice.writeoff.debrisCount` | 10 | count | Body-coloured debris pieces on write-off. |
| `proto.juice.writeoff.jointDebrisCount` | 4 | count | Black joint debris pieces on write-off. |
| `proto.juice.writeoff.debrisSpeed` | 160 | canvas units/s | Launch speed of debris. |
| `proto.juice.writeoff.debrisSize` | 5 | canvas units | Size of debris rectangles. |
| `proto.juice.denied.shakeAmp` | 1.2 | canvas units | Short stutter on a denied action. Costs nothing. |
| `proto.juice.denied.shakeSeconds` | 0.1 | s | Duration of the denial stutter. |
| `proto.juice.chassis.dustCount` | 10 | count | Rotor-wash dust around the arriving chassis. |
| `proto.juice.chassis.dustSpeed` | 80 | canvas units/s | Outward speed of rotor-wash dust. |
| `proto.juice.chassis.dustLife` | 0.6 | s | Lifetime of rotor-wash dust. |
| `proto.juice.chassis.dustSize` | 4 | canvas units | Size of rotor-wash dust. |
| `proto.juice.chassis.dropSeconds` | 0.9 | s | Replacement chassis fall time from drone height to the floor. |
| `proto.juice.throw.dustCount` | 3 | count | Small dust at the dummy on a cone throw. |
| `proto.juice.throw.dustSpeed` | 40 | canvas units/s | Launch speed of prop-handling dust. |
| `proto.juice.throw.dustLife` | 0.3 | s | Lifetime of prop-handling dust. |
| `proto.juice.throw.dustSize` | 2.5 | canvas units | Size of prop-handling dust. |
| `proto.juice.drop.dustCount` | 2 | count | Dust where the dummy sets a cone down. |
| `proto.juice.punt.dustCount` | 4 | count | Dust kicked ahead when the dummy punts a cone. |
| `proto.juice.brakeMarks.width` | 2.5 | canvas units | Width of each rear-wheel tyre mark. |
| `proto.juice.brakeMarks.alpha` | 0.3 | alpha | Starting opacity of a tyre mark. Low contrast, under every cue. |
| `proto.juice.brakeMarks.fadeSeconds` | 12 | s | Time for a mark to fade out, so old marks do not read as braking now. |
| `proto.juice.brakeMarks.max` | 400 | count | Cap on live mark segments. |
| `proto.juice.brakeMarks.minSpeed` | 40 | world units/s | Slowest braking speed that still leaves a mark. |
| `proto.juice.lowHealth.smokeFrom` | 0.45 | ratio | Wear fraction where body smoke starts. |
| `proto.juice.lowHealth.sparkFrom` | 0.7 | ratio | Wear fraction where body sparks start. |
| `proto.juice.lowHealth.vignetteFrom` | 0.7 | ratio | Wear fraction where the red edge vignette starts pulsing. |

- **Hit pause:** `feedback.hitStop`. **Write-off:** `feedback.writeOffSeconds`. **Reduced motion:** `proto.juice.reducedMotion`.

## Event responses

| Event | Response | Reference | Sources |
|---|---|---|---|
| `lunge` | scales by `charge` / `battery.capacity`; shake ['proto.juice.lunge.shakeAmpMin', 'proto.juice.lunge.shakeAmpMax'] for proto.juice.lunge.shakeSeconds; dust ×proto.juice.lunge.dustCount (structure, bac… | Dust kicked backwards (Micro Machines, art of rally) | LOG#P1.2/juice, JUICE#J3, JUICE#J1, DESIGN#D4.5 |
| `impact` | scales by `assessed` / `damage.bodyHealth`; shake ['proto.juice.impact.shakeAmpMin', 'proto.juice.impact.shakeAmpMax'] for ['proto.juice.impact.shakeSecondsMin', 'proto.juice.impact.shakeSecondsMax']… | Hit pause, scaled shake, sparks, contact flash (Art of Screenshake) | JUICE#J3, JUICE#J2, LOG#P1.2/juice, DESIGN#D4.5, JUICE#J4 |
| `knock` | scales by `speed` / `proto.dummyStrikeSpeed`; dust ×['proto.juice.knock.dustCountMin', 'proto.juice.knock.dustCountMax'] (structure, random) | Small dust puff, no reward feedback (art of rally) | JUICE#J3, JUICE#J1, LOG#P1.3/rules |
| `touch-spent` | shake proto.juice.touchSpent.shakeAmp for proto.juice.touchSpent.shakeSeconds; dust ×proto.juice.touchSpent.dustCount (fleet, random) | Dull bump with springy recoil, no burst (Micro Machines) | JUICE#J3, JUICE#J1, DESIGN#D4.5, LOG#P1.2/juice |
| `writeoff` | shake proto.juice.writeoff.shakeAmp for proto.juice.writeoff.shakeSeconds; flash proto.juice.writeoff.flash; flinch; stamp; spark ×proto.juice.writeoff.sparkCount (primary, random); smoke ×proto.juic… | Car destroyed, debris stays; wreck permanence (Super Sprint, GTA) | JUICE#J3, JUICE#J1, LOG#P1.2/juice, DESIGN#D4.5 |
| `denied` | shake proto.juice.denied.shakeAmp for proto.juice.denied.shakeSeconds | Short stutter, costs nothing; distinct from a miss (Super Sprint) | JUICE#J3, JUICE#J1, DESIGN#D4.5 |
| `chassis` | dust ×proto.juice.chassis.dustCount (structure, random) | Helicopter lowers the replacement, rotor wash (Super Sprint) | JUICE#J1, JUICE#J3 |
| `throw` | dust ×proto.juice.throw.dustCount (structure, facing) | Arc with stretched shadow stays as P1.2; light dust only (Juice It or Lose It) | JUICE#J3, LOG#P1.2/juice, JUICE#J2 |
| `drop` | dust ×proto.juice.drop.dustCount (structure, random) | Small settle dust on the mundane desk-scale prop (Micro Machines) | JUICE#J1, JUICE#J3 |
| `pickup` |  | Quiet action; sound already covers it (Juice It or Lose It) | JUICE#J2, DESIGN#D9.4 |
| `punt` | dust ×proto.juice.punt.dustCount (structure, facing) | Knockback dust along the kick (Art of Screenshake) | JUICE#J2, JUICE#J3 |
| `honk` |  | Hazard lights, headlight flash and HONK bubble stay as P1.2; no added field jui… | LOG#P1.1-observations, JUICE#J1, DESIGN#D9.4 |
| `purchase` |  | Frame-level confirmation only; field stays still | DESIGN#D10.5, JUICE#J4 |
| `drone-dispatch` |  | Drone lift animation already in P1 (helicopter delivery) | LOG#P1.1-observations, JUICE#J1 |

## Persistent states

- **brakeMarks:** width `proto.juice.brakeMarks.width`; alpha `proto.juice.brakeMarks.alpha`; fadeSeconds `proto.juice.brakeMarks.fadeSeconds`; max `proto.juice.brakeMarks.max`; minSpeed `proto.juice.brakeMarks.minSpeed`; role `fleet`. Tyre marks as ink strokes on a pale floor (Absolute Drift, art of rally) (JUICE#J1, JUICE#J3, JUICE#J4, DESIGN#D10.1)
- **lowHealth:** smokeFrom `proto.juice.lowHealth.smokeFrom`; sparkFrom `proto.juice.lowHealth.sparkFrom`; vignetteFrom `proto.juice.lowHealth.vignetteFrom` (LOG#P1.2/dummy-damage-states, JUICE#J3, JUICE#J4)
- **replacementDrop:** seconds `proto.juice.chassis.dropSeconds`; height `proto.art.droneHeight`. Helicopter lowers the replacement car (Super Sprint) (JUICE#J1, JUICE#J3, ENG#11.2)
