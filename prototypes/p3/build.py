#!/usr/bin/env python3
"""Bundle shell.html + sim.js + pixel.js + content.js + content/db/fleet.json + game.js into one self-contained dummies_p3.html."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = here.parents[1] / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'content.js') if (here / f).exists())
scripts += db + f'<script>\n{(here / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p3.html'
out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
