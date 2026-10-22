// Three districts (P5 mock-up, GDD Edit 51.1). Each district is 3 × 3 screens of 800 × 640, drawn in game art with live
// P5 traffic: Parkland (the Z1 roundabout over a lake at B2), Circus (a four-way roundabout at B2) and Monument (a
// monument in a plaza at B2, a square walkway ring at Z1 and four 45° walkways to podium roofs). Roads and highways are
// planned in district coordinates so every screen edge lines up. Public sculptures stand where trees stood.
// Mock-up only: the P5 planner still builds the five districts.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, L = window.TURNLAB, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH;
  const W = P['world.width'], H = P['world.height'], LW = P['world.laneWidth'], OUTER = LW + P['proto.shoulderWidth'], HALF = P['world.deckWidth'] / 2, PW = P['world.parapetWidth'];
  const EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), C = P['world.deckColumn'], c32 = PIX.c32, mixK = PIX.mixK, LEDS = PIX.KX('bldgLed') || [K.lane], hyp = Math.hypot;
  const N = { grass: c32('#0E1712'), grass2: c32('#13211A'), grass3: c32('#1C3024'), water: c32('#08101E'), water2: c32('#13234A'), pave: c32('#2C3243'), pave2: c32('#384056'),
    lime: c32('#B8F25E'), limeD: c32('#5ED13A'), magenta: c32('#FF5FD2'), cyan: c32('#3FD0FF'), violet: c32('#9B6BFF'), stone: c32('#C9D3DA'), stoneD: c32('#8C98A6'), stoneL: c32('#EEF2F4'), tile: c32('#262C3C'), tile2: c32('#30374B'), ink: c32('#05070B') };
  const $ = (id) => document.getElementById(id);
  const Z1 = EXT(P['world.deckHeight']), Z2 = EXT(P['world.highHeight']);
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
  function lawn(B, x, y) { B.put(x, y, ((x * 7 + y * 13) % 29 === 0) ? N.grass3 : (Math.floor((x + y) / 6) % 2 ? N.grass : N.grass2)); }
  const blobR = (r0, th, ph) => r0 * (1 + 0.08 * Math.sin(3 * th + ph) + 0.05 * Math.cos(5 * th + 1.7 * ph));
  function lake(B, ok, cx, cy, r0, ph) {
    each((x, y, wx, wy) => {
      if (!ok(wx, wy)) return;
      const d = hyp(wx - cx, wy - cy), R = blobR(r0, Math.atan2(wy - cy, wx - cx), ph);
      if (d < R) { let c = N.water; if (y % 4 === 0 && ((x * 5 + y) % 11) < 4) c = N.water2; if ((x * 3 + y * 7) % 97 === 0) c = LEDS[(x + y) % LEDS.length]; B.put(x, y, c); }
      else if (d < R + 3) B.put(x, y, K.kerb2);
      else if (d > R + 6 && d < R + 20) B.put(x, y, ((x + y) % 4) ? N.pave : N.pave2); // promenade
    });
  }
  function pathLine(B, ok, x0, y0, x1, y1, w) {
    const dx = x1 - x0, dy = y1 - y0, l = hyp(dx, dy);
    each((x, y, wx, wy) => { if (!ok(wx, wy)) return; const t = Math.max(0, Math.min(1, ((wx - x0) * dx + (wy - y0) * dy) / (l * l))), d = hyp(wx - x0 - dx * t, wy - y0 - dy * t); if (d < w / 2) B.put(x, y, d > w / 2 - 2 ? N.pave2 : N.pave); });
  }
  function flowers(B, ok, cx, cy, r0, r1, colA, colB, petals) {
    each((x, y, wx, wy) => { if (!ok(wx, wy)) return; const d = hyp(wx - cx, wy - cy), a = Math.atan2(wy - cy, wx - cx), edge = r1 * (0.55 + 0.45 * Math.abs(Math.cos(a * petals / 2))); if (d > edge + 2 || d < r0) return; B.put(x, y, d > edge ? N.limeD : d < r0 + (r1 - r0) * 0.3 ? colB : ((x + y) % 3 ? colA : N.limeD)); });
  }
  function plaza(B, ok, x0, y0, x1, y1) { // a paved square with an LED lattice (world units)
    each((x, y, wx, wy) => { if (wx < x0 || wx > x1 || wy < y0 || wy > y1 || !ok(wx, wy)) return; let c = ((x % 8) === 0 || (y % 8) === 0) ? N.tile2 : N.tile; if ((x + y) % 24 === 0 || ((x - y) % 24 + 24) % 24 === 0) c = (x + y) % 48 === 0 ? mixK(N.tile, N.cyan, 0.5) : mixK(N.tile, N.magenta, 0.4); B.put(x, y, c); });
  }
  // ---------- public sculptures (art px; anchored at the footprint centre), in place of trees
  function sculpture(B, ax, ay, kind, led) {
    const x0 = Math.round(ax), y0 = Math.round(ay), put = (x, y, c) => B.put(x0 + x, y0 + y, c), sh = (n, w) => { for (let t = 0; t < n; t++) for (let j = -w; j <= w; j++) B.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.72); };
    for (let x = -5; x <= 5; x++) for (let y = -2; y <= 2; y++) if (x * x / 30 + y * y / 6 <= 1) put(x, y, y > 0 ? K.columnD : K.jerseyTop); // plinth
    if (kind === 'obelisk') { sh(16, 2); for (let h = 1; h < 26; h++) { const w = h > 20 ? 1 : 2; for (let i = -w; i <= w; i++) put(i, -h, i === -w ? K.jerseyTop : i === w ? led : K.column); } put(0, -26, K.white); put(0, -27, led); }
    else if (kind === 'ring') { sh(12, 3); for (let h = 1; h < 6; h++) put(0, -h, K.column); for (let a = 0; a < 64; a++) { const t = a / 64 * Math.PI * 2; put(Math.round(Math.cos(t) * 6), Math.round(-14 + Math.sin(t) * 9), a % 8 < 5 ? led : K.white); } }
    else if (kind === 'cubes') { sh(12, 4); for (const [s, ox, h0] of [[8, -1, 0], [6, 1, 8], [4, 0, 14]]) for (let y = 0; y < s; y++) for (let x = 0; x < s; x++) put(ox + x - s / 2, -h0 - y - 1, x === 0 || y === s - 1 ? led : y === 0 ? K.jerseyTop : K.column); }
    else if (kind === 'arch') { sh(14, 5); for (let h = 1; h < 20; h++) for (const px of [-6, 5]) { put(px, -h, K.jerseyTop); put(px + 1, -h, K.column); } for (let x = -6; x <= 6; x++) { put(x, -20, K.jerseyTop); put(x, -19, led); } }
    else { sh(10, 4); for (let k = 0; k < 5; k++) for (let h = 1; h < 10 + k * 3; h++) put(-6 + k * 3, -h, h > 6 + k * 3 ? led : K.column); } // light fins
  }
  const SCULPT = ['obelisk', 'ring', 'cubes', 'arch', 'fins'];
  // ---------- decks in their own layer: straight highways (the game's PIX.deck) or rings/walkways (distance field)
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
      if (pb < PW + 1 && wy > cy && (openings || []).some(([a, b]) => wx > a && wx < b)) { Lr.put(x, y, K.deck2); return; } // a stair head: no parapet
      Lr.put(x, y, pb < 2 ? K.jerseyO : pb < 4 ? (m ? led : K.jerseyTop) : pb < PW + 1 ? K.jersey : Math.abs(d - LW) < 1.2 ? K.lane : f.dash[k] && d < 1.2 && ((s % 48) + 48) % 48 < 28 ? K.lane : f.dash[k] && ((s % 64) + 64) % 64 < 1.5 ? K.deckJoint : d > LW ? K.deck2 : K.deck);
    });
    each((x, y) => { if (inB(x, y)) return; for (let k = 1; k <= 4; k++) if (inB(x, y - k)) { Lr.put(x, y, k === 1 ? K.jerseyTop : k === 4 ? K.bldgOutline : (x % 4 < 1 ? K.columnD : K.column)); break; } });
    const lift = z === 2 ? Z2 : Z1, glow = mixK(K.deck2, K.white, 0.38), cols = [];
    for (const g of geoms.filter((q) => q.dash)) walk(g.pts, P['world.deckLampSpacing'], (x, y, tx, ty) => { for (const sd of [-1, 1]) {
      const wx = x - ty * sd * (HALF - 3), wy = y + tx * sd * (HALF - 3); if (hyp(wx - cx, wy - cy) < Rc) continue; // lamps on the outer parapet
      const bx = Math.round(wx / U), by = Math.round(wy / U), ix = Math.round((x - ty * sd * (HALF - 9)) / U), iy = Math.round((y + tx * sd * (HALF - 9)) / U);
      if (bx < 1 || by < 1 || bx >= AW - 2 || by >= AH) continue;
      for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (Math.abs(i) + Math.abs(j) <= 2 && inB(ix + i, iy + j)) Lr.put(ix + i, iy + j, glow);
      for (let h = 1; h < PIX.LAMP_H; h++) { Lr.put(bx, by - h, K.jerseyTop); Lr.put(bx + 1, by - h, K.bldgOutline); }
      for (let i = -1; i <= 2; i++) { Lr.put(bx + i, by - PIX.LAMP_H + 1, i === 0 || i === 1 ? K.white : K.head); Lr.put(bx + i, by - PIX.LAMP_H, K.bldgOutline); }
    } });
    for (const g of geoms.filter((q) => q.dash)) walk(g.pts, 120, (x, y, tx, ty) => { for (const sd of [-1, 1]) {
      const off = HALF - 4 - C / 2, ccx = x - ty * sd * off, ccy = y + tx * sd * off;
      if (ccx < C || ccy < C || ccx > W - C || ccy > H - C || avoid(ccx, ccy) || cols.some((q) => hyp(q.cx - ccx, q.cy - ccy) < C + 24)) continue;
      cols.push({ cx: ccx, cy: ccy, x: ccx - C / 2, y: ccy - C / 2, spr: PIX.column(Math.round(C / U), Math.round(C / U), lift) });
    } });
    return { L: Lr, lift, cols, front: cy + Rc + HALF, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && f.D[k] <= HALF + 12; }, shadeOn: (B) => {
      const k = P['proto.art.shadowScale'], hgt = z === 2 ? P['world.highHeight'] : P['world.deckHeight'], ox = PIX.SUN.x * hgt * k / U, oy = PIX.SUN.y * hgt * k / U;
      each((x, y) => { for (const t of [0, 0.5, 1]) { const sx = Math.round(x - ox * t), sy = Math.round(y - oy * t); if (sx >= 0 && sy >= 0 && sx < AW && sy < AH && f.D[sy * AW + sx] <= HALF) { B.shade(x, y, 0.72); break; } } });
    } };
  }
  function straightDeck(off, z, roadOk) { // the game's own highway sprite, lamps and round columns
    const dk = { hz: true, off, z, height: z === 2 ? P['world.highHeight'] : P['world.deckHeight'], gaps: [], openings: [] }, { S, ext } = PIX.deck(dk, P), cols = [];
    for (let p = P['world.deckPillarSpacing'] / 2; p < W; p += P['world.deckPillarSpacing']) for (const e of [off - HALF + 4, off + HALF - 4 - C]) {
      if (!roadOk(p, e + C / 2, OUTER + C + 4)) continue;
      cols.push({ cx: p, cy: e + C / 2, x: p - C / 2, y: e, spr: PIX.column(Math.round(C / U), Math.round(C / U), ext) });
    }
    const Lr = new PIX.Buf(AW, AH); PIX.blit(Lr, S, 0, Math.round((off - HALF) / U));
    return { dk, L: Lr, lift: ext, cols, front: off + HALF, inBand: (wx, wy) => Math.abs(wy - off) < HALF + 12 };
  }
  // ---------- the walkway: a union of polygons at Z1, square ends where it meets a podium roof (no rounded caps)
  function walkwayLayer(polys, roofs) {
    const inPoly = (pts, x, y) => PIX.inPoly(pts, x, y), M = new Uint8Array(AW * AH), R = new Uint8Array(AW * AH), Lr = new PIX.Buf(AW, AH);
    each((x, y, wx, wy, k) => { if (polys.some((p) => inPoly(p, wx, wy))) M[k] = 1; if (roofs.some((r) => wx >= r[0] && wx <= r[0] + r[2] && wy >= r[1] && wy <= r[1] + r[3])) R[k] = 1; });
    const out = (x, y) => x < 0 || y < 0 || x >= AW || y >= AH || (!M[y * AW + x] && !R[y * AW + x]);
    each((x, y, wx, wy, k) => {
      if (!M[k] || R[k]) return;
      let edge = 9; for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (out(x + i, y + j)) edge = Math.min(edge, Math.max(Math.abs(i), Math.abs(j)));
      Lr.put(x, y, edge === 1 ? K.jerseyO : edge === 2 ? (((x + y) % 6) < 3 ? LEDS[3 % LEDS.length] : K.jerseyTop) : edge === 3 ? K.jersey : (((x >> 2) + (y >> 2)) % 2 ? K.deck : K.deck2));
    });
    each((x, y, wx, wy, k) => { if (M[k] || R[k]) return; for (let d = 1; d <= 3; d++) { const kk = (y - d) * AW + x; if (y - d >= 0 && M[kk] && !R[kk]) { Lr.put(x, y, d === 1 ? K.jerseyTop : d === 3 ? K.bldgOutline : K.column); break; } } });
    return { L: Lr, lift: Z1, cols: [], front: 1e6, inBand: (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH && M[k] === 1; } };
  }
  // the monument (art px): stepped round base, banded white shaft, clock face, crown and spire, a ring of lamp posts
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
    { id: 'parkland', name: 'Parkland', mood: 'Calm, green, water. The highway loops over the lake.', quota: P['world.district.parkland.quota'], storeys: [2, 5],
      roads: [fil([[-200, 480], [2000, 480], [2000, 712], [400, 712], [400, 1440], [2600, 1440]])],
      decks: [{ row: 1, off: 420, z: 1 }], park: ['B1', 'A2', 'B2', 'C2', 'B3'], centre: 'B2' }, // the ring replaces the B2 stretch
    { id: 'circus', name: 'Circus', mood: 'Busy and circling. Traffic gives way at the four-way roundabout, then rushes.', quota: P['world.district.circus.quota'], storeys: [4, 9],
      roads: [[[-200, 960], [2600, 960]], [[1200, -200], [1200, 2120]], fil([[200, -200], [200, 200], [80, 320], [-200, 320]]), fil([[2200, -200], [2200, 200], [2320, 320], [2600, 320]]),
        fil([[200, 2120], [200, 1540], [80, 1420], [-200, 1420]]), fil([[2200, 2120], [2200, 1540], [2320, 1420], [2600, 1420]])],
      decks: [{ row: 2, off: 400, z: 1 }], park: [], centre: 'B2' },
    { id: 'monument', name: 'Monument', mood: 'Neon commerce, LED walls. The monument is the beacon; podium roofs lead up to the walkway.', quota: P['world.district.monument.quota'], storeys: [6, 12],
      roads: [fil([[-200, 480], [2000, 480], [2000, 1216], [400, 1216], [400, 1440], [2600, 1440]])],
      decks: [{ row: 0, off: 300, z: 2 }, { row: 2, off: 380, z: 1 }], park: [], centre: 'B2' },
  ];
  // ---------- one screen of a district
  function sceneSim(center, decks, deckLanes, interval) {
    const lanes = X.lanesOf(center, P), s = new X.Sim('straight', { 'run.appearances.road': 2000 });
    s.level = Object.assign({}, s.level, { center, ring: null, lanes, statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain',
      decks: decks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), deckLanes });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {};
    s.schedule = s.schedule.map((sl, j) => Object.assign({}, sl, { cls: X.fleetClass(P, 0.25, (j * 0.6180339887 + 0.53) % 1) }));
    s.admissionInterval = () => interval || 3.2;
    Object.assign(s.body, { x: -900, y: -900 }); s.fillDeckCars();
    return s;
  }
  function buildScreen(D, col, row) {
    const name = 'ABC'[col] + (row + 1), ox = col * W, oy = row * H, rng = PIX.rng(1000 + col * 37 + row * 101 + D.id.length * 7);
    const sc = { D, name, col, row, props: [], layers: [], sculpts: [], note: '' };
    const isPark = D.park.includes(name), isCentre = name === D.centre;
    // roads in this screen (the district's polylines, cut to the screen plus 200)
    let center = null, roadsLocal = [];
    for (const r of D.roads) { const run = clipRun(shift(r, -ox, -oy), -200, -200, W + 200, H + 200); if (run) roadsLocal.push(run); }
    center = roadsLocal[0];
    const decks = D.decks.filter((d) => d.row === row);
    let ground, labSim = null, ringDeck = null, rf;
    if (D.id === 'circus' && isCentre) {
      labSim = L.makeSim(X, 'roundabout4', { Rf: R96 }, { fleet: 'expanded', interval: 1.6, seconds: 60, seed: 11, overrides: {} });
      const geo = labSim.lab.geo;
      ground = PIX.ground({ center: geo.center, ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: geo.stops.map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })), statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [] }, P, 23);
      rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })).concat([{ pts: geo.ring.concat([geo.ring[0]]), dash: false }]), OUTER + 80);
    } else {
      ground = PIX.ground({ center, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: decks.map((d) => ({ hz: true, off: d.off, z: d.z, height: d.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] })), floors: [], canal: false, solid: [] }, P, 31 + col * 7 + row * 13);
      rf = PIX.roadField(roadsLocal.map((pts) => ({ pts, dash: false })), OUTER + 80);
    }
    const B = ground; sc.B = B; const roadD = (wx, wy) => { const k = Math.floor(wy / U) * AW + Math.floor(wx / U); return k >= 0 && k < AW * AH ? rf.D[k] : 1e9; };
    const roadOk = (wx, wy, m) => roadD(wx, wy) > (m || OUTER + 4);
    // highways
    if (D.id === 'parkland' && isCentre) {
      const cx = 400, cy = 420, Rc = P['world.deckRingRadius'], rr = ringRoutes(cx, cy, Rc, R96);
      const st = { x: 124, y: cy + HALF, w: P['world.stairWidth'], h: P['world.stairLength'], axis: 'y', low: cy + HALF + P['world.stairLength'], high: cy + HALF };
      ringDeck = ringLayer(rr, 1, cx, cy, Rc, (x, y) => !roadOk(x, y, OUTER + C + 4) || (x > st.x - C && x < st.x + st.w + C && y > cy), [[st.x + 2, st.x + st.w - 2]]);
      sc.stair = st;
      sc.layers.push(ringDeck); sc.ring = rr;
    } else for (const d of decks) sc.layers.push(straightDeck(d.off, d.z, roadOk));
    const underDeck = (wx, wy) => sc.layers.some((l) => l.inBand(wx, wy));
    const free = (wx, wy, m) => roadOk(wx, wy, OUTER + (m || 24)) && !underDeck(wx, wy);
    const reserved = [];
    // centrepieces
    if (D.id === 'parkland' && isCentre) {
      const okL = (wx, wy) => roadOk(wx, wy, OUTER);
      each((x, y, wx, wy) => { if (okL(wx, wy)) lawn(B, x, y); });
      pathLine(B, okL, 40, 150, 330, 440, 26); pathLine(B, okL, 760, 150, 470, 440, 26);
      lake(B, okL, 430, 470, 262, 0.6);
      for (const [fx, fy] of [[120, 260], [680, 260]]) flowers(B, okL, fx, fy, 6, 34, N.lime, N.magenta, 4);
      for (const [sx, sy, kind] of [[52, 600, 'obelisk'], [748, 600, 'fins'], [40, 330, 'ring'], [760, 330, 'cubes']]) sculpture(B, sx / U, sy / U, kind, LEDS[(sx + sy) % LEDS.length]);
      ringDeck.shadeOn(B);
      const st = sc.stair;
      sc.props.push({ spr: PIX.stairs(st, 0, Z1), x: st.x / U, y: st.y / U, by: st.y + st.h, over: true });
      reserved.push((wx, wy) => hyp(wx - 430, wy - 470) < 300);
      sc.note = 'The Z1 highway turns once round the lake on a ring (centre radius world.deckRingRadius, entry fillets 96). Paths at 45° to the promenade; a stair up to the west arm.';
    } else if (D.id === 'circus' && isCentre) {
      const Rc = P['world.roundaboutRadius'], ci = Rc - OUTER - 2;
      each((x, y, wx, wy) => { if (hyp(wx - 400, wy - 320) < ci) lawn(B, x, y); });
      flowers(B, () => true, 400, 320, 14, ci - 8, N.lime, N.magenta, 6);
      const rz = PIX.roadField(labSim.lab.geo.roads.map((pts) => ({ pts, dash: false })), LW + 2);
      each((x, y, wx, wy, k) => { if (rz.D[k] > LW - 4) return; const zx = Math.abs(wx - 400) < LW && (Math.abs(wy - 36) < 16 || Math.abs(wy - 604) < 16) && Math.floor(wx / 8) % 2 === 0, zy = Math.abs(wy - 320) < LW && (Math.abs(wx - 70) < 16 || Math.abs(wx - 730) < 16) && Math.floor(wy / 8) % 2 === 0; if (zx || zy) B.put(x, y, K.lane); });
      [[8, 8, 200, 120], [592, 8, 200, 120], [8, 512, 200, 120], [592, 512, 200, 120]].forEach(([x, y, w, h], i) => sc.props.push({ spr: PIX.building(Math.round(w / U), Math.round(h / U), (6 + i % 3 * 2) * EXT(P['world.storeyHeight']), PIX.rng(311 + i * 17), LEDS[i % LEDS.length], 6 + i % 3 * 2), x: x / U, y: y / U, by: y + h }));
      sc.props.push({ spr: PIX.fountain(16, 12, 8), x: (400 - 16) / U, y: (320 - 12) / U, by: 320 });
      reserved.push(() => true); // the roundabout screen is complete
      sc.note = 'Every route between four arms, one way round, give way at entry (Edit 49.1). A petal garden with a fountain; zebra crossings; four corner towers.';
    } else if (D.id === 'monument' && isCentre) {
      const cx = 400, cy = 250, Ao = P['world.walkwayRingHalf'], w = P['world.walkwayWidth'], Ai = Ao - w, ko = P['world.walkwayRingChamfer'], ki = ko - 0.586 * w;
      const inSq = (a, k, x, y) => Math.abs(x - cx) <= a && Math.abs(y - cy) <= a && Math.abs(x - cx) + Math.abs(y - cy) <= 2 * a - k;
      each((x, y, wx, wy) => { if (roadOk(wx, wy, OUTER + 8)) B.put(x, y, (x % 16 === 0 || y % 16 === 0) ? N.tile2 : N.tile); });
      plaza(B, (wx, wy) => roadOk(wx, wy, OUTER + 8) && inSq(P['world.plazaHalf'], ko, wx, wy), 0, 0, W, H);
      const podiums = [[16, 8, 176, 72], [608, 8, 176, 72], [16, 392, 176, 96], [608, 392, 176, 96]];
      const sq = (a, k) => [[cx - a + k / 2, cy - a], [cx + a - k / 2, cy - a], [cx + a, cy - a + k / 2], [cx + a, cy + a - k / 2], [cx + a - k / 2, cy + a], [cx - a + k / 2, cy + a], [cx - a, cy + a - k / 2], [cx - a, cy - a + k / 2]];
      const outerP = sq(Ao, ko), innerP = sq(Ai, ki);
      const diag = (sx, sy) => { const d0 = (2 * Ao - ko) / Math.SQRT2 - 4, x1 = cx + sx * d0 * Math.SQRT1_2, y1 = cy + sy * d0 * Math.SQRT1_2, L2 = P['world.walkwayLinkLength'], x2 = x1 + sx * L2 * Math.SQRT1_2, y2 = y1 + sy * L2 * Math.SQRT1_2, nx = -sy * Math.SQRT1_2 * w / 2, ny = sx * Math.SQRT1_2 * w / 2;
        return [[x1 + nx, y1 + ny], [x2 + nx, y2 + ny], [x2 - nx, y2 - ny], [x1 - nx, y1 - ny]]; };
      // the ring as eight quads between its outer and inner outlines, and four 45° walkways from its cut corners to the podium roofs
      const ringQuads = outerP.map((p, i) => [p, outerP[(i + 1) % 8], innerP[(i + 1) % 8], innerP[i]]);
      const wl = walkwayLayer(ringQuads.concat([diag(-1, -1), diag(1, -1), diag(-1, 1), diag(1, 1)]), podiums);
      sc.layers.push(wl); sc.walk = wl;
      podiums.forEach(([x, y, pw, ph], i) => sc.props.push({ spr: PIX.building(Math.round(pw / U), Math.round(ph / U), Z1, PIX.rng(91 + i * 13), LEDS[(i + 1) % LEDS.length], 1), x: x / U, y: y / U, by: y + ph, podium: true }));
      [[16, 8, 96, 56], [688, 8, 96, 56], [16, 400, 88, 80], [696, 400, 88, 80]].forEach(([x, y, tw, th], i) => sc.props.push({ spr: PIX.building(Math.round(tw / U), Math.round(th / U), (7 + i * 2) * EXT(P['world.storeyHeight']), PIX.rng(57 + i * 29), LEDS[(i + 2) % LEDS.length], 7 + i * 2), x: x / U, y: y / U - Z1, by: y + th, tower: true })); // towers stand on the podiums
      sc.monument = { cx, cy };
      for (const [sx, sy, kind] of [[cx - 60, cy + 70, 'cubes'], [cx + 60, cy + 70, 'ring'], [cx, 52, 'arch'], [cx, 456, 'fins']]) sculpture(B, sx / U, sy / U, kind, LEDS[(sx + sy) % LEDS.length]);
      reserved.push(() => true);
      sc.note = 'The monument stands in a plaza under a square walkway ring at Z1 (90° sides, 45° corners). Four 45° walkways run from its corners to podium roofs at Z1; towers rise behind.';
    }
    // the rest of the screen: park or city
    if (!reserved.length) {
      if (isPark) {
        each((x, y, wx, wy) => { if (roadOk(wx, wy, OUTER)) lawn(B, x, y); });
        const okL = (wx, wy) => roadOk(wx, wy, OUTER) && !underDeck(wx, wy);
        const lx = 200 + rng() * 400, ly = row === 1 ? 560 : 330, lr = 70 + 30 * rng();
        pathLine(B, okL, 0, 640, 640, 0, 22);
        lake(B, (wx, wy) => okL(wx, wy) && roadOk(wx, wy, OUTER + 30), lx, ly, lr, rng() * 6);
        sc.pond = [lx, ly, lr + 40];
        for (let k = 0, n = 0; k < 40 && n < 3; k++) { const fx = 80 + rng() * 640, fy = 80 + rng() * 480; if (free(fx, fy, 40) && hyp(fx - lx, fy - ly) > lr + 70 && Math.abs(fx + fy - 640) > 60) { flowers(B, okL, fx, fy, 6, 30, N.lime, N.magenta, 3 + (n % 3)); n++; } }
      }
      // buildings: greedy blocks clear of roads, highways, the park and each other
      if (!isPark) {
        const placed = [], [s0, s1] = D.storeys;
        for (let t = 0; t < 900 && placed.length < 10; t++) { // big blocks first, then infill
          const big = t < 450, w = (big ? 128 : 64) + Math.floor(rng() * (big ? 7 : 5)) * 16, h = (big ? 96 : 64) + Math.floor(rng() * (big ? 5 : 3)) * 16, x = 8 + Math.floor(rng() * ((W - 16 - w) / 16)) * 16, y = 8 + Math.floor(rng() * ((H - 16 - h) / 16)) * 16;
          const pts = []; for (let i = 0; i <= w; i += 16) for (let j = 0; j <= h; j += 16) pts.push([x + i, y + j]);
          const deckClear = (py) => sc.layers.some((l) => l.dk && py > l.dk.off - HALF - 12 && py < l.dk.off + HALF + P['world.deckBottomClear']); // tall blocks keep clear south of a highway
          if (!pts.every(([px, py]) => free(px, py, 16) && !deckClear(py)) || placed.some((q) => x < q.x + q.w + 16 && x + w + 16 > q.x && y < q.y + q.h + 16 && y + h + 16 > q.y)) continue;
          placed.push({ x, y, w, h });
        }
        placed.forEach((q, i) => { const st = s0 + Math.floor(rng() * (s1 - s0 + 1)); sc.props.push({ spr: PIX.building(Math.round(q.w / U), Math.round(q.h / U), st * EXT(P['world.storeyHeight']), PIX.rng(700 + i * 31 + col * 7 + row * 3), LEDS[(i + col + row) % LEDS.length], st), x: q.x / U, y: q.y / U, by: q.y + q.h }); });
        sc.blocks = placed;
        for (let t = 0, n = 0; t < 120 && n < 1; t++) { // a small plaza with a sculpture
          const px = 60 + rng() * 680, py = 60 + rng() * 520;
          if (![[0, 0], [-40, -40], [40, 40], [-40, 40], [40, -40]].every(([a, b]) => free(px + a, py + b, 30)) || placed.some((q) => px > q.x - 60 && px < q.x + q.w + 60 && py > q.y - 60 && py < q.y + q.h + 60)) continue;
          plaza(B, (wx, wy) => free(wx, wy, 8), px - 48, py - 48, px + 48, py + 48); sc.sculpts.push([px, py]); n++;
        }
      }
      const sk = [];
      for (let t = 0; t < 200 && sk.length < (isPark ? 6 : 2); t++) { // sculptures on lawns and plazas
        const px = 30 + rng() * 740, py = 40 + rng() * 570;
        if (!free(px, py, 30) || sk.concat(sc.sculpts).some(([a, b]) => hyp(a - px, b - py) < 90) || (sc.pond && hyp(px - sc.pond[0], py - sc.pond[1]) < sc.pond[2]) || Math.abs(px + py - 640) < 30 || (sc.blocks || []).some((q) => px > q.x - 30 && px < q.x + q.w + 30 && py > q.y - 20 && py < q.y + q.h + 60)) continue;
        sk.push([px, py]);
      }
      for (const p of (sc.sculpts || []).concat(sk)) sculpture(B, p[0] / U, p[1] / U, SCULPT[Math.floor(rng() * SCULPT.length)], LEDS[Math.floor(rng() * LEDS.length)]);
      sc.note = (isPark ? 'Parkland: lawns, a pond, LED-lit flower beds, public sculptures.' : 'City blocks, ' + D.storeys[0] + '–' + D.storeys[1] + ' storeys, LED façades; a sculpture plaza.') + (decks.length ? ' Highway Z' + decks[0].z + ' along this row.' : '');
    }
    // traffic
    if (labSim) sc.s = labSim, sc.lab = true;
    else {
      const dl = [];
      if (sc.ring) dl.push({ path: X.lanesOf(sc.ring.WE, P)[0], dir: 0, z: 1 }, { path: X.lanesOf(sc.ring.EW, P)[0], dir: 1, z: 1 });
      else for (const d of decks) X.deckLanesOf([{ hz: true, off: d.off }], P).forEach((q) => dl.push({ path: q.path, dir: q.dir, z: d.z }));
      sc.s = sceneSim(center, sc.ring ? [{ off: 420, z: 1 }] : decks, sc.ring ? dl.map((d) => ({ path: d.path, deck: 0, dir: d.dir })) : X.deckLanesOf(decks.map((d) => ({ hz: true, off: d.off })), P));
    }
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
      for (const c of l.cols) items.push([Math.min(c.cy + C / 2, l.front - 1), () => PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U))]);
      items.push([l.front, () => layer(l)]);
    }
    for (const p of sc.props) if (p.podium) items.push([1e6 - 1, () => PIX.blit(FB, p.spr, p.x, p.y)]); // podium roofs at Z1, under the walkway's ends
    for (const p of sc.props) if (p.tower) items.push([1e6 + 2, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    items.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
    if (sc.monument) drawMonument(FB, sc.monument.cx, sc.monument.cy);
  }
  // ---------- page
  const built = {}, FB = new PIX.Buf(AW, AH), DL = new PIX.Buf(AW, AH), grid = $('grid'), gg = grid.getContext('2d'), zoom = $('zoom'), zg = zoom.getContext('2d'), off = Object.assign(document.createElement('canvas'), { width: AW, height: AH }), og = off.getContext('2d'), img = og.createImageData(AW, AH);
  grid.width = AW * 3; grid.height = AH * 3; zoom.width = AW * 2; zoom.height = AH * 2;
  let cur = 0, sel = [1, 1], playing = true;
  function build(i) {
    if (built[i]) return built[i];
    const D = DISTRICTS[i], screens = [];
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) screens.push(buildScreen(D, col, row));
    built[i] = screens; return screens;
  }
  function show(i) {
    cur = i; const D = DISTRICTS[i];
    document.querySelectorAll('#tabs button').forEach((b, k) => b.classList.toggle('on', k === i));
    $('dname').textContent = (i + 1) + ' · ' + D.name; $('dmood').textContent = D.mood + ' Write-offs required: ' + D.quota + '.';
    build(i).forEach((sc) => { if (sc.warm) return; sc.warm = true; for (let k = 0; k < 12 * 60; k++) step(sc); });
  }
  function frame() {
    const screens = build(cur);
    if (playing) for (const sc of screens) step(sc);
    for (const sc of screens) {
      render(sc, FB, DL);
      new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0);
      gg.imageSmoothingEnabled = false; gg.drawImage(off, sc.col * AW, sc.row * AH);
      if (sc.col === sel[0] && sc.row === sel[1]) { zg.imageSmoothingEnabled = false; zg.drawImage(off, 0, 0, AW * 2, AH * 2); }
    }
    gg.strokeStyle = 'rgba(230,244,255,0.55)'; gg.lineWidth = 1; gg.font = '600 12px system-ui';
    for (const sc of screens) { gg.strokeRect(sc.col * AW + 0.5, sc.row * AH + 0.5, AW - 1, AH - 1); gg.fillStyle = 'rgba(12,16,24,0.75)'; gg.fillRect(sc.col * AW + 6, sc.row * AH + 6, 30, 18); gg.fillStyle = '#e6f4ff'; gg.fillText(sc.name, sc.col * AW + 12, sc.row * AH + 19); }
    gg.strokeStyle = '#49d3ff'; gg.lineWidth = 3; gg.strokeRect(sel[0] * AW + 1.5, sel[1] * AH + 1.5, AW - 3, AH - 3);
    const sc = screens.find((q) => q.col === sel[0] && q.row === sel[1]);
    $('zname').textContent = DISTRICTS[cur].name + ' · ' + sc.name; $('znote').textContent = sc.note;
    const deck = sc.s.cars.filter((c) => c.deck);
    $('zlive').textContent = `Live: ground cars ${sc.s.cars.length - deck.length}` + (deck.length ? ` · highway cars ${deck.length}` : '') + (sc.lab ? ` · waiting to give way ${sc.s.cars.filter((c) => c.yielding).length}` : '');
    requestAnimationFrame(frame);
  }
  grid.onclick = (e) => { const r = grid.getBoundingClientRect(); sel = [Math.min(2, Math.floor((e.clientX - r.left) / r.width * 3)), Math.min(2, Math.floor((e.clientY - r.top) / r.height * 3))]; };
  DISTRICTS.forEach((D, i) => { const b = document.createElement('button'); b.textContent = (i + 1) + ' · ' + D.name; b.onclick = () => { sel = [1, 1]; show(i); }; $('tabs').appendChild(b); });
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  window.__district = { show, select: (c, r) => { sel = [c, r]; }, built };
  show(0); requestAnimationFrame(frame);
})();
