# Stopped run

Stopped by hand during round 3 of the analyst. Calibration found two harness defects, fixed before the next run:

- `G.shot(name)` without `.png` threw in every page probe (`analyst_2_issues.json`).
- `R-ENDING-SCREEN` tested `run.ending === 'Certified'`; `run.ending` is an object. The defect above masked it, so calibration now reports every issue per requirement.

Kept as evidence. The requirements in use come from run `20261029-104810`.
