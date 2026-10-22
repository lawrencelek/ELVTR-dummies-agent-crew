#!/usr/bin/env python3
"""Bundle shell.html + content/districts/districts_p5.json + sim.js + pixel.js + content.js + content/db/fleet.json + game.js into one self-contained dummies_p5.html."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = here.parents[1] / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
districts = here.parents[1] / 'content' / 'districts' / 'districts_p5.json'  # baked city layouts, three per district (Edit 41; P5, Edit 50)
scripts = (f'<script>\nwindow.DISTRICT_DB = {districts.read_text(encoding="utf-8")};\n</script>\n' if districts.exists() else '')
scripts += ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'content.js') if (here / f).exists())
scripts += db + f'<script>\n{(here / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p5.html'
out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
# P5.2 mock-up (Edit 50.2): highway width, lamps and columns, in game art with live traffic (P5.1's diagonal mock-up is retired)
hw = (here / 'highway_shell.html').read_text(encoding='utf-8')
hw_scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'highway_view.js'))
out2 = here / 'highway_mockup.html'
out2.write_text(hw.replace('<!--SCRIPTS-->', hw_scripts), encoding='utf-8')
print(out2.name, out2.stat().st_size, 'bytes')
# P5.2 mock-up (Edit 50.2): three cityscapes, their centrepieces in game art with live traffic
cs = (here / 'cityscape_shell.html').read_text(encoding='utf-8')
cs_scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'cityscape_view.js'))
out3 = here / 'cityscape_mockup.html'
out3.write_text(cs.replace('<!--SCRIPTS-->', cs_scripts), encoding='utf-8')
print(out3.name, out3.stat().st_size, 'bytes')
