#!/usr/bin/env python3
"""Lore and story consistency check for the fleet database (GDD Edit 39 §6.6.1, decision 114).

Lore is tied to game state: what a car says must be true of the dummy's upgrades and damage
and of the vehicle's behaviour at that moment. This check enforces that statically.

  python3 content/db/check_lore.py [content/db/fleet.json] [prototypes/p3/sim.js]

Exit 1 on any error. Warnings and coverage are printed but do not fail.
"""
import json, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'content/db/fleet.json'
SIM = Path(sys.argv[2]) if len(sys.argv) > 2 else ROOT / 'prototypes/p3/sim.js'
d = json.loads(DB.read_text())
errors, warnings = [], []
err = errors.append
warn = warnings.append

MAX_CHARS = 48                      # three lines of the 6-px field face inside a bubble (ui.typeFieldLabel)
STYLES = {'speech', 'shout', 'mutter', 'thought'}
ENUMS = {
    'zone': {'front', 'frontDiagonal', 'side', 'rearDiagonal', 'rear'},
    'cause': {'body', 'cone', 'pass', 'car'}, 'man': {'brake', 'shift'},
    'at': {'body', 'cone'}, 'by': {'car', 'cone'}, 'how': {'reverse', 'replan'},
}
tiers = {t['tier']: t for t in d['tiers']}
classes = {c['class']: c for c in d['classes']}
models = {m['id']: m for m in d['models']}
nodes, parts, moods = set(d['nodes']), set(d['parts']), set(d['moods'])
canon = d['canon']

# ---------- roster
seen_tt, tags, sims, calls = set(), set(), set(), set()
for m in d['models']:
    if not re.fullmatch(r'[A-Z]{3}-0[1-4]-\d{3}', m['id']): err(f"model id {m['id']}: expected TYPE-TT-NNN")
    tt = m['id'][:6]
    if tt != m['typeTier']: err(f"{m['id']}: typeTier {m['typeTier']} does not match its id")
    if tt in seen_tt: err(f"{tt}: more than one model in the first version (GDD 12.1: one each)")
    seen_tt.add(tt)
    cls = classes.get(m['class'])
    if not cls or cls['code'] != tt[:3]: err(f"{m['id']}: class {m['class']} does not match code {tt[:3]}")
    if m['tier'] != tt[4:6]: err(f"{m['id']}: tier {m['tier']} does not match its id")
    if m['temperament'] != tiers[m['tier']]['temperament']: err(f"{m['id']}: temperament {m['temperament']} breaks tier {m['tier']} ({tiers[m['tier']]['temperament']})")
    if cls and m['tag'] != cls['tagLetter'] + m['tier']: err(f"{m['id']}: tag {m['tag']} should be {cls['tagLetter'] + m['tier']}")
    if m['tag'] in tags: err(f"tag {m['tag']} used twice")
    tags.add(m['tag'])
    if m['callsign'].lower() in calls: err(f"callsign {m['callsign']} used twice")
    calls.add(m['callsign'].lower())
    for s in m['simIds']:
        if s in sims: err(f"sim id {s} mapped twice")
        sims.add(s)
need = {c['code'] + '-' + t for c in d['classes'] for t in tiers}
if need - seen_tt: err('missing type-tiers: ' + ', '.join(sorted(need - seen_tt)))
if SIM.exists():
    sim_ids = set(re.findall(r"id: '([A-Z]+-\d\d)', cls:", SIM.read_text()))
    for s in sim_ids - sims: err(f"sim model {s} has no database entry")
    for s in sims - sim_ids: warn(f"database maps sim id {s}, which the sim does not run")

# ---------- text rules shared by names and barks
banned = [w.lower() for w in canon['banned']]
CITIES = ['Beijing', 'Shanghai', 'Guangzhou', 'Chongqing', 'Hong Kong', 'Chengdu', 'Wuhan', 'Hangzhou', 'Tokyo', 'London', 'New York']
def text_rules(where, text):
    low = text.lower()
    for w in banned:
        if re.search(r'\b' + re.escape(w) + r'\b', low): err(f"{where}: banned term '{w}' (canon.banned)")
    for c in CITIES:
        if c.lower() in low and c not in canon['cities']: err(f"{where}: names {c}; the setting is {canon['setting']}")
    if re.search(r'\bfarsight\b', text, re.I) and 'FARSIGHT' not in text: err(f"{where}: write FARSIGHT in capitals")
for m in d['models']:
    text_rules(m['id'], m['callsign'] + ' ' + m['line'] + ' ' + m['job'])

# ---------- barks
def implied(claim, b):
    """True if the bark's event and conditions guarantee the claim."""
    w, ev = b['when'], b['event']
    def eq(k, v):
        x = w.get(k)
        return x == v or (isinstance(x, list) and set(x) <= ({v} | ({'frontDiagonal'} if v == 'front' else {'rearDiagonal'} if v == 'rear' else set())))
    kind, _, rest = claim.partition(':')
    if claim == 'bait': return w.get('bait') is True
    if claim == 'stopped': return w.get('stopped') is True
    if claim == 'spent': return ev == 'touch-spent'
    if claim == 'learned': return ev == 'learned'
    if claim.startswith('seniority>='): return (w.get('seniority') or {}).get('min', -1) >= int(claim[11:])
    if claim == 'seniority==0': return (w.get('seniority') or {}).get('max', 9) <= 0
    if claim.startswith('wear>='): return (w.get('wear') or {}).get('min', -1) >= float(claim[6:])
    if kind == 'zone': return eq('zone', rest)
    if kind == 'class': return w.get('class') == rest or (w.get('model') in models and models[w['model']]['class'] == rest)
    if kind == 'model': return w.get('model') == rest
    if kind == 'node': return (ev == 'upgrade-seen' and w.get('node') == rest) or w.get('owns') == rest
    if kind == 'part':
        p = rest.split(':')[0]
        return (ev == 'part-seen' and w.get('part') == p) or w.get('broken') == p
    if kind in ('cause', 'man', 'at', 'by', 'how', 'mood'): return w.get(kind) == rest
    err(f"{b['id']}: unknown claim '{claim}'")
    return False

# words that assert a fact about the dummy or the car, and the claim each one needs
MENTIONS = [
    (r'\bhips\b', 'node:hips'), (r'\bspine\b', 'node:spine'), (r'\blooked one way\b', 'node:neck'), (r'\bjump', 'node:jump'),
    (r'\bthrow\b', 'node:throw'), (r'\bcarrying\b', 'node:carry'), (r'\bholding on\b', 'node:holdOn'), (r'\bbattery\b', 'node:bigBattery'),
    (r'\bremembers\b', 'node:memory'), (r'\bhas ears\b', 'node:ears'), (r'\bnot sliding\b', 'node:grip'), (r'\bwind-up\b', 'node:springStart'),
    (r'\blooking at all of us\b', 'node:widerView'), (r'recharges when', 'node:kineticCharge'), (r'recharges faster', 'node:fastCharge'),
    (r'\bsenior\b', 'seniority>=3'), (r'\btrained\b', 'seniority>=1'), (r'\bfirst week\b', 'seniority==0'),
    (r'\bstationary\b|\bhad stopped\b', 'stopped'), (r'\bretrained\b|\bremember you\b|\bnot falling for that again\b|\blesson logged\b', 'learned'),
    (r'\bleft arm\b', 'part:armL'), (r'\bright arm\b', 'part:armR'), (r'\bleft leg\b', 'part:legL'), (r'\bright leg\b', 'part:legR'),
    (r'\blegs have gone\b', 'part:legs'), (r'\bhead is\b', 'part:head'), (r'\btorso\b', 'part:torso'),
    (r'\bparcel\b', 'class:van'), (r'\bpassengers\b', 'class:bus'), (r'\bofficer\b', 'class:police'),
    (r'\bfrom behind\b|\bmy boot\b', 'zone:rear'), (r'\bgrille\b|\bbumper\b', 'zone:front'), (r'\bdoor panel\b|\bside panel\b|\bmy side\b', 'zone:side'),
]
for m in d['models']:  # a callsign or job detail in a line pins it to that model
    MENTIONS.append((r'\b' + re.escape(m['callsign'].lower()) + r'\b', 'model:' + m['id']))
MENTIONS.append((r'\broute 44\b', 'model:VAN-02-001'))

ids = set()
for b in d['barks']:
    bid, ev, w, text = b['id'], b['event'], b['when'], b['text']
    if bid in ids: err(f"{bid}: duplicate id")
    ids.add(bid)
    if ev not in d['events']: err(f"{bid}: unknown event {ev}"); continue
    allowed = set(d['events'][ev]) | set(d['context'])
    for k, v in w.items():
        if k not in allowed: err(f"{bid}: '{k}' is not a field of {ev} or the shared context")
        vals = v if isinstance(v, list) else [v]
        if k in ENUMS and any(x not in ENUMS[k] for x in vals): err(f"{bid}: {k}={v} not in {sorted(ENUMS[k])}")
        if k == 'tier' and v not in tiers: err(f"{bid}: tier {v}")
        if k == 'class' and v not in classes: err(f"{bid}: class {v}")
        if k == 'model' and v not in models: err(f"{bid}: model {v}")
        if k in ('node', 'owns') and v not in nodes: err(f"{bid}: node {v} is not one of the 15 (V29 D3.2)")
        if k == 'part' and v not in parts: err(f"{bid}: part {v}")
        if k == 'broken' and v not in parts | {'legs', 'arms'}: err(f"{bid}: broken {v}")
        if k == 'mood' and v not in moods: err(f"{bid}: mood {v}")
        if k == 'seniority' and not (0 <= v.get('min', 0) <= v.get('max', 3) <= 3): err(f"{bid}: seniority {v}")
    if b['style'] not in STYLES: err(f"{bid}: style {b['style']}")
    if ev == 'writeoff' and b['priority'] != 3: err(f"{bid}: write-off lines take priority 3 (6.6)")
    if len(text) > MAX_CHARS: err(f"{bid}: {len(text)} chars > {MAX_CHARS}: {text}")
    if not text.rstrip().endswith(('.', '!', '?')): err(f"{bid}: end with . ! or ?")
    for ph in re.findall(r'\{(\w+)\}', text):
        if ph not in d['events'][ev]: err(f"{bid}: placeholder {{{ph}}} is not a field of {ev}")
    text_rules(bid, text)
    if 'tier' in w and 'model' in w and models[w['model']]['tier'] != w['tier']: err(f"{bid}: tier and model disagree")
    for c in b['claims']:
        if not implied(c, b): err(f"{bid}: claims '{c}' but its conditions do not guarantee it — \"{text}\"")
    low = text.lower()
    for rx, need_claim in MENTIONS:
        if re.search(rx, low):
            ok = any(c == need_claim or c.startswith(need_claim + ':') or (need_claim == 'seniority>=1' and c.startswith('seniority>=')) for c in b['claims'])
            if not ok: err(f"{bid}: text asserts '{need_claim}' without that claim — \"{text}\"")

# ---------- coverage
def has(ev, **cond):
    return [b for b in d['barks'] if b['event'] == ev and all(b['when'].get(k) == v for k, v in cond.items())]
for ev in d['events']:
    if not [b for b in d['barks'] if b['event'] == ev and not b['when']]:
        (err if ev in ('impact', 'writeoff', 'miss', 'near-miss') else warn)(f"{ev}: no neutral fallback line (6.6: event-correct fallback)")
for t in tiers:
    for ev in ('impact', 'writeoff', 'near-miss', 'miss'):
        if not has(ev, tier=t): err(f"tier {t} ({tiers[t]['temperament']}) has no {ev} line")
for n in nodes:
    if not has('upgrade-seen', node=n): err(f"node {n} has no upgrade-seen line")
for p in parts:
    if not has('part-seen', part=p): err(f"part {p} has no part-seen line")
by_class = {c: sum(1 for b in d['barks'] if b['when'].get('class') == c or models.get(b['when'].get('model'), {}).get('class') == c) for c in classes}

print(f"fleet.json · {len(d['models'])} models · {len(d['barks'])} barks · {len(d['events'])} events")
print('class-specific lines: ' + ', '.join(f"{c} {n}" for c, n in by_class.items()))
for w_ in warnings: print('WARN  ' + w_)
for e in errors: print('ERROR ' + e)
print(f"{len(errors)} errors, {len(warnings)} warnings")
sys.exit(1 if errors else 0)
