#!/usr/bin/env python3
"""Bundle shell.html + sim.js + content.js (generated, optional) + game.js into one self-contained dummies_p1.html."""
import pathlib

here = pathlib.Path(__file__).resolve().parent
shell = (here / 'shell.html').read_text(encoding='utf-8')
scripts = ''.join(f'<script>\n{(here / f).read_text(encoding="utf-8")}\n</script>\n' for f in ('sim.js', 'content.js', 'game.js') if (here / f).exists())
out = here / 'dummies_p1.html'
out.write_text(shell.replace('<!--SCRIPTS-->', scripts), encoding='utf-8')
print(out.name, out.stat().st_size, 'bytes')
