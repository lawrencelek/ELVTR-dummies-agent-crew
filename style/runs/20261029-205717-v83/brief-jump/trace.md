# brief-jump · V8.3 goal · the jump brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 26.9 s · $0.3567. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**JUMP INTO A CAR**

> Coverage gap: jumps. The final hit must be a jump into a car.

61 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: jumps. The final hit must be a jump into a car." The brief opens with the barred "coverage gap" framing instead of an imperative goal stating what to do first. [EDIT98#3.2] Fix: "Jump into a car. The jump must be the final hit."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**JUMP INTO A CAR**

> Jump into a car. The jump must be the final hit.

48 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and brief against tone, vocabulary, formatting and truth: T1–T5, T13, V1, V3, V4, F5, F6, F8 and R5 [EDIT95#3.2, EDIT95#3.1, EDIT98#3.2, STORY#S3]. The label "JUMP INTO A CAR" is caps and under 19 characters, the goal opens in the imperative and then names the final hit, and the brief is 11 words in two sentences with no "!", no "coverage gap" framing and no banned words.
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label "JUMP INTO A CAR" (15 characters, caps) and the goal "Jump into a car. The jump must be the final hit." (11 words, two sentences) against F8, which wants an imperative first, then the final hit, with no coverage-gap framing [EDIT98#3.2, STORY#S3]. I also checked the length cap under F6 [EDIT95#3.2], T2's ban on "!" [EDIT95#3.2], the T1/T3 tone and training frame [EDIT95#3.1], the V1/V4 bans on Farsight and the company name [EDIT95#0], F5 on figures [STORY#S1], and R5 on the jump duty [STORY#MB3]; none is broken.
Total: 10.
```
