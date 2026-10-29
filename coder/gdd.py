"""Read the GDD: chunks, precedence, decisions, and requirement candidates.

The GDD is the set of docs in coder/gdd/manifest.json. A higher rank wins (newest edit first).
Chunking and BM25 come from Assignment 4's retriever (content/rag.py).

Requirement candidates are the statements the GDD itself marks as not yet built, plus a few it marks as
built (a baseline the gap detector must find present):
  proposed  a bullet marked "proposed" with a D-item           (e.g. Edit 92 §3.2, the finale)
  gap       a bullet under a "Known gaps" heading               (the current build's own list)
  open      a bullet under an "Open" heading                    (each edit's open items)
  built     a bullet marked "(built" in the newest edits        (baseline: must probe present)
Decisions come from DECISIONS.md, "Open decisions": a D-item is closed only when its notes say so.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "content"))
import rag  # noqa: E402  (Assignment 4: chunker + BM25)

MANIFEST = ROOT / "coder" / "gdd" / "manifest.json"
CLOSED = re.compile(r"\*\*(closed|decided|superseded)\b", re.I)
DREF = re.compile(r"\bD(\d{1,3})\b")


def manifest():
    return json.loads(MANIFEST.read_text(encoding="utf-8"))


def load():
    """Chunks of every GDD doc, each tagged with its doc's rank. Returns (manifest, chunks, index)."""
    man = manifest()
    chunks = []
    for d in man["docs"]:
        text = (ROOT / d["path"]).read_text(encoding="utf-8")
        for c in rag.chunk_markdown(d["id"], text):
            c["rank"], c["kind"], c["path"] = d["rank"], d["kind"], d["path"]
            chunks.append(c)
    return man, chunks, rag.Index(chunks)


def fingerprint():
    """A hash of everything the requirements are extracted from: the GDD docs and the decision log."""
    man, h = manifest(), hashlib.sha256()
    for p in [d["path"] for d in man["docs"]] + [man["decisions"]]:
        h.update((ROOT / p).read_bytes())
    return h.hexdigest()[:16]


# ---------- decisions
def decisions():
    """D-items from DECISIONS.md's "Open decisions" table: {D76: {id, text, options, notes, open}}."""
    text = (ROOT / manifest()["decisions"]).read_text(encoding="utf-8")
    out, on = {}, False
    for ln in text.splitlines():
        if ln.startswith("## "):
            on = ln.lower().startswith("## open decisions")
            continue
        m = re.match(r"^\| (D\d+) \| (.*) \|\s*$", ln)
        if on and m:
            cells = [c.strip() for c in m.group(2).split(" | ")]
            text_, options, notes = (cells + ["", "", ""])[:3]
            out[m.group(1)] = {"id": m.group(1), "text": text_, "options": options, "notes": notes,
                               "open": not CLOSED.search(notes)}
    return out


def decision_rows(ids):
    """Rows of the main decision table that a D-item's notes cite (e.g. 'row 533'), for the scope a closure settled."""
    text = (ROOT / manifest()["decisions"]).read_text(encoding="utf-8")
    rows = {}
    for ln in text.splitlines():
        m = re.match(r"^\| (\d+) \| ", ln)
        if m and int(m.group(1)) in ids:
            rows[int(m.group(1))] = ln
    return rows


# ---------- requirement candidates
def _bullets(chunk_text):
    """Top-level bullets with their sub-bullets: [(heading_path, text)]. Code fences are read too (the GDD's spec blocks)."""
    out, cur, head = [], None, ""
    for ln in chunk_text.splitlines():
        if ln.startswith("#"):
            head = ln.lstrip("#").strip()
            continue
        if ln.strip().startswith("```"):
            continue
        m = re.match(r"^(\s*)- (.*)$", ln)
        if m and len(m.group(1)) == 0:
            if cur:
                out.append(cur)
            cur = [head, m.group(2)]
        elif m and cur:
            cur[1] += "\n  - " + m.group(2)
        elif cur and ln.strip() and not ln.startswith("|"):
            cur[1] += " " + ln.strip()
        else:
            if cur:
                out.append(cur)
            cur = None
    if cur:
        out.append(cur)
    return [(h, t) for h, t in out]


def candidates(chunks):
    """Statements the GDD marks as unbuilt (proposed, known gap, open) or built (baseline), newest first."""
    out, seen = [], set()
    for c in sorted(chunks, key=lambda q: -q["rank"]):
        title = c["title"].lower()
        for n, (head, text) in enumerate(_bullets(c["text"])):
            low, kind = text.lower(), None
            if title.startswith("known gaps"):
                kind = "gap"
            elif title == "open":
                kind = "open"
            elif "proposed" in low and DREF.search(text):
                kind = "proposed"
            elif "(built" in low and c["rank"] >= 92:
                kind = "built"
            if not kind:
                continue
            key = re.sub(r"\W+", " ", low)[:90]
            if key in seen:
                continue
            seen.add(key)
            out.append({"cid": f"{c['id']}:{n}", "chunk": c["id"], "rank": c["rank"], "kind": kind,
                        "text": text.strip(), "d_items": sorted(set("D" + d for d in DREF.findall(text)))})
    return out


if __name__ == "__main__":
    man, chunks, idx = load()
    cs = candidates(chunks)
    ds = decisions()
    print(f"{len(chunks)} chunks; {len(cs)} candidates; {sum(d['open'] for d in ds.values())} open D-items of {len(ds)}")
    for q in cs:
        print(f"- [{q['kind']}] {q['cid']} {q['d_items']}: {q['text'][:150]!r}")
    print("open:", [k for k, v in ds.items() if v["open"]])
