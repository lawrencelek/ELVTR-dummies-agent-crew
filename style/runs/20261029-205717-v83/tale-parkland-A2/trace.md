# tale-parkland-A2 · V8.3 tale · Parkland A2, cut to 15 to 20 words

- **Scores:** 6 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 45.1 s · $0.4604. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off.

154 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 33 words > 20 (style.v2.tale.maxWords)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off." At 33 words, the tale is over the 20-word cap for tales (lint finding). [EDIT98#3.2] Fix: "The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: let a cone-baited car take you." (19 words, two sentences; keeps the dome, the duty, Hands 2 and the showroom detail).
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> The dome is the Expo's showroom; you are the exhibit. Hands 2 is fitted: bait a car with a cone.

96 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked against the tone rules T1, T3, T4, T5 and T13: the line is deadpan and frames the dummy as the Expo's product, with no adjectives. The duty matches the CONE-BAITED CAR brief and Hands 2 is fitted on the tile that issues it (V8, F7, R5). It names the dome, a landmark the tile has (V11, R4). It is 20 words in two sentences, with "2" allowed as a part rank (F5, F6, F11). [EDIT95#3.1, EDIT95#3.2, EDIT98#3.2, STORY#PA2, STORY#S1]
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. Checked the 20-word, two-sentence length (F6, F11; [EDIT98#3.2], [EDIT97#3.2]); the "Hands 2" part rank, which is allowed (F5, F7; [STORY#S1]); the dome as the Expo's showroom (V11, R4; [STORY#PA2]); the cone-baiting duty against the brief (R5; [STORY#S3]); the OPENING DAY frame (V6; [EDIT95#3.3]); and the deadpan voice with the trainee as product (T1–T5, V8; [EDIT95#3.1], [EDIT95#3.2]).
Total: 10.
```
