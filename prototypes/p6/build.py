#!/usr/bin/env python3
"""Prototype 6.7 (GDD Edit 77; 6.6 was Edit 76, 6.5 Edit 75, 6.4 Edit 72, 6.3 Edit 71, 6.2 Edit 70, 6.1 Edit 69, P6 Edit 62): bundle shell.html + ../jump/jump.js + sim.js + pixel.js + lab.js
+ circus_valley.js + world6.js + content.js + content/db/fleet.json + ../controls/pads.js + game.js into one self-contained dummies_p6_7.html.
P6 (Edit 62) and Prototypes 6.1–6.6 (Edits 69–76) stay frozen as dummies_p6.html and dummies_p6_1.html … dummies_p6_6.html. Three districts: Parkland, Waterfront, Monument."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = here.parents[1] / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
scripts = f'<script>\n{(here.parent / "jump" / "jump.js").read_text(encoding="utf-8")}\n</script>\n'  # Edit 76: the jump's rules, shared with the jump test
scripts += ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js', 'world6.js', 'content.js'))
pads = (here.parent / 'controls' / 'pads.js').read_text(encoding='utf-8')  # Edit 75: gamepads of any kind, shared with the controls prototype
scripts += db + f'<script>\n{pads}\n</script>\n' + f'<script>\n{(here / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p6_7.html'
assert out.name not in ('dummies_p6_4.html', 'dummies_p6_5.html', 'dummies_p6_6.html')  # 6.4, 6.5 and 6.6 stay frozen
full = shell.replace('<!--SCRIPTS-->', scripts)
out.write_text(full, encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
# Edit 75: the same page as a fragment for hosting (no doctype, html, head or body: the host adds its own)
head = full.split('<head>', 1)[1].split('</head>', 1)[0]
head = '\n'.join(l for l in head.splitlines() if not l.startswith('<meta charset') and not l.startswith('<meta name="viewport"'))
body = full.split('<body>', 1)[1].rsplit('</body>', 1)[0]
page = here / 'p6_7_page.html'
page.write_text(head.strip() + '\n' + body.strip() + '\n', encoding='utf-8')
print(page.name, page.stat().st_size, 'bytes')
