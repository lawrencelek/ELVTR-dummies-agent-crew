#!/usr/bin/env python3
"""Prototype 6.4 (GDD Edit 72; 6.3 was Edit 71, 6.2 Edit 70, 6.1 Edit 69, P6 Edit 62): bundle shell.html + sim.js + pixel.js + lab.js + circus_valley.js + world6.js + content.js
+ content/db/fleet.json + game.js into one self-contained dummies_p6_4.html.
P6 (Edit 62), Prototype 6.1 (Edit 69), 6.2 (Edit 70) and 6.3 (Edit 71) stay frozen as dummies_p6.html, dummies_p6_1.html, dummies_p6_2.html and dummies_p6_3.html. Three districts: Parkland, Waterfront, Monument."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = here.parents[1] / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js', 'world6.js', 'content.js'))
scripts += db + f'<script>\n{(here / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p6_4.html'
out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
