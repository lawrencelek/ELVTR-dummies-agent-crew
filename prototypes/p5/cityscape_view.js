// Three cityscapes (P5 mock-up, GDD Edit 50.2). The centre of each district in game art, with live P5 traffic:
// Parkland (Z1 and Z2 elevated roundabouts over a lake and lawns), Circus (a four-way roundabout with give-way), and
// Monument (a plaza where streets meet, its monument ringed by an elevated walkway linking the malls).
// Mock-up only: the P5 planner still builds the five districts. Curved decks, branching roads and the walkway ring are new.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, L = window.TURNLAB, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH, Z = 2;
  const W = P['world.width'], H = P['world.height'], LW = P['world.laneWidth'], OUTER = LW + P['proto.shoulderWidth'], HALF = P['world.deckWidth'] / 2, PW = P['world.parapetWidth'];
  const EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), C = P['world.deckColumn'], c32 = PIX.c32, mixK = PIX.mixK, LEDS = PIX.KX('bldgLed') || [K.lane];
  const N = { grass: c32('#0E1712'), grass2: c32('#13211A'), grass3: c32('#1C3024'), water: c32('#08101E'), water2: c32('#13234A'), water3: c32('#0C1830'), pave: c32('#2C3243'), pave2: c32('#384056'),
    lime: c32('#B8F25E'), limeD: c32('#5ED13A'), magenta: c32('#FF5FD2'), cyan: c32('#3FD0FF'), stone: c32('#C9D3DA'), stoneD: c32('#8C98A6'), stoneL: c32('#EEF2F4'), tile: c32('#262C3C'), tile2: c32('#30374B') };
  const $ = (id) => document.getElementById(id);
  const hyp = Math.hypot;
  // ---------- geometry
  function ringRoutes(cx, cy, Rc, Rf) { // a two-arm roundabout (W and E arms), one way round, anticlockwise on screen
    const a = { ang: Math.PI, pt: [-200, cy] }, b = { ang: 0, pt: [W + 200, cy] }, r = () => 0.9;
    const phi = Math.asin(Rf / (Rc + Rf)), D = (Rc + Rf) * Math.cos(phi);
    return { WE: X.roundaboutCenter(a, b, 2 * cx, 2 * cy, 200, Rc, r, Rf), EW: X.roundaboutCenter(b, a, 2 * cx, 2 * cy, 200, Rc, r, Rf),
      ring: X.arcPts(cx, cy, Rc, 0, 2 * Math.PI, 96), armW: [[-200, cy], [cx - D, cy]], armE: [[cx + D, cy], [W + 200, cy]] };
  }
  function walk(pts, step, fn) { // points every `step` along a polyline, with tangent
    let acc = step / 2;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], l = hyp(x1 - x0, y1 - y0); if (l < 1e-6) continue;
      while (acc <= l) { const t = acc / l; fn(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, (x1 - x0) / l, (y1 - y0) / l); acc += step; }
      acc -= l;
    }
  }
  // ---------- a deck in its own layer (pre-lift): surface, parapets, lane lines, dashes, girder face; lamps; columns; shadow
  function deckLayer(geoms, z, opts) {
    opts = opts || {};
    const half = opts.half || HALF, f = PIX.roadField(geoms, half + 6), Lr = new PIX.Buf(AW, AH), high = z === 2, led = LEDS[high ? 2 : 1] || LEDS[0], walkway = !!opts.walkway;
    const inB = (x, y) => x >= 0 && y >= 0 && x < AW && y < AH && f.D[y * AW + x] <= half;
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const k = y * AW + x, d = f.D[k]; if (d > half) continue;
      const pb = half - d, s = f.S[k], m = ((s % 6) + 6) % 6 < 3, pw = walkway ? 4 : PW;
      let c;
      if (pb < 2) c = K.jerseyO;
      else if (pb < 4) c = m ? led : K.jerseyTop;
      else if (pb < pw + 1) c = K.jersey;
      else if (high && pb < PW + 3) c = m ? led : K.deck2;
      else if (walkway) c = (Math.floor(s / 8) % 2) ? K.deck : K.deck2; // paved walkway, no lanes
      else if (Math.abs(d - LW) < 1.2) c = K.lane;
      else if (f.dash[k] && d < 1.2 && ((s % 48) + 48) % 48 < 28) c = K.lane;
      else if (f.dash[k] && ((s % 64) + 64) % 64 < 1.5) c = K.deckJoint;
      else c = d > LW ? K.deck2 : K.deck;
      Lr.put(x, y, c);
    }
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) { // girder face below the screen-down edge
      if (inB(x, y)) continue;
      for (let k = 1; k <= (walkway ? 3 : 4); k++) if (inB(x, y - k)) { Lr.put(x, y, k === 1 ? K.jerseyTop : k === (walkway ? 3 : 4) ? K.bldgOutline : ((x % 4) < 1 ? K.columnD : K.column)); break; }
    }
    const lift = EXT(z === 2 ? P['world.highHeight'] : P['world.deckHeight']), glow = mixK(K.deck2, K.white, 0.38);
    for (const g of geoms.filter((q) => q.dash || q.lamps)) walk(g.pts, opts.lampStep || P['world.deckLampSpacing'], (x, y, tx, ty) => { // paired lamps on both parapets
      for (const sd of [-1, 1]) {
        const bx = Math.round((x - ty * sd * (half - 3)) / U), by = Math.round((y + tx * sd * (half - 3)) / U), ix = Math.round((x - ty * sd * (half - 9)) / U), iy = Math.round((y + tx * sd * (half - 9)) / U);
        if (bx < 1 || by < 1 || bx >= AW - 2 || by >= AH) continue;
        if (opts.outerOf && hyp(x - ty * sd * (half - 3) - opts.outerOf[0], y + tx * sd * (half - 3) - opts.outerOf[1]) < opts.outerOf[2]) continue; // a ring's lamps stand on its outer parapet
        for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) if (Math.abs(i) + Math.abs(j) <= 2 && inB(ix + i, iy + j)) Lr.put(ix + i, iy + j, glow); // light pool
        for (let h = 1; h < PIX.LAMP_H; h++) { Lr.put(bx, by - h, K.jerseyTop); Lr.put(bx + 1, by - h, K.bldgOutline); }
        for (let i = -1; i <= 2; i++) { Lr.put(bx + i, by - PIX.LAMP_H + 1, i === 0 || i === 1 ? K.white : K.head); Lr.put(bx + i, by - PIX.LAMP_H, K.bldgOutline); }
      }
    });
    const cols = [];
    for (const g of geoms.filter((q) => q.dash || q.cols)) walk(g.pts, opts.colStep || P['world.deckPillarSpacing'], (x, y, tx, ty) => {
      for (const sd of [-1, 1]) {
        const off = half - 4 - (opts.colSize || C) / 2, cx = x - ty * sd * off, cy = y + tx * sd * off, cs = opts.colSize || C;
        if (cx < cs || cy < cs || cx > W - cs || cy > H - cs || (opts.avoid && opts.avoid(cx, cy, cs)) || cols.some((q) => hyp(q.cx - cx, q.cy - cy) < cs + 24)) continue;
        cols.push({ cx, cy, x: cx - cs / 2, y: cy - cs / 2, spr: PIX.column(Math.round(cs / U), Math.round(cs / U), lift) });
      }
    });
    return { f, L: Lr, lift, cols, half, z };
  }
  function shadeDeck(B, dl) {
    const k = P['proto.art.shadowScale'], hgt = dl.z === 2 ? P['world.highHeight'] : P['world.deckHeight'], ox = PIX.SUN.x * hgt * k / U, oy = PIX.SUN.y * hgt * k / U;
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) for (const t of [0, 0.5, 1]) {
      const sx = Math.round(x - ox * t), sy = Math.round(y - oy * t);
      if (sx >= 0 && sy >= 0 && sx < AW && sy < AH && dl.f.D[sy * AW + sx] <= dl.half) { B.shade(x, y, 0.72); break; }
    }
  }
  // ---------- ground painting helpers
  const groundOf = (center, extra) => PIX.ground(Object.assign({ center, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [] }, extra || {}), P, 17);
  const roadDist = (center) => PIX.roadField([{ pts: center, dash: true }], OUTER + 60).D;
  function each(fn) { for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) fn(x, y, (x + 0.5) * U, (y + 0.5) * U, y * AW + x); }
  function lawn(B, x, y) { B.put(x, y, ((x * 7 + y * 13) % 29 === 0) ? N.grass3 : (Math.floor((x + y) / 6) % 2 ? N.grass : N.grass2)); }
  const blobR = (r0, th, ph) => r0 * (1 + 0.08 * Math.sin(3 * th + ph) + 0.05 * Math.cos(5 * th + 1.7 * ph));
  function lake(B, cx, cy, r0, ph, rd) {
    each((x, y, wx, wy, k) => {
      if (rd[k] <= OUTER + 2) return;
      const d = hyp(wx - cx, wy - cy), R = blobR(r0, Math.atan2(wy - cy, wx - cx), ph);
      if (d < R) { let c = N.water; if (y % 4 === 0 && ((x * 5 + y) % 11) < 4) c = N.water2; if ((x * 3 + y * 7) % 97 === 0) c = LEDS[(x + y) % LEDS.length]; B.put(x, y, c); }
      else if (d < R + 3) B.put(x, y, K.kerb2);
      else if (d > R + 6 && d < R + 20) B.put(x, y, ((x + y) % 4) ? N.pave : N.pave2); // promenade
    });
  }
  function pathLine(B, rd, x0, y0, x1, y1, w, keep) {
    const dx = x1 - x0, dy = y1 - y0, l = hyp(dx, dy);
    each((x, y, wx, wy, k) => {
      if (rd[k] <= OUTER + 2 || (keep && !keep(wx, wy))) return;
      const t = Math.max(0, Math.min(1, ((wx - x0) * dx + (wy - y0) * dy) / (l * l))), d = hyp(wx - x0 - dx * t, wy - y0 - dy * t);
      if (d < w / 2) B.put(x, y, d > w / 2 - 2 ? N.pave2 : N.pave);
    });
  }
  function trees(B, rd, ok, seed) {
    const r = PIX.rng(seed), pts = [];
    for (let i = 0; i < 400 && pts.length < 26; i++) {
      const wx = 30 + r() * (W - 60), wy = 40 + r() * (H - 60), k = Math.floor(wy / U) * AW + Math.floor(wx / U);
      if (rd[k] < OUTER + 30 || !ok(wx, wy) || pts.some(([a, b]) => hyp(a - wx, b - wy) < 46)) continue;
      pts.push([wx, wy]);
    }
    pts.sort((a, b) => a[1] - b[1]).forEach(([wx, wy]) => PIX.tree(B, Math.round(wx / U), Math.round(wy / U)));
  }
  function flowers(B, cx, cy, r0, r1, colA, colB, petals) { // a petal-shaped bed: a core of colB, petals of colA, a dark rim
    each((x, y, wx, wy) => {
      const d = hyp(wx - cx, wy - cy), a = Math.atan2(wy - cy, wx - cx), edge = r1 * (0.55 + 0.45 * Math.abs(Math.cos(a * petals / 2)));
      if (d > edge + 2 || d < r0) return;
      B.put(x, y, d > edge ? N.limeD : d < r0 + (r1 - r0) * 0.3 ? colB : ((x + y) % 3 ? colA : N.limeD));
    });
  }
  // ---------- live scenes
  function sceneSim(center, deckRoutes, deckZ, opts) {
    const lanes = X.lanesOf(center, P), s = new X.Sim('straight', { 'run.appearances.road': 2000 });
    const deckLanes = (deckRoutes || []).map((pts, j) => ({ path: X.lanesOf(pts, P)[0], deck: 0, dir: j }));
    s.level = Object.assign({}, s.level, { center, ring: null, lanes, statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain',
      decks: deckRoutes ? [{ hz: true, off: 320, z: deckZ, height: deckZ === 2 ? P['world.highHeight'] : P['world.deckHeight'] }] : [], deckLanes });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {};
    s.schedule = s.schedule.map((sl, j) => Object.assign({}, sl, { cls: X.fleetClass(P, (opts && opts.vanShare) || 0.25, (j * 0.6180339887 + 0.53) % 1) }));
    Object.assign(s.body, { x: -900, y: -900 }); s.fillDeckCars();
    s.admissionInterval = () => (opts && opts.interval) || 3;
    return s;
  }
  const scenes = [];
  // Parkland B2: the Z1 roundabout over the lake. Ground road along the top.
  (function parkLake() {
    const road = [[-200, 72], [W + 200, 72]], rd = roadDist(road), cx = 400, cy = 420, Rc = P['world.deckRingRadius'], rr = ringRoutes(cx, cy, Rc, P['world.roundaboutEntryRadius']);
    const B = groundOf(road);
    each((x, y, wx, wy, k) => { if (rd[k] > OUTER) lawn(B, x, y); });
    pathLine(B, rd, 40, 150, 330, 440, 26); pathLine(B, rd, 760, 150, 470, 440, 26); pathLine(B, rd, 400, 150, 400, 300, 22);
    lake(B, cx + 30, cy + 50, 262, 0.6, rd);
    const avoidRoad = (x, y, cs) => y < 152 + cs;
    const dl = deckLayer([{ pts: rr.ring, dash: true }, { pts: rr.armW, dash: true }, { pts: rr.armE, dash: true }, { pts: rr.WE }, { pts: rr.EW }], 1, { avoid: avoidRoad, colStep: 120, outerOf: [cx, cy, Rc] });
    trees(B, rd, (wx, wy) => hyp(wx - cx - 30, wy - cy - 50) > 300 && dl.f.D[Math.floor(wy / U) * AW + Math.floor(wx / U)] > HALF + 30, 41);
    for (const [fx, fy] of [[120, 260], [680, 260]]) flowers(B, fx, fy, 6, 34, N.lime, N.magenta, 4);
    shadeDeck(B, dl);
    const st = { x: 124, y: cy + HALF, w: P['world.stairWidth'], h: 64, axis: 'y', low: cy + HALF + 64, high: cy + HALF };
    scenes.push({ id: 'parkLake', title: 'Parkland · B2: the Z1 roundabout over the lake', B, dls: [dl], s: sceneSim(road, [rr.WE, rr.EW], 1), stairs: [{ st, spr: PIX.stairs(st, 0, dl.lift) }],
      note: 'The Z1 highway runs along row 2 and turns once round the lake on a ring (centre radius 132, entry fillets 96). Ground road along the top; paths at 45° to the promenade.' });
  })();
  // Parkland B3: the Z2 roundabout over lawns, flower beds and a fountain plaza.
  (function parkLawn() {
    const road = [[-200, 72], [W + 200, 72]], rd = roadDist(road), cx = 400, cy = 430, Rc = P['world.deckRingRadiusHigh'], rr = ringRoutes(cx, cy, Rc, P['world.roundaboutEntryRadius']);
    const B = groundOf(road);
    each((x, y, wx, wy, k) => {
      if (rd[k] <= OUTER) return;
      const u = Math.abs(wx - cx), v = Math.abs(wy - cy);
      if (u + v < 150) B.put(x, y, ((Math.floor((wx - wy) / 24) + Math.floor((wx + wy) / 24)) % 2) ? N.pave : N.pave2); // diamond plaza
      else lawn(B, x, y);
    });
    pathLine(B, rd, cx, 150, cx, H, 30); pathLine(B, rd, 0, cy, W, cy, 30);
    for (const [fx, fy] of [[200, 260], [600, 260], [170, 590], [630, 590]]) flowers(B, fx, fy, 10, 52, N.lime, N.magenta, 3);
    const dl = deckLayer([{ pts: rr.ring, dash: true }, { pts: rr.armW, dash: true }, { pts: rr.armE, dash: true }, { pts: rr.WE }, { pts: rr.EW }], 2, { avoid: (x, y, cs) => y < 152 + cs, colStep: 120, outerOf: [cx, cy, Rc] });
    trees(B, rd, (wx, wy) => Math.abs(wx - cx) + Math.abs(wy - cy) > 190 && Math.abs(wx - cx) > 26 && Math.abs(wy - cy) > 26 && dl.f.D[Math.floor(wy / U) * AW + Math.floor(wx / U)] > HALF + 30, 83);
    shadeDeck(B, dl);
    const fo = PIX.fountain(20, 14, 8);
    const st = { x: 620, y: cy + HALF, w: P['world.stairWidth'], h: 112, axis: 'y', low: cy + HALF + 112, high: cy + HALF };
    scenes.push({ id: 'parkLawn', title: 'Parkland · B3: the Z2 roundabout over lawns and flower beds', B, dls: [dl], s: sceneSim(road, [rr.WE, rr.EW], 2), stairs: [{ st, spr: PIX.stairs(st, 0, dl.lift) }],
      props: [{ spr: fo, x: (cx - 20) / U, y: (cy - 14) / U }], note: 'The Z2 highway runs along row 3 and loops over a diamond plaza with a fountain, after People\'s Square. Higher, so its stair is longer (112).' });
  })();
  // Circus B2: a four-way roundabout, every route, give-way at entry (Edit 49.1), a garden island, zebra crossings, corner towers.
  (function circus() {
    const s = L.makeSim(X, 'roundabout4', { Rf: P['world.roundaboutEntryRadius'] }, { fleet: 'expanded', interval: 1.6, seconds: 60, seed: 11, overrides: {} }), geo = s.lab.geo;
    const B = PIX.ground({ center: geo.center, ring: geo.ring.concat([geo.ring[0]]), arms: geo.arms, surfaces: geo.roads, giveWays: geo.stops.map((p) => ({ x: p.x, y: p.y, tx: p.tx, ty: p.ty })),
      statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [] }, P, 23);
    const Rc = P['world.roundaboutRadius'], ci = Rc - OUTER - 2;
    each((x, y, wx, wy) => { const d = hyp(wx - 400, wy - 320); if (d < ci) lawn(B, x, y); });
    flowers(B, 400, 320, 14, ci - 8, N.lime, N.magenta, 6);
    const rf = PIX.roadField(geo.roads.map((pts) => ({ pts, dash: false })), LW + 2);
    each((x, y, wx, wy, k) => { // zebra crossings on each arm, a lane-width from the screen edge
      if (rf.D[k] > LW - 4) return;
      const zx = (Math.abs(wx - 400) < LW && (Math.abs(wy - 36) < 16 || Math.abs(wy - 604) < 16)) && Math.floor(wx / 8) % 2 === 0;
      const zy = (Math.abs(wy - 320) < LW && (Math.abs(wx - 70) < 16 || Math.abs(wx - 730) < 16)) && Math.floor(wy / 8) % 2 === 0;
      if (zx || zy) B.put(x, y, K.lane);
    });
    const blocks = [[8, 8, 200, 120], [592, 8, 200, 120], [8, 512, 200, 120], [592, 512, 200, 120]], r = PIX.rng(7);
    const props = blocks.map(([x, y, w, h], i) => ({ spr: PIX.building(Math.round(w / U), Math.round(h / U), (5 + i % 3 * 2) * EXT(P['world.storeyHeight']), PIX.rng(311 + i * 17), LEDS[i % LEDS.length], 5 + i % 3 * 2), x: x / U, y: y / U, by: y + h }));
    const fo = PIX.fountain(16, 12, 8);
    props.push({ spr: fo, x: (400 - 16) / U, y: (320 - 12) / U, by: 320 });
    scenes.push({ id: 'circus', title: 'Circus · B2: the four-way roundabout', B, dls: [], s, lab: true, props,
      note: 'Every route between four arms, one way round, give way at entry (P4.1 rules, fillet 96). A garden island with a fountain; zebra crossings on the arms, after Lujiazui. Needs branching roads in the planner.' });
  })();
  // Monument B2: streets meet at a plaza; the monument stands in an elevated walkway ring (Z1) linked by bridges to the malls.
  (function monument() {
    const road = [[-200, 572], [W + 200, 572]], rd = roadDist(road), cx = 400, cy = 262, R = P['world.plazaRadius'], RW = P['world.walkwayRingRadius'], SW = P['world.plazaStreetWidth'];
    const B = groundOf(road);
    const streets = [[-90, SW], [-135, SW], [-45, SW], [180, SW], [0, SW]].map(([a, w]) => ({ ux: Math.cos(a * Math.PI / 180), uy: Math.sin(a * Math.PI / 180), w }));
    const inStreet = (wx, wy) => streets.some((q) => { const t = (wx - cx) * q.ux + (wy - cy) * q.uy; return t > 0 && Math.abs(-(wx - cx) * q.uy + (wy - cy) * q.ux) < q.w / 2; });
    each((x, y, wx, wy, k) => {
      if (rd[k] <= OUTER) return;
      const d = hyp(wx - cx, wy - cy);
      if (inStreet(wx, wy) && d >= R) { B.put(x, y, ((x % 8) === 0 || (y % 8) === 0) ? N.pave : N.pave2); return; } // the five streets, paler
      if (d < R || wy > cy && d < R + 40) {
        let c = ((x % 8) === 0 || (y % 8) === 0) ? N.tile2 : N.tile; // plaza tiles; LED lattice on the diagonals
        if (((x + y) % 24 === 0 || ((x - y) % 24 + 24) % 24 === 0) && d < R) c = ((x + y) % 48 === 0) ? mixK(N.tile, N.cyan, 0.55) : mixK(N.tile, N.magenta, 0.45);
        B.put(x, y, c);
      }
    });
    const blocks = [[8, 92, 142, 112], [650, 92, 142, 112], [292, 8, 64, 66], [444, 8, 64, 66], [8, 300, 160, 168], [632, 300, 160, 168]];
    const okBlock = ([x, y, w, h]) => [[x, y], [x + w, y], [x, y + h], [x + w, y + h], [x + w / 2, y + h / 2]].every(([px, py]) => hyp(px - cx, py - cy) > R + 8 && !inStreet(px, py) && py < 572 - OUTER - 8);
    const used = blocks.filter(okBlock), props = [];
    used.forEach(([x, y, w, h], i) => props.push({ spr: PIX.building(Math.round(w / U), Math.round(h / U), (6 + (i * 3) % 6) * EXT(P['world.storeyHeight']), PIX.rng(91 + i * 13), LEDS[(i + 1) % LEDS.length], 6 + (i * 3) % 6), x: x / U, y: y / U, by: y + h }));
    // the walkway ring (Z1) and its bridges to the malls on the W, E and north blocks
    const rp = (deg) => [cx + (RW + P['world.walkwayWidth'] / 2) * Math.cos(deg * Math.PI / 180), cy + (RW + P['world.walkwayWidth'] / 2) * Math.sin(deg * Math.PI / 180)]; // bridges start at the ring's outer parapet
    const ring = X.arcPts(cx, cy, RW, 0, 2 * Math.PI, 72), bridges = [[rp(165), [160, 318]], [rp(15), [640, 318]], [rp(-160), [150, 190]], [rp(-20), [650, 190]], [rp(-110), [324, 74]], [rp(-70), [476, 74]]];
    const dl = deckLayer([{ pts: ring, lamps: true, cols: true }].concat(bridges.map((pts) => ({ pts }))), 1, { half: P['world.walkwayWidth'] / 2, walkway: true, lampStep: 100, colStep: 100, colSize: 14, outerOf: [cx, cy, RW] });
    shadeDeck(B, dl);
    trees(B, rd, (wx, wy) => { const d = hyp(wx - cx, wy - cy); return d > R - 26 && d < R + 30 && !inStreet(wx, wy) && used.every(([x, y, w, h]) => wx < x - 20 || wx > x + w + 20 || wy < y - 20 || wy > y + h + 30); }, 59);
    scenes.push({ id: 'monument', title: 'Monument · B2: streets meet at the monument; a walkway ring links the malls', B, dls: [dl], s: sceneSim(road, null, 1, { interval: 2.4 }), props, monument: { cx, cy },
      note: 'Five streets meet at the plaza, after Jiefangbei. The monument stands inside a Z1 walkway ring; bridges join it to the malls\' upper floors. The road skirts the plaza to the south.' });
  })();
  // ---------- the monument: stepped round base, banded shaft, clock faces, crown (art px, anchored at its footprint centre)
  function drawMonument(Bf, cx, cy) {
    const x0 = Math.round(cx / U), y0 = Math.round(cy / U), Ht = 58;
    for (let t = 0; t < 40; t++) for (let j = -4; j <= 4; j++) Bf.shade(x0 - t * 0.7 + j * 0.7, y0 + t * 0.7 + j * 0.7, 0.75); // its shadow, down-left
    for (const [rx, ry, lift, c] of [[16, 7, 0, N.stoneD], [13, 6, 2, N.stone], [10, 5, 4, N.stoneL]]) PIX.ellipse(x0, y0 - lift, rx, ry, (x, y) => Bf.put(x, y, c));
    for (let h = 4; h < Ht; h++) for (let i = -4; i <= 4; i++) { const u = i / 4.5; Bf.put(x0 + i, y0 - h, h % 10 === 0 ? N.stoneD : u < -0.4 ? N.stoneL : u < 0.4 ? N.stone : N.stoneD); }
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i * i + j * j <= 5) Bf.put(x0 + i, y0 - Ht + 8 + j, i * i + j * j <= 1 ? K.white : N.cyan); // clock face
    for (let h = 0; h < 6; h++) for (let i = -5 + Math.floor(h / 2); i <= 5 - Math.floor(h / 2); i++) Bf.put(x0 + i, y0 - Ht - h, h < 2 ? N.stoneD : N.stoneL); // crown
    for (let h = 6; h < 12; h++) Bf.put(x0, y0 - Ht - h, h > 9 ? N.cyan : N.stoneL); // spire and its light
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, lx = Math.round(x0 + Math.cos(a) * 20), ly = Math.round(y0 + Math.sin(a) * 9); for (let h = 0; h < 6; h++) Bf.put(lx, ly - h, K.jerseyTop); Bf.put(lx, ly - 6, K.white); }
  }
  // ---------- frames
  const box = $('scenes');
  for (const sc of scenes) {
    sc.cv = Object.assign(document.createElement('canvas'), { width: AW * Z, height: AH * Z }); sc.off = Object.assign(document.createElement('canvas'), { width: AW, height: AH });
    sc.FB = new PIX.Buf(AW, AH); sc.DL = new PIX.Buf(AW, AH);
    const wrap = document.createElement('div'); wrap.appendChild(sc.cv);
    const cap = document.createElement('div'); cap.innerHTML = `<h3>${sc.title}</h3><p class="cap">${sc.note}</p><p class="cap" id="st_${sc.id}"></p>`; wrap.appendChild(cap); box.appendChild(wrap);
    for (let i = 0; i < 25 * 60; i++) step(sc);
  }
  function step(sc) { if (sc.lab) L.tick(sc.s); else { sc.s.step({}); sc.s.body.x = -900; sc.s.body.y = -900; } }
  const carSpr = (c) => PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXT(P['vehicles.' + c.cls + '.height']), c.h, false);
  function draw(sc) {
    const { FB, DL, s } = sc;
    FB.d.set(sc.B.d);
    const items = s.cars.filter((c) => !c.deck).map((c) => [c.y, () => PIX.blit(FB, carSpr(c), c.x / U, c.y / U)]);
    for (const p of sc.props || []) items.push([p.by != null ? p.by : p.y * U + 40, () => PIX.blit(FB, p.spr, p.x, p.y)]);
    for (const st of sc.stairs || []) items.push([st.st.y + st.st.h, () => PIX.blit(FB, st.spr, Math.round(st.st.x / U), Math.round(st.st.y / U))]);
    for (const dl of sc.dls) for (const c of dl.cols) items.push([c.cy + C, () => PIX.blit(FB, c.spr, Math.round(c.x / U), Math.round(c.y / U))]);
    items.sort((a, b) => a[0] - b[0]).forEach((it) => it[1]());
    for (const dl of sc.dls) {
      DL.d.set(dl.L.d);
      for (const c of s.cars.filter((c) => c.deck).sort((a, b) => a.y - b.y)) PIX.blit(DL, carSpr(c), c.x / U, c.y / U);
      for (let y = 0; y < AH; y++) { const ty = y - dl.lift; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
    }
    if (sc.monument) { const m = sc.monument; drawMonument(FB, m.cx, m.cy); } // above its walkway ring
    const og = sc.off.getContext('2d'), img = og.createImageData(AW, AH); new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0);
    const g = sc.cv.getContext('2d'); g.imageSmoothingEnabled = false; g.drawImage(sc.off, 0, 0, AW * Z, AH * Z);
    const deck = s.cars.filter((c) => c.deck), ground = s.cars.length - deck.length;
    $('st_' + sc.id).textContent = `Live: ground cars ${ground}` + (sc.dls.length && !sc.monument ? ` · highway cars ${deck.length}, mean speed ${(deck.reduce((a, c) => a + c.v, 0) / Math.max(1, deck.length)).toFixed(0)} · lift ${sc.dls[0].lift} px (Z${sc.dls[0].z})` : '') + (sc.lab ? ` · give-way waits ${s.cars.filter((c) => c.yielding).length}` : '');
  }
  let last = performance.now(), playing = true;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing) for (const sc of scenes) for (let k = 0; k < Math.round(dt * 60); k++) step(sc);
    scenes.forEach(draw); requestAnimationFrame(frame);
  }
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  requestAnimationFrame(frame);

  // ---------- district plans: three 3 × 3 districts, what sits where
  (function plans() {
    const DIST = [
      { name: '1 · Parkland', mood: 'Calm, green, water. Highways float over the park.', quota: P['world.district.parkland.quota'], centre: [[1, 1, 'Z1 ring over the lake', '#3FD0FF'], [1, 2, 'Z2 ring over lawns', '#9B6BFF']],
        decks: [[1, 1, '#3FD0FF'], [2, 2, '#9B6BFF']], roads: [[[0.5, 0], [0.5, 0.2], [2.5, 0.2], [2.5, 1.2], [0.5, 1.2], [0.5, 2.2], [2.5, 2.2], [2.5, 3]]], park: [[1, 1], [1, 2], [0, 1], [2, 1]] },
      { name: '2 · Circus', mood: 'Busy and circling. Traffic gives way, then rushes.', quota: P['world.district.circus.quota'], centre: [[1, 1, 'Four-way roundabout', '#FF5FD2']],
        decks: [[0, 1, '#3FD0FF']], roads: [[[0, 1.5], [3, 1.5]], [[1.5, 0], [1.5, 3]], [[0.2, 0], [0.2, 3]], [[2.8, 0], [2.8, 3]]], park: [] },
      { name: '3 · Monument', mood: 'Neon commerce, crowds, LED walls. The monument is the beacon.', quota: P['world.district.monument.quota'], centre: [[1, 1, 'Monument plaza, walkway ring', '#E6F4FF']],
        decks: [[2, 1, '#3FD0FF'], [0, 2, '#9B6BFF']], roads: [[[0, 1.85], [3, 1.85]], [[0.5, 0], [0.5, 1.85]], [[2.5, 1.85], [2.5, 3]]], park: [], streets: true },
    ];
    const cv = $('plans'), g = cv.getContext('2d'), cw = 240, chh = 192, gap = 36, pad = 16;
    cv.width = 3 * cw + 2 * gap + 2 * pad; cv.height = chh + 96 + 2 * pad;
    g.fillStyle = '#10141c'; g.fillRect(0, 0, cv.width, cv.height);
    DIST.forEach((d, i) => {
      const ox = pad + i * (cw + gap), oy = pad + 26, sx = cw / 3, sy = chh / 3;
      g.fillStyle = '#e6f4ff'; g.font = '600 15px system-ui'; g.fillText(d.name, ox, pad + 14);
      for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) { g.fillStyle = d.park.some(([a, b]) => a === x && b === y) ? '#13211A' : (x + y) % 2 ? '#161d2b' : '#141a26'; g.fillRect(ox + x * sx, oy + y * sy, sx, sy); g.strokeStyle = '#2a3650'; g.strokeRect(ox + x * sx + 0.5, oy + y * sy + 0.5, sx, sy); }
      for (const [row, z, col] of d.decks.map(([r, , c], k) => [r, k, c])) { g.strokeStyle = col; g.globalAlpha = 0.55; g.lineWidth = 10; g.beginPath(); g.moveTo(ox, oy + (row + 0.55) * sy); g.lineTo(ox + cw, oy + (row + 0.55) * sy); g.stroke(); g.globalAlpha = 1; void z; }
      for (const r of d.roads) { g.strokeStyle = '#c9e9ff'; g.lineWidth = 2; g.setLineDash([5, 4]); g.beginPath(); r.forEach(([x, y], k) => (k ? g.lineTo(ox + x * sx, oy + y * sy) : g.moveTo(ox + x * sx, oy + y * sy))); g.stroke(); g.setLineDash([]); }
      if (d.streets) for (const a of [-90, -135, -45, 180, 0]) { g.strokeStyle = '#FF5FD2'; g.lineWidth = 3; g.beginPath(); g.moveTo(ox + 1.5 * sx, oy + 1.4 * sy); g.lineTo(ox + 1.5 * sx + Math.cos(a * Math.PI / 180) * sx * 0.9, oy + 1.4 * sy + Math.sin(a * Math.PI / 180) * sy * 0.9); g.stroke(); }
      for (const [x, y, label, col] of d.centre) { g.fillStyle = col; g.beginPath(); g.arc(ox + (x + 0.5) * sx, oy + (y + 0.5) * sy, 13, 0, 7); g.fill(); g.fillStyle = '#e6f4ff'; g.font = '11px system-ui'; g.fillText(label, ox + x * sx + 4, oy + (y + 1) * sy - 5); }
      g.fillStyle = '#8ea3bf'; g.font = '12px system-ui';
      const words = d.mood.split(' '), lines = ['']; for (const w of words) { const t = (lines[lines.length - 1] + ' ' + w).trim(); if (g.measureText(t).width > cw) lines.push(w); else lines[lines.length - 1] = t; }
      lines.forEach((ln, j) => g.fillText(ln, ox, oy + chh + 18 + j * 16)); g.fillText('Write-offs required: ' + d.quota, ox, oy + chh + 18 + lines.length * 16 + 2);
    });
  })();
})();
