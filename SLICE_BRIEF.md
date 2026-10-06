# DUMMIES — Vertical Slice Brief (input to the crew)

This file is the human-written input to the three-agent crew, together with
`baseline/dummies-testpad.html`. Everything downstream (specification, game
code, QA report) is produced by the agents.

## The game

DUMMIES is a single-player, top-down 2D browser game for an exhibition, by
Lawrence Lek. You are a FARSIGHT crash-test dummy in SHENZHEN SMART CITY, NEW
ECONOMIC ZONE, CHINA, 20XX. "You are buying your freedom by destroying your
body." Bait self-driving cars and lunge into their path. Damage earns score;
destroyed bodies fulfil quotas and advance certification toward release.

Intended player: a fifteen-year-old at an exhibition with a friend shouting
suggestions over their shoulder. Move in eight directions, one button to
lunge.

## The baseline: the Testpad

`baseline/dummies-testpad.html` is Lawrence's earlier hand-directed prototype.
It is the reference for scale, feel, look and systems. **Port it; do not
redesign it.** Keep, with the same behaviour and numbers unless this brief
says otherwise:

- The 900 x 620 canvas, the 820 x 540 hall, dummy size, vehicle sizes, lunge
  distance. Lawrence has confirmed this scale.
- Six vehicle classes (sedan, van, sports, bus, wagon, hatch) with their
  detect / margin / predict / brakeLead dials, and the twelve-unit fleet.
- Fleet learning: contacts raise a unit's dials; files brief, adapt and close.
- Commitment: the car locks a side at its commit line and cannot take it back
  (the hatchback may flip once).
- Braking rules, including brake-first classes and the bus that cannot swerve.
- Caution: cars lose speed when the dummy runs.
- Service: stand still and the body is repaired.
- Severity by closing speed and face: front pays, side pays a quarter, rear
  pays nothing.
- Report cards: behaviour signatures and the authored report bank, word for
  word.
- The look: colours, HUD (integrity bar, quota pips), cards, attract screen,
  perception overlay with its toggle, restart button.

## What changes from the Testpad

1. **Three levels replace the eight-shift ladder** (see below).
2. **Real-time units.** The Testpad moves a fixed number of pixels per frame,
   so it runs faster on high-refresh screens. All speeds become pixels per
   second (Testpad per-frame values x 60) and every update is scaled by `dt`.
3. **Seeded randomness.** No `Math.random()`. The same seed and the same
   inputs must give the same run.
4. **No lunge chaining.** A lunge starts only on a fresh press. Holding the
   lunge button down must not start another lunge.
5. **Lunge direction.** The direction held at the moment of the press; if no
   direction is held, the dummy's last facing direction (not always "up").
6. **Tweened lunge and recovery** (Move Refinements MR-01). The lunge eases
   out: fast at the start, slowing into the landing, same total distance.
   After a lunge there is a short recovery (between 0.2 and 0.5 s) in which
   the dummy can already move, but its movement speed is multiplied by an
   eased factor that rises from 0 to 1. No hard freeze.
7. **Certification follows the GDD.** The run is won by cumulative write-offs
   across the run reaching a certification target that is larger than the sum
   of the three level quotas, and attainable within the vehicles allocated.
   The twelve-cell licence sheet stays as a display of fleet learning.
8. **Cars never drive through each other** (see car-to-car rule below).
9. **No network.** Remove the Google Fonts link; keep the font names as the
   first choice in the font stack with system monospace fallbacks.

Out of scope (do not add): price tiers, moods, new vehicle classes, audio,
new art, extra levels.

## The three levels

All three use the same hall. The dummy can walk anywhere in the hall on every
level. Each level has a quota of bodies to destroy, an allocation of vehicles
and a pool (how many fleet units are in rotation, in fleet order).

1. **ROAD.** One horizontal road across the hall. All traffic travels left
   to right. Nothing on this level makes traffic stop: there is no junction
   and no cross traffic, so undisturbed cars flow continuously. Cars react
   only to the dummy. This is the teaching level: small pool, low quota.
2. **CROSS JUNCTION.** A horizontal road and a vertical road crossing in the
   middle of the hall. No traffic lights. Both roads are one-way with two
   lanes each: the horizontal road runs left to right, the vertical road top
   to bottom. There is no oncoming traffic on levels 1 and 2. Cars must never
   collide with or pass through each other: they give way at the junction and
   queue behind a waiting car.
3. **CRASH TEST CENTRE.** The Testpad's open hall: a free-for-all with
   vehicles entering from all four edges at any position, the full
   twelve-unit pool, highest quota.

**Solid cars (all levels; change request CR-001).** Every car is a solid
rectangle on all four sides. The dummy can never be inside a car: if they
overlap, the dummy is pushed out along the shortest way, and a moving car
pushes the dummy ahead of it or aside. The dummy never blocks or slows a car
by being solid. Cars never overlap each other, on any level, whatever the
dummy does. A car only moves sideways into space that is free of other cars.

**Road limits (levels 1 and 2; CR-001).** Outside the lanes on each side of a
road is a hard shoulder that cars may use when swerving. Beyond the shoulder
is a barrier: no part of a car may ever cross it. A car that cannot swerve far
enough to clear the dummy, because of the barrier or another car, brakes
instead. The dummy crosses shoulders and barriers freely. Both are drawn.

**Damage (CR-001, corrected by CR-002).** Damage comes from the vehicle, not
from the dummy's speed. Each class has a mass. For every contact:

`damage = min(maxPay, round(perMomentum x vehicleSpeed x mass x faceFactor x lungeFactor))`

- `vehicleSpeed`: the car's own forward speed at that moment (`car.speed`).
  A braking car hits more softly; a stopped car does no damage.
- `faceFactor`: which face of the car's rectangle the dummy reached, judged by
  geometry from where the dummy came from. Nose (front edge) `faceNose`;
  front corner `faceCorner`; flank (either long side, anywhere along it)
  `faceFlank`; tail and rear corners `faceTail` (zero).
- `lungeFactor`: 1 if the dummy is not lunging. If it is,
  `1 + lungeBonus x c`, with `c = -(d . h)`, where `d` is the unit direction
  of the dummy's velocity and `h` the car's direction of travel. `c` is +1
  for a lunge straight against the car (head-on), 0 across it, -1 with it.
  The speed of the lunge does not enter the formula.
- Score for the hit equals the damage. Where the Testpad uses severity
  (report signatures, shake) use damage / maxPay.
- Must hold: for a given car a head-on lunge into the nose is the
  highest-paying hit; lunging the way the car is travelling pays less than
  standing still on the same face; the tail pays nothing.
- Calibrate so a head-on lunge into a cruising sedan's nose takes roughly half
  of a fresh body, and `0 < lungeBonus < 1`.
- A fast lunge must not tunnel: the face is judged from the dummy's position
  relative to the car before contact.

**Car-to-car rule (all levels).** Every car has a serial number that
increases with each spawn. A car gives way only to cars with a lower serial
number: if continuing would bring it into contact with such a car, it slows
or stops until the way is clear. The car with the lowest serial number never
waits for another car, so traffic can never deadlock. Giving way to another
car does not light the brake lights' "braking for the dummy" logic
differently: any slowing shows brake lights.

**Level flow.** A level ends when its allocation has been spawned and no cars
remain in the hall. Then, in this order: Non-compliant (quota was met in an
earlier level, and this whole level had no lunge and no contact); then
Decommissioned (level quota missed, or level 3 finished without reaching the
certification target); otherwise a "level complete" card and the next level.
Licensed: the write-off that reaches the certification target wins at once.
Ending texts stay as in the Testpad, adjusted only where they mention "all
twelve units".

## Fixed technical contract (so automated checks can run)

The Builder must output exactly two files.

### `sim.js` — all game rules, no DOM, no timers, no clock, no Math.random

Loadable in a browser (`window.DummiesSim`) and in Node (`module.exports`).
Exports:

- `PARAMS` — a literal copy of the Designer's specification `params`.
- `Damage` — the damage-assessment module (CR-002). Two pure functions with no
  state and no side effects; every hit in the game is scored by them and
  nowhere else:
  - `Damage.contactFace(car, px, py)` -> `"nose" | "corner" | "flank" | "tail"`.
    `car` has `x, y, dirX, dirY, length, width`; `(px, py)` is the dummy's
    centre at the last moment it was outside the car's rectangle. With `a`
    the offset along the car's direction and `b` across it: nose if
    `a > length/2` and `|b| <= width/2`; corner if `a > length/2` and
    `|b| > width/2`; flank if `|a| <= length/2`; tail otherwise.
  - `Damage.assess(params, contact)` ->
    `{ mass, faceFactor, lungeFactor, damage }`, where `contact` is
    `{ cls, vehicleSpeed, dirX, dirY, face, dummyVx, dummyVy, lunging }`.
- `Vehicles` — the vehicle-behaviour module (CR-002). All spawning, speeds,
  perception, commitment and swerving, braking, give-way, road limits and
  removal live in it. It exposes at least `Vehicles.step(state, dt)` (advance
  every car one step) and `Vehicles.cruiseSpeed(params, cls)` (a class's
  undisturbed speed). `step` calls it; nothing outside it moves a car.
- `createSim(options)` -> `state`. Options, all optional:
  `seed` (number, default 1), `level` (1, 2 or 3, default 1),
  `traffic` (boolean, default true; false means no car is ever spawned),
  `autostart` (boolean, default false; true starts directly in mode "play",
  false starts in mode "attract").
- `step(state, input, dt)` -> mutates and returns `state`.
  `input = { dx: -1|0|1, dy: -1|0|1, lunge: boolean, confirm: boolean }`.
  `lunge` and `confirm` are "button is down" flags; `step` detects the fresh
  press itself. `confirm` starts the game from "attract" and dismisses cards.
  `dt` is seconds; checks use 1/60 and 1/120. `dy = -1` is up the screen.

`state` is one plain JSON-serialisable object. `step` must derive everything
from it (checks overwrite fields between steps). Required fields:

```
state.params            same values as PARAMS
state.seed, state.time
state.mode              "attract" | "play" | "card" | "over"
state.ending            null | "licensed" | "decommissioned" | "noncompliant"
state.card              null | { kind, title, sub, line }
state.level             1 | 2 | 3
state.quota             this level's quota
state.allocation        this level's vehicle allocation
state.vehiclesSpawned   vehicles spawned so far this level
state.levelWriteOffs    bodies destroyed this level
state.bodiesDestroyed   bodies destroyed this run (certification count)
state.score
state.dummy = {
  x, y, vx, vy,         position px, velocity px/s
  facing: { x, y },     unit vector
  health,               maxHealth down to 0; the only record of damage
  lunging: boolean,
  recovering: boolean,  true for dummy.recoveryTime after a lunge ends
  serviceOn: boolean }
state.cars = [ {
  serial,               integer, increases with every spawn in the run
  id, cls,              fleet unit id and class key
  x, y,                 centre of the car's rectangle as drawn
  dirX, dirY,           travel direction, one of (1,0) (-1,0) (0,1) (0,-1)
  length, width,        length is along the travel direction
  speed,                current speed, px/s
  sees: boolean,        dummy is inside its detection zone
  lock: -1 | 0 | 1,     committed side, 0 = not committed
  braking: boolean,     true on every step in which it is slowing or held
  hit: boolean } ]      this car has already had its impact
state.lastImpact = null | {   how the most recent contact was scored (CR-002)
  time, serial, id, cls,
  face,                 "nose" | "corner" | "flank" | "tail"
  vehicleSpeed, dirX, dirY, dummyVx, dummyVy, lunging,
  mass, faceFactor, lungeFactor, damage }
```

Rules the checks rely on:

- With `autostart: true` the first step is already normal play.
- `mode "play"` is the only mode in which the dummy and cars move.
- A body destroyed: `bodiesDestroyed` and `levelWriteOffs` each rise by one,
  then `mode` becomes "card" (or "over" with `ending: "licensed"` if the
  certification target is reached). A fresh `confirm` press dismisses the
  card and play resumes with `dummy.health === maxHealth`.
- An ending sets `state.ending` and `mode "over"`. A fresh `confirm` press in
  "over" restarts the run at level 1 in "attract".
- Level end is evaluated in "play" whenever
  `vehiclesSpawned >= allocation` and `cars` is empty.
- An impact needs the dummy's circle to touch the car's rectangle. Its face
  comes from `Damage.contactFace` and its damage from `Damage.assess`; the
  result is stored in `state.lastImpact`, health falls by exactly
  `lastImpact.damage` and score rises by the same. Tail contact changes
  neither. Each car has at most one impact (`hit`). The impact is judged
  before the dummy is pushed out of the car.
- After every step the dummy's circle does not reach more than 1 px into any
  car's rectangle, and (inside the canvas) no two cars' rectangles overlap.
- Dummy at full health: reach multiplier is exactly 1, so a lunge covers
  exactly `dummy.lungeDistance` while `lunging` is true, in any direction,
  at any `dt`. The dummy is clamped to the hall.

### `index.html` — rendering and input only

Loads `sim.js` with `<script src="sim.js"></script>`, keeps the Testpad's
page layout and drawing, reads the keyboard (WASD and arrows move, Space
lunges, any key or a click/tap confirms), calls `DummiesSim.step` with a
fixed 1/60 s timestep and an accumulator, and draws from `state`. Screen
shake and floating score numbers are drawing effects and may use
`Math.random()`. Must work opened directly from disk with no network
requests: no `http://` or `https://` anywhere in the file. Draw each level's
roads so the layout is readable; show the level name and number.

### Parameter schema the Designer must fill (`params`)

```
world:   { width: 900, height: 620 }
hall:    { x: 40, y: 40, w: 820, h: 540 }
dummy:   { radius, walkSpeed, runSpeed, rampTime, lungeDistance,
           lungeDuration, lungeCooldown, recoveryTime, wearFloor,
           wearSpeedLoss, maxHealth, writeOffBonus, startX, startY }
impact:  { perMomentum, maxPay, faceNose, faceCorner, faceFlank, faceTail,
           lungeBonus }
caution: { max }
service: { delay, fullTime }
classes: { sedan: { label, width, length, speed, mass, swerve, commitFrac, flip,
                    brakeFirst, base: {detect, margin, predict, brakeLead},
                    step: {...}, cap: {...} },
           van, sports, bus, wagon, hatch }
fleet:   [ { id, cls } x 12 ]
closeCost: [ 12 integers ]
levels:  [ { id: 1, kind: "road",  name, quota, allocation, pool,
             spawnInterval: { min, max },
             road:  { y, halfWidth, shoulder, laneYs: [ ... ] } },
           { id: 2, kind: "cross", name, quota, allocation, pool,
             spawnInterval: { min, max },
             roadH: { y, halfWidth, shoulder }, roadV: { x, halfWidth, shoulder } },
           { id: 3, kind: "hall",  name, quota, allocation, pool,
             spawnInterval: { min, max } } ]
certificationTarget: integer
```

`halfWidth` covers the lanes; `shoulder` is the width of the hard shoulder on
each side; the barriers are at the road centre line plus and minus
(`halfWidth` + `shoulder`).

Units: pixels, seconds, pixels per second. Testpad per-frame speeds
(`walk`, `run`, class `sp`, `maxClosing`) are multiplied by 60. Testpad
`predict` is already seconds of look-ahead and is unchanged. Distances
(`detect`, `margin`, sizes, `lungeDist`) and times are unchanged.
