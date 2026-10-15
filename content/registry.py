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
