# tale-parkland-A1 · V8.3 tale · Parkland A1, cut to 15 to 20 words

- **Scores:** 6 → 2 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 3 refinement(s).
- **Calls:** 8 · 114.3 s · $1.0527. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: teach them by pushing off one car into the next.

160 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 31 words > 20 (style.v2.tale.maxWords)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The gardener tends the three terraced pools by hand and asks that cars stop before the water. Arms 2 is fitted: teach them by pushing off one car into the next." At 31 words, the tale runs past the 20-word cap for tales. [EDIT98#3.2] Fix: "The gardener asks that cars stop before her pools. Arms 2 is fitted: push off one, and teach the next." (20 words, two sentences; keeps the pools and the gardener, Arms 2, and the push-off-one-car duty.)
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> The gardener asks that cars stop before her pools. Arms 2 is fitted; teach them by pushing one car into the next.

113 characters.

### Evaluation 2: 2/10

Lint evidence:

- tale · F6 (blocking) 22 words > 20 (style.v2.tale.maxWords)

```
SCORE: 2/10
REASON:
- tale · F6 (blocking, −4) "The gardener asks that cars stop before her pools. Arms 2 is fitted; teach them by pushing one car into the next." The tale is 22 words, and a tale may run 15 to 20 words. [EDIT98#3.2] Fix: "The gardener asks that cars stop before her pools. Arms 2 is fitted; push off one car into the next." (20 words).
- tale · R5 (blocking, −4) "teach them by pushing one car into the next" This says the dummy shoves one car into another, but the brief is to push off one car so that the next car makes the final hit. [STORY#S3] Fix: replace the clause with "push off one car into the next", the wording Parkland C1 uses for the same brief [EDIT93#3.1/tales-rewritten~1].
Total: 10 − 4 − 4 = 2.
```

## After refinement 2 (refiner)

> The gardener asks that cars stop before her pools. Arms 2 is fitted; push off one car into the next.

100 characters.

### Evaluation 3: 8/10

```
SCORE: 8/10
REASON:
- tale · V11 (major, −2) "The gardener asks that cars stop before her pools. Arms 2 is fitted; push off one car into the next." The tale names the place (the gardener and her pools) and states the duty. Nothing links the two, so the place is never turned toward the duty or the training. [EDIT95#3.1] Fix: "The gardener asks cars to stop short of her pools. Arms 2 is fitted; teach them, pushing one into the next." (20 words, two sentences, duty and Arms 2 kept, per STORY#PA1).
Total: 10 − 2 = 8.
```

## After refinement 3 (refiner)

> The gardener's pools need cars that stop. Teach them with Arms 2: push off one car into the next.

97 characters.

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked the tale against T1–T5, T13 and T14; V1–V4, V6 and V8–V11; F5–F7 and F11; and R4–R5. It runs to 19 words in two sentences with no "!" ([EDIT98#3.2], [EDIT95#3.2]). The gardener's pools are a detail from the reservoir terraces that leads into the duty ([EDIT95#3.1], [STORY#PA1]). Arms 2 is named on the tile that issues it ([STORY#S1]). The push into the next car matches the PUSH OFF A CAR brief, and the cars are framed as colleagues in training ([STORY#S3], [EDIT95#3.3]).
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations. I checked the tale against F6: it runs 19 words in two sentences. "Arms 2" is allowed under F5 because a part rank may appear in Dummy Corporation's text. Under V11 and R4, "the gardener's pools" is a canon detail of the reservoir terraces [STORY#PA1]. Under F7 and R5, Arms 2 is named on the tile that issues it, and the tale's duty matches the brief: push off one car into the next [STORY#S3, STORY#S1]. The tale also keeps the deadpan, motivating tone and the training frame, with the cars as colleagues to be taught (T1–T5, T13) [EDIT95#3.1, EDIT95#3.2, EDIT95#3.3]. It uses no banned words or other company name (V1–V4), and its length suits a tile with one image (F11) [EDIT97#3.2, EDIT98#3.2].
Total: 10.
```
