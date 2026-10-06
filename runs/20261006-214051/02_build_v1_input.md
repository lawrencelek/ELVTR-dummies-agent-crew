Port the baseline Testpad to the contract and implement this specification.

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

# CONTRACT
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
  Each car has at most one impact (`hit`).
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
impact:  { maxClosing, yieldBase, yieldCurve, faceFront, faceSide, faceRear }
caution: { max }
service: { delay, fullTime }
classes: { sedan: { label, width, length, speed, swerve, commitFrac, flip,
                    brakeFirst, base: {detect, margin, predict, brakeLead},
                    step: {...}, cap: {...} },
           van, sports, bus, wagon, hatch }
fleet:   [ { id, cls } x 12 ]
closeCost: [ 12 integers ]
levels:  [ { id: 1, kind: "road",  name, quota, allocation, pool,
             spawnInterval: { min, max },
             road:  { y, halfWidth, laneYs: [ ... ] } },
           { id: 2, kind: "cross", name, quota, allocation, pool,
             spawnInterval: { min, max },
             roadH: { y, halfWidth }, roadV: { x, halfWidth } },
           { id: 3, kind: "hall",  name, quota, allocation, pool,
             spawnInterval: { min, max } } ]
certificationTarget: integer
```

Units: pixels, seconds, pixels per second. Testpad per-frame speeds
(`walk`, `run`, class `sp`, `maxClosing`) are multiplied by 60. Testpad
`predict` is already seconds of look-ahead and is unchanged. Distances
(`detect`, `margin`, sizes, `lungeDist`) and times are unchanged.


# BASELINE TESTPAD (complete source)
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
