# brief-cls · V8 brief · Prototype 7.13 brief cls, for Prototype 8

- **Scores:** 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 0 refinement(s).
- **Calls:** 2 · 15.7 s · $0.107. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

**A {cls}**

> Coverage gap: the {clsLong}. The final hit must come from a {cls}.

66 characters.

### Evaluation 1: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label "A {cls}" and the duty "Coverage gap: the {clsLong}. The final hit must come from a {cls}." against the brief form [STORY#S3], [EDIT95#3.2] (F8, F10, F5). I also checked the length cap of two sentences and 20 words, the deadpan voice with no "!" (F6, T1, T2, T13), the training framing and glossary [EDIT95#3.1], [EDIT95#3.3], [FLEET#F3] (T3, V3, V8), and the banned words and company name [EDIT95#0], [EDIT95#4.2] (V1, V4); none is broken, and the {cls}/{clsLong} placeholders stay as given.
Total: 10.
```

### Confirmation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the label and the brief against T1–T5 and T13, V1, V3, V4, V6 and V8–V9, F5, F6, F8 and F10, and R5. The label "A {cls}" is a capitals label within 19 characters, and its placeholder stays as given. The brief is two sentences of 14 words and repeats the cls row of [STORY#S3] word for word. It is flat and has no exclamation mark. It sets out the training and the final hit, and it names no company or banned word [EDIT95#3.1] [EDIT95#3.2] [EDIT95#4.2]. Lint found nothing.
Total: 10.
```
