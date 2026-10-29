# tale-parkland-B2 · V8 tale · Prototype 7.13 tale parkland B2, for Prototype 8

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 53.6 s · $0.4053. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.

212 characters.

### Evaluation 1: 1/10

Lint evidence:

- tale · F6 (blocking) 39 words > 20 (style.v2.text.maxWords); 6 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- tale · F6 (blocking, −4) "Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three." Lint counts 39 words and 6 sentences, above the caps of 20 words and 2 sentences. [EDIT95#3.2] Fix: cut to two sentences of about 15 words: "Inspection day: Battery 2 is fitted. The board watches the ring; finish a chain for our clients."
- tale · F5 (major, −2) "a chain of three" This types the combo figure as a word, but story.task.comboHard holds that number and the tale should not. [STORY#S1] Fix: drop the figure. Use "finish a chain" or "a long chain", or use the brief's bound placeholder {n} if the tale slot fills it in.
- tale · V6 (major, −2) "The public prefers the product to the test." The OPENING DAY frame now has the Expo opening to clients, not to the public, and "the public" comes from the superseded Edit 92 frame. [EDIT95#3.3] Fix: delete the sentence, or name clients: "Our clients arrive when the ring passes."
- tale · T1 (major, −2) "When the cars come round clean, the board applauds the cars. The public prefers the product to the test." This is winking irony that undercuts the trainee's work, so the notice does not motivate. [EDIT95#3.2] Fix: replace both sentences with a flat line that motivates, e.g. "The board watches the ring; finish a chain for our clients."
Total: 10 − 4 − 2 − 2 − 2 = 1 (floor, style.score.floor).
```

## After refinement 1 (refiner)

> Battery 2 is fitted. The board watches the ring; end a long chain on a car for our clients.

91 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations: the tale is two sentences and 19 words (F6). It names Battery 2, the equipment issued on this tile (F7, R5; STORY#S1, STORY#PB2), and its duty fits the COMBO brief without stating a figure (F5, R5; STORY#S3). It mentions only the board and the ring, which this tile has (R4; STORY#PB2). It stays deadpan, motivates the trainee, uses "our clients" in the OPENING DAY frame and has one adjective (T1–T5, T13, V6, V9; EDIT95#3.2, EDIT95#3.3). It uses no banned word and no company name other than Dummy Corporation (V1, V4; EDIT95#0, EDIT95#3.1).
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against the brief, tile, equipment and story frame [STORY#PB2], [STORY#S3], [STORY#S1], [EDIT95#3.3], the voice and length caps [EDIT95#3.2], the glossary and client rules [EDIT95#3.1], and the tone register [PLAY#PS0], [PLAY#PS2]. It names Battery 2 by rank on the tile that issues it, puts the chain's end on the final hit, serves clients on OPENING DAY, and has two flat sentences of 19 words.
Total: 10.
```
