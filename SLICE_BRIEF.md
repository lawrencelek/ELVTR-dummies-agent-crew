# DUMMIES — Slice Brief (input to the crew)

This file is the human-written input to the three-agent crew. It is the only
thing the Rules Designer agent receives. Everything downstream (specification,
game code, QA report) is produced by the agents.

## The game

DUMMIES is a single-player, top-down 2D browser game for an exhibition, by
Lawrence Lek. You are a FARSIGHT crash-test dummy in SHENZHEN SMART CITY, NEW
ECONOMIC ZONE, CHINA, 20XX. "You are buying your freedom by destroying your
body." Bait self-driving cars and lunge into their path. Damage earns score;
destroyed bodies are replaced.

Intended player: a fifteen-year-old at an exhibition with a friend shouting
suggestions over their shoulder. Controls must be understood instantly:
move in eight directions, one button to lunge.

## The slice: one road, one sedan model, one dummy

Greybox only. Pure top-down projection. Flat shapes for dummy, car, road.
No facades, no perspective, no decorative assets, no audio.

Include:

1. Eight-direction movement. Holding a direction accelerates from walking to
   running. Total speed is identical in every direction (diagonals normalised).
2. Lunge in the facing direction, with no midair steering. Lunge distance is
   identical in every direction.
3. Recovery delay after a lunge that misses (no movement, no lunge).
4. One sedan at a time (model SED-03-001) travelling left to right along a
   horizontal road; a new one appears after the previous one leaves.
5. Detection wedge: a visible light wedge showing the car's field of view.
6. Route chevron: appears on detection, shows the car's intended route, and
   keeps updating until commitment.
7. Commitment: at the commit ring the chevron visibly locks and steering stops
   changing. Speed can still change after commitment.
8. Brake lights whenever the car is slowing. On detection the sedan eases
   off toward its minimum speed while it swerves, so brake lights are seen in
   every detected encounter.
9. Collision damage and score (simplified greybox damage, labelled as such).
10. Body destruction at zero health, then a fresh body (reset).

Sedan behaviour (from the GDD vehicle table): "Swerves with moderate
clearance." Player response: "Intercept its locked route." The bait: walk
parallel to the car, walk away from its path, and when the chevron locks,
lunge back into that path.

Relevant GDD rules:

- Rear contact gives no damage and no score.
- Count one impact per dummy-vehicle contact episode, re-arming after
  separation.
- Two ordinary head-on hits destroying a fresh body is a provisional balance
  target.
- Runtime uses deterministic, seeded code. No language-model calls during play.

Excluded from this slice (do not add): multiple vehicle classes, fleet
learning, moods, automatic service, shifts and quotas, certification and
endings, narrative banks, finished art, audio, elaborate UI.

## Fixed technical contract (so automated checks can run)

The Builder must output exactly two files.

### `sim.js` — pure game logic, no DOM, no timers, no Math.random

Loadable both in a browser (`window.DummiesSim`) and in Node
(`module.exports`). It exports:

- `createSim(options)` -> `state`. `options = { seed: number, traffic: boolean }`
  (`traffic: false` means no car is ever spawned; default true).
- `step(state, input, dt)` -> mutates and returns `state`.
  `input = { dx: -1|0|1, dy: -1|0|1, lunge: boolean }`, `dt` in seconds
  (checks use dt = 1/60). `dy = -1` is up the screen.
- `PARAMS` — the parameter object, copied exactly from the Designer's
  specification `params`.

`state` is a plain JSON-serialisable object with at least:

```
state.params            // same values as PARAMS
state.time              // seconds
state.score             // number
state.bodiesDestroyed   // integer
state.dummy = { x, y, facing: {x, y} /* unit vector */, speed,
                mode: "idle" | "lunging" | "recovering" | "destroyed",
                health }
state.car = null | { x, y, heading /* radians, 0 = +x */, speed,
                mode: "cruising" | "detected" | "committed",
                braking: boolean,
                route: null | { x, y } /* unit vector of intended heading */ }
```

Checks may directly overwrite `state.dummy.x`, `state.dummy.y` and
`state.car` fields between steps, so `step` must derive everything from
`state` and not from hidden closures.

### `index.html` — rendering and input only

Loads `sim.js` with a plain `<script src="sim.js">`, draws on one `<canvas>`,
reads the keyboard (arrow keys and WASD to move, Space to lunge), and calls
`DummiesSim.step` at a fixed timestep. Must work when opened directly from
disk (file://) with no server and no network requests. Shows health and score
as plain labels and a one-line control prompt.

### Parameter schema the Designer must fill (`params`)

```
world:  { width: 960, height: 540 }
road:   { y: 270, halfWidth }
dummy:  { radius, walkSpeed, runSpeed, accelTime, lungeDistance,
          lungeDuration, recoveryTime, maxHealth, startX, startY }
car:    { length, width, cruiseSpeed, minSpeed, detectRange,
          detectHalfAngleDeg, commitDistance, swerveClearance,
          maxSteerRateDeg, brakeDecel, respawnDelay }
damage: { base, perSpeed, lungeMultiplier }
reset:  { delay }
```

Units: pixels, seconds, pixels per second, degrees where named.
