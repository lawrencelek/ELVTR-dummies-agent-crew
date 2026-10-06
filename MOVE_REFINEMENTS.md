# DUMMIES — Move Refinements

A running log of how the dummy's movement should feel, and what changes as a
result. Newest entry at the top. Nothing here is implemented until its status
says so.

Status values: **noted** (Lawrence's playtest observation), **proposed**
(assistant suggestion, not confirmed), **confirmed** (Lawrence decided),
**implemented**, **tested**.

## Current build (baseline)

From the crew run `20261006-185615`, values chosen by the Rules Designer agent.

| Move | Value | How it behaves now |
|------|-------|--------------------|
| Walk to run | 90 to 190 px/s over 0.6 s | Speed ramps in a straight line while a direction is held; drops straight back to walk speed on release |
| Lunge | 130 px in 0.2 s (650 px/s) | Constant speed for the whole lunge, then a dead stop |
| Recovery after a lunge | 0.7 s | Complete freeze: no movement, no lunge, then full control returns instantly |
| Reset after destruction | 1.5 s | Fresh body at the start position |

## Entries

### MR-03 — Road and car are too large; use the Testpad's scale

- **Date:** 6 October 2026
- **Source:** Lawrence, comparing the crew greybox with his earlier Testpad
- **Status:** noted
- **Observation (Lawrence's words):** "the road and car are too large as
  well. This is a better scale."
- **Crew greybox now:** 960 x 540 world, one road 160 px wide, sedan 80 x 40,
  dummy radius 10. The sedan is about 8% of the world's width and the single
  road fills 30% of its height.
- **Testpad (read from a screenshot, not from its code):** a grid of roughly
  six by five lane cells in the play field, several vehicles on screen at
  once, vehicles around 7% of the field's width, dummy drawn nearly as wide
  as a car is tall.
- **Not yet known:** the Testpad's real numbers. Its code has not been
  shared with this project yet.

### MR-02 — Diagonal movement covers more ground than straight movement

- **Date:** 6 October 2026
- **Source:** Lawrence
- **Status:** noted; **which build this refers to is unconfirmed**
- **Observation (Lawrence's words):** "the diagonal covers much more ground
  than the simple up or down (it's the 'diagonal' hack problem)."
- **Measured in the crew greybox:** not present. Holding up, right, or
  up-and-right for 1 second each moves the dummy 160.8 px. Lunge distance is
  also equal in all eight directions. Both are enforced by automated checks.
- **Likely location:** the Testpad, if it adds the horizontal and vertical
  speeds without normalising. Unverified until its code is available.
- **Constraint:** equal speed and equal lunge distance in all eight
  directions is a confirmed decision (DECISIONS.md, entry 3).

### MR-01 — Recovery pause after a lunge is too long; movement should be tweened

- **Date:** 6 October 2026
- **Source:** Lawrence, first hands-on play of the greybox
- **Status:** noted
- **Observation (Lawrence's words):** "I pause for too long after lunging.
  It's not a bad idea, but movement should be tweened."
- **What is kept:** the idea of a pause after a lunge. The GDD requires it:
  "a miss causes a recovery delay."
- **What is wrong now:** the 0.7 s recovery is a hard freeze, and every
  transition is a step change (lunge starts and stops at full speed; control
  snaps back on).

**Proposed interpretation (not confirmed):**

| # | Change | Detail |
|---|--------|--------|
| a | Shorter recovery | Reduce 0.7 s; a value around 0.35 to 0.45 s to try first |
| b | Ease the lunge | Fast start, decelerating into the landing (ease-out), same total distance and duration |
| c | Ease out of recovery | Instead of freeze-then-full-speed, movement blends back in over the recovery window |
| d | Ease stopping | Releasing a direction slows the dummy over a short time instead of stopping dead |

**Constraints any change must keep (already confirmed decisions):**

- Lunge distance stays identical in all eight directions.
- Total movement speed stays identical in all eight directions.
- No midair steering during a lunge.
- A missed lunge still costs the player something.
- Logic stays deterministic; tweening is computed in `sim.js`, not only drawn.

**Open questions for Lawrence:**

1. Does "tweened" mean the lunge and recovery (b, c), ordinary walking and
   stopping (d), or all of it?
2. During recovery, should the dummy be fully frozen for a shorter time, or
   able to move slowly straight away?
3. Should the recovery differ between a miss and a hit? The GDD only requires
   it after a miss.

**Effect on the crew:** these become changes to `SLICE_BRIEF.md` and the
Designer's parameters (new fields such as an easing curve and a stop time),
then a re-run of the crew. The checks `miss_recovery_delay` and
`lunge_distance_equal_8_directions` would need updating to match.
