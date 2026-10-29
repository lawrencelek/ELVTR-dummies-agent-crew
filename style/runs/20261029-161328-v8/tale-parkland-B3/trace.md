# tale-parkland-B3 · V8 tale · Prototype 7.13 tale parkland B3, for Prototype 8

- **Scores:** 1 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 80.1 s · $0.6036. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first.

192 characters.

### Evaluation 1: 1/10

Lint evidence:

- tale · V1 (blocking) Farsight is the publisher: named only in the Credits (GDD Edit 95)
- tale · F6 (blocking) 34 words > 20 (style.v2.text.maxWords); 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- tale · V1 (blocking, −4) "Farsight would like to know" Farsight is the publisher and must not be named in any in-game text, only in the Credits. [EDIT95#0] Fix: remove Farsight. The company speaks as "we" or "Dummy Corporation", or not at all.
- tale · F6 (blocking, −4) "The obelisk marks the surveyors' first stake. A school party will visit it on opening day, escorted by the police fleet. Farsight would like to know how the police fleet handles a dummy first." The tale has 34 words in 3 sentences, over the limit of 20 words and 2 sentences. [EDIT95#3.2] Fix: replace with "On opening day, police escort a school party to the obelisk. Your final hit comes from them first." (18 words, 2 sentences).
- tale · T1 (major, −2) "would like to know how the police fleet handles a dummy first" This is a procedural observation and gives the trainee no reason to do the job, so it fails the rule that a notice must motivate. [EDIT95#3.2] Fix: end on the duty, stated flatly as a step in training: "Your final hit comes from them first."
- tale · T5 (minor, −1) "handles a dummy" The trainee is called "a dummy" in the third person instead of "you". [EDIT95#3.2] Fix: address the trainee as "you" or "your", as in the replacement above.
Total: 10 − 4 − 4 − 2 − 1 = −1, floored to 1.
```

## After refinement 1 (refiner)

> On opening day, the police fleet escorts a school party to the obelisk. They train on you first.

96 characters.

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- tale · V3 (major, −2) "They train on you first." The style guide defines training as your job, but this line makes the police fleet the trainees and you their equipment, and "They" could also refer to the school party. [EDIT95#3.1] Fix: "On opening day, the police fleet escorts a school party to the obelisk. Your training meets them first."
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

> On opening day, police escort a school party to the obelisk. Take a police car's hit first.

91 characters.

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1–T5 and T13 (flat voice, no "!", training framing, implied "you", no intensifiers), V1–V9 (no banned words; the school party and police escort appear in narration only), F5–F7 (2 sentences, 17 words, no figures, no equipment issued on this tile), and R4–R5 (the obelisk is the tile's landmark, and the duty matches the brief A POLICE CAR) [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [STORY#PB3] [STORY#S3] [EDIT93#3.1].
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against the length cap of 17 words in two sentences [EDIT95#3.2], the deadpan voice with no "!" and no extra adjectives [EDIT95#3.2], the training frame and OPENING DAY with its school party [EDIT95#3.3, STORY#PB3], the banned words and company name [EDIT95#0, EDIT95#3.1], the obelisk landmark [STORY#PB3], the police-car duty against the brief with no equipment named on a tile that issues none [STORY#S3, EDIT93#3.1], and LINT, which found nothing.
Total: 10.
```
