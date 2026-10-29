# Style Guide Agent runs

Each run folder holds every agent input and output, the lint findings, each version of the piece, a `trace.md` per case and per run, and the guide it read (`STYLE_GUIDE.snapshot.md`).

## The submission's runs

| Run | Guide | Job | Result |
|---|---|---|---|
| [`20261029-150755-examples`](20261029-150755-examples/trace.md) | v3 | The three adversarial examples | 3 of 3: 1 → 10, confirmed |
| [`20261029-150757-calibration`](20261029-150757-calibration/trace.md) | v3 | The evaluator alone: 22 shipped strings, 19 seeded violations | 41 of 41 hit; judgement-only 8 of 8. Shipped mean 9.7, seeded 6.6 |
| [`20261029-140054-d78-monument`](20261029-140054-d78-monument/trace.md) | v2 | Real content: Monument's 36 tile barks (D78), per tile then as one batch | 10 of 10 at 10/10, confirmed. Lines: `proposal_lines.json` |
| [`20261029-140105-audit`](20261029-140105-audit/trace.md) | v2 | Real content: Farsight's 42 shipped strings | 41 at 10/10 first time, confirmed. Parkland A1: 6 → 10 ("level") |

## Earlier runs (kept: they changed the guide)

| Run | Guide | Job | What it showed |
|---|---|---|---|
| [`20261029-135930-examples`](20261029-135930-examples/trace.md) | v2 | The three examples | Example 2's first 10/10 overturned by its confirmation: "beside the plaque" claims a position no event logs |
| [`20261029-135934-calibration`](20261029-135934-calibration/trace.md) | v2 | Calibration | 41 of 41. Its rules named "boss", "hero", "champion" and called "the dummy" off-voice; v3 fixed them (decision 546) |
| [`20261029-135017-examples`](20261029-135017-examples/trace.md) | v1 | The three examples | 3 of 3 at 10/10 |
| [`20261029-135021-calibration`](20261029-135021-calibration/trace.md) | v1 | Calibration | 41 of 41 |
| [`20261029-135110-d78-monument`](20261029-135110-d78-monument/trace.md) | v1 | Monument tile barks | Its batch pass found three truth slips the 10/10 tile passes missed, and six Budget lines closing on "Kind regards" → T11 widened; confirmations added (decision 544) |
| [`20261029-135237-audit`](20261029-135237-audit/trace.md) | v1 | The audit | F7 flagged 9 of 27 shipped tales for not ending on an imperative, and the refiner rewrote canon to fit → F7 rewritten (decision 544) |
