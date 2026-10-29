# style/ — the DUMMIES Style Guide Agent

ELVTR Multi-Agent Systems, Assignment #6. The write-up is in the submission repository's README
([ELVTR-Multiagent-Submission-6](https://github.com/lawrencelek/ELVTR-Multiagent-Submission-6)).

The agent enforces DUMMIES' voice on new text. A generator drafts a bark or a piece of Farsight's copy. An evaluator grades it
against `STYLE_GUIDE.md` and returns `SCORE: X/10` and `REASON:`. A refiner rewrites it from the REASON. The loop repeats until
a 10/10 is confirmed by a second fresh evaluation, or three refinements. No human step inside.

```
python3 style/lint.py --shipped                    # the lint over every shipped string; no model calls
python3 style/style_kb.py                          # rebuild the knowledge base; chunk counts
python3 style/loop.py --examples                   # the three adversarial examples
python3 style/loop.py --calibrate                  # the evaluator alone: shipped strings vs seeded violations
python3 style/loop.py --d78 monument               # real content: tile barks, per tile, then as one batch
python3 style/loop.py --audit                      # real content: every shipped tale, brief, act line, the ending
python3 style/loop.py --piece draft.json           # one piece from the content pipeline
STYLE_REPLAY=style/runs/<id> python3 style/loop.py --examples   # re-run with that run's saved model outputs
```

Needs Python 3.9+ and Claude Code signed in (`claude` on the PATH). No API key is stored here.
Models: `STYLE_GEN_MODEL` (default `sonnet`), `STYLE_EVAL_MODEL` and `STYLE_REFINE_MODEL` (default `opus`).

| File | Role |
|---|---|
| `STYLE_GUIDE.md` | The guide: 34 rules in four types (tone, vocabulary and lore, formatting and length, truth), each with its GDD chunk, its test and its severity |
| `style.params.json` | The guide's statistics as IDs (`style.bark.maxChars`, `style.loop.maxRounds`…), in the registry's entry schema (decision 543) |
| `style_kb.py`, `kb/` | The knowledge base: Edits 92–94, 39, 26, V29 Design, the FARSIGHT Style Guide, Submission 4's precedents, the decision log, and pages generated from `fleet.json` and `story.json`. BM25 retrieval and chunk IDs from `content/rag.py` |
| `lint.py` | Deterministic evidence: length, banned terms, "!", casing, digits, grid codes, landmarks, fields, shape. Not a grade |
| `agents/generator.md`, `evaluator.md`, `refiner.md` | The three agents' system prompts. The evaluator and refiner also get the whole guide |
| `llm.py` | One fresh headless `claude -p` call per step, no tools, no shared memory; every input and output saved; replay |
| `loop.py` | The loop, the jobs, the traces |
| `cases/` | `examples.json` (three adversarial prompts), `calibration.json` (shipped and seeded items) |
| `runs/<id>/` | Every input, output, lint result and piece, a `trace.md` per case and per run, and the guide the run read (`STYLE_GUIDE.snapshot.md`) |
| `publish_submission.sh` | Copies `style/` and the inputs it reads into the submission repository |
