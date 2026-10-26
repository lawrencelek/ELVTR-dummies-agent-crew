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
# Edit 55 (example only): a 45° crossroads and four engineered options, one screen each, live traffic and the lab's numbers
xs = (here / 'crossing_shell.html').read_text(encoding='utf-8')
rep = here / 'docs' / 'crossing_report.json'
xs_scripts = '<script>window.CROSSINGS = true;' + (f'\nwindow.CROSS_REPORT = {rep.read_text(encoding="utf-8")};' if rep.exists() else '') + '</script>\n'
xs_scripts += ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'cityscape_view.js'))
out4 = here / 'crossing_options.html'
out4.write_text(xs.replace('<!--SCRIPTS-->', xs_scripts), encoding='utf-8')
print(out4.name, out4.stat().st_size, 'bytes')
# Edit 57 (options only): three Circus layouts as plans, the level rules checked live
cp = (here / 'circus_shell.html').read_text(encoding='utf-8')
cp_scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'circus_plans.js'))
out5 = here / 'circus_options.html'
out5.write_text(cp.replace('<!--SCRIPTS-->', cp_scripts), encoding='utf-8')
print(out5.name, out5.stat().st_size, 'bytes')
# Edit 58 (concept, plans only): Circus as a valley city: hills at Z1, the valley at Z0, roads that keep their level
vs = (here / 'circus_valley_shell.html').read_text(encoding='utf-8')
vs_scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'circus_valley.js', 'circus_valley_view.js'))
out6 = here / 'circus_valley.html'
out6.write_text(vs.replace('<!--SCRIPTS-->', vs_scripts), encoding='utf-8')
print(out6.name, out6.stat().st_size, 'bytes')
