# tale-parkland-B2 · V8.1 tale · Prototype 7.13 tale parkland B2, for Prototype 8.1

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 63.0 s · $0.4341. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three.

212 characters.

### Evaluation 1: 1/10

Lint evidence:

- tale · F6 (blocking) 39 words > 35 (style.v2.tale.maxWords); 6 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- tale · F6 (blocking, −4) "Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the cars come round clean, the board applauds the cars. The public prefers the product to the test. Give it a chain of three." The tale is 39 words and 6 sentences, over the limits of 35 words and 2 sentences. [EDIT96#3.2] Fix: Cut it to two sentences and no more than 35 words, for example "Inspection day: Battery 2 is fitted, a second charge. Over the pools the board watches the ring; give our clients a chain to link {n}."
- tale · F5 (major, −2) "a chain of three" This types a gameplay figure, but the brief's number lives in the registry as {n} = story.task.comboHard. [STORY#S1] Fix: Replace it with "a chain to link {n}".
- tale · T1 (major, −2) "When the cars come round clean, the board applauds the cars." This is winking dry-comedy irony from the old narrator, and it does not motivate the trainee. [EDIT95#3.2] Fix: Delete it, and turn the board's watching toward the duty instead, for example "The board watches the ring over the pools."
- tale · V6 (major, −2) "The public prefers the product to the test." OPENING DAY opens the Expo to clients, not to the public. This line restates the replaced Edit 92 turn. [EDIT95#3.3] Fix: Delete the sentence. If the Expo is named, say it opens to clients, for example "the Expo's clients are watching".
Total: 10 − 4 − 2 − 2 − 2 = 1 (floor 1).
```

## After refinement 1 (refiner)

> Battery 2 is fitted: a second charge. The board watches the ring over the pools; carry a chain to link {n} or later, and the Expo opens to clients.

147 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1, T3–T5 and T13 [EDIT95#3.2] [PLAY#PS2], and against V1, V3, V6, V8, V9 and V11, including the landmark "the ring over the pools" turned toward the duty [EDIT95#3.1] [EDIT95#3.3] [STORY#PB2]. I checked the length cap of two sentences and 35 words under F6, the fitting of Battery 2 under F7, and the {n} placeholder under F5 [EDIT96#3.2] [STORY#S1]. I checked R4 and R5: the chain matches the COMBO brief, Battery 2 is issued on this tile, and the Expo opens to clients when the park's last tile passes [STORY#S3] [EDIT95#3.3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against Tone T1, T3–T5 and T13; Vocabulary V1–V4, V6, V8, V9 and V11; Formatting F5–F7; and Truth R4–R5. It runs two sentences and 29 words. It names the tile's landmark, "the ring over the pools", and puts it to the duty. It fits Battery 2 on the tile that issues it, and its duty matches the COMBO ×{n} brief (link {n} or later). It keeps the OPENING DAY frame, with the Expo opening to clients as the park passes, and it uses no exclamation marks or intensifiers. [EDIT96#3.2, EDIT95#3.1, EDIT95#3.2, EDIT95#3.3, STORY#S1, STORY#S3, STORY#PB2]
Total: 10.
```
