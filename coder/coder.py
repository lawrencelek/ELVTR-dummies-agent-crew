#!/usr/bin/env python3
"""DUMMIES goal-oriented coding agent (ELVTR Multi-Agent Systems, Assignment #5).

Reads the GDD, scans the codebase, finds what the GDD requires and the code lacks, decides what to build first,
writes it, verifies it, and re-scans after every write. It stops when every requirement is met or blocked.

  1. Requirements   the analyst agent turns the GDD's unbuilt statements into requirements with acceptance probes;
                    validation and red-before-green calibration check them (requirements.py). Cached per GDD version
  loop:
  2. Scan           files, symbols, registry use, flags, events, phases, frozen builds (scan.py)
  3. Gaps           every requirement's probes against the code now; the gate blocks what may not be built (gaps.py)
  4. Priority       score the buildable gaps; pick the top one (priority.py)
  5. Write          the coder agent writes edits for it; the agent applies them under guards (writer.py)
  6. Verify         build, smoke, the target's probes, every probe that passed before (verify.py)
                    a failure is rolled back and sent back to the coder, at most twice
  7. Re-scan        back to 2, until nothing buildable is left

Usage (from the repository root; needs Python 3.9+, Node 18+, Playwright for page probes, Claude Code signed in):
  python3 coder/coder.py --plan              requirements, gaps and scores only; no writes
  python3 coder/coder.py                     the loop (at most --max-writes writes)
  python3 coder/coder.py --only R-SHROUD     build that requirement next, if the gate allows it
  python3 coder/coder.py --extract           re-run the analyst even if the GDD has not changed
  python3 coder/coder.py --full              also run the game's own suites at the final gate
  CODER_REPLAY=coder/runs/<id> python3 coder/coder.py   reuse that run's model outputs (no model calls)
Output: coder/runs/<timestamp>/ (every input, output, patch, probe result, trace.md); coder/state/ (requirements, ledger).
"""
import argparse
import difflib
import datetime
import json
import os
import subprocess
import sys
import time
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gaps as GAPS  # noqa: E402
import gdd  # noqa: E402
import llm  # noqa: E402
import priority  # noqa: E402
import probes as P  # noqa: E402
import requirements  # noqa: E402
import scan as S  # noqa: E402
import verify as V  # noqa: E402
import writer  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
LEDGER = ROOT / "coder" / "state" / "ledger.json"
TRIES = 3  # a write and two repairs
ANALYST_MODEL = os.environ.get("ANALYST_MODEL", "opus")
CODER_MODEL = os.environ.get("CODER_MODEL", "opus")
TAG = os.environ.get("RELEASE_TAG", "Edit 94 (P7.13)")


class Run:
    def __init__(self):
        self.id = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        self.dir = ROOT / "coder" / "runs" / self.id
        self.dir.mkdir(parents=True)
        self.lines, self.calls, self.trace = [], [], []

    def log(self, msg):
        line = f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}"
        print(line, flush=True)
        self.lines.append(line)
        (self.dir / "run_log.txt").write_text("\n".join(self.lines) + "\n", encoding="utf-8")

    def save(self, name, text):
        p = self.dir / name
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(text, encoding="utf-8")
        return p

    def md(self, text):
        self.trace.append(text)
        self.save("trace.md", "\n\n".join(self.trace) + "\n")


def load_ledger():
    return json.loads(LEDGER.read_text(encoding="utf-8")) if LEDGER.exists() else {}


def save_ledger(lg):
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    LEDGER.write_text(json.dumps(lg, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def scan_summary(sc):
    d = S.digest(sc)
    return (f"{len(d['files'])} files, {sum(len(v) for v in d['symbols'].values())} symbols; registry {d['registryVersion']}: "
            f"{d['registry']['ids']} IDs, {d['registry']['readByCode']} read by the code; {len(d['p7simFlags'])} P7SIM flags; "
            f"{len(d['events'])} event types; {len(d['phases'])} phases; {len(d['frozen'])} frozen builds; live: {', '.join(d['live'])}")


def write_one(run, it, r, sc, chunks, idx, gp, reqs_by_id, ledger, api):
    """The code-writing step with its repair loop. Returns True if the write was accepted."""
    built = [{"id": k, "title": reqs_by_id[k]["title"], "summary": v.get("summary", "")} for k, v in ledger.items() if v.get("status") == "built" and k in reqs_by_id]
    base = writer.message(r, sc, chunks, idx, built, TAG, api)
    met_before = [k for k, g in gp.items() if g["state"] == "met"]
    msg, shots = base, run.dir / "shots" / f"it{it}_{r['id']}"
    for t in range(1, TRIES + 1):
        label = f"it{it}_{r['id']}_coder_{t}"
        text = llm.call(run, "Coder", "coder.md", msg, label, model=CODER_MODEL)
        fail, written = None, {}
        try:
            patch = writer.parse(text)
            run.save(f"{label}_patch.json", json.dumps(patch, indent=1, ensure_ascii=False))
            written, rep = writer.apply(patch, run.id, TAG)
            run.log(f"write {r['id']} try {t}: applied {rep['edits']} edits, {len(rep['creates'])} new files, registry {rep['registry'] or '—'}")
            vr = V.verify(r, met_before, reqs_by_id, run, shots)
            run.save(f"{label}_verify.json", json.dumps(vr, indent=1, ensure_ascii=False))
            if vr["ok"]:
                full, stat = [], []
                for p, old in sorted(written.items()):
                    new = (ROOT / p).read_text(encoding="utf-8")
                    d = list(difflib.unified_diff((old or "").splitlines(), new.splitlines(), f"a/{p}", f"b/{p}", lineterm="", n=2))
                    full += d
                    stat.append(f"{p}: +{sum(1 for l in d if l.startswith('+') and not l.startswith('+++'))} −{sum(1 for l in d if l.startswith('-') and not l.startswith('---'))}")
                run.save(f"{label}.diff", "\n".join(full) + "\n")
                diff = "\n".join(stat)
                ledger[r["id"]] = {"status": "built", "attempts": ledger.get(r["id"], {}).get("attempts", 0) + t - 1, "run": run.id, "iteration": it,
                                   "tries": t, "summary": patch["summary"], "files": sorted(written), "registry": rep["registry"]}
                save_ledger(ledger)
                run.md(f"**Try {t}: accepted.** {len(written)} files written ({', '.join(sorted(written))}); registry: {', '.join(rep['registry']) or 'no new IDs'}.\n\n"
                       f"Coder's summary:\n\n> " + patch["summary"].replace("\n", "\n> ") + "\n\n" + probe_lines(vr) + "\n\n```\n" + diff.strip() + "\n```")
                return True
            fail = V.failure_text(vr)
            writer.rollback(written); V.build()
        except (ValueError, json.JSONDecodeError) as e:
            fail = f"Your reply could not be read: {e}"
        except writer.Refused as e:
            fail = f"The agent refused the write: {e}"
        run.log(f"write {r['id']} try {t}: rejected: {fail.splitlines()[0][:200]}")
        run.md(f"**Try {t}: rejected.**\n\n```\n{fail[:3000]}\n```")
        msg = (base + "\n\n# Your previous attempt was rejected. Every file is back as it was. Fix the cause and send the whole write again.\n\n"
               "## What failed\n" + fail[:8000] + "\n\n## Your previous reply\n" + text[:60000])
    lg = ledger.get(r["id"], {})
    ledger[r["id"]] = {"status": "failed", "attempts": lg.get("attempts", 0) + 1, "run": run.id, "iteration": it, "last": fail[:2000] if fail else ""}
    save_ledger(ledger)
    return False


def probe_lines(vr):
    out = ["| Check | Probe | Result |", "|---|---|---|"]
    for x in vr.get("smoke") or []:
        out.append(f"| smoke | {x['id']}: {x.get('say', '')} | {'pass' if x.get('ok') else 'FAIL'} {x.get('detail') or ''} |")
    for x in vr.get("target") or []:
        out.append(f"| target | {x['id']}: {x.get('say', '')} | {'pass' if x.get('ok') else 'FAIL'} {(x.get('detail') or '')[:160]} |")
    for g in vr.get("regression") or []:
        out.append(f"| regression | {g['id']} | {g['state']} |")
    for s in vr.get("suites") or []:
        out.append(f"| suite | {s['suite']} | {'pass' if s['ok'] else 'FAIL'} {s['tail']} |")
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--plan", action="store_true", help="requirements, gaps and scores only; no writes")
    ap.add_argument("--extract", action="store_true", help="re-run the analyst")
    ap.add_argument("--only", help="build this requirement next")
    ap.add_argument("--max-writes", type=int, default=5)
    ap.add_argument("--full", action="store_true", help="the game's own suites at the final gate")
    a = ap.parse_args()

    run = Run()
    t0 = time.time()
    run.log(f"run {run.id}: analyst {ANALYST_MODEL}, coder {CODER_MODEL}, tag {TAG!r}")
    man, chunks, idx = gdd.load()
    sc = S.scan()
    ok, blog = V.build()
    if not ok:
        run.log("the build fails before any write: " + blog); return 1
    build = V.live_build()
    doc = requirements.extract(run, sc, build, model=ANALYST_MODEL, force=a.extract)
    reqs = doc["requirements"]
    by_id = {r["id"]: r for r in reqs}
    ledger = load_ledger()
    api = requirements.api_docs()
    run.md(f"# Coding agent run {run.id}\n\n- GDD: {len(man['docs'])} docs, {len(chunks)} chunks, fingerprint `{gdd.fingerprint()}`.\n"
           f"- Requirements: {len(reqs)} (from run {doc.get('run')}); excluded candidates: {len(doc.get('excluded', []))}.\n"
           f"- Models: analyst {ANALYST_MODEL}, coder {CODER_MODEL}. Release tag {TAG!r}.")
    stop, writes = None, 0
    for it in range(1, a.max_writes + 2):
        sc = S.scan()
        run.save(f"it{it}_scan.json", json.dumps(S.digest(sc), indent=1, ensure_ascii=False))
        gp = GAPS.detect(reqs, build, run, ledger, shots=run.dir / "shots" / f"it{it}_gaps")
        run.save(f"it{it}_gaps.json", json.dumps(gp, indent=1, ensure_ascii=False))
        ranked = priority.rank(reqs, gp, chunks, ledger)
        run.save(f"it{it}_priority.json", json.dumps(ranked, indent=1, ensure_ascii=False))
        run.md(f"## Iteration {it}\n\n**Scan:** {scan_summary(sc)}.\n\n### Gaps\n\n{GAPS.table(reqs, gp)}\n\n### Priority\n\n{priority.table(ranked)}")
        if a.only:
            pick = next((q for q in ranked if q["id"] == a.only), None)
            if not pick:
                g = gp.get(a.only)
                stop = f"{a.only} is not a requirement" if not g else f"{a.only} cannot be built now: {g['state']}, {g['blocked'] or 'met'}"
                break
        else:
            pick = ranked[0] if ranked else None
        if not pick:
            unmet = [r["id"] for r in reqs if gp[r["id"]]["state"] != "met"]
            stop = "every requirement is met" if not unmet else "every unmet requirement is blocked: " + ", ".join(f"{k} ({gp[k]['blocked']})" for k in unmet)
            break
        if a.plan:
            stop = f"plan only: the next write would be {pick['id']} (score {pick['score']})"; break
        if writes >= a.max_writes:
            stop = f"--max-writes {a.max_writes} reached; next would be {pick['id']}"; break
        r = by_id[pick["id"]]
        run.md(f"### Chosen: {r['id']}, {r['title']}\n\nScore {pick['score']} (value {pick['terms']['value']}, unblocks {pick['terms']['unblocks']}, "
               f"authority {pick['terms']['authority']}, cost {pick['terms']['cost']}). Waiting on it: {', '.join(pick['waiting']) or 'nothing'}.\n\n"
               f"> {r['statement']}\n\n### Write")
        run.log(f"iteration {it}: writing {r['id']} (score {pick['score']})")
        writes += 1
        write_one(run, it, r, sc, chunks, idx, gp, by_id, ledger, api)
        if a.only:
            a.only = None
    run.log("stop: " + str(stop))
    final = {"stop": stop, "writes": writes, "seconds": round(time.time() - t0), "calls": run.calls}
    if a.full and not a.plan:
        st = V.suites()
        final["suites"] = st
        run.log("final gate suites: " + ", ".join(f"{s['suite']} {'ok' if s['ok'] else 'FAIL'} ({s['tail']})" for s in st))
    run.save("final.json", json.dumps(final, indent=1, ensure_ascii=False))
    run.md(f"## Stop\n\n{stop}.\n\n- Writes: {writes}. Time: {final['seconds']} s. Model calls: {len(run.calls)} "
           f"({', '.join(c['label'] + ' ' + str(c.get('seconds', 'replayed')) + ' s' for c in run.calls)}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
