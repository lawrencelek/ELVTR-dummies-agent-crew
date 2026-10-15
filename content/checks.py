"""Deterministic validators. They run before the critic and gate publication.

Every rule cites the canon it enforces. Issues use the same shape as the critic's:
{id, kind, severity, path, found, canon, rule}.
"""
import math
import re

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


VALIDATORS = {"juice": juice, "interface": interface, "graphics": graphics}


def validate(kind, content, ctx):
    iss = Issues()
    if not isinstance(content, dict):
        iss.add("data", "", type(content).__name__, "Output must be one JSON object.", "pipeline")
        return iss
    common(content, ctx, iss)
    VALIDATORS[kind](content, ctx, iss)
    return iss
