# brief-cls · audit · shipped brief cls

- **Scores:** 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 0 refinement(s).
- **Calls:** 2 · 11.5 s · $0.1074. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**A {cls}**

> Coverage gap: the {clsLong}. The final hit must come from a {cls}.

66 characters.

### Evaluation 1: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and brief against these rules: F8 for the brief format, which matches the shipped `cls` row in [STORY#S3] word for word and resolves to "A VAN" in [STORY#PC2]; T1–T3 and V4 for Farsight's voice [EDIT92#3]; V1 and V3 for banned words and the glossary [FLEET#F2] [FLEET#F3]; F5 for registry placeholders, not typed figures [STORY#S1]; and R5 for truth.
Total: 10.
```

### Confirmation 2: 10/10

```
SCORE: 10/10
REASON:
- None. The label "A {cls}" and the brief match the shipped `cls` row word for word, follow F8's caps-label and "Coverage gap: … The final hit must …" form, and use only registry placeholders, never values (F5). The text has no "!" (T2), no banned or game words (V1, V3), stays dry and procedural with duty framing (T1, T3), and makes no claim beyond the task's condition (R5). [STORY#S3] [STORY#S1] [EDIT92#3] [FLEET#F2] [FLEET#F3] [STORY#PC2]
Total: 10.
```
