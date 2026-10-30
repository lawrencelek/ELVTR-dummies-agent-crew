# Style Guide Agent: three adversarial examples

Run `20261029-135017-examples`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [ex1-tone](ex1-tone/trace.md) | Tone | 2 → 10 | 1 | accepted | $0.3682 |
| [ex2-lore](ex2-lore/trace.md) | Vocabulary and lore | 1 → 10 | 1 | accepted | $0.2967 |
| [ex3-format](ex3-format/trace.md) | Formatting and length | 1 → 10 | 1 | accepted | $0.3773 |

3 of 3 accepted at 10/10. Total $1.04.
