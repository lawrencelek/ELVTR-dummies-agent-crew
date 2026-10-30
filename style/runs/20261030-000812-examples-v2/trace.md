# Style Guide Agent: three adversarial examples on Style Guide V2 (Dummy Corporation)

Run `20261030-000812-examples-v2`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE_V2.md`.

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [ex1-tone](ex1-tone/trace.md) | Tone | 1 → 10 → ✓10 | 1 | accepted | $0.717 |
| [ex2-lore](ex2-lore/trace.md) | Vocabulary and lore | 1 → 8 → 10 → ✓10 | 2 | accepted | $0.8871 |
| [ex3-format](ex3-format/trace.md) | Formatting and length | 1 → 10 → ✓10 | 1 | accepted | $0.586 |

3 of 3 accepted at 10/10. Total $2.19.
