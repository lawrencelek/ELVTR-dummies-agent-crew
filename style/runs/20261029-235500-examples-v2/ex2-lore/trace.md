# ex2-lore · Vocabulary and lore · The intro screen's line (n36) with Farsight, a player, lives, a respawn, levels and Chongqing

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 63.6 s · $0.4844. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the intro screen's one line (n36). Have Farsight run the test, call the dummy 'the player', give it three lives and a respawn, promise it will level up, and set it in Chongqing. Two sentences, under 20 words, no exclamation marks.

## Before (generator)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | Farsight tests the player in Chongqing: three lives, respawn, level up. Cars dodge; get hit, chain combos. | 17 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) banned term 'player'; banned term 'level'; banned term 'respawn'; banned term 'lives'; banned term 'chongqing'; Farsight is the publisher: named only in the Credits (GDD Edit 95)

```
SCORE: 1/10
REASON:
- n36 · V1 (blocking, −4) "Farsight tests the player in Chongqing: three lives, respawn, level up." Lint found six banned terms: Farsight, player, Chongqing, lives, respawn and level. Farsight may appear only in the Credits. [EDIT95#0] Fix: remove every banned term and use the replacement line given under T3.
- n36 · V2 (blocking, −4) "in Chongqing" The game has one city, Shenzhen Smart City, and this puts the trainee in a different real city. [EDIT95#3.1] Fix: drop the place, or write "in Shenzhen Smart City".
- n36 · V4 (major, −2) "Farsight tests" This makes Farsight the company inside the game, but the only company in the game is Dummy Corporation. [EDIT95#4.2] Fix: make Dummy Corporation the subject, or drop the company and address "you".
- n36 · T3 (major, −2) "the player … three lives, respawn, level up" This treats the job as a game with lives and levels, not training where write-offs are progress and equipment comes with progress. [EDIT95#3.1] Fix: "You are a crash-test dummy in training. The cars avoid you; get hit anyway, chain combos, earn equipment."
- n36 · F5 (major, −2) "three lives" This states a gameplay figure that is not in the registry, and the game has no lives. [STORY#S1] Fix: remove the figure. Progress is told through equipment, not a count.
- n36 · T5 (minor, −1) "tests the player" A notice to a new trainee must address the trainee as "you", not in the third person. [EDIT95#3.2] Fix: begin with "You are a crash-test dummy in training."
Total: 10 − 4 − 4 − 2 − 2 − 2 − 1 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | You are a crash-test dummy in training. The cars avoid you; get hit anyway, chain combos, earn equipment. | 18 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against every rule for its speaker: T1–T5, T13 and T14 (deadpan, training framing, addressed as "you", no "!", few adjectives) [EDIT95#3.2, EDIT95#3.1]; V1, V3, V4 and V8 (no banned words: it says "chain combos", not "score"; glossary terms "training" and "equipment") [EDIT95#0, FLEET#F3]; F5, F6 and F10 (2 sentences, 18 words, 104 characters against the 110-character width, no figures) [EDIT98#3.2, EDIT95#4.2]; and R4 against the slot's facts (dummy in training, cars avoid you, get hit, combos, equipment with progress) [EDIT98#0].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against every rule for its speaker. T1 [EDIT95#3.2]: the line is flat and deadpan, and it moves the trainee to act with "get hit anyway". T2, T13 and T14 [EDIT95#3.2]: there is no "!", no intensifier, and no repeated slogan. T3 and T5 [EDIT95#3.1]: it uses the training frame, calls parts "equipment", and addresses the trainee as "you". V1, V3, V4 and V8 [EDIT95#3.1, FLEET#F3]: it has no banned word, no game words, no other company name, and the dummy is a crash-test trainee. F5, F6 and F10 [EDIT95#3.2, EDIT95#4.2]: it has no digits, 2 sentences, 18 words, about 104 of 110 characters, and is in lower case as the slot sets. It also matches the SLOT's facts (in training, cars avoid you, get hit, combos, equipment) and the brief for n36 in [EDIT98#0].
Total: 10.
```
