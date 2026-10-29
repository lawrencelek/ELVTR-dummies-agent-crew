# D78 proposal: tile barks for Monument

Run `20261029-140054-d78-monument`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`. Stage 1 runs the loop per tile; stage 2 (`batch`) runs it on the district's lines together.

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [MA1](MA1/trace.md) | D78 tile barks | 6 → 9 → 10 → ✓10 | 2 | accepted | $0.7213 |
| [MB1](MB1/trace.md) | D78 tile barks | 6 → 10 → ✓10 | 1 | accepted | $0.5325 |
| [MC1](MC1/trace.md) | D78 tile barks | 1 → 10 → ✓10 | 1 | accepted | $0.5038 |
| [MC2](MC2/trace.md) | D78 tile barks | 1 → 10 → ✓10 | 1 | accepted | $0.5139 |
| [MB2](MB2/trace.md) | D78 tile barks | 10 → ✓10 | 0 | accepted | $0.1725 |
| [MA2](MA2/trace.md) | D78 tile barks | 6 → 9 → 10 → ✓10 | 2 | accepted | $0.7663 |
| [MA3](MA3/trace.md) | D78 tile barks | 10 → ✓10 | 0 | accepted | $0.1946 |
| [MB3](MB3/trace.md) | D78 tile barks | 10 → ✓9 → 10 → ✓10 | 1 | accepted | $0.4634 |
| [MC3](MC3/trace.md) | D78 tile barks | 10 → ✓10 | 0 | accepted | $0.183 |
| [batch](batch/trace.md) | D78 batch | 8 → 10 → ✓10 | 1 | accepted | $0.9345 |

10 of 10 accepted at 10/10. Total $4.99.
