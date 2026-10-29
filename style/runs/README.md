# Style Guide Agent runs

Each run folder holds every agent input and output, the lint findings, each version of the piece, a `trace.md` per case and per run, and the guide it read (`STYLE_GUIDE.snapshot.md`).

## Style Guide V2 (GDD Edit 95, Prototype 8)

| Run | Guide | Job | Result |
|---|---|---|---|
| [`20261030-000812-examples-v2`](20261030-000812-examples-v2/trace.md) | V2.8 | The three adversarial examples on V2 (`cases/examples_v2.json`): Tone (a Monument A3 tale as a hyped fitness coach), Vocabulary and lore (the intro line with Farsight, a player, lives, a respawn, levels and Chongqing), Formatting and length (the jump goal as a four-step checklist with figures). Example 1's facts in other words than either shipped tale; slot facts give the shipped goal | 3 of 3 at 10/10, confirmed (1 → 10, 1 → 8 → 10, 1 → 10). 17 calls, $2.19 |
| [`20261029-235500-examples-v2`](20261029-235500-examples-v2/trace.md) | V2.7 | The same, before the review fixes. Example 1's facts echoed the shipped tale; its After came out close to it. Tile facts gave 7.13's brief | 3 of 3 at 10/10, confirmed (3 → 10, 1 → 10, 1 → 10). 15 calls, $1.44 |
| [`20261029-234951-examples-v2`](20261029-234951-examples-v2/trace.md) | V2.7 | The same, first run. Its jump slot named `story.json`, V1's file; rerun after the fix | 3 of 3 at 10/10, confirmed. 15 calls, $1.97 |
| [`20261029-181530-v82`](20261029-181530-v82/trace.md) | V2.5 → V2.6 | Prototype 8.2's text: 27 tales redrafted by the generator (15 to 35 words), the story batch, Arcade's grade texts (n34, n35), the batch on V2.6 | 30 of 30 at 10/10, confirmed. 155 calls, $18.64. Tales 19–35 words, mean 28.5 |
| [`20261029-205717-v83`](20261029-205717-v83/trace.md) | V2.7 | Prototype 8.3's text: 26 tales cut to 15 to 20 words, 10 briefs as goals, n36 and n37; the story batch with three of the user's four lines locked (A1's tale, n03, n34; the `any` goal is not in the batch); the intro line (n36) by hand | 39 of 39 at 10/10, confirmed. 172 calls, $22.69. Tales 15–20 words, mean 19.0 |
| [`20261029-172610-v81`](20261029-172610-v81/trace.md) | V2.3 → V2.4 | Prototype 8.1's text: 7.13's 27 tales on V2.3 (35 words), the CBD and Campus text, then the story and six opening lines as one batch, twice | 30 of 30 at 10/10, confirmed. 132 calls, $16.68. Tales 25–35 words |
| [`20261029-161328-v8`](20261029-161328-v8/trace.md) | V2.0 → V2.2 | Prototype 8's text, four stages: 45 pieces one by one (V2.0); the story as one batch (V2.1); Arcade's banners (V2.1); the story and six opening lines as one batch (V2.2) | 48 of 48 at 10/10, confirmed. 183 calls, $19.88. The text: `v8_copy.json`, placed by `prototypes/p8/make_lore.py` |

- Each stage's folder keeps the guide it read (`STYLE_GUIDE.snapshot.md`). The run's root snapshot is V2.0. The V2.1 snapshots in `story-batch/` and `arcade-banners/` were written after those stages ran (see their first line).

## The submission's runs (guide v5)

| Run | Job | Result |
|---|---|---|
| [`20261029-153848-examples`](20261029-153848-examples/trace.md) | The three adversarial examples | 3 of 3 accepted at 10/10, confirmed (1 → 10, 1 → 10, 2 → 10) |
| [`20261029-153852-calibration`](20261029-153852-calibration/trace.md) | The evaluator alone: 22 shipped strings, 19 seeded violations | 41 of 41 hit; judgement-only 8 of 8. Shipped mean 9.7, seeded 6.5 |
| [`20261029-153953-d78-monument`](20261029-153953-d78-monument/trace.md) | Real content: Monument's 36 tile barks (D78), per tile then as one batch | 10 of 10 at 10/10, confirmed. Lines: `proposal_lines.json` |
| [`20261029-154451-audit`](20261029-154451-audit/trace.md) | Real content: Farsight's 42 shipped strings | 40 at 10/10 first time, confirmed. Parkland A1: 6 → 10 ("level"); Parkland B3: a confirmation nit (T5) |
| [`20261029-153351-piece`](20261029-153351-piece/trace.md) | The pipeline hook, `--piece`, on shipped bark b031 | 10 → ✓10 |

## Earlier runs (kept: they changed the guide)

| Run | Guide | Job | What it showed |
|---|---|---|---|
| [`20261029-153651-examples`](20261029-153651-examples/trace.md) | v4 | The three examples | Accepted "A write-off beside the plaque." twice; a v2 confirmation had rejected it → R4 made explicit (v5) |
| [`20261029-153536-examples`](20261029-153536-examples/trace.md) | v4 | The three examples | Example 1 with the shipped tale withheld; its facts were phrased too close to the shipped wording |
| [`20261029-153333-examples`](20261029-153333-examples/trace.md) | v4 | The three examples | Example 1 with the shipped tale withheld and no facts: the evaluator wrongly said A1 has no conveyor → slot facts added |
| [`20261029-153336-calibration`](20261029-153336-calibration/trace.md) | v4 | Calibration | 41 of 41 |
| [`20261029-150755-examples`](20261029-150755-examples/trace.md) | v3 | The three examples | Example 1's After was the shipped A1 tale word for word → the slot's shipped text is now withheld |
| [`20261029-150757-calibration`](20261029-150757-calibration/trace.md) | v3 | Calibration | 41 of 41 |
| [`20261029-135930-examples`](20261029-135930-examples/trace.md) | v2 | The three examples | Example 2's first 10/10 overturned by its confirmation: "beside the plaque" claims a position no event logs |
| [`20261029-135934-calibration`](20261029-135934-calibration/trace.md) | v2 | Calibration | 41 of 41. Its rules named "boss", "hero", "champion" and called "the dummy" off-voice → fixed in v3 |
| [`20261029-140054-d78-monument`](20261029-140054-d78-monument/trace.md) | v2 | Monument tile barks | 10 of 10; lines it accepted ("Struck beneath the LED canyon") fail v5's R4 |
| [`20261029-140105-audit`](20261029-140105-audit/trace.md) | v2 | The audit | 41 of 42 first time |
| [`20261029-135017-examples`](20261029-135017-examples/trace.md) | v1 | The three examples | 3 of 3 at 10/10 |
| [`20261029-135021-calibration`](20261029-135021-calibration/trace.md) | v1 | Calibration | 41 of 41 |
| [`20261029-135110-d78-monument`](20261029-135110-d78-monument/trace.md) | v1 | Monument tile barks | Its batch pass found three truth slips the 10/10 tile passes missed, and six Budget lines closing on "Kind regards" → T11 widened; confirmations added (v2) |
| [`20261029-135237-audit`](20261029-135237-audit/trace.md) | v1 | The audit | F7 flagged 9 of 27 shipped tales for not ending on an imperative, and the refiner rewrote canon to fit → F7 rewritten (v2) |
