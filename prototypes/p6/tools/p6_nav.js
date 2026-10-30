// Prototype 6.2 (GDD Edit 70): the navigation checks, on the plan as built (every screen, ground level).
// 1. Dead space: open ground the body can never touch. A gap narrower than the body between two solids, a sliver by a
//    kerb or a pool: it reads as walkable and is not. Each piece of it (over 400 square units, not a hairline) fails.
// 2. Paths (Parkland): the garden grid's paths, node to node, walk end to end. A path may end only at a road, a deck's
//    flight or the edge of a piece the plan spans (the great lawn, a set piece). Nothing in one cell stands on a path.
// 3. Entries: every flight's apron opens onto a forecourt the body can stand in (32 deep beyond the apron, as wide as the
//    flight). In Parkland the apron's axis runs along a path.
// 4. One ground: in Parkland, each screen's open ground is one piece, so the dummy walks round every pool, hall and ring.
// Run from prototypes/p6: node tools/p6_nav.js [district]   (exits 1 on any failure)
'use strict';
const W6 = require('../world6.js'), X = require('../sim.js'), A = require('./p6_audit.js'), PIX = globalThis.PIX;
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), W = P['world.width'], H = P['world.height'], R = P['body.radius'];
const GW = P['world.gardenCellWidth'], GH = P['world.gardenCellHeight'], GP = P['world.gardenPath'], APRON = P['world.stairApron'];
const S4 = 4, NX = W / S4, NY = H / S4, M = R - 2; // the standing test the game uses (groundFree): the centre clear of solids by body.radius − 2
const inR = (r, x, y, m) => x >= r.x - m && x <= r.x + r.w + m && y >= r.y - m && y <= r.y + r.h + m;

function grids(sc) { // per screen: where the centre can stand; where open ground is (no solid, water, hill or flight)
  if (sc._nav) return sc._nav;
  const g = sc.game, st = new Uint8Array(NX * NY), open = new Uint8Array(NX * NY);
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const x = (i + 0.5) * S4, y = (j + 0.5) * S4, k = j * NX + i;
    st[k] = A.standable(sc, x, y, null, M) ? 1 : 0;
    open[k] = !g.statics.some((q) => inR(q, x, y, 0)) && !g.stairs.some((q) => inR(q, x, y, 0)) && g.polys0.every((p) => !PIX.inPoly(p, x, y)) && g.water.every((p) => !PIX.inPoly(p, x, y)) ? 1 : 0;
  }
  return (sc._nav = { st, open });
}
function comps(mask, minCells) { // 4-connected pieces of a mask: cells, bbox, interior cells
  const id = new Int32Array(NX * NY).fill(-1), out = [];
  for (let k = 0; k < mask.length; k++) {
    if (!mask[k] || id[k] >= 0) continue;
    const q = [k], c = { n: 0, inner: 0, x0: 1e9, y0: 1e9, x1: -1, y1: -1, cells: [] }; id[k] = out.length;
    while (q.length) {
      const v = q.pop(), i = v % NX, j = (v - i) / NX; c.n++; c.cells.push(v);
      c.x0 = Math.min(c.x0, i); c.y0 = Math.min(c.y0, j); c.x1 = Math.max(c.x1, i); c.y1 = Math.max(c.y1, j);
      let all = true;
      for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + a, jj = j + b; if (ii < 0 || jj < 0 || ii >= NX || jj >= NY || !mask[jj * NX + ii]) { all = false; continue; } const w = jj * NX + ii; if (id[w] < 0) { id[w] = out.length; q.push(w); } }
      if (all) c.inner++;
    }
    out.push(c);
  }
  return { id, list: out.filter((c) => c.n >= (minCells || 1)) };
}
const box = (c) => [c.x0 * S4, c.y0 * S4, (c.x1 + 1) * S4, (c.y1 + 1) * S4].map(Math.round).join(',');

function deadSpace(sc) { // 1
  const { st, open } = grids(sc), cov = new Uint8Array(NX * NY), r = Math.ceil(R / S4);
  for (let k = 0; k < st.length; k++) if (st[k]) { const i = k % NX, j = (k - i) / NX; for (let b = -r; b <= r; b++) for (let a = -r; a <= r; a++) { if ((a * a + b * b) * S4 * S4 > R * R) continue; const ii = i + a, jj = j + b; if (ii >= 0 && jj >= 0 && ii < NX && jj < NY) cov[jj * NX + ii] = 1; } }
  const e = Math.ceil(R / S4), U = new Uint8Array(NX * NY);
  for (let j = e; j < NY - e; j++) for (let i = e; i < NX - e; i++) { const k = j * NX + i; U[k] = open[k] && !cov[k] ? 1 : 0; } // the screen's edge band belongs to the crossings
  return comps(U, 25).list.filter((c) => c.inner >= 6).map((c) => ({ where: sc.name + ' ' + box(c), area: c.n * S4 * S4 }));
}

function pathLines(sc) { // Parkland: path centre lines (a seam path runs whole inside the screen, its centre GP / 2 in; at the district's bound inside the wall)
  const WT = P['world.wallThickness'], e = { W: sc.col > 0 ? GP : WT + GP, E: sc.col < 2 ? GP : WT + GP, N: sc.row > 0 ? GP : WT + GP, S: sc.row < 2 ? GP : WT + GP };
  const xs = [e.W - GP / 2], ys = [e.N - GP / 2];
  for (let x = GW; x < W; x += GW) xs.push(x);
  for (let y = GH; y < H; y += GH) ys.push(y);
  xs.push(W - e.E + GP / 2); ys.push(H - e.S + GP / 2);
  return { xs, ys };
}
function paths(sc) { // 2
  const { st } = grids(sc), { xs, ys } = pathLines(sc), out = [], pieces = sc.pieces || [];
  const ok = (x, y) => { const i = Math.floor(x / S4), j = Math.floor(y / S4); return i >= 0 && j >= 0 && i < NX && j < NY && st[j * NX + i] === 1; };
  const onRoad = (x, y) => !sc.roadOk(x, y, P['world.laneWidth'] + P['proto.shoulderWidth']);
  const inPiece = (x, y) => pieces.find((p) => x > p.rect[0] - 20 && x < p.rect[0] + p.rect[2] + 20 && y > p.rect[1] - 20 && y < p.rect[1] + p.rect[3] + 20); // a path may end at a piece's frame
  const atFlight = (x, y) => sc.game.stairs.some((s) => inR(s, x, y, 24)) || (sc.checkpoints || []).length && sc.game.checkpoints.some((cp) => inR(W6.cpZone(cp), x, y, 24)); // or at a flight's foot, or a booth
  const near = (x, y) => { const g = sc.game, q = g.statics.filter((s) => inR(s, x, y, R)).map((s) => s.kind || 'solid'); if (g.water.some((p) => PIX.inPoly(p, x, y))) q.push('water'); if (g.stairs.some((s) => inR(s, x, y, R))) q.push('flight'); return [...new Set(q)].join('+') || 'edge'; };
  const seg = (x0, y0, x1, y1, tag) => {
    const L = Math.hypot(x1 - x0, y1 - y0), tx = (x1 - x0) / L, ty = (y1 - y0) / L;
    for (let s = 0; s <= L; s += 8) {
      const x = x0 + tx * s, y = y0 + ty * s;
      if (onRoad(x, y) || inPiece(x, y)) continue;
      let pass = false; for (let d = -12; d <= 12 && !pass; d += 4) pass = ok(x - ty * d, y + tx * d);
      if (!pass) { if (atFlight(x, y)) return; out.push({ where: `${sc.name} ${tag} at ${Math.round(x)},${Math.round(y)}`, by: near(x, y) }); return; }
    }
  };
  for (const x of xs) for (let k = 0; k + 1 < ys.length; k++) seg(x, ys[k], x, ys[k + 1], `path x ${x}, y ${ys[k]}–${ys[k + 1]}`);
  for (const y of ys) for (let k = 0; k + 1 < xs.length; k++) seg(xs[k], y, xs[k + 1], y, `path y ${y}, x ${xs[k]}–${xs[k + 1]}`);
  return out;
}

function entries(sc, park) { // 3
  const { st } = grids(sc), out = [], g = sc.game, { xs, ys } = park ? pathLines(sc) : { xs: [], ys: [] };
  const ok = (x, y) => { const i = Math.floor(x / S4), j = Math.floor(y / S4); return i >= 0 && j >= 0 && i < NX && j < NY && st[j * NX + i] === 1; };
  for (const s0 of g.stairs) {
    const G = A.stairGeom(s0), dir = G.dir, lat = G.lat, wd = (s0.axis === 'y' ? s0.w : s0.h) / 2 + 8;
    let n = 0, good = 0;
    for (let d = APRON; d <= APRON + 32; d += 8) for (let l = -wd + 8; l <= wd - 8; l += 8) { const p = G.pt(s0.low - dir * d, lat + l); if (p.x < 28 || p.y < 28 || p.x > W - 28 || p.y > H - 28) continue; n++; if (ok(p.x, p.y)) good++; } // the apron's own width, 32 on; the edge band belongs to the crossings
    const tag = `${sc.name} flight ${s0.axis === 'y' ? 'x ' + Math.round(lat) + ' foot y ' + Math.round(s0.low) : 'y ' + Math.round(lat) + ' foot x ' + Math.round(s0.low)}`;
    if (n && good / n < 0.8) out.push({ where: tag, why: `forecourt ${Math.round(100 * good / n)}% clear` });
    if (park && !(sc.offGrid || []).some(([x, y]) => Math.abs(x - s0.x) < 1 && Math.abs(y - s0.y) < 1)) { const line = s0.axis === 'y' ? xs : ys; if (!line.some((v) => Math.abs(v - lat) <= 12)) out.push({ where: tag, why: 'apron off the path grid' }); } // a flight a road keeps off the grid is noted at build
  }
  return out;
}

function oneGround(sc) { // 4
  const { st } = grids(sc), c = comps(st, 24).list;
  return c.length > 1 ? [{ where: sc.name, why: `${c.length} pieces of ground: ` + c.map((q) => box(q) + ' (' + q.n + ')').join('; ') }] : [];
}

function navDistrict(id) {
  const w = W6.buildWorld(id, { warm: 0 }), park = id === 'parkland', r = { dead: [], paths: [], entries: [], ground: [] };
  for (const sc of w.scs) {
    r.dead.push(...deadSpace(sc));
    if (park) r.paths.push(...paths(sc));
    r.entries.push(...entries(sc, park));
    if (park) r.ground.push(...oneGround(sc));
  }
  return r;
}
module.exports = { navDistrict, deadSpace, paths, entries, oneGround, pathLines };
if (require.main === module) {
  let bad = 0;
  for (const id of process.argv[2] ? [process.argv[2]] : W6.LEVEL_LIST) {
    const r = navDistrict(id), n = r.dead.length + r.paths.length + r.entries.length + r.ground.length; bad += n;
    console.log(`${id}: dead space ${r.dead.length}; paths blocked ${r.paths.length}; entries ${r.entries.length}; ground split ${r.ground.length}`);
    for (const q of r.dead) console.log('   dead  ', q.where, q.area + ' u²');
    for (const q of r.paths) console.log('   path  ', q.where, 'by', q.by);
    for (const q of r.entries) console.log('   entry ', q.where, q.why);
    for (const q of r.ground) console.log('   ground', q.where, q.why);
  }
  process.exit(bad ? 1 : 0);
}
