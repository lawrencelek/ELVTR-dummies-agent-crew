"""The code-writing step: give the coder agent one requirement and the code it needs; apply its edits under guards.

Context (assembled here, no model):
  the requirement and its probes      the contract the code must meet
  its GDD text and decision rows      the spec, newest rank first
  what earlier writes built           so a later requirement uses their interfaces
  the code                            outlines of the files it touches; the bodies of the symbols it names;
                                      the symbols BM25 retrieval ranks highest for its words (code RAG); story.js in full
Guards (on apply):
  paths       edits only to the game's sources and story.json; new files only in prototypes/p7/; never a test,
              a built page, coder/, the registry file (new IDs come through the REGISTRY block) or a frozen build
  anchors     each FIND must occur exactly once, or the whole write is refused
  lint        node --check on every JS file written; story.json parses; every registry-shaped ID in an added line exists
  rollback    any failure restores every file it wrote
"""
import json
import re
import subprocess
from pathlib import Path

import gdd
import llm
import scan as S

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "content" / "params" / "tuning.parameters.json"
EDITABLE = {"prototypes/p7/story.js", "prototypes/p6/game.js", "prototypes/p6/world6.js", "prototypes/p6/sim.js", "prototypes/p6/pixel.js",
            "prototypes/p7/build.py", "prototypes/p7/shell.html", "content/story/story.json"}
CREATABLE = re.compile(r"^prototypes/p7/[a-z0-9_]+\.js$")
CODE_CAP = 110000


# ---------- context
def gdd_text(r, chunks, idx):
    by_id = {c["id"]: c for c in chunks}
    ids = []
    for s in r.get("sources", []):
        cid = s.split(":")[0] if s.split(":")[0] in by_id else s
        if cid in by_id and cid not in ids:
            ids.append(cid)
    for c, _ in idx.search(r["title"] + " " + r["statement"], k=4):
        if c["id"] not in ids:
            ids.append(c["id"])
    ids.sort(key=lambda i: -by_id[i]["rank"])
    return "\n\n".join(f"### {i} (rank {by_id[i]['rank']})\n{by_id[i]['text']}" for i in ids[:7])


def decision_text(r):
    d = r.get("decision")
    if not d:
        return "None."
    v = gdd.decisions().get(d)
    if not v:
        return d
    rows = gdd.decision_rows({int(x) for x in re.findall(r"rows? (\d+)", v["notes"])})
    return f"{d} ({'open' if v['open'] else 'closed'}): {v['text']}\nNotes: {v['notes']}\n" + "\n".join(rows[k] for k in sorted(rows))


def code_context(r, sc):
    idx = S.index(sc)
    picked, out, n = set(), [], 0
    def add(rel, s, why):
        nonlocal n
        key = (rel, s["line"])
        if key in picked or s["kind"] == "class":
            return
        body = S.excerpt(rel, s["line"], s["end"])
        block = f"#### {rel} · {s['name']} (lines {s['line']}–{s['end']}) · {why}\n```\n{body}\n```"
        if n + len(block) > CODE_CAP:
            return
        picked.add(key); out.append(block); n += len(block)
    for t in r.get("touches", []):  # "symbol" may name several: "renderScreen / handleMenus", "StorySim.step / continueUnveil"
        for name in re.findall(r"[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*", t.get("symbol", "")):
            for rel, s in S.find_symbol(sc, name.split(".")[-1]):
                if rel == t.get("file") or not t.get("file"):
                    add(rel, s, "named by the requirement")
    q = " ".join([r["title"], r["statement"], r.get("contract", "")] + [t.get("symbol", "") for t in r.get("touches", [])])
    for c, score in idx.search(q, k=24):
        rel, rest = c["id"].split("::", 1)
        name, line = rest.rsplit("@", 1)
        s = next((x for x in sc["symbols"].get(rel, []) if x["line"] == int(line) and x["name"] == name), None)
        if s and rel != "prototypes/p7/story.js":
            add(rel, s, f"retrieved ({score})")
    files = sorted({t["file"] for t in r.get("touches", []) if t.get("file", "").endswith(".js")} - {"prototypes/p7/story.js"})
    outlines = "\n\n".join(S.outline(sc, f) for f in files if f in sc["symbols"])
    story = (ROOT / "prototypes/p7/story.js").read_text(encoding="utf-8")
    return ("### Outlines of the files it touches\n```\n" + outlines + "\n```\n\n### prototypes/p7/story.js, in full\n```js\n" + story + "\n```\n\n"
            "### Excerpts\n" + "\n\n".join(out))


def message(r, sc, chunks, idx, built, tag, api):
    req = {k: v for k, v in r.items() if k not in ("calibration",)}
    prev = "\n".join(f"- {b['id']} ({b['title']}): {b['summary']}" for b in built) or "Nothing yet."
    return "\n\n".join([
        f"# Task\nWrite the code for requirement {r['id']}. Release tag for comments: `{tag}`. Output the blocks your system prompt defines.",
        "# The requirement (with its acceptance probes)\n```json\n" + json.dumps(req, indent=1, ensure_ascii=False) + "\n```",
        "# GDD text\n" + gdd_text(r, chunks, idx),
        "# Decision\n" + decision_text(r),
        "# Built earlier by this agent (use their interfaces)\n" + prev,
        "# Probe APIs (how the probes drive the game)\n```\n" + api + "\n```",
        "# The code\n" + code_context(r, sc),
    ])


# ---------- the coder's reply
def parse(text):
    """SUMMARY, EDIT (FIND/REPLACE pairs), CREATE, REGISTRY blocks."""
    out = {"summary": "", "edits": [], "creates": [], "registry": []}
    parts = re.split(r"^=== ", text, flags=re.M)
    for part in parts[1:]:
        head, _, body = part.partition("\n")
        head = head.strip()
        if head == "END":
            break
        if head == "SUMMARY":
            out["summary"] = body.strip()
        elif head.startswith("EDIT "):
            path = head[5:].strip()
            pairs = re.findall(r"^<<<<<<< FIND\n(.*?)\n=======\n(.*?)^>>>>>>> REPLACE$", body, re.S | re.M)
            if not pairs:
                raise ValueError(f"EDIT {path}: no FIND/REPLACE pairs")
            out["edits"] += [{"path": path, "find": f, "replace": rp[:-1] if rp.endswith("\n") else rp} for f, rp in pairs]
        elif head.startswith("CREATE "):
            out["creates"].append({"path": head[7:].strip(), "content": body.rstrip("\n") + "\n"})
        elif head == "REGISTRY":
            b = body.strip()
            b = re.sub(r"^```(?:json)?\s*|\s*```$", "", b)
            out["registry"] = json.loads(b) if b else []
        else:
            raise ValueError(f"unknown block {head!r}")
    if not (out["edits"] or out["creates"]):
        raise ValueError("no edits and no new files")
    return out


# ---------- apply under guards
class Refused(Exception):
    pass


def _added_lines(old, new):
    import difflib
    return [l[1:] for l in difflib.unified_diff(old.splitlines(), new.splitlines(), lineterm="", n=0) if l.startswith("+") and not l.startswith("+++")]


def apply(patch, run_id, tag):
    """Returns (written {path: old text or None}, report). Raises Refused, with every file restored."""
    written, report = {}, {"edits": 0, "creates": [], "registry": [], "lint": []}
    frozen0 = S.frozen()
    try:
        texts = {}
        for e in patch["edits"]:
            p = e["path"]
            if p not in EDITABLE:
                raise Refused(f"edit to {p} is not allowed (editable: {', '.join(sorted(EDITABLE))})")
            if p not in texts:
                texts[p] = (ROOT / p).read_text(encoding="utf-8")
            n = texts[p].count(e["find"])
            if n != 1:
                first = e["find"].splitlines()[0][:100] if e["find"] else ""
                raise Refused(f"{p}: FIND occurs {n} times (must be once): {first!r}")
            texts[p] = texts[p].replace(e["find"], e["replace"], 1)
            report["edits"] += 1
        for c in patch["creates"]:
            p = c["path"]
            if not CREATABLE.match(p):
                raise Refused(f"new file {p} is not allowed (only prototypes/p7/<name>.js)")
            if (ROOT / p).exists():
                raise Refused(f"new file {p} already exists")
            texts[p] = c["content"]; report["creates"].append(p)
        reg = json.loads(REGISTRY.read_text(encoding="utf-8"))
        have = {e["id"] for e in reg["entries"]}
        for e in patch["registry"]:
            for k in ("id", "description", "unit", "type", "default"):
                if k not in e:
                    raise Refused(f"registry entry {e.get('id')}: missing {k}")
            if e["id"] in have:
                raise Refused(f"registry entry {e['id']} already exists")
            reg["entries"].append(reg_entry(e, tag, run_id)); have.add(e["id"]); report["registry"].append(e["id"])
        # lint before writing anything: an ID in new code is in the registry, or one the game already defines
        known = have | S.game_ids()
        prefixes = {i.split(".")[0] for i in known}
        for p, t in texts.items():
            old = (ROOT / p).read_text(encoding="utf-8") if (ROOT / p).exists() else ""
            for line in _added_lines(old, t):
                for m in re.finditer(r"['\"]([a-z]+(?:\.[A-Za-z0-9]+)+)['\"]", line):
                    rid = m.group(1)
                    if rid.split(".")[0] in prefixes and rid not in known and not re.search(r"\.(js|json|html|py|png)$", rid):
                        raise Refused(f"{p}: {rid} is not a registry ID (every number needs one; add it in the REGISTRY block)")
            if p.endswith(".json"):
                try:
                    json.loads(t)
                except ValueError as e:
                    raise Refused(f"{p}: not valid JSON: {e}")
        # write, then check syntax
        for p, t in texts.items():
            f = ROOT / p
            written[p] = f.read_text(encoding="utf-8") if f.exists() else None
            f.write_text(t, encoding="utf-8")
        if patch["registry"]:
            written[str(REGISTRY.relative_to(ROOT))] = REGISTRY.read_text(encoding="utf-8")
            REGISTRY.write_text(json.dumps(reg, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        for p in texts:
            if p.endswith(".js"):
                r = subprocess.run(["node", "--check", str(ROOT / p)], capture_output=True, text=True)
                if r.returncode != 0:
                    raise Refused(f"{p}: syntax error: {(r.stderr or '').strip()[-600:]}")
                report["lint"].append(f"node --check {p}: ok")
        if S.frozen() != frozen0:
            raise Refused("a frozen build changed")
        return written, report
    except Exception:
        rollback(written)
        raise


def reg_entry(e, tag, run_id):
    """A registry entry in the registry's own shape."""
    base = {"editable": True, "protectedReason": None, "integrationStatus": "prototype-p7.13", "boundaryStatus": "proposed-adapter-contract-not-implemented",
            "source": f"{tag}: written by the coding agent (coder/, run {run_id})", "status": "proposed", "group": "Story", "owner": "Systems design",
            "label": e["id"].split(".")[-1], "applyAt": "next-run", "validation": {}, "purpose": ""}
    return {**base, **e}


def rollback(written):
    for p, old in written.items():
        f = ROOT / p
        if old is None:
            f.unlink(missing_ok=True)
        else:
            f.write_text(old, encoding="utf-8")
