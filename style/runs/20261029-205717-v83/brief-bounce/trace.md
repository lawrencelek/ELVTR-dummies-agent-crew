# brief-bounce · V8.3 goal · the bounce brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 30.0 s · $0.3653. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**THROWN INTO A CAR**

> Coverage gap: rebounds. The final hit must come while a hit is still throwing you.

82 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: rebounds. The final hit must come while a hit is still throwing you." The brief opens with the banned "coverage gap" framing, not an imperative goal. [EDIT98#3.2] Fix: "Let one car throw you into the next. The final hit must come while a hit is still throwing you."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**THROWN INTO A CAR**

> Let one car throw you into another. Take the final hit while a hit is still throwing you.

89 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label (17 caps characters, within F8's 19), the brief (two sentences, 18 words, an imperative goal before the final-hit condition, no "coverage gap" framing), T1–T5 and T13 for deadpan training framing and adjective count, V1–V4 and V8 for banned words and the glossary, F5–F6 for digits, placeholders and length, and R5 for agreement with the bounce task, against [EDIT98#3.2], [EDIT95#3.2], [EDIT95#3.1], [STORY#S3] and [STORY#MC3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and goal against every rule for this speaker and found no violations:
  - **Length and form:** the label "THROWN INTO A CAR" is 17 characters and in capitals. The goal is two imperative sentences of 18 words. It says what to do first, then what the final hit must be. There is no "coverage gap" framing, and the bounce task needs no placeholder (F6, F8 [EDIT98#3.2], [EDIT95#3.2]).
  - **Tone:** the line is deadpan, with no "!" and no intensifiers (T1, T2, T13 [EDIT95#3.2], [PLAY#PS0]).
  - **Vocabulary:** there are no banned words, and the line uses no game terms (V1, V3 [EDIT95#3.1]).
  - **Truth:** the goal matches the bounce task's final-hit condition (R5 [STORY#S3], [STORY#MC3]).
Total: 10.
```
