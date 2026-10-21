// DUMMIES P4 Turn Lab (GDD Edit 49, test only). Road pieces at chosen radii, run with the real P4 driver.
// One module for the browser viewer (turn_lab.html) and the headless matrix (node lab_run.js).
(function (root) {
  'use strict';
  const W = 800, H = 640, LEAD = 200;
  const hyp = Math.hypot;

  // ---------- road pieces. Each returns { center, ring } in an 800 × 640 screen, lead-ins beyond the edges like a city screen.
  // P3 pieces use P3's corner rule: a 90° fillet that shrinks to fit (fillet). P4 pieces never bend below the minimum (filletAny).
  const PIECES = {
    corner: { name: 'L corner (90°)', params: ['R'], build: (X, q) => ({ center: X.filletAny([[-LEAD, 320], [400, 320], [400, H + LEAD]], q.R, 0) }) },
    zjog: { name: 'Z jog, P3 (two 90° corners)', params: ['R', 'lat'],
      build: (X, q) => ({ center: X.fillet([[-LEAD, 320 - q.lat / 2], [400, 320 - q.lat / 2], [400, 320 + q.lat / 2], [W + LEAD, 320 + q.lat / 2]], q.R) }) },
    stepped: { name: 'Stepped L, P3 (two steps)', params: ['R'],
      build: (X, q) => ({ center: X.fillet([[-LEAD, 200], [280, 200], [280, 400], [520, 400], [520, H + LEAD]], q.R) }) },
    diagonal: { name: 'Diagonal jog, P4 (45°)', params: ['R', 'lat'],
      build: (X, q) => ({ center: X.filletAny([[-LEAD, 320 - q.lat / 2], [400 - q.lat / 2, 320 - q.lat / 2], [400 + q.lat / 2, 320 + q.lat / 2], [W + LEAD, 320 + q.lat / 2]], q.R, 0) }) },
    chamfer: { name: 'Chamfered L, P4 (45° cut)', params: ['R', 'cut'],
      build: (X, q) => ({ center: X.filletAny([[-LEAD, 240], [480 - q.cut, 240], [480, 240 + q.cut], [480, H + LEAD]], q.R, 0) }) },
    roundabout: { name: 'Roundabout (W → E, the long way round half)', params: ['Rf'],
      build: (X, q, P) => {
        const a = { side: 'W', off: H / 2 }, b = { side: 'E', off: H / 2 }, r = () => 0.3, Rc = P['world.roundaboutRadius'];
        const ring = X.arcPts(W / 2, H / 2, Rc, 0, 2 * Math.PI, 48);
        if (q.Rf > 0) return { center: X.roundaboutCenter(a, b, W, H, LEAD, Rc, r, q.Rf), ring };
        return { center: p3Roundabout(X, a, b, Rc), ring }; // P3: radial road meets the ring at a chaikin-rounded corner
      } },
    roundaboutL: { name: 'Roundabout (W → S, three quarters round)', params: ['Rf'],
      build: (X, q, P) => {
        const a = { side: 'W', off: H / 2 }, b = { side: 'S', off: W / 2 }, r = () => 0.3, Rc = P['world.roundaboutRadius'];
        const ring = X.arcPts(W / 2, H / 2, Rc, 0, 2 * Math.PI, 48);
        if (q.Rf > 0) return { center: X.roundaboutCenter(a, b, W, H, LEAD, Rc, r, q.Rf), ring };
        return { center: p3Roundabout(X, a, b, Rc, -1.5 * Math.PI), ring };
      } },
    roundabout3: { name: 'Roundabout, three arms (W, E, S): every route', params: ['Rf'], build: (X, q, P) => multiRoundabout(X, P, ['W', 'E', 'S'], q.Rf) },
    roundabout4: { name: 'Roundabout, four arms: every route', params: ['Rf'], build: (X, q, P) => multiRoundabout(X, P, ['W', 'N', 'E', 'S'], q.Rf) },
  };
  // P4 (Edit 49.1): a roundabout with several arms. Traffic keeps right and circulates one way (anticlockwise on screen) in the
  // outer ring lane. One route per ordered pair of arms, each with its own lane path and a give-way line where it joins the ring.
  function multiRoundabout(X, P, arms, Rf) {
    const Rc = P['world.roundaboutRadius'], half = P['world.laneWidth'] / 2, R = Rc + half, ang = { W: Math.PI, E: 0, N: -Math.PI / 2, S: Math.PI / 2 };
    const cx = W / 2, cy = H / 2, ring = X.arcPts(cx, cy, Rc, 0, 2 * Math.PI, 48), lanes = [], roads = [], names = [];
    const wrapA = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
    for (const a of arms) for (const b of arms) {
      if (a === b) continue;
      const ea = { side: a, off: a === 'W' || a === 'E' ? H / 2 : W / 2 }, eb = { side: b, off: b === 'W' || b === 'E' ? H / 2 : W / 2 };
      const nat = wrapA(ang[b] - ang[a]), opposite = Math.abs(Math.abs(nat) - Math.PI) < 1e-6;
      const r = () => (opposite ? 0.9 : nat > 0 ? 0.1 : 0.9); // always the anticlockwise way round (decreasing angle)
      const center = X.roundaboutCenter(ea, eb, W, H, LEAD, Rc, r, Rf || 96), lane = X.lanesOf(center, P)[0];
      let sLine = null, aj = null, sj = null;
      for (let i = 0; i < lane.pts.length; i++) {
        const [x, y] = lane.pts[i], d = hyp(x - cx, y - cy);
        if (sLine == null && d <= R + 45) sLine = lane.cum[i];
        if (aj == null && d <= R + 2) { aj = Math.atan2(y - cy, x - cx); sj = lane.cum[i]; break; }
      }
      lane.giveWay = { s: sLine, sj, cx, cy, R, dir: -1, aj }; // stop line, join point (s and angle), circulating lane
      lanes.push(lane); roads.push(center); names.push(a + '→' + b);
    }
    return { center: roads[0], ring, lanes, roads, routes: names };
  }
  // P3's roundabout path, rebuilt here so the lab can compare it on the same driver (P3 sim.js, Edit 41.1).
  function p3Roundabout(X, a, b, Rc, sweepIn) {
    const ang = { W: Math.PI, E: 0, N: -Math.PI / 2, S: Math.PI / 2 }, cx = W / 2, cy = H / 2, ta = ang[a.side], tb = ang[b.side];
    const sweep = sweepIn != null ? sweepIn : Math.PI;
    const pts = [X.edgePoint(a.side, a.off, W, H, LEAD), [cx + Math.cos(ta) * (Rc + 90), cy + Math.sin(ta) * (Rc + 90)]];
    const n = Math.max(2, Math.round(Math.abs(sweep) / (Math.PI / 8)));
    for (let i = 0; i <= n; i++) { const t = ta + sweep * i / n; pts.push([cx + Math.cos(t) * Rc, cy + Math.sin(t) * Rc]); }
    pts.push([cx + Math.cos(tb) * (Rc + 90), cy + Math.sin(tb) * (Rc + 90)], X.edgePoint(b.side, b.off, W, H, LEAD));
    return chaikin(pts, 3);
  }
  function chaikin(pts, n) {
    for (let k = 0; k < n; k++) {
      const out = [pts[0]];
      for (let i = 0; i + 1 < pts.length; i++) { const [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; out.push([x0 * 0.75 + x1 * 0.25, y0 * 0.75 + y1 * 0.25], [x0 * 0.25 + x1 * 0.75, y0 * 0.25 + y1 * 0.75]); }
      out.push(pts[pts.length - 1]); pts = out;
    }
    return pts;
  }

  // ---------- geometry metrics
  const onScreen = ([x, y]) => x >= -40 && x <= W + 40 && y >= -40 && y <= H + 40;
  function radii(pts) {
    return pts.map((q, i) => {
      const p0 = pts[i - 1], p2 = pts[i + 1];
      if (!p0 || !p2) return Infinity;
      const A = hyp(q[0] - p0[0], q[1] - p0[1]), B = hyp(p2[0] - q[0], p2[1] - q[1]), C = hyp(p2[0] - p0[0], p2[1] - p0[1]);
      const cr = Math.abs((q[0] - p0[0]) * (p2[1] - p0[1]) - (q[1] - p0[1]) * (p2[0] - p0[0]));
      return cr < 1e-6 ? Infinity : A * B * C / (2 * cr);
    });
  }
  function minRadius(pts) { // smallest bend on screen and where it is
    const r = radii(pts); let best = { r: Infinity, at: null };
    r.forEach((v, i) => { if (onScreen(pts[i]) && v < best.r) best = { r: v, at: pts[i] }; });
    return best;
  }

  // ---------- fleets (P4, Edit 49.2 mock-up). 'p3': sedans and vans by vanShare. 'expanded': all eight canon classes.
  // 'buses': buses only. Bus length comes from vehicles.bus.length (overrides), so 96, 120 and 144 can be compared.
  const FLEETS = {
    p3: null,
    expanded: [['sedan', 0.2], ['hatchback', 0.14], ['sports', 0.08], ['wagon', 0.1], ['suv', 0.1], ['police', 0.06], ['van', 0.2], ['bus', 0.12]],
    buses: [['bus', 1]],
  };
  const CLASSES = ['hatchback', 'sports', 'sedan', 'police', 'wagon', 'suv', 'van', 'bus'];
  function pickClass(fleet, vanShare, u) {
    const F = FLEETS[fleet || 'p3'];
    if (!F) return u < vanShare ? 'van' : 'sedan';
    let acc = 0; for (const [c, w] of F) { acc += w; if (u < acc) return c; }
    return F[F.length - 1][0];
  }
  // how far a car's body corners stand outside its own lane (half a lane each side of its path), world units
  function overhang(c, P) {
    const ca = Math.cos(c.h), sa = Math.sin(c.h), lw2 = P['world.laneWidth'] / 2;
    let m = 0;
    for (const [a, b] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) {
      const x = c.x + ca * a * c.L / 2 - sa * b * c.W / 2, y = c.y + sa * a * c.L / 2 + ca * b * c.W / 2, pr = X0.pathProject(c.path, x, y);
      m = Math.max(m, Math.abs(pr.lat - c.d) - lw2);
    }
    return m;
  }
  let X0 = null;
  // ---------- a lab sim: the P4 driver on one road piece, the dummy away, cars of the chosen mix both ways
  function makeSim(X, piece, q, opts) {
    X0 = X;
    const s = new X.Sim('straight', Object.assign({ 'run.appearances.road': 2000 }, opts.overrides || {}));
    const P = s.P, g = PIECES[piece].build(X, q, P), lanes = g.lanes || X.lanesOf(g.center, P);
    s.level = Object.assign({}, s.level, { center: g.center, ring: g.ring || null, lanes, statics: [], coneHomes: [], spawns: [{ x: -900, y: -900, f: 0 }],
      patches: [], decks: [], deckLanes: [], checkpoints: [], floors: [], stairs: [], theme: 'plain' });
    s.cones = []; s.cars = []; s.drones = []; s.booms = {};
    s.checkTerminal = () => {}; s.checkFlip = () => {};
    let seed = opts.seed || 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    s.schedule = Array.from({ length: 2000 }, (_, i) => ({ i, cls: pickClass(opts.fleet, opts.vanShare, rnd()), lane: Math.min(lanes.length - 1, Math.floor(rnd() * lanes.length)), mult: 0.8 + 0.4 * rnd() }));
    s.admissionInterval = () => opts.interval;
    Object.assign(s.body, { x: -900, y: -900 });
    s.lab = { piece, q, opts, geo: { center: g.center, ring: g.ring || null, roads: g.roads || [g.center], lanes: s.level.lanes.map((l) => l.pts), stops: lanes.filter((l) => l.giveWay).map((l) => X.pathAt(l, l.giveWay.s)) }, stats: null };
    s.lab.stats = { t: 0, exited: 0, maxStop: 0, jamAt: null, jamCars: [], overlapT: 0, held: 0, peak: 0, minV: Infinity, over: {}, overT: 0 };
    return s;
  }
  // rectangle overlap of two car bodies (separating axis)
  function overlap(a, b) {
    const ax = [Math.cos(a.h), Math.sin(a.h)], ay = [-ax[1], ax[0]], bx = [Math.cos(b.h), Math.sin(b.h)], by = [-bx[1], bx[0]], d = [b.x - a.x, b.y - a.y];
    for (const n of [ax, ay, bx, by]) {
      const pa = Math.abs(n[0] * ax[0] + n[1] * ax[1]) * a.L / 2 + Math.abs(n[0] * ay[0] + n[1] * ay[1]) * a.W / 2;
      const pb = Math.abs(n[0] * bx[0] + n[1] * bx[1]) * b.L / 2 + Math.abs(n[0] * by[0] + n[1] * by[1]) * b.W / 2;
      if (Math.abs(n[0] * d[0] + n[1] * d[1]) > pa + pb - 0.5) return false;
    }
    return true;
  }
  // one tick, then the lab's bookkeeping. The jam test runs whether or not spawns are held.
  function tick(s) {
    const st = s.lab.stats, dt = 1 / s.P['simulation.tickRate'];
    s.step({}); s.body.x = -900; s.body.y = -900;
    st.t = s.t;
    for (const e of s.events || []) { if (e.type === 'exit') st.exited++; }
    s.events = [];
    let ov = false;
    for (let i = 0; i < s.cars.length; i++) {
      const c = s.cars[i];
      if ((c.stopT || 0) > st.maxStop) st.maxStop = c.stopT;
      if (c.v > 1 && c.v < st.minV && c.s > c.L && c.s < c.path.length - c.L) st.minV = c.v;
      for (let j = i + 1; j < s.cars.length && !ov; j++) if (overlap(c, s.cars[j])) ov = true;
    }
    if (ov) st.overlapT += dt;
    if (s.tick % 3 === 0) { let big = false; for (const c of s.cars) { if (c.s < c.L || c.s > c.path.length - c.L) continue; const o = overhang(c, s.P); st.over[c.cls] = Math.max(st.over[c.cls] || 0, o); if (o > 8) big = true; } if (big) st.overT += 3 * dt; } // swept path
    st.peak = Math.max(st.peak, s.cars.length);
    const T = 6, jam = s.cars.filter((c) => (c.stopT || 0) >= T && ['cycle', 'none'].includes(s.jamCause(c, new Set([c]))));
    if (jam.length && st.jamAt == null) { st.jamAt = +s.t.toFixed(1); st.jamCars = jam.map((c) => c.cls); }
    if (s.slot < s.schedule.length && s.t >= s.nextAt && s.P['traffic.gridlockSeconds'] > 0 && s.jams && s.jams[0]) st.held += dt;
  }
  function run(X, piece, q, opts) {
    const s = makeSim(X, piece, q, opts), n = Math.round(opts.seconds * s.P['simulation.tickRate']);
    for (let i = 0; i < n; i++) tick(s);
    const geo = s.lab.geo, lanesR = geo.lanes.map((p) => minRadius(p).r), st = s.lab.stats;
    return { piece, q, driver: opts.overrides && opts.overrides['traffic.followRoad'] === 0 ? 'P3' : 'P4', hold: !(opts.overrides && opts.overrides['traffic.gridlockSeconds'] === 0), fleet: opts.fleet || 'p3', busL: s.P['vehicles.bus.length'],
      overhang: Object.fromEntries(Object.entries(st.over).map(([k, v]) => [k, +v.toFixed(1)])), overhangS: +st.overT.toFixed(1),
      vanShare: opts.vanShare, interval: opts.interval, seconds: opts.seconds,
      centreR: +minRadius(geo.center).r.toFixed(1), laneR: +Math.min(...lanesR).toFixed(1), cornerV: +Math.sqrt(s.P['traffic.cornerAccel'] * Math.min(...lanesR)).toFixed(0),
      exitedPerMin: +(st.exited / opts.seconds * 60).toFixed(1), maxStop: +st.maxStop.toFixed(1), jamAt: st.jamAt, jamCars: st.jamCars, overlapS: +st.overlapT.toFixed(1),
      heldS: +st.held.toFixed(1), peak: st.peak };
  }
  const api = { PIECES, FLEETS, CLASSES, makeSim, tick, run, minRadius, radii, overlap, overhang: (c, P) => overhang(c, P), W, H };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.TURNLAB = api;
})(typeof window !== 'undefined' ? window : globalThis);
