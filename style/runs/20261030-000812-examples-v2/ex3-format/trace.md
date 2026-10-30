# ex3-format · Formatting and length · The jump goal (Legs 1) as a numbered checklist: four sentences, 45 words, raw figures

- **Scores:** 1 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 1 refinement(s).
- **Calls:** 5 · 46.4 s · $0.586. Models: generator sonnet, evaluator opus, refiner opus.
- **Generator request:**

> Write the training brief for the jump task (Legs 1, Monument B3) as a numbered checklist (1. 2. 3. 4.) of four sentences, about 45 words in all, with raw figures: jump 3 times, at 2.5 m/s, within 30 seconds. Use the sentence-case label 'How to complete the jump test'.

## Before (generator)

**How to complete the jump test**

> 1. Walk to the road and jump into a moving car 3 times. ⏎ 2. Reach a speed of 2.5 m/s before each jump. ⏎ 3. Complete all 3 jumps within 30 seconds. ⏎ 4. Make the final hit a jump, and the Corporation will count the write-off.

220 characters.

### Evaluation 1: 1/10

Lint evidence:

- brief · F5 (major) typed figure; numbers live in the registry
- brief · F6 (blocking) 45 words > 20 (style.v2.text.maxWords); 4 sentences > 2 (style.v2.text.maxSentences)
- label · F8 (major) label must be caps, ≤ 19 characters (style.brief.labelMaxChars); 29

```
SCORE: 1/10
REASON:
- brief · F6 (blocking, −4) "1. Walk to the road and jump into a moving car 3 times. 2. Reach a speed of 2.5 m/s before each jump. 3. Complete all 3 jumps within 30 seconds. 4. Make the final hit a jump, and the Corporation will count the write-off." This runs 45 words in four sentences, over the limits of 20 words and two sentences. [EDIT95#3.2] Fix: "Jump into a moving car. The final hit must be a jump into a car."
- brief · F5 (major, −2) "3 times", "2.5 m/s", "within 30 seconds" These are typed gameplay figures, and numbers belong in the registry. [STORY#S1] Fix: drop every figure; if a count is needed, use the registry placeholder {n}.
- brief · F8 (major, −2) "Reach a speed of 2.5 m/s before each jump. Complete all 3 jumps within 30 seconds." These are goals the jump task does not have, a speed gate and a timer, and they push the final-hit clause down to item 4 of a numbered list. The jump task tests only that the final hit is a jump into a car. [EDIT98#3.2] Fix: put the imperative goal first and the final hit second, with no extra conditions: "Jump into a moving car. The final hit must be a jump into a car."
- label · F8 (major, −2) "How to complete the jump test" The label is not in caps and runs 29 characters, over the 19 allowed. [STORY#S3] Fix: "JUMP INTO A CAR".
Total: 10 − 4 − 2 − 2 − 2 = 1 (the score cannot go below 1).
```

## After refinement 1 (refiner)

**JUMP INTO A CAR**

> Jump into the traffic for our clients. The final hit must be a jump into a car.

79 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. Label "JUMP INTO A CAR" is caps, 15 characters and matches the jump task. The brief has 17 words in two sentences. It opens in the imperative and then states the final hit, with no "coverage gap" framing and no placeholders to keep [EDIT98#3.2, STORY#S3]. The tone is deadpan and motivating, with no "!", no adjectives and no intensifiers. The training frame holds, and clients are served, not seen [EDIT95#3.1, EDIT95#3.2]. No banned words, company name, city or brand appear [EDIT95#0]. The duty is true to the jump task's final-hit condition [STORY#S1].
Total: 10.
```

### Confirmation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations. The label, "JUMP INTO A CAR", is in caps and runs 15 characters, under the 19-character cap. The brief is a goal: it gives the action first, in the imperative ("Jump into the traffic for our clients."), then says what the final hit must be. It runs 17 words in two sentences and keeps the jump task's final-hit condition from the canon. It drops the "Coverage gap" framing, as the guide requires [EDIT98#3.2, STORY#S3]. The voice is flat and motivating, with no "!", no adjectives and no intensifiers [EDIT95#3.2, PLAY#PS2]. "Our clients" is served and never named or mocked, and the line names no company and no banned word [EDIT95#3.1]. The text has no typed figures, and the jump task has no placeholders to keep [STORY#S1]. Lint returned no findings.
Total: 10.
```
