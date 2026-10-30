"""Priority scoring: which buildable gap to write next.

Only gaps the gate lets through are scored (gaps.py: no open decision, a spec, sound probes, dependencies met).
Each gets four terms in [0, 1] and one bonus; the weights sum to 1:

  value     0.35  the player-facing weight of its impact class (fixed rubric, set by the analyst):
                  core 1.0 · reward 0.8 · feedback 0.6 · content 0.4 · tooling 0.2
  unblocks  0.25  how many other requirements wait on it, transitively, over the most any requirement unblocks.
                  Foundations first: a gap that opens three others beats a leaf
  authority 0.15  how settled its spec is: half the newest rank among its GDD sources (over the newest rank in the GDD),
                  half its decision (closed D-item 1.0; no D-item 0.5)
  cost      0.25  1 / (1 + 0.5 × files it touches + 0.25 × new registry IDs). Smaller first, at equal value
  partial   +0.10 some of its probes already pass: finish what is started

Ties break by fewer failed attempts, then by ID. Every term is saved with the score, so each choice can be read back.
"""
import gdd

WEIGHTS = {"value": 0.35, "unblocks": 0.25, "authority": 0.15, "cost": 0.25}
VALUE = {"core": 1.0, "reward": 0.8, "feedback": 0.6, "content": 0.4, "tooling": 0.2}
PARTIAL_BONUS = 0.10


def _waiting(reqs):
    """For each requirement, the set of requirements that depend on it, directly or not."""
    dependants = {r["id"]: set() for r in reqs}
    for r in reqs:
        for d in r.get("depends_on", []):
            dependants.setdefault(d, set()).add(r["id"])
    def close(n, seen):
        for m in dependants.get(n, ()):
            if m not in seen:
                seen.add(m); close(m, seen)
        return seen
    return {n: close(n, set()) for n in dependants}


def rank(reqs, gaps, chunks, ledger=None):
    ledger = ledger or {}
    ds = gdd.decisions()
    top_rank = max(c["rank"] for c in chunks)
    rank_of = {c["id"]: c["rank"] for c in chunks}
    waiting = _waiting(reqs)
    most = max(1, max(len(v) for v in waiting.values()))
    scored = []
    for r in reqs:
        g = gaps[r["id"]]
        if g["state"] == "met" or g["blocked"]:
            continue
        src_ranks = [rank_of.get(s.split(":")[0], 0) for s in r.get("sources", [])]
        newest = max(src_ranks) if src_ranks else 0
        d = r.get("decision")
        decided = 1.0 if d and not ds.get(d, {}).get("open", True) else 0.5
        files = {t["file"] for t in r.get("touches", [])}
        terms = {
            "value": VALUE.get(r.get("impact"), 0.4),
            "unblocks": len(waiting.get(r["id"], ())) / most,
            "authority": 0.5 * newest / top_rank + 0.5 * decided,
            "cost": 1 / (1 + 0.5 * len(files) + 0.25 * len(r.get("registry_new", []))),
        }
        score = sum(WEIGHTS[k] * v for k, v in terms.items()) + (PARTIAL_BONUS if g["state"] == "partial" else 0)
        scored.append({"id": r["id"], "title": r["title"], "score": round(score, 3), "terms": {k: round(v, 3) for k, v in terms.items()},
                       "partial": g["state"] == "partial", "waiting": sorted(waiting.get(r["id"], ())), "files": sorted(files),
                       "attempts": ledger.get(r["id"], {}).get("attempts", 0)})
    scored.sort(key=lambda q: (-q["score"], q["attempts"], q["id"]))
    return scored


def table(scored):
    if not scored:
        return "No buildable gap: every requirement is met or blocked."
    rows = ["| # | Requirement | Score | Value | Unblocks | Authority | Cost | Partial | Waiting on it |", "|---|---|---|---|---|---|---|---|---|"]
    for i, q in enumerate(scored, 1):
        t = q["terms"]
        rows.append(f"| {i} | {q['id']}: {q['title']} | **{q['score']}** | {t['value']} | {t['unblocks']} | {t['authority']} | {t['cost']} | "
                    f"{'+0.1' if q['partial'] else '—'} | {', '.join(q['waiting']) or '—'} |")
    return "\n".join(rows)
