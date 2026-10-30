# Prototype 8.2's tales on Style Guide V2.5

Run `20261029-181530-v82`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE_V2.md`.

Prototype 8.2 (GDD Edit 97). Stage 1: each tale redrafted by the generator from Prototype 7.13's and 8.1's versions, at the length the tile needs (15 to 35 words), then evaluated and refined on V2.5. Stage 2 (`review`): the story with the act lines, ending and six opening lines, as one batch. Stage 3 (`arcade-grades`): the two texts Arcade's grades add (n34, n35). Stage 4 (`review-2`): the batch again on V2.6 (F11: the shortest tale that keeps the tile). Everything else is Prototype 8.1's text (run `20261029-172610-v81`).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [tale-monument-A1](tale-monument-A1/trace.md) | V8.2 tale | 10 → ✓10 | 0 | accepted | $0.2669 |
| [tale-monument-B1](tale-monument-B1/trace.md) | V8.2 tale | 10 → ✓10 | 0 | accepted | $0.4149 |
| [tale-monument-C1](tale-monument-C1/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5051 |
| [tale-monument-C2](tale-monument-C2/trace.md) | V8.2 tale | 9 → 10 → ✓10 | 1 | accepted | $0.6562 |
| [tale-monument-B2](tale-monument-B2/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.576 |
| [tale-monument-A2](tale-monument-A2/trace.md) | V8.2 tale | 6 → 9 → 10 → ✓10 | 2 | accepted | $0.8259 |
| [tale-monument-A3](tale-monument-A3/trace.md) | V8.2 tale | 4 → 10 → ✓10 | 1 | accepted | $0.5392 |
| [tale-monument-B3](tale-monument-B3/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.648 |
| [tale-monument-C3](tale-monument-C3/trace.md) | V8.2 tale | 10 → ✓10 | 0 | accepted | $0.2226 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | V8.2 tale | 10 → ✓10 | 0 | accepted | $0.2321 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4556 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | V8.2 tale | 7 → 10 → ✓10 | 1 | accepted | $0.5348 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | V8.2 tale | 5 → 10 → ✓10 | 1 | accepted | $0.4683 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | V8.2 tale | 10 → ✓6 → 10 → ✓10 | 1 | accepted | $0.5067 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | V8.2 tale | 6 → 8 → 10 → ✓10 | 2 | accepted | $0.8125 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | V8.2 tale | 6 → 4 → 10 → ✓10 | 2 | accepted | $0.8324 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | V8.2 tale | 2 → 10 → ✓10 | 1 | accepted | $0.5375 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | V8.2 tale | 3 → 10 → ✓10 | 1 | accepted | $0.5831 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | V8.2 tale | 5 → 10 → ✓10 | 1 | accepted | $0.4969 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.56 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.6262 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | V8.2 tale | 4 → 10 → ✓10 | 1 | accepted | $0.6854 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | V8.2 tale | 9 → 10 → ✓10 | 1 | accepted | $0.4465 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | V8.2 tale | 5 → 10 → ✓10 | 1 | accepted | $0.4988 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.474 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | V8.2 tale | 8 → 10 → ✓10 | 1 | accepted | $0.57 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | V8.2 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5023 |
| [review](review/trace.md) | V8 batch | 4 → 10 → ✓10 | 1 | accepted | $1.1802 |
| [arcade-grades](arcade-grades/trace.md) | V8.2 notices | 6 → 8 → 8 → 10 → ✓10 | 3 | accepted | $1.182 |
| [review-2](review-2/trace.md) | V8 batch | 7 → 8 → 10 → ✓10 | 2 | accepted | $1.8001 |

30 of 30 accepted at 10/10. Total $18.64.
