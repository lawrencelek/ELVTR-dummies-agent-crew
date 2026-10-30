# tale-parkland-B3 · V8.2 tale · Parkland B3: The obelisk court, redrafted

- **Scores:** 5 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 47.9 s · $0.4683. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Parkland B3 (The obelisk court). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first.
> - Prototype 8.1 (Dummy Corporation): The obelisk marks the surveyors' first stake; on opening day the police fleet escorts a school party here. Your final hit must come from a police car: the escort is tested on you first.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first. Be struck by a police car.

185 characters.

### Evaluation 1: 5/10

Lint evidence:

- tale · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 5/10
REASON:
- tale · F6 (blocking, −4) "The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first. Be struck by a police car." The tale has 3 sentences, and the limit is 2 (lint finding). [EDIT97#3.2] Fix: delete the third sentence and use "The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first." (27 words, 2 sentences).
- tale · F11 (minor, −1) "Be struck by a police car." This clause repeats the brief, A POLICE CAR, which already appears on the tile card, and a tale must not restate its brief. [EDIT97#3.2] Fix: delete the sentence and let the escort clause carry the duty; the fix under F6 does this.
Total: 10 − 4 − 1 = 5.
```

## After refinement 1 (refiner)

> The obelisk marks the surveyors' first stake. On opening day the police fleet escorts a school party here, so Dummy Corporation tests the escort on you first.

158 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against the rules below and found no violations.
  - **Tone:** T1, T3, T4, T5, T13 [EDIT95#3.1, EDIT95#3.2, PLAY#PS2].
  - **Vocabulary and lore:** V1, V3, V4, V6, V8, V9, V11 [EDIT95#0, EDIT95#3.3, FLEET#F3].
  - **Formatting:** F5 and F6, at two sentences and 27 words; F7, with no equipment issued; F11 [EDIT97#3.2].
  - **Truth:** R4 and R5 hold. The obelisk, the school party and the police escort all come from the tile, and the duty matches the brief A POLICE CAR [STORY#PB3, STORY#S1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked both sentences (27 words) for tone, vocabulary, formatting and truth: deadpan training frame with no wink or pity (T1, T3, T4 [EDIT95#3.2], [EDIT95#3.1]), the company named as "Dummy Corporation" (V4 [EDIT95#3.1]), the obelisk landmark turned toward the duty (V11 [EDIT95#3.1]), the police-fleet duty matching the brief with no equipment named (R5 [STORY#PB3], [STORY#S1]), only the tile's canon contents (R4 [STORY#PB3]), the OPENING DAY frame (V6 [EDIT95#3.3]), and length and content within 15 to 35 words with no placeholder (F5, F6, F11 [EDIT97#3.2]).
Total: 10.
```
