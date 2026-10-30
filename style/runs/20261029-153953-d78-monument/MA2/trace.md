# MA2 · D78 tile barks · Monument A2 · The neon shops

- **Scores:** 5 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 62.1 s · $0.4977. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the four impact barks a car says when it hits the dummy on this tile, one per price tier (01 Luxury, 02 Corporate, 03 Consumer, 04 Budget). Each line names this tile's place: its landmark from the title or the tale, or the district. Never the grid code. Each in its tier's voice, at most 48 characters, true to an impact on this tile. Pick each line's style.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t121 | impact | 01 | speech | Monument prices, and you still scuff my paint. | 46 |
| t122 | impact | 02 | speech | Neon shops zone. Contact logged. Form filed. | 44 |
| t123 | impact | 03 | thought | Under the neon shops. Of course it happens... | 45 |
| t124 | impact | 04 | shout | Not outside the neon shops! Kind regards! | 41 |

### Evaluation 1: 5/10

```
SCORE: 5/10
REASON:
- t123 · R4 (blocking, −4) "Under the neon shops." The line can fire anywhere on Monument A2, so "under" places the car at a spot near the landmark that no condition guarantees; the guide names "under the shops" as a failing example. [STORY#MA2] Fix: "The neon shops. Of course it happens here..."
- t122 · T12 (minor, −1) "Neon shops zone. Contact logged. Form filed." Place, log and filing in a row make a flat report with no feeling or joke, like the guide's failing "Riverside. Low-rise streets. Hit logged." [SUB4#6.1] Fix: "Contact at the neon shops. Not in my KPIs."
Total: 10 − 4 − 1 = 5.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t121 | impact | 01 | speech | Monument prices, and you still scuff my paint. | 46 |
| t122 | impact | 02 | speech | Neon shops contact. Policy 6.3 disagrees. | 41 |
| t123 | impact | 03 | thought | The neon shops. Of course it happens here... | 44 |
| t124 | impact | 04 | shout | Not at the neon shops! Kind regards. | 36 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all four lines (t121–t124) against tier voice and polite form (T6–T9, `FLEET#F4`, `FLEET#F2`), "!" limited to a shout or Budget bark (t124 is both; T10, `DECISIONS#rows-541-550`) and stock endings (T11, one "Kind regards."; `SUB4#6.1`), and glossary and grid codes (V1–V8; t121 names the district Monument, the others the landmark, never A2; `FLEET#F3`, `SUB4#6.2`). I also checked length and endings (F1–F5; Policy 6.3 is Corporate flavour, t123's trailing dots fit thought style; `EDIT39#6.6`, `FSG#field-text`), and impact-only truth with places named as the neon shops or Monument, not a spot relative to them (R1–R4, `FLEET#F8`, `STORY#MA2`).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. All four lines pass. Tier voice holds against [FLEET#F4]: t121 is superior and does not apologise, t122 cites a policy number, t123 is resigned and t124 is a Budget shout with "Kind regards." Each line names the neon shops or Monument as the place, which R4 allows [STORY#MA2], [SUB4#6.2]. Each line reacts to impact only and claims no cone bait, write-off, speed or damage figure [FLEET#F8], [DESIGN#D9.3]. "!" appears only in the Budget shout, which T10 allows [DECISIONS#rows-541-550]. "Policy 6.3" is Corporate paperwork, not a statistic (F5), and the thought style's trailing dots fit t123 [EDIT39#6.6].
Total: 10.
```
