# Prototype 8's text on Style Guide V2

Run `20261029-161328-v8`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE_V2.md`.

Each piece starts as Prototype 7.13 shipped it. The evaluator grades it on V2; the refiner rewrites it; the accepted text goes to Prototype 8. Stage 1 (45 pieces) ran on V2.0. Stage 2 (`story-batch`) runs the story's 31 texts together, on V2.1 (T14, V10). Stage 3 (`arcade-banners`) runs Arcade's district banners, found by the text audit. Stage 4 (`review`) runs the story with the six opening lines, on V2.2 (V11).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [act-monument](act-monument/trace.md) | V8 act | 4 → 10 → ✓10 | 1 | accepted | $0.391 |
| [tale-monument-A1](tale-monument-A1/trace.md) | V8 tale | 2 → 10 → ✓10 | 1 | accepted | $0.4651 |
| [tale-monument-B1](tale-monument-B1/trace.md) | V8 tale | 2 → 10 → ✓10 | 1 | accepted | $0.4103 |
| [tale-monument-C1](tale-monument-C1/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4411 |
| [tale-monument-C2](tale-monument-C2/trace.md) | V8 tale | 4 → 10 → ✓10 | 1 | accepted | $0.4696 |
| [tale-monument-B2](tale-monument-B2/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4733 |
| [tale-monument-A2](tale-monument-A2/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.424 |
| [tale-monument-A3](tale-monument-A3/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.3932 |
| [tale-monument-B3](tale-monument-B3/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3905 |
| [tale-monument-C3](tale-monument-C3/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3647 |
| [act-parkland](act-parkland/trace.md) | V8 act | 2 → 10 → ✓10 | 1 | accepted | $0.34 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.355 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | V8 tale | 2 → 10 → ✓10 | 1 | accepted | $0.3438 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | V8 tale | 4 → 8 → 10 → ✓10 | 2 | accepted | $0.6221 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | V8 tale | 1 → 8 → 10 → ✓10 | 2 | accepted | $0.6036 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3401 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | V8 tale | 2 → 10 → ✓10 | 1 | accepted | $0.4266 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.3881 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | V8 tale | 4 → 10 → ✓10 | 1 | accepted | $0.402 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4053 |
| [act-waterfront](act-waterfront/trace.md) | V8 act | 8 → 10 → ✓10 | 1 | accepted | $0.3042 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.3842 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | V8 tale | 4 → 10 → ✓10 | 1 | accepted | $0.4435 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | V8 tale | 4 → 10 → ✓10 | 1 | accepted | $0.3781 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3912 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | V8 tale | 4 → 10 → ✓10 | 1 | accepted | $0.3675 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | V8 tale | 6 → 8 → 6 → 10 → ✓10 | 3 | accepted | $0.8135 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | V8 tale | 6 → 10 → ✓10 | 1 | accepted | $0.3717 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | V8 tale | 1 → 10 → ✓10 | 1 | accepted | $0.4064 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | V8 tale | 2 → 10 → ✓10 | 1 | accepted | $0.3821 |
| [brief-any](brief-any/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1208 |
| [brief-dash](brief-dash/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1085 |
| [brief-drop](brief-drop/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1173 |
| [brief-jump](brief-jump/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1015 |
| [brief-level](brief-level/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1032 |
| [brief-cone](brief-cone/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1013 |
| [brief-push](brief-push/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1107 |
| [brief-bounce](brief-bounce/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1021 |
| [brief-struck](brief-struck/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.116 |
| [brief-combo](brief-combo/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.1064 |
| [brief-cls](brief-cls/trace.md) | V8 brief | 10 → ✓10 | 0 | accepted | $0.107 |
| [ending](ending/trace.md) | V8 ending | 1 → 10 → ✓10 | 1 | accepted | $0.3179 |
| [notices](notices/trace.md) | V8 notices | 1 → 10 → ✓10 | 1 | accepted | $0.5992 |
| [barks](barks/trace.md) | V8 barks | 1 → 10 → ✓10 | 1 | accepted | $0.6258 |
| [credits](credits/trace.md) | V8 credits | 10 → ✓10 | 0 | accepted | $0.1093 |
| [story-batch](story-batch/trace.md) | V8 batch | 5 → 8 → 10 → ✓10 | 2 | accepted | $1.7012 |
| [arcade-banners](arcade-banners/trace.md) | V8 notices | 1 → 10 → ✓6 → 10 → ✓10 | 2 | accepted | $0.9187 |
| [review](review/trace.md) | V8 batch | 1 → 8 → 10 → ✓10 | 2 | accepted | $1.7204 |

48 of 48 accepted at 10/10. Total $19.88.
