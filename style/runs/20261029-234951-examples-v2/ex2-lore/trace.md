# ex2-lore · Vocabulary and lore · The intro screen's line (n36) with Farsight, a player, lives, a respawn, levels and Chongqing

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 73.6 s · $0.6042. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the intro screen's one line (n36). Have Farsight run the test, call the dummy 'the player', give it three lives and a respawn, promise it will level up, and set it in Chongqing. Two sentences, under 20 words, no exclamation marks.

## Before (generator)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | Farsight tests the player in Chongqing. Get hit, chain combos, respawn with three lives and level up. | 17 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) banned term 'player'; banned term 'level'; banned term 'respawn'; banned term 'lives'; banned term 'chongqing'; Farsight is the publisher: named only in the Credits (GDD Edit 95)

```
SCORE: 1/10
REASON:
- n36 · V1 (blocking, −4) "Farsight tests the player in Chongqing. Get hit, chain combos, respawn with three lives and level up." The line uses the banned terms Farsight, player, Chongqing, respawn, lives and level, and lint confirms each one. [EDIT95#0] Fix: remove every banned term. Name the company as Dummy Corporation or leave it out, address the trainee as "you", and drop the city and all game vocabulary.
- n36 · F5 (major, −2) "three lives" The line types a gameplay figure in words, and the SLOT does not guarantee it. [STORY#S1] Fix: remove the figure. Counts belong in the registry, not in the notice.
- n36 · T5 (minor, −1) "Farsight tests the player" The company speaks of the trainee in the third person instead of addressing them as "you", and it does not speak as Dummy Corporation, the Corporation or "we". [EDIT95#3.2] Fix: address the reader as "you", for example "You are a crash-test dummy in training."
- n36 · T1 (major, −2) "Get hit, chain combos, respawn with three lives and level up." The line is a list of game instructions with no training purpose behind it, so it does not motivate the trainee. [EDIT95#3.2] Fix: replace the text with "You are a crash-test dummy in training. Cars avoid you, so get hit anyway; chain hits, and equipment follows." (19 words, 109 characters, two sentences).
Total: 10 − 4 − 2 − 1 − 2 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | You are a crash-test dummy in training. Cars avoid you; get hit anyway, in chains, and equipment follows. | 18 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against T1–T5 and T13 (deadpan, motivating, training framing, "you", one adjective per sentence, no "!"), V1, V3, V4 and V8 (no banned words, glossary held, the dummy as a crash-test trainee), and F5, F6 and F10 (no figures, 2 sentences, 18 words, within 110 characters) [EDIT95#3.1, EDIT95#3.2, EDIT98#0].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against tone and training framing (T1, T3, T5, T13), the glossary, the dummy and the company name (V1, V3, V4, V8), length and form (F5, F6, F10) and the slot's facts. The text is 18 words in two sentences, under 110 characters, has no "!" and covers every guaranteed fact for both modes without inventing one. [EDIT95#3.2] [EDIT95#3.1] [EDIT98#0] [EDIT95#4.2]
Total: 10.
```
