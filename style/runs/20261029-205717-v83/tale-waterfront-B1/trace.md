# tale-waterfront-B1 · V8.3 tale · Waterfront B1, cut to 15 to 20 words

- **Scores:** 6 → 9 → 9 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 3 refinement(s).
- **Calls:** 8 · 102.3 s · $1.1953. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients.

159 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 31 words > 20 (style.v2.tale.maxWords)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "The tunnel runs north under the hill: cars go in, and data comes back. Legs 3 is fitted: the longest flight; jump into a car, and your data serves our clients." This tale runs 31 words, but the cap is 20 (style.v2.tale.maxWords). Edit 98 withdrew the 35-word cap from Edit 97. [EDIT98#3.2] Fix: "Cars enter the tunnel under the hill; data returns. Legs 3 is fitted: jump into a car, for our clients." (20 words, two sentences, keeps the landmark, Legs 3, the jump and the clients).
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> Cars enter the tunnel under the hill; data comes back. Legs 3 is fitted: jump into a car for clients.

101 characters.

### Evaluation 2: 9/10

```
SCORE: 9/10
REASON:
- tale · F11 (minor, −1) "jump into a car for clients" This clause restates the brief, JUMP INTO A CAR, and the rule bars a tale from repeating it. [EDIT97#3.2] Fix: replace the clause with an image of the equipment: "Cars enter the tunnel under the hill; data comes back. Legs 3 is fitted: your longest flight, for clients." (18 words)
Total: 10 − 1 = 9.
```

## After refinement 2 (refiner)

> Cars enter the tunnel under the hill; data comes back. Legs 3 is fitted: your longest flight, for clients.

106 characters.

### Evaluation 3: 9/10

```
SCORE: 9/10
REASON:
- tale · F11 (minor, −1) "Legs 3 is fitted: your longest flight, for clients." The tale keeps the place, the equipment and a detail, but leaves out the duty: the brief's jump into a car is only hinted at by "flight". [EDIT97#3.2] Fix: "Cars enter the tunnel under the hill; data comes back. Legs 3 is fitted: jump into one at the portal." (19 words, two sentences)
Total: 10 − 1 = 9.
```

## After refinement 3 (refiner)

> Cars go into the tunnel under the hill, and data comes back. Legs 3 is fitted: jump into one.

93 characters.

### Evaluation 4: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against T1–T5 and T13 [EDIT95#3.2, PLAY#PS2]. It names the tunnel portal and the hill, turns them toward the jump [V11, EDIT95#3.1], and fits ACT III · CUSTOMS [V6, EDIT95#3.3]. It fits F6 and F11 at 19 words and 2 sentences [EDIT98#3.2, EDIT97#3.2]. It names Legs 3, which this tile issues [F7, STORY#WB1], and its duty matches the brief [R5, STORY#S3, EDIT93#3.1]. It uses no banned or glossary-breaking words and no placeholders [V1, V3, F5, FLEET#F2].
Total: 10.
```

### Confirmation 5: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against every Dummy Corporation rule and found no violation. Lint reported nothing, and "3" is a part rank, which the rules allow. It has 19 words in two sentences (F6, [EDIT98#3.2]). It names the landmark and its hill, and turns the tunnel's traffic toward the duty (V11, [EDIT95#3.1], [STORY#WB1], [DECISIONS#rows-311-320~2] rows 313 and 317). It names Legs 3 on the tile that issues it (F7, R5, [STORY#S1], [EDIT93#3.1]). Its duty matches the JUMP INTO A CAR brief, in the in-voice form the guide gives (R5, [STORY#S3]). Every fact comes from WB1's canon (R4, [STORY#WB1]). The tone is deadpan and uses no adjectives, no "!" and no banned or game words (T1–T5, T13, V1, V3, [EDIT95#3.2], [PLAY#PS0]).
Total: 10.
```
