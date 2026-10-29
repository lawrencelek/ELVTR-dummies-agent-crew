# tale-waterfront-A3 · V8.1 tale · Prototype 7.13 tale waterfront A3, for Prototype 8.1

- **Scores:** 4 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 56.4 s · $0.4342. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road.

198 characters.

### Evaluation 1: 4/10

Lint evidence:

- tale · F6 (blocking) 4 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 4/10
REASON:
- tale · F6 (blocking, −4) "The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ONE UNIT · PURPOSE DESTRUCTION. You were shipped here to be tested. Honour the declaration on the raised road." The tale has 4 sentences; the limit is 2 (lint fact). Its 32 words are within the 35-word tale cap. [EDIT96#3.2] Fix: cut it to two sentences, e.g. "The west customs post logs every chassis bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road."
- tale · V6 (major, −2) "ORIGIN OVERSEAS … You were shipped here to be tested." This makes customs the dummy's arrival from abroad. Under Act III's frame, customs is where Certified dummies ship out to clients across the river. It also clashes with Act I, where the trainee comes off the factory floor. This line comes from Edit 92's customs log, which EDIT95 replaces. [EDIT95#3.3] Fix: drop "ORIGIN OVERSEAS" and "You were shipped here to be tested". Point the log outward to the clients, as in the F6 fix: "The west customs post logs every chassis bound for clients across the river."
Total: 10 − 4 − 2 = 4.
```

## After refinement 1 (refiner)

> At the west customs post, the log lists every dummy bound for clients across the river. Your entry reads PURPOSE DESTRUCTION; honour it on the raised road.

155 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked against the tone rules T1–T5, T13 and T14 [EDIT95#3.2] [EDIT95#3.1] [PLAY#PS2]. Also checked the glossary, the CUSTOMS story frame, clients and landmark rules V1, V3, V6, V8, V9 and V11 [EDIT95#3.1] [EDIT95#3.3] [STORY#S2]. Length and equipment rules F5–F7 passed: 27 words in two sentences, no equipment named and none issued here [EDIT96#3.2] [STORY#WA3]. Tile and brief truth rules R4–R5 passed: the west customs post and its log are on this tile, and the raised-road duty matches ON A RAISED ROAD [STORY#WA3] [STORY#S3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
All rules for Dummy Corporation's voice are met:
  - **Length and form (F6):** the tale has two sentences and 27 words, the extra words name the place, and lint found nothing [EDIT96#3.2].
  - **Tone (T1, T2, T4, T5, T13):** it is flat and motivating, has no "!", treats the sacrifice as an honour with no pity, speaks to "you", and has no more than one adjective per sentence [EDIT95#3.2].
  - **Banned words, city and glossary (V1–V3):** none are broken [EDIT95#3.1].
  - **Story frame (V6):** dummies are bound for clients across the river, which fits CUSTOMS [EDIT95#3.3].
  - **Clients (V9):** clients are served and never seen [EDIT95#3.1].
  - **Place (V11):** the tale names the west customs post and its log, and turns them toward the duty [EDIT95#3.1].
  - **Equipment (F7):** none is named, which is correct because this tile issues none [STORY#WA3].
  - **Tile truth (R4):** the tale names only what the tile has [STORY#WA3].
  - **Duty (R5):** the raised road matches the brief ON A RAISED ROAD [STORY#S3].
Total: 10.
```
