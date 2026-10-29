# intro-line · V8.3 notices · The intro line (n36), a hand draft through the loop

- **Scores:** 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 4 · 59.5 s · $0.4517. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new player what to do, in both modes. Quirky but obvious. Facts: you are a crash-test dummy; you want the cars to hit you; the cars avoid you; combos score more; upgrades come with progress | Self-driving cars are designed never to hit anyone. Prove the design wrong, in combos, and earn upgrades. | 17 |

### Evaluation 1: 8/10

```
SCORE: 8/10
REASON:
- n36 · T3 (major, −2) "Prove the design wrong, in combos, and earn upgrades." This sets the dummy against the cars in a contest and pays it in rewards, not training and equipment, which is the framing EDIT95 used when it replaced the "Fool them into hitting you" title. [EDIT95#3.1, EDIT95#4.2] Fix: "Self-driving cars are designed never to hit anyone. Your training: get hit, in combos, and earn your parts."
Total: 10 − 2 = 8.
```

## After refinement 1 (refiner)

| Notice | Where | Text | Words |
|---|---|---|---|
| n36 | the intro screen, under DUMMIES, before the mode select: the one line that tells a new player what to do, in both modes. Quirky but obvious. Facts: you are a crash-test dummy; you want the cars to hit you; the cars avoid you; combos score more; upgrades come with progress | Self-driving cars are designed never to hit anyone. Your training: get hit, in combos, and earn your parts. | 18 |

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against T1 to T5 and T13 (deadpan, about training, addresses "you", one adjective per sentence) [EDIT95#3.2, EDIT95#3.3, PLAY#PS2]; V1 to V4, V8 and V9 (no banned words, no other company, the dummy is not a person or competitor, no clients) [EDIT95#0, EDIT95#3.1, FLEET#F3]; F5, F6 and F10 (no digits, 2 sentences, 18 words, 107 of 110 characters, sentence case as the slot sets) [EDIT95#4.2, EDIT98#3.2]; and R4 and R5 against the slot's facts: the cars avoid you, you want to be hit, combos, and parts earned as you progress [STORY#S1, STORY#S3].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I checked n36 against tone (T1 deadpan and motivating, T2, T3 training framing, T4, T5 "you", T13 one adjective per sentence) [EDIT95#3.2, EDIT95#3.1, PLAY#PS2]; vocabulary (V1 banned words, V2, V3 glossary, V4 no company name needed, V8 dummy as trainee, not competitor) [EDIT95#0, FLEET#F3]; format (F5 no figures, F6 two sentences and 18 words, F10 no placeholders to keep, within the slot's 110 characters) [EDIT95#4.2, EDIT96#3.2]; and truth against the SLOT's facts (cars avoid you, you want to be hit, combos, progress brings upgrades) [EDIT98#0].
Total: 10.
```
