// Edits 58–60 (concept, plans only): Circus as a valley city by a river. Terrain sets the levels; roads keep theirs.
// Row 1 is a hill at Z1 (world.deckHeight), walled at the top edge by a mass of buildings. Row 2 falls from cliff to avenue
// to beach at Z0. Row 3 is the shore: a coastal drive on a seawall that runs parallel to it, the river below. Z1 roads are
// streets on the hill and bridges on columns over everything lower. No ramps (Edit 60, D35): the valley road leaves north
// through a tunnel; people climb the cove walls by stairs. Shadows: decision 309 (option 2, one mask per level).
// District units, 2400 × 1920.
(function (root) {
  const X = root.DUMMIES || require('./sim.js'), P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), hyp = Math.hypot;
  const W = P['world.width'], H = P['world.height'], DW = 3 * W, DH = 3 * H, HALF = P['world.deckWidth'] / 2, LW = P['world.laneWidth'];
  const OUTER = LW + P['proto.shoulderWidth'], RS = P['world.roundaboutRadiusStreet'], ZONE = P['world.junctionZone'], Z1H = P['world.deckHeight'];
  const SPAN = P['world.deckPillarSpacing'], COL = P['world.deckColumn'], RUN1 = X.stairRun(P, 0, 1), EXTW = P['proto.art.extrusion'];
  const STOREY = P['world.storeyHeight'], SHADOW = P['proto.art.shadowScale'], WALK = P['world.walkwayWidth'], WCOL = P['world.walkwayColumn'], SWD = P['world.stairWidth'];
  const SUN = [-Math.SQRT1_2, Math.SQRT1_2]; // shadows fall to 7:30, as in the game
  const TILE = (x, y) => 'ABC'[Math.min(2, Math.max(0, Math.floor(x / W)))] + (Math.min(2, Math.max(0, Math.floor(y / H))) + 1);
  function dense(pts, step) { const out = [pts[0]]; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], n = Math.max(1, Math.ceil(hyp(bx - ax, by - ay) / (step || 8))); for (let k = 1; k <= n; k++) out.push([ax + (bx - ax) * k / n, ay + (by - ay) * k / n]); } return out; }

  // ---------- the terrain
  const NORTH = [[-200, 760], [880, 760], [1040, 600], [1040, 360], [1360, 360], [1360, 600], [1520, 760], [2600, 760]]; // the hill's edge, round the cove
  const COVE = [[880, 760], [1040, 600], [1040, 360], [1360, 360], [1360, 600], [1520, 760]]; // Edit 60: a level floor at Z0, walled on three sides
  const BEACH = 1120; // sand from here to the seawall
  const DRIVE = X.filletAny([[-200, 1440], [720, 1440], [880, 1600], [1520, 1600], [1680, 1440], [2600, 1440]], P['world.roundaboutEntryRadius'], 0); // H–45°–H–45°–H
  const SEAWALL = OUTER + WALK; // Edit 60: the seawall runs parallel to the drive; a promenade of world.walkwayWidth beyond the kerb
  const SHORE = X.offsetPts(dense(DRIVE, 8), SEAWALL);
  const RIVER = -0.5; // the water surface, half a level below the seawall (not a floor)
  const inPoly = (poly, x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const NORTH_POLY = [[-200, -200], [2600, -200]].concat(NORTH.slice().reverse());
  const RIVER_POLY = [[-200, 2120], [2600, 2120]].concat(SHORE.slice().reverse());
  const LAND_POLY = NORTH.concat(SHORE.slice().reverse());
  function ground(x, y) { // elevation in Z levels: 1 the hill; 0 the valley floor, cove and beach; RIVER the water
    if (inPoly(NORTH_POLY, x, y)) return 1;
    return inPoly(RIVER_POLY, x, y) ? RIVER : 0;
  }
  const surface = (x, y) => { const g = ground(x, y); return g === RIVER ? 'river' : g >= 1 ? 'hill' : inPoly(COVE, x, y) ? 'cove' : y >= BEACH ? 'beach' : 'town'; };

  // ---------- buildings (Edit 60): footprint [x, y, w, h], base level, storeys of world.storeyHeight. A portal spans a road;
  // the road passes under it at its own level, one storey clear. Towers on the edge wall stay in world.towerHeightMin–Max.
  const TYPES = {
    edge: { label: 'Edge wall', fill: '#465061', note: 'Podium and towers along the top edge. Impassable.' },
    block: { label: 'Hill block', fill: '#66707d', note: 'Mass on the hill between the roads.' },
    portal: { label: 'Portal block', fill: '#7a8591', note: 'Spans a road; the road passes under, one storey clear.' },
    cliff: { label: 'Cliff house', fill: '#717b86', note: 'Against the cliff. Doors at Z0 and Z1.' },
    pavilion: { label: 'Beach pavilion', fill: '#9aa4ad', note: 'On pilotis. A Z1 door takes a walkway.' },
    stilt: { label: 'River stilt house', fill: '#8b96a0', note: 'On stilts over the water. Roof at Z1.' },
    pier: { label: 'Pier tower', fill: '#566070', note: 'Stands in the river. A walkway joins it to the bridge.' } };
  const B = (type, rect, base, storeys, extra) => Object.assign({ type, rect, base, storeys }, extra || {});
  const BUILDINGS = [
    B('edge', [0, 0, 2400, 150], 1, 4, { towers: [[120, 0, 200, 110, 9], [560, 0, 200, 120, 10], [1400, 0, 190, 120, 10], [2120, 0, 200, 110, 9]] }),
    B('block', [40, 360, 220, 330], 1, 6), B('portal', [260, 410, 280, 130], 1, 4, { spans: 'West Bridge' }), B('block', [580, 360, 180, 300], 1, 7),
    B('block', [830, 370, 180, 200], 1, 5), B('portal', [1100, 150, 200, 200], 1, 4, { spans: 'North Ridge Road' }), B('block', [1390, 370, 180, 200], 1, 5),
    B('block', [1640, 360, 180, 300], 1, 7), B('portal', [1860, 410, 280, 130], 1, 4, { spans: 'East Bridge' }), B('block', [2140, 360, 220, 330], 1, 6),
    B('cliff', [560, 760, 200, 110], 0, 5), B('cliff', [1640, 760, 200, 110], 0, 5),
    B('pavilion', [560, 1130, 200, 130], 0, 4), B('pavilion', [1640, 1130, 200, 130], 0, 4),
    B('pavilion', [930, 1300, 140, 120], 0, 4), B('pavilion', [1330, 1300, 140, 120], 0, 4),
    B('stilt', [930, 1745, 140, 90], RIVER, 5), B('stilt', [1330, 1745, 140, 90], RIVER, 5),
    B('pier', [600, 1620, 120, 120], RIVER, 10), B('pier', [1680, 1620, 120, 120], RIVER, 10)];
  // overhead walkways at Z1 (world.walkwayWidth): roof or deck to roof
  const WALKWAYS = [
    { id: 'A2 walkway', pts: [[660, 870], [660, 1130]], from: 'cliff house', to: 'beach pavilion' },
    { id: 'C2 walkway', pts: [[1740, 870], [1740, 1130]], from: 'cliff house', to: 'beach pavilion' },
    { id: 'B3 west walkway', pts: [[1000, 1420], [1000, 1745]], from: 'beach pavilion', to: 'stilt house' },
    { id: 'B3 east walkway', pts: [[1400, 1420], [1400, 1745]], from: 'beach pavilion', to: 'stilt house' },
    { id: 'A3 walkway', pts: [[480, 1680], [600, 1680]], from: 'west bridge deck', to: 'pier tower' },
    { id: 'C3 walkway', pts: [[1920, 1680], [1800, 1680]], from: 'east bridge deck', to: 'pier tower' }];
  const COVE_STAIRS = [{ head: [1040, 480], foot: [1040 + RUN1, 480], side: 'west' }, { head: [1360, 480], foot: [1360 - RUN1, 480], side: 'east' }];
  const TUNNEL_MOUTH = [1200, 360];

  // ---------- the network: every road says where it goes and why
  const PLAN = { key: 'valley', name: 'Circus · Valley by the river',
    idea: 'A hill walled by buildings to the north; a river to the south. The circus sits on the valley floor. There the avenue meets the tunnel north and the road down to the river. The ridge road sends two bridges straight south, over the valley, the beach, the drive and the river.',
    roads: [
      { id: 'Valley Avenue', z: 0, pts: [[-200, 960], [2600, 960]], from: 'west edge', to: 'east edge, through the circus', why: 'The valley is the corridor between neighbouring valleys. The arterial follows it.' },
      { id: 'North Ridge Road', z: 1, pts: [[-200, 240], [2600, 240]], from: 'west edge', to: 'east edge', why: 'The upper town\'s main street, along the contour. Under a portal block in B1, over the tunnel.' },
      { id: 'West Bridge', z: 1, pts: [[400, 240], [400, 2120]], from: 'North Ridge Road', to: 'south edge, over the river', why: 'The hill\'s road to the far bank. Never comes down: under a portal block, then columns, then piers.' },
      { id: 'East Bridge', z: 1, pts: [[2000, 240], [2000, 2120]], from: 'North Ridge Road', to: 'south edge, over the river', why: 'The same, east of the circus. No road joins either bridge south of the hill.' },
      { id: 'North Tunnel', z: 0, pts: [[1200, 960], [1200, -200]], tunnel: TUNNEL_MOUTH[1], from: 'the circus', to: 'north edge, under the hill', why: 'The valley\'s way north. Up the level cove; into the hill at the cove head; under the ridge road and the edge wall.' },
      { id: 'Beach Road', z: 0, pts: [[1200, 960], [1200, 1600]], from: 'the circus', to: 'Coastal Drive', why: 'The circus\'s way down to the river, across the beach.' },
      { id: 'Coastal Drive', z: 0, pts: DRIVE, from: 'west edge', to: 'east edge', why: 'Follows the shore on the seawall. Inland under the bridges; out to the water before the circus.' }],
    ring: [1200, 960], tees: [[400, 240], [2000, 240], [1200, 1600]],
    buildings: BUILDINGS, walkways: WALKWAYS, coveStairs: COVE_STAIRS, mouth: TUNNEL_MOUTH,
    tiles: {
      A1: ['Upper town. The ridge road runs between the edge wall and hill blocks. The west bridge leaves at a T, under a portal block', 'Portal block over the bridge'],
      B1: ['The valley road enters the tunnel at the cove head, under the ridge road. Stairs climb both cove walls', 'Tunnel portal; the belvedere block over the ridge road'],
      C1: ['Upper town. The east bridge leaves at a T, under a portal block', 'Portal block over the bridge'],
      A2: ['Start, west edge. Cliff, avenue, beach. Bridge and walkway cross the avenue: two drops onto cars', 'Cliff house: doors at Z0 and Z1'],
      B2: ['The circus between the cove and the beach. Tunnel road north; beach road south', 'Plinth and lit slab'],
      C2: ['Cliff, avenue, beach. Bridge and walkway cross the avenue. Exit east', 'Cliff house and beach pavilion'],
      A3: ['The drive on the seawall. The west bridge crosses it and the river. A walkway joins a pier tower', 'Pier tower'],
      B3: ['The beach road meets the drive at a T. Two walkways cross the drive to stilt houses', 'River stilt houses; beach pavilions'],
      C3: ['The drive swings inland under the east bridge and leaves east. A walkway joins a pier tower', 'Pier tower'] } };

  // ---------- geometry helpers
  function distToPoly(pts, x, y) { let d = Infinity; for (let i = 1; i < pts.length; i++) { const [ax, ay] = pts[i - 1], [bx, by] = pts[i], dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / l2)); d = Math.min(d, hyp(ax + dx * t - x, ay + dy * t - y)); } return d; }
  const underground = (road, x, y) => road.tunnel != null && y < road.tunnel; // in the tunnel: Z0 inside the hill
  const openPts = (road) => (road.tunnel != null ? [road.pts[0], [road.pts[0][0], road.tunnel]] : road.pts); // the part in daylight
  function raised(road) { const runs = []; let cur = null; for (const p of dense(road.pts, 4)) { const up = road.z - ground(p[0], p[1]) > 0.25; if (up) { if (!cur) runs.push(cur = []); cur.push(p); } else cur = null; } return runs.filter((r) => r.length > 1); }
  function segX(a, b, c, d) { const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]], den = r[0] * s[1] - r[1] * s[0]; if (Math.abs(den) < 1e-9) return null; const t = ((c[0] - a[0]) * s[1] - (c[1] - a[1]) * s[0]) / den, u = ((c[0] - a[0]) * r[1] - (c[1] - a[1]) * r[0]) / den; return t >= 0 && t <= 1 && u >= 0 && u <= 1 ? { x: a[0] + r[0] * t, y: a[1] + r[1] * t, r, s } : null; }
  const ang = (r, s) => { const a = Math.abs(Math.atan2(r[0] * s[1] - r[1] * s[0], r[0] * s[0] + r[1] * s[1])) * 180 / Math.PI; return Math.min(a, 180 - a); };
  const rectPoly = ([x, y, w, h]) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
  const inRect = ([x, y, w, h], px, py, m) => px > x - (m || 0) && px < x + w + (m || 0) && py > y - (m || 0) && py < y + h + (m || 0);
  const baseZ = (b) => b.base * Z1H; // world height of the ground under a building
  const topZ = (b) => baseZ(b) + b.storeys * STOREY;
  const tile = (b) => TILE(b.rect[0] + b.rect[2] / 2, b.rect[1] + Math.min(b.rect[3] / 2, 8));

  // D37: a dummy in the river is lifted by a drone to the nearest land: ground at Z0 or Z1, off every lane and deck
  function rescue(plan, x, y) {
    const land = (px, py) => ground(px, py) !== RIVER && plan.roads.every((r) => distToPoly(openPts(r), px, py) > OUTER) && plan.buildings.every((b) => !inRect(b.rect, px, py, 4));
    for (let r = 4; r < 900; r += 4) for (let a = 0; a < 360; a += 3) { const px = x + r * Math.cos(a * Math.PI / 180), py = y + r * Math.sin(a * Math.PI / 180); if (land(px, py)) return { from: [x, y], to: [px, py], d: r, secs: r / P['proto.droneSpeed'] + P['proto.droneLiftSeconds'], surface: surface(px, py) }; }
    return null;
  }

  // ---------- the checks: the transport logic first, then the level rules (Edits 43–60)
  function check(plan) {
    const rows = [], add = (rule, ok, detail) => rows.push({ rule, ok, detail });
    const nodes = plan.tees.concat([plan.ring]), inside = (p) => p[0] > 0 && p[1] > 0 && p[0] < DW && p[1] < DH;
    for (const r of plan.roads) for (const e of [r.pts[0], r.pts[r.pts.length - 1]]) add('Every road goes somewhere (no dead ends)', !inside(e) || nodes.some((n) => hyp(n[0] - e[0], n[1] - e[1]) < 2), r.id + (inside(e) ? ' ends at ' + TILE(e[0], e[1]) : ' leaves the district'));
    add('No ramps: every road keeps one level (D35)', plan.roads.every((r) => r.z === 0 || r.z === 1), 'valley and hill roads meet beyond the district; people climb by stairs and escalators');
    add('The circus is a real junction', nodes.length === 4, 'avenue W, E; tunnel N; beach road S');
    for (const r of plan.roads) { const bad = dense(r.pts, 8).filter(([x, y]) => inside([x, y]) && r.z - ground(x, y) < -0.25 && !underground(r, x, y)); add('No road below the ground it crosses, except in a tunnel', bad.length === 0, r.id); }
    for (const r of plan.roads.filter((q) => q.tunnel != null)) { const x0 = r.pts[0][0];
      add('A tunnel runs at Z0 under the hill only; its mouth is in a cliff', dense(r.pts, 8).filter(([x, y]) => underground(r, x, y) && inside([x, y])).every(([x, y]) => ground(x, y) >= 1) && ground(x0, r.tunnel - 4) === 1 && ground(x0, r.tunnel + 4) === 0, r.id + ': mouth at ' + TILE(x0, r.tunnel + 4) + ' (' + x0 + ', ' + r.tunnel + ')'); }
    // bridges and walkways over streets: 90° or 45°; each crossing is a drop onto cars
    const drops = [], over = (id, pts, z) => { for (const q of plan.roads) { if (q.z >= z) continue; for (let i = 1; i < pts.length; i++) for (let j = 1; j < q.pts.length; j++) { const k = segX(pts[i - 1], pts[i], q.pts[j - 1], q.pts[j]); if (!k || underground(q, k.x, k.y) || drops.some((d) => hyp(d.x - k.x, d.y - k.y) < 8)) continue; const a = ang(k.r, k.s); drops.push({ tile: TILE(k.x, k.y), x: k.x, y: k.y, over: q.id, by: id, ang: a }); add('Bridges and walkways cross streets at 90° or 45°', Math.abs(a - 90) < 1 || Math.abs(a - 45) < 1, id + ' over ' + q.id + ' in ' + TILE(k.x, k.y) + ': ' + Math.round(a) + '°'); } } };
    const bridges = plan.roads.map((r) => ({ r, runs: raised(r) })).filter((b) => b.runs.length);
    for (const b of bridges) for (const run of b.runs) over(b.r.id, run, b.r.z);
    for (const w of plan.walkways) over(w.id, w.pts, 1);
    add('Columns only where the ground is lower (valley, beach, river)', bridges.every((b) => b.runs.every((run) => run.every(([x, y]) => ground(x, y) < 0.5))), bridges.map((b) => b.r.id + ' on columns for ' + b.runs.map((run) => Math.round(hyp(run[run.length - 1][0] - run[0][0], run[run.length - 1][1] - run[0][1]))).join(', ')).join('; '));
    const river = [], rescues = [];
    for (const b of bridges) for (const run of b.runs) { const w = run.filter(([x, y]) => ground(x, y) === RIVER && y < DH); if (w.length) { const k = { tile: TILE(w[0][0], w[0][1]), x: w[Math.floor(w.length / 2)][0], y: Math.min(DH - 60, w[Math.floor(w.length / 2)][1]), bridge: b.r.id }; river.push(k); rescues.push(Object.assign({ tile: k.tile, bridge: b.r.id }, rescue(plan, k.x, k.y))); } }
    for (const q of rescues) add('River rescue: a drone sets the dummy on the nearest land, never a lane or a deck (D37)', !!q.to && q.surface !== 'river', q.bridge + ' (' + q.tile + '): ' + Math.round(q.d) + ' to the seawall promenade (' + q.to.map(Math.round).join(', ') + '), ' + q.secs.toFixed(1) + ' s');
    add('Bridges run straight south over the river; no road joins them south of the hill', bridges.every((b) => b.r.pts.length === 2 && b.r.pts[0][0] === b.r.pts[1][0] && b.r.pts[1][1] > DH) && plan.tees.every((t) => !bridges.some((b) => Math.abs(b.r.pts[0][0] - t[0]) < 1 && t[1] > 760)), bridges.map((b) => b.r.id).join(', '));
    const gap = dense(DRIVE, 16).filter(([x]) => x > 0 && x < DW).map(([x, y]) => distToPoly(SHORE, x, y));
    add('The seawall runs parallel to the coastal drive', Math.max(...gap) - Math.min(...gap) < 6, 'kerb to wall ' + (SEAWALL - OUTER) + ' (world.walkwayWidth) all along (±' + ((Math.max(...gap) - Math.min(...gap)) / 2).toFixed(1) + ')');
    // junctions and the ring
    const zq = (1 - ZONE) / 2, inZone = ([x, y]) => x % W >= W * zq && x % W <= W * (1 - zq) && y % H >= H * zq && y % H <= H * (1 - zq);
    for (const t of plan.tees) add('T junction in the central ' + Math.round(ZONE * 100) + '%, on level ground', inZone(t) && [[-60, 0], [60, 0], [0, -60], [0, 60]].every(([dx, dy]) => Math.abs(ground(t[0] + dx, t[1] + dy) - ground(t[0], t[1])) < 0.01), TILE(t[0], t[1]) + ' (' + t[0] % W + ', ' + t[1] % H + ')');
    const [cx, cy] = plan.ring, R = RS + OUTER;
    add('Circus inside its tile, centred, on level ground', cx % W - R >= 0 && cx % W + R <= W && cy % H - R >= 0 && cy % H + R <= H && inZone(plan.ring) && dense([[cx - R, cy], [cx + R, cy], [cx, cy - R], [cx, cy + R]], 16).every(([x, y]) => ground(x, y) === 0), 'B2, radius ' + RS);
    add('No bridge or walkway over the circus', bridges.every((b) => b.runs.every((run) => distToPoly(run, cx, cy) > R + HALF)) && plan.walkways.every((w) => distToPoly(w.pts, cx, cy) > R + WALK), '');
    for (const r of plan.roads) for (const [a, b] of [[[W, -1e4], [W, 1e4]], [[2 * W, -1e4], [2 * W, 1e4]], [[-1e4, H], [1e4, H]], [[-1e4, 2 * H], [1e4, 2 * H]]]) for (let i = 1; i < r.pts.length; i++) { const k = segX(r.pts[i - 1], r.pts[i], a, b); if (!k) continue; const vert = a[0] === b[0], along = vert ? k.y : k.x, span = vert ? H : W, off = ((along % span) + span) % span; add('Road crosses a seam ≥ 160 from a tile corner', Math.min(off, span - off) >= 159, r.id + ' at (' + Math.round(k.x) + ', ' + Math.round(k.y) + ')'); }
    // buildings (Edit 60)
    for (const b of plan.buildings) {
      const edge = dense(rectPoly(b.rect).concat([rectPoly(b.rect)[0]]), 16);
      const roads = plan.roads.filter((r) => r.id !== b.spans && !(b.base >= 1 && r.tunnel != null)); // a tunnel runs beneath hill buildings
      const clearOf = roads.every((r) => edge.every(([x, y]) => distToPoly(openPts(r), x, y) > OUTER - 1) && !dense(openPts(r), 16).some(([x, y]) => inRect(b.rect, x, y)));
      const level = b.type === 'cliff' ? edge.some(([x, y]) => ground(x, y - 4) === 1) && edge.some(([x, y]) => ground(x, y) === 0) : edge.every(([x, y]) => Math.abs(ground(x, y) - b.base) < 0.01);
      const spans = !b.spans || plan.roads.some((r) => r.id === b.spans && dense(r.pts, 8).some(([x, y]) => inRect(b.rect, x, y)));
      add('Buildings stand on their own level, clear of lanes (a portal spans one)', clearOf && level && spans, TYPES[b.type].label + ' in ' + tile(b));
    }
    const edgeW = plan.buildings.filter((b) => b.type === 'edge'), tw = edgeW.flatMap((b) => b.towers || []).map((t) => t[4] * STOREY);
    add('The top edge is impassable: a continuous wall of buildings', edgeW.some((b) => b.rect[0] <= 0 && b.rect[0] + b.rect[2] >= DW && b.rect[1] <= 0), 'podium ' + edgeW[0].storeys + ' storeys; towers ' + Math.min(...tw) + '–' + Math.max(...tw) + ' above the hill');
    add('Edge towers within world.towerHeightMin–Max', tw.every((h) => h >= P['world.towerHeightMin'] && h <= P['world.towerHeightMax']), Math.min(...tw) + '–' + Math.max(...tw) + ' in ' + P['world.towerHeightMin'] + '–' + P['world.towerHeightMax']);
    for (const w of plan.walkways) { const ends = [w.pts[0], w.pts[w.pts.length - 1]];
      const landed = ends.every(([x, y]) => plan.buildings.some((b) => inRect(b.rect, x, y, 2) && topZ(b) >= Z1H) || bridges.some((bb) => bb.runs.some((run) => distToPoly(run, x, y) <= HALF + 2)));
      add('Walkways land at a Z1 door, a roof or a bridge deck', landed, w.id + ': ' + w.from + ' → ' + w.to); }
    for (const st of plan.coveStairs) add('Cove stairs climb the wall, feet clear of the lanes', ground(st.head[0] + (st.side === 'west' ? -8 : 8), st.head[1]) === 1 && ground(st.foot[0], st.foot[1]) === 0 && plan.roads.every((r) => distToPoly(openPts(r), st.foot[0], st.foot[1]) > OUTER + SWD / 2 - 1), st.side + ' wall, run ' + RUN1);
    // the dummy: two ways up on every screen with walkable Z0 ground beside Z1
    const esc = escalators(plan, bridges);
    for (const t of ['B1', 'A2', 'B2', 'C2', 'A3', 'C3']) { const e = esc.filter((q) => q.tile === t).length, s = plan.coveStairs.filter((q) => TILE(q.foot[0], q.foot[1]) === t).length, cl = plan.buildings.filter((b) => b.type === 'cliff' && tile(b) === t).length;
      add('Two ways up on every screen below Z1 (escalators, stairs, a cliff house)', e + s + cl >= 2, t + ': ' + [e ? e + ' escalators' : '', s ? s + ' stairs' : '', cl ? cl + ' cliff house' : ''].filter(Boolean).join(', ')); }
    return { rows, drops, river, rescues, esc, bridges };
  }
  // public escalators: two down the north wall on each valley screen (45° flares included); two up to a bridge wherever it
  // stands over walkable ground away from the wall. Feet on Z0, clear of lanes, buildings and the circus.
  function escalators(plan, bridges) {
    const out = [], clearB = (x, y) => plan.buildings.every((b) => !inRect(b.rect, x, y, 16));
    const clear = (x, y, except) => ground(x, y) === 0 && clearB(x, y) && plan.roads.every((r) => r === except || distToPoly(openPts(r), x, y) > OUTER + 24) && hyp(x - plan.ring[0], y - plan.ring[1]) > RS + OUTER + 24;
    for (let col = 0; col < 3; col++) {
      const x0 = col * W, c = [];
      for (let i = 1; i < NORTH.length; i++) { const [ax, ay] = NORTH[i - 1], [bx, by] = NORTH[i], l = hyp(bx - ax, by - ay); if (ax === bx) continue;
        let nx = -(by - ay) / l, ny = (bx - ax) / l; if (ground(ax + (bx - ax) / 2 + nx * 40, ay + (by - ay) / 2 + ny * 40) > 0.5) { nx = -nx; ny = -ny; }
        for (let t = 24; t <= l - 24; t += 16) { const x = ax + (bx - ax) * t / l, y = ay + (by - ay) * t / l, foot = [x + nx * RUN1, y + ny * RUN1];
          if (x < x0 + 40 || x > x0 + W - 40 || y < H || TILE(foot[0], foot[1]) !== 'ABC'[col] + '2') continue;
          if (clear(foot[0], foot[1]) && clearB(x, y + 8) && plan.roads.every((r) => distToPoly(openPts(r), x, y) > OUTER + 16)) c.push({ tile: 'ABC'[col] + '2', head: [x, y], foot, nx, ny }); } }
      const pick = []; for (const target of [0.3, 0.7]) { const q = c.filter((e) => pick.every((p) => hyp(p.head[0] - e.head[0], p.head[1] - e.head[1]) > 200)).sort((p, q2) => Math.abs(p.head[0] - x0 - target * W) - Math.abs(q2.head[0] - x0 - target * W))[0]; if (q) pick.push(q); }
      out.push(...pick);
    }
    for (const b of bridges || []) for (const run of b.runs) {
      const byTile = new Map();
      for (const [x, y] of run) { if (y < 880 || y > DH - 40 || ground(x, y) !== 0) continue; const t = TILE(x, y); if (['A2', 'B2', 'C2'].includes(t)) continue; if (!byTile.has(t)) byTile.set(t, []); byTile.get(t).push([x, y]); }
      for (const [t, pts] of byTile) { const got = [];
        for (const side of [-1, 1]) { const cands = pts.filter(([x, y]) => clear(x + side * (HALF + RUN1), y, b.r) && clear(x + side * (HALF + 8), y, b.r)).sort((p, q) => (side < 0 ? p[1] - q[1] : q[1] - p[1]));
          const c0 = cands.find(([x, y]) => got.every((g) => g.nx !== side || Math.abs(g.head[1] - y) > 120)); if (c0) got.push({ tile: t, head: [c0[0] + side * HALF, c0[1]], foot: [c0[0] + side * (HALF + RUN1), c0[1]], nx: side, ny: 0 }); }
        out.push(...got); }
    }
    return out;
  }

  // ---------- shadows (decision 309, option 2): every caster stamps onto each lower level, offset by the height difference
  // × proto.art.shadowScale along the sun, clipped to that level. Solids sweep from base to top; decks and walkways are slabs.
  const off = (d) => [SUN[0] * d * SHADOW, SUN[1] * d * SHADOW];
  function sweep(poly, a, b) { const A = poly.map(([x, y]) => [x + a[0], y + a[1]]), Bq = poly.map(([x, y]) => [x + b[0], y + b[1]]), out = [A, Bq]; for (let i = 0; i < poly.length; i++) { const j = (i + 1) % poly.length; out.push([A[i], A[j], Bq[j], Bq[i]]); } return out; }
  function shadows(plan, res) {
    const levels = [{ id: 'hill', z: Z1H }, { id: 'land', z: 0 }, { id: 'river', z: RIVER * Z1H }], out = { hill: [], land: [], river: [] };
    const solid = (poly, z0, z1) => { for (const L of levels) { if (z1 <= L.z + 0.5) continue; out[L.id].push(...sweep(poly, off(Math.max(z0, L.z) - L.z), off(z1 - L.z))); } };
    const slab = (pts, width, z) => { for (const L of levels) { if (z <= L.z + 0.5) continue; const d = off(z - L.z); out[L.id].push({ line: pts.map(([x, y]) => [x + d[0], y + d[1]]), width }); } };
    solid(NORTH_POLY, 0, Z1H); // the hill over the valley: a band at the cliff foot
    solid(LAND_POLY, RIVER * Z1H, 0); // the land over the river: a band at the seawall
    for (const b of plan.buildings) { solid(rectPoly(b.rect), baseZ(b) + (b.type === 'portal' ? STOREY : 0), topZ(b)); for (const t of b.towers || []) solid(rectPoly(t.slice(0, 4)), baseZ(b), baseZ(b) + t[4] * STOREY); }
    for (const bb of res.bridges) for (const run of bb.runs) slab([run[0], run[run.length - 1]], 2 * HALF, Z1H);
    for (const w of plan.walkways) slab(w.pts, WALK, Z1H);
    return out;
  }

  // ---------- drawing
  const C = { valley: '#171d29', terrace: '#2b3548', grid: '#303b50', face: '#59626f', faceD: '#3e4652', road: '#262c37', kerb: '#4a5262', deck: '#c3ccd3', led: '#49d3ff', mag: '#ff5fd2', ink: '#e6f4ff', col: '#8a96a0',
    sand: '#5c5a57', sandD: '#4b4946', sandL: '#77746f', water: '#0f2a40', ripple: '#2f6b8f', walk: '#d7dee3', dark: '#05080c', stair: '#c3ccd3' };
  function pathD(pts) { return 'M' + pts.map((p) => (+p[0]).toFixed(1) + ' ' + (+p[1]).toFixed(1)).join('L'); }
  const stairSvg = (head, foot, fill) => { const a = Math.atan2(foot[1] - head[1], foot[0] - head[0]) * 180 / Math.PI, len = hyp(foot[0] - head[0], foot[1] - head[1]); return `<g transform="translate(${head[0]} ${head[1]}) rotate(${a})"><rect x="0" y="${-SWD / 2}" width="${len}" height="${SWD}" fill="${fill}" stroke="#0c1018" stroke-width="3"/>` + [0.3, 0.7].map((f) => `<path d="M${len * f} -10L${len * f - 10} 0L${len * f} 10" fill="none" stroke="#0c1018" stroke-width="4"/>`).join('') + '</g>'; };
  function svgPlan(plan, res) {
    const s = [], face = Z1H * EXTW, sh = shadows(plan, res);
    s.push(`<svg viewBox="-40 -40 ${DW + 80} ${DH + 80}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${plan.name} plan"><defs><clipPath id="vclip"><rect x="0" y="0" width="${DW}" height="${DH}"/></clipPath>`);
    s.push(`<clipPath id="c-hill"><path d="${pathD(NORTH_POLY)}Z"/></clipPath><clipPath id="c-land"><path d="${pathD(LAND_POLY)}Z"/></clipPath><clipPath id="c-river"><path d="${pathD(RIVER_POLY)}Z"/></clipPath>`);
    s.push(`<pattern id="vterr" width="64" height="64" patternUnits="userSpaceOnUse"><rect width="64" height="64" fill="${C.terrace}"/><path d="M0 0H64M0 0V64" stroke="${C.grid}" stroke-width="3"/></pattern>`);
    s.push(`<pattern id="vsand" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="${C.sand}"/><circle cx="8" cy="10" r="2.5" fill="${C.sandD}"/><circle cx="28" cy="30" r="2" fill="${C.sandD}"/><circle cx="31" cy="7" r="1.6" fill="${C.sandL}"/></pattern>`);
    s.push(`<pattern id="vriver" width="160" height="60" patternUnits="userSpaceOnUse"><rect width="160" height="60" fill="${C.water}"/><path d="M10 20h40M90 44h50M60 8h20" stroke="${C.ripple}" stroke-width="4" stroke-linecap="round"/></pattern>`);
    for (const [k, t] of Object.entries(TYPES)) s.push(`<pattern id="b-${k}" width="24" height="24" patternUnits="userSpaceOnUse"><rect width="24" height="24" fill="${t.fill}"/>` + ({ portal: '<path d="M0 24L24 0" stroke="#5b6570" stroke-width="4"/>', cliff: '<path d="M0 6H24M0 18H24" stroke="#5b6570" stroke-width="3"/>', pavilion: '<circle cx="6" cy="6" r="2.5" fill="#6b7480"/><circle cx="18" cy="18" r="2.5" fill="#6b7480"/>', stilt: '<circle cx="6" cy="6" r="2.5" fill="#6b7480"/><circle cx="18" cy="18" r="2.5" fill="#6b7480"/><path d="M0 12H24" stroke="#6b7480" stroke-width="2"/>', edge: '<path d="M0 12H24M12 0V12" stroke="#3a4250" stroke-width="3"/>', block: '<path d="M0 12H24" stroke="#59626f" stroke-width="2"/>' }[k] || '') + '</pattern>');
    s.push(`</defs><g clip-path="url(#vclip)"><rect x="0" y="0" width="${DW}" height="${DH}" fill="${C.valley}"/>`);
    // terrain: the beach, the river and its seawall, the hill and its cliff faces
    s.push(`<path d="M-200 ${BEACH}L2600 ${BEACH}L${SHORE.slice().reverse().map((p) => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join('L')}Z" fill="url(#vsand)"/>`); // pale stone, never yellow (Edit 37)
    s.push(`<path d="${pathD(RIVER_POLY)}Z" fill="url(#vriver)"/>`);
    { const h = -RIVER * face; s.push(`<path d="${pathD(SHORE)}L${pathD(SHORE.slice().reverse().map(([x, y]) => [x, y + h])).slice(1)}Z" fill="${C.face}"/>`); for (let i = 0; i < SHORE.length; i += 3) s.push(`<path d="M${SHORE[i][0].toFixed(1)} ${SHORE[i][1].toFixed(1)}v${h}" stroke="${C.faceD}" stroke-width="3"/>`); } // the seawall: parallel to the drive
    s.push(`<path d="${pathD(NORTH_POLY)}Z" fill="url(#vterr)"/>`);
    for (let i = 1; i < NORTH.length; i++) { const [ax, ay] = NORTH[i - 1], [bx, by] = NORTH[i]; if (ax === bx) { s.push(`<path d="M${ax} ${Math.min(ay, by)}L${ax} ${Math.max(ay, by)}" stroke="${C.face}" stroke-width="12"/>`); continue; }
      s.push(`<path d="M${ax} ${ay}L${bx} ${by}L${bx} ${by + face}L${ax} ${ay + face}Z" fill="${C.face}"/>`);
      for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x += 24) { const y = ay + (by - ay) * (x - ax) / (bx - ax); s.push(`<path d="M${x} ${y}L${x} ${y + face}" stroke="${C.faceD}" stroke-width="3"/>`); } }
    // streets in daylight; the ring
    for (const r of plan.roads) s.push(`<path d="${pathD(openPts(r))}" fill="none" stroke="${C.kerb}" stroke-width="${2 * OUTER}"/>`);
    s.push(`<circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${C.kerb}" stroke-width="${2 * OUTER}"/>`);
    for (const r of plan.roads) s.push(`<path d="${pathD(openPts(r))}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/>`);
    s.push(`<circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 4}" fill="#6b7480" stroke="#9aa6af" stroke-width="6"/><circle cx="${plan.ring[0]}" cy="${plan.ring[1]}" r="${RS - LW - 30}" fill="#2f5d3a"/>`);
    for (const r of plan.roads) s.push(`<path d="${pathD(openPts(r))}" fill="none" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="4" stroke-dasharray="24 24"/>`);
    for (const r of plan.roads.filter((q) => q.z === 1)) s.push(`<path d="${pathD(r.pts)}" fill="none" stroke="${C.led}" stroke-opacity="0.8" stroke-width="${2 * LW + 10}"/><path d="${pathD(r.pts)}" fill="none" stroke="${C.road}" stroke-width="${2 * LW}"/><path d="${pathD(r.pts)}" fill="none" stroke="${C.ink}" stroke-opacity="0.5" stroke-width="4" stroke-dasharray="24 24"/>`);
    // shadows (option 2): one mask per level, clipped to that level
    for (const L of ['hill', 'land', 'river']) s.push(`<g clip-path="url(#c-${L})" opacity="0.36">` + sh[L].map((q) => (q.line ? `<path d="${pathD(q.line)}" fill="none" stroke="#000" stroke-width="${q.width}"/>` : `<path d="${pathD(q)}Z" fill="#000"/>`)).join('') + '</g>');
    // the tunnel portal: a concrete frame in the cove's head wall, a lit soffit, a dark mouth, two lamps
    { const [tx, ty] = plan.mouth, w = 2 * OUTER + 32; s.push(`<rect x="${tx - w / 2}" y="${ty - 8}" width="${w}" height="${face + 8}" fill="#9aa4ad" stroke="#0c1018" stroke-width="4"/><rect x="${tx - OUTER}" y="${ty + 4}" width="${2 * OUTER}" height="${face - 4}" fill="${C.dark}"/><path d="M${tx - OUTER} ${ty + 6}H${tx + OUTER}" stroke="${C.led}" stroke-width="5"/>` + [-1, 1].map((sd) => `<circle cx="${tx + sd * (OUTER + 8)}" cy="${ty + 8}" r="7" fill="${C.ink}"/><circle cx="${tx + sd * (OUTER + 8)}" cy="${ty + 8}" r="16" fill="${C.led}" fill-opacity="0.3"/>`).join('')); }
    // bridges: decks over lower ground, columns dashed beneath
    for (const b of res.bridges) for (const run of b.runs) {
      const dx = run[run.length - 1][0] - run[0][0], dy = run[run.length - 1][1] - run[0][1], l = hyp(dx, dy), tx = dx / l, ty = dy / l;
      s.push(`<path d="${pathD(run)}" fill="none" stroke="#3a4350" stroke-width="${2 * HALF}"/><path d="${pathD(run)}" fill="none" stroke="${C.led}" stroke-width="${2 * HALF - 10}"/><path d="${pathD(run)}" fill="none" stroke="${C.deck}" stroke-width="${2 * HALF - 22}"/><path d="${pathD(run)}" fill="none" stroke="#9aa6af" stroke-width="4" stroke-dasharray="30 26"/>`);
      for (let d = SPAN / 4; d < l; d += SPAN / 2) { const x = run[0][0] + tx * d, y = run[0][1] + ty * d; if (plan.roads.some((q) => q !== b.r && distToPoly(openPts(q), x, y) < OUTER + COL)) continue; for (const sd of [-1, 1]) s.push(`<rect x="${x - ty * sd * (HALF - 12) - COL / 2}" y="${y + tx * sd * (HALF - 12) - COL / 2}" width="${COL}" height="${COL}" fill="none" stroke="#0c1018" stroke-width="4" stroke-dasharray="6 4"/>`); }
    }
    // buildings (a portal shows the road beneath as dashed kerbs), then walkways on their columns
    for (const b of plan.buildings) {
      const [x, y, w, h] = b.rect;
      s.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#b-${b.type})" stroke="#0c1018" stroke-width="4"/>`);
      if (b.type === 'portal') { const r = plan.roads.find((q) => q.id === b.spans), vert = r.pts[0][0] === r.pts[1][0]; s.push(vert ? `<path d="M${r.pts[0][0] - OUTER} ${y}V${y + h}M${r.pts[0][0] + OUTER} ${y}V${y + h}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="12 10"/>` : `<path d="M${x} ${r.pts[0][1] - OUTER}H${x + w}M${x} ${r.pts[0][1] + OUTER}H${x + w}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="12 10"/>`); }
      for (const t of b.towers || []) s.push(`<rect x="${t[0]}" y="${t[1]}" width="${t[2]}" height="${t[3]}" fill="#566070" stroke="#0c1018" stroke-width="4"/><path d="M${t[0] + 10} ${t[1] + t[3] - 12}H${t[0] + t[2] - 10}" stroke="${C.mag}" stroke-width="5"/>`);
      const lx = b.type === 'edge' ? 2280 : x + w / 2, ly = b.type === 'edge' ? 130 : y + h / 2 + 10;
      s.push(`<text x="${lx}" y="${ly}" text-anchor="middle" font-size="24" font-weight="700" fill="#0c1018" fill-opacity="0.7" font-family="system-ui">${b.type === 'edge' ? 'edge wall' : b.storeys}</text>`);
    }
    for (const w of plan.walkways) {
      s.push(`<path d="${pathD(w.pts)}" fill="none" stroke="#3a4350" stroke-width="${WALK + 8}"/><path d="${pathD(w.pts)}" fill="none" stroke="${C.walk}" stroke-width="${WALK - 4}"/><path d="${pathD(w.pts)}" fill="none" stroke="${C.mag}" stroke-width="3" stroke-dasharray="6 10"/>`);
      for (const [x, y] of dense(w.pts, 96).slice(1, -1)) if (plan.roads.every((r) => distToPoly(openPts(r), x, y) > OUTER + WCOL) && plan.buildings.every((b) => !inRect(b.rect, x, y, WCOL))) s.push(`<rect x="${x - WCOL / 2}" y="${y - WCOL / 2}" width="${WCOL}" height="${WCOL}" fill="none" stroke="#0c1018" stroke-width="3" stroke-dasharray="4 3"/>`);
    }
    // the tunnel's hidden lanes, under the hill and its buildings
    for (const r of plan.roads.filter((q) => q.tunnel != null)) for (const sd of [-1, 1]) s.push(`<path d="M${r.pts[0][0] + sd * LW} ${r.tunnel - 8}L${r.pts[0][0] + sd * LW} -200" stroke="${C.ink}" stroke-opacity="0.75" stroke-width="5" stroke-dasharray="18 14"/>`);
    // stairs, escalators, the river drops and the drone's lift to land, the drops onto cars, the junctions
    for (const st of plan.coveStairs) s.push(stairSvg(st.head, st.foot, C.stair));
    for (const e of res.esc) s.push(stairSvg(e.head, e.foot, C.ink));
    for (const q of res.rescues) if (q.to) s.push(`<path d="M${q.from[0]} ${q.from[1]}L${q.to[0].toFixed(1)} ${q.to[1].toFixed(1)}" stroke="#ffffff" stroke-width="4" stroke-dasharray="10 8"/><rect x="${q.to[0] - 12}" y="${q.to[1] - 12}" width="24" height="24" transform="rotate(45 ${q.to[0]} ${q.to[1]})" fill="none" stroke="#ffffff" stroke-width="4"/>`);
    for (const k of res.river) s.push(`<circle cx="${k.x}" cy="${k.y}" r="24" fill="${C.ripple}" stroke="#ffffff" stroke-width="4"/><path d="M${k.x - 10} ${k.y - 7}L${k.x + 10} ${k.y - 7}L${k.x} ${k.y + 10}Z" fill="#ffffff"/>`);
    for (const k of res.drops) s.push(`<circle cx="${k.x}" cy="${k.y}" r="22" fill="#ffffff" fill-opacity="0.92" stroke="#0c1018" stroke-width="4"/><path d="M${k.x - 9} ${k.y - 6}L${k.x + 9} ${k.y - 6}L${k.x} ${k.y + 9}Z" fill="#0c1018"/>`);
    for (const t of plan.tees) s.push(`<circle cx="${t[0]}" cy="${t[1]}" r="10" fill="${C.ink}"/>`);
    s.push('</g>');
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * W}" y1="0" x2="${i * W}" y2="${DH}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="4"/><line x1="0" y1="${i * H}" x2="${DW}" y2="${i * H}" stroke="${C.ink}" stroke-opacity="0.35" stroke-width="4"/>`);
    s.push(`<rect x="0" y="0" width="${DW}" height="${DH}" fill="none" stroke="${C.ink}" stroke-opacity="0.55" stroke-width="6"/>`);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) s.push(`<rect x="${c * W + 18}" y="${r * H + 18}" width="74" height="50" rx="8" fill="#0c1018" fill-opacity="0.8"/><text x="${c * W + 55}" y="${r * H + 55}" text-anchor="middle" font-size="34" font-weight="700" fill="${C.ink}" font-family="system-ui">${'ABC'[c]}${r + 1}</text>`);
    for (const [txt, x, y] of [['HILL · Z1', 2370, 740], ['VALLEY · Z0', 2370, 880], ['BEACH · Z0', 2370, 1300], ['RIVER', 2370, 1880]]) s.push(`<text x="${x}" y="${y}" text-anchor="end" font-size="36" font-weight="700" fill="${C.ink}" fill-opacity="0.8" font-family="system-ui" letter-spacing="3">${txt}</text>`);
    s.push(`<path d="M-36 ${H + H / 2 - 30}L4 ${H + H / 2}L-36 ${H + H / 2 + 30}Z" fill="#57e389"/>`);
    s.push('</svg>');
    return s.join('');
  }
  // a north–south section at x: ground, buildings, the roads and walkways crossing the cut, bridges on columns, the tunnel
  function svgSection(plan, x, label) {
    const VX = 1.5, cutB = plan.buildings.filter((b) => x >= b.rect[0] && x <= b.rect[0] + b.rect[2]);
    const tops = cutB.map((b) => Math.max(topZ(b), ...(b.towers || []).filter((t) => x >= t[0] && x <= t[0] + t[2]).map((t) => baseZ(b) + t[4] * STOREY)));
    const zTop = Math.max(Z1H * 1.5, ...tops), top = 90, base = top + zTop * VX + 30, sy = (zw) => base - zw * VX, bed = RIVER * Z1H - 48, bot = sy(bed) + 6, s = [];
    const zw = (g) => (g === RIVER ? bed : g * Z1H);
    const prof = []; for (let y = 0; y <= DH; y += 8) prof.push([y, ground(x, y)]);
    const txt = (tx, ty, t, o) => `<text x="${tx}" y="${ty}" text-anchor="${(o && o.a) || 'middle'}" font-size="${(o && o.fs) || 22}" font-weight="${(o && o.w) || 400}" fill="${(o && o.fill) || C.ink}" stroke="#10141c" stroke-width="5" paint-order="stroke" font-family="system-ui">${t}</text>`;
    s.push(`<svg viewBox="-40 0 ${DH + 80} ${bot + 64}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Section ${label}">`);
    s.push(`<rect x="-40" y="0" width="${DH + 80}" height="${bot + 64}" fill="#10141c"/>`);
    s.push(`<path d="M0 ${bot}` + prof.map(([y, g]) => `L${y} ${sy(zw(g))}`).join('') + `L${DH} ${bot}Z" fill="${C.terrace}" stroke="${C.face}" stroke-width="4"/>`);
    const wet = prof.filter(([, g]) => g === RIVER); if (wet.length) s.push(`<rect x="${wet[0][0]}" y="${sy(RIVER * Z1H)}" width="${DH - wet[0][0]}" height="${sy(bed) - sy(RIVER * Z1H)}" fill="${C.water}" stroke="${C.ripple}" stroke-width="3"/>`);
    const sand = prof.filter(([y, g]) => g === 0 && y >= BEACH); if (sand.length) s.push(`<path d="M${sand[0][0]} ${sy(0)}L${sand[sand.length - 1][0]} ${sy(0)}" stroke="${C.sandL}" stroke-width="8"/>`);
    // the tunnel: a bore at Z0 through the hill, a portal at the cove head
    for (const r of plan.roads.filter((q) => q.tunnel != null && Math.abs(q.pts[0][0] - x) < 1)) { const y0 = 0, y1 = r.tunnel, hb = 0.7 * Z1H; s.push(`<rect x="${y0}" y="${sy(hb)}" width="${y1 - y0}" height="${hb * VX}" fill="${C.dark}" stroke="${C.ink}" stroke-width="3" stroke-dasharray="12 8"/><path d="M${y0} ${sy(0) - 4}H${y1}" stroke="${C.road}" stroke-width="8"/><path d="M${y0} ${sy(hb) + 4}H${y1}" stroke="${C.led}" stroke-width="3"/><rect x="${y1 - 8}" y="${sy(Z1H)}" width="16" height="${(Z1H - hb) * VX}" fill="#9aa4ad" stroke="#0c1018" stroke-width="3"/>` + txt((y0 + y1) / 2 + 40, sy(hb / 2) + 8, 'tunnel (Z0)')); }
    // buildings in the cut
    cutB.forEach((b) => { const [, by, , bh] = b.rect, z0 = b.type === 'pier' ? bed : b.type === 'stilt' ? RIVER * Z1H + STOREY : baseZ(b) + (b.type === 'portal' ? STOREY : 0), z1 = topZ(b);
      s.push(`<rect x="${by}" y="${sy(z1)}" width="${bh}" height="${(z1 - z0) * VX}" fill="${TYPES[b.type].fill}" stroke="#0c1018" stroke-width="3"/>`);
      for (let k = 1; k < b.storeys; k++) { const zk = z1 - k * STOREY; if (zk > z0 + 1) s.push(`<path d="M${by + 4} ${sy(zk)}H${by + bh - 4}" stroke="#0c1018" stroke-opacity="0.35" stroke-width="2"/>`); }
      if (b.type === 'stilt') for (const f of [0.15, 0.5, 0.85]) s.push(`<rect x="${by + bh * f - 4}" y="${sy(z0)}" width="8" height="${(z0 - bed) * VX}" fill="${C.col}"/>`);
      if (b.type === 'portal') { const r = plan.roads.find((q) => q.id === b.spans); if (!r.pts.every((p) => Math.abs(p[0] - x) < 1)) for (const yy of [by, by + bh - 10]) s.push(`<rect x="${yy}" y="${sy(z0)}" width="10" height="${STOREY * VX}" fill="${TYPES.portal.fill}" stroke="#0c1018" stroke-width="2"/>`); }
      for (const t of b.towers || []) if (x >= t[0] && x <= t[0] + t[2]) { const zt = baseZ(b) + t[4] * STOREY; s.push(`<rect x="${t[1]}" y="${sy(zt)}" width="${t[3]}" height="${(zt - z1) * VX}" fill="#566070" stroke="#0c1018" stroke-width="3"/>`); }
      s.push(txt(by + bh / 2, sy(tops[cutB.indexOf(b)]) - 10, TYPES[b.type].label, { fs: 20 })); });
    for (let i = 1; i < 3; i++) s.push(`<line x1="${i * H}" y1="20" x2="${i * H}" y2="${bot}" stroke="${C.ink}" stroke-opacity="0.25" stroke-width="3" stroke-dasharray="10 10"/>`);
    for (let r = 0; r < 3; r++) s.push(`<text x="${r * H + H / 2}" y="${bot + 36}" text-anchor="middle" font-size="24" fill="${C.ink}" fill-opacity="0.7" font-family="system-ui">row ${r + 1}</text>`);
    // roads: along the cut (a line; a deck on columns where raised) or across it (a block)
    for (const r of plan.roads) {
      const along = r.pts.every((p) => Math.abs(p[0] - x) < 1), zr = r.z * Z1H;
      if (along) { const pts = dense(openPts(r), 8).filter((p) => p[1] >= 0 && p[1] <= DH).sort((a, b) => a[1] - b[1]); const up = pts.filter(([px, py]) => r.z - ground(px, py) > 0.25);
        s.push(`<path d="M${pts.map(([, py]) => py + ' ' + (sy(zr) - 5)).join('L')}" fill="none" stroke="${C.ink}" stroke-width="7"/>`);
        if (up.length) { const y0 = up[0][1], y1 = up[up.length - 1][1]; s.push(`<rect x="${y0}" y="${sy(zr) - 2}" width="${y1 - y0}" height="14" fill="${C.deck}" stroke="${C.led}" stroke-width="3"/>`); for (let y = y0 + 40; y < y1 - 20; y += 80) { if (plan.roads.some((q) => q !== r && distToPoly(openPts(q), x, y) < OUTER + COL)) continue; s.push(`<rect x="${y - 7}" y="${sy(zr) + 12}" width="14" height="${sy(zw(ground(x, y))) - sy(zr) - 12}" fill="${C.col}"/>`); } }
        const mid = pts[Math.floor(pts.length / 2)]; s.push(txt(mid[1], sy(zr) - 18, r.id + ' (in the cut)', { fs: 22 }));
      } else for (let i = 1; i < r.pts.length; i++) { const k = segX(r.pts[i - 1], r.pts[i], [x, -1e4], [x, 1e4]); if (!k || k.y < 0 || k.y > DH) continue;
        s.push(`<rect x="${k.y - OUTER}" y="${sy(zr) - 12}" width="${2 * OUTER}" height="12" fill="${C.road}" stroke="${C.ink}" stroke-width="3"/>` + txt(k.y, sy(zr) - 20, r.id, { fs: 20 })); }
    }
    for (const w of plan.walkways) { const along = w.pts.every((p) => Math.abs(p[0] - x) < 1);
      if (along) { const y0 = Math.min(w.pts[0][1], w.pts[1][1]), y1 = Math.max(w.pts[0][1], w.pts[1][1]); s.push(`<rect x="${y0}" y="${sy(Z1H) - 2}" width="${y1 - y0}" height="10" fill="${C.walk}" stroke="${C.mag}" stroke-width="3"/>` + txt((y0 + y1) / 2, sy(Z1H) - 16, w.id, { fs: 20 })); }
      else { const k = segX(w.pts[0], w.pts[1], [x, -1e4], [x, 1e4]); if (k) s.push(`<rect x="${k.y - WALK / 2}" y="${sy(Z1H) - 2}" width="${WALK}" height="10" fill="${C.walk}" stroke="${C.mag}" stroke-width="3"/>`); } }
    if (Math.abs(plan.ring[0] - x) < 1) s.push(`<rect x="${plan.ring[1] - RS - OUTER}" y="${sy(0) - 18}" width="${2 * (RS + OUTER)}" height="18" fill="${C.road}" stroke="#57e389" stroke-width="4"/>` + txt(plan.ring[1], sy(0) + 36, 'the circus', { fs: 26, w: 700, fill: '#57e389' }));
    s.push(`<text x="0" y="36" font-size="28" font-weight="700" fill="${C.ink}" font-family="system-ui">${label}</text><text x="${DH}" y="36" text-anchor="end" font-size="22" fill="${C.ink}" fill-opacity="0.6" font-family="system-ui">north ← → south · heights × ${VX}</text>`);
    s.push(txt(DH - 20, sy(RIVER * Z1H) + 30, 'river', { a: 'end', fs: 22 }));
    s.push('</svg>');
    return s.join('');
  }
  // the tunnel portal asset (Edit 60), at game scale: one art px = 2 world units, drawn 4×. Numbers key the spec on the page.
  function svgTunnel() {
    const k = 4, Wd = 160, Ht = 140, R = (x, y, w, h, f, extra) => `<rect x="${x * k}" y="${y * k}" width="${w * k}" height="${h * k}" fill="${f}"${extra || ''}/>`, s = [];
    const tag = (n, x, y) => `<circle cx="${x * k}" cy="${y * k}" r="15" fill="#0c1018" stroke="${C.ink}" stroke-width="3"/><text x="${x * k}" y="${y * k + 7}" text-anchor="middle" font-size="20" font-weight="700" fill="${C.ink}" font-family="system-ui">${n}</text>`;
    s.push(`<svg viewBox="0 0 ${Wd * k} ${Ht * k}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tunnel portal asset" shape-rendering="crispEdges">`);
    s.push(R(0, 0, Wd, Ht, C.valley));
    s.push(R(0, 0, Wd, 40, C.terrace)); for (let x = 0; x < Wd; x += 32) s.push(R(x, 0, 1, 40, C.grid)); s.push(R(0, 16, Wd, 1, C.grid)); // the hill: world 280–360
    s.push(R(0, 0, Wd, 10, C.road) + R(0, 10, Wd, 2, C.kerb)); // the ridge road's south kerb, passing over
    s.push(R(26, 4, 108, 32, TYPES.portal.fill) + R(26, 4, 108, 3, '#9aa4ad')); for (let x = 32; x < 128; x += 12) s.push(R(x, 12, 6, 4, C.led, ' fill-opacity="0.55"') + R(x, 22, 6, 4, C.led, ' fill-opacity="0.35"')); // the belvedere block's front
    s.push(R(0, 40, Wd, 18, C.face)); for (let x = 2; x < Wd; x += 6) s.push(R(x, 40, 1, 18, C.faceD)); // the cove head wall: world.deckHeight × extrusion
    s.push(R(32, 36, 96, 22, '#9aa4ad') + R(32, 36, 96, 2, '#c3ccd3') + R(32, 56, 96, 2, '#7a8591')); // the portal frame
    s.push(R(40, 44, 80, 4, C.dark) + R(40, 48, 80, 5, '#0b1018') + R(40, 53, 80, 5, '#121a26') + R(40, 44, 80, 1, C.led)); // the mouth: darkness deepens inward; lit soffit
    for (let y = 46; y < 58; y += 4) s.push(R(79, y, 2, 2, C.ink, ' fill-opacity="0.15"'));
    for (const lx of [34, 122]) s.push(`<circle cx="${(lx + 2) * k}" cy="${48 * k}" r="${7 * k}" fill="${C.led}" fill-opacity="0.22"/>` + R(lx, 46, 4, 4, C.ink));
    s.push(R(0, 58, Wd, Ht - 58, C.valley)); s.push(R(40, 58, 80, Ht - 58, C.kerb) + R(52, 58, 56, Ht - 58, C.road)); // the cove floor and the road
    for (let y = 60; y < Ht; y += 12) s.push(R(79, y, 2, 6, C.ink, ` fill-opacity="${Math.min(0.6, 0.6 * (y - 58) / 30).toFixed(2)}"`));
    s.push(`<path d="M0 ${58 * k}H${Wd * k}L${(Wd - 13) * k} ${71 * k}H0Z" fill="#000" fill-opacity="0.36"/>`); // option 2: the hill over the cove floor
    s.push(R(84, 52, 18, 6, '#8fb3c9', ' fill-opacity="0"') + R(84, 58, 18, 14, '#8fb3c9') + R(86, 66, 14, 4, '#5d7f93') + R(84, 58, 18, 1, C.dark)); // a car entering: clipped at the mouth line
    s.push(R(0, 40, 4, Ht - 40, C.face) + R(Wd - 4, 40, 4, Ht - 40, C.face)); // the cove walls
    for (const [x0, dir] of [[4, -1], [Wd - 36, 1]]) { s.push(R(x0, 110, 32, 16, C.stair)); for (let i = 1; i < 8; i++) s.push(R(x0 + i * 4, 110, 1, 16, '#7a8591')); s.push(`<path d="M${(x0 + 16 - dir * 4) * k} ${113 * k}L${(x0 + 16 + dir * 4) * k} ${118 * k}L${(x0 + 16 - dir * 4) * k} ${123 * k}" fill="none" stroke="#0c1018" stroke-width="5"/>`); }
    s.push(tag(1, 30, 50) + tag(2, 70, 40) + tag(3, 140, 48) + tag(4, 100, 50) + tag(5, 110, 66) + tag(6, 140, 22) + tag(7, 20, 100) + tag(8, 20, 66));
    s.push('</svg>');
    return s.join('');
  }

  const api = { PLAN, TYPES, check, rescue, svgPlan, svgSection, svgTunnel, ground, surface, NORTH, SHORE, COVE, RIVER, SEAWALL };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.CIRCUS_VALLEY = api;
})(typeof window !== 'undefined' ? window : globalThis);
