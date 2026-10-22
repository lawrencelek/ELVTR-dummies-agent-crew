// Three districts (P5 mock-up, GDD Edits 51.1–51.2). Each district is 3 × 3 screens of 800 × 640, drawn in game art with
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
    const geoms = [{ pts: rr.ring, dash: true }, { pts: rr.armW, dash: true }, { pts: rr.armE, dash: true }, { pts: rr.WE }, { pts: rr.EW }];
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
  // ---------- the three districts, planned in district coordinates (3 × 3 screens of 800 × 640)
  const R96 = P['world.roundaboutEntryRadius'];
  const fil = (pts) => X.filletAny(pts, R96, 0);
  const DISTRICTS = [
    { id: 'parkland', name: 'Parkland', mood: 'Calm, water, concrete and lawn. The highway loops over the pools; a road passes beneath.', quota: P['world.district.parkland.quota'], storeys: [2, 5],
      roads: [[[1200, -200], [1200, 2120]], fil([[400, -200], [400, 300], [200, 500], [200, 2120]]), fil([[2000, -200], [2000, 1420], [2200, 1620], [2200, 2120]])],
      decks: [{ row: 1, off: 288, z: 1 }], park: ['B1', 'A2', 'B2', 'C2', 'B3'], centre: 'B2' }, // the ring replaces the B2 stretch; off 288 puts it in the upper half (Edit 51.3)
    { id: 'circus', name: 'Circus', mood: 'Busy and circling, walled by monumental concrete towers. Traffic gives way at the four-way roundabout, then rushes.', quota: P['world.district.circus.quota'], storeys: [6, 14],
      roads: [[[-200, 960], [2600, 960]], [[1200, -200], [1200, 2120]], fil([[200, -200], [200, 200], [80, 320], [-200, 320]]), fil([[2200, -200], [2200, 200], [2320, 320], [2600, 320]]),
        fil([[200, 2120], [200, 1540], [80, 1420], [-200, 1420]]), fil([[2200, 2120], [2200, 1540], [2320, 1420], [2600, 1420]])],
      decks: [{ row: 2, off: 400, z: 1 }], park: [], centre: 'B2' },
    { id: 'monument', name: 'Monument', mood: 'Neon commerce, LED walls. The road splits round the monument; walkways bridge it at Z1.', quota: P['world.district.monument.quota'], storeys: [6, 12],
      roads: [fil([[-200, 560], [2000, 560], [2000, 960], [400, 960], [400, 1440], [2600, 1440]])],
      decks: [{ row: 0, off: 272, z: 2 }, { row: 2, off: 380, z: 1 }], park: [], centre: 'B2' },
  ];
  // ---------- one screen of a district
  function sceneSim(center, decks, deckLanes, lanes, busOK) {
    const s = new X.Sim('straight', { 'run.appearances.road': 2000 });
    s.level = Object.assign({}, s.level, { center, ring: null, lanes: lanes || X.lanesOf(center, P), statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain',
      decks: decks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), deckLanes });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {};
    s.schedule = s.schedule.map((sl, j) => { const cls = X.fleetClass(P, 0.25, (j * 0.6180339887 + 0.53) % 1); return Object.assign({}, sl, { cls: cls === 'bus' && !busOK ? 'sedan' : cls }); }); // buses only where the road allows (Edit 50)
    s.admissionInterval = () => 3.2;
    Object.assign(s.body, { x: -900, y: -900 }); s.fillDeckCars();
    return s;
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
  function buildScreen(D, col, row) {
    const name = 'ABC'[col] + (row + 1), ox = col * W, oy = row * H, rng = PIX.rng(1000 + col * 37 + row * 101 + D.id.length * 7);
    const sc = { D, name, col, row, props: [], layers: [], sculpts: [], note: '', stairs: [] };
    const isPark = D.park.includes(name), isCentre = name === D.centre;
    const roadsLocal = [];
    for (const r of D.roads) { const run = clipRun(shift(r, -ox, -oy), -200, -200, W + 200, H + 200); if (run) roadsLocal.push(run); }
    let center = roadsLocal[0] || [[-900, -900], [-850, -900]], lanes = null, busOK = X.minBend(center, W, H) >= P['vehicles.bus.minRadius'];
    const decks = D.decks.filter((d) => d.row === row), dkList = decks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] }));
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: dkList, floors: [], canal: false, solid: [] }, extra || {});
    let ground, labSim = null, ringDeck = null, roadD;
    if (D.id === 'circus' && isCentre) {
      labSim = L.makeSim(X, 'roundabout4', { Rf: R96 }, { fleet: 'expanded', interval: 1.6, seconds: 60, seed: 11, overrides: {} });
      const geo = labSim.lab.geo;
      ground = PIX.ground(lvl(geo.center, { ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: geo.stops.map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })), decks: [] }), P, 23);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.id === 'monument' && isCentre) {
      const sp = splitRoad(320); center = [[-200, 320], [W + 200, 320]]; lanes = [X.makePath(sp.E), X.makePath(sp.Wl)]; busOK = false; sc.split = sp;
      ground = PIX.ground(lvl([[-900, -900], [-850, -900]]), P, 41);
      tiles(ground, () => true, false);
      const m = paintSplit(ground, sp.E, sp.Wl); roadD = (k) => LW - m[k];
    } else {
      ground = PIX.ground(lvl(center, D.id === 'parkland' && isCentre ? { decks: [] } : {}), P, 31 + col * 7 + row * 13);
      const rf = PIX.roadField(roadsLocal.map((pts) => ({ pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    }
    const B = ground; sc.B = B;
    const rd = (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH ? roadD(k) : 1e9; };
    const roadOk = (wx, wy, m) => rd(wx, wy) > (m || OUTER + 4);
    // highways, each with its two escalators
    if (D.id === 'parkland' && isCentre) {
      const cx = 400, cy = decks[0].off, Rc = P['world.deckRingRadius'], rr = ringRoutes(cx, cy, Rc, R96);
      if (cy - Rc - HALF - Z1 * U < P['world.deckRingTopClear']) console.warn('ring too close to the top edge');
      sc.stairs = escalators(cy, 1, HALF).slice(0, P['world.deckEscalators']);
      ringDeck = ringLayer(rr, 1, cx, cy, Rc, (x, y) => !roadOk(x, y, OUTER + C + 4) || sc.stairs.some((st) => x > st.x - C && x < st.x + st.w + C && Math.abs(y - st.y - st.h / 2) < st.h / 2 + HALF), sc.stairs.map((st) => [st.x + 2, st.x + st.w - 2, st.side]));
      sc.layers.push(ringDeck); sc.ring = rr;
    } else for (const d of decks) { const st = escalators(d.off, d.z, HALF).slice(0, P['world.deckEscalators']); sc.stairs.push(...st); sc.layers.push(straightDeck(d.off, d.z, roadOk, st)); }
    for (const st of sc.stairs) { sc.props.push(stairProp(st, st.z === 2 ? Z2 : Z1)); if (rd(st.x + SWD / 2, st.side > 0 ? st.y + st.h : st.y) < LW) console.warn('escalator foot in a lane', D.id, name); }
    const blocked = sc.stairs.map((st) => [st.x - 24, st.y - 24, st.w + 48, st.h + 48]);
    const underDeck = (wx, wy) => sc.layers.some((l) => l.inBand(wx, wy));
    const free = (wx, wy, m) => roadOk(wx, wy, OUTER + (m || 24)) && !underDeck(wx, wy) && !blocked.some((r) => wx > r[0] && wx < r[0] + r[2] && wy > r[1] && wy < r[1] + r[3]);
    let reserved = false;
    // centrepieces
    if (D.id === 'parkland' && isCentre) {
      const okL = (wx, wy) => roadOk(wx, wy, OUTER), cy = decks[0].off, pools = [[112, cy - 184, 304, cy + 184], [496, cy - 184, 688, cy + 184]];
      const inPools = (wx, wy, m) => pools.some(([a, b, c, d]) => wx > a - m && wx < c + m && wy > b - m && wy < d + m);
      gardenPave(B, okL, null);
      for (const [a, b, c, d] of pools) pool(B, (wx, wy) => roadOk(wx, wy, OUTER + 2), a, b, c, d, 48);
      gardenBeds(B, { bedOk: (wx, wy) => free(wx, wy, 8) && !inPools(wx, wy, 24), diag: null, rng, leds: LEDS, pools: false });
      gardenSculptures(B, (wx, wy) => free(wx, wy, 16) && !inPools(wx, wy, 16), null, rng, 3);
      ringDeck.shadeOn(B);
      reserved = true;
      sc.note = 'The Z1 highway turns once round the ring (world.deckRingRadius), now in the upper half, over two reflecting pools. A ground road passes north–south beneath it, seen through the ring. A garden of paving, light lines and planted beds below. Escalators: north side at the west end, south side at the east end.';
    } else if (D.id === 'circus' && isCentre) {
      const Rc = P['world.roundaboutRadius'], ci = Rc - OUTER - 2;
      each((x, y, wx, wy) => { const d = hyp(wx - 400, wy - 320); if (d < ci) B.put(x, y, d > ci - 4 ? CON.l : (x % 8 === 0 || y % 8 === 0) ? CON.d : CON.t); });
      const ax = 400 / U, ay = 320 / U, led = LEDS[3 % LEDS.length]; // a stepped plinth: concrete, a lawn tier, a slab with a lit slot and a halo
      block(B, ax - 26, ay - 20, ax + 26, ay + 20, 12, 0, 4, 'conc', null, true);
      block(B, ax - 18, ay - 13, ax + 18, ay + 13, 8, 4, 4, 'grass', led, false);
      block(B, ax - 9, ay - 6, ax + 9, ay + 6, 4, 8, 3, 'conc', LEDS[0], false);
      for (let t = 0; t < 46; t++) for (let j = -2; j <= 2; j++) B.shade(ax - t * 0.7 + j * 0.7 - 10, ay + t * 0.7 + j * 0.7 + 4, 0.8);
      block(B, ax - 3, ay - 1, ax + 3, ay + 1, 0, 11, 40, 'conc', null, false);
      for (let t = 4; t < 36; t++) B.put(ax, ay + 1 - 11 - t, led);
      for (let a = 0; a < 48; a++) { const th = a / 48 * Math.PI * 2, hx = Math.round(ax + Math.cos(th) * 10), hy = Math.round(ay - 40 + Math.sin(th) * 3); if (Math.sin(th) > 0 || Math.abs(Math.cos(th)) > 0.3) B.put(hx, hy, a % 6 < 4 ? N.cyan : K.white); }
      const rz = PIX.roadField(labSim.lab.geo.roads.map((pts) => ({ pts, dash: false })), LW + 2);
      each((x, y, wx, wy, k) => { if (rz.D[k] > LW - 4) return; const zx = Math.abs(wx - 400) < LW && (Math.abs(wy - 36) < 16 || Math.abs(wy - 604) < 16) && Math.floor(wx / 8) % 2 === 0, zy = Math.abs(wy - 320) < LW && (Math.abs(wx - 70) < 16 || Math.abs(wx - 730) < 16) && Math.floor(wy / 8) % 2 === 0; if (zx || zy) B.put(x, y, K.lane); });
      [[8, 8, 280, 200, 'se', 'n', 12, 'ziggurat'], [512, 8, 280, 200, 'sw', 'n', 14, 'cantilever'], [8, 432, 280, 200, 'ne', 's', 10, 'twin'], [512, 432, 280, 200, 'nw', 's', 9, 'slab']].forEach(([x, y, w, h, c, rear, st, sty], i) => { // the circus walls: each tower cut at 45° to face the roundabout
        const cut = { c, k: 65 }, Hh = st * STY; brutalShadow(B, x / U, y / U, w / U, h / U, Math.round(Hh * 0.55), cut);
        sc.props.push({ spr: brutal(w / U, h / U, Hh, PIX.rng(311 + i * 17), LEDS[i % LEDS.length], cut, rear, sty), x: x / U, y: y / U, by: y + h });
      });
      reserved = true;
      sc.note = 'Every route between four arms, one way round, give way at entry (Edit 49.1). The island: a stepped concrete plinth, a lawn tier, a slab with a lit slot and a halo. Zebra crossings. Four monumental concrete towers, each cut at 45° to face the roundabout.';
    } else if (D.id === 'monument' && isCentre) {
      const cx = 400, cy = 320, A = P['world.walkwayRingHalf'], w = P['world.walkwayWidth'], k = P['world.walkwayRingChamfer'], ki = k - 0.586 * w, Lk = P['world.walkwayLinkLength'];
      const sq = (a, kk) => [[cx - a + kk, cy - a], [cx + a - kk, cy - a], [cx + a, cy - a + kk], [cx + a, cy + a - kk], [cx + a - kk, cy + a], [cx - a + kk, cy + a], [cx - a, cy + a - kk], [cx - a, cy - a + kk]];
      const outerP = sq(A, k), innerP = sq(A - w, ki), dCut = (2 * A - k) / 2, dFace = dCut + Lk / Math.SQRT2;
      const ringQuads = outerP.map((p, i) => [p, outerP[(i + 1) % 8], innerP[(i + 1) % 8], innerP[i]]);
      const mid = sq(A - w / 2, k - 0.293 * w); ringQuads[0].spine = mid.concat([mid[0]]);
      const diag = (sx, sy) => { const d0 = (2 * A - k - 1.414 * w) / 2, d2 = dFace + 40 / Math.SQRT2, nx = -sy * Math.SQRT1_2 * w / 2, ny = sx * Math.SQRT1_2 * w / 2, a = [cx + sx * d0, cy + sy * d0], b = [cx + sx * d2, cy + sy * d2];
        const q = [[a[0] + nx, a[1] + ny], [b[0] + nx, b[1] + ny], [b[0] - nx, b[1] - ny], [a[0] - nx, a[1] - ny]]; q.spine = [[cx + sx * dCut, cy + sy * dCut], [cx + sx * dFace, cy + sy * dFace]]; return q; };
      // podium roofs at Z1 in the four corners; each 45° walkway meets one square-on through its inner face
      const fx = Math.round(cx - dFace), fyN = Math.ceil(cy - dFace + 0.707 * w + 6), fyS = Math.floor(cy + dFace - 0.707 * w - 6);
      const podiums = [[16, 8, fx - 16, fyN - 8], [W - fx, 8, fx - 16, fyN - 8], [16, fyS, fx - 16, H - 8 - fyS], [W - fx, fyS, fx - 16, H - 8 - fyS]];
      // escalators: outer ones at opposite ends of the north and south sides; inner ones down to the monument's island
      const run = X.stairRun(P, 0, 1);
      const esc = [{ x: cx - A + k + 8, y: cy - A - run, w: SWD, h: run, axis: 'y', low: cy - A - run, high: cy - A, side: -1, z: 1 },
        { x: cx + A - k - 8 - SWD, y: cy + A, w: SWD, h: run, axis: 'y', low: cy + A + run, high: cy + A, side: 1, z: 1 },
        { x: cx - A + w, y: cy - SWD / 2, w: run, h: SWD, axis: 'x', low: cx - A + w + run, high: cx - A + w, side: 0, z: 1 },
        { x: cx + A - w - run, y: cy - SWD / 2, w: run, h: SWD, axis: 'x', low: cx + A - w - run, high: cx + A - w, side: 0, z: 1 }];
      const sp = sc.split, fE = PIX.roadField([{ pts: sp.E }], 120), fW = PIX.roadField([{ pts: sp.Wl }], 120);
      const laneD = (x, y) => { const kk = Math.floor(y / U) * AW + Math.floor(x / U); return Math.min(fE.D[kk], fW.D[kk]); };
      const wl = walkwayLayer(ringQuads.concat([diag(-1, -1), diag(1, -1), diag(-1, 1), diag(1, 1)]), podiums, esc.map((s) => [s.x, s.y, s.w, s.h]), (x, y) => laneD(x, y) > LW / 2 + 14);
      sc.layers.push(wl); sc.walk = wl;
      // ground: plazas north and south with the LED lattice, the island in pale stone, planters, sculptures
      const okP = (wx, wy) => roadOk(wx, wy, OUTER) && wx > fx + 8 && wx < W - fx - 8;
      tiles(B, okP, true);
      each((x, y, wx, wy, kk) => { // the island between the carriageways
        if (!roadOk(wx, wy, OUTER) || wx < 150 || wx > W - 150 || Math.abs(wy - cy) > P['world.splitLaneOffset']) return;
        B.put(x, y, (x % 8 === 0 || y % 8 === 0) ? CON.m : ((x + y) % 16 === 0 ? CON.l : ISL));
      });
      planter(B, 520, 96, 48, 26, 'monolith', LEDS[0]); planter(B, 280, 552, 48, 26, 'tiers', LEDS[3 % LEDS.length]);
      for (const [sx, sy, kind] of [[400, 60, 'arch'], [400, 600, 'fins'], [330, 372, 'cubes'], [470, 372, 'ring']]) sculpture(B, sx / U, sy / U, kind, LEDS[(sx + sy) % LEDS.length]);
      wl.shadeOn(B);
      for (const st of esc) sc.props.push(stairProp(st, Z1));
      sc.stairs = esc;
      podiums.forEach(([x, y, pw, ph], i) => sc.props.push({ spr: PIX.building(Math.round(pw / U), Math.round(ph / U), Z1, PIX.rng(91 + i * 13), LEDS[(i + 1) % LEDS.length], 1), x: x / U, y: y / U, by: y + ph, podium: true }));
      [[16, 8, 96, 56], [W - 112, 8, 96, 56], [16, fyS, 96, 64], [W - 112, fyS, 96, 64]].forEach(([x, y, tw, th], i) => sc.props.push({ spr: PIX.building(Math.round(tw / U), Math.round(th / U), (7 + i * 2) * EXT(P['world.storeyHeight']), PIX.rng(57 + i * 29), LEDS[(i + 2) % LEDS.length], 7 + i * 2), x: x / U, y: y / U - Z1, by: y + th, tower: true })); // towers stand on the podiums
      sc.monument = { cx, cy };
      reserved = true;
      sc.note = 'The road splits round the monument\'s island (lanes world.splitLaneOffset from the centre, 45° tapers). A square walkway ring at Z1 bridges both carriageways on round columns. 45° walkways run to podium roofs at Z1. Escalators: two out to the plazas, two down to the island.';
    }
    // the rest of the screen: park or city
    if (!reserved) {
      if (isPark) {
        const diag = { c: 640, w: 32 };
        gardenPave(B, (wx, wy) => roadOk(wx, wy, OUTER), diag);
        gardenBeds(B, { bedOk: (wx, wy) => free(wx, wy, 8), diag, rng, leds: LEDS });
        gardenSculptures(B, (wx, wy) => free(wx, wy, 16), diag, rng, 2);
        sc.pond = null;
      }
      if (!isPark) { // buildings: greedy blocks clear of roads, highways, escalators and each other
        const placed = [], [s0, s1] = D.storeys;
        const mono = D.id === 'circus';
        for (let t = 0; t < 900 && placed.length < (mono ? 7 : 10); t++) { // big blocks first, then infill
          const big = t < 450, w = mono ? (big ? 192 : 112) + Math.floor(rng() * (big ? 9 : 5)) * 16 : (big ? 128 : 64) + Math.floor(rng() * (big ? 7 : 5)) * 16, h = mono ? (big ? 144 : 96) + Math.floor(rng() * (big ? 7 : 4)) * 16 : (big ? 96 : 64) + Math.floor(rng() * (big ? 5 : 3)) * 16, x = 8 + Math.floor(rng() * ((W - 16 - w) / 16)) * 16, y = 8 + Math.floor(rng() * ((H - 16 - h) / 16)) * 16;
          const pts = []; for (let i = 0; i <= w; i += 16) for (let j = 0; j <= h; j += 16) pts.push([x + i, y + j]);
          const deckClear = (py) => sc.layers.some((l) => l.dk && py > l.dk.off - HALF - 12 && py < l.dk.off + HALF + P['world.deckBottomClear']); // tall blocks keep clear south of a highway
          if (!pts.every(([px, py]) => free(px, py, 16) && !deckClear(py)) || placed.some((q) => x < q.x + q.w + 16 && x + w + 16 > q.x && y < q.y + q.h + 16 && y + h + 16 > q.y)) continue;
          placed.push({ x, y, w, h });
        }
        if (mono) placed.forEach((q, i) => { // monumental: the corner nearest a road cut at 45°, towers set back from the street
          const st = s0 + Math.floor(rng() * (s1 - s0 + 1)), Hh = st * STY, cs = [[q.x, q.y, 'nw'], [q.x + q.w, q.y, 'ne'], [q.x, q.y + q.h, 'sw'], [q.x + q.w, q.y + q.h, 'se']].map(([x, y, c]) => ({ c, d: rd(x, y) })).sort((a, b2) => a.d - b2.d);
          const cut = cs[0].d < OUTER + 72 ? { c: cs[0].c, k: Math.round(Math.min(q.w, q.h) / U * 0.3) } : null, rear = rd(q.x + q.w / 2, q.y - 8) < rd(q.x + q.w / 2, q.y + q.h + 8) ? 's' : 'n';
          brutalShadow(B, q.x / U, q.y / U, q.w / U, q.h / U, Math.round(Hh * 0.55), cut);
          sc.props.push({ spr: brutal(q.w / U, q.h / U, Hh, PIX.rng(700 + i * 31 + col * 7 + row * 3), LEDS[(i + col + row) % LEDS.length], cut, rear), x: q.x / U, y: q.y / U, by: q.y + q.h });
        });
        else placed.forEach((q, i) => { const st = s0 + Math.floor(rng() * (s1 - s0 + 1)); sc.props.push({ spr: PIX.building(Math.round(q.w / U), Math.round(q.h / U), st * EXT(P['world.storeyHeight']), PIX.rng(700 + i * 31 + col * 7 + row * 3), LEDS[(i + col + row) % LEDS.length], st), x: q.x / U, y: q.y / U, by: q.y + q.h }); });
        sc.blocks = placed;
        for (let t = 0, n = 0; t < 120 && n < 1; t++) { // a small plaza with a planter
          const px = 60 + rng() * 680, py = 60 + rng() * 520;
          if (![[0, 0], [-48, -48], [48, 48], [-48, 48], [48, -48]].every(([a, b]) => free(px + a, py + b, 24)) || placed.some((q) => px > q.x - 60 && px < q.x + q.w + 60 && py > q.y - 60 && py < q.y + q.h + 60)) continue;
          tiles(B, (wx, wy) => free(wx, wy, 8) && Math.abs(wx - px) < 56 && Math.abs(wy - py) < 56, true); planter(B, px, py + 8, 36, 22, n % 2 ? 'tiers' : 'monolith', LEDS[(col + row) % LEDS.length]); sc.sculpts.push([px, py]); n++;
        }
      }
      const sk = [];
      for (let t = 0; t < 200 && sk.length < (isPark ? 0 : 2); t++) { // sculptures on pavements (gardens place their own)
        const px = 30 + rng() * 740, py = 40 + rng() * 570;
        if (!free(px, py, 30) || sk.concat(sc.sculpts).some(([a, b]) => hyp(a - px, b - py) < 100) || (sc.pond && px > sc.pond[0] && px < sc.pond[0] + sc.pond[2] && py > sc.pond[1] && py < sc.pond[1] + sc.pond[3] + 30) || Math.abs(px + py - 640) < 30 || (sc.blocks || []).some((q) => px > q.x - 30 && px < q.x + q.w + 30 && py > q.y - 20 && py < q.y + q.h + 60)) continue;
        sk.push([px, py]);
      }
      for (const p of sk) sculpture(B, p[0] / U, p[1] / U, SCULPT[Math.floor(rng() * SCULPT.length)], LEDS[Math.floor(rng() * LEDS.length)]);
      sc.note = (isPark ? 'Parkland garden: running-bond paving, light lines, a 45° promenade, beds of hedge, grasses, lawn, moss, terraces and pools; sculptures on the crossings.' : D.id === 'circus' ? 'Monumental concrete towers on pilotis: ziggurats, cantilevered crowns, finned slabs, twin towers; corners cut at 45° to the street.' : 'City blocks, LED façades; a plaza with a concrete planter.') + (decks.length ? ' Highway Z' + decks[0].z + ' along this row, with its two escalators: north side at the west end, south side at the east end.' : '');
    }
    // traffic
    if (labSim) sc.s = labSim, sc.lab = true;
    else if (sc.ring) {
      const dl = [{ path: X.lanesOf(sc.ring.WE, P)[0], deck: 0, dir: 0 }, { path: X.lanesOf(sc.ring.EW, P)[0], deck: 0, dir: 1 }];
      sc.s = sceneSim(center, [{ off: decks[0].off, z: 1 }], dl, null, busOK);
    } else sc.s = sceneSim(center, decks, X.deckLanesOf(decks.map((d) => ({ hz: true, off: d.off })), P), lanes, busOK);
    return sc;
  }
  // ---------- drawing a screen into its frame buffer
  const carSpr = (c) => PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(P['vehicles.' + c.cls + '.height']), c.h, false);
  function step(sc) { if (sc.lab) L.tick(sc.s); else { sc.s.step({}); sc.s.body.x = -900; sc.s.body.y = -900; } }
  function render(sc, FB, DL) {
    const s = sc.s; FB.d.set(sc.B.d);
    const layer = (l) => {
      DL.d.set(l.L.d);
      if (l !== sc.walk) for (const c of s.cars.filter((c) => c.deck).sort((a, b) => a.y - b.y)) PIX.blit(DL, carSpr(c), c.x / U, c.y / U);
      for (let y = 0; y < AH; y++) { const ty = y - l.lift; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
    };
    const items = s.cars.filter((c) => !c.deck).map((c) => [c.y, () => PIX.blit(FB, carSpr(c), c.x / U, c.y / U)]);
    for (const p of sc.props) if (!p.podium && !p.tower) items.push([p.over ? 1e6 + 1 : p.by, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    for (const l of sc.layers) { // a deck sorts at its front edge: buildings south of it stand in front
      for (const c of l.cols) items.push([Math.min(c.key, l.front - 1), () => PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U))]);
      items.push([l.front, () => layer(l)]);
    }
    for (const p of sc.props) if (p.podium) items.push([1e6 - 1, () => PIX.blit(FB, p.spr, p.x, p.y)]); // podium roofs at Z1, under the walkway's ends
    for (const p of sc.props) if (p.tower) items.push([1e6 + 2, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    items.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
    if (sc.monument) drawMonument(FB, sc.monument.cx, sc.monument.cy);
  }
  // ---------- page: the three centres live at the top; one district at a time below, 3 × 3, any screen at 2×
  const built = [{}, {}, {}], FB = new PIX.Buf(AW, AH), DL = new PIX.Buf(AW, AH), off = Object.assign(document.createElement('canvas'), { width: AW, height: AH }), og = off.getContext('2d'), img = og.createImageData(AW, AH);
  const grid = $('grid'), gg = grid.getContext('2d'), zoom = $('zoom'), zg = zoom.getContext('2d'), cents = [0, 1, 2].map((i) => $('c' + i));
  grid.width = AW * 3; grid.height = AH * 3; zoom.width = AW * 2; zoom.height = AH * 2; cents.forEach((c) => { c.width = AW * 2; c.height = AH * 2; });
  let cur = 0, sel = [1, 1], playing = true;
  function screen(i, col, row) {
    const key = col + row * 3; let sc = built[i][key];
    if (!sc) { sc = built[i][key] = buildScreen(DISTRICTS[i], col, row); for (let k = 0; k < 12 * 60; k++) step(sc); }
    return sc;
  }
  const districtScreens = (i) => { const out = []; for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) out.push(screen(i, col, row)); return out; };
  function show(i) {
    cur = i; const D = DISTRICTS[i];
    document.querySelectorAll('#tabs button').forEach((b, k) => b.classList.toggle('on', k === i));
    $('dname').textContent = (i + 1) + ' · ' + D.name; $('dmood').textContent = D.mood + ' Write-offs required: ' + D.quota + '.';
    districtScreens(i);
  }
  function paint(sc) { render(sc, FB, DL); new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0); }
  function frame() {
    const screens = districtScreens(cur), centres = [0, 1, 2].map((i) => screen(i, 1, 1)), live = new Set(screens.concat(centres));
    if (playing) for (const sc of live) step(sc);
    for (const sc of live) {
      paint(sc);
      if (sc.D === DISTRICTS[cur]) {
        gg.imageSmoothingEnabled = false; gg.drawImage(off, sc.col * AW, sc.row * AH);
        if (sc.col === sel[0] && sc.row === sel[1]) { zg.imageSmoothingEnabled = false; zg.drawImage(off, 0, 0, AW * 2, AH * 2); }
      }
      const ci = centres.indexOf(sc); if (ci >= 0) { const g = cents[ci].getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(off, 0, 0, AW * 2, AH * 2); }
    }
    gg.strokeStyle = 'rgba(230,244,255,0.55)'; gg.lineWidth = 1; gg.font = '600 12px system-ui';
    for (const sc of screens) { gg.strokeRect(sc.col * AW + 0.5, sc.row * AH + 0.5, AW - 1, AH - 1); gg.fillStyle = 'rgba(12,16,24,0.75)'; gg.fillRect(sc.col * AW + 6, sc.row * AH + 6, 30, 18); gg.fillStyle = '#e6f4ff'; gg.fillText(sc.name, sc.col * AW + 12, sc.row * AH + 19); }
    gg.strokeStyle = '#49d3ff'; gg.lineWidth = 3; gg.strokeRect(sel[0] * AW + 1.5, sel[1] * AH + 1.5, AW - 3, AH - 3);
    const sc = screens.find((q) => q.col === sel[0] && q.row === sel[1]);
    $('zname').textContent = DISTRICTS[cur].name + ' · ' + sc.name; $('znote').textContent = sc.note;
    const deck = sc.s.cars.filter((c) => c.deck);
    $('zlive').textContent = `Live: ground cars ${sc.s.cars.length - deck.length}` + (deck.length ? ` · highway cars ${deck.length}` : '') + (sc.lab ? ` · waiting to give way ${sc.s.cars.filter((c) => c.yielding).length}` : '') + (sc.stairs.length ? ` · escalators ${sc.stairs.length}` : '');
    centres.forEach((c, i) => { $('n' + i).textContent = c.note; });
    requestAnimationFrame(frame);
  }
  grid.onclick = (e) => { const r = grid.getBoundingClientRect(); sel = [Math.min(2, Math.floor((e.clientX - r.left) / r.width * 3)), Math.min(2, Math.floor((e.clientY - r.top) / r.height * 3))]; };
  cents.forEach((c, i) => { c.onclick = () => { sel = [1, 1]; show(i); $('district').scrollIntoView({ behavior: 'smooth' }); }; });
  DISTRICTS.forEach((D, i) => { const b = document.createElement('button'); b.textContent = (i + 1) + ' · ' + D.name; b.onclick = () => { sel = [1, 1]; show(i); }; $('tabs').appendChild(b); $('t' + i).textContent = (i + 1) + ' · ' + D.name + ' · B2'; });
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  window.__district = { show, select: (c, r) => { sel = [c, r]; }, built, screen };
  show(0); requestAnimationFrame(frame);
})();
