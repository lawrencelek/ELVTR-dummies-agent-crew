# coder/ — the DUMMIES goal-oriented coding agent

ELVTR Multi-Agent Systems, Assignment #5. The write-up is in the submission repository's README
([ELVTR-Multiagent-Submission-5](https://github.com/lawrencelek/ELVTR-Multiagent-Submission-5)).

The agent reads the GDD, scans the code, finds what the GDD requires and the code lacks, scores those gaps, writes
the code for the top one, verifies it, and re-scans. It stops when every requirement is met or blocked.

```
python3 coder/coder.py --plan        # requirements, gap table and scores; no writes
python3 coder/coder.py               # the loop: gap → score → write → verify → re-scan
python3 coder/coder.py --only R-ID   # build that requirement next, if the gate allows it
python3 coder/coder.py --extract     # re-run the analyst on an unchanged GDD
python3 coder/coder.py --full        # the game's own suites at the final gate
CODER_REPLAY=coder/runs/<id> python3 coder/coder.py   # re-run with that run's saved model outputs
```

Needs Python 3.9+, Node 18+, Playwright with Chromium (page probes), and Claude Code signed in (`claude` on the PATH).
No API key is stored here. Models: `ANALYST_MODEL`, `CODER_MODEL` (default `opus`).

| File | Step |
|---|---|
| `coder.py` | The loop and the trace |
| `gdd.py`, `gdd/` | The GDD: docs and precedence (`gdd/manifest.json`), chunks, decisions, requirement candidates |
| `requirements.py`, `agents/analyst.md` | The analyst agent: requirements with acceptance probes; validation; red-before-green calibration |
| `scan.py` | The codebase scan: files, symbols, registry use, flags, events, phases, frozen builds; code retrieval |
| `probes.py`, `harness.js`, `page.js` | The probes: static, headless sim (Node), page (Playwright) |
| `gaps.py` | The gap-detection pass and the gate |
| `priority.py` | Priority scoring |
| `writer.py`, `agents/coder.md` | The code-writing step: context, the coder agent, guarded apply, rollback |
| `verify.py` | Build, smoke, target probes, regression probes, the game's suites |
| `llm.py` | One headless Claude Code call per agent step, saved; replay |
| `state/` | `requirements.json` (cached per GDD fingerprint), `ledger.json` (what was built) |
| `runs/<id>/` | Every input, output, patch, probe result, screenshot; `trace.md` |
