"""Deterministic validators. They run before the critic and gate publication.

Every rule cites the canon it enforces. Issues use the same shape as the critic's:
{id, kind, severity, path, found, canon, rule}.
"""
import json
import math
import re
import sys

ID_RE = re.compile(r"^[a-z]+(?:\.[A-Za-z0-9]+)+$")
CJK_RE = re.compile(r"[㐀-鿿豈-﫿]")
HEX_RE = re.compile(r"#[0-9A-Fa-f]{6}\b")


class Issues(list):
    def add(self, kind, path, found, rule, canon, severity="block"):
        self.append({"id": f"V{len(self) + 1}", "kind": kind, "severity": severity, "path": path,
                     "found": found if isinstance(found, str) else repr(found)[:200], "canon": canon, "rule": rule})


def walk(o, path=""):
    yield path, o
    if isinstance(o, dict):
        for k, v in o.items():
            yield from walk(v, f"{path}.{k}" if path else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from walk(v, f"{path}[{i}]")


def sentences(s):
    return [x for x in re.split(r"(?<=[.!?])\s+", s.strip()) if x]


def words(s):
    return len(re.findall(r"[A-Za-z0-9{}'’\-]+", s))


def placeholders(s):
    return re.findall(r"\{([A-Za-z]+)\}", s)


# ---------------------------------------------------------------- common
def common(content, ctx, iss):
    retrieved, kb_ids = ctx["retrieved_ids"], ctx["kb_ids"]
    for path, v in walk(content):
        if isinstance(v, dict) and "sources" in v:
            src = v["sources"]
            if not isinstance(src, list) or not src:
                iss.add("grounding", path + ".sources", src, "Every item cites the chunks it draws on.", "pipeline")
                continue
            for s in src:
                if s not in kb_ids:
                    iss.add("grounding", path + ".sources", s, "Cited chunk does not exist in the knowledge base.", "pipeline")
                elif s not in retrieved:
                    iss.add("grounding", path + ".sources", s, "Cited chunk was not in the retrieved context.", "pipeline")
        if isinstance(v, str) and HEX_RE.search(v):
            iss.add("rule", path, v, "Colours are palette roles, never hex.", "DESIGN#D10.2")
        if isinstance(v, dict):
            texts = [x for x in v.values() if isinstance(x, str) and CJK_RE.search(x)]
            if texts and v.get("review") != "pending":
                iss.add("lore", path, texts[0], "Chinese wording carries review: pending until editorial review.", "DESIGN#D9.2")
    params(content, ctx, iss)


def params(content, ctx, iss):
    reg, prefix = ctx["registry"], ctx["spec"]["param_prefix"]
    seen = set()
    for i, p in enumerate(content.get("params") or []):
        path = f"params[{i}]"
        pid = p.get("id", "")
        if not pid.startswith(prefix):
            iss.add("data", path + ".id", pid, f"New parameters use the {prefix}* namespace.", "BRIEF#P1.9")
        if pid in reg:
            iss.add("data", path + ".id", pid, "Do not redeclare an existing registry ID; reuse it.", "ENG#13.5")
        if pid in seen:
            iss.add("data", path + ".id", pid, "Duplicate parameter ID.", "ENG#11.1")
        seen.add(pid)
        val = p.get("value")
        if not isinstance(val, (int, float)) or isinstance(val, bool) or not math.isfinite(val):
            iss.add("data", path + ".value", val, "Parameter values are finite numbers.", "ENG#11.1")
        for f in ("unit", "purpose"):
            if not p.get(f):
                iss.add("data", path + "." + f, None, f"Every parameter declares its {f}.", "ENG#13.5", "fix")


def resolve(ctx, content, pid):
    for p in content.get("params") or []:
        if p.get("id") == pid:
            return p.get("value")
    r = ctx["registry"].get(pid)
    return r.get("value") if r else None


def check_value_slot(ctx, content, iss, path, v, allow_pair=True):
    """A V slot: a parameter ID or [minId, maxId]. Never a bare number."""
    if isinstance(v, str):
        if not ID_RE.match(v) or resolve(ctx, content, v) is None:
            iss.add("data", path, v, "Value must be a declared or registry parameter ID.", "ENG#11.5")
    elif isinstance(v, list) and allow_pair and len(v) == 2 and all(isinstance(x, str) for x in v):
        for j, x in enumerate(v):
            check_value_slot(ctx, content, iss, f"{path}[{j}]", x, False)
    else:
        iss.add("data", path, v, "Every statistic maps to a named parameter ID, not a bare number.", "ENG#11.5")


# ---------------------------------------------------------------- juice
CAR_EVENTS = {"impact", "knock", "touch-spent", "honk"}
# Events that happen where the dummy is. Run 20261015-012152: the critic caught rotor-wash dust at the dummy for
# 'drone-dispatch' (the drone is off-field), then reversed its own fix a round later. Now a deterministic rule.
AT_DUMMY = {"lunge", "impact", "knock", "touch-spent", "writeoff", "denied", "chassis", "throw", "drop", "pickup", "punt"}


def juice(content, ctx, iss):
    sp, ev_fields = ctx["spec"]["allowed"], ctx["sim_events"]
    if content.get("hitStop") != "feedback.hitStop":
        iss.add("data", "hitStop", content.get("hitStop"), "Hit pause is the registry's feedback.hitStop.", "ENG#5.8")
    if content.get("writeOff") != "feedback.writeOffSeconds":
        iss.add("data", "writeOff", content.get("writeOff"), "Write-off duration is feedback.writeOffSeconds.", "ENG#5.8")
    rm = content.get("reducedMotion")
    check_value_slot(ctx, content, iss, "reducedMotion", rm, False)
    rv = resolve(ctx, content, rm) if isinstance(rm, str) else None
    if isinstance(rv, (int, float)) and rv > 0.25:
        iss.add("rule", "reducedMotion", rv, "Reduced motion scales juice to 25%.", "LOG#P1.2/juice")
    seen = set()
    for i, e in enumerate(content.get("events") or []):
        path, name = f"events[{i}]", e.get("event")
        if name not in sp["events"]:
            iss.add("data", path + ".event", name, "The renderer receives only listed sim events.", "pipeline:consumer")
            continue
        if name in seen:
            iss.add("data", path + ".event", name, "One entry per event.", "pipeline:consumer")
        seen.add(name)
        sc = e.get("scale")
        if sc:
            if sc.get("by") not in ev_fields.get(name, []):
                iss.add("truth", path + ".scale.by", sc.get("by"), f"Scale only by a numeric field the '{name}' event carries: {ev_fields.get(name, [])}.", "pipeline:sim events")
            check_value_slot(ctx, content, iss, path + ".scale.full", sc.get("full"), False)
        if e.get("shake"):
            for k in ("amp", "seconds"):
                check_value_slot(ctx, content, iss, f"{path}.shake.{k}", e["shake"].get(k))
        if e.get("flash") is not None:
            check_value_slot(ctx, content, iss, path + ".flash", e["flash"])
        if e.get("carPulse") and name not in CAR_EVENTS:
            iss.add("data", path + ".carPulse", True, "Only events that name a car can pulse it.", "pipeline:consumer")
        if e.get("stamp") and name != "writeoff":
            iss.add("lore", path + ".stamp", True, "The WRITTEN OFF stamp belongs to write-offs only.", "LOG#P1.2/juice")
        if e.get("particles") and name not in AT_DUMMY:
            iss.add("truth", path + ".particles", name, f"Particles spawn at the dummy; '{name}' happens elsewhere, so it cannot have particles.", "pipeline:consumer")
        for j, pt in enumerate(e.get("particles") or []):
            pp = f"{path}.particles[{j}]"
            if pt.get("type") not in sp["particle_types"]:
                iss.add("data", pp + ".type", pt.get("type"), "Unsupported particle type.", "pipeline:consumer")
            if pt.get("dir", "random") not in sp["particle_dirs"]:
                iss.add("data", pp + ".dir", pt.get("dir"), "Unsupported particle direction.", "pipeline:consumer")
            if pt.get("role") not in sp["particle_roles"]:
                iss.add("rule", pp + ".role", pt.get("role"), "Particles use restrained roles; red is reserved for warnings, aqua for the frame.", "DESIGN#D10.2")
            for k in ("count", "speed", "life", "size"):
                check_value_slot(ctx, content, iss, f"{pp}.{k}", pt.get(k))
        if name == "touch-spent":
            if e.get("flash") or any(p.get("type") == "spark" for p in e.get("particles") or []):
                iss.add("rule", path, "flash/spark on touch-spent", "A touch on a spent car must not use scored-hit reward feedback.", "DESIGN#D4.5")
    for need in ("lunge", "impact", "touch-spent", "writeoff", "denied", "chassis"):
        if need not in seen:
            iss.add("data", "events", need, f"The gap requires an entry for '{need}'.", "pipeline:spec gap")
    st = content.get("states") or {}
    bm = st.get("brakeMarks")
    if not bm:
        iss.add("data", "states.brakeMarks", None, "Brake marks are part of the deliverable.", "pipeline:spec gap")
    else:
        for k in ("width", "alpha", "fadeSeconds", "max", "minSpeed"):
            check_value_slot(ctx, content, iss, f"states.brakeMarks.{k}", bm.get(k), False)
        if bm.get("role") not in sp["mark_roles"]:
            iss.add("rule", "states.brakeMarks.role", bm.get("role"), "Persistent marks use matte ink roles.", "JUICE#J4")
    lh = st.get("lowHealth") or {}
    for k in ("smokeFrom", "sparkFrom", "vignetteFrom"):
        check_value_slot(ctx, content, iss, f"states.lowHealth.{k}", lh.get(k), False)
        val = resolve(ctx, content, lh.get(k)) if isinstance(lh.get(k), str) else None
        if isinstance(val, (int, float)) and not 0 <= val <= 1:
            iss.add("data", f"states.lowHealth.{k}", val, "Wear thresholds are fractions from 0 to 1.", "LOG#P1.2/dummy-damage-states")
    rd = st.get("replacementDrop") or {}
    for k in ("seconds", "height"):
        check_value_slot(ctx, content, iss, f"states.replacementDrop.{k}", rd.get(k), False)


# ---------------------------------------------------------------- interface
def interface(content, ctx, iss):
    sp, ev_fields = ctx["spec"]["allowed"], ctx["sim_events"]
    hud = content.get("hud") or {}
    mods, facts = [], []
    for side in ("left", "right"):
        h = 0
        for i, m in enumerate(hud.get(side) or []):
            path = f"hud.{side}[{i}]"
            mid = m.get("module")
            mods.append(mid)
            if mid not in sp["modules"]:
                iss.add("lore", path + ".module", mid, "HUD modules are the D10.5 set (plus P1 BUILD).", "DESIGN#D10.5")
            if "SERVICE" in (m.get("title") or "").upper():
                iss.add("lore", path + ".title", m.get("title"), "There is no automatic-repair SERVICE meter in the slice.", "DESIGN#D10.5")
            h += sp["module_header_h"] + sp["module_gap_h"]
            for j, r in enumerate(m.get("rows") or []):
                f = r.get("fact")
                if f not in sp["facts"]:
                    iss.add("data", f"{path}.rows[{j}].fact", f, "Rows bind to facts the renderer can draw.", "pipeline:consumer")
                    continue
                facts.append(f)
                h += sp["facts"][f]["h"]
                if len(r.get("label") or "") > sp["label_max_chars"]:
                    iss.add("rule", f"{path}.rows[{j}].label", r.get("label"), "Labels must fit the 216-unit column.", "DESIGN#D10.4", "fix")
        if h > sp["column_budget_h"]:
            iss.add("rule", f"hud.{side}", h, f"Column height {h} exceeds the {sp['column_budget_h']} budget.", "DESIGN#D10.2")
    for need in sp["required_modules"]:
        if need not in mods:
            iss.add("lore", "hud", need, f"Module {need} is required.", "DESIGN#D10.5")
    for f in {x for x in facts if facts.count(x) > 1}:
        iss.add("data", "hud", f, "Each fact appears once.", "pipeline:consumer", "fix")
    for f in ("body.health", "body.charge", "record.credits", "contract.writeOffs", "shift.admitted", "fleet.models", "record.points"):
        if f not in facts:
            iss.add("rule", "hud", f, "HUD facts include health, charge, credits, objective progress and admitted traffic.", "DESIGN#D10.3~2")
    cues = [c.get("cue") for c in content.get("cueKey") or []]
    for i, c in enumerate(content.get("cueKey") or []):
        if c.get("cue") not in sp["cues"]:
            iss.add("data", f"cueKey[{i}].cue", c.get("cue"), "Only cues the field draws.", "pipeline:consumer")
        for s in sentences(c.get("meaning") or ""):
            if words(s) > 15:
                iss.add("tone", f"cueKey[{i}].meaning", s, "Short sentences, under 15 words.", "project style", "fix")
    for need in ("intention", "committed", "expiring", "interrupted", "spent"):
        if need not in cues:
            iss.add("rule", "cueKey", need, f"The cue key must explain '{need}'.", "BRIEF#P1.3")
    copy = content.get("copy") or {}
    allowed_ph = sp["copy_placeholders"]
    for path, v in walk(copy):
        if not isinstance(v, str) or path.endswith("review") or path.startswith("sources"):
            continue
        key = re.sub(r"\[\d+\]$", "", path)
        key = "shop.nodes" if key.startswith("shop.nodes") else "endings" if key.startswith("endings") else \
            "denied" if key.startswith("denied") else key
        allow = allowed_ph.get(key)
        if allow is None:
            iss.add("data", "copy." + path, v[:60], "Unknown copy key; the renderer has no slot for it.", "pipeline:consumer", "fix")
            continue
        for ph in placeholders(v):
            if ph not in allow:
                iss.add("truth", "copy." + path, "{" + ph + "}", f"Placeholder not available for this slot (allowed: {allow}).", "pipeline:consumer")
        if not CJK_RE.search(v):
            for s in sentences(v):
                if words(s) > 15:
                    iss.add("tone", "copy." + path, s, "Short sentences, under 15 words.", "project style", "fix")
    for k in ("lunge", "pickup", "drop", "throw"):
        if not (copy.get("denied") or {}).get(k):
            iss.add("data", "copy.denied", k, "Every denied action needs a line.", "DESIGN#D4.5")
    for k in ("Licensed", "Failed test", "Non-compliant"):
        if not (copy.get("endings") or {}).get(k):
            iss.add("lore", "copy.endings", k, "Each slice ending needs its line.", "DESIGN#D8")
    bev = set()
    for i, b in enumerate(content.get("barks") or []):
        path, ev = f"barks[{i}]", b.get("event")
        if ev not in sp["bark_events"]:
            iss.add("data", path + ".event", ev, "Barks bind to car events the renderer can place.", "pipeline:consumer")
            continue
        bev.add(ev)
        fields = set(ev_fields[ev]) | set(sp["bark_derived_fields"])
        for k in (b.get("when") or {}):
            if k not in fields:
                iss.add("truth", path + ".when", k, f"'{ev}' does not log '{k}'.", "DESIGN#D9.3")
        for ph in placeholders(b.get("text") or ""):
            if ph not in fields:
                iss.add("truth", path + ".text", "{" + ph + "}", f"'{ev}' does not log '{ph}'; barks state only logged facts.", "DESIGN#D9.3")
        if len(b.get("text") or "") > sp["bark_max_chars"]:
            iss.add("rule", path + ".text", b.get("text"), "Barks stay short enough to read at a glance.", "DESIGN#D10.4", "fix")
    for need in ("impact", "touch-spent", "honk"):
        if need not in bev:
            iss.add("data", "barks", need, f"Provide at least one bark for '{need}'.", "pipeline:spec gap", "fix")
    declared = {p.get("id") for p in content.get("params") or []}
    for need in ("proto.ui.barkSeconds", "proto.ui.barkCooldown"):
        if need not in declared:
            iss.add("data", "params", need, "The bark timing the renderer reads must be declared.", "pipeline:consumer")


# ---------------------------------------------------------------- graphics
def bbox(s):
    k = s.get("shape")
    x, y = s.get("x", 0), s.get("y", 0)
    if k in ("rect", "stripes"):
        w, h, a = s.get("w", 0), s.get("h", 0), math.radians(s.get("rotate", 0) or 0)
        pts = [(x, y), (x + w, y), (x + w, y + h), (x, y + h)]
        if a:
            cx, cy = x + w / 2, y + h / 2
            pts = [(cx + (px - cx) * math.cos(a) - (py - cy) * math.sin(a), cy + (px - cx) * math.sin(a) + (py - cy) * math.cos(a)) for px, py in pts]
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]
        return min(xs), min(ys), max(xs), max(ys)
    if k in ("circle", "ring", "quadrant"):
        r = s.get("r", 0) + (s.get("lineWidth", 0) or 0) / 2
        return x - r, y - r, x + r, y + r
    if k == "line":
        pts = s.get("points") or [[0, 0]]
        lw = (s.get("lineWidth", 1) or 1) / 2
        return min(p[0] for p in pts) - lw, min(p[1] for p in pts) - lw, max(p[0] for p in pts) + lw, max(p[1] for p in pts) + lw
    if k == "text":
        size, t = s.get("size", 10), s.get("text", "")
        w = size * sum(1.0 if CJK_RE.match(ch) else 0.62 for ch in t)   # bold B612: ~0.62 em per Latin glyph
        al = s.get("align", "left")
        x0 = x - w / 2 if al == "center" else x - w if al == "right" else x
        if s.get("rotate"):
            r = max(w, size)
            return x - r, y - r, x + r, y + r
        return x0, y - size, x0 + w, y + size * 0.3
    return x, y, x, y


def seg_dist(px, py, a, b):
    ax, ay, bx, by = a[0], a[1], b[0], b[1]
    dx, dy = bx - ax, by - ay
    t = 0 if dx == dy == 0 else max(0, min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - ax - t * dx, py - ay - t * dy)


def touches_circle(s, r):
    """Does shape s cover any part of the circle radius r at the origin?"""
    k = s.get("shape")
    if k == "line":
        pts = s.get("points") or []
        return any(seg_dist(0, 0, pts[i], pts[i + 1]) < r + (s.get("lineWidth", 1) or 1) / 2 for i in range(len(pts) - 1))
    if k == "ring" or (k == "circle" and not s.get("fill")):
        d = math.hypot(s.get("x", 0), s.get("y", 0))
        return abs(d - s.get("r", 0)) < r + (s.get("lineWidth", 1) or 1) / 2
    x0, y0, x1, y1 = bbox(s)
    nx, ny = max(x0, min(0, x1)), max(y0, min(0, y1))
    hit = math.hypot(nx, ny) < r
    if hit and k == "rect" and not s.get("fill"):   # outline only: hits if the circle crosses its border
        lw = s.get("lineWidth", 1) or 1
        inside = x0 + lw < -r and x1 - lw > r and y0 + lw < -r and y1 - lw > r
        return not inside
    return hit


def check_shape(iss, path, s, roles, forbidden, ctx):
    sp = ctx["spec"]["allowed"]
    roles = {k: v for k, v in roles.items() if not str(v.get("source", "")).endswith("(frame only)")}   # frame colours never reach the field
    if s.get("shape") not in sp["shapes"]:
        iss.add("data", path + ".shape", s.get("shape"), "Unsupported shape.", "pipeline:consumer")
    for key in ("fill", "stroke", "a", "b"):
        r = s.get(key)
        if r is None:
            continue
        if r not in roles:
            iss.add("rule", f"{path}.{key}", r, "Colours are D10.2 palette roles.", "DESIGN#D10.2")
        elif r in forbidden:
            iss.add("rule", f"{path}.{key}", r, forbidden[r][0], forbidden[r][1])
    if s.get("shape") == "text":
        tmin = ctx["registry"]["ui.typeTexture"]["value"]
        if (s.get("size") or 0) < tmin:
            iss.add("rule", path + ".size", s.get("size"), f"Text is at least ui.typeTexture ({tmin}).", "DESIGN#D10.4")
        if s.get("font", "ui") not in sp["fonts"]:
            iss.add("data", path + ".font", s.get("font"), "Fonts are mono, ui or brand.", "pipeline:consumer", "fix")


FORBID_TEXT = {
    "dummy": ("The dummy is the only persistently saturated actor.", "DESIGN#D10.1"),
    "warning": ("Red is reserved for warning cues.", "DESIGN#D10.2"),
    "aqua": ("Aqua belongs to the frame, not the playfield.", "DESIGN#D10.1"),
}


def road_distance(center, x, y):
    return min(seg_dist(x, y, center[i], center[i + 1]) for i in range(len(center) - 1))


def graphics(content, ctx, iss):
    sp, reg, roles = ctx["spec"]["allowed"], ctx["registry"], ctx["palette"]
    forb = {k: {r: FORBID_TEXT[r] for r in v} for k, v in sp["forbidden_roles"].items()}
    veh = content.get("vehicles") or {}
    for cls in ("sedan", "van"):
        v = veh.get(cls)
        if not v:
            iss.add("data", "vehicles", cls, f"Roof art for the {cls} is required.", "DESIGN#D10.6")
            continue
        L, W = reg[f"vehicles.{cls}.length"]["value"], reg[f"vehicles.{cls}.width"]["value"]
        if not v.get("roof"):
            iss.add("data", f"vehicles.{cls}.roof", None, "Roof shapes are required.", "DESIGN#D10.6")
        for i, s in enumerate(v.get("roof") or []):
            path = f"vehicles.{cls}.roof[{i}]"
            check_shape(iss, path, s, roles, forb["vehicle"], ctx)
            x0, y0, x1, y1 = bbox(s)
            if x0 < -L / 2 - 0.5 or x1 > L / 2 + 0.5 or y0 < -W / 2 - 0.5 or y1 > W / 2 + 0.5:
                iss.add("rule", path, [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)],
                        f"Roof art stays inside the {cls} footprint ({L} x {W}).", "DESIGN#D5.1")
            if touches_circle(s, sp["pip_clear_radius"]):
                iss.add("rule", path, s.get("shape") + " near the car centre", "Keep the state pip clear; cues outrank decoration.", "DESIGN#D10.3~1")
    d = content.get("dummy") or {}
    R = reg["body.radius"]["value"]
    nc = sp["nose_corridor"]
    if not d.get("markings"):
        iss.add("data", "dummy.markings", None, "FARSIGHT markings are required.", "DESIGN#D4.1")
    for i, s in enumerate(d.get("markings") or []):
        path = f"dummy.markings[{i}]"
        check_shape(iss, path, s, roles, forb["dummy"], ctx)
        x0, y0, x1, y1 = bbox(s)
        if max(math.hypot(px, py) for px in (x0, x1) for py in (y0, y1)) > R + 1.5:
            iss.add("rule", path, [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)], f"Markings stay inside the {R}-unit body.", "ENG#13.5")
        if x1 > nc["x_from"] and y0 < nc["half_width"] and y1 > -nc["half_width"]:
            iss.add("rule", path, s.get("shape") + " on the facing line", "Wear and markings never hide facing.", "DESIGN#D4.1")
    env = content.get("environment") or {}
    lw, sh = reg["world.laneWidth"]["value"], reg["proto.shoulderWidth"]["value"]
    Wd, Hd = reg["world.width"]["value"], reg["world.height"]["value"]
    for lv in sp["levels"]:
        if not env.get(lv):
            iss.add("data", "environment", lv, f"Dressing for road '{lv}' is required.", "DESIGN#D9.2")
            continue
        geo = ctx["levels"][lv]
        for i, s in enumerate(env[lv]):
            path = f"environment.{lv}[{i}]"
            check_shape(iss, path, s, roles, forb["environment"], ctx)
            for key in ("fill", "stroke", "a", "b"):
                if s.get(key) in sp["environment_saturated_roles"] and not s.get("hazard"):
                    iss.add("rule", f"{path}.{key}", s.get(key), "Saturated paint is allowed only as a declared hazard marking.", "DESIGN#D10.1")
            x0, y0, x1, y1 = bbox(s)
            if x0 < -1 or y0 < -1 or x1 > Wd + 1 or y1 > Hd + 1:
                iss.add("rule", path, [round(x0), round(y0), round(x1), round(y1)], "Decal must sit fully inside the field; cut-off text is unreadable.", "DESIGN#D9.2", "fix")
            if s.get("shape") == "rect" and s.get("fill") == "structure":
                iss.add("rule", path + ".fill", "structure", "Structure fill reads as a barrier or fixed form; decoration has no collider, so it must not look solid.", "ENG#7.2")
            if s.get("shape") == "text":
                for board in env[lv]:
                    if board is s or board.get("shape") != "rect" or board.get("rotate"):
                        continue
                    bx0, by0, bx1, by1 = bbox(board)
                    if bx0 <= s.get("x", 0) <= bx1 and by0 <= s.get("y", 0) <= by1 and (x0 < bx0 - 1 or x1 > bx1 + 1):
                        iss.add("rule", path, s.get("text"), f"Text is about {x1 - x0:.0f} units wide but its board is {bx1 - bx0:.0f}; it spills over the edge.", "DESIGN#D10.4", "fix")
                        break
            cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
            dist = road_distance(geo["center"], cx, cy)
            actual = "tarmac" if dist <= lw else "shoulder" if dist <= lw + sh else "verge"
            if s.get("surface") and s["surface"] != actual:
                iss.add("data", path + ".surface", s["surface"], f"Declared {s['surface']} but it sits on {actual} ({dist:.0f} units from the centreline).", "pipeline:geometry", "fix")
            for st in geo["statics"]:
                if x0 < st["x"] + st["w"] and x1 > st["x"] and y0 < st["y"] + st["h"] and y1 > st["y"]:
                    iss.add("rule", path, f"overlaps {st['kind']} at ({st['x']},{st['y']})", "Cover must stay legible as cover.", "DESIGN#D10.6", "fix")
                    break


# ---------------------------------------------------------------- P2.1 shared
DIGIT_RE = re.compile(r"\d")


def check_when(iss, path, when, fields, sp, ev):
    """'when' keys must be fields the event carries; literals must be values the sim logs."""
    if not isinstance(when, dict):
        iss.add("data", path, when, "'when' is an object of field conditions.", "pipeline:consumer")
        return
    for k, v in when.items():
        if k not in fields:
            iss.add("truth", f"{path}.{k}", k, f"'{ev}' does not carry '{k}' (fields: {fields}).", "DESIGN#D9.3")
            continue
        if isinstance(v, dict):
            ok_vals = all(isinstance(x, (int, float)) and not isinstance(x, bool) or (isinstance(x, str) and ID_RE.match(x)) for x in v.values())
            if k not in sp.get("numeric_fields", []) or not set(v) <= {"min", "max"} or not ok_vals:
                iss.add("data", f"{path}.{k}", v, "Range conditions use {min, max} on a numeric field; bounds are numbers or parameter IDs.", "pipeline:consumer")
            elif sp.get("range_ids"):
                for b, x in v.items():
                    if not isinstance(x, str):
                        iss.add("data", f"{path}.{k}.{b}", x, "Thresholds are statistics: use a parameter ID, not a bare number.", "ENG#11.5")
        elif k in sp.get("values", {}) and v not in sp["values"][k]:
            iss.add("truth", f"{path}.{k}", v, f"The sim never logs {k} = {v!r} (logged: {sp['values'][k]}).", "pipeline:sim events")


def when_matches(case, when):
    return all(when.get(k) == v for k, v in case.items())


def no_digits(iss, path, s, rule, canon, severity="block"):
    if isinstance(s, str) and DIGIT_RE.search(re.sub(r"\{\w+\}", "", s)):
        iss.add("truth", path, s, rule, canon, severity)


def short_sentences(iss, path, s):
    if isinstance(s, str) and not CJK_RE.search(s):
        for x in sentences(s):
            if words(x) > 15:
                iss.add("tone", path, x, "Short sentences, under 15 words.", "project style", "fix")


def required_params(content, ctx, iss, need):
    declared = {p.get("id") for p in content.get("params") or []}
    for pid in need:
        if pid not in declared:
            iss.add("data", "params", pid, "The renderer reads this parameter; declare it.", "pipeline:consumer")


# ---------------------------------------------------------------- barks (P2.1 humour)
def barks(content, ctx, iss):
    sp, fields_of = ctx["spec"]["allowed"], ctx["event_fields"]
    lines = content.get("lines") or []
    if not lines:
        iss.add("data", "lines", None, "The bark bank is the deliverable.", "pipeline:spec gap")
    wo_pri, other_pri, styles = [], [], set()
    for i, b in enumerate(lines):
        path, ev, text = f"lines[{i}]", b.get("event"), b.get("text") or ""
        if ev not in sp["events"]:
            iss.add("data", path + ".event", ev, "Barks bind to events the renderer can place on a car.", "pipeline:consumer")
            continue
        fields = fields_of(ev)
        check_when(iss, path + ".when", b.get("when") or {}, fields, sp, ev)
        for ph in placeholders(text):
            if ph not in fields:
                iss.add("truth", path + ".text", "{" + ph + "}", f"'{ev}' does not log '{ph}'; barks state only logged facts.", "DESIGN#D9.3")
        if b.get("style") not in sp["styles"]:
            iss.add("data", path + ".style", b.get("style"), f"Bubble styles are {sp['styles']}.", "pipeline:consumer")
        styles.add(b.get("style"))
        if b.get("priority") not in sp["priorities"]:
            iss.add("data", path + ".priority", b.get("priority"), "Priority is 1, 2 or 3.", "pipeline:consumer")
        (wo_pri if ev == "writeoff" else other_pri).append(b.get("priority") or 0)
        if len(text) > sp["max_chars"]:
            iss.add("rule", path + ".text", text, f"Bubbles wrap at two lines: at most {sp['max_chars']} characters.", "DESIGN#D10.4", "fix")
        short_sentences(iss, path + ".text", text)
        if CJK_RE.search(text):
            iss.add("lore", path + ".text", text, "Bark text is English in the slice; Chinese needs editorial review.", "DESIGN#D9.2")
    if wo_pri and other_pri and min(wo_pri) <= max(other_pri):
        iss.add("rule", "lines", f"write-off priority {min(wo_pri)} vs other {max(other_pri)}", "Write-off barks take priority over every other line.", "EDIT26#6.6")
    for case in sp["required_cases"]:
        n = sum(1 for b in lines if b.get("event") == case["event"] and when_matches(case["when"], b.get("when") or {}))
        if n < case["min_lines"]:
            iss.add("data", "lines", f"{case['event']} {json.dumps(case['when'])}: {n} line(s)",
                    f"The bark key needs at least {case['min_lines']} line(s) for this case.", "EDIT26#6.6")
    for st in sp["styles"]:
        if st not in styles:
            iss.add("data", "lines", st, f"Style '{st}' is unused; each case needs its own look.", "pipeline:spec gap", "fix")
    if not any("seniority" in (b.get("when") or {}) for b in lines):
        iss.add("data", "lines", "no seniority line", "The bark key includes seniority.", "EDIT26#6.6", "fix")
    required_params(content, ctx, iss, sp["required_params"])
    ts = resolve(ctx, content, "proto.barks.textSize")
    tmin = ctx["registry"]["ui.typeTexture"]["value"]
    if isinstance(ts, (int, float)) and ts < tmin:
        iss.add("rule", "params", ts, f"Bubble text is at least ui.typeTexture ({tmin}).", "DESIGN#D10.4")


# ---------------------------------------------------------------- hits (P2.1 juice)
def hits(content, ctx, iss):
    sp, fields_of = ctx["spec"]["allowed"], ctx["event_fields"]
    if content.get("hitStop") != "feedback.hitStop":
        iss.add("data", "hitStop", content.get("hitStop"), "Hit pause is the registry's feedback.hitStop.", "ENG#5.8")
    for i, p in enumerate(content.get("params") or []):
        if re.search(r"hit-?stop|freeze|pause", p.get("id", ""), re.I):
            iss.add("rule", f"params[{i}].id", p.get("id"), "The hit-stop stays the simulation's feedback.hitStop; P2.1 juice is presentation only.", "pipeline:designer decision")
    rm = content.get("reducedMotion")
    check_value_slot(ctx, content, iss, "reducedMotion", rm, False)
    rv = resolve(ctx, content, rm) if isinstance(rm, str) else None
    if isinstance(rv, (int, float)) and rv > 0.25:
        iss.add("rule", "reducedMotion", rv, "Reduced motion scales juice to 25%.", "LOG#P1.2/juice")
    seen, accents = check_layers(content, ctx, iss, sp, fields_of)
    for need in sp["required_events"]:
        if need not in seen:
            iss.add("data", "layers", need, f"The gap needs a base layer (when {{}}) for '{need}'.", "pipeline:spec gap")
    if accents < sp["min_impact_accents"]:
        iss.add("data", "layers", f"{accents} impact accent(s)", f"Every hit should differ: at least {sp['min_impact_accents']} impact accents.", "pipeline:spec gap")


def check_layers(content, ctx, iss, sp, fields_of):
    """Shared layer checks for hit juice (P2.1 hits) and drop juice (P3.3 drops)."""
    seen, accents = set(), 0
    slots = {"shake": ("amp", "seconds"), "zoom": ("amount", "seconds"), "crumple": ("amount", "seconds"),
             "stumble": ("amp", "seconds"), "ring": ("radius", "seconds", "width"), "rays": ("count", "length", "seconds"),
             "popup": ("size", "rise", "seconds", "pop"), "streaks": ("count", "length", "seconds")}
    for i, L in enumerate(content.get("layers") or []):
        path, ev = f"layers[{i}]", L.get("event")
        if ev not in sp["events"]:
            iss.add("data", path + ".event", ev, "The renderer layers juice only on listed events.", "pipeline:consumer")
            continue
        fields, when = fields_of(ev), L.get("when") or {}
        check_when(iss, path + ".when", when, fields, sp, ev)
        if not when:
            seen.add(ev)
        elif ev == "impact":
            accents += 1
        sc = L.get("scale")
        if sc:
            if sc.get("by") not in fields or sc.get("by") not in sp["numeric_fields"]:
                iss.add("truth", path + ".scale.by", sc.get("by"), f"Scale only by a numeric field '{ev}' carries: {[f for f in fields if f in sp['numeric_fields']]}.", "pipeline:sim events")
            check_value_slot(ctx, content, iss, path + ".scale.full", sc.get("full"), False)
        for blk, keys in slots.items():
            if L.get(blk):
                if blk in sp["only_on"] and ev not in sp["only_on"][blk]:
                    iss.add("rule", f"{path}.{blk}", ev, f"'{blk}' belongs only to {sp['only_on'][blk]}.", "DESIGN#D10.3" if blk in ("rays", "popup") else "pipeline:consumer")
                for k in keys:
                    check_value_slot(ctx, content, iss, f"{path}.{blk}.{k}", L[blk].get(k))
                if blk in ("ring", "streaks") and L[blk].get("role") not in sp["line_roles"]:
                    iss.add("rule", f"{path}.{blk}.role", L[blk].get("role"), "Effect lines avoid reserved inks: red warns, primary and secondary are cue inks, aqua is frame-only, yellow is the dummy.", "EDIT26#4.2~2")
        if L.get("flash") is not None:
            check_value_slot(ctx, content, iss, path + ".flash", L["flash"])
        if ev == "impact":   # run 20261015-084459: the critic caught rings and rays past the burst cap; now deterministic
            cap = 2 * 2 * ctx["registry"]["body.radius"]["value"]
            for blk, key in (("ring", "radius"), ("rays", "length")):
                if L.get(blk):
                    x = L[blk].get(key)
                    for xi in (x if isinstance(x, list) else [x]):
                        xv = resolve(ctx, content, xi) if isinstance(xi, str) else None
                        if isinstance(xv, (int, float)) and xv > cap:
                            iss.add("rule", f"{path}.{blk}.{key}", xv, f"The impact burst is at most 2 × body width ({cap:g} units).", "EDIT26#4.2~2")
        if ev in sp["no_reward_events"]:
            for blk in sp["reward_blocks"]:
                if L.get(blk):
                    iss.add("rule", f"{path}.{blk}", ev, f"'{ev}' is not a scored hit; it must not use hit reward feedback ({blk}).", "DESIGN#D4.5")
            if any(p.get("type") == "spark" for p in L.get("particles") or []):
                iss.add("rule", path + ".particles", "spark", f"Sparks read as a scored hit; '{ev}' is not one.", "DESIGN#D4.5")
        for j, pt in enumerate(L.get("particles") or []):
            pp = f"{path}.particles[{j}]"
            if pt.get("type") not in sp["particle_types"]:
                iss.add("data", pp + ".type", pt.get("type"), "Unsupported particle type.", "pipeline:consumer")
            if pt.get("dir", "random") not in sp["particle_dirs"]:
                iss.add("data", pp + ".dir", pt.get("dir"), "Unsupported particle direction.", "pipeline:consumer")
            if pt.get("at", "dummy") not in sp["particle_at"]:
                iss.add("data", pp + ".at", pt.get("at"), "Particles spawn at the dummy, the contact or the car.", "pipeline:consumer")
            if pt.get("at") in ("car", "contact") or pt.get("dir") == "away":
                if "car" not in fields:
                    iss.add("truth", pp + ".at", pt.get("at") or pt.get("dir"), f"'{ev}' names no car; spawn at the dummy.", "pipeline:consumer")
            if pt.get("role") not in sp["particle_roles"]:
                iss.add("rule", pp + ".role", pt.get("role"), "Particles avoid reserved inks: red warns, primary and secondary are cue inks, aqua is frame-only.", "EDIT26#4.2~2")
            for k in ("count", "speed", "life", "size"):
                check_value_slot(ctx, content, iss, f"{pp}.{k}", pt.get(k))
        snd = L.get("sound")
        if snd:
            if snd.get("type") not in sp["sound_types"]:
                iss.add("data", path + ".sound.type", snd.get("type"), "Sound is a 'tone' or a 'noise' burst.", "pipeline:consumer")
            if snd.get("type") == "tone" and snd.get("wave") not in sp["waves"]:
                iss.add("data", path + ".sound.wave", snd.get("wave"), f"Waves are {sp['waves']}.", "pipeline:consumer")
            for k in ("from", "to", "seconds", "gain"):
                check_value_slot(ctx, content, iss, f"{path}.sound.{k}", snd.get(k))
            g = snd.get("gain")
            for x in (g if isinstance(g, list) else [g]):
                gv = resolve(ctx, content, x) if isinstance(x, str) else None
                if isinstance(gv, (int, float)) and gv > sp["max_gain"]:
                    iss.add("data", f"{path}.sound.gain", gv, f"The renderer clamps gain to {sp['max_gain']}; a higher value is silently lost.", "pipeline:consumer", "fix")
            for k in ("from", "to"):
                v = snd.get(k)
                for x in (v if isinstance(v, list) else [v]):
                    hz = resolve(ctx, content, x) if isinstance(x, str) else None
                    if isinstance(hz, (int, float)) and not 20 <= hz <= 12000:
                        iss.add("data", f"{path}.sound.{k}", hz, "Frequencies are audible: 20 to 12000 Hz.", "pipeline:consumer")
    return seen, accents


# ---------------------------------------------------------------- terminal (P2.1 interface skin)
def terminal(content, ctx, iss):
    sp, reg = ctx["spec"]["allowed"], ctx["registry"]
    fx0, fy0, fx1, fy1 = sp["field_rect"]

    def role(path, r, where):
        if r is None:
            return
        if r in sp["forbidden_roles"]:
            iss.add("rule", path, r, sp["forbidden_roles"][r], "DESIGN#D10.2")
        elif r not in sp["frame_roles"]:
            iss.add("rule", path, r, f"Frame colours are {sp['frame_roles']}.", "DESIGN#D10.2")
        elif r == "dummy" and not any(where.startswith(w) for w in sp["dummy_role_only_in"]):
            iss.add("rule", path, r, "Safety yellow marks the dummy and its body facts, not the brand.", "DESIGN#D10.1")

    bd = content.get("backdrop") or {}
    stops = bd.get("stops") or []
    if not 2 <= len(stops) <= 4:
        iss.add("data", "backdrop.stops", len(stops), "The backdrop gradient has 2 to 4 stops.", "pipeline:consumer")
    last = -1
    for i, s in enumerate(stops):
        role(f"backdrop.stops[{i}].role", s.get("role"), "backdrop")
        at, al = s.get("at"), s.get("alpha", 1)
        if not isinstance(at, (int, float)) or not 0 <= at <= 1 or at < last:
            iss.add("data", f"backdrop.stops[{i}].at", at, "Stops run from 0 to 1, top to bottom.", "pipeline:consumer")
        else:
            last = at
        if not isinstance(al, (int, float)) or not 0 <= al <= 1:
            iss.add("data", f"backdrop.stops[{i}].alpha", al, "Alpha is 0 to 1.", "pipeline:consumer")
    for i, g in enumerate(bd.get("glows") or []):
        role(f"backdrop.glows[{i}].role", g.get("role"), "backdrop")
        x, y = g.get("x", 0), g.get("y", 0)
        if fx0 < x < fx1 and fy0 < y < fy1:
            iss.add("rule", f"backdrop.glows[{i}]", [x, y], "Bloom stays in the frame; a glow centred behind the play field is never seen.", "DESIGN#D10.1", "fix")
    hd = content.get("header") or {}
    if not hd.get("product") or len(hd.get("product", "")) > sp["product_max_chars"]:
        iss.add("data", "header.product", hd.get("product"), f"Product name, 1 to {sp['product_max_chars']} characters.", "pipeline:consumer")
    if not CJK_RE.search(hd.get("productZh") or ""):
        iss.add("lore", "header.productZh", hd.get("productZh"), "The lockup is bilingual (district identifiers).", "DESIGN#D9.2")
    if len(hd.get("tagline") or "") > sp["tagline_max_chars"]:
        iss.add("rule", "header.tagline", hd.get("tagline"), f"Tagline fits the strip: {sp['tagline_max_chars']} characters.", "DESIGN#D10.2", "fix")
    no_digits(iss, "header.tagline", hd.get("tagline"), "Brand copy states no figures; every statistic maps to a parameter.", "project rule: data alignment")
    badges = hd.get("badges") or []
    if len(badges) > sp["max_badges"]:
        iss.add("data", "header.badges", len(badges), f"At most {sp['max_badges']} badges.", "pipeline:consumer", "fix")
    for i, b in enumerate(badges):
        if not isinstance(b, str) or len(b) > sp["badge_max_chars"]:
            iss.add("rule", f"header.badges[{i}]", b, f"Badges are short static labels (≤{sp['badge_max_chars']}).", "DESIGN#D10.2", "fix")
        no_digits(iss, f"header.badges[{i}]", b, "Static badges state no figures; an invented number is an undocumented statistic.", "project rule: data alignment")
    pn = content.get("panels") or {}
    for k in ("radius", "gloss", "borderAlpha", "shadow"):
        check_value_slot(ctx, content, iss, f"panels.{k}", pn.get(k), False)
    role("panels.border", pn.get("border"), "panels")
    role("panels.bandRole", pn.get("bandRole"), "panels")
    ic = content.get("icons") or {}
    h = sp["icon_half_size"] + 0.5
    for m in sp["icon_modules"]:
        shapes = ic.get(m)
        if not shapes:
            iss.add("data", "icons", m, f"Icon for {m} is required.", "pipeline:spec gap")
            continue
        for j, s in enumerate(shapes):
            path = f"icons.{m}[{j}]"
            if s.get("shape") not in sp["shapes"]:
                iss.add("data", path + ".shape", s.get("shape"), f"Icon shapes are {sp['shapes']}.", "pipeline:consumer")
                continue
            for key in ("fill", "stroke", "a", "b"):
                role(f"{path}.{key}", s.get(key), f"icons.{m}")
            x0, y0, x1, y1 = bbox(s)
            if x0 < -h or y0 < -h or x1 > h or y1 > h:
                iss.add("rule", path, [round(x0, 1), round(y0, 1), round(x1, 1), round(y1, 1)], "Icons fit their 16-unit box.", "pipeline:consumer", "fix")
    tx = content.get("texture") or {}
    ids = tx.get("diagnostics") or []
    lo, hi = sp["diagnostic_ids"]
    if not lo <= len(ids) <= hi:
        iss.add("data", "texture.diagnostics", len(ids), f"{lo} to {hi} registry IDs.", "pipeline:consumer", "fix")
    for i, pid in enumerate(ids):
        if pid not in reg:
            iss.add("data", f"texture.diagnostics[{i}]", pid, "Diagnostics print real registry IDs only.", "ENG#13.5")
        elif re.match(r"proto\.(term|barks|hits|juice|ui)\.", pid):
            iss.add("data", f"texture.diagnostics[{i}]", pid, "Diagnostics print simulation parameters, not presentation ones.", "ENG#13.5", "fix")
    check_value_slot(ctx, content, iss, "texture.rangeMarks", tx.get("rangeMarks"), False)
    sg = content.get("signage") or {}
    sl = sg.get("lines") or []
    lo, hi = sp["sign_lines"]
    if not lo <= len(sl) <= hi:
        iss.add("data", "signage.lines", len(sl), f"{lo} to {hi} notices.", "pipeline:consumer", "fix")
    for i, ln in enumerate(sl):
        t = ln.get("text") if isinstance(ln, dict) else ln
        path = f"signage.lines[{i}].text"
        if not isinstance(t, str) or not t:
            iss.add("data", path, t, "Each notice has English text.", "pipeline:consumer")
            continue
        if len(t) > sp["sign_max_chars"]:
            iss.add("rule", path, t, f"Notices fit the band: {sp['sign_max_chars']} characters.", "DESIGN#D10.2", "fix")
        if placeholders(t):
            iss.add("truth", path, t, "Signage is static texture; it cannot report the run.", "EDIT26#4.2~3")
        no_digits(iss, path, t, "Signage states no figures; texture never changes with play and invents no statistics.", "EDIT26#4.2~3")
        short_sentences(iss, path, t)
    check_value_slot(ctx, content, iss, "signage.seconds", sg.get("seconds"), False)
    ti = content.get("title") or {}
    allow = sp["title_placeholders"]
    tl = ti.get("lines") or []
    if len(tl) != 2:
        iss.add("data", "title.lines", len(tl), "Two title lines.", "pipeline:consumer")
    items = [("eyebrow", ti.get("eyebrow"))] + [(f"lines[{i}]", s) for i, s in enumerate(tl)] + [("start", ti.get("start"))] + \
        [(f"difficulty.{k}", (ti.get("difficulty") or {}).get(k)) for k in ("Fragile", "Standard", "Reinforced")]
    for key, s in items:
        path = "title." + key
        if not isinstance(s, str) or not s:
            iss.add("data", path, s, "Title copy slot is required.", "pipeline:consumer")
            continue
        slot = key.split("[")[0].split(".")[0]
        for ph in placeholders(s):
            if ph not in allow.get(slot, []):
                iss.add("truth", path, "{" + ph + "}", f"Placeholder not available here (allowed: {allow.get(slot, [])}).", "pipeline:consumer")
        no_digits(iss, path, s, "Figures come from placeholders bound to registry values, never typed.", "project rule: data alignment")
        short_sentences(iss, path, s)
    if isinstance(ti.get("start"), str) and not re.search(r"\bA\b|Space", ti["start"]):
        iss.add("rule", "title.start", ti.get("start"), "The start prompt names the button (A or Space).", "EDIT26#4.2~4", "fix")
    required_params(content, ctx, iss, sp["required_params"])


# ================================================================ P3.3 targets (Submission 4)
SIT_KEYS = ("drop", "dropZ", "dropFrom", "deck", "plate", "district")
CITIES = ["Beijing", "Shanghai", "Guangzhou", "Chongqing", "Hong Kong", "Chengdu", "Wuhan", "Hangzhou", "Tokyo", "London", "New York"]


def canon_text(iss, path, text, fleet, severity="block"):
    """Fleet canon applies to every string the game shows: banned terms, city names, FARSIGHT in capitals."""
    low = text.lower()
    for w in fleet["canon"]["banned"]:
        if re.search(r"\b" + re.escape(w.lower()) + r"(?:s|d|ed)?\b", low):   # 'scores', 'levels' count too
            iss.add("lore", path, text, f"Banned term '{w}' (fleet canon).", "FLEET#F2", severity)
    for c in CITIES:
        if c.lower() in low and c not in fleet["canon"]["cities"]:
            iss.add("lore", path, text, f"Names {c}; the setting is Shenzhen Smart City.", "EDIT39#3.1")
    if re.search(r"\bfarsight\b", text, re.I) and "FARSIGHT" not in text:
        iss.add("lore", path, text, "Write FARSIGHT in capitals.", "FLEET#F1", "fix")


def run_lore_check(fleet, lines):
    """Merge the draft into a copy of the fleet database and run content/db/check_lore.py on it."""
    import subprocess, tempfile, pathlib
    root = pathlib.Path(__file__).resolve().parent.parent
    d = json.loads(json.dumps(fleet))
    d["barks"] = [b for b in d["barks"] if not re.match(r"^c\d+$", b["id"])] + \
        [{k: v for k, v in ln.items() if k in ("id", "event", "when", "style", "priority", "text", "claims")} for ln in lines if isinstance(ln, dict)]
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump(d, f, ensure_ascii=False)
    out = subprocess.run([sys.executable, str(root / "content" / "db" / "check_lore.py"), f.name, str(root / "prototypes" / "p3" / "sim.js")],
                         capture_output=True, text=True)
    pathlib.Path(f.name).unlink()
    return [ln[6:] for ln in out.stdout.splitlines() if ln.startswith("ERROR ")]


def citybarks(content, ctx, iss):
    sp, fleet, facts = ctx["spec"]["allowed"], ctx["fleet"], ctx["levels"]
    lines = content.get("lines") or []
    if not lines:
        iss.add("data", "lines", None, "The new lines are the deliverable.", "pipeline:spec gap")
        return
    old = {b["text"].strip().lower() for b in fleet["barks"] if not re.match(r"^c\d+$", b["id"])}
    ids, texts, styles = set(), set(), set()
    idx = {}
    for i, b in enumerate(lines):
        path, ev, w, text = f"lines[{i}]", b.get("event"), b.get("when") or {}, b.get("text") or ""
        idx[b.get("id")] = path
        if not re.fullmatch(r"c\d{3}", str(b.get("id"))):
            iss.add("data", path + ".id", b.get("id"), "Pipeline lines use ids c001, c002, …", "pipeline:consumer")
        if b.get("id") in ids:
            iss.add("data", path + ".id", b.get("id"), "Duplicate id.", "pipeline:consumer")
        ids.add(b.get("id"))
        if ev not in sp["events"]:
            iss.add("data", path + ".event", ev, f"City barks bind to {sp['events']}.", "pipeline:consumer")
            continue
        fields = set(fleet["events"][ev]) | set(fleet["context"])
        for k, v in w.items():
            if k not in fields:
                iss.add("truth", f"{path}.when.{k}", k, f"'{ev}' lines may test only {sorted(fields)}.", "FLEET#F8")
            elif k in sp["values"] and v not in sp["values"][k]:
                iss.add("truth", f"{path}.when.{k}", v, f"{k} = {v!r} never happens in the P3 city (possible: {sp['values'][k]}).", "FLEET#F6")
        if not any(k in w for k in SIT_KEYS):
            iss.add("data", path + ".when", w, "Each city line tests a situation (drop, dropZ, dropFrom, deck, plate or district); otherwise it adds nothing the city needs.", "pipeline:spec gap")
        # situations the city can and cannot produce (GDD Edit 44; Game data)
        dist = w.get("district")
        if w.get("dropFrom") == "roof" and w.get("dropZ") == 1:
            iss.add("truth", path + ".when", w, "Roofs are Z2: a roof drop is never dropZ 1.", "EDIT44#7.7")
        if (w.get("drop") or w.get("dropZ") or w.get("dropFrom")) and w.get("deck"):
            iss.add("truth", path + ".when", w, "No ledge or gap drops onto highway traffic in any baked layout.", "BRIEF: Game data")
        if w.get("plate") and (w.get("deck") or (dist and dist != "campus")):
            iss.add("truth", path + ".when", w, "Calibration plates are on Campus ground roads only.", "EDIT41#7.3")
        if dist in facts:
            f = facts[dist]
            if (w.get("deck") or w.get("dropFrom") == "deck") and not f["decks"]:
                iss.add("truth", path + ".when", w, f"{f['name']} has no highway.", "EDIT41#7.2")
            if w.get("deck") and w.get("dropZ") == 2 and not f["highDecks"]:
                iss.add("truth", path + ".when", w, f"{f['name']} has no Z2 highway.", "EDIT44#7.1.1")
            if w.get("dropFrom") == "deck" and w.get("dropZ") == 2 and not f["highDecks"]:
                iss.add("truth", path + ".when", w, f"{f['name']} has no Z2 highway to fall from.", "EDIT44#7.1.1")
        pri = sp["priorities"].get(ev)
        if b.get("priority") != pri:
            iss.add("data", path + ".priority", b.get("priority"), f"{ev} lines take priority {pri}.", "EDIT26#6.6")
        if b.get("style") not in sp["styles"]:
            iss.add("data", path + ".style", b.get("style"), f"Bubble styles are {sp['styles']}.", "EDIT39#6.6")
        styles.add(b.get("style"))
        if len(text) > sp["max_chars"]:
            iss.add("rule", path + ".text", text, f"Bubbles hold at most {sp['max_chars']} characters.", "EDIT39#6.6")
        if text.strip().lower() in old:
            iss.add("data", path + ".text", text, "Repeats an existing fleet line.", "FLEET#F9", "fix")
        if text.strip().lower() in texts:
            iss.add("data", path + ".text", text, "Repeats another new line.", "pipeline:consumer", "fix")
        texts.add(text.strip().lower())
        short_sentences(iss, path + ".text", text)
        canon_text(iss, path + ".text", text, fleet)
        if not isinstance(b.get("claims"), list):
            iss.add("data", path + ".claims", b.get("claims"), "Every line lists its claims (may be empty).", "EDIT39#6.6.1")
    for case in sp["required_cases"]:
        n = sum(1 for b in lines if b.get("event") == case["event"] and when_matches(case["when"], b.get("when") or {}))
        if n < case["min_lines"]:
            iss.add("data", "lines", f"{case['event']} {json.dumps(case['when'])}: {n} line(s)", f"The gap needs at least {case['min_lines']} line(s) for this case.", "pipeline:spec gap")
    stock = [b.get("id") for b in lines if re.search(r"\b(noted|logged|recorded)\.$", (b.get("text") or "").strip(), re.I)]
    if len(stock) > 2:   # run 20261021-022042: truthful but flat; nine lines ended "Noted." or "Logged."
        iss.add("tone", "lines", ", ".join(stock), "At most two lines end with a stock 'Noted.', 'Logged.' or 'Recorded.'; give the rest the car's own reaction.", "FLEET#F2", "fix")
    for t in sp["tier_cases"]:
        if not any((b.get("when") or {}).get("tier") == t for b in lines):
            iss.add("data", "lines", f"tier {t}", f"Tier {t} needs its own voice in at least one line.", "FLEET#F4", "fix")
    # P2.1's "use every bubble style" rule is not applied here: runs 20261021-022042 and -023310 showed it fighting the
    # critic. The generator added a shout to satisfy it; the critic removed it (FLEET#F4: only the angry Budget tier shouts,
    # and only Luxury and Corporate run in P3).
    for e in run_lore_check(fleet, lines):     # the database's own lore check (decision 114)
        m = re.match(r"^(c\d+): (.*)$", e)
        if m:
            iss.add("truth" if "claim" in m.group(2) or "asserts" in m.group(2) else "lore", idx.get(m.group(1), "lines"), m.group(1), m.group(2), "EDIT39#6.6.1")


def places(content, ctx, iss):
    sp, fleet, facts = ctx["spec"]["allowed"], ctx["fleet"], ctx["levels"]
    ds = content.get("districts") or {}
    mx = sp["max_chars"]
    fw = sp["feature_words"]

    def has_word(text, words):
        low = text.lower()
        return [w for w in words if re.search(r"\b" + re.escape(w) + r"\b", low)]
    for did in sp["districts"]:
        d = ds.get(did)
        if not isinstance(d, dict):
            iss.add("data", f"districts.{did}", None, "Every district needs its copy.", "pipeline:spec gap")
            continue
        f = facts[did]
        lw = sp["landmark_words"][f["focal"]]
        intro = d.get("intro") or ""
        ip = f"districts.{did}.intro"
        if not intro:
            iss.add("data", ip, None, "Every district needs an intro.", "pipeline:spec gap")
        if len(intro) > mx["intro"]:
            iss.add("rule", ip, intro, f"Intro at most {mx['intro']} characters: it shares the toast with the name and quota.", "EDIT40#4.2", "fix")
        if len(sentences(intro)) > 2:
            iss.add("rule", ip, intro, "One or two sentences.", "pipeline:consumer", "fix")
        if not has_word(intro, lw):
            iss.add("truth", ip, intro, f"The intro names the centre landmark ({f['focal']}).", "EDIT41#7.1.1")
        no_digits(iss, ip, intro, "No numbers in copy: the renderer adds the quota.", "pipeline:consumer")
        short_sentences(iss, ip, intro)
        canon_text(iss, ip, intro, fleet)
        sc = d.get("screens") or {}
        seen = {}
        for cell in sp["cells"]:
            name = sc.get(cell)
            path = f"districts.{did}.screens.{cell}"
            if not isinstance(name, str) or not name.strip():
                iss.add("data", path, name, "Every screen needs a name.", "pipeline:spec gap")
                continue
            c = f["cells"][cell]
            if len(name) > mx["screen"]:
                iss.add("rule", path, name, f"Screen names at most {mx['screen']} characters.", "pipeline:consumer")
            if name.rstrip().endswith("."):
                iss.add("rule", path, name, "A name has no full stop.", "pipeline:consumer", "fix")
            if name.lower() in seen:
                iss.add("data", path, name, f"Same name as {seen[name.lower()]}.", "pipeline:consumer")
            seen[name.lower()] = cell
            no_digits(iss, path, name, "No numbers in names.", "pipeline:consumer")
            canon_text(iss, path, name, fleet)
            if cell == "B2" and not has_word(name, lw):
                iss.add("truth", path, name, f"B2 holds the landmark ({f['focal']}); its name says so.", "EDIT41#7.1.1")
            for feat, words in fw.items():
                hit = has_word(name, words)
                if not hit:
                    continue
                if feat == "river":
                    ok = c["river"]
                elif feat == "highway":
                    ok = c["highway"] == "all"
                elif feat == "roundabout":
                    ok = c["roundabout"] == "all"
                else:
                    ok = c[feat] == "all"
                if not ok:
                    iss.add("truth", path, name, f"'{hit[0]}' promises a {feat} that not every layout of {f['name']} {cell} has ({'yes' if feat == 'river' and c['river'] else c.get(feat, 'none')}).", "BRIEF: Game data")
        d.setdefault("sources", d.get("sources"))
    lv = content.get("levels") or {}
    for k in sp["levels"]:
        t = lv.get(k)
        path = f"levels.{k}"
        if not isinstance(t, str) or not t.strip():
            iss.add("data", path, t, "Each new level needs its toast.", "pipeline:spec gap")
            continue
        if len(t) > mx["level"]:
            iss.add("rule", path, t, f"Level toasts at most {mx['level']} characters.", "pipeline:consumer", "fix")
        no_digits(iss, path, t, "No numbers in copy.", "pipeline:consumer")
        short_sentences(iss, path, t)
        canon_text(iss, path, t, fleet)
    if lv.get("roof") and re.search(r"\b(cars?|traffic|vehicles?)\b", lv["roof"], re.I) and not re.search(r"\bno (cars?|traffic|vehicles?)\b", lv["roof"], re.I):
        iss.add("truth", "levels.roof", lv["roof"], "Nothing drives on a roof; cars below are reached only by dropping.", "EDIT44#7.7", "fix")


def drops(content, ctx, iss):
    sp, fields_of = ctx["spec"]["allowed"], ctx["event_fields"]
    for k in ("hitStop", "reducedMotion"):
        if k in content:
            iss.add("rule", k, content.get(k), f"'{k}' belongs to the published hit juice; drop layers only stack on it.", "pipeline:consumer")
    seen, _ = check_layers(content, ctx, iss, sp, fields_of)
    layers = content.get("layers") or []
    for need in sp["required_events"]:
        if need not in seen:
            iss.add("data", "layers", need, f"The gap needs a base layer (when {{}}) for '{need}'.", "pipeline:spec gap")
    for req in sp["required_layers"]:
        if not any(L.get("event") == req["event"] and (L.get("when") or {}) == req["when"] for L in layers):
            iss.add("data", "layers", f"{req['event']} {json.dumps(req['when'])}", "The gap needs this layer.", "pipeline:spec gap")
    for i, L in enumerate(layers):
        path, ev, w = f"layers[{i}]", L.get("event"), L.get("when") or {}
        if ev == "land" and ("car" not in w or w.get("car") is not None):
            iss.add("truth", path + ".when", w, "A landing on a car also fires an impact: land layers use when {\"car\": null}, or the hit is juiced twice.", "pipeline:consumer")
        if ev in ("impact", "writeoff") and not any(k in w for k in sp["situation_keys"]):
            iss.add("rule", path + ".when", w, "Drop juice only adds to hits from above; a layer without drop, dropZ or dropFrom would change every ground hit.", "pipeline:designer decision")
        if ev in ("land", "deck-drop") and (L.get("scale") or {}).get("by") != "h":
            iss.add("data", path + ".scale", L.get("scale"), "Height must be felt: scale by the fall height h.", "pipeline:spec gap")
        for j, pt in enumerate(L.get("particles") or []):
            if ev == "land" and pt.get("at") == "car":
                iss.add("truth", f"{path}.particles[{j}].at", "car", "An open-ground landing names no car.", "pipeline:consumer")


VALIDATORS = {"juice": juice, "interface": interface, "graphics": graphics, "barks": barks, "hits": hits, "terminal": terminal,
              "citybarks": citybarks, "places": places, "drops": drops}


def validate(kind, content, ctx):
    iss = Issues()
    if not isinstance(content, dict):
        iss.add("data", "", type(content).__name__, "Output must be one JSON object.", "pipeline")
        return iss
    common(content, ctx, iss)
    VALIDATORS[kind](content, ctx, iss)
    return iss
