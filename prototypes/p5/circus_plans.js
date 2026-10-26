// Edit 57 (options only): three Circus layouts as plans, with the level rules checked. Not the game, not the mock-up yet.
// District coordinates: 2400 × 1920, 3 × 3 tiles of 800 × 640. Every statistic is a registry value (sim.js REG).
(function (root) {
  const X = root.DUMMIES || require('./sim.js'), P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), hyp = Math.hypot;
  const W = P['world.width'], H = P['world.height'], DW = 3 * W, DH = 3 * H, HALF = P['world.deckWidth'] / 2, LW = P['world.laneWidth'];
  const OUTER = LW + P['proto.shoulderWidth'], RS = P['world.roundaboutRadiusStreet'], RD = P['world.deckRingRadius'], RB = P['vehicles.bus.minRadius'];
  const RW = P['world.turnRadiusWide'], R96 = P['world.roundaboutEntryRadius'], ZONE = P['world.junctionZone'];
  const fil = (pts, r) => X.filletAny(pts, r, 0);
  const TILE = (x, y) => 'ABC'[Math.min(2, Math.max(0, Math.floor(x / W)))] + (Math.min(2, Math.max(0, Math.floor(y / H))) + 1);
  const cross = (cx, cy) => [{ id: 'west', pts: [[-200, cy], [cx, cy]] }, { id: 'north', pts: [[cx, cy], [cx, -200]] }, { id: 'east', pts: [[cx, cy], [DW + 200, cy]] }, { id: 'south', pts: [[cx, cy], [cx, DH + 200]] }];

  // ---------- the plans
  const TODAY = { key: 'today', name: 'Today (Edit 56)', short: 'Today',
    idea: 'An octagon of streets round the circus. One Z1 highway along row 3 meets nothing.',
    roads: [{ id: 'octagon', loop: true, pts: fil([[800, 480], [560, 480], [480, 560], [480, 1360], [560, 1440], [1840, 1440], [1920, 1360], [1920, 560], [1840, 480], [800, 480]], R96) },
      { id: 'west', pts: [[-200, 960], [1200, 960]] }, { id: 'north', pts: [[1200, 480], [1200, 960]] }, { id: 'east', pts: [[1200, 960], [2600, 960]] }, { id: 'south', pts: [[1200, 960], [1200, 1440]] }],
    rings: [[1200, 960], [480, 960], [1920, 960]], tees: [[1200, 480], [1200, 1440]],
    decks: [{ id: 'row 3', z: 1, pts: [[-200, 1680], [2600, 1680]] }],
    tiles: { A1: ['Octagon corner; roadworks', 'Ziggurat'], B1: ['T junction', 'Twin towers'], C1: ['Octagon corner; puddles', 'Ziggurat'], A2: ['Start; street ring', 'LED billboard wall'], B2: ['The circus', 'Plinth and lit slab'], C2: ['Street ring; exit east', 'Crown tower'], A3: ['Octagon corner under the highway', 'Finned slab'], B3: ['T junction', 'Arcade on pilotis'], C3: ['Octagon corner; coned lane', 'Twin slabs'] } };

  const A = { key: 'A', name: 'A · Diamond', short: 'Diamond',
    idea: 'Two 45° chevrons round the circus: Z1 opening south, Z2 opening north. They cross at A2 and C2, closing a diamond. Two outer streets jog 45° to pass under the chevrons in every corner screen.',
    roads: [{ id: 'west', pts: [[-200, 960], [1200, 960]] }, { id: 'east', pts: [[1200, 960], [2600, 960]] }, { id: 'north', pts: [[1200, 960], [1200, 160]] }, { id: 'south', pts: [[1200, 960], [1200, 1760]] },
      { id: 'top street', pts: fil([[-200, 480], [600, 480], [920, 160], [1480, 160], [1800, 480], [2600, 480]], R96) }, { id: 'bottom street', pts: fil([[-200, 1440], [600, 1440], [920, 1760], [1480, 1760], [1800, 1440], [2600, 1440]], R96) }],
    rings: [[1200, 960]], tees: [[1200, 160], [1200, 1760]],
    decks: [{ id: 'Z1 chevron', z: 1, pts: fil([[-200, 1800], [1200, 400], [2600, 1800]], RW) }, { id: 'Z2 chevron', z: 2, pts: fil([[-200, 120], [1200, 1520], [2600, 120]], RW) }],
    tiles: {
      A1: ['The top street passes under the Z2 chevron at 45°: the long drop', 'Ziggurat stepping toward the diagonal'],
      B1: ['The north street passes under the Z1 apex at 90°, then gives way at a T. The top street jogs 45° either side', 'Twin towers flanking the apex'],
      C1: ['The top street passes under the Z2 chevron and leaves east. A roof plaza opens off the parapet', 'Finned slab and its roof plaza'],
      A2: ['Start, west edge. The street passes under the Z1 × Z2 crossing: three levels at one point', 'LED billboard wall facing the entry'],
      B2: ['The circus. Four highway corners frame it overhead', 'Plinth and lit slab'],
      C2: ['The second crossing: drop from Z2 onto Z1 traffic, or from Z1 onto the street', 'Cantilevered crown tower'],
      A3: ['The bottom street passes under the Z1 chevron at 45°', 'Arcade on pilotis'],
      B3: ['The south street passes under the Z2 apex, then gives way at a T', 'Stepped concrete terraces'],
      C3: ['The bottom street passes under the Z1 chevron and leaves east', 'Twin slabs cut to the diagonal'] },
    pros: ['Answers the brief directly: a 45° diamond of highways round the centre.', 'Every screen has a street and a highway.', '45° throughout: chevrons, crossings and street jogs.', 'Ten drop points; two three-level crossings (A2, C2).', 'Z2 gives the district a second level, as in Monument.'],
    cons: ['B2\'s four corners carry deck: the centre screen is busy.', 'Two T junctions off-centre (B1 and B3, local y 160 and 480).', 'Diagonal escalators are new art.', 'Most to build: two Z levels, every screen layered.'] };

  const B = { key: 'B', name: 'B · Crown', short: 'Crown',
    idea: 'A Z1 crown over the north: vertical legs, 45° shoulders, a flat top. A Z2 bar across row 3 passes over both legs. Two cross streets give every tile a road.',
    roads: [{ id: 'west', pts: [[-200, 960], [1200, 960]] }, { id: 'east', pts: [[1200, 960], [2600, 960]] }, { id: 'north', pts: [[1200, 960], [1200, 160]] }, { id: 'south', pts: [[1200, 960], [1200, 1760]] },
      { id: 'row 1', pts: [[-200, 160], [2600, 160]] }, { id: 'row 3', pts: [[-200, 1760], [2600, 1760]] }],
    rings: [[1200, 960]], tees: [[1200, 160], [1200, 1760]],
    decks: [{ id: 'Z1 crown', z: 1, pts: fil([[480, 2120], [480, 800], [920, 360], [1480, 360], [1920, 800], [1920, 2120]], RW) }, { id: 'Z2 bar', z: 2, pts: [[-200, 1560], [2600, 1560]] }],
    tiles: {
      A1: ['T-street along the top; the crown\'s shoulder crosses the corner at 45°', 'Ziggurat'],
      B1: ['The north street passes under the crown\'s flat top, then gives way at a T', 'Twin towers and their skybridge to the crown'],
      C1: ['The top street leaves east; the crown\'s shoulder at 45°', 'Finned slab'],
      A2: ['Start, west edge. The street passes under the crown\'s west leg', 'LED billboard wall'],
      B2: ['The circus, open to the sky', 'Plinth and lit slab'],
      C2: ['The street passes under the crown\'s east leg; exit east', 'Cantilevered crown tower'],
      A3: ['The Z2 bar crosses over the Z1 leg; the bottom street runs under both', 'Arcade on pilotis'],
      B3: ['The south street passes under the Z2 bar, then gives way at a T', 'Stepped terraces'],
      C3: ['The second stack; the bottom street leaves east', 'Twin slabs'] },
    pros: ['Every tile has a street and a highway.', 'Every highway crossing is square (90°).', 'B2 stays clear: the circus reads alone.', 'Two stacks (A3, C3) and four drop points.'],
    cons: ['Less 45° than A: two shoulders only.', 'Two T junctions off the centre (B1 and B3, local y 160 and 480).', 'The Z2 bar is straight, as the highway it replaces.'] };

  const C = { key: 'C', name: 'C · Twin rings', short: 'Twin rings',
    idea: 'Two Z1 highway roundabouts at opposite corners (A1, C3), joined round the circus by a loop with 45° corners. Three rings: two raised, one on the street.',
    roads: cross(1200, 960), rings: [[1200, 960]], tees: [],
    deckRings: [[400, 360], [2000, 1560]],
    decks: [{ id: 'Z1 loop north', z: 1, pts: fil([[400, 360], [1760, 360], [2000, 600], [2000, 1560]], RW) }, { id: 'Z1 loop south', z: 1, pts: fil([[400, 360], [400, 1320], [640, 1560], [2000, 1560]], RW) },
      { id: 'Z1 west', z: 1, pts: [[-200, 360], [400, 360]] }, { id: 'Z1 north', z: 1, pts: [[400, -200], [400, 360]] }, { id: 'Z1 east', z: 1, pts: [[2000, 1560], [2600, 1560]] }, { id: 'Z1 south', z: 1, pts: [[2000, 1560], [2000, 2120]] }],
    tiles: {
      A1: ['A Z1 highway roundabout: give way to the ring; orbit lane', 'Fountain court under the ring'],
      B1: ['The north street passes under the loop at 90°', 'Twin towers'],
      C1: ['The loop turns two 45° corners; escalators', 'Ziggurat stepping toward the diagonal'],
      A2: ['Start, west edge. The street passes under the loop', 'LED billboard wall'],
      B2: ['The circus, open to the sky', 'Plinth and lit slab'],
      C2: ['The east street passes under the loop; exit east', 'Cantilevered crown tower'],
      A3: ['The loop turns two 45° corners; escalators', 'Arcade on pilotis'],
      B3: ['The south street passes under the loop at 90°', 'Stepped terraces'],
      C3: ['The second Z1 roundabout', 'Fountain court under the ring'] },
    pros: ['Three rings: the most circling.', 'Every crossing is square; B2 stays clear.', 'Highway roundabouts are already in the kit (Parkland B2).'],
    cons: ['One level only (Z1): no stacks.', 'A rounded square: close to today\'s octagon in plan.', 'Rings carry no buses, so no buses on its highways.', 'Corner screens C1 and A3 have no street.'] };

  const PLANS = [TODAY, A, B, C];

  // ---------- geometry
  function segX(a, b, c, d) { // intersection of segments ab and cd, or null
    const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(den) < 1e-9) return null;
    const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? { x: a[0] + r[0] * t, y: a[1] + r[1] * t, r, s } : null;
  }
  const angle = (r, s) => { const a = Math.abs(Math.atan2(r[0] * s[1] - r[1] * s[0], r[0] * s[0] + r[1] * s[1])) * 180 / Math.PI; return Math.min(a, 180 - a); };
  function crossings(p, q) { const out = []; for (let i = 1; i < p.length; i++) for (let j = 1; j < q.length; j++) { const k = segX(p[i - 1], p[i], q[j - 1], q[j]); if (k) out.push({ x: k.x, y: k.y, ang: angle(k.r, k.s) }); } return out; }
  function distToPoly(pts, x, y) { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)); d = Math.min(d, hyp(ax + dx * t - x, ay + dy * t - y)); } return d; }
  function minRadius(pts) { // smallest radius of the fillets (three points on an arc), straight runs ignored
    let r = Infinity; for (let i = 1; i + 1 < pts.length; i++) { const [a, b, c] = [pts[i - 1], pts[i], pts[i + 1]], ab = hyp(b[0] - a[0], b[1] - a[1]), bc = hyp(c[0] - b[0], c[1] - b[1]), ca = hyp(a[0] - c[0], a[1] - c[1]), cr = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])); if (cr > 1e-6 && ab < 60 && bc < 60) r = Math.min(r, ab * bc * ca / (2 * cr)); } return r; }
  // where a polyline crosses the tile seams, and how near a tile corner
  function seams(pts) {
    const out = [];
    const lines = [[[W, -1e4], [W, 1e4]], [[2 * W, -1e4], [2 * W, 1e4]], [[-1e4, H], [1e4, H]], [[-1e4, 2 * H], [1e4, 2 * H]], [[0, -1e4], [0, 1e4]], [[DW, -1e4], [DW, 1e4]], [[-1e4, 0], [1e4, 0]], [[-1e4, DH], [1e4, DH]]];
    for (const [a, b] of lines) for (const k of crossings(pts, [a, b])) {
      if (k.x < -1 || k.y < -1 || k.x > DW + 1 || k.y > DH + 1) continue;
      const vert = a[0] === b[0], along = vert ? k.y : k.x, span = vert ? H : W, off = ((along % span) + span) % span;
      out.push({ x: k.x, y: k.y, off, corner: Math.min(off, span - off), outer: k.x <= 1 || k.y <= 1 || k.x >= DW - 1 || k.y >= DH - 1 });
    }
    return out;
  }
  function clipBox(pts, x0, y0, x1, y1) { // the polyline cut to a box: its runs inside (Liang–Barsky per segment)
    const runs = []; let cur = null;
    for (let i = 1; i < pts.length; i++) {
      const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay; let t0 = 0, t1 = 1, ok = true;
      for (const [p, q] of [[-dx, ax - x0], [dx, x1 - ax], [-dy, ay - y0], [dy, y1 - ay]]) { if (Math.abs(p) < 1e-12) { if (q < 0) ok = false; continue; } const r = q / p; if (p < 0) t0 = Math.max(t0, r); else t1 = Math.min(t1, r); }
      if (!ok || t0 > t1) { cur = null; continue; }
      const A = [ax + dx * t0, ay + dy * t0], Bp = [ax + dx * t1, ay + dy * t1];
      if (cur && hyp(cur[cur.length - 1][0] - A[0], cur[cur.length - 1][1] - A[1]) < 1e-6) cur.push(Bp); else { cur = [A, Bp]; runs.push(cur); }
      if (t1 < 1) cur = null;
    }
    return runs;
  }
  function dense(pts, step) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.max(1, Math.ceil(hyp(bx - ax, by - ay) / (step || 8))); for (let k = 1; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]); } return out; }
  const clipOut = (pts, rings, r) => { const keep = [], runs = []; for (const p of dense(pts)) { const inR = rings.some(([cx, cy]) => hyp(p[0] - cx, p[1] - cy) < r); if (!inR) keep.push(p); else if (keep.length) { runs.push(keep.splice(0)); } } if (keep.length) runs.push(keep); return runs.filter((q) => q.length > 1); };
  const MIN_RUN = 320; // a deck seen for less than this on a screen (a corner clip) needs no escalators there

  // escalators: two per highway screen, on opposite sides, toward opposite ends; the foot on free ground
  function escalators(plan) {
    const out = [], deckRings = plan.deckRings || [];
    for (let row = 0; row < 3; row++) for (let col = 0; col < 3; col++) {
      const x0 = col * W, y0 = row * H, tileName = 'ABC'[col] + (row + 1);
      const runs = [];
      for (const d of plan.decks) for (const run0 of clipOut(d.pts, deckRings, RD + HALF)) for (const pts of clipBox(run0, x0, y0, x0 + W, y0 + H)) {
        let len = 0; for (let i = 1; i < pts.length; i++) len += hyp(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (len >= MIN_RUN) runs.push({ d, pts, len });
      }
      if (!runs.length) continue;
      runs.sort((a, b) => b.len - a.len);
      const cands = (run) => { const c = [];
        for (let f = 0.1; f <= 0.901; f += 0.05) for (const side of [-1, 1]) {
          let acc = 0, at = null;
          for (let i = 1; i < run.pts.length && !at; i++) { const [ax, ay] = run.pts[i - 1], [bx, by] = run.pts[i], l = hyp(bx - ax, by - ay); if (l > 0 && acc + l >= f * run.len) { const t = (f * run.len - acc) / l; at = { x: ax + (bx - ax) * t, y: ay + (by - ay) * t, tx: (bx - ax) / l, ty: (by - ay) / l }; } acc += l; }
          if (!at) continue;
          const z = run.d.z, rise = X.stairRun(P, 0, z), nx = -at.ty * side, ny = at.tx * side, head = [at.x + nx * HALF, at.y + ny * HALF], foot = [at.x + nx * (HALF + rise), at.y + ny * (HALF + rise)];
          const pts2 = [0, 0.5, 1].map((u) => [head[0] + (foot[0] - head[0]) * u, head[1] + (foot[1] - head[1]) * u]);
          const clear = pts2.every(([fx, fy], k) => plan.roads.every((r) => distToPoly(r.pts, fx, fy) > OUTER + (k === 2 ? 24 : 8)) && plan.decks.every((d) => d === run.d || distToPoly(d.pts, fx, fy) > HALF + 16) &&
            (plan.rings || []).every(([cx, cy]) => hyp(fx - cx, fy - cy) > RS + OUTER + 16) && deckRings.every(([cx, cy]) => hyp(fx - cx, fy - cy) > RD + HALF + 16)) &&
            foot[0] > x0 + 24 && foot[0] < x0 + W - 24 && foot[1] > y0 + 24 && foot[1] < y0 + H - 24;
          if (clear) c.push({ tile: tileName, z, head, foot, nx, ny, f, side, at });
        }
        return c; };
      const stack = runs.length > 1 && runs.some((r) => r.d.z !== runs[0].d.z);
      if (stack) { // one escalator up to each level, on opposite sides of the crossing where possible
        const lv = [runs[0], runs.find((r) => r.d.z !== runs[0].d.z)], got = lv.map((r) => cands(r).sort((a, b) => Math.abs(a.f - 0.25) - Math.abs(b.f - 0.25)));
        got.forEach((g, i) => out.push(g[0] || { tile: tileName, z: lv[i].d.z, missing: true }));
      } else {
        const c = cands(runs[0]), tile = tileName; let best = null;
        for (const p of c) for (const q of c) { // opposite sides toward opposite ends; else one side, far apart
          const d = hyp(p.at.x - q.at.x, p.at.y - q.at.y), opp = p.side !== q.side;
          if (p === q || p.f > q.f || d < (opp ? 200 : X.stairRun(P, 0, 2))) continue; // one side: at least a Z2 flight apart
          const sc = (opp ? 0 : 10) + Math.abs(p.f - 0.3) + Math.abs(q.f - 0.7);
          if (!best || sc < best.sc) best = { sc, p, q, opp };
        }
        if (best) { out.push(best.p, best.q); if (!best.opp) best.q.sameSide = best.p.sameSide = true; }
        else out.push(c[0] || { tile, z: runs[0].d.z, missing: true }, { tile, z: runs[0].d.z, missing: true });
      }
    }
    return out;
  }

  // ---------- the checks (Edits 43, 52, 55.2, 56)
  function check(plan) {
    const rows = [], warn = (rule, ok, detail) => rows.push({ rule, ok, detail });
    const rings = plan.rings || [], deckRings = plan.deckRings || [], zq = (1 - ZONE) / 2;
    for (const [cx, cy] of rings) { const lx = cx % W, ly = cy % H, R = RS + OUTER;
      warn('Street ring inside its tile', lx - R >= 0 && lx + R <= W && ly - R >= 0 && ly + R <= H, TILE(cx, cy) + ' (' + lx + ', ' + ly + ')');
      warn('Street ring centre in the central ' + Math.round(ZONE * 100) + '%', lx >= W * zq && lx <= W * (1 - zq) && ly >= H * zq && ly <= H * (1 - zq), TILE(cx, cy)); }
    for (const [cx, cy] of deckRings) { const lx = cx % W, ly = cy % H, R = RD + HALF;
      warn('Highway ring inside its tile', lx - R >= 0 && lx + R <= W && ly - R >= 0 && ly + R <= H, TILE(cx, cy) + ' (' + lx + ', ' + ly + ')');
      warn('Highway ring centre in the central ' + Math.round(ZONE * 100) + '%', lx >= W * zq && lx <= W * (1 - zq) && ly >= H * zq && ly <= H * (1 - zq), TILE(cx, cy)); }
    for (const [x, y] of plan.tees || []) warn('T junction in the central ' + Math.round(ZONE * 100) + '%', x % W >= W * zq && x % W <= W * (1 - zq) && y % H >= H * zq && y % H <= H * (1 - zq), TILE(x, y) + ' (' + x % W + ', ' + y % H + ')');
    const drops = [], stacks = [];
    for (const d of plan.decks) {
      const runs = clipOut(d.pts, deckRings, RD + HALF);
      const r = minRadius(d.pts); warn('Highway bends ≥ ' + RB + ' (buses)', r >= RB - 1, d.id + ': ' + (r === Infinity ? 'straight' : 'R ' + Math.round(r)));
      for (const run of runs) for (const rd of plan.roads) for (const k of crossings(run, rd.pts)) {
        if (rings.some(([cx, cy]) => hyp(k.x - cx, k.y - cy) < RS + OUTER)) continue;
        if (drops.some((q) => hyp(q.x - k.x, q.y - k.y) < 8 && q.z === d.z)) continue;
        drops.push({ tile: TILE(k.x, k.y), x: k.x, y: k.y, z: d.z, ang: k.ang, over: rd.id, deck: d.id });
        warn('Deck over a street at 90° or 45°', Math.abs(k.ang - 90) < 1 || Math.abs(k.ang - 45) < 1, d.id + ' over ' + rd.id + ' in ' + TILE(k.x, k.y) + ': ' + Math.round(k.ang) + '°');
      }
      for (const [cx, cy] of rings) { const dd = distToPoly(d.pts, cx, cy); warn('No deck over the street ring', dd > RS + OUTER + HALF, d.id + ': ' + Math.round(dd - HALF - RS - OUTER) + ' clear'); }
      for (const s of seams(d.pts)) if (!s.outer) warn('Deck crosses a seam ≥ 160 from a tile corner', s.corner >= 160 - 1, d.id + ' at (' + Math.round(s.x) + ', ' + Math.round(s.y) + '): ' + Math.round(s.corner));
      for (const s of seams(d.pts)) if (s.outer) warn('Deck meets the district edge ≥ 160 from a corner', s.corner >= 160 - 1, d.id + ' at (' + Math.round(s.x) + ', ' + Math.round(s.y) + ')');
    }
    for (let i = 0; i < plan.decks.length; i++) for (let j = i + 1; j < plan.decks.length; j++) {
      const a = plan.decks[i], b = plan.decks[j];
      for (const k of crossings(a.pts, b.pts)) {
        if (deckRings.some(([cx, cy]) => hyp(k.x - cx, k.y - cy) < RD + HALF + 4)) continue; // arms meeting at their ring
        if (a.z === b.z) warn('Decks on one level meet only at a ring', false, a.id + ' × ' + b.id + ' in ' + TILE(k.x, k.y));
        else { stacks.push({ tile: TILE(k.x, k.y), x: k.x, y: k.y, ang: k.ang, three: plan.roads.some((r) => distToPoly(r.pts, k.x, k.y) < 4) }); warn('Z1 × Z2 crossing at 90° or 45°', Math.abs(k.ang - 90) < 1 || Math.abs(k.ang - 45) < 1, TILE(k.x, k.y) + ': ' + Math.round(k.ang) + '°'); }
      }
    }
    for (const r of plan.roads) for (const s of seams(r.pts)) if (!s.outer) warn('Street crosses a seam ≥ 160 from a tile corner', s.corner >= 160 - 1, r.id + ' at (' + Math.round(s.x) + ', ' + Math.round(s.y) + ')');
    const esc = escalators(plan), hwTiles = new Set(esc.map((e) => e.tile));
    for (const e of esc) if (e.missing) warn('Two escalators per highway screen', false, e.tile + ': no free foot');
    if (!esc.some((e) => e.missing)) warn('Two escalators per highway screen', true, hwTiles.size + ' screens, ' + esc.length + ' escalators');
    const tilesWithStreet = new Set(); for (const r of plan.roads) for (const p of r.pts) tilesWithStreet.add(TILE(Math.min(DW - 1, Math.max(0, p[0])), Math.min(DH - 1, Math.max(0, p[1]))));
    for (const r of plan.roads) for (let i = 1; i < r.pts.length; i++) for (let t = 0; t <= 1; t += 0.05) { const x = r.pts[i - 1][0] + (r.pts[i][0] - r.pts[i - 1][0]) * t, y = r.pts[i - 1][1] + (r.pts[i][1] - r.pts[i - 1][1]) * t; if (x >= 0 && y >= 0 && x < DW && y < DH) tilesWithStreet.add(TILE(x, y)); }
    const tilesWithDeck = new Set(); for (const d of plan.decks) for (let i = 1; i < d.pts.length; i++) for (let t = 0; t <= 1; t += 0.05) { const x = d.pts[i - 1][0] + (d.pts[i][0] - d.pts[i - 1][0]) * t, y = d.pts[i - 1][1] + (d.pts[i][1] - d.pts[i - 1][1]) * t; if (x >= 0 && y >= 0 && x < DW && y < DH) tilesWithDeck.add(TILE(x, y)); }
    for (const [cx, cy] of deckRings) tilesWithDeck.add(TILE(cx, cy));
    return { rows, drops, stacks, esc, tilesWithStreet, tilesWithDeck };
  }

  // ---------- the drawing (SVG, district units): streets, then Z1, then Z2, each deck with its shadow
  const SUN = [0.55, 0.8];
  function path(pts) { return 'M' + pts.map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L'); }
  function svg(plan, res) {
    const s = [], z = (k) => (k === 2 ? { led: '#ff5fd2', deck: '#dfe5ea', joint: '#b9c3ca', lift: 64 } : { led: '#49d3ff', deck: '#c3ccd3', joint: '#9aa6af', lift: 36 });
    s.push(`<svg viewBox="-40 -40 ${DW + 80} ${DH + 80}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${plan.name}">`);
    s.push(`<defs><clipPath id="clip-${plan.key}"><rect x="0" y="0" width="${DW}" height="${DH}"/></clipPath><pattern id="hatch-${plan.key}" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="#1b2230"/><path d="M0 16L16 0" stroke="#222b3b" stroke-width="2"/></pattern></defs>`);
    s.push(`<rect x="0" y="0" width="${DW}" height="${DH}" fill="url(#hatch-${plan.key})"/>`);
    s.push(`<g clip-path="url(#clip-${plan.key})">`);
    const street = (d) => `<path d="${d}" fill="none" stroke="#4a5262" stroke-width="${2 * OUTER}" stroke-linejoin="round"/>`;
    const tar = (d) => `<path d="${d}" fill="none" stroke="#252b36" stroke-width="${2 * LW}" stroke-linejoin="round"/>`;
    const dash = (d) => `<path d="${d}" fill="none" stroke="#e6f4ff" stroke-opacity="0.55" stroke-width="4" stroke-dasharray="24 24"/>`;
    const ringD = (cx, cy, r) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
    for (const r of plan.roads) s.push(street(path(r.pts)));
    for (const [cx, cy] of plan.rings || []) s.push(street(ringD(cx, cy, RS)));
    for (const r of plan.roads) s.push(tar(path(r.pts)));
    for (const [cx, cy] of plan.rings || []) { s.push(tar(ringD(cx, cy, RS))); s.push(`<circle cx="${cx}" cy="${cy}" r="${RS - LW - 4}" fill="#6b7480" stroke="#9aa6af" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${RS - LW - 30}" fill="#2f5d3a"/>`); }
    for (const r of plan.roads) s.push(dash(path(r.pts)));
    for (const [cx, cy] of plan.rings || []) s.push(`<circle cx="${cx}" cy="${cy}" r="${RS}" fill="none" stroke="#e6f4ff" stroke-opacity="0.45" stroke-width="4" stroke-dasharray="18 22"/>`);
    for (const lvl of [1, 2]) {
      const st = z(lvl), decks = plan.decks.filter((d) => d.z === lvl), rings = lvl === 1 ? plan.deckRings || [] : [];
      if (!decks.length && !rings.length) continue;
      const sh = `translate(${SUN[0] * st.lift} ${SUN[1] * st.lift})`;
      s.push(`<g transform="${sh}" opacity="0.38">` + decks.map((d) => `<path d="${path(d.pts)}" fill="none" stroke="#000" stroke-width="${2 * HALF}" stroke-linejoin="round"/>`).join('') + rings.map(([cx, cy]) => `<path d="${ringD(cx, cy, RD)}" fill="none" stroke="#000" stroke-width="${2 * HALF}"/>`).join('') + '</g>');
      const all = decks.map((d) => path(d.pts)).concat(rings.map(([cx, cy]) => ringD(cx, cy, RD)));
      for (const d of all) s.push(`<path d="${d}" fill="none" stroke="#3a4350" stroke-width="${2 * HALF}" stroke-linejoin="round"/>`);
      for (const d of all) s.push(`<path d="${d}" fill="none" stroke="${st.led}" stroke-width="${2 * HALF - 10}" stroke-linejoin="round"/>`);
      for (const d of all) s.push(`<path d="${d}" fill="none" stroke="${st.deck}" stroke-width="${2 * HALF - 22}" stroke-linejoin="round"/>`);
      for (const d of all) s.push(`<path d="${d}" fill="none" stroke="${st.joint}" stroke-width="4" stroke-dasharray="30 26"/>`);
      if (rings.length) for (const [cx, cy] of rings) s.push(`<circle cx="${cx}" cy="${cy}" r="${RD - HALF}" fill="#26324a" stroke="#3a4350" stroke-width="4"/><circle cx="${cx}" cy="${cy}" r="${RD - HALF - 26}" fill="#2b5d6a"/>`);
    }
    for (const e of res.esc) if (!e.missing) {
      const a = Math.atan2(e.ny, e.nx) * 180 / Math.PI, len = hyp(e.foot[0] - e.head[0], e.foot[1] - e.head[1]);
      s.push(`<g transform="translate(${e.head[0]} ${e.head[1]}) rotate(${a})"><rect x="0" y="-16" width="${len}" height="32" fill="#e6f4ff" stroke="#0c1018" stroke-width="3"/>` + [0.25, 0.5, 0.75].map((f) => `<path d="M${len * f} -10L${len * f - 10} 0L${len * f} 10" fill="none" stroke="#0c1018" stroke-width="4"/>`).join('') + '</g>');
    }
    for (const k of res.drops) s.push(`<circle cx="${k.x}" cy="${k.y}" r="22" fill="#ffffff" fill-opacity="0.9" stroke="#0c1018" stroke-width="4"/><path d="M${k.x - 9} ${k.y - 6}L${k.x + 9} ${k.y - 6}L${k.x} ${k.y + 9}Z" fill="#0c1018"/>`);
    for (const k of res.stacks) s.push(`<circle cx="${k.x}" cy="${k.y}" r="40" fill="#0c1018" fill-opacity="0.82" stroke="#ffffff" stroke-width="5"/><text x="${k.x}" y="${k.y + 12}" text-anchor="middle" font-size="34" font-weight="700" fill="#ffffff" font-family="system-ui">${k.three ? '3' : '2'}</text>`);
    s.push('</g>');
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * W}" y1="0" x2="${i * W}" y2="${DH}" stroke="#e6f4ff" stroke-opacity="0.35" stroke-width="4"/><line x1="0" y1="${i * H}" x2="${DW}" y2="${i * H}" stroke="#e6f4ff" stroke-opacity="0.35" stroke-width="4"/>`);
    s.push(`<rect x="0" y="0" width="${DW}" height="${DH}" fill="none" stroke="#e6f4ff" stroke-opacity="0.55" stroke-width="6"/>`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.push(`<rect x="${c * W + 18}" y="${r * H + 18}" width="74" height="50" rx="8" fill="#0c1018" fill-opacity="0.8"/><text x="${c * W + 55}" y="${r * H + 55}" text-anchor="middle" font-size="34" font-weight="700" fill="#e6f4ff" font-family="system-ui">${'ABC'[c]}${r + 1}</text>`);
    s.push(`<path d="M-36 ${H + H / 2 - 30}L4 ${H + H / 2}L-36 ${H + H / 2 + 30}Z" fill="#57e389"/>`); // start: A2, west edge
    s.push('</svg>');
    return s.join('');
  }

  const api = { PLANS, check, svg, escalators };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CIRCUS_PLANS = api;
})(typeof window !== 'undefined' ? window : globalThis);
