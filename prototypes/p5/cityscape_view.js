// Three districts (P5 mock-up, GDD Edits 51.1–52). Each district is 3 × 3 screens of 800 × 640, drawn in game art with
// live P5 traffic. Parkland: the Z1 roundabout over two pools at B2, a ground road passing north–south beneath it.
// Circus: a four-way roundabout round a brutalist monument. Monument: a road splits round the monument's island; a
// square walkway ring at Z1 bridges both carriageways and links four podium roofs by 45° walkways.
// Rule (Edit 51.2): every highway screen has two escalators, on opposite sides, at opposite ends.
// Roads and highways are planned in district coordinates so every screen edge lines up. No trees, no flower beds:
// brutalist planters, monoliths and public sculptures. Mock-up only: the P5 planner still builds the five districts.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, L = window.TURNLAB, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH;
  const W = P['world.width'], H = P['world.height'], LW = P['world.laneWidth'], OUTER = LW + P['proto.shoulderWidth'], HALF = P['world.deckWidth'] / 2, PW = P['world.parapetWidth'];
  const EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), C = P['world.deckColumn'], c32 = PIX.c32, mixK = PIX.mixK, LEDS = PIX.KX('bldgLed') || [K.lane], hyp = Math.hypot;
  const N = { grass: c32('#0E1712'), grass2: c32('#13211A'), grass3: c32('#1C3024'), water: c32('#08101E'), water2: c32('#13234A'), pave: c32('#2C3243'), pave2: c32('#384056'),
    magenta: c32('#FF5FD2'), cyan: c32('#3FD0FF'), stone: c32('#C9D3DA'), stoneD: c32('#8C98A6'), stoneL: c32('#EEF2F4'), tile: c32('#262C3C'), tile2: c32('#30374B') };
  const CON = { m: c32('#4A5160'), d: c32('#363C49'), l: c32('#7D8799'), x: c32('#22262F'), g: c32('#1F3A27'), g2: c32('#2A4A32'), t: c32('#3B4250'), t2: c32('#444B5A') }; // board-marked concrete
  const ISL = c32('#5F6878'); // the monument's island paving
  const $ = (id) => document.getElementById(id);
  const Z1 = EXT(P['world.deckHeight']), Z2 = EXT(P['world.highHeight']), SWD = P['world.stairWidth'], INSET = P['world.deckEscalatorInset'];
  // ---------- small helpers
  function each(fn) { for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) fn(x, y, (x + 0.5) * U, (y + 0.5) * U, y * AW + x); }
  function walk(pts, step, fn) { let acc = step / 2; for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], l = hyp(x1 - x0, y1 - y0); if (l < 1e-6) continue; while (acc <= l) { const t = acc / l; fn(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, (x1 - x0) / l, (y1 - y0) / l); acc += step; } acc -= l; } }
  function clipRun(pts, x0, y0, x1, y1) { // the polyline's longest run inside a box, cut at its edges (Liang–Barsky per segment)
    const runs = []; let cur = null;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], dx = pts[i][0] - ax, dy = pts[i][1] - ay; let t0 = 0, t1 = 1, ok = true;
      for (const [pp, qq] of [[-dx, ax - x0], [dx, x1 - ax], [-dy, ay - y0], [dy, y1 - ay]]) {
        if (pp === 0) { if (qq < 0) ok = false; continue; }
        const r = qq / pp; if (pp < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r);
      }
      if (!ok || t0 > t1) { cur = null; continue; }
      const A = [ax + dx * t0, ay + dy * t0], Bp = [ax + dx * t1, ay + dy * t1];
      if (!cur || t0 > 0) { cur = [A]; runs.push(cur); }
      cur.push(Bp); if (t1 < 1) cur = null;
    }
    const onScreen = (r) => { let s = 0; for (let i = 1; i < r.length; i++) { const mx = (r[i][0] + r[i - 1][0]) / 2, my = (r[i][1] + r[i - 1][1]) / 2; if (mx >= 0 && mx <= W && my >= 0 && my <= H) s += hyp(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]); } return s; };
    return runs.filter((r) => r.length > 1 && onScreen(r) > 0).sort((a, b) => onScreen(b) - onScreen(a))[0] || null;
  }
  const shift = (pts, dx, dy) => pts.map(([x, y]) => [x + dx, y + dy]);
  const chamf = (x0, y0, x1, y1, k) => (x, y, ins) => { ins = ins || 0; const c = k + ins * 0.6; return x >= x0 + ins && x <= x1 - ins && y >= y0 + ins && y <= y1 - ins && x - x0 + y - y0 >= c && x1 - x + y - y0 >= c && x - x0 + y1 - y >= c && x1 - x + y1 - y >= c; };
  function lawn(B, x, y) { B.put(x, y, ((x * 7 + y * 13) % 29 === 0) ? N.grass3 : (Math.floor((x + y) / 6) % 2 ? N.grass : N.grass2)); }
  function pathLine(B, ok, x0, y0, x1, y1, w) {
    const dx = x1 - x0, dy = y1 - y0, l = hyp(dx, dy);
    each((x, y, wx, wy) => { if (!ok(wx, wy)) return; const t = Math.max(0, Math.min(1, ((wx - x0) * dx + (wy - y0) * dy) / (l * l))), d = hyp(wx - x0 - dx * t, wy - y0 - dy * t); if (d < w / 2) B.put(x, y, d > w / 2 - 2 ? CON.d : (x + y) % 8 === 0 ? CON.t2 : CON.t); });
  }
  function tiles(B, ok, lattice) { // concrete paving on a 16 grid; an LED lattice at 45° where asked
    each((x, y, wx, wy) => { if (!ok(wx, wy)) return; let c = (x % 8 === 0 || y % 8 === 0) ? N.tile2 : N.tile; if (lattice && ((x + y) % 24 === 0 || ((x - y) % 24 + 24) % 24 === 0)) c = (x + y) % 48 === 0 ? mixK(N.tile, N.cyan, 0.5) : mixK(N.tile, N.magenta, 0.4); B.put(x, y, c); });
  }
  function pool(B, ok, x0, y0, x1, y1, k) { // a reflecting pool: 90° sides, 45° corners, concrete coping and a shadowed inner wall
    const inR = chamf(x0, y0, x1, y1, k);
    each((x, y, wx, wy) => {
      if (!ok(wx, wy) || !inR(wx, wy, -6)) return;
      if (!inR(wx, wy, 0)) B.put(x, y, CON.l);
      else if (!inR(wx, wy, 4)) B.put(x, y, wy < y0 + 8 ? CON.x : CON.d); // inner wall, the north one in shade
      else { let c = N.water; if (y % 4 === 0 && ((x * 5 + y) % 11) < 4) c = N.water2; if ((x * 3 + y * 7) % 97 === 0) c = LEDS[(x + y) % LEDS.length]; B.put(x, y, c); }
    });
  }
  // ---------- brutalist pieces (art px): a concrete mass with board marks, LED under the coping, hard shadow down-left
  const HG = { x: c32('#0D1F15'), d: c32('#16301F'), m: c32('#1E3F29'), l: c32('#2A5536'), lime: c32('#7CC24A') }, REED = [c32('#2C6B3C'), c32('#3E8A4A'), c32('#9BD86A'), c32('#3FD0A8')];
  const SOIL = c32('#1B1E17'), MOSS = [c32('#10241A'), c32('#173222'), c32('#1F3D29'), c32('#7CC24A')];
  const hsh = (x, y) => Math.imul((x * 73856093) ^ (y * 19349663), 2654435761) >>> 0;
  const hedgeC = (x, y) => { const n = hsh(x >> 1, y >> 1) % 9; return n < 3 ? HG.d : n < 6 ? HG.m : n < 8 ? HG.l : (hsh(x, y) % 5 ? HG.l : HG.lime); };
  const lawnC = (x, y) => ((x * 7 + y * 13) % 29 === 0) ? N.grass3 : (Math.floor((x + y) / 6) % 2 ? N.grass : N.grass2);
  const mossC = (x, y) => hsh(x, y) % 31 === 0 ? MOSS[3] : MOSS[hsh(x >> 1, y >> 1) % 3];
  function mass(B, fp, x0, y0, x1, y1, base, h, top, led, shadow, faceKind) { // fp(x, y, ins): the footprint in art px within [x0..x1]×[y0..y1]
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    if (shadow) {
      const M = new Uint8Array(AW * AH);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (fp(x, y)) for (let t = 1; t <= base + h; t++) { const sx = Math.round(x - t * 0.7), sy = Math.round(y + t * 0.7); if (sx >= 0 && sy >= 0 && sx < AW && sy < AH && !fp(sx, sy)) M[sy * AW + sx] = 1; }
      for (let q = 0; q < M.length; q++) if (M[q]) B.shade(q % AW, Math.floor(q / AW), 0.68);
    }
    const mid = (x0 + x1) / 2;
    for (let x = x0; x <= x1; x++) {
      let yb = -1; for (let y = y1; y >= y0; y--) if (fp(x, y)) { yb = y; break; }
      if (yb < 0) continue;
      const slant = yb < y1, face = slant ? (x < mid ? CON.d : CON.l) : (x % 4 === 0 ? CON.d : CON.m);
      for (let t = 0; t < h; t++) B.put(x, yb - base - t, faceKind === 'hedge' && t >= 2 ? (t === h - 1 ? HG.m : x % 3 === 0 ? HG.x : HG.d) : t === 0 && base === 0 ? CON.x : t === h - 1 && led ? led : face);
    }
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (!fp(x, y)) continue;
      let c;
      if (top === 'hedge') c = !fp(x, y, 1) ? HG.x : hedgeC(x, y);
      else if (!fp(x, y, 1)) c = CON.l;
      else if (top === 'reeds') c = led && hsh(x, y) % 61 === 0 ? led : SOIL;
      else if (top === 'grass') c = fp(x, y, 2) ? ((x * 3 + y * 5) % 7 ? CON.g : CON.g2) : CON.m;
      else c = !fp(x, y, 2) ? CON.m : ((x - x0) % 6 === 0 || (y - y0) % 6 === 0) ? CON.d : CON.m;
      B.put(x, y - base - h, c);
    }
    if (top === 'reeds') for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) { // grasses in clumps, tips lit
      if (!fp(x, y, 1) || hsh(x, y) % 6) continue;
      const len = 3 + hsh(y, x) % 4, q = hsh(x + 3, y); for (let j = 0; j < len; j++) B.put(x, y - base - h - 1 - j, j === len - 1 ? (q % 5 === 0 ? REED[2] : q % 11 === 0 ? REED[3] : REED[1]) : REED[0]);
    }
  }
  function block(B, x0, y0, x1, y1, k, base, h, top, led, shadow) { x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1); mass(B, chamf(x0, y0, x1, y1, k), x0, y0, x1, y1, base, h, top, led, shadow); }
  // ---------- garden kit (Edit 51.3): running-bond paving, light lines on the path centres, a grid of beds at 90° and 45°
  const GW = P['world.gardenCellWidth'], GH = P['world.gardenCellHeight'], GP = P['world.gardenPath'];
  const paveC = (x, y) => { const i = Math.floor(x / 12), j = Math.floor(y / 12); if (x % 12 === 0 || y % 12 === 0) return CON.d; if ((x % 12 === 6 && y % 12 === 6) && hsh(i, j) % 5 === 0) return N.cyan; return hsh(i, j) % 6 === 0 ? CON.t2 : CON.t; }; // large square slabs, an LED stud at some centres
  const slabC = (x, y, vert) => { const a = vert ? y : x, b = vert ? x : y, row = b >> 2, aa = a + (row & 1) * 8; if ((b & 3) === 0 || (aa & 15) === 0) return CON.d; return hsh(aa >> 4, row) % 7 === 0 ? CON.t2 : CON.t; }; // long slabs along a path
  const diagC = (x, y) => { const u = x + y, v = x - y + 1200; if (u % 6 === 0 || v % 12 === 0) return CON.d; return hsh(Math.floor(u / 6), Math.floor(v / 12)) % 5 === 0 ? CON.t2 : CON.m; };
  function gardenPave(B, ok, diag) {
    const line = mixK(CON.t, N.cyan, 0.5), line2 = mixK(CON.t, N.magenta, 0.45);
    each((x, y, wx, wy) => {
      if (!ok(wx, wy)) return;
      const onD = diag && Math.abs(wx + wy - diag.c) < diag.w / 2;
      const gx = ((wx % GW) + GW) % GW, gy = ((wy % GH) + GH) % GH, mx = Math.min(gx, GW - gx), my = Math.min(gy, GH - gy), pw = GP / 2 + 4;
      let c = onD ? diagC(x, y) : mx < pw && my < pw ? diagC(x, y) : my < pw ? slabC(x, y, 0) : mx < pw ? slabC(x, y, 1) : paveC(x, y);
      if (!onD && ((gx < U && wx > U && wy % 32 < 24) || (gy < U && wy > U && wx % 32 < 24))) c = (Math.floor(wx / GW) + Math.floor(wy / GH)) % 2 ? line : line2; // light lines
      B.put(x, y, c);
    });
  }
  function drawBed(B, type, fpA, fpW, ax0, ay0, ax1, ay1, w0, led) {
    const [x0, y0, x1, y1] = w0;
    if (type === 'lawn' || type === 'moss') { for (let y = ay0; y <= ay1; y++) for (let x = ax0; x <= ax1; x++) if (fpA(x, y)) B.put(x, y, !fpA(x, y, 1) ? CON.l : type === 'lawn' ? lawnC(x, y) : mossC(x, y)); return; }
    if (type === 'hedge') { mass(B, fpA, ax0, ay0, ax1, ay1, 0, 5, 'hedge', null, true, 'hedge'); return; }
    if (type === 'reeds') { mass(B, fpA, ax0, ay0, ax1, ay1, 0, 3, 'reeds', led, true); return; }
    if (type === 'terrace') { mass(B, fpA, ax0, ay0, ax1, ay1, 0, 2, 'conc', null, true); mass(B, (x, y, i) => fpA(x, y, (i || 0) + 4), ax0, ay0, ax1, ay1, 2, 2, 'grass', led, false); mass(B, (x, y, i) => fpA(x, y, (i || 0) + 10), ax0, ay0, ax1, ay1, 4, 3, 'hedge', null, false, 'hedge'); return; }
    if (type === 'pool') { pool(B, () => true, x0, y0, x1, y1, 24); return; }
    tiles(B, (wx, wy) => fpW(wx, wy), true); monolith(B, (x0 + x1) / 2 / U, (y0 + y1) / 2 / U + 2, 0, 22, led); // plaza
  }
  function gardenBeds(B, o) { // o: { bedOk(wx, wy), diag, rng, leds, pools }
    const TYPES = ['hedge', 'reeds', 'lawn', 'moss', 'terrace', 'pool', 'plaza', 'open'], WT = [3, 3, 2, 2, 2, o.pools === false ? 0 : 1.5, 1, 2], tot = WT.reduce((a, q) => a + q, 0), out = [];
    let skip = -1;
    const pick = () => { let r = o.rng() * tot; for (let i = 0; i < TYPES.length; i++) { r -= WT[i]; if (r < 0) return TYPES[i]; } return 'hedge'; };
    let prev = null;
    for (let gy = 0; gy < Math.ceil(H / GH); gy++) for (let gx = 0; gx < Math.ceil(W / GW); gx++) {
      if (skip === gy * 99 + gx) { continue; }
      const x0 = gx * GW + GP / 2, y0 = gy * GH + GP / 2, y1 = Math.min(H - 8, (gy + 1) * GH - GP / 2);
      let x1 = Math.min(W - 8, (gx + 1) * GW - GP / 2);
      const pts = []; for (let x = x0; x <= x1; x += 16) for (let y = y0; y <= y1; y += 16) pts.push([x, y]); pts.push([x1, y1], [x1, y0], [x0, y1]);
      const band = (p) => o.diag && Math.abs(p[0] + p[1] - o.diag.c) < o.diag.w / 2 + 12, outside = pts.filter((p) => !band(p));
      if (outside.length < pts.length * 0.45 || !outside.every((p) => o.bedOk(p[0], p[1]))) { prev = null; continue; }
      let side = 0; if (outside.length < pts.length) side = Math.sign(outside.reduce((a, p) => a + Math.sign(p[0] + p[1] - o.diag.c), 0)) || 1;
      if (side && outside.some((p) => Math.sign(p[0] + p[1] - o.diag.c) !== side)) { prev = null; continue; } // split by the promenade: leave it paved
      let type = pick(); if (type === prev) type = pick(); if (side && type === 'pool') type = 'reeds';
      if (type === 'open') { prev = type; continue; } // left as paving: a small square
      if (!side && ['hedge', 'reeds', 'lawn', 'pool'].includes(type) && o.rng() < 0.3 && gx + 1 < Math.ceil(W / GW)) { // a long bed across two cells
        const nx1 = Math.min(W - 8, (gx + 2) * GW - GP / 2), more = []; for (let x = x1; x <= nx1; x += 16) for (let y = y0; y <= y1; y += 16) more.push([x, y]); more.push([nx1, y1], [nx1, y0]);
        if (more.every((p) => o.bedOk(p[0], p[1]) && !band(p))) { x1 = nx1; skip = gy * 99 + gx + 1; }
      }
      const cw = chamf(x0, y0, x1, y1, 16), fpW = (wx, wy, ins) => cw(wx, wy, ins) && (!side || side * (wx + wy - o.diag.c) > o.diag.w / 2 + 8 + (ins || 0) * 1.42);
      const fpA = (x, y, ins) => fpW((x + 0.5) * U, (y + 0.5) * U, (ins || 0) * U);
      drawBed(B, type, fpA, fpW, Math.floor(x0 / U), Math.floor(y0 / U), Math.ceil(x1 / U), Math.ceil(y1 / U), [x0, y0, x1, y1], o.leds[(gx + gy * 2) % o.leds.length]);
      out.push({ x0, y0, x1, y1, type }); prev = type;
    }
    return out;
  }
  function gardenSculptures(B, ok, diag, rng, n) { // on the path crossings
    const c = []; for (let gy = 1; gy < Math.ceil(H / GH); gy++) for (let gx = 1; gx < Math.ceil(W / GW); gx++) { const x = gx * GW, y = gy * GH; if (ok(x, y) && (!diag || Math.abs(x + y - diag.c) > diag.w / 2 + 16)) c.push([x, y]); }
    for (let i = 0; i < n && c.length; i++) { const [x, y] = c.splice(Math.floor(rng() * c.length), 1)[0]; sculpture(B, x / U, y / U + 1, SCULPT[Math.floor(rng() * SCULPT.length)], LEDS[Math.floor(rng() * LEDS.length)]); }
  }
  // ---------- brutalist towers (Edit 51.3): a podium on pilotis, then a ziggurat, a cantilevered crown, a finned slab or twin towers and a bridge.
  // Slab bands every storey, deep window slots, fins, LED banners and crowns, a 45° cut to the street, hard shadows.
  const STY = EXT(P['world.storeyHeight']);
  function brutal(w, h, H, rng, led, cut, rear, style0) {
    w = Math.round(w); h = Math.round(h); H = Math.round(H);
    const pad = 2, top = H + 18, S = { w: w + 2 * pad, h: h + top + 2, ox: pad, oy: top }; S.d = new Uint32Array(S.w * S.h);
    const put = (x, y, c) => { const X0 = x + pad, Y0 = y + top; if (X0 >= 0 && Y0 >= 0 && X0 < S.w && Y0 < S.h) S.d[Y0 * S.w + X0] = c; };
    const half = (x, y, ins) => { if (!cut) return true; const u = cut.c[1] === 'e' ? x : w - 1 - x, v = cut.c[0] === 's' ? y : h - 1 - y; return u + v <= w + h - 2 - cut.k - (ins || 0) * 1.42; };
    const V = [], vol = (x0, y0, x1, y1, k, b, t, o) => {
      x0 = Math.round(x0); x1 = Math.round(x1); y0 = Math.round(y0); y1 = Math.round(y1);
      if (x1 - x0 < 6 || y1 - y0 < 4 || t <= b) return;
      if (rear === 's' && !(o && o.kind === 'podium')) { const a = h - 1 - y1; y1 = h - 1 - y0; y0 = a; }
      V.push(Object.assign({ x0, y0, x1, y1, k, b: Math.round(b), t: Math.round(t), seed: Math.floor(rng() * 997) }, o || {}));
    };
    const pH = Math.max(STY * 2, Math.round(H * (0.16 + rng() * 0.08) / STY) * STY), style = style0 || ['ziggurat', 'cantilever', 'slab', 'twin'][Math.floor(rng() * 4)];
    const s = Math.max(3, Math.round(w * 0.1)), back = Math.max(4, Math.round(h * 0.2)), up = (f) => pH + Math.round((H - pH) * f / STY) * STY;
    vol(0, 0, w - 1, h - 1, 2, 0, pH, { kind: 'podium' });
    if (style === 'ziggurat') { const m = up(0.55); vol(s, 2, w - 1 - s, h - 1 - back, 3, pH, m, { fins: true }); vol(2 * s, 4, w - 1 - 2 * s, h - 1 - back - s, 3, m, H, { crown: true, mast: true }); }
    else if (style === 'cantilever') { const n = up(0.35); vol(w * 0.3, h * 0.2, w * 0.7, h * 0.6, 2, pH, n, {}); vol(2, 2, w - 3, h - 1 - back, 3, n, H, { over: true, crown: true, fins: true }); }
    else if (style === 'slab') { const d = Math.max(8, Math.round(h * 0.34)); vol(s, 3, w - 1 - s, 3 + d, 2, pH, H, { fins: true, crown: true, banner: true, mast: true }); }
    else { const a = Math.round(w * 0.42), b2 = Math.round(w * 0.58), d = Math.round(h * 0.62); vol(2, 2, a, d, 3, pH, H, { crown: true, banner: true, mast: true }); vol(b2, 2, w - 3, d, 3, pH, up(0.8), { crown: true, fins: true }); vol(a + 1, h * 0.16, b2 - 1, h * 0.36, 1, up(0.55), up(0.68), { over: true }); }
    const inV = (v, x, y, ins) => { ins = ins || 0; const c = v.k + ins * 0.6; return x >= v.x0 + ins && x <= v.x1 - ins && y >= v.y0 + ins && y <= v.y1 - ins && x - v.x0 + y - v.y0 >= c && v.x1 - x + y - v.y0 >= c && x - v.x0 + v.y1 - y >= c && v.x1 - x + v.y1 - y >= c && half(x, y, ins); };
    const darker = (c) => c === CON.l ? CON.m : c === CON.m ? CON.d : CON.x;
    const face = (v, x, z, sl) => {
      const base = sl < 0 ? CON.d : sl > 0 ? CON.l : CON.m, f = z - v.b, fl = Math.floor(f / STY), r = f % STY;
      if (z === 0) return CON.x;
      if (v.kind === 'podium' && f < STY) return x % 6 === 0 ? base : f === STY - 1 ? led : CON.x; // pilotis, a lit shop line
      if (v.banner && x >= v.x0 + 3 && x <= v.x0 + 4 && f >= STY && z < v.t - 2) return fl % 2 ? led : mixK(led, K.white, 0.45); // an LED banner
      if (r === STY - 1) return sl > 0 ? CON.l : mixK(base, CON.l, 0.5); // slab edge
      if (v.fins && x % 3 === 0) return base;
      if (r === 1 || r === 2) { const q = hsh(x + v.seed, fl * 7 + v.y0) % 17; return q === 0 ? mixK(CON.x, led, 0.7) : q === 1 ? mixK(CON.x, K.white, 0.3) : CON.x; } // deep window slots
      return x % 4 === 0 ? darker(base) : base;
    };
    const drawVol = (v) => {
      const mid = (v.x0 + v.x1) / 2;
      for (let x = v.x0; x <= v.x1; x++) {
        let yb = -1; for (let y = v.y1; y >= v.y0; y--) if (inV(v, x, y)) { yb = y; break; }
        if (yb < 0) continue;
        const sl = yb < v.y1 ? (x < mid ? -1 : 1) : 0;
        for (let z = v.b; z < v.t; z++) put(x, yb - z, v.plain ? (z === v.b ? CON.x : sl < 0 ? CON.d : x % 4 === 0 ? CON.d : CON.m) : face(v, x, z, sl));
        if (v.over) for (let d = 1; d <= 2; d++) put(x, yb - v.b + d, CON.x); // soffit shadow under a cantilever
      }
      for (let y = v.y0; y <= v.y1; y++) for (let x = v.x0; x <= v.x1; x++) {
        if (!inV(v, x, y)) continue;
        const edge = !inV(v, x, y, 1), front = edge && !inV(v, x, y + 1);
        const roof = mixK(CON.t, CON.l, Math.min(0.45, v.t / Math.max(1, H) * 0.45));
        put(x, y - v.t, v.crown && front ? led : edge ? CON.l : v.plain ? CON.t2 : ((x - v.x0) % 8 === 0 || (y - v.y0) % 8 === 0) ? mixK(roof, CON.d, 0.5) : roof);
      }
      if (v.mast) { const mx = v.x0 + 4, my = v.y0 + 3; for (let j = 0; j < 10; j++) put(mx, my - v.t - j, CON.l); put(mx, my - v.t - 10, led); put(mx - 1, my - v.t - 6, CON.l); put(mx + 1, my - v.t - 6, CON.l); }
    };
    const shadeRoof = (lo, hi) => { // a higher volume casts a hard shadow on a lower roof
      const L2 = Math.round((hi.t - lo.t) * 0.6), M = new Set();
      for (let y = hi.y0; y <= hi.y1; y++) for (let x = hi.x0; x <= hi.x1; x++) if (inV(hi, x, y)) for (let t = 1; t <= L2; t++) { const px = Math.round(x - t * 0.7), py = Math.round(y + t * 0.7); if (inV(lo, px, py, 1) && !inV(hi, px, py)) M.add(px + ',' + py); }
      for (const q of M) { const [px, py] = q.split(',').map(Number), X0 = px + pad, Y0 = py - lo.t + top; if (X0 >= 0 && Y0 >= 0 && X0 < S.w && Y0 < S.h && S.d[Y0 * S.w + X0]) S.d[Y0 * S.w + X0] = mixK(S.d[Y0 * S.w + X0], CON.x, 0.5); }
    };
    V.forEach((v, i) => { drawVol(v); for (const u of V.slice(i + 1)) if (u.t > v.t && u.b >= v.t - 1) shadeRoof(v, u); });
    // roofscape: plant cores on the highest roof, skylights on the podium roof, an LED billboard on the front edge
    const topV = V.reduce((a, v) => (v.t > a.t ? v : a), V[0]), towers = V.slice(1), coveredAt = (x, y) => towers.some((v) => inV(v, x, y, -1));
    for (let i = 0; i < 2; i++) {
      const cw = 4 + Math.floor(rng() * 4), ch = 3 + Math.floor(rng() * 2), cx = topV.x0 + 3 + Math.floor(rng() * Math.max(1, topV.x1 - topV.x0 - cw - 6)), cy = topV.y0 + 2 + Math.floor(rng() * Math.max(1, topV.y1 - topV.y0 - ch - 4));
      if ([[cx, cy], [cx + cw, cy], [cx, cy + ch], [cx + cw, cy + ch]].every(([x, y]) => inV(topV, x, y, 2))) drawVol({ x0: cx, y0: cy, x1: cx + cw, y1: cy + ch, k: 0, b: topV.t, t: topV.t + 3 + Math.floor(rng() * 4), plain: true });
    }
    const pod = V[0];
    for (let i = 0; i < 6; i++) {
      const x = pod.x0 + 4 + Math.floor(rng() * (pod.x1 - pod.x0 - 10)), y = pod.y0 + 3 + Math.floor(rng() * (pod.y1 - pod.y0 - 6));
      if (![[x, y], [x + 5, y], [x, y + 2], [x + 5, y + 2]].every(([a, b2]) => inV(pod, a, b2, 2) && !coveredAt(a, b2) && !coveredAt(a, b2 + 6))) continue;
      for (let j = 0; j < 2; j++) for (let i2 = 0; i2 <= 5; i2++) put(x + i2, y + j - pod.t, i2 === 0 || i2 === 5 ? CON.x : mixK(CON.x, N.cyan, j ? 0.25 : 0.5));
    }
    if (rng() < 0.6 && topV.x1 - topV.x0 > 16) { // a billboard on legs, lit
      const bw = Math.min(16, topV.x1 - topV.x0 - 8), bx = topV.x0 + 4 + Math.floor(rng() * (topV.x1 - topV.x0 - bw - 8)); let by = topV.y1 - 2; while (by > topV.y0 && !inV(topV, bx, by, 1)) by--;
      for (const lx of [bx + 1, bx + bw - 1]) for (let z = 0; z < 3; z++) put(lx, by - topV.t - z, CON.l);
      for (let z = 3; z < 10; z++) for (let x = bx; x <= bx + bw; x++) put(x, by - topV.t - z, z === 3 || z === 9 || x === bx || x === bx + bw ? CON.x : z % 2 ? led : mixK(led, K.white, 0.35));
    }
    return S;
  }
  function brutalShadow(B, ax, ay, w, h, L, cut) {
    w = Math.round(w); h = Math.round(h); ax = Math.round(ax); ay = Math.round(ay);
    const fp = (x, y) => { if (x < 0 || y < 0 || x >= w || y >= h) return false; if (!cut) return true; const u = cut.c[1] === 'e' ? x : w - 1 - x, v = cut.c[0] === 's' ? y : h - 1 - y; return u + v <= w + h - 2 - cut.k; };
    const M = new Uint8Array(AW * AH), mark = (x, y) => { const sx = ax + x, sy = ay + y; if (sx >= 0 && sy >= 0 && sx < AW && sy < AH) M[sy * AW + sx] = 1; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      if (!fp(x, y)) continue;
      const rim = !fp(x - 1, y) || !fp(x + 1, y) || !fp(x, y - 1) || !fp(x, y + 1);
      if (rim) for (let t = 1; t <= L; t++) { const px = Math.round(x - t * 0.7), py = Math.round(y + t * 0.7); if (!fp(px, py)) mark(px, py); }
      const px = Math.round(x - L * 0.7), py = Math.round(y + L * 0.7); if (!fp(px, py)) mark(px, py);
    }
    for (let q = 0; q < M.length; q++) if (M[q]) B.shade(q % AW, Math.floor(q / AW), 0.62);
  }
  function monolith(B, ax, ay, base, h, led) { // a concrete slab with a lit slot
    block(B, ax - 2, ay - 1, ax + 2, ay + 1, 0, base, h, 'conc', null, base === 0);
    for (let t = 3; t < h - 2; t++) B.put(Math.round(ax), Math.round(ay) + 1 - base - t, led);
    B.put(Math.round(ax), Math.round(ay) - 1 - base - h, K.white);
  }
  function planter(B, wx, wy, hw, hh, kind, led) { // world centre and half-size; a raised lawn in a concrete box, or tiers, with a monolith
    const x = wx / U, y = wy / U, a = hw / U, b = hh / U, k = Math.round(Math.min(a, b) * 0.5);
    if (kind === 'tiers') { block(B, x - a, y - b, x + a, y + b, k, 0, 3, 'conc', null, true); block(B, x - a + 4, y - b + 3, x + a - 4, y + b - 3, Math.max(1, k - 3), 3, 3, 'grass', led, false); monolith(B, x, y, 6, 18, led); }
    else { block(B, x - a, y - b, x + a, y + b, k, 0, 5, 'grass', led, true); if (kind === 'monolith') monolith(B, x + a * 0.4, y, 5, 20, led); }
  }
  // ---------- public sculptures (art px; anchored at the footprint centre)
  function sculpture(B, ax, ay, kind, led) {
    const x0 = Math.round(ax), y0 = Math.round(ay), put = (x, y, c) => B.put(x0 + x, y0 + y, c), sh = (n, w) => { for (let t = 0; t < n; t++) for (let j = -w; j <= w; j++) B.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.72); };
    for (let x = -5; x <= 5; x++) for (let y = -2; y <= 2; y++) if (Math.abs(x) + Math.abs(y) * 2 <= 6) put(x, y, y > 0 ? CON.d : CON.l); // chamfered plinth
    if (kind === 'obelisk') { sh(16, 2); for (let h = 1; h < 26; h++) { const w = h > 20 ? 1 : 2; for (let i = -w; i <= w; i++) put(i, -h, i === -w ? CON.l : i === w ? led : CON.m); } put(0, -26, K.white); put(0, -27, led); }
    else if (kind === 'ring') { sh(12, 3); for (let h = 1; h < 6; h++) put(0, -h, CON.m); for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; put(Math.round(Math.cos(t) * 6), Math.round(-14 + Math.sin(t) * 9), a % 8 < 5 ? led : K.white); } }
    else if (kind === 'cubes') { sh(12, 4); for (const [s, ox, h0] of [[8, -1, 0], [6, 1, 8], [4, 0, 14]]) for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) put(ox + x - s / 2, -h0 - y - 1, x === 0 || y === s - 1 ? led : y === 0 ? CON.l : CON.m); }
    else if (kind === 'arch') { sh(14, 5); for (let h = 1; h < 20; h++) for (const px of [-6, 5]) { put(px, -h, CON.l); put(px + 1, -h, CON.m); } for (let x = -6; x <= 6; x++) { put(x, -20, CON.l); put(x, -19, led); } }
    else { sh(10, 4); for (let k = 0; k < 5; k++) for (let h = 1; h < 10 + k * 3; h++) put(-6 + k * 3, -h, h > 6 + k * 3 ? led : CON.m); } // light fins
  }
  const SCULPT = ['obelisk', 'ring', 'cubes', 'arch', 'fins'];
  // ---------- escalators: two per highway screen, on opposite sides, at opposite ends (Edit 51.2)
  function escalators(off, z, half, x0, x1) { // north at the west end, south at the east end
    const run = X.stairRun(P, 0, z), a = x0 === undefined ? INSET : x0, b = x1 === undefined ? W - INSET - SWD : x1;
    return [{ x: a, y: off - half - run, w: SWD, h: run, axis: 'y', low: off - half - run, high: off - half, side: -1, z },
      { x: b, y: off + half, w: SWD, h: run, axis: 'y', low: off + half + run, high: off + half, side: 1, z }];
  }
  const stairProp = (st, lift) => ({ spr: PIX.stairs(st, 0, lift), x: st.x / U, y: st.y / U, by: st.y + st.h, over: st.side > 0 || st.axis === 'x' });
  // ---------- decks in their own layer: straight highways (the game's PIX.deck) or rings (distance field)
  function ringRoutes(cx, cy, Rc, Rf) {
    const a = { ang: Math.PI, pt: [-200, cy] }, b = { ang: 0, pt: [W + 200, cy] }, r = () => 0.9, phi = Math.asin(Rf / (Rc + Rf)), D = (Rc + Rf) * Math.cos(phi);
    return { WE: X.roundaboutCenter(a, b, 2 * cx, 2 * cy, 200, Rc, r, Rf), EW: X.roundaboutCenter(b, a, 2 * cx, 2 * cy, 200, Rc, r, Rf), ring: X.arcPts(cx, cy, Rc, 0, 2 * Math.PI, 96), armW: [[-200, cy], [cx - D, cy]], armE: [[cx + D, cy], [W + 200, cy]] };
  }
  function ringLayer(rr, z, cx, cy, Rc, avoid, openings) { // a curved deck from its centre lines: parapets, lane lines, dashes, girder face, paired lamps (outer), columns
    const geoms = rr.geoms || [{ pts: rr.ring, dash: true }, { pts: rr.armW, dash: true }, { pts: rr.armE, dash: true }, { pts: rr.WE }, { pts: rr.EW }];
    const f = PIX.roadField(geoms, HALF + 6), Lr = new PIX.Buf(AW, AH), led = LEDS[z === 2 ? 2 : 1], inB = (x, y) => x >= 0 && y >= 0 && x < AW && y < AH && f.D[y * AW + x] <= HALF;
    each((x, y, wx, wy, k) => {
      const d = f.D[k]; if (d > HALF) return;
      const pb = HALF - d, s = f.S[k], m = ((s % 6) + 6) % 6 < 3;
      if (pb < PW + 1 && (openings || []).some(([a, b, sd]) => wx > a && wx < b && (sd > 0 ? wy > cy : wy < cy))) { Lr.put(x, y, K.deck2); return; } // an escalator head: no parapet
      Lr.put(x, y, pb < 2 ? K.jerseyO : pb < 4 ? (m ? led : K.jerseyTop) : pb < PW + 1 ? K.jersey : Math.abs(d - LW) < 1.2 ? K.lane : f.dash[k] && d < 1.2 && ((s % 48) + 48) % 48 < 28 ? K.lane : f.dash[k] && ((s % 64) + 64) % 64 < 1.5 ? K.deckJoint : d > LW ? K.deck2 : K.deck);
    });
    each((x, y) => { if (inB(x, y)) return; for (let k = 1; k <= 4; k++) if (inB(x, y - k)) { Lr.put(x, y, k === 1 ? K.jerseyTop : k === 4 ? K.bldgOutline : (x % 4 < 1 ? K.columnD : K.column)); break; } });
    const lift = z === 2 ? Z2 : Z1, glow = mixK(K.deck2, K.white, 0.38), cols = [];
    for (const g of geoms.filter((q) => q.dash)) walk(g.pts, P['world.deckLampSpacing'], (x, y, tx, ty) => { for (const sd of [-1, 1]) {
      const wx = x - ty * sd * (HALF - 3), wy = y + tx * sd * (HALF - 3); if (hyp(wx - cx, wy - cy) < Rc) continue; // lamps on the outer parapet
      if ((openings || []).some(([a, b]) => wx > a - 12 && wx < b + 12 && Math.abs(Math.abs(wy - cy) - HALF) < 8)) continue;
      const bx = Math.round(wx / U), by = Math.round(wy / U), ix = Math.round((x - ty * sd * (HALF - 9)) / U), iy = Math.round((y + tx * sd * (HALF - 9)) / U);
      if (bx < 1 || by < 1 || bx >= AW - 2 || by >= AH) continue;
      for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (Math.abs(i) + Math.abs(j) <= 2 && inB(ix + i, iy + j)) Lr.put(ix + i, iy + j, glow);
      for (let h = 1; h < PIX.LAMP_H; h++) { Lr.put(bx, by - h, K.jerseyTop); Lr.put(bx + 1, by - h, K.bldgOutline); }
      for (let i = -1; i <= 2; i++) { Lr.put(bx + i, by - PIX.LAMP_H + 1, i === 0 || i === 1 ? K.white : K.head); Lr.put(bx + i, by - PIX.LAMP_H, K.bldgOutline); }
    } });
    for (const g of geoms.filter((q) => q.dash)) walk(g.pts, 120, (x, y, tx, ty) => { for (const sd of [-1, 1]) {
      const off = HALF - 4 - C / 2, ccx = x - ty * sd * off, ccy = y + tx * sd * off;
      if (ccx < C || ccy < C || ccx > W - C || ccy > H - C || avoid(ccx, ccy) || cols.some((q) => hyp(q.cx - ccx, q.cy - ccy) < C + 24)) continue;
      cols.push({ cx: ccx, cy: ccy, key: ccy + C / 2, x: ccx - C / 2, y: ccy - C / 2, spr: PIX.column(Math.round(C / U), Math.round(C / U), lift) });
    } });
    return { L: Lr, lift, cols, front: cy + Rc + HALF, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && f.D[k] <= HALF + 12; }, shadeOn: (B) => {
      const k = P['proto.art.shadowScale'], hgt = z === 2 ? P['world.highHeight'] : P['world.deckHeight'], ox = PIX.SUN.x * hgt * k / U, oy = PIX.SUN.y * hgt * k / U;
      each((x, y) => { for (const t of [0, 0.5, 1]) { const sx = Math.round(x - ox * t), sy = Math.round(y - oy * t); if (sx >= 0 && sy >= 0 && sx < AW && sy < AH && f.D[sy * AW + sx] <= HALF) { B.shade(x, y, 0.72); break; } } });
    } };
  }
  function straightDeck(off, z, roadOk, stairs) { // the game's own highway sprite, lamps and round columns, with escalator heads open
    const dk = { hz: true, off, z, height: z === 2 ? P['world.highHeight'] : P['world.deckHeight'], gaps: [], openings: stairs.map((st) => [st.x, st.x + st.w, st.side]) }, { S, ext } = PIX.deck(dk, P), cols = [];
    for (let p = P['world.deckPillarSpacing'] / 2; p < W; p += P['world.deckPillarSpacing']) for (const e of [off - HALF + 4, off + HALF - 4 - C]) {
      if (!roadOk(p, e + C / 2, OUTER + C + 4)) continue;
      cols.push({ cx: p, cy: e + C / 2, key: e + C, x: p - C / 2, y: e, spr: PIX.column(Math.round(C / U), Math.round(C / U), ext) });
    }
    const Lr = new PIX.Buf(AW, AH); PIX.blit(Lr, S, 0, Math.round((off - HALF) / U));
    return { dk, L: Lr, lift: ext, cols, front: off + HALF, inBand: (wx, wy) => Math.abs(wy - off) < HALF + 12 };
  }
  // ---------- the walkway at Z1: a union of polygons, square ends where it meets a podium roof or an escalator head
  function walkwayLayer(polys, roofs, joins, colOk) {
    const M = new Uint8Array(AW * AH), R = new Uint8Array(AW * AH), Lr = new PIX.Buf(AW, AH), inRect = (r, wx, wy) => wx >= r[0] && wx <= r[0] + r[2] && wy >= r[1] && wy <= r[1] + r[3];
    each((x, y, wx, wy, k) => { if (polys.some((p) => PIX.inPoly(p, wx, wy))) M[k] = 1; if (roofs.some((r) => inRect(r, wx, wy))) R[k] = 1; else if (joins.some((r) => inRect(r, wx, wy))) R[k] = 2; });
    const out = (x, y) => x < 0 || y < 0 || x >= AW || y >= AH || (!M[y * AW + x] && !R[y * AW + x]), on = (k) => M[k] && !R[k];
    each((x, y, wx, wy, k) => {
      if (!on(k)) return;
      let edge = 9; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (out(x + i, y + j)) edge = Math.min(edge, Math.max(Math.abs(i), Math.abs(j)));
      Lr.put(x, y, edge === 1 ? K.jerseyO : edge === 2 ? (((x + y) % 6) < 3 ? N.magenta : K.jerseyTop) : edge === 3 ? K.jersey : (x + y) % 10 === 0 ? K.deckJoint : (((x >> 2) + (y >> 2)) % 2 ? K.deck : K.deck2));
    });
    each((x, y, wx, wy, k) => { if (M[k] && !R[k]) return; for (let d = 1; d <= 4; d++) { const kk = (y - d) * AW + x; if (y - d >= 0 && on(kk)) { Lr.put(x, y, d === 1 ? K.jerseyTop : d === 2 ? CON.m : d === 3 ? N.cyan : K.bldgOutline); break; } } }); // fascia with an LED strip
    // round columns under the walkway, on pavements and the island, never in a lane
    const cols = [], cw = P['world.walkwayColumn'];
    for (const p of polys.filter((q) => q.spine)) walk(p.spine, P['world.deckPillarSpacing'] / 2, (x, y) => {
      if (!colOk(x, y) || roofs.concat(joins).some((r) => inRect([r[0] - 16, r[1] - 16, r[2] + 32, r[3] + 32], x, y)) || cols.some((q) => hyp(q.cx - x, q.cy - y) < 64)) return;
      cols.push({ cx: x, cy: y, key: y + cw / 2, x: x - cw / 2, y: y - cw / 2, spr: PIX.column(Math.round(cw / U), Math.round(cw / U), Z1) });
    });
    return { L: Lr, lift: Z1, cols, front: 1e6, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && M[k] === 1; }, shadeOn: (B) => {
      const k = P['proto.art.shadowScale'], hgt = P['world.deckHeight'], ox = PIX.SUN.x * hgt * k / U, oy = PIX.SUN.y * hgt * k / U;
      each((x, y) => { for (const t of [0.5, 1]) { const sx = Math.round(x - ox * t), sy = Math.round(y - oy * t); if (sx >= 0 && sy >= 0 && sx < AW && sy < AH && M[sy * AW + sx] && !R[sy * AW + sx]) { B.shade(x, y, 0.66); break; } } });
    } };
  }
  // the monument (art px): stepped base, banded white shaft, clock face, crown and spire, a ring of lamp posts
  function drawMonument(Bf, cx, cy) {
    const x0 = Math.round(cx / U), y0 = Math.round(cy / U), Ht = 58;
    for (let t = 0; t < 40; t++) for (let j = -4; j <= 4; j++) Bf.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.75);
    for (const [rx, ry, lift, c] of [[16, 7, 0, N.stoneD], [13, 6, 2, N.stone], [10, 5, 4, N.stoneL]]) PIX.ellipse(x0, y0 - lift, rx, ry, (x, y) => Bf.put(x, y, c));
    for (let h = 4; h < Ht; h++) for (let i = -4; i <= 4; i++) { const u = i / 4.5; Bf.put(x0 + i, y0 - h, h % 10 === 0 ? N.stoneD : u < -0.4 ? N.stoneL : u < 0.4 ? N.stone : N.stoneD); }
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) Bf.put(x0 + i, y0 - Ht + 8 + j, i * i + j * j <= 1 ? K.white : N.cyan);
    for (let h = 0; h < 6; h++) for (let i = -5 + Math.floor(h / 2); i <= 5 - Math.floor(h / 2); i++) Bf.put(x0 + i, y0 - Ht - h, h < 2 ? N.stoneD : N.stoneL);
    for (let h = 6; h < 12; h++) Bf.put(x0, y0 - Ht - h, h > 9 ? N.cyan : N.stoneL);
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, lx = Math.round(x0 + Math.cos(a) * 20), ly = Math.round(y0 + Math.sin(a) * 9); for (let h = 0; h < 6; h++) Bf.put(lx, ly - h, K.jerseyTop); Bf.put(lx, ly - 6, K.white); }
  }
  // Monument B2: the road splits round the monument's island. Two one-way lanes, 45° tapers, fillets 96 (no buses).
  function splitRoad(cy) {
    const o = P['world.splitLaneOffset'], h = LW / 2, d = o - h, xa = 120, xb = W - 120;
    const E = fil([[-200, cy + h], [xa, cy + h], [xa + d, cy + o], [xb - d, cy + o], [xb, cy + h], [W + 200, cy + h]]);
    const Wl = fil([[W + 200, cy - h], [xb, cy - h], [xb - d, cy - o], [xa + d, cy - o], [xa, cy - h], [-200, cy - h]]);
    return { E, Wl };
  }
  function paintSplit(B, E, Wl) { // asphalt, kerbs, centre dashes on the shared stretch, hatched gores, pavements; returns the margin field
    const fE = PIX.roadField([{ pts: E }], 240), fW = PIX.roadField([{ pts: Wl }], 240), m = new Float32Array(AW * AH), h = LW / 2;
    each((x, y, wx, wy, k) => {
      const a = fE.D[k], b = fW.D[k], lane = Math.max(h - a, h - b), pair = LW - (a + b) / 2, mm = Math.max(lane, pair); m[k] = mm;
      if (mm <= -P['proto.shoulderWidth']) return;
      if (mm < 0) { B.put(x, y, mm > -U || ((fE.S[k] % 12) + 12) % 12 < U ? N.pave2 : N.pave); return; }
      let c = (Math.imul(x * 73856093 ^ y * 19349663, 2654435761) >>> 0) % 100 < 7 ? K.road2 : K.road;
      if (mm < U) c = K.kerb; else if (mm < 2 * U) c = K.kerb2;
      else if (lane < 0 && pair > 0) { if (((x - y) % 6 + 6) % 6 < 2) c = K.lane; } // gore: hatched where the lanes part
      else if (Math.abs(a - b) < U && a + b < LW + 2 && ((fE.S[k] % 36) + 36) % 36 < 20) c = K.lane;
      B.put(x, y, c);
    });
    return m;
  }
  // ---------- level design (Edit 52). Each district is planned in district coordinates (3 × 3 screens of 800 × 640).
  // Every tile reveals its own mechanic and landmark. Roads and highways cross at 90° or 45°; highways may run across,
  // down or at 45°. Every roundabout has three or more arms, and its inner lane is the orbit lane (traffic.ringOrbit).
  const R96 = P['world.roundaboutEntryRadius'], RB = P['vehicles.bus.minRadius'];
  const fil = (pts, r) => X.filletAny(pts, r || R96, 0);
  const loop2 = (pts) => pts.concat(pts.slice(1)); // a closed road twice round: every screen clips one unbroken run
  const DISTRICTS = [
    { id: 'parkland', name: 'Parkland', quota: P['world.district.parkland.quota'], storeys: [2, 5], start: ['A1', 'top'],
      mood: 'Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.',
      roads: [{ id: 'boulevard', pts: [[40, -200], [2360, 2120]] }, { id: 'loop', pts: fil([[400, 160], [400, 1600], [2240, 1600], [2240, 1200], [1760, 720], [1760, -200]], RB) }],
      junctions: [{ tile: 'A1', at: [400, 160], major: 'boulevard' }, { tile: 'C3', at: [240, 320], major: 'boulevard' }],
      ring: { tile: 'B2', z: 1, arms: ['W', 'N', 'E', 'S'] },
      decks: [{ hz: true, at: 960, z: 1 }, { hz: false, at: 1200, z: 1 }], park: true,
      tiles: {
        A1: ['Start, top edge. The 45° boulevard; a T junction at 45°: the avenue gives way', 'Reservoir terraces: three stepped pools'],
        B1: ['The Z1 highway runs north–south; escalators west (north end) and east (south end). The boulevard cuts the corner', 'Cascade: water steps beside the highway'],
        C1: ['The avenue under a Z1 footbridge: escalators at both ends, drop onto cars', 'Lantern pavilion'],
        A2: ['The avenue passes under the Z1 highway at 90°; escalators north (west end) and south (east end)', 'Canal along the highway'],
        B2: ['Four-arm Z1 roundabout (W, N, E, S). Give way to the ring; the inner lane is the orbit lane. The boulevard passes beneath, through the hole', 'Reflecting pools under the ring'],
        C2: ['The avenue crosses under the Z1 highway at 45°', 'Amphitheatre terraces'],
        A3: ['A wide R160 bend (buses may use it)', 'Monolith orchard'],
        B3: ['The garden street passes under the Z1 highway at 90°; escalators', 'Obelisk on the axis'],
        C3: ['Crossroads at 45°: the street gives way to the boulevard; then a wide R160 bend north', 'Sculpture court'] } },
    { id: 'circus', name: 'Circus', quota: P['world.district.circus.quota'], storeys: [6, 14], start: ['A2', 'west'],
      mood: 'Busy and circling, walled by monumental concrete. An octagon of streets rings the four-arm roundabout.',
      roads: [{ id: 'octagon', pts: loop2(fil([[800, 480], [560, 480], [480, 560], [480, 1360], [560, 1440], [1840, 1440], [1920, 1360], [1920, 560], [1840, 480], [800, 480]])) },
        { id: 'west', pts: [[-200, 960], [1000, 960]] }, { id: 'north', pts: [[1200, 480], [1200, 840]] }, { id: 'east', pts: [[1400, 960], [1920, 960]] }, { id: 'south', pts: [[1200, 1100], [1200, 2120]] }],
      junctions: [{ tile: 'A2', at: [480, 320], major: 'octagon' }, { tile: 'B1', at: [400, 480], major: 'octagon' }, { tile: 'C2', at: [320, 320], major: 'octagon' }, { tile: 'B3', at: [400, 160], major: 'octagon' }],
      roundabout: { tile: 'B2', arms: ['W', 'N', 'E', 'S'] },
      decks: [{ hz: true, at: 1680, z: 1 }],
      tiles: {
        A1: ['The octagon turns two 45° corners; roadworks close a lane (cones)', 'A tower cut parallel to the diagonal'],
        B1: ['T junction: the north arm gives way to the octagon', 'Twin towers and their bridge'],
        C1: ['The octagon turns two 45° corners on a flooded road (puddles: cars skid)', 'A ziggurat stepping toward the diagonal'],
        A2: ['Start, west edge. Crossroads: the entry road gives way to the octagon', 'LED billboard wall facing the entry'],
        B2: ['Four-arm roundabout: give way at entry; orbit on the inner lane when the exit is blocked', 'The plinth and its lit slab'],
        C2: ['T junction: the east arm gives way to the octagon', 'Cantilevered crown tower'],
        A3: ['The octagon turns two 45° corners under the row-3 Z1 highway; escalators', 'Finned slab'],
        B3: ['Crossroads, then under the Z1 highway at 90° to the exit', 'Arcade on pilotis'],
        C3: ['The octagon turns two 45° corners; a cone closes the eastbound lane: cars pass across the centre line. Z1 highway and escalators', 'Twin slabs'] } },
    { id: 'monument', name: 'Monument', quota: P['world.district.monument.quota'], storeys: [6, 12], start: ['A1', 'west'],
      mood: 'Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument.',
      roads: [{ id: 'snake', pts: fil([[-200, 320], [2240, 320], [2240, 864], [2144, 960], [240, 960], [240, 1504], [336, 1600], [1120, 1600], [1280, 1760], [2600, 1760]]) }],
      split: { tile: 'B2' },
      decks: [{ hz: false, at: 560, z: 1 }, { hz: false, at: 1840, z: 2 }],
      tiles: {
        A1: ['Start, west edge. The road passes under the Z1 highway (north–south) at 90°; escalators', 'LED-wall tower facing the entry'],
        B1: ['A Z1 skybridge crosses the road at 90°, from a podium roof to the walkway ring', 'Podium and tower at the bridge head'],
        C1: ['Under the Z2 highway at 90°, then an R96 bend south; Z2 escalators (run 112)', 'LED drum tower in the bend'],
        A2: ['Under the Z1 highway at 90°, then an R96 bend south', 'Neon arcade along the road'],
        B2: ['The road splits round the monument\'s island; the walkway ring bridges both lanes at Z1; skybridge north', 'The monument'],
        C2: ['A 45° corner cut, then under the Z2 highway at 90°', 'Billboard mast'],
        A3: ['A 45° corner cut, then under the Z1 highway at 90°', 'Stacked LED cubes'],
        B3: ['A 45° jog between two LED walls', 'LED canyon'],
        C3: ['Under the Z2 highway at 90°; the exit through an LED gateway', 'LED gateway arch over the road'] } },
  ];
  const TILE = (c, r) => 'ABC'[c] + (r + 1);
  // ---------- traffic on one screen (the dummy away)
  function sceneSim(center, decks, deckLanes, lanes, busOK) {
    const s = new X.Sim('straight', { 'run.appearances.road': 2000 });
    s.level = Object.assign({}, s.level, { center, ring: null, lanes: lanes || X.lanesOf(center, P), statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain',
      decks: decks.map((d) => ({ hz: d.hz !== false, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), deckLanes });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {}; s.dispatchDrone = () => {};
    s.schedule = s.schedule.map((sl, j) => { const cls = X.fleetClass(P, 0.25, (j * 0.6180339887 + 0.53) % 1); return Object.assign({}, sl, { cls: cls === 'bus' && !busOK ? 'sedan' : cls }); }); // buses only where the road allows (Edit 50)
    const dc = s.deckCls.bind(s); s.deckCls = (n) => { const c = dc(n); return c === 'bus' && s.noDeckBus ? 'sedan' : c; };
    s.admissionInterval = () => 3.2;
    Object.assign(s.body, { x: -900, y: -900 }); s.fillDeckCars();
    return s;
  }
  let pieceSeq = 0;
  function labSim(geo, fleet, overrides) { // a lab sim on custom geometry (junctions, roundabouts): the P4 driver with give-way rules
    const key = 'mock' + (++pieceSeq); L.PIECES[key] = { name: key, params: [], build: () => geo };
    const s = L.makeSim(X, key, {}, { fleet, interval: 1.8, seconds: 60, seed: 11 + pieceSeq, overrides: overrides || {} });
    s.dispatchDrone = () => {};
    return s;
  }
  // arms out of a junction point J along each road through it (district polylines already clipped to the screen)
  function junctionArms(runs, J, majorId) {
    const arms = {}, major = [];
    for (const r of runs) {
      const pts = r.pts; let best = null;
      for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((J[0] - ax) * dx + (J[1] - ay) * dy) / l2)), d = hyp(ax + dx * t - J[0], ay + dy * t - J[1]); if (!best || d < best.d) best = { i, d }; }
      if (!best || best.d > 2) continue;
      const before = pts.slice(0, best.i).reverse().filter((p) => hyp(p[0] - J[0], p[1] - J[1]) > 1), after = pts.slice(best.i).filter((p) => hyp(p[0] - J[0], p[1] - J[1]) > 1);
      [before, after].forEach((side, k) => { if (side.length && hyp(side[side.length - 1][0] - J[0], side[side.length - 1][1] - J[1]) > 40) { const nm = r.id + k; arms[nm] = [J].concat(side); if (r.id === majorId) major.push(nm); } });
    }
    return { arms, major };
  }
  // ---------- a vertical highway (Edit 52): the game's deck sprite run north–south, lamps on both parapets
  function vDeck(off, z, roadOk, stairs) {
    const hgt = z === 2 ? P['world.highHeight'] : P['world.deckHeight'], dk = { hz: false, off, z, height: hgt, gaps: [], openings: stairs.map((st) => [st.y, st.y + st.h, st.side]) }, { S } = PIX.deck(dk, P);
    const Lr = new PIX.Buf(AW, AH), x0 = Math.round((off - HALF) / U), wpx = Math.round(2 * HALF / U), glow = mixK(K.deck2, K.white, 0.38);
    PIX.blit(Lr, S, x0, 0);
    for (let wy = P['world.deckLampSpacing'] / 2; wy < H; wy += P['world.deckLampSpacing']) for (const sd of [-1, 1]) { // paired lamps, poles rising screen-up from the parapet
      if (stairs.some((st) => st.side === sd && wy > st.y - 12 && wy < st.y + st.h + 12)) continue;
      const bx = sd < 0 ? x0 + 1 : x0 + wpx - 2, by = Math.round(wy / U), ix = sd < 0 ? x0 + 6 : x0 + wpx - 7;
      for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (Math.abs(i) + Math.abs(j) <= 2) Lr.put(ix + i, by + j, glow);
      for (let h = 1; h < PIX.LAMP_H; h++) { Lr.put(bx, by - h, K.jerseyTop); Lr.put(bx + 1, by - h, K.bldgOutline); }
      for (let i = -1; i <= 2; i++) { Lr.put(bx + i, by - PIX.LAMP_H + 1, i === 0 || i === 1 ? K.white : K.head); Lr.put(bx + i, by - PIX.LAMP_H, K.bldgOutline); }
    }
    return { dk, L: Lr, lift: 0, vert: true, cols: [], front: 9e5, inBand: (wx) => Math.abs(wx - off) < HALF + 12, shadeOn: (B) => {
      const k = P['proto.art.shadowScale'], ox = PIX.SUN.x * hgt * k / U, oy = PIX.SUN.y * hgt * k / U;
      each((x, y, wx) => { if (Math.abs(wx - off) <= HALF) return; for (const t of [0.5, 1]) { const sx = (x - ox * t + 0.5) * U; if (Math.abs(sx - off) <= HALF) { B.shade(x, y, 0.72); break; } } });
    } };
  }
  function vEscalators(off, z) { // west side at the north end, east side at the south end
    const run = X.stairRun(P, 0, z);
    return [{ x: off - HALF - run, y: INSET, w: run, h: SWD, axis: 'x', low: off - HALF - run, high: off - HALF, side: -1, z },
      { x: off + HALF, y: H - INSET - SWD, w: run, h: SWD, axis: 'x', low: off + HALF + run, high: off + HALF, side: 1, z }];
  }
  // ---------- landmark art (each district its own kit: water and gardens; brutalist concrete; LED and neon)
  function waterBlock(B, x0, y0, x1, y1, k, base, h) { // a pool raised on a concrete step
    const fp = chamf(Math.round(x0), Math.round(y0), Math.round(x1), Math.round(y1), k);
    mass(B, fp, x0, y0, x1, y1, base, h, 'conc', null, base === 0);
    for (let y = Math.round(y0); y <= y1; y++) for (let x = Math.round(x0); x <= x1; x++) if (fp(x, y, 2)) B.put(x, y - base - h, (y % 4 === 0 && (x * 5 + y) % 11 < 4) ? N.water2 : (x * 3 + y * 7) % 89 === 0 ? N.cyan : N.water);
  }
  function poolFP(B, fp) { // a reflecting pool from a footprint test in world units: coping, shadowed wall, water
    each((x, y, wx, wy) => {
      if (!fp(wx, wy, -6)) return;
      if (!fp(wx, wy, 0)) B.put(x, y, CON.l);
      else if (!fp(wx, wy, 4)) B.put(x, y, CON.d);
      else { let c = N.water; if (y % 4 === 0 && ((x * 5 + y) % 11) < 4) c = N.water2; if ((x * 3 + y * 7) % 97 === 0) c = LEDS[(x + y) % LEDS.length]; B.put(x, y, c); }
    });
  }
  function ledPanel(S, H0, cols) { // an LED screen over the lower part of a building sprite's front face
    const top = S.h - Math.round(H0 * 0.85), bot = S.h - 4;
    for (let y = top; y < bot; y++) for (let x = 3; x < S.w - 4; x++) { const c = S.d[y * S.w + x]; if (!c) continue; S.d[y * S.w + x] = (y === top || y === bot - 1 || x === 3 || x === S.w - 5) ? K.bldgOutline : mixK(cols[Math.floor((x + y * 0.5) / 6) % cols.length], K.white, ((x + y) % 7 === 0) ? 0.4 : 0); }
    return S;
  }
  function drum(rx, ry, H0, led) { // an LED drum tower: elliptical plan, bands of light
    const pad = 2, S = { w: rx * 2 + 2 * pad + 1, h: ry * 2 + H0 + 6, ox: rx + pad, oy: ry + H0 + 3 }; S.d = new Uint32Array(S.w * S.h);
    const put = (x, y, c) => { const X0 = x + S.ox, Y0 = y + S.oy; if (X0 >= 0 && Y0 >= 0 && X0 < S.w && Y0 < S.h) S.d[Y0 * S.w + X0] = c; };
    for (let x = -rx; x <= rx; x++) { const yb = Math.round(ry * Math.sqrt(Math.max(0, 1 - (x * x) / (rx * rx)))), u = x / rx; for (let z = 0; z < H0; z++) put(x, yb - z, z % 5 === 4 ? led : (z % 5 === 1 && (x + z) % 9 === 0) ? K.white : u < -0.5 ? CON.d : u > 0.4 ? CON.l : CON.m); }
    for (let y = -ry; y <= ry; y++) for (let x = -rx; x <= rx; x++) if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1) put(x, y - H0, (x * x) / (rx * rx) + (y * y) / (ry * ry) > 0.7 ? led : CON.t);
    return S;
  }
  function billboard(B, ax, ay, w, h, legs, led) { // a lit board on legs (art px; anchored at the foot centre)
    const x0 = Math.round(ax - w / 2), y0 = Math.round(ay);
    for (const lx of [x0 + 2, x0 + w - 3]) for (let z = 0; z < legs; z++) B.put(lx, y0 - z, CON.l);
    for (let z = legs; z < legs + h; z++) for (let x = x0; x <= x0 + w; x++) B.put(x, y0 - z, z === legs || z === legs + h - 1 || x === x0 || x === x0 + w ? K.bldgOutline : (Math.floor((x - x0) / 4) + Math.floor(z / 3)) % 3 === 0 ? mixK(led, K.white, 0.45) : led);
    for (let t = 0; t < legs; t++) for (let x = x0; x <= x0 + w; x++) B.shade(x - t * 0.7, y0 + t * 0.7, 0.8);
  }
  // ---------- one screen
  function buildScreen(D, col, row) {
    const name = TILE(col, row), ox = col * W, oy = row * H, rng = PIX.rng(1000 + col * 37 + row * 101 + D.id.length * 7), plan = D.tiles[name];
    const sc = { D, name, col, row, props: [], layers: [], tops: [], note: plan[0] + '. Landmark: ' + plan[1] + '.', stairs: [], reserve: [] };
    for (const rb of [D.roundabout, D.ring]) if (rb && rb.arms.length < P['world.roundaboutMinArms']) console.warn('a roundabout with too few arms', D.id); // Edit 52
    const runs = [];
    for (const r of D.roads) { const run = clipRun(shift(r.pts, -ox, -oy), -200, -200, W + 200, H + 200); if (run) runs.push({ id: r.id, pts: run }); }
    const decks = D.decks.map((d) => ({ hz: d.hz, z: d.z, off: d.hz ? d.at - oy : d.at - ox })).filter((d) => d.off > -HALF && d.off < (d.hz ? H : W) + HALF);
    const hDecks = decks.filter((d) => d.hz), vDecks = decks.filter((d) => !d.hz);
    const groundDecks = D.ring && D.ring.tile === name ? [] : hDecks;
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: groundDecks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, extra || {});
    const J = (D.junctions || []).find((j) => j.tile === name);
    let ground, roadD, sims = [], center = runs.length ? runs[0].pts : [[-900, -900], [-850, -900]], lanes = null, busOK = runs.every((r) => X.minBend(r.pts, W, H) >= RB), patches = [];
    if (D.id === 'circus' && name === 'C1') patches = [[480, 520], [512, 552], [448, 584], [544, 496], [480, 608]].map(([x, y]) => ({ x, y, w: 32, h: 32, kind: 'puddle' })); // a flooded corner
    // ground roads and their traffic
    if (D.roundabout && D.roundabout.tile === name) { // a ground roundabout: every route, give way at entry, the inner lane for orbiting (Edit 52)
      const geo = L.multiRoundabout(X, P, D.roundabout.arms, R96), s = labSim(geo, 'nobus', {});
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops.map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })), decks: [] }), P, 23);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (J) { // a junction at 90° or 45°: the minor road gives way (Edit 49.3)
      const { arms, major } = junctionArms(runs, J.at, J.major), geo = L.junction(X, P, arms, major, P['world.junctionTurnRadius']), s = labSim(geo, 'nobus', {});
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops.map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })), patches }), P, 29 + col * 7 + row * 13);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.split && D.split.tile === name) {
      const sp = splitRoad(320); center = [[-200, 320], [W + 200, 320]]; lanes = [X.makePath(sp.E), X.makePath(sp.Wl)]; busOK = false; sc.split = sp;
      ground = PIX.ground(lvl([[-900, -900], [-850, -900]]), P, 41);
      tiles(ground, () => true, false);
      const m = paintSplit(ground, sp.E, sp.Wl); roadD = (k) => LW - m[k];
    } else {
      ground = PIX.ground(lvl(center, { arms: runs.length > 1 ? runs.map((r) => r.pts) : undefined, surfaces: runs.length > 1 ? [] : undefined, patches }), P, 31 + col * 7 + row * 13);
      if (runs.length > 1) lanes = [].concat(...runs.map((r) => X.lanesOf(r.pts, P)));
      const rf = PIX.roadField(runs.map((r) => ({ pts: r.pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    }
    const B = ground; sc.B = B;
    const rd = (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH ? roadD(k) : 1e9; };
    const roadOk = (wx, wy, m) => rd(wx, wy) > (m || OUTER + 4);
    // highways, each with its two escalators
    let ringSim = null;
    if (D.ring && D.ring.tile === name) { // the Z1 ring (Parkland): a four-arm roundabout lifted onto the deck
      const ov = { 'world.roundaboutRadius': P['world.deckRingRadius'] }, Pr = Object.assign({}, P, ov), geo = L.multiRoundabout(X, Pr, D.ring.arms, R96);
      ringSim = labSim(geo, 'nobus', ov); sc.ringSim = ringSim;
      const cx = 400, cy = 320, Rc = P['world.deckRingRadius'];
      sc.stairs = escalators(cy, 1, HALF);
      const rr = { geoms: [{ pts: geo.ring.concat([geo.ring[0]]), dash: true }].concat(geo.arms.map((pts) => ({ pts, dash: true })), geo.roads.map((pts) => ({ pts }))) };
      const ringDeck = ringLayer(rr, 1, cx, cy, Rc, (x, y) => !roadOk(x, y, OUTER + C + 4) || sc.stairs.some((st) => x > st.x - C && x < st.x + st.w + C && Math.abs(y - st.y - st.h / 2) < st.h / 2 + HALF), sc.stairs.map((st) => [st.x + 2, st.x + st.w - 2, st.side]));
      ringDeck.front = 1e5; ringDeck.extend = true; ringDeck.cars = () => ringSim.cars.concat((sc.seam || []).filter((g) => g.deck)); // P5.3: and highway cars arriving from next door
      sc.layers.push(ringDeck); sc.ringDeck = ringDeck;
    } else {
      for (const d of hDecks) { const st = escalators(d.off, d.z, HALF); sc.stairs.push(...st); sc.layers.push(straightDeck(d.off, d.z, roadOk, st)); }
      for (const d of vDecks) { const st = vEscalators(d.off, d.z); sc.stairs.push(...st); sc.layers.push(vDeck(d.off, d.z, roadOk, st)); }
    }
    for (const st of sc.stairs) { sc.props.push(stairProp(st, st.z === 2 ? Z2 : Z1)); const fx = st.axis === 'x' ? (st.side < 0 ? st.x : st.x + st.w) : st.x + SWD / 2, fy = st.axis === 'x' ? st.y + st.h / 2 : (st.side > 0 ? st.y + st.h : st.y); if (rd(fx, fy) < LW) console.warn('escalator foot in a lane', D.id, name); }
    const blocked = sc.stairs.map((st) => [st.x - 24, st.y - 24, st.w + 48, st.h + 48]);
    const underDeck = (wx, wy) => sc.layers.some((l) => l.inBand(wx, wy));
    const inRects = (rs, wx, wy, m) => rs.some((r) => wx > r[0] - m && wx < r[0] + r[2] + m && wy > r[1] - m && wy < r[1] + r[3] + m);
    const free = (wx, wy, m) => roadOk(wx, wy, OUTER + (m || 24)) && !underDeck(wx, wy) && !inRects(blocked, wx, wy, 0) && !inRects(sc.reserve, wx, wy, 0);
    // ---- the district's kit
    if (D.id === 'parkland') parkTile(sc, B, name, roadOk, free, rng, runs);
    else if (D.id === 'circus') circusTile(sc, B, name, roadOk, free, rng, labSimOf(sc), runs);
    else monumentTile(sc, B, name, roadOk, free, rng, runs);
    for (const l of sc.layers) if (l.shadeOn) l.shadeOn(B);
    // traffic
    if (!sc.lab) {
      const dl = X.deckLanesOf(sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off })), P);
      const s = sceneSim(center, sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), dl, lanes, busOK);
      s.level.patches = patches; s.noDeckBus = D.id === 'parkland';
      if (sc.cones) { s.cones = sc.cones.map(([x, y], i) => ({ id: 'cone' + i, x, y, hx: x, hy: y, vx: 0, vy: 0, state: 'free', flightT: 0, flightDur: 1 })); s.dispatchDrone = X.Sim.prototype.dispatchDrone; } // Edit 53: as in the game, a car held at a knocked cone calls a FARSIGHT drone, which sets the cone back
      sims.push(s); sc.main = s;
    } else if (sc.layers.some((l) => l.dk)) { // a junction screen under a highway: the highway's own traffic
      const ls = sc.layers.filter((l) => l.dk), s = sceneSim([[-900, -900], [-850, -900]], ls.map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), X.deckLanesOf(ls.map((l) => ({ hz: l.dk.hz, off: l.dk.off })), P), [], false);
      s.schedule = []; sims.push(s); sc.deckOnly = s;
    }
    if (ringSim) sims.push(ringSim);
    sc.sims = sims;
    return sc;
  }
  const labSimOf = (sc) => sc.lab;
  // ---------- Parkland: gardens, water, the Z1 ring
  function parkTile(sc, B, name, roadOk, free, rng, runs) {
    const okP = (wx, wy) => roadOk(wx, wy, OUTER);
    gardenPave(B, okP, null);
    const R = sc.reserve, led = (i) => LEDS[i % LEDS.length];
    if (name === 'B2') { // pools under the ring, cut at 45° along the boulevard (x − y = 80 in B2)
      const side = (wx, wy, s0, m) => s0 * (wx - wy - 80) / Math.SQRT2 > OUTER + 16 + (m || 0);
      const ne = (wx, wy, ins) => chamf(440, 56, 760, 300, 40)(wx, wy, ins) && side(wx, wy, 1, ins), sw = (wx, wy, ins) => chamf(40, 340, 360, 584, 40)(wx, wy, ins) && side(wx, wy, -1, ins);
      poolFP(B, ne); poolFP(B, sw); R.push([430, 46, 340, 264], [30, 330, 340, 264]);
    }
    if (name === 'A1') R.push([24, 300, 300, 280]);
    if (name === 'B1') R.push([150, 24, 160, 560]);
    if (name === 'C1') R.push([440, 120, 240, 160], [0, 280, 440, 80]);
    if (name === 'A2') R.push([500, 416, 300, 72]);
    if (name === 'C2') R.push([40, 440, 340, 190]);
    if (name === 'A3') R.push([500, 24, 280, 200]);
    if (name === 'B3') R.push([90, 430, 200, 190]);
    if (name === 'C3') R.push([420, 100, 200, 140]);
    gardenBeds(B, { bedOk: (wx, wy) => free(wx, wy, 8), diag: null, rng, leds: LEDS, pools: name !== 'B2' });
    gardenSculptures(B, (wx, wy) => free(wx, wy, 16), null, rng, 2);
    const u = (v) => v / U;
    if (name === 'A1') for (let i = 0; i < 3; i++) waterBlock(B, u(40 + i * 40), u(320 + i * 50), u(300 - i * 20), u(560), 8, 6 - i * 3, 3); // reservoir terraces, stepping down to the south
    if (name === 'B1') for (let i = 0; i < 5; i++) waterBlock(B, u(170), u(40 + i * 108), u(290), u(124 + i * 108), 6, 14 - i * 3, 3); // cascade, falling south beside the highway
    if (name === 'C1') { // footbridge over the avenue (x = 160) at Z1, escalators at both ends; a lantern pavilion
      const run = X.stairRun(P, 0, 1), esc = [{ x: 24, y: 336, w: SWD, h: run, axis: 'y', low: 336 + run, high: 336, side: 1, z: 1 }, { x: 420, y: 304, w: run, h: SWD, axis: 'x', low: 420 + run, high: 420, side: 0, z: 1 }];
      const wl = walkwayLayer([[[24, 304], [420, 304], [420, 336], [24, 336]]], [], esc.map((st) => [st.x, st.y, st.w, st.h]), () => true);
      for (const st of esc) sc.props.push(stairProp(st, Z1));
      wl.cols = [[60, 320], [300, 320]].map(([x, y]) => ({ cx: x, cy: y, key: y + 8, x: x - 8, y: y - 8, spr: PIX.column(4, 4, Z1) }));
      wl.front = 9e5; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B);
      block(B, u(480), u(150), u(640), u(250), 4, 0, 10, 'conc', LEDS[0], true); block(B, u(500), u(165), u(620), u(235), 3, 10, 2, 'grass', LEDS[3 % LEDS.length], false);
    }
    if (name === 'A2') poolFP(B, (wx, wy, ins) => chamf(510, 424, 800 + 40, 480, 8)(wx, wy, ins)); // canal along the highway
    if (name === 'C2') for (let i = 0; i < 4; i++) block(B, u(60 + i * 24), u(460 + i * 32), u(360 - i * 24), u(620), 10, 0, 3 + i * 3, i === 3 ? 'grass' : 'conc', i === 0 ? LEDS[0] : null, i === 0); // amphitheatre terraces
    if (name === 'A3') for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) monolith(B, u(530 + i * 66), u(60 + j * 60), 0, 14 + ((i + j) % 3) * 5, led(i + j)); // monolith orchard
    if (name === 'B3') { tiles(B, (wx, wy) => wx > 100 && wx < 280 && wy > 440 && wy < 610 && roadOk(wx, wy, OUTER), true); sculpture(B, u(190), u(560), 'obelisk', LEDS[0]); sculpture(B, u(130), u(500), 'ring', led(2)); sculpture(B, u(250), u(500), 'ring', led(2)); }
    if (name === 'C3') { tiles(B, (wx, wy) => wx > 430 && wx < 610 && wy > 110 && wy < 230 && roadOk(wx, wy, OUTER), true); for (const [x, k] of [[460, 'cubes'], [520, 'arch'], [580, 'fins']]) sculpture(B, u(x), u(200), k, led(x)); }
  }
  // ---------- Circus: brutalist towers, the octagon, the roundabout
  function circusTile(sc, B, name, roadOk, free, rng, lab, runs) {
    const u = (v) => v / U, put = (x, y, w, h, st, style, cut, rear, i) => { const Hh = st * STY; brutalShadow(B, u(x), u(y), u(w), u(h), Math.round(Hh * 0.55), cut); sc.props.push({ spr: brutal(u(w), u(h), Hh, PIX.rng(311 + i * 17 + sc.col * 7 + sc.row * 3), LEDS[(i + sc.col + sc.row) % LEDS.length], cut, rear, style), x: u(x), y: u(y), by: y + h }); sc.reserve.push([x, y, w, h]); };
    if (name === 'B2') { // the island: a stepped concrete plinth, a lawn tier, a slab with a lit slot and a halo
      const Rc = P['world.roundaboutRadius'], ci = Rc - OUTER - 2;
      each((x, y, wx, wy) => { const d = hyp(wx - 400, wy - 320); if (d < ci) B.put(x, y, d > ci - 4 ? CON.l : (x % 8 === 0 || y % 8 === 0) ? CON.d : CON.t); });
      const ax = 400 / U, ay = 320 / U, led = LEDS[3 % LEDS.length];
      block(B, ax - 26, ay - 20, ax + 26, ay + 20, 12, 0, 4, 'conc', null, true); block(B, ax - 18, ay - 13, ax + 18, ay + 13, 8, 4, 4, 'grass', led, false); block(B, ax - 9, ay - 6, ax + 9, ay + 6, 4, 8, 3, 'conc', LEDS[0], false);
      for (let t = 0; t < 46; t++) for (let j = -2; j <= 2; j++) B.shade(ax - t * 0.7 + j * 0.7 - 10, ay + t * 0.7 + j * 0.7 + 4, 0.8);
      block(B, ax - 3, ay - 1, ax + 3, ay + 1, 0, 11, 40, 'conc', null, false); for (let t = 4; t < 36; t++) B.put(ax, ay + 1 - 11 - t, led);
      for (let a = 0; a < 48; a++) { const th = a / 48 * Math.PI * 2, hx = Math.round(ax + Math.cos(th) * 10), hy = Math.round(ay - 40 + Math.sin(th) * 3); if (Math.sin(th) > 0 || Math.abs(Math.cos(th)) > 0.3) B.put(hx, hy, a % 6 < 4 ? N.cyan : K.white); }
      const rz = PIX.roadField(lab.lab.geo.roads.map((pts) => ({ pts, dash: false })), LW + 2);
      each((x, y, wx, wy, k) => { if (rz.D[k] > LW - 4) return; const zx = Math.abs(wx - 400) < LW && (Math.abs(wy - 36) < 16 || Math.abs(wy - 604) < 16) && Math.floor(wx / 8) % 2 === 0, zy = Math.abs(wy - 320) < LW && (Math.abs(wx - 70) < 16 || Math.abs(wx - 730) < 16) && Math.floor(wy / 8) % 2 === 0; if (zx || zy) B.put(x, y, K.lane); });
      [[8, 8, 200, 120, 'se', 'n', 12, 'ziggurat'], [592, 8, 200, 120, 'sw', 'n', 14, 'cantilever'], [8, 512, 200, 120, 'ne', 's', 10, 'twin'], [592, 512, 200, 120, 'nw', 's', 9, 'slab']].forEach(([x, y, w, h, c, rear, st, sty], i) => put(x, y, w, h, st, sty, { c, k: 40 }, rear, i));
      return;
    }
    if (name === 'A1') { put(40, 40, 360, 300, 13, 'ziggurat', { c: 'se', k: 60 }, 'n', 1); sc.cones = [[700, 452], [660, 452], [620, 452]]; } // roadworks: one lane coned off
    if (name === 'B1') put(200, 24, 400, 300, 14, 'twin', null, 'n', 2);
    if (name === 'C1') put(420, 40, 340, 300, 12, 'ziggurat', { c: 'sw', k: 60 }, 'n', 3);
    if (name === 'A2') { put(40, 24, 320, 200, 9, 'slab', null, 'n', 4); billboard(B, u(230), u(600), u(240), 26, 12, LEDS[3 % LEDS.length]); sc.reserve.push([100, 440, 260, 180]); }
    if (name === 'C2') put(440, 24, 340, 210, 14, 'cantilever', null, 'n', 5);
    if (name === 'A3') put(40, 240, 340, 60, 4, 'slab', null, 'n', 6);
    if (name === 'B3') put(520, 0, 260, 60, 3, 'slab', null, 'n', 7);
    if (name === 'C3') { put(440, 240, 320, 60, 4, 'twin', null, 'n', 8); sc.cones = [[110, 188]]; } // a cone closes one lane (Edit 53: the three-cone chicane could not be passed either way, and with traffic continuous it jammed the octagon)
    // further blocks: big first, then infill; corners nearest a street cut at 45°
    const placed = [], [s0, s1] = sc.D.storeys;
    for (let t = 0; t < 900 && placed.length < 6; t++) {
      const big = t < 450, w = (big ? 192 : 112) + Math.floor(rng() * (big ? 9 : 5)) * 16, h = (big ? 144 : 96) + Math.floor(rng() * (big ? 7 : 4)) * 16, x = 8 + Math.floor(rng() * ((W - 16 - w) / 16)) * 16, y = 8 + Math.floor(rng() * ((H - 16 - h) / 16)) * 16;
      const pts = []; for (let i = 0; i <= w; i += 16) for (let j = 0; j <= h; j += 16) pts.push([x + i, y + j]);
      const deckClear = (py) => sc.layers.some((l) => l.dk && l.dk.hz && py > l.dk.off - HALF - 12 && py < l.dk.off + HALF + P['world.deckBottomClear']);
      if (!pts.every(([px, py]) => free(px, py, 16) && !deckClear(py)) || placed.some((q) => x < q.x + q.w + 16 && x + w + 16 > q.x && y < q.y + q.h + 16 && y + h + 16 > q.y)) continue;
      placed.push({ x, y, w, h });
    }
    placed.forEach((q, i) => { const st = s0 + Math.floor(rng() * (s1 - s0 + 1)); put(q.x, q.y, q.w, q.h, st, null, null, 'n', 20 + i); });
  }
  // ---------- Monument: LED commerce, the snake road, two north–south highways, the walkway ring
  function monumentTile(sc, B, name, roadOk, free, rng, runs) {
    const u = (v) => v / U, R = sc.reserve, bld = (x, y, w, h, st, i, panel) => { let S = PIX.building(Math.round(u(w)), Math.round(u(h)), st * EXT(P['world.storeyHeight']), PIX.rng(700 + i * 31 + sc.col * 7 + sc.row * 3), LEDS[(i + sc.col + sc.row) % LEDS.length], st); if (panel) S = ledPanel(S, st * EXT(P['world.storeyHeight']), [N.magenta, N.cyan, LEDS[2 % LEDS.length]]); sc.props.push({ spr: S, x: u(x), y: u(y), by: y + h }); R.push([x, y, w, h]); };
    if (name === 'B2') return monumentCentre(sc, B, roadOk);
    if (name === 'A1') bld(40, 24, 240, 180, 12, 1, true); // LED-wall tower facing the entry
    if (name === 'B1') { // the skybridge from a podium roof south over the road to the walkway ring
      const pod = [300, 16, 200, 140];
      sc.props.push({ spr: PIX.building(Math.round(u(pod[2])), Math.round(u(pod[3])), Z1, PIX.rng(77), LEDS[1], 1), x: u(pod[0]), y: u(pod[1]), by: pod[1] + pod[3], podium: true });
      sc.props.push({ spr: PIX.building(Math.round(u(120)), Math.round(u(70)), 10 * EXT(P['world.storeyHeight']), PIX.rng(78), LEDS[2 % LEDS.length], 10), x: u(310), y: u(20) - Z1, by: 90, tower: true });
      const poly = [[386, 140], [414, 140], [414, H + 40], [386, H + 40]]; poly.spine = [[400, 160], [400, H]];
      const wl = walkwayLayer([poly], [pod], [], (x, y) => roadOk(x, y, OUTER));
      wl.front = 1e6; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B); R.push([290, 0, 220, 170]);
    }
    if (name === 'C1') { const S = drum(28, 14, 12 * EXT(P['world.storeyHeight']), N.cyan); sc.props.push({ spr: S, x: u(450), y: u(540), by: 570 }); R.push([380, 480, 140, 110]); } // LED drum in the bend
    if (name === 'A2') { bld(656, 416, 136, 96, 3, 2, true); bld(336, 430, 128, 80, 3, 5, true); } // neon arcades either side of the highway, south of the road
    if (name === 'C2') { billboard(B, u(480), u(560), 60, 30, 40, N.magenta); R.push([420, 480, 140, 100]); }
    if (name === 'A3') { sculpture(B, u(700), u(560), 'cubes', N.cyan); sculpture(B, u(760), u(500), 'cubes', N.magenta); sculpture(B, u(700), u(440), 'cubes', LEDS[2 % LEDS.length]); R.push([650, 380, 150, 220]); }
    if (name === 'B3') { bld(40, 440, 240, 120, 6, 3, true); bld(520, 140, 260, 110, 6, 4, true); } // the LED canyon either side of the jog
    if (name === 'C3') { // an LED gateway arch over the road: pylons either side, a lit beam above the traffic
      const ax = 560, top = 400 - 24, bot = 560 + 24, Hh = 40;
      const Lr = new PIX.Buf(AW, AH);
      for (const py of [top, bot]) for (let z = 0; z < Hh; z++) for (let i = -2; i <= 2; i++) Lr.put(u(ax) + i, u(py) - z, i < 0 ? CON.d : i > 0 ? CON.l : CON.m);
      for (let y = u(top) - Hh; y <= u(bot) - Hh; y++) for (let i = -3; i <= 3; i++) Lr.put(u(ax) + i, y, Math.abs(i) === 3 ? K.bldgOutline : (y + i) % 4 < 2 ? N.magenta : N.cyan);
      sc.layers.push({ L: Lr, lift: 0, cols: [], front: 1e6 + 5, inBand: () => false, gate: true });
    }
    // further blocks: commerce with LED façades
    const placed = [], [s0, s1] = sc.D.storeys;
    for (let t = 0; t < 900 && placed.length < 8; t++) {
      const big = t < 450, w = (big ? 128 : 64) + Math.floor(rng() * (big ? 7 : 5)) * 16, h = (big ? 96 : 64) + Math.floor(rng() * (big ? 5 : 3)) * 16, x = 8 + Math.floor(rng() * ((W - 16 - w) / 16)) * 16, y = 8 + Math.floor(rng() * ((H - 16 - h) / 16)) * 16;
      const pts = []; for (let i = 0; i <= w; i += 16) for (let j = 0; j <= h; j += 16) pts.push([x + i, y + j]);
      if (!pts.every(([px, py]) => free(px, py, 16)) || placed.some((q) => x < q.x + q.w + 16 && x + w + 16 > q.x && y < q.y + q.h + 16 && y + h + 16 > q.y)) continue;
      placed.push({ x, y, w, h });
    }
    placed.forEach((q, i) => bld(q.x, q.y, q.w, q.h, s0 + Math.floor(rng() * (s1 - s0 + 1)), 10 + i, i % 3 === 0));
  }
  function monumentCentre(sc, B, roadOk) {
    const cx = 400, cy = 320, A = P['world.walkwayRingHalf'], w = P['world.walkwayWidth'], k = P['world.walkwayRingChamfer'], ki = k - 0.586 * w, Lk = P['world.walkwayLinkLength'];
    const sq = (a, kk) => [[cx - a + kk, cy - a], [cx + a - kk, cy - a], [cx + a, cy - a + kk], [cx + a, cy + a - kk], [cx + a - kk, cy + a], [cx - a + kk, cy + a], [cx - a, cy + a - kk], [cx - a, cy - a + kk]];
    const outerP = sq(A, k), innerP = sq(A - w, ki), dCut = (2 * A - k) / 2, dFace = dCut + Lk / Math.SQRT2;
    const ringQuads = outerP.map((p, i) => [p, outerP[(i + 1) % 8], innerP[(i + 1) % 8], innerP[i]]);
    const mid = sq(A - w / 2, k - 0.293 * w); ringQuads[0].spine = mid.concat([mid[0]]);
    const diag = (sx, sy) => { const d0 = (2 * A - k - 1.414 * w) / 2, d2 = dFace + 40 / Math.SQRT2, nx = -sy * Math.SQRT1_2 * w / 2, ny = sx * Math.SQRT1_2 * w / 2, a = [cx + sx * d0, cy + sy * d0], b = [cx + sx * d2, cy + sy * d2];
      const q = [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]; q.spine = [[cx + sx * dCut, cy + sy * dCut], [cx + sx * dFace, cy + sy * dFace]]; return q; };
    const fx = Math.round(cx - dFace), fyN = Math.ceil(cy - dFace + 0.707 * w + 6), fyS = Math.floor(cy + dFace - 0.707 * w - 6);
    const podiums = [[16, 8, fx - 16, fyN - 8], [W - fx, 8, fx - 16, fyN - 8], [16, fyS, fx - 16, H - 8 - fyS], [W - fx, fyS, fx - 16, H - 8 - fyS]];
    const run = X.stairRun(P, 0, 1);
    const esc = [{ x: cx - A + k + 8, y: cy - A - run, w: SWD, h: run, axis: 'y', low: cy - A - run, high: cy - A, side: -1, z: 1 },
      { x: cx + A - k - 8 - SWD, y: cy + A, w: SWD, h: run, axis: 'y', low: cy + A + run, high: cy + A, side: 1, z: 1 },
      { x: cx - A + w, y: cy - SWD / 2, w: run, h: SWD, axis: 'x', low: cx - A + w + run, high: cx - A + w, side: 0, z: 1 },
      { x: cx + A - w - run, y: cy - SWD / 2, w: run, h: SWD, axis: 'x', low: cx + A - w - run, high: cx + A - w, side: 0, z: 1 }];
    const sp = sc.split, fE = PIX.roadField([{ pts: sp.E }], 120), fW = PIX.roadField([{ pts: sp.Wl }], 120);
    const laneD = (x, y) => { const kk = Math.floor(y / U) * AW + Math.floor(x / U); return Math.min(fE.D[kk], fW.D[kk]); };
    const sky = [[386, -40], [414, -40], [414, cy - A + 8], [386, cy - A + 8]]; // the skybridge from B1 joins the ring's north side
    const wl = walkwayLayer(ringQuads.concat([diag(-1, -1), diag(1, -1), diag(-1, 1), diag(1, 1), sky]), podiums, esc.map((s) => [s.x, s.y, s.w, s.h]), (x, y) => laneD(x, y) > LW / 2 + 14);
    sc.layers.push(wl); sc.walk = wl;
    const okP = (wx, wy) => roadOk(wx, wy, OUTER) && wx > fx + 8 && wx < W - fx - 8;
    tiles(B, okP, true);
    each((x, y, wx, wy) => { if (!roadOk(wx, wy, OUTER) || wx < 150 || wx > W - 150 || Math.abs(wy - cy) > P['world.splitLaneOffset']) return; B.put(x, y, (x % 8 === 0 || y % 8 === 0) ? CON.m : ((x + y) % 16 === 0 ? CON.l : ISL)); });
    planter(B, 540, 96, 48, 26, 'monolith', LEDS[0]); planter(B, 280, 552, 48, 26, 'tiers', LEDS[3 % LEDS.length]);
    for (const [sx, sy, kind] of [[250, 60, 'arch'], [400, 600, 'fins'], [330, 372, 'cubes'], [470, 372, 'ring']]) sculpture(B, sx / U, sy / U, kind, LEDS[(sx + sy) % LEDS.length]);
    for (const st of esc) sc.props.push(stairProp(st, Z1));
    sc.stairs = esc;
    podiums.forEach(([x, y, pw, ph], i) => sc.props.push({ spr: PIX.building(Math.round(pw / U), Math.round(ph / U), Z1, PIX.rng(91 + i * 13), LEDS[(i + 1) % LEDS.length], 1), x: x / U, y: y / U, by: y + ph, podium: true }));
    [[16, 8, 96, 56], [W - 112, 8, 96, 56], [16, fyS, 96, 64], [W - 112, fyS, 96, 64]].forEach(([x, y, tw, th], i) => sc.props.push({ spr: PIX.building(Math.round(tw / U), Math.round(th / U), (7 + i * 2) * EXT(P['world.storeyHeight']), PIX.rng(57 + i * 29), LEDS[(i + 2) % LEDS.length], 7 + i * 2), x: x / U, y: y / U - Z1, by: y + th, tower: true }));
    sc.monument = { cx, cy };
  }
  // ---------- P5.3 (Edit 53): one traffic for the district. Every screen's sims link at the seams.
  // A car whose centre crosses a shared edge moves to the next screen's lane that starts there, keeping its id, model,
  // speed and plan; at a junction or roundabout screen it picks its route there. Cars within world.spawnLeadIn of a seam
  // are seen next door (drivers follow them) and drawn on both screens. Cars enter only where a road or highway crosses
  // the district boundary; the district runs traffic.warmSeconds before it is shown, so no screen waits for cars.
  const NETS = [], SIDE = X.SIDE, OPPS = { N: 'S', S: 'N', E: 'W', W: 'E' }, GL = P['world.spawnLeadIn'];
  const hashId = (id) => { let h = 2166136261; for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619); return h >>> 0; };
  function linkDistrict(i, scs) {
    const recs = [], at = (c, r) => scs.find((q) => q.col === c && q.row === r), admit0 = X.Sim.prototype.admit;
    for (const sc of scs) for (const s of sc.sims) {
      s.netLane = new Map();
      const ring = s === sc.ringSim, nc = s.newCar.bind(s);
      s.newCar = (id, ...a) => nc(sc.D.id + '·' + sc.name + '·' + id, ...a); // ids unique across the district
      for (const c of s.cars) c.id = sc.D.id + '·' + sc.name + '·' + c.id;
      const add = (r) => { Object.assign(r, { sc, s, ends: X.laneEnds(r.path, W, H), next: [], prev: [] }); s.netLane.set(r.path, r); recs.push(r); };
      s.level.lanes.forEach((path, k) => add({ i: k, path, simLayer: 0, layer: ring ? 1 : 0, deck: null })); // the Z1 ring's lab sim runs its routes as ground
      (s.level.deckLanes || []).forEach((ln, j) => { const z = (s.level.decks[ln.deck] && s.level.decks[ln.deck].z) || 1; add({ i: 2 + j, path: ln.path, simLayer: z, layer: z, deck: ln.deck }); });
    }
    for (const a of recs) {
      const o = a.ends.out, nb = o && at(a.sc.col + SIDE[o.side][0], a.sc.row + SIDE[o.side][1]);
      if (!nb) continue;
      for (const b of recs) if (b.sc === nb && b.layer === a.layer && b.ends.in && b.ends.in.side === OPPS[o.side] && Math.abs(b.ends.in.off - o.off) < 6 && b.ends.in.tx * o.tx + b.ends.in.ty * o.ty > 0.9) { a.next.push(b); b.prev.push(a); }
    }
    const outside = (sc, e) => !at(sc.col + SIDE[e.side][0], sc.row + SIDE[e.side][1]);
    // seams to the nearest way out of the district, for drivers heading home (traffic.exitAfterSeams)
    for (const r of recs) r.toExit = !r.next.length ? 0 : Infinity;
    for (let changed = true; changed;) { changed = false; for (const r of recs) for (const q of r.next) if (q.toExit + 1 < r.toExit) { r.toExit = q.toExit + 1; changed = true; } }
    for (const sc of scs) for (const s of sc.sims) { // admission only where a lane enters from outside the district
      const src = recs.filter((r) => r.s === s && !r.prev.length && r.ends.in && outside(sc, r.ends.in)), gs = src.filter((r) => r.deck == null).map((r) => r.i);
      s.deckSrc = new Set(src.filter((r) => r.deck != null).map((r) => r.i - 2));
      s.admit = function () { if (!gs.length) return; const sl = this.schedule[this.slot]; if (!sl) return; if (!gs.includes(sl.lane)) sl.lane = gs[sl.i % gs.length]; return admit0.call(this); };
      const arms = new Set(src.filter((r) => r.deck == null).map((r) => r.ends.in.side + Math.round(r.ends.in.off))).size, iv = 2 * P['world.district.' + sc.D.id + '.interval'] / Math.max(1, arms);
      s.admissionInterval = () => iv; // each entry: one car per 2 × world.district.<id>.interval, as a game road lane
      if (s.deckSrc.size) s.P = Object.assign({}, s.P, { 'world.deckInterval': 2 * P['world.district.' + sc.D.id + '.interval'] / s.P['traffic.deckGapScale'] }); // a highway entry too (the Z1 ring takes all four)
      s.netSrc = src.length;
      // a bus enters only if every ground lane it can reach keeps vehicles.bus.minRadius (it cannot leave its route at a seam)
      const seen = new Set(), todo = src.filter((r) => r.deck == null).slice();
      while (todo.length) { const r = todo.pop(); if (seen.has(r)) continue; seen.add(r); todo.push(...r.next.filter((q) => q.layer === 0)); }
      const busOK = [...seen].every((r) => !r.s.lab && X.minBend(r.path.pts, W, H) >= RB * 0.9);
      if (!busOK) for (const sl of s.schedule) if (sl.cls === 'bus') sl.cls = 'sedan';
    }
    NETS[i] = { scs, recs, sims: [].concat(...scs.map((sc) => sc.sims)) };
    for (let k = 0; k < Math.round(P['traffic.warmSeconds'] * 60); k++) netStep(i, true);
    seamView(NETS[i]);
  }
  function recOf(s, c) { // a lap variant on a ring shares its route's ends and links
    const m = s.netLane; if (!m) return null;
    let r = m.get(c.path);
    if (!r && c.path.ring && c.path.ring.variants) { const base = m.get(c.path.ring.variants[0]); if (base) { r = Object.assign({}, base, { path: c.path, ends: X.laneEnds(c.path, W, H) }); m.set(c.path, r); } }
    return r || null;
  }
  const routeOf = (r, c) => { // a junction: the car's route next door, chosen afresh at every seam (a fixed choice could circle for ever)
    if (r.next.length === 1) return r.next[0];
    const h = hashId(c.id + r.sc.name + (c.hops || 0)), ns = (c.hops || 0) >= P['traffic.exitAfterSeams'] ? r.next.filter((q) => q.toExit === Math.min(...r.next.map((z) => z.toExit))) : r.next; // after that many seams, the way out
    return ns[h % ns.length];
  };
  function ghostOf(o, r, s) {
    const g = Object.create(o), p = X.pathAt(r.path, s);
    Object.assign(g, { ghost: true, real: o, lane: r.i, path: r.path, s, layer: r.simLayer, deck: r.simLayer > 0, x: p.x + p.nx * o.d, y: p.y + p.ny * o.d, h: o.h, vx: o.vx, vy: o.vy });
    if (r.deck != null) g.deckIdx = r.deck;
    return g;
  }
  function netStep(i, quiet) {
    const net = NETS[i], add = new Map(net.sims.map((s) => [s, []]));
    for (const s of net.sims) for (const o of s.cars) { // ghosts: cars near a seam, on the lanes next door that lead to or from theirs
      const r = recOf(s, o); if (!r) continue;
      if (r.prev.length && o.s - r.ends.in.s < GL) for (const a of r.prev) add.get(a.s).push(ghostOf(o, a, a.ends.out.s + (o.s - r.ends.in.s)));
      if (r.next.length && r.ends.out.s - o.s < GL) { const b = routeOf(r, o), sb = b.ends.in.s - (r.ends.out.s - o.s); if (sb > 0) add.get(b.s).push(ghostOf(o, b, sb)); }
    }
    for (const s of net.sims) { const gs = add.get(s); if (gs.length) s.cars = s.cars.concat(gs); }
    for (const s of net.sims) { if (s.lab) L.tick(s); else { s.step({}); s.body.x = -900; s.body.y = -900; } }
    for (const s of net.sims) { s.cars = s.cars.filter((c) => !c.ghost); if (s.events.length > 4000) s.events.length = 0; }
    const moved = [];
    for (const s of net.sims) s.cars = s.cars.filter((c) => { const r = recOf(s, c); if (!r || !r.next.length || c.s < r.ends.out.s) return true; moved.push([c, r]); return false; });
    for (const [c, r] of moved) {
      const nx = routeOf(r, c), ds = nx.ends.in.s - r.ends.out.s; // a junction: the car picks its route at the seam
      Object.assign(c, { s: c.s + ds, path: nx.path, lane: nx.i, layer: nx.simLayer, deck: nx.simLayer > 0, orbit: null, letOut: null, yielding: false, hops: (c.hops || 0) + 1 });
      if (nx.deck != null) c.deckIdx = nx.deck;
      for (const m of [c.man, c.intent]) if (m) for (const k of ['s0', 'sTarget', 'sStop']) if (m[k] != null) m[k] += ds;
      if (c.dodge && c.dodge.s != null) c.dodge = Object.assign({}, c.dodge, { s: c.dodge.s + ds });
      const p = X.pathAt(c.path, c.s); c.x = p.x + p.nx * c.d; c.y = p.y + p.ny * c.d;
      nx.s.cars.push(c); net.crossings = (net.crossings || 0) + 1;
    }
    if (!quiet) seamView(net);
  }
  function seamView(net) { // each screen draws the cars next door whose bodies reach onto it
    for (const sc of net.scs) sc.seam = [];
    for (const sc of net.scs) for (const s of sc.sims) for (const c of s.cars) {
      const r = (c.L + c.W) / 2 + 4, z = s === sc.ringSim ? 1 : c.layer || 0;
      for (const nb of net.scs) {
        if (nb === sc || Math.abs(nb.col - sc.col) > 1 || Math.abs(nb.row - sc.row) > 1) continue;
        const x = c.x + (sc.col - nb.col) * W, y = c.y + (sc.row - nb.row) * H;
        if (x > -r && x < W + r && y > -r && y < H + r) nb.seam.push({ x, y, h: c.h, cls: c.cls, L: c.L, W: c.W, deck: z > 0 });
      }
    }
  }
  // ---------- drawing a screen into its frame buffer
  const carSpr = (c) => PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(P['vehicles.' + c.cls + '.height']), c.h, false);
  function render(sc, FB, DL) {
    FB.d.set(sc.B.d);
    const ground = [], deckCars = [];
    for (const s of sc.sims) { if (s === sc.ringSim) continue; for (const c of s.cars) (c.deck ? deckCars : ground).push(c); }
    for (const g of sc.seam || []) (g.deck ? deckCars : ground).push(g); // P5.3: cars next door reaching onto this screen
    const layer = (l) => {
      DL.d.set(l.L.d);
      if (l !== sc.walk && !l.gate) {
        const cs = l.cars ? l.cars() : l.dk ? deckCars.filter((c) => (l.dk.hz ? Math.abs(c.y - l.dk.off) < HALF + 40 : Math.abs(c.x - l.dk.off) < HALF + 40)) : [];
        for (const c of cs.slice().sort((a, b) => a.y - b.y)) PIX.blit(DL, carSpr(c), c.x / U, c.y / U);
      }
      for (let y = 0; y < AH; y++) { const ty = y - l.lift; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
      if (l.extend && l.lift) for (let x = 0; x < AW; x++) { const c = DL.d[(AH - 1) * AW + x]; if (c) for (let ty = AH - l.lift; ty < AH; ty++) FB.d[ty * AW + x] = c; } // an arm running off the bottom edge
    };
    const items = ground.map((c) => [c.y, () => PIX.blit(FB, carSpr(c), c.x / U, c.y / U)]);
    for (const s of sc.sims) for (const cn of s.cones || []) if (cn.state === 'free') items.push([cn.y, () => PIX.blit(FB, PIX.CONE, cn.x / U, cn.y / U)]);
    for (const p of sc.props) if (!p.podium && !p.tower) items.push([p.over ? 1e6 + 1 : p.by, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    for (const l of sc.layers) { // a deck sorts at its front edge: buildings south of it stand in front
      for (const c of l.cols) items.push([Math.min(c.key, l.front - 1), () => PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U))]);
      items.push([l.front, () => layer(l)]);
    }
    for (const p of sc.props) if (p.podium) items.push([1e6 - 1, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    for (const p of sc.props) if (p.tower) items.push([1e6 + 2, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    items.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
    if (sc.monument) drawMonument(FB, sc.monument.cx, sc.monument.cy);
    for (const s of sc.sims) for (const d of s.drones || []) { const x = Math.round(d.x / U), y = Math.round(d.y / U - d.alt * 4); if (d.state === 'carry') PIX.blit(FB, PIX.CONE, x - 2, y + 13); PIX.blit(FB, PIX.DRONE, x, y); }
  }
  // ---------- page: the three centres live at the top; one district at a time below, 3 × 3, any screen at 2×
  const built = [{}, {}, {}], FB = new PIX.Buf(AW, AH), DL = new PIX.Buf(AW, AH), off = Object.assign(document.createElement('canvas'), { width: AW, height: AH }), og = off.getContext('2d'), img = og.createImageData(AW, AH);
  const grid = $('grid'), gg = grid.getContext('2d'), zoom = $('zoom'), zg = zoom.getContext('2d'), cents = [0, 1, 2].map((i) => $('c' + i));
  grid.width = AW * 3; grid.height = AH * 3; zoom.width = AW * 2; zoom.height = AH * 2; cents.forEach((c) => { c.width = AW * 2; c.height = AH * 2; });
  let cur = 0, sel = [1, 1], playing = true, labels = true;
  function screen(i, col, row) {
    const key = col + row * 3; let sc = built[i][key];
    if (!sc) sc = built[i][key] = buildScreen(DISTRICTS[i], col, row);
    return sc;
  }
  const districtScreens = (i) => { const out = []; for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) out.push(screen(i, col, row)); if (!NETS[i]) linkDistrict(i, out); return out; }; // P5.3: built and linked whole
  function show(i) {
    cur = i; const D = DISTRICTS[i];
    document.querySelectorAll('#tabs button').forEach((b, k) => b.classList.toggle('on', k === i));
    $('dname').textContent = (i + 1) + ' · ' + D.name; $('dmood').textContent = D.mood + ' Start: ' + D.start[0] + ', ' + D.start[1] + ' edge. Write-offs required: ' + D.quota + '.';
    $('plan').innerHTML = '<tr><th>Tile</th><th>Mechanic revealed</th><th>Landmark</th></tr>' + ['A1', 'B1', 'C1', 'A2', 'B2', 'C2', 'A3', 'B3', 'C3'].map((t) => `<tr${t === 'B2' ? ' class="centre"' : ''}><td>${t}</td><td>${D.tiles[t][0]}</td><td>${D.tiles[t][1]}</td></tr>`).join('');
    districtScreens(i);
  }
  function paint(sc) { render(sc, FB, DL); new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0); }
  function frame() {
    const screens = districtScreens(cur), centres = [0, 1, 2].map((i) => (districtScreens(i), screen(i, 1, 1))), live = new Set(screens.concat(centres));
    if (playing) for (const i of [0, 1, 2]) netStep(i); // P5.3: every district runs whole (the centres row shows all three)
    for (const sc of live) {
      paint(sc);
      if (sc.D === DISTRICTS[cur]) {
        gg.imageSmoothingEnabled = false; gg.drawImage(off, sc.col * AW, sc.row * AH);
        if (sc.col === sel[0] && sc.row === sel[1]) { zg.imageSmoothingEnabled = false; zg.drawImage(off, 0, 0, AW * 2, AH * 2); }
      }
      const ci = centres.indexOf(sc); if (ci >= 0) { const g = cents[ci].getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(off, 0, 0, AW * 2, AH * 2); }
    }
    const D = DISTRICTS[cur];
    gg.strokeStyle = 'rgba(230,244,255,0.55)'; gg.lineWidth = 1;
    for (const sc of screens) {
      gg.strokeRect(sc.col * AW + 0.5, sc.row * AH + 0.5, AW - 1, AH - 1);
      gg.font = '600 12px system-ui'; gg.fillStyle = 'rgba(12,16,24,0.78)';
      const t = D.tiles[sc.name][0].split(/[.;:]/)[0], tw = labels ? Math.min(AW - 12, gg.measureText(sc.name + '  ' + t).width + 12) : 30;
      gg.fillRect(sc.col * AW + 6, sc.row * AH + 6, tw, 18); gg.fillStyle = '#e6f4ff'; gg.fillText(labels ? sc.name + '  ' + t : sc.name, sc.col * AW + 12, sc.row * AH + 19, AW - 24);
    }
    const [st, edge] = D.start, sc0 = screens.find((q) => q.name === st); // the start: an arrow on its edge
    if (sc0) { const x0 = sc0.col * AW, y0 = sc0.row * AH, [ax, ay, dx, dy] = edge === 'top' ? [x0 + AW * 0.35, y0 + 4, 0, 1] : [x0 + 4, y0 + AH / 2, 1, 0]; gg.fillStyle = '#57e389'; gg.beginPath(); gg.moveTo(ax + dx * 26, ay + dy * 26); gg.lineTo(ax - dy * 12, ay - dx * 12); gg.lineTo(ax + dy * 12, ay + dx * 12); gg.closePath(); gg.fill(); gg.font = '700 12px system-ui'; gg.fillText('START', ax + dx * 30 + (dy ? 14 : 0), ay + dy * 30 + (dx ? 4 : 0)); }
    gg.strokeStyle = '#49d3ff'; gg.lineWidth = 3; gg.strokeRect(sel[0] * AW + 1.5, sel[1] * AH + 1.5, AW - 3, AH - 3);
    const sc = screens.find((q) => q.col === sel[0] && q.row === sel[1]);
    $('zname').textContent = D.name + ' · ' + sc.name; $('znote').textContent = sc.note;
    const all = [].concat(...sc.sims.map((s) => s.cars)), deck = all.filter((c) => c.deck || (sc.ringSim && sc.ringSim.cars.includes(c))), orb = all.filter((c) => c.orbit && c.orbit.lane === 'in').length;
    $('zlive').textContent = `Live: ground cars ${all.length - deck.length}` + (deck.length ? ` · highway cars ${deck.length}` : '') + (sc.lab ? ` · waiting to give way ${sc.lab.cars.filter((c) => c.yielding).length}` : '') + (orb ? ` · orbiting on the inner lane ${orb}` : '') + (sc.stairs.length ? ` · escalators ${sc.stairs.length}` : '');
    centres.forEach((c, i) => { $('n' + i).textContent = c.note; });
    requestAnimationFrame(frame);
  }
  grid.onclick = (e) => { const r = grid.getBoundingClientRect(); sel = [Math.min(2, Math.floor((e.clientX - r.left) / r.width * 3)), Math.min(2, Math.floor((e.clientY - r.top) / r.height * 3))]; };
  cents.forEach((c, i) => { c.onclick = () => { sel = [1, 1]; show(i); $('district').scrollIntoView({ behavior: 'smooth' }); }; });
  DISTRICTS.forEach((D, i) => { const b = document.createElement('button'); b.textContent = (i + 1) + ' · ' + D.name; b.onclick = () => { sel = [1, 1]; show(i); }; $('tabs').appendChild(b); $('t' + i).textContent = (i + 1) + ' · ' + D.name + ' · B2'; });
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  $('labels').onclick = () => { labels = !labels; $('labels').textContent = labels ? 'Hide labels' : 'Show labels'; };
  window.__district = { show, select: (c, r) => { sel = [c, r]; }, built, screen, labels: (v) => { labels = v; }, DISTRICTS, NETS, netStep };
  show(0); requestAnimationFrame(frame);
})();
