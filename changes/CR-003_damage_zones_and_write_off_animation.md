# CR-003 — Damage by zone with a flat lunge multiplier, and a write-off animation

**From:** Lawrence, after playing the CR-002 build, 7 October 2026.

**In his words:**

> on the final time the unit is destroyed, it goes too quickly to the 'unit
> written off' screen. It should have a satisfying 'destroyed' animation and
> shake, small particle effect, turn red and disappear. the difficulty level
> seems fine. I also think that if you hit the side of the car, you can get
> 10% of the points you would get from elsewhere. at the moment you get none.
> diagonal impacts should be tuned differently. have a base damage, if you
> are walking = 100 points - head-on: 100%, diagonally front-on, 60%,
> side-on, 30%, diagonally rear-on, 15%, from rear directly 5%. If you are
> lunging, 5x points? plus factor in the speed and weight of the car.

**Confirmed by Lawrence when asked:** the base of 100 is literal, against a
body of 2,300 (he was told this makes bodies take about twice as many hits);
side-on is 30%, not 10%; each car still pays only once.

## 1. Damage (replaces the whole CR-002 formula)

`damage = min(maxPay, round(basePoints x zoneShare x lungeFactor x momentumFactor))`

- `basePoints` = 100.
- `zoneShare`, by which part of the car's rectangle the dummy reached, judged
  by geometry from where the dummy came from:

  | Zone | Geometry (a along the car's travel, b across it) | Share |
  |---|---|---|
  | nose (head-on) | ahead of the front edge, within the width | 1.00 |
  | frontCorner (diagonally front-on) | ahead of the front edge, outside the width | 0.60 |
  | flank (side-on) | alongside, anywhere between front and rear edges | 0.30 |
  | rearCorner (diagonally rear-on) | behind the rear edge, outside the width | 0.15 |
  | tail (directly from the rear) | behind the rear edge, within the width | 0.05 |

- `lungeFactor` = 5 if the dummy is lunging on the step of contact, otherwise
  1. It is flat: the direction and speed of the lunge do not matter. CR-002's
  lunge-direction factor (`lungeBonus`, head-on against / with the car) is
  removed completely.
- `momentumFactor` = (vehicleSpeed x class mass) / (refSpeed x refMass), where
  the reference is a cruising sedan (so a cruising sedan is exactly 1.0).
  `vehicleSpeed` is the car's own forward speed at that moment: a braking car
  pays less and a stopped car pays nothing. Class masses are unchanged.
- Score for the hit equals the damage. The tail and rear corners now pay
  (5% and 15%); the earlier rule that rear contact pays nothing is removed.
- Each car still pays for its first contact only.
- Body health stays 2,300 and the write-off bonus stays 2,500. Quotas,
  allocations and the certification target are not changed.

Worked values at cruising speed, walking / lunging: sedan nose 100 / 500,
sedan flank 30 / 150, sedan tail 5 / 25; bus nose 235 / 1,174.

Every rule, parameter and acceptance criterion from CR-002 that depends on
`perMomentum`, `faceNose/faceCorner/faceFlank/faceTail`, `lungeBonus`, the
direction of a lunge, or specific CR-002 damage figures (635, 1,143, 69) must
be removed or rewritten to the new formula. The `Damage` module, the
`Vehicles` module, `state.lastImpact`, the no-tunnelling rule and the QA
audits all stay.

## 2. Write-off animation

When a hit takes the body's health to zero, the game must not cut straight to
the card.

- The write-off is counted at once (`bodiesDestroyed`, `levelWriteOffs`,
  bonus), then the game enters a new mode, `"writeoff"`, for
  `writeOff.duration` seconds (between 0.9 and 1.4 s). In this mode nothing
  moves: traffic, spawning and the dummy are frozen, and confirm presses are
  ignored and not remembered.
- When it ends, the usual result follows: the "UNIT WRITTEN OFF" card, or the
  Licensed ending if the certification target was reached. This applies to
  every write-off, including the one that wins the run.
- What the player sees during it, drawn by `index.html` from
  `state.writeOff`: a strong screen shake that dies away; the dummy turns red;
  a small burst of particles flies out from it; the dummy shrinks or fades
  and is gone before the animation ends. The cars stay visible, frozen.
- The effect is drawing only. Particles may use `Math.random()` in the
  renderer; the simulation stays deterministic.
