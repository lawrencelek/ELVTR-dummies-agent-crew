REPAIR PASS. Fix every item below and return both complete files.

# FAILING AUTOMATED CHECKS
[
  {
    "id": "a_standing_dummy_is_steered_round",
    "description": "A dummy that simply stands in a lane is not hit by swerving cars: they go round it and do not cut back in until they are past (levels 1 and 2; the bus, which cannot swerve, is excluded)",
    "pass": false,
    "detail": "Error: level 2, dummy standing at (245,284): hit by 1 of 21 cars, e.g. SPT-11 frontCorner 38 |     at assert (/home/claude/elvtr-dummies-agent-crew/checks/run_checks.js:18:47) |     at /home/claude/elvtr-dummies-agent-crew/checks/run_checks.js:514:9"
  }
]

# QA REPAIR REQUESTS
[
  {
    "file": "sim.js",
    "problem": "AC-84 and the failed check a_standing_dummy_is_steered_round: SPT-11 clips a standing lane dummy (level 2, dummy at (245,284), frontCorner 38). The car commits too late for its swerve to clear the dummy at its unsure speed.",
    "required_change": "In Vehicles (carsStep), trace the SPT-11 case and find why it is hit: late commit, a lateral move rejected by latFree or axisMove, or a swerve that is slower than the dummy clearance needs. Then make the fix inside Vehicles so a feasible swerve clears a standing dummy. For example, make the lateral slew fast enough that the lateral offset reaches the dummy's clearance before the car's front reaches the dummy at its unsure speed. Alternatively hold the unsure speed lower for low-commitFrac classes until the swerve is complete. If the fix needs a change to the commit line (detect x commitFrac), flag it to the Designer; the spec says the commit line is unchanged. Re-run a_standing_dummy_is_steered_round for all classes on levels 1 and 2."
  }
]

# QA DEFECTS
[
  {
    "severity": "major",
    "file": "sim.js",
    "problem": "A standing dummy is still clipped by the fast Sports car (SPT-11 frontCorner 38 on level 2 at (245,284)). Sports has commitFrac 0.3, so it commits only about 57 px from its centre, and it is still at about 96 px/s (0.5 x 192). The swerve to margin 31 takes about 0.3 s, which is about as long as the car needs to reach the dummy. Its flank or front corner therefore meets the dummy before the lateral clearance exists. AC-84 requires zero such hits."
  },
  {
    "severity": "minor",
    "file": "sim.js",
    "problem": "Brake factor B is computed from conflict (including the predicted position) and a Testpad-style stuck flag before awareness is applied. This is harmless because B is only used when aware or locked, but the stuck path for an unaware, unlocked car is not covered by any check."
  }
]

# SPECIFICATION
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
      "maxHealth": 1600,
      "writeOffBonus": 2500,
      "startX": 150,
      "startY": 500
    },
    "impact": {
      "basePoints": 100,
      "refSpeed": 138,
      "refMass": 1.0,
      "maxPay": 1600,
      "zoneNose": 1,
      "zoneFrontCorner": 0.6,
      "zoneFlank": 0.3,
      "zoneRearCorner": 0.15,
      "zoneTail": 0.05,
      "lungeMultiplier": 5,
      "contactEps": 0.5,
      "pushClearance": 0.1
    },
    "writeOff": {
      "duration": 1.1
    },
    "perception": {
      "reactionDelay": 0.15,
      "sideRadius": 100,
      "sideHalfAngleDeg": 80,
      "warySpeedFactor": 0.6,
      "unsureSpeedFactor": 0.5,
      "frontRange": 320
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
      "3. Draws are made only in mode play. Same seed and same input sequence must give a byte-identical state sequence. Solidity, push-out, damage, barrier, stall-breaker, write-off animation timing and (CR-005) side sensing, the longer path-zone range, the actual-or-predicted path test, the lock release, swerve completion, the reaction timer and awareness use no random draws.",
      "4. A restart from mode over re-seeds state.rng from state.seed and resets fleet learning, score and counters, so a restarted run repeats the original."
    ],
    "lunge": [
      "1. Fresh press means input.lunge is true and state.prevLunge was false. prevLunge is stored in state and updated on every step in every mode (including writeoff). A lunge held through a card or restart is not fresh.",
      "2. A lunge starts only if mode is play, the dummy is not lunging, the cooldown is 0 and the press is fresh. A press while blocked is discarded, not buffered. The cooldown is set to lungeCooldown at lunge start.",
      "3. Direction is normalised (dx,dy) if either is non-zero at the moment of the press. Otherwise it is dummy.facing. facing updates every play step to the normalised held direction when one is held. The initial facing is (0,-1).",
      "4. The lunge runs for lungeDuration with t = elapsed/lungeDuration clamped to [0,1] and easeOutCubic p(t) = 1 - (1-t)^3. Each step displaces the dummy by dir * lungeDistance * reach * (p(t_now) - p(t_prev)). A step that crosses t=1 uses p=1, so the total is exact at any dt.",
      "5. reach = 1 - (1 - wearFloor) * (1 - health/maxHealth). At full health reach is exactly 1. The position is clamped to the hall each step.",
      "6. (CR-003, rewrites CR-002 rule 6) Lunge velocity is reported in dummy.vx and vy as displacement / dt (before any push-out). While lunging, input movement is ignored. The velocity is recorded in lastImpact for information only; neither its direction nor its magnitude enters the damage formula. Only the boolean dummy.lunging does. (CR-005: the same velocity still feeds the Testpad caution factor of perception_and_reaction rule 8, and the predicted position of rule 1.)",
      "7. (CR-001) The lunge is not stopped by a car. If the lunge displacement would end inside a car, the push-out of solid_cars rule 3 applies at the end of the step, so the dummy slides out along the shortest way; the lunge timer keeps running."
    ],
    "recovery": [
      "1. When a lunge ends, recovering becomes true for recoveryTime (0.35 s). The dummy can move immediately.",
      "2. With u = elapsed/recoveryTime in [0,1], factor f(u) = easeOutQuad = 1 - (1-u)^2. Movement speed = normal walk/run ramp speed * f. At u>=1 recovering becomes false and the factor is 1.",
      "3. No hard freeze. A new lunge needs the cooldown to have expired, so it is possible during the last 0.10 s of recovery. The factor still applies to walking after that lunge ends.",
      "4. Recovery clears on write-off (at the moment of the hit), level change and restart."
    ],
    "car_to_car": [
      "1. Every spawn takes serial = ++state.serialCounter (extra field, never reset within a run, reset on restart). Cars keep their serial for life.",
      "2. Car A yields only to cars B with B.serial < A.serial. The car with the lowest serial in the hall never yields, so no yield-deadlock is possible.",
      "3. (CR-001 addendum, replaces earlier rule 3) Look-ahead test, evaluated every play step for each B with B.serial < A.serial that is NOT behind A: let D = lookAheadBase + lookAheadTime * A.speed. Sweep rectangle S_A is A's rectangle extended by D in A's travel direction and widened by sidePad on each lateral side. Sweep rectangle S_B is B's rectangle extended by otherLookTime * B.speed in B's travel direction. A must yield to B if S_A intersects S_B. B is 'behind A' when B has the same travel direction as A, B's lateral band (width inflated by sidePad) overlaps A's lateral band, and B's centre is behind A's centre along the travel direction. A car never yields to a car that is behind it.",
      "4. While yielding, A's target speed is 0. Exception: if B has the same direction as A, is ahead in the same lane band and the gap between rectangles is greater than holdGap, the target is B.speed (follow, do not stop). A's speed moves toward the target at decel, and never exceeds the car's normal target from the speed-because-of-the-dummy rule (perception_and_reaction rule 7). Giving way is immediate: it never waits for the reaction delay.",
      "5. Resume: when the test is clear for all lower-serial cars on a step, A's yield target is removed. Its speed rises toward its normal target at accel px/s^2. There is no timer or hysteresis.",
      "6. (replaces released backstop) Cars are processed in ascending serial order. After computing a car's intended displacement for the step (longitudinal then lateral), it is truncated at the first contact with the current rectangle of ANY other car (any serial), so that the rectangles just touch (gap 0). If the truncation was longitudinal, the car's speed is set to min(speed, speed component of that car along A's direction, floored at 0). Because all cars start a step non-overlapping and each move is truncated against all others, rectangles never overlap, on every level. The dummy is never an obstacle in this truncation.",
      "7. (CR-005, rewrites the brake-light rule) braking is true on a step when the car's speed fell during that step, or when the car is held below its undisturbed target, i.e. its speed is below its cruise-based target for any reason (wary or unsure dummy response, car, truncation or swerve infeasible) and its target is not above its speed. braking is false while the car cruises, while it accelerates, and throughout the reaction delay (a car that is not yet aware of the dummy shows no brake lights because of it). Giving way to another car lights braking at once.",
      "8. A spawn is delayed while a spawn rectangle inflated by spawnClearPad overlaps any car. vehiclesSpawned and the serial increment only when the car actually appears.",
      "9. (CR-001) Sideways moves (swerve, hatch flip, and any lateral displacement) are made only into free space: the lateral sweep rectangle, from the car's current rectangle to its target lateral position, inflated by sidePad on all sides and extended by D in the travel direction, must not intersect any other car's rectangle (any serial). Each step the lateral displacement is also truncated by rule 6. If the check fails the lateral move for that step is not made.",
      "10. (CR-001, CR-005 change 7) Swerve feasibility, used both at the commit line and every step while locked: the Testpad target lateral centre T must keep the car's whole rectangle inside the road's barrier limits (road_limits rule 3) and pass the free-space check of rule 9. At the commit line (reached by an aware car, perception_and_reaction rule 5), if the preferred side is infeasible the other side is tried (the hatch may still flip once, only to a feasible side); if neither is feasible the car does not lock and stays unsure: it brakes (speed target as perception_and_reaction rule 7, unsure case, stops short of the dummy using the Testpad braking rule of brake-first classes). If a locked car becomes infeasible, it keeps its lock, stops moving laterally and brakes as before (rule 7, committed but unable). The lock is released only as perception_and_reaction rule 6 says: when the dummy's actual position is fully behind the car (behind its rear edge by more than the dummy's radius). Until then the car holds its offset. A lateral move that is merely delayed by rule 9 or truncated by rule 6 on a step is not infeasibility: the swerve is incomplete and the car stays at its unsure speed (perception_and_reaction rule 7d).",
      "11. (CR-001, addendum) Level 3 only: a car's lateral move is also rejected if its new lateral band (rectangle width inflated by sidePad) would overlap the band of any oncoming car (opposite travel direction), and a spawn waits while its band overlaps an oncoming car's band. This prevents head-on collinear traffic. Perpendicular traffic is handled by rule 3. Levels 1 and 2 have no oncoming cars (one-way), so no oncoming-band test applies there.",
      "12. (CR-001 addendum) Lowest serial never held for good. The car with the lowest serial in the hall must not be held up indefinitely by another car. This is ensured by: rule 2 (it never yields), rule 3 (cars behind it do not make it wait and it does not wait for cars behind), and the stall breaker of rule 13.",
      "13. (CR-001 addendum) Stall breaker (backstop). Track for the lowest-serial car L the continuous time it has speed < 1 px/s while the dummy is NOT inside its detection zone (sees false). When this time reaches carToCar.stallLimit (6 s), every car with a higher serial whose rectangle is within holdGap + 1 px of L's rectangle or inside L's look-ahead sweep S_L is removed from the hall without score and without write-off; it still counts as spawned. The timer resets whenever L moves at >= 1 px/s, sees the dummy, or leaves the hall. If no such car exists the timer simply keeps running. The breaker uses no random draws and is not expected to fire in normal play. QA only reports on it (qa_audit 4). The timer is frozen in mode writeoff. (CR-005 interpretation: 'sees' is the sensing path zone, which now reaches frontRange and counts the predicted position too, so the timer also resets while the dummy, or its predicted position, is anywhere in that longer zone.)"
    ],
    "solid_cars": [
      "1. Every car is a solid rectangle (length x width, centre x,y, axis-aligned to its travel direction) on all four sides, on every level, and stays solid after its impact.",
      "2. Order in each play step: (a) dummy movement (walk or lunge), (b) cars move (Vehicles.step, rule car_to_car 6), (c) impacts are judged for every car not yet hit using the positions after steps a and b, before any push-out, in ascending serial order; if an impact takes health to 0 the write-off starts (level_flow 5) and no further car is judged in that step, (d) push-out, (e) hall clamp. A write-off's writeOff.x, writeOff.y are the dummy position after step e.",
      "3. Push-out: for each car whose rectangle is closer to the dummy centre than radius (distance to rectangle < radius, or centre inside), the dummy is moved along the shortest way out by exactly the penetration plus impact.pushClearance. Outside the rectangle the direction is from the closest rectangle point to the centre. If the centre is inside, the direction is the face normal of least penetration. After the push the dummy is clamped to the hall. If the clamped position is still inside any car, the next-shortest face exit is tried in ascending distance; if none is inside the hall and clear of all cars, the dummy moves to the nearest clear point in the hall found by a fixed search over the 8 directions in order (E,SE,S,SW,W,NW,N,NE) at 4 px steps up to 120 px. After every step the dummy's circle reaches at most 1 px into any car.",
      "4. A moving car pushes the dummy ahead of it or aside, by rule 3, every step. The dummy's velocity fields are not altered by push-out. Cars never slow, stop or deflect because the dummy is solid; only the dummy-reaction logic (sensing, awareness, slowing, commitment, braking; perception_and_reaction) affects cars.",
      "5. (CR-003, replaces CR-002 rule 5) Impact contact: an impact needs distance from the dummy centre to the car rectangle <= radius + impact.contactEps, judged in step c. The zone comes from Damage.contactFace using the pre-contact position (no_tunnelling rules), the damage from Damage.assess (damage_module rules). Each car has at most one impact (hit). Every contact, in every zone, consumes the hit, sets levelContact and records state.lastImpact. Every zone pays; only a contact with a stopped car (vehicleSpeed 0) has damage 0, and it changes neither health nor score.",
      "6. Dummy overlap with several cars is resolved car by car in ascending serial order, repeated up to 4 passes in the step."
    ],
    "damage": [
      "1. (CR-003, replaces the whole CR-002 formula) For every contact: damage = min(impact.maxPay, round(impact.basePoints * zoneShare * lungeFactor * momentumFactor)). Rounding is applied once, to the product. There is no perMomentum, no lungeBonus and no dependence on lunge direction or lunge speed.",
      "2. basePoints = 100. zoneShare (faceFactor in the module's output) is by the zone from Damage.contactFace: nose zoneNose 1.00, frontCorner zoneFrontCorner 0.60, flank zoneFlank 0.30 (anywhere along either long side), rearCorner zoneRearCorner 0.15, tail zoneTail 0.05.",
      "3. lungeFactor = impact.lungeMultiplier (5) if dummy.lunging is true on the step of contact, otherwise 1 (walking, running or standing, whatever the velocity). It is flat.",
      "4. momentumFactor = (vehicleSpeed * classes[cls].mass) / (impact.refSpeed * impact.refMass), refSpeed 138, refMass 1.0, so a cruising sedan is exactly 1.0. vehicleSpeed is car.speed after step b of the same step. A braking car pays proportionally less; vehicleSpeed <= 0 gives momentumFactor 0 and damage 0.",
      "5. dummy.health -= damage (floored at 0) and score += damage, both equal to state.lastImpact.damage (health lost is smaller only where the floor at 0 applies). Nothing else reduces health. A write-off follows when health reaches 0 (level_flow 5).",
      "6. (CR-004, rewrites the figure) Severity-driven features (report signatures, screen shake, cards) keep using severity = damage / impact.maxPay, in [0,1]. With maxPay 1600 severity is the share of a body (a lunging sedan nose hit is 500/1600 = 0.31). The largest possible single hit, a lunge into a cruising bus nose, is 1174 or 0.73; no new rescaling is made.",
      "7. Guaranteed ordering: zone shares fall in the order nose > frontCorner > flank > rearCorner > tail, so at equal speed, class and lunge state damage is non-increasing in that order; a lunging hit is 5 times the walking hit on the same zone before rounding; damage is non-decreasing in vehicleSpeed; direction of the lunge changes nothing.",
      "8. (CR-004, rewrites the body figures) Calibration at cruise speed (walking / lunging): sedan nose 100/500, frontCorner 60/300, flank 30/150, rearCorner 15/75, tail 5/25. Nose by class: van 130/652, sports 125/626, bus 235/1174, wagon 125/626, hatch 90/452. Bus flank 70/352. No single hit reaches maxPay at cruise speed (largest 1174 < 1600), so the cap is a safeguard. A fresh body (1600) takes 4 lunging sedan nose hits (3 leave 100 health), or 16 walking ones. (CR-005: these are cruise-speed figures; a car that is aware and slowed by the dummy pays proportionally less, see perception_and_reaction rule 12.)"
    ],
    "damage_module": [
      "1. sim.js exports Damage with exactly two functions, contactFace and assess. Both are pure: no state, no reads of state or globals other than PARAMS passed in, no Math.random, no clock, no mutation of arguments, same inputs give same outputs.",
      "2. Damage.contactFace(car, px, py): with a = (px - car.x)*car.dirX + (py - car.y)*car.dirY (offset along travel) and b = -(px - car.x)*car.dirY + (py - car.y)*car.dirX (offset across): nose if a > length/2 and |b| <= width/2; frontCorner if a > length/2 and |b| > width/2; flank if |a| <= length/2; tail if a < -length/2 and |b| <= width/2; rearCorner if a < -length/2 and |b| > width/2. Returns the string.",
      "3. Damage.assess(params, contact) with contact = { cls, vehicleSpeed, dirX, dirY, face, dummyVx, dummyVy, lunging } returns { mass, faceFactor, lungeFactor, momentumFactor, damage } by damage rules 1 to 4. faceFactor is the zone share, looked up from params.impact by face. dirX, dirY, dummyVx, dummyVy are accepted and ignored by the arithmetic. damage is an integer in [0, maxPay].",
      "4. These two functions are the only place that decides a zone or an amount of damage. The step code calls them once per contact and applies the result (damage rule 5); it contains no damage arithmetic of its own.",
      "5. state.lastImpact is null at createSim and after restart. On every impact it is replaced by { time, serial, id, cls, face, vehicleSpeed, dirX, dirY, dummyVx, dummyVy, lunging, mass, faceFactor, lungeFactor, momentumFactor, damage } (the contact inputs plus the assess outputs). Re-running Damage.assess on the recorded inputs must reproduce the recorded outputs. It persists across write-off animations, cards and levels.",
      "6. If two cars are contacted in one step, impacts are applied in ascending serial order and lastImpact holds the last one; each applies its own damage. If the first takes health to 0, the later car is not judged that step (solid_cars 2)."
    ],
    "no_tunnelling": [
      "1. At the start of every play step the sim snapshots, as local values derived from state, the dummy position and every car's centre (x, y).",
      "2. The zone of an impact is judged by Damage.contactFace(carBefore, px, py) where carBefore has the car's current dirX, dirY, length, width but its centre from the snapshot, and (px, py) is the dummy's snapshot position. The end-of-step position (possibly deep inside the rectangle after a 27 px lunge step) is never used.",
      "3. If the snapshot position was inside carBefore's rectangle (for example a car that overlaps the restart position), (px, py) is replaced by the point just outside the rectangle along the least-penetration face normal of solid_cars rule 3 before calling contactFace.",
      "4. The zone is therefore the same at dt = 1/60 and 1/120 for the same approach."
    ],
    "vehicles_module": [
      "1. sim.js exports Vehicles. All car behaviour lives in it: spawning (spawn timer, pending spawn, entry, serial, spawn clearance), cruise speeds, perception (path zone, side sensors, sees, wary, the reaction timer and aware, caution), commitment and swerving (lock, flip, feasibility, swerve completion, lock release), braking, giving way to other cars, truncation, road and barrier limits, removal when out of the hall, and the stall breaker. The rules of car_to_car, road_limits, one_way_level_2 and level_flow 2 and 4 are unchanged (except as edited by CR-005) and are implemented there.",
      "2. Exports at least Vehicles.step(state, dt) (advance spawning and every car one step, step b of solid_cars 2), Vehicles.cruiseSpeed(params, cls) = params.classes[cls].speed (the undisturbed speed before any slowing, braking or give-way) and (CR-005) Vehicles.senses(state, car, px, py) (perception_and_reaction rule 2). Vehicles.step is called only in mode play.",
      "3. Vehicles.step may read state.dummy, state.level, state.params, state.fleet learning and the RNG; it may write cars, vehiclesSpawned, serialCounter, nextSpawn, pendingSpawn, rng, the stall timer and car fields. It never writes dummy fields, health, score, bodiesDestroyed, mode, writeOff, lastImpact or any hit flag. Nothing outside Vehicles creates, moves, slows or removes a car (level start sets cars to an empty array and fleet learning updates unit dials after an impact, neither moves a car).",
      "4. A spawned car has speed = Vehicles.cruiseSpeed(params, cls), lock 0, braking false, hit false, sees false, wary false, aware false, senseTime 0 (extra car field, perception_and_reaction rule 3).",
      "5. (CR-005 change 7) Speed bounds and rates, every step: 0 <= car.speed <= cruiseSpeed. Speed falls toward its target at no more than decel (600 px/s^2) and rises at no more than accel (360 px/s^2), except where truncation (car_to_car 6) sets it to the speed of the car it touches, or where a change of target (wary, unsure, caution factor) rescales the target. A car with no reason to slow (not aware of the dummy, or committed with its swerve complete and nothing lower-serial ahead) is at cruise speed exactly; the caution factor is not applied to it. A committed car whose swerve is not complete is slowed as unsure, caution factor included.",
      "6. Paths: a car's travel direction never changes during its life. With no dummy in its path zone or side sensor and no yield, a car stays on its lane line exactly (levels 1 and 2: lane y or x from params; level 3: its spawn lateral coordinate). Lateral motion happens only through swerve, flip or return to lane as in the Testpad, subject to car_to_car 9 and 10 and road_limits.",
      "7. Within Vehicles.step the order is: spawn handling, then each car in ascending serial (perception: path and side sensing, reaction timer, aware; lock release; commitment; swerve completion; target speed; speed update; longitudinal then lateral displacement; truncation), then removal of cars wholly out of the hall, then the stall breaker. RNG draws occur only in spawn handling in the order of randomness rule 2."
    ],
    "perception_and_reaction": [
      "1. (CR-005 change 6, rewritten) Path zone. For a point P, with a its offset along the car's travel from the car's centre and b across it (using the unit's current detect and margin), P is in the path zone when 0 < a < senseRange and |b| < margin, where senseRange = max(detect, perception.frontRange) with the unit's current detect (so 320 px for every unit at its base dials, and the unit's own detect once learning raises it above 320). The width is the unit's margin, unchanged. sees is true when EITHER the dummy's actual position OR its predicted position (actual + velocity x the unit's current predict) is in the path zone. Prediction can only add to what a car senses, never take away. It is instant, computed every play step.",
      "2. (CR-005 change 6, rewritten) Side sensors. Let N be the centre of the car's nose = car centre + (dirX, dirY) * length/2, and v the vector from N to the dummy's actual position (no prediction). wary is true when sees is false, |v| <= perception.sideRadius (100) and the angle between v and the heading is <= perception.sideHalfAngleDeg (80 degrees), i.e. v.heading >= |v| * cos(80 deg); |v| = 0 counts as inside. The wedge is the half-disc sector in front of the nose line. Vehicles.senses(state, car, px, py) returns \"path\" if a dummy standing still at (px, py) is in the path zone of rule 1 (0 < a < max(detect, frontRange), |b| < margin, the unit's current dials), else \"side\" if it is in a side sensor, else null. It is pure geometry. The step computes sees = (senses(actual) == \"path\") OR (senses(predicted point) == \"path\"), and wary = (not sees) AND senses(actual) == \"side\". A \"side\" result for the predicted point is ignored.",
      "3. (CR-005) Reaction timer. Each car has senseTime (extra field, seconds). On every play step: if sees or wary, senseTime += dt, else senseTime = 0. aware = senseTime >= perception.reactionDelay (0.15 s, with a 1e-9 tolerance). aware is recomputed every step, so it is false the moment sensing stops. A car that has not been aware does nothing because of the dummy. Aware becomes true on the step in which senseTime first reaches 0.15 (9 steps at 1/60, 18 at 1/120; at most one step late).",
      "4. (CR-005) The delay applies only to the dummy. Giving way to other cars (car_to_car), staying inside barriers, solidity and truncation are immediate and never read aware. Spawning, serials and the stall breaker are unchanged.",
      "5. (CR-005) Everything a car does because of the dummy requires aware: slowing below cruise (rules 7 and 8), braking, committing to a side at the commit line, and the hatchback's flip. A car that is not aware carries on exactly as if the dummy were not there, including its lane, speed and lock state. Commit conditions otherwise as Testpad (dummy in the path zone, the dummy's predicted offset a below the commit line detect x commitFrac using the unit's own detect, swerve feasible per car_to_car 10), plus aware. A wary-only car (dummy in a side sensor, not in the path) never commits, swerves or flips.",
      "6. (CR-005 change 7, rewritten) A commitment already made stays made: lock, side and target lateral position are not affected by aware dropping to false, by sees dropping to false, or by the dummy's predicted position moving. A committed car's lock is released only on a step when the dummy's ACTUAL position is fully behind the car: a_actual < -(length/2 + dummy.radius), i.e. behind the car's rear edge by more than the dummy's radius. Until then the car holds its lateral offset (it does not start to return to its lane). It is never released because of the predicted position, the dummy leaving the sensors, the dummy leaving the unit's detect zone, or the dummy merely being behind the car's centre. A released car is again uncommitted and returns to its lane as in the Testpad (subject to car_to_car 9); if it senses the dummy anew it is subject to the delay again.",
      "7. (CR-005 change 7, replaces the Testpad braking and caution rules) Speed because of the dummy. Let c = cruiseSpeed(class), F = the Testpad caution factor, and B = the Testpad brake factor for the class and distance (computed from the unit's own detect x brakeLead; brake-first classes as Testpad; B = 1 beyond the brake distance). Target speed:\n   a) not aware: c. The dummy's own speed has no effect.\n   b) aware, wary (dummy in a side sensor only): c * warySpeedFactor * F.\n   c) aware, sees, lock 0 (unsure): min(c * unsureSpeedFactor, c * B) * F.\n   d) lock != 0, the swerve is possible (car_to_car 10) and NOT complete (the car's lateral centre is more than 2 px from its locked target lateral centre T): exactly as case c, min(c * unsureSpeedFactor, c * B) * F, whether or not aware or sees is still true (the commitment was made while aware, and the car stays slow until the swerve is done).\n   d2) lock != 0, the swerve is possible and complete (|lateral centre - T| <= 2 px): c. The car ignores the dummy from then on, whatever it does, until the lock is released (rule 6).\n   e) lock != 0 and the swerve is infeasible: c * B (the Testpad brake), F not applied.\n   The bus (swerve false) never locks: when aware and sees it stays in case c, and when aware and wary in case b. A car that has sensed the dummy but is not yet aware is case a (unless already locked, cases d to e). The yield target of car_to_car 4 and 5 is combined by taking the minimum of the two targets. Speed moves toward the target at decel and accel (vehicles_module 5).",
      "8. (CR-005 change 7) F, the Testpad caution factor, = 1 - caution.max * s where s in [0,1] is the Testpad measure of the dummy moving fast (its speed fraction between walking and the Testpad maximum, using dummy.vx, vy as lunge velocity gives s = 1); s = 0 for a standing dummy, so F = 1 and the target in b is exactly 0.6 c and in c and d exactly min(0.5, B) c. F applies to cases b, c and d only (aware wary, unsure, and committed with the swerve not yet complete). It does not touch cars that have not noticed the dummy (a), cars committed with the swerve complete (d2), or committed cars that cannot swerve (e).",
      "9. (CR-005 change 7) Lunge interplay: a dummy that has been in a car's path for at least reactionDelay and then lunges keeps the car aware (the actual position is still in the path zone, rule 1, even when the lunge's predicted position lands behind the car), so the car stays in case c (or case d if it has committed) with F near its minimum (0.6), target about 0.3 c (sedan: 0.5 * 0.6 * 138 = 41 px/s). A lunge onto the nose of such a sedan pays about 100 * 5 * 0.3 = 150. A car never speeds back up to cruise because of the dummy lunging at it, and never before its swerve is complete. A hit on a car that is committed with its swerve complete (case d2, at cruise) or not yet aware (case a, at cruise) pays the full 500. Speed reaches its target through the decel and accel slews, so the figure is reached after the slew (150 is a target, not an instantaneous value).",
      "10. (CR-005) The dummy is judged by its actual position for the side sensors and by its actual or predicted position for the path zone. Sensors use the unit's current dials, so fleet learning enlarges the path zone as before (margin always; length only once detect exceeds frontRange). sideRadius, sideHalfAngleDeg, reactionDelay and frontRange are not changed by learning (learning of the delay is out of scope).",
      "11. (CR-005) Car fields. car.sees: path zone (actual or predicted), instant. car.wary: side sensor and not sees, instant. car.aware: as rule 3. car.senseTime: extra field. car.braking: car_to_car 7. These are written only inside Vehicles.",
      "12. (CR-005 change 7, rewritten) Consequence for damage: vehicleSpeed is the car's actual speed after the step, so Damage is unchanged; an unsure car, or a committed car mid-swerve, on its slew toward 0.3 c pays proportionally less. Standing still in the lane in front of a car, at any distance, and lunging straight at it no longer gives the maximum: the car senses a lane-standing dummy from 320 px from its centre, keeps sensing it during the lunge (rule 1), commits at its commit line but stays slow until the swerve is complete (rule 7d), and after that it is out of the dummy's lane. The best-paying hit needs the car to be unaware (an ambush that arrives from outside the sensors and makes contact within reactionDelay of first sensing) or committed with its swerve complete and the dummy moved into the line the car has chosen (baited).",
      "13. (CR-005) Not changed: damage table, quotas, health, levels, fleet learning, the chevron on detection, the hatchback flip cue and the level 3 jam breaker.",
      "14. (CR-005 change 5) Longer frontal sensing. The path zone used for sensing (sees, Vehicles.senses, the reaction timer) reaches max(detect, perception.frontRange) from the car's centre, with perception.frontRange = 320. Its width is the unit's margin, unchanged. No other quantity moves: the commit line (detect x commitFrac), the Testpad brake distances (detect x brakeLead), learning and the side sensors keep using the unit's own dials exactly as before. (The lock release is governed by rule 6, not by detect.)",
      "15. (CR-005 change 5) Effect, sedan at base dials: the car first senses a dummy standing in its lane when its centre is 320 px away (nose 289 px away), 108 px earlier than before, and is aware 0.15 s later with the nose still about 268 px away (car travel 21 px). A lunge covers at most 164 px plus about 41 px of the car's own travel in 0.3 s, so a dummy that has been standing in or entering the lane from afar can never make contact before the car is aware. The car is aware and slowing (case c) at the commit line, which is unchanged at 106 px from its centre; a dummy that stays in the lane past the commit line is baited as before.",
      "16. (CR-005 change 5) Beating the reaction delay therefore needs an approach from outside the sensors: the dummy must start outside the extended path zone (|b| >= margin or a >= senseRange) and outside the side sensor (more than 100 px from the nose or more than 80 degrees off heading), then close and make contact less than reactionDelay after first sensing. Contact made while aware is false pays at cruise speed; contact made while aware and uncommitted pays the slowed amount.",
      "17. (CR-005 change 6, new) A lunge never makes a car lose track of the dummy. Because a lunge's velocity x predict can place the predicted point behind the car (a_pred < 0) or beyond the zone, the predicted position is only an additional trigger: if the actual position is in the path zone, sees is true whatever the prediction says, so senseTime keeps running, aware stays true and the unsure target of case c holds through the lunge until contact.",
      "18. (CR-005 change 7, rewritten) Lock release uses geometry of the actual position only: a_actual = (dummy.x - car.x)*dirX + (dummy.y - car.y)*dirY. The lock is released when a_actual < -(length/2 + dummy.radius) (sedan: a_actual < -44), and not otherwise. A lunging dummy whose predicted position is behind a committed car does not release it. A dummy that stays beside, ahead of, or only just behind a committed car holds the lock until the car's whole body, plus the dummy's radius, has passed it, so a car never cuts back into its lane onto a dummy standing still.",
      "19. (CR-005 change 6, new) Unchanged by this rule set: the commit trigger (predicted offset below the commit line, in the path zone, aware, swerve feasible), the brake distances, the side sensor geometry (actual position), Vehicles.senses as a pure still-dummy geometry function, and every table value of AC-69.",
      "20. (CR-005 change 7, new) Swerve complete. When a car locks, it stores its target lateral centre T (the Testpad target for the chosen side, after the shoulder/barrier limit of road_limits 3; extra car field written only in Vehicles; a hatch flip stores the new side's T and so makes the swerve incomplete again). The swerve is complete on a step when |lateral centre - T| <= 2 px, evaluated from the car's position at the start of the step's speed decision (before that step's lateral move), every play step, with no random draw. A swerve that is delayed (car_to_car 9) or truncated (car_to_car 6) stays incomplete, and the car stays at unsure speed (rule 7d). A car that cannot reach T (infeasible, car_to_car 10) is case e and brakes as before.",
      "21. (CR-005 change 7, new) Order for a committing car: it commits at the commit line while slowed (it was already case c, because it must be aware); on the commit step the swerve is incomplete, so its target stays the unsure target and it does not speed up; it moves sideways at the Testpad lateral rate; only when the swerve is complete does the target jump to cruise and the car accelerates at accel. After that it ignores the dummy until the release of rule 6.",
      "22. (CR-005 change 7, new) Consequences. (a) A straight lunge down the lane meets a slow car (during the swerve: damage about 150 or less for a sedan) or passes beside the car (after the swerve: a flank contact at best, flank lunge at cruise 150). (b) A dummy standing still in or beside the lane is not hit by a car that can swerve: the car holds its offset until its rear edge is more than the dummy's radius past the dummy, then returns to its lane. (c) To hit a committed car at full speed the dummy must move into the line the car has chosen after the swerve is complete (the bait), and lunge into it. The delay and the slow swerve make this a timing skill, not a standing skill.",
      "23. (CR-005 change 7, new) Level pace: cars now spend longer at about 0.3 to 0.5 of cruise while swerving. Quotas, allocations and spawn intervals are not changed; level length is checked by AC-78.",
      "24. (CR-005 change 7, new) Unchanged by change 7: sensing, the aware timer, the commit line and trigger, brake distances, the bus (never locks), Vehicles.senses, the damage table, the infeasible-swerve braking, car-to-car rules, quotas, health, levels."
    ],
    "perception_drawing": [
      "1. (CR-005) The renderer draws, from state.cars only and subject to the existing perception overlay toggle: each car's two side sensors as one front-facing wedge (sector of radius sideRadius, half-angle sideHalfAngleDeg, centred on the nose centre N and the heading), drawn faint when idle and lit (filled, brighter) while car.wary is true.",
      "2. (CR-005, rewritten) The path zone is drawn as the rectangle actually tested: from the car's centre along the heading for max(unit's detect, perception.frontRange) (320 at base dials), with half-width margin (the unit's current dials), not a triangle. It is faint when idle and lit the moment car.sees is true (same step as sensing, before awareness). The renderer reads frontRange from state.params.perception.",
      "3. A distinct aware cue (not the zone colour): a small bright marker or ring over the car, with a pulse of about 0.25 s when aware turns from false to true (the renderer keeps its own previous-frame value, no sim state), then a steady small marker while aware is true. It is drawn whether the overlay is on or off.",
      "4. Brake lights are drawn from car.braking only, so they stay off during the reaction delay and come on only once the car slows (car_to_car 7). A committed car mid-swerve at unsure speed shows brake lights while its speed falls or is held below cruise.",
      "5. The sim holds no drawing state; Math.random is not used for these cues."
    ],
    "writeoff_animation": [
      "1. (CR-003) Mode writeoff lasts writeOff.duration = 1.1 s (allowed 0.9 to 1.4). With u = writeOff.t / writeOff.duration clamped to [0,1], the renderer in index.html draws everything below from state.writeOff only. It adds no field to the sim state and does not affect the simulation.",
      "2. Screen shake: offset of random direction, amplitude 14 * (1 - u)^2 px, redrawn every frame, so strong at the start and dying to 0 at the end.",
      "3. The dummy turns red: its colour is blended from normal to pure red (#e02020) by min(1, u / 0.25). It stays red until it is gone.",
      "4. The dummy shrinks and fades: scale and alpha = 1 - smoothstep(0.35, 0.85, u), where smoothstep(a,b,x) = s*s*(3-2s) with s clamped (x-a)/(b-a). It is fully gone (alpha 0, nothing drawn) from u = 0.85 to the end.",
      "5. Particles: at the first frame of the writeoff a burst of 18 particles (allowed 12 to 24) is created at (writeOff.x, writeOff.y), with random directions and speeds 60 to 220 px/s, size 2 to 4 px, red and white, each fading linearly over 0.6 to 1.0 s and slowed by drag. They are drawn and updated in the renderer with Math.random, in real frame time, and are cleared when the card or ending appears. A small burst: none may travel more than about 200 px.",
      "6. Cars stay drawn at their frozen positions and the HUD stays; the integrity bar shows 0. No card is drawn until the mode leaves writeoff. The effect is drawing only, so the sim stays deterministic."
    ],
    "road_limits": [
      "1. Levels 1 and 2 only. Each road has lanes (halfWidth), a hard shoulder of params shoulder px on each side, and a barrier at road centre +/- (halfWidth + shoulder). Level 1: y = 214 and y = 406. Level 2: horizontal y = 214 and 406, vertical x = 354 and 546.",
      "2. Cars may drive on the shoulder, which is any ground between the lane area edge and the barrier.",
      "3. No part of a car may cross a barrier. A car's rectangle lateral extent is kept inside the barrier limits of its travel axis on every step (horizontal travel: 214 <= top and bottom <= 406; vertical travel: 354 <= left and right <= 546), including inside the junction. Lateral displacement is truncated at the limit. Spawned cars start inside the limits.",
      "4. A car that cannot swerve clear of the dummy because of the barrier limits or other cars brakes (car_to_car 10) and shows brake lights once it slows. It never crosses the barrier.",
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
      "5. (CR-003, replaces CR-002 rule 5) Write-off: on the step in which a hit takes health to 0, at once: bodiesDestroyed++, levelWriteOffs++, score += writeOffBonus, dummy velocity set to 0, lunging, recovering and serviceOn cleared, mode = writeoff, state.writeOff = { t:0, duration: params.writeOff.duration, x, y } (solid_cars 2). state.ending and state.card stay null. The rest of that step (push-out, clamp) completes as normal. Then rule 5a to 5d.",
      "5a. In mode writeoff, each step adds dt to state.time and to writeOff.t and sets prevLunge and prevConfirm from the input. Nothing else changes: every car and the dummy keep their positions exactly, no spawn timer, stall timer, cooldown, service timer, car timer or senseTime advances, no draws are made, no impacts are judged, no level end is evaluated, and lunge and confirm inputs are ignored and not remembered (no buffering).",
      "5b. On the step where writeOff.t >= writeOff.duration: state.writeOff = null and the usual result is applied. If bodiesDestroyed >= certificationTarget: mode over, ending licensed, card set (certification_and_endings 3). Otherwise mode card with kind writeoff, the 'UNIT WRITTEN OFF' card. This applies to every write-off, including the one that wins the run. The card cannot be dismissed on that same step.",
      "5c. A fresh confirm (input.confirm true and prevConfirm false) in mode card dismisses it: dummy.health=maxHealth, dummy to (startX,startY), velocity 0, lunge and recovery cleared, mode play. Cars stay and play resumes. If a car overlaps the start position, solid_cars rule 3 pushes the dummy out on the next step. A confirm held since the writeoff mode is not fresh.",
      "5d. The level end is not evaluated in writeoff; after the card is dismissed it is evaluated at the start of the next play step as before.",
      "6. Level end is evaluated at the start of each play step: vehiclesSpawned >= allocation and cars empty. It is not evaluated during writeoff, card or over.",
      "7. Order at level end: (a) if some earlier level had levelWriteOffs >= quota, and levelLunged is false and levelContact is false for this level, ending noncompliant. (b) else if levelWriteOffs < quota, or level is 3, ending decommissioned. (c) else card kind level with title 'LEVEL COMPLETE' and next level. A fresh confirm starts level N+1 in play. levelLunged is set on any lunge start. levelContact is set on any impact, including a zero-damage impact.",
      "8. Level 3 finished without having reached the target is always decommissioned. Level 3 cannot end with a 'level complete' card."
    ],
    "body_health": [
      "1. (CR-004) dummy.maxHealth = 1600 (was 2300). A fresh body, and the body after every card, has health 1600.",
      "2. (CR-004) impact.maxPay = 1600 (was 2300), always equal to dummy.maxHealth. The cap on a single hit is one body's health and severity = damage / maxPay stays the share of a body.",
      "3. (CR-004) Nothing else changes: basePoints 100, zone shares, lungeMultiplier 5, momentumFactor, class masses, writeOffBonus 2500, writeOff.duration, service.delay 1.5 and service.fullTime 30 s, quotas, allocations, pools, spawn intervals, certificationTarget 11 and all code structure are as released. Every rule that reads maxHealth (reach in lunge rule 5, the integrity bar, service repair) reads it from params and needs no other edit.",
      "4. (CR-004) Service repair still restores a full body over fullTime seconds, so it is now 1600/30 = 53.3 points per second (was 76.7). Repair is proportionally slower in points per second; the time to full repair is unchanged.",
      "5. (CR-004) Worked values, no code change: a head-on lunge into a cruising sedan takes 500 = 31.25% of a body; a fresh body falls to a sedan nose lunge in 4 hits (500 x 3 = 1500, health 100 left) and to 16 walking nose hits; level 1's quota of 2 bodies is 3,200 points of damage, about 6.4 such lunges if no points were lost to overkill. Worst case single hit (bus nose lunge, 1174) is 73% of a body.",
      "6. (CR-004) The reach multiplier is 1 at full health exactly; at health h its value is 1 - (1 - wearFloor) * (1 - h/1600), so a given loss in points now wears reach faster than before. This is a consequence, not a retune."
    ],
    "certification_and_endings": [
      "1. Certification count is bodiesDestroyed across the run. Target is certificationTarget=11 (sum of quotas 10, total allocation 62). The write-off that reaches it is counted at once and wins with licensed, even mid-level and even if a quota is unmet; the ending (mode over, state.ending) appears when the write-off animation ends.",
      "2. Quota is checked only at level end. Meeting it does not end the level early.",
      "3. Endings set state.ending and mode over, and set state.card to {kind:ending, title, sub, line} using Testpad text. Where the Testpad text mentions 'all twelve units', replace it with 'the certification target of 11 bodies'. A Licensed ending reached by a write-off is set when the animation ends, not before.",
      "4. Confirm in over restarts the run at level 1 in mode attract with traffic and autostart options unchanged (lastImpact reset to null, writeOff null). The twelve-cell licence sheet is display only (fleet learning) and has no effect on endings."
    ],
    "qa_audit": [
      "1. (CR-003, rewrites CR-002 1) QA must not release the build until its report contains a damage table with numbers: for each of the six classes at cruise speed, the damage from Damage.assess for zones nose, frontCorner, flank, rearCorner, tail, walking and lunging, compared with the values from the formula and with the calibration of damage rule 8. Any mismatch over 1 point blocks release.",
      "2. (CR-003, rewrites CR-002 2) QA must report the Lawrence cases: cruising sedan walking / lunging, nose 100 / 500, flank 30 / 150, tail 5 / 25; cruising bus nose 235 / 1174; a diagonal lunge into a sedan flank scores exactly the flank-lunge value 150 +/- 1 whatever its angle or speed; a braking sedan at half speed pays half; a stopped car pays 0.",
      "3. QA must audit vehicle behaviour with numbers: for each class, cruise speed, time from rest to cruise (expected cruise/accel), time and distance from cruise to stop when held (expected cruise/decel), maximum observed speed change per step per cause, lane-line deviation with no dummy, and barrier clearances on levels 1 and 2.",
      "4. QA must report, without fixing, how often the level 3 stall breaker (car_to_car 13) fires: number of firings and of runs across at least 30 seeds, with the dummy idle and with a scripted wandering dummy, and the longest time the lowest-serial car was held. Fixing it is a separate change.",
      "5. QA must confirm by code review that Damage is pure, that damage arithmetic exists only there, and that car movement exists only in Vehicles (module boundary of vehicles_module 3).",
      "6. (CR-003) QA must report the write-off animation numbers: mode entered on the hit step, steps spent in writeoff at dt 1/60 and 1/120 (expected duration/dt within 1 step), that no car or dummy coordinate changes during it, and that confirm held or pressed during it does not dismiss the next card.",
      "7. (CR-004) QA must report, with numbers, the body-health figures: maxHealth and maxPay both 1600 in PARAMS and state; lunging hits to write off a fresh body from a cruising sedan nose (expected 4) and walking hits (expected 16); the service repair rate (expected 1600/30 = 53.3 points/s after the 1.5 s delay); and severity of the sedan nose lunge (expected 0.3125).",
      "8. (CR-005, rewritten for change 7) QA must report, with numbers: the Vehicles.senses table of AC-69 (point, expected, observed), including the 320 px edge; the number of steps from first sensing to aware at dt 1/60 and 1/120 (expected 9 and 18, +/-1) and that speed, lock and braking are unchanged during the delay; settled speeds for a sedan with a standing dummy in the side sensor (expected 82.8 +/-1) and in the path (expected min(69, 138*B) +/-1); the nose-lunge damage of a sedan in the three cases of AC-75 (standing in lane about 150, ambush 500, baited 500); the pillar sweep of AC-79 (lunge started from every nose gap 0 to 300 px in 20 px steps with the dummy standing in the lane since before the car came into range: maximum damage, expected at most 175, and the nose gap at which sees first turned true, expected about 289 for the sedan); a count over at least 30 seeds of cars that commit before being aware (expected 0); the lunge trace of AC-80; the lock-release check of AC-81; and (change 7) the straight-lunge sweep of AC-83 (nose gaps 60 to 160 px in 10 px steps for a lane-standing dummy: maximum damage, expected at most 175, with the car's speed, lock, swerve-complete flag and offset at contact for each gap), the swerve-completion trace of AC-82 (speed per step from commit to completion and after, expected at unsure speed until |offset - T| <= 2 px, then rising at accel) and the standing-dummy clip count of AC-84 (cars in contact per 14-car level 1 run with a dummy standing in the lane, over at least 30 seeds, expected 0 where the swerve is feasible)."
    ]
  },
  "unchanged_from_testpad": [
    "Canvas, hall, dummy size, vehicle sizes, lunge distance, six classes and twelve-unit fleet with detect/margin/predict/brakeLead dials.",
    "Fleet learning, file brief/adapt/close and closeCost. (CR-005: learning still raises only the unit's own detect, margin, predict and brakeLead; the commit line and brake distances still use detect; frontRange is not learned.)",
    "Commitment lock at commitFrac, hatch flip, brake-first classes, the bus that cannot swerve, caution and service repair (swerve now subject to car_to_car 9 and 10). CR-005: commitment, the flip, braking and caution now need the car to be aware of the dummy, and caution applies only to aware cars that are wary, unsure, or committed with the swerve not yet complete (perception_and_reaction 5, 7 and 8). CR-005 change 7: a committed car stays at unsure speed until its swerve is complete, and its lock is released only when the dummy's actual position is fully behind the car, behind its rear edge by more than the dummy's radius (perception_and_reaction 6, 7, 18, 20).",
    "A single impact per car.",
    "Report cards, behaviour signatures and report bank word for word (severity input is damage / maxPay), HUD, attract screen, perception overlay and toggle, restart button.",
    "Cooldown length, walk to run ramp shape, writeOff bonus and score formula, cars removed when out of hall. Body health is 1600 (CR-004; was 2300).",
    "Level layouts, quotas, allocations, pools, spawn intervals, certification target, carToCar constants and the stall breaker (CR-003, CR-004 and CR-005 do not touch them)."
  ],
  "acceptance_criteria": [
    {
      "id": "AC-01",
      "text": "sim.js loads in Node and as window.DummiesSim, exports PARAMS, Damage, Vehicles, createSim and step, and contains no DOM access, timers, Date, performance or Math.random.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-02",
      "text": "PARAMS deep-equals state.params and contains every schema field, including world, hall, 6 classes each with mass, 12 fleet entries, closeCost with 12 integers, 3 levels with shoulder fields, writeOff { duration }, perception { reactionDelay, sideRadius, sideHalfAngleDeg, warySpeedFactor, unsureSpeedFactor, frontRange }, impact { basePoints, refSpeed, refMass, maxPay, zoneNose, zoneFrontCorner, zoneFlank, zoneRearCorner, zoneTail, lungeMultiplier } and certificationTarget. PARAMS.impact has none of perMomentum, faceNose, faceCorner, faceFlank, faceTail, lungeBonus, maxClosing, yieldBase, yieldCurve, faceFront, faceSide, faceRear. Values: basePoints 100, refSpeed 138, refMass 1.0, maxPay 1600, shares 1/0.6/0.3/0.15/0.05, lungeMultiplier 5.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-03",
      "text": "Units: PARAMS dummy.walkSpeed=81, runSpeed=162 and class speeds are 138/120/192/108/144/156. A walking dummy held right for 1 s at full speed covers the same distance at dt=1/60 and 1/120 within 1 px.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-04",
      "text": "Determinism: two runs with the same seed, level and input script produce identical JSON state at every step, including across write-off animations and including the new car fields wary, aware and senseTime (and the locked target field of perception_and_reaction 20). Different seeds give different spawn sequences.",
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
      "text": "A write-off raises bodiesDestroyed and levelWriteOffs by one, adds writeOffBonus, and sets mode writeoff on that same step (state.writeOff non-null, ending and card null). After the animation the mode is card (or over/licensed at 11). Confirm then dismisses the card with health===maxHealth. A held confirm does not dismiss a card the same step it appears.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-20",
      "text": "Level end fires only when vehiclesSpawned>=allocation and cars is empty. Then noncompliant, decommissioned or the level card applies in that priority order, and confirm moves to the next level or restarts from over in attract.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-21",
      "text": "Certification target 11 is greater than the sum of quotas (10) and not more than the total allocation (62). A scripted state that reaches 11 write-offs counts the 11th at once, passes through mode writeoff, then yields ending licensed with mode over when the animation ends.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-22",
      "text": "Tail contact now pays: a sedan tail contact at cruise speed gives damage 5 (walking) or 25 (lunging), changes health and score by exactly that and is recorded in lastImpact. Each car has at most one impact. Reach multiplier at full health is exactly 1.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-23",
      "text": "index.html contains no http:// or https://, loads sim.js with a script tag, steps at fixed 1/60 with an accumulator, and runs when opened from disk with zero network requests. Fonts keep the Testpad names first with monospace fallbacks.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-24",
      "text": "index.html draws each level's roads, shows the level name and number, and keeps HUD, cards, attract screen, perception overlay and restart as Testpad. Any Math.random is only for shake, particles or floating numbers.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-25",
      "text": "Playtest: a level lasts about 1 to 2 minutes and a competent player can meet the quota on each level and reach certification (with body health 1600 a body takes about 4 lunges into sedan noses; quotas and allocations are unchanged).",
      "verify_by": "playtest"
    },
    {
      "id": "AC-26",
      "text": "Damage formula: PARAMS.impact values as in AC-02 and class masses sedan 1.0, van 1.5, sports 0.9, bus 3.0, wagon 1.2, hatch 0.8. In scripted impacts the health lost and the score gained both equal lastImpact.damage = min(1600, round(100 * zoneShare * lungeFactor * momentumFactor)) with lungeFactor 5 if lunging else 1, and momentumFactor = speed*mass/(138*1.0). The same zone at lunge directions of 8 different angles and at dummy speeds 800 and 1640 px/s gives the same damage (+/-0).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-27",
      "text": "Damage calibration, cruising cars, nose, walking / lunging (each +/-1): sedan 100 / 500, van 130 / 652, sports 125 / 626, bus 235 / 1174, wagon 125 / 626, hatch 90 / 452. A cruising sedan: frontCorner 60 / 300, flank 30 / 150, rearCorner 15 / 75, tail 5 / 25. A lunge into a sedan nose costs 31.25% of maxHealth and does not write off a fresh body; no single hit from a fresh body at cruise speed writes it off.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-28",
      "text": "Solid dummy: over many seeds and random inputs on levels 1 to 3 (and with the dummy placed overlapping a car), after every step the dummy circle reaches no more than 1 px into any car rectangle, and the dummy is inside the hall. A dummy overlapped by a car is moved along the shortest way out.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-29",
      "text": "The dummy never alters car motion by being solid: a car that has already had its impact, driving at a dummy parked in its path, keeps its trajectory and speed (apart from the dummy-reaction logic of sensing, awareness, slowing and swerve, disabled in the test by lock and detect settings), and pushes the dummy ahead of it.",
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
      "text": "Shoulder use: on level 1 with a sedan on lane y=284 and the dummy standing on the lane ahead, with the shoulder side free, the car (once aware) commits to a side whose rectangle stays inside the barrier limits and passes the dummy without impact (or with an impact only if the Testpad dials allow). Across a seeded batch at least one car's rectangle enters the shoulder band (y 214 to 246 or 374 to 406).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-33",
      "text": "Swerve infeasible: with the dummy placed so that clearing it would require crossing the barrier, or the neighbouring lane occupied by another car, the aware car does not lock, brakes (braking true once it slows), and stops short of the dummy or touches no barrier. The bus (swerve false) brakes as before.",
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
      "text": "Levels always end with the dummy in traffic (the failed check levels_always_end_with_dummy_in_traffic): on each of levels 1 to 3 over many seeds, with a scripted dummy that wanders in and across the roads and lunges at cars, every level reaches its end condition (all allocation spawned and no cars) within 150 s of simulated time plus 1.1 s per write-off animation, including after write-offs and card dismissals, with no frozen cars (no position change of any car for 10 s of play-mode time while the dummy is outside its detection zone) and no stall breaker needed on level 2 in normal runs (breaker count reported).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-41",
      "text": "Stall breaker: in a scripted state where the lowest-serial car L is held at speed 0 by a higher-serial car adjacent to it, with the dummy outside L's detection zone, after stallLimit (6 s) the blocking car is removed, vehiclesSpawned is unchanged, score and bodiesDestroyed are unchanged, and L moves again. The breaker never removes lower-serial cars and never fires while L moves.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-42",
      "text": "Damage module purity: Damage.contactFace and Damage.assess exist and are the only exports of Damage. Called twice with deep-frozen inputs they return equal results and throw nothing (no mutation); the Damage source contains no reference to state, Math.random, Date, performance or any outer mutable variable. No damage arithmetic (basePoints, zone shares, lungeMultiplier, refSpeed, refMass, maxPay) appears in sim.js outside Damage. No trace of perMomentum, lungeBonus or faceNose/faceCorner/faceFlank/faceTail remains anywhere in sim.js.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-43",
      "text": "contactFace table, sedan (length 62, width 34) centred at (0,0) heading (1,0): (31.01,0) nose; (31.01,17.01) frontCorner; (31.01,-20) frontCorner; (31,0) flank; (0,17.5) flank; (0,-17.5) flank; (-31,10) flank; (-31.01,0) tail; (-31.01,17) tail; (-31.01,20) rearCorner; (-31.01,-17.01) rearCorner. The same offsets rotated to headings (-1,0), (0,1), (0,-1) give the same zones.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-44",
      "text": "Damage table: for every class at cruise speed, every zone (nose, frontCorner, flank, rearCorner, tail) and both lunge states, Damage.assess equals min(1600, round(100 * share * (lunging?5:1) * speed*mass/138)), independent of the lunge direction and dummy velocity. Sedan values (+/-1) walking/lunging: nose 100/500; frontCorner 60/300; flank 30/150; rearCorner 15/75; tail 5/25. Output fields mass, faceFactor, lungeFactor, momentumFactor, damage are all returned; sedan momentumFactor is exactly 1 at 138.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-45",
      "text": "Damage ordering, swept over all six classes and speeds from 1 to cruise: for each class and speed damage is non-increasing nose > frontCorner > flank > rearCorner > tail (non-strict because of rounding); a lunging result is >= the walking result on the same zone (and within 1 of 5 times it unless capped); damage is non-decreasing in vehicleSpeed; vehicleSpeed 0 gives 0 and momentumFactor 0; a non-lunging dummy with any velocity gives lungeFactor exactly 1; lungeFactor with lunging is exactly 5 for any lunge direction or speed.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-46",
      "text": "Lawrence's flank case: a cruising sedan heading (1,0), the dummy lunging diagonally (direction (0.7071,+/-0.7071)), in the sedan's direction, against it, or across, into its flank at lunge speed 800 or 1640 px/s: zone flank, lungeFactor 5, damage 150 (+/-1), identical in every case, 30% of the nose lunge value (500); health lost equals damage; no write-off and no writeOffBonus added. Walking into the flank gives 30.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-47",
      "text": "Integrated impact: a full-health dummy lunging head-on into the nose of a cruising sedan loses 500 (+/-1) health and gains the same score; state.lastImpact is non-null and holds time, serial, id, cls, face 'nose', vehicleSpeed (equal to car.speed after the car's move), dirX, dirY, dummyVx, dummyVy, lunging true, mass, faceFactor, lungeFactor, momentumFactor, damage; re-running Damage.assess on the recorded contact gives the recorded mass, faceFactor, lungeFactor, momentumFactor and damage. lastImpact is null at createSim and after restart. (Test setup: the car is made cruising and unaware, e.g. by setting dummy placement outside every sensor before the lunge and testing a short lunge, or by overwriting the car's state; the check is on the arithmetic.)",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-48",
      "text": "No tunnelling: at dt = 1/60 and 1/120 a lunge step of up to 27 px that begins outside a car and ends deep inside its rectangle is scored by the zone seen before contact: a lunge from ahead of the nose scores nose; from beside the flank across to the far side scores flank; from behind the tail scores tail (25 on a cruising sedan) even though the end position is inside the front half; from ahead and to the side scores frontCorner; from behind and to the side scores rearCorner. The zone is identical at both dt values.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-49",
      "text": "Soft and zero hits: a sedan nose hit on a walking dummy at car speed 69 gives 50 (+/-1) and at car speed 138 gives 100 (+/-1); a lunging hit at speed 69 gives 250 (+/-1); at car speed 0 it gives 0, health and score unchanged, but lastImpact is recorded, the car's hit is true and levelContact is true. A braking car's damage equals the formula at its current car.speed.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-50",
      "text": "Vehicles module: Vehicles.step, Vehicles.cruiseSpeed and Vehicles.senses exist; cruiseSpeed(PARAMS, cls) equals the class speed for all six classes; a car is spawned at that speed; car.speed stays in [0, cruiseSpeed] with no NaN at every step across seeds on levels 1 to 3; per-step speed change does not exceed max(decel, accel)*dt + 1e-6 except on steps where truncation set the speed or the target was rescaled (counted and reported).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-51",
      "text": "Start and stop numbers: a car released from rest with a clear road reaches cruise speed in cruise/accel (+/-0.1 s, e.g. sedan 0.383 s); a car held by a stopped lower-serial car brakes from cruise at no more than decel, stops without touching (gap >= 0), and resumes at accel when the sweep test is clear, with no speed discontinuity larger than decel*dt other than a counted truncation.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-52",
      "text": "Vehicle paths: with the dummy outside every path zone and side sensor and nothing to yield to, every car on levels 1 and 2 stays on its lane line (|y - laneY| or |x - laneX| < 0.01) and on level 3 keeps its spawn lateral coordinate (+/-0.01); no car ever changes dirX, dirY or reverses (position along travel is non-decreasing); a car is removed only when wholly outside the hall (or by the breaker).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-53",
      "text": "Module boundary: in sim.js no assignment to car.x, car.y, car.speed, car.lock, car.braking, car.sees, car.wary, car.aware, car.senseTime, the car's locked target field or to the cars array (other than the level-start reset) exists outside Vehicles; Vehicles has no assignment to dummy.*, health, score, bodiesDestroyed, mode, writeOff or lastImpact; the only reduction of dummy.health in step is by lastImpact.damage.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-54",
      "text": "QA audit gate: the QA report contains the damage table with numbers per class, zone and lunge state checked against the formula and calibration; the Lawrence cases (sedan 100/500, 30/150, 5/25, bus nose 235/1174); vehicle path and start/stop numbers from AC-50 to AC-52; the barrier clearances; the write-off animation numbers of qa_audit 6; the body-health numbers of qa_audit 7; the perception numbers of qa_audit 8 (including the frontRange pillar sweep of AC-79, the lunge trace of AC-80, the lock-release check of AC-81, and the change 7 checks of AC-82 to AC-84); and the level 3 stall-breaker firing counts across at least 30 seeds, reported but not fixed. A release verdict is invalid if any of these are missing or any damage value mismatches by more than 1.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-55",
      "text": "Playtest: a hit on the side of a car costs a small amount (about a third of a head-on hit of the same kind, lunge or not); a diagonal front hit about 60%; rear corner 15%; tail 5%, small but not nothing; a lunge hits five times as hard as a touch; a bus hurts more than a sedan; a slow or braking car hurts less; a fresh body takes several lunges to write off.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-56",
      "text": "params.writeOff.duration exists and is within 0.9 to 1.4 (value 1.1).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-57",
      "text": "Write-off entry: on the step of the killing hit, bodiesDestroyed, levelWriteOffs and score (by damage + 2500) change, mode is 'writeoff', state.writeOff is { t:0, duration:1.1, x, y } with (x,y) the dummy position, state.card and state.ending are null, and dummy.lunging, recovering and velocity are cleared. This holds for any killing hit, including the one reaching certification, and mode is never 'card' or 'over' on that step.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-58",
      "text": "Write-off freeze: while mode is 'writeoff', for any input including movement, lunge and confirm, every car's x, y, speed, senseTime and the dummy's x, y are exactly unchanged, vehiclesSpawned, serialCounter and cars length are unchanged, no impact is recorded, no RNG draw is made (state.rng unchanged), while state.time and writeOff.t rise by dt each step.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-59",
      "text": "Write-off timing and result: at dt 1/60 and 1/120 the mode leaves 'writeoff' after duration seconds of steps (+/-1 step), never sooner. Then state.writeOff is null and mode is 'card' kind writeoff (title 'UNIT WRITTEN OFF'), or mode 'over' with ending 'licensed' if bodiesDestroyed >= 11. state.card and state.ending are set on that step and not earlier.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-60",
      "text": "Confirm during write-off: a confirm pressed, pressed and released, or held through the whole animation does not dismiss the following card or ending on the step it appears or later (a held key must be released and pressed again); a fresh press after the card appears dismisses it. A confirm pressed during the animation is not remembered.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-61",
      "text": "Write-off animation drawing (index.html, from state.writeOff): strong screen shake that decays to zero, dummy turns red, small particle burst at the body position, dummy shrinks or fades and is gone before the animation ends, cars drawn frozen, no card before the end. Math.random appears only in the renderer's shake, particle and floating-number code.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-62",
      "text": "Write-off drawing code check: index.html reads state.writeOff.t / duration for shake amplitude, red blend, fade and particle start, with no change to state; sim.js contains no particle or shake code; the sim state fields for the animation are only mode 'writeoff' and state.writeOff { t, duration, x, y }.",
      "verify_by": "code_review"
    },
    {
      "id": "AC-63",
      "text": "Playtest: the last hit on a body no longer jumps to the card; about a second of shake, red flash and particles plays first, including when the hit wins the run (the Licensed ending then appears).",
      "verify_by": "playtest"
    },
    {
      "id": "AC-64",
      "text": "Body health (CR-004): PARAMS.dummy.maxHealth === 1600 and PARAMS.impact.maxPay === 1600, they are equal, and state.dummy.health === 1600 at createSim, after every level start and after every card dismissal. The string 2300 appears nowhere in sim.js or in PARAMS.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-65",
      "text": "Body count (CR-004): from full health, successive lunging nose hits from a cruising sedan (500 each) leave health 1100, 600, 100 and the fourth hit writes off the body (health floored at 0, damage recorded 500, health lost 100). Sixteen walking nose hits (100 each) write off a fresh body on the 16th. Severity of the sedan nose lunge, damage / maxPay, is 0.3125 (+/-0.001). A single hit never exceeds 1600.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-66",
      "text": "Service and reach under 1600 (CR-004): a dummy at health 800 standing still after service.delay is repaired to 1600 in service.fullTime (30 s, +/-0.1 s), i.e. at 1600/30 points per second; reach at health 800 is 1 - 0.55 * 0.5 = 0.725 (+/-0.001) and at 1600 exactly 1. Nothing else in params differs from the previous release except maxHealth and maxPay (deep-compare of every other field, apart from the perception group added by CR-005).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-67",
      "text": "Playtest (CR-004): level 1's quota of two bodies is reachable in the allocation of 14 cars by a competent player without nearly every lunge being head-on and perfect; a fresh body is gone in about four good lunges. (With CR-005 the lunges need to be well timed; see AC-78.)",
      "verify_by": "playtest"
    },
    {
      "id": "AC-68",
      "text": "Perception params (CR-005): PARAMS.perception deep-equals { reactionDelay: 0.15, sideRadius: 100, sideHalfAngleDeg: 80, warySpeedFactor: 0.6, unsureSpeedFactor: 0.5, frontRange: 320 }, is also state.params.perception, and no other params value differs from the previous release (deep-compare of every other field). Change 7 adds no param.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-69",
      "text": "Vehicles.senses table, sedan (length 62, width 34, detect 212, margin 44, frontRange 320, so path range 320) at (0,0) heading (1,0), nose centre (31,0): (100,0) path; (60,0) path (not side, though within 100 px of the nose); (230,0) path (was null before frontRange); (319,0) path; (321,0) null; (319,43) path; (319,45) null (outside margin, far from nose); (100,50) side; (50,60) side; (45,-60) side; (31,90) null (angle 90 deg); (40,-60) null (angle 81.5 deg); (-20,30) null (behind the nose line); (31,101) null. Rotating the car and the points to headings (-1,0), (0,1) and (0,-1) gives the same answers. With the unit's detect raised above 320 (e.g. 400) the path range follows detect: (390,0) is path, (410,0) is null. senses reads nothing from state except the car's unit dials and params.perception, and does not mutate it. A dummy exactly on the 100 px radius or the 80 degree line counts as inside.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-70",
      "text": "Reaction delay: a standing dummy is placed in the path zone of an uncommitted sedan (and, in a second run, in a side sensor only). sees (or wary) is true on the first step; aware is false and the car's speed is exactly cruise, lock 0 and braking false until senseTime reaches 0.15 s; aware turns true on step 9 at dt 1/60 and step 18 at dt 1/120 (+/-1 step). If sensing is broken for a single step before then, senseTime resets to 0 and aware stays false; if it is restored the full 0.15 s is needed again. Cars reacting to another car (give way) or to a barrier react on the same step, with no delay.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-71",
      "text": "Speed factors (standing dummy, so F = 1), sedan, car aware, settled after the slew: dummy only in a side sensor gives speed 82.8 (+/-1) = 0.6 x 138, lock 0, no commit, no swerve; dummy in the path with the Testpad brake factor B above 0.5 gives 69 (+/-1) = 0.5 x 138 (this includes a dummy 213 to 320 px ahead of the car's centre, i.e. beyond the unit's detect, where B = 1); where B is lower the speed is 138 x B (+/-1), i.e. min(0.5, B) x 138. A running or lunging dummy (s = 1) multiplies those two by 0.6 (+/-0.02). Speed reaches the target at no more than decel and accel.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-72",
      "text": "Awareness gates everything: with the dummy teleported inside a sedan's commit line, the car does not lock, flip or slow until aware is true; then (swerve feasible) it locks on that step or the next and, while the swerve is incomplete, its target is the unsure target min(0.5, B) x cruise x F (not cruise); once |lateral centre - T| <= 2 px its target becomes cruise (caution not applied) even with the dummy running at it; (swerve infeasible) it does not lock and brakes as unsure; a locked car keeps its lock when aware or sees drops (dummy leaves the sensors) until the release rule of perception_and_reaction 6 (the dummy's actual position fully behind the car, behind its rear edge by more than the dummy radius; see AC-81); a hatchback flips only when aware (and a flip makes the swerve incomplete again); the bus never locks, stays at unsure speed (case c) in the path and at wary speed (case b) beside it; a wary-only car never locks. A dummy 213 to 320 px ahead does not set a lock (the commit line uses the unit's own detect). Over at least 30 seeds with random dummy inputs, no car locks or flips on a step where aware was false.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-73",
      "text": "Caution scope: with the dummy running or lunging, a car with aware false and lock 0 has target exactly cruise and its speed stays at cruise; a committed car with a feasible swerve that is complete (|lateral centre - T| <= 2 px) has target exactly cruise; aware cars that are wary, unsure, or committed with the swerve not yet complete have the caution factor F applied; a committed car that cannot swerve has the Testpad brake without F.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-74",
      "text": "Brake lights: braking is false on every step of the reaction delay and while the car cruises or accelerates; it is true on steps where speed falls or the car is held below its target for any reason, including a wary car settled at 0.6 cruise. In a scripted case a car that senses the dummy at t=0 shows no brake lights until after it is aware (>= 0.15 s) and its speed has actually started to fall.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-75",
      "text": "Outsmarting pays (sedan, SDN-01 at full cruise, full-health dummy, nose lunge, level 1 free of other cars). (a) Standing in the lane: the dummy stands still in the lane from before the car comes into range (so the car is aware and unsure well before the lunge), then lunges onto the nose from a nose gap of 80 to 160 px: lastImpact.damage is at most 175 and about 150 (+/-25) where the car is still at its unsure target, and below 40% of case (b); the car may have locked but its swerve is then incomplete (speed at most its unsure target plus slew). (b) Ambush: the dummy starts outside both sensors (outside the extended path zone and more than 100 px from the nose), is placed so that a lunge makes nose contact, and the lunge makes contact before senseTime reaches 0.15 (car unaware at cruise 138; setup may be constructed by overwriting dummy and car positions so first sensing occurs less than 0.15 s before contact): damage 500 (+/-1). (c) Baited: car.lock is non-zero with a feasible swerve, the swerve is complete (|lateral centre - T| <= 2 px), speed 138 at contact and the dummy has moved into the car's chosen line before the lunge: damage 500 (+/-1). A dummy 50 to 100 px beside the lane makes the car wary (speed 0.6 cruise) but not commit.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-76",
      "text": "Module boundary and cost (CR-005): all sensing, the reaction timer, awareness, swerve completion, lock release and speed-because-of-the-dummy arithmetic exists only in Vehicles (no use of sideRadius, sideHalfAngleDeg, reactionDelay, warySpeedFactor, unsureSpeedFactor or frontRange outside Vehicles, the PARAMS literal, state.params and the renderer's read of frontRange for drawing); the Damage module is unchanged and still pure; no new RNG draws are added (AC-04 still holds).",
      "verify_by": "code_review"
    },
    {
      "id": "AC-77",
      "text": "Perception drawing (CR-005): with the overlay on, each car shows its side-sensor wedge (faint, lit while car.wary) and its path zone as a rectangle of max(detect, frontRange) (320 at base dials) x 2*margin from the car's centre (lit the step car.sees turns true), no triangle; the drawn length reaches 320 px from the centre for a base-dial sedan, not 212; a distinct aware cue appears when car.aware turns true (visibly later than the zone lighting, by about 0.15 s) and the brake lights stay off until the car actually slows. The renderer keeps no sim state for this and reads only state.cars and state.params.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-78",
      "text": "Playtest (CR-005): standing front-on and lunging no longer gets the big hit from a sedan or a similar car, at any distance; the car visibly eases off well before the lunge can reach it, stays slow while it swerves, and does not speed back up as the dummy lunges at it; a baited car that has committed and finished its swerve, or an ambush that closes in on the car from the side or from outside the sensors before it reacts, still pays close to the full hit. A dummy that simply stands in the lane is not hit. The delay is not noticeable as lag but cars do not twitch the instant the dummy enters the zone. Levels remain finishable in about 1 to 2 minutes with the quotas unchanged.",
      "verify_by": "playtest"
    },
    {
      "id": "AC-79",
      "text": "Pillar sweep, longer frontal sensing (CR-005 change 5; the check that failed in run 20261008-021901). Sedan SDN-01 on level 1, base dials, full-health dummy. (a) A dummy standing still in the lane, car approaching from beyond range: sees first turns true when the car's centre is 320 (+/-5) px from the dummy, i.e. a nose gap of about 289, and aware 9 steps later at 1/60. (b) A nose-gap sweep from 0 to 300 px in 20 px steps, the dummy standing in the lane since before the car came into range, lunging straight at the car from each gap: every contact has damage <= 175 whatever the lock state; no contact has the car unaware (aware false) at contact. (c) Lunging on the first step in which sees is true makes no contact at all before the car is aware (the lunge plus the car's travel is less than the nose gap). (d) Learning does not shorten the range: with detect raised to 300 by learning the range is still 320; with detect 400 it is 400. (e) The commit line is unchanged: a sedan at base dials with a lane-standing dummy locks only when the dummy's predicted offset a is below 106 (detect 212 x commitFrac 0.5), not at 160; its Testpad brake distance still uses 212 x brakeLead.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-80",
      "text": "A lunge does not make a car lose track (CR-005 change 6; the check that failed in run 20261008-022848; lock condition relaxed by change 7). Sedan SDN-01 on level 1, base dials, full-health dummy standing still in the lane since before the car came into range, so the car is aware and has settled near 69 px/s. The dummy then lunges straight at it from nose gaps of 80, 120 and 160 px. On every step from the lunge start until contact: car.sees is true, car.aware is true while lock is 0, and car.speed never exceeds its value on the step before the lunge (+/-1) and trends toward about 41 px/s (0.3 x cruise); damage at contact is at most 175. (If the car locks during the lunge, its speed stays at the unsure target until the swerve is complete, which does not happen before contact in these cases.) Also in a unit case: with the dummy's actual position in the path zone and its predicted position (velocity x predict) behind the car's centre or outside the zone, sees is true; with the actual position outside the zone and the predicted position inside it, sees is also true; with the actual position outside and the predicted position only in the side wedge, sees is false (wary is decided by the actual position only).",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-81",
      "text": "Lock release (CR-005 change 7, rewrites the change 6 check). A sedan that has committed (lock non-zero) keeps its lock and its lateral offset on every step in which a_actual >= -(length/2 + dummy.radius) (sedan: a_actual >= -44), including when the dummy is just behind the car's centre or beside it, when the dummy lunges so that its predicted position is behind the car, when sees or aware turn false, and when the dummy is outside the unit's detect zone; the lock is cleared on the first step in which a_actual < -(length/2 + dummy.radius), after which the car returns to its lane as before and is again uncommitted. A lock is never cleared on a step where a_actual >= -(length/2 + radius). Verified over at least 30 seeds with random dummy inputs on levels 1 to 3, for all classes that can lock.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-82",
      "text": "Swerve completion (CR-005 change 7). Sedan SDN-01 on level 1 with the shoulder free, base dials, dummy standing still in the lane: from the commit step until |lateral centre - T| <= 2 px, car.lock is non-zero, the car's target speed is min(0.5, B) x 138 x F (F = 1 for a standing dummy, so at most 69 and about 41 if the dummy is moving fast) and its speed never rises above its value on the commit step (+/-1); on the first step with |lateral centre - T| <= 2 px the target becomes 138 and the speed then rises at no more than accel (360 px/s^2) with braking false once it accelerates. A delayed or truncated lateral move (car_to_car 9 or 6) keeps the car at unsure speed. A committed car that cannot reach T (infeasible) brakes as case e. The hatchback's flip makes the swerve incomplete again and the car slows again until the new T is reached.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-83",
      "text": "Straight-lunge sweep (CR-005 change 7; the check that passed all 41 in run 20261008-023803 but let 315 to 380 through). Sedan SDN-01 on level 1, base dials, full-health dummy standing still in the lane since before the car came into range, lunging straight down the lane (towards the car) from nose gaps of 60 to 160 px in 10 px steps. For every gap: either there is no contact (the car passed beside the dummy after its swerve) or the contact has damage <= 175. No contact pays more than 175 whether the car is locked or not. The same sweep with the dummy standing 0 to 20 px off the lane centre gives the same bound.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-84",
      "text": "Standing dummy is not clipped (CR-005 change 7; 9 of 14 cars on level 1 were hit in run 20261008-023803). Level 1, 14 cars, dummy standing still in a lane at x 450 (and in a second run on the shoulder at y 230 and at y 390), 30 seeds, where the swerve is feasible: zero cars contact the dummy (state.lastImpact stays null, health unchanged). A locked car holds its offset until its rear edge is more than dummy.radius (13 px) past the dummy, only then returning to its lane; the car's rectangle never overlaps the dummy's circle during the return (the dummy is standing still, so no push-out). Where the swerve is infeasible (barrier or occupied lane) the car brakes and stops short as AC-33.",
      "verify_by": "automated_check"
    },
    {
      "id": "AC-85",
      "text": "Playtest (CR-005 change 7): the best hit requires outsmarting the car. Standing in the lane, front-on, and lunging gets a small hit from a slowly swerving car, or nothing; a dummy that just stands still is never clipped as the car cuts back in; waiting for a car to commit and swing out, then moving into its new line and lunging gets the full nose hit on a fast car; an ambush from the side still works. This is the working pillar 'There is always a way to outsmart the vehicle' (wording not yet confirmed by Lawrence).",
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
      "text": "Certification is cumulative: target 11 bodies replaces the shift outcome. Licensed ends the run (after the write-off animation); the licence sheet is display only."
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
      "text": "CR-001 damage, as superseded by CR-003 and CR-004: the Testpad severity curve (impact.maxClosing, yieldBase, yieldCurve) stays removed. Per-class mass (sedan 1.0, van 1.5, sports 0.9, bus 3.0, wagon 1.2, hatch 0.8), maxPay (= maxHealth, now 1600 under CR-004), impact.contactEps 0.5 and impact.pushClearance 0.1 stay. The CR-001 closing-speed and CR-002 perMomentum formulas are both replaced by CR-003. Severity-driven features use damage / maxPay."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 damage formula: damage = min(maxPay, round(basePoints * zoneShare * lungeFactor * momentumFactor)). It replaces the whole CR-002 formula (perMomentum, faceNose/faceCorner/faceFlank/faceTail, lungeBonus and the direction-dependent lunge factor, and the figures 635, 1143 and 69). The lunge is now a flat x5 multiplier regardless of direction and speed; lunge direction no longer matters anywhere."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 schema change inside impact: perMomentum, faceNose, faceCorner, faceFlank, faceTail, lungeBonus are removed; basePoints 100, refSpeed 138, refMass 1.0, zoneNose 1, zoneFrontCorner 0.6, zoneFlank 0.3, zoneRearCorner 0.15, zoneTail 0.05, lungeMultiplier 5 are added; maxPay, contactEps and pushClearance stay. New group params.writeOff { duration: 1.1 }. Damage.contactFace now returns five zones (nose, frontCorner, flank, rearCorner, tail); Damage.assess now also returns momentumFactor, with faceFactor as the zone share."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 consequences, as Lawrence confirmed, now superseded in its figures by CR-004: with base 100 a body took many hits; at body health 1600 a lunge into a cruising sedan nose (500) is 31.25% of a body and a walking nose hit (100) is 6.25%. Rear contact and side contact pay (tail 5%, rear corner 15%, flank 30%). Severity (damage/maxPay) is the share of a body; not retuned. Quotas, allocations and the certification target are unchanged."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 zone judged from the dummy's pre-contact position relative to the car's pre-move centre (no tunnelling, unchanged from CR-002). If that position is inside the rectangle, the least-penetration exit face is used. Interpretation: the dummy's step-start position stands in for 'last moment outside the rectangle'."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 assumption: every contact consumes the car's single impact, including a contact with a stopped car (damage 0, recorded in lastImpact, levelContact set). A stopped car cannot hit the dummy later with a fresh impact after touching it. Each car pays once, as confirmed."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 write-off animation: a new mode 'writeoff' lasting writeOff.duration 1.1 s lies between the killing hit and the card or the Licensed ending. The write-off is counted at once; ending and card are set at its end. The whole simulation is frozen in it and confirm presses are ignored and not remembered. Drawing parameters (shake amplitude 14 px decaying as (1-u)^2, red blend over the first 25%, gone by 85%, 18 particles) are the Designer's choices within the request. state.writeOff becomes non-null in this mode, as the contract already states."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-003 assumption: if a killing hit and a second car's contact fall in the same step, only the first (lower serial) is judged; push-out and clamp still complete, and the frozen second car's hit remains false."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-002 modules still stand: sim.js exports Damage (pure contactFace and assess; state.lastImpact records each hit) and Vehicles (step, cruiseSpeed, and now senses; all spawning, speed, perception, swerve, braking, give-way, road limits, removal and stall breaker). Order inside Vehicles.step (spawn, cars in serial order, removal, breaker) is an assumption made for determinism. QA gate extended with the CR-003 numbers; the level 3 stall-breaker statistics are reported, not fixed."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 interpretation, still TO BE CONFIRMED BY LAWRENCE: his words say damage is 'inversely proportional to speed x mass'. This is read as DIRECTLY proportional (faster and heavier vehicles do more damage); CR-003 states momentumFactor as speed x mass over a reference, which confirms this reading."
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
      "text": "CR-001 addendum, TO BE CONFIRMED BY LAWRENCE: level 2 roads are one-way (horizontal left to right, vertical top to bottom, two lanes each, no oncoming traffic). This replaces the earlier two-way design, whose head-on freezes caused the failed check levels_always_end_with_dummy_in_traffic. Quota 3, allocation 20, pool 6 and spawn interval are unchanged; spawns pick between 2 approaches (left, top). Level 3 is unchanged."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-001 addendum: give-way rule refined so a car never yields to a lower-serial car that is behind it in its own lane band. Added the guarantee that the lowest-serial car is never held for good by another car (car_to_car 12)."
    },
    {
      "kind": "simplification_vs_gdd",
      "text": "CR-001 addendum: stall breaker (car_to_car 13, params.carToCar.stallLimit 6 s) is a backstop, not a GDD feature. If the lowest-serial car is held at speed 0 for 6 s while not seeing the dummy, the adjacent higher-serial blocking cars are removed without score or write-off. It is a safety net against freezes and is not expected to fire in normal play. CR-002 to CR-005 leave it unchanged; QA only reports on it."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-004 body health 1,600 (Lawrence, 8 October 2026): dummy.maxHealth 2300 -> 1600, and, as the assistant's addition, impact.maxPay 2300 -> 1600 so the single-hit cap stays one body's health and severity (damage / maxPay) stays the share of a body. Reason: with a literal base of 100 against a body of 2,300 the quotas were out of reach (level 1's two bodies needed about nine near-perfect head-on lunges from 14 cars). New body_health rules 1-6, qa_audit 7 and AC-64 to AC-67; AC-02, AC-25, AC-26, AC-27, AC-44, damage rules 6 and 8 and the unchanged_from_testpad body-health entry were rewritten for the 1600 figures (the 2300 quotes, the 21.7% figure, 0.51 largest severity and '5 lunging / 23 walking hits' became 1600, 31.25%, 0.73 and '4 lunging / 16 walking')."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-004 consequences, no other value touched: damage table (base 100, zone shares, x5, momentum factor), class masses, writeOffBonus 2500, service delay and fullTime 30 s, write-off animation, quotas 2/3/5, allocations 14/20/28, certification target 11, pools, spawn intervals and all code structure stay exactly as released. Repair is slower in points per second (53.3, was 76.7) with the same 30 s to full. The reach wear (1 - 0.55 * lost share) now falls faster per point lost. Points required for level 1's quota are 3,200 (about 6.4 sedan nose lunges); because health is reset after each body, overkill makes it 4 lunges per body in practice (8 for two bodies). The Designer made no retune of quotas, as requested."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 side sensors (Lawrence, 8 October 2026, starting values 100 px and 0.15 s as agreed): new params.perception { reactionDelay 0.15, sideRadius 100, sideHalfAngleDeg 80, warySpeedFactor 0.6, unsureSpeedFactor 0.5 } (frontRange 320 added by change 5 below). Each car gets a front-quarter wedge sensor measured from the centre of its nose, using the dummy's actual position and excluding the path zone. A dummy in it makes the car wary (slows to 0.6 cruise x caution), never swerve or commit. New car fields wary, aware and extra senseTime; new export Vehicles.senses (already in the brief's contract). New rules perception_and_reaction 1-13, perception_drawing 1-5, qa_audit 8, AC-68 to AC-78."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 reaction delay: a car reacts to the dummy only after sensing it (path zone or side sensor) continuously for 0.15 s; the timer resets when sensing stops. Slowing, braking, committing and the hatchback's flip need it. The delay never applies to give-way, barriers or solidity, and a commitment already made stays made. Interpretation: awareness is computed in Vehicles from the same step's sensing, so it can appear 1 step after the nominal 0.15 s at dt 1/60."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 speed because of the dummy replaces the Testpad braking and caution rules (as amended by change 7): not aware = cruise (the dummy's speed has no effect); wary = cruise x 0.6 x caution; unsure = min(cruise x 0.5, Testpad brake) x caution; committed with a feasible swerve not yet complete = as unsure; committed with a feasible swerve complete = cruise, ignores the dummy; committed but infeasible = Testpad brake without caution. The caution factor (up to 40% loss) applies to aware wary, unsure and mid-swerve cars only. The bus never commits, so it stays unsure. Assumption: the Testpad caution factor is 1 - caution.max x s with s the dummy's speed fraction (1 when lunging), and the 'about 150' figure for a standing-in-lane lunge corresponds to 0.5 x 0.6 = 0.3 x cruise reached after the decel slew."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 brake lights (car_to_car 7 rewritten): brake lights come on only when the car actually slows or is held below its undisturbed speed, not on sensing or during the reaction delay."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 drawing: side sensors drawn as a wedge, lit while the dummy is in them; the path zone is drawn as the rectangle that is tested (the Testpad's triangle is removed; the assistant's addition, as in the request); a distinct aware cue (pulse then steady marker, drawn even with the overlay off, an assumption) separates sensing from reacting. Interpretation: 'front-side-facing sensor' is one wedge of +/-80 degrees from the nose centre, which includes the area in front of the nose beyond the path zone's margin."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 change 5, longer frontal sensing (after run 20261008-021901 passed 40 of 41 checks and failed the pillar check): new param perception.frontRange = 320. The path zone used for sensing reaches max(detect, frontRange) from the car's centre, width unchanged (margin). Reason: at the old range (212, nose gap 168 at first sensing) a lunge on the instant of sensing landed before the car was aware and paid 500; at 320 (nose gap about 289) no lunge can reach the car before it is aware. Schema change: one field added inside perception. Rules rewritten: perception_and_reaction 1, 2, 6, 7, 10, 12, and new 14-16; perception_drawing 2; qa_audit 8; AC-02, AC-47 setup note, AC-68, AC-69, AC-71, AC-72, AC-75, AC-76, AC-77, AC-78 and AC-54; new AC-79. Value 320 is the Designer's choice: it exceeds the lunge reach plus the car's travel (about 205) with margin and stays under the 400 detect cap; Lawrence may tune it."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 change 5 scope and interpretations: only when the car first notices the dummy moves. The commit line (detect x commitFrac), the Testpad brake distances (detect x brakeLead, so the brake factor B is 1 beyond them and an unsure car beyond detect is at 0.5 cruise) and learning keep the unit's own detect. Because car.sees now means the longer zone, the stall-breaker timer (car_to_car 13) and the idle-dummy tests also use it; the breaker is therefore suspended more often while the dummy is near a lane, which is a consequence, not a retune. Cars slow earlier for a dummy standing in a lane, so level durations may lengthen slightly; quotas, allocations and spawn intervals are not changed (AC-78 checks 1 to 2 minutes)."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 change 6, a lunge must not make a car lose track of the dummy (after run 20261008-022848 failed the pillar check: a sedan slowed to 69 px/s sped back up to 138 px/s as the dummy lunged, because the lunge's predicted position landed behind the car, and it was hit for 500). sees is true if EITHER the actual OR the predicted position is in the path zone; prediction only adds. A committed car's lock is never released because of the predicted position, the dummy leaving the unit's detect zone or the sensors (the release condition itself is replaced by change 7 below). Side sensors (actual position only), Vehicles.senses (pure still-dummy geometry; the step calls it for the actual and the predicted point), the commit line, brake distances, damage, quotas, health and levels are unchanged. Rules rewritten: perception_and_reaction 1, 2, 5, 6, 9, 10, 11, 12; car_to_car 10 and 13 (wording); qa_audit 8; AC-54, AC-72, AC-78; new perception_and_reaction 17-19 and AC-80, AC-81."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 change 7, a car stays slow until its swerve is complete, and stays out until it is past (Lawrence, after run 20261008-023803 passed all 41 checks but the sweep showed lunges from 60 to 160 px paying 315 to 380 and 9 of 14 level 1 cars clipping a standing dummy). (1) Speed: a committed car with a feasible swerve stays at the unsure speed, min(0.5, B) x cruise x F, until |lateral centre - T| <= 2 px of its locked target lateral centre T; only then does it return to cruise and ignore the dummy (perception_and_reaction 7d and 7d2, 20, 21). A car that cannot complete its swerve brakes as before. The caution factor F now also applies to mid-swerve cars. (2) Release: the lock is released only when the dummy's actual position is behind the car's rear edge by more than the dummy's radius (a_actual < -(length/2 + radius)); this replaces change 6's 'behind the car's centre' (perception_and_reaction 6, 18); until then the car holds its offset. (3) Result: a straight lunge down the lane meets a slow car or passes beside it; the full hit needs baiting; a standing dummy is not clipped (perception_and_reaction 22). Interpretation and additions of the Designer: T is stored as one extra car field written only inside Vehicles; a hatchback flip resets completeness; the 2 px tolerance is evaluated at the start of the step's speed decision; level pace may slow a little (perception_and_reaction 23), with quotas, allocations and spawn intervals left unchanged. No param changes. Rules rewritten: car_to_car 10; vehicles_module 1, 5, 7; perception_and_reaction 6, 7, 8, 9, 12, 18; randomness 3; qa_audit 8; AC-04, AC-53, AC-54, AC-68, AC-72, AC-73, AC-75, AC-76, AC-78, AC-79, AC-80, AC-81; new perception_and_reaction 20-24, perception_drawing 4 (wording) and AC-82 to AC-85. Consequence: a car that has committed holds a wider, longer lane offset than in the Testpad, which can take it across a shoulder for longer."
    },
    {
      "kind": "change_vs_testpad",
      "text": "CR-005 not changed (out of scope, as requested): quotas, health, damage table, levels, fleet learning (the delay does not shrink as units learn), the chevron on detection, a cue for the hatchback's flip, the level 3 jam breaker. The working pillar wording 'There is always a way to outsmart the vehicle.' is proposed by the assistant and not yet confirmed by Lawrence; it is not part of the rules (AC-85 only refers to it)."
    }
  ]
}

# CONTRACT
## Fixed technical contract (so automated checks can run)

The Builder must output exactly two files.

### `sim.js` — all game rules, no DOM, no timers, no clock, no Math.random

Loadable in a browser (`window.DummiesSim`) and in Node (`module.exports`).
Exports:

- `PARAMS` — a literal copy of the Designer's specification `params`.
- `Damage` — the damage-assessment module (CR-002). Two pure functions with no
  state and no side effects; every hit in the game is scored by them and
  nowhere else:
  - `Damage.contactFace(car, px, py)` ->
    `"nose" | "frontCorner" | "flank" | "rearCorner" | "tail"`.
    `car` has `x, y, dirX, dirY, length, width`; `(px, py)` is the dummy's
    centre at the last moment it was outside the car's rectangle. With `a`
    the offset along the car's direction and `b` across it: nose if
    `a > length/2` and `|b| <= width/2`; frontCorner if `a > length/2` and
    `|b| > width/2`; flank if `|a| <= length/2`; tail if `a < -length/2` and
    `|b| <= width/2`; rearCorner if `a < -length/2` and `|b| > width/2`.
  - `Damage.assess(params, contact)` ->
    `{ mass, faceFactor, lungeFactor, momentumFactor, damage }`, where
    `contact` is `{ cls, vehicleSpeed, dirX, dirY, face, dummyVx, dummyVy,
    lunging }` and `faceFactor` is the zone share.
- `Vehicles` — the vehicle-behaviour module (CR-002). All spawning, speeds,
  perception, commitment and swerving, braking, give-way, road limits and
  removal live in it. It exposes at least `Vehicles.step(state, dt)` (advance
  every car one step) and `Vehicles.cruiseSpeed(params, cls)` (a class's
  undisturbed speed) and `Vehicles.senses(state, car, px, py)` -> `"path" |
  "side" | null` (pure geometry: which sensor of this car, with its unit's
  current dials, a dummy standing still at that point would be in). `step`
  calls it; nothing outside it moves a car.
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
state.mode              "attract" | "play" | "writeoff" | "card" | "over"
state.writeOff          null | { t, duration, x, y }   only in mode "writeoff":
                        seconds elapsed, total seconds, where the body was
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
  sees: boolean,        dummy is inside its path zone right now
  wary: boolean,        dummy is inside a side sensor right now (and not in
                        the path zone)
  aware: boolean,       it has sensed the dummy continuously for
                        perception.reactionDelay and may react
  lock: -1 | 0 | 1,     committed side, 0 = not committed
  braking: boolean,     true on every step in which it is slowing or held
  hit: boolean } ]      this car has already had its impact
state.lastImpact = null | {   how the most recent contact was scored (CR-002)
  time, serial, id, cls,
  face,                 "nose" | "frontCorner" | "flank" | "rearCorner" | "tail"
  vehicleSpeed, dirX, dirY, dummyVx, dummyVy, lunging,
  mass, faceFactor, lungeFactor, momentumFactor, damage }
```

Rules the checks rely on:

- With `autostart: true` the first step is already normal play.
- `mode "play"` is the only mode in which the dummy and cars move. In
  "writeoff" every car and the dummy keep their positions exactly.
- A body destroyed: `bodiesDestroyed` and `levelWriteOffs` each rise by one
  on that step and `mode` becomes "writeoff" with `state.writeOff` set. After
  `writeOff.duration` seconds of steps `mode` becomes "card" (or "over" with
  `ending: "licensed"` if the certification target is reached) and
  `state.writeOff` is null. `state.ending` and `state.card` are set when the
  animation ends, not before. A fresh `confirm` press dismisses the card and
  play resumes with `dummy.health === maxHealth`. A confirm pressed or held
  during "writeoff" does not dismiss the card that follows.
- An ending sets `state.ending` and `mode "over"`. A fresh `confirm` press in
  "over" restarts the run at level 1 in "attract".
- Level end is evaluated in "play" whenever
  `vehiclesSpawned >= allocation` and `cars` is empty.
- An impact needs the dummy's circle to touch the car's rectangle. Its zone
  comes from `Damage.contactFace` and its damage from `Damage.assess`; the
  result is stored in `state.lastImpact`, health falls by exactly
  `lastImpact.damage` and score rises by the same. Every zone pays, the tail
  included. Each car has at most one impact (`hit`). The impact is judged
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
impact:  { basePoints, refSpeed, refMass, maxPay, zoneNose, zoneFrontCorner,
           zoneFlank, zoneRearCorner, zoneTail, lungeMultiplier }
writeOff: { duration }
perception: { reactionDelay, sideRadius, sideHalfAngleDeg, warySpeedFactor,
              unsureSpeedFactor, frontRange }
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


# YOUR PREVIOUS sim.js
(function(){
"use strict";

/* ============================================================ PARAMS */
var PARAMS = {
  world:{width:900,height:620},
  hall:{x:40,y:40,w:820,h:540},
  dummy:{radius:13,walkSpeed:81,runSpeed:162,rampTime:1.0,lungeDistance:164,lungeDuration:0.3,lungeCooldown:0.55,recoveryTime:0.35,wearFloor:0.45,wearSpeedLoss:0,maxHealth:1600,writeOffBonus:2500,startX:150,startY:500},
  impact:{basePoints:100,refSpeed:138,refMass:1.0,maxPay:1600,zoneNose:1,zoneFrontCorner:0.6,zoneFlank:0.3,zoneRearCorner:0.15,zoneTail:0.05,lungeMultiplier:5,contactEps:0.5,pushClearance:0.1},
  writeOff:{duration:1.1},
  perception:{reactionDelay:0.15,sideRadius:100,sideHalfAngleDeg:80,warySpeedFactor:0.6,unsureSpeedFactor:0.5,frontRange:320},
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
function half(c){ return c.dirX ? [c.length/2, c.width/2] : [c.width/2, c.length/2]; }
function sgOf(c){ return c.dirX ? c.dirX : -c.dirY; }
function rectAt(c, x, y){ var h = half(c); return [x - h[0], x + h[0], y - h[1], y + h[1]]; }
function rdist(r, x, y){
  var cx = clamp(x, r[0], r[1]), cy = clamp(y, r[2], r[3]);
  return Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
}

/* ============================================================ DAMAGE MODULE (pure) */
var Damage = {
  contactFace: function(car, px, py){
    var rx = px - car.x, ry = py - car.y;
    var a = rx * car.dirX + ry * car.dirY, b = -rx * car.dirY + ry * car.dirX;
    var ha = car.length / 2, hb = car.width / 2;
    if(a > ha) return Math.abs(b) <= hb ? "nose" : "frontCorner";
    if(Math.abs(a) <= ha) return "flank";
    return Math.abs(b) <= hb ? "tail" : "rearCorner";
  },
  assess: function(params, contact){
    var I = params.impact, mass = params.classes[contact.cls].mass;
    var f = contact.face;
    var share = f === "nose" ? I.zoneNose : f === "frontCorner" ? I.zoneFrontCorner :
                f === "flank" ? I.zoneFlank : f === "rearCorner" ? I.zoneRearCorner : I.zoneTail;
    var lf = contact.lunging ? I.lungeMultiplier : 1;
    var vs = contact.vehicleSpeed;
    var mf = vs > 0 ? (vs * mass) / (I.refSpeed * I.refMass) : 0;
    var dmg = vs > 0 ? Math.min(I.maxPay, Math.round(I.basePoints * share * lf * mf)) : 0;
    return { mass:mass, faceFactor:share, lungeFactor:lf, momentumFactor:mf, damage:dmg };
  }
};

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
  d.recT = 0; d.ramp = 0; d.stillT = 0; d.lungedThisStep = false;
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
  s.mode = "attract"; s.ending = null; s.card = null; s.writeOff = null;
  s.score = 0; s.bodiesDestroyed = 0; s.serialCounter = 0; s.body = 1;
  s.fleet = newFleet(P); s.closedCount = 0;
  s.fx = []; s.fxSeq = 0; s.used = []; s.quotaMet = false;
  s.lastImpact = null;
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

/* ============================================================ FLEET LEARNING */
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
  if(R.hits === 0 && R.rear === 0) return "no_contact";
  if(R.rear >= 3 && R.front === 0) return "wrong_face";
  if(R.hits === 0) return "no_contact";
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
  var P = s.params, d = s.dummy;
  s.bodiesDestroyed++; s.levelWriteOffs++; s.score += P.dummy.writeOffBonus;
  var ui = s.run.lastUnit >= 0 ? s.run.lastUnit : 0;
  creditContact(s, s.fleet[ui]);
  d.vx = 0; d.vy = 0; d.lunging = false; d.recovering = false; d.serviceOn = false;
  s.mode = "writeoff";
  s.writeOff = { t:0, duration:P.writeOff.duration, x:d.x, y:d.y };
}
function writeOffEnd(s){
  var P = s.params;
  if(s.bodiesDestroyed >= P.certificationTarget){ finish(s, "licensed"); return; }
  var sig = signature(s);
  var ui = s.run.lastUnit >= 0 ? s.run.lastUnit : 0;
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

/* ============================================================ VEHICLES MODULE */
function isect(a, b){ return a[0] < b[1] && b[0] < a[1] && a[2] < b[3] && b[2] < a[3]; }
function opposite(a, b){ return a.dirX === -b.dirX && a.dirY === -b.dirY; }
function dials(s, u){
  var P = s.params, C = P.classes[u.cls], n = u.contacts, d = {}, k;
  for(k in C.base) d[k] = Math.min(C.cap[k], C.base[k] + C.step[k] * n);
  if(u.closed){
    d.margin = Math.max(d.margin, P.dummy.lungeDistance * 1.22);
    d.detect = Math.max(d.detect, 540);
  }
  return d;
}
function cruiseSpeed(P, cls){ return P.classes[cls].speed; }
function unitOf(s, c){
  var u = s.fleet[c.unit], i;
  if(!u) for(i = 0; i < s.fleet.length; i++) if(s.fleet[i].id === c.id) u = s.fleet[i];
  return u;
}
// pure geometry: which sensor of car c a dummy standing still at (px,py) is in
function senses(s, c, px, py){
  var D = dials(s, unitOf(s, c)), pr = s.params.perception;
  var rx = px - c.x, ry = py - c.y, along = rx*c.dirX + ry*c.dirY, lat = -rx*c.dirY + ry*c.dirX;
  if(along > 0 && along < Math.max(D.detect, pr.frontRange) && Math.abs(lat) < D.margin) return "path";
  var vx = px - (c.x + c.dirX * c.length / 2), vy = py - (c.y + c.dirY * c.length / 2);
  var m = Math.sqrt(vx*vx + vy*vy);
  if(m <= pr.sideRadius + 1e-9 && vx*c.dirX + vy*c.dirY >= m * Math.cos(pr.sideHalfAngleDeg * Math.PI / 180) - 1e-9) return "side";
  return null;
}
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
            speed:cruiseSpeed(P, f.cls), sees:false, wary:false, aware:false, senseTime:0, lock:0, braking:false, hit:false,
            lat:0, base:0, lockPush:0, lockT:0, flipped:false, life:0, vx:0, vy:0 };
  var e = ps.edge, h = cl.length / 2;
  if(e === 0){ c.x = H.x - h; c.y = ps.v; c.dirX = 1; }
  else if(e === 1){ c.x = H.x + H.w + h; c.y = ps.v; c.dirX = -1; }
  else if(e === 2){ c.x = ps.v; c.y = H.y - h; c.dirY = 1; }
  else { c.x = ps.v; c.y = H.y + H.h + h; c.dirY = -1; }
  c.base = sgOf(c) * (c.dirX ? c.y : c.x);
  return c;
}
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
function sweep(c, ext, pad){
  var h = half(c), r = [c.x - h[0], c.x + h[0], c.y - h[1], c.y + h[1]];
  if(c.dirX > 0) r[1] += ext; else if(c.dirX < 0) r[0] -= ext; else if(c.dirY > 0) r[3] += ext; else r[2] -= ext;
  if(c.dirX){ r[2] -= pad; r[3] += pad; } else { r[0] -= pad; r[1] += pad; }
  return r;
}
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
function stallStep(s, dt){
  var K = s.params.carToCar, cars = s.cars, L = cars[0];
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
  var P = s.params, d = s.dummy, cars = s.cars, K = P.carToCar, H = P.hall, pr = P.perception, i, j;
  cars.sort(function(a, b){ return a.serial - b.serial; });
  for(i = 0; i < cars.length; i++){
    var c = cars[i], u = s.fleet[c.unit], cl = P.classes[c.cls], D = dials(s, u);
    var cruise = cruiseSpeed(P, c.cls), sp0 = c.speed;
    c.life += dt;
    var sg = sgOf(c), lw0 = c.dirX ? c.y : c.x;
    if(c.base == null) c.base = sg * lw0;
    c.lat = sg * lw0 - c.base;
    var ppx = d.x + d.vx * D.predict, ppy = d.y + d.vy * D.predict;
    var rx = ppx - c.x, ry = ppy - c.y;
    var along = rx*c.dirX + ry*c.dirY, lat = -rx*c.dirY + ry*c.dirX;
    var aActual = (d.x - c.x)*c.dirX + (d.y - c.y)*c.dirY;
    var conflict = senses(s, c, d.x, d.y) === "path" || senses(s, c, ppx, ppy) === "path";
    c.sees = conflict;
    c.wary = !conflict && senses(s, c, d.x, d.y) === "side";
    if(c.sees || c.wary) c.senseTime = (c.senseTime || 0) + dt; else c.senseTime = 0;
    c.aware = c.senseTime >= pr.reactionDelay - 1e-9;
    if(c.lock && aActual < -(c.length / 2 + P.dummy.radius)){ c.lock = 0; c.flipped = false; c.lockT = 0; }
    var canSwerve = cl.swerve || u.closed, stuck = false, dl = 0;
    var complete = c.lock !== 0 && Math.abs(lw0 - c.lockT) <= 2;
    if(canSwerve){
      var cf = u.closed ? Math.min(0.92, cl.commitFrac * 1.7) : cl.commitFrac, commitAt = D.detect * cf;
      if(!c.lock && conflict && c.aware && along < commitAt){
        var pf = lat > 0 ? -1 : 1;
        if(swFeasible(s, c, pf, D.margin)) c.lock = pf;
        else if(swFeasible(s, c, -pf, D.margin)) c.lock = -pf;
        else stuck = true;
        if(c.lock){ c.lockPush = D.margin; c.lockT = sg * (c.base + c.lock * c.lockPush); complete = Math.abs(lw0 - c.lockT) <= 2; }
      }
      if(c.lock && cl.flip && c.aware && !u.closed && !c.flipped && along < commitAt * 0.52){
        if((lat > 0 && c.lock === 1) || (lat < 0 && c.lock === -1)){
          if(swFeasible(s, c, -c.lock, c.lockPush)){
            c.lock = -c.lock; c.flipped = true;
            c.lockT = sg * (c.base + c.lock * c.lockPush); complete = Math.abs(lw0 - c.lockT) <= 2;
          }
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
    // Testpad brake factor B
    var brake = 1;
    if(conflict){
      if((cl.brakeFirst || stuck) && along < D.detect * D.brakeLead) brake = cl.swerve ? 0.55 : 0.34;
      else if(canSwerve && !c.lock && along < D.detect * 0.22) brake = 0.66;
    }
    // speed because of the dummy
    var F = 1 - P.caution.max * Math.min(1, Math.sqrt(d.vx*d.vx + d.vy*d.vy) / P.dummy.runSpeed);
    var normal;
    if(c.lock){
      if(stuck) normal = cruise * brake;
      else if(complete) normal = cruise;
      else normal = Math.min(cruise * pr.unsureSpeedFactor, cruise * brake) * F;
    }
    else if(!c.aware) normal = cruise;
    else if(conflict) normal = Math.min(cruise * pr.unsureSpeedFactor, cruise * brake) * F;
    else normal = cruise * pr.warySpeedFactor * F;

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
    var tg = Math.min(yt, normal);
    if(c.speed > tg) c.speed = Math.max(tg, c.speed - K.decel * dt);
    else c.speed = Math.min(tg, c.speed + K.accel * dt);
    c.speed = clamp(c.speed, 0, cruise);
    var held = yt < Infinity && tg < normal - 1e-9;
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
    c.braking = c.speed < sp0 - 1e-9 || held || (c.speed < cruise - 1e-9 && tg <= c.speed + 1e-9);
  }
  s.cars = cars.filter(function(c){
    if(c.dirX > 0) return !(c.x - c.length/2 > H.x + H.w);
    if(c.dirX < 0) return !(c.x + c.length/2 < H.x);
    if(c.dirY > 0) return !(c.y - c.length/2 > H.y + H.h);
    return !(c.y + c.length/2 < H.y);
  });
  stallStep(s, dt);
}
var Vehicles = {
  step: function(s, dt){ spawnStep(s, dt); carsStep(s, dt); },
  cruiseSpeed: cruiseSpeed,
  senses: senses,
  dials: dials
};

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
  d.lungedThisStep = d.lunging;
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

/* ============================================================ IMPACTS */
// point just outside carBefore's rectangle along the least-penetration face if (px,py) is inside it
function outsidePoint(cb, px, py){
  var rx = px - cb.x, ry = py - cb.y;
  var a = rx*cb.dirX + ry*cb.dirY, b = -rx*cb.dirY + ry*cb.dirX;
  var ha = cb.length / 2, hb = cb.width / 2;
  if(Math.abs(a) > ha || Math.abs(b) > hb) return [px, py];
  var e = 0.01, pn = ha - a, pt = a + ha, pl = hb - b, pr = b + hb, m = Math.min(pn, pt, pl, pr);
  if(m === pn) a = ha + e; else if(m === pt) a = -ha - e; else if(m === pl) b = hb + e; else b = -hb - e;
  return [cb.x + a*cb.dirX - b*cb.dirY, cb.y + a*cb.dirY + b*cb.dirX];
}
function judge(s, c, snap){
  var P = s.params, d = s.dummy, R = s.run, I = P.impact;
  var rx = d.x - c.x, ry = d.y - c.y;
  var a = rx*c.dirX + ry*c.dirY, b = -rx*c.dirY + ry*c.dirX;
  var ha = c.length / 2, hb = c.width / 2;
  var ca = clamp(a, -ha, ha), cb2 = clamp(b, -hb, hb);
  if(Math.sqrt((a-ca)*(a-ca) + (b-cb2)*(b-cb2)) > P.dummy.radius + I.contactEps) return;
  var q = snap.c[c.serial] || [c.x, c.y];
  var before = { x:q[0], y:q[1], dirX:c.dirX, dirY:c.dirY, length:c.length, width:c.width };
  var o = outsidePoint(before, snap.px, snap.py);
  var face = Damage.contactFace(before, o[0], o[1]);
  var con = { cls:c.cls, vehicleSpeed:c.speed, dirX:c.dirX, dirY:c.dirY, face:face,
              dummyVx:d.vx, dummyVy:d.vy, lunging:!!(d.lunging || d.lungedThisStep) };
  var res = Damage.assess(P, con);
  s.lastImpact = { time:s.time, serial:c.serial, id:c.id, cls:c.cls, face:face, vehicleSpeed:con.vehicleSpeed,
                   dirX:c.dirX, dirY:c.dirY, dummyVx:con.dummyVx, dummyVy:con.dummyVy, lunging:con.lunging,
                   mass:res.mass, faceFactor:res.faceFactor, lungeFactor:res.lungeFactor,
                   momentumFactor:res.momentumFactor, damage:res.damage };
  c.hit = true; s.levelContact = true;
  var pay = res.damage, sev = pay / I.maxPay;
  if(pay <= 0) return;
  s.score += pay;
  d.health = Math.max(0, d.health - pay);
  R.hits++; R.sevSum += sev;
  if(face === "nose" || face === "frontCorner") R.front++;
  else if(face === "flank") R.side++;
  else R.rear++;
  R.distSum += Math.sqrt(rx*rx + ry*ry); R.distN++;
  if(b < 0) R.leftN++; else R.rightN++;
  R.lastUnit = c.unit;
  s.fx.push({ id:++s.fxSeq, k:"pay", t:0.95, x:d.x, y:d.y - 18, v:pay, big:face === "nose", sev:sev });
  if(d.health <= 0) writeOff(s);
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
  else if(s.mode === "writeoff"){
    var w = s.writeOff;
    if(!w) w = s.writeOff = { t:0, duration:s.params.writeOff.duration, x:s.dummy.x, y:s.dummy.y };
    w.t += dt;
    if(w.t >= w.duration){ s.writeOff = null; writeOffEnd(s); }
  }
  else if(s.mode === "play"){
    if(s.options.traffic && s.vehiclesSpawned >= s.allocation && s.cars.length === 0) levelEnd(s);
    else {
      var snap = { px:s.dummy.x, py:s.dummy.y, c:{} }, k;
      for(k = 0; k < s.cars.length; k++) snap.c[s.cars[k].serial] = [s.cars[k].x, s.cars[k].y];
      dummyStep(s, input, dt, fl);
      Vehicles.step(s, dt);
      for(k = 0; k < s.cars.length; k++){
        if(!s.cars[k].hit){ judge(s, s.cars[k], snap); if(s.mode !== "play") break; }
      }
      pushOut(s);
      if(s.mode === "writeoff" && s.writeOff){ s.writeOff.x = s.dummy.x; s.writeOff.y = s.dummy.y; }
    }
  }
  s.prevLunge = !!input.lunge; s.prevConfirm = !!input.confirm;
  return s;
}

var api = { createSim:createSim, step:step, PARAMS:PARAMS, Damage:Damage, Vehicles:Vehicles, dials:dials };
if(typeof module !== "undefined" && module.exports) module.exports = api;
if(typeof window !== "undefined") window.DummiesSim = api;
})();


# YOUR PREVIOUS index.html
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
var showPerception = true, shake = 0, lastFx = 0, freeze = 0, parts = [], woActive = false;
var awareMap = {}, nowT = 0;
function newSeed(){ return (Date.now() & 0x7fffffff) || 1; }
var S = SIM.createSim({ seed:newSeed() });

/* ============================================================ INPUT */
var keys = {}, pendConfirm = false, pendLunge = false, ptr = false;
addEventListener("keydown", function(e){
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key) >= 0) e.preventDefault();
  if(!e.repeat){ pendConfirm = true; if(e.key === " ") pendLunge = true; }
  keys[e.key.toLowerCase()] = true;
});
addEventListener("keyup", function(e){ keys[e.key.toLowerCase()] = false; });
function clearInput(){ keys = {}; ptr = false; }
addEventListener("blur", clearInput);
addEventListener("visibilitychange", clearInput);
cv.addEventListener("pointerdown", function(){ pendConfirm = true; pendLunge = true; ptr = true; });
addEventListener("pointerup", function(){ ptr = false; });
addEventListener("pointercancel", function(){ ptr = false; });
document.getElementById("restart").onclick = function(e){ e.target.blur(); S = SIM.createSim({ seed:newSeed() }); lastFx = 0; freeze = 0; parts = []; woActive = false; awareMap = {}; };
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
  var cf = pendConfirm, pl = pendLunge; pendConfirm = false; pendLunge = false;
  return { dx:dx, dy:dy, lunge:!!keys[" "] || ptr || pl, confirm:cf };
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
function updateAware(){
  var next = {}, i, c, o;
  for(i = 0; i < S.cars.length; i++){
    c = S.cars[i]; o = awareMap[c.serial];
    if(!o) o = { a:c.aware, t:-9 };
    if(c.aware && !o.a) o.t = nowT;
    o.a = c.aware; next[c.serial] = o;
  }
  awareMap = next;
}
function drawAware(c){
  if(!c.aware) return;
  var o = awareMap[c.serial], age = o ? nowT - o.t : 9, y;
  if(c.dirY) y = c.y - c.length / 2 - 12;
  else y = c.y - c.width / 2 - 14;
  ctx.save(); ctx.translate(c.x, y);
  if(age < 0.25){
    ctx.strokeStyle = "rgba(255,255,255," + (1 - age / 0.25) + ")"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 5 + age / 0.25 * 14, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "#ffffff"; ctx.strokeStyle = "#16181a"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(0, -6); ctx.lineTo(6, 0); ctx.lineTo(0, 6); ctx.lineTo(-6, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.restore();
}
function drawCar(c){
  var u = S.fleet[c.unit], cl = P.classes[c.cls], D = SIM.dials(S, u), ang = Math.atan2(c.dirY, c.dirX);
  ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang);
  if(showPerception && S.mode === "play"){
    var pc = S.params.perception, sr = pc.sideRadius, sa = pc.sideHalfAngleDeg * Math.PI / 180;
    var rng = Math.max(D.detect, pc.frontRange);
    ctx.fillStyle = c.wary ? "rgba(232,180,0,.28)" : "rgba(230,234,236,.05)";
    ctx.strokeStyle = c.wary ? "rgba(232,180,0,.8)" : "rgba(230,234,236,.18)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(c.length/2, 0); ctx.arc(c.length/2, 0, sr, -sa, sa); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = c.sees ? "rgba(242,106,27,.24)" : "rgba(230,234,236,.07)";
    ctx.fillRect(0, -D.margin, rng, D.margin * 2);
    if(c.sees){ ctx.strokeStyle = "rgba(242,106,27,.8)"; ctx.strokeRect(0, -D.margin, rng, D.margin * 2); }
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
  drawAware(c);
}
function smooth(a, b, x){ var t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t*t*(3 - 2*t); }
function drawDummy(){
  var d = S.dummy, r = P.dummy.radius, wo = S.mode === "writeoff" && S.writeOff, red = 0, al = 1, sc = 1;
  if(wo){
    var u0 = Math.max(0, Math.min(1, wo.t / wo.duration));
    red = Math.min(1, u0 / 0.25);
    al = sc = 1 - smooth(0.35, 0.85, u0);
    if(al <= 0) return;
  }
  ctx.save(); ctx.translate(d.x, d.y); ctx.scale(sc, sc); ctx.globalAlpha = al;
  if(d.serviceOn){
    ctx.strokeStyle = "rgba(31,122,87,.85)"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, r + 8 + Math.sin(S.time*8)*2, 0, 6.283); ctx.stroke();
  }
  ctx.fillStyle = "#16181a"; ctx.beginPath(); ctx.arc(0, 0, r + 2, 0, 6.283); ctx.fill();
  ctx.fillStyle = d.lunging ? "#f26a1b" : (d.recovering ? "#b89c3a" : "#e8b400");
  if(wo) ctx.fillStyle = "rgb(" + Math.round(232 + (224 - 232)*red) + "," + Math.round(180 + (32 - 180)*red) + "," + Math.round(32*red) + ")";
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
function spawnParts(x, y){
  parts = [];
  for(var i = 0; i < 18; i++){
    var a = Math.random() * 6.283, sp = 60 + Math.random() * 160, life = 0.6 + Math.random() * 0.4;
    parts.push({ x:x, y:y, vx:Math.cos(a)*sp, vy:Math.sin(a)*sp, sz:2 + Math.random()*2,
                 col:Math.random() < 0.5 ? "#e02020" : "#f4f4f4", life:life, max:life });
  }
}
function updateParts(dt){
  for(var i = parts.length - 1; i >= 0; i--){
    var p = parts[i], k = Math.pow(0.15, dt);
    p.life -= dt; p.vx *= k; p.vy *= k; p.x += p.vx*dt; p.y += p.vy*dt;
    if(p.life <= 0) parts.splice(i, 1);
  }
}
function drawParts(){
  for(var i = 0; i < parts.length; i++){
    var p = parts[i];
    ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.col;
    ctx.fillRect(p.x - p.sz/2, p.y - p.sz/2, p.sz, p.sz);
  }
  ctx.globalAlpha = 1;
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
  var dt = Math.min(0.1, (now - last) / 1000); last = now; nowT += dt;
  try{
    if(freeze > 0) freeze -= dt;
    else {
      acc += dt;
      var n = 0;
      while(acc >= STEP && n < 6){
        SIM.step(S, readInput(), STEP); acc -= STEP; n++;
        if(S.fxSeq < lastFx) lastFx = 0;
        var hit = false;
        for(var q = 0; q < S.fx.length; q++){
          var g = S.fx[q];
          if(g.id > lastFx){
            lastFx = g.id;
            if(g.k === "pay"){ shake = 6 + 14 * g.sev; freeze = g.big ? 0.09 : 0.05; hit = true; }
          }
        }
        if(hit) break;
      }
      if(acc > STEP) acc = 0;
    }
    var wo = S.mode === "writeoff" && S.writeOff, sx = 0, sy = 0;
    if(wo){
      if(!woActive){ woActive = true; spawnParts(wo.x, wo.y); freeze = 0; shake = 0; }
      var uu = Math.max(0, Math.min(1, wo.t / wo.duration)), amp = 14 * (1 - uu) * (1 - uu), ang = Math.random() * 6.283;
      sx = Math.cos(ang) * amp; sy = Math.sin(ang) * amp;
    } else {
      if(woActive){ woActive = false; parts = []; }
      if(shake > 0.3){ sx = (Math.random()-0.5)*shake; sy = (Math.random()-0.5)*shake; shake *= 0.86; }
    }
    updateParts(dt);
    updateAware();
    ctx.save();
    ctx.translate(sx, sy);
    drawHall(); drawRoads();
    for(var j = 0; j < S.cars.length; j++) drawCar(S.cars[j]);
    if(S.mode !== "attract") drawDummy();
    drawParts();
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


# BASELINE TESTPAD (reference)
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
