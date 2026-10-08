# CR-005 — Side sensors, a reaction delay, and "unsure cars slow, committed cars don't"

**From:** Lawrence, 8 October 2026, after discussing the first design pillar.

**In his words:**

> at the moment, standing front on and lunging at the car is an easy way to
> get smashed for maximum damage. we need to possibly extend the car frontal
> detection. would it make sense to add another sensor, front-side-facing,
> with a shorter radius, so it's not like the car is totally blind from the
> side? is it possible, for example, to add a short delay between detection
> and the car reacting? Not noticeable, but might contribute to a better
> 'feel'.

He then said "go" to the assistant's proposal of three rules, with a side
sensor radius of 100 px and a delay of 0.15 s as starting values.

**What was measured on the released build (CR-004).** Against a sedan, a
dummy standing in its lane that lunges head-on when the nose is anywhere
from 80 to 160 px away gets a nose hit every time, for 300 to 355 points. No
reading of the car is needed: the sedan sees the dummy from 212 px but does
nothing until its commit line at 106 px, and a lunge covers 164 px. Baiting
the car into committing first pays no more, because every car loses 40% of
its speed whenever the dummy moves fast. A dummy standing 50 to 100 px beside
the lane is never detected at all.

**Aim.** The best-paying hit on a car should require outsmarting it (making
it commit, or beating its reaction), not standing in front of it.

## 1. Side sensors

- Each car gets a short-range sensor covering its front quarters, beside the
  existing forward path zone. Measured from the centre of the nose: the dummy
  is in a side sensor if it is within `perception.sideRadius` (100 px), no
  more than `perception.sideHalfAngleDeg` (80 degrees) off the car's heading,
  and not already in the path zone. It uses the dummy's actual position.
- A dummy in a side sensor makes the car **wary**: it slows. It does not
  swerve or commit, because the dummy is not in its path.

## 2. Reaction delay

- Sensing is instant, reacting is not. A car becomes **aware** of the dummy
  only once it has sensed it (path zone or side sensor) continuously for
  `perception.reactionDelay` (0.15 s). If sensing stops, the timer resets.
- Everything a car does *because of the dummy* needs it to be aware: slowing,
  braking, committing to a side, the hatchback's flip. Until then it carries
  on exactly as if the dummy were not there.
- The delay applies only to the dummy. Cars giving way to each other, staying
  inside barriers and staying solid are unchanged and immediate.
- A commitment already made stays made.

## 3. Unsure cars slow; committed cars don't

A car's speed because of the dummy, replacing the Testpad's braking and
"caution" rules:

| The car is… | Speed |
|---|---|
| not aware of the dummy | cruising speed; the dummy's own speed has no effect |
| aware, dummy in a side sensor only (wary) | cruise x `perception.warySpeedFactor` (0.6) |
| aware, dummy in its path, not committed (unsure) | cruise x `perception.unsureSpeedFactor` (0.5), or the Testpad's brake factor for that class and distance if that is lower |
| committed to a side, and the swerve is possible | back to cruising speed; it ignores the dummy from then on |
| committed but unable to swerve clear (barrier or another car) | brakes as now |

- The Testpad's caution rule (cars lose up to 40% speed when the dummy moves
  fast) now applies only to cars that are aware and not committed, on top of
  the wary or unsure factor. It no longer touches cars that have not noticed
  the dummy or that have committed.
- Speed still changes at the existing acceleration and braking rates.
- The bus cannot swerve, so it never commits: it stays unsure and braked.

Expected result, sedan, lunging onto the nose: standing in its lane and
lunging about 150 (the car is unsure and cautious); a baited hit on a
committed car, or an ambush that beats the reaction delay, the full 500.

## 4. Show it

- Draw the side sensors, lit while they sense the dummy.
- Draw the forward path zone as the shape that is actually tested (a
  rectangle of the car's detection length and margin), not a triangle.
  *The assistant's addition: the old triangle under-shows where the car can
  see near its nose, and would be misleading next to the new sensors.*
- Make the gap between sensing and reacting readable: the zone lights the
  moment the dummy is sensed; a distinct cue appears when the car becomes
  aware; brake lights only come on once it actually slows.

## 5. Longer frontal sensing (added after the first build)

The first build of this change (run `20261008-021901`) passed 40 of 41
checks and failed the pillar check. The reaction delay opened a new easy
route: a sedan first senses a dummy in its lane when its nose is 168 px away,
which is inside the lunge's 164 px reach plus the car's own travel. Lunging
the instant it sensed you landed before it was aware, for the full 500. This
is what Lawrence suggested at the start: "we need to possibly extend the car
frontal detection".

- The path zone used for **sensing** now reaches `perception.frontRange`
  (320 px from the car's centre) or the unit's `detect` dial, whichever is
  longer. Its width is unchanged (the unit's `margin`).
- Nothing else moves. The commit line (`detect x commitFrac`), the Testpad
  brake distances (`detect x brakeLead`) and learning all still use the
  unit's own `detect` dial, exactly as before. Only *when the car first
  notices you* is earlier.
- So a dummy standing in a lane is sensed, and the car is aware and slowing,
  well before any lunge can reach it. Beating the reaction delay now needs
  an approach from outside the sensors.
- The path zone is drawn to this longer range.

## 6. A lunge must not make a car lose track of the dummy (added after the second build)

The second build (run `20261008-022848`) still failed the pillar check. A
trace showed a sedan slowing correctly to 69 px/s for a dummy standing in its
lane, then **speeding back up to 138 px/s as the dummy lunged at it**, and
being hit for the full 500. Cause: the path zone tests the dummy's
*predicted* position (its velocity times the unit's look-ahead). A lunge is
so fast that the prediction lands behind the car, so the car stops sensing
the dummy, is no longer aware, and carries on as if it were not there.

- `sees` is true if **either** the dummy's actual position **or** its
  predicted position is in the path zone. Prediction can only add to what a
  car senses, never take away.
- A committed car's lock is released only once the dummy's **actual**
  position is behind the car's centre (it has passed the dummy). It is never
  released because of the predicted position. A released car returns to its
  lane as now.
- Nothing else changes. With this, a dummy that stands in a lane and lunges
  at an aware car meets it unsure and cautious (about 0.3 of cruise).

## 7. A car stays slow until its swerve is complete, and stays out until it is past (added after the third build)

The third build (run `20261008-023803`) passed all 41 checks, but the
measured sweep showed two things the checks had let through.

- **Standing in the lane and lunging still paid well.** Lunging from 60 to
  160 px landed on a sedan's nose for 315 to 380 of a possible 500. The car
  commits at its commit line, immediately returns to cruise and ignores the
  dummy, but it has not yet moved out of its lane, so a straight lunge meets
  its nose while it is speeding up.
- **A dummy standing still was being clipped.** The lock was released as
  soon as the dummy was behind the car's centre; the car cut back into its
  lane and its flank caught the dummy (9 of 14 cars on level 1).

Rules:

- A committed car stays at its **unsure** speed (with the caution factor)
  until its swerve is **complete**: its sideways offset has reached the line
  it committed to (within 2 px). Only then does it return to cruising speed
  and ignore the dummy. A car that cannot complete its swerve brakes as
  before.
- A lock is released only once the dummy's actual position is **fully
  behind the car**: behind its rear edge by more than the dummy's radius.
  Until then the car holds its offset. This replaces the "behind the car's
  centre" wording of section 6.
- Result: a straight lunge down the lane meets a slow car (during the
  swerve) or passes beside it (after the swerve). To hit a committed car at
  full speed the dummy has to move into the line the car has chosen, which
  is the bait: wait for it to commit and swing out, then lunge into its new
  line. A dummy that just stands in a lane is not hit.

## Not in this change

Quotas, health, the damage table, levels, learning (the delay does not yet
shrink as units learn), the chevron appearing on detection, a cue for the
hatchback's flip, the level 3 jam breaker.

**Working pillar wording, proposed by the assistant and not yet confirmed by
Lawrence:** "There is always a way to outsmart the vehicle."
