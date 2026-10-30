# arcade-grades · V8.2 notices · Arcade's grades: the title card and the grade label

- **Scores:** 6 → 8 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 3 refinement(s).
- **Calls:** 8 · 102.4 s · $1.182. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Notice | Where | Text | Words |
|---|---|---|---|
| n34 | the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters | Pick one district and write off its quota. The score is the run. | 13 |
| n35 | Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser | GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC | 8 |

### Evaluation 1: 6/10

Lint evidence:

- items[0] · V1 (blocking) banned term 'score'

```
SCORE: 6/10
REASON:
- n34 · V1 (blocking, −4) "The score is the run." The lint found the banned term "score", and V1 bans it in every in-game text. Only the Credits are exempt, so this card is not. [FLEET#F2] Fix: replace the whole text with "One district, until the shift's cars run out. Every few write-offs, the grade rises." (2 sentences, 14 words, 84 characters). This also drops "write off its quota", which the SLOT's facts contradict: an Arcade run ends when the shift's cars run out, not at a quota.
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n34 | the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters | One district, until the shift's cars run out. Every few write-offs, the grade rises. | 14 |
| n35 | Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser | GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC | 8 |

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- n34 · T1 (major, −2) "One district, until the shift's cars run out. Every few write-offs, the grade rises." This only explains the rules and gives the trainee nothing to aim for, and T1 fails a notice that does not motivate. [EDIT95#3.2] Fix: "One district, until the shift's cars run out. Every few write-offs, you rise a grade." (85 characters, 2 sentences, addresses "you" as T5 asks).
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n34 | the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters | One district, until the shift's cars run out. Every few write-offs, you rise a grade. | 15 |
| n35 | Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser | GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC | 8 |

### Evaluation 3: 8/10

```
SCORE: 8/10
REASON:
- n34 · T1 (major, −2) "One district, until the shift's cars run out. Every few write-offs, you rise a grade." The notice only lists the rules flatly and gives the trainee no reason to train, and T1 fails a notice that does not motivate. [EDIT95#3.2] Fix: "One district, one shift of cars. Every few write-offs, you earn a tougher grade." (2 sentences, 15 words, 79 characters; it keeps the one district, the shift's cars and the rising grade, and the tougher grade covers the tougher chassis and denser traffic.)
Total: 10 − 2 = 8.
```

## After refinement 3 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n34 | the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters | One district, one shift of cars. Every few write-offs, you earn a tougher grade. | 14 |
| n35 | Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser | GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC | 8 |

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked: n34 and n35 against T1, T2, T3, T5 and T13 (EDIT95#3.2, PLAY#PS0); V1 and V4 (EDIT95#0, EDIT95#3.1; neither text uses "score" or "level"); F5, F6 and F10 (EDIT96#3.2, EDIT95#4.2; n34 has 2 sentences and 15 words, n35 stays in caps and keeps {G} within 46 characters; n35's "·" label form matches EDIT95#4.2); and truth against the SLOT's facts (one district, one shift of cars, the grade rises every few write-offs, a tougher chassis, denser traffic).
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations in n34 or n35. Checked: tone and training framing (T1–T5, T13, T14: [EDIT95#3.1], [EDIT95#3.2], [PLAY#PS0]), banned words, glossary and company name (V1, V3, V4, V8: [EDIT95#0], [FLEET#F2], [FLEET#F3], [EDIT95#4.2]), length, sentence count, figures, caps and the {G} placeholder (F5, F6, F10: [EDIT96#3.2], [EDIT95#3.2], [STORY#S1], [EDIT95#4.2]), and the slot's Arcade facts (one district, the shift's cars, rising grade, tougher chassis, denser traffic).
Total: 10.
```
