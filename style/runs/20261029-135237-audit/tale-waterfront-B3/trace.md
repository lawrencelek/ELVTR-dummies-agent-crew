# tale-waterfront-B3 · audit · shipped tale waterfront B3

- **Scores:** 9/10 → 10/10. **Accepted** after 1 refinement(s).
- **Calls:** 3 · 37.4 s · $0.4202. Models: generator sonnet, evaluator opus, refiner opus.

## Before (input)

> The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Show Chassis 0 how far the model has come.

217 characters.

### Evaluation 1: 9/10

```
SCORE: 9/10
REASON:
- tale · F7 (minor, −1) "Show Chassis 0 how far the model has come." The tale ends on an imperative, but the imperative never states the duty (push off one car so the next car makes the final hit), so the duty part of the shape is missing. [STORY#MB3] Fix: change the last sentence to "Push off one car into the next, for Chassis 0." (221 characters in total).
Total: 10 − 1 = 9.
```

## After refinement 1 (refiner)

> The stilt houses are older than the city, kept as heritage. Behind glass in one of them stands Chassis 0, the prototype before you. A ship is moored beyond. Arms 3 is fitted. Push off one car into the next, for Chassis 0.

221 characters.

### Evaluation 2: 10/10

```
SCORE: 10/10
REASON:
- None. I checked the tale against all of Farsight's rules and found no breaks:
  - **Tone:** dry staff-notice tone, no "!", employment framing, no comment on harm, and the dummy addressed as "you" (T1–T5; EDIT92#3, EDIT39#4.1.1, STORY#S2).
  - **Act frame:** the moored ship fits Act III CUSTOMS (V6; EDIT92#3).
  - **Glossary:** "Chassis 0" and "the prototype" follow the glossary and the shipped tale (V3; FLEET#F3).
  - **Length:** 221 characters, under the 223 limit, with no sentence over 19 words (F6; lint clean).
  - **Shape:** place, dry fact, "Arms 3 is fitted.", then the duty in the imperative (F7; STORY#MB3).
  - **Digits:** "Arms 3" is a part rank and "Chassis 0" is allowed in narration (F5).
  - **Tile:** the stilt houses, Chassis 0 and the ship all belong to this tile (R4; STORY#WB3, EDIT92#7).
  - **Brief:** the duty matches PUSH OFF A CAR, and Arms 3 is issued on this tile (R5; STORY#S3, STORY#S1).
Total: 10.
```
