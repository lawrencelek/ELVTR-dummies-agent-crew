#!/usr/bin/env python3
"""Knowledge base for the Style Guide Agent (Assignment 6).

Writes three pages from live data, then lists every doc in style/kb/manifest.json:
  style/kb/DUMMIES_Story_Canon.md   from content/story/story.json (acts, briefs, the 27 tiles, the ending)
  style/kb/DUMMIES_Fleet_Canon.md   from content/db/fleet.json (content/kb_build.fleet_md, pointed here)
  style/kb/DUMMIES_DECISIONS.md     from DECISIONS.md, a heading every ten rows (content/kb_build.decisions_with_headings)

  python3 style/style_kb.py            # rebuild the pages; print the chunk count per doc
"""
import importlib.util
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KB = ROOT / "style" / "kb"
sys.path.insert(0, str(ROOT / "content"))
import rag               # noqa: E402  (Assignment 4)
_spec = importlib.util.spec_from_file_location("kb_build_p3", ROOT / "content" / "kb_build.py")
kb4 = importlib.util.module_from_spec(_spec)   # Assignment 4's kb_build, loaded by path
_spec.loader.exec_module(kb4)

DOCS = [
    {"id": "EDIT94", "path": "coder/gdd/DUMMIES_GDD_Edit94_Prototype_7_13_Finale_Coding_Agent.md", "title": "GDD Edit 94: P7.13 finale; R-BARK-TILE rejected"},
    {"id": "EDIT93", "path": "coder/gdd/DUMMIES_GDD_Edit93_Prototype_7_12_Introduce_Then_Test.md", "title": "GDD Edit 93: introduce, then test; tales rewritten"},
    {"id": "EDIT92", "path": "coder/gdd/DUMMIES_GDD_Edit92_Prototype_7_11_Narrative_A_Certified_Tile_Art.md", "title": "GDD Edit 92: Narrative A, Certified; Farsight's voice; the 27 tiles"},
    {"id": "STORY", "path": "style/kb/DUMMIES_Story_Canon.md", "title": "Story canon (generated from content/story/story.json)"},
    {"id": "FLEET", "path": "style/kb/DUMMIES_Fleet_Canon.md", "title": "Fleet canon (generated from content/db/fleet.json)"},
    {"id": "EDIT39", "path": "content/kb/p3/DUMMIES_GDD_Edit39_Canon_Lore_City.md", "title": "GDD Edit 39: canon, lore system, bark bubbles"},
    {"id": "DESIGN", "path": "content/kb/DUMMIES_V29_Design.md", "title": "V29 Design, the GDD of record"},
    {"id": "EDIT26", "path": "content/kb/DUMMIES_GDD_Edit26.md", "title": "GDD Edit 26: fiction, voice, bark key"},
    {"id": "FSG", "path": "style/kb/DUMMIES_FARSIGHT_Style_Guide.md", "title": "FARSIGHT Style Guide: canon rules, field text"},
    {"id": "SUB4", "path": "style/kb/DUMMIES_Submission4_Precedents.md", "title": "Submission 4 precedents: off-brand lines and fixes"},
    {"id": "DECISIONS", "path": "style/kb/DUMMIES_DECISIONS.md", "title": "Decision log (live DECISIONS.md, headings every ten rows)"},
]
PRECEDENCE = "Newest wins: EDIT94 > EDIT93 > EDIT92 > STORY (story.json, Edit 93) > FLEET (fleet.json) > EDIT39 > DESIGN (V29) > EDIT26. DECISIONS rows record rulings; a user-decided row beats any doc."
DIST_CODE = {"monument": "M", "parkland": "P", "waterfront": "W"}
NODE_NAME = {"battery": "Battery", "legs": "Legs", "hands": "Hands", "arms": "Arms"}


SELF_ROWS = range(543, 547)   # rows about this agent and its results; kept out so a run never cites its own output (as Assignment 4's PIPELINE_ID)


def own_row(line):
    import re
    m = re.match(r"^\|\s*(\d+)\s*\|", line)
    return bool(m) and int(m.group(1)) in SELF_ROWS


def write(path, text):
    """Atomic and idempotent: parallel runs never read a half-written page."""
    path = Path(path)
    if path.exists() and path.read_text(encoding="utf-8") == text:
        return
    tmp = path.with_suffix(path.suffix + f".{__import__('os').getpid()}.tmp")
    tmp.write_text(text, encoding="utf-8")
    tmp.replace(path)


def node_name(node):
    for k, v in NODE_NAME.items():
        if node.startswith(k):
            return f"{v} {node[len(k):]}"
    return node


def task_text(tasks, classes, task):
    t = tasks[task["kind"]]
    label, brief = t["label"], t["brief"]
    if task["kind"] == "cls":
        c = classes[task["cls"]]
        label, brief = label.replace("{cls}", c[0]), brief.replace("{clsLong}", c[1]).replace("{cls}", c[0].lower())
    if task.get("param"):
        label, brief = label + f" ({{n}} = {task['param']})", brief + f" ({{n}} = {task['param']})"
    return label, brief


def story_md(root=ROOT):
    s = json.loads((Path(root) / "content" / "story" / "story.json").read_text(encoding="utf-8"))
    m = s["meta"]
    L = ["# Story canon", "", f"Generated from `content/story/story.json` ({m['version']}). The JSON is the source; edit it, not this page.", "",
         "## S1 Story rules", ""] + [f"- {r}" for r in m["rules"]]
    L += ["", "## S2 Acts", "", "| District | Act | Act line (intro) | Order |", "|---|---|---|---|"]
    L += [f"| {d['name']} | {d['act']} | {d['intro']} | {' → '.join(d['order'])} |" for d in s["districts"]]
    L += ["", "## S3 Briefs", "", "A brief is a caps label, then \"Coverage gap: …. The final hit must ….\". Figures are placeholders bound to registry IDs ({n}).", "",
          "| Kind | Label | Brief |", "|---|---|---|"]
    L += [f"| {k} | {v['label']} | {v['brief']} |" for k, v in s["tasks"].items()]
    L += ["", "## S5 Ending", "", f"- CERTIFIED: {s['ending']}"]
    for d in s["districts"]:
        L += ["", f"## S4{DIST_CODE[d['id']]} {d['name']} tiles ({d['act']})", ""]
        for i, tile in enumerate(d["order"]):
            t = d["tiles"][tile]
            label, brief = task_text(s["tasks"], s["classes"], t["task"])
            gift = node_name(t["gift"]["node"]) if t.get("gift") else "none"
            L += [f"### {DIST_CODE[d['id']]}{tile} {d['name']} {tile} · {t['title']}", "",
                  f"- **Tile:** {d['name']} {tile}, {i + 1} of {len(d['order'])} in the act's order. Act: {d['act']}.",
                  f"- **Title (its landmark):** {t['title']}.",
                  f"- **Brief:** {label}. {brief}",
                  f"- **Equipment issued here:** {gift}.",
                  f"- **Tale:** {t['tale']}", ""]
    KB.mkdir(parents=True, exist_ok=True)
    write(KB / "DUMMIES_Story_Canon.md", "\n".join(L) + "\n")


def build():
    story_md()
    tmp = KB / f".fleet.{__import__('os').getpid()}"
    tmp.mkdir(exist_ok=True)
    kb4.KB3 = tmp                     # write the FLEET page here, not into Assignment 4's snapshot
    kb4.fleet_md(ROOT)
    write(KB / "DUMMIES_Fleet_Canon.md", (tmp / "DUMMIES_Fleet_Canon.md").read_text(encoding="utf-8"))
    (tmp / "DUMMIES_Fleet_Canon.md").unlink()
    tmp.rmdir()
    log = "\n".join(ln for ln in (ROOT / "DECISIONS.md").read_text(encoding="utf-8").splitlines() if not own_row(ln))
    write(KB / "DUMMIES_DECISIONS.md", kb4.decisions_with_headings(log))
    man = {"note": "Knowledge base of the Style Guide Agent. Paths are relative to the repository root. " + PRECEDENCE, "docs": DOCS}
    write(KB / "manifest.json", json.dumps(man, indent=1, ensure_ascii=False) + "\n")
    return man


if __name__ == "__main__":
    man = build()
    _, chunks = rag.load_kb(ROOT, KB / "manifest.json")
    for d in man["docs"]:
        print(f"{d['id']:10} {sum(1 for c in chunks if c['doc'] == d['id']):4} chunks  {d['path']}")
    print(f"{len(chunks)} chunks")
