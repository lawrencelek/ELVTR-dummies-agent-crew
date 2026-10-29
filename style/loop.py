#!/usr/bin/env python3
"""DUMMIES Style Guide Agent (Assignment 6): generator → evaluator → refiner → evaluator, until 10/10 or the round cap.

Three fresh headless agents (style/llm.py), no shared memory. The evaluator grades against style/STYLE_GUIDE.md and
returns SCORE and REASON; style/lint.py measures what is computable and hands it over as evidence; the refiner reads the
REASON and rewrites. No human step inside the loop.

  python3 style/loop.py --examples                 # the three adversarial examples (style/cases/examples.json)
  python3 style/loop.py --d78 monument             # real content: tile barks for one district (D78 proposal), per tile, then as one batch
  python3 style/loop.py --d78-batch style/runs/<id>   # stage 2 only, on a stage-1 run
  python3 style/loop.py --audit                    # real content: every shipped tale, brief, act line and the ending
  python3 style/loop.py --calibrate                # evaluator only: shipped strings vs seeded violations
  python3 style/loop.py --retrace-calibration style/runs/<id>   # recompute its verdicts from the saved replies
  python3 style/loop.py --piece draft.json         # one piece from the content pipeline: evaluate, refine, evaluate
  STYLE_REPLAY=style/runs/<id> python3 style/loop.py --examples   # reuse that run's saved model outputs
"""
import argparse
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "content"))
sys.path.insert(0, str(ROOT / "style"))
import rag                     # noqa: E402  (Assignment 4: BM25, chunk IDs)
import lint                    # noqa: E402
import llm                     # noqa: E402
import style_kb               # noqa: E402

STYLE = ROOT / "style"
RUNS = STYLE / "runs"
P = lint.PARAMS
FLEET, STORY = lint.FLEET, lint.STORY
TIERS = {t["tier"]: t for t in FLEET["tiers"]}
DIST = {d["id"]: d for d in STORY["districts"]}
CODE = {"monument": "M", "parkland": "P", "waterfront": "W"}
BASE = {
    "car": ["FLEET#F1", "FLEET#F2", "FLEET#F3", "FLEET#F4", "FLEET#F8", "EDIT39#6.6", "DESIGN#D9.3", "EDIT26#3.2", "EDIT26#6.6",
            "FSG#field-text", "SUB4#5", "SUB4#6.2", "DECISIONS#rows-541-550"],
    "farsight": ["EDIT92#3", "STORY#S1", "STORY#S2", "STORY#S3", "EDIT39#4.1.1", "FLEET#F2", "FLEET#F3", "EDIT93#3.1/tales-rewritten~2",
                 "EDIT92#measured", "DECISIONS#rows-531-540~2", "DECISIONS#rows-541-550"],
}
EVENT_LINES = {"impact": ["FLEET#F9.1~2"], "writeoff": ["FLEET#F9.2"], "near-miss": ["FLEET#F9.3"], "miss": ["FLEET#F9.4"], "commit": ["FLEET#F9.5"],
               "honk": ["FLEET#F9.6"], "upgrade-seen": ["FLEET#F9.12"], "part-seen": ["FLEET#F9.13"]}
SUPERSEDED = {"EDIT92#3.1~1", "EDIT92#3.1~2", "EDIT92#3.1~3"}   # Edit 92's tile table: briefs, parts and tales replaced by Edit 93 and story.json
INDEX = None
LOCK = threading.Lock()


def index():
    """Built once per process, before any agent thread starts (main) and guarded for direct use."""
    global INDEX
    with LOCK:
        if INDEX is None:
            style_kb.build()
            _, chunks = rag.load_kb(ROOT, STYLE / "kb" / "manifest.json")
            INDEX = rag.Index(chunks)
    return INDEX


# ---------------------------------------------------------------- the slot: what the content is for, and what it may say
def tile_facts(district, tile):
    d = DIST[district]
    t = d["tiles"][tile]
    label, brief = style_kb.task_text(STORY["tasks"], STORY["classes"], t["task"])
    gift = style_kb.node_name(t["gift"]["node"]) if t.get("gift") else "none"
    return (f"{d['name']} {tile} · {t['title']} ({d['act']}; tile {d['order'].index(tile) + 1} of {len(d['order'])}). "
            f"Brief: {label}. {brief} Equipment issued here: {gift}. Chunk: STORY#{CODE[district]}{tile}.")


def slot_text(piece):
    k = piece["kind"]
    out = ["SLOT"]
    if k == "barks":
        out += ["- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.",
                '- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}',
                f"- Bubble: at most {P['style.bark.maxChars']} characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1."]
        tiles = set()
        for b in piece.get("lines") or []:
            w, ev = b.get("when") or {}, b.get("event")
            tier = w.get("tier")
            voice = f"tier {tier} {TIERS[tier]['name']}: {TIERS[tier]['voice']}" if tier in TIERS else "no tier: fires for all four tiers"
            conds = ", ".join(f"{a}={json.dumps(v, ensure_ascii=False)}" for a, v in w.items() if a != "tier") or "none"
            fields = ", ".join(FLEET["events"].get(ev, [])) or "no fields"
            out.append(f"- Line {b.get('id')}: event `{ev}` (logs: {fields}); {voice}; other conditions: {conds}; claims: {b.get('claims')}.")
            if w.get("tile") and w.get("district") in DIST and w["tile"] in DIST[w["district"]]["tiles"]:
                tiles.add((w["district"], w["tile"]))
        for d, t in sorted(tiles):
            out.append(f"- Tile (proposed `tile` condition, D78): {tile_facts(d, t)}")
    elif k == "tale":
        out += ["- Kind: tale, `content/story/story.json` `districts[].tiles.<tile>.tale`. Speaker: Farsight. Shown on the tile card.",
                '- Schema: {"kind": "tale", "district", "tile", "title", "tale"}',
                f"- Card: at most {P['style.tale.maxChars']} characters (style.tale.maxChars); sentences of at most {P['style.tale.maxSentenceWords']} words.",
                f"- Tile: {tile_facts(piece['district'], piece['tile'])}"]
    elif k == "brief":
        out += ["- Kind: brief, `content/story/story.json` `tasks.<kind>`. Speaker: Farsight. Label on the tile card and the objective strip.",
                '- Schema: {"kind": "brief", "task", "label", "brief"}', f"- Task kind: {piece.get('task')}."]
    elif k == "act":
        d = DIST[piece["district"]]
        out += ["- Kind: act line, `content/story/story.json` `districts[].intro`. Speaker: Farsight. On the district's first card.",
                '- Schema: {"kind": "act", "district", "intro"}', f"- District: {d['name']}, {d['act']}."]
    elif k == "ending":
        out += ["- Kind: the ending, `content/story/story.json` `ending`. Speaker: Farsight. The CERTIFIED screen.", '- Schema: {"kind": "ending", "ending"}']
    return "\n".join(out)


def speaker(piece):
    return "car" if piece["kind"] == "barks" else "farsight"


def piece_text(piece):
    if piece["kind"] == "barks":
        return " ".join(str(b.get("text") or "") for b in piece.get("lines") or [])
    return " ".join(str(piece.get(k) or "") for k in ("title", "tale", "label", "brief", "intro", "ending"))


def resolve(idx, cid):
    """A chunk ID, or its parts when the chunker split it (rows-541-550 → rows-541-550~1, ~2). An unknown ID is an error:
    a rule's source must never drop out of the canon silently."""
    if cid in idx.by_id:
        return [cid]
    parts = [k for k in idx.by_id if k.startswith(cid + "~")]
    if not parts:
        raise KeyError(f"canon chunk {cid} is not in the knowledge base")
    return sorted(parts, key=lambda k: int(k.rsplit("~", 1)[1]))


def canon(piece):
    """The rules' own chunks for this speaker, the slot's tile and event chunks, then BM25 on the text."""
    idx = index()
    ids = list(BASE[speaker(piece)])
    if piece["kind"] == "barks":
        for b in piece.get("lines") or []:
            ids += EVENT_LINES.get(b.get("event"), [])
            w = b.get("when") or {}
            if w.get("tile") and w.get("district") in CODE:
                ids.append(f"STORY#{CODE[w['district']]}{w['tile']}")
    elif piece.get("district") in CODE and piece.get("tile"):
        ids.append(f"STORY#{CODE[piece['district']]}{piece['tile']}")
    ids = [j for i in dict.fromkeys(ids) for j in resolve(idx, i)]
    extra = [c["id"] for c, _ in idx.search(piece_text(piece), k=3, exclude=set(ids) | SUPERSEDED)]
    ids += extra
    text = "CANON\n\n" + "\n\n".join(f"[{i}] {idx.by_id[i]['title']}\n{idx.by_id[i]['text']}" for i in ids)
    return text, ids


# ---------------------------------------------------------------- one case folder
class Case:
    def __init__(self, run_dir, name):
        self.name, self.dir, self.calls = name, Path(run_dir) / name, []
        self.dir.mkdir(parents=True, exist_ok=True)

    def save(self, name, text):
        (self.dir / name).write_text(text if isinstance(text, str) else json.dumps(text, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


SCORE_RX = re.compile(r"^\s*SCORE:\s*\[?(\d{1,2})\s*/\s*10\]?\s*$", re.M)
DEDUCT_RX = re.compile(r"\((blocking|major|minor),\s*[−\-–]\s*(\d)\)")
RULE_RX = re.compile(r"\b([TVFR]\d{1,2})\b")


def check_eval(text, findings):
    """Format and consistency of the evaluator's reply. Problems go back to it once, automatically."""
    probs = []
    m = SCORE_RX.search(text)
    if not m:
        return None, ["the first line must be 'SCORE: <X>/10'"]
    score = int(m.group(1))
    if not 1 <= score <= 10:
        probs.append("SCORE must be 1–10")
    if "REASON:" not in text:
        probs.append("a 'REASON:' block must follow the SCORE")
    reason = text.split("REASON:", 1)[-1]
    total = sum(int(n) for _, n in DEDUCT_RX.findall(reason))
    if max(P["style.score.floor"], 10 - total) != score:
        probs.append(f"the deductions listed sum to {total}, so SCORE should be {max(1, 10 - total)}/10, not {score}/10")
    named = set(RULE_RX.findall(reason))
    missing = sorted({x["rule"] for x in findings} - named)
    if missing:
        probs.append("LINT findings not addressed in REASON: " + ", ".join(missing) + ". Deduct each, or name the guide's exemption")
    return score, probs


def evaluate(case, piece, rnd):
    findings = lint.lint(piece)
    case.save(f"e{rnd}_lint.json", findings)
    pack, ids = canon(piece)
    lint_txt = "LINT (style/lint.py)\n" + ("\n".join(f"- {x['path']} · {x['rule']} ({x['severity']}, −{x['deduct']}) \"{x['quote']}\": {x['measured']}. [{x['source']}]"
                                                    for x in findings) or "- No findings.")
    msg = "\n\n".join([slot_text(piece), pack, lint_txt, "CONTENT\n" + json.dumps(piece, indent=1, ensure_ascii=False)])
    raw = llm.call(case, "evaluator", msg, f"e{rnd}")
    score, probs = check_eval(raw, findings)
    retried = False
    if probs:
        retried = True
        note = "\n\nFORMAT CHECK (automatic, from the loop): your previous reply had these problems:\n" + "\n".join(f"- {p}" for p in probs) + \
               "\nYour previous reply:\n" + raw + "\nAnswer again in the required format."
        raw = llm.call(case, "evaluator", msg + note, f"e{rnd}b")
        score, probs = check_eval(raw, findings)
    reason = raw.split("REASON:", 1)[-1].strip() if "REASON:" in raw else raw.strip()
    cited = sorted(set(re.findall(r"\[([A-Z0-9]+#[^\]]+)\]", reason)))
    return {"round": rnd, "score": score, "raw": raw.strip(), "reason": reason, "lint": findings, "canon_ids": ids,
            "cited": cited, "uncited": [c for c in cited if c not in ids and c not in index().by_id], "format_retry": retried, "format_problems": probs}


LOCKED = {"barks": ("id", "event", "when", "claims"), "tale": ("district", "tile", "title"), "brief": ("task",), "act": ("district",), "ending": ()}


def restore(before, after, log):
    """The slot's fixed fields never change (refiner.md). Put back any the refiner touched."""
    if after.get("kind") != before["kind"]:
        log.append(f"kind {after.get('kind')} → {before['kind']}")
        after["kind"] = before["kind"]
    if before["kind"] == "barks":
        old, new = before.get("lines") or [], after.get("lines") or []
        if [b.get("id") for b in new] != [b.get("id") for b in old]:
            log.append("line ids changed; matched by position")
        fixed = []
        for i, b in enumerate(old):
            n = dict(new[i]) if i < len(new) else dict(b)
            for k in LOCKED["barks"]:
                if n.get(k) != b.get(k):
                    if k in n:
                        log.append(f"{b.get('id')}.{k} restored")
                    n[k] = b.get(k)
            fixed.append({k: n.get(k) for k in ("id", "event", "when", "style", "priority", "text", "claims")})
        after["lines"] = fixed
    else:
        for k in LOCKED[before["kind"]]:
            if after.get(k) != before.get(k):
                log.append(f"{k} restored")
                after[k] = before.get(k)
    return after


def refine(case, piece, ev, rnd):
    pack, _ = canon(piece)
    msg = "\n\n".join([slot_text(piece), pack, "CONTENT\n" + json.dumps(piece, indent=1, ensure_ascii=False), "EVALUATION\n" + ev["raw"]])
    raw = llm.call(case, "refiner", msg, f"f{rnd}")
    log = []
    try:
        out = restore(piece, llm.parse_json(raw), log)
    except (ValueError, json.JSONDecodeError) as e:
        log.append(f"unparseable reply ({e}); retried")
        raw = llm.call(case, "refiner", msg + "\n\nYour previous reply was not one JSON object. Output only the JSON object.", f"f{rnd}b")
        out = restore(piece, llm.parse_json(raw), log)
    case.save(f"f{rnd}_piece.json", out)
    return out, log


def generate(case, spec):
    slot = spec["slot"]
    pack, _ = canon(slot)
    msg = "\n\n".join([slot_text(slot), pack.replace("CANON", "CONTEXT", 1), "SLOT SKELETON (fill it)\n" + json.dumps(slot, indent=1, ensure_ascii=False),
                       "REQUEST\n" + spec["request"]])
    raw = llm.call(case, "generator", msg, "g0")
    log = []
    piece = restore(slot, llm.parse_json(raw), log)
    case.save("r0_piece.json", piece)
    return piece, log


# ---------------------------------------------------------------- the loop
def run_piece(case, spec, piece=None):
    """Generate (unless given a piece), then evaluate → refine → evaluate until the target or the cap.
    A 10/10 is accepted only when a fresh evaluator call confirms it (style.loop.confirmations); a dissent goes on as a REASON."""
    t0 = time.time()
    rounds, logs = [], []
    if piece is None:
        piece, log = generate(case, spec)
        logs += [f"g0: {x}" for x in log]
    else:
        case.save("r0_piece.json", piece)
    versions = [piece]
    target, cap, need = P["style.loop.targetScore"], P["style.loop.maxRounds"], P["style.loop.confirmations"]
    ev = dict(evaluate(case, piece, 1), version=0, kind="evaluation")
    rounds.append(ev)
    accepted, n = False, 1
    while True:
        conf = 0
        while ev["score"] == target and conf < need:
            conf += 1
            n += 1
            ev = dict(evaluate(case, piece, f"{len(versions)}c{conf}"), version=len(versions) - 1, kind="confirmation")
            rounds.append(ev)
        if ev["score"] == target:
            accepted = True
            break
        if len(versions) - 1 >= cap:
            break
        piece, log = refine(case, piece, ev, len(versions))
        logs += [f"f{len(versions)}: {x}" for x in log]
        versions.append(piece)
        ev = dict(evaluate(case, piece, len(versions)), version=len(versions) - 1, kind="evaluation")
        rounds.append(ev)
    summary = {"case": case.name, "class": spec.get("class"), "title": spec.get("title"), "request": spec.get("request"),
               "scores": [x["score"] for x in rounds], "kinds": [x["kind"] for x in rounds], "refinements": len(versions) - 1,
               "accepted": accepted, "final_version": len(versions) - 1,
               "seconds": round(time.time() - t0, 1), "calls": case.calls, "restored": logs,
               "cost_usd": round(sum(c.get("cost_usd") or 0 for c in case.calls), 4)}
    case.save("summary.json", summary)
    case.save("trace.md", trace(spec, versions, rounds, summary))
    return summary


def score_line(s):
    return " → ".join(("✓" if k == "confirmation" else "") + f"{x}" for x, k in zip(s["scores"], s.get("kinds") or ["evaluation"] * len(s["scores"])))


def show(piece):
    if piece["kind"] == "barks":
        rows = ["| Line | Event | Tier | Style | Text | Chars |", "|---|---|---|---|---|---|"]
        for b in piece.get("lines") or []:
            w = b.get("when") or {}
            rows.append(f"| {b.get('id')} | {b.get('event')} | {w.get('tier', '—')} | {b.get('style')} | {str(b.get('text')).replace('|', '/').replace(chr(10), ' ⏎ ')} | {len(str(b.get('text') or ''))} |")
        return "\n".join(rows)
    k = {"tale": "tale", "brief": "brief", "act": "intro", "ending": "ending"}[piece["kind"]]
    head = f"**{piece.get('label')}**\n\n" if piece["kind"] == "brief" else ""
    txt = str(piece.get(k) or "")
    return f"{head}> {txt.replace(chr(10), ' ⏎ ')}\n\n{len(txt)} characters."


def trace(spec, versions, rounds, s):
    L = [f"# {s['case']}" + (f" · {s['class']}" if s.get("class") else "") + (f" · {s['title']}" if s.get("title") else ""), "",
         f"- **Scores:** {score_line(s)} (✓ = a fresh confirming evaluation). **{'Accepted' if s['accepted'] else 'Stopped at the round cap'}** after {s['refinements']} refinement(s).",
         f"- **Calls:** {len(s['calls'])} · {s['seconds']} s · ${s['cost_usd']}. Models: generator {llm.MODELS['generator']}, evaluator {llm.MODELS['evaluator']}, refiner {llm.MODELS['refiner']}."]
    if spec.get("request"):
        L += ["- **Generator request:**", "", "> " + spec["request"].replace("\n", "\n> ")]
    if s["restored"]:
        L += ["- **Slot fields restored:** " + "; ".join(s["restored"])]
    shown, k = -1, 0
    for ev in rounds:
        i = ev["version"]
        if i != shown:
            title = "Before (generator)" if i == 0 and spec.get("request") else "Before (input)" if i == 0 else f"After refinement {i} (refiner)"
            L += ["", f"## {title}", "", show(versions[i])]
            shown = i
        k += 1
        L += ["", f"### {'Confirmation' if ev['kind'] == 'confirmation' else 'Evaluation'} {k}: {ev['score']}/10", ""]
        if ev["lint"] and ev["kind"] == "evaluation":
            L += ["Lint evidence:", ""] + [f"- {x['path']} · {x['rule']} ({x['severity']}) {x['measured']}" for x in ev["lint"]] + [""]
        L += ["```", ev["raw"], "```"]
        if ev["format_retry"]:
            L += ["", "_The loop returned the evaluator's first reply once for a format or arithmetic problem._"]
    return "\n".join(L) + "\n"


# ---------------------------------------------------------------- the jobs
def new_run(tag):
    rid = time.strftime("%Y%m%d-%H%M%S") + "-" + tag
    d = RUNS / rid
    d.mkdir(parents=True, exist_ok=True)
    (d / "STYLE_GUIDE.snapshot.md").write_text((STYLE / "STYLE_GUIDE.md").read_text(encoding="utf-8"), encoding="utf-8")   # the guide this run read
    return d


def run_all(run_dir, jobs, workers):
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(fn, *a) for fn, a in jobs]
        out = []
        for f in futs:
            try:
                out.append(f.result())
            except Exception as e:      # one failed case never stops the others
                out.append({"case": "?", "error": str(e)[:400]})
        return out


def job_case(run_dir, spec):
    try:
        return run_piece(Case(run_dir, spec["id"]), spec)
    except Exception as e:
        return {"case": spec["id"], "error": f"{type(e).__name__}: {str(e)[:300]}"}


def job_piece(run_dir, name, piece, spec):
    try:
        return run_piece(Case(run_dir, name), spec, piece=piece)
    except Exception as e:
        return {"case": name, "error": f"{type(e).__name__}: {str(e)[:300]}"}


def run_trace(run_dir, title, results, note=""):
    L = [f"# {title}", "", f"Run `{run_dir.name}`. Loop: generate → evaluate → refine → evaluate, until {P['style.loop.targetScore']}/10 or {P['style.loop.maxRounds']} refinements "
         f"(`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/STYLE_GUIDE.md`.", ""]
    if note:
        L += [note, ""]
    L += ["Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).", "",
          "| Case | Class | Scores | Refinements | Result | Cost |", "|---|---|---|---|---|---|"]
    for s in results:
        if "error" in s:
            L.append(f"| {s['case']} | — | error: {s['error'][:80]} | — | — | — |")
            continue
        L.append(f"| [{s['case']}]({s['case']}/trace.md) | {s.get('class') or '—'} | {score_line(s)} | {s['refinements']} | "
                 f"{'accepted' if s['accepted'] else 'stopped'} | ${s['cost_usd']} |")
    ok = [s for s in results if "error" not in s]
    L += ["", f"{sum(s['accepted'] for s in ok)} of {len(ok)} accepted at 10/10. Total ${round(sum(s['cost_usd'] for s in ok), 2)}."]
    (run_dir / "trace.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    (run_dir / "results.json").write_text(json.dumps(results, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def examples(workers):
    specs = json.loads((STYLE / "cases" / "examples.json").read_text(encoding="utf-8"))["cases"]
    run_dir = new_run("examples")
    res = run_all(run_dir, [(job_case, (run_dir, s)) for s in specs], workers)
    run_trace(run_dir, "Style Guide Agent: three adversarial examples", res)
    return run_dir


D78_REQUEST = ("Write the four impact barks a car says when it hits the dummy on this tile, one per price tier (01 Luxury, 02 Corporate, "
               "03 Consumer, 04 Budget). Each line names this tile's place: its landmark from the title or the tale, or the district. "
               "Never the grid code. Each in its tier's voice, at most 48 characters, true to an impact on this tile. Pick each line's style.")


def d78(district, workers):
    d = DIST[district]
    run_dir = new_run(f"d78-{district}")
    n0 = {"monument": 100, "parkland": 200, "waterfront": 300}[district]
    jobs = []
    for i, tile in enumerate(d["order"]):
        lines = [{"id": f"t{n0 + i * 4 + j + 1:03d}", "event": "impact", "when": {"district": district, "tile": tile, "tier": tier},
                  "style": None, "priority": 2, "text": "", "claims": [f"district:{district}", f"tile:{tile}"]} for j, tier in enumerate(["01", "02", "03", "04"])]
        spec = {"id": f"{CODE[district]}{tile}", "class": "D78 tile barks", "title": f"{d['name']} {tile} · {d['tiles'][tile]['title']}",
                "slot": {"kind": "barks", "lines": lines}, "request": D78_REQUEST}
        jobs.append((job_case, (run_dir, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, f"D78 proposal: tile barks for {d['name']}", res,
              "Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`.")
    lines = []
    for s in res:
        if "error" in s:
            continue
        fin = json.loads((run_dir / s["case"] / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
        lines += [dict(b, accepted=s["accepted"]) for b in fin["lines"]]
    (run_dir / "tile_lines.json").write_text(json.dumps({"district": district, "stage": "per tile", "lines": lines}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    d78_batch(run_dir, res)
    return run_dir


def d78_batch(run_dir, res=None):
    """Stage 2: the district's lines as one batch, so the evaluator sees what no single tile shows (T11: repeated endings)."""
    run_dir = Path(run_dir)
    if res is None:
        res = json.loads((run_dir / "results.json").read_text(encoding="utf-8"))
        res = [r for r in res if r.get("case") != "batch"]
    tl = json.loads((run_dir / "tile_lines.json").read_text(encoding="utf-8"))
    piece = {"kind": "barks", "lines": [{k: v for k, v in b.items() if k != "accepted"} for b in tl["lines"]]}
    d = DIST[tl["district"]]
    spec = {"id": "batch", "class": "D78 batch", "title": f"all {len(piece['lines'])} {d['name']} lines as one batch"}
    s = job_piece(run_dir, "batch", piece, spec)
    run_trace(run_dir, f"D78 proposal: tile barks for {d['name']}", list(res) + [s],
              "Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`. "
              "Stage 1 runs the loop per tile; stage 2 (`batch`) runs it on the district's lines together.")
    if "error" not in s:
        fin = json.loads((run_dir / "batch" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
        out = {"district": tl["district"], "decision": "D78 (open); decision 542", "batch_scores": s["scores"], "accepted": s["accepted"], "lines": fin["lines"]}
        (run_dir / "proposal_lines.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return run_dir


def audit(workers):
    run_dir = new_run("audit")
    jobs = []
    for name, piece in lint.shipped():
        if piece["kind"] == "barks":
            continue
        spec = {"id": name.replace(" ", "-"), "class": "audit", "title": "shipped " + name}
        jobs.append((job_piece, (run_dir, spec["id"], piece, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Audit: Farsight's shipped copy", res,
              "Every shipped tale, brief, act line and the ending through the loop. A 10/10 needs no refinement. The refined text stays in this run (decision 542).")
    return run_dir


DEDUCTED_RX = re.compile(r"\b([TVFR]\d{1,2})\s*\((?:blocking|major|minor)")


def main_text(piece):
    if piece["kind"] == "barks":
        return " ".join(str(b.get("text") or "") for b in piece.get("lines") or [])
    return " ".join(str(piece.get(k)) for k in ("label", "brief", "tale", "intro", "ending") if piece.get(k))


def calibration_items():
    spec = json.loads((STYLE / "cases" / "calibration.json").read_text(encoding="utf-8"))
    bark = {b["id"]: b for b in FLEET["barks"]}
    items = []
    for x in spec["shipped"]:
        piece = {"kind": "barks", "lines": [bark[x[5:]]]} if x.startswith("bark ") else dict(lint.shipped_piece(x))
        items.append({"id": x.replace(" ", "-"), "expect": "shipped", "piece": piece})
    for x in spec["seeded"]:
        items.append({"id": x["id"], "expect": "seeded", "rule": x["rule"], "piece": x["piece"], "note": x.get("note", "")})
    return items


def verdict(it, score, reason, findings, cost):
    """Calibration targets (STYLE_GUIDE.md §6). A rule counts as named only on a deduction line."""
    named = set(DEDUCTED_RX.findall(reason))
    lint_rules = {x["rule"] for x in findings}
    if it["expect"] == "shipped" and not lint_rules:
        ok, want = (score or 0) >= P["style.calibration.shippedMin"], f"≥ {P['style.calibration.shippedMin']}"
    elif it["expect"] == "shipped":
        cap = 10 - sum(x["deduct"] for x in findings)
        ok, want = (score or 0) <= cap and lint_rules <= named, f"≤ {cap}, names {', '.join(sorted(lint_rules))}"
    else:
        sev = next(r for r in RULES if r["id"] == it["rule"])["severity"].split()[0]
        cap = 10 - lint.SEV[sev]
        ok, want = (score or 0) <= cap and it["rule"] in named, f"≤ {cap}, names {it['rule']}"
    return {"id": it["id"], "expect": it["expect"], "rule": it.get("rule"), "want": want, "score": score, "ok": ok,
            "named": sorted(named), "lint": sorted(lint_rules), "text": main_text(it["piece"])[:160], "cost_usd": cost}


def calibration_trace(run_dir, res):
    L = ["# Evaluator calibration", "", f"Run `{run_dir.name}`. The evaluator alone, on shipped strings and on seeded violations (`style/cases/calibration.json`). "
         "Targets: STYLE_GUIDE.md §6. \"Deducted\" lists the rules on the REASON's deduction lines.", "",
         "| Item | Kind | Text | Want | Score | Deducted | Hit |", "|---|---|---|---|---|---|---|"]
    for r in res:
        L.append(f"| [{r['id']}](calibration/{r['id']}/e1_output_raw.txt) | {r['expect']}{' · ' + r['rule'] if r['rule'] else ''} | {r['text'].replace('|', '/')[:90]} | {r['want']} | "
                 f"{r['score']}/10 | {', '.join(r['named']) or '—'} | {'yes' if r['ok'] else '**no**'} |")
    sh = [r["score"] for r in res if r["expect"] == "shipped" and r["score"]]
    se = [r["score"] for r in res if r["expect"] == "seeded" and r["score"]]
    judge = [r for r in res if r["expect"] == "seeded" and not r.get("lint")]
    L += ["", f"- **Hits:** {sum(r['ok'] for r in res)} of {len(res)}.",
          f"- **Judgement only** (seeded, no lint finding: {', '.join(r['rule'] for r in judge)}): {sum(r['ok'] for r in judge)} of {len(judge)} hit.",
          f"- **Mean score:** shipped {sum(sh) / max(1, len(sh)):.1f} ({len(sh)}), seeded {sum(se) / max(1, len(se)):.1f} ({len(se)}).",
          f"- **Cost:** ${round(sum(r['cost_usd'] for r in res), 2)}."]
    (run_dir / "trace.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    (run_dir / "results.json").write_text(json.dumps(res, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def calibrate(workers):
    items = calibration_items()
    run_dir = new_run("calibration")
    cal = run_dir / "calibration"
    cal.mkdir(exist_ok=True)

    def one(it):
        case = Case(cal, it["id"])
        case.save("piece.json", it["piece"])
        ev = evaluate(case, it["piece"], 1)
        r = verdict(it, ev["score"], ev["reason"], ev["lint"], round(sum(c.get("cost_usd") or 0 for c in case.calls), 4))
        case.save("result.json", dict(r, raw=ev["raw"]))
        return r

    def safe(it):
        try:
            return one(it)
        except Exception as e:     # one failed item never stops the others
            return {"id": it["id"], "expect": it["expect"], "rule": it.get("rule"), "want": "—", "score": None, "ok": False,
                    "named": [], "text": f"error: {str(e)[:120]}", "cost_usd": 0}

    with ThreadPoolExecutor(max_workers=workers) as ex:
        res = list(ex.map(safe, items))
    calibration_trace(run_dir, res)
    return run_dir


def retrace_calibration(run_dir):
    """Recompute a calibration run's verdicts from its saved evaluator replies; no model calls."""
    run_dir = Path(run_dir)
    res = []
    for it in calibration_items():
        d = run_dir / "calibration" / it["id"]
        raw = (d / "e1b_output_raw.txt" if (d / "e1b_output_raw.txt").exists() else d / "e1_output_raw.txt").read_text(encoding="utf-8")
        findings = lint.lint(it["piece"])
        score, _ = check_eval(raw, findings)
        reason = raw.split("REASON:", 1)[-1]
        old = json.loads((d / "result.json").read_text(encoding="utf-8"))
        r = verdict(it, score, reason, findings, old.get("cost_usd", 0))
        (d / "result.json").write_text(json.dumps(dict(r, raw=raw.strip()), indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        res.append(r)
    calibration_trace(run_dir, res)
    return run_dir


def guide_rules():
    out = []
    for ln in (STYLE / "STYLE_GUIDE.md").read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\| ([TVFR]\d{1,2}) \| ([^|]+) \|.*\| ([a-z ();]+) \|$", ln)
        if m:
            out.append({"id": m.group(1), "speaker": m.group(2).strip(), "severity": m.group(3).strip()})
    return out


RULES = guide_rules()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--examples", action="store_true")
    ap.add_argument("--d78", metavar="DISTRICT")
    ap.add_argument("--d78-batch", metavar="RUN")
    ap.add_argument("--audit", action="store_true")
    ap.add_argument("--calibrate", action="store_true")
    ap.add_argument("--retrace-calibration", metavar="RUN")
    ap.add_argument("--piece", metavar="JSON")
    ap.add_argument("--workers", type=int, default=6)
    a = ap.parse_args()
    index()
    if a.examples:
        print(examples(a.workers))
    if a.d78:
        print(d78(a.d78, a.workers))
    if a.d78_batch:
        print(d78_batch(a.d78_batch))
    if a.audit:
        print(audit(a.workers))
    if a.calibrate:
        print(calibrate(a.workers))
    if a.retrace_calibration:
        print(retrace_calibration(a.retrace_calibration))
    if a.piece:
        run_dir = new_run("piece")
        piece = json.loads(Path(a.piece).read_text(encoding="utf-8"))
        s = run_piece(Case(run_dir, "piece"), {"id": "piece", "title": Path(a.piece).name}, piece=piece)
        run_trace(run_dir, "One piece", [s])
        print(run_dir, s["scores"])
    if not any([a.examples, a.d78, a.d78_batch, a.audit, a.calibrate, a.retrace_calibration, a.piece]):
        ap.print_help()


if __name__ == "__main__":
    main()
