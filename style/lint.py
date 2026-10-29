#!/usr/bin/env python3
"""Deterministic evidence for the Style Guide Agent (style/STYLE_GUIDE.md). Not a grade.

Measures what is computable in a piece: length, banned terms, "!", casing, digits, grid codes, landmarks,
fields and shape. Each finding names its rule, severity, the quoted text and the measurement. The evaluator
deducts each one (STYLE_GUIDE.md §1); the score is the evaluator's.

  python3 style/lint.py piece.json          # findings as JSON
  python3 style/lint.py --shipped           # every shipped bark, tale, brief, act line and the ending
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FLEET = json.loads((ROOT / "content" / "db" / "fleet.json").read_text(encoding="utf-8"))
STORY = json.loads((ROOT / "content" / "story" / "story.json").read_text(encoding="utf-8"))
PARAMS = {e["id"]: e["default"] for e in json.loads((ROOT / "style" / "style.params.json").read_text(encoding="utf-8"))["entries"]}
SEV = {"blocking": PARAMS["style.score.deduct.blocking"], "major": PARAMS["style.score.deduct.major"], "minor": PARAMS["style.score.deduct.minor"]}

BANNED = [w.lower() for w in FLEET["canon"]["banned"]]
MODE = "v1"   # "v2": STYLE_GUIDE_V2.md (GDD Edit 95, Dummy Corporation); set by loop.py --guide v2
INTENSIFIERS = ["very", "truly", "really", "incredibly", "extremely", "amazing", "amazingly", "awesome", "totally", "absolutely", "super", "hugely", "massively"]
COMPANY_WRONG = re.compile(r"\b(?:dummy\s*corp\b(?!oration)\.?|dummycorp|dummy\s+co\b\.?|dummies\s+(?:inc|corp|ltd)\b)", re.I)
CITIES = ["Beijing", "Shanghai", "Guangzhou", "Chongqing", "Hong Kong", "Chengdu", "Wuhan", "Hangzhou", "Tokyo", "London", "New York",
          "Paris", "Los Angeles", "Las Vegas", "Singapore", "Seoul", "Taipei", "Macau", "Dubai", "Berlin"]   # checks.py list, extended
BRANDS = ["Tesla", "Toyota", "BYD", "Waymo", "Uber", "Nissan", "Honda", "BMW", "Mercedes", "Audi", "Ford", "Volkswagen", "Porsche", "Ferrari",
          "Hyundai", "Volvo", "NIO", "XPeng", "Geely", "Baidu", "Apollo Go", "Pony.ai"]
STYLES = {"speech", "shout", "mutter", "thought"}
PRIORITY = {"writeoff": 3, "impact": 2}           # write-offs 3, hits 2, chatter 1 (content/db/README.md; EDIT26 6.6)
STOCK = re.compile(r"\b(noted|logged|recorded|filed)\.?$", re.I)
PAPERWORK = re.compile(r"\b(policy|form|incident|ticket|case|route|clause|section|code)\s+\d+(\.\d+)*", re.I)
PLACEHOLDER = re.compile(r"\{\w+\}")
GRID = re.compile(r"\b[A-C][1-3]\b")
SPEAKER = re.compile(r"^\s*(?:[A-Z]0[1-4]|(?:" + "|".join(re.escape(m["callsign"]) for m in FLEET["models"]) + r"|Car|Driver|Vehicle|Narrator|Farsight|FARSIGHT|Dispatch)(?:\s*\([^)]*\))?)\s*:\s")
NARRATION_DIGITS = re.compile(r"\b[A-C][1-3]\b|\b(?:Battery|Legs|Hands|Arms)\s[1-3]\b|\bZ[0-2]\b|\bChassis\s0\b|×\{n\}|\{n\}")
PROPOSED_FIELDS = {"tile"}                         # D78 proposal: a tile condition beside the district (decision 542)
# landmark nouns across the Story's 27 tiles and the P3 city (FSG#districts-and-landmarks…); a tile's own text licenses its words
LANDMARKS = ["wall", "conveyor", "skybridge", "bridge", "drum", "tower", "plaque", "shop", "cube", "canyon", "screen", "gateway", "lantern",
             "pavilion", "footbridge", "amphitheatre", "terrace", "arch", "roundabout", "obelisk", "belvedere", "dome", "canal", "duck",
             "reservoir", "pool", "cascade", "ring", "portal", "tunnel", "beach", "ship", "crane", "estuary", "customs", "pier", "stilt",
             "cliff", "circus", "island", "monument", "fountain", "plate", "matting", "river", "expo", "wedding", "gardener", "school"]
DIST = {d["id"]: d for d in STORY["districts"]}


def words(s):
    out = set()
    for w in re.findall(r"[a-z]+", s.lower()):
        out.add(w)
        if len(w) > 3 and w.endswith("es") and w[:-2] in LANDMARKS:
            out.add(w[:-2])
        if len(w) > 3 and w.endswith("s"):
            out.add(w[:-1])
    return out


def tile_vocab(district, tile):
    d = DIST.get(district)
    t = d and d["tiles"].get(tile)
    if not t:
        return None
    return words(" ".join([d["name"], d["act"], d["intro"], t["title"], t["tale"]]))


class Findings(list):
    def add(self, rule, severity, path, quote, measured, source):
        self.append({"rule": rule, "severity": severity, "deduct": SEV[severity], "path": path, "quote": quote, "measured": measured, "source": source})


def common(f, path, text, speaker, sign=False):
    low = text.lower()
    hits = {}
    for w in ([] if speaker == "credits" else BANNED):   # the Credits are extra-diegetic (STYLE_GUIDE_V2.md C1)      # one entry per word in the text: "killed" is one term, not "kill" and "killed"
        alt = "|dying" if w == "die" else "|killing" if w == "kill" else ""
        for m in re.finditer(r"\b(" + re.escape(w) + r"(?:s|d|ed|ing)?" + alt + r")\b", low):
            tok = m.group(1)
            if tok not in hits or tok == w:
                hits[tok] = w
    for tok, w in hits.items():
        f.add("V1", "blocking", path, tok, f"banned term '{w}'" + (f" ('{tok}')" if tok != w else ""), "FLEET#F2")
    for c in CITIES:
        if c.lower() not in BANNED and re.search(r"\b" + re.escape(c.lower()) + r"\b", low) and c not in FLEET["canon"]["cities"]:
            f.add("V2", "blocking", path, c, "a real city other than Shenzhen", "FLEET#F1")
    for b in BRANDS:
        if b.lower() not in BANNED and re.search(r"\b" + re.escape(b.lower()) + r"\b", low):
            f.add("V2", "blocking", path, b, "a real brand", "FLEET#F1")
    if MODE == "v2":
        m = re.search(r"farsight", text, re.I)
        if m and speaker != "credits":
            f.add("V1", "blocking", path, m.group(0), "Farsight is the publisher: named only in the Credits (GDD Edit 95)", "EDIT95#3.1")
        w = re.search(r"\b(" + "|".join(INTENSIFIERS) + r")\b", text, re.I)
        if w and speaker == "company":
            f.add("T13", "minor", path, w.group(1), "an intensifier", "EDIT95#3.2")
        c = COMPANY_WRONG.search(text)
        if c and speaker == "company" and not sign:
            f.add("V4", "major", path, c.group(0), "the company is Dummy Corporation (signage alone may read DUMMY CORP)", "EDIT95#4.2")
        if "!" in text and speaker in ("company", "farsight"):
            f.add("T2", "major", path, text[max(0, text.index("!") - 20):text.index("!") + 1], "'!' in Dummy Corporation's voice", "EDIT95#3.2")
        return
    for m in re.finditer(r"\bfarsight\b", text, re.I):
        tok = m.group(0)
        letters = re.sub(r"[^A-Za-z]", "", text)
        if tok != "Farsight" and not (tok == "FARSIGHT" and letters.isupper()):
            f.add("V4", "minor", path, tok, "write Farsight in a sentence-case string (decision 539)", "DECISIONS#rows-531-540~2")
            break
    if "!" in text:
        if speaker == "farsight":
            f.add("T2", "major", path, text[max(0, text.index("!") - 20):text.index("!") + 1], "'!' in Farsight's narration", "EDIT92#3")


def bark(f, i, b, batch_stock):
    path, text = f"lines[{i}]", str(b.get("text") or "")
    w, ev, style = b.get("when") or {}, b.get("event"), b.get("style")
    common(f, path + ".text", text, "car")
    if "!" in text and style != "shout" and w.get("tier") != "04":
        f.add("T10", "major", path + ".text", text, f"'!' in a {style} bark, tier {w.get('tier', 'free')}", "DECISIONS#rows-541-550")
    if MODE == "v2":
        ns = len([x for x in re.split(r"(?<=[.!?])\s+", text.strip()) if x])
        if ns > PARAMS["style.v2.text.maxSentences"]:
            f.add("F9", "blocking", path + ".text", text, f"{ns} sentences > {PARAMS['style.v2.text.maxSentences']} (style.v2.text.maxSentences)", "EDIT95#3.2")
    n = len(text)
    if n > PARAMS["style.bark.maxChars"]:
        f.add("F1", "blocking", path + ".text", text, f"{n} characters > {PARAMS['style.bark.maxChars']} (style.bark.maxChars)", "EDIT39#6.6")
    if "\n" in text or re.search(r"[\"“”*_#`]|\[[^\]]*\]|\([^)]*\)", text) or SPEAKER.match(text) or re.search(r"[\U0001F300-\U0001FAFF☀-➿]", text):
        f.add("F2", "major", path + ".text", text, "not one plain line: quotes, markup, emoji, speaker tag or stage direction", "FSG#field-text")
    if not text.rstrip().endswith((".", "!", "?")):
        f.add("F3", "major", path + ".text", text[-12:], "does not end with . ! or ?", "FLEET#F2")
    if ev not in FLEET["events"]:
        f.add("F4", "major", path + ".event", ev, f"event not one of {sorted(FLEET['events'])}", "FLEET#F8")
    else:
        allowed = set(FLEET["events"][ev]) | set(FLEET["context"]) | PROPOSED_FIELDS
        for k in w:
            if k not in allowed:
                f.add("F4", "major", f"{path}.when.{k}", k, f"'{ev}' lines may test only {sorted(allowed)}", "FLEET#F8")
        for ph in PLACEHOLDER.findall(text):
            if ph[1:-1] not in FLEET["events"][ev]:
                f.add("F4", "major", path + ".text", ph, f"placeholder not a field of {ev}", "FLEET#F8")
        want = PRIORITY.get(ev, 1)
        if b.get("priority") != want:
            f.add("F4", "major", path + ".priority", b.get("priority"), f"{ev} lines take priority {want}", "EDIT26#6.6")
    if style not in STYLES:
        f.add("F4", "major", path + ".style", style, f"style not one of {sorted(STYLES)}", "EDIT39#6.6")
    if w.get("tier") and w.get("tier") not in {t["tier"] for t in FLEET["tiers"]}:
        f.add("F4", "major", path + ".when.tier", w.get("tier"), "tier not 01–04", "FLEET#F4")
    stripped = PLACEHOLDER.sub("", text)
    paper = PAPERWORK.findall(stripped)
    rest = GRID.sub("", PAPERWORK.sub("", stripped))
    if re.search(r"\d", rest):
        f.add("F5", "major", path + ".text", " ".join(re.findall(r"\S*\d\S*", rest)), "typed figure; figures come from event placeholders", "STORY#S1")
    if paper and w.get("tier") != "02" and not w.get("model", "").startswith("VAN-02"):
        f.add("F5", "major", path + ".text", PAPERWORK.search(stripped).group(0), "paperwork numbers are Corporate (02) flavour", "FLEET#F4")
    g = GRID.findall(text)
    if g:
        f.add("V5", "major", path + ".text", " ".join(g), "a grid code; cars name the landmark or the district", "EDIT94#who-built-what-assignment-5")
    if w.get("tile"):
        voc = tile_vocab(w.get("district"), w["tile"])
        if voc is None:
            f.add("R4", "blocking", path + ".when", f"{w.get('district')} {w['tile']}", "no such tile in story.json", "STORY#S2")
        else:
            bad = sorted({lm for lm in LANDMARKS if lm in words(text) and lm not in voc})
            if bad:
                code = {"monument": "M", "parkland": "P", "waterfront": "W"}.get(w.get("district"), "?") + w["tile"]
                f.add("R4", "blocking", path + ".text", ", ".join(bad), f"not on {w.get('district')} {w['tile']}: its title and tale lack it", f"STORY#{code}")
    if STOCK.search(text.strip()):
        batch_stock.append(path)


def narration(f, path, text, kind, district=None, tile=None):
    common(f, path, text, "farsight")
    rest = NARRATION_DIGITS.sub("", text)
    if re.search(r"\d", rest):
        f.add("F5", "major", path, " ".join(re.findall(r"\S*\d\S*", rest)), "typed figure; numbers live in the registry", "STORY#S1")
    sents = [s for s in re.split(r"(?<=[.?!])\s+", text.strip()) if s]
    if kind == "tale":
        if len(text) > PARAMS["style.tale.maxChars"]:
            f.add("F6", "blocking", path, text[:40] + "…", f"{len(text)} characters > {PARAMS['style.tale.maxChars']} (style.tale.maxChars)", "EDIT92#measured")
        if "\n" in text.strip():
            f.add("F6", "major", path, "\\n", "more than one paragraph", "EDIT92#measured")
        for s in sents:
            n = len(s.split())
            if n > PARAMS["style.tale.maxSentenceWords"]:
                f.add("F6", "major", path, s, f"{n} words > {PARAMS['style.tale.maxSentenceWords']} (style.tale.maxSentenceWords)", "EDIT92#measured")
        voc = tile_vocab(district, tile)
        if voc is not None:
            bad = sorted({lm for lm in LANDMARKS if lm in words(text) and lm not in voc})
            if bad:
                f.add("R4", "minor", path, ", ".join(bad), f"landmark words the shipped {district} {tile} tale does not have; check them against the tile", "STORY#S2")
    if kind == "act" and len(sents) > PARAMS["style.act.maxSentences"]:
        f.add("F9", "major", path, text, f"{len(sents)} sentences > {PARAMS['style.act.maxSentences']} (style.act.maxSentences)", "STORY#S2")


def cap_v2(f, path, text, speaker="company"):
    """GDD Edit 95: every in-game text at most two sentences and 20 words."""
    t = PLACEHOLDER.sub("X", str(text or "")).strip()
    nw = len([w for w in re.split(r"\s+", t) if re.search(r"[A-Za-z0-9]", w)])
    ns = len([x for x in re.split(r"(?<=[.?!])\s+", t) if re.search(r"[A-Za-z]", x)])
    rule = "C1" if speaker == "credits" else "F6"
    if nw > PARAMS["style.v2.text.maxWords"]:
        f.add(rule, "blocking" if rule == "F6" else "major", path, t[:60] + ("…" if len(t) > 60 else ""), f"{nw} words > {PARAMS['style.v2.text.maxWords']} (style.v2.text.maxWords)", "EDIT95#3.2")
    if ns > PARAMS["style.v2.text.maxSentences"]:
        f.add(rule, "blocking" if rule == "F6" else "major", path, t[:60] + ("…" if len(t) > 60 else ""), f"{ns} sentences > {PARAMS['style.v2.text.maxSentences']} (style.v2.text.maxSentences)", "EDIT95#3.2")


def narration_v2(f, path, text, kind, district=None, tile=None, sign=False, speaker="company"):
    common(f, path, text, speaker, sign)
    rest = NARRATION_DIGITS.sub("", PLACEHOLDER.sub("", text))
    if re.search(r"\d", rest) and speaker != "credits":
        f.add("F5", "major", path, " ".join(re.findall(r"\S*\d\S*", rest)), "typed figure; numbers live in the registry", "STORY#S1")
    if kind != "label":
        cap_v2(f, path, text, speaker)
    if kind == "tale":
        voc = tile_vocab(district, tile)
        if voc is not None:
            bad = sorted({lm for lm in LANDMARKS if lm in words(text) and lm not in voc})
            if bad:
                f.add("R4", "minor", path, ", ".join(bad), f"landmark words the shipped {district} {tile} tale does not have; check them against the tile", "STORY#S2")


def lint_v2(piece):
    f = Findings()
    kind = piece.get("kind")
    if kind == "barks":
        return None          # the bark rules run as in V1, with V2's Farsight ban and sentence cap (common, bark)
    if kind == "tale":
        narration_v2(f, "tale", str(piece.get("tale") or ""), "tale", piece.get("district"), piece.get("tile"))
    elif kind == "act":
        narration_v2(f, "intro", str(piece.get("intro") or ""), "act")
    elif kind == "ending":
        narration_v2(f, "ending", str(piece.get("ending") or ""), "ending")
    elif kind == "brief":
        label, brief = str(piece.get("label") or ""), str(piece.get("brief") or "")
        narration_v2(f, "label", label, "label")
        narration_v2(f, "brief", brief, "brief")
        core = re.sub(r"\{\w+\}|×", "", label)
        if core != core.upper() or len(label) > PARAMS["style.brief.labelMaxChars"]:
            f.add("F8", "major", "label", label, f"label must be caps, ≤ {PARAMS['style.brief.labelMaxChars']} characters (style.brief.labelMaxChars); {len(label)}", "STORY#S3")
        if piece.get("task") != "any" and not re.search(r"final hit", brief, re.I):
            f.add("F8", "major", "brief", brief, "the duty does not say what the final hit must be", "STORY#S3")
    elif kind == "notices":
        for i, it in enumerate(piece.get("items") or []):
            path, text = f"items[{i}]", str(it.get("text") or "")
            narration_v2(f, path, text, "label" if it.get("caps") else "notice", sign=bool(it.get("sign")))
            for ph in it.get("placeholders") or []:
                if ph not in text:
                    f.add("F10", "major", path, ph, "placeholder dropped", "EDIT95#4.2")
            if it.get("caps") and re.sub(r"\{\w+\}", "", text) != re.sub(r"\{\w+\}", "", text).upper():
                f.add("F10", "major", path, text, "a caps label must stay caps", "EDIT95#4.2")
            if it.get("maxChars") and len(text) > it["maxChars"]:
                f.add("F10", "major", path, text, f"{len(text)} characters > {it['maxChars']}: the slot's width", "EDIT95#4.2")
    elif kind == "batch":   # V2: many of the company's texts at once (the story's tales, act lines and ending)
        items = piece.get("items") or []
        for i, it in enumerate(items):
            narration_v2(f, f"items[{i}]", str(it.get("text") or ""), it.get("kind") or "notice", it.get("district"), it.get("tile"))
            if it.get("maxChars") and len(str(it.get("text") or "")) > it["maxChars"]:
                f.add("F10", "major", f"items[{i}]", str(it.get("text"))[:40], f"{len(str(it.get('text')))} characters > {it['maxChars']}: the slot's width", "EDIT95#4.2")
        grams = {}
        for it in items:
            w = re.findall(r"[a-z0-9']+", str(it.get("text") or "").lower())
            for g in {" ".join(w[j:j + 4]) for j in range(len(w) - 3)}:
                grams.setdefault(g, []).append(str(it.get("id")))
        cap, seen = PARAMS["style.bark.maxStockEndings"], set()
        for g, ids in sorted(grams.items(), key=lambda x: -len(x[1])):
            key = tuple(ids)
            if len(ids) > cap and key not in seen:
                seen.add(key)
                f.add("T14", "minor", f"batch:{g}", g, f"'{g}' in {len(ids)} texts ({', '.join(ids)}) > {cap} (style.bark.maxStockEndings)", "SUB4#6.1")
    elif kind == "credits":
        for i, ln in enumerate(piece.get("lines") or []):
            narration_v2(f, f"lines[{i}]", str(ln), "credits", speaker="credits")
    else:
        f.add("F4", "major", "kind", kind, "kind must be barks, tale, brief, act, ending, notices or credits", "STORY#S2")
    return merge(f)


def lint(piece, mode=None):
    if (mode or MODE) == "v2":
        out = lint_v2(piece)
        if out is not None:
            return out
    f = Findings()
    kind = piece.get("kind")
    if kind == "barks":
        stock = []
        for i, b in enumerate(piece.get("lines") or []):
            bark(f, i, b, stock)
        lines = piece.get("lines") or []
        cap = PARAMS["style.bark.maxStockEndings"]
        if len(stock) > cap:
            f.add("T11", "minor", "batch:stock", "Noted/Logged/Recorded/Filed",
                  f"{len(stock)} lines end on a stock word ({', '.join(str(lines[int(x[6:-1])].get('id')) for x in stock)}) > {cap} (style.bark.maxStockEndings)", "SUB4#6.1")
        tags = {}
        for b in lines:      # the closing tag: the last sentence, e.g. "Kind regards!", "Of course.", "How quaint."
            parts = [x for x in re.split(r"(?<=[.!?])\s+", str(b.get("text") or "").strip()) if x]
            if len(parts) > 1:
                tags.setdefault(re.sub(r"[^a-z ]", "", parts[-1].lower()).strip(), []).append(str(b.get("id")))
        for tag, ids in sorted(tags.items()):
            if len(ids) > cap and len(tag.split()) <= 3:
                f.add("T11", "minor", f"batch:{tag}", tag, f"{len(ids)} lines close on '{tag}' ({', '.join(ids)}) > {cap} (style.bark.maxStockEndings)", "SUB4#6.1")
    elif kind == "tale":
        narration(f, "tale", str(piece.get("tale") or ""), "tale", piece.get("district"), piece.get("tile"))
    elif kind == "act":
        narration(f, "intro", str(piece.get("intro") or ""), "act")
    elif kind == "ending":
        narration(f, "ending", str(piece.get("ending") or ""), "ending")
    elif kind == "brief":
        label, brief = str(piece.get("label") or ""), str(piece.get("brief") or "")
        narration(f, "label", label, "label")
        narration(f, "brief", brief, "brief")
        core = re.sub(r"\{\w+\}|×", "", label)
        if core != core.upper() or len(label) > PARAMS["style.brief.labelMaxChars"]:
            f.add("F8", "major", "label", label, f"label must be caps, ≤ {PARAMS['style.brief.labelMaxChars']} characters (style.brief.labelMaxChars); {len(label)}", "STORY#S3")
        if not (re.fullmatch(r"Coverage gap: [^.]+\. (?:[^.]*; )?[Tt]he final hit must [^.]+\.", brief) or brief.startswith("General coverage.")):
            f.add("F8", "major", "brief", brief, "not 'Coverage gap: …. The final hit must ….'", "STORY#S3")
    else:
        f.add("F4", "major", "kind", kind, "kind must be barks, tale, brief, act or ending", "STORY#S2")
    return merge(f)


def merge(found):
    """One finding per rule per line (STYLE_GUIDE.md §1: a rule deducts once per line)."""
    order, out = ["blocking", "major", "minor"], {}
    for x in found:
        key = (x["rule"], x["path"].split(".")[0])
        if key not in out:
            out[key] = dict(x, path=key[1])
            continue
        y = out[key]
        if str(x["quote"]) not in str(y["quote"]):
            y["quote"] = f"{y['quote']}; {x['quote']}"
        if x["measured"] not in y["measured"]:
            y["measured"] = f"{y['measured']}; {x['measured']}"
        if order.index(x["severity"]) < order.index(y["severity"]):
            y["severity"], y["deduct"] = x["severity"], x["deduct"]
    return list(out.values())


def shipped():
    """Every shipped string as a piece: 147 barks one by one, 27 tales, 11 briefs, 3 act lines, the ending."""
    out = [("bark " + b["id"], {"kind": "barks", "lines": [b]}) for b in FLEET["barks"]]
    for d in STORY["districts"]:
        out.append((f"act {d['id']}", {"kind": "act", "district": d["id"], "intro": d["intro"]}))
        for k, t in d["tiles"].items():
            out.append((f"tale {d['id']} {k}", {"kind": "tale", "district": d["id"], "tile": k, "title": t["title"], "tale": t["tale"]}))
    out += [(f"brief {k}", {"kind": "brief", "task": k, "label": v["label"], "brief": v["brief"]}) for k, v in STORY["tasks"].items()]
    out.append(("ending", {"kind": "ending", "ending": STORY["ending"]}))
    return out


def shipped_piece(name):
    """One shipped string as a piece, by its name in shipped() ("tale monument A1", "brief dash", "act parkland", "ending")."""
    return dict(shipped())[name]


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--shipped":
        items = shipped()
        hit = [(n, fs) for n, p in items for fs in [lint(p)] if fs]
        for n, fs in hit:
            for x in fs:
                print(f"{n:24} {x['rule']:4} {x['severity']:8} {x['measured']} · \"{x['quote']}\"")
        print(f"{len(items)} shipped pieces · {len(hit)} with findings · {sum(len(fs) for _, fs in hit)} findings")
    else:
        print(json.dumps(lint(json.loads(Path(sys.argv[1]).read_text(encoding="utf-8"))), indent=1, ensure_ascii=False))

