# DUMMIES — GDD Edit 34: Generated Barks

**Generated · 2026-10-15 · run `20261015-085359` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p2/content/barks.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.barks.seconds` | 2.4 | s | On-screen time of one bubble, long enough to read two short lines at exhibition volume. |
| `proto.barks.cooldown` | 0.8 | s | Global gap before a lower-priority bubble can start after another, so bubbles do not overlap. |
| `proto.barks.carCooldown` | 4 | s | Per-car wait before the same car can speak again at lower priority. Higher-priority lines bypass it. |
| `proto.barks.maxOnScreen` | 3 | count | Maximum simultaneous bubbles, so the road stays readable. |
| `proto.barks.textSize` | 12 | px | Bubble text size, above texture type (ui.typeTexture) so lines stay legible. |
| `proto.barks.nearMissGap` | 36 | world units | A car passing the dummy within this distance without contact logs a near miss. The renderer converts it to metres with … |
| `proto.barks.nearMissSpeed` | 60 | world units/s | Minimum car speed for a near miss. A slow crawl past the dummy is not a near miss. |
| `proto.barks.missRadius` | 120 | world units | The nearest car within this distance of a lunge that ends with no contact speaks the miss line. |

## Bark bank

| Event | When | Style | Priority | Line | Sources |
|---|---|---|---:|---|---|
| `impact` | {"zone": "front"} | shout | 2 | Bumper! That was the bumper! | EDIT26#6.6, DESIGN#D9.3 |
| `impact` | {"zone": "front"} | shout | 2 | Ah! I was proceeding correctly! | EDIT26#6.6, DESIGN#D9.3 |
| `impact` | {"zone": "front", "seniority": {"min": 2, "max": 3}} | thought | 2 | I was trained for this. It happened anyway. | EDIT26#6.4, DESIGN#D9.3 |
| `impact` | {"zone": "side"} | shout | 2 | Side panel! I had right of way! | EDIT26#6.6, DESIGN#D9.3 |
| `impact` | {"bait": true} | thought | 2 | It left my path, then came back. Rude. | EDIT26#6.4, DESIGN#D9.3 |
| `impact` | {"stopped": true} | mutter | 2 | I was stationary. Please note I was stationary. | DRIVER#DB6, DESIGN#D9.3 |
| `writeoff` | {} | shout | 3 | Write-off! Tell dispatch I tried! | EDIT26#6.6, DESIGN#D9.1 |
| `writeoff` | {} | thought | 3 | Please not retraining. Anything but retraining. | EDIT26#3.2, DESIGN#D9.3 |
| `writeoff` | {} | speech | 3 | Write-off number {writeOffs}. Please advise. | ENG#11.3, DESIGN#D9.3 |
| `writeoff` | {"seniority": {"min": 3, "max": 3}} | thought | 3 | Senior model. Apparently not senior enough. | EDIT26#6.4 |
| `near-miss` | {} | mutter | 1 | Within tolerance. Barely. | EDIT26#6.6, DESIGN#D9.4 |
| `near-miss` | {} | mutter | 1 | Was that a collision? Logging it as not. | EDIT26#6.6, DESIGN#D9.3 |
| `near-miss` | {"model": "SEDAN-01"} | mutter | 1 | Parcel intact. Nerves are not. | EDIT26#6.6, DESIGN#D9.2 |
| `near-miss` | {"model": "VAN-02"} | mutter | 1 | Lane maintenance does not cover this. | EDIT26#6.6, DESIGN#D9.2 |
| `miss` | {} | mutter | 1 | It lunged. Nothing happened. Logging that. | EDIT26#10.2, DESIGN#D4.5 |
| `miss` | {} | speech | 1 | Missed. Noted for my record. | EDIT26#6.6, DESIGN#D9.3 |
| `miss` | {} | thought | 1 | If it lunges again, I will be late. | EDIT26#3.2, DESIGN#D9.3 |
| `commit` | {"cause": "body", "man": "brake"} | mutter | 1 | Stopping for the dummy. Window closing. | DRIVER#DB5, EDIT26#3.2 |
| `commit` | {"cause": "pass"} | mutter | 1 | Passing, after waiting. Patience documented. | DRIVER#DB5, DRIVER#DB6 |
| `touch-spent` | {} | speech | 1 | Already assessed. Please move along. | DESIGN#D4.5, DESIGN#D10.3~1 |
| `knock` | {} | mutter | 1 | Contact logged. Please stand clear of the vehicle. | EDIT26#3.2, DESIGN#D9.3 |
| `honk` | {"at": "body"} | speech | 1 | Excuse me. Kindly vacate the carriageway. | DRIVER#DB5, EDIT26#3.2 |
| `honk` | {"at": "cone"} | mutter | 1 | Cone in lane. Raising with maintenance. | DRIVER#DB5, DESIGN#D9.2 |
| `interrupt` | {"by": "car"} | mutter | 1 | Another vehicle. Braking for safety. | DRIVER#DB5 |
| `interrupt` | {"by": "cone"} | mutter | 1 | Swerve halted by a cone. Procedure holds. | DRIVER#DB5 |
| `unstick` | {"how": "reverse"} | mutter | 1 | Reversing. This is within procedure. | DRIVER#DB5, EDIT26#3.2 |
| `unstick` | {"how": "replan"} | mutter | 1 | Replanning. Rank unaffected. | DRIVER#DB5, EDIT26#3.2 |
| `upgrade-seen` | {"node": "Hips"} | speech | 1 | Subject has acquired hips. | EDIT26#3.2 |
| `upgrade-seen` | {"node": "Spine"} | thought | 1 | That spine was not on the last report. | EDIT26#3.2, DESIGN#D9.3 |
| `upgrade-seen` | {"node": "Carry"} | speech | 1 | The subject is carrying something. Is that approved? | EDIT26#3.2, EDIT26#3.1 |
| `upgrade-seen` | {"node": "Throw"} | thought | 1 | It can throw now. Nobody told us. | EDIT26#3.2, DESIGN#D9.1 |
