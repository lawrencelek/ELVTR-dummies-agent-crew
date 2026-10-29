# tale-waterfront-B3 · V8.2 tale · Waterfront B3: The stilt houses, redrafted

- **Scores:** 5 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 53.1 s · $0.4988. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Waterfront B3 (The stilt houses). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come.
> - Prototype 8.1 (Dummy Corporation): Arms 3 is fitted; push off one car into the next. Behind glass in the stilt houses stands Chassis 0, the prototype before you; show it how far the model has come.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The stilt houses stand older than the city, kept as heritage. Behind glass in one waits Chassis 0, the prototype before you. Arms 3 is fitted: push off one car, then meet the next.

180 characters.

### Evaluation 1: 5/10

Lint evidence:

- tale · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 5/10
REASON:
- tale · F6 (blocking, −4) "The stilt houses stand older than the city, kept as heritage. Behind glass in one waits Chassis 0, the prototype before you. Arms 3 is fitted: push off one car, then meet the next." The tale has 33 words, which is within the 15 to 35 limit, but it has 3 sentences and the limit is 2 (lint finding). [EDIT97#3.2] Fix: join the first two sentences with a semicolon: "The stilt houses are older than the city; behind glass in one waits Chassis 0, the prototype before you."
- tale · F11 (minor, −1) "push off one car, then meet the next" This clause repeats the brief ("Push off one car; the final hit must be the next car") instead of linking the duty to the place. [EDIT97#3.2] Fix: replace the last sentence with "Arms 3 is fitted: show Chassis 0 how far the model has come." This keeps the tale at 2 sentences and 32 words.
Total: 10 − 4 − 1 = 5.
```

## After refinement 1 (refiner)

> The stilt houses are older than the city; behind glass in one stands Chassis 0, the prototype before you. Arms 3 is fitted for the push; show Chassis 0 how far the model has come.

179 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1, T3–T5 and T13 (it is flat, motivating and in the training frame, uses "you" and has one adjective, "older"). I checked V1–V4, V6, V8 and V11 (the stilt houses are named and turned toward the training through Chassis 0). I checked F5–F7 and F11 (two sentences and 35 words, with Arms 3 named as a part rank and no placeholder). I checked R4 and R5 (Chassis 0 belongs to this tile's narration, and the push matches the brief). Chunks: [EDIT95#3.1], [EDIT95#3.2], [EDIT97#3.2], [STORY#WB3], [STORY#S3], [EDIT93#3.1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked: the length is 35 words in two sentences [EDIT97#3.2]. Lint found no "!" and no banned words [EDIT95#0]. "Arms 3" is a part rank in the Corporation's text, which the rules allow [STORY#S1]. The tone is deadpan and motivating [EDIT95#3.2, PLAY#PS2]. The tale names its landmark, the stilt houses, and turns it toward the training [EDIT95#3.1]. It names Arms 3 on the tile that issues it [STORY#WB3, EDIT93#3.1]. The push matches the brief, which is not restated [STORY#S3]. Chassis 0 behind glass is canon for this tile [STORY#WB3].
Total: 10.
```
