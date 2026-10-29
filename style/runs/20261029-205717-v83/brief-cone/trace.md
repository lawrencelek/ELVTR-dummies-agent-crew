# brief-cone · V8.3 goal · the cone brief, as a goal

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 27.6 s · $0.3607. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**CONE-BAITED CAR**

> Coverage gap: cones. The final hit must come from a car reacting to a cone.

75 characters.

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- brief · F8 (major, −2) "Coverage gap: cones. The final hit must come from a car reacting to a cone." The brief opens with the "coverage gap" framing, which the rule bars, and it never gives the goal as an imperative first. [EDIT98#3.2] Fix: "Place a cone in a car's path. The final hit must come from a car reacting to the cone."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

**CONE-BAITED CAR**

> Place a cone. The final hit must come from a car reacting to it.

64 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked the label and brief against F8 (label is 15 characters, under the 19 limit; the brief starts with an imperative goal, "Place a cone.", then states the final hit; no "coverage gap" framing) [EDIT98#3.2, STORY#S3], F6 (2 sentences, 14 words) [EDIT95#3.2], T1–T5 and T13 (flat, no "!", no intensifiers, training framing) [EDIT95#3.2, EDIT95#3.3], V1, V3 and V4 (no banned words, glossary held, no company name) [EDIT95#3.1], and F5 (no figures; this task needs no placeholders) [STORY#S1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and the brief against every rule for Dummy Corporation. The label "CONE-BAITED CAR" is caps, 15 characters, and matches the cone kind [STORY#S3]. The brief puts the imperative goal first and the required final hit second, with no "coverage gap" framing [EDIT98#3.2, STORY#S3]. It has two sentences and 14 words, no "!", no banned words, no figures, and no other company name [EDIT95#3.2, EDIT95#0, EDIT95#3.1, STORY#S1]. Its training framing holds and it states only what the cone brief guarantees [EDIT95#3.1].
Total: 10.
```
