/* DUMMIES P3 — pixel art layer.
   The field is a 400 × 300 art grid: ui.playWidth ÷ ui.artScale by ui.playHeight ÷ ui.artScale.
   Rules (GDD Edit 37 §4.1.3): whole art pixels only, no anti-aliasing, 1-px outlines, ramps of three tones,
   hard shadows down-left. Translucency is SNES-style colour math on whole pixels. Exposes window.PIX. */
(function (root) {
  'use strict';
  const AW = 400, AH = 300, U = 2, TAU = Math.PI * 2;
  const SUN = { x: -Math.SQRT1_2, y: Math.SQRT1_2 }; // light from 1:30, shadows fall to 7:30

  // ---------- palette (Edit 37 §4.1.4 roles; placeholders registered as data)
  const PAL = {
    grass: '#8ED45A', grass2: '#6DBE48', grass3: '#B6E87E', road: '#B9C6CF', road2: '#A9B7C1',
    pave: '#F2EEE2', pave2: '#DCD5C2', kerb: '#FFFFFF', kerb2: '#9AA8B1',
    water: '#4FC3E8', water2: '#8FE0F5', water3: '#2A9CC8', flower: '#FFFFFF', flower2: '#F7A8C8',
    foliage: '#5DBB46', foliageL: '#A6E06A', foliageD: '#3E9A3A', foliageO: '#1F5A2E', trunk: '#8A6A44', trunkD: '#5E4630',
    fleetTop: '#F4F8FA', fleetRoof: '#FFFFFF', fleetSide: '#C3D0D8', fleetSide2: '#A9B7C1', fleetLine: '#9AA8B1', fleetO: '#2E3A43',
    glass: '#1A7FA7', glint: '#8FE0F5', head: '#FFF1C9', tail: '#8A3A30', amber: '#F2A33A',
    podO: '#4A6F86', pod2: '#DCE8EE', pod3: '#B9CCD6', podCrown: '#4FC3E8', podHi: '#BDEBFA',
    rail: '#E2E8EC', railSide: '#B8C4CB', railO: '#5E6F7B',
    dummy: '#F5C542', dummyD: '#C9961C', dummyL: '#FFE9A0', joint: '#1A1D1F', worn: '#9C9070',
    cone: '#F28C28', coneO: '#7A3B12', coneW: '#FFFFFF',
    ink: '#101417', label: '#4A5A66', warn: '#E4442E', white: '#FFFFFF', fleet: '#7E8C96', structure: '#B8C4CB',
    dark: '#1A3A20',
  };
  function rgb(hex) { const n = parseInt(hex.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
  function c32(hex) { const [r, g, b] = rgb(hex); return (0xFF000000 | (b << 16) | (g << 8) | r) >>> 0; }
  function mixHex(a, b, k) { const p = rgb(a), q = rgb(b); return '#' + p.map((v, i) => Math.round(v + (q[i] - v) * k).toString(16).padStart(2, '0')).join(''); }
  const K = {}; for (const k in PAL) K[k] = c32(PAL[k]);

  // ---------- buffer
  class Buf {
    constructor(w, h) { this.w = w; this.h = h; this.d = new Uint32Array(w * h); }
    put(x, y, c) { x = Math.floor(x); y = Math.floor(y); if (x < 0 || y < 0 || x >= this.w || y >= this.h) return; this.d[y * this.w + x] = c; }
    get(x, y) { x = Math.floor(x); y = Math.floor(y); return x < 0 || y < 0 || x >= this.w || y >= this.h ? 0 : this.d[y * this.w + x]; }
    mix(x, y, c, a) { // colour math: blend c over the pixel by a (0..1)
      x = Math.floor(x); y = Math.floor(y);
      if (a <= 0 || x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x;
      if (a >= 1) { this.d[i] = c; return; }
      const s = this.d[i], r = s & 255, g = (s >>> 8) & 255, b = (s >>> 16) & 255;
      this.d[i] = (0xFF000000 | (Math.round(b + (((c >>> 16) & 255) - b) * a) << 16) | (Math.round(g + (((c >>> 8) & 255) - g) * a) << 8) | Math.round(r + ((c & 255) - r) * a)) >>> 0;
    }
    shade(x, y, k) { // multiply: hard shadow
      x = Math.floor(x); y = Math.floor(y);
      if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
      const i = y * this.w + x, s = this.d[i];
      this.d[i] = (0xFF000000 | (Math.round(((s >>> 16) & 255) * k) << 16) | (Math.round(((s >>> 8) & 255) * k) << 8) | Math.round((s & 255) * k)) >>> 0;
    }
    rect(x0, y0, x1, y1, c) { for (let y = Math.floor(y0); y <= y1; y++) for (let x = Math.floor(x0); x <= x1; x++) this.put(x, y, c); }
    fill(c) { this.d.fill(c); }
    copyFrom(o) { this.d.set(o.d); }
  }

  // ---------- primitives (art-pixel coordinates; floats are rounded or sampled at pixel centres)
  function line(x0, y0, x1, y1, fn, i0) { // Bresenham; fn(x, y, i) with a running index for dash patterns
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy, i = i0 || 0, guard = 0;
    for (;;) {
      fn(x0, y0, i++);
      if ((x0 === x1 && y0 === y1) || ++guard > 4000) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
    return i;
  }
  function polyline(pts, fn) { let i = 0; for (let k = 1; k < pts.length; k++) i = line(pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1], fn, i) - 1; return i; }
  const dash = (on, off) => (i) => i % (on + off) < on;
  const circCache = new Map();
  function circle(r) { // midpoint circle, points sorted clockwise from east, with angle
    r = Math.max(0, Math.round(r));
    if (circCache.has(r)) return circCache.get(r);
    const set = new Map();
    let x = r, y = 0, err = 1 - r;
    while (x >= y) {
      for (const [a, b] of [[x, y], [y, x], [-y, x], [-x, y], [-x, -y], [-y, -x], [y, -x], [x, -y]]) set.set(a + ',' + b, [a, b, Math.atan2(b, a)]);
      y++;
      if (err < 0) err += 2 * y + 1; else { x--; err += 2 * (y - x) + 1; }
    }
    const pts = [...set.values()].map((p) => [p[0], p[1], (p[2] + TAU) % TAU]).sort((a, b) => a[2] - b[2]);
    circCache.set(r, pts);
    return pts;
  }
  function disc(cx, cy, r, fn) {
    cx = Math.round(cx); cy = Math.round(cy);
    const rr = (r + 0.5) * (r + 0.5);
    for (let y = -Math.ceil(r); y <= Math.ceil(r); y++) for (let x = -Math.ceil(r); x <= Math.ceil(r); x++) if (x * x + y * y <= rr) fn(cx + x, cy + y);
  }
  function ellipse(cx, cy, rx, ry, fn) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
      const u = (x + 0.5 - cx) / rx, v = (y + 0.5 - cy) / ry;
      if (u * u + v * v <= 1) fn(x, y);
    }
  }
  function fillPoly(pts, fn, W, H) { // scanline at pixel centres
    W = W || AW; H = H || AH;
    let ya = Infinity, yb = -Infinity;
    for (const p of pts) { if (p[1] < ya) ya = p[1]; if (p[1] > yb) yb = p[1]; }
    ya = Math.max(0, Math.floor(ya)); yb = Math.min(H - 1, Math.ceil(yb));
    const n = pts.length, xs = [];
    for (let y = ya; y <= yb; y++) {
      const sy = y + 0.5; xs.length = 0;
      for (let i = 0, j = n - 1; i < n; j = i++) {
        const a = pts[i], b = pts[j];
        if ((a[1] > sy) !== (b[1] > sy)) xs.push(a[0] + (sy - a[1]) / (b[1] - a[1]) * (b[0] - a[0]));
      }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const xa = Math.max(0, Math.ceil(xs[k] - 0.5)), xb = Math.min(W - 1, Math.ceil(xs[k + 1] - 0.5) - 1);
        for (let x = xa; x <= xb; x++) fn(x, y);
      }
    }
  }
  function inPoly(pts, x, y) {
    let c = false;
    for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
      const a = pts[i], b = pts[j];
      if ((a[1] > y) !== (b[1] > y) && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) c = !c;
    }
    return c;
  }
  // outlined mark: every pixel of the mark gets an 8-neighbour outline first (reserved cue treatment)
  function stamp(B, pts, c, oc) {
    if (oc != null) for (const [x, y] of pts) for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) B.put(x + i, y + j, oc);
    for (const [x, y] of pts) B.put(x, y, c);
  }
  function collectLine(x0, y0, x1, y1, pat) { const out = []; line(x0, y0, x1, y1, (x, y, i) => { if (!pat || pat(i)) out.push([x, y]); }); return out; }

  // ---------- load-bearing pixel face: 8 × 12 cell, 12-art-px caps = 24 reference units = ui.typeLoadBearing
  const G = {
    A: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XXXXXXXX', 'XXXXXXXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX'],
    B: ['XXXXXX..', 'XXXXXXX.', 'XX...XXX', 'XX....XX', 'XX...XXX', 'XXXXXX..', 'XXXXXXX.', 'XX...XXX', 'XX....XX', 'XX...XXX', 'XXXXXXX.', 'XXXXXX..'],
    C: ['..XXXXX.', '.XXXXXXX', 'XXX...XX', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XXX...XX', '.XXXXXXX', '..XXXXX.'],
    D: ['XXXXX...', 'XXXXXX..', 'XX..XXX.', 'XX...XXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX...XXX', 'XX..XXX.', 'XXXXXX..', 'XXXXX...'],
    E: ['XXXXXXXX', 'XXXXXXXX', 'XX......', 'XX......', 'XX......', 'XXXXXX..', 'XXXXXX..', 'XX......', 'XX......', 'XX......', 'XXXXXXXX', 'XXXXXXXX'],
    F: ['XXXXXXXX', 'XXXXXXXX', 'XX......', 'XX......', 'XX......', 'XXXXXX..', 'XXXXXX..', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......'],
    G: ['..XXXXX.', '.XXXXXXX', 'XXX...XX', 'XX......', 'XX......', 'XX..XXXX', 'XX..XXXX', 'XX....XX', 'XX....XX', 'XXX...XX', '.XXXXXXX', '..XXXXX.'],
    H: ['XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XXXXXXXX', 'XXXXXXXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX'],
    I: ['.XXXXXX.', '.XXXXXX.', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '.XXXXXX.', '.XXXXXX.'],
    J: ['...XXXXX', '...XXXXX', '......XX', '......XX', '......XX', '......XX', '......XX', '......XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    K: ['XX....XX', 'XX...XXX', 'XX..XXX.', 'XX.XXX..', 'XXXXX...', 'XXXX....', 'XXXX....', 'XXXXX...', 'XX.XXX..', 'XX..XXX.', 'XX...XXX', 'XX....XX'],
    L: ['XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......', 'XXXXXXXX', 'XXXXXXXX'],
    M: ['XX....XX', 'XXX..XXX', 'XXXXXXXX', 'XX.XX.XX', 'XX.XX.XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX'],
    N: ['XX....XX', 'XXX...XX', 'XXXX..XX', 'XXXX..XX', 'XX.XX.XX', 'XX.XX.XX', 'XX..XXXX', 'XX..XXXX', 'XX...XXX', 'XX....XX', 'XX....XX', 'XX....XX'],
    O: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    P: ['XXXXXX..', 'XXXXXXX.', 'XX...XXX', 'XX....XX', 'XX...XXX', 'XXXXXXX.', 'XXXXXX..', 'XX......', 'XX......', 'XX......', 'XX......', 'XX......'],
    Q: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX.XX.XX', 'XXX.XXX.', '.XXXXXXX', '..XXX.XX'],
    R: ['XXXXXX..', 'XXXXXXX.', 'XX...XXX', 'XX....XX', 'XX...XXX', 'XXXXXXX.', 'XXXXXX..', 'XX.XXX..', 'XX..XXX.', 'XX...XXX', 'XX....XX', 'XX....XX'],
    S: ['.XXXXXX.', 'XXXXXXXX', 'XX....XX', 'XX......', 'XXX.....', '.XXXXX..', '..XXXXX.', '.....XXX', '......XX', 'XX....XX', 'XXXXXXXX', '.XXXXXX.'],
    T: ['XXXXXXXX', 'XXXXXXXX', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...'],
    U: ['XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    V: ['XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XXX..XXX', '.XX..XX.', '.XX..XX.', '.XXXXXX.', '..XXXX..', '..XXXX..', '...XX...'],
    W: ['XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX....XX', 'XX.XX.XX', 'XX.XX.XX', 'XXXXXXXX', 'XXX..XXX', 'XX....XX', 'X......X'],
    X: ['XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..', '...XX...', '...XX...', '..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX'],
    Y: ['XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...'],
    Z: ['XXXXXXXX', 'XXXXXXXX', '......XX', '.....XXX', '....XXX.', '...XXX..', '..XXX...', '.XXX....', 'XXX.....', 'XX......', 'XXXXXXXX', 'XXXXXXXX'],
    0: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX', 'XX.XX.XX', 'XX.XX.XX', 'XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    1: ['...XX...', '..XXX...', '.XXXX...', 'XX.XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '...XX...', '.XXXXXX.', '.XXXXXX.'],
    2: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', '......XX', '.....XXX', '....XXX.', '...XXX..', '..XXX...', '.XXX....', 'XXXXXXXX', 'XXXXXXXX'],
    3: ['.XXXXXX.', 'XXXXXXXX', 'XX....XX', '......XX', '.....XXX', '..XXXXX.', '..XXXXX.', '.....XXX', '......XX', 'XX....XX', 'XXXXXXXX', '.XXXXXX.'],
    4: ['....XXX.', '...XXXX.', '..XXXXX.', '.XXX.XX.', 'XXX..XX.', 'XX...XX.', 'XXXXXXXX', 'XXXXXXXX', '.....XX.', '.....XX.', '.....XX.', '.....XX.'],
    5: ['XXXXXXXX', 'XXXXXXXX', 'XX......', 'XX......', 'XXXXXX..', 'XXXXXXX.', '.....XXX', '......XX', '......XX', 'XX...XXX', 'XXXXXXX.', '.XXXXX..'],
    6: ['..XXXXX.', '.XXXXXX.', 'XXX.....', 'XX......', 'XXXXXX..', 'XXXXXXX.', 'XX...XXX', 'XX....XX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    7: ['XXXXXXXX', 'XXXXXXXX', '......XX', '.....XXX', '....XXX.', '...XXX..', '...XX...', '..XXX...', '..XX....', '..XX....', '..XX....', '..XX....'],
    8: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XXX..XXX', '.XXXXXX.', '..XXXX..'],
    9: ['..XXXX..', '.XXXXXX.', 'XXX..XXX', 'XX....XX', 'XX....XX', 'XXX...XX', '.XXXXXXX', '..XXXXXX', '......XX', '.....XXX', '.XXXXXX.', '.XXXXX..'],
    '!': ['XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', 'XX', '..', '..', 'XX', 'XX'],
    '+': ['........', '........', '...XX...', '...XX...', '...XX...', 'XXXXXXXX', 'XXXXXXXX', '...XX...', '...XX...', '...XX...', '........', '........'],
    '-': ['......', '......', '......', '......', '......', 'XXXXXX', 'XXXXXX', '......', '......', '......', '......', '......'],
    ',': ['..', '..', '..', '..', '..', '..', '..', '..', '..', 'XX', 'XX', 'X.'],
    '.': ['..', '..', '..', '..', '..', '..', '..', '..', '..', '..', 'XX', 'XX'],
    ':': ['..', '..', '..', 'XX', 'XX', '..', '..', '..', '..', 'XX', 'XX', '..'],
    '/': ['......XX', '......XX', '.....XX.', '.....XX.', '....XX..', '....XX..', '...XX...', '...XX...', '..XX....', '..XX....', '.XX.....', '.XX.....'],
  };
  const FONT_H = 12, GAP = 2, SPACE = 6;
  const GLYPH = {};
  for (const ch in G) { const rows = G[ch], px = []; rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === 'X') px.push([x, y]); }); GLYPH[ch] = { w: rows[0].length, px }; }
  function textWidth(s, sc) { sc = sc || 1; let w = 0; for (const ch of String(s).toUpperCase()) w += (ch === ' ' ? SPACE : (GLYPH[ch] ? GLYPH[ch].w : 8)) + GAP; return Math.max(0, w - GAP) * sc; }
  function text(B, s, x, y, c, oc, sc) { // top-left at (x, y); oc: 1-px outline colour
    sc = sc || 1; x = Math.round(x); y = Math.round(y);
    const pts = [];
    let cx = x;
    for (const ch of String(s).toUpperCase()) {
      if (ch === ' ') { cx += (SPACE + GAP) * sc; continue; }
      const g = GLYPH[ch]; if (!g) { cx += (8 + GAP) * sc; continue; }
      for (const [gx, gy] of g.px) for (let j = 0; j < sc; j++) for (let i = 0; i < sc; i++) pts.push([cx + gx * sc + i, y + gy * sc + j]);
      cx += (g.w + GAP) * sc;
    }
    stamp(B, pts, c, oc);
    return cx - x - GAP * sc;
  }

  // ---------- sprites: { w, h, d, ox, oy } — (ox, oy) is the anchor inside the sprite
  function spr(w, h, ox, oy) { return { w, h, d: new Uint32Array(w * h), ox, oy }; }
  function sput(S, x, y, c) { if (x >= 0 && y >= 0 && x < S.w && y < S.h) S.d[y * S.w + x] = c; }
  function blit(B, S, ax, ay, solid) {
    const x0 = Math.round(ax) - S.ox, y0 = Math.round(ay) - S.oy;
    for (let j = 0; j < S.h; j++) {
      const y = y0 + j; if (y < 0 || y >= B.h) continue;
      for (let i = 0; i < S.w; i++) {
        const c = S.d[j * S.w + i]; if (!c) continue;
        const x = x0 + i; if (x < 0 || x >= B.w) continue;
        B.d[y * B.w + x] = solid || c;
      }
    }
  }
  function fromRows(rows, keys, ox, oy, flip) {
    const h = rows.length, w = rows[0].length, S = spr(w, h, flip ? w - 1 - ox : ox, oy);
    rows.forEach((r, y) => { for (let x = 0; x < w; x++) { const k = r[x]; if (keys[k] != null) sput(S, flip ? w - 1 - x : x, y, keys[k]); } });
    return S;
  }

  // Cars: an extruded footprint at 32 headings (11.25°). Top face = footprint lifted by the extrusion; side faces below it.
  // Extrusion in art px = vehicles.<cls>.height × proto.art.extrusion ÷ ui.artScale. Colliders never change.
  const HEADINGS = 32;
  function carSprite(cls, L, W, hgt, theta, braking) {
    const hl = L / 2, hw = W / 2, rc = 2.5, ca = Math.cos(theta), sa = Math.sin(theta);
    const loc = (px, py) => [px * ca + py * sa, -px * sa + py * ca];
    const inFoot = (px, py) => {
      const [u, v] = loc(px, py), au = Math.abs(u), av = Math.abs(v);
      if (au > hl || av > hw) return false;
      const du = au - (hl - rc), dv = av - (hw - rc);
      return !(du > 0 && dv > 0 && du * du + dv * dv > rc * rc);
    };
    const R = Math.ceil(Math.hypot(hl, hw)) + 2, x0 = -R, y0 = -R - hgt, w = 2 * R + 1, h = 2 * R + 1 + hgt;
    const cl = new Uint8Array(w * h), k0 = new Int8Array(w * h).fill(-1);
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const x = x0 + i + 0.5, y = y0 + j + 0.5;
      if (inFoot(x, y + hgt)) { cl[j * w + i] = 2; continue; }
      for (let k = 0; k < hgt; k++) if (inFoot(x, y + k)) { cl[j * w + i] = 1; k0[j * w + i] = k; break; }
    }
    const at = (i, j) => (i < 0 || j < 0 || i >= w || j >= h ? 0 : cl[j * w + i]);
    const S = spr(w, h, -x0, -y0);
    let top = h;
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
      const c = at(i, j), x = x0 + i + 0.5, y = y0 + j + 0.5;
      if (!c) {
        if (at(i + 1, j) || at(i - 1, j) || at(i, j + 1) || at(i, j - 1)) { sput(S, i, j, K.fleetO); top = Math.min(top, j); }
        continue;
      }
      top = Math.min(top, j);
      if (c === 2) {
        const [u, v] = loc(x, y + hgt), av = Math.abs(v);
        let col = K.fleetTop;
        if (cls === 'sedan') {
          if (av <= hw - 2 && ((u >= 0.18 * L && u <= 0.29 * L) || (u >= -0.23 * L && u <= -0.16 * L))) col = K.glass;
          else if (av <= hw - 1.5 && u > -0.16 * L && u < 0.18 * L) col = K.fleetRoof;
        } else {
          if (av <= hw - 2 && u >= 0.22 * L && u <= 0.33 * L) col = K.glass;
          else if (av <= hw - 1.5 && u < 0.22 * L && u > -hl + 1) col = Math.abs(((u + hl) % 6)) < 1 ? K.pod2 : K.fleetRoof;
        }
        if (u > hl - 1.6 && av >= hw - 4.5 && av <= hw - 0.8) col = K.head;
        if (u < -hl + 1.6 && av >= hw - 4.5 && av <= hw - 0.8) col = braking ? K.warn : K.tail;
        if (at(i, j + 1) === 1) col = K.fleetLine;
        sput(S, i, j, col);
      } else {
        const bottom = !at(i, j + 1), low = bottom || !at(i, j + 2);
        let col = bottom ? K.fleetSide2 : K.fleetSide;
        const [u] = loc(x, y + Math.max(0, k0[j * w + i]));
        if (low && (Math.abs(u - (hl - 6)) <= 2 || Math.abs(u + (hl - 6)) <= 2)) col = K.joint;
        sput(S, i, j, col);
      }
    }
    S.top = top - S.oy; // first row above the anchor (negative)
    return S;
  }
  const carCache = new Map();
  function car(cls, L, W, hgt, heading, braking) {
    const idx = ((Math.round(heading / (TAU / HEADINGS)) % HEADINGS) + HEADINGS) % HEADINGS;
    const key = cls + idx + (braking ? 'b' : '') + L + 'x' + W + 'x' + hgt;
    if (!carCache.has(key)) carCache.set(key, carSprite(cls, L, W, hgt, idx * TAU / HEADINGS, braking));
    return carCache.get(key);
  }

  // The dummy: 13 × 19, anchor at its feet-centre (6, 15). West is drawn; east mirrors it.
  const DUMMY = {
    W: ['....KKKKK....', '...KWWYYYK...', '..KWWYYYYYK..', '..KWYYYKYYyK.', '..KYYYYYKYyK.', '..KYYYYYYYyK.', '...KyYYYYyK..', '....KKKKKK...', '...KWYYYYyK..', '..KKWYYYYyKK.',
      '.KYKWYYYYyKyK', '.KYKYYYYYyKyK', '.KKKYYYYYyKKK', '...KKKKKKKK..', '...KYyKKYyK..', '...KYyKKYyK..', '...KKKKKKKK..', '...KYyK.KYyK.', '..KKKKK.KKKKK'],
    S: ['....KKKKK....', '...KWYYYyK...', '..KWYYYYYyK..', '..KWYYKYYyK..', '..KYYYYKYyK..', '..KYYYYYYyK..', '...KyYYYyK...', '....KKKKK....', '..KKWYYYyKK..', '.KYKWYYYyKyK.',
      '.KYKYYYYyKyK.', '.KYKYYYYyKyK.', '.KKKKKKKKKKK.', '...KYyKYyK...', '...KYyKYyK...', '...KKKKKKK...', '...KYyKYyK...', '...KYyKYyK...', '..KKKK.KKKK..'],
    N: ['....KKKKK....', '...KWYYYyK...', '..KWYYYYYyK..', '..KYYYYYYyK..', '..KYYYYYYyK..', '..KYYYYYYyK..', '...KyYYYyK...', '....KKKKK....', '..KKWYYYyKK..', '.KYKWYKYyKyK.',
      '.KYKYYKYyKyK.', '.KYKYYKYyKyK.', '.KKKKKKKKKKK.', '...KYyKYyK...', '...KYyKYyK...', '...KKKKKKK...', '...KYyKYyK...', '...KYyKYyK...', '..KKKK.KKKK..'],
  };
  const dummyCache = new Map();
  function dummy(facing, wearStep) { // facing: radians; wearStep 0..5 shifts the yellow toward the worn tone
    const c = Math.cos(facing), s = Math.sin(facing);
    const dir = c > 0.38 ? 'E' : c < -0.38 ? 'W' : s > 0 ? 'S' : 'N';
    const key = dir + wearStep;
    if (!dummyCache.has(key)) {
      const k = Math.min(1, wearStep / 5) * 0.75;
      const keys = { K: K.joint, Y: c32(mixHex(PAL.dummy, PAL.worn, k)), y: c32(mixHex(PAL.dummyD, PAL.worn, k * 0.8)), W: c32(mixHex(PAL.dummyL, PAL.worn, k)) };
      dummyCache.set(key, fromRows(DUMMY[dir === 'E' ? 'W' : dir], keys, 6, 15, dir === 'E'));
    }
    return dummyCache.get(key);
  }
  const CONE = fromRows(['...o...', '..oWo..', '..oOo..', '.oOOOo.', '.oWWWo.', 'oOOOOOo', 'ooooooo'], { o: K.coneO, O: K.cone, W: K.coneW }, 3, 5);
  const DRONE = (() => {
    const S = spr(21, 15, 10, 7);
    const P = (x, y, c) => sput(S, x + 10, y + 7, c);
    for (let i = -6; i <= 6; i++) { P(i, Math.round(i * 0.5), K.label); P(i, -Math.round(i * 0.5), K.label); }
    for (const [rx, ry] of [[-7, -4], [7, -4], [-7, 4], [7, 4]]) for (const p of circle(3)) P(rx + p[0], ry + Math.round(p[1] * 0.6), K.label);
    for (let y = -2; y <= 2; y++) for (let x = -4; x <= 4; x++) P(x, y, Math.abs(y) === 2 || Math.abs(x) === 4 ? K.label : y === 0 ? K.podCrown : K.white);
    return S;
  })();
  function pod(wpx, hpx, H) { // white glass tower on its footprint (anchor = footprint top-left)
    const S = spr(wpx + 1, hpx + H + 4, 0, H + 3), o = K.podO;
    const P = (x, y, c) => sput(S, x, y + H + 3, c);
    for (let y = -H; y < hpx; y++) {
      for (let x = 0; x < wpx; x++) { const f = x / (wpx - 1); P(x, y, f > 0.78 ? K.pod3 : f > 0.55 ? K.pod2 : K.white); }
      P(0, y, o); P(wpx - 1, y, o);
    }
    for (let y = -H; y < -H + 4; y++) for (let x = 1; x < wpx - 1; x++) P(x, y, K.podCrown);
    for (let x = 2; x < Math.min(6, wpx - 1); x++) P(x, -H + 1, K.podHi);
    for (let x = 1; x < wpx - 1; x++) { P(x, -H - 1, o); P(x, hpx - 1, o); P(x, -H + 4, K.pod3); }
    P(wpx >> 1, -H - 2, o); P(wpx >> 1, -H - 3, o);
    return S;
  }
  function barrier(wpx, hpx, e) { // galvanised crash barrier: rail on top, posts on the face (anchor = footprint top-left)
    const S = spr(wpx, hpx + e + 1, 0, e), o = K.railO;
    const P = (x, y, c) => sput(S, x, y + e, c);
    for (let y = -e; y < hpx; y++) for (let x = 0; x < wpx; x++) {
      const topFace = y < hpx - e, edge = x === 0 || x === wpx - 1 || y === -e || y === hpx - 1;
      P(x, y, edge ? o : topFace ? (x % 16 === 0 ? K.railSide : K.rail) : (x % 10 < 2 ? o : K.railSide));
    }
    return S;
  }

  // ---------- scenery
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function blob(B, cx, cy, rx, ry, base, light, shade, outline) {
    const pts = new Set();
    for (let y = -ry - 1; y <= ry + 1; y++) for (let x = -rx - 1; x <= rx + 1; x++) if ((x / (rx + 0.3)) ** 2 + (y / (ry + 0.3)) ** 2 <= 1) pts.add(x + ',' + y);
    for (const k of pts) {
      const [x, y] = k.split(',').map(Number), edge = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !pts.has((x + dx) + ',' + (y + dy)));
      const s = x / rx + y / ry;
      B.put(cx + x, cy + y, edge ? outline : s < -0.7 ? light : s > 0.55 ? shade : base);
    }
  }
  function tree(B, cx, cy) {
    for (let x = cx - 6; x <= cx + 2; x++) for (let y = cy + 9; y <= cy + 10; y++) B.shade(x, y, 0.72);
    B.rect(cx - 1, cy + 4, cx + 1, cy + 10, K.trunk); B.put(cx + 1, cy + 6, K.trunkD);
    for (let y = cy + 4; y <= cy + 10; y++) { B.put(cx - 2, y, K.foliageO); B.put(cx + 2, y, K.foliageO); }
    blob(B, cx, cy, 9, 7, K.foliage, K.foliageL, K.foliageD, K.foliageO);
    for (const [x, y] of [[-4, -3], [-2, -4], [3, -2], [-5, 0]]) B.put(cx + x, cy + y, K.foliageL);
  }
  function hedge(B, cx, cy) { blob(B, cx, cy, 6, 3, K.foliage, K.foliageL, K.foliageD, K.foliageO); }

  // Polyline geometry in world units: nearest distance (signed) and arc length.
  function pathGeom(center) {
    const segs = []; let acc = 0;
    for (let i = 1; i < center.length; i++) {
      const a = center[i - 1], b = center[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
      segs.push({ ax: a[0], ay: a[1], tx: dx / len, ty: dy / len, len, s0: acc }); acc += len;
    }
    return {
      length: acc,
      near(x, y) {
        let best = null;
        for (const g of segs) {
          const px = x - g.ax, py = y - g.ay, t = Math.max(0, Math.min(g.len, px * g.tx + py * g.ty));
          const qx = px - g.tx * t, qy = py - g.ty * t, d = Math.hypot(qx, qy);
          if (!best || d < best.d) best = { d, sd: g.tx * py - g.ty * px, s: g.s0 + t };
        }
        return best;
      },
      at(s) {
        for (const g of segs) if (s <= g.s0 + g.len || g === segs[segs.length - 1]) { const t = s - g.s0; return { x: g.ax + g.tx * t, y: g.ay + g.ty * t, nx: -g.ty, ny: g.tx }; }
        return null;
      },
    };
  }
  // Static shadow: the footprint swept down-left by its height (hard edge, multiply).
  function rectShadow(B, st, h, P) {
    const k = P['proto.art.shadowScale'], ox = SUN.x * h * k / U, oy = SUN.y * h * k / U;
    const x = st.x / U, y = st.y / U, w = st.w / U, hh = st.h / U;
    fillPoly([[x + w, y], [x + w, y + hh], [x + w + ox, y + hh + oy], [x + ox, y + hh + oy], [x + ox, y + oy], [x, y]], (px, py) => B.shade(px, py, 0.72));
  }
  // The level's ground, drawn once: grass, canal, road from the centre line, pavement, planting, static shadows.
  function ground(level, P, seed) {
    const B = new Buf(AW, AH), r = rng(seed || 7);
    B.fill(K.grass);
    for (let i = 0; i < 2000; i++) { const x = Math.floor(r() * AW), y = Math.floor(r() * AH); B.put(x, y, K.grass2); B.put(x + 1, y - 1, K.grass2); }
    for (let i = 0; i < 650; i++) B.put(Math.floor(r() * AW), Math.floor(r() * AH), K.grass3);
    const cb = Math.round(34 / U); // canal along the top edge
    B.rect(0, 0, AW - 1, cb, K.water);
    for (const y of [3, 7, 11, 15]) for (let x = Math.floor(r() * 8); x < AW; x += 31) for (let i = 0; i < 8; i++) B.put(x + i, y + (i > 3 ? 1 : 0), K.water2);
    B.rect(0, cb + 1, AW - 1, cb + 1, K.white); B.rect(0, cb + 2, AW - 1, cb + 2, K.kerb2);
    for (const [bx, by, br] of [[40, 8, 2], [170, 5, 3], [300, 10, 2], [372, 4, 1]]) { for (const p of circle(br)) B.put(bx + p[0], by + p[1], K.white); B.put(bx - 1, by - 1, K.white); }
    // road and pavement from the distance to the centre line
    const geo = pathGeom(level.center), lw = P['world.laneWidth'], outer = lw + P['proto.shoulderWidth'];
    const near = new Float32Array(AW * AH);
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const wx = (x + 0.5) * U, wy = (y + 0.5) * U, n = geo.near(wx, wy);
      near[y * AW + x] = n.d;
      if (n.d >= outer) continue;
      if (n.d < lw) {
        let c = K.road;
        if ((Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0) % 100 < 7) c = K.road2;
        if (n.d >= lw - U) c = K.kerb; else if (n.d >= lw - 2 * U) c = K.kerb2;
        if (n.sd >= 0 && n.sd < U && ((n.s % 36) + 36) % 36 < 20) c = K.white; // lane dashes
        B.put(x, y, c);
      } else B.put(x, y, n.d >= outer - U || ((n.s % 12) + 12) % 12 < U ? K.pave2 : K.pave);
    }
    const clearOf = (wx, wy, m) => level.statics.every((st) => wx < st.x - m || wx > st.x + st.w + m || wy < st.y - m || wy > st.y + st.h + m)
      && level.spawns.every((sp) => Math.hypot(sp.x - wx, sp.y - wy) > m + 20) && (level.coneHomes || []).every((cn) => Math.hypot(cn[0] - wx, cn[1] - wy) > m);
    const roadD = (wx, wy) => { const x = Math.floor(wx / U), y = Math.floor(wy / U); return x < 0 || y < 0 || x >= AW || y >= AH ? 999 : near[y * AW + x]; };
    // flowers, never yellow
    for (let i = 0; i < 160; i++) {
      const x = Math.floor(r() * AW), y = cb + 4 + Math.floor(r() * (AH - cb - 4));
      if (near[y * AW + x] < outer + 12) continue;
      const c = r() < 0.6 ? K.flower : K.flower2; B.put(x, y, c); B.put(x + 1, y + 1, c);
    }
    // hedges just outside the pavement, in runs of three, kept clear of pods, spawns and cones
    for (let s = 40; s < geo.length; s += 150) for (const side of [-1, 1]) {
      if (r() < 0.25) continue;
      for (let k = 0; k < 3; k++) {
        const q = geo.at(s + k * 22); if (!q) continue;
        const wx = q.x + q.nx * side * (outer + 12), wy = q.y + q.ny * side * (outer + 12);
        if (wx < 8 || wy < 46 || wx > AW * U - 8 || wy > AH * U - 8 || roadD(wx, wy) < outer + 6 || !clearOf(wx, wy, 14)) continue;
        hedge(B, Math.round(wx / U), Math.round(wy / U));
      }
    }
    // trees on open lawn
    const trees = [];
    for (let t = 0; t < 400 && trees.length < 12; t++) {
      const wx = 30 + r() * (AW * U - 60), wy = 70 + r() * (AH * U - 100);
      if (roadD(wx, wy) < outer + 34 || roadD(wx, wy + 24) < outer + 20 || !clearOf(wx, wy, 34) || trees.some((q) => Math.hypot(q[0] - wx, q[1] - wy) < 90)) continue;
      trees.push([wx, wy]);
    }
    trees.sort((a, b) => a[1] - b[1]).forEach(([wx, wy]) => tree(B, Math.round(wx / U), Math.round(wy / U)));
    for (const st of level.statics) rectShadow(B, st, P[st.kind === 'barrier' ? 'proto.art.barrierHeight' : st.kind === 'crate' ? 'proto.art.crateHeight' : 'proto.art.pillarHeight'], P);
    return B;
  }

  root.PIX = {
    AW, AH, U, SUN, PAL, K, c32, mixHex, Buf, line, polyline, dash, circle, disc, ellipse, fillPoly, inPoly, stamp, collectLine,
    text, textWidth, FONT_H, blit, car, dummy, CONE, DRONE, pod, barrier, ground, pathGeom, rng, HEADINGS,
  };
})(typeof window !== 'undefined' ? window : globalThis);
