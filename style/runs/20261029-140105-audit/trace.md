# Audit: Farsight's shipped copy

Run `20261029-140105-audit`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Every shipped tale, brief, act line and the ending through the loop. A 10/10 needs no refinement. The refined text stays in this run (decision 542).

Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [act-monument](act-monument/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1129 |
| [tale-monument-A1](tale-monument-A1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0393 |
| [tale-monument-B1](tale-monument-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1227 |
| [tale-monument-C1](tale-monument-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1335 |
| [tale-monument-C2](tale-monument-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1509 |
| [tale-monument-B2](tale-monument-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.039 |
| [tale-monument-A2](tale-monument-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1515 |
| [tale-monument-A3](tale-monument-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1333 |
| [tale-monument-B3](tale-monument-B3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1476 |
| [tale-monument-C3](tale-monument-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1285 |
| [act-parkland](act-parkland/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0332 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1299 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1215 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1453 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1379 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1254 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1481 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | audit | 6 → 10 → ✓10 | 1 | accepted | $0.3222 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1529 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0541 |
| [act-waterfront](act-waterfront/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.107 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1378 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1711 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1469 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1497 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1421 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1428 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0488 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1595 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0526 |
| [brief-any](brief-any/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.126 |
| [brief-dash](brief-dash/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0305 |
| [brief-drop](brief-drop/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1187 |
| [brief-jump](brief-jump/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1043 |
| [brief-level](brief-level/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1059 |
| [brief-cone](brief-cone/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1064 |
| [brief-push](brief-push/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1085 |
| [brief-bounce](brief-bounce/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1081 |
| [brief-struck](brief-struck/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.108 |
| [brief-combo](brief-combo/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0328 |
| [brief-cls](brief-cls/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.1067 |
| [ending](ending/trace.md) | audit | 10 → ✓10 | 0 | accepted | $0.0437 |

42 of 42 accepted at 10/10. Total $4.89.
