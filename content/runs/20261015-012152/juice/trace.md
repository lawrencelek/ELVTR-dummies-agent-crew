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
| `events[0]`: lunge — Squash and stretch with dust kicked backwards — shake proto.juice.lunge.kickAmp —… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `events[0]`: lunge — Squash and stretch with dust kicked backwards — shake proto.juice.lunge.kickAmp —… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `events[1]`: impact — Hit pause, shake scaled by hit strength, sparks, contact flash — shake ['proto.j… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `events[1]`: impact — Hit pause, shake scaled by hit strength, sparks, contact flash — shake ['proto.j… | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `events[2]`: knock — Small dust puff, no reward feedback — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `events[2]`: knock — Small dust puff, no reward feedback — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Oil and small tornadoes cause brief loss of control. |
| `events[3]`: touch-spent — Springy toy-car bounce; dull bump with no burst — shake proto.juice.touchSp… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Touch on a spent car (`touch-spent`) \| Dull bump, no burst \| Must not look like a scored hit (D4.5). |
| `events[3]`: touch-spent — Springy toy-car bounce; dull bump with no burst — shake proto.juice.touchSp… | `DESIGN#D4.5` | impact feedback hit-stop destruction presentation cues take… | A scored hit and a physical touch on a spent car must not use indistinguishable reward feedback. |
| `events[4]`: writeoff — Heavy shake, lingering debris and wreck, stamp — shake proto.juice.writeoff.sh… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Write-off (`writeoff`) \| Heavy shake, debris, stamp, wreck permanence \| Wreck is visual only (Engineering §8.5). |
| `events[4]`: writeoff — Heavy shake, lingering debris and wreck, stamp — shake proto.juice.writeoff.sh… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Take wreck permanence only. |
| `events[5]`: denied — Short stutter of the body; no burst, costs nothing | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Denied action (`denied`) \| Short stutter \| Costs nothing (D4.2). |
| `events[5]`: denied — Short stutter of the body; no burst, costs nothing | `DESIGN#D4.5` | impact feedback hit-stop destruction presentation cues take… | The view cone follows body facing in the slice. |
| `events[6]`: chassis — Super Sprint helicopter drop, rotor-wash dust — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `events[6]`: chassis — Super Sprint helicopter drop, rotor-wash dust — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |
| `events[7]`: throw — Arc with stretched shadow; small release dust — particles dust | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Cone throw (`throw`) \| Arc and stretched shadow (P1.2) \| Cones never train cars (D5.3). |
| `events[7]`: throw — Arc with stretched shadow; small release dust — particles dust | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Cone in flight \| Lifts in an arc; its shadow stretches. |
| `events[8]`: drop — Dust plume at landing, as in art of rally — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| art of rally (Funselektor, 2020) \| High overhead rally. |
| `events[8]`: drop — Dust plume at landing, as in art of rally — particles dust | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `events[9]`: pickup — Tweened pop with a visual equivalent for sound — particles ring | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | Sound keeps a visual equivalent (D9.4). |
| `events[9]`: pickup — Tweened pop with a visual equivalent for sound — particles ring | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | Gameplay cues take priority over ambience and have visual equivalents. |
| `events[10]`: punt — Knockback dust along the kick — particles dust | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | Knockback is P1.3 recoil. |
| `events[10]`: punt — Knockback dust along the kick — particles dust | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `events[11]`: honk — Flashing lights on the honking car; sound keeps a visual equivalent | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | \| O1.12 \| A car blocked by cones for 5 s honks (sound, flashing lights). |
| `events[11]`: honk — Flashing lights on the honking car; sound keeps a visual equivalent | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | Gameplay cues take priority over ambience and have visual equivalents. |
| `events[12]`: purchase — Tweened pop with a visual equivalent for sound — particles ring | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | Sound keeps a visual equivalent (D9.4). |
| `events[12]`: purchase — Tweened pop with a visual equivalent for sound — particles ring | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | Gameplay cues take priority over ambience and have visual equivalents. |
| `events[13]`: drone-dispatch — Rotor-wash dust as the drone lifts — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Dust plumes and tyre tracks show the car's motion. |
| `events[13]`: drone-dispatch — Rotor-wash dust as the drone lifts — particles dust | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | Then drones move the cones. |
| `states.brakeMarks`: Absolute Drift ink-stroke tyre marks on a pale floor | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Tyres leave black marks like ink strokes. |
| `states.brakeMarks`: Absolute Drift ink-stroke tyre marks on a pale floor | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Car braking \| Tyre marks that persist on the floor \| The live brake cue stays separate (D10.3). |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeFrom", "sparkFrom": "proto.juice.lowHealth.spar… | `LOG#P1.2/dummy-damage-states` | dummy damage states wear smoke sparks tremble vignette | ### Dummy damage states |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeFrom", "sparkFrom": "proto.juice.lowHealth.spar… | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| DUMMIES event \| Reference technique \| Constraint \| |
| `states.replacementDrop`: Super Sprint helicopter lowering a replacement car | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `states.replacementDrop`: Super Sprint helicopter lowering a replacement car | `JUICE#J3` | touch spent car must not look like scored hit reward feedba… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |

## 3. Consistency loop

### Round 0

- Validator: 0 issue(s).
- Critic verdict: **revise**. The copy has the dry, instrumented register of DUMMIES and the numbers track the P1.2 juice table. Four problems remain: three effects use the secondary-cue colour role for decoration, and the drone-dispatch dust has no place or cause in the sim.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| C1 | rule/fix | `states.brakeMarks.role` | JUICE#J4: Persistent tyre marks use matte, low-contrast ink and sit under every… | secondary | structure |
| C2 | rule/fix | `events[9].particles[0].role` | DESIGN#D10.2: The secondary cue colour carries planning information. A decorative e… | secondary | dummy |
| C3 | rule/fix | `events[4].particles[1].role` | DESIGN#D10.2: The secondary cue colour is reserved for planning cues. Write-off smo… | secondary | structure |
| C4 | truth/fix | `events[12].particles` | LOG#P1.2/honking-and-drones: The drone is dispatched from off-field top right, and pickup takes pr… | [{"type": "ring", "count": "proto.juice.impact.ringCount", "speed": "proto.juice.pickup.ringSpeed", "life": "… | [{"type": "ring", "count": "proto.juice.impact.ringCount", "speed": "proto.juice.pickup.ringSpeed", "life": "… |

Leaf changes this round: 4.

### Round 1

- Validator: 1 issue(s).
- Critic verdict: **revise**. The copy sounds like DUMMIES: dry, instrument-like, and every value has a parameter ID. Cue priority, reserved red, matte marks and the spent-versus-scored distinction all hold. Two small data defects remain: the drone-dispatch event has no particles even though its own reference and the drop param describe dust, and the brake-mark speed gate uses a canvas unit for a simulation speed.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | rule/block | `states.brakeMarks.role` | JUICE#J4: Persistent marks use matte ink roles. | structure | fleet |
| C1 | data/fix | `events[13].particles` | LOG#P1.2/honking-and-drones: The drone lifts the cone over `proto.droneLiftSeconds`, and the drop … | [] | [{"type": "dust", "count": "proto.juice.drop.dustCount", "speed": "proto.juice.touchSpent.dustSpeed", "life":… |
| C2 | data/fix | `params[proto.juice.brakeMarks.minSpeed]…` | DESIGN#D10.2: Render scaling must not change simulation units. Car speed is a simul… | canvas units/s | (removed or moved) |

Leaf changes this round: 3.

### Round 2

- Validator: 0 issue(s).
- Critic verdict: **pass**. The copy and values sound like DUMMIES: dry, instrument-like and free of cheer or slang. I found no canon breaks. Every value maps to a parameter or registry ID, scored hits are clearly separate from spent-car touches and knocks, brake marks sit under the cues, red is kept for the vignette, and the P1.2 wear thresholds match.

