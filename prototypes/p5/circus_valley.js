// Edit 58–59 (concept, plans only): Circus as a valley city by a river. Terrain sets the levels; roads keep theirs.
// Row 1 is a hill at Z1 (world.deckHeight); row 2 falls from cliff to avenue to beach at Z0; row 3 is the shore, where a
// coastal drive runs on the seawall above the river (Edit 59). Z1 roads are streets on the hill and bridges on columns
// over everything lower; the two bridges run straight south over the river. District units, 2400 × 1920.
(function (root) {
  const X = root.DUMMIES || require('./sim.js'), P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), hyp = Math.hypot;
  const W = P['world.width'], H = P['world.height'], DW = 3 * W, DH = 3 * H, HALF = P['world.deckWidth'] / 2, LW = P['world.laneWidth'];
  const OUTER = LW + P['proto.shoulderWidth'], RS = P['world.roundaboutRadiusStreet'], ZONE = P['world.junctionZone'], Z1H = P['world.deckHeight'];
  const SPAN = P['world.deckPillarSpacing'], COL = P['world.deckColumn'], RUN1 = X.stairRun(P, 0, 1), EXTW = P['proto.art.extrusion'];
  const TILE = (x, y) => 'ABC'[Math.min(2, Math.max(0, Math.floor(x / W)))] + (Math.min(2, Math.max(0, Math.floor(y / H))) + 1);

  // ---------- the terrain: two terrace edges (west to east), and two coves where the floor ramps from Z0 to Z1
  const NORTH = [[-200, 760], [880, 760], [1040, 600], [1040, 360], [1360, 360], [1360, 600], [1520, 760], [2600, 760]];
  const BEACH = 1120; // Edit 59: sand from here to the seawall
  const SHORE = [[-200, 1540], [720, 1540], [880, 1700], [1520, 1700], [1680, 1540], [2600, 1540]]; // the seawall's top edge; the river below it
  const RIVER = -0.5; // the water surface, below the drive (not a floor)
  const COVES = [{ id: 'north cove', poly: [[880, 760], [1040, 600], [1040, 360], [1360, 360], [1360, 600], [1520, 760]], z0: 800, z1: 360 }];
  const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const edgeY = (edge, x) => { for (let i = 1; i < edge.length; i++) { const [ax, ay] = edge[i - 1], [bx, by] = edge[i]; if (x >= Math.min(ax, bx) && x <= Math.max(ax, bx) && bx !== ax) return ay + (by - ay) * (x - ax) / (bx - ax); } return null; };
  const ramp = (cv, y) => Math.max(0, Math.min(1, (cv.z0 - y) / (cv.z0 - cv.z1)));
  function ground(x, y) { // elevation in Z levels (1 hill, 0 valley floor and beach, RIVER the water)
    for (const cv of COVES) if (inPoly(cv.poly, x, y)) return ramp(cv, y);
    if (inPoly(NORTH_POLY, x, y)) return 1;
    return inPoly(RIVER_POLY, x, y) ? RIVER : 0;
  }
  const surface = (x, y) => { const g = ground(x, y); return g === RIVER ? 'river' : g >= 1 ? 'hill' : g > 0 ? 'cove' : y >= BEACH ? 'beach' : 'town'; };
  const NORTH_POLY = [[-200, -200], [2600, -200]].concat(NORTH.slice().reverse()).concat([[-200, -200]]);
  const RIVER_POLY = [[-200, 2120], [2600, 2120]].concat(SHORE.slice().reverse()).concat([[-200, 2120]]);

  // ---------- the network: every road says where it goes and why
  const climbZ = (cv) => (x, y) => ramp(cv, y);
  const DRIVE = X.filletAny([[-200, 1440], [720, 1440], [880, 1600], [1520, 1600], [1680, 1440], [2600, 1440]], P['world.roundaboutEntryRadius'], 0); // H–45°–H–45°–H along the seawall
  const PLAN = { key: 'valley', name: 'Circus · Valley by the river',
    idea: 'A hill to the north, a river to the south. The circus sits on the valley floor where the avenue meets the climb up the hill and the road down to the river. The hill\'s ridge road sends two bridges straight south, over the valley, the beach, the coastal drive and the river.',
    roads: [
      { id: 'Valley Avenue', z: () => 0, pts: [[-200, 960], [2600, 960]], from: 'west edge', to: 'east edge, through the circus', why: 'The valley is the natural corridor between the neighbouring valleys. The arterial follows it.' },
      { id: 'North Ridge Road', z: () => 1, pts: [[-200, 240], [2600, 240]], from: 'west edge', to: 'east edge', why: 'The upper town\'s main street, along the contour. A street at Z1: no columns.' },
      { id: 'West Bridge', z: () => 1, pts: [[400, 240], [400, 2120]], from: 'North Ridge Road', to: 'south edge, over the river', why: 'The hill\'s road to the far bank. It never comes down: a street on the hill, then columns over the valley and the beach, piers in the river.' },
      { id: 'East Bridge', z: () => 1, pts: [[2000, 240], [2000, 2120]], from: 'North Ridge Road', to: 'south edge, over the river', why: 'The same, east of the circus. Neither bridge meets another road south of the hill.' },
      { id: 'North Climb', z: climbZ(COVES[0]), pts: [[1200, 960], [1200, 240]], from: 'the circus', to: 'North Ridge Road', why: 'The one road between valley and hill. It ramps up the north cove.' },
      { id: 'Beach Road', z: () => 0, pts: [[1200, 960], [1200, 1600]], from: 'the circus', to: 'Coastal Drive', why: 'The circus\'s way down to the river, across the beach.' },
      { id: 'Coastal Drive', z: () => 0, pts: DRIVE, from: 'west edge', to: 'east edge', why: 'Follows the shore on the seawall: inland where the bridges pass over, out to the water in front of the circus.' }],
    ring: [1200, 960],
    tees: [[400, 240], [1200, 240], [2000, 240], [1200, 1600]],
    tiles: {
      A1: ['Upper town. The ridge road at Z1, a street on the hill; the west bridge leaves south at a T', 'Hill towers'],
      B1: ['The climb arrives up the cove and gives way at a T. A belvedere looks down on the circus', 'Belvedere and the cove\'s stepped walls'],
      C1: ['Upper town; the east bridge leaves south at a T', 'Hill towers'],
      A2: ['Start, west edge. Cliff, avenue and beach, top to bottom. The west bridge leaves the cliff on columns over the avenue: drop onto cars', 'Cliff house: doors on the valley floor and on the hill'],
      B2: ['The circus between the cove and the beach. The climb leaves north, the beach road south', 'Plinth and lit slab'],
      C2: ['Cliff, avenue and beach; the east bridge over the avenue; exit east', 'Tower whose roof meets the hill by a skybridge'],
      A3: ['The coastal drive on the seawall. The west bridge passes over it and out over the river: drop onto the drive, or into the river', 'Beach pavilions on pilotis'],
      B3: ['The beach road meets the coastal drive at a T where the drive swings out to the water', 'Seafront promenade and its lamp row'],
      C3: ['The drive swings back inland under the east bridge and leaves east along the river', 'Pier lantern at the bridge'] } };

  // ---------- geometry helpers
  function dense(pts, step) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.max(1, Math.ceil(hyp(bx - ax, by - ay) / (step || 8))); for (let k = 1; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]); } return out; }
  function distToPoly(pts, x, y) { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)); d = Math.min(d, hyp(ax + dx * t - x, ay + dy * t - y)); } return d; }
  // the elevated runs: where a road stands above the ground under it (a bridge)
  function raised(road) { const runs = []; let cur = null; for (const p of dense(road.pts, 4)) { const up = road.z(p[0], p[1]) - ground(p[0], p[1]) > 0.25; if (up) { if (!cur) runs.push(cur = []); cur.push(p); } else cur = null; } return runs.filter((r) => r.length > 1); }
  function segX(a, b, c, d) { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return null; const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? { x: a[0] + r[0] * t, y: a[1] + r[1] * t, r, s } : null; }
  const ang = (r, s) => { const a = Math.abs(Math.atan2(r[0] * s[1] - r[1] * s[0], r[0] * s[0] + r[1] * s[1])) * 180 / Math.PI; return Math.min(a, 180 - a); };

  // ---------- the checks: the user's transport logic first, then the level rules (Edits 43–57)
  function check(plan) {
    const rows = [], add = (rule, ok, detail) => rows.push({ rule, ok, detail });
    const nodes = plan.tees.concat([plan.ring]), inside = (p) => p[0] > 0 && p[1] > 0 && p[0] < DW && p[1] < DH;
    // 1. every road goes somewhere: each end leaves the district or meets a junction
    for (const r of plan.roads) for (const e of [r.pts[0], r.pts[r.pts.length - 1]]) add('Every road goes somewhere (no dead ends)', !inside(e) || nodes.some((n) => hyp(n[0] - e[0], n[1] - e[1]) < 2), r.id + (inside(e) ? ' ends at ' + TILE(e[0], e[1]) : ' leaves the district'));
    // 2. the levels connect, and only through the circus
    const zEnds = (r) => [r.z(r.pts[0][0], r.pts[0][1]), r.z(r.pts[r.pts.length - 1][0], r.pts[r.pts.length - 1][1])];
    const links = plan.roads.filter((r) => { const [a, b] = zEnds(r); return Math.round(a) !== Math.round(b); });
    add('Valley and hills connect by road', links.length > 0, links.map((r) => r.id).join(', '));
    add('The circus is where the levels meet', links.every((r) => r.pts.some((p) => hyp(p[0] - plan.ring[0], p[1] - plan.ring[1]) < 2)), 'climbs start at the circus');
    // 3. roads keep their level; the ground moves. Grade of each climb
    for (const r of links) { const cv = COVES.find((c) => r.pts.some((p) => inPoly(c.poly, p[0], p[1]) || hyp(p[0] - 1200, p[1] - (c.z0 + c.z1) / 2) < 400)); const run = Math.abs(cv.z0 - cv.z1); add('Climb grade (rise ' + Z1H + ' over the cove)', run >= 3 * Z1H, r.id + ': ' + Math.round(100 * Z1H / run) + '% over ' + run); }
    for (const r of plan.roads) { if (links.includes(r)) continue; const off = dense(r.pts, 8).filter(([x, y]) => r.z(x, y) - ground(x, y) < -0.25); add('No road below the ground it crosses (nothing underground)', off.length === 0, r.id); }
    // 4. bridges only where the ground falls away; over streets at 90° or 45°
    const drops = [];
    for (const r of plan.roads) for (const run of raised(r)) for (const q of plan.roads) { if (q === r) continue; for (let i = 1; i < run.length; i++) for (let j = 1; j < q.pts.length; j++) { const k = segX(run[i - 1], run[i], q.pts[j - 1], q.pts[j]); if (!k || q.z(k.x, k.y) > r.z(k.x, k.y) - 0.5 || drops.some((d) => hyp(d.x - k.x, d.y - k.y) < 8)) continue; const a = ang(k.r, k.s); drops.push({ tile: TILE(k.x, k.y), x: k.x, y: k.y, over: q.id, bridge: r.id, ang: a }); add('Bridge over a street at 90° or 45°', Math.abs(a - 90) < 1 || Math.abs(a - 45) < 1, r.id + ' over ' + q.id + ' in ' + TILE(k.x, k.y) + ': ' + Math.round(a) + '°'); } }
    const bridges = plan.roads.map((r) => ({ r, runs: raised(r) })).filter((b) => b.runs.length);
    add('Columns only where the ground is lower (valley, beach, river)', bridges.every((b) => b.runs.every((run) => run.every(([x, y]) => ground(x, y) < 0.5))), bridges.map((b) => b.r.id + ' on columns for ' + b.runs.map((run) => Math.round(hyp(run[run.length - 1][0] - run[0][0], run[run.length - 1][1] - run[0][1]))).join(', ')).join('; '));
    const river = []; for (const b of bridges) for (const run of b.runs) { const w = run.filter(([x, y]) => ground(x, y) === RIVER && y < DH); if (w.length) river.push({ tile: TILE(w[0][0], w[0][1]), x: w[Math.floor(w.length / 2)][0], y: Math.min(DH - 60, w[Math.floor(w.length / 2)][1]), bridge: b.r.id }); }
    add('Bridges run straight south over the river; no road joins them south of the hill', bridges.every((b) => b.r.pts.length === 2 && b.r.pts[0][0] === b.r.pts[1][0] && b.r.pts[1][1] > DH) && plan.tees.every((t) => !bridges.some((b) => Math.abs(b.r.pts[0][0] - t[0]) < 1 && t[1] > 760)), bridges.map((b) => b.r.id).join(', '));
    // 5. junctions and the ring (Edits 55.2, 56)
    const zq = (1 - ZONE) / 2, inZone = ([x, y]) => x % W >= W * zq && x % W <= W * (1 - zq) && y % H >= H * zq && y % H <= H * (1 - zq);
    for (const t of plan.tees) add('T junction in the central ' + Math.round(ZONE * 100) + '%, on level ground', inZone(t) && [[-60, 0], [60, 0], [0, -60], [0, 60]].every(([dx, dy]) => Math.abs(ground(t[0] + dx, t[1] + dy) - ground(t[0], t[1])) < 0.01), TILE(t[0], t[1]) + ' (' + t[0] % W + ', ' + t[1] % H + ')');
    const [cx, cy] = plan.ring, R = RS + OUTER;
    add('Circus inside its tile, centred, on level ground', cx % W - R >= 0 && cx % W + R <= W && cy % H - R >= 0 && cy % H + R <= H && inZone(plan.ring) && dense([[cx - R, cy], [cx + R, cy], [cx, cy - R], [cx, cy + R]], 16).every(([x, y]) => ground(x, y) === 0), 'B2, radius ' + RS);
    add('No bridge over the circus', bridges.every((b) => b.runs.every((run) => distToPoly(run, cx, cy) > R + HALF)), '');
    for (const r of plan.roads) for (const [a, b] of [[[W, -1e4], [W, 1e4]], [[2 * W, -1e4], [2 * W, 1e4]], [[-1e4, H], [1e4, H]], [[-1e4, 2 * H], [1e4, 2 * H]]]) for (let i = 1; i < r.pts.length; i++) { const k = segX(r.pts[i - 1], r.pts[i], a, b); if (!k) continue; const vert = a[0] === b[0], along = vert ? k.y : k.x, span = vert ? H : W, off = ((along % span) + span) % span; add('Road crosses a seam ≥ 160 from a tile corner', Math.min(off, span - off) >= 159, r.id + ' at (' + Math.round(k.x) + ', ' + Math.round(k.y) + ')'); }
    // 6. the dummy: two ways up to Z1 on every screen with walkable Z0 ground under or beside Z1 (escalators; a climb counts once)
    const esc = escalators(plan, bridges);
    for (const t of ['A2', 'B2', 'C2', 'A3', 'C3']) { const e = esc.filter((q) => q.tile === t).length, cl = links.filter((r) => dense(r.pts, 8).some(([x, y]) => TILE(x, y) === t && ground(x, y) > 0.02 && ground(x, y) < 0.98)).length;
      add('Two ways up on every screen below Z1 (public escalators, or a climb)', e + cl >= 2, t + ': ' + [e ? e + ' escalators' : '', cl ? cl + ' climb' : ''].filter(Boolean).join(', ')); }
    return { rows, drops, river, esc, bridges };
  }
  // public escalators (Chongqing's vertical streets): two down the north wall on each valley screen (45° flares included);
  // two up to a bridge wherever it stands over walkable ground away from the wall. Feet on Z0, clear of roads and the circus.
  function escalators(plan, bridges) {
    const out = [], clear = (x, y, except) => ground(x, y) === 0 && plan.roads.every((r) => r === except || distToPoly(r.pts, x, y) > OUTER + 24) && hyp(x - plan.ring[0], y - plan.ring[1]) > RS + OUTER + 24;
    for (let col = 0; col < 3; col++) { // the north wall on row 2
      const x0 = col * W, c = [];
      for (let i = 1; i < NORTH.length; i++) { const [ax, ay] = NORTH[i - 1], [bx, by] = NORTH[i], l = hyp(bx - ax, by - ay); if (ax === bx) continue;
        let nx = -(by - ay) / l, ny = (bx - ax) / l; if (ground(ax + (bx - ax) / 2 + nx * 40, ay + (by - ay) / 2 + ny * 40) > 0.5) { nx = -nx; ny = -ny; } // downhill
        for (let t = 24; t <= l - 24; t += 16) { const x = ax + (bx - ax) * t / l, y = ay + (by - ay) * t / l, run = RUN1 * Math.max(Math.abs(nx), Math.abs(ny)) / Math.max(Math.abs(nx), Math.abs(ny)), foot = [x + nx * run, y + ny * run];
          if (x < x0 + 40 || x > x0 + W - 40 || y < H || TILE(foot[0], foot[1]) !== 'ABC'[col] + '2') continue;
          if (clear(foot[0], foot[1]) && plan.roads.every((r) => distToPoly(r.pts, x, y) > OUTER + 16)) c.push({ tile: 'ABC'[col] + '2', head: [x, y], foot, nx, ny }); } }
      const pick = []; for (const target of [0.3, 0.7]) { const q = c.filter((e) => pick.every((p) => hyp(p.head[0] - e.head[0], p.head[1] - e.head[1]) > 200)).sort((p, q2) => Math.abs(p.head[0] - x0 - target * W) - Math.abs(q2.head[0] - x0 - target * W))[0]; if (q) pick.push(q); }
      out.push(...pick);
    }
    for (const b of bridges || []) for (const run of b.runs) { // up to a bridge from the beach or the valley floor, one each side, away from the wall
      const byTile = new Map();
      for (const [x, y] of run) { if (y < 760 + 120 || y > DH - 40 || ground(x, y) !== 0) continue; const t = TILE(x, y); if (['A2', 'B2', 'C2'].includes(t)) continue; if (!byTile.has(t)) byTile.set(t, []); byTile.get(t).push([x, y]); }
      for (const [t, pts] of byTile) { const got = [];
        for (const side of [-1, 1]) { const cands = pts.filter(([x, y]) => clear(x + side * (HALF + RUN1), y, b.r) && clear(x + side * (HALF + 8), y, b.r)).sort((p, q) => (side < 0 ? p[1] - q[1] : q[1] - p[1]));
          const c0 = cands.find(([x, y]) => got.every((g) => g.nx !== side || Math.abs(g.head[1] - y) > 120)); if (c0) got.push({ tile: t, head: [c0[0] + side * HALF, c0[1]], foot: [c0[0] + side * (HALF + RUN1), c0[1]], nx: side, ny: 0 }); }
        out.push(...got); }
    }
    return out;
  }

  // ---------- drawing: the plan (terrain, streets, bridges, the circus) and two north–south sections
  const C = { valley: '#171d29', terrace: '#2b3548', grid: '#303b50', face: '#59626f', faceD: '#3e4652', road: '#262c37', kerb: '#4a5262', deck: '#c3ccd3', led: '#49d3ff', ink: '#e6f4ff', col: '#8a96a0',
    sand: '#5c5a57', sandD: '#4b4946', sandL: '#77746f', water: '#0f2a40', ripple: '#2f6b8f' };
  function pathD(pts) { return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'); }
  function svgPlan(plan, res) {
    const s = [], face = Z1H * EXTW; // the cliff face, drawn as the art lifts a Z1 floor
    s.push(`<svg viewBox="-40 -40 ${DW + 80} ${DH + 80}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${plan.name} plan"><defs><clipPath id="vclip"><rect x="0" y="0" width="${DW}" height="${DH}"/></clipPath>`);
    s.push(`<pattern id="vterr" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill="${C.terrace}"/><path d="M0 0H64M0 0V64" stroke="${C.grid}" stroke-width="3"/></pattern>`);
    s.push(`<pattern id="vsand" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${C.sand}"/><circle cx="8" cy="10" r="2.5" fill="${C.sandD}"/><circle cx="28" cy="30" r="2" fill="${C.sandD}"/><circle cx="31" cy="7" r="1.6" fill="${C.sandL}"/></pattern>`);
    s.push(`<pattern id="vriver" width="160" height="60" patternUnits="userSpaceOnUse"><rect width="160" height="60" fill="${C.water}"/><path d="M10 20h40M90 44h50M60 8h20" stroke="${C.ripple}" stroke-width="4" stroke-linecap="round"/></pattern>`);
    for (const cv of COVES) { const up = cv.z1 < cv.z0; s.push(`<linearGradient id="g-${cv.z0}" x1="0" y1="${up ? 1 : 0}" x2="0" y2="${up ? 0 : 1}" gradientUnits="objectBoundingBox"><stop offset="0" stop-color="${C.valley}"/><stop offset="1" stop-color="${C.terrace}"/></linearGradient>`); }
    s.push(`</defs><g clip-path="url(#vclip)"><rect x="0" y="0" width="${DW}" height="${DH}" fill="${C.valley}"/>`);
    s.push(`<path d="M-200 ${BEACH}L2600 ${BEACH}L${SHORE.slice().reverse().map((p) => p[0] + ' ' + p[1]).join('L')}Z" fill="url(#vsand)"/>`); // the beach: pale stone, never yellow (Edit 37)
    s.push(`<path d="${pathD(RIVER_POLY)}Z" fill="url(#vriver)"/>`);
    for (let i = 1; i < SHORE.length; i++) { const [ax, ay] = SHORE[i - 1], [bx, by] = SHORE[i], h = -RIVER * face; s.push(`<path d="M${ax} ${ay}L${bx} ${by}L${bx} ${by + h}L${ax} ${ay + h}Z" fill="${C.face}"/>`); for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x += 24) { const y = ay + (by - ay) * (x - ax) / (bx - ax); s.push(`<path d="M${x} ${y}L${x} ${y + h}" stroke="${C.faceD}" stroke-width="3"/>`); } } // the seawall: a drop to the river
    s.push(`<path d="${pathD(NORTH_POLY)}Z" fill="url(#vterr)"/>`);
    for (const cv of COVES) s.push(`<path d="${pathD(cv.poly)}Z" fill="url(#g-${cv.z0})"/>`);
    // cliff faces: below every terrace edge that faces south (the north hill); a lip on the south hill's edge
    for (let i = 1; i < NORTH.length; i++) { const [ax, ay] = NORTH[i - 1], [bx, by] = NORTH[i]; if (ax === bx) { const xx = ax, y0 = Math.min(ay, by), y1 = Math.max(ay, by); s.push(`<path d="M${xx} ${y0}L${xx} ${y1}" stroke="${C.faceD}" stroke-width="10"/>`); continue; }
      const cv = COVES[0], h = (x, y) => (inPoly(cv.poly, x, y + 4) ? (1 - ramp(cv, y + 4)) : 1) * face;
      s.push(`<path d="M${ax} ${ay}L${bx} ${by}L${bx} ${by + h(bx, by)}L${ax} ${ay + h(ax, ay)}Z" fill="${C.face}"/>`);
      for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x += 24) { const y = ay + (by - ay) * (x - ax) / (bx - ax); s.push(`<path d="M${x} ${y}L${x} ${y + h(x, y)}" stroke="${C.faceD}" stroke-width="3"/>`); } }
    for (const cv of COVES) { const [l, r] = [cv.poly[2][0], cv.poly[3][0]]; const y0 = Math.min(cv.poly[1][1], cv.poly[2][1]), y1 = Math.max(cv.poly[1][1], cv.poly[2][1]); for (const xx of [l, r]) s.push(`<path d="M${xx} ${y0}L${xx} ${y1}" stroke="${C.face}" stroke-width="12"/>`); }
    // streets (at grade on whatever ground), then the raised runs as decks on columns
    for (const r of plan.roads) s.push(`<path d="${pathD(r.pts)}" fill="none" stroke="${C.kerb}" stroke-width="${2 * OUTER}"/>`);
    s.push(`<circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${C.kerb}" stroke-width="${2 * OUTER}"/>`);
    for (const r of plan.roads) s.push(`<path d="${pathD(r.pts)}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/>`);
    s.push(`<circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 4}" fill="#6b7480" stroke="#9aa6af" stroke-width="6"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 30}" fill="#2f5d3a"/>`);
    for (const r of plan.roads) s.push(`<path d="${pathD(r.pts)}" fill="none" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="4" stroke-dasharray="24 24"/>`);
    const z1 = plan.roads.filter((q) => q.z(q.pts[0][0], q.pts[0][1]) >= 1 && q.z(q.pts[q.pts.length - 1][0], q.pts[q.pts.length - 1][1]) >= 1);
    for (const r of z1) s.push(`<path d="${pathD(r.pts)}" fill="none" stroke="${C.led}" stroke-opacity="0.8" stroke-width="${2 * LW + 10}"/><path d="${pathD(r.pts)}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/><path d="${pathD(r.pts)}" fill="none" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="4" stroke-dasharray="24 24"/>`); // Z1 streets: a thin LED edge
    for (const r of plan.roads) { const [a, b] = [r.z(r.pts[0][0], r.pts[0][1]), r.z(r.pts[r.pts.length - 1][0], r.pts[r.pts.length - 1][1])]; if (Math.round(a) === Math.round(b)) continue;
      for (const p of dense(r.pts, 60).slice(1, -1)) { const g = ground(p[0], p[1]); if (g <= 0.02 || g >= 0.98) continue; const up = r.z(p[0], p[1] - 1) > r.z(p[0], p[1]) ? -1 : 1; s.push(`<path d="M${p[0] - 22} ${p[1] - up * 10}L${p[0]} ${p[1] + up * 12}L${p[0] + 22} ${p[1] - up * 10}" fill="none" stroke="${C.ink}" stroke-width="7"/>`); } }
    for (const b of res.bridges) for (const run of b.runs) {
      s.push(`<g transform="translate(${0.55 * face} ${0.8 * face})" opacity="0.4"><path d="${pathD(run)}" fill="none" stroke="#000" stroke-width="${2 * HALF}"/></g>`);
      const dx = run[run.length - 1][0] - run[0][0], dy = run[run.length - 1][1] - run[0][1], l = hyp(dx, dy), tx = dx / l, ty = dy / l;
      s.push(`<path d="${pathD(run)}" fill="none" stroke="#3a4350" stroke-width="${2 * HALF}" stroke-opacity="0.92"/><path d="${pathD(run)}" fill="none" stroke="${C.led}" stroke-width="${2 * HALF - 10}" stroke-opacity="0.92"/><path d="${pathD(run)}" fill="none" stroke="${C.deck}" stroke-width="${2 * HALF - 22}" stroke-opacity="0.92"/><path d="${pathD(run)}" fill="none" stroke="#9aa6af" stroke-width="4" stroke-dasharray="30 26"/>`);
      for (const sd of [-1, 1]) s.push(`<path d="M${run[0][0] - ty * sd * HALF} ${run[0][1] + tx * sd * HALF}L${run[run.length - 1][0] - ty * sd * HALF} ${run[run.length - 1][1] + tx * sd * HALF}" stroke="#0c1018" stroke-width="3"/>`);
      for (let d = SPAN / 4; d < l; d += SPAN / 2) { const x = run[0][0] + tx * d, y = run[0][1] + ty * d; if (plan.roads.some((q) => q !== b.r && distToPoly(q.pts, x, y) < OUTER + COL)) continue; for (const sd of [-1, 1]) s.push(`<rect x="${x - ty * sd * (HALF - 12) - COL / 2}" y="${y + tx * sd * (HALF - 12) - COL / 2}" width="${COL}" height="${COL}" fill="none" stroke="#0c1018" stroke-width="4" stroke-dasharray="6 4"/>`); } // columns under the deck, dashed as hidden
    }
    for (const k of res.river) s.push(`<circle cx="${k.x}" cy="${k.y}" r="24" fill="${C.ripple}" stroke="#ffffff" stroke-width="4"/><path d="M${k.x - 10} ${k.y - 7}L${k.x + 10} ${k.y - 7}L${k.x} ${k.y + 10}Z" fill="#ffffff"/>`);
    for (const e of res.esc) { const a = Math.atan2(e.ny, e.nx) * 180 / Math.PI, len = hyp(e.foot[0] - e.head[0], e.foot[1] - e.head[1]); s.push(`<g transform="translate(${e.head[0]} ${e.head[1]}) rotate(${a})"><rect x="0" y="-16" width="${len}" height="32" fill="${C.ink}" stroke="#0c1018" stroke-width="3"/>` + [0.3, 0.7].map((f) => `<path d="M${len * f} -10L${len * f - 10} 0L${len * f} 10" fill="none" stroke="#0c1018" stroke-width="4"/>`).join('') + '</g>'); }
    for (const k of res.drops) s.push(`<circle cx="${k.x}" cy="${k.y}" r="24" fill="#ffffff" fill-opacity="0.92" stroke="#0c1018" stroke-width="4"/><path d="M${k.x - 10} ${k.y - 7}L${k.x + 10} ${k.y - 7}L${k.x} ${k.y + 10}Z" fill="#0c1018"/>`);
    for (const t of plan.tees) s.push(`<circle cx="${t[0]}" cy="${t[1]}" r="10" fill="${C.ink}"/>`);
    s.push('</g>');
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * W}" y1="0" x2="${i * W}" y2="${DH}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="4"/><line x1="0" y1="${i * H}" x2="${DW}" y2="${i * H}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="4"/>`);
    s.push(`<rect x="0" y="0" width="${DW}" height="${DH}" fill="none" stroke="${C.ink}" stroke-opacity="0.55" stroke-width="6"/>`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.push(`<rect x="${c * W + 18}" y="${r * H + 18}" width="74" height="50" rx="8" fill="#0c1018" fill-opacity="0.8"/><text x="${c * W + 55}" y="${r * H + 55}" text-anchor="middle" font-size="34" font-weight="700" fill="${C.ink}" font-family="system-ui">${'ABC'[c]}${r + 1}</text>`);
    for (const [txt, x, y] of [['NORTH HILL · Z1', 2370, 120], ['VALLEY · Z0', 2370, 880], ['BEACH · Z0', 2370, 1240], ['RIVER', 2370, 1880]]) s.push(`<text x="${x}" y="${y}" text-anchor="end" font-size="40" font-weight="700" fill="${C.ink}" fill-opacity="0.75" font-family="system-ui" letter-spacing="4">${txt}</text>`);
    s.push(`<path d="M-36 ${H + H / 2 - 30}L4 ${H + H / 2}L-36 ${H + H / 2 + 30}Z" fill="#57e389"/>`);
    s.push('</svg>');
    return s.join('');
  }
  // a north–south section at x: ground, the roads crossing the cut, bridges on columns; heights × 3 so they read
  function svgSection(plan, x, label) {
    const VX = 2, top = 120, base = top + Z1H * VX + 60, sy = (z) => base - z * Z1H * VX, bot = sy(RIVER - 0.45), s = [];
    const prof = []; for (let y = 0; y <= DH; y += 8) prof.push([y, ground(x, y)]);
    s.push(`<svg viewBox="-40 0 ${DH + 80} ${bot + 70}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Section ${label}">`);
    s.push(`<rect x="-40" y="0" width="${DH + 80}" height="${bot + 70}" fill="#10141c"/>`);
    s.push(`<path d="M0 ${bot}` + prof.map(([y, z]) => `L${y} ${sy(z === RIVER ? RIVER - 0.4 : z)}`).join('') + `L${DH} ${bot}Z" fill="${C.terrace}" stroke="${C.face}" stroke-width="4"/>`);
    const wet = prof.filter(([, z]) => z === RIVER); if (wet.length) s.push(`<rect x="${wet[0][0]}" y="${sy(RIVER)}" width="${DH - wet[0][0]}" height="${sy(RIVER - 0.4) - sy(RIVER)}" fill="${C.water}" stroke="${C.ripple}" stroke-width="3"/>`);
    const sand = prof.filter(([y, z]) => z === 0 && y >= BEACH); if (sand.length) s.push(`<path d="M${sand[0][0]} ${sy(0)}L${sand[sand.length - 1][0]} ${sy(0)}" stroke="${C.sandL}" stroke-width="10"/>`);
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * H}" y1="20" x2="${i * H}" y2="${bot}" stroke="${C.ink}" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="10 10"/>`);
    for (let r = 0; r < 3; r++) s.push(`<text x="${r * H + H / 2}" y="${bot + 40}" text-anchor="middle" font-size="26" fill="${C.ink}" fill-opacity="0.7" font-family="system-ui">row ${r + 1}</text>`);
    for (const r of plan.roads) {
      const along = r.pts.every((p) => Math.abs(p[0] - x) < 1); // a road running in the cut
      if (along) { const pts = dense(r.pts, 8).filter((p) => p[1] >= 0 && p[1] <= DH).sort((a, b) => a[1] - b[1]); const raisedPts = pts.filter(([px, py]) => r.z(px, py) - ground(px, py) > 0.25);
        s.push(`<path d="M${pts.map(([px, py]) => py + ' ' + (sy(r.z(px, py)) - 6)).join('L')}" fill="none" stroke="${C.ink}" stroke-width="8"/>`);
        if (raisedPts.length) { const y0 = raisedPts[0][1], y1 = raisedPts[raisedPts.length - 1][1]; s.push(`<rect x="${y0}" y="${sy(1) - 2}" width="${y1 - y0}" height="16" fill="${C.deck}" stroke="${C.led}" stroke-width="3"/>`); for (let y = y0 + 40; y < y1 - 20; y += 80) { if (plan.roads.some((q) => q !== r && distToPoly(q.pts, x, y) < OUTER + COL)) continue; const g = ground(x, y), foot = g === RIVER ? RIVER - 0.4 : g; s.push(`<rect x="${y - 8}" y="${sy(1) + 14}" width="16" height="${sy(foot) - sy(1) - 14}" fill="${C.col}"/>`); } }
        const mid = pts[Math.floor(pts.length / 2)]; s.push(`<text x="${mid[1]}" y="${top - 40}" text-anchor="middle" font-size="26" fill="${C.ink}" fill-opacity="0.85" font-family="system-ui">${r.id} (in the cut)</text>`);
      } else for (let i = 1; i < r.pts.length; i++) { const k = segX(r.pts[i - 1], r.pts[i], [x, -1e4], [x, 1e4]); if (!k || k.y < 0 || k.y > DH) continue; const z = r.z(k.x, k.y);
        s.push(`<rect x="${k.y - OUTER}" y="${sy(z) - 14}" width="${2 * OUTER}" height="14" fill="${C.road}" stroke="${C.ink}" stroke-width="3"/><text x="${k.y}" y="${sy(z) - 26}" text-anchor="middle" font-size="24" fill="${C.ink}" font-family="system-ui">${r.id}</text>`); }
    }
    if (Math.abs(plan.ring[0] - x) < 1) s.push(`<rect x="${plan.ring[1] - RS - OUTER}" y="${sy(0) - 20}" width="${2 * (RS + OUTER)}" height="20" fill="${C.road}" stroke="#57e389" stroke-width="4"/><text x="${plan.ring[1]}" y="${sy(0) + 40}" text-anchor="middle" font-size="28" font-weight="700" fill="#57e389" font-family="system-ui">the circus</text>`);
    s.push(`<text x="0" y="36" font-size="30" font-weight="700" fill="${C.ink}" font-family="system-ui">${label}</text><text x="${DH}" y="40" text-anchor="end" font-size="24" fill="${C.ink}" fill-opacity="0.6" font-family="system-ui">north ← → south · heights × ${VX}</text>`);
    s.push(`<text x="${DH - 20}" y="${sy(RIVER) + 34}" text-anchor="end" font-size="24" fill="${C.ink}" fill-opacity="0.75" font-family="system-ui">river</text>`);
    s.push('</svg>');
    return s.join('');
  }

  const api = { PLAN, check, svgPlan, svgSection, ground, surface, NORTH, SHORE, COVES, RIVER };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CIRCUS_VALLEY = api;
})(typeof window !== 'undefined' ? window : globalThis);
