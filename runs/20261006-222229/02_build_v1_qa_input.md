Review this build.

# CHANGE REQUEST THIS BUILD MUST IMPLEMENT (where it differs from the Testpad, the change request wins)
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


# SPECIFICATION (from the Rules Designer)
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
      "perMomentum": 1.65,
      "maxPay": 2300,
      "faceFront": 1,
      "faceSide": 0.25,
      "faceRear": 0,
      "contactEps": 0.5,
      "pushClearance": 0.1
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
        "mass": 1.0,
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
        "mass": 1.5,
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
        "mass": 0.9,
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
        "mass": 3.0,
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
        "mass": 1.2,
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
        "mass": 0.8,
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
          "shoulder": 32,
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
          "shoulder": 32,
          "laneYs": [
            284,
            336
          ],
          "dirX": 1,
          "dirY": 0,
          "oneWay": true
        },
        "roadV": {
          "x": 450,
          "halfWidth": 64,
          "shoulder": 32,
          "laneXs": [
            414,
            486
          ],
          "dirX": 0,
          "dirY": 1,
          "oneWay": true
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
      "spawnClearPad": 20,
      "stallLimit": 6
    }
  },
  "level_design": [
    {
      "id": 1,
      "intent": "Teaching level: one road, slow steady traffic, three units (SDN-01, SDN-02, VAN-07), quota 2 of 14 cars. Expected duration about 70 to 90 s. Shoulders give the first swerve room; the barrier teaches that cars cannot always dodge.",
      "layout": "Horizontal road centred y=310, halfWidth 64 (lanes area y 246 to 374). Two eastbound lanes at y=284 and y=336. Hard shoulders y 214 to 246 and y 374 to 406 (32 px each). Barriers are lines at y=214 and y=406 across the full hall width. Cars must stay wholly between them. Walkable ground (the dummy ignores barriers) above and below. No junction, no cross traffic. Top-left corner (x<200, y<200) is clear of road, shoulder and barrier.",
      "spawning": "Cars spawn fully outside the left hall edge (centre x = 40 - length/2) on a lane picked uniformly by the seeded RNG, all with dirX=1. Interval is uniform in [3.0, 5.0] s. A car is removed once its trailing edge passes x=860. Unit is picked uniformly from the pool units not currently in the hall."
    },
    {
      "id": 2,
      "intent": "Junction level (CR-001 addendum: one-way roads): give-way at the crossing and queuing, six units, quota 3 of 20 cars. No oncoming traffic; the only conflict is the crossing in the junction. Expected duration about 80 to 110 s.",
      "layout": "Horizontal road y=310 (halfWidth 64), one-way left to right, two eastbound lanes y=284 and y=336. Vertical road x=450 (halfWidth 64), one-way top to bottom, two southbound lanes x=414 and x=486. Junction box is x 386 to 514, y 246 to 374. Each road has 32 px shoulders. Horizontal barriers at y=214 and y=406, vertical barriers at x=354 and x=546. Each barrier line is drawn only outside the other road's barrier span (gap where the crossing road opens), so the central square x 354 to 546, y 214 to 406 is open. Horizontal-travelling cars stay within y 214 to 406 along their whole path, vertical-travelling cars within x 354 to 546. No lights. Ground beside the roads is walkable. Top-left corner is clear of roads, shoulders and barriers. Nothing travels west or north on this level.",
      "spawning": "Each spawn picks one of two approaches uniformly: eastbound from the left edge (dirX=1, lane y 284 or 336 chosen uniformly) or southbound from the top edge (dirY=1, lane x 414 or 486 chosen uniformly). The car is placed fully outside the hall on its lane. Interval is uniform in [2.8, 4.5] s. Unit comes from the first 6 fleet units not currently in the hall. Give-way and queuing come only from the car-to-car rule."
    },
    {
      "id": 3,
      "intent": "Open hall free-for-all: full twelve-unit pool, quota 5 of 28 cars. Expected duration about 80 to 110 s. Certification needs 11 write-offs in total. Cars are solid and never overlap here either.",
      "layout": "No roads, shoulders or barriers. The whole hall is open.",
      "spawning": "Each spawn picks an edge uniformly (left, right, top, bottom). The lateral coordinate is uniform in [200, 520] for y on left/right edges and uniform in [200, 800] for x on top/bottom edges. The lower bound of 200 keeps every car path out of the top-left corner. The car is placed fully outside the hall and travels straight inward. Interval is uniform in [2.2, 3.8] s. Unit is picked uniformly from the 12 units not currently in the hall. A spawn also waits while an oncoming car (opposite dirX/dirY) in the hall has a lateral band overlapping the new car's band inflated by sidePad (rule car_to_car 11)."
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
      "2. Draw order is fixed: spawn interval, then the pending-spawn entry choice (approach or edge, then lane or lateral position), then unit. Each draw is made once and no more than needed. Level 2 draws approach among 2 options (0 = left, 1 = top), then lane among 2.",
      "3. Draws are made only in mode play. Same seed and same input sequence must give a byte-identical state sequence. Solidity, push-out, damage, barrier and stall-breaker logic use no random draws.",
      "4. A restart from mode over re-seeds state.rng from state.seed and resets fleet learning, score and counters, so a restarted run repeats the original."
    ],
    "lunge": [
      "1. Fresh press means input.lunge is true and state.prevLunge was false. prevLunge is stored in state and updated on every step in every mode. A lunge held through a card or restart is not fresh.",
      "2. A lunge starts only if mode is play, the dummy is not lunging, the cooldown is 0 and the press is fresh. A press while blocked is discarded, not buffered. The cooldown is set to lungeCooldown at lunge start.",
      "3. Direction is normalised (dx,dy) if either is non-zero at the moment of the press. Otherwise it is dummy.facing. facing updates every play step to the normalised held direction when one is held. The initial facing is (0,-1).",
      "4. The lunge runs for lungeDuration with t = elapsed/lungeDuration clamped to [0,1] and easeOutCubic p(t) = 1 - (1-t)^3. Each step displaces the dummy by dir * lungeDistance * reach * (p(t_now) - p(t_prev)). A step that crosses t=1 uses p=1, so the total is exact at any dt.",
      "5. reach = 1 - (1 - wearFloor) * (1 - health/maxHealth). At full health reach is exactly 1. The position is clamped to the hall each step.",
      "6. Lunge velocity is reported in dummy.vx and vy as displacement / dt (before any push-out). While lunging, input movement is ignored.",
      "7. (CR-001) The lunge is not stopped by a car. If the lunge displacement would end inside a car, the push-out of solid_cars rule 3 applies at the end of the step, so the dummy slides out along the shortest way; the lunge timer keeps running."
    ],
    "recovery": [
      "1. When a lunge ends, recovering becomes true for recoveryTime (0.35 s). The dummy can move immediately.",
      "2. With u = elapsed/recoveryTime in [0,1], factor f(u) = easeOutQuad = 1 - (1-u)^2. Movement speed = normal walk/run ramp speed * f. At u>=1 recovering becomes false and the factor is 1.",
      "3. No hard freeze. A new lunge needs the cooldown to have expired, so it is possible during the last 0.10 s of recovery. The factor still applies to walking after that lunge ends.",
      "4. Recovery clears on write-off, level change and restart."
    ],
    "car_to_car": [
      "1. Every spawn takes serial = ++state.serialCounter (extra field, never reset within a run, reset on restart). Cars keep their serial for life.",
      "2. Car A yields only to cars B with B.serial < A.serial. The car with the lowest serial in the hall never yields, so no yield-deadlock is possible.",
      "3. (CR-001 addendum, replaces earlier rule 3) Look-ahead test, evaluated every play step for each B with B.serial < A.serial that is NOT behind A: let D = lookAheadBase + lookAheadTime * A.speed. Sweep rectangle S_A is A's rectangle extended by D in A's travel direction and widened by sidePad on each lateral side. Sweep rectangle S_B is B's rectangle extended by otherLookTime * B.speed in B's travel direction. A must yield to B if S_A intersects S_B. B is 'behind A' when B has the same travel direction as A, B's lateral band (width inflated by sidePad) overlaps A's lateral band, and B's centre is behind A's centre along the travel direction. A car never yields to a car that is behind it.",
      "4. While yielding, A's target speed is 0. Exception: if B has the same direction as A, is ahead in the same lane band and the gap between rectangles is greater than holdGap, the target is B.speed (follow, do not stop). A's speed moves toward the target at decel, and never exceeds the car's normal target from the Testpad logic.",
      "5. Resume: when the test is clear for all lower-serial cars on a step, A's yield target is removed. Its speed rises toward the normal Testpad target at accel px/s^2. There is no timer or hysteresis.",
      "6. (replaces released backstop) Cars are processed in ascending serial order. After computing a car's intended displacement for the step (longitudinal then lateral), it is truncated at the first contact with the current rectangle of ANY other car (any serial), so that the rectangles just touch (gap 0). If the truncation was longitudinal, the car's speed is set to min(speed, speed component of that car along A's direction, floored at 0). Because all cars start a step non-overlapping and each move is truncated against all others, rectangles never overlap, on every level. The dummy is never an obstacle in this truncation.",
      "7. braking is true on every step where the car is slowing or held for any reason (dummy, car, truncation or swerve infeasible), as in the Testpad brake lights.",
      "8. A spawn is delayed while a spawn rectangle inflated by spawnClearPad overlaps any car. vehiclesSpawned and the serial increment only when the car actually appears.",
      "9. (CR-001) Sideways moves (swerve, hatch flip, and any lateral displacement) are made only into free space: the lateral sweep rectangle, from the car's current rectangle to its target lateral position, inflated by sidePad on all sides and extended by D in the travel direction, must not intersect any other car's rectangle (any serial). Each step the lateral displacement is also truncated by rule 6. If the check fails the lateral move for that step is not made.",
      "10. (CR-001) Swerve feasibility, used both at the commit line and every step while locked: the Testpad target lateral centre T must keep the car's whole rectangle inside the road's barrier limits (road_limits rule 3) and pass the free-space check of rule 9. At the commit line, if the preferred side is infeasible the other side is tried (the hatch may still flip once, only to a feasible side); if neither is feasible the car does not lock and brakes (stops short of the dummy using the Testpad braking rule of brake-first classes). If a locked car becomes infeasible, it keeps its lock, stops moving laterally and brakes the same way. The lock is released as in the Testpad when the dummy leaves detection.",
      "11. (CR-001, addendum) Level 3 only: a car's lateral move is also rejected if its new lateral band (rectangle width inflated by sidePad) would overlap the band of any oncoming car (opposite travel direction), and a spawn waits while its band overlaps an oncoming car's band. This prevents head-on collinear traffic. Perpendicular traffic is handled by rule 3. Levels 1 and 2 have no oncoming cars (one-way), so no oncoming-band test applies there.",
      "12. (CR-001 addendum) Lowest serial never held for good. The car with the lowest serial in the hall must not be held up indefinitely by another car. This is ensured by: rule 2 (it never yields), rule 3 (cars behind it do not make it wait and it does not wait for cars behind), and the stall breaker of rule 13.",
      "13. (CR-001 addendum) Stall breaker (backstop). Track for the lowest-serial car L the continuous time it has speed < 1 px/s while the dummy is NOT inside its detection zone (sees false). When this time reaches carToCar.stallLimit (6 s), every car with a higher serial whose rectangle is within holdGap + 1 px of L's rectangle or inside L's look-ahead sweep S_L is removed from the hall without score and without write-off; it still counts as spawned. The timer resets whenever L moves at >= 1 px/s, sees the dummy, or leaves the hall. If no such car exists the timer simply keeps running. The breaker uses no random draws and is not expected to fire in normal play."
    ],
    "solid_cars": [
      "1. Every car is a solid rectangle (length x width, centre x,y, axis-aligned to its travel direction) on all four sides, on every level, and stays solid after its impact.",
      "2. Order in each play step: (a) dummy movement (walk or lunge), (b) cars move (rule car_to_car 6), (c) impacts are judged for every car not yet hit using the positions after steps a and b, before any push-out, (d) push-out, (e) hall clamp.",
      "3. Push-out: for each car whose rectangle is closer to the dummy centre than radius (distance to rectangle < radius, or centre inside), the dummy is moved along the shortest way out by exactly the penetration plus impact.pushClearance. Outside the rectangle the direction is from the closest rectangle point to the centre. If the centre is inside, the direction is the face normal of least penetration. After the push the dummy is clamped to the hall. If the clamped position is still inside any car, the next-shortest face exit is tried in ascending distance; if none is inside the hall and clear of all cars, the dummy moves to the nearest clear point in the hall found by a fixed search over the 8 directions in order (E,SE,S,SW,W,NW,N,NE) at 4 px steps up to 120 px. After every step the dummy's circle reaches at most 1 px into any car.",
      "4. A moving car pushes the dummy ahead of it or aside, by rule 3, every step. The dummy's velocity fields are not altered by push-out. Cars never slow, stop or deflect because the dummy is solid; only the Testpad dummy-reaction logic (detect, brake, swerve) affects cars.",
      "5. Impact contact: an impact needs distance from the dummy centre to the car rectangle <= radius + impact.contactEps, judged in step c, with face as the Testpad. Each car has at most one impact (hit). Rear contact changes neither health nor score, but still sets hit and levelContact as released.",
      "6. Dummy overlap with several cars is resolved car by car in ascending serial order, repeated up to 4 passes in the step."
    ],
    "damage": [
      "1. For a paying impact (face front or side): damage = min(impact.maxPay, round(impact.perMomentum * closing * classes[cls].mass * face)), where closing = |car velocity - dummy velocity| in px/s using the velocities of step b (dummy.vx, vy as reported; lunge velocity included) and face = faceFront (1) or faceSide (0.25). Rear: damage 0.",
      "2. dummy.health -= damage (floored at 0). score += damage. A write-off follows when health reaches 0, as released.",
      "3. The Testpad severity curve (maxClosing, yieldBase, yieldCurve) is removed. Where the Testpad uses severity (report signatures, screen shake, cards) use severity = damage / impact.maxPay, in [0,1].",
      "4. Calibration (sedan mass 1.0): closing 700 px/s head-on gives 1155 damage (about half of maxHealth 2300). A stationary dummy struck by a cruising sedan (closing 138) loses 228. Bus mass 3.0 is the highest per unit of closing speed; a full lunge into a bus nose reaches maxPay and is a write-off from fresh health."
    ],
    "road_limits": [
      "1. Levels 1 and 2 only. Each road has lanes (halfWidth), a hard shoulder of params shoulder px on each side, and a barrier at road centre +/- (halfWidth + shoulder). Level 1: y = 214 and y = 406. Level 2: horizontal y = 214 and 406, vertical x = 354 and 546.",
      "2. Cars may drive on the shoulder, which is any ground between the lane area edge and the barrier.",
      "3. No part of a car may cross a barrier. A car's rectangle lateral extent is kept inside the barrier limits of its travel axis on every step (horizontal travel: 214 <= top and bottom <= 406; vertical travel: 354 <= left and right <= 546), including inside the junction. Lateral displacement is truncated at the limit. Spawned cars start inside the limits.",
      "4. A car that cannot swerve clear of the dummy because of the barrier limits or other cars brakes (car_to_car 10) and shows brake lights. It never crosses the barrier.",
      "5. The dummy ignores shoulders and barriers completely and can stand or walk anywhere in the hall. Barriers do not block the dummy and are not solid to lunges.",
      "6. Barriers have gaps where a crossing road opens (level 2). Cars never leave the road corridor, so no car reaches the gap squares except the central open square.",
      "7. Level 3 has no shoulders or barriers."
    ],
    "one_way_level_2": [
      "1. (CR-001 addendum) Level 2 roads are one-way. The horizontal road runs left to right: lanes y=284 and y=336, every car on it has dirX=1, dirY=0. The vertical road runs top to bottom: lanes x=414 and x=486, every car on it has dirX=0, dirY=1.",
      "2. No car on level 2 ever has dirX=-1 or dirY=-1. Spawns come only from the left edge (horizontal) and the top edge (vertical). The right and bottom approaches of the previous design are removed.",
      "3. Level 2 has no oncoming traffic; conflicts occur only between a horizontal car and a vertical car at the junction, resolved by car_to_car rules 2 to 5 (the lower serial has priority). Same-direction conflicts (queues, swerving into the other lane or the shoulder) are resolved by rules 4, 6 and 9.",
      "4. Level 3 is unchanged (all four directions). Level 1 is unchanged."
    ],
    "level_flow": [
      "1. Level N starts with: level, quota, allocation from params.levels[N-1]. vehiclesSpawned=0, levelWriteOffs=0, cars=[], dummy at start with full health, velocity 0, lunge and recovery cleared, levelLunged=false, levelContact=false. A new spawn interval is drawn. Fleet learning, score, bodiesDestroyed and serial persist.",
      "2. Spawn timer: nextSpawn is drawn uniformly in [spawnInterval.min, max] and decreases by dt in play. At <=0, if vehiclesSpawned<allocation, a pendingSpawn (entry and unit) is drawn once and held. It spawns as soon as it is clear and the unit is not in the hall. The next interval is then drawn. If every pool unit is in the hall, the spawn waits.",
      "3. traffic:false means no spawn timer, no spawns and no level-end check. Allocation spent is never reached.",
      "4. A car is removed when its rectangle lies wholly outside the hall beyond the edge it is travelling toward (or by the stall breaker, car_to_car 13).",
      "5. Write-off: bodiesDestroyed++, levelWriteOffs++, score += writeOffBonus (as Testpad), then if bodiesDestroyed >= certificationTarget go to mode over with ending licensed. Otherwise mode card with kind writeoff. A fresh confirm dismisses it: dummy.health=maxHealth, dummy to (startX,startY), velocity 0, lunge and recovery cleared. Cars stay and play resumes. If a car overlaps the start position, solid_cars rule 3 pushes the dummy out on the next step.",
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
    "Commitment lock at commitFrac, hatch flip, brake-first classes, the bus that cannot swerve, caution, service repair (swerve now subject to car_to_car 9 and 10).",
    "Face factors (front pays, side a quarter, rear nothing) and a single impact per car; damage magnitude now follows the damage rules instead of the severity curve.",
    "Report cards, behaviour signatures and report bank word for word (severity input is damage / maxPay), HUD, attract screen, perception overlay and toggle, restart button.",
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
      "text": "PARAMS deep-equals state.params and contains every schema field, including world, hall, 6 classes each with mass, 12 fleet entries, closeCost with 12 integers, 3 levels with shoulder fields, impact.perMomentum and certificationTarget. PARAMS.impact has no maxClosing, yieldBase or yieldCurve.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-03",
      "text": "Units: PARAMS dummy.walkSpeed=81, runSpeed=162 and class speeds are 138/120/192/108/144/156. A walking dummy held right for 1 s at full speed covers the same distance at dt=1/60 and 1/120 within 1 px.",
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
      "text": "Lunge covers exactly lungeDistance (164 +/- 0.01 px) at full health in each of the 8 directions, at dt=1/60 and 1/120, starting away from walls and cars, and while lunging is true.",
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
      "text": "Level 1: all cars have dirX=1, dirY=0, and y in {284,336} at spawn. The lane area lies inside y 246 to 374, shoulders inside y 214 to 246 and 374 to 406, barriers at y=214 and 406. No road, shoulder, barrier, spawn path or road geometry touches the top-left corner region x<200, y<200 on any level.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-13",
      "text": "Level 1 flow: with the dummy idle at (60,570) and no impacts, no car ever has speed<1 px/s after its first step, and the level ends with 14 vehicles spawned.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-14",
      "text": "Level 2 (one-way): over a 5 minute simulated run across several seeds, every car spawns either on a horizontal lane (y 284 or 336, entering from the left edge, dirX=1, dirY=0) or on a vertical lane (x 414 or 486, entering from the top edge, dirX=0, dirY=1). Both kinds occur. No level 2 car ever has dirX=-1 or dirY=-1 at any step, and none spawns at the right or bottom edge.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-15",
      "text": "Over many seeds on levels 1 to 3, with random dummy inputs including lunges and with the dummy parked in front of cars, no two car rectangles overlap (positive overlap area) in any step. Level 3 is included explicitly.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-16",
      "text": "Give-way: a higher-serial car with a lower-serial car crossing its path sets braking true and stops short without contact. It resumes once the sweep test is clear. The lowest-serial car in the hall never has its speed reduced by car-to-car logic. A higher-serial car does not yield to a lower-serial car that is behind it in its own lane band.",
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
    },
    {
      "id": "AC-26",
      "text": "Damage formula: PARAMS.impact.perMomentum=1.65, maxPay=2300 and class masses sedan 1.0, van 1.5, sports 0.9, bus 3.0, wagon 1.2, hatch 0.8. In a scripted front impact the health lost and the score gained both equal min(2300, round(1.65 * |car velocity - dummy velocity| * mass * face)); a side impact uses face 0.25. Closing 700 on a sedan front gives 1155 (+/-1).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-27",
      "text": "Damage calibration: a stationary dummy struck on the front by a cruising sedan (138 px/s) loses 228 (under 15% of maxHealth); a bus at 108 px/s front-on to a stationary dummy loses more than a sedan at the same closing speed by exactly the mass ratio 3 (before the cap); a full lunge into a bus nose gives 2300.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-28",
      "text": "Solid dummy: over many seeds and random inputs on levels 1 to 3 (and with the dummy placed overlapping a car), after every step the dummy circle reaches no more than 1 px into any car rectangle, and the dummy is inside the hall. A dummy overlapped by a car is moved along the shortest way out.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-29",
      "text": "The dummy never alters car motion by being solid: a car that has already had its impact, driving at a dummy parked in its path, keeps its trajectory and speed (apart from the Testpad detect/brake/swerve reaction, disabled in the test by lock and detect settings), and pushes the dummy ahead of it.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-30",
      "text": "Barrier: on levels 1 and 2, over many seeds and random dummy inputs (dummy also parked on the shoulder and beyond the barrier), every car rectangle stays inside the barrier limits at every step (level 1 y 214 to 406; level 2 horizontal-travelling y 214 to 406, vertical-travelling x 354 to 546).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-31",
      "text": "Dummy crossing: the dummy can walk from y=100 to y=500 across both shoulders and barriers on levels 1 and 2 at normal speed with no obstruction.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-32",
      "text": "Shoulder use: on level 1 with a sedan on lane y=284 and the dummy standing on the lane ahead, with the shoulder side free, the car commits to a side whose rectangle stays inside the barrier limits and passes the dummy without impact (or with an impact only if the Testpad dials allow). Across a seeded batch at least one car's rectangle enters the shoulder band (y 214 to 246 or 374 to 406).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-33",
      "text": "Swerve infeasible: with the dummy placed so that clearing it would require crossing the barrier, or the neighbouring lane occupied by another car, the car does not lock, brakes (braking true), and stops short of the dummy or touches no barrier. The bus (swerve false) brakes as before.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-34",
      "text": "Sideways free space: no car ever has a lateral move that makes its rectangle overlap another car's rectangle, and on level 3 no two oncoming cars ever have overlapping lateral bands while within the hall at the same time (spawns wait).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-35",
      "text": "No stall: with the dummy idle at (60,60) on levels 1 to 3 over many seeds, no car has speed 0 for more than 10 s consecutively, and each level reaches its end condition within 150 s of simulated time.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-36",
      "text": "index.html draws the hard shoulders and barriers on levels 1 and 2 (barriers visibly distinct from shoulder and lanes, with gaps at the junction), draws nothing of the kind on level 3, and the result is readable at the 900 x 620 canvas.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-37",
      "text": "Playtest: cars feel solid on all four sides; the dummy is never seen inside a car; cars visibly use the shoulder to dodge, brake when boxed in, and never cross the barrier.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-38",
      "text": "Level 2 one-way: every level 2 car has (dirX,dirY) = (1,0) or (0,1) at every step; horizontal cars stay on y 214 to 406 and vertical cars on x 354 to 546; no spawn at the right or bottom edge. index.html draws level 2 with direction arrows or equivalent so one-way travel is readable.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-39",
      "text": "Lowest serial never held for good: over many seeds on levels 1 to 3 with random dummy inputs (dummy not parked within the lowest-serial car's detection zone), at every step the lowest-serial car in the hall is not at speed < 1 px/s for more than carToCar.stallLimit + 1 s consecutively, and it leaves the hall eventually. In level 2 scripted junction cases (a higher-serial car stopped at the crossing, a lower-serial car approaching the other road) the lower-serial car crosses without being blocked.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-40",
      "text": "Levels always end with the dummy in traffic (the failed check levels_always_end_with_dummy_in_traffic): on each of levels 1 to 3 over many seeds, with a scripted dummy that wanders in and across the roads and lunges at cars, every level reaches its end condition (all allocation spawned and no cars) within 150 s of simulated time, including after write-offs and card dismissals, with no frozen cars (no position change of any car for 10 s while the dummy is outside its detection zone) and no stall breaker needed on level 2 in normal runs (breaker count reported).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-41",
      "text": "Stall breaker: in a scripted state where the lowest-serial car L is held at speed 0 by a higher-serial car adjacent to it, with the dummy outside L's detection zone, after stallLimit (6 s) the blocking car is removed, vehiclesSpawned is unchanged, score and bodiesDestroyed are unchanged, and L moves again. The breaker never removes lower-serial cars and never fires while L moves.",
      "verify_by": "automated_check"
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
      "text": "Added a top-level params.carToCar group (look-ahead, accel and stall constants) and extra level layout fields (laneXs, dirX/dirY/oneWay on level 2 roads, entryLane*). These are additions only; no schema field is renamed or removed. Extra state fields: rng, serialCounter, prevLunge, prevConfirm, levelLunged, levelContact, pendingSpawn, nextSpawn, plus a stall timer for the lowest-serial car."
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
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 damage: the Testpad severity curve (impact.maxClosing, yieldBase, yieldCurve) is removed and replaced by damage = min(maxPay, round(perMomentum * closing * mass * face)). Added per-class mass (sedan 1.0, van 1.5, sports 0.9, bus 3.0, wagon 1.2, hatch 0.8), perMomentum 1.65, maxPay 2300 (= maxHealth), impact.contactEps 0.5 and impact.pushClearance 0.1. Severity-driven features use damage / maxPay. Face factors unchanged."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 interpretation, TO BE CONFIRMED BY LAWRENCE: his words say damage is 'inversely proportional to speed x mass'. This is read as DIRECTLY proportional (faster and heavier vehicles do more damage). If inverse is truly meant, only the damage rule 1 formula and the calibration constants change."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 solid cars: every car is a solid rectangle; the dummy is pushed out along the shortest way and never blocks cars; impacts are judged before push-out; cars never overlap on any level, including level 3 (universal truncation against all cars, plus oncoming-band spawn and lateral rules on level 3 to avoid head-on deadlock). The released lower-serial-only backstop is replaced by this."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 road limits: levels 1 and 2 get 32 px hard shoulders and barriers at centre +/- 96 px (new field shoulder in road, roadH, roadV). Cars may use shoulders but never cross barriers; the barrier stops cars only, not the dummy. A car that cannot swerve (barrier or another car) brakes instead. Lateral moves only into free space. Level 3 has no shoulders or barriers. Layout assumptions: barriers have gaps at the level 2 crossing and extend edge to edge on level 1."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "CR-001: dummy squeezed between a moving car and a hall edge is relocated to the nearest clear point (fixed search) rather than blocking the car or being crushed, so the car is never slowed by the dummy. Contact for impacts uses a 0.5 px tolerance."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 addendum, TO BE CONFIRMED BY LAWRENCE: level 2 roads are one-way (horizontal left to right, vertical top to bottom, two lanes each, no oncoming traffic). This replaces the earlier two-way design, whose head-on freezes caused the failed check levels_always_end_with_dummy_in_traffic. Quota 3, allocation 20, pool 6 and spawn interval are unchanged; spawns now pick between 2 approaches (left, top) instead of 4. The two-way design had not been requested. Level 3 is unchanged."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 addendum: give-way rule refined so a car never yields to a lower-serial car that is behind it in its own lane band (previously this could hold two same-lane cars against each other). Added the guarantee that the lowest-serial car is never held for good by another car (car_to_car 12)."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "CR-001 addendum: stall breaker (car_to_car 13, params.carToCar.stallLimit 6 s) is a backstop, not a GDD feature. If the lowest-serial car is held at speed 0 for 6 s while not seeing the dummy, the adjacent higher-serial blocking cars are removed without score or write-off. It is a safety net against freezes and is not expected to fire in normal play."
    }
  ]
}

# AUTOMATED CHECK RESULTS (executed by the orchestrator, not by the Builder)
{
  "total": 31,
  "passed": 31,
  "failed": 0,
  "all_passed": true,
  "results": [
    {
      "id": "load_sim",
      "description": "sim.js loads in Node and exports createSim, step, PARAMS",
      "pass": true,
      "detail": ""
    },
    {
      "id": "params_match_spec",
      "description": "Builder's PARAMS equal the Designer's spec params (Designer output reached the Builder)",
      "pass": true,
      "detail": "250 parameters identical"
    },
    {
      "id": "state_shape",
      "description": "createSim returns the contract state shape, JSON-serialisable, for all three levels",
      "pass": true,
      "detail": ""
    },
    {
      "id": "attract_then_confirm",
      "description": "Default start is the attract screen; a confirm press begins play",
      "pass": true,
      "detail": ""
    },
    {
      "id": "move_speed_equal_8_directions",
      "description": "Distance covered in 1 s is equal in all eight directions (within 1%) and goes the way the input points",
      "pass": true,
      "detail": "px in 1 s: 122.2, 122.2, 122.2, 122.2, 122.2, 122.2, 122.2, 122.2"
    },
    {
      "id": "walk_frame_rate_independent",
      "description": "Walking covers the same distance at 60 and 120 steps per second (within 2%)",
      "pass": true,
      "detail": "60 Hz 203.2 px, 120 Hz 202.8 px"
    },
    {
      "id": "run_speed_matches_spec",
      "description": "After the ramp, speed equals spec runSpeed straight and diagonal (within 3%)",
      "pass": true,
      "detail": "px/s: 162.0, 162.0"
    },
    {
      "id": "lunge_distance_equal_8_directions",
      "description": "Lunge distance is equal in all eight directions (within 1%), equals spec lungeDistance (within 2%), and follows the facing direction when no direction is held",
      "pass": true,
      "detail": "px: 164.0, 164.0, 164.0, 164.0, 164.0, 164.0, 164.0, 164.0"
    },
    {
      "id": "lunge_frame_rate_independent",
      "description": "A lunge covers the same distance at 120 steps per second (within 2%)",
      "pass": true,
      "detail": "164.0 px"
    },
    {
      "id": "lunge_eases_out",
      "description": "The lunge is tweened: more than 60% of the distance is covered in the first half of its duration",
      "pass": true,
      "detail": "87% at half time"
    },
    {
      "id": "no_midair_steering",
      "description": "Direction input during a lunge does not change its path",
      "pass": true,
      "detail": "drift 0.000 px"
    },
    {
      "id": "held_lunge_does_not_chain",
      "description": "Holding the lunge button and a direction for 3 s starts exactly one lunge",
      "pass": true,
      "detail": "1 lunge"
    },
    {
      "id": "recovery_is_tweened",
      "description": "After a lunge the dummy is 'recovering' for spec recoveryTime, can move during it, and starts slowly",
      "pass": true,
      "detail": "recovery 0.35 s, moved 19.6 px during it"
    },
    {
      "id": "deterministic_and_seeded",
      "description": "Same seed and inputs give an identical state after 40 s; a different seed gives different traffic",
      "pass": true,
      "detail": ""
    },
    {
      "id": "level1_road_flows_left_to_right",
      "description": "Level 1: every car travels left to right inside the road band, at its class speed, and never stalls (dummy out of the way)",
      "pass": true,
      "detail": "14 cars in 60 s"
    },
    {
      "id": "car_speed_real_time",
      "description": "An undisturbed car's reported speed equals its class speed and its real displacement per second, at 60 and 120 steps per second",
      "pass": true,
      "detail": "px in 1 s at 60 / 120 Hz: 120.0 / 120.0"
    },
    {
      "id": "level2_cross_no_collisions",
      "description": "Level 2: traffic uses both one-way roads (left to right, top to bottom), cars never overlap inside the canvas, and traffic keeps flowing for 150 s (no deadlock)",
      "pass": true,
      "detail": "39 cars through, 18 horizontal, 24 vertical, no overlap"
    },
    {
      "id": "level3_free_for_all",
      "description": "Level 3: vehicles enter from at least three of the four edges, several classes appear, and cars never overlap inside the canvas",
      "pass": true,
      "detail": "4 directions, 6 classes, no overlap"
    },
    {
      "id": "detection_commit_and_brake_flags",
      "description": "A dummy standing in a lane is seen, the car commits to a side (lock) and the lock does not change afterwards",
      "pass": true,
      "detail": "VAN-07: seen, lock 1"
    },
    {
      "id": "front_impact_pays_once",
      "description": "Front contact reduces health and adds score, once per car",
      "pass": true,
      "detail": "health 2300.0 -> 1827.6, score +475.0"
    },
    {
      "id": "rear_contact_pays_nothing",
      "description": "Rear contact changes neither health nor score",
      "pass": true,
      "detail": ""
    },
    {
      "id": "write_off_card_and_fresh_body",
      "description": "At zero health: one write-off counted, a card appears, confirm gives a fresh body",
      "pass": true,
      "detail": ""
    },
    {
      "id": "level_progression",
      "description": "Quota met and allocation spent: level 1 -> 2 -> 3 via a card and confirm",
      "pass": true,
      "detail": "1 -> 2 -> 3"
    },
    {
      "id": "ending_decommissioned",
      "description": "Allocation spent with the quota missed ends the run as 'decommissioned'",
      "pass": true,
      "detail": ""
    },
    {
      "id": "ending_licensed",
      "description": "The write-off that reaches certificationTarget ends the run as 'licensed' at once",
      "pass": true,
      "detail": ""
    },
    {
      "id": "levels_always_end_with_dummy_in_traffic",
      "description": "With a dummy standing on the road (at each road edge, so cars must swerve), every level still runs to its end, cars never overlap, never cross a barrier, and the dummy is never left inside a car",
      "pass": true,
      "detail": "all ended: L1:64s, L1:61s, L1:64s, L1:61s, L2:78s, L2:80s, L2:78s, L2:80s, L2:78s, L2:83s, L2:78s, L2:80s, L3:88s, L3:92s"
    },
    {
      "id": "solid_cars_and_barriers_under_active_play",
      "description": "With the dummy wandering across the roads and lunging for 90 s per level: cars never overlap each other, never cross a road barrier, and the dummy is never left inside a car",
      "pass": true,
      "detail": "L1/s5: 72 lunges, 1 bodies; L1/s9: 72 lunges, 3 bodies; L2/s5: 72 lunges, 4 bodies; L2/s9: 72 lunges, 0 bodies; L3/s5: 72 lunges, 0 bodies; L3/s9: 72 lunges, 1 bodies"
    },
    {
      "id": "dummy_cannot_walk_through_a_car",
      "description": "Cars are solid on every side: a dummy placed against a car's side, or walking into it, is pushed out and never ends up inside",
      "pass": true,
      "detail": "pushed out and kept out"
    },
    {
      "id": "damage_follows_momentum",
      "description": "Damage from a front impact equals perMomentum x closing speed x class mass (within 15%), for a sedan and a van; the bus is the heaviest class",
      "pass": true,
      "detail": "sedan: 374.0 (expected 374.2); van: 475.0 (expected 474.5)"
    },
    {
      "id": "sim_is_pure",
      "description": "sim.js uses no Math.random, timers, clock or DOM",
      "pass": true,
      "detail": ""
    },
    {
      "id": "html_static",
      "description": "index.html has a canvas, loads sim.js, handles the keyboard, uses a fixed timestep and makes no network requests",
      "pass": true,
      "detail": "1 inline script(s) parse without syntax errors"
    }
  ]
}

# BUILDER NOTES
Level 2 is now one-way. PARAMS has the dir/oneWay fields and carToCar.stallLimit. Spawns draw approach (left or top) and then lane. The give-way test skips lower-serial cars that are behind the car in its own lane band. A stall breaker was added: if the lowest-serial car sits below 1 px/s for 6 s without seeing the dummy, it removes the higher-serial cars touching it or in its sweep. It uses no RNG and doesn't change score or spawn counts. State gets stallT, stallSerial and stallRemoved. index.html draws level 2 with all-forward arrows and white lane dividers. I haven't run any of the checks or opened the game, so none of this is tested. I noticed no specification problems.
=== END NOTES ===

# FILE sim.js
(function(){
"use strict";

/* ============================================================ PARAMS */
var PARAMS = {
  world:{width:900,height:620},
  hall:{x:40,y:40,w:820,h:540},
  dummy:{radius:13,walkSpeed:81,runSpeed:162,rampTime:1.0,lungeDistance:164,lungeDuration:0.3,lungeCooldown:0.55,recoveryTime:0.35,wearFloor:0.45,wearSpeedLoss:0,maxHealth:2300,writeOffBonus:2500,startX:150,startY:500},
  impact:{perMomentum:1.65,maxPay:2300,faceFront:1,faceSide:0.25,faceRear:0,contactEps:0.5,pushClearance:0.1},
  caution:{max:0.4},
  service:{delay:1.5,fullTime:30.0},
  classes:{
    sedan:{label:"Sedan",width:34,length:62,speed:138,mass:1.0,swerve:true,commitFrac:0.5,flip:false,brakeFirst:false,
      base:{detect:212,margin:44,predict:0.3,brakeLead:0.45},step:{detect:30,margin:11,predict:0.07,brakeLead:0.04},cap:{detect:400,margin:190,predict:0.72,brakeLead:0.68}},
    van:{label:"Van",width:38,length:76,speed:120,mass:1.5,swerve:true,commitFrac:0.42,flip:false,brakeFirst:true,
      base:{detect:232,margin:38,predict:0.26,brakeLead:0.74},step:{detect:28,margin:10,predict:0.06,brakeLead:0.06},cap:{detect:410,margin:188,predict:0.64,brakeLead:0.95}},
    sports:{label:"Sports",width:30,length:58,speed:192,mass:0.9,swerve:true,commitFrac:0.3,flip:false,brakeFirst:false,
      base:{detect:190,margin:31,predict:0.36,brakeLead:0.28},step:{detect:34,margin:12,predict:0.09,brakeLead:0.03},cap:{detect:400,margin:186,predict:0.86,brakeLead:0.5}},
    bus:{label:"Bus",width:46,length:108,speed:108,mass:3.0,swerve:false,commitFrac:0.5,flip:false,brakeFirst:true,
      base:{detect:258,margin:34,predict:0.22,brakeLead:0.88},step:{detect:26,margin:9,predict:0.05,brakeLead:0.07},cap:{detect:420,margin:184,predict:0.56,brakeLead:1.15}},
    wagon:{label:"Wagon",width:36,length:72,speed:144,mass:1.2,swerve:true,commitFrac:0.58,flip:false,brakeFirst:false,
      base:{detect:244,margin:58,predict:0.46,brakeLead:0.5},step:{detect:32,margin:14,predict:0.1,brakeLead:0.04},cap:{detect:430,margin:200,predict:0.96,brakeLead:0.72}},
    hatch:{label:"Hatch",width:30,length:54,speed:156,mass:0.8,swerve:true,commitFrac:0.6,flip:true,brakeFirst:false,
      base:{detect:204,margin:41,predict:0.28,brakeLead:0.44},step:{detect:30,margin:11,predict:0.07,brakeLead:0.04},cap:{detect:400,margin:188,predict:0.74,brakeLead:0.66}}
  },
  fleet:[
    {id:"SDN-01",cls:"sedan"},{id:"SDN-02",cls:"sedan"},{id:"VAN-07",cls:"van"},{id:"SPT-11",cls:"sports"},
    {id:"BUS-06",cls:"bus"},{id:"SDN-04",cls:"sedan"},{id:"WGN-05",cls:"wagon"},{id:"HTB-09",cls:"hatch"},
    {id:"VAN-12",cls:"van"},{id:"SPT-03",cls:"sports"},{id:"WGN-08",cls:"wagon"},{id:"HTB-10",cls:"hatch"}
  ],
  closeCost:[4,4,3,3,3,2,2,2,2,1,1,1],
  levels:[
    {id:1,kind:"road",name:"ROAD",quota:2,allocation:14,pool:3,spawnInterval:{min:3.0,max:5.0},road:{y:310,halfWidth:64,shoulder:32,laneYs:[284,336]}},
    {id:2,kind:"cross",name:"CROSS JUNCTION",quota:3,allocation:20,pool:6,spawnInterval:{min:2.8,max:4.5},
      roadH:{y:310,halfWidth:64,shoulder:32,laneYs:[284,336],dirX:1,dirY:0,oneWay:true},
      roadV:{x:450,halfWidth:64,shoulder:32,laneXs:[414,486],dirX:0,dirY:1,oneWay:true}},
    {id:3,kind:"hall",name:"CRASH TEST CENTRE",quota:5,allocation:28,pool:12,spawnInterval:{min:2.2,max:3.8},entryLaneMin:200,entryLaneMaxY:520,entryLaneMaxX:800}
  ],
  certificationTarget:11,
  carToCar:{lookAheadBase:20,lookAheadTime:0.45,sidePad:4,otherLookTime:0.4,decel:600,accel:360,holdGap:8,spawnClearPad:20,stallLimit:6}
};

/* ============================================================ REPORT BANK */
var BANK = {
  no_contact:{
    a:["{U}: Subject made no contact this cycle. Chassis returned unused.",
       "{U}: No logged impact. Subject appears to be avoiding the vehicles.",
       "{U}: Shift produced no data. Subject reminded of the job description."],
    b:["{U}: Zero contacts. This unit has filed a note with scheduling.",
       "{U}: Subject declined every approach offered. Allocation wasted."],
    c:["{U}: No contact. The fleet no longer requires this subject's cooperation."]
  },
  wrong_face:{
    a:["{U}: Subject struck from behind on three occasions. Rear impacts are not logged.",
       "{U}: Repeated rear contact. Subject is advised that only the nose pays."],
    b:["{U}: Subject continues to approach from behind. Unproductive.",
       "{U}: Rear contacts recorded. No yield. Subject's technique noted."],
    c:["{U}: Rear contact again. The data set does not include this angle."]
  },
  whiff:{
    a:["{U}: Subject initiated nine approaches. Two logged. This unit will be braking earlier.",
       "{U}: High approach count, low contact rate. Subject's timing is early.",
       "{U}: Numerous attempts, few impacts. This unit has adjusted its margin."],
    b:["{U}: Subject's success rate is below floor average. Briefing circulated.",
       "{U}: Many lunges, little data. {V} concurs with this assessment."],
    c:["{U}: Subject still lunging. The fleet has the measurements it needs."]
  },
  serviced:{
    a:["{U}: Subject was serviced twice, unasked. Downtime is deducted from allocation.",
       "{U}: Maintenance attended the subject mid-shift. Chassis integrity restored.",
       "{U}: Subject held position long enough for servicing. Yield reduced accordingly."],
    b:["{U}: Repeated servicing logged. The facility maintains its equipment.",
       "{U}: Subject idle. Panels reattached. Productivity unchanged."],
    c:["{U}: Subject serviced. The licence does not require a working body."]
  },
  jumpy:{
    a:["{U}: Subject moved continuously. This unit reduced speed as a precaution.",
       "{U}: Erratic pedestrian behaviour detected. Approach speed derated.",
       "{U}: Subject will not hold still. Impacts logged at reduced severity."],
    b:["{U}: Continuous motion. The fleet is approaching this subject with caution.",
       "{U}: Subject's unpredictability has been circulated to the floor."],
    c:["{U}: Subject still moving. This unit maintains a safe approach speed."]
  },
  greedy:{
    a:["{U}: Subject sought high-severity impacts exclusively. Chassis exhausted early.",
       "{U}: Frontal preference confirmed. This unit now projects further ahead."],
    b:["{U}: Subject takes only the nose. Margin widened across the floor.",
       "{U}: Severity-seeking behaviour logged. {V} has been briefed."],
    c:["{U}: Subject's preference is on file. No unit will present its nose."]
  },
  timid:{
    a:["{U}: Impacts recorded at low severity throughout. Yield below target.",
       "{U}: Subject accepted only glancing contact. Quota at risk."],
    b:["{U}: Low-severity pattern continues. Subject is not producing usable data.",
       "{U}: Flank contacts only. The facility requires frontal measurements."],
    c:["{U}: Subject's caution noted. It will not affect the outcome."]
  },
  early:{
    a:["{U}: Subject commits before this unit has chosen a lane. Timing is early.",
       "{U}: Approaches initiated outside the decision window. Adjusted."],
    b:["{U}: Subject's timing remains early. This unit now commits later.",
       "{U}: Early commitment logged. {V} concurs."],
    c:["{U}: Still early. The fleet has stopped compensating."]
  },
  late:{
    a:["{U}: Subject commits after this unit has cleared. Timing is late.",
       "{U}: Late approaches logged. This unit has widened its margin."],
    b:["{U}: Subject consistently late. Briefing circulated to the floor.",
       "{U}: Late commitment again. {V} has adjusted accordingly."],
    c:["{U}: Late. This unit was already elsewhere."]
  },
  left:{
    a:["{U}: Subject approached from the left on three of four occasions. Adjusted.",
       "{U}: Left-side bias recorded. This unit now projects to the left."],
    b:["{U}: Left bias confirmed across contacts. Circulated to the fleet.",
       "{U}: Subject favours the left. {V} has been briefed."],
    c:["{U}: Left approach anticipated. Margin held."]
  },
  right:{
    a:["{U}: Subject approached from the right repeatedly. Adjusted.",
       "{U}: Right-side bias recorded. This unit now projects to the right."],
    b:["{U}: Right bias confirmed. Circulated to the fleet.",
       "{U}: Subject favours the right. {V} has been briefed."],
    c:["{U}: Right approach anticipated. Margin held."]
  },
  steady:{
    a:["{U}: Contact logged. Subject performed within expected parameters.",
       "{U}: Impact recorded and filed. Nothing further.",
       "{U}: Measurements obtained. Subject's technique is consistent."],
    b:["{U}: Consistent performance. This unit's file has been updated.",
       "{U}: Data obtained. {V} has been briefed on this subject."],
    c:["{U}: Final measurements taken. This unit's file is complete."]
  }
};

/* ============================================================ UTIL */
function clone(o){ return JSON.parse(JSON.stringify(o)); }
function clamp(v,a,b){ return Math.max(a, Math.min(b, v)); }
function rnd(s){
  s.rng = (s.rng + 0x6D2B79F5) >>> 0;
  var t = s.rng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
function rnd2(s){
  s.lineRng = (s.lineRng + 0x6D2B79F5) >>> 0;
  var t = s.lineRng;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/* ============================================================ CREATE / RESET */
function newDummy(P){
  var d = { x:0, y:0, vx:0, vy:0, facing:{x:0,y:-1}, health:0, lunging:false, recovering:false, serviceOn:false };
  resetDummy(d, P);
  return d;
}
function resetDummy(d, P){
  d.x = P.dummy.startX; d.y = P.dummy.startY; d.vx = 0; d.vy = 0;
  d.health = P.dummy.maxHealth; d.lunging = false; d.recovering = false; d.serviceOn = false;
  d.lungeT = 0; d.lungeDx = 0; d.lungeDy = 0; d.lungeReach = 1; d.cooldown = 0;
  d.recT = 0; d.ramp = 0; d.stillT = 0;
}
function freshRun(){
  return { lunges:0, hits:0, front:0, side:0, rear:0, sevSum:0, distSum:0, distN:0,
           leftN:0, rightN:0, services:0, speedSum:0, speedN:0, lastUnit:-1 };
}
function newFleet(P){
  return P.fleet.map(function(f){ return { id:f.id, cls:f.cls, contacts:0, closed:false, closeCost:0 }; });
}
function startLevel(s, n){
  var L = s.params.levels[n-1];
  s.level = n; s.quota = L.quota; s.allocation = L.allocation;
  s.vehiclesSpawned = 0; s.levelWriteOffs = 0; s.cars = [];
  s.levelLunged = false; s.levelContact = false;
  s.pendingSpawn = null; s.nextSpawn = null;
  s.stallT = 0; s.stallSerial = 0; s.stallRemoved = 0;
  s.run = freshRun();
  resetDummy(s.dummy, s.params);
}
function resetRun(s, level){
  var P = s.params;
  s.rng = s.seed >>> 0; s.lineRng = (s.seed ^ 0x9e3779b9) >>> 0;
  s.mode = "attract"; s.ending = null; s.card = null;
  s.score = 0; s.bodiesDestroyed = 0; s.serialCounter = 0; s.body = 1;
  s.fleet = newFleet(P); s.closedCount = 0;
  s.fx = []; s.fxSeq = 0; s.used = []; s.quotaMet = false;
  s.dummy = newDummy(P);
  startLevel(s, level || 1);
}
function createSim(o){
  o = o || {};
  var s = { params:clone(PARAMS), seed:(o.seed == null ? 1 : o.seed), time:0,
            options:{ traffic:o.traffic !== false, autostart:!!o.autostart },
            prevLunge:false, prevConfirm:false };
  resetRun(s, o.level === 2 || o.level === 3 ? o.level : 1);
  if(s.options.autostart) s.mode = "play";
  return s;
}

/* ============================================================ FLEET */
function dials(s, u){
  var P = s.params, C = P.classes[u.cls], n = u.contacts, d = {}, k;
  for(k in C.base) d[k] = Math.min(C.cap[k], C.base[k] + C.step[k] * n);
  if(u.closed){
    d.margin = Math.max(d.margin, P.dummy.lungeDistance * 1.22);
    d.detect = Math.max(d.detect, 540);
  }
  return d;
}
function creditContact(s, u){
  u.contacts++;
  if(!u.closed){
    if(u.closeCost === 0) u.closeCost = s.params.closeCost[Math.min(s.params.closeCost.length - 1, s.closedCount)];
    if(u.contacts >= u.closeCost){
      u.closed = true; s.closedCount++;
      s.fx.push({ id:++s.fxSeq, k:"stamp", t:1.2 });
    }
  }
}

/* ============================================================ SIGNATURE / REPORT */
function signature(s){
  var R = s.run;
  if(R.hits === 0) return "no_contact";
  if(R.rear >= 3 && R.front === 0) return "wrong_face";
  if(R.lunges >= 5 && R.hits / R.lunges < 0.34) return "whiff";
  if(R.services >= 2) return "serviced";
  if(R.speedN && R.speedSum / R.speedN > 0.58) return "jumpy";
  var mean = R.sevSum / R.hits;
  if(mean >= 0.55) return "greedy";
  if(mean < 0.18) return "timid";
  var d = R.distN ? R.distSum / R.distN : 48;
  if(d > 62) return "early";
  if(d < 34) return "late";
  if(R.leftN - R.rightN >= 2) return "left";
  if(R.rightN - R.leftN >= 2) return "right";
  return "steady";
}
function pickLine(s, sig, ui){
  var b = s.level <= 1 ? "a" : (s.level === 2 ? "b" : "c");
  var set = (BANK[sig] || BANK.steady)[b] || BANK[sig].a;
  var free = set.filter(function(l){ return s.used.indexOf(l) < 0; });
  var pool = free.length ? free : set;
  var line = pool[Math.floor(pool.length * rnd2(s))];
  s.used.push(line);
  var unit = s.fleet[ui];
  var other = s.fleet.filter(function(u){ return u !== unit && u.contacts > 0; });
  var v = other.length ? other[Math.floor(rnd2(s) * other.length)].id : "the floor";
  return line.replace(/\{U\}/g, unit ? unit.id : "FLOOR").replace(/\{V\}/g, v);
}

/* ============================================================ FLOW */
function stats(s){
  return ["Subject DM-7734 \u00b7 body " + s.body + " \u00b7 adult male, 50th percentile",
          "Profile: " + signature(s) + " \u00b7 bodies " + s.bodiesDestroyed + " of " + s.params.certificationTarget + " \u00b7 level " + s.level];
}
function finish(s, kind){
  var last = s.fleet[s.run.lastUnit >= 0 ? s.run.lastUnit : 0];
  var T = s.params.certificationTarget, c;
  if(kind === "licensed"){
    c = { title:"OPERATOR LICENCE ISSUED", sub:"THE CERTIFICATION TARGET OF " + T + " BODIES IS MET",
          line:last.id + ": The certification target of " + T + " bodies is met. Operator licence issued. Subject is not cleared to operate a vehicle." };
  } else if(kind === "noncompliant"){
    c = { title:"NON-COMPLIANT", sub:"LEVEL " + s.level + " \u2014 NO CONTACT ATTEMPTED",
          line:"BUS-06: Subject stood in bay four for the duration. This unit has no comment." };
  } else {
    c = { title:"DECOMMISSIONED", sub:"QUOTA " + s.levelWriteOffs + " OF " + s.quota + " \u2014 LEVEL " + s.level,
          line:"Subject did not approach. Recommend reassignment." };
  }
  c.kind = "ending"; c.profile = true; c.stats = stats(s);
  s.card = c; s.ending = kind; s.mode = "over";
}
function writeOff(s){
  var P = s.params;
  s.bodiesDestroyed++; s.levelWriteOffs++; s.score += P.dummy.writeOffBonus;
  var sig = signature(s);
  var ui = s.run.lastUnit >= 0 ? s.run.lastUnit : 0;
  creditContact(s, s.fleet[ui]);
  if(s.bodiesDestroyed >= P.certificationTarget){ finish(s, "licensed"); return; }
  s.card = { kind:"writeoff", title:"UNIT WRITTEN OFF", sub:"QUOTA " + s.levelWriteOffs + " OF " + s.quota,
             line:pickLine(s, sig, ui), pay:P.dummy.writeOffBonus };
  s.mode = "card";
}
function levelEnd(s){
  if(s.quotaMet && !s.levelLunged && !s.levelContact) return finish(s, "noncompliant");
  if(s.levelWriteOffs < s.quota || s.level >= 3) return finish(s, "decommissioned");
  s.quotaMet = true;
  s.card = { kind:"level", title:"LEVEL COMPLETE", sub:"REASSIGNED \u2014 LEVEL " + (s.level + 1),
             line:"Quota met. Allocation increased. The fleet has been briefed." };
  s.mode = "card";
}
function dismiss(s){
  var k = s.card ? s.card.kind : "writeoff";
  if(k === "level") startLevel(s, s.level + 1);
  else { resetDummy(s.dummy, s.params); s.run = freshRun(); s.body++; }
  s.card = null; s.mode = "play";
}

/* ============================================================ SPAWN */
function interval(s, L){ return L.spawnInterval.min + rnd(s) * (L.spawnInterval.max - L.spawnInterval.min); }
function drawEntry(s, L){
  if(L.kind === "road") return { edge:0, v:L.road.laneYs[Math.floor(rnd(s) * L.road.laneYs.length)] };
  if(L.kind === "cross"){
    var a = Math.floor(rnd(s) * 2), li = Math.floor(rnd(s) * 2);
    return a === 0 ? { edge:0, v:L.roadH.laneYs[li] } : { edge:2, v:L.roadV.laneXs[li] };
  }
  var e = Math.floor(rnd(s) * 4);
  var hi = e < 2 ? L.entryLaneMaxY : L.entryLaneMaxX;
  return { edge:e, v:L.entryLaneMin + rnd(s) * (hi - L.entryLaneMin) };
}
function placeCar(s, ps){
  var P = s.params, H = P.hall, f = P.fleet[ps.unit], cl = P.classes[f.cls];
  var c = { serial:0, id:f.id, cls:f.cls, unit:ps.unit, x:0, y:0, dirX:0, dirY:0, length:cl.length, width:cl.width,
            speed:cl.speed, sees:false, lock:0, braking:false, hit:false,
            lat:0, base:0, lockPush:0, flipped:false, life:0, resuming:false, vx:0, vy:0 };
  var e = ps.edge, h = cl.length / 2;
  if(e === 0){ c.x = H.x - h; c.y = ps.v; c.dirX = 1; }
  else if(e === 1){ c.x = H.x + H.w + h; c.y = ps.v; c.dirX = -1; }
  else if(e === 2){ c.x = ps.v; c.y = H.y - h; c.dirY = 1; }
  else { c.x = ps.v; c.y = H.y + H.h + h; c.dirY = -1; }
  c.base = sgOf(c) * (c.dirX ? c.y : c.x);
  return c;
}
function half(c){ return c.dirX ? [c.length/2, c.width/2] : [c.width/2, c.length/2]; }
function sgOf(c){ return c.dirX ? c.dirX : -c.dirY; }
function rectAt(c, x, y){ var h = half(c); return [x - h[0], x + h[0], y - h[1], y + h[1]]; }
function opposite(a, b){ return a.dirX === -b.dirX && a.dirY === -b.dirY; }
function spawnStep(s, dt){
  if(!s.options.traffic) return;
  var P = s.params, L = P.levels[s.level - 1], i;
  if(s.nextSpawn == null) s.nextSpawn = interval(s, L);
  s.nextSpawn -= dt;
  if(!s.pendingSpawn){
    if(s.vehiclesSpawned >= s.allocation || s.nextSpawn > 0) return;
    s.pendingSpawn = { edge:0, v:0, unit:-1 };
    var en = drawEntry(s, L);
    s.pendingSpawn.edge = en.edge; s.pendingSpawn.v = en.v;
  }
  var ps = s.pendingSpawn;
  if(ps.unit < 0){
    var free = [], k;
    for(k = 0; k < L.pool; k++){
      var inHall = false;
      for(i = 0; i < s.cars.length; i++) if(s.cars[i].unit === k) inHall = true;
      if(!inHall) free.push(k);
    }
    if(!free.length) return;
    ps.unit = free[Math.floor(rnd(s) * free.length)];
  }
  var c = placeCar(s, ps), hc = half(c), pad = P.carToCar.spawnClearPad;
  for(i = 0; i < s.cars.length; i++){
    var o = s.cars[i], ho = half(o);
    if(Math.abs(c.x - o.x) < hc[0] + ho[0] + pad && Math.abs(c.y - o.y) < hc[1] + ho[1] + pad) return;
    if(L.kind === "hall" && opposite(c, o)){
      var cw = c.dirX ? c.y : c.x, ow = o.dirX ? o.y : o.x;
      if(Math.abs(cw - ow) < (c.width + o.width) / 2 + P.carToCar.sidePad) return;
    }
  }
  c.serial = ++s.serialCounter;
  s.cars.push(c); s.vehiclesSpawned++;
  s.pendingSpawn = null; s.nextSpawn = interval(s, L);
}

/* ============================================================ DUMMY */
function ease3(t){ return 1 - Math.pow(1 - t, 3); }
function dummyStep(s, input, dt, fl){
  var P = s.params, D = P.dummy, d = s.dummy, H = P.hall, x0 = d.x, y0 = d.y;
  var dx = input.dx || 0, dy = input.dy || 0, m = Math.sqrt(dx*dx + dy*dy), moving = m > 0;
  if(moving){ dx /= m; dy /= m; d.facing.x = dx; d.facing.y = dy; }
  if(d.cooldown > 0) d.cooldown = Math.max(0, d.cooldown - dt);
  if(fl && !d.lunging && d.cooldown <= 0){
    d.lungeDx = moving ? dx : d.facing.x; d.lungeDy = moving ? dy : d.facing.y;
    d.lungeT = 0; d.lunging = true; d.recovering = false; d.recT = 0; d.ramp = 0;
    d.lungeReach = 1 - (1 - D.wearFloor) * (1 - d.health / D.maxHealth);
    d.cooldown = D.lungeCooldown; s.levelLunged = true; s.run.lunges++;
  }
  if(d.lunging){
    var tp = d.lungeT / D.lungeDuration;
    d.lungeT += dt;
    var tn = Math.min(1, d.lungeT / D.lungeDuration);
    var disp = D.lungeDistance * d.lungeReach * (ease3(tn) - ease3(Math.min(1, tp)));
    d.x += d.lungeDx * disp; d.y += d.lungeDy * disp;
    if(tn >= 1){ d.lunging = false; d.recovering = true; d.recT = 0; }
  } else {
    var f = 1;
    if(d.recovering){
      d.recT += dt;
      var u = Math.min(1, d.recT / D.recoveryTime);
      f = 1 - (1 - u) * (1 - u);
      if(u >= 1){ d.recovering = false; f = 1; }
    } else {
      d.ramp = moving ? Math.min(1, d.ramp + dt / D.rampTime) : Math.max(0, d.ramp - dt / (D.rampTime * 0.5));
    }
    var wear = 1 - d.health / D.maxHealth;
    var base = (D.walkSpeed + (D.runSpeed - D.walkSpeed) * d.ramp) * (1 - D.wearSpeedLoss * wear);
    var sp = base * f;
    if(moving){ d.x += dx * sp * dt; d.y += dy * sp * dt; }
  }
  d.x = clamp(d.x, H.x + D.radius, H.x + H.w - D.radius);
  d.y = clamp(d.y, H.y + D.radius, H.y + H.h - D.radius);
  d.vx = dt > 0 ? (d.x - x0) / dt : 0; d.vy = dt > 0 ? (d.y - y0) / dt : 0;
  s.run.speedSum += Math.min(1, Math.sqrt(d.vx*d.vx + d.vy*d.vy) / D.runSpeed); s.run.speedN++;
  if(!moving && !d.lunging){
    d.stillT += dt;
    if(d.stillT > P.service.delay && d.health < D.maxHealth){
      if(!d.serviceOn){ d.serviceOn = true; s.run.services++; }
      d.health = Math.min(D.maxHealth, d.health + (D.maxHealth / P.service.fullTime) * dt);
    } else if(d.health >= D.maxHealth) d.serviceOn = false;
  } else { d.stillT = 0; d.serviceOn = false; }
}

/* ============================================================ SOLID DUMMY */
function rdist(r, x, y){
  var cx = clamp(x, r[0], r[1]), cy = clamp(y, r[2], r[3]);
  return Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
}
function clearAt(s, x, y){
  var R = s.params.dummy.radius;
  for(var i = 0; i < s.cars.length; i++) if(rdist(rectAt(s.cars[i], s.cars[i].x, s.cars[i].y), x, y) < R) return false;
  return true;
}
function nearestClear(s){
  var P = s.params, d = s.dummy, H = P.hall, R = P.dummy.radius, q = Math.SQRT1_2;
  var dirs = [[1,0],[q,q],[0,1],[-q,q],[-1,0],[-q,-q],[0,-1],[q,-q]];
  for(var r = 4; r <= 120; r += 4){
    for(var k = 0; k < 8; k++){
      var x = d.x + dirs[k][0]*r, y = d.y + dirs[k][1]*r;
      if(x < H.x + R || x > H.x + H.w - R || y < H.y + R || y > H.y + H.h - R) continue;
      if(clearAt(s, x, y)){ d.x = x; d.y = y; return true; }
    }
  }
  return false;
}
function pushOut(s){
  var P = s.params, d = s.dummy, R = P.dummy.radius, pc = P.impact.pushClearance, H = P.hall, cars = s.cars;
  var pass, i, k;
  for(pass = 0; pass < 4; pass++){
    var moved = false;
    for(i = 0; i < cars.length; i++){
      var r = rectAt(cars[i], cars[i].x, cars[i].y), dist = rdist(r, d.x, d.y);
      if(dist >= R) continue;
      moved = true;
      var cands = [], inside = d.x >= r[0] && d.x <= r[1] && d.y >= r[2] && d.y <= r[3];
      if(!inside && dist > 0){
        var cx = clamp(d.x, r[0], r[1]), cy = clamp(d.y, r[2], r[3]), pen = R - dist + pc;
        cands.push([d.x + (d.x - cx) / dist * pen, d.y + (d.y - cy) / dist * pen]);
      }
      var fe = [[r[1] + R + pc - d.x, [r[1] + R + pc, d.y]], [d.x - (r[0] - R - pc), [r[0] - R - pc, d.y]],
                [r[3] + R + pc - d.y, [d.x, r[3] + R + pc]], [d.y - (r[2] - R - pc), [d.x, r[2] - R - pc]]];
      fe.sort(function(a, b){ return a[0] - b[0]; });
      for(k = 0; k < 4; k++) if(fe[k][0] >= 0) cands.push(fe[k][1]);
      var ok = false;
      for(k = 0; k < cands.length; k++){
        var px = clamp(cands[k][0], H.x + R, H.x + H.w - R), py = clamp(cands[k][1], H.y + R, H.y + H.h - R);
        if(clearAt(s, px, py)){ d.x = px; d.y = py; ok = true; break; }
      }
      if(!ok) nearestClear(s);
    }
    if(!moved) break;
  }
  d.x = clamp(d.x, H.x + R, H.x + H.w - R);
  d.y = clamp(d.y, H.y + R, H.y + H.h - R);
}

/* ============================================================ CARS */
function sweep(c, ext, pad){
  var h = half(c), r = [c.x - h[0], c.x + h[0], c.y - h[1], c.y + h[1]];
  if(c.dirX > 0) r[1] += ext; else if(c.dirX < 0) r[0] -= ext; else if(c.dirY > 0) r[3] += ext; else r[2] -= ext;
  if(c.dirX){ r[2] -= pad; r[3] += pad; } else { r[0] -= pad; r[1] += pad; }
  return r;
}
function isect(a, b){ return a[0] < b[1] && b[0] < a[1] && a[2] < b[3] && b[2] < a[3]; }
// move c along axis ax (0 = x, 1 = y) by delta, truncated at first contact with any other car
function axisMove(c, ax, delta, cars){
  axisMove.blk = null;
  if(!delta) return 0;
  var h = half(c), hc = ax ? h[1] : h[0], hq = ax ? h[0] : h[1];
  var pc = ax ? c.y : c.x, qc = ax ? c.x : c.y, out = delta, i, o, ho, gap;
  for(i = 0; i < cars.length; i++){
    o = cars[i]; if(o === c) continue;
    ho = half(o);
    var po = ax ? o.y : o.x, qo = ax ? o.x : o.y, hoa = ax ? ho[1] : ho[0], hob = ax ? ho[0] : ho[1];
    if(Math.abs(qc - qo) >= hq + hob - 1e-6) continue;
    if(delta > 0){
      gap = (po - hoa) - (pc + hc);
      if(gap > -1e-6 && gap < out){ out = Math.max(0, gap); axisMove.blk = o; }
    } else {
      gap = (pc - hc) - (po + hoa);
      if(gap > -1e-6 && -out > gap){ out = -Math.max(0, gap); axisMove.blk = o; }
    }
  }
  return out;
}
function limits(s, c){
  var L = s.params.levels[s.level - 1], r, m;
  if(L.kind === "road"){ if(!c.dirX) return null; r = L.road; m = r.y; }
  else if(L.kind === "cross"){ if(c.dirX){ r = L.roadH; m = r.y; } else { r = L.roadV; m = r.x; } }
  else return null;
  var e = r.halfWidth + r.shoulder;
  return [m - e + c.width/2, m + e - c.width/2];
}
function latFree(s, c, tw){
  var K = s.params.carToCar, D = K.lookAheadBase + K.lookAheadTime * c.speed, pad = K.sidePad, i, o;
  var a = rectAt(c, c.x, c.y), b = c.dirX ? rectAt(c, c.x, tw) : rectAt(c, tw, c.y);
  var r = [Math.min(a[0], b[0]), Math.max(a[1], b[1]), Math.min(a[2], b[2]), Math.max(a[3], b[3])];
  if(c.dirX > 0) r[1] += D; else if(c.dirX < 0) r[0] -= D; else if(c.dirY > 0) r[3] += D; else r[2] -= D;
  r = [r[0] - pad, r[1] + pad, r[2] - pad, r[3] + pad];
  var lw = c.dirX ? c.y : c.x;
  for(i = 0; i < s.cars.length; i++){
    o = s.cars[i]; if(o === c) continue;
    if(isect(r, rectAt(o, o.x, o.y))) return false;
    if(opposite(c, o)){
      var ol = o.dirX ? o.y : o.x, need = (c.width + o.width) / 2 + pad;
      if(Math.abs(tw - ol) < need && Math.abs(tw - ol) < Math.abs(lw - ol)) return false;
    }
  }
  return true;
}
function swFeasible(s, c, side, push){
  var tw = sgOf(c) * (c.base + side * push), lim = limits(s, c);
  if(lim && (tw < lim[0] - 1e-6 || tw > lim[1] + 1e-6)) return false;
  return latFree(s, c, tw);
}
function latMove(s, c, dl){
  latMove.rej = false;
  var lw = c.dirX ? c.y : c.x, tw = lw + sgOf(c) * dl, lim = limits(s, c);
  if(lim) tw = clamp(tw, lim[0], lim[1]);
  if(Math.abs(tw - lw) < 1e-12) return 0;
  if(!latFree(s, c, tw)){ latMove.rej = true; return 0; }
  var dd = axisMove(c, c.dirX ? 1 : 0, tw - lw, s.cars);
  if(c.dirX) c.y += dd; else c.x += dd;
  return dd;
}
function testImpact(s, c){
  var P = s.params, d = s.dummy, R = s.run, I = P.impact;
  var rx = d.x - c.x, ry = d.y - c.y;
  var a = rx*c.dirX + ry*c.dirY, b = -rx*c.dirY + ry*c.dirX;
  var ha = c.length / 2, hb = c.width / 2;
  var ca = clamp(a, -ha, ha), cb = clamp(b, -hb, hb);
  if(Math.sqrt((a-ca)*(a-ca) + (b-cb)*(b-cb)) > P.dummy.radius + I.contactEps) return;
  var face = a > ha * 0.42 ? "front" : (a < -ha * 0.42 ? "rear" : "side");
  c.hit = true; s.levelContact = true;
  if(face === "rear"){ R.rear++; return; }
  var cx = c.vx - d.vx, cy = c.vy - d.vy, closing = Math.sqrt(cx*cx + cy*cy);
  var fv = face === "front" ? I.faceFront : I.faceSide;
  var pay = Math.min(I.maxPay, Math.round(I.perMomentum * closing * P.classes[c.cls].mass * fv));
  var sev = pay / I.maxPay;
  s.score += pay;
  d.health = Math.max(0, d.health - pay);
  R.hits++; R.sevSum += sev; R[face]++;
  R.distSum += Math.sqrt(rx*rx + ry*ry); R.distN++;
  if(b < 0) R.leftN++; else R.rightN++;
  R.lastUnit = c.unit;
  s.fx.push({ id:++s.fxSeq, k:"pay", t:0.95, x:d.x, y:d.y - 18, v:pay, big:face === "front", sev:sev });
  if(d.health <= 0) writeOff(s);
}
function stallStep(s, dt){
  var K = s.params.carToCar, cars = s.cars, L = cars[0], i;
  if(!L){ s.stallT = 0; s.stallSerial = 0; return; }
  if(s.stallSerial !== L.serial){ s.stallSerial = L.serial; s.stallT = 0; }
  if(L.speed >= 1 || L.sees){ s.stallT = 0; return; }
  s.stallT += dt;
  if(s.stallT < K.stallLimit) return;
  var SL = sweep(L, K.lookAheadBase + K.lookAheadTime * L.speed, K.sidePad), g = K.holdGap + 1;
  var rl = rectAt(L, L.x, L.y), inf = [rl[0] - g, rl[1] + g, rl[2] - g, rl[3] + g];
  s.cars = cars.filter(function(o){
    if(o.serial <= L.serial) return true;
    var ro = rectAt(o, o.x, o.y);
    if(isect(inf, ro) || isect(SL, ro)){ s.stallRemoved++; return false; }
    return true;
  });
}
function carsStep(s, dt){
  var P = s.params, d = s.dummy, cars = s.cars, K = P.carToCar, H = P.hall, i, j;
  cars.sort(function(a, b){ return a.serial - b.serial; });
  for(i = 0; i < cars.length; i++){
    var c = cars[i], u = s.fleet[c.unit], cl = P.classes[c.cls], D = dials(s, u);
    c.life += dt;
    var sg = sgOf(c), lw0 = c.dirX ? c.y : c.x;
    if(c.base == null) c.base = sg * lw0;
    c.lat = sg * lw0 - c.base;
    var rx = d.x + d.vx * D.predict - c.x, ry = d.y + d.vy * D.predict - c.y;
    var along = rx*c.dirX + ry*c.dirY, lat = -rx*c.dirY + ry*c.dirX;
    var conflict = along > 0 && along < D.detect && Math.abs(lat) < D.margin;
    c.sees = conflict;
    var canSwerve = cl.swerve || u.closed, stuck = false, dl = 0;
    if(canSwerve){
      var cf = u.closed ? Math.min(0.92, cl.commitFrac * 1.7) : cl.commitFrac, commitAt = D.detect * cf;
      if(!c.lock && conflict && along < commitAt){
        var pf = lat > 0 ? -1 : 1;
        if(swFeasible(s, c, pf, D.margin)) c.lock = pf;
        else if(swFeasible(s, c, -pf, D.margin)) c.lock = -pf;
        else stuck = true;
        if(c.lock) c.lockPush = D.margin;
      }
      if(c.lock && cl.flip && !u.closed && !c.flipped && along < commitAt * 0.52){
        if((lat > 0 && c.lock === 1) || (lat < 0 && c.lock === -1)){
          if(swFeasible(s, c, -c.lock, c.lockPush)){ c.lock = -c.lock; c.flipped = true; }
        }
      }
      if(c.lock){
        if(swFeasible(s, c, c.lock, c.lockPush)){
          var want = c.lock * c.lockPush, dd = want - c.lat;
          var slew = (u.closed ? (2.6 + D.margin / 46) : 3.0) * 60 * dt;
          dl = Math.max(-slew, Math.min(slew, dd * (1 - Math.pow(0.86, dt * 60))));
        } else stuck = true;
      } else if(Math.abs(c.lat) > 0.4){
        dl = c.lat * (Math.pow(0.96, dt * 60) - 1);
      }
    }
    var brake = 1;
    if(conflict){
      if((cl.brakeFirst || stuck) && along < D.detect * D.brakeLead) brake = cl.swerve ? 0.55 : 0.34;
      else if(canSwerve && !c.lock && along < D.detect * 0.22) brake = 0.66;
    }
    var derate = 1 - P.caution.max * Math.min(1, Math.sqrt(d.vx*d.vx + d.vy*d.vy) / P.dummy.runSpeed);
    var normal = cl.speed * brake * derate;

    // car-to-car give-way: yield only to lower serials not behind
    var yt = Infinity;
    var SA = sweep(c, K.lookAheadBase + K.lookAheadTime * c.speed, K.sidePad);
    for(j = 0; j < cars.length; j++){
      var b = cars[j];
      if(b.serial >= c.serial) continue;
      var dot = c.dirX*b.dirX + c.dirY*b.dirY;
      var t = 0, la = -c.x*c.dirY + c.y*c.dirX, lb = -b.x*b.dirY + b.y*b.dirX;
      var sA = c.x*c.dirX + c.y*c.dirY, sB = b.x*b.dirX + b.y*b.dirY;
      if(dot > 0 && Math.abs(la - lb) < (c.width + b.width) / 2 + K.sidePad && sB < sA) continue;
      var SB = sweep(b, K.otherLookTime * b.speed, 0);
      if(!isect(SA, SB)) continue;
      if(dot > 0){
        var gap = (sB - b.length/2) - (sA + c.length/2);
        if(sB > sA && Math.abs(la - lb) < (c.width + b.width) / 2 && gap > K.holdGap) t = b.speed;
      }
      if(t < yt) yt = t;
    }
    var held = false;
    if(yt < Infinity){
      var tg = Math.min(yt, normal);
      if(c.speed > tg) c.speed = Math.max(tg, c.speed - K.decel * dt);
      else c.speed = Math.min(tg, c.speed + K.accel * dt);
      c.resuming = true; held = tg < normal - 1e-9;
    } else if(c.resuming){
      c.speed = Math.min(normal, c.speed + K.accel * dt);
      if(c.speed >= normal) c.resuming = false;
    } else c.speed = normal;
    if(stuck && conflict) held = true;

    // integrate: longitudinal, then lateral; truncated against every other car
    var x0 = c.x, y0 = c.y;
    var dirS = c.dirX ? c.dirX : c.dirY;
    var dg = axisMove(c, c.dirX ? 0 : 1, dirS * c.speed * dt, cars);
    if(axisMove.blk){
      c.speed = Math.max(0, Math.min(c.speed, axisMove.blk.vx * c.dirX + axisMove.blk.vy * c.dirY));
      held = true;
    }
    if(c.dirX) c.x += dg; else c.y += dg;
    if(dl){
      latMove(s, c, dl);
      if(latMove.rej && conflict) held = true;
    }
    c.vx = dt > 0 ? (c.x - x0) / dt : 0; c.vy = dt > 0 ? (c.y - y0) / dt : 0;
    c.braking = brake < 1 || held;
  }
  for(i = 0; i < cars.length; i++){
    if(!cars[i].hit){ testImpact(s, cars[i]); if(s.mode !== "play") break; }
  }
  pushOut(s);
  s.cars = cars.filter(function(c){
    if(c.dirX > 0) return !(c.x - c.length/2 > H.x + H.w);
    if(c.dirX < 0) return !(c.x + c.length/2 < H.x);
    if(c.dirY > 0) return !(c.y - c.length/2 > H.y + H.h);
    return !(c.y + c.length/2 < H.y);
  });
  stallStep(s, dt);
}

/* ============================================================ STEP */
function step(s, input, dt){
  input = input || {};
  var fl = !!input.lunge && !s.prevLunge, fc = !!input.confirm && !s.prevConfirm;
  s.time += dt;
  for(var i = s.fx.length - 1; i >= 0; i--){ s.fx[i].t -= dt; if(s.fx[i].t <= 0) s.fx.splice(i, 1); }
  if(s.mode === "attract"){ if(fc) s.mode = "play"; }
  else if(s.mode === "card"){ if(fc) dismiss(s); }
  else if(s.mode === "over"){ if(fc) resetRun(s, 1); }
  else if(s.mode === "play"){
    if(s.options.traffic && s.vehiclesSpawned >= s.allocation && s.cars.length === 0) levelEnd(s);
    else {
      spawnStep(s, dt);
      dummyStep(s, input, dt, fl);
      carsStep(s, dt);
    }
  }
  s.prevLunge = !!input.lunge; s.prevConfirm = !!input.confirm;
  return s;
}

var api = { createSim:createSim, step:step, PARAMS:PARAMS, dials:dials };
if(typeof module !== "undefined" && module.exports) module.exports = api;
if(typeof window !== "undefined") window.DummiesSim = api;
})();


# FILE index.html
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>DUMMIES</title>
<style>
  :root{
    --ink:#16181a; --paper:#e8eaec; --asphalt:#4a4f53; --line:#cfd3d6;
    --hazard:#e8b400; --orange:#f26a1b; --red:#c0392b; --green:#1f7a57;
    --mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
    --cond:"IBM Plex Sans Condensed","IBM Plex Sans",system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:#1b1e20;color:var(--paper);font-family:var(--mono);
       display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px}
  #wrap{position:relative;width:min(100%,900px)}
  canvas{display:block;width:100%;height:auto;background:var(--asphalt);border:1px solid #2d3236;touch-action:none}
  #pad{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center;
       font-size:11px;letter-spacing:.06em;color:#8d969b;text-transform:uppercase}
  #pad b{color:var(--paper);font-weight:500}
  button{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;
         background:#2a2f33;color:var(--paper);border:1px solid #3c4347;padding:6px 12px;cursor:pointer;border-radius:2px}
  button:hover{background:#343a3f}
  button:focus-visible{outline:2px solid var(--orange);outline-offset:2px}
</style>

<div id="wrap"><canvas id="c" width="900" height="620"></canvas></div>
<div id="pad">
  <span>Move <b>WASD / arrows</b></span>
  <span>Lunge <b>space</b></span>
  <span>Hold to run — cars slow for you</span>
  <span>Stand still — you get repaired</span>
  <button id="restart">Restart</button>
  <button id="debug">Perception: on</button>
</div>

<script src="sim.js"></script>
<script>
"use strict";

var SIM = window.DummiesSim, P = SIM.PARAMS, HALL = P.hall;
var MONO = "'IBM Plex Mono',ui-monospace,Menlo,monospace";
var COND = "'IBM Plex Sans Condensed','IBM Plex Sans',system-ui,sans-serif";
var cv = document.getElementById("c"), ctx = cv.getContext("2d");
var W = cv.width, H = cv.height;
var showPerception = true, shake = 0, lastFx = 0;
function newSeed(){ return (Date.now() & 0x7fffffff) || 1; }
var S = SIM.createSim({ seed:newSeed() });

/* ============================================================ INPUT */
var keys = {}, pendConfirm = false, ptr = false;
addEventListener("keydown", function(e){
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key) >= 0) e.preventDefault();
  if(!e.repeat) pendConfirm = true;
  keys[e.key.toLowerCase()] = true;
});
addEventListener("keyup", function(e){ keys[e.key.toLowerCase()] = false; });
function clearInput(){ keys = {}; ptr = false; }
addEventListener("blur", clearInput);
addEventListener("visibilitychange", clearInput);
cv.addEventListener("pointerdown", function(){ pendConfirm = true; ptr = true; });
addEventListener("pointerup", function(){ ptr = false; });
addEventListener("pointercancel", function(){ ptr = false; });
document.getElementById("restart").onclick = function(e){ e.target.blur(); S = SIM.createSim({ seed:newSeed() }); lastFx = 0; };
document.getElementById("debug").onclick = function(e){
  showPerception = !showPerception;
  e.target.textContent = "Perception: " + (showPerception ? "on" : "off");
  e.target.blur();
};
function readInput(){
  var dx = 0, dy = 0;
  if(keys["a"] || keys["arrowleft"])  dx -= 1;
  if(keys["d"] || keys["arrowright"]) dx += 1;
  if(keys["w"] || keys["arrowup"])    dy -= 1;
  if(keys["s"] || keys["arrowdown"])  dy += 1;
  var cf = pendConfirm; pendConfirm = false;
  return { dx:dx, dy:dy, lunge:!!keys[" "] || ptr, confirm:cf };
}

/* ============================================================ RENDER */
function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}
function arrow(x,y,dx,dy){
  ctx.save(); ctx.translate(x,y); ctx.rotate(Math.atan2(dy,dx));
  ctx.beginPath(); ctx.moveTo(-7,-7); ctx.lineTo(3,0); ctx.lineTo(-7,7); ctx.stroke();
  ctx.restore();
}
function drawHall(){
  var h = HALL;
  ctx.fillStyle = "#3f4448"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#4a4f53"; ctx.fillRect(h.x,h.y,h.w,h.h);
  ctx.strokeStyle = "rgba(230,234,236,.22)"; ctx.lineWidth = 2; ctx.setLineDash([16,20]);
  var i;
  for(i = 1; i < 5; i++){ ctx.beginPath(); ctx.moveTo(h.x, h.y + h.h*i/5); ctx.lineTo(h.x+h.w, h.y + h.h*i/5); ctx.stroke(); }
  for(i = 1; i < 6; i++){ ctx.beginPath(); ctx.moveTo(h.x + h.w*i/6, h.y); ctx.lineTo(h.x + h.w*i/6, h.y+h.h); ctx.stroke(); }
  ctx.setLineDash([]);
}
function drawShoulders(L){
  var h = HALL, r;
  ctx.fillStyle = "#62665a";
  if(L.kind === "road"){
    r = L.road;
    ctx.fillRect(h.x, r.y - r.halfWidth - r.shoulder, h.w, r.shoulder);
    ctx.fillRect(h.x, r.y + r.halfWidth, h.w, r.shoulder);
  } else if(L.kind === "cross"){
    r = L.roadH;
    ctx.fillRect(h.x, r.y - r.halfWidth - r.shoulder, h.w, r.shoulder);
    ctx.fillRect(h.x, r.y + r.halfWidth, h.w, r.shoulder);
    r = L.roadV;
    ctx.fillRect(r.x - r.halfWidth - r.shoulder, h.y, r.shoulder, h.h);
    ctx.fillRect(r.x + r.halfWidth, h.y, r.shoulder, h.h);
  }
}
function barrier(x0,y0,x1,y1){
  ctx.setLineDash([]); ctx.lineWidth = 6; ctx.strokeStyle = "#8a2a20";
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = "#f4f4f4"; ctx.setLineDash([10,10]);
  ctx.beginPath(); ctx.moveTo(x0,y0); ctx.lineTo(x1,y1); ctx.stroke();
  ctx.setLineDash([]);
}
function drawBarriers(L){
  var h = HALL, r;
  if(L.kind === "road"){
    r = L.road; var e = r.halfWidth + r.shoulder;
    barrier(h.x, r.y - e, h.x + h.w, r.y - e);
    barrier(h.x, r.y + e, h.x + h.w, r.y + e);
  } else if(L.kind === "cross"){
    var a = L.roadH, b = L.roadV, ea = a.halfWidth + a.shoulder, eb = b.halfWidth + b.shoulder;
    var vx0 = b.x - eb, vx1 = b.x + eb, hy0 = a.y - ea, hy1 = a.y + ea;
    barrier(h.x, hy0, vx0, hy0); barrier(vx1, hy0, h.x + h.w, hy0);
    barrier(h.x, hy1, vx0, hy1); barrier(vx1, hy1, h.x + h.w, hy1);
    barrier(vx0, h.y, vx0, hy0); barrier(vx0, hy1, vx0, h.y + h.h);
    barrier(vx1, h.y, vx1, hy0); barrier(vx1, hy1, vx1, h.y + h.h);
  }
}
function drawRoads(){
  var L = P.levels[S.level - 1], h = HALL, x, y, r;
  if(L.kind === "hall") return;
  drawShoulders(L);
  ctx.fillStyle = "#33373b";
  if(L.kind === "road"){
    r = L.road;
    ctx.fillRect(h.x, r.y - r.halfWidth, h.w, r.halfWidth*2);
  } else {
    ctx.fillRect(h.x, L.roadH.y - L.roadH.halfWidth, h.w, L.roadH.halfWidth*2);
    ctx.fillRect(L.roadV.x - L.roadV.halfWidth, h.y, L.roadV.halfWidth*2, h.h);
  }
  ctx.lineWidth = 3; ctx.strokeStyle = "rgba(232,234,236,.75)";
  if(L.kind === "road"){
    ctx.beginPath(); ctx.moveTo(h.x, r.y - r.halfWidth); ctx.lineTo(h.x+h.w, r.y - r.halfWidth);
    ctx.moveTo(h.x, r.y + r.halfWidth); ctx.lineTo(h.x+h.w, r.y + r.halfWidth); ctx.stroke();
    ctx.strokeStyle = "rgba(232,180,0,.7)"; ctx.setLineDash([18,14]);
    ctx.beginPath(); ctx.moveTo(h.x, r.y); ctx.lineTo(h.x+h.w, r.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(232,234,236,.35)"; ctx.lineWidth = 2;
    for(x = h.x + 60; x < h.x + h.w - 30; x += 140){ arrow(x, r.laneYs[0], 1, 0); arrow(x + 70, r.laneYs[1], 1, 0); }
  } else {
    var rh = L.roadH, rv = L.roadV, jx0 = rv.x - rv.halfWidth, jx1 = rv.x + rv.halfWidth, jy0 = rh.y - rh.halfWidth, jy1 = rh.y + rh.halfWidth;
    ctx.beginPath();
    ctx.moveTo(h.x, jy0); ctx.lineTo(jx0, jy0); ctx.lineTo(jx0, h.y);
    ctx.moveTo(jx1, h.y); ctx.lineTo(jx1, jy0); ctx.lineTo(h.x+h.w, jy0);
    ctx.moveTo(h.x, jy1); ctx.lineTo(jx0, jy1); ctx.lineTo(jx0, h.y+h.h);
    ctx.moveTo(jx1, h.y+h.h); ctx.lineTo(jx1, jy1); ctx.lineTo(h.x+h.w, jy1);
    ctx.stroke();
    ctx.strokeStyle = "rgba(232,234,236,.4)"; ctx.setLineDash([18,14]); ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(h.x, rh.y); ctx.lineTo(jx0, rh.y); ctx.moveTo(jx1, rh.y); ctx.lineTo(h.x+h.w, rh.y);
    ctx.moveTo(rv.x, h.y); ctx.lineTo(rv.x, jy0); ctx.moveTo(rv.x, jy1); ctx.lineTo(rv.x, h.y+h.h);
    ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(232,234,236,.3)"; ctx.lineWidth = 1; ctx.setLineDash([4,6]);
    ctx.strokeRect(jx0, jy0, jx1-jx0, jy1-jy0); ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(232,234,236,.45)"; ctx.lineWidth = 2;
    for(x = h.x + 60; x < jx0 - 20; x += 110){ arrow(x, rh.laneYs[0], 1, 0); arrow(x + 55, rh.laneYs[1], 1, 0); }
    for(x = jx1 + 60; x < h.x + h.w - 30; x += 110){ arrow(x, rh.laneYs[0], 1, 0); arrow(x + 55, rh.laneYs[1], 1, 0); }
    for(y = h.y + 50; y < jy0 - 20; y += 90){ arrow(rv.laneXs[0], y, 0, 1); arrow(rv.laneXs[1], y + 45, 0, 1); }
    for(y = jy1 + 50; y < h.y + h.h - 20; y += 90){ arrow(rv.laneXs[0], y, 0, 1); arrow(rv.laneXs[1], y + 45, 0, 1); }
  }
  drawBarriers(L);
  ctx.strokeStyle = "#6c7378"; ctx.lineWidth = 2; ctx.strokeRect(h.x,h.y,h.w,h.h);
}
function fileState(u){
  if(u.closed) return "closed";
  if(u.contacts === 0) return "naive";
  if(u.contacts === 1) return "briefed";
  return "adapted";
}
function drawCar(c){
  var u = S.fleet[c.unit], cl = P.classes[c.cls], D = SIM.dials(S, u), ang = Math.atan2(c.dirY, c.dirX);
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang);
  if(showPerception && S.mode === "play"){
    ctx.fillStyle = c.sees ? "rgba(242,106,27,.17)" : "rgba(230,234,236,.07)";
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.lineTo(D.detect, D.margin); ctx.lineTo(D.detect, -D.margin);
    ctx.closePath(); ctx.fill();
    if(cl.swerve){
      ctx.strokeStyle = "rgba(230,234,236,.30)"; ctx.setLineDash([5,5]); ctx.lineWidth = 1;
      var ca = D.detect * cl.commitFrac;
      ctx.beginPath(); ctx.moveTo(ca, -D.margin); ctx.lineTo(ca, D.margin); ctx.stroke();
      ctx.setLineDash([]);
    }
    if(c.lock){
      ctx.strokeStyle = "#f26a1b"; ctx.lineWidth = 3;
      var s = -c.lock * (c.width/2 + 13);
      ctx.beginPath();
      ctx.moveTo(c.length*0.10, s - c.lock*9);
      ctx.lineTo(c.length*0.34, s);
      ctx.lineTo(c.length*0.10, s + c.lock*9);
      ctx.stroke();
    }
  }
  ctx.fillStyle = u.closed ? "#b9c1c6" : "#e8eaec";
  rr(-c.length/2, -c.width/2, c.length, c.width, 6); ctx.fill();
  ctx.fillStyle = "#f26a1b";
  rr(c.length/2 - 9, -c.width/2, 9, c.width, 4); ctx.fill();
  if(c.braking){ ctx.fillStyle = "#c0392b"; ctx.fillRect(-c.length/2, -c.width/2+2, 4, c.width-4); }
  ctx.restore();

  var fs = fileState(u), n = fs === "briefed" ? 1 : fs === "adapted" ? 2 : 0;
  ctx.save(); ctx.translate(c.x, c.y);
  for(var i = 0; i < n; i++){
    ctx.fillStyle = "#16181a";
    ctx.beginPath(); ctx.arc(-6 + i*12, 0, 2.6, 0, 6.283); ctx.fill();
  }
  if(u.closed){
    ctx.strokeStyle = "#16181a"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "rgba(22,24,26,.72)"; ctx.font = "600 9px " + MONO;
  ctx.textAlign = "center"; ctx.fillText(c.id, 0, c.width/2 + 11);
  ctx.restore();
}
function drawDummy(){
  var d = S.dummy, r = P.dummy.radius;
  ctx.save(); ctx.translate(d.x, d.y);
  if(d.serviceOn){
    ctx.strokeStyle = "rgba(31,122,87,.85)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r + 8 + Math.sin(S.time*8)*2, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "#16181a"; ctx.beginPath(); ctx.arc(0, 0, r + 2, 0, 6.283); ctx.fill();
  ctx.fillStyle = d.lunging ? "#f26a1b" : (d.recovering ? "#b89c3a" : "#e8b400");
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
  ctx.fillStyle = "#16181a";
  for(var i = -1; i <= 1; i += 2) ctx.fillRect(-r, i*3 - 1.5, r*2, 3);
  if(d.recovering){
    var u = Math.min(1, d.recT / P.dummy.recoveryTime);
    ctx.strokeStyle = "rgba(127,211,255,.9)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(0, 0, r + 6, -Math.PI/2, -Math.PI/2 + 6.283 * (1 - u)); ctx.stroke();
  }
  ctx.restore();
}
function drawHud(){
  var h = HALL, y = 18, d = S.dummy, wear = 1 - d.health / P.dummy.maxHealth, i;
  var bw = 190;
  ctx.fillStyle = "rgba(22,24,26,.45)"; rr(h.x, y-9, bw, 13, 3); ctx.fill();
  ctx.fillStyle = wear > 0.72 ? "#c0392b" : "#e8b400";
  rr(h.x, y-9, Math.max(0.01, bw * (1 - wear)), 13, 3); ctx.fill();
  var qx = h.x + bw + 20;
  for(i = 0; i < S.quota; i++){
    ctx.beginPath(); ctx.arc(qx + i*16, y - 2, 5.5, 0, 6.283);
    ctx.fillStyle = i < S.levelWriteOffs ? "#e8eaec" : "rgba(232,234,236,.26)"; ctx.fill();
  }
  ctx.textAlign = "center"; ctx.fillStyle = "#e8eaec"; ctx.font = "700 14px " + COND;
  ctx.fillText("LEVEL " + S.level + " \u00b7 " + P.levels[S.level-1].name, W/2 + 40, y + 2);
  var lx = h.x + h.w - 12*15, ly = y - 10;
  for(var k = 0; k < 12; k++){
    var u = S.fleet[k], x = lx + k*15;
    ctx.strokeStyle = "rgba(232,234,236,.34)"; ctx.lineWidth = 1; ctx.strokeRect(x, ly, 12, 14);
    if(u.closed){ ctx.fillStyle = "#1f7a57"; ctx.fillRect(x+1.5, ly+1.5, 9, 11); }
    else if(u.contacts > 0){ ctx.fillStyle = "rgba(232,234,236,.30)"; ctx.fillRect(x+1.5, ly+10.5, 9, 2); }
  }
  ctx.textAlign = "left"; ctx.fillStyle = "rgba(232,234,236,.6)"; ctx.font = "500 10px " + MONO;
  ctx.fillText("CARS " + S.vehiclesSpawned + "/" + S.allocation + " \u00b7 BODIES " + S.bodiesDestroyed + "/" + P.certificationTarget, h.x, H - 16);
}
function drawFx(){
  for(var i = 0; i < S.fx.length; i++){
    var f = S.fx[i];
    if(f.k === "pay"){
      ctx.globalAlpha = Math.max(0, Math.min(1, f.t * 1.6));
      ctx.fillStyle = f.big ? "#f26a1b" : "#e8eaec";
      ctx.font = (f.big ? "700 26px " : "600 17px ") + COND;
      ctx.textAlign = "center";
      ctx.fillText("+" + f.v.toLocaleString(), f.x, f.y - (0.95 - f.t) * 34);
      ctx.globalAlpha = 1;
    }
    if(f.k === "stamp"){
      ctx.globalAlpha = Math.max(0, Math.min(1, f.t));
      ctx.fillStyle = "#1f7a57"; ctx.font = "700 15px " + COND;
      ctx.textAlign = "right"; ctx.fillText("FILE CLOSED", HALL.x + HALL.w, 48);
      ctx.globalAlpha = 1;
    }
  }
}
function wrapText(s, max){
  var words = s.split(" "), lines = [], cur = "";
  for(var i = 0; i < words.length; i++){
    var t = cur ? cur + " " + words[i] : words[i];
    if(ctx.measureText(t).width > max && cur){ lines.push(cur); cur = words[i]; }
    else cur = t;
  }
  if(cur) lines.push(cur);
  return lines;
}
function drawCard(){
  var c = S.card, w = 560, h = c.profile ? 290 : 230, x = (W-w)/2, y = (H-h)/2, i;
  ctx.fillStyle = "rgba(16,18,20,.80)"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#e8eaec"; rr(x, y, w, h, 4); ctx.fill();
  ctx.fillStyle = "#16181a"; ctx.textAlign = "left";
  ctx.font = "700 27px " + COND; ctx.fillText(c.title, x+30, y+48);
  ctx.font = "500 12px " + MONO; ctx.fillStyle = "#5a6166"; ctx.fillText(c.sub, x+30, y+70);
  if(c.kind === "writeoff"){
    ctx.fillStyle = "#f26a1b"; ctx.font = "700 21px " + COND;
    ctx.textAlign = "right"; ctx.fillText("+" + c.pay.toLocaleString(), x+w-30, y+48);
    ctx.textAlign = "left";
  }
  ctx.fillStyle = "#16181a"; ctx.font = "400 14px " + MONO;
  var lines = wrapText(c.line, w - 60);
  for(i = 0; i < lines.length; i++) ctx.fillText(lines[i], x+30, y+104 + i*21);
  var ly = y + h - (c.profile ? 92 : 56);
  ctx.fillStyle = "#5a6166"; ctx.font = "500 10px " + MONO;
  ctx.fillText("OPERATOR LICENCE", x+30, ly - 8);
  for(var k = 0; k < 12; k++){
    var u = S.fleet[k], cx = x + 30 + k*20;
    ctx.strokeStyle = "#b9c1c6"; ctx.lineWidth = 1; ctx.strokeRect(cx, ly, 16, 18);
    if(u.closed){ ctx.fillStyle = "#1f7a57"; ctx.fillRect(cx+2, ly+2, 12, 14); }
    else if(u.contacts > 0){ ctx.fillStyle = "#cfd3d6"; ctx.fillRect(cx+2, ly+13, 12, 3); }
  }
  if(c.profile && c.stats){
    ctx.fillStyle = "#5a6166"; ctx.font = "400 11px " + MONO;
    ctx.fillText(c.stats[0], x+30, y+h-44);
    ctx.fillText(c.stats[1], x+30, y+h-28);
  }
  ctx.fillStyle = "#8d969b"; ctx.font = "500 10px " + MONO; ctx.textAlign = "right";
  ctx.fillText(S.mode === "over" ? "ANY KEY TO RESTART" : "ANY KEY TO CONTINUE", x+w-30, y+h-14);
  ctx.textAlign = "left";
}
function drawAttract(){
  ctx.fillStyle = "rgba(16,18,20,.55)"; ctx.fillRect(0,0,W,H);
  ctx.textAlign = "center"; ctx.fillStyle = "#e8eaec";
  ctx.font = "700 30px " + COND;
  ctx.fillText("Your job is to be hit by the cars.", W/2, H/2 - 14);
  ctx.fillText("The cars are programmed not to hit you.", W/2, H/2 + 24);
  ctx.font = "500 11px " + MONO; ctx.fillStyle = "#8d969b";
  ctx.fillText("ANY KEY", W/2, H/2 + 64);
  ctx.textAlign = "left";
}

/* ============================================================ LOOP */
var STEP = 1/60, acc = 0, last = performance.now();
function frame(now){
  var dt = Math.min(0.1, (now - last) / 1000); last = now;
  try{
    acc += dt;
    var n = 0;
    while(acc >= STEP && n < 6){ SIM.step(S, readInput(), STEP); acc -= STEP; n++; }
    if(acc > STEP) acc = 0;
    for(var i = 0; i < S.fx.length; i++){
      var f = S.fx[i];
      if(f.id > lastFx){ lastFx = f.id; if(f.k === "pay") shake = 6 + 14 * f.sev; }
    }
    ctx.save();
    if(shake > 0.3){
      ctx.translate((Math.random()-0.5)*shake, (Math.random()-0.5)*shake);
      shake *= 0.86;
    }
    drawHall(); drawRoads();
    for(var j = 0; j < S.cars.length; j++) drawCar(S.cars[j]);
    if(S.mode !== "attract") drawDummy();
    ctx.restore();
    if(S.mode !== "attract") drawHud();
    drawFx();
    if(S.mode === "attract") drawAttract();
    if((S.mode === "card" || S.mode === "over") && S.card) drawCard();
  } catch(e){
    console.error(e);
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>


# BASELINE TESTPAD (reference for unchanged behaviour; not under review)
<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>DUMMIES Testpad</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans+Condensed:wght@600;700&display=swap">
<style>
  :root{
    --ink:#16181a; --paper:#e8eaec; --asphalt:#4a4f53; --line:#cfd3d6;
    --hazard:#e8b400; --orange:#f26a1b; --red:#c0392b; --green:#1f7a57;
    --mono:"IBM Plex Mono",ui-monospace,Menlo,monospace;
    --cond:"IBM Plex Sans Condensed","IBM Plex Sans",system-ui,sans-serif;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{margin:0;background:#1b1e20;color:var(--paper);font-family:var(--mono);
       display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;padding:12px}
  #wrap{position:relative;width:min(100%,900px)}
  canvas{display:block;width:100%;height:auto;background:var(--asphalt);border:1px solid #2d3236;touch-action:none}
  #pad{display:flex;flex-wrap:wrap;gap:14px;justify-content:center;align-items:center;
       font-size:11px;letter-spacing:.06em;color:#8d969b;text-transform:uppercase}
  #pad b{color:var(--paper);font-weight:500}
  button{font-family:var(--mono);font-size:11px;letter-spacing:.08em;text-transform:uppercase;
         background:#2a2f33;color:var(--paper);border:1px solid #3c4347;padding:6px 12px;cursor:pointer;border-radius:2px}
  button:hover{background:#343a3f}
  button:focus-visible{outline:2px solid var(--orange);outline-offset:2px}
</style>

<div id="wrap"><canvas id="c" width="900" height="620"></canvas></div>
<div id="pad">
  <span>Move <b>WASD / arrows</b></span>
  <span>Lunge <b>space</b></span>
  <span>Hold to run — cars slow for you</span>
  <span>Stand still — you get repaired</span>
  <button id="restart">Restart</button>
  <button id="debug">Perception: on</button>
</div>

<script>
"use strict";

/* ============================================================ 1. CONFIG */

var CFG = {
  health:2300, bonus:2500,
  walk:1.35, run:2.70, rampTime:1.0,          // move accelerates walk -> run over ~1s
  lungeDist:164, lungeTime:0.30, lungeCool:0.55,
  dummyR:13,
  maxClosing:13.2, yieldBase:1700, yieldCurve:2.2,
  wearFloor:0.45,                              // reach floor at full damage
  cautionMax:0.40,                             // cars lose up to 40% speed when you run
  serviceDelay:1.5, serviceFull:30.0,          // still 1.5s, then full chassis in 30s
  hall:{x:40,y:40,w:820,h:540}
};
var FACE = {front:1, side:0.25, rear:0};

/* six classes = six answers to the same problem */
var CLASSES = {
  sedan:{label:"Sedan", w:34,l:62, sp:2.30, swerve:true,  commitFrac:0.50, flip:false, brakeFirst:false,
    base:{detect:212, margin:44, predict:0.30, brakeLead:0.45},
    step:{detect:30,  margin:11, predict:0.07, brakeLead:0.04},
    cap :{detect:400, margin:190,predict:0.72, brakeLead:0.68}},
  van:{label:"Van", w:38,l:76, sp:2.00, swerve:true, commitFrac:0.42, flip:false, brakeFirst:true,
    base:{detect:232, margin:38, predict:0.26, brakeLead:0.74},
    step:{detect:28,  margin:10, predict:0.06, brakeLead:0.06},
    cap :{detect:410, margin:188,predict:0.64, brakeLead:0.95}},
  sports:{label:"Sports", w:30,l:58, sp:3.20, swerve:true, commitFrac:0.30, flip:false, brakeFirst:false,
    base:{detect:190, margin:31, predict:0.36, brakeLead:0.28},
    step:{detect:34,  margin:12, predict:0.09, brakeLead:0.03},
    cap :{detect:400, margin:186,predict:0.86, brakeLead:0.50}},
  bus:{label:"Bus", w:46,l:108, sp:1.80, swerve:false, commitFrac:0.50, flip:false, brakeFirst:true,
    base:{detect:258, margin:34, predict:0.22, brakeLead:0.88},
    step:{detect:26,  margin:9,  predict:0.05, brakeLead:0.07},
    cap :{detect:420, margin:184,predict:0.56, brakeLead:1.15}},
  wagon:{label:"Wagon", w:36,l:72, sp:2.40, swerve:true, commitFrac:0.58, flip:false, brakeFirst:false,
    base:{detect:244, margin:58, predict:0.46, brakeLead:0.50},
    step:{detect:32,  margin:14, predict:0.10, brakeLead:0.04},
    cap :{detect:430, margin:200,predict:0.96, brakeLead:0.72}},
  hatch:{label:"Hatch", w:30,l:54, sp:2.60, swerve:true, commitFrac:0.60, flip:true, brakeFirst:false,
    base:{detect:204, margin:41, predict:0.28, brakeLead:0.44},
    step:{detect:30,  margin:11, predict:0.07, brakeLead:0.04},
    cap :{detect:400, margin:188,predict:0.74, brakeLead:0.66}}
};

/* twelve units; pool order is the dispatch order on the ladder */
var FLEET_DEF = [
  ["SDN-01","sedan"], ["SDN-02","sedan"], ["VAN-07","van"],
  ["SPT-11","sports"],["BUS-06","bus"],   ["SDN-04","sedan"],
  ["WGN-05","wagon"], ["HTB-09","hatch"], ["VAN-12","van"],
  ["SPT-03","sports"],["WGN-08","wagon"], ["HTB-10","hatch"]
];

/* the fleet briefs itself: the Nth file to close costs fewer contacts */
var CLOSE_COST = [4,4,3,3,3,2,2,2,2,1,1,1];

/* shift -> quota, vehicles allocated, how many units are in rotation */
var LADDER = [
  {q:2,a:34,pool:3}, {q:3,a:38,pool:4}, {q:3,a:38,pool:6}, {q:4,a:42,pool:8},
  {q:4,a:42,pool:9}, {q:5,a:46,pool:10},{q:5,a:46,pool:12},{q:6,a:48,pool:12}
];
function rung(s){ return s <= LADDER.length ? LADDER[s-1] : {q:6,a:48,pool:12}; }

/* ============================================================ 2. REPORT BANK
   Keyed signature x band. {U} substitutes the unit that filed it.
   Deliberately flat and bureaucratic: the line does not know it is funny. */

var BANK = {
  no_contact:{
    a:["{U}: Subject made no contact this cycle. Chassis returned unused.",
       "{U}: No logged impact. Subject appears to be avoiding the vehicles.",
       "{U}: Shift produced no data. Subject reminded of the job description."],
    b:["{U}: Zero contacts. This unit has filed a note with scheduling.",
       "{U}: Subject declined every approach offered. Allocation wasted."],
    c:["{U}: No contact. The fleet no longer requires this subject's cooperation."]
  },
  wrong_face:{
    a:["{U}: Subject struck from behind on three occasions. Rear impacts are not logged.",
       "{U}: Repeated rear contact. Subject is advised that only the nose pays."],
    b:["{U}: Subject continues to approach from behind. Unproductive.",
       "{U}: Rear contacts recorded. No yield. Subject's technique noted."],
    c:["{U}: Rear contact again. The data set does not include this angle."]
  },
  whiff:{
    a:["{U}: Subject initiated nine approaches. Two logged. This unit will be braking earlier.",
       "{U}: High approach count, low contact rate. Subject's timing is early.",
       "{U}: Numerous attempts, few impacts. This unit has adjusted its margin."],
    b:["{U}: Subject's success rate is below floor average. Briefing circulated.",
       "{U}: Many lunges, little data. {V} concurs with this assessment."],
    c:["{U}: Subject still lunging. The fleet has the measurements it needs."]
  },
  serviced:{
    a:["{U}: Subject was serviced twice, unasked. Downtime is deducted from allocation.",
       "{U}: Maintenance attended the subject mid-shift. Chassis integrity restored.",
       "{U}: Subject held position long enough for servicing. Yield reduced accordingly."],
    b:["{U}: Repeated servicing logged. The facility maintains its equipment.",
       "{U}: Subject idle. Panels reattached. Productivity unchanged."],
    c:["{U}: Subject serviced. The licence does not require a working body."]
  },
  jumpy:{
    a:["{U}: Subject moved continuously. This unit reduced speed as a precaution.",
       "{U}: Erratic pedestrian behaviour detected. Approach speed derated.",
       "{U}: Subject will not hold still. Impacts logged at reduced severity."],
    b:["{U}: Continuous motion. The fleet is approaching this subject with caution.",
       "{U}: Subject's unpredictability has been circulated to the floor."],
    c:["{U}: Subject still moving. This unit maintains a safe approach speed."]
  },
  greedy:{
    a:["{U}: Subject sought high-severity impacts exclusively. Chassis exhausted early.",
       "{U}: Frontal preference confirmed. This unit now projects further ahead."],
    b:["{U}: Subject takes only the nose. Margin widened across the floor.",
       "{U}: Severity-seeking behaviour logged. {V} has been briefed."],
    c:["{U}: Subject's preference is on file. No unit will present its nose."]
  },
  timid:{
    a:["{U}: Impacts recorded at low severity throughout. Yield below target.",
       "{U}: Subject accepted only glancing contact. Quota at risk."],
    b:["{U}: Low-severity pattern continues. Subject is not producing usable data.",
       "{U}: Flank contacts only. The facility requires frontal measurements."],
    c:["{U}: Subject's caution noted. It will not affect the outcome."]
  },
  early:{
    a:["{U}: Subject commits before this unit has chosen a lane. Timing is early.",
       "{U}: Approaches initiated outside the decision window. Adjusted."],
    b:["{U}: Subject's timing remains early. This unit now commits later.",
       "{U}: Early commitment logged. {V} concurs."],
    c:["{U}: Still early. The fleet has stopped compensating."]
  },
  late:{
    a:["{U}: Subject commits after this unit has cleared. Timing is late.",
       "{U}: Late approaches logged. This unit has widened its margin."],
    b:["{U}: Subject consistently late. Briefing circulated to the floor.",
       "{U}: Late commitment again. {V} has adjusted accordingly."],
    c:["{U}: Late. This unit was already elsewhere."]
  },
  left:{
    a:["{U}: Subject approached from the left on three of four occasions. Adjusted.",
       "{U}: Left-side bias recorded. This unit now projects to the left."],
    b:["{U}: Left bias confirmed across contacts. Circulated to the fleet.",
       "{U}: Subject favours the left. {V} has been briefed."],
    c:["{U}: Left approach anticipated. Margin held."]
  },
  right:{
    a:["{U}: Subject approached from the right repeatedly. Adjusted.",
       "{U}: Right-side bias recorded. This unit now projects to the right."],
    b:["{U}: Right bias confirmed. Circulated to the fleet.",
       "{U}: Subject favours the right. {V} has been briefed."],
    c:["{U}: Right approach anticipated. Margin held."]
  },
  steady:{
    a:["{U}: Contact logged. Subject performed within expected parameters.",
       "{U}: Impact recorded and filed. Nothing further.",
       "{U}: Measurements obtained. Subject's technique is consistent."],
    b:["{U}: Consistent performance. This unit's file has been updated.",
       "{U}: Data obtained. {V} has been briefed on this subject."],
    c:["{U}: Final measurements taken. This unit's file is complete."]
  }
};

/* ============================================================ 3. STATE */

var cv = document.getElementById("c"), ctx = cv.getContext("2d");
var W = cv.width, H = cv.height;
var S = null, showPerception = true;

function newFleet(){
  return FLEET_DEF.map(function(d){
    return { id:d[0], cls:d[1], contacts:0, closed:false, closeCost:0 };
  });
}

function reset(){
  S = {
    mode:"attract",                 // attract | play | card
    t:0,
    fleet:newFleet(), closedCount:0,
    shift:1, quota:0, spent:0, passed:0,
    score:0, dmg:0, wear:0,
    body:1,
    cars:[], fx:[], used:[],
    card:null, cardKind:null,
    run:{},                         // per-body telemetry
    shiftLunges:0, shiftHits:0, quotaEverMet:false,
    px:CFG.hall.x+CFG.hall.w*0.5, py:CFG.hall.y+CFG.hall.h*0.72,
    pvx:0, pvy:0, speedRamp:0, stillT:0, serviceOn:false,
    lungeRem:0, lungeT:0, cool:0, lx:0, ly:0,
    spawnT:0, freeze:0, shake:0
  };
  startShift(true);
  S.mode = "attract";
}

function freshRun(){
  return { lunges:0, hits:0, front:0, side:0, rear:0, sevSum:0,
           distSum:0, distN:0, leftN:0, rightN:0, services:0,
           speedSum:0, speedN:0, lastUnit:null };
}

/* ============================================================ 4. INPUT */

var keys = {};
function clearInput(){ keys = {}; }
addEventListener("keydown", function(e){
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key) >= 0) e.preventDefault();
  keys[e.key.toLowerCase()] = true;
  if(S.mode === "attract"){ begin(); return; }
  if(S.mode === "card" && (e.key === " " || e.key === "Enter")) advance();
  if(S.mode === "play" && e.key === " ") lunge();
});
addEventListener("keyup", function(e){ keys[e.key.toLowerCase()] = false; });
addEventListener("blur", clearInput);
addEventListener("visibilitychange", clearInput);
cv.addEventListener("pointerdown", function(){
  if(S.mode === "attract") begin(); else if(S.mode === "card") advance(); else lunge();
});
document.getElementById("restart").onclick = function(e){ e.target.blur(); reset(); };
document.getElementById("debug").onclick = function(e){
  showPerception = !showPerception;
  e.target.textContent = "Perception: " + (showPerception ? "on" : "off");
  e.target.blur();
};

function lunge(){
  if(S.cool > 0 || S.lungeRem > 0) return;
  var dx = 0, dy = 0;
  if(keys["a"] || keys["arrowleft"])  dx -= 1;
  if(keys["d"] || keys["arrowright"]) dx += 1;
  if(keys["w"] || keys["arrowup"])    dy -= 1;
  if(keys["s"] || keys["arrowdown"])  dy += 1;
  if(!dx && !dy){ dy = -1; }
  var m = Math.hypot(dx, dy);
  S.lx = dx/m; S.ly = dy/m;
  S.lungeRem = CFG.lungeDist * reachMul();
  S.lungeT = CFG.lungeTime; S.cool = CFG.lungeCool;
  S.run.lunges++; S.shiftLunges++;
}
function reachMul(){ return 1 - (1 - CFG.wearFloor) * Math.min(1, S.wear); }

/* ============================================================ 5. FLEET */

function dials(u){
  var C = CLASSES[u.cls], n = u.contacts, d = {};
  for(var k in C.base) d[k] = Math.min(C.cap[k], C.base[k] + C.step[k] * n);
  if(u.closed){                                    // closed file: it keeps out of your reach
    d.margin = Math.max(d.margin, CFG.lungeDist * 1.22);
    d.detect = Math.max(d.detect, 540);            // and it starts avoiding from much further out
  }
  return d;
}
function fileState(u){
  if(u.closed) return "closed";
  if(u.contacts === 0) return "naive";
  if(u.contacts === 1) return "briefed";
  return "adapted";
}
function band(){ return S.shift <= 3 ? "a" : (S.shift <= 6 ? "b" : "c"); }

function creditContact(u){
  u.contacts++;
  if(!u.closed){
    if(u.closeCost === 0) u.closeCost = CLOSE_COST[Math.min(CLOSE_COST.length-1, S.closedCount)];
    if(u.contacts >= u.closeCost){
      u.closed = true; S.closedCount++;
      S.fx.push({k:"stamp", t:1.2});
    }
  }
}

/* ============================================================ 6. SIMULATION */

function spawnCar(){
  var pool = rung(S.shift).pool;
  var live = S.fleet.slice(0, pool);
  // prefer units whose file is still open, but closed ones still patrol
  var open = live.filter(function(u){ return !u.closed; });
  var pick = (open.length && Math.random() < 0.78) ? open : live;
  var u = pick[(Math.random() * pick.length) | 0];
  var C = CLASSES[u.cls], h = CFG.hall;
  var side = (Math.random() * 4) | 0, x, y, dx, dy;
  if(side === 0){ x = h.x - 90;        y = h.y + 60 + Math.random()*(h.h-120); dx = 1;  dy = 0; }
  if(side === 1){ x = h.x + h.w + 90;  y = h.y + 60 + Math.random()*(h.h-120); dx = -1; dy = 0; }
  if(side === 2){ x = h.x + 60 + Math.random()*(h.w-120); y = h.y - 90;        dx = 0;  dy = 1; }
  if(side === 3){ x = h.x + 60 + Math.random()*(h.w-120); y = h.y + h.h + 90;  dx = 0;  dy = -1; }
  S.cars.push({ u:u, cls:C, x:x, y:y, dx:dx, dy:dy, sp:C.sp, cur:C.sp,
                lat:0, lock:0, lockPush:0, flipped:false, brake:1, hit:false, life:0 });
  S.passed++;
}

function stepCars(dt){
  var h = CFG.hall;
  for(var i = S.cars.length - 1; i >= 0; i--){
    var c = S.cars[i], D = dials(c.u);
    c.life += dt;

    // car frame: forward (dx,dy), right (-dy,dx)
    var pxp = S.px + S.pvx * D.predict * 60, pyp = S.py + S.pvy * D.predict * 60;
    var rx = pxp - c.x, ry = pyp - c.y;
    var along = rx*c.dx + ry*c.dy;
    var lat   = rx*(-c.dy) + ry*(c.dx);

    var conflict = along > 0 && along < D.detect && Math.abs(lat) < D.margin;
    c.sees = conflict;

    // --- commitment (pillar 1: the lane it takes is the gap it leaves)
    var canSwerve = c.cls.swerve || c.u.closed;    // a closed unit routes around you even if it is the bus
    if(canSwerve){
      var cf = c.u.closed ? Math.min(0.92, c.cls.commitFrac * 1.7) : c.cls.commitFrac;
      var commitAt = D.detect * cf;
      if(!c.lock && conflict && along < commitAt){
        c.lock = lat > 0 ? -1 : 1;
        c.lockPush = D.margin;
      }
      // the hatchback is the only unit that can change its mind inside the ring
      if(c.lock && c.cls.flip && !c.u.closed && !c.flipped && along < commitAt * 0.52){
        if((lat > 0 && c.lock === 1) || (lat < 0 && c.lock === -1)){
          c.lock = -c.lock; c.flipped = true;
        }
      }
      if(c.lock){
        var want = c.lock * c.lockPush, d = want - c.lat;
        // open files swing at a flat rate; only a closed file gets the slew it needs
        // to reach its wide margin (otherwise a growing margin = a faster swing = more yield)
        var slew = c.u.closed ? (2.6 + D.margin / 46) : 3.0;
        c.lat += Math.max(-slew, Math.min(slew, d * 0.14));
      } else if(Math.abs(c.lat) > 0.4){
        c.lat *= 0.96;
      }
    }

    // --- braking is the SECOND avoidance: only the brake-first classes lead with it,
    //     everyone else brakes only when they failed to pick a lane in time.
    c.brake = 1;
    if(conflict){
      if(c.cls.brakeFirst && along < D.detect * D.brakeLead) c.brake = c.cls.swerve ? 0.55 : 0.34;
      else if(canSwerve && !c.lock && along < D.detect * 0.22) c.brake = 0.66;
    }
    var derate = 1 - CFG.cautionMax * playerSpeedFrac();
    c.cur = c.sp * c.brake * derate;

    // --- mutual avoidance: do not drive through each other
    for(var j = 0; j < S.cars.length; j++){
      if(j === i) continue;
      var o = S.cars[j];
      if(o.dx !== c.dx || o.dy !== c.dy) continue;
      var ax = (o.x - c.x)*c.dx + (o.y - c.y)*c.dy;
      var ay = (o.x - c.x)*(-c.dy) + (o.y - c.y)*(c.dx);
      if(ax > 0 && ax < c.cls.l + 34 && Math.abs(ay - (o.lat - c.lat)) < 28) c.cur = Math.min(c.cur, o.cur * 0.84);
    }

    // --- integrate
    var px0 = c.x, py0 = c.y;
    c.x += c.dx * c.cur + (-c.dy) * (c.lat - (c.latPrev || 0));
    c.y += c.dy * c.cur + ( c.dx) * (c.lat - (c.latPrev || 0));
    c.latPrev = c.lat;
    c.vx = c.x - px0; c.vy = c.y - py0;

    if(!c.hit) testImpact(c);

    var out = c.x < h.x - 200 || c.x > h.x + h.w + 200 || c.y < h.y - 200 || c.y > h.y + h.h + 200;
    if(out && c.life > 0.5) S.cars.splice(i, 1);
  }
}

function playerSpeedFrac(){
  var v = Math.hypot(S.pvx, S.pvy);
  return Math.min(1, v / CFG.run);
}

function testImpact(c){
  // closest point on the car rectangle to the dummy
  var rx = S.px - c.x, ry = S.py - c.y;
  var a = rx*c.dx + ry*c.dy, b = rx*(-c.dy) + ry*(c.dx);
  var ha = c.cls.l/2, hb = c.cls.w/2;
  var ca = Math.max(-ha, Math.min(ha, a)), cb = Math.max(-hb, Math.min(hb, b));
  if(Math.hypot(a - ca, b - cb) > CFG.dummyR) return;

  var face = a > ha * 0.42 ? "front" : (a < -ha * 0.42 ? "rear" : "side");
  if(face === "rear"){ c.hit = true; S.run.rear++; return; }

  var rvx = c.vx - S.pvx, rvy = c.vy - S.pvy;
  var closing = Math.hypot(rvx, rvy);
  var sev = Math.max(0, Math.min(1, closing / CFG.maxClosing));
  var pay = Math.round(Math.pow(sev, CFG.yieldCurve) * CFG.yieldBase * FACE[face]);

  c.hit = true;
  S.score += pay;
  S.dmg += pay;
  S.wear = Math.min(1, S.dmg / CFG.health);
  S.freeze = face === "front" ? 0.09 : 0.05;
  S.shake = 6 + 14 * sev;

  var R = S.run;
  R.hits++; S.shiftHits++; R.sevSum += sev;
  R[face]++;
  R.distSum += Math.hypot(S.px - c.x, S.py - c.y); R.distN++;
  if(b < 0) R.leftN++; else R.rightN++;
  R.lastUnit = c.u;

  S.fx.push({k:"pay", t:0.95, x:S.px, y:S.py - 18, v:pay, big:face === "front"});

  if(S.dmg >= CFG.health) endLife();
}

function stepPlayer(dt){
  var dx = 0, dy = 0;
  if(keys["a"] || keys["arrowleft"])  dx -= 1;
  if(keys["d"] || keys["arrowright"]) dx += 1;
  if(keys["w"] || keys["arrowup"])    dy -= 1;
  if(keys["s"] || keys["arrowdown"])  dy += 1;
  var moving = dx || dy;

  // speed is the input: hold a direction and you ramp from walk to run
  S.speedRamp = moving ? Math.min(1, S.speedRamp + dt / CFG.rampTime)
                       : Math.max(0, S.speedRamp - dt / (CFG.rampTime * 0.5));
  var base = (CFG.walk + (CFG.run - CFG.walk) * S.speedRamp) * (1 - 0.30 * S.wear);

  if(S.lungeRem > 0){
    var stepL = Math.min(S.lungeRem, CFG.lungeDist / (CFG.lungeTime * 60));
    S.pvx = S.lx * stepL; S.pvy = S.ly * stepL;
    S.lungeRem -= stepL;
  } else if(moving){
    var m = Math.hypot(dx, dy);
    S.pvx = dx/m * base; S.pvy = dy/m * base;
  } else {
    S.pvx = 0; S.pvy = 0;
  }
  S.px += S.pvx; S.py += S.pvy;

  var h = CFG.hall, r = CFG.dummyR;
  S.px = Math.max(h.x + r, Math.min(h.x + h.w - r, S.px));
  S.py = Math.max(h.y + r, Math.min(h.y + h.h - r, S.py));

  S.run.speedSum += playerSpeedFrac(); S.run.speedN++;
  if(S.cool > 0) S.cool -= dt;

  // maintenance: stillness is a resource with a fuse
  if(!moving && S.lungeRem <= 0){
    S.stillT += dt;
    if(S.stillT > CFG.serviceDelay && S.dmg > 0){
      if(!S.serviceOn){ S.serviceOn = true; S.run.services++; }
      S.dmg = Math.max(0, S.dmg - (CFG.health / CFG.serviceFull) * dt);
      S.wear = Math.min(1, S.dmg / CFG.health);
    }
  } else {
    S.stillT = 0; S.serviceOn = false;
  }
}

/* ============================================================ 7. SIGNATURE */

function signature(){
  var R = S.run;
  if(R.hits === 0) return "no_contact";
  if(R.rear >= 3 && R.front === 0) return "wrong_face";
  if(R.lunges >= 5 && R.hits / R.lunges < 0.34) return "whiff";
  if(R.services >= 2) return "serviced";
  if(R.speedN && R.speedSum / R.speedN > 0.58) return "jumpy";
  var mean = R.sevSum / R.hits;
  if(mean >= 0.55) return "greedy";
  if(mean < 0.18) return "timid";
  var d = R.distN ? R.distSum / R.distN : 48;
  if(d > 62) return "early";
  if(d < 34) return "late";
  if(R.leftN - R.rightN >= 2) return "left";
  if(R.rightN - R.leftN >= 2) return "right";
  return "steady";
}

function pickLine(sig, unit){
  var set = (BANK[sig] || BANK.steady)[band()] || BANK[sig].a;
  var free = set.filter(function(l){ return S.used.indexOf(l) < 0; });
  var line = (free.length ? free : set)[((free.length ? free : set).length * Math.random()) | 0];
  S.used.push(line);
  var other = S.fleet.filter(function(u){ return u !== unit && u.contacts > 0; });
  var v = other.length ? other[(Math.random() * other.length) | 0].id : "the floor";
  return line.replace(/\{U\}/g, unit ? unit.id : "FLOOR").replace(/\{V\}/g, v);
}

/* ============================================================ 8. FLOW */

function startShift(silent){
  var r = rung(S.shift);
  S.quota = r.q; S.spent = 0; S.passed = 0;
  S.shiftLunges = 0; S.shiftHits = 0;
  S.used = [];
  S.cars = [];
  if(!silent) newLife();
}

function newLife(){
  S.dmg = 0; S.wear = 0; S.run = freshRun();
  S.px = CFG.hall.x + CFG.hall.w * 0.5;
  S.py = CFG.hall.y + CFG.hall.h * 0.72;
  S.pvx = S.pvy = 0; S.lungeRem = 0; S.cool = 0;
  S.stillT = 0; S.serviceOn = false; S.speedRamp = 0;
  S.body++;
  S.mode = "play";
}

function endLife(){
  S.spent++;
  S.score += CFG.bonus;
  var sig = signature();
  var u = S.run.lastUnit || S.fleet[0];
  creditContact(u);                      // the unit that wrote you off is the one that learns
  S.card = { title:"UNIT WRITTEN OFF", sub:"QUOTA " + S.spent + " OF " + S.quota,
             line:pickLine(sig, u), sig:sig, unit:u, pay:CFG.bonus };
  S.cardKind = "life";
  S.mode = "card";

  if(S.closedCount >= 12) return finish("licensed");
  if(S.spent >= S.quota) S.quotaEverMet = true;
}

function endShiftCheck(){
  if(S.mode !== "play") return;
  if(S.passed < rung(S.shift).a) return;
  // allocation spent
  if(S.quotaEverMet && S.shiftLunges === 0 && S.shiftHits === 0) return finish("noncompliant");
  if(S.spent >= S.quota){
    S.shift++;
    S.card = { title:"SHIFT COMPLETE", sub:"REASSIGNED — SHIFT " + S.shift,
               line:"Quota met. Allocation increased. The fleet has been briefed." };
    S.cardKind = "shift"; S.mode = "card";
  } else {
    finish("decommissioned");
  }
}

function finish(kind){
  var last = S.run.lastUnit || S.fleet[0];
  if(kind === "licensed"){
    S.card = { title:"OPERATOR LICENCE ISSUED",
               sub:"ALL TWELVE UNITS REPORT CONTACT",
               line:last.id + ": All twelve units report contact. Operator licence issued. " +
                    "Subject is not cleared to operate a vehicle." };
  } else if(kind === "noncompliant"){
    S.card = { title:"NON-COMPLIANT", sub:"SHIFT " + S.shift + " — NO CONTACT ATTEMPTED",
               line:"BUS-06: Subject stood in bay four for the duration. This unit has no comment." };
  } else {
    S.card = { title:"DECOMMISSIONED", sub:"QUOTA " + S.spent + " OF " + S.quota + " — SHIFT " + S.shift,
               line:"Subject did not approach. Recommend reassignment." };
  }
  S.card.profile = true;
  S.cardKind = "over"; S.mode = "card";
}

function begin(){ S.mode = "play"; newLife(); }

function advance(){
  if(S.cardKind === "over"){ reset(); S.mode = "attract"; return; }
  if(S.cardKind === "shift"){ startShift(false); return; }
  newLife();
  endShiftCheck();
}

/* ============================================================ 9. RENDER */

function rr(x,y,w,h,r){
  ctx.beginPath();
  ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function drawHall(){
  var h = CFG.hall;
  ctx.fillStyle = "#3f4448"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#4a4f53"; ctx.fillRect(h.x,h.y,h.w,h.h);
  ctx.strokeStyle = "#6c7378"; ctx.lineWidth = 2; ctx.strokeRect(h.x,h.y,h.w,h.h);
  ctx.strokeStyle = "rgba(230,234,236,.22)"; ctx.lineWidth = 2; ctx.setLineDash([16,20]);
  for(var i = 1; i < 5; i++){
    ctx.beginPath(); ctx.moveTo(h.x, h.y + h.h*i/5); ctx.lineTo(h.x+h.w, h.y + h.h*i/5); ctx.stroke();
  }
  for(var j = 1; j < 6; j++){
    ctx.beginPath(); ctx.moveTo(h.x + h.w*j/6, h.y); ctx.lineTo(h.x + h.w*j/6, h.y+h.h); ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawCar(c){
  var D = dials(c.u), ang = Math.atan2(c.dy, c.dx);
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang);

  if(showPerception && S.mode === "play"){
    ctx.fillStyle = c.sees ? "rgba(242,106,27,.17)" : "rgba(230,234,236,.07)";
    ctx.beginPath(); ctx.moveTo(0,0);
    ctx.lineTo(D.detect,  D.margin); ctx.lineTo(D.detect, -D.margin);
    ctx.closePath(); ctx.fill();
    if(c.cls.swerve){
      ctx.strokeStyle = "rgba(230,234,236,.30)"; ctx.setLineDash([5,5]); ctx.lineWidth = 1;
      var ca = D.detect * c.cls.commitFrac;
      ctx.beginPath(); ctx.moveTo(ca, -D.margin); ctx.lineTo(ca, D.margin); ctx.stroke();
      ctx.setLineDash([]);
    }
    if(c.lock){  // chevron: the choice it can no longer take back
      ctx.strokeStyle = "#f26a1b"; ctx.lineWidth = 3;
      var s = -c.lock * (c.cls.w/2 + 13);
      ctx.beginPath();
      ctx.moveTo(c.cls.l*0.10, s - c.lock*9);
      ctx.lineTo(c.cls.l*0.34, s);
      ctx.lineTo(c.cls.l*0.10, s + c.lock*9);
      ctx.stroke();
    }
  }

  var closed = c.u.closed;
  ctx.fillStyle = closed ? "#b9c1c6" : "#e8eaec";
  rr(-c.cls.l/2, -c.cls.w/2, c.cls.l, c.cls.w, 6); ctx.fill();
  ctx.fillStyle = "#f26a1b";                                  // the nose pays
  rr(c.cls.l/2 - 9, -c.cls.w/2, 9, c.cls.w, 4); ctx.fill();
  if(c.brake < 1){ ctx.fillStyle = "#c0392b"; ctx.fillRect(-c.cls.l/2, -c.cls.w/2+2, 4, c.cls.w-4); }
  ctx.restore();

  // file state: dots, then a ring when the file is closed
  var fs = fileState(c.u), n = fs === "briefed" ? 1 : fs === "adapted" ? 2 : 0;
  ctx.save(); ctx.translate(c.x, c.y);
  for(var i = 0; i < n; i++){
    ctx.fillStyle = "#16181a";
    ctx.beginPath(); ctx.arc(-6 + i*12, 0, 2.6, 0, 6.283); ctx.fill();
  }
  if(closed){
    ctx.strokeStyle = "#16181a"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 7, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "rgba(22,24,26,.72)"; ctx.font = "600 9px " + "'IBM Plex Mono',monospace";
  ctx.textAlign = "center"; ctx.fillText(c.u.id, 0, c.cls.w/2 + 11);
  ctx.restore();
}

function drawDummy(){
  var r = CFG.dummyR, lunging = S.lungeRem > 0;
  ctx.save(); ctx.translate(S.px, S.py);
  if(S.serviceOn){
    ctx.strokeStyle = "rgba(31,122,87,.85)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r + 8 + Math.sin(S.t*8)*2, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "#16181a"; ctx.beginPath(); ctx.arc(0, 0, r + 2, 0, 6.283); ctx.fill();
  ctx.fillStyle = lunging ? "#f26a1b" : "#e8b400";
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.fill();
  ctx.fillStyle = "#16181a";
  for(var i = -1; i <= 1; i += 2) ctx.fillRect(-r, i*3 - 1.5, r*2, 3);
  ctx.restore();
}

function drawHud(){
  var h = CFG.hall, y = 18;
  // integrity (graphical; no score on screen during play)
  var bw = 190;
  ctx.fillStyle = "rgba(22,24,26,.45)"; rr(h.x, y-9, bw, 13, 3); ctx.fill();
  ctx.fillStyle = S.wear > 0.72 ? "#c0392b" : "#e8b400";
  rr(h.x, y-9, bw * (1 - S.wear), 13, 3); ctx.fill();

  // quota pips
  var qx = h.x + bw + 20;
  for(var i = 0; i < S.quota; i++){
    ctx.beginPath(); ctx.arc(qx + i*16, y - 2, 5.5, 0, 6.283);
    ctx.fillStyle = i < S.spent ? "#e8eaec" : "rgba(232,234,236,.26)"; ctx.fill();
  }

  // licence sheet: twelve cells, stamped as files close
  var lx = h.x + h.w - 12*15, ly = y - 10;
  for(var k = 0; k < 12; k++){
    var u = S.fleet[k], x = lx + k*15;
    ctx.strokeStyle = "rgba(232,234,236,.34)"; ctx.lineWidth = 1;
    ctx.strokeRect(x, ly, 12, 14);
    if(u.closed){
      ctx.fillStyle = "#1f7a57"; ctx.fillRect(x+1.5, ly+1.5, 9, 11);
    } else if(u.contacts > 0){
      ctx.fillStyle = "rgba(232,234,236,.30)"; ctx.fillRect(x+1.5, ly+10.5, 9, 2);
    }
  }
}

function drawFx(dt){
  for(var i = S.fx.length - 1; i >= 0; i--){
    var f = S.fx[i]; f.t -= dt;
    if(f.k === "pay"){
      ctx.globalAlpha = Math.max(0, Math.min(1, f.t * 1.6));
      ctx.fillStyle = f.big ? "#f26a1b" : "#e8eaec";
      ctx.font = (f.big ? "700 26px " : "600 17px ") + "'IBM Plex Sans Condensed',sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("+" + f.v.toLocaleString(), f.x, f.y - (0.95 - f.t) * 34);
      ctx.globalAlpha = 1;
    }
    if(f.k === "stamp"){
      ctx.globalAlpha = Math.max(0, Math.min(1, f.t));
      ctx.fillStyle = "#1f7a57"; ctx.font = "700 15px 'IBM Plex Sans Condensed',sans-serif";
      ctx.textAlign = "right"; ctx.fillText("FILE CLOSED", CFG.hall.x + CFG.hall.w, 48);
      ctx.globalAlpha = 1;
    }
    if(f.t <= 0) S.fx.splice(i, 1);
  }
}

function wrapText(s, max){
  var words = s.split(" "), lines = [], cur = "";
  for(var i = 0; i < words.length; i++){
    var t = cur ? cur + " " + words[i] : words[i];
    if(ctx.measureText(t).width > max && cur){ lines.push(cur); cur = words[i]; }
    else cur = t;
  }
  if(cur) lines.push(cur);
  return lines;
}

function drawCard(){
  var c = S.card, w = 560, h = c.profile ? 290 : 230, x = (W-w)/2, y = (H-h)/2;
  ctx.fillStyle = "rgba(16,18,20,.80)"; ctx.fillRect(0,0,W,H);
  ctx.fillStyle = "#e8eaec"; rr(x, y, w, h, 4); ctx.fill();
  ctx.fillStyle = "#16181a";

  ctx.textAlign = "left";
  ctx.font = "700 27px 'IBM Plex Sans Condensed',sans-serif";
  ctx.fillText(c.title, x+30, y+48);
  ctx.font = "500 12px 'IBM Plex Mono',monospace";
  ctx.fillStyle = "#5a6166"; ctx.fillText(c.sub, x+30, y+70);

  if(S.cardKind === "life"){
    ctx.fillStyle = "#f26a1b"; ctx.font = "700 21px 'IBM Plex Sans Condensed',sans-serif";
    ctx.textAlign = "right"; ctx.fillText("+" + c.pay.toLocaleString(), x+w-30, y+48);
    ctx.textAlign = "left";
  }

  ctx.fillStyle = "#16181a"; ctx.font = "400 14px 'IBM Plex Mono',monospace";
  var lines = wrapText(c.line, w - 60);
  for(var i = 0; i < lines.length; i++) ctx.fillText(lines[i], x+30, y+104 + i*21);

  // licence sheet on the card
  var ly = y + h - (c.profile ? 92 : 56);
  ctx.fillStyle = "#5a6166"; ctx.font = "500 10px 'IBM Plex Mono',monospace";
  ctx.fillText("OPERATOR LICENCE", x+30, ly - 8);
  for(var k = 0; k < 12; k++){
    var u = S.fleet[k], cx = x + 30 + k*20;
    ctx.strokeStyle = "#b9c1c6"; ctx.lineWidth = 1; ctx.strokeRect(cx, ly, 16, 18);
    if(u.closed){
      ctx.fillStyle = "#1f7a57"; ctx.fillRect(cx+2, ly+2, 12, 14);
    } else if(u.contacts > 0){
      ctx.fillStyle = "#cfd3d6"; ctx.fillRect(cx+2, ly+13, 12, 3);
    }
  }

  if(c.profile){
    var R = S.run, sig = signature();
    ctx.fillStyle = "#5a6166"; ctx.font = "400 11px 'IBM Plex Mono',monospace";
    ctx.fillText("Subject DM-7734 · body " + S.body + " · adult male, 50th percentile", x+30, y+h-44);
    ctx.fillText("Profile: " + sig + " · files closed " + S.closedCount + " of 12 · shift " + S.shift,
                 x+30, y+h-28);
  }

  ctx.fillStyle = "#8d969b"; ctx.font = "500 10px 'IBM Plex Mono',monospace";
  ctx.textAlign = "right";
  ctx.fillText(S.cardKind === "over" ? "ANY KEY TO RESTART" : "ANY KEY TO CONTINUE", x+w-30, y+h-14);
  ctx.textAlign = "left";
}

function drawAttract(){
  ctx.fillStyle = "rgba(16,18,20,.55)"; ctx.fillRect(0,0,W,H);
  ctx.textAlign = "center"; ctx.fillStyle = "#e8eaec";
  ctx.font = "700 30px 'IBM Plex Sans Condensed',sans-serif";
  ctx.fillText("Your job is to be hit by the cars.", W/2, H/2 - 14);
  ctx.fillText("The cars are programmed not to hit you.", W/2, H/2 + 24);
  ctx.font = "500 11px 'IBM Plex Mono',monospace"; ctx.fillStyle = "#8d969b";
  ctx.fillText("ANY KEY", W/2, H/2 + 64);
  ctx.textAlign = "left";
}

/* ============================================================ 10. LOOP */

var last = performance.now();
function frame(now){
  var dt = Math.min(0.05, (now - last) / 1000); last = now;
  try{
    S.t += dt;

    if(S.mode === "play" || S.mode === "attract"){
      if(S.freeze > 0) S.freeze -= dt;
      else {
        if(S.mode === "play") stepPlayer(dt);
        S.spawnT -= dt;
        if(S.spawnT <= 0 && S.passed < rung(S.shift).a + 4){
          spawnCar();
          S.spawnT = 1.25 + Math.random() * 1.15;
        }
        stepCars(dt);
        if(S.mode === "play") endShiftCheck();
      }
    }

    ctx.save();
    if(S.shake > 0.3){
      ctx.translate((Math.random()-0.5)*S.shake, (Math.random()-0.5)*S.shake);
      S.shake *= 0.86;
    }
    drawHall();
    for(var i = 0; i < S.cars.length; i++) drawCar(S.cars[i]);
    if(S.mode !== "attract") drawDummy();
    ctx.restore();

    if(S.mode !== "attract") drawHud();
    drawFx(dt);
    if(S.mode === "attract") drawAttract();
    if(S.mode === "card") drawCard();
  } catch(e){
    console.error(e);
  }
  requestAnimationFrame(frame);
}

reset();
requestAnimationFrame(frame);
</script>
