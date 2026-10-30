# Five shadow treatments of one test scene (art px; 1 px of height lifts 1 px and casts 1 px of shadow, as the game's
# extrusion and shadowScale do today: both 0.3 world/px ÷ U). Oblique view: a point (x, y, z) draws at (x, y - z); the
# visible point on a screen pixel is the one furthest south. Scene: a hill (Z1 = 18) with a cove ramp, the valley floor,
# a Z1 bridge running north–south (a street on the hill, a slab on columns over the valley), a tower, a hill building, cars.
import math, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
W, H, Z1 = 300, 210, 18
D = 0.7071
# ---------- terrain
def g(x, y):
    if 12 <= x < 62 and 30 <= y < 112: return Z1 * min(1, max(0, (112 - y) / 82))  # the cove ramp
    return Z1 if y < 72 else 0
G = np.array([[g(x, y) for x in range(W)] for y in range(H)], dtype=float)
# ---------- casters: (name, x0, y0, x1, y1, z0, z1)  footprint in plan, solid between z0 and z1
deck = ('deck', 150, -40, 184, H + 40, Z1 - 3, Z1)
boxes = [deck,
  ('col', 151, 100, 155, 104, 0, Z1 - 3), ('col', 179, 100, 183, 104, 0, Z1 - 3), ('col', 151, 178, 155, 182, 0, Z1 - 3), ('col', 179, 178, 183, 182, 0, Z1 - 3),
  ('tower', 212, 98, 252, 132, 0, 48), ('hillbldg', 84, 40, 128, 64, Z1, Z1 + 24),
  ('car', 160, 118, 168, 132, Z1, Z1 + 6), ('car', 96, 146, 110, 154, 0, 6), ('car', 30, 120, 38, 134, 0, 6)]
road_v = (138, 160)   # valley road band (y), Z0
road_h = (16, 32)     # hill road band (y), Z1
def solid(x, y, z):
    xi, yi = int(math.floor(x)), int(math.floor(y))
    if 0 <= xi < W and 0 <= yi < H and z <= G[yi, xi] + 1e-6: return True
    for (_, x0, y0, x1, y1, z0, z1) in boxes:
        if x0 <= x < x1 and y0 <= y < y1 and z0 - 1e-6 <= z <= z1 + 1e-6: return True
    return False
# ---------- surfaces: every visible point (x, y, z, colour, kind)
C = {'floor': (43, 49, 64), 'hill': (58, 67, 86), 'face': (89, 98, 111), 'faceD': (62, 70, 82), 'road': (34, 38, 46), 'dash': (207, 230, 245),
     'deck': (184, 196, 203), 'led': (73, 211, 255), 'col': (138, 150, 160), 'bTop': (154, 164, 173), 'bFace': (93, 102, 112), 'bWin': (73, 211, 255),
     'car': (232, 238, 242), 'carF': (150, 160, 170), 'ramp': (50, 58, 75)}
def surfaces():
    pts = []
    for y in range(H):
        for x in range(W):
            z = G[y, x]; ramp = 12 <= x < 62 and 30 <= y < 112
            c = C['hill'] if z >= Z1 else (C['ramp'] if ramp else C['floor'])
            if road_v[0] <= y < road_v[1] and z == 0: c = C['road'] if not (y == (road_v[0] + road_v[1]) // 2 and x % 12 < 6) else C['dash']
            if road_h[0] <= y < road_h[1] and z >= Z1: c = C['road'] if not (y == (road_h[0] + road_h[1]) // 2 and x % 12 < 6) else C['dash']
            if ramp and 28 <= x < 46: c = C['road'] if not (x == 37 and y % 12 < 6) else C['dash']
            pts.append((x, y, z, c, 'top'))
            if y + 1 < H and G[y + 1, x] < z - 0.5:  # a south-facing drop: the cliff face
                for zz in range(int(G[y + 1, x]), int(z)): pts.append((x, y + 0.99, zz + 0.5, C['face'] if (x % 6) else C['faceD'], 'face'))
    for (n, x0, y0, x1, y1, z0, z1) in boxes:
        for y in range(max(0, y0), min(H, y1)):
            for x in range(max(0, x0), min(W, x1)):
                if n == 'deck':
                    c = C['led'] if x in (x0, x1 - 1) else C['deck']
                    if x == (x0 + x1) // 2 and y % 14 < 7: c = C['dash']
                    pts.append((x, y, z1, c, 'top'))
                elif n != 'col': pts.append((x, y, z1, C['bTop'] if n != 'car' else C['car'], 'top'))
        if y1 <= H and n != 'deck':
            for x in range(x0, x1):
                for zz in range(int(z0), int(z1)):
                    c = C['bFace'] if n != 'car' else C['carF']
                    if n in ('tower', 'hillbldg') and (zz - z0) % 6 in (2, 3) and (x - x0) % 5 in (1, 2): c = C['bWin']
                    if n == 'col': c = C['col']
                    pts.append((x, y1 - 0.01, zz + 0.5, c, 'face'))
    return pts
PTS = surfaces()
# ---------- the five treatments: each returns a shade factor per point (1 lit, < 1 in shadow)
SUN = (D, -D)  # toward the sun, in plan (it shines from 1:30); the ray rises 1 px per px, as shadows run 1 px per px today
def covered_above(x, y, z):
    return any(x0 <= x < x1 and y0 <= y < y1 and zz0 > z + 0.5 for (_, x0, y0, x1, y1, zz0, zz1) in boxes)
def m_today(p):  # the shipped behaviour: every shadow is stamped on the one ground buffer, at the caster's full height
    x, y, z, c, kind = p
    if kind != 'top' or not (z == G[min(H - 1, int(y)), min(W - 1, int(x))]): return 1.0  # decks, roofs and cars never receive
    for (n, x0, y0, x1, y1, z0, z1) in boxes:
        L = z1 if n == 'deck' else (z1 - z0) * 0.55 if n != 'col' else 0
        if n == 'deck':
            sx, sy = x + D * L, y - D * L
            if x0 <= sx < x1 and y0 <= sy < y1: return 0.62
        else:
            for t in range(0, int(L) + 1):
                sx, sy = x + D * t, y - D * t
                if x0 <= sx < x1 and y0 <= sy < y1: return 0.62
    return 1.0
def m_noon(p):  # 1. noon sun: the shadow is the footprint, on whatever lies directly below; a 1 px contact edge round solids
    x, y, z, c, kind = p
    if kind != 'top': return 1.0
    if covered_above(x, y, z): return 0.62
    for (n, x0, y0, x1, y1, z0, z1) in boxes:
        if n in ('tower', 'hillbldg', 'car') and abs(z - z0) < 0.5 and x0 - 1 <= x < x1 + 1 and y0 - 1 <= y < y1 + 1: return 0.8
    return 1.0
LEVELS = [0, Z1]
def lvl(z): return min(LEVELS, key=lambda L: abs(L - z))
def m_layers(p):  # 2. oblique sun, one shadow mask per level: casters stamp their footprint offset by the height difference
    x, y, z, c, kind = p
    if kind != 'top': return 1.0
    hr = lvl(z)
    for (n, x0, y0, x1, y1, z0, z1) in boxes + [('hill', -999, -999, 999, 72, 0, Z1)]:
        if z1 <= hr + 0.5: continue
        lo, hi = max(z0, hr) - hr, z1 - hr
        t = lo
        while t <= hi:
            sx, sy = x + D * t, y - D * t
            inside = x0 <= sx < x1 and y0 <= sy < y1
            if n == 'hill': inside = sy < 72 and not (12 <= sx < 62 and 30 <= sy < 112)
            if inside: return 0.62
            t += 1
    return 1.0
def m_sweep(p):  # 3. height-field sweep: a ray toward the sun through every solid (ground, ramps, slabs, columns)
    x, y, z, c, kind = p
    t = 1.0
    while t < 64:
        if solid(x + D * t, y - D * t, z + t + 0.25): return 0.62
        t += 1.0
    return 1.0
def m_ao(p):  # 4. no sun: ambient occlusion from taller neighbours and from anything overhead; each level tinted by height
    x, y, z, c, kind = p
    tint = 1.0 + 0.10 * (z / Z1 - 0.5)
    if kind != 'top': return tint * 0.9
    k = 1.0
    if covered_above(x, y, z): k *= 0.7
    worst = 0
    for dx, dy in ((-3, 0), (3, 0), (0, -3), (0, 3), (-6, 0), (6, 0), (0, -6), (0, 6)):
        xi, yi = int(x + dx), int(y + dy)
        hh = G[yi, xi] if 0 <= xi < W and 0 <= yi < H else z
        for (n, x0, y0, x1, y1, z0, z1) in boxes:
            if n != 'deck' and x0 <= xi < x1 and y0 <= yi < y1 and z0 <= z + 0.5: hh = max(hh, z1)
        worst = max(worst, (hh - z) / (abs(dx) + abs(dy)))
    k *= 1 - min(0.3, 0.12 * worst)
    return k * tint
def render(method):
    img = np.zeros((H + 60, W, 3), dtype=float); img[:] = (16, 20, 28); depth = np.full((H + 60, W), -1e9)
    for p in PTS:
        x, y, z, c, kind = p
        sx, sy = int(round(x)), int(math.floor(y - z)) + 50
        if not (0 <= sx < W and 0 <= sy < H + 60): continue
        key = y + z * 1e-3
        if key >= depth[sy, sx]:
            depth[sy, sx] = key; img[sy, sx] = np.array(c, dtype=float) * method(p)
    return Image.fromarray(np.clip(img[50:50 + H], 0, 255).astype(np.uint8))
methods = [('Today (shipped): one ground buffer', m_today), ('1 · Noon sun (Link\'s Awakening)', m_noon), ('2 · Oblique sun, a mask per level', m_layers),
           ('3 · Oblique sun, height-field sweep', m_sweep), ('4 · No sun: occlusion and height tint', m_ao)]
out = sys.argv[1]
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 15)
S = 2
panels = []
for name, m in methods:
    im = render(m).resize((W * S, H * S), Image.NEAREST)
    canvas = Image.new('RGB', (W * S, H * S + 30), (12, 16, 24)); canvas.paste(im, (0, 30)); ImageDraw.Draw(canvas).text((6, 6), name, font=f, fill=(230, 244, 255)); panels.append(canvas)
    print('rendered', name, flush=True)
cols = 2; rows = (len(panels) + 1) // 2
sheet = Image.new('RGB', (cols * (W * S + 10), rows * (H * S + 40)), (12, 16, 24))
for i, pnl in enumerate(panels): sheet.paste(pnl, ((i % cols) * (W * S + 10), (i // cols) * (H * S + 40)))
sheet.save(out); print(sheet.size)
