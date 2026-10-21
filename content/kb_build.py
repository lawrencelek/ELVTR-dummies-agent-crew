#!/usr/bin/env python3
"""Knowledge-base helpers for the P3.3 targets (Submission 4).

  fleet_md(root)            writes content/kb/p3/DUMMIES_Fleet_Canon.md from content/db/fleet.json (every run)
  snapshot(root, src_dir)   copies the P3 GDD edits, decision log and prototype log into content/kb/p3/

The decision log is one long table. The chunker splits at headings, so the snapshot inserts a heading
every ten rows ("## Rows 161–170"); the rows themselves are unchanged.

  python3 content/kb_build.py --snapshot <folder with the project docs>
"""
import json
import re
import shutil
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
KB3 = ROOT / "content" / "kb" / "p3"
DOCS = ["DUMMIES_GDD_Edit37_Art_Direction", "DUMMIES_GDD_Edit38_P3", "DUMMIES_GDD_Edit39_Canon_Lore_City",
        "DUMMIES_GDD_Edit40_Districts_Surfaces", "DUMMIES_GDD_Edit41_City_Districts", "DUMMIES_GDD_Edit42_Levels_Bounds",
        "DUMMIES_GDD_Edit43_Crossings_Buildings_Lights", "DUMMIES_GDD_Edit44_Z_Levels_Platforms", "DUMMIES_Prototype_Log"]
PIPELINE_ID = re.compile(r"^c\d+$")   # lines this pipeline wrote; kept out of the KB so a run never cites its own output


def decisions_with_headings(text):
    out, n = [], 0
    for ln in text.splitlines():
        m = re.match(r"^\|\s*(\d+)\s*\|", ln)
        if m:
            k = int(m.group(1))
            if (k - 1) % 10 == 0 or n == 0:
                lo = (k - 1) // 10 * 10 + 1
                out += ["", f"## Rows {lo}–{lo + 9}", "", "| # | Decision | Status | Reason | Trade-off | Evidence / result |",
                        "|---|---|---|---|---|---|"]
            n += 1
        out.append(ln)
    return "\n".join(out) + "\n"


def snapshot(root, src):
    KB3.mkdir(parents=True, exist_ok=True)
    for d in DOCS:
        shutil.copy(Path(src) / f"{d}.md", KB3 / f"{d}.md")
    text = (Path(src) / "DUMMIES_DECISIONS.md").read_text(encoding="utf-8")
    (KB3 / "DUMMIES_DECISIONS.md").write_text(decisions_with_headings(text), encoding="utf-8")


def fleet_md(root=ROOT):
    d = json.loads((Path(root) / "content" / "db" / "fleet.json").read_text(encoding="utf-8"))
    c = d["canon"]
    L = ["# Fleet database canon", "", "Generated from `content/db/fleet.json` (decision 117). The database is the source; edit it, not this page.", "",
         "## F1 Canon", "", f"- **Setting:** {c['setting']}.", f"- **Company:** {c['company']}.", f"- **Look:** {c['look']}.",
         f"- **Premise:** {c['premise']}", f"- **City names allowed:** {', '.join(c['cities'])}.", "",
         "## F2 Voice", ""] + [f"- {v}" for v in c["voice"]] + \
        ["- Lines are at most 48 characters, end with . ! or ?, and react to logged events only.",
         f"- **Banned words** (never in a line): {', '.join(c['banned'])}.", "", "## F3 Terms", ""] + \
        [f"- **{k}:** {v}" for k, v in c["terms"].items()] + ["", "## F4 Tiers and temperament", "", "| Tier | Name | Temperament | Voice |", "|---|---|---|---|"] + \
        [f"| {t['tier']} | {t['name']} | {t['temperament']} | {t['voice']} |" for t in d["tiers"]] + \
        ["", "## F5 Classes and jobs", "", "| Class | Family | Tag letter | Job | Behaviour |", "|---|---|---|---|---|"] + \
        [f"| {x['class']} | {x['family']} | {x['tagLetter']} | {x['job']} | {x['behaviour']} |" for x in d["classes"]]
    run = [m for m in d["models"] if m["simIds"]]
    L += ["", "## F6 Models in the P3 city", "", "Only these models run in the P3.3 simulation. A line bound to any other model, tier or class never fires.", "",
          "| Model | Tag | Line | Callsign | Tier | Class | Job | Temperament |", "|---|---|---|---|---|---|---|---|"]
    L += [f"| {m['id']} | {m['tag']} | {m['line']} | {m['callsign']} | {m['tier']} | {m['class']} | {m['job']} | {m['temperament']} |" for m in run]
    L += ["", "## F7 Roster (32 type-tiers)", "", "| Model | Tag | Line | Callsign | Job |", "|---|---|---|---|---|"]
    L += [f"| {m['id']} | {m['tag']} | {m['line']} | {m['callsign']} | {m['job']} |" for m in d["models"]]
    L += ["", "## F8 Line conditions and claims", "", "- Shared context a line may test: " + ", ".join(d["context"]) + ".",
          *[f"- **{ev}** carries: " + (", ".join(f) or "no fields") + "." for ev, f in d["events"].items()],
          "- A claim is a fact the line asserts (`stopped`, `zone:front`, `node:hips`, `drop`, `highway`, `plate`, `dropFrom:roof`). Its conditions must guarantee it."]
    by_ev = {}
    for b in d["barks"]:
        if not PIPELINE_ID.match(b["id"]):
            by_ev.setdefault(b["event"], []).append(b)
    for i, (ev, lines) in enumerate(by_ev.items()):
        L += ["", f"## F9.{i + 1} Existing lines: {ev}", "", "| When | Style | Priority | Line |", "|---|---|---|---|"]
        L += [f"| {json.dumps(b['when'], ensure_ascii=False).replace('|', '/')} | {b['style']} | {b['priority']} | {b['text']} |" for b in lines]
    KB3.mkdir(parents=True, exist_ok=True)
    (KB3 / "DUMMIES_Fleet_Canon.md").write_text("\n".join(L) + "\n", encoding="utf-8")


if __name__ == "__main__":
    if len(sys.argv) > 2 and sys.argv[1] == "--snapshot":
        snapshot(ROOT, sys.argv[2])
    fleet_md()
    print("kb/p3 written:", ", ".join(sorted(p.name for p in KB3.glob("*.md"))))
