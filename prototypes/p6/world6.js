// P6 world (GDD Edit 62): the three districts of the game (1 Parkland, 2 Waterfront, 3 Monument), built from the P5
// district mock-up (Edits 51–57) and the Waterfront valley plan (Edits 58–61). Each district is 3 × 3 screens of 800 × 640
// in district coordinates. Per screen: game art (ground buffer, depth-sorted props, lifted layers), linked traffic (one or
// more sims per screen, one per level plane), and play data (solids, floors, stairs, water, spawns) for the player sim.
// Rule (Edit 51.2): every highway screen has two escalators, on opposite sides, at opposite ends. No trees, no flower beds:
// brutalist planters, monoliths and public sculptures (Edit 51.3). Node-loadable for tests (art is plain buffers).
(function (root) {
  'use strict';
  const NODE = typeof module !== 'undefined' && module.exports;
  const X = root.DUMMIES || require('./sim.js');
  const PIX = root.PIX || (require('./pixel.js'), root.PIX);
  const L = root.TURNLAB || require('./lab.js');
  const V = root.CIRCUS_VALLEY || require('./circus_valley.js'); // the Waterfront plan (Edits 58–61): one source of truth for its layout
  const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH;
  const W = P['world.width'], H = P['world.height'], LW = P['world.laneWidth'], OUTER = LW + P['proto.shoulderWidth'], HALF = P['world.deckWidth'] / 2, PW = P['world.parapetWidth'];
  const EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), C = P['world.deckColumn'], c32 = PIX.c32, mixK = PIX.mixK, LEDS = PIX.KX('bldgLed') || [K.lane], hyp = (a, b) => Math.sqrt(a * a + b * b); // P6: Math.hypot is slow
  const N = { grass: c32('#0E1712'), grass2: c32('#13211A'), grass3: c32('#1C3024'), water: c32('#08101E'), water2: c32('#13234A'), pave: c32('#2C3243'), pave2: c32('#384056'),
    magenta: c32('#FF5FD2'), cyan: c32('#3FD0FF'), stone: c32('#C9D3DA'), stoneD: c32('#8C98A6'), stoneL: c32('#EEF2F4'), tile: c32('#262C3C'), tile2: c32('#30374B') };
  const CON = { m: c32('#4A5160'), d: c32('#363C49'), l: c32('#7D8799'), x: c32('#22262F'), g: c32('#1F3A27'), g2: c32('#2A4A32'), t: c32('#3B4250'), t2: c32('#444B5A') }; // board-marked concrete
  const ISL = c32('#5F6878'); // the monument's island paving
  const Z1 = EXT(P['world.deckHeight']), Z2 = EXT(P['world.highHeight']), SWD = P['world.stairWidth'], INSET = P['world.deckEscalatorInset'];
  // P6: solids captured while a screen is built. Every mass, pool and sculpture drawn into the ground records its footprint
  // (16-unit cells, merged into row runs) as a level-0 solid of the screen being built.
  let CAP = null;
  function capture(fp, x0, y0, x1, y1, world) { // fp in art px (or world units when world), the box in the same units
    if (!CAP) return;
    const s = world ? 1 : U, step = 16 / s, out = CAP;
    for (let y = y0; y <= y1; y += step) {
      let run = null;
      for (let x = x0; x <= x1 + 1e-9; x += step) {
        const cx = x + step / 2, cy = y + step / 2, on = fp(cx, cy);
        if (on && !run) run = { x: x * s, y: y * s, w: 0, h: 16 };
        if (on) run.w = x * s + 16 - run.x;
        if ((!on || x + step > x1) && run) { out.push({ x: run.x, y: run.y, w: run.w, h: run.h, kind: 'mass' }); run = null; }
      }
    }
  }
  const captureRect = (x, y, w, h, kind) => { if (CAP) CAP.push({ x, y, w, h, kind: kind || 'block' }); };
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
    const onScreen = (r) => { let s = 0; for (let i = 1; i < r.length; i++) for (let k = 0; k < 16; k++) { const f = (k + 0.5) / 16, mx = r[i - 1][0] + (r[i][0] - r[i - 1][0]) * f, my = r[i - 1][1] + (r[i][1] - r[i - 1][1]) * f; if (mx >= 0 && mx <= W && my >= 0 && my <= H) s += hyp(r[i][0] - r[i - 1][0], r[i][1] - r[i - 1][1]) / 16; } return s; }; // Edit 56: sampled, so a short run ending inside the screen counts
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
    captureRect(x0, y0, x1 - x0, y1 - y0, 'pool');
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
    capture((x, y) => fp(Math.floor(x), Math.floor(y)), x0, y0, x1, y1); // P6: the mass is solid at Z0
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
  // Edit 55: planting in three sizes. Large: a great lawn over the largest free block of cells, at least
  // world.gardenLargeCells square and at most one cell more each way; inner paths go. Medium: one-cell beds only where they
  // frame the lawn or the tile's set piece, in at most world.gardenBedTypes types. Small: planters world.gardenPlanter across,
  // two to each open square and one at each corner of the lawn. Returns the path crossings left free (for sculptures).
  const GLC = P['world.gardenLargeCells'], GBT = P['world.gardenBedTypes'], GPL = P['world.gardenPlanter'];
  const MED = [['hedge', 'reeds'], ['terrace', 'hedge'], ['reeds', 'moss'], ['hedge', 'terrace']];
  const GREAT = [c32('#23432C'), c32('#2A5034'), c32('#5E9E4A')], greatC = (x, y) => (hsh(x, y) % 47 === 0 ? GREAT[2] : GREAT[Math.floor(x / 8) % 2]);
  function smallPlanter(B, wx, wy) { // a concrete box with a clipped hedge top
    const a = GPL / U / 2, b = a * 0.7, x = wx / U, y = wy / U, fp = chamf(Math.round(x - a), Math.round(y - b), Math.round(x + a), Math.round(y + b), 3);
    mass(B, fp, x - a, y - b, x + a, y + b, 0, 3, 'conc', LEDS[1], true); mass(B, (px, py, i) => fp(px, py, (i || 0) + 2), x - a, y - b, x + a, y + b, 3, 4, 'hedge', null, false, 'hedge');
  }
  function gardenPlan(B, o) { // o: { bedOk(wx, wy), rng, leds, pools, anchor: [x, y, w, h] or null }
    const nc = Math.ceil(W / GW), nr = Math.ceil(H / GH), rect = (gx, gy, nx, ny) => [gx * GW + GP / 2, gy * GH + GP / 2, Math.min(W - 8, (gx + nx) * GW - GP / 2), Math.min(H - 8, (gy + ny) * GH - GP / 2)];
    const okR = ([x0, y0, x1, y1]) => { for (let x = x0; x <= x1; x += 16) for (let y = y0; y <= y1; y += 16) if (!o.bedOk(x, y)) return false; return o.bedOk(x1, y1) && o.bedOk(x1, y0) && o.bedOk(x0, y1); };
    const used = Array.from({ length: nr }, (_, gy) => Array.from({ length: nc }, (_, gx) => (okR(rect(gx, gy, 1, 1)) ? 0 : -1))); // -1 not free, 0 free, 1 bed, 2 lawn, 3 open square
    let best = null; // the largest free block: area first, then nearest the screen's centre
    for (let ny = GLC; ny <= GLC + 1; ny++) for (let nx = GLC; nx <= GLC + 1; nx++) for (let gy = 0; gy + ny <= nr; gy++) for (let gx = 0; gx + nx <= nc; gx++) {
      let all = true; for (let j = 0; j < ny && all; j++) for (let i = 0; i < nx; i++) if (used[gy + j][gx + i] !== 0) { all = false; break; }
      if (!all) continue;
      const r = rect(gx, gy, nx, ny), a = nx * ny, d = hyp((r[0] + r[2]) / 2 - W / 2, (r[1] + r[3]) / 2 - H / 2);
      if (!best || a > best.a || (a === best.a && d < best.d)) best = { gx, gy, nx, ny, r, a, d };
    }
    const lawn = best ? [best.r[0], best.r[1], best.r[2] - best.r[0], best.r[3] - best.r[1]] : null;
    if (best) {
      for (let j = 0; j < best.ny; j++) for (let i = 0; i < best.nx; i++) used[best.gy + j][best.gx + i] = 2;
      const [x0, y0, x1, y1] = best.r;
      { const cw = chamf(x0, y0, x1, y1, 24), fpA = (x, y, ins) => cw((x + 0.5) * U, (y + 0.5) * U, (ins || 0) * U), ax0 = Math.floor(x0 / U), ay0 = Math.floor(y0 / U), ax1 = Math.ceil(x1 / U), ay1 = Math.ceil(y1 / U);
        for (let y = ay0; y <= ay1; y++) for (let x = ax0; x <= ax1; x++) if (fpA(x, y)) B.put(x, y, !fpA(x, y, 1) ? CON.l : greatC(x, y)); // the great lawn, mown in broad stripes
        mass(B, (x, y) => fpA(x, y, 1) && !fpA(x, y, 4), ax0, ay0, ax1, ay1, 0, 3, 'hedge', o.leds[0], true, 'hedge'); } // a clipped hedge frames it
    }
    const pair = MED[Math.floor(o.rng() * MED.length)].slice(0, Math.max(1, GBT)), m = GP + 8;
    const touch = (r, A) => !!A && r[0] <= A[0] + A[2] + m && r[2] >= A[0] - m && r[1] <= A[1] + A[3] + m && r[3] >= A[1] - m;
    const open = [];
    for (let gy = 0; gy < nr; gy++) for (let gx = 0; gx < nc; gx++) {
      if (used[gy][gx] !== 0) continue;
      const r = rect(gx, gy, 1, 1), [x0, y0, x1, y1] = r, type = touch(r, lawn) ? pair[0] : touch(r, o.anchor) ? pair[pair.length - 1] : null;
      if (!type) { used[gy][gx] = 3; open.push(r); continue; } // an open square
      const cw = chamf(x0, y0, x1, y1, 16), fpA = (x, y, ins) => cw((x + 0.5) * U, (y + 0.5) * U, (ins || 0) * U);
      drawBed(B, type, fpA, cw, Math.floor(x0 / U), Math.floor(y0 / U), Math.ceil(x1 / U), Math.ceil(y1 / U), r, o.leds[(gx + gy * 2) % o.leds.length]); used[gy][gx] = 1;
    }
    for (const [x0, y0, x1, y1] of open) for (const f of [1 / 3, 2 / 3]) smallPlanter(B, x0 + (x1 - x0) * f, (y0 + y1) / 2); // small: two to each open square, on its axis
    if (best) for (const [x, y] of [[best.r[0] - GP / 2, best.r[1] - GP / 2], [best.r[2] + GP / 2, best.r[1] - GP / 2], [best.r[0] - GP / 2, best.r[3] + GP / 2], [best.r[2] + GP / 2, best.r[3] + GP / 2]]) if (o.bedOk(x, y)) smallPlanter(B, x, y); // and one at each corner of the lawn
    const crossings = []; // the crossings left for sculptures: away from the lawn's corners
    for (let j = 1; j < nr; j++) for (let i = 1; i < nc; i++) { const x = i * GW, y = j * GH; if (o.bedOk(x, y) && !(best && touch([x - 1, y - 1, x + 1, y + 1], lawn))) crossings.push([x, y]); }
    return crossings;
  }
  function gardenSculptures(B, ok, diag, rng, n, free) { // medium sculptures on path crossings (Edit 55: those the planters leave)
    const c = []; for (let gy = 1; gy < Math.ceil(H / GH); gy++) for (let gx = 1; gx < Math.ceil(W / GW); gx++) { const x = gx * GW, y = gy * GH; if (ok(x, y) && (!diag || Math.abs(x + y - diag.c) > diag.w / 2 + 16) && (!free || free.some((q) => q[0] === x && q[1] === y))) c.push([x, y]); }
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
  // Edit 55: three sizes. k = 1 medium; world.sculptureScaleLarge for a court's centrepiece; small pieces are lit bollards.
  function sculpture(B, ax, ay, kind, led, k) {
    { const kk = k || 1; captureRect((ax - 6 * kk) * U, (ay - 3 * kk) * U, 12 * kk * U, 6 * kk * U, 'sculpture'); }
    k = k || 1; const R = (v) => Math.max(1, Math.round(v * k)), x0 = Math.round(ax), y0 = Math.round(ay), put = (x, y, c) => B.put(x0 + x, y0 + y, c), sh = (n, w) => { for (let t = 0; t < n; t++) for (let j = -w; j <= w; j++) B.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.72); };
    for (let x = -R(5); x <= R(5); x++) for (let y = -R(2); y <= R(2); y++) if (Math.abs(x) + Math.abs(y) * 2 <= R(6)) put(x, y, y > 0 ? CON.d : CON.l); // chamfered plinth
    if (kind === 'obelisk') { sh(R(16), R(2)); for (let h = 1; h < R(26); h++) { const w = h > R(20) ? R(1) : R(2); for (let i = -w; i <= w; i++) put(i, -h, i === -w ? CON.l : i === w ? led : CON.m); } put(0, -R(26), K.white); put(0, -R(26) - 1, led); }
    else if (kind === 'ring') { sh(R(12), R(3)); for (let h = 1; h < R(6); h++) for (let i = 0; i < R(1); i++) put(i, -h, CON.m); const n = Math.round(64 * k); for (let a = 0; a < n; a++) { const t = a / n * Math.PI * 2; for (let w = 0; w < R(1); w++) put(Math.round(Math.cos(t) * (R(6) - w)), Math.round(-R(14) + Math.sin(t) * (R(9) - w)), a % 8 < 5 ? led : K.white); } }
    else if (kind === 'cubes') { sh(R(12), R(4)); for (const [s0, ox, h0] of [[8, -1, 0], [6, 1, 8], [4, 0, 14]]) { const sz = R(s0); for (let y = 0; y < sz; y++) for (let x = 0; x < sz; x++) put(R(ox) + x - Math.floor(sz / 2), -R(h0) - y - 1, x === 0 || y === sz - 1 ? led : y === 0 ? CON.l : CON.m); } }
    else if (kind === 'arch') { sh(R(14), R(5)); for (let h = 1; h < R(20); h++) for (const px of [-R(6), R(5)]) for (let i = 0; i < R(2); i++) put(px + i, -h, i === 0 ? CON.l : CON.m); for (let x = -R(6); x <= R(6); x++) for (let t = 0; t < R(2); t++) put(x, -R(20) + t, t === 0 ? CON.l : led); }
    else { sh(R(10), R(4)); for (let q = 0; q < 5; q++) for (let h = 1; h < R(10 + q * 3); h++) for (let i = 0; i < R(1); i++) put(-R(6) + R(q * 3) + i, -h, h > R(6 + q * 3) ? led : CON.m); } // light fins
  }
  function bollard(B, ax, ay, led) { monolith(B, ax, ay, 0, Math.round(16 * P['world.sculptureScaleSmall']), led); } // the small piece: a lit post
  // A sculpture court at grade: lattice paving and a low kerb; one large piece on the axis, two medium either side,
  // world.courtSmallCount lit bollards along the front edge (art px box).
  function sculptureCourt(B, x0, y0, x1, y1, k, big, mids, led) {
    const fp = chamf(x0, y0, x1, y1, k);
    each((x, y) => { if (!fp(x, y, -2)) return; B.put(x, y, !fp(x, y, 0) ? CON.l : !fp(x, y, 1) ? CON.m : ((x + y) % 12 === 0 || ((x - y) % 12 + 12) % 12 === 0) ? mixK(N.tile, N.cyan, 0.45) : (x % 6 === 0 || y % 6 === 0) ? N.tile2 : N.tile); });
    const cx = (x0 + x1) / 2, n = P['world.courtSmallCount'], L2 = P['world.sculptureScaleLarge'];
    sculpture(B, cx, y0 + (y1 - y0) * 0.42, big, led, L2);
    mids.forEach((kd, i) => sculpture(B, i ? x1 - (x1 - x0) * 0.2 : x0 + (x1 - x0) * 0.2, y0 + (y1 - y0) * 0.6, kd, LEDS[(i + 1) % LEDS.length], 1));
    for (let i = 0; i < n; i++) bollard(B, x0 + k * 0.5 + (x1 - x0 - k) * i / (n - 1), y1 - 4, LEDS[i % 2 ? 0 : 3 % LEDS.length]);
  }
  const SCULPT = ['obelisk', 'ring', 'cubes', 'arch', 'fins'];
  // ---------- escalators: two per highway screen, on opposite sides, at opposite ends (Edit 51.2)
  function escalators(off, z, half, x0, x1) { // north at the west end, south at the east end
    const run = X.stairRun(P, 0, z), a = x0 === undefined ? INSET : x0, b = x1 === undefined ? W - INSET - SWD : x1;
    return [{ x: a, y: off - half - run, w: SWD, h: run, axis: 'y', low: off - half - run, high: off - half, side: -1, z },
      { x: b, y: off + half, w: SWD, h: run, axis: 'y', low: off + half + run, high: off + half, side: 1, z }];
  }
  const stairProp = (st, lift) => ({ spr: PIX.stairs(st, 0, lift), x: st.x / U, y: st.y / U, by: st.y + st.h, over: st.side > 0 || st.axis === 'x', stair: st }); // P6: the flight, for play
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
    return { L: Lr, lift, z, field: f, openings: openings || [], cols, front: cy + Rc + HALF, ring: { cx, cy, Rc, geoms }, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && f.D[k] <= HALF + 12; }, shadeOn: (B) => {
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
    return { dk, L: Lr, lift: ext, z, cols, front: off + HALF, openings: stairs.map((st) => ({ a0: st.x, a1: st.x + st.w, side: st.side })), inBand: (wx, wy) => Math.abs(wy - off) < HALF + 12 };
  }
  // ---------- the walkway at Z1: a union of polygons, square ends where it meets a podium roof or an escalator head
  // P6.2 (Edit 64): one opening per road crossing, one world.tileSize module, centred on the road's centre line, one side only:
  // south on an east–west walkway, east on a north–south one. A straight drop lands on the centre line; steer to a lane.
  // roadC(x, y): distance to the nearest Z0 road centre line (each carriageway of a split road).
  function walkGaps(polys, roadC) {
    const T = P['world.tileSize'];
    return polys.filter((p) => p.spine).map((p) => {
      const path = X.makePath(p.spine), gaps = [];
      if (roadC) {
        const ds = []; for (let a = 0; a <= path.length; a += 2) { const q = X.pathAt(path, a); ds.push(roadC(q.x, q.y)); }
        for (let i = 0; i < ds.length; i++) {
          if (!(ds[i] < 8) || (i > 0 && ds[i - 1] < 8)) continue; // the start of a run over the centre line
          let j = i; while (j + 1 < ds.length && ds[j + 1] < 8) j++;
          if ((j - i) * 2 > 120) continue; // along a road, not across it
          let m = Infinity; for (let k = i; k <= j; k++) m = Math.min(m, ds[k]);
          const at = []; for (let k = i; k <= j; k++) if (ds[k] === m) at.push(k * 2);
          const c = (at[0] + at[at.length - 1]) / 2;
          if (c <= T || c >= path.length - T || gaps.some(([a0, a1]) => c > a0 - T && c < a1 + T)) continue;
          const q0 = X.pathAt(path, c - 2), q1 = X.pathAt(path, c + 2), tl = hyp(q1.x - q0.x, q1.y - q0.y) || 1, nx = -(q1.y - q0.y) / tl, ny = (q1.x - q0.x) / tl;
          gaps.push([c - T / 2, c + T / 2, ny + 0.5 * nx >= 0 ? 1 : -1]); // the open side, as a sign of the spine's lateral offset
        }
      }
      p.gaps = gaps;
      return { p, path, gaps };
    });
  }
  function walkwayLayer(polys, roofs, joins, colOk, roadC) {
    const M = new Uint8Array(AW * AH), R = new Uint8Array(AW * AH), Lr = new PIX.Buf(AW, AH), inRect = (r, wx, wy) => wx >= r[0] && wx <= r[0] + r[2] && wy >= r[1] && wy <= r[1] + r[3];
    const spines = walkGaps(polys, roadC), HW = P['world.walkwayWidth'] / 2;
    const gapAt = (wx, wy) => { for (const sp of spines) { if (!sp.gaps.length) continue; const pr = X.pathProject(sp.path, wx, wy); if (Math.abs(pr.lat) < HW + 6 && sp.gaps.some(([a0, a1, sd]) => pr.s >= a0 && pr.s <= a1 && pr.lat * sd > 0)) return true; } return false; };
    each((x, y, wx, wy, k) => { if (polys.some((p) => PIX.inPoly(p, wx, wy))) M[k] = 1; if (roofs.some((r) => inRect(r, wx, wy))) R[k] = 1; else if (joins.some((r) => inRect(r, wx, wy))) R[k] = 2; });
    const out = (x, y) => x < 0 || y < 0 || x >= AW || y >= AH || (!M[y * AW + x] && !R[y * AW + x]), on = (k) => M[k] && !R[k];
    each((x, y, wx, wy, k) => {
      if (!on(k)) return;
      let edge = 9; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (out(x + i, y + j)) edge = Math.min(edge, Math.max(Math.abs(i), Math.abs(j)));
      if (edge <= 3 && gapAt(wx, wy)) { Lr.put(x, y, edge === 1 ? ((x + y) % 3 ? K.deckJoint : K.bldgDark) : K.deck2); return; } // broken parapet: the slab edge shows
      Lr.put(x, y, edge === 1 ? K.jerseyO : edge === 2 ? (((x + y) % 6) < 3 ? N.magenta : K.jerseyTop) : edge === 3 ? K.jersey : (x + y) % 10 === 0 ? K.deckJoint : (((x >> 2) + (y >> 2)) % 2 ? K.deck : K.deck2));
    });
    each((x, y, wx, wy, k) => { if (!on(k)) return; let edge = 9; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (out(x + i, y + j)) edge = Math.min(edge, Math.max(Math.abs(i), Math.abs(j))); if (edge > 3 || gapAt(wx, wy)) return; if (gapAt(wx + U, wy) !== gapAt(wx - U, wy) || gapAt(wx, wy + U) !== gapAt(wx, wy - U)) Lr.put(x, y, K.white); }); // snapped parapet ends
    each((x, y, wx, wy, k) => { if (M[k] && !R[k]) return; for (let d = 1; d <= 4; d++) { const kk = (y - d) * AW + x; if (y - d >= 0 && on(kk)) { Lr.put(x, y, d === 1 ? K.jerseyTop : d === 2 ? CON.m : d === 3 ? N.cyan : K.bldgOutline); break; } } }); // fascia with an LED strip
    // round columns under the walkway, on pavements and the island, never in a lane
    const cols = [], cw = P['world.walkwayColumn'];
    for (const p of polys.filter((q) => q.spine)) walk(p.spine, P['world.deckPillarSpacing'] / 2, (x, y) => {
      if (!colOk(x, y) || roofs.concat(joins).some((r) => inRect([r[0] - 16, r[1] - 16, r[2] + 32, r[3] + 32], x, y)) || cols.some((q) => hyp(q.cx - x, q.cy - y) < 64)) return;
      cols.push({ cx: x, cy: y, key: y + cw / 2, x: x - cw / 2, y: y - cw / 2, spr: PIX.column(Math.round(cw / U), Math.round(cw / U), Z1) });
    });
    return { L: Lr, lift: Z1, z: 1, cols, front: 1e6, walk: true, polys, roofs, joins, spines, gapAt, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && M[k] === 1; }, shadeOn: (B) => {
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
    { id: 'parkland', name: 'Parkland', quota: P['world.district.parkland.quota'], storeys: [2, 5], start: ['B2', 'center'], // P6.1: every district starts in its centre tile
      mood: 'Calm, water, concrete and planting. Two Z1 highways meet at a four-arm ring over the pools; a 45° boulevard passes beneath.',
      roads: [{ id: 'boulevard', pts: [[40, -200], [2360, 2120]] }, { id: 'loop', pts: fil([[527, 287], [400, 414], [400, 1736], [1636, 1736], [1806, 1566], [2206, 1166], [1760, 720], [1760, -200]], [0, RB, RB, 96, RB, RB, RB, 0]) }], // Edit 56: joins the boulevard at 90° in A1; meets it at a roundabout in C3
      junctions: [{ tile: 'A1', at: [527, 287], major: 'boulevard' }],
      roundabouts: [{ tile: 'C3', at: [206, 286], arms: ['NW', 'NE', 'SE', 'SW'], bends: { SW: { dir: [-1, 0], at: 240.3, Rb: 96 } } }], // Edit 56: the four-way takes a street roundabout; the street's SW arm turns west outside it
      ring: { tile: 'B2', z: 1, arms: ['W', 'N', 'E', 'S'] },
      decks: [{ hz: true, at: 996, z: 1 }, { hz: false, at: 1200, z: 1 }], park: true, // Edit 55.2: row 2 at 996 so the lifted B2 ring draws at the screen's centre
      deckLinks: { B1: [{ y: 304, h: 32, side: -1 }, { y: 304, h: 32, side: 1 }] }, // Edit 55.2: the Z1 walkway joins the B1 highway at both parapets (P6: at the walkway's footprint; the deck lifts as every floor)
      tiles: {
        A1: ['Start, top edge. The 45° boulevard; the avenue curves to join it at 90° and gives way. The Z1 walkway from B1 lands by escalator', 'Reservoir terraces: three stepped pools', 'both'],
        B1: ['The Z1 highway runs north–south; escalators west (north end) and east (south end). A Z1 walkway crosses the garden and joins the highway at both parapets. The boulevard cuts the corner', 'Cascade: water steps beside the highway', 'both'],
        C1: ['The avenue under a Z1 footbridge that runs west to the B1 highway; escalator at its east end; drop onto cars', 'Lantern pavilion', 'both'],
        A2: ['The avenue passes under the Z1 highway at 90°; escalators north (west end) and south (east end)', 'Canal along the highway', 'both'],
        B2: ['Four-arm Z1 roundabout (W, N, E, S). Give way to the ring; the inner lane is the orbit lane. The boulevard passes beneath, through the hole', 'Reflecting pools under the ring', 'both'],
        C2: ['The avenue comes up from the C3 roundabout at 45°, turns 90° and passes under the Z1 highway at 45°', 'Amphitheatre terraces', 'both'],
        A3: ['A wide R160 bend (buses may use it)', 'Belvedere: four tiers and a stair up to a lawn, the monolith orchard on top', 'both'],
        B3: ['The garden street passes under the Z1 highway at 90°; escalators', 'Sculpture court: a large obelisk, two rings, a row of lit bollards', 'both'],
        C3: ['Street roundabout where the street meets the boulevard: four arms at 90°, the street turning west outside it', 'Sculpture court at grade: a large arch, two medium pieces, a row of lit bollards', 'scenery'] } },
    { id: 'monument', name: 'Monument', quota: P['world.district.monument.quota'], storeys: [6, 12], start: ['B2', 'center'],
      mood: 'Neon commerce, LED walls. One road snakes under two north–south highways and splits round the monument.',
      roads: [{ id: 'snake', pts: fil([[-200, 320], [2240, 320], [2240, 864], [2144, 960], [240, 960], [240, 1504], [336, 1600], [1120, 1600], [1280, 1760], [2600, 1760]]) }],
      split: { tile: 'B2' },
      decks: [{ hz: false, at: 560, z: 1 }, { hz: false, at: 1840, z: 2 }],
      chongqing: { tile: 'C2', tower: [112, 140, 256, 90], storeys: 12, plaza: [16, 530, 144, 100], link: [554, 610] }, // P6: the link at the plaza's footprint (the deck lifts by Z2) // Edit 54: the Z2 highway runs through a tower; a roof plaza opens off it
      tiles: {
        A1: ['Start, west edge. The road passes under the Z1 highway (north–south) at 90°; escalators', 'LED-wall tower facing the entry', 'both'],
        B1: ['A Z1 skybridge crosses the road at 90°, from a podium roof to the walkway ring', 'Podium and tower at the bridge head', 'both'],
        C1: ['Under the Z2 highway at 90°, then an R96 bend south; Z2 escalators (run 112)', 'LED drum tower in the bend', 'both'],
        A2: ['Under the Z1 highway at 90°, then an R96 bend south', 'Neon arcade along the road', 'both'],
        B2: ['The road splits round the monument\'s island; the walkway ring bridges both lanes at Z1; skybridge north', 'The monument', 'both'],
        C2: ['A 45° corner cut, then under the Z2 highway at 90°. The highway runs through a tower; a roof plaza at Z2 opens off its parapet, and an escalator drops from the plaza to the street', 'Portal tower and roof plaza (Chongqing)', 'both'],
        A3: ['A 45° corner cut, then under the Z1 highway at 90°', 'Stacked LED cubes, each cantilevered off the one below', 'both'],
        B3: ['A 45° jog between two LED walls; a Z1 skybridge crosses the jog at 90°', 'LED canyon and its skybridge', 'both'],
        C3: ['Under the Z2 highway at 90°; the exit through an LED gateway', 'LED gateway arch over the road', 'both'] } },
  ];
  const TILE = (c, r) => 'ABC'[c] + (r + 1);
  // ---------- 2 Waterfront (P6, Edit 62): the valley by the river, built from its plan (circus_valley.js, Edits 58–61).
  // A hill at Z1 walled by towers along the top edge; the valley avenue through the circus; a tunnel north from the cove;
  // two bridges from the ridge road straight south over the valley, the beach, the coastal drive and the river.
  const VG = V.geo, VP = V.PLAN, VR = V.check(VP), ZH = P['world.deckHeight'], RZ = VG.RIVER * ZH, RIV = EXT(-RZ); // the river surface, RIV art px below Z0
  const HILLP = VG.NORTH_POLY, RIVERP = VG.RIVER_POLY, LANDP = VG.LAND_POLY, MOUTH = VP.mouth, SUNX = PIX.SUN.x, SUNY = PIX.SUN.y, SHK = P['proto.art.shadowScale'];
  function polyMask(poly) { // P6: the polygon rasterised once at art-px centres in district coordinates (scanline, even-odd)
    const x0 = -W, y0 = -H, nw = Math.round(5 * W / U), nh = Math.round(5 * H / U), M = new Uint8Array(nw * nh);
    for (let j = 0; j < nh; j++) {
      const y = y0 + (j + 0.5) * U, xs = [];
      for (let i = 0, k = poly.length - 1; i < poly.length; k = i++) { const a = poly[i], c = poly[k]; if ((a[1] > y) !== (c[1] > y)) xs.push((c[0] - a[0]) * (y - a[1]) / (c[1] - a[1]) + a[0]); }
      xs.sort((p, q) => p - q);
      for (let n = 0; n + 1 < xs.length; n += 2) { const i0 = Math.max(0, Math.ceil((xs[n] - x0) / U - 0.5)), i1 = Math.min(nw - 1, Math.ceil((xs[n + 1] - x0) / U - 0.5) - 1); for (let i = i0; i <= i1; i++) M[j * nw + i] = 1; }
    }
    return (dx, dy) => { const i = Math.floor((dx - x0) / U), j = Math.floor((dy - y0) / U); return i < 0 || j < 0 || i >= nw || j >= nh ? PIX.inPoly(poly, dx, dy) : M[j * nw + i] === 1; };
  }
  const inHill = polyMask(HILLP), inRiver = polyMask(RIVERP);
  const HILL_SOLID = (() => { // the hill as a Z0 solid, the tunnel cut through it from the cove head to beyond the top edge
    const out = [[-200, -260], [2600, -260]];
    for (const p of VG.NORTH.slice().reverse()) { out.push(p); if (p[0] === 1360 && p[1] === 360) out.push([MOUTH[0] + OUTER, 360], [MOUTH[0] + OUTER, -400], [MOUTH[0] - OUTER, -400], [MOUTH[0] - OUTER, 360]); }
    return out;
  })();
  const WROAD = (id) => VP.roads.find((r) => r.id === id), RIDGE = WROAD('North Ridge Road');
  const BRIDGE_GAPS = [[920, 1000], [1400, 1480], [1740, 1820]]; // broken parapets: over the avenue, over the drive, over the river (drops)
  const WATER = { id: 'waterfront', name: 'Waterfront', quota: P['world.district.waterfront.quota'], storeys: [4, 10], start: ['B2', 'center'],
    mood: 'A hill walled by towers; a river below. The valley avenue meets the tunnel and the beach road at the circus; the hill\'s bridges cross the drive and the river.',
    roads: VP.roads.filter((r) => r.z === 0).map((r) => ({ id: r.id, pts: r.pts })), // Valley Avenue, North Tunnel, Beach Road, Coastal Drive
    junctions: [{ tile: 'B3', at: [400, 320], major: 'Coastal Drive' }],
    roundabouts: [{ tile: 'B2', at: [400, 320], arms: ['W', 'N', 'E', 'S'] }],
    decks: ['West Bridge', 'East Bridge'].map((id) => ({ hz: false, at: WROAD(id).pts[0][0], z: 1, rows: [1, 2], from: 760, noEsc: true, gaps: BRIDGE_GAPS })),
    hill: { roads: [{ id: RIDGE.id, pts: RIDGE.pts }].concat(['West Bridge', 'East Bridge'].map((id) => ({ id, pts: [WROAD(id).pts[0], [WROAD(id).pts[0][0], 900]] }))),
      junctions: [{ tile: 'A1', at: [400, 240], major: RIDGE.id }, { tile: 'C1', at: [400, 240], major: RIDGE.id }], sims: ['A1', 'B1', 'C1'] },
    tiles: Object.fromEntries(Object.entries(VP.tiles).map(([k, v]) => [k, [v[0], v[1], 'both']])) };
  // the plan's stairs as the kit's flights (district → screen coordinates): x/y/w/h, axis, low (foot) and high (head), z
  function flight(head, foot, z) {
    const ax = head[1] === foot[1] ? 'x' : 'y', a = ax === 'x' ? Math.min(head[0], foot[0]) : head[0] - SWD / 2, b = ax === 'x' ? head[1] - SWD / 2 : Math.min(head[1], foot[1]);
    return { x: a, y: b, w: ax === 'x' ? Math.abs(head[0] - foot[0]) : SWD, h: ax === 'y' ? Math.abs(head[1] - foot[1]) : SWD, axis: ax, low: ax === 'x' ? foot[0] : foot[1], high: ax === 'x' ? head[0] : head[1], side: ax === 'x' ? 0 : 1, z: z || 1 };
  }
  const WSTAIRS = (() => { // every flight in the district: cliff escalators (A2, C2 from the plan; B2 on the straight wall), bridge escalators (A3, C3), the cove's two stairs, terrace and landing stairs
    const R1 = X.stairRun(P, 0, 1), out = [];
    for (const e of VR.esc) if (['A2', 'C2'].includes(e.tile)) out.push(flight(e.head, e.foot));
    for (const x of [840, 1560]) out.push(flight([x, 760], [x, 760 + R1])); // B2: on the straight wall either side of the flares
    for (const bx of [400, 2000]) { out.push(flight([bx - HALF, 1308], [bx - HALF - R1, 1308])); out.push(flight([bx + HALF, 1308], [bx + HALF + R1, 1308])); } // A3, C3: up to the bridge from the beach, one each side
    for (const st of VP.coveStairs) out.push(flight(st.head, st.foot));
    for (const b of VP.buildings) if (b.stair) out.push(flight(b.stair.head, b.stair.foot));
    return out;
  })();
  const lvl0 = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [] }, extra || {});
  const SAND = [c32('#4B4946'), c32('#5C5A57'), c32('#3E3C3A')], WAT = [N.water, N.water2, c32('#0C1830')];
  // a deck on pilotis (beach terrace, beach landing): slab at Z1, columns to the sand, an optional canopy, a planter; art px
  function terraceSprite(w, h, canopy, led) {
    const top = Z1 + (canopy ? 7 : 0) + 2, S = { w: w + 2, h: h + top + 2, ox: 0, oy: top, d: new Uint32Array((w + 2) * (h + top + 2)) };
    const put = (x, y, c) => { const X0 = x, Y0 = y + top; if (X0 >= 0 && Y0 >= 0 && X0 < S.w && Y0 < S.h) S.d[Y0 * S.w + X0] = c; };
    for (const cx of [3, Math.round(w / 2), w - 5]) for (let z = 2; z < Z1; z++) for (let i = 0; i < 3; i++) put(cx + i, h - 3 - z, i === 2 ? K.columnD : K.column); // pilotis under the front edge
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) put(x, y - Z1, x === 0 || x === w - 1 || y === 0 ? CON.l : (x % 8 === 0 || y % 8 === 0) ? N.pave2 : N.pave); // the deck, lifted
    for (let x = 0; x < w; x++) { put(x, h - Z1, led); put(x, h - Z1 + 1, CON.m); put(x, h - Z1 + 2, CON.x); } // its LED front edge and slab face
    const px = 4, py = h - 14; for (let y = 0; y < 8; y++) for (let x = 0; x < 12; x++) put(px + x, py + y - Z1 - 2, y === 7 ? CON.m : x === 0 || x === 11 || y === 0 ? CON.l : (x * 3 + y) % 5 ? CON.g : CON.g2); // a planter on the deck
    if (canopy) { const x0 = Math.round(w * 0.5), y1 = Math.round(h * 0.62); for (const cx of [x0 + 1, w - 3]) for (let z = 0; z < 6; z++) put(cx, y1 - Z1 - z, CON.l); for (let y = 4; y < y1; y++) for (let x = x0; x < w - 2; x++) put(x, y - Z1 - 7, y === y1 - 1 ? N.magenta : (x - x0) % 5 === 0 ? N.stoneD : c32('#B9C2C8')); }
    return S;
  }
  // a Chongqing hanging house over the water: braced stilts from the river, three storeys with balconies, a roof terrace at Z1 under a canopy
  function stiltSprite(w, h, led) {
    const base = RIV, top = Z1 + 8, S = { w: w + 2, h: h + top + base + 2, ox: 0, oy: top, d: new Uint32Array((w + 2) * (h + top + base + 2)) };
    const put = (x, y, c) => { const Y0 = y + top; if (x >= 0 && Y0 >= 0 && x < S.w && Y0 < S.h) S.d[Y0 * S.w + x] = c; };
    const z12 = EXT(12), floorZ = (k) => z12 + k * EXT(P['world.storeyHeight']); // house floors from Z0 + 12
    for (let x = 2; x < w - 2; x += Math.max(4, Math.round((w - 4) / 5))) for (let y = h - 1 + base; y > h - 1 - z12; y--) { put(x, y, K.columnD); put(x + 1, y, K.column); } // stilts from the water
    for (let x = 2; x + 6 < w - 2; x += 6) for (let t = 0; t < 6; t++) { put(x + t, h - 1 + base - t, CON.l); put(x + 6 - t, h - 1 + base - t, CON.l); } // bracing
    const roofY = h - Z1; // the roof (terrace) at Z1
    for (let y = h - 1 - z12; y >= roofY; y--) for (let x = 1; x < w - 1; x++) { const k = h - 1 - z12 - y, f = k % EXT(P['world.storeyHeight']); put(x, y, f === 0 ? CON.l : f < 3 && (x * 7 + y) % 9 < 5 ? (x % 4 ? N.cyan : K.white) : c32('#2A3245')); } // the front face: balconies and lit windows
    for (let y = 0; y < h - 10; y++) for (let x = 0; x < w; x++) put(x, y - Z1, x === 0 || x === w - 1 || y === 0 ? CON.l : (x % 6 === 0 || y % 6 === 0) ? N.pave2 : N.pave); // roof terrace
    for (let x = 0; x < w; x++) put(x, h - 10 - Z1, led);
    const cx0 = Math.round(w * 0.45); for (const cx of [cx0, w - 3]) for (let z = 0; z < 6; z++) put(cx, h - 16 - Z1 - z, CON.l);
    for (let y = 3; y < h - 16; y++) for (let x = cx0; x < w - 2; x++) put(x, y - Z1 - 7, y === h - 17 ? N.magenta : (x - cx0) % 5 === 0 ? N.stoneD : c32('#B9C2C8')); // the canopy
    return S;
  }
  // the tunnel portal (Edit 61): a concrete frame 8 proud of the cove head wall, flush with the hilltop; its opening transparent
  function portalSprite() {
    const pw = 8, wO = Math.round(2 * OUTER / U), w = wO + 2 * pw, hFace = Z1 + 4, S = { w, h: hFace + 6, ox: Math.round(w / 2), oy: hFace + 2, d: new Uint32Array(w * (hFace + 6)) };
    const put = (x, y, c) => { if (x >= 0 && y >= 0 && x < S.w && y < S.h) S.d[y * S.w + x] = c; }, open = EXT(0.7 * ZH);
    for (let y = 0; y < 6; y++) for (let x = 0; x < w; x++) put(x, y, y === 0 ? N.stoneL : CON.l); // coping
    for (let y = 6; y < hFace + 6; y++) for (let x = 0; x < w; x++) {
      const inOpen = x >= pw && x < w - pw && y >= hFace + 6 - open;
      if (inOpen) continue;
      put(x, y, x % 4 === 0 ? CON.d : y === hFace + 6 - open - 1 && x >= pw && x < w - pw ? N.cyan : CON.m);
    }
    for (const lx of [Math.round(pw / 2), w - Math.round(pw / 2) - 1]) { put(lx, hFace - 6, K.white); put(lx + 1, hFace - 6, K.white); put(lx, hFace - 5, N.cyan); put(lx + 1, hFace - 5, N.cyan); } // lamps on the pillars
    return S;
  }
  // the Waterfront's terrain, Z1 layer, Z1 streets and their traffic, and every flight, before the kit draws stairs
  function waterPre(sc, B, name, roadOk, runs) {
    const ox = sc.ox, oy = sc.oy, D = sc.D, hrun = [];
    for (const r of D.hill.roads) { const run = clipRun(shift(r.pts, -ox, -oy), -200, -200, W + 200, H + 200); if (run) hrun.push({ id: r.id, pts: run }); }
    const J = D.hill.junctions.find((j) => j.tile === name), simHere = D.hill.sims.includes(name);
    let hb = null, hroads = [];
    if (J) { const { arms, major } = junctionArms(hrun, J.at, J.major), geo = L.junction(X, P, arms, major, P['world.junctionTurnRadius']), s = labSim(geo, 'nobus', {}); sc.hillSim = s; hb = PIX.ground(lvl0(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops }), P, 61 + sc.col); hroads = geo.roads; }
    else if (hrun.length) { const center = hrun[0].pts, lanes = hrun.length > 1 ? [].concat(...hrun.map((r) => X.lanesOf(r.pts, P))) : null; if (simHere) sc.hillSim = sceneSim(center, [], [], lanes, false); hb = PIX.ground(lvl0(center, { arms: hrun.length > 1 ? hrun.map((r) => r.pts) : undefined, surfaces: hrun.length > 1 ? [] : undefined }), P, 63 + sc.col); hroads = hrun.map((r) => r.pts); }
    const rf = hroads.length ? PIX.roadField(hroads.map((pts) => ({ pts, dash: false })), OUTER + 40) : null;
    sc.hillRuns = hrun; sc.hillOk = (wx, wy, m) => { if (!rf) return true; const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k < 0 || k >= AW * AH || rf.D[k] > m; };
    // ground (Z0): valley paving, the beach, the river and its seawall face, the cliff faces, the tunnel's mouth; shadows (option 2)
    const face = EXT(ZH), mouthY = MOUTH[1], inMouth = (dx, dy) => dx > MOUTH[0] - OUTER && dx < MOUTH[0] + OUTER && dy <= mouthY + 2 && dy > mouthY - ZH;
    each((x, y, wx, wy) => {
      const dx = wx + ox, dy = wy + oy;
      if (inHill(dx, dy)) {
        const below = dy + face * U; // the south face shows where the hill ends within a lift below
        if (!inHill(dx, below)) {
          if (inMouth(dx, dy)) { B.shade(x, y, 0.35 + 0.5 * Math.max(0, Math.min(1, (mouthY - dy) / (face * U)))); return; } // the tunnel floor, darkening inward
          B.put(x, y, (x % 6 === 0) ? CON.x : (y % 12 === 0 ? CON.x : ((x * 5 + y * 3) % 23 === 0 ? CON.t : CON.d)));
        }
        return;
      }
      if (inRiver(dx, dy)) {
        if (!inRiver(dx, dy - RIV * U)) { B.put(x, y, x % 5 === 0 ? CON.x : CON.d); return; } // the seawall's front, the river below it
        let c = (y % 4 === 0 && (x * 5 + y) % 11 < 4) ? WAT[1] : WAT[0]; if ((x * 3 + y * 7) % 97 === 0) c = LEDS[(x + y) % LEDS.length];
        B.put(x, y, c);
        for (const t of [0.5, 1]) if (!inRiver(dx - SUNX * (-RZ) * SHK * t, dy - SUNY * (-RZ) * SHK * t)) { B.shade(x, y, 0.62); break; } // the land's shadow on the water
        return;
      }
      if (roadOk(wx, wy, OUTER)) B.put(x, y, dy >= VG.BEACH ? SAND[(x * 7 + y * 13) % 11 === 0 ? 1 : (x * 3 + y * 5) % 17 === 0 ? 2 : 0] : (x % 8 === 0 || y % 8 === 0) ? N.tile2 : N.tile);
      for (const t of [0.5, 1]) if (inHill(dx - SUNX * ZH * SHK * t, dy - SUNY * ZH * SHK * t)) { B.shade(x, y, 0.62); break; } // the hill's shadow at the cliff foot
    });
    // the hill: a layer at Z1. Plaza paving, the Z1 streets, a stone coping and an LED line along every edge
    const HB = new PIX.Buf(AW, AH);
    each((x, y, wx, wy, k) => {
      const dx = wx + ox, dy = wy + oy; if (!inHill(dx, dy)) return;
      let c = rf && rf.D[k] <= OUTER + 1 ? hb.d[k] : paveC(x, y);
      const e = [[2 * U, 0], [-2 * U, 0], [0, 2 * U], [0, -2 * U]].some(([a, b]) => !inHill(dx + a, dy + b) && dx + a > 0 && dx + a < 3 * W && dy + b > 0);
      if (e) c = [[U, 0], [-U, 0], [0, U], [0, -U]].some(([a, b]) => !inHill(dx + a, dy + b)) ? ((x + y) % 4 < 2 ? N.cyan : K.jerseyTop) : N.stoneD;
      HB.put(x, y, c);
    });
    const front = name === 'B1' ? MOUTH[1] + 8.5 - oy : Math.max(...[0, 200, 400, 600, 800].map((x) => { let y = H + 1; while (y > -200 && !inHill(x + ox, y + oy)) y -= 4; return y; })) + 0.5;
    const hill = { L: HB, lift: Z1, z: 1, cols: [], front: Math.min(H + 1, front), hill: true, props: [], inBand: (wx, wy) => inHill(wx + ox, wy + oy) };
    // the hill's buildings: edge wall, hill blocks, portal blocks over the bridges (P6: drawn on every screen they reach)
    const box = (r) => r[0] - ox < W + 40 && r[0] + r[2] - ox > -40 && r[1] - oy < H + 120 && r[1] + r[3] - oy > -40;
    VP.buildings.filter((b) => b.base === 1 && box(b.rect)).forEach((b, i) => {
      const [x, y, w, h] = b.rect, lx = x - ox, ly = y - oy, led = LEDS[(i + 1) % LEDS.length];
      if (b.type === 'edge') {
        const xs = b.cuts.concat([x + w]); let x0 = x;
        b.segs.forEach((n, j) => { const x1 = xs[j], sw = x1 - x0, sy = j % 2 ? 0 : 6, sh = h - sy - (j % 3 === 1 ? 10 : 0), S = PIX.building(Math.round(sw / U), Math.round(sh / U), n * EXT(P['world.storeyHeight']), PIX.rng(401 + j * 7), LEDS[j % LEDS.length], n);
          hill.props.push({ spr: S, x: (x0 - ox) / U, y: (sy - oy) / U, by: sy + sh - oy }); sc.solidsZ.push({ x: x0 - ox, y: sy - oy, w: sw, h: sh, z: 1 }); x0 = x1; });
        b.towers.forEach((t, j) => { const seg = b.segs[Math.max(0, xs.findIndex((c) => c > t[0] + t[2] / 2))], pod = seg * EXT(P['world.storeyHeight']), Ht = (t[4] - seg) * EXT(P['world.storeyHeight']);
          hill.props.push({ spr: ledPanel(PIX.building(Math.round(t[2] / U), Math.round(t[3] / U), Ht, PIX.rng(431 + j * 13), LEDS[(j + 2) % LEDS.length], t[4] - seg), Ht, [N.magenta, N.cyan]), x: (t[0] - ox) / U, y: (t[1] - oy) / U - pod, by: t[1] + t[3] - oy + 0.5 }); });
      } else if (b.type === 'block') {
        const Hh = b.storeys * STY; brutalShadow(HB, lx / U, ly / U, w / U, h / U, Math.round(Hh * 0.55), null);
        hill.props.push({ spr: brutal(w / U, h / U, Hh, PIX.rng(451 + i * 17), led, null, 'n', ['ziggurat', 'slab', 'cantilever', 'twin'][i % 4]), x: lx / U, y: ly / U, by: ly + h });
        sc.solidsZ.push({ x: lx, y: ly, w, h, z: 1 });
      } else if (b.type === 'portal') { // the bridge passes under, one storey clear: the opening cut from the sprite's lower face
        const Hh = b.storeys * STY, S = PIX.building(Math.round(w / U), Math.round(h / U), Hh, PIX.rng(471 + i), led, b.storeys), b0 = Math.round((b.gap[0] - x) / U), b1 = Math.round((b.gap[1] - x) / U);
        for (let j = S.h - STY; j < S.h; j++) for (let ii = b0; ii < b1; ii++) S.d[j * S.w + ii] = 0;
        for (let ii = b0 - 1; ii <= b1; ii++) { const j = S.h - STY - 1; if (j >= 0) S.d[j * S.w + Math.max(0, Math.min(S.w - 1, ii))] = N.cyan; } // a lit soffit line
        brutalShadow(HB, lx / U, ly / U, w / U, h / U, Math.round(Hh * 0.45), null);
        hill.props.push({ spr: S, x: lx / U, y: ly / U, by: ly + h });
        sc.solidsZ.push({ x: lx, y: ly, w: b.gap[0] - x, h, z: 1 }, { x: b.gap[1] - ox, y: ly, w: x + w - b.gap[1], h, z: 1 });
      }
    });
    sc.layers.push(hill); sc.hillLayer = hill;
    // flights on this screen, and the screen's terrain for play: the hill floor, the hill as a Z0 solid with the tunnel cut, the river
    for (const st of WSTAIRS) { const q = Object.assign({}, st, { x: st.x - ox, y: st.y - oy, low: st.low - (st.axis === 'x' ? ox : oy), high: st.high - (st.axis === 'x' ? ox : oy) }); if (q.x + q.w > 0 && q.x < W && q.y + q.h > 0 && q.y < H) sc.stairs.push(q); }
    sc.floorsX.push({ kind: 'hill', z: 1, poly: shift(HILLP, -ox, -oy), layer: hill, drop: true });
    sc.polys0.push(shift(HILL_SOLID, -ox, -oy));
    sc.waterPolys.push(shift(RIVERP, -ox, -oy));
    if (name === 'B1') sc.props.push({ spr: portalSprite(), x: (MOUTH[0] - ox) / U, y: (MOUTH[1] + 8 - oy) / U, by: MOUTH[1] + 8 - oy, key: MOUTH[1] + 8 - oy }); // the portal frame, in front of the tunnel's cars
    if (name === 'B1') for (const sx of [-1, 1]) captureRect(MOUTH[0] - ox + sx * (OUTER + 8) - 8, MOUTH[1] - oy - 2, 16, 12, 'portal'); // its pillars
  }
  // the Waterfront's shore: terraces and landings on pilotis, stilt houses, pier towers, the beach park, walkways at Z1
  function waterTile(sc, B, name, roadOk, free, rng, runs) {
    const ox = sc.ox, oy = sc.oy, u = (v) => v / U, box = (r) => r[0] - ox < W && r[0] + r[2] - ox > 0 && r[1] - oy < H && r[1] + r[3] - oy > 0;
    VP.buildings.filter((b) => b.base !== 1 && box(b.rect)).forEach((b, i) => {
      const [x, y, w, h] = b.rect, lx = x - ox, ly = y - oy, led = LEDS[(i + 2) % LEDS.length];
      if (b.type === 'terrace' || b.type === 'landing') {
        sc.props.push({ spr: terraceSprite(Math.round(w / U), Math.round(h / U), b.type === 'terrace', led), x: u(lx), y: u(ly), by: ly + h, floorKey: true });
        sc.floorsX.push({ kind: 'terrace', z: 1, x: lx, y: ly, w, h, key: ly + h + 0.6, drop: true });
        for (const cx of [lx + 6, lx + w / 2, lx + w - 10]) captureRect(cx, ly + h - 12, 8, 8, 'pilotis');
        brutalShadow(B, u(lx), u(ly), u(w), u(h), Z1, null);
      } else if (b.type === 'stilt') {
        sc.props.push({ spr: stiltSprite(Math.round(w / U), Math.round(h / U), led), x: u(lx), y: u(ly), by: ly + h });
        sc.floorsX.push({ kind: 'roof', z: 1, x: lx + 2, y: ly, w: w - 4, h: h - 20, key: ly + h + 0.6, drop: true });
      } else if (b.type === 'pier') {
        const plinth = 2 * STY, Hh = (b.storeys - 2) * STY, S0 = PIX.building(Math.round(w / U), Math.round(h / U), plinth, PIX.rng(491 + i), CON.l, 2);
        sc.props.push({ spr: S0, x: u(lx), y: u(ly) + RIV, by: ly + h }); // the plinth, its foot in the water
        sc.props.push({ spr: brutal(u(w - 36), u(h - 38), Hh, PIX.rng(497 + i), led, null, 'n', 'slab'), x: u(lx + 18), y: u(ly + 12) + RIV - plinth, by: ly + h + 0.2 });
      }
    });
    for (const q of VP.props) { const [x, y] = q.at, lx = x - ox, ly = y - oy; if (lx < -40 || lx > W + 40 || ly < -40 || ly > H + 40) continue;
      if (q.kind === 'planter') planter(B, lx, ly, P['world.gardenPlanter'] / 2, P['world.gardenPlanter'] / 2, 'grass', LEDS[1]);
      else if (q.kind === 'obelisk' || q.kind === 'arch') sculpture(B, u(lx), u(ly), q.kind, LEDS[(x + y) % LEDS.length]);
      else if (q.kind === 'bollards') for (let k = 0; k < 6; k++) bollard(B, u(lx + (q.to[0] - x) * k / 5), u(ly), LEDS[k % 2 ? 0 : 3 % LEDS.length]);
    }
    // walkways at Z1: square ends where they meet a deck, a terrace, a roof or the hill
    const ends = VP.buildings.filter((b) => b.base !== 1).map((b) => [b.rect[0] - ox, b.rect[1] - oy, b.rect[2], b.rect[3]]);
    const polys = VP.walkways.map((w) => { const [[ax, ay], [bx, by]] = w.pts, hw = P['world.walkwayWidth'] / 2, vert = ax === bx;
      const q = vert ? [[ax - hw, Math.min(ay, by)], [ax + hw, Math.min(ay, by)], [ax + hw, Math.max(ay, by)], [ax - hw, Math.max(ay, by)]] : [[Math.min(ax, bx), ay - hw], [Math.max(ax, bx), ay - hw], [Math.max(ax, bx), ay + hw], [Math.min(ax, bx), ay + hw]];
      const p = shift(q, -ox, -oy); p.spine = shift(w.pts, -ox, -oy); return p; }).filter((p) => p.some(([x, y]) => x > -40 && x < W + 40 && y > -40 && y < H + 40));
    if (polys.length) {
      const deckJoins = sc.layers.filter((l) => l.dk).map((l) => [l.dk.off - HALF - 4, -100, 2 * HALF + 8, H + 200]);
      const wl = walkwayLayer(polys, ends, deckJoins, (x, y) => roadOk(x, y, OUTER + 8) && !inHill(x + ox, y + oy), sc.roadC);
      wl.front = 1e6; sc.layers.push(wl); sc.walk = wl;
    }
  }
  DISTRICTS.splice(1, 0, WATER);
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
  function vDeck(off, z, roadOk, stairs, links) { // links (Edit 54): parapet openings onto a roof at the deck's level; P6: gaps are broken parapets (drops)
    stairs = stairs.concat((links || []).filter((q) => !q.gap));
    const gapL = (links || []).filter((q) => q.gap), hgt = z === 2 ? P['world.highHeight'] : P['world.deckHeight'];
    const dk = { hz: false, off, z, height: hgt, gaps: gapL.map((q) => [q.y, q.y + q.h, q.side]), openings: stairs.map((st) => [st.y, st.y + st.h, st.side]) }, { S, ext } = PIX.deck(dk, P);
    const Lr = new PIX.Buf(AW, AH), x0 = Math.round((off - HALF) / U), wpx = Math.round(2 * HALF / U), glow = mixK(K.deck2, K.white, 0.38);
    PIX.blit(Lr, S, x0, 0);
    for (let wy = P['world.deckLampSpacing'] / 2; wy < H; wy += P['world.deckLampSpacing']) for (const sd of [-1, 1]) { // paired lamps, poles rising screen-up from the parapet
      if (stairs.concat(gapL).some((st) => st.side === sd && wy > st.y - 12 && wy < st.y + st.h + 12)) continue;
      const bx = sd < 0 ? x0 + 1 : x0 + wpx - 2, by = Math.round(wy / U), ix = sd < 0 ? x0 + 6 : x0 + wpx - 7;
      for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (Math.abs(i) + Math.abs(j) <= 2) Lr.put(ix + i, by + j, glow);
      for (let h = 1; h < PIX.LAMP_H; h++) { Lr.put(bx, by - h, K.jerseyTop); Lr.put(bx + 1, by - h, K.bldgOutline); }
      for (let i = -1; i <= 2; i++) { Lr.put(bx + i, by - PIX.LAMP_H + 1, i === 0 || i === 1 ? K.white : K.head); Lr.put(bx + i, by - PIX.LAMP_H, K.bldgOutline); }
    }
    const cols = []; // P6: round columns under both edges, never in a lane (as the straight highway)
    for (let p = P['world.deckPillarSpacing'] / 2; p < H; p += P['world.deckPillarSpacing']) for (const e of [off - HALF + 4, off + HALF - 4 - C]) {
      if (!roadOk(e + C / 2, p, OUTER + C + 4)) continue;
      cols.push({ cx: e + C / 2, cy: p, key: p + C / 2, x: e, y: p - C / 2, spr: PIX.column(Math.round(C / U), Math.round(C / U), ext) });
    }
    return { dk, L: Lr, lift: ext, z, vert: true, cols, front: 9e5, openings: stairs.map((st) => ({ a0: st.y, a1: st.y + st.h, side: st.side })), gapSpans: gapL.map((q) => ({ a0: q.y, a1: q.y + q.h, side: q.side })),
      inBand: (wx) => Math.abs(wx - off) < HALF + 12, shadeOn: (B) => {
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
  // Edit 54: a stack of cantilevered LED cubes (art px), each sitting on the one below; pushed as props sorted from the base
  function cubeStack(sc, B, cubes, by, seed) {
    let base = 0;
    cubes.forEach(([x, y, w, h, H], i) => {
      const S = ledPanel(PIX.building(w, h, H, PIX.rng(seed + i), [N.magenta, N.cyan, LEDS[2 % LEDS.length]][i % 3], Math.max(2, Math.round(H / STY))), H, [[N.magenta, N.cyan], [N.cyan, LEDS[2 % LEDS.length]], [LEDS[2 % LEDS.length], N.magenta]][i % 3]);
      if (i === 0) brutalShadow(B, x, y, w, h, Math.round(cubes.reduce((a, c) => a + c[4], 0) * 0.55), null);
      if (i === 0) captureRect(x * U, y * U, w * U, h * U);
      sc.props.push({ spr: S, x, y: y - base, by, key: by + i * 0.01 }); base += H;
    });
  }
  function poolFP(B, fp) { // a reflecting pool from a footprint test in world units: coping, shadowed wall, water
    capture((wx, wy) => fp(wx, wy, -2), 0, 0, W, H, true);
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
    const sc = { D, name, col, row, ox, oy, props: [], layers: [], tops: [], note: plan[0] + '. Landmark: ' + plan[1] + '.', stairs: [], reserve: [], solids: [], solidsZ: [], roofs: [], floorsX: [], waterPolys: [], polys0: [], cones: [], drones: [] };
    CAP = sc.solids; // P6: every mass drawn from here is a solid of this screen
    for (const rb of [D.roundabout, D.ring]) if (rb && rb.arms.length < P['world.roundaboutMinArms']) console.warn('a roundabout with too few arms', D.id); // Edit 52
    const RBS = (D.roundabouts || []).concat(D.roundabout ? [D.roundabout] : []), rbHere = RBS.find((q) => q.tile === name); // Edit 56: street roundabouts
    if (D.kit !== 'example') { // Edit 56 (user, 26 October): every four-way takes a roundabout, its arms 90° apart, inside its tile; a flyover only where the plan names it
      const ANG = { W: 180, N: 270, E: 0, S: 90, NW: 225, NE: 315, SE: 45, SW: 135 }, zq = (1 - P['world.junctionZone']) / 2, rS = P['world.roundaboutRadiusStreet'] + OUTER;
      for (const rb of RBS.concat(D.ring ? [D.ring] : [])) if (rb.tile === name) {
        const a = rb.arms.map((k) => ANG[k]).sort((p, q) => p - q); if (a.some((v, i) => ((a[(i + 1) % a.length] - v + 360) % 360 || 360) < 90)) console.warn('a roundabout with arms under 90° apart', D.id, name);
        const c = rb.at || [W / 2, H / 2]; if (rb !== D.ring && (c[0] - rS < 0 || c[0] + rS > W || c[1] - rS < 0 || c[1] + rS > H)) console.warn('a roundabout crossing its tile edge', D.id, name);
        if (c[0] < W * zq || c[0] > W * (1 - zq) || c[1] < H * zq || c[1] > H * (1 - zq)) console.warn('a roundabout outside the central zone', D.id, name);
      }
      if (D.flyover && !D.flyoverNamed) console.warn('a 45° flyover the plan does not name', D.id);
    }
    const runs = [];
    for (const r of D.roads) { const run = clipRun(shift(r.pts, -ox, -oy), -200, -200, W + 200, H + 200); if (run) runs.push({ id: r.id, pts: run }); }
    const decks = D.decks.filter((d) => !d.rows || d.rows.includes(row)).map((d) => ({ hz: d.hz, z: d.z, off: d.hz ? d.at - oy : d.at - ox, from: d.from != null ? d.from - (d.hz ? ox : oy) : null, noEsc: d.noEsc, gaps: (d.gaps || []).map(([a, b]) => [a - (d.hz ? ox : oy), b - (d.hz ? ox : oy)]) })).filter((d) => d.off > -HALF && d.off < (d.hz ? H : W) + HALF);
    const hDecks = decks.filter((d) => d.hz), vDecks = decks.filter((d) => !d.hz);
    const groundDecks = D.ring && D.ring.tile === name ? [] : hDecks;
    const lvl = (c, extra) => Object.assign({ center: c, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: groundDecks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, extra || {});
    const J = (D.junctions || []).find((j) => j.tile === name);
    let ground, roadD, sims = [], center = runs.length ? runs[0].pts : [[-900, -900], [-850, -900]], lanes = null, busOK = runs.every((r) => X.minBend(r.pts, W, H) >= RB), patches = [];
    if (D.id === 'circus' && name === 'C1') patches = [[480, 520], [512, 552], [448, 584], [544, 496], [480, 608]].map(([x, y]) => ({ x, y, w: 32, h: 32, kind: 'puddle' })); // a flooded corner
    // ground roads and their traffic
    if (rbHere) { // a ground roundabout: every route, give way at entry, the inner lane for the third exit (Edit 52, 54). Edit 56: street radius, any centre, bent arms
      const ov = D.kit === 'example' ? {} : { 'world.roundaboutRadius': P['world.roundaboutRadiusStreet'] }, geo = L.multiRoundabout(X, Object.assign({}, P, ov), rbHere.arms, R96, rbHere.at, rbHere.bends), s = labSim(geo, 'nobus', ov);
      sims.push(s); sc.lab = s; const ca = rbHere.at || [W / 2, H / 2]; sc.islands = [{ x: ca[0], y: ca[1], r: P['world.roundaboutRadiusStreet'] + OUTER + 24 }]; // P6.1: no spawn on a roundabout's island
      ground = PIX.ground(lvl(geo.center, { ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops, decks: [] }), P, 23);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (D.geo) { // Edit 55 (example): a lab geometry built whole (realigned, staggered)
      const geo = D.geo(), s = labSim(geo, 'nobus', {});
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops }), P, 29);
      const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    } else if (J) { // a junction at 90° or 45°: the minor road gives way (Edit 49.3)
      const { arms, major } = junctionArms(runs, J.at, J.major), geo = L.junction(X, P, arms, major, P['world.junctionTurnRadius']), s = labSim(geo, 'nobus', {});
      const dirs = Object.values(arms).map((A) => Math.atan2(A[1][1] - A[0][1], A[1][0] - A[0][0]) * 180 / Math.PI); // Edit 55.1: four arms meet square
      if (dirs.length >= 3 && dirs.some((a) => dirs.some((b) => { const d = Math.abs(((a - b) % 90 + 90) % 90); return Math.min(d, 90 - d) > 2; }))) console.warn('a junction arm off 90° (realign: option A)', D.id, name); // Edit 55.2: three-way joins too
      if (dirs.length >= 4 && D.kit !== 'example') console.warn('a four-way junction without a roundabout', D.id, name); // Edit 56
      const zq = (1 - P['world.junctionZone']) / 2; if (J.at[0] < W * zq || J.at[0] > W * (1 - zq) || J.at[1] < H * zq || J.at[1] > H * (1 - zq)) console.warn('a junction outside the central zone', D.id, name); // Edit 55.2
      sims.push(s); sc.lab = s;
      ground = PIX.ground(lvl(geo.center, { arms: geo.arms, surfaces: geo.roads, giveWays: s.lab.geo.stops, patches }), P, 29 + col * 7 + row * 13);
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
      if (!runs.length) lanes = []; // P6: a screen with no ground road (the Waterfront's hilltop)
      const rf = PIX.roadField(runs.map((r) => ({ pts: r.pts, dash: false })), OUTER + 80);
      roadD = (k) => rf.D[k];
    }
    const B = ground; sc.B = B;
    const rd = (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH ? roadD(k) : 1e9; };
    const roadOk = (wx, wy, m) => rd(wx, wy) > (m || OUTER + 4);
    sc.roadC = (wx, wy) => rd(wx, wy); // P6.2: distance to the nearest Z0 road centre line (walkway openings)
    // highways, each with its two escalators
    let ringSim = null;
    if (D.ring && D.ring.tile === name) { // the Z1 ring (Parkland): a four-arm roundabout lifted onto the deck
      const cy = hDecks.length ? hDecks[0].off : H / 2, cx = vDecks.length ? vDecks[0].off : W / 2; // Edit 55.2: centred where the highways cross
      const ov = { 'world.roundaboutRadius': P['world.deckRingRadius'], 'traffic.ringFill': P['world.deckRingFill'] }, Pr = Object.assign({}, P, ov), geo = L.multiRoundabout(X, Pr, D.ring.arms, R96, [cx, cy]); // Edit 53.1: entry metered (Edit 54: the inner lane for the third exit only, as every ring)
      ringSim = labSim(geo, 'nobus', ov); sc.ringSim = ringSim;
      const Rc = P['world.deckRingRadius'];
      sc.stairs = escalators(cy, 1, HALF);
      const rr = { geoms: [{ pts: geo.ring.concat([geo.ring[0]]), dash: true }].concat(geo.arms.map((pts) => ({ pts, dash: true })), geo.roads.map((pts) => ({ pts }))) };
      const ringDeck = ringLayer(rr, 1, cx, cy, Rc, (x, y) => !roadOk(x, y, OUTER + C + 4) || sc.stairs.some((st) => x > st.x - C && x < st.x + st.w + C && Math.abs(y - st.y - st.h / 2) < st.h / 2 + HALF), sc.stairs.map((st) => [st.x + 2, st.x + st.w - 2, st.side]));
      ringDeck.front = 1e5; ringDeck.extend = true; ringDeck.cars = () => ringSim.cars.concat((sc.seam || []).filter((g) => g.deck)); // P5.3: and highway cars arriving from next door
      sc.layers.push(ringDeck); sc.ringDeck = ringDeck;
    } else {
      for (const d of hDecks) { const st = escalators(d.off, d.z, HALF); sc.stairs.push(...st); sc.layers.push(straightDeck(d.off, d.z, roadOk, st)); }
      const cq = D.chongqing && D.chongqing.tile === name ? D.chongqing : null; // Edit 54: the west escalator lands on the roof plaza instead
      const links = ((D.deckLinks || {})[name] || []).concat(cq ? [{ y: cq.link[0], h: cq.link[1] - cq.link[0], side: -1 }] : []); // Edit 55.2: walkway and roof links
      for (const d of vDecks) {
        const st = d.noEsc ? [] : vEscalators(d.off, d.z).filter((q) => !cq || q.side > 0); sc.stairs.push(...st);
        const gaps = d.gaps.filter(([a, b]) => b > 0 && a < H).map(([a, b]) => [-1, 1].map((side) => ({ y: a, h: b - a, side, gap: true }))).flat(); // P6: broken parapets (drops)
        const wl = D.id === 'waterfront' ? WSTAIRS.filter((q) => q.axis === 'x' && Math.abs(Math.abs(q.high - ox - d.off) - HALF) < 2).map((q) => ({ y: q.y - oy, h: q.h, side: q.high - ox < d.off ? -1 : 1 })) : []; // P6: the bridge escalators open the parapet
        const l = vDeck(d.off, d.z, roadOk, st, links.concat(gaps, wl)); l.from = d.from; sc.layers.push(l);
        if (d.from != null && d.from > 0) { l.L.d.fill(0, 0, Math.min(AH, Math.round(d.from / U)) * AW); l.cols = l.cols.filter((c) => c.cy > d.from + C); } // P6: on the hill the bridge is a street (drawn with the hill)
      }
    }
    let flySim = null;
    if (D.flyover) { // Edit 55 (example): the 45° road on a Z1 deck over the W–E road; its own traffic, which never meets the road below
      flySim = sceneSim(D.flyover, [], [], X.lanesOf(D.flyover, P), false); flySim.raised = true;
      const fl = ringLayer({ geoms: [{ pts: D.flyover, dash: true }] }, 1, 400, 320, 0, (x, y) => !roadOk(x, y, OUTER + C + 4), []);
      fl.front = 1e5; fl.cars = () => flySim.cars; sc.layers.push(fl);
    }
    if (D.id === 'waterfront') waterPre(sc, B, name, roadOk, runs); // P6: the valley's terrain, layers and stairs before the stairs are drawn
    for (const st of sc.stairs) { sc.props.push(stairProp(st, st.z === 2 ? Z2 : Z1)); const fx = st.axis === 'x' ? (st.side < 0 ? st.x : st.x + st.w) : st.x + SWD / 2, fy = st.axis === 'x' ? st.y + st.h / 2 : (st.side > 0 ? st.y + st.h : st.y); if (rd(fx, fy) < LW) console.warn('escalator foot in a lane', D.id, name); }
    const blocked = sc.stairs.map((st) => [st.x - 24, st.y - 24, st.w + 48, st.h + 48]);
    const underDeck = (wx, wy) => sc.layers.some((l) => l.inBand(wx, wy));
    const inRects = (rs, wx, wy, m) => rs.some((r) => wx > r[0] - m && wx < r[0] + r[2] + m && wy > r[1] - m && wy < r[1] + r[3] + m);
    const free = (wx, wy, m) => roadOk(wx, wy, OUTER + (m || 24)) && !underDeck(wx, wy) && !inRects(blocked, wx, wy, 0) && !inRects(sc.reserve, wx, wy, 0);
    // ---- the district's kit
    if (D.kit === 'example') { gardenPave(B, (wx, wy) => roadOk(wx, wy, OUTER), null); }
    else if (D.id === 'parkland') parkTile(sc, B, name, roadOk, free, rng, runs);
    else if (D.id === 'waterfront') waterTile(sc, B, name, roadOk, free, rng, runs);
    else monumentTile(sc, B, name, roadOk, free, rng, runs);
    for (const l of sc.layers) if (l.shadeOn && !l._shaded) l.shadeOn(B); // P6: one shadow per slab (a walkway the kit shaded is not shaded twice)
    sc.setPiece = plan[2]; sc.hasLevel = !!(sc.stairs.length || sc.walk || sc.terraces || sc.ringDeck || sc.hillLayer || sc.layers.some((l) => l.dk)); // P6: a hilltop screen is its own level // Edit 54: scenography and/or a change of level on every tile
    if (!sc.setPiece || (sc.setPiece !== 'scenery' && !sc.hasLevel)) console.warn('tile without its set piece', D.id, name, sc.setPiece);
    // traffic
    if (!sc.lab) {
      const dl = X.deckLanesOf(sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off })), P);
      const s = sceneSim(center, sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), dl, lanes, busOK);
      s.level.patches = patches; s.noDeckBus = D.id === 'parkland';
      sims.push(s); sc.main = s;
    } else if (sc.layers.some((l) => l.dk)) { // a junction screen under a highway: the highway's own traffic
      const ls = sc.layers.filter((l) => l.dk), s = sceneSim([[-900, -900], [-850, -900]], ls.map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), X.deckLanesOf(ls.map((l) => ({ hz: l.dk.hz, off: l.dk.off })), P), [], false);
      s.schedule = []; sims.push(s); sc.deckOnly = s;
    }
    if (ringSim) { ringSim.elev0 = 1; sims.push(ringSim); }
    if (flySim) sims.push(flySim);
    if (sc.hillSim) { sc.hillSim.elev0 = 1; sims.push(sc.hillSim); } // P6: the Waterfront's hill streets at Z1
    for (const s of sims) if (s.elev0 == null) s.elev0 = 0;
    sc.sims = sims; sc.roadOk = roadOk; sc.runs = runs;
    CAP = null;
    sc.game = gameData(sc);
    return sc;
  }
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
    if (name === 'A1') R.push([24, 300, 300, 280], [700, 224, 140, 120]);
    if (name === 'B1') R.push([150, 24, 160, 560], [0, 280, 800, 80]);
    if (name === 'C1') R.push([440, 120, 240, 160], [0, 280, 440, 80]);
    if (name === 'A2') R.push([500, 512, 300, 72]);
    if (name === 'C2') R.push([440, 40, 340, 190]);
    if (name === 'A3') R.push([496, 20, 288, 212]);
    if (name === 'B3') R.push([90, 130, 200, 200]);
    if (name === 'C3') R.push([510, 150, 260, 240]);
    const ANCHOR = { A1: [24, 300, 300, 280], B1: [150, 24, 160, 560], B2: [200, 100, 400, 440], C2: [440, 40, 340, 190], A3: [496, 20, 288, 212], C3: [520, 160, 240, 220] }; // Edit 55: the tile's set piece is its large unit
    const left = gardenPlan(B, { bedOk: (wx, wy) => free(wx, wy, 8), rng, leds: LEDS, pools: name !== 'B2', anchor: ANCHOR[name] || null });
    gardenSculptures(B, (wx, wy) => free(wx, wy, 16), null, rng, 2, left);
    const u = (v) => v / U;
    if (name === 'A1') { for (let i = 0; i < 3; i++) waterBlock(B, u(40 + i * 40), u(320 + i * 50), u(300 - i * 20), u(560), 8, 6 - i * 3, 3); sc.terraces = true; } // reservoir terraces, stepping down to the south
    if (name === 'B1') for (let i = 0; i < 5; i++) waterBlock(B, u(170), u(40 + i * 108), u(290), u(124 + i * 108), 6, 14 - i * 3, 3); // cascade, falling south beside the highway
    if (name === 'C1') { // footbridge over the avenue (x = 160) at Z1, escalator at the east end; Edit 55.2: it runs on west to the B1 highway; a lantern pavilion
      const run = X.stairRun(P, 0, 1), esc = [{ x: 420, y: 304, w: run, h: SWD, axis: 'x', low: 420 + run, high: 420, side: 0, z: 1 }];
      const wpoly = [[-40, 304], [420, 304], [420, 336], [-40, 336]]; wpoly.spine = [[-40, 320], [420, 320]]; const wl = walkwayLayer([wpoly], [], esc.map((st) => [st.x, st.y, st.w, st.h]), () => true, sc.roadC);
      for (const st of esc) { sc.props.push(stairProp(st, Z1)); sc.stairs.push(st); }
      wl.cols = [[40, 320], [300, 320]].map(([x, y]) => ({ cx: x, cy: y, key: y + 8, x: x - 8, y: y - 8, spr: PIX.column(4, 4, Z1) }));
      wl.front = 9e5; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B); wl._shaded = true;
      block(B, u(480), u(150), u(640), u(250), 4, 0, 10, 'conc', LEDS[0], true); block(B, u(500), u(165), u(620), u(235), 3, 10, 2, 'grass', LEDS[3 % LEDS.length], false);
    }
    if (name === 'A2') poolFP(B, (wx, wy, ins) => chamf(510, 520, 800 + 40, 576, 8)(wx, wy, ins)); // canal along the highway (Edit 55.2: below its escalator)
    if (name === 'B1' || name === 'A1') { // Edit 55.2: the Z1 walkway from C1 joins the B1 highway at both parapets and lands in A1 by escalator
      const off = sc.layers.find((l) => l.dk && !l.dk.hz), polys = [], joins = [], esc = [];
      if (name === 'B1') { const a = off.dk.off - HALF, b = off.dk.off + HALF; polys.push([[-40, 304], [a + 4, 304], [a + 4, 336], [-40, 336]], [[b - 4, 304], [840, 304], [840, 336], [b - 4, 336]]); joins.push([a - 6, 300, 12, 40], [b - 6, 300, 12, 40]); }
      else { const run = X.stairRun(P, 0, 1); esc.push({ x: 740, y: 304 - run, w: SWD, h: run, axis: 'y', low: 304 - run, high: 304, side: -1, z: 1 }); polys.push([[724, 304], [840, 304], [840, 336], [724, 336]]); joins.push(...esc.map((st) => [st.x, st.y, st.w, st.h])); }
      for (const p of polys) p.spine = [[p[0][0] + 24, 320], [p[1][0] - 24, 320]];
      const wl = walkwayLayer(polys, [], joins, (x, y) => roadOk(x, y, OUTER) && !(off && Math.abs(x - off.dk.off) < HALF + 16), sc.roadC);
      for (const st of esc) { sc.props.push(stairProp(st, Z1)); sc.stairs.push(st); }
      wl.front = 1e6; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B); wl._shaded = true;
      if (name === 'B1') { const lk = sc.D.deckLinks.B1[0], xs = [off.dk.off - HALF, off.dk.off + HALF]; sc.props.push({ key: 1e6 + 3, draw: (F) => { for (const x0 of xs) for (let wy = lk.y + 4; wy < lk.y + lk.h - 2; wy += 8) for (let wx = x0 - 10; wx < x0 + 12; wx += U) for (let k = 0; k < 2; k++) F.put(wx / U, wy / U - Z1 + k, k ? K.jerseyTop : K.white); } }); } // zebras over the open parapets, at the lift
    }
    if (name === 'C2') { for (let i = 0; i < 4; i++) block(B, u(460 + i * 24), u(60 + i * 32), u(760 - i * 24), u(220), 10, 0, 3 + i * 3, i === 3 ? 'grass' : 'conc', i === 0 ? LEDS[0] : null, i === 0); sc.terraces = true; } // amphitheatre terraces
    if (name === 'A3') { // Edit 54: the belvedere. Four one-storey tiers to a lawn, a stair up the south face, the monolith orchard on top
      const t = EXT(P['world.storeyHeight']);
      for (let i = 0; i < 4; i++) block(B, u(504 + i * 24), u(28 + i * 16), u(776 - i * 24), u(224 - i * 8), 12 - i * 2, i * t, t, i === 3 ? 'grass' : 'conc', i === 3 ? LEDS[0] : null, i === 0);
      for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) monolith(B, u(580 + i * 60), u(110 + j * 36), 4 * t, 12 + ((i + j) % 3) * 5, led(i + j));
      const st = { x: 624, y: 196, w: SWD, h: 48, axis: 'y', low: 244, high: 196, side: 0, z: 1 }; sc.props.push({ spr: PIX.stairs(st, 0, 4 * t), x: u(st.x), y: u(st.y), by: 244 }); sc.terraces = true;
    }
    if (name === 'B3') sculptureCourt(B, u(96), u(140), u(284), u(320), 10, 'obelisk', ['ring', 'ring'], LEDS[0]); // Edit 55: the obelisk large, two rings, a row of lit bollards (Edit 55.2: north of the moved street)
    if (name === 'C3') sculptureCourt(B, u(520), u(160), u(760), u(380), 20, 'arch', ['cubes', 'fins'], led(3)); // Edit 55: at grade (nothing below ground); Edit 55.2: east of the centred crossing
  }
  // ---------- Monument: LED commerce, the snake road, two north–south highways, the walkway ring
  function monumentTile(sc, B, name, roadOk, free, rng, runs) {
    const u = (v) => v / U, R = sc.reserve, bld = (x, y, w, h, st, i, panel) => { let S = PIX.building(Math.round(u(w)), Math.round(u(h)), st * EXT(P['world.storeyHeight']), PIX.rng(700 + i * 31 + sc.col * 7 + sc.row * 3), LEDS[(i + sc.col + sc.row) % LEDS.length], st); if (panel) S = ledPanel(S, st * EXT(P['world.storeyHeight']), [N.magenta, N.cyan, LEDS[2 % LEDS.length]]); sc.props.push({ spr: S, x: u(x), y: u(y), by: y + h }); R.push([x, y, w, h]); captureRect(x, y, w, h); };
    if (name === 'B2') return monumentCentre(sc, B, roadOk);
    if (name === 'A1') bld(40, 24, 240, 180, 12, 1, true); // LED-wall tower facing the entry
    if (name === 'B1') { // the skybridge from a podium roof south over the road to the walkway ring
      const pod = [300, 16, 200, 140]; captureRect(...pod); sc.roofs.push({ rect: pod, z: 1 }); sc.solidsZ.push({ x: 310, y: 20, w: 120, h: 70, z: 1 });
      sc.props.push({ spr: PIX.building(Math.round(u(pod[2])), Math.round(u(pod[3])), Z1, PIX.rng(77), LEDS[1], 1), x: u(pod[0]), y: u(pod[1]), by: pod[1] + pod[3], podium: true });
      sc.props.push({ spr: PIX.building(Math.round(u(120)), Math.round(u(70)), 10 * EXT(P['world.storeyHeight']), PIX.rng(78), LEDS[2 % LEDS.length], 10), x: u(310), y: u(20) - Z1, by: 90, tower: true });
      const poly = [[386, 140], [414, 140], [414, H + 40], [386, H + 40]]; poly.spine = [[400, 160], [400, H]];
      const wl = walkwayLayer([poly], [pod], [], (x, y) => roadOk(x, y, OUTER), sc.roadC);
      wl.front = 1e6; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B); wl._shaded = true; R.push([290, 0, 220, 170]);
    }
    if (name === 'C1') { captureRect(394, 512, 112, 56); const S = drum(28, 14, 12 * EXT(P['world.storeyHeight']), N.cyan); sc.props.push({ spr: S, x: u(450), y: u(540), by: 570 }); R.push([380, 480, 140, 110]); } // LED drum in the bend
    if (name === 'A2') { bld(656, 416, 136, 96, 3, 2, true); bld(336, 430, 128, 80, 3, 5, true); } // neon arcades either side of the highway, south of the road
    if (name === 'C2') chongqing(sc, B, sc.D.chongqing);
    if (name === 'A3') { tiles(B, (wx, wy) => wx > 200 && wx < 472 && wy > 416 && wy < 632 && roadOk(wx, wy, OUTER), true); cubeStack(sc, B, [[144, 262, 64, 40, 28], [166, 252, 62, 38, 26], [134, 258, 56, 34, 24]], 604, 640); R.push([184, 400, 300, 240]); } // on a lit plaza // Edit 54: stacked LED cubes, each cantilevered off the one below
    if (name === 'B3') { // the LED canyon either side of the jog; Edit 54: a Z1 skybridge crosses the jog at 90° between the two walls
      bld(40, 440, 240, 120, 6, 3, true); bld(520, 140, 260, 110, 6, 4, true);
      const hw = P['world.walkwayWidth'] / 2 / Math.SQRT2, a = [262, 538], b = [566, 234], poly = [[a[0] + hw, a[1] + hw], [b[0] + hw, b[1] + hw], [b[0] - hw, b[1] - hw], [a[0] - hw, a[1] - hw]]; poly.spine = [[300, 500], [530, 270]];
      const wl = walkwayLayer([poly], [], [], (x, y) => roadOk(x, y, OUTER) && !(x < 290 && y > 430) && !(x > 510 && y < 260), sc.roadC);
      wl.front = 300; sc.layers.push(wl); sc.walk = wl; wl.shadeOn(B); wl._shaded = true; R.push([250, 230, 330, 320]);
    }
    if (name === 'C3') { // an LED gateway arch over the road: pylons either side, a lit beam above the traffic
      const ax = 560, top = 400 - 24, bot = 560 + 24, Hh = 40;
      const Lr = new PIX.Buf(AW, AH);
      for (const py of [top, bot]) for (let z = 0; z < Hh; z++) for (let i = -2; i <= 2; i++) Lr.put(u(ax) + i, u(py) - z, i < 0 ? CON.d : i > 0 ? CON.l : CON.m);
      for (let y = u(top) - Hh; y <= u(bot) - Hh; y++) for (let i = -3; i <= 3; i++) Lr.put(u(ax) + i, y, Math.abs(i) === 3 ? K.bldgOutline : (y + i) % 4 < 2 ? N.magenta : N.cyan);
      sc.layers.push({ L: Lr, lift: 0, z: 0, cols: [], front: 1e6 + 5, inBand: () => false, gate: true });
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
  // Edit 54 (Chongqing): the Z2 highway runs through a tower at deck level, and a roof plaza at Z2 opens off its parapet.
  // The tower draws after the deck, cut open where the deck passes in front of its lower face; the portal shows the deck in shade.
  function chongqing(sc, B, q) {
    const [x, y, w, h] = q.tower, Ht = q.storeys * STY, dk = sc.layers.find((l) => l.dk && !l.dk.hz && l.dk.z === 2).dk, Zd = Z2, clr = EXT(P['world.portalClearance']);
    const S = PIX.building(Math.round(w / U), Math.round(h / U), Ht, PIX.rng(54 + sc.col), LEDS[2 % LEDS.length], q.storeys), ax = Math.round(x / U), ay = Math.round(y / U);
    const b0 = Math.round((dk.off - HALF - x) / U), b1 = Math.round((dk.off + HALF - x) / U), jDeck = S.h - Zd, jTop = jDeck - clr, put = (i, j, c) => { if (i >= 0 && j >= 0 && i < S.w && j < S.h && S.d[j * S.w + i]) S.d[j * S.w + i] = c; };
    for (let j = jTop; j < S.h; j++) for (let i = b0; i < b1; i++) S.d[j * S.w + i] = 0; // the portal, and the lower face hidden behind the deck
    for (let i = b0 - 2; i < b1 + 2; i++) { put(i, jTop - 3, K.bldgOutline); put(i, jTop - 2, N.cyan); put(i, jTop - 1, i % 3 ? N.cyan : K.white); } // a lit lintel
    for (let j = jTop - 1; j < S.h - 1; j++) for (const i of [b0 - 2, b0 - 1, b1, b1 + 1]) put(i, j, i === b0 - 1 || i === b1 ? (j < jDeck ? N.magenta : K.bldgOutline) : CON.d); // jambs: lit to the deck, then the wall
    brutalShadow(B, ax, ay, Math.round(w / U), Math.round(h / U), Math.round(Ht * 0.55), null); captureRect(x, y, w, h);
    sc.props.push({ spr: S, x: ax, y: ay, by: y + h, key: 9e5 + 1 });
    sc.props.push({ key: 9e5 + 2, draw: (F) => { for (let j = jTop; j < jDeck; j++) for (let i = b0; i < b1; i++) F.shade(ax + i, ay - Ht + j, 0.28 + 0.4 * (j - jTop) / clr); } }); // inside the portal: the deck and its cars in shade
    // the roof plaza: a platform at Z2 (6 storeys), its east parapet open onto the highway, its north edge open to the escalator
    const [px, py, pw, ph] = q.plaza; captureRect(px, py, pw, ph); sc.roofs.push({ rect: [px, py, pw, ph], z: 2, openE: q.link }); const run = X.stairRun(P, 0, 2), st = { x: 40, y: py - run, w: SWD, h: run, axis: 'y', low: py - run, high: py, side: 0, z: 2 };
    const top = Math.round(py / U), open = [['E', Math.round(q.link[0] / U) - top, Math.round(q.link[1] / U) - top], ['N', Math.round((st.x - px) / U), Math.round((st.x + st.w - px) / U)]];
    const Sp = PIX.building(Math.round(pw / U), Math.round(ph / U), Zd, PIX.rng(55 + sc.row), LEDS[1], 6, { ledges: [], open }), sp = (i, j, c) => { if (i >= 0 && j >= 0 && i < Sp.w && j < Sp.h) Sp.d[j * Sp.w + i] = c; };
    for (const [i0, j0] of [[8, 20], [8, 34], [40, 34]]) for (let j = 0; j < 7; j++) for (let i = 0; i < 12; i++) sp(i0 + i, j0 + j, j === 0 || j === 6 || i === 0 || i === 11 ? (j === 6 ? K.bldgOutline : CON.l) : (i + j) % 4 === 0 ? K.foliageL : K.foliage); // planters on the plaza
    for (let i = 4; i < Sp.w - 6; i += 6) sp(i, Math.round(ph / U) - 4, N.cyan); // bollard lights along the south parapet
    sc.props.push({ spr: Sp, x: Math.round(px / U), y: Math.round(py / U), by: py + ph });
    sc.props.push({ key: 9e5 + 3, draw: (F) => { for (let wy = q.link[0] + 6; wy < q.link[1] - 4; wy += 8) for (let wx = dk.off - HALF - 10; wx < dk.off - HALF + 12; wx += U) for (let k = 0; k < 2; k++) F.put(wx / U, wy / U - Zd + k, k ? K.jerseyTop : K.white); } }); // a zebra over the open parapet: walk off the highway onto the roof
    sc.props.push(stairProp(st, Z2)); sc.stairs.push(st);
    sc.reserve.push([x, 0, w, y + h + 8], [0, st.y - 24, px + pw + 8, H - st.y + 24]);
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
    const wl = walkwayLayer(ringQuads.concat([diag(-1, -1), diag(1, -1), diag(-1, 1), diag(1, 1), sky]), podiums, esc.map((s) => [s.x, s.y, s.w, s.h]), (x, y) => laneD(x, y) > LW / 2 + 14, (x, y) => laneD(x, y)); // each carriageway is one lane: its centre is the road's
    sc.layers.push(wl); sc.walk = wl;
    const okP = (wx, wy) => roadOk(wx, wy, OUTER) && wx > fx + 8 && wx < W - fx - 8;
    tiles(B, okP, true);
    each((x, y, wx, wy) => { if (!roadOk(wx, wy, OUTER) || wx < 150 || wx > W - 150 || Math.abs(wy - cy) > P['world.splitLaneOffset']) return; B.put(x, y, (x % 8 === 0 || y % 8 === 0) ? CON.m : ((x + y) % 16 === 0 ? CON.l : ISL)); });
    planter(B, 540, 96, 48, 26, 'monolith', LEDS[0]); planter(B, 280, 552, 48, 26, 'tiers', LEDS[3 % LEDS.length]);
    for (const [sx, sy, kind] of [[250, 60, 'arch'], [400, 600, 'fins'], [330, 372, 'cubes'], [470, 372, 'ring']]) sculpture(B, sx / U, sy / U, kind, LEDS[(sx + sy) % LEDS.length]);
    for (const st of esc) sc.props.push(stairProp(st, Z1));
    sc.stairs = esc;
    podiums.forEach(([x, y, pw, ph]) => { captureRect(x, y, pw, ph); sc.roofs.push({ rect: [x, y, pw, ph], z: 1 }); });
    [[16, 8, 96, 56], [W - 112, 8, 96, 56], [16, fyS, 96, 64], [W - 112, fyS, 96, 64]].forEach(([x, y, tw, th]) => sc.solidsZ.push({ x, y, w: tw, h: th, z: 1 }));
    podiums.forEach(([x, y, pw, ph], i) => sc.props.push({ spr: PIX.building(Math.round(pw / U), Math.round(ph / U), Z1, PIX.rng(91 + i * 13), LEDS[(i + 1) % LEDS.length], 1), x: x / U, y: y / U, by: y + ph, podium: true }));
    [[16, 8, 96, 56], [W - 112, 8, 96, 56], [16, fyS, 96, 64], [W - 112, fyS, 96, 64]].forEach(([x, y, tw, th], i) => sc.props.push({ spr: PIX.building(Math.round(tw / U), Math.round(th / U), (7 + i * 2) * EXT(P['world.storeyHeight']), PIX.rng(57 + i * 29), LEDS[(i + 2) % LEDS.length], 7 + i * 2), x: x / U, y: y / U - Z1, by: y + th, tower: true }));
    sc.monument = { cx, cy };
  }
  // ---------- P6 (GDD Edit 62): play data for one screen. A floor is a test on the dummy's centre at its level: a deck band,
  // the ring's surface, a walkway, the hill, a terrace or a roof. Stairs join the ground to a floor. Solids: rects and the
  // hill polygon at Z0; rects above, at their level. Water: a fall is a drone rescue (D37). Spawns and cone homes.
  const R0 = P['body.radius'], AWAY = Object.freeze({ alive: false, x: -1e5, y: -1e5, vx: 0, vy: 0, level: 0, floor: null, stair: null, mode: 'away', facing: 0, parts: null });
  const inR = (r, x, y, m) => x >= r.x - (m || 0) && x <= r.x + r.w + (m || 0) && y >= r.y - (m || 0) && y <= r.y + r.h + (m || 0);
  function polyDist(poly, x, y) { // distance to the outline and its nearest point
    let best = { d: Infinity, qx: x, qy: y };
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [ax, ay] = poly[j], dx = poly[i][0] - ax, dy = poly[i][1] - ay, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2));
      const qx = ax + dx * t, qy = ay + dy * t, d = hyp(x - qx, y - qy);
      if (d < best.d) best = { d, qx, qy };
    }
    return best;
  }
  function mergeRects(rs) { // the capture's row runs, stacked where they share a span
    const out = [], open = new Map();
    for (const r of rs.slice().sort((a, b) => a.x - b.x || a.w - b.w || a.y - b.y)) {
      const k = r.kind + ':' + r.x + ':' + r.w, o = open.get(k);
      if (o && Math.abs(o.y + o.h - r.y) < 0.5) { o.h += r.h; continue; }
      const n = { x: r.x, y: r.y, w: r.w, h: r.h, kind: r.kind }; open.set(k, n); out.push(n);
    }
    return out;
  }
  const rectFloor = (kind, z, x, y, w, h) => ({ kind, z, x, y, w, h, drop: true, has: (px, py) => px >= x - 1 && px <= x + w + 1 && py >= y - 1 && py <= y + h + 1 });
  function deckFloor(l) { // the deck between its parapets, less the body's radius; open across the parapet at a stair head, a link or a gap
    const dk = l.dk, hz = dk.hz, off = dk.off, from = l.from != null && l.from > 0 ? l.from : -1e9, hold = HALF - PW - R0, ops = (l.openings || []).concat(l.gapSpans || []), gs = l.gapSpans || [];
    return { kind: 'deck', z: dk.z, layer: l, drop: false,
      has: (x, y) => { const a = hz ? x : y, d = (hz ? y : x) - off; if (a < from) return false; if (Math.abs(d) <= hold) return true; if (Math.abs(d) > HALF + 2) return false; const sd = d < 0 ? -1 : 1; return ops.some((o) => o.side === sd && a >= o.a0 && a <= o.a1); },
      dropAt: (x, y) => { const a = hz ? x : y, sd = (hz ? y : x) < off ? -1 : 1; return gs.some((o) => o.side === sd && a >= o.a0 - 2 && a <= o.a1 + 2); } };
  }
  function ringFloor(l) { // the lifted ring and its arms: the road field, less parapet and radius; open at its escalator heads
    const D = l.field.D, hold = HALF - PW - R0, ops = l.openings || [], cy = l.ring.cy;
    return { kind: 'ring', z: l.z, layer: l, drop: false,
      has: (x, y) => { if (x < 0 || y < 0 || x >= W || y >= H) return false; const d = D[Math.floor(y / U) * AW + Math.floor(x / U)]; if (d <= hold) return true; if (d > HALF + 2) return false; return ops.some(([a, b, sd]) => x > a && x < b && (sd > 0 ? y > cy : y < cy)); } };
  }
  function gameData(sc) {
    const floors = [];
    for (const l of sc.layers) {
      const f = l.dk ? deckFloor(l) : l.ring ? ringFloor(l) : l.walk ? { kind: 'walk', z: 1, layer: l, drop: false, dropAt: (x, y) => l.gapAt(x, y), has: (x, y) => l.polys.some((p) => PIX.inPoly(p, x, y)) } : null; // P6.2: a walkway drops only through its one opening per road
      if (f) floors.push(f);
    }
    for (const q of sc.floorsX) floors.push(q.poly ? { kind: q.kind, z: q.z, layer: q.layer, drop: q.drop, poly: q.poly, has: (x, y) => PIX.inPoly(q.poly, x, y) } : Object.assign(rectFloor(q.kind, q.z, q.x, q.y, q.w, q.h), { key: q.key, drop: q.drop }));
    for (const rf of sc.roofs) floors.push(Object.assign(rectFloor('roof', rf.z, rf.rect[0], rf.rect[1], rf.rect[2], rf.rect[3]), { key: rf.z === 2 ? rf.rect[1] + rf.rect[3] + 0.6 : 1e6 - 0.5 }));
    floors.forEach((f, i) => { f.i = i; });
    const statics = mergeRects(sc.solids);
    for (const l of sc.layers) for (const c of l.cols || []) statics.push({ x: c.x, y: c.y, w: 2 * (c.cx - c.x), h: 2 * (c.cy - c.y), kind: 'column' });
    if (sc.monument) statics.push({ x: sc.monument.cx - 40, y: sc.monument.cy - 18, w: 80, h: 36, kind: 'monument' });
    const stairs = [], propOf = new Map(sc.props.filter((p) => p.stair).map((p) => [p.stair, p]));
    for (const st of sc.stairs) {
      const z = st.z || 1, dir = Math.sign(st.high - st.low), lat = st.axis === 'y' ? st.x + st.w / 2 : st.y + st.h / 2;
      let head = -1;
      for (const k of [4, 8, 16, 24, 32, 40]) { const a = st.high + dir * k, x = st.axis === 'y' ? lat : a, y = st.axis === 'y' ? a : lat; head = floors.findIndex((f) => f.z === z && f.has(x, y)); if (head >= 0) break; }
      const pr = propOf.get(st), key = pr ? (pr.key != null ? pr.key : pr.over ? 1e6 + 1 : pr.by) : st.y + st.h;
      if (head < 0) { statics.push({ x: st.x, y: st.y, w: st.w, h: st.h, kind: 'stair' }); continue; } // a flight with nowhere to land is scenery
      stairs.push({ x: st.x, y: st.y, w: st.w, h: st.h, axis: st.axis, low: st.low, high: st.high, from: 0, to: z, foot: null, head, key });
    }
    // where a dummy can stand at Z0: off the lanes and shoulders, clear of solids, the hill, the water, stairs and decks
    const offPoly = (x, y, m) => sc.polys0.every((p) => !PIX.inPoly(p, x, y) && polyDist(p, x, y).d > m);
    const ground = (x, y, m) => sc.roadOk(x, y, OUTER + m) && !statics.some((s) => inR(s, x, y, R0 + 6)) && offPoly(x, y, R0 + 6) && !sc.waterPolys.some((p) => PIX.inPoly(p, x, y) || polyDist(p, x, y).d < R0 + 12) && !stairs.some((s) => inR(s, x, y, R0 + 10));
    const pick = (cands, score, n, gap) => { const out = []; for (const c of cands.sort((a, b) => score(a) - score(b))) { if (out.length >= n) break; if (out.every((o) => hyp(o.x - c.x, o.y - c.y) >= gap)) out.push(c); } return out; };
    const cands = [];
    for (let y = 48; y <= H - 32; y += 16) for (let x = 32; x <= W - 32; x += 16) if (ground(x, y, 12) && !sc.layers.some((l) => l.inBand && l.inBand(x, y)) && !(sc.islands || []).some((q) => hyp(x - q.x, y - q.y) < q.r)) cands.push({ x, y, f: 90, level: 0, floor: null });
    const st0 = sc.D.start, edge = st0 && st0[0] === sc.name ? st0[1] : null;
    const score = (c) => (edge === 'top' ? c.y + Math.abs(c.x - W / 2) * 0.2 : edge === 'west' ? c.x + Math.abs(c.y - H / 2) * 0.2 : edge === 'center' ? hyp(c.x - W / 2, c.y - 0.65 * H) : hyp(c.x - W / 2, c.y - H / 2)); // the centre start: below the intro banner
    let spawns = pick(cands, score, 3, 120);
    if (!spawns.length) { // a hilltop screen: stand on the hill, off its streets and clear of its buildings
      const hf = floors.find((f) => f.kind === 'hill');
      if (hf) for (let y = 48; y <= H - 32; y += 16) for (let x = 32; x <= W - 32; x += 16)
        if ([[0, 0], [24, 0], [-24, 0], [0, 24], [0, -24]].every(([a, b]) => hf.has(x + a, y + b)) && (!sc.hillOk || sc.hillOk(x, y, OUTER + 12)) && !sc.solidsZ.some((s) => inR(s, x, y, R0 + 6))) spawns.push({ x, y, f: 90, level: 1, floor: hf.i });
      spawns = pick(spawns, score, 3, 120);
    }
    // cone homes: on the pavement beside a ground road
    const homes = sc.sims.some((s) => s.elev0 === 0 && s.level.lanes.length) ? pick(cands.filter((c) => !sc.roadOk(c.x, c.y, OUTER + 40)), (c) => hyp(c.x - W / 2, c.y - H / 2), 2, 240) : [];
    const runs = (sc.runs || []).concat(sc.hillRuns || []), longest = runs.reduce((a, r) => (!a || X.makePath(r.pts).length > X.makePath(a.pts).length ? r : a), null);
    return { id: sc.D.id, name: sc.name, cell: [sc.col, sc.row], statics, floors, stairs, solidsZ: sc.solidsZ.slice(), polys0: sc.polys0, water: sc.waterPolys, spawns, coneHomes: homes.map((c) => [c.x, c.y]),
      patches: [], checkpoints: sc.checkpoints || [], decks: [], deckLanes: [], lanes: [], center: longest ? longest.pts : [], ring: sc.ringDeck ? sc.ringDeck.ring.geoms[0].pts : null,
      deckLines: sc.layers.filter((l) => l.dk).map((l) => ({ hz: l.dk.hz, off: l.dk.off, z: l.dk.z })), theme: 'p6', landmark: sc.D.tiles[sc.name][1] };
  }
  // ---------- P6.1 (Edit 63): every screen edge says whether it can be crossed. Where the dummy can reach an edge but not
  // cross it (a building, the hill or a pool next door; the district's edge), a barrier stands on this side: a low planter
  // between screens; the perimeter wall at the district's edge (Edit 42), a booth and boom where a road leaves, a boom across a
  // highway or hill street that leaves, a parapet along the hill. Where a walkway crosses into the next screen, chevrons say so.
  const horizE = (sd) => sd === 'N' || sd === 'S';
  const edgePt = (sd, v, d) => (sd === 'N' ? [v, d] : sd === 'S' ? [v, H - d] : sd === 'W' ? [d, v] : [W - d, v]);
  const edgeRect = (sd, a0, a1, t) => (sd === 'N' ? { x: a0, y: 0, w: a1 - a0, h: t } : sd === 'S' ? { x: a0, y: H - t, w: a1 - a0, h: t } : sd === 'W' ? { x: 0, y: a0, w: t, h: a1 - a0 } : { x: W - t, y: a0, w: t, h: a1 - a0 });
  function groundFree(sc, x, y, m) { const g = sc.game; m = m == null ? R0 - 2 : m; return !g.statics.some((q) => inR(q, x, y, m)) && g.polys0.every((q) => !PIX.inPoly(q, x, y)) && !g.stairs.some((q) => inR(q, x, y, m)); } // m: the margin (where the dummy can stand: R0 − 2; where it can arrive across an edge: 0, the push-out slides it along)
  const cpZone = (cp) => { const o = cp.half != null ? cp.half : cp.deck ? HALF : OUTER, l = cp.line; return cp.side === 'W' ? { x: 0, y: cp.off - o, w: l, h: 2 * o } : cp.side === 'E' ? { x: W - l, y: cp.off - o, w: l, h: 2 * o } : cp.side === 'N' ? { x: cp.off - o, y: 0, w: 2 * o, h: l } : { x: cp.off - o, y: H - l, w: 2 * o, h: l }; };
  function runsOf(flags, step) { const out = []; let a = null; flags.forEach((f, i) => { if (f && a == null) a = i * step; if (!f && a != null) { out.push([a, i * step]); a = null; } }); if (a != null) out.push([a, flags.length * step]); return out.map(([p, q]) => (q - p < 12 ? [Math.max(0, (p + q) / 2 - 6), (p + q) / 2 + 6] : [p, q])); }
  function edgePass(Wd) {
    const step = 4, WT = P['world.wallThickness'], WH = EXT(P['proto.art.wallHeight']), d0 = R0 + 1, bd = 32, depth = 8;
    for (const sc of Wd.scs) { sc.checkpoints = []; sc.edgeLog = []; sc.gamePre = sc.game; }
    const pre = (q) => ({ game: q.gamePre, roadOk: q.roadOk }); // every screen judged on its own art, before any barrier goes in
    for (const sc of Wd.scs) {
      CAP = sc.solids;
      const g = sc.gamePre, water = (x, y) => g.water.some((q) => PIX.inPoly(q, x, y));
      for (const sd of ['N', 'E', 'S', 'W']) {
        const nb = Wd.at(sc.col + SIDE[sd][0], sc.row + SIDE[sd][1]), len = horizE(sd) ? W : H, n = Math.ceil(len / step);
        const plant = [], wall = [], road = [];
        for (let i = 0; i < n; i++) {
          const v = i * step + step / 2, [x, y] = edgePt(sd, v, d0), here = groundFree(pre(sc), x, y) && !water(x, y), onRoad = !sc.roadOk(x, y, OUTER);
          let there = false; if (nb) { const [qx, qy] = edgePt(OPPS[sd], v, d0); there = groundFree(pre(nb), qx, qy, 0); }
          const inLane = !sc.roadOk(x, y, LW); // a planter may stand on a shoulder, never in a lane
          plant.push(!!nb && here && !there && !inLane); wall.push(!nb && here && !onRoad); road.push(!nb && here && onRoad);
        }
        for (const [a0, a1] of runsOf(plant, step)) { // a low planter: concrete, a clipped hedge, an LED seam
          const r = edgeRect(sd, a0, a1, WT), fp = chamf(Math.round(r.x / U), Math.round(r.y / U), Math.round((r.x + r.w) / U) - 1, Math.round((r.y + r.h) / U) - 1, 2);
          CAP = null; mass(sc.B, fp, r.x / U, r.y / U, (r.x + r.w) / U - 1, (r.y + r.h) / U - 1, 0, 3, 'conc', LEDS[1], true); mass(sc.B, (px, py, k) => fp(px, py, (k || 0) + 2), r.x / U, r.y / U, (r.x + r.w) / U - 1, (r.y + r.h) / U - 1, 3, 4, 'hedge', null, false, 'hedge'); CAP = sc.solids;
          captureRect(r.x, r.y, r.w, r.h, 'planter');
          sc.edgeLog.push(sd + ' planter ' + a0 + '–' + a1);
        }
        for (const [a0, a1] of runsOf(wall, step)) { // the district's bounds (Edit 42): the perimeter wall
          const r = edgeRect(sd, a0, a1, WT); captureRect(r.x, r.y, r.w, r.h, 'wall');
          sc.props.push({ spr: PIX.wall(Math.round(r.w / U), Math.round(r.h / U), WH), x: r.x / U, y: r.y / U, by: r.y + r.h });
          sc.edgeLog.push(sd + ' wall ' + a0 + '–' + a1);
        }
        for (const [a0, a1] of runsOf(road, step)) { // a road leaves the district: a booth on its shoulder, a boom across it (Edit 42)
          const off = (a0 + a1) / 2, [mx, my] = edgePt(sd, off, d0); if (sc.hillLayer && sc.hillLayer.inBand(mx, my)) { sc.edgeLog.push(sd + ' tunnel ' + Math.round(off)); continue; } // in the tunnel the screen's edge holds (Edit 62)
          const pv = off + LW, b = sd === 'W' ? { x: depth, y: pv, w: bd, h: OUTER - LW } : sd === 'E' ? { x: W - depth - bd, y: pv, w: bd, h: OUTER - LW } : sd === 'N' ? { x: pv, y: depth, w: OUTER - LW, h: bd } : { x: pv, y: H - depth - bd, w: OUTER - LW, h: bd };
          captureRect(b.x, b.y, b.w, b.h, 'booth'); sc.props.push({ spr: PIX.booth(Math.round(b.w / U), Math.round(b.h / U), WH), x: b.x / U, y: b.y / U, by: b.y + b.h });
          sc.checkpoints.push({ side: sd, off, line: depth + bd / 2, half: (a1 - a0) / 2 }); sc.edgeLog.push(sd + ' booth ' + Math.round(off)); // half: the asphalt across the edge (a 45° road is wider)
        }
        // raised floors at this edge: open where next door has a floor at the level; else a boom (highway, hill street) or a parapet (hill)
        sc.gamePre.floors.forEach((f) => {
          if (!f.z) return;
          const open = [], shut = [], street = [];
          for (let i = 0; i < n; i++) {
            const v = i * step + step / 2, [x, y] = edgePt(sd, v, d0); if (!f.has(x, y)) { open.push(false); shut.push(false); street.push(false); continue; }
            let ok = false; if (nb) { const [qx, qy] = edgePt(OPPS[sd], v, d0); ok = nb.gamePre.floors.some((q) => q.z === f.z && q.has(qx, qy)); }
            const hs = f.kind === 'hill' && sc.hillOk && !sc.hillOk(x, y, OUTER);
            open.push(ok); shut.push(!ok && !hs); street.push(!ok && hs);
          }
          if (f.kind === 'deck' && shut.some(Boolean) && !nb && !sc.checkpoints.some((c) => c.deck && c.off === f.layer.dk.off && c.side === sd)) { sc.checkpoints.push({ side: sd, off: f.layer.dk.off, line: depth + bd / 2, deck: true, z: f.z }); sc.edgeLog.push(sd + ' deck boom ' + f.layer.dk.off); return; }
          for (const [a0, a1] of runsOf(street, step)) { sc.checkpoints.push({ side: sd, off: (a0 + a1) / 2, line: depth + bd / 2, z: f.z, hill: true, half: (a1 - a0) / 2 }); sc.edgeLog.push(sd + ' hill boom ' + Math.round((a0 + a1) / 2)); }
          if (f.kind === 'hill') for (const [a0, a1] of runsOf(shut, step)) { // a parapet along the hill's edge: concrete, an LED line
            const r = edgeRect(sd, a0, a1, WT); sc.solidsZ.push(Object.assign({ z: 1 }, r));
            const HB = f.layer.L; for (let yy = Math.floor(r.y / U); yy < Math.ceil((r.y + r.h) / U); yy++) for (let xx = Math.floor(r.x / U); xx < Math.ceil((r.x + r.w) / U); xx++) { const e = xx === Math.floor(r.x / U) || yy === Math.floor(r.y / U) || xx === Math.ceil((r.x + r.w) / U) - 1 || yy === Math.ceil((r.y + r.h) / U) - 1; HB.put(xx, yy, e ? CON.l : (xx + yy) % 4 < 2 ? N.cyan : CON.m); }
            sc.edgeLog.push(sd + ' hill parapet ' + a0 + '–' + a1);
          }
          if (f.kind === 'walk') { // chevrons where a walkway runs on into the next screen
            for (const [a0, a1] of runsOf(open, step)) { const L = f.layer.L, c = (a0 + a1) / 2, dir = SIDE[sd];
              for (const k of [0, 1]) { const [cx, cy] = edgePt(sd, c, 18 + k * 10); for (let t = -4; t <= 4; t++) { const ax = Math.round(cx / U) + (dir[0] ? -Math.abs(t) * dir[0] * 0.5 : t), ay = Math.round(cy / U) + (dir[1] ? -Math.abs(t) * dir[1] * 0.5 : t); L.put(Math.round(ax), Math.round(ay), k ? N.cyan : K.white); } }
              sc.edgeLog.push(sd + ' walkway on ' + Math.round(c)); }
            if (shut.some(Boolean)) sc.edgeLog.push(sd + ' walkway shut (check)');
          }
        });
      }
      CAP = null;
    }
    for (const sc of Wd.scs) sc.game = gameData(sc);
  }
  // ---------- P6 (Edit 53 in play): one traffic for the district. Every screen's sims link at the seams by level: a lane
  // leaving by a shared edge continues on the lane that enters next door at the same point and elevation (Z0 streets, the
  // Z1 hill streets, the Z1 ring and the highways). Cars within seam sight are seen next door; drivers follow them, the
  // dummy meets them, both screens draw them. Cars enter only where a road or highway crosses the district boundary.
  // A shift of run.appearances.road cars enters by the Z0 roads; highways and the hill streets run off the shift's clock.
  const SIDE = X.SIDE, OPPS = { N: 'S', S: 'N', E: 'W', W: 'E' }, GL = X.seamSight(P);
  const hashId = (id) => { let h = 2166136261; for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619); return h >>> 0; };
  const NOOP = () => {};
  function quiet(s) { // a traffic sim: drivers and cars only; the dummy it sees is the world's (or its proxy next door)
    Object.assign(s, { checkTerminal: NOOP, checkFlip: NOOP });
    s.meets = (c) => { const b = s.body; return !!b && b.alive && !b.stair && b.mode !== 'drop' && b.mode !== 'rescue' && b.level === s.elev0 + (c.layer || 0); };
    if (s.elev0 === 0) s.dispatchDrone = X.Sim.prototype.dispatchDrone; else s.dispatchDrone = NOOP;
  }
  function linkWorld(Wd) {
    const scs = Wd.scs, recs = [], at = (c, r) => scs.find((q) => q.col === c && q.row === r);
    for (const sc of scs) for (const s of sc.sims) {
      s.sc = sc; s.netLane = new Map(); quiet(s);
      const nc = s.newCar.bind(s);
      s.newCar = (id, ...a) => { const c = nc(sc.D.id + '·' + sc.name + '·' + id, ...a); c.sim = s; return c; }; // ids unique across the district
      for (const c of s.cars) { c.id = sc.D.id + '·' + sc.name + '·' + c.id; c.sim = s; }
      const add = (r) => { Object.assign(r, { sc, s, ends: X.laneEnds(r.path, W, H), next: [], prev: [] }); s.netLane.set(r.path, r); recs.push(r); };
      s.level.lanes.forEach((path, k) => add({ i: k, path, simLayer: 0, elev: s.elev0, deck: null }));
      (s.level.deckLanes || []).forEach((ln, j) => { const z = (s.level.decks[ln.deck] && s.level.decks[ln.deck].z) || 1; add({ i: 2 + j, path: ln.path, simLayer: z, elev: s.elev0 + z, deck: ln.deck }); });
    }
    for (const a of recs) {
      const o = a.ends.out, nb = o && at(a.sc.col + SIDE[o.side][0], a.sc.row + SIDE[o.side][1]);
      if (!nb) continue;
      for (const b of recs) if (b.sc === nb && b.elev === a.elev && b.ends.in && b.ends.in.side === OPPS[o.side] && Math.abs(b.ends.in.off - o.off) < 6 && b.ends.in.tx * o.tx + b.ends.in.ty * o.ty > 0.9) { a.next.push(b); b.prev.push(a); }
      if (a.next.length) a.path.netOut = { s: o.s, path: a.next[0].path, ds: a.next[0].ends.in.s - o.s }; // corner speed reads the next screen's bends
    }
    const outside = (sc, e) => !at(sc.col + SIDE[e.side][0], sc.row + SIDE[e.side][1]);
    for (const r of recs) r.toExit = !r.next.length ? 0 : Infinity; // seams to the nearest way out (traffic.exitAfterSeams)
    for (let changed = true; changed;) { changed = false; for (const r of recs) for (const q of r.next) if (q.toExit + 1 < r.toExit) { r.toExit = q.toExit + 1; changed = true; } }
    // P6.1 (Edit 63): managed traffic. No sim admits on its own schedule: manage() spawns off-screen to a density target.
    const cruise = P['vehicles.sedan.cruiseSpeed'], dki = P['world.district.' + Wd.D.id + '.deckInterval'];
    const SG = 2 * P['world.district.' + Wd.D.id + '.interval'] * cruise; // street spacing: one car per lane per 2 × interval at cruise
    const SD = (dki || P['world.deckInterval'] * P['traffic.deckGapScale']) * cruise * P['traffic.deckSpeedScale']; // highway spacing (Edit 54 feed)
    for (const sc of scs) {
      sc.flow = new Map();
      for (const s of sc.sims) {
        Object.assign(s, { admit: NOOP, admitDeck: NOOP });
        if (dki) s.P = Object.assign({}, s.P, { 'world.deckInterval': dki / s.P['traffic.deckGapScale'] });
        for (const r of recs.filter((q) => q.s === s && q.ends.in)) { // one group per physical inlet: a junction's routes share their approach
          const cls = r.deck != null ? 'deck' + r.elev : s.elev0 && s.lab && s === sc.ringSim ? 'ring' : 'street' + r.elev, key = cls + ':' + r.ends.in.side + Math.round(r.ends.in.off);
          if (!sc.flow.has(cls)) sc.flow.set(cls, { cls, S: cls.startsWith('street') ? SG : SD, groups: new Map(), target: 0, n: 0, rr: 0 });
          const F = sc.flow.get(cls);
          if (!F.groups.has(key)) F.groups.set(key, { key, recs: [], len: 0, boundary: outside(sc, r.ends.in), busOK: true });
          const g = F.groups.get(key); g.recs.push(r); r.group = g; r.cls = cls;
          g.len = Math.max(g.len, (r.ends.out ? r.ends.out.s : r.path.length) - r.ends.in.s);
        }
      }
      for (const F of sc.flow.values()) { F.target = [...F.groups.values()].reduce((a, g) => a + g.len, 0) / F.S; F.list = [...F.groups.values()]; }
    }
    for (const r of recs) if (r.group && r.deck == null) { // a bus enters only where every lane it can reach keeps vehicles.bus.minRadius
      const seen = new Set(), todo = [r];
      while (todo.length) { const q = todo.pop(); if (seen.has(q)) continue; seen.add(q); todo.push(...q.next.filter((z) => z.deck == null)); }
      if (![...seen].every((q) => !q.s.lab && X.minBend(q.path.pts, W, H) >= RB * 0.9)) r.group.busOK = false;
    }
    Wd.recs = recs; Wd.sims = [].concat(...scs.map((sc) => sc.sims));
  }
  function recOf(s, c) { // a lap variant on a ring shares its route's ends and links
    const m = s.netLane; if (!m) return null;
    let r = m.get(c.path);
    if (!r && c.path.ring && c.path.ring.variants) { const base = m.get(c.path.ring.variants[0]); if (base) { r = Object.assign({}, base, { path: c.path, ends: X.laneEnds(c.path, W, H) }); m.set(c.path, r); } }
    return r || null;
  }
  const routeOf = (r, c) => { // a car's route next door, chosen afresh at every seam; after traffic.exitAfterSeams, the way out
    if (r.next.length === 1) return r.next[0];
    const h = hashId(c.id + r.sc.name + (c.hops || 0)), ns = (c.hops || 0) >= P['traffic.exitAfterSeams'] ? r.next.filter((q) => q.toExit === Math.min(...r.next.map((z) => z.toExit))) : r.next;
    return ns[h % ns.length];
  };
  function ghostOf(o, r, s) {
    const g = Object.create(o), p = X.pathAt(r.path, s);
    Object.assign(g, { ghost: true, real: o, lane: r.i, path: r.path, s, layer: r.simLayer, deck: r.simLayer > 0, x: p.x + p.nx * o.d, y: p.y + p.ny * o.d, h: o.h, vx: o.vx, vy: o.vy });
    if (r.deck != null) g.deckIdx = r.deck;
    return g;
  }
  function seamGhosts(Wd, scOnly) { // cars near a seam, on the lanes next door that lead to or from theirs
    const add = new Map();
    for (const s of Wd.sims) for (const o of s.cars) {
      if (o.ghost) continue;
      const r = recOf(s, o); if (!r) continue;
      if (r.prev.length && o.s - r.ends.in.s < GL) for (const a of r.prev) if (!scOnly || a.sc === scOnly) { if (!add.has(a.s)) add.set(a.s, []); add.get(a.s).push(ghostOf(o, a, a.ends.out.s + (o.s - r.ends.in.s))); }
      if (r.next.length && r.ends.out.s - o.s < GL) { const b = routeOf(r, o), sb = b.ends.in.s - (r.ends.out.s - o.s); if (sb > 0 && (!scOnly || b.sc === scOnly)) { if (!add.has(b.s)) add.set(b.s, []); add.get(b.s).push(ghostOf(o, b, sb)); } }
    }
    return add;
  }
  // One tick of a traffic sim: admissions at the district edge, drivers, cars in substeps, its drones.
  function trafficTick(s, dt, t) {
    const N = Math.max(1, Math.round(P['proto.substeps'])), h = dt / N;
    s.tick++; s.t = t;
    s.admit(); s.admitDeck();
    s.carAI(dt);
    for (let k = 0; k < N; k++) s.moveCars(h, t - dt + (k + 1) * h);
    s.stepDrones(dt);
  }
  function stepWorld(Wd, body, act) {
    const dt = 1 / P['simulation.tickRate'];
    Wd.t += dt;
    for (const sc of Wd.scs) { // the dummy as each screen's drivers see it: itself here, across a shared edge next door, else away
      let pb = AWAY;
      if (body && body.alive && act) {
        const dc = sc.col - act.col, dr = sc.row - act.row;
        if (!dc && !dr) pb = body;
        else if (Math.abs(dc) + Math.abs(dr) === 1) { pb = Object.create(body); pb.x = body.x - dc * W; pb.y = body.y - dr * H; }
      }
      for (const s of sc.sims) s.body = pb;
    }
    const add = seamGhosts(Wd);
    for (const [s, gs] of add) s.cars = s.cars.concat(gs);
    for (const s of Wd.sims) trafficTick(s, dt, Wd.t);
    for (const s of Wd.sims) { s.cars = s.cars.filter((c) => !c.ghost); if (s.events.length) { if (act && s.sc === act) Wd.events.push(...s.events); s.events.length = 0; } }
    const moved = [];
    for (const s of Wd.sims) s.cars = s.cars.filter((c) => {
      const r = recOf(s, c);
      if (r && r.next.length && c.s >= r.ends.out.s) { moved.push([c, r]); return false; }
      if (c.s - c.L / 2 <= c.path.length) return true;
      if (c.shift) Wd.exited++; // left the district
      return false;
    });
    for (const [c, r] of moved) {
      const nx = routeOf(r, c), ds = nx.ends.in.s - r.ends.out.s, dx = (nx.sc.col - r.sc.col) * W, dy = (nx.sc.row - r.sc.row) * H; // a junction: the car picks its route at the seam
      Object.assign(c, { s: c.s + ds, path: nx.path, lane: nx.i, layer: nx.simLayer, deck: nx.simLayer > 0, orbit: null, letOut: null, yielding: false, ringInnerDone: false, hops: (c.hops || 0) + 1, sim: nx.s });
      if (nx.deck != null) c.deckIdx = nx.deck;
      for (const m of [c.man, c.intent]) if (m) for (const k of ['s0', 'sTarget', 'sStop']) if (m[k] != null) m[k] += ds;
      if (c.dodge && c.dodge.s != null) c.dodge = Object.assign({}, c.dodge, { s: c.dodge.s + ds });
      if (c.holdX != null) { c.holdX -= dx; c.holdY -= dy; }
      const p = X.pathAt(c.path, c.s); c.x = p.x + p.nx * c.d; c.y = p.y + p.ny * c.d;
      nx.s.cars.push(c); Wd.crossings++; if (nx.group) nx.group.lastIn = Wd.t; // an arrival from upstream: this inlet's flow
    }
    for (const s of Wd.sims) for (const c of s.cars) { c.elev = s.elev0 + (c.layer || 0); c.sim = s; }
    if (++Wd.tick % 15 === 0) manage(Wd, act); // P6.1: four times a second
    if (Wd.events.length > 400) Wd.events.splice(0, Wd.events.length - 400);
  }
  // P6.1 (Edit 63): traffic managed as GTA does it, but never in view. Off-screen, each screen's streets, highways and ring
  // are filled to one car per spacing of lane (2 × world.district.<id>.interval at cruise; highways at their feed); a car
  // spawns at an inlet with room, never one fed from the screen in view. Off-screen, a car stopped traffic.offscreenCullSeconds
  // is removed (no jam survives out of sight); once the shift's cars have all appeared, its unseen cars go. In view, nothing
  // appears or vanishes: cars on screen persist, and a car followed to the next screen keeps its speed (O3.72).
  function seen(act, sc, c, m) { // is this car on the screen in view, or reaching onto it?
    if (!act) return false;
    const dc = sc.col - act.col, dr = sc.row - act.row; if (Math.abs(dc) > 1 || Math.abs(dr) > 1) return false;
    const x = c.x + dc * W, y = c.y + dr * H; m = m == null ? (c.L || 0) + 24 : m;
    return x > -m && x < W + m && y > -m && y < H + m;
  }
  function groupCars(g) { const out = []; const ss = new Set(g.recs.map((r) => r.s)); for (const s of ss) for (const c of s.cars) { const r = recOf(s, c); if (r && r.group === g) out.push(c); } return out; }
  function roomAt(Wd, g, r, s0, ahead, behind) { // clear ahead along the inlet's lanes, and no car coming up behind across the seam
    for (const c of groupCars(g)) if (c.s + c.L / 2 > s0 - 40 && c.s - c.L / 2 < s0 + ahead) return false;
    for (const q0 of g.recs) for (const q of q0.prev) for (const c of q.s.cars) { if (recOf(q.s, c) !== q) continue; if (q.ends.out.s - c.s < behind + c.L) return false; }
    return true;
  }
  function queued(g) { // a queue on the inlet's lanes, or on the lanes they feed next door: add nothing (no car into a jam)
    for (const c of groupCars(g)) if ((c.stopT || 0) > 0.5) return true;
    for (const r of g.recs) for (const q of r.next) for (const c of q.s.cars) if (recOf(q.s, c) === q && (c.stopT || 0) > 0.5) return true;
    return false;
  }
  function spawn(Wd, r, s0) {
    const s = r.s, n = ++Wd.spawnSeq, u = (n * 0.6180339887 + 0.53) % 1;
    let c;
    if (r.deck != null) c = s.addDeckCar(r.i - 2, s0, s.deckCls(n));
    else { let cls = X.fleetClass(P, 0.25, u); if (cls === 'bus' && !r.group.busOK) cls = 'sedan'; c = s.newCar('car' + n, cls, r.i, r.path, s0, 0); s.cars.push(c); }
    c.v = Math.min(c.v, s.cornerSpeed(c)); s.pose(c);
    c.elev = s.elev0 + (c.layer || 0); c.sim = s; c.slot = n;
    if (!c.elev && r.deck == null) c.shift = true;
    return c;
  }
  function manage(Wd, act) {
    const exhausted = Wd.live && Wd.admitted >= Wd.budget, cull = P['traffic.offscreenCullSeconds'], Lb = P['vehicles.bus.length'], cruise = P['vehicles.sedan.cruiseSpeed'];
    for (const sc of Wd.scs) for (const F of sc.flow.values()) {
      let n = 0; for (const s of sc.sims) for (const c of s.cars) { const r = recOf(s, c); if (r && r.cls === F.cls) n++; }
      F.n = n;
      if (n >= F.target + 1 || (exhausted && F.cls === 'street0')) continue; // a cap; the shift's streets stop filling once it is spent
      const cands = F.list.filter((g) => sc !== act || g.boundary);
      const hw = F.S / (cruise * (F.cls.startsWith('street') ? 1 : P['traffic.deckSpeedScale'])); // the target headway at an inlet
      for (let k = 0; k < cands.length; k++) { // an inlet from beyond the district meters at the headway; any other fills only a missing car (1.5 headways)
        const g = cands[(F.rr + k) % cands.length], r = g.recs[(Wd.spawnSeq + k) % g.recs.length], jit = 0.85 + 0.3 * ((Wd.spawnSeq * 0.6180339887) % 1);
        if (Wd.t - (g.lastIn != null ? g.lastIn : -1e9) < hw * (g.boundary ? jit : 1.5)) continue;
        const s0 = g.boundary ? Lb / 2 + 2 : r.ends.in.s + 2, ahead = Math.max(Lb * (1 + P['traffic.entryRoomLengths']) + P['traffic.minimumGap'], F.S * 0.5);
        if (sc === act && seen(act, sc, X.pathAt(r.path, s0), 40)) continue; // the screen in view: only from beyond the district edge, out of sight
        if (!roomAt(Wd, g, r, s0, ahead, F.S * 0.5) || queued(g)) continue;
        spawn(Wd, r, s0); g.lastIn = Wd.t; if (++n >= F.target + 1) break;
      }
      F.rr = (F.rr + 1) % Math.max(1, cands.length);
    }
    for (const s of Wd.sims) { // off-screen: no jam survives out of sight; a finished shift's unseen cars go
      if (!s.cars.length) continue;
      s.cars = s.cars.filter((c) => { if (seen(act, s.sc, c)) return true; if ((c.stopT || 0) > cull) { Wd.culled++; return false; } if (exhausted && c.shift) return false; return true; });
    }
  }
  function goLive(Wd) { // the shift starts: it counts Z0 cars as they appear on the screen in view (P6.1)
    Wd.live = true; Wd.admitted = 0; Wd.events.length = 0;
    for (const s of Wd.sims) for (const c of s.cars) if (!(c.elev || 0) && c.deck !== true) c.shift = true;
  }
  // The district: nine screens, linked, warmed for traffic.warmSeconds so no screen waits for cars.
  function buildWorld(id, opts) {
    opts = opts || {};
    const D = DISTRICTS.find((d) => d.id === id);
    if (!D) throw new Error('no P6 district ' + id);
    const scs = [];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) scs.push(buildScreen(D, c, r));
    edgePass({ scs, at: (c, r) => (c >= 0 && c < 3 && r >= 0 && r < 3 ? scs[r * 3 + c] : null) }); // P6.1: barriers and booms where an edge cannot be crossed
    const Wd = { id, D, scs, at: (c, r) => (c >= 0 && c < 3 && r >= 0 && r < 3 ? scs[r * 3 + c] : null), t: 0, live: false, budget: opts.budget != null ? opts.budget : P['run.appearances.road'], admitted: 0, exited: 0, crossings: 0, events: [], tick: 0, spawnSeq: 0, culled: 0 }; // admitted (P6.1): shift cars that have appeared on the screen in view
    linkWorld(Wd);
    for (const sc of scs) { // cones live on their screen; ground drivers and the dummy share them
      sc.cones.length = 0;
      sc.game.coneHomes.forEach(([x, y], i) => sc.cones.push({ id: 'cone' + sc.name + '-' + (i + 1), x, y, hx: x, hy: y, vx: 0, vy: 0, state: 'free', flightT: 0, flightDur: 1 }));
      for (const s of sc.sims) if (s.elev0 === 0) { s.cones = sc.cones; s.level.coneHomes = sc.game.coneHomes; }
    }
    const warm = opts.warm != null ? opts.warm : P['traffic.warmSeconds'];
    for (let k = 0; k < Math.round(warm * P['simulation.tickRate']); k++) stepWorld(Wd, null, null);
    for (const s of Wd.sims) for (const c of s.cars) { c.elev = s.elev0 + (c.layer || 0); c.sim = s; }
    goLive(Wd);
    return Wd;
  }
  // The active screen's cars as the dummy and the renderer see them: its own, and the cars next door reaching onto it.
  function viewCars(Wd, sc) {
    const out = [];
    for (const s of sc.sims) for (const c of s.cars) out.push(c);
    for (const gs of seamGhosts(Wd, sc).values()) for (const g of gs) { const r = (g.L + g.W) / 2 + 8; if (g.x > -r && g.x < W + r && g.y > -r && g.y < H + r) out.push(g); }
    return out;
  }
  // ---------- drawing a screen (P6). The ground buffer; then one depth-sorted pass of props, ground actors and layers.
  // A layer (deck, ring, walkway, hill) draws its own surface, props and actors on the footprint, then lifts as one.
  const carKey = (c) => c.y + Math.abs(Math.sin(c.h)) * c.L / 2 + Math.abs(Math.cos(c.h)) * c.W / 2;
  const carSpr = (c) => PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(P['vehicles.' + c.cls + '.height']), c.h, false);
  // hk: { cars, layerOf(c), car(c, buf, lift), items: [[key, fn]], bodyOn: layer, bodyKey, body(buf, lift), under(), layerUnder(l, buf, cars, me), layerDone(l, cars, me) }
  function compose(sc, FB, DL, hk) {
    hk = hk || {};
    FB.d.set(sc.B.d);
    if (hk.under) hk.under();
    const items = [], onL = new Map();
    for (const c of hk.cars || []) {
      const l = hk.layerOf ? hk.layerOf(c) : null;
      if (l) { if (!onL.has(l)) onL.set(l, []); onL.get(l).push(c); } else items.push([carKey(c), () => (hk.car ? hk.car(c, FB, 0) : PIX.blit(FB, carSpr(c), c.x / U, c.y / U))]);
    }
    for (const it of hk.items || []) items.push(it);
    for (const p of sc.props) if (!p.podium && !p.tower) items.push([p.key != null ? p.key : p.over ? 1e6 + 1 : p.by, p.draw ? () => p.draw(FB) : () => PIX.blit(FB, p.spr, p.x, p.y)]);
    const drawLayer = (l) => {
      DL.d.set(l.L.d);
      const cars = onL.get(l) || [], me = hk.bodyOn === l;
      if (hk.layerUnder) hk.layerUnder(l, DL, cars, me);
      const list = cars.map((c) => [carKey(c), () => (hk.car ? hk.car(c, DL, l.lift) : PIX.blit(DL, carSpr(c), c.x / U, c.y / U))]);
      for (const p of l.props || []) list.push([p.by, () => PIX.blit(DL, p.spr, p.x, p.y)]);
      if (me && hk.body) list.push([hk.bodyKey, () => hk.body(DL, l.lift)]);
      list.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
      for (let y = 0; y < AH; y++) { const ty = y - l.lift; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
      if (l.lift) for (let x = 0; x < AW; x++) { const c = DL.d[(AH - 1) * AW + x]; if (c) for (let ty = AH - l.lift; ty < AH; ty++) FB.d[ty * AW + x] = c; } // a layer running off the bottom edge
      if (hk.layerDone) hk.layerDone(l, cars, me);
    };
    for (const l of sc.layers) {
      for (const c of l.cols) items.push([Math.min(c.key, l.front - 1), () => PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U))]);
      items.push([l.front, () => drawLayer(l)]);
    }
    for (const p of sc.props) if (p.podium) items.push([1e6 - 1, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    for (const p of sc.props) if (p.tower) items.push([1e6 + 2, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    items.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
    if (sc.monument) drawMonument(FB, sc.monument.cx, sc.monument.cy);
  }
  // the layer a car is drawn with: the lifted layer at its elevation under it (none at Z0)
  function layerOf(sc, c) {
    const e = c.elev || 0;
    if (!e) return null;
    const ls = sc.layers.filter((l) => (l.z || 0) === e && !l.walk && !l.gate);
    return ls.find((l) => l.inBand(c.x, c.y)) || ls.find((l) => l.inBand(Math.max(1, Math.min(W - 1, c.x)), Math.max(1, Math.min(H - 1, c.y)))) || ls[0] || null;
  }
  // ---------- P6 player sim (GDD Edit 62). The P5 dummy, on the P6 world: floors as tests at a level, solids at Z0 and
  // above, the hill polygon with its tunnel, water and the drone rescue (D37), screens as the world's, the shift's clock.
  const LEVEL_LIST = DISTRICTS.map((d) => d.id);
  const INFO = (id) => { const D = DISTRICTS.find((d) => d.id === id); return D ? { name: D.name, blurb: D.mood } : null; };
  const nameOf = (c, r) => 'ABC'[c] + (r + 1);
  class Sim6 extends X.Sim {
    constructor(id, overrides, carry, opts) {
      super('straight', Object.assign({}, overrides || {}, { 'run.appearances.road': 0 }), carry);
      opts = opts || {};
      this.p6 = true; this.levelId = id; this.list = LEVEL_LIST; this.roadIndex = LEVEL_LIST.indexOf(id); this.isFinal = this.roadIndex === LEVEL_LIST.length - 1; this.isCity = true;
      const bud = overrides && overrides['run.appearances.road'] != null ? overrides['run.appearances.road'] : P['run.appearances.road'];
      this.P['run.appearances.road'] = bud;
      this.W6 = opts.world || buildWorld(id, { budget: bud, warm: opts.warm });
      this.reset();
    }
    reset() {
      if (!this.W6) return super.reset(); // the base constructor's own reset, before the world exists
      const P = this.P, Wd = this.W6, cy = this.carry || {}, D = Wd.D;
      this.t = Wd.t; this.tStart = Wd.t; this.tick = 0; this.phase = 'play'; this.phaseT = 0; this.pendingPhase = null;
      this.tOffset = (cy.t || 0) - this.tStart;
      this.cars = []; this.view = []; this.drones = []; this.rescue = null; this.booms = {}; this.deckNext = {};
      this.schedule = new Array(Wd.budget).fill(null); this.slot = Wd.admitted;
      this.run = { writeOffs: 0, credits: cy.credits || 0, points: cy.points || 0, owned: Object.assign({}, cy.owned), chassis: cy.chassis || 0,
        ending: null, admitted: Wd.admitted, exited: 0, purchases: (cy.purchases || []).slice(), priorWriteOffs: cy.writeOffs || 0 };
      this.quota = P['world.district.' + this.levelId + '.quota'];
      this.events = []; this.effects = []; this.milestones = Object.assign({}, cy.milestones); this.report = null; this.turnHist = [];
      for (const s of Wd.sims) s.models = this.models; // learning is the fleet's: every driver reads the same models
      const [tile, edge] = D.start, c0 = 'ABC'.indexOf(tile[0]), r0 = +tile[1] - 1;
      this.district = { cols: 3, rows: 3, cur: [c0, r0], start: [c0, r0], visited: new Set([r0 * 3 + c0]), path: [], lastFlip: null, edge,
        cells: [0, 1, 2].map((r) => [0, 1, 2].map((c) => { const g = Wd.at(c, r).game; return { center: g.center, ring: g.ring, decks: g.deckLines, focal: null, landmark: g.landmark }; })) };
      this.enter(Wd.at(c0, r0));
      this.spawnBody();
      this.buildView();
    }
    enter(sc) { this.sc = sc; this.level = sc.game; this.cones = sc.cones; this.booms = sc.booms || (sc.booms = {}); this.district.cur = [sc.col, sc.row]; }
    screenName() { return nameOf(this.district.cur[0], this.district.cur[1]); }
    buildView() { this.cars = viewCars(this.W6, this.sc); this.view = this.cars; }
    carsLeft() { return Math.max(0, this.W6.budget - this.W6.admitted); } // P6.1: shift cars still to appear
    allCars() { const out = []; for (const s of this.W6.sims) for (const c of s.cars) if (c.shift && !c.ghost) out.push(c); return out; } // the shift's cars still in the district
    bodyLayer() { const b = this.body; return b && b.alive && !b.stair && b.mode !== 'drop' && b.mode !== 'rescue' ? b.level : null; }
    meets(c) { return this.bodyLayer() === (c.elev || 0); } // P6: by elevation (no two traffic surfaces share a level and a footprint)
    bodyDeck() { return null; }
    floorOf() { const b = this.body; return b.floor != null && b.floor >= 0 ? this.level.floors[b.floor] || null : null; }
    onGround() { const b = this.body; return b.level === 0 && !b.stair && b.mode !== 'drop' && b.mode !== 'rescue'; }
    spawnBody() {
      super.spawnBody();
      const b = this.body, sp = this.level.spawns.find((q) => q.x === b.x && q.y === b.y) || this.level.spawns[0];
      if (sp) { b.x = sp.x; b.y = sp.y; b.level = sp.level || 0; b.floor = sp.floor != null ? sp.floor : null; }
      b.px = b.x; b.py = b.y;
    }
    pickSpawn() {
      const sps = this.level.spawns.length ? this.level.spawns : [{ x: W / 2, y: H / 2, f: 90, level: 0, floor: null }];
      for (const sp of sps) if (this.cars.every((c) => (c.elev || 0) !== (sp.level || 0) || hyp(c.x - sp.x, c.y - sp.y) > 80)) return sp;
      return sps[0];
    }
    // ----- the step: the world's traffic first (the dummy as last seen), then the dummy against the cars as they now stand
    step(cmd) {
      const P = this.P, dt = 1 / P['simulation.tickRate'];
      cmd = cmd || {};
      if (this.phase === 'hitstop' || this.phase === 'writeoff' || this.phase === 'scroll') {
        this.phaseT -= dt;
        if (this.phaseT <= 1e-9) this.phase = this.phase === 'writeoff' ? this.pendingPhase : 'play';
        return;
      }
      if (this.phase !== 'play') return;
      this.tick++; this.t += dt;
      const Wd = this.W6;
      stepWorld(Wd, this.body, this.sc);
      this.t = Wd.t;
      for (const e of Wd.events) if (FORWARD.has(e.type)) { const d = Object.assign({}, e); delete d.t; delete d.type; this.emit(e.type, d); }
      Wd.events.length = 0;
      this.buildView();
      for (const c of this.cars) { const o = c.ghost ? c.real : c; if (o.shift && !o.appeared && c.x > 0 && c.x < W && c.y > 0 && c.y < H) { o.appeared = true; if (Wd.admitted < Wd.budget) Wd.admitted++; } } // P6.1: the shift's clock counts cars as they appear here
      this.slot = Wd.admitted; this.run.admitted = Wd.admitted; this.run.exited = Wd.exited;
      for (const c of this.cars) c.touched = false;
      this.bodyControl(cmd, dt);
      const N = Math.max(1, Math.round(P['proto.substeps'])), h = dt / N, contacts = [];
      for (let k = 0; k < N; k++) { this.moveBody(h); this.floorStep(contacts, k); this.collideBody(contacts, k); this.moveCones(h); }
      for (const c of this.cars) if (!c.touched) c.inEpisode = false;
      const own = Object.prototype.hasOwnProperty;
      for (const g of this.cars) if (g.ghost) for (const k of ['touched', 'inEpisode', 'spent']) if (own.call(g, k)) g.real[k] = g[k]; // what the dummy did to a car next door happened to it
      const positive = this.account(contacts);
      this.retryPending();
      this.stepRescue(dt);
      this.stepBooms(dt); // P6.1: booms where a road or highway leaves the district
      this.trackUse();
      this.checkTerminal();
      if (this.phase === 'play') this.checkFlip();
      if (this.phase === 'play' && positive && P['feedback.hitStop'] > 0) { this.phase = 'hitstop'; this.phaseT = P['feedback.hitStop']; }
      this.effects = this.effects.filter((e) => this.t - e.t < 1.5);
    }
    moveBody(h) { const b = this.body; b.px = b.x; b.py = b.y; if (b.mode === 'rescue') return; super.moveBody(h); }
    bodyControl(cmd, dt) { if (this.body.mode === 'rescue') return; super.bodyControl(cmd, dt); }
    // ----- floors (P6): a floor is a test on the centre at its level
    floorStep(contacts, k) {
      const b = this.body;
      if (!b.alive || b.mode === 'rescue') return;
      if (b.mode === 'drop') { if (b.drop.t >= b.drop.T - 1e-9) this.land(contacts, k); return; }
      if (b.stair) return this.stairStep();
      if (b.level > 0) return this.floorMove();
      for (const st of this.level.stairs) { const t = this.stairT(st, b.x, b.y); if (t >= 0 && t < 0.35 && this.stairFoot(st) && this.enterStair(st, 'foot')) return; }
      if (this.level.water.some((p) => PIX.inPoly(p, b.x, b.y))) this.startRescue(); // off the seawall into the river
    }
    stairStep() {
      const P = this.P, b = this.body, st = b.stair, r = P['body.radius'], [l0, l1] = this.stairSpan(st), m = Math.min(r, (l1 - l0) / 4);
      if (st.axis === 'y') b.x = Math.max(l0 + m, Math.min(l1 - m, b.x)); else b.y = Math.max(l0 + m, Math.min(l1 - m, b.y));
      const len = Math.abs(st.high - st.low), t = this.stairT(st, b.x, b.y), ext = (P['world.parapetWidth'] + r) / len;
      if (t < 0) { b.stair = null; b.level = st.from; b.floor = null; this.emit('level', { level: b.level }); }
      else if (t > 1 + ext) {
        const f = this.level.floors[st.head], dir = Math.sign(st.high - st.low);
        for (let k = 0; k < 24 && f && !f.has(b.x, b.y); k++) { if (st.axis === 'y') b.y += dir * 2; else b.x += dir * 2; } // step off fully onto the floor
        b.stair = null; b.level = st.to; b.floor = st.head;
        this.emit('level', { level: b.level, floor: f ? f.kind : null }); this.mile(f && f.kind === 'roof' ? 'firstRoof' : st.to === 2 ? 'firstHighway' : 'firstDeck');
      }
    }
    // On a floor: inside its test, or across an edge onto another floor at the level, onto a stair, into the next screen
    // (where it has a floor at the level), off a drop edge (walkway, hill, terrace, roof, broken parapet); else it holds.
    floorMove() {
      const b = this.body, f = this.floorOf(), z = b.level;
      if (!f) { b.level = 0; b.floor = null; return; }
      if (f.has(b.x, b.y)) return;
      const block = () => { if (b.mode === 'lunge') b.lunge.blocked = true; };
      const g = this.level.floors.findIndex((q) => q !== f && q.z === z && q.has(b.x, b.y));
      if (g >= 0) { b.floor = g; return; }
      for (const st of this.level.stairs) {
        if (st.head !== b.floor) continue;
        const [l0, l1] = this.stairSpan(st), lat = st.axis === 'y' ? b.x : b.y, t = this.stairT(st, b.x, b.y), ext = (this.P['world.parapetWidth'] + this.P['body.radius']) / Math.abs(st.high - st.low);
        if (lat >= l0 + 2 && lat <= l1 - 2 && t >= 0.5 && t <= 1 + ext + 0.25 && this.enterStair(st, 'head')) return;
      }
      if (b.x < 0 || b.x > W || b.y < 0 || b.y > H) { if (this.neighbourFloor(b.x, b.y, z)) return; }
      else if (f.drop || (f.dropAt && f.dropAt(b.x, b.y))) { let ux = b.x - b.px, uy = b.y - b.py, l = hyp(ux, uy); if (l < 1e-6) { ux = Math.cos(b.facing); uy = Math.sin(b.facing); l = 1; } return this.startDrop6(ux / l, uy / l); }
      if (f.has(b.px, b.y)) { b.x = b.px; b.vx = 0; } else if (f.has(b.x, b.py)) { b.y = b.py; b.vy = 0; } else { b.x = b.px; b.y = b.py; b.vx = 0; b.vy = 0; }
      if (!f.has(b.x, b.y)) { const q = this.level.floors.findIndex((o) => o.z === z && o.has(b.x, b.y)); if (q >= 0) b.floor = q; }
      block();
    }
    neighbourFloor(x, y, z) { // the floor at this level next door, at the point across the shared edge
      const sd = x > W ? 'E' : x < 0 ? 'W' : y > H ? 'S' : y < 0 ? 'N' : null;
      if (!sd) return null;
      const nb = this.W6.at(this.district.cur[0] + SIDE[sd][0], this.district.cur[1] + SIDE[sd][1]);
      if (!nb) return null;
      const nx = Math.max(1, Math.min(W - 1, x - SIDE[sd][0] * W)), ny = Math.max(1, Math.min(H - 1, y - SIDE[sd][1] * H));
      const i = nb.game.floors.findIndex((q) => q.z === z && q.has(nx, ny));
      return i >= 0 ? { sc: nb, i } : null;
    }
    // Off a drop edge: velocity carries on, outward at least far enough to clear the edge. The dummy lands on the nearest
    // floor below its landing point, else the ground (or the river). Fall time and landing speed grow with √height.
    startDrop6(ux, uy) {
      const P = this.P, b = this.body, r = P['body.radius'], vmax = P['movement.runSpeed'], fromZ = b.level, ref = P['world.deckHeight'], fromKind = (this.floorOf() || {}).kind || null;
      let vx = b.vx, vy = b.vy; const sp = hyp(vx, vy);
      if (sp > vmax) { vx *= vmax / sp; vy *= vmax / sp; }
      const plan = (T) => { const vo = vx * ux + vy * uy, need = (P['world.parapetWidth'] + 2 * r) / T, add = Math.max(0, need - vo); return [vx + ux * add, vy + uy * add]; };
      let T = P['world.dropSeconds'] * Math.sqrt(X.zHeight(P, fromZ) / ref), [dx, dy] = plan(T), toZ = 0, toFloor = null;
      const lx = b.x + dx * T, ly = b.y + dy * T;
      this.level.floors.forEach((q, i) => { if (q.z < fromZ && q.z > toZ && q.has(lx, ly)) { toZ = q.z; toFloor = i; } });
      const h = X.zHeight(P, fromZ) - X.zHeight(P, toZ);
      T = P['world.dropSeconds'] * Math.sqrt(h / ref); [dx, dy] = plan(T);
      b.mode = 'drop'; b.lunge = null; b.stair = null; b.floor = null;
      b.drop = { t: 0, T, vx: dx, vy: dy, x0: b.x, y0: b.y, fromZ, toZ, toFloor, h, fromKind }; b.vx = dx; b.vy = dy;
      this.emit('deck-drop', { x: +b.x.toFixed(1), y: +b.y.toFixed(1), from: fromZ, to: toZ, h, fromKind });
      this.mile('firstDeckDrop');
    }
    land(contacts, k) {
      super.land(contacts, k);
      const b = this.body;
      if (b.level === 0 && this.level.water.some((p) => PIX.inPoly(p, b.x, b.y))) this.startRescue(); // into the river
    }
    // ----- the river (D37): a drone lifts the dummy and sets it down on the nearest land at Z0 or Z1, never a lane, a deck
    // or a building. Time: proto.droneLiftSeconds, then the distance at proto.droneSpeed.
    startRescue() { // P6.1 (Edit 63): the dummy sinks for proto.rescueSinkSeconds; then a drone flies in from the nearest screen edge
      const b = this.body, P = this.P, G = this.level;
      let best = null;
      for (const sp of this.landPoints()) { const d = hyp(sp.x - b.x, sp.y - b.y); if (!best || d < best.d) best = Object.assign({ d }, sp); }
      if (!best) best = Object.assign({ d: 0 }, G.spawns[0] || { x: W / 2, y: H / 2, level: 0, floor: null });
      const edges = [[b.x, -40], [b.x, H + 40], [-40, b.y], [W + 40, b.y]].sort((p, q) => hyp(p[0] - b.x, p[1] - b.y) - hyp(q[0] - b.x, q[1] - b.y)), ex = edges[0];
      if (b.held) { const cn = b.held; b.held = null; b.gesture = null; Object.assign(cn, { state: 'pending', px: b.x, py: b.y }); } // the cone goes home (retryPending)
      b.mode = 'rescue'; b.lunge = null; b.stair = null; b.vx = b.vy = 0; b.level = 0; b.floor = null; b._spr = null;
      this.rescue = { t: 0, phase: 'sink', k: 0, x0: b.x, y0: b.y, to: best, under: 0, up: 0, sink: P['proto.rescueSinkSeconds'], lift: P['proto.droneLiftSeconds'], v: P['proto.droneSpeed'],
        drone: { x: ex[0], y: ex[1], alt: 1, state: 'wait', rescue: true, hx: ex[0], hy: ex[1] } };
      this.emit('splash', { x: +b.x.toFixed(1), y: +b.y.toFixed(1) });
      this.mile('firstRescue');
    }
    landPoints() { // land beside the water, by screen, cached
      const sc = this.sc;
      if (sc.land) return sc.land;
      const G = sc.game, out = [], free = (x, y) => !G.statics.some((s) => inR(s, x, y, R0 + 2)) && G.polys0.every((p) => !PIX.inPoly(p, x, y) && polyDist(p, x, y).d >= R0) && !G.water.some((p) => PIX.inPoly(p, x, y) || polyDist(p, x, y).d < R0 / 2) && !G.stairs.some((s) => inR(s, x, y, R0 + 2)); // the promenade is 28 across: the body may overhang the kerb and the wall by half
      for (let y = 16; y <= H - 16; y += 4) for (let x = 16; x <= W - 16; x += 4) { // a fine grid: the promenade between the kerb and the seawall is world.walkwayWidth across
        if (sc.roadOk(x, y, OUTER + R0 / 2) && free(x, y) && !G.floors.some((f) => f.kind !== 'hill' && f.has(x, y))) out.push({ x, y, level: 0, floor: null });
        else { const hf = G.floors.find((f) => f.kind === 'hill' && f.has(x, y)); if (hf && (!sc.hillOk || sc.hillOk(x, y, OUTER + R0)) && !G.solidsZ.some((s) => inR(s, x, y, R0 + 2))) out.push({ x, y, level: 1, floor: hf.i }); }
      }
      sc.land = out;
      return out;
    }
    stepRescue(dt) { // sink → the drone flies in → lift → carry → set down → the drone leaves
      const rs = this.rescue, b = this.body;
      for (const d of this.leaving || []) { const dx = d.hx - d.x, dy = d.hy - d.y, l = hyp(dx, dy), st = (rs ? rs.v : this.P['proto.droneSpeed']) * dt; if (l <= st) d.gone = true; else { d.x += dx / l * st; d.y += dy / l * st; } }
      this.leaving = (this.leaving || []).filter((d) => !d.gone);
      if (!rs) return;
      rs.t += dt; rs.k += dt;
      const d = rs.drone, fly = (x, y) => { const dx = x - d.x, dy = y - d.y, l = hyp(dx, dy), st = rs.v * dt; if (l <= st) { d.x = x; d.y = y; return true; } d.x += dx / l * st; d.y += dy / l * st; return false; };
      const next = (ph) => { rs.phase = ph; rs.k = 0; };
      if (rs.phase === 'sink') { rs.under = Math.min(1, rs.k / rs.sink); if (rs.k >= rs.sink) { next('inbound'); d.state = 'inbound'; this.emit('drone-dispatch', { rescue: true }); } }
      else if (rs.phase === 'inbound') { if (fly(b.x, b.y)) { next('lift'); d.state = 'lift'; } }
      else if (rs.phase === 'lift') { const f = Math.min(1, rs.k / rs.lift); rs.under = 1 - f; rs.up = 14 * f; d.alt = 1 - 0.6 * Math.sin(Math.PI * f); if (f >= 1) { next('carry'); d.state = 'carry'; d.alt = 1; } }
      else if (rs.phase === 'carry') { const arrived = fly(rs.to.x, rs.to.y); b.x = d.x; b.y = d.y; b.px = b.x; b.py = b.y; if (arrived) next('drop'); }
      else if (rs.phase === 'drop') {
        const f = Math.min(1, rs.k / rs.lift); rs.up = 14 * (1 - f);
        if (f >= 1) {
          Object.assign(b, { x: rs.to.x, y: rs.to.y, px: rs.to.x, py: rs.to.y, level: rs.to.level, floor: rs.to.floor, mode: 'recover', recoverT: 0, vx: 0, vy: 0 });
          d.state = 'outbound'; (this.leaving = this.leaving || []).push(d);
          this.rescue = null;
          this.emit('rescued', { x: +b.x.toFixed(1), y: +b.y.toFixed(1), level: b.level, seconds: +rs.t.toFixed(2) });
        }
      }
    }
    // ----- solids: rects and the hill at Z0; rects above at their level. Screen edges open onto open ground next door.
    collideBody(contacts, k) {
      const P = this.P, b = this.body, r = P['body.radius'], G = this.level;
      if (!b.alive || b.stair || b.mode === 'drop' || b.mode === 'rescue') return;
      const block = () => { if (b.mode === 'lunge') b.lunge.blocked = true; };
      const push = (nx, ny, pen) => { b.x += nx * pen; b.y += ny * pen; const vn = b.vx * nx + b.vy * ny; if (vn < 0) { b.vx -= vn * nx; b.vy -= vn * ny; } block(); };
      const rect = (s) => { const res = circleRect(b.x, b.y, r, s); if (res) push(res.nx, res.ny, res.pen); };
      const ground = b.level === 0;
      if (ground) {
        for (const s of G.statics) rect(s);
        for (const st of G.stairs) if (!this.stairFoot(st)) rect(st);
        for (const cp of G.checkpoints) if (!cp.deck && !cp.z) rect(cpZone(cp)); // between a boom and the district edge
        for (const poly of G.polys0) {
          const inside = PIX.inPoly(poly, b.x, b.y), q = polyDist(poly, b.x, b.y);
          if (!inside && q.d >= r) continue;
          const dx = inside ? q.qx - b.x : b.x - q.qx, dy = inside ? q.qy - b.y : b.y - q.qy, l = hyp(dx, dy) || 1;
          push(dx / l, dy / l, inside ? q.d + r : r - q.d);
        }
        let ex = Math.max(r, Math.min(W - r, b.x)), ey = Math.max(r, Math.min(H - r, b.y));
        if ((b.x < r && this.edgeOpen('W', b.y)) || (b.x > W - r && this.edgeOpen('E', b.y))) ex = b.x;
        if ((b.y < r && this.edgeOpen('N', b.x)) || (b.y > H - r && this.edgeOpen('S', b.x))) ey = b.y;
        if (ex !== b.x || ey !== b.y) { b.x = ex; b.y = ey; block(); }
      } else { for (const s of G.solidsZ) if (s.z === b.level) rect(s); for (const cp of G.checkpoints) if ((cp.z || 0) === b.level) rect(cpZone(cp)); }
      for (const c of this.cars) {
        if (!this.meets(c)) continue; // cars meet the dummy on their own level only
        const res = X.circleCar(b.x, b.y, r, c);
        if (!res) continue;
        c.touched = true;
        const nx = -res.nx, ny = -res.ny, rel = (b.vx - c.vx) * nx + (b.vy - c.vy) * ny;
        let knock = null;
        if (!c.inEpisode) {
          c.inEpisode = true;
          const ph = X.impulseImpact(P, b.vx, b.vy, c.vx, c.vy, nx, ny, c.cls, b.mode === 'lunge' || b.mode === 'knock');
          contacts.push({ k, car: c, closing: Math.max(0, rel), ph, px: res.cx, py: res.cy, zone: X.zoneOf(res.qx, res.qy, c),
            carState: this.carCue(c), cause: c.cause, lunging: b.mode === 'lunge', bodySpeed: hyp(b.vx, b.vy), carSpeed: c.v, stopped: c.v < 5 || !!(c.man && c.man.standoff) });
          if (P['proto.damageModel'] && ph.un > 1e-6) knock = ph.knock;
        }
        b.x += res.nx * res.pen; b.y += res.ny * res.pen;
        if (knock) { b.mode = 'knock'; b.lunge = null; b.knockT = 0; b.knockVx = knock.x; b.knockVy = knock.y; b.vx = knock.x; b.vy = knock.y; this.emit('knock', { car: c.id, speed: +hyp(knock.x, knock.y).toFixed(2) }); }
        else if (rel > 0) { b.vx -= rel * nx; b.vy -= rel * ny; }
        block();
      }
      const rr = r + P['props.cone.radius'];
      for (const cn of ground ? this.cones : []) {
        if (cn.state !== 'free') continue;
        const dx = cn.x - b.x, dy = cn.y - b.y, d = hyp(dx, dy);
        if (d >= rr || d < 1e-9) continue;
        const ux = dx / d, uy = dy / d, sp = hyp(b.vx, b.vy);
        if (b.vx * ux + b.vy * uy > 1 && sp > 5) {
          const v = P['props.cone.puntDistance'] / P['props.cone.puntSeconds'];
          Object.assign(cn, { state: 'flight', vx: b.vx / sp * v, vy: b.vy / sp * v, flightT: P['props.cone.puntSeconds'], flightDur: P['props.cone.puntSeconds'], kind: 'punt' });
          this.emit('punt', { cone: cn.id });
        }
        cn.x = b.x + ux * rr; cn.y = b.y + uy * rr;
      }
      if (b.level > 0 && b.mode !== 'drop' && !b.stair) this.floorMove(); // a car's shove obeys the parapet too, and can push the dummy off an edge
    }
    edgeOpen(sd, v) { // open ground across the shared edge, inside the district
      const nb = this.W6.at(this.district.cur[0] + SIDE[sd][0], this.district.cur[1] + SIDE[sd][1]);
      if (!nb) return false;
      const r = this.P['body.radius'], x = sd === 'E' ? r + 1 : sd === 'W' ? W - r - 1 : v, y = sd === 'S' ? r + 1 : sd === 'N' ? H - r - 1 : v, G = nb.game;
      return x >= r && x <= W - r && y >= r && y <= H - r && G.statics.every((s) => !inR(s, x, y, 0)) && G.polys0.every((p) => !PIX.inPoly(p, x, y)); // arrival free (P6.1): the push-out slides the body clear of a corner
    }
    moveCones(h) { const all = this.cars; this.cars = all.filter((c) => !(c.elev || 0)); try { super.moveCones(h); } finally { this.cars = all; } }
    coneSpotValid(x, y, ignore) { return super.coneSpotValid(x, y, ignore) && this.level.polys0.every((p) => !PIX.inPoly(p, x, y)) && this.level.water.every((p) => !PIX.inPoly(p, x, y)); }
    dropHeld() { const all = this.cars; this.cars = all.filter((c) => !(c.elev || 0)); try { return super.dropHeld(); } finally { this.cars = all; } }
    throwHeld() { const all = this.cars; this.cars = all.filter((c) => !(c.elev || 0)); try { return super.throwHeld(); } finally { this.cars = all; } }
    // ----- screens: walk off an edge onto open ground, or along a floor that continues next door at the same level
    checkFlip() {
      const b = this.body;
      if (!b.alive || b.stair || b.mode === 'drop' || b.mode === 'rescue') return;
      const sd = b.x > W ? 'E' : b.x < 0 ? 'W' : b.y > H ? 'S' : b.y < 0 ? 'N' : null;
      if (!sd) return;
      const to = [this.district.cur[0] + SIDE[sd][0], this.district.cur[1] + SIDE[sd][1]], r = this.P['body.radius'];
      if (!this.W6.at(to[0], to[1])) { b.x = Math.max(r, Math.min(W - r, b.x)); b.y = Math.max(r, Math.min(H - r, b.y)); return; } // the district's outer edge (B1: the top of the screen, inside the tunnel)
      let fl = null;
      if (b.level > 0) { const q = this.neighbourFloor(b.x, b.y, b.level); if (!q) { b.x = Math.max(0, Math.min(W, b.x)); b.y = Math.max(0, Math.min(H, b.y)); return; } fl = q.i; }
      this.flip(sd, to, fl);
    }
    flip(sd, to, fl) {
      const D = this.district, b = this.body, P = this.P, from = D.cur.slice(), old = this.sc, nb = this.W6.at(to[0], to[1]);
      for (const cn of this.cones) if (cn.state === 'flight') Object.assign(cn, { state: 'free', vx: 0, vy: 0 });
      const held = b.held;
      if (held) { const i = old.cones.indexOf(held); if (i >= 0) old.cones.splice(i, 1); nb.cones.push(held); }
      this.effects = [];
      D.visited.add(to[1] * 3 + to[0]);
      this.enter(nb);
      b.x -= SIDE[sd][0] * W; b.y -= SIDE[sd][1] * H; b.px = b.x; b.py = b.y;
      if (b.level > 0) b.floor = fl != null ? fl : -1;
      if (b.level > 0 && !(b.floor >= 0)) { b.level = 0; b.floor = null; }
      this.buildView();
      D.lastFlip = { side: sd, from, to, t: this.t };
      this.phase = 'scroll'; this.phaseT = P['world.flipSeconds'];
      this.emit('screen', { from: nameOf(from[0], from[1]), to: nameOf(to[0], to[1]), side: sd, theme: 'p6', landmark: nb.game.landmark, level: b.level });
      this.mile('firstScreen', { to: nameOf(to[0], to[1]) });
      if (D.visited.size === 9) this.mile('districtExplored', { road: this.roadIndex + 1 });
    }
    checkTerminal() { // the shift's clock: Failed test when every shift car has entered and none unspent remains
      this.slot = this.W6.admitted;
      return super.checkTerminal();
    }
    drawDrones() { const out = []; for (const s of this.sc.sims) for (const d of s.drones || []) out.push(d); if (this.rescue && this.rescue.phase !== 'sink') out.push(this.rescue.drone); for (const d of this.leaving || []) out.push(d); return out; }
    trace() {
      const D = this.district;
      return { build: 'dummies-p6', level: this.levelId, params: this.P, run: this.run, milestones: this.milestones, models: this.models, events: this.events,
        district: { start: nameOf(D.start[0], D.start[1]), cur: this.screenName(), visited: [...D.visited].map((k) => nameOf(k % 3, Math.floor(k / 3))) },
        world: { t: +this.W6.t.toFixed(2), admitted: this.W6.admitted, budget: this.W6.budget, exited: this.W6.exited, crossings: this.W6.crossings } };
    }
  }
  const FORWARD = new Set(['honk', 'commit', 'unstick', 'drone-dispatch', 'drone-pickup', 'drone-drop', 'skid', 'cone-struck']); // the active screen's traffic, heard here
  function circleRect(px, py, r, s) {
    const qx = Math.max(s.x, Math.min(s.x + s.w, px)), qy = Math.max(s.y, Math.min(s.y + s.h, py)), dx = px - qx, dy = py - qy, d = hyp(dx, dy);
    if (d >= r) return null;
    if (d > 1e-9) return { nx: dx / d, ny: dy / d, pen: r - d };
    const l = px - s.x, rt = s.x + s.w - px, t = py - s.y, b = s.y + s.h - py, m = Math.min(l, rt, t, b);
    if (m === l) return { nx: -1, ny: 0, pen: l + r };
    if (m === rt) return { nx: 1, ny: 0, pen: rt + r };
    if (m === t) return { nx: 0, ny: -1, pen: t + r };
    return { nx: 0, ny: 1, pen: b + r };
  }
  const api = { DISTRICTS, LEVEL_LIST, INFO, TILE, buildScreen, buildWorld, linkWorld, stepWorld, viewCars, compose, layerOf, carKey, Sim6, gameData, polyDist, AWAY, groundFree, edgePt, inR, cpZone };
  if (NODE) module.exports = api; else root.WORLD6 = api;
})(typeof window !== 'undefined' ? window : globalThis);
