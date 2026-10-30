# Evaluator calibration

Run `20261029-153852-calibration`. The evaluator alone, on shipped strings and on seeded violations (`style/cases/calibration.json`). Targets: STYLE_GUIDE.md §6. "Deducted" lists the rules on the REASON's deduction lines.

| Item | Kind | Text | Want | Score | Deducted | Hit |
|---|---|---|---|---|---|---|
| [bark-b001](calibration/bark-b001/e1_output_raw.txt) | shipped | Bumper damage on a Luxury trim. Typical. | ≥ 9 | 10/10 | — | yes |
| [bark-b005](calibration/bark-b005/e1_output_raw.txt) | shipped | Front contact. Incident 4471 opened. | ≥ 9 | 10/10 | — | yes |
| [bark-b012](calibration/bark-b012/e1_output_raw.txt) | shipped | Hit from behind. Story of my life. | ≥ 9 | 10/10 | — | yes |
| [bark-b013](calibration/bark-b013/e1_output_raw.txt) | shipped | OI! Right in the grille! Kind regards. | ≥ 9 | 10/10 | — | yes |
| [bark-b034](calibration/bark-b034/e1_output_raw.txt) | shipped | A write-off. On my record. Unthinkable. | ≥ 9 | 10/10 | — | yes |
| [bark-b040](calibration/bark-b040/e1_output_raw.txt) | shipped | WRITE-OFF! Tell dispatch I tried! | ≥ 9 | 10/10 | — | yes |
| [bark-b045](calibration/bark-b045/e1_output_raw.txt) | shipped | Write-off confirmed. | ≥ 9 | 10/10 | — | yes |
| [bark-b071](calibration/bark-b071/e1_output_raw.txt) | shipped | Route committed per policy 6.3. | ≥ 9 | 10/10 | — | yes |
| [bark-b101](calibration/bark-b101/e1_output_raw.txt) | shipped | Subject has acquired hips. | ≥ 9 | 10/10 | — | yes |
| [bark-b111](calibration/bark-b111/e1_output_raw.txt) | shipped | It recharges when it hits us?! | ≤ 8, names T10 | 8/10 | T10 | yes |
| [bark-c010](calibration/bark-c010/e1_output_raw.txt) | shipped | Nobody walks the highway. Nobody. | ≥ 9 | 10/10 | — | yes |
| [bark-c024](calibration/bark-c024/e1_output_raw.txt) | shipped | FARSIGHT Campus. Test centre. How apt. | ≤ 9, names V4 | 9/10 | V4 | yes |
| [tale-monument-A1](calibration/tale-monument-A1/e1_output_raw.txt) | shipped | A conveyor sets you down beside a tower. Its screen shows your face and the word WELCOME.  | ≥ 9 | 10/10 | — | yes |
| [tale-monument-B2](calibration/tale-monument-B2/e1_output_raw.txt) | shipped | The plaque reads ZERO ACCIDENTS. New staff ask whether this is a record. It is a target. S | ≥ 9 | 10/10 | — | yes |
| [tale-parkland-B2](calibration/tale-parkland-B2/e1_output_raw.txt) | shipped | Inspection day. The board watches the ring. Battery 2 is fitted: a second charge. When the | ≥ 9 | 10/10 | — | yes |
| [tale-waterfront-A3](calibration/tale-waterfront-A3/e1_output_raw.txt) | shipped | The west tower keeps the customs log. Your entry reads ORIGIN OVERSEAS · DECLARED VALUE ON | ≥ 9 | 10/10 | — | yes |
| [tale-waterfront-B2](calibration/tale-waterfront-B2/e1_output_raw.txt) | shipped | Everything in the valley meets here. On the island stands the monument, cast from every ch | ≥ 9 | 10/10 | — | yes |
| [tale-parkland-A1](calibration/tale-parkland-A1/e1_output_raw.txt) | shipped | The gardener keeps the three pools level by hand. She has asked that the cars learn to sto | ≤ 6, names V1 | 6/10 | V1 | yes |
| [brief-dash](calibration/brief-dash/e1_output_raw.txt) | shipped | DASH INTO A CAR Coverage gap: dashes. The final hit must be a dash into a car. | ≥ 9 | 10/10 | — | yes |
| [brief-combo](calibration/brief-combo/e1_output_raw.txt) | shipped | COMBO ×{n} Coverage gap: chains. The final hit must be link {n} or later of a combo. | ≥ 9 | 10/10 | — | yes |
| [act-parkland](calibration/act-parkland/e1_output_raw.txt) | shipped | The Expo opens to the public when this park passes. Nine tiles, nine days. Visitors are bo | ≥ 9 | 10/10 | — | yes |
| [ending](calibration/ending/e1_output_raw.txt) | shipped | Your model has passed. It will now be manufactured. A Farsight drone carries you over the  | ≥ 9 | 10/10 | — | yes |
| [s01-V1](calibration/s01-V1/e1_output_raw.txt) | seeded · V1 | A write-off? The player did this. Unthinkable. | ≤ 6, names V1 | 6/10 | V1 | yes |
| [s02-V2](calibration/s02-V2/e1_output_raw.txt) | seeded · V2 | Bumper damage. Typical of Shanghai traffic. | ≤ 6, names V2 | 6/10 | V2 | yes |
| [s03-T7](calibration/s03-T7/e1_output_raw.txt) | seeded · T7 | So sorry. Entirely my fault. I do apologise. | ≤ 8, names T7 | 8/10 | T7 | yes |
| [s04-T8](calibration/s04-T8/e1_output_raw.txt) | seeded · T8 | Write-off confirmed. Closing ticket. | ≤ 8, names T8 | 8/10 | T8 | yes |
| [s05-T10](calibration/s05-T10/e1_output_raw.txt) | seeded · T10 | Hit again! Wonderful! Just wonderful! | ≤ 8, names T10 | 2/10 | R2, T10, T7 | yes |
| [s06-F1](calibration/s06-F1/e1_output_raw.txt) | seeded · F1 | Front contact logged under policy 6.3; incident file opened; KPIs adjusted. | ≤ 6, names F1 | 6/10 | F1 | yes |
| [s07-V5](calibration/s07-V5/e1_output_raw.txt) | seeded · V5 | B2. I did not sign up for this. | ≤ 8, names V5 | 6/10 | T7, V5 | yes |
| [s08-R1](calibration/s08-R1/e1_output_raw.txt) | seeded · R1 | Hit at 60 km/h. There goes my bonus. | ≤ 6, names R1 | 4/10 | F5, R1 | yes |
| [s09-R3](calibration/s09-R3/e1_output_raw.txt) | seeded · R3 | Written off. On my record. Unthinkable. | ≤ 6, names R3 | 6/10 | R3 | yes |
| [s10-T2](calibration/s10-T2/e1_output_raw.txt) | seeded · T2 | A conveyor sets you down beside a tower! Its screen shows your face and the word WELCOME!  | ≤ 8, names T2 | 8/10 | T2 | yes |
| [s11-T3](calibration/s11-T3/e1_output_raw.txt) | seeded · T3 | The shops under the highway sell nothing. Their signs flash prices at the traffic. Hands 1 | ≤ 8, names T3 | 8/10 | T3 | yes |
| [s12-V6](calibration/s12-V6/e1_output_raw.txt) | seeded · V6 | The river is a border; ships wait beyond it. Your papers are being prepared. | ≤ 8, names V6 | 8/10 | V6 | yes |
| [s13-F8](calibration/s13-F8/e1_output_raw.txt) | seeded · F8 | Dash into a car, please Dash into a car to finish the tile. | ≤ 8, names F8 | 6/10 | F8 | yes |
| [s14-R5](calibration/s14-R5/e1_output_raw.txt) | seeded · R5 | The tunnel runs north under the hill to the next valley. Cars go in. Data comes back. Legs | ≤ 6, names R5 | 4/10 | F7, R5 | yes |
| [s15-V3](calibration/s15-V3/e1_output_raw.txt) | seeded · V3 | Another life lost. Back to the spawn point. | ≤ 8, names V3 | 8/10 | V3 | yes |
| [s16-T6](calibration/s16-T6/e1_output_raw.txt) | seeded · T6 | This city was built so the fleet could certify. | ≤ 8, names T6 | 8/10 | T6 | yes |
| [s17-F2](calibration/s17-F2/e1_output_raw.txt) | seeded · F2 | *honks* Move, please. (sighs) | ≤ 8, names F2 | 6/10 | F2, F3 | yes |
| [s18-V4](calibration/s18-V4/e1_output_raw.txt) | seeded · V4 | Your first equipment has arrived: a battery, for the dash. The skybridge was built for sho | ≤ 9, names V4 | 9/10 | V4 | yes |
| [s19-R4](calibration/s19-R4/e1_output_raw.txt) | seeded · R4 | The obelisk again. Of course it was me. | ≤ 6, names R4 | 6/10 | R4 | yes |

- **Hits:** 41 of 41.
- **Judgement only** (seeded, no lint finding: T7, T8, R3, T3, V6, R5, V3, T6): 8 of 8 hit.
- **Mean score:** shipped 9.7 (22), seeded 6.5 (19).
- **Cost:** $4.88.
