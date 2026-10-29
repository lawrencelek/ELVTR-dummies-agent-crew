# ending · V8 ending · Prototype 7.13 ending, for Prototype 8

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 38.9 s · $0.3179. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage.

184 characters.

### Evaluation 1: 1/10

Lint evidence:

- ending · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- ending · F6 (blocking) 32 words > 20 (style.v2.text.maxWords); 5 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- ending · V1 (blocking, −4) "A Farsight drone carries you over the river to a container ship." Farsight is the publisher and may appear only in the Credits, so it cannot name the drone. [EDIT95#0] Fix: replace "A Farsight drone" with "A Corporation drone".
- ending · F6 (blocking, −4) "Your model has passed. It will now be manufactured. A Farsight drone carries you over the river to a container ship. Destination: a market far away. Please remain still for the voyage." The text has 32 words in 5 sentences, but the limit is 20 words in 2 sentences. [EDIT95#3.2] Fix: cut to two sentences and at most 20 words, for example "Your model has passed, and will be manufactured for our clients. A Corporation drone carries you to the ship."
- ending · V6 (major, −2) "Destination: a market far away." The CERTIFIED ending must say the model is made for clients, and Certified dummies ship to their clients, not to an unnamed market. [EDIT95#3.3] Fix: name the clients as the purpose, for example "will be manufactured for our clients", and drop "a market far away".
Total: 10 − 4 − 4 − 2 = 1.
```

## After refinement 1 (refiner)

> Your model has passed and will be manufactured for our clients. A Corporation drone carries you to the ship.

108 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None.

I checked the ending for tone and voice: deadpan, no "!", no more than one adjective per sentence, the training frame, and addressing the trainee as "you" and the company as "our" ([EDIT95#3.2], [PLAY#PS0]). I checked vocabulary: no banned words, "Corporation drone" as named in [EDIT95#4.2], and clients served without being named ([EDIT95#3.1]). I checked length: 2 sentences and 19 words ([EDIT95#3.2]). I checked the story frame: the model is manufactured for clients and ships out ([EDIT95#3.3]). I found no violations.
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked the ending against T1–T5 and T13 (deadpan, no "!", training frame, "you" and "our", no adjectives), V1, V3, V4, V6, V8 and V9 (no banned words, "Corporation drone" as set, CERTIFIED frame, clients served and unnamed), F5 and F6 (2 sentences, 19 words, no digits), and R4 (drone and ship as in the ending canon) [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [EDIT95#4.2] [STORY#S5].
Total: 10.
```
