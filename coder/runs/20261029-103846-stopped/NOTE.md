# Stopped run

Stopped by hand after round 1 of the analyst.

- The analyst made Chassis 0 a requirement. Edit 92 §7 rules it out ("Not drawn"), but that chunk was 5th in retrieval and k was 3 (`analyst_1_input.md` has no "Not drawn"). Fix: k = 5, and the analyst prompt excludes what the GDD rules out.
- `proto.droneSpeed` and `proto.droneLiftSeconds` are read by the code but not in the registry file; the validator refused them (`analyst_1_issues.json`). Fix: IDs the game defines count.
- Requirements cited `row 533` as a source; the validator refused it. Fix: decision rows count as sources.

Kept as evidence. The requirements in use come from run `20261029-104810`.
