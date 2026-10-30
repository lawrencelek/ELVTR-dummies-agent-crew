# brief-cls · V8.3 goal · the cls brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 31.8 s · $0.3854. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**A {cls}**

> Coverage gap: the {clsLong}. The final hit must come from a {cls}.

66 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: the {clsLong}. The final hit must come from a {cls}." The brief uses the "coverage gap" framing that F8 bans, and it opens with a report, not a goal in the imperative. [EDIT98#3.2] Fix: "Train with the {clsLong}. The final hit must come from a {cls}."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**A {cls}**

> Step in front of the {clsLong}. The final hit must come from a {cls}.

69 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and brief against these rules and found no violation:
  - F8 (`EDIT98#3.2`, `STORY#S3`): the caps label "A {cls}" is under 19 characters. The imperative goal comes first, then the final hit. The {cls} and {clsLong} placeholders are kept, and there is no "coverage gap" framing.
  - F6 (`EDIT95#3.2`): two sentences, 14 words.
  - T1–T5 (`EDIT95#3.2`, `EDIT95#3.1`, `PLAY#PS2`): the voice is flat, with no "!", and the job is framed as training.
  - V1, V3 and V4 (`EDIT95#3.1`): the vocabulary and company-name rules hold.
  - R5 (`STORY#S3`): the duty matches the cls task.
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations. The label "A {cls}" is the canonical label, under 19 characters, with its placeholder kept (F8, F10; [STORY#S3], [EDIT95#4.2]). The goal starts with an imperative, then states the final hit, in two sentences and 14 words (F6, F8; [EDIT98#3.2], [EDIT98#0]). It drops the "coverage gap" framing and keeps {cls} and {clsLong} (F5, F8; [STORY#S1]). The tone is flat, has no "!", and keeps the training frame, with no banned or game words and no other company name (T1–T5, T13, V1, V3, V4; [EDIT95#3.1], [EDIT95#3.2], [PLAY#PS0]). The LINT run returned no findings.
Total: 10.
```
