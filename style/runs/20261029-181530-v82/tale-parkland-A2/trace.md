# tale-parkland-A2 · V8.2 tale · Parkland A2: The dome by the canal, redrafted

- **Scores:** 6 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 7 · 71.7 s · $0.8125. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Redraft the tale for Parkland A2 (The dome by the canal). Two earlier versions are source material: use any of their facts and jokes, copy neither whole.
> - Prototype 7.13 (Farsight's voice; Farsight must not appear): The dome is the Expo's showroom. The canal beside it cools the highway's footings; the ducks are registered volunteers. Hands 2 is fitted: two cones. Lay them where the visitors will walk, and see who stops.
> - Prototype 8.1 (Dummy Corporation): The dome by the canal is the Expo's showroom, readied for our clients. Hands 2 is fitted: lay a cone, and let the car that answers it write you off.
> Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. Name the place, keep the duty and any equipment the tile issues, and point the place at the training.

## Before (generator)

> The dome is the Expo's showroom, and the canal beside it cools the highway's footings. The ducks are registered volunteers. Hands 2 is fitted: lay a cone, and let the car that answers it write you off.

201 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 37 words > 35 (style.v2.tale.maxWords); 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The dome is the Expo's showroom, and the canal beside it cools the highway's footings. The ducks are registered volunteers. Hands 2 is fitted: lay a cone, and let the car that answers it write you off." At 37 words and three sentences, the tale breaks both the 35-word cap and the two-sentence cap (lint). [EDIT97#3.2] Fix: Cut the middle sentence: "The dome is the Expo's showroom, and the canal beside it cools the highway's footings. Hands 2 is fitted: lay a cone, and let the car that answers it write you off." (32 words, two sentences)
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> The dome is the Expo's showroom, and the canal beside it cools the highway's footings. Hands 2 is fitted: lay a cone, and let the car that answers it write you off.

164 characters.

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- tale · V11 (major, −2) "The dome is the Expo's showroom, and the canal beside it cools the highway's footings." This sentence names the landmark, but it only describes it: the dome and canal never connect to the duty or the training, and the cone duty in the second sentence happens nowhere in particular. [EDIT95#3.1] Fix: "The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off." (32 words, two sentences)
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

> The dome is the Expo's showroom, and you are what it will show. Hands 2 is fitted: lay a cone by the canal, and let the car that answers it write you off.

154 characters.

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked against the tale's rules: length is 33 words in two sentences (F6, [EDIT97#3.2]). It names the dome and the canal as its place and points them at the duty (V11, R4, [EDIT95#3.1], [STORY#PA2]). It names Hands 2 on the tile that issues it (F7, R5, [STORY#S1]). Its cone-baited final hit matches the brief ([STORY#S3]). The showroom fits the OPENING DAY frame (V6, [EDIT95#3.3]). It has a deadpan, product-framed voice with no "!", no intensifiers and no banned words (T1–T5, T13, V1, V3, V8, [EDIT95#3.2], [EDIT95#0]). There is no placeholder or padding (F5, F11).
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1–T5, T13, T14, V1–V4, V6, V8–V11, F5–F7, F11, R4 and R5. It is 33 words in two sentences. It names its landmark, the dome and the canal [STORY#PA2]. It is fitted to the OPENING DAY frame and frames the dummy as the product the Expo will show [EDIT95#3.3, EDIT95#3.1]. It names the issued Hands 2 [EDIT93#3.1]. It matches the cone brief [STORY#S3]. It states the write-off plainly, without pity or a wink [EDIT95#3.2, EDIT97#3.2].
Total: 10.
```
