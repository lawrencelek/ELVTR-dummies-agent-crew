// City district contract (GDD Edit 41 §7.9 clauses 11–16). Used by the baking tool and by test_sim.js.
// Returns a list of problems; an empty list means the layout passes.
const rdist = (x, y, r) => Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));
function reach(lv, R, W, H) { // flood fill from the spawns over open ground, 4-unit grid
  const S = 4, gw = W / S, gh = H / S, free = new Uint8Array(gw * gh), seen = new Uint8Array(gw * gh), q = [];
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) { const px = i * S + 2, py = j * S + 2; free[j * gw + i] = px > R && px < W - R && py > R && py < H - R && lv.statics.every((st) => rdist(px, py, st) > R + 0.5) ? 1 : 0; }
  for (const sp of lv.spawns) { const k = Math.floor(sp.y / S) * gw + Math.floor(sp.x / S); if (free[k]) { seen[k] = 1; q.push(k); } }
  while (q.length) { const k = q.pop(), i = k % gw, j = (k - i) / gw; for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const ii = i + di, jj = j + dj; if (ii < 0 || jj < 0 || ii >= gw || jj >= gh) continue; const kk = jj * gw + ii; if (free[kk] && !seen[kk]) { seen[kk] = 1; q.push(kk); } } }
  let lost = 0; for (let k = 0; k < free.length; k++) if (free[k] && !seen[k]) lost++;
  return { lost, at: (x, y) => seen[Math.floor(y / S) * gw + Math.floor(x / S)] === 1 };
}
function checkCity(D, P, sim) {
  const out = [], W = P['world.width'], H = P['world.height'], R = P['body.radius'], id = D.levelId, dp = (f) => P['world.district.' + id + '.' + f];
  const name = (c) => 'ABC'[c[0]] + (c[1] + 1);
  if (new Set(D.path.map((c) => c.join())).size !== D.cols * D.rows) out.push('road misses a screen');
  let deckCells = 0;
  for (let y = 0; y < D.rows; y++) for (let x = 0; x < D.cols; x++) {
    const lv = sim.cellLevel(D, [x, y], P), tag = id + ' ' + name([x, y]);
    const blocks = lv.statics.filter((q) => q.kind === 'block'), share = blocks.reduce((n, q) => n + q.w * q.h, 0) / (W * H);
    if (share < dp('blockShare') - 0.08 || share > P['world.occludedFractionMax']) out.push(tag + ' blocks ' + share.toFixed(3));
    if (lv.spawns.length < 3) out.push(tag + ' spawns ' + lv.spawns.length);
    const rc = reach(lv, R, W, H);
    if (rc.lost) out.push(tag + ' walled-off ground ' + rc.lost);
    for (const sd of ['N', 'E', 'S', 'W']) {
      const nx = x + { N: 0, E: 1, S: 0, W: -1 }[sd], ny = y + { N: -1, E: 0, S: 1, W: 0 }[sd];
      if (nx < 0 || ny < 0 || nx >= D.cols || ny >= D.rows) continue;
      if (!(lv.gates[sd] || []).length) out.push(tag + ' no gate ' + sd);
      for (const [a, b] of lv.gates[sd] || []) {
        const m = (a + b) / 2, px = sd === 'W' ? R + 2 : sd === 'E' ? W - R - 2 : m, py = sd === 'N' ? R + 2 : sd === 'S' ? H - R - 2 : m;
        if (!rc.at(px, py)) out.push(tag + ' gate ' + sd + ' unreachable');
      }
    }
    const tiles = lv.patches.filter((p) => p.kind === 'puddle').reduce((n, p) => n + p.w * p.h / 1024, 0);
    if (tiles !== Math.round(dp('puddleShare') * 25 * 19)) out.push(tag + ' puddle tiles ' + tiles);
    if (lv.focal) {
      const ok = lv.focal === 'roundabout' ? lv.patches.some((p) => p.kind === 'matting') : lv.focal === 'plate' ? lv.patches.filter((p) => p.kind === 'plate').length >= 2
        : lv.statics.some((q) => q.landmark === lv.focal);
      if (!ok) out.push(tag + ' landmark missing: ' + lv.focal);
    }
    if ((lv.decks || []).length) { deckCells++; if (!lv.statics.some((q) => q.deck)) out.push(tag + ' flyover without pillars'); }
  }
  if (deckCells < Math.round(dp('decks')) * 3 - (dp('decks') >= 2 ? 1 : 0)) out.push(id + ' flyover screens ' + deckCells);
  return out;
}
// Start-screen bot (automated, not human evidence): walks to the nearest reachable verge, reads approaching cars, dashes
// when lined up. Returns write-offs and time on the start screen at the given health. Used to keep only playable starts.
function startBot(sim, D, overrides, secs) {
  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const s = new sim.Sim(D.levelId, Object.assign({ 'proto.layout': 1 }, overrides || {}));
  s.district = D; D.cur = D.start.slice(); s.level = sim.cellLevel(D, D.start, s.P); s.reset();
  s.checkFlip = () => {}; // the bot stays on the start screen
  const clearLine = (x0, y0, x1, y1) => { for (let t = 0; t <= 1; t += 0.02) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; if (s.level.statics.some((st) => x > st.x - 15 && x < st.x + st.w + 15 && y > st.y - 15 && y < st.y + st.h + 15)) return false; } return true; };
  const homeOf = () => {
    const b = s.body, L = s.level.lanes[0]; let best = null;
    for (let q = 0; q <= L.length; q += 16) { const p = sim.pathAt(L, q); for (const side of [-1, 1]) { const x = p.x + p.nx * side * 90, y = p.y + p.ny * side * 90; if (x < 30 || y < 60 || x > 770 || y > 570 || !clearLine(b.x, b.y, x, y)) continue; const d = Math.hypot(x - b.x, y - b.y); if (!best || d < best.d) best = { x, y, d }; } }
    return best || { x: b.x, y: b.y };
  };
  let home = homeOf(), first = null;
  for (let i = 0; i < secs * 60; i++) {
    if (s.phase === 'report') s.continueReport();
    if (s.phase === 'shop') { s.leaveShop(); home = homeOf(); }
    if (s.phase === 'ending' || s.phase === 'next') break;
    const b = s.body; let cmd = {};
    if (b.alive) {
      let best = null;
      for (const c of s.cars) { if (c.spent) continue; const tx = c.x + c.vx * 0.12, ty = c.y + c.vy * 0.12, d = Math.hypot(tx - b.x, ty - b.y); if (d < 150 && (!best || d < best.d)) best = { tx, ty, d }; }
      if (!best) { const dx = home.x - b.x, dy = home.y - b.y, d = Math.hypot(dx, dy); cmd = d > 6 ? { mx: dx / d, my: dy / d } : {}; }
      else { const ang = Math.atan2(best.ty - b.y, best.tx - b.x), off = Math.abs(wrap(ang - b.facing)); cmd = { mx: Math.cos(ang) * 0.35, my: Math.sin(ang) * 0.35, aPress: off < 12 * Math.PI / 180 && b.mode !== 'lunge' && b.mode !== 'recover' }; }
    }
    s.step(cmd);
    if (first == null && s.run.writeOffs > 0) first = +s.t.toFixed(1);
  }
  return { writeOffs: s.run.writeOffs, firstWriteOff: first, t: +s.t.toFixed(1), impacts: s.events.filter((e) => e.type === 'impact').length };
}
module.exports = { checkCity, startBot, reach, rdist };
