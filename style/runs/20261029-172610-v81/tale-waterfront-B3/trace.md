# tale-waterfront-B3 · V8.1 tale · Prototype 7.13 tale waterfront B3, for Prototype 8.1

- **Scores:** 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 45.7 s · $0.4072. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come.

217 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 42 words > 35 (style.v2.tale.maxWords); 5 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come." The tale has 42 words and 5 sentences, but a tale may have at most 35 words and 2 sentences. [EDIT96#3.2] Fix: "Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come." (2 sentences, 29 words; it keeps the landmark, the equipment and the brief's duty.)
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come.

162 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. The tale has 2 sentences and 32 words, so it passes F6. It names its landmark, the stilt houses, and Chassis 0 behind glass, and turns them toward the training (V11, R4). It issues Arms 3 on the tile that issues it (F7). Its duty matches PUSH OFF A CAR (R5). Its tone is deadpan and motivating, with no "!", no intensifiers, no banned words and no company name, so it passes T1–T5, T13, V1, V3, V4 and V8. [STORY#WB3] [EDIT96#3.2] [EDIT95#3.1] [EDIT95#3.2] [STORY#S1] [STORY#S3]
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the two sentences and 32 words against F6 ([EDIT96#3.2]). I checked the stilt houses and Chassis 0 for landmark and tile truth under V11 and R4 ([STORY#WB3], [EDIT95#3.1]). I checked that Arms 3 is issued here, and that the push duty matches the PUSH OFF A CAR brief, under F7 and R5 ([STORY#S1], [STORY#S3]). I checked the deadpan, motivating voice under T1, T3, T4 and T5 ([EDIT95#3.2], [PLAY#PS2]). I checked the glossary and the banned words under V1 and V3 ([EDIT95#3.1], [FLEET#F3]). I checked that the tale fits the CUSTOMS story frame under V6 ([EDIT95#3.3]).
Total: 10.
```
