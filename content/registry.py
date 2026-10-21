"""Canon the validators check against: parameter IDs, palette roles, sim events and level geometry.

Parameter IDs come from two places and are merged:
  - Engineering §13.5 (the V29 registry table), parsed from the KB copy.
  - prototypes/p2/sim.js REG, PROTO and OVERRIDES (the P1.9 sim the consumer runs), read with Node.
Palette roles come from Design D10.2. Nothing here is typed by hand that the docs already state.
"""
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
P1 = ROOT / "prototypes" / "p2"   # consumer sim: byte-identical to the P1.9 freeze

# D10.2 role names -> the key game.js uses for that role (game.js const C)
ROLE_KEYS = {"Floor": "floor", "Grid": "grid", "Structure": "structure", "Fleet": "fleet", "Dummy body": "dummy",
             "Dummy joints": "joints", "Primary cue": "primary", "Secondary cue": "secondary", "Warning": "warning",
             "Brand aqua": "aqua"}
# P1 field roles that game.js adds for the road surface (not in D10.2; field-only, matte)
P1_FIELD_ROLES = {"road": ("#DCE3E7", "P1 tarmac fill"), "shoulder": ("#E5EAED", "P1 pavement shoulder fill")}

# Sim events the renderer receives (sim.js emit calls) and the fields each carries.
SIM_EVENTS = {
    "lunge": ["R", "charge"], "impact": ["car", "model", "cls", "zone", "closing", "angle", "dv", "strike", "raw", "assessed",
                                         "lost", "health", "carState", "cause", "bait", "lunging", "learned", "stopped",
                                         "learnedStandoff"],
    "knock": ["car", "speed"], "touch-spent": ["car"], "touch": ["car", "closing"], "honk": ["car", "at"],
    "learn-standoff": ["model", "from", "to"], "unstick": ["car", "how"], "drone-dispatch": ["cone"],
    "drone-pickup": ["cone"], "drone-drop": ["cone", "x", "y"], "writeoff": ["chassis", "writeOffs"],
    "chassis": ["chassis", "x", "y"], "denied": ["action"], "purchase": ["node", "price", "credits"],
    "purchase-denied": ["node", "why"], "pickup": ["cone"], "drop": ["cone", "x", "y"], "throw": ["cone", "vx", "vy"],
    "punt": ["cone"], "ending": ["kind"], "admit": ["car", "cls", "model", "lane"], "commit": ["car", "man", "cause"],
    "interrupt": ["car", "by"], "release": ["car"], "exit": ["car", "spent"], "road-cleared": ["road"],
    "credit": ["credits"], "cone-struck": ["cone", "car"],
}
CAR_EVENTS = [e for e, f in SIM_EVENTS.items() if "car" in f]

# P2.1: cases the renderer derives from sim state each frame and logs in the trace under 'presentation'.
PRESENT_EVENTS = {
    "near-miss": ["car", "model", "cls", "seniority", "gap", "speed", "lunging"],
    "miss": ["car", "model", "cls", "seniority", "gap"],
    "upgrade-seen": ["car", "model", "cls", "seniority", "node"],
}
CAR_DERIVED = ["model", "cls", "seniority"]   # added by the renderer to every event that names a car


def event_fields(ev):
    """Fields a bark or hit layer may read for an event: logged sim fields plus renderer-derived ones."""
    if ev in PRESENT_EVENTS:
        return PRESENT_EVENTS[ev]
    f = list(SIM_EVENTS[ev])
    if ev == "writeoff":   # attributed to the impact that caused it in the same step (sim.js account -> writeOff)
        f += ["car", "zone"]
    if "car" in f:
        f += [x for x in CAR_DERIVED if x not in f]
    return f


# Frame-only colours game.js uses for FARSIGHT chrome (not in D10.2; frame layer only).
FRAME_ROLES = {"glass": ("#FFFFFF", "P1 frame glass"), "aquaDeep": ("#1E8FB8", "P1 frame accent and frame text")}


def eng_registry(kb_dir):
    text = (Path(kb_dir) / "DUMMIES_V29_Engineering_Spec.md").read_text(encoding="utf-8")
    sec = text.split("### 13.5", 1)[1]
    reg = {}
    for m in re.finditer(r"^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|", sec, re.M):
        try:
            v = float(m.group(2).replace(",", ""))
        except ValueError:
            continue
        reg[m.group(1)] = {"value": v, "unit": m.group(3), "owner": m.group(4), "source": "ENG#13.5"}
    return reg


def node_json(expr):
    js = f"const D=require({json.dumps(str(P1 / 'sim.js'))});process.stdout.write(JSON.stringify({expr}));"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def p1_registry():
    d = node_json("{REG:D.REG,PROTO:D.PROTO,OVERRIDES:D.OVERRIDES}")
    reg = {}
    for k, v in d["REG"].items():
        reg[k] = {"value": v, "source": "P1 sim.js REG"}
    for k, v in d["PROTO"].items():
        reg[k] = {"value": v, "source": "P1 sim.js PROTO"}
    for k, v in d["OVERRIDES"].items():
        reg.setdefault(k, {})
        reg[k] = dict(reg[k], value=v, source="P1 sim.js OVERRIDES")
    return reg


def registry(kb_dir):
    reg = eng_registry(kb_dir)
    for k, v in p1_registry().items():
        reg[k] = dict(reg.get(k, {}), **v)
    return reg


def palette(kb_dir):
    text = (Path(kb_dir) / "DUMMIES_V29_Design.md").read_text(encoding="utf-8")
    sec = text.split("### D10.2", 1)[1].split("### D10.3", 1)[0]
    roles = {}
    for m in re.finditer(r"^\|\s*([^|]+?)\s*\|\s*`(#[0-9A-Fa-f]{6})`\s*\|\s*([^|]+?)\s*\|", sec, re.M):
        if m.group(1) in ROLE_KEYS:
            roles[ROLE_KEYS[m.group(1)]] = {"hex": m.group(2).upper(), "use": m.group(3), "source": "DESIGN#D10.2"}
    for k, (hx, use) in P1_FIELD_ROLES.items():
        roles[k] = {"hex": hx, "use": use, "source": "P1 game.js"}
    for k, (hx, use) in FRAME_ROLES.items():
        roles[k] = {"hex": hx, "use": use, "source": "P1 game.js (frame only)"}
    return roles


def levels():
    """Road centreline, statics, cone homes and spawns per P1 road, from sim.js."""
    return node_json("""Object.fromEntries(D.LEVEL_LIST.map(id=>{const s=new D.Sim(id,{'run.appearances.road':0});const L=s.level;
      return [id,{name:L.name,blurb:L.blurb,center:L.center.map(p=>p.map(v=>Math.round(v))),statics:L.statics.map(({x,y,w,h,kind})=>({x,y,w,h,kind})),
      cones:D.LEVELS[id].cones,spawns:D.LEVELS[id].spawns}]}))""")


def summary(kb_dir):
    reg = registry(kb_dir)
    return {"params": len(reg), "palette": list(palette(kb_dir)), "levels": list(levels())}


if __name__ == "__main__":
    print(json.dumps(summary(ROOT / "content" / "kb"), indent=1))


# ================================================================== P3.3 targets (Submission 4)
# Consumer: prototypes/p3 (the current prototype). Canon values: the registry file content/params/tuning.parameters.json
# (edit44), the P3 sim's REG/PROTO/OVERRIDES, and parameters already published by earlier content (prototypes/p3/content).
P3 = ROOT / "prototypes" / "p3"
DISTRICT_IDS = ["riverside", "market", "interchange", "cbd", "campus"]

SIM_EVENTS_P3 = dict(SIM_EVENTS)
SIM_EVENTS_P3.update({
    "impact": SIM_EVENTS["impact"] + ["part", "plate", "drop", "deck", "dropZ", "dropFrom"],
    "land": ["car", "x", "y", "level", "fromZ", "h", "fromKind"],          # the dummy lands; car is null on open ground
    "deck-drop": ["x", "y", "from", "to", "h", "fromKind"],                 # the dummy steps off a ledge or a broken parapet
    "level": ["level", "floor"], "stair": ["from", "toward"],
    "screen": ["from", "to", "side", "theme", "focal", "level"],
})
SITUATION = ["drop", "dropZ", "dropFrom", "deck", "plate"]


def event_fields_p3(ev):
    if ev in PRESENT_EVENTS:
        f = list(PRESENT_EVENTS[ev])
    else:
        f = list(SIM_EVENTS_P3[ev])
    if ev == "writeoff":   # the renderer attributes it to the impact that caused it (game.js enrich)
        f += ["car", "zone"] + SITUATION
    if "car" in f and f[0] == "car" or ev in ("writeoff", "near-miss", "miss"):
        f += [x for x in CAR_DERIVED + ["tier", "class", "wear", "district"] if x not in f]
    return f


def node_json_p3(expr):
    js = f"const D=require({json.dumps(str(P3 / 'sim.js'))});process.stdout.write(JSON.stringify({expr}));"
    out = subprocess.run(["node", "-e", js], capture_output=True, text=True, check=True, cwd=str(ROOT))
    return json.loads(out.stdout)


def registry_p3():
    reg = {}
    tp = json.loads((ROOT / "content" / "params" / "tuning.parameters.json").read_text(encoding="utf-8"))
    for e in tp["entries"]:
        if isinstance(e.get("default"), (int, float)) and not isinstance(e.get("default"), bool):
            reg[e["id"]] = {"value": e["default"], "unit": e.get("unit", ""), "source": "registry " + tp["registryVersion"]}
    d = node_json_p3("{REG:D.REG,PROTO:D.PROTO,OVERRIDES:D.OVERRIDES}")
    for part in ("REG", "PROTO", "OVERRIDES"):
        for k, v in d[part].items():
            if isinstance(v, (int, float)) and not isinstance(v, bool):
                reg[k] = dict(reg.get(k, {}), value=v, source="P3 sim.js " + part)
    for p in sorted((P3 / "content").glob("*.json")):
        if p.stem in ("places", "drops"):
            continue   # this pipeline's own outputs never become canon for themselves
        for q in json.loads(p.read_text(encoding="utf-8")).get("params") or []:
            reg.setdefault(q["id"], {"value": q["value"], "unit": q.get("unit", ""), "source": f"published {p.name}"})
    return reg


def districts_p3():
    """Per district and screen, what all three baked layouts guarantee (and what only some have)."""
    return node_json_p3("""(()=>{const out={};for(const id of D.DISTRICT_LIST){const lay=[1,2,3].map(k=>new D.Sim(id,{'proto.layout':k}).district);
      const info=D.DISTRICTS[id], cells={};
      for(let y=0;y<3;y++)for(let x=0;x<3;x++){const name='ABC'[x]+(y+1), f=lay.map(Dd=>{const lv=D.cellLevel(Dd,[x,y],Dd.P||new D.Sim(id).P);return lv;});
        const P=new D.Sim(id).P, L=lay.map(Dd=>D.cellLevel(Dd,[x,y],P));
        const has=(fn)=>{const n=L.filter(fn).length;return n===3?'all':n?'some':'none';};
        cells[name]={river:y===0, landmark:x===1&&y===1?info.focal:null,
          highway:has(lv=>lv.decks.length>0), lowHighway:has(lv=>lv.decks.some(d=>d.z===1)), highHighway:has(lv=>lv.decks.some(d=>d.z===2)),
          checkpoint:has(lv=>lv.checkpoints.some(c=>!c.deck)), roofs:has(lv=>lv.floors.some(f=>f.kind==='roof')),
          skybridge:has(lv=>lv.floors.some(f=>f.kind==='bridge')), roundabout:has(lv=>!!lv.ring), start:x===1&&y===0};}
      out[id]={name:info.name, blurb:info.blurb, focal:info.focal, quota:P0(id,'quota'), decks:P0(id,'decks'), highDecks:P0(id,'highDecks'), cells};}
      return out;function P0(id,f){return D.REG['world.district.'+id+'.'+f];}})()""")
