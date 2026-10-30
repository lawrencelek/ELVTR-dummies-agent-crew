#!/usr/bin/env python3
"""P6 (Edit 62): turn tools/p6_shots.js output into docs/p62_<district>_3x3.png (×2, screen names, seams)."""
import sys, pathlib
from PIL import Image, ImageDraw
d = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else 'docs')
AW, AH = 400, 320
for id in ('parkland', 'waterfront', 'monument'):
    raw = (d / f'{id}.rgba').read_bytes()
    im = Image.frombytes('RGBA', (3 * AW, 3 * AH), raw).resize((6 * AW, 6 * AH), Image.NEAREST)
    dr = ImageDraw.Draw(im)
    for i in range(1, 3):
        dr.line([(i * 2 * AW, 0), (i * 2 * AW, 6 * AH)], fill=(255, 255, 255, 140), width=2)
        dr.line([(0, i * 2 * AH), (6 * AW, i * 2 * AH)], fill=(255, 255, 255, 140), width=2)
    for r in range(3):
        for c in range(3):
            x, y = c * 2 * AW + 10, r * 2 * AH + 8
            dr.rectangle([x - 4, y - 2, x + 34, y + 20], fill=(10, 14, 22, 220))
            dr.text((x, y), 'ABC'[c] + str(r + 1), fill=(255, 255, 255, 255))
    im.convert('RGB').save(d / f'p62_{id}_3x3.png', optimize=True)
    (d / f'{id}.rgba').unlink()
    print(f'p62_{id}_3x3.png')
