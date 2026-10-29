# Prototype 8.1's text on Style Guide V2.3

Run `20261029-172610-v81`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE_V2.md`.

Prototype 8.1 (GDD Edit 96). Stage 1: Prototype 7.13's 27 tales, as shipped, on V2.3 (a tale may run to 35 words), and the unused CBD and Campus districts' text (`districts`, notices n27–n33). Stage 2 (`review`): the story with Prototype 8's act lines, ending and six opening lines, as one batch. Stage 3 (`review-2`): the same batch on V2.4 (no placeholder in a tale). Everything else is Prototype 8's text (run `20261029-161328-v8`).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [tale-monument-A1](tale-monument-A1/trace.md) | V8.1 tale | 2 → 10 → ✓10 | 1 | accepted | $0.5543 |
| [tale-monument-B1](tale-monument-B1/trace.md) | V8.1 tale | 2 → 10 → ✓10 | 1 | accepted | $0.4908 |
| [tale-monument-C1](tale-monument-C1/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.5091 |
| [tale-monument-C2](tale-monument-C2/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5392 |
| [tale-monument-B2](tale-monument-B2/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4698 |
| [tale-monument-A2](tale-monument-A2/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.537 |
| [tale-monument-A3](tale-monument-A3/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4977 |
| [tale-monument-B3](tale-monument-B3/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.5133 |
| [tale-monument-C3](tale-monument-C3/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4252 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4525 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | V8.1 tale | 2 → 10 → ✓10 | 1 | accepted | $0.3867 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.455 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | V8.1 tale | 1 → 10 → ✓8 → 8 → 10 → ✓10 | 3 | accepted | $0.9905 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3886 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | V8.1 tale | 2 → 10 → ✓10 | 1 | accepted | $0.4703 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | V8.1 tale | 1 → 6 → 6 → 10 → ✓10 | 3 | accepted | $1.0471 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4737 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4341 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4442 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.503 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.4459 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4333 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.4318 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | V8.1 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4072 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | V8.1 tale | 4 → 10 → ✓10 | 1 | accepted | $0.4342 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.478 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | V8.1 tale | 1 → 10 → ✓10 | 1 | accepted | $0.448 |
| [districts](districts/trace.md) | V8.1 notices | 1 → 10 → ✓9 → 10 → ✓10 | 2 | accepted | $0.803 |
| [review](review/trace.md) | V8 batch | 7 → 10 → ✓10 | 1 | accepted | $1.0865 |
| [review-2](review-2/trace.md) | V8 batch | 6 → 10 → ✓10 | 1 | accepted | $1.1279 |

30 of 30 accepted at 10/10. Total $16.68.
