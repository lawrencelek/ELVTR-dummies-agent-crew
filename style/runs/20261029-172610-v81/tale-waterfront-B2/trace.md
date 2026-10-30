# tale-waterfront-B2 · V8.1 tale · Prototype 7.13 tale waterfront B2, for Prototype 8.1

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 61.5 s · $0.448. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

223 characters.

### Evaluation 1: 1/10

Lint evidence:

- tale · F6 (blocking) 38 words > 35 (style.v2.tale.maxWords); 6 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- tale · F6 (blocking, −4) "Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you." The tale has 38 words and 6 sentences, but the limits are 35 words and 2 sentences. [EDIT96#3.2] Fix: "Battery 3 is fitted: chain {n} hits, and you are Certified for shipment to our clients. On the circus island, the monument cast from every write-off reads ZERO ACCIDENTS (EXCLUDING TESTS)." (31 words, 2 sentences.)
- tale · F5 (major, −2) "A chain of three" This types the combo figure as a word, but the number belongs in the registry (story.task.comboHard). [STORY#S1] Fix: change "three" to the placeholder {n}.
- tale · V3 (major, −2) "certifies the city" The glossary uses Certified only for a dummy that passed, so the city cannot be certified. [EDIT95#3.1] Fix: make the dummy the one Certified, e.g. "chain {n} hits, and you are Certified".
- tale · T3 (major, −2) "every chassis you lost" This calls write-offs losses, but in the training frame a write-off is progress. [EDIT95#3.3] Fix: change "every chassis you lost" to "every write-off".
Total: 10 − 4 − 2 − 2 − 2 = 1.
```

## After refinement 1 (refiner)

> Battery 3 is fitted: end a combo on link {n} or later, and you are Certified for our clients. The circus island's monument, cast from every write-off, reads ZERO ACCIDENTS (EXCLUDING TESTS).

190 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1, T3–T5, T13 [EDIT95#3.2] [PLAY#PS2], V1, V3, V6, V8, V9, V11 [EDIT95#3.1] [EDIT95#3.3], and F5, F6, F7 [EDIT96#3.2] [STORY#S1]. It has 32 words in two sentences, and the words after the 20th name the circus monument. It names Battery 3 on the tile that issues it. Its duty matches the COMBO ×{n} brief, so R5 holds [STORY#S3]. ZERO ACCIDENTS (EXCLUDING TESTS) is exact and true to the tile, so V6 and R4 hold [STORY#WB2] [EDIT94#3.2].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations: the tale stays within 32 words and two sentences, with the place named in the words past 20 (F6), it fits Battery 3 (F7), and its duty matches the COMBO ×{n} brief (R5) [EDIT96#3.2, STORY#S3, STORY#WB2]. The tone is deadpan and inspirational and stays in the training frame (T1, T3, T4, T5, T13) [EDIT95#3.2, EDIT95#3.1]. It keeps the CUSTOMS frame and the exact phrase ZERO ACCIDENTS (EXCLUDING TESTS) (V6) [EDIT95#3.3, EDIT92#3]. The circus island's monument is true to the tile (V11, R4) [STORY#WB2], the clients are served and never named (V9) [EDIT95#3.1], and it uses no banned words, no Farsight and no stray figures (V1, V4, F5) [EDIT95#0].
Total: 10.
```
