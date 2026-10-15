#!/usr/bin/env python3
"""DUMMIES dynamic content pipeline (ELVTR Assignment #4).

Knowledge base (V29 Design + GDD edits) -> BM25 retrieval -> Generator agent -> validators
-> Critic agent -> repair loop -> published content that the P1 prototype reads.

  index      chunk the KB at its ## / ### headings                   (rag.py)
  retrieve   BM25, several focused queries per content type          (specs/<type>.json)
  generate   headless Claude, no tools, cites the chunks it used     (agents/generator.md)
  validate   deterministic canon checks                              (checks.py)
  critique   independent headless Claude with its own retrieval      (agents/critic.md)
  repair     generator applies validator + critic fixes, max 2 rounds
  publish    prototypes/p1/content/<type>.json, content.js, rebuilt dummies_p1.html, GDD edit in content/out/

Usage:
  python content/pipeline.py                          all three types
  python content/pipeline.py --type juice,graphics    some types
  python content/pipeline.py --query "barks workers"  show what retrieval returns, no model calls
  python content/pipeline.py --check                  re-validate published content, rebuild content.js; no model calls
Needs Python 3.9+, Node 18+, and Claude Code signed in (`claude` on PATH). No API key is stored here.
"""
import argparse
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
sys.path.insert(0, str(HERE))
import checks  # noqa: E402
import rag  # noqa: E402
import registry  # noqa: E402

P1 = ROOT / "prototypes" / "p1"
OUT_CONTENT = P1 / "content"
TYPES = ["juice", "interface", "graphics"]
MAX_REPAIRS = 2
CALL_TIMEOUT_S = 1500
MODEL = os.environ.get("CONTENT_MODEL")
CLAUDE = shutil.which("claude") or "claude"
EDIT_NO = {"juice": 31, "interface": 32, "graphics": 33}

# Registry IDs shown to the generator, per type (the full registry is used by the validators).
REG_PREFIXES = {
    "juice": ("feedback.", "damage.bodyHealth", "proto.recoil", "proto.art.", "props.cone.radius", "body.radius",
              "vehicles.sedan.height", "vehicles.van.height", "battery.capacity", "movement.lungeDuration",
              "movement.lungeRecovery", "proto.honkSeconds", "proto.droneLiftSeconds"),
    "interface": ("proto.standoffDistance", "proto.learn.", "proto.scale.unitsPerMetre", "proto.honkSeconds",
                  "proto.driver.patienceSeconds", "proto.health.", "proto.quota.", "ui.type", "feedback."),
    "graphics": ("vehicles.", "body.radius", "world.", "ui.type", "proto.shoulderWidth", "proto.art.", "props.cone.radius"),
}


# ------------------------------------------------------------------ run bookkeeping
class Run:
    def __init__(self):
        self.id = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        self.dir = HERE / "runs" / self.id
        self.dir.mkdir(parents=True)
        self.lines, self.calls = [], []

    def log(self, msg):
        line = f"[{datetime.datetime.now().strftime('%H:%M:%S')}] {msg}"
        print(line, flush=True)
        self.lines.append(line)
        (self.dir / "run_log.txt").write_text("\n".join(self.lines) + "\n", encoding="utf-8")

    def save(self, rel, data):
        p = self.dir / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(data if isinstance(data, str) else json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        return p


def call_agent(run, role, prompt_file, message, label):
    """One agent = one fresh headless Claude Code session: its own system prompt, no tools, no shared memory."""
    system = (HERE / "agents" / prompt_file).read_text(encoding="utf-8")
    cmd = [CLAUDE, "-p", "--system-prompt", system, "--tools", "", "--output-format", "json"]
    if MODEL:
        cmd += ["--model", MODEL]
    run.save(f"{label}_input.md", message)
    run.log(f"{role}: calling ({len(message):,} chars in)")
    proc = subprocess.run(cmd, input=message, capture_output=True, text=True, encoding="utf-8",
                          timeout=CALL_TIMEOUT_S, cwd=str(run.dir))
    if proc.returncode != 0:
        raise RuntimeError(f"{role} failed (exit {proc.returncode}): {(proc.stderr or proc.stdout)[-800:]}")
    env = json.loads(proc.stdout)
    if env.get("is_error"):
        raise RuntimeError(f"{role} returned an error: {str(env.get('result'))[:800]}")
    text = env.get("result") or ""
    run.calls.append({"label": label, "role": role, "seconds": round(env.get("duration_ms", 0) / 1000, 1),
                      "output_tokens": (env.get("usage") or {}).get("output_tokens"),
                      "models": sorted((env.get("modelUsage") or {}).keys())})
    run.save(f"{label}_output_raw.txt", text)
    run.log(f"{role}: done in {run.calls[-1]['seconds']} s ({len(text):,} chars out)")
    return text


def parse_json(text):
    t = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip())
    a, b = t.find("{"), t.rfind("}")
    if a < 0 or b < 0:
        raise ValueError("no JSON object in agent output")
    return json.loads(t[a:b + 1])


# ------------------------------------------------------------------ context
def load_context():
    man, chunks = rag.load_kb(ROOT, HERE / "kb" / "manifest.json")
    kb = HERE / "kb"
    return {
        "manifest": man, "chunks": chunks, "index": rag.Index(chunks), "kb_ids": {c["id"] for c in chunks},
        "registry": registry.registry(kb), "palette": registry.palette(kb), "levels": registry.levels(),
        "sim_events": registry.SIM_EVENTS,
    }


def load_spec(kind):
    return json.loads((HERE / "specs" / f"{kind}.json").read_text(encoding="utf-8"))


def retrieve(index, queries, k, cap, exclude=()):
    """Run each query; fill the context round-robin (every query's best hit, then every second-best, ...),
    keep each chunk once, cap the total. Run 20261015-010807 filled query by query and the cap starved the
    last queries (interface lost D8 endings and D3.9 shop; graphics lost P1.8 levels and D6.2 surfaces)."""
    hits, per, out = [], [], {}
    for q in queries:
        res = index.search(q, k=k, exclude=exclude)
        hits.append({"query": q, "results": [{"id": c["id"], "score": s} for c, s in res]})
        per.append((q, res))
    for rank in range(k):
        for q, res in per:
            if rank < len(res) and len(out) < cap:
                c, s = res[rank]
                if c["id"] not in out:
                    out[c["id"]] = {"chunk": c, "query": q, "score": s}
    return hits, out


def fmt_chunks(chunks):
    return "\n\n".join(f"[{c['id']}] ({c['title']})\n{c['text']}" for c in chunks)


def game_data(kind, ctx):
    reg = ctx["registry"]
    pre = REG_PREFIXES[kind]
    lines = ["Registry IDs you may reference (value, unit):"]
    for k in sorted(reg):
        if k.startswith(pre):
            r = reg[k]
            lines.append(f"- {k} = {r['value']:g} {r.get('unit', '')}".rstrip())
    lines.append("\nPalette roles (DESIGN#D10.2; road and shoulder are P1 field fills):")
    for r, v in ctx["palette"].items():
        lines.append(f"- {r}: {v['hex']} — {v['use']}")
    d = registry.node_json("{models:Object.values(new D.Sim('straight',{'run.appearances.road':0}).models).map(m=>m.id),"
                           "nodes:D.NODES,difficulties:D.DIFFICULTIES}")
    lines.append(f"\nP1 game data: models {d['models']}; levels "
                 + "; ".join(f"{k} = {v['name']} ({v['blurb']})" for k, v in ctx["levels"].items())
                 + "; upgrade nodes " + ", ".join(f"{k} ({v['name']}, {v['branch']})" for k, v in d["nodes"].items())
                 + "; difficulties " + ", ".join(x["name"] for x in d["difficulties"]) + ".")
    if kind == "graphics":
        lines.append("\nLevel geometry (world units; road = centreline polyline):")
        for k, v in ctx["levels"].items():
            cl = v["center"]
            short = cl if len(cl) <= 4 else cl[:2] + [["... arc of", len(cl) - 4, "points ..."]] + cl[-2:]
            lines.append(f"- {k}: centreline {json.dumps(short)}; statics {json.dumps(v['statics'])}; "
                         f"cone homes {json.dumps(v['cones'])}; dummy spawns {json.dumps([[s['x'], s['y']] for s in v['spawns']])}")
    return "\n".join(lines)


def brief_extras(spec):
    extra = []
    for key, head in (("voices", "Voices (who says what)"), ("slots", "Copy slots (where each string appears)"),
                      ("already_drawn", "Already drawn by the renderer (do not redraw or imitate)")):
        if isinstance(spec.get(key), dict):
            extra += [f"\n## {head}"] + [f"- {k}: {v}" for k, v in spec[key].items()]
        elif spec.get(key):
            extra += [f"\n## {head}"] + [f"- {v}" for v in spec[key]]
    return extra


def brief(spec, ctx):
    kind = spec["type"]
    allowed = dict(spec["allowed"])
    if "event_fields" in allowed:   # the generator cannot see registry.py: give it the real field names
        allowed["event_fields"] = {e: ctx["sim_events"][e] for e in allowed["events"]}
    extra = brief_extras(spec)
    return "\n".join([
        f"# BRIEF — {spec['title']}", f"Content type: {kind}. Parameter prefix for new IDs: {spec['param_prefix']}",
        "\n## The gap (what P1 is thin on)", *[f"- {g}" for g in spec["gap"]],
        "\n## Deliverable", *[f"- {g}" for g in spec["deliverable"]],
        "\n## JSON schema", "```", *spec["schema"], "```",
        "\n## Consumer contract (what the renderer can draw)", *[f"- {g}" for g in spec["consumer"]],
        "\n## Allowed values", "```json", json.dumps(allowed, indent=1, ensure_ascii=False), "```", *extra,
        "\n## Game data", game_data(kind, ctx),
    ])


def issue_lines(v_issues, c_issues):
    out = ["## Validator (automatic checks)"] + ([f"- {i['id']} [{i['kind']}/{i['severity']}] {i['path']}: {i['found']} — {i['rule']} ({i['canon']})" for i in v_issues] or ["- none"])
    out += ["\n## Critic"] + ([f"- {i.get('id')} [{i.get('kind')}/{i.get('severity')}] {i.get('path')}: found {json.dumps(i.get('found'), ensure_ascii=False)} — {i.get('rule')} ({i.get('canon')}). Fix: {json.dumps(i.get('fix'), ensure_ascii=False)}" for i in c_issues] or ["- none"])
    return "\n".join(out)


def critic_probes(content, n=6):
    """Probe queries built from what the generator actually wrote, so the critic retrieves canon near it."""
    texts = []
    for path, v in checks.walk(content):
        if isinstance(v, str) and len(v) > 24 and not checks.ID_RE.match(v) and not path.endswith("sources") \
                and not checks.CJK_RE.search(v):
            texts.append(v)
    texts.sort(key=len, reverse=True)
    return texts[:n]


# ------------------------------------------------------------------ JSON paths and diffs
def get_path(obj, path):
    try:
        for part in re.findall(r"[^.\[\]]+|\[\d+\]", path):
            obj = obj[int(part[1:-1])] if part.startswith("[") else obj[part]
        return obj
    except (KeyError, IndexError, TypeError, ValueError):
        return None


def leaf_diff(a, b, path=""):
    if isinstance(a, dict) and isinstance(b, dict):
        out = []
        for k in list(a) + [k for k in b if k not in a]:
            out += leaf_diff(a.get(k), b.get(k), f"{path}.{k}" if path else k)
        return out
    if isinstance(a, list) and isinstance(b, list) and not all(isinstance(x, (str, int, float)) for x in a + b):
        out = []
        for i in range(max(len(a), len(b))):
            out += leaf_diff(a[i] if i < len(a) else None, b[i] if i < len(b) else None, f"{path}[{i}]")
        return out
    return [] if a == b else [{"path": path, "before": a, "after": b}]


def short(v, n=110):
    s = v if isinstance(v, str) else json.dumps(v, ensure_ascii=False)
    s = s.replace("|", "\\|").replace("\n", " ")
    return s if len(s) <= n else s[:n - 1] + "…"


# ------------------------------------------------------------------ one content type
def run_type(run, kind, ctx, max_repairs):
    spec = load_spec(kind)
    rd = kind + "/"
    run.log(f"== {kind}: {spec['title']}")
    hits, got = retrieve(ctx["index"], spec["queries"], spec["k"], spec["max_chunks"])
    run.save(rd + "01_retrieval.json", hits)
    chunks = [g["chunk"] for g in got.values()]
    run.log(f"{kind}: retrieved {len(chunks)} chunks for {len(spec['queries'])} queries: {', '.join(got)}")
    b = brief(spec, ctx)
    gen_msg = b + "\n\n# CONTEXT\n\n" + fmt_chunks(chunks)
    draft = parse_json(call_agent(run, "Generator", "generator.md", gen_msg, rd + "02_generator"))
    run.save(rd + "02_draft.json", draft)
    vctx = dict(ctx, spec=spec, retrieved_ids=set(got))
    rounds, current = [], draft
    for r in range(max_repairs + 1):
        v_iss = checks.validate(kind, current, vctx)
        run.save(rd + f"r{r}_validator.json", list(v_iss))
        probes = critic_probes(current)
        c_hits, c_got = retrieve(ctx["index"], spec["critic_queries"] + probes, 2, 14, exclude=set(got))
        canon = chunks + [g["chunk"] for g in c_got.values()]
        run.save(rd + f"r{r}_critic_retrieval.json", c_hits)
        c_msg = "\n".join([f"# BRIEF — {spec['title']}", *[f"- {g}" for g in spec["gap"]],
                           "\n## Consumer contract", *[f"- {g}" for g in spec["consumer"]], *brief_extras(spec),
                           "\n# CANON\n", fmt_chunks(canon), "\n# VALIDATOR",
                           *([f"- {i['id']} {i['path']}: {i['found']} — {i['rule']}" for i in v_iss] or ["- none"]),
                           "\n# SETTLED (fixes applied in earlier rounds; do not reverse)",
                           *([f"- {c['path']}: {short(c['before'], 80)} -> {short(c['after'], 80)} ({c['canon']})" for rr_ in rounds for c in rr_.get("corrections", []) if c["after"] is not None] or ["- none"]),
                           "\n# CONTENT\n", json.dumps(current, indent=1, ensure_ascii=False)])
        critic = parse_json(call_agent(run, "Critic", "critic.md", c_msg, rd + f"r{r}_critic"))
        run.save(rd + f"r{r}_critic.json", critic)
        c_iss = critic.get("issues") or []
        v_block = [i for i in v_iss if i["severity"] == "block"]
        c_block = [i for i in c_iss if i.get("severity") == "block"]
        run.log(f"{kind}: round {r}: validator {len(v_iss)} issues ({len(v_block)} block); critic {critic.get('verdict')} "
                f"with {len(c_iss)} issues ({len(c_block)} block)")
        rounds.append({"round": r, "validator": list(v_iss), "critic": critic, "content": current})
        if not v_iss and not c_iss:
            break
        if r == max_repairs:
            break
        fix_msg = gen_msg + "\n\n# YOUR PREVIOUS OUTPUT\n\n" + json.dumps(current, indent=1, ensure_ascii=False) + \
            "\n\n# ISSUES TO FIX\n\n" + issue_lines(v_iss, c_iss) + \
            "\n\nApply every fix. Change nothing else. Output the complete corrected JSON object."
        repaired = parse_json(call_agent(run, "Generator (repair)", "generator.md", fix_msg, rd + f"r{r + 1}_repair"))
        run.save(rd + f"r{r + 1}_content.json", repaired)
        rounds[-1]["corrections"] = corrections(current, repaired, v_iss, c_iss)
        rounds[-1]["diff"] = leaf_diff(current, repaired)
        current = repaired
    last = rounds[-1]
    ok = not [i for i in last["validator"] if i["severity"] == "block"] and \
        not [i for i in last["critic"].get("issues") or [] if i.get("severity") == "block"]
    run.save(rd + "final.json", current)
    trace = trace_md(kind, spec, hits, got, current, rounds, ok)
    run.save(rd + "trace.md", trace)
    run.log(f"{kind}: {'ACCEPTED' if ok else 'NOT ACCEPTED'} after {len(rounds)} critic round(s)")
    return {"type": kind, "ok": ok, "content": current, "rounds": len(rounds)}


def corrections(before, after, v_iss, c_iss):
    out = []
    for i in list(v_iss) + list(c_iss):
        p = i.get("path") or ""
        out.append({"issue": i.get("id"), "kind": i.get("kind"), "severity": i.get("severity"), "path": p,
                    "canon": i.get("canon"), "rule": i.get("rule"), "found": i.get("found"), "fix": i.get("fix"),
                    "before": get_path(before, p), "after": get_path(after, p)})
    return out


# ------------------------------------------------------------------ reports
def item_label(it):
    if not isinstance(it, dict):
        return short(it)
    parts = []
    for k in ("event", "module", "cue", "job", "label", "text", "note", "meaning", "reference"):
        if isinstance(it.get(k), str):
            parts.append(it[k])
    if it.get("rows"):
        parts.append(" / ".join(r.get("label", "") for r in it["rows"]))
    if it.get("shake"):
        parts.append(f"shake {it['shake'].get('amp')}")
    if it.get("particles"):
        parts.append("particles " + ", ".join(p.get("type", "?") for p in it["particles"]))
    return " — ".join(parts) or short(it)


def sourced_items(content):
    for path, v in checks.walk(content):
        if isinstance(v, dict) and isinstance(v.get("sources"), list) and path and not path.startswith("params"):
            yield path, v


def trace_md(kind, spec, hits, got, content, rounds, ok):
    L = [f"# Trace — {kind}", "", f"Status: **{'accepted' if ok else 'not accepted'}** after {len(rounds)} critic round(s).", "",
         "## 1. Retrieval", "", "| Query | Top chunks (BM25 score) |", "|---|---|"]
    for h in hits:
        L.append(f"| {short(h['query'], 90)} | " + ", ".join(f"`{r['id']}` ({r['score']})" for r in h["results"]) + " |")
    L += ["", f"Context given to the generator: {len(got)} chunks.", "",
          "## 2. Query → retrieved chunk → output (side by side)", "",
          "| Output item | Cited chunk | Retrieved by query | Chunk excerpt |", "|---|---|---|---|"]
    for path, it in sourced_items(content):
        lab = item_label(it)
        for s in it["sources"][:2]:
            g = got.get(s)
            if g:
                L.append(f"| `{path}`: {short(lab, 90)} | `{s}` | {short(g['query'], 60)} | {short(rag.best_sentence(g['chunk']['text'], lab), 160)} |")
            else:
                L.append(f"| `{path}`: {short(lab, 90)} | `{s}` | (not retrieved) | |")
    L += ["", "## 3. Consistency loop", ""]
    for rd in rounds:
        c = rd["critic"]
        L += [f"### Round {rd['round']}", "", f"- Validator: {len(rd['validator'])} issue(s).",
              f"- Critic verdict: **{c.get('verdict')}**. {c.get('summary', '')}", ""]
        if rd.get("corrections"):
            L += ["| Issue | Kind | Path | Canon | Found (before) | Corrected (after) |", "|---|---|---|---|---|---|"]
            for co in rd["corrections"]:
                before = co["before"] if co["before"] is not None else co["found"]
                L.append(f"| {co['issue']} | {co['kind']}/{co['severity']} | `{short(co['path'], 40)}` | {co['canon']}: {short(co['rule'], 70)} | "
                         f"{short(before)} | {short(co['after']) if co['after'] is not None else '(removed or moved)'} |")
            L += ["", f"Leaf changes this round: {len(rd.get('diff') or [])}.", ""]
        elif c.get("issues") or rd["validator"]:
            L += ["Open issues (no repair round left):", ""]
            for i in rd["validator"] + (c.get("issues") or []):
                L.append(f"- {i.get('id')} [{i.get('kind')}/{i.get('severity')}] `{i.get('path')}`: {short(i.get('found'))} — {i.get('rule')}")
            L.append("")
    return "\n".join(L) + "\n"


# ------------------------------------------------------------------ publish
def publish(kind, content, run_id):
    OUT_CONTENT.mkdir(parents=True, exist_ok=True)
    data = dict(content)
    data["meta"] = {"type": kind, "run": run_id, "generator": "content/pipeline.py",
                    "kb": [d["id"] for d in json.loads((HERE / "kb" / "manifest.json").read_text())["docs"]],
                    "generated": datetime.datetime.now().isoformat(timespec="seconds")}
    (OUT_CONTENT / f"{kind}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    (HERE / "out" / f"DUMMIES_GDD_Edit{EDIT_NO[kind]}_{kind.capitalize()}.md").write_text(gdd_edit(kind, data), encoding="utf-8")


def bundle():
    merged = {}
    for k in TYPES:
        p = OUT_CONTENT / f"{k}.json"
        if p.exists():
            merged[k] = json.loads(p.read_text(encoding="utf-8"))
    js = ("/* Generated by content/pipeline.py from prototypes/p1/content/*.json. Do not edit by hand. */\n"
          "window.DUMMIES_CONTENT = " + json.dumps(merged, ensure_ascii=False, separators=(",", ":")) + ";\n")
    (P1 / "content.js").write_text(js, encoding="utf-8")
    subprocess.run([sys.executable, str(P1 / "build.py")], check=True)
    return list(merged)


def gdd_edit(kind, d):
    m = d["meta"]
    L = [f"# DUMMIES — GDD Edit {EDIT_NO[kind]}: Generated {kind.capitalize()}", "",
         f"**Generated · {m['generated'][:10]} · run `{m['run']}` · Proposed**", "",
         "- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `prototypes/p1/content/" + kind + ".json`.",
         "- **Source:** `content/pipeline.py`. Regenerate; do not hand-edit.",
         "- **Status:** Proposed. Generated from the knowledge base, checked by validators and the critic.", ""]
    if d.get("params"):
        L += ["## Parameters (prototype-only)", "", "| ID | Value | Unit | Purpose |", "|---|---:|---|---|"]
        L += [f"| `{p['id']}` | {p['value']:g} | {p.get('unit', '')} | {short(p.get('purpose', ''), 120)} |" for p in d["params"]]
        L.append("")
    if kind == "juice":
        L += [f"- **Hit pause:** `{d.get('hitStop')}`. **Write-off:** `{d.get('writeOff')}`. **Reduced motion:** `{d.get('reducedMotion')}`.", "",
              "## Event responses", "", "| Event | Response | Reference | Sources |", "|---|---|---|---|"]
        for e in d.get("events", []):
            resp = []
            if e.get("scale"):
                resp.append(f"scales by `{e['scale'].get('by')}` / `{e['scale'].get('full')}`")
            if e.get("shake"):
                resp.append(f"shake {e['shake'].get('amp')} for {e['shake'].get('seconds')}")
            if e.get("flash"):
                resp.append(f"flash {e['flash']}")
            for f in ("flinch", "carPulse", "stamp"):
                if e.get(f):
                    resp.append(f)
            for p in e.get("particles") or []:
                resp.append(f"{p.get('type')} ×{p.get('count')} ({p.get('role')}, {p.get('dir')})")
            L.append(f"| `{e.get('event')}` | {short('; '.join(resp), 200)} | {short(e.get('reference', ''), 80)} | {', '.join(e.get('sources', []))} |")
        L += ["", "## Persistent states", ""]
        for k, v in (d.get("states") or {}).items():
            L.append(f"- **{k}:** " + "; ".join(f"{a} `{b}`" for a, b in v.items() if a not in ("sources", "reference"))
                     + (f". {v.get('reference')}" if v.get("reference") else "") + f" ({', '.join(v.get('sources', []))})")
    elif kind == "interface":
        L += ["## HUD", "", "| Column | Module | Title | 中文 (review) | Rows |", "|---|---|---|---|---|"]
        for side in ("left", "right"):
            for mo in (d.get("hud") or {}).get(side, []):
                L.append(f"| {side} | {mo.get('module')} | {mo.get('title')} | {mo.get('zh', '')} ({mo.get('review', '')}) | "
                         + "; ".join(f"{r.get('label')} (`{r.get('fact')}`)" for r in mo.get("rows", [])) + " |")
        L += ["", "## Cue key", "", "| Cue | Label | Meaning |", "|---|---|---|"]
        L += [f"| {c.get('cue')} | {c.get('label')} | {c.get('meaning')} |" for c in d.get("cueKey", [])]
        L += ["", "## Copy deck", "", "| Key | Text |", "|---|---|"]
        for path, v in checks.walk(d.get("copy") or {}):
            if isinstance(v, str) and not path.startswith("sources") and not path.endswith("review"):
                L.append(f"| `{path}` | {short(v, 160)} |")
        L += ["", "## Barks", "", "| Event | When | Line |", "|---|---|---|"]
        L += [f"| `{b.get('event')}` | {json.dumps(b.get('when') or {}, ensure_ascii=False)} | {short(b.get('text', ''), 120)} |" for b in d.get("barks", [])]
    elif kind == "graphics":
        L += ["## Vehicles", "", "| Class | Job | 中文 (review) | Roof shapes | Sources |", "|---|---|---|---:|---|"]
        for cls, v in (d.get("vehicles") or {}).items():
            L.append(f"| {cls} | {v.get('job')} | {v.get('jobZh', '')} ({v.get('review', '')}) | {len(v.get('roof', []))} | {', '.join(v.get('sources', []))} |")
        dm = d.get("dummy") or {}
        L += ["", "## Dummy markings", "", f"- {len(dm.get('markings', []))} shapes: "
              + ", ".join(sorted({s.get('shape') for s in dm.get('markings', [])})) + f" ({', '.join(dm.get('sources', []))})", "",
              "## District dressing", "", "| Road | Decal | Surface | Text | Sources |", "|---|---|---|---|---|"]
        for lv, ds in (d.get("environment") or {}).items():
            for s in ds:
                L.append(f"| {lv} | {short(s.get('note', s.get('shape')), 80)} | {s.get('surface', '')} | {short(s.get('text', ''), 40)} | {', '.join(s.get('sources', []))} |")
    return "\n".join(L) + "\n"


def check_published(ctx):
    bad = 0
    for kind in TYPES:
        p = OUT_CONTENT / f"{kind}.json"
        if not p.exists():
            print(f"{kind}: not published")
            continue
        content = json.loads(p.read_text(encoding="utf-8"))
        content.pop("meta", None)
        spec = load_spec(kind)
        cited = {s for _, it in checks.walk(content) if isinstance(it, dict) for s in (it.get("sources") or []) if isinstance(it.get("sources"), list)}
        iss = checks.validate(kind, content, dict(ctx, spec=spec, retrieved_ids=cited & ctx["kb_ids"]))
        blocks = [i for i in iss if i["severity"] == "block"]
        bad += len(blocks)
        print(f"{kind}: {len(iss)} validator issue(s), {len(blocks)} blocking")
        for i in iss:
            print(f"  {i['id']} [{i['kind']}/{i['severity']}] {i['path']}: {i['found']} — {i['rule']}")
    print("content.js types:", bundle())
    return bad


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--type", default=",".join(TYPES))
    ap.add_argument("--query")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--no-publish", action="store_true")
    ap.add_argument("--max-repairs", type=int, default=MAX_REPAIRS)
    a = ap.parse_args()
    ctx = load_context()
    if a.query:
        for c, s in ctx["index"].search(a.query, k=5):
            print(f"{s:7.2f}  {c['id']:32s} {c['title'][:60]}\n         {rag.best_sentence(c['text'], a.query)}")
        return 0
    if a.check:
        return 1 if check_published(ctx) else 0
    kinds = [k.strip() for k in a.type.split(",") if k.strip()]
    for k in kinds:
        if k not in TYPES:
            ap.error(f"unknown type {k}")
    run = Run()
    run.log(f"KB: {len(ctx['chunks'])} chunks from {len(ctx['manifest']['docs'])} docs; registry {len(ctx['registry'])} IDs")
    results = []
    for k in kinds:
        try:
            res = run_type(run, k, ctx, a.max_repairs)
        except Exception as e:  # keep the other types going; the log keeps the reason
            run.log(f"{k}: FAILED — {e}")
            res = {"type": k, "ok": False, "error": str(e)}
        results.append(res)
        if res.get("ok") and not a.no_publish:
            publish(k, res["content"], run.id)
            run.log(f"{k}: published to prototypes/p1/content/{k}.json and content/out/")
    if any(r.get("ok") for r in results) and not a.no_publish:
        run.log("bundled content.js and rebuilt dummies_p1.html: " + ", ".join(bundle()))
    run.save("summary.json", {"run": run.id, "results": [{k: v for k, v in r.items() if k != "content"} for r in results],
                              "calls": run.calls})
    return 0 if all(r.get("ok") for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
