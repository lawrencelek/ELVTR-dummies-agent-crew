# Audit: Farsight's shipped copy

Run `20261029-154451-audit`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Every shipped tale, brief, act line and the ending through the loop. A 10/10 needs no refinement. The refined text stays in this run (decision 542).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [act-monument](act-monument/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1108 |
| [tale-monument-A1](tale-monument-A1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0393 |
| [tale-monument-B1](tale-monument-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1244 |
| [tale-monument-C1](tale-monument-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1364 |
| [tale-monument-C2](tale-monument-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1488 |
| [tale-monument-B2](tale-monument-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0424 |
| [tale-monument-A2](tale-monument-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1509 |
| [tale-monument-A3](tale-monument-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1342 |
| [tale-monument-B3](tale-monument-B3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1499 |
| [tale-monument-C3](tale-monument-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1258 |
| [act-parkland](act-parkland/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0353 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1278 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.122 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1542 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | audit | 10 → ✓9 → 10 → ✓10 | 1 | accepted | $0.3776 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1226 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1513 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | audit | 6 → 10 → ✓10 | 1 | accepted | $0.3181 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1484 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0587 |
| [act-waterfront](act-waterfront/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1021 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1389 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.175 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1441 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1454 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1387 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1425 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0518 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1661 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0647 |
| [brief-any](brief-any/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1272 |
| [brief-dash](brief-dash/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0284 |
| [brief-drop](brief-drop/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1167 |
| [brief-jump](brief-jump/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1029 |
| [brief-level](brief-level/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1072 |
| [brief-cone](brief-cone/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1053 |
| [brief-push](brief-push/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1089 |
| [brief-bounce](brief-bounce/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1059 |
| [brief-struck](brief-struck/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1056 |
| [brief-combo](brief-combo/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0323 |
| [brief-cls](brief-cls/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1074 |
| [ending](ending/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0396 |

42 of 42 accepted at 10/10. Total $5.14.
