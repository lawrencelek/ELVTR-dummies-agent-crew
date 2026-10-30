# tale-parkland-C2 · V8.3 tale · Parkland C2, cut to 15 to 20 words

- **Scores:** 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 43.0 s · $0.5669. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Our board will watch opening day from these terraces, which face the avenue, so every crossing is a performance. A van delivers the catering; arrange for it to deliver you.

172 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 30 words > 20 (style.v2.tale.maxWords)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "Our board will watch opening day from these terraces, which face the avenue, so every crossing is a performance. A van delivers the catering; arrange for it to deliver you." At 30 words, the tale is over the 20-word cap for tales (lint `length`). [EDIT98#3.2] Fix: drop the avenue clause and keep the place, the duty and the catering detail: "Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you." (19 words).
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> Our board watches opening day from these terraces. A van delivers the catering; arrange for it to deliver you.

110 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against all the rules for Dummy Corporation's text. The tone is deadpan and motivating, with no "!" and no adjectives or intensifiers (T1, T2, T13; [EDIT95#3.2]). The company speaks as "our" and keeps the training frame (T3, T5; [EDIT95#3.1]). It names no Farsight or other company, uses no banned words and stays in the glossary (V1, V3, V4; [EDIT95#0]). It holds the OPENING DAY frame through the board, who appear in the act's narration (V6; [EDIT95#3.3], [STORY#PC2]). It names the amphitheatre's terraces and turns them toward the duty (V11; [EDIT95#3.1]). It is 19 words in two sentences with no figures (F5, F6, F11; [EDIT98#3.2]). The duty, a final hit from a van, matches the brief, and the tale names no equipment, since this tile issues none (R4, R5; [STORY#PC2], [STORY#S1]).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked: T1–T5 and T13 for deadpan voice that motivates, training framing, "our"/"you" address, no adjectives and no "!" [EDIT95#3.2, PLAY#PS2]; V1, V3, V4, V6, V9 and V11 for the OPENING DAY frame, the Corporation's board in Farsight's place, and the terraces turned toward the duty [EDIT95#3.1, EDIT95#3.3, STORY#PC2]; F5, F6 and F11 for 19 words, two sentences and no placeholder [EDIT98#3.2, EDIT97#3.2]; R4 and R5 for the van duty matching the brief and no equipment named on a tile that issues none [STORY#PC2, STORY#S1].
Total: 10.
```
