// Diagonal highway mock-up (P5, GDD Edit 50.1). Highways at 0°, 45° and 135° over a ground road, in game art, with live
// P5 traffic on deck and ground (the game's driver; highway cars at traffic.deckSpeedScale). A district map shows how a
// diagonal highway runs across screens. Mock-up only: the P5 planner still builds square highways.
(function () {
  'use strict';
  const X = window.DUMMIES, PIX = window.PIX, P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), U = PIX.U, K = PIX.K, AW = PIX.AW, AH = PIX.AH, Z = 2;
  const W = P['world.width'], H = P['world.height'], LEAD = P['world.spawnLeadIn'], LW = P['world.laneWidth'], OUTER = LW + P['proto.shoulderWidth'];
  const HALF = P['world.deckWidth'] / 2, PW = P['world.parapetWidth'], EXT = (h) => Math.round(h * P['proto.art.extrusion'] / U), D45 = Math.SQRT1_2;
  const LED = PIX.c32((PIX.PAL.bldgLed || ['#4FC3E8', '#1A7FA7'])[1]);
  const $ = (id) => document.getElementById(id);
  // a straight line through (cx, cy) along (ux, uy), LEAD beyond the screen both ways
  function line(cx, cy, ux, uy) {
    const t = (fx, fy) => { const ts = []; if (fx > 1e-9) ts.push((W - cx) / fx); if (fx < -1e-9) ts.push(-cx / fx); if (fy > 1e-9) ts.push((H - cy) / fy); if (fy < -1e-9) ts.push(-cy / fy); return Math.min(...ts) + LEAD; };
    const a = t(-ux, -uy), b = t(ux, uy);
    return [[cx - ux * a, cy - uy * a], [cx + ux * b, cy + uy * b]];
  }
  const DIRS = { 0: [1, 0], 90: [0, 1], 45: [D45, -D45], 135: [D45, D45] }; // on screen: 45° rises to the right, 135° falls to the right
  // ---------- panels: a highway (angle, centre) over a ground road (angle, centre)
  const PANELS = [
    { id: 'square', title: 'Today: square highway over a square road', deck: { ang: 0, c: [400, 352], z: 1 }, road: { ang: 90, c: [400, 320] },
      note: 'Decision 152: the highway runs horizontally; the road beneath crosses square.', verdict: 'good' },
    { id: 'd135', title: '135° highway over a 45° road: square crossing', deck: { ang: 135, c: [430, 380], z: 1 }, road: { ang: 45, c: [400, 340] },
      note: 'Keeps decision 152: the road passes square beneath. The road takes a 45° run under the highway.', verdict: 'good', stair: true },
    { id: 'd45x', title: '45° highway over a square road: 45° crossing', deck: { ang: 45, c: [430, 390], z: 1 }, road: { ang: 0, c: [400, 300] },
      note: 'Breaks decision 152: the road passes under at 45°. Its shadowed run under the deck is 1.4× as long; columns crowd it.', verdict: 'bad' },
    { id: 'corner', title: '45° highway cutting a corner (S edge to E edge)', deck: { ang: 45, c: [680, 520], z: 2 }, road: { ang: 0, c: [400, 232] },
      note: 'A 45° line cannot cross 800 × 640 from W to E: Δy would be 800. It always meets a top or bottom edge.', verdict: 'warn' },
  ];
  function deckGeom(dk) {
    const [ux, uy] = DIRS[dk.ang], nx = -uy, ny = ux, step = U / (Math.abs(nx) + Math.abs(ny)); // across moves by step per pixel line
    return Object.assign({ ux, uy, nx, ny, step, height: dk.z === 2 ? P['world.highHeight'] : P['world.deckHeight'] }, dk);
  }
  function clipLen(pts) { // length of a straight centre line inside the screen
    const [[x0, y0], [x1, y1]] = pts; let a = 0, b = 1; const dx = x1 - x0, dy = y1 - y0;
    for (const [p, q] of [[-dx, x0], [dx, W - x0], [-dy, y0], [dy, H - y0]]) { if (Math.abs(p) < 1e-9) { if (q < 0) return 0; continue; } const r = q / p; if (p < 0) a = Math.max(a, r); else b = Math.min(b, r); }
    return b > a ? (b - a) * Math.hypot(dx, dy) : 0;
  }
  const acrossOf = (g, x, y) => (x - g.c[0]) * g.nx + (y - g.c[1]) * g.ny;
  const alongOf = (g, x, y) => (x - g.c[0]) * g.ux + (y - g.c[1]) * g.uy;
  // ---------- the deck surface, drawn in its own layer (pre-lift), by world-unit rules that keep 1 px lines at any of 0/45/135
  function paintDeck(L, g) {
    const s2 = g.step / 2, lift = EXT(g.height), face = 4, high = g.z === 2;
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const wx = (x + 0.5) * U, wy = (y + 0.5) * U, b = acrossOf(g, wx, wy), a = alongOf(g, wx, wy), pb = HALF - Math.abs(b);
      if (pb < 0) continue;
      let c;
      if (pb < g.step) c = K.jerseyO;
      else if (pb < 2 * g.step) c = ((a / U) % 6 + 6) % 6 < 3 ? LED : K.jerseyTop; // parapet LED line
      else if (pb < PW + g.step) c = K.jersey;
      else if (high && pb < PW + 2 * g.step) c = ((a / U) % 6 + 6) % 6 < 3 ? LED : K.deck2;
      else if (Math.abs(Math.abs(b) - LW) < s2) c = K.lane; // solid lines: hard shoulders outside
      else if (Math.abs(b) < s2 && ((a % 48) + 48) % 48 < 28) c = K.lane; // long dashes
      else if (((a % 64) + 64) % 64 < g.step) c = K.deckJoint;
      else c = Math.abs(b) > LW ? K.deck2 : K.deck;
      L.put(x, y, c);
    }
    // girder face: the deck's screen-down edge, extruded 4 px down (lit lip, ribs, outline)
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) {
      const inB = (xx, yy) => HALF - Math.abs(acrossOf(g, (xx + 0.5) * U, (yy + 0.5) * U)) >= 0;
      if (inB(x, y)) continue;
      for (let k = 1; k <= face; k++) if (inB(x, y - k)) { const a = alongOf(g, (x + 0.5) * U, (y + 0.5) * U); L.put(x, y, k === 1 ? K.jerseyTop : k === face ? K.bldgOutline : (((a / U) % 8 + 8) % 8 < 2 ? K.columnD : K.column)); break; }
    }
    return lift;
  }
  function shadeDeck(B, g) { // the deck's shadow on the ground: the band swept by the sun over its height
    const k = P['proto.art.shadowScale'], ox = PIX.SUN.x * g.height * k, oy = PIX.SUN.y * g.height * k, on = ox * g.nx + oy * g.ny;
    const lo = -HALF + Math.min(0, on), hi = HALF + Math.max(0, on);
    for (let y = 0; y < AH; y++) for (let x = 0; x < AW; x++) { const b = acrossOf(g, (x + 0.5) * U, (y + 0.5) * U); if (b >= lo && b <= hi) B.shade(x, y, 0.72); }
  }
  // columns under both deck edges at world.deckPillarSpacing, clear of the road beneath
  function columns(g, road) {
    const out = [], C = P['world.deckColumn'], sp = P['world.deckPillarSpacing'];
    for (let a = -1600 + sp / 2; a < 1600; a += sp) for (const sd of [-1, 1]) {
      const cx = g.c[0] + g.ux * a + g.nx * sd * (HALF - C / 2 - 4), cy = g.c[1] + g.uy * a + g.ny * sd * (HALF - C / 2 - 4);
      if (cx < -C || cy < -C || cx > W + C || cy > H + C) continue;
      const pr = X.pathProject(road.path, cx, cy); if (Math.abs(pr.lat) < OUTER + C) continue;
      out.push({ x: cx - C / 2, y: cy - C / 2, w: C, h: C });
    }
    return out;
  }
  // a stair parallel to the deck, outside its parapet: rises from the ground to the deck over world.stairLength × 3
  function stairOf(g) {
    const len = P['world.stairLength'] * 3, wd = P['world.stairWidth'], a0 = -320, side = 1;
    return { g, a0, a1: a0 + len, b0: side * (HALF + 2), b1: side * (HALF + 2 + wd), side };
  }
  function paintStair(Bf, st, lift) { // drawn after the ground, before the deck: each row lifted by its height
    const g = st.g;
    for (let y = 0; y < AH + lift; y++) for (let x = 0; x < AW; x++) {
      // pixel (x, y) on screen shows the stair point whose ground position is (x, y + h(t))
      for (let h = lift; h >= 0; h--) {
        const wx = (x + 0.5) * U, wy = (y + h + 0.5) * U, a = alongOf(g, wx, wy), b = acrossOf(g, wx, wy);
        if (a < st.a0 || a > st.a1 || b < Math.min(st.b0, st.b1) || b > Math.max(st.b0, st.b1)) continue;
        const t = (a - st.a0) / (st.a1 - st.a0), hh = Math.round(t * lift);
        if (hh !== h) continue;
        const edge = Math.abs(b - st.b0) < g.step || Math.abs(b - st.b1) < g.step;
        Bf.put(x, y, edge ? K.jerseyO : (Math.floor(a / 6) % 2 ? K.jerseyTop : K.jersey));
        break;
      }
    }
  }
  // ---------- live sims, one per panel
  const panels = PANELS.map((pn) => {
    const g = deckGeom(pn.deck), road = { center: line(pn.road.c[0], pn.road.c[1], ...DIRS[pn.road.ang]) }, lanes = X.lanesOf(road.center, P);
    road.path = lanes[0];
    const deckCenter = line(g.c[0], g.c[1], g.ux, g.uy), deckLanes = X.lanesOf(deckCenter, P).map((path, j) => ({ path, deck: 0, dir: j }));
    const s = new X.Sim('straight', { 'run.appearances.road': 2000 });
    s.level = Object.assign({}, s.level, { center: road.center, ring: null, lanes, statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }], patches: [], floors: [], stairs: [], checkpoints: [], theme: 'plain',
      decks: [{ hz: g.ang === 0, off: g.ang === 0 ? g.c[1] : g.c[0], z: g.z, height: g.height, diag: g.ang }], deckLanes });
    s.cones = []; s.cars = []; s.drones = []; s.checkTerminal = () => {}; s.checkFlip = () => {};
    s.schedule = s.schedule.map((sl, i) => Object.assign({}, sl, { cls: X.fleetClass(P, 0.3, ((i * 0.6180339887 + 0.53) % 1)), lane: i % 2 }));
    Object.assign(s.body, { x: -900, y: -900 });
    s.fillDeckCars();
    const B = PIX.ground({ center: road.center, ring: null, statics: [], spawns: [], coneHomes: [], patches: [], decks: [], floors: [], canal: false, solid: [] }, P, 11);
    shadeDeck(B, g);
    const cols = columns(g, road).map((st) => ({ st, spr: PIX.column(Math.round(st.w / U), Math.round(st.h / U), EXT(g.height)) }));
    const L0 = new PIX.Buf(AW, AH); L0.layer = false; const lift = paintDeck(L0, g);
    const stair = pn.stair ? stairOf(g) : null, SB = new PIX.Buf(AW, AH);
    if (stair) paintStair(SB, stair, lift); // drawn once
    const cv = document.createElement('canvas'); cv.width = AW * Z; cv.height = AH * Z;
    const vis = clipLen(deckCenter);
    return { pn, g, road, s, B, cols, L0, lift, stair, SB, vis, cv, FB: new PIX.Buf(AW, AH), DL: new PIX.Buf(AW, AH), off: Object.assign(document.createElement('canvas'), { width: AW, height: AH }) };
  });
  const box = $('panels');
  for (const p of panels) {
    const wrap = document.createElement('div'); wrap.appendChild(p.cv);
    const tag = { good: '<span class="good">Fits the rules</span>', warn: '<span class="warn">Needs a rule</span>', bad: '<span class="bad">Breaks a rule</span>' }[p.pn.verdict];
    const cap = document.createElement('div'); cap.innerHTML = `<h3>${p.pn.title}</h3><p class="cap">${tag} · ${p.pn.note}</p><p class="cap" id="st_${p.pn.id}"></p>`;
    wrap.appendChild(cap); box.appendChild(wrap);
  }
  const EXTc = (cls) => EXT(P['vehicles.' + cls + '.height']);
  function draw(p) {
    const { FB, DL, s, g, lift } = p;
    FB.d.set(p.B.d);
    if (p.stair) for (let i = 0; i < FB.d.length; i++) if (p.SB.d[i]) FB.d[i] = p.SB.d[i];
    const ground = s.cars.filter((c) => !c.deck).sort((a, b) => a.y - b.y);
    for (const c of ground) PIX.blit(FB, PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXTc(c.cls), c.h, false), c.x / U, c.y / U);
    for (const c of p.cols.slice().sort((a, b) => a.st.y - b.st.y)) PIX.blit(FB, c.spr, Math.round(c.st.x / U), Math.round(c.st.y / U));
    DL.d.set(p.L0.d);
    for (const c of s.cars.filter((c) => c.deck).sort((a, b) => a.y - b.y)) PIX.blit(DL, PIX.car(c.cls, Math.round(c.L / U), Math.round(c.W / U), EXTc(c.cls), c.h, false), c.x / U, c.y / U);
    if (p.pn.id === 'd135') { const S = PIX.dummy(Math.PI / 4, 0); PIX.blit(DL, S, (g.c[0] + g.nx * (HALF - 18) - g.ux * 120) / U, (g.c[1] + g.ny * (HALF - 18) - g.uy * 120) / U); } // a dummy on the shoulder, for scale
    for (let y = 0; y < AH; y++) { const ty = y - lift; if (ty < 0) continue; for (let x = 0; x < AW; x++) { const c = DL.d[y * AW + x]; if (c) FB.d[ty * AW + x] = c; } }
    const og = p.off.getContext('2d'), img = og.createImageData(AW, AH); new Uint32Array(img.data.buffer).set(FB.d); og.putImageData(img, 0, 0);
    const g2 = p.cv.getContext('2d'); g2.imageSmoothingEnabled = false; g2.drawImage(p.off, 0, 0, AW * Z, AH * Z);
    g2.strokeStyle = 'rgba(73,211,255,0.10)'; g2.lineWidth = 1;
    for (let x = 0; x <= AW; x += 16) { g2.beginPath(); g2.moveTo(x * Z + 0.5, 0); g2.lineTo(x * Z + 0.5, AH * Z); g2.stroke(); }
    for (let y = 0; y <= AH; y += 16) { g2.beginPath(); g2.moveTo(0, y * Z + 0.5); g2.lineTo(AW * Z, y * Z + 0.5); g2.stroke(); }
    const deck = s.cars.filter((c) => c.deck), vd = deck.length ? deck.reduce((a, c) => a + c.v, 0) / deck.length : 0;
    $('st_' + p.pn.id).textContent = `Live: highway cars ${deck.length}, mean speed ${vd.toFixed(0)} · ground cars ${s.cars.length - deck.length} · deck Z${g.z}, lift ${lift} px · ${p.cols.length} columns · highway on screen ${p.vis.toFixed(0)} units`;
  }
  let last = performance.now(), playing = true;
  function frame(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    if (playing) for (const p of panels) { const n = Math.round(dt * P['simulation.tickRate']); for (let i = 0; i < n; i++) { p.s.step({}); p.s.body.x = -900; p.s.body.y = -900; } }
    for (const p of panels) draw(p);
    requestAnimationFrame(frame);
  }
  for (const p of panels) for (let i = 0; i < 20 * 60; i++) { p.s.step({}); p.s.body.x = -900; p.s.body.y = -900; } // 20 s of traffic first
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? 'Pause' : 'Play'; };
  requestAnimationFrame(frame);

  // ---------- district map: how a straight 45° or 135° highway runs across a 3 × 3 district of 800 × 640 screens
  (function map() {
    const cv = $('map'), g = cv.getContext('2d'), C = 3, R = 3, k = 0.22, DW = W * C, DH = H * R, pad = 20;
    cv.width = DW * k + 2 * pad; cv.height = DH * k + 2 * pad;
    g.fillStyle = '#10141c'; g.fillRect(0, 0, cv.width, cv.height); g.translate(pad, pad); g.scale(k, k);
    for (let y = 0; y < R; y++) for (let x = 0; x < C; x++) { g.fillStyle = (x + y) % 2 ? '#161d2b' : '#141a26'; g.fillRect(x * W, y * H, W, H); g.strokeStyle = '#2a3650'; g.lineWidth = 4; g.strokeRect(x * W, y * H, W, H); g.fillStyle = '#8ea3bf'; g.font = '64px system-ui'; g.fillText('ABC'[x] + (y + 1), x * W + 24, y * H + 80); }
    const hw = [{ p0: [0, 1300], d: [D45, -D45], col: '#49d3ff', name: '45°' }, { p0: [1500, 0], d: [D45, D45], col: '#ff7ad9', name: '135°' }]; // kept apart: crossing highways need Z1 and Z2
    const rows = [];
    for (const h of hw) {
      const t1 = Math.min(...[h.d[0] > 0 ? (DW - h.p0[0]) / h.d[0] : Infinity, h.d[1] > 0 ? (DH - h.p0[1]) / h.d[1] : h.d[1] < 0 ? -h.p0[1] / h.d[1] : Infinity]) - 1e-6;
      const p1 = [h.p0[0] + h.d[0] * t1, h.p0[1] + h.d[1] * t1];
      g.strokeStyle = h.col; g.globalAlpha = 0.35; g.lineWidth = 2 * HALF; g.beginPath(); g.moveTo(...h.p0); g.lineTo(...p1); g.stroke(); g.globalAlpha = 1; g.lineWidth = 6; g.beginPath(); g.moveTo(...h.p0); g.lineTo(...p1); g.stroke();
      let top = 0, side = 0; const screens = new Set();
      for (let t = 0; t <= t1; t += 4) { const x = h.p0[0] + h.d[0] * t, y = h.p0[1] + h.d[1] * t; screens.add('ABC'[Math.min(2, Math.floor(x / W))] + (Math.min(2, Math.floor(y / H)) + 1)); }
      for (let x = W; x < DW; x += W) { const t = (x - h.p0[0]) / h.d[0]; if (t > 0 && t < t1) { const y = h.p0[1] + h.d[1] * t; side++; g.fillStyle = '#57e389'; g.beginPath(); g.arc(x, y, 34, 0, 7); g.fill(); } }
      for (let y = H; y < DH; y += H) { const t = (y - h.p0[1]) / h.d[1]; if (t > 0 && t < t1) { const x = h.p0[0] + h.d[0] * t; top++; g.fillStyle = '#ffb347'; g.beginPath(); g.arc(x, y, 34, 0, 7); g.fill(); g.strokeStyle = '#ffb347'; g.lineWidth = 10; g.beginPath(); g.moveTo(x - HALF * 1.41 - P['world.deckTopClear'], y); g.lineTo(x + HALF * 1.41 + P['world.deckTopClear'], y); g.stroke(); } }
      rows.push(`<tr><td class="l" style="color:${h.col}">${h.name} highway</td><td>${screens.size}</td><td>${side}</td><td>${top}</td><td>${(2 * HALF * Math.SQRT2 + 2 * P['world.deckTopClear']).toFixed(0)}</td></tr>`);
    }
    $('maprows').innerHTML = '<tr><th class="l">Highway</th><th>Screens crossed</th><th>Side-edge crossings (as today)</th><th>Top/bottom-edge crossings</th><th>Edge closed per top crossing (units)</th></tr>' + rows.join('');
  })();
})();
