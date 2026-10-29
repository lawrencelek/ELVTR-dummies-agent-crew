# brief-struck · V8.3 goal · the struck brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 38.6 s · $0.3808. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**STRUCK, NOT DASHING**

> Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand.

91 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: pedestrians. The final hit must be a car hitting you while you walk or stand." This brief uses the old "Coverage gap" framing that the guide bars, and its first sentence names a category instead of telling the trainee what to do. [EDIT98#3.2] Fix: "Walk or stand in the traffic. The final hit must be a car striking you while you are not dashing."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**STRUCK, NOT DASHING**

> Walk or stand in the traffic. A car must deliver the final hit while you are not dashing.

89 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and the brief against F8 (label 19 characters, imperative goal first, then the final hit, no "coverage gap" framing, placeholders not required for `struck`), F6 (two sentences, 18 words), F5, T1–T5, T13, V1, V3, V4, V8 and R5 (the duty matches the struck task), per [EDIT98#3.2], [EDIT95#3.2], [EDIT95#3.1], [STORY#S3] and [STORY#MB2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and goal for the speaker Dummy Corporation, and found nothing to deduct:
  - **F8:** The label "STRUCK, NOT DASHING" has 19 characters and matches [STORY#S3]. The goal starts with an imperative, then says what the final hit must be. It drops the "coverage gap" wording, as [EDIT98#3.2] requires.
  - **F6:** Two sentences and 18 words, within [EDIT95#3.2].
  - **T2, V1, V4, F5:** Lint found nothing: no "!", no banned word, no company name, no figure.
  - **T1, T3, V3, V8:** The tone is flat procedure in a training frame, with cars as the ones that hit, per [EDIT95#3.1] and [EDIT95#3.2].
  - **Truth against the struck task:** "Walk or stand" matches the S3 condition, and "not dashing" matches the label [STORY#S3].
Total: 10.
```
