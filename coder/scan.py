"""Scan the codebase: files, symbols, registry use, flags, events, phases. Standard library only.

The scan is the agent's picture of what exists. It feeds three things:
  gap detection    the static probes (a symbol, a pattern, a registry ID read by the code)
  the coder        an outline of each file and the bodies of the symbols retrieval picks
  the guard        sha256 of every frozen build, so a write that changes one is refused

JS is read with a small lexer that blanks strings, comments and regex literals (newlines kept), so braces
can be matched to find where each function, method and class ends.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "content"))
import rag  # noqa: E402

# the game's sources: everything p7/build.py bundles into the page, plus the build itself
SOURCES = ["prototypes/p7/story.js", "prototypes/p6/game.js", "prototypes/p6/world6.js", "prototypes/p6/sim.js",
           "prototypes/p6/pixel.js", "prototypes/p6/lab.js", "prototypes/p6/circus_valley.js", "prototypes/p6/content.js",
           "prototypes/jump/jump.js", "prototypes/controls/pads.js", "prototypes/p7/build.py", "prototypes/p7/shell.html"]
DATA = ["content/story/story.json", "content/params/tuning.parameters.json"]
FROZEN_GLOBS = ["prototypes/p7/dummies_p7*.html", "prototypes/p7/p7*_page.html", "prototypes/p6/dummies_p6*.html"]
KEYWORDS = set("if for while switch catch function return typeof new delete void throw else do case in of with await yield".split())
REGEX_AFTER = set("(,=:[!&|?{};+-*%<>~^")


def mask_js(src):
    """Blank strings, template text, comments and regex literals with spaces; keep newlines and code."""
    out, i, n, stack = list(src), 0, len(src), []  # stack: template nesting, counting braces inside ${ }
    last = ""  # last significant code character (or keyword) for the regex/division test

    def blank(a, b):
        for k in range(a, b):
            if out[k] != "\n":
                out[k] = " "

    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            j = n if j < 0 else j
            blank(i, j); i = j; continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            blank(i, j); i = j; continue
        if c in "'\"":
            j = i + 1
            while j < n and src[j] != c and src[j] != "\n":
                j += 2 if src[j] == "\\" else 1
            blank(i + 1, min(j, n)); i = j + 1; last = "a"; continue
        if c == "`" or (c == "}" and stack and stack[-1] == 0):
            if c == "}":
                stack.pop()
            j = i + 1
            while j < n:
                if src[j] == "\\":
                    j += 2; continue
                if src[j] == "`":
                    break
                if src[j] == "$" and j + 1 < n and src[j + 1] == "{":
                    break
                j += 1
            blank(i + 1, min(j, n))
            if j < n and src[j] == "$":
                stack.append(0); i = j + 2; last = "{"; continue
            i = j + 1; last = "a"; continue
        if c == "/" and (last in REGEX_AFTER or last in KEYWORDS or last == ""):
            j, cls = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2; continue
                if src[j] == "[":
                    cls = True
                elif src[j] == "]":
                    cls = False
                elif src[j] == "/" and not cls:
                    break
                j += 1
            blank(i + 1, min(j, n)); i = j + 1
            while i < n and src[i].isalpha():
                i += 1
            last = "a"; continue
        if c == "{" and stack:
            stack[-1] += 1
        elif c == "}" and stack:
            stack[-1] -= 1
        if c.isalnum() or c in "_$":
            j = i
            while j < n and (src[j].isalnum() or src[j] in "_$"):
                j += 1
            word = src[i:j]
            last = word if word in KEYWORDS else "a"
            i = j; continue
        if not c.isspace():
            last = c
        i += 1
    return "".join(out)


DEF = [
    (re.compile(r"\bfunction\s+([A-Za-z_$][\w$]*)\s*\("), "function"),
    (re.compile(r"\bclass\s+([A-Za-z_$][\w$]*)"), "class"),
    (re.compile(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*=>"), "arrow"),
    (re.compile(r"\b(?:const|let|var)\s+([A-Z][A-Z0-9_]+)\s*=\s*[\[{(]"), "const"),
    (re.compile(r"(?:^|[;{}]\s*)(?:static\s+|async\s+|get\s+|set\s+)*([A-Za-z_$][\w$]*)\s*\(([^()]*)\)\s*\{"), "method"),
]


def _match_brace(masked, start):
    """Index just past the brace block that opens at or after start (or the end of the line for an expression)."""
    j = masked.find("{", start)
    nl = masked.find("\n", start)
    if j < 0 or (nl >= 0 and j > nl and masked[start:nl].rstrip().endswith((";", ","))):
        return nl if nl >= 0 else len(masked)
    depth = 0
    for k in range(j, len(masked)):
        ch = masked[k]
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                return k + 1
    return len(masked)


def js_symbols(src):
    masked = mask_js(src)
    starts = [0]
    for m in re.finditer("\n", masked):
        starts.append(m.end())
    line_of = lambda pos: next(k for k in range(len(starts) - 1, -1, -1) if starts[k] <= pos) + 1  # noqa: E731
    out, seen = [], set()
    for rx, kind in DEF:
        for m in rx.finditer(masked):
            name = m.group(1)
            if name in KEYWORDS or name in ("constructor",) and kind != "method":
                continue
            pos = m.start(1)
            if (name, pos) in seen:
                continue
            seen.add((name, pos))
            end = _match_brace(masked, m.end() - 1 if kind == "method" else m.end())
            a, b = line_of(pos), line_of(max(pos, end - 1))
            out.append({"name": name, "kind": kind, "line": a, "end": b, "chars": end - pos})
    out.sort(key=lambda q: (q["line"], -q["chars"]))
    # a method inside a class is named Class.method
    classes = [q for q in out if q["kind"] == "class"]
    for q in out:
        if q["kind"] == "method":
            owner = [c for c in classes if c["line"] <= q["line"] <= c["end"]]
            if owner:
                q["name"] = owner[-1]["name"] + "." + q["name"]
    return out


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def frozen():
    out = {}
    for g in FROZEN_GLOBS:
        for p in sorted(ROOT.glob(g)):
            out[str(p.relative_to(ROOT))] = sha(p)
    return out


def current_build():
    """The output names build.py writes now: those are live, every other built page is frozen."""
    b = (ROOT / "prototypes/p7/build.py").read_text(encoding="utf-8")
    return [f"prototypes/p7/{m}" for m in re.findall(r"here / '((?:dummies_|p7)[^']*\.html)'", b)]


def scan():
    files, symbols, chunks = {}, {}, []
    text_all = ""
    for rel in SOURCES + DATA:
        p = ROOT / rel
        if not p.exists():
            continue
        src = p.read_text(encoding="utf-8")
        files[rel] = {"bytes": len(src.encode("utf-8")), "lines": src.count("\n") + 1, "sha256": sha(p)}
        if rel.endswith(".js"):
            syms = js_symbols(src)
            symbols[rel] = syms
            lines = src.splitlines()
            for s in syms:
                body = "\n".join(lines[s["line"] - 1:s["end"]])
                if s["kind"] == "class" or len(body) > 12000:  # a class or a whole module: its methods are their own chunks
                    body = body[:1500]
                chunks.append({"id": f"{rel}::{s['name']}@{s['line']}", "doc": rel, "title": s["name"].replace(".", " "), "text": body})
        if rel in SOURCES:
            text_all += src
    reg = json.loads((ROOT / DATA[1]).read_text(encoding="utf-8"))
    ids = [e["id"] for e in reg["entries"]]
    read = sorted(i for i in ids if i in text_all or i in (ROOT / DATA[0]).read_text(encoding="utf-8"))
    story_js = (ROOT / SOURCES[0]).read_text(encoding="utf-8")
    m = re.search(r"const P7SIM = \{(.*?)\};", story_js, re.S)
    flags = re.findall(r"'([\w.]+)':\s*([\d.]+)", m.group(1)) if m else []
    events = sorted(set(re.findall(r"\bemit\('([\w-]+)'", text_all)))
    phases = sorted(set(re.findall(r"\bphase\s*===?\s*'([\w-]+)'", text_all)))
    fz = frozen()
    live = current_build()
    return {
        "registryVersion": reg["registryVersion"],
        "files": files,
        "symbols": symbols,
        "registry": {"ids": len(ids), "readByCode": len(read), "unread": [i for i in ids if i not in read]},
        "p7simFlags": {k: float(v) for k, v in flags},
        "events": events,
        "phases": phases,
        "frozen": {k: v for k, v in fz.items() if k not in live},
        "live": live,
        "_chunks": chunks,
    }


def index(sc):
    return rag.Index(sc["_chunks"], title_boost=4)


def outline(sc, rel, max_items=400):
    """One line per symbol: the file's map for the coder."""
    out = [f"{rel} ({sc['files'][rel]['lines']} lines)"]
    for s in sc["symbols"].get(rel, [])[:max_items]:
        out.append(f"  {s['line']:>5}-{s['end']:<5} {s['kind']:<8} {s['name']}")
    return "\n".join(out)


def excerpt(rel, line, end, max_chars=14000):
    lines = (ROOT / rel).read_text(encoding="utf-8").splitlines()
    body = "\n".join(lines[line - 1:end])
    return body if len(body) <= max_chars else body[:max_chars] + "\n/* … excerpt cut … */"


def find_symbol(sc, name):
    """Symbols whose name is name, or ends with .name."""
    hits = []
    for rel, syms in sc["symbols"].items():
        for s in syms:
            if s["name"] == name or s["name"].endswith("." + name):
                hits.append((rel, s))
    return hits


def digest(sc):
    """What the scan found, without the chunk bodies: saved per run."""
    return {k: v for k, v in sc.items() if not k.startswith("_")}


def game_ids():
    """Every parameter ID the game itself defines (sim.js REG, PROTO, OVERRIDES; world6 P6SIM; story P7SIM), from Node."""
    import subprocess
    js = ("const S=require('./prototypes/p7/story.js'),W=require('./prototypes/p6/world6.js'),X=require('./prototypes/p6/sim.js');"
          "console.log(JSON.stringify(Object.keys(Object.assign({},X.REG,X.PROTO,X.OVERRIDES,W.P6SIM,S.P7SIM))))")
    r = subprocess.run(["node", "-e", js], cwd=str(ROOT), capture_output=True, text=True, timeout=120)
    return set(json.loads(r.stdout.strip().splitlines()[-1])) if r.returncode == 0 else set()


if __name__ == "__main__":
    s = scan()
    d = digest(s)
    print(json.dumps({k: (v if k not in ("symbols", "files") else {f: (len(x) if isinstance(x, list) else x) for f, x in v.items()}) for k, v in d.items()}, indent=1)[:4000])
    for name in ["drawEnding", "StorySim.checkTerminal", "dummyMonument", "containerShip", "drawGiftPopup"]:
        print(name, [(r, q["line"], q["end"]) for r, q in find_symbol(s, name.split(".")[-1]) if q["name"].endswith(name)])
