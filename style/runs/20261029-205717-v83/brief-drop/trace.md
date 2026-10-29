# brief-drop · V8.3 goal · the drop brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 28.8 s · $0.3984. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**DROP ONTO A CAR**

> Coverage gap: falls. The final hit must be a drop onto a car from above.

72 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: falls. The final hit must be a drop onto a car from above." The brief opens with the "coverage gap" framing that EDIT98 removed, not with an imperative goal saying what to do. [EDIT98#3.2] Fix: "Drop onto a car from above. The final hit must be that drop." Keep the label "DROP ONTO A CAR".
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**DROP ONTO A CAR**

> Drop onto a car from above. The final hit must be that drop.

60 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and the brief against F8: the label "DROP ONTO A CAR" is 15 characters in caps, and the brief starts with the imperative goal and then gives the final-hit condition, with no "coverage gap" framing [EDIT98#3.2, STORY#S3]. I also checked F6 (2 sentences, 13 words) [EDIT95#3.2], T1 and T2 (deadpan, no "!") [EDIT95#3.2, PLAY#PS0], V1 and V4 (no banned words, no company name) [EDIT95#0, EDIT95#4.2], F5 (no figures) [STORY#S1], and R5 (the duty matches the drop task) [STORY#MC1, STORY#WC2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and brief against F8 (caps label of 15 characters, imperative goal first, then the final hit, no "coverage gap" framing; [EDIT98#3.2], [STORY#S3]), F6 (2 sentences, 13 words; [EDIT95#3.2]), T1–T5 and T13 (flat, no "!", no intensifiers; [EDIT95#3.2], [PLAY#PS0]), V1–V4 and V8 (no banned words, city or company problems; [EDIT95#3.1]), F5 (no figures; [STORY#S1]) and R5 (the duty matches the drop task in [STORY#S3]).
Total: 10.
```
