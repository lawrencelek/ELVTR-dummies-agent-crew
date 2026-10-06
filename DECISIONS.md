# DUMMIES — Decision Log

Status values: **user-confirmed** (Lawrence decided), **proposed** (assistant
recommendation, not yet confirmed by Lawrence), **tested** (verified by a run
or check), **superseded**.

All entries dated 6 October 2026 unless stated. Times are not recorded.

| # | Decision | Status | Reason | Trade-off | Evidence / result |
|---|----------|--------|--------|-----------|-------------------|
| 1 | Pure top-down projection for the first prototype | user-confirmed | Movement and lunge distances stay equal in every direction; signals read cleanly | Loses the facades and depth of the oblique / isometric references | Nine perspective references were compared before choosing |
| 2 | Greybox first: flat shapes, no facades, no decorative assets | user-confirmed | Prove the bait-and-lunge timing before art | Does not yet show the Sinofuturist art direction (GDD pillar 5) | — |
| 3 | Eight-direction movement with equal total speed; equal lunge distance in every direction | user-confirmed | Fair, predictable timing for an exhibition player | Diagonal input needs normalising in code | Automated checks `move_speed_equal_8_directions` and `lunge_distance_equal_8_directions` (see README, "What was tested") |
| 4 | Show detection wedge, route chevron, commitment ring and brake lights | user-confirmed | GDD pillar 4: the signals make timing readable | More to draw in a greybox | Logic covered by check `detect_commit_brake_and_avoid`; on-screen readability not yet playtested by a person |
| 5 | Micro-slice: one road, one sedan model, one dummy | proposed (handoff recommendation; built as the Assignment 3 scope) | Smallest slice that contains the core loop: read, bait, lunge, hit or miss | Leaves out seven vehicle classes, learning, moods, service, quotas, certification, endings, narrative, audio | Scope written in `SLICE_BRIEF.md` |
| 6 | Three-agent crew: Rules Designer, Game Builder, QA / Repair Reviewer | proposed (handoff recommendation; implemented) | Assignment needs three or more coordinated agents; the GDD's fourteen roles are far too large for this slice | Each agent covers several GDD roles (see README) | Run log in `runs/` |
| 7 | Raw orchestration in Python calling headless Claude Code, not CrewAI | proposed (assistant choice during the build) | Assignment allows raw orchestration; needs no API key, only a signed-in Claude Code; fewer installs | Anyone re-running needs Claude Code and Node installed; no framework features | `crew.py` |
| 8 | Agents get no tools; the orchestrator writes files and runs checks | proposed (assistant choice during the build) | Keeps each agent's input and output explicit and saved; the Builder cannot mark its own work | Builder cannot run its own code before handing over, so the repair loop does that job | Intermediate artifacts in `runs/<timestamp>/` |
| 9 | Release gate: all executable checks pass **and** QA verdict is "release"; at most two repair cycles | proposed (handoff recommendation; implemented) | GDD rule: no agent signs off its own work; QA must not be ornamental | A run can end "not released" | `summary.json` in each run |
| 10 | Fixed technical contract (file names, `createSim` / `step`, state shape) written by hand in the brief | proposed (assistant choice during the build) | Automated checks need a stable interface that does not depend on what the Designer invents | Less freedom for the Designer agent | `SLICE_BRIEF.md` |
| 11 | Simplified greybox damage: base + speed term, times a lunge multiplier | proposed | Enough to make hits, score and destruction work | GDD damage depends on class, speed and angle (head-on, diagonal, glancing), with overkill and write-off bonuses; none of that is here | Labelled as a simplification in the generated spec |
| 12 | Work in actions of three minutes or less, one at a time | user-confirmed | Long task lists and setup detours derail the work | Slower hand-offs for multi-step setup | — |
| 13 | Submit a GitHub repository link through Google Classroom; teacher needs access | user-confirmed | Course requirement | Private repository needs the teacher's GitHub username | Pending |
| 14 | Use a Claude Project and Claude Code for this assignment | user-confirmed | Keeps the GDD, decisions and code together | — | This repository was built in a Claude Code session |
| 15 | Defer Pixel Agents, the style-guide website, finished art and audio | user-confirmed | Protect the deadline | Submission is visually plain | — |
