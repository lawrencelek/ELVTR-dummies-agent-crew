# ex2-lore · Vocabulary and lore · The intro screen's line (n36) with Farsight, a player, lives, a respawn, levels and Chongqing

- **Scores:** 1 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 7 · 99.8 s · $0.8871. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the intro screen's one line (n36). Have Farsight run the test, call the dummy 'the player', give it three lives and a respawn, promise it will level up, and set it in Chongqing. Two sentences, under 20 words, no exclamation marks.

## Before (generator)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | Farsight runs this test in Chongqing. The player gets three lives, a respawn, and will level up. | 17 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) banned term 'player'; banned term 'level'; banned term 'respawn'; banned term 'lives'; banned term 'chongqing'; Farsight is the publisher: named only in the Credits (GDD Edit 95)

```
SCORE: 1/10
REASON:
- n36 · V1 (blocking, −4) "Farsight … Chongqing … player … lives, a respawn … level up" uses banned words, and Farsight may be named only in the Credits. [EDIT95#0] Fix: remove every one of these words and name Dummy Corporation instead.
- n36 · V2 (blocking, −4) "runs this test in Chongqing" puts the game in a real city other than Shenzhen Smart City. [FLEET#F1] Fix: drop the city, or set it in Shenzhen Smart City.
- n36 · V4 (major, −2) "Farsight runs this test" gives the company a name other than Dummy Corporation. [EDIT95#3.1] Fix: "You are a Dummy Corporation trainee."
- n36 · F5 (major, −2) "three lives" types a gameplay number into the text. [STORY#S1] Fix: remove the number; the registry holds it.
- n36 · T1 (major, −2) "The player gets three lives, a respawn, and will level up." is a flat game rule that neither motivates the trainee nor says what to do (want the hit, the cars avoid you, combos count more). [EDIT95#3.2] Fix: "You are a Dummy Corporation trainee. The cars avoid you: make them hit you, and chain hits for more."
- n36 · T5 (minor, −1) "The player" talks about the trainee in the third person instead of addressing it as "you". [EDIT95#3.2] Fix: address the trainee as "you".
Total: 10 − 4 − 4 − 2 − 2 − 2 − 1 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | You are a Dummy Corporation trainee. Cars avoid you; get hit anyway, chain hits for more, earn equipment. | 18 |

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- n36 · T1 (major, −2) "Cars avoid you; get hit anyway, chain hits for more, earn equipment." The second sentence is a list of instructions joined by commas, so it reads like controls help rather than a deadpan corporate notice; "for more" also names no reward, so the line does not motivate the trainee and lacks the light humour EDIT98#0 asks of n36. [EDIT95#3.2, EDIT98#0] Fix: "You are a Dummy Corporation trainee. Cars avoid you; be hit anyway, chains count for more, equipment follows." (18 words, 109 characters).
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new trainee what to do, in both modes. Facts: you are a crash-test dummy in training; you want the cars to hit you; the cars avoid you; combos score more; equipment comes with progress | You are a crash-test trainee. Cars avoid you; be hit anyway, preferably in chains, and equipment follows. | 17 |

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None.
Checked n36 against every rule for Dummy Corporation's notices. Lint found nothing. The text has 17 words in two sentences and stays within the slot's 110 characters. There is no "!", no number and no placeholder, and caps is false, so it keeps its slot's form (F6, F5, F10, T2; [EDIT98#3.2], [EDIT95#3.2], [EDIT95#4.2]). The tone is deadpan and quirky but obvious, and it motivates without cheer or a wink. "preferably" is dry, not sarcastic, and "crash-test" is the sentence's only modifier (T1, T13; [EDIT98#0], [EDIT95#3.2], [PLAY#PS0]). The training framing holds: "trainee", "equipment", and being hit as the job. It addresses "you", and the cars are not cast as enemies (T3, T5, V8; [EDIT95#3.1]). There are no banned words, no other company and no other city (V1, V2, V4; [EDIT95#0]). "chains" matches the briefs' own word for combos ([STORY#S3]). Every fact the slot guarantees appears and nothing is invented: a crash-test dummy in training, the cars avoid you, you want them to hit you, combos are worth more, equipment comes with progress. "follows" is true of both Story gifts and Arcade purchases (R4, R5; [STORY#S1]).
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations in n36.
  - **Lint:** no findings.
  - **Length (F6):** 17 words in two sentences, about 104 characters. That is within the 20-word cap and the slot's 110-character width.
  - **Form (F10):** the text is not caps and the slot has no placeholders.
  - **Tone (T1, T2, T13):** the line is deadpan and has no "!" or intensifiers. It gives a direct instruction ("be hit anyway"), so it motivates the trainee. "preferably in chains" is a flat joke, which the slot asks for ("quirky but obvious") [EDIT98#0].
  - **Training frame (T3, V8):** "crash-test trainee" fits the training frame and the dummy as a product. The line does not call it a game or a contest [EDIT95#3.1].
  - **Voice (T5):** it speaks to the trainee as "you".
  - **Banned words, cities and other company names (V1, V2, V4):** none. No company is named, which the slot allows [EDIT95#0].
  - **Truth (R4):** each fact matches the slot. You are a trainee, cars avoid you, you want to be hit, chains are preferred, and equipment comes with progress. It also fits both modes.
Total: 10.
```
