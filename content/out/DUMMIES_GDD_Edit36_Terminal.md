# DUMMIES — GDD Edit 36: Generated Terminal

**Generated · 2026-10-15 · run `20261015-085401` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p2/content/terminal.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.term.panelRadius` | 12 | canvas units | Corner radius for every glass panel in the frame. |
| `proto.term.glossHeight` | 16 | canvas units | Height of the top gloss highlight on each glass panel. |
| `proto.term.borderAlpha` | 0.7 | alpha | Opacity of the panel bevel border. |
| `proto.term.shadowBlur` | 10 | canvas units | Blur radius of the soft panel drop shadow. |
| `proto.term.signSeconds` | 6 | s | Time each FARSIGHT notice stays up before it cross-fades to the next. |
| `proto.term.rangeStep` | 20 | canvas units | Spacing of calibration ticks on the field bezel. |

## Header

- **Lockup:** FARSIGHT · SMART CITY · 智慧城市 (pending).
- **Tagline:** A city without accidents.
- **Badges:** ZERO ACCIDENTS · CITY-READY · FRIENDLY BY DESIGN

## Panels

- radius `proto.term.panelRadius`; gloss `proto.term.glossHeight`; border `glass`; borderAlpha `proto.term.borderAlpha`; shadow `proto.term.shadowBlur`; band `True`; bandRole `aqua`

## Icons

| Module | Shapes |
|---|---:|
| BODY | 4 |
| CHARGE | 4 |
| FLEET | 4 |
| CONTRACT | 4 |
| SHIFT | 3 |
| RECORD | 3 |
| BUILD | 3 |

## Texture

- **Diagnostics:** `battery.capacity`, `battery.secondsPerCharge`, `damage.bodyHealth`, `damage.baseImpact`, `movement.lungeDistance`, `movement.runSpeed`, `perception.reactionDelay`, `traffic.timeGap`

## Signage

| EN | 中文 (review) |
|---|---|
| Thank you for choosing a city without accidents. |  |
| Every journey in this district is a certified journey. | 本区每一次出行均已认证。 |
| Calibration marks are provided for your safety and ours. |  |
| This district is monitored for your convenience. | 本区域受到监测,为您提供便利。 |
| Pedestrians are valued participants in the smart city. |  |
| Your feedback helps the fleet serve you better. |  |
| Safety is a shared responsibility. FARSIGHT shares it gladly. |  |
| Logistics roads are open for the benefit of the whole zone. | 物流道路向全区开放。 |

## Title screen

- **Eyebrow:** VISITOR ORIENTATION
- **Line 1:** Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happen.
- **Line 2:** {roads} roads, each certified in turn. Write-offs required: {q1}, {q2}, {q3}. Each lost body buys one modification credit, except the last.
- **Start:** Press A or Space to begin your test.
- **Fragile:** Body health {health}. A short, tidy test.
- **Standard:** Body health {health}. The recommended chassis.
- **Reinforced:** Body health {health}. Built to last, regrettably.
