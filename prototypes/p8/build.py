#!/usr/bin/env python3
"""Prototype 8.1 (GDD Edit 96): Prototype 8 with tales of up to 35 words and the CBD and Campus districts in the lore. Prototype 8 (dummies_p8.html)
stays frozen. Prototype 8 (GDD Edit 95): Prototype 7.13 under the lore refinement. Dummy Corporation narrates; Farsight, the publisher, is named
only on the Credits card. Gameplay is 7.13's. Bundles p8/shell.html + ../jump/jump.js + ../p6/sim.js, pixel.js, lab.js, circus_valley.js,
world6.js, content.js + content/db/fleet.json + content/story/story_v2.json + p8/lore.js + ../p7/story.js + ../controls/pads.js
+ ../p6/game.js into one self-contained dummies_p8_1.html, and p8_1_page.html for a host. Prototypes 7 to 7.13 stay frozen.
The shared code reads the lore layer only when it is bundled (window.DUMMIES_LORE, window.DUMMIES_CREDITS)."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
p6, p7, root = here.parent / 'p6', here.parent / 'p7', here.parents[1]
shell = (here / 'shell.html').read_text(encoding='utf-8')
fleet = root / 'content' / 'db' / 'fleet.json'           # the fleet database (decision 117); lore.js patches its text in the page
story = root / 'content' / 'story' / 'story_v2.json'     # Edit 95: the story's text in Dummy Corporation's voice; gameplay as story.json
db = f'<script>\nwindow.FLEET_DB = {fleet.read_text(encoding="utf-8")};\n</script>\n'
db += f'<script>\nwindow.DUMMIES_STORY = {story.read_text(encoding="utf-8")};\n</script>\n'
scripts = f'<script>\n{(here.parent / "jump" / "jump.js").read_text(encoding="utf-8")}\n</script>\n'
scripts += ''.join(f'<script>\n{(p6 / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'pixel.js', 'lab.js', 'circus_valley.js', 'world6.js', 'content.js'))
scripts += db + f'<script>\n{(here / "lore.js").read_text(encoding="utf-8")}\n</script>\n'   # Edit 95: after the content and the fleet, before the game
scripts += f'<script>\n{(p7 / "story.js").read_text(encoding="utf-8")}\n</script>\n'
scripts += f'<script>\n{(here.parent / "controls" / "pads.js").read_text(encoding="utf-8")}\n</script>\n' + f'<script>\n{(p6 / "game.js").read_text(encoding="utf-8")}\n</script>\n'
out = here / 'dummies_p8_1.html'   # Edit 96: Prototype 8 (dummies_p8.html, p8_page.html) is frozen
full = shell.replace('<!--SCRIPTS-->', scripts)
out.write_text(full, encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
head = full.split('<head>', 1)[1].split('</head>', 1)[0]
head = '\n'.join(l for l in head.splitlines() if not l.startswith('<meta charset') and not l.startswith('<meta name="viewport"'))
body = full.split('<body>', 1)[1].rsplit('</body>', 1)[0]
page = here / 'p8_1_page.html'
page.write_text(head.strip() + '\n' + body.strip() + '\n', encoding='utf-8')
print(page.name, page.stat().st_size, 'bytes')
