# DUMMIES — Agent Crew (ELVTR Assignment #3)

**Capstone game:** DUMMIES, by Lawrence Lek.

DUMMIES is a single-player, top-down 2D browser game for an exhibition. You are
a FARSIGHT crash-test dummy in Shenzhen Smart City, New Economic Zone, China,
20XX. *You are buying your freedom by destroying your body.* You bait
self-driving cars and lunge into their path.

## What the crew produces

A crew of three agents takes Lawrence's hand-directed prototype (the
"Testpad", `baseline/dummies-testpad.html`) and a one-page brief, and produces
a **playable three-level vertical slice of DUMMIES**, plus the specification
it was built from and an independent QA report. Cars are solid on every side, and impact damage
is closing speed times the vehicle's mass.

| Level | What it is |
|-------|------------|
| 1. ROAD | One road, all traffic left to right, nothing makes it stop. Lanes, a hard shoulder cars may swerve onto, and a barrier they cannot cross. The teaching level. |
| 2. CROSS JUNCTION | Two one-way roads crossing, no traffic lights, same shoulders and barriers. Cars give way to each other and never collide. |
| 3. CRASH TEST CENTRE | The open hall: vehicles from all four edges, the full twelve-unit fleet. |

Released output from the run included in this repository:

| File | Produced by | What it is |
|------|-------------|------------|
| `output/spec.json` | Rules Designer | All parameters in real-time units, the three level designs, the changed rules, 41 acceptance criteria, 17 listed differences from the GDD and the Testpad |
| `output/game/index.html`, `output/game/sim.js` | Game Builder | The playable browser game |
| `output/checks.json` | Orchestrator | Results of 31 executable checks run against the build |
| `output/qa_report.json` | QA / Repair Reviewer | Per-criterion verdicts, defects, release decision |

**To play:** download the repository (green **Code** button, **Download ZIP**),
unzip, and open `output/game/index.html` in a browser. No server is needed.
WASD or arrow keys move (hold to run), Space lunges, any key dismisses a card.
Cars avoid you: stand where a car can't see you, or bait it into committing to
a side, then lunge across its orange nose. Only the nose pays in full.

![Level 2, the cross junction](docs/screenshot_level2.png)

## Architecture

```mermaid
flowchart TD
    BRIEF[/"SLICE_BRIEF.md<br/>human-written: three levels, changes, technical contract"/]
    BASE[/"baseline/dummies-testpad.html<br/>Lawrence's prototype: scale, feel, systems"/]
    D["Agent 1: Rules Designer<br/>agents/rules_designer.md"]
    SPEC[/"spec.json<br/>params, level designs, changed rules, acceptance criteria"/]
    B["Agent 2: Game Builder<br/>agents/game_builder.md"]
    BUILD[/"sim.js + index.html"/]
    C[["Executable checks<br/>checks/run_checks.js - Node, not an agent"]]
    CR[/"checks.json"/]
    Q["Agent 3: QA / Repair Reviewer<br/>agents/qa_reviewer.md"]
    QA[/"qa.json<br/>verdict, criteria, defects, repair requests"/]
    G{"All checks pass<br/>AND verdict = release?"}
    L{"Fewer than 2<br/>repair cycles used?"}
    OUT[/"output/<br/>released game, spec, checks, QA report"/]
    FAIL["Stop: NOT RELEASED<br/>nothing copied to output/"]

    BRIEF --> D
    BASE -- "config section" --> D
    D --> SPEC
    SPEC --> B
    BASE -- "full source" --> B
    B --> BUILD
    BUILD --> C
    SPEC --> C
    C --> CR
    SPEC --> Q
    BUILD --> Q
    CR --> Q
    BASE -- "reference" --> Q
    Q --> QA --> G
    G -- yes --> OUT
    G -- no --> L
    L -- "yes: failing checks + repair requests + previous files" --> B
    L -- no --> FAIL
```

`crew.py` is the orchestrator. Each agent is a **separate headless Claude Code
session** (`claude -p`) with its own system prompt, no tools and no shared
conversation. The only thing an agent knows about the others is the artifact
the orchestrator hands it.

## The agents

| Agent | Input | Output | Why it is needed |
|-------|-------|--------|------------------|
| **Rules Designer** | `SLICE_BRIEF.md` and the Testpad's config section | `spec.json`: every number converted to real-time units, the three level layouts with quota, allocation and unit pool, the certification target, exact rules for everything that changes (eased lunge and recovery, car-to-car give-way, level flow, endings), acceptance criteria | The brief says *what* changes; nobody else decides *how much* or writes it down testably. Without it the Builder would invent levels and rules and there would be nothing to test against. Covers the GDD's Ladder & Economy and Lead Architect roles. |
| **Game Builder** | `spec.json`, the technical contract and the full Testpad source; on repair also its previous files, the failing checks and QA's repair requests | `sim.js` (all rules, deterministic, no browser needed) and `index.html` (drawing and input) | The only agent that writes game code. It ports the Testpad and may not change rules or numbers. Covers the GDD's Feel and Vehicle Behaviour roles. |
| **QA / Repair Reviewer** | `spec.json`, the Builder's files, the check results, the Testpad source as reference | `qa.json`: pass / fail / unverified per acceptance criterion with evidence, defects, missing Testpad systems, verdict, targeted repair requests | GDD rule: *no agent signs off its own work.* Checks only cover rules they can measure; QA reads the code for what they cannot see and turns failures into repair requests the Builder can act on. Its verdict is one half of the release gate. Covers the GDD's QA Harness role. |

How the outputs really pass between agents:

- The check `params_match_spec` fails unless the Builder's `PARAMS` are
  identical to the Designer's 250 numbers.
- The checks measure movement, lunge, levels and endings against the
  Designer's values, not against constants in the harness.
- A build is released only if every check passes **and** QA says `release`. If
  either says no, the Builder is called again with the reasons (two repair
  cycles at most). If it still fails, the run exits with code 1 and `output/`
  is left untouched.
- This loop has run for real. In run `20261006-215228`, build 1 failed the
  deadlock check, QA wrote three repair requests, the Builder changed the
  car-to-car logic, and build 2 passed every check and QA.
- After a release, the crew takes **change requests** against the released
  build (`python crew.py --change changes/CR-xxx.md`): the Designer revises
  the specification, the Builder patches its own files, and the same checks
  and QA gate the result. `changes/CR-001_...md` is Lawrence's first one.

## Connection to the GDD

| GDD rule | In this slice |
|----------|---------------|
| "Move in eight directions and press one button to lunge" | Yes; equal speed and equal lunge distance in all eight directions, checked |
| "Lunge travels in the facing direction without midair steering" | Yes; held direction, or facing direction if none is held |
| "A miss causes a recovery delay" | Yes, as an eased 0.35 s recovery, not a freeze (Move Refinements MR-01) |
| Vehicle classes with different avoidance | Six of the GDD's eight: sedan, van, sports, bus, wagon, hatchback (no SUV or police car) |
| Hatchback: "one signalled recommitment" | Yes |
| "The cars visibly learn" | Yes, as in the Testpad: each write-off briefs the unit that caused it |
| Detection wedge, commit line, chevron, brake lights | Yes. The chevron appears at commitment, as in the Testpad, not on detection as the GDD says |
| "Rear contact gives no damage, score" | Yes |
| "Impact value depends on class, speed and angle" | Damage = closing speed x class mass x face factor (front 1, side 0.25, rear 0). The bus is heaviest (CR-001) |
| Standing still triggers service | Yes, as in the Testpad: unlimited, not once per body |
| Certification by total write-offs, target above the sum of quotas | Yes: 11 bodies against quotas of 2, 3, 5 |
| Endings: Licensed, Non-compliant, Decommissioned | Yes |
| Reports voiced by vehicles, truthful to logged events | Yes: the Testpad's twelve behaviour signatures and authored lines |
| "Runtime uses seeded code, not language models" | Yes; same seed and inputs give the same run, checked |
| Environments | Three (road, cross junction, crash test centre) of the GDD's five |
| Price tiers, moods, shift analysis, art direction, audio | **Not included** |

The Designer's own list of differences is in `output/spec.json` under
`differences`.

## How to run the crew

Requirements:

- Python 3.9 or later (standard library only; nothing to `pip install`)
- Node.js 18 or later (runs the checks)
- [Claude Code](https://claude.com/claude-code) installed and signed in
  (`claude` on the PATH). The crew uses your existing Claude Code sign-in.
  **No API key is needed and none is stored in this repository.**

```
python crew.py
```

A full run makes at least three model calls and takes roughly ten to twenty
minutes; the Builder's port is the slow step. It writes every intermediate
artifact to `runs/<timestamp>/` and, if released, the final files to
`output/`. Optional: set `CREW_MODEL` to choose a model.

```
python crew.py --from-run runs/<timestamp>     # reuse that run's specification and first build
python crew.py --change changes/CR-001_solid_cars_momentum_barriers.md   # revise the released build for one change request
node checks/run_checks.js output/game output/spec.json     # re-run only the checks
node checks/bot_playthrough.js output/game 1               # automated player, seed 1
```

## Repository layout

```
SLICE_BRIEF.md            human-written input to the crew
baseline/                 the Testpad: Lawrence's prototype, the Builder's starting point
changes/                  change requests from Lawrence, applied by the crew to the released build
crew.py                   orchestrator
agents/                   one system prompt per agent
checks/run_checks.js      executable checks (the release gate, with QA)
checks/bot_playthrough.js automated player (informational)
checks/browser_playtest.js  scripted browser playtest (needs Playwright)
runs/                     complete record of every run, including the stopped ones
output/                   released game, spec, checks and QA report
archive/                  the first version: a one-road greybox built from scratch
DECISIONS.md              decision log
MOVE_REFINEMENTS.md       log of how movement should feel
docs/                     screenshots
```

## What was actually tested

**The crew runs** (6 October 2026). Nothing here was hidden or tidied:

| Run | What happened |
|-----|---------------|
| `20261006-185615` | First version (archived): one-road greybox from scratch. Three agent calls, released on the first build, 18 of 18 checks. |
| `20261006-214051` | Rebuild from the Testpad. Designer 137 s, Builder 391 s. Build 1 passed 26 of the then 27 checks. The one failure was a **bug in the check harness** (it objected when the dummy's health rose from service repair). Stopped by the operator during QA; the check was corrected. |
| `20261006-215043` | Specification and build 1 reused. 27 of 27 checks passed. QA said `repair` with one request, about fleet learning only being credited at a write-off, which is how the Testpad behaves. Meanwhile the automated player showed that **level 2 could deadlock** and never end. Stopped by the operator during the repair call; a new check for it was added, and QA and the repair pass were given the Testpad source. |
| `20261006-215228` | **First release of the three-level build.** Specification and build 1 reused. Build 1 failed the new deadlock check (27 of 28). QA said `repair` with three targeted requests. The Builder's repair took 174 s and changed only the car-to-car logic. Build 2 passed 28 of 28 checks and QA said `release` (22 criteria pass, 3 unverified, 4 minor defects). |
| `20261006-221109` | **Change request CR-001** (solid cars, momentum damage, shoulder and barrier). The Designer revised the specification in 2 minutes; then an **orchestrator bug** in the new change mode crashed the run before the Builder was called. Fixed. |
| `20261006-221429` | Specification reused. The Builder's change pass passed 29 of 31 checks. One failure was a **bug in the check harness** (the damage check ignored a car's sideways swerve speed; the build was right). The other was real: level 2 froze again, head-on, in the oncoming lane. QA said `repair`. Stopped by the operator, who fixed the check and added an addendum to CR-001 making level 2's roads one-way. |
| `20261006-222229` | **The current release.** The Designer revised the specification for the addendum (113 s), the Builder patched the previous build (135 s), 31 of 31 checks passed on the first build and QA said `release` (31 criteria pass, 10 unverified, 2 minor defects). |

**Executable checks** on the released build (run by Node against the generated
`sim.js`): 31 of 31 passed.

| Check | What it verifies | Result |
|-------|------------------|--------|
| `load_sim` | sim.js loads in Node and exports createSim, step, PARAMS | pass |
| `params_match_spec` | Builder's PARAMS equal the Designer's spec params (Designer output reached the Builder) | pass |
| `state_shape` | createSim returns the contract state shape, JSON-serialisable, for all three levels | pass |
| `attract_then_confirm` | Default start is the attract screen; a confirm press begins play | pass |
| `move_speed_equal_8_directions` | Distance covered in 1 s is equal in all eight directions (within 1%) and goes the way the input points | pass |
| `walk_frame_rate_independent` | Walking covers the same distance at 60 and 120 steps per second (within 2%) | pass |
| `run_speed_matches_spec` | After the ramp, speed equals spec runSpeed straight and diagonal (within 3%) | pass |
| `lunge_distance_equal_8_directions` | Lunge distance is equal in all eight directions (within 1%), equals spec lungeDistance (within 2%), and follows the facing direction when no direction is held | pass |
| `lunge_frame_rate_independent` | A lunge covers the same distance at 120 steps per second (within 2%) | pass |
| `lunge_eases_out` | The lunge is tweened: more than 60% of the distance is covered in the first half of its duration | pass |
| `no_midair_steering` | Direction input during a lunge does not change its path | pass |
| `held_lunge_does_not_chain` | Holding the lunge button and a direction for 3 s starts exactly one lunge | pass |
| `recovery_is_tweened` | After a lunge the dummy is 'recovering' for spec recoveryTime, can move during it, and starts slowly | pass |
| `deterministic_and_seeded` | Same seed and inputs give an identical state after 40 s; a different seed gives different traffic | pass |
| `level1_road_flows_left_to_right` | Level 1: every car travels left to right inside the road band, at its class speed, and never stalls (dummy out of the way) | pass |
| `car_speed_real_time` | An undisturbed car's reported speed equals its class speed and its real displacement per second, at 60 and 120 steps per second | pass |
| `level2_cross_no_collisions` | Level 2: traffic uses both one-way roads (left to right, top to bottom), cars never overlap inside the canvas, and traffic keeps flowing for 150 s (no deadlock) | pass |
| `level3_free_for_all` | Level 3: vehicles enter from at least three of the four edges, several classes appear, and cars never overlap inside the canvas | pass |
| `detection_commit_and_brake_flags` | A dummy standing in a lane is seen, the car commits to a side (lock) and the lock does not change afterwards | pass |
| `front_impact_pays_once` | Front contact reduces health and adds score, once per car | pass |
| `rear_contact_pays_nothing` | Rear contact changes neither health nor score | pass |
| `write_off_card_and_fresh_body` | At zero health: one write-off counted, a card appears, confirm gives a fresh body | pass |
| `level_progression` | Quota met and allocation spent: level 1 -> 2 -> 3 via a card and confirm | pass |
| `ending_decommissioned` | Allocation spent with the quota missed ends the run as 'decommissioned' | pass |
| `ending_licensed` | The write-off that reaches certificationTarget ends the run as 'licensed' at once | pass |
| `levels_always_end_with_dummy_in_traffic` | With a dummy standing on the road (at each road edge, so cars must swerve), every level still runs to its end, cars never overlap, never cross a barrier, and the dummy is never left inside a car | pass |
| `solid_cars_and_barriers_under_active_play` | With the dummy wandering across the roads and lunging for 90 s per level: cars never overlap each other, never cross a road barrier, and the dummy is never left inside a car | pass |
| `dummy_cannot_walk_through_a_car` | Cars are solid on every side: a dummy placed against a car's side, or walking into it, is pushed out and never ends up inside | pass |
| `damage_follows_momentum` | Damage from a front impact equals perMomentum x closing speed x class mass (within 15%), for a sedan and a van; the bus is the heaviest class | pass |
| `sim_is_pure` | sim.js uses no Math.random, timers, clock or DOM | pass |
| `html_static` | index.html has a canvas, loads sim.js, handles the keyboard, uses a fixed timestep and makes no network requests | pass |

**Automated player** (`checks/bot_playthrough.js`, informational). It only
ambushes: it stands outside a car's detection zone and lunges across its nose.

| Seed | Level 1 (quota 2 of 14 cars) | Level 2 (quota 3 of 20) | Level 3 (quota 5 of 28) | Result |
|------|------|------|------|------|
| 1 | 4 bodies | 1 body | not reached | Decommissioned in level 2, 5 of 11 bodies, 142 s |
| 2 | 2 bodies | 4 bodies | 3 bodies | Decommissioned in level 3, 9 of 11 bodies, 225 s |
| 3 | 5 bodies | 2 bodies | not reached | Decommissioned in level 2, 7 of 11 bodies, 146 s |

No run hung. Level 1 is passable by ambush alone on every seed; level 2 on
one seed in three. This player never earned the licence, so level 3 and the
certification target are untested as winnable.

**Scripted browser playtest** (`checks/browser_playtest.js`, headless
Chromium, real key events):

- The page loaded with no errors and made no network requests.
- It opened on the attract screen; a key press started level 1.
- Holding D for 1 s moved the dummy 125 px; holding W and D for 1 s moved it
  124 px diagonally.
- Holding W and Space for 1.5 s moved it 282 px: one lunge plus walking, not
  a chain of lunges.
- Each level was opened directly and drew its layout with traffic
  (`docs/screenshot_level1.png` to `screenshot_level3.png`).

**Not tested:**

- No person has played this build yet. Feel, difficulty and whether the cues
  read for a fifteen-year-old are unverified.
- Level tuning is the Designer agent's first guess. The automated player
  results above are the only evidence about whether the quotas are fair.
- Only run on Linux with Chromium. Not tried on other browsers, on a
  high-refresh display, or on exhibition hardware.

## Known limitations

- **Two of Lawrence's instructions were interpreted, and need his
  confirmation.** "Inversely proportional to speed x mass" was built as
  directly proportional. Level 2's roads were made one-way to stop head-on
  deadlocks; he did not ask for that.
- **A jam breaker can delete cars.** If the oldest car in the hall is stuck
  for 6 s without seeing the dummy, the Builder's code removes the cars
  blocking it. The checks did not show it firing, but it is a patch, not a
  traffic model.
- A car that cannot swerve because of the barrier or another car slows to
  0.55 of its speed; it does not stop.
- QA's two minor defects are open: a car already in the junction can stop in
  the path of an older car; a Space tap shorter than one frame can be missed.
- Not ported from the Testpad: the brief hit-stop pause on impact, and the
  traffic behind the attract screen.
- Agents are language models, so a re-run will produce a different
  specification and different code. The game itself is deterministic.
- The checks rely on a hand-written technical contract in the brief; the
  Designer cannot change the file layout or state shape.
- The first version of this assignment (a single-road greybox built from
  scratch, released first time with 18 of 18 checks) is kept in `archive/`
  and in `runs/20261006-185615/`.
