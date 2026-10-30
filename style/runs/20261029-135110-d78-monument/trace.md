# D78 proposal: tile barks for Monument

Run `20261029-135110-d78-monument`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`. Stage 1 runs the loop per tile; stage 2 (`batch`) runs it on the district's lines together.

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [MA1](MA1/trace.md) | D78 tile barks | 2 → 10 | 1 | accepted | $0.4438 |
| [MB1](MB1/trace.md) | D78 tile barks | 10 | 0 | accepted | $0.2382 |
| [MC1](MC1/trace.md) | D78 tile barks | 9 → 10 | 1 | accepted | $0.5029 |
| [MC2](MC2/trace.md) | D78 tile barks | 5 → 10 | 1 | accepted | $0.5653 |
| [MB2](MB2/trace.md) | D78 tile barks | 2 → 10 | 1 | accepted | $0.4659 |
| [MA2](MA2/trace.md) | D78 tile barks | 10 | 0 | accepted | $0.2135 |
| [MA3](MA3/trace.md) | D78 tile barks | 10 | 0 | accepted | $0.2086 |
| [MB3](MB3/trace.md) | D78 tile barks | 9 → 9 → 10 | 2 | accepted | $0.7034 |
| [MC3](MC3/trace.md) | D78 tile barks | 10 | 0 | accepted | $0.1925 |
| [batch](batch/trace.md) | D78 batch | 9 → 1 → 10 | 2 | accepted | $1.5231 |

10 of 10 accepted at 10/10. Total $5.06.
