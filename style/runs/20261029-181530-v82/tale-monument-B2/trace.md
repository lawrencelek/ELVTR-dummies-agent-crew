# tale-monument-B2 · V8.2 tale · Monument B2: The monument, redrafted

- **Scores:** 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 47.1 s · $0.576. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Monument B2 (The monument). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. Stand near it and let a colleague find you. Walking is permitted. Dashing would spoil the data.
> - Prototype 8.1 (Dummy Corporation): The monument's plaque reads ZERO ACCIDENTS, a target rather than a record. Stand or walk beside it and let a colleague find you; dashing would spoil the data.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The plaque reads ZERO ACCIDENTS, which new staff mistake for a record. It is a target. Stand or walk beside it and let a colleague find you; dashing would spoil the training.

174 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The plaque reads ZERO ACCIDENTS, which new staff mistake for a record. It is a target. Stand or walk beside it and let a colleague find you; dashing would spoil the training." The tale has 3 sentences, but the limit is 2 (`style.v2.text.maxSentences`). [EDIT97#3.2] Fix: join the first two sentences with a semicolon: "The plaque reads ZERO ACCIDENTS, which new staff mistake for a record; it is a target. Stand or walk beside it and let a colleague find you; dashing would spoil the training." (32 words, 2 sentences).
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> The plaque reads ZERO ACCIDENTS, which new staff mistake for a record; it is a target. Stand or walk near it and let a colleague find you; dashing would spoil the training.

172 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1, T3, T4, T5 and T13 for a flat, motivating voice with one adjective per sentence and no "!" (EDIT95#3.2, PLAY#PS2). I checked V1, V3, V4, V6, V8 and V11: the plaque and its exact ZERO ACCIDENTS phrase name the place and point it at the duty, and "new staff" fits INDUCTION (EDIT95#3.1, EDIT95#3.3, STORY#S2). I checked F5, F6 and F11: two sentences, 31 words, no placeholder and no padding (EDIT97#3.2). I checked R4 and R5: standing or walking with no dash matches STRUCK, NOT DASHING, and no equipment is named on a tile that issues none (STORY#MB2, STORY#S3).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked against the T, V, F and R rules for Dummy Corporation. The tale has 2 sentences and 32 words (F6, [EDIT97#3.2]), and LINT found nothing. The tone is deadpan and in a training frame, and the cars are called colleagues ([EDIT95#3.2], [EDIT95#3.1]). ZERO ACCIDENTS is quoted exactly and "new staff" fits INDUCTION ([EDIT95#3.3], [STORY#S2]). The tale names the monument's plaque as its place and points it at the duty ([STORY#MB2], [EDIT95#3.1]). The duty matches the brief, a car hitting you while you stand or walk, and no equipment is named on a tile that issues none ([STORY#S3], [STORY#S1]).
Total: 10.
```
