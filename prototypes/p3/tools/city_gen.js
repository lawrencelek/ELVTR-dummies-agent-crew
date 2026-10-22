// City v2 (20 Oct): blocks fill ~25% of the level; jersey barriers line ~5–10% of the road edge.
// Greedy, deterministic: largest legal block first, aligned to an 8-unit grid, 44-unit alleys, flood-fill access kept.
const D = require(process.argv[2] + '/sim.js');
const { LEVELS, LEVEL_LIST } = D;
const W = 800, H = 600, R = 13, OUTER = 80, CANAL = 46, ALLEY = 40, /* world.pedestrianGap */ CELL = 4, GW = W / CELL, GH = H / CELL;
const TARGET = +(process.argv[3] || 0.25), JTARGET = +(process.argv[4] || 0.08);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function geom(center) {
  const segs = []; for (let i = 1; i < center.length; i++) { const a = center[i - 1], b = center[i], dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy); segs.push({ ax: a[0], ay: a[1], tx: dx / len, ty: dy / len, len }); }
  return (x, y) => { let best = 1e9; for (const g of segs) { const px = x - g.ax, py = y - g.ay, t = Math.max(0, Math.min(g.len, px * g.tx + py * g.ty)); best = Math.min(best, Math.hypot(px - g.tx * t, py - g.ty * t)); } return best; };
}
const rectDist = (x, y, r) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
const overlapGap = (a, b, g) => a.x < b.x + b.w + g && a.x + a.w + g > b.x && a.y < b.y + b.h + g && a.y + a.h + g > b.y;
function access(L, statics, d) {
  const S = 4, gw = W / S, gh = H / S, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const x = i * S + 2, y = j * S + 2; free[j * gw + i] = x > R && x < W - R && y > R && y < H - R && statics.every((st) => rectDist(x, y, st) > R + 0.5) ? 1 : 0; }
  const q = []; for (const sp of L.spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); if (free[k] && !seen[k]) { seen[k] = 1; q.push(k); } }
  while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
  let open = 0, lost = 0, road = 0; for (let k = 0; k < free.length; k++) if (free[k]) { open++; if (!seen[k]) lost++; else { const i = k % gw, j = (k - i) / gw; if (d(i * S + 2, j * S + 2) < 56) road++; } }
  return { open, lost, road };
}
function roadEdgeLength(c) { // length of road centreline inside the field, both edges
  let len = 0; for (let i = 1; i < c.length; i++) { const a = c[i - 1], b = c[i], n = 400; for (let k = 0; k < n; k++) { const t0 = k / n, t1 = (k + 1) / n, x0 = a[0] + (b[0] - a[0]) * t0, y0 = a[1] + (b[1] - a[1]) * t0, x1 = a[0] + (b[0] - a[0]) * t1, y1 = a[1] + (b[1] - a[1]) * t1; if (x0 >= 0 && x0 <= W && y0 >= 0 && y0 <= H) len += Math.hypot(x1 - x0, y1 - y0); } }
  return 2 * len;
}
const out = {};
for (const id of LEVEL_LIST) {
  const L = LEVELS[id], c = L.center(), d = geom(c), base = L.statics.slice(), edge = roadEdgeLength(c);
  // jersey barriers: just off the pavement on straight stretches, spaced so they line ~JTARGET of the road edge
  const want = Math.max(1, Math.round(edge * JTARGET / 44)), cand = [];
  for (let i = 1; i < c.length; i++) {
    const a = c[i - 1], b = c[i], hz = a[1] === b[1], vt = a[0] === b[0]; if (!hz && !vt) continue;
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    for (const side of [-1, 1]) for (let s = 40; s < len - 40; s += 10) {
      const t = s / len, px = a[0] + (b[0] - a[0]) * t, py = a[1] + (b[1] - a[1]) * t;
      const r = hz ? { x: Math.round(px - 22), y: Math.round(py + side * (OUTER + 4) - (side < 0 ? 8 : 0)), w: 44, h: 8 } : { x: Math.round(px + side * (OUTER + 4) - (side < 0 ? 8 : 0)), y: Math.round(py - 22), w: 8, h: 44 };
      if (r.x < 4 || r.y < CANAL || r.x + r.w > W - 4 || r.y + r.h > H - 4) continue;
      if ([[r.x, r.y], [r.x + r.w, r.y], [r.x, r.y + r.h], [r.x + r.w, r.y + r.h]].some(([x, y]) => d(x, y) < OUTER + 2)) continue;
      if (!base.every((st) => !overlapGap(r, st, 26)) || !L.spawns.every((sp) => rectDist(sp.x, sp.y, r) > 56) || !L.cones.every((cn) => rectDist(cn[0], cn[1], r) > 26)) continue;
      cand.push(Object.assign(r, { kind: 'jersey' }));
    }
  }
  const jerseys = []; // spread: pick the candidate farthest from the ones already chosen
  while (jerseys.length < want && cand.length) {
    let bi = -1, bd = -1; for (let k = 0; k < cand.length; k++) { const q = cand[k]; if (jerseys.some((j) => overlapGap(q, j, 60))) continue; const m = jerseys.length ? Math.min(...jerseys.map((j) => Math.hypot(j.x - q.x, j.y - q.y))) : (q.x * 0.37 + q.y * 0.61) % 97; if (m > bd) { bd = m; bi = k; } }
    if (bi < 0) break; jerseys.push(cand.splice(bi, 1)[0]);
  }
  // blocks: forbidden cells for a footprint; summed-area table makes each candidate O(1)
  const blocks = [], r = rng(4242 + LEVEL_LIST.indexOf(id) * 131);
  const tooNear = (x, y) => d(x, y) < OUTER + 16 || y < CANAL
    || base.some((st) => rectDist(x, y, st) < ALLEY) || jerseys.some((st) => rectDist(x, y, st) < ALLEY)
    || L.spawns.some((sp) => Math.hypot(sp.x - x, sp.y - y) < 48) || L.cones.some((cn) => Math.hypot(cn[0] - x, cn[1] - y) < 32);
  const forb = new Uint8Array(GW * GH);
  for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) forb[j * GW + i] = tooNear(i * CELL + 2, j * CELL + 2) ? 1 : 0;
  const block = (b) => { for (let j = Math.max(0, Math.floor((b.y - ALLEY) / CELL)); j < Math.min(GH, Math.ceil((b.y + b.h + ALLEY) / CELL)); j++) for (let i = Math.max(0, Math.floor((b.x - ALLEY) / CELL)); i < Math.min(GW, Math.ceil((b.x + b.w + ALLEY) / CELL)); i++) if (rectDist(i * CELL + 2, j * CELL + 2, b) < ALLEY) forb[j * GW + i] = 1; };
  let area = 0; const banned = new Set();
  for (let iter = 0; iter < 60 && area < TARGET * W * H; iter++) {
    const sat = new Int32Array((GW + 1) * (GH + 1));
    for (let j = 0; j < GH; j++) for (let i = 0; i < GW; i++) sat[(j + 1) * (GW + 1) + i + 1] = forb[j * GW + i] + sat[j * (GW + 1) + i + 1] + sat[(j + 1) * (GW + 1) + i] - sat[j * (GW + 1) + i];
    const bad = (x, y, w, h) => { const i0 = x / CELL, j0 = y / CELL, i1 = (x + w) / CELL, j1 = (y + h) / CELL; return sat[j1 * (GW + 1) + i1] - sat[j0 * (GW + 1) + i1] - sat[j1 * (GW + 1) + i0] + sat[j0 * (GW + 1) + i0]; };
    let best = null;
    for (let w = 160; w >= 40; w -= 8) for (let h = 120; h >= 40; h -= 8) {
      if (best && w * h < best.w * best.h) continue;
      for (let y = 48; y + h <= H; y += 8) for (let x = 0; x + w <= W; x += 8) { // 8-unit grid; y 48 sits flush on the canal strip
        if (!(x === 0 || x >= ALLEY) || !(x + w === W || W - (x + w) >= ALLEY) || !(y + h === H || H - (y + h) >= ALLEY) || !(y === 48 || y - CANAL >= ALLEY)) continue;
        if (bad(x, y, w, h)) continue;
        const key = x + ',' + y + ',' + w + ',' + h; if (banned.has(key)) continue;
        const align = blocks.reduce((n, b) => n + (b.y === y || b.y + b.h === y + h ? 1 : 0) + (b.x === x || b.x + b.w === x + w ? 1 : 0), 0) + (x === 0 || x + w === W ? 1 : 0) + (y + h === H || y === 48 ? 1 : 0);
        const score = w * h + align * 400 + r() * 50;
        if (!best || score > best.score) best = { x, y, w, h, score, key };
      }
    }
    if (!best) break;
    const blk = { x: best.x, y: best.y, w: best.w, h: best.h, kind: 'block', height: 60 + Math.round(r() * 8) * 10 };
    const rc = access(L, base.concat(jerseys, blocks, [blk]), d);
    if (rc.lost > 0 || rc.road === 0) { banned.add(best.key); continue; }
    blocks.push(blk); block(blk); area += blk.w * blk.h;
  }
  const rc = access(L, base.concat(jerseys, blocks), d);
  out[id] = { jerseys, blocks, check: rc, blockShare: +(area / (W * H)).toFixed(3), jerseyShare: +(jerseys.length * 44 / edge).toFixed(3), edge: Math.round(edge),
    solidShare: +((area + jerseys.length * 352 + base.reduce((n, s) => n + s.w * s.h, 0)) / (W * H)).toFixed(3) };
}
console.log(JSON.stringify(out));
