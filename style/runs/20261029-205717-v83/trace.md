# Prototype 8.3's text on Style Guide V2.7

Run `20261029-205717-v83`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE_V2.md`.

Prototype 8.3 (GDD Edit 98). Stage 1 on V2.7: 26 tales cut to 15 to 20 words from Prototype 8.2's; 10 briefs rewritten as goals; n36 and n37 written by the generator. The user's own lines (U1: Monument A1's tale, the any goal, n03, n34) are placed as written. Stage 2 (`review`): the story with the opening lines as one batch, the user's lines locked. Stage 3 (`intro-line`): n36 redrafted by hand for humour, then evaluated and refined. Everything else is Prototype 8.2's text (run `20261029-181530-v82`).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [tale-monument-B1](tale-monument-B1/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.6284 |
| [tale-monument-C1](tale-monument-C1/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.603 |
| [tale-monument-C2](tale-monument-C2/trace.md) | V8.3 tale | 10 → ✓10 | 0 | accepted | $0.3594 |
| [tale-monument-B2](tale-monument-B2/trace.md) | V8.3 tale | 10 → ✓10 | 0 | accepted | $0.3174 |
| [tale-monument-A2](tale-monument-A2/trace.md) | V8.3 tale | 10 → ✓10 | 0 | accepted | $0.3389 |
| [tale-monument-A3](tale-monument-A3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.6895 |
| [tale-monument-B3](tale-monument-B3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.642 |
| [tale-monument-C3](tale-monument-C3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.6188 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | V8.3 tale | 6 → 6 → 6 → 10 → ✓10 | 3 | accepted | $1.1877 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5669 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.6603 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4591 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4263 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4604 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | V8.3 tale | 6 → 2 → 8 → 10 → ✓10 | 3 | accepted | $1.0527 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4814 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5207 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | V8.3 tale | 6 → 8 → 10 → ✓10 | 2 | accepted | $0.7637 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | V8.3 tale | 6 → 9 → 9 → 10 → ✓10 | 3 | accepted | $1.1953 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4594 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4838 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4457 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4974 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.417 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.5091 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | V8.3 tale | 6 → 10 → ✓10 | 1 | accepted | $0.4709 |
| [brief-dash](brief-dash/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3577 |
| [brief-drop](brief-drop/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3984 |
| [brief-jump](brief-jump/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3567 |
| [brief-level](brief-level/trace.md) | V8.3 goal | 8 → 6 → 10 → ✓10 | 2 | accepted | $0.5826 |
| [brief-cone](brief-cone/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3607 |
| [brief-push](brief-push/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.351 |
| [brief-bounce](brief-bounce/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3653 |
| [brief-struck](brief-struck/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3808 |
| [brief-combo](brief-combo/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3598 |
| [brief-cls](brief-cls/trace.md) | V8.3 goal | 8 → 10 → ✓10 | 1 | accepted | $0.3854 |
| [notices-83](notices-83/trace.md) | V8.3 notices | 1 → 10 → ✓10 | 1 | accepted | $0.5843 |
| [review](review/trace.md) | V8 batch | 6 → 8 → 9 → 10 → ✓10 | 3 | accepted | $2.4963 |
| [intro-line](intro-line/trace.md) | V8.3 notices | 8 → 10 → ✓10 | 1 | accepted | $0.4517 |

39 of 39 accepted at 10/10. Total $22.69.
