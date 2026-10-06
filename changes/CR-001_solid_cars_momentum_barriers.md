# CR-001 — Solid cars, damage from momentum, road shoulder and barrier

**From:** Lawrence, after playing the three-level build, 6 October 2026.

**In his words:**

> the cars should have collision box all around them. damage taken should be
> inversely proportional to speed x mass of vehicle.
>
> for the road, the cars have to avoid each other. they must also NOT go off
> the road. there should be a hard shoulder (they can go on this), and then a
> barrier that they cannot go beyond.

**How the request is read** (the assistant's interpretation; marked where it
goes beyond his words):

1. **Solid cars.** Every car is a solid rectangle on all four sides.
   - The dummy can never be inside a car. If they overlap, the dummy is pushed
     out along the shortest way; a moving car pushes the dummy ahead of it or
     aside. The dummy never blocks or slows a car by being solid.
   - Cars can never overlap each other, on any level, whatever the dummy does.
     This now applies to level 3 as well.
   - Scoring is unchanged in kind: each car still pays for at most one impact,
     front pays in full, side a quarter, rear nothing. After its impact a car
     stays solid.
2. **Damage from momentum.** *Interpretation: "inversely" is read as
   "directly"; a faster, heavier vehicle does more damage. To be confirmed by
   Lawrence.* Each vehicle class gets a mass. Damage = closing speed x mass x
   a constant x the face factor, up to a cap. This replaces the Testpad's
   severity curve. Score for an impact still equals the damage done.
3. **Road limits (levels 1 and 2).** *Interpretation: applied to both road
   levels; the barrier stops cars, not the dummy.*
   - Outside the lanes on each side of a road is a hard shoulder. Cars may use
     it when swerving.
   - Beyond the shoulder is a barrier. No part of a car may ever cross it.
   - A car that cannot swerve far enough to clear the dummy, because of the
     barrier or because another car is in the way, brakes instead.
   - Cars avoid each other sideways as well as lengthways: a car only moves
     sideways into space that is free of other cars.
   - The dummy can cross shoulders and barriers freely.
   - Shoulders and barriers are drawn.

## Addendum, added during the run: level 2 roads become one-way

**Decided by the assistant under the deadline; for Lawrence to confirm.**

The first build of this change (run `20261006-221429`) failed the check
`levels_always_end_with_dummy_in_traffic` on level 2. With solid cars, a car
that had swerved into the oncoming lane met traffic head-on, neither could
pass, and the level froze. The same thing happened before this change (run
`20261006-215228`, build 1). The cause is the two-way roads the Designer chose
for level 2, which Lawrence never asked for.

4. **Level 2 roads are one-way.** The horizontal road runs left to right and
   the vertical road runs top to bottom, each with two lanes. There is no
   oncoming traffic on levels 1 and 2; the only conflict on level 2 is the
   crossing in the junction. Level 3 is unchanged.
5. Whatever happens, the car with the lowest serial number must never be held
   up for good by another car.
