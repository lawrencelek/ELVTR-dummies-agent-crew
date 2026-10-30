# tale-waterfront-A1 · V8.2 tale · Waterfront A1: The west portal, redrafted

- **Scores:** 5 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 55.8 s · $0.4969. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Waterfront A1 (The west portal). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.
> - Prototype 8.1 (Dummy Corporation): Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; stand in its path.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The bus carries the upper town's engineers to the bridge, slow and very large. Dummy Corporation requires its fleet data before you cross to our clients. Be the bus's final hit.

177 characters.

### Evaluation 1: 5/10

Lint evidence:

- tale · T13 (minor) an intensifier
- tale · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 5/10
REASON:
- tale · F6 (blocking, −4) "The bus carries the upper town's engineers to the bridge, slow and very large. Dummy Corporation requires its fleet data before you cross to our clients. Be the bus's final hit." The tale has three sentences, and every in-game text may have at most two. [EDIT97#3.2] Fix: "The bus carries the upper town's engineers to the bridge, and Dummy Corporation requires its fleet data before you cross to our clients. Be the bus's final hit." (2 sentences, 29 words).
- tale · T13 (minor, −1) "slow and very large" "very" is an intensifier, and the sentence also has two adjectives where one is allowed. [EDIT95#3.2] Fix: delete "slow and very large", or keep only "large".
Total: 10 − 4 − 1 = 5.
```

## After refinement 1 (refiner)

> At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients.

168 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale, which has 29 words in two sentences, against the following rules and found no violation: tone and address (T1, T3, T4, T5, T13) [EDIT95#3.2]; the glossary, the company name and the CUSTOMS frame (V3, V4, V6, V8, V9) [EDIT95#3.1, EDIT95#3.3]; naming its place, the west portal, upper town and bridge, and turning it toward the bus-fleet duty (V11) [STORY#WA1]; length and padding (F5, F6, F11) [EDIT97#3.2]; and a duty that matches the brief, with no equipment named on a tile that issues none (R4, R5) [STORY#WA1, EDIT93#3.1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1–T5, T13 and T14 for tone, V1, V3, V4, V6 and V8–V11 for vocabulary and lore, F5–F7 and F11 for formatting and length (29 words in 2 sentences, no placeholder or figure), and R4–R5 for truth: it names the west portal and the upper town's engineers from canon, and turns the place toward the bus duty and the crossing to clients that CUSTOMS sets up. It names no equipment, matching a tile that issues none. [STORY#WA1] [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [EDIT97#3.2] [STORY#S3]
Total: 10.
```
