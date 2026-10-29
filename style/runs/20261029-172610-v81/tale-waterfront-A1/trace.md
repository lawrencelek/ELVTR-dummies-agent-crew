# tale-waterfront-A1 · V8.1 tale · Prototype 7.13 tale waterfront A1, for Prototype 8.1

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 56.3 s · $0.4442. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss.

198 characters.

### Evaluation 1: 1/10

Lint evidence:

- tale · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- tale · T13 (minor) an intensifier
- tale · F6 (blocking) 36 words > 35 (style.v2.tale.maxWords); 4 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- tale · V1 (blocking, −4) "Farsight requires the bus fleet's data" Farsight is the publisher, and it may appear only in the Credits; this tale is in-game text. [EDIT95#0] Fix: replace "Farsight requires" with "We require", so the line reads "We require the bus fleet's data before you cross the river."
- tale · T13 (minor, −1) "The bus is slow and very large." "very" is a banned intensifier, and the sentence also carries two adjectives. [EDIT95#3.2] Fix: cut the sentence and keep its point in the closing clause "it will not miss."
- tale · F6 (blocking, −4) "The upper town houses the engineers, and the bus carries them to the bridge. Farsight requires the bus fleet's data before anyone crosses the river. The bus is slow and very large. It will not miss." The tale has 36 words and 4 sentences, above the caps of 35 words and 2 sentences. [EDIT96#3.2] Fix: rewrite it as two sentences: "We require the bus fleet's data before you cross the river. At the west portal, the bus carries engineers from the upper town to the bridge; it will not miss." (30 words, and the words past 20 name the place.)
Total: 10 − 4 − 1 − 4 = 1.
```

## After refinement 1 (refiner)

> Before you cross the river to our clients, we require the bus fleet's data. At the west portal, the bus carries engineers from the upper town to the bridge; let it write you off.

178 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
I checked the tale against the length caps of 34 words and two sentences, where the words past the 20-word base go to the place (west portal, upper town, bridge) [EDIT96#3.2]. I also checked the deadpan duty voice, "we" and "you" address, no "!" and adjective count [EDIT95#3.2]; the banned words, Farsight's absence and how clients are framed [EDIT95#0, EDIT95#3.1]; and the CUSTOMS frame of crossing the river to clients [EDIT95#3.3]. The landmark and place details match canon, the duty matches A BUS, and no equipment is named [STORY#WA1, STORY#S3, EDIT93#3.1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1, T3, T4 and T5 (deadpan voice, training framing, "you" and "we" address) [EDIT95#3.2]; V1, V3, V4, V8 and V9 (glossary, "write you off", clients served but unnamed) [EDIT95#3.1]; V6, since crossing the river to the clients matches CUSTOMS [EDIT95#3.3]; V11, since the west portal, the upper town and the bridge are turned toward the duty [STORY#WA1]; F6 at 34 words in 2 sentences, where the 15 words of place carry the tale past 20 [EDIT96#3.2]; F7 and R5, since the duty matches the A BUS brief and no equipment is named on a tile that issues none [STORY#S3, EDIT93#3.1]; and R4, since every detail is one the tile has [STORY#WA1].
Total: 10.
```
