# Trace — juice

Status: **accepted** after 3 critic round(s).

## 1. Retrieval

| Query | Top chunks (BM25 score) |
|---|---|
| juice reference top-down arcade driving games screen shake hit pause permanence | `JUICE#J1` (44.096), `JUICE#J2` (30.922), `LOG#P1.1-observations` (19.413) |
| impact feedback hit-stop destruction presentation cues take priority over particles shake | `DESIGN#D4.5` (36.791), `JUICE#J3` (18.262), `JUICE#J2` (15.765) |
| P1.2 juice camera shake player shake lunge impact write-off stamp cone in flight | `LOG#P1.2/juice` (43.335), `JUICE#J3` (27.876), `LOG#P1.1-observations` (26.827) |
| brake marks tyre marks persist floor forensic record | `JUICE#J1` (21.371), `JUICE#J3` (17.313), `JUICE#J2` (10.011) |
| touch spent car must not look like scored hit reward feedback | `JUICE#J3` (27.878), `DESIGN#D4.5` (22.456), `DESIGN#D10.6` (9.742) |
| replacement chassis drop helicopter delivery placement | `JUICE#J1` (15.645), `JUICE#J3` (15.282), `DESIGN#D9.1` (9.167) |
| dummy damage states wear smoke sparks tremble vignette | `LOG#P1.2/dummy-damage-states` (30.935), `JUICE#J4` (12.192), `JUICE#J3` (11.334) |
| dummy only persistently saturated actor reserved red warning palette | `DESIGN#D10.1` (20.854), `DESIGN#D10.2` (19.441), `JUICE#J4` (13.794) |
| input denial near miss write-off purchase blocked traffic distinct cues sound visual equi… | `DESIGN#D9.4` (47.043), `DESIGN#D10.5` (20.023), `ENG#11.2` (15.054) |
| recoil stagger knock bounce restitution | `LOG#P1.3/rules` (14.976), `JUICE#J1` (7.734), `LOG#P1.3` (6.632) |

Context given to the generator: 16 chunks.

## 2. Query → retrieved chunk → output (side by side)

| Output item | Cited chunk | Retrieved by query | Chunk excerpt |
|---|---|---|---|
| `events[0]`: lunge — Dust kicked backwards (Micro Machines, art of rally) — shake ['proto.juice.lunge.… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `events[0]`: lunge — Dust kicked backwards (Micro Machines, art of rally) — shake ['proto.juice.lunge.… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `events[1]`: impact — Hit pause, scaled shake, sparks, contact flash (Art of Screenshake) — shake ['pr… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `events[1]`: impact — Hit pause, scaled shake, sparks, contact flash (Art of Screenshake) — shake ['pr… | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `events[2]`: knock — Small dust puff, no reward feedback (art of rally) — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `events[2]`: knock — Small dust puff, no reward feedback (art of rally) — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| art of rally (Funselektor, 2020) \| High overhead rally. |
| `events[3]`: touch-spent — Dull bump with springy recoil, no burst (Micro Machines) — shake proto.juic… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Touch on a spent car (`touch-spent`) \| Dull bump, no burst \| Must not look like a scored hit (D4.5). |
| `events[3]`: touch-spent — Dull bump with springy recoil, no burst (Micro Machines) — shake proto.juic… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Micro Machines (Codemasters, 1991) \| Toy cars race across desks and breakfast tables. |
| `events[4]`: writeoff — Car destroyed, debris stays; wreck permanence (Super Sprint, GTA) — shake prot… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Write-off (`writeoff`) \| Heavy shake, debris, stamp, wreck permanence \| Wreck is visual only (Engineering §8.5). |
| `events[4]`: writeoff — Car destroyed, debris stays; wreck permanence (Super Sprint, GTA) — shake prot… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `events[5]`: denied — Short stutter, costs nothing; distinct from a miss (Super Sprint) — shake proto.… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Denied action (`denied`) \| Short stutter \| Costs nothing (D4.2). |
| `events[5]`: denied — Short stutter, costs nothing; distinct from a miss (Super Sprint) — shake proto.… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `events[6]`: chassis — Helicopter lowers the replacement, rotor wash (Super Sprint) — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | A helicopter lowers a replacement. |
| `events[6]`: chassis — Helicopter lowers the replacement, rotor wash (Super Sprint) — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |
| `events[7]`: throw — Arc with stretched shadow stays as P1.2; light dust only (Juice It or Lose It) — … | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Cone throw (`throw`) \| Arc and stretched shadow (P1.2) \| Cones never train cars (D5.3). |
| `events[7]`: throw — Arc with stretched shadow stays as P1.2; light dust only (Juice It or Lose It) — … | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Cone in flight \| Lifts in an arc; its shadow stretches. |
| `events[8]`: drop — Small settle dust on the mundane desk-scale prop (Micro Machines) — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Micro Machines (Codemasters, 1991) \| Toy cars race across desks and breakfast tables. |
| `events[8]`: drop — Small settle dust on the mundane desk-scale prop (Micro Machines) — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `events[9]`: pickup — Quiet action; sound already covers it (Juice It or Lose It) | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | \| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) \| Tweening. |
| `events[9]`: pickup — Quiet action; sound already covers it (Juice It or Lose It) | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | ### D9.4 Sound (§3.4) |
| `events[10]`: punt — Knockback dust along the kick (Art of Screenshake) — particles dust | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `events[10]`: punt — Knockback dust along the kick (Art of Screenshake) — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `events[11]`: honk — Hazard lights, headlight flash and HONK bubble stay as P1.2; no added field juice;… | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | \| O1.12 \| A car blocked by cones for 5 s honks (sound, flashing lights). |
| `events[11]`: honk — Hazard lights, headlight flash and HONK bubble stay as P1.2; no added field juice;… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Micro Machines (Codemasters, 1991) \| Toy cars race across desks and breakfast tables. |
| `events[12]`: purchase — Frame-level confirmation only; field stays still | `DESIGN#D10.5` | input denial near miss write-off purchase blocked traffic d… | The purchase screen shows only the profile's offered upgrades: the two slice branches, prices, prerequisites, current credit balance and the shortfall for unaf… |
| `events[12]`: purchase — Frame-level confirmation only; field stays still | `JUICE#J4` | dummy damage states wear smoke sparks tremble vignette | Frame and HUD stay still. |
| `events[13]`: drone-dispatch — Drone lift animation already in P1 (helicopter delivery) | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | **Build seen:** `dummies_p1.html` v2 · 14 Oct 2026 · *Designer play* |
| `events[13]`: drone-dispatch — Drone lift animation already in P1 (helicopter delivery) | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | A helicopter lowers a replacement. |
| `states.brakeMarks`: Tyre marks as ink strokes on a pale floor (Absolute Drift, art of rally) | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Tyres leave black marks like ink strokes. |
| `states.brakeMarks`: Tyre marks as ink strokes on a pale floor (Absolute Drift, art of rally) | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Car braking \| Tyre marks that persist on the floor \| The live brake cue stays separate (D10.3). |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeFrom", "sparkFrom": "proto.juice.lowHealth.spar… | `LOG#P1.2/dummy-damage-states` | dummy damage states wear smoke sparks tremble vignette | ### Dummy damage states |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeFrom", "sparkFrom": "proto.juice.lowHealth.spar… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| DUMMIES event \| Reference technique \| Constraint \| |
| `states.replacementDrop`: Helicopter lowers the replacement car (Super Sprint) | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | A helicopter lowers a replacement. |
| `states.replacementDrop`: Helicopter lowers the replacement car (Super Sprint) | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy and numbers mostly sound like DUMMIES: dry, tied to the P1 literals, and with the spent-car touch kept well below a scored hit. Five things need fixing: one wrong parameter reference, two denied-action choices that imply a hit or a loss of control, a honk pulse that looks like a hit, and a smoke colour that borrows a cue role.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | data/block | `events[1].particles[1].count` | LOG#P1.2/juice: Every statistic maps to its own registry ID. The impact ring's count … | proto.juice.knock.dustCountMin | proto.juice.impact.ringCount |
| C2 | rule/fix | `events[5].flinch` | DESIGN#D4.5: A denied action costs nothing and must stay distinct from a hit or a … | true | false |
| C3 | truth/fix | `events[5].reference` | JUICE#J3: Denied is a short stutter that costs nothing. The copy must not imply… | Brief loss-of-control stutter (Super Sprint oil slick) | Short stutter, costs nothing; distinct from a miss (Super Sprint) |
| C4 | rule/fix | `events[11].carPulse` | LOG#P1.2/juice: The car pulse and flash is impact feedback on a scored hit. On a honk… | true | false |
| C5 | rule/fix | `events[4].particles[1].role` | DESIGN#D10.2: The secondary colour #4A5A66 is the planning-cue role. Decorative wri… | secondary | structure |

Leaf changes this round: 212.

### Round 1

- Validator: 0 issue(s).
- Critic verdict: **revise**. The content sounds like DUMMIES: dry, institutional and built on mundane reference points. It ties closely to the P1 literals, keeps the touch-spent bump below a scored hit, and keeps reserved red out of the particles. Two small problems remain: the honk reference now contradicts the settled carPulse:false, and one simulation speed threshold uses a presentation unit.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | truth/fix | `events[11].reference` | LOG#P1.2/juice: Only the impact event pulses the car. The honk's hazard lights, headl… | Car pulse stands in for flashing lights; sound carries the horn (Micro Machines) | Hazard lights, headlight flash and HONK bubble stay as P1.2; no added field juice; sound carries the horn (Mi… |
| C2 | data/fix | `params[proto.juice.brakeMarks.minSpeed]…` | LOG#P1.3/rules: The minSpeed threshold tests a car's simulation speed, which is in wo… | canvas units/s | (removed or moved) |

Leaf changes this round: 2.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **revise**. The content sounds like DUMMIES: it is dry and mundane, every particle has a role, and the shakes and flashes are kept small. One reference line is wrong: the drone-dispatch row describes the chassis delivery instead of the cone drone.

Open issues (no repair round left):

- C1 [lore/fix] `events[13].reference`: Drone lift animation already in P1 (helicopter delivery) — The drone dispatched after a honk flies in from off-field top right and lifts and drops a blocked cone (proto.droneSpeed, proto.droneLiftSeconds). The helicopter delivery belongs to the 'chassis' event.

