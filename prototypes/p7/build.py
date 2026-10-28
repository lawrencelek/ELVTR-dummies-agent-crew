#!/usr/bin/env python3
"""Prototype 7.7 (GDD Edit 88; 7.6 was Edit 87, 7.5 Edit 86, 7.4 Edit 85, 7.3 Edit 84, 7.2 Edit 83, 7.1 Edit 82, 7 Edit 81): ARCADE and STORY. Bundles p7/shell.html + ../jump/jump.js + ../p6/sim.js, pixel.js, lab.js,
circus_valley.js, world6.js, content.js + content/db/fleet.json + content/story/story.json + p7/story.js + ../controls/pads.js
+ ../p6/game.js into one self-contained dummies_p7_7.html, and p7_7_page.html for a host. Prototypes 7 to 7.6 stay frozen.
The game's code stays in ../p6 (shared); Prototypes 6.4–6.10 stay frozen there as built files."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
p6, root = here.parent / 'p6', here.parents[1]
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = root / 'content' / 'db' / 'fleet.json'  # the fleet database, separate from the other text (decision 117)
story = root / 'content' / 'story' / 'story.json'  # Edit 81: the story's tiles, tales and briefs
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n' if fleet.exists() else ''
db += f'<script>\nwindow.DUMMIES_STORY = {story.read_text(encoding="utf-8")};\n</script>\n'
scripts = f'<script>\n{(here.parent / "jump" / "jump.js").read_text(encoding="utf-8")}\n</script>\n'  # Edit 76: the jump's rules
scripts += ''.join(f'<script>\n{(p6 / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js', 'world6.js', 'content.js'))
pads = (here.parent / 'controls' / 'pads.js').read_text(encoding='utf-8')  # Edit 75: gamepads of any kind
scripts += db + f'<script>\n{(here / "story.js").read_text(encoding="utf-8")}\n</script>\n'
scripts += f'<script>\n{pads}\n</script>\n' + f'<script>\n{(p6 / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p7_7.html'
assert out.name not in ('dummies_p7.html', 'dummies_p7_1.html', 'dummies_p7_2.html', 'dummies_p7_3.html', 'dummies_p7_4.html', 'dummies_p7_5.html', 'dummies_p7_6.html')  # Prototypes 7 to 7.6 stay frozen
full = shell.replace('<!--SCRIPTS-->', scripts)
out.write_text(full, encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
head = full.split('<head>', 1)[1].split('</head>', 1)[0]
head = '\n'.join(l for l in head.splitlines() if not l.startswith('<meta charset') and not l.startswith('<meta name="viewport"'))
body = full.split('<body>', 1)[1].rsplit('</body>', 1)[0]
page = here / 'p7_7_page.html'
page.write_text(head.strip() + '\n' + body.strip() + '\n', encoding='utf-8')
print(page.name, page.stat().st_size, 'bytes')
