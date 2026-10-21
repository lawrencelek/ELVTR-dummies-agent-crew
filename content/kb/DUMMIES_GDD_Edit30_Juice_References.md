# DUMMIES — GDD Edit 30: Juice References

**Proposed D10.7 · Presentation · Lawrence Lek · 15 October 2026**

- **Parent:** [Design](DUMMIES_V29_Design.md) D4.5, D10.1, D10.3. P1 juice pass: Prototype Log P1.2.
- **Status:** Proposed. Reference material for the P1 juice pass. No value here is approved.
- **Scope:** Feedback only. Juice never awards damage, points, credits or learning.
- **Parameters:** Existing IDs resolve in Engineering §13.5. New presentation values use `proto.juice.*` until promoted.

## J1 Reference games — top-down arcade driving

| Game | What it does | DUMMIES reading |
|---|---|---|
| Super Sprint (Atari Games, 1986) | Each circuit fits one screen. No scrolling. A hard crash destroys the car. A helicopter lowers a replacement. Oil and small tornadoes cause brief loss of control. | Whole field visible, as D6.1. The replacement drop maps to a FARSIGHT chassis delivery. Presentation only; placement follows Engineering §8.5. |
| Grand Theft Auto (1997), GTA 2 (1999) | Fixed overhead view. The camera rises with vehicle speed. On foot it drops closer. Wrecked cars linger on the street. | Do not take the speed zoom. The field is fixed (D6.1, Engineering §7.2). Take wreck permanence only. |
| Micro Machines (Codemasters, 1991) | Toy cars race across desks and breakfast tables. The scale is the joke. Cars bounce off each other with springy contact. | Mundane setting carries the humour. Bounce maps to recoil (`proto.recoilScale`). |
| Absolute Drift (Funselektor, 2015) | Minimal pale world. Tyres leave black marks like ink strokes. A run leaves a drawing on the ground. | Near-white lab floor (D10.1). Persistent tyre marks become the test's forensic record. |
| art of rally (Funselektor, 2020) | High overhead rally. Flat, muted colour. Dust plumes and tyre tracks show the car's motion. | Muted fleet against a pale floor. Motion reads through marks and dust, not colour. |

## J2 Reference talks — general juice

| Source | Technique | DUMMIES reading |
|---|---|---|
| The Art of Screenshake (Jan Willem Nijman, Vlambeer, 2013) | Hit pause. Screen shake. Camera kick. Knockback. Impact effects. Permanence: debris stays. | Hit pause is `feedback.hitStop`. Knockback is P1.3 recoil. Permanence suits tyre marks and dents. |
| Juice It or Lose It (Martin Jonasson, Petri Purho, 2012) | Tweening. Squash and stretch. Particles. Sound on every action. | The dummy squashes on lunge and recovery (P1.2). Sound keeps a visual equivalent (D9.4). |

## J3 Event map

| DUMMIES event | Reference technique | Constraint |
|---|---|---|
| Lunge (`lunge`) | Squash, stretch, dust kicked backwards | Announce the lunge (D4.5). Never hide the nose vector. |
| Scored impact (`impact`) | Hit pause, shake scaled by assessed impact, sparks, contact flash | Cues outrank particles and shake (D4.5). |
| Touch on a spent car (`touch-spent`) | Dull bump, no burst | Must not look like a scored hit (D4.5). |
| Knock without damage (`knock`) | Small dust puff | No reward feedback. |
| Car braking | Tyre marks that persist on the floor | The live brake cue stays separate (D10.3). Old marks must not read as braking now. |
| Write-off (`writeoff`) | Heavy shake, debris, stamp, wreck permanence | Wreck is visual only (Engineering §8.5). Duration is `feedback.writeOffSeconds`. |
| Replacement (`chassis`) | Super Sprint helicopter drop | Delivery animation only. No collider until placement is legal. |
| Denied action (`denied`) | Short stutter | Costs nothing (D4.2). Distinct from a miss. |
| Low health | Smoke and sparks (P1.2) | Facing stays crisp at every wear level. |
| Cone throw (`throw`) | Arc and stretched shadow (P1.2) | Cones never train cars (D5.3). |

## J4 Intensity rules (Proposed)

- Shake moves the field only. Frame and HUD stay still.
- Reduced-motion settings scale shake, flinch and tremble to 25% (P1.2).
- Particles never cover a car's state pip, tag or spent stamp.
- Persistent marks use matte, low-contrast ink. They sit under every cue.
- Red stays reserved for warning cues (D10.2). Sparks are not red.
