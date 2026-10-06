# CR-002 — Logical damage, a Vehicles module and a Damage module

**From:** Lawrence, after playing the CR-001 build, 6 October 2026.

**In his words:**

> There's an error when I go diagonally lunge towards the rear bit of the
> front bumper (i.e. i lunge in the same general direction that the car is
> heading), I get +2500 points damage. This is patently wrong as it is higher
> than the head-on lunge damage. Get the three-agent crew on it. Especially
> check the damage score allocation with the QA Reviewer. Check vehicle paths,
> start/stop, and agent crew. There should be a module in the code
> specifically for vehicle behaviour (speeds, etc), and one for damage
> assessment, which should be logical.

**Diagnosis (the assistant's, from the released code).** CR-001 computed
damage from "closing speed": the size of the car's velocity minus the dummy's
velocity. A lunge peaks at about 1,640 px/s and a sedan cruises at 138 px/s,
so the dummy's own lunge speed dominated in every direction. Any lunge that
touched the front third of a car, including its sides, reached the damage cap
(2,300), destroyed the body and added the 2,500 write-off bonus. Lunging
alongside the car paid the same as lunging head-on.

**What must change**

1. **Damage comes from the vehicle, not from the dummy's speed.** Lawrence's
   rule (CR-001) is "speed x mass of vehicle". For every contact:

   `damage = min(maxPay, round(perMomentum x vehicleSpeed x mass x faceFactor x lungeFactor))`

   - `vehicleSpeed` is the car's own forward speed at that moment (the same
     number as `car.speed`). A braking car hits more softly. A stopped car
     does no damage.
   - `mass` is the class mass (unchanged from CR-001).
   - `faceFactor` depends only on **which face of the car's rectangle the
     dummy reached, judged by geometry**: the nose (front edge) pays in full;
     a front corner pays less; a flank (either long side, anywhere along it)
     pays a quarter; the tail and rear corners pay nothing. The Testpad's
     "front third of the car, sides included" zone is replaced.
   - `lungeFactor` depends only on **the direction of the lunge relative to
     the car's direction of travel**: 1 when the dummy is not lunging; when it
     is, `1 + lungeBonus x c`, where `c` runs from +1 (lunging straight
     against the car's travel: head-on) through 0 (lunging across it) to -1
     (lunging the same way the car is going). The speed of the lunge does not
     enter the formula.
   - Consequences that must hold: a head-on lunge into the nose is the
     highest-paying hit there is for a given car; lunging in the car's
     direction of travel always pays less than standing still on the same
     face; nothing a dummy does to a flank or tail can out-pay the nose.
   - Calibrate so that a head-on lunge into a cruising sedan's nose takes
     roughly half of a fresh body.
2. **No tunnelling.** A lunge moves up to 27 px in one step. The face must be
   judged from where the dummy came from (its position relative to the car
   before contact), not from where it ends up inside the rectangle.
3. **A `Damage` module.** One place in the code works out every hit. It is a
   pair of pure functions (no state, no side effects) so it can be tested and
   audited on its own, and it records how each hit was scored
   (`state.lastImpact`).
4. **A `Vehicles` module.** One place holds all vehicle behaviour: spawning,
   speeds, perception, commitment and swerving, braking, giving way to other
   cars, road limits, and leaving the hall.
5. **QA audits the damage table and vehicle behaviour** (paths, stopping and
   starting) explicitly, with numbers, before it may release.

**Not in this change:** level layouts, quotas, the look, the jam breaker on
level 3 (QA is asked to report on it; fixing it is a separate change).
