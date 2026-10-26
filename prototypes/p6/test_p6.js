// P6 (GDD Edit 62) headless checks: the three districts build, their traffic links and keeps moving, every flight lands on a
// floor, the dummy climbs, crosses screens on a floor, drops, enters the tunnel to the top edge, is rescued from the river,
// scores a hit, and the shift's clock ends a run. Run: node test_p6.js [minutes of traffic per district, default 5]
'use strict';
const W6 = require('./world6.js');
const X = require('./sim.js');
const PIX = globalThis.PIX;
const P = Object.assign({}, X.REG, X.PROTO, X.OVERRIDES), W = P['world.width'], H = P['world.height'], R = P['body.radius'];
const MIN = +(process.argv[2] || 5);
let pass = 0, fail = 0;
const ok = (c, msg) => { if (c) pass++; else fail++; console.log((c ? 'PASS ' : 'FAIL ') + msg); };
const place = (s, scn, x, y, lv, fl) => { s.enter(s.W6.at('ABC'.indexOf(scn[0]), +scn[1] - 1)); Object.assign(s.body, { x, y, px: x, py: y, level: lv || 0, floor: fl == null ? null : fl, stair: null, drop: null, mode: 'idle', vx: 0, vy: 0, lunge: null }); s.buildView(); };
const empty = (s) => { for (const sm of s.W6.sims) { sm.cars.length = 0; sm.slot = sm.schedule.length; sm.deckNext = { 0: 1e9, 1: 1e9, 2: 1e9, 3: 1e9 }; } s.buildView(); };
function walk(s, x, y, secs, stop) {
  for (let k = 0; k < secs * 60; k++) {
    if (stop && stop(s)) return true;
    const b = s.body, dx = x - b.x, dy = y - b.y, l = Math.hypot(dx, dy);
    if (!stop && l < 4) return true;
    s.step({ mx: dx / (l || 1), my: dy / (l || 1) });
    while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({});
  }
  return !!(stop && stop(s));
}
const kind = (s) => { const f = s.floorOf(); return f ? f.kind : null; };

// 1. polygon masks match the plan's polygons
{
  const V = require('./circus_valley.js'), poly = V.geo.NORTH_POLY;
  const D = W6.DISTRICTS.find((d) => d.id === 'waterfront'), sc = W6.buildScreen(D, 1, 0), hill = sc.game.floors.find((f) => f.kind === 'hill');
  let bad = 0, n = 0;
  for (let y = 1; y < H; y += 7) for (let x = 1; x < W; x += 7) { n++; if (hill.has(x, y) !== PIX.inPoly(sc.floorsX[0].poly, x, y)) bad++; }
  ok(bad === 0 && poly.length > 3, `hill floor test matches the plan polygon (${n} points, ${bad} off)`);
}

// 2. each district: build, edges, links, every flight lands, spawns, traffic over MIN minutes
const SIDE = X.SIDE, OPP = { N: 'S', S: 'N', E: 'W', W: 'E' }, horizE = (sd) => sd === 'N' || sd === 'S';
function edgeAudit(w) { // every edge point the dummy can reach is crossable, or shows a barrier, booth or boom
  let bad = [], open = 0, n = 0;
  for (const sc of w.scs) for (const sd of ['N', 'E', 'S', 'W']) {
    const nb = w.at(sc.col + SIDE[sd][0], sc.row + SIDE[sd][1]), len = horizE(sd) ? W : H, g = sc.game;
    for (let v = 24; v < len - 24; v += 6) { // corners: within a body of a perpendicular edge, two edges meet
      const [x, y] = W6.edgePt(sd, v, R + 1);
      if (W6.groundFree(sc, x, y) && !g.water.some((p) => PIX.inPoly(p, x, y)) && !g.checkpoints.some((cp) => !cp.deck && !cp.z && W6.inR(W6.cpZone(cp), x, y, R))) {
        n++; const [qx, qy] = W6.edgePt(OPP[sd], v, R + 1), tunnel = sc.hillLayer && sc.hillLayer.inBand(x, y);
        if ((nb && W6.groundFree(nb, qx, qy, 0)) || tunnel) open++; else bad.push(sc.name + sd + Math.round(v));
      }
      const [ex, ey] = W6.edgePt(sd, v, 1);
      for (const f of g.floors) if (f.z && f.has(x, y) && f.has(ex, ey)) { // a floor that ends short of the edge drops or holds in view
        n++; const [qx, qy] = W6.edgePt(OPP[sd], v, R + 1);
        const held = (nb && nb.game.floors.some((q) => q.z === f.z && q.has(qx, qy))) || g.solidsZ.some((q) => q.z === f.z && W6.inR(q, x, y, R)) || g.checkpoints.some((cp) => (cp.z || 0) === f.z && W6.inR(W6.cpZone(cp), x, y, R));
        if (!held) bad.push(sc.name + sd + Math.round(v) + 'z' + f.z + f.kind);
      }
    }
  }
  return { bad, open, n };
}
for (const id of W6.LEVEL_LIST) {
  const t0 = Date.now(), w = W6.buildWorld(id), tb = Date.now() - t0;
  ok(W6.DISTRICTS.find((d) => d.id === id).start[0] === 'B2', `${id}: starts in the centre tile, B2`);
  const ea = edgeAudit(w);
  ok(ea.bad.length === 0, `${id}: no invisible walls: ${ea.n} edge points reachable, ${ea.open} cross, the rest show a barrier, booth or boom${ea.bad.length ? ' (unmarked: ' + ea.bad.slice(0, 8).join(', ') + ')' : ''}`);
  ok(w.scs.length === 9, `${id}: nine screens built in ${tb} ms (with ${P['traffic.warmSeconds']} s warm-up)`);
  const links = w.recs.filter((r) => r.next.length).length, entries = w.recs.filter((r) => !r.prev.length && r.ends.in).length;
  ok(links > 10 && w.crossings > 0, `${id}: ${links} lanes continue next door; ${entries} enter; ${w.crossings} seam crossings while warming`);
  const dead = w.scs.reduce((a, sc) => a + sc.game.statics.filter((q) => q.kind === 'stair').length, 0), flights = w.scs.reduce((a, sc) => a + sc.game.stairs.length, 0);
  ok(dead === 0, `${id}: ${flights} flights, every head on a floor`);
  ok(w.scs.every((sc) => sc.game.spawns.length > 0), `${id}: a spawn on every screen`);
  const T = Math.round(Math.max(3, MIN) * 60 * 60), act = w.at(1, 1), away = { alive: true, x: -9999, y: -9999, vx: 0, vy: 0, level: 9, floor: null, stair: null, mode: 'idle', parts: null, facing: 0 };
  let maxStop = 0, who = null; const cr0 = w.crossings, occ = new Map();
  for (let k = 0; k < T; k++) {
    W6.stepWorld(w, away, act);
    if (k % 60 === 0) {
      for (const s of w.sims) for (const c of s.cars) if ((c.stopT || 0) > maxStop) { maxStop = c.stopT; who = c.id + ' @ ' + c.sim.sc.name; }
      for (const sc of w.scs) { const F = sc.flow.get('street0'); if (!F || F.target < 1) continue; let n = 0; for (const s of sc.sims) for (const c of s.cars) if (!(c.elev || 0)) n++; const a = occ.get(sc.name) || []; a.push(n); occ.set(sc.name, a); }
    }
  }
  let cars = 0; for (const s of w.sims) cars += s.cars.length;
  const tiles = [...occ.entries()].map(([nm, a]) => { a = a.slice(30); const m = a.reduce((x, y) => x + y, 0) / a.length, sd = Math.sqrt(a.reduce((x, y) => x + (y - m) ** 2, 0) / a.length); return { nm, m, cv: sd / (m || 1), empty: a.filter((v) => !v).length / a.length }; });
  const worstEmpty = Math.max(...tiles.map((q) => q.empty)), worstCV = Math.max(...tiles.map((q) => q.cv));
  ok(maxStop < 30 && worstEmpty < 0.2 && worstCV < 0.7 && w.crossings > cr0, `${id}: ${Math.max(3, MIN)} min of managed traffic (player in B2): ${cars} cars; street tiles never empty over ${(worstEmpty * 100).toFixed(0)}% of the time; count CV ≤ ${(worstCV * 100).toFixed(0)}%; ${w.culled} stuck cars culled off-screen; longest stop ${maxStop.toFixed(1)} s${who ? ' (' + who + ')' : ''}`);
}

// 3. the dummy on the P6 world
{
  const s = new W6.Sim6('parkland', {}, null, { warm: 2 }); empty(s);
  place(s, 'A1', 100, 100); const st = s.level.stairs[0]; place(s, 'A1', st.x + st.w / 2, st.low - 20);
  walk(s, st.x + st.w / 2, st.high + 30, 6);
  ok(s.body.level === 1 && kind(s) === 'walk', 'Parkland A1: up the escalator onto the Z1 walkway');
  walk(s, 900, 320, 10, (q) => q.screenName() === 'C1');
  ok(s.screenName() === 'C1' && s.body.level === 1 && kind(s) === 'walk', 'Parkland: along the walkway across the B1 highway into C1 (two screen flips at Z1)');
  const wl = s.sc.walk, gap = wl.spines[0].gaps[0], gp = X.pathAt(wl.spines[0].path, (gap[0] + gap[1]) / 2);
  walk(s, gp.x + 40, 320, 4); walk(s, gp.x + 40, 250, 2, (q) => q.body.level === 0); const held = s.body.level === 1;
  walk(s, gp.x, 320, 4); walk(s, gp.x, 250, 3, (q) => q.body.level === 0 && q.body.mode !== 'drop');
  ok(held && s.body.level === 0, `Parkland C1: the walkway's parapet holds; its broken parapet over the avenue (x ${gp.x.toFixed(0)}) drops the dummy to the street`);
  place(s, 'B2', 80, 260); const e = s.level.stairs.find((q) => q.y < 300); place(s, 'B2', e.x + e.w / 2, e.low - 20); walk(s, e.x + e.w / 2, e.high + 40, 6);
  walk(s, -100, 356, 10, (q) => q.screenName() === 'A2');
  ok(s.screenName() === 'A2' && kind(s) === 'deck' && s.body.level === 1, 'Parkland B2: up to the ring, west along its arm onto the A2 highway');
}
{
  const s = new W6.Sim6('waterfront', {}, null, { warm: 2 }); empty(s);
  place(s, 'B1', 430, 420); walk(s, 430, -60, 6);
  ok(s.screenName() === 'B1' && s.body.y <= R + 1 && s.body.level === 0, `Waterfront B1: into the tunnel; stops at the top edge (y ${s.body.y.toFixed(0)}), not the mouth (y 360)`);
  place(s, 'B1', 300, 420); walk(s, 300, -60, 4);
  ok(s.body.y > 355, `Waterfront B1: beside the tunnel the cove head wall holds (y ${s.body.y.toFixed(0)})`);
  const g = s.W6.at(0, 1).game, st = g.stairs.find((q) => g.floors[q.head].kind === 'hill');
  place(s, 'A2', st.x + st.w / 2, st.low + 20); walk(s, st.x + st.w / 2, st.high - 40, 8);
  ok(s.body.level === 1 && kind(s) === 'hill', 'Waterfront A2: up the cliff escalator onto the hill');
  walk(s, s.body.x + 150, s.body.y + 300, 4, (q) => q.body.level === 0 && q.body.mode !== 'drop');
  ok(s.body.level === 0, 'Waterfront A2: off the cliff edge, down to the valley');
  const deck = s.W6.at(0, 1).game.floors.findIndex((f) => f.kind === 'deck');
  place(s, 'A2', 400, 300, 1, deck); walk(s, 400, 316, 2); walk(s, 200, 316, 3, (q) => q.body.level === 0 && q.body.mode !== 'drop');
  ok(s.body.level === 0, 'Waterfront A2: through the bridge\'s broken parapet, down to the avenue');
  place(s, 'A3', 250, 330); const T0 = s.t;
  walk(s, 250, 400, 2, (q) => q.body.mode === 'rescue');
  const d0 = s.rescue ? s.rescue.to.d : 0;
  walk(s, 250, 0, 10, (q) => q.body.mode !== 'rescue');
  const T = s.t - T0, spec = P['proto.rescueSinkSeconds'] + 2 * P['proto.droneLiftSeconds'] + d0 / P['proto.droneSpeed'], lane = !s.sc.roadOk(s.body.x, s.body.y, P['world.laneWidth']);
  ok(s.body.mode !== 'rescue' && !s.level.water.some((p) => PIX.inPoly(p, s.body.x, s.body.y)) && !lane && T > spec, `Waterfront A3: into the river; sinks ${P['proto.rescueSinkSeconds']} s, the drone flies in from the edge, lifts and sets the dummy on land, off the lanes: ${T.toFixed(2)} s (sink, lifts and carry alone ${spec.toFixed(2)} s; ${d0.toFixed(0)} units)`);
}
{ // a dash into a car scores
  const s = new W6.Sim6('monument', {}, null, { warm: 8 });
  let hit = false;
  for (let k = 0; k < 60 * 60 && !hit; k++) {
    const b = s.body, near = s.cars.filter((c) => (c.elev || 0) === 0 && !c.spent).sort((a, c) => Math.hypot(a.x - b.x, a.y - b.y) - Math.hypot(c.x - b.x, c.y - b.y))[0];
    if (near) { const dx = near.x - b.x, dy = near.y - b.y, l = Math.hypot(dx, dy); s.step({ mx: dx / l, my: dy / l, aPress: l < 90 }); } else s.step({});
    while (s.phase === 'hitstop' || s.phase === 'scroll') s.step({});
    hit = s.events.some((e) => e.type === 'impact');
  }
  ok(hit && s.run.points > 0, `Monument: the dummy dashes into a car and scores (${Math.round(s.run.points)} points)`);
}
{ // the shift's clock: a short shift ends in a Failed test once its cars are gone
  const s = new W6.Sim6('monument', { 'run.appearances.road': 4 }, null, { warm: 4 });
  place(s, 'B2', 400, 140, 1, s.W6.at(1, 1).game.floors.findIndex((f) => f.kind === 'walk')); // out of the way, on the walkway ring
  for (let k = 0; k < 60 * 60 * 6 && s.phase === 'play'; k++) { s.step({}); while (s.phase === 'scroll' || s.phase === 'hitstop') s.step({}); }
  ok(s.run.ending && s.run.ending.kind === 'Failed test', `Monument: a 4-car shift ends in a Failed test (${s.run.ending ? s.run.ending.kind : 'still ' + s.phase}, admitted ${s.W6.admitted})`);
}
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
