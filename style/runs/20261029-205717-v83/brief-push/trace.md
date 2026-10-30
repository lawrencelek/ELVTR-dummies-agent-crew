# brief-push · V8.3 goal · the push brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 22.7 s · $0.351. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**PUSH OFF A CAR**

> Coverage gap: ricochets. Push off one car; the final hit must be the next car.

78 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: ricochets. Push off one car; the final hit must be the next car." The brief opens with "coverage gap" framing, which the rule bars, so the goal does not lead with the imperative. [EDIT98#3.2] Fix: "Push off one car. The final hit must be the next car."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**PUSH OFF A CAR**

> Push off one car. The final hit must be the next car.

53 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label "PUSH OFF A CAR" (14 characters, caps) and the goal (2 sentences, 12 words) against F8, F5, F6, T1–T5, T13, V1, V3 and V4. The goal leads with the imperative, then states the final hit, keeps the push task's meaning and drops the "coverage gap" framing, with no "!", digits, intensifiers or company name. [EDIT98#3.2] [EDIT95#3.2] [STORY#S3] [EDIT95#3.1]
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and brief against tone, vocabulary and form: no "!", no banned words, the company is not named, and the brief has the goal form (T1–T3, T13, V1–V4, F5, F6, F8, F10; [EDIT95#3.2], [EDIT95#3.1], [EDIT98#3.2], [STORY#S3]). The label "PUSH OFF A CAR" is 14 characters and keeps its caps. The brief opens with the order "Push off one car" and then states the final hit in two sentences of 12 words. The "Coverage gap" framing is gone, and the push task needs no placeholders.
Total: 10.
```
