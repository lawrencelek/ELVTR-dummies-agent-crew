# D78 proposal: tile barks for Monument

Run `20261029-153953-d78-monument`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`. Stage 1 runs the loop per tile; stage 2 (`batch`) runs it on the district's lines together.

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [MA1](MA1/trace.md) | D78 tile barks | 10 → ✓10 | 0 | accepted | $0.2175 |
| [MB1](MB1/trace.md) | D78 tile barks | 2 → 10 → ✓10 | 1 | accepted | $0.5318 |
| [MC1](MC1/trace.md) | D78 tile barks | 10 → ✓6 → 10 → ✓10 | 1 | accepted | $0.5926 |
| [MC2](MC2/trace.md) | D78 tile barks | 6 → 10 → ✓10 | 1 | accepted | $0.5219 |
| [MB2](MB2/trace.md) | D78 tile barks | 1 → 10 → ✓10 | 1 | accepted | $0.4932 |
| [MA2](MA2/trace.md) | D78 tile barks | 5 → 10 → ✓10 | 1 | accepted | $0.4977 |
| [MA3](MA3/trace.md) | D78 tile barks | 2 → 10 → ✓10 | 1 | accepted | $0.504 |
| [MB3](MB3/trace.md) | D78 tile barks | 9 → 10 → ✓10 | 1 | accepted | $0.4735 |
| [MC3](MC3/trace.md) | D78 tile barks | 5 → 10 → ✓10 | 1 | accepted | $0.4941 |
| [batch](batch/trace.md) | D78 batch | 8 → 10 → ✓10 | 1 | accepted | $0.8863 |

10 of 10 accepted at 10/10. Total $5.21.
