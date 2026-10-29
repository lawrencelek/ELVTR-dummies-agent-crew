#!/usr/bin/env python3
"""DUMMIES Style Guide Agent (Assignment 6): generator → evaluator → refiner → evaluator, until 10/10 or the round cap.

Three fresh headless agents (style/llm.py), no shared memory. The evaluator grades against style/STYLE_GUIDE.md and
returns SCORE and REASON; style/lint.py measures what is computable and hands it over as evidence; the refiner reads the
REASON and rewrites. No human step inside the loop.

  python3 style/loop.py --examples                 # the three adversarial examples (style/cases/examples.json)
  python3 style/loop.py --d78 monument             # real content: tile barks for one district (D78 proposal), per tile, then as one batch
  python3 style/loop.py --d78-batch style/runs/<id>   # stage 2 only, on a stage-1 run
  python3 style/loop.py --audit                    # real content: every shipped tale, brief, act line and the ending
  python3 style/loop.py --calibrate                # evaluator only: shipped strings vs seeded violations
  python3 style/loop.py --retrace-calibration style/runs/<id>   # recompute its verdicts from the saved replies
  python3 style/loop.py --piece draft.json         # one piece from the content pipeline: evaluate, refine, evaluate
  python3 style/loop.py --v8                       # Prototype 8's text: every 7.13 text that breaks Style Guide V2, rewritten on V2
  python3 style/loop.py --guide v2 --piece x.json  # any job on Style Guide V2 (Dummy Corporation, GDD Edit 95)
  STYLE_REPLAY=style/runs/<id> python3 style/loop.py --examples   # reuse that run's saved model outputs
"""
import argparse
import json
import re
import sys
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "content"))
sys.path.insert(0, str(ROOT / "style"))
import rag                     # noqa: E402  (Assignment 4: BM25, chunk IDs)
import lint                    # noqa: E402
import llm                     # noqa: E402
import style_kb               # noqa: E402

STYLE = ROOT / "style"
RUNS = STYLE / "runs"
P = lint.PARAMS
FLEET, STORY = lint.FLEET, lint.STORY
TIERS = {t["tier"]: t for t in FLEET["tiers"]}
DIST = {d["id"]: d for d in STORY["districts"]}
CODE = {"monument": "M", "parkland": "P", "waterfront": "W"}
BASE = {
    "car": ["FLEET#F1", "FLEET#F2", "FLEET#F3", "FLEET#F4", "FLEET#F8", "EDIT39#6.6", "DESIGN#D9.3", "EDIT26#3.2", "EDIT26#6.6",
            "FSG#field-text", "SUB4#5", "SUB4#6.2", "DECISIONS#rows-541-550"],
    "farsight": ["EDIT92#3", "STORY#S1", "STORY#S2", "STORY#S3", "EDIT39#4.1.1", "FLEET#F2", "FLEET#F3", "EDIT93#3.1/tales-rewritten~2",
                 "EDIT92#measured", "DECISIONS#rows-531-540~2", "DECISIONS#rows-541-550"],
}
EVENT_LINES = {"impact": ["FLEET#F9.1~2"], "writeoff": ["FLEET#F9.2"], "near-miss": ["FLEET#F9.3"], "miss": ["FLEET#F9.4"], "commit": ["FLEET#F9.5"],
               "honk": ["FLEET#F9.6"], "upgrade-seen": ["FLEET#F9.12"], "part-seen": ["FLEET#F9.13"]}
BASE_V2 = {
    "car": BASE["car"] + ["EDIT95#3.2"],
    "company": ["EDIT98#0", "EDIT98#3.2", "EDIT97#0", "EDIT97#3.2", "EDIT96#0", "EDIT96#3.2", "EDIT95#0", "EDIT95#3.1", "EDIT95#3.2", "EDIT95#3.3", "EDIT95#4.2", "PLAY#PS0", "PLAY#PS2", "PLAY#PS5", "STORY#S1", "STORY#S2", "STORY#S3",
                "FLEET#F2", "FLEET#F3", "DECISIONS#rows-541-550"],
}
GUIDES = {   # the guide a run reads: its file, its agents' prompts, its knowledge base, its lint mode, its canon
    "v1": {"file": "STYLE_GUIDE.md", "agents": "agents", "manifest": "manifest.json", "base": BASE, "voice": "Farsight"},
    "v2": {"file": "STYLE_GUIDE_V2.md", "agents": "agents/v2", "manifest": "manifest_v2.json", "base": BASE_V2, "voice": "Dummy Corporation"},
}
VERSION = "v1"
SUPERSEDED = {"EDIT92#3.1~1", "EDIT92#3.1~2", "EDIT92#3.1~3"}   # Edit 92's tile table: briefs, parts and tales replaced by Edit 93 and story.json
INDEX = None
LOCK = threading.Lock()


def index():
    """Built once per process, before any agent thread starts (main) and guarded for direct use."""
    global INDEX
    with LOCK:
        if INDEX is None:
            style_kb.build()
            _, chunks = rag.load_kb(ROOT, STYLE / "kb" / GUIDES[VERSION]["manifest"])
            INDEX = rag.Index(chunks)
    return INDEX


def set_guide(v):
    """Choose the guide before anything reads the index: V1 (Prototype 7.13) or V2 (Dummy Corporation, Prototype 8)."""
    global VERSION, INDEX, RULES
    VERSION, INDEX = v, None
    llm.GUIDE = {"agents": GUIDES[v]["agents"], "file": GUIDES[v]["file"]}
    lint.MODE = v
    RULES = guide_rules()


# ---------------------------------------------------------------- the slot: what the content is for, and what it may say
def tile_facts(district, tile):
    d = DIST[district]
    t = d["tiles"][tile]
    label, brief = style_kb.task_text(STORY["tasks"], STORY["classes"], t["task"])
    gift = style_kb.node_name(t["gift"]["node"]) if t.get("gift") else "none"
    return (f"{d['name']} {tile} · {t['title']} ({d['act']}; tile {d['order'].index(tile) + 1} of {len(d['order'])}). "
            f"Brief: {label}. {brief} Equipment issued here: {gift}. Chunk: STORY#{CODE[district]}{tile}.")


def slot_text(piece):
    k = piece["kind"]
    out = ["SLOT"]
    if k == "barks":
        out += ["- Kind: barks, `content/db/fleet.json` `barks[]`. Speaker: the cars, one bubble each.",
                '- Schema: {"kind": "barks", "lines": [{"id", "event", "when", "style", "priority", "text", "claims"}]}',
                f"- Bubble: at most {P['style.bark.maxChars']} characters (style.bark.maxChars). Styles: speech, shout, mutter, thought. Priority: writeoff 3, impact 2, chatter 1."]
        tiles = set()
        for b in piece.get("lines") or []:
            w, ev = b.get("when") or {}, b.get("event")
            tier = w.get("tier")
            voice = f"tier {tier} {TIERS[tier]['name']}: {TIERS[tier]['voice']}" if tier in TIERS else "no tier: fires for all four tiers"
            conds = ", ".join(f"{a}={json.dumps(v, ensure_ascii=False)}" for a, v in w.items() if a != "tier") or "none"
            fields = ", ".join(FLEET["events"].get(ev, [])) or "no fields"
            out.append(f"- Line {b.get('id')}: event `{ev}` (logs: {fields}); {voice}; other conditions: {conds}; claims: {b.get('claims')}.")
            if w.get("tile") and w.get("district") in DIST and w["tile"] in DIST[w["district"]]["tiles"]:
                tiles.add((w["district"], w["tile"]))
        for d, t in sorted(tiles):
            out.append(f"- Tile (proposed `tile` condition, D78): {tile_facts(d, t)}")
    elif k == "tale":
        out += [f"- Kind: tale, `content/story/story{'_v2' if VERSION == 'v2' else ''}.json` `districts[].tiles.<tile>.tale`. Speaker: {GUIDES[VERSION]['voice']}. Shown on the tile card.",
                '- Schema: {"kind": "tale", "district", "tile", "title", "tale"}',
                (f"- Length: at most {P['style.v2.text.maxSentences']} sentences; {P['style.v2.tale.minWords']} to {P['style.v2.tale.maxWords']} words (style.v2.tale.minWords, style.v2.tale.maxWords). The tile's content sets the length: short for one image, longer for a place with a history." if VERSION == "v2" else
                 f"- Card: at most {P['style.tale.maxChars']} characters (style.tale.maxChars); sentences of at most {P['style.tale.maxSentenceWords']} words."),
                f"- Tile: {tile_facts(piece['district'], piece['tile'])}"]
    elif k == "brief":
        out += ["- Kind: brief, `content/story/story.json` `tasks.<kind>`. Speaker: " + GUIDES[VERSION]["voice"] + ". Label on the tile card and the objective strip.",
                '- Schema: {"kind": "brief", "task", "label", "brief"}', f"- Task kind: {piece.get('task')}."]
    elif k == "act":
        d = DIST[piece["district"]]
        out += ["- Kind: act line, `content/story/story.json` `districts[].intro`. Speaker: " + GUIDES[VERSION]["voice"] + ". On the district's first card.",
                '- Schema: {"kind": "act", "district", "intro"}', f"- District: {d['name']}, {d['act']}."]
    elif k == "ending":
        out += ["- Kind: the ending, `content/story/story.json` `ending`. Speaker: " + GUIDES[VERSION]["voice"] + ". The CERTIFIED screen.", '- Schema: {"kind": "ending", "ending"}']
    elif k == "notices":
        out += ["- Kind: notices, Prototype 8's `prototypes/p8/lore.js`. Speaker: Dummy Corporation. Short texts the interface shows: title lines, drone and gift labels, part notes, toasts, a sign.",
                '- Schema: {"kind": "notices", "items": [{"id", "where", "text", "caps", "placeholders", "sign", "maxChars"}]}. Change only each item\'s "text".',
                "- caps: true keeps the text in capitals. placeholders ({PART}, {TILE}, {N}) stay exactly as given. maxChars is the slot's width. sign: true is pixel signage."]
        for it in piece.get("items") or []:
            out.append(f"- {it.get('id')} · {it.get('where')}" + (f" · at most {it['maxChars']} characters" if it.get("maxChars") else "") + (f" · keep {', '.join(it['placeholders'])}" if it.get("placeholders") else ""))
    elif k == "batch":
        out += ["- Kind: a batch of the company's texts: the story's (Prototype 8's `content/story/story_v2.json`) and, where listed, notices (`prototypes/p8/lore.js`). Speaker: Dummy Corporation. Each item is one text: a tale, an act line, the ending or a notice.",
                '- Schema: {"kind": "batch", "items": [{"id", "kind", "district", "tile", "text"}]}. Change only each item\'s "text"; change only the items the REASON names.',
                "- The batch is judged as a whole as well: T14 (no slogan in more than two texts) and V10 (the purpose stated plainly at least once)."]
        if any(it.get("locked") for it in piece.get("items") or []):
            out.append("- Items marked locked are the user's own lines (U1): never rewrite them, never deduct for them. They count for T14.")
        for it in piece.get("items") or []:
            if it.get("locked"):
                out.append(f"- {it['id']}: locked, the user's own line.")
                continue
            if it.get("kind") == "tale":
                out.append(f"- {it['id']}: tale. {tile_facts(it['district'], it['tile'])}")
            elif it.get("kind") == "act":
                d = DIST[it["district"]]
                out.append(f"- {it['id']}: act line, {d['name']}, {d['act']}.")
            elif it.get("kind") == "notice":
                out.append(f"- {it['id']}: notice. Where: {it['where']}. At most {it['maxChars']} characters.")
            else:
                out.append(f"- {it['id']}: the ending, the CERTIFIED screen.")
    elif k == "credits":
        out += ["- Kind: credits, Prototype 8's Credits card (title menu; after the CERTIFIED ending). Extra-diegetic: Farsight, the publisher, is named here and only here.",
                '- Schema: {"kind": "credits", "lines": ["…"]}']
    if VERSION == "v2" and k != "barks":
        out.append(f"- Every text: at most {P['style.v2.text.maxSentences']} sentences. A tale: {P['style.v2.tale.minWords']} to {P['style.v2.tale.maxWords']} words (GDD Edit 97); any other text: at most {P['style.v2.text.maxWords']} (GDD Edit 95).")
    return "\n".join(out)


def speaker(piece):
    return "car" if piece["kind"] == "barks" else "company" if VERSION == "v2" else "farsight"


def piece_text(piece):
    if piece["kind"] == "barks":
        return " ".join(str(b.get("text") or "") for b in piece.get("lines") or [])
    if piece["kind"] in ("notices", "batch"):
        return " ".join(str(it.get("text") or "") for it in piece.get("items") or [])
    if piece["kind"] == "credits":
        return " ".join(str(x) for x in piece.get("lines") or [])
    return " ".join(str(piece.get(k) or "") for k in ("title", "tale", "label", "brief", "intro", "ending"))


def resolve(idx, cid):
    """A chunk ID, or its parts when the chunker split it (rows-541-550 → rows-541-550~1, ~2). An unknown ID is an error:
    a rule's source must never drop out of the canon silently."""
    if cid in idx.by_id:
        return [cid]
    parts = [k for k in idx.by_id if k.startswith(cid + "~")]
    if not parts:
        raise KeyError(f"canon chunk {cid} is not in the knowledge base")
    return sorted(parts, key=lambda k: int(k.rsplit("~", 1)[1]))


def shipped_text(piece):
    """The text the game ships in this slot today, if any (a tale, an act line, a brief, the ending)."""
    k = piece.get("kind")
    if k == "tale" and piece.get("district") in DIST:
        return DIST[piece["district"]]["tiles"].get(piece.get("tile"), {}).get("tale")
    if k == "act" and piece.get("district") in DIST:
        return DIST[piece["district"]]["intro"]
    if k == "brief":
        return (STORY["tasks"].get(piece.get("task")) or {}).get("brief")
    if k == "ending":
        return STORY["ending"]
    return None


def canon(piece, withhold=False, facts=None):
    """The rules' own chunks for this speaker, the slot's tile and event chunks, then BM25 on the text.
    withhold: the slot's shipped text is kept from every agent, so the loop writes the slot instead of copying it."""
    idx = index()
    ids = list(GUIDES[VERSION]["base"][speaker(piece)])
    if piece["kind"] == "barks":
        for b in piece.get("lines") or []:
            ids += EVENT_LINES.get(b.get("event"), [])
            w = b.get("when") or {}
            if w.get("tile") and w.get("district") in CODE:
                ids.append(f"STORY#{CODE[w['district']]}{w['tile']}")
    elif piece["kind"] == "batch":
        ids += [f"STORY#{CODE[it['district']]}{it['tile']}" for it in piece.get("items") or [] if it.get("kind") == "tale"]
    elif piece.get("district") in CODE and piece.get("tile"):
        ids.append(f"STORY#{CODE[piece['district']]}{piece['tile']}")
    ids = [j for i in dict.fromkeys(ids) for j in resolve(idx, i)]
    old = SUPERSEDED | ({"DECISIONS#rows-531-540~2"} if VERSION == "v2" else set())   # V2: row 539 (Farsight's casing) is superseded by Edit 95
    extra = [c["id"] for c, _ in idx.search(piece_text(piece), k=3, exclude=set(ids) | old)]
    ids += extra
    hide = shipped_text(piece) if withhold else None

    def body(i):
        t = idx.by_id[i]["text"]
        note = "[withheld: the shipped text of the slot being written" + (f". Its facts: {facts}" if facts else "") + "]"
        return t.replace(hide, note) if hide else t
    if hide:
        ids = [i for i in ids if i.startswith("STORY#") or hide[:60] not in idx.by_id[i]["text"]]
    text = "CANON\n\n" + "\n\n".join(f"[{i}] {idx.by_id[i]['title']}\n{body(i)}" for i in ids)
    return text, ids


# ---------------------------------------------------------------- one case folder
class Case:
    def __init__(self, run_dir, name):
        self.name, self.dir, self.calls, self.withhold, self.facts = name, Path(run_dir) / name, [], False, None
        self.dir.mkdir(parents=True, exist_ok=True)

    def save(self, name, text):
        (self.dir / name).write_text(text if isinstance(text, str) else json.dumps(text, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


SCORE_RX = re.compile(r"^\s*SCORE:\s*\[?(\d{1,2})\s*/\s*10\]?\s*$", re.M)
DEDUCT_RX = re.compile(r"\((blocking|major|minor),\s*[−\-–]\s*(\d)\)")
RULE_RX = re.compile(r"\b([TVFRC]\d{1,2})\b")


def check_eval(text, findings):
    """Format and consistency of the evaluator's reply. Problems go back to it once, automatically."""
    probs = []
    m = SCORE_RX.search(text)
    if not m:
        return None, ["the first line must be 'SCORE: <X>/10'"]
    score = int(m.group(1))
    if not 1 <= score <= 10:
        probs.append("SCORE must be 1–10")
    if "REASON:" not in text:
        probs.append("a 'REASON:' block must follow the SCORE")
    reason = text.split("REASON:", 1)[-1]
    total = sum(int(n) for _, n in DEDUCT_RX.findall(reason))
    if max(P["style.score.floor"], 10 - total) != score:
        probs.append(f"the deductions listed sum to {total}, so SCORE should be {max(1, 10 - total)}/10, not {score}/10")
    after = reason.split("Total:", 1)[1].split("\n", 1)[1].strip() if "Total:" in reason and "\n" in reason.split("Total:", 1)[1] else ""
    if "Total:" not in reason:
        probs.append("REASON must end with the 'Total:' line")
    elif after:
        probs.append("nothing may follow the 'Total:' line")
    named = set(RULE_RX.findall(reason))
    missing = sorted({x["rule"] for x in findings} - named)
    if missing:
        probs.append("LINT findings not addressed in REASON: " + ", ".join(missing) + ". Deduct each, or name the guide's exemption")
    return score, probs


def evaluate(case, piece, rnd):
    findings = lint.lint(piece)
    case.save(f"e{rnd}_lint.json", findings)
    pack, ids = canon(piece, case.withhold, case.facts)
    lint_txt = "LINT (style/lint.py)\n" + ("\n".join(f"- {x['path']} · {x['rule']} ({x['severity']}, −{x['deduct']}) \"{x['quote']}\": {x['measured']}. [{x['source']}]"
                                                    for x in findings) or "- No findings.")
    msg = "\n\n".join([slot_text(piece), pack, lint_txt, "CONTENT\n" + json.dumps(piece, indent=1, ensure_ascii=False)])
    raw = llm.call(case, "evaluator", msg, f"e{rnd}")
    score, probs = check_eval(raw, findings)
    retried = False
    if probs:
        retried = True
        note = "\n\nFORMAT CHECK (automatic, from the loop): your previous reply had these problems:\n" + "\n".join(f"- {p}" for p in probs) + \
               "\nYour previous reply:\n" + raw + "\nAnswer again in the required format."
        raw = llm.call(case, "evaluator", msg + note, f"e{rnd}b")
        score, probs = check_eval(raw, findings)
    reason = raw.split("REASON:", 1)[-1].strip() if "REASON:" in raw else raw.strip()
    cited = sorted(set(re.findall(r"\[([A-Z0-9]+#[^\]]+)\]", reason)))
    return {"round": rnd, "score": score, "raw": raw.strip(), "reason": reason, "lint": findings, "canon_ids": ids,
            "cited": cited, "uncited": [c for c in cited if c not in ids and c not in index().by_id], "format_retry": retried, "format_problems": probs}


LOCKED = {"barks": ("id", "event", "when", "claims"), "tale": ("district", "tile", "title"), "brief": ("task",), "act": ("district",), "ending": (),
          "notices": (), "credits": (), "batch": ()}
ITEM_LOCKED = ("id", "where", "caps", "placeholders", "sign", "maxChars")


def restore(before, after, log):
    """The slot's fixed fields never change (refiner.md). Put back any the refiner touched."""
    if after.get("kind") != before["kind"]:
        log.append(f"kind {after.get('kind')} → {before['kind']}")
        after["kind"] = before["kind"]
    if before["kind"] == "barks":
        old, new = before.get("lines") or [], after.get("lines") or []
        if [b.get("id") for b in new] != [b.get("id") for b in old]:
            log.append("line ids changed; matched by position")
        fixed = []
        for i, b in enumerate(old):
            n = dict(new[i]) if i < len(new) else dict(b)
            for k in LOCKED["barks"]:
                if n.get(k) != b.get(k):
                    if k in n:
                        log.append(f"{b.get('id')}.{k} restored")
                    n[k] = b.get(k)
            fixed.append({k: n.get(k) for k in ("id", "event", "when", "style", "priority", "text", "claims")})
        after["lines"] = fixed
    elif before["kind"] == "batch":
        new = {it.get("id"): it for it in after.get("items") or []}
        after["items"] = [dict(it, text=it["text"] if it.get("locked") else (new.get(it["id"]) or it).get("text", it["text"])) for it in before.get("items") or []]
        if any(it.get("locked") and (new.get(it["id"]) or it).get("text") != it["text"] for it in before.get("items") or []):
            log.append("a locked line (U1) restored")
    elif before["kind"] == "notices":
        old, new = before.get("items") or [], {it.get("id"): it for it in after.get("items") or []}
        fixed = []
        for it in old:
            n = dict(new.get(it.get("id"), it))
            for k in ITEM_LOCKED:
                if n.get(k) != it.get(k):
                    if k in n:
                        log.append(f"{it.get('id')}.{k} restored")
                    n[k] = it.get(k)
            fixed.append({k: n.get(k) for k in ("id", "where", "text") + ITEM_LOCKED[2:] if n.get(k) is not None or k == "text"})
        after["items"] = fixed
    else:
        for k in LOCKED[before["kind"]]:
            if after.get(k) != before.get(k):
                log.append(f"{k} restored")
                after[k] = before.get(k)
    return after


def refine(case, piece, ev, rnd):
    pack, _ = canon(piece, case.withhold, case.facts)
    msg = "\n\n".join([slot_text(piece), pack, "CONTENT\n" + json.dumps(piece, indent=1, ensure_ascii=False), "EVALUATION\n" + ev["raw"]])
    raw = llm.call(case, "refiner", msg, f"f{rnd}")
    log = []
    try:
        out = restore(piece, llm.parse_json(raw), log)
    except (ValueError, json.JSONDecodeError) as e:
        log.append(f"unparseable reply ({e}); retried")
        raw = llm.call(case, "refiner", msg + "\n\nYour previous reply was not one JSON object. Output only the JSON object.", f"f{rnd}b")
        out = restore(piece, llm.parse_json(raw), log)
    case.save(f"f{rnd}_piece.json", out)
    return out, log


def generate(case, spec):
    slot = spec["slot"]
    pack, _ = canon(slot, case.withhold, case.facts)
    msg = "\n\n".join([slot_text(slot), pack.replace("CANON", "CONTEXT", 1), "SLOT SKELETON (fill it)\n" + json.dumps(slot, indent=1, ensure_ascii=False),
                       "REQUEST\n" + spec["request"]])
    raw = llm.call(case, "generator", msg, "g0")
    log = []
    piece = restore(slot, llm.parse_json(raw), log)
    case.save("r0_piece.json", piece)
    return piece, log


# ---------------------------------------------------------------- the loop
def run_piece(case, spec, piece=None):
    """Generate (unless given a piece), then evaluate → refine → evaluate until the target or the cap.
    A 10/10 is accepted only when a fresh evaluator call confirms it (style.loop.confirmations); a dissent goes on as a REASON."""
    t0 = time.time()
    rounds, logs = [], []
    case.withhold = bool(spec.get("withhold_shipped"))
    case.facts = spec.get("slot_facts")
    if piece is None:
        piece, log = generate(case, spec)
        logs += [f"g0: {x}" for x in log]
    else:
        case.save("r0_piece.json", piece)
    versions = [piece]
    target, cap, need = P["style.loop.targetScore"], P["style.loop.maxRounds"], P["style.loop.confirmations"]
    ev = dict(evaluate(case, piece, 1), version=0, kind="evaluation")
    rounds.append(ev)
    accepted, n = False, 1
    while True:
        conf = 0
        while ev["score"] == target and conf < need:
            conf += 1
            n += 1
            ev = dict(evaluate(case, piece, f"{len(versions)}c{conf}"), version=len(versions) - 1, kind="confirmation")
            rounds.append(ev)
        if ev["score"] == target:
            accepted = True
            break
        if len(versions) - 1 >= cap:
            break
        piece, log = refine(case, piece, ev, len(versions))
        logs += [f"f{len(versions)}: {x}" for x in log]
        versions.append(piece)
        ev = dict(evaluate(case, piece, len(versions)), version=len(versions) - 1, kind="evaluation")
        rounds.append(ev)
    summary = {"case": case.name, "class": spec.get("class"), "title": spec.get("title"), "request": spec.get("request"),
               "scores": [x["score"] for x in rounds], "kinds": [x["kind"] for x in rounds], "refinements": len(versions) - 1,
               "accepted": accepted, "final_version": len(versions) - 1,
               "seconds": round(time.time() - t0, 1), "calls": case.calls, "restored": logs,
               "cost_usd": round(sum(c.get("cost_usd") or 0 for c in case.calls), 4)}
    case.save("summary.json", summary)
    case.save("trace.md", trace(spec, versions, rounds, summary))
    return summary


def score_line(s):
    return " → ".join(("✓" if k == "confirmation" else "") + f"{x}" for x, k in zip(s["scores"], s.get("kinds") or ["evaluation"] * len(s["scores"])))


def show(piece):
    if piece["kind"] == "barks":
        rows = ["| Line | Event | Tier | Style | Text | Chars |", "|---|---|---|---|---|---|"]
        for b in piece.get("lines") or []:
            w = b.get("when") or {}
            rows.append(f"| {b.get('id')} | {b.get('event')} | {w.get('tier', '—')} | {b.get('style')} | {str(b.get('text')).replace('|', '/').replace(chr(10), ' ⏎ ')} | {len(str(b.get('text') or ''))} |")
        return "\n".join(rows)
    if piece["kind"] == "batch":
        rows = ["| Item | Text | Words |", "|---|---|---|"]
        rows += [f"| {it['id']} | {str(it.get('text')).replace('|', '/')} | {len(str(it.get('text') or '').split())} |" for it in piece.get("items") or []]
        return "\n".join(rows)
    if piece["kind"] == "notices":
        rows = ["| Notice | Where | Text | Words |", "|---|---|---|---|"]
        rows += [f"| {it.get('id')} | {it.get('where')} | {str(it.get('text')).replace('|', '/')} | {len(str(it.get('text') or '').split())} |" for it in piece.get("items") or []]
        return "\n".join(rows)
    if piece["kind"] == "credits":
        return "\n".join("> " + str(x) for x in piece.get("lines") or [])
    k = {"tale": "tale", "brief": "brief", "act": "intro", "ending": "ending"}[piece["kind"]]
    head = f"**{piece.get('label')}**\n\n" if piece["kind"] == "brief" else ""
    txt = str(piece.get(k) or "")
    return f"{head}> {txt.replace(chr(10), ' ⏎ ')}\n\n{len(txt)} characters."


def trace(spec, versions, rounds, s):
    L = [f"# {s['case']}" + (f" · {s['class']}" if s.get("class") else "") + (f" · {s['title']}" if s.get("title") else ""), "",
         f"- **Scores:** {score_line(s)} (✓ = a fresh confirming evaluation). **{'Accepted' if s['accepted'] else 'Stopped at the round cap'}** after {s['refinements']} refinement(s).",
         f"- **Calls:** {len(s['calls'])} · {s['seconds']} s · ${s['cost_usd']}. Models: generator {llm.MODELS['generator']}, evaluator {llm.MODELS['evaluator']}, refiner {llm.MODELS['refiner']}."]
    if spec.get("request"):
        L += ["- **Generator request:**", "", "> " + spec["request"].replace("\n", "\n> ")]
    if s["restored"]:
        L += ["- **Slot fields restored:** " + "; ".join(s["restored"])]
    shown, k = -1, 0
    for ev in rounds:
        i = ev["version"]
        if i != shown:
            title = "Before (generator)" if i == 0 and spec.get("request") else "Before (input)" if i == 0 else f"After refinement {i} (refiner)"
            L += ["", f"## {title}", "", show(versions[i])]
            shown = i
        k += 1
        L += ["", f"### {'Confirmation' if ev['kind'] == 'confirmation' else 'Evaluation'} {k}: {ev['score']}/10", ""]
        if ev["lint"] and ev["kind"] == "evaluation":
            L += ["Lint evidence:", ""] + [f"- {x['path']} · {x['rule']} ({x['severity']}) {x['measured']}" for x in ev["lint"]] + [""]
        L += ["```", ev["raw"], "```"]
        if ev["format_retry"]:
            L += ["", "_The loop returned the evaluator's first reply once for a format or arithmetic problem._"]
    return "\n".join(L) + "\n"


# ---------------------------------------------------------------- the jobs
def new_run(tag):
    rid = time.strftime("%Y%m%d-%H%M%S") + "-" + tag
    d = RUNS / rid
    d.mkdir(parents=True, exist_ok=True)
    (d / "STYLE_GUIDE.snapshot.md").write_text((STYLE / GUIDES[VERSION]["file"]).read_text(encoding="utf-8"), encoding="utf-8")   # the guide this run read
    return d


def run_all(run_dir, jobs, workers):
    with ThreadPoolExecutor(max_workers=workers) as ex:
        futs = [ex.submit(fn, *a) for fn, a in jobs]
        out = []
        for f in futs:
            try:
                out.append(f.result())
            except Exception as e:      # one failed case never stops the others
                out.append({"case": "?", "error": str(e)[:400]})
        return out


def job_case(run_dir, spec):
    try:
        return run_piece(Case(run_dir, spec["id"]), spec)
    except Exception as e:
        return {"case": spec["id"], "error": f"{type(e).__name__}: {str(e)[:300]}"}


def job_piece(run_dir, name, piece, spec):
    (Path(run_dir) / name).mkdir(parents=True, exist_ok=True)   # the guide this piece read: a later stage may run on a later guide
    (Path(run_dir) / name / "STYLE_GUIDE.snapshot.md").write_text((STYLE / GUIDES[VERSION]["file"]).read_text(encoding="utf-8"), encoding="utf-8")
    try:
        return run_piece(Case(run_dir, name), spec, piece=piece)
    except Exception as e:
        return {"case": name, "error": f"{type(e).__name__}: {str(e)[:300]}"}


def run_trace(run_dir, title, results, note=""):
    L = [f"# {title}", "", f"Run `{run_dir.name}`. Loop: generate → evaluate → refine → evaluate, until {P['style.loop.targetScore']}/10 or {P['style.loop.maxRounds']} refinements "
         f"(`style.loop.targetScore`, `style.loop.maxRounds`). Guide: `style/{llm.GUIDE['file']}`.", ""]
    if note:
        L += [note, ""]
    L += ["Scores in order; ✓ marks a fresh evaluator call confirming a 10/10 (`style.loop.confirmations`).", "",
          "| Case | Class | Scores | Refinements | Result | Cost |", "|---|---|---|---|---|---|"]
    for s in results:
        if "error" in s:
            L.append(f"| {s['case']} | — | error: {s['error'][:80]} | — | — | — |")
            continue
        L.append(f"| [{s['case']}]({s['case']}/trace.md) | {s.get('class') or '—'} | {score_line(s)} | {s['refinements']} | "
                 f"{'accepted' if s['accepted'] else 'stopped'} | ${s['cost_usd']} |")
    ok = [s for s in results if "error" not in s]
    L += ["", f"{sum(s['accepted'] for s in ok)} of {len(ok)} accepted at 10/10. Total ${round(sum(s['cost_usd'] for s in ok), 2)}."]
    (run_dir / "trace.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    (run_dir / "results.json").write_text(json.dumps(results, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def examples(workers):
    specs = json.loads((STYLE / "cases" / "examples.json").read_text(encoding="utf-8"))["cases"]
    run_dir = new_run("examples")
    res = run_all(run_dir, [(job_case, (run_dir, s)) for s in specs], workers)
    run_trace(run_dir, "Style Guide Agent: three adversarial examples", res)
    return run_dir


D78_REQUEST = ("Write the four impact barks a car says when it hits the dummy on this tile, one per price tier (01 Luxury, 02 Corporate, "
               "03 Consumer, 04 Budget). Each line names this tile's place: its landmark from the title or the tale, or the district. "
               "Never the grid code. Each in its tier's voice, at most 48 characters, true to an impact on this tile. Pick each line's style.")


def d78(district, workers):
    d = DIST[district]
    run_dir = new_run(f"d78-{district}")
    n0 = {"monument": 100, "parkland": 200, "waterfront": 300}[district]
    jobs = []
    for i, tile in enumerate(d["order"]):
        lines = [{"id": f"t{n0 + i * 4 + j + 1:03d}", "event": "impact", "when": {"district": district, "tile": tile, "tier": tier},
                  "style": None, "priority": 2, "text": "", "claims": [f"district:{district}", f"tile:{tile}"]} for j, tier in enumerate(["01", "02", "03", "04"])]
        spec = {"id": f"{CODE[district]}{tile}", "class": "D78 tile barks", "title": f"{d['name']} {tile} · {d['tiles'][tile]['title']}",
                "slot": {"kind": "barks", "lines": lines}, "request": D78_REQUEST}
        jobs.append((job_case, (run_dir, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, f"D78 proposal: tile barks for {d['name']}", res,
              "Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`.")
    lines = []
    for s in res:
        if "error" in s:
            continue
        fin = json.loads((run_dir / s["case"] / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
        lines += [dict(b, accepted=s["accepted"]) for b in fin["lines"]]
    (run_dir / "tile_lines.json").write_text(json.dumps({"district": district, "stage": "per tile", "lines": lines}, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    d78_batch(run_dir, res)
    return run_dir


def d78_batch(run_dir, res=None):
    """Stage 2: the district's lines as one batch, so the evaluator sees what no single tile shows (T11: repeated endings)."""
    run_dir = Path(run_dir)
    if res is None:
        res = json.loads((run_dir / "results.json").read_text(encoding="utf-8"))
        res = [r for r in res if r.get("case") != "batch"]
    tl = json.loads((run_dir / "tile_lines.json").read_text(encoding="utf-8"))
    piece = {"kind": "barks", "lines": [{k: v for k, v in b.items() if k != "accepted"} for b in tl["lines"]]}
    d = DIST[tl["district"]]
    spec = {"id": "batch", "class": "D78 batch", "title": f"all {len(piece['lines'])} {d['name']} lines as one batch"}
    s = job_piece(run_dir, "batch", piece, spec)
    run_trace(run_dir, f"D78 proposal: tile barks for {d['name']}", list(res) + [s],
              "Real content for an open decision. The lines stay in this run (decision 542). They test a proposed `tile` condition beside `district`. "
              "Stage 1 runs the loop per tile; stage 2 (`batch`) runs it on the district's lines together.")
    if "error" not in s:
        fin = json.loads((run_dir / "batch" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
        out = {"district": tl["district"], "decision": "D78 (open); decision 542", "batch_scores": s["scores"], "accepted": s["accepted"], "lines": fin["lines"]}
        (run_dir / "proposal_lines.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return run_dir


def audit(workers):
    run_dir = new_run("audit")
    jobs = []
    for name, piece in lint.shipped():
        if piece["kind"] == "barks":
            continue
        spec = {"id": name.replace(" ", "-"), "class": "audit", "title": "shipped " + name}
        jobs.append((job_piece, (run_dir, spec["id"], piece, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Audit: Farsight's shipped copy", res,
              "Every shipped tale, brief, act line and the ending through the loop. A 10/10 needs no refinement. The refined text stays in this run (decision 542).")
    return run_dir


V8_NOTICES = [   # Prototype 7.13's interface texts that name Farsight or run past two sentences: the slots Prototype 8 rewrites (GDD Edit 95)
    ("n01", "title screen, under DUMMIES", "You are a FARSIGHT crash-test subject. Cars avoid you. Fool them into hitting you.", False, [], 110),
    ("n02", "Arcade's district screen, under DUMMIES", "Welcome, test subject. The fleet will avoid you. Kindly be struck, in the accidents FARSIGHT says cannot happen.", False, [], 120),
    ("n03", "the title's STORY card", "The Test City, tile by tile. Each tile wants its write-offs to Farsight's brief.", False, [], 100),
    ("n04", "the tile card's header", "FARSIGHT BRIEF", True, [], 18),
    ("n05", "the story map's side panel", "FARSIGHT BRIEF · {LABEL}", True, ["{LABEL}"], 40),
    ("n06", "the objective strip's label while a drone flies", "FARSIGHT DRONE", True, [], 18),
    ("n07", "a toast", "FARSIGHT DRONE · DELIVERING {PART}", True, ["{PART}"], 44),
    ("n08", "a toast", "FARSIGHT DRONE · {PART} ON BOARD · THEN {TILE}", True, ["{PART}", "{TILE}"], 54),
    ("n09", "a toast", "FARSIGHT DRONE · CARRYING YOU TO {TILE}", True, ["{TILE}"], 46),
    ("n10", "the gift screen, before the part lands", "FARSIGHT DRONE · INCOMING", True, [], 28),
    ("n11", "a toast", "FARSIGHT GIFT · +{N} CREDITS", True, ["{N}"], 32),
    ("n12", "the gift screen, the next part", "NEXT FROM FARSIGHT", True, [], 26),
    ("n13", "the workshop, a part not yet issued", "A Farsight drone brings this part.", False, [], 44),
    ("n14", "the workshop's note, a part not yet issued", "A Farsight drone brings this part. Keep testing.", False, [], 56),
    ("n15", "a toast, a part not yet issued", "A Farsight drone brings that part", False, [], 44),
    ("n16", "the Controls list, a verb not yet issued", "A Farsight drone brings it", False, [], 34),
    ("n17", "a toast, the chassis in the river", "FARSIGHT drone dispatched: chassis in the river", False, [], 56),
    ("n18", "a toast, a cone in the way", "FARSIGHT drone dispatched. Obstruction will be relocated.", False, [], 64),
    ("n19", "a toast, the chassis recovered", "FARSIGHT drone: chassis recovered from the river", False, [], 56),
    ("n20", "Arcade's ending, LICENSED", "Contract complete. FARSIGHT thanks you for your cooperation.", False, [], 80),
    ("n21", "Arcade's ending, FAILED TEST", "Traffic exhausted. Contract incomplete. Please retry.", False, [], 70),
    ("n22", "the frame's wordmark, title and menus", "FARSIGHT", True, [], 20),
    ("n23", "Monument A1's LED wall, third line under WELCOME and NEW STAFF (pixel signage)", "FARSIGHT", True, [], 10),
]
V8_BARKS = ["b013", "b034", "b041", "b052", "b058", "b061", "b062", "b081", "b083", "b110", "c024"]   # over two sentences, or naming Farsight
V8_CREDITS = ["DUMMIES", "A game by Lawrence Lek", "Published by Farsight"]


def v8(workers):
    """Prototype 8's text (GDD Edit 95): every Prototype 7.13 text that breaks Style Guide V2, through the loop on V2."""
    run_dir = new_run("v8")
    jobs = []
    for name, piece in lint.shipped():
        if piece["kind"] == "barks":
            continue
        spec = {"id": name.replace(" ", "-"), "class": "V8 " + piece["kind"], "title": "Prototype 7.13 " + name + ", for Prototype 8"}
        jobs.append((job_piece, (run_dir, spec["id"], piece, spec)))
    notices = {"kind": "notices", "items": [dict({"id": i, "where": w, "text": t, "caps": c, "maxChars": m}, **({"placeholders": ph} if ph else {}),
                                                 **({"sign": True} if i == "n23" else {})) for i, w, t, c, ph, m in V8_NOTICES]}
    jobs.append((job_piece, (run_dir, "notices", notices, {"id": "notices", "class": "V8 notices", "title": "Prototype 7.13's interface texts, for Prototype 8"})))
    bk = {b["id"]: b for b in FLEET["barks"]}
    barks = {"kind": "barks", "lines": [bk[i] for i in V8_BARKS]}
    jobs.append((job_piece, (run_dir, "barks", barks, {"id": "barks", "class": "V8 barks", "title": "Barks over two sentences, or naming Farsight"})))
    jobs.append((job_piece, (run_dir, "credits", {"kind": "credits", "lines": V8_CREDITS}, {"id": "credits", "class": "V8 credits", "title": "The Credits card"})))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Prototype 8's text on Style Guide V2", res, V8_NOTE)
    v8_collect(run_dir, res)
    v8_batch(run_dir)
    v8_banners(run_dir)
    v8_review(run_dir)
    return run_dir


def v8_batch(run_dir):
    """Stage 2 of --v8: the story's 31 texts as one batch (T14: one slogan leaned on; V10: the purpose stated)."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    items = []
    for d in STORY["districts"]:
        items.append({"id": f"act-{d['id']}", "kind": "act", "district": d["id"], "text": c["acts"][d["id"]]})
        items += [{"id": f"{CODE[d['id']]}{t}", "kind": "tale", "district": d["id"], "tile": t, "text": c["tales"][d["id"]][t]} for t in d["order"]]
    items.append({"id": "ending", "kind": "ending", "text": c["ending"]})
    s = job_piece(run_dir, "story-batch", {"kind": "batch", "items": items}, {"id": "story-batch", "class": "V8 batch", "title": "The story's 31 texts as one batch"})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / "story-batch" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    for it in fin["items"]:
        if it["kind"] == "act":
            c["acts"][it["district"]] = it["text"]
        elif it["kind"] == "tale":
            c["tales"][it["district"]][it["tile"]] = it["text"]
        else:
            c["ending"] = it["text"]
    c["accepted"]["story-batch"] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != "story-batch"] + [s]
    run_trace(run_dir, "Prototype 8's text on Style Guide V2", res, V8_NOTE)
    return run_dir


V8_BANNERS = [   # Arcade's opening banner: each district's mood line (prototypes/p6/world6.js), drawn under its label in Prototype 8
    ("n24", "monument", "Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument."),
    ("n25", "parkland", "Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath."),
    ("n26", "waterfront", "A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill's bridges cross the drive and the river."),
]


def v8_review(run_dir, spec_dir=None, note=None, name="review"):
    """Stage 4 of --v8, on V2.2 (V11): what the player reads in the story, with the title's and Arcade's opening lines, as one batch.
    T14 then counts a slogan across the title and the story; V11 asks every tale for its place. spec_dir: the run that wrote the notices' slots."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    nspec = {it["id"]: it for name in ("notices", "arcade-banners") for it in json.loads((Path(spec_dir or run_dir) / name / "r0_piece.json").read_text(encoding="utf-8"))["items"]}
    items = []
    for i in ("n01", "n02", "n03", "n24", "n25", "n26"):
        items.append({"id": i, "kind": "notice", "where": nspec[i]["where"], "maxChars": nspec[i]["maxChars"], "text": c["notices"][i]})
    for d in STORY["districts"]:
        items.append({"id": f"act-{d['id']}", "kind": "act", "district": d["id"], "text": c["acts"][d["id"]]})
        items += [{"id": f"{CODE[d['id']]}{t}", "kind": "tale", "district": d["id"], "tile": t, "text": c["tales"][d["id"]][t]} for t in d["order"]]
    items.append({"id": "ending", "kind": "ending", "text": c["ending"]})
    s = job_piece(run_dir, name, {"kind": "batch", "items": items}, {"id": name, "class": "V8 batch", "title": "The story's 31 texts and six opening lines, on " + (("V2.6" if name == "review-2" else "V2.5") if note == V82_NOTE else "V2.4" if name == "review-2" else "V2.3" if note else "V2.2")})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / name / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    for it in fin["items"]:
        if it["kind"] == "act":
            c["acts"][it["district"]] = it["text"]
        elif it["kind"] == "tale":
            c["tales"][it["district"]][it["tile"]] = it["text"]
        elif it["kind"] == "notice":
            c["notices"][it["id"]] = it["text"]
        else:
            c["ending"] = it["text"]
    c["accepted"][name] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != name] + [s]
    run_trace(run_dir, "Prototype 8.2's tales on Style Guide V2.5" if note == V82_NOTE else "Prototype 8.1's text on Style Guide V2.3" if note else "Prototype 8's text on Style Guide V2", res, note or V8_NOTE)
    return run_dir


V8_RUN = "20261029-161328-v8"   # Prototype 8's run: the base of Prototype 8.1's text
V81_DISTRICTS = [   # GDD Edit 96 §3.4: the unused CBD and Campus districts (Edit 41), in the lore. (id, where, Prototype 8's text, width)
    ("n27", "Campus: the district's name (sim.js DISTRICTS.campus.name), title case; set in capitals on labels ('2 · NAME'). Campus Quay, Lab Street and Calibration Road are its screens", "FARSIGHT Campus", 26),
    ("n28", "CBD: the district's blurb (sim.js DISTRICTS.cbd.blurb), on the district picker. Its form: towers and barriers; a tower on the centre screen", "Towers and barriers. FARSIGHT Tower stands at the centre.", 90),
    ("n29", "Campus: the district's blurb (sim.js DISTRICTS.campus.blurb), on the district picker. Its form: the test centre the city was modelled on; impact plates on the road score more", "The test centre the city was modelled on. Calibrated plates score more.", 90),
    ("n30", "CBD: the district's opening banner (content.js places.districts.cbd.intro). Two flyovers cross it, one low and one high; a tower at the centre; towers shade the street", "Two flyovers cross the district, one low and one high. FARSIGHT Tower stands at the centre, and towers shade the street.", 120),
    ("n31", "Campus: the district's opening banner (content.js places.districts.campus.intro). Impact plates mark the road at the centre; a hit on a plate pays more", "Impact plates mark the road at the centre. A hit taken on a plate pays more.", 120),
    ("n32", "CBD B2: the centre screen's name (content.js places.districts.cbd.screens.B2), on the map and the screen toast. Its neighbours: Exchange Avenue, Ledger Avenue, Central Quay, Trade Street", "FARSIGHT Tower Plaza", 26),
    ("n33", "the CBD's centre landmark, its theme name (game.js THEME_NAME.tower), in the screen toast 'B2 · NAME'. The other themes: Lantern monument, Fountain square, Roundabout, Test plates", "FARSIGHT Tower", 22),
]
V81_NOTE = ("Prototype 8.1 (GDD Edit 96). Stage 1: Prototype 7.13's 27 tales, as shipped, on V2.3 (a tale may run to 35 words), and the unused CBD and Campus districts' text "
            "(`districts`, notices n27–n33). Stage 2 (`review`): the story with Prototype 8's act lines, ending and six opening lines, as one batch. "
            "Stage 3 (`review-2`): the same batch on V2.4 (no placeholder in a tale). "
            "Everything else is Prototype 8's text (run `" + V8_RUN + "`).")


def v81(workers):
    """Prototype 8.1's text (GDD Edit 96): the tales again, with room for the place, and the CBD and Campus districts."""
    run_dir = new_run("v81")
    jobs = []
    for name, piece in lint.shipped():
        if piece["kind"] == "tale":
            spec = {"id": name.replace(" ", "-"), "class": "V8.1 tale", "title": "Prototype 7.13 " + name + ", for Prototype 8.1"}
            jobs.append((job_piece, (run_dir, spec["id"], piece, spec)))
    dist = {"kind": "notices", "items": [{"id": i, "where": w, "text": t, "caps": False, "maxChars": m} for i, w, t, m in V81_DISTRICTS]}
    jobs.append((job_piece, (run_dir, "districts", dist, {"id": "districts", "class": "V8.1 notices", "title": "The unused CBD and Campus districts"})))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Prototype 8.1's text on Style Guide V2.3", res, V81_NOTE)
    base = json.loads((RUNS / V8_RUN / "v8_copy.json").read_text(encoding="utf-8"))
    new = v8_collect(run_dir, res)
    out = dict(base, run=run_dir.name, base=V8_RUN, guide=GUIDES[VERSION]["file"],
               accepted=dict({f"{V8_RUN}/{k}": v for k, v in base["accepted"].items()}, **new["accepted"]))
    out["tales"] = {d: dict(base["tales"][d], **new["tales"].get(d, {})) for d in base["tales"]}
    out["notices"] = dict(base["notices"], **new["notices"])
    (run_dir / "v8_copy.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    v8_review(run_dir, spec_dir=RUNS / V8_RUN, note=V81_NOTE)
    v8_review(run_dir, spec_dir=RUNS / V8_RUN, note=V81_NOTE, name="review-2")
    return run_dir


V81_RUN = "20261029-172610-v81"   # Prototype 8.1's run: the base of Prototype 8.2's text
V82_NOTE = ("Prototype 8.2 (GDD Edit 97). Stage 1: each tale redrafted by the generator from Prototype 7.13's and 8.1's versions, at the length the tile needs "
            "(15 to 35 words), then evaluated and refined on V2.5. Stage 2 (`review`): the story with the act lines, ending and six opening lines, as one batch. "
            "Stage 3 (`arcade-grades`): the two texts Arcade's grades add (n34, n35). Stage 4 (`review-2`): the batch again on V2.6 (F11: the shortest tale that keeps the tile). "
            "Everything else is Prototype 8.1's text (run `" + V81_RUN + "`).")


def v82(workers):
    """Prototype 8.2's tales (GDD Edit 97): redrafted, 15 to 35 words, the length the tile needs."""
    run_dir = new_run("v82")
    base = json.loads((RUNS / V81_RUN / "v8_copy.json").read_text(encoding="utf-8"))
    jobs = []
    for d in STORY["districts"]:
        for t in d["order"]:
            tile = d["tiles"][t]
            spec = {"id": f"tale-{d['id']}-{t}", "class": "V8.2 tale", "title": f"{d['name']} {t}: {tile['title']}, redrafted",
                    "slot": {"kind": "tale", "district": d["id"], "tile": t, "title": tile["title"], "tale": ""},
                    "request": (f"Redraft the tale for {d['name']} {t} ({tile['title']}). Two earlier versions are source material: use any of their facts and jokes, "
                                f"copy neither whole.\n- Prototype 7.13 (Farsight's voice; Farsight must not appear): {tile['tale']}\n"
                                f"- Prototype 8.1 (Dummy Corporation): {base['tales'][d['id']][t]}\n"
                                "Choose the length the tile needs, 15 to 35 words in at most two sentences: short when one image carries it, longer when the place has a history worth telling. "
                                "Name the place, keep the duty and any equipment the tile issues, and point the place at the training.")}
            jobs.append((job_case, (run_dir, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Prototype 8.2's tales on Style Guide V2.5", res, V82_NOTE)
    new = v8_collect(run_dir, res)
    out = dict(base, run=run_dir.name, base=V81_RUN, guide=GUIDES[VERSION]["file"],
               accepted=dict({(k if "/" in k else f"{V81_RUN}/{k}"): v for k, v in base["accepted"].items() if not k.startswith("tale-")}, **new["accepted"]))
    out["tales"] = {d: dict(base["tales"][d], **new["tales"].get(d, {})) for d in base["tales"]}
    (run_dir / "v8_copy.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    v8_review(run_dir, spec_dir=RUNS / V8_RUN, note=V82_NOTE)
    v82_notices(run_dir)
    v8_review(run_dir, spec_dir=RUNS / V8_RUN, note=V82_NOTE, name="review-2")
    return run_dir


V82_NOTICES = [   # GDD Edit 97: Arcade's grades (arcade.grades). (id, where, Prototype 8.1's text or a placeholder draft, caps, placeholders, width)
    ("n34", "the title's ARCADE card, under the word ARCADE: what an Arcade run is. Facts: one district; every few write-offs the grade rises, with a tougher chassis and denser traffic; the run ends when the shift's cars run out; the score is the points. Three lines of about 30 characters",
     "Pick one district and write off its quota. The score is the run.", False, [], 90),
    ("n35", "Arcade: the toast, and the write-off report's header, when the grade rises. A caps label; {G} is the new grade. Facts: the next chassis is tougher (more health); traffic is denser",
     "GRADE {G} · TOUGHER CHASSIS · DENSER TRAFFIC", True, ["{G}"], 46),
]


def v82_notices(run_dir):
    """Stage 3 of --v82: the two texts Arcade's grades add (n34 the title card, n35 the grade label)."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    piece = {"kind": "notices", "items": [dict({"id": i, "where": w, "text": t, "caps": cp, "maxChars": m}, **({"placeholders": ph} if ph else {})) for i, w, t, cp, ph, m in V82_NOTICES]}
    s = job_piece(run_dir, "arcade-grades", piece, {"id": "arcade-grades", "class": "V8.2 notices", "title": "Arcade's grades: the title card and the grade label"})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / "arcade-grades" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    c["notices"].update({it["id"]: it["text"] for it in fin["items"]})
    c["accepted"]["arcade-grades"] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != "arcade-grades"] + [s]
    run_trace(run_dir, "Prototype 8.2's tales on Style Guide V2.5", res, V82_NOTE)
    return run_dir


V82_RUN = "20261029-181530-v82"   # Prototype 8.2's run: the base of Prototype 8.3's text
V83_USER = {   # GDD Edit 98 §0: the user's own lines (U1), "!" dropped (ruling: deadpan)
    "tale:monument:A1": "Fresh off the factory floor, you're ready to do some damage to yourself. Make your engineers proud.",
    "brief:any": "Walk into the path of the incoming vehicles. Time your approach, and choose your angle carefully. Bonus points for combinations and lethal hits.",
    "n03": "Get your Dummy Certification in Shenzhen Smart City and learn about the Corporation.",
    "n34": "Get hit in fun, creative, and destructive ways before the vehicles run out.",
}
V83_NOTICES = [   # (id, where, width): the generator writes them
    ("n36", "the intro screen, under DUMMIES, before the mode select: the one line that tells a new player what to do, in both modes. Quirky but obvious. Facts: you are a crash-test dummy; you want the cars to hit you; the cars avoid you; combos score more; upgrades come with progress", 110),
    ("n37", "Arcade's level card, the goal line under the district's line, in bold after '>>>': what to do in an Arcade shift. Facts: write off bodies; every {Q} write-offs the grade rises (tougher chassis, denser traffic); the run ends when the shift's vehicles run out; the score is the points. {Q} is the district's quota, a placeholder the game fills", 110),
]
V83_NOTE = ("Prototype 8.3 (GDD Edit 98). Stage 1 on V2.7: 26 tales cut to 15 to 20 words from Prototype 8.2's; 10 briefs rewritten as goals; n36 and n37 written by the generator. "
            "The user's own lines (U1: Monument A1's tale, the any goal, n03, n34) are placed as written. Stage 2 (`review`): the story with the opening lines as one batch, the user's lines locked. "
            "Stage 3 (`intro-line`): n36 redrafted by hand for humour, then evaluated and refined. "
            "Everything else is Prototype 8.2's text (run `" + V82_RUN + "`).")


def v83(workers):
    """Prototype 8.3's text (GDD Edit 98): tales of 15 to 20 words, goals, the intro line and Arcade's goal; the user's lines kept."""
    run_dir = new_run("v83")
    base = json.loads((RUNS / V82_RUN / "v8_copy.json").read_text(encoding="utf-8"))
    jobs = []
    for d in STORY["districts"]:
        for t in d["order"]:
            if f"tale:{d['id']}:{t}" in V83_USER:
                continue
            piece = {"kind": "tale", "district": d["id"], "tile": t, "title": d["tiles"][t]["title"], "tale": base["tales"][d["id"]][t]}
            jobs.append((job_piece, (run_dir, f"tale-{d['id']}-{t}", piece, {"id": f"tale-{d['id']}-{t}", "class": "V8.3 tale", "title": f"{d['name']} {t}, cut to 15 to 20 words"})))
    for k, b in base["briefs"].items():
        if f"brief:{k}" in V83_USER:
            continue
        piece = {"kind": "brief", "task": k, "label": b["label"], "brief": b["brief"]}
        jobs.append((job_piece, (run_dir, f"brief-{k}", piece, {"id": f"brief-{k}", "class": "V8.3 goal", "title": f"the {k} brief, as a goal"})))
    spec = {"id": "notices-83", "class": "V8.3 notices", "title": "The intro line (n36) and Arcade's goal (n37)",
            "slot": {"kind": "notices", "items": [{"id": i, "where": w, "text": "", "caps": False, "maxChars": m} for i, w, m in V83_NOTICES]},
            "request": ("Write n36 and n37. n36: one line for the intro screen that tells a new player what to do. The user's draft, to make funnier while keeping it obvious: "
                        "'Find new ways to make the cars hit you. Combo bonuses and upgrades await. Make Dummy Corporation proud.' "
                        "n37: Arcade's goal, simple and direct, with {Q} for the write-offs per grade.")}
    jobs.append((job_case, (run_dir, spec)))
    res = run_all(run_dir, jobs, workers)
    run_trace(run_dir, "Prototype 8.3's text on Style Guide V2.7", res, V83_NOTE)
    new = v8_collect(run_dir, res)
    out = dict(base, run=run_dir.name, base=V82_RUN, guide=GUIDES[VERSION]["file"], user=V83_USER,
               accepted=dict({(k if "/" in k else f"{V82_RUN}/{k}"): v for k, v in base["accepted"].items() if not k.startswith(("tale-", "brief-", "review"))}, **new["accepted"]))
    out["tales"] = {d: dict(base["tales"][d], **new["tales"].get(d, {})) for d in base["tales"]}
    out["tales"]["monument"]["A1"] = V83_USER["tale:monument:A1"]
    out["briefs"] = dict(base["briefs"], **new["briefs"]); out["briefs"]["any"] = dict(base["briefs"]["any"], brief=V83_USER["brief:any"])
    out["notices"] = dict(base["notices"], **new["notices"], n03=V83_USER["n03"], n34=V83_USER["n34"])
    (run_dir / "v8_copy.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    v83_review(run_dir)
    return run_dir


V83_INTRO = ("Self-driving cars are designed never to hit anyone. Prove the design wrong, in combos, and earn upgrades.")


def v83_intro(run_dir):
    """Stage 3 of --v83: the intro line (n36), redrafted by hand for the humour the generator's draft lacked, then evaluated and refined."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    piece = {"kind": "notices", "items": [{"id": "n36", "where": [w for i, w, m in V83_NOTICES if i == "n36"][0], "text": V83_INTRO, "caps": False, "maxChars": 110}]}
    s = job_piece(run_dir, "intro-line", piece, {"id": "intro-line", "class": "V8.3 notices", "title": "The intro line (n36), a hand draft through the loop"})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / "intro-line" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    c["notices"]["n36"] = fin["items"][0]["text"]; c["accepted"]["intro-line"] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != "intro-line"] + [s]
    run_trace(run_dir, "Prototype 8.3's text on Style Guide V2.7", res, V83_NOTE)
    return run_dir


def v83_review(run_dir):
    """Stage 2 of --v83: the story and the opening lines as one batch; the user's lines locked (U1)."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    widths = {i: m for i, w, m in V83_NOTICES}
    for name in ("notices", "arcade-banners"):
        for it in json.loads((RUNS / V8_RUN / name / "r0_piece.json").read_text(encoding="utf-8"))["items"]:
            widths[it["id"]] = it["maxChars"]
    where = {"n36": "the intro screen's line", "n02": "Arcade's district screen", "n03": "the STORY card", "n34": "the ARCADE card",
             "n24": "Monument's line on Arcade's level card", "n25": "Parkland's line on Arcade's level card", "n26": "Waterfront's line on Arcade's level card", "n37": "Arcade's goal"}
    items = [dict({"id": i, "kind": "notice", "where": where[i], "maxChars": widths.get(i, 110), "text": c["notices"][i]}, **({"locked": True} if i in V83_USER else {})) for i in where]
    for d in STORY["districts"]:
        items.append({"id": f"act-{d['id']}", "kind": "act", "district": d["id"], "text": c["acts"][d["id"]]})
        items += [dict({"id": f"{CODE[d['id']]}{t}", "kind": "tale", "district": d["id"], "tile": t, "text": c["tales"][d["id"]][t]}, **({"locked": True} if f"tale:{d['id']}:{t}" in V83_USER else {})) for t in d["order"]]
    items.append({"id": "ending", "kind": "ending", "text": c["ending"]})
    s = job_piece(run_dir, "review", {"kind": "batch", "items": items}, {"id": "review", "class": "V8 batch", "title": "The story and the opening lines, on V2.7; the user's lines locked"})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / "review" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    for it in fin["items"]:
        if it.get("locked"):
            continue
        if it["kind"] == "act":
            c["acts"][it["district"]] = it["text"]
        elif it["kind"] == "tale":
            c["tales"][it["district"]][it["tile"]] = it["text"]
        elif it["kind"] == "notice":
            c["notices"][it["id"]] = it["text"]
        else:
            c["ending"] = it["text"]
    c["accepted"]["review"] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != "review"] + [s]
    run_trace(run_dir, "Prototype 8.3's text on Style Guide V2.7", res, V83_NOTE)
    return run_dir


V8_NOTE = ("Each piece starts as Prototype 7.13 shipped it. The evaluator grades it on V2; the refiner rewrites it; the accepted text goes to Prototype 8. "
           "Stage 1 (45 pieces) ran on V2.0. Stage 2 (`story-batch`) runs the story's 31 texts together, on V2.1 (T14, V10). "
           "Stage 3 (`arcade-banners`) runs Arcade's district banners, found by the text audit. "
           "Stage 4 (`review`) runs the story with the six opening lines, on V2.2 (V11).")


def v8_banners(run_dir):
    """Stage 3 of --v8: Arcade's three district banners, found by Prototype 8's text audit (over two sentences and 20 words)."""
    run_dir = Path(run_dir)
    c = json.loads((run_dir / "v8_copy.json").read_text(encoding="utf-8"))
    piece = {"kind": "notices", "items": [{"id": i, "where": f"Arcade: {DIST[d]['name']}'s opening banner, four seconds at the start of a run, under the label "
                                           f"'DISTRICT n OF 3 · {DIST[d]['name'].upper()} · q WRITE-OFFS'. The text describes the district's streets, as the original does",
                                           "text": t, "caps": False, "maxChars": 110} for i, d, t in V8_BANNERS]}
    s = job_piece(run_dir, "arcade-banners", piece, {"id": "arcade-banners", "class": "V8 notices", "title": "Arcade's district banners"})
    if "error" in s:
        raise RuntimeError(s["error"])
    fin = json.loads((run_dir / "arcade-banners" / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
    c["notices"].update({it["id"]: it["text"] for it in fin["items"]})
    c["accepted"]["arcade-banners"] = s["accepted"]
    (run_dir / "v8_copy.json").write_text(json.dumps(c, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    res = [r for r in json.loads((run_dir / "results.json").read_text(encoding="utf-8")) if r.get("case") != "arcade-banners"] + [s]
    run_trace(run_dir, "Prototype 8's text on Style Guide V2", res, V8_NOTE)
    return run_dir


def v8_collect(run_dir, res=None):
    run_dir = Path(run_dir)
    res = res or json.loads((run_dir / "results.json").read_text(encoding="utf-8"))
    out = {"run": run_dir.name, "guide": GUIDES[VERSION]["file"], "accepted": {}, "tales": {}, "acts": {}, "briefs": {}, "ending": None, "notices": {}, "barks": {}, "credits": None}
    for s in res:
        if "error" in s:
            continue
        d = run_dir / s["case"]
        fin = json.loads((d / (f"f{s['final_version']}_piece.json" if s["final_version"] else "r0_piece.json")).read_text(encoding="utf-8"))
        out["accepted"][s["case"]] = s["accepted"]
        k = fin["kind"]
        if k == "tale":
            out["tales"].setdefault(fin["district"], {})[fin["tile"]] = fin["tale"]
        elif k == "act":
            out["acts"][fin["district"]] = fin["intro"]
        elif k == "brief":
            out["briefs"][fin["task"]] = {"label": fin["label"], "brief": fin["brief"]}
        elif k == "ending":
            out["ending"] = fin["ending"]
        elif k == "notices":
            out["notices"] = {it["id"]: it["text"] for it in fin["items"]}
        elif k == "barks":
            out["barks"] = {b["id"]: {"text": b["text"], "style": b["style"]} for b in fin["lines"]}
        elif k == "credits":
            out["credits"] = fin["lines"]
    (run_dir / "v8_copy.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
    return out


DEDUCTED_RX = re.compile(r"\b([TVFRC]\d{1,2})\s*\((?:blocking|major|minor)")


def main_text(piece):
    if piece["kind"] in ("barks", "notices", "credits"):
        return piece_text(piece)
    return " ".join(str(piece.get(k)) for k in ("label", "brief", "tale", "intro", "ending") if piece.get(k))


def calibration_items():
    spec = json.loads((STYLE / "cases" / "calibration.json").read_text(encoding="utf-8"))
    bark = {b["id"]: b for b in FLEET["barks"]}
    items = []
    for x in spec["shipped"]:
        piece = {"kind": "barks", "lines": [bark[x[5:]]]} if x.startswith("bark ") else dict(lint.shipped_piece(x))
        items.append({"id": x.replace(" ", "-"), "expect": "shipped", "piece": piece})
    for x in spec["seeded"]:
        items.append({"id": x["id"], "expect": "seeded", "rule": x["rule"], "piece": x["piece"], "note": x.get("note", "")})
    return items


def verdict(it, score, reason, findings, cost):
    """Calibration targets (STYLE_GUIDE.md §6). A rule counts as named only on a deduction line."""
    named = set(DEDUCTED_RX.findall(reason))
    lint_rules = {x["rule"] for x in findings}
    if it["expect"] == "shipped" and not lint_rules:
        ok, want = (score or 0) >= P["style.calibration.shippedMin"], f"≥ {P['style.calibration.shippedMin']}"
    elif it["expect"] == "shipped":
        cap = 10 - sum(x["deduct"] for x in findings)
        ok, want = (score or 0) <= cap and lint_rules <= named, f"≤ {cap}, names {', '.join(sorted(lint_rules))}"
    else:
        sev = next(r for r in RULES if r["id"] == it["rule"])["severity"].split()[0]
        cap = 10 - lint.SEV[sev]
        ok, want = (score or 0) <= cap and it["rule"] in named, f"≤ {cap}, names {it['rule']}"
    return {"id": it["id"], "expect": it["expect"], "rule": it.get("rule"), "want": want, "score": score, "ok": ok,
            "named": sorted(named), "lint": sorted(lint_rules), "text": main_text(it["piece"])[:160], "cost_usd": cost}


def calibration_trace(run_dir, res):
    L = ["# Evaluator calibration", "", f"Run `{run_dir.name}`. The evaluator alone, on shipped strings and on seeded violations (`style/cases/calibration.json`). "
         "Targets: STYLE_GUIDE.md §6. \"Deducted\" lists the rules on the REASON's deduction lines.", "",
         "| Item | Kind | Text | Want | Score | Deducted | Hit |", "|---|---|---|---|---|---|---|"]
    for r in res:
        L.append(f"| [{r['id']}](calibration/{r['id']}/e1_output_raw.txt) | {r['expect']}{' · ' + r['rule'] if r['rule'] else ''} | {r['text'].replace('|', '/')[:90]} | {r['want']} | "
                 f"{r['score']}/10 | {', '.join(r['named']) or '—'} | {'yes' if r['ok'] else '**no**'} |")
    sh = [r["score"] for r in res if r["expect"] == "shipped" and r["score"]]
    se = [r["score"] for r in res if r["expect"] == "seeded" and r["score"]]
    judge = [r for r in res if r["expect"] == "seeded" and not r.get("lint")]
    L += ["", f"- **Hits:** {sum(r['ok'] for r in res)} of {len(res)}.",
          f"- **Judgement only** (seeded, no lint finding: {', '.join(r['rule'] for r in judge)}): {sum(r['ok'] for r in judge)} of {len(judge)} hit.",
          f"- **Mean score:** shipped {sum(sh) / max(1, len(sh)):.1f} ({len(sh)}), seeded {sum(se) / max(1, len(se)):.1f} ({len(se)}).",
          f"- **Cost:** ${round(sum(r['cost_usd'] for r in res), 2)}."]
    (run_dir / "trace.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    (run_dir / "results.json").write_text(json.dumps(res, indent=1, ensure_ascii=False) + "\n", encoding="utf-8")


def calibrate(workers):
    items = calibration_items()
    run_dir = new_run("calibration")
    cal = run_dir / "calibration"
    cal.mkdir(exist_ok=True)

    def one(it):
        case = Case(cal, it["id"])
        case.save("piece.json", it["piece"])
        ev = evaluate(case, it["piece"], 1)
        r = verdict(it, ev["score"], ev["reason"], ev["lint"], round(sum(c.get("cost_usd") or 0 for c in case.calls), 4))
        case.save("result.json", dict(r, raw=ev["raw"]))
        return r

    def safe(it):
        try:
            return one(it)
        except Exception as e:     # one failed item never stops the others
            return {"id": it["id"], "expect": it["expect"], "rule": it.get("rule"), "want": "—", "score": None, "ok": False,
                    "named": [], "text": f"error: {str(e)[:120]}", "cost_usd": 0}

    with ThreadPoolExecutor(max_workers=workers) as ex:
        res = list(ex.map(safe, items))
    calibration_trace(run_dir, res)
    return run_dir


def retrace_calibration(run_dir):
    """Recompute a calibration run's verdicts from its saved evaluator replies; no model calls."""
    run_dir = Path(run_dir)
    res = []
    for it in calibration_items():
        d = run_dir / "calibration" / it["id"]
        raw = (d / "e1b_output_raw.txt" if (d / "e1b_output_raw.txt").exists() else d / "e1_output_raw.txt").read_text(encoding="utf-8")
        findings = lint.lint(it["piece"])
        score, _ = check_eval(raw, findings)
        reason = raw.split("REASON:", 1)[-1]
        old = json.loads((d / "result.json").read_text(encoding="utf-8"))
        r = verdict(it, score, reason, findings, old.get("cost_usd", 0))
        (d / "result.json").write_text(json.dumps(dict(r, raw=raw.strip()), indent=1, ensure_ascii=False) + "\n", encoding="utf-8")
        res.append(r)
    calibration_trace(run_dir, res)
    return run_dir


def guide_rules():
    out = []
    for ln in (STYLE / GUIDES[VERSION]["file"]).read_text(encoding="utf-8").splitlines():
        m = re.match(r"^\| ([TVFRC]\d{1,2}) \| ([^|]+) \|.*\| ([a-z ();]+) \|$", ln)
        if m:
            out.append({"id": m.group(1), "speaker": m.group(2).strip(), "severity": m.group(3).strip()})
    return out


RULES = guide_rules()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--examples", action="store_true")
    ap.add_argument("--d78", metavar="DISTRICT")
    ap.add_argument("--d78-batch", metavar="RUN")
    ap.add_argument("--audit", action="store_true")
    ap.add_argument("--calibrate", action="store_true")
    ap.add_argument("--retrace-calibration", metavar="RUN")
    ap.add_argument("--piece", metavar="JSON")
    ap.add_argument("--v8", action="store_true")
    ap.add_argument("--v8-batch", metavar="RUN")
    ap.add_argument("--v8-banners", metavar="RUN")
    ap.add_argument("--v8-review", metavar="RUN")
    ap.add_argument("--v81", action="store_true")
    ap.add_argument("--v81-review2", metavar="RUN")
    ap.add_argument("--v82", action="store_true")
    ap.add_argument("--v82-notices", metavar="RUN")
    ap.add_argument("--v82-review2", metavar="RUN")
    ap.add_argument("--v83", action="store_true")
    ap.add_argument("--v83-review", metavar="RUN")
    ap.add_argument("--v83-intro", metavar="RUN")
    ap.add_argument("--guide", choices=sorted(GUIDES), default=None, help="v1: STYLE_GUIDE.md (default); v2: STYLE_GUIDE_V2.md (--v8 implies v2)")
    ap.add_argument("--workers", type=int, default=6)
    a = ap.parse_args()
    set_guide(a.guide or ("v2" if a.v8 or a.v8_batch or a.v8_banners or a.v8_review or a.v81 or a.v81_review2 or a.v82 or a.v82_notices or a.v82_review2 or a.v83 or a.v83_review or a.v83_intro else "v1"))
    index()
    if a.examples:
        print(examples(a.workers))
    if a.d78:
        print(d78(a.d78, a.workers))
    if a.d78_batch:
        print(d78_batch(a.d78_batch))
    if a.audit:
        print(audit(a.workers))
    if a.calibrate:
        print(calibrate(a.workers))
    if a.retrace_calibration:
        print(retrace_calibration(a.retrace_calibration))
    if a.v8:
        print(v8(a.workers))
    if a.v8_batch:
        print(v8_batch(a.v8_batch))
    if a.v8_banners:
        print(v8_banners(a.v8_banners))
    if a.v8_review:
        print(v8_review(a.v8_review))
    if a.v81:
        print(v81(a.workers))
    if a.v82:
        print(v82(a.workers))
    if a.v83:
        print(v83(a.workers))
    if a.v83_review:
        print(v83_review(a.v83_review))
    if a.v83_intro:
        print(v83_intro(a.v83_intro))
    if a.v82_notices:
        print(v82_notices(a.v82_notices))
    if a.v82_review2:
        print(v8_review(a.v82_review2, spec_dir=RUNS / V8_RUN, note=V82_NOTE, name="review-2"))
    if a.v81_review2:
        print(v8_review(a.v81_review2, spec_dir=RUNS / V8_RUN, note=V81_NOTE, name="review-2"))
    if a.piece:
        run_dir = new_run("piece")
        piece = json.loads(Path(a.piece).read_text(encoding="utf-8"))
        s = run_piece(Case(run_dir, "piece"), {"id": "piece", "title": Path(a.piece).name}, piece=piece)
        run_trace(run_dir, "One piece", [s])
        print(run_dir, s["scores"])
    if not any([a.examples, a.d78, a.d78_batch, a.audit, a.calibrate, a.retrace_calibration, a.piece, a.v8, a.v8_batch, a.v8_banners, a.v8_review, a.v81, a.v81_review2, a.v82, a.v82_notices, a.v82_review2, a.v83, a.v83_review, a.v83_intro]):
        ap.print_help()


if __name__ == "__main__":
    main()
