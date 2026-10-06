CHANGE REQUEST. Revise the released specification below so that it implements the change request and the updated brief. Return the complete specification in the same JSON shape. Keep every value, rule and acceptance criterion that the change does not touch exactly as it is; rewrite or remove the ones it replaces; add numbered rules under changed_rules and new acceptance criteria for everything new, and list the change under differences.

# CHANGE REQUEST
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


# UPDATED BRIEF
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
   middle of the hall. No traffic lights. Traffic arrives on both roads. Cars
   must never collide with or pass through each other: they give way at the
   junction and queue behind a waiting car.
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

**Damage from momentum (CR-001).** Each class has a mass. For a paying impact,
damage = round(impact.perMomentum x closing speed x class mass x face factor),
capped at impact.maxPay. Closing speed is the size of the car's velocity
minus the dummy's velocity, in px/s. Score for the impact equals the damage.
This replaces the Testpad's severity curve; where the Testpad uses severity
(report signatures, shake) use damage / maxPay. Tune perMomentum and the
masses so that a full-speed lunge across a sedan's nose takes roughly half of
a fresh body, a bus hits hardest per unit of speed, and a stationary dummy
struck by a cruising sedan loses only a little.

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
- An impact needs the dummy's circle to touch the car's rectangle; face is
  judged as in the Testpad. Rear contact changes neither health nor score.
  Each car has at most one impact (`hit`). The impact is judged before the
  dummy is pushed out of the car.
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
impact:  { perMomentum, maxPay, faceFront, faceSide, faceRear }
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


# RELEASED SPECIFICATION
{
  "game": "DUMMIES",
  "slice": "three-level vertical slice ported from the Testpad",
  "params": {
    "world": {
      "width": 900,
      "height": 620
    },
    "hall": {
      "x": 40,
      "y": 40,
      "w": 820,
      "h": 540
    },
    "dummy": {
      "radius": 13,
      "walkSpeed": 81,
      "runSpeed": 162,
      "rampTime": 1.0,
      "lungeDistance": 164,
      "lungeDuration": 0.3,
      "lungeCooldown": 0.55,
      "recoveryTime": 0.35,
      "wearFloor": 0.45,
      "wearSpeedLoss": 0,
      "maxHealth": 2300,
      "writeOffBonus": 2500,
      "startX": 150,
      "startY": 500
    },
    "impact": {
      "maxClosing": 792,
      "yieldBase": 1700,
      "yieldCurve": 2.2,
      "faceFront": 1,
      "faceSide": 0.25,
      "faceRear": 0
    },
    "caution": {
      "max": 0.4
    },
    "service": {
      "delay": 1.5,
      "fullTime": 30.0
    },
    "classes": {
      "sedan": {
        "label": "Sedan",
        "width": 34,
        "length": 62,
        "speed": 138,
        "swerve": true,
        "commitFrac": 0.5,
        "flip": false,
        "brakeFirst": false,
        "base": {
          "detect": 212,
          "margin": 44,
          "predict": 0.3,
          "brakeLead": 0.45
        },
        "step": {
          "detect": 30,
          "margin": 11,
          "predict": 0.07,
          "brakeLead": 0.04
        },
        "cap": {
          "detect": 400,
          "margin": 190,
          "predict": 0.72,
          "brakeLead": 0.68
        }
      },
      "van": {
        "label": "Van",
        "width": 38,
        "length": 76,
        "speed": 120,
        "swerve": true,
        "commitFrac": 0.42,
        "flip": false,
        "brakeFirst": true,
        "base": {
          "detect": 232,
          "margin": 38,
          "predict": 0.26,
          "brakeLead": 0.74
        },
        "step": {
          "detect": 28,
          "margin": 10,
          "predict": 0.06,
          "brakeLead": 0.06
        },
        "cap": {
          "detect": 410,
          "margin": 188,
          "predict": 0.64,
          "brakeLead": 0.95
        }
      },
      "sports": {
        "label": "Sports",
        "width": 30,
        "length": 58,
        "speed": 192,
        "swerve": true,
        "commitFrac": 0.3,
        "flip": false,
        "brakeFirst": false,
        "base": {
          "detect": 190,
          "margin": 31,
          "predict": 0.36,
          "brakeLead": 0.28
        },
        "step": {
          "detect": 34,
          "margin": 12,
          "predict": 0.09,
          "brakeLead": 0.03
        },
        "cap": {
          "detect": 400,
          "margin": 186,
          "predict": 0.86,
          "brakeLead": 0.5
        }
      },
      "bus": {
        "label": "Bus",
        "width": 46,
        "length": 108,
        "speed": 108,
        "swerve": false,
        "commitFrac": 0.5,
        "flip": false,
        "brakeFirst": true,
        "base": {
          "detect": 258,
          "margin": 34,
          "predict": 0.22,
          "brakeLead": 0.88
        },
        "step": {
          "detect": 26,
          "margin": 9,
          "predict": 0.05,
          "brakeLead": 0.07
        },
        "cap": {
          "detect": 420,
          "margin": 184,
          "predict": 0.56,
          "brakeLead": 1.15
        }
      },
      "wagon": {
        "label": "Wagon",
        "width": 36,
        "length": 72,
        "speed": 144,
        "swerve": true,
        "commitFrac": 0.58,
        "flip": false,
        "brakeFirst": false,
        "base": {
          "detect": 244,
          "margin": 58,
          "predict": 0.46,
          "brakeLead": 0.5
        },
        "step": {
          "detect": 32,
          "margin": 14,
          "predict": 0.1,
          "brakeLead": 0.04
        },
        "cap": {
          "detect": 430,
          "margin": 200,
          "predict": 0.96,
          "brakeLead": 0.72
        }
      },
      "hatch": {
        "label": "Hatch",
        "width": 30,
        "length": 54,
        "speed": 156,
        "swerve": true,
        "commitFrac": 0.6,
        "flip": true,
        "brakeFirst": false,
        "base": {
          "detect": 204,
          "margin": 41,
          "predict": 0.28,
          "brakeLead": 0.44
        },
        "step": {
          "detect": 30,
          "margin": 11,
          "predict": 0.07,
          "brakeLead": 0.04
        },
        "cap": {
          "detect": 400,
          "margin": 188,
          "predict": 0.74,
          "brakeLead": 0.66
        }
      }
    },
    "fleet": [
      {
        "id": "SDN-01",
        "cls": "sedan"
      },
      {
        "id": "SDN-02",
        "cls": "sedan"
      },
      {
        "id": "VAN-07",
        "cls": "van"
      },
      {
        "id": "SPT-11",
        "cls": "sports"
      },
      {
        "id": "BUS-06",
        "cls": "bus"
      },
      {
        "id": "SDN-04",
        "cls": "sedan"
      },
      {
        "id": "WGN-05",
        "cls": "wagon"
      },
      {
        "id": "HTB-09",
        "cls": "hatch"
      },
      {
        "id": "VAN-12",
        "cls": "van"
      },
      {
        "id": "SPT-03",
        "cls": "sports"
      },
      {
        "id": "WGN-08",
        "cls": "wagon"
      },
      {
        "id": "HTB-10",
        "cls": "hatch"
      }
    ],
    "closeCost": [
      4,
      4,
      3,
      3,
      3,
      2,
      2,
      2,
      2,
      1,
      1,
      1
    ],
    "levels": [
      {
        "id": 1,
        "kind": "road",
        "name": "ROAD",
        "quota": 2,
        "allocation": 14,
        "pool": 3,
        "spawnInterval": {
          "min": 3.0,
          "max": 5.0
        },
        "road": {
          "y": 310,
          "halfWidth": 64,
          "laneYs": [
            284,
            336
          ]
        }
      },
      {
        "id": 2,
        "kind": "cross",
        "name": "CROSS JUNCTION",
        "quota": 3,
        "allocation": 20,
        "pool": 6,
        "spawnInterval": {
          "min": 2.8,
          "max": 4.5
        },
        "roadH": {
          "y": 310,
          "halfWidth": 64,
          "laneYs": [
            284,
            336
          ]
        },
        "roadV": {
          "x": 450,
          "halfWidth": 64,
          "laneXs": [
            414,
            486
          ]
        }
      },
      {
        "id": 3,
        "kind": "hall",
        "name": "CRASH TEST CENTRE",
        "quota": 5,
        "allocation": 28,
        "pool": 12,
        "spawnInterval": {
          "min": 2.2,
          "max": 3.8
        },
        "entryLaneMin": 200,
        "entryLaneMaxY": 520,
        "entryLaneMaxX": 800
      }
    ],
    "certificationTarget": 11,
    "carToCar": {
      "lookAheadBase": 20,
      "lookAheadTime": 0.45,
      "sidePad": 4,
      "otherLookTime": 0.4,
      "decel": 600,
      "accel": 360,
      "holdGap": 8,
      "spawnClearPad": 20
    }
  },
  "level_design": [
    {
      "id": 1,
      "intent": "Teaching level: one road, slow steady traffic, three units (SDN-01, SDN-02, VAN-07), quota 2 of 14 cars. Expected duration about 70 to 90 s.",
      "layout": "Horizontal road centred y=310, halfWidth 64 (y 246 to 374). Two eastbound lanes at y=284 and y=336. About 206 px of walkable ground above and below. No junction, no cross traffic. Top-left corner (x<200, y<200) is clear of road.",
      "spawning": "Cars spawn fully outside the left hall edge (centre x = 40 - length/2) on a lane picked uniformly by the seeded RNG, all with dirX=1. Interval is uniform in [3.0, 5.0] s. A car is removed once its trailing edge passes x=860. Unit is picked uniformly from the pool units not currently in the hall."
    },
    {
      "id": 2,
      "intent": "Junction level: give-way and queuing, six units, quota 3 of 20 cars. Expected duration about 80 to 110 s.",
      "layout": "Horizontal road y=310 (halfWidth 64) with eastbound lane y=336 and westbound lane y=284. Vertical road x=450 (halfWidth 64) with southbound lane x=414 and northbound lane x=486. Junction box is x 386 to 514, y 246 to 374. No lights. Ground beside the roads is walkable. Top-left corner is clear of roads.",
      "spawning": "Each spawn picks one of four approaches uniformly: eastbound from left edge, westbound from right edge, southbound from top edge, northbound from bottom edge. The car is placed fully outside the hall on its lane. Interval is uniform in [2.8, 4.5] s. Unit comes from the first 6 fleet units not currently in the hall. Give-way and queuing come only from the car-to-car rule."
    },
    {
      "id": 3,
      "intent": "Open hall free-for-all: full twelve-unit pool, quota 5 of 28 cars. Expected duration about 80 to 110 s. Certification needs 11 write-offs in total.",
      "layout": "No roads. The whole hall is open.",
      "spawning": "Each spawn picks an edge uniformly (left, right, top, bottom). The lateral coordinate is uniform in [200, 520] for y on left/right edges and uniform in [200, 800] for x on top/bottom edges. The lower bound of 200 keeps every car path out of the top-left corner. The car is placed fully outside the hall and travels straight inward. Interval is uniform in [2.2, 3.8] s. Unit is picked uniformly from the 12 units not currently in the hall."
    }
  ],
  "changed_rules": {
    "units": [
      "1. All speeds in PARAMS are px/s (Testpad per-frame x 60). Distances, times and predict are unchanged.",
      "2. Every position update is velocity * dt. Every timer decreases by dt. Per-step results must not depend on dt, apart from float rounding and ordering of events inside a step.",
      "3. The Testpad walk-to-run ramp takes rampTime seconds of real time. The service delay and fullTime are in seconds.",
      "4. state.time increases by dt on every step, in every mode."
    ],
    "randomness": [
      "1. No Math.random in sim.js. Use mulberry32 on a uint32 stored in state.rng (extra field). It is initialised from seed on createSim and on restart.",
      "2. Draw order is fixed: spawn interval, then the pending-spawn entry choice (approach or edge, then lane or lateral position), then unit. Each draw is made once and no more than needed.",
      "3. Draws are made only in mode play. Same seed and same input sequence must give a byte-identical state sequence.",
      "4. A restart from mode over re-seeds state.rng from state.seed and resets fleet learning, score and counters, so a restarted run repeats the original."
    ],
    "lunge": [
      "1. Fresh press means input.lunge is true and state.prevLunge was false. prevLunge is stored in state and updated on every step in every mode. A lunge held through a card or restart is not fresh.",
      "2. A lunge starts only if mode is play, the dummy is not lunging, the cooldown is 0 and the press is fresh. A press while blocked is discarded, not buffered. The cooldown is set to lungeCooldown at lunge start.",
      "3. Direction is normalised (dx,dy) if either is non-zero at the moment of the press. Otherwise it is dummy.facing. facing updates every play step to the normalised held direction when one is held. The initial facing is (0,-1).",
      "4. The lunge runs for lungeDuration with t = elapsed/lungeDuration clamped to [0,1] and easeOutCubic p(t) = 1 - (1-t)^3. Each step displaces the dummy by dir * lungeDistance * reach * (p(t_now) - p(t_prev)). A step that crosses t=1 uses p=1, so the total is exact at any dt.",
      "5. reach = 1 - (1 - wearFloor) * (1 - health/maxHealth). At full health reach is exactly 1. The position is clamped to the hall each step.",
      "6. Lunge velocity is reported in dummy.vx and vy as displacement / dt. While lunging, input movement is ignored."
    ],
    "recovery": [
      "1. When a lunge ends, recovering becomes true for recoveryTime (0.35 s). The dummy can move immediately.",
      "2. With u = elapsed/recoveryTime in [0,1], factor f(u) = easeOutQuad = 1 - (1-u)^2. Movement speed = normal walk/run ramp speed * f. At u>=1 recovering becomes false and the factor is 1.",
      "3. No hard freeze. A new lunge needs the cooldown to have expired, so it is possible during the last 0.10 s of recovery. The factor still applies to walking after that lunge ends.",
      "4. Recovery clears on write-off, level change and restart."
    ],
    "car_to_car": [
      "1. Every spawn takes serial = ++state.serialCounter (extra field, never reset within a run, reset on restart). Cars keep their serial for life.",
      "2. Car A yields only to cars B with B.serial < A.serial. The car with the lowest serial in the hall never yields, so no deadlock is possible.",
      "3. Look-ahead test, evaluated every play step for each B: let D = lookAheadBase + lookAheadTime * A.speed. Sweep rectangle S_A is A's rectangle extended by D in A's travel direction and widened by sidePad on each lateral side. Sweep rectangle S_B is B's rectangle extended by otherLookTime * B.speed in B's travel direction. A must yield to B if S_A intersects S_B.",
      "4. While yielding, A's target speed is 0. Exception: if B has the same direction as A, is ahead in the same lane band and the gap between rectangles is greater than holdGap, the target is B.speed (follow, do not stop). A's speed moves toward the target at decel, and never exceeds the car's normal target from the Testpad logic.",
      "5. Resume: when the test is clear for all lower-serial cars on a step, A's yield target is removed. Its speed rises toward the normal Testpad target at accel px/s^2. There is no timer or hysteresis.",
      "6. Backstop: after movement, if A's rectangle would overlap any lower-serial car's rectangle, A's advance on that step is reduced so the rectangles just touch (gap 0), and A's speed is set to min(speed, B.speed). Cars therefore never overlap lower-serial cars.",
      "7. braking is true on every step where the car is slowing or held for any reason (dummy or car), as in the Testpad brake lights.",
      "8. A spawn is delayed while a spawn rectangle inflated by spawnClearPad overlaps any car. vehiclesSpawned and the serial increment only when the car actually appears."
    ],
    "level_flow": [
      "1. Level N starts with: level, quota, allocation from params.levels[N-1]. vehiclesSpawned=0, levelWriteOffs=0, cars=[], dummy at start with full health, velocity 0, lunge and recovery cleared, levelLunged=false, levelContact=false. A new spawn interval is drawn. Fleet learning, score, bodiesDestroyed and serial persist.",
      "2. Spawn timer: nextSpawn is drawn uniformly in [spawnInterval.min, max] and decreases by dt in play. At <=0, if vehiclesSpawned<allocation, a pendingSpawn (entry and unit) is drawn once and held. It spawns as soon as it is clear and the unit is not in the hall. The next interval is then drawn. If every pool unit is in the hall, the spawn waits.",
      "3. traffic:false means no spawn timer, no spawns and no level-end check. Allocation spent is never reached.",
      "4. A car is removed when its rectangle lies wholly outside the hall beyond the edge it is travelling toward.",
      "5. Write-off: bodiesDestroyed++, levelWriteOffs++, score += writeOffBonus (as Testpad), then if bodiesDestroyed >= certificationTarget go to mode over with ending licensed. Otherwise mode card with kind writeoff. A fresh confirm dismisses it: dummy.health=maxHealth, dummy to (startX,startY), velocity 0, lunge and recovery cleared. Cars stay and play resumes.",
      "6. Level end is evaluated at the start of each play step: vehiclesSpawned >= allocation and cars empty. It is not evaluated during card or over.",
      "7. Order at level end: (a) if some earlier level had levelWriteOffs >= quota, and levelLunged is false and levelContact is false for this level, ending noncompliant. (b) else if levelWriteOffs < quota, or level is 3, ending decommissioned. (c) else card kind level with title 'LEVEL COMPLETE' and next level. A fresh confirm starts level N+1 in play. levelLunged is set on any lunge start. levelContact is set on any impact, including a rear impact.",
      "8. Level 3 finished without having reached the target is always decommissioned. Level 3 cannot end with a 'level complete' card."
    ],
    "certification_and_endings": [
      "1. Certification count is bodiesDestroyed across the run. Target is certificationTarget=11 (sum of quotas 10, total allocation 62). Reaching it wins at once with licensed, even mid-level and even if a quota is unmet.",
      "2. Quota is checked only at level end. Meeting it does not end the level early.",
      "3. Endings set state.ending and mode over, and set state.card to {kind:ending, title, sub, line} using Testpad text. Where the Testpad text mentions 'all twelve units', replace it with 'the certification target of 11 bodies'.",
      "4. Confirm in over restarts the run at level 1 in mode attract with traffic and autostart options unchanged. The twelve-cell licence sheet is display only (fleet learning) and has no effect on endings."
    ]
  },
  "unchanged_from_testpad": [
    "Canvas, hall, dummy size, vehicle sizes, lunge distance, six classes and twelve-unit fleet with detect/margin/predict/brakeLead dials.",
    "Fleet learning, file brief/adapt/close and closeCost.",
    "Commitment lock at commitFrac, hatch flip, brake-first classes, the bus that cannot swerve, caution, service repair.",
    "Severity by closing speed and face, with a single impact per car (side contact pays a quarter, rear pays nothing).",
    "Report cards, behaviour signatures and report bank word for word, HUD, attract screen, perception overlay and toggle, restart button.",
    "Cooldown length, walk to run ramp shape, writeOff bonus and score formula, cars removed when out of hall."
  ],
  "acceptance_criteria": [
    {
      "id": "AC-01",
      "text": "sim.js loads in Node and as window.DummiesSim, exports PARAMS, createSim and step, and contains no DOM access, timers, Date, performance or Math.random.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-02",
      "text": "PARAMS deep-equals state.params and contains every schema field, including world, hall, 6 classes, 12 fleet entries, closeCost with 12 integers, 3 levels and certificationTarget.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-03",
      "text": "Units: PARAMS dummy.walkSpeed=81, runSpeed=162, class speeds are 138/120/192/108/144/156 and impact.maxClosing=792. A walking dummy held right for 1 s at full speed covers the same distance at dt=1/60 and 1/120 within 1 px.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-04",
      "text": "Determinism: two runs with the same seed, level and input script produce identical JSON state at every step. Different seeds give different spawn sequences.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-05",
      "text": "With autostart:true the first step is mode play. Without it the mode is attract until a fresh confirm. With traffic:false, 3600 steps never produce a car.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-06",
      "text": "Lunge covers exactly lungeDistance (164 +/- 0.01 px) at full health in each of the 8 directions, at dt=1/60 and 1/120, starting away from walls, and while lunging is true.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-07",
      "text": "Holding lunge down for 3 s produces exactly one lunge. Releasing and pressing again after the cooldown produces a second.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-08",
      "text": "With no direction held, a lunge goes in the last facing direction (e.g. after walking left, lunge goes left). With a direction held, it goes in that direction even if facing differs.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-09",
      "text": "Lunge easing: after 0.15 s (t=0.5) the displacement is 0.875 of the total (+/-0.01), and speed is monotonically non-increasing across the lunge.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-10",
      "text": "After a lunge, recovering is true for recoveryTime (0.35 s, within 0.2 to 0.5). The dummy moves at once, and speed at 0.1 s after lunge end is below walking speed times f(0.1/0.35)+eps, approaching full speed by the end.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-11",
      "text": "Dummy is clamped to the hall on all four sides, including during a lunge.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-12",
      "text": "Level 1: all cars have dirX=1, dirY=0, and y in {284,336}. The road lies inside y 246 to 374, and no road, spawn path or road geometry touches the top-left corner region x<200, y<200 on any level.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-13",
      "text": "Level 1 flow: with the dummy idle at (60,570) and no impacts, no car ever has speed<1 px/s after its first step, and the level ends with 14 vehicles spawned.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-14",
      "text": "Level 2: cars use only lanes y 284/336 (horizontal) and x 414/486 (vertical), approaching from all four sides, over a 5 minute simulated run across several seeds.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-15",
      "text": "Over many seeds on levels 1 to 3, with random dummy inputs, no two car rectangles ever overlap in any step.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-16",
      "text": "Give-way: a higher-serial car with a lower-serial car crossing its path sets braking true and stops short without contact. It resumes once the sweep test is clear. The lowest-serial car in the hall never has its speed reduced by car-to-car logic.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-17",
      "text": "Level 3: spawns occur on all four edges across seeds, lateral coordinates are inside [200,520] or [200,800], and the pool covers all 12 units across a run.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-18",
      "text": "Per level the allocation, quota and pool equal params.levels (14/2/3, 20/3/6, 28/5/12). Spawns never exceed allocation. Level 1 only ever spawns SDN-01, SDN-02 and VAN-07.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-19",
      "text": "A write-off raises bodiesDestroyed and levelWriteOffs by one and puts the mode into card (or over/licensed at 11). Confirm dismisses it with health===maxHealth. A held confirm does not dismiss a card the same step it appears.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-20",
      "text": "Level end fires only when vehiclesSpawned>=allocation and cars is empty. Then noncompliant, decommissioned or the level card applies in that priority order, and confirm moves to the next level or restarts from over in attract.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-21",
      "text": "Certification target 11 is greater than the sum of quotas (10) and not more than the total allocation (62). A scripted state that reaches 11 write-offs yields ending licensed immediately.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-22",
      "text": "Rear contact changes neither health nor score. Each car has at most one impact. Reach multiplier at full health is exactly 1.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-23",
      "text": "index.html contains no http:// or https://, loads sim.js with a script tag, steps at fixed 1/60 with an accumulator, and runs when opened from disk with zero network requests. Fonts keep the Testpad names first with monospace fallbacks.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-24",
      "text": "index.html draws each level's roads, shows the level name and number, and keeps HUD, cards, attract screen, perception overlay and restart as Testpad. Any Math.random is only for shake or floating numbers.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-25",
      "text": "Playtest: a level lasts about 1 to 2 minutes and a competent player can meet the quota on each level and reach certification.",
      "verify_by": "playtest"
    }
  ],
  "differences": [
    {
      "kind": "change_vs_testpad",
      "text": "Eight-shift ladder replaced by three levels with quotas 2/3/5, allocations 14/20/28 and pools 3/6/12. Spawning is lane-based and seeded."
    },
    {
      "kind": "change_vs_testpad",
      "text": "Certification is cumulative: target 11 bodies replaces the shift outcome. Licensed ends the run at once; the licence sheet is display only."
    },
    {
      "kind": "change_vs_testpad",
      "text": "Fresh-press lunge, last-facing direction, easeOutCubic lunge and easeOutQuad recovery (0.35 s) are new. The cooldown is assumed to start at lunge start since the CONFIG does not say otherwise."
    },
    {
      "kind": "change_vs_testpad",
      "text": "dummy.wearSpeedLoss is set to 0 because the Testpad CONFIG has no speed wear, only reach wear (wearFloor). Feel is unchanged."
    },
    {
      "kind": "change_vs_testpad",
      "text": "Added a top-level params.carToCar group (look-ahead and accel constants) and extra level layout fields (laneXs, entryLane*). These are additions only; no schema field is renamed or removed. Extra state fields: rng, serialCounter, prevLunge, prevConfirm, levelLunged, levelContact, pendingSpawn, nextSpawn."
    },
    {
      "kind": "change_vs_testpad",
      "text": "After a write-off card, the dummy returns to the start position at full health; cars stay in place. Assumed from the Testpad respawn behaviour, which was not visible in CONFIG."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "Car-to-car give-way is a straight look-ahead test with a hard backstop, with no traffic lights, turning, or priority roads. Cars never turn or change lanes except for the Testpad dummy swerve."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "Level 3 entry lanes avoid the top-left corner; cars do enter from any of the four edges but not at every position."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "No price tiers, moods, new classes, audio, art or extra levels. Ending texts reuse the Testpad text, with 'all twelve units' replaced by the certification target."
    }
  ]
}