# tale-waterfront-B2 · V8 tale · Prototype 7.13 tale waterfront B2, for Prototype 8

- **Scores:** 2 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 54.2 s · $0.3821. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you.

223 characters.

### Evaluation 1: 2/10

Lint evidence:

- tale · F6 (blocking) 38 words > 20 (style.v2.text.maxWords); 6 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 2/10
REASON:
- tale · F6 (blocking, −4) "Everything in the valley meets here. On the island stands the monument, cast from every chassis you lost. Its plaque reads ZERO ACCIDENTS (EXCLUDING TESTS). Battery 3 is fitted. A chain of three certifies the city. And you." The tale has 38 words in 6 sentences, over the cap of 20 words and 2 sentences. [EDIT95#3.2] Fix: "The monument is cast from every chassis you wrote off. Battery 3 is fitted: end the longest chain yet." (19 words, 2 sentences).
- tale · F5 (major, −2) "A chain of three" The tale states the combo length as a figure in words, but that figure belongs to story.task.comboHard and could contradict the brief's link {n}. [STORY#S1] Fix: remove the count and name the duty without a value, e.g. "end the longest chain yet".
- tale · T3 (major, −2) "every chassis you lost" "Lost" makes a write-off sound like a loss, but the training frame counts each write-off as progress. [EDIT95#3.3] Fix: "every chassis you wrote off".
Total: 10 − 4 − 2 − 2 = 2.
```

## After refinement 1 (refiner)

> The monument is cast from every write-off. Battery 3 is fitted: finish the chain and ship Certified.

100 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations: the tale is two sentences and 17 words, has no exclamation mark and no banned words, and names Dummy Corporation's equipment as Battery 3 on the tile that issues it. It puts the monument on the circus tile and asks for a final hit that ends a chain, which matches the COMBO brief. "Ship Certified" fits the CUSTOMS frame, and the tone is flat and motivating, without pity [EDIT95#3.1, EDIT95#3.2, EDIT95#3.3, STORY#WB2, STORY#S1, STORY#S3, PLAY#PS0].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations. I checked the tale against T1–T5 and T13 (deadpan, no "!", training framing, write-off as progress) under [EDIT95#3.2] and [EDIT95#3.1]. I checked the glossary, company and story-frame rules (V1, V3, V4, V6, V8, V9) under [EDIT95#3.3]: CUSTOMS, shipping as Certified. I checked length, figures and equipment (F5, F6, F7): 2 sentences, 17 words, with the part rank "Battery 3" allowed and named on the tile that issues it, per [STORY#S1]. I checked the brief match and tile truth (R4, R5): "finish the chain" fits COMBO ×{n}, and the circus has the monument, per [STORY#WB2] and [EDIT94#3.2].
Total: 10.
```
