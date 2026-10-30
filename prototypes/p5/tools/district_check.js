// City district contract (GDD Edit 41 §7.9 clauses 11–17; Edit 42 clauses 18–20; Edit 43 clauses 17 and 21; Edit 44 clauses 20 and 22; Edit 48 clauses 23–24; P4 test, Edit 49: clauses 25–26). Used by the baking tool and by test_sim.js.
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
    const clip = (q) => ({ x: Math.max(0, q.x), y: Math.max(0, q.y), w: Math.min(W, q.x + q.w) - Math.max(0, q.x), h: Math.min(H, q.y + q.h) - Math.max(0, q.y) }); // Edit 48: a straddling building counts on-screen only
    const blocks = lv.statics.filter((q) => q.kind === 'block').map(clip).filter((q) => q.w > 0 && q.h > 0), built = blocks.reduce((n, q) => n + q.w * q.h, 0);
    const open = sim.buildableArea(lv.center, lv.ring, lv.decks, lv.statics, P), share = built / Math.max(1, open); // Edit 43: share of buildable ground
    if ((open >= 0.2 * W * H && share < dp('blockShare') - 0.15) || built / (W * H) > P['world.occludedFractionMax']) out.push(tag + ' blocks ' + share.toFixed(3) + ' of buildable');
    if (lv.spawns.length < 3) out.push(tag + ' spawns ' + lv.spawns.length);
    // stair sides and checkpoint zones stop the dummy on the ground (Edit 42)
    const ground = { statics: lv.statics.concat((lv.stairs || []).map((q) => ({ x: q.x, y: q.y, w: q.w, h: q.h })), (lv.checkpoints || []).filter((cp) => !cp.deck).map((cp) => sim.checkZone(cp, P, W, H))), spawns: lv.spawns };
    const rc = reach(ground, R, W, H);
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
    if (tiles !== Math.round(dp('puddleShare') * Math.ceil(W / P['world.tileSize']) * Math.ceil(H / P['world.tileSize']))) out.push(tag + ' puddle tiles ' + tiles);
    if (lv.focal) {
      const ok = lv.focal === 'roundabout' ? lv.patches.some((p) => p.kind === 'matting') : lv.focal === 'plate' ? lv.patches.filter((p) => p.kind === 'plate').length >= 2
        : lv.statics.some((q) => q.landmark === lv.focal);
      if (!ok) out.push(tag + ' landmark missing: ' + lv.focal);
    }
    if ((lv.decks || []).length) {
      deckCells++;
      if (!lv.statics.some((q) => q.deck)) out.push(tag + ' flyover without pillars');
      for (const dk of lv.decks) if (!sim.deckCrossOK(lv.center, dk, P, W, H) || (lv.ring && !sim.deckCrossOK(lv.ring, dk, P, W, H))) out.push(tag + ' a road under a flyover is not square'); // clause 17 (Edit 43: perpendicular)
    }
    // 21. Buildings (Edit 43): none nearer a road than the frontage setback; heights in whole storeys
    const front = P['world.laneWidth'] + P['proto.shoulderWidth'] + P['world.buildingSetback'], dist = sim.roadDist(lv.center), st = P['world.storeyHeight'];
    for (const b of lv.statics.filter((q) => q.kind === 'block').map((q) => Object.assign({}, q, clip(q)))) {
      if (b.landmark) continue;
      let m = Infinity; for (let i = 0; i <= 4; i++) for (let j = 0; j <= 4; j++) m = Math.min(m, dist(b.x + b.w * i / 4, b.y + b.h * j / 4));
      if (m < front - 1.5) { out.push(tag + ' building inside the setback (' + m.toFixed(0) + ')'); break; }
      if (Math.abs(b.height / st - Math.round(b.height / st)) > 1e-6) { out.push(tag + ' building height not whole storeys'); break; }
    }
    // 23. Shared edges (Edit 48): a building at a shared edge straddles it, world.edgeOverlap into each screen, the same building on both
    const E = P['world.edgeOverlap'];
    for (const sd of ['E', 'S']) {
      const nx = x + (sd === 'E' ? 1 : 0), ny = y + (sd === 'S' ? 1 : 0);
      if (nx >= D.cols || ny >= D.rows) continue;
      const nb = sim.cellLevel(D, [nx, ny], P), hz = sd === 'E', L = hz ? W : H;
      const touch = (lvX, near) => lvX.statics.filter((q) => q.kind === 'block' && (hz ? (near ? q.x + q.w >= L - 0.5 && q.x < L : q.x <= 0.5 && q.x + q.w > 0) : (near ? q.y + q.h >= L - 0.5 && q.y < L : q.y <= 0.5 && q.y + q.h > 0)));
      for (const [q, other, near] of touch(lv, true).map((q) => [q, nb, true]).concat(touch(nb, false).map((q) => [q, lv, false]))) {
        const a0 = hz ? q.x : q.y, a1 = a0 + (hz ? q.w : q.h), inside = near ? L - a0 : a1, beyond = near ? a1 - L : -a0;
        const twin = other.statics.some((o) => o.kind === 'block' && Math.abs((hz ? o.x : o.y) - (near ? a0 - L : a0 + L)) < 0.5 && Math.abs(o.w - q.w) < 0.5 && Math.abs(o.h - q.h) < 0.5 && Math.abs((hz ? o.y : o.x) - (hz ? q.y : q.x)) < 0.5);
        if (inside < E - 0.5 || beyond < E - 0.5 || !twin) { out.push(tag + ' building at the ' + sd + ' edge does not straddle it'); break; }
      }
    }
    // 24. Deck clearance (Edit 48): the drawn deck stands world.deckTopClear below the top edge
    for (const dk of lv.decks || []) if (dk.hz && dk.off - P['world.deckWidth'] / 2 - Math.round(dk.height * P['proto.art.extrusion'] / P['ui.artScale']) * P['ui.artScale'] < P['world.deckTopClear']) out.push(tag + ' flyover drawn within world.deckTopClear of the top edge');
    // 25. Bends (P4, Edit 49): no lane bends tighter than world.turnRadiusTight less half a lane (36), measured on screen (10% polyline tolerance)
    const lmin = 0.9 * (P['world.turnRadiusTight'] - P['world.laneWidth'] / 2);
    for (const ln of lv.lanes) { const r = laneRadius(ln.pts, W, H); if (r < lmin) { out.push(tag + ' lane bend radius ' + r.toFixed(1)); break; } }
    // 26. Traffic (P4, Edit 49): 60 s of the district's traffic with the dummy away; no car jams
    const jam = soak(sim, lv, P, id, 60);
    if (jam) out.push(tag + ' traffic jams at ' + jam + ' s');
    // 18. Bounded: every outer edge is wall or river; a road leaves through a checkpoint
    const cell = D.cells[y][x], outerRoads = (cell.ends || []).filter((e) => e.outer), cps = lv.checkpoints || [];
    if (cps.filter((cp) => !cp.deck).length !== outerRoads.length) out.push(tag + ' checkpoints ' + cps.length + ' for ' + outerRoads.length + ' road exits');
    for (const dk of lv.decks || []) for (const sd of dk.hz ? ['W', 'E'] : ['N', 'S']) {
      const nx = x + { N: 0, E: 1, S: 0, W: -1 }[sd], ny = y + { N: -1, E: 0, S: 1, W: 0 }[sd];
      if ((nx < 0 || ny < 0 || nx >= D.cols || ny >= D.rows) && !cps.some((cp) => cp.deck && cp.side === sd && cp.off === dk.off)) out.push(tag + ' flyover leaves without a checkpoint');
    }
    for (const sd of ['N', 'E', 'S', 'W']) {
      const nx = x + { N: 0, E: 1, S: 0, W: -1 }[sd], ny = y + { N: -1, E: 0, S: 1, W: 0 }[sd];
      if (nx >= 0 && ny >= 0 && nx < D.cols && ny < D.rows) continue;
      const len = sd === 'E' || sd === 'W' ? H : W, zones = (lv.checkpoints || []).filter((cp) => cp.side === sd && !cp.deck).map((cp) => sim.checkZone(cp, P, W, H));
      for (let v = 4; v < len; v += 8) {
        const px = sd === 'W' ? 4 : sd === 'E' ? W - 4 : v, py = sd === 'N' ? 4 : sd === 'S' ? H - 4 : v;
        if (!lv.statics.some((q) => (q.kind === 'wall' || q.kind === 'river') && rdist(px, py, q) === 0) && !zones.some((q) => rdist(px, py, q) === 0)) { out.push(tag + ' open district edge ' + sd + ' at ' + v); break; }
      }
    }
    // 19. Stairs: each ground foot is reachable (a link stair's foot stands on its deck)
    for (const st of lv.stairs || []) {
      if (st.foot != null) { if (!lv.floors[st.foot] || lv.floors[st.foot].z !== st.from) out.push(tag + ' link stair off its deck'); continue; }
      const sg = Math.sign(st.low - st.high), fx = st.axis === 'y' ? st.x + st.w / 2 : st.low + sg * (R + 4), fy = st.axis === 'y' ? st.low + sg * (R + 4) : st.y + st.h / 2;
      if (!rc.at(fx, fy)) out.push(tag + ' stair foot unreachable');
    }
    for (const dk of lv.decks || []) for (const [a0, a1] of dk.gaps) if (a1 - a0 < 2 * R) out.push(tag + ' parapet gap too narrow');
    // 22. Platforms (Edit 44): every roof is reached by a stair or a skybridge chain; skybridges join two roofs; ledges drop to open ground
    const fl = lv.floors || [], roofs = fl.map((f, i) => i).filter((i) => fl[i].kind === 'roof'), live = new Set((lv.stairs || []).map((st) => st.head));
    const touch = (b, f) => b.x < f.x + f.w && b.x + b.w > f.x && b.y < f.y + f.h && b.y + b.h > f.y;
    for (const b of fl.filter((f) => f.kind === 'bridge')) if (roofs.filter((i) => touch(b, fl[i])).length !== 2) out.push(tag + ' skybridge joins ' + roofs.filter((i) => touch(b, fl[i])).length + ' roofs');
    for (let n = 0; n < 4; n++) for (const b of fl.filter((f) => f.kind === 'bridge')) { const ends = roofs.filter((i) => touch(b, fl[i])); if (ends.some((i) => live.has(i))) ends.forEach((i) => live.add(i)); }
    for (const i of roofs) {
      const f = fl[i];
      if (f.z !== 2) out.push(tag + ' roof not at Z2');
      if (!live.has(i)) out.push(tag + ' roof unreachable');
      for (const lg of f.ledges) {
        const ok = [0.1, 0.3, 0.5, 0.7, 0.9].some((u) => { const m = lg.a0 + (lg.a1 - lg.a0) * u, px = lg.side === 'W' ? f.bx - R - 6 : lg.side === 'E' ? f.bx + f.bw + R + 6 : m, py = lg.side === 'N' ? f.by - R - 6 : lg.side === 'S' ? f.by + f.bh + R + 6 : m; return rc.at(px, py); });
        if (!ok) { out.push(tag + ' roof ledge drops onto no open ground'); break; }
      }
    }
  }
  if (deckCells < Math.round(dp('decks')) * 3 - (dp('decks') >= 2 ? 1 : 0)) out.push(id + ' flyover screens ' + deckCells);
  // 20. Levels (Edit 44): world.district.<id>.highDecks of the flyovers run at Z2, the rest at Z1
  if ((D.decks || []).filter((q) => q.z === 2).length !== Math.round(dp('highDecks') || 0) || (D.decks || []).some((q) => q.z !== 1 && q.z !== 2)) out.push(id + ' high highways ' + (D.decks || []).filter((q) => q.z === 2).length);
  // 19. Every flyover has a stair up from the ground and a broken parapet somewhere along it
  for (const dk of D.decks || []) {
    const line = D.cells.flat().filter((q) => (dk.hz ? q.cell[1] : q.cell[0]) === dk.line).map((q) => sim.cellLevel(D, q.cell, P));
    const k = (lv) => (lv.decks || []).findIndex((q) => q.hz === dk.hz && q.off === dk.off);
    if (!line.some((lv) => (lv.stairs || []).some((st) => st.from === 0 && st.foot == null && st.deck === k(lv) && st.to === dk.z))) out.push(id + ' flyover ' + dk.line + ' has no stair');
    if (!line.some((lv) => k(lv) >= 0 && lv.decks[k(lv)].gaps.length)) out.push(id + ' flyover ' + dk.line + ' has no drop point');
  }
  return out;
}
// Start-screen bot (automated, not human evidence): walks to the nearest reachable verge, reads approaching cars, dashes
// when lined up. Returns write-offs and time on the start screen at the given health. Used to keep only playable starts.
// smallest 3-point bend radius of a lane polyline on the screen
function laneRadius(pts, W, H) {
  let m = Infinity;
  for (let i = 1; i + 1 < pts.length; i++) {
    const [x, y] = pts[i]; if (x < -40 || y < -40 || x > W + 40 || y > H + 40) continue;
    const p0 = pts[i - 1], p2 = pts[i + 1], A = Math.hypot(x - p0[0], y - p0[1]), B = Math.hypot(p2[0] - x, p2[1] - y), C = Math.hypot(p2[0] - p0[0], p2[1] - p0[1]);
    const cr = Math.abs((x - p0[0]) * (p2[1] - p0[1]) - (y - p0[1]) * (p2[0] - p0[0]));
    if (cr > 1e-6) m = Math.min(m, A * B * C / (2 * cr));
  }
  return m;
}
// One screen's traffic alone: ground cars by the district's mix and interval, deck traffic running. Returns the first jam time or null.
function soak(sim, lv, P, id, secs) {
  const s = new sim.Sim('straight', { 'run.appearances.road': 400 });
  s.level = lv; s.cones = []; s.cars = []; s.drones = []; s.booms = {}; s.checkTerminal = () => {}; s.checkFlip = () => {};
  const vs = P['world.district.' + id + '.vanShare'], iv = P['world.district.' + id + '.interval'];
  let k = 1;
  const rnd = () => { k = (k * 16807) % 2147483647; return k / 2147483647; };
  s.schedule = Array.from({ length: 400 }, (_, i) => ({ i, cls: rnd() < vs ? 'van' : 'sedan', lane: rnd() < 0.5 ? 0 : 1, mult: 0.8 + 0.4 * rnd() }));
  s.admissionInterval = () => iv; s.isCity = false; s.fillDeckCars();
  Object.assign(s.body, { x: -900, y: -900 });
  const T = P['traffic.gridlockSeconds'];
  for (let i = 0; i < secs * 60; i++) {
    s.step({}); s.body.x = -900; s.body.y = -900; s.events = [];
    if (i % 30) continue;
    if (s.cars.some((c) => (c.stopT || 0) >= T && ['cycle', 'none'].includes(s.jamCause(c, new Set([c]))))) return +s.t.toFixed(1);
  }
  return null;
}
function startBot(sim, D, overrides, secs) {
  const wrap = (a) => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const s = new sim.Sim(D.levelId, Object.assign({ 'proto.layout': 1 }, overrides || {}));
  const W = s.P['world.width'], H = s.P['world.height'];
  s.district = D; D.cur = D.start.slice(); s.level = sim.cellLevel(D, D.start, s.P); s.reset();
  s.checkFlip = () => {}; s.enterStair = () => false; // the bot stays on the start screen, on the ground (Edit 44: stairs lead to roofs)
  const clearLine = (x0, y0, x1, y1) => { for (let t = 0; t <= 1; t += 0.02) { const x = x0 + (x1 - x0) * t, y = y0 + (y1 - y0) * t; if (s.level.statics.some((st) => x > st.x - 15 && x < st.x + st.w + 15 && y > st.y - 15 && y < st.y + st.h + 15)) return false; } return true; };
  const homeOf = () => {
    const b = s.body, L = s.level.lanes[0]; let best = null;
    for (let q = 0; q <= L.length; q += 16) { const p = sim.pathAt(L, q); for (const side of [-1, 1]) { const x = p.x + p.nx * side * 90, y = p.y + p.ny * side * 90; if (x < 30 || y < 60 || x > W - 30 || y > H - 30 || !clearLine(b.x, b.y, x, y)) continue; const d = Math.hypot(x - b.x, y - b.y); if (!best || d < best.d) best = { x, y, d }; } }
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
module.exports = { checkCity, startBot, reach, rdist, soak, laneRadius };
