# Style Guide Agent runs

Each run folder holds every agent input and output, the lint findings, each version of the piece, a `trace.md` per case and per run, and the guide it read (`STYLE_GUIDE.snapshot.md`).

## Guide v2 (the submission)

| Run | Job | Result |
|---|---|---|
| [`20261029-135930-examples`](20261029-135930-examples/trace.md) | The three adversarial examples | 3 of 3: 1 → 10, confirmed. Example 2's first 10 was overturned by its confirmation (a truth slip), then fixed |
| [`20261029-135934-calibration`](20261029-135934-calibration/trace.md) | The evaluator alone: 22 shipped strings, 19 seeded violations | 41 of 41 hit. Shipped mean 9.6, seeded 6.9 |
| [`20261029-140054-d78-monument`](20261029-140054-d78-monument/trace.md) | Real content: Monument's 36 tile barks (D78), per tile then as one batch | 10 of 10 at 10/10, confirmed. Lines: `proposal_lines.json` |
| [`20261029-140105-audit`](20261029-140105-audit/trace.md) | Real content: Farsight's 42 shipped strings | 41 at 10/10 first time, confirmed. Parkland A1: 6 → 10 ("level") |

## Guide v1 (kept: they changed the guide)

| Run | Job | What it changed |
|---|---|---|
| [`20261029-135017-examples`](20261029-135017-examples/trace.md) | The three examples | — (3 of 3 at 10/10) |
| [`20261029-135021-calibration`](20261029-135021-calibration/trace.md) | Calibration | — (41 of 41) |
| [`20261029-135110-d78-monument`](20261029-135110-d78-monument/trace.md) | Monument tile barks | Its batch pass found three truth slips the 10/10 tile passes missed, and six Budget lines closing on "Kind regards." → T11 widened; a 10/10 now needs a fresh confirmation (decision 544) |
| [`20261029-135237-audit`](20261029-135237-audit/trace.md) | The audit | F7 flagged 9 of 27 shipped tales for not ending on an imperative, and the refiner rewrote canon to fit → F7 rewritten (decision 544) |
