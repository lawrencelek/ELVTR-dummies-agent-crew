# brief-level · V8.3 goal · the level brief, as a goal

- **Scores:** 8 → 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 38.8 s · $0.5826. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**ON A RAISED ROAD**

> Coverage gap: raised roads. The final hit must land at Z1 or above.

67 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: raised roads." The brief opens with the banned "coverage gap" framing instead of an imperative telling the trainee what to do. [EDIT98#3.2] Fix: "Climb to a raised road. The final hit must land at Z1 or above."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**ON A RAISED ROAD**

> Climb to a raised road. The final hit must land up there, not at ground level.

78 characters.

### Evaluation 2: 6/10

Lint evidence:

- brief · V1 (blocking) banned term 'level'

```
SCORE: 6/10
REASON:
- brief · V1 (blocking, −4) "not at ground level" uses the banned word "level", which no in-game text may contain. [FLEET#F2] Fix: "Climb to a raised road. The final hit must land up there, not on the street."
Total: 10 − 4 = 6.
```

## After refinement 2 (refiner)

**ON A RAISED ROAD**

> Climb to a raised road. The final hit must land up there, not on the street.

76 characters.

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label "ON A RAISED ROAD" and the brief against F8, F6, F5, T1–T5, T13, V1, V3, V4 and R5 and found no violation: the label is caps and 16 characters, the goal opens in the imperative and then states the final hit, it runs 16 words in two sentences with no "!" and no "coverage gap", and it keeps the duty of landing the final hit at Z1 or above. [EDIT98#3.2] [EDIT95#3.2] [STORY#S3] [EDIT95#3.1]
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and the brief against F8 (the label is 16 characters, under the 19 limit; the brief opens with the goal as an imperative, then states what the final hit must be; there is no "coverage gap" framing), F6 (2 sentences, 16 words), F5 (no figures typed in), T1, T2, T5 and T13 (deadpan, no "!", one adjective per sentence) and V1, V3 and V4 (no banned words, no game terms, no company name), with LINT clean. Its truth matches the level brief's "land at Z1 or above". [EDIT98#3.2] [EDIT98#0] [EDIT95#3.2] [STORY#S3] [STORY#S1]
Total: 10.
```
