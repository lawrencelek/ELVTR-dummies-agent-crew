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
| `STYLE_GUIDE.md` | The guide: the cast and factions, then 34 rules in four types (tone, vocabulary and lore, formatting and length, truth), each with its GDD chunk, its test and its severity |
| `style.params.json` | The guide's statistics as IDs (`style.bark.maxChars`, `style.loop.maxRounds`…), in the registry's entry schema (decision 543) |
| `style_kb.py`, `kb/` | The knowledge base: Edits 92–94, 39, 26, V29 Design, the FARSIGHT Style Guide, Submission 4's precedents, the decision log, and pages generated from `fleet.json` and `story.json`. BM25 retrieval and chunk IDs from `content/rag.py` |
| `lint.py` | Deterministic evidence: length, banned terms, "!", casing, digits, grid codes, landmarks, fields, shape. Not a grade |
| `agents/generator.md`, `evaluator.md`, `refiner.md` | The three agents' system prompts. The evaluator and refiner also get the whole guide |
| `llm.py` | One fresh headless `claude -p` call per step, no tools, no shared memory; every input and output saved; replay |
| `loop.py` | The loop, the jobs, the traces |
| `cases/` | `examples.json` (three adversarial prompts), `calibration.json` (shipped and seeded items) |
| `runs/<id>/` | Every input, output, lint result and piece, a `trace.md` per case and per run, and the guide the run read (`STYLE_GUIDE.snapshot.md`) |
| `publish_submission.sh` | Copies `style/` and the inputs it reads into the submission repository |

## Style Guide V2 (GDD Edit 95, Prototype 8)

A separate guide for the lore refinement. `STYLE_GUIDE.md` (V1) stays as submitted, for Prototype 7.13.
- **The lore:** inside the game the company is Dummy Corporation. Farsight, the publisher, is named only in the Credits.
- **The voice:** deadpan and inspirational; few adjectives; no "!"; at most two sentences and 20 words (`style.v2.text.*`).
- **Tone reference:** *Play Station* (Lawrence Lek, 2017), `kb/DUMMIES_Play_Station_Script_2017.md` (doc `PLAY`).

```
python3 style/style_kb.py --v2                     # the V2 knowledge base: Edit 95 and PLAY first; kb/manifest_v2.json
python3 style/loop.py --v8                         # Prototype 8's text, four stages (below); writes runs/<id>-v8/v8_copy.json
python3 style/loop.py --v81                        # Prototype 8.1's text: 7.13's tales and CBD/Campus on V2.3, then the batch twice
python3 style/loop.py --v82                        # Prototype 8.2's text: the tales redrafted (15 to 35 words), the batch, Arcade's grade texts, the batch on V2.6
python3 style/loop.py --guide v2 --piece x.json    # one piece on V2
```

| File | Role |
|---|---|
| `STYLE_GUIDE_V2.md` | 42 rules (V2.6). V2.0 had 38; V2.1 added T14 (one slogan per batch) and V10 (the purpose stated); V2.2 added V11 (environmental storytelling); V2.3 lets a tale run to 35 words (F6); V2.4 bars placeholders from tales (F5); V2.5 sets tales at 15 to 35 words and adds F11 (length follows content); V2.6 asks for the shortest tale that keeps the tile |
| `agents/v2/` | The three agents for V2: Dummy Corporation's voice, the 20-word cap, Farsight only in the Credits |
| `lint.py` | `lint.MODE = "v2"`: Farsight blocking outside the Credits, intensifiers, the company's name, the sentence and word caps, a batch's repeated phrases |
| `loop.py --v8`, `--v81`, `--v82` | Prototype 8. Stage 1: each 7.13 text that breaks V2, piece by piece. Stage 2: the story's 31 texts as one batch. Stage 3: Arcade's district banners. Stage 4: the story and six opening lines as one batch, on V2.2. Prototype 8.1 (`--v81`): 7.13's tales and the CBD and Campus text on V2.3, then that batch on V2.3 and V2.4 |

