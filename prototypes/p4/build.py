#!/usr/bin/env python3
"""Bundle shell.html + content/districts/districts_p4.json + sim.js + pixel.js + content.js + content/db/fleet.json + game.js into one self-contained dummies_p4.html."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = here.parents[1] / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
districts = here.parents[1] / 'content' / 'districts' / 'districts_p4.json'  # baked city layouts, three per district (Edit 41)
scripts = (f'<script>\nwindow.DISTRICT_DB = {districts.read_text(encoding="utf-8")};\n</script>\n' if districts.exists() else '')
scripts += ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'content.js') if (here / f).exists())
scripts += db + f'<script>\n{(here / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p4.html'
out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
# P4 Turn Lab (Edit 49): road pieces at chosen radii on the game's driver
lab = (here / 'lab_shell.html').read_text(encoding='utf-8')
lab_scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'lab.js', 'lab_view.js'))
out2 = here / 'turn_lab.html'
out2.write_text(lab.replace('<!--SCRIPTS-->', lab_scripts), encoding='utf-8')
print(out2.name, out2.stat().st_size, 'bytes')
# P4 fleet mock-up (Edit 49.2): canon classes and bus lengths, sprites and swept paths
fl = (here / 'fleet_shell.html').read_text(encoding='utf-8')
fleet_classes = __import__('json').loads(fleet.read_text(encoding='utf-8'))['classes'] if fleet.exists() else []
res = here / 'docs' / 'fleet_results.json'
fl_scripts = f'<script>\nwindow.FLEET_DB = {{"classes": {__import__("json").dumps(fleet_classes)}}};\nwindow.FLEET_RESULTS = {res.read_text(encoding="utf-8") if res.exists() else "{}"};\n</script>\n'
fl_scripts += ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'fleet_view.js'))
out3 = here / 'fleet_mockup.html'
out3.write_text(fl.replace('<!--SCRIPTS-->', fl_scripts), encoding='utf-8')
print(out3.name, out3.stat().st_size, 'bytes')
