#!/usr/bin/env python3
"""DUMMIES dynamic content pipeline (ELVTR Assignment #4; retargeted to the P3.3 prototype for Submission 4).

Knowledge base (V29 Design + GDD edits) -> BM25 retrieval -> Generator agent -> validators
-> Critic agent -> repair loop -> published content the prototype reads.

Targets:
  p3 (default)  the current prototype, prototypes/p3 (P3.3). Types: citybarks, places, drops.
                KB: content/kb/manifest_p3.json (V29 + GDD Edits 37–44, decision log, fleet canon).
  p2            the Assignment 4 build, prototypes/p2 (P2.1). Types: juice, interface, graphics, barks, hits, terminal.

  index      chunk the KB at its ## / ### headings                   (rag.py)
  retrieve   BM25, several focused queries per content type          (specs/<type>.json)
  generate   headless Claude, no tools, cites the chunks it used     (agents/generator.md)
  validate   deterministic canon checks                              (checks.py)
  critique   independent headless Claude with its own retrieval      (agents/critic.md)
  repair     generator applies validator + critic fixes, max 2 rounds
  publish    prototypes/p2/content/<type>.json, content.js, rebuilt dummies_p2.html, GDD edit in content/out/

Usage:
  python content/pipeline.py                          P3.3 types: citybarks, places, drops
  python content/pipeline.py --target p2              P2.1 types: barks, hits, terminal
  python content/pipeline.py --query "drop roof"      show what retrieval returns, no model calls
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
import kb_build  # noqa: E402
import rag  # noqa: E402
import registry  # noqa: E402

TARGETS = {
    "p2": {"dir": ROOT / "prototypes" / "p2", "types": ["juice", "interface", "graphics", "barks", "hits", "terminal"],
           "default": ["barks", "hits", "terminal"], "manifest": "manifest.json", "agents": "",
           "edit_no": {"juice": 31, "interface": 32, "graphics": 33, "barks": 34, "hits": 35, "terminal": 36}},
    "p3": {"dir": ROOT / "prototypes" / "p3", "types": ["citybarks", "places", "drops"],
           "bundle": ["juice", "interface", "graphics", "barks", "hits", "terminal", "places", "drops"],
           "default": ["citybarks", "places", "drops"], "manifest": "manifest_p3.json", "agents": "p3/",
           "edit_no": {"citybarks": 45, "places": 46, "drops": 47}},
}
T = TARGETS["p3"]


def use_target(name):
    global T, P2, OUT_CONTENT, TYPES, EDIT_NO
    T = TARGETS[name]
    P2 = T["dir"]   # the consumer prototype (name kept from the P2 build)
    OUT_CONTENT = P2 / "content"
    TYPES = T["types"]
    EDIT_NO = T["edit_no"]


use_target("p3")
FLEET_DB = ROOT / "content" / "db" / "fleet.json"
MAX_REPAIRS = 2
CALL_TIMEOUT_S = 1500
MODEL = os.environ.get("CONTENT_MODEL")
CLAUDE = shutil.which("claude") or "claude"

# Registry IDs shown to the generator, per type (the full registry is used by the validators).
REG_PREFIXES = {
    "juice": ("feedback.", "damage.bodyHealth", "proto.recoil", "proto.art.", "props.cone.radius", "body.radius",
              "vehicles.sedan.height", "vehicles.van.height", "battery.capacity", "movement.lungeDuration",
              "movement.lungeRecovery", "proto.honkSeconds", "proto.droneLiftSeconds"),
    "interface": ("proto.standoffDistance", "proto.learn.", "proto.scale.unitsPerMetre", "proto.honkSeconds",
                  "proto.driver.patienceSeconds", "proto.health.", "proto.quota.", "ui.type", "feedback."),
    "graphics": ("vehicles.", "body.radius", "world.", "ui.type", "proto.shoulderWidth", "proto.art.", "props.cone.radius"),
    "barks": ("proto.scale.unitsPerMetre", "body.radius", "vehicles.sedan.", "vehicles.van.", "movement.lunge", "ui.type",
              "proto.standoffDistance", "proto.honkSeconds", "perception.sideRadius", "proto.driver.patienceSeconds", "feedback."),
    "hits": ("feedback.", "damage.bodyHealth", "damage.referenceSpeed", "proto.recoil", "proto.dummyStrikeSpeed", "body.radius",
             "movement.lunge", "battery.capacity", "proto.art.", "vehicles.sedan.cruiseSpeed", "vehicles.van.cruiseSpeed",
             "proto.scale.unitsPerMetre", "proto.restitution"),
    "terminal": ("ui.", "world.", "body.radius", "vehicles.sedan.", "vehicles.van.", "battery.", "movement.", "damage.",
                 "proto.quota.", "proto.health.", "traffic.", "perception.", "sensing.", "feedback."),
    "citybarks": ("proto.barks.", "world.deckHeight", "world.highHeight", "damage.dropSpeed", "world.dropSeconds", "damage.plateMultiplier"),
    "places": ("world.district.", "world.deckHeight", "world.highHeight", "world.dropSeconds"),
    "drops": ("proto.hits.", "proto.juice.", "feedback.", "damage.dropSpeed", "damage.bodyHealth", "world.dropSeconds", "world.deckHeight",
              "world.highHeight", "body.radius", "proto.art.extrusion", "movement.lungeRecovery", "proto.recoil"),
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
    system = (HERE / "agents" / (T["agents"] + prompt_file)).read_text(encoding="utf-8")
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
    kb = HERE / "kb"
    if T is TARGETS["p3"]:
        kb_build.fleet_md()   # FLEET is regenerated from content/db/fleet.json every run (pipeline lines excluded)
    man, chunks = rag.load_kb(ROOT, kb / T["manifest"])
    if T is TARGETS["p3"]:
        return {
            "manifest": man, "chunks": chunks, "index": rag.Index(chunks), "kb_ids": {c["id"] for c in chunks},
            "registry": registry.registry_p3(), "palette": registry.palette(kb), "levels": registry.districts_p3(),
            "sim_events": registry.SIM_EVENTS_P3, "event_fields": registry.event_fields_p3,
            "fleet": json.loads(FLEET_DB.read_text(encoding="utf-8")),
        }
    return {
        "manifest": man, "chunks": chunks, "index": rag.Index(chunks), "kb_ids": {c["id"] for c in chunks},
        "registry": registry.registry(kb), "palette": registry.palette(kb), "levels": registry.levels(),
        "sim_events": registry.SIM_EVENTS, "event_fields": registry.event_fields,
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
    if kind in ("citybarks", "places", "drops"):
        return game_data_p3(kind, ctx)
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


def game_data_p3(kind, ctx):
    reg, facts, fleet = ctx["registry"], ctx["levels"], ctx["fleet"]
    pre = REG_PREFIXES[kind]
    L = ["Registry IDs you may reference (value, unit):"]
    L += [f"- {k} = {reg[k]['value']:g} {reg[k].get('unit', '')}".rstrip() for k in sorted(reg) if k.startswith(pre)]
    L += ["", "Districts in run order (sim.js, tables.districts):"]
    for did, f in facts.items():
        L.append(f"- {did}: {f['name']} — focal {f['focal']}; quota {f['quota']:g}; highways {f['decks']:g} (Z2: {f['highDecks']:g}); "
                 f"current placeholder blurb: \"{f['blurb']}\"")
    if kind == "places":
        L += ["", "Per screen, what the three baked layouts have: 'all' (every layout), 'some', 'none'. A name may promise only 'all'.",
              "| District | Cell | River edge | Landmark | Any highway | Low highway (Z1) | High highway (Z2) | Checkpoint | Platform roofs | Skybridge | Start |",
              "|---|---|---|---|---|---|---|---|---|---|---|"]
        for did, f in facts.items():
            for cell, c in f["cells"].items():
                L.append(f"| {did} | {cell} | {'yes' if c['river'] else 'no'} | {c['landmark'] or '-'} | {c['highway']} | {c['lowHighway']} | {c['highHighway']} | "
                         f"{c['checkpoint']} | {c['roofs']} | {c['skybridge']} | {'yes' if c['start'] else ''} |")
        L += ["", "Placeholders being replaced (game.js): screen toast '<cell> · ' + one of Start screen, Pillars, Barrier run, Open street, "
              "Lantern monument, Fountain square, Roundabout, FARSIGHT Tower, Test plates. Level toasts: 'Low highway: traffic up here. A broken "
              "parapet drops you to the road.' / 'High highway: fast traffic. A broken parapet is a long drop to the street.' / 'Roof: no traffic "
              "up here. Step off a ledge to drop on a car below.'"]
    if kind == "citybarks":
        run = [m for m in fleet["models"] if m["simIds"]]
        L += ["", "Models running in the P3 city: " + "; ".join(f"{m['id']} ({m['tag']}, {m['line']}, callsign {m['callsign']}, tier {m['tier']}, {m['class']}, job: {m['job']})" for m in run) + ".",
              "Fields a line may test (fleet.json): " + "; ".join(f"{ev}: {', '.join(fleet['events'][ev])}" for ev in ("impact", "writeoff")) + "; shared context: " + ", ".join(fleet["context"]) + ".",
              "Where each situation can happen: drop from a roof — every district (roofs are Z2); drop from a highway parapet — Interchange (Z1, Z2), CBD (Z1, Z2), Campus (Z1); "
              "hit on a highway deck — the same three; plate — Campus only, ground roads. Never drop onto highway traffic.",
              f"Existing pipeline lines are replaced on publish. The fleet bank holds {len(fleet['barks'])} lines; do not repeat one."]
    if kind == "drops":
        try:
            ch = json.loads((OUT_CONTENT / "hits.json").read_text(encoding="utf-8"))
            L += ["", "Published hit layers these stack on (prototypes/p3/content/hits.json): " + "; ".join(
                f"{x['event']} {json.dumps(x.get('when') or {})}: " + ", ".join(k for k in ("shake", "zoom", "flash", "crumple", "stumble", "ring", "rays", "popup", "streaks", "sound") if x.get(k))
                for x in ch["layers"]) + "."]
        except (OSError, KeyError, ValueError):
            pass
        L += ["", "Palette roles (DESIGN#D10.2):"] + [f"- {r}: {v['hex']} — {v['use']}" for r, v in ctx["palette"].items()]
    return "\n".join(L)


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
        allowed["event_fields"] = {e: ctx["event_fields"](e) for e in allowed["events"]}
    extra = brief_extras(spec)
    return "\n".join([
        f"# BRIEF — {spec['title']}", f"Content type: {kind}. Parameter prefix for new IDs: {spec['param_prefix']}",
        "\n## The gap (what the game is thin on)", *[f"- {g}" for g in spec["gap"]],
        "\n## Deliverable", *[f"- {g}" for g in spec["deliverable"]],
        "\n## JSON schema", "```", *spec["schema"], "```",
        "\n## Consumer contract (what the renderer can draw)", *[f"- {g}" for g in spec["consumer"]],
        "\n## Allowed values", "```json", json.dumps(allowed, indent=1, ensure_ascii=False), "```", *extra,
        "\n## Game data", game_data(kind, ctx), published_context(kind),
    ])


def published_context(kind):
    """What earlier published content this type sits beside (read from prototypes/p2/content)."""
    out = []
    try:
        if kind == "terminal":
            ci = json.loads((OUT_CONTENT / "interface.json").read_text(encoding="utf-8"))
            fr = ci.get("copy", {}).get("frame", {})
            out.append(f"\nPublished interface content: district line '{fr.get('district')}' / '{fr.get('districtZh')}' prints under the lockup. "
                       "HUD module titles: " + ", ".join(f"{m['module']} ({m.get('zh', '')})" for s in ("left", "right") for m in ci["hud"][s]) + ".")
        if kind == "barks":
            cg = json.loads((OUT_CONTENT / "graphics.json").read_text(encoding="utf-8"))
            out.append("\nPublished graphics content: vehicle jobs " + "; ".join(f"{k}: {v.get('job')}" for k, v in cg.get("vehicles", {}).items()) + ".")
    except (OSError, KeyError, ValueError):
        pass
    return "\n".join(out)


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
                           *(["\n## Game data", game_data(kind, ctx)] if spec.get("target") == "p3" else []),
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
    for k in ("event", "module", "cue", "job", "label", "text", "note", "meaning", "reference", "product", "tagline", "eyebrow"):
        if isinstance(it.get(k), str):
            parts.append(it[k])
    if it.get("when"):
        parts.insert(1, json.dumps(it["when"], ensure_ascii=False))
    if it.get("style"):
        parts.insert(1, it["style"])
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
                    "kb": [d["id"] for d in json.loads((HERE / "kb" / T["manifest"]).read_text())["docs"]],
                    "generated": datetime.datetime.now().isoformat(timespec="seconds")}
    if kind == "citybarks":   # the fleet database is where barks live (decision 117): replace the pipeline's lines, keep the rest
        db = json.loads(FLEET_DB.read_text(encoding="utf-8"))
        keep = [b for b in db["barks"] if not re.match(r"^c\d+$", b["id"])]
        db["barks"] = keep + [dict({k: ln[k] for k in ("id", "event", "when", "style", "priority", "text", "claims")},
                                   sources=ln.get("sources", []), source=f"content/pipeline.py run {run_id}") for ln in content["lines"]]
        db["meta"]["generated"] = {"citybarks": run_id}
        FLEET_DB.write_text(json.dumps(db, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    else:
        (OUT_CONTENT / f"{kind}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    (HERE / "out" / f"DUMMIES_GDD_Edit{EDIT_NO[kind]}_{kind.capitalize()}.md").write_text(gdd_edit(kind, data), encoding="utf-8")


def bundle():
    merged = {}
    for k in T.get("bundle", TYPES):
        p = OUT_CONTENT / f"{k}.json"
        if p.exists():
            merged[k] = json.loads(p.read_text(encoding="utf-8"))
    js = (f"/* Generated by content/pipeline.py from {P2.relative_to(ROOT).as_posix()}/content/*.json. Do not edit by hand. */\n"
          "window.DUMMIES_CONTENT = " + json.dumps(merged, ensure_ascii=False, separators=(",", ":")) + ";\n")
    (P2 / "content.js").write_text(js, encoding="utf-8")
    subprocess.run([sys.executable, str(P2 / "build.py")], check=True)
    return list(merged)


def gdd_edit(kind, d):
    m = d["meta"]
    L = [f"# DUMMIES — GDD Edit {EDIT_NO[kind]}: Generated {kind.capitalize()}", "",
         f"**Generated · {m['generated'][:10]} · run `{m['run']}` · Proposed**", "",
         "- **Parent:** [Design](../kb/DUMMIES_V29_Design.md). Consumer: `" + ("content/db/fleet.json" if kind == "citybarks" else P2.relative_to(ROOT).as_posix() + "/content/" + kind + ".json") + "`.",
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
    elif kind == "barks":
        L += ["## Bark bank", "", "| Event | When | Style | Priority | Line | Sources |", "|---|---|---|---:|---|---|"]
        for b in d.get("lines", []):
            L.append(f"| `{b.get('event')}` | {short(json.dumps(b.get('when') or {}, ensure_ascii=False), 60)} | {b.get('style')} | {b.get('priority')} | "
                     f"{short(b.get('text', ''), 90)} | {', '.join(b.get('sources', []))} |")
    elif kind == "hits":
        L += [f"- **Hit pause:** `{d.get('hitStop')}` (simulation, unchanged). **Reduced motion:** `{d.get('reducedMotion')}`.", "",
              "## Layers", "", "| Event | When | Response | Reference | Sources |", "|---|---|---|---|---|"]
        for e in d.get("layers", []):
            resp = [k for k in ("shake", "zoom", "flash", "crumple", "stumble", "ring", "rays", "popup", "streaks") if e.get(k)]
            resp += [f"{p.get('type')} ×`{p.get('count') if isinstance(p.get('count'), str) else '/'.join(p.get('count') or [])}` at {p.get('at', 'dummy')}" for p in e.get("particles") or []]
            if e.get("sound"):
                resp.append(f"{e['sound'].get('type')} sound")
            L.append(f"| `{e.get('event')}` | {short(json.dumps(e.get('when') or {}, ensure_ascii=False), 50)} | {short(', '.join(resp), 160)} | "
                     f"{short(e.get('reference', ''), 70)} | {', '.join(e.get('sources', []))} |")
    elif kind == "terminal":
        hd, pn, sg, ti = d.get("header") or {}, d.get("panels") or {}, d.get("signage") or {}, d.get("title") or {}
        L += ["## Header", "", f"- **Lockup:** FARSIGHT · {hd.get('product')} · {hd.get('productZh')} ({hd.get('review')}).",
              f"- **Tagline:** {hd.get('tagline')}", f"- **Badges:** {' · '.join(hd.get('badges') or [])}", "",
              "## Panels", "", "- " + "; ".join(f"{k} `{v}`" for k, v in pn.items() if k != "sources"), "",
              "## Icons", "", "| Module | Shapes |", "|---|---:|"]
        L += [f"| {m} | {len(v)} |" for m, v in (d.get("icons") or {}).items() if m != "sources"]
        L += ["", "## Texture", "", "- **Diagnostics:** " + ", ".join(f"`{x}`" for x in (d.get("texture") or {}).get("diagnostics", [])), "",
              "## Signage", "", "| EN | 中文 (review) |", "|---|---|"]
        L += [f"| {short(s.get('text', ''), 90)} | {s.get('zh', '')} |" for s in sg.get("lines", []) if isinstance(s, dict)]
        L += ["", "## Title screen", "", f"- **Eyebrow:** {ti.get('eyebrow')}"] + [f"- **Line {i + 1}:** {x}" for i, x in enumerate(ti.get("lines") or [])] + \
             [f"- **Start:** {ti.get('start')}"] + [f"- **{k}:** {v}" for k, v in (ti.get("difficulty") or {}).items()]
    if kind == "citybarks":
        L += ["## City lines (merged into content/db/fleet.json)", "", "| Id | Event | When | Style | Priority | Line | Claims | Sources |", "|---|---|---|---|---:|---|---|---|"]
        for b in d.get("lines", []):
            L.append(f"| {b.get('id')} | `{b.get('event')}` | {short(json.dumps(b.get('when') or {}, ensure_ascii=False), 60)} | {b.get('style')} | {b.get('priority')} | "
                     f"{short(b.get('text', ''), 60)} | {', '.join(b.get('claims') or [])} | {', '.join(b.get('sources', []))} |")
    elif kind == "places":
        for did, x in (d.get("districts") or {}).items():
            L += [f"## {did}", "", f"- **Intro:** {x.get('intro')}", f"- **Sources:** {', '.join(x.get('sources') or [])}", "",
                  "| | A | B | C |", "|---|---|---|---|"]
            sc = x.get("screens") or {}
            L += [f"| {r} | {sc.get('A' + r, '')} | {sc.get('B' + r, '')} | {sc.get('C' + r, '')} |" for r in "123"]
            L.append("")
        lv = d.get("levels") or {}
        L += ["## Level toasts", ""] + [f"- **{k}:** {v}" for k, v in lv.items() if k != "sources"] + [f"- **Sources:** {', '.join(lv.get('sources') or [])}"]
    elif kind == "drops":
        L += ["## Layers (stacked on hits.json)", "", "| Event | When | Response | Reference | Sources |", "|---|---|---|---|---|"]
        for e in d.get("layers", []):
            resp = [k for k in ("shake", "zoom", "flash", "crumple", "stumble", "ring", "rays", "popup", "streaks") if e.get(k)]
            resp += [f"{p.get('type')} at {p.get('at', 'dummy')}" for p in e.get("particles") or []]
            if e.get("sound"):
                resp.append(f"{e['sound'].get('type')} sound")
            if e.get("scale"):
                resp.append(f"scaled by {e['scale'].get('by')} / `{e['scale'].get('full')}`")
            L.append(f"| `{e.get('event')}` | {short(json.dumps(e.get('when') or {}, ensure_ascii=False), 40)} | {short(', '.join(resp), 160)} | "
                     f"{short(e.get('reference', ''), 70)} | {', '.join(e.get('sources', []))} |")
    return "\n".join(L) + "\n"


def published(kind):
    if kind == "citybarks":
        lines = [b for b in json.loads(FLEET_DB.read_text(encoding="utf-8"))["barks"] if re.match(r"^c\d+$", b["id"])]
        return {"lines": lines} if lines else None
    p = OUT_CONTENT / f"{kind}.json"
    if not p.exists():
        return None
    content = json.loads(p.read_text(encoding="utf-8"))
    content.pop("meta", None)
    return content


def check_published(ctx):
    bad = 0
    for kind in TYPES:
        content = published(kind)
        if content is None:
            print(f"{kind}: not published")
            continue
        spec = load_spec(kind)
        cited = {s for _, it in checks.walk(content) if isinstance(it, dict) for s in (it.get("sources") or []) if isinstance(it.get("sources"), list)}
        iss = checks.validate(kind, content, dict(ctx, spec=spec, retrieved_ids=cited & ctx["kb_ids"]))
        blocks = [i for i in iss if i["severity"] == "block"]
        bad += len(blocks)
        print(f"{kind}: {len(iss)} validator issue(s), {len(blocks)} blocking")
        for i in iss:
            print(f"  {i['id']} [{i['kind']}/{i['severity']}] {i['path']}: {i['found']} — {i['rule']}")
    if T is TARGETS["p3"]:
        lore = subprocess.run([sys.executable, str(HERE / "db" / "check_lore.py")], capture_output=True, text=True)
        print("check_lore.py:", lore.stdout.strip().splitlines()[-1])
        bad += lore.returncode
    print("content.js types:", bundle())
    return bad


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--target", default="p3", choices=sorted(TARGETS))
    ap.add_argument("--type")
    ap.add_argument("--query")
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--no-publish", action="store_true")
    ap.add_argument("--max-repairs", type=int, default=MAX_REPAIRS)
    ap.add_argument("--publish-run", metavar="RUN_ID", help="publish accepted content from a --no-publish run after review")
    a = ap.parse_args()
    use_target(a.target)
    a.type = a.type or ",".join(T["default"])
    ctx = load_context()
    if a.query:
        for c, s in ctx["index"].search(a.query, k=5):
            print(f"{s:7.2f}  {c['id']:32s} {c['title'][:60]}\n         {rag.best_sentence(c['text'], a.query)}")
        return 0
    if a.check:
        return 1 if check_published(ctx) else 0
    if a.publish_run:
        rd = HERE / "runs" / a.publish_run
        done = {r["type"]: r for r in json.loads((rd / "summary.json").read_text())["results"]}
        for k in [k.strip() for k in a.type.split(",") if k.strip()]:
            if not (done.get(k) or {}).get("ok"):
                print(f"{k}: not accepted in run {a.publish_run}; not published")
                continue
            publish(k, json.loads((rd / k / "final.json").read_text(encoding="utf-8")), a.publish_run)
            print(f"{k}: published from run {a.publish_run}")
        print("content.js types:", bundle())
        return 0
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
            run.log(f"{k}: published ({'content/db/fleet.json' if k == 'citybarks' else P2.relative_to(ROOT).as_posix() + '/content/' + k + '.json'}) and content/out/")
    if any(r.get("ok") for r in results) and not a.no_publish:
        run.log(f"bundled content.js and rebuilt {P2.name}: " + ", ".join(bundle()))
    run.save("summary.json", {"run": run.id, "results": [{k: v for k, v in r.items() if k != "content"} for r in results],
                              "calls": run.calls})
    return 0 if all(r.get("ok") for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
