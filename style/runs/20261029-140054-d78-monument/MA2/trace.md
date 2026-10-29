# MA2 · D78 tile barks · Monument A2 · The neon shops

- **Scores:** 6 → 9 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 7 · 87.0 s · $0.7663. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the four impact barks a car says when it hits the dummy on this tile, one per price tier (01 Luxury, 02 Corporate, 03 Consumer, 04 Budget). Each line names this tile's place: its landmark from the title or the tale, or the district. Never the grid code. Each in its tier's voice, at most 48 characters, true to an impact on this tile. Pick each line's style.

## Before (generator)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t121 | impact | 01 | speech | Struck beneath the neon shops. How gauche. | 42 |
| t122 | impact | 02 | speech | Monument contact logged. Incident form filed. | 45 |
| t123 | impact | 03 | thought | The neon shops watched. Of course they did. | 43 |
| t124 | impact | 04 | shout | Not by the neon shops, you plank! Cheers! | 41 |

### Evaluation 1: 6/10

```
SCORE: 6/10
REASON:
- t121 · R4 (blocking, −4) "Struck beneath the neon shops." The tile's tale puts the shops under the highway, so no car is ever beneath them: a street car passes beside them and a highway car passes above, which makes the place in this line false in every logged state. [STORY#MA2] Fix: "Contact at the neon shops. How gauche."
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t121 | impact | 01 | speech | Contact at the neon shops. How gauche. | 38 |
| t122 | impact | 02 | speech | Monument contact logged. Incident form filed. | 45 |
| t123 | impact | 03 | thought | The neon shops watched. Of course they did. | 43 |
| t124 | impact | 04 | shout | Not by the neon shops, you plank! Cheers! | 41 |

### Evaluation 2: 9/10

```
SCORE: 9/10
REASON:
- t122 · T12 (minor, −1) "Monument contact logged. Incident form filed." It is two flat report clauses with no joke or feeling in the procedure, the same pattern as the guide's failing example "Riverside. Low-rise streets. Hit logged.". [SUB4#6.1] Fix: "Neon shops contact. Form 9, in triplicate." (42 characters; it makes the paperwork the joke and invents no logged fact).
Total: 10 − 1 = 9.
```

## After refinement 2 (refiner)

| Line | Event | Tier | Style | Text | Chars |
|---|---|---|---|---|---|
| t121 | impact | 01 | speech | Contact at the neon shops. How gauche. | 38 |
| t122 | impact | 02 | speech | Neon shops contact. Form 9, in triplicate. | 42 |
| t123 | impact | 03 | thought | The neon shops watched. Of course they did. | 43 |
| t124 | impact | 04 | shout | Not by the neon shops, you plank! Cheers! | 41 |

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all four lines against the tier voices in [FLEET#F4], the voice and banned terms in [FLEET#F2], the glossary in [FLEET#F3], the bubble and style rules in [EDIT39#6.6] and [FSG#field-text], the "!" rules in [DECISIONS#rows-541-550] and the tile truth in [STORY#MA2]. Each line names only the A2 landmark "the neon shops" and claims no more than contact, which the `impact` event guarantees. Luxury sniffs, Corporate files Form 9 as paperwork flavour, Consumer is resigned, and Budget's "!" with "Cheers!" bolted on is allowed. Lint reported nothing, and no line has a stock ending or a grid code.
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked all four lines for tier voice (T7, T9), stock endings (T11), banned words, the glossary and naming places rather than grid codes (V1, V3, V5), length, style, priority and end punctuation (F1–F5), and truth for an `impact` event on Monument A2. "Neon shops" is the tile's title, no line makes a claim its conditions don't guarantee, and "!" appears only in the Budget shout. [FLEET#F2] [FLEET#F4] [FLEET#F8] [EDIT39#6.6] [STORY#MA2] [DECISIONS#rows-541-550]
Total: 10.
```
