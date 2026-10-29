# notices-83 · V8.3 notices · The intro line (n36) and Arcade's goal (n37)

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 58.3 s · $0.5843. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write n36 and n37. n36: one line for the intro screen that tells a new player what to do. The user's draft, to make funnier while keeping it obvious: 'Find new ways to make the cars hit you. Combo bonuses and upgrades await. Make Dummy Corporation proud.' n37: Arcade's goal, simple and direct, with {Q} for the write-offs per grade.

## Before (generator)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new player what to do, in both modes. Quirky but obvious. Facts: you are a crash-test dummy; you want the cars to hit you; the cars avoid you; combos score more; upgrades come with progress | Get hit by cars, who would rather not. Combos score more, upgrades follow. Make Dummy Corporation proud. | 17 |
| n37 | Arcade's level card, the goal line under the district's line, in bold after '>>>': what to do in an Arcade shift. Facts: write off bodies; every {Q} write-offs the grade rises (tougher chassis, denser traffic); the run ends when the shift's vehicles run out; the score is the points. {Q} is the district's quota, a placeholder the game fills | Write off bodies. Every {Q} write-offs, the grade rises. Score points until the vehicles run out. | 16 |

### Evaluation 1: 1/10

Lint evidence:

- items[0] · V1 (blocking) banned term 'score'
- items[0] · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)
- items[1] · V1 (blocking) banned term 'score'
- items[1] · F6 (blocking) 3 sentences > 2 (style.v2.text.maxSentences)

```
SCORE: 1/10
REASON:
- n36 · V1 (blocking, −4) "Combos score more" uses the banned term "score" in an in-game text. [FLEET#F2] Fix: "Combos count for more".
- n36 · F6 (blocking, −4) "Get hit by cars, who would rather not. Combos score more, upgrades follow. Make Dummy Corporation proud." has 3 sentences, above the limit of 2. [EDIT95#3.2] Fix: "Get hit by cars, who would rather not. Combos count for more; upgrades follow."
- n37 · V1 (blocking, −4) "Score points until the vehicles run out." uses the banned term "score" in an in-game text. [FLEET#F2] Fix: "Earn points until the vehicles run out."
- n37 · F6 (blocking, −4) "Write off bodies. Every {Q} write-offs, the grade rises. Score points until the vehicles run out." has 3 sentences, above the limit of 2. [EDIT95#3.2] Fix: "Write off bodies; every {Q} write-offs, the grade rises. Earn points until the vehicles run out."
Total: 10 − 4 − 4 − 4 − 4 = 1.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new player what to do, in both modes. Quirky but obvious. Facts: you are a crash-test dummy; you want the cars to hit you; the cars avoid you; combos score more; upgrades come with progress | You are a crash-test dummy. Cars avoid you: get hit anyway, combos count more, and upgrades follow. | 17 |
| n37 | Arcade's level card, the goal line under the district's line, in bold after '>>>': what to do in an Arcade shift. Facts: write off bodies; every {Q} write-offs the grade rises (tougher chassis, denser traffic); the run ends when the shift's vehicles run out; the score is the points. {Q} is the district's quota, a placeholder the game fills | Write off bodies; every {Q} write-offs, the grade rises. Earn points until the vehicles run out. | 16 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 and n37 against these rules and found no violations:
  - **Length and form (F6, F10, F5):** n36 is 17 words in two sentences. n37 is 16 words in two sentences, opens with an imperative, and keeps {Q} exactly as given. [EDIT98#3.2, EDIT95#3.2, EDIT95#4.2]
  - **Voice (T1–T5, T13, T14):** both lines are deadpan, use no "!", address "you", use no intensifiers and repeat no phrase. [EDIT95#3.2, PLAY#PS0]
  - **Vocabulary (V1–V4):** no banned word, other city, car brand or other company name appears. "Points" is canon and not the banned "score". [EDIT95#3.1, FLEET#F2, EDIT26#9.1]
  - **Truth (R4):** each line states only the slot's facts. n36 covers the crash-test dummy, cars that avoid you, combos and upgrades. n37 covers the {Q} grade rise and the shift ending when the vehicles run out. [EDIT97#7, EDIT98#0]
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 and n37 against all the notice rules and found no violation. Both are deadpan, use no "!" and frame the job as training [EDIT95#3.2, EDIT95#3.1]. Neither uses a banned word or names a company, city or brand [EDIT95#0, FLEET#F2]. Both meet the length and placeholder rules: n36 has 17 words and n37 has 16, each in two sentences, and n37 keeps {Q} [EDIT95#3.2, EDIT95#4.2]. Both match the slot's facts, using the grade, quota, points and end condition as written [EDIT97#7, EDIT26#9.1].
Total: 10.
```
