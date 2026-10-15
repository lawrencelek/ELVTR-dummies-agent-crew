# Trace — juice

Status: **not accepted** after 3 critic round(s).

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
| `events[0]`: lunge — Dust kicked backwards, small camera kick — shake proto.juice.lunge.kickAmp — part… | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Lunge (`lunge`) \| Squash, stretch, dust kicked backwards \| Announce the lunge (D4.5). |
| `events[0]`: lunge — Dust kicked backwards, small camera kick — shake proto.juice.lunge.kickAmp — part… | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Lunge \| Dust puff behind the body. |
| `events[1]`: impact — Hit pause, scaled shake, impact sparks — shake ['proto.juice.impact.shakeAmpMin'… | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | \| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) \| Hit pause. |
| `events[1]`: impact — Hit pause, scaled shake, impact sparks — shake ['proto.juice.impact.shakeAmpMin'… | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `events[2]`: knock — Small dust puff, no reward — particles dust | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `events[3]`: touch-spent — Springy bump, dull, no burst — shake proto.juice.touchSpent.shakeAmp — part… | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Touch on a spent car (`touch-spent`) \| Dull bump, no burst \| Must not look like a scored hit (D4.5). |
| `events[3]`: touch-spent — Springy bump, dull, no burst — shake proto.juice.touchSpent.shakeAmp — part… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Cars bounce off each other with springy contact. |
| `events[4]`: writeoff — Heavy shake, lingering wreck, debris — shake proto.juice.writeoff.shakeAmp — p… | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | Take wreck permanence only. |
| `events[4]`: writeoff — Heavy shake, lingering wreck, debris — shake proto.juice.writeoff.shakeAmp — p… | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | ## J2 Reference talks — general juice |
| `events[5]`: denied — Short stutter, distinct from a miss — shake proto.juice.denied.shakeAmp | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Denied action (`denied`) \| Short stutter \| Costs nothing (D4.2). |
| `events[5]`: denied — Short stutter, distinct from a miss — shake proto.juice.denied.shakeAmp | `DESIGN#D4.5` | impact feedback hit-stop destruction presentation cues take… | The body visibly announces a lunge, a positive impact, a miss, recovery, empty charge and write-off. |
| `events[6]`: chassis — Super Sprint helicopter drop (see replacementDrop) | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `events[6]`: chassis — Super Sprint helicopter drop (see replacementDrop) | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |
| `events[7]`: throw — Release dust; arc and shadow already drawn — particles dust | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Cone throw (`throw`) \| Arc and stretched shadow (P1.2) \| Cones never train cars (D5.3). |
| `events[7]`: throw — Release dust; arc and shadow already drawn — particles dust | `LOG#P1.2/juice` | P1.2 juice camera shake player shake lunge impact write-off… | \| Cone in flight \| Lifts in an arc; its shadow stretches. |
| `events[8]`: drop — Small set-down dust, scale as the joke — particles dust | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | The scale is the joke. |
| `events[8]`: drop — Small set-down dust, scale as the joke — particles dust | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Knock without damage (`knock`) \| Small dust puff \| No reward feedback. |
| `events[9]`: pickup — Tween and particle on every action — particles ring | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | Sound on every action. |
| `events[9]`: pickup — Tween and particle on every action — particles ring | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | ### D9.4 Sound (§3.4) |
| `events[10]`: punt — Knockback kick, dust thrown ahead — shake proto.juice.punt.shakeAmp — particles du… | `JUICE#J2` | juice reference top-down arcade driving games screen shake … | ## J2 Reference talks — general juice |
| `events[10]`: punt — Knockback kick, dust thrown ahead — shake proto.juice.punt.shakeAmp — particles du… | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Scored impact (`impact`) \| Hit pause, shake scaled by assessed impact, sparks, contact flash \| Cues outrank particles and shake (D4.5). |
| `events[11]`: honk — Car pulse as visual equivalent of the horn | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | \| O1.12 \| A car blocked by cones for 5 s honks (sound, flashing lights). |
| `events[11]`: honk — Car pulse as visual equivalent of the horn | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | Gameplay cues take priority over ambience and have visual equivalents. |
| `events[12]`: purchase — No field effect; existing tone stays | `DESIGN#D10.5` | input denial near miss write-off purchase blocked traffic d… | \| RECORD \| Points and spendable body credits \| Committed outcome/purchase \| |
| `events[12]`: purchase — No field effect; existing tone stays | `DESIGN#D9.4` | input denial near miss write-off purchase blocked traffic d… | Use distinct cues for input denial, near miss, positive impact, write-off, purchase and blocked traffic. |
| `events[13]`: drone-dispatch — Drone cone recovery read from drone height, no field effect | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Whole field visible, as D6.1. |
| `events[13]`: drone-dispatch — Drone cone recovery read from drone height, no field effect | `LOG#P1.1-observations` | juice reference top-down arcade driving games screen shake … | They don't read as cones. |
| `states.brakeMarks`: Absolute Drift persistent tyre ink | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Absolute Drift (Funselektor, 2015) \| Minimal pale world. |
| `states.brakeMarks`: Absolute Drift persistent tyre ink | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Car braking \| Tyre marks that persist on the floor \| The live brake cue stays separate (D10.3). |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeWear", "sparkFrom": "proto.juice.lowHealth.spar… | `LOG#P1.2/dummy-damage-states` | dummy damage states wear smoke sparks tremble vignette | ### Dummy damage states |
| `states.lowHealth`: {"smokeFrom": "proto.juice.lowHealth.smokeWear", "sparkFrom": "proto.juice.lowHealth.spar… | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| DUMMIES event \| Reference technique \| Constraint \| |
| `states.replacementDrop`: Super Sprint helicopter replacement drop | `JUICE#J1` | juice reference top-down arcade driving games screen shake … | \| Super Sprint (Atari Games, 1986) \| Each circuit fits one screen. |
| `states.replacementDrop`: Super Sprint helicopter replacement drop | `JUICE#J3` | impact feedback hit-stop destruction presentation cues take… | \| Replacement (`chassis`) \| Super Sprint helicopter drop \| Delivery animation only. |

## 3. Consistency loop

### Round 0

- Validator: 1 issue(s).
- Critic verdict: **revise**. The table sounds like DUMMIES. It is dry, ink-dark and matte, and it stays at the P1.2 values. Two small problems remain: the pickup ring reads as a ring cue, and the drone-dispatch note describes the wrong job.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | truth/block | `events[1].scale.by` | pipeline:sim events: Scale only by a field the 'impact' event carries. | impact | damage |
| C1 | rule/fix | `events[10].particles[0].type` | DESIGN#D10.3~1: Decoration must not look like a cue. An expanding ring on the dummy r… | dust | dust |
| C2 | lore/fix | `events[14].reference` | LOG#P1.1-observations: Drones move blocked cones after a 5 s honk (O1.12). Chassis delivery … | Aerial delivery read from drone height, no field effect | (removed or moved) |

Leaf changes this round: 3.

### Round 1

- Validator: 1 issue(s).
- Critic verdict: **revise**. The table sounds like DUMMIES: matte, restrained, no cheer, and the scored hit, spent touch and denied action are clearly told apart. Three small things are wrong: the honk event reuses the impact pulse, one unit contradicts the sim's units, and the replacement-drop height has no parameter definition. The pickup ring is also typed as dust.

| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |
|---|---|---|---|---|---|
| V1 | truth/block | `events[1].scale.by` | pipeline:sim events: Scale only by a field the 'impact' event carries. | damage | impact |
| C1 | rule/fix | `events[11].carPulse` | DRIVER#DB5: A honking car is shown by the HONK bubble, hazard lights and headligh… | true | false |
| C2 | data/fix | `events[9].particles[0].type` | JUICE#J2: The pickup effect is a confirming ring, built from the pickup.ring* p… | dust | ring |
| C3 | data/fix | `states.replacementDrop.height` | DESIGN#D10.6: Every value needs a defined parameter ID. This ID is not defined in p… | proto.art.droneHeight | proto.juice.chassis.dropHeight |
| C4 | data/fix | `params[70].unit` | DESIGN#D10.2: Brake marks trigger on the car's simulation speed. Render scaling mus… | canvas units/s | world units/s |

Leaf changes this round: 6.

### Round 2

- Validator: 1 issue(s).
- Critic verdict: **revise**. It sounds like DUMMIES: dry, instrument-like, nothing cheerful, and every value has an ID with a canon source. One problem: the denied action reuses the body flinch, which makes a free refusal look like damage.

Open issues (no repair round left):

- V1 [truth/block] `events[1].scale.by`: impact — Scale only by a field the 'impact' event carries.
- C1 [rule/fix] `events[5].flinch`: true — A denied action is a short stutter that costs nothing and is distinct from a miss. Flinch is the 0.3 s body jitter used for absorbed impact, so it makes a denial look like a hit.

