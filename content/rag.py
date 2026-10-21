"""Knowledge-base chunking and BM25 retrieval for the DUMMIES content pipeline.

Standard library only. Each markdown doc is split at its ## and ### headings.
A chunk ID is DOC#SECTION, e.g. DESIGN#D10.2, LOG#P1.2/juice, ENG#13.5~2.
"""
import json
import math
import re
from collections import Counter
from pathlib import Path

SKIP_HEADINGS = ("contents", "appendix: section map")   # navigation, not canon
MAX_CHARS = 2600
STOP = set("""a an the and or of to in on for is are be it its as at by with from that this these those into than then
was were has have had will would can could may might must should do does did not but if so such per via each any all
both one two within without about over under after before while when where which who what how""".split())
SECTION_TOKEN = re.compile(r"^((?:[A-Z]{1,3})?\d+(?:\.\d+)*[a-z]?|[A-Z]\d+(?:\.\d+)*)\b")


def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:48]


def tokens(text):
    out = []
    for t in re.findall(r"[a-z0-9]+(?:[.\-][a-z0-9]+)*", text.lower()):
        parts = re.split(r"[.\-]", t) if ("." in t or "-" in t) else []
        for w in [t] + parts:
            if not w or w in STOP or len(w) < 2:
                continue
            if len(w) > 4 and w.endswith("s") and not w.endswith("ss"):
                w = w[:-1]
            out.append(w)
    return out


def chunk_markdown(doc_id, text):
    """Split at ## / ### headings. Returns [{id, doc, title, text}]."""
    lines = text.splitlines()
    chunks, cur, h2_tok, seen = [], None, None, set()

    def close():
        if cur and len("\n".join(cur["lines"]).strip()) > 60:
            body = "\n".join(cur["lines"]).strip()
            parts, buf = [], ""
            for para in re.split(r"\n(?=\n)", body):
                if len(buf) + len(para) > MAX_CHARS and buf:
                    parts.append(buf.strip()); buf = ""
                buf += para
            parts.append(buf.strip())
            for i, p in enumerate(parts):
                cid = cur["id"] + (f"~{i + 1}" if len(parts) > 1 else "")
                chunks.append({"id": cid, "doc": doc_id, "title": cur["title"], "text": p})

    for ln in lines:
        m = re.match(r"^(#{2,3})\s+(.*)$", ln)
        if m:
            close()
            level, head = len(m.group(1)), m.group(2).strip()
            if head.lower().startswith(SKIP_HEADINGS):
                cur = None
                if level == 2:
                    h2_tok = None
                continue
            tm = SECTION_TOKEN.match(head)
            tok = tm.group(1) if tm else None
            rest = slug(head[len(tok):] if tok else head)
            if level == 2:
                h2_tok = tok or rest
                sid = tok or rest
            else:
                sid = tok if tok else f"{h2_tok}/{rest}" if h2_tok else rest
            if sid in seen:
                sid = f"{sid}-{rest}" if rest else f"{sid}-x"
            seen.add(sid)
            cur = {"id": f"{doc_id}#{sid}", "title": head, "lines": [ln]}
        elif cur is not None:
            cur["lines"].append(ln)
    close()
    return chunks


class Index:
    def __init__(self, chunks, k1=1.5, b=0.75, title_boost=3):
        self.chunks = chunks
        self.k1, self.b = k1, b
        self.docs = []
        for c in chunks:
            tf = Counter(tokens(c["text"]))
            for t in tokens(c["title"]):
                tf[t] += title_boost
            self.docs.append(tf)
        self.lens = [sum(d.values()) for d in self.docs]
        self.avg = sum(self.lens) / max(1, len(self.lens))
        df = Counter()
        for d in self.docs:
            df.update(d.keys())
        n = len(self.docs)
        self.idf = {t: math.log(1 + (n - f + 0.5) / (f + 0.5)) for t, f in df.items()}
        self.by_id = {c["id"]: c for c in chunks}

    def score(self, q_tokens, i):
        d, L, s = self.docs[i], self.lens[i], 0.0
        for t in q_tokens:
            f = d.get(t)
            if f:
                s += self.idf[t] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * L / self.avg))
        return s

    def search(self, query, k=3, exclude=()):
        q = tokens(query)
        scored = [(self.score(q, i), i) for i in range(len(self.docs)) if self.chunks[i]["id"] not in exclude]
        scored.sort(key=lambda x: -x[0])
        return [(self.chunks[i], round(s, 3)) for s, i in scored[:k] if s > 0]


def load_kb(root, manifest_path):
    man = json.loads(Path(manifest_path).read_text(encoding="utf-8"))
    chunks = []
    for d in man["docs"]:
        text = (Path(root) / d["path"]).read_text(encoding="utf-8")
        chunks += chunk_markdown(d["id"], text)
    return man, chunks


def best_sentence(chunk_text, probe, max_len=260):
    """The sentence or table row of a chunk that overlaps most with probe text (for side-by-side traces)."""
    pt = set(tokens(probe))
    cands = [s.strip() for s in re.split(r"(?<=[.!?])\s+|\n", chunk_text) if len(s.strip()) > 20]
    if not cands:
        return chunk_text[:max_len]
    best = max(cands, key=lambda s: len(pt & set(tokens(s))))
    return best if len(best) <= max_len else best[:max_len - 1] + "…"
