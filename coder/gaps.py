"""The gap-detection pass: compare the scanned codebase against every requirement the GDD sets.

For each requirement, its acceptance probes run against the code as it is now:
  met      every probe passes
  partial  some pass
  missing  none pass
  defect   a probe throws (the probe is wrong, not the code)
Cheap probes run first (registry, reads, code, sim). Page probes, about 20 s each, run only when every cheap probe
passes, or when a requirement has no cheap probes: a page cannot show a feature the sim does not have.

Then the gate. A requirement the code lacks is a gap; a gap is buildable only if nothing blocks it:
  decision-open   the D-item that governs it is still open in DECISIONS.md
  no-spec         the GDD names it without saying enough to build it
  probe-suspect   calibration found its probes defective or too weak
  depends         a requirement it depends on is not met yet
  attempts        the coder failed it MAX_ATTEMPTS times
"""
import gdd
import probes as P

MAX_ATTEMPTS = 2
CHEAP = ("registry", "reads", "code", "sim")


def detect(reqs, build, run=None, ledger=None, shots=None):
    ledger = ledger or {}
    src = P.sources_text()
    out = {}
    for r in reqs:
        cheap = [p for p in r["probes"] if p["kind"] in CHEAP]
        res = P.run(r, kinds=CHEAP, src_text=src) if cheap else []
        if not cheap or (res and all(x.get("ok") for x in res)):
            res += P.run(r, build=build, kinds=("page",), shots=shots, src_text=src)
        st = P.state(res)
        if cheap and st == "met" and len(res) < len(r["probes"]):
            st = "partial"
        out[r["id"]] = {"id": r["id"], "state": st, "results": res,
                        "passed": sum(1 for x in res if x.get("ok")), "probes": len(r["probes"])}
        if run:
            run.log(f"gap {r['id']}: {st} ({out[r['id']]['passed']}/{len(r['probes'])})")
    ds = gdd.decisions()
    for r in reqs:
        g = out[r["id"]]
        g["blocked"] = None
        if g["state"] == "met":
            continue
        d = r.get("decision")
        if d and ds.get(d, {}).get("open", False):
            g["blocked"] = f"decision-open: {d}"
        elif r.get("spec") == "none":
            g["blocked"] = "no-spec: " + (r.get("spec_gap") or "the GDD does not say enough")
        elif r.get("calibration") or g["state"] == "defect":
            g["blocked"] = "probe-suspect: " + "; ".join(r.get("calibration") or [x.get("error") or "" for x in g["results"] if x.get("ok") is None])[:300]
        elif any(out.get(dep, {}).get("state") != "met" for dep in r.get("depends_on", [])):
            g["blocked"] = "depends: " + ", ".join(dep for dep in r.get("depends_on", []) if out.get(dep, {}).get("state") != "met")
        elif ledger.get(r["id"], {}).get("attempts", 0) >= MAX_ATTEMPTS and ledger[r["id"]].get("status") != "built":
            g["blocked"] = f"attempts: failed {ledger[r['id']]['attempts']} times"
    return out


def table(reqs, gaps):
    rows = ["| Requirement | GDD | State | Probes | Blocked by |", "|---|---|---|---|---|"]
    for r in reqs:
        g = gaps[r["id"]]
        rows.append(f"| {r['id']}: {r['title']} | {r['gdd_status']} | {g['state']} | {g['passed']}/{g['probes']} | {g['blocked'] or '—'} |")
    return "\n".join(rows)
