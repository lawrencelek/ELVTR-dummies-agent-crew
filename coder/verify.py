"""Verify a write: build the game, smoke-test the page, run the target's probes and every probe that passed before.

  build       python3 prototypes/p7/build.py exits 0
  smoke       the page loads to the title with no page error; Story opens on Monument A1 and plays
  target      every acceptance probe of the requirement passes (green)
  regression  every requirement that was met before this write is still met
  suites      the game's own suites: test_p610.js on every write (the 6.10 rules on the shared code, 47 checks, ~2 min);
              with --full, test_sim.js too at the final gate (104 checks, ~3.5 min)
A write is accepted only if all of these pass. The coder never runs them: it cannot mark its own work.
"""
import subprocess
from pathlib import Path

import probes as P
import scan as S

ROOT = Path(__file__).resolve().parents[1]
SUITES = {"write": [("prototypes/p6", "test_p610.js", "47 passed")],
          "final": [("prototypes/p6", "test_sim.js", "104 passed"), ("prototypes/p6", "test_p610.js", "47 passed")]}
SMOKE = {"id": "R-SMOKE", "probes": [
    {"id": "title", "kind": "page", "say": "the page loads to the title, no page error", "expr": "await G.open(); return { ok: G.errors.length === 0, detail: await G.eval(() => window.__dummies.screen) };"},
    {"id": "story", "kind": "page", "say": "Story opens on Monument A1 and plays", "expr": "const ok = await G.openStory({ v: 1, district: 'monument', done: {}, tileWO: 0, owned: {}, credits: 0, points: 0, chassis: 0, writeOffs: 0, t: 0, gifts: {}, tilePoints: {}, complete: false }); return { ok, detail: await G.eval(() => window.__dummies.sim.screenName() + ' ' + window.__dummies.sim.phase) };"},
]}


def build():
    r = subprocess.run(["python3", "build.py"], cwd=str(ROOT / "prototypes/p7"), capture_output=True, text=True, timeout=300)
    return r.returncode == 0, (r.stdout + r.stderr).strip()[-800:]


def live_build():
    return ROOT / S.current_build()[0]


def suites(which="final"):
    out = []
    for cwd, f, want in SUITES[which]:
        r = subprocess.run(["node", f], cwd=str(ROOT / cwd), capture_output=True, text=True, timeout=1500)
        tail = (r.stdout or "").strip().splitlines()[-1:] or [""]
        fails = [l for l in r.stdout.splitlines() if l.startswith("FAIL")]
        ok = r.returncode == 0 and not fails and (want is None or want in r.stdout)
        out.append({"suite": f"{cwd}/{f}", "ok": ok, "tail": tail[0], "fails": fails[:5]})
    return out


def verify(req, met_before, reqs_by_id, run, shots):
    rep = {"build": None, "smoke": None, "target": None, "regression": [], "suites": [], "ok": False}
    ok, log = build()
    rep["build"] = {"ok": ok, "log": log}
    if not ok:
        return rep
    b = live_build()
    sm = P.run(SMOKE, build=b, shots=shots)
    rep["smoke"] = sm
    tg = P.run(req, build=b, shots=shots)
    rep["target"] = tg
    for rid in met_before:
        if rid == req["id"]:
            continue
        res = P.run(reqs_by_id[rid], build=b, shots=shots)
        rep["regression"].append({"id": rid, "state": P.state(res), "results": res})
    if P.state(tg) == "met":  # the suites only matter once the target is green
        rep["suites"] = suites("write")
    rep["ok"] = (all(x.get("ok") for x in sm) and P.state(tg) == "met" and all(x["state"] == "met" for x in rep["regression"])
                 and all(s["ok"] for s in rep["suites"]))
    run.log("verify: build ok; smoke " + ("ok" if all(x.get("ok") for x in sm) else "FAIL") + f"; target {P.state(tg)}; regression "
            + (", ".join(f"{x['id']} {x['state']}" for x in rep["regression"]) or "none") + "; suites " + (", ".join(f"{s['suite']} {'ok' if s['ok'] else 'FAIL'}" for s in rep["suites"]) or "not run"))
    return rep


def failure_text(rep):
    """What failed, for the coder's repair round."""
    out = []
    if rep["build"] and not rep["build"]["ok"]:
        out.append("The build failed:\n" + rep["build"]["log"])
    for x in rep.get("smoke") or []:
        if not x.get("ok"):
            out.append(f"Smoke test {x['id']} ({x.get('say')}) failed: {x.get('detail') or ''} {x.get('error') or ''} page errors: {x.get('errors')}")
    for x in rep.get("target") or []:
        if not x.get("ok"):
            out.append(f"Target probe {x['id']} ({x.get('say')}) {'threw' if x.get('ok') is None else 'returned false'}: {x.get('detail') or ''} {x.get('error') or ''}".strip()
                       + (f" page errors: {x.get('errors')}" if x.get("errors") else ""))
    for g in rep.get("regression") or []:
        if g["state"] != "met":
            for x in g["results"]:
                if not x.get("ok"):
                    out.append(f"Regression: {g['id']}.{x['id']} ({x.get('say')}) now fails: {x.get('detail') or ''} {x.get('error') or ''}")
    for s in rep.get("suites") or []:
        if not s["ok"]:
            out.append(f"Suite {s['suite']} failed: {s['tail']} {s['fails']}")
    return "\n".join(out) or "Nothing failed."
