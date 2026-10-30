# Audit: Farsight's shipped copy

Run `20261029-135237-audit`. Loop: generate → evaluate → refine → evaluate, until 10/10 or 3 refinements (`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.

Every shipped tale, brief, act line and the ending through the loop. A 10/10 needs no refinement. The refined text stays in this run (decision 542).

| Case | Class | Scores | Refinements | Result | Cost |
|---|---|---|---|---|---|
| [act-monument](act-monument/trace.md) | audit | 10 | 0 | accepted | $0.1203 |
| [tale-monument-A1](tale-monument-A1/trace.md) | audit | 10 | 0 | accepted | $0.0219 |
| [tale-monument-B1](tale-monument-B1/trace.md) | audit | 10 | 0 | accepted | $0.1308 |
| [tale-monument-C1](tale-monument-C1/trace.md) | audit | 10 | 0 | accepted | $0.1344 |
| [tale-monument-C2](tale-monument-C2/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4408 |
| [tale-monument-B2](tale-monument-B2/trace.md) | audit | 10 | 0 | accepted | $0.024 |
| [tale-monument-A2](tale-monument-A2/trace.md) | audit | 10 | 0 | accepted | $0.141 |
| [tale-monument-A3](tale-monument-A3/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4057 |
| [tale-monument-B3](tale-monument-B3/trace.md) | audit | 10 | 0 | accepted | $0.14 |
| [tale-monument-C3](tale-monument-C3/trace.md) | audit | 10 | 0 | accepted | $0.1352 |
| [act-parkland](act-parkland/trace.md) | audit | 10 | 0 | accepted | $0.02 |
| [tale-parkland-C1](tale-parkland-C1/trace.md) | audit | 10 | 0 | accepted | $0.1316 |
| [tale-parkland-C2](tale-parkland-C2/trace.md) | audit | 10 | 0 | accepted | $0.127 |
| [tale-parkland-C3](tale-parkland-C3/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4254 |
| [tale-parkland-B3](tale-parkland-B3/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4074 |
| [tale-parkland-A3](tale-parkland-A3/trace.md) | audit | 10 | 0 | accepted | $0.1318 |
| [tale-parkland-A2](tale-parkland-A2/trace.md) | audit | 10 | 0 | accepted | $0.131 |
| [tale-parkland-A1](tale-parkland-A1/trace.md) | audit | 6 → 10 | 1 | accepted | $0.3182 |
| [tale-parkland-B1](tale-parkland-B1/trace.md) | audit | 10 | 0 | accepted | $0.145 |
| [tale-parkland-B2](tale-parkland-B2/trace.md) | audit | 10 | 0 | accepted | $0.0289 |
| [act-waterfront](act-waterfront/trace.md) | audit | 10 | 0 | accepted | $0.1122 |
| [tale-waterfront-A1](tale-waterfront-A1/trace.md) | audit | 9 → 10 | 1 | accepted | $0.5002 |
| [tale-waterfront-B1](tale-waterfront-B1/trace.md) | audit | 9 → 10 | 1 | accepted | $0.5292 |
| [tale-waterfront-C1](tale-waterfront-C1/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4742 |
| [tale-waterfront-C2](tale-waterfront-C2/trace.md) | audit | 10 | 0 | accepted | $0.1329 |
| [tale-waterfront-C3](tale-waterfront-C3/trace.md) | audit | 10 | 0 | accepted | $0.1915 |
| [tale-waterfront-B3](tale-waterfront-B3/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4202 |
| [tale-waterfront-A3](tale-waterfront-A3/trace.md) | audit | 10 | 0 | accepted | $0.1335 |
| [tale-waterfront-A2](tale-waterfront-A2/trace.md) | audit | 10 | 0 | accepted | $0.1614 |
| [tale-waterfront-B2](tale-waterfront-B2/trace.md) | audit | 9 → 10 | 1 | accepted | $0.4254 |
| [brief-any](brief-any/trace.md) | audit | 10 | 0 | accepted | $0.1106 |
| [brief-dash](brief-dash/trace.md) | audit | 10 | 0 | accepted | $0.094 |
| [brief-drop](brief-drop/trace.md) | audit | 10 | 0 | accepted | $0.1062 |
| [brief-jump](brief-jump/trace.md) | audit | 10 | 0 | accepted | $0.0939 |
| [brief-level](brief-level/trace.md) | audit | 10 | 0 | accepted | $0.0957 |
| [brief-cone](brief-cone/trace.md) | audit | 10 | 0 | accepted | $0.0934 |
| [brief-push](brief-push/trace.md) | audit | 10 | 0 | accepted | $0.095 |
| [brief-bounce](brief-bounce/trace.md) | audit | 10 | 0 | accepted | $0.0949 |
| [brief-struck](brief-struck/trace.md) | audit | 10 | 0 | accepted | $0.0949 |
| [brief-combo](brief-combo/trace.md) | audit | 10 | 0 | accepted | $0.095 |
| [brief-cls](brief-cls/trace.md) | audit | 10 | 0 | accepted | $0.0954 |
| [ending](ending/trace.md) | audit | 10 | 0 | accepted | $0.0995 |

42 of 42 accepted at 10/10. Total $7.81.
