# tale-waterfront-A1 · V8.3 tale · Waterfront A1, cut to 15 to 20 words

- **Scores:** 6 → 8 → 10 → ✓10 (✓ = a fresh confirming evaluation). **Accepted** after 2 refinement(s).
- **Calls:** 6 · 71.8 s · $0.7637. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients.

168 characters.

### Evaluation 1: 6/10

Lint evidence:

- tale · F6 (blocking) 29 words > 20 (style.v2.tale.maxWords)

```
SCORE: 6/10
REASON:
- tale · F6 (blocking, −4) "At the west portal, the bus carries the upper town's engineers to the bridge. Dummy Corporation requires the bus fleet's data before you cross the river to our clients." At 29 words, the tale is over the 20-word cap for tales. [EDIT98#3.2] Fix: "The bus carries engineers through the west portal to the bridge. Meet it before you cross to our clients." (19 words, two sentences; keeps the landmark, the bus duty and the CUSTOMS crossing).
Total: 10 − 4 = 6.
```

## After refinement 1 (refiner)

> The bus carries engineers through the west portal to the bridge. Stand in its path, then cross to our clients.

110 characters.

### Evaluation 2: 8/10

```
SCORE: 8/10
REASON:
- tale · V6 (major, −2) "Stand in its path, then cross to our clients." The CUSTOMS frame says only Certified dummies cross the river to clients, but this line has a trainee on tile 1 of 9 cross straight after one bus hit, which skips Certification. [EDIT95#3.3] Fix: "The bus carries engineers through the west portal to the bridge. Stand in its path; Certified, you cross to our clients." (20 words, two sentences)
Total: 10 − 2 = 8.
```

## After refinement 2 (refiner)

> The bus carries engineers through the west portal to the bridge. Take its hit; Certified dummies cross to our clients.

118 characters.

### Evaluation 3: 10/10

```
SCORE: 10/10
REASON:
- None. I found no violations. I checked the tale against these rules:
  - **Length (F6, F11):** 20 words in two sentences, which is within the 15 to 20 word range [EDIT98#3.2].
  - **Place (V11, R4):** it names the west portal and its bus of engineers going to the bridge [STORY#WA1], [DECISIONS#rows-311-320~2].
  - **Duty (R5):** "Take its hit" matches the bus brief [STORY#S3].
  - **Equipment (F7):** it names no equipment, which is correct because this tile issues none [EDIT93#3.1].
  - **Story frame (V6, V9):** it keeps the CUSTOMS frame, with Certified dummies crossing to clients who are served but not seen [EDIT95#3.3], [EDIT95#3.1].
  - **Tone and voice (T1–T5, T13):** it is deadpan, motivating and uses "our" for the company, with at most one adjective per sentence and no "!" [EDIT95#3.2].
  - **Vocabulary (V1–V4):** it uses no banned words and does not name Farsight [EDIT95#0].
Total: 10.
```

### Confirmation 4: 10/10

```
SCORE: 10/10
REASON:
- None.
I checked the tale against T1–T5 and T13 (flat, motivating imperative, no "!", few adjectives), V1–V4 and V6–V11 (no banned words, CUSTOMS frame and glossary held, clients served and unseen, the west portal named and turned to the duty), F5–F7 and F11 (20 words, two sentences, no placeholder or figure, no equipment due, no padding), and R4–R5 (the bus and the portal on the west bridge are on this tile, and the duty matches the bus brief) [EDIT95#3.1] [EDIT95#3.2] [EDIT95#3.3] [EDIT98#3.2] [EDIT97#3.2] [STORY#WA1] [STORY#S3] [EDIT93#3.1] [DECISIONS#rows-311-320~2].
Total: 10.
```
