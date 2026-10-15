# DUMMIES — GDD Edit 32: Generated Interface

**Generated · 2026-10-15 · run `20261015-013357` · Proposed**

- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p1/content/interface.json`.
- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.
- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.

## Parameters (prototype-only)

| ID | Value | Unit | Purpose |
|---|---:|---|---|
| `proto.ui.barkSeconds` | 2.5 | s | How long a vehicle bark tag stays beside its car. |
| `proto.ui.barkCooldown` | 4 | s | Minimum gap after a bark before any car may bark again. |

## HUD

| Column | Module | Title | 中文 (review) | Rows |
|---|---|---|---|---|
| left | BODY | BODY | 机体 (pending) | Subject / chassis (`subject.chassis`); Setting / health (`body.difficulty`); Chassis health (`body.health`); Lunge reach (`body.reach`) |
| left | CHARGE | CHARGE | 充能 (pending) | Lunge charge (`body.charge`) |
| left | FLEET | FLEET | 车队 (pending) | Model / stop distance (`fleet.models`); Red: stop line learned (`fleet.note`) |
| right | CONTRACT | CONTRACT | 合约 (pending) | Road (`contract.road`); Write-offs (`contract.writeOffs`) |
| right | SHIFT | SHIFT | 班次 (pending) | Admitted (`shift.admitted`); On road (`shift.onRoad`); Next admission (`shift.next`); Active time (`clock.active`) |
| right | RECORD | RECORD | 记录 (pending) | Points (`record.points`); Body credits (`record.credits`) |

## Cue key

| Cue | Label | Meaning |
|---|---|---|
| intention | Chevron | The car has noticed you. Its plan is not fixed. |
| committed | Closed ring | The car has fixed its route and will hold it unless interrupted. |
| expiring | Opening ring | The commitment is ending. Less than one action window remains. |
| interrupted | Red broken ring | The car's route was interrupted. It is braking for safety. |
| caution | Grey triangle | The car is cautious and slowing past you. |
| braking | Brake marks | The car is slowing. |
| spent | Spent slash | This appearance cannot award another impact. |
| honk | HONK bubble | The car has been blocked for some time and is warning you. |
| blind | BLIND wedge | Sensor shadow. Cars cannot sense you here. |
| view | View cone | Where you resolve sensor information. |

## Copy deck

| Key | Text |
|---|---|
| `intro[0]` | Road {road} of {roads}: {roadName}. Write-offs required: {quota}. |
| `intro[1]` | {difficulty} chassis, health {health}. Please produce an impact. |
| `denied.lunge` | Lunge declined. Charge or recovery incomplete. |
| `denied.pickup` | Nothing within reach to carry. |
| `denied.drop` | No legal room ahead. Cone retained. |
| `denied.throw` | No legal room to throw. Cone retained. |
| `toast.touch-spent` | Appearance already assessed. No damage. No points. |
| `toast.drone-dispatch` | FARSIGHT drone dispatched. Obstruction will be relocated. |
| `toast.purchase` | {node} will be installed on the next chassis. |
| `toast.learn-standoff` | {model} revised its stop line to {metres} m. |
| `toast.refusal-locked` | Refusal is unavailable until one body is completed. |
| `report.eyebrow` | WRITE-OFF REPORT |
| `report.title` | Chassis {chassis} written off. |
| `report.line` | Write-off {n} of {quota}. Points this body: {points}. |
| `report.cleared` | {roadName} cleared. Points this body: {points}. Next: {nextRoad}, write-offs required: {nextQuota}. |
| `report.credit` | One body credit granted. Balance: {credits}. |
| `report.continue` | Press A to proceed to the shop. |
| `shop.eyebrow` | MODIFICATION SERVICES |
| `shop.title` | Modifications install on the next chassis. |
| `shop.deploy` | Deploy next chassis |
| `shop.bank` | Keep {credits} in credit. Deploy next chassis |
| `shop.nodes.hips` | Face new directions faster. Deliberate turns take less time. |
| `shop.nodes.spine` | Steer your lunge while it is in progress. Only slightly. |
| `shop.nodes.carry` | Press B to pick up and place a cone. Movement slows while carrying. |
| `shop.nodes.throw` | Tap B to throw a held cone. Hold B to drop. |
| `endings.Licensed` | Contract complete. FARSIGHT thanks you for your cooperation. |
| `endings.Failed test` | Traffic exhausted. Contract incomplete. Please retry. |
| `endings.Non-compliant` | Testing declined. Your refusal has been recorded. |
| `frame.district` | SHENZHEN NEW ECONOMIC ZONE · LOGISTICS ROAD TEST |
| `frame.districtZh` | 深圳新经济区 · 物流道路测试 |

## Barks

| Event | When | Line |
|---|---|---|
| `impact` | {"stopped": true} | I stopped. I was compliant. Log that. |
| `impact` | {"stopped": false} | {model} hit. {lost} health lost. That goes on my record. |
| `touch-spent` | {} | I'm already on the form. Hands off. |
| `honk` | {"at": "body"} | Move it! I have a delivery window. |
| `commit` | {"man": "shift"} | Pulling out. Rank does not wait for obstacles. |
| `commit` | {"man": "brake"} | Stopping. Slowly. Politely. |
| `interrupt` | {} | Plan cancelled. My supervisor will hear of this. |
| `unstick` | {"how": "reverse"} | Reversing. I am not paid to back up. |
| `unstick` | {"how": "replan"} | Replanning. On my own time. |
| `admit` | {"model": "VAN-02"} | Crates due this shift. Entering the zone. |
| `admit` | {"model": "SEDAN-01"} | Courier run. Entering the zone. |
