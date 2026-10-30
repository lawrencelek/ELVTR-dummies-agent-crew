"""Run a requirement's acceptance probes against the codebase as it is now.

Probe kinds:
  registry  {"reg": "x.y"}                       the ID is in the registry and not retired
  reads     {"reg": "x.y"}                       the ID appears in the game's sources (the code reads it)
  code      {"file": "path", "pattern": "regex"} the pattern matches the file (multiline, dot matches newline)
  sim       {"expr": "...async body of H..."}    coder/harness.js, headless in Node
  page      {"expr": "...async body of G..."}    coder/page.js, in the built page (Playwright Chromium)

Each result: {id, kind, ok: True | False | None, detail, error, ms}. ok None with an error is a probe defect.
"""
import json
import re
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = ROOT / "content" / "params" / "tuning.parameters.json"
SIM_TIMEOUT, PAGE_TIMEOUT = 240, 420


def _static(p, src_text, reg):
    k = p["kind"]
    if k == "registry":
        e = reg.get(p["reg"])
        ok = bool(e) and not str(e.get("status", "")).startswith("retired")
        return ok, (f"{p['reg']} = {e.get('default')} ({e.get('status')})" if e else f"{p['reg']} not in the registry")
    if k == "reads":
        ok = p["reg"] in src_text
        return ok, ("read by the code" if ok else "not read by any source file")
    if k == "code":
        f = ROOT / p["file"]
        if not f.exists():
            return False, f"{p['file']} does not exist"
        m = re.search(p["pattern"], f.read_text(encoding="utf-8"), re.S | re.M)
        return bool(m), (f"matches at {m.start()}" if m else "no match")
    raise ValueError("unknown static probe kind " + k)


def _node(script, probes, args, timeout):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump([{"id": p["id"], "expr": p["expr"]} for p in probes], f)
        name = f.name
    try:
        proc = subprocess.run(["node", str(ROOT / "coder" / script), name] + args, capture_output=True, text=True,
                              timeout=timeout, cwd=str(ROOT))
        out = {}
        for ln in proc.stdout.splitlines():
            try:
                r = json.loads(ln)
                out[r["id"]] = r
            except (ValueError, KeyError):
                continue
        for p in probes:
            if p["id"] not in out:
                out[p["id"]] = {"id": p["id"], "ok": None, "error": ("process failed: " + (proc.stderr or proc.stdout)[-500:]).strip()}
        return out
    except subprocess.TimeoutExpired:
        return {p["id"]: {"id": p["id"], "ok": None, "error": f"timed out after {timeout} s"} for p in probes}
    finally:
        Path(name).unlink(missing_ok=True)


def sources_text():
    from scan import SOURCES, DATA  # noqa: E402
    return "".join((ROOT / r).read_text(encoding="utf-8") for r in SOURCES + DATA[:1] if (ROOT / r).exists())


def run(req, build=None, shots=None, kinds=None, src_text=None):
    """All probes of one requirement. kinds limits which kinds run (e.g. without 'page' for a quick pass)."""
    reg = {e["id"]: e for e in json.loads(REGISTRY.read_text(encoding="utf-8"))["entries"]}
    src_text = src_text if src_text is not None else sources_text()
    res, sims, pages = {}, [], []
    for p in req.get("probes", []):
        if kinds and p["kind"] not in kinds:
            continue
        if p["kind"] in ("registry", "reads", "code"):
            try:
                ok, detail = _static(p, src_text, reg)
                res[p["id"]] = {"id": p["id"], "ok": ok, "detail": detail, "error": None, "ms": 0}
            except (re.error, ValueError, KeyError) as e:
                res[p["id"]] = {"id": p["id"], "ok": None, "error": str(e), "ms": 0}
        elif p["kind"] == "sim":
            sims.append(p)
        elif p["kind"] == "page":
            pages.append(p)
    if sims:
        res.update(_node("harness.js", sims, [], SIM_TIMEOUT))
    if pages:
        if not build:
            for p in pages:
                res[p["id"]] = {"id": p["id"], "ok": None, "error": "no build to load"}
        else:
            res.update(_node("page.js", pages, [str(build)] + ([str(shots)] if shots else []), PAGE_TIMEOUT))
    for p in req.get("probes", []):
        if p["id"] in res:
            res[p["id"]]["kind"] = p["kind"]
            res[p["id"]]["say"] = p.get("say", "")
    return [res[p["id"]] for p in req.get("probes", []) if p["id"] in res]


def check_syntax(req):
    """Compile every sim and page probe without running it. Returns {probe id: error}."""
    errs = {}
    sims = [p for p in req.get("probes", []) if p["kind"] in ("sim", "page")]
    if sims:
        out = _node("harness.js", sims, ["--check"], 60)
        errs.update({k: v["error"] for k, v in out.items() if v.get("error")})
    for p in req.get("probes", []):
        if p["kind"] == "code":
            try:
                re.compile(p["pattern"])
            except re.error as e:
                errs[p["id"]] = "bad regex: " + str(e)
        if p["kind"] not in ("registry", "reads", "code", "sim", "page"):
            errs[p["id"]] = "unknown kind " + p["kind"]
    return errs


def state(results):
    """met · partial · missing · defect, from one requirement's probe results."""
    if not results:
        return "unprobed"
    if any(r.get("ok") is None for r in results):
        return "defect"
    n = sum(1 for r in results if r["ok"])
    return "met" if n == len(results) else "missing" if n == 0 else "partial"
