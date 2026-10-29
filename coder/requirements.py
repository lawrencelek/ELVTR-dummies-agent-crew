"""Turn the GDD into requirements with acceptance probes: the analyst agent, then validation and calibration.

1. gdd.candidates() picks the statements the GDD marks as unbuilt (proposed, known gap, open) or built.
2. The analyst agent (agents/analyst.md) writes atomic requirements, each with probes: the acceptance tests.
3. Validation (no model): references exist (candidates, chunks, D-items, registry IDs, dependencies), probes compile.
4. Calibration, red before green: every probe runs against today's code.
     built in the GDD    must probe met       else: a bad probe (or a regression)
     proposed / gap      must not probe met   else: a probe too weak to tell the feature is missing
     any probe throws    a defect
   Issues go back to the analyst, at most twice. What is still wrong is marked, and the gate blocks it.
The result is cached in coder/state/requirements.json with the GDD's fingerprint; a changed GDD re-extracts.
"""
import json
import re
from pathlib import Path

import gdd
import llm
import probes as P
import scan as S

ROOT = Path(__file__).resolve().parents[1]
STATE = ROOT / "coder" / "state" / "requirements.json"
MAX_REPAIRS = 3
GDD_CAP = 70000


def api_docs():
    out = []
    for f in ("harness.js", "page.js"):
        lines = (ROOT / "coder" / f).read_text(encoding="utf-8").splitlines()
        out.append("\n".join(l[3:] if l.startswith("// ") else l[2:] for l in lines if l.startswith("//")))
    return "\n\n".join(out)


def code_map(sc):
    d = S.digest(sc)
    story = (ROOT / "prototypes/p7/story.js").read_text(encoding="utf-8")
    sj = json.loads((ROOT / "content/story/story.json").read_text(encoding="utf-8"))
    parts = [
        "## Files\n" + "\n".join(f"- `{k}`: {v['lines']} lines" for k, v in d["files"].items()),
        f"## Registry\n{d['registry']['ids']} IDs ({d['registryVersion']}); {d['registry']['readByCode']} read by the game's sources.",
        "## P7SIM flags (story.js): the P7-only values both modes run\n" + json.dumps(d["p7simFlags"]),
        "## Sim phases the code compares against\n" + ", ".join(d["phases"]),
        "## Events the code emits\n" + ", ".join(d["events"]),
        "## content/story/story.json\nTop-level keys: " + ", ".join(sj.keys()) + "; a district: " + ", ".join(sj["districts"][0].keys())
        + "; a tile: " + ", ".join(sj["districts"][0]["tiles"]["A1"].keys()) + f"\nending: {sj.get('ending')!r}",
        "## Outlines (line ranges, kind, name)\n" + "\n\n".join(S.outline(sc, r) for r in ("prototypes/p6/game.js", "prototypes/p6/world6.js")),
        "## prototypes/p7/story.js (Story mode), in full\n```js\n" + story + "\n```",
    ]
    return "\n\n".join(parts)


def gdd_context(chunks, idx, cands):
    """The candidates' own chunks first, then the best five neighbours of each; capped."""
    by_id = {c["id"]: c for c in chunks}
    pick, seen = [], set()
    for q in cands:
        for cid in [q["chunk"]] + [c["id"] for c, _ in idx.search(q["text"], k=5)]:
            if cid not in seen:
                seen.add(cid); pick.append(by_id[cid])
    out, n = [], 0
    for c in pick:
        block = f"### {c['id']} (rank {c['rank']}, {c['path']})\n{c['text']}"
        if n + len(block) > GDD_CAP:
            break
        out.append(block); n += len(block)
    return "\n\n".join(out)


def decisions_block(cands):
    ds = gdd.decisions()
    cited = sorted({d for q in cands for d in q["d_items"]}, key=lambda x: int(x[1:]))
    rows = set()
    lines = []
    for d in cited:
        v = ds.get(d)
        if not v:
            lines.append(f"- {d}: not in the open-decisions table"); continue
        lines.append(f"- {d} ({'OPEN' if v['open'] else 'CLOSED'}): {v['text']} · options: {v['options']} · notes: {v['notes']}")
        rows |= {int(r) for r in re.findall(r"rows? (\d+)", v["notes"])}
        # a closure that hands parts on names the next D-item: include it
        for nxt in re.findall(r"\b(D\d+)\b", v["notes"]):
            if nxt != d and nxt in ds and nxt not in cited:
                w = ds[nxt]
                lines.append(f"- {nxt} ({'OPEN' if w['open'] else 'CLOSED'}): {w['text']} · options: {w['options']} · notes: {w['notes']}")
    rr = gdd.decision_rows(rows)
    if rr:
        lines.append("\nRows cited by the notes:\n" + "\n".join(rr[k] for k in sorted(rr)))
    return "\n".join(lines)


def code_hits(sc, cands, cap=45000):
    """The code each candidate's words retrieve (BM25 over symbols), so probes name what really exists."""
    cidx, out, seen, n = S.index(sc), [], set(), 0
    for q in cands:
        for c, score in cidx.search(q["text"], k=3):
            rel, rest = c["id"].split("::", 1)
            if c["id"] in seen or rel == "prototypes/p7/story.js":
                continue
            name, line = rest.rsplit("@", 1)
            s = next((x for x in sc["symbols"][rel] if x["line"] == int(line) and x["name"] == name), None)
            if not s or s["kind"] == "class":
                continue
            body = S.excerpt(rel, s["line"], s["end"], max_chars=5000)
            block = f"### {rel} · {s['name']} (lines {s['line']}–{s['end']}) · for {q['cid']}\n```js\n{body}\n```"
            if n + len(block) > cap:
                return "\n\n".join(out)
            seen.add(c["id"]); out.append(block); n += len(block)
    return "\n\n".join(out)


def message(chunks, idx, cands, sc):
    cand = "\n".join(f"- `{q['cid']}` [{q['kind']}, rank {q['rank']}] {q['text']}" for q in cands)
    return "\n\n".join([
        "# Task\nWrite the requirements for these GDD candidates, with acceptance probes, as your system prompt says. Output one JSON object.",
        "# Candidates\n" + cand,
        "# Decisions\n" + decisions_block(cands),
        "# GDD chunks\n" + gdd_context(chunks, idx, cands),
        "# Probe APIs\n```\n" + api_docs() + "\n```",
        "# The code\n" + code_map(sc),
        "# Code the candidates retrieve\n" + code_hits(sc, cands),
    ])


# ---------- validation (no model)
def validate(doc, chunks, cands):
    errs = []
    reqs = doc.get("requirements") or []
    ids = [r.get("id") for r in reqs]
    if len(set(ids)) != len(ids):
        errs.append("duplicate requirement IDs")
    known = {c["id"] for c in chunks} | {q["cid"] for q in cands}
    regs = {e["id"] for e in json.loads((ROOT / "content/params/tuning.parameters.json").read_text(encoding="utf-8"))["entries"]}
    game = S.game_ids()  # IDs the game defines in code; some are not yet in the registry file
    ds = gdd.decisions()
    for r in reqs:
        rid = r.get("id", "?")
        for k in ("title", "statement", "sources", "gdd_status", "spec", "impact", "probes", "contract"):
            if k not in r:
                errs.append(f"{rid}: missing {k}")
        if r.get("gdd_status") not in ("built", "proposed", "gap"):
            errs.append(f"{rid}: gdd_status {r.get('gdd_status')!r}")
        if r.get("impact") not in ("core", "reward", "feedback", "content", "tooling"):
            errs.append(f"{rid}: impact {r.get('impact')!r}")
        if r.get("spec") not in ("full", "partial", "none"):
            errs.append(f"{rid}: spec {r.get('spec')!r}")
        for s in r.get("sources", []):
            m = re.match(r"^rows? (\d+)$", s)
            if m and gdd.decision_rows({int(m.group(1))}):
                continue
            if s not in known:
                errs.append(f"{rid}: source {s} is neither a candidate, a chunk nor a decision row ('row 533')")
        if r.get("decision") and r["decision"] not in ds:
            errs.append(f"{rid}: decision {r['decision']} is not in the decision log")
        for d in r.get("depends_on", []):
            if d not in ids:
                errs.append(f"{rid}: depends on unknown {d}")
        for u in r.get("registry_uses", []):
            if u not in regs and u not in game:
                errs.append(f"{rid}: registry_uses {u} is neither in the registry nor defined by the game (new IDs go in registry_new)")
        for n in r.get("registry_new", []):
            if n.get("id") in regs or n.get("id") in game:
                errs.append(f"{rid}: registry_new {n.get('id')} already exists (in the registry or the game's code); list it in registry_uses")
            for k in ("id", "default", "unit", "type", "description"):
                if k not in n:
                    errs.append(f"{rid}: registry_new entry missing {k}")
        pids = [p.get("id") for p in r.get("probes", [])]
        if len(set(pids)) != len(pids):
            errs.append(f"{rid}: duplicate probe IDs")
        for p in r.get("probes", []):
            if p.get("kind") in ("registry", "reads") and "reg" not in p:
                errs.append(f"{rid}.{p.get('id')}: {p.get('kind')} probe needs reg")
        for pid, e in P.check_syntax(r).items():
            errs.append(f"{rid}.{pid}: does not compile: {e}")
    # dependency cycles
    deps = {r["id"]: set(r.get("depends_on", [])) for r in reqs if "id" in r}
    def cyc(n, path):
        if n in path:
            return True
        return any(cyc(m, path | {n}) for m in deps.get(n, ()))
    for n in deps:
        if cyc(n, frozenset()):
            errs.append(f"{n}: dependency cycle"); break
    return errs


# ---------- calibration: red before green
def calibrate(doc, run, build):
    issues, results = [], {}
    src = P.sources_text()
    for r in doc["requirements"]:
        res = P.run(r, build=build, shots=run.dir / "shots" / "calibration", src_text=src)
        st = P.state(res)
        results[r["id"]] = {"state": st, "results": res}
        bad = [x for x in res if x.get("ok") is None]
        if bad:
            issues.append(f"{r['id']}: probe defect: " + "; ".join(f"{x['id']} threw {x.get('error')}" for x in bad))
        if r["gdd_status"] == "built" and any(x.get("ok") is False for x in res):
            issues.append(f"{r['id']}: the GDD marks this built, but these probes fail on today's code: "
                          + "; ".join(f"{x['id']} ({x.get('detail')})" for x in res if x.get("ok") is False) + ". Fix the probe, unless the code truly regressed.")
        elif r["gdd_status"] != "built" and st == "met":
            issues.append(f"{r['id']}: every probe already passes, but the feature is not built. Make at least one probe test the missing behaviour.")
        run.log(f"calibrate {r['id']}: {st} ({sum(1 for x in res if x.get('ok'))}/{len(res)})")
    return issues, results


def extract(run, sc, build, model=None, force=False):
    """The requirements for the current GDD (cached by fingerprint)."""
    fp = gdd.fingerprint()
    if STATE.exists() and not force:
        doc = json.loads(STATE.read_text(encoding="utf-8"))
        if doc.get("fingerprint") == fp:
            run.log(f"requirements: cached ({len(doc['requirements'])}, GDD {fp})")
            return doc
        run.log(f"requirements: the GDD changed ({doc.get('fingerprint')} → {fp}); extracting again")
    man, chunks, idx = gdd.load()
    cands = gdd.candidates(chunks)
    run.save("candidates.json", json.dumps(cands, indent=1, ensure_ascii=False))
    run.log(f"GDD: {len(chunks)} chunks; {len(cands)} candidates ({', '.join(sorted({q['kind'] for q in cands}))})")
    msg = message(chunks, idx, cands, sc)
    doc = llm.parse_json(llm.call(run, "Analyst", "analyst.md", msg, "analyst_1", model=model))
    history = []
    for k in range(MAX_REPAIRS + 1):
        errs = validate(doc, chunks, cands)
        issues, cal = ([], {}) if errs else calibrate(doc, run, build)
        history.append({"round": k + 1, "validation": errs, "calibration": issues})
        run.save(f"analyst_{k + 1}_issues.json", json.dumps(history[-1], indent=1, ensure_ascii=False))
        run.log(f"requirements round {k + 1}: {len(doc.get('requirements', []))} requirements; {len(errs)} validation errors; {len(issues)} calibration issues")
        if not errs and not issues:
            break
        if k == MAX_REPAIRS:
            break
        fix = ("# Your requirements had these problems. Return the whole corrected JSON object.\n\n" + "\n".join(f"- {e}" for e in errs + issues)
               + "\n\n# Probe results on today's code\n" + json.dumps({rid: [{"id": x["id"], "ok": x.get("ok"), "detail": x.get("detail"), "error": x.get("error")} for x in v["results"]] for rid, v in cal.items()}, indent=1)
               + "\n\n# Your previous JSON\n" + json.dumps(doc, indent=1, ensure_ascii=False)
               + "\n\n# The original brief follows\n\n" + msg)
        doc = llm.parse_json(llm.call(run, "Analyst", "analyst.md", fix, f"analyst_{k + 2}", model=model))
    flagged = {}
    for line in history[-1]["validation"] + history[-1]["calibration"]:
        rid = line.split(":", 1)[0].split(".")[0]
        flagged.setdefault(rid, []).append(line)
    for r in doc.get("requirements", []):
        r["calibration"] = flagged.get(r["id"], [])
    doc.update({"fingerprint": fp, "run": run.id, "rounds": history})
    STATE.parent.mkdir(parents=True, exist_ok=True)
    STATE.write_text(json.dumps(doc, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return doc
